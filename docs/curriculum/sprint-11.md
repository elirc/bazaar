# Sprint 11: Orders, Fulfillment, Refunds, and Webhooks

## Objectives

- Extend a finite order lifecycle without scattering transition checks.
- Model partial fulfillment and its inventory consequences.
- Make cancel, return, and refund retries safe.
- Explain at-least-once webhook delivery and consumer deduplication.

## Review before reveal

Read the transition table, fulfillment remaining-quantity guard, inventory
apply-once port, refund bound, delivery worker, and failure tests in that order.

## Debate captured

Exactly-once delivery across an HTTP boundary cannot be guaranteed by the sender.
Bazaar promises at-least-once attempts with a stable delivery ID; the receiver
turns those attempts into exactly-once business effects through deduplication.

## Exercises

1. Fulfill one of three units, retry it, then fulfill the remaining two.
2. Crash after a provider refund and prove the retry returns the same refund.
3. Verify a webhook signature from the timestamp and raw body.
4. Replay one delivery ID twice in a consumer-side inbox table.

## Ground truth

- Transition table: `apps/api/src/order-state.ts`; fulfillment guard: `fulfillment.ts`; refund bound: `refunds.ts`; signed delivery: `merchant-webhooks.ts` (API side) and `apps/worker/src/merchant-webhooks.ts` (delivery worker); asserted in `orders-fulfillment.test.ts`.
- **Check**: `pnpm --filter @bazaar/api test orders-fulfillment` — exercises 1, 2 and 4 map one-to-one onto its partial-fulfillment, refund-retry and dedupe cases.
