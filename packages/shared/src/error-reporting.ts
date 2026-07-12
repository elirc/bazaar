export type CommerceErrorContext = Readonly<{ app: "storefront" | "admin" | "api"; traceId?: string; storeId?: string; cartId?: string; orderId?: string; operation?: string }>;

export interface SentryLike {
  captureException(error: unknown, hint: { contexts: { commerce: CommerceErrorContext } }): string;
}

export class PiiSafeErrorReporter {
  constructor(private readonly sentry: SentryLike) {}
  capture(error: unknown, context: CommerceErrorContext) {
    // The type is an allowlist: no email, address, card data, request body, or
    // customer name can be passed as commerce context.
    return this.sentry.captureException(error, { contexts: { commerce: context } });
  }
}
