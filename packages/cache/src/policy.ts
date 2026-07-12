export type CachePath = "product" | "collection" | "search" | "admin";

export const cachePolicy: Readonly<Record<CachePath, { cache: boolean; ttlSeconds: number; keyScope: "entity" | "query" | "none" }>> = {
  product: { cache: true, ttlSeconds: 300, keyScope: "entity" },
  collection: { cache: true, ttlSeconds: 120, keyScope: "entity" },
  search: { cache: true, ttlSeconds: 30, keyScope: "query" },
  // Merchant reads are low-reuse and consistency-sensitive; measuring showed
  // no useful shared hit rate, so this path deliberately bypasses the cache.
  admin: { cache: false, ttlSeconds: 0, keyScope: "none" },
};

export function normalizedQueryKey(storeId: string, query: URLSearchParams) {
  const stable = [...query.entries()].sort(([aKey, aValue], [bKey, bValue]) => aKey.localeCompare(bKey) || aValue.localeCompare(bValue));
  return `bazaar:v1:store:${storeId}:search:${new URLSearchParams(stable).toString()}`;
}
