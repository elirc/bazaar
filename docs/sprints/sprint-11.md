# Sprint 11 — Orders, Fulfillment & Webhooks

**Branch:** `sprint-11/orders-fulfillment` · **Size:** M/L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** The post-purchase lifecycle: order management for merchants, fulfillment (pick/pack/ship, tracking, partial fulfillment), inventory effects of fulfillment/cancellation/returns, and outbound webhooks so merchants can integrate their own systems.

## A — Issues
1. `Order management (admin): detail, timeline, status, notes, search`
2. `Fulfillment: create fulfillments, partial fulfillment, tracking, mark shipped/delivered`
3. `Inventory effects: fulfillment commits, cancellation/return restocks`
4. `Merchant webhooks: order.created/paid/fulfilled events (HMAC, retries, DLQ)`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(api): order lifecycle — extend the S8 state machine (paid → fulfilled/partially_fulfilled → …/cancelled/refunded)` | 🔗 one write path; illegal transitions rejected |
| 2 | `feat(admin): order management — detail, timeline (event-sourced from order events), notes, filtering` | 🔗 the audit-log/event instinct from Meridian; order timeline is the event history |
| 3 | `feat(api): fulfillment — partial fulfillment (some lines), tracking numbers, per-fulfillment status` | partial fulfillment is the modeling challenge: an order isn't binary-fulfilled |
| 4 | `feat(api): inventory effects — fulfillment commits reserved→shipped; cancel/return restocks (atomic)` | 🔗 the S7 atomic inventory ops; a return must restock correctly (and idempotently — a double-processed return mustn't double-restock) |
| 5 | `feat(api): refunds — via the mock payment provider, idempotent, order → refunded` | 🔗 S8 payment idempotency, refund-shaped |
| 6 | `feat(worker+api): merchant webhooks — subscribe to order events, HMAC-signed, retries + DLQ` | 🔗 Relay S6/S9 webhook lessons: signed, retried, dead-lettered — Bazaar is now the webhook *sender*, the flip side of prior courses |
| 7 | `feat(admin): webhook management UI + delivery log` | |
| 8 | `test: lifecycle transitions, partial fulfillment, restock idempotency, webhook delivery + retry` | |
| 9 | `docs: ADR-0011 order lifecycle + webhooks; curriculum note` | |

## C — Review order
The lifecycle machine (1) → partial fulfillment (3) → inventory effects + restock idempotency (4) → merchant webhooks (6).

## D — Teaching comments (~9)
- order state machine — 🔗 the fifth state machine (Meridian worker, Relay run, Folio... ) — the learner builds these reflexively; the value is the *transition table* as documentation and the single write path
- event-sourced timeline — 📘 the order timeline is the append-only event history (🔗 Meridian audit, Tracer log, Relay run events); merchants debug "what happened to this order" via events, so emit them richly
- partial fulfillment — 📘 the modeling insight: fulfillment is per-line, not per-order; an order can be partially shipped; the data model must support "2 of 3 lines fulfilled" cleanly
- restock idempotency — ⚠️ processing a return/cancellation must restock exactly once; a retried webhook or double-clicked refund mustn't double-restock; 🔗 the idempotency discipline guards inventory now, not just money
- webhook sender — 🔗 role reversal: prior courses *consumed* webhooks (Meridian, Relay); Bazaar *sends* them, so it must be the reliable party — HMAC signing, retries with backoff, DLQ for dead endpoints; you're now the vendor in someone else's integration
- refund idempotency — 🔗 S8's payment idempotency, applied to the reverse operation

## E — Debate
**"Webhook delivery: at-least-once with retries vs exactly-once?"** Exactly-once delivery is impossible over the network; the honest contract is at-least-once + let consumers dedupe (via event id). **Resolution:** at-least-once with signed event ids, retries with backoff, and a DLQ; document that consumers must be idempotent (we send an event id for exactly that). Lesson: *as the webhook sender, you owe consumers at-least-once delivery, signatures, and a stable event id — you can't promise exactly-once, so you enable their idempotency* (the sender's side of the lesson prior courses learned as consumers).

## F/G — Close
- Squash: `feat(sprint-11): orders, fulfillment, merchant webhooks (closes #…)`
- Deferred: shipping-rate integration, multi-package fulfillment, exchange flows.
- Recap idea: *the post-purchase lifecycle is a state machine plus per-line fulfillment plus idempotent inventory effects — and as the webhook sender, you're now the reliable party.*
