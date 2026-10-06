# Sprint 09: Search Engine and Indexer

## Objectives

- Adopt an engine from measured capability gaps.
- Treat the index as a derived projection.
- Combine event updates with reconciliation.
- Degrade to the known FTS baseline.

## Review before reveal

Read the load report, red drift test, reconciler fix, projection mapping, engine
contract, fallback test, merchandising UI, and ADR-0009.

## Debate captured

Elasticsearch is powerful and operationally heavy; Meilisearch has excellent DX;
Typesense offers the needed typo/facet controls with the lightest current footprint.
Choose the lightest engine that clears measured requirements.

## Exercises

1. Kill the event indexer, mutate products, observe drift, then reconcile.
2. Make the engine throw and confirm FTS results remain available.
3. Add a synonym and pinned product fixture.
4. Run a real Typesense lab before making latency claims.

## Ground truth

- Engine contract and FTS fallback: `packages/search/src/index.ts`; API seam: `apps/api/src/search-service.ts`; the event indexer and reconciler of exercise 1: `apps/worker/src/catalog-indexer.ts` / `catalog-indexer.test.ts`; decision record ADR-0009.
- **Check**: `pnpm --filter @bazaar/worker test catalog-indexer`; the drift-and-reconcile lab is on branch `lab/sprint-09`.
