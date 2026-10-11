import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { resolve, sep, extname } from "node:path";
import { gzipSync } from "node:zlib";
const root=resolve("dist/public");const config=JSON.parse(readFileSync("vercel.json","utf8"));
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".csv":"text/csv; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".pdf":"application/pdf"};
createServer((req,res)=>{
 for(const {key,value} of config.headers[0].headers)res.setHeader(key,value);
 res.setHeader("Cache-Control","no-store");
 try{
  const url=new URL(req.url,"http://127.0.0.1:4173");let path=decodeURIComponent(url.pathname);
  if(path==="/")path="/index.html";
  path=config.rewrites.find(r=>r.source===path)?.destination||path;
  const file=resolve(root,"."+path);if(!file.startsWith(root+sep)||path.split("/").some(p=>p.startsWith(".")))throw new Error("Invalid path");
  if(!statSync(file).isFile())throw new Error("Not file");
  let content=readFileSync(file);res.setHeader("Content-Type",types[extname(file)]||"application/octet-stream");
  if(/gzip/.test(req.headers["accept-encoding"]||"")&&/\.(?:js|css|html|csv|json)$/.test(file)){content=gzipSync(content);res.setHeader("Content-Encoding","gzip");res.setHeader("Vary","Accept-Encoding")}
  res.writeHead(200);res.end(content);
 }catch{res.writeHead(404,{"Content-Type":"text/plain"});res.end("Not found")}
}).listen(4173,"127.0.0.1",()=>console.log("Local QA static server ready: http://127.0.0.1:4173"));
