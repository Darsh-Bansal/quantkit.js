import { describe, it, expect } from "vitest";
import {
  portfolioReturns, covarianceMatrix, correlationMatrix, portfolioVariance,
  portfolioVolatility, riskContributions, normalizeWeights, equalWeights
} from "../src/index.js";

describe("portfolio", () => {
  it("portfolio returns", () => {
    const r = portfolioReturns([[0.01, 0.02], [0.03, 0.0]], [0.5, 0.5]);
    expect(r[0]).toBeCloseTo(0.02, 12);
    expect(r[1]).toBeCloseTo(0.01, 12);
  });
  it("weights helpers", () => {
    expect(equalWeights(4)).toEqual([0.25, 0.25, 0.25, 0.25]);
    expect(normalizeWeights([2, 2])).toEqual([0.5, 0.5]);
    expect(() => normalizeWeights([1, -1])).toThrow(RangeError);
  });
  it("covariance and correlation matrices", () => {
    const a = [0.01, 0.02, 0.03];
    const m = covarianceMatrix([a, a.map((x) => -x)]);
    expect(m[0][1]).toBeCloseTo(-m[0][0], 12);
    expect(correlationMatrix([a, a.map((x) => -x)])[0][1]).toBeCloseTo(-1, 12);
  });
  it("variance, volatility, risk contributions", () => {
    const cov = [[0.04, 0], [0, 0.04]];
    const w = [0.5, 0.5];
    expect(portfolioVariance(w, cov)).toBeCloseTo(0.02, 12);
    expect(portfolioVolatility(w, cov, { periodsPerYear: 1 })).toBeCloseTo(Math.sqrt(0.02), 12);
    const rc = riskContributions(w, cov);
    expect(rc[0]).toBeCloseTo(0.5, 12);
    expect(rc.reduce((a, b) => a + b)).toBeCloseTo(1, 12);
  });
  it("rejects mismatched weights", () => {
    expect(() => portfolioReturns([[0.01], [0.02]], [1])).toThrow(RangeError);
  });
});
