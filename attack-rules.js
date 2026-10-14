// ── Attack Rules ─────────────────────────────────────────────────────────────
// Pure logic (no DOM) for attack rows that keep up with the character: weapon attack bonus and
// damage from proficiency and ability scores, Monk martial arts, and cantrip damage by level.

const _AR_WEAPON_TYPES = ['melee-str', 'melee-finesse', 'ranged-dex'];
const _AR_SAVES = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };

function _arMod(score) { return Math.floor(((parseInt(score) || 10) - 10) / 2); }
function _arPB(level) { return Math.ceil((parseInt(level) || 1) / 4) + 1; }
function _arSigned(n) { return (n >= 0 ? '+' : '') + n; }

// Martial Arts die by Monk level: 2024 d6/d8/d10/d12, 2014 d4/d6/d8/d10 (levels 1/5/11/17)
function _arMartialSides(monkLevel, edition) {
  const tier = cantripTier(monkLevel);
  return (edition === '2014' ? [4, 6, 8, 10] : [6, 8, 10, 12])[tier];
}

// 2024: simple melee, or martial melee with Light. 2014: shortswords, or simple melee that isn't two-handed or heavy.
function isMonkWeapon(w, edition) {
  if (!w || w.weapon_type === 'ranged-dex') return false;
  const props = (w.properties || []).map(p => String(p).toLowerCase());
  if (edition === '2014') {
    return w.name === 'Shortsword'
      || (w.category === 'simple' && !props.some(p => p.startsWith('two-handed') || p === 'heavy'));
  }
  return w.category === 'simple' || (w.category === 'martial' && props.includes('light'));
}

// atk: { weaponType, dice, dmgType, unarmed }
// ctx: { level, abilities, edition, monkLevel, weapon (WEAPONS_DATA entry or null) }
function weaponStats(atk, ctx) {
  const abs = ctx.abilities || {};
  const str = _arMod(abs.str), dex = _arMod(abs.dex);
  const monk = (ctx.monkLevel || 0) > 0 && (atk.unarmed || isMonkWeapon(ctx.weapon, ctx.edition));
  let m;
  if (atk.weaponType === 'ranged-dex') m = dex;
  else if (atk.weaponType === 'melee-finesse' || monk) m = Math.max(str, dex);
  else m = str;
  const bonus = _arSigned(_arPB(ctx.level) + m);
  const type = atk.dmgType ? ' ' + atk.dmgType : '';

  let dice = atk.dice;
  if (atk.unarmed) {
    if (!monk) return { bonus, damage: Math.max(0, 1 + str) + type };
    dice = '1d' + _arMartialSides(ctx.monkLevel, ctx.edition);
  } else if (monk) {
    const d = String(dice).match(/^1d(\d+)$/);
    const sides = _arMartialSides(ctx.monkLevel, ctx.edition);
    if (d && +d[1] < sides) dice = '1d' + sides;
  }
  if (!dice || dice === '—') return { bonus, damage: '—' };
  if (/^\d+$/.test(dice)) return { bonus, damage: Math.max(0, +dice + m) + type };
  return { bonus, damage: dice + (m ? _arSigned(m) : '') + type };
}

// 0 below level 5, 1 at 5, 2 at 11, 3 at 17
function cantripTier(level) {
  const lv = parseInt(level) || 1;
  return lv >= 17 ? 3 : lv >= 11 ? 2 : lv >= 5 ? 1 : 0;
}

// info: { dice: [4 tiers], type, attack, save, extra: { dice, label }, beams }
// ctx: { level, abilityMod, atkBonus, dcBonus }
function cantripStats(info, ctx) {
  const tier = cantripTier(ctx.level), pb = _arPB(ctx.level), m = ctx.abilityMod || 0;
  const save = info.save ? (_AR_SAVES[info.save] || String(info.save).toUpperCase()) : '';
  const bonus = save ? `DC ${8 + pb + m + (ctx.dcBonus || 0)}` : _arSigned(pb + m + (ctx.atkBonus || 0));
  let damage;
  if (info.beams) damage = `${info.dice[0]} ${info.type}` + (tier ? ` ×${tier + 1} beams` : '');
  else {
    damage = `${info.dice[tier]} ${info.type}`;
    if (info.extra) damage += ` (${info.extra.dice[tier]} ${info.extra.label})`;
  }
  return { bonus, damage, save };
}

// "2d6 slashing" → { dice, dmgType }; anything with its own modifier or extra parts → null
function splitDamage(s) {
  const m = String(s || '').trim().match(/^(\d+(?:d\d+)?)\s+([a-z]+)$/i);
  return m ? { dice: m[1], dmgType: m[2].toLowerCase() } : null;
}

// Rows the weapon picker made before attacks kept up with the character: a weapon type and bare dice.
// Rows already marked auto/manual, and anything typed with its own modifier, are left alone.
function autoWeaponFrom(atk) {
  if (!atk || atk.auto !== undefined || !_AR_WEAPON_TYPES.includes(atk.weaponType)) return null;
  if (atk._unarmed) return { unarmed: true, dmgType: 'bludgeoning' };
  if (String(atk.damage || '').trim() === '—') return { dice: '—', dmgType: '' };
  return splitDamage(atk.damage);
}

if (typeof module !== 'undefined') {
  module.exports = { isMonkWeapon, weaponStats, cantripTier, cantripStats, splitDamage, autoWeaponFrom };
}
