# Cache Key, Tag, and Ownership Conventions

- Key: `bazaar:v1:store:{storeId}:{resource}:{id}`. Version namespaces allow migrations.
- Tag: `{resource}:{id}`. Attach every entity whose mutation changes the projection.
- Owner: the committed write path publishes invalidation after durable success.
- Layers: CDN → ISR → Redis → Postgres. Invalidation must reach every serving layer.
- Storefront: catalog may use 60s fresh + 5m stale-while-revalidate.
- Admin/cart/checkout: zero staleness; these paths do not consume catalog page caches as truth.

Events provide precise freshness. TTLs are the self-healing backstop for missed
events. Single-flight protects the origin when either mechanism creates a miss.
