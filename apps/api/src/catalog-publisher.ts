export interface StorefrontRevalidator {
  revalidatePath(path: string): Promise<void>;
}

export class CatalogPublisher {
  constructor(private readonly storefront: StorefrontRevalidator) {}
  async productPublished(handle: string) {
    await this.storefront.revalidatePath(`/products/${handle}`);
  }
}
