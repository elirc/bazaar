import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import { InMemoryCatalogRepository } from "./index.js";

describe("catalog repository", () => {
  it("scopes product handles to a store", async () => {
    const repository = new InMemoryCatalogRepository(() => "product-1");
    await repository.createStore({ id: "store-1", name: "Bazaar Demo", handle: "demo" });
    await repository.createProduct({
      storeId: "store-1",
      title: "Canvas Tote",
      handle: "canvas-tote",
      description: "Market-ready",
      priceCents: 2400,
      status: "active",
    });

    await expect(repository.findProductByHandle("store-1", "canvas-tote")).resolves.toMatchObject({
      id: "product-1",
      title: "Canvas Tote",
    });
  });

  it("rejects duplicate product handles within one store", async () => {
    let sequence = 0;
    const repository = new InMemoryCatalogRepository(() => `product-${++sequence}`);
    await repository.createStore({ id: "store-1", name: "Bazaar Demo", handle: "demo" });
    const input = {
      storeId: "store-1",
      title: "Canvas Tote",
      handle: "canvas-tote",
      description: "Market-ready",
      priceCents: 2400,
    };
    await repository.createProduct(input);
    await expect(repository.createProduct(input)).rejects.toThrow("already exists");
  });

  it("ships indexes for audited browse and order predicates", () => {
    const migration = readFileSync(new URL("../prisma/migrations/20260712213000_read_path_indexes/migration.sql", import.meta.url), "utf8");
    expect(migration).toContain("Product_storeId_status_createdAt_idx");
    expect(migration).toContain("OrderLine_orderId_variantId_idx");
  });
});
