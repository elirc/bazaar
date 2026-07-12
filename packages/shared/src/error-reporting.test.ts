import { describe, expect, it, vi } from "vitest";
import { PiiSafeErrorReporter } from "./error-reporting.js";

describe("PII-safe error reporting", () => {
  it("sends opaque commerce identifiers and operation only", () => {
    const captureException = vi.fn(() => "event");
    new PiiSafeErrorReporter({ captureException }).capture(new Error("declined"), { app: "api", traceId: "t1", orderId: "o1", operation: "payment.charge" });
    expect(captureException).toHaveBeenCalledWith(expect.any(Error), { contexts: { commerce: { app: "api", traceId: "t1", orderId: "o1", operation: "payment.charge" } } });
  });
});
