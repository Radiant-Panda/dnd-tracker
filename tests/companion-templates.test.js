// Run: node tests/companion-templates.test.js
const assert = require('assert');
const path = require('path');
const R = require(path.join(__dirname, '..', 'companion-templates-rules.js'));
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }
const V = { PB: 3, SL: 4, LVL: 7, STR: 2, DEX: 1, CON: 2, INT: 3, WIS: 4, CHA: -1, SPELLATK: 6, SPELLDC: 14 };
const ev = (text, vars = V) => { const f = R.parseFormula(text); assert.ok(f, 'unparsed: ' + text); return R.evalExpr(f.expr, vars); };

test('evalExpr does arithmetic with names, max and floor', () => {
  assert.strictEqual(R.evalExpr('2 + INT + 5*LVL', V), 40);
  assert.strictEqual(R.evalExpr('40 + 10*max(0, SL - 4)', { ...V, SL: 6 }), 60);
  assert.strictEqual(R.evalExpr('floor(SL / 2)', V), 2);
  assert.strictEqual(R.evalExpr('-1 + PB', V), 2);
  assert.strictEqual(R.evalExpr('20*V_air + 30*(V_land + V_water)', { ...V, V_land: 1 }), 30);
});
test('evalExpr refuses unknown names and junk', () => {
  assert.strictEqual(R.evalExpr('NOPE + 1', V), null);
  assert.strictEqual(R.evalExpr('alert(1)', V), null);
  assert.strictEqual(R.evalExpr('2 +', V), null);
});
test('class-level formulas (2014 and 2024 wording)', () => {
  assert.strictEqual(ev('2 + your Intelligence modifier + five times your artificer level (the defender has a number of Hit Dice [d8s] equal to your artificer level)'), 40);
  assert.strictEqual(ev('5 plus five times your Ranger level (the beast has a number of Hit Dice [d8s] equal to your Ranger level)'), 40);
  assert.strictEqual(ev('1 + your Intelligence modifier + your artificer level'), 11);
  assert.strictEqual(ev('13 plus your Wisdom modifier'), 17);
  assert.strictEqual(ev('14 + PB (natural armor)'), 17);
});
test('hit dice come from the [dNs] note', () => {
  const f = R.parseFormula('5 + five times your ranger level (the drake has a number of Hit Dice [d10s] equal to your ranger level)');
  assert.strictEqual(f.hitDie, 'd10'); assert.strictEqual(R.evalExpr(f.hitDiceExpr, V), 7);
  const s = R.parseFormula("5 + 10 per spell level (the steed has a number of Hit Dice [d10s] equal to the spell's level)");
  assert.strictEqual(R.evalExpr(s.hitDiceExpr, V), 4);
});
test('spell-level formulas', () => {
  assert.strictEqual(ev("11 + the spell's level"), 15);
  assert.strictEqual(ev('11 + the level of the spell (natural armor)'), 15);
  assert.strictEqual(ev('40 + 10 for each spell level above 4th', { ...V, SL: 6 }), 60);
  assert.strictEqual(ev('40 + 15 for each spell level above 4', V), 40);
  assert.strictEqual(ev('10 + 1 per spell level'), 14);
});
test('variant alternatives and variant-only bonuses', () => {
  const f = R.parseFormula('20 (Air only) or 30 (Land and Water only) + 5 for each spell level above 2nd');
  assert.strictEqual(R.evalExpr(f.expr, { ...V, [R.variantVar('Air')]: 1 }), 30);
  assert.strictEqual(R.evalExpr(f.expr, { ...V, [R.variantVar('Water')]: 1 }), 40);
  const c = R.parseFormula("11 + the spell's level + 2 (Defender only)");
  assert.strictEqual(R.evalExpr(c.expr, { ...V, [R.variantVar('Defender')]: 1 }), 17);
  assert.strictEqual(R.evalExpr(c.expr, { ...V, [R.variantVar('Avenger')]: 1 }), 15);
  const a = R.parseFormula('10 (Medium or smaller), 20 (Large), 40 (Huge)');
  assert.strictEqual(R.evalExpr(a.expr, { ...V, [R.variantVar('Large')]: 1 }), 20);
  assert.strictEqual(R.evalExpr(a.expr, { ...V, [R.variantVar('Medium or Smaller')]: 1 }), 10);
});
test('unparseable formulas return null', () => {
  assert.strictEqual(R.parseFormula('equal to the number of goblins you have met'), null);
});
test('bonus text for saves, skills and passive', () => {
  assert.strictEqual(R.evalExpr(R.parseBonusText('+1 plus PB'), V), 4);
  assert.strictEqual(R.evalExpr(R.parseBonusText('+0 plus PB × 2'), V), 6);
  assert.strictEqual(R.evalExpr(R.parseBonusText('10 + (PB × 2)'), V), 16);
  assert.strictEqual(R.parseBonusText('+5'), '5');
});
test('fillTokens replaces {{expr}} and signed {{+expr}}', () => {
  assert.strictEqual(R.fillTokens('{{+SPELLATK}} to hit. Hit: 1d8 + {{4 + SL}} damage, DC {{SPELLDC}}', V), '+6 to hit. Hit: 1d8 + 8 damage, DC 14');
  assert.strictEqual(R.fillTokens('{{+CHA}}', V), '-1');
  assert.strictEqual(R.fillTokens('{{NOPE}}', V), '?');
});

console.log(`\n${passed} passed`);
