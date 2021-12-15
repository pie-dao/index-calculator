declare module jStat {
  function variance(logs: number[], flag: boolean): number;
  function corrcoeff(a: number, b: number): number;
  function covariance(a: number, b: number): number;
}

export default jStat;