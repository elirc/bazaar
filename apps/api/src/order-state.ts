import type { OrderStatus } from "@bazaar/db";

const transitions: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  pending: ["paid", "failed", "cancelled"],
  paid: ["fulfilled", "cancelled"],
  failed: [],
  cancelled: [],
  fulfilled: [],
};

export function transitionOrder(from: OrderStatus, to: OrderStatus): OrderStatus {
  if (!transitions[from].includes(to)) throw new Error(`Illegal order transition: ${from} -> ${to}`);
  return to;
}
