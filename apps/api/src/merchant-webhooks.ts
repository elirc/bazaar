import { randomBytes } from "node:crypto";

export type MerchantWebhookSubscription = Readonly<{
  id: string;
  storeId: string;
  url: string;
  events: readonly string[];
  secret: string;
  active: boolean;
}>;

export function createWebhookSubscription(input: { id: string; storeId: string; url: string; events: readonly string[] }): MerchantWebhookSubscription {
  const url = new URL(input.url);
  if (url.protocol !== "https:") throw new Error("Webhook destinations must use HTTPS");
  if (!input.events.length) throw new Error("Choose at least one webhook event");
  return { ...input, url: url.toString(), secret: randomBytes(32).toString("hex"), active: true };
}
