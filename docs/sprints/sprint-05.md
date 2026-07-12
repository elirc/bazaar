# Sprint 05 — Cart + First Caching Layer, Deploy → v0.5.0

**Branch:** `sprint-05/cart-caching` · **Size:** M/L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** Ship the MVP: a cart (add/update/remove, price snapshots, guest + logged-in), the first Redis caching layer in front of the storefront reads, deploy, and k6 baseline #1. Two flaws planted (cart N+1, no stampede protection) that S12/S6 harvest.

## A — Issues
1. `Cart: add/update/remove lines, price snapshots, guest (cookie) + customer carts, merge on login`
2. `First caching layer: Redis cache for product/collection reads (storefront)`
3. `ISR on-demand revalidation wiring (partial — full invalidation is S6)`
4. `Deploy + E2E + k6 baseline #1`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(db+api): Cart, CartLine with price snapshot at add-time` | price snapshot: the cart remembers the price when added (price changes don't silently alter the cart — a correctness + trust decision) |
| 2 | `feat(api): cart operations + guest→customer cart merge on login` | 🔗 the identity-merge instinct (Pulse/Harbor), cart-shaped |
| 3 | `feat(api): cart totals — [recomputed on read]` | **[flaw #2]** N+1 variant/price lookups per cart read (harvest S12) |
| 4 | `feat(cache): Redis read-through cache for product/collection queries` | **[flaw #3]** no stampede protection — concurrent misses all hit the DB (harvest S6) |
| 5 | `feat(storefront): cart UI — drawer, line editing, totals; add-to-cart from PDP` | |
| 6 | `feat(api): on-demand ISR revalidation on product publish (partial)` | 🔗 begins to address flaw #1, but tag-based invalidation is S6 |
| 7 | `feat: deploy (4 apps), health, k6 baseline #1` | |
| 8 | `docs: k6 baseline #1 — storefront p95 cold/warm, cache hit rate, cart ops; committed` | the "before" numbers (🔗 Pulse's committed baselines) |
| 9 | `test(e2e): browse → add to cart → cart persists (guest + login merge); curriculum note` | |

## C — Review order
Cart + price snapshot (1) → cart totals N+1 (3) → the Redis cache (4, note no stampede guard) → the baseline (8).

## D — Teaching comments (~9)
- price snapshot — 📘 the cart captures price at add-time; if the merchant changes the price, the cart doesn't silently shift (imagine checkout charging more than shown) — a trust + correctness decision; the price is re-validated at checkout (S8), but never silently mutated in the cart
- guest→customer merge — 🔗 identity merge, retail-shaped; merging carts on login (dedupe lines, sum quantities) with the same care as contact/person merges
- cart totals N+1 — *(silent — flaw #2; loading each line's variant/price separately is invisible at 3 lines, ugly at 50; S12 harvests)*
- read-through cache — 📘 cache-aside/read-through basics (🔗 Meridian S12); but note what's missing: stampede protection (flaw #3) and dependency invalidation (flaw #1) — this cache is naive on purpose
- stampede seed — *(silent — flaw #3; when a hot product's cache expires, every concurrent request misses and hits the DB together; S6 and the S13 flash-sale make it vivid)*
- committed baseline — 🔗 the numbers that S12 improves against; caching without a baseline is faith

## E — Debate
**"Cart storage: Redis (fast, ephemeral) vs Postgres (durable) vs cookie (client)?"** Cookie: no server state, but size limits and no cross-device. Redis: fast, but carts vanish on eviction. Postgres: durable, survives, queryable for abandoned-cart features. **Resolution:** Postgres for the cart (durability + abandoned-cart analytics), with the cart id in a cookie for guests; Redis caches the *product* data the cart displays, not the cart itself. Lesson: *durability requirements decide storage — a cart is a business record (abandoned-cart emails, analytics), not throwaway session state.*

## F/G — Close
- Squash: `feat(sprint-05): cart, first caching layer, deploy (closes #…)`
- **Post-merge:** deploy → demo (browse → cart → persist) → tag **`v0.5.0`** → MVP retro.
- Ledger: flaws #2, #3 recorded.
- Recap idea: *the MVP shops and carts; the caching is deliberately naive, and the baseline numbers are the plot for the next ten sprints.*
