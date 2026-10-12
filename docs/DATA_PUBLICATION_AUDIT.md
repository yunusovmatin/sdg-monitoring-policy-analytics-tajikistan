# Data publication audit — final v2 corrections

Audit date: 12 October 2026. Baseline: upgrade commit `1d3916d0746097e8d6f91374dd5a488f6afc4601`. Historical v1.0.0 production and tag are preserved; this audit concerns the v2 candidate only.

## Verified defect and byte-preserving correction

The baseline Vite public directory included nine historical files in `client/public/data/raw/` and `client/public/data/processed/`. These were not required by the current application and would be copied into its build. The old dictionary included $2.15/$3.65 (2017 PPP) labels and the historical renewable-energy SDG 13 misclassification. Source-visible archived material is useful evidence; serving it in the current site's data directory was misleading.

All nine files are now outside Vite public assets at `data/legacy/v1.0.0/{raw,processed}`. `archive-manifest.json` records each original path, archival path, byte size and SHA-256. Relocation compared exact file bytes before/after. `.gitattributes` disables newline conversion for this archive so a fresh checkout preserves the recorded bytes. No historical observations, dictionary values, labels or classifications were modified. The archive README explicitly documents obsolete definitions and unresolved extraction vintage. Its dictionary is not current statistical authority.

The archive-only diagnostic helper reads the relocated historical CSV and writes only to archival figures; it cannot recreate public legacy plots. Existing v1 snapshot tests intentionally retain historical numerical expectations. Pipeline historical-diff and register-generation input paths now point to the archive. Historical reconciliation/scenario documents identify the relocated file path. The operations monitor's v1 URL is intentionally retained for checking the frozen v1 host, not for loading v2 data.

## Current deployed data contract

The complete allowed Vite data tree contains exactly:

| Public asset | Purpose |
| --- | --- |
| `/data/indicator-register.json` | Current definitions, SDG/proxy/context mapping and source metadata |
| `/data/releases/wdi-2026-10-11-candidate/observations.csv` | Captured review candidate, used by current charts/scenario/reports/exports; expected SHA-256 `2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae` |
| `/data/releases/wdi-2026-10-11-candidate/manifest.json` | Candidate scope, retrieval, checksum and governance manifest |

Raw current API evidence and the legacy archive remain repository evidence outside `client/public`, not anonymous application assets. Current candidate PPP definitions do not retrospectively validate the separate historical extraction.

## Regression and deployment checks

`assertPublicDataTree` checks both source and built data trees against an exact allowlist, rejects unknown files/directories and symlinks, and requires all three current assets. The existing production verification command executes this boundary check after every build. Independent temporary test fixtures demonstrate rejection of a reintroduced legacy dictionary, raw Parquet, and an unexpected CSV hidden inside the candidate directory. Archival tests verify all nine recorded byte hashes. Test input paths are distinct from current application data paths.

The browser/API suite requests all nine obsolete URLs and verifies content type and payload rather than relying on status alone. A SPA HTML fallback with status 200 does not count as a CSV. The tests reject legacy byte matches, Parquet signatures, CSV headers and data MIME types on these obsolete paths, while requiring the current candidate URL to return its exact source bytes as CSV. The local QA server supplies 404 responses; actual protected Vercel behavior must be recorded separately in `HOSTED_VERIFICATION.md` after authenticated redeployment. No hosted pass is asserted by this source audit.

Repeatable commands from the source root:

```sh
npx --yes pnpm@10.34.6 verify
python -m unittest discover -s scripts -p 'test_wdi_pipeline.py'
npx --yes pnpm@10.34.6 test:e2e
```

Private receipts are under Project 1 `Local Files/Production Quality v2/evidence/final-corrections-*`. Final tested SHA and protected staging responses are recorded in the final corrections/hosted release reports after validation and publication of the upgrade branch. Production promotion remains held until authorized.

## Final local result

The corrected `2.0.0-rc.2` candidate passed frozen installation, TypeScript, 36 application tests, 25 pipeline tests, production build and the exact three-file public-data assertion. All 15 browser tests passed, including direct routes `/`, `/dashboard`, `/policy-brief` and `/methodology` at 1440, 390 and 320 pixels, with no console/page errors or scoped automated axe findings. Nine obsolete URLs did not return archived CSV/Parquet bodies. Current CSV and both reviewed PDF downloads matched exact source bytes and expected SHA-256. All nine archival file hashes remain unchanged. Dependency audit and current-source heuristic secret scan recorded zero findings.

Actual Uzbekistan Gini SVGs show eight source dots in three spells (2000; 2002–2003; 2021–2025), with an 18-year gap occupying approximately 18 times one year's horizontal spacing in both charts. Selected CSV values and footnotes were unchanged. Tajikistan national-poverty source points remain 2021–2024: 25.6, 21.7, 20.4 and 19.8. Private numerical SVG receipts, screenshots and the combined `final-corrections-engineering-receipt.json` record this evidence.

Cold local synthetic LCP was 1.940 seconds home, 2.796 seconds dashboard and 2.064 seconds policy brief, each below the declared four-second target under 1.6 Mbps, 150 ms latency and fourfold CPU slowdown. These are individual local measurements, not hosted or field certification. Hosted matrix and authenticated preview asset checks were not executed because authorized protected access remains unavailable; local checks do not remove that release hold.
