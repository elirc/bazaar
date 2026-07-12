# Staging and Production Deployment

## Promotion gates

1. Immutable image built from a green main commit; secret/dependency gates pass.
2. Apply forward-compatible Postgres migrations and verify backup/PITR freshness.
3. Deploy workers drained, then API/admin/storefront with rolling readiness.
4. Warm traffic-ranked and scheduled-promotion keys before marking ready.
5. Run browse→cart→checkout→order→fulfillment smoke with a mock/test payment method.
6. Confirm checkout SLO, cache ratio, drift, payments, and backlog for 15 minutes.

Production credentials and infrastructure are intentionally absent from this repo.
Therefore v1.0 records code/CI readiness; a real deployment and smoke remain an
environment-owner gate and are not claimed by the release automation.
