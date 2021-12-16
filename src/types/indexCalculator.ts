import BigNumber from "bignumber.js";

export interface KPIs {
  name:                     string;
  coingeckoId:              string;
  MIN_MCAP:                 number;
  MAX_MCAP:                 number;
  AVG_MCAP:                 number;
  originalRATIO?:           number;
  RATIO:                    number;
  initialAmounts:           number;
  lastPrice:                number;
  CAPPED?:                  boolean;
  ADJUSTED?:                boolean;
  leftover?:                number;
  relativeToLeftoverRATIO?: BigNumber;
  adjustedMarketCAP?:       BigNumber;
  addedRatio?:              BigNumber;
  adjustedRATIO?:           BigNumber;
  VARIANCE?:                number;
  STDEV?:                   number;
  marginalContribution?:    number;
  totalContribution?:       number;
  MCTR?:                    number;
  tokenBalance:             number;
  sentimentScore?:          number;
  sentimentRATIO?:          number;
  finalWEIGHT?:             number;
}

export interface IndexCalculatorOutput extends KPIs  {
  backtesting:             Backtesting;
  data:                    IndexCalculatorData;
  performance:             Array<number[]>;
}

export interface Backtesting {
  returns:     number[];
  correlation: CorrCov;
  covariance:  CorrCov;
}

export interface CorrCov {
  [ticker: string]: number
}

export interface IndexCalculatorData {
  prices:        Array<number[]>;
  market_caps:   Array<number[]>;
  total_volumes: Array<number[]>;
}
