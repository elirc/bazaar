import type { Cart } from "@bazaar/db";
import { describe, expect, it } from "vitest";
import { addCartLine, calculateCartTotals, mergeCarts } from "./cart-service.js";

const cart = (id: string, customerId?: string): Cart => ({ id, storeId: "s1", ...(customerId ? { customerId } : {}), lines: [], updatedAt: new Date("2026-01-01") });

describe("cart journey", () => {
  it("persists a snapshot and merges guest quantity by variant", () => {
    const guest = addCartLine(cart("guest"), { id: "g1", variantId: "v1", quantity: 1, priceSnapshotCents: 2400 });
    const customer = addCartLine(cart("customer", "c1"), { id: "c1", variantId: "v1", quantity: 2, priceSnapshotCents: 2400 });
    expect(mergeCarts(guest, customer).lines).toMatchObject([{ quantity: 3, priceSnapshotCents: 2400 }]);
  });
  it("reports rather than silently applies current-price drift", async () => {
    const subject = addCartLine(cart("guest"), { id: "g1", variantId: "v1", quantity: 2, priceSnapshotCents: 2400 });
    await expect(calculateCartTotals(subject, { findPriceCents: async () => 2600 })).resolves.toEqual({ snapshotTotalCents: 4800, currentTotalCents: 5200, priceChanged: true });
  });
});
