import { describe, expect, it, vi } from "vitest";
import { chargeQuotedAmount, createCurrencyQuote } from "./currency-checkout.js";

describe("buyer-currency checkout", () => {
  it("charges the exact minor-unit quote that was displayed", async () => {
    const quote = createCurrencyQuote(2400, { base: "USD", quote: "EUR", numerator: 930_000, denominator: 1_000_000, effectiveAt: "2026-07-10" });
    const charge = vi.fn(async () => ({ chargeId: "charge" }));
    await chargeQuotedAmount(quote, "attempt", { charge });
    expect(quote.amountMinor).toBe(2232);
    expect(charge).toHaveBeenCalledWith({ amountMinor: 2232, currency: "EUR", idempotencyKey: "attempt" });
  });
});
