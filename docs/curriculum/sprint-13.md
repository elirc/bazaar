# Sprint 13: Flash-Sale Hardening

## Objectives

- Stress caching, inventory, and checkout together.
- Separate correctness proofs from capacity measurements.
- Treat browser/payment input as hostile.
- Close and reveal the complete planted-flaw ledger.

## Evidence recap

All five planned flaws are harvested: stale product invalidation (S06), cart N+1
(S12), cache stampede (S06 plus this 10k proof), inventory oversell (S07 plus this
10k proof), and discount stacking (this sprint's -$25 abuse probe). Local tests
prove exact invariants; the k6 lab measures a named deployed environment.

## Debate captured

Use real-time atomic decrement while measured lock/latency budgets hold. A virtual
waiting room improves extreme-sale fairness and smooths load, but it adds a new
distributed system. Build it only after the documented trigger is crossed.

## Lab

Run `performance/flash-sale.js` with a 100-unit variant. Reconcile accepted orders,
reservations, charges, and final stock. Repeat with cache warming disabled, then
with induced provider latency. Attach topology and timestamps to every graph.

## Exercises

1. Forge a valid-body webhook with the wrong timestamp.
2. Race anonymous buyers against a one-per-customer promotion.
3. Tamper a cart snapshot to one cent and trace the rejection.
4. Find the concurrency level where throughput degrades while correctness holds.
