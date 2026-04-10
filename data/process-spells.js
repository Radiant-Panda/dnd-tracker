#!/usr/bin/env node
// Processes ../dnd-data-main/data/spells.json into data/spells.json
// for use by the D&D Tracker app.

const fs   = require('fs');
const path = require('path');

// ── Allowed source books ──────────────────────────────────────────────────────
const ALLOWED_BOOKS = new Set([
  "Player's Handbook (2024)",
  "Player's Handbook",
  "Free Basic Rules (2024)",
  "Free Basic Rules (2014)",
  "Xanathar's Guide to Everything",
  "Tasha's Cauldron of Everything",
  "Explorer's Guide to Wildemount",
  "Sword Coast Adventurer's Guide",
]);

// Books we prefer when deduplicating by name (earlier index = higher priority)
const BOOK_PRIORITY = [
  "Player's Handbook (2024)",
  "Player's Handbook",
  "Free Basic Rules (2024)",
  "Free Basic Rules (2014)",
  "Tasha's Cauldron of Everything",
  "Xanathar's Guide to Everything",
  "Sword Coast Adventurer's Guide",
  "Explorer's Guide to Wildemount",
];

function bookPriority(book) {
  const idx = BOOK_PRIORITY.indexOf(book);
  return idx === -1 ? 999 : idx;
}

// ── Fallback class list for spells whose source doesn't embed class info ──────
// Built from official 5e sourcebook data (XGE, TCE, EGW, Free Basic Rules).
const CLASS_FALLBACK = {
  // Tasha's Cauldron of Everything cantrips
  "Booming Blade":          "Artificer, Sorcerer, Warlock, Wizard",
  "Green-Flame Blade":      "Artificer, Sorcerer, Warlock, Wizard",
  "Lightning Lure":         "Artificer, Sorcerer, Warlock, Wizard",
  "Mind Sliver":            "Sorcerer, Warlock, Wizard",
  "Sword Burst":            "Artificer, Sorcerer, Warlock, Wizard",
  // Tasha's spells
  "Tasha's Caustic Brew":   "Artificer, Sorcerer, Wizard",
  "Tasha's Mind Whip":      "Sorcerer, Wizard",
  "Tasha's Otherworldly Guise": "Sorcerer, Warlock, Wizard",
  "Intellect Fortress":     "Artificer, Bard, Sorcerer, Warlock, Wizard",
  "Spirit Shroud":          "Cleric, Paladin, Warlock, Wizard",
  "Summon Aberration":      "Warlock, Wizard",
  "Summon Beast":           "Druid, Ranger",
  "Summon Celestial":       "Cleric, Paladin",
  "Summon Construct":       "Artificer, Wizard",
  "Summon Elemental":       "Druid, Ranger, Wizard",
  "Summon Fey":             "Druid, Ranger, Warlock, Wizard",
  "Summon Fiend":           "Warlock, Wizard",
  "Summon Shadowspawn":     "Warlock, Wizard",
  "Summon Undead":          "Warlock, Wizard",
  "Wildfire Spirit":        "Druid",
  // Xanathar's Guide cantrips
  "Control Flames":         "Druid, Sorcerer, Wizard",
  "Create Bonfire":         "Artificer, Druid, Sorcerer, Warlock, Wizard",
  "Frostbite":              "Artificer, Druid, Sorcerer, Warlock, Wizard",
  "Gust":                   "Druid, Sorcerer, Wizard",
  "Infestation":            "Druid, Sorcerer, Warlock, Wizard",
  "Magic Stone":            "Artificer, Druid, Warlock",
  "Mold Earth":             "Druid, Sorcerer, Wizard",
  "Primal Savagery":        "Druid",
  "Shape Water":            "Druid, Sorcerer, Wizard",
  "Thunderclap":            "Artificer, Bard, Druid, Sorcerer, Warlock, Wizard",
  "Toll the Dead":          "Cleric, Warlock, Wizard",
  "Word of Radiance":       "Cleric",
  // Xanathar's 1st level
  "Absorb Elements":        "Artificer, Druid, Ranger, Sorcerer, Wizard",
  "Beast Bond":             "Druid, Ranger",
  "Catapult":               "Artificer, Sorcerer, Wizard",
  "Cause Fear":             "Warlock, Wizard",
  "Ceremony":               "Cleric, Paladin",
  "Chaos Bolt":             "Sorcerer",
  "Earth Tremor":           "Bard, Druid, Sorcerer, Wizard",
  "Ice Knife":              "Druid, Sorcerer, Wizard",
  "Illusory Script":        "Bard, Warlock, Wizard",
  "Snare":                  "Artificer, Druid, Ranger, Wizard",
  "Sudden Awakening":       "Bard, Ranger, Sorcerer, Wizard",
  "Wild Cunning":           "Druid, Ranger",
  "Zephyr Strike":          "Ranger",
  // Xanathar's 2nd level
  "Aganazzar's Scorcher":   "Sorcerer, Wizard",
  "Dragon's Breath":        "Sorcerer, Wizard",
  "Dust Devil":             "Druid, Sorcerer, Wizard",
  "Earthbind":              "Druid, Sorcerer, Warlock, Wizard",
  "Enemy Afield":           "Druid, Ranger",
  "Healing Spirit":         "Druid, Ranger",
  "Maximilian's Earthen Grasp": "Sorcerer, Wizard",
  "Mental Barrier":         "Sorcerer, Warlock, Wizard",
  "Mind Spike":             "Sorcerer, Warlock, Wizard",
  "Pyrotechnics":           "Artificer, Bard, Sorcerer, Wizard",
  "Shadow Blade":           "Sorcerer, Warlock, Wizard",
  "Skywrite":               "Artificer, Bard, Druid, Wizard",
  "Snilloc's Snowball Swarm": "Sorcerer, Wizard",
  "Thought Shield":         "Sorcerer, Warlock, Wizard",
  "Warding Wind":           "Druid, Sorcerer, Wizard",
  // Xanathar's 3rd level
  "Catnap":                 "Artificer, Bard, Sorcerer, Wizard",
  "Erupting Earth":         "Druid, Sorcerer, Wizard",
  "Flame Arrows":           "Artificer, Druid, Ranger, Sorcerer, Wizard",
  "Glyph of Warding":       "Artificer, Bard, Cleric, Wizard",
  "Hunger of Hadar":        "Warlock",
  "Life Transference":      "Cleric, Wizard",
  "Melf's Minute Meteors":  "Sorcerer, Wizard",
  "Motivational Speech":    "Bard, Cleric",
  "Pulsing Star":           "Druid",
  "Sleet Storm":            "Druid, Sorcerer, Wizard",
  "Spirit Shroud":          "Cleric, Paladin, Warlock, Wizard",
  "Summon Lesser Demons":   "Warlock, Wizard",
  "Thunder Step":           "Sorcerer, Warlock, Wizard",
  "Tidal Wave":             "Druid, Sorcerer, Wizard",
  "Tiny Servant":           "Artificer, Wizard",
  "Wall of Sand":           "Wizard",
  "Wall of Water":          "Druid, Sorcerer, Wizard",
  // Xanathar's 4th level
  "Charm Monster":          "Bard, Druid, Sorcerer, Warlock, Wizard",
  "Elemental Bane":         "Artificer, Druid, Warlock, Wizard",
  "Guardian of Nature":     "Druid, Ranger",
  "Raulothim's Psychic Lance": "Bard, Sorcerer, Warlock, Wizard",
  "Shadow of Moil":         "Warlock",
  "Sickening Radiance":     "Sorcerer, Warlock, Wizard",
  "Storm Sphere":           "Sorcerer, Wizard",
  "Vitriolic Sphere":       "Sorcerer, Wizard",
  "Watery Sphere":          "Druid, Sorcerer, Wizard",
  // Xanathar's 5th level
  "Control Winds":          "Druid, Sorcerer, Wizard",
  "Danse Macabre":          "Warlock, Wizard",
  "Dawn":                   "Cleric, Wizard",
  "Enervation":             "Sorcerer, Warlock, Wizard",
  "Far Step":               "Sorcerer, Warlock, Wizard",
  "Holy Weapon":            "Cleric, Paladin",
  "Immolation":             "Sorcerer, Wizard",
  "Infernal Calling":       "Warlock, Wizard",
  "Maelstrom":              "Druid",
  "Negative Energy Flood":  "Warlock, Wizard",
  "Skill Empowerment":      "Artificer, Bard, Druid, Sorcerer, Wizard",
  "Steel Wind Strike":      "Fighter, Ranger, Wizard",
  "Synaptic Static":        "Bard, Sorcerer, Warlock, Wizard",
  "Transmute Rock":         "Druid, Wizard",
  "Wall of Light":          "Sorcerer, Warlock, Wizard",
  // Xanathar's 6th+
  "Bones of the Earth":     "Druid",
  "Druid Grove":            "Druid",
  "Fizban's Platinum Shield": "Sorcerer, Wizard",
  "Flesh to Stone":         "Wizard",
  "Investiture of Flame":   "Druid, Sorcerer, Warlock, Wizard",
  "Investiture of Ice":     "Druid, Sorcerer, Warlock, Wizard",
  "Investiture of Stone":   "Druid, Sorcerer, Warlock, Wizard",
  "Investiture of Wind":    "Druid, Sorcerer, Warlock, Wizard",
  "Scatter":                "Sorcerer, Warlock, Wizard",
  "Soul Cage":              "Warlock, Wizard",
  "Tenser's Transformation": "Fighter, Wizard",
  "Crown of Stars":         "Sorcerer, Warlock, Wizard",
  "Power Word Pain":        "Sorcerer, Warlock, Wizard",
  "Maddening Darkness":     "Warlock, Wizard",
  "Meteor Swarm":           "Sorcerer, Wizard",
  // Explorer's Guide to Wildemount
  "Sapping Sting":          "Wizard",
  "Gift of Alacrity":       "Wizard",
  "Magnify Gravity":        "Wizard",
  "Fortune's Favor":        "Wizard",
  "Immovable Object":       "Artificer, Wizard",
  "Wristpocket":            "Wizard",
  "Dark Star":              "Wizard",
  "Reality Break":          "Wizard",
  "Ravenous Void":          "Wizard",
  "Time Ravage":            "Wizard",
  "Drain Vitality":         "Wizard",
  "Pulse Wave":             "Wizard",
  "Gravity Fissure":        "Wizard",
  "Temporal Shunt":         "Fighter, Wizard",
  "Gravity Sinkhole":       "Wizard",
  // Free Basic Rules / PHB spells missing class info
  "Floating Disk":          "Wizard",
  "Hideous Laughter":       "Bard, Wizard",
  "Acid Arrow":             "Wizard",
  "Arcanist's Magic Aura":  "Wizard",
  "Tiny Hut":               "Bard, Wizard",
  "Drawmij's Instant Summons": "Wizard",
  "Arcane Gate":            "Sorcerer, Warlock, Wizard",
  "Arcane Sword":           "Bard, Wizard",
  "Forcecage":              "Bard, Warlock, Wizard",
  "Symbol":                 "Bard, Cleric, Druid, Wizard",
  "Gate":                   "Cleric, Sorcerer, Wizard",
  "Mordenkainen's Sword":   "Bard, Wizard",
  "Power Word Kill":        "Sorcerer, Warlock, Wizard",
  "Power Word Stun":        "Bard, Sorcerer, Warlock, Wizard",
  "Weird":                  "Wizard",
  "True Polymorph":         "Bard, Warlock, Wizard",
  "Wish":                   "Sorcerer, Wizard",
  // PHB (2014) stragglers
  "Branding Smite":         "Paladin",
  "Feeblemind":             "Bard, Druid, Warlock, Wizard",
  // Remaining XGE
  "Maximillian's Earthen Grasp": "Sorcerer, Wizard",
  "Enemies Abound":         "Bard, Sorcerer, Warlock, Wizard",
  "Find Greater Steed":     "Paladin",
  "Summon Greater Demon":   "Warlock, Wizard",
  "Wrath of Nature":        "Druid, Ranger",
  "Create Homunculus":      "Wizard",
  "Mental Prison":          "Sorcerer, Warlock, Wizard",
  "Primordial Ward":        "Druid",
  "Temple of the Gods":     "Cleric",
  "Whirlwind":              "Druid, Sorcerer, Wizard",
  "Abi-Dalzim\u2019s Horrid Wilting": "Sorcerer, Warlock, Wizard",
  "Abi-Dalzim's Horrid Wilting": "Sorcerer, Warlock, Wizard",
  "Illusory Dragon":        "Wizard",
  "Mighty Fortress":        "Wizard",
  "Invulnerability":        "Wizard",
  "Mass Polymorph":         "Bard, Sorcerer, Wizard",
  "Psychic Scream":         "Bard, Sorcerer, Warlock, Wizard",
  // Remaining Free Basic Rules
  "Black Tentacles":        "Wizard",
  "Faithful Hound":         "Artificer, Wizard",
  "Private Sanctum":        "Artificer, Wizard",
  "Resilient Sphere":       "Artificer, Wizard",
  "Secret Chest":           "Artificer, Wizard",
  "Arcane Hand":            "Artificer, Wizard",
  "Telepathic Bond":        "Bard, Wizard",
  "Freezing Sphere":        "Wizard",
  "Instant Summons":        "Wizard",
  "Irresistible Dance":     "Bard, Wizard",
  "Magnificent Mansion":    "Bard, Wizard",
  // Remaining TCE
  "Dream of the Blue Veil": "Bard, Sorcerer, Warlock, Wizard",
  "Blade of Disaster":      "Sorcerer, Warlock, Wizard",
  // EGW
  "Tether Essence":         "Wizard",
};

// ── Parsers ───────────────────────────────────────────────────────────────────

// Extract range from description text or properties
function parseRange(spell) {
  if (spell.properties?.['data-RangeAoe']) return spell.properties['data-RangeAoe'];
  // Try to extract from description: "Range: 60 feet" or "Range: Touch" etc.
  const m = spell.description?.match(/Range:\s*([^\n\r.]+?)(?:\s+Components|$)/i);
  return m ? m[1].trim() : '';
}

// Extract duration from description
function parseDuration(desc) {
  if (!desc) return '';
  const m = desc.match(/Duration:\s*([^\n\r]+?)(?:\s+(?:You |The |Choose|A |An |This |Cast|When)|$)/i);
  return m ? m[1].trim() : '';
}

// Extract class list from PHB 2024 format "Abjuration Cantrip (Cleric, Wizard)"
// or from older format that may have a dnd_class-style field
function parseClasses(spell) {
  const desc = spell.description || '';

  // 2024 PHB style: "Level N School (Class, Class, Class) Casting Time:"
  const newFmt = desc.match(/\(([^)]+)\)\s+Casting Time:/i);
  if (newFmt) {
    return newFmt[1].split(',').map(s => s.trim()).filter(Boolean).join(', ');
  }

  // Older/alternative: look for a parenthesised list near the top before "Casting Time"
  // e.g. "Conjuration Cantrip (Artificer, Bard) Casting Time: 1 action"
  const oldFmt = desc.match(/^[^\(]*\(([^)]+)\)/);
  if (oldFmt) {
    const candidates = oldFmt[1].split(',').map(s => s.trim());
    const knownClasses = new Set(['artificer','bard','cleric','druid','fighter','monk','paladin','ranger','rogue','sorcerer','warlock','wizard','blood hunter','barbarian']);
    if (candidates.every(c => knownClasses.has(c.toLowerCase()))) {
      return candidates.join(', ');
    }
  }

  // Static fallback
  return CLASS_FALLBACK[spell.name] || '';
}

// Detect concentration: description mentions "Concentration, up to" or "Concentration up to"
function parseConcentration(desc) {
  if (!desc) return 'no';
  return /concentration,?\s+up to/i.test(desc) ? 'yes' : 'no';
}

// Detect ritual tag in description or components
function parseRitual(desc) {
  if (!desc) return 'no';
  return /\b(R|ritual)\b/i.test(desc) && /ritual/i.test(desc) ? 'yes' : 'no';
}

// Extract casting time from description or properties
function parseCastingTime(spell) {
  if (spell.properties?.['Casting Time']) return spell.properties['Casting Time'];
  const m = spell.description?.match(/Casting Time:\s*([^\n\r]+?)(?:\s+Range:|$)/i);
  return m ? m[1].trim() : '';
}

// Extract components string
function parseComponents(spell) {
  if (spell.properties?.Components) return spell.properties.Components;
  const m = spell.description?.match(/Components:\s*([^\n\r]+?)(?:\s+Duration:|$)/i);
  return m ? m[1].trim() : '';
}

// Normalise school name to title case
function parseSchool(spell) {
  const s = spell.properties?.School || spell.properties?.school || '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// Extract the spell description body (everything after the header block)
function parseDesc(desc) {
  if (!desc) return '';
  // Strip the header portion (level/school/class/casting/range/components/duration lines)
  // which always precedes the body text. A reliable split point: after "Duration: …"
  const durIdx = desc.search(/Duration:\s*[^\n]+/i);
  if (durIdx !== -1) {
    const afterDur = desc.slice(durIdx).replace(/^Duration:\s*[^\n]+\n?/i, '').trim();
    if (afterDur.length > 20) return afterDur;
  }
  return desc.trim();
}

// ── Main ──────────────────────────────────────────────────────────────────────

const srcPath = path.resolve(__dirname, '../../dnd-data-main/data/spells.json');
const outPath = path.resolve(__dirname, 'spells.json');

if (!fs.existsSync(srcPath)) {
  console.error(`Source not found: ${srcPath}`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
console.log(`Total spells in source: ${raw.length}`);

// Filter to allowed books
const filtered = raw.filter(s => ALLOWED_BOOKS.has(s.book));
console.log(`After book filter: ${filtered.length}`);

// Deduplicate by name, preferring 2024 PHB
const byName = new Map();
for (const spell of filtered) {
  const existing = byName.get(spell.name);
  if (!existing || bookPriority(spell.book) < bookPriority(existing.book)) {
    byName.set(spell.name, spell);
  }
}
console.log(`After deduplication: ${byName.size}`);

// Transform to app format
const output = Array.from(byName.values()).map(spell => {
  const desc = spell.description || '';
  const level = spell.properties?.Level ?? 0;
  return {
    name:         spell.name,
    level_int:    level,
    level:        level === 0 ? 'Cantrip' : `${level}${['st','nd','rd','th','th','th','th','th','th'][level-1]}-level`,
    school:       parseSchool(spell),
    casting_time: parseCastingTime(spell),
    range:        parseRange(spell),
    components:   parseComponents(spell),
    duration:     parseDuration(desc),
    concentration: parseConcentration(desc),
    ritual:       parseRitual(desc),
    dnd_class:    parseClasses(spell),
    desc:         parseDesc(desc),
    source:       spell.book,
  };
});

// Sort by level then name
output.sort((a, b) => a.level_int - b.level_int || a.name.localeCompare(b.name));

fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Written ${output.length} spells to ${outPath}`);

// Quick sanity check
const byLevel = output.reduce((acc, s) => { acc[s.level_int] = (acc[s.level_int]||0)+1; return acc; }, {});
console.log('By level:', byLevel);
const withClasses = output.filter(s => s.dnd_class).length;
console.log(`Spells with parsed class list: ${withClasses}/${output.length}`);
const withConc = output.filter(s => s.concentration === 'yes').length;
console.log(`Concentration spells: ${withConc}`);
