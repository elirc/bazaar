export type StorefrontProduct = {
  handle: string;
  title: string;
  description: string;
  priceCents: number;
};

export function presentProduct(product: StorefrontProduct) {
  return {
    ...product,
    formattedPrice: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(product.priceCents / 100),
  };
}
