"use client";

import React, { useState } from "react";

export function CheckoutForm() {
  const [attemptKey] = useState(() => crypto.randomUUID());
  const [submitting, setSubmitting] = useState(false);
  return (
    <form onSubmit={() => setSubmitting(true)}>
      <input name="idempotencyKey" type="hidden" value={attemptKey} />
      <fieldset><legend>Address</legend><label>Street<input name="street" required /></label></fieldset>
      <fieldset><legend>Payment</legend><label>Mock card<input inputMode="numeric" name="card" required /></label></fieldset>
      <section aria-label="Order review"><p>Canvas Market Tote</p><strong>$24.00 USD</strong></section>
      <button disabled={submitting} type="submit">{submitting ? "Placing order…" : "Place order"}</button>
    </form>
  );
}
