# Process Group Roadmap — instructions for populating it with real data

You have been given one file: **`design-roadmap.html`**. It is a complete,
self-contained interactive roadmap. Your job is to replace the sample plan
inside it with real data. Do not redesign it, restyle it, or restructure the
code.

---

## 1. The only part you may edit

Near the top of the `<script>` block you will find:

```
/* ==================== BEGIN EDITABLE DATA ==================== */
   ... the entire plan lives here ...
/* ===================== END EDITABLE DATA ===================== */
```

**Edit only between those two markers.** Everything below `END EDITABLE DATA`
is rendering logic. Do not reformat, "clean up", or reorder anything outside
the markers, and do not remove the markers themselves.

One exception, above the data block: a line reading

```js
var TODAY_OVERRIDE="2026-10-20";
```

Delete that line once the sprint dates are real. It pins "today" so the sample
looks sensible; with real dates the marker should follow the actual date.

---

## 2. Read this before you write anything

Most of what the board displays is **derived at runtime, not authored**. There
is nowhere to type these values, and inventing a place will make the board
contradict itself:

| Appears on the board | Computed from |
|---|---|
| UX coverage gaps — hatched cells, gap counts, the gap chart | Any sprint where a process group has product-owner activity and **no** UX activity within ±1 sprint, counting UX work on any horizon |
| The `FUTURE-STATE` / `MVP` / `POC` badges on a row | The horizons of that group's activities |
| Design stage (used by the Design stage grouping) | Each activity's `type`, mapped through `PHASE_OF` |
| The pod list in the filter | The `pod` field on process groups |
| Capacity / who is overloaded | Overlapping activities per owner per sprint |
| A bar's start and end dates | `SPRINTS` plus the activity's `s` and `span` |

### The mistake to avoid

**A process group does not belong to a horizon.** Horizon is a property of an
*activity*. The same process group routinely carries future-state discovery,
MVP delivery and proof-of-concept work at the same time. Give it one activity
row per piece of work and set the horizon on each row. Do not create duplicate
process groups to represent different horizons.

---

## 3. The data, array by array

### `SPRINTS` — the calendar
```js
{n:1, id:"S1", a:"Sep 28", b:"Oct 09", d0:"2026-09-28", d1:"2026-10-09", reduced:true}
```
- `n` — 1-based position; **must equal its index + 1** (first entry `n:1`, second `n:2`, …)
- `id` — the column header label
- `a`, `b` — display-only start/end text
- `d0`, `d1` — real dates, `YYYY-MM-DD`. These drive week and month zoom and the today line.
- `reduced` — optional; marks a holiday or short sprint

Add or remove sprints freely; thirteen is not special. Sprints must not overlap,
and `d0` must be before `d1`.

### `STREAMS` — the horizons
Four entries with ids `discovery`, `mvp`, `innovation`, `ops`. You may rename
`name`, `short` and `tag`. **Do not change the ids** — activities refer to them,
and `ops` is treated as enablement throughout.

### `PEOPLE`
```js
{id:"DW", name:"Dana Whitfield", role:"Product owner"}
```
- `id` — the two-letter monogram shown on every bar; keep it unique
- `name` — the join key. `ACTS` owner values must match this **character for character**.

### `PGS` — process groups and enablement items
```js
{id:"PG-01", name:"Work Intake & Triage", pod:"Juno"}
{id:"OPS-01", name:"Platform Licence Procurement", pod:"Programme", ops:true}
```
- `pod` — groups process groups for the pod filter; use your real team names
- `ops:true` — marks an enablement item (licences, access, ride-alongs). These
  get no PO/UX tracks, sit in their own section, and are excluded from the gap check.

### `ACTS` — the bars, written through the helper `A(...)`
```js
A(pg, stream, track, name, owner, s, span, type)
A("PG-01","discovery","ux","Generative research","Tom Okafor",1,3,"Research")
```
| Argument | Rule |
|---|---|
| `pg` | must exist in `PGS` |
| `stream` | one of the `STREAMS` ids |
| `track` | `"po"`, `"ux"` or `"ops"`. Use `ops` **only** on `ops:true` groups, and use nothing else there. |
| `owner` | must exactly match a `PEOPLE` `name` |
| `s` | starting sprint number |
| `span` | number of sprints it runs; `s + span - 1` must not exceed the last sprint |
| `type` | must be a key in `PHASE_OF` — that is what gives it a design stage |

### `MILESTONES` — written through the helper `M(...)`
```js
M(pg, s, kind, name)
M(null, 10, "golive", "Wave 1 go-live — Asset Records")   // null = programme-wide
M("PG-01", 4, "backlog", "Synthesis → 6 backlog items")
```
- `pg: null` places it in the major-milestone band pinned at the top
- `kind` must be a key in `KINDS`
- a milestone is positioned at the **end** of its sprint

**A milestone is a transfer or a commitment — never a task finishing.**
Something changes hands, or someone locks something in. "Requirements
baselined", "design handoff", "UAT start", "go-live" qualify. "Wireframes
complete" and "sprint review" do not.

To add a new milestone type, add an entry to `KINDS` with `label`, `def`,
`scope`, `phase`, a glyph `g`, and `major:true` if it belongs in the top band.
The About dialog renders that table directly from `KINDS`, so a new type
documents itself.

### `PHASES` and `PHASE_OF`
`PHASE_OF` maps an activity `type` to a design stage. To re-cut the stage view,
edit this one map rather than touching activities. **Every `type` used anywhere
in `ACTS` must appear as a key here**, or that activity has no design stage.

---

## 4. Order of work

1. `SPRINTS` — the real calendar first; everything references it
2. `PEOPLE` — names must be final before activities reference them
3. `PGS` — process groups and their pods
4. `ACTS` — the bulk of the work; one row per piece of work, horizon per row
5. `MILESTONES` — transfers and commitments only

---

## 5. Check your work before returning the file

Go through this list explicitly. Every item is something that will render
wrongly rather than throw an error, so nothing will warn you.

- [ ] Every `pg` used in `ACTS` and `MILESTONES` exists in `PGS`
- [ ] Every `owner` in `ACTS` matches a `PEOPLE` `name` exactly — check spelling, accents, middle names
- [ ] Every `stream` is one of the four `STREAMS` ids
- [ ] Every `type` in `ACTS` is a key in `PHASE_OF`
- [ ] Every `kind` in `MILESTONES` is a key in `KINDS`
- [ ] No activity runs past the last sprint: `s + span - 1` ≤ number of sprints
- [ ] No milestone sits outside the sprint range
- [ ] `SPRINTS` entries are in date order, do not overlap, and each `n` equals its index + 1
- [ ] `PEOPLE` initials are unique
- [ ] `ops` track appears only on `ops:true` groups, and those groups use no other track
- [ ] Every process group has at least one activity, or it will not appear at all
- [ ] Any process group with **no UX activity at all** is intentional, not an omission
- [ ] Every process group has a `pod`
- [ ] `TODAY_OVERRIDE` is deleted if the dates are real

Then open the file in a browser and confirm: rows appear, bars land in the right
sprints, and the gap count in **Metrics** matches what you would expect from the
plan. If a group you believe is well covered is showing gaps, the usual cause is
an owner name mismatch silently dropping its UX activities.

---

## 6. Viewing the file

The file is body content only — it deliberately has no `<!doctype>`, `<html>`,
`<head>` or `<body>` tags, because those are added by the platform that hosts
it. To open it locally, wrap it:

```html
<!doctype html><html><head><meta charset="utf-8"></head>
<!-- paste the file's contents here -->
</html>
```

Keep it self-contained. The only external request is a Google Fonts stylesheet;
everything else is inline. Do not add external scripts, stylesheets or images —
they are blocked where this is published, and it will fail silently.
