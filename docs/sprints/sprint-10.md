# Sprint 10 — Discounts & Promotions Engine

**Branch:** `sprint-10/discounts` · **Size:** M/L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** A real promotions engine: discount codes, automatic price rules, conditions and stacking, applied consistently across cart and checkout. The combinatorial complexity of stacking is where bugs (and abuse — the planted flaw) live.

## A — Issues
1. `PriceRule / Discount: code-based + automatic; fixed/percentage/BOGO/free-shipping`
2. `Conditions: min spend, specific products/collections, customer eligibility, usage limits`
3. `Application + stacking rules across cart and checkout`
4. `Discount abuse prevention (usage limits, one-per-customer)`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(db): PriceRule (type, value, conditions AST, usage limits) + Discount codes` | 🔗 conditions are the AST again (sixth reuse); the learner ports it in minutes |
| 2 | `feat(api): discount evaluation — which rules apply to a cart, computed value` | pure evaluation function (🔗 the functional-core discipline: discount math is pure + testable) |
| 3 | `feat(api): stacking — [no combination guard]` | **[flaw #5]** codes stack without rules; multiple percentages compound into absurd/negative totals (harvest S13) |
| 4 | `feat(api): conditions — min spend, product/collection scope, customer eligibility, usage caps` | |
| 5 | `feat(api): usage tracking — per-code and per-customer limits, atomic increment` | ⚠️ usage-limit enforcement is a counter race (🔗 the counter pattern, discount-shaped): "limited to 100 uses" must not allow 105 under concurrency |
| 6 | `feat(cart+checkout): apply discounts consistently; totals reflect them; re-validated at checkout` | the discount is re-evaluated at checkout (like price/inventory) — a code can expire between cart and pay |
| 7 | `feat(admin): discount creation UI (structured → AST), performance view (redemptions)` | |
| 8 | `test: discount evaluation, condition matching, usage-limit atomicity, stacking (documents the flaw)` | |
| 9 | `docs: ADR-0010 promotions engine; curriculum note` | |

## C — Review order
Discount evaluation (2) → stacking (3, note the missing guard) → usage-limit atomicity (5) → checkout re-validation (6).

## D — Teaching comments (~9)
- discount math as pure fn — 🔗 functional core, retail-shaped: "given a cart and rules, compute the discount" is pure and exhaustively testable; keep money math out of IO (the Meridian money discipline)
- stacking complexity — 📘 stacking is combinatorial: percentage-then-fixed ≠ fixed-then-percentage, and uncontrolled stacking (flaw #5) compounds into negative totals; *(the comment explains order-of-application without flagging the missing guard — S13's abuse probe finds it)*
- usage-limit race — ⚠️ "100 uses max" is a counter under concurrency; atomic increment with a limit check (`UPDATE ... WHERE uses < limit`), or a flash-sale lets 200 people use a 100-use code; 🔗 the counter race, umpteenth appearance — reflexive by now
- checkout re-validation — 🔗 discounts join price and inventory as things re-checked at checkout (S8): a code valid at cart-time may be expired/exhausted at pay-time; never trust the cart's stored discount
- conditions AST — 🔗 sixth AST reuse; eligibility conditions are predicates over cart/customer; the learner should feel how little new code this is
- customer eligibility — ⚠️ "one per customer" needs a stable customer identity (🔗 the identity lessons); guests gaming per-customer limits is the S13 abuse vector

## E — Debate
**"Stacking: allow-by-default with exclusions vs deny-by-default with explicit combinability?"** Allow-default: flexible, but the source of the flaw (unexpected compounding, negative totals). Deny-default: safe, merchants must opt into combinations. **Resolution:** deny-by-default — discounts don't stack unless explicitly marked combinable, with a total floor (never below zero, never below cost if configured). Lesson: *for anything touching money, default to the safe restriction and make permissiveness explicit* (🔗 the allowlist-not-denylist philosophy from Relay's sandbox, money-shaped).

## F/G — Close
- Squash: `feat(sprint-10): discounts & promotions engine (closes #…)`
- Deferred: BOGO edge cases, tiered discounts, gift cards, automatic-discount conflicts.
- Ledger: flaw #5 recorded (stacking abuse).
- Recap idea: *promotions are pure math over a predicate AST — the danger is stacking, so deny by default and floor the total.*
