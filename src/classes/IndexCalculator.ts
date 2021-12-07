// @ts-nocheck
import CoinGecko from 'coingecko-api'
import { jStat } from 'jstat'

import * as _ from 'lodash'
import BigNumber from 'bignumber.js'

BigNumber.set({ DECIMAL_PLACES: 10, ROUNDING_MODE: 4 })

// if you need 3 digits, replace 1e2 with 1e3 etc.
// or just copypaste this function to your code:
const round = (num, digits = 4, base = 10) => {
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

const getDot = (arrA, arrB, row, col) => {
  return arrA[row].map((val, i) => val * arrB[i][col]).reduce((valA, valB) => valA + valB)
}

const multiplyMatricies = (a, b) => {
  let matrixShape = new Array(a.length).fill(0).map(() => new Array(b[0].length).fill(0))
  return matrixShape.map((row, i) => row.map((val, j) => getDot(a, b, i, j)))
}

const randomIntFromInterval = (min, max) => {
  return Math.random() * (max - min + 1) + min
}

export class IndexCalculator {
  public dataSet: Array<any>
  public performance: Array<any>
  public name: string
  public SHARPERATIO: number
  public cumulativeUnderlyingMCAP: number
  public VARIANCE: number
  public STDEV: number
  private maxWeight: number
  private indexStartingNAV: number // Calculated in USD
  private sentimentWeightInfluence: number
  private marketWeightInfluence: number
  public nav: Array<any>
  underlyingAmounts: any[]

  constructor(name, maxweight = '1', sentimentWeight = '0.0') {
    this.dataSet = []
    this.maxWeight = parseFloat(maxweight)
    this.name = name
    this.performance = []
    this.indexStartingNAV = 1000
    this.sentimentWeightInfluence = parseFloat(sentimentWeight)
    this.marketWeightInfluence = 1 - this.sentimentWeightInfluence
    console.log('marketWeightInfluence', this.marketWeightInfluence)
  }

  async fetchCoinData(id) {
    let res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?days=30&vs_currency=usd&interval=daily`
    )
    let data = await res.json()
    return data
  }

  async pullData(useSnapshot = false, tokens) {
    for (const token of tokens) {
      let jsonSnapshot
      let hasSnapshot = false

      try {
        if (useSnapshot) {
          //jsonSnapshot = await require(path.resolve(this.path, `coins/${token.coingeckoId}.json`));
          hasSnapshot = true
        }
      } catch (e) {
        console.log('No cached data for: ', token.coingeckoId)
      }

      if (hasSnapshot) {
        this.dataSet.push({ ...jsonSnapshot, ...token })
        continue
      }
      console.log(`Fetchin ${token.coingeckoId} ...`)
      let response: any = await this.fetchCoinData(token.coingeckoId)

      let coin = {
        ...token,
        backtesting: {},
        data: response,
      }
      this.dataSet.push(coin)
    }
  }

  computeMCAP() {
    this.dataSet.forEach((el) => {
      let marketCap = el.data.market_caps.map((o) => {
        // o[0] Timestamp
        // o[1] Value
        return o[1]
      })
      el.MIN_MCAP = Math.min(...marketCap)
      el.MAX_MCAP = Math.max(...marketCap)
      el.AVG_MCAP = marketCap.reduce((a, b) => a + b, 0) / marketCap.length
    })

    this.cumulativeUnderlyingMCAP = this.dataSet.reduce((a, b) => a + b.AVG_MCAP, 0)
  }

  computeWeights() {
    this.dataSet.forEach((el) => {
      if (el.RATIO) throw new Error('Ratio already present')
      //Readeble: el.RATIO = el.AVG_MCAP / this.cumulativeUnderlyingMCAP;
      el.originalRATIO = new BigNumber(el.AVG_MCAP).dividedBy(new BigNumber(this.cumulativeUnderlyingMCAP)).toNumber()
      el.RATIO = el.originalRATIO
    })
  }

  getTotal() {
    let total = this.dataSet.reduce((a, v) => a + v.RATIO, 0)
    console.log(`\nTotal: ${round(total)}\n`)
    return total
  }

  computeAdjustedWeights(counter = 0) {
    let totalLeftover = 0
    let leftoverMCAP = 0

    this.dataSet.forEach((el) => {
      if (el.RATIO > this.maxWeight) {
        el.cappedRATIO = this.maxWeight
        el.leftover = el.RATIO - this.maxWeight
        el.RATIO = this.maxWeight
        el.CAPPED = true
        el.ADJUSTED = false
        totalLeftover += el.leftover
      } else {
        el.CAPPED = false
        el.ADJUSTED = true
        leftoverMCAP += el.AVG_MCAP
      }
    })

    let ratio = false
    this.dataSet.forEach((el) => {
      if (el.ADJUSTED) {
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

        if (counter > 10)
          el.RATIO = el.adjustedRATIO.toNumber() > this.maxWeight ? this.maxWeight : el.adjustedRATIO.toNumber()
        else el.RATIO = el.adjustedRATIO.toNumber()
      }

      if (el.RATIO > this.maxWeight) {
        ratio = true
      }
    })

    // this.dataSet.forEach(el => {
    //     console.log(`${el.name}: ${(el.RATIO*100).toFixed(2)}%`)
    // });

    if (ratio) {
      this.getTotal()
      // console.log('Calling it again')
      // console.log('---------------------')
      // console.log('\n\n')
      this.computeAdjustedWeights(counter + 1)
    }
  }

  getTokenLastPrice(el) {
    return parseFloat(_.last(el.data.prices)[1])
  }

  computeSentimentWeight() {
    let total = 0
    this.dataSet.forEach((el) => {
      total += el.sentimentScore
    })

    // Calculate Sentiment Weight
    this.dataSet.forEach((el) => {
      el.sentimentRATIO = el.sentimentScore / total
    })

    // Calculate OverAllWeight
    this.dataSet.forEach((el) => {
      el.finalWEIGHT = round(
        el.RATIO * this.marketWeightInfluence + el.sentimentRATIO * this.sentimentWeightInfluence,
        4
      )
      el.RATIO = el.finalWEIGHT
    })
  }

  computeTokenNumbers() {
    this.dataSet.forEach((el) => {
      el.tokenBalance = this.indexStartingNAV * el.RATIO * this.getTokenLastPrice(el)
    })
  }

  computeBacktesting() {
    this.dataSet.forEach((el) => {
      // let prices = el.data.prices.map( o => {
      //     // o[0] Timestamp
      //     // o[1] Value
      //     return o[1];
      // });

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

    this.dataSet.forEach((el) => {
      let logs = el.data.prices.map((o) => {
        return o[2]
      })

      //Passing true indicates to compute the sample variance.
      el.VARIANCE = jStat.variance(logs, true) * logs.length
      el.STDEV = Math.sqrt(el.VARIANCE)
      el.backtesting.returns = logs
    })
  }

  computeCorrelation() {
    for (let i = 0; i < this.dataSet.length; i++) {
      const current = this.dataSet[i]
      for (let k = 0; k < this.dataSet.length; k++) {
        const next = this.dataSet[k]
        let correlation = jStat.corrcoeff(current.backtesting.returns, next.backtesting.returns)
        _.set(current.backtesting, `correlation.${next.name}`, correlation)
      }
    }
  }

  computeCovariance() {
    let matrixC = []
    let matrixB = []

    for (let i = 0; i < this.dataSet.length; i++) {
      const current = this.dataSet[i]
      let arr = []
      for (let k = 0; k < this.dataSet.length; k++) {
        const next = this.dataSet[k]
        let covariance =
          jStat.covariance(current.backtesting.returns, next.backtesting.returns) * current.backtesting.returns.length
        _.set(current.backtesting, `covariance.${next.name}`, covariance)
        arr.push(covariance)
      }
      matrixB.push(arr)
    }

    //Needs documentation, ask Gab
    let weightsArray = this.dataSet.map((el) => el.RATIO)
    weightsArray.forEach((el) => matrixC.push([el]))

    let product = multiplyMatricies([weightsArray], matrixB)
    const pieVariance = multiplyMatricies(product, matrixC)[0][0]

    this.VARIANCE = pieVariance
    this.STDEV = Math.sqrt(pieVariance)
  }

  computeMCTR() {
    let totalContributionGlobal = 0

    //Calculate first the single marginalContribution
    for (let i = 0; i < this.dataSet.length; i++) {
      const current = this.dataSet[i]
      let tempCalc = 0

      for (let k = 0; k < this.dataSet.length; k++) {
        const next = this.dataSet[k]

        let x = next.RATIO * current.STDEV * next.STDEV * current.backtesting.correlation[next.name]
        tempCalc += x
      }

      current.marginalContribution = tempCalc * (1 / this.STDEV)
      current.totalContribution = current.marginalContribution * current.RATIO
      totalContributionGlobal += current.totalContribution
    }

    //Then calculate MCTR based on the sum of the total contribution
    for (let i = 0; i < this.dataSet.length; i++) {
      const current = this.dataSet[i]
      current.MCTR = current.totalContribution / totalContributionGlobal
    }
  }

  computePerformance() {
    //Calculate first the performance of the single coin
    for (let i = 0; i < this.dataSet.length; i++) {
      const el = this.dataSet[i]
      el.performance = []

      // o[0] Timestamp
      // o[1] Value
      // o[2] ln(price/prev prive)
      for (let i = 0; i < el.data.prices.length; i++) {
        const timestamp = el.data.prices[i][0]
        const price = el.data.prices[i][1]
        if (i === 0) {
          el.performance.push([timestamp, 0])
          continue
        }

        const priceYesterday = el.data.prices[0][1]
        const performance = (price - priceYesterday) / priceYesterday

        el.performance.push([timestamp, performance])
      }
    }

    this.performance = []
    this.nav = []
    //Calculate the performance of the index
    for (let i = 0; i < this.dataSet[0].data.prices.length; i++) {
      const timestamp = this.dataSet[0].data.prices[i][0]
      let tempCalc = 0
      let tempNav = 0

      for (let k = 0; k < this.dataSet.length; k++) {
        const coin = this.dataSet[k]

        console.log('coin.RATIO', coin.RATIO)
        console.log('coin.initialAmounts * coin.data.prices[i][1];', coin.initialAmounts, coin.data.prices[i][1])
        if (coin.data.prices[i][1]) tempNav += coin.initialAmounts * coin.data.prices[i][1]

        if (coin.performance[i]) tempCalc += coin.RATIO * coin.performance[i][1]
      }

      this.nav.push([timestamp, tempNav])
      this.performance.push([timestamp, tempCalc])
    }
  }

  computeSharpeRatio() {
    this.SHARPERATIO = _.last(this.performance)[1] / this.STDEV
  }

  computeAll({ adjustedWeight, sentimentWeight, computeWeights }) {
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
    }
  }

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
