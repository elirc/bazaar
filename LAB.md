# Sprint 09 Lab: Desynchronize the Search Index

1. Index the seed catalog and record drift=0.
2. Stop the event indexer, change products, and prove search still serves old documents.
3. Run reconciliation; record scanned, drift, and converged counts.
4. Make the engine unavailable and prove Postgres FTS fallback returns results.
5. Explain why events are the fast path and reconciliation is the guarantee.
