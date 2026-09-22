import { heroLightDefaults } from '../config/hero-light';
const iframe=document.querySelector<HTMLIFrameElement>('iframe')!;
const panel=document.querySelector<HTMLElement>('#toolbox')!;
const launcher=document.querySelector<HTMLButtonElement>('.launcher')!;
const byId=(id:string)=>document.getElementById(id)!;
const inputs={height:byId('hero-height') as HTMLInputElement,x:byId('x-height') as HTMLInputElement,grain:byId('grain') as HTMLInputElement,size:byId('size') as HTMLInputElement};
let device:'mobile'|'desktop'='mobile';
const layoutKey='xions-preview-layout-v2';
let settings={height:844,x:Number(heroLightDefaults.mobileXHeight),grain:heroLightDefaults.grainAmount*100,size:Number(heroLightDefaults.grainSize)};
try {
  const stored=JSON.parse(localStorage.getItem(layoutKey)||'null');
  // Keep the earlier screen-height choice while adopting the approved 360px X.
  if(!stored){
    const previous=JSON.parse(localStorage.getItem('xions-preview-layout-v1')||'null');
    if(Number.isFinite(previous?.height))settings.height=Math.max(480,Math.min(1100,previous.height));
  }
  for(const key of ['height','x'] as const) if(Number.isFinite(stored?.[key]))settings[key]=Math.max(key==='height'?480:360,Math.min(1100,stored[key]));
  const grain=JSON.parse(localStorage.getItem('xions-hero-grain-v2')||'null');
  if(Number.isFinite(grain?.amount))settings.grain=Math.max(0,Math.min(100,grain.amount*100));
  if(Number.isFinite(grain?.size))settings.size=Math.max(.5,Math.min(4,grain.size));
} catch {}
function fit(){
  const width=device==='mobile'?390:1440,height=device==='mobile'?844:900;
  const scale=Math.min(1,(innerWidth-32)/width,(innerHeight-32)/height);
  Object.assign(iframe.style,{width:`${width}px`,height:`${height}px`,transform:`scale(${scale})`});
  Object.assign(document.querySelector<HTMLElement>('.frame-wrap')!.style,{width:`${width*scale}px`,height:`${height*scale}px`});
  byId('dimensions').textContent=`${width} × ${height} · 显示缩放 ${Math.round(scale*100)}%`;
  byId('mobile-options').hidden=device!=='mobile';
}
function apply(){
  for(const [key,input] of Object.entries(inputs))input.value=String(settings[key as keyof typeof settings]);
  byId('hero-height-value').textContent=`${settings.height}px`;
  byId('x-height-value').textContent=`${settings.x}px`;
  byId('grain-value').textContent=`${Math.round(settings.grain)}%`;
  byId('size-value').textContent=`${settings.size.toFixed(1)}px`;
  const doc=iframe.contentDocument;
  if(!doc)return;
  let style=doc.getElementById('preview-height-style');
  if(!style){style=doc.createElement('style');style.id='preview-height-style';doc.head.append(style);}
  style.textContent=`astro-dev-toolbar{display:none!important}@media(max-width:700px){.home-hero{min-height:${settings.height}px!important}.hero-light{--x-art-height:${settings.x}px!important}}`;
  iframe.contentWindow?.dispatchEvent(new CustomEvent('xions:hero-settings',{detail:{amount:settings.grain/100,size:settings.size}}));
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
  frameWindow?.removeEventListener('scroll',context);
  frameWindow=iframe.contentWindow;frameWindow?.addEventListener('scroll',context,{passive:true});
  apply();context();
});
for(const [key,input] of Object.entries(inputs))input.addEventListener('input',()=>{
  settings[key as keyof typeof settings]=Number(input.value);apply();
  try{localStorage.setItem(layoutKey,JSON.stringify(settings));localStorage.setItem('xions-hero-grain-v2',JSON.stringify({amount:settings.grain/100,size:settings.size}));}catch{}
});
document.querySelectorAll<HTMLButtonElement>('[data-device]').forEach(button=>button.addEventListener('click',()=>{
  device=button.dataset.device as typeof device;
  document.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  fit();apply();requestAnimationFrame(context);
}));
function collapse(hidden:boolean){panel.hidden=hidden;launcher.setAttribute('aria-expanded',String(!hidden));}
launcher.addEventListener('click',()=>collapse(!panel.hidden));byId('close').addEventListener('click',()=>collapse(true));
byId('replay').addEventListener('click',()=>iframe.contentWindow?.dispatchEvent(new CustomEvent('xions:hero-replay')));
addEventListener('resize',()=>{fit();context()});
const requested=new URLSearchParams(location.search).get('path');
if(requested && /^\/(fr|en)(\/|$)/.test(requested))iframe.src=requested;
fit();apply();
