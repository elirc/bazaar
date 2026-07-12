import type { InventoryItem } from "@bazaar/db";
import { describe, expect, it } from "vitest";
import { NaiveInventoryService, type InventoryReadWritePort } from "./inventory.js";

class MemoryInventory implements InventoryReadWritePort {
  constructor(public item: InventoryItem) {}
  async read() { return structuredClone(this.item); }
  async write(item: InventoryItem) { this.item = structuredClone(item); }
}

describe("inventory concurrency", () => {
  it("never lets two buyers reserve the last unit", async () => {
    const store = new MemoryInventory({ id: "i1", variantId: "v1", locationId: "l1", onHand: 1, reserved: 0 });
    let arrived = 0;
    let openGate!: () => void;
    const gate = new Promise<void>((resolve) => { openGate = resolve; });
    const service = new NaiveInventoryService(store, async () => {
      arrived += 1;
      if (arrived === 2) openGate();
      await gate;
    });

    const results = await Promise.all([service.reserve("i1", 1), service.reserve("i1", 1)]);

    expect(results.filter(Boolean)).toHaveLength(1);
  });
});
