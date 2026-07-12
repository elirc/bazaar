import type { Cart, Order } from "@bazaar/db";

export interface CheckoutOrderPort {
  create(order: Order): Promise<void>;
}
export interface ChargePort {
  charge(input: { orderId: string; amountCents: number; currency: string; idempotencyKey?: string }): Promise<{ chargeId: string; status: "succeeded" | "declined" }>;
}

export class NaiveCheckoutService {
  constructor(
    private readonly orders: CheckoutOrderPort,
    private readonly payments: ChargePort,
    private readonly idFactory: () => string,
  ) {}
  async checkout(cart: Cart, requestKey: string) {
    const order: Order = {
      id: this.idFactory(), cartId: cart.id, idempotencyKey: requestKey, status: "pending",
      totalCents: cart.lines.reduce((sum, line) => sum + line.priceSnapshotCents * line.quantity, 0),
      currency: "USD",
      lines: cart.lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity, unitPriceCents: line.priceSnapshotCents })),
    };
    await this.orders.create(order);
    const charge = await this.payments.charge({ orderId: order.id, amountCents: order.totalCents, currency: order.currency });
    return { order, charge };
  }
}
