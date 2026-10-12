# Project 1 v2 release readiness

Assessment date: 12 October 2026. Author/maintainer: Matin Yunusov. Independent portfolio application; no UNDP affiliation or institutional operator.

**Current recommendation: HOLD production replacement.** The two source defects are corrected and fresh local regression passed:36 application tests,25 pipeline tests,15 browser tests, TypeScript, frozen installation and production build. Protected hosted verification remains BLOCKED — AUTHENTICATION. Exact final commit/hosted CI receipts and operational gaps are recorded separately; local success cannot establish hosted acceptance. This assessment does not authorize merging or deploying production.

## Version and evidence boundary

The correction baseline is `1d3916d0746097e8d6f91374dd5a488f6afc4601` on `upgrade/production-quality-v2`. Frozen production remains v1.0.0, commit `207795554b4a9c8d9c8fcdd9ea9994664f41493e`, at https://sdg-monitoring-policy-analytics-taj.vercel.app/. The previously built protected candidate is https://sdg-monitoring-policy-analytics-tajikistan-9t4ksw382.vercel.app/. Its READY state confirms a deployment build, not hosted browser acceptance. The final correction commit, updated preview and hosted workflow receipt must be recorded in `V2_FINAL_CORRECTIONS.md` and `HOSTED_VERIFICATION.md` once verified.

The supplied independent review checked the baseline source/tree, raw-to-processed reconciliation and arithmetic, and reported the baseline [Quality gates run](https://github.com/yunusovmatin/sdg-monitoring-policy-analytics-tajikistan/actions/runs/38182013820) passed. Those are reviewed baseline receipts, not results for a later corrected commit. Earlier local results were27 application tests,25 pipeline tests,12 browser tests, TypeScript/build success and zero dependency advisories. Rerun results for the amended code supersede them.

## Four distinct readiness decisions

| Domain | Current evidence | Decision boundary |
|---|---|---|
|Internal engineering|Pinned dependencies/runtimes, CI workflow, immutable data checks, source security headers and local recovery proof exist. Fresh local regression is complete; authenticated preview acceptance is still required.|HOLD until corrected-commit validation and hosted checks are complete. A local build alone is insufficient.|
|Analytical/statistical QA|Captured current-definition WDI records are reproducible. Legacy poverty vintage remains unresolved and is excluded from current claims. Survey gaps/breaks and public archive exposure are targeted correction items.|A reproducible candidate can support scoped independent portfolio use after those defects pass verification; scenario assumptions remain hypothetical.|
|Independent external validation|The supplied review provides concrete reconciliation and code findings. No formal scoped statistical, policy, accessibility or security signoff is recorded.|PENDING. Do not claim independent certification or empirical scenario validation. This distinction does not automatically require institutional endorsement to run an independent portfolio website.|
|Formal institutional approval|No institutional agreement or authorized UNDP operation exists.|NOT GRANTED. Required only for claims of official affiliation/approval or institutional operation; do not represent it as a software test that can pass.|

## Data governance and statistical scope

The v2 application pins `wdi-2026-10-11-candidate`,2,315 finite observations,17 indicators and six countries. Its exact CSV SHA256 is `2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae`. Raw evidence contains2,652 observation records, including337 explicit nulls, with34 WDI request receipts and four PIP comparison receipts. No missing observations are invented or replaced with zero. The default educational calculation uses common2024 poverty19.8%, youth unemployment14.556% and population10,590,927; six cohorts yield hypothetical ranges18.6–19.1% and13.4–13.9%. These are arithmetic assumption/sensitivity ranges, not forecasts, calibrated effects or confidence intervals.

`useSnapshot.ts` loads one fixed versioned URL, verifies its SHA256 before parsing, imposes a15second timeout and exposes error/retry instead of fallback values. No user-facing live data refresh or automatic data-promotion job is configured. Acquisition creates a new candidate directory, refuses an existing one and records `CANDIDATE_NOT_APPROVED`; diffs retain pending approval fields. New acquisition files cannot automatically change the application pointer. The reviewed source and report pointer would require a code change and release process. This is source/version isolation plus a documented review gate, not a separate enforced statistical-approval service.

The archived prototype's original poverty PPP edition is unresolved. Archive removal from Vite's public tree must preserve its original bytes and definitions, and the build/hosted response-body checks must prove the old CSV/dictionary are no longer accidentally served. Numeric calendar axes, missing-year gaps and survey/welfare comparability breaks must pass updated regression/browser evidence. The candidate retains514 footnotes. National poverty, inequality and asynchronous comparison safeguards do not turn unlike measurements into harmonized series.

Unverified regional poverty/unemployment values are excluded from analysis; limited verified regional population evidence does not authenticate regional poverty or establish geographic programme priorities. Source reuse and attribution are documented; external national data-owner confirmation remains a separate scoped review, not an invented endorsement.

## Configured controls versus documented intentions

| Control | Actually implemented/configured | Not yet established |
|---|---|---|
|Availability checks|`scripts/check-site.mjs` is a manual bounded route/data-body smoke checker. It rejects failed requests and unexpected basic bodies.|No scheduler, active uptime alert delivery, response-hours agreement, incident destination or measured uptime SLA. HTTP success does not verify interactions or full dataset integrity.|
|Runtime error handling|Data failures expose retry; CSV integrity is checked; component failures use an error boundary. The static frontend has no application login/database.|No centralized runtime error alerting or field user-experience measurements. Do not claim zero infrastructure logs.|
|CI validation|`.github/workflows/quality.yml` runs on pull requests and pushes to main/upgrade branches with a read-only token, pinned action commits, Node24.14.0, pnpm10.34.6 and Python3.14.3. Failed steps fail the workflow.|Required-check/branch-protection enforcement must be verified remotely. The workflow contains no production deployment credential or promotion job.|
|Vercel build/promotion|Vercel configuration installs the frozen lockfile and builds `dist/public`; direct application-route rewrites and security headers are configured in source.|The Vercel build command itself does not execute every CI gate or mechanically wait for a successful workflow. Production promotion is blocked by the user's explicit approval requirement; source runbooks alone are not enforcement.|
|Preview protection|Existing preview authentication must remain enabled; use only authorized account/project-scoped access.|The newly corrected preview must be exercised with authenticated HTTP/browser evidence. Login pages and403 connector responses are not evidence that the app is defective.|
|Security|Version lock, scoped secret scanning, dependency audit commands, CSV controls, CSP, nosniff, frame restriction, permissions/referrer/HSTS headers exist.|Fresh audit/scan results and actual hosted header/CSP behavior are release receipts. No ASVS, penetration-test or whole-infrastructure certification is claimed.|
|Backups/recovery|Versioned Git data/source plus a new private backup and full offline restore were verified on12 October2026.|No off-site recovery assurance, timed hosted rollback drill or verified alert-delivery exercise. A second folder on the same disk does not provide disaster redundancy.|
|Refresh safeguards|New-directory candidate acquisition, source checksum checks, definition/PPP guards, versioned diffs, pinned UI/report release and explicit approval procedure.|No independent reviewer approval was fabricated, and no automatic production refresh was enabled.|
|Maintenance|Dependency/monthly and data/quarterly review procedures are documented; ownership is Matin Yunusov.|No executed recurring maintenance schedule or agreed operational response capacity was evidenced.|

The manual monitor currently checks recognizable CSV/HTML bodies, not the full interactive site or current snapshot hash. It is a useful smoke tool, not activated production monitoring. Introducing a paid service, permanent bypass secret or extra institutional operator requires separate authorization. No such resource was provisioned here.

## Recovery exercise actually executed

Private receipt: `Local Files/Production Quality v2/evidence/final-corrections/operational-recovery-receipt.json` (relative to the project folder). Runtime: CPython3.14.3 on Windows. The exercise copied all44 current data-release files into `candidate-data-backup-2026-10-12.zip`, restored them into a separate evidence directory and compared every restored file checksum with its source. All34 WDI and four PIP raw-request checksums matched. All2,315 recovered finite values matched their captured raw records; zero numerical mismatches. The restored candidate retained SHA256 `2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae`.

Backup ZIP SHA256: `f94af12de8adbfec1773f12cb7fcc9669f8195e567757d58b5ec91e74ca98533`. An attempted acquisition into the existing candidate directory exited1 with the immutable-candidate refusal, before requesting the network. Every existing file checksum remained unchanged. This safely demonstrates the existing-release overwrite guard; it is not a simulated remote outage or a claim to have tested every network failure.

Three v1 files—the CSV, calculator source and Vercel configuration—were restored byte-for-byte from tagv1.0.0 into private evidence. The recovered Git-LF CSV hashes `330c4d45bb149d0d18a023d59498d2100d8f427fb2ebe14c931e0bf77753a791`. No running deployment, production alias or source data was changed. This is **offline recovery verification**, not a hosted rollback rehearsal or off-site disaster-recovery test.

## Accessibility and documents

Automated browser/axe checks, keyboard/reflow and chart text alternatives are scoped evidence. Actual assistive-technology testing and a formal WCAG2.2AA review remain separate. Reconstructed PDF content, rendering and tagging changes must be recorded in the final report evidence. Successful generation or a readable screenshot does not establish PDF/UA or a meaningful tag structure. Accessible HTML reports remain the supported alternative where document tagging/reading-order limitations persist.

## Outstanding issues and owners

| Issue | Severity/release effect | Owner |
|---|---|---|
|Newly corrected protected preview lacks authenticated four-route/browser/download/asset evidence until obtained|Blocking for this user-defined promotion decision|Matin Yunusov/account authorization and release engineer|
|Legacy public-asset removal and chart-gap/comparability corrections passed local regression; hosted confirmation remains pending|Local defects resolved; hosted acceptance blocked|Application/release engineer|
|Final exact-SHA hosted CI receipt is provided in the handoff; repository required-check enforcement remains unverified|Validation/control gap; record actual enforcement or explicit owner-approved procedure|Repository owner/release engineer|
|Active monitoring, actionable alert destination/response owner and hosted rollback practice absent|Operational gap for a maintained production-grade service; do not describe a maintained service as complete|Matin Yunusov|
|PDF tagging/reading-order and real assistive-technology scope unresolved|Accessibility limitation; requires disclosure and accessible HTML alternative|Document/accessibility reviewer|
|Original extraction edition and unverified regional poverty remain unresolved but isolated|Nonblocking for correctly delimited current-candidate portfolio use; blocking for unsupported historical/regional claims|Statistical/data-source reviewer|
|Hypothetical household/youth effects and denominator assumptions uncalibrated|Nonblocking only as a clearly separate educational calculator; unsuitable for empirical forecasting/decision-impact claims|Policy/methodology reviewer|
|Independent scoped reviews pending|Blocks certification/independent-validation claims; assess appropriate review scope for intended use|External qualified reviewers, after consent|
|UNDP institutional authorization absent|Blocks institutional affiliation/official-operation claims, not an independent website|Actual institution and owner, only if that status is sought|

Promotion requires successful corrected-commit regression and authenticated hosted verification, an explicit operational decision on remaining gaps, and the user's separate approval of the exact release. Retain frozenv1.0.0 throughout. No endorsement, independent certification or production-promotion permission is inferred from this document.


## Corrected-candidate local execution outcome

Node24.14.0, pnpm10.34.6, Python3.14.3, Chromium/Playwright. Frozen installation,36 unit tests,25 pipeline tests, TypeScript/build, exact public-data allowlist and15 browser tests passed. All four routes were checked at1440/390/320 pixels with zero findings in the scoped axe checks and zero recorded application console/page errors. Actual Uzbekistan Gini SVG spacing ratio is18, with eight recorded points and three separate spells. Nine obsolete URLs were checked for body/MIME/CSV/Parquet exposure locally, and both PDF responses match reviewed byte hashes. The candidate CSV hash remains unchanged. Zero dependency advisories and zero current-file heuristic secret findings were recorded.

Latest single cold synthetic LCP:home1.940s/dashboard2.796s/policy brief2.064s,1.6Mbps,150ms,4xCPU. This is local synthetic evidence, not field performance. Commands/results, source-publication SHA/tree, CI link/outcome and corrected-preview metadata are in the final private execution/release receipts. No hosted-browser pass or formal accessibility certificate is inferred.
