import { describe, expect, it, vi } from "vitest";
import { MerchantWebhookWorker, webhookSignature, type MerchantDeliveryPort } from "./merchant-webhooks.js";

describe("merchant webhook delivery", () => {
  it("signs the timestamp and exact payload", () => {
    expect(webhookSignature(10, "{}", "secret")).toHaveLength(64);
    expect(webhookSignature(10, "{}", "secret")).not.toBe(webhookSignature(11, "{}", "secret"));
  });

  it("dead-letters the sixth failed attempt", async () => {
    const port: MerchantDeliveryPort = {
      post: vi.fn().mockRejectedValue(new Error("offline")), retry: vi.fn(), deadLetter: vi.fn(),
    };
    const delivery = { id: "d_1", url: "https://example.test", secret: "s", body: "{}", attempt: 5 };
    expect(await new MerchantWebhookWorker(port, () => 10).deliver(delivery)).toBe("dead-lettered");
    expect(port.deadLetter).toHaveBeenCalledWith(delivery, "offline");
    expect(port.retry).not.toHaveBeenCalled();
  });
});
