import { createHmac, timingSafeEqual } from "node:crypto";
import type { ChargePort } from "./checkout.js";

export class MockPaymentProvider implements ChargePort {
  readonly #charges = new Map<string, { chargeId: string; status: "succeeded" | "declined" }>();
  constructor(private readonly declineKeys = new Set<string>()) {}
  async charge(input: { idempotencyKey?: string }) {
    const key = input.idempotencyKey ?? crypto.randomUUID();
    const existing = this.#charges.get(key);
    if (existing) return existing;
    const result = { chargeId: `mock_${this.#charges.size + 1}`, status: this.declineKeys.has(key) ? "declined" as const : "succeeded" as const };
    this.#charges.set(key, result);
    return result;
  }
}

export const signPaymentWebhook = (body: string, timestamp: number, secret: string) =>
  createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");

export function verifyPaymentWebhook(body: string, timestamp: number, signature: string, secret: string) {
  const expected = Buffer.from(signPaymentWebhook(body, timestamp, secret));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export interface PaymentEventPort {
  claim(eventId: string): Promise<boolean>;
  markOrderPaid(orderId: string): Promise<void>;
}

export class PaymentWebhookHandler {
  constructor(private readonly events: PaymentEventPort, private readonly secret: string, private readonly now: () => number = Date.now) {}
  async handle(body: string, signature: string, timestamp: number) {
    if (Math.abs(this.now() - timestamp) > 5 * 60_000) throw new Error("Stale payment webhook");
    if (!verifyPaymentWebhook(body, timestamp, signature, this.secret)) throw new Error("Invalid payment signature");
    const event = JSON.parse(body) as { id: string; type: "payment.succeeded"; orderId: string };
    if (!(await this.events.claim(event.id))) return { duplicate: true };
    if (event.type === "payment.succeeded") await this.events.markOrderPaid(event.orderId);
    return { duplicate: false };
  }
}
