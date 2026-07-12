# Sprint 04 Lab: Make Postgres FTS Hurt

## Goal

Measure the point where correct live faceting becomes too expensive, without
changing the production branch or pretending a search engine is free.

## Exercise

1. Expand `createCatalogSeed` to 50,000 products with skewed collections/options.
2. Run search terms with 0, 1, 3, and 5 active facets under escalating concurrency.
3. Record result correctness, p50, p95, query plan, rows scanned, and DB CPU.
4. Add misspellings and record zero-result rate; do not “fix” typos in application code.
5. Identify whether the ADR-0005 trigger (facet p95 >150ms, typo/relevance pain, or OLTP contention) fires.

## Break-it question

How many concurrent faceted searches can the shared OLTP database serve before
catalog discovery harms admin writes? Explain why that number—not fashion—should
drive the Sprint 09 Typesense decision.
