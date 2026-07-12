# Bazaar Course Retrospective

## Two audiences, one system

The buyer storefront optimizes bounded-stale speed; the merchant/admin and money
paths optimize freshness and explicit consistency. That split shaped cache policy,
rendering, metrics, and incident response without duplicating business truth.

## Invariants earned

- Sold units never exceed stock; failed holds compensate; drift is reconciled.
- One checkout idempotency key creates one order and provider charge.
- Prices and currency are server-authoritative; the amount shown is charged.
- Promotion combinations deny by default and totals never fall below zero.
- Payment and merchant webhooks are signed, timestamped/retried, and deduplicated.
- Search is a derived projection reconciled from database truth with FTS fallback.

## Evolution and planted flaws

Postgres FTS established an honest baseline before a Typesense-shaped engine was
adopted from measured gaps. Five planned flaws taught dependency-aware invalidation,
N+1 batching, stampede collapse, atomic inventory, and discount abuse. Every ledger
row is harvested; S13 re-proved cache/inventory under 10,000 local attempts.

## What the final drill changed

Correctness held while payments degraded, but a newly trending product missed the
deploy hot set. The blameless action added per-key acceleration warming with cooldown.
The exercise also clarified an evidence boundary: local ports prove invariants;
staging infrastructure is required for latency, lock, and autoscaling claims.

## v2 directions

Multi-region read projections with one inventory authority, a versioned headless
commerce API, B2B price lists/approval workflows, translated merchant content, local
payment methods, jurisdictional tax, and a waiting room only after its measured trigger.
