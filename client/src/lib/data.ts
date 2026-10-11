import { parseCsv, toCsv } from "./csv";
export interface DataPoint {
  country_code: string; country_name: string; year: number;
  indicator_code: string; indicator_name: string; value: number; unit: string;
  source_kind?: "snapshot" | "live"; retrieved_at?: string; source_label?: string; vintage?: string; source_url?: string; footnote?: string; ppp_basis?: string; source_updated?: string; observation_status?: string;
}
export const COUNTRIES = ["TJK", "KGZ", "UZB", "KAZ", "GEO", "ARM"];
export function parseData(text: string): DataPoint[] {
  const [headers, ...rows] = parseCsv(text);
  if (!headers || !["country_code", "year", "indicator_code", "value"].every(h => headers.includes(h))) throw new Error("Invalid dataset headers");
  if (new Set(headers).size !== headers.length) throw new Error("Duplicate dataset headers");
  const keys = new Set<string>();
  return rows.flatMap(values => {
    if (values.length !== headers.length) throw new Error("CSV field count mismatch");
    const row = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    if (row.value.trim() === "") return [];
    const value = Number(row.value), year = Number(row.year);
    if (!Number.isFinite(value) || !Number.isInteger(year) || year < 1900 || year > 2100) throw new Error("Invalid numeric observation");
    if (!/^[A-Z]{3}$/.test(row.country_code) || !/^[A-Z0-9._]+$/.test(row.indicator_code)) throw new Error("Invalid observation identifiers");
    const key = `${row.country_code}/${row.indicator_code}/${year}`;
    if (keys.has(key)) throw new Error("Duplicate observation key");
    keys.add(key);
    return [{ country_code: row.country_code, country_name: row.country_name, year,
      indicator_code: row.indicator_code, indicator_name: row.indicator_name, value,
      unit: row.unit, source_kind: "snapshot" as const, retrieved_at: row.retrieved_at || row.last_updated, source_label: row.indicator_name, vintage: row.vintage || "v1.0.0-unresolved-extraction-vintage", source_url: row.source_url || `https://data.worldbank.org/indicator/${row.indicator_code}`, footnote: row.footnote ?? "", ppp_basis: row.ppp_basis ?? "", source_updated: row.source_updated ?? "", observation_status: row.observation_status ?? "" }];
  });
}
export const latest = (data: DataPoint[], code: string, country = "TJK") =>
  data.filter(d => d.indicator_code === code && d.country_code === country).sort((a,b) => b.year-a.year)[0] ?? null;
export const observation = (data: DataPoint[], code: string, year: number, country = "TJK") =>
  data.find(d => d.indicator_code === code && d.year === year && d.country_code === country) ?? null;
export const displayUnit = (code: string, unit: string) => code === "SL.UEM.1524.ZS" ? "% of youth labor force ages 15-24" : unit;
export function rankDescending(rows: DataPoint[], country: string): number | null {
  const item=rows.find(d => d.country_code === country);
  return item ? 1 + rows.filter(d => d.value > item.value).length : null;
}
export function comparisonRows(data: DataPoint[], code: string, a: string, b: string) {
  const rows=data.filter(d => d.indicator_code===code && (d.country_code===a || d.country_code===b));
  return Array.from(new Set(rows.map(d=>d.year))).sort((x,y)=>x-y).map(year=>({year,
    [a]:rows.find(d=>d.year===year && d.country_code===a)?.value ?? null,
    [b]:rows.find(d=>d.year===year && d.country_code===b)?.value ?? null}));
}
export function comparisonCsv(data: DataPoint[], code: string, a: string, b: string) {
  const rows=comparisonRows(data,code,a,b), indicator=data.find(d=>d.indicator_code===code);
  return toCsv([["Year", "Indicator code", "Indicator", "Unit", a, b, `${a} source`, `${b} source`, `${a} retrieved`, `${b} retrieved`,"Author","Status",`${a} data vintage`,`${b} data vintage`,`${a} source URL`,`${b} source URL`,`${a} footnote`,`${b} footnote`,`${a} PPP basis`,`${b} PPP basis`,`${a} source updated`,`${b} source updated`,`${a} observation status`,`${b} observation status`],
    ...rows.map(row=>[row.year,code,indicator?.indicator_name,displayUnit(code,indicator?.unit ?? ""),row[a],row[b],
      observation(data,code,Number(row.year),a)?.source_kind, observation(data,code,Number(row.year),b)?.source_kind,
      observation(data,code,Number(row.year),a)?.retrieved_at, observation(data,code,Number(row.year),b)?.retrieved_at,"Matin Yunusov","Independent analytical prototype; no UNDP affiliation",observation(data,code,Number(row.year),a)?.vintage,observation(data,code,Number(row.year),b)?.vintage,observation(data,code,Number(row.year),a)?.source_url,observation(data,code,Number(row.year),b)?.source_url,observation(data,code,Number(row.year),a)?.footnote,observation(data,code,Number(row.year),b)?.footnote,observation(data,code,Number(row.year),a)?.ppp_basis,observation(data,code,Number(row.year),b)?.ppp_basis,observation(data,code,Number(row.year),a)?.source_updated,observation(data,code,Number(row.year),b)?.source_updated,observation(data,code,Number(row.year),a)?.observation_status,observation(data,code,Number(row.year),b)?.observation_status])]);
}
export function dashboardCsv(data: DataPoint[]) {
  return toCsv([["Country", "Country code", "Indicator", "Indicator code", "Year", "Value", "Unit", "Source", "Retrieved", "Source indicator label","Author","Status","Data vintage","Source URL","Footnote","PPP basis","Source updated","Observation status"],
    ...data.map(d=>[d.country_name,d.country_code,d.indicator_name,d.indicator_code,d.year,d.value,displayUnit(d.indicator_code,d.unit),d.source_kind,d.retrieved_at,d.source_label,"Matin Yunusov","Independent analytical prototype; no UNDP affiliation",d.vintage,d.source_url,d.footnote,d.ppp_basis,d.source_updated,d.observation_status])]);
}
export function coverage(data: DataPoint[]) {
  const indicators=Array.from(new Map(data.map(d=>[d.indicator_code,d])).values());
  const countries=new Set(data.map(d=>d.country_code));
  const min=Math.min(...data.map(d=>d.year)), max=Math.max(...data.map(d=>d.year));
  const expected=indicators.length*countries.size*(max-min+1);
  return {min,max,expected,count:data.length,percentage:data.length/expected*100,indicators,countries:countries.size};
}
