import { heroLightDefaults, heroLightTiming, normalizeTiming, normalizeFlow, normalizeEase, totalDuration, type HeroTiming, type HeroEase } from '../config/hero-light';
import { routes } from '../i18n/routes';
const iframe=document.querySelector<HTMLIFrameElement>('iframe')!;
const panel=document.querySelector<HTMLElement>('#toolbox')!;
const launcher=document.querySelector<HTMLButtonElement>('.launcher')!;
const byId=(id:string)=>document.getElementById(id)!;
const inputs={desktop:byId('desktop-height') as HTMLInputElement,height:byId('hero-height') as HTMLInputElement,x:byId('x-height') as HTMLInputElement,grain:byId('grain') as HTMLInputElement,size:byId('size') as HTMLInputElement};
const timingInputs=[...document.querySelectorAll<HTMLInputElement>('[data-timing]')];
const flowInputs={strength:byId('flow-strength') as HTMLInputElement,speed:byId('flow-speed') as HTMLInputElement};
const easeInputs={formation:byId('ease-formation') as HTMLInputElement,rotation:byId('ease-rotation') as HTMLInputElement};
const flowKey='xions-preview-flow-v1';
const easeKey='xions-preview-ease-v1';
let flow=normalizeFlow();
let ease=normalizeEase();
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
  ease=normalizeEase(JSON.parse(localStorage.getItem(easeKey)||'null')||{});
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
  for(const [key,input] of Object.entries(easeInputs)){
    const value=ease[key as keyof typeof ease];
    input.value=String(value);
    byId(`ease-${key}-value`).textContent=value<=1?'1.0 · 匀速':value.toFixed(1);
  }
  timingInputs.forEach(input=>{
    if(input!==document.activeElement)input.value=String(timing[input.dataset.timing as keyof HeroTiming]);
  });
  const doc=iframe.contentDocument;if(!doc)return;
  let style=doc.getElementById('preview-height-style');
  if(!style){style=doc.createElement('style');style.id='preview-height-style';doc.head.append(style);}
  style.textContent=`astro-dev-toolbar{display:none!important}@media(min-width:701px){.hero-light{--x-art-height:${settings.desktop}px!important}}@media(max-width:700px){.home-hero{min-height:${settings.height}px!important}.hero-light{--x-art-height:${settings.x}px!important}}`;
  iframe.contentWindow?.dispatchEvent(new CustomEvent('xions:hero-settings',{detail:{amount:settings.grain/100,size:settings.size,timing,flow,ease}}));
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
for(const [key,input] of Object.entries(easeInputs))input.addEventListener('input',()=>{
  ease=normalizeEase({...ease,[key]:Number(input.value)});apply();
  try{localStorage.setItem(easeKey,JSON.stringify(ease));}catch{}
});
const pageSelect=byId('edit-page') as HTMLSelectElement;
for(const [fr,en] of routes){
  if(fr==='404')continue;
  for(const [locale,slug] of [['fr',fr],['en',en]] as const){
    pageSelect.append(Object.assign(document.createElement('option'),
      {value:`/${locale}/${slug?`${slug}/`:''}`,textContent:`${locale.toUpperCase()} · ${slug||'accueil'}`}));
  }
}
pageSelect.addEventListener('change',()=>{iframe.src=pageSelect.value;});
const presetName=byId('preset-name') as HTMLInputElement;
const presetStatus=byId('preset-status'),presetList=byId('preset-list');
type Preset={file:string;name:string;savedAt:string;settings:{layout?:typeof settings;timing?:Partial<HeroTiming>;flow?:{strength?:number;speed?:number};ease?:Partial<HeroEase>}};
function store(){
  try{
    localStorage.setItem(layoutKey,JSON.stringify(settings));
    localStorage.setItem('xions-hero-grain-v2',JSON.stringify({amount:settings.grain/100,size:settings.size}));
    localStorage.setItem(timingKey,JSON.stringify(timing));
    localStorage.setItem(flowKey,JSON.stringify(flow));
    localStorage.setItem(easeKey,JSON.stringify(ease));
  }catch{}
}
function load(preset:Preset){
  const saved=preset.settings||{};
  if(saved.layout)for(const key of Object.keys(settings) as (keyof typeof settings)[]){
    if(Number.isFinite(saved.layout[key]))settings[key]=saved.layout[key];
  }
  timing=normalizeTiming(saved.timing);flow=normalizeFlow(saved.flow);ease=normalizeEase(saved.ease);
  store();apply();
  // Timing edits restart the hero on their own; a reload keeps the preview in step regardless.
  iframe.contentWindow?.dispatchEvent(new CustomEvent('xions:hero-replay'));
  presetStatus.textContent=`已载入「${preset.name}」`;
}
function render(presets:Preset[]){
  presetList.textContent='';
  for(const preset of presets.slice(0,20)){
    const item=document.createElement('li'),label=document.createElement('span');
    const stamp=new Date(preset.savedAt);
    label.append(Object.assign(document.createElement('strong'),{textContent:preset.name}),
      ` · ${Number.isNaN(stamp.getTime())?preset.savedAt:stamp.toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}`);
    const button=Object.assign(document.createElement('button'),{type:'button',textContent:'载入'});
    button.addEventListener('click',()=>load(preset));
    item.append(label,button);presetList.append(item);
  }
}
async function refresh(){
  try{
    const response=await fetch('/__hero-presets');
    if(!response.ok)throw new Error(String(response.status));
    render((await response.json()).presets||[]);
  }catch{presetStatus.textContent='读不到已保存的版本，确认开发服务器在运行。';}
}
byId('preset-save').addEventListener('click',async()=>{
  presetStatus.textContent='保存中…';
  try{
    const response=await fetch('/__hero-presets',{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({name:presetName.value,settings:{layout:settings,timing,flow,ease}})});
    const body=await response.json();
    if(!response.ok)throw new Error(body?.error||String(response.status));
    presetStatus.textContent=`已保存 local-materials/hero-presets/${body.preset.file}`;
    presetName.value='';refresh();
  }catch(error){presetStatus.textContent=`保存失败：${error instanceof Error?error.message:'未知错误'}`;}
});
refresh();

// --- In-place copy editing -------------------------------------------------
const editToggle=byId('edit-toggle') as HTMLButtonElement;
const editControls=byId('edit-controls'),editTarget=byId('edit-target'),editStatus=byId('edit-status'),editCount=byId('edit-count');
const fontSelect=byId('edit-font') as HTMLSelectElement,sizeInput=byId('edit-size') as HTMLInputElement;
let editingOn=false;
const toFrame=(type:string,detail?:unknown)=>iframe.contentWindow?.postMessage({type,detail},location.origin);
function setEditing(next:boolean){
  editingOn=next;
  editToggle.setAttribute('aria-pressed',String(next));
  editToggle.textContent=next?'退出文字编辑':'解锁文字编辑';
  editControls.hidden=true;editTarget.textContent='';
  if(!next)editCount.textContent='';
  toFrame('xions:text-edit-mode',{enabled:next});
}
editToggle.addEventListener('click',()=>setEditing(!editingOn));
byId('edit-revert').addEventListener('click',()=>{toFrame('xions:text-revert');editStatus.textContent='已还原本页的未保存修改。';});
// Overrides are stored per device, so the frame needs to know which one is being edited.
const leadingInput=byId('edit-leading') as HTMLInputElement;
fontSelect.addEventListener('change',()=>toFrame('xions:text-style',{scope:device,fontFamily:fontSelect.value}));
sizeInput.addEventListener('input',()=>{
  if(Number.isFinite(sizeInput.valueAsNumber))toFrame('xions:text-style',{scope:device,fontSize:sizeInput.valueAsNumber});
});
leadingInput.addEventListener('input',()=>{
  if(Number.isFinite(leadingInput.valueAsNumber))toFrame('xions:text-style',{scope:device,lineHeight:leadingInput.valueAsNumber});
});
byId('edit-size-clear').addEventListener('click',()=>{
  sizeInput.value='';leadingInput.value='';fontSelect.value='';
  toFrame('xions:text-style',{scope:device,fontSize:0,lineHeight:0,fontFamily:''});
});
let pendingSave=false;
byId('edit-save').addEventListener('click',()=>{
  if(!editingOn)return void(editStatus.textContent='先解锁文字编辑。');
  pendingSave=true;editStatus.textContent='收集修改中…';toFrame('xions:text-collect');
});
addEventListener('message',async event=>{
  if(event.origin!==location.origin)return;
  const {type,detail}=event.data||{};
  // Each navigation inside the frame reloads the page, so re-arm edit mode when it announces itself.
  if(type==='xions:text-ready'){
    if(detail?.page)pageSelect.value=detail.page;
    if(editingOn)toFrame('xions:text-edit-mode',{enabled:true});
  }
  if(type==='xions:text-dirty')editCount.textContent=detail?.count?`${detail.count} 处改动`:'';
  if(type==='xions:text-selected'){
    editControls.hidden=!detail;
    if(!detail)return;
    editTarget.textContent=`${detail.path} · 当前 ${detail.computedFamily} ${detail.fontSize}px / 行距 ${detail.lineHeight}`;
    const scoped=detail.overrides?.[device]||{};
    fontSelect.value=scoped.fontFamily||'';
    if(sizeInput!==document.activeElement)sizeInput.value=scoped.fontSize??String(detail.fontSize);
    if(leadingInput!==document.activeElement)leadingInput.value=scoped.lineHeight??String(detail.lineHeight);
    byId('edit-scope-note').textContent=`正在编辑${device==='mobile'?'手机端':'桌面端'}的覆盖值。两端各自独立保存，改桌面不会影响手机。`;
  }
  if(type==='xions:text-changes'&&pendingSave){
    pendingSave=false;
    if(!detail?.changes?.length)return void(editStatus.textContent='本页没有检测到改动。');
    try{
      const response=await fetch('/__text-edits',{method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({name:detail.page.replace(/\//g,'-').replace(/^-|-$/g,'')||'accueil',page:detail.page,changes:detail.changes})});
      const body=await response.json();
      if(!response.ok)throw new Error(body?.error||String(response.status));
      editStatus.textContent=`已保存 ${detail.changes.length} 处到 local-materials/text-edits/${body.edit.file}`;
    }catch(error){editStatus.textContent=`保存失败：${error instanceof Error?error.message:'未知错误'}`;}
  }
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
