import { toEngineDocument, type EngineDocument, type SearchDocument } from "@bazaar/search";

export interface CatalogSearchProjection { refreshProduct(productId: string): Promise<void>; }
export interface CatalogProjectionSource { findDocument(productId: string): Promise<SearchDocument | undefined>; }
export interface SearchEngineWriter { upsert(document: EngineDocument): Promise<void>; }

/** Product writes enqueue this handler; Postgres remains truth and the vector is derived. */
export class CatalogIndexWorker {
  constructor(private readonly projection: CatalogSearchProjection) {}
  async productChanged(productId: string) {
    await this.projection.refreshProduct(productId);
  }
}

export class ProductIndexer {
  constructor(private readonly catalog: CatalogProjectionSource, private readonly engine: SearchEngineWriter) {}
  async productChanged(productId: string) {
    const document = await this.catalog.findDocument(productId);
    if (!document) return false;
    await this.engine.upsert(toEngineDocument(document));
    return true;
  }
}
