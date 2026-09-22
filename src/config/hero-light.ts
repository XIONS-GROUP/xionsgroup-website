// Approved on 2026-09-22; see docs/project-log/hero-parameters.md.
export const heroLightDefaults = { grainAmount: 0.12, grainSize: 0.9, mobileXHeight: 390, desktopXHeight: 650 } as const;
export const heroLightTiming = { white: 0, formation: 10, hold: 2, rotation: 4, settle: 2, exit: 5 };
export const heroLightFlow = { widePeriod: 8, edgePeriod: 5, strength: 2.9, speed: 1 } as const;
export function normalizeFlow(value: {strength?:number;speed?:number} = {}) {
  return {
    strength:Number.isFinite(value.strength)?Math.max(0,Math.min(3,value.strength!)):heroLightFlow.strength,
    speed:Number.isFinite(value.speed)?Math.max(.25,Math.min(3,value.speed!)):heroLightFlow.speed
  };
}
export type HeroTiming = typeof heroLightTiming;
export const timingKeys = ['white','formation','hold','rotation','settle','exit'] as const;
export function normalizeTiming(value: Partial<HeroTiming> = {}): HeroTiming {
  const result={...heroLightTiming};
  for(const key of timingKeys)if(Number.isFinite(value[key]))result[key]=Math.max(['formation','rotation','exit'].includes(key)?1:0,Math.min(30,value[key]!));
  return result;
}
export function totalDuration(timing:HeroTiming){return timingKeys.reduce((sum,key)=>sum+timing[key],0);}
// Symmetric quintic S curve: zero velocity and acceleration at both ends.
export function motionEase(progress:number){
  const t=Math.max(0,Math.min(1,progress));
  return t*t*t*(t*(6*t-15)+10);
}
export const rotationEase=motionEase;
export function heroFrame(elapsed:number,timing:HeroTiming,reduced=false){
  const total=totalDuration(timing),time=((elapsed%total)+total)%total;
  const formationEnd=timing.white+timing.formation,rotationStart=formationEnd+timing.hold;
  const rotationEnd=rotationStart+timing.rotation,exitStart=rotationEnd+timing.settle;
  const clamp=(v:number)=>Math.max(0,Math.min(1,v));
  const phase=time<timing.white?'white':time<formationEnd?'formation':time<rotationStart?'hold':time<rotationEnd?'rotation':time<exitStart?'settle':'exit';
  // The flow light keeps its own free-running clock: no stage gate, no fade, no reset at the loop.
  return {time,total,phase:reduced?'hold':phase,
    flowTime:reduced?0:elapsed,flowAmount:reduced?0:1,
    formation:reduced?1:motionEase((time-timing.white)/timing.formation),
    exit:reduced?0:motionEase((time-exitStart)/timing.exit),
    angle:reduced?0:Math.PI*rotationEase(clamp((time-rotationStart)/timing.rotation))};
}
