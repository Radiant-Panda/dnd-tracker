// Run: node tests/resources.test.js
const assert = require('assert');
const path = require('path');

globalThis.CLASS_FEATURES_2024 = Object.fromEntries(
  ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard'].map(c => [c, []]));
const R = require(path.join(__dirname, '..', 'resources-rules.js'));

const char = (edition, classes, abilities = {}) => ({
  edition, classes, level: classes.reduce((s, c) => s + c.level, 0), abilities: { cha: 10, ...abilities },
});
const base = (name, cls) => ({ name, _baseClass: true, _forClass: cls, source: cls });
const expected = ch => Object.fromEntries(R.expectedBaseResources(ch).map(({ def }) =>
  [def.name, R.resourceMax(base(def.name, null), ch)]));

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }

test('Channel Divinity differs by edition (Cleric)', () => {
  assert.strictEqual(expected(char('2024', [{ class: 'Cleric', level: 2 }]))['Channel Divinity'], 2);
  assert.strictEqual(expected(char('2014', [{ class: 'Cleric', level: 2 }]))['Channel Divinity'], 1);
  assert.strictEqual(expected(char('2024', [{ class: 'Cleric', level: 18 }]))['Channel Divinity'], 4);
  assert.strictEqual(expected(char('2024', [{ class: 'Cleric', level: 1 }]))['Channel Divinity'], undefined);
});

test('Paladin Channel Divinity: 1 in 2014, 2 then 3 in 2024', () => {
  assert.strictEqual(expected(char('2014', [{ class: 'Paladin', level: 3 }]))['Channel Divinity'], 1);
  assert.strictEqual(expected(char('2024', [{ class: 'Paladin', level: 3 }]))['Channel Divinity'], 2);
  assert.strictEqual(expected(char('2024', [{ class: 'Paladin', level: 11 }]))['Channel Divinity'], 3);
});

test('Second Wind: 1 in 2014, scales in 2024', () => {
  assert.strictEqual(expected(char('2014', [{ class: 'Fighter', level: 1 }]))['Second Wind'], 1);
  assert.strictEqual(expected(char('2024', [{ class: 'Fighter', level: 4 }]))['Second Wind'], 3);
});

test('Wild Shape starts at L2 and scales in 2024', () => {
  assert.strictEqual(expected(char('2024', [{ class: 'Druid', level: 1 }]))['Wild Shape'], undefined);
  assert.strictEqual(expected(char('2024', [{ class: 'Druid', level: 6 }]))['Wild Shape'], 3);
  assert.strictEqual(expected(char('2014', [{ class: 'Druid', level: 6 }]))['Wild Shape'], 2);
});

test('Indomitable and Mystic Arcanum only appear once unlocked', () => {
  assert.strictEqual(expected(char('2024', [{ class: 'Fighter', level: 8 }])).Indomitable, undefined);
  assert.strictEqual(expected(char('2024', [{ class: 'Fighter', level: 9 }])).Indomitable, 1);
  const wl = expected(char('2024', [{ class: 'Warlock', level: 13 }]));
  assert.deepStrictEqual(Object.keys(wl), ['Mystic Arcanum (6th)', 'Mystic Arcanum (7th)']);
});

test('multiclass uses each class level, not total level', () => {
  const ch = char('2024', [{ class: 'Paladin', level: 2 }, { class: 'Sorcerer', level: 10 }]);
  const e = expected(ch);
  assert.strictEqual(e['Lay on Hands'], 10);
  assert.strictEqual(e['Sorcery Points'], 10);
  assert.strictEqual(e['Channel Divinity'], undefined); // Paladin 2 has none yet
});

test('shared Channel Divinity uses the larger count, one tracker', () => {
  const ch = char('2024', [{ class: 'Cleric', level: 6 }, { class: 'Paladin', level: 3 }]);
  const names = R.expectedBaseResources(ch).map(x => x.def.name);
  assert.strictEqual(names.filter(n => n === 'Channel Divinity').length, 1);
  assert.strictEqual(R.resourceMax(base('Channel Divinity', 'Paladin'), ch), 3);
});

test('proficiency-based resources use total level', () => {
  const ch = char('2024', [{ class: 'Warlock', level: 1 }, { class: 'Fighter', level: 8 }]);
  assert.strictEqual(R.resourceMax({ name: 'Form of Dread', _subclass: 'The Undead', _forClass: 'Warlock', maxFormula: 'proficiency' }, ch), 4);
});

test('Bardic Inspiration follows CHA, and die/recharge follow Bard level', () => {
  const bi = base('Bardic Inspiration', 'Bard');
  assert.strictEqual(R.resourceMax(bi, char('2024', [{ class: 'Bard', level: 1 }], { cha: 18 })), 4);
  const mc = char('2024', [{ class: 'Bard', level: 4 }, { class: 'Wizard', level: 6 }]);
  assert.strictEqual(R.resourceDie(bi, mc), 'd6');
  assert.strictEqual(R.resourceRecharge(bi, mc), 'long');
  const b10 = char('2024', [{ class: 'Bard', level: 10 }]);
  assert.strictEqual(R.resourceDie(bi, b10), 'd10');
  assert.strictEqual(R.resourceRecharge(bi, b10), 'short');
});

test('subclass dice scale with the subclass class level', () => {
  const sd = { name: 'Superiority Dice', _subclass: 'Battle Master', _forClass: 'Fighter', maxFormula: 4, die: 'd8' };
  assert.strictEqual(R.resourceDie(sd, char('2024', [{ class: 'Fighter', level: 3 }, { class: 'Wizard', level: 9 }])), 'd8');
  assert.strictEqual(R.resourceDie(sd, char('2024', [{ class: 'Fighter', level: 10 }])), 'd10');
});

test('older saves without _forClass still resolve via source', () => {
  const r = { name: 'Lay on Hands', _baseClass: true, source: 'Paladin', maxFormula: 'level_x5', max: 60 };
  assert.strictEqual(R.resourceMax(r, char('2024', [{ class: 'Paladin', level: 2 }, { class: 'Sorcerer', level: 10 }])), 10);
});

test('custom resources and manual overrides keep their number', () => {
  assert.strictEqual(R.resourceMax({ name: 'Luck', custom: true, max: 3, maxFormula: 3 }, char('2024', [{ class: 'Rogue', level: 5 }])), 3);
  assert.strictEqual(R.resourceMax({ ...base('Rage', 'Barbarian'), maxOverride: 9 }, char('2024', [{ class: 'Barbarian', level: 1 }])), 9);
});

test('2024-only resources are skipped for 2014 characters', () => {
  assert.strictEqual(expected(char('2014', [{ class: 'Ranger', level: 5 }]))['Favored Enemy'], undefined);
  assert.strictEqual(expected(char('2024', [{ class: 'Ranger', level: 5 }]))['Favored Enemy'], 3);
  assert.strictEqual(expected(char('2024', [{ class: 'Sorcerer', level: 1 }]))['Innate Sorcery'], 2);
});

test('Artificer uses 2014 rules even on a 2024 character', () => {
  assert.strictEqual(expected(char('2024', [{ class: 'Artificer', level: 6 }]))['Infuse Item'], 3);
});

console.log(`\n${passed} passed`);
