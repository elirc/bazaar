# Sprint 08 — Checkout & Payments Idempotency (Dialogue)

**Branch:** `sprint-08/checkout-payments` · **Size:** L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** The highest-stakes correctness surface: checkout that charges exactly once no matter how many times the button is clicked or the request retried, mock payment integration with webhooks, and the order state machine. Dialogue format: **the learner authors the naive checkout**; the AI reviews and hardens. Money + retries + concurrency = the idempotency capstone of the course.

## A — Issues
1. `Checkout: convert cart → order, re-validate price + inventory, take payment`
2. `Idempotency: double-submit / retry charges once`
3. `Mock payment provider integration + webhooks (fast-forward the farm pattern)`
4. `Order state machine: pending → paid → (fulfilled…) / failed`

## B — Commits (J = learner, S = AI review)
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(db): Order, OrderLine, Payment + order state machine` | 🔗 Meridian S4 / Relay S7 state-machine discipline; one write path |
| 2 | `feat(api): checkout — [J] cart → order → charge, straightforward` | **[in-PR arc]** no idempotency; a double-click or retry creates two orders / two charges |
| 3 | `test(api): double-submit checkout → two charges, FAILS` | the money bug that ends careers |
| 4 | `refactor(api): checkout — [S] idempotency key (client-generated) → one order per key; charge once` | 🔗 the idempotency lessons across every course (Meridian payroll, Pulse events, Relay durable runs) converge here on *money*; the AI review walks J's version and applies the pattern |
| 5 | `feat(api): checkout re-validation — price snapshot vs current, inventory reservation confirmed at charge time` | the cart's price snapshot (S5) is re-checked; the reservation (S7) is converted to a decrement; oversell and price-drift both caught at the last moment |
| 6 | `feat(payments): mock provider — charge with idempotency key, async webhooks (HMAC), failure modes` | 🔗 Meridian S9 / Relay farm — the learner has built this before |
| 7 | `feat(api): payment webhook — verify signature, dedupe (replay), advance order state` | **[in-PR arc]** webhook replay → double-advance → dedupe fix; 🔗 the exact Meridian S9 lesson |
| 8 | `feat(api): failure handling — declined payment releases reservation, order → failed, cart preserved` | the unhappy path is the important path in checkout |
| 9 | `feat(storefront): checkout flow UI — address, payment, review, confirmation; double-click-safe` | client-side idempotency key generation + disabled-on-submit |
| 10 | `test: idempotent checkout (retry/double-submit → one charge); webhook replay → one advance; decline path` | |
| 11 | `docs: ADR-0008 checkout idempotency + order state machine; curriculum note (learner retro)` | |

## C — Review order
J's naive checkout (2) — *predict the double-charge before reading* → S's idempotent version (4) → re-validation (5) → the webhook dedupe arc (7).

## D — Teaching comments (~12)
- idempotency on money — 📘 the culmination: an idempotency key (minted client-side per checkout attempt) means retries, double-clicks, and network re-sends produce *one* order and *one* charge; 🔗 you've applied this to payroll, events, mutations, runs — here it guards a credit card, the highest stakes; the pattern is identical, the consequences maximal
- re-validation at charge — ⚠️ the cart's price is a snapshot (S5) and its availability was a hint (S7); checkout is where both become truth: re-check price (charge what was shown, refuse if drifted), confirm the reservation converts to a real decrement — the two-audience tension resolved at the moment of money
- webhook dedupe — 🔗 Meridian S9, replayed: payment webhooks arrive at-least-once; verify signature, dedupe by event id, advance state idempotently; a replayed "payment succeeded" must not fulfill twice
- decline path — 📘 the unhappy path is where checkout code earns its keep: a declined charge must release the inventory reservation (or you've locked stock for a sale that didn't happen) and preserve the cart (don't punish the buyer); junior checkouts forget this
- client idempotency key — 📘 generated where the intent is born (the checkout button), sent with the request, so even a retry from a flaky network carries the same key — 🔗 Pulse SDK uuid, Relay mutation id, same principle
- order state machine — 🔗 one write path for order status (the recurring discipline); illegal transitions (fulfill an unpaid order) rejected

## E — Debate
**"Idempotency key: client-generated vs server-generated vs natural key (cart id + version)?"** Server-generated: the client can't retry safely (a retry gets a new key). Natural key: elegant, but a cart can legitimately check out, fail, and retry (same cart, new attempt). Client-generated per-attempt: the client controls retry identity. **Resolution:** client-generated idempotency key per checkout attempt, stored server-side, with the cart id as a secondary guard. Lesson: *the retrier must own the idempotency key — only the client knows "this is the same attempt," so it must mint the key* (the definitive statement of a cross-course pattern).

## F/G — Close
- Squash: `feat(sprint-08): idempotent checkout & payments (closes #…)`
- Deferred: multiple payment methods, partial payments, saved cards, tax calculation (S10-adjacent).
- Recap idea: *checkout is where every idempotency lesson pays off on a credit card — mint the key at the click, charge once, and make the decline path release everything it should.*
