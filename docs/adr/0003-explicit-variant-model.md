# ADR-0003: Model Every Sellable Variant Explicitly

- Status: Accepted
- Date: 2026-07-12

## Context

Options such as Size and Color describe a product, but inventory, price, SKU,
cart lines, and order lines all refer to one exact combination. Storing the whole
matrix as product JSON is flexible at first and forces every downstream domain to
invent an unstable path into that document.

## Decision

Store one `Variant` row per option-value combination. A deterministic, sorted
selection identity matches existing rows when options change. Matrix regeneration
is therefore a merge: matching variants preserve IDs, SKUs, prices, and future
inventory; new combinations get defaults; removed combinations require an
explicit merchant decision when referenced downstream.

## Consequences

Variant IDs become the stable atom of commerce. The schema uses more rows and the
admin must manage a Cartesian product, but cart, inventory, checkout, and orders
all receive a real foreign key. Per-store product handles and per-product variant
SKUs remain unique at the database boundary.
