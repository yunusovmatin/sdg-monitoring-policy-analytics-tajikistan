# PDF accessibility investigation and defined scope

Checked 12 October 2026 against the two reconstructed v2 candidate reports. This is an internal engineering/document review, not PDF/UA, WCAG or assistive-technology certification. Canonical Markdown, HTML/JSON and numerical source remain unchanged.

## Improvements implemented and checked

The existing pinned ReportLab/Platypus generator now writes English document language, a visible document title, hierarchical title/heading bookmarks, working HTTPS source-link annotations, and artifact markers around decorative page footers. Body text stays selectable. PDF extraction verifies every canonical body block is present and occurs in source order after footer removal. This checks extraction consistency, not semantic reading order in a screen reader.

| Check | Policy brief | Methodology |
| --- | --- | --- |
| Pages / canonical body blocks | 2 / 29 | 2 / 28 |
| Heading bookmarks | 8 | 7 |
| HTTPS source-link annotations | 7 | 4 |
| English language / display document title | Passed | Passed |
| Decorative footer artifact on every page | Passed | Passed |
| Canonical text completeness and extraction order | Passed | Passed |
| All rendered pages visually inspected | Passed | Passed |
| Semantic structure tree | Absent | Absent |
| PDF/UA validation / actual screen-reader test | Not performed | Not performed |

All four final pages were rendered with Poppler and inspected for readable type, wrapping, margins, heading/bullet layout, underlined citations and footer placement. No clipping, overlapping text or missing glyphs was observed. These reports contain no charts or complex tables requiring alternative figure descriptions. Fixed invariant PDF timestamps support reproducibility and are not the actual review date; receipts identify the 12 October review.

## Remaining limits and alternative

The PDFs are still untagged. They have no H1/H2/P/L/LI semantic structure tree, and link annotations are not associated with structure tags. Footer artifact markers and heading bookmarks alone do not establish an accessible reading order. Actual screen-reader navigation and qualified accessibility review remain pending. No veraPDF/PAC validator was available in this environment; none is claimed to have run.

ReportLab's [official accessibility documentation](https://docs.reportlab.com/pdf-accessibility/) describes automatic tagging through its ReportLab Plus/RML offering. The current open-source Platypus pipeline does not supply that complete workflow. A partial invented structure tree would not substantiate conformance. The user authorized reasonable improvements with the existing pipeline and an HTML alternative; no large new document framework was introduced.

The canonical website report views provide semantic headings, paragraphs, lists and textual source citations from the same JSON blocks, with Markdown as another selectable-text alternative. Browser accessibility checks have a separate scope and receipt; this document does not claim their results. Accessible HTML remains the preferred reading format until meaningful PDF structure and actual assistive-technology validation are completed.

## Evidence

Private project evidence: `../evidence/final-corrections-reports/report-generation-receipt.json`, the two extracted text files, four rendered PNG pages, and `visual-review-receipt.json`. Generator checks are reproducible through `scripts/generate_reports.py` with `scripts/requirements-reports.txt`.

- Policy brief SHA-256: `ca3402b97c1686f52ecce3e7df97c86f1ee888c90a65809e3ba87dc386342f8a`.
- Methodology SHA-256: `4a2d07ec181bab5ae44dffa20443bded3abd563c285de217d032157740ba05a4`.
- Candidate CSV SHA-256 remains `2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae`.
