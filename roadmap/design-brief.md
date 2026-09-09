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

## Design Direction (revised after round 2)
Sprints as columns; **process group is the row**. Horizon (future-state / MVP / PoC / enablement)
is a property of an *activity*, not of a process group — PG-01 carries both future-state and MVP
work. Nesting by stream duplicated such a group into rows that could not be read as one thing,
which was the v1 modelling error. Corrected hierarchy:

    PROCESS GROUP (the row)  →  TRACK (PO | UX)  →  activities tagged FS / MVP / PoC

A **Group by** control switches between the process-group pivot (default; "everything on PG-01")
and the stream pivot (the programme read). In the stream pivot each row carries an `also in …`
cross-reference so a multi-horizon group never reads as orphaned.

Milestones are defined as **a transfer or a commitment, not a task finishing**: requirements
baselined, design handoff, stakeholder demo, UAT start, PoC gate, discovery synthesis reaching the
backlog, go-live. Programme-level launches sit in a band pinned inside the sticky header; per-group
milestones render as ◇ markers on the row. The dashed ⇥ marker is the discovery → backlog feed —
the concrete handoff between horizons.

Owners appear as monogram avatars on every bar and as a per-track roster in the expanded view.
Avatar identity is carried by initials, not colour, so it costs nothing from the palette budget.

Coverage gaps are **computed, not eyeballed**: any sprint where a process group has PO activity
and no UX activity within ±1 sprint is flagged. Since the process group is now the unit, UX work on
*any* horizon counts as coverage — future-state research covers MVP product-owner work, which
matches how the overlapping workshops actually run. The rule is stated in the UI, not applied
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
