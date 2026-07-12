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

export interface IdempotentOrderPort {
  getOrCreate(key: string, create: () => Order): Promise<{ order: Order; created: boolean }>;
}

export class IdempotentCheckoutService {
  constructor(
    private readonly orders: IdempotentOrderPort,
    private readonly payments: ChargePort,
    private readonly idFactory: () => string,
  ) {}
  async checkout(cart: Cart, requestKey: string) {
    const result = await this.orders.getOrCreate(requestKey, () => ({
      id: this.idFactory(), cartId: cart.id, idempotencyKey: requestKey, status: "pending",
      totalCents: cart.lines.reduce((sum, line) => sum + line.priceSnapshotCents * line.quantity, 0),
      currency: "USD",
      lines: cart.lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity, unitPriceCents: line.priceSnapshotCents })),
    }));
    if (!result.created) return { order: result.order, replayed: true };
    const charge = await this.payments.charge({
      orderId: result.order.id, amountCents: result.order.totalCents,
      currency: result.order.currency, idempotencyKey: requestKey,
    });
    return { order: result.order, charge, replayed: false };
  }
}
