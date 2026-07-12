import { JSDOM } from "jsdom";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CheckoutForm } from "../app/checkout/checkout-form";

describe("axe accessibility gate", () => {
  it("finds no automatically detectable checkout violations", async () => {
    const markup = renderToStaticMarkup(<html lang="en"><head><title>Checkout</title></head><body><main><h1>Checkout</h1><CheckoutForm /></main></body></html>);
    const dom = new JSDOM(markup);
    const axe = (await import("axe-core")).default;
    const results = await axe.run(dom.window.document.documentElement, {
      rules: { "color-contrast": { enabled: false } }, // jsdom has no layout engine; browser CI owns contrast.
    });
    expect(results.violations.map(({ id }) => id)).toEqual([]);
  });
});
