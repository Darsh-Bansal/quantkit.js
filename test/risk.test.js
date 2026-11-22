import { describe, it, expect } from "vitest";
import {
  volatility, downsideDeviation, maxDrawdown, drawdownSeries, beta, valueAtRisk, expectedShortfall, standardDeviation
} from "../src/index.js";

describe("risk", () => {
  it("volatility annualizes with sqrt(periodsPerYear)", () => {
    const r = [0.01, -0.01, 0.02, 0.0];
    expect(volatility(r, { periodsPerYear: 1 })).toBeCloseTo(standardDeviation(r), 12);
    expect(volatility(r, { periodsPerYear: 252 })).toBeCloseTo(standardDeviation(r) * Math.sqrt(252), 12);
  });
  it("max drawdown", () => {
    expect(maxDrawdown([0.1, -0.2, 0.05])).toBeCloseTo(-0.2, 12);
    expect(maxDrawdown([0.01, 0.02])).toBe(0);
    expect(drawdownSeries([0.1, -0.2])[1]).toBeCloseTo(-0.2, 12);
  });
  it("downside deviation only counts returns below the target", () => {
    expect(downsideDeviation([0.1, -0.02, 0.05, -0.04])).toBeCloseTo(Math.sqrt((0.0004 + 0.0016) / 4), 12);
    expect(downsideDeviation([0.1, 0.2])).toBe(0);
  });
  it("beta", () => {
    const b = [0.01, -0.02, 0.03, 0.005];
    expect(beta(b.map((x) => 2 * x), b)).toBeCloseTo(2, 12);
  });
  it("historical VaR and ES", () => {
    const r = [-0.1, -0.05, 0, 0.05, 0.1];
    expect(valueAtRisk(r, { confidence: 0.95 })).toBeCloseTo(0.09, 12);
    expect(expectedShortfall(r, { confidence: 0.95 })).toBeCloseTo(0.1, 12);
    expect(() => valueAtRisk(r, { confidence: 1 })).toThrow(RangeError);
  });
});
