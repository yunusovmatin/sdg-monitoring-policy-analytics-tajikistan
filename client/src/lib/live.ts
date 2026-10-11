import type { DataPoint } from "./data";
import type { WBIndicatorData } from "./worldBankApi";
export function mergeLive(data:DataPoint[],live:WBIndicatorData[],code:string,retrieved:string) {
  const meta=data.find(d=>d.indicator_code===code);
  if (!meta) throw new Error("Unknown indicator");
  const allowed=new Set(data.map(d=>d.country_code));
  const rows=live.filter(d=>d.indicator.id===code && allowed.has(d.countryiso3code) && d.value!==null && Number.isFinite(d.value) && /^\d{4}$/.test(d.date));
  if (code.startsWith("SI.POV.") && (code==="SI.POV.DDAY" || code==="SI.POV.LMIC")) {
    const snapshotThreshold=meta.indicator_name.match(/\$[\d.]+/)?.[0];
    if (rows.some(d=>!d.indicator.value.includes(snapshotThreshold ?? "") || !d.indicator.value.includes("2017"))) throw new Error("Live poverty definitions differ from the snapshot poverty line/PPP vintage; cached series retained");
  }
  const updated=Array.from(new Set(rows.map(d=>d.countryiso3code)));
  const fresh:DataPoint[]=rows.map(d=>({country_code:d.countryiso3code,country_name:d.country.value,year:Number(d.date),indicator_code:code,indicator_name:meta.indicator_name,value:d.value as number,unit:meta.unit,source_kind:"live",retrieved_at:retrieved,source_label:d.indicator.value}));
  return {updated,data:[...data.filter(d=>d.indicator_code!==code || !updated.includes(d.country_code)),...fresh]};
}
