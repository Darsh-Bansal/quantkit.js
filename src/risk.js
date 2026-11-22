import { assertNumericArray, assertPositive, assertSameLength, DEFAULT_PERIODS_PER_YEAR } from "./utils.js";
import { mean, variance, covariance, standardDeviation, quantile } from "./stats.js";

/**
 * Annualized volatility (sample standard deviation scaled by sqrt(periodsPerYear)).
 * Pass `periodsPerYear: 1` for un-annualized volatility.
 */
export function volatility(returns, { periodsPerYear = DEFAULT_PERIODS_PER_YEAR } = {}) {
  assertPositive(periodsPerYear, "periodsPerYear");
  return standardDeviation(returns) * Math.sqrt(periodsPerYear);
}

/**
 * Downside deviation: root-mean-square of returns below `mar`
 * (minimum acceptable return, per period).
 */
export function downsideDeviation(returns, { mar = 0, periodsPerYear = 1 } = {}) {
  assertNumericArray(returns, "returns");
  assertPositive(periodsPerYear, "periodsPerYear");
  let s = 0;
  for (let i = 0; i < returns.length; i++) {
    const d = Math.min(returns[i] - mar, 0);
    s += d * d;
  }
  return Math.sqrt(s / returns.length) * Math.sqrt(periodsPerYear);
}

/**
 * Drawdown at each period, as a non-positive fraction of the running peak
 * (e.g. -0.2 means 20% below the prior peak).
 */
export function drawdownSeries(returns) {
  assertNumericArray(returns, "returns");
  const out = new Array(returns.length);
  let wealth = 1;
  let peak = 1;
  for (let i = 0; i < returns.length; i++) {
    wealth *= 1 + returns[i];
    if (wealth > peak) peak = wealth;
    out[i] = wealth / peak - 1;
  }
  return out;
}

/** Maximum drawdown as a non-positive fraction (e.g. -0.35). Returns 0 if never below a peak. */
export function maxDrawdown(returns) {
  const dd = drawdownSeries(returns);
  let min = 0;
  for (let i = 0; i < dd.length; i++) if (dd[i] < min) min = dd[i];
  return min;
}

/** Beta of an asset relative to a benchmark: cov(asset, benchmark) / var(benchmark). */
export function beta(returns, benchmarkReturns) {
  assertNumericArray(returns, "returns", 2);
  assertNumericArray(benchmarkReturns, "benchmarkReturns", 2);
  assertSameLength(returns, benchmarkReturns, "returns", "benchmarkReturns");
  const v = variance(benchmarkReturns);
  if (v === 0) return NaN;
  return covariance(returns, benchmarkReturns) / v;
}

/**
 * Historical Value at Risk, reported as a positive loss fraction.
 * @param {{confidence?: number}} [options] default 0.95
 */
export function valueAtRisk(returns, { confidence = 0.95 } = {}) {
  if (confidence <= 0 || confidence >= 1) {
    throw new RangeError("confidence must be between 0 and 1 (exclusive)");
  }
  return -quantile(returns, 1 - confidence);
}

/** Historical Expected Shortfall (CVaR), reported as a positive loss fraction. */
export function expectedShortfall(returns, { confidence = 0.95 } = {}) {
  if (confidence <= 0 || confidence >= 1) {
    throw new RangeError("confidence must be between 0 and 1 (exclusive)");
  }
  const cutoff = quantile(returns, 1 - confidence);
  const tail = Array.from(returns).filter((r) => r <= cutoff);
  return -mean(tail);
}
