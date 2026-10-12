# Time-series integrity — final corrections

12 October 2026. Presentation corrections preserve all captured statistics and their provenance.

Both dashboard and comparison time-series charts now use a numeric year axis, with a domain spanning the selected observations and integer year labels. Calendar distance determines position: an 18-year gap occupies 18 times the distance of one year. `calendarSeries` creates a presentation-only annual grid with nulls for absent observations; it never writes these placeholders to the source dataset or assigns zero to them.

Lines are split into independent segments when observations are not consecutive or a recognized measurement boundary is crossed. `connectNulls=false` is explicit. Dots preserve isolated source observations; tooltips show their actual year and value. Comparison text tables and CSV exports continue to use the recorded observations, with blanks for country-specific missing values. Segment keys are internal chart identifiers, not new statistical variables.

## Recognized boundaries and source scope

- Uzbekistan distributional observations use consumption in 2000, 2002 and 2003, then income from 2021. The 2003–2021 gap is not bridged, and the captured welfare-concept change also starts a separate segment. Source: the captured WDI survey footnotes in `data/releases/wdi-2026-10-11-candidate/raw/` and `FOOTNOTE_AND_COMPARABILITY_AUDIT.md`.
- Tajikistan modernized household-budget-survey estimates from 2021 are separated from any earlier poverty/distribution observations. This conservative boundary is documented source review, not an invented observation-level WDI footnote. Current national-poverty candidate records contain only 2021–2024; there is therefore no earlier observation to join in that actual chart. Tests use explicitly synthetic consecutive 2020/2021 records to prove the boundary works if earlier data enter a future approved release.
- A transition between explicit income and consumption footnotes, an explicit series-break source note, and Georgia's 2024 census population basis also cause separation. These safeguards are not a complete harmonization audit of every survey or a guarantee that connected points are methodologically comparable.
- Uzbekistan national-poverty footnotes attached to 2012/2013 identify separate comparable spells in 2001–2005, 2010–2011 and 2012–2013. The adjacent 2011/2012 transition is explicitly split, as are calendar gaps between other spells. A sixth regression test preserves both sides and permits connections within the 2012–2013 spell.

Tajikistan boundary evidence: [World Bank Poverty and Equity Assessment, PDF pp. 21–22, Box 1 and following text](https://documents1.worldbank.org/curated/en/099091825032032367/pdf/P500758-944805c9-3b47-4447-8fb8-f00495f6546f.pdf) identifies modernized 2021–2024 surveys and separately back-cast earlier estimates. [Poverty and Equity Brief, p. 2](https://documents1.worldbank.org/curated/en/099505004222529761/pdf/IDU-d72e8564-7d6e-4728-8261-ad1bc5e1fc49.pdf) describes recalibration using HBS 2021 and adoption in September 2024. Neither source is permission to replace this captured dataset with different estimates.

The UI identifies observed gaps/breaks in text. Existing cautions and source footnotes remain available. Nothing is smoothed, back-cast, interpolated, rebased or recalibrated by this correction.

## Regression scope

`client/src/lib/timeSeries.test.ts` covers consecutive years including a real zero, a long calendar gap with welfare-concept change, the synthetic Tajikistan 2020/2021 boundary, independently missing observations for two countries, and an absent selection. The input array is checked for mutation. Browser regressions must additionally inspect actual SVG positions/segments using captured Uzbekistan Gini observations and current Tajikistan poverty, on both dashboard and comparison charts. Their execution results and screenshots are supplied in the final private evidence archive; tests being present in source alone do not establish a pass.
