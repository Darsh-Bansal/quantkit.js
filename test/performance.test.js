import { describe, it, expect } from "vitest";
import { cagr, sharpeRatio, sortinoRatio, calmarRatio, informationRatio } from "../src/index.js";

describe("performance", () => {
  it("CAGR", () => {
    expect(cagr([0.1, 0.1], { periodsPerYear: 2 })).toBeCloseTo(0.21, 12);
    expect(cagr(new Array(252).fill(0))).toBeCloseTo(0, 12);
    expect(cagr([-1])).toBe(-1);
  });
  it("Sharpe ratio (hand-computed)", () => {
    // mean = 0.005, sample sd = sqrt(5e-4 / 3)
    expect(sharpeRatio([0.01, -0.01, 0.02, 0], { periodsPerYear: 1 })).toBeCloseTo(0.3873, 4);
  });
  it("Sharpe ratio uses annual risk-free rate converted per period", () => {
    const r = [0.01, -0.01, 0.02, 0];
    const rfPerPeriod = 0.06 / 252;
    const excess = r.map((x) => x - rfPerPeriod);
    const m = excess.reduce((a, b) => a + b) / excess.length;
    const sd = Math.sqrt(excess.reduce((a, b) => a + (b - m) ** 2, 0) / (excess.length - 1));
    expect(sharpeRatio(r, { riskFreeRate: 0.06, periodsPerYear: 252 })).toBeCloseTo((m / sd) * Math.sqrt(252), 10);
  });
  it("Sortino ratio (hand-computed)", () => {
    // downside dev = sqrt((0.02^2 + 0.04^2)/4), mean = 0.0225
    const r = [0.1, -0.02, 0.05, -0.04];
    const dd = Math.sqrt((0.0004 + 0.0016) / 4);
    expect(sortinoRatio(r, { periodsPerYear: 1 })).toBeCloseTo(0.0225 / dd, 10);
  });
  it("Calmar ratio", () => {
    const r = [0.1, -0.2, 0.05];
    expect(calmarRatio(r, { periodsPerYear: 3 })).toBeCloseTo(cagr(r, { periodsPerYear: 3 }) / 0.2, 10);
  });
  it("Information ratio is NaN for identical series", () => {
    expect(informationRatio([0.01, 0.02], [0.01, 0.02])).toBeNaN();
  });
  it("README quick-start example runs", () => {
    const returns = [0.02, -0.01, 0.035, 0.012, -0.02, 0.04, 0.015];
    const s = sharpeRatio(returns, { riskFreeRate: 0.06, periodsPerYear: 252 });
    expect(Number.isFinite(s)).toBe(true);
  });
});
