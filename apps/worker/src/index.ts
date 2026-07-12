export type BazaarJob =
  | { name: "catalog.index"; productId: string }
  | { name: "order.process"; orderId: string }
  | { name: "webhook.deliver"; eventId: string };

export interface JobQueue {
  enqueue(job: BazaarJob): Promise<void>;
}

export type JobHandler = (job: BazaarJob) => Promise<void>;

/**
 * The worker owns orchestration, not infrastructure. BullMQ wiring arrives at
 * the entry boundary later; tests can drive the same behavior with a fake queue.
 */
export class BazaarWorker {
  constructor(private readonly handlers: Partial<Record<BazaarJob["name"], JobHandler>>) {}

  async process(job: BazaarJob): Promise<void> {
    const handler = this.handlers[job.name];
    if (!handler) throw new Error(`No handler registered for ${job.name}`);
    await handler(job);
  }
}

export { CatalogIndexWorker, ProductIndexer, SearchReconciler, type CatalogProjectionSource, type CatalogReconciliationSource, type CatalogSearchProjection, type SearchEngineProjection, type SearchEngineWriter } from "./catalog-indexer.js";
export { ReservationExpiryWorker, type ReservationExpiryPort } from "./reservation-expiry.js";
export { MerchantWebhookWorker, webhookSignature, type MerchantDelivery, type MerchantDeliveryPort } from "./merchant-webhooks.js";
export { InventoryReconciler, type InventoryDrift, type InventoryReconciliationPort, type InventoryTruth } from "./inventory-reconciler.js";
export { GracefulDeployment, type DeploymentPort } from "./deployment.js";
