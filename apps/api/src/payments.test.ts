import { describe, expect, it, vi } from "vitest";
import { MockPaymentProvider, PaymentWebhookHandler, signPaymentWebhook } from "./payments.js";

describe("payment boundaries", () => {
  it("provider idempotency returns one charge", async () => {
    const provider = new MockPaymentProvider();
    const input = { orderId: "o1", amountCents: 2400, currency: "USD", idempotencyKey: "attempt" };
    expect(await provider.charge(input)).toEqual(await provider.charge(input));
  });

  it("verifies and deduplicates webhook replay", async () => {
    const claimed = new Set<string>();
    const markOrderPaid = vi.fn(async () => undefined);
    const handler = new PaymentWebhookHandler({
      claim: async (id) => claimed.has(id) ? false : (claimed.add(id), true),
      markOrderPaid,
    }, "secret");
    const body = JSON.stringify({ id: "evt1", type: "payment.succeeded", orderId: "o1" });
    const signature = signPaymentWebhook(body, "secret");
    await handler.handle(body, signature);
    await expect(handler.handle(body, signature)).resolves.toEqual({ duplicate: true });
    expect(markOrderPaid).toHaveBeenCalledTimes(1);
  });
});
