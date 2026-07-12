import { describe, expect, it, vi } from "vitest";
import { TrendWarmer } from "./trend-warming.js";

describe("trend warming", () => {
  it("warms once at the acceleration threshold and observes cooldown", async () => {
    let now = 1_000;
    const warm = vi.fn(async () => undefined);
    const subject = new TrendWarmer(warm, 3, 10_000, 60_000, () => now);
    expect(await subject.recordMiss("new-hot-product")).toBe(false);
    expect(await subject.recordMiss("new-hot-product")).toBe(false);
    expect(await subject.recordMiss("new-hot-product")).toBe(true);
    now += 1_000;
    await Promise.all(Array.from({ length: 3 }, () => subject.recordMiss("new-hot-product")));
    expect(warm).toHaveBeenCalledTimes(1);
  });
});
