# Sprint 15 — Production Readiness → v1.0.0

**Branch:** `sprint-15/production-readiness` · **Size:** L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** Operate a high-traffic commerce system: observability tuned for the two audiences (cache health + inventory accuracy + checkout success), cost/capacity planning, a **Black-Friday-scale incident drill**, backup/restore, runbooks, and the v1.0 release with retrospective.

## A — Issues
1. `Observability: cache hit rate, inventory accuracy, checkout funnel/success rate, order pipeline, Sentry`
2. `Alerting: checkout-success-rate drop, inventory-drift, cache-hit collapse, payment failures, order backlog`
3. `Ops: graceful deploy, cache warming on deploy, DB + Redis backup/restore drill, capacity plan`
4. `Incident drill: Black-Friday-scale (traffic spike + hot inventory + payment provider degradation)`
5. `Release: v1.0.0, course retrospective`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(obs): request tracing storefront→api→cache→db; checkout tracing across payment + inventory + order` | one trace answers "why did this checkout fail/slow" across three subsystems |
| 2 | `feat(obs): the commerce dashboards — cache hit rate by layer, inventory accuracy (reserved vs actual), checkout funnel + success rate, order/payment pipeline` | the metrics that describe commerce health for *both* audiences (storefront perf + admin/order integrity) |
| 3 | `feat(obs): inventory-drift detection — periodic reconcile of onHand/reserved vs order truth; alarm on drift` | ⚠️ inventory drift (reserved holds never released, decrements lost) is silent revenue loss; detect it like Pulse's event-loss accounting |
| 4 | `feat(obs): Sentry — storefront + admin + api, commerce context (order/cart ids), PII-safe` | |
| 5 | `feat(api): checkout-success-rate SLO + alerting — a drop is a revenue emergency, pages immediately` | the most business-critical alert: checkout success is money-per-minute |
| 6 | `feat(ops): graceful deploy + cache warming on deploy (S12) + payment-provider degradation mode` | payment provider down → queue orders / show honest messaging, never silently fail a charge; 🔗 the "degrade gracefully" law |
| 7 | `feat(ops): backup + tested restore — orders/inventory (Postgres) + cache rebuild (Redis is derived); restore drill on staging` | Redis is a *cache* (rebuildable), Postgres is *truth* (must restore) — the backup strategy reflects which is which |
| 8 | `test(drill): Black-Friday incident — traffic spike + hot-product contention + payment-provider slowdown, on staging` | executed for real: the flash-sale drill (S13) plus a degrading payment provider; every subsystem stressed at once; runbooks followed |
| 9 | `docs: postmortem — Black-Friday drill (blameless); action items as issues` | finding: cache warming missed a trending product; auto-warming on trend-detection filed |
| 10 | `feat: drill action item — trend-based auto cache warming` | |
| 11 | `docs: runbooks — traffic spike, inventory drift, cache collapse, payment outage, order backlog, restore, rollback` | |
| 12 | `chore(release): changelog, staging/prod docs, README refresh` | |
| 13 | `docs: course retrospective + capacity plan — the two-audience thesis reviewed, consistency-invariant tally, flaw ledger story, v2 ideas (multi-region, headless API, B2B)` | |

## C — Review order
Commerce dashboards (2) → inventory-drift detection (3) → checkout-success SLO (5) → **the Black-Friday drill (8→9→10)**.

## D — Teaching comments (~9)
- two-audience observability — 📘 the course's thesis, one last time, in the metrics: storefront health (cache hit rate, p95, Core Web Vitals) *and* commerce integrity (inventory accuracy, checkout success, order pipeline) — you watch both because they fail differently and both are revenue
- inventory-drift detection — ⚠️ the silent killer: holds that never release, lost decrements, reconciliation gaps — inventory drifts from truth invisibly and either oversells or hides sellable stock; periodic reconcile + drift alarm (🔗 Pulse's loss-accounting, inventory-shaped)
- checkout-success SLO — 📘 the alert that matters most: a checkout-success-rate drop is money bleeding per minute; page immediately, symptom-based (🔗 the SLO discipline, at its most business-critical)
- Redis rebuildable, Postgres truth — 🔍 review-lens: the backup strategy encodes what's derived vs authoritative — you restore Postgres (orders, inventory) and *rebuild* Redis (cache); confusing the two either wastes backup effort or loses money
- payment degradation mode — 🔗 the graceful-degradation law (every course): payment provider slow/down → queue or honest messaging, never a silent failed charge or a charged-but-no-order; the worst commerce bug is taking money without an order
- the Black-Friday drill — 📘 the operational capstone: S13's flash-sale plus a degrading dependency, on staging, for real; a drill that stresses every subsystem together is the only honest readiness proof — and it found a warming gap, as good drills do

## E — Debate
**"Capacity for peak: over-provision for Black Friday vs autoscale vs queue/shed?"** Over-provision: safe, expensive 364 days a year. Autoscale: cost-efficient, but scaling lag during a sudden spike. Queue/shed: graceful under any load, adds UX complexity (waiting room). **Resolution:** autoscale for gradual load + a waiting-room/shed mechanism for flash spikes (the S13 trigger) + generous cache warming; over-provision only the stateful tier (DB) that scales slowest. Lesson: *peak capacity is a cost/risk/complexity triangle — autoscale the stateless, protect the stateful, and shed load gracefully rather than falling over.*

## F/G — Close & Release
- Squash: `feat(sprint-15): commerce observability, capacity, incident readiness (closes #…)`
- **Release sequence:** merge → deploy → smoke (browse→cart→checkout→order E2E vs prod) → tag **`v1.0.0`** → GitHub Release → recorded demo (a full purchase, and the flash-sale drill holding) → close milestone.
- Final discussion: **course retro** — the two-audience thesis reviewed end to end; the consistency-invariant tally (oversell prevention, checkout-once, discount floors, webhook idempotency); the FTS→Typesense adoption story; learner's flash-sale drill celebrated; pointer back to the curriculum retrospective (Folio's six-course finale).
- Recap idea: *operating commerce is watching two systems that fail differently — keep the shop fast and the money correct, and drill the day they collide.*
