export type OrderEvent = Readonly<{
  id: string;
  orderId: string;
  kind: "status" | "note" | "fulfillment" | "refund";
  message: string;
  occurredAt: string;
}>;

export type AdminOrder = Readonly<{
  id: string;
  customerEmail: string;
  status: string;
  totalCents: number;
  currency: string;
  events: readonly OrderEvent[];
}>;

export function filterOrders(orders: readonly AdminOrder[], status?: string): AdminOrder[] {
  return orders.filter((order) => !status || order.status === status);
}

export function appendMerchantNote(order: AdminOrder, note: string, occurredAt: string): AdminOrder {
  const message = note.trim();
  if (!message) throw new Error("Order notes cannot be empty");
  return {
    ...order,
    events: [...order.events, { id: `note_${order.events.length + 1}`, orderId: order.id, kind: "note", message, occurredAt }],
  };
}
