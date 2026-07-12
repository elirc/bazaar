import type { StorefrontProduct } from "./product-view.js";

export interface StorefrontCatalogPort {
  findProduct(handle: string): Promise<StorefrontProduct | undefined>;
}

export class StorefrontCatalogReader {
  constructor(private readonly catalog: StorefrontCatalogPort) {}

  readProduct(handle: string) {
    return this.catalog.findProduct(handle);
  }
}
