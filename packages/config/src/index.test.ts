import { describe, expect, it } from "vitest";

import { audiencePolicies } from "./index.js";

describe("audience policies", () => {
  it("never permits stale admin reads", () => {
    expect(audiencePolicies.admin.stalenessToleranceSeconds).toBe(0);
  });
});
