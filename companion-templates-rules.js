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

if (typeof module !== 'undefined') {
  module.exports = { evalExpr, parseFormula, parseBonusText, fillTokens, variantVar };
}
