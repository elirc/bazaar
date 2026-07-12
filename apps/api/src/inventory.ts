import type { InventoryItem } from "@bazaar/db";

export interface InventoryReadWritePort {
  read(itemId: string): Promise<InventoryItem>;
  write(item: InventoryItem): Promise<void>;
}

export class NaiveInventoryService {
  constructor(
    private readonly inventory: InventoryReadWritePort,
    private readonly concurrencyWindow: () => Promise<void> = async () => undefined,
  ) {}

  async reserve(itemId: string, quantity: number) {
    const snapshot = await this.inventory.read(itemId);
    if (snapshot.onHand - snapshot.reserved < quantity) return false;
    await this.concurrencyWindow();
    await this.inventory.write({ ...snapshot, reserved: snapshot.reserved + quantity });
    return true;
  }
}

export interface AtomicInventoryPort {
  tryReserve(itemId: string, quantity: number): Promise<boolean>;
}

export class AtomicInventoryService {
  constructor(private readonly inventory: AtomicInventoryPort) {}
  reserve(itemId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("quantity must be a positive integer");
    return this.inventory.tryReserve(itemId, quantity);
  }
}
