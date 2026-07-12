# Sprint 14 — Storefront Polish: A11y, i18n, SEO

**Branch:** `sprint-14/storefront-polish` · **Size:** M/L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** Make the storefront world-class for real buyers: accessibility (a conversion + legal issue in retail), internationalization (multi-currency, multi-locale, the money-formatting discipline), and SEO (structured data, sitemaps — the storefront's traffic lifeline). Fast-forward on a11y/i18n mechanics; the retail-specific angles are new.

## A — Issues
1. `Accessibility: WCAG AA on shop/PDP/cart/checkout; axe in CI`
2. `i18n: multi-currency pricing, locale formatting, translated storefront strings`
3. `SEO: structured data (Product/Offer schema), sitemaps, canonical URLs, meta`
4. `Multi-currency: display + checkout in buyer's currency`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `test(a11y): axe in CI, failing-allowlist pass (fast-forward pattern)` | |
| 2 | `fix(a11y): checkout + cart accessibility — forms, errors, focus, keyboard (the conversion-critical flows)` | ⚠️ checkout a11y is revenue: an inaccessible checkout loses sales *and* invites lawsuits; the highest-priority a11y surface |
| 3 | `fix(a11y): PDP/PLP — semantic structure, image alts, filter controls, live region for cart updates` | |
| 4 | `feat(i18n): multi-currency — prices in buyer's currency via dated rates; Money formatting via Intl` | 🔗 Meridian S7 money + S14 Intl formatting: value in minor units, *display* per locale (`€1.234,56` vs `$1,234.56`); currency is a formatting concern, price is a stored concern |
| 5 | `feat(i18n): storefront string externalization + locale routing (fast-forward)` | 🔗 Meridian S14 i18n mechanics |
| 6 | `feat(i18n): checkout in buyer's currency — charge currency, rounding rules, display consistency` | ⚠️ multi-currency checkout: what currency do you *charge*? rounding? the price shown must equal the price charged (🔗 the price-snapshot trust lesson) |
| 7 | `feat(seo): structured data (Product/Offer/BreadcrumbList JSON-LD), sitemap generation, canonical URLs` | SEO is the storefront's organic traffic; structured data drives rich results |
| 8 | `feat(seo): meta/OG per product+collection, robots, hreflang for locales` | |
| 9 | `test: axe gate green; currency formatting/rounding; structured-data validity; sitemap` | |
| 10 | `docs: ADR-0012 i18n/multi-currency + SEO; curriculum note` | |

## C — Review order
Checkout a11y (2, the revenue-critical one) → multi-currency (4, 6) → structured data (7).

## D — Teaching comments (~9)
- checkout a11y is revenue — 📘 accessibility in retail isn't only compliance, it's conversion: an inaccessible checkout directly loses sales and is a top ADA-litigation target; prioritize the funnel (cart → checkout) over marketing pages
- money: value vs display — 🔗 the Meridian discipline, sharpened: the price is stored in minor units (integer), *displayed* per locale/currency via Intl; a currency is a formatting + charging decision, never a change to the stored value; conflating them corrupts money
- charge currency + rounding — ⚠️ multi-currency checkout must decide *what currency you charge* and apply consistent rounding; the displayed price must exactly equal the charged price (🔗 the price-snapshot trust lesson — buyers must never be charged a different number than shown)
- dated exchange rates — 🔗 Meridian S7's dated ExchangeRate: convert at a known, dated rate; "the price in EUR" is "as of when?"
- structured data — 📘 JSON-LD Product/Offer schema drives search rich results (price, availability, reviews in the SERP) — direct traffic and conversion impact; SEO is engineering for the storefront
- hreflang — 📘 multi-locale SEO: hreflang tells search engines which locale-URL serves which audience; getting it wrong splits or duplicates your ranking

## E — Debate
**"Multi-currency: display-only conversion vs true multi-currency pricing/charging?"** Display-only: convert a base price for display, charge in base currency — simple, but the buyer sees one number and gets charged another (FX on their card). True multi-currency: price and charge in the buyer's currency — honest, but needs per-currency rounding, pricing rules, and settlement handling. **Resolution:** true multi-currency for display *and* charge (the buyer pays exactly what they see), with dated rates and per-currency rounding; base currency for settlement/reporting. Lesson: *the number shown must be the number charged — anything else breaks the trust that price snapshots (S5) and checkout re-validation (S8) exist to protect.*

## F/G — Close
- Squash: `feat(sprint-14): storefront a11y, i18n, multi-currency, SEO (closes #…)`
- Deferred: RTL storefront, translated product content (vs UI strings), local payment methods, tax-by-jurisdiction.
- Recap idea: *the storefront serves the world — accessible checkout is revenue, multi-currency means shown-equals-charged, and SEO structured data is the traffic engine.*
