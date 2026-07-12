import { describe, expect, it } from "vitest";

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
});
