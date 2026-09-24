// Run: node tests/spellcasting.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
vm.runInThisContext(fs.readFileSync(path.join(root, 'data/spellcasting_data.js'), 'utf8') + ';globalThis.SPELLCASTING_DATA = SPELLCASTING_DATA;');
const R = require(path.join(root, 'spellcasting-rules.js'));

const char = (edition, classes, abilities = {}) => ({ edition, classes, abilities: { int: 10, wis: 10, cha: 10, ...abilities } });
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }

test('full casters: Wizard 3 has 4/2 slots', () => {
  const s = R.spellSlotMaxes(char('2024', [{ class: 'Wizard', level: 3 }])).slots;
  assert.deepStrictEqual([s[1], s[2], s[3]], [4, 2, 0]);
});

test('2024 Paladin and Ranger have slots at level 1; 2014 do not', () => {
  assert.strictEqual(R.spellSlotMaxes(char('2024', [{ class: 'Paladin', level: 1 }])).slots[1], 2);
  assert.strictEqual(R.spellSlotMaxes(char('2024', [{ class: 'Ranger', level: 1 }])).slots[1], 2);
  assert.strictEqual(R.spellSlotMaxes(char('2014', [{ class: 'Paladin', level: 1 }])).slots[1], 0);
});

test('multiclass: 2024 rounds Paladin levels up, 2014 rounds down', () => {
  const pw = ed => R.spellSlotMaxes(char(ed, [{ class: 'Paladin', level: 5 }, { class: 'Wizard', level: 1 }])).slots[2];
  assert.strictEqual(pw('2024'), 3); // caster level 3 + 1 = 4
  assert.strictEqual(pw('2014'), 2); // caster level 2 + 1 = 3
});

test('third casters only through their subclass', () => {
  assert.strictEqual(R.spellSlotMaxes(char('2024', [{ class: 'Fighter', subclass: 'Champion', level: 7 }])).slots[1], 0);
  assert.strictEqual(R.spellSlotMaxes(char('2024', [{ class: 'Fighter', subclass: 'Eldritch Knight', level: 7 }])).slots[2], 2);
});

test('pact magic is separate from regular slots', () => {
  const r = R.spellSlotMaxes(char('2024', [{ class: 'Warlock', level: 5 }, { class: 'Sorcerer', level: 2 }]));
  assert.deepStrictEqual([r.pactSlots, r.pactLevel, r.slots[1]], [2, 3, 3]);
});

test('cantrips: 2014 Cleric 4 has 4, Artificer 10 has 3', () => {
  assert.strictEqual(R.cantripMax(char('2014', [{ class: 'Cleric', level: 4 }])), 4);
  assert.strictEqual(R.cantripMax(char('2014', [{ class: 'Artificer', level: 10 }])), 3);
  assert.strictEqual(R.cantripMax(char('2024', [{ class: 'Paladin', level: 5 }])), null);
});

test('2024 prepared spells come from the class table', () => {
  assert.strictEqual(R.preparedLimits(char('2024', [{ class: 'Wizard', level: 1 }]))[0].limit, 4);
  assert.strictEqual(R.preparedLimits(char('2024', [{ class: 'Sorcerer', level: 3 }]))[0].limit, 6);
  assert.strictEqual(R.preparedLimits(char('2024', [{ class: 'Warlock', level: 5 }]))[0].limit, 6);
});

test('2014 prepared spells use the formula, minimum 1', () => {
  assert.strictEqual(R.preparedLimits(char('2014', [{ class: 'Cleric', level: 5 }], { wis: 16 }))[0].limit, 8);
  assert.strictEqual(R.preparedLimits(char('2014', [{ class: 'Wizard', level: 1 }], { int: 8 }))[0].limit, 1);
  // Artificer: half level rounded DOWN + INT
  assert.strictEqual(R.preparedLimits(char('2014', [{ class: 'Artificer', level: 3 }], { int: 16 }))[0].limit, 4);
  // Paladin has no spells at level 1 in 2014
  assert.strictEqual(R.preparedLimits(char('2014', [{ class: 'Paladin', level: 1 }], { cha: 16 }))[0].limit, 0);
});

test('2014 known casters have spells-known limits; 2024 versions prepare instead', () => {
  assert.strictEqual(R.knownLimits(char('2014', [{ class: 'Sorcerer', level: 3 }]))[0].limit, 4);
  assert.strictEqual(R.knownLimits(char('2014', [{ class: 'Fighter', subclass: 'Eldritch Knight', level: 3 }]))[0].limit, 3);
  assert.deepStrictEqual(R.knownLimits(char('2024', [{ class: 'Sorcerer', level: 3 }])), []);
});

test('multiclass limits are per class', () => {
  const ch = char('2024', [{ class: 'Cleric', level: 3 }, { class: 'Wizard', level: 2 }]);
  assert.deepStrictEqual(R.preparedLimits(ch).map(p => [p.cls, p.limit]), [['Cleric', 6], ['Wizard', 5]]);
  assert.strictEqual(R.cantripMax(ch), 6);
});

console.log(`\n${passed} passed`);
