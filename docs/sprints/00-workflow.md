# Bazaar — Sprint Execution Workflow

Same ritual as prior courses; restated so this folder is self-contained when split into its own repo.

## Roles
- **Author (AI):** all code, commits, PR bodies, teaching comments, debate threads.
- **Learner (junior):** predict-before-reading, review-before-reveal, prescribed reading order, labs. Co-authors the junior side of S8; runs the S13 flash-sale drill and the audit.

## Lifecycle (Phases A–G)
- **A — Setup:** milestone, 3–6 issues, branch `sprint-NN/<slug>`.
- **B — Build:** ordered conventional commits. `[flaw]` logged in `flaw-ledger.md`; `[fix-later-in-PR]` = broken → failing test → fix as a story.
- **C — Draft PR:** template body incl. **How to review** order. CI green unless scripted.
- **D — Teaching comments:** 8–20 inline, after the learner's review pass. Prefixes: `📘 concept` · `🔍 review-lens` · `⚠️ pitfall` · `🔗 connects`.
- **E — Planted debate:** question → options → resolution (+ ADR/commit as called for).
- **F — Finalize:** curriculum note with exercises; squash-merge `feat(sprint-NN): … (closes #…)`.
- **G — Post-merge:** deploy check (S5+), deferred issues, milestone close, Sprint Recap, lab branch if scheduled, tags at S5/S15.

## Bazaar-specific rules
1. **Two-audience discipline:** every cache/consistency decision states its audience (cached storefront vs consistent admin) and its staleness tolerance, in the PR or ADR.
2. **Consistency invariants are tested, not hoped:** from S7, "inventory never oversells" and (from S8) "checkout charges once" are property/chaos-tested; a change touching them ships with the test.
3. **Numbers for caching:** storefront/caching PRs report cache-hit rate, p95, and origin load (traffic gen + k6). No "it's faster" without the number.
4. **Labs:** after S4, S7, S9, S12, S13 — including flash-sale break-it drills where the learner drives load until something oversells, stampedes, or double-charges, and explains why.
5. Conventions otherwise identical: squash-only linear `main`, Conventional Commits, no red merges, TODOs need issues, flaw harvests quote the ledger.
