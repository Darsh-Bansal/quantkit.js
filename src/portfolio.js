import { assertNumericArray, assertSameLength, assertPositive, DEFAULT_PERIODS_PER_YEAR } from "./utils.js";
import { covariance, correlation } from "./stats.js";

function assertAssetMatrix(assetReturns) {
  if (!Array.isArray(assetReturns) || assetReturns.length === 0) {
    throw new TypeError("assetReturns must be a non-empty array of return series (one per asset)");
  }
  assetReturns.forEach((series, i) => {
    assertNumericArray(series, `assetReturns[${i}]`);
    assertSameLength(series, assetReturns[0], `assetReturns[${i}]`, "assetReturns[0]");
  });
}

function assertWeights(weights, n) {
  assertNumericArray(weights, "weights");
  if (weights.length !== n) throw new RangeError(`weights must have length ${n}`);
}

/** Equal weights for `n` assets. */
export function equalWeights(n) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError("n must be a positive integer");
  return new Array(n).fill(1 / n);
}

/** Scales weights so they sum to 1. */
export function normalizeWeights(weights) {
  assertNumericArray(weights, "weights");
  const total = weights.reduce((a, b) => a + b, 0);
  if (total === 0) throw new RangeError("weights must not sum to zero");
  return weights.map((w) => w / total);
}

/**
 * Per-period portfolio returns for constant weights (rebalanced every period).
 * @param {number[][]} assetReturns one return series per asset: assetReturns[asset][t]
 * @param {number[]} weights one weight per asset
 */
export function portfolioReturns(assetReturns, weights) {
  assertAssetMatrix(assetReturns);
  assertWeights(weights, assetReturns.length);
  const n = assetReturns[0].length;
  const out = new Array(n).fill(0);
  for (let a = 0; a < assetReturns.length; a++) {
    for (let t = 0; t < n; t++) out[t] += weights[a] * assetReturns[a][t];
  }
  return out;
}

/** Sample covariance matrix of asset return series. */
export function covarianceMatrix(assetReturns) {
  assertAssetMatrix(assetReturns);
  return assetReturns.map((a) => assetReturns.map((b) => covariance(a, b)));
}

/** Correlation matrix of asset return series. */
export function correlationMatrix(assetReturns) {
  assertAssetMatrix(assetReturns);
  return assetReturns.map((a, i) =>
    assetReturns.map((b, j) => (i === j ? 1 : correlation(a, b)))
  );
}

function covTimes(weights, cov) {
  return cov.map((row) => row.reduce((s, c, j) => s + c * weights[j], 0));
}

/** Portfolio variance w' Σ w (same periodicity as the covariance matrix). */
export function portfolioVariance(weights, cov) {
  assertWeights(weights, cov.length);
  const sigmaW = covTimes(weights, cov);
  return weights.reduce((s, w, i) => s + w * sigmaW[i], 0);
}

/** Annualized portfolio volatility from per-period weights and covariance matrix. */
export function portfolioVolatility(
  weights,
  cov,
  { periodsPerYear = DEFAULT_PERIODS_PER_YEAR } = {}
) {
  assertPositive(periodsPerYear, "periodsPerYear");
  return Math.sqrt(portfolioVariance(weights, cov) * periodsPerYear);
}

/** Fractional contribution of each asset to total portfolio risk (sums to 1). */
export function riskContributions(weights, cov) {
  assertWeights(weights, cov.length);
  const variance = portfolioVariance(weights, cov);
  if (variance === 0) return weights.map(() => NaN);
  const sigmaW = covTimes(weights, cov);
  return weights.map((w, i) => (w * sigmaW[i]) / variance);
}
