// An analytic light field: no textures, noise animation, external services or 3D library.
const vertex = `attribute vec2 position;
void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float grainAmount;
uniform float grainSize;
uniform float pixelScale;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=gl_FragCoord.xy/resolution;
  float aspect=resolution.x/resolution.y;
  // Preserve the reference proportions and lock the centre on every screen.
  vec2 p=(uv-.5)*vec2(max(aspect/(2876./1580.),1.),max((2876./1580.)/aspect,1.));
  float y=abs(p.y);
  float phase=time*6.2831853/24.;
  float width=.100+.205*pow(y*2.,1.75);
  float d=width-abs(p.x);
  float softness=.004+.025*pow(clamp(y*2.,0.,1.),2.);
  float body=smoothstep(-softness,softness,d);
  float halo=exp(-pow(d/(softness*3.),2.))*.018;
  float wedge=exp(-pow(p.x/(.025+.23*y),2.))*smoothstep(.10,.51,y);
  float falloff=1.-smoothstep(.12,.66,y);
  float light=.86*body*(1.-.96*wedge)*falloff;
  // Only illumination breathes: silhouette, position and scale are fixed.
  light*=1.+.018*sin(phase)*smoothstep(.04,.36,y);
  float value=.042+light+halo*falloff;
  vec2 cell=floor(gl_FragCoord.xy/max(.5,grainSize*pixelScale));
  float grain=hash(cell)+hash(cell+19.7)-1.;
  value+=grain*grainAmount*(.08+.35*sqrt(max(light,0.)));
  float dither=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))));
  value+=(dither-.5)/255.;
  gl_FragColor=vec4(vec3(clamp(value,0.,1.)),1.);
}`;

export function initHeroLight(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const button = root.querySelector('button')!;
  const controls = root.querySelector<HTMLElement>('[data-noise-controls]');
  const amount = root.querySelector<HTMLInputElement>('[data-grain-amount]');
  const size = root.querySelector<HTMLInputElement>('[data-grain-size]');
  const storageKey = 'xions-hero-grain-v2';
  let grainAmount = .12, grainSize = 1, pixelScale = 1;
  try {
    const saved = controls && JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && Number.isFinite(saved.amount) && Number.isFinite(saved.size)) {
      grainAmount = Math.max(0,Math.min(1,saved.amount));
      grainSize = Math.max(.5,Math.min(4,saved.size));
    }
  } catch { /* Storage is optional. */ }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let gl: WebGLRenderingContext | null = null;
  try { gl = canvas.getContext('webgl', { alpha:false, antialias:false, depth:false, powerPreference:'low-power' }); } catch { return; }
  if (!gl) return; // The SVG is also the no-JavaScript / unsupported-device poster.
  const context = gl;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let timeLocation: WebGLUniformLocation | null = null;
  let resolutionLocation: WebGLUniformLocation | null = null;
  let amountLocation: WebGLUniformLocation | null = null, sizeLocation: WebGLUniformLocation | null = null, scaleLocation: WebGLUniformLocation | null = null;
  let frame = 0, elapsed = 0, previous = 0;
  let visible = true, paused = false, lost = false, disposed = false;

  function setup() {
    const shaders: WebGLShader[] = [];
    for (const [type, source] of [[context.VERTEX_SHADER, vertex], [context.FRAGMENT_SHADER, fragment]] as const) {
      const shader = context.createShader(type);
      if (!shader) return false;
      context.shaderSource(shader, source);
      context.compileShader(shader);
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        context.deleteShader(shader);
        shaders.forEach(s => context.deleteShader(s));
        return false;
      }
      shaders.push(shader);
    }
    program = context.createProgram();
    if (!program) return false;
    shaders.forEach(s => context.attachShader(program!,s));
    context.linkProgram(program);
    shaders.forEach(s => context.deleteShader(s));
    if (!context.getProgramParameter(program,context.LINK_STATUS)) return false;
    context.useProgram(program);
    buffer = context.createBuffer();
    if (!buffer) return false;
    context.bindBuffer(context.ARRAY_BUFFER,buffer);
    context.bufferData(context.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),context.STATIC_DRAW);
    const position = context.getAttribLocation(program,'position');
    context.enableVertexAttribArray(position);
    context.vertexAttribPointer(position,2,context.FLOAT,false,0,0);
    timeLocation=context.getUniformLocation(program,'time');
    resolutionLocation=context.getUniformLocation(program,'resolution');
    amountLocation=context.getUniformLocation(program,'grainAmount');
    sizeLocation=context.getUniformLocation(program,'grainSize');
    scaleLocation=context.getUniformLocation(program,'pixelScale');
    return true;
  }
  function draw() {
    if (lost || disposed) return;
    context.uniform2f(resolutionLocation,canvas.width,canvas.height);
    context.uniform1f(timeLocation,elapsed);
    context.uniform1f(amountLocation,grainAmount);
    context.uniform1f(sizeLocation,grainSize);
    context.uniform1f(scaleLocation,pixelScale);
    context.drawArrays(context.TRIANGLES,0,3);
  }
  function resize() {
    if (lost || disposed) return;
    const {width,height}=root.getBoundingClientRect();
    const scale=Math.min(devicePixelRatio || 1,1.5,1600/Math.max(width,height));
    pixelScale=scale;
    canvas.width=Math.max(1,Math.round(width*scale));
    canvas.height=Math.max(1,Math.round(height*scale));
    context.viewport(0,0,canvas.width,canvas.height);
    draw();
  }
  function tick(now:number) {
    frame=requestAnimationFrame(tick);
    if (!previous) previous=now;
    const delta=now-previous;
    if (delta<1000/30) return;
    elapsed+=Math.min(delta,100)/1000;
    previous=now;
    draw();
  }
  function sync() {
    cancelAnimationFrame(frame);
    previous=0;
    button.hidden=lost || reduced.matches;
    if (!paused && !reduced.matches && visible && !document.hidden && !lost && !disposed) frame=requestAnimationFrame(tick);
  }
  if (!setup()) { context.deleteBuffer(buffer); context.deleteProgram(program); return; }
  root.dataset.ready='true';
  function updateControls() {
    if (!controls || !amount || !size) return;
    amount.value=String(Math.round(grainAmount*100)); size.value=String(grainSize);
    controls.querySelector('output[data-amount-value]')!.textContent=amount.value+'%';
    controls.querySelector('output[data-size-value]')!.textContent=grainSize.toFixed(1)+' px';
    draw();
  }
  const onGrain=()=>{
    grainAmount=Number(amount!.value)/100; grainSize=Number(size!.value);
    updateControls();
    try {localStorage.setItem(storageKey,JSON.stringify({amount:grainAmount,size:grainSize}));} catch {}
  };
  if (controls) {controls.hidden=false;updateControls();amount!.addEventListener('input',onGrain);size!.addEventListener('input',onGrain);}

  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
  observer.observe(root);
  const sizing=new ResizeObserver(resize);
  sizing.observe(root);
  const toggle=()=>{paused=!paused;root.dataset.paused=String(paused);sync();};
  const onLost=(event:Event)=>{event.preventDefault();lost=true;root.dataset.ready='false';sync();};
  const onRestored=()=>{lost=false;if(setup()){root.dataset.ready='true';resize();sync();}else{lost=true;sync();}};
  button.addEventListener('click',toggle);
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  canvas.addEventListener('webglcontextlost',onLost);
  canvas.addEventListener('webglcontextrestored',onRestored);
  resize();sync();
  document.addEventListener('astro:before-swap',()=>{
    amount?.removeEventListener('input',onGrain);size?.removeEventListener('input',onGrain);
    disposed=true;cancelAnimationFrame(frame);observer.disconnect();sizing.disconnect();
    reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);
    button.removeEventListener('click',toggle);canvas.removeEventListener('webglcontextlost',onLost);
    canvas.removeEventListener('webglcontextrestored',onRestored);
    context.deleteBuffer(buffer);context.deleteProgram(program);
  },{once:true});
}
