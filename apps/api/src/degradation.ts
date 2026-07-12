export interface PaymentHealthPort { available(): Promise<boolean>; }
export interface PendingCheckoutPort { enqueue(input: { cartId: string; idempotencyKey: string }): Promise<{ pendingId: string }>; }

export class CheckoutDegradationService {
  constructor(private readonly health: PaymentHealthPort, private readonly pending: PendingCheckoutPort) {}
  async beforeCharge(cartId: string, idempotencyKey: string) {
    if (await this.health.available()) return { mode: "charge" as const };
    const queued = await this.pending.enqueue({ cartId, idempotencyKey });
    return { mode: "pending" as const, pendingId: queued.pendingId, message: "Payment is delayed. Your order is reserved and has not been charged." };
  }
}
