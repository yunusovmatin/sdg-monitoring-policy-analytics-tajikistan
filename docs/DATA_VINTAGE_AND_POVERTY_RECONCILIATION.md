# Data vintage and poverty reconciliation

Author: Matin Yunusov. Independent review candidate, 2026-10-11. Statistical signoff PENDING.

The published v1.0.0 snapshot is preserved unchanged. Its claimed extraction date in `sources.csv` is 2026-01-25, after the [World Bank June2025 revision](https://www.worldbank.org/en/news/factsheet/2025/06/05/june-2025-update-to-global-poverty-lines). Yet its dictionary names `SI.POV.DDAY` as $2.15/day and `SI.POV.LMIC` as $3.65/day at2017PPP. No authenticated original API response, exact source edition or original ETL exists in the repository. These labels do not prove the numeric vintage.

The repository LF CSV SHA256 is `330c4d45bb149d0d18a023d59498d2100d8f427fb2ebe14c931e0bf77753a791`. A Windows CRLF checkout hashes `22161580dab28f672e23f59018cef9ea1b9a87b13b091cbde56dd4b17d00de8e`; normalizing checkout line endings to Git LF recovers the former. No numerical row was changed.

New genuine WDI API records were captured on2026-10-11 in release `wdi-2026-10-11-candidate`. Source2 metadata identifies the same codes as $3.00/day and $4.20/day at2021PPP. There are **zero numeric revisions across all overlapping original international-poverty records** (six countries, both codes). This strongly suggests the original labels are stale. It does not establish which original server edition was used. The legacy poverty vintage remains **UNRESOLVED**; those numbers must not be asserted as authenticated2017PPP data or mixed with the candidate.

Additional genuine [PIP API](https://blogs.worldbank.org/en/opendata/how-use-pips-api) responses explicitly request each PPP basis and threshold, TJK2023, no gap filling. Raw responses, exact URLs, timestamps and checksums are in `poverty-reconciliation.json` and its four referenced raw files.

| Basis and threshold | Current PIP headcount % | Archived WDI numeric value | Interpretation |
|---|---:|---:|---|
|2017PPP $2.15/day|2.64|7.3|Does not authenticate the archived2017 label|
|2017PPP $3.65/day|14.86|18.1|Does not authenticate the archived2017 label|
|2021PPP $3.00/day|7.29|7.3|Compatible at WDI one-decimal rounding|
|2021PPP $4.20/day|18.14|18.1|Compatible at WDI one-decimal rounding|

These current PIP responses are not original January2026 vintage receipts. PIP describes the2023 HBS observation as consumption-based, survey estimate, comparability spell2021–2024. Different source editions may revise surveys as well as PPPs. The [2024 Tajikistan Poverty and Equity Brief](https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099062824104010489), independently checked during report preparation, gives a2023 $3.65/2017PPP estimate10.7%; this is a further edition-specific discrepancy, not permission to substitute that report's number into the historical CSV. Current2017PPP PIP gives14.86%, demonstrating why exact edition matters.

The new candidate has2,315 finite observations,17 indicators,6 countries,2000–2025 extraction scope;337 null source records remain in raw evidence. Its deterministic CSV SHA256 is `2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae`. There are405 value revisions,27 newly missing historical keys and182 new observations relative to the legacy data. These are edition/revision differences, not measured temporal effects. `refresh-diff.json` supplies machine-readable detail and flags the poverty-definition change even when values match.

Material non-poverty revision: TJK youth unemployment2023 is14.511% in the candidate versus26.836% in the archived prototype. Current definition explicitly identifies modeled ILO estimates. The v2 review UI, reports and educational calculator use only the captured candidate, with its version visible. Frozen v1 production retains its original release until separate approval. No charts splice the two releases.

The candidate's latest common year for national poverty, youth unemployment and population is2024:19.8%,14.556%,10,590,927 persons. Youth and population separately have2025 records, so “latest available” is indicator-specific; a common-year calculation must not silently combine2024 poverty with2025 population. Survey poverty/inequality series are sparse. No imputation is used. Annual changes are calculated only for consecutive calendar years; survey gaps produce empty annual metrics.

Renewable `EG.FEC.RNEW.ZS` maps to SDG7.2.1, total final energy consumption, not SDG13. Exact-concept mappings and proxies are separate in `INDICATOR_REGISTER.csv`; aggregate WDI records do not constitute full sex/age/disability official SDG reporting. The17-indicator collection contains no verified official SDG13 measure.

Disposition: the statistical-definition gate is addressed for the isolated **candidate**, with original poverty provenance unresolved and excluded from current analytical claims. Production promotion and independent statistical review remain PENDING. Source licensing is CC BY4.0 on all17 inspected current WDI pages, subject to World Bank additional terms; originating agencies and transformations are attributed in the source register.
