# Sprint 12: Caching Under Load

## Objectives

- Run measure, rank, fix, and prove before tuning.
- Recognize and batch an ORM-shaped N+1.
- Tune cache granularity and TTL by path.
- Warm the traffic head and gate hit-rate/latency budgets.

## Review before reveal

Start with the audit and its evidence limits. Then compare the old per-line price
reader with the batch port, inspect the 50-line guard, cache policy, hot-set warmer,
k6 profile, and CI budget in that order.

## Debate captured

Reactive warming is simple but exposes the database to a post-deploy cold burst.
Warming everything wastes deploy time and cache space. Bazaar proactively warms
the top 50 traffic-ranked resources in bounded concurrency, then lets the long
tail fill reactively behind single-flight protection.

## Lab

Use `lab/sprint-12` to run `performance/cache-smoke.js` before and after changes.
Record environment, request mix, p50/p95, hit rate, and query count. Then deploy
with an empty cache once, compare the first minute, and restore hot-set warming.
Do not compare numbers from different hardware as if they were controlled data.

## Exercises

1. Raise the fixture cart from 50 to 500 lines and keep one price read.
2. Change the hot-set limit and graph warm duration against first-minute hit rate.
3. Add production-cardinality `EXPLAIN (ANALYZE, BUFFERS)` evidence.
4. Break the CI hit-rate fixture intentionally and inspect the failed budget.
