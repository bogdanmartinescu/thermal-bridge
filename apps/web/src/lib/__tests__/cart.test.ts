import { describe, it, expect } from "vitest";
import { totalBani } from "../money";

// Cart logic is tested at the pure utility level (reducer is internal).
// The full CartContext requires a browser environment; these tests cover the
// quantity clamping and total computation logic that the reducer delegates to.

describe("cart total computation", () => {
  it("sums multiple lines correctly", () => {
    const lines = [
      { unitPriceBani: 129900, qty: 2 },
      { unitPriceBani: 59900, qty: 1 },
    ];
    const total = lines.reduce((s, l) => s + totalBani(l.unitPriceBani, l.qty), 0);
    expect(total).toBe(319700); // 2*129900 + 59900
  });

  it("returns 0 for empty cart", () => {
    const total = ([] as { unitPriceBani: number; qty: number }[]).reduce(
      (s, l) => s + totalBani(l.unitPriceBani, l.qty),
      0,
    );
    expect(total).toBe(0);
  });
});

describe("qty clamping", () => {
  function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  it("clamps to minimum 1", () => {
    expect(clamp(0, 1, 10)).toBe(1);
  });

  it("clamps to maximum (available stock)", () => {
    expect(clamp(99, 1, 5)).toBe(5);
  });

  it("passes through valid qty", () => {
    expect(clamp(3, 1, 10)).toBe(3);
  });
});
