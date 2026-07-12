import { notFound } from "next/navigation";
import Image from "next/image";

import { presentProduct, type StorefrontProduct } from "../../../src/product-view";
import { AddToCart } from "./add-to-cart";

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
    <article>
      <p>Storefront read model</p>
      <h1>{view.title}</h1>
      <Image
        alt={`${view.title} product view`}
        height={1200}
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        src="/product-placeholder.svg"
        width={1200}
      />
      <p>{view.description}</p>
      <strong>{view.formattedPrice}</strong>
      <AddToCart handle={view.handle} />
    </article>
  );
}
