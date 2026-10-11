import type {DataPoint} from "./data";
export const INCOMPATIBLE_CROSS_COUNTRY=new Set(["SI.POV.NAHC","SI.POV.GINI","SI.DST.FRST.20"]);
export const QUARANTINED_INDICATORS=new Set(["SI.POV.DDAY","SI.POV.LMIC"]);
export function analyticalIndicators(data:DataPoint[], currentDefinitionVerified=false) {
  return Array.from(new Map(data.filter(d=>currentDefinitionVerified || !QUARANTINED_INDICATORS.has(d.indicator_code)).map(d=>[d.indicator_code,{code:d.indicator_code,name:d.indicator_name,unit:d.unit}])).values());
}
export function comparableGap(a:DataPoint|null,b:DataPoint|null):number|null {
  if(a && INCOMPATIBLE_CROSS_COUNTRY.has(a.indicator_code) && a.country_code!==b?.country_code) return null;
  return a && b && a.year===b.year && a.indicator_code===b.indicator_code && a.unit===b.unit && a.source_kind===b.source_kind ? a.value-b.value : null;
}
