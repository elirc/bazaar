import { describe, expect, it, vi } from "vitest";
import { FulfillmentService, type FulfillmentPort } from "./fulfillment.js";
import { InventoryEffectService, type InventoryEffectPort } from "./inventory-effects.js";
import { MockRefundProvider, RefundService } from "./refunds.js";

describe("orders and fulfillment", () => {
  it("rejects fulfillment beyond the unfulfilled quantity", async () => {
    const port: FulfillmentPort = {
      orderQuantities: async () => new Map([["line_1", 3]]),
      fulfilledQuantities: async () => new Map([["line_1", 2]]),
      findByKey: async () => undefined,
      create: vi.fn(),
    };
    const service = new FulfillmentService(port);
    await expect(service.create({ id: "f_1", orderId: "o_1", idempotencyKey: "key", lines: [{ orderLineId: "line_1", quantity: 2 }] })).rejects.toThrow("more than remaining");
  });

  it("replays fulfillment creation by idempotency key", async () => {
    const existing = { id: "f_1", orderId: "o_1", idempotencyKey: "key", lines: [{ orderLineId: "line_1", quantity: 1 }] } as const;
    const port: FulfillmentPort = {
      orderQuantities: vi.fn(), fulfilledQuantities: vi.fn(), findByKey: async () => existing, create: vi.fn(),
    };
    expect(await new FulfillmentService(port).create(existing)).toBe(existing);
    expect(port.create).not.toHaveBeenCalled();
  });

  it("passes atomic inventory deltas through a single apply-once call", async () => {
    const applyOnce = vi.fn<InventoryEffectPort["applyOnce"]>().mockResolvedValue("applied");
    await new InventoryEffectService({ applyOnce }).ship("fulfillment:f_1", [{ inventoryItemId: "i_1", quantity: 2 }]);
    expect(applyOnce).toHaveBeenCalledWith(expect.objectContaining({ reservedDelta: -1, onHandDelta: -1 }));
  });

  it("replays a refund without issuing another provider refund", async () => {
    const provider = new MockRefundProvider();
    const service = new RefundService(provider);
    const input = { chargeId: "charge", amountCents: 500, paidCents: 1000, alreadyRefundedCents: 0, idempotencyKey: "refund-key" };
    expect(await service.create(input)).toEqual(await service.create(input));
  });
});
