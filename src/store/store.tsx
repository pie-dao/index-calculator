import { HeatMapDatum } from '@nivo/heatmap';
import { Datum, Serie } from '@nivo/line';
import sampleData from './sample.json';
import samplePerformance from './samplePerformance.json';
import React, { useState } from 'react';
import { BarDatum } from '@nivo/bar';
import { colorSchemeIndex } from '../../pages/components/dashboard/charts/theme';

export interface KPIs {
  name:                    string;
  coingeckoId:             string;
  MIN_MCAP:                number;
  MAX_MCAP:                number;
  AVG_MCAP:                number;
  originalRATIO?:           number;
  RATIO:                   number | string;
  initialAmounts:          number;
  CAPPED?:                  boolean;
  ADJUSTED?:                boolean;
  relativeToLeftoverRATIO?: string;
  adjustedMarketCAP?:       string;
  addedRatio?:              string;
  adjustedRATIO?:           string;
  VARIANCE?:                number;
  STDEV?:                   number;
  marginalContribution?:    number;
  totalContribution?:       number;
  MCTR?:                    number;
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
  },
  bars: BarsData
}

type BarProps = {
  data: BarDatum[];
  index: string;
  keys: string[];
}

type BarsData = {
  [K in keyof KPIs]?: BarProps;
}

type SerieGetter = (item: IndexCalculatorOutput) => Datum[];

type DailyFigure = [number, number];
type NAV = Array<DailyFigure>;
type Performance = Array<DailyFigure>;

const adjustPrecisionSwitch = (n: number): number | string => {
  switch (true) {
    case n > 10_000:
      return Number(n.toPrecision(4))
    case n > 100:
      return Math.round(n)
    case n > 10:
      return Number(n.toPrecision(1))
    case n > 1:
      return Number(n.toPrecision(2))
    case (n > -1):
      return Number(n.toPrecision(4))
    case (n > -10):
      return Number(n.toPrecision(2))
    case n > -100:
      return Number(n.toPrecision(1))
    case n < -100:
      return Math.round(n)       
    default:
      return n
  }
};

const toSerie = (i: [number, number]): Datum => ({
  x: new Date(Math.floor(i[0])).toISOString().slice(0, 10),
  y: i[1]
})

const performanceGetter: SerieGetter = item => item.performance.map(i => toSerie(i as [number, number]));
const returnGetter: SerieGetter = item => item.backtesting.returns.map((r, index) => ({
  x: index,
  y: r
}));

const priceGetter: SerieGetter = item => item.data.prices.map(p => ({ x: p[0], y: p[1] }));

const handleOverflow = (idx: number, array: unknown[]) => idx < array.length ? array[idx] : array[idx % array.length];

const getLineData = (data: IndexCalculatorOutput[], getter: SerieGetter): Serie[] => {
  return data.map((item, idx) => ({
    id: item.name,
    color: handleOverflow(idx, colorSchemeIndex),
    data: getter(item)
  }))
};

const addPerformanceToLineData = (data: Serie[], performance: Performance): Serie[] => {
  const total: Serie = {
    id: 'OVERALL',
    color: 'green',
    data: performance.map(i => toSerie(i))
  };
  return [...data, total];
}

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
    value: Number(Number(item.RATIO).toPrecision(2))
  })
);

const getKpis = (data: IndexCalculatorOutput[]): KPIs[] => data.map(item => {
  const { backtesting, data, performance, ...kpis } = item;
  return adjustKPIPrecision(kpis)
});

const adjustKPIPrecision = (kpis: KPIs): KPIs => Object
  .entries(kpis)
  .reduce((prev, [key, value]) => {
    let newValue = value;
    if (typeof value === 'number') {
      newValue = adjustPrecisionSwitch(value);
    } else if (Number(value)) {
      newValue = adjustPrecisionSwitch(Number(value))
    }
    return { ...prev, [key]: newValue }
  }, {} as KPIs
);

const getKeys = (data: IndexCalculatorOutput[]): string[] => data.map(item => item.name);

const getBarDatum = (data: IndexCalculatorOutput[], KPI: keyof KPIs): BarDatum => data.reduce((prev, curr) => {
  const record = { [curr.name]: adjustPrecisionSwitch(Number(curr[KPI])) };
  return { ...prev,  ...record };
}, {})

const getBarDataForKPI = (data: IndexCalculatorOutput[], kpi: keyof KPIs): BarProps => {
  const keys = getKeys(data);
  const barDatum = getBarDatum(data, kpi);
  return {
    data: [barDatum],
    index: kpi,
    keys
  }
}

const getBarData = (data: IndexCalculatorOutput[]): BarsData => {
  const kpis = getKpis(data)[0];
  const excluded: Array<keyof KPIs> = [
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
  const barDataArray = Object.keys(kpis)
    .filter(kpi => !excluded.includes(kpi as keyof KPIs))  
    .map((kpi: string) => ({
      [kpi]: getBarDataForKPI(data, kpi as keyof KPIs)
    })
  );
  return Object.assign({}, ...barDataArray);
}

export const convertToStoreData = (data: IndexCalculatorOutput[], performance: Performance): Store => ({
  lines: {
    performance: addPerformanceToLineData(getLineData(data, performanceGetter), performance),
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
  },
  bars: getBarData(data)
})

type StoreType = {
  store: Store;
  setStore?: (store: Store) => void
}

export const StoreContext = React.createContext<StoreType>({
  store: convertToStoreData(sampleData, samplePerformance.performance as Array<[number, number]>),
});

export const StoreContextProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const [store, setStore] = useState(convertToStoreData(sampleData, samplePerformance.performance as Array<[number, number]>))
  return (
    <StoreContext.Provider value={{
        store,
        setStore,
      }}>
      { props.children }
    </StoreContext.Provider>
  )
}

export default StoreContextProvider