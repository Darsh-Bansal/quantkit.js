import { describe, it, expect } from "vitest";
import { sma, ema, rsi, macd } from "../src/index.js";

describe("indicators", () => {
  it("sma", () => {
    expect(sma([1, 2, 3, 4, 5], 3)).toEqual([NaN, NaN, 2, 3, 4]);
  });
  it("ema seeds with SMA then smooths", () => {
    expect(ema([1, 2, 3, 4, 5], 3)).toEqual([NaN, NaN, 2, 3, 4]);
    expect(ema([5, 5, 5, 5, 5], 2).slice(1)).toEqual([5, 5, 5, 5]);
  });
  it("rsi is 100 on a strictly rising series and 0 on a strictly falling one", () => {
    const up = Array.from({ length: 20 }, (_, i) => 100 + i);
    const down = Array.from({ length: 20 }, (_, i) => 100 - i);
    expect(rsi(up, 14)[19]).toBe(100);
    expect(rsi(down, 14)[19]).toBe(0);
    expect(rsi(up, 14)[13]).toBeNaN();
  });
  it("rsi matches an independent Wilder calculation", () => {
    const closes = [
      44.3389, 44.0902, 44.1497, 43.6124, 44.3278, 44.8264, 45.0955, 45.4245,
      45.8433, 46.0826, 45.8931, 46.0328, 45.614, 46.282, 46.282, 46.0028,
      46.0328, 46.4116, 46.2222, 45.6439, 46.2122, 46.2521, 45.7137, 46.4515,
      45.7835, 45.3548, 44.0288, 44.1783, 44.2181, 44.5672, 43.4205, 42.6628,
      43.1314
    ];
    const r = rsi(closes, 14);
    expect(r[14]).toBeCloseTo(70.5328, 3);
    expect(r[15]).toBeCloseTo(66.3186, 3);
  });
  it("macd shapes and relationships", () => {
    const prices = Array.from({ length: 60 }, (_, i) => 100 + Math.sin(i / 3) * 5 + i * 0.1);
    const { macd: m, signal, histogram } = macd(prices);
    expect(m).toHaveLength(60);
    expect(m[24]).toBeNaN();
    expect(Number.isFinite(m[25])).toBe(true);
    expect(Number.isFinite(signal[33])).toBe(true);
    expect(histogram[40]).toBeCloseTo(m[40] - signal[40], 12);
    expect(() => macd(prices, { fast: 26, slow: 12 })).toThrow(RangeError);
  });
});
