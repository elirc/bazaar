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
  delete(key: string) { return this.store.delete(key); }
}

export class InMemoryCacheStore implements CacheStore {
  readonly #values = new Map<string, unknown>();
  async get<T>(key: string) { return this.#values.get(key) as T | undefined; }
  async set<T>(key: string, value: T) { this.#values.set(key, value); }
  async delete(key: string) { this.#values.delete(key); }
}

export interface CacheTagIndex {
  attach(key: string, tags: readonly string[]): Promise<void>;
  keysFor(tag: string): Promise<readonly string[]>;
  detach(key: string): Promise<void>;
}

export class InMemoryTagIndex implements CacheTagIndex {
  readonly #tagKeys = new Map<string, Set<string>>();
  async attach(key: string, tags: readonly string[]) {
    for (const tag of tags) {
      const keys = this.#tagKeys.get(tag) ?? new Set<string>();
      keys.add(key);
      this.#tagKeys.set(tag, keys);
    }
  }
  async keysFor(tag: string) { return [...(this.#tagKeys.get(tag) ?? [])]; }
  async detach(key: string) {
    for (const keys of this.#tagKeys.values()) keys.delete(key);
  }
}

export class TaggedCache {
  constructor(
    private readonly cache: ReadThroughCache,
    private readonly tags: CacheTagIndex,
  ) {}

  async read<T>(key: string, entryTags: readonly string[], ttlSeconds: number, load: () => Promise<T>) {
    const value = await this.cache.read(key, ttlSeconds, load);
    await this.tags.attach(key, entryTags);
    return value;
  }

  async invalidate(tagsToInvalidate: readonly string[]) {
    const keys = new Set<string>();
    for (const tag of tagsToInvalidate) {
      for (const key of await this.tags.keysFor(tag)) keys.add(key);
    }
    await Promise.all([...keys].map(async (key) => {
      await this.cache.delete(key);
      await this.tags.detach(key);
    }));
    return [...keys];
  }
}

export class SingleFlight {
  readonly #inFlight = new Map<string, Promise<unknown>>();

  run<T>(key: string, load: () => Promise<T>): Promise<T> {
    const existing = this.#inFlight.get(key) as Promise<T> | undefined;
    if (existing) return existing;
    const promise = load().finally(() => this.#inFlight.delete(key));
    this.#inFlight.set(key, promise);
    return promise;
  }
}

export class ProtectedReadThroughCache {
  constructor(
    private readonly cache: ReadThroughCache,
    private readonly singleFlight: SingleFlight,
  ) {}

  read<T>(key: string, ttlSeconds: number, load: () => Promise<T>) {
    return this.cache.read(key, ttlSeconds, () => this.singleFlight.run(key, load));
  }
}
