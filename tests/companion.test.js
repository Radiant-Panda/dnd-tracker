// Run: node tests/companion.test.js
const assert = require('assert');
const path = require('path');
const C = require(path.join(__dirname, '..', 'companion-rules.js'));
const monsters = require(path.join(__dirname, '..', 'data', 'monsters.json'));
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }
const sb = m => ({ actions: m.actions || [], bonus_actions: m.bonus_actions || [], reactions: m.reactions || [], traits: m.traits || [], legendary_actions: m.legendary_actions || [], dexterity: m.dex });

test('cleanAbilityName turns recharge codes into words', () => {
  assert.strictEqual(C.cleanAbilityName('Fire Breath {@recharge 5}'), 'Fire Breath (Recharge 5–6)');
  assert.strictEqual(C.cleanAbilityName('Cold Breath {@recharge}'), 'Cold Breath (Recharge 6)');
  assert.strictEqual(C.cleanAbilityName('Scimitar'), 'Scimitar');
});
test('recharge abilities give one use restored by a d6 roll', () => {
  const d = C.parseUses(sb(monsters.find(m => m.name === 'Adult Red Dragon'))).find(u => /Fire Breath/.test(u.label));
  assert.deepStrictEqual({ max: d.max, restore: d.restore, rechargeMin: d.rechargeMin }, { max: 1, restore: 'recharge', rechargeMin: 5 });
  assert.strictEqual(C.rechargeRoll(d, 4), false);
  assert.strictEqual(C.rechargeRoll(d, 5), true);
});
test('N/Day abilities give N uses restored on a long rest', () => {
  const defs = C.parseUses({ actions: [{ name: 'Misty Step (3/Day)', desc: '' }] });
  assert.deepStrictEqual(defs.map(d => [d.label, d.max, d.restore]), [['Misty Step', 3, 'long']]);
});
test('"N/Day, or M/Day in Lair" uses the first number', () => {
  assert.strictEqual(C.parseUses({ actions: [{ name: 'Roar (2/Day, or 3/Day in Lair)', desc: '' }] })[0].max, 2);
});
test('short-or-long rest abilities restore on a short rest', () => {
  assert.strictEqual(C.parseUses({ reactions: [{ name: 'Shield (Recharges after a Short or Long Rest)', desc: '' }] })[0].restore, 'short');
  assert.strictEqual(C.parseUses({ actions: [{ name: 'Form (Fiend Only; Recharges after a Long Rest)', desc: '' }] })[0].restore, 'long');
});
test('other "Recharges after…" abilities are reset by hand', () => {
  assert.strictEqual(C.parseUses({ actions: [{ name: 'Portent (Recharges after the Diviner Casts a Divination Spell of 1st Level or Higher)', desc: '' }] })[0].restore, 'manual');
});
test('spellcasting "N/Day Each" gives N uses per spell', () => {
  const defs = C.parseUses({ actions: [{ name: 'Spellcasting', desc: 'At Will: Light. 2/Day Each: Fly, Lightning Bolt. 1/Day Each: Cone of Cold' }] });
  assert.deepStrictEqual(defs.map(d => [d.label, d.max]), [['Fly', 2], ['Lightning Bolt', 2], ['Cone of Cold', 1]]);
});
test('Review focus: use keys are unique within a stat block', () => {
  const defs = C.parseUses({ actions: [{ name: 'Blink (1/Day)', desc: '' }, { name: 'Spellcasting', desc: '1/Day Each: Blink' }], bonus_actions: [{ name: 'Blink (1/Day)', desc: '' }] });
  assert.strictEqual(new Set(defs.map(d => d.key)).size, defs.length);
});
test('parsing every monster never throws and keys stay unique', () => {
  for (const m of monsters) { const defs = C.parseUses(sb(m)); assert.strictEqual(new Set(defs.map(d => d.key)).size, defs.length, m.name); }
});
test('rests restore the right uses', () => {
  const defs = [{ key: 'a', max: 3, restore: 'long' }, { key: 'b', max: 1, restore: 'short' }, { key: 'c', max: 1, restore: 'recharge' }, { key: 'd', max: 1, restore: 'manual' }];
  const used = { a: 2, b: 1, c: 1, d: 1 };
  assert.deepStrictEqual(C.restoreUses(used, defs, 'short'), { a: 2, b: 0, c: 1, d: 1 });
  assert.deepStrictEqual(C.restoreUses(used, defs, 'long'), { a: 0, b: 0, c: 0, d: 1 });
});
test('buildCompanionRecord copies only shareable fields', () => {
  const npc = { id: 'n1', name: 'Sildar', role: 'Knight', race: 'Human', location: 'Phandalin', ac: 15, maxHP: 52, hp: 40, tempHP: 3,
    statBlock: { dexterity: 16, actions: [] }, statSource: 'Bandit Captain', legendaryMax: 0, initBonus: 1,
    personality: 'p', goals: 'g', relationships: 'r', secrets: 's', notes: 'n', portrait: 'data:image/jpeg;base64,AA', portraitZoom: 120 };
  const rec = C.buildCompanionRecord(npc, 'c1', 'camp1', 'comp1', 'tok');
  for (const k of ['personality', 'goals', 'relationships', 'secrets', 'notes']) assert.ok(!(k in rec), k);
  assert.deepStrictEqual({ id: rec.id, npcId: rec.npcId, ownerCharId: rec.ownerCharId, campaignId: rec.campaignId, shareToken: rec.shareToken, playerAccess: rec.playerAccess },
    { id: 'comp1', npcId: 'n1', ownerCharId: 'c1', campaignId: 'camp1', shareToken: 'tok', playerAccess: 'play' });
  assert.deepStrictEqual({ hp: rec.hp, tempHP: rec.tempHP, ac: rec.ac, maxHP: rec.maxHP, initBonus: rec.initBonus, conditions: rec.conditions, uses: rec.uses, portrait: rec.portrait, portraitZoom: rec.portraitZoom },
    { hp: 40, tempHP: 3, ac: 15, maxHP: 52, initBonus: 3, conditions: [], uses: {}, portrait: 'data:image/jpeg;base64,AA', portraitZoom: 120 });
});
test('Review focus: an NPC with no stat block still builds a record', () => {
  const rec = C.buildCompanionRecord({ id: 'n2', name: '', hp: 0, maxHP: 10, ac: 12, initBonus: 2 }, 'c1', 'camp1', 'x', 't');
  assert.deepStrictEqual({ name: rec.name, statBlock: rec.statBlock, initBonus: rec.initBonus, hp: rec.hp }, { name: 'Unnamed NPC', statBlock: null, initBonus: 2, hp: 0 });
});
test('fields allowed per access setting', () => {
  assert.deepStrictEqual(C.companionFieldsFor('view'), []);
  assert.deepStrictEqual(C.companionFieldsFor('play'), C.COMPANION_PLAY_FIELDS);
  assert.ok(C.companionFieldsFor('full').includes('statBlock') && !C.companionFieldsFor('full').includes('playerAccess'));
});
test('sanitizeCompanion forces numbers, strings and known access values', () => {
  const c = C.sanitizeCompanion({ id: 'c', ac: '<b>', maxHP: '30', hp: 'x', tempHP: -3, initBonus: null, legendaryMax: 'y',
    name: 42, role: undefined, playerAccess: 'admin', portraitZoom: 'z' }, ['Prone']);
  assert.deepStrictEqual({ ac: c.ac, maxHP: c.maxHP, hp: c.hp, tempHP: c.tempHP, initBonus: c.initBonus, legendaryMax: c.legendaryMax, name: c.name, role: c.role, playerAccess: c.playerAccess, portraitZoom: c.portraitZoom },
    { ac: 10, maxHP: 30, hp: 0, tempHP: 0, initBonus: 0, legendaryMax: 0, name: '42', role: '', playerAccess: 'view', portraitZoom: 100 });
});
test('sanitizeCompanion keeps only known conditions and numeric uses', () => {
  const c = C.sanitizeCompanion({ conditions: ['Prone', "x'); alert(1); ('", { name: 'Poisoned', duration: '3' }, { name: '<img>', duration: 2 }, 5],
    uses: { a: 1, b: '<x>', c: -2 } }, ['Prone', 'Poisoned']);
  assert.deepStrictEqual(c.conditions, ['Prone', { name: 'Poisoned', duration: 3 }]);
  assert.deepStrictEqual(c.uses, { a: 1, b: 0, c: 0 });
});
test('sanitizeCompanion only accepts embedded image art', () => {
  assert.strictEqual(C.sanitizeCompanion({ portrait: 'https://example.com/p.png' }, []).portrait, null);
  assert.strictEqual(C.sanitizeCompanion({ portrait: 'javascript:alert(1)' }, []).portrait, null);
  assert.strictEqual(C.sanitizeCompanion({ portrait: 'data:image/jpeg;base64,AAAA' }, []).portrait, 'data:image/jpeg;base64,AAAA');
});

console.log(`\n${passed} passed`);
