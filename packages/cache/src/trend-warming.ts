export class TrendWarmer {
  readonly #misses = new Map<string, number[]>();
  readonly #lastWarmed = new Map<string, number>();
  constructor(
    private readonly warm: (key: string) => Promise<void>,
    private readonly threshold = 20,
    private readonly windowMs = 10_000,
    private readonly cooldownMs = 60_000,
    private readonly now: () => number = Date.now,
  ) {}

  async recordMiss(key: string) {
    const now = this.now();
    const recent = [...(this.#misses.get(key) ?? []), now].filter((seen) => now - seen <= this.windowMs);
    this.#misses.set(key, recent);
    if (recent.length < this.threshold || now - (this.#lastWarmed.get(key) ?? -Infinity) < this.cooldownMs) return false;
    this.#lastWarmed.set(key, now);
    this.#misses.set(key, []);
    await this.warm(key);
    return true;
  }
}
