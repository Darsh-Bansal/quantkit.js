import { describe, it, expect } from "vitest";
import { mean, median, variance, standardDeviation, covariance, correlation, quantile } from "../src/index.js";

describe("descriptive statistics", () => {
  it("mean and median", () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });
  it("variance: sample by default, population optional", () => {
    expect(variance([1, 2, 3, 4])).toBeCloseTo(5 / 3, 10);
    expect(variance([1, 2, 3, 4], { sample: false })).toBeCloseTo(1.25, 10);
    expect(standardDeviation([1, 2, 3, 4], { sample: false })).toBeCloseTo(Math.sqrt(1.25), 10);
  });
  it("covariance and correlation", () => {
    const x = [1, 2, 3, 4];
    expect(covariance(x, x)).toBeCloseTo(variance(x), 10);
    expect(correlation(x, [2, 4, 6, 8])).toBeCloseTo(1, 10);
    expect(correlation(x, [8, 6, 4, 2])).toBeCloseTo(-1, 10);
    expect(correlation(x, [5, 5, 5, 5])).toBeNaN();
  });
  it("quantile interpolates linearly", () => {
    expect(quantile([-0.1, -0.05, 0, 0.05, 0.1], 0.05)).toBeCloseTo(-0.09, 10);
    expect(quantile([1, 2, 3], 0.5)).toBe(2);
  });
  it("validates input", () => {
    expect(() => mean([])).toThrow(RangeError);
    expect(() => mean("abc")).toThrow(TypeError);
    expect(() => mean([1, NaN])).toThrow(TypeError);
    expect(() => covariance([1, 2], [1, 2, 3])).toThrow(RangeError);
  });
});
