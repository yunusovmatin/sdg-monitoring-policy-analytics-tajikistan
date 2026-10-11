import { describe,expect,it,vi } from "vitest";
import axios from "axios";
import { fetchIndicatorData,fetchMultipleCountriesData } from "./worldBankApi";
vi.mock("axios",()=>({default:{get:vi.fn()}}));
describe("World Bank request boundaries",()=>{
 it("retains the zero value and ignores a failed country without disguising all failures",async()=>{
  vi.mocked(axios.get).mockReset().mockResolvedValueOnce({data:[{},[{value:0}]]}).mockRejectedValueOnce(new Error("country unavailable"));
  expect(await fetchMultipleCountriesData(["TJK","KGZ"],"X")).toEqual([{value:0}]);
  vi.mocked(axios.get).mockRejectedValue(new Error("offline"));await expect(fetchMultipleCountriesData(["TJK","KGZ"],"X")).rejects.toThrow("All World Bank");
 });
 it("handles no observations and configures bounded request time",async()=>{
  vi.mocked(axios.get).mockReset().mockResolvedValue({data:[{},null]});expect(await fetchIndicatorData("TJK","X",2000,2023)).toEqual([]);expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('date=2000:2023'),{timeout:15000});
 });
});
