import type { InventoryItem, InventoryReservation } from "@bazaar/db";
import { describe, expect, it } from "vitest";
import { allocateAcrossLocations, AtomicInventoryService, ReservationService, type AtomicInventoryPort, type InventoryReadWritePort, type ReservationPort } from "./inventory.js";

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

class MemoryReservations implements ReservationPort {
  records = new Map<string, InventoryReservation>();
  async create(record: InventoryReservation) { this.records.set(record.id, record); }
  async transition(id: string, from: InventoryReservation["status"], to: InventoryReservation["status"]) {
    const record = this.records.get(id);
    if (!record || record.status !== from) return false;
    this.records.set(id, { ...record, status: to });
    return true;
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

  it("releases an expired hold exactly once", async () => {
    const store = new MemoryInventory({ id: "i1", variantId: "v1", locationId: "l1", onHand: 2, reserved: 0 });
    const service = new ReservationService(store, new MemoryReservations(), () => "r1", () => new Date("2026-01-01"));
    const reservation = await service.hold("i1", "cart", 1, 60_000);
    expect(reservation?.expiresAt).toEqual(new Date("2026-01-01T00:01:00.000Z"));
    expect(await service.release(reservation!)).toBe(true);
    expect(await service.release(reservation!)).toBe(false);
    expect(store.item.reserved).toBe(0);
  });

  it("allocates across locations only when aggregate stock is sufficient", () => {
    const items: InventoryItem[] = [
      { id: "a", variantId: "v1", locationId: "west", onHand: 3, reserved: 0 },
      { id: "b", variantId: "v1", locationId: "east", onHand: 2, reserved: 0 },
    ];
    expect(allocateAcrossLocations(items, 4)).toEqual([
      { itemId: "a", locationId: "west", quantity: 3 },
      { itemId: "b", locationId: "east", quantity: 1 },
    ]);
    expect(allocateAcrossLocations(items, 6)).toBeUndefined();
  });
});
