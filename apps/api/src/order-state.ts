import type { OrderStatus } from "@bazaar/db";

const transitions: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  pending: ["paid", "failed", "cancelled"],
  paid: ["partially_fulfilled", "fulfilled", "cancelled", "refunded"],
  partially_fulfilled: ["fulfilled", "cancelled", "refunded"],
  fulfilled: ["delivered", "refunded"],
  delivered: ["refunded"],
  failed: [],
  cancelled: [],
  refunded: [],
};

export function transitionOrder(from: OrderStatus, to: OrderStatus): OrderStatus {
  if (!transitions[from].includes(to)) throw new Error(`Illegal order transition: ${from} -> ${to}`);
  return to;
}
