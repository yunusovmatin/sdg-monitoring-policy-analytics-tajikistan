# Methodology and evidence boundaries

Author: Matin Yunusov. Independent portfolio research prototype. No UNDP affiliation or institutional endorsement. Draft v2 review edition, 11 October 2026. Newly authored canonical source; the missing originals were not recovered.

## Snapshot identity and reproducibility

Review dataset ID: wdi-2026-10-11-candidate, status CANDIDATE_NOT_APPROVED. Canonical input: data/releases/wdi-2026-10-11-candidate/observations.csv. Canonical LF SHA-256: 2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae. API retrieval interval: 2026-10-11T17:52:16.063880+00:00 to 2026-10-11T17:52:47.170151+00:00. Raw responses, request timestamps, checksums, footnotes and metadata are archived alongside this candidate. Its current definitions and observations are not silently joined with old releases.

The candidate has 2315 finite records, 17 indicators and 6 countries: Armenia, Georgia, Kazakhstan, Kyrgyz Republic, Tajikistan and Uzbekistan. The 2000-2025 envelope has 2652 potential indicator-country-years; observed coverage is 87.3%. This is neither complete annual coverage nor a representative sample of all SDG indicators.

The new extraction pipeline retains raw responses, metadata and checksums as a separately labelled candidate release. Its review must reconcile definitions, footnotes, value revisions, gaps and licenses before promotion. The review app and this report use the explicit candidate; frozen public v1.0.0 and its scenario baseline remain unchanged. Reproduction and refresh commands are documented in docs/DATA_REFRESH_RUNBOOK.md. Data use terms: https://data.worldbank.org/summary-terms-of-use

Archived v1 has 2,160 records within 2000-2023 and an unproven extraction label of 2026-01-25. Its actual historical API responses/scripts are absent. Current raw evidence reveals 405 non-poverty overlapping value revisions, 27 newly missing observations and 182 newly observed records. Tajikistan 2023 youth unemployment changes from 26.836% to 14.511%; total unemployment from 11.546% to 7.037%. Every overlapping international-poverty numeric value matches the current 2021-PPP extraction, strongly suggesting stale 2017-PPP labels; the exact original vintage is still unresolved. Reproducing archive arithmetic is different from authenticating its provenance.

## Definitions and SDG alignment

WDI indicator codes do not by themselves certify measurement of an official global SDG indicator. The indicator register distinguishes exact indicator correspondence, SDG-aligned proxy and contextual statistic. Official SDG metadata: https://unstats.un.org/sdgs/metadata/

EG.FEC.RNEW.ZS measures renewable energy share of total final energy consumption and corresponds to SDG 7.2.1. Climate relevance does not make it an SDG 13 indicator. National poverty lines, ILO-modelled unemployment, current-dollar measures, constant 2015-dollar measures and PPP poverty thresholds retain their own denominators and concepts. Renewable definition: https://w3.unece.org/SDG/en/Indicator?id=23

The legacy international-poverty values have unresolved vintage. Their old 2017-PPP labels cannot be applied to current 2021-PPP observations; incompatible series are not joined, relabelled or ranked together. Full discrepancy evidence is in docs/DATA_VINTAGE_AND_POVERTY_RECONCILIATION.md.

## Missingness, years and calculations

Missing observations are absent, never numeric zero. No interpolation, arbitrary imputation or substitution of modelled regional numbers is used. The latest available value means the newest supplied nonmissing observation for a specified country and indicator, not a common contemporary year. Comparison tables must show each observation year; asynchronous pairs cannot be interpreted as same-year gaps.

For comparable observations, a percentage-point difference is rate A minus rate B. Relative change is (new minus old) / old times 100 only where the denominator is nonzero. The reconstructed pipeline calculates annual changes only for adjacent years, leaving gaps blank. Archived historical change columns refer to successive observations; 41 archived change rows span gaps longer than one year and are not annual changes. Calculations use unrounded inputs and round only displayed results.

Descending ranks describe indicator value with shared competition ranks for ties, not policy performance. Unweighted means of remittance shares are sums of observed annual percentages divided by observation counts. Missing country-years and survey/model differences must be stated alongside any comparative narrative.

The candidate contains 514 nonempty observation footnotes. They identify national poverty definitions and source breaks, income-based Uzbekistan observations in 2021-2025 versus consumption-based peer welfare measures for Gini/bottom-quintile shares, and Georgia's 2024 population census basis. Uzbekistan's earlier supplied observations are consumption-based; they must not be treated as one harmonized welfare series. National poverty, Gini and bottom-quintile series have no cross-country numeric gap or rank; all asynchronous ranks are disabled. UI and exports retain observation notes, status, PPP basis and source-update date. These controls limit misleading comparisons but do not replace a complete national-methodology review. Detailed evidence: docs/FOOTNOTE_AND_COMPARABILITY_AUDIT.md.

## Educational scenario formulas

Baseline year b is the newest common candidate Tajikistan observation year for SI.POV.NAHC, SL.UEM.1524.ZS and SP.POP.TOTL. Target illustration year t = 2030; number of cohorts Y = t - b. This review baseline is b = 2024, Y = 6, national poverty P = 19.8%, youth unemployment U = 14.556%, population N = 10,590,927 persons. This replaces no published v1 baseline. A separate same-year descriptive comparison in the policy report uses 2023 youth unemployment 14.511%.

- H = annual distinct households; q = assumed outcome share / 100; s = 5.5 assumed persons per household. Cumulative assumed poverty exits E = H * Y * s * q. Poverty change dP = 100 * E / N percentage points.
- c = 0.4 assumed initially unemployed youth candidates per household; L = 800,000 assumed fixed youth labour force. Assumed transitions J = H * Y * c * q. Youth unemployment change dU = 100 * J / L percentage points.
- For either baseline rate R and assumed change d, illustrative bounds are max(0, min(100, R - 1.3*d)) and max(0, min(100, R - 0.7*d)). The centre is bounded R - d. The +/-30% is sensitivity of the assumed change, not a confidence interval or variability in the rate itself.
- With per-household investment I, annual direct investment is H * I; cumulative investment H * I * Y. Hypothetical GDP index is 100 * (1 + g/100)^Y. Final-year annual investment at baseline-year purchasing power is H * I / (1 + inflation/100)^Y. No empirical GDP/inflation effect is estimated.

Default H = 10,000, q = 0.30 and I = USD 500 generate 18.6-19.1% illustrative poverty and 13.4-13.9% illustrative youth unemployment. Household size, candidate share, fixed labour force, persistence and sensitivity are assumptions, not estimated programme coefficients. The calculator's source of truth is client/src/lib/scenario.ts and its declared assumptions; this document does not add a policy forecasting model.

## Regional evidence and report generation

The original regional JSON is unverified illustrative material. It is excluded from production analytical claims. Official population tables exist, but start-of-year resident counts, geographic boundaries and registered unemployment are not interchangeable with WDI annual national or ILO-modelled measures. No invented replacement rates or geographic priorities are supplied. Investigation: docs/REGIONAL_SOURCE_INVESTIGATION.md.

Both reports are generated from these version-controlled Markdown templates by scripts/generate_reports.py using pinned PDF dependencies. The same resolved paragraph blocks generate HTML-facing JSON, downloadable Markdown and PDF. Generation asserts candidate identity, checksum, material numbers, text extraction and absence of unresolved template tokens. Visual page review is separately recorded in the evidence package; text extraction alone does not prove layout or PDF accessibility.

## Quality, limitations and approval

Quality practice follows the UN National Quality Assurance Framework as a reference, not a certification: https://unstats.un.org/unsd/methodology/dataquality/un-nqaf-manual/

Unresolved original vintage and historical ETL, incomplete regional evidence, hypothetical coefficients and pending external approvals prevent a claim of independently validated production statistical service. Accessibility assessment and engineering test receipts are separately scoped. PDFs are readable review documents; tagged-PDF accessibility has not been certified. Archived legacy PDFs are not current reports. Institutional ownership and authorization remain PENDING.
