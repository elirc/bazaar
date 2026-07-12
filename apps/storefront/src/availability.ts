export type AvailabilityHint = "in_stock" | "low_stock" | "out_of_stock";

export function availabilityCopy(hint: AvailabilityHint): string {
  switch (hint) {
    case "in_stock": return "In stock";
    case "low_stock": return "Low stock — availability confirmed when reserved";
    case "out_of_stock": return "Sold out";
  }
}
