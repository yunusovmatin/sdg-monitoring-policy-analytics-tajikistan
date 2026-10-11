import CountryComparisonTool from "@/components/CountryComparisonTool";
import ScenarioPlanner from "@/components/ScenarioPlanner";
import SubnationalMap from "@/components/SubnationalMap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocation } from "wouter";
import { fetchMultipleCountriesData } from "@/lib/worldBankApi";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { type DataPoint, latest, rankDescending, displayUnit, dashboardCsv, COUNTRIES } from "@/lib/data";
import { useSnapshot } from "@/lib/useSnapshot";
import { mergeLive } from "@/lib/live";
import { downloadCsv } from "@/lib/download";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [data, setData] = useState<DataPoint[]>([]);
  const snapshot=useSnapshot();
  const loading=snapshot.loading;
  const [refreshNote,setRefreshNote]=useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState("NY.GDP.PCAP.KD");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["TJK", "KGZ", "UZB", "KAZ"]);
  const [indicators, setIndicators] = useState<{ code: string; name: string; unit?: string }[]>([]);


  const refreshWithLiveData = async () => {
    setApiLoading(true);
    try {
      toast.info("Fetching live data from World Bank API...");
      const countries = ["TJK", "KGZ", "UZB", "KAZ", "GEO", "ARM"];
      
      // Fetch data for the currently selected indicator first to show immediate results
      const liveData = await fetchMultipleCountriesData(countries, selectedIndicator);
      
      const merged=mergeLive(data,liveData,selectedIndicator,new Date().toISOString());
      if (!merged.updated.length) { toast.warning("No finite live observations; cached data retained"); return; }
      setData(merged.data);
      setRefreshNote(`${selectedIndicator}: refreshed ${merged.updated.join(", ")}; unavailable countries retain cached series. Other indicators, policy brief and scenario remain bundled snapshot data.`);
      toast.success(`Refreshed ${merged.updated.length} of 6 country series for this indicator`);
    } catch (error) {
      setRefreshNote(error instanceof Error ? error.message : "Refresh failed; cached data retained");
      toast.error("Failed to fetch live data");
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(()=>{
    if (!snapshot.data.length) return;
    setData(snapshot.data);
    setIndicators(Array.from(new Map(snapshot.data.map(d=>[d.indicator_code,{code:d.indicator_code,name:d.indicator_name,unit:d.unit}])).values()));
  },[snapshot.data]);

  const filteredData = data.filter(
    (d) => d.indicator_code === selectedIndicator && selectedCountries.includes(d.country_code)
  );

  const chartData = filteredData
    .sort((a, b) => a.year - b.year)
    .reduce((acc: any[], item) => {
      const existing = acc.find((d) => d.year === item.year);
      if (existing) {
        existing[item.country_name] = item.value;
      } else {
        acc.push({
          year: item.year,
          [item.country_name]: item.value,
        });
      }
      return acc;
    }, []);

  const latestData=selectedCountries.flatMap(country=>{const item=latest(filteredData,selectedIndicator,country);return item ? [item] : [];});
  const rankedData=[...latestData].sort((a,b)=>b.value-a.value);
  const unit=displayUnit(selectedIndicator,indicators.find(i=>i.code===selectedIndicator)?.unit ?? "");
  const liveCount=COUNTRIES.filter(country=>data.some(d=>d.indicator_code===selectedIndicator && d.country_code===country && d.source_kind==="live")).length;
  if (snapshot.error) return <div className="container py-12" role="alert">{snapshot.error}</div>;

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
              <span className="text-xs text-gray-500">
                {liveCount ? `Selected indicator: ${liveCount}/6 live country series` : "Selected indicator: bundled snapshot"}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshWithLiveData}
              disabled={apiLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${apiLoading ? 'animate-spin' : ''}`} />
              {apiLoading ? 'Fetching...' : 'Refresh Live'}
            </Button>
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

      <p className="container pt-4 text-sm text-gray-600" role="status">{refreshNote || "Policy brief and scenario use the bundled snapshot; live refresh updates only the selected indicator. Exports preserve row source and retrieval date."}</p>
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
                  className="px-3 py-1 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* KPI Cards - Fixed Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {latestData.map((d) => (
            <Card key={d.country_code} className={`p-4 border-t-4 ${d.country_code === 'TJK' ? 'border-t-blue-600 bg-blue-50' : 'border-t-gray-300'}`}>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className={`font-bold text-sm ${d.country_code === 'TJK' ? 'text-blue-900' : 'text-gray-700'} mb-2`}>{d.country_name}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {d.value.toFixed(1)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Year: {d.year}<br />{unit}<br />{d.source_kind === "live" ? "Live WDI" : "Bundled snapshot"}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <details className="mb-8 text-sm"><summary className="cursor-pointer">Selected chart values and observation years (text alternative)</summary><div className="overflow-x-auto"><table className="w-full text-left"><caption>{indicators.find(i=>i.code===selectedIndicator)?.name}; {unit}</caption><thead><tr><th scope="col">Country</th><th scope="col">Year</th><th scope="col">Value</th><th scope="col">Source</th></tr></thead><tbody>{filteredData.map(d=><tr key={`${d.country_code}-${d.year}`}><th scope="row">{d.country_name}</th><td>{d.year}</td><td>{d.value}</td><td>{d.source_kind}</td></tr>)}</tbody></table></div></details>
        {/* Advanced Analysis Tools */}
        <div className="space-y-8 mb-8">
          <CountryComparisonTool data={data} indicators={indicators} />
          <SubnationalMap />
          <ScenarioPlanner data={snapshot.data} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Line Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Trend Analysis</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedCountries.map((country, idx) => {
                    const countryName = data.find((d) => d.country_code === country)?.country_name;
                    const colors = ["#1e3a8a", "#3b82f6", "#1e40af", "#1f2937", "#111827", "#64748b"];
                    return (
                      <Line
                        key={country}
                        type="monotone"
                        dataKey={countryName}
                        stroke={colors[idx % colors.length]}
                        dot={false}
                        isAnimationActive={false}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
              <strong>Interpretation:</strong> The chart shows reported trends for {indicators.find(i => i.code === selectedIndicator)?.name}. Differences in coverage and measurement may affect comparisons; the chart does not establish causes or attributable impacts.
            </div>
          </Card>

          {/* Latest Year Comparison */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Available Year Comparison</h3>
            {latestData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rankedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country_name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
                            <p className="font-bold">{data.country_name}</p>
                            <p>Value: {data.value.toFixed(2)} {unit}</p>
                            <p className="text-xs text-gray-500">Year: {data.year}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#1e3a8a">
                    {rankedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.country_code === 'TJK' ? '#1e3a8a' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
              <strong>Peer Position (descending reported value, not performance):</strong> {rankDescending(latestData,"TJK")===null ? "Tajikistan is not included or has no observation." : `Tajikistan is position ${rankDescending(latestData,"TJK")} of ${latestData.length}.`} Equal values share competition ranks. Latest values can be asynchronous; each observation year is listed below.
              <ul>{rankedData.map(d=><li key={d.country_code}>{d.country_name}: {d.value.toFixed(3)} {unit}, {d.year} ({d.source_kind})</li>)}</ul>
              <p className="italic mt-2">Rankings are indicative only and reflect differences in measurement methodologies across countries.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
