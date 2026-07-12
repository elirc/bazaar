const HANDLE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCALES = new Set(["en-US", "en-GB", "fr-FR"]);
const CURRENCIES = new Set(["USD", "GBP", "EUR"]);

export function safeStorefrontCacheKey(input: { storeId: string; handle: string; locale?: string; currency?: string }) {
  if (!HANDLE.test(input.handle) || input.handle.length > 100) throw new Error("Invalid resource handle");
  const locale = input.locale && LOCALES.has(input.locale) ? input.locale : "en-US";
  const currency = input.currency && CURRENCIES.has(input.currency) ? input.currency : "USD";
  // No arbitrary headers, cookies, host values, or forwarded IPs may enter this key.
  return `bazaar:v2:store:${input.storeId}:product:${input.handle}:${locale}:${currency}`;
}

export type OpaqueLookup<T> = { status: 200; value: T } | { status: 404; message: "Resource not found" };

export function opaqueCustomerLookup<T>(value: T | undefined, ownsResource: boolean): OpaqueLookup<T> {
  if (!value || !ownsResource) return { status: 404, message: "Resource not found" };
  return { status: 200, value };
}
