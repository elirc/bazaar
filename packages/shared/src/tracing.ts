export type CommerceSpanName = "storefront.request" | "api.request" | "cache.read" | "db.query" | "checkout" | "inventory.reserve" | "payment.charge" | "order.create";
export type TraceAttributes = Readonly<{ storeId?: string; cartId?: string; orderId?: string; cacheOutcome?: "hit" | "miss"; outcome?: string }>;
export type CommerceSpan = Readonly<{ traceId: string; spanId: string; parentSpanId?: string; name: CommerceSpanName; startedAt: number; endedAt?: number; attributes: TraceAttributes }>;

export interface CommerceTracer {
  start(name: CommerceSpanName, attributes?: TraceAttributes, parent?: CommerceSpan): { span: CommerceSpan; end(attributes?: TraceAttributes): CommerceSpan };
}

export class InMemoryCommerceTracer implements CommerceTracer {
  readonly spans: CommerceSpan[] = [];
  constructor(private readonly id: () => string, private readonly now: () => number = Date.now) {}
  start(name: CommerceSpanName, attributes: TraceAttributes = {}, parent?: CommerceSpan) {
    const span: CommerceSpan = { traceId: parent?.traceId ?? this.id(), spanId: this.id(), ...(parent ? { parentSpanId: parent.spanId } : {}), name, startedAt: this.now(), attributes };
    return { span, end: (additional: TraceAttributes = {}) => {
      const ended = { ...span, endedAt: this.now(), attributes: { ...attributes, ...additional } };
      this.spans.push(ended);
      return ended;
    } };
  }
}
