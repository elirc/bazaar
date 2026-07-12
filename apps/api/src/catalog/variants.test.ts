import type { ProductOption, Variant } from "@bazaar/db";
import { describe, expect, it } from "vitest";

import { mergeVariantMatrix } from "./variants.js";

describe("variant matrix merge", () => {
  it("adds combinations without replacing existing SKU and price data", () => {
    const existing: Variant = {
      id: "v-small-natural",
      productId: "p1",
      sku: "TOTE-S-NAT",
      priceCents: 2400,
      selections: { Size: "S", Color: "Natural" },
    };
    const options: ProductOption[] = [
      { id: "o1", productId: "p1", name: "Size", position: 0, values: ["S", "M"] },
      { id: "o2", productId: "p1", name: "Color", position: 1, values: ["Natural"] },
    ];

    const merged = mergeVariantMatrix(options, [existing], { productId: "p1", priceCents: 2500 }, () => "v-new");

    expect(merged).toHaveLength(2);
    expect(merged[0]).toBe(existing);
    expect(merged[1]).toMatchObject({ id: "v-new", selections: { Size: "M", Color: "Natural" } });
  });
});
