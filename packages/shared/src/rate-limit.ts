export type RateLimitPolicy = Readonly<{ capacity: number; refillPerSecond: number }>;

export const commerceRateLimits = {
  checkout: { capacity: 5, refillPerSecond: 0.2 },
  discountValidation: { capacity: 20, refillPerSecond: 1 },
  addToCart: { capacity: 30, refillPerSecond: 2 },
} satisfies Record<string, RateLimitPolicy>;

export class TokenBucket {
  readonly #buckets = new Map<string, { tokens: number; updatedAt: number }>();
  constructor(private readonly policy: RateLimitPolicy, private readonly now: () => number = Date.now) {}

  take(identity: string) {
    if (!identity) return { allowed: false, retryAfterSeconds: 1 };
    const now = this.now();
    const previous = this.#buckets.get(identity) ?? { tokens: this.policy.capacity, updatedAt: now };
    const tokens = Math.min(this.policy.capacity, previous.tokens + (now - previous.updatedAt) / 1000 * this.policy.refillPerSecond);
    if (tokens < 1) {
      this.#buckets.set(identity, { tokens, updatedAt: now });
      return { allowed: false, retryAfterSeconds: Math.ceil((1 - tokens) / this.policy.refillPerSecond) };
    }
    this.#buckets.set(identity, { tokens: tokens - 1, updatedAt: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
