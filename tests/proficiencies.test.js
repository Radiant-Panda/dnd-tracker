// Run: node tests/proficiencies.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
vm.runInThisContext(fs.readFileSync(path.join(root, 'data/proficiency_data.js'), 'utf8') + ';globalThis.PROFICIENCY_DATA = PROFICIENCY_DATA;');
const R = require(path.join(root, 'proficiency-rules.js'));

const char = (edition, classes) => ({ edition, classes });
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }

test('language groups follow the edition', () => {
  const g14 = R.languageGroups(char('2014', [{ class: 'Wizard', level: 1 }]));
  assert.deepStrictEqual(g14.map(g => g.label), ['Standard', 'Exotic', 'Secret']);
  assert.ok(!g14[0].languages.includes('Common Sign Language'));
  assert.ok(g14[1].languages.includes('Draconic'));
  const g24 = R.languageGroups(char('2024', [{ class: 'Wizard', level: 1 }]));
  assert.deepStrictEqual(g24.map(g => g.label), ['Standard', 'Rare']);
  assert.ok(g24[0].languages.includes('Draconic') && g24[1].languages.includes("Thieves' Cant"));
});

test('2014 species languages; 2024 species grant none', () => {
  assert.deepStrictEqual(R.speciesLanguages('Elf', '2014'), { fixed: ['Common', 'Elvish'], choose: 0 });
  assert.deepStrictEqual(R.speciesLanguages('Warforged', '2014'), { fixed: ['Common'], choose: 1 });
  assert.deepStrictEqual(R.speciesLanguages('Elf', '2024'), { fixed: [], choose: 0 });
});

test('class languages: Rogue and Druid', () => {
  assert.deepStrictEqual(R.classLanguages(char('2024', [{ class: 'Rogue', level: 1 }, { class: 'Druid', level: 2 }])), ["Thieves' Cant", 'Druidic']);
  assert.deepStrictEqual(R.classLanguages(char('2024', [{ class: 'Wizard', level: 5 }])), []);
});

test('saving throws come from the first class only', () => {
  assert.deepStrictEqual(R.grantedSaves(char('2024', [{ class: 'Fighter', level: 3 }, { class: 'Wizard', level: 1 }])), ['str', 'con']);
  assert.deepStrictEqual(R.grantedSaves(char('2024', [{ class: 'Wizard', level: 1 }, { class: 'Fighter', level: 3 }])), ['int', 'wis']);
});

test('multiclass proficiencies follow the edition', () => {
  assert.deepStrictEqual(R.multiclassProficiencies('Paladin', '2024').weapons, ['Martial weapons']);
  assert.deepStrictEqual(R.multiclassProficiencies('Paladin', '2014').weapons, ['Simple weapons', 'Martial weapons']);
  assert.deepStrictEqual(R.multiclassProficiencies('Monk', '2024'), { armor: [], weapons: [], tools: [], skillChoice: null });
  assert.strictEqual(R.multiclassProficiencies('Rogue', '2024').skillChoice.count, 1);
});

test('Jack of All Trades: half proficiency from Bard 2', () => {
  assert.strictEqual(R.jackOfAllTrades(char('2024', [{ class: 'Bard', level: 2 }]), 2), 1);
  assert.strictEqual(R.jackOfAllTrades(char('2024', [{ class: 'Bard', level: 1 }]), 2), 0);
  assert.strictEqual(R.jackOfAllTrades(char('2024', [{ class: 'Fighter', level: 5 }, { class: 'Bard', level: 2 }]), 3), 1);
  assert.strictEqual(R.jackOfAllTrades(char('2024', [{ class: 'Wizard', level: 9 }]), 4), 0);
});

test('proficiencies sort into armor, weapons, tools and other', () => {
  assert.strictEqual(R.proficiencyCategory('Light armor'), 'armor');
  assert.strictEqual(R.proficiencyCategory('Shields'), 'armor');
  assert.strictEqual(R.proficiencyCategory('Martial weapons with the finesse or light property'), 'weapons');
  assert.strictEqual(R.proficiencyCategory('Shortswords'), 'weapons');
  assert.strictEqual(R.proficiencyCategory("Thieves' tools"), 'tools');
  assert.strictEqual(R.proficiencyCategory('Herbalism kit'), 'tools');
  assert.strictEqual(R.proficiencyCategory('Choose one Musical Instrument'), 'tools');
  assert.strictEqual(R.proficiencyCategory('Dragonchess set'), 'tools');
  assert.strictEqual(R.proficiencyCategory('Vehicles (land)'), 'tools');
  assert.strictEqual(R.proficiencyCategory('Sailing'), 'other');
});

test('proficiency strings split and merge without duplicates', () => {
  assert.deepStrictEqual(R.splitProficiencies(' Light armor, Shields,, shields '), ['Light armor', 'Shields']);
  assert.strictEqual(R.joinProficiencies(['Light armor', 'Shields']), 'Light armor, Shields');
});

console.log(`\n${passed} passed`);
