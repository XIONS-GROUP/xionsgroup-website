// An analytic light field: no textures, noise animation, external services or 3D library.
const vertex = `attribute vec2 position;
void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
uniform vec2 resolution;
uniform float time;
void main(){
  vec2 uv=gl_FragCoord.xy/resolution;
  float portrait=1.-smoothstep(.8,1.3,resolution.x/resolution.y);
  float phase=time*6.2831853/24.;
  float y=uv.y-.49;
  float center=mix(.685,.76,portrait)+.014*sin(phase)+.025*y;
  float width=.045+.39*pow(abs(y)*2.,1.65);
  width+=.009*sin(phase+1.6*y);
  float d=width-abs(uv.x-center);
  float softness=mix(.027,.046,portrait);
  float body=smoothstep(-softness*2.,softness*1.8,d);
  float edge=exp(-pow((d+.006)/softness,2.));
  float halo=exp(-pow(min(d,0.)/(softness*3.2),2.));
  float illumination=.46+.32*uv.y+.06*sin(phase+y*2.);
  float value=.032+body*illumination+edge*.12+halo*.032;
  // Sub-code-value stationary dither prevents visible gradient bands, not a grain layer.
  float dither=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))));
  value+=(dither-.5)/255.;
  gl_FragColor=vec4(vec3(clamp(value,0.,1.)),1.);
}`;

export function initHeroLight(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const button = root.querySelector('button')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let gl: WebGLRenderingContext | null = null;
  try { gl = canvas.getContext('webgl', { alpha:false, antialias:false, depth:false, powerPreference:'low-power' }); } catch { return; }
  if (!gl) return; // The SVG is also the no-JavaScript / unsupported-device poster.
  const context = gl;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let timeLocation: WebGLUniformLocation | null = null;
  let resolutionLocation: WebGLUniformLocation | null = null;
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
    return true;
  }
  function draw() {
    if (lost || disposed) return;
    context.uniform2f(resolutionLocation,canvas.width,canvas.height);
    context.uniform1f(timeLocation,elapsed);
    context.drawArrays(context.TRIANGLES,0,3);
  }
  function resize() {
    if (lost || disposed) return;
    const {width,height}=root.getBoundingClientRect();
    const scale=Math.min(devicePixelRatio || 1,1.5,1600/Math.max(width,height));
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
    disposed=true;cancelAnimationFrame(frame);observer.disconnect();sizing.disconnect();
    reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);
    button.removeEventListener('click',toggle);canvas.removeEventListener('webglcontextlost',onLost);
    canvas.removeEventListener('webglcontextrestored',onRestored);
    context.deleteBuffer(buffer);context.deleteProgram(program);
  },{once:true});
}
