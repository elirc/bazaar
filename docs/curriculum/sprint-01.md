# Sprint 01: Foundation — Storefront/Admin Split

## Objectives

By the end of this sprint, the learner can:

- explain why two audiences reading the same products need different architectures;
- trace an admin product command through the repository port and buyer projection;
- identify where a future rendering or caching strategy can change without a rewrite;
- run the complete infrastructure-free workspace gate.

## Review before reveal

Read ADR-0002 first, predict where stale data is acceptable, then compare
`CatalogService.listForAdmin` with `CatalogService.readForStorefront`. Finish with
the two Next.js pages and identify which rendering directive differs.

## Key concepts

The storefront optimizes read latency and origin load. A catalog value may be
seconds stale, but it can never authorize a charge or inventory decrement. The
admin optimizes operational consistency: a merchant must see a price edit
immediately. A repository port keeps both paths testable without making CI boot
Postgres, and pure presenters keep rendering decisions replaceable.

## Debate captured

We chose two Next.js applications over one role-routed application. Shared data
was not enough reason to couple opposite caching, scaling, and blast-radius needs.
The reusable lesson is: split systems by requirements, not merely by their data.

## Exercises

1. Change the storefront staleness tolerance in ADR-0002 and list the business
   cases that would make the new number unacceptable.
2. Add a second active product and prove the admin sees both while a draft remains
   invisible to the storefront route.
3. Remove the dedicated storefront service method. Describe the cache bug a future
   engineer could introduce by caching the now-shared admin query.
4. Run `pnpm gate`, then replace the in-memory repository with a deliberately slow
   fake and observe which tests remain deterministic.
