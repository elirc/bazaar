import { describe, expect, it, vi } from "vitest";
import { CheckoutDegradationService } from "./degradation.js";
import { AtomicInventoryService } from "./inventory.js";

describe("Black Friday deterministic incident drill", () => {
  it("keeps stock correct and queues winners without charging during provider degradation", async () => {
    let stock = 100;
    const inventory = new AtomicInventoryService({
      tryReserve: async (_item, quantity) => stock >= quantity ? (stock -= quantity, true) : false,
      release: async (_item, quantity) => { stock += quantity; },
    });
    const enqueue = vi.fn(async ({ idempotencyKey }: { idempotencyKey: string }) => ({ pendingId: `pending:${idempotencyKey}` }));
    const degradation = new CheckoutDegradationService({ available: async () => false }, { enqueue });

    const reservations = await Promise.all(Array.from({ length: 10_000 }, (_, index) => inventory.reserve("trending-product", 1).then((won) => ({ won, index }))));
    const winners = reservations.filter(({ won }) => won);
    const outcomes = await Promise.all(winners.map(({ index }) => degradation.beforeCharge(`cart:${index}`, `attempt:${index}`)));

    expect(winners).toHaveLength(100);
    expect(stock).toBe(0);
    expect(outcomes.every(({ mode }) => mode === "pending")).toBe(true);
    expect(enqueue).toHaveBeenCalledTimes(100);
  });
});
