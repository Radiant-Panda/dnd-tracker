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

// ── Generated templates (data/build-companion-templates.js) ──
const T = require(path.join(__dirname, '..', 'data', 'companion_templates.js'));
test('templates include every formula creature, familiars, steeds and mounts', () => {
  for (const k of ['Steel Defender|TCE', 'Steel Defender|EFA', 'Beast of the Land|TCE', 'Beast of the Sky|XPHB', 'Bestial Spirit|TCE',
    'Bestial Spirit|XPHB', 'Celestial Spirit|XPHB', 'Animated Object|XPHB', 'Otherworldly Steed|XPHB', 'Drake Companion|FTD',
    'Wildfire Spirit|TCE', 'Hound of Ill Omen|XGE', 'Homunculus Servant|TCE', 'Homunculus Servant|EFA'])
    assert.ok(T[k], 'missing ' + k);
  assert.ok(Object.values(T).filter(t => t.kind === 'class' || (t.kind === 'summon' && t.source !== 'MM')).length >= 37);
  assert.ok(Object.values(T).some(t => t.kind === 'familiar' && t.name === 'Owl' && t.edition === '2014'));
  assert.ok(Object.values(T).some(t => t.kind === 'familiar' && t.name === 'Owl' && t.edition === '2024'));
  assert.ok(Object.values(T).some(t => t.kind === 'familiar' && t.group === 'Pact of the Chain' && t.name === 'Imp'));
  assert.ok(Object.values(T).some(t => t.kind === 'mount' && t.name === 'Riding Horse'));
});
test('template metadata', () => {
  const sd = T['Steel Defender|TCE'];
  assert.deepStrictEqual([sd.kind, sd.grantedBy.cls, sd.grantedBy.subclass, sd.grantedBy.level, sd.offer, sd.atZero, sd.turn, sd.edition],
    ['class', 'Artificer', 'Battle Smith', 3, true, 'down', 'afterOwner', '2014']);
  const bs = T['Bestial Spirit|XPHB'];
  assert.deepStrictEqual([bs.kind, bs.grantedBy.spell, bs.grantedBy.spellLevel, bs.concentration, bs.atZero, bs.turn, bs.variants],
    ['summon', 'Summon Beast', 2, true, 'vanish', 'afterOwner', ['Air', 'Land', 'Water']]);
  assert.strictEqual(T['Hound of Ill Omen|XGE'].offer, false);
  assert.strictEqual(T['Owl|MM'].kind, 'familiar');
  assert.strictEqual(T['Owl|MM'].turn, 'own');
});
test('attack text keeps formula tokens the app can fill', () => {
  const rend = T['Steel Defender|TCE'].monster.actions.find(a => a.name === 'Force-Empowered Rend');
  assert.match(rend.desc, /\{\{\+SPELLATK\}\} to hit/);
  assert.match(rend.desc, /1d8 \+ \{\{PB\}\} force damage/);
  assert.match(T['Bestial Spirit|XPHB'].monster.actions.find(a => a.name === 'Rend').desc, /1d8 \+ \{\{4 \+ SL\}\}/);
  for (const t of Object.values(T)) assert.ok(!JSON.stringify(t.monster).includes('{@'), 'raw 5etools tag in ' + t.key);
  // The app finds attack bonuses by "+N to hit" — 2024 wording ("Attack Roll: +5, reach") needs it added
  assert.match(T['Bestial Spirit|XPHB'].monster.actions.find(a => a.name === 'Rend').desc, /Attack Roll: \{\{\+SPELLATK\}\} to hit, reach/);
  assert.match(T['Owl|XMM'].monster.actions.find(a => /Talons/.test(a.name)).desc, /\+\d+ to hit/);
});
test('variants carry their own data', () => {
  const vd = T['Bestial Spirit|XPHB'].variantData;
  assert.ok(vd.Air && vd.Land && vd.Water);
  assert.ok(vd.Air.traits.some(t => t.name === 'Flyby'));
  assert.ok(!vd.Air.traits.some(t => /Pack Tactics/.test(t.name)));
});
test('every token in every template fills to a number', () => {
  const vars = { PB: 3, SL: 9, LVL: 10, STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1, SPELLATK: 7, SPELLDC: 15 };
  const bad = [];
  for (const t of Object.values(T)) {
    for (const m of JSON.stringify({ m: t.monster, v: t.variantData }).matchAll(/\{\{\+?([^{}]+)\}\}/g))
      if (R.evalExpr(m[1], vars) === null) bad.push(t.key + ': ' + m[1]);
  }
  assert.deepStrictEqual(bad, []);
});
test('Review focus: no template is silently unresolved', () => {
  const allowed = new Set([]);   // add a key here only with a comment saying why the sheet's manual box is fine
  const bad = Object.values(T).filter(t => t.unresolved.length && !allowed.has(t.key)).map(t => t.key + ': ' + t.unresolved.join(','));
  assert.deepStrictEqual(bad, []);
});

// ── Resolving against the owner ──
const mkCh = (cls, level, abil = {}, extra = {}) => ({ edition: '2014', level, classes: [{ class: cls, subclass: extra.subclass || '', level }],
  abilities: { str: 10, dex: 14, con: 12, int: 16, wis: 14, cha: 10, ...abil }, spellBonus: {}, ...extra });
const resolve = (key, ch, oc = {}) => { const t = T[key]; const c = R.newOwnCompanion(t, oc); return R.resolveCompanion(t, c, R.companionContext(ch, t, c)); };

test('Steel Defender (TCE) HP scales with artificer level', () => {
  for (const [lvl, hp] of [[3, 20], [7, 40], [15, 80]]) assert.strictEqual(resolve('Steel Defender|TCE', mkCh('Artificer', lvl)).maxHP, hp, 'level ' + lvl);
  const r = resolve('Steel Defender|TCE', mkCh('Artificer', 7));
  assert.strictEqual(r.ac, 15);
  assert.deepStrictEqual(r.hitDice, { count: 7, die: 'd8' });
  assert.strictEqual(r.notes.hp, '40 = 2 + INT 3 + 5 × Artificer 7');
  const rend = r.monster.actions.find(a => a.name === 'Force-Empowered Rend').desc;
  assert.match(rend, /\+6 to hit/);              // PB 3 + INT 3
  assert.match(rend, /1d8 \+ 3 force damage/);
});
test('Beast of the Sky vs Land and 2024 AC from Wisdom', () => {
  const ch = mkCh('Ranger', 5, { wis: 16 }, { edition: '2024' });
  assert.strictEqual(resolve('Beast of the Sky|XPHB', ch).maxHP, 24);
  assert.strictEqual(resolve('Beast of the Land|XPHB', ch).maxHP, 30);
  assert.strictEqual(resolve('Beast of the Land|XPHB', ch).ac, 16);
});
test('Bestial Spirit variants at 2nd and 5th level', () => {
  const ch = mkCh('Druid', 9, { wis: 16 }, { edition: '2024' });
  assert.strictEqual(resolve('Bestial Spirit|XPHB', ch, { variant: 'Air', spellLevel: 2 }).maxHP, 20);
  assert.strictEqual(resolve('Bestial Spirit|XPHB', ch, { variant: 'Land', spellLevel: 5 }).maxHP, 45);
  assert.strictEqual(resolve('Bestial Spirit|XPHB', ch, { variant: 'Land', spellLevel: 5 }).ac, 16);
  const air = resolve('Bestial Spirit|XPHB', ch, { variant: 'Air', spellLevel: 2 });
  assert.ok(air.monster.traits.some(t => t.name === 'Flyby'));
  assert.match(air.monster.actions.find(a => a.name === 'Rend').desc, /1d8 \+ 6/);
});
test('Celestial Spirit Defender AC and Animated Object sizes', () => {
  const ch = mkCh('Cleric', 9, { wis: 16 }, { edition: '2024' });
  assert.strictEqual(resolve('Celestial Spirit|XPHB', ch, { variant: 'Defender', spellLevel: 5 }).ac, 18);
  assert.strictEqual(resolve('Celestial Spirit|XPHB', ch, { variant: 'Avenger', spellLevel: 5 }).ac, 16);
  assert.strictEqual(resolve('Animated Object|XPHB', mkCh('Wizard', 9, {}, { edition: '2024' }), { variant: 'Large', spellLevel: 5 }).maxHP, 20);
});
test('GM overrides win and survive a level change', () => {
  const t = T['Steel Defender|TCE'];
  const oc = R.newOwnCompanion(t, {}); oc.overrides = { maxHP: 99, attackBonus: 9 };
  for (const lvl of [3, 10]) {
    const r = R.resolveCompanion(t, oc, R.companionContext(mkCh('Artificer', lvl), t, oc));
    assert.strictEqual(r.maxHP, 99);
    assert.match(r.monster.actions.find(a => a.name === 'Force-Empowered Rend').desc, /\+9 to hit/);
    assert.deepStrictEqual(r.edited.sort(), ['attackBonus', 'maxHP']);
  }
});
test('Review focus: no casting class falls back to INT for spell attack', () => {
  const ch = mkCh('Fighter', 5, { int: 12 }, { edition: '2024' });
  const v = R.companionContext(ch, T['Bestial Spirit|XPHB'], { spellLevel: 2 });
  assert.strictEqual(v.SPELLATK, 3 + 1);
});
test('newOwnCompanion starts with defaults', () => {
  const t = T['Bestial Spirit|XPHB'];
  const oc = R.newOwnCompanion(t, { variant: 'Air', spellLevel: 3, concentrationSpell: 'Summon Beast', hp: 25, id: 'x' });
  assert.deepStrictEqual([oc.id, oc.templateKey, oc.name, oc.variant, oc.spellLevel, oc.hp, oc.tempHP, oc.turnMode, oc.concentrationSpell],
    ['x', 'Bestial Spirit|XPHB', 'Bestial Spirit', 'Air', 3, 25, 0, 'afterOwner', 'Summon Beast']);
});
test('Review focus: sanitizeOwnCompanion cleans player-written junk', () => {
  const oc = R.sanitizeOwnCompanion({ id: 'a', templateKey: 'Steel Defender|TCE', name: '<b>x</b>'.repeat(100), hp: '12', tempHP: -4,
    conditions: ['Prone', 'Bogus', { name: 'Stunned', duration: 2 }], overrides: { maxHP: '30', evil: 1, ac: 'x' }, uses: { a: '2' },
    portrait: 'javascript:alert(1)', turnMode: 'sideways' }, ['Prone', 'Stunned']);
  assert.strictEqual(oc.name.length, 200);
  assert.deepStrictEqual([oc.hp, oc.tempHP, oc.conditions, oc.overrides, oc.uses, oc.portrait, oc.turnMode],
    [12, 0, ['Prone', { name: 'Stunned', duration: 2 }], { maxHP: 30 }, { a: 2 }, null, 'own']);
  assert.strictEqual(R.sanitizeOwnCompanion({ name: 'no key' }, []), null);
});
test('staleConcentrationCompanions finds summons whose spell ended', () => {
  const ch = { activeConcentration: { spellName: 'Summon Fey' }, ownCompanions: [
    { id: 'a', concentrationSpell: 'Summon Beast' }, { id: 'b', concentrationSpell: 'Summon Fey' }, { id: 'c', concentrationSpell: null }] };
  assert.deepStrictEqual(R.staleConcentrationCompanions(ch).map(c => c.id), ['a']);
  assert.deepStrictEqual(R.staleConcentrationCompanions({ ...ch, activeConcentration: null }).map(c => c.id), ['a', 'b']);
});

console.log(`\n${passed} passed`);
