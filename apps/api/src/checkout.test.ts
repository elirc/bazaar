import type { Cart, Order } from "@bazaar/db";
import { describe, expect, it } from "vitest";
import { NaiveCheckoutService, type ChargePort, type CheckoutOrderPort } from "./checkout.js";

class MemoryCheckout implements CheckoutOrderPort, ChargePort {
  orders: Order[] = [];
  charges: string[] = [];
  async create(order: Order) { this.orders.push(order); }
  async charge() { const chargeId = `ch_${this.charges.length + 1}`; this.charges.push(chargeId); return { chargeId, status: "succeeded" as const }; }
}

const cart: Cart = { id: "cart", storeId: "store", lines: [{ id: "line", variantId: "v1", quantity: 1, priceSnapshotCents: 2400 }], updatedAt: new Date() };

describe("checkout idempotency", () => {
  it("double-submit creates one order and one charge", async () => {
    const memory = new MemoryCheckout();
    let ids = 0;
    const checkout = new NaiveCheckoutService(memory, memory, () => `order_${++ids}`);
    await Promise.all([checkout.checkout(cart, "attempt-1"), checkout.checkout(cart, "attempt-1")]);
    expect(memory.orders).toHaveLength(1);
    expect(memory.charges).toHaveLength(1);
  });
});
