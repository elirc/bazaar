# ADR-0001: Separate Storefront and Admin Applications

- Status: Accepted
- Date: 2026-07-12

## Context

Bazaar serves two audiences from one catalog. Buyers generate read-heavy,
latency-sensitive traffic and tolerate bounded staleness. Merchants make writes
and operational decisions that require immediate read-after-write consistency.
One Next.js application would couple their rendering mode, scaling, and failure
domain despite these opposite requirements.

## Decision

Run `apps/storefront` and `apps/admin` as separate applications. They share domain
contracts and the catalog source of truth, but expose separate read paths:

- Storefront: cacheable projections; 60 seconds of catalog staleness is acceptable
  in the foundation, with transactional truth deferred to checkout.
- Admin: dynamic, authenticated, uncached reads; staleness tolerance is zero.

## Consequences

The storefront can scale and cache independently for buyer traffic. Admin changes
remain fresh and cannot accidentally consume a stale buyer projection. The cost is
two deployments and deliberate sharing through packages instead of route imports.
