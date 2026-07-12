import { describe, expect, it } from "vitest";
import { opaqueCustomerLookup, safeStorefrontCacheKey } from "./storefront-security.js";

describe("storefront attack surface", () => {
  it("does not admit arbitrary request dimensions into cache identity", () => {
    expect(safeStorefrontCacheKey({ storeId: "s1", handle: "market-tote", locale: "attacker", currency: "FREE" }))
      .toBe("bazaar:v2:store:s1:product:market-tote:en-US:USD");
    expect(() => safeStorefrontCacheKey({ storeId: "s1", handle: "../../orders" })).toThrow("Invalid");
  });
  it("makes missing and unauthorized lookups indistinguishable", () => {
    expect(opaqueCustomerLookup(undefined, false)).toEqual(opaqueCustomerLookup({ secret: true }, false));
  });
});
