import { smallNumberHandler } from "./numberPrecision";
import { IndexCalculatorOutput, KPIs } from "../types/indexCalculator";

export const getKpis = (data: IndexCalculatorOutput[]): KPIs[] => data.map(item => {
  /**
   * Removes the nested objects from the data set and returns only the KPIs
   * after adjusting the precision as needed.
   */
  const { backtesting, data, performance, ...kpis } = item;
  return adjustKPIPrecision(kpis)
});

// Human readable adjustment for large and small numbers
export const adjustKPIPrecision = (kpis: KPIs): KPIs => Object
  .entries(kpis)
  .reduce((prev, [key, value]) => {
    let newValue = value;
    if (typeof value === 'number') {
      newValue = smallNumberHandler(value);
    } else if (Number(value)) {
      newValue = smallNumberHandler(Number(value))
    }
    return { ...prev, [key]: newValue }
  }, {} as KPIs
);