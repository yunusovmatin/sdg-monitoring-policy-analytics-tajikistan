import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { useSnapshot } from "@/lib/useSnapshot";
import { observation, latest, rankDescending, COUNTRIES } from "@/lib/data";

export default function PolicyBrief() {
  const [, navigate] = useLocation();
  const {data,error,loading}=useSnapshot();
  if (loading || error) return <div className="container py-12" role="status">{error || "Loading policy snapshot…"}</div>;
  const pov=(year:number)=>observation(data,"SI.POV.LMIC",year)?.value;
  const rem=(year:number,country="TJK")=>observation(data,"BX.TRF.PWKR.DT.GD.ZS",year,country)?.value;
  const fmt=(value:number|undefined|null,digits=1)=>value==null ? "not available" : value.toFixed(digits);
  const endpoint=(start:number,end:number)=>{ const a=pov(start),b=pov(end); return a==null || b==null ? undefined : (a-b)/(end-start); };
  const youth=latest(data,"SL.UEM.1524.ZS");
  const total=youth ? observation(data,"SL.UEM.TOTL.ZS",youth.year) : null;
  const youthPeers=COUNTRIES.flatMap(country=>youth ? [observation(data,"SL.UEM.1524.ZS",youth.year,country)].filter(row=>row!==null) : []);
  const mean=(start:number,end:number)=>{
    const rows=data.filter(d=>d.country_code==="TJK" && d.indicator_code==="BX.TRF.PWKR.DT.GD.ZS" && d.year>=start && d.year<=end);
    return rows.length ? rows.reduce((sum,d)=>sum+d.value,0)/rows.length : undefined;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 ">
        <div className="container py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Policy Brief</h1>
          </div>
          <span>
            <p id="pdf-status" className="text-xs text-gray-600">Original policy sources missing; downloads unavailable.</p>
            <Button variant="default" size="sm" aria-describedby="pdf-status" disabled title="Original Markdown sources are required to revise the PDF">
              <Download className="w-4 h-4 mr-2" />
              PDF revision pending
            </Button>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Tajikistan SDG Snapshot: Key Development Gaps and Programming Implications (2026)
                </h2>
                <p className="text-gray-600">
                  Prepared by Matin Yunusov as an independent analytical snapshot aligned with UNDP-style SDG monitoring. Not commissioned by, endorsed by, or officially reviewed by UNDP.
                </p>
              </div>
            </div>
          </Card>

          {/* Executive Summary */}
          <Card className="p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h3>
            <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
              <p>
                <strong>The bundled WDI snapshot shows declining poverty alongside a high youth unemployment rate.</strong> International-line poverty observations are intermittent: a descriptive endpoint comparison shows a smaller annualised decline after 2015 than over 2003–2015. It does not establish a statistical structural break or its cause. The 2026 title denotes preparation year; observations end in 2023 or earlier, not 2026.
              </p>
              <p>
                The country's high reliance on remittances, while a critical economic stabilizer, also presents a structural vulnerability, as evidenced by recent volatility. This analysis suggests three key areas where programming may benefit from increased focus:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Re-accelerating inclusive poverty reduction:</strong> Development programming may benefit from attention to inclusive livelihoods; numerical benchmarks below are illustrative RBM placeholders</li>
                <li><strong>Examining youth unemployment:</strong> The youth-versus-total unemployment difference motivates investigation of skills, job demand and participation; it does not identify a cause</li>
                <li><strong>Building resilience against remittance shocks:</strong> Economic diversification may help manage vulnerability to remittance shocks; any numerical pathway below is illustrative only</li>
              </ul>
            </div>
          </Card>

          {/* Diagnostic Visualizations */}
          <Card className="p-8 mb-8 border-l-4 border-l-purple-500 bg-purple-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Diagnostic Evidence: Observed Trends</h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-700 mb-4">
                  Both charts are regenerated from the bundled CSV. Lines connect available observations only, without imputation. The scatter pairs remittances and poverty in common observation years; it measures neither poverty-reduction effectiveness nor a causal effect.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <img src="/diagnostic-poverty-trend.png" alt="Eight observed Tajikistan international-line poverty values: 76.2% in 2003, 59.7% in 2004, 48.2% in 2007, 37.1% in 2009, 29.8% in 2015, 22.6% in 2021, 18.9% in 2022 and 18.1% in 2023. Connecting lines do not impute intervening years." className="w-full rounded" />
                  <p className="text-xs text-gray-600 mt-2 italic">Figure: SI.POV.LMIC ($3.65/day, 2017 PPP as labelled in the snapshot). Endpoint annualised changes are descriptive; no 2015 structural break is established.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <img src="/diagnostic-remittances-poverty.png" alt="Same-year observations pair personal remittances as a share of GDP with international-line poverty in 2003, 2004, 2007, 2009, 2015, 2021, 2022 and 2023. No causal relationship is estimated." className="w-full rounded" />
                  <p className="text-xs text-gray-600 mt-2 italic">Figure: Observed remittance shares and poverty levels in common years. This does not establish that remittances cause a dependency dynamic or changes in poverty.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Findings */}
          <Card className="p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Findings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  1. Descriptive Poverty Trends (SDG 1)
                </h4>
                <p className="text-gray-700 mb-3">
                  The snapshot labels SI.POV.LMIC as poverty at $3.65/day (2017 PPP). Tajikistan has eight observations, in 2003, 2004, 2007, 2009, 2015, 2021, 2022 and 2023; no 2000 value is supplied. The ratio declines from {fmt(pov(2003))}% in 2003 to {fmt(pov(2015))}% in 2015 and {fmt(pov(2023))}% in 2023. Endpoint annualised declines are {fmt(endpoint(2003,2015),2)} percentage points per year for 2003–2015 and {fmt(endpoint(2015,2023),2)} for 2015–2023. Sparse observations do not establish an exact inflection year. National-line poverty (SI.POV.NAHC), used in the scenario, is a distinct measure.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 italic">
                    "The data suggest that while macro-level indicators show improvement over the last decade, the pace and distribution of gains appear uneven across outcomes."
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  2. Youth and Total Unemployment (SDG 8)
                </h4>
                <p className="text-gray-700">
                  In {youth?.year}, the bundled youth rate is {fmt(youth?.value,3)}% of the labor force ages 15–24 (SL.UEM.1524.ZS), versus total unemployment of {fmt(total?.value,3)}% of the total labor force (SL.UEM.TOTL.ZS). Their difference is {fmt(youth && total ? youth.value-total.value : null,2)} percentage points, a youth-versus-total difference, not a youth-versus-adult gap. The total rate includes youth. Tajikistan is position {rankDescending(youthPeers,"TJK")} of {youthPeers.length} by descending youth rate in the same year; a higher rate is not better performance. These ILO-modelled WDI measures do not by themselves establish structural skills mismatch or exclude cyclical explanations.
                </p>
                <div className="overflow-x-auto mt-3"><table className="w-full text-sm text-left"><caption className="text-left font-semibold">Youth unemployment, common year {youth?.year}; available observations only</caption><thead><tr><th scope="col">Country</th><th scope="col">Rate (%)</th><th scope="col">Descending position</th></tr></thead><tbody>{[...youthPeers].sort((a,b)=>b.value-a.value).map(row=><tr key={row.country_code}><th scope="row">{row.country_name}</th><td>{row.value.toFixed(3)}</td><td>{rankDescending(youthPeers,row.country_code)}</td></tr>)}</tbody></table></div>
                <p className="text-xs text-gray-500 italic mt-2">Rankings are indicative only and reflect differences in measurement methodologies across countries.</p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  3. Remittance Dependency and Vulnerability
                </h4>
                <p className="text-gray-700 mb-3">
                  Personal remittances received (BX.TRF.PWKR.DT.GD.ZS) are {fmt(rem(2002))}% of GDP in 2002 and {fmt(rem(2023))}% in 2023. Exposure to external transfers motivates resilience analysis; this series does not identify host-country channels or establish fiscal or labour-market effects.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                  <p className="text-sm text-gray-700 font-medium">Tajikistan Remittance Trend:</p>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• 2002–2009 Average: {fmt(mean(2002,2009))}% of GDP (8 annual observations)</li>
                    <li>• 2010–2014 Average: {fmt(mean(2010,2014))}% of GDP (5 annual observations)</li>
                    <li>• 2015–2023 Average: {fmt(mean(2015,2023))}% of GDP (9 annual observations)</li>
                    <li>• 2023: {fmt(rem(2023))}% (highest among the six selected countries that year)</li>
                  </ul>
                </div>
                <p className="text-gray-700">
                  Non-overlapping intervals include both endpoints; means are unweighted arithmetic averages of annual shares, not pooled GDP ratios. The share rises to {fmt(rem(2022))}% in 2022 and falls to {fmt(rem(2023))}% in 2023. In 2023, Kyrgyzstan reports {fmt(rem(2023,"KGZ"))}% and Uzbekistan {fmt(rem(2023,"UZB"))}%. The selected group is Tajikistan, Armenia, Georgia, Kazakhstan, Kyrgyzstan and Uzbekistan; all six have 2023 observations.
                </p>
                <p className="text-gray-700 italic text-sm mt-3 pt-3 border-t border-gray-200">
                  External-transfer exposure is a descriptive finding. Effects on policy autonomy, fiscal incentives and household political influence remain hypotheses requiring additional evidence.
                </p>
              </div>
            </div>
          </Card>

          {/* Analytical Position */}
          <Card className="p-8 mb-8 border-l-4 border-l-amber-500 bg-amber-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytical Position</h3>
            <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
              <p>
                The endpoint comparison is consistent with slower poverty reduction over 2015–2023 than 2003–2015. It does not identify why this occurred. A remittance-related dependency dynamic is one possible hypothesis, alongside changes in domestic job demand, demographics, measurement and external conditions.
              </p>
              <p>
                The youth-versus-total difference motivates investigation of job demand, skills and participation. It does not prove a productivity ceiling, forecast a poverty plateau, or establish that remittances weaken fiscal reform incentives. Those propositions require evidence beyond this descriptive dataset.
              </p>
              <p>
                The programming examples below illustrate results-based management logic. They are not calibrated programmes, evidence-based effect estimates, or verified geographic priorities. Political economy, partner capacity and demand-side constraints would need separate assessment.
              </p>
            </div>
          </Card>

          {/* Programming Implications */}
          <Card className="p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Implications for Programming</h3>
            <div className="bg-red-50 p-4 rounded-lg border border-red-300 mb-6">
              <p className="text-sm text-red-900 font-semibold mb-2">
                MANDATORY DISCLAIMER:
              </p>
              <p className="text-sm text-red-900">
                <strong>All numerical examples below are illustrative placeholders used solely to demonstrate results-based management logic and do not represent proposed UNDP programme targets.</strong> These figures are for analytical demonstration only and should not be interpreted as commitments, forecasts, or impact predictions.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <p className="text-sm text-blue-900">
                <strong>Additional Context:</strong> Programming choices are further shaped by political economy considerations, donor constraints, and implementation capacity.
              </p>
            </div>
            <div className="space-y-6 text-gray-700">
              <div>
                <p className="font-bold text-gray-900 mb-2">1. Poverty Reduction & Livelihoods Program</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                  <li><strong>Illustrative benchmark:</strong> 10,000 assumed eligible households; geographic targeting requires verified subnational evidence</li>
                  <li><strong>Mechanism:</strong> Cash transfers + skills training + microfinance</li>
                  <li><strong>Hypothetical monitoring assumptions:</strong> 30% outcome share; 15% income-change example, with no empirical calibration</li>
                  <li><strong>Indicative Outcome Hypothesis:</strong> National poverty-rate effects cannot be inferred from household reach alone</li>
                </ul>
                <p className="text-xs text-gray-500 italic mt-2">Outcome magnitudes are indicative and intended to demonstrate monitoring logic rather than predict achievable impact.</p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">2. Youth Employment & Entrepreneurship Initiative</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                  <li><strong>Pillar A:</strong> 5,000 youth in skills training (IT, hospitality, construction) with an assumed 60% placement example</li>
                  <li><strong>Pillar B:</strong> 500 youth enterprises with seed funding ($2,000–5,000) with an assumed 70% survival example</li>
                  <li><strong>Pillar C:</strong> 3,000 youth in digital economy skills with an assumed $150/month income example</li>
                  <li><strong>Indicative Outcome Hypothesis:</strong> Placement counts do not establish a net change in national youth unemployment</li>
                </ul>
                <p className="text-xs text-gray-500 italic mt-2">Outcome magnitudes are indicative and intended to demonstrate monitoring logic rather than predict achievable impact.</p>
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-900 font-semibold mb-1">Critical Constraint:</p>
                  <p className="text-sm text-red-800">
                    Demand-side absorption, targeting and displacement need assessment before interpreting training outcomes. The bundled rates cannot distinguish structural mismatch from cyclical conditions or establish remittance effects on participation.
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">3. Private Sector Diversification Program</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                  <li><strong>Sectors:</strong> Light manufacturing, tourism, high-value agriculture</li>
                  <li><strong>Illustrative benchmark:</strong> 50 assumed enterprises; 2,000 hypothetical gross job placements, not verified net job creation</li>
                  <li><strong>Hypothetical monitoring example:</strong> 5% annual sector value-added growth, uncalibrated</li>
                  <li><strong>Indicative Outcome Hypothesis:</strong> Diversification and exposure indicators would be monitored; no remittance-share target is inferred from this dataset</li>
                </ul>
                <p className="text-sm text-gray-500 italic mt-4">
                  * Effect sizes are illustrative and intended to demonstrate monitoring logic rather than predict outcomes.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Illustrative Results Chain (SDG 1 & SDG 8)</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                  <span className="block font-bold text-blue-600 mb-1">Inputs</span>
                  Programme funding, technical assistance, digital tools
                </div>
                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                  <span className="block font-bold text-blue-600 mb-1">Outputs</span>
                  Youth trained, households reached, enterprises supported
                </div>
                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                  <span className="block font-bold text-blue-600 mb-1">Outcomes</span>
                  Increased employability, income diversification, reduced vulnerability
                </div>
                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                  <span className="block font-bold text-blue-600 mb-1">Impact</span>
                  Reduced poverty incidence and youth unemployment
                </div>
              </div>
            </div>
          </Card>

          {/* Data & Methodology */}
          <Card className="p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Data & Methodology</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Data Sources:</strong> World Bank World Development Indicators (WDI) via official API. Data are presented as reported by the source.
              </p>
              <p className="text-sm text-gray-600 italic mt-2">
                Where available, national administrative data (e.g., Agency on Statistics under the President of the Republic of Tajikistan) would complement WDI indicators; however, for cross-country comparability, the bundled international series were selected. This repository does not independently harmonize national definitions.
              </p>
              
              <div className="my-4 overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-500 border border-gray-200">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b">Indicator</th>
                      <th className="px-4 py-2 border-b">WDI Code</th>
                      <th className="px-4 py-2 border-b">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b">
                      <td className="px-4 py-2">Poverty Headcount Ratio</td>
                      <td className="px-4 py-2 font-mono text-xs">SI.POV.LMIC</td>
                      <td className="px-4 py-2">% of population</td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-4 py-2">Unemployment, Youth</td>
                      <td className="px-4 py-2 font-mono text-xs">SL.UEM.1524.ZS</td>
                      <td className="px-4 py-2">% of youth labor force ages 15–24</td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-4 py-2">Personal Remittances</td>
                      <td className="px-4 py-2 font-mono text-xs">BX.TRF.PWKR.DT.GD.ZS</td>
                      <td className="px-4 py-2">% of GDP</td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-4 py-2">GDP per Capita (constant prices)</td>
                      <td className="px-4 py-2 font-mono text-xs">NY.GDP.PCAP.KD</td>
                      <td className="px-4 py-2">Constant 2015 US$</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                <strong>Coverage:</strong> 17 indicators across 6 countries (Tajikistan, Armenia, Georgia, Kazakhstan, Kyrgyzstan, Uzbekistan) for the period 2000-2023.
              </p>
              <p>
                <strong>Limitations:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Data lag for some social indicators</li>
                <li>National definitions may vary slightly</li>
                <li>Hypothetical arithmetic scenarios are not empirical projections</li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="font-bold text-gray-900 mb-2">Technical Implementation</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700">
                  <li>Data ingestion via World Bank WDI API</li>
                  <li>Bundled raw/processed CSV and Parquet files; original extraction/ETL scripts were not supplied</li>
                  <li>Interactive visualizations for policy users</li>
                  <li>Modular architecture for extension to additional SDGs</li>
                </ul>
                
                <p className="font-bold text-gray-900 mt-4 mb-2">References</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                  <li>World Bank WDI: bundled snapshot records retrieval on 25 January 2026. Indicator codes and snapshot-era labels identify the series.</li>
                  <li>UN SDG definitions: conceptual context, not a separate dataset ingested by this application.</li>
                  <li>UNDP results-based management: conceptual alignment only; not a data source or institutional review.</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Download Section */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-transparent border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Full Report</h3>
                <p className="text-gray-600">The supplied PDFs are archived for reference. Revised downloads require the original Markdown sources.</p>
              </div>
              <span>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" disabled title="Original Markdown sources are required to revise the PDF">
                  <Download className="w-5 h-5 mr-2" />
                  PDF revision pending
                </Button>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
