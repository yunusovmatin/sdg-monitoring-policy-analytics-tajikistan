# Scoped security assessment — v2 review candidate

Assessment date: 11 October 2026. Scope: repository frontend/build code, optional local static server, data parsing/export, dependency graph and proposed hosting configuration. This is an engineering self-assessment informed by [OWASP ASVS 5.0.0](https://owasp.org/projects/asvs), not independent penetration testing, complete ASVS conformance or institutional certification. Repository/hosting account security, provider infrastructure, full history scanning and a formal privacy audit are outside scope.

## Architecture and trust boundaries

The Vite build produces `dist/public`, served as static files on Vercel; application routes are client-rendered. There is no application login, mutable database, paid backend, secret-bearing API or server-side policy calculation. Optional `server/index.ts` serves the build locally with Express and is not the Vercel production runtime. Browser input drives an educational calculator and CSV Blob downloads. Versioned statistical files are read-only application inputs, not executable content. The v2 page uses a captured review candidate and verifies the expected SHA-256 before parsing; failed requests/decoding/integrity failures show an error rather than values. Candidate acquisition from the World Bank is an offline release preparation boundary. The legacy World Bank helper remains tested, validates URL parameters and has a 15-second timeout; it is not exposed as an automatic live-overwrite control in the v2 UI.

## Verified defects and controls

| Area | Finding and implemented control | Scope/limit |
| --- | --- | --- |
| Dependency graph | Baseline audit reported 151 vulnerability occurrences: 5 critical, 53 high, 82 moderate, 11 low. Removed unused Markdown/diagram dependency and development runtime/tooling, updated compatible dependencies, pinned pnpm 10.34.6 / Vite 7.3.7 / Vitest 4.1.11, and patched vulnerable transitive versions. Final captured audit reports zero advisories at all severities. | Registry audit on 11 October 2026; not proof of absent unknown vulnerabilities. `pnpm-lock.yaml` is authoritative; rerun before release. |
| Development endpoints | Removed Manus runtime, debug collector/session replay logger, JSX-location plugin and route-discovery patch. Local Vite defaults bind loopback with explicit host allowlist. | Do not expose dev server externally. Production artifact check verifies no collector/analytics references in HTML. |
| Unused misleading functionality | Removed unreachable `ReportBuilder` (placeholder PDF toast), `ManusDialog` and third-party Google Maps integration. | Canonical report generation is separate and reproducible. No map credential remains necessary. |
| Tracking | Removed optional analytics script injection entirely. No application telemetry or tracking is added. | Hosting technical requests remain provider boundaries; not a claim of zero external metadata. |
| Data parsing | Reject duplicate headers/observation keys, nonfinite numeric values, malformed country/indicator identifiers, out-of-range years, inconsistent field widths, unterminated quotes and oversized CSV inputs. Preserve zeros and do not fabricate blank observations. | Statistical domain/definition/license checks belong to the governed ETL; syntactic validation does not establish scientific truth. |
| Spreadsheet exports | Apostrophe-prefix formula-like text cells, including whitespace/control prefixes; preserve numeric values and strictly numeric strings, quotes/newlines and Unicode. | An exported text field may acquire an apostrophe intentionally. Do not remove it merely to make formulas executable. |
| Calculator | Reject invalid/nonfinite inputs, nonpositive denominators, out-of-range baseline rates, future horizons and arithmetic overflow-sized inputs. Boundary tests verify finite ordered, monotonic rate ranges. | Hypothetical assumed effects remain uncalibrated; numerical safety is not policy validation. |
| External URLs | API path parameters are validated before network access. Existing external UI anchors use `noopener noreferrer`. React renders source text without injecting HTML. | New external providers or raw HTML rendering require a separate review. |
| Browser headers | Vercel configuration sets CSP, `nosniff`, strict referrer policy, frame denial, HSTS and denied camera/microphone/geolocation. CSP restricts scripts to same origin and disables objects/forms/frame ancestors; permits the retained World Bank API origin and chart inline styles. | Header configuration is source-controlled; actual enforcement must be checked on preview/production. Inline styles remain permitted for charts; no `unsafe-eval` or remote scripts. Preview toolbar injection may be blocked deliberately. |
| Secrets and CI | Current tracked/nonignored source heuristic scan found no matching credential patterns or forbidden private paths. CI pins action commits, read-only permissions, frozen lockfile, audit and build/test gates; no deployment credentials. | Heuristic scan is not a full secret-history audit. Repository protection enforcement/CI execution require their own receipts. |

## Exact receipts and repeatable commands

Private build evidence is held outside the repository under the Project 1 `Local Files/Production Quality v2/evidence` directory. Initial receipts: `dependency-audit-before.json`, `dependency-audit-after.json`, `tests-baseline.log` (17 passing), `verify-engineering.log` (TypeScript, unit tests, build and compressed JavaScript budget), `secret-scan.json`, `e2e-final.log` and `e2e-results-final.json` (12 passing tests, including keyboard deferred-section focus continuity), plus `verify-engineering-final.log` (27 passing unit tests, TypeScript and build), and the three `performance-*.json` cold synthetic receipts. The four direct routes were tested at 320 pixels with all dashboard sections loaded, CSP active and no JavaScript errors; the automated scoped axe rules reported no violations in those tested states. This does not certify untested states or assistive technology. Final integration/staging receipts supersede intermediate receipts and report their own SHA.

```sh
npx --yes pnpm@10.34.6 install --frozen-lockfile
npx --yes pnpm@10.34.6 audit --json
npx --yes pnpm@10.34.6 security:scan
npx --yes pnpm@10.34.6 verify
npx --yes pnpm@10.34.6 test:e2e
```

CI design follows GitHub's [secure workflow guidance](https://docs.github.com/en/actions/reference/security/secure-use). It does not promote releases. No production deployment, alias movement or paid service is authorized by this assessment.

## Outstanding risks and gates

- Protected preview header enforcement and CSP compatibility need actual hosting evidence.
- Dependency results expire as advisories change; schedule owner-led review, not silent production dependency updates.
- Real assistive-technology review, infrastructure controls, independent analytical signoff, actual monitoring/alert delivery and an approved hosted recovery drill remain separate pending gates.
- The original extraction vintage is unresolved. Maintaining its archive and isolating current candidate definitions protects provenance; security tests cannot authenticate historical poverty observations.
- Complete ASVS or production-readiness certification is not claimed. Deployment approval requires the full analytical, accessibility and operations evidence package, beyond this targeted engineering work.
