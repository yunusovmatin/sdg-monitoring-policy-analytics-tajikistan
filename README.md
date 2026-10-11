# SDG Monitoring & Policy Analytics — Tajikistan

**Author: Matin Yunusov.** Independent portfolio prototype. Not affiliated with, commissioned by, endorsed by, officially reviewed by or operated by UNDP.

An interactive React/TypeScript dashboard for examining a bundled World Bank WDI snapshot: 17 indicators, six countries and 2,160 observations within the 2000–2023 envelope. Includes descriptive policy analysis, country comparisons, CSV exports and a transparently hypothetical scenario explorer. Live refresh is separate and labels each refreshed series; the scenario keeps bundled historical baselines.

## Limitations

- Scenario outputs illustrate assumptions and arithmetic; they are not forecasts, empirical policy effects, attributable impacts or programme budgets.
- Regional values are unverified demonstration data, not authenticated official regional statistics or geographic planning evidence.
- Original policy Markdown sources are missing. Revised PDFs remain unavailable; download controls are disabled. Archived legacy PDFs are not current approved reports and are excluded from publication.
- Original historical ETL scripts are not supplied. Accessibility checks are partial, not certification.

See [numerical reconciliation](docs/NUMERICAL_RECONCILIATION.md), [scenario assumptions](docs/SCENARIO_ASSUMPTIONS.md), [validation](FINAL_VALIDATION_REPORT.md) and [PDF source status](docs/SOURCES_REQUIRED.md).

## Run and verify

Use Node.js 24 and the pinned pnpm 10.4.1:

```sh
npx --yes pnpm@10.4.1 install --frozen-lockfile
npx --yes pnpm@10.4.1 dev
npx --yes pnpm@10.4.1 check
npx --yes pnpm@10.4.1 exec vitest run
npx --yes pnpm@10.4.1 build
```

Vite configuration lives at the repository root; the application root is `client/` and the deployable frontend output is `dist/public/`. Vercel uses the repository root, the explicit pinned install/build commands in `vercel.json`, and static frontend output. Direct `/dashboard`, `/policy-brief` and `/methodology` requests rewrite to the SPA entry point. The bundled Express server is not required for static frontend hosting; optional live refresh requests the public World Bank API from the browser.

Private configuration, development dependencies, review archives and historical PDFs are excluded from Git/public deployment. Manus is acknowledged as a development tool. Analytical baseline: `709219fc3d9fd6b470079ef5acfad32cb79ba4ad`; publication commits preserve that work with documented release configuration and the actual repository link.
