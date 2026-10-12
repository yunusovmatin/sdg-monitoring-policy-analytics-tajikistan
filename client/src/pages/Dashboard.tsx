import DeferredSection from "@/components/DeferredSection";
import IndicatorContext from "@/components/IndicatorContext";
import { analyticalIndicators } from "@/lib/governance";
const CountryComparisonTool=lazy(()=>import("@/components/CountryComparisonTool"));
const DashboardCharts=lazy(()=>import("@/components/DashboardCharts"));
const ScenarioPlanner=lazy(()=>import("@/components/ScenarioPlanner"));

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Download } from "lucide-react";
import { useEffect, useState, lazy, Suspense } from "react";

import { useLocation } from "wouter";


import { toast } from "sonner";

import { type DataPoint, latest, displayUnit, dashboardCsv, COUNTRIES } from "@/lib/data";
import { useSnapshot } from "@/lib/useSnapshot";

import { downloadCsv } from "@/lib/download";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [data, setData] = useState<DataPoint[]>([]);
  const snapshot=useSnapshot();
  const loading=snapshot.loading;
  const [selectedIndicator, setSelectedIndicator] = useState("NY.GDP.PCAP.KD");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["TJK", "KGZ", "UZB", "KAZ"]);
  const [indicators, setIndicators] = useState<{ code: string; name: string; unit?: string }[]>([]);


  useEffect(()=>{
    if (!snapshot.data.length) return;
    setData(snapshot.data);
    setIndicators(analyticalIndicators(snapshot.data,true));
  },[snapshot.data]);

  const filteredData = data.filter(
    (d) => d.indicator_code === selectedIndicator && selectedCountries.includes(d.country_code)
  );

  const latestData=selectedCountries.flatMap(country=>{const item=latest(filteredData,selectedIndicator,country);return item ? [item] : [];});
  const unit=displayUnit(selectedIndicator,indicators.find(i=>i.code===selectedIndicator)?.unit ?? "");
  const liveCount=COUNTRIES.filter(country=>data.some(d=>d.indicator_code===selectedIndicator && d.country_code===country && d.source_kind==="live")).length;
  if (snapshot.error) return <div className="container py-12"><p role="alert">{snapshot.error}</p><Button onClick={snapshot.retry}>Retry dataset</Button></div>;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 ">
        <div className="container py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mr-2">
              <span className={`flex h-2 w-2 rounded-full ${liveCount ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs text-gray-600">
                {liveCount ? `Selected indicator: ${liveCount}/6 live country series` : "Selected indicator: captured review candidate"}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                downloadCsv(dashboardCsv(filteredData),`sdg-selected-${selectedIndicator}.csv`);
                toast.success('Data exported successfully');
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Selected Data
            </Button>
          </div>
        </div>
      </div>

      <p className="container pt-4 text-sm text-gray-600" role="status">{"Review dataset: wdi-2026-10-11-candidate, retrieved 11 October 2026. All charts, scenarios, reports and exports use this captured release; observation years vary. International poverty uses current 2021 PPP definitions. This candidate has not been promoted to production. The unresolved v1.0.0 archive remains separate."}</p>
      {/* Controls */}
      <div className="container py-8">
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Indicator
              </label>
              <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                <SelectTrigger className="indicator-select" aria-label="Select Indicator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="indicator-options">
                  {indicators.map((ind) => (
                    <SelectItem className="indicator-option" key={ind.code} value={ind.code}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Countries (Multi-select)
              </label>
              <div className="flex flex-wrap gap-2">
                {["TJK", "KGZ", "UZB", "KAZ", "GEO", "ARM"].map((country) => (
                  <button
                    key={country}
                    aria-pressed={selectedCountries.includes(country)}
                    aria-label={`Include ${country} in dashboard`}
                    onClick={() => {
                      setSelectedCountries((prev) =>
                        prev.includes(country)
                          ? prev.filter((c) => c !== country)
                          : [...prev, country]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${
                      selectedCountries.includes(country)
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    {country}
                    {selectedCountries.includes(country) && <span className="ml-2">✓</span>}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedCountries(["TJK", "KGZ", "UZB", "KAZ", "GEO", "ARM"])}
                  className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedCountries(["TJK"])}
                  className="px-3 py-1 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Tajikistan Only
                </button>
              </div>
            </div>
          </div>
        </Card>

        <IndicatorContext code={selectedIndicator} />
        <details className="mb-6 text-sm"><summary>Latest observation provenance and caveats</summary>{latestData.map(d=><p key={d.country_code} className="my-3 break-words"><strong>{d.country_name}, {d.year}</strong>: {d.vintage}; retrieved {d.retrieved_at}; source updated {d.source_updated || "not supplied"}. {d.ppp_basis && `PPP basis: ${d.ppp_basis}.`} {d.footnote || "No observation footnote supplied."} Observation status: {d.observation_status || "not supplied; does not establish finality"}.</p>)}<p>Survey welfare concepts, comparability breaks and census/source changes affect trends and comparisons. Values and annual changes are descriptive arithmetic, without independent harmonization.</p></details>
        {/* KPI Cards - Fixed Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {latestData.map((d) => (
            <Card key={d.country_code} className={`p-4 border-t-4 ${d.country_code === 'TJK' ? 'border-t-blue-600 bg-blue-50' : 'border-t-gray-300'}`}>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className={`font-bold text-sm ${d.country_code === 'TJK' ? 'text-blue-900' : 'text-gray-700'} mb-2`}>{d.country_name}</h2>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {d.value.toFixed(1)}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Year: {d.year}<br />{unit}<br />{d.source_kind === "live" ? "Live WDI" : "Review candidate snapshot"}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <details className="mb-8 text-sm"><summary className="cursor-pointer">Selected chart values and observation years (text alternative)</summary><div className="overflow-x-auto table-scroll" tabIndex={0} aria-label="Scrollable observation table"><table className="w-full text-left"><caption>{indicators.find(i=>i.code===selectedIndicator)?.name}; {unit}</caption><thead><tr><th scope="col">Country</th><th scope="col">Year</th><th scope="col">Value</th><th scope="col">Source</th><th scope="col">Observation footnote</th></tr></thead><tbody>{filteredData.map(d=><tr key={`${d.country_code}-${d.year}`}><th scope="row">{d.country_name}</th><td>{d.year}</td><td>{d.value}</td><td>{d.source_kind}</td><td>{d.footnote || "No observation footnote supplied; this does not establish final status"}</td></tr>)}</tbody></table></div></details>
        {/* Advanced Analysis Tools */}
        <div className="space-y-8 mb-8">
          <DeferredSection title="Comparison Tool"><Suspense fallback={<p role="status">Loading comparison...</p>}><CountryComparisonTool data={data} indicators={indicators} /></Suspense></DeferredSection>
          <Card className="p-6"><h2 className="text-lg font-bold">Regional evidence status</h2><p>Regional demonstration values have been removed from this analytical view. Authentic region-level sources require matching geography, dates and definitions before any values or priorities can be presented. National WDI observations do not validate regional estimates.</p></Card>
          <DeferredSection title="Scenario Explorer"><Suspense fallback={<p role="status">Loading calculator...</p>}><ScenarioPlanner data={snapshot.data} /></Suspense></DeferredSection>
        </div>

        {/* Charts Section */}
        <DeferredSection title="Trend and Peer Charts"><Suspense fallback={<p role="status">Loading charts...</p>}><DashboardCharts data={data} filteredData={filteredData} latestData={latestData} selectedCountries={selectedCountries} selectedIndicator={selectedIndicator} unit={unit} indicators={indicators}/></Suspense></DeferredSection>
      </div>
    </div>
  );
}
