export interface KPIs {
  name:                     string;
  coingeckoId:              string;
  MIN_MCAP:                 number;
  MAX_MCAP:                 number;
  AVG_MCAP:                 number;
  originalRATIO?:           number;
  RATIO:                    number | string;
  initialAmounts:           number;
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
  tokenBalance:             number;
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