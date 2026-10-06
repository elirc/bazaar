# Sprint 02: Catalog — Variants and Collections

## Objectives

- Model options separately from the explicit variants other domains reference.
- Expand an option matrix without destroying existing SKU or price data.
- Express smart collection membership as a closed predicate AST.
- Explain when collection membership should be live or materialized.

## Review before reveal

Read ADR-0003, then predict the failure in a regenerate-all implementation. Review
`mergeVariantMatrix` and its preservation test before reading the admin matrix.
Finish with the smart collection AST, evaluator, and rule-builder projection.

## Key concepts

The variant—not the product—is the unit of sale, price, and future inventory.
Selection identity makes matrix changes a merge with history. Smart collections
reuse a safe structured-predicate pattern: merchant controls compile to a closed
tree that can run in memory today and become SQL or search filters later.

Manual collections are curated truth. Smart collection membership is computed
live for this small catalog; materialization becomes worthwhile only when catalog
size or facet latency crosses a measured threshold.

## Debate captured

Options-as-JSON reduced schema work but could not provide a stable identifier for
cart and inventory. Explicit rows won because downstream references define the
true entity boundary. Lesson: model the atom other systems must reference as a
real entity, not as a position inside a document.

## Exercises

1. Add Width with two values and predict which existing variants survive.
2. Write an `any` smart rule for active totes or products below $20.
3. Add a destructive option removal policy that refuses deletion when a variant
   is referenced by an order.
4. Scale the seed to 50,000 products and measure live smart-collection evaluation.

## Ground truth

- `mergeVariantMatrix` and its preservation test: `apps/api/src/catalog/variants.ts` / `variants.test.ts`; the admin matrix UI logic is `apps/admin/src/variant-matrix.ts`; the smart-collection predicate AST is `apps/admin/src/collection-rules.ts`.
- **Check**: `pnpm --filter @bazaar/api test variants` — exercise 1's survival prediction is exactly what the preservation test pins down.
