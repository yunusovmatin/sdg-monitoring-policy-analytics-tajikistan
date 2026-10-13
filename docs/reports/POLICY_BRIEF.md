# Tajikistan: monitoring evidence and policy questions

Author: Matin Yunusov. Independent portfolio research prototype. No UNDP affiliation, commission, endorsement or institutional approval. Draft v2 review edition, 11 October 2026.

This is a newly authored canonical report, not a recovered original. The original revised Markdown sources were unavailable. Legacy PDFs are historical reference material and are not current reports.

## Evidence boundary

This review report is pinned to {{RELEASE_ID}}, a newly extracted current-definition candidate, not an approved production data release. API retrieval interval: {{RETRIEVED_START}} to {{RETRIEVED_END}}. Its archived raw responses, metadata and source URLs are in data/releases/{{RELEASE_ID}}/. Observation CSV SHA-256 after canonical LF normalization: {{SNAPSHOT_SHA}}. Frozen public v1.0.0 and its original snapshot remain preserved.

The candidate contains {{ROWS}} finite observations across {{INDICATORS}} WDI indicators and {{COUNTRIES}} countries within 2000-2025. It is descriptive evidence with varying observation years; external statistical review and promotion are pending. Recommendations below are questions for further study, not estimated policy effects. Metadata and revision evidence are in docs/INDICATOR_REGISTER.csv and docs/DATA_VINTAGE_AND_POVERTY_RECONCILIATION.md. Current data definitions: https://databank.worldbank.org/source/world-development-indicators

## Same-year observations: Tajikistan, 2023

- National poverty: {{POVERTY}}% of population, SI.POV.NAHC. National poverty lines are country-specific; this rate must not be ranked as a directly equivalent international poverty threshold. Source definition: https://data.worldbank.org/indicator/SI.POV.NAHC
- Youth unemployment: {{YOUTH}}% of the labour force aged 15-24, SL.UEM.1524.ZS; total unemployment: {{TOTAL}}%, SL.UEM.TOTL.ZS. Both are ILO-modelled estimate series. Their arithmetic difference is {{GAP}} percentage points. This is youth minus total, not youth minus adult; adult unemployment cannot be recovered from these rates alone. Definition: https://data.worldbank.org/indicator/SL.UEM.1524.ZS
- Population denominator: {{POPULATION}} persons, SP.POP.TOTL. This is the snapshot's national population estimate, not the independently verified sum of a regional table. Definition: https://data.worldbank.org/indicator/SP.POP.TOTL
- Personal remittances received: {{REMITTANCE}}% of GDP, BX.TRF.PWKR.DT.GD.ZS. This is a GDP share, not household dependence or disposable income. Definition: https://data.worldbank.org/indicator/BX.TRF.PWKR.DT.GD.ZS

## Descriptive comparisons and missingness

The six-country youth unemployment comparison for 2023 is: {{YOUTH_PEERS}}. Tajikistan is third in descending value in this selected group, not third in policy performance. Modelled estimates and a selected peer group cannot establish causes or identify the best intervention.

The remittance share's unweighted annual means are {{REMITTANCE_MEANS}}. These are means of observed GDP shares, not pooled ratios or evidence of a causal effect on poverty. GDP per capita in NY.GDP.PCAP.KD is constant 2015 US dollars, not PPP international dollars. Unequal observation years, revisions and missing observations limit comparative interpretation.

Observation footnotes matter: national poverty definitions and source breaks differ; Gini and bottom-quintile shares mix income-based Uzbekistan observations in 2021-2025 with consumption-based earlier observations and peers. Cross-country gaps and ranks for these three series are withheld. Georgia population metadata flags its 2024 census basis. Inspect row-level source notes before interpreting trends; matching years and units alone do not establish comparability.

## International poverty: unresolved vintage

The archived CSV labels SI.POV.DDAY and SI.POV.LMIC with 2017-PPP poverty lines. The World Bank changed the corresponding current definitions to 2021 PPP in June 2025. No numeric relabelling or old/new series splice is justified without original source responses and reconciliation. Background: https://www.worldbank.org/en/news/factsheet/2025/06/05/june-2025-update-to-global-poverty-lines

An independent World Bank 2024 Poverty and Equity Brief reports a 2023 $3.65/day (2017 PPP) rate of 10.7%, while the old bundle contains 18.1% under that label. Every overlapping old international-poverty numeric observation matches the newly retrieved current 2021-PPP values, suggesting stale labels. That does not authenticate the bundle's original extraction vintage. The old series remain quarantined. This report makes no historical 2017-PPP trend claim; the new candidate keeps current definitions and source responses separate. Source: https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099062824104010489

Current unemployment revisions also change interpretation: Tajikistan's 2023 youth rate is 14.511% in the candidate versus 26.836% in the old snapshot; total unemployment is 7.037% versus 11.546%. Original values are preserved as archive evidence, not merged into this report. The candidate's newest common scenario baseline is {{SCENARIO_YEAR}}: national poverty {{SCENARIO_POVERTY}}%, youth unemployment {{SCENARIO_YOUTH}}%, population {{SCENARIO_POPULATION}} persons.

## Policy questions, not causal conclusions

- Youth transitions: test whether training, placement services or demand-side barriers affect employment outcomes using programme records, comparable controls, pre-specified outcomes and follow-up. The national youth-total difference does not prove skills mismatch.
- Poverty protection: assess targeting, exclusion, household welfare measurement, inflation exposure and programme costs using properly licensed microdata and survey design. National aggregate rates cannot identify eligible households.
- Remittance exposure: investigate household and sector distribution, volatility and coping responses. The national GDP share alone cannot demonstrate that remittances reduce poverty or create structural dependence.
- Geographic targeting: obtain verified region/district observations, geographic crosswalks, denominators, dates and sampling precision before prioritising places. The former illustrative regional figures are not accepted observations.

## Educational hypothetical calculator

The calculator is arithmetic, not a forecast, impact estimate, budget or confidence interval. In this review candidate it assumes 10,000 distinct initially poor households per year, 30% successful outcomes, 5.5 persons per household, 0.4 initially unemployed youth candidates per household, a fixed youth labour force of 800,000, and persistence for {{COHORTS}} cohorts from the {{SCENARIO_YEAR}} baseline to 2030. The archived v1 calculator retains its own older baseline; these outputs are a separate candidate illustration.

Under these assumptions, the illustrative poverty rate is {{POVERTY_RANGE}}% and youth unemployment {{YOUTH_RANGE}}%. The range changes the assumed effect by +/-30% and bounds rates to 0-100%; it is not statistical uncertainty. Annual direct household investment is USD 5,000,000; {{COHORTS}}-cohort investment is USD {{CUMULATIVE_INVESTMENT}}, excluding administration and other programme costs. GDP growth and inflation inputs are context arithmetic, with no fitted effect on these outcomes.

The assumptions omit repeat participation, displacement, re-entry, population changes and a counterfactual. Baseline rates are observations from the pinned snapshot; every programme coefficient is assumed. Formula details are in the companion methodology and docs/SCENARIO_ASSUMPTIONS.md.

## Review status

External statistical, policy, data-owner, accessibility and security signoffs are PENDING. No reviewer or institution has endorsed this document. Engineering checks cannot provide substantive or institutional approval. Review scope and proposed requests are in docs/EXTERNAL_REVIEW_AND_SIGNOFF.md.
