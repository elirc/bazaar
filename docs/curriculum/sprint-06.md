# Sprint 06: Cache Invalidation and Stampede Protection

## Objectives

- Model cache dependencies with entity tags.
- Combine event invalidation with TTL self-healing.
- Collapse concurrent misses and serve bounded stale data.
- Measure hit/miss/invalidation behavior.

## Review before reveal

Read flaw-ledger rows 1 and 3, then the three failing-risk tests, the cache core,
key/tag convention, metrics, and ADR-0006.

## Debate captured

TTL-only is simple but knowingly stale. Event-only is precise but a missed event
can stale forever. Bazaar uses both: events for freshness, TTL for recovery,
single-flight for safe expiry, and SWR for buyer latency.

## Exercises

1. Remove the product tag and reproduce a stale price.
2. Remove single-flight and count origin loads for 100 concurrent misses.
3. Make refresh fail during SWR and define the stale/error policy.
4. Add a collection dependency and prove one product edit invalidates both pages.
