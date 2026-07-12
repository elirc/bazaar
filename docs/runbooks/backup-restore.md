# Postgres Restore and Redis Rebuild

Postgres is authoritative for catalog, carts, orders, payments, and inventory.
Take encrypted daily full backups plus WAL/PITR with a 15-minute RPO and 60-minute
RTO. Redis is derived: do not restore stale cache data; flush and rebuild the hot
set from Postgres after restore.

## Staging drill

1. Freeze the chosen backup ID and record completion time/checksum.
2. Restore into an isolated staging database; never overwrite production.
3. Apply migrations, then compare order/payment/inventory counts and sampled sums.
4. Reconcile inventory against order truth and require zero unexplained drift.
5. Start empty Redis, rebuild the hot set, and run browse→cart→checkout→order smoke.
6. Record a `RestoreManifest`; `verifyRestore` must pass before declaring the drill.

No external staging credentials were available in this build environment, so this
repository verifies the restore contract locally and does not claim an executed
cloud restore. The first deployment gate must execute and attach this drill.
