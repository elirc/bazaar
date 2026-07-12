# Sprint 12 Read-Path Audit

Date: 2026-07-12. This is a local contract/fixture audit; no production database
or CDN was available, so values are not presented as production latency.

## Ranked findings

| Priority | Path | 50-item fixture before | Budget | Finding |
|---|---|---:|---:|---|
| P1 | Cart price reload | 50 price queries | 2 queries | N+1 from Sprint 5 |
| P1 | Browse/order lookup | no composite query indexes | indexed plan | avoid full scans at scale |
| P2 | Deploy hot set | 0% initial cache hit rate | preloaded top 50 | cold-start burst risk |
| P2 | Product payload | demo page is text-only | < 40 kB route JS | already below budget |
| P3 | Search projection | one batch projection read | <= 2 queries | no sibling N+1 observed |

The Sprint 9 pure 50k-document projection baseline was p50 41.37 ms and p95
78.65 ms with zero typo hits; it remains a CPU-only reference, not a Typesense
or Postgres measurement. Sprint 12 focuses first on the unambiguous 50-to-1
query-count defect because query count is deterministic across hardware.

## Proof plan

1. Replace per-line price reads with one `findPricesCents(ids)` call.
2. Guard 1, 10, and 50-line carts at exactly one price query.
3. Add indexes with the expected access predicates documented beside them.
4. Warm only the traffic-ranked head and assert a >= 90% synthetic hit rate.
5. Fail CI when deterministic p95 or hit-rate budgets regress.

## Sibling sweep

A source sweep for reads nested inside line/order/collection/search loops found the
known cart lookup only. Order-list child hydration now has an explicit two-query
batch port (lines and fulfillments in parallel) plus a reusable read-count budget.
Collections use one in-memory rule pass over an already-loaded projection; search
uses the engine's batch projection contract. No latency improvement is claimed
for those paths until production-cardinality query logs are available.
