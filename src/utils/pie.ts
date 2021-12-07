import { IndexCalculatorOutput } from "../types/indexCalculator";
import { PieData } from "../types/store";

export const getPieData = (data: IndexCalculatorOutput[]): PieData[] => data.map(item => ({
    id: item.name,
    label: item.name,
    // needs to be a number but starts as string, hence double cast
    value: Number(Number(item.RATIO).toPrecision(2))
  })
);
