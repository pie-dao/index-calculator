import * as _ from 'lodash'
import jStat from 'jstat';
import BigNumber from 'bignumber.js'
import { Backtesting, IndexCalculatorOutput } from '@/types/indexCalculator'
import { camelCase } from 'lodash';

BigNumber.set({ DECIMAL_PLACES: 10, ROUNDING_MODE: 4 })

// if you need 3 digits, replace 1e2 with 1e3 etc.
// or just copypaste this function to your code:
const round = (num: number, digits = 4, base = 10) => {
  return +(Math.round(+(num + `e+${digits}`)) + `e-${digits}`)

  // Method 1
  // let scaling = 10 ** digits;
  // return Math.round((num + Number.EPSILON) * scaling) / scaling;

  // Method 2
  //return num.toFixed(digits) * 1;
  //return +num.toFixed(digits);

  // Method 3
  // var pow = Math.pow(base, digits);
  // return Math.round(num*pow) / pow;
}

type Matrix = Array<number[]>

const getDot = (arrA: Matrix, arrB: Matrix, row: number, col: number) => {
  return arrA[row].map((val, i) => val * arrB[i][col]).reduce((valA, valB) => valA + valB)
}

const multiplyMatricies = (a: Matrix, b: Matrix) => {
  let matrixShape = new Array(a.length).fill(0).map(() => new Array(b[0].length).fill(0))
  return matrixShape.map((row, i) => row.map((val, j) => getDot(a, b, i, j)))
}

export class IndexCalculator {
  public dataSet: IndexCalculatorOutput[];
  public performance: Array<[number, number]>
  public name: string
  public SHARPERATIO: number
  public cumulativeUnderlyingMCAP: number
  public VARIANCE: number
  public STDEV: number
  private maxWeight: number
  private indexStartingNAV: number // Calculated in USD
  private sentimentWeightInfluence: number
  private marketWeightInfluence: number
  public leftover: number
  public nav: Array<number[]>
  underlyingAmounts: Array<number[]>

  constructor(name: string, maxweight = '1', sentimentWeight = '0.0') {
    this.dataSet = []
    this.maxWeight = parseFloat(maxweight)
    this.name = name
    this.SHARPERATIO = 0
    this.cumulativeUnderlyingMCAP = 0
    this.VARIANCE = 0
    this.STDEV = 0
    this.performance = []
    this.indexStartingNAV = 1000
    this.nav = []
    this.underlyingAmounts = []
    this.leftover = 0
    this.sentimentWeightInfluence = parseFloat(sentimentWeight)
    this.marketWeightInfluence = 1 - this.sentimentWeightInfluence
  }

  async fetchCoinData(id: string): Promise<IndexCalculatorOutput['data']> {
    let res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?days=30&vs_currency=usd&interval=daily`
    );
    return await res.json();
  }

  async pullData(tokens: Array<{ coingeckoId: string }>) {
    for (const token of tokens) {
      console.log(`Fetching ${token.coingeckoId} ...`)
      let response = await this.fetchCoinData(token.coingeckoId)
      // `any` here is used because this part loads part of the dataset, and rest is augmented later
      let coin: any = {
        ...token,
        backtesting: {} as Backtesting,
        data: response,
      }
      this.dataSet.push(coin);
    }
  }

  computeMCAP() {
    /**
     * Extract the market cap data into MIN, MAX and AVG
     * Also sets a cumulative total average market cap, for the period
     */
    this.dataSet.forEach((el) => {
      if (el.data) {
        let marketCap = el.data.market_caps.map(([_, value]) => value);
        el.MIN_MCAP = Math.min(...marketCap)
        el.MAX_MCAP = Math.max(...marketCap)
        el.AVG_MCAP = marketCap.reduce((a: number, b: number) => a + b, 0) / marketCap.length
      }
    });

    this.cumulativeUnderlyingMCAP = this.dataSet.reduce((a, b) => a + b.AVG_MCAP, 0)
  }

  computeWeights() {
    /**
     * Take the average market cap of each coin, over the period
     * and normalise it as a percentage of the total market cap
     * ** Of the portfolio **
     * 
     * @param el.RATIO is set to the % of the portfolio occupied by that coin
     */
    this.dataSet.forEach((el) => {
      if (el.RATIO) throw new Error('Ratio already present')
      const bigAVG_MCAP = new BigNumber(el.AVG_MCAP);
      const bigUnderlyingMCAP = new BigNumber(this.cumulativeUnderlyingMCAP);
      el.originalRATIO = bigAVG_MCAP.dividedBy(bigUnderlyingMCAP).toNumber()
      el.RATIO = el.originalRATIO
    })
  }

  _capRatio(el: IndexCalculatorOutput) {
    /**
     * If ratio > maxWeight, cap the ratio and carry the remainder
     */
    // el.cappedRATIO = this.maxWeight
    el.leftover = el.RATIO - this.maxWeight
    el.RATIO = this.maxWeight
    el.CAPPED = true
    el.ADJUSTED = false
  }


  _adjustMetrics(el: IndexCalculatorOutput, totalLeftover: number, leftoverMCAP: number) {
    // el.relativeToLeftoverRATIO = el.AVG_MCAP / leftoverMCAP;
    el.relativeToLeftoverRATIO = new BigNumber(el.AVG_MCAP).dividedBy(new BigNumber(leftoverMCAP))

    //el.adjustedMarketCAP = el.relativeToLeftoverRATIO * totalLeftover * this.cumulativeUnderlyingMCAP;
    el.adjustedMarketCAP = el.relativeToLeftoverRATIO
      .multipliedBy(new BigNumber(totalLeftover))
      .multipliedBy(new BigNumber(this.cumulativeUnderlyingMCAP))

    //el.addedRatio = el.adjustedMarketCAP / this.cumulativeUnderlyingMCAP;
    el.addedRatio = el.adjustedMarketCAP.dividedBy(new BigNumber(this.cumulativeUnderlyingMCAP))

    //el.adjustedRATIO = el.originalRATIO + el.addedRatio;
    el.adjustedRATIO = new BigNumber(el.RATIO).plus(el.addedRatio)
  }

  _setFallbackRatio (el: IndexCalculatorOutput) {
    /**
     * Set the ratio to the largest of the adjusted ratio or
     * max weight, if the number of iterations gets too large
     */
    el.RATIO = el.adjustedRATIO!.toNumber() > this.maxWeight
      ? this.maxWeight
      : el.adjustedRATIO!.toNumber()
  }

  computeAdjustedWeights(counter = 0) {
    /**
     * If weights provided are above the max, we need to adjust them.
     * Recursively adjusts weights and metrics up to 10 times otherwise use the max weight. 
     */
    let totalLeftover = 0;
    let leftoverMCAP = 0;

    this.dataSet.forEach((el) => {
      if (el.RATIO > this.maxWeight) {
        this._capRatio(el);
        totalLeftover += el.leftover ?? 0;
      } else {
        el.CAPPED = false;
        el.ADJUSTED = true;
        leftoverMCAP += el.AVG_MCAP;
      }
    });

    let ratio = false
    this.dataSet.forEach((el) => {
      if (el.ADJUSTED) {
        this._adjustMetrics(el, totalLeftover, leftoverMCAP);
        if (counter > 10) {
          this._setFallbackRatio(el);
        } else {
          if (el.adjustedRATIO) el.RATIO = el.adjustedRATIO.toNumber();
        }
      };

      if (el.RATIO > this.maxWeight) ratio = true;
    });

    if (ratio) {
      this.getTotal()
      this.computeAdjustedWeights(counter + 1)
    };
  }

  getTotal(): number {
    /**
     * Called if Ratio > Max Weight
     * @Dev Not sure if this does anything?
     */
    let total = this.dataSet.reduce((a, v) => a + v.RATIO, 0)
    console.log(`\nTotal: ${round(total)}\n`)
    return total
  }

  getTokenLastPrice(el: IndexCalculatorOutput): number {
    const { prices } = el.data;
    const lastPrice = _.last(prices);
    if (lastPrice && lastPrice.length > 0) {
      const price =  parseFloat(String(lastPrice[1]))
      el.lastPrice = price;
      return price
    };
    return 0
  }

  computeSentimentWeight() {
    /**
     *  https://forum.piedao.org/t/pip-10-piedao-defi-index/148/17
     *  A sentiment score was introduced to assess for all underlying assets of the Pie what’s the community perspective on the 3 following pillars:
     *  Innovation (Solution & Roadmap/Timeline)
     *  Functionality to the DeFi Ecosystem (Uniqueness & Composability)
     *  Growth Potential (P/E Ratio, Volume & Outstanding Supply)
     */

    let total = 0
    this.dataSet.forEach((el) => {
      if (el.sentimentScore) total += el.sentimentScore
    })

    // Calculate Sentiment Weight
    this.dataSet.forEach((el) => {
      if (el.sentimentScore)  el.sentimentRATIO = el.sentimentScore / total
    })

    // Calculate OverAllWeight
    this.dataSet.forEach((el) => {
      if (el.sentimentRATIO) {
        el.finalWEIGHT = round(
          el.RATIO * this.marketWeightInfluence + el.sentimentRATIO * this.sentimentWeightInfluence,
          4
        );
        el.RATIO = el.finalWEIGHT;
      }
    })
  }

  computeTokenNumbers() {
    this.dataSet.forEach((el) => {
      el.tokenBalance = this.indexStartingNAV * el.RATIO * (1 / this.getTokenLastPrice(el));
    })
  }

  computeBacktesting() {
    /**
     * Backtesting is the same as performance but backwards looking
     */
    this.dataSet.forEach((el) => {
      // o[0] Timestamp
      // o[1] Value
      // o[2] ln(price/prev prive)
      for (let i = 0; i < el.data.prices.length; i++) {
        const price = el.data.prices[i][1]

        if (i === 0) {
          el.data.prices[i].push(0)
        } else {
          let prePrice = el.data.prices[i - 1][1]
          let ln = Math.log(price / prePrice)
          el.data.prices[i].push(ln)
        }
      }
    })

    this.dataSet.forEach((el: IndexCalculatorOutput) => {
      let logs = el.data.prices.map(([_, __, logPriceDifference]) =>  logPriceDifference);
      el.VARIANCE = jStat.variance(logs, true) * logs.length;
      el.STDEV = Math.sqrt(el.VARIANCE);
      el.backtesting.returns = logs;
    })
  }

  computeCorrelation() {
    /**
     * Correlation is bounded -1 <= corr <= 1
     * An asset will be corr=1 with itself 
     */
    for (let i = 0; i < this.dataSet.length; i++) {
      const current = this.dataSet[i]
      for (let k = 0; k < this.dataSet.length; k++) {
        const next = this.dataSet[k]
        if ('returns' in current.backtesting && 'returns' in next.backtesting) {
          let correlation = jStat.corrcoeff(current.backtesting.returns, next.backtesting.returns)
          _.set(current.backtesting, `correlation.${next.name}`, correlation)
        }
      }
    }
  }

  computeCovariance() {
    /**
     * Covariance will be === variance if comparing the asset to itself
     */
    let matrixC: Matrix = [];
    let matrixB: Matrix = [];

    for (let i = 0; i < this.dataSet.length; i++) {
      const current = this.dataSet[i]
      let arr = [];
      for (let k = 0; k < this.dataSet.length; k++) {
        const next = this.dataSet[k]

        if ('returns' in current.backtesting && 'returns' in next.backtesting) {
          let covariance = jStat
            .covariance(
              current.backtesting.returns, next.backtesting.returns
            ) 
            * current.backtesting.returns.length;

          _.set(current.backtesting, `covariance.${next.name}`, covariance);
          arr.push(covariance);
        }
      }
      matrixB.push(arr)
    }

    // Needs documentation, ask Gab
    let weightsArray = this.dataSet.map((el) => el.RATIO)
    weightsArray.forEach((el) => matrixC.push([el]))

    let product = multiplyMatricies([weightsArray], matrixB)
    const pieVariance = multiplyMatricies(product, matrixC)[0][0]

    this.VARIANCE = pieVariance
    this.STDEV = Math.sqrt(pieVariance)
  }
  computeMCTR() {
    /**
     * Marginal Contribution to total risk, measure of an asset's volatility
     * relative to the total portfolio.
     */
    // Calculate first the single marginalContribution
    // for (let i = 0; i < this.dataSet.length; i++) {
      //   const current = this.dataSet[i]
      
    let totalContributionGlobal = 0
    this.dataSet.forEach(current => {
      if ('correlation' in current.backtesting) {
        const numerator = this.dataSet.reduce((_, next) => {
          return next.RATIO
            * (current.STDEV ?? 0)
            * (next.STDEV ?? 0)
            * current.backtesting.correlation[next.name];
        }, 0);
        current.marginalContribution = numerator * (1 / this.STDEV)
        current.totalContribution = current.marginalContribution * current.RATIO
        totalContributionGlobal += current.totalContribution
      }
    })

    // Then calculate MCTR based on the sum of the total contribution
    this.dataSet.forEach(el => {
      el.MCTR = (el.totalContribution ?? 0) / totalContributionGlobal
    });
  }

  _calculateCoinPerformance(el: IndexCalculatorOutput) {
    /**
     * Calculate the performance of the individual coin
     */
    el.performance = [];
    for (let i = 0; i < el.data.prices.length; i++) {
      const [timestamp, price] = el.data.prices[i];
      if (i === 0) {
        el.performance.push([timestamp, 0]);
        continue
      };
      const priceYesterday = el.data.prices[0][1];
      const performance = (price - priceYesterday) / priceYesterday;
      el.performance.push([timestamp, performance]);
    };
  }

  _calculateIndexPerformance (i: number) {
    /**
     * Calculate the performance of the whole index
     */
    const timestamp: number = this.dataSet[0].data.prices[i][0]
    let tempCalc = 0;
    let tempNav = 0;
    for (let k = 0; k < this.dataSet.length; k++) {
      const coin = this.dataSet[k]
      // console.log('coin.RATIO', coin.RATIO)
      // console.log('coin.initialAmounts * coin.data.prices[i][1];', coin.initialAmounts, coin.data.prices[i][1])
      if (coin.data.prices[i][1]) tempNav += coin.initialAmounts * coin.data.prices[i][1];
      if (coin.performance[i]) tempCalc += coin.RATIO * coin.performance[i][1];
    };
    this.nav.push([timestamp, tempNav]);
    this.performance.push([timestamp, tempCalc]);
  }

  computePerformance() {
    /**
     * Performance is a rolling score of the price differential of the coin across two
     * time periods.
     */
    this.performance = [];
    this.nav = [];
    this.dataSet.forEach(el => this._calculateCoinPerformance(el));
    this.dataSet[0].data.prices.forEach((_, idx) => this._calculateIndexPerformance(idx))
  };

  computeSharpeRatio() {
    /**
     * Sharpe ratio is a risk adjusted perfomance metric
     * All things being equal, higher is better, although assumes
     * Cetain features of a distribution
     */
    const lastPerformance = _.last(this.performance);
    if (lastPerformance && lastPerformance.length > 0) {
      const [_, performance] = lastPerformance;
      this.SHARPERATIO = performance / this.STDEV
    };
  };

  computeAll({
    adjustedWeight,
    sentimentWeight,
    computeWeights
  }: {
    adjustedWeight: number,
    sentimentWeight: number,
    computeWeights: number
  }) {
    this.computeMCAP()
    if (computeWeights) this.computeWeights()
    this.computeInitialTokenAmounts()
    if (adjustedWeight) this.computeAdjustedWeights()
    if (sentimentWeight) this.computeSentimentWeight()
    this.computeBacktesting()
    this.computeCorrelation()
    this.computeCovariance()
    this.computeMCTR()
    this.computePerformance()
    this.computeTokenNumbers()
    this.computeSharpeRatio()
  }

  computeInitialTokenAmounts() {
    this.underlyingAmounts = []
    for (let i = 0; i < this.dataSet.length; i++) {
      const el = this.dataSet[i]
      const timestamp = el.data.prices[0][0]
      const price = el.data.prices[0][1]
      el.initialAmounts = (el.RATIO * this.indexStartingNAV) / price
      this.underlyingAmounts.push([timestamp, el.initialAmounts])
    };
  };

  compute() {
    this.computeMCAP()
    this.computeInitialTokenAmounts()
    this.computeBacktesting()
    this.computeCorrelation()
    this.computeCovariance()
    this.computeMCTR()
    this.computePerformance()
    this.computeTokenNumbers()
    this.computeSharpeRatio()
  }
}
