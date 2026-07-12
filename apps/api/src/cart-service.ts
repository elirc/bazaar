import type { Cart, CartLine } from "@bazaar/db";

export function addCartLine(cart: Cart, line: CartLine): Cart {
  const existing = cart.lines.find((candidate) => candidate.variantId === line.variantId);
  const lines = existing
    ? cart.lines.map((candidate) => candidate.id === existing.id ? { ...candidate, quantity: candidate.quantity + line.quantity } : candidate)
    : [...cart.lines, line];
  return { ...cart, lines, updatedAt: new Date() };
}

export function updateCartLine(cart: Cart, lineId: string, quantity: number): Cart {
  if (!Number.isInteger(quantity) || quantity < 0) throw new Error("quantity must be a non-negative integer");
  const lines = quantity === 0
    ? cart.lines.filter((line) => line.id !== lineId)
    : cart.lines.map((line) => line.id === lineId ? { ...line, quantity } : line);
  return { ...cart, lines, updatedAt: new Date() };
}

export function mergeCarts(guest: Cart, customer: Cart): Cart {
  return guest.lines.reduce<Cart>((merged, line) => addCartLine(merged, line), customer);
}

export interface VariantPriceReader {
  findPricesCents(variantIds: readonly string[]): Promise<ReadonlyMap<string, number>>;
}

export async function calculateCartTotals(cart: Cart, prices: VariantPriceReader) {
  let snapshotTotalCents = 0;
  let currentTotalCents = 0;
  const currentPrices = await prices.findPricesCents([...new Set(cart.lines.map((line) => line.variantId))]);
  for (const line of cart.lines) {
    const currentPrice = currentPrices.get(line.variantId);
    if (currentPrice === undefined) throw new Error(`Variant price unavailable: ${line.variantId}`);
    snapshotTotalCents += line.priceSnapshotCents * line.quantity;
    currentTotalCents += currentPrice * line.quantity;
  }
  return { snapshotTotalCents, currentTotalCents, priceChanged: snapshotTotalCents !== currentTotalCents };
}
