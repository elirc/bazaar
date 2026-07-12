import { describe, expect, it, vi } from "vitest";

import { BazaarWorker } from "./index.js";

describe("worker", () => {
  it("dispatches a typed catalog job", async () => {
    const handler = vi.fn(async () => undefined);
    const worker = new BazaarWorker({ "catalog.index": handler });
    const job = { name: "catalog.index", productId: "p1" } as const;

    await worker.process(job);

    expect(handler).toHaveBeenCalledWith(job);
  });
});
