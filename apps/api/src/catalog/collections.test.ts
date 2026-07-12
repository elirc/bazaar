import type { Product } from "@bazaar/db";
import { describe, expect, it } from "vitest";

import { matchesSmartRule } from "./collections.js";

const product: Product = {
  id: "p1",
  storeId: "s1",
  title: "Canvas Market Tote",
  handle: "canvas-market-tote",
  description: "",
  priceCents: 2400,
  status: "active",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("smart collection evaluation", () => {
  it("requires every child of an all rule to match", () => {
    expect(matchesSmartRule(product, {
      op: "all",
      rules: [
        { op: "title_contains", value: "tote" },
        { op: "price_between", minimumCents: 2000, maximumCents: 3000 },
        { op: "status_is", value: "active" },
      ],
    })).toBe(true);
  });
});
