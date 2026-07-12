export type FulfillmentLine = Readonly<{ orderLineId: string; quantity: number }>;
export type Fulfillment = Readonly<{
  id: string;
  orderId: string;
  idempotencyKey: string;
  lines: readonly FulfillmentLine[];
  carrier?: string;
  trackingNumber?: string;
}>;

export interface FulfillmentPort {
  orderQuantities(orderId: string): Promise<ReadonlyMap<string, number>>;
  fulfilledQuantities(orderId: string): Promise<ReadonlyMap<string, number>>;
  findByKey(key: string): Promise<Fulfillment | undefined>;
  create(fulfillment: Fulfillment): Promise<Fulfillment>;
}

export class FulfillmentService {
  constructor(private readonly port: FulfillmentPort) {}

  async create(input: Fulfillment): Promise<Fulfillment> {
    const replay = await this.port.findByKey(input.idempotencyKey);
    if (replay) return replay;
    if (!input.lines.length) throw new Error("A fulfillment needs at least one line");
    const [ordered, fulfilled] = await Promise.all([
      this.port.orderQuantities(input.orderId),
      this.port.fulfilledQuantities(input.orderId),
    ]);
    for (const line of input.lines) {
      if (!Number.isInteger(line.quantity) || line.quantity <= 0) throw new Error("Fulfillment quantities must be positive integers");
      const remaining = (ordered.get(line.orderLineId) ?? 0) - (fulfilled.get(line.orderLineId) ?? 0);
      if (line.quantity > remaining) throw new Error(`Cannot fulfill more than remaining for ${line.orderLineId}`);
    }
    return this.port.create(input);
  }
}
