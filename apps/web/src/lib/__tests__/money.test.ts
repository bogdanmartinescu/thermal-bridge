import { describe, it, expect } from "vitest";
import { formatRON, totalBani } from "../money";

describe("formatRON", () => {
  it("formats 0 bani", () => {
    expect(formatRON(0)).toMatch(/0/);
  });

  it("formats 100 bani as 1 RON", () => {
    const result = formatRON(100);
    expect(result).toMatch(/1[.,]00/);
    expect(result).toMatch(/RON/);
  });

  it("formats 129900 bani as 1299 RON", () => {
    const result = formatRON(129900);
    expect(result).toMatch(/1[.,]299/);
  });

  it("formats large values correctly", () => {
    const result = formatRON(500000);
    expect(result).toMatch(/5[.,]000/);
  });
});

describe("totalBani", () => {
  it("multiplies unit price by quantity", () => {
    expect(totalBani(129900, 3)).toBe(389700);
  });

  it("handles qty=1 as identity", () => {
    expect(totalBani(50000, 1)).toBe(50000);
  });

  it("handles qty=0 as zero", () => {
    expect(totalBani(50000, 0)).toBe(0);
  });
});
