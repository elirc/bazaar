export interface StorefrontRevalidator {
  revalidatePath(path: string): Promise<void>;
  invalidateTags(tags: readonly string[]): Promise<void>;
}

export class CatalogPublisher {
  constructor(private readonly storefront: StorefrontRevalidator) {}
  async productPublished(productId: string, handle: string, collectionIds: readonly string[] = []) {
    await this.storefront.invalidateTags([
      `product:${productId}`,
      ...collectionIds.map((id) => `collection:${id}`),
    ]);
    await this.storefront.revalidatePath(`/products/${handle}`);
  }
}
