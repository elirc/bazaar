# Sprint 06 — Caching Deep-Dive: Invalidation & Stampede

**Branch:** `sprint-06/caching-invalidation` · **Size:** L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** Caching done right, addressing "the two hard things": tag-based invalidation (a price change busts exactly the pages that show it — harvesting the stale-price flaw), stampede protection (single-flight/SWR — harvesting the thundering-herd flaw), and a coherent multi-layer cache strategy (CDN → ISR → Redis → DB).

## A — Issues
1. `Tag-based cache invalidation: entities tagged, mutations bust dependent cache keys + ISR paths`
2. `Stampede protection: single-flight locks + stale-while-revalidate`
3. `Multi-layer cache coherence (CDN/ISR/Redis/DB) + a cache-key/tag convention`
4. `Cache observability: hit rate, invalidation events`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(cache): tag system — cache entries + ISR pages tagged by entity (product:123, collection:45)` | |
| 2 | `feat(api): mutation → invalidation — a product/price change busts product:123 tags + revalidates ISR paths` | **harvests flaw #1**, ledger quoted: the stale-price problem from S3; now a price edit invalidates exactly the pages showing it; stale-price test goes green |
| 3 | `feat(cache): single-flight — concurrent misses for one key: one recompute, others await` | **harvests flaw #3**, ledger quoted: the stampede; distributed lock (Redis) so a hot product's expiry sends one query, not a herd |
| 4 | `feat(cache): stale-while-revalidate — serve stale instantly, refresh in background` | SWR: buyers never wait for a cold recompute; staleness bounded and stated |
| 5 | `feat(cache): cache-key + tag conventions (documented) + layered read (Redis → DB)` | the convention doc: how keys are named, what tags attach, invalidation ownership |
| 6 | `feat(obs): cache metrics — hit rate per layer, invalidation event log, key cardinality` | 🔗 you can't tune what you don't measure |
| 7 | `test: invalidation correctness (price change → page fresh); stampede (N concurrent misses → 1 DB query); SWR behavior` | |
| 8 | `docs: ADR-0006 multi-layer caching + invalidation strategy; curriculum note` | the "two hard things in CS" essay, applied |

## C — Review order
Tag invalidation (1–2, the flaw harvest) → single-flight (3) → SWR (4) → the layered strategy (5).

## D — Teaching comments (~10)
- tag-based invalidation — 📘 the precise answer to flaw #1: time-based revalidation (S3) is a blunt floor; tags let a mutation invalidate *exactly* the cached things that depend on it; the dependency graph (product → its pages, its collections) is the design
- invalidation ownership — 🔍 review-lens: who busts the cache? the write path, transactionally-ish (after commit); a mutation that forgets to invalidate is a stale-data bug — the discipline is "every write declares what it invalidates"
- single-flight — 📘 the stampede (flaw #3): cache expiry + high traffic = every request recomputes simultaneously, crushing the DB; single-flight elects one recomputer, others wait; 🔗 Pulse S12's stampede lesson, storefront-shaped
- SWR — 📘 stale-while-revalidate: serve the stale value *now*, refresh behind the scenes; buyers get instant pages, freshness catches up; the staleness window is a stated tolerance (two-audience rule)
- layered coherence — ⚠️ four cache layers (CDN, ISR, Redis, DB) can disagree; the invalidation must cascade or the top layer serves stale forever; the convention doc prevents "which layer is lying?"
- cache metrics — 🔗 hit rate per layer is the tuning signal; a layer with a low hit rate is dead weight

## E — Debate
**"Invalidation: event-based (bust on write) vs TTL-only vs both?"** TTL-only: simple, but stale within the window (flaw #1). Event-only: precise, but a missed invalidation = permanent staleness. Both: TTL as a safety net for missed events, events for precision. **Resolution:** both — event-based invalidation for correctness, TTL as the backstop for anything the events miss (🔗 the exact resolution as Pulse S12). Lesson: *invalidate on events for freshness, keep a TTL so a forgotten invalidation self-heals — belt and suspenders is correct for caches.*

## F/G — Close
- Squash: `feat(sprint-06): tag invalidation, stampede protection, SWR (closes #…)`
- **Lab:** the learner drives concurrent traffic at a product, expires its cache mid-load, and observes single-flight collapse the herd to one query; then removes the lock and watches the DB spike.
- Ledger: flaws #1, #3 closed.
- Recap idea: *caching is naming things and invalidating them — tags for precision, TTL for safety, single-flight so expiry doesn't become a stampede.*
