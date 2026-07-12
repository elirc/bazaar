# ADR-0002: Add Storefront Cache Layers Only When Measured

- Status: Accepted
- Date: 2026-07-12

## Context

Catalog reads will eventually traverse CDN, Next.js ISR, Redis, and Postgres. Each
layer can reduce origin load, but every layer also creates a new place where a
price or availability value can become stale. Starting with all layers would hide
which one provides value and make invalidation failures difficult to teach.

## Decision

Start with the separate storefront read seam and add layers in measured stages:

1. Sprint 3 selects SSG, ISR, or dynamic rendering per route.
2. Sprint 5 adds Redis read-through caching and records hit rate, p95, and origin load.
3. Sprint 6 adds tag invalidation, TTL backstops, single-flight, and SWR.
4. Sprint 12 tunes keys and warming from measurements; Sprint 13 stress-tests them.

Every cached surface must name its audience and staleness tolerance. Storefront
catalog pages initially tolerate 60 seconds; cart, checkout, inventory mutation,
and all admin reads tolerate zero and never use the catalog page cache as truth.

## Consequences

Each layer arrives with a baseline and a removal criterion. Event invalidation will
provide precision, TTL will self-heal missed events, and transactional operations
will always revalidate price and inventory against the authoritative store.
