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

export type EngineDocument = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  collections: readonly string[];
  optionValues: readonly string[];
  available: boolean;
  createdAtEpoch: number;
};

export const typesenseProductSchema = {
  name: "products",
  fields: [
    { name: "title", type: "string" }, { name: "description", type: "string" },
    { name: "priceCents", type: "int32", facet: true }, { name: "collections", type: "string[]", facet: true },
    { name: "optionValues", type: "string[]", facet: true }, { name: "available", type: "bool", facet: true },
    { name: "createdAtEpoch", type: "int64", sort: true },
  ],
} as const;

export function toEngineDocument(document: SearchDocument): EngineDocument {
  return {
    id: document.id, title: document.title, description: document.description,
    priceCents: document.priceCents, collections: document.collectionHandles,
    optionValues: Object.entries(document.options).flatMap(([name, values]) => values.map((value) => `${name}:${value}`)),
    available: document.available, createdAtEpoch: document.createdAt.getTime(),
  };
}

export type EngineSearchRequest = {
  query: string;
  collections?: readonly string[];
  optionValues?: readonly string[];
  available?: boolean;
  sort?: "relevance" | "price_asc" | "price_desc" | "newest";
  page: number;
  perPage: number;
};
export type EngineSearchResponse = {
  hits: readonly EngineDocument[];
  found: number;
  facets: Readonly<Record<string, Readonly<Record<string, number>>>>;
};
export interface SearchEnginePort { search(request: EngineSearchRequest): Promise<EngineSearchResponse>; }

export class EngineSearchService {
  constructor(private readonly engine: SearchEnginePort) {}
  search(request: EngineSearchRequest) {
    return this.engine.search({ ...request, query: request.query.trim() || "*" });
  }
}

export type BrowseFilter =
  | { op: "price_between"; minimumCents: number; maximumCents: number }
  | { op: "collection_is"; handle: string }
  | { op: "option_has"; name: string; value: string }
  | { op: "available_is"; value: boolean };

function matchesFilter(document: SearchDocument, filter: BrowseFilter): boolean {
  switch (filter.op) {
    case "price_between": return document.priceCents >= filter.minimumCents && document.priceCents <= filter.maximumCents;
    case "collection_is": return document.collectionHandles.includes(filter.handle);
    case "option_has": return document.options[filter.name]?.includes(filter.value) ?? false;
    case "available_is": return document.available === filter.value;
  }
}

export function browseCatalog(documents: readonly SearchDocument[], filters: readonly BrowseFilter[]) {
  const results = documents.filter((document) => filters.every((filter) => matchesFilter(document, filter)));
  const collectionCounts = new Map<string, number>();
  for (const document of results) {
    for (const handle of document.collectionHandles) {
      collectionCounts.set(handle, (collectionCounts.get(handle) ?? 0) + 1);
    }
  }
  return { results, facets: { collections: collectionCounts } };
}

export type SearchSort = "relevance" | "price_asc" | "price_desc" | "newest";

export function sortAndPage(
  hits: readonly SearchHit[],
  sort: SearchSort,
  afterId: string | undefined,
  limit = 24,
) {
  const ordered = [...hits].sort((left, right) => {
    if (sort === "price_asc") return left.priceCents - right.priceCents || left.id.localeCompare(right.id);
    if (sort === "price_desc") return right.priceCents - left.priceCents || left.id.localeCompare(right.id);
    if (sort === "newest") return right.createdAt.getTime() - left.createdAt.getTime() || left.id.localeCompare(right.id);
    return right.score - left.score || left.id.localeCompare(right.id);
  });
  const start = afterId ? Math.max(0, ordered.findIndex((hit) => hit.id === afterId) + 1) : 0;
  const items = ordered.slice(start, start + limit);
  return { items, nextCursor: items.length === limit ? items.at(-1)?.id : undefined };
}

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
