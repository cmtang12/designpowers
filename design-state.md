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
| Maturity as a badge + graduation event, not a layout | Gives the pipeline concept at zero structural cost; avoids a second competing view |
| Process group as the item, with PO and UX sub-tracks | Directly serves the user's gap-detection use case |
| Colour encodes **track**, not stream | Only 3 slots validate all-pairs; stream is already encoded by position, so spending the budget there is redundant |
| Gaps computed with a stated ±1 sprint rule | A visible rule can be argued with; an invisible one can't be trusted |
| Ops kept as a lane but visually distinct | Its unit is an enablement item, not a process group — mismatch surfaced, not hidden |

## Open Questions for User
- Sprint length (2 weeks) and S1 start date (28 Sep 2026) are assumptions.
- Gap tolerance is ±1 sprint — needs a real-world sanity check.
- Ops lane unit mismatch: keep as a lane, or move to a separate dependency strip?
- Real process-group names, owners and dates to replace the dummy set.

## Taste Profile
None on disk (`~/.designpowers/taste-profile.md` absent). Early signals recorded in the brief.
