# ADR-0005: Use Postgres FTS Until Measured Limits Demand an Engine

- Status: Accepted
- Date: 2026-07-12

## Decision

Use a weighted `tsvector` and GIN index for catalog search now. Keep filters as a
closed AST and deterministic fixtures so a later engine is compared against an
honest working baseline.

Adopt a dedicated search engine when the 50k-product lab demonstrates one or more:
facet p95 above 150ms, missing typo tolerance that harms discovery, relevance
tuning too costly in SQL, or search load competing with OLTP capacity. Typesense
is the planned lightest option that clears those needs; Postgres remains fallback.

## Consequences

We avoid a second source of truth today. Live facet counts are correct but their
GROUP BY cost will grow. The document projection and reconciliation guarantee will
become explicit if Sprint 09's measurements cross the trigger.
