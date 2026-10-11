import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

interface RegionData {
  id: string;
  name: string;
  type: string;
  poverty_rate: number;
  unemployment_rate: number;
  youth_unemployment_rate: number;
  population: number;
  coordinates: [number, number];
}

interface DistrictData {
  name: string;
  region: string;
  poverty_rate: number;
  risk_level: string;
}

interface SubnationalData {
  metadata: {
    source: string;
    year: number;
    note: string;
  };
  regions: RegionData[];
  districts_sample: DistrictData[];
}

export default function SubnationalMap() {
  const [data, setData] = useState<SubnationalData | null>(null);
  const [error, setError] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<"poverty" | "unemployment">("poverty");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/tajikistan_subnational.json")
      .then((res) => { if(!res.ok) throw new Error("Regional sample unavailable"); return res.json(); })
      .then((data) => setData(data)).catch(e => setError(String(e)));
  }, []);

  if (!data) return <div role="status">{error || "Loading regional sample…"}</div>;

  const getColor = (value: number, metric: "poverty" | "unemployment") => {
    if (metric === "poverty") {
      if (value > 30) return "bg-red-500";
      if (value > 25) return "bg-orange-500";
      if (value > 20) return "bg-yellow-500";
      return "bg-green-500";
    } else {
      if (value > 7) return "bg-red-500";
      if (value > 6) return "bg-orange-500";
      if (value > 5) return "bg-yellow-500";
      return "bg-green-500";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Subnational Demonstration (Unverified)</h3>
          <p className="text-sm text-gray-500">Illustrative sample values; no verified regional statistical provenance</p>
        </div>
        <div className="flex gap-2">
          <button
            aria-pressed={selectedMetric === "poverty"}
            onClick={() => setSelectedMetric("poverty")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedMetric === "poverty"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Poverty Sample
          </button>
          <button
            aria-pressed={selectedMetric === "unemployment"}
            onClick={() => setSelectedMetric("unemployment")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedMetric === "unemployment"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Unemployment Sample
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Map Visualization Placeholder - In a real app, use Leaflet or D3 */}
        <div className="relative bg-gray-50 rounded-lg border border-gray-200 min-h-[400px] flex items-center justify-center">
          <p className="sr-only">Region cards are a schematic selector, not a geographic map. Coordinates are not plotted.</p>
          
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md p-4">
            {data.regions.map((region) => (
              <TooltipProvider key={region.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-pressed={selectedRegion === region.name}
                      aria-label={`Select ${region.name} sample districts`}
                      onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                      className={`p-3 rounded-lg border shadow-sm cursor-pointer transition-all hover:scale-105 ${
                        selectedRegion === region.name ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                      } ${
                        selectedMetric === "poverty"
                          ? getColor(region.poverty_rate, "poverty").replace("bg-", "bg-opacity-20 border-")
                          : getColor(region.unemployment_rate, "unemployment").replace("bg-", "bg-opacity-20 border-")
                      } bg-white text-left focus-visible:outline-2 focus-visible:outline-blue-700`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedMetric === "poverty"
                            ? getColor(region.poverty_rate, "poverty")
                            : getColor(region.unemployment_rate, "unemployment")
                        }`} />
                        <span className="font-bold text-gray-900 break-words min-w-0">{region.name}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedMetric === "poverty"
                          ? `${region.poverty_rate}%`
                          : `${region.unemployment_rate}%`}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {selectedMetric === "poverty" ? "Poverty Rate" : "Unemployment"}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="text-xs mb-1">Unverified sample; claimed 2024</p>
                      <p className="font-bold mb-1">{region.name} ({region.type})</p>
                      <p>Population: {(region.population / 1000000).toFixed(2)}M</p>
                      <p>Poverty Rate: {region.poverty_rate}%</p>
                      <p>Unemployment: {region.unemployment_rate}%</p>
                      <p>Youth Unemployment: {region.youth_unemployment_rate}%</p>
                      <p className="text-xs text-blue-300 mt-1">Click to see districts</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Interpretation Limit</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              These sample numbers are not verified official observations. They do not establish regional disparities, causes, priority locations or comparability with the national WDI series. The source package claims a 2024 reference year but supplies no table, page, URL or record-level provenance. The selector is schematic rather than a geographic map.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-1">Sample Ordering (Unverified Values)</h4>
            <div className="bg-yellow-50 border border-yellow-200 p-2 rounded mb-3 text-xs text-yellow-900">
              <p className="font-medium mb-1">Important:</p>
              <p>No geographic prioritization is established. Verified regional definitions, source records and reference years would be required before comparison or planning.</p>
            </div>
            
            {selectedRegion ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Districts in {selectedRegion}</span>
                  <button onClick={() => setSelectedRegion(null)} className="text-xs text-blue-600 hover:underline">Show All</button>
                </div>
                {data.districts_sample
                  .filter(d => d.region === selectedRegion)
                  .map((district, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex-grow">
                        <div className="font-medium text-gray-900">{district.name}</div>
                        <div className="text-xs text-gray-500">
                          {district.poverty_rate}% Poverty Rate
                        </div>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded ${
                        district.risk_level === 'Very High' ? 'text-red-700 bg-red-100' :
                        district.risk_level === 'High' ? 'text-orange-700 bg-orange-100' :
                        district.risk_level === 'Medium' ? 'text-yellow-700 bg-yellow-100' :
                        'text-green-700 bg-green-100'
                      }`}>
                        {district.risk_level} sample category
                      </div>
                    </div>
                  ))}
                  {data.districts_sample.filter(d => d.region === selectedRegion).length === 0 && (
                    <div className="text-sm text-gray-500 italic p-2">No district data available for this region in sample dataset.</div>
                  )}
              </div>
            ) : (
              <div className="space-y-3">
                {[...data.regions]
                  .sort((a, b) => 
                    selectedMetric === "poverty" 
                      ? b.poverty_rate - a.poverty_rate 
                      : b.unemployment_rate - a.unemployment_rate
                  )
                  .slice(0, 3)
                  .map((region, idx) => (
                    <div key={region.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-700">
                        Sample
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-900">{region.name}</div>
                        <div className="text-xs text-gray-500">
                          {selectedMetric === "poverty" 
                            ? `${region.poverty_rate}% Poverty Rate`
                            : `${region.unemployment_rate}% Unemployment Rate`}
                        </div>
                      </div>

                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Provenance: unverified sample; claimed year {data.metadata.year}. {data.metadata.note} Not comparable to national ILO-modelled unemployment. Population and youth rates are also unverified.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
