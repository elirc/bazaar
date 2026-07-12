import type { StorefrontProduct } from "./product-view.js";

export function paginateProducts(
  products: readonly StorefrontProduct[],
  page: number,
  pageSize: number,
) {
  const safePage = Math.max(1, Math.floor(page));
  const start = (safePage - 1) * pageSize;
  return {
    page: safePage,
    pageCount: Math.ceil(products.length / pageSize),
    products: products.slice(start, start + pageSize),
  };
}
