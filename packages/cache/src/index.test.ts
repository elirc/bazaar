import { describe, expect, it, vi } from "vitest";
import { InMemoryCacheStore, ReadThroughCache } from "./index.js";

describe("read-through cache", () => {
  it("loads once across sequential reads", async () => {
    const load = vi.fn(async () => ({ title: "Tote" }));
    const cache = new ReadThroughCache(new InMemoryCacheStore());
    await cache.read("product:p1", 60, load);
    await cache.read("product:p1", 60, load);
    expect(load).toHaveBeenCalledTimes(1);
  });
});
