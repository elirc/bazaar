export type Currency = "USD" | "EUR" | "GBP";
export type ExchangeRate = Readonly<{
  base: Currency;
  quote: Currency;
  numerator: number;
  denominator: number;
  effectiveAt: string;
}>;

export function convertMinorUnits(amount: number, rate: ExchangeRate) {
  if (!Number.isSafeInteger(amount) || rate.denominator <= 0) throw new Error("Money and rate must use safe integer units");
  return Math.round(amount * rate.numerator / rate.denominator);
}

export function formatMoney(amountMinor: number, currency: Currency, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amountMinor / 100);
}

export function selectDatedRate(rates: readonly ExchangeRate[], base: Currency, quote: Currency, at: string) {
  return [...rates]
    .filter((rate) => rate.base === base && rate.quote === quote && rate.effectiveAt <= at)
    .sort((left, right) => right.effectiveAt.localeCompare(left.effectiveAt))[0];
}
