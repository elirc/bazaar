import { notFound } from "next/navigation";

import { presentProduct, type StorefrontProduct } from "../../../src/product-view";
import { reconcileAvailability } from "../../../src/availability";
import { AddToCart } from "./add-to-cart";
import { ProductMedia } from "./product-media";
import { productStructuredData, safeJsonLd } from "../../../src/seo";

// Buyers receive static speed while the catalog refreshes within the documented
// 60-second tolerance. Transactional price truth still belongs to checkout.
export const revalidate = 60;
export const dynamicParams = true;

const catalog: readonly StorefrontProduct[] = [
  {
    handle: "canvas-market-tote",
    title: "Canvas Market Tote",
    description: "A sturdy everyday carry for market mornings.",
    priceCents: 2400,
  },
];

export function generateStaticParams() {
  return catalog.map(({ handle }) => ({ handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = catalog.find((candidate) => candidate.handle === handle);
  if (!product) return {};
  const canonical = `https://bazaar.example/products/${product.handle}`;
  return { title: product.title, description: product.description, alternates: { canonical }, openGraph: { title: product.title, description: product.description, url: canonical, type: "website" as const } };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = catalog.find((candidate) => candidate.handle === handle);
  if (!product) notFound();
  const view = presentProduct(product);

  return (
    <article aria-labelledby="product-title">
      <script dangerouslySetInnerHTML={{ __html: safeJsonLd(productStructuredData(product, "https://bazaar.example")) }} type="application/ld+json" />
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span aria-current="page">{view.title}</span></nav>
      <p>Storefront read model</p>
      <h1 id="product-title">{view.title}</h1>
      <ProductMedia title={view.title} />
      <p>{view.description}</p>
      <p><strong>{view.formattedPrice}</strong></p>
      <p data-authoritative="false">{reconcileAvailability("in_stock", undefined).message}</p>
      <AddToCart handle={view.handle} />
    </article>
  );
}
