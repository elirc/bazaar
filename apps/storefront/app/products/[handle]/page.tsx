import { notFound } from "next/navigation";

import { presentProduct, type StorefrontProduct } from "../../../src/product-view";

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
      <p>{view.description}</p>
      <strong>{view.formattedPrice}</strong>
    </article>
  );
}
