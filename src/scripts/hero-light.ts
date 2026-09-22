import { heroLightDefaults, heroLightTiming, heroLightFlow, heroFrame, normalizeTiming, normalizeFlow, totalDuration } from '../config/hero-light';
// Analytic light on a fixed silhouette; grain never animates.
const vertex = `attribute vec2 position;
void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
uniform vec2 resolution;
uniform float flowTime;
uniform float flowAmount;
uniform float grainAmount;
uniform float grainSize;
uniform float pixelScale;
uniform float artHeight;
uniform float motion;
uniform float formation;
uniform float returning;
uniform float angle;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=gl_FragCoord.xy/resolution;
  // One scale for both axes. Width changes crop, never shrink, the artwork.
  // Rotate in isotropic physical coordinates before applying the reference aspect.
  vec2 physical=(uv-.5)*resolution/artHeight;
  float c=cos(angle),s=sin(angle);
  vec2 rotated=mat2(c,-s,s,c)*physical;
  vec2 p=rotated/vec2(2876./1580.,1.);
  float y=abs(p.y);
  float width=.100+.205*pow(y*2.,1.75);
  float d=width-abs(p.x);
  float softness=.004+.025*pow(clamp(y*2.,0.,1.),2.);
  float body=smoothstep(-softness,softness,d);
  float halo=exp(-pow(d/(softness*3.),2.))*.018;
  float wedge=exp(-pow(p.x/(.025+.23*y),2.))*smoothstep(.10,.51,y);
  float falloff=1.-smoothstep(.12,.66,y);
  float light=.86*body*(1.-.96*wedge)*falloff;
  // X geometry lives in art coordinates; the animation field covers the entire canvas.
  // Extra space above/below a small mobile X belongs to the same light field.
  vec2 extent=resolution/(2.*vec2(artHeight*(2876./1580.),artHeight));
  // Preserve the approved white-to-X sequence, remapped to its adjustable duration.
  float cycle=mix(2.,10.,formation);
  float sides=smoothstep(2.,7.,cycle);
  float slide=(max(extent.x,.6)+.35)*(1.-sides);
  float sideShadow=1.-smoothstep(-softness,softness,d+slide);
  float vertical=smoothstep(3.2,8.,cycle);
  float front=mix(max(extent.y,.5)+.3,-.15,vertical);
  float topBottom=smoothstep(front-.12,front+.12,y)*smoothstep(3.2,3.7,cycle);
  float innerLight=.042+.86*(1.-.96*wedge)*falloff;
  float interior=mix(1.,innerLight,topBottom);
  float assembled=mix(interior,.042,sideShadow);
  float formed=smoothstep(7.,10.,cycle);
  float reference=.042+light+halo*falloff;
  // The formation highlight settles before the timed hold and rotation stages.
  float sweep=exp(-pow((p.y-mix(.6,-.6,smoothstep(7.,10.,cycle)))/.12,2.));
  float glint=.09*sweep*exp(-pow(d/(softness*2.5),2.))*falloff;
  glint*=smoothstep(7.,7.6,cycle)*(1.-smoothstep(9.4,10.,cycle))*motion;
  float value=mix(assembled,reference,formed)+glint;
  // Light moves during the complete-X stages; its last state is carried into exit.
  // Both travel in X coordinates, so they follow its silhouette through rotation.
  float broadPosition=-.55*cos(flowTime*6.2831853/${heroLightFlow.widePeriod.toFixed(1)});
  float broad=exp(-pow((p.x*.8+p.y*.7-broadPosition)/.23,2.));
  float broadLight=light*mix(-.28,.04,broad);
  float edgePosition=.55*sin(flowTime*6.2831853/${heroLightFlow.edgePeriod.toFixed(1)}-.9);
  float edgeTravel=exp(-pow((p.y-edgePosition)/.17,2.));
  float leftEdge=1.-smoothstep(-.04,.04,p.x);
  float edgeLight=.22*edgeTravel*exp(-pow(d/(softness*1.7),2.))*falloff*leftEdge;
  value+=(broadLight+edgeLight)*flowAmount;
  // A branched light field follows all four X arms, then fills the full crop.
  float reach=returning;
  float armDistance=abs(abs(p.x)-(.035+.34*y));
  float travel=.4*y+1.2*armDistance;
  float maxTravel=.4*extent.y+1.2*(extent.x+.035+.34*extent.y)+.4;
  // One spatial reveal, without the former late full-frame brightness boost.
  float feather=.20;
  float spread=mix(-feather,maxTravel+feather,reach);
  float dissolve=1.-smoothstep(spread-feather,spread+feather,travel);
  value=mix(value,1.,dissolve);
  float texture=smoothstep(2.,8.,cycle)*(1.-dissolve);
  vec2 cell=floor(gl_FragCoord.xy/max(.5,grainSize*pixelScale));
  float grain=hash(cell)+hash(cell+19.7)-1.;
  value+=grain*grainAmount*(.08+.35*sqrt(max(light,0.)))*texture;
  float dither=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))));
  value+=(dither-.5)/255.*texture;
  gl_FragColor=vec4(vec3(clamp(value,0.,1.)),1.);
}`;

export function initHeroLight(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const button = root.querySelector('button')!;
  const storageKey = 'xions-hero-grain-v2';
  let grainAmount: number = heroLightDefaults.grainAmount, grainSize: number = heroLightDefaults.grainSize, pixelScale = 1, artHeight: number = heroLightDefaults.desktopXHeight;
  try {
    const saved = import.meta.env.DEV && JSON.parse(localStorage.getItem(storageKey) || 'null');
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
  let flowTimeLocation: WebGLUniformLocation | null = null, flowAmountLocation: WebGLUniformLocation | null = null;
  let resolutionLocation: WebGLUniformLocation | null = null;
  let amountLocation: WebGLUniformLocation | null = null, sizeLocation: WebGLUniformLocation | null = null, scaleLocation: WebGLUniformLocation | null = null;
  let formationLocation: WebGLUniformLocation | null = null, exitLocation: WebGLUniformLocation | null = null, angleLocation: WebGLUniformLocation | null = null;
  let heightLocation: WebGLUniformLocation | null = null, motionLocation: WebGLUniformLocation | null = null;
  let timing={...heroLightTiming};
  let flow=normalizeFlow();
  let frame = 0, elapsed = 0, previous = 0, lastProgress=-1;
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
    flowTimeLocation=context.getUniformLocation(program,'flowTime');
    flowAmountLocation=context.getUniformLocation(program,'flowAmount');
    resolutionLocation=context.getUniformLocation(program,'resolution');
    amountLocation=context.getUniformLocation(program,'grainAmount');
    sizeLocation=context.getUniformLocation(program,'grainSize');
    scaleLocation=context.getUniformLocation(program,'pixelScale');
    heightLocation=context.getUniformLocation(program,'artHeight');
    motionLocation=context.getUniformLocation(program,'motion');
    formationLocation=context.getUniformLocation(program,'formation');
    exitLocation=context.getUniformLocation(program,'returning');
    angleLocation=context.getUniformLocation(program,'angle');
    return true;
  }
  function draw() {
    if (lost || disposed) return;
    context.uniform2f(resolutionLocation,canvas.width,canvas.height);
    const state=heroFrame(elapsed,timing,reduced.matches);
    context.uniform1f(flowTimeLocation,state.flowTime*flow.speed);context.uniform1f(flowAmountLocation,state.flowAmount*flow.strength);
    context.uniform1f(formationLocation,state.formation);
    context.uniform1f(exitLocation,state.exit);context.uniform1f(angleLocation,state.angle);
    if(import.meta.env.DEV && (Math.abs(elapsed-lastProgress)>.15 || paused)){
      lastProgress=elapsed;window.dispatchEvent(new CustomEvent('xions:hero-progress',{detail:{...state,paused}}));
    }
    context.uniform1f(amountLocation,grainAmount);
    context.uniform1f(sizeLocation,grainSize);
    context.uniform1f(scaleLocation,pixelScale);
    context.uniform1f(heightLocation,artHeight*pixelScale);
    context.uniform1f(motionLocation,reduced.matches ? 0 : 1);
    context.drawArrays(context.TRIANGLES,0,3);
  }
  function resize() {
    if (lost || disposed) return;
    const {width,height}=root.getBoundingClientRect();
    const scale=Math.min(devicePixelRatio || 1,1.5,1600/Math.max(width,height));
    pixelScale=scale;
    artHeight=root.querySelector('.light-poster')!.getBoundingClientRect().height;
    canvas.width=Math.max(1,Math.round(width*scale));
    canvas.height=Math.max(1,Math.round(height*scale));
    context.viewport(0,0,canvas.width,canvas.height);
    draw();
  }
  function tick(now:number) {
    frame=requestAnimationFrame(tick);
    if (!previous) previous=now;
    const delta=now-previous;
    // Allow timer jitter around a 60Hz refresh instead of accidentally skipping every other frame.
    if (delta<1000/60-1) return;
    elapsed+=Math.min(delta,100)/1000;
    previous=now;
    draw();
  }
  function sync() {
    cancelAnimationFrame(frame);
    previous=0;
    button.hidden=lost || reduced.matches;
    draw();
    if (!paused && !reduced.matches && visible && !document.hidden && !lost && !disposed) frame=requestAnimationFrame(tick);
  }
  if (!setup()) { context.deleteBuffer(buffer); context.deleteProgram(program); return; }
  root.dataset.ready='true';
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
  observer.observe(root);
  const sizing=new ResizeObserver(resize);
  sizing.observe(root);
  sizing.observe(root.querySelector('.light-poster')!);
  const toggle=()=>{paused=!paused;root.dataset.paused=String(paused);sync();};
  const replay=()=>{elapsed=0;paused=false;root.dataset.paused='false';sync();};
  const onSettings=(event:Event)=>{
    const detail=(event as CustomEvent).detail;
    if (!Number.isFinite(detail?.amount)||!Number.isFinite(detail?.size))return;
    grainAmount=Math.max(0,Math.min(1,detail.amount));grainSize=Math.max(.5,Math.min(4,detail.size));
    if(detail.flow)flow=normalizeFlow(detail.flow);
    const next=normalizeTiming(detail.timing);
    const changed=JSON.stringify(next)!==JSON.stringify(timing);
    if(changed){timing=next;elapsed=0;lastProgress=-1;paused=false;root.dataset.paused='false';}
    resize();
    if(changed)sync();
  };
  const seek=(event:Event)=>{
    const at=(event as CustomEvent).detail?.time;
    if(!Number.isFinite(at))return;
    elapsed=Math.max(0,Math.min(totalDuration(timing)-.001,at));paused=true;root.dataset.paused='true';sync();
  };
  const previewToggle=()=>{toggle();lastProgress=-1;draw();};
  if(import.meta.env.DEV){
    window.addEventListener('xions:hero-settings',onSettings);
    window.addEventListener('xions:hero-replay',replay);
    window.addEventListener('xions:hero-seek',seek);
    window.addEventListener('xions:hero-toggle',previewToggle);
  }
  const onLost=(event:Event)=>{event.preventDefault();lost=true;root.dataset.ready='false';sync();};
  const onRestored=()=>{lost=false;if(setup()){root.dataset.ready='true';resize();sync();}else{lost=true;sync();}};
  button.addEventListener('click',toggle);
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  canvas.addEventListener('webglcontextlost',onLost);
  canvas.addEventListener('webglcontextrestored',onRestored);
  resize();sync();
  document.addEventListener('astro:before-swap',()=>{
    window.removeEventListener('xions:hero-settings',onSettings);
    window.removeEventListener('xions:hero-replay',replay);
    window.removeEventListener('xions:hero-seek',seek);
    window.removeEventListener('xions:hero-toggle',previewToggle);
    disposed=true;cancelAnimationFrame(frame);observer.disconnect();sizing.disconnect();
    reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);
    button.removeEventListener('click',toggle);canvas.removeEventListener('webglcontextlost',onLost);
    canvas.removeEventListener('webglcontextrestored',onRestored);
    context.deleteBuffer(buffer);context.deleteProgram(program);
  },{once:true});
}
