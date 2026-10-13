import { defineConfig } from "@playwright/test";
export default defineConfig({
 testDir:"./e2e", timeout:30000, fullyParallel:false, workers:1,
 reporter:[["list"],["json",{outputFile:"test-results/results.json"}]],
 use:{baseURL:process.env.E2E_BASE_URL||"http://127.0.0.1:4173",viewport:{width:1440,height:1000},trace:"retain-on-failure"},
 webServer:process.env.E2E_BASE_URL?undefined:{command:"node scripts/qa-static-server.mjs",url:"http://127.0.0.1:4173",reuseExistingServer:false,timeout:30000}
});
