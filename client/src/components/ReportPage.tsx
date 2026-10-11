import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
type Report = { title: string; source: string; blocks: {type: "heading" | "paragraph" | "bullet"; text: string}[] };
export default function ReportPage({name}: {name: "policy-brief" | "methodology"}) {
  const [report,setReport]=useState<Report|null>(null);
  const [error,setError]=useState("");
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();
    setError("");
    fetch(`/reports/${name}.json`,{signal:controller.signal}).then(r=>{
      if(!r.ok) throw new Error(`Report unavailable (${r.status})`);
      return r.json();
    }).then(value=>{
      if(typeof value.title!=="string" || !Array.isArray(value.blocks) || value.blocks.some((b:Report["blocks"][number])=>!b || !["heading","paragraph","bullet"].includes(b.type) || typeof b.text!=="string")) throw new Error("Invalid report format");
      setReport(value);
    }).catch(e=>{if(!controller.signal.aborted)setError(String(e));});
    return ()=>controller.abort();
  },[name,attempt]);
  return <article className="container py-8 max-w-4xl">
    <h1 className="text-3xl font-bold mb-6">{report?.title ?? (name==="policy-brief" ? "Policy Brief" : "Methodology")}</h1>
    <p className="mb-6">Matin Yunusov — Independent Analytical Project. Not affiliated with or endorsed by UNDP. Reconstructed v2 report; external review pending.</p>
    {error ? <div><p role="alert">{error}</p><Button onClick={()=>setAttempt(n=>n+1)}>Retry report</Button></div> : !report ? <p role="status">Loading report…</p> : <>
      <div className="flex flex-wrap gap-6 mb-8"><a className="text-blue-700 underline" href={`/reports/${name}.pdf`} download>Download PDF</a><a className="text-blue-700 underline" href={`/reports/${name}.md`} download>Download canonical Markdown</a></div>
      {report.blocks.map((block,i)=>block.type==="heading" ? <h2 key={i} className="text-xl font-bold mt-8 mb-3">{block.text}</h2> : block.type==="bullet" ? <ul key={i} className="list-disc pl-6 mb-3"><li className="break-words">{block.text}</li></ul> : <p key={i} className="mb-4 leading-relaxed break-words whitespace-pre-line">{block.text}</p>)}
    </>}
  </article>;
}
