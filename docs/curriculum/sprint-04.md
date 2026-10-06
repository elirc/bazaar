# Sprint 04: Browse and Search v1

## Objectives

- Explain weighted FTS and why GIN supports the read path.
- Keep filters and facets in one closed predicate space.
- Test facet counts under combined filters.
- Name measurable triggers for adopting a search engine.

## Review before reveal

Read the migration, then ranking fixtures, filter AST/facet loop, cursor ordering,
ADR-0005, and finally the URL-synced storefront.

## Debate captured

Live facet counts are correct and simple for the current catalog; precomputation
is faster but stale, and approximation may be acceptable only after the product
defines that UX. We chose live counts now and made faceting p95 the primary engine
adoption trigger.

## Exercises

1. Add 50,000 seeded products and record search/facet p50 and p95.
2. Search misspellings and quantify zero-result queries.
3. Add a new option facet and prove counts respect every other active filter.
4. Compare cursor results while inserting a product between requests.

## Ground truth

- FTS core and filter/facet AST: `packages/search/src/index.ts` with fixtures in `index.test.ts`; engine-adoption triggers are recorded in ADR-0005 and revisited by ADR-0009.
- **Check**: `pnpm --filter @bazaar/search test`; the lab for this sprint lives on branch `lab/sprint-04`.
