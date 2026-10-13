import {describe,it,expect} from "vitest";
import {analyticalIndicators,comparableGap} from "./governance";
import type {DataPoint} from "./data";
const a:DataPoint={country_code:"TJK",country_name:"Tajikistan",year:2023,indicator_code:"X",indicator_name:"X",unit:"%",value:0,source_kind:"snapshot"};
describe("reviewed analytical boundaries",()=>{
  it("keeps quarantined legacy observations intact while excluding them from selectable comparisons",()=>{
    const rows=[a,{...a,indicator_code:"SI.POV.DDAY"},{...a,indicator_code:"SI.POV.LMIC"}];
    expect(analyticalIndicators(rows).map(d=>d.code)).toEqual(["X"]);expect(rows).toHaveLength(3);
  });
  it("does not compare country-specific national poverty thresholds",()=>{
    for(const code of ["SI.POV.NAHC","SI.POV.GINI","SI.DST.FRST.20"]){const t={...a,indicator_code:code};expect(comparableGap(t,{...t,country_code:"KGZ",value:10})).toBeNull();}
  });
  it("refuses incompatible years, units, definitions and sources without losing valid zero differences",()=>{
    expect(comparableGap(a,{...a,country_code:"KGZ"})).toBe(0);
    for(const b of [{...a,year:2022},{...a,unit:"persons"},{...a,indicator_code:"Y"},{...a,source_kind:"live" as const}]) expect(comparableGap(a,b)).toBeNull();
    expect(comparableGap(null,a)).toBeNull();
  });
});
