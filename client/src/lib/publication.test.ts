import { describe,it,expect } from "vitest";
import { mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join,dirname,resolve,sep,basename } from "node:path";
import { createHash } from "node:crypto";
import { assertPublicDataTree,PUBLIC_DATA_FILES } from "../../../scripts/publication-contract.mjs";
function fixture(extra?:string){
 const root=mkdtempSync(join(tmpdir(),"sdg-publication-test-"));
 for(const name of [...PUBLIC_DATA_FILES,...(extra?[extra]:[])]){const path=join(root,name);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,"independent fixture")}
 return root;
}
function cleanup(root:string){if(!resolve(root).startsWith(resolve(tmpdir())+sep)||!basename(root).startsWith("sdg-publication-test-"))throw new Error("Unsafe fixture cleanup path");rmSync(root,{recursive:true,force:true})}
describe("public statistical asset publication boundary",()=>{
 it("allows only the three explicitly versioned current metadata/data assets",()=>{expect(assertPublicDataTree("client/public/data")).toEqual([...PUBLIC_DATA_FILES].sort())});
 it("rejects accidental legacy dictionary and raw/processed data reintroduction",()=>{
  for(const path of ["processed/data_dictionary.csv","raw/wdi_data_raw.parquet","releases/wdi-2026-10-11-candidate/old.csv"]){const root=fixture(path);try{expect(()=>assertPublicDataTree(root)).toThrow(/Unexpected public data/)}finally{cleanup(root)}}
 });
 it("preserves all nine relocated archival files against original byte hashes",()=>{
  const archive=JSON.parse(readFileSync("data/legacy/v1.0.0/archive-manifest.json","utf8"));expect(archive.files).toHaveLength(9);
  for(const file of archive.files){const bytes=readFileSync(file.archival_path);expect(bytes.length).toBe(file.bytes);expect(createHash("sha256").update(bytes).digest("hex")).toBe(file.sha256)}
 });
});
