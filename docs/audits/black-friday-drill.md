# Black Friday Drill Evidence

The repository-executable deterministic drill ran 10,000 reservation attempts for
100 units while payment health was unavailable. Result: 100 winners, zero oversell,
100 explicitly pending/not-charged checkouts, and zero provider charge calls.

This proves orchestration contracts against in-process ports. It is not the playbook's
staging capacity exercise: no deployed Postgres hot row, Redis, autoscaler, or payment
network was available here. The staging run must add p50/p95, lock wait, queue depth,
cache hit ratio, provider latency, topology, commit, and time window.
