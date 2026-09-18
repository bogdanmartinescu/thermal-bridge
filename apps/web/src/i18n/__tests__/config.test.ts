import { describe, it, expect } from "vitest";
import { homePath, localeFromPathname } from "../config";

describe("localeFromPathname", () => {
  it("defaults to Romanian", () => {
    expect(localeFromPathname("/")).toBe("ro");
    expect(localeFromPathname("/imprimante")).toBe("ro");
  });

  it("detects the English landing", () => {
    expect(localeFromPathname("/en")).toBe("en");
    expect(localeFromPathname("/en/")).toBe("en");
  });
});

describe("homePath", () => {
  it("uses / for Romanian and /en for English", () => {
    expect(homePath("ro")).toBe("/");
    expect(homePath("en")).toBe("/en");
  });
});
