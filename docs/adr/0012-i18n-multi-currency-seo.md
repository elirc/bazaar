# ADR-0012: True Buyer-Currency Checkout and Locale SEO

- Status: Accepted
- Date: 2026-07-12

## Decision

Store catalog prices as integer minor units in the settlement currency. Build a
buyer-currency quote from a dated rational exchange rate, round once, display that
quote through `Intl.NumberFormat`, and send the exact same minor-unit integer and
currency to the payment provider. Never silently display a conversion while
charging the base currency.

Route UI locales explicitly and externalize interface strings. Give every indexable
product, collection, and locale URL one canonical, hreflang alternates, sitemap
discovery, and Product/Offer/BreadcrumbList JSON-LD. Keep transactional routes out
of robots. Accessibility automation gates the checkout; keyboard, focus, live
status, semantics, and visual contrast still require browser/manual review.

## Consequences

Buyers pay the number they saw and every quote records when its FX rate applied.
Settlement reconciliation retains the base amount. Locale URLs can accumulate
search equity without duplicate ambiguity. Adding a currency requires provider,
rounding, and settlement support; adding a locale requires a complete message set.
