# Sprint 03 — Storefront Rendering (ISR/RSC)

**Branch:** `sprint-03/storefront-rendering` · **Size:** L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** Build the read surface properly: product and collection pages rendered with the right strategy (SSG/ISR/RSC), fast and cacheable. Introduces the rendering-strategy decision framework and plants the first caching flaw (cached pages with no invalidation dependency).

## A — Issues
1. `Rendering strategy: SSG for stable pages, ISR for catalog, dynamic for cart/personalized`
2. `Product detail page (PDP) + collection/listing page (PLP), RSC data fetching`
3. `Image optimization, responsive media, above-the-fold performance`
4. `The rendering-strategy decision doc`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(storefront): PDP as ISR — static generation + revalidate window` | **[flaw #1]** the page caches with a time-based revalidate but *no dependency tracking*: a price edit in admin doesn't invalidate the page until the window lapses (harvest S6) |
| 2 | `feat(storefront): PLP (collection listing) as ISR with pagination` | |
| 3 | `feat(storefront): RSC data layer — server components fetch through the BFF; client islands for interactivity` | what renders on the server (product data) vs client (add-to-cart) — the RSC boundary |
| 4 | `feat(storefront): image optimization — responsive, lazy, priority for LCP` | |
| 5 | `feat(storefront): product availability display (reads inventory — placeholder until S7)` | |
| 6 | `test: rendering strategy per route; PDP/PLP snapshot + perf marks` | |
| 7 | `docs: rendering-strategy.md — SSG vs ISR vs dynamic decision framework` | the decision doc: staleness tolerance × traffic × personalization → strategy |
| 8 | `docs: ADR-0004 storefront rendering; curriculum note` | |

## C — Review order
The rendering-strategy doc (7) → PDP ISR (1, note the missing invalidation) → the RSC boundary (3).

## D — Teaching comments (~9)
- rendering strategy framework — 📘 the decision: SSG (stable, rare changes) / ISR (catalog, changes sometimes, staleness-tolerant) / dynamic (cart, personalized, never cache); driven by staleness tolerance × traffic × personalization — the framework, not vibes
- ISR revalidate window — *(the flaw: a `📘 concept` note explains time-based revalidation without flagging that it lacks *event-based* invalidation; the price-change-not-reflected problem is left for S6 to harvest — a real reviewer might miss it, and the ledger tracks it)*
- RSC boundary — 📘 server components for data (product info, cached, no JS shipped), client islands for interactivity (add-to-cart, needs state); the boundary is a performance decision — ship less JS by keeping the boundary high
- LCP optimization — 📘 the product image is usually the LCP element; priority loading, responsive sizes, no layout shift; Core Web Vitals are e-commerce revenue (documented)
- availability placeholder — 🔗 honest stub: inventory display reads a placeholder until S7; the seam is real, the data isn't yet
- staleness tolerance stated — 🔍 review-lens: the two-audience rule in action — this PR states "PDP tolerates N seconds of price staleness"; that number is a business decision, written down

## E — Debate
**"PDP: fully static (SSG) vs ISR vs dynamic?"** SSG: fastest, but a 10k-product catalog means 10k builds and stale prices until rebuild. Dynamic: always fresh, but hammers the origin and is slow. ISR: static speed + periodic refresh, staleness-bounded. **Resolution:** ISR with a revalidate window *plus* (coming in S6) on-demand invalidation on price/inventory change — time-based as the floor, event-based as the precision. Lesson: *ISR is the right default for catalog, but time-based revalidation alone lets prices lie; you need event-based invalidation too* (which S6 builds, harvesting this sprint's flaw).

## F/G — Close
- Squash: `feat(sprint-03): storefront rendering (ISR/RSC) (closes #…)`
- Deferred: personalized recommendations, recently-viewed (needs care with caching).
- Ledger: flaw #1 recorded.
- Recap idea: *the storefront is a rendering-strategy decision per route — and time-based cache refresh is a floor, not a solution, because it lets prices go stale.*
