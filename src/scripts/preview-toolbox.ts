import { heroLightDefaults, heroLightTiming, normalizeTiming, normalizeFlow, totalDuration, type HeroTiming } from '../config/hero-light';
const iframe=document.querySelector<HTMLIFrameElement>('iframe')!;
const panel=document.querySelector<HTMLElement>('#toolbox')!;
const launcher=document.querySelector<HTMLButtonElement>('.launcher')!;
const byId=(id:string)=>document.getElementById(id)!;
const inputs={desktop:byId('desktop-height') as HTMLInputElement,height:byId('hero-height') as HTMLInputElement,x:byId('x-height') as HTMLInputElement,grain:byId('grain') as HTMLInputElement,size:byId('size') as HTMLInputElement};
const timingInputs=[...document.querySelectorAll<HTMLInputElement>('[data-timing]')];
const flowInputs={strength:byId('flow-strength') as HTMLInputElement,speed:byId('flow-speed') as HTMLInputElement};
const flowKey='xions-preview-flow-v1';
let flow=normalizeFlow();
let device:'mobile'|'desktop'='mobile';
const layoutKey='xions-preview-layout-v3';
const timingKey='xions-preview-timing-v2';
let timing={...heroLightTiming};
let settings={desktop:Number(heroLightDefaults.desktopXHeight),height:844,x:Number(heroLightDefaults.mobileXHeight),grain:heroLightDefaults.grainAmount*100,size:Number(heroLightDefaults.grainSize)};
try {
  const stored=JSON.parse(localStorage.getItem(layoutKey)||'null');
  if(!stored){
    // Adopt the approved X sizes once, keeping the user's separate screen height.
    const previous=JSON.parse(localStorage.getItem('xions-preview-layout-v2')||localStorage.getItem('xions-preview-layout-v1')||'null');
    if(Number.isFinite(previous?.height))settings.height=Math.max(480,Math.min(1100,previous.height));
  }
  for(const key of ['height','x'] as const)if(Number.isFinite(stored?.[key]))settings[key]=Math.max(key==='height'?480:360,Math.min(1100,stored[key]));
  if(Number.isFinite(stored?.desktop))settings.desktop=Math.max(500,Math.min(1400,stored.desktop));
  timing=normalizeTiming(JSON.parse(localStorage.getItem(timingKey)||'null')||{});
  flow=normalizeFlow(JSON.parse(localStorage.getItem(flowKey)||'null')||{});
  const grain=JSON.parse(localStorage.getItem('xions-hero-grain-v2')||'null');
  if(Number.isFinite(grain?.amount))settings.grain=Math.max(0,Math.min(100,grain.amount*100));
  if(Number.isFinite(grain?.size))settings.size=Math.max(.5,Math.min(4,grain.size));
} catch {}
function fit(){
  const width=device==='mobile'?390:1440,height=device==='mobile'?844:900;
  const stage=document.querySelector<HTMLElement>('.stage')!;
  const scale=Math.min(1,(stage.clientWidth-32)/width,(stage.clientHeight-32)/height);
  Object.assign(iframe.style,{width:`${width}px`,height:`${height}px`,transform:`scale(${scale})`});
  Object.assign(document.querySelector<HTMLElement>('.frame-wrap')!.style,{width:`${width*scale}px`,height:`${height*scale}px`});
  byId('dimensions').textContent=`${width} × ${height} · 显示缩放 ${Math.round(scale*100)}%`;
  byId('mobile-options').hidden=device!=='mobile';byId('desktop-options').hidden=device!=='desktop';
}
function apply(){
  for(const [key,input] of Object.entries(inputs))input.value=String(settings[key as keyof typeof settings]);
  byId('desktop-height-value').textContent=`${settings.desktop}px`;
  byId('hero-height-value').textContent=`${settings.height}px`;byId('x-height-value').textContent=`${settings.x}px`;
  byId('grain-value').textContent=`${Math.round(settings.grain)}%`;byId('size-value').textContent=`${settings.size.toFixed(1)}px`;
  byId('total-time').textContent=`合计 ${totalDuration(timing)} 秒`;
  flowInputs.strength.value=String(flow.strength*100);flowInputs.speed.value=String(flow.speed);
  byId('flow-strength-value').textContent=`${Math.round(flow.strength*100)}%`;
  byId('flow-speed-value').textContent=`${flow.speed.toFixed(2)}×`;
  timingInputs.forEach(input=>{
    if(input!==document.activeElement)input.value=String(timing[input.dataset.timing as keyof HeroTiming]);
  });
  const doc=iframe.contentDocument;if(!doc)return;
  let style=doc.getElementById('preview-height-style');
  if(!style){style=doc.createElement('style');style.id='preview-height-style';doc.head.append(style);}
  style.textContent=`astro-dev-toolbar{display:none!important}@media(min-width:701px){.hero-light{--x-art-height:${settings.desktop}px!important}}@media(max-width:700px){.home-hero{min-height:${settings.height}px!important}.hero-light{--x-art-height:${settings.x}px!important}}`;
  iframe.contentWindow?.dispatchEvent(new CustomEvent('xions:hero-settings',{detail:{amount:settings.grain/100,size:settings.size,timing,flow}}));
}
const phaseNames:Record<string,string>={white:'白场',formation:'聚合成 X',hold:'旋转前停留',rotation:'旋转',settle:'旋转后停留',exit:'回到白场'};
function progress(event:Event){
  const state=(event as CustomEvent).detail;if(!state)return;
  (byId('timeline') as HTMLInputElement).value=String(Math.round(state.time/state.total*1000));
  byId('time-status').textContent=`${phaseNames[state.phase]||state.phase} · ${state.time.toFixed(1)} / ${state.total}s · ${Math.round(state.angle*180/Math.PI)}°`;
  byId('playback').textContent=state.paused?'继续播放':'暂停';
}
let frameWindow:Window|null=null;
function context(){
  const doc=iframe.contentDocument,win=iframe.contentWindow;if(!doc||!win)return;
  const regions=[...doc.querySelectorAll<HTMLElement>('main > header, main > section, main > article, .site-footer')];
  const focus=win.innerHeight*.4;
  const current=regions.find(el=>{const r=el.getBoundingClientRect();return r.top<=focus&&r.bottom>focus}) || regions.filter(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<win.innerHeight}).sort((a,b)=>{const visible=(e:HTMLElement)=>{const r=e.getBoundingClientRect();return Math.min(r.bottom,win.innerHeight)-Math.max(r.top,0)};return visible(b)-visible(a)})[0];
  const hero=current?.classList.contains('home-hero');
  byId('region').textContent=hero?'首页 Hero':current?.querySelector('.eyebrow,h1,h2')?.textContent?.trim() || (current?.classList.contains('site-footer')?'页脚':'当前页面');
  byId('hero-options').hidden=!hero;byId('no-options').hidden=!!hero;
  (byId('direct') as HTMLAnchorElement).href=win.location.pathname;
}
iframe.addEventListener('load',()=>{
  // A temporary browser error document may have a different origin after a server restart.
  try{frameWindow?.removeEventListener('scroll',context);frameWindow?.removeEventListener('xions:hero-progress',progress);}catch{}
  frameWindow=iframe.contentWindow;frameWindow?.addEventListener('scroll',context,{passive:true});frameWindow?.addEventListener('xions:hero-progress',progress);
  apply();context();
});
for(const [key,input] of Object.entries(inputs))input.addEventListener('input',()=>{
  settings[key as keyof typeof settings]=Number(input.value);apply();
  try{localStorage.setItem(layoutKey,JSON.stringify(settings));localStorage.setItem('xions-hero-grain-v2',JSON.stringify({amount:settings.grain/100,size:settings.size}));}catch{}
});
timingInputs.forEach(input=>{
  const update=()=>{
    // Allow temporarily empty/partial values while typing; commit valid seconds immediately.
    if(!Number.isFinite(input.valueAsNumber))return;
    timing=normalizeTiming({...timing,[input.dataset.timing!]:input.valueAsNumber});apply();
    try{localStorage.setItem(timingKey,JSON.stringify(timing));}catch{}
  };
  input.addEventListener('input',update);
  input.addEventListener('change',update);
  input.addEventListener('blur',()=>{input.value=String(timing[input.dataset.timing as keyof HeroTiming]);});
});
for(const [key,input] of Object.entries(flowInputs))input.addEventListener('input',()=>{
  flow=normalizeFlow({...flow,[key]:Number(input.value)/(key==='strength'?100:1)});
  apply();
  try{localStorage.setItem(flowKey,JSON.stringify(flow));}catch{}
});
document.querySelectorAll<HTMLButtonElement>('[data-device]').forEach(button=>button.addEventListener('click',()=>{
  device=button.dataset.device as typeof device;
  document.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  fit();apply();requestAnimationFrame(context);
}));
function collapse(hidden:boolean){panel.hidden=hidden;launcher.setAttribute('aria-expanded',String(!hidden));document.body.classList.toggle('toolbox-open',!hidden);fit();}
launcher.addEventListener('click',()=>collapse(!panel.hidden));byId('close').addEventListener('click',()=>collapse(true));
byId('replay').addEventListener('click',()=>iframe.contentWindow?.dispatchEvent(new CustomEvent('xions:hero-replay')));
byId('playback').addEventListener('click',()=>iframe.contentWindow?.dispatchEvent(new CustomEvent('xions:hero-toggle')));
byId('timeline').addEventListener('input',()=>iframe.contentWindow?.dispatchEvent(new CustomEvent('xions:hero-seek',{detail:{time:Number((byId('timeline') as HTMLInputElement).value)/1000*totalDuration(timing)}})));
addEventListener('resize',()=>{fit();context()});
const requested=new URLSearchParams(location.search).get('path');
if(requested && /^\/(fr|en)(\/|$)/.test(requested))iframe.src=requested;
fit();apply();
