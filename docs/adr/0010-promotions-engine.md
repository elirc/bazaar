# ADR-0010: Pure Promotion Evaluation with Safe Combination Policy

- Status: Accepted (combination enforcement scheduled for Sprint 13)
- Date: 2026-07-12

## Decision

Evaluate promotions as pure integer-money functions over a closed eligibility AST.
Cart and checkout use the same evaluator; checkout reloads current rules and claims
usage atomically. Global/per-customer limits belong in one conditional mutation.

The final combination policy is deny-by-default: rules do not stack unless marked
combinable, and totals never fall below zero (or configured cost). Sprint 10 keeps
the unguarded behavior as flaw #5 so Sprint 13's adversarial probe can demonstrate
the abuse before applying this enforcement.

## Consequences

Math is exhaustively testable and merchant controls remain structured. Order of
application is visible. Until the planned harvest, multiple eligible codes can
produce absurd totals; the flaw ledger and characterization test make that debt explicit.
