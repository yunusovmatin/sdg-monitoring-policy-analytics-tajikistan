import type { DataPoint } from "./data";

const WELFARE = new Set(["SI.POV.NAHC", "SI.POV.DDAY", "SI.POV.LMIC", "SI.POV.GINI", "SI.DST.FRST.20"]);
export type CalendarRow = { year: number; [key: string]: number | null };
export type ChartSegment = { key: string; country: string; name: string; segment: number };
export type SeriesBreak = { country: string; year: number; reason: string };

function welfareConcept(point: DataPoint): string | null {
  return point.footnote?.match(/\b(consumption|income)\b/i)?.[1].toLowerCase() ?? null;
}

export function comparabilityBreak(previous: DataPoint, current: DataPoint): string | null {
  if (current.country_code === "TJK" && WELFARE.has(current.indicator_code) && previous.year < 2021 && current.year >= 2021)
    return "Tajikistan modernized household-budget-survey estimates from 2021 are separated from earlier observations.";
  if (current.country_code === "UZB" && current.indicator_code === "SI.POV.NAHC" && [2010, 2012].some(year => previous.year < year && current.year >= year))
    return "Uzbekistan national-poverty source notes identify separate comparable spells: 2001–2005, 2010–2011 and 2012–2013.";
  const before = welfareConcept(previous), after = welfareConcept(current);
  if (before && after && before !== after) return `Welfare concept changes from ${before} to ${after}.`;
  if (current.footnote && /break in series|series break/i.test(current.footnote) && current.footnote !== previous.footnote)
    return "Source footnote identifies a series break.";
  if (current.country_code === "GEO" && current.indicator_code === "SP.POP.TOTL" && previous.year < 2024 && current.year >= 2024)
    return "Population source changes to the 2024 census basis.";
  return null;
}

/** Presentation only: calendar gaps are null; source observations and exports are untouched. */
export function calendarSeries(data: DataPoint[], code: string, countries: string[]) {
  const observations = data.filter(d => d.indicator_code === code && countries.includes(d.country_code));
  if (!observations.length) return { rows: [] as CalendarRow[], segments: [] as ChartSegment[], breaks: [] as SeriesBreak[] };
  const min = Math.min(...observations.map(d => d.year)), max = Math.max(...observations.map(d => d.year));
  const rows: CalendarRow[] = Array.from({ length: max - min + 1 }, (_, i) => ({ year: min + i }));
  const segments: ChartSegment[] = [], breaks: SeriesBreak[] = [];
  for (const country of countries) {
    const points = observations.filter(d => d.country_code === country).sort((a, b) => a.year - b.year);
    let segment = -1;
    points.forEach((point, i) => {
      const previous = points[i - 1];
      const reason = previous ? comparabilityBreak(previous, point) : null;
      const gap = previous && point.year - previous.year > 1;
      if (!previous || gap || reason) {
        segment++;
        segments.push({ key: `${country}_segment_${segment}`, country, name: point.country_name, segment });
        if (gap) breaks.push({ country, year: point.year, reason: `No observations for ${previous.year + 1}–${point.year - 1}; no interpolation.` });
        if (reason) breaks.push({ country, year: point.year, reason });
      }
      rows[point.year - min][`${country}_segment_${segment}`] = point.value;
    });
  }
  for (const row of rows) for (const segment of segments) row[segment.key] ??= null;
  return { rows, segments, breaks };
}
