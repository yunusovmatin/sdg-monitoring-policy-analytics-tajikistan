# Canonical report generation and review

These are newly authored v2 review reports by Matin Yunusov, not recovered original documents or institutionally approved publications. Source-controlled templates: `docs/reports/POLICY_BRIEF.md`, `docs/reports/METHODOLOGY.md`. Public review artifacts: `client/public/reports/{policy-brief,methodology}.{md,json,pdf}`. JSON schema is `{title, source, dataset_release, snapshot_sha256, blocks:[{type, text}]}`; supported block types are heading, paragraph and bullet.

## Reproduction

Use Python 3.11 or later with dependencies pinned in `scripts/requirements-reports.txt`:

```text
python -m pip install -r scripts/requirements-reports.txt
python scripts/generate_reports.py --evidence ../evidence/reports
pdftoppm -scale-to 1400 -png client/public/reports/policy-brief.pdf ../evidence/reports/policy-brief
pdftoppm -scale-to 1400 -png client/public/reports/methodology.pdf ../evidence/reports/methodology
```

Generation uses `data/releases/wdi-2026-10-11-candidate/observations.csv`, records canonical LF checksum `2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae`, independently recomputes material values with Decimal arithmetic and verifies the candidate manifest identity. This is not original historical ETL recovery or promotion to production. PDF invariant metadata makes outputs repeatable. Template numbers resolve only from this candidate; archival discrepancies are explicitly separate and old international-poverty labels are not applied to new observations.

## Executed checks, refreshed 12 October 2026

Generation passed: 2,315 unique records, 17 indicators, six countries; 2023 same-year descriptive values and peer comparison; 2024 latest common scenario baseline; non-overlapping remittance means; default scenario bounds; source identity and unresolved-template checks. After the footnote caveat update, all 29 policy and 28 methodology text blocks matched PDF extraction after whitespace normalization and footer removal; JSON and Markdown use identical resolved blocks. Regional population fixture independently reconciled to 10,288.3 thousand persons at source precision.

Both PDFs contain two pages. All four final pages were rendered with Poppler and visually inspected for typography, legibility, wrapping, margins, footer and page-number alignment. No clipping, overlapping text, omitted sections or missing glyphs was observed. Poppler emitted system fallback-font warnings for Symbol and ArialUnicode; these reports use Helvetica and rendered without observed glyph defects. Final rendered PNGs, extracted text and generation receipts are in private `../evidence/final-corrections-reports/`, not in public source.

The final generator also verifies canonical body-block extraction order, English language metadata, display of document title, heading bookmark order, working source URL annotations and decorative footer artifacts. The report content, numerical values and JSON blocks were unchanged by these PDF improvements. See `PDF_ACCESSIBILITY.md` for exact counts, hashes and residual limits. Invariant PDF timestamps are deliberate reproducibility metadata, not a claim that these documents were authored in 2000.

## Boundaries

PDF text assertions and visual inspection do not certify tagged-PDF accessibility, screen-reader usability, factual independence, source-owner approval or an entire statistical quality framework. Both PDFs remain untagged, and actual screen-reader/PDF-UA validation is pending. The HTML report view supplies semantic text; its browser accessibility is assessed separately. User-supplied independent review feedback has been received, while formal statistical, policy and accessibility signoffs remain PENDING; see `EXTERNAL_REVIEW_AND_SIGNOFF.md`. No archived legacy PDF is exposed as a current report.
