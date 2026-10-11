import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useSnapshot } from "@/lib/useSnapshot";
import { coverage } from "@/lib/data";

export default function Methodology() {
  const [, navigate] = useLocation();
  const {data,error,loading}=useSnapshot();
  if(loading || error) return <div className="container py-12" role="status">{error || "Loading methodology snapshot…"}</div>;
  const stats=coverage(data);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 ">
        <div className="container py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Methodology</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Data & Methodology
                </h2>
                <p className="text-gray-600">
                  Comprehensive documentation of sources, definitions, and analytical approach
                </p>
              </div>
            </div>
          </Card>

          {/* Data Sources */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Sources</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                The bundled <strong>World Bank WDI snapshot</strong> records retrieval on 25 January 2026 in sources.csv. The supplied package contains raw and processed CSV/Parquet files, but no original extraction or transformation scripts. Local parsing and analytical checks are reproducible; the historical API extraction is not reproducible from the supplied scripts. Live refresh is separate and affects only requested indicator/country series.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-medium text-gray-900 mb-2">Data Quality Statement:</p>
                <p className="text-sm">
                  "Bundled national-level series are presented as reported in the snapshot, with no independent cross-country harmonization. Missing observations are absent, not zero or imputed. Unemployment codes SL.UEM.TOTL.ZS and SL.UEM.1524.ZS identify ILO-modelled estimates: total and ages 15–24 respectively. Subnational figures have unverified provenance and are illustrative only. Snapshot-era poverty PPP labels are retained; current API definitions can differ."
                </p>
              </div>
            </div>
          </Card>

          {/* Indicators */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Indicators Tracked</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">SDG 1: No Poverty</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                  <li>Poverty headcount ratio at $2.15/day (2017 PPP)</li>
                  <li>Poverty headcount ratio at $3.65/day (2017 PPP)</li>
                  <li>Poverty headcount ratio at national poverty lines</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">SDG 8: Decent Work and Economic Growth</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                  <li>Unemployment, total (% of labor force)</li>
                  <li>Unemployment, youth (% of labor force ages 15-24)</li>
                  <li>Labor force participation rate</li>
                  <li>GDP per capita (constant 2015 US$)</li>
                  <li>GDP growth (annual %)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">SDG 10: Reduced Inequalities</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                  <li>GINI index</li>
                  <li>Income share held by lowest 20%</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">SDG 13: Climate Action</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                  <li>Renewable energy consumption (% of total)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Context Indicators</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                  <li>Population, total</li>
                  <li>Urban population (% of total)</li>
                  <li>Inflation, consumer prices (annual %)</li>
                  <li>Personal remittances, received (% of GDP)</li>
                  <li>Net migration</li>
                  <li>School enrollment, secondary (% gross)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Peer Countries */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Peer Country Selection</h3>
            <p className="text-gray-700 mb-4">
              Peer countries were selected based on regional proximity, similar development challenges, data availability, and comparability of economic structure:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { code: "KGZ", name: "Kyrgyzstan", reason: "Similar size, landlocked, remittance-dependent" },
                { code: "UZB", name: "Uzbekistan", reason: "Regional neighbor, similar development challenges" },
                { code: "KAZ", name: "Kazakhstan", reason: "Regional leader, upper-middle income benchmark" },
                { code: "GEO", name: "Georgia", reason: "Transition economy, reform progress" },
                { code: "ARM", name: "Armenia", reason: "Small landlocked economy, similar constraints" },
              ].map((country) => (
                <div key={country.code} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-bold text-gray-900">{country.name} ({country.code})</p>
                  <p className="text-sm text-gray-600 mt-1">{country.reason}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Data Processing */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Processing Pipeline</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900">Extract</p>
                  <p className="text-gray-700 text-sm">Source manifest reports WDI API extraction via wbgapi; historical extraction scripts are missing.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-900">Transform</p>
                  <p className="text-gray-700 text-sm">Snapshot contains unit labels and derived change columns. No original unit-conversion method was supplied. The app parses finite values, preserves zero, leaves missing observations absent and does not use derived change columns for policy claims. Forty-one supplied change rows span multi-year gaps: the columns named yoy measure change from the previous observed record, not necessarily a single year.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-bold text-gray-900">Load</p>
                  <p className="text-gray-700 text-sm">Storage in tidy format (CSV and Parquet) for analysis and visualization</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Projections */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Illustrative Trajectory Extension (to 2030)</h3>
            <div className="space-y-4 text-gray-700">
              <p className="font-medium text-blue-900 bg-blue-50 p-3 rounded">
                This extension is included solely to support scenario discussion and does not represent a modeled forecast or target pathway.
              </p>
              <p>
                The application does not implement a fitted trend forecast. The Scenario Explorer uses a common-year national-poverty, youth-unemployment and population baseline from the bundled snapshot. Annual distinct-household reach is accumulated over the actual interval to 2030. Assumed exit and youth-transition counts are divided by fixed denominators. Household size (5.5), youth candidates per household (0.4), youth labor force (800,000) and outcome share are uncalibrated hypothetical assumptions. A ±30% sensitivity adjustment applies to the assumed change from baseline, not the baseline rate. Rates are bounded to 0–100%. GDP and inflation inputs provide index and purchasing-power context only, without estimated poverty or employment effects.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Illustrative only</strong> – not forecasts</li>
                <li>Assumes distinct initially poor households, persistent outcomes, fixed denominators and no displacement, re-entry or demographic change</li>
                <li>Provided to facilitate discussion of potential trajectories</li>
                <li>Should not be used for policy decisions without further analysis</li>
              </ul>
            </div>
          </Card>

          {/* Limitations */}
          <Card className="p-8 bg-yellow-50 border-yellow-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Limitations & Caveats</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Data availability varies by indicator and country</li>
              <li>Some indicators have limited time series coverage</li>
              <li>National definitions may differ across countries</li>
              <li>Hypothetical scenarios are not projections or calibrated outcome models</li>
              <li>Reach does not establish poverty exit or net employment; no counterfactual is modelled</li>
              <li>Missing values are not imputed unless explicitly stated</li>
              <li>Data lag for some social indicators</li>
              <li><strong>Institutional data constraints:</strong> Unemployment rates measure unemployment among the specified labor force; they do not measure all youth inactivity, informality or underemployment. Administrative registered unemployment and ILO-modelled unemployment cannot be treated as interchangeable.</li>
              <li><strong>Political economy constraints:</strong> Programming choices are further shaped by political economy considerations, donor earmarking, partner capacity constraints, and government sensitivities, which are not captured in indicator trends alone.</li>
            </ul>
          </Card>

          {/* Time Coverage */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Coverage</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Time Period:</strong> {stats.min}–{stats.max} observation-year envelope ({stats.max-stats.min+1} possible years; not a complete annual panel)
              </p>
              <p>
                <strong>Latest Year:</strong> {stats.max} overall; varies by indicator and country
              </p>
              <p>
                <strong>Coverage Rate:</strong> {stats.percentage.toFixed(1)}% = {stats.count} finite observations / {stats.expected} possible country × indicator × year slots in the {stats.min}–{stats.max} envelope
              </p>
              <p>
                <strong>Countries:</strong> {stats.countries} (Tajikistan plus five peers: Armenia, Georgia, Kazakhstan, Kyrgyzstan, Uzbekistan)
              </p>
              <p><strong>Indicators:</strong> {stats.indicators.length} SDG and context indicators. GDP per capita is NY.GDP.PCAP.KD (constant 2015 US$), not PPP GDP per capita.</p>
              <div className="overflow-x-auto"><table className="w-full text-sm text-left"><caption className="text-left">Coverage from the bundled CSV, without imputation</caption><thead><tr><th scope="col">Code</th><th scope="col">All-country years</th><th scope="col">Observations</th><th scope="col">Tajikistan years / count</th></tr></thead><tbody>{stats.indicators.map(ind=>{
                const rows=data.filter(d=>d.indicator_code===ind.indicator_code), tj=rows.filter(d=>d.country_code==="TJK");
                return <tr key={ind.indicator_code}><th scope="row" className="break-all">{ind.indicator_code}</th><td>{Math.min(...rows.map(d=>d.year))}–{Math.max(...rows.map(d=>d.year))}</td><td>{rows.length}</td><td>{tj.length ? `${Math.min(...tj.map(d=>d.year))}–${Math.max(...tj.map(d=>d.year))} / ${tj.length}` : "No data"}</td></tr>;
              })}</tbody></table></div>
            </div>
          </Card>

          {/* Tools Used */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tools Used</h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Data Processing & Visualization:</strong> Development of data processing and visualization supported by Manus; original ETL scripts were not supplied.
              </p>
              <p>
                <strong>Data Source:</strong> World Bank World Development Indicators (WDI) API.
              </p>
            </div>
          </Card>

          {/* References */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">References</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <a href="https://data.worldbank.org/indicator/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  World Bank – World Development Indicators (WDI): Primary source for SDG indicator time series
                </a>
              </li>
              <li>
                <a href="https://unstats.un.org/sdgs/dataportal" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  United Nations Statistics Division – SDG Indicators Database: Official SDG definitions and metadata
                </a>
              </li>
              <li>
                <a href="https://www.undp.org/strategic-plan" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  UNDP – Results-Based Management (RBM): Conceptual alignment reference for results frameworks and SDG monitoring language (not a data source; no institutional affiliation)
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
