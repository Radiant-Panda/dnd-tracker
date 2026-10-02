// Builds data/companion_templates.js from the 5etools data: class companions and spell summons (formula
// stats), Find Familiar / Pact of the Chain forms, Find Steed (2014) forms, and common mounts & pets.
//   node data/build-companion-templates.js
const fs = require('fs');
const path = require('path');
const { parseFormula, parseBonusText } = require('../companion-templates-rules.js');
const { entriesToRulesText } = require('./rules-text-build');
const { stripTags } = require('./build-class-features');

const SRC = 'C:/Users/Kiana/Downloads/5etools-src-main/data';
const readJson = p => JSON.parse(fs.readFileSync(path.join(SRC, p), 'utf8'));
const EDITION_2024 = new Set(['XPHB', 'XMM', 'XDMG', 'EFA', 'FRHoF']);
const edition = src => EDITION_2024.has(src) ? '2024' : '2014';
const titleCase = s => s.replace(/\b\w/g, c => c.toUpperCase());

// ── Load every monster; resolve _copy and _versions ───────────────────────
const bestiary = [];
for (const f of fs.readdirSync(path.join(SRC, 'bestiary')).filter(f => /^bestiary-.*\.json$/.test(f)))
  bestiary.push(...(readJson('bestiary/' + f).monster || []));
const byKey = new Map(bestiary.map(m => [`${m.name}|${m.source}`, m]));
const findMonster = (name, src) => byKey.get(`${name}|${src}`) || byKey.get(`${titleCase(name)}|${src}`);

function applyMod(m, mod, vars) {
  m = JSON.parse(JSON.stringify(m));
  for (const [prop, ops] of Object.entries(mod || {})) {
    for (const op of [].concat(ops)) {
      const o = typeof op === 'string' ? { mode: op } : op;
      if (prop === '*' && o.mode === 'replaceTxt') {
        const re = new RegExp(o.replace, o.flags || 'g');
        m = JSON.parse(JSON.stringify(m, (k, v) => typeof v === 'string' && k !== 'name' && k !== 'source' ? v.replace(re, o.with) : v));
        continue;
      }
      const arr = m[prop] = m[prop] || [];
      const names = [].concat(o.names || o.replace || []).map(n => typeof n === 'string' ? n : n.name);
      if (o.mode === 'removeArr') m[prop] = arr.filter(e => !names.includes(e.name));
      else if (o.mode === 'appendArr') m[prop] = arr.concat([].concat(o.items));
      else if (o.mode === 'prependArr') m[prop] = [].concat(o.items).concat(arr);
      else if (o.mode === 'replaceArr') {
        const at = arr.findIndex(e => e.name === names[0]);
        if (at >= 0) m[prop] = [...arr.slice(0, at), ...[].concat(o.items), ...arr.slice(at + 1)];
      } else if (o.mode === 'renameArr') {
        for (const r of [].concat(o.renames)) { const e = arr.find(x => x.name === r.rename); if (e) e.name = r.with; }
      } else throw new Error(`Unsupported _mod mode ${o.mode} on ${m.name}`);
    }
  }
  if (vars) m = JSON.parse(JSON.stringify(m).replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`));
  return m;
}
function resolveCopy(m) {
  if (!m._copy) return m;
  const base = byKey.get(`${m._copy.name}|${m._copy.source}`);
  if (!base) throw new Error(`Copy source missing for ${m.name}`);
  const { _copy, ...own } = m;
  return { ...applyMod(resolveCopy(base), _copy._mod), ...own };
}
const variantName = name => (name.match(/\(([^)]+)\)\s*$/) || [])[1] || name;
// _versions → [{ variant, data }] (plain versions and _abstract/_implementations)
function versionsOf(m) {
  const out = [];
  for (const v of m._versions || []) {
    if (v._abstract) {
      for (const impl of v._implementations || []) {
        const vars = impl._variables || {};
        const { _mod, ...rest } = v._abstract;
        const name = rest.name.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k]);
        const { _variables, ...implRest } = impl;
        out.push({ variant: variantName(name), data: { ...applyMod(m, _mod, vars), ...rest, ...implRest, name } });
      }
    } else {
      const { _mod, ...rest } = v;
      out.push({ variant: variantName(v.name), data: { ...applyMod(m, _mod), ...rest } });
    }
  }
  return out;
}

// ── 5etools entries → plain text with {{expr}} tokens ─────────────────────
const ATK = { mw: 'Melee Weapon Attack:', rw: 'Ranged Weapon Attack:', ms: 'Melee Spell Attack:', rs: 'Ranged Spell Attack:',
  'mw,rw': 'Melee or Ranged Weapon Attack:', 'ms,rs': 'Melee or Ranged Spell Attack:' };
const ATKR = { m: 'Melee Attack Roll:', r: 'Ranged Attack Roll:', 'm,r': 'Melee or Ranged Attack Roll:' };
const SAVE = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
function tokenise(s) {
  return String(s)
    .replace(/\{@hitYourSpellAttack[^}]*\}/g, '{{+SPELLATK}}')
    .replace(/\{@(damage|dice|hit) ([^}|]+)(?:\|[^}]*)?\}/g, (_, tag, body) => {
      const b = body.replace(/\bsummonSpellLevel\b/g, 'SL').trim();
      if (!/\b(SL|PB)\b/.test(b)) return tag === 'hit' ? (/^[+-]/.test(b) ? b : '+' + b) : b;
      // Dice count set by the spell level: "(SL - 4)d4 + 3" → "{{max(1, SL - 4)}}d4 + 3"
      const cm = b.match(/^\(([^()]+)\)d(\d+)\s*(.*)$/);
      if (cm) {
        const rest = cm[3].replace(/^\+\s*(.+)$/, (_, r) => /\b(SL|PB)\b/.test(r) ? `+ {{${r}}}` : `+ ${r}`);
        return `{{max(1, ${cm[1]})}}d${cm[2]}${rest ? ' ' + rest : ''}`;
      }
      const dm = b.match(/^(\d+d\d+)\s*\+\s*(.+)$/);
      if (dm) return `${dm[1]} + {{${dm[2]}}}`;
      return tag === 'hit' ? `{{+${b}}}` : `{{${b}}}`;
    })
    .replace(/\{@atk ([a-z,]+)\}/g, (_, k) => ATK[k] || 'Attack:')
    .replace(/\{@atkr ([a-z,]+)\}/g, (_, k) => ATKR[k] || 'Attack Roll:')
    .replace(/\{@h\}/g, 'Hit: ')
    .replace(/\{@actSave (\w+)\}/g, (_, k) => `${SAVE[k] || k} Saving Throw:`)
    .replace(/\{@actSaveFail\}/g, 'Failure:').replace(/\{@actSaveSuccess\}/g, 'Success:')
    .replace(/\{@actSaveSuccessOrFail\}/g, 'Failure or Success:')
    .replace(/\{@actTrigger\}/g, 'Trigger:').replace(/\{@actResponse\}/g, 'Response:')
    .replace(/DC equals your spell save DC/g, 'DC {{SPELLDC}}')
    .replace(/your spell save DC/g, 'DC {{SPELLDC}}')
    .replace(/\{@dc ([^}]+)\}/g, 'DC $1')
    // 2024 wording drops "to hit"; the app finds attack bonuses by "+N to hit"
    .replace(/(Attack(?: Roll)?: (?:\{\{\+[^{}]+\}\}|[+-]\d+))(?! to hit)/g, '$1 to hit');
}
const textOf = entries => entriesToRulesText(JSON.parse(tokenise(JSON.stringify(entries)))).replace(/\*\*/g, '');
// Names keep {@recharge N} so the companion sheet can count recharge uses (companion-rules.js)
const nameOf = n => stripTags(tokenise(String(n).replace(/\{@recharge ?([^}]*)\}/g, '\u0001$1\u0002')))
  .replace(/\u0001([^\u0002]*)\u0002/g, (_, x) => x ? `{@recharge ${x}}` : '{@recharge}');
const section = arr => (arr || []).map(e => ({ name: nameOf(e.name), desc: textOf(e.entries || []) }));
function speedText(sp) {
  if (!sp) return '';
  return Object.entries(sp).filter(([k]) => k !== 'canHover' && k !== 'choose').map(([k, v]) => {
    const n = typeof v === 'object' ? v.number : v, cond = typeof v === 'object' && v.condition ? ' ' + stripTags(v.condition) : '';
    return k === 'walk' ? `${n} ft.${cond}` : `${k} ${n} ft.${cond}`;
  }).join(', ');
}
function bonusList(obj, unresolved, field) {
  return Object.entries(obj || {}).map(([k, v]) => {
    const expr = /PB/.test(v) ? parseBonusText(v) : null;
    if (/PB/.test(v) && !expr) unresolved.push(field);
    const label = k.length === 3 ? k[0].toUpperCase() + k.slice(1) : titleCase(k);
    return `${label} ${expr ? `{{+${expr}}}` : v}`;
  }).join(', ');
}
function formulaField(raw, unresolved, field) {
  // ac: [15] | [{ac:15, from:[...]}] | [{special:"..."}];  hp: {average, formula} | {special}
  if (field === 'ac') {
    const a = [].concat(raw || [])[0];
    if (typeof a === 'number') return { value: a, text: String(a) };
    if (a && a.ac !== undefined) return { value: a.ac, text: `${a.ac}${a.from ? ' (' + a.from.map(stripTags).join(', ') + ')' : ''}` };
    if (a && a.special) { const f = parseFormula(a.special); if (!f) unresolved.push('ac'); return { ...(f || {}), text: a.special }; }
    unresolved.push('ac'); return { text: '' };
  }
  if (raw && raw.special) { const f = parseFormula(raw.special); if (!f) unresolved.push('hp'); return { ...(f || {}), text: raw.special }; }
  if (raw && raw.average !== undefined) return { value: raw.average, text: `${raw.average}${raw.formula ? ' (' + raw.formula + ')' : ''}` };
  unresolved.push('hp'); return { text: '' };
}
const SIZES = { T: 'Tiny', S: 'Small', M: 'Medium', L: 'Large', H: 'Huge', G: 'Gargantuan' };
const ALIGN = { L: 'Lawful', N: 'Neutral', C: 'Chaotic', G: 'Good', E: 'Evil', U: 'Unaligned', A: 'Any alignment' };
function listText(a) {
  return (a || []).map(x => {
    if (typeof x === 'string') return stripTags(x);
    if (x.special) return stripTags(x.special);
    const inner = x.resist || x.immune || x.vulnerable || x.conditionImmune;
    return inner ? `${listText(inner)}${x.note ? ' ' + stripTags(x.note) : ''}` : '';
  }).filter(Boolean).join(', ');
}
function monsterOf(m, unresolved) {
  let passive = null;
  if (m.passive !== undefined) {
    if (/PB/.test(String(m.passive))) { const e = parseBonusText(String(m.passive)); if (e) passive = `{{${e}}}`; else unresolved.push('passive'); }
    else passive = m.passive;
  }
  return {
    size: (m.size || []).map(s => SIZES[s] || s).join(' or '), type: stripTags(typeof m.type === 'object' ? m.type.type : m.type || ''),
    alignment: (m.alignment || []).map(a => typeof a === 'string' ? (ALIGN[a] || a) : '').filter(Boolean).join(' '), speed: speedText(m.speed),
    str: m.str, dex: m.dex, con: m.con, int: m.int, wis: m.wis, cha: m.cha,
    saving_throws: bonusList(m.save, unresolved, 'saves'), skills: bonusList(m.skill, unresolved, 'skills'),
    senses: [...(m.senses || []).map(stripTags), passive !== null ? `Passive Perception ${passive}` : ''].filter(Boolean).join(', '),
    languages: (m.languages || []).map(stripTags).join(', '),
    resistances: listText(m.resist), immunities: listText(m.immune), vulnerabilities: listText(m.vulnerable), condition_immunities: listText(m.conditionImmune),
    traits: section(m.trait), actions: section(m.action), bonus_actions: section(m.bonus), reactions: section(m.reaction),
  };
}

// ── Who grants what ───────────────────────────────────────────────────────
// Class companions: subclass + level + whether it is offered on level-up and how it behaves.
const BM = { cls: 'Ranger', subclass: 'Beast Master', level: 3, offer: true, persistent: true, turn: 'afterOwner', group: 'Primal Companion', feature: 'Primal Companion' };
const CLASS_META = {
  'Steel Defender|TCE':     { cls: 'Artificer', subclass: 'Battle Smith', level: 3, offer: true,  persistent: true,  turn: 'afterOwner', feature: 'Steel Defender' },
  'Steel Defender|EFA':     { cls: 'Artificer', subclass: 'Battle Smith', level: 3, offer: true,  persistent: true,  turn: 'afterOwner', feature: 'Steel Defender' },
  'Homunculus Servant|TCE': { cls: 'Artificer', level: 2, offer: false, persistent: true, turn: 'afterOwner', feature: 'Homunculus Servant' },
  'Beast of the Land|TCE': BM, 'Beast of the Sea|TCE': BM, 'Beast of the Sky|TCE': BM,
  'Beast of the Land|XPHB': BM, 'Beast of the Sea|XPHB': BM, 'Beast of the Sky|XPHB': BM,
  'Drake Companion|FTD':    { cls: 'Ranger', subclass: 'Drakewarden', level: 3, offer: true, persistent: true, turn: 'afterOwner', feature: 'Drake Companion' },
  'Wildfire Spirit|TCE':    { cls: 'Druid', subclass: 'Circle of Wildfire', level: 2, offer: false, persistent: false, turn: 'afterOwner' },
  'Dancing Item|TCE':       { cls: 'Bard', subclass: 'College of Creation', level: 6, offer: false, persistent: false, turn: 'afterOwner' },
  'Hound of Ill Omen|XGE':  { cls: 'Sorcerer', subclass: 'Shadow Magic', level: 6, offer: false, persistent: false, turn: 'own' },
};

// Spells: level and concentration from the spell files
const spellIndex = new Map();
for (const f of fs.readdirSync(path.join(SRC, 'spells')).filter(f => /^spells-.*\.json$/.test(f)))
  for (const s of readJson('spells/' + f).spell || []) spellIndex.set(`${s.name}|${s.source}`, s);
const isConc = s => (s.duration || []).some(d => d.concentration);
const creatureTags = s => [...JSON.stringify((s && s.entries) || []).matchAll(/\{@creature ([^}|]+)\|?([^}|]*)/g)].map(m => [m[1], m[2]]);

// Class feature text that tells how the creature comes back (sentences mentioning revival)
const featureTexts = [];
for (const f of fs.readdirSync(path.join(SRC, 'class')).filter(f => /^class-.*\.json$/.test(f))) {
  const j = readJson('class/' + f);
  featureTexts.push(...(j.subclassFeature || []), ...(j.classFeature || []));
}
const optFeatures = readJson('optionalfeatures.json').optionalfeature || [];
featureTexts.push(...optFeatures);
function reviveText(featureName, source) {
  const feats = featureTexts.filter(x => x.name === featureName && x.source === source).concat(featureTexts.filter(x => x.name === featureName));
  for (const ft of feats) {
    const sentences = [];
    const walk = e => {
      if (typeof e === 'string') sentences.push(...stripTags(e).split(/(?<=\.)\s+/));
      else if (e && typeof e === 'object') [].concat(e.entries || [], e.items || []).forEach(walk);
    };
    walk({ entries: ft.entries || [] });
    const hits = sentences.filter(s => /(died within the last hour|returns to life|mending)/i.test(s));
    if (hits.length) return hits.join(' ');
  }
  return null;
}

const out = {};
function add(m, meta) {
  m = resolveCopy(m);
  const key = `${m.name}|${m.source}`;
  if (out[key]) return;
  const unresolved = [];
  const versions = versionsOf(m);
  const variantData = versions.length ? Object.fromEntries(versions.map(({ variant, data }) => {
    const u = [];
    const mon = monsterOf(data, u);
    const vd = { speed: mon.speed, traits: mon.traits, actions: mon.actions, bonus_actions: mon.bonus_actions, reactions: mon.reactions,
      resistances: mon.resistances, immunities: mon.immunities };
    if (data.hp && JSON.stringify(data.hp) !== JSON.stringify(m.hp)) vd.hpF = formulaField(data.hp, u, 'hp');
    if (data.ac && JSON.stringify(data.ac) !== JSON.stringify(m.ac)) vd.acF = formulaField(data.ac, u, 'ac');
    u.forEach(x => unresolved.push(`${x} (${variant})`));
    return [variant, vd];
  })) : null;
  const t = {
    key, name: m.name, source: m.source, edition: edition(m.source),
    ...meta,
    variants: versions.length ? versions.map(v => v.variant) : null,
    acF: formulaField(m.ac, unresolved, 'ac'), hpF: formulaField(m.hp, unresolved, 'hp'),
    monster: monsterOf(m, unresolved), variantData,
    revive: meta.revive || null,
  };
  t.unresolved = [...new Set(unresolved)];
  out[key] = t;
}

// 1. Formula creatures
for (const m of bestiary.filter(m => m.summonedBySpell || m.summonedByClass)) {
  const key = `${m.name}|${m.source}`;
  if (m.summonedByClass) {
    const c = CLASS_META[key];
    if (!c) throw new Error('No CLASS_META for ' + key);
    add(m, { kind: 'class', group: c.group || m.name, grantedBy: { cls: c.cls, subclass: c.subclass, level: c.level },
      offer: c.offer, persistent: c.persistent, atZero: c.persistent ? 'down' : 'vanish', turn: c.turn, concentration: false,
      revive: c.feature ? reviveText(c.feature, m.source) : null });
  } else {
    const [spName, spSrc] = m.summonedBySpell.split('|');
    const sp = spellIndex.get(`${spName}|${spSrc}`);
    const steed = /Find Steed/.test(spName);
    add(m, { kind: 'summon', group: spName, grantedBy: { spell: spName, spellLevel: m.summonedBySpellLevel || (sp && sp.level) || 1 },
      offer: false, persistent: steed, atZero: steed ? 'down' : 'vanish', turn: 'afterOwner', concentration: !!(sp && isConc(sp)) });
  }
}
// 2. Find Familiar forms (both editions) and Pact of the Chain extras
const FAMILIAR = { kind: 'familiar', offer: false, persistent: true, atZero: 'vanish', turn: 'own', concentration: false };
for (const [spKey, ed] of [['Find Familiar|PHB', '2014'], ['Find Familiar|XPHB', '2024']]) {
  for (const [n, s] of creatureTags(spellIndex.get(spKey))) {
    const m = findMonster(n, s || (ed === '2024' ? 'XMM' : 'MM'));
    if (m) add(m, { ...FAMILIAR, group: 'Find Familiar', grantedBy: { spell: 'Find Familiar', spellLevel: 1 } });
  }
}
for (const of of optFeatures.filter(o => o.name === 'Pact of the Chain')) {
  for (const [n, s] of creatureTags(of)) {
    const m = findMonster(n, s || (edition(of.source) === '2024' ? 'XMM' : 'MM'));
    if (m) add(m, { ...FAMILIAR, group: 'Pact of the Chain', grantedBy: { spell: 'Find Familiar', spellLevel: 1, pact: true } });
  }
}
// 3. Find Steed (2014) forms
for (const [n, s] of creatureTags(spellIndex.get('Find Steed|PHB'))) {
  const m = findMonster(n, s || 'MM');
  if (m) add(m, { kind: 'summon', group: 'Find Steed', grantedBy: { spell: 'Find Steed', spellLevel: 2 }, offer: false,
    persistent: true, atZero: 'down', turn: 'afterOwner', concentration: false });
}
// 4. Mounts & pets (Owl, Cat, Hawk, Raven are familiar forms — they live under Familiars, not here)
for (const n of ['Riding Horse', 'Draft Horse', 'Warhorse', 'Pony', 'Mule', 'Camel', 'Elk', 'Mastiff', 'Giant Lizard'])
  for (const s of ['MM', 'XMM']) {
    const m = byKey.get(`${n}|${s}`);
    if (m) add(m, { kind: 'mount', group: 'Mounts & pets', grantedBy: {}, offer: false, persistent: true,
      atZero: 'down', turn: 'own', concentration: false });
  }

const header = '// Generated by data/build-companion-templates.js — do not edit by hand.\n';
fs.writeFileSync(path.join(__dirname, 'companion_templates.js'),
  header + 'const COMPANION_TEMPLATES = ' + JSON.stringify(out) + ';\nif (typeof module !== \'undefined\') module.exports = COMPANION_TEMPLATES;\n');
const unresolved = Object.values(out).filter(t => t.unresolved.length);
const counts = Object.values(out).reduce((a, t) => (a[t.kind] = (a[t.kind] || 0) + 1, a), {});
console.log(`${Object.keys(out).length} templates written (${JSON.stringify(counts)}); ${unresolved.length} with unresolved fields`);
unresolved.forEach(t => console.log('  ' + t.key + ': ' + t.unresolved.join(', ')));
