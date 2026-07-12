import type { CatalogRepository, CreateProduct, Product } from "@bazaar/db";

export type ProductCard = Pick<Product, "handle" | "title" | "priceCents">;

export class CatalogService {
  constructor(private readonly catalog: CatalogRepository) {}

  async createProduct(input: CreateProduct): Promise<Product> {
    if (input.priceCents < 0 || !Number.isInteger(input.priceCents)) {
      throw new Error("priceCents must be a non-negative integer");
    }
    return this.catalog.createProduct(input);
  }

  /** Merchants always read the fresh record, including drafts. */
  async listForAdmin(storeId: string): Promise<readonly Product[]> {
    return this.catalog.listProducts(storeId);
  }

  /**
   * Buyers use a separate projection. This seam is deliberately cache-ready,
   * while the admin path above remains consistency-first and uncached.
   */
  async readForStorefront(storeId: string, handle: string): Promise<ProductCard | undefined> {
    const product = await this.catalog.findProductByHandle(storeId, handle);
    if (!product || product.status !== "active") return undefined;
    return {
      handle: product.handle,
      title: product.title,
      priceCents: product.priceCents,
    };
  }
}
