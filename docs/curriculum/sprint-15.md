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
