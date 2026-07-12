import { describe, expect, it, vi } from "vitest";
import {
  CacheMetrics,
  InMemoryCacheStore,
  InMemoryStaleEntryStore,
  InMemoryTagIndex,
  ProtectedReadThroughCache,
  ReadThroughCache,
  SingleFlight,
  StaleWhileRevalidateCache,
  TaggedCache,
  HotSetWarmer,
  normalizedQueryKey,
} from "./index.js";

describe("read-through cache", () => {
  it("loads once across sequential reads", async () => {
    const load = vi.fn(async () => ({ title: "Tote" }));
    const cache = new ReadThroughCache(new InMemoryCacheStore());
    await cache.read("product:p1", 60, load);
    await cache.read("product:p1", 60, load);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("invalidates every projection carrying a product tag", async () => {
    const load = vi.fn(async () => ({ priceCents: 2400 }));
    const base = new ReadThroughCache(new InMemoryCacheStore());
    const cache = new TaggedCache(base, new InMemoryTagIndex());
    await cache.read("pdp:p1", ["product:p1"], 60, load);
    await cache.invalidate(["product:p1"]);
    await cache.read("pdp:p1", ["product:p1"], 60, load);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("collapses concurrent misses to one origin load", async () => {
    const metrics = new CacheMetrics();
    const load = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      return { title: "Hot product" };
    });
    const cache = new ProtectedReadThroughCache(
      new ReadThroughCache(new InMemoryCacheStore(), metrics),
      new SingleFlight(),
    );
    await Promise.all(Array.from({ length: 25 }, () => cache.read("product:hot", 60, load)));
    expect(load).toHaveBeenCalledTimes(1);
    expect(metrics.snapshot().miss).toBe(25);
  });

  it("collapses a 10,000-reader flash-sale expiry to one origin load", async () => {
    const load = vi.fn(async () => ({ stock: 100 }));
    const cache = new ProtectedReadThroughCache(new ReadThroughCache(new InMemoryCacheStore()), new SingleFlight());
    const results = await Promise.all(Array.from({ length: 10_000 }, () => cache.read("product:sale", 60, load)));
    expect(load).toHaveBeenCalledTimes(1);
    expect(results).toHaveLength(10_000);
    expect(results.every(({ stock }) => stock === 100)).toBe(true);
  });

  it("serves bounded stale data while refreshing in the background", async () => {
    let now = 0;
    let version = 0;
    const cache = new StaleWhileRevalidateCache(
      new InMemoryStaleEntryStore(),
      new SingleFlight(),
      () => now,
    );
    expect(await cache.read("p1", 1, 5, async () => ++version)).toBe(1);
    now = 2_000;
    expect(await cache.read("p1", 1, 5, async () => ++version)).toBe(1);
    await vi.waitFor(() => expect(version).toBe(2));
    expect(await cache.read("p1", 1, 5, async () => ++version)).toBe(2);
  });

  it("warms only the traffic-ranked head", async () => {
    const warm = vi.fn(async () => undefined);
    const resources = Array.from({ length: 60 }, (_, index) => ({ key: `p${index}`, score: index }));
    const warmed = await new HotSetWarmer(warm, 50).deploy(resources);
    expect(warmed).toHaveLength(50);
    expect(warmed[0]).toBe("p59");
    expect(warm).toHaveBeenCalledTimes(50);
  });

  it("normalizes equivalent search query key order", () => {
    expect(normalizedQueryKey("s1", new URLSearchParams("q=tote&page=2")))
      .toBe(normalizedQueryKey("s1", new URLSearchParams("page=2&q=tote")));
  });
});
