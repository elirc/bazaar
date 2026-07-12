import { describe, expect, it } from "vitest";
import { browseCatalog, EngineSearchService, ResilientSearchService, searchCatalog, sortAndPage, toEngineDocument, type SearchDocument } from "./index.js";

const documents: SearchDocument[] = [
  { id: "1", title: "Canvas Tote", description: "Market bag", priceCents: 2400, options: { Color: ["Natural"] }, collectionHandles: ["bags"], available: true, createdAt: new Date("2026-01-01") },
  { id: "2", title: "Market Mug", description: "Canvas texture", priceCents: 1800, options: { Color: ["Blue"] }, collectionHandles: ["home"], available: false, createdAt: new Date("2026-02-01") },
];

describe("catalog search", () => {
  it("ranks title matches above description matches", () => {
    expect(searchCatalog(documents, "canvas").map((hit) => hit.id)).toEqual(["1", "2"]);
  });
  it("keeps facet counts consistent with every active filter", () => {
    const result = browseCatalog(documents, [{ op: "available_is", value: true }, { op: "price_between", minimumCents: 2000, maximumCents: 3000 }]);
    expect(result.results.map((item) => item.id)).toEqual(["1"]);
    expect(result.facets.collections.get("bags")).toBe(1);
    expect(result.facets.collections.get("home")).toBeUndefined();
  });
  it("sorts price with a stable cursor", () => {
    const hits = searchCatalog(documents, "");
    expect(sortAndPage(hits, "price_asc", undefined, 1)).toMatchObject({ items: [{ id: "2" }], nextCursor: "2" });
  });

  it("maps facetable engine fields without changing catalog truth", () => {
    expect(toEngineDocument(documents[0]!)).toMatchObject({ collections: ["bags"], optionValues: ["Color:Natural"], available: true });
  });

  it("falls back to FTS when the engine is unavailable", async () => {
    const engine = new EngineSearchService({ search: async () => { throw new Error("engine down"); } });
    const service = new ResilientSearchService(engine, { search: async (query) => searchCatalog(documents, query) });
    const result = await service.search({ query: "canvas", page: 1, perPage: 20 });
    expect(result.degraded).toBe(true);
    if (result.degraded) expect(result.fallback[0]?.id).toBe("1");
  });
});
