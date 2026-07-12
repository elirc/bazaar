export type StorefrontProduct = {
  handle: string;
  title: string;
  description: string;
  priceCents: number;
};

export function presentProduct(product: StorefrontProduct, locale = "en-US", currency = "USD") {
  return {
    ...product,
    formattedPrice: new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(product.priceCents / 100),
  };
}
