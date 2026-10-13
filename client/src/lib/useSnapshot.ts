import { useEffect, useState } from "react";
import { parseData, type DataPoint } from "./data";
let request: Promise<DataPoint[]> | undefined;
function loadSnapshot() {
  return request ??= fetch("/data/releases/wdi-2026-10-11-candidate/observations.csv",{signal:AbortSignal.timeout(15000)}).then(async response => {
    if (!response.ok) throw new Error(`Snapshot request failed (${response.status})`);
    const bytes=await response.arrayBuffer();
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",bytes)),b=>b.toString(16).padStart(2,"0")).join("");
    if(digest!=="2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae") throw new Error("Snapshot integrity check failed; no observations loaded");
    return new TextDecoder("utf-8",{fatal:true}).decode(bytes);
  }).then(parseData).catch(error => { request=undefined; throw error; });
}
export function useSnapshot() {
  const [data,setData]=useState<DataPoint[]>([]);
  const [error,setError]=useState("");
  const [attempt,setAttempt]=useState(0);
  const retry=()=>{request=undefined;setError("");setAttempt(n=>n+1);};
  useEffect(()=>{let active=true; loadSnapshot().then(rows=>{if(active)setData(rows);}).catch(e=>{if(active)setError(String(e));});return()=>{active=false;};},[attempt]);
  return { data, error, retry, loading:!data.length && !error };
}
