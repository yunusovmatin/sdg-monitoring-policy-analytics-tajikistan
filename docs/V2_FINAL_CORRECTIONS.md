# Project 1 v2 — final corrections

12 October 2026. Author: Matin Yunusov. Independent analytical portfolio application; no UNDP affiliation.

Baseline: `1d3916d0746097e8d6f91374dd5a488f6afc4601`. A recoverable local checkpoint `checkpoint/v2-rc1-before-final-corrections` preserves this revision. All corrections remain on `upgrade/production-quality-v2`; production v1.0.0, `main` and its tag remain unchanged.

## Defects addressed

1. Legacy public assets: `client/public/data/raw/` and `processed/` are moved byte-for-byte to `data/legacy/v1.0.0/`. The archive retains original definitions and observations; it is explicitly historical. Pipeline/registry scripts and archival regression tests now use the archival location. A build allowlist and regression checks reject accidental legacy reintroduction. See `DATA_PUBLICATION_AUDIT.md` for the exact files and checks.
2. Chart integrity: `DashboardCharts.tsx` and `CountryComparisonTool.tsx` use numeric year spacing and separate chart segments, through new `client/src/lib/timeSeries.ts`. Missing-year stretches and recognized measurement boundaries are not connected; isolated values have dots. New `timeSeries.test.ts` and browser regression evidence address calendar distance, missingness and survey/welfare changes. Existing source values, metadata, text tables and exports are preserved. See `TIME_SERIES_INTEGRITY.md`.
3. Report accessibility: the existing report pipeline is assessed and improved only within its supported scope. See `REPORT_GENERATION_AND_REVIEW.md` for actual PDF structure checks and residual accessibility limitations. HTML reports remain the accessible alternative; no PDF/UA certificate is claimed.
4. Operational review: `V2_RELEASE_READINESS.md` distinguishes implemented controls from proposed or unverified ones. Private recovery receipts demonstrate source/data restoration and refresh quarantine. No production rollback, paid monitoring service or institutional contact occurred.

## Evidence and release boundary

Final command logs, environment versions, unit/data/browser results, audit/scan receipts, rendered reports, archive checksums and hosted GitHub Actions outcome are supplied with the updated handoff. A final receipt identifies the exact published source commit and corrected preview, avoiding a self-referential commit hash inside its own source tree. Earlier 27/25/12 test counts apply to the baseline only; corrected-source counts must be read from the final execution receipts.

Protected hosted verification is separately documented in `HOSTED_VERIFICATION.md`. No local test or successful deployment build is represented as authenticated hosted acceptance. Overall production replacement remains HOLD until that release gate is satisfied and the owner explicitly authorizes promotion. Formal external certifications and institutional endorsements remain ungranted; they are distinct from internal engineering readiness and do not require portraying this independent website as an official UNDP system.


## Fresh local results

Corrected candidate2.0.0-rc.2:36 application tests,25 data-pipeline tests and15 browser tests passed, including the required three route widths, actual SVG calendar-distance/segmentation, exports and exact PDF downloads. Frozen installation, TypeScript, production build/public-asset assertion, dependency audit and scoped secret scan passed. Browser completion:39.4seconds. Audit advisories:zero; current-file heuristic secret findings:zero. Dataset SHA256 remains2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae.

Additional UI clarity correction:the previous Clear button actually retained Tajikistan; its label now reads Tajikistan Only, preserving the existing selection behavior.


## Fresh-runner CI correction

The first corrected-source GitHub Actions run38265810062 passed installation, data/report checks, audit, TypeScript/build and14 of15 browser tests. The remaining test failed while writing chart evidence to a local-only sibling directory, after its SVG assertions had passed. Evidence output now creates an ignored test-results/chart-evidence directory itself. The full local browser suite passed again15/15 in37.7seconds from a clean Playwright output directory. The final hosted run must pass on the amended exact commit; the initial failure is retained in private evidence. No chart assertion or acceptance threshold was relaxed.
