import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseData, comparisonRows, comparisonCsv, dashboardCsv, coverage, observation, latest, rankDescending } from "./data";
import { parseCsv } from "./csv";
import { ASSUMPTIONS, DEFAULT_INPUTS, calculateScenario, getScenarioBaseline, scenarioCsv } from "./scenario";
import { mergeLive } from "./live";
const data=parseData(readFileSync("data/legacy/v1.0.0/processed/sdg_tjk_tidy.csv","utf8"));
const baseline=getScenarioBaseline(data)!;
describe("analytical reconciliation",()=>{
 it("uses same-year national poverty, youth and population, without mixing poverty lines",()=>{
  expect(baseline.year).toBe(2023);expect(baseline.poverty.value).toBe(20.4);expect(baseline.youth.value).toBe(26.836);expect(baseline.population.value).toBe(10389799);
  expect(observation(data,"SI.POV.LMIC",2023)?.value).toBe(18.1);expect(getScenarioBaseline([])).toBeNull();
 });
 it("independently reconciles poverty slopes, youth-versus-total difference, ranks and coverage",()=>{
  const s=coverage(data);expect(s.count).toBe(2160);expect(s.expected).toBe(2448);expect(s.percentage).toBeCloseTo(88.2352941176);expect(s.indicators).toHaveLength(17);expect(s.countries).toBe(6);
  expect(((observation(data,"SI.POV.LMIC",2003)!.value-observation(data,"SI.POV.LMIC",2015)!.value)/12)).toBeCloseTo(3.8666666667);
  expect(baseline.youth.value-observation(data,"SL.UEM.TOTL.ZS",2023)!.value).toBeCloseTo(15.29);
  expect(rankDescending(data.filter(d=>d.year===2023 && d.indicator_code==="SL.UEM.1524.ZS"),"TJK")).toBe(2);
  expect(latest(data,"FP.CPI.TOTL.ZG")!.year).toBe(2016);
 });
 it("has no duplicated country/indicator/year observations",()=>{
  expect(new Set(data.map(d=>`${d.country_code}-${d.indicator_code}-${d.year}`)).size).toBe(data.length);
 });
});
describe("hypothetical scenario arithmetic",()=>{
 it("recomputes defaults over seven years with consistent household units",()=>{
  const s=calculateScenario(baseline,DEFAULT_INPUTS);expect(s.years).toBe(7);expect(s.reachedHouseholds).toBe(70000);expect(s.peopleReached).toBe(385000);expect(s.assumedPovertyExits).toBe(115500);expect(s.assumedYouthTransitions).toBe(8400);
  expect(s.povertyChange).toBeCloseTo(1.111667295);expect(s.youthChange).toBeCloseTo(1.05);expect(s.annualInvestment).toBe(5000000);expect(s.cumulativeInvestment).toBe(35000000);
  expect(s.povertyRange[0]).toBeCloseTo(18.9548325165);expect(s.povertyRange[1]).toBeCloseTo(19.6218328935);expect(s.youthRange[0]).toBeCloseTo(25.471);expect(s.youthRange[1]).toBeCloseTo(26.101);
 });
 it("collapses ranges at zero reach or zero assumed outcome, regardless of macro context",()=>{
  for(const inputs of [{...DEFAULT_INPUTS,households:0},{...DEFAULT_INPUTS,outcomeRate:0,gdpGrowth:10,inflation:15}]){
   const s=calculateScenario(baseline,inputs);expect(s.povertyRange).toEqual([20.4,20.4]);expect(s.youthRange).toEqual([26.836,26.836]);
  }
 });
 it("preserves direction, clips rates to 0-100 and handles extremes and invalid inputs",()=>{
  for(const households of [0,1000,50000,1e9])for(const outcomeRate of [0,10,90,100]){
   const s=calculateScenario(baseline,{...DEFAULT_INPUTS,households,outcomeRate});
   expect(s.povertyRange[0]).toBeGreaterThanOrEqual(0);expect(s.povertyRange[1]).toBeLessThanOrEqual(baseline.poverty.value);
   expect(s.youthRange[0]).toBeGreaterThanOrEqual(0);expect(s.youthRange[1]).toBeLessThanOrEqual(baseline.youth.value);
   expect(s.povertyRange[0]).toBeLessThanOrEqual(s.povertyRange[1]);expect(s.youthRange[0]).toBeLessThanOrEqual(s.youthRange[1]);
  }
  expect(()=>calculateScenario(baseline,{...DEFAULT_INPUTS,households:-1})).toThrow();expect(()=>calculateScenario(baseline,{...DEFAULT_INPUTS,outcomeRate:101})).toThrow();expect(()=>calculateScenario(baseline,{...DEFAULT_INPUTS,inflation:-100})).toThrow();
 });
 it("keeps macro inputs out of outcome effects and applies them only to context",()=>{
  const s=calculateScenario(baseline,DEFAULT_INPUTS),other=calculateScenario(baseline,{...DEFAULT_INPUTS,gdpGrowth:0,inflation:0});expect(s.povertyRange).toEqual(other.povertyRange);expect(s.youthRange).toEqual(other.youthRange);expect(other.gdpIndex).toBe(100);expect(other.finalRealAnnualInvestment).toBe(5000000);expect(s.gdpIndex).toBeCloseTo(140.7100422656);expect(s.finalRealAnnualInvestment).toBeCloseTo(3325285.568,0);
 });
 it("handles a zero-year horizon without fabricated cumulative effects",()=>{
  const s=calculateScenario({...baseline,year:2030},DEFAULT_INPUTS);expect(s.years).toBe(0);expect(s.reachedHouseholds).toBe(0);expect(s.cumulativeInvestment).toBe(0);expect(s.povertyRange).toEqual([20.4,20.4]);
 });
 it("exports the same displayed bounds, baseline year, source codes, assumptions and disclaimer",()=>{
  const rows=parseCsv(scenarioCsv(baseline,DEFAULT_INPUTS));expect(rows[1].slice(1,7)).toEqual(["SI.POV.NAHC","Bundled WDI snapshot","2023","20.4","19.0","19.6"]);expect(rows[2].slice(4,7)).toEqual(["26.8","25.5","26.1"]);expect(rows.some(r=>r.join().includes("not attributable impacts"))).toBe(true);expect(ASSUMPTIONS.sensitivity).toBe(0.3);
 });
});
describe("comparisons, ranks, exports and refresh",()=>{
 const a={...data[0],country_code:"TJK",country_name:'Tajikistan, "test"',indicator_code:"X",indicator_name:'Name, with "quotes"',unit:"persons",year:2020,value:0};
 const b={...a,country_code:"KGZ",year:2021,value:2};
 it("preserves zero, missing values and years in both chart and export",()=>{
  const rows=comparisonRows([a,b],"X","TJK","KGZ");expect(rows).toEqual([{year:2020,TJK:0,KGZ:null},{year:2021,TJK:null,KGZ:2}]);
  const exported=parseCsv(comparisonCsv([a,b],"X","TJK","KGZ"));expect(exported[1][4]).toBe("0");expect(exported[1][5]).toBe("");expect(exported[2][4]).toBe("");expect(exported[2][5]).toBe("2");
  expect(parseCsv(dashboardCsv([a]))[1][0]).toBe(a.country_name);expect(parseCsv(dashboardCsv([a]))[1][5]).toBe("0");
 });
 it("assigns competition ranks to ties, and no rank to missing countries",()=>{
  const rows=[a,{...b,value:0},{...b,country_code:"ARM",value:2}];expect(rankDescending(rows,"TJK")).toBe(2);expect(rankDescending(rows,"KGZ")).toBe(2);expect(rankDescending(rows,"ARM")).toBe(1);expect(rankDescending(rows,"UZB")).toBeNull();
 });
 it("keeps cached series when a country has no finite live rows, labels refreshed zeros and rejects incompatible poverty definitions",()=>{
  const live=[{countryiso3code:"TJK",country:{id:"TJ",value:"Tajikistan"},indicator:{id:"X",value:"Live X"},date:"2022",value:0},{countryiso3code:"KGZ",country:{id:"KG",value:"Kyrgyzstan"},indicator:{id:"X",value:"Live X"},date:"2022",value:null}];
  const merged=mergeLive([a,b],live,"X","2026-10-10");expect(merged.updated).toEqual(["TJK"]);expect(latest(merged.data,"X","TJK")?.source_kind).toBe("live");expect(latest(merged.data,"X","TJK")?.value).toBe(0);expect(latest(merged.data,"X","KGZ")?.year).toBe(2021);
  expect(()=>mergeLive(data,[{...live[0],indicator:{id:"SI.POV.LMIC",value:"Poverty at $4.20 (2021 PPP)"}}],"SI.POV.LMIC","today")).toThrow(/definitions differ/);
 });
 it("does not turn blank values into zero",()=>{
  expect(parseData("country_code,year,indicator_code,value\nTJK,2023,X,\n")).toEqual([]);
 });
});
