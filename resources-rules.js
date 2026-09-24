// ── Resource Rules ───────────────────────────────────────────────────────────
// Pure logic (no DOM) for class/subclass resource trackers. A resource's max, die
// and recharge are derived when read — from its formula, the level of the class
// that grants it, and that class's edition — so they never go stale.

// Base class resources. Formulas return 0 below the level a resource unlocks;
// `editions` limits a resource to one ruleset.
const BASE_CLASS_RESOURCES = {
  Barbarian: [
    { name: 'Rage', maxFormula: 'rage_uses', recharge: 'long', type: 'pips',
      desc: 'Enter a rage as a Bonus Action. Lasts 1 minute.' },
  ],
  Bard: [
    { name: 'Bardic Inspiration', maxFormula: 'cha_mod', recharge: 'long', type: 'pips', die: 'd6',
      desc: 'Give a creature a Bardic Inspiration die as a Bonus Action.' },
  ],
  Cleric: [
    { name: 'Channel Divinity', maxFormula: 'channel_divinity', recharge: 'short', type: 'pips',
      desc: 'Channel divine energy to fuel special abilities.' },
  ],
  Druid: [
    { name: 'Wild Shape', maxFormula: 'wild_shape', recharge: 'short', type: 'pips',
      desc: 'Magically assume the shape of a beast.' },
  ],
  Fighter: [
    { name: 'Second Wind', maxFormula: 'second_wind', recharge: 'short', type: 'pips', die: 'd10',
      desc: 'Regain HP as a Bonus Action.' },
    { name: 'Action Surge', maxFormula: 'action_surge', recharge: 'short', type: 'pips',
      desc: 'Take one additional action on your turn.' },
    { name: 'Indomitable', maxFormula: 'indomitable', recharge: 'long', type: 'pips',
      desc: 'Reroll a saving throw you fail. Gains extra uses at L13 and L17.' },
  ],
  Monk: [
    { name: 'Ki Points', maxFormula: 'ki_points', recharge: 'short', type: 'pips',
      desc: 'Fuel special monk abilities like Flurry of Blows and Patient Defense.' },
  ],
  Paladin: [
    { name: 'Lay on Hands', maxFormula: 'level_x5', recharge: 'long', type: 'pool',
      desc: 'Restore HP by touch. Pool of HP equal to 5× Paladin level.' },
    { name: 'Channel Divinity', maxFormula: 'paladin_cd', recharge: 'short', type: 'pips',
      desc: 'Channel divine energy through your sacred oath.' },
  ],
  Ranger: [
    { name: 'Favored Enemy', maxFormula: 'favored_enemy', recharge: 'long', type: 'pips', editions: ['2024'],
      desc: 'Cast Hunter\'s Mark without expending a spell slot.' },
  ],
  Sorcerer: [
    { name: 'Sorcery Points', maxFormula: 'sorcery_points', recharge: 'long', type: 'pips',
      desc: 'Points that fuel Metamagic and other sorcerous effects.' },
    { name: 'Innate Sorcery', maxFormula: 2, recharge: 'long', type: 'pips', editions: ['2024'],
      desc: 'Bonus Action: for 1 minute, +1 to your spell save DC and Advantage on Sorcerer spell attacks.' },
  ],
  Warlock: [6, 7, 8, 9].map(n => ({
    name: `Mystic Arcanum (${n}th)`, maxFormula: `arcanum_${n}`, recharge: 'long', type: 'pips',
    desc: `Cast a ${n}th-level spell once per long rest without expending a spell slot.`,
  })),
  Wizard: [
    { name: 'Arcane Recovery', maxFormula: 1, recharge: 'long', type: 'pips',
      desc: 'Recover expended spell slots during a Short Rest (once per Long Rest).' },
  ],
  Artificer: [
    { name: 'Infuse Item', maxFormula: 'artificer_infuse', recharge: 'long', type: 'pips',
      desc: 'Infuse mundane items with magical power.' },
  ],
};

// Maps resource name → [[minClassLevel, die], ...] sorted ascending
const RESOURCE_DIE_SCALE = {
  'Bardic Inspiration':   [[1,'d6'],[5,'d8'],[10,'d10'],[15,'d12']],
  'Superiority Dice':     [[3,'d8'],[10,'d10'],[18,'d12']],
  'Psionic Energy Dice':  [[3,'d6'],[5,'d8'],[11,'d10'],[17,'d12']],
};

function scaledDie(resourceName, level) {
  const tiers = RESOURCE_DIE_SCALE[resourceName];
  if (!tiers) return null;
  let die = tiers[0][1];
  for (const [lvl, d] of tiers) { if (level >= lvl) die = d; }
  return die;
}

function _resProfBonus(totalLevel) { return Math.ceil(totalLevel / 4) + 1; }

// Which ruleset applies to a class: 2014 characters use 2014 rules; classes with no
// 2024 data (Artificer) stay on 2014 rules even for 2024 characters.
function _resClassEdition(ch, cls) {
  if ((ch.edition || '2024') === '2014') return '2014';
  if (cls && typeof CLASS_FEATURES_2024 !== 'undefined' && !CLASS_FEATURES_2024[cls]) return '2014';
  return '2024';
}

function _resClassEntries(ch) {
  if (ch.classes && ch.classes.length) return ch.classes;
  return [{ class: ch.class, subclass: ch.subclass, level: parseInt(ch.level) || 1 }];
}

function _resClassLevel(ch, cls) {
  const e = _resClassEntries(ch).find(c => c.class === cls);
  return e ? (parseInt(e.level) || 1) : 0;
}

// lvl = level in the class that grants the resource (defaults to total level).
// Proficiency bonus always uses total character level.
function resolveMaxFormula(formula, ch, lvl, edition) {
  if (typeof formula === 'number') return formula;
  const abilityMod = s => Math.floor(((ch.abilities?.[s] || 10) - 10) / 2);
  const total = parseInt(ch.level) || 1;
  const lv = lvl || total;
  const is2014 = (edition || ch.edition || '2024') === '2014';
  switch (formula) {
    case 'cha_mod':    return Math.max(1, abilityMod('cha'));
    case 'int_mod':    return Math.max(1, abilityMod('int'));
    case 'wis_mod':    return Math.max(1, abilityMod('wis'));
    case 'proficiency': return _resProfBonus(total);
    case 'level':      return lv;
    case 'level_div_2': return Math.max(1, Math.floor(lv / 2));
    case 'level_x5':   return lv * 5;
    case 'rage_uses':  return lv >= 17 ? 6 : lv >= 12 ? 5 : lv >= 6 ? 4 : lv >= 3 ? 3 : 2;
    case 'channel_divinity':
      if (lv < 2) return 0;
      return is2014 ? (lv >= 18 ? 3 : lv >= 6 ? 2 : 1) : (lv >= 18 ? 4 : lv >= 6 ? 3 : 2);
    case 'paladin_cd':
      if (lv < 3) return 0;
      return is2014 ? 1 : (lv >= 11 ? 3 : 2);
    case 'wild_shape':
      if (lv < 2) return 0;
      return is2014 ? 2 : (lv >= 17 ? 4 : lv >= 6 ? 3 : 2);
    case 'ki_points':       return lv >= 2 ? lv : 0;
    case 'sorcery_points':  return lv >= 2 ? lv : 0;
    case 'artificer_infuse': return lv >= 18 ? 6 : lv >= 14 ? 5 : lv >= 10 ? 4 : lv >= 6 ? 3 : lv >= 2 ? 2 : 0;
    case 'indomitable':     return lv >= 17 ? 3 : lv >= 13 ? 2 : lv >= 9 ? 1 : 0;
    case 'second_wind':     return is2014 ? 1 : (lv >= 10 ? 4 : lv >= 4 ? 3 : 2);
    case 'action_surge':    return lv >= 17 ? 2 : 1;
    case 'favored_enemy':   return lv >= 17 ? 6 : lv >= 13 ? 5 : lv >= 9 ? 4 : lv >= 5 ? 3 : 2;
    case 'arcanum_6': return lv >= 11 ? 1 : 0;
    case 'arcanum_7': return lv >= 13 ? 1 : 0;
    case 'arcanum_8': return lv >= 15 ? 1 : 0;
    case 'arcanum_9': return lv >= 17 ? 1 : 0;
    default:           return parseInt(formula) || 1;
  }
}

// The class a stored resource belongs to (older saves only recorded it as `source`).
function resourceClass(r) {
  return r._forClass || (r._baseClass ? r.source : null);
}

// Base resources shared by several classes (Channel Divinity for Cleric + Paladin) are one
// tracker; multiclassing rules give you the larger count, not the sum.
function _baseDefsNamed(ch, name) {
  return _resClassEntries(ch).flatMap(e =>
    (BASE_CLASS_RESOURCES[e.class] || [])
      .filter(d => d.name === name && (!d.editions || d.editions.includes(_resClassEdition(ch, e.class))))
      .map(d => ({ def: d, cls: e.class })));
}

function resourceMax(r, ch) {
  if (r.custom || r.maxOverride != null) return r.maxOverride != null ? r.maxOverride : (parseInt(r.max) || 0);
  if (r._baseClass) {
    const defs = _baseDefsNamed(ch, r.name);
    if (defs.length) return Math.max(...defs.map(({ def, cls }) =>
      resolveMaxFormula(def.maxFormula, ch, _resClassLevel(ch, cls), _resClassEdition(ch, cls))));
  }
  const cls = resourceClass(r);
  const formula = r.maxFormula !== undefined ? r.maxFormula : r.max;
  return resolveMaxFormula(formula, ch, cls ? _resClassLevel(ch, cls) : 0, _resClassEdition(ch, cls));
}

function resourceDie(r, ch) {
  const cls = resourceClass(r);
  return (!r.custom && scaledDie(r.name, cls ? _resClassLevel(ch, cls) : (parseInt(ch.level) || 1))) || r.die || null;
}

function resourceRecharge(r, ch) {
  // Font of Inspiration: Bardic Inspiration recharges on a short rest from Bard level 5
  if (!r.custom && r.name === 'Bardic Inspiration') return _resClassLevel(ch, 'Bard') >= 5 ? 'short' : 'long';
  return r.recharge || 'long';
}

// Base-class resources the character should have right now: [{def, cls}], one per name.
function expectedBaseResources(ch) {
  const seen = new Set(), out = [];
  for (const e of _resClassEntries(ch)) {
    for (const def of BASE_CLASS_RESOURCES[e.class] || []) {
      if (seen.has(def.name)) continue;
      if (def.editions && !def.editions.includes(_resClassEdition(ch, e.class))) continue;
      const r = { name: def.name, _baseClass: true, _forClass: e.class, maxFormula: def.maxFormula };
      if (resourceMax(r, ch) <= 0) continue;
      seen.add(def.name);
      out.push({ def, cls: e.class });
    }
  }
  return out;
}

if (typeof module !== 'undefined') {
  module.exports = { BASE_CLASS_RESOURCES, scaledDie, resolveMaxFormula, resourceMax, resourceDie,
    resourceRecharge, expectedBaseResources };
}
