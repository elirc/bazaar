# Sprint 03: Storefront Rendering

## Objectives

- Select SSG, ISR, or dynamic rendering from staleness, traffic, and personalization.
- Place the RSC/client boundary so catalog data ships minimal JavaScript.
- Explain why image dimensions and loading priority affect LCP and conversion.
- Distinguish a cached availability hint from transactional inventory truth.

## Review before reveal

Start with `docs/rendering-strategy.md`, assign a strategy to each route yourself,
then compare `renderingPolicies`. Review the PDP revalidation boundary, the
Add-to-cart client island, the collection pagination, and finally ADR-0004.

## Debate captured

SSG was fastest but coupled freshness to large rebuilds. Dynamic rendering was
fresh but spent origin work on identical buyer reads. ISR won for catalog because
it combines static delivery with a written 60-second display tolerance. Dynamic
truth remains mandatory for buyer-specific and transactional routes.

## Exercises

1. Classify wishlists, recommendations, and an About page using the decision sequence.
2. Move the client boundary to the product page root and compare the client bundle.
3. Change the ISR window to ten minutes and write the merchant/buyer failure story.
4. Simulate a price edit immediately after regeneration and record when the page changes.

## Key lesson

Rendering is a correctness choice as well as a speed choice. Cache the shared read
surface within a stated tolerance; never let that display cache authorize money or stock.

## Ground truth

- `renderingPolicies`: `apps/storefront/src/rendering-policy.ts`, asserted in `rendering-policy.test.ts`; the strategy rationale is `docs/rendering-strategy.md` and ADR-0004.
- **Check**: `pnpm --filter @bazaar/storefront test rendering-policy` — exercise 1's classifications should each map to one policy entry in that file.
