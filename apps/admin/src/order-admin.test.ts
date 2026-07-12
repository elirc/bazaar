import { describe, expect, it } from "vitest";
import { appendMerchantNote, filterOrders, type AdminOrder } from "./order-admin";

const order: AdminOrder = { id: "o_1", customerEmail: "buyer@example.com", status: "paid", totalCents: 1000, currency: "USD", events: [] };

describe("order administration", () => {
  it("filters the merchant queue and appends immutable timeline notes", () => {
    expect(filterOrders([order], "paid")).toEqual([order]);
    const updated = appendMerchantNote(order, "  Packed at dock 2  ", "2026-07-12T20:00:00Z");
    expect(updated.events[0]?.message).toBe("Packed at dock 2");
    expect(order.events).toHaveLength(0);
  });
});
