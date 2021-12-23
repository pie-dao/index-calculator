import { IndexCalculatorOutput } from "../types/indexCalculator";
import { PieData } from "../types/store";

const toPieValue = (x: string | number): number => Number(Number(x).toPrecision(2)); 

export const getPieData = (data: IndexCalculatorOutput[]): PieData[] => data.map(item => ({
    id: item.name,
    label: item.name,
    // needs to be a number but starts as string, hence double cast
    value: toPieValue(item.RATIO)
  })
);

export const getMctrData = (data: IndexCalculatorOutput[]): PieData[] => data.map(item => ({
  id: item.name,
  label: item.name,
  value: toPieValue(item.MCTR) 
}))
