# Sprint 15: Operating Commerce

## Objectives

- Observe buyer speed and merchant/money integrity together.
- Detect inventory drift and alert on checkout revenue loss.
- Degrade dependencies honestly and restore authoritative truth.
- Turn an incident drill into a tested improvement and release decision.

## Review before reveal

Read dashboard metrics, drift reconciler, SLO, payment degradation, restore contract,
drill evidence, postmortem, trend warmer, runbooks, capacity plan, and retrospective.

## Debate captured

Autoscale stateless gradual load, pre-scale the slow stateful tier for named events,
and queue/shed sudden spikes at measured thresholds. Permanent peak over-provisioning
wastes money; autoscaling alone cannot outrun a flash crowd.

## Exercises

1. Follow the payment-outage runbook with injected 30-second latency.
2. Create one inventory drift unit and close the alert with audited correction.
3. Restore a real staging backup and attach the manifest and smoke evidence.
4. Run the k6 profiles until the documented waiting-room trigger is crossed.

## Ground truth

- Dashboard and SLO: `observability/dashboards/commerce.json`, `observability/slo/checkout.md`; drift reconciler: `apps/worker/src/inventory-reconciler.ts`; degradation: `apps/api/src/degradation.ts`; trend warmer: `packages/cache/src/trend-warming.ts`; runbooks for exercise 1: `docs/runbooks/`; the drill record: `docs/postmortems/2026-07-12-black-friday-drill.md` and `apps/api/src/black-friday-drill.test.ts`.
- **Check**: `pnpm --filter @bazaar/worker test inventory-reconciler` proves exercise 2's detection ("alarms on reserved and on-hand drift against order truth"); the waiting-room trigger of exercise 4 is the sustained checkout p95 > 500 ms threshold in `docs/CAPACITY_PLAN.md` and `docs/security/flash-sale-threat-model.md`.
