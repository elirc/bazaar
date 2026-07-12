export const commerceMetrics = {
  storefront: ["http_request_duration_ms", "cache_hit_ratio", "lcp_ms"],
  integrity: ["inventory_drift_units", "checkout_success_ratio", "payment_failure_ratio", "order_backlog"],
} as const;

export type CommerceHealthInput = Readonly<{
  cacheHits: number;
  cacheMisses: number;
  checkoutStarted: number;
  checkoutSucceeded: number;
  paymentFailed: number;
  orderBacklog: number;
  inventoryDriftUnits: number;
}>;

export function commerceHealth(input: CommerceHealthInput) {
  const cacheReads = input.cacheHits + input.cacheMisses;
  return {
    cacheHitRatio: cacheReads ? input.cacheHits / cacheReads : 0,
    checkoutSuccessRatio: input.checkoutStarted ? input.checkoutSucceeded / input.checkoutStarted : 1,
    paymentFailureRatio: input.checkoutStarted ? input.paymentFailed / input.checkoutStarted : 0,
    orderBacklog: input.orderBacklog,
    inventoryDriftUnits: input.inventoryDriftUnits,
  };
}
