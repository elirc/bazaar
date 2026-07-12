import type { CreateProduct } from "./index.js";

export type CatalogSeedProduct = CreateProduct & {
  variants: readonly { sku: string; label: string; priceCents: number }[];
  collectionHandles: readonly string[];
};

const productKinds = ["Tote", "Mug", "Notebook", "Throw", "Planter"] as const;
const materials = ["Canvas", "Stoneware", "Linen", "Recycled", "Oak"] as const;

export function createCatalogSeed(storeId = "store-demo"): readonly CatalogSeedProduct[] {
  return Array.from({ length: 50 }, (_, index) => {
    const kind = productKinds[index % productKinds.length]!;
    const material = materials[Math.floor(index / productKinds.length) % materials.length]!;
    const sequence = String(index + 1).padStart(2, "0");
    const basePrice = 1800 + index * 125;
    return {
      storeId,
      title: `${material} ${kind} ${sequence}`,
      handle: `${material}-${kind}-${sequence}`.toLowerCase(),
      description: `Small-batch ${kind.toLowerCase()} made with ${material.toLowerCase()}.`,
      priceCents: basePrice,
      status: index % 8 === 0 ? "draft" : "active",
      variants: [
        { sku: `BZR-${sequence}-STD`, label: "Standard", priceCents: basePrice },
        { sku: `BZR-${sequence}-LG`, label: "Large", priceCents: basePrice + 600 },
      ],
      collectionHandles: index % 2 === 0 ? ["market-favorites"] : ["new-arrivals"],
    };
  });
}
