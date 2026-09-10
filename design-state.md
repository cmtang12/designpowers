# Design State

**Project:** Program Design Roadmap
**Started:** 2026-09-09
**Mode:** Direct
**Brief:** `roadmap/design-brief.md`

## Current Phase
Design + build (roadmap artifact)

## Completed
- [x] Welcome sequence (first-time user, no taste profile)
- [x] Discovery — organizing axis, horizon, audience, item unit, stream relationships, output format
- [x] Design brief written
- [x] Palette validated (dataviz six checks, light + dark, `--pairs all`)
- [x] Interactive roadmap built and published

## Key Decisions
| Decision | Rationale |
|---|---|
| Swimlanes **and** sprint columns | Sprint granularity forces time onto the x-axis; the two options the user weighed were not alternatives |
| **Process group is the row; horizon is a property of an activity** (r2) | v1 made stream the parent, which duplicated any multi-horizon group into rows that could not be read as one thing. Four of nine groups are multi-horizon |
| **Group-by toggle (process group ↔ stream)** (r2) | Two legitimate hierarchies; a pivot keeps both rather than forcing a lossy choice |
| **Row hierarchy generalised to any dimension** (r3) | Process group / horizon / design stage / track / owner. The r2 toggle was a special case of a pivot; five dimensions cost little more than two |
| Design stage derived from activity type via one map (r3) | Re-cutting the stage taxonomy means editing one table, not 66 activity rows |
| Each gap cell and each milestone drawn exactly once per pivot (r3) | Gap cells belong to the slice holding the uncovered PO activity; milestones prefer their own stage section, else the group's first. Invariant: 7 gap cells + 27 markers in every pivot |
| **Grouping and filtering separated by location** (r4) | Board controls (group / detail / zoom) attach to the board because they redraw it; filters live in a panel that reports what it removed. Location is the only separation people actually read |
| All filters are one control family (r4) | Horizon and track became multi-select dropdowns matching the single-selects; mixed chips-and-dropdowns read as disorder |
| Everything optional collapses behind a panel toolbar (r4) | Metrics, milestone types, audit tables and the explanatory notes. Only the gap headline stays on screen |
| Zoom scopes rows, not just columns (r4) | Narrowing the sprint window drops groups with no work in it, rather than leaving blank rows |
| Milestone types panel doubles as the taxonomy reference (r4) | Definition, scope, stage and count per kind, plus what was deliberately excluded — so the user can judge whether a type is missing |
| Major milestone band collapsible, closed by default (r3) | It was consuming the viewport; collapsed it keeps a marker row plus the next milestone named |
| Milestone = a transfer or a commitment, not a task finishing (r2) | Gives a testable inclusion rule instead of a taste call |
| Gap check now counts UX on any horizon (r2) | Matches the real overlap between PO workshops and discovery research |
| Maturity as a badge + graduation event, not a layout | Gives the pipeline concept at zero structural cost; avoids a second competing view |
| Process group as the item, with PO and UX sub-tracks | Directly serves the user's gap-detection use case |
| Colour encodes **track**, not stream | Only 3 slots validate all-pairs; stream is already encoded by position, so spending the budget there is redundant |
| Gaps computed with a stated ±1 sprint rule | A visible rule can be argued with; an invisible one can't be trusted |
| Ops kept as a lane but visually distinct | Its unit is an enablement item, not a process group — mismatch surfaced, not hidden |

## Open Questions for User
- Sprint length (2 weeks) and S1 start date (28 Sep 2026) are assumptions.
- Gap tolerance is ±1 sprint — needs a real-world sanity check.
- Enablement unit mismatch: keep as a lane, or move to a separate dependency strip?
- Real process-group names, owners and dates to replace the dummy set.
- Milestone taxonomy proposed, not confirmed: baselined / handoff / demo / UAT / gate / backlog / go-live.
- Whether the discovery → backlog feed needs an explicit connector to the MVP item it feeds,
  rather than the current marker on the originating group.
- Owner avatars are monograms; real photos would need hosted images.
- Table view: recommended keeping the gaps table and roster, dropping the 66-row activities dump.
  Raised with the user, not yet actioned at their request.
- The design-stage map (PHASE_OF) is our inference, not the user's taxonomy — "Workshop" is
  mapped to Discover, which is the assumption most likely to be wrong.

## Taste Profile
None on disk (`~/.designpowers/taste-profile.md` absent). Early signals recorded in the brief.
