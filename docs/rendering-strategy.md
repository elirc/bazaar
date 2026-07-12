# Storefront Rendering Strategy

Choose a rendering strategy from business constraints, not framework preference.

| Route shape | Traffic | Personalization | Staleness tolerance | Strategy |
|---|---:|---:|---:|---|
| Marketing/home | high | none | hours/build | SSG |
| Product/collection | high | none | 60 seconds | ISR |
| Cart/checkout/account | buyer-specific | high | zero | dynamic |
| Admin | lower | authenticated | zero | dynamic, separate app |

## Decision sequence

1. Can two buyers receive identical HTML? If no, render dynamically.
2. Can the value be stale? If no, render dynamically or revalidate against truth.
3. Does the page change only at release time? If yes, use SSG.
4. Otherwise use ISR with a written time bound and an invalidation owner.

ISR gives static response speed and periodic recomputation. Its revalidation window
is a maximum expected age, not permission to use cached data for money or stock.
Catalog pages may display bounded-stale price and availability; checkout must
re-read authoritative price, discounts, and inventory.

## RSC boundary

Fetch and format product/collection data in server components so it ships no
client JavaScript. Place `"use client"` at the smallest interaction boundary—such
as Add to cart—so stateful behavior does not pull the whole product page into the
browser bundle.

## Measurement

Track LCP, p95 response latency, cache-hit rate, and origin requests for every
catalog rendering change. The committed k6 baseline begins in Sprint 05; until
then, route builds and sizes are evidence of strategy wiring, not performance claims.
