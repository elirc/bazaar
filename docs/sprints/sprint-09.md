# Sprint 09 — Search at Scale: Typesense + Indexer

**Branch:** `sprint-09/search-engine` · **Size:** L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** FTS hit its wall (S4's faceting, typo tolerance, relevance) — now adopt a real search engine. Typesense with an indexer pipeline that keeps it in sync with the catalog, typo-tolerant instant search, fast faceting, and merchandising controls. The recurring "build-on-the-simple-thing-until-it-hurts, then adopt knowingly" thesis, search-shaped.

## A — Issues
1. `Typesense integration: schema, product indexing, search API`
2. `Indexer pipeline: catalog changes → index updates (event-driven + reconciliation)`
3. `Instant search: typo tolerance, fast faceting, relevance/merchandising tuning`
4. `Migration: storefront search FTS → Typesense (with fallback)`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `docs: search load report — FTS facet/typo/relevance limits at 50k products (from the S4 lab)` | the evidence: FTS faceting p95, no typo tolerance, hard-to-tune relevance — the ADR-0005 triggers, now measured |
| 2 | `feat(search): Typesense schema + product document mapping` | what fields index, facet, and rank; the document is a *projection* of the product (🔗 Folio's projection lesson) |
| 3 | `feat(worker): indexer — product/variant/inventory change → index upsert (event-driven)` | **[in-PR arc]** index drifts from DB when an event is missed |
| 4 | `test(search): induce drift (skip an event) → index stale, FAILS` | the eventual-consistency reality of a secondary index |
| 5 | `fix(worker): reconciliation sweep — periodic full/delta resync; drift metric` | 🔗 the "webhooks/events + reconciliation poll" law (Meridian S9, Relay S6): the event stream is fast, the sweep is the guarantee |
| 6 | `feat(api): search via Typesense — typo tolerance, faceting, sorting, pagination` | faceting that was expensive in FTS is now native and fast |
| 7 | `feat(admin): merchandising — pinned products, synonyms, relevance weights per collection` | search as a merchant tool, not just an algorithm |
| 8 | `feat(storefront): instant search UI (typo-tolerant, faceted) + FTS fallback if Typesense down` | graceful degradation: search engine down → fall back to FTS (slower, but works) |
| 9 | `test: search relevance fixtures, facet correctness, drift reconciliation, fallback` | |
| 10 | `docs: ADR-0009 adopt Typesense (with FTS as the compared baseline); curriculum note` | 🔗 the ADR reads as a knowing adoption — we built on FTS first and measured its limits |

## C — Review order
The load report (1) → indexer + drift arc (3→4→5) → merchandising (7) → the fallback (8).

## D — Teaching comments (~10)
- adopt-after-measuring — 🔗 the recurring thesis (Pulse→ClickHouse, Folio→Yjs, now →Typesense): we built on Postgres FTS, hit measured limits (faceting, typos, relevance), and *now* adopt — the ADR compares against FTS as the honest baseline; the learner has seen this pattern enough to run it themselves
- index as projection — 📘 the search index is a derived, eventually-consistent projection of the catalog (🔗 Folio S14, Pulse read-paths); the DB is truth, the index is a fast read model
- drift + reconciliation — ⚠️ any secondary index drifts from its source when events are missed (deploys, bugs, outages); event-driven for speed + a reconciliation sweep for the guarantee — the same belt-and-suspenders as payment reconciliation; a drift metric makes the invisible visible
- typo tolerance + faceting — 📘 what the engine buys you that FTS couldn't: typo tolerance, instant faceting, tunable relevance — the specific capabilities that justified the adoption, not "it's faster"
- merchandising — 📘 search is a merchant's revenue lever: pinned products, synonyms, per-collection weights; the algorithm serves the business, and admins need controls
- fallback path — 🔍 review-lens: a search-engine outage must degrade to FTS, not to a broken storefront; the search engine is an *enhancement* over a working baseline (🔗 Harbor's "degrade to humans," retail-shaped)

## E — Debate
**"Search engine: Typesense vs Meilisearch vs Elasticsearch?"** Elastic: powerful, heavy, ops-intensive, overkill here. Meilisearch: great DX, slightly less faceting depth. Typesense: fast, light, excellent faceting + typo tolerance, simple ops. **Resolution:** Typesense for the DX/faceting/ops balance; the ADR notes Elastic's trigger (log-scale catalogs, complex analytics-on-search). Lesson: *adopt the lightest engine that clears your measured bar; "industry standard" (Elastic) is often more operational weight than your actual scale needs.*

## F/G — Close
- Squash: `feat(sprint-09): search at scale — Typesense + indexer (closes #…)`
- **Lab:** the learner deliberately desyncs the index (kills the indexer, mutates products), watches the drift metric climb, then runs reconciliation and confirms convergence — a hands-on eventual-consistency lesson.
- Recap idea: *outgrowing FTS is a measured event, not a hunch — adopt the engine that clears your bar, and never trust a secondary index without a reconciliation sweep.*
