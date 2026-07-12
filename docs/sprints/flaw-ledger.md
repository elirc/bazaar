# Bazaar Flaw Ledger (author-private until Sprint 13 recap)

| # | Planted in | What | Where | Harvested in | Status |
|---|-----------|------|-------|--------------|--------|
| 1 | S03 | Product page cached with no tag/dependency tracking — a price change doesn't invalidate the cached page | storefront cache | S06 (tag-based invalidation; stale-price test) | HARVESTED S06 |
| 2 | S05 | Cart totals recomputed on read with N+1 variant/price lookups | cart service | S12 (batch load + N+1 harvest; before/after) | PLANTED S05 |
| 3 | S05 | No cache stampede protection — a popular product's cache expiry sends a thundering herd to the DB | cache layer | S06 (single-flight/SWR) + S13 flash-sale evidence | HARVESTED S06 |
| 4 | S07 | Inventory decrement reads-then-writes without a lock/atomic guard (the deliberate oversell seed for the flagship arc) | inventory service | S07 itself (in-PR arc: the whole sprint fixes it) — plus S13 contention proof | planned |
| 5 | S10 | Discount stacking has no combination guard — codes stack multiplicatively into negative/absurd totals | discount engine | S13 (abuse probe; stacking rules + floor) | planned |

**In-PR arcs (planted and fixed inside one PR by design):**
S07 oversell under concurrency → reservation + atomic decrement (the flagship's core arc) · S08 double-submit checkout → idempotency key charges once · S08 payment webhook replay → dedupe (🔗 Meridian S9) · S09 index/DB drift → reconciliation.

**Rules:** never fix a ledger flaw silently; harvesting commits quote the ledger row and flip Status.
