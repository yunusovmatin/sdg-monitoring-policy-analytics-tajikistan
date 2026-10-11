# Governed data refresh and rollback

Author/maintainer: Matin Yunusov. No UNDP affiliation. Independent statistical review and release authorization PENDING.

This is a **new** extraction pipeline, not the missing original historical ETL. The frozenv1 source/snapshot remain available by immutable tagv1.0.0. The v2 review uses captured release `wdi-2026-10-11-candidate`; it is not approved for production.

Runtime: CPython3.14.3, standard library only, no installed ETL packages. Record the interpreter version in every receipt. Extraction is bounded to source2/WDI, six explicit ISO3 countries, seventeen dictionary codes,2000–2025; unreturned years or nulls are never manufactured. Raw metadata and observations are stored byte-for-byte, checksummed, with retrieval time and exact requestURL. Each request must have one complete page and matching IDs; errors invalidate extraction. API failure retries are limited to three attempts with a40second request timeout; a partial folder lacking validmanifest cannot be built or promoted.

From a clean clone, run in repository root:

```powershell
python --version
python scripts/wdi_pipeline.py build --release data/releases/wdi-2026-10-11-candidate
python scripts/build_indicator_register.py
python -m unittest discover -s scripts -p 'test_*.py' -v
```

These commands are offline. Tests reconcile every output value to versioned raw evidence, check deterministic bytes twice, exact legacy integrity with Git LF convention, duplicate/schema/domain/unit/PPP constraints, zeros, gross-enrollment>100%, negative growth/migration, survey gaps and Unicode/CSV escaping. Outputs are sorted by country/indicator/year. Metric definitions: annual absolute change=current−previous; annual percent change=(current−previous)/previous×100; only consecutive years, denominator zero leaves percent change empty. Candidate records have unique country/indicator/year/vintage keys. `quality.json` documents all102 country-indicator coverage series, missing years and explicit stale-before2023 diagnostic; this is a review threshold, not a universal release criterion. Missingness depends on survey frequency and national reporting, so coverage percentages are not quality scores.

To propose a **new** refresh, choose a new empty release directory; never reuse an existing ID:

```powershell
python scripts/wdi_pipeline.py fetch --release data/releases/wdi-YYYY-MM-DD-candidate-N
python scripts/verify_wdi_licenses.py --release data/releases/wdi-YYYY-MM-DD-candidate-N
python scripts/capture_poverty_reconciliation.py --release data/releases/wdi-YYYY-MM-DD-candidate-N
python scripts/wdi_pipeline.py build --release data/releases/wdi-YYYY-MM-DD-candidate-N
```

The examples require a real chosen date/ID; they are not an automatic scheduled overwrite. Extraction year scope must be explicitly reviewed when advancing beyond2025. `build_indicator_register.py` is intentionally pinned to the current reviewed candidate; updating its release pointer is a reviewed code change, not a runtime API choice. Record source exceptions and licensing; halt redistribution if a page license cannot be verified. Attribution requirements apply to World Bank and originating organizations; no endorsement is implied.

Review `refresh-diff.json` before any application pointer changes. Definition/PPP changes are always blockers even if numeric values happen to match. Review all revisions (the file lists every nontrivial numeric change, not only a chosen arbitrary materiality cutoff), newly missing keys, new observations, comparisons with incompatible years and resulting narrative/chart/report/scenario changes. Rebuild canonical reports from that same proposed version; recalibrate nothing silently. Document statistical reviewer, data-owner scope, engineering receipts and user approval; their current status isPENDING.

Only after explicit user approval and completed scoped reviews may a separate release commit change production's data pointer and deploy. Preserve prior source tags and snapshot files. A failed fetch or data-load shows an error/retry state; it never substitutes zero, demo rows or an unrelated vintage. Network refresh in the v2 analyticview is disabled: it cannot blend external live series with the pinned candidate.

Rollback: retain each rawmanifest and versioned source commit; restore the previous approved data pointer/source commit and rerun offline build/tests, UI comparisons and reports. Production rollback uses the existing Vercel prior deployment only after owner authorization, without retaggingv1.0.0. Recovery test executed here: rebuilding the current candidate twice returned identical SHA256, and legacy source hash remained unchanged. A Vercel production rollback was not executed because the frozen production must remain intact.
