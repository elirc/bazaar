# Bazaar Sprint Playbooks

Execution scripts for the 15-sprint build of **Bazaar** (e-commerce platform — see [SPEC.md](../../SPEC.md)). Course 7; assumes all prior courses.

**Start here:** [00-workflow.md](00-workflow.md) — the ritual plus Bazaar rules (two-audience discipline, tested consistency invariants, caching numbers, flash-sale labs).

| Sprint | Playbook | Headline |
|--------|----------|----------|
| 01 | [sprint-01.md](sprint-01.md) | Foundation: product → storefront skeleton |
| 02 | [sprint-02.md](sprint-02.md) | Catalog: products, variants, collections |
| 03 | [sprint-03.md](sprint-03.md) | Storefront rendering (ISR/RSC) |
| 04 | [sprint-04.md](sprint-04.md) | Browse & search v1 (Postgres FTS) |
| 05 | [sprint-05.md](sprint-05.md) | Cart + first caching, deploy → `v0.5.0` |
| 06 | [sprint-06.md](sprint-06.md) | Caching deep-dive: invalidation & stampede |
| 07 | [sprint-07.md](sprint-07.md) | Inventory consistency (flagship) |
| 08 | [sprint-08.md](sprint-08.md) | Checkout & payments idempotency (dialogue) |
| 09 | [sprint-09.md](sprint-09.md) | Search at scale: Typesense + indexer |
| 10 | [sprint-10.md](sprint-10.md) | Discounts & promotions engine |
| 11 | [sprint-11.md](sprint-11.md) | Orders, fulfillment & webhooks |
| 12 | [sprint-12.md](sprint-12.md) | Performance: caching under load |
| 13 | [sprint-13.md](sprint-13.md) | Hardening: flash-sale drill & security |
| 14 | [sprint-14.md](sprint-14.md) | Storefront polish: a11y, i18n, SEO |
| 15 | [sprint-15.md](sprint-15.md) | Production readiness → `v1.0.0` |

**Arcs to watch:** the two-audience split (cached storefront vs consistent admin, every sprint); FTS-until-it-hurts → Typesense (S4 → S9, the recurring adoption thesis); the oversell/idempotency correctness spine (S7 inventory → S8 checkout → S13 flash-sale, where caching + contention + idempotency collide). Ledger: [flaw-ledger.md](flaw-ledger.md).
