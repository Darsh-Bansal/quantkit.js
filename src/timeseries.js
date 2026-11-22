import { assertNumericArray, assertInteger, assertPositive, DEFAULT_PERIODS_PER_YEAR } from "./utils.js";
import { mean, standardDeviation, sum } from "./stats.js";

/**
 * Applies `fn` to each trailing window. The first `window - 1` entries are NaN.
 * @param {number[]} values
 * @param {number} window
 * @param {(slice: number[]) => number} fn
 */
export function rolling(values, window, fn) {
  assertNumericArray(values, "values");
  assertInteger(window, "window", 1);
  const out = new Array(values.length).fill(NaN);
  for (let i = window - 1; i < values.length; i++) {
    out[i] = fn(Array.prototype.slice.call(values, i - window + 1, i + 1));
  }
  return out;
}

export const rollingSum = (values, window) => rolling(values, window, sum);
export const rollingMean = (values, window) => rolling(values, window, mean);

/** Rolling sample standard deviation (window must be >= 2). */
export function rollingStd(values, window) {
  assertInteger(window, "window", 2);
  return rolling(values, window, (w) => standardDeviation(w));
}

/** Rolling annualized volatility of a return series. */
export function rollingVolatility(
  returns,
  window,
  { periodsPerYear = DEFAULT_PERIODS_PER_YEAR } = {}
) {
  assertPositive(periodsPerYear, "periodsPerYear");
  const scale = Math.sqrt(periodsPerYear);
  return rollingStd(returns, window).map((v) => v * scale);
}
