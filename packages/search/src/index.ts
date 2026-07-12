export type SearchDocument = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  options: Readonly<Record<string, readonly string[]>>;
  collectionHandles: readonly string[];
  available: boolean;
  createdAt: Date;
};

export type SearchHit = SearchDocument & { score: number; snippet: string };

export function searchCatalog(
  documents: readonly SearchDocument[],
  query: string,
): readonly SearchHit[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return documents
    .map((document) => {
      const title = document.title.toLocaleLowerCase();
      const description = document.description.toLocaleLowerCase();
      const score = terms.reduce(
        (total, term) => total + (title.includes(term) ? 3 : 0) + (description.includes(term) ? 1 : 0),
        0,
      );
      return { ...document, score, snippet: document.description.slice(0, 140) };
    })
    .filter((document) => terms.length === 0 || document.score > 0)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
}
