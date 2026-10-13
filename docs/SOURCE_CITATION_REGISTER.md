# Source citation register

Author: Matin Yunusov. Independent prototype; no institutional endorsement.

Candidate release: `wdi-2026-10-11-candidate`. CANDIDATE_NOT_APPROVED. Retrieved timestamps and source URLs are per request in its manifest. Sources below were checked on 2026-10-11.

Every candidate observation resolves to `(country_code, indicator_code, year, vintage)` in `observations.csv`, with source URL, retrieval time, source update, status and any API footnote. All six-country coverage/gaps are in `quality.json`. Null records remain in raw evidence; they are not zeros.

| WDI code | Definition/source | SDG attribution |
|---|---|---|
| BX.TRF.PWKR.DT.GD.ZS | [Personal remittances, received (% of GDP)](https://data.worldbank.org/indicator/BX.TRF.PWKR.DT.GD.ZS) | No exact SDG indicator; Contextual WDI statistic |
| EG.FEC.RNEW.ZS | [Renewable energy consumption (% of total final energy consumption)](https://data.worldbank.org/indicator/EG.FEC.RNEW.ZS) | 7.2.1; Exact official SDG indicator concept |
| FP.CPI.TOTL.ZG | [Inflation, consumer prices (annual %)](https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG) | No exact SDG indicator; Contextual WDI statistic |
| NY.GDP.MKTP.KD.ZG | [GDP growth (annual %)](https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG) | 8.1 (proxy; not 8.1.1); SDG-aligned proxy |
| NY.GDP.PCAP.KD | [GDP per capita (constant 2015 US$)](https://data.worldbank.org/indicator/NY.GDP.PCAP.KD) | 8.1 context; Contextual WDI statistic |
| SE.SEC.ENRR | [School enrollment, secondary (% gross)](https://data.worldbank.org/indicator/SE.SEC.ENRR) | 4 context; no exact indicator; Contextual WDI statistic |
| SI.DST.FRST.20 | [Income share held by lowest 20%](https://data.worldbank.org/indicator/SI.DST.FRST.20) | 10.1 context; not 10.1.1; SDG-aligned proxy |
| SI.POV.DDAY | [Poverty headcount ratio at $3.00 a day (2021 PPP) (% of population)](https://data.worldbank.org/indicator/SI.POV.DDAY) | 1.1.1; Exact official SDG indicator concept; aggregate only |
| SI.POV.GINI | [Gini index](https://data.worldbank.org/indicator/SI.POV.GINI) | 10 inequality context; no exact indicator; SDG-aligned proxy |
| SI.POV.LMIC | [Poverty headcount ratio at $4.20 a day (2021 PPP) (% of population)](https://data.worldbank.org/indicator/SI.POV.LMIC) | 1 poverty context; not 1.1.1; SDG-aligned proxy |
| SI.POV.NAHC | [Poverty headcount ratio at national poverty lines (% of population)](https://data.worldbank.org/indicator/SI.POV.NAHC) | 1.2.1; Exact official SDG indicator concept; aggregate only |
| SL.TLF.CACT.ZS | [Labor force participation rate, total (% of total population ages 15+) (modeled ILO estimate)](https://data.worldbank.org/indicator/SL.TLF.CACT.ZS) | 8 labour-market context; Contextual WDI statistic |
| SL.UEM.1524.ZS | [Unemployment, youth total (% of total labor force ages 15-24) (modeled ILO estimate)](https://data.worldbank.org/indicator/SL.UEM.1524.ZS) | 8.5.2 (ages15–24 aggregate); SDG-aligned proxy / age disaggregation |
| SL.UEM.TOTL.ZS | [Unemployment, total (% of total labor force) (modeled ILO estimate)](https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS) | 8.5.2; Exact official SDG indicator concept; modeled aggregate |
| SM.POP.NETM | [Net migration](https://data.worldbank.org/indicator/SM.POP.NETM) | Migration context; no exact indicator; Contextual WDI statistic |
| SP.POP.TOTL | [Population, total](https://data.worldbank.org/indicator/SP.POP.TOTL) | Demographic denominator; no exact indicator; Contextual WDI statistic |
| SP.URB.TOTL.IN.ZS | [Urban population (% of total population)](https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS) | Urbanization context; no exact indicator; Contextual WDI statistic |

Primary cross-cutting references:

- [World Bank June 2025 poverty-line revision](https://www.worldbank.org/en/news/factsheet/2025/06/05/june-2025-update-to-global-poverty-lines): current 2021 PPP thresholds replace older definitions; historical editions are incompatible without reconciliation.
- [UNSD SDG metadata repository](https://unstats.un.org/sdgs/metadata/): official indicator definitions and disaggregations, not a claim that these WDI aggregates are the entire official SDG reporting series.
- [UNSD 7.2.1 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-07-02-01.pdf): renewable total final energy consumption. Not a certified SDG13 measure.
- [UNSD 8.1.1 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-08-01-01.pdf): growth of real GDP per capita, unlike bundled aggregate GDP growth.
- [UNSD 8.5.2 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-08-05-02.pdf): unemployment denominator and required disaggregations.
- [UNSD 1.2.1 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-01-02-01.pdf): national lines and country-specific definitions.
- [UNSD 10.1.1 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-10-01-01.pdf): bottom40% welfare growth, not Gini or bottom20% share.
- [Tajikistan Poverty and Equity Brief, 2024](https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099062824104010489): contemporaneous independently checked report; cannot identify every archived numeric value or authenticate missing original ETL.
- [World Bank data reuse terms](https://data.worldbank.org/summary-terms-of-use): CC BY4.0 unless indicated otherwise, subject to additional World Bank terms. All17 inspected indicator pages show CC BY-4.0; per-page retrieval timestamp/hash/evidence in `license-evidence.json`. Attribute World Bank and originating organizations, indicate transformations, do not imply endorsement.

Review status: analyst classifications supplied by the project authoring process; independent statistical signoff PENDING. National data-owner approval PENDING. Historical snapshot labels are not authoritative source metadata.
