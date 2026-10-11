import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
const receipts:unknown[]=[];
for(const route of ["/","/dashboard","/policy-brief"]){
 test(`cold throttled synthetic performance ${route}`,async({page,context})=>{
  const cdp=await context.newCDPSession(page);
  await cdp.send("Network.enable");await cdp.send("Network.setCacheDisabled",{cacheDisabled:true});
  await cdp.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:1_600_000/8,uploadThroughput:750_000/8});
  await cdp.send("Emulation.setCPUThrottlingRate",{rate:4});
  await page.addInitScript(()=>{(window as any).__qaLcp=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())(window as any).__qaLcp=entry.startTime}).observe({type:"largest-contentful-paint",buffered:true})});
  await page.goto(route);await expect(page.locator("main")).toBeVisible();await page.waitForLoadState("networkidle");await page.evaluate(()=>document.fonts.ready);
  const metrics=await page.evaluate(()=>{
   const navigation=performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
   const resources=performance.getEntriesByType("resource") as PerformanceResourceTiming[];
   return {fcp:performance.getEntriesByName("first-contentful-paint")[0]?.startTime,lcp:(window as any).__qaLcp,domContentLoaded:navigation.domContentLoadedEventEnd,load:navigation.loadEventEnd,transferBytes:resources.reduce((sum,r)=>sum+r.transferSize,0),resourceCount:resources.length};
  });
  receipts.push({route,...metrics,networkMbps:1.6,latencyMs:150,cpuSlowdown:4,lcpTargetMs:4000,method:"one cold synthetic Chromium measurement on local gzip static server, not field data"});
  mkdirSync("test-results",{recursive:true});writeFileSync(`test-results/performance-${route.replace(/\W/g,"_")||"home"}.json`,JSON.stringify(receipts.at(-1),null,2));
  expect(metrics.lcp).toBeGreaterThan(0);expect(metrics.lcp).toBeLessThanOrEqual(4000);
 });
}
