# Bazaar — E-Commerce Platform (Shopify Lite)

## Project Spec & 15-Sprint Upskilling Curriculum (Course 7)

**Version:** 1.0 · **Date:** 2026-07-09 · **Folder:** `bazaar/` (splits into its own repo later)

---

## 1. Purpose

Seventh course. Same model (AI authors everything; junior predicts, reviews-before-reveal, runs labs, co-authors from S8).

**What this course uniquely teaches:**

- **Read-heavy caching at scale** — the storefront is 99% reads; CDN/ISR, Redis, cache tag invalidation, the "correct AND fast" tension
- **Inventory consistency under contention** — overselling is the canonical distributed-systems bug wearing a retail hat
- **Cart & checkout idempotency** — money + retries + double-submits; the highest-stakes correctness surface
- **Catalog search that scales** — Postgres FTS taken to its limits, then Typesense/Elastic-shaped thinking with an indexer pipeline

**Signature teaching arc:** the two-audience split. The **storefront** (buyers) is read-heavy, latency-critical, cache-everything; the **admin** (merchants) is write-heavy, consistency-critical, cache-nothing. Same data, opposite requirements — and the course is about serving both from one system without letting the cache lie to buyers or the consistency slow merchants. A **flash-sale load drill** (S13) is where caching, inventory contention, and checkout idempotency collide under fire.

> Functional clone of the Shopify category (catalog, cart, checkout, inventory, orders, storefront) — no branding or assets. Product name: **Bazaar**.

## 2. Product Overview

**Personas:** Merchant (admin: products, inventory, orders) · Buyer (storefront: browse, cart, checkout) · Staff (limited admin) · **the flash-sale crowd** (the load).

**Core domains:** catalog (products, variants, collections) → storefront (read-optimized, cached) → search & browse (FTS → search engine) → cart → checkout & payments (idempotent) → inventory (reservations, consistency) → orders & fulfillment → discounts/promotions → admin analytics.

## 3. Tech Stack

| Layer | Choice | Teaching rationale |
|---|---|---|
| Language / repo | TypeScript strict · pnpm + Turborepo | carried |
| Storefront | **Next.js (ISR/SSG + RSC)** | the read-heavy, cache-everything surface; ISR is the lesson |
| Admin | Next.js (dynamic, auth'd) | the write-heavy, consistency surface |
| API | Fastify (+ Next route handlers for storefront BFF) | |
| DB | PostgreSQL + Prisma | inventory + orders are OLTP; consistency matters |
| Cache | **Redis** (multi-layer: CDN → ISR → Redis → DB) + tag-based invalidation | the caching curriculum |
| Search | **Postgres FTS (S4) → Typesense (S9)** with an indexer pipeline | FTS-until-it-hurts, then adopt (the recurring thesis) |
| Queue/jobs | BullMQ + Redis | order processing, indexing, webhooks |
| Payments | mock payment provider (🔗 Meridian S9 / Relay farm), idempotent, webhooks | |
| Load testing | k6 (from S5, heavy in S13) | this course measures caching + contention |
| CI/CD, deploy, observability | carried; cache-hit-rate + inventory-accuracy metrics | |

**Layout:** `apps/{storefront,admin,api,worker}`, `packages/{db,shared,search,cache,config}`, `docs/{adr,curriculum,sprints,runbooks,audits}`.

## 4. Curriculum deltas

1. **Two-audience discipline:** every feature is examined from both the cached-storefront and consistent-admin angles; the ADR for each caching decision names its staleness tolerance.
2. **Consistency invariants are tested:** inventory-never-oversells and checkout-charges-once are property/chaos-tested, not hoped.
3. **Numbers for caching:** cache-hit rate, p95, and origin load are reported for storefront PRs (🔗 Pulse's "numbers" rule, caching-shaped).
4. **Labs after S4, S7, S9, S12, S13** — including flash-sale break-it drills.

### Competency additions

| Competency | Taught in |
|---|---|
| ISR/SSG/RSC rendering strategies | S3, S5 |
| Multi-layer caching + tag invalidation | S5, S6, S12 |
| Cache stampede, staleness, SWR | S6, S12 |
| Inventory reservations & oversell prevention | S7 |
| Cart/checkout idempotency | S8 |
| Payment integration & reconciliation | S8 |
| Search scaling: FTS → engine + indexer | S4, S9 |
| Discounts/promotions engine | S10 |
| Order state machine & fulfillment | S8, S11 |
| Load testing & capacity | S5, S13 |

## 5. Domain Model (reference)

```
Store ─┬─ Product ─┬─ Variant (sku, price, options) ── InventoryItem (onHand, reserved, per-location)
       │           └─ Collection (manual/smart) · ProductMedia
       ├─ Cart ── CartLine (variant, qty, price snapshot)
       ├─ Order ─┬─ OrderLine · Payment (idempotent) · Fulfillment
       │         └─ (state machine: pending → paid → fulfilled → …)
       ├─ InventoryReservation (cart/checkout holds, TTL)
       ├─ Discount / PriceRule (codes, automatic, conditions)
       ├─ Customer · Address
       └─ SearchIndex (FTS → Typesense projection)
```

## 6. Sprint map

| # | Sprint | Phase | Size | Headline |
|---|---|---|---|---|
| 1 | Foundation & skeleton (product → storefront page) | MVP | S | Fast-forward; storefront/admin split |
| 2 | Catalog: products, variants, collections | MVP | L | Variant modeling, options, media |
| 3 | Storefront rendering (ISR/RSC) | MVP | L | SSG/ISR, product pages, the read surface |
| 4 | Browse & search v1 (Postgres FTS) | MVP | L | Faceted browse, FTS, filters |
| 5 | Cart + first caching layer, deploy → `v0.5.0` | MVP | M/L | Cart, Redis cache, ISR revalidation, k6 baseline |
| 6 | Caching deep-dive: invalidation & stampede | Full | L | Tag invalidation, SWR, stampede locks |
| 7 | Inventory consistency (flagship) | Full | XL | Reservations, oversell prevention under contention |
| 8 | Checkout & payments idempotency (dialogue) | Full | L | Idempotent checkout, mock payments, order state |
| 9 | Search at scale: Typesense + indexer | Full | L | FTS-until-it-hurts → adopt an engine |
| 10 | Discounts & promotions engine | Full | M/L | Price rules, codes, stacking, abuse |
| 11 | Orders, fulfillment & webhooks | Full | M/L | Order lifecycle, fulfillment, merchant webhooks |
| 12 | Performance: caching under load | Full | L | Multi-layer tuning, cache CI, N+1 harvest |
| 13 | Hardening: flash-sale drill & security | Full | L | Contention + cache + idempotency under fire; payments security |
| 14 | Storefront polish: a11y, i18n, SEO | Full | M/L | Accessibility, multi-currency/locale, SEO |
| 15 | Production readiness → `v1.0.0` | Full | L | Cache/inventory observability, Black-Friday drill, runbooks |

## 7. Open questions (decide before Sprint 1)

1. Typesense (self-host container) vs Meilisearch vs Elastic for S9? (Spec assumes Typesense: light, fast, good DX.)
2. CDN layer in prod (Vercel/Cloudflare) or model it with Redis only? (Spec assumes ISR + Redis, CDN documented.)
3. Multi-location inventory in scope or single-location for v1? (Spec: model per-location, default single.)
