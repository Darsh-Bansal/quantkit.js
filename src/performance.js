import { assertNumericArray, assertPositive, assertSameLength, DEFAULT_PERIODS_PER_YEAR } from "./utils.js";
import { mean, standardDeviation } from "./stats.js";
import { downsideDeviation, maxDrawdown } from "./risk.js";

/**
 * Compound annual growth rate from a simple-return series.
 * @param {number[]} returns
 * @param {{periodsPerYear?: number}} [options]
 */
export function cagr(returns, { periodsPerYear = DEFAULT_PERIODS_PER_YEAR } = {}) {
  assertNumericArray(returns, "returns");
  assertPositive(periodsPerYear, "periodsPerYear");
  let growth = 1;
  for (let i = 0; i < returns.length; i++) growth *= 1 + returns[i];
  if (growth <= 0) return -1;
  const years = returns.length / periodsPerYear;
  return growth ** (1 / years) - 1;
}

/**
 * Annualized Sharpe ratio.
 * `riskFreeRate` is an annual rate; it is converted to a per-period rate as rf / periodsPerYear.
 */
export function sharpeRatio(
  returns,
  { riskFreeRate = 0, periodsPerYear = DEFAULT_PERIODS_PER_YEAR } = {}
) {
  assertNumericArray(returns, "returns", 2);
  assertPositive(periodsPerYear, "periodsPerYear");
  const rf = riskFreeRate / periodsPerYear;
  const excess = Array.from(returns, (r) => r - rf);
  const sd = standardDeviation(excess);
  if (sd === 0) return NaN;
  return (mean(excess) / sd) * Math.sqrt(periodsPerYear);
}

/**
 * Annualized Sortino ratio.
 * `riskFreeRate` and `targetReturn` are annual rates; `targetReturn` defaults to `riskFreeRate`.
 */
export function sortinoRatio(
  returns,
  { riskFreeRate = 0, targetReturn = riskFreeRate, periodsPerYear = DEFAULT_PERIODS_PER_YEAR } = {}
) {
  assertNumericArray(returns, "returns");
  assertPositive(periodsPerYear, "periodsPerYear");
  const rf = riskFreeRate / periodsPerYear;
  const target = targetReturn / periodsPerYear;
  const dd = downsideDeviation(returns, { mar: target });
  if (dd === 0) return NaN;
  return ((mean(returns) - rf) / dd) * Math.sqrt(periodsPerYear);
}

/** Calmar ratio: CAGR divided by the absolute maximum drawdown. */
export function calmarRatio(returns, { periodsPerYear = DEFAULT_PERIODS_PER_YEAR } = {}) {
  const mdd = Math.abs(maxDrawdown(returns));
  if (mdd === 0) return NaN;
  return cagr(returns, { periodsPerYear }) / mdd;
}

/** Annualized information ratio of `returns` versus `benchmarkReturns`. */
export function informationRatio(
  returns,
  benchmarkReturns,
  { periodsPerYear = DEFAULT_PERIODS_PER_YEAR } = {}
) {
  assertNumericArray(returns, "returns", 2);
  assertNumericArray(benchmarkReturns, "benchmarkReturns", 2);
  assertSameLength(returns, benchmarkReturns, "returns", "benchmarkReturns");
  assertPositive(periodsPerYear, "periodsPerYear");
  const active = Array.from(returns, (r, i) => r - benchmarkReturns[i]);
  const te = standardDeviation(active);
  if (te === 0) return NaN;
  return (mean(active) / te) * Math.sqrt(periodsPerYear);
}
