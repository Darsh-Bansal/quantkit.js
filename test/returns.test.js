import { describe, it, expect } from "vitest";
import { simpleReturns, logReturns, cumulativeReturns, totalReturn } from "../src/index.js";

describe("returns", () => {
  it("simple returns", () => {
    const r = simpleReturns([100, 110, 99]);
    expect(r[0]).toBeCloseTo(0.1, 12);
    expect(r[1]).toBeCloseTo(-0.1, 12);
  });
  it("log returns", () => {
    const r = logReturns([100, 110]);
    expect(r[0]).toBeCloseTo(Math.log(1.1), 12);
    expect(() => logReturns([100, -1])).toThrow(RangeError);
  });
  it("cumulative and total returns", () => {
    const c = cumulativeReturns([0.1, 0.1]);
    expect(c[1]).toBeCloseTo(0.21, 12);
    expect(totalReturn([0.1, 0.1])).toBeCloseTo(0.21, 12);
  });
});
