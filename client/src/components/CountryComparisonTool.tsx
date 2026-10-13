import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Download, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { type DataPoint, latest, comparisonRows, comparisonCsv, displayUnit } from "@/lib/data";
import { calendarSeries } from "@/lib/timeSeries";
import { comparableGap, INCOMPATIBLE_CROSS_COUNTRY } from "@/lib/governance";
import { downloadCsv } from "@/lib/download";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ComparisonToolProps {
  data: DataPoint[];
  indicators: { code: string; name: string; unit?: string }[];
}

export default function CountryComparisonTool({ data, indicators }: ComparisonToolProps) {
  const [countryA, setCountryA] = useState("TJK");
  const [countryB, setCountryB] = useState("KGZ");
  const [selectedIndicator, setSelectedIndicator] = useState("NY.GDP.PCAP.KD");

  const countries = [
    { code: "TJK", name: "Tajikistan" },
    { code: "KGZ", name: "Kyrgyzstan" },
    { code: "UZB", name: "Uzbekistan" },
    { code: "KAZ", name: "Kazakhstan" },
    { code: "GEO", name: "Georgia" },
    { code: "ARM", name: "Armenia" },
  ];

  const chartData=comparisonRows(data,selectedIndicator,countryA,countryB);
  const timeline=calendarSeries(data,selectedIndicator,Array.from(new Set([countryA,countryB])));
  const latestA=latest(data,selectedIndicator,countryA), latestB=latest(data,selectedIndicator,countryB);
  const gap=comparableGap(latestA,latestB);
  const unit=displayUnit(selectedIndicator,indicators.find(i=>i.code===selectedIndicator)?.unit ?? "");
  const gapUnit=unit.startsWith("%") ? "percentage points" : unit;
  const asynchronous=latestA && latestB && latestA.year!==latestB.year;
  const handleExport=()=>downloadCsv(comparisonCsv(data,selectedIndicator,countryA,countryB),`comparison_${countryA}_${countryB}_${selectedIndicator}.csv`);

  return (
    <Card className="p-6" data-testid="comparison-time-series">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Interactive Comparison Tool</h2>
          <p className="text-sm text-gray-500">Side-by-side benchmarking analysis</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center max-w-full">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Select value={countryA} onValueChange={setCountryA}>
            <SelectTrigger className="w-[140px]" aria-label="Comparison Country A">
              <SelectValue placeholder="Country A" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-gray-600 font-medium">vs</span>

          <Select value={countryB} onValueChange={setCountryB}>
            <SelectTrigger className="w-[140px]" aria-label="Comparison Country B">
              <SelectValue placeholder="Country B" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
            <SelectTrigger className="indicator-select w-full sm:w-[280px]" aria-label="Comparison Indicator">
              <SelectValue placeholder="Select Indicator" />
            </SelectTrigger>
            <SelectContent className="indicator-options">
              {indicators.map((i) => (
                <SelectItem className="indicator-option" key={i.code} value={i.code}>
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mb-4 text-sm font-medium">{INCOMPATIBLE_CROSS_COUNTRY.has(selectedIndicator) ? "National poverty lines or income/consumption survey concepts differ by country. No cross-country numeric gap is computed; consult observation footnotes." : "Compare definitions, units and observation years before interpreting differences. This view uses the same captured candidate release."}</p>
      <details className="mb-4 text-sm"><summary>Comparison observation footnotes</summary>{data.filter(d=>d.indicator_code===selectedIndicator && [countryA,countryB].includes(d.country_code)).map(d=><p key={`${d.country_code}-${d.year}`} className="my-2 break-words">{d.country_name}, {d.year}: {d.footnote || "No observation footnote supplied."}</p>)}</details>
      <details className="mb-4 text-sm"><summary className="cursor-pointer">Comparison chart values (text alternative)</summary><div className="overflow-x-auto table-scroll" tabIndex={0} aria-label="Scrollable observation table"><table className="w-full text-left"><caption>{indicators.find(i=>i.code===selectedIndicator)?.name}; {unit}</caption><thead><tr><th scope="col">Year</th><th scope="col">{countryA}</th><th scope="col">{countryB}</th></tr></thead><tbody>{chartData.map(row=><tr key={row.year}><th scope="row">{row.year}</th><td>{row[countryA] ?? "Missing"}</td><td>{row[countryB] ?? "Missing"}</td></tr>)}</tbody></table></div></details>
      <p className="mb-4 text-sm">Years use calendar spacing. Dots are source observations; missing years and documented measurement breaks are not joined.</p>
      {timeline.breaks.length > 0 && <ul className="mb-4 text-sm" aria-label="Comparison time-series discontinuities">{timeline.breaks.map((b,i)=><li key={i}>{b.country}, {b.year}: {b.reason}</li>)}</ul>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Key Metrics Panel */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Latest Gap ({latestA?.year ?? "no data"} / {latestB?.year ?? "no data"})</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{gap === null ? "No data" : Math.abs(gap).toFixed(1)}</span>
              <span className="text-sm font-medium text-gray-600">{gapUnit}</span>
            </div>
            <div className="mt-2 text-sm">
              {gap === null ? <span>No comparable observations</span> : gap===0 ? <span>Equal reported values</span> : gap > 0 ? (
                <span className="text-blue-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> {countries.find(c => c.code === countryA)?.name} is higher
                </span>
              ) : (
                <span className="text-emerald-600 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" /> {countries.find(c => c.code === countryA)?.name} is lower
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/50">
              <div className="text-xs font-bold text-blue-700 mb-1">{countries.find(c => c.code === countryA)?.name}</div>
              <div className="text-2xl font-bold text-gray-900">{latestA ? latestA.value.toFixed(1) : "No data"}</div>
              <div className="text-xs text-gray-500">Year: {latestA?.year ?? "unavailable"}<br />{unit}<br />{latestA?.source_kind}</div>
            </div>
            <div className="p-4 rounded-lg border border-emerald-100 bg-emerald-50/50">
              <div className="text-xs font-bold text-emerald-700 mb-1">{countries.find(c => c.code === countryB)?.name}</div>
              <div className="text-2xl font-bold text-gray-900">{latestB ? latestB.value.toFixed(1) : "No data"}</div>
              <div className="text-xs text-gray-500">Year: {latestB?.year ?? "unavailable"}<br />{unit}<br />{latestB?.source_kind}</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 leading-relaxed">
            <p>
              <strong>Interpretation:</strong> {asynchronous ? "Latest observations refer to different years; no numeric gap is computed." : "Observation years are shown on each card; missing data produce no gap."} Measurement methods and retrieval vintages may differ; differences alone do not establish policy effects. Export contains the chart series, with blanks for missing values and zeros preserved.
            </p>
          </div>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-2 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline.rows} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="year"
                type="number" domain={["dataMin", "dataMax"]} allowDecimals={false}
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} />
              {timeline.segments.map(segment => <Line key={segment.key} type="linear"
                isAnimationActive={false} dataKey={segment.key} name={segment.name}
                legendType={segment.segment === 0 ? "line" : "none"} connectNulls={false}
                stroke={segment.country === countryA ? "#2563eb" : "#10b981"} strokeWidth={3}
                dot={{r:4,strokeWidth:2,stroke:"#fff"}} activeDot={{r:6}} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
