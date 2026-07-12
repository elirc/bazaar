# Traffic Spike

Page when request p95 breaches budget with rising volume. Confirm cache hit ratio
and per-key misses, enable trend warming, autoscale stateless storefront/API, and
protect Postgres with rate limits. If the waiting-room trigger is crossed, shed new
checkout starts while existing carts finish. Exit only after SLO and queue recovery.
