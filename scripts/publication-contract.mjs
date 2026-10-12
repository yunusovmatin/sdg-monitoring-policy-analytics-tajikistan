import { readdirSync } from "node:fs";
import { join } from "node:path";
export const PUBLIC_DATA_FILES=["indicator-register.json","releases/wdi-2026-10-11-candidate/manifest.json","releases/wdi-2026-10-11-candidate/observations.csv"];
export function assertPublicDataTree(root){
 const allowed=new Set(PUBLIC_DATA_FILES),found=[];
 function walk(dir,prefix=""){
  for(const item of readdirSync(dir,{withFileTypes:true})){
   const path=prefix+item.name;
   if(item.isSymbolicLink())throw new Error(`Public data symlink forbidden: ${path}`);
   if(item.isDirectory()){
    if(!PUBLIC_DATA_FILES.some(name=>name.startsWith(path+"/")))throw new Error(`Unexpected public data directory: ${path}`);
    walk(join(dir,item.name),path+"/");
   }else{if(!allowed.has(path))throw new Error(`Unexpected public data asset: ${path}`);found.push(path)}
  }
 }
 walk(root);
 for(const file of allowed)if(!found.includes(file))throw new Error(`Missing required public data asset: ${file}`);
 return found.sort();
}
