export type InventoryEffect = Readonly<{
  inventoryItemId: string;
  quantity: number;
}>;

export interface InventoryEffectPort {
  /** Claims the operation and applies all deltas in the same database transaction. */
  applyOnce(input: {
    idempotencyKey: string;
    reservedDelta: number;
    onHandDelta: number;
    lines: readonly InventoryEffect[];
  }): Promise<"applied" | "replayed">;
}

export class InventoryEffectService {
  constructor(private readonly port: InventoryEffectPort) {}

  ship(idempotencyKey: string, lines: readonly InventoryEffect[]) {
    return this.apply(idempotencyKey, lines, -1, -1);
  }

  cancel(idempotencyKey: string, lines: readonly InventoryEffect[]) {
    return this.apply(idempotencyKey, lines, -1, 0);
  }

  return(idempotencyKey: string, lines: readonly InventoryEffect[]) {
    return this.apply(idempotencyKey, lines, 0, 1);
  }

  private apply(idempotencyKey: string, lines: readonly InventoryEffect[], reservedDelta: number, onHandDelta: number) {
    if (!idempotencyKey) throw new Error("Inventory effects require an idempotency key");
    if (!lines.length || lines.some((line) => !Number.isInteger(line.quantity) || line.quantity <= 0)) {
      throw new Error("Inventory effects require positive integer quantities");
    }
    return this.port.applyOnce({ idempotencyKey, lines, reservedDelta, onHandDelta });
  }
}
