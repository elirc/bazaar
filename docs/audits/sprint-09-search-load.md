# Sprint 09 Search Adoption Report

## Reproduced baseline

The available local environment has no Postgres service, so this run measures the
same pure 50k-document weighted-search + two-facet projection used by DB-less CI;
it is not presented as a PostgreSQL query benchmark.

- 50,000 documents, 30 runs
- p50: 41.37ms
- p95: 78.65ms
- transposed query `canavs`: 0 hits

The latency result does not cross ADR-0005's 150ms faceting threshold. Adoption is
instead triggered by two product requirements the baseline cannot satisfy:
typo-tolerant discovery and merchant-controlled synonyms/pinning/relevance. A
dedicated engine also isolates interactive search load from OLTP. Typesense is the
lightest option with these capabilities; Postgres FTS remains outage fallback.

## Honest comparison contract

Sprint 09 must preserve ranking/facet fixtures, expose index drift, reconcile from
Postgres truth, and degrade to FTS. Engine latency claims require a real Typesense
lab and are not asserted in infrastructure-free CI.
