import { observation, type DataPoint } from "./data";
import { toCsv } from "./csv";
export interface ScenarioInputs { households: number; outcomeRate: number; investmentPerHousehold: number; gdpGrowth: number; inflation: number; }
export const DEFAULT_INPUTS: ScenarioInputs = { households:10000,outcomeRate:30,investmentPerHousehold:500,gdpGrowth:5,inflation:6 };
export const ASSUMPTIONS = { householdSize:5.5, youthCandidatesPerHousehold:0.4, youthLaborForce:800000, sensitivity:0.3, targetYear:2030 };
export function getScenarioBaseline(data: DataPoint[]) {
  const years=data.filter(d=>d.country_code==="TJK" && d.indicator_code==="SI.POV.NAHC" && d.year<=2030).map(d=>d.year).sort((a,b)=>b-a);
  for (const year of years) {
    const poverty=observation(data,"SI.POV.NAHC",year), youth=observation(data,"SL.UEM.1524.ZS",year), population=observation(data,"SP.POP.TOTL",year);
    if (poverty && youth && population && population.value>0) return {year,poverty,youth,population};
  }
  return null;
}
export type Baseline=NonNullable<ReturnType<typeof getScenarioBaseline>>;
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
export function calculateScenario(baseline: Baseline, input: ScenarioInputs) {
  if (Object.values(input).some(v=>!Number.isFinite(v)) || input.households<0 || input.investmentPerHousehold<0 || input.outcomeRate<0 || input.outcomeRate>100 || input.inflation<=-100 || input.gdpGrowth<=-100) throw new Error("Invalid scenario inputs");
  const years=ASSUMPTIONS.targetYear-baseline.year;
  const reachedHouseholds=input.households*years;
  const peopleReached=reachedHouseholds*ASSUMPTIONS.householdSize;
  const assumedPovertyExits=peopleReached*input.outcomeRate/100;
  const youthCandidates=reachedHouseholds*ASSUMPTIONS.youthCandidatesPerHousehold;
  const assumedYouthTransitions=youthCandidates*input.outcomeRate/100;
  const povertyChange=assumedPovertyExits/baseline.population.value*100;
  const youthChange=assumedYouthTransitions/ASSUMPTIONS.youthLaborForce*100;
  const range=(base:number,change:number)=>[clamp(base-change*(1+ASSUMPTIONS.sensitivity)),clamp(base-change*(1-ASSUMPTIONS.sensitivity))];
  return { years,reachedHouseholds,peopleReached,assumedPovertyExits,youthCandidates,assumedYouthTransitions,
    povertyChange,youthChange,povertyCentre:clamp(baseline.poverty.value-povertyChange),youthCentre:clamp(baseline.youth.value-youthChange),
    povertyRange:range(baseline.poverty.value,povertyChange),youthRange:range(baseline.youth.value,youthChange),
    annualInvestment:input.households*input.investmentPerHousehold,
    cumulativeInvestment:input.households*input.investmentPerHousehold*years,
    gdpIndex:100*(1+input.gdpGrowth/100)**years,
    finalRealAnnualInvestment:input.households*input.investmentPerHousehold/(1+input.inflation/100)**years };
}
export function scenarioCsv(baseline: Baseline,input:ScenarioInputs) {
  const s=calculateScenario(baseline,input);
  return toCsv([["Metric","Code","Source","Baseline year","Baseline (%)","Hypothetical lower rate (%) in 2030","Hypothetical upper rate (%) in 2030","Discussion benchmark (%, not a target)"],
    ["National poverty",baseline.poverty.indicator_code,"Bundled WDI snapshot",baseline.year,baseline.poverty.value.toFixed(1),s.povertyRange[0].toFixed(1),s.povertyRange[1].toFixed(1),12],
    ["Youth unemployment",baseline.youth.indicator_code,"Bundled WDI snapshot",baseline.year,baseline.youth.value.toFixed(1),s.youthRange[0].toFixed(1),s.youthRange[1].toFixed(1),10],
    [],["Author","Matin Yunusov"],["Status","Independent analytical prototype; not commissioned, endorsed, reviewed or operated by UNDP"],
    ["Disclaimer","Hypothetical arithmetic; indicative only; not attributable impacts or forecasts"],
    ["Sensitivity","+/-30% of assumed change from baseline, not rate level; not a confidence interval; rates bounded to 0-100%"],
    ["Baseline youth unrounded",baseline.youth.value],["Baseline population",baseline.population.value],["Population code",baseline.population.indicator_code],
    ["Target illustration year",2030],["Years",s.years],["Annual distinct households",input.households],["Assumed outcome share (%)",input.outcomeRate],
    ["Investment per household (USD)",input.investmentPerHousehold],["Assumed persons per household",ASSUMPTIONS.householdSize],
    ["Assumed initially unemployed youth candidates per household",ASSUMPTIONS.youthCandidatesPerHousehold],["Assumed fixed youth labor force",ASSUMPTIONS.youthLaborForce],
    ["Cumulative distinct households",s.reachedHouseholds],["People reached (assumed)",s.peopleReached],["Poverty exits (assumed, not observed)",s.assumedPovertyExits],
    ["Youth candidates (assumed)",s.youthCandidates],["Youth transitions (assumed, not net measured jobs)",s.assumedYouthTransitions],
    ["Annual direct investment (USD)",s.annualInvestment],["Cumulative direct investment (USD)",s.cumulativeInvestment],
    ["GDP growth context (%)",input.gdpGrowth],["Hypothetical GDP index (baseline=100)",s.gdpIndex],
    ["Inflation context (%)",input.inflation],["Final annual investment in baseline-year purchasing-power USD",s.finalRealAnnualInvestment],
    ["GDP and inflation","Context arithmetic only; no estimated effect on poverty or unemployment"],
    ["Assumptions","Distinct initially poor households each year; all members of assumed successful households exit poverty and stay above the line; assumed initially unemployed youth transitions persist; no repeats, displacement, re-entry, demographic change or counterfactual"]]);
}
