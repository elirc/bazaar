# Black Friday Drill Postmortem

- Status: deterministic rehearsal complete; deployed staging exercise required
- Severity: SEV-2 simulation
- Customer impact: none

## Summary

The drill combined 10,000 buyers, 100 hot units, and an unavailable payment
provider. Inventory and pending-checkout invariants held. The fault injection also
changed the promoted product after deploy: the static deployment hot set did not
include it, so its first crowd would rely entirely on single-flight origin loading.

## Timeline

- 00:00 sale traffic starts; 10,000 reservation attempts begin.
- 00:01 exactly 100 units reserved; remaining buyers receive sold-out outcome.
- 00:02 payment health opens degradation mode; 100 checkouts queue uncharged.
- 00:04 operator notices the trending SKU was absent from deploy warming.
- 00:08 single-flight is confirmed as a correctness shield; latency risk remains.

## Root cause and response

Deploy warming used a traffic ranking captured before the promotion changed. No
runtime trend signal promoted a suddenly hot key into the cache. The design was
safe but could produce avoidable first-crowd latency and origin load.

## Actions

- Add thresholded trend-based warming with cooldown and bounded concurrency.
- Alert on per-key miss-rate acceleration, not only aggregate hit ratio.
- Execute the full drill on staging and attach topology/latency evidence.

This is blameless: the static hot-set tradeoff was deliberate in Sprint 12; the
drill supplied the evidence for its next bounded extension.
