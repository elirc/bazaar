import type { DiscountCondition, PriceRule } from "@bazaar/db";

export type DiscountCart = {
  subtotalCents: number;
  productIds: readonly string[];
  collectionHandles: readonly string[];
  customerId?: string;
  shippingCents: number;
  itemPricesCents: readonly number[];
};

export function matchesDiscountCondition(condition: DiscountCondition, cart: DiscountCart): boolean {
  switch (condition.op) {
    case "all": return condition.conditions.every((child) => matchesDiscountCondition(child, cart));
    case "any": return condition.conditions.some((child) => matchesDiscountCondition(child, cart));
    case "minimum_spend": return cart.subtotalCents >= condition.cents;
    case "product_in": return cart.productIds.some((id) => condition.productIds.includes(id));
    case "collection_in": return cart.collectionHandles.some((handle) => condition.handles.includes(handle));
    case "customer_in": return cart.customerId !== undefined && condition.customerIds.includes(cart.customerId);
  }
}

export function evaluateDiscount(rule: PriceRule, cart: DiscountCart, now = new Date()) {
  if (
    now < rule.startsAt ||
    (rule.endsAt && now > rule.endsAt) ||
    (rule.usageLimit !== undefined && rule.uses >= rule.usageLimit) ||
    !matchesDiscountCondition(rule.conditions, cart)
  ) return 0;
  switch (rule.type) {
    case "fixed": return Math.min(cart.subtotalCents, rule.value);
    case "percentage": return Math.round(cart.subtotalCents * rule.value / 10_000);
    case "free_shipping": return cart.shippingCents;
    case "bogo": return [...cart.itemPricesCents].sort((a, b) => a - b).filter((_, index) => index % 2 === 0).reduce((sum, price) => sum + price, 0);
  }
}

export function applyDiscounts(rules: readonly PriceRule[], cart: DiscountCart, now = new Date()) {
  const applied = rules
    .map((rule) => ({ ruleId: rule.id, discountCents: evaluateDiscount(rule, cart, now) }))
    .filter((result) => result.discountCents > 0);
  const discountCents = applied.reduce((sum, result) => sum + result.discountCents, 0);
  return { applied, discountCents, totalCents: cart.subtotalCents + cart.shippingCents - discountCents };
}

export interface DiscountUsagePort {
  tryClaim(ruleId: string, customerId: string | undefined): Promise<boolean>;
}

export class DiscountUsageService {
  constructor(private readonly usage: DiscountUsagePort) {}
  claim(rule: PriceRule, customerId: string | undefined) {
    return this.usage.tryClaim(rule.id, customerId);
  }
}

export interface PromotionRulePort {
  load(ruleIds: readonly string[]): Promise<readonly PriceRule[]>;
}

export async function revalidateDiscountsAtCheckout(
  appliedRuleIds: readonly string[],
  cart: DiscountCart,
  rules: PromotionRulePort,
  now = new Date(),
) {
  return applyDiscounts(await rules.load(appliedRuleIds), cart, now);
}
