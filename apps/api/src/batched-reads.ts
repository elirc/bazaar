export interface OrderDetailBatchPort<TLine, TFulfillment> {
  linesForOrders(orderIds: readonly string[]): Promise<ReadonlyMap<string, readonly TLine[]>>;
  fulfillmentsForOrders(orderIds: readonly string[]): Promise<ReadonlyMap<string, readonly TFulfillment[]>>;
}

export async function loadOrderChildren<TLine, TFulfillment>(orderIds: readonly string[], port: OrderDetailBatchPort<TLine, TFulfillment>) {
  const unique = [...new Set(orderIds)];
  const [lines, fulfillments] = await Promise.all([
    port.linesForOrders(unique),
    port.fulfillmentsForOrders(unique),
  ]);
  return unique.map((orderId) => ({ orderId, lines: lines.get(orderId) ?? [], fulfillments: fulfillments.get(orderId) ?? [] }));
}

export function assertBoundedReadCount(path: string, actual: number, budget: number) {
  if (actual > budget) throw new Error(`${path} used ${actual} reads; budget is ${budget}`);
}
