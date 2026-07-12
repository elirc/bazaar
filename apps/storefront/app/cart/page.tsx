import { cartView } from "../../src/cart-view";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const cart = cartView([{ id: "line-1", title: "Canvas Market Tote", quantity: 1, priceSnapshotCents: 2400 }]);
  return <section aria-labelledby="cart-heading"><h1 id="cart-heading">Your cart</h1><form><ul>{cart.lines.map((line) => <li key={line.id}><span>{line.title}</span><label>Quantity<input defaultValue={line.quantity} inputMode="numeric" min="0" name={`quantity-${line.id}`} type="number" /></label></li>)}</ul><p aria-live="polite"><strong>Total ${(cart.totalCents / 100).toFixed(2)}</strong></p><button type="submit">Update cart</button></form><a href="/checkout">Continue to checkout</a></section>;
}
