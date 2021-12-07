import { BarDatum } from "@nivo/bar";
import { smallNumberHandler } from "./numberPrecision";
import { IndexCalculatorOutput, KPIs } from "../types/indexCalculator";
import { BarProps, BarsData } from "../types/store";
import { getKpis } from "./table";

const EXCLUDED: Array<keyof KPIs> = [
  'coingeckoId',
  'name',
  'ADJUSTED',
  'adjustedMarketCAP',
  'addedRatio',
  'CAPPED',
  'initialAmounts',
  'RATIO',
  'MIN_MCAP',
  'MAX_MCAP',
  'AVG_MCAP',
];

// extract the names of the different coins
export const getKeys = (data: IndexCalculatorOutput[]): string[] => data.map(item => item.name);

export const getBarDatum = (data: IndexCalculatorOutput[], KPI: keyof KPIs): BarDatum => data.reduce((prev, curr) => {
  /**
   * For a given KPI, iterate through the data and extract a key pair of coin: value
   * @returns a single object containing the KPI values for each coin
   */
  const record = { [curr.name]: smallNumberHandler(Number(curr[KPI])) };
  return { ...prev,  ...record };
}, {})

export const getBarDataForKPI = (data: IndexCalculatorOutput[], kpi: keyof KPIs): BarProps => {
  /**
   * Combines the above functions to return the data in the correct format for a bar chart
   */
  const keys = getKeys(data);
  const barDatum = getBarDatum(data, kpi);
  return {
    data: [barDatum],
    index: kpi,
    keys
  }
}

export const getBarData = (data: IndexCalculatorOutput[]): BarsData => {
  /**
   * Bars are slightly different than the other charts, because we have lots of them
   * for each KPI, so we need to create an object containing data for all the different bars
   * That we can loop over in the frontend.
   */
  const kpis = getKpis(data)[0];

  const barDataArray = Object.keys(kpis)
    .filter(kpi => !EXCLUDED.includes(kpi as keyof KPIs))  
    .map((kpi: string) => ({
      [kpi]: getBarDataForKPI(data, kpi as keyof KPIs)
    })
  );
  return Object.assign({}, ...barDataArray);
}