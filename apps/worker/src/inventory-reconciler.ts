export type InventoryTruth = Readonly<{ itemId: string; recordedOnHand: number; recordedReserved: number; shippedUnits: number; activeReservedUnits: number; receivedUnits: number; initialOnHand: number }>;
export type InventoryDrift = Readonly<{ itemId: string; onHandDelta: number; reservedDelta: number }>;

export interface InventoryReconciliationPort {
  loadTruth(): Promise<readonly InventoryTruth[]>;
  recordDrift(drift: InventoryDrift): Promise<void>;
  alert(drift: readonly InventoryDrift[]): Promise<void>;
}

export class InventoryReconciler {
  constructor(private readonly port: InventoryReconciliationPort) {}
  async run() {
    const drift = (await this.port.loadTruth()).map((item) => ({
      itemId: item.itemId,
      onHandDelta: item.initialOnHand + item.receivedUnits - item.shippedUnits - item.recordedOnHand,
      reservedDelta: item.activeReservedUnits - item.recordedReserved,
    })).filter(({ onHandDelta, reservedDelta }) => onHandDelta !== 0 || reservedDelta !== 0);
    await Promise.all(drift.map((item) => this.port.recordDrift(item)));
    if (drift.length) await this.port.alert(drift);
    return drift;
  }
}
