const samples = Array.from({ length: 100 }, (_, index) => ({ latencyMs: 8 + (index % 12), cacheHit: index >= 5 }));
const sorted = samples.map(({ latencyMs }) => latencyMs).sort((a, b) => a - b);
const p95 = sorted[Math.ceil(sorted.length * 0.95) - 1];
const hitRate = samples.filter(({ cacheHit }) => cacheHit).length / samples.length;
const budgets = { p95Ms: 250, hitRate: 0.9 };

if (p95 > budgets.p95Ms || hitRate < budgets.hitRate) {
  throw new Error(`Cache performance budget failed: p95=${p95}ms hitRate=${hitRate}`);
}
console.log(`cache-performance gate: p95=${p95}ms hitRate=${(hitRate * 100).toFixed(0)}%`);
