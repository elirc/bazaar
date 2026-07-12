import { toEngineDocument, type EngineDocument, type SearchDocument } from "@bazaar/search";

export interface CatalogSearchProjection { refreshProduct(productId: string): Promise<void>; }
export interface CatalogProjectionSource { findDocument(productId: string): Promise<SearchDocument | undefined>; }
export interface SearchEngineWriter { upsert(document: EngineDocument): Promise<void>; }
export interface CatalogReconciliationSource { listDocuments(): Promise<readonly SearchDocument[]>; }
export interface SearchEngineProjection extends SearchEngineWriter { get(id: string): Promise<EngineDocument | undefined>; }

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

export class SearchReconciler {
  constructor(private readonly catalog: CatalogReconciliationSource, private readonly engine: SearchEngineProjection) {}
  async reconcile() {
    const documents = await this.catalog.listDocuments();
    let drift = 0;
    for (const source of documents) {
      const expected = toEngineDocument(source);
      const current = await this.engine.get(source.id);
      if (JSON.stringify(current) !== JSON.stringify(expected)) {
        drift += 1;
        await this.engine.upsert(expected);
      }
    }
    return { scanned: documents.length, drift, converged: drift };
  }
}
