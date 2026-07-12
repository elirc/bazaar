import { describe, expect, it, vi } from "vitest";

import { BazaarWorker, ReservationExpiryWorker } from "./index.js";

describe("worker", () => {
  it("dispatches a typed catalog job", async () => {
    const handler = vi.fn(async () => undefined);
    const worker = new BazaarWorker({ "catalog.index": handler });
    const job = { name: "catalog.index", productId: "p1" } as const;

    await worker.process(job);

    expect(handler).toHaveBeenCalledWith(job);
  });

  it("releases only active expired reservations", async () => {
    const releaseIfActive = vi.fn(async () => true);
    const worker = new ReservationExpiryWorker({
      findExpired: async () => [{ id: "r1", inventoryItemId: "i1", cartId: "c1", quantity: 1, status: "active", expiresAt: new Date(0) }],
      releaseIfActive,
    }, () => new Date(1));
    await expect(worker.sweep()).resolves.toBe(1);
    expect(releaseIfActive).toHaveBeenCalledTimes(1);
  });
});
