# Authenticated hosted verification — Project 1 v2

12 October 2026. **PASS WITH LIMITATIONS.** This execution supersedes the earlier authentication HOLD. Production promotion is not authorized by this report.

## Exact deployment and identity

- Preview: https://sdg-monitoring-policy-analytics-tajikistan-pe3nzcbef.vercel.app/
- Deployment: `dpl_5pnn7VFHSQGyadmWh8TGmTmXqyBA`, READY, preview target.
- Tested commit: `92ef6e50834b4d1f56c68628dd0183d9ae7bd1f7`; tree `b650f0398dc1e02100c50321f60964ef93b791d9`.
- Branch: `upgrade/production-quality-v2`, repository `yunusovmatin/sdg-monitoring-policy-analytics-tajikistan`.
- Account: `thefloppotron-6563`; existing project `prj_mImzlYOmFRA1sKk8yCLuEKM1WMo2`.
- Vercel deployment metadata identifies this exact commit. Hosted CSV, manifest and register match its Git blobs; entry JavaScript/CSS match the local validated build. All navigations were confined to this immutable preview URL.

## Authentication actually used

Windows host Vercel CLI 63.1.2, Node 24.14.0: `whoami` returned the intended account. Linked the existing project from the v2 application directory; no new project was created. The scoped linking attempt hit EXDEV; linking with the existing default account resolved it. Project inspection verified owner, ID, Vite, Node 24, root `.`, output `dist/public`; dashboard defaults show pnpm 10.4.1 while repository configuration pins the validated build settings. No settings were changed.

`vercel curl` returned HTTP 200 for the exact protected preview. Its supported flow automatically generated an automation bypass credential; no credential value or bypass URL was printed, exported or included in evidence. Browser tests used fresh development OIDC from `vercel env run`, held in process memory and attached as `x-vercel-trusted-oidc-idp-token` only to this preview origin. Native PDF downloads require browser network-layer interception: CDP Fetch was limited to this origin's `/reports/*` requests. API requests disallowed redirects. Traces, videos and browser-state persistence were disabled.

The CLI link unexpectedly created `.env.local` with a development token; that file was immediately deleted without reading or copying it, before testing. Subsequent OIDC use was memory-only. Existing user CLI login storage remains outside release artifacts. Deployment protection remains enabled; no permanent public bypass link, production alias change or project-wide protection weakening occurred.

## Final execution

**17/17 hosted tests passed in 48.3 seconds**: 12 platform regressions, three throttled performance checks and two supplemental hosted checks. No application code, analytical data or scenario coefficients changed. Existing exact-commit GitHub Actions run [38270624163](https://github.com/yunusovmatin/sdg-monitoring-policy-analytics-tajikistan/actions/runs/38270624163) remains SUCCESS. The authenticated suite tested application commit `92ef6e50834b4d1f56c68628dd0183d9ae7bd1f7`. The subsequent 13 October documentation-only child commit updates release records and adds a promotion checklist; it does not change application code, data, reports/PDF bytes, build configuration or tests. Its SHA and CI outcome are recorded separately in the release-preparation receipt. The 17 hosted passes are not a fresh test of a documentation-triggered deployment.

| Check | Executed result |
|---|---|
|Four direct routes `/`, `/dashboard`, `/policy-brief`, `/methodology`|200, content/CSP/nosniff verified; widths 1440, 390, 320; no horizontal overflow|
|Navigation and mobile controls|Named navigation links, active routes, direct refresh, mobile layouts and keyboard scenario controls passed|
|Accessibility scope|Scoped axe WCAG tags on all four routes at all three widths: zero violations; keyboard reveal/focus passed|
|Console and assets|Four route checks record zero console/page errors; response/request monitoring reports zero unexpected failures. One deliberately injected 503 was observed in the recovery test|
|Current definitions and snapshot|2021 PPP poverty wording, national-poverty comparability restrictions, SDG 7.2.1 mapping, release identity and byte hashes passed|
|Scenario and CSV exports|Defaults and 11,000-household adjustment independently recomputed from source values; exported values/vintage/footnotes/PPP/status checked|
|Time-series charts|Uzbekistan Gini: eight observations, three paths, calendar spacing ratio 18 in both charts; gap/welfare annotations visible. TJK poverty retains 2021–2024 values 25.6, 21.7, 20.4, 19.8|
|Failure handling|Injected 503 and corrupted CSV show explicit errors; retry restores the verified snapshot without fabricated zero values|
|PDFs|Actual mobile link downloads and authenticated HTTP responses passed; PDF MIME and both reviewed SHA256 hashes match exact local bytes|
|Legacy public data|All nine obsolete paths checked by content type, body, archive-byte comparison and CSV/Parquet signatures: no dataset exposure; HTML SPA fallback is allowed|
|Published identity|Deployment commit metadata, three public data files and entry JavaScript/CSS independently matched|

Dataset CSV SHA256: `2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae`. Policy PDF: `ca3402b97c1686f52ecce3e7df97c86f1ee888c90a65809e3ba87dc386342f8a`. Methodology PDF: `4a2d07ec181bab5ae44dffa20443bded3abd563c285de217d032157740ba05a4`.

## Failed attempts retained and diagnosed

Initial suite: 13/15 passed. First home cold LCP was 5.104 seconds, above the unchanged four-second threshold. A chart text assertion also failed because Python's Windows-default encoding corrupted an en dash in the temporary copied test. Explicit UTF-8 copying fixed the harness; no application assertion or threshold was relaxed.

The next full run passed the original 15 checks but failed two new supplemental checks. Chromium's native PDF download skipped ordinary Playwright route header injection and reached Vercel login; origin-limited CDP interception resolved authenticated downloads. Exact register-byte comparison incorrectly used the CRLF Windows working copy; comparison against the immutable Git blob passed. These were test/authentication representation defects, with intermediate receipts retained. The final complete 17-test run passed.

Final cold synthetic LCP (1.6 Mbps, 150 ms, 4x CPU): / 2.056s; /dashboard 3.100s; /policy-brief 2.088s. Home repeats after the initial outlier were 1.992 and 2.056 seconds. The first 5.104-second failure is not erased. These short authenticated synthetic samples show variability; they are not field Core Web Vitals, an SLA or real-device certification.

## Evidence and boundaries

Private project evidence: `Local Files/Production Quality v2/evidence/authenticated-hosted/`, including final/initial JSON results, logs, twelve full-route screenshots, chart screenshots/geometry, network receipts, performance samples, integrity hashes and the token-free private harness. The handoff ZIP includes this evidence and both updated reports. Authentication tokens, CLI configuration, dependencies, `.git` and browser state are excluded.

PDFs remain untagged and real assistive-technology/PDF-UA review is unperformed; accessible HTML reports are available. Monitoring remains manual; no activated alerts/on-call promise, hosted rollback drill, off-site recovery assurance or verified required-branch-check enforcement exists. External formal statistical/policy/security/accessibility certification remains pending. No institutional affiliation or official approval is claimed.

Frozen production, main and v1.0.0 remain at `207795554b4a9c8d9c8fcdd9ea9994664f41493e`, deployment `dpl_7H5MteLETjG7XXZh9L23KuFwsbHx`. No production replacement or sibling-project modification occurred.

## 13 October 2026 release-preparation audit

Retained final JSON and log agree on 17 passes in 48.3 seconds. Twelve route/width screenshots and chart evidence were inventoried and hashed; retained origin-scoped harness and exact data/Git-blob checks support the deployment identity. PNGs do not independently embed a signed commit; their hashes were recorded during this audit. The original 5.104-second failure and subsequent passing runs remain included. The four-second target is not universally achieved or a field SLA. See `PRODUCTION_PROMOTION_CHECKLIST.md` for the retained v1 rollback target and approval boundary.
