import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Download, RefreshCw, Target } from "lucide-react";
import { useState } from "react";
import { type DataPoint } from "@/lib/data";
import { ASSUMPTIONS, DEFAULT_INPUTS, getScenarioBaseline, calculateScenario, scenarioCsv } from "@/lib/scenario";
import { downloadCsv } from "@/lib/download";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ScenarioPlanner({ data }: { data: DataPoint[] }) {
  const [beneficiaries, setBeneficiaries] = useState(DEFAULT_INPUTS.households);
  const [successRate, setSuccessRate] = useState(DEFAULT_INPUTS.outcomeRate);
  const [investmentPerCapita, setInvestmentPerCapita] = useState(DEFAULT_INPUTS.investmentPerHousehold);
  const [gdpGrowth, setGdpGrowth] = useState(DEFAULT_INPUTS.gdpGrowth);
  const [inflation, setInflation] = useState(DEFAULT_INPUTS.inflation);
  const baseline=getScenarioBaseline(data);
  if (!baseline) return <Card className="p-6">Scenario unavailable: a common-year poverty, youth unemployment and population baseline is required.</Card>;
  const input={households:beneficiaries,outcomeRate:successRate,investmentPerHousehold:investmentPerCapita,gdpGrowth,inflation};
  const scenario=calculateScenario(baseline,input);
  const chartData=[
    { name:"National poverty",label:"National poverty",baseline:baseline.poverty.value,range:scenario.povertyRange,benchmark:12 },
    { name:"Youth unemployment",label:"Youth unemployment",baseline:baseline.youth.value,range:scenario.youthRange,benchmark:10 }
  ];
  const handleExport=()=>downloadCsv(scenarioCsv(baseline,input),"hypothetical_scenario_2030.csv");

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h2 className="text-lg font-bold text-gray-900">Illustrative Scenario Explorer</h2>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded">INDICATIVE ONLY</span>
          </div>
          <p className="text-sm text-gray-500">Hypothetical reach arithmetic using captured candidate WDI baselines. Illustrative trajectories, not attributable impacts or forecasts. The ranges are not economically validated bounds.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setBeneficiaries(10000);
              setSuccessRate(30);
              setInvestmentPerCapita(500);
              setGdpGrowth(5.0);
              setInflation(6.0);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="space-y-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Annual Distinct Households</label>
              <span className="text-sm font-bold text-blue-600">{beneficiaries.toLocaleString()}</span>
            </div>
            <Slider
              aria-label="Annual Distinct Households"
              value={[beneficiaries]}
              onValueChange={(val) => setBeneficiaries(val[0])}
              min={0}
              max={50000}
              step={1000}
              className="py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Assumed initially poor households; no repeat recipients</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Assumed Outcome Rate</label>
              <span className="text-sm font-bold text-blue-600">{successRate}%</span>
            </div>
            <Slider
              aria-label="Assumed Outcome Rate"
              value={[successRate]}
              onValueChange={(val) => setSuccessRate(val[0])}
              min={0}
              max={90}
              step={5}
              className="py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Assumed share achieving the illustrative outcome</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Investment per Household</label>
              <span className="text-sm font-bold text-blue-600">${investmentPerCapita}</span>
            </div>
            <Slider
              aria-label="Investment per Household"
              value={[investmentPerCapita]}
              onValueChange={(val) => setInvestmentPerCapita(val[0])}
              min={100}
              max={2000}
              step={50}
              className="py-2"
            />
            <p className="text-xs text-gray-500 mt-1">USD per household per year</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Annual GDP Growth (Context)</label>
              <span className="text-sm font-bold text-blue-600">{gdpGrowth}%</span>
            </div>
            <Slider
              aria-label="GDP Growth Context"
              value={[gdpGrowth]}
              onValueChange={(val) => setGdpGrowth(val[0])}
              min={0}
              max={10}
              step={0.1}
              className="py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Hypothetical GDP index only; no effect on rates</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Annual Inflation (Context)</label>
              <span className="text-sm font-bold text-blue-600">{inflation}%</span>
            </div>
            <Slider
              aria-label="Inflation Context"
              value={[inflation]}
              onValueChange={(val) => setInflation(val[0])}
              min={0}
              max={15}
              step={0.1}
              className="py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Purchasing-power context only; no effect on rates</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900">Assumed Annual Direct Investment</span>
              <span className="text-lg font-bold text-gray-900">
                ${(scenario.annualInvestment / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-2 space-y-6">
          <p className="text-sm text-gray-700" data-testid="scenario-baselines">Captured candidate WDI baselines ({baseline.year}): national poverty {baseline.poverty.value.toFixed(1)}% of population ({baseline.poverty.indicator_code}); youth unemployment {baseline.youth.value.toFixed(1)}% of youth labor force ages 15-24 ({baseline.youth.indicator_code}); population {baseline.population.value.toLocaleString()} ({baseline.population.indicator_code}). Pinned to wdi-2026-10-11-candidate; no live refresh.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1 font-semibold">Hypothetical National Poverty (2030)</div>
              <div className="text-xs text-gray-600 mb-2 italic">Hypothetical - Not a forecast</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-700">{scenario.povertyRange[0].toFixed(1)}-{scenario.povertyRange[1].toFixed(1)}%</span>
                <span className="text-xs font-medium text-gray-500 mb-1">
                  (range)
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1 font-semibold">Hypothetical Youth Unemployment (2030)</div>
              <div className="text-xs text-gray-600 mb-2 italic">Hypothetical - Not a forecast</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-700">{scenario.youthRange[0].toFixed(1)}-{scenario.youthRange[1].toFixed(1)}%</span>
                <span className="text-xs font-medium text-gray-500 mb-1">
                  (range)
                </span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full relative" role="img" aria-label={`Hypothetical ranges for national poverty ${scenario.povertyRange.map(v=>v.toFixed(1)).join(" to ")}% and youth unemployment ${scenario.youthRange.map(v=>v.toFixed(1)).join(" to ")}% in 2030. Baseline ${baseline.year}. No forecast.`}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" aria-hidden="true">
              <div className="text-center opacity-10">
                <div className="text-lg sm:text-3xl font-bold text-gray-400 px-6">Illustrative trajectories — not attributable impacts</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} interval={0} height={50}
                  tick={({ x, y, payload }) => <text x={x} y={y} textAnchor="middle" fill="#6b7280" fontSize={11}>
                    {String(payload.value).split(" ").map((word, index) => <tspan key={word} x={x} dy={index === 0 ? 14 : 14}>{word}</tspan>)}
                  </text>}
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload;
                    return <div className="bg-white p-3 border rounded shadow text-sm">
                      <p className="font-semibold">{row.name}</p>
                      <p>{baseline.year} baseline: {row.baseline.toFixed(1)}%</p>
                      <p>Hypothetical 2030 range: {row.range[0].toFixed(1)}-{row.range[1].toFixed(1)}%</p>
                      <p>Illustrative benchmark: {row.benchmark}% (not a target)</p>
                      <p className="italic">Indicative only; not attributable impacts.</p>
                    </div>;
                  }}
                />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="baseline" name={`${baseline.year} Baseline`} fill="#a1a5aa" radius={[4, 4, 0, 0]} opacity={0.7} />
                <Bar dataKey="range" name="Hypothetical 2030 range" fill="#6b8dd6" radius={[4, 4, 0, 0]} opacity={0.7} />
                <Bar dataKey="benchmark" name="Illustrative benchmark (not a target)" fill="#7fb3a0" radius={[4, 4, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded space-y-2">
            <p>Uncalibrated assumptions: {ASSUMPTIONS.householdSize} people per household; {ASSUMPTIONS.youthCandidatesPerHousehold} initially unemployed youth candidates per household; fixed youth labor force {ASSUMPTIONS.youthLaborForce.toLocaleString()}. Population uses the {baseline.year} snapshot. No causal coefficients are estimated.</p>
            <p>Years = 2030 − {baseline.year} = {scenario.years}. Assumed poverty exits = annual households × years × 5.5 × outcome share. Assumed youth transitions = annual households × years × 0.4 × outcome share. Rate change = assumed transitions ÷ fixed denominator × 100 percentage points. No counterfactual, displacement, repeat reach, re-entry or population change is modelled.</p>
            <p>Assumed reach: {scenario.reachedHouseholds.toLocaleString()} distinct households; {scenario.peopleReached.toLocaleString()} people. Assumed exits: {scenario.assumedPovertyExits.toLocaleString()} people; youth transitions: {scenario.assumedYouthTransitions.toLocaleString()}. These are assumed counts, not observed results.</p>
            <p>Context only: hypothetical GDP index {scenario.gdpIndex.toFixed(1)} (baseline = 100); final annual investment purchasing power ${(scenario.finalRealAnnualInvestment/1000000).toFixed(2)}M in baseline-year USD. These inputs do not alter poverty or unemployment rates. Cumulative assumed nominal direct investment: ${(scenario.cumulativeInvestment/1000000).toFixed(1)}M over {scenario.years} years, excluding administration and other programme costs.</p>
          </div>
          <p className="text-xs text-gray-500">Grey: observed baseline. Blue: illustrative 2030 range. Green: discussion benchmark (not a target). All rates are percentages.</p>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-900">
            <div className="flex items-start gap-2">
              <Target className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold mb-2">Simulation Disclaimer: NOT A COSTED PROGRAMME</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Parameter values are user-defined placeholders and do not represent proposed UNDP programmes</li>
                  <li>The calculation assumes distinct initially poor households each year and persistent exits for all members of successful households. Reach does not establish exits. Youth transitions assume initially unemployed candidates and persistence; they are not net measured jobs.</li>
                  <li>Sensitivity is ±30% of the assumed change from baseline, not of the rate level. It is not a confidence interval. Rates are capped to 0–100%.</li>
                  <li>Illustrative trajectories are not attributable impacts, forecasts, or programme targets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
