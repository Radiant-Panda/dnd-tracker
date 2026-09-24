/**
 * Adds spells, feats, backgrounds and species from every official book in the 5etools
 * source that the app doesn't have yet. Existing entries are never changed; anything whose
 * name the app already has (a reprint) is skipped. Descriptions use rules-text markup.
 * Run: node data/import-official-books.js [--dry] [spells|feats|backgrounds|species ...]
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { entriesToRulesText } = require('./rules-text-build');
const { stripTags } = require('./build-class-features');

const SRC = 'C:\\Users\\Kiana\\Downloads\\5etools-src-main\\data';
const J = f => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
const argv = process.argv.slice(2);
const dry = argv.includes('--dry');
const only = argv.filter(a => !a.startsWith('--'));
const want = k => !only.length || only.includes(k);
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// ── Which sources are official Wizards of the Coast material ──
const BOOKS = [...J('books.json').book, ...J('adventures.json').adventure];
const BOOK = Object.fromEntries(BOOKS.map(b => [b.id, b]));
const EXTRA_OFFICIAL = { EEPC: "Elemental Evil Player's Companion", LLK: 'Lost Laboratory of Kwalish', PSA: 'Plane Shift: Amonkhet', PSD: 'Plane Shift: Dominaria',
  PSI: 'Plane Shift: Ixalan', PSK: 'Plane Shift: Kaladesh', PSX: 'Plane Shift: Ixalan', PSZ: 'Plane Shift: Zendikar' };
function isOfficial(source) {
  if (EXTRA_OFFICIAL[source]) return true;
  const b = BOOK[source];
  if (!b) return false;
  if (['core', 'setting', 'supplement'].includes(b.group)) return true;
  return /Wizards/i.test(b.author || ''); // supplement-alt / setting-alt: only Wizards' own releases
}
const bookName = source => EXTRA_OFFICIAL[source] || BOOK[source]?.name || source;

const added = {}, skipped = {};
const note = (map, k, v) => { (map[k] = map[k] || []).push(v); };

// 5etools `_copy` entries inherit from another entry; resolve the simple cases (own fields
// override the base; `_mod` edits to entries are applied for the common append/replace modes).
function resolveCopy(entry, pool) {
  if (!entry._copy) return entry;
  const base = pool.find(x => x.name === entry._copy.name && x.source === entry._copy.source);
  if (!base) return null;
  const merged = { ...resolveCopy(base, pool), ...entry };
  delete merged._copy;
  const mods = entry._copy._mod && entry._copy._mod.entries;
  if (mods) {
    let entries = [...(merged.entries || [])];
    for (const m of [].concat(mods)) {
      const items = [].concat(m.items || []);
      if (m.mode === 'appendArr') entries.push(...items);
      else if (m.mode === 'prependArr') entries.unshift(...items);
      else if (m.mode === 'insertArr') entries.splice(m.index || 0, 0, ...items);
      else if (m.mode === 'replaceArr') {
        const i = entries.findIndex(e => (typeof m.replace === 'string' ? e && e.name === m.replace : e === m.replace));
        if (i >= 0) entries.splice(i, 1, ...items);
      } else if (m.mode === 'removeArr') {
        const names = [].concat(m.names || []);
        entries = entries.filter(e => !(e && names.includes(e.name)));
      } else return null; // an edit we can't apply faithfully — skip rather than import it wrong
    }
    merged.entries = entries;
  }
  return merged;
}

// ── Spells ──
if (want('spells')) {
  const file = path.join(__dirname, 'spells.json');
  const spells = JSON.parse(fs.readFileSync(file, 'utf8'));
  const have = new Set(spells.map(s => norm(s.name)));
  const lookup = J('generated/gendata-spell-source-lookup.json');
  const classLists = J('spells/sources.json'); // class lists for spells whose book adds them (FTD, BMT…)
  const SCHOOL = { A: 'Abjuration', C: 'Conjuration', D: 'Divination', E: 'Enchantment', V: 'Evocation', I: 'Illusion', N: 'Necromancy', T: 'Transmutation' };
  const ord = n => n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
  const plural = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`;
  const time = t => {
    const unit = { action: 'action', bonus: 'bonus action', reaction: 'reaction' }[t.unit] || t.unit;
    return ['action', 'bonus action', 'reaction'].includes(unit) ? `${t.number} ${unit}` : plural(t.number, unit);
  };
  const range = r => {
    const d = r.distance || {};
    if (r.type === 'point') {
      if (d.type === 'self') return 'Self';
      if (d.type === 'touch') return 'Touch';
      if (d.type === 'sight') return 'Sight';
      if (d.type === 'unlimited') return 'Unlimited';
      if (d.type === 'feet') return `${d.amount} ft.`;
      if (d.type === 'miles') return plural(d.amount, 'mile');
    }
    if (r.type === 'special') return 'Special';
    if (d.amount) return `Self (${d.amount}-${d.type === 'miles' ? 'mile' : 'foot'} ${r.type === 'radius' ? 'radius' : r.type})`;
    return 'Special';
  };
  const components = c => [c.v && 'V', c.s && 'S', c.r && 'R',
    c.m && `M (${stripTags(typeof c.m === 'string' ? c.m : c.m.text)})`].filter(Boolean).join(', ');
  const duration = ds => ds.map(d => {
    if (d.type === 'instant') return 'Instantaneous';
    if (d.type === 'permanent') return (d.ends || []).includes('trigger') ? 'Until dispelled or triggered' : 'Until dispelled';
    if (d.type === 'special') return 'Special';
    const len = plural(d.duration.amount, d.duration.type);
    return d.concentration ? `Concentration, up to ${len}` : len;
  }).join(' or ');
  const index = J('spells/index.json');
  for (const [source, f] of Object.entries(index)) {
    for (const raw of J('spells/' + f).spell) {
      if (!isOfficial(source)) { note(skipped, 'spells (not official)', `${raw.name} [${source}]`); continue; }
      if (have.has(norm(raw.name))) continue;
      const sp = resolveCopy(raw, J('spells/' + f).spell);
      if (!sp) { note(skipped, 'spells (unresolved copy)', `${raw.name} [${source}]`); continue; }
      const classes = new Set();
      for (const bySrc of Object.values(lookup[source.toLowerCase()]?.[sp.name.toLowerCase()]?.class || {})) Object.keys(bySrc).forEach(c => classes.add(c));
      const listed = classLists[source]?.[sp.name] || {};
      [...(listed.class || []), ...(listed.classVariant || [])].forEach(c => classes.add(c.name));
      spells.push({
        name: sp.name,
        level_int: sp.level,
        level: sp.level === 0 ? 'Cantrip' : `${ord(sp.level)}-level`,
        school: SCHOOL[sp.school] || sp.school,
        casting_time: (sp.time || []).map(time).join(' or '),
        range: range(sp.range || {}),
        components: components(sp.components || {}),
        duration: duration(sp.duration || []),
        concentration: (sp.duration || []).some(d => d.concentration) ? 'yes' : 'no',
        ritual: sp.meta && sp.meta.ritual ? 'yes' : 'no',
        desc: entriesToRulesText([...(sp.entries || []), ...(sp.entriesHigherLevel || [])]),
        source: bookName(source),
        book: bookName(source),
        dnd_class: [...classes].sort().join(', '),
        src: source.toLowerCase(),
      });
      have.add(norm(sp.name));
      note(added, 'spells', `${sp.name} [${source}]`);
    }
  }
  if (!dry) fs.writeFileSync(file, JSON.stringify(spells, null, 2), 'utf8');
}

function loadData(file, name) {
  const p = path.join(__dirname, file);
  const src = fs.readFileSync(p, 'utf8');
  const i = src.indexOf('const ' + name);
  const data = new Function(src + ';return ' + name)();
  assert.deepStrictEqual(JSON.parse(JSON.stringify(data)), data, file + ' holds non-JSON values');
  return { data, save: () => dry || fs.writeFileSync(p, src.slice(0, i) + 'const ' + name + ' = ' + JSON.stringify(data, null, 2) + ';\n', 'utf8') };
}
const title = s => String(s).replace(/\b\w/g, c => c.toUpperCase());

// ── Feats ──
// Short labels for the feat browser's source filter, matching the existing ones ("Tasha's")
const FEAT_SOURCE_LABELS = { XPHB: 'PHB 2024', PHB: 'PHB 2014', XGE: "Xanathar's", TCE: "Tasha's", FTD: "Fizban's", BGG: "Bigby's",
  DSotDQ: 'Dragonlance', ERLW: 'Eberron', SatO: 'Sigil and the Outlands', EFA: 'Forge of the Artificer', SCC: 'Strixhaven',
  FRHoF: 'Heroes of the Frontier', BMT: 'Book of Many Things', AAG: 'Spelljammer', ABH: "Astarion's Book of Hungers", LFL: 'Lorwyn' };
const FEAT_CATEGORIES = { G: 'General', O: 'Origin', FS: 'Fighting Style', 'FS:P': 'FS:P', 'FS:R': 'FS:R', EB: 'EB', D: 'Dragonmark' };
const ABBR = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };

// 5etools prerequisites → readable text. Alternatives are OR'd; parts shared by every
// alternative are listed once ("Level 4+, STR or DEX 13+").
function prereqText(prereqs) {
  if (!prereqs || !prereqs.length) return '';
  const cats = { D: 'Dragonmark' };
  const alts = prereqs.map(p => {
    const parts = [];
    if (p.campaign) parts.push(p.campaign.join(' or ') + ' campaign');
    if (p.level != null) {
      const l = typeof p.level === 'number' ? { level: p.level } : p.level;
      parts.push(l.class ? `${l.class.name} ${l.level}+` : `Level ${l.level}+`);
    }
    if (p.ability) {
      const byScore = {};
      p.ability.forEach(a => Object.entries(a).forEach(([k, v]) => { (byScore[v] = byScore[v] || []).push(ABBR[k] || k); }));
      Object.entries(byScore).forEach(([v, abs]) => parts.push(`${abs.join(' or ')} ${v}+`));
    }
    if (p.race) parts.push(p.race.map(r => title(r.displayEntry || (r.subrace ? `${r.subrace} ${r.name}` : r.name))).join(' or '));
    if (p.background) parts.push(p.background.map(b => title(b.name) + ' background').join(' or '));
    if (p.feat) parts.push(p.feat.map(f => title(f.split('|')[2] || f.split('|')[0])).join(' or ') + ' feat');
    if (p.feature) parts.push(p.feature.map(f => title(f)).join(' or ') + ' feature');
    if (p.spellcasting || p.spellcasting2020) parts.push('Spellcasting or Pact Magic feature');
    if (p.spellcastingFeature) parts.push('Spellcasting feature');
    if (p.proficiency) p.proficiency.forEach(pr => Object.entries(pr).forEach(([k, v]) => parts.push(`${title(v)} ${k} proficiency`)));
    if (p.featCategory) parts.push(p.featCategory.map(c => `A ${cats[c] || c} feat`).join(' or '));
    if (p.exclusiveFeatCategory) parts.push(p.exclusiveFeatCategory.map(c => `No other ${cats[c] || c} feat`).join(', '));
    if (p.other) parts.push(p.other);
    if (p.otherSummary) parts.push(p.otherSummary.entrySummary || stripTags(p.otherSummary.entry));
    return parts;
  });
  const common = alts[0].filter(part => alts.every(a => a.includes(part)));
  const rest = alts.map(a => a.filter(part => !common.includes(part)).join(', ')).filter(Boolean);
  return [...common, rest.length ? [...new Set(rest)].join(' or ') : null].filter(Boolean).join(', ');
}

function abilityBonus(ability) {
  const a = (ability || [])[0];
  if (!a) return {};
  if (a.choose) return { choose: { from: a.choose.from, count: a.choose.count || 1, amount: a.choose.amount || 1 } };
  return Object.fromEntries(Object.entries(a).filter(([k]) => ABBR[k]));
}

if (want('feats')) {
  const { data, save } = loadData('feats_items.js', 'FEATS_ITEMS_DATA');
  const pool = J('feats.json').feat;
  const have = new Set(data.feats.map(f => norm(f.name)));
  // Existing feats: only the prerequisite text is regenerated (some were raw data dumps)
  let fixed = 0;
  for (const f of data.feats) {
    const src = pool.find(x => x.name === f.name && x.source === f.source_key);
    if (!src) continue;
    const text = prereqText(resolveCopy(src, pool)?.prerequisite);
    if (text !== f.prerequisite) { f.prerequisite = text; fixed++; }
  }
  note(added, 'feat prerequisite rewrites', `${fixed} existing feats`);
  for (const raw of pool) {
    if (!isOfficial(raw.source)) { note(skipped, 'feats (not official)', `${raw.name} [${raw.source}]`); continue; }
    if (have.has(norm(raw.name))) continue;
    const f = resolveCopy(raw, pool);
    if (!f) { note(skipped, 'feats (unresolved copy)', `${raw.name} [${raw.source}]`); continue; }
    data.feats.push({
      name: f.name,
      source: FEAT_SOURCE_LABELS[f.source] || bookName(f.source),
      source_key: f.source,
      category: FEAT_CATEGORIES[f.category] || 'General',
      prerequisite: prereqText(f.prerequisite),
      repeatable: !!f.repeatable,
      ability_bonus: abilityBonus(f.ability),
      desc: entriesToRulesText(f.entries || []),
    });
    have.add(norm(f.name));
    note(added, 'feats', `${f.name} [${f.source}]`);
  }
  save();
}

for (const [k, v] of Object.entries(added)) console.log(`\nADDED ${k} (${v.length}):\n  ${v.join('\n  ')}`);
for (const [k, v] of Object.entries(skipped)) console.log(`\nSKIPPED ${k} (${v.length}): ${v.slice(0, 30).join(', ')}${v.length > 30 ? ', …' : ''}`);
if (dry) console.log('\n(dry run — nothing written)');
