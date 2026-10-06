# Sprint 07: Inventory Consistency Flagship

## Objectives

- Reproduce the read-check-write oversell race.
- Replace it with an atomic conditional reservation.
- Model TTL holds and idempotent release.
- Separate cached availability hints from transactional truth.

## Review before reveal

Read the naïve service and red commit, predict the two-success result, then inspect
the atomic fix and 100-buyer chaos property. Finish with TTL/multi-location tests,
the storefront reconciliation, and ADR-0007.

## Debate captured

Redis counters are fast but create drift-prone truth; a serialized queue adds
latency. The database conditional update keeps count and constraint together.
Reservations protect the cart-to-checkout gap; cached availability only informs.

## Exercises

1. Revert to the naïve service and drive the last-unit test.
2. Run 10,000 buyers against 100 units and measure contention.
3. Crash between atomic reserve and reservation-record creation; design recovery.
4. Compare most-stock, nearest-location, and single-location allocation policies.

## Ground truth

- `AtomicInventoryService` and `ReservationService`: `apps/api/src/inventory.ts`, asserted in `inventory.test.ts`; the 10,000-attempt contention drill of exercise 2 is `apps/api/src/flash-sale.test.ts` ("sells exactly 100 units across 10,000 concurrent attempts").
- The naïve service for exercise 1 is on branch `lab/sprint-07` (lab commit `ecc89e4`; the fix merged as `7276213`, PR #35). Exercise 3's crash window is the compensation test in `flash-sale.test.ts` ("compensates a stock claim when reservation persistence fails").
- **Check**: `pnpm --filter @bazaar/api test flash-sale` passes on `main` and fails on the lab branch's naïve service.
