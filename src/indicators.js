import { assertNumericArray, assertInteger } from "./utils.js";
import { rollingMean } from "./timeseries.js";

/** Simple moving average. First `window - 1` entries are NaN. */
export function sma(values, window) {
  return rollingMean(values, window);
}

// EMA that tolerates leading NaNs (used internally for MACD's signal line).
function emaCore(values, window) {
  const n = values.length;
  const out = new Array(n).fill(NaN);
  const start = values.findIndex((v) => !Number.isNaN(v));
  if (start === -1 || n - start < window) return out;
  const alpha = 2 / (window + 1);
  let seed = 0;
  for (let i = start; i < start + window; i++) seed += values[i];
  let prev = seed / window;
  out[start + window - 1] = prev;
  for (let i = start + window; i < n; i++) {
    prev = alpha * values[i] + (1 - alpha) * prev;
    out[i] = prev;
  }
  return out;
}

/** Exponential moving average, seeded with the SMA of the first `window` values. */
export function ema(values, window) {
  assertNumericArray(values, "values");
  assertInteger(window, "window", 1);
  return emaCore(values, window);
}

/** Relative Strength Index using Wilder's smoothing. First `period` entries are NaN. */
export function rsi(prices, period = 14) {
  assertNumericArray(prices, "prices");
  assertInteger(period, "period", 1);
  const out = new Array(prices.length).fill(NaN);
  if (prices.length <= period) return out;

  const toRsi = (g, l) => (l === 0 ? (g === 0 ? 50 : 100) : 100 - 100 / (1 + g / l));

  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = prices[i] - prices[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  gain /= period;
  loss /= period;
  out[period] = toRsi(gain, loss);

  for (let i = period + 1; i < prices.length; i++) {
    const d = prices[i] - prices[i - 1];
    gain = (gain * (period - 1) + Math.max(d, 0)) / period;
    loss = (loss * (period - 1) + Math.max(-d, 0)) / period;
    out[i] = toRsi(gain, loss);
  }
  return out;
}

/**
 * MACD (default 12/26/9).
 * @returns {{macd: number[], signal: number[], histogram: number[]}}
 */
export function macd(prices, { fast = 12, slow = 26, signal = 9 } = {}) {
  assertNumericArray(prices, "prices");
  assertInteger(fast, "fast", 1);
  assertInteger(slow, "slow", 1);
  assertInteger(signal, "signal", 1);
  if (fast >= slow) throw new RangeError("fast must be smaller than slow");
  const f = emaCore(prices, fast);
  const s = emaCore(prices, slow);
  const line = prices.map((_, i) => f[i] - s[i]);
  const sig = emaCore(line, signal);
  const histogram = line.map((v, i) => v - sig[i]);
  return { macd: line, signal: sig, histogram };
}
