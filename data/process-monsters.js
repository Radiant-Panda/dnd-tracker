#!/usr/bin/env node
// ── Process D&D 5e Monster Data ──────────────────────────────────────────────
// Reads ../dnd-data-main/data/monsters.json and outputs a lighter monsters.json
// for the D&D Tracker app.

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', 'dnd-data-main', 'data', 'monsters.json');
const OUT = path.join(__dirname, 'monsters.json');

const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));
console.log(`Read ${raw.length} monsters from source.`);

// ── Books to include (ordered by priority / usefulness) ──────────────────────
const BOOKS = [
  'Monster Manual',
  'Free Basic Rules (2014)',
  'Free Basic Rules (2024)',
  "Mordenkainen's Tome of Foes",
  'Mordenkainen Presents - Monsters of the Multiverse',
  "Volo's Guide to Monsters",
  'Flee Mortals',
  "Fizban's Treasury of Dragons",
  "Tasha's Cauldron of Everything",
  'Bigby Presents - Glory of the Giants',
  'Tome of Beasts',
  'Tome of Beasts 2',
  'Tome of Beasts 3',
  'Creature Codex',
  'Spelljammer - Adventures in Space',
  "Explorer's Guide to Wildemount",
  'Mythic Odysseys of Theros',
  'Planescape - Adventures in the Multiverse',
  'Vecna - Eve of Ruin',
  'Quests from the Infinite Staircase',
  "Player's Handbook (2024)",
];

// Short codes for display
const BOOK_SHORT = {
  'Monster Manual':          'MM',
  'Free Basic Rules (2014)': 'BR14',
  'Free Basic Rules (2024)': 'BR24',
  "Mordenkainen's Tome of Foes": 'MTF',
  'Mordenkainen Presents - Monsters of the Multiverse': 'MPMM',
  "Volo's Guide to Monsters": 'VGM',
  'Flee Mortals':            'FM',
  "Fizban's Treasury of Dragons": 'FTD',
  "Tasha's Cauldron of Everything": 'TCE',
  'Bigby Presents - Glory of the Giants': 'BGG',
  'Tome of Beasts':          'ToB',
  'Tome of Beasts 2':        'ToB2',
  'Tome of Beasts 3':        'ToB3',
  'Creature Codex':          'CC',
  'Spelljammer - Adventures in Space': 'SJ',
  "Explorer's Guide to Wildemount": 'EGW',
  'Mythic Odysseys of Theros': 'MOT',
  'Planescape - Adventures in the Multiverse': 'PAM',
  'Vecna - Eve of Ruin':     'VER',
  'Quests from the Infinite Staircase': 'QIS',
  "Player's Handbook (2024)": 'PHB24',
};

// ── Dedup: prefer MPMM > MM > VGM > MTF > BR14 ─────────────────────────────
const DEDUP_PRIORITY = [
  'Mordenkainen Presents - Monsters of the Multiverse',
  'Monster Manual',
  "Volo's Guide to Monsters",
  "Mordenkainen's Tome of Foes",
  'Free Basic Rules (2024)',
  'Free Basic Rules (2014)',
];

// Filter to selected books
const filtered = raw.filter(m => BOOKS.includes(m.book));
console.log(`Filtered to ${filtered.length} monsters from ${BOOKS.length} books.`);

// Dedup by name (keep highest-priority version)
const byName = new Map();
for (const m of filtered) {
  const key = m.name.toLowerCase().trim();
  if (!byName.has(key)) {
    byName.set(key, m);
  } else {
    const existing = byName.get(key);
    const ePri = DEDUP_PRIORITY.indexOf(existing.book);
    const mPri = DEDUP_PRIORITY.indexOf(m.book);
    // If both are in priority list, take the higher one (lower index)
    // If only one is, keep whichever is NOT in the dedup list (it's unique to that book)
    // Actually we want to keep both if from different non-dedup books (e.g., FM + ToB could both have same name)
    // Only dedup within the priority set
    if (ePri >= 0 && mPri >= 0) {
      if (mPri < ePri) byName.set(key, m);
    } else {
      // Keep both — store as array? No, let's just keep both by using book-qualified key
      byName.set(key + '|' + m.book, m);
    }
  }
}
const deduped = [...byName.values()];
console.log(`After dedup: ${deduped.length} monsters.`);

// ── Parse CR to numeric ──────────────────────────────────────────────────────
function parseCR(cr) {
  if (cr === undefined || cr === null) return -1;
  const s = String(cr).trim();
  if (s === '1/8') return 0.125;
  if (s === '1/4') return 0.25;
  if (s === '1/2') return 0.5;
  return parseFloat(s) || 0;
}

// ── Extract structured stat block from properties (Free Basic Rules) ─────────
function extractFromProperties(m) {
  const p = m.properties || {};
  if (!p.AC && !p.STR) return null; // no structured data

  let actions = [], traits = [], legendaryActions = [], reactions = [];
  try { if (p['data-Actions']) actions = JSON.parse(p['data-Actions']); } catch {}
  try { if (p['data-Traits']) traits = JSON.parse(p['data-Traits']); } catch {}
  try { if (p['data-Legendary Actions']) legendaryActions = JSON.parse(p['data-Legendary Actions']); } catch {}
  try { if (p['data-Reactions']) reactions = JSON.parse(p['data-Reactions']); } catch {}

  return {
    ac: p['data-AcNum'] || parseInt(String(p.AC)) || 10,
    ac_note: String(p.AC || ''),
    hp: p['data-HpNum'] || parseInt(String(p.HP)) || 1,
    hp_note: String(p.HP || ''),
    speed: p.Speed || '',
    str: parseInt(p.STR) || 10,
    dex: parseInt(p.DEX) || 10,
    con: parseInt(p.CON) || 10,
    int: parseInt(p.INT) || 10,
    wis: parseInt(p.WIS) || 10,
    cha: parseInt(p.CHA) || 10,
    saving_throws: p['Saving Throws'] || '',
    skills: p.Skills || '',
    senses: p.Senses || '',
    languages: p.Languages || '',
    immunities: p.Immunities || '',
    resistances: p.Resistances || '',
    condition_immunities: p['Condition Immunities'] || '',
    vulnerabilities: p.Vulnerabilities || '',
    xp: parseInt(String(p['data-XP'] || '0').replace(/,/g, '')) || 0,
    traits: traits.map(t => ({ name: t.Name || '', desc: t.Desc || '' })),
    actions: actions.map(a => ({ name: a.Name || '', desc: a.Desc || '' })),
    reactions: reactions.map(r => ({ name: r.Name || '', desc: r.Desc || '' })),
    legendary_actions: legendaryActions.map(l => ({ name: l.Name || '', desc: l.Desc || '' })),
  };
}

// ── Parse stat block from description text ───────────────────────────────────
function extractFromDescription(desc) {
  if (!desc) return null;

  // Try to find the structured portion by looking for "Traits" or "Actions" keyword
  // These appear as section headers in the description text

  const result = {};

  // Extract traits section
  const traitsIdx = desc.search(/\bTraits\b/);
  const actionsIdx = desc.search(/\bActions\b/);
  const reactionsIdx = desc.search(/\bReactions\b/);
  const legendaryIdx = desc.search(/\bLegendary Actions\b/);

  function parseEntries(text) {
    // Entries look like: "Name : Description text. Another Name : ..."
    // Split on pattern of "Word(s) : " at the boundary of a sentence/period
    const entries = [];
    // Pattern: starts with a capitalised name, followed by colon or " : "
    const regex = /(?:^|\. )([A-Z][A-Za-z' \-()\/,0-9]*?)\s*[:\.]\s*(?=[A-Z])/g;
    // Simpler approach: split by known patterns
    const parts = text.split(/\s*(?<=\.)\s+(?=[A-Z][a-z])/);
    // Actually, the simplest approach is to just keep the raw text
    return text;
  }

  // For non-structured monsters, we'll store the description sections as raw text
  // and let the UI display them
  const sections = {};

  if (traitsIdx >= 0) {
    const endIdx = actionsIdx >= 0 ? actionsIdx : desc.length;
    sections.traits = desc.substring(traitsIdx + 6, endIdx).trim();
  }
  if (actionsIdx >= 0) {
    const endIdx = reactionsIdx >= 0 ? reactionsIdx :
                   legendaryIdx >= 0 ? legendaryIdx : desc.length;
    sections.actions = desc.substring(actionsIdx + 7, endIdx).trim();
  }
  if (reactionsIdx >= 0) {
    const endIdx = legendaryIdx >= 0 ? legendaryIdx : desc.length;
    sections.reactions = desc.substring(reactionsIdx + 9, endIdx).trim();
  }
  if (legendaryIdx >= 0) {
    sections.legendary = desc.substring(legendaryIdx + 17).trim();
  }

  // Get the lore (everything before traits/actions)
  const firstSection = Math.min(
    traitsIdx >= 0 ? traitsIdx : Infinity,
    actionsIdx >= 0 ? actionsIdx : Infinity
  );
  if (firstSection < Infinity && firstSection > 50) {
    sections.lore = desc.substring(0, firstSection).trim();
  }

  return sections;
}

// ── Build output ─────────────────────────────────────────────────────────────
const output = deduped.map(m => {
  const p = m.properties || {};
  const cr = p['Challenge Rating'];
  const structured = extractFromProperties(m);
  const descSections = !structured ? extractFromDescription(m.description) : null;

  const entry = {
    name: m.name,
    size: p.Size || '',
    type: p.Type || '',
    alignment: p.Alignment || '',
    cr: cr !== undefined ? String(cr) : '?',
    cr_num: parseCR(cr),
    book: m.book,
    book_short: BOOK_SHORT[m.book] || m.book.substring(0, 4),
  };

  if (structured) {
    Object.assign(entry, structured);
  } else {
    // Store the description sections for rendering
    entry.desc_sections = descSections;
    entry.description = m.description || '';
  }

  return entry;
}).sort((a, b) => a.name.localeCompare(b.name));

console.log(`Output: ${output.length} monsters.`);

// Stats
const byBook = {};
output.forEach(m => { byBook[m.book_short] = (byBook[m.book_short] || 0) + 1; });
console.log('By book:', byBook);
const withStructured = output.filter(m => m.str !== undefined).length;
console.log(`With structured stat blocks: ${withStructured}`);
console.log(`With description only: ${output.length - withStructured}`);

// ── Split into index (for search) and full data ─────────────────────────────
// Index: lightweight array for fast search/filter
const index = output.map((m, i) => ({
  i,
  name: m.name,
  size: m.size,
  type: m.type,
  cr: m.cr,
  cr_num: m.cr_num,
  book: m.book_short,
}));

// Full data: everything, keyed by index position
// Drop the heavy raw description — keep only parsed sections
const full = output.map(m => {
  const entry = { ...m };
  // Drop raw description to save space — sections have the useful parts
  delete entry.description;
  // Drop lore from sections to save more space
  if (entry.desc_sections?.lore) delete entry.desc_sections.lore;
  return entry;
});

const INDEX_OUT = path.join(__dirname, 'monsters-index.json');
fs.writeFileSync(INDEX_OUT, JSON.stringify(index));
const indexSize = (fs.statSync(INDEX_OUT).size / 1024).toFixed(0);
console.log(`Index written to ${INDEX_OUT} (${indexSize} KB)`);

fs.writeFileSync(OUT, JSON.stringify(full));
const fullSize = (fs.statSync(OUT).size / 1024 / 1024).toFixed(1);
console.log(`Full data written to ${OUT} (${fullSize} MB)`);
