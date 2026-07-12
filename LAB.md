# Sprint 13 Lab: Break the Flash Sale

Run `performance/flash-sale.js` against a disposable environment with a 100-unit
variant. Escalate load until latency or locks cross budget; reconcile orders,
reservations, provider charges, refunds, and stock after every run.

Repeat with a cold cache, delayed payment responses, duplicated request keys,
hostile promotion combinations, forged/stale webhooks, and one-cent cart prices.
The lab passes only when sold <= stock, each key charges once, totals stay bounded,
and every graph names its infrastructure, time window, warm state, and commit.
