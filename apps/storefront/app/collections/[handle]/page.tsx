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
    <section>
      <h1>{handle.replaceAll("-", " ")}</h1>
      <p>Page {result.page} of {result.pageCount}</p>
      <ul>{result.products.map((product) => <li key={product.handle}><a href={`/products/${product.handle}`}>{product.title}</a></li>)}</ul>
      {result.pageCount > 1 ? <a href={`/collections/${handle}/page/2`}>Next page</a> : null}
    </section>
  );
}
