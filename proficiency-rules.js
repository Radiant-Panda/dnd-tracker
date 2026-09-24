// ── Proficiency & Language Rules ─────────────────────────────────────────────
// Pure logic (no DOM): language lists, species/class languages, saving throws,
// multiclass proficiencies, Jack of All Trades, and sorting proficiency strings.
// Data comes from data/proficiency_data.js (generated from 5etools).

function _pfEdition(ch) { return (ch && ch.edition) === '2014' ? '2014' : '2024'; }
function _pfClasses(ch) {
  if (ch.classes && ch.classes.length) return ch.classes;
  return [{ class: ch.class, level: parseInt(ch.level) || 1 }];
}

const _PF_GROUP_LABELS = { standard: 'Standard', exotic: 'Exotic', secret: 'Secret', rare: 'Rare' };
function languageGroups(ch) {
  const groups = PROFICIENCY_DATA.languages[_pfEdition(ch)] || {};
  return Object.entries(groups).map(([k, languages]) => ({ label: _PF_GROUP_LABELS[k] || k, languages }));
}

// Languages a species grants. 2024 species grant none (every 2024 character picks Common + 2).
function speciesLanguages(name, edition) {
  const d = edition === '2014' && PROFICIENCY_DATA.speciesLanguages[`${name}|2014`];
  return d ? { fixed: [...d.fixed], choose: d.choose } : { fixed: [], choose: 0 };
}

function classLanguages(ch) {
  return [...new Set(_pfClasses(ch).flatMap(c => PROFICIENCY_DATA.classLanguages[c.class] || []))];
}

// Multiclassing never adds saving throws: only the first class grants them
function grantedSaves(ch) {
  const first = _pfClasses(ch)[0];
  return first ? [...(PROFICIENCY_DATA.saves[first.class] || [])] : [];
}

function multiclassProficiencies(cls, edition) {
  const byEd = PROFICIENCY_DATA.multiclass[cls] || {};
  const d = byEd[edition] || byEd['2014'];
  return d ? { armor: [...d.armor], weapons: [...d.weapons], tools: [...d.tools], skillChoice: d.skillChoice }
    : { armor: [], weapons: [], tools: [], skillChoice: null };
}

// Bard 2+: half proficiency bonus (rounded down) on skill checks you aren't proficient in
function jackOfAllTrades(ch, pb) {
  const bard = _pfClasses(ch).find(c => c.class === 'Bard');
  return bard && (parseInt(bard.level) || 1) >= 2 ? Math.floor(pb / 2) : 0;
}

const _PF_ARMOR = /\barmou?r\b|\bshields?\b/i;
const _PF_WEAPON = /weapon|sword|\bbows?\b|crossbow|dagger|club|staff|sling|dart|javelin|mace|spear|\baxes?\b|hammer|scimitar|rapier|whip|trident|pike|glaive|halberd|lance|flail|morningstar|\bnets?\b|sickle|firearm/i;
const _PF_TOOL = /tool|\bkit\b|supplies|instrument|\bset\b|utensils|vehicles|bagpipes|drum|dulcimer|flute|lute|lyre|horn|shawm|viol/i;
function proficiencyCategory(item) {
  if (_PF_ARMOR.test(item)) return 'armor';
  if (_PF_WEAPON.test(item)) return 'weapons';
  if (_PF_TOOL.test(item)) return 'tools';
  return 'other';
}

function splitProficiencies(str) {
  const seen = new Set(), out = [];
  String(str || '').split(',').map(s => s.trim()).filter(Boolean).forEach(p => {
    const k = p.toLowerCase();
    if (!seen.has(k)) { seen.add(k); out.push(p); }
  });
  return out;
}
function joinProficiencies(list) { return list.join(', '); }

if (typeof module !== 'undefined') {
  module.exports = { languageGroups, speciesLanguages, classLanguages, grantedSaves, multiclassProficiencies,
    jackOfAllTrades, proficiencyCategory, splitProficiencies, joinProficiencies };
}
