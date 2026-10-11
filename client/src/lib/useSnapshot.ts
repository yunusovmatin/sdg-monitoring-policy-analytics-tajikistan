import { useEffect, useState } from "react";
import { parseData, type DataPoint } from "./data";
let request: Promise<DataPoint[]> | undefined;
function loadSnapshot() {
  return request ??= fetch("/data/processed/sdg_tjk_tidy.csv").then(response => {
    if (!response.ok) throw new Error(`Snapshot request failed (${response.status})`);
    return response.text();
  }).then(parseData).catch(error => { request=undefined; throw error; });
}
export function useSnapshot() {
  const [data,setData]=useState<DataPoint[]>([]);
  const [error,setError]=useState("");
  useEffect(()=>{let active=true; loadSnapshot().then(rows=>{if(active)setData(rows);}).catch(e=>{if(active)setError(String(e));});return()=>{active=false;};},[]);
  return { data, error, loading:!data.length && !error };
}
