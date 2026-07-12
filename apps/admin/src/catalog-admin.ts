export type AdminProduct = {
  id: string;
  title: string;
  status: "draft" | "active" | "archived";
  priceCents: number;
};

export function productRows(products: readonly AdminProduct[]) {
  return products.map((product) => ({
    ...product,
    formattedPrice: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(product.priceCents / 100),
  }));
}
