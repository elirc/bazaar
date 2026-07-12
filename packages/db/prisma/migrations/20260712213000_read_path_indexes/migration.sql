-- Predicates captured by the Sprint 12 query audit. Verify with EXPLAIN
-- (ANALYZE, BUFFERS) against production-like cardinality before deployment.
CREATE INDEX "Product_storeId_status_createdAt_idx"
  ON "Product" ("storeId", "status", "createdAt" DESC);
CREATE INDEX "Order_cartId_status_idx" ON "Order" ("cartId", "status");
CREATE INDEX "OrderLine_orderId_variantId_idx" ON "OrderLine" ("orderId", "variantId");
CREATE INDEX "Fulfillment_orderId_createdAt_idx" ON "Fulfillment" ("orderId", "createdAt" DESC);
