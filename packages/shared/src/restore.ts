export type RestoreManifest = Readonly<{ backupId: string; completedAt: string; restoredAt: string; orderCount: number; inventoryItemCount: number; paymentCount: number; checksumMatches: boolean; redisRebuilt: boolean }>;

export function verifyRestore(manifest: RestoreManifest) {
  const failures: string[] = [];
  if (!manifest.checksumMatches) failures.push("Postgres checksum mismatch");
  if (manifest.orderCount < 0 || manifest.inventoryItemCount < 0 || manifest.paymentCount < 0) failures.push("Invalid authoritative row counts");
  if (!manifest.redisRebuilt) failures.push("Derived Redis cache was not rebuilt");
  if (manifest.restoredAt < manifest.completedAt) failures.push("Restore timestamp precedes backup completion");
  return { passed: failures.length === 0, failures };
}
