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
});
