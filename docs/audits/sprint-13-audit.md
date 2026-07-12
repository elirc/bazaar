# Sprint 13 Flash-Sale and Security Audit

Date: 2026-07-12. Audit-first baseline on local deterministic fakes. The later
10,000-attempt proofs model concurrency contracts in one process; they are not a
distributed Postgres/Redis capacity claim. `performance/flash-sale.js` is the
environment drill for real infrastructure.

## Baseline findings

| Priority | Probe | Baseline evidence | Required invariant |
|---|---|---|---|
| P1 | discount stacking | two $40 rules on $50 + $5 shipping = **-$25** | deny combinations; floor total |
| P1 | client price tamper | order constructors consume cart snapshots | reload authoritative prices |
| P1 | hot inventory | S7 atomic port is correct; TTL/throughput need stress proof | sold <= stock |
| P1 | cold hot-product cache | S6 single-flight exists; S12 warming needs collision proof | one origin load/key |
| P2 | payment webhooks | HMAC + event claim exist; timestamp freshness absent | reject stale replay |
| P2 | enumeration/cache input | no shared normalization/rate policy | bounded identity-derived keys |
| P3 | supply chain | dependency audit in install only; no secret scanner | explicit CI gates |

## Drill stages

1. Warm a single sale product, then expire it as 10,000 reads arrive.
2. Race 10,000 reservations for 100 units and assert exactly 100 successes.
3. Submit the same checkout key 10,000 times and assert one charge.
4. Apply hostile promotion combinations and anonymous per-customer claims.
5. Forge, replay, and age payment webhooks; tamper with client totals.

Correctness thresholds are exact (no oversell, one load, one charge, nonnegative
total). Latency is reported only by the k6 environment with its topology attached.
