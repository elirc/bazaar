import type { ProductOption, Variant } from "@bazaar/db";

type NewVariantDefaults = Pick<Variant, "productId" | "priceCents">;

function identity(selections: Readonly<Record<string, string>>): string {
  return Object.entries(selections)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${name}=${value}`)
    .join("|");
}

function combinations(options: readonly ProductOption[]): ReadonlyArray<Record<string, string>> {
  return [...options]
    .sort((left, right) => left.position - right.position)
    .reduce<ReadonlyArray<Record<string, string>>>(
      (matrix, option) =>
        matrix.flatMap((selection) =>
          option.values.map((value) => ({ ...selection, [option.name]: value })),
        ),
      [{}],
    );
}

/**
 * Expanding an option matrix is a merge, not a rebuild. Existing identities keep
 * merchant-entered SKU and price data; only genuinely new combinations get defaults.
 */
export function mergeVariantMatrix(
  options: readonly ProductOption[],
  existing: readonly Variant[],
  defaults: NewVariantDefaults,
  idFactory: () => string,
): readonly Variant[] {
  const byIdentity = new Map(
    existing.map((variant) => [identity(variant.selections), variant]),
  );

  return combinations(options).map((selections, index) => {
    const selectionIdentity = identity(selections);
    const preserved = byIdentity.get(selectionIdentity);
    if (preserved) return preserved;
    return {
      id: idFactory(),
      productId: defaults.productId,
      sku: `NEW-${String(index + 1).padStart(3, "0")}`,
      priceCents: defaults.priceCents,
      selections,
    };
  });
}
