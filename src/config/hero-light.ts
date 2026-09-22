// Approved on 2026-09-22; see docs/project-log/hero-parameters.md.
export const heroLightDefaults = { grainAmount: 0.12, grainSize: 0.9, mobileXHeight: 390, desktopXHeight: 650 } as const;
export const heroLightTiming = { white: 1, formation: 6, hold: 1, rotation: 4, settle: 2, exit: 6 };
export const heroLightFlow = { widePeriod: 8, edgePeriod: 5, strength: 2.9, speed: 0.55 } as const;
// Peak slope equals the power, so these read directly as "how much faster than linear the
// middle runs". The earlier quintic S curve was equivalent to 1.875. Formation and exit share
// one value because the exit mirrors the formation; rotation is free to be punchier.
export const heroLightEase = { formation: 2, rotation: 3 };
export function normalizeFlow(value: {strength?:number;speed?:number} = {}) {
  return {
    strength:Number.isFinite(value.strength)?Math.max(0,Math.min(3,value.strength!)):heroLightFlow.strength,
    speed:Number.isFinite(value.speed)?Math.max(.25,Math.min(3,value.speed!)):heroLightFlow.speed
  };
}
export type HeroEase = typeof heroLightEase;
export const easeKeys = ['formation','rotation'] as const;
export function normalizeEase(value: Partial<HeroEase> = {}): HeroEase {
  const result={...heroLightEase};
  for(const key of easeKeys)if(Number.isFinite(value[key]))result[key]=Math.max(1,Math.min(8,value[key]!));
  return result;
}
export type HeroTiming = typeof heroLightTiming;
export const timingKeys = ['white','formation','hold','rotation','settle','exit'] as const;
export function normalizeTiming(value: Partial<HeroTiming> = {}): HeroTiming {
  const result={...heroLightTiming};
  for(const key of timingKeys)if(Number.isFinite(value[key]))result[key]=Math.max(['formation','rotation','exit'].includes(key)?1:0,Math.min(30,value[key]!));
  return result;
}
export function totalDuration(timing:HeroTiming){return timingKeys.reduce((sum,key)=>sum+timing[key],0);}
// Symmetric S curve with adjustable acceleration. power 1 is linear; higher values rest
// longer at both ends and accelerate harder through the middle. E(1-u) === 1-E(u) at every
// power, which is what lets the exit be an exact reversal of the formation.
export function motionEase(progress:number,power:number){
  const t=Math.max(0,Math.min(1,progress));
  if(t<=0||t>=1)return t;
  const rise=Math.pow(t,power);
  return rise/(rise+Math.pow(1-t,power));
}
export function heroFrame(elapsed:number,timing:HeroTiming,reduced=false,ease:HeroEase=heroLightEase){
  const total=totalDuration(timing),time=((elapsed%total)+total)%total;
  const formationEnd=timing.white+timing.formation,rotationStart=formationEnd+timing.hold;
  const rotationEnd=rotationStart+timing.rotation,exitStart=rotationEnd+timing.settle;
  const clamp=(v:number)=>Math.max(0,Math.min(1,v));
  const phase=time<timing.white?'white':time<formationEnd?'formation':time<rotationStart?'hold':time<rotationEnd?'rotation':time<exitStart?'settle':'exit';
  // The flow light keeps its own free-running clock: no stage gate, no fade, no reset at the loop.
  // Exit runs the formation backwards, so a cycle's last frame equals its first.
  const assembly=time<exitStart?motionEase((time-timing.white)/timing.formation,ease.formation):1-motionEase((time-exitStart)/timing.exit,ease.formation);
  // Keep turning into the next cycle instead of snapping to 0°, which would jump the flow light
  // across the seam; the silhouette is 180°-symmetric, so every other cycle lands back at 0.
  const turns=Math.floor(elapsed/total)%2;
  return {time,total,phase:reduced?'hold':phase,
    flowTime:reduced?0:elapsed,flowAmount:reduced?0:1,
    formation:reduced?1:assembly,
    angle:reduced?0:Math.PI*(turns+motionEase(clamp((time-rotationStart)/timing.rotation),ease.rotation))};
}
