export const TOOLTIPS = {
  COMPUTE_WEIGHTS: 'If selected, will automatically compute the weighting of the coin in the portfolio, based on its relative value',
  SENTIMENT_SCORE: 'Select to add a PieDAO Sentiment Score to the Index',
  MAX_WEIGHTS: 'Computed weights are selected based on market caps, if you want to limit the maximum percentage of the coin in the portfolio, set this value to a percentage',
  DAYS: 'Number of days of data to fetch from the API'
}

export const ERROR_MESSAGES = {
  INVALIDJSON: 'Json is not valid, use a validator',
  INCORRECTCOINID: 'One or more of the Coingecko IDs was not recognised, try again. The [Coin ID] can be found in the coingecko url: https://www.coingecko.com/en/coins/[Coin ID], or by using the search bar',
  NOTENOUGHDATA: 'Some of the Coins listed do not have enough data to compute performance metrics, please try another coin.',
  CALCULATIONISSUE: 'There was a problem calculating the perfomance metrics of one or more of the coins, please try another coin',
}