import { HeadlineStat, ReducedIndexCalculator } from "@/types/indexCalculator";

export const getHeadlines = (idx: ReducedIndexCalculator): HeadlineStat[] => {
  return [
    {
      title: 'Final NAV',
      value: `$ ${Math.round(idx.nav[idx.nav.length - 1][1])}`,
      text: idx.nav[idx.nav.length - 1][1] >= 1000 ? 'text-success' : 'text-error'
    },
    {
      title: 'Sharpe Ratio',
      value: idx.SHARPERATIO.toPrecision(2),
    },
    {
      title: 'Portfolio Variance',
      value: idx.VARIANCE.toPrecision(2)
    },
  ]
};