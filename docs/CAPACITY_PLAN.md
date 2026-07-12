# Capacity Plan

## Strategy

Autoscale stateless storefront/API/worker tiers on concurrency, p95, and queue age.
Pre-scale the database and connection pool for announced events because stateful
capacity arrives slowly. Warm scheduled products before traffic. For flash spikes,
rate-limit automation and activate a signed waiting room when checkout p95 exceeds
500 ms or DB lock wait exceeds 100 ms for five minutes.

## Initial budgets and triggers

| Signal | Budget | Action |
|---|---:|---|
| storefront p95 | <250 ms cached | scale stateless; inspect cache |
| checkout success | >=99.5% / 30d | page <98% / 5m at 100 attempts |
| checkout p95 | <500 ms | shed/waiting room after sustained breach |
| DB lock wait | <100 ms | protect stateful tier; queue sale buyers |
| cache hit ratio | >=90% | warm head/trends; inspect invalidation |
| inventory drift | 0 units | pause SKU and reconcile immediately |
| oldest order job | <60 s | isolate poison jobs; scale healthy workers |

Revisit budgets with production demand/cost data. Over-provision only the slowest
stateful tier for named events; autoscale gradual load and shed sudden excess rather
than letting retries collapse the system.
