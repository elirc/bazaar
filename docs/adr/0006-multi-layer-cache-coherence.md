# ADR-0006: Event Invalidation with TTL and Single-Flight Backstops

- Status: Accepted
- Date: 2026-07-12

## Decision

Storefront catalog reads may traverse CDN, ISR, Redis, and Postgres. The committed
write path invalidates product/collection dependency tags after durable success.
A TTL remains on every entry so missed events self-heal. Concurrent misses collapse
through single-flight; bounded stale data may be served for five minutes while one
background refresh runs.

Storefront catalog tolerates 60 fresh seconds plus bounded SWR. Admin, cart,
checkout, and inventory authorization tolerate zero staleness and never treat the
catalog cache as truth.

## Consequences

Writes must declare dependencies, and metrics must expose hits, misses, invalidated
keys, and hit rate. Event-only invalidation risks permanent staleness; TTL-only
allows predictable lies. Together they provide precision and self-healing.
