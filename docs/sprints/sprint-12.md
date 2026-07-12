# Sprint 12 — Performance: Caching Under Load

**Branch:** `sprint-12/performance` · **Size:** L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** Tune the whole read path for scale: audit-first against the S5 baseline, harvest the cart N+1, optimize multi-layer cache hit rates, add the cache-performance CI gate, and prepare the system for the S13 flash-sale. Numbers on every commit.

## A — Issues
1. `Perf audit vs S5 baseline at scale (findings first)`
2. `Cart N+1 harvest + query optimization`
3. `Cache hit-rate tuning across layers; cache warming for hot paths`
4. `Cache-performance CI gate; DB indexing pass`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `docs: perf audit — storefront + cart + search at scale vs baseline, ranked (P1..P3)` | 🔗 the audit methodology, learner-run; findings from k6 + query logs |
| 2 | `perf(api): cart totals — batch load variants/prices (P1)` | **harvests flaw #2**, ledger quoted; N+1 → single batched query; cart-load p95 before/after |
| 3 | `perf(db): indexing pass — EXPLAIN-driven indexes for browse/search/order queries (P1)` | 🔗 Meridian S13 index methodology; before/after query plans |
| 4 | `perf(cache): hit-rate tuning — cache key granularity, TTL tuning, what to cache vs not (P2)` | the metrics from S6 guide this; a low-hit-rate cache is removed, a hot uncached path is added |
| 5 | `perf(cache): cache warming — pre-warm hot products/collections on deploy + on-demand for trending (P2)` | cold-cache-after-deploy is a stampede risk (S13 will test); warming pre-empts it |
| 6 | `perf(storefront): RSC/payload optimization, image/LCP pass (P2)` | Core Web Vitals as revenue (🔗 Tracer/Meridian frontend perf) |
| 7 | `perf(api): N+1 sweep — grep the pattern across order/collection/search endpoints (P3)` | 🔗 "fixed one N+1, grep for its siblings" (Meridian S13) |
| 8 | `ci: cache-performance gate — k6 smoke asserts hit rate + p95 budgets` | cache regressions fail CI (🔗 the budget-gate pattern) |
| 9 | `test: N+1 regression guards; cache warming; index effectiveness` | |
| 10 | `docs: curriculum note — the caching-under-load playbook` | |

## C — Review order
The audit (1) → cart N+1 harvest (2) → cache tuning + warming (4–5) → the CI gate (8).

## D — Teaching comments (~9)
- audit-first, learner-run — 🔗 the learner runs the measure→rank→fix→prove loop; the AI reviews rigor; sixth course, the methodology is theirs
- cart N+1 — 🔗 flaw #2 harvested: loading each cart line's variant/price separately; batch into one query (a `WHERE variant_id IN (...)` or a join); invisible at 3 lines, a real cost at scale — the classic ORM trap
- cache granularity — 📘 the tuning tradeoff: fine-grained keys (high hit rate per key, more keys, more invalidation) vs coarse (fewer keys, lower hit rate, blunt invalidation); measured per path, not guessed
- cache warming — 📘 a cold cache after deploy sends every request to the DB (a self-inflicted stampede — 🔗 flaw #3's cousin); pre-warming hot paths on deploy pre-empts it; S13's flash-sale will punish an unwarmed cache
- N+1 sweep — 🔍 review-lens: N+1s travel in families; once found in cart, grep the order/collection/search endpoints for the same shape (🔗 Meridian S13)
- cache CI gate — 🔗 the budget-as-CI-check pattern (Tracer S12, Pulse); hit rate and p95 become regression-gated; the S13 drill needs this foundation solid

## E — Debate
**"Cache warming: proactive (pre-warm on deploy) vs reactive (let it fill naturally)?"** Reactive: simple, but the first post-deploy traffic eats cold-cache latency and can stampede. Proactive: smooth, but warming everything is wasteful and slow. **Resolution:** pre-warm the *hot set* (top products/collections by traffic) on deploy, let the long tail fill reactively (protected by S6's single-flight). Lesson: *warm the head, lazy-load the tail — and never deploy a cold cache into a traffic spike* (the direct setup for S13's flash-sale drill).

## F/G — Close
- Squash: `perf(sprint-12): caching under load, N+1 harvest, budget gate (closes #…)`
- **Lab:** the learner runs the k6 suite before/after each optimization and builds the performance-improvement report; then deploys with a cold cache under load to feel why warming matters.
- Ledger: flaw #2 closed.
- Recap idea: *scaling the read path is audit, batch the N+1s, tune hit rates, warm the head — and gate it all in CI before the flash sale hits.*
