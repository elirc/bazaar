# Sprint 14: Accessible, International Storefront Discovery

## Objectives

- Prioritize accessibility in the conversion funnel.
- Separate stored money, dated conversion, display, and charge.
- Externalize locale strings and route locale identity.
- Connect structured data and canonical discovery to traffic.

## Review before reveal

Start with the axe checkout gate, then keyboard/live-region changes, integer money
conversion, exact provider input, JSON-LD serializer, sitemap, and hreflang metadata.

## Debate captured

Display-only FX is simpler but shows one amount and charges another. Bazaar uses
true buyer-currency display and charge with a dated rate and one rounding step.
Base currency remains available for settlement and reporting.

## Exercises

1. Complete keyboard-only checkout and verify focus after an error.
2. Format 123456 minor EUR units in en-US and fr-FR without changing value.
3. Prove a displayed JPY quote equals provider input after zero-decimal rounding.
4. Validate product JSON-LD and locale alternates with external webmaster tools.

## Ground truth

- Axe gate and keyboard flows: `apps/storefront/src/a11y.test.tsx`; locale/formatting: `i18n.ts`; money conversion and zero-decimal rounding of exercise 3: `apps/api/src/currency-checkout.ts` / `currency-checkout.test.ts`; JSON-LD and hreflang: `apps/storefront/src/seo.ts` / `seo.test.ts`.
- **Check**: `pnpm --filter @bazaar/storefront test` covers exercises 1, 2 and the serializer half of 4; exercise 3 is `pnpm --filter @bazaar/api test currency-checkout`.
