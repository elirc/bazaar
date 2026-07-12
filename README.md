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
