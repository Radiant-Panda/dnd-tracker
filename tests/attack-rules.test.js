// Run: node tests/attack-rules.test.js
const assert = require('assert');
const path = require('path');
const A = require(path.join(__dirname, '..', 'attack-rules.js'));

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }
const abil = (str, dex) => ({ str, dex, con: 10, int: 10, wis: 10, cha: 10 });
const LONGSWORD = { name: 'Longsword', category: 'martial', dmg: '1d8 slashing', properties: ['Versatile'], weapon_type: 'melee-str' };
const SHORTSWORD = { name: 'Shortsword', category: 'martial', dmg: '1d6 piercing', properties: ['Finesse', 'Light'], weapon_type: 'melee-finesse' };
const SCIMITAR = { name: 'Scimitar', category: 'martial', dmg: '1d6 slashing', properties: ['Finesse', 'Light'], weapon_type: 'melee-finesse' };
const QSTAFF = { name: 'Quarterstaff', category: 'simple', dmg: '1d6 bludgeoning', properties: ['Versatile'], weapon_type: 'melee-str' };
const GREATCLUB = { name: 'Greatclub', category: 'simple', dmg: '1d8 bludgeoning', properties: ['Two-Handed'], weapon_type: 'melee-str' };
const SHORTBOW = { name: 'Shortbow', category: 'simple', dmg: '1d6 piercing', properties: ['Ammunition', 'Two-Handed'], weapon_type: 'ranged-dex' };
const wctx = (o = {}) => ({ level: 1, abilities: abil(16, 14), edition: '2024', monkLevel: 0, weapon: null, ...o });

// ── weapon attacks ──
test('melee weapons use STR for attack and damage', () => {
  const r = A.weaponStats({ weaponType: 'melee-str', dice: '1d8', dmgType: 'slashing' }, wctx());
  assert.strictEqual(r.bonus, '+5'); // PB 2 + STR 3
  assert.strictEqual(r.damage, '1d8+3 slashing');
});
test('ranged weapons use DEX', () => {
  const r = A.weaponStats({ weaponType: 'ranged-dex', dice: '1d6', dmgType: 'piercing' }, wctx());
  assert.strictEqual(r.bonus, '+4');
  assert.strictEqual(r.damage, '1d6+2 piercing');
});
test('finesse weapons use the better of STR and DEX', () => {
  const r = A.weaponStats({ weaponType: 'melee-finesse', dice: '1d6', dmgType: 'piercing' }, wctx({ abilities: abil(10, 18) }));
  assert.strictEqual(r.bonus, '+6');
  assert.strictEqual(r.damage, '1d6+4 piercing');
});
test('levelling up raises the proficiency bonus', () => {
  const atk = { weaponType: 'melee-str', dice: '1d8', dmgType: 'slashing' };
  assert.strictEqual(A.weaponStats(atk, wctx({ level: 4 })).bonus, '+5');
  assert.strictEqual(A.weaponStats(atk, wctx({ level: 5 })).bonus, '+6');
  assert.strictEqual(A.weaponStats(atk, wctx({ level: 9 })).bonus, '+7');
  assert.strictEqual(A.weaponStats(atk, wctx({ level: 17 })).bonus, '+9');
});
test('a better ability score raises both bonus and damage', () => {
  const atk = { weaponType: 'melee-str', dice: '1d8', dmgType: 'slashing' };
  const r = A.weaponStats(atk, wctx({ abilities: abil(18, 10) }));
  assert.strictEqual(r.bonus, '+6');
  assert.strictEqual(r.damage, '1d8+4 slashing');
});
test('a zero or negative modifier is written plainly', () => {
  const atk = { weaponType: 'melee-str', dice: '2d6', dmgType: 'slashing' };
  assert.strictEqual(A.weaponStats(atk, wctx({ abilities: abil(10, 10) })).damage, '2d6 slashing');
  const weak = A.weaponStats(atk, wctx({ abilities: abil(8, 10) }));
  assert.strictEqual(weak.damage, '2d6-1 slashing');
  assert.strictEqual(weak.bonus, '+1');
});
test('flat-damage weapons (Blowgun) add the modifier to the flat number', () => {
  const r = A.weaponStats({ weaponType: 'ranged-dex', dice: '1', dmgType: 'piercing' }, wctx());
  assert.strictEqual(r.damage, '3 piercing');
});
test('a weapon without damage (Net) keeps a dash', () => {
  const r = A.weaponStats({ weaponType: 'ranged-dex', dice: '—', dmgType: '' }, wctx());
  assert.strictEqual(r.damage, '—');
});

// ── unarmed strikes and monks ──
test('a non-monk unarmed strike deals 1 + STR', () => {
  const r = A.weaponStats({ weaponType: 'melee-str', unarmed: true, dmgType: 'bludgeoning' }, wctx());
  assert.strictEqual(r.bonus, '+5');
  assert.strictEqual(r.damage, '4 bludgeoning');
});
test('an unarmed strike never deals less than 0', () => {
  const r = A.weaponStats({ weaponType: 'melee-str', unarmed: true, dmgType: 'bludgeoning' }, wctx({ abilities: abil(6, 10) }));
  assert.strictEqual(r.damage, '0 bludgeoning');
});
test('a 2024 monk unarmed strike grows with monk level and uses DEX', () => {
  const atk = { weaponType: 'melee-str', unarmed: true, dmgType: 'bludgeoning' };
  const c = o => wctx({ abilities: abil(10, 16), ...o });
  assert.strictEqual(A.weaponStats(atk, c({ level: 1, monkLevel: 1 })).damage, '1d6+3 bludgeoning');
  assert.strictEqual(A.weaponStats(atk, c({ level: 1, monkLevel: 1 })).bonus, '+5');
  assert.strictEqual(A.weaponStats(atk, c({ level: 5, monkLevel: 5 })).damage, '1d8+3 bludgeoning');
  assert.strictEqual(A.weaponStats(atk, c({ level: 11, monkLevel: 11 })).damage, '1d10+3 bludgeoning');
  assert.strictEqual(A.weaponStats(atk, c({ level: 17, monkLevel: 17 })).damage, '1d12+3 bludgeoning');
});
test('a 2014 monk uses the older martial arts dice', () => {
  const atk = { weaponType: 'melee-str', unarmed: true, dmgType: 'bludgeoning' };
  const c = lv => wctx({ edition: '2014', abilities: abil(10, 16), level: lv, monkLevel: lv });
  assert.strictEqual(A.weaponStats(atk, c(1)).damage, '1d4+3 bludgeoning');
  assert.strictEqual(A.weaponStats(atk, c(5)).damage, '1d6+3 bludgeoning');
  assert.strictEqual(A.weaponStats(atk, c(11)).damage, '1d8+3 bludgeoning');
  assert.strictEqual(A.weaponStats(atk, c(17)).damage, '1d10+3 bludgeoning');
});
test('the martial arts die uses monk level, not total level', () => {
  const atk = { weaponType: 'melee-str', unarmed: true, dmgType: 'bludgeoning' };
  const r = A.weaponStats(atk, wctx({ abilities: abil(10, 16), level: 6, monkLevel: 2 }));
  assert.strictEqual(r.damage, '1d6+3 bludgeoning');
  assert.strictEqual(r.bonus, '+6'); // PB from total level 6
});
test('which weapons are monk weapons depends on the edition', () => {
  assert.strictEqual(A.isMonkWeapon(QSTAFF, '2024'), true);
  assert.strictEqual(A.isMonkWeapon(SCIMITAR, '2024'), true);   // martial melee + Light
  assert.strictEqual(A.isMonkWeapon(LONGSWORD, '2024'), false);
  assert.strictEqual(A.isMonkWeapon(GREATCLUB, '2024'), true);   // any simple melee in 2024
  assert.strictEqual(A.isMonkWeapon(SHORTBOW, '2024'), false);
  assert.strictEqual(A.isMonkWeapon(SHORTSWORD, '2014'), true);
  assert.strictEqual(A.isMonkWeapon(SCIMITAR, '2014'), false);
  assert.strictEqual(A.isMonkWeapon(GREATCLUB, '2014'), false);  // two-handed
  assert.strictEqual(A.isMonkWeapon(QSTAFF, '2014'), true);
  assert.strictEqual(A.isMonkWeapon(null, '2024'), false);
});
test('monks use DEX and the martial arts die with monk weapons when it is bigger', () => {
  const atk = { weaponType: 'melee-str', dice: '1d6', dmgType: 'bludgeoning' };
  const c = lv => wctx({ abilities: abil(10, 16), level: lv, monkLevel: lv, weapon: QSTAFF });
  assert.strictEqual(A.weaponStats(atk, c(1)).damage, '1d6+3 bludgeoning');
  assert.strictEqual(A.weaponStats(atk, c(1)).bonus, '+5');
  assert.strictEqual(A.weaponStats(atk, c(5)).damage, '1d8+3 bludgeoning');
  const twoHanded = A.weaponStats({ ...atk, dice: '1d8' }, c(1)); // the bigger weapon die stays
  assert.strictEqual(twoHanded.damage, '1d8+3 bludgeoning');
});
test('non-monk weapons get no monk benefits', () => {
  const atk = { weaponType: 'melee-str', dice: '1d8', dmgType: 'slashing' };
  const r = A.weaponStats(atk, wctx({ abilities: abil(10, 16), level: 5, monkLevel: 5, weapon: LONGSWORD }));
  assert.strictEqual(r.damage, '1d8 slashing');
  assert.strictEqual(r.bonus, '+3');
});

// ── cantrips ──
const FIRE_BOLT = { dice: ['1d10', '2d10', '3d10', '4d10'], type: 'fire', attack: true };
const SACRED_FLAME = { dice: ['1d8', '2d8', '3d8', '4d8'], type: 'radiant', save: 'dex' };
const TOLL = { dice: ['1d8', '2d8', '3d8', '4d8'], type: 'necrotic', save: 'wis', extra: { dice: ['1d12', '2d12', '3d12', '4d12'], label: 'if it is hurt' } };
const EB = { dice: ['1d10', '1d10', '1d10', '1d10'], type: 'force', attack: true, beams: true };
const cctx = (o = {}) => ({ level: 1, abilityMod: 3, atkBonus: 0, dcBonus: 0, ...o });
test('cantrip tiers change at levels 5, 11 and 17', () => {
  assert.deepStrictEqual([1, 4, 5, 10, 11, 16, 17, 20].map(A.cantripTier), [0, 0, 1, 1, 2, 2, 3, 3]);
});
test('attack cantrips show the spell attack bonus and scaled dice', () => {
  assert.deepStrictEqual(A.cantripStats(FIRE_BOLT, cctx()), { bonus: '+5', damage: '1d10 fire', save: '' });
  assert.deepStrictEqual(A.cantripStats(FIRE_BOLT, cctx({ level: 5 })), { bonus: '+6', damage: '2d10 fire', save: '' });
  assert.strictEqual(A.cantripStats(FIRE_BOLT, cctx({ level: 17 })).damage, '4d10 fire');
});
test('save cantrips show the save and DC instead of a bonus', () => {
  const r = A.cantripStats(SACRED_FLAME, cctx({ level: 11 }));
  assert.strictEqual(r.bonus, 'DC 15'); // 8 + PB 4 + 3
  assert.strictEqual(r.save, 'DEX');
  assert.strictEqual(r.damage, '3d8 radiant');
});
test('item bonuses add to cantrip attack and DC', () => {
  assert.strictEqual(A.cantripStats(FIRE_BOLT, cctx({ atkBonus: 1 })).bonus, '+6');
  assert.strictEqual(A.cantripStats(SACRED_FLAME, cctx({ dcBonus: 2 })).bonus, 'DC 15');
});
test('a second damage line is shown alongside', () => {
  assert.strictEqual(A.cantripStats(TOLL, cctx({ level: 5 })).damage, '2d8 necrotic (2d12 if it is hurt)');
});
test('Eldritch Blast scales by beams', () => {
  assert.strictEqual(A.cantripStats(EB, cctx()).damage, '1d10 force');
  assert.strictEqual(A.cantripStats(EB, cctx({ level: 5 })).damage, '1d10 force ×2 beams');
  assert.strictEqual(A.cantripStats(EB, cctx({ level: 17 })).damage, '1d10 force ×4 beams');
});

// ── which saved rows become automatic ──
test('weapon-picker rows (bare dice) convert', () => {
  assert.deepStrictEqual(A.autoWeaponFrom({ weaponType: 'melee-str', damage: '1d8 slashing', bonus: '+5' }), { dice: '1d8', dmgType: 'slashing' });
  assert.deepStrictEqual(A.autoWeaponFrom({ weaponType: 'ranged-dex', damage: '1 piercing' }), { dice: '1', dmgType: 'piercing' });
  assert.deepStrictEqual(A.autoWeaponFrom({ weaponType: 'melee-str', damage: '—', name: 'Net' }), { dice: '—', dmgType: '' });
});
test('unarmed strikes convert whatever their stored damage', () => {
  assert.deepStrictEqual(A.autoWeaponFrom({ weaponType: 'melee-str', damage: '4 bludgeoning', _unarmed: true }), { unarmed: true, dmgType: 'bludgeoning' });
  assert.deepStrictEqual(A.autoWeaponFrom({ weaponType: 'melee-str', damage: '1d8 bludgeoning', _unarmed: true }), { unarmed: true, dmgType: 'bludgeoning' });
});
test('typed rows with their own modifiers stay manual', () => {
  assert.strictEqual(A.autoWeaponFrom({ weaponType: 'melee-str', damage: '1d8+3 slashing' }), null);
  assert.strictEqual(A.autoWeaponFrom({ weaponType: 'melee-str', damage: '1d8 + 1d6 fire' }), null);
  assert.strictEqual(A.autoWeaponFrom({ weaponType: '', damage: '1d8 slashing' }), null);
  assert.strictEqual(A.autoWeaponFrom({ weaponType: 'spell', damage: '1d10 fire' }), null);
  assert.strictEqual(A.autoWeaponFrom({ weaponType: 'melee-str', damage: '' }), null);
});
test('rows already marked auto or manual are left alone', () => {
  assert.strictEqual(A.autoWeaponFrom({ weaponType: 'melee-str', damage: '1d8 slashing', auto: false }), null);
  assert.strictEqual(A.autoWeaponFrom({ weaponType: 'melee-str', damage: '1d8 slashing', auto: true }), null);
});
test('an unmodified damage string is split into dice and type', () => {
  assert.deepStrictEqual(A.splitDamage('2d6 slashing'), { dice: '2d6', dmgType: 'slashing' });
  assert.deepStrictEqual(A.splitDamage('1 piercing'), { dice: '1', dmgType: 'piercing' });
  assert.strictEqual(A.splitDamage('2d6+3 slashing'), null);
});

console.log(`\n${passed} passed`);
