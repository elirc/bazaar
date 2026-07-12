export interface CatalogSearchProjection {
  refreshProduct(productId: string): Promise<void>;
}

/** Product writes enqueue this handler; Postgres remains truth and the vector is derived. */
export class CatalogIndexWorker {
  constructor(private readonly projection: CatalogSearchProjection) {}
  async productChanged(productId: string) {
    await this.projection.refreshProduct(productId);
  }
}
