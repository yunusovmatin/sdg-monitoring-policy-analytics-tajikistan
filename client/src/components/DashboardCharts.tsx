import {type DataPoint,rankDescending} from "@/lib/data";
import {calendarSeries} from "@/lib/timeSeries";
import {INCOMPATIBLE_CROSS_COUNTRY} from "@/lib/governance";
import {Card} from "@/components/ui/card";
import {Bar,BarChart,CartesianGrid,Cell,Legend,Line,LineChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
type Props={data:DataPoint[];filteredData:DataPoint[];latestData:DataPoint[];selectedCountries:string[];selectedIndicator:string;unit:string;indicators:{code:string;name:string}[]};
export default function DashboardCharts({data,filteredData,latestData,selectedCountries,selectedIndicator,unit,indicators}:Props){
 const rankedData=INCOMPATIBLE_CROSS_COUNTRY.has(selectedIndicator) ? latestData : [...latestData].sort((a,b)=>b.value-a.value);
  const timeline = calendarSeries(filteredData,selectedIndicator,selectedCountries);
  const chartData = timeline.rows;

return (        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Line Chart */}
          <Card className="p-6" data-testid="dashboard-time-series">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Trend Analysis</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" type="number" domain={["dataMin", "dataMax"]} allowDecimals={false} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {timeline.segments.map(segment => {
                    const idx = selectedCountries.indexOf(segment.country);
                    const colors = ["#1e3a8a", "#3b82f6", "#1e40af", "#1f2937", "#111827", "#64748b"];
                    return <Line key={segment.key} type="linear" dataKey={segment.key} name={segment.name}
                      legendType={segment.segment === 0 ? "line" : "none"} connectNulls={false}
                      stroke={colors[idx % colors.length]} dot={{r:3}} isAnimationActive={false} />;
                  })}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
              <p>Years use calendar spacing. Dots are source observations; missing years and documented measurement breaks are not joined.</p>
              {timeline.breaks.length > 0 && <ul aria-label="Time-series discontinuities">{timeline.breaks.map((b,i)=><li key={i}>{b.country}, {b.year}: {b.reason}</li>)}</ul>}
              <strong>Interpretation:</strong> The chart shows reported trends for {indicators.find(i => i.code === selectedIndicator)?.name}. Differences in coverage and measurement may affect comparisons; the chart does not establish causes or attributable impacts.
            </div>
          </Card>

          {/* Latest Year Comparison */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Latest Available Year Comparison</h2>
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
              <strong>Peer Position (descending reported value, not performance):</strong> {INCOMPATIBLE_CROSS_COUNTRY.has(selectedIndicator) ? "No cross-country rank: national poverty lines or income/consumption survey concepts differ by country." : new Set(latestData.map(d=>d.year)).size>1 ? "No rank: observation years differ." : rankDescending(latestData,"TJK")===null ? "Tajikistan is not included or has no observation." : `Tajikistan is position ${rankDescending(latestData,"TJK")} of ${latestData.length}.`} Equal values share competition ranks. Latest values can be asynchronous; each observation year is listed below.
              <ul>{rankedData.map(d=><li key={d.country_code}>{d.country_name}: {d.value.toFixed(3)} {unit}, {d.year} ({d.source_kind})</li>)}</ul>
              <p className="italic mt-2">Rankings are indicative only and reflect differences in measurement methodologies across countries.</p>
            </div>
          </Card>
        </div>);
}
