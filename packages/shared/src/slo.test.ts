import { describe, expect, it } from "vitest";
import { evaluateCheckoutSlo } from "./slo.js";

describe("checkout success SLO", () => {
  it("pages immediately on a high-volume revenue drop", () => {
    expect(evaluateCheckoutSlo({ attempts: 1000, successes: 950, durationMinutes: 5 })).toMatchObject({ ratio: 0.95, page: true, ticket: true });
  });
  it("does not page on an empty low-traffic window", () => {
    expect(evaluateCheckoutSlo({ attempts: 0, successes: 0, durationMinutes: 5 }).page).toBe(false);
  });
});
