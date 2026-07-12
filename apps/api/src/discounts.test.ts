import type { PriceRule } from "@bazaar/db";
import { describe, expect, it } from "vitest";
import { applyDiscounts, DiscountUsageService, evaluateDiscount, revalidateDiscountsAtCheckout, type DiscountCart } from "./discounts.js";

const cart: DiscountCart = { subtotalCents: 5000, productIds: ["p1"], collectionHandles: ["bags"], customerId: "c1", shippingCents: 500, itemPricesCents: [2500, 2500] };
const rule = (id: string, value = 1000): PriceRule => ({ id, type: "fixed", value, conditions: { op: "all", conditions: [{ op: "minimum_spend", cents: 2000 }, { op: "collection_in", handles: ["bags"] }] }, uses: 0, startsAt: new Date(0) });

describe("promotions", () => {
  it("evaluates the closed eligibility AST with integer money", () => {
    expect(evaluateDiscount(rule("r1"), cart, new Date(1))).toBe(1000);
  });
  it("documents the current unguarded stacking behavior", () => {
    expect(applyDiscounts([rule("r1", 4000), rule("r2", 4000)], cart, new Date(1)).totalCents).toBe(-2500);
  });
  it("claims at most the configured concurrent usage count", async () => {
    let uses = 0;
    const service = new DiscountUsageService({ tryClaim: async () => uses < 3 ? (uses += 1, true) : false });
    const results = await Promise.all(Array.from({ length: 20 }, () => service.claim(rule("limited"), "c1")));
    expect(results.filter(Boolean)).toHaveLength(3);
  });
  it("reloads rules at checkout", async () => {
    await expect(revalidateDiscountsAtCheckout(["r1"], cart, { load: async () => [rule("r1")] }, new Date(1))).resolves.toMatchObject({ discountCents: 1000 });
  });
});
