# Sprint 07 Lab: Break Inventory Consistency

1. Run 1,000 concurrent buyers against 25 units and prove exactly 25 successes.
2. Switch the service to `NaiveInventoryService`; coordinate reads and observe oversell.
3. Restore the atomic port and expire active holds; prove stock is released once.
4. Kill the worker mid-sweep and retry it; explain why active-only transition protects stock.
5. Record contention latency and the point where correctness remains but throughput degrades.

Invariant: `successful reservations <= initial available stock`, always.
