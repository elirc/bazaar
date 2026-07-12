import { paginateProducts } from "../../../src/collection-view";
import { demoCollectionProducts } from "../../../src/demo-catalog";

export const revalidate = 60;

export function generateStaticParams() {
  return [{ handle: "market-favorites" }];
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const result = paginateProducts(demoCollectionProducts, 1, 12);
  return (
    <section aria-labelledby="collection-title">
      <h1 id="collection-title">{handle.replaceAll("-", " ")}</h1>
      <p>Page {result.page} of {result.pageCount}</p>
      <ul>{result.products.map((product) => <li key={product.handle}><a href={`/products/${product.handle}`}>{product.title}</a></li>)}</ul>
      {result.pageCount > 1 ? <nav aria-label="Collection pagination"><a href={`/collections/${handle}/page/2`} rel="next">Next page</a></nav> : null}
    </section>
  );
}
