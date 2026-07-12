import type { InventoryItem } from "@bazaar/db";
import { describe, expect, it } from "vitest";
import { AtomicInventoryService, type AtomicInventoryPort, type InventoryReadWritePort } from "./inventory.js";

class MemoryInventory implements InventoryReadWritePort, AtomicInventoryPort {
  constructor(public item: InventoryItem) {}
  async read() { return structuredClone(this.item); }
  async write(item: InventoryItem) { this.item = structuredClone(item); }
  async tryReserve(_itemId: string, quantity: number) {
    if (this.item.onHand - this.item.reserved < quantity) return false;
    this.item = { ...this.item, reserved: this.item.reserved + quantity };
    return true;
  }
  async release(_itemId: string, quantity: number) {
    this.item = { ...this.item, reserved: this.item.reserved - quantity };
  }
}

describe("inventory concurrency", () => {
  it("never lets two buyers reserve the last unit", async () => {
    const store = new MemoryInventory({ id: "i1", variantId: "v1", locationId: "l1", onHand: 1, reserved: 0 });
    const service = new AtomicInventoryService(store);

    const results = await Promise.all([service.reserve("i1", 1), service.reserve("i1", 1)]);

    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("allows exactly M successes for N concurrent buyers and M stock", async () => {
    const store = new MemoryInventory({ id: "hot", variantId: "v1", locationId: "l1", onHand: 17, reserved: 0 });
    const service = new AtomicInventoryService(store);
    const results = await Promise.all(Array.from({ length: 100 }, () => service.reserve("hot", 1)));
    expect(results.filter(Boolean)).toHaveLength(17);
    expect(store.item.reserved).toBe(17);
    expect(store.item.reserved).toBeLessThanOrEqual(store.item.onHand);
  });
});
