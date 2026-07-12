import { describe, expect, it, vi } from "vitest";
import { AtomicInventoryService, ReservationService } from "./inventory.js";

describe("flash-sale inventory", () => {
  it("sells exactly 100 units across 10,000 concurrent attempts", async () => {
    let available = 100;
    const service = new AtomicInventoryService({
      tryReserve: async (_itemId, quantity) => available >= quantity ? (available -= quantity, true) : false,
      release: async (_itemId, quantity) => { available += quantity; },
    });
    const outcomes = await Promise.all(Array.from({ length: 10_000 }, () => service.reserve("hot", 1)));
    expect(outcomes.filter(Boolean)).toHaveLength(100);
    expect(available).toBe(0);
  });

  it("compensates a stock claim when reservation persistence fails", async () => {
    const release = vi.fn(async () => undefined);
    const service = new ReservationService(
      { tryReserve: async () => true, release },
      { create: async () => { throw new Error("database unavailable"); }, transition: async () => false },
      () => "reservation",
    );
    await expect(service.hold("hot", "cart", 1, 30_000)).rejects.toThrow("database unavailable");
    expect(release).toHaveBeenCalledWith("hot", 1);
  });
});
