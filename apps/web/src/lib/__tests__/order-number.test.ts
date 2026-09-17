import { describe, it, expect } from "vitest";
import { buildOrderRef } from "../order-number";

describe("buildOrderRef", () => {
  it("formats a 4-digit seq with zero-padding", () => {
    expect(buildOrderRef(2026, 1)).toBe("TB-2026-0001");
  });

  it("handles seq >= 1000 without padding", () => {
    expect(buildOrderRef(2026, 1234)).toBe("TB-2026-1234");
  });

  it("uses the correct year", () => {
    expect(buildOrderRef(2027, 5)).toBe("TB-2027-0005");
  });
});
