# Regional evidence investigation

Investigated 11 October 2026. Decision: remove unsupported poverty, unemployment and youth rates from the analytical UI. Do not derive geographic priorities from the legacy illustrative JSON. No replacement rate series is promoted.

## Primary sources actually inspected

- Agency on Statistics, Regions of the Republic of Tajikistan 2024, released 6 November 2024: https://www.stat.tj/en/released-statistical-publication-regions-in-the-republic-of-tajikistan-2024/ . PDF table of contents and introduction inspected: https://www.stat.tj/wp-content/uploads/2024/11/osnovnoj-regiony-2024-1.pdf . Population tables begin at printed page 17. A publication title year is not proof that every observation refers to 2024.
- Agency, Population as of 1 January 2024: https://www.stat.tj/wp-content/uploads/2024/09/machmuai-shumorai-aholi-to-1.01.2024.pdf . Printed pages 4-5 define permanent resident population and census 2020-based demographic accounting. Printed page 11 provides the regional start-of-year series; downloaded PDF and rendered page 11 were visually checked and retained in private evidence. Rounded thousands converted to persons are not exact individual counts.
- Agency, Labour Market 2024: https://www.stat.tj/wp-content/uploads/2025/02/bozori_mehnat_2024.-rab-varyant-%E2%80%94-12.pdf . Contents identify printed page 138 registered unemployed by region and page 140 age distributions. These administrative counts are not ILO-modelled total or youth labour-force unemployment rates. No rate is extracted without denominator validation.
- Publication archive: https://www.stat.tj/en/electronic-versions-of-publications-archive/ . Future investigation can check Household Budget Survey and food-security/poverty tables; no complete, comparable 2024 regional poverty/youth rate evidence was established here. This is a bounded investigation, not proof that no regional data exists.

## Substantiated population fixture, not a policy-priority module

`docs/data/regional_population_2024_verified.csv` records only the five mutually exclusive highest-level population components of the inspected source, with explicit source date, table locator and unit. As of1January 2024, GBAO233.6 thousand + Sughd2917.3 + Khatlon3697.8 + Dushanbe1242.6 + Districts of Republican Subordination2197.0 = national 10288.3 thousand. Displayed rounded components reconcile exactly at0.1 thousand precision.

This differs from the bundle's 2023 WDI national population10389799. The reference dates and source estimation methods differ. Do not scale these regions to the WDI denominator or compute regional poverty counts from unsupported rates. District rows nested in regions must not be added again to regional totals. A separate future feature would need official geographic codes, boundary history and additional reviewed series.

## Reuse and promotion status

The Agency website footer states CC BY 4.0 and requires a link to stat.tj; the publication itself bears the Agency copyright. Attribution and original URL are retained. Before distributing broader tables, a maintainer should confirm any publication-specific restrictions and permitted translations. Only the small attributed factual fixture is included; whole source PDFs remain private review evidence.

The supplied illustrative file is historical evidence, not a validated observation release. Keep it outside the public analytical data path. No source agreement, statistical-owner approval or institutional endorsement has been obtained. External signoff is PENDING.
