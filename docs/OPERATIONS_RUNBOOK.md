# Operations runbook — v2 review candidate

Owner/author: Matin Yunusov. This independent service has no institutional operator or UNDP affiliation. No on-call agreement, paid monitoring, alert subscription, or production migration has been enabled by this upgrade. v1.0.0 remains the authorized production release until a separately reviewed v2 release is approved.

## Build and review gates

Use Node 24.14.0 and pnpm 10.34.6. From the repository root:

```sh
npx --yes pnpm@10.34.6 install --frozen-lockfile
npx --yes pnpm@10.34.6 security:scan
npx --yes pnpm@10.34.6 audit --audit-level=moderate
npx --yes pnpm@10.34.6 verify
npx --yes pnpm@10.34.6 exec playwright install --with-deps chromium
npx --yes pnpm@10.34.6 test:e2e
```

`Quality gates / verify` is the proposed required status check before merge. The workflow uses a read-only token, pinned action commits, frozen lockfile and no deployment credentials. Repository branch-protection enforcement and actual GitHub Actions run receipts must be separately verified; a workflow file alone does not enforce or prove a passing check. Browser tests may take up to 20 minutes under CI installation/network conditions. Candidate acquisition and canonical report generation commands are documented with their source-specific runbooks; review all outputs before accepting changed definitions or narrative.

## Release and rollback

1. Record reviewed code SHA, dataset release ID/checksums, report build receipt, vulnerability audit date, accessibility findings and unresolved analytical signoffs.
2. Deploy only a protected preview of that SHA. Inspect the four direct routes, headers/CSP, mobile reflow, keyboard controls, real downloaded exports and missing-data behavior. No production alias changes without explicit owner approval.
3. After approval, publish a new immutable tag, deploy that exact SHA, check Vercel metadata and public data bytes against Git, and retain the previous deployment. Never move `v1.0.0` or rewrite its snapshot.
4. If any critical data, privacy, routing or calculation failure occurs, stop candidate promotion. For an already approved newer production release, the owner can restore the previous verified Vercel deployment and alias using the dashboard/CLI after confirming its SHA. No automatic rollback system has been enabled.
5. After rollback, verify all routes, downloaded CSV arithmetic, dataset checksum and deployment metadata; attach an incident receipt to the release record. Restore datasets from immutable Git tags and a second private release archive, not a mutable live API response.

## Uptime and failed data loads

Run `node scripts/check-site.mjs https://<approved-host>/` for a bounded, nontracking HTTP route/data check. It produces a JSON receipt and nonzero exit on failure. The default dataset path is the v2 review candidate; for frozen v1.0.0 pass `/data/processed/sdg_tjk_tidy.csv` as the third argument. It is a manual monitor now: no scheduler, email, third-party telemetry or alerts were configured. Before production service claims, the owner must establish an approved periodic monitor, a destination for actionable failure alerts, response hours, and a recovery time objective. An HTTP 200 check alone cannot certify a working interactive interface; repeat browser smoke tests after each release.

A failed CSV request is an explicit error with a retry button; zero observations are never substituted. In-page caching is scoped to the immutable selected release and browser session; no service worker or persistent refresh cache is used. World Bank acquisition failures produce failed candidate evidence and retain the previous release, rather than overwrite it. UI live refresh is removed from the v2 review surface. Never mix a later poverty PPP definition into an archived series.

## Incident handling and recovery

Record UTC time, affected release/route, observable symptom and redacted technical evidence. Treat wrong definitions or misleading numerical claims as data incidents even when uptime is normal. Suspend publication for unresolved provenance, calculation or source-license failures. Correct in an isolated branch, rerun gates, request relevant analytical review and publish a new version only after approval. Do not include credentials or personal data in issue bodies. If a real credential is exposed, revoke it at its issuer and remove its published artifact; source pattern scanning is not sufficient containment.

## Maintenance and backups

Review dependency advisories monthly and before every release; registry results change over time. Apply compatible patches, rerun all gates, assess major upgrades separately. Review source freshness quarterly as candidate acquisitions; frequency does not imply statistical observations become available quarterly. Never silently approve a refresh. Preserve raw responses, metadata, transformations, checksums, release manifests and report source for each reviewed data release in Git/private evidence as appropriate. Keep a second release archive outside the checkout and verify its hashes quarterly. A local recovery check restored the frozen v1.0.0 CSV, calculator source and Vercel configuration from its Git commit and verified their hashes; private receipt: `evidence/recovery-test.json`. A full hosted rollback drill, off-site backup assurance and alert delivery drill remain pending owner authorization and execution.

## Privacy and capacity

No application login, analytics injection, advertising cookies or personal-data submission is included in this v2 frontend. Vercel may receive technical request metadata; browser-based World Bank requests would also reach that provider if the retained legacy helper were called. These infrastructure/provider practices are outside this local source audit. No claim of zero server logs or complete privacy certification is made. Application exports run in the user's browser. The current bundle budget is at most 350 kB gzip per JavaScript chunk; this is a regression threshold, not a measured low-bandwidth user experience guarantee. The final local cold Chromium run at 1.6 Mbps, 150 ms latency and 4x CPU slowdown measured LCP 2.008 s (home), 3.220 s (dashboard), and 2.032 s (policy brief), under the declared 4 s synthetic target; these single-run receipts are not field performance certification. Browser performance, real-device testing and assistive-technology findings belong in the staging verification report.
