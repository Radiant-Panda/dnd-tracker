// Companion templates: formulas from 5etools creatures ("2 + your Intelligence modifier + five times
// your artificer level") become small expressions ("2 + INT + 5*LVL") that are worked out against the
// owner. Pure — no DOM, no app globals — so it runs in Node tests and in the browser.

const _CT_NUMWORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twice: 2 };
const _CT_ABIL = { strength: 'STR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA' };

function variantVar(name) { return 'V_' + String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }

// Safe evaluator: numbers, names, + - * /, parentheses, max/min/floor. Unknown names → null
// (except V_ names, which are 0 unless chosen). Results round down.
function evalExpr(expr, vars) {
  const toks = String(expr).match(/\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_]*|[-+*/(),]|\S/g) || [];
  let i = 0;
  const peek = () => toks[i], next = () => toks[i++];
  function primary() {
    const t = next();
    if (t === undefined) throw 0;
    if (/^\d/.test(t)) return parseFloat(t);
    if (t === '(') { const v = sum(); if (next() !== ')') throw 0; return v; }
    if (t === '-') return -primary();
    if (t === '+') return primary();
    if (/^(max|min|floor)$/.test(t)) {
      if (next() !== '(') throw 0;
      const args = [sum()];
      while (peek() === ',') { next(); args.push(sum()); }
      if (next() !== ')') throw 0;
      return t === 'floor' ? Math.floor(args[0]) : Math[t](...args);
    }
    if (/^[A-Za-z_]/.test(t)) {
      if (vars && Object.prototype.hasOwnProperty.call(vars, t) && Number.isFinite(vars[t])) return vars[t];
      if (t.startsWith('V_')) return 0;
      throw 0;
    }
    throw 0;
  }
  function product() { let v = primary(); while (peek() === '*' || peek() === '/') { const op = next(), r = primary(); v = op === '*' ? v * r : v / r; } return v; }
  function sum() { let v = product(); while (peek() === '+' || peek() === '-') { const op = next(), r = product(); v = op === '+' ? v + r : v - r; } return v; }
  try { const v = sum(); if (i !== toks.length || !Number.isFinite(v)) return null; return Math.floor(v); } catch (e) { return null; }
}

// "Land and Water" → (V_land + V_water)
function _ctVariantSum(label) {
  const names = String(label).split(/\s*(?:,|\band\b)\s*/).filter(Boolean).map(variantVar);
  return names.length > 1 ? '(' + names.join(' + ') + ')' : names[0];
}

function _ctTerm(t) {
  t = t.trim().replace(/^\((.*)\)$/, '$1').trim();
  let m;
  if (/^\d+$/.test(t)) return t;
  if ((m = t.match(/^(\d+) \((.+?) only\)$/i))) return `${m[1]}*${_ctVariantSum(m[2])}`;
  if ((m = t.match(/^(?:(\w+) (?:times |\* ?))?your (\w+) level$/i))) {
    const n = m[1] ? (_CT_NUMWORDS[m[1].toLowerCase()] || parseInt(m[1])) : 1;
    return n ? (n === 1 ? 'LVL' : `${n}*LVL`) : null;
  }
  if ((m = t.match(/^your (\w+) modifier$/i)) && _CT_ABIL[m[1].toLowerCase()]) return _CT_ABIL[m[1].toLowerCase()];
  if (/^(pb|your proficiency bonus|proficiency bonus)$/i.test(t)) return 'PB';
  if ((m = t.match(/^pb ?\* ?(\d+)$/i))) return `PB*${m[1]}`;
  if (/^(the level of the spell|the spell's level)$/i.test(t)) return 'SL';
  if ((m = t.match(/^(\d+) for each spell level above (\d+)(?:st|nd|rd|th)?$/i))) return `${m[1]}*max(0, SL - ${m[2]})`;
  if ((m = t.match(/^(\d+) per spell level$/i))) return m[1] === '1' ? 'SL' : `${m[1]}*SL`;
  return null;
}

// Splits on "+" outside parentheses
function _ctSplitPlus(s) {
  const out = []; let depth = 0, cur = '';
  for (const c of s) {
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === '+' && depth === 0) { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(x => x !== '');
}

function parseFormula(text) {
  if (text === null || text === undefined) return null;
  let t = String(text).replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
  const out = {};
  const hd = t.match(/\[(d\d+)s?\]/i);
  if (hd) {
    out.hitDie = hd[1].toLowerCase();
    const cnt = t.match(/equal to (your \w+ level|the spell's level|the level of the spell)/i);
    if (cnt) out.hitDiceExpr = /your/i.test(cnt[1]) ? 'LVL' : 'SL';
  }
  t = t.replace(/\([^()]*hit dice[^()]*\)/ig, '').replace(/\([^()]*armor\)/ig, '').trim();
  t = t.replace(/\bplus\b/gi, '+').replace(/×/g, '*').replace(/\s+/g, ' ').trim();
  // Size list: "10 (Medium or smaller), 20 (Large), 40 (Huge)"
  if (/^\d+ \([^)]+\)(, \d+ \([^)]+\))+$/.test(t)) {
    out.expr = [...t.matchAll(/(\d+) \(([^)]+)\)/g)].map(m => `${m[1]}*${variantVar(m[2])}`).join(' + ');
    return out;
  }
  // Alternatives: "20 (Air only) or 30 (Land and Water only) + rest"
  const alt = t.match(/^(\d+ \([^)]+ only\)(?: or \d+ \([^)]+ only\))+)(.*)$/i);
  let head = null;
  if (alt) {
    head = '(' + [...alt[1].matchAll(/(\d+) \(([^)]+) only\)/gi)].map(m => `${m[1]}*${_ctVariantSum(m[2])}`).join(' + ') + ')';
    t = alt[2].replace(/^\s*\+\s*/, '');
  }
  const terms = t ? _ctSplitPlus(t).map(_ctTerm) : [];
  if (terms.some(x => x === null)) return null;
  const all = (head ? [head] : []).concat(terms);
  if (!all.length) return null;
  out.expr = all.join(' + ');
  return out;
}

// Saves, skills, passive: "+1 plus PB", "+0 plus PB × 2", "10 + (PB × 2)", "+5"
function parseBonusText(text) {
  const f = parseFormula(String(text).trim().replace(/^\+/, ''));
  return f ? f.expr : null;
}

// "{{expr}}" → number, "{{+expr}}" → signed number, unknown → "?"
function fillTokens(text, vars) {
  return String(text == null ? '' : text).replace(/\{\{(\+?)([^{}]+)\}\}/g, (_, signed, expr) => {
    const v = evalExpr(expr, vars);
    if (v === null) return '?';
    return signed ? (v >= 0 ? '+' + v : String(v)) : String(v);
  });
}

// ── Working a template out against its owner ──────────────────────────────
const OWN_TEMPLATE_KEY_RE = /^[A-Za-z0-9 ,()-]+\|[A-Za-z0-9]+$/;   // "Steel Defender|TCE"
const OWN_COMPANION_OVERRIDES = ['ac', 'maxHP', 'speed', 'initBonus', 'attackBonus', 'saveDC'];
const _CT_CAST_ABILITY = { Artificer: 'int', Wizard: 'int', Cleric: 'wis', Druid: 'wis', Ranger: 'wis', Bard: 'cha',
  Paladin: 'cha', Sorcerer: 'cha', Warlock: 'cha' };
const _ctMod = (ch, ab) => Math.floor((((ch.abilities || {})[ab]) || 10) / 2) - 5;
function _ctClasses(ch) {
  return ch.classes && ch.classes.length ? ch.classes : [{ class: ch.class, subclass: ch.subclass, level: parseInt(ch.level) || 1 }];
}

// The variables a template's formulas use: PB, the granting class's level, ability mods, spell level,
// spell attack / save DC (from the granting class, else the first casting class, else INT), the variant
function companionContext(ch, t, oc) {
  const level = Math.max(1, Math.min(20, parseInt(ch.level) || 1));
  const PB = Math.ceil(level / 4) + 1;
  const classes = _ctClasses(ch);
  const gCls = t && t.grantedBy && t.grantedBy.cls;
  const gEntry = gCls && classes.find(c => c.class === gCls);
  const caster = gCls && _CT_CAST_ABILITY[gCls] ? gCls : (classes.find(c => _CT_CAST_ABILITY[c.class]) || {}).class;
  const castMod = _ctMod(ch, _CT_CAST_ABILITY[caster] || 'int');
  const bonus = ch.spellBonus || {};
  const v = { PB, LVL: gEntry ? (parseInt(gEntry.level) || 1) : level,
    SL: (oc && oc.spellLevel) || (t && t.grantedBy && t.grantedBy.spellLevel) || 0,
    STR: _ctMod(ch, 'str'), DEX: _ctMod(ch, 'dex'), CON: _ctMod(ch, 'con'), INT: _ctMod(ch, 'int'), WIS: _ctMod(ch, 'wis'), CHA: _ctMod(ch, 'cha') };
  v.SPELLATK = PB + castMod + (parseInt(bonus.atk) || 0);
  v.SPELLDC = 8 + PB + castMod + (parseInt(bonus.dc) || 0);
  if (oc && oc.variant) v[variantVar(oc.variant)] = 1;
  v._labels = { LVL: `${gCls || 'level'} ${v.LVL}`, SL: `spell level ${v.SL}`, PB: `PB ${PB}` };
  return v;
}

// "2 + INT + 5*LVL" → "2 + INT 3 + 5 × Artificer 7"
function _ctExplain(expr, vars) {
  const label = name => (vars._labels && vars._labels[name]) || `${name} ${vars[name]}`;
  return _ctSplitPlus(expr).map(term => {
    if (/\bV_|max\(/.test(term)) { const n = evalExpr(term, vars); return n ? String(n) : null; }
    return term.replace(/\*/g, ' × ').replace(/\b(LVL|SL|PB|STR|DEX|CON|INT|WIS|CHA)\b/g, label);
  }).filter(Boolean).join(' + ');
}

function _ctFillSection(arr, vars, o) {
  return (arr || []).map(e => {
    let desc = fillTokens(e.desc, vars);
    if (o.attackBonus !== undefined) desc = desc.replace(/[+-]\d+ to hit/g, (o.attackBonus >= 0 ? '+' : '') + o.attackBonus + ' to hit');
    if (o.saveDC !== undefined) desc = desc.replace(/\bDC \d+/g, 'DC ' + o.saveDC);
    return { name: fillTokens(e.name, vars), desc };
  });
}

// The live sheet: numbers worked out, GM overrides applied, the variant's own traits and actions used
function resolveCompanion(t, oc, vars) {
  const o = (oc && oc.overrides) || {};
  const vd = (t.variantData && oc && oc.variant && t.variantData[oc.variant]) || {};
  const acF = vd.acF || t.acF, hpF = vd.hpF || t.hpF;
  const num = f => f.value !== undefined ? f.value : (f.expr ? evalExpr(f.expr, vars) : null);
  const calcAC = num(acF), calcHP = num(hpF);
  const unresolved = [];
  if (calcAC === null && o.ac === undefined) unresolved.push('ac');
  if (calcHP === null && o.maxHP === undefined) unresolved.push('maxHP');
  const ac = o.ac !== undefined ? o.ac : calcAC;
  const maxHP = o.maxHP !== undefined ? o.maxHP : calcHP;
  const base = t.monster;
  const pick = k => vd[k] !== undefined ? vd[k] : base[k];
  const monster = {
    ...base, name: (oc && oc.name) || t.name, source: t.source,
    ac: ac === null ? 10 : ac, hp: maxHP === null ? 1 : maxHP,
    speed: o.speed !== undefined ? String(o.speed) : pick('speed'),
    saving_throws: fillTokens(base.saving_throws, vars), skills: fillTokens(base.skills, vars), senses: fillTokens(base.senses, vars),
    resistances: pick('resistances'), immunities: pick('immunities'),
    traits: _ctFillSection(pick('traits'), vars, o), actions: _ctFillSection(pick('actions'), vars, o),
    bonus_actions: _ctFillSection(pick('bonus_actions'), vars, o), reactions: _ctFillSection(pick('reactions'), vars, o),
  };
  const hitDice = hpF.hitDie && hpF.hitDiceExpr ? { count: evalExpr(hpF.hitDiceExpr, vars), die: hpF.hitDie } : null;
  const notes = {};
  if (acF.expr && o.ac === undefined && calcAC !== null) notes.ac = `${calcAC} = ${_ctExplain(acF.expr, vars)}`;
  if (hpF.expr && o.maxHP === undefined && calcHP !== null) notes.hp = `${calcHP} = ${_ctExplain(hpF.expr, vars)}`;
  return { ac, maxHP, hitDice, initBonus: o.initBonus !== undefined ? o.initBonus : Math.floor(((base.dex || 10) - 10) / 2),
    speed: monster.speed, monster, notes, unresolved, edited: Object.keys(o).filter(k => OWN_COMPANION_OVERRIDES.includes(k)),
    formulaText: { ac: acF.text, hp: hpF.text } };
}

function newOwnCompanion(t, opts = {}) {
  return { id: opts.id || ('oc' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)), templateKey: t.key,
    name: opts.name || t.name, variant: opts.variant || null, spellLevel: opts.spellLevel || null,
    concentrationSpell: opts.concentrationSpell || null, hp: opts.hp !== undefined ? opts.hp : 0, tempHP: 0, conditions: [], uses: {},
    hitDiceUsed: 0, overrides: {}, portrait: null, portraitZoom: 100, portraitX: 50, portraitY: 50,
    turnMode: t.turn === 'own' ? 'own' : 'afterOwner', createdAt: Date.now() };
}

// The character record is player-writable: keep known keys, numbers as numbers, short text, known conditions
function sanitizeOwnCompanion(raw, conditionNames) {
  // The id and template key end up inside onclick handlers, so they must be plain words
  if (!raw || typeof raw !== 'object' || typeof raw.templateKey !== 'string' || !OWN_TEMPLATE_KEY_RE.test(raw.templateKey)) return null;
  const num = (v, d, min = -Infinity) => { const n = Number(v); return Number.isFinite(n) ? Math.max(min, n) : d; };
  const str = (v, n = 200) => (v === undefined || v === null ? '' : String(v)).slice(0, n);
  const known = new Set(conditionNames || []);
  const overrides = {};
  for (const k of OWN_COMPANION_OVERRIDES) {
    const v = raw.overrides && raw.overrides[k];
    if (v === undefined || v === null || v === '') continue;
    if (k === 'speed') overrides.speed = str(v, 100);
    else if (Number.isFinite(Number(v))) overrides[k] = Number(v);
  }
  return {
    id: /^[A-Za-z0-9_-]{1,40}$/.test(String(raw.id)) ? String(raw.id) : ('oc' + Math.random().toString(36).slice(2, 9)),
    templateKey: raw.templateKey, name: str(raw.name),
    variant: raw.variant ? str(raw.variant, 60) : null,
    spellLevel: raw.spellLevel ? Math.min(9, Math.max(0, Math.floor(num(raw.spellLevel, 0, 0)))) || null : null,
    concentrationSpell: raw.concentrationSpell ? str(raw.concentrationSpell, 100) : null,
    hp: num(raw.hp, 0, 0), tempHP: num(raw.tempHP, 0, 0), hitDiceUsed: num(raw.hitDiceUsed, 0, 0),
    conditions: (Array.isArray(raw.conditions) ? raw.conditions : []).map(x => {
      if (typeof x === 'string') return known.has(x) ? x : null;
      if (x && typeof x === 'object' && known.has(x.name)) { const d = num(x.duration, 0, 0); return d > 0 ? { name: x.name, duration: d } : x.name; }
      return null;
    }).filter(Boolean).slice(0, 30),
    uses: Object.fromEntries(Object.entries(raw.uses && typeof raw.uses === 'object' ? raw.uses : {}).slice(0, 100).map(([k, v]) => [str(k, 120), num(v, 0, 0)])),
    overrides,
    portrait: typeof raw.portrait === 'string' && /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]*$/.test(raw.portrait) ? raw.portrait : null,
    portraitZoom: num(raw.portraitZoom, 100), portraitX: num(raw.portraitX, 50), portraitY: num(raw.portraitY, 50),
    turnMode: raw.turnMode === 'afterOwner' ? 'afterOwner' : 'own', createdAt: num(raw.createdAt, 0),
  };
}

// Summons that depend on a concentration spell the owner is no longer concentrating on
function staleConcentrationCompanions(ch) {
  const active = ch && ch.activeConcentration && ch.activeConcentration.spellName;
  return ((ch && ch.ownCompanions) || []).filter(c => c.concentrationSpell && c.concentrationSpell !== active);
}

if (typeof module !== 'undefined') {
  module.exports = { evalExpr, parseFormula, parseBonusText, fillTokens, variantVar, OWN_COMPANION_OVERRIDES,
    companionContext, resolveCompanion, newOwnCompanion, sanitizeOwnCompanion, staleConcentrationCompanions };
}
