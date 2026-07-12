"use client";

import React, { useState } from "react";

export function CheckoutForm({ amountMinor = 2400, currency = "USD", locale = "en-US" }: { amountMinor?: number; currency?: string; locale?: string }) {
  const [attemptKey] = useState(() => crypto.randomUUID());
  const [submitting, setSubmitting] = useState(false);
  return (
    <form aria-busy={submitting} onSubmit={() => setSubmitting(true)}>
      <input name="idempotencyKey" type="hidden" value={attemptKey} />
      <fieldset><legend>Delivery address</legend><label><span>Street address</span><input autoComplete="street-address" name="street" required /></label></fieldset>
      <fieldset><legend>Payment</legend><label><span>Mock card number</span><input autoComplete="cc-number" inputMode="numeric" name="card" pattern="[0-9 ]+" required /></label></fieldset>
      <section aria-label="Order review"><p>Canvas Market Tote</p><strong>{new Intl.NumberFormat(locale, { style: "currency", currency }).format(amountMinor / 100)} {currency}</strong></section>
      <button disabled={submitting} type="submit">{submitting ? "Placing order…" : "Place order"}</button>
      <p aria-live="assertive" role="status">{submitting ? "Your order is being submitted." : ""}</p>
    </form>
  );
}
