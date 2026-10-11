# SDG Monitoring & Policy Analytics - Tajikistan

**Matin Yunusov - Independent Analytical Project. Not affiliated with or endorsed by UNDP.**

v2 review candidate on `upgrade/production-quality-v2`. Public production remains frozen **v1.0.0**, commit `207795554b4a9c8d9c8fcdd9ea9994664f41493e`.

The review application uses captured release **wdi-2026-10-11-candidate**: 17 WDI indicators, six countries, 2,315 observations within 2000-2025. Dashboard, reports, scenario and exports use that same candidate, with observation years and provenance. This is an internal review candidate, not an approved or institutionally operated service.

## Statistical boundaries

- International poverty uses captured current $3.00 / $4.20 definitions in 2021 PPP. The untouched historical snapshot has unresolved numeric extraction vintage and stale 2017 PPP labels; it is not spliced into this candidate.
- Renewable energy share is SDG 7.2.1. The register separates exact concepts, aligned proxies and contextual statistics; WDI coverage does not certify a complete national SDG series.
- The scenario is educational assumed arithmetic, not a forecast, estimated policy impact, confidence interval or costed programme. It uses the latest common-year candidate baseline and fixed hypothetical assumptions.
- Unverified regional rates are excluded from the analytical view. Official regional population evidence is recorded separately with its distinct geography/date/units; it does not validate the former rates.
- Original report sources remain missing. New canonical Markdown/PDF/HTML content is reconstructed, not recovered. Archived legacy reports and illustrations are outside public frontend output.
- External statistical, accessibility, security and institutional signoffs remain pending. See the candid readiness assessment before any release decision.

## Reproduce and verify

Use Node.js 24.14.0, Python 3.14.3 for the standard-library data pipeline, and pinned pnpm 10.34.6.

```sh
npx --yes pnpm@10.34.6 install --frozen-lockfile
npx --yes pnpm@10.34.6 verify
npx --yes pnpm@10.34.6 exec playwright install chromium
npx --yes pnpm@10.34.6 test:e2e
python -m unittest discover -s scripts -p "test_wdi_pipeline.py"
python scripts/wdi_pipeline.py --help
```

Data raw responses, manifest, checksums, deterministic transformation and differences are in `data/releases/wdi-2026-10-11-candidate/`. See [data refresh runbook](docs/DATA_REFRESH_RUNBOOK.md) for exact offline reproduction and candidate-refresh commands. Report sources and pinned generator are in `docs/reports/` and `scripts/generate_reports.py`.

Vite config is at the repository root, the app under `client/`, and frontend output `dist/public/`. The existing Vercel project uses the explicit build/output config and direct-route rewrites. No production alias or main branch should change without author approval. No tracking or paid monitoring has been introduced.

## Review documents

- [Baseline findings](docs/PRODUCTION_READINESS_BASELINE.md)
- [Indicator register](docs/INDICATOR_REGISTER.csv)
- [Poverty vintage reconciliation](docs/DATA_VINTAGE_AND_POVERTY_RECONCILIATION.md)
- [Canonical Policy Brief](docs/reports/POLICY_BRIEF.md) and [Methodology](docs/reports/METHODOLOGY.md)
- [Regional source investigation](docs/REGIONAL_SOURCE_INVESTIGATION.md)
- [Operations](docs/OPERATIONS_RUNBOOK.md), [security](docs/SECURITY_ASSESSMENT.md), [accessibility](docs/ACCESSIBILITY_ASSESSMENT.md)
- [External review and signoff](docs/EXTERNAL_REVIEW_AND_SIGNOFF.md)
- [Production-readiness assessment](docs/PRODUCTION_READINESS_REPORT.md)

Historical v1 reports are retained as archival records, not current evidence. Private configuration, local review archives, generated dependencies and test artifacts are excluded from publication.
