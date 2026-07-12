# Sprint 04 — Browse & Search v1 (Postgres FTS)

**Branch:** `sprint-04/browse-search` · **Size:** L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** Buyers find products: faceted browsing (filter by option, price, collection), full-text search over the catalog with Postgres FTS, sorting, and pagination. Built deliberately on FTS so S9 can hit its limits and adopt a real search engine — the recurring "until it hurts, then adopt" arc.

## A — Issues
1. `Faceted browse: filter by options/price/availability/collection; facet counts`
2. `Full-text search: Postgres FTS over product title/description/tags`
3. `Sorting (price, relevance, newness) + pagination`
4. `Search/browse UI on the storefront`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(db): product tsvector (weighted title>tags>description) + GIN index` | 🔗 Pulse S11 / Harbor S8 FTS lessons |
| 2 | `feat(api): search endpoint — FTS query, ranking, snippets, pagination` | |
| 3 | `feat(api): faceted browse — filters compile from a closed AST; facet counts via aggregation` | 🔗 the AST reuse; facet counts are GROUP BYs (the count-with-filters problem — expensive, foreshadows S9/caching) |
| 4 | `feat(api): sorting + cursor pagination (fast-forward)` | |
| 5 | `feat(storefront): search results + faceted PLP (filters update URL, results, counts)` | filters URL-synced (🔗 Tracer S3 pattern) |
| 6 | `feat(storefront): search-as-you-type (debounced) + no-results handling` | |
| 7 | `test: FTS ranking fixtures, facet count correctness, filter combinations` | |
| 8 | `docs: ADR-0005 FTS now, engine later (with the trigger conditions); curriculum note` | the ADR *names* what will push us to Typesense (S9): facet performance at scale, typo tolerance, relevance tuning |
| 9 | `feat(worker): keep tsvector updated on product change` | |

## C — Review order
FTS setup (1) → faceted browse + counts (3, note the cost) → the ADR naming the engine-adoption triggers (8).

## D — Teaching comments (~9)
- weighted tsvector — 🔗 the FTS lessons carry over; title matches rank above description; the learner's third FTS implementation should be fast
- facet counts are expensive — ⚠️ "show me how many products match each filter *given the other filters*" is a combinatorial aggregation; fine at 50 products, painful at 50k — this line is why S9 exists (foreshadowed, not yet felt)
- filter AST + facets — 📘 facets and filters are two views of the same predicate space; the AST drives both the WHERE and the GROUP BY
- FTS limits named — 📘 the ADR is honest about what FTS *can't* do well: typo tolerance, synonym handling, relevance tuning, fast faceting at scale — naming the limits now makes S9's adoption evidence-based
- search-as-you-type — 📘 debounce + cancel-in-flight (🔗 the debounce lessons); every keystroke hitting FTS is a load problem waiting for S9
- URL-synced facets — 🔗 shareable filtered URLs as a feature (Tracer S3); SEO-relevant for storefronts

## E — Debate
**"Facet counts: compute live vs precompute vs approximate?"** Live: accurate, expensive (a GROUP BY per facet per query). Precompute: fast, stale under inventory/catalog changes. Approximate: fast, "~50+ results" is often fine. **Resolution:** live for v1 (catalog is small), with the ADR flagging that faceting is the #1 driver toward a search engine (Typesense does faceting natively and fast). Lesson: *faceted search is deceptively expensive; FTS handles it until it doesn't, and faceting performance is usually what forces the search-engine adoption* (setting up S9 with a measured trigger).

## F/G — Close
- Squash: `feat(sprint-04): browse & search v1 (Postgres FTS) (closes #…)`
- **Lab:** the learner scales the seed to 50k products and measures facet-count query time — feeling the FTS limit that S9 will resolve (a "measure the pain" lab).
- Recap idea: *FTS gets you real search cheaply; faceting at scale is the wall you'll hit, and the ADR should name it before you do.*
