import { describe, expect, it } from "vitest";

import { productRows } from "./catalog-admin.js";

describe("admin catalog", () => {
  it("renders operational status alongside money", () => {
    expect(
      productRows([{ id: "p1", title: "Tote", status: "draft", priceCents: 2400 }]),
    ).toEqual([
      {
        id: "p1",
        title: "Tote",
        status: "draft",
        priceCents: 2400,
        formattedPrice: "$24.00",
      },
    ]);
  });
});
