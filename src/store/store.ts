
/**
 * Store needs:
 * list of assets (name, coingeckoid)
 * 
 * >> utility, lineData
 * - Backtesting returns: day, returnpercentage
 * - Price chart: day, price
 * - Performance chart: day, performance
 * 
 * 
 * 
 * 
 * 
 * - Summary stats:
 * totals:
 * - Across all selected assets:
 *  - Average weighted performance
 *  - Average weighted returns
 * 
 * - JOIN each asset to the next into covariance table, fmt:
 *  AssetX: TICKET
 *  Asset[Y-N]: number
 * 
 * - for each asset, fetch the summary stats
 * - for each asset, fetch the adjustedratio
 * 
 */

import { HeatMapDatum } from '@nivo/heatmap';
import { Datum, Serie } from '@nivo/line';
import data from './sample.json';

export interface KPIs {
  name:                    string;
  coingeckoId:             string;
  MIN_MCAP:                number;
  MAX_MCAP:                number;
  AVG_MCAP:                number;
  originalRATIO:           number;
  RATIO:                   number;
  initialAmounts:          number;
  CAPPED:                  boolean;
  ADJUSTED:                boolean;
  relativeToLeftoverRATIO: string;
  adjustedMarketCAP:       string;
  addedRatio:              string;
  adjustedRATIO:           string;
  VARIANCE:                number;
  STDEV:                   number;
  marginalContribution:    number;
  totalContribution:       number;
  MCTR:                    number;
  tokenBalance:            number;
}

export interface IndexCalculatorOutput extends KPIs  {
  backtesting:             Backtesting;
  data:                    IndexCalculatorData;
  performance:             Array<number[]>;
}

export interface Backtesting {
  returns:     number[];
  correlation: Correlation;
  covariance:  Correlation;
}

export interface Correlation {
  [ticker: string]: number
}

export interface IndexCalculatorData {
  prices:        Array<number[]>;
  market_caps:   Array<number[]>;
  total_volumes: Array<number[]>;
}

export interface PieData {
  id: string;
  label: string;
  value: number;
}

type HeatMapData = {
  data: HeatMapDatum[]
  keys: string[]
  index: string
}


type Store = {
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
  }
}

type SerieGetter = (item: IndexCalculatorOutput) => Datum[];


const performanceGetter: SerieGetter = item => item.performance.map(i => ({ x: new Date(i[0]).toISOString().slice(0, 10), y: i[1] }));
const returnGetter: SerieGetter = item => item.backtesting.returns.map((r, index) => ({ x: index, y: r }));
const priceGetter: SerieGetter = item => item.data.prices.map(p => ({ x: p[0], y: p[1] }));

const getLineData = (data: IndexCalculatorOutput[], getter: SerieGetter): Serie[] => {
  return data.map(item => ({
    id: item.name,
    data: getter(item)
  }))
};

const getHeatMapData = (
  data: IndexCalculatorOutput[],
  index: string,
  variant: keyof Omit<Backtesting, "returns">
): HeatMapDatum[] => data.map(item => ({
    [index]: item.name,
    ...dynamicDataToDecimalPlaces(item.backtesting[variant], 2)
  })
);

const dynamicDataToDecimalPlaces = (item: Correlation, decimals: number): HeatMapDatum => {
  const entries = Object.entries(item)

  const entriesDecimalAdjusted = entries.map(([key, value]: [string, number]) => ({
      [key]: value.toPrecision(decimals)
    })
  )
  return Object.assign({}, ...entriesDecimalAdjusted )
}

const getHeatmapKeys = (data: IndexCalculatorOutput[]): string[] => {
  return Object.keys(data[0].backtesting.covariance)
};

const getPieData = (data: IndexCalculatorOutput[]): PieData[] => data.map(item => ({
    id: item.name,
    label: item.name,
    value: item.RATIO
  })
);

const getKpis = (data: IndexCalculatorOutput[]): KPIs[] => data.map(item => {
  const { backtesting, data, performance, ...kpis } = item;
  return kpis
})


const store: Store = {
  lines: {
    performance: getLineData(data, performanceGetter),
    returns: getLineData(data, returnGetter),
    price: getLineData(data, priceGetter),
  },
  heatmaps: {
    covariance: {
      data: getHeatMapData(data, "token", "covariance"),
      keys: getHeatmapKeys(data),
      index: "token"
    },
    correlation: {
      data: getHeatMapData(data, "token", "correlation"),
      keys: getHeatmapKeys(data),
      index: "token",
    }
  },
  pies: {
    ratio: getPieData(data)
  },
  tables: {
    kpi: getKpis(data)
  }

}


export default store