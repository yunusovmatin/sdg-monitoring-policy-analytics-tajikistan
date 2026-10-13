# National poverty trend boundaries: source review

Internal source review, 12 October 2026; source values and candidate CSV unchanged. This records evidence for chart safeguards, not a complete national-methodology certification.

## Tajikistan

The [World Bank 2025 Poverty and Equity Assessment](https://documents1.worldbank.org/curated/en/099091825032032367/pdf/P500758-944805c9-3b47-4447-8fb8-f00495f6546f.pdf), PDF pages 21–22 (printed pages 11–12), Box 1 and following text, identifies modernized household budget surveys for 2021–2024, recalibrated national/extreme poverty lines using HBS 2021, and backcast poverty estimates before 2021. These pages were extracted and visually inspected. The [current Poverty and Equity Brief](https://documents1.worldbank.org/curated/en/099505004222529761/pdf/IDU-d72e8564-7d6e-4728-8261-ad1bc5e1fc49.pdf), page 2, accessed 12 October 2026, identifies modernized HBS 2021 and adoption in September 2024.

Therefore a conservative display boundary is **pre-2021 versus 2021 onward**. This evidence does not substantiate calling the captured WDI footnote a “2020 survey break.” The candidate contains only 2021–2024 Tajikistan national-poverty observations; each says `Source: TajStat`. No pre-boundary observation is present to segment in the current view. Backcast figures in the assessment are not inserted into this CSV or presented as identical to older captured source editions. A synthetic 2020/2021 fixture can test the guard without inventing an actual observation.

## Uzbekistan

The captured national-poverty (`SI.POV.NAHC`) footnote naming separate comparable spells belongs to **Uzbekistan 2012 and 2013**, not Tajikistan. It explicitly lists 2012–2013, 2010–2011 and 2001–2005. Source: [World Bank national poverty series](https://data.worldbank.org/indicator/SI.POV.NAHC), candidate `raw/SI.POV.NAHC.observations.json` and `observations.csv` with footnotes preserved.

Chart connections may be allowed within each expressly named spell, with boundaries between spells and between those historical observations and modern records. Calendar adjacency or absence of another note is not evidence that different spells are comparable. This is separate from the Uzbekistan income/consumption changes affecting Gini and bottom-quintile share.

## Scope

National poverty thresholds remain country-specific; cross-country numerical gaps/ranks are blocked. Retaining notes and making identified boundaries visible does not assert that all other segments are verified comparable. Independent statistical review remains pending. The raw candidate checksum is unchanged.
