export type RefundResult = Readonly<{ refundId: string; status: "succeeded" | "declined" }>;

export interface RefundProvider {
  refund(input: { chargeId: string; amountCents: number; idempotencyKey: string }): Promise<RefundResult>;
}

export class MockRefundProvider implements RefundProvider {
  readonly #refunds = new Map<string, RefundResult>();

  async refund(input: { chargeId: string; amountCents: number; idempotencyKey: string }) {
    if (input.amountCents <= 0) throw new Error("Refund amount must be positive");
    const replay = this.#refunds.get(input.idempotencyKey);
    if (replay) return replay;
    const result = { refundId: `refund_${this.#refunds.size + 1}`, status: "succeeded" as const };
    this.#refunds.set(input.idempotencyKey, result);
    return result;
  }
}

export class RefundService {
  constructor(private readonly provider: RefundProvider) {}
  create(input: { chargeId: string; amountCents: number; paidCents: number; alreadyRefundedCents: number; idempotencyKey: string }) {
    if (input.amountCents > input.paidCents - input.alreadyRefundedCents) throw new Error("Refund exceeds remaining captured amount");
    return this.provider.refund(input);
  }
}
