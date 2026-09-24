// ── Spellcasting Rules ───────────────────────────────────────────────────────
// Pure logic (no DOM): spell slots, cantrips, prepared and known spell limits for each
// class at its own level and edition. Progressions come from data/spellcasting_data.js.

// Slot tables: index = level in that caster type, value = slots for spell levels 1–9
const FULL_CASTER_SLOTS = [null,
  [2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]
];
const HALF_CASTER_SLOTS = [null,
  [0,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],[4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,0,0,0,0]
];
const THIRD_CASTER_SLOTS = [null,
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],
  [3,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],
  [4,3,3,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,1,0,0,0,0,0]
];
// Half casters that round up (Artificer; Paladin and Ranger in 2024): slots from level 1
const ARTIFICER_SLOTS = [null,
  [2,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],[4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,0,0,0,0]
];
const PACT_MAGIC_TABLE = [null,
  {slots:1,level:1},{slots:2,level:1},{slots:2,level:2},{slots:2,level:2},
  {slots:2,level:3},{slots:2,level:3},{slots:2,level:4},{slots:2,level:4},
  {slots:2,level:5},{slots:2,level:5},{slots:3,level:5},{slots:3,level:5},
  {slots:3,level:5},{slots:3,level:5},{slots:3,level:5},{slots:3,level:5},
  {slots:4,level:5},{slots:4,level:5},{slots:4,level:5},{slots:4,level:5}
];
const _SC_TABLES = { full: FULL_CASTER_SLOTS, '1/2': HALF_CASTER_SLOTS, '1/3': THIRD_CASTER_SLOTS, artificer: ARTIFICER_SLOTS };
// Multiclass caster level contributed by each caster type
const _SC_MULTICLASS = { full: l => l, '1/2': l => Math.floor(l / 2), artificer: l => Math.ceil(l / 2), '1/3': l => Math.floor(l / 3) };

function _scEntries(ch) {
  if (ch.classes && ch.classes.length) return ch.classes;
  return [{ class: ch.class, subclass: ch.subclass, level: parseInt(ch.level) || 1 }];
}

// The spellcasting progression for one class entry at the character's edition, or null.
// Classes the app keeps on 2014 rules (Artificer) fall back to 2014.
function spellcastingProgression(ch, entry) {
  if (typeof SPELLCASTING_DATA === 'undefined') return null;
  const want = (ch.edition || '2024') === '2014' ? '2014' : '2024';
  const pick = eds => eds && (eds[want] || eds['2014']);
  const cls = pick(SPELLCASTING_DATA.classes[entry.class]);
  if (cls) return cls;
  const subs = SPELLCASTING_DATA.subclasses[entry.class] || {};
  const sub = Object.keys(subs).find(s => String(entry.subclass || '').toLowerCase().includes(s.toLowerCase()));
  return sub ? pick(subs[sub]) : null;
}

// Every class entry that casts spells, with its progression and level
function casterEntries(ch) {
  return _scEntries(ch).map(e => ({ cls: e.class, subclass: e.subclass, level: Math.max(1, Math.min(20, parseInt(e.level) || 1)), prog: spellcastingProgression(ch, e) }))
    .filter(e => e.prog);
}

function spellSlotMaxes(ch) {
  const slots = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
  const casters = casterEntries(ch);
  const pactEntry = casters.find(e => e.prog.caster === 'pact');
  const pm = pactEntry ? PACT_MAGIC_TABLE[pactEntry.level] : null;
  const regular = casters.filter(e => _SC_TABLES[e.prog.caster]);
  let row = null;
  if (regular.length === 1) row = _SC_TABLES[regular[0].prog.caster][regular[0].level];
  else if (regular.length > 1) {
    const eff = Math.min(20, regular.reduce((s, e) => s + _SC_MULTICLASS[e.prog.caster](e.level), 0));
    row = eff > 0 ? FULL_CASTER_SLOTS[eff] : null;
  }
  if (row) row.forEach((n, i) => { slots[i + 1] = n; });
  return { slots, pactSlots: pm ? pm.slots : 0, pactLevel: pm ? pm.level : 0, hasPact: !!pm };
}

// A class has spells yet? (2014 Paladin/Ranger from 2, third casters from 3)
function _scCastsAt(prog, level) {
  return !(prog.caster === '1/2' && level < 2) && !(prog.caster === '1/3' && level < 3);
}

function cantripMax(ch) {
  const parts = casterEntries(ch).filter(e => e.prog.cantrips);
  return parts.length ? parts.reduce((s, e) => s + (e.prog.cantrips[e.level - 1] || 0), 0) : null;
}

function _abilityMod(ch, ab) { return Math.floor(((ch.abilities && ch.abilities[ab]) || 10) / 2) - 5; }

// Prepared-spell limit per preparing class: 2024 uses a table, 2014 a formula (minimum 1)
function preparedLimits(ch) {
  return casterEntries(ch).filter(e => e.prog.prepared || e.prog.preparedFormula).map(e => {
    if (e.prog.prepared) return { cls: e.cls, level: e.level, limit: e.prog.prepared[e.level - 1] || 0, how: 'table' };
    const f = e.prog.preparedFormula;
    const mod = _abilityMod(ch, f.ability);
    const limit = _scCastsAt(e.prog, e.level) ? Math.max(1, Math.floor(e.level / f.divisor) + mod) : 0;
    return { cls: e.cls, level: e.level, limit, how: 'formula', ability: f.ability, mod, divisor: f.divisor };
  });
}

// Spells-known limit per class that learns a fixed number of spells (2014 Bard, Sorcerer, Warlock, Ranger...)
function knownLimits(ch) {
  return casterEntries(ch).filter(e => e.prog.known).map(e => ({ cls: e.cls, level: e.level, limit: e.prog.known[e.level - 1] || 0 }));
}

if (typeof module !== 'undefined') {
  module.exports = { spellcastingProgression, casterEntries, spellSlotMaxes, cantripMax, preparedLimits, knownLimits };
}
