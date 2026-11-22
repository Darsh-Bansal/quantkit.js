import { assertNumericArray, assertSameLength } from "./utils.js";

/** Sum of values. */
export function sum(values) {
  assertNumericArray(values, "values");
  let s = 0;
  for (let i = 0; i < values.length; i++) s += values[i];
  return s;
}

/** Arithmetic mean. */
export function mean(values) {
  assertNumericArray(values, "values");
  return sum(values) / values.length;
}

/** Median. */
export function median(values) {
  assertNumericArray(values, "values");
  const s = Array.from(values).sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Variance. Sample variance (n - 1) by default.
 * @param {number[]} values
 * @param {{sample?: boolean}} [options]
 */
export function variance(values, { sample = true } = {}) {
  assertNumericArray(values, "values", sample ? 2 : 1);
  const m = mean(values);
  let ss = 0;
  for (let i = 0; i < values.length; i++) ss += (values[i] - m) ** 2;
  return ss / (values.length - (sample ? 1 : 0));
}

/** Standard deviation. Sample (n - 1) by default. */
export function standardDeviation(values, options) {
  return Math.sqrt(variance(values, options));
}

/** Covariance of two series. Sample (n - 1) by default. */
export function covariance(x, y, { sample = true } = {}) {
  assertNumericArray(x, "x", sample ? 2 : 1);
  assertNumericArray(y, "y", sample ? 2 : 1);
  assertSameLength(x, y);
  const mx = mean(x);
  const my = mean(y);
  let s = 0;
  for (let i = 0; i < x.length; i++) s += (x[i] - mx) * (y[i] - my);
  return s / (x.length - (sample ? 1 : 0));
}

/** Pearson correlation coefficient. Returns NaN if either series is constant. */
export function correlation(x, y) {
  const denom = standardDeviation(x) * standardDeviation(y);
  if (denom === 0) return NaN;
  return covariance(x, y) / denom;
}

/**
 * Quantile with linear interpolation (like numpy's default).
 * @param {number[]} values
 * @param {number} q between 0 and 1
 */
export function quantile(values, q) {
  assertNumericArray(values, "values");
  if (typeof q !== "number" || q < 0 || q > 1) {
    throw new RangeError("q must be between 0 and 1");
  }
  const s = Array.from(values).sort((a, b) => a - b);
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
}
