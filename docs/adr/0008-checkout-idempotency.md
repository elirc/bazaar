# ADR-0008: Client-Owned Checkout Idempotency and One Order Write Path

- Status: Accepted
- Date: 2026-07-12

## Decision

The browser mints one random idempotency key per checkout attempt and reuses it for
double-clicks, retries, and network recovery. The API atomically get-or-creates one
order by that unique key; only the creator charges, passing the same key to the
payment provider. Order status changes use one legal transition table.

Before charge, the server revalidates catalog price and active inventory holds.
Payment webhooks verify HMAC over the raw body and atomically claim event IDs.
Decline marks the order failed, releases reservations once, and preserves the cart.

## Consequences

Checkout charges once across client/API/provider retries. The retrier owns attempt
identity; cart ID remains a secondary guard, not the key, because one cart may have
multiple legitimate attempts. Webhook delivery remains at-least-once and replay-safe.
