import type { Cart, Order } from "@bazaar/db";
import { describe, expect, it, vi } from "vitest";
import { AuthoritativeCheckoutService, IdempotentCheckoutService, revalidateCheckout, settleCheckout, type ChargePort, type CheckoutOrderPort, type IdempotentOrderPort } from "./checkout.js";

class MemoryCheckout implements CheckoutOrderPort, IdempotentOrderPort, ChargePort {
  orders: Order[] = [];
  charges: string[] = [];
  async create(order: Order) { this.orders.push(order); }
  async getOrCreate(key: string, create: () => Order) {
    const existing = this.orders.find((order) => order.idempotencyKey === key);
    if (existing) return { order: existing, created: false };
    const order = create(); this.orders.push(order); return { order, created: true };
  }
  async charge() { const chargeId = `ch_${this.charges.length + 1}`; this.charges.push(chargeId); return { chargeId, status: "succeeded" as const }; }
}

const cart: Cart = { id: "cart", storeId: "store", lines: [{ id: "line", variantId: "v1", quantity: 1, priceSnapshotCents: 2400 }], updatedAt: new Date() };

describe("checkout idempotency", () => {
  it("double-submit creates one order and one charge", async () => {
    const memory = new MemoryCheckout();
    let ids = 0;
    const checkout = new IdempotentCheckoutService(memory, memory, () => `order_${++ids}`);
    await Promise.all([checkout.checkout(cart, "attempt-1"), checkout.checkout(cart, "attempt-1")]);
    expect(memory.orders).toHaveLength(1);
    expect(memory.charges).toHaveLength(1);
  });

  it("revalidates price and reservation before money", async () => {
    await expect(revalidateCheckout(cart, {
      currentPriceCents: async () => 2400,
      reservationActive: async () => true,
    })).resolves.toEqual({ totalCents: 2400, currency: "USD" });
    await expect(revalidateCheckout(cart, {
      currentPriceCents: async () => 2600,
      reservationActive: async () => true,
    })).rejects.toThrow("Price changed");
  });

  it("rejects a client-tampered price before order or charge creation", async () => {
    const memory = new MemoryCheckout();
    const subject = new AuthoritativeCheckoutService(memory, memory, () => "order", {
      currentPriceCents: async () => 2400,
      reservationActive: async () => true,
    });
    const tampered = { ...cart, lines: [{ ...cart.lines[0]!, priceSnapshotCents: 1 }] };
    await expect(subject.checkout(tampered, "tamper")).rejects.toThrow("Price changed");
    expect(memory.orders).toHaveLength(0);
    expect(memory.charges).toHaveLength(0);
  });

  it("decline fails the order, releases stock, and leaves cart recovery to the caller", async () => {
    const recovery = { markPaid: vi.fn(), markFailed: vi.fn(async () => undefined), releaseReservations: vi.fn(async () => undefined) };
    const order: Order = { id: "o1", cartId: "cart", idempotencyKey: "k", status: "pending", totalCents: 2400, currency: "USD", lines: [] };
    await expect(settleCheckout(order, { status: "declined" }, recovery)).resolves.toBe("failed");
    expect(recovery.markFailed).toHaveBeenCalledWith("o1");
    expect(recovery.releaseReservations).toHaveBeenCalledWith("cart");
  });
});
