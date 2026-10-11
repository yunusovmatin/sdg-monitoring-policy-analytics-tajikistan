# Scenario assumptions — Project 1

Author: Matin Yunusov. Independent analytical portfolio prototype; not commissioned, endorsed, reviewed or operated by UNDP. Audit date: 10 October 2026.

This explorer illustrates arithmetic conditional on hypothetical inputs. It is not an estimated policy effect, economic forecast, programme costing, confidence interval or attributable-impact model. Historical observations and hypothetical 2030 rates are visually and verbally distinguished.

## Baselines and inputs

Baseline is the latest common bundled TJK year for national poverty, youth unemployment and population, no later than 2030. In this snapshot that is 2023: SI.POV.NAHC 20.4%; SL.UEM.1524.ZS 26.836% of youth labour force ages 15–24; SP.POP.TOTL 10,389,799 persons. Source: `client/public/data/processed/sdg_tjk_tidy.csv`, WDI snapshot labelled retrieved 25 January 2026. SI.POV.LMIC is a different poverty definition and is not substituted. Live refresh does not alter these baselines. Missing common-year evidence disables scenario calculation.

| Input or constant | Default | Interface range | Units and evidential status |
|---|---:|---|---|
| Annual distinct households H | 10,000 | 0–50,000; step 1,000 | Initially poor households per year; hypothetical, no repeat recipients |
| Assumed outcome share q | 30 | 0–90; step 5 | Percent, divided by 100; assumed outcome achievement, not measured success |
| Investment per household I | 500 | 100–2,000; step 50 | USD per household per year, hypothetical direct expenditure |
| Annual GDP growth g | 5 | 0–10; step 0.1 | Percent; constant contextual index calculation only |
| Annual inflation f | 6 | 0–15; step 0.1 | Percent; purchasing-power context only |
| Household size s | 5.5 | Fixed | Assumed persons per household, uncalibrated |
| Youth candidates k | 0.4 | Fixed | Assumed initially unemployed youth candidates per household; not a measured 40% share of all persons |
| Youth labour force L | 800,000 | Fixed | Assumed persons; not a verified statistical denominator |
| Sensitivity b | 0.30 | Fixed | Fraction of assumed change, not rate level |
| Illustration year | 2030 | Fixed | Calendar year, not an official target commitment |
| Discussion benchmarks | 12 poverty; 10 youth | Fixed chart reference | Percent; uncalibrated discussion values, explicitly not official SDG targets |

## Formulas and units

Let T = 2030 − baseline year = 7 annual cohorts (2024–2030). No arbitrary fivefold multiplier remains.

- Distinct households reached = H×T (households).
- People reached = H×T×s (persons).
- Assumed poverty exits E = H×T×s×q/100 (persons).
- Assumed youth candidates = H×T×k (persons).
- Assumed persistent youth transitions J = H×T×k×q/100 (persons).
- Poverty change ΔP = E / baseline population ×100 (percentage points).
- Youth change ΔU = J / L ×100 (percentage points).
- Centre = clamp(baseline rate − change, 0, 100).
- Lower rate = clamp(baseline rate − change×1.30, 0, 100).
- Upper rate = clamp(baseline rate − change×0.70, 0, 100).
- Annual direct investment = H×I (USD/year); cumulative direct investment = H×I×T (USD).
- Hypothetical GDP index = 100×(1+g/100)^T; baseline index 100.
- Final-year annual investment at baseline-year purchasing power = H×I/(1+f/100)^T (baseline-year USD).

The ±30% band varies the assumed change. It never makes a zero-effect case appear to improve or worsen; zero households or zero outcome share collapses both bounds to the baseline. Rate clamping avoids negative values but is a mathematical bound, not validation of feasibility. Large reach assumptions can exceed eligible populations; the model does not demonstrate feasible programme scale.

GDP and inflation do not affect poverty or youth rates. Unsupported GDP/inflation elasticities and the Okun-inspired adjustment were removed. The retained sliders supply contextual calculations without invented empirical coefficients. The expenditure measure excludes administration, delivery, overhead, financing and other programme costs; it is not a costed budget. The final purchasing-power figure describes one annual allocation, not the discounted total cumulative investment.

## Default independent recomputation

| Quantity | Result |
|---|---:|
| Years / distinct households | 7 / 70,000 |
| People reached / assumed exits | 385,000 / 115,500 |
| Youth candidates / assumed transitions | 28,000 / 8,400 |
| Poverty / youth assumed change | 1.111667295 / 1.05 pp |
| Poverty centre | 19.288332705% |
| Poverty sensitivity rates | 18.9548325165–19.6218328935%; displayed 19.0–19.6% |
| Youth centre | 25.786% |
| Youth sensitivity rates | 25.471–26.101%; displayed 25.5–26.1% |
| Annual / cumulative direct investment | USD 5,000,000 / USD 35,000,000 |
| GDP index | 140.7100422656 |
| Final annual purchasing power | USD 3,325,285.5681 |

Changing H to 11,000 while retaining other defaults yields displayed poverty 18.8–19.5%, youth 25.3–26.0%, annual USD 5.5 million and cumulative USD 38.5 million. Independent Python calculations verify actual browser downloads at all three tested widths. The CSV uses the same one-decimal baseline/bounds as the UI and also supplies unrounded youth baseline, denominator, codes, assumptions, inputs, author and independence disclaimer.

## Interpretation limits

Reach does not establish poverty exit. The arithmetic additionally assumes all members of successful initially poor households exit poverty and stay above the national line. Youth candidates are assumed initially unemployed; transitions are assumed to persist with a fixed youth labour force. Training or placement does not establish net measured jobs. No repeat households, displacement, re-entry, demographic change, selection bias, macro feedback or counterfactual are modelled. The same outcome share applied to poverty and youth is a transparent simplification, not an empirical joint-outcome relationship.

The model can demonstrate how arithmetic changes when assumed reach, success, spending and context change. It cannot show actual SDG progress, causal additionality, achievable national-rate reductions, statistically estimated uncertainty or the cost-effectiveness of a real programme. Household size, youth-candidate rate, labour-force stock, benchmarks and sensitivity are not empirically calibrated.
