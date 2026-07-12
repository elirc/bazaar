# Sprint 01 — Foundation: Product → Storefront Skeleton

**Branch:** `sprint-01/foundation` · **Size:** S · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** Fast-forward scaffold with the course's defining structural choice: **two frontends** — a read-optimized storefront and a consistency-optimized admin — from day one. Walking skeleton: create a product in admin, see it on a storefront page.

## A — Issues
1. `Monorepo scaffold: apps/{storefront,admin,api,worker}, packages/{db,shared,config}`
2. `Walking skeleton: admin creates a Product → storefront renders its page`
3. `CI + governance (fast-forward)`
4. `ADR-0001 storefront/admin split; ADR-0002 the caching roadmap (read-heavy vs write-heavy)`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `chore: monorepo scaffold (fast-forward, compressed)` | |
| 2 | `feat(db): Product (minimal) + Store` | |
| 3 | `feat(api): product CRUD (admin) + product read (storefront BFF)` | two read paths already: admin (fresh) vs storefront (will be cached) |
| 4 | `feat(admin): product create/list (dynamic, auth'd)` | |
| 5 | `feat(storefront): product page (Next, static-leaning)` | no caching yet — that's S3/S5; but the *rendering strategy* seam is here |
| 6 | `feat(worker): scaffold (order/index jobs land later)` | |
| 7 | `test + ci (fast-forward)` | |
| 8 | `docs: ADR-0001 storefront/admin split; ADR-0002 caching roadmap` | **the course thesis**: storefront is read-heavy/cache-everything/staleness-tolerant; admin is write-heavy/consistency-critical/cache-nothing; same data, opposite requirements |
| 9 | `docs: curriculum note sprint 01` | |

## C — Review order
ADR-0002 (caching roadmap) → the two read paths (3) → the two apps.

## D — Teaching comments (~7)
- storefront/admin split — 📘 the whole course in one decision: buyers hammer reads and tolerate a few seconds of staleness; merchants need their edits reflected *now*; separating the apps lets each optimize for its opposite requirement
- two read paths — 🔍 review-lens: admin reads hit the DB fresh; storefront reads will hit a cache (S5+); designing them as separate services from commit 3 means caching the storefront never risks staling the admin
- rendering seam — 📘 the storefront page is built so its rendering strategy (static/ISR/dynamic) is a knob, not a rewrite (S3 turns it); leave the seam
- caching roadmap ADR — 📘 like Pulse's "Postgres-until-it-breaks," this names the plan: start simple, add cache layers with measured need, and always state staleness tolerance per surface
- worker from day one — 🔗 order processing, search indexing, and webhooks all need it; scaffolding empty now (Pulse/Relay pattern)

## E — Debate
**"One Next app with role-based routing vs separate storefront and admin apps?"** One app: shared code, one deploy. Two apps: independent scaling (the storefront scales for Black Friday, the admin doesn't), independent caching policy, smaller blast radius. **Resolution:** two apps — the storefront and admin have opposite performance/consistency profiles and wildly different traffic; coupling them means the admin's dynamic rendering can't share the storefront's aggressive caching. Lesson: *split systems by their requirements, not their data — same products, but reads and writes want different architectures.*

## F/G — Close
- Squash: `feat(sprint-01): foundation — storefront/admin split (closes #…)`
- Recap idea: *e-commerce is two systems sharing a database — a read-optimized shop and a consistency-optimized back office.*
