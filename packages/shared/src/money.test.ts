import { describe, expect, it } from "vitest";
import { convertMinorUnits, formatMoney, selectDatedRate, type ExchangeRate } from "./money.js";

const rates: ExchangeRate[] = [
  { base: "USD", quote: "EUR", numerator: 920_000, denominator: 1_000_000, effectiveAt: "2026-07-01" },
  { base: "USD", quote: "EUR", numerator: 930_000, denominator: 1_000_000, effectiveAt: "2026-07-10" },
];

describe("localized money", () => {
  it("selects the latest effective rate and rounds once in minor units", () => {
    const rate = selectDatedRate(rates, "USD", "EUR", "2026-07-12");
    expect(rate?.effectiveAt).toBe("2026-07-10");
    expect(convertMinorUnits(2400, rate!)).toBe(2232);
    expect(formatMoney(123456, "EUR", "fr-FR")).toMatch(/1.?234,56/);
  });
});
