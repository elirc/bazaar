"use client";

import { useState } from "react";

export function AddToCart({ handle }: { handle: string }) {
  const [added, setAdded] = useState(false);
  return (
    <button onClick={() => setAdded(true)} type="button">
      {added ? `${handle} added — view cart` : "Add to cart"}
    </button>
  );
}
