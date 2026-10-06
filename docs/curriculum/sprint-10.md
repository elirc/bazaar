# Sprint 10: Discounts and Promotions

## Objectives

- Evaluate money as a pure function over a closed AST.
- Revalidate promotions at checkout.
- Protect usage counters under concurrency.
- Explain why combination policy defaults should be restrictive.

## Review before reveal

Read the condition/value core, atomic claim port, checkout reload, characterization
test, admin builder, and ADR-0010. Do not fix the ledgered stacking flaw yet.

## Debate captured

Allow-by-default stacking is flexible and unsafe. Deny-by-default requires explicit
merchant intent but protects money. Bazaar records deny-by-default plus a total
floor as the resolved policy, harvested through Sprint 13's abuse probe.

## Exercises

1. Add an automatic free-shipping rule with minimum spend.
2. Race 200 buyers against a 100-use code.
3. Reorder fixed/percentage rules and explain the different result.
4. Build the Sprint 13 stacking-abuse input without implementing the fix.

## Ground truth

- Condition/value AST and evaluation: `apps/api/src/discounts.ts` / `discounts.test.ts`; decision record ADR-0010; the stacking flaw deliberately left open here is harvested in Sprint 13's abuse probe.
- **Check**: `pnpm --filter @bazaar/api test discounts` — exercise 3's ordering difference is a characterization test there, not an opinion.
