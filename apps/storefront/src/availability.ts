export type AvailabilityHint = "in_stock" | "low_stock" | "out_of_stock";

export function availabilityCopy(hint: AvailabilityHint): string {
  switch (hint) {
    case "in_stock": return "In stock";
    case "low_stock": return "Low stock — availability confirmed when reserved";
    case "out_of_stock": return "Sold out";
  }
}

export function reconcileAvailability(cachedHint: AvailabilityHint, reservationAccepted: boolean | undefined) {
  if (reservationAccepted === false) return { authoritative: true, message: "Sold out while you were shopping" };
  if (reservationAccepted === true) return { authoritative: true, message: "Reserved for checkout" };
  return { authoritative: false, message: availabilityCopy(cachedHint) };
}
