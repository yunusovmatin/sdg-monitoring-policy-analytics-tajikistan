# Footnote and comparability audit

Author: Matin Yunusov. Isolated v2 review candidate; no institutional endorsement. Audit executed2026-10-11 against `wdi-2026-10-11-candidate`. Independent statistical signoff PENDING.

The candidate has2,315 nonnull observations. Its CSV SHA256 is `2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae`. Raw World Bank WDI source2 responses, exact URLs, retrieval timestamps and checksums are in `data/releases/wdi-2026-10-11-candidate/manifest.json`. Requests include `footnote=y`, six explicit countries and2000–2025. Source response `lastupdated` is2026-10-08; capture timestamps span2026-10-11T17:52:16.063880+00:00 to2026-10-11T17:52:47.170151+00:00. These are retrieval/update dates, distinct from observation years.

## Captured status and footnote counts

All2,315 `observation_status` fields are empty. Absence of a flag is **not evidence of finality, survey measurement or absence of modeling**. There are514 nonempty `footnote` fields:

| Indicator | Nonempty footnotes |
|---|---:|
|SI.DST.FRST.20, bottom20% welfare share|112|
|SI.POV.DDAY, current$3.00/day2021PPP|112|
|SI.POV.GINI, Gini index|112|
|SI.POV.LMIC, current$4.20/day2021PPP|112|
|SI.POV.NAHC, national poverty|63|
|SP.POP.TOTL, population|3|
|All other11 series|0|

The transformed CSV retains source footnotes, status, source update and PPP basis per observation. The public copy is byte-identical. UI and exports retain these fields; full evidence remains in the source archive. Empty footnotes do not imply that there are no limitations.

## Gini and distribution comparisons

Latest Gini entries illustrate two distinct incompatibilities: asynchronous years and different welfare concepts.

| Country | Latest year | Value,0–100 index | Captured survey/welfare description |
|---|---:|---:|---|
|Armenia|2024|27.4|ILCS; unit-record consumption|
|Georgia|2024|33.9|HIS; unit-record consumption|
|Kazakhstan|2021|29.2|HBS; unit-record consumption|
|Kyrgyz Republic|2024|27.5|KIHS; unit-record consumption|
|Tajikistan|2024|36.1|HBS; unit-record consumption|
|Uzbekistan|2025|32.7|HBS; unit-record income|

Source: [World Bank Gini series](https://data.worldbank.org/indicator/SI.POV.GINI), versioned `raw/SI.POV.GINI.observations.json`. The exact TJK2024 footnote identifies HBS and consumption; UZB2025 identifies HBS and income. Income and consumption distributions are not interchangeable. All112 observations in each of the Gini, bottom20% share and international-poverty series have survey/welfare footnotes. Survey instruments and years also vary within countries; no harmonization or arbitrary imputation was added.

Uzbekistan's captured Gini/bottom20% records use consumption in2000,2002 and2003, then income in2021–2025. The latest income footnote must not be applied retroactively to the whole series. A line spanning that gap and welfare-definition change does not establish a comparable welfare trend.

The v2 review blocks cross-country numeric ranks and gaps for Gini and bottom20% share. Tables/series remain descriptive source records with explicit years and footnotes. The protection is conservative: matching calendar years alone cannot resolve different welfare definitions. Distribution values are not empirical programme effects or policy-performance measures.

## National poverty lines and source breaks

Source: [World Bank national poverty series](https://data.worldbank.org/indicator/SI.POV.NAHC), versioned `raw/SI.POV.NAHC.observations.json`. Captured notes attribute Tajikistan to TajStat; Armenia to its statistical agency; Georgia to Geostat, with notes identifying an absolute poverty line and government estimates; Kazakhstan to its statistics authority. Uzbekistan historical notes cite welfare/living-standards strategies and distinguish government estimates from World Bank estimates.

One retained national-poverty note explicitly separates comparable spells: most recent2012–2013, next2010–2011, earlier2001–2005, referring to the Poverty and Equity Database for the complete series. This is a warning about comparability, not permission to join all years into one validated trend. National thresholds are country-specific; a common percent unit does not establish a common deprivation threshold.

The v2 review blocks cross-country national-poverty ranks and gaps. The captured TJK2023 value20.4% and2024 value19.8% both carry `Source: TajStat`. They remain WDI-captured records, not a claim that this independent service has national data-owner approval.

## Population source exceptions

Source: [World Bank population series](https://data.worldbank.org/indicator/SP.POP.TOTL), versioned `raw/SP.POP.TOTL.observations.json`.

- Armenia2000: the footnote marks a series break, switching from UN World Population Prospects before that year to national statistical-office data from that year onwards. The extraction starts2000, so no annual metric against1999 was created.
- Georgia2024 and2025: footnotes describe averages of January1 populations based on the2024 census. Captured values are3,812,518 and3,935,766 persons respectively. This country-specific footnote qualifies the general metadata description of midyear estimates. Changes spanning census/source adjustments must not be read as migration or demographic mechanisms without further national documentation.

The pipeline's consecutive-year difference is arithmetic, not proof of a comparable demographic growth rate. Source footnotes remain visible; no census adjustment or smoothing was invented.

## Latest2025 macroeconomic and labour records

TJK2025 GDP growth is8.4000005339007497%, GDP per capita is1,592.5865137575299 constant2015US dollars, youth unemployment14.594%, and total unemployment6.931%. Their observation status and footnote fields are blank. These figures are traceable captured WDI records; the audit cannot infer independent final-versus-provisional or forecast status from blank flags.

Unemployment series titles explicitly identify **modeled ILO estimates**. Metadata credits the ILO Modelled Estimates database/ILOSTAT and lists source accessJanuary17,2026. Youth unemployment uses the youth labour-force denominator ages15–24; total unemployment is not adult unemployment. Do not call them direct survey measurements merely because the year is recent. GDP source metadata defines annual constant-price change and does not supply an observation-level finality flag in the captured response.

## Disposition and limitations

The review preserves metadata rather than dropping inconvenient notes. Numeric ranking is also blocked whenever latest observation years differ. Same-year descriptive comparisons still require source/definition review. No source values, original snapshot, raw response or candidate checksum were changed by this audit. Original international-poverty edition provenance remains unresolved separately in `DATA_VINTAGE_AND_POVERTY_RECONCILIATION.md`; only captured current-definition records are used by the v2 review. This is a scoped authoring audit, not independent statistical certification or institutional approval.
