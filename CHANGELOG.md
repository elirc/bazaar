# Changelog

## 1.0.0 — 2026-07-12

- Built buyer storefront and merchant admin over explicit consistency policies.
- Added structured catalog, variants, collections, cart, search, and promotions.
- Added tag-aware layered caching, single-flight/SWR, hot-set and trend warming.
- Added atomic inventory reservations, idempotent checkout/payment/refund flows,
  partial fulfillment, and signed replay-safe merchant/payment webhooks.
- Added Typesense-shaped search projection with reconciliation and FTS fallback.
- Added performance/security gates, flash-sale proofs, rate limits, and threat model.
- Added axe-gated accessibility, locale routing, true buyer-currency checkout, and SEO.
- Added commerce tracing, dashboards, inventory drift alarms, checkout SLOs, graceful
  degradation, restore contracts, incident runbooks, and Black Friday rehearsal.

All five deliberately planted curriculum flaws are harvested and documented in
`docs/sprints/flaw-ledger.md`.
