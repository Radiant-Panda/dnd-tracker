/**
 * Extracts each class's spellcasting progression (both editions) from 5etools:
 * caster type, cantrips, prepared spells (table or formula) and spells known.
 * Run: node data/build-spellcasting.js
 * Outputs: data/spellcasting_data.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = 'C:\\Users\\Kiana\\Downloads\\5etools-src-main\\data\\class';
// Which 5etools source is each edition. The app keeps Artificer on its 2014 (Tasha's) rules.
const EDITION_SOURCES = { '2014': ['PHB', 'TCE'], '2024': ['XPHB'] };
const CLASSES = ['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
const SUBCLASSES = { Fighter: ['Eldritch Knight'], Rogue: ['Arcane Trickster'] };

// "<$level$> / 2 + <$cha_mod$>" → { ability: 'cha', divisor: 2 } (5etools rounds down)
function parseFormula(f) {
  const m = f && f.match(/<\$level\$>(?:\s*\/\s*(\d+))?\s*\+\s*<\$(\w+)_mod\$>/);
  return m ? { ability: m[2], divisor: m[1] ? +m[1] : 1 } : null;
}

function progression(c) {
  const p = { caster: c.casterProgression, ability: c.spellcastingAbility };
  if (c.cantripProgression) p.cantrips = c.cantripProgression;
  if (c.preparedSpellsProgression) p.prepared = c.preparedSpellsProgression;
  else if (c.preparedSpells) p.preparedFormula = parseFormula(c.preparedSpells);
  if (c.spellsKnownProgression) p.known = c.spellsKnownProgression;
  return p;
}

const out = { classes: {}, subclasses: {} };
for (const f of fs.readdirSync(SRC_DIR).filter(f => /^class-.*\.json$/.test(f))) {
  const d = JSON.parse(fs.readFileSync(path.join(SRC_DIR, f), 'utf8'));
  for (const c of d.class || []) {
    if (!CLASSES.includes(c.name) || !c.casterProgression) continue;
    for (const [ed, sources] of Object.entries(EDITION_SOURCES)) {
      if (!sources.includes(c.source)) continue;
      (out.classes[c.name] = out.classes[c.name] || {})[ed] = progression(c);
    }
  }
  for (const s of d.subclass || []) {
    if (!(SUBCLASSES[s.className] || []).includes(s.shortName) || !s.casterProgression) continue;
    for (const [ed, sources] of Object.entries(EDITION_SOURCES)) {
      if (!sources.includes(s.source)) continue;
      const p = { caster: s.casterProgression, ability: s.spellcastingAbility || 'int' };
      if (s.cantripProgression) p.cantrips = s.cantripProgression;
      if (s.spellsKnownProgression) p.known = s.spellsKnownProgression;
      if (s.preparedSpellsProgression) p.prepared = s.preparedSpellsProgression;
      ((out.subclasses[s.className] = out.subclasses[s.className] || {})[s.shortName] = out.subclasses[s.className][s.shortName] || {})[ed] = p;
    }
  }
}

const js = [
  '// AUTO-GENERATED from 5etools data — do not edit by hand',
  '// Run: node data/build-spellcasting.js to regenerate',
  '',
  `const SPELLCASTING_DATA = ${JSON.stringify(out)};`,
  '',
].join('\n');
fs.writeFileSync(path.join(__dirname, 'spellcasting_data.js'), js, 'utf8');
for (const [cls, eds] of Object.entries(out.classes)) console.log(cls.padEnd(10), Object.entries(eds).map(([e, p]) => `${e}:${p.caster}${p.prepared ? ' prep-table' : p.preparedFormula ? ' prep-formula' : ''}${p.known ? ' known' : ''}`).join('  '));
for (const [cls, subs] of Object.entries(out.subclasses)) for (const [s, eds] of Object.entries(subs)) console.log(`${cls}/${s}`, Object.keys(eds).join(','));
