import { describe, expect, it } from "vitest";
import sitemap from "../app/sitemap";
import { productStructuredData, safeJsonLd } from "./seo";

describe("storefront discovery", () => {
  it("emits valid Product/Offer JSON-LD without executable markup", () => {
    const value = productStructuredData({ handle: "tote", title: "<Market Tote>", description: "Carry", priceCents: 2400 }, "https://bazaar.example");
    const encoded = safeJsonLd(value);
    expect(encoded).toContain('"@type":"Product"');
    expect(encoded).toContain('"price":"24.00"');
    expect(encoded).not.toContain("<");
    expect(JSON.parse(encoded)).toMatchObject({ "@context": "https://schema.org" });
  });
  it("includes canonical product and collection discovery URLs", () => {
    expect(sitemap().map(({ url }) => url)).toEqual(expect.arrayContaining([
      "https://bazaar.example/products/canvas-market-tote",
      "https://bazaar.example/collections/market-favorites",
    ]));
  });
});
