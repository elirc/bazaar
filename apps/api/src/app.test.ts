import { InMemoryCatalogRepository } from "@bazaar/db";
import { describe, expect, it } from "vitest";

import { buildApi } from "./app.js";

describe("product read paths", () => {
  it("keeps drafts visible to admin and hidden from storefront", async () => {
    const catalog = new InMemoryCatalogRepository(() => "product-1");
    await catalog.createStore({ id: "store-1", name: "Demo", handle: "demo" });
    const app = buildApi(catalog);

    const created = await Promise.resolve(
      app.inject({
        method: "POST",
        url: "/admin/products",
        payload: {
          storeId: "store-1",
          title: "Draft Tote",
          handle: "draft-tote",
          description: "Not published",
          priceCents: 2400,
        },
      }),
    );
    const admin = await Promise.resolve(
      app.inject({ method: "GET", url: "/admin/stores/store-1/products" }),
    );
    const storefront = await Promise.resolve(
      app.inject({ method: "GET", url: "/storefront/stores/store-1/products/draft-tote" }),
    );

    expect(created.statusCode).toBe(201);
    expect(admin.json()).toHaveLength(1);
    expect(storefront.statusCode).toBe(404);
    await app.close();
  });
});
