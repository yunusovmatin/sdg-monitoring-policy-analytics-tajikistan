import { useEffect, useState } from "react";
type Entry={classification:string;sdg:string;definition:string;source_url:string};
export default function IndicatorContext({code}:{code:string}) {
  const [register,setRegister]=useState<Record<string,Entry>>({});
  useEffect(()=>{const abort=new AbortController();fetch("/data/indicator-register.json",{signal:abort.signal}).then(r=>{if(!r.ok)throw Error("Registry unavailable");return r.json();}).then(setRegister).catch(()=>{});return()=>abort.abort();},[]);
  const item=register[code];
  return <div className="mb-6 rounded border border-blue-200 bg-blue-50 p-4 text-sm" aria-label="Indicator definition and classification">
    <p className="font-semibold">{code} · {item?.classification ?? "Definition register loading or unavailable"}</p>
    {item && <><p>{item.sdg}</p><p>{item.definition}</p>{typeof item.source_url==="string" && /^https:\/\/[^\s]+$/.test(item.source_url) && <a href={item.source_url} className="text-blue-800 underline" target="_blank" rel="noopener noreferrer">Authoritative definition</a>}</>}
    <p>Displayed observations use captured review release wdi-2026-10-11-candidate and its source responses. Current definitions do not authenticate the separate historical archive. See Methodology for vintage and comparability limits.</p>
  </div>;
}
