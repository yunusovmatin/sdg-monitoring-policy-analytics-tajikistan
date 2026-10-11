import axios from 'axios';

const BASE_URL = 'https://api.worldbank.org/v2';

export interface WBIndicatorData {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit?: string;
  obs_status?: string;
  decimal?: number;
}

export const fetchIndicatorData = async (
  countryCode: string,
  indicatorCode: string,
  startYear: number = 2000,
  endYear: number = new Date().getUTCFullYear()
): Promise<WBIndicatorData[]> => {
  try {
    // Format: /country/{countryCode}/indicator/{indicatorCode}?format=json&date={startYear}:{endYear}&per_page=1000
    const url = `${BASE_URL}/country/${countryCode}/indicator/${indicatorCode}?format=json&date=${startYear}:${endYear}&per_page=1000`;
    
    const response = await axios.get(url, { timeout: 15000 });
    
    // World Bank API returns an array where the first element is metadata and the second is the data array
    if (Array.isArray(response.data) && response.data.length > 1 && Array.isArray(response.data[1])) {
      return response.data[1];
    }
    
    return [];
  } catch (error) {
    throw new Error(`World Bank request failed for ${countryCode} / ${indicatorCode}`, { cause: error });
  }
};

export const fetchMultipleCountriesData = async (
  countryCodes: string[],
  indicatorCode: string,
  startYear: number = 2000,
  endYear: number = new Date().getUTCFullYear()
): Promise<WBIndicatorData[]> => {
  const promises = countryCodes.map(code => 
    fetchIndicatorData(code, indicatorCode, startYear, endYear)
  );
  
  const results = await Promise.allSettled(promises);
  if (results.every(result=>result.status === "rejected")) throw new Error("All World Bank country requests failed");
  return results.flatMap(result=>result.status === "fulfilled" ? result.value : []);
};
