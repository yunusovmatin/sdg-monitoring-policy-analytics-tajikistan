# Project 1 v2 production-promotion checklist

Prepared 13 October 2026 for Matin Yunusov. **Planning only; no merge, production promotion, protection change or rollback is authorized by this checklist.** Recommendation: PASS WITH LIMITATIONS for independent portfolio use.

## Release identities

- Authenticated tested application: `92ef6e50834b4d1f56c68628dd0183d9ae7bd1f7`, tree `b650f0398dc1e02100c50321f60964ef93b791d9`.
- Tested protected deployment: `dpl_5pnn7VFHSQGyadmWh8TGmTmXqyBA`, https://sdg-monitoring-policy-analytics-tajikistan-pe3nzcbef.vercel.app/.
- Subsequent documentation-only child: SHA recorded in handoff receipt. Confirm its diff is limited to the three release Markdown files; it is not a separately hosted-tested application revision.
- Account/project: `thefloppotron-6563`, `prj_mImzlYOmFRA1sKk8yCLuEKM1WMo2`. Never select sibling projects.

## Before requesting explicit promotion authorization

- [ ] Owner reviews both verification/readiness reports, failed performance sample and limitations; chooses the exact source SHA and deployment to promote.
- [ ] If choosing the already tested preview, retain its exact application SHA. If choosing the documentation child or another built deployment, verify metadata and unchanged runtime paths, wait for its quality gates and run route/data/export/download smoke checks on that exact deployment before promotion.
- [ ] Confirm existing protection policy and intended production accessibility; do not weaken protection to make tests pass.
- [ ] Confirm rollback deployment remains READY/available and owner has authorization to restore it. Preserve the v1 tag and source archive.
- [ ] Record Matin Yunusov as release/incident owner; agree manual checking cadence, response availability and incident contact. No schedule or alert service is currently active. An uptime claim requires an activated monitor and alert-delivery check.
- [ ] Retain a second verified backup outside this disk/checkout if recovery assurance is required. Existing same-disk archives do not establish off-site resilience.
- [ ] Accept PDF tagging/assistive-technology limits and keep HTML alternatives visible. Do not claim PDF-UA or full WCAG certification.
- [ ] Inspect exact-commit GitHub quality gates. Required branch-check enforcement remains unverified; use explicit manual approval rather than assume automatic CI gating.
- [ ] Obtain the user's explicit authorization for any merge, production replacement or rollback. Do not infer it from PASS WITH LIMITATIONS.

## Promotion actions — only after authorization

- [ ] Publish/promote only the approved source/deployment; record SHA, tree, deployment ID, dataset and PDF hashes, time and responsible owner. Do not move `v1.0.0`.
- [ ] Verify the production alias resolves to that deployment and commit.
- [ ] Run four direct routes, navigation and refresh at 1440/390/320; chart gap/calendar checks; default/adjusted scenario CSV arithmetic; actual selected/comparison exports; PDF downloads/MIME/hashes; current release integrity; all nine obsolete asset paths; console/network and security-header smoke checks.
- [ ] Preserve failures and stop release acceptance for incorrect definitions/calculations, corrupted data, legacy exposure, broken routing/downloads or security regression. Synthetic performance variability must remain disclosed; do not silently erase outliers.
- [ ] Freeze the approved release only after public-site checks and updated production receipts pass.

## Exact rollback target

Existing v1.0.0 production deployment: **`dpl_7H5MteLETjG7XXZh9L23KuFwsbHx`**.

- Source: **`207795554b4a9c8d9c8fcdd9ea9994664f41493e`**, immutable `v1.0.0` tag and current `main`.
- Unique deployment: https://sdg-monitoring-policy-analytics-tajikistan-ppahreiwy.vercel.app/.
- Current production alias: https://sdg-monitoring-policy-analytics-taj.vercel.app/.
- 13 October metadata recheck: READY, production target, matching v1 commit and alias. No rollback was executed.

For an authorized incident rollback, first recheck identity/access/availability, restore the production alias to this retained deployment using Vercel's supported promote/rollback workflow, then inspect all four routes and the **v1** dataset/export conventions. v1 uses `/data/processed/sdg_tjk_tidy.csv`; do not apply the v2 candidate-file allowlist to v1. Record incident evidence, restored commit/deployment and post-rollback results. Offline Git/candidate recovery has passed; a hosted rollback drill and recovery-time objective remain untested/unagreed.

## Outstanding scope

Manual monitoring without alerts/on-call; no hosted rollback drill or off-site recovery assurance; unverified required-check enforcement; untagged PDFs and no actual screen-reader/PDF-UA certification; formal external statistical/policy/security/accessibility signoff pending. Institutional approval is absent and needed for official-status claims, not independent portfolio operation. Scenario coefficients remain hypothetical and regional data unverified/excluded. No analytical redevelopment is required by this handoff.
