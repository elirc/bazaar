import type { StorefrontProduct } from "./product-view";

export function productStructuredData(product: StorefrontProduct, origin: string) {
  const url = `${origin}/products/${product.handle}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Product", name: product.title, description: product.description, url, offers: { "@type": "Offer", priceCurrency: "USD", price: (product.priceCents / 100).toFixed(2), availability: "https://schema.org/InStock", url } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: origin },
        { "@type": "ListItem", position: 2, name: product.title, item: url },
      ] },
    ],
  };
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
