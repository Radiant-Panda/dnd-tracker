/**
 * Rewrites descriptions in the hand-maintained data files as structured rules text
 * (see rules-text-build.js), matching each entry to its 5etools source. Entries that
 * can't be matched keep their current text.
 * Run: node data/update-rules-text.js [--dry]
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { entriesToRulesText } = require('./rules-text-build');

const SRC = 'C:\\Users\\Kiana\\Downloads\\5etools-src-main\\data';
const J = f => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const dry = process.argv.includes('--dry');

function loadData(file, name) {
  const src = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const i = src.indexOf('const ' + name);
  const data = new Function(src + ';return ' + name)();
  assert.deepStrictEqual(JSON.parse(JSON.stringify(data)), data, file + ' holds non-JSON values');
  return { data, save: () => dry || fs.writeFileSync(path.join(__dirname, file), src.slice(0, i) + 'const ' + name + ' = ' + JSON.stringify(data, null, 2) + ';\n', 'utf8') };
}

// App source labels → 5etools source codes
const SOURCE_CODES = {
  'PHB 2024': 'XPHB', 'PHB 2014': 'PHB', "Xanathar's Guide": 'XGE', "Tasha's Cauldron": 'TCE',
  'Sword Coast Guide': 'SCAG', "Explorer's Guide to Wildemount": 'EGW', "Fizban's Dragons": 'FTD',
  "Van Richten's Guide": 'VRGR', "Bigby's Giants": 'BGG', 'DMG': 'DMG', 'PSA': 'PSA', 'PSK': 'PSK',
  'Heroes of the Frontier': 'FRHoF', 'EFA': 'EFA', 'Dragonlance': 'DSotDQ', "Mordenkainen's Multiverse": 'MPMM',
};

const report = {};
const count = (k, hit) => { report[k] = report[k] || { updated: 0, unmatched: 0 }; report[k][hit ? 'updated' : 'unmatched']++; };

// ── Subclass features ──
{
  const { data, save } = loadData('subclasses.js', 'SUBCLASS_DATA');
  const scFeatures = [], subclasses = [];
  for (const f of fs.readdirSync(path.join(SRC, 'class')).filter(f => /^class-.*\.json$/.test(f))) {
    const d = J('class/' + f);
    subclasses.push(...(d.subclass || []));
    scFeatures.push(...(d.subclassFeature || []));
  }
  for (const [cls, subs] of Object.entries(data)) {
    for (const sub of Object.values(subs)) {
      const code = SOURCE_CODES[sub.source];
      const sc = subclasses.find(s => s.className === cls && s.source === code && norm(sub.name).includes(norm(s.shortName)));
      for (const feat of sub.features || []) {
        const src = sc && scFeatures.find(x => x.className === cls && x.subclassShortName === sc.shortName &&
          x.subclassSource === sc.source && x.name === feat.name && x.level === feat.level);
        count('subclass features', !!src);
        // Other subclass features are listed on their own, so references to them are dropped
        if (src) feat.description = entriesToRulesText(src.entries || [], { resolveRef: () => null });
      }
    }
  }
  save();
}

// ── Feats ──
{
  const { data, save } = loadData('feats_items.js', 'FEATS_ITEMS_DATA');
  const feats = J('feats.json').feat;
  for (const feat of data.feats) {
    const src = feats.find(x => x.name === feat.name && x.source === feat.source_key) || feats.find(x => norm(x.name) === norm(feat.name) && x.source === feat.source_key);
    count('feats', !!src);
    if (src) feat.desc = entriesToRulesText(src.entries || []);
  }
  save();
}

// ── Species traits ──
{
  const { data, save } = loadData('species_backgrounds.js', 'SPECIES_DATA');
  const races = J('races.json').race;
  for (const [group, code] of [['species_2024', 'XPHB'], ['races_2014', 'PHB'], ['races_mpmm', 'MPMM']]) {
    for (const sp of data[group] || []) {
      const src = races.find(r => r.name === sp.name && r.source === code);
      const named = {};
      (function collect(entries) {
        for (const e of entries || []) {
          if (e && typeof e === 'object') {
            if (e.name && e.entries) named[norm(e.name)] = named[norm(e.name)] || e;
            if (e.entries && !e.name) collect(e.entries);
          }
        }
      })(src && src.entries);
      for (const t of sp.traits || []) {
        const e = named[norm(t.name)];
        count('species traits', !!e);
        if (e) t.desc = entriesToRulesText(e.entries);
      }
    }
  }
  save();
}

for (const [k, v] of Object.entries(report)) console.log(`${k}: ${v.updated} updated, ${v.unmatched} kept as-is`);
if (dry) console.log('(dry run — nothing written)');
