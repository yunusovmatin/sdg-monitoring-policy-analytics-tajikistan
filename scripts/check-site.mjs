const raw=process.argv[2];
if(!raw)throw new Error("Usage: node scripts/check-site.mjs https://approved-host/");
const base=new URL(raw);if(!["https:","http:"].includes(base.protocol)||base.username||base.password)throw new Error("Invalid public site URL");
const datasetPath=process.argv[3]||"/data/releases/wdi-2026-10-11-candidate/observations.csv";
if(!datasetPath.startsWith("/data/")||!datasetPath.endsWith(".csv"))throw new Error("Invalid dataset path");
const checks=[];
for(const route of ["/","/dashboard","/policy-brief","/methodology",datasetPath]){
 const start=performance.now();try{const response=await fetch(new URL(route,base),{signal:AbortSignal.timeout(15000),redirect:"error"});const text=await response.text();const data=route.endsWith(".csv");checks.push({route,status:response.status,ok:response.ok&&(data?text.startsWith("country_code,"):text.includes('id="root"')),milliseconds:Math.round(performance.now()-start)})}catch{checks.push({route,ok:false,error:"Request failed or timed out"})}
}
console.log(JSON.stringify({checkedAt:new Date().toISOString(),host:base.origin,checks,scope:"HTTP and asset smoke check; excludes interactive browser behavior"},null,2));if(checks.some(c=>!c.ok))process.exit(1);
