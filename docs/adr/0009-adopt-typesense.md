# ADR-0009: Adopt Typesense with Postgres FTS Fallback

- Status: Accepted
- Date: 2026-07-12

## Decision

Adopt a Typesense-shaped engine for typo tolerance, native faceting, synonyms,
pinning, and relevance controls. The reproduced 50k pure projection stayed below
the latency trigger (78.65ms p95) but returned zero results for a transposed query;
product requirements—not an unproven speed claim—trigger adoption.

Postgres remains catalog truth and FTS outage fallback. Product events upsert the
index quickly; periodic reconciliation compares every derived document and repairs
drift. Drift count is observable. Typesense clients belong only in runtime wiring.

## Consequences

Search becomes eventually consistent and operationally heavier. Fallback keeps
the store discoverable, while reconciliation makes missed events self-healing.
Elasticsearch remains a future trigger for substantially more complex scale/analysis.
