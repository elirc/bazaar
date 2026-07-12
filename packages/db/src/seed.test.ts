import { describe, expect, it } from "vitest";

import { createCatalogSeed } from "./seed.js";

describe("catalog seed", () => {
  it("creates fifty unique, variant-bearing products", () => {
    const seed = createCatalogSeed();
    expect(seed).toHaveLength(50);
    expect(new Set(seed.map((product) => product.handle)).size).toBe(50);
    expect(seed.every((product) => product.variants.length === 2)).toBe(true);
  });
});
