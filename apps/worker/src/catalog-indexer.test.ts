import type { EngineDocument, SearchDocument } from "@bazaar/search";
import { describe, expect, it } from "vitest";
import { ProductIndexer } from "./catalog-indexer.js";

const document = (title: string): SearchDocument => ({ id: "p1", title, description: "", priceCents: 2400, options: {}, collectionHandles: [], available: true, createdAt: new Date(0) });

describe("search index convergence", () => {
  it("matches catalog truth even when a product event is missed", async () => {
    let catalog = document("Old title");
    const engine = new Map<string, EngineDocument>();
    const indexer = new ProductIndexer({ findDocument: async () => catalog }, { upsert: async (value) => { engine.set(value.id, value); } });
    await indexer.productChanged("p1");
    catalog = document("New title");
    // Simulate the deployment/outage window that loses this product event.
    expect(engine.get("p1")?.title).toBe(catalog.title);
  });
});
