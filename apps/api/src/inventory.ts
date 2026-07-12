import type { InventoryItem, InventoryReservation } from "@bazaar/db";

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
  release(itemId: string, quantity: number): Promise<void>;
}

export interface ReservationPort {
  create(reservation: InventoryReservation): Promise<void>;
  transition(id: string, from: InventoryReservation["status"], to: InventoryReservation["status"]): Promise<boolean>;
}

export class ReservationService {
  constructor(
    private readonly inventory: AtomicInventoryPort,
    private readonly reservations: ReservationPort,
    private readonly idFactory: () => string,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async hold(itemId: string, cartId: string, quantity: number, ttlMs: number) {
    if (!(await this.inventory.tryReserve(itemId, quantity))) return undefined;
    const reservation: InventoryReservation = {
      id: this.idFactory(), inventoryItemId: itemId, cartId, quantity,
      status: "active", expiresAt: new Date(this.now().getTime() + ttlMs),
    };
    await this.reservations.create(reservation);
    return reservation;
  }

  async release(reservation: InventoryReservation) {
    const changed = await this.reservations.transition(reservation.id, "active", "released");
    if (changed) await this.inventory.release(reservation.inventoryItemId, reservation.quantity);
    return changed;
  }
}

export class AtomicInventoryService {
  constructor(private readonly inventory: AtomicInventoryPort) {}
  reserve(itemId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("quantity must be a positive integer");
    return this.inventory.tryReserve(itemId, quantity);
  }
}
