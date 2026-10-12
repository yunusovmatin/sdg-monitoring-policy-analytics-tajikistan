# Hosted verification — final corrections

12 October 2026. Status: **BLOCKED — AUTHENTICATION** unless superseded by an authenticated execution receipt in the final handoff.

Intended account: `thefloppotron-6563`. Project: `sdg-monitoring-policy-analytics-tajikistan` (`prj_mImzlYOmFRA1sKk8yCLuEKM1WMo2`), account identifier `team_cztfcxaUrVK5oeDZNcwNoVvt`. The authenticated Vercel connector can inspect this project and deployments. Project inspection confirms SSO protection enabled for previews, with password/IP protection disabled. No protection setting was changed.

The prior candidate preview `https://sdg-monitoring-policy-analytics-tajikistan-9t4ksw382.vercel.app` identifies baseline commit `1d3916d0746097e8d6f91374dd5a488f6afc4601`. It must not be used to claim verification of later source corrections. The corrected commit, new deployment URL, exact Git tree and hosted CI outcome are recorded in the final release receipt after publication.

## Authentication diagnostics actually executed

The connector's authenticated URL fetch fails at `read_protection_bypass`, HTTP 403, when reading `/v2/deployments/dpl_BsUrgbHJdotpPF6HGJLfabpWGmxB/aliases`. This establishes insufficient access through that connector endpoint; it does not establish an application-generated 403 or a wrong project identity.

Vercel CLI 63.1.2 was obtained from the official npm package. Its default Windows configuration failed before authentication with an `EXDEV` atomic-rename error. An isolated, private project-local CLI configuration directory avoided that filesystem failure. `whoami` then returned **Logged out**. No existing default CLI authentication file was present at the inspected standard Windows path. No token was requested from another project, printed, copied into source or persisted in release evidence.

Without an authenticated local CLI session, a same-project development OIDC token could not be acquired, so `vercel curl` and authenticated Playwright requests could not establish hosted acceptance. Browser access previously reached Vercel login. The user was asked to supply authorized account access; code and independent validation continued meanwhile. No permanent bypass secret or weaker protection was introduced.

## Required hosted acceptance once access exists

Use the existing authorized account and exact corrected deployment. Prefer `vercel curl`; for browser requests use a short-lived same-project development token in `x-vercel-trusted-oidc-idp-token`, scoped to the deployment origin. Do not expose credentials in traces, screenshots, URLs, logs or reports.

Exercise `/`, `/dashboard`, `/policy-brief`, `/methodology` at 1440, 390 and 320 pixels. Check direct routes, navigation/keyboard behavior, labels/definitions/provenance, exact dataset hash and values, recomputed scenario CSVs, PDF byte hashes, numeric chart spacing/gaps, failure recovery, missing-data behavior, JavaScript errors, assets and actual HTTP security headers. Probe all nine obsolete raw/processed CSV paths: a 200 HTML SPA fallback is not CSV exposure, and status alone is insufficient. Compare response bodies, content types and legacy signatures.

Local tests and a READY deployment do not substitute for these hosted checks. Preserve production HOLD while essential hosted verification remains blocked. Production project inspection still identifies v1.0.0 commit `207795554b4a9c8d9c8fcdd9ea9994664f41493e` at the unchanged production alias.
