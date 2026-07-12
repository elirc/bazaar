import { CheckoutForm } from "./checkout-form";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return <section><h1>Checkout</h1><p>Price and inventory are revalidated before charge.</p><CheckoutForm /></section>;
}
