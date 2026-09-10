# Populating the Process Group Roadmap

Everything the board draws comes from one block of JavaScript arrays inside
`roadmap/design-roadmap.html`, between these two markers:

```
/* ==================== BEGIN EDITABLE DATA ==================== */
...
/* ===================== END EDITABLE DATA ===================== */
```

**Replace that block. Change nothing outside it.** Then run:

```bash
node roadmap/validate-data.cjs
```

It exits non-zero and names every problem. Do not publish a version it rejects.

---

## The one thing to understand first

Most of what appears on the board is **derived, not authored**. Do not try to
write these by hand — there is nowhere to put them, and inventing a place will
make the board contradict itself:

| Shown on the board | Where it comes from |
|---|---|
| UX coverage gaps (the hatched cells, the counts, the gap chart) | Computed: a sprint where a process group has PO activity and no UX activity within ±1 sprint, counting UX work on **any** horizon |
| Which horizons a process group spans (its `FUTURE-STATE` / `MVP` / `POC` badges) | Derived from the horizons of its activities |
| Design stage (the Design stage grouping) | Derived from each activity's `type` via the `PHASE_OF` map |
| The pod list in the filter | Derived from the `pod` field on process groups |
| Capacity / who is overloaded | Counted from overlapping activities per owner per sprint |
| Start and end dates of a bar | Derived from `SPRINTS` plus the activity's `s` and `span` |

**A process group does not belong to a horizon.** Horizon is a property of an
*activity*. The same process group routinely carries future-state, MVP and PoC
work at once; give it one activity row per piece of work and set the horizon on
each. This is the single most common way to get the data wrong.

---

## The arrays, in the order they appear

### `SPRINTS`
The calendar. Everything else refers to sprints by number.

```js
{n:1, id:"S1", a:"Sep 28", b:"Oct 09", d0:"2026-09-28", d1:"2026-10-09", reduced:true}
```

| Field | Meaning |
|---|---|
| `n` | 1-based position. **Must equal its index + 1.** |
| `id` | Short label shown in the column header — `"S1"`, or your own scheme |
| `a`, `b` | Display-only start and end, any format |
| `d0`, `d1` | Real dates, `YYYY-MM-DD`. These drive week/month zoom and the today line |
| `reduced` | Optional. Marks a holiday or short sprint |

Add or delete rows freely — 13 is not special. Sprints must not overlap.

### `STREAMS` — the horizons
Four entries with ids `discovery`, `mvp`, `innovation`, `ops`. Rename the
`name`, `short` and `tag` freely; **keep the ids**, since activities refer to
them and the last one (`ops`) is treated as enablement throughout.

### `PEOPLE`
```js
{id:"DW", name:"Dana Whitfield", role:"Product owner"}
```
`id` is the monogram on every bar — keep it to two characters and unique.
`name` is the join key: `ACTS.owner` must match it **exactly**.

### `PGS` — process groups and enablement items
```js
{id:"PG-01", name:"Work Intake & Triage", pod:"Juno"}
{id:"OPS-01", name:"Platform Licence Procurement", pod:"Programme", ops:true}
```
`pod` groups process groups for the pod filter — name pods whatever your teams
are called. `ops:true` marks an enablement item: it gets no PO/UX tracks, sits
in its own section, and is excluded from the gap check.

### `ACTS` — the bars
```js
A(pg, stream, track, name, owner, s, span, type)
A("PG-01","discovery","ux","Generative research","Tom Okafor",1,3,"Research")
```

| Arg | Rule |
|---|---|
| `pg` | Must exist in `PGS` |
| `stream` | One of the `STREAMS` ids |
| `track` | `"po"`, `"ux"`, or `"ops"` — `ops` only on `ops:true` groups, and only there |
| `owner` | Must match a `PEOPLE.name` exactly |
| `s` | Starting sprint number |
| `span` | How many sprints it runs; `s + span - 1` must not exceed the last sprint |
| `type` | Must be a key in `PHASE_OF`, which is what gives it a design stage |

### `MILESTONES`
```js
M(pg, s, kind, name)
M(null, 10, "golive", "Wave 1 go-live — Asset Records")   // null = programme level
M("PG-01", 4, "backlog", "Synthesis → 6 backlog items")
```
`pg: null` puts it in the major-milestone band at the top. `kind` must be a key
in `KINDS`. A milestone is placed at the **end** of its sprint.

**A milestone is a transfer or a commitment — not a task finishing.** Something
changes hands, or someone locks something in. "Wireframes complete" is not one.
To add a type, add an entry to `KINDS` with `label`, `def`, `scope`, `phase`,
a glyph `g`, and `major:true` if it belongs in the top band. The About dialog
renders that table straight from `KINDS`, so a new type documents itself.

### `PHASES` and `PHASE_OF`
`PHASE_OF` maps an activity `type` to a design stage. To re-cut the stage view,
edit this one map rather than touching activities. Every `type` used in `ACTS`
must appear here.

### `TODAY_OVERRIDE`
Near the top of the script, above the data block. It pins "today" so the sample
window shows the line in a sensible place. **Delete that line** once your dates
are real, and the line follows the actual date.

---

## Suggested order of work

1. `SPRINTS` — your real calendar first; everything references it.
2. `PEOPLE` — names must be final before activities reference them.
3. `PGS` — process groups and their pods.
4. `ACTS` — the bulk of the work. One row per piece of work, horizon set per row.
5. `MILESTONES` — transfers and commitments only.
6. Run the validator. Fix every FAIL. Read every WARN and confirm it is intended.

## What the validator checks

Referential integrity (unknown process group, misspelt owner, undefined
milestone kind, unmapped activity type), range errors (an activity running past
the last sprint, a milestone outside the calendar), overlapping or reversed
sprint dates, duplicate initials, and the ops-track rule. It warns about
process groups with no activities, process groups with no UX activity at all,
and people who own nothing.

It also prints the gaps it derives, so you can sanity-check the headline finding
before anyone else sees it.

## Publishing

`roadmap/design-roadmap.html` is written to be published as a Claude Artifact:
it is body content only — no `<!doctype>`, `<html>`, `<head>` or `<body>` tags,
which are added at publish time. It is a single self-contained file; the only
external request is the Google Fonts stylesheet. Keep it that way — external
scripts, stylesheets and images from other hosts are blocked in that context.

To preview locally, wrap it: `<!doctype html><html><head>` + the file + `</head></html>`.
