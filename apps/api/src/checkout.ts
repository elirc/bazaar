import type { Cart, Order } from "@bazaar/db";

export interface CheckoutOrderPort {
  create(order: Order): Promise<void>;
}
export interface ChargePort {
  charge(input: { orderId: string; amountCents: number; currency: string; idempotencyKey?: string }): Promise<{ chargeId: string; status: "succeeded" | "declined" }>;
}

export interface CheckoutValidationPort {
  currentPriceCents(variantId: string): Promise<number>;
  reservationActive(cartId: string, variantId: string, quantity: number): Promise<boolean>;
}

export async function revalidateCheckout(cart: Cart, validation: CheckoutValidationPort) {
  let totalCents = 0;
  for (const line of cart.lines) {
    const currentPrice = await validation.currentPriceCents(line.variantId);
    if (currentPrice !== line.priceSnapshotCents) throw new Error(`Price changed for ${line.variantId}`);
    if (!(await validation.reservationActive(cart.id, line.variantId, line.quantity))) {
      throw new Error(`Inventory reservation missing for ${line.variantId}`);
    }
    totalCents += currentPrice * line.quantity;
  }
  return { totalCents, currency: "USD" as const };
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

export interface CheckoutRecoveryPort {
  markPaid(orderId: string): Promise<void>;
  markFailed(orderId: string): Promise<void>;
  releaseReservations(cartId: string): Promise<void>;
}

export async function settleCheckout(
  order: Order,
  charge: { status: "succeeded" | "declined" },
  recovery: CheckoutRecoveryPort,
) {
  if (charge.status === "succeeded") {
    await recovery.markPaid(order.id);
    return "paid" as const;
  }
  await recovery.markFailed(order.id);
  await recovery.releaseReservations(order.cartId);
  return "failed" as const;
}
