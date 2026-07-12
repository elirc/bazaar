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
