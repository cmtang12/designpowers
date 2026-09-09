# Design Brief: Program Design Roadmap

## Problem Statement
A multi-stream design/delivery program has no single view that shows both product-owner
activity and UX activity against the same timeline. Because the two are tracked separately,
nobody can answer the question that actually matters: *is there a UX deliverable missing
under work a product owner has already committed to?* Gaps are found late, usually when a
PO has already signed off acceptance criteria that no designer or researcher has informed.

## Users
Two audiences reading one artifact:
- **Execs / sponsors** — need the coverage shape and the exceptions in one screen. Scanning, not reading.
- **Delivery team (POs, researchers, designers)** — need owners, sprint ranges, and dependencies. Weekly working use.

Ability spectrum considered:
- Colour-blind readers: track identity (PO vs UX) is the only colour-encoded dimension, validated
  at CVD ΔE 24.7+; stream identity is encoded by spatial lane + text header, never colour alone.
- Screen-reader and keyboard users: every activity is a focusable button with an accessible label;
  a full table view carries the same data in linear form.
- Low vision / bright sunlight: all marks clear 3:1 against their surface in both themes; every
  bar carries a visible text label in the expanded view.
- Cognitive load: the roadmap opens in the collapsed "coverage" read; detail is opt-in per row.

## Design Direction
Stream swimlanes with sprints as columns — the two axes the user asked for are not alternatives,
because sprint granularity forces time onto the horizontal axis. Three levels of nesting:

    STREAM  →  PROCESS GROUP (the item)  →  TRACK (PO | UX)

Maturity (Discovery → PoC → MVP → Operationalized) is a **badge on the process group**, not a
layout, and "graduation" is an **event marker** on the timeline where a process group changes
stream. This gives the user the pipeline concept they were curious about at no structural cost.

Coverage gaps are **computed, not eyeballed**: any sprint where a process group has PO activity
and no UX activity within ±1 sprint is flagged. The rule is stated in the UI rather than applied
invisibly.

## Constraints
- 13 two-week sprints, S1 (Sep 28 2026) → S13 (Mar 26 2027); two quarters at sprint level.
- S7 (Dec 21 – Jan 01) is a reduced-capacity sprint and must be marked as such.
- Must be interactive and filterable by person and by process group.
- Streams are currently independent; handoffs (PoC → MVP graduation) are real but infrequent.
- Operational items (licenses, ride-alongs) are **not** blockers, and their unit is an enablement
  item rather than a process group — a deliberate unit mismatch, surfaced rather than hidden.

## Existing Design System
None in repo. Palette parameters taken from the Designpowers dataviz reference palette and
validated with `scripts/validate_palette.js` in both light and dark modes.

## Taste Direction (Early Signal)
Utilitarian and operated, not editorial — this is a tool that gets opened weekly, so information
design outranks typography. Cool slate neutrals biased toward the PO blue. Archivo for structure,
Source Sans 3 for prose, IBM Plex Mono for sprint codes and dates so columns of figures align.

## Success Criteria
1. A reader can spot a UX coverage gap without being told where to look.
2. Filtering to one person shows that person's load across every stream in one screen.
3. The exec read and the team read are the same artifact, not two drifting decks.
4. Palette passes the six colour checks in both themes.

## Open Assumptions (flagged for correction)
- Two-week sprints; S1 begins Mon 28 Sep 2026.
- All content is illustrative dummy data at the user's request.
- Gap tolerance of ±1 sprint is a starting value, not a validated threshold.
