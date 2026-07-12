import { paginateProducts } from "../../../../../src/collection-view";
import { demoCollectionProducts } from "../../../../../src/demo-catalog";

export const revalidate = 60;

export function generateStaticParams() {
  return [{ handle: "market-favorites", page: "2" }];
}

export default async function PaginatedCollectionPage({
  params,
}: {
  params: Promise<{ handle: string; page: string }>;
}) {
  const { handle, page } = await params;
  const result = paginateProducts(demoCollectionProducts, Number(page), 12);
  return (
    <section>
      <h1>{handle.replaceAll("-", " ")}</h1>
      <p>Page {result.page} of {result.pageCount}</p>
      <ul>{result.products.map((product) => <li key={product.handle}>{product.title}</li>)}</ul>
      <a href={`/collections/${handle}`}>First page</a>
    </section>
  );
}
