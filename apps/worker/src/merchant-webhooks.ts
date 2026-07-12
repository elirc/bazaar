import { createHmac } from "node:crypto";

export type MerchantDelivery = Readonly<{
  id: string;
  url: string;
  secret: string;
  body: string;
  attempt: number;
}>;

export interface MerchantDeliveryPort {
  post(input: { url: string; body: string; headers: Readonly<Record<string, string>> }): Promise<{ status: number }>;
  retry(delivery: MerchantDelivery, delayMs: number): Promise<void>;
  deadLetter(delivery: MerchantDelivery, reason: string): Promise<void>;
}

export const webhookSignature = (timestamp: number, body: string, secret: string) =>
  createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");

export class MerchantWebhookWorker {
  constructor(private readonly port: MerchantDeliveryPort, private readonly now: () => number = Date.now) {}

  async deliver(delivery: MerchantDelivery) {
    const timestamp = this.now();
    try {
      const response = await this.port.post({
        url: delivery.url,
        body: delivery.body,
        headers: {
          "content-type": "application/json",
          "x-bazaar-delivery": delivery.id,
          "x-bazaar-timestamp": String(timestamp),
          "x-bazaar-signature": webhookSignature(timestamp, delivery.body, delivery.secret),
        },
      });
      if (response.status >= 200 && response.status < 300) return "delivered" as const;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (delivery.attempt >= 5) {
        await this.port.deadLetter(delivery, error instanceof Error ? error.message : "delivery failed");
        return "dead-lettered" as const;
      }
      await this.port.retry({ ...delivery, attempt: delivery.attempt + 1 }, 1_000 * 2 ** delivery.attempt);
      return "retrying" as const;
    }
  }
}
