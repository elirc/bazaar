import { cartView } from "../../src/cart-view";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const cart = cartView([{ id: "line-1", title: "Canvas Market Tote", quantity: 1, priceSnapshotCents: 2400 }]);
  return <section><h1>Your cart</h1><ul>{cart.lines.map((line) => <li key={line.id}>{line.title}<input aria-label={`${line.title} quantity`} defaultValue={line.quantity} min="0" type="number" /></li>)}</ul><strong>Total ${(cart.totalCents / 100).toFixed(2)}</strong><a href="/checkout">Checkout</a></section>;
}
