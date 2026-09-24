// Run: node tests/rules-text.test.js
const assert = require('assert');
const path = require('path');
const { entriesToRulesText } = require(path.join(__dirname, '..', 'data', 'rules-text-build.js'));
const { renderRulesText } = require(path.join(__dirname, '..', 'rules-text.js'));
const SRC = 'C:/Users/Kiana/Downloads/5etools-src-main/data/class/';

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }

const fontOfMagic = require(SRC + 'class-sorcerer.json').classFeature.find(f => f.name === 'Font of Magic' && f.source === 'XPHB');
const cleric = require(SRC + 'class-cleric.json').classFeature;
const channel = cleric.find(f => f.name === 'Channel Divinity' && f.source === 'XPHB');
const resolveRef = e => {
  const [name, , source, level] = e.classFeature.split('|');
  return cleric.find(f => f.name === name && f.source === source && String(f.level) === level) || null;
};

test('paragraphs stay separate', () => {
  const t = entriesToRulesText(fontOfMagic.entries);
  assert.ok(t.startsWith('You can tap into the wellspring'));
  assert.ok(t.split('\n\n').length >= 5);
});

test('named entries become run-in headings', () => {
  const t = entriesToRulesText(fontOfMagic.entries);
  assert.ok(t.includes('**Converting Spell Slots to Sorcery Points.** You can expend'), t);
  assert.ok(t.includes('**Creating Spell Slots.** As a Bonus Action'), t);
});

test('tables keep their rows', () => {
  const t = entriesToRulesText(fontOfMagic.entries);
  assert.ok(t.includes('Table: Creating Spell Slots\n| Spell Slot Level | Sorcery Point Cost | Min. Sorcerer Level |\n| 1 | 2 | 2 |'), t);
});

test('referenced features are inlined as options', () => {
  const t = entriesToRulesText(channel.entries, { resolveRef });
  assert.ok(t.includes('> **Divine Spark**\n>\n> As a Magic action'), t);
  assert.ok(t.includes('> **Turn Undead**'), t);
});

test('render: run-in heading, dice and rules terms', () => {
  const html = renderRulesText('**Superiority Dice.** You have four d8s. Regain them on a Short Rest.');
  assert.ok(html.includes('<strong class="rt-runin">Superiority Dice.</strong>'), html);
  assert.ok(html.includes('<span class="rt-dice">d8</span>s'), html);
  assert.ok(html.includes('<span class="rt-term">Short Rest</span>'), html);
});

test('render: table with the reader\'s row highlighted', () => {
  const html = renderRulesText(entriesToRulesText(fontOfMagic.entries), { cls: 'Sorcerer', level: 5 });
  assert.ok(html.includes('<caption>Creating Spell Slots</caption>'), html);
  assert.ok(/<tr class="rt-you"><td>3<\/td><td>5<\/td><td>5<\/td><\/tr>/.test(html), html);
});

test('render: options and the scaling note at the reader\'s level', () => {
  const html = renderRulesText(entriesToRulesText(channel.entries, { resolveRef }), { cls: 'Cleric', level: 5 });
  assert.ok(html.includes('<div class="rt-option"><div class="rt-option-name">Divine Spark</div>'), html);
  assert.ok(html.includes('At Cleric 5: <span class="rt-dice">1d8</span>'), html);
  const at13 = renderRulesText(entriesToRulesText(channel.entries, { resolveRef }), { cls: 'Cleric', level: 13 });
  assert.ok(at13.includes('At Cleric 13: <span class="rt-dice">3d8</span>'), at13);
});

test('render: lists', () => {
  const html = renderRulesText('• **Blinded.** You can\'t see.\n• Plain item');
  assert.ok(html.startsWith('<ul class="rt-list"><li><strong class="rt-runin">Blinded.</strong>'), html);
});

test('render: old flat text and HTML are escaped', () => {
  assert.strictEqual(renderRulesText('Deal 2d6 <b>fire</b>'), '<p>Deal <span class="rt-dice">2d6</span> &lt;b&gt;fire&lt;/b&gt;</p>');
  assert.strictEqual(renderRulesText(''), '');
});

console.log(`\n${passed} passed`);
