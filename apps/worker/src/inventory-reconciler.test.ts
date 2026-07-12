import { describe, expect, it, vi } from "vitest";
import { InventoryReconciler } from "./inventory-reconciler.js";

describe("inventory reconciliation", () => {
  it("alarms on reserved and on-hand drift against order truth", async () => {
    const alert = vi.fn(async () => undefined);
    const drift = await new InventoryReconciler({
      loadTruth: async () => [{ itemId: "hot", initialOnHand: 100, receivedUnits: 0, shippedUnits: 40, recordedOnHand: 61, activeReservedUnits: 5, recordedReserved: 7 }],
      recordDrift: async () => undefined,
      alert,
    }).run();
    expect(drift).toEqual([{ itemId: "hot", onHandDelta: -1, reservedDelta: -2 }]);
    expect(alert).toHaveBeenCalledOnce();
  });
});
