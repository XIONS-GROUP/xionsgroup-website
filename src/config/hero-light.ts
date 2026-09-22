// Approved visual defaults; timings are the first rotation study, pending review.
export const heroLightDefaults = { grainAmount: 0.12, grainSize: 0.9, mobileXHeight: 360, desktopXHeight: 900 } as const;
export const heroLightTiming = { white: 2, formation: 8, hold: 4, rotation: 6, settle: 3, exit: 5 };
export type HeroTiming = typeof heroLightTiming;
export const timingKeys = ['white','formation','hold','rotation','settle','exit'] as const;
export function normalizeTiming(value: Partial<HeroTiming> = {}): HeroTiming {
  const result={...heroLightTiming};
  for(const key of timingKeys)if(Number.isFinite(value[key]))result[key]=Math.max(['formation','rotation','exit'].includes(key)?1:0,Math.min(30,value[key]!));
  return result;
}
export function totalDuration(timing:HeroTiming){return timingKeys.reduce((sum,key)=>sum+timing[key],0);}
// Cubic Bézier (0.65, 0, 0.85, 1): slow departure, late acceleration, soft arrival.
export function rotationEase(progress:number){
  if(progress<=0)return 0;if(progress>=1)return 1;
  let lo=0,hi=1;
  for(let i=0;i<18;i++){
    const t=(lo+hi)/2,x=3*(1-t)*(1-t)*t*.65+3*(1-t)*t*t*.85+t*t*t;
    if(x<progress)lo=t;else hi=t;
  }
  const t=(lo+hi)/2;return 3*t*t-2*t*t*t;
}
export function heroFrame(elapsed:number,timing:HeroTiming,reduced=false){
  const total=totalDuration(timing),time=((elapsed%total)+total)%total;
  const formationEnd=timing.white+timing.formation,rotationStart=formationEnd+timing.hold;
  const rotationEnd=rotationStart+timing.rotation,exitStart=rotationEnd+timing.settle;
  const clamp=(v:number)=>Math.max(0,Math.min(1,v));
  const phase=time<timing.white?'white':time<formationEnd?'formation':time<rotationStart?'hold':time<rotationEnd?'rotation':time<exitStart?'settle':'exit';
  return {time,total,phase:reduced?'hold':phase,
    formation:reduced?1:clamp((time-timing.white)/timing.formation),
    exit:reduced?0:clamp((time-exitStart)/timing.exit),
    angle:reduced?0:Math.PI*rotationEase(clamp((time-rotationStart)/timing.rotation))};
}
