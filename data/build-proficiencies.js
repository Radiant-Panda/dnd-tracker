/**
 * Extracts language lists (per edition), species languages and multiclass proficiencies
 * from 5etools. Run: node data/build-proficiencies.js → data/proficiency_data.js
 */

const fs = require('fs');
const path = require('path');
const { stripTags } = require('./build-class-features');

const SRC = 'C:\\Users\\Kiana\\Downloads\\5etools-src-main\\data';
const J = f => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
const title = s => String(s).replace(/\b\w/g, c => c.toUpperCase()).replace(/'S\b/g, "'s").replace(/\b(Of|The)\b/g, w => w.toLowerCase());

// ── Language lists: 2014 PHB groups (standard/exotic/secret), 2024 PHB (standard/rare) ──
const langs = J('languages.json').language;
const group = (source, types) => Object.fromEntries(types.map(t => [t, langs.filter(l => l.source === source && l.type === t).map(l => l.name).sort()]));
const languages = { '2014': group('PHB', ['standard', 'exotic', 'secret']), '2024': group('XPHB', ['standard', 'rare']) };

// ── Species languages (2024 species grant none: every 2024 character picks Common + 2) ──
const LANG_KEYS = Object.fromEntries(langs.map(l => [l.name.toLowerCase().replace(/[^a-z]/g, ''), l.name]));
const speciesLanguages = {};
for (const r of J('races.json').race) {
  const lp = (r.languageProficiencies || [])[0];
  if (!lp || r.edition === 'one') continue;
  const fixed = [], choose = { any: 0, anyStandard: 0 };
  for (const [k, v] of Object.entries(lp)) {
    if (k === 'anyStandard' || k === 'any' || k === 'anyExotic') choose[k === 'anyStandard' ? 'anyStandard' : 'any'] += v;
    else if (k === 'other') fixed.push('Other (see traits)');
    else if (v === true) fixed.push(LANG_KEYS[k.replace(/[^a-z]/g, '')] || title(k));
  }
  const key = `${r.name}|2014`;
  if (!speciesLanguages[key]) speciesLanguages[key] = { fixed, choose: choose.any + choose.anyStandard };
}

// ── Class languages gained at level 1 (both editions) ──
const classLanguages = { Rogue: ["Thieves' Cant"], Druid: ['Druidic'] };

// ── Multiclass proficiencies ──
const ARMOR = { light: 'Light armor', medium: 'Medium armor', heavy: 'Heavy armor', shield: 'Shields' };
const WEAPONS = { simple: 'Simple weapons', martial: 'Martial weapons' };
const multiclass = {};
const saves = {}; // saving throw proficiencies from a character's first class
const EDITION_SOURCES = { '2014': ['PHB', 'TCE'], '2024': ['XPHB'] };
for (const f of fs.readdirSync(path.join(SRC, 'class')).filter(f => /^class-.*\.json$/.test(f))) {
  for (const c of J('class/' + f).class || []) {
    for (const [ed, sources] of Object.entries(EDITION_SOURCES)) {
      if (!sources.includes(c.source) || (multiclass[c.name] && multiclass[c.name][ed])) continue;
      if (!saves[c.name]) saves[c.name] = c.proficiency || [];
      const g = (c.multiclassing && c.multiclassing.proficienciesGained) || {};
      const skill = (g.skills || []).find(s => s.choose) || (g.skills || []).find(s => s.any);
      (multiclass[c.name] = multiclass[c.name] || {})[ed] = {
        armor: (g.armor || []).map(a => ARMOR[a] || title(stripTags(typeof a === 'string' ? a : a.full || ''))),
        weapons: (g.weapons || []).map(w => WEAPONS[w] || title(stripTags(typeof w === 'string' ? w : w.proficiency || ''))),
        tools: (g.tools || []).map(t => stripTags(t).replace(/^\w/, c => c.toUpperCase())),
        skillChoice: skill ? { count: (skill.choose && skill.choose.count) || skill.any || 1, from: skill.choose ? skill.choose.from.map(title) : null } : null,
      };
    }
  }
}

const js = ['// AUTO-GENERATED from 5etools data — do not edit by hand', '// Run: node data/build-proficiencies.js to regenerate', '',
  `const PROFICIENCY_DATA = ${JSON.stringify({ languages, speciesLanguages, classLanguages, multiclass, saves })};`, ''].join('\n');
fs.writeFileSync(path.join(__dirname, 'proficiency_data.js'), js, 'utf8');
console.log(JSON.stringify(languages));
console.log(Object.keys(speciesLanguages).length, 'species;', ['Elf|2014', 'Warforged|2014', 'Tiefling|2014'].map(k => k + '=' + JSON.stringify(speciesLanguages[k])).join(' '));
for (const cls of ['Paladin', 'Monk', 'Bard', 'Rogue', 'Ranger']) console.log(cls, JSON.stringify(multiclass[cls]));
