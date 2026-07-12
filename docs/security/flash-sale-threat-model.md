# Flash-Sale Threat Model

## Assets and trust boundaries

Money, inventory, customer orders, promotion limits, and merchant secrets are the
assets. Browser prices, totals, identities, headers, and retry behavior are
untrusted. Catalog/inventory reloads, atomic database claims, provider signatures,
and server-issued identities form the authoritative boundary.

## Three-way collision

A crowd reads a possibly stale “in stock” projection, races for one hot inventory
row, and retries checkout when responses slow. Single-flight and hot-set warming
protect reads; only atomic reservation decides winners; one idempotency key maps
retries to one order and charge. Correctness is tested separately from throughput.

## Abuse controls

- Promotions deny combinations unless every rule opts in; totals floor at zero.
- Usage-limited offers require a stable customer identity and an atomic claim.
- Checkout reloads price and inventory and ignores client totals.
- Payment webhooks sign timestamp plus raw bytes, expire after five minutes, and
  atomically claim event IDs.
- Cache keys use allowlisted dimensions; customer lookups use opaque responses.
- Token buckets slow checkout, validation, and cart automation.

## Waiting-room trigger

Real-time atomic decrement remains the default. Introduce a signed, FIFO virtual
waiting room only when a production-like drill shows sustained p95 above 500 ms or
database lock wait above 100 ms for five minutes while correctness still holds.
That is a capacity decision, not a substitute for atomicity.
