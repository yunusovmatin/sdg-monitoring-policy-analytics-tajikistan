# v2 production-readiness baseline

Audit initiated 2026-10-11 by Codex for Matin Yunusov. Internal assessment; external review pending.

## Change control

Repository: https://github.com/yunusovmatin/sdg-monitoring-policy-analytics-tajikistan. Authenticated connector login independently returned `yunusovmatin`. Local `main`, `origin/main` and immutable baseline tag `v1.0.0` identify `207795554b4a9c8d9c8fcdd9ea9994664f41493e`. Public Vercel alias was independently inspected through the deployment API: READY, production, deployment `dpl_7H5MteLETjG7XXZh9L23KuFwsbHx`, creator `thefloppotron-6563`, exact baseline GitHub SHA. The upgrade checkout is separate, on `upgrade/production-quality-v2`. No main/tag/production changes authorized.

## Inventory and trust boundaries

127 tracked files at baseline: React/TypeScript frontend, four primary routes, UI primitives, Recharts, scenario and CSV libraries, optional unauthenticated World Bank requests, supplied raw/processed CSV and Parquet, 17 indicators/six countries, unverified regional JSON, static diagnostic figures, three analytical documents, historical validation reports, server development fallback, Vite configuration and pnpm lock. Baseline has 17 unit tests; no CI workflow. Static Vercel output is `dist/public`. Private archives, credentials, dependencies and historical reference PDFs are excluded. A browser refresh can change selected displayed country series while reports and scenario retain the snapshot; the API is an external trust boundary.

Inventory commands: `git ls-files`, `git status --short --branch`, `git log -3 --oneline`, `git rev-parse v1.0.0`, `git worktree list`. Inspected application pages, chart/export helpers, scenario, snapshot loader, live merge/API helpers, main entry, Vite and package configuration; specialist reviews continue in the implementation journal.

## Verified defects and evidentiary gaps

| Priority | Finding | Evidence and disposition |
|---|---|---|
| Critical | Renewable energy classified as SDG 13 | Methodology heading; UNECE/UNSD identify renewable share as 7.2.1. Correct to SDG 7 and distinguish context/proxies. |
| Critical | International poverty numeric vintage not authenticated | Bundled old PPP labels, recorded extraction after June 2025 change, original extraction payload absent. World Bank factsheet changes same-code definitions. Preserve bytes; quarantine international-poverty comparisons until authenticated. |
| High | Regional values explicitly unverified | JSON and module disclaimer. Remove numeric module from analytical UI; investigate primary tables separately. |
| High | Historical ETL absent | Only diagnostic regeneration script supplied. Build new extraction pipeline; do not call it recovered historical ETL. |
| High | Report downloads unavailable | Disabled buttons require absent originals. Author reconstructed canonical reports, generate PDF and HTML from their sources. |
| High | Live updates do not constitute reviewed data release | Dashboard refresh merges selected series; no persisted candidate approval. Replace public live mutation with governed candidate refresh instructions. |
| High | Engineering/accessibility evidence incomplete | No formal independent assessment, no CI at baseline. Run scoped audits and tests; report unexecuted criteria. |
| Medium | Full app imported eagerly | App imports all four pages, historical build advisory around 933 kB. Measure, split routes, retain actual measurements. |
| Medium | Failed snapshot load has no user retry | Loader resets internal promise but component effect does not rerun. Add explicit retry and accessible error/loading state. |
| Medium | Some comparisons mix observation years | Warning disclosed but numeric gap/ranking still computed. Suppress asynchronous gaps/ranks. |
| Medium | Dev collection tooling in Vite configuration | Logging middleware, runtime plugin. Remove from maintained static architecture. |

Security vulnerability severity, actual WCAG failures and performance costs are concerns requiring executed checks, not assumed defects. Official adoption and institutional certification are outside code implementation; all signoffs remain pending.

## Primary references

- https://www.worldbank.org/en/news/factsheet/2025/06/05/june-2025-update-to-global-poverty-lines
- https://w3.unece.org/SDG/en/Indicator?id=23
- https://unstats.un.org/sdgs/metadata/

This is a baseline, not a passing certificate. Phase receipts, tests and final disposition are recorded separately.
