# ADR-0007: Authorize Inventory with Atomic Database Reservations

- Status: Accepted
- Date: 2026-07-12

## Decision

Inventory truth is the database row containing on-hand and reserved counts. A
reservation uses one conditional update equivalent to:

```sql
UPDATE inventory_item SET reserved = reserved + $qty
WHERE id = $id AND on_hand - reserved >= $qty;
```

Affected rows determine success. Short-TTL reservation records bridge cart to
checkout; active-only transitions make release/commit idempotent. Redis may cache
the buyer-facing availability hint but never authorizes a sale.

## Consequences

Correctness precedes throughput. One hot item may become a contention point; the
Sprint 13 drill measures that wall before considering queues or sharding. The
storefront may briefly say “in stock,” while reservation is authoritative.
