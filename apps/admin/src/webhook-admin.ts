export type WebhookDeliveryRow = Readonly<{
  id: string;
  event: string;
  destination: string;
  status: "delivered" | "retrying" | "dead-lettered";
  attempts: number;
  lastAttemptAt: string;
}>;

export function failedDeliveries(rows: readonly WebhookDeliveryRow[]) {
  return rows.filter((row) => row.status !== "delivered");
}
