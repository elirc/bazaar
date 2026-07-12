# ADR-0004: Render Catalog Routes with ISR

- Status: Accepted
- Date: 2026-07-12

## Context

Fully dynamic catalog pages make every buyer pay origin latency. Fully static
pages make catalog size part of deploy time and remain stale until another build.
Products and collections change occasionally, serve the same HTML to many buyers,
and tolerate a short display delay.

## Decision

Use SSG for stable marketing routes, ISR with a 60-second revalidation window for
product and collection routes, and dynamic rendering for cart, checkout, account,
and admin. Product data stays in server components; interaction is isolated in
small client components. Product images receive stable dimensions, responsive
sizes, and LCP priority when above the fold.

## Consequences

Catalog responses have static speed and bounded age. Price and availability shown
on a PDP are display hints only; checkout will revalidate them from authoritative
services. The time window is a safety floor, and later cache work will coordinate
write-driven refresh across ISR and Redis.
