import type { Collection, Product, SmartCollectionRule } from "@bazaar/db";

export function matchesSmartRule(product: Product, rule: SmartCollectionRule): boolean {
  switch (rule.op) {
    case "all":
      return rule.rules.every((child) => matchesSmartRule(product, child));
    case "any":
      return rule.rules.some((child) => matchesSmartRule(product, child));
    case "title_contains":
      return product.title.toLocaleLowerCase().includes(rule.value.toLocaleLowerCase());
    case "price_between":
      return product.priceCents >= rule.minimumCents && product.priceCents <= rule.maximumCents;
    case "status_is":
      return product.status === rule.value;
  }
}

export function productsInCollection(
  collection: Collection,
  products: readonly Product[],
): readonly Product[] {
  if (collection.kind === "manual") {
    const members = new Set(collection.productIds);
    return products.filter((product) => members.has(product.id));
  }
  if (!collection.rule) throw new Error("Smart collections require a rule");
  return products.filter((product) => matchesSmartRule(product, collection.rule!));
}
