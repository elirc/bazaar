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
