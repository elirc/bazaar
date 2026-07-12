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
