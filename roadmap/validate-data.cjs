#!/usr/bin/env node
/* Checks the plan data inside roadmap/design-roadmap.html for referential integrity.
   Run after editing the data block:  node roadmap/validate-data.cjs            */
"use strict";
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "design-roadmap.html");
const src = fs.readFileSync(FILE, "utf8");
const B = "BEGIN EDITABLE DATA", E = "END EDITABLE DATA";
if (!src.includes(B) || !src.includes(E)) {
  console.error("FAIL  Could not find the data markers in " + FILE);
  process.exit(1);
}
const block = src.slice(src.indexOf(B) + B.length, src.indexOf(E));
let body = block.slice(block.indexOf("var SPRINTS"));
/* the slice stops inside the closing marker comment, so drop the dangling "/*" */
const lastOpen = body.lastIndexOf("/*");
if (lastOpen > -1 && body.indexOf("*/", lastOpen) === -1) body = body.slice(0, lastOpen);

let D;
try {
  D = new Function(body + "\nreturn {SPRINTS,STREAMS,PEOPLE,PGS,ACTS,MILESTONES,KINDS,PHASES,PHASE_OF};")();
} catch (err) {
  console.error("FAIL  The data block is not valid JavaScript:\n      " + err.message);
  process.exit(1);
}

const errors = [], warnings = [];
const err = m => errors.push(m);
const warn = m => warnings.push(m);

const NS = D.SPRINTS.length;
const pgIds = new Set(D.PGS.map(p => p.id));
const people = new Set(D.PEOPLE.map(p => p.name));
const streams = new Set(D.STREAMS.map(s => s.id));
const phases = new Set(D.PHASES.map(p => p.id));
const TRACKS = new Set(["po", "ux", "ops"]);

/* sprints */
D.SPRINTS.forEach((s, i) => {
  if (s.n !== i + 1) err(`SPRINTS[${i}] has n=${s.n}; it must equal its 1-based position`);
  if (!(new Date(s.d0) < new Date(s.d1))) err(`${s.id}: d0 must be before d1`);
  if (i && new Date(s.d0) <= new Date(D.SPRINTS[i - 1].d1))
    err(`${s.id} starts on or before ${D.SPRINTS[i - 1].id} ends; sprints must not overlap`);
});

/* people + process groups */
const initials = new Map();
D.PEOPLE.forEach(p => {
  if (initials.has(p.id)) err(`Two people share the initials "${p.id}": ${initials.get(p.id)} and ${p.name}`);
  initials.set(p.id, p.name);
});
D.PGS.forEach(p => {
  if (!p.pod) err(`${p.id} has no pod`);
});

/* activities */
D.ACTS.forEach((a, i) => {
  const at = `ACTS[${i}] "${a.name}"`;
  if (!pgIds.has(a.pg)) err(`${at}: unknown process group "${a.pg}"`);
  if (!streams.has(a.stream)) err(`${at}: unknown horizon "${a.stream}"`);
  if (!TRACKS.has(a.track)) err(`${at}: track must be po, ux or ops (got "${a.track}")`);
  if (!people.has(a.owner)) err(`${at}: owner "${a.owner}" is not in PEOPLE`);
  if (!(a.span >= 1)) err(`${at}: span must be 1 or more`);
  if (a.s < 1 || a.s > NS) err(`${at}: starts at sprint ${a.s}, outside 1..${NS}`);
  else if (a.s + a.span - 1 > NS) err(`${at}: runs past S${NS}`);
  if (!D.PHASE_OF[a.type]) err(`${at}: type "${a.type}" is not in PHASE_OF, so it has no design stage`);
  else if (!phases.has(D.PHASE_OF[a.type])) err(`${at}: type "${a.type}" maps to unknown stage "${D.PHASE_OF[a.type]}"`);
  const isOpsPg = !!(D.PGS.find(p => p.id === a.pg) || {}).ops;
  if (isOpsPg && a.track !== "ops") err(`${at}: enablement items carry only the ops track`);
  if (!isOpsPg && a.track === "ops") err(`${at}: the ops track belongs to enablement items only`);
});

/* milestones */
D.MILESTONES.forEach((m, i) => {
  const at = `MILESTONES[${i}] "${m.name}"`;
  if (m.pg !== null && !pgIds.has(m.pg)) err(`${at}: unknown process group "${m.pg}"`);
  if (!D.KINDS[m.kind]) err(`${at}: kind "${m.kind}" is not defined in KINDS`);
  if (m.s < 1 || m.s > NS) err(`${at}: sprint ${m.s} is outside 1..${NS}`);
});
Object.keys(D.KINDS).forEach(k => {
  const d = D.KINDS[k];
  if (!d.label || !d.def || !d.scope) err(`KINDS.${k} needs label, def and scope (the About dialog reads them)`);
  if (d.phase && !phases.has(d.phase)) err(`KINDS.${k}: phase "${d.phase}" is not a design stage`);
});

/* things that are legal but probably unintended */
D.PGS.filter(p => !p.ops).forEach(p => {
  const mine = D.ACTS.filter(a => a.pg === p.id);
  if (!mine.length) warn(`${p.id} ${p.name} has no activities, so it will not appear on the board`);
  else if (!mine.some(a => a.track === "ux")) warn(`${p.id} ${p.name} has no UX activity at all`);
});
const orphanPeople = D.PEOPLE.filter(p => !D.ACTS.some(a => a.owner === p.name));
orphanPeople.forEach(p => warn(`${p.name} owns nothing and will not appear anywhere`));

/* derived summary — what the page will compute from this data */
const gaps = {};
D.PGS.filter(p => !p.ops).forEach(pg => {
  const po = {}, ux = {};
  D.ACTS.filter(a => a.pg === pg.id).forEach(a => {
    for (let i = 0; i < a.span; i++) (a.track === "po" ? po : a.track === "ux" ? ux : {})[a.s + i] = 1;
  });
  const f = Object.keys(po).map(Number).filter(n => ![-1, 0, 1].some(d => ux[n + d])).sort((x, y) => x - y);
  if (f.length) gaps[pg.id] = f;
});

const line = "─".repeat(64);
console.log(line);
console.log(`Data read from ${path.basename(FILE)}`);
console.log(`  ${D.SPRINTS.length} sprints · ${D.PGS.filter(p => !p.ops).length} process groups · ` +
            `${D.PGS.filter(p => p.ops).length} enablement items`);
console.log(`  ${D.ACTS.length} activities · ${D.MILESTONES.length} milestones · ${D.PEOPLE.length} people`);
console.log(`  pods: ${[...new Set(D.PGS.map(p => p.pod))].join(", ")}`);
console.log(line);
const totalGaps = Object.values(gaps).reduce((n, a) => n + a.length, 0);
console.log(`Derived UX coverage gaps: ${totalGaps} across ${Object.keys(gaps).length} process groups`);
Object.keys(gaps).forEach(id => {
  const nm = (D.PGS.find(p => p.id === id) || {}).name;
  console.log(`  ${id.padEnd(7)} ${nm} — S${gaps[id].join(", S")}`);
});
console.log(line);
warnings.forEach(w => console.log("WARN  " + w));
errors.forEach(e => console.log("FAIL  " + e));
if (errors.length) {
  console.log(`\n${errors.length} error(s). The board will render wrongly until these are fixed.`);
  process.exit(1);
}
console.log(warnings.length ? `\nNo errors. ${warnings.length} warning(s) above — check they are intentional.`
                            : "\nNo errors, no warnings.");
