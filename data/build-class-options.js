/**
 * Extracts class options (Eldritch Invocations, Metamagic, Maneuvers, Infusions,
 * Fighting Styles, etc.) and how many of each a class/subclass gets per level.
 * Run: node data/build-class-options.js
 * Outputs: data/class_options.js
 */

const fs = require('fs');
const path = require('path');
const { stripTags, flattenEntries } = require('./build-class-features');

const SRC_ROOT = 'C:\\Users\\Kiana\\Downloads\\5etools-src-main\\data';

const TYPE_LABELS = {
  'EI':   'Eldritch Invocations',
  'PB':   'Pact Boon',
  'MM':   'Metamagic',
  'MV:B': 'Maneuvers',
  'AI':   'Artificer Infusions',
  'AS':   'Arcane Shots',
  'RN':   'Runes',
  'ED':   'Elemental Disciplines',
  'FS:F': 'Fighting Style',
  'FS:P': 'Fighting Style',
  'FS:R': 'Fighting Style',
  'FS:B': 'Fighting Style',
};

const editionOf = source => (source === 'XPHB' ? '2024' : '2014');

// Converts a 5etools prerequisite (array of OR'd objects, keys within an object AND'd)
// into a flat shape the app can check without knowing 5etools conventions.
function convertPrereq(p) {
  const out = {};
  if (p.level) {
    out.level = typeof p.level === 'number' ? p.level : p.level.level;
    if (p.level.class) out.cls = p.level.class.name;
    if (p.level.subclass) out.subclass = p.level.subclass.name;
  }
  if (p.pact) out.options = ['Pact of the ' + p.pact];
  if (p.optionalfeature) {
    out.options = (out.options || []).concat(p.optionalfeature.map(s =>
      s.split('|')[0].replace(/\b\w/g, c => c.toUpperCase()).replace(/\bOf\b/g, 'of').replace(/\bThe\b/g, 'the')));
  }
  for (const s of p.spell || []) {
    if (typeof s === 'object') {
      out.other = (out.other ? out.other + '; ' : '') + (s.entrySummary || stripTags(s.entry || ''));
    } else if (s === 'hex/curse#x') {
      out.hexOrCurse = true;
    } else {
      out.spells = (out.spells || []).concat(s.split('#')[0].split('|')[0]);
    }
  }
  if (p.item) out.other = (out.other ? out.other + '; ' : '') + p.item.join(' or ');
  if (p.otherSummary) out.other = (out.other ? out.other + '; ' : '') + (p.otherSummary.entrySummary || stripTags(p.otherSummary.entry));
  return out;
}

const raw = JSON.parse(fs.readFileSync(path.join(SRC_ROOT, 'optionalfeatures.json'), 'utf8')).optionalfeature;

const options = raw
  .map(o => ({ ...o, featureType: (o.featureType || []).filter(t => TYPE_LABELS[t]) }))
  .filter(o => o.featureType.length)
  .map(o => {
    const desc = flattenEntries(o.entries || []);
    const opt = { name: o.name, types: o.featureType, source: o.source, edition: editionOf(o.source), desc };
    if (o.prerequisite) opt.prereq = o.prerequisite.map(convertPrereq);
    if (/\bRepeatable\b/.test(desc)) opt.repeatable = true;
    return opt;
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// Normalise both 5etools progression shapes (20-length array, or {level: count} map) to 20-length arrays.
function toCounts(prog) {
  if (Array.isArray(prog)) return prog;
  const counts = [];
  let cur = 0;
  for (let lvl = 1; lvl <= 20; lvl++) {
    if (prog[lvl] != null) cur = prog[lvl];
    counts.push(cur);
  }
  return counts;
}

const progressions = [];
const subclasses2024 = []; // "Class|Short Name" of subclasses reprinted in XPHB
for (const f of fs.readdirSync(path.join(SRC_ROOT, 'class')).filter(f => /^class-.*\.json$/.test(f))) {
  const d = JSON.parse(fs.readFileSync(path.join(SRC_ROOT, 'class', f), 'utf8'));
  const add = (cls, subclass, source, p) => {
    const types = p.featureType.filter(t => TYPE_LABELS[t]);
    if (!types.length) return;
    progressions.push({ cls, subclass, edition: editionOf(source), label: p.name, types, counts: toCounts(p.progression) });
  };
  for (const c of d.class || []) for (const p of c.optionalfeatureProgression || []) add(c.name, null, c.source, p);
  for (const s of d.subclass || []) {
    if (s.source === 'XPHB') subclasses2024.push(s.className + '|' + s.shortName);
    for (const p of s.optionalfeatureProgression || []) add(s.className, s.shortName, s.source, p);
  }
}

const out = [
  '// AUTO-GENERATED from 5etools data — do not edit by hand',
  '// Run: node data/build-class-options.js to regenerate',
  '',
  `const CLASS_OPTIONS_DATA = ${JSON.stringify({ typeLabels: TYPE_LABELS, options, progressions, subclasses2024 })};`,
  '',
].join('\n');

const outPath = path.join(__dirname, 'class_options.js');
fs.writeFileSync(outPath, out, 'utf8');
console.log(`${options.length} options, ${progressions.length} progressions → ${outPath}`);
