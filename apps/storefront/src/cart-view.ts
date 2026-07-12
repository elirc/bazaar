export type CartViewLine = { id: string; title: string; quantity: number; priceSnapshotCents: number };
export function cartView(lines: readonly CartViewLine[]) {
  return { lines, totalCents: lines.reduce((total, line) => total + line.priceSnapshotCents * line.quantity, 0) };
}
