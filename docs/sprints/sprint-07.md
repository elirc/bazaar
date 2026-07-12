# Sprint 07 — Inventory Consistency (Flagship)

**Branch:** `sprint-07/inventory-consistency` · **Size:** XL · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** The flagship: never oversell. Inventory reservations with TTL holds, atomic decrements that survive concurrency, multi-location stock, and the reconciliation of the cached storefront's "in stock" against the consistent truth. The whole sprint is the arc that fixes the deliberately-planted oversell (flaw #4).

## A — Issues
1. `InventoryItem: onHand, reserved, per-location; available = onHand - reserved`
2. `Reservations: cart/checkout holds with TTL; release on expiry/abandonment`
3. `Atomic decrement / oversell prevention under concurrency`
4. `Storefront availability: cached "in stock" reconciled with truth at checkout`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(db): InventoryItem (onHand, reserved, location); available derived` | |
| 2 | `feat(api): decrement inventory on order — [naive read-then-write]` | **[flaw #4, the flagship seed]** read available, check, write — the textbook race |
| 3 | `test(api): concurrent purchases of the last unit → BOTH succeed, oversold, FAILS` | the damning test: two buyers, one item, both get it; the retail incident that makes the news |
| 4 | `fix(api): atomic conditional decrement — UPDATE … SET reserved=reserved+1 WHERE available>=1` | affected-rows check; the DB arbitrates; 🔗 the optimistic-precondition pattern from every prior course (Tracer approval, Relay counter), highest-stakes appearance |
| 5 | `feat(api): reservations — hold stock on add-to-cart/checkout with a TTL; release job on expiry` | reserved ≠ sold; holds prevent two carts racing to checkout on the last unit; TTL release (abandoned carts free stock) |
| 6 | `feat(worker): reservation expiry sweep — release holds idempotently` | 🔗 Meridian S10 scheduled-job discipline; idempotent release |
| 7 | `feat(api): multi-location inventory — allocate across locations, per-location available` | |
| 8 | `feat(storefront): availability display reconciled — cached "in stock" is a hint; truth is checked at reservation/checkout` | ⚠️ the two-audience collision: the storefront *caches* availability (fast, slightly stale), but the *reservation* is transactional (truth); "in stock" on the PDP can lie for seconds, and checkout is where it's made honest — this is the course's central tension, made concrete |
| 9 | `test(chaos): N concurrent buyers, M stock → exactly M succeed, N-M get clean "sold out"` | the property: sum of successful purchases never exceeds stock, under any concurrency |
| 10 | `test(api): reservation TTL release; multi-location allocation; oversell property holds` | |
| 11 | `docs: ADR-0007 inventory consistency model; curriculum note` | |

## C — Review order
The oversell arc (2→3→4) → reservations + TTL (5) → **the storefront reconciliation (8): cached hint vs transactional truth** → the concurrency property test (9).

## D — Teaching comments (~13)
- the oversell race — 📘 the canonical distributed-systems bug in retail costume: read-check-write on inventory under concurrency oversells; two customers both see "1 left," both buy; 🔗 the learner has seen this exact shape five times (Tracer seq, Relay counter, Pulse merge…) — inventory is where it costs real money and real reputation
- atomic conditional decrement — 📘 `UPDATE ... WHERE available >= qty` + affected-rows check: the database arbitrates atomically; no application-level lock needed; the loser gets a clean rejection, not a corrupted count — the definitive version of a pattern the whole curriculum built toward
- reserved vs sold — 📘 reservations model the gap between "in my cart / checking out" and "purchased"; a TTL hold prevents the last-unit race *before* checkout while not permanently locking stock for abandoned carts
- reservation TTL — ⚠️ holds must expire or abandoned carts starve inventory forever; the sweep is idempotent (releasing an already-released hold is a no-op)
- **the storefront reconciliation** — 📘 the two-audience thesis crystallized: the storefront caches availability for speed (a buyer sees "in stock," possibly seconds stale); the *reservation* at add-to-cart/checkout is transactional truth; the cache is allowed to lie briefly, checkout is not — designing which layer is authoritative for which decision is the whole art
- oversell property test — 🔍 review-lens: "successful purchases ≤ stock, always" is an invariant, chaos-tested under concurrency (🔗 the property-testing discipline from Tracer/Folio convergence); consistency invariants are tested, not hoped (the Bazaar rule)
- multi-location allocation — 📘 which warehouse fills the order; available is per-location; allocation strategy (nearest, most-stock) as a policy

## E — Debate
**"Oversell prevention: DB atomic decrement vs Redis counter vs reservation queue?"** Redis counter: fast, but a second source of truth that can drift from the DB (and Redis eviction loses it). Reservation queue: serializes purchases, adds latency. DB atomic: the count and the constraint live together, transactional, correct. **Resolution:** DB atomic conditional decrement as the source of truth + short-TTL reservations for the cart→checkout window; Redis caches *display* availability only, never authorizes a sale. Lesson: *inventory truth lives in one place with the constraint that protects it — never let a cache authorize a decrement* (the sharpest statement of the two-audience rule).

## F/G — Close
- Squash: `feat(sprint-07): inventory consistency — reservations, oversell prevention (closes #…)`
- **Lab (break-it):** the learner drives concurrent buyers at limited stock and confirms zero oversell; then reverts to the naive decrement (commit 2) and watches it oversell under load — feeling the flagship arc from both sides.
- Ledger: flaw #4 closed (harvested in-sprint by design; the flagship arc *is* the harvest); S13 re-proves it under flash-sale contention.
- Recap idea: *never let a cache authorize a sale — inventory truth is one atomic decrement, and reservations bridge the gap to checkout.*
