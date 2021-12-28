import { Datum, Serie } from "@nivo/line";
import { colorSchemeIndex } from "./theme";
import { Backtesting, IndexCalculatorOutput } from "../types/indexCalculator";
import { Performance, SerieGetter } from "../types/store";

const monthDayTime = (d: Date): string => {
  const [date, time] = d.toISOString().split('T');
  const datePart = date.slice(5, 10);
  const timePart = time.slice(0, 5);
  // return `${datePart} ${timePart}`
  return datePart
}

// Pretty formats the date and maps to x, y coordinates
export const toSerie = (i: [number, number]): Datum => ({
  x: new Date(i[0]),
  y: i[1]
})

const todayStart = new Date();
todayStart.setHours(0);
todayStart.setMinutes(0);
todayStart.setSeconds(0);
todayStart.setMilliseconds(0);

// Get coin performance
export const performanceGetter: SerieGetter = item => item.performance.map(i => toSerie(i as [number, number]));

// Get backtesting returnd
export const returnGetter: SerieGetter = item => item.backtesting.returns.map((r, index) => ({
  x: index,
  y: r
}));

// Get prices
export const priceGetter: SerieGetter = item => item.data.prices.map(p => ({ x: p[0], y: p[1] }));

// Prevent exception for large datasets by wrapping the array index with a modulo
export const handleOverflow = (idx: number, array: unknown[]) => idx < array.length ? array[idx] : array[idx % array.length];

export const getLineData = (data: IndexCalculatorOutput[], getter: SerieGetter): Serie[] => {
  /**
   * @param data is the raw dataset from the index calculator
   * @param getter is a higher order function to convert the relevant dataset to line series
   */
  return data.map((item, idx) => ({
    id: item.name,
    color: handleOverflow(idx, colorSchemeIndex),
    data: getter(item)
  }))
};

export const addBacktestingPerformanceToLineData = (data: Serie[], backtesting: [number, number][]): Serie[] => {
  /**
   * @param data is the existing line data
   * @param performance is the overall portfolio performance
   * Merges into a single object for performance charts
   */
  const total: Serie = {
    id: 'OVERALL',
    color: 'green',
    data: backtesting.map(i => ({ x: i[0], y: i[1] }))
  };
  return [...data, total];
}

export const addPerformanceToLineData = (data: Serie[], performance: Performance): Serie[] => {
  /**
   * @param data is the existing line data
   * @param performance is the overall portfolio performance
   * Merges into a single object for performance charts
   */
  const total: Serie = {
    id: 'OVERALL',
    color: 'green',
    data: performance.map(i => toSerie(i as [number, number]))
  };
  return [...data, total];
}