import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseCsv, toCsv } from "./csv";

describe("dashboard CSV data", () => {
  it("preserves quoted fields, escaped quotes, line endings and zero values", () => {
    const rows = [["Indicator", "Value"], ['A, "quoted" indicator\nwith a second line', "0"]];
    expect(parseCsv("\uFEFF" + toCsv(rows) + "\r\n")).toEqual(rows);
    expect(() => parseCsv('name\n"unfinished')).toThrow();
  });

  it("loads all supplied indicators without shifting numerical columns", () => {
    const [headers, ...rows] = parseCsv(readFileSync("client/public/data/processed/sdg_tjk_tidy.csv", "utf8"));
    expect(rows.length).toBeGreaterThan(1000);
    for (const row of rows) {
      expect(row).toHaveLength(headers.length);
      expect(Number.isFinite(Number(row[headers.indexOf("value")]))).toBe(true);
      expect(row[headers.indexOf("indicator_name")]).not.toMatch(/^["']|[\r\n]/);
    }
    const indicators = new Map(rows.map(row => [row[3], row[4]]));
    expect(indicators.size).toBe(17);
    expect(indicators.get("SL.UEM.TOTL.ZS")).toBe("Unemployment, total (% of labor force)");
    expect(indicators.get("SL.UEM.1524.ZS")).toBe("Unemployment, youth (% of labor force ages 15-24)");
    expect(parseCsv(toCsv([headers, ...rows]))).toEqual([headers, ...rows]);
  });
});
