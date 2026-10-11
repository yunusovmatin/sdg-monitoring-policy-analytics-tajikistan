# Numerical reconciliation — Project 1

> Historical v1 arithmetic audit only. Its earlier PASS WITH LIMITATIONS finding does not authenticate the original WDI extraction vintage. The v2 primary-source audit found unresolved international-poverty definitions and materially revised unemployment estimates. Calculations below reproduce supplied archival numbers, not approved current statistical claims. Current status is governed by DATA_VINTAGE_AND_POVERTY_RECONCILIATION.md and the newly authored canonical candidate reports in docs/reports/. The regional demonstration and old poverty figures were removed from the public analytical path; original files remain under data/legacy.

Author: Matin Yunusov. Independent analytical portfolio prototype; not commissioned, endorsed, reviewed or operated by UNDP.

Audit date: 10 October 2026. Primary numerical evidence: `client/public/data/processed/sdg_tjk_tidy.csv`, bundled WDI snapshot labelled retrieved 25 January 2026. These are reconciled historical snapshot values, not claims that today's WDI release is identical. CSV SHA-256: `330c4d45bb149d0d18a023d59498d2100d8f427fb2ebe14c931e0bf77753a791`.

## Claims audit

| Original statement or implementation | Code / year | Snapshot evidence and calculation | Finding and final action |
|---|---|---|---|
| Scenario national poverty 23.4% | SI.POV.NAHC / 2023 | 20.4% of population at national poverty lines | Incorrect; derive common-year baseline from CSV, display code/year/source. |
| Scenario youth unemployment 17.8% | SL.UEM.1524.ZS / 2023 | 26.836% of youth labour force ages 15–24 | Incorrect; derive CSV baseline; UI rounds to 26.8%, export also preserves unrounded value. |
| Population denominator 10 million | SP.POP.TOTL / 2023 | 10,389,799 persons | Rounded unsupported model denominator replaced with same-year observation. |
| Poverty decline from 2000 / clear 2015 inflection | SI.POV.LMIC / 2003–2023 | Only eight TJK observations: 2003 76.2; 2004 59.7; 2007 48.2; 2009 37.1; 2015 29.8; 2021 22.6; 2022 18.9; 2023 18.1 (%) | No 2000 value. Endpoint annualised declines (76.2−29.8)/12 = 3.866667 pp/year and (29.8−18.1)/8 = 1.4625 pp/year. Describe a smaller endpoint decline; no established structural break or exact inflection date. |
| Youth–adult gap 13.6 pp | SL.UEM.1524.ZS and SL.UEM.TOTL.ZS / 2023 | 26.836−11.546 = 15.29 pp | Replace with youth–total difference. Adult unemployment cannot be derived from these two rates alone. No identified skills-mismatch cause. |
| Youth unemployment comparative rank | SL.UEM.1524.ZS / 2023 | GEO 30.166; TJK 26.836; ARM 26.135; UZB 10.858; KGZ 8.205; KAZ 3.801 (%) | TJK second of six in descending reported value; higher unemployment is not superior policy performance. Ranking limitation immediately follows table. |
| Remittance endpoints | BX.TRF.PWKR.DT.GD.ZS / 2002, 2022, 2023 | 6.4337400543%, 49.8953124537%, 37.8445781946% of GDP | Display 6.4%, 49.9%, 37.8%, with exact years and no causal inference. |
| Remittance interval averages, including 38.4% and 32.5% | BX.TRF.PWKR.DT.GD.ZS | Original inclusive overlapping means: 2002–2010 26.5471631449 (9); 2010–2015 37.9958537193 (6); 2015–2023 31.9001375489 (9) | Audit retained here. Public brief uses non-overlapping inclusive intervals: 2002–2009 25.3892539742 (8); 2010–2014 40.1337129014 (5); 2015–2023 31.9001375489 (9), rounded to 25.4%, 40.1%, 31.9%. Unweighted means of annual shares, not pooled GDP ratios. |
| Highest remittance share among peers | BX.TRF.PWKR.DT.GD.ZS / 2023 | TJK 37.8445781946; KGZ 18.7736617681; UZB 13.8041936751; GEO 13.6504078223; ARM 6.3962109862; KAZ 0.1159960734 (%) | Supported only for this six-country group and same observation year. |
| GDP per capita described as PPP series | NY.GDP.PCAP.KD / snapshot dictionary | Constant 2015 US dollars, not NY.GDP.PCAP.PP.KD | Correct brief definition/code. No PPP series added. |
| Overall coverage 92.8% / continuous 24-year series | 17 codes; 6 countries; 2000–2023 | 2160 finite observations / (17×6×24 = 2448) = 88.2352941176% | Display 88.2%, envelope not complete annual coverage; per-indicator years/counts derived from CSV. |
| Derived yoy columns imply annual changes | All supplied derived columns | Differences match successive supplied observations; 41 change rows span gaps longer than one year | Qualify terminology. No annual values imputed; no changes to supplied historical CSV. |
| Latest inflation gap treated as contemporaneous | FP.CPI.TOTL.ZG | TJK latest 2016 versus KGZ latest 2023 | Label asynchronous, show both years; no same-year interpretation. Missing observations produce no gap. |
| Zero exports / ties / ranking direction | All comparison series | Tests cover numeric zero, null, quoted labels, asynchronous years and competition ties | Preserve zero, blank only missing; descending value ranks with ties; export source/retrieval labels. |
| Reach implies poverty exits; placement implies net jobs | Hypothetical inputs, not WDI findings | Assumed success applied to distinct households and assumed initially unemployed youth | Explicit additional assumptions, no attributable impact. National outcome magnitudes removed from programming narrative. |
| Productivity ceiling, reform/fiscal incentives, structural mismatch and location-specific causes | No identifying evidence in supplied series | Descriptive national indicators cannot identify these mechanisms | Qualify as hypotheses or remove; no proven causal relationship stated. |
| Regional 2024 values official and comparable | Subnational JSON, generic attribution only | No record/table URLs, verified reference-year evidence or harmonised definitions supplied | Preserve values as unverified demonstration, preserve original provenance claim in metadata, remove geographic priority/causal conclusions; registered unemployment distinct from national ILO-modelled youth series. |

## Figures, methodology and unresolved evidence

Both diagnostic PNGs were regenerated from the unchanged CSV using `scripts/regenerate_diagnostics.py`. The poverty figure uses only observed years; the remittance–poverty scatter uses the eight same-year pairs. No fitted causal curve or claimed 2015 inflection remains. Captions and alternative text identify definitions and limits.

CSV/Parquet keys, numerical values, names and units agree. Supplied coverage tables match CSV group counts and year bounds. Original WDI extraction/cleaning scripts were not supplied: inspection reproduces checks and figures, not the historical ETL. Conceptual SDG/RBM alignment is distinct from dataset provenance.

The snapshot labels SI.POV.LMIC as $3.65/day (2017 PPP); a contemporary API release can use a revised threshold/vintage. Refresh rejects incompatible international-poverty labels rather than silently combining definitions. Successful live countries alone are replaced and individually labelled; failed/all-null countries retain snapshot provenance. Scenario baselines always use the bundled snapshot.

Definition checks: [World Bank youth unemployment metadata](https://data.worldbank.org/indicator/SL.UEM.1524.ZS) and [GDP per capita, constant 2015 US$](https://data.worldbank.org/indicator/NY.GDP.PCAP.KD). These confirm definitions, not independent authentication of every historical snapshot value.

The two original policy Markdown files remain unavailable. Archived PDFs remain unchanged and excluded from public delivery; download controls remain disabled. Regional provenance, empirical calibration, historical ETL reproduction and PDF revision remain limitations, not completed work.
