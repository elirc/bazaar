# Sprint 13 — Hardening: Flash-Sale Drill & Security

**Branch:** `sprint-13/hardening` · **Size:** L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** The course's convergence point: a **flash-sale load drill** where caching, inventory contention, and checkout idempotency collide under extreme concurrency — plus the security sweep (payment security, discount abuse, storefront attack surface). Audit-first; the learner runs the drill and drafts findings. Every consistency lesson gets stress-tested at once.

## A — Setup (audit + drill before fixes)
Learner runs: the **flash-sale drill** (thousands of concurrent buyers on one limited-stock, discounted product via k6 + traffic gen), the discount-abuse probe (stacking, per-customer bypass), a payment-security review (webhook forgery, price tampering at checkout), a storefront attack pass (cache poisoning, enumeration), plus dependency/gitleaks. Findings + drill report → `docs/audits/sprint-13-audit.md` (commit 1).

## B — Commits (one finding per commit)
| # | Commit | Notes |
|---|--------|------|
| 1 | `docs: sprint-13 audit + flash-sale drill report — P1..P4 with evidence` | the drill report: what oversold, stampeded, or double-charged under load, with graphs |
| 2 | `fix(inventory): flash-sale oversell under extreme contention (P1)` | **re-proves flaw #4 under fire**: the S7 atomic decrement holds, but the drill surfaces reservation-TTL races and hot-row contention; row-lock tuning / decrement sharding if needed; the property (sold ≤ stock) holds at 10k concurrent |
| 3 | `fix(cache): stampede under flash-sale — hot product + expiry + crowd (P1)` | **flash-sale proof for flaw #3**: single-flight (S6) is stressed at scale; the drill validates it collapses the herd; cache warming (S12) confirmed for the sale product |
| 4 | `fix(discount): stacking guard + total floor + per-customer enforcement (P1)` | **harvests flaw #5**; the abuse probe: stacked codes → negative totals, guests bypassing per-customer limits; deny-by-default stacking + floor + identity-checked limits |
| 5 | `security(payments): checkout price/total server-authoritative — reject client-supplied prices (P1)` | ⚠️ the classic e-commerce attack: the client tampers with the cart total; the server recomputes everything from source, trusts nothing from the client (🔗 "model output/client input is untrusted," retail-shaped) |
| 6 | `security(payments): webhook signature + replay hardening (P2)` | 🔗 fast-forward the Meridian/Relay webhook security; re-verified under the sender role |
| 7 | `security(storefront): cache-poisoning defense + enumeration limits (P2)` | cache keys can't be poisoned by attacker-controlled headers; order/customer enumeration rate-limited |
| 8 | `security(api): rate limiting — checkout, discount validation, add-to-cart abuse (P2)` | 🔗 token bucket (Tracer/Relay); bot/scalper mitigation on the sale |
| 9 | `security(ci): gitleaks + dependency gates (P3, fast-forward)` | |
| 10 | `docs: threat model — the flash-sale (contention × cache × money) + payment security; curriculum note` | the synthesis: three subsystems fail together under load |

## C — Review order
The drill report (1) → **the three-way collision (2 inventory, 3 cache, 4 discount) under load** → checkout price-tampering (5) → the threat model.

## D — Teaching comments (~11)
- the flash-sale collision — 📘 the course's thesis under fire: a flash sale is where the read-heavy cache (may serve stale "in stock"), inventory contention (thousands racing for limited stock), and checkout idempotency (retries under load) all stress at once; each was solved in isolation (S6, S7, S8) — the drill proves they hold *together*, which is a different, harder claim
- oversell under contention — 🔗 flaw #4 re-proven at scale: the atomic decrement is correct, but a single hot row under 10k concurrent buyers is a contention hotspot; the drill reveals whether you need decrement sharding or lock tuning — correctness first (S7), then *scale* of correctness (here)
- stampede at scale — 🔗 flaw #3's ultimate test: single-flight + warming must hold when a sale drops and a crowd hits one cold product simultaneously; the drill is the proof the S6 lab only simulated
- discount abuse — 🔗 flaw #5 harvested under adversarial load: stacking to negative totals, scalpers bypassing per-customer limits; deny-default stacking, a floor, and identity-checked limits
- price is server-authoritative — ⚠️ THE e-commerce security lesson: never trust a client-supplied price or total; the server recomputes from the catalog + validated discounts + tax; a checkout that trusts the cart's total is a free-shopping exploit — 🔗 the untrusted-input discipline every course taught, at its most expensive
- drill-driven hardening — 📘 the audit + drill *before* fixes: you can't harden what you haven't stressed; the drill report ranks findings by what actually broke under load, not by theory

## E — Debate
**"Flash-sale inventory: pre-allocate/queue buyers vs real-time contention on the atomic decrement?"** Queue (virtual waiting room): smooth, fair, but complex and adds latency for everyone. Real-time contention: simpler, but a single hot row is a bottleneck at extreme scale. **Resolution:** real-time atomic decrement for normal load (correct and simple), with a documented trigger + design for a waiting-room queue at flash-sale scale (the drill measures where the row-contention wall is). Lesson: *correctness and scale are separate problems solved in order — S7 made it correct, the drill finds where correctness needs help to scale, and you don't build the waiting room until the numbers demand it.*

## F/G — Close
- Squash: `fix(sprint-13): flash-sale hardening + payment security (closes #…)`
- **Recap reveals the flaw ledger** (Bazaar edition) — the flash-sale as the moment three planted flaws (inventory, cache, discount) were stress-tested together.
- **Lab (the flash-sale):** the learner owns the drill — drive escalating concurrent load until something breaks, diagnose which subsystem (cache/inventory/checkout), fix, re-run; the capstone break-it exercise of the whole course.
- Ledger: flaws #3, #4, #5 fully closed under load; #1, #2 already closed.
- Recap idea: *a flash sale is the exam for the whole course — caching, inventory, and idempotency graded simultaneously under a crowd, and the server must trust nothing the client sends.*
