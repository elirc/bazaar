import { describe, expect, it } from "vitest";
import { TokenBucket } from "./rate-limit.js";

describe("token bucket", () => {
  it("limits a stable identity and refills over time", () => {
    let now = 0;
    const bucket = new TokenBucket({ capacity: 2, refillPerSecond: 1 }, () => now);
    expect(bucket.take("buyer").allowed).toBe(true);
    expect(bucket.take("buyer").allowed).toBe(true);
    expect(bucket.take("buyer").allowed).toBe(false);
    now = 1_000;
    expect(bucket.take("buyer").allowed).toBe(true);
  });
});
