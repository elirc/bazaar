export const checkoutSlo = { target: 0.995, windowDays: 30, pageThreshold: 0.98, pageMinimumAttempts: 100 } as const;

export type CheckoutWindow = Readonly<{ attempts: number; successes: number; durationMinutes: number }>;

export function evaluateCheckoutSlo(window: CheckoutWindow) {
  const ratio = window.attempts ? window.successes / window.attempts : 1;
  const page = window.durationMinutes <= 5 && window.attempts >= checkoutSlo.pageMinimumAttempts && ratio < checkoutSlo.pageThreshold;
  const ticket = window.durationMinutes <= 60 && window.attempts >= 100 && ratio < 0.992;
  return { ratio, page, ticket, errorBudgetConsumed: Math.max(0, (1 - ratio) / (1 - checkoutSlo.target)) };
}
