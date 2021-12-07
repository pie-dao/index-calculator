import { HeatMapDatum } from "@nivo/heatmap";
import { Backtesting, CorrCov, IndexCalculatorOutput } from "../types/indexCalculator";

export const getHeatMapData = (
  data: IndexCalculatorOutput[],
  index: string,
  variant: keyof Omit<Backtesting, "returns">
): HeatMapDatum[] => data.map(item => ({
  /**
   * Formats the values to a readable precision
   * @returns an object that can be loaded to a heatmap
   */
    [index]: item.name,
    ...dynamicDataToDecimalPlaces(item.backtesting[variant], 2)
  })
);

export const dynamicDataToDecimalPlaces = (item: CorrCov, decimals: number): HeatMapDatum => {
  /**
   * Heatmaps are unique keypairs, so the data is dynamic, this function
   * iterates through and...
   * @returns a copy of the data fed in, but to a readable precision
   */
  const entries = Object.entries(item)
  const entriesDecimalAdjusted = entries.map(([key, value]: [string, number]) => ({
      [key]: value.toPrecision(decimals)
    })
  )
  return Object.assign({}, ...entriesDecimalAdjusted )
}

export const getHeatmapKeys = (data: IndexCalculatorOutput[]): string[] => {
  return Object.keys(data[0].backtesting.covariance)
};