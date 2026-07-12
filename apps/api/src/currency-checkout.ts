import type { Currency, ExchangeRate } from "@bazaar/shared";
import { convertMinorUnits } from "@bazaar/shared";

export type CurrencyQuote = Readonly<{
  baseAmountMinor: number;
  amountMinor: number;
  currency: Currency;
  rateEffectiveAt: string;
}>;

export function createCurrencyQuote(baseAmountMinor: number, rate: ExchangeRate): CurrencyQuote {
  return { baseAmountMinor, amountMinor: convertMinorUnits(baseAmountMinor, rate), currency: rate.quote, rateEffectiveAt: rate.effectiveAt };
}

export interface CurrencyChargePort {
  charge(input: { amountMinor: number; currency: Currency; idempotencyKey: string }): Promise<{ chargeId: string }>;
}

export function chargeQuotedAmount(quote: CurrencyQuote, idempotencyKey: string, provider: CurrencyChargePort) {
  // The exact integer shown from this quote crosses the provider boundary; no
  // second conversion or rounding step is permitted during checkout.
  return provider.charge({ amountMinor: quote.amountMinor, currency: quote.currency, idempotencyKey });
}
