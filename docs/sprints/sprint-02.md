# Sprint 02 — Catalog: Products, Variants & Collections

**Branch:** `sprint-02/catalog` · **Size:** L · Ritual: [00-workflow.md](00-workflow.md)

**Goal:** The catalog data model that everything else depends on: products with variants (the option-combination problem), collections (manual + smart), media, and the admin CRUD to manage it all. Get the variant model right — inventory, pricing, and cart all hang off it.

## A — Issues
1. `Product → Variant model: options (size/color), variant = option combination, per-variant sku/price`
2. `Collections: manual (curated) + smart (rule-based membership)`
3. `Product media, status (draft/active/archived), SEO fields`
4. `Admin catalog CRUD: product editor with variant matrix, bulk actions`

## B — Commits
| # | Commit | Notes |
|---|--------|------|
| 1 | `feat(db): Product, Option, Variant (option-value combination, sku, price)` | the variant matrix: 3 sizes × 4 colors = 12 variants; the model must generate/manage combinations cleanly |
| 2 | `feat(db): Collection (manual membership) + smart-collection rule AST` | 🔗 fifth AST reuse (Tracer/Pulse/Relay/Harbor) — smart collections are a filter over products; the learner should recognize it instantly |
| 3 | `feat(api): variant generation — options → variant combinations, with edit/delete of individual variants` | ⚠️ regenerating variants when options change must preserve existing variants' data (sku, inventory) — a merge, not a rebuild |
| 4 | `feat(api): catalog CRUD + smart-collection evaluation (which products match)` | |
| 5 | `feat(db): ProductMedia, status enum, SEO fields (handle/slug, meta)` | slug uniqueness per store (🔗 the identifier lessons) |
| 6 | `feat(admin): product editor — variant matrix UI, media upload, collection assignment` | the variant matrix is the hard UI (add an option → the matrix expands) |
| 7 | `feat(admin): collections UI — manual curation + smart rule builder (structured → AST)` | 🔗 Relay/Harbor "structured UI → safe AST" |
| 8 | `feat(db): catalog seed — realistic store (50 products, variants, collections)` | |
| 9 | `test(api): variant generation/merge, smart-collection evaluation, slug uniqueness` | |
| 10 | `docs: ADR-0003 variant model; curriculum note` | |

## C — Review order
The variant model (1) → variant generation/merge (3, the tricky part) → smart-collection AST (2).

## D — Teaching comments (~10)
- variant matrix — 📘 the option/variant model is e-commerce's core data-modeling challenge: options (size, color) generate variants (combinations); price/sku/inventory live on the *variant*, not the product — 🔗 the temporal/granularity lesson from Meridian S3 (salary on EmploymentRecord), retail-shaped
- variant regeneration merge — ⚠️ adding a "size XL" option must *add* variants without wiping the existing ones' skus and inventory; a naive regenerate-all destroys data; this is a merge with identity, not a rebuild
- smart-collection AST — 🔗 review-lens: fifth appearance of the closed-predicate-AST pattern; if the learner didn't reach for it reflexively, that's the coaching note; smart collections are a saved filter over products
- collection membership timing — 📘 smart-collection membership: computed live vs materialized? (🔗 Pulse S9's precompute grid) — live for small catalogs, materialized + refreshed for large; foreshadows caching
- slug uniqueness — 🔗 per-store unique handles; the identifier-generation lessons (gapless/unique) from prior courses
- status enum — 📘 draft/active/archived gates storefront visibility; the storefront only ever shows active — a filter that must be *everywhere* (like multi-tenancy scoping, Meridian S2)

## E — Debate
**"Variants: explicit rows per combination vs options-as-JSON on the product?"** JSON: flexible, but inventory/pricing/cart all need to reference a specific variant — you'd reinvent rows in JSON. Explicit rows: joins, but every downstream system (inventory S7, cart S5, orders S8) needs a stable variant id. **Resolution:** explicit Variant rows — the variant is the unit of sale, inventory, and pricing; it must be a first-class entity with an id. Lesson: *model the unit that other systems must reference as a real row, not a JSON blob — the variant is the atom of commerce.*

## F/G — Close
- Squash: `feat(sprint-02): catalog — products, variants, collections (closes #…)`
- Deferred: product bundles, digital products, variant images, inventory (S7).
- Recap idea: *get the variant model right and inventory, pricing, cart, and orders fall into place; get it wrong and every later sprint fights it.*
