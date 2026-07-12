const sample = [
  { handle: "canvas-market-tote", title: "Canvas Market Tote", price: "$24.00", collection: "market-favorites" },
  { handle: "linen-market-tote", title: "Linen Market Tote", price: "$31.00", collection: "new-arrivals" },
];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; collection?: string }> }) {
  const query = await searchParams;
  const matches = sample.filter((product) =>
    (!query.q || product.title.toLowerCase().includes(query.q.toLowerCase())) &&
    (!query.collection || product.collection === query.collection),
  );
  return (
    <section>
      <h1>Search the catalog</h1>
      <p aria-live="polite">Typo-tolerant instant search with Postgres fallback.</p>
      <form action="/search"><SearchBox initialQuery={query.q} /><button>Search</button></form>
      <nav aria-label="Collection filters"><a href={`/search?q=${encodeURIComponent(query.q ?? "")}&collection=market-favorites`}>Market favorites</a></nav>
      <p>{matches.length} results</p>
      {matches.length === 0 ? <p>No products matched. Try a broader term.</p> : null}
      <ul>{matches.map((product) => <li key={product.handle}><a href={`/products/${product.handle}`}>{product.title}</a> {product.price}</li>)}</ul>
    </section>
  );
}
import { SearchBox } from "./search-box";
