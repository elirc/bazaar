export interface CacheStore {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class ReadThroughCache {
  constructor(private readonly store: CacheStore) {}

  async read<T>(key: string, ttlSeconds: number, load: () => Promise<T>): Promise<T> {
    const cached = await this.store.get<T>(key);
    if (cached !== undefined) return cached;
    const value = await load();
    await this.store.set(key, value, ttlSeconds);
    return value;
  }
}

export class InMemoryCacheStore implements CacheStore {
  readonly #values = new Map<string, unknown>();
  async get<T>(key: string) { return this.#values.get(key) as T | undefined; }
  async set<T>(key: string, value: T) { this.#values.set(key, value); }
  async delete(key: string) { this.#values.delete(key); }
}
