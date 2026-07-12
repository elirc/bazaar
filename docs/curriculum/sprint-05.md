# Sprint 05: Cart and First Cache

## Objectives

- Preserve buyer price intent with cart-line snapshots and revalidate at checkout.
- Merge guest and customer carts by variant identity.
- Implement cache-aside through an injected Redis-shaped port.
- Run and interpret the first k6 baseline without inventing missing metrics.

## Review before reveal

Read the cart journey tests, cart core, cache test/core, k6 report, then deploy
manifest. Identify which measurements are real and which instrumentation gaps are
explicitly deferred.

## Debate captured

Postgres wins for carts because durability, cross-device recovery, and abandoned-
cart analysis make them business records. Redis caches catalog display data; the
guest cookie carries only the durable cart ID.

## Exercises

1. Merge carts containing the same variant at different snapshots and define policy.
2. Run k6 cold then warm and add a trustworthy cache-status signal.
3. Expire a hot key under concurrency and count loader calls.
4. Explain why cart totals can display a snapshot while checkout must revalidate.
