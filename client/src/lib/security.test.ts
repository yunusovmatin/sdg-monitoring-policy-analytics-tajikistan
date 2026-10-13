import { describe, expect, it, vi } from "vitest";
import axios from "axios";
import { readFileSync } from "node:fs";
import { parseCsv, toCsv } from "./csv";
import { parseData, dashboardCsv } from "./data";
import { calculateScenario, DEFAULT_INPUTS } from "./scenario";
import { fetchIndicatorData } from "./worldBankApi";
vi.mock("axios",()=>({default:{get:vi.fn()}}));
const header="country_code,year,indicator_code,value\n";
const point={country_code:"TJK",country_name:"Tajikistan",indicator_code:"X",indicator_name:"Example",unit:"%",year:2023,value:20};
const baseline={year:2023,poverty:point,youth:{...point,value:27},population:{...point,value:10_000_000}};
describe("untrusted input and export boundaries",()=>{
 it("retains real candidate observation caveats and release metadata in downloadable exports",()=>{
  const text=readFileSync("client/public/data/releases/wdi-2026-10-11-candidate/observations.csv","utf8");
  const parsed=parseData(text);const [headers,...raw]=parseCsv(text);
  expect(parsed.filter(d=>d.footnote).length).toBe(514);
  const exported=parseCsv(dashboardCsv(parsed));
  for(let i=0;i<raw.length;i++)for(const field of ["footnote","ppp_basis","source_updated","observation_status"]){
   expect(parsed[i][field as keyof typeof parsed[number]]).toBe(raw[i][headers.indexOf(field)]);
  }
  expect(exported[0].slice(-4)).toEqual(["Footnote","PPP basis","Source updated","Observation status"]);
  expect(exported.slice(1).filter(r=>r[14]).length).toBe(514);
 });
 it("neutralizes formulas including whitespace/control prefixes but preserves numbers and Unicode",()=>{
  const cells=["=1+1","+SUM(A1:A2)","-cmd|' /C calc'!A0","@SUM(A1:A2)","\t=1+1","  =1+1","Ёвон, Тоҷикистон",-2,"-2.5","0"];
  const exported=parseCsv(toCsv([cells]))[0];
  for(let i=0;i<6;i++) expect(exported[i]).toBe("'"+cells[i]);
  expect(exported.slice(6)).toEqual(["Ёвон, Тоҷикистон","-2","-2.5","0"]);
 });
 it("rejects duplicate columns and observation keys without turning blanks into zero",()=>{
  expect(()=>parseData("country_code,year,indicator_code,value,value\nTJK,2023,X,1,2")).toThrow(/Duplicate dataset/);
  expect(()=>parseData(header+"TJK,2023,X,1\nTJK,2023,X,2")).toThrow(/Duplicate observation/);
  expect(parseData(header+"TJK,2023,X,\nTJK,2022,X,0")[0].value).toBe(0);
 });
 it("rejects nonfinite values, malformed identifiers and implausible years",()=>{
  for(const row of ["TJK,2023,X,Infinity","TJK,2101,X,1","../,2023,X,1","TJK,2023,X/../../,1"]) expect(()=>parseData(header+row)).toThrow();
  expect(()=>parseCsv('name\n"unclosed')).toThrow();
  expect(()=>parseCsv('na"me"')).toThrow();
  expect(()=>parseCsv('"name"extra')).toThrow();
 });
 it("rejects invalid denominators, future baselines and overflow inputs",()=>{
  for(const b of [{...baseline,year:2031},{...baseline,population:{...point,value:0}},{...baseline,poverty:{...point,value:101}}]) expect(()=>calculateScenario(b,DEFAULT_INPUTS)).toThrow();
  for(const input of [{...DEFAULT_INPUTS,households:1e308},{...DEFAULT_INPUTS,investmentPerHousehold:Infinity},{...DEFAULT_INPUTS,inflation:-99.99}]) expect(()=>calculateScenario(baseline,input)).toThrow();
 });
 it("has finite, ordered monotone bounds across calculator boundaries",()=>{
  let previous=100;
  for(const households of [0,1,1000,10000,50000,1e9]){
   const s=calculateScenario(baseline,{...DEFAULT_INPUTS,households});
   expect(s.povertyCentre).toBeLessThanOrEqual(previous); previous=s.povertyCentre;
   expect(s.povertyRange[0]).toBeGreaterThanOrEqual(0); expect(s.povertyRange[1]).toBeLessThanOrEqual(100);
   expect(s.povertyRange[0]).toBeLessThanOrEqual(s.povertyRange[1]);
   expect(Object.values(s).flat().every(Number.isFinite)).toBe(true);
  }
 });
 it("rejects URL path injection and unbounded dates before network access",async()=>{
  vi.mocked(axios.get).mockReset();
  for(const args of [["TJK/../../","X",2000,2023],["TJK","X?format=xml",2000,2023],["TJK","X",2024,2000]] as const) await expect(fetchIndicatorData(args[0],args[1],args[2],args[3])).rejects.toThrow(/Invalid World Bank/);
  expect(axios.get).not.toHaveBeenCalled();
 });
});
