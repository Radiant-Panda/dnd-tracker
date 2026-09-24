// Run: node tests/class-options.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
vm.runInThisContext(fs.readFileSync(path.join(root, 'data/class_options.js'), 'utf8') + ';globalThis.CLASS_OPTIONS_DATA = CLASS_OPTIONS_DATA;');
// Only the keys matter: which classes have 2024 feature data
globalThis.CLASS_FEATURES_2024 = Object.fromEntries(
  ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard'].map(c => [c, []]));
const R = require(path.join(root, 'class-options-rules.js'));

const opt = (name, source) => CLASS_OPTIONS_DATA.options.find(o => o.name === name && o.source === source);
const char = (edition, classes, extra = {}) => ({ edition, classes, featuresList: [], spells: { known: [], prepared: [] }, ...extra });
const group = (ch, label) => R.classOptionGroups(ch).find(g => g.label === label);
const chosen = (name, types, cls) => ({ name, _option: types[0], _optionTypes: types, _optionClass: cls });

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }

test('2014 Warlock 5 gets 3 invocations and a pact boon', () => {
  const ch = char('2014', [{ class: 'Warlock', subclass: 'The Fiend', level: 5 }]);
  assert.strictEqual(group(ch, 'Eldritch Invocations').max, 3);
  assert.strictEqual(group(ch, 'Pact Boon').max, 1);
});

test('2024 Warlock 1 gets 1 invocation and no separate pact boon', () => {
  const ch = char('2024', [{ class: 'Warlock', level: 1 }]);
  assert.strictEqual(group(ch, 'Eldritch Invocations').max, 1);
  assert.strictEqual(group(ch, 'Pact Boon'), undefined);
});

test('Thirsting Blade needs Warlock 5 and Pact of the Blade', () => {
  const tb = opt('Thirsting Blade', 'PHB');
  const ch = char('2014', [{ class: 'Warlock', level: 5 }]);
  assert.deepStrictEqual(R.classOptionPrereqStatus(tb, ch).unmet, ['Pact of the Blade']);
  ch.featuresList.push(chosen('Pact of the Blade', ['PB'], 'Warlock'));
  assert.strictEqual(R.classOptionPrereqStatus(tb, ch).met, true);
  ch.classes[0].level = 4;
  assert.deepStrictEqual(R.classOptionPrereqStatus(tb, ch).unmet, ['Warlock 5+']);
});

test('multiclass level prerequisite uses the warlock level, not total level', () => {
  const ch = char('2014', [{ class: 'Fighter', level: 6 }, { class: 'Warlock', level: 3 }]);
  assert.strictEqual(R.classOptionPrereqStatus(opt('Ascendant Step', 'PHB'), ch).met, false);
});

test('2014 Agonizing Blast needs the eldritch blast cantrip', () => {
  const ab = opt('Agonizing Blast', 'PHB');
  const ch = char('2014', [{ class: 'Warlock', level: 2 }]);
  assert.strictEqual(R.classOptionPrereqStatus(ab, ch).met, false);
  ch.spells.known.push({ name: 'Eldritch Blast' });
  assert.strictEqual(R.classOptionPrereqStatus(ab, ch).met, true);
});

test('free-text prerequisites count as met and are shown as notes', () => {
  const ab = opt('Agonizing Blast', 'XPHB');
  const s = R.classOptionPrereqStatus(ab, char('2024', [{ class: 'Warlock', level: 2 }]));
  assert.strictEqual(s.met, true);
  assert.ok(s.notes[0].includes('Cantrip'));
});

test('Sorcerer metamagic counts differ by edition', () => {
  assert.strictEqual(group(char('2014', [{ class: 'Sorcerer', level: 3 }]), 'Metamagic').max, 2);
  assert.strictEqual(group(char('2014', [{ class: 'Sorcerer', level: 2 }]), 'Metamagic'), undefined);
  assert.strictEqual(group(char('2024', [{ class: 'Sorcerer', level: 10 }]), 'Metamagic').max, 4);
});

test('Battle Master maneuvers come from the subclass', () => {
  assert.strictEqual(group(char('2024', [{ class: 'Fighter', subclass: 'Battle Master', level: 7 }]), 'Maneuvers').max, 5);
  assert.strictEqual(group(char('2024', [{ class: 'Fighter', subclass: 'Champion', level: 7 }]), 'Maneuvers'), undefined);
});

test('2014 Champion 10 gets two fighting styles; 2024 Fighter gets none (they are feats)', () => {
  assert.strictEqual(group(char('2014', [{ class: 'Fighter', subclass: 'Champion', level: 10 }]), 'Fighting Style').max, 2);
  assert.strictEqual(group(char('2024', [{ class: 'Fighter', subclass: 'Champion', level: 10 }]), 'Fighting Style'), undefined);
});

test('2014-only subclasses still grant options to 2024 characters', () => {
  assert.strictEqual(group(char('2024', [{ class: 'Fighter', subclass: 'Rune Knight', level: 3 }]), 'Runes').max, 2);
  assert.strictEqual(group(char('2024', [{ class: 'Monk', subclass: 'Way of the Four Elements', level: 6 }]), 'Elemental Disciplines').max, 3);
});

test('Artificer (no 2024 data) uses 2014 infusions even on a 2024 character', () => {
  const g = group(char('2024', [{ class: 'Artificer', level: 2 }]), 'Infusions');
  assert.strictEqual(g.max, 4);
  assert.ok(R.classOptionsForGroup(g, char('2024', [{ class: 'Artificer', level: 2 }])).suggested.length > 0);
});

test('Artificer infusion level prerequisite', () => {
  const ch = char('2014', [{ class: 'Artificer', level: 2 }]);
  const g = group(ch, 'Infusions');
  const { suggested, other } = R.classOptionsForGroup(g, ch);
  assert.ok(suggested.some(x => x.opt.name === 'Enhanced Defense'));
  assert.ok(other.some(x => x.opt.name === 'Boots of the Winding Path'));
});

test('options picker filters to the group edition unless showing all', () => {
  const ch = char('2024', [{ class: 'Warlock', level: 5 }]);
  const g = group(ch, 'Eldritch Invocations');
  const own = R.classOptionsForGroup(g, ch, false);
  const all = R.classOptionsForGroup(g, ch, true);
  assert.ok([...own.suggested, ...own.other].every(x => x.opt.edition === '2024'));
  assert.ok(all.suggested.length + all.other.length > own.suggested.length + own.other.length);
});

test('chosen options are counted per class', () => {
  const ch = char('2014', [{ class: 'Warlock', level: 5 }]);
  ch.featuresList.push(chosen('Agonizing Blast', ['EI'], 'Warlock'), chosen('Devil\'s Sight', ['EI'], 'Warlock'));
  assert.strictEqual(group(ch, 'Eldritch Invocations').chosen.length, 2);
});

test('prereq label is readable', () => {
  assert.strictEqual(R.classOptionPrereqLabel(opt('Thirsting Blade', 'PHB')), 'Warlock 5+ · Pact of the Blade');
});

console.log(`\n${passed} passed`);
