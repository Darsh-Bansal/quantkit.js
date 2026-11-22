import { describe, it, expect } from "vitest";
import { rollingMean, rollingStd, rollingSum, rollingVolatility } from "../src/index.js";

describe("time series", () => {
  it("rolling mean pads with NaN", () => {
    expect(rollingMean([1, 2, 3, 4, 5], 3)).toEqual([NaN, NaN, 2, 3, 4]);
  });
  it("rolling sum", () => {
    expect(rollingSum([1, 2, 3, 4], 2)).toEqual([NaN, 3, 5, 7]);
  });
  it("rolling std and volatility", () => {
    const s = rollingStd([1, 2, 3, 4], 2);
    expect(s[1]).toBeCloseTo(Math.SQRT1_2, 12);
    const v = rollingVolatility([1, 2, 3, 4], 2, { periodsPerYear: 4 });
    expect(v[1]).toBeCloseTo(Math.SQRT1_2 * 2, 12);
  });
  it("validates window", () => {
    expect(() => rollingMean([1, 2], 0)).toThrow(RangeError);
    expect(() => rollingStd([1, 2], 1)).toThrow(RangeError);
  });
});
