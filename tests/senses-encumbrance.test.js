// Run: node tests/senses-encumbrance.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
vm.runInThisContext(fs.readFileSync(path.join(root, 'data/item_weights.js'), 'utf8') + ';globalThis.ITEM_WEIGHTS = ITEM_WEIGHTS;');
const E = require(path.join(root, 'encumbrance-rules.js'));
const S = require(path.join(root, 'senses-rules.js'));

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }
const char = (over = {}) => ({ edition: '2024', abilities: { str: 10 }, equipment: [], currency: {}, featuresList: [], carryWeight: 0, ...over });

// ── Item weights ──
test('plain item names look up their weight', () => {
  assert.strictEqual(E.entryWeight('Longsword', '2024').weight, 3);
  assert.strictEqual(E.entryWeight('chain mail', '2024').weight, 55);
});
test('weights follow the edition', () => {
  assert.strictEqual(E.entryWeight("Explorer's Pack", '2014').weight, 59);
  assert.strictEqual(E.entryWeight("Explorer's Pack", '2024').weight, 55);
});
test('quantities in front, behind or in brackets multiply the weight', () => {
  assert.strictEqual(E.entryWeight('2 Daggers', '2024').weight, 2);
  assert.strictEqual(E.entryWeight('2x Dagger', '2024').weight, 2);
  assert.strictEqual(E.entryWeight('Dagger x3', '2024').weight, 3);
  assert.strictEqual(E.entryWeight('Dagger (4)', '2024').weight, 4);
});
test('ammunition counts use the single-piece weight', () => {
  assert.strictEqual(E.entryWeight('20 arrows', '2024').weight, 1);
});
test('bundle names that include a count are taken as written', () => {
  assert.strictEqual(E.entryWeight('Arrows (20)', '2024').weight, 1);
});
test('+1 weapons weigh the same as the base weapon', () => {
  assert.strictEqual(E.entryWeight('+1 Longsword', '2024').weight, 3);
  assert.strictEqual(E.entryWeight('Longsword +2', '2024').weight, 3);
});
test('unknown text items have no weight', () => {
  assert.strictEqual(E.entryWeight('Lucky pebble from home', '2024').weight, null);
});

// ── Carried weight ──
test('carried weight adds items, coins (50 per lb) and the manual extra', () => {
  const w = E.carriedWeight(char({ equipment: ['Longsword', '20 arrows', 'Lucky pebble'], currency: { gp: 100, sp: 50 }, carryWeight: 4 }));
  assert.strictEqual(w.items, 4);
  assert.strictEqual(w.coins, 3);
  assert.strictEqual(w.other, 4);
  assert.strictEqual(w.total, 11);
  assert.deepStrictEqual(w.unknown, ['Lucky pebble']);
});
test('magic items use their listed weight; ones with none count as 0, not unknown', () => {
  const w = E.carriedWeight(char({ equipment: [{ name: 'Bag of Holding', _magic: true }, { name: 'Cloak of Protection', _magic: true }] }));
  assert.strictEqual(w.items, 5);
  assert.deepStrictEqual(w.unknown, []);
});

// ── Capacity ──
test('capacity is STR × 15, drag/lift/push STR × 30', () => {
  const c = E.carryCapacity(char({ abilities: { str: 12 } }));
  assert.strictEqual(c.carry, 180);
  assert.strictEqual(c.push, 360);
});
test('Powerful Build doubles capacity', () => {
  const c = E.carryCapacity(char({ abilities: { str: 10 }, featuresList: [{ name: 'Powerful Build', _species: 'Goliath' }] }));
  assert.strictEqual(c.carry, 300);
  assert.strictEqual(c.push, 600);
});
test('status: fine, over capacity (5 ft), or too heavy to move', () => {
  assert.strictEqual(E.encumbranceStatus(100, { carry: 150, push: 300 }).level, 'ok');
  assert.strictEqual(E.encumbranceStatus(200, { carry: 150, push: 300 }).level, 'over');
  assert.strictEqual(E.encumbranceStatus(301, { carry: 150, push: 300 }).level, 'immobile');
});

// ── Senses ──
const feat = (name, desc, extra = {}) => ({ name, desc, ...extra });
test('2024 species Darkvision trait', () => {
  const s = S.detectSenses(char({ race: 'Elf', featuresList: [feat('Darkvision', 'You have Darkvision with a range of 60 feet.', { _species: 'Elf' })] }));
  assert.deepStrictEqual(s, [{ sense: 'Darkvision', range: 60, source: 'Elf' }]);
});
test('2014 species "see in dim light" wording', () => {
  const s = S.detectSenses(char({ featuresList: [feat('Darkvision', 'Accustomed to twilit forests, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light.', { _species: 'Elf' })] }));
  assert.deepStrictEqual(s, [{ sense: 'Darkvision', range: 60, source: 'Elf' }]);
});
test('Superior Darkvision is 120 feet', () => {
  const s = S.detectSenses(char({ featuresList: [feat('Superior Darkvision', 'Your darkvision has a radius of 120 feet.', { _species: 'Drow' })] }));
  assert.deepStrictEqual(s, [{ sense: 'Darkvision', range: 120, source: 'Drow' }]);
});
test('the longest range wins when two features grant the same sense', () => {
  const s = S.detectSenses(char({ featuresList: [
    feat('Darkvision', 'You have Darkvision with a range of 60 feet.', { _species: 'Elf' }),
    feat('Eyes of Night', 'You have darkvision out to a range of 300 feet.', { _subclass: 'Twilight Domain' })] }));
  assert.deepStrictEqual(s, [{ sense: 'Darkvision', range: 300, source: 'Twilight Domain' }]);
});
test('Umbral Sight extends existing darkvision instead of replacing it', () => {
  const umbral = feat('Umbral Sight', 'You gain darkvision out to a range of 60 feet. If you already have darkvision from your race, its range increases by 30 feet.', { _subclass: 'Gloom Stalker' });
  assert.deepStrictEqual(S.detectSenses(char({ featuresList: [umbral] })), [{ sense: 'Darkvision', range: 60, source: 'Gloom Stalker' }]);
  const s = S.detectSenses(char({ featuresList: [feat('Darkvision', 'You have Darkvision with a range of 60 feet.', { _species: 'Elf' }), umbral] }));
  assert.deepStrictEqual(s, [{ sense: 'Darkvision', range: 90, source: 'Elf + Gloom Stalker' }]);
});
test('blindsight from a fighting style', () => {
  const s = S.detectSenses(char({ featuresList: [feat('Blind Fighting', 'You have blindsight with a range of 10 feet.', { _feat: true })] }));
  assert.deepStrictEqual(s, [{ sense: 'Blindsight', range: 10, source: 'Blind Fighting' }]);
});
test('temporary senses are not listed', () => {
  const s = S.detectSenses(char({ featuresList: [feat('Stonecunning', 'As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes.', { _species: 'Dwarf' })] }));
  assert.deepStrictEqual(s, []);
});

test('a sense offered as one choice among options is not assumed', () => {
  const s = S.detectSenses(char({ featuresList: [feat('Aspect of the Wilds', 'You gain one of the following options of your choice.\n\n**Owl.** You have Darkvision with a range of 60 feet.\n\n**Panther.** You have a Climb Speed equal to your Speed.', { _subclass: 'Path of the Wild Heart' })] }));
  assert.deepStrictEqual(s, []);
});
test('a sense you switch on with an action is not listed', () => {
  const bulwark = feat('Mortal Bulwark', 'As a bonus action, you gain the following benefits for 1 minute:\n\n• You gain truesight with a range of 120 feet.', { _subclass: 'Oath of the Watchers' });
  const eye = feat('The Third Eye', 'You can use your action to increase your powers of perception. When you do so, choose one of the following benefits.\n\n**Darkvision.** You gain darkvision out to a range of 60 feet.', { _subclass: 'School of Divination' });
  assert.deepStrictEqual(S.detectSenses(char({ featuresList: [bulwark, eye] })), []);
});
test('permanent benefits in a bullet list still count', () => {
  const s = S.detectSenses(char({ featuresList: [feat('Ascendant Aspect', 'Your draconic spirit reaches its peak. You gain the following benefits:\n\n• **Blindsight.** You gain blindsight out to 10 feet.', { _subclass: 'Way of the Ascendant Dragon' })] }));
  assert.deepStrictEqual(s, [{ sense: 'Blindsight', range: 10, source: 'Way of the Ascendant Dragon' }]);
});

console.log(`\n${passed} passed`);
