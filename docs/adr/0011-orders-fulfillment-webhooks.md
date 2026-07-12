# ADR-0011: Transactional Order Effects and At-Least-Once Webhooks

- Status: Accepted
- Date: 2026-07-12

## Decision

Keep order status changes in one transition table. Represent partial fulfillment
as append-only fulfillment records and apply each stock movement through an
atomic, idempotency-keyed transaction. Refunds are bounded by the unrefunded
captured amount and delegated to an idempotent provider.

Merchant webhooks provide at-least-once delivery. Each request carries a stable
delivery ID plus an HMAC over timestamp and exact bytes. Failures retry with
exponential backoff and move to a dead-letter queue after six total attempts.
Consumers deduplicate by delivery ID.

## Consequences

The system can recover from crashes between external calls and acknowledgements
without pretending that exactly-once network delivery exists. Merchants may see
duplicates, but can verify origin and process each logical event once. Inventory
and refund invariants live at atomic persistence boundaries rather than UI flows.
