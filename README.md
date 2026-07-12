# Bazaar

Bazaar is a Shopify-lite commerce platform and a fifteen-sprint systems-design
course. It teaches one system through two audiences: a fast, aggressively cached
storefront for buyers and a fresh, consistency-critical back office for merchants.

The curriculum starts with a product-to-storefront walking skeleton, then builds
catalog, search, cart, cache coherence, inventory, checkout, payments,
fulfillment, promotions, performance, security, internationalization, and
production operations. The flash-sale drill is the capstone where cache behavior,
inventory contention, and payment idempotency collide.

## Workspace

```text
apps/{storefront,admin,api,worker}
packages/{db,shared,search,cache,config}
docs/{adr,curriculum,sprints,runbooks,audits}
```

Read [SPEC.md](SPEC.md) for the product and curriculum map, then
[docs/sprints/00-workflow.md](docs/sprints/00-workflow.md) for the delivery ritual.

## Local gate

Node 20 and pnpm 9 are the reference toolchain.

```bash
pnpm install
pnpm gate
```

The automated gate is intentionally infrastructure-free: teaching cores operate
over injected ports and run against in-memory fakes.

## v1 operations

- [Architecture decisions](docs/adr)
- [Sprint curriculum](docs/curriculum)
- [Performance and security audits](docs/audits)
- [Incident and restore runbooks](docs/runbooks)
- [Deployment promotion gates](docs/deployment.md)
- [v1 changelog](CHANGELOG.md)

The repository's deterministic 10,000-attempt drills prove inventory, cache, and
idempotency contracts without claiming distributed capacity. Use the checked-in
k6 profiles against a named staging topology for latency and scaling evidence.
