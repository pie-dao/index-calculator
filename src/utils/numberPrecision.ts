import BigNumber from "bignumber.js";

export const formatLargeInteger = (v: number): string => {
  /**
   * @param v is considered too large to be easily readable to we
   * convert it to either B (billions) or M (millions)
   * @returns a string to 2 decimal places
   */
  switch (true) {
      case v >= 1_000_000_000:
          return Math.round((v / 10_000_000)) / 100 + ' B'
      case v >= 1_000_000:
          return Math.round((v / 10_000)) / 100 + ' M'
      default:
      return String(v)
  }
};

export const formatBigNumber = (b: BigNumber): string => {
  /**
   * Overflow safe switches to handle cases when numbers are very large
   * But need to be converted to human readable form
   * @returns a more easily readable string
   */
  switch (true) {
    case b.isGreaterThan(1_000_000_000_000):
      return b.dividedBy(1_000_000_000_000).toString() + ' T'
    case b.isGreaterThan(1_000_000_000):
      return b.dividedBy(1_000_000_000).toString() + ' B'
    case b.isGreaterThan(1_000_000):
      return b.dividedBy(1_000_000).toString() + ' M'
    default:
      return b.toString()
  } 
};


export const largeNumberHandler = (b: BigNumber | number | string): string | number => {
  /**
   * Handles both big number and large integers
   * @returns something humans can read
   */
  if (b instanceof BigNumber) {
    return formatBigNumber(b)
  } else if (typeof b === 'number') {
    return formatLargeInteger(b)
  } else {
    return b
  }
}

export const smallNumberHandler = (n: number): number | string => {
  /**
   * For smaller numbers that still are intended to be fed to charts, round
   * them to a certain precision before returning as a number
   */
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
