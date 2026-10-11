> Historical v1.0.0 record. Superseded for v2 review by docs/PRODUCTION_READINESS_REPORT.md and the versioned candidate evidence. This file does not validate current data definitions or the v2 release.

# Final validation report — Project 1

**Status: PASS WITH LIMITATIONS.** Local portfolio application validated on 10 October 2026. Author: Matin Yunusov. Independent analytical portfolio prototype; not commissioned, endorsed, reviewed or operated by UNDP. No external deployment or publication performed.

## Scope and version

Source directory: `D:/Codex/UNDP/Project 1 - SDG Monitoring & Policy Analytics Framework (Applied Case Tajikistan)/codex-handoff-sdg-dashboard/sdg-dashboard-web`.

Baseline recorded before analytical correction: `e80a8b80000de3e5ef50b08cc616ad8a97643fc1`. This report belongs to the final correction commit. Its final hash and archive digest are recorded in the adjacent project-private handoff file after committing, avoiding a self-referential commit hash. Earlier FINAL_POLISH_REPORT.md is marked historical and superseded.

Corrected national poverty/youth scenario baselines; replaced unsupported rate coefficients and five-year scaling with transparent seven-cohort arithmetic; reconciled brief figures and causal language; regenerated diagnostics; labelled regional data unverified; corrected comparison/export zero, year, rank and provenance logic; aligned methodology to actual coverage and supplied files; enabled mobile navigation and keyboard regional selection; added text chart alternatives, focus styles and descriptive image alternatives. No indicators, countries or major features added. No sibling projects changed.

## Exact changed files

- `FINAL_POLISH_REPORT.md`
- `FINAL_VALIDATION_REPORT.md`
- `client/index.html`
- `client/public/data/tajikistan_subnational.json`
- `client/public/diagnostic-poverty-trend.png`
- `client/public/diagnostic-remittances-poverty.png`
- `client/public/favicon.svg`
- `client/src/App.tsx`
- `client/src/components/CountryComparisonTool.tsx`
- `client/src/components/ScenarioPlanner.tsx`
- `client/src/components/SubnationalMap.tsx`
- `client/src/components/ui/slider.tsx`
- `client/src/index.css`
- `client/src/lib/analytics.test.ts`
- `client/src/lib/data.ts`
- `client/src/lib/download.ts`
- `client/src/lib/live.ts`
- `client/src/lib/scenario.ts`
- `client/src/lib/useSnapshot.ts`
- `client/src/lib/worldBankApi.test.ts`
- `client/src/lib/worldBankApi.ts`
- `client/src/main.tsx`
- `client/src/pages/Dashboard.tsx`
- `client/src/pages/Home.tsx`
- `client/src/pages/Methodology.tsx`
- `client/src/pages/PolicyBrief.tsx`
- `docs/NUMERICAL_RECONCILIATION.md`
- `docs/SCENARIO_ASSUMPTIONS.md`
- `docs/SOURCES_REQUIRED.md`
- `scripts/regenerate_diagnostics.py`
- `vite.config.ts`

## Checks executed and results

Commands ran explicitly in the source directory above. Exact support scripts and logs remain within this project's Local Files folder. Dependency installation used the repository-pinned pnpm 10.4.1, although pnpm also exists as a development dependency at a different version; that dependency did not select the executing package-manager version.

| Command / check | Result |
|---|---|
| `npx --yes pnpm@10.4.1 install --frozen-lockfile` | PASS; lockfile unchanged |
| `npx --yes pnpm@10.4.1 check` | PASS; TypeScript no errors |
| `npx --yes pnpm@10.4.1 build` | PASS; Vite client and esbuild server generated |
| `npx --yes pnpm@10.4.1 exec vitest run` | PASS; 17 tests in 3 files (2 existing CSV, 13 analytical, 2 API boundary tests) |
| Project-support `.venv/Scripts/python.exe check_integrity.py` | PASS; CSV/Parquet core equality, dictionaries, derived changes, keys and original hashes |
| Project-support `.venv/Scripts/python.exe check_final_exports.py` | PASS; independent arithmetic against actual production-browser CSV downloads at all widths; comparison observations and partial-live zero/source provenance |
| `node ../../Local Files/Analytical Correction 2026-10-10/verify-browser.mjs` | PASS on development build after fixes |
| `$env:SDG_VERIFY_URL='http://127.0.0.1:3012'; node ../../Local Files/Analytical Correction 2026-10-10/verify-browser.mjs` | PASS on final production preview |
| `git diff --check` | PASS before final commit |

Final production preview started with `npx --yes pnpm@10.4.1 preview --host 127.0.0.1 --port 3012 --strictPort`. This is local validation, not deployment. Figure regeneration: `.venv/Scripts/python.exe scripts/regenerate_diagnostics.py` (project-private Python environment with pandas/matplotlib). The checked-in script reads only the existing CSV; no observations were fabricated.

Regression coverage includes common-year scenario baseline, distinct poverty definitions, seven-year defaults, zero reach and zero outcome, extreme/clamped outcomes, invalid input, zero-year horizon, context-only macro sliders, displayed/exported agreement, missing versus zero, CSV quoting/round trip, competition ties, asynchronous year evidence, rejected incompatible live poverty definitions, partial success, all-failed/no-observation API cases and timeout configuration. Independent downloaded figures match defaults 19.0–19.6% poverty and 25.5–26.1% youth; changing annual households to 11,000 matches 18.8–19.5% and 25.3–26.0%.

## Fresh browser and visual checks

Chromium, widths 1440, 390 and 320, viewport height 1000. All four routes (`/`, `/dashboard`, `/policy-brief`, `/methodology`) loaded; no document-level horizontal overflow. Navigation links remain visible at each width. Full total/youth indicator names remain readable. Keyboard selectors, slider Home/ArrowRight, reset, exports, regional Enter selection and visible focus were checked. Mouse tooltip over an actual plotted comparison point remained within the viewport at every width. Text alternatives supply chart values and units without relying on colour. Snapshot scenario values stay unchanged after the simulated one-country live zero response; other countries retain cached source labels. No console/page errors, missing assets or displayed NaN in final checked states.

Production screenshots generated for each width: `home-{width}.png`, `dashboard-{width}.png`, `policy-brief-{width}.png`, `methodology-{width}.png`, `indicator-options-{width}-total.png`, `indicator-options-{width}-youth.png`, `chart-tooltip-{width}.png`, `scenario-default-{width}.png`, `subnational-keyboard-{width}.png`, `footer-{width}.png`; plus `live-partial-390.png`. Route ARIA snapshots accompany screenshots. Browser CSVs: scenario-default, scenario-changed, comparison-inflation and dashboard-selected for every width, plus live-partial-selected.csv. JSON contains width/route overflow values and interaction outcomes. Narrow-screen scenario, region and tooltip captures and both regenerated diagnostic images were visually inspected; regional names now use one column on narrow screens and the navigation no longer overlays scrolled card content.

The browser checks and semantic review are limited accessibility evidence. No NVDA/JAWS, real touch-device, full contrast audit or formal WCAG certification was performed. Mouse tooltip evidence does not certify touch usability; equivalent values remain available in semantic text tables.

## Data integrity and sources

17 unique indicators; six original countries; 2160 finite observations; 2000–2023 envelope; 2448 possible slots; 88.2352941176% coverage; no duplicate country/code/year keys. CSV and Parquet keys/values/names/units agree. Coverage-by-country and time-coverage tables match CSV aggregates. Derived changes agree with successive supplied observations, but 41 change rows span multi-year gaps; documentation warns these are not always annual changes. Supplied raw table has 2550 rows and six columns. Original ETL scripts are absent, so full historical cleaning cannot be reproduced from this package.

Live API transport was separately probed against the real World Bank endpoint for TJK youth unemployment for 2023; response saved privately. It proves endpoint access only, not equality of all contemporary and bundled values. Deterministic mocks verify partial failure and zero handling; no claim that all six countries were actually refreshed is made. Successful selected-indicator countries are individually labelled live with retrieval time; failed/missing countries remain snapshot. New poverty-threshold labels are rejected to avoid mixing incompatible definitions.

Historical CSV SHA-256: `330c4d45bb149d0d18a023d59498d2100d8f427fb2ebe14c931e0bf77753a791`, unchanged. Archive PDF hashes unchanged:

- `docs/reference/Tajikistan_SDG_Snapshot_2026.pdf`: `0971124ef5a1bba136fd70dc0dec24aab22fdf6512782dc2120acd73e0cc6995`.
- `docs/reference/Tajikistan_SDG_Snapshot_2026_REVISED.pdf`: `67f9f0caf7dd112e8e99b3c3d5e848f3e4d9570ba04c90fc21dcbfab57e9527a`.

## Warnings, failures resolved and remaining limits

During correction, tests exposed floating-point exact-comparison and TypeScript iteration-target issues; repaired using appropriate numerical tolerance/compatible iteration and rerun successfully. Browser checks found missing debug-collector and favicon assets; collector injection now requires the asset, favicon supplied, final run clean. A tooltip automation attempt timed out because another plotted country point overlapped it; moving the actual mouse to the point coordinates verified the shared tooltip, without bypassing pointer events. Narrow regional names and sticky navigation overlap were corrected and production screenshots refreshed.

Remaining installation warnings: legacy `url.parse()` deprecation from package tooling and ignored install scripts for @tailwindcss/oxide and esbuild; installed runtime binaries nevertheless completed build. Build retains an approximately 934 kB minified JavaScript chunk and Vite's >500 kB warning. These are disclosed performance/tooling limits, not failed checks. Dependencies were not upgraded and no redesign/code splitting was introduced.

Regional values cannot be authenticated from generic attribution; explicit unverified sample labels replace official-looking geographic conclusions. Household-size, youth-stock/candidate and sensitivity assumptions are uncalibrated. No causal impact, statistical confidence, official target attainment or feasible programme-scale guarantee is established.

Original `docs/Tajikistan_SDG_Snapshot_2026.md` and `_REVISED.md` remain unavailable after searching supplied repository/project materials, attachments and Downloads. No reconstruction was presented as an original. PDF controls remain disabled with an explanation. Original PDFs remain historical, excluded from Git/public output; direct old PDF paths do not return application/pdf. PDFs have not been revised. This gap does not block the corrected application.

No outstanding application test failures remain. Present as an independent portfolio prototype with these limits visible; do not present as an official monitoring product or empirically validated policy simulator.

## Validation artefact location

`D:/Codex/UNDP/Project 1 - SDG Monitoring & Policy Analytics Framework (Applied Case Tajikistan)/Local Files/Analytical Correction 2026-10-10/`

Key files: `install-final.log`, `typecheck-final.log`, `tests-final.log`, `build-final.log`, `browser-production.log`, `browser-production/browser-results.json`, route screenshots/ARIA snapshots/actual CSV downloads, `data-integrity.json`, `independent-export-validation.json`, `input-hashes.json`, `audit-baseline.json`, `real-api-probe.json`, reproducible support-check scripts. Private evidence, archived references and development artefacts are excluded from published source. Final `FINAL_HANDOFF.md` records the commit hash/archive digest after the commit.
