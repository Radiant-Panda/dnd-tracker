/**
 * Extracts CLASS_FEATURES from 5etools class JSON files.
 * Run: node data/build-class-features.js
 * Outputs: data/class-features-generated.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = 'C:\\Users\\Kiana\\Downloads\\5etools-src-main\\data\\class';

const CLASS_FILES = {
  Artificer:  'class-artificer.json',
  Barbarian:  'class-barbarian.json',
  Bard:       'class-bard.json',
  Cleric:     'class-cleric.json',
  Druid:      'class-druid.json',
  Fighter:    'class-fighter.json',
  Monk:       'class-monk.json',
  Paladin:    'class-paladin.json',
  Ranger:     'class-ranger.json',
  Rogue:      'class-rogue.json',
  Sorcerer:   'class-sorcerer.json',
  Warlock:    'class-warlock.json',
  Wizard:     'class-wizard.json',
};

// Sources to use per class (first match wins)
const CLASS_SOURCES = {
  Artificer: ['TCE', 'ERLW'],
  default:   ['PHB'],
};

// 2024 edition source codes
const SOURCES_2024 = ['XPHB'];

function stripTags(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\{@filter ([^|]+)\|[^}]+\}/g, '$1')
    .replace(/\{@creature ([^|{}]+)\|[^|{}]*\|([^|}]+)\}/g, '$2')
    .replace(/\{@creature ([^|{}]+)\|[^}]*\}/g, '$1')
    .replace(/\{@creature ([^}]+)\}/g, '$1')
    // {@dice roll|display} and {@tag name|source|display}: show the display text
    .replace(/\{@(?:dice|damage) [^|{}]+\|([^|{}]+)\}/g, '$1')
    .replace(/\{@(?!classFeature|subclassFeature|book|adventure|filter)\w+ [^|{}]+\|[^|{}]*\|([^|{}]+)\}/g, '$1')
    .replace(/\{@spell ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@item ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@class ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@skill ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@sense ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@condition ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@status ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@action ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@variantrule ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@optfeature ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@table ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@feat ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@background ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@race ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@subclassFeature ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@classFeature ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@dice ([^}]+)\}/g, '$1')
    .replace(/\{@damage ([^}]+)\}/g, '$1')
    .replace(/\{@hit ([^}]+)\}/g, '+$1')
    .replace(/\{@d20 ([^}]+)\}/g, '$1')
    .replace(/\{@b ([^}]+)\}/g, '$1')
    .replace(/\{@bold ([^}]+)\}/g, '$1')
    .replace(/\{@i ([^}]+)\}/g, '$1')
    .replace(/\{@italic ([^}]+)\}/g, '$1')
    .replace(/\{@u ([^}]+)\}/g, '$1')
    .replace(/\{@s ([^}]+)\}/g, '$1')
    .replace(/\{@note ([^}]+)\}/g, '$1')
    .replace(/\{@atk [^}]+\}/g, '')
    .replace(/\{@h\}/g, 'Hit: ')
    .replace(/\{@recharge([^}]*)\}/g, '')
    .replace(/\{@5etools [^}]+\}/g, 'a feat')
    .replace(/\{@[a-z]+ ([^|{}]+)\|?[^}]*\}/g, '$1')
    .replace(/\{@[a-zA-Z]+[^}]*\}/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function flattenEntries(entries, depth = 0) {
  if (!Array.isArray(entries)) return '';
  const parts = [];
  for (const entry of entries) {
    if (typeof entry === 'string') {
      const s = stripTags(entry);
      if (s) parts.push(s);
    } else if (entry && typeof entry === 'object') {
      switch (entry.type) {
        case 'entries':
        case 'section': {
          const sub = [];
          if (entry.name) sub.push(entry.name + ':');
          if (entry.entries) sub.push(flattenEntries(entry.entries, depth + 1));
          const joined = sub.filter(Boolean).join(' ');
          if (joined) parts.push(joined);
          break;
        }
        case 'list': {
          const items = (entry.items || []).map(item => {
            if (typeof item === 'string') return '• ' + stripTags(item);
            if (item && item.type === 'item') {
              const name = item.name ? item.name + ': ' : '• ';
              const body = item.entries ? flattenEntries(item.entries, depth + 1) : '';
              return name + body;
            }
            return '• ' + flattenEntries([item], depth + 1);
          }).filter(Boolean);
          if (items.length) parts.push(items.join(' '));
          break;
        }
        case 'table': {
          if (entry.caption) parts.push('[Table: ' + entry.caption + ']');
          break;
        }
        case 'inset':
        case 'insetReadaloud': {
          if (entry.entries) parts.push(flattenEntries(entry.entries, depth + 1));
          break;
        }
        case 'quote': {
          if (entry.entries) parts.push(flattenEntries(entry.entries, depth + 1));
          break;
        }
        default: {
          if (entry.entries) parts.push(flattenEntries(entry.entries, depth + 1));
          break;
        }
      }
    }
  }
  return parts.join(' ');
}

function extractFeatures(classFile, sources, skipVariants = true) {
  const { entriesToRulesText } = require('./rules-text-build');
  const raw = JSON.parse(fs.readFileSync(path.join(SRC_DIR, classFile), 'utf8'));
  const features = raw.classFeature || [];
  // Features another feature offers (Divine Spark inside Channel Divinity) are shown inside it
  const inlined = new Set();
  const resolveRef = e => {
    if (e.type !== 'refClassFeature') return null; // class options have their own picker
    const [name, cls, source, level] = e.classFeature.split('|');
    const f = features.find(x => x.name === name && x.className === cls && x.source === (source || 'PHB') && String(x.level) === level);
    if (f) inlined.add(f);
    return f || null;
  };
  return features
    .filter(f => {
      if (skipVariants && f.isClassFeatureVariant) return false;
      if (skipVariants && f.isOptional) return false;
      return sources.includes(f.source);
    })
    .map(f => ({ f, level: f.level, name: f.name, desc: entriesToRulesText(f.entries || [], { resolveRef }) }))
    .filter(x => !inlined.has(x.f))
    .map(({ level, name, desc }) => ({ level, name, desc }))
    .sort((a, b) => a.level - b.level);
}

function jsStringEscape(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

module.exports = { stripTags, flattenEntries };
if (require.main !== module) return; // imported as a library by other build scripts

// Build output
const lines = ['// AUTO-GENERATED from 5etools data — do not edit by hand', '// Run: node data/build-class-features.js to regenerate', ''];

const results2014 = {};
const results2024 = {};

for (const [className, file] of Object.entries(CLASS_FILES)) {
  const sources = CLASS_SOURCES[className] || CLASS_SOURCES.default;
  const features2014 = extractFeatures(file, sources);
  const features2024 = extractFeatures(file, SOURCES_2024);
  results2014[className] = features2014;
  if (features2024.length) results2024[className] = features2024;
  console.log(`${className}: ${features2014.length} PHB features, ${features2024.length} XPHB features`);
}

function buildConst(name, data) {
  const classEntries = Object.entries(data).map(([cls, feats]) => {
    const rows = feats.map(f =>
      `    [${f.level}, '${jsStringEscape(f.name)}', '${jsStringEscape(f.desc)}'],`
    ).join('\n');
    return `  ${cls}: [\n${rows}\n  ]`;
  });
  return `const ${name} = {\n${classEntries.join(',\n')},\n};`;
}

const output = [
  lines.join('\n'),
  buildConst('CLASS_FEATURES', results2014),
  '',
  buildConst('CLASS_FEATURES_2024', results2024),
  '',
].join('\n');

const outPath = path.join(__dirname, 'class-features-generated.js');
fs.writeFileSync(outPath, output, 'utf8');
console.log(`\nWritten to ${outPath}`);
