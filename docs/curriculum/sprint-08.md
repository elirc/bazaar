# Sprint 08: Checkout and Payments Idempotency

## Objectives

- Reproduce and fix a concurrent double charge.
- Explain why the retrier owns the idempotency key.
- Revalidate cached cart/inventory data at the money boundary.
- Verify/dedupe webhooks and recover a declined payment.

## Review before reveal

Read the learner checkout, red test output, senior get-or-create fix, validation,
provider adapter, webhook handler, decline tests, and ADR-0008.

## Debate captured

Server-generated keys cannot identify a client retry. Cart ID is too broad because
a failed cart may form a new attempt. A client-generated per-attempt key expresses
exactly what “same retry” means and travels through every money boundary.

## Exercises

1. Retry after the charge succeeds but before the API response arrives.
2. Replay a valid webhook 100 times and prove one state transition.
3. Tamper with price and remove a reservation before checkout.
4. Add an illegal paid-to-failed transition and confirm the table rejects it.
