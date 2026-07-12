# Sprint 05 k6 Baseline #1

## Environment

- Date: 2026-07-12
- Storefront: production `next start`, Windows host, port 3108
- Load generator: official `grafana/k6:latest` container
- Profile: 20 VUs for 30 seconds, 200ms think time
- Route: `/products/canvas-market-tote`

## Measured result

| Metric | Result |
|---|---:|
| Requests | 2,746 |
| Throughput | 90.875 req/s |
| Failure rate | 0.00% |
| Latency average | 17.8ms |
| Latency p90 | 32.82ms |
| Latency p95 | 46.15ms |
| Latency max | 219.88ms |

The `p(95)<500ms` threshold passed and all 2,746 health checks succeeded.

## Cache and origin honesty

This local run hit the Next.js origin directly; it did not include a CDN or Redis
adapter. The page was produced by the ISR build, but Next did not expose a cache
status header, so **cache-hit rate is not observable in this baseline**. The local
Next origin received all 2,746 HTTP requests (90.875/s). Product data was embedded
at build time, so DB query/origin-load count was also not observable. Sprint 06's
cache metrics must close both gaps before using hit rate to tune policy.

## Reproduce

Build/start the storefront, then run:

```bash
docker run --rm -v "$PWD/scripts/k6:/scripts" grafana/k6 run \
  -e BASE_URL=http://host.docker.internal:3108 /scripts/storefront-baseline.js
```
