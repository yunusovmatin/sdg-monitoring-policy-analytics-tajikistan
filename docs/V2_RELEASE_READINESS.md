# Project 1 v2 release readiness

12 October 2026. Author/maintainer: Matin Yunusov. Independent portfolio platform with no UNDP affiliation.

**PASS WITH LIMITATIONS — promotion can be considered with disclosed limitations.** Project 1 v2 is technically ready to replace v1.0.0 for independently operated portfolio use, subject to the owner's separate approval of the exact release and acceptance of the operational limitations below. This recommendation is not permission to merge or replace production.

## Verified candidate

Commit `92ef6e50834b4d1f56c68628dd0183d9ae7bd1f7`, branch `upgrade/production-quality-v2`, protected preview https://sdg-monitoring-policy-analytics-tajikistan-pe3nzcbef.vercel.app/, deployment `dpl_5pnn7VFHSQGyadmWh8TGmTmXqyBA`.

Local quality gates: 36 application tests, 25 pipeline tests, TypeScript, frozen installation, production build, public-data allowlist, zero dependency advisories and zero heuristic current-source secret findings. Exact-commit GitHub Actions run 38270624163 succeeded. Authentication is now available, and **17/17 actual hosted tests passed**, including the original 15 tests plus native mobile report downloads/navigation/refresh and exact deployed asset/data checks. See HOSTED_VERIFICATION.md for attempts, test scope, methods and evidence.

## Analytical scope preserved

Pinned release `wdi-2026-10-11-candidate`: 2,315 finite observations, 17 indicators, six countries; 337 explicit nulls in the raw capture are not fabricated as zeros. CSV SHA256 remains `2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae`. Captured evidence includes 34 WDI and four PIP request receipts. Current indicators retain their definitions, metadata, PPP basis and observation status. National poverty is country-specific; no cross-country rank or numeric gap is presented. Missing years and documented welfare/survey breaks are not joined in charts.

The hypothetical default uses common 2024 baselines: poverty 19.8%, youth unemployment 14.556%, population 10,590,927 and six cohorts. Displayed 2030 ranges are poverty 18.6–19.1% and youth unemployment 13.4–13.9%. These are assumption-based arithmetic, not forecasts, empirical policy effects or confidence intervals. The unresolved legacy snapshot and unverified regional poverty dataset remain excluded from current analytical claims. Historical PDFs are not approved/current reports.

## Remaining limitations and proportionate release decisions

| Item | Independent portfolio release consequence |
|---|---|
|Manual monitoring; no activated alerts/on-call response|Owner must accept a manually maintained portfolio service and keep a checking/response arrangement. Blocks claims of continuous monitored service or institutional service-level readiness, rather than independent prototype publication itself|
|Rollback/recovery|Existing v1 production and immutable tag retained; offline 44-file candidate restoration and source/raw-value reconciliation passed. Hosted rollback drill and off-site backup assurance unperformed. Confirm previous deployment availability and owner rollback procedure at promotion; do not claim tested disaster recovery|
|Branch/CI enforcement|Workflow passes, but required-check enforcement is unverified and Vercel auto-build does not enforce the CI gate. Exact-commit manual approval remains necessary; no automatic production-release claim|
|PDF accessibility|PDFs remain untagged; metadata/bookmarks/citations and rendering were checked, but PDF-UA/screen-reader certification was not. Accessible HTML is the supported alternative. Disclose this; not a claim of certified accessibility|
|External review|User-supplied independent review exists, but no formal scoped statistical, policy, security or accessibility certification is recorded. Internal tests are not external certification|
|Institutional validation|No UNDP affiliation or institutional approval. Needed for official-status claims or institutional operation; not a prerequisite for running this independent portfolio website|
|Performance|Final samples meet four-second synthetic target, but initial home cold sample was 5.104s. Repeat home samples were 1.992s and 2.056s. No field-performance/SLA claim; retain the variability disclosure|

No unresolved application correctness, hosted authentication, routing, exported arithmetic, dataset-integrity or legacy-exposure blocker was found in the tested scope. Do not call the platform a certified or fully operated institutional service. No paid monitor, account change, institutional contact or project-wide protection change is needed to reach this independent portfolio recommendation.

## Production boundary

Current production remains v1.0.0, `207795554b4a9c8d9c8fcdd9ea9994664f41493e`, https://sdg-monitoring-policy-analytics-taj.vercel.app/, deployment `dpl_7H5MteLETjG7XXZh9L23KuFwsbHx`. main and v1.0.0 were independently rechecked and remain unchanged.

Before an authorized promotion: approve the exact tested release and disclosed scope, retain the previous deployment/tag, confirm the rollback owner/procedure, promote only that commit, verify the public routes/assets/data/exports, and record the new production receipt. None of those production mutations was executed here. A documentation-only child commit on the upgrade branch publishes this assessment and the promotion checklist. The tested application commit remains `92ef6e50834b4d1f56c68628dd0183d9ae7bd1f7`; the child commit SHA, exact docs-only diff and any CI outcome are recorded separately. No hosted pass is inferred for a newly auto-built documentation preview.

## 13 October 2026 release-preparation audit

Retained final JSON and log agree on 17 passes in 48.3 seconds. Twelve route/width screenshots and chart evidence were inventoried and hashed; retained origin-scoped harness and exact data/Git-blob checks support the deployment identity. PNGs do not independently embed a signed commit; their hashes were recorded during this audit. The original 5.104-second failure and subsequent passing runs remain included. The four-second target is not universally achieved or a field SLA. See `PRODUCTION_PROMOTION_CHECKLIST.md` for the retained v1 rollback target and approval boundary.
