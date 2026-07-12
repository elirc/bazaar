import { describe, expect, it } from "vitest";

import { availabilityCopy } from "./availability.js";
import { paginateProducts } from "./collection-view.js";
import { renderingPolicies } from "./rendering-policy.js";

describe("route rendering strategy", () => {
  it("caches catalog routes but never the cart", () => {
    expect(renderingPolicies).toMatchInlineSnapshot(`
      {
        "cart": {
          "stalenessToleranceSeconds": 0,
          "strategy": "dynamic",
        },
        "collection": {
          "stalenessToleranceSeconds": 60,
          "strategy": "isr",
        },
        "home": {
          "stalenessToleranceSeconds": Infinity,
          "strategy": "ssg",
        },
        "product": {
          "stalenessToleranceSeconds": 60,
          "strategy": "isr",
        },
      }
    `);
  });

  it("bounds collection pagination and names availability as a hint", () => {
    const result = paginateProducts([], -10, 12);
    expect(result.page).toBe(1);
    expect(availabilityCopy("low_stock")).toContain("confirmed when reserved");
  });
});
