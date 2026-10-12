import { describe, expect, it } from "vitest";
import { calendarSeries } from "./timeSeries";
import type { DataPoint } from "./data";
const point = (year: number, value: number, country = "UZB", code = "SI.POV.GINI", footnote = "Welfare: consumption"): DataPoint => ({ year, value, country_code: country, country_name: country, indicator_code: code, indicator_name: code, unit: "index", footnote });
describe("chronological, source-preserving chart presentation", () => {
  it("connects consecutive annual observations and preserves real zero", () => {
    const chart = calendarSeries([point(2021, 0), point(2022, 32)], "SI.POV.GINI", ["UZB"]);
    expect(chart.segments).toHaveLength(1); expect(chart.rows.map(r => r.UZB_segment_0)).toEqual([0, 32]);
  });
  it("retains 18 years of distance and breaks the Uzbekistan welfare change", () => {
    const data = [point(2003, 35), point(2021, 31, "UZB", "SI.POV.GINI", "Welfare: income")];
    const before = JSON.stringify(data), chart = calendarSeries(data, "SI.POV.GINI", ["UZB"]);
    expect(chart.rows).toHaveLength(19); expect(chart.rows[1].year).toBe(2004);
    expect(chart.rows[1].UZB_segment_0).toBeNull(); expect(chart.rows[18].UZB_segment_1).toBe(31);
    expect(chart.segments).toHaveLength(2); expect(chart.breaks.some(b => b.reason.includes("consumption to income"))).toBe(true);
    expect(JSON.stringify(data)).toBe(before);
  });
  it("separates Tajikistan national poverty across the 2021 modernized-survey boundary without dropping either value", () => {
    const chart = calendarSeries([point(2020, 26.3, "TJK", "SI.POV.NAHC"), point(2021, 26.2, "TJK", "SI.POV.NAHC")], "SI.POV.NAHC", ["TJK"]);
    expect(chart.rows[0].TJK_segment_0).toBe(26.3); expect(chart.rows[1].TJK_segment_0).toBeNull();
    expect(chart.rows[1].TJK_segment_1).toBe(26.2); expect(chart.breaks[0].year).toBe(2021);
  });
  it("leaves absent observations null independently for countries with different coverage", () => {
    const chart = calendarSeries([point(2000, 30), point(2002, 32), point(2001, 0, "KGZ")], "SI.POV.GINI", ["UZB", "KGZ"]);
    expect(chart.rows.map(r => r.year)).toEqual([2000, 2001, 2002]);
    expect(chart.rows[1].UZB_segment_0).toBeNull(); expect(chart.rows[1].KGZ_segment_0).toBe(0);
    expect(chart.rows[0].KGZ_segment_0).toBeNull(); expect(chart.segments.filter(s => s.country === "UZB")).toHaveLength(2);
  });
  it("returns no invented timeline for missing selection", () => {
    expect(calendarSeries([point(2003, 35)], "OTHER", ["UZB"]).rows).toEqual([]);
  });
  it("does not join adjacent years across Uzbekistan's documented national-poverty spells", () => {
    const chart = calendarSeries([point(2011, 16, "UZB", "SI.POV.NAHC"), point(2012, 15, "UZB", "SI.POV.NAHC"), point(2013, 14, "UZB", "SI.POV.NAHC")], "SI.POV.NAHC", ["UZB"]);
    expect(chart.segments).toHaveLength(2);
    expect(chart.rows[1].UZB_segment_0).toBeNull(); expect(chart.rows[1].UZB_segment_1).toBe(15);
    expect(chart.rows[2].UZB_segment_1).toBe(14); expect(chart.breaks[0].reason).toContain("comparable spells");
  });
});
