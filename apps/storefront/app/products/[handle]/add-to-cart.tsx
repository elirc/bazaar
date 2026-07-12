"use client";

import { useState } from "react";

export function AddToCart({ handle }: { handle: string }) {
  const [added, setAdded] = useState(false);
  return <>
    <button aria-describedby="cart-update" disabled={added} onClick={() => setAdded(true)} type="button">{added ? "Added to cart" : "Add to cart"}</button>
    <p aria-live="polite" id="cart-update" role="status">{added ? `${handle} was added to your cart.` : ""}</p>
  </>;
}
