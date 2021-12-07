export const formatBarAxis = (v: number): string => {
  switch (true) {
      case v >= 1_000_000_000:
          return Math.round((v / 10_000_000)) / 100 + ' B'
      case v >= 1_000_000:
          return Math.round((v / 10_000)) / 100 + ' M'
      default:
      return String(v)
  }
}
