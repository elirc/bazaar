import type { InventoryReservation } from "@bazaar/db";

export interface ReservationExpiryPort {
  findExpired(now: Date, limit: number): Promise<readonly InventoryReservation[]>;
  releaseIfActive(reservation: InventoryReservation): Promise<boolean>;
}

export class ReservationExpiryWorker {
  constructor(private readonly reservations: ReservationExpiryPort, private readonly now: () => Date = () => new Date()) {}
  async sweep(limit = 100) {
    const expired = await this.reservations.findExpired(this.now(), limit);
    const released = await Promise.all(expired.map((reservation) => this.reservations.releaseIfActive(reservation)));
    return released.filter(Boolean).length;
  }
}
