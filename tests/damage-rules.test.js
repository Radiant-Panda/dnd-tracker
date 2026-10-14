// Run: node tests/damage-rules.test.js
const assert = require('assert');
const path = require('path');
const D = require(path.join(__dirname, '..', 'damage-rules.js'));

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }
const sb = (res = '', imm = '', vul = '') => ({
  damage_resistances: res ? res.split(', ') : [],
  damage_immunities: imm ? imm.split(', ') : [],
  damage_vulnerabilities: vul ? vul.split(', ') : [],
});
const sorted = set => [...set].sort();

// ── parseDefenses ──
test('nothing to parse gives empty defenses', () => {
  const d = D.parseDefenses(null);
  assert.strictEqual(d.resist.size + d.immune.size + d.vulnerable.size + d.conditional.length, 0);
  assert.strictEqual(D.parseDefenses({}).resist.size, 0);
});
test('plain lists become sets', () => {
  const d = D.parseDefenses(sb('cold, fire, lightning', 'poison', 'radiant'));
  assert.deepStrictEqual(sorted(d.resist), ['cold', 'fire', 'lightning']);
  assert.deepStrictEqual(sorted(d.immune), ['poison']);
  assert.deepStrictEqual(sorted(d.vulnerable), ['radiant']);
});
test('older combatants with string fields still parse', () => {
  const d = D.parseDefenses({ damage_resistances: 'fire, cold', damage_immunities: 'Poison' });
  assert.deepStrictEqual(sorted(d.resist), ['cold', 'fire']);
  assert.deepStrictEqual(sorted(d.immune), ['poison']);
});
test('a nonmagical condition covers only the physical types before it', () => {
  const d = D.parseDefenses(sb('cold, fire, lightning, bludgeoning, piercing, slashing (from nonmagical attacks)'));
  assert.deepStrictEqual(sorted(d.resist), ['cold', 'fire', 'lightning']);
  assert.strictEqual(d.conditional.length, 1);
  assert.deepStrictEqual(d.conditional[0].types, ['bludgeoning', 'piercing', 'slashing']);
  assert.strictEqual(d.conditional[0].kind, 'resist');
  assert.strictEqual(d.conditional[0].text, 'from nonmagical attacks');
});
test('silvered / adamantine / dim light conditions are conditional', () => {
  for (const s of ['bludgeoning, piercing, slashing (from nonmagical attacks that aren\'t silvered)',
                   'poison, bludgeoning, piercing, slashing (that is nonmagical)',
                   'bludgeoning, piercing, slashing (while in dim light or darkness)']) {
    const d = D.parseDefenses(sb('', s));
    assert.ok(!d.immune.has('slashing'), s);
    assert.deepStrictEqual(d.conditional[0].types, ['bludgeoning', 'piercing', 'slashing'], s);
    assert.strictEqual(d.conditional[0].kind, 'immune');
  }
});
test('a condition on a non-physical group covers the whole group', () => {
  const d = D.parseDefenses(sb('acid, cold, fire, lightning, poison (Chromatic and Metallic Only); force, necrotic, psychic, radiant, thunder (Gem Only)'));
  assert.strictEqual(d.resist.size, 0);
  assert.strictEqual(d.conditional.length, 2);
  assert.deepStrictEqual(d.conditional[0].types, ['acid', 'cold', 'fire', 'lightning', 'poison']);
  assert.strictEqual(d.conditional[0].text, 'Chromatic and Metallic Only');
  assert.deepStrictEqual(d.conditional[1].types, ['force', 'necrotic', 'psychic', 'radiant', 'thunder']);
});
test('several conditions in one list each cover their own group', () => {
  const d = D.parseDefenses(sb('lightning, thunder ((Air only)), piercing, slashing ((Earth only)), acid ((Water only))'));
  assert.strictEqual(d.resist.size, 0);
  assert.deepStrictEqual(d.conditional.map(c => [c.types, c.text]), [
    [['lightning', 'thunder'], 'Air only'], [['piercing', 'slashing'], 'Earth only'], [['acid'], 'Water only']]);
});
test('every defense string in the monster data parses into known types', () => {
  const mons = require(path.join(__dirname, '..', 'data', 'monsters.json'));
  const list = Array.isArray(mons) ? mons : Object.values(mons);
  for (const m of list) {
    const d = D.parseDefenses({ damage_resistances: m.resistances, damage_immunities: m.immunities, damage_vulnerabilities: m.vulnerabilities });
    for (const t of [...d.resist, ...d.immune, ...d.vulnerable, ...d.conditional.flatMap(c => c.types)])
      assert.ok(D.DAMAGE_TYPES.includes(t), `${m.name}: ${t}`);
  }
});

// ── resolveTargetDamage ──
const none = D.parseDefenses(null);
test('plain damage adds up its parts', () => {
  const r = D.resolveTargetDamage([{ amount: 8, type: 'slashing' }, { amount: 9, type: 'radiant' }], none);
  assert.strictEqual(r.total, 17);
  assert.deepStrictEqual(r.tags, []);
});
test('resistance halves (rounded down), immunity zeroes, vulnerability doubles', () => {
  const d = D.parseDefenses(sb('fire', 'poison', 'radiant'));
  assert.strictEqual(D.resolveTargetDamage([{ amount: 9, type: 'fire' }], d).total, 4);
  assert.strictEqual(D.resolveTargetDamage([{ amount: 9, type: 'poison' }], d).total, 0);
  assert.strictEqual(D.resolveTargetDamage([{ amount: 9, type: 'radiant' }], d).total, 18);
  assert.deepStrictEqual(D.resolveTargetDamage([{ amount: 9, type: 'fire' }], d).tags, ['resistant to fire']);
  assert.deepStrictEqual(D.resolveTargetDamage([{ amount: 9, type: 'poison' }], d).tags, ['immune to poison']);
  assert.deepStrictEqual(D.resolveTargetDamage([{ amount: 9, type: 'radiant' }], d).tags, ['vulnerable to radiant']);
});
test('resistance and vulnerability to the same type cancel out', () => {
  const d = D.parseDefenses(sb('fire', '', 'fire'));
  const r = D.resolveTargetDamage([{ amount: 9, type: 'fire' }], d);
  assert.strictEqual(r.total, 9);
});
test('mixed parts apply defenses per type', () => {
  const d = D.parseDefenses(sb('', 'fire'));
  const r = D.resolveTargetDamage([{ amount: 8, type: 'slashing' }, { amount: 9, type: 'fire' }], d);
  assert.strictEqual(r.total, 8);
  assert.deepStrictEqual(r.tags, ['immune to fire']);
});
test('save for half halves before resistance', () => {
  const d = D.parseDefenses(sb('fire'));
  const r = D.resolveTargetDamage([{ amount: 29, type: 'fire' }], d, { saved: true, onSave: 'half' });
  assert.strictEqual(r.total, 7); // 29 → 14 → 7
  assert.deepStrictEqual(r.tags, ['saved', 'resistant to fire']);
});
test('save for half halves each part separately', () => {
  const r = D.resolveTargetDamage([{ amount: 9, type: 'fire' }, { amount: 9, type: 'radiant' }], none, { saved: true, onSave: 'half' });
  assert.strictEqual(r.total, 8);
});
test('save for none zeroes the damage', () => {
  const r = D.resolveTargetDamage([{ amount: 12, type: 'radiant' }], none, { saved: true, onSave: 'none' });
  assert.strictEqual(r.total, 0);
  assert.deepStrictEqual(r.tags, ['saved']);
});
test('not saved means full damage even on a save effect', () => {
  assert.strictEqual(D.resolveTargetDamage([{ amount: 12, type: 'fire' }], none, { saved: false, onSave: 'half' }).total, 12);
});
test('conditional defenses are not applied but warn for matching types', () => {
  const d = D.parseDefenses(sb('bludgeoning, piercing, slashing (from nonmagical attacks)'));
  const r = D.resolveTargetDamage([{ amount: 10, type: 'slashing' }, { amount: 4, type: 'fire' }], d);
  assert.strictEqual(r.total, 14);
  assert.deepStrictEqual(r.warnings, ['resists slashing from nonmagical attacks']);
  assert.deepStrictEqual(D.resolveTargetDamage([{ amount: 4, type: 'fire' }], d).warnings, []);
});
test('heal parts have no type and ignore defenses', () => {
  const d = D.parseDefenses(sb('fire', 'poison'));
  assert.strictEqual(D.resolveTargetDamage([{ amount: 9, type: '' }], d).total, 9);
});

// ── sanitizeRequest ──
const ctx = { charIds: ['c1', 'c2'], ownsCompanion: (charId, compId) => charId === 'c1' && compId === 'k1' };
const good = (over = {}) => ({
  uid: 'u1', charId: 'c1', shareToken: 'tok', combatId: 'cmb', fromCompanionId: '', fromName: 'Thorn',
  kind: 'damage', note: 'Fireball', save: { onSave: 'half', ability: 'DEX', dc: 15 },
  targets: [{ cbId: 'a', parts: [{ amount: 28, type: 'fire' }] }, { cbId: 'b', parts: [{ amount: 28, type: 'fire' }] }],
  ...over,
});
test('a good request comes back clean', () => {
  const r = D.sanitizeRequest(good(), ctx);
  assert.ok(r);
  assert.strictEqual(r.kind, 'damage');
  assert.strictEqual(r.targets.length, 2);
  assert.deepStrictEqual(r.save, { onSave: 'half', ability: 'DEX', dc: 15 });
  assert.strictEqual(r.note, 'Fireball');
});
test('a heal request keeps one untyped part per target and drops save', () => {
  const r = D.sanitizeRequest(good({ kind: 'heal', save: { onSave: 'half', ability: '', dc: 0 }, targets: [{ cbId: 'a', parts: [{ amount: 9, type: '' }] }] }), ctx);
  assert.ok(r);
  assert.strictEqual(r.save, null);
  assert.deepStrictEqual(r.targets[0].parts, [{ amount: 9, type: '' }]);
});
test('bad requests are rejected', () => {
  const bad = [
    good({ kind: 'steal' }),
    good({ charId: 'cX' }),
    good({ fromCompanionId: 'k2' }),
    good({ targets: [] }),
    good({ targets: Array.from({ length: 21 }, (_, i) => ({ cbId: 'x' + i, parts: [{ amount: 1, type: 'fire' }] })) }),
    good({ targets: [{ cbId: 'a', parts: Array.from({ length: 5 }, () => ({ amount: 1, type: 'fire' })) }] }),
    good({ targets: [{ cbId: 'a', parts: [{ amount: 1000, type: 'fire' }] }] }),
    good({ targets: [{ cbId: 'a', parts: [{ amount: -1, type: 'fire' }] }] }),
    good({ targets: [{ cbId: 'a', parts: [{ amount: 2.5, type: 'fire' }] }] }),
    good({ targets: [{ cbId: 'a', parts: [{ amount: 1, type: 'banana' }] }] }),
    good({ targets: [{ cbId: 'a', parts: [] }] }),
    good({ save: { onSave: 'double', ability: 'DEX', dc: 15 } }),
    good({ save: { onSave: 'half', ability: 'LCK', dc: 15 } }),
    good({ save: { onSave: 'half', ability: 'DEX', dc: 31 } }),
    good({ kind: 'heal', targets: [{ cbId: 'a', parts: [{ amount: 1, type: 'fire' }] }] }),
    good({ kind: 'heal', targets: [{ cbId: 'a', parts: [{ amount: 1, type: '' }, { amount: 1, type: '' }] }] }),
    null, 'nope', 42,
  ];
  bad.forEach((b, i) => assert.strictEqual(D.sanitizeRequest(b, ctx), null, 'case ' + i));
});
test('a companion the character owns is accepted', () => {
  assert.ok(D.sanitizeRequest(good({ fromCompanionId: 'k1' }), ctx));
});
test('long text is cut short and non-strings are dropped', () => {
  const r = D.sanitizeRequest(good({ note: 'x'.repeat(300), fromName: 'y'.repeat(300) }), ctx);
  assert.strictEqual(r.note.length, 100);
  assert.strictEqual(r.fromName.length, 60);
  assert.strictEqual(D.sanitizeRequest(good({ note: { evil: 1 } }), ctx).note, '');
});
test('duplicate targets are merged away', () => {
  const r = D.sanitizeRequest(good({ targets: [{ cbId: 'a', parts: [{ amount: 1, type: 'fire' }] }, { cbId: 'a', parts: [{ amount: 2, type: 'fire' }] }] }), ctx);
  assert.strictEqual(r.targets.length, 1);
});

// ── summarizeRequest ──
test('summary names sender, note and each target', () => {
  const req = D.sanitizeRequest(good(), ctx);
  const text = D.summarizeRequest(req, [
    { cbId: 'a', name: 'Goblin 1', total: 28, tags: [] },
    { cbId: 'b', name: 'Goblin 2', total: 14, tags: ['saved'] },
  ]);
  assert.strictEqual(text, 'Thorn (Fireball): Goblin 1 takes 28 fire; Goblin 2 takes 14 fire (saved)');
});
test('mixed-type summary lists totals with tags, heals say heals', () => {
  const req = D.sanitizeRequest(good({ note: '', targets: [{ cbId: 'a', parts: [{ amount: 8, type: 'slashing' }, { amount: 9, type: 'fire' }] }] }), ctx);
  assert.strictEqual(D.summarizeRequest(req, [{ cbId: 'a', name: 'Ogre', total: 8, tags: ['immune to fire'] }]),
    'Thorn: Ogre takes 8 slashing + fire (immune to fire)');
  const heal = D.sanitizeRequest(good({ kind: 'heal', fromName: 'Mira', note: 'Cure Wounds', save: null, targets: [{ cbId: 'a', parts: [{ amount: 9, type: '' }] }] }), ctx);
  assert.strictEqual(D.summarizeRequest(heal, [{ cbId: 'a', name: 'Thorn', total: 9, tags: [] }]), 'Mira (Cure Wounds): Thorn heals 9');
});

console.log(`\n${passed} passed`);
