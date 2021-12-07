import { BarDatum } from "@nivo/bar";
import { HeatMapDatum } from "@nivo/heatmap";
import { Datum, Serie } from "@nivo/line";
import { IndexCalculatorOutput, KPIs } from "./indexCalculator";

export type SerieGetter = (item: IndexCalculatorOutput) => Datum[];
export type DailyFigure = [number, number];
export type NAV = Array<DailyFigure>;
export type Performance = Array<DailyFigure>;

export interface PieData {
  id: string;
  label: string;
  value: number;
}

export type HeatMapData = {
  data: HeatMapDatum[]
  keys: string[]
  index: string
}

export type BarProps = {
  data: BarDatum[];
  index: string;
  keys: string[];
}

export type BarsData = {
  [K in keyof KPIs]?: BarProps;
}

export type Store = {
  lines: {
    performance: Serie[]
    returns: Serie[]
    price: Serie[]
  };
  heatmaps: {
    covariance: HeatMapData,
    correlation: HeatMapData,
  };
  pies: {
    ratio: PieData[]
  };
  tables: {
    kpi: KPIs[]
  },
  bars: BarsData
}
