import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { parseCsv } from "../client/src/lib/csv";
async function loadSection(page:import("@playwright/test").Page,name:string){
 const button=page.getByRole("button",{name:`Load ${name}`,exact:true});
 const title={"Comparison Tool":"Interactive Comparison Tool","Scenario Explorer":"Illustrative Scenario Explorer","Trend and Peer Charts":"Trend Analysis"}[name]!;
 const ready=page.getByRole("heading",{name:title,exact:true});
 await expect(button.or(ready)).toHaveCount(1);
 if(await button.count())await button.click({timeout:3000}).catch(async error=>{if(await button.count())throw error});
 await expect(ready).toBeVisible();
}
const candidatePath="client/public/data/releases/wdi-2026-10-11-candidate/observations.csv";
const [headers,...rows]=parseCsv(readFileSync(candidatePath,"utf8"));
const data=rows.map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]])));
const value=(code:string,year:number)=>Number(data.find(d=>d.country_code==="TJK"&&d.indicator_code===code&&Number(d.year)===year)?.value);
const years=data.filter(d=>d.country_code==="TJK"&&d.indicator_code==="SI.POV.NAHC").map(d=>Number(d.year)).sort((a,b)=>b-a);
const baselineYear=years.find(y=>["SI.POV.NAHC","SL.UEM.1524.ZS","SP.POP.TOTL"].every(code=>Number.isFinite(value(code,y))))!;
const expected=(households:number)=>{
 const cohorts=2030-baselineYear;
 const povertyDelta=households*cohorts*5.5*.3/value("SP.POP.TOTL",baselineYear)*100;
 const youthDelta=households*cohorts*.4*.3/800000*100;
 return [["National poverty",value("SI.POV.NAHC",baselineYear),povertyDelta],["Youth unemployment",value("SL.UEM.1524.ZS",baselineYear),youthDelta]].map(([name,base,delta])=>({name:String(name),lower:Math.max(0,Number(base)-Number(delta)*1.3).toFixed(1),upper:Math.max(0,Number(base)-Number(delta)*.7).toFixed(1)}));
};
for(const route of ["/","/dashboard","/policy-brief","/methodology"]){
 test(`direct route, reflow, console and scoped WCAG: ${route}`,async({page})=>{
  const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
  const response=await page.goto(route);expect(response?.status()).toBe(200);
  expect(response?.headers()["content-security-policy"]).toContain("script-src 'self'");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("NaN");
  if(route==="/dashboard"){for(const name of ["Comparison Tool","Scenario Explorer","Trend and Peer Charts"])await loadSection(page,name);}
  await page.setViewportSize({width:320,height:900});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  const report=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
  expect(report.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(errors).toEqual([]);
 });
}
test("candidate provenance, chart equivalents, scenario keyboard and downloadable arithmetic",async({page})=>{
 await page.goto("/dashboard");
 await expect(page.locator("body")).toContainText("wdi-2026-10-11-candidate");
 await page.getByText("Selected chart values and observation years (text alternative)",{exact:true}).click();
 await expect(page.locator("table").first()).toBeVisible();
 const [selectedDownload]=await Promise.all([page.waitForEvent("download"),page.getByRole("button",{name:"Export Selected Data",exact:true}).click()]);
 const selected=parseCsv(readFileSync((await selectedDownload.path())!,"utf8"));
 const sourceRows=data.filter(d=>d.indicator_code==="NY.GDP.PCAP.KD"&&["TJK","KGZ","UZB","KAZ"].includes(d.country_code));
 expect(selected.length-1).toBe(sourceRows.length);
 for(const row of selected.slice(1)){
  const source=sourceRows.find(d=>d.country_code===row[1]&&d.year===row[4])!;expect(source).toBeDefined();expect(Number(row[5])).toBe(Number(source.value));expect(row[12]).toBe(source.vintage);expect(row[14]).toBe(source.footnote);expect(row[15]).toBe(source.ppp_basis);expect(row[16]).toBe(source.source_updated);expect(row[17]).toBe(source.observation_status);
  await expect(page.locator("table").first()).toContainText(row[5]);
 }
 await loadSection(page,"Scenario Explorer");
 const slider=page.getByRole("slider",{name:"Annual Distinct Households"});
 await expect(slider).toHaveAttribute("aria-valuenow","10000");
 for(const households of [10000,11000]){
  if(households===11000){await slider.focus();await page.keyboard.press("ArrowRight");await expect(slider).toHaveAttribute("aria-valuenow","11000")}
  const [download]=await Promise.all([page.waitForEvent("download"),page.getByRole("button",{name:"Export Report",exact:true}).click()]);
  const path=await download.path();expect(path).not.toBeNull();
  const exported=parseCsv(readFileSync(path!,"utf8"));
  expect(exported.find(r=>r[0]==="Data vintage")?.[1]).toBe("wdi-2026-10-11-candidate");
  for(const e of expected(households)){
   const row=exported.find(r=>r[0]===e.name)!;expect(row).toBeDefined();expect(row[3]).toBe(String(baselineYear));expect(row[5]).toBe(e.lower);expect(row[6]).toBe(e.upper);
   await expect(page.locator("body")).toContainText(`${e.lower}`);
  }
 }
 await expect(page.getByRole("button",{name:/live|refresh world bank/i})).toHaveCount(0);
});
test("failed data load remains visible and retry recovers without fabricated zero",async({page})=>{
 await page.route("**/data/releases/**/observations.csv",route=>route.fulfill({status:503,body:"temporary failure"}));
 await page.goto("/dashboard");await expect(page.getByRole("button",{name:/retry/i})).toBeVisible();
 await page.unroute("**/data/releases/**/observations.csv");await page.getByRole("button",{name:/retry/i}).click();
 await expect(page.locator("body")).toContainText("wdi-2026-10-11-candidate");await loadSection(page,"Scenario Explorer");
 await expect(page.getByRole("slider",{name:"Annual Distinct Households"})).toBeVisible();
});

test("corrupt snapshot is quarantined and explicit retry restores verified bytes",async({page})=>{
 await page.route("**/data/releases/**/observations.csv",route=>route.fulfill({status:200,contentType:"text/csv",body:"country_code,year,indicator_code,value\nTJK,2024,SI.POV.NAHC,0\n"}));
 await page.goto("/dashboard");await expect(page.locator("body")).toContainText("Snapshot integrity check failed");
 await expect(page.getByRole("slider",{name:"Annual Distinct Households"})).toHaveCount(0);
 await page.unroute("**/data/releases/**/observations.csv");await page.getByRole("button",{name:/retry/i}).click();
 await expect(page.locator("body")).toContainText("wdi-2026-10-11-candidate");await loadSection(page,"Scenario Explorer");
 await expect(page.getByRole("slider",{name:"Annual Distinct Households"})).toBeVisible();
});

test("country-specific poverty avoids false rank/gap and current definitions carry their SDG mapping",async({page})=>{
 await page.goto("/dashboard");
 const select=page.getByRole("combobox",{name:"Select Indicator",exact:true});await select.click();
 await page.getByRole("option",{name:/Poverty headcount ratio at national poverty lines/}).click();
 await loadSection(page,"Trend and Peer Charts");
 await expect(page.locator("body")).toContainText("No cross-country rank");
 await loadSection(page,"Trend and Peer Charts");
 await loadSection(page,"Comparison Tool");
 await page.getByRole("combobox",{name:"Comparison Indicator",exact:true}).click();
 await page.getByRole("option",{name:/Poverty headcount ratio at national poverty lines/}).click();
 await expect(page.locator("body")).toContainText("No cross-country numeric gap is computed");
 await select.click();await page.getByRole("option",{name:/4\.20/}).click();
 await expect(select).toContainText("4.20");await expect(page.locator("body")).toContainText("2021 PPP");
 await select.click();await page.getByRole("option",{name:/Renewable energy consumption/}).click();
 await expect(page.locator("body")).toContainText("7.2.1");
});

test("keyboard reveal retains focus in its named region and continues to the calculator",async({page})=>{
 await page.setViewportSize({width:320,height:300});await page.goto("/dashboard");
 const load=page.getByRole("button",{name:"Load Scenario Explorer",exact:true});
 await expect(load).toBeAttached();await load.focus();await page.keyboard.press("Enter");
 const region=page.getByRole("region",{name:"Scenario Explorer",exact:true});
 await expect(page.getByRole("heading",{name:"Illustrative Scenario Explorer",exact:true})).toBeVisible();
 await expect(region).toBeFocused();await page.keyboard.press("Tab");
 await expect(page.getByRole("button",{name:"Export Report",exact:true})).toBeFocused();
});
