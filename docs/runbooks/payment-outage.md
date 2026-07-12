# Payment Provider Outage

Open degradation mode and show the honest pending/not-charged message. Queue each
reserved checkout once by idempotency key; never retry charges without the same key.
Watch reservation TTL and provider status. On recovery, drain slowly, reconcile
provider charges to orders, and page on any charged-without-order discrepancy.
