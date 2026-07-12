# Sprint 12 Lab: Caching Under Load

1. Run the k6 profile against an environment with `BASE_URL` configured.
2. Capture p50, p95, hit rate, query count, hardware, and request mix.
3. Revert the batch price reader locally and compare 1, 10, 50, and 500 lines.
4. Empty the cache, test the first minute, then enable hot-set warming and repeat.
5. Change a performance budget until CI fails, then restore it.

Never compare latency runs without recording their environment and warm/cold state.
