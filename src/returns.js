import { assertNumericArray } from "./utils.js";

/** Simple returns from a price series: p[t] / p[t-1] - 1. */
export function simpleReturns(prices) {
  assertNumericArray(prices, "prices", 2);
  const out = new Array(prices.length - 1);
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] === 0) throw new RangeError("prices must not contain zero");
    out[i - 1] = prices[i] / prices[i - 1] - 1;
  }
  return out;
}

/** Logarithmic returns from a price series: ln(p[t] / p[t-1]). */
export function logReturns(prices) {
  assertNumericArray(prices, "prices", 2);
  const out = new Array(prices.length - 1);
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] <= 0 || prices[i - 1] <= 0) {
      throw new RangeError("prices must be positive for log returns");
    }
    out[i - 1] = Math.log(prices[i] / prices[i - 1]);
  }
  return out;
}

/** Running compounded return of a simple-return series. */
export function cumulativeReturns(returns) {
  assertNumericArray(returns, "returns");
  const out = new Array(returns.length);
  let growth = 1;
  for (let i = 0; i < returns.length; i++) {
    growth *= 1 + returns[i];
    out[i] = growth - 1;
  }
  return out;
}

/** Total compounded return of a simple-return series. */
export function totalReturn(returns) {
  assertNumericArray(returns, "returns");
  let growth = 1;
  for (let i = 0; i < returns.length; i++) growth *= 1 + returns[i];
  return growth - 1;
}
