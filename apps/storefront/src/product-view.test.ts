import { describe, expect, it } from "vitest";

import { presentProduct } from "./product-view.js";

describe("product view", () => {
  it("formats the buyer-facing price", () => {
    expect(
      presentProduct({
        handle: "tote",
        title: "Tote",
        description: "Market-ready",
        priceCents: 2400,
      }).formattedPrice,
    ).toBe("$24.00");
  });
});
