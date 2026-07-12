# Contributing to Bazaar

Bazaar is both a working commerce platform and a review-first curriculum. Changes
must preserve both stories.

## Branch and commit ritual

- Work on `sprint-NN/<slug>` branches.
- Follow the ordered commit table in `docs/sprints/sprint-NN.md`.
- Use Conventional Commits and keep `main` squash-only and linear.
- Never merge a red build or silently repair a planted flaw.

## Required gate

```bash
pnpm -w run lint
pnpm -w run typecheck
pnpm turbo run test build
```

Tests use in-memory implementations of ports. CI has no database, Redis, queue,
or search service. Infrastructure adapters belong only in application entries.

## Review discipline

Every cache or consistency decision identifies its audience: a cached,
staleness-tolerant storefront or a fresh, consistency-critical admin. From Sprint
7 onward, changes that touch inventory or checkout must ship with invariant tests.
