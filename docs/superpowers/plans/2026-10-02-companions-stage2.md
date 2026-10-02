# Companions Stage 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Characters get the companions their rules give them (class companions, spell summons, familiars, mounts & pets), stored on the character, with numbers computed live from the owner.

**Architecture:** A build script turns 5etools creatures into `COMPANION_TEMPLATES` whose numbers are small arithmetic expressions (`2 + INT + 5*LVL`) and whose text carries `{{expr}}` tokens. A pure module (`companion-templates-rules.js`) evaluates them against the owner (`companionContext`) and returns a live, monster-shaped sheet (`resolveCompanion`). The app wraps each `ch.ownCompanions[]` entry in a Stage-1-shaped "companion view" so the existing companion sheet, damage/heal/conditions/uses/rest/art code and combat linking work unchanged, with writes routed back to the character.

**Tech Stack:** Vanilla JS (no framework), Node for unit tests and build scripts, puppeteer-core browser tests opened from disk, Firebase (no rules change).

**Spec:** `docs/superpowers/specs/2026-10-02-companions-stage2-design.md`

## Global Constraints

- Keep vanilla JS — no framework; new browser modules are plain scripts that also `module.exports` for Node (pattern of `companion-rules.js`).
- New scripts load in `index.html` before `app.js`; data scripts use `defer`; every changed asset URL gets a bumped `?v=`.
- Source data: `C:\Users\Kiana\Downloads\5etools-src-main\data` (bestiary, spells, class, optionalfeatures).
- `ch.ownCompanions` is player-writable → sanitise on load, `esc()` everything rendered.
- No Firestore rules change. GM-only overrides are enforced by the UI only (accepted by the user).
- Existing suites keep passing: `node tests/<name>.test.js` for each unit file, `cd tests && node run-browser-tests.js`.
- Files may be CRLF after git operations — normalise `\r\n` before exact-text matching in scripts.
- Nothing is deployed or pushed without the user's go-ahead.
- Combat gotcha: `combatLog()` calls `getInitiative()` which re-syncs linked rows — write to the linked record BEFORE logging.

## Review Focus

- A stored `templateKey` that no longer exists in the templates (data rebuilt, name changed) → the companion is listed as "Unknown creature" with Dismiss, nothing throws.
- The owner levels **down** or a GM max-HP override is removed → `hp` is clamped to the new max on the next render.
- A player-written `ownCompanions` entry with junk (strings for numbers, huge names, unknown conditions, `<script>` in name) → sanitised on load and escaped on render.
- A character with no casting class summons a spirit (e.g. via a magic item) → spell attack / DC fall back to INT and the sheet still renders numbers.
- Removing a companion row while it is the current turn or before it → `currentIndex` still points at the same combatant.

---

## File Structure

| File | Responsibility |
|---|---|
| `companion-templates-rules.js` (new) | Pure: expression evaluator, formula parser, token filling, owner context, `resolveCompanion`, own-companion sanitise/create, stale-concentration check |
| `data/build-companion-templates.js` (new) | Node: 5etools → `data/companion_templates.js` (`COMPANION_TEMPLATES`) |
| `data/companion_templates.js` (generated) | Template data |
| `app.js` | Companion view adapter, write routing, panel/picker/modal, player tabs, cast hooks, level-up offer, combat |
| `index.html` | Script tags |
| `style.css` | Small additions (indented follower row, formula notes, GM-edited mark) |
| `tests/companion-templates.test.js` (new) | Unit tests for the pure module + generated data |
| `tests/own-companions.browser.test.js` (new) | Browser tests for app behaviour |
| `tests/run-browser-tests.js` | Add the new browser test |

---

### Task 1: Expressions and formula parsing

**Files:**
- Create: `companion-templates-rules.js`
- Test: `tests/companion-templates.test.js`

**Interfaces:**
- Produces: `evalExpr(expr: string, vars: object) → number|null`, `parseFormula(text: string) → {expr, hitDie?, hitDiceExpr?}|null`, `parseBonusText(text) → string|null`, `fillTokens(text, vars) → string`, `variantVar(name) → 'V_<Slug>'`.
- Variables: `PB`, `SL` (spell level), `LVL` (granting class level), `STR DEX CON INT WIS CHA` (mods), `SPELLATK`, `SPELLDC`, `V_<Variant>` (1 for the chosen variant, else 0 — unknown `V_` names evaluate to 0).

- [ ] **Step 1: Write the failing tests**

```js
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
  assert.strictEqual(R.evalExpr('20*V_Air + 30*(V_Land + V_Water)', { ...V, V_Land: 1 }), 30);
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
  assert.strictEqual(R.evalExpr(f.expr, { ...V, V_Air: 1 }), 30);
  assert.strictEqual(R.evalExpr(f.expr, { ...V, V_Water: 1 }), 40);
  const c = R.parseFormula("11 + the spell's level + 2 (Defender only)");
  assert.strictEqual(R.evalExpr(c.expr, { ...V, V_Defender: 1 }), 17);
  assert.strictEqual(R.evalExpr(c.expr, { ...V, V_Avenger: 1 }), 15);
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `node tests/companion-templates.test.js`
Expected: FAIL — `Cannot find module '../companion-templates-rules.js'`.

- [ ] **Step 3: Implement**

```js
// Companion templates: formulas from 5etools creatures ("2 + your Intelligence modifier + five times
// your artificer level") become small expressions ("2 + INT + 5*LVL") that are worked out against the
// owner. Pure — no DOM, no app globals — so it runs in Node tests and in the browser.

const _CT_NUMWORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twice: 2 };
const _CT_ABIL = { strength: 'STR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA' };

function variantVar(name) { return 'V_' + String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }

// Safe evaluator: numbers, names, + - * /, parentheses, max/min/floor. Unknown names → null
// (except V_ names, which are 0 unless chosen).
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

function _ctVariantSum(label) {
  // "Land and Water", "Medium or smaller" → V_land + V_water / V_medium_or_smaller
  const parts = /\band\b/.test(label) ? label.split(/\s*(?:,|\band\b)\s*/) : [label];
  const names = parts.filter(Boolean).map(variantVar);
  return names.length > 1 ? '(' + names.join(' + ') + ')' : names[0];
}

function _ctTerm(t) {
  t = t.trim().replace(/^\((.*)\)$/, '$1').trim();
  let m;
  if (/^\d+$/.test(t)) return t;
  if ((m = t.match(/^(\d+) \((.+?) only\)$/i))) return `${m[1]}*${_ctVariantSum(m[2])}`;
  if ((m = t.match(/^(?:(\w+) (?:times|\*) )?your (\w+) level$/i))) {
    const n = m[1] ? (_CT_NUMWORDS[m[1].toLowerCase()] || parseInt(m[1])) : 1;
    return n ? (n === 1 ? 'LVL' : `${n}*LVL`) : null;
  }
  if ((m = t.match(/^your (\w+) modifier$/i)) && _CT_ABIL[m[1].toLowerCase()]) return _CT_ABIL[m[1].toLowerCase()];
  if (/^(pb|your proficiency bonus|proficiency bonus)$/i.test(t)) return 'PB';
  if ((m = t.match(/^pb \* (\d+)$/i))) return `PB*${m[1]}`;
  if (/^(the level of the spell|the spell's level)$/i.test(t)) return 'SL';
  if ((m = t.match(/^(\d+) for each spell level above (\d+)(?:st|nd|rd|th)?$/i))) return `${m[1]}*max(0, SL - ${m[2]})`;
  if ((m = t.match(/^(\d+) per spell level$/i))) return m[1] === '1' ? 'SL' : `${m[1]}*SL`;
  return null;
}

// "+" outside parentheses
function _ctSplitPlus(s) {
  const out = []; let depth = 0, cur = '';
  for (const c of s) {
    if (c === '(') depth++; if (c === ')') depth--;
    if (c === '+' && depth === 0) { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(x => x !== '');
}

function parseFormula(text) {
  if (text === null || text === undefined) return null;
  let t = String(text).replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ').trim();
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests/companion-templates.test.js`
Expected: all ✓, "9 passed". Fix the parser (not the tests) if a case fails.

- [ ] **Step 5: Commit**

```bash
git add companion-templates-rules.js tests/companion-templates.test.js
git commit -m "Add companion formula parser and expression evaluator"
```

---

### Task 2: Build companion templates from 5etools

**Files:**
- Create: `data/build-companion-templates.js`
- Create (generated): `data/companion_templates.js`
- Test: append to `tests/companion-templates.test.js`

**Interfaces:**
- Consumes: `parseFormula`, `parseBonusText`, `variantVar` (Task 1); `entriesToRulesText` from `data/rules-text-build.js`; `stripTags` from `data/build-class-features.js`.
- Produces: `COMPANION_TEMPLATES` (global in browser; `module.exports` in Node) keyed `"<name>|<source>"`, each:

```
{ key, name, source, edition: '2014'|'2024',
  kind: 'class'|'summon'|'familiar'|'mount', group: string,      // group = picker label, e.g. 'Primal Companion', 'Summon Beast', 'Find Familiar'
  grantedBy: { cls?, subclass?, level?, spell?, spellLevel? },
  offer: boolean, persistent: boolean, atZero: 'down'|'vanish', turn: 'afterOwner'|'own',
  concentration: boolean,
  variants: string[]|null,
  acF: { expr?, value?, text }, hpF: { expr?, value?, text, hitDie?, hitDiceExpr? },
  monster: { size, type, alignment, speed, str, dex, con, int, wis, cha, saving_throws, skills, senses,
             languages, resistances, immunities, vulnerabilities, condition_immunities,
             traits:[{name,desc}], actions:[...], bonus_actions:[...], reactions:[...] },   // text may hold {{expr}}
  variantData: { [variant]: { acF?, hpF?, speed?, traits?, actions?, bonus_actions?, reactions?, resistances?, immunities? } } | null,
  revive: string|null, unresolved: string[] }
```

- [ ] **Step 1: Write the failing data tests** (append before the final `console.log` in `tests/companion-templates.test.js`)

```js
const T = require(path.join(__dirname, '..', 'data', 'companion_templates.js'));
test('templates include every formula creature, familiars, steeds and mounts', () => {
  for (const k of ['Steel Defender|TCE', 'Steel Defender|EFA', 'Beast of the Land|TCE', 'Beast of the Sky|XPHB', 'Bestial Spirit|TCE',
    'Bestial Spirit|XPHB', 'Celestial Spirit|XPHB', 'Animated Object|XPHB', 'Otherworldly Steed|XPHB', 'Drake Companion|FTD',
    'Wildfire Spirit|TCE', 'Hound of Ill Omen|XGE', 'Homunculus Servant|TCE', 'Homunculus Servant|EFA'])
    assert.ok(T[k], 'missing ' + k);
  assert.strictEqual(Object.values(T).filter(t => t.kind === 'class' || t.kind === 'summon').length >= 37, true);
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
  assert.strictEqual(T['Owl|MM'] ? T['Owl|MM'].turn : Object.values(T).find(t => t.name === 'Owl' && t.kind === 'familiar').turn, 'own');
});
test('attack text keeps formula tokens the app can fill', () => {
  const rend = T['Steel Defender|TCE'].monster.actions.find(a => a.name === 'Force-Empowered Rend');
  assert.match(rend.desc, /\{\{\+SPELLATK\}\} to hit/);
  assert.match(rend.desc, /1d8 \+ \{\{PB\}\} force damage/);
  assert.match(T['Bestial Spirit|XPHB'].monster.actions.find(a => a.name === 'Rend').desc, /1d8 \+ \{\{4 \+ SL\}\}/);
  assert.ok(!JSON.stringify(T['Steel Defender|TCE'].monster).includes('{@'), 'no raw 5etools tags');
});
test('variants carry their own data', () => {
  const vd = T['Bestial Spirit|XPHB'].variantData;
  assert.ok(vd.Air && vd.Land && vd.Water);
  assert.ok(vd.Air.traits.some(t => t.name === 'Flyby'));
  assert.ok(!vd.Air.traits.some(t => /Pack Tactics/.test(t.name)));
});
test('Review focus: no template is silently unresolved', () => {
  const allowed = new Set([]);   // add a key here only with a comment saying why the sheet's manual box is fine
  const bad = Object.values(T).filter(t => t.unresolved.length && !allowed.has(t.key)).map(t => t.key + ': ' + t.unresolved.join(','));
  assert.deepStrictEqual(bad, []);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node tests/companion-templates.test.js`
Expected: FAIL — `Cannot find module '../data/companion_templates.js'`.

- [ ] **Step 3: Write the build script**

Write `data/build-companion-templates.js`:

```js
// Builds data/companion_templates.js from the 5etools data: class companions and spell summons (formula
// stats), Find Familiar / Pact of the Chain forms, Find Steed (2014) forms, and common mounts & pets.
//   node data/build-companion-templates.js
const fs = require('fs');
const path = require('path');
const { parseFormula, parseBonusText } = require('../companion-templates-rules.js');
const { entriesToRulesText } = require('./rules-text-build');
const { stripTags } = require('./build-class-features');

const SRC = 'C:/Users/Kiana/Downloads/5etools-src-main/data';
const readJson = p => JSON.parse(fs.readFileSync(path.join(SRC, p), 'utf8'));
const EDITION_2024 = new Set(['XPHB', 'XMM', 'XDMG', 'EFA', 'FRHoF']);
const edition = src => EDITION_2024.has(src) ? '2024' : '2014';

// ── Load every monster; resolve _copy ─────────────────────────────────────
const bestiary = [];
for (const f of fs.readdirSync(path.join(SRC, 'bestiary')).filter(f => /^bestiary-.*\.json$/.test(f)))
  bestiary.push(...(readJson('bestiary/' + f).monster || []));
const byKey = new Map(bestiary.map(m => [`${m.name}|${m.source}`, m]));

function applyMod(m, mod, vars) {
  m = JSON.parse(JSON.stringify(m));
  for (const [prop, ops] of Object.entries(mod || {})) {
    for (const op of [].concat(ops)) {
      const o = typeof op === 'string' ? { mode: op } : op;
      if (prop === '*' && o.mode === 'replaceTxt') {
        const re = new RegExp(o.replace, o.flags || 'g');
        m = JSON.parse(JSON.stringify(m, (k, v) => typeof v === 'string' && k !== 'name' && k !== 'source' ? v.replace(re, o.with) : v));
        continue;
      }
      const arr = m[prop] = m[prop] || [];
      const names = [].concat(o.names || o.replace || []).map(n => typeof n === 'string' ? n : n.name);
      if (o.mode === 'removeArr') m[prop] = arr.filter(e => !names.includes(e.name));
      else if (o.mode === 'appendArr') m[prop] = arr.concat([].concat(o.items));
      else if (o.mode === 'prependArr') m[prop] = [].concat(o.items).concat(arr);
      else if (o.mode === 'replaceArr') {
        const at = arr.findIndex(e => e.name === names[0]);
        if (at >= 0) m[prop] = [...arr.slice(0, at), ...[].concat(o.items), ...arr.slice(at + 1)];
      } else if (o.mode === 'renameArr') {
        for (const r of [].concat(o.renames)) { const e = arr.find(x => x.name === r.rename); if (e) e.name = r.with; }
      } else throw new Error(`Unsupported _mod mode ${o.mode} on ${m.name}`);
    }
  }
  if (vars) m = JSON.parse(JSON.stringify(m).replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`));
  return m;
}
function resolveCopy(m) {
  if (!m._copy) return m;
  const base = byKey.get(`${m._copy.name}|${m._copy.source}`);
  if (!base) throw new Error(`Copy source missing for ${m.name}`);
  const { _copy, ...own } = m;
  const merged = { ...applyMod(resolveCopy(base), _copy._mod), ...own };
  return merged;
}
// _versions → [{ variant, data }] (supports plain versions and _abstract/_implementations)
function versionsOf(m) {
  const out = [];
  for (const v of m._versions || []) {
    if (v._abstract) {
      for (const impl of v._implementations || []) {
        const vars = impl._variables || {};
        const name = v._abstract.name.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k]);
        const { _mod, ...rest } = v._abstract;
        out.push({ variant: (name.match(/\(([^)]+)\)\s*$/) || [])[1] || name, data: { ...applyMod(m, _mod, vars), ...rest, ...impl, name } });
      }
    } else {
      const { _mod, ...rest } = v;
      out.push({ variant: (v.name.match(/\(([^)]+)\)\s*$/) || [])[1] || v.name, data: { ...applyMod(m, _mod), ...rest } });
    }
  }
  return out;
}

// ── 5etools entries → plain text with {{expr}} tokens ─────────────────────
const ATK = { mw: 'Melee Weapon Attack:', rw: 'Ranged Weapon Attack:', ms: 'Melee Spell Attack:', rs: 'Ranged Spell Attack:',
  'mw,rw': 'Melee or Ranged Weapon Attack:', 'ms,rs': 'Melee or Ranged Spell Attack:' };
const ATKR = { m: 'Melee Attack Roll:', r: 'Ranged Attack Roll:', 'm,r': 'Melee or Ranged Attack Roll:' };
const SAVE = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
function tokenise(s) {
  return String(s)
    .replace(/\{@hitYourSpellAttack[^}]*\}/g, '{{+SPELLATK}}')
    .replace(/\{@(damage|dice|hit) ([^}|]+)(?:\|[^}]*)?\}/g, (_, tag, body) => {
      const b = body.replace(/\bsummonSpellLevel\b/g, 'SL').replace(/\bPB\b/g, 'PB').trim();
      if (!/\b(SL|PB)\b/.test(b)) return tag === 'hit' ? (/^[+-]/.test(b) ? b : '+' + b) : b;
      const dm = b.match(/^(\d+d\d+)\s*\+\s*(.+)$/);
      if (dm) return `${dm[1]} + {{${dm[2]}}}`;
      return tag === 'hit' ? `{{+${b}}}` : `{{${b}}}`;
    })
    .replace(/\{@atk ([a-z,]+)\}/g, (_, k) => ATK[k] || 'Attack:')
    .replace(/\{@atkr ([a-z,]+)\}/g, (_, k) => ATKR[k] || 'Attack Roll:')
    .replace(/\{@h\}/g, 'Hit: ')
    .replace(/\{@actSave (\w+)\}/g, (_, k) => `${SAVE[k] || k} Saving Throw:`)
    .replace(/\{@actSaveFail\}/g, 'Failure:').replace(/\{@actSaveSuccess\}/g, 'Success:')
    .replace(/\{@actTrigger\}/g, 'Trigger:').replace(/\{@actResponse\}/g, 'Response:')
    .replace(/DC equals your spell save DC/g, 'DC {{SPELLDC}}')
    .replace(/your spell save DC/g, 'DC {{SPELLDC}}')
    .replace(/\{@dc ([^}]+)\}/g, 'DC $1');
}
const textOf = entries => entriesToRulesText(JSON.parse(tokenise(JSON.stringify(entries)))).replace(/\*\*/g, '');
const section = arr => (arr || []).map(e => ({ name: stripTags(tokenise(e.name)), desc: textOf(e.entries || []) }));
function speedText(sp) {
  if (!sp) return '';
  return Object.entries(sp).filter(([k]) => k !== 'canHover').map(([k, v]) => {
    const n = typeof v === 'object' ? v.number : v, cond = typeof v === 'object' && v.condition ? ' ' + stripTags(v.condition) : '';
    return k === 'walk' ? `${n} ft.${cond}` : `${k} ${n} ft.${cond}`;
  }).join(', ');
}
function bonusList(obj, unresolved, field) {
  return Object.entries(obj || {}).map(([k, v]) => {
    const expr = /PB/.test(v) ? parseBonusText(v) : null;
    if (/PB/.test(v) && !expr) unresolved.push(field);
    const label = k.length === 3 ? k[0].toUpperCase() + k.slice(1) : k.replace(/\b\w/g, c => c.toUpperCase());
    return `${label} ${expr ? `{{+${expr}}}` : v}`;
  }).join(', ');
}
function formulaField(raw, unresolved, field) {
  // ac: [15] | [{ac:15, from:[...]}] | [{special:"..."}];  hp: {average, formula} | {special}
  if (field === 'ac') {
    const a = [].concat(raw || [])[0];
    if (typeof a === 'number') return { value: a, text: String(a) };
    if (a && a.ac !== undefined) return { value: a.ac, text: `${a.ac}${a.from ? ' (' + a.from.map(stripTags).join(', ') + ')' : ''}` };
    if (a && a.special) { const f = parseFormula(a.special); if (!f) unresolved.push('ac'); return { ...(f || {}), text: a.special }; }
    unresolved.push('ac'); return { text: '' };
  }
  if (raw && raw.special) { const f = parseFormula(raw.special); if (!f) unresolved.push('hp'); return { ...(f || {}), text: raw.special }; }
  if (raw && raw.average !== undefined) return { value: raw.average, text: `${raw.average}${raw.formula ? ' (' + raw.formula + ')' : ''}` };
  unresolved.push('hp'); return { text: '' };
}
const SIZES = { T: 'Tiny', S: 'Small', M: 'Medium', L: 'Large', H: 'Huge', G: 'Gargantuan' };
function monsterOf(m, unresolved) {
  const list = a => (a || []).map(x => typeof x === 'string' ? x : stripTags(JSON.stringify(x))).join(', ');
  const passive = m.passive !== undefined ? (/PB/.test(String(m.passive)) ? `{{${parseBonusText(String(m.passive))}}}` : m.passive) : null;
  return {
    size: (m.size || []).map(s => SIZES[s] || s).join(' or '), type: stripTags(typeof m.type === 'object' ? m.type.type : m.type || ''),
    alignment: (m.alignment || []).join(' '), speed: speedText(m.speed),
    str: m.str, dex: m.dex, con: m.con, int: m.int, wis: m.wis, cha: m.cha,
    saving_throws: bonusList(m.save, unresolved, 'saves'), skills: bonusList(m.skill, unresolved, 'skills'),
    senses: [...(m.senses || []).map(stripTags), passive !== null ? `Passive Perception ${passive}` : ''].filter(Boolean).join(', '),
    languages: (m.languages || []).map(stripTags).join(', '),
    resistances: list(m.resist), immunities: list(m.immune), vulnerabilities: list(m.vulnerable), condition_immunities: list(m.conditionImmune),
    traits: section(m.trait), actions: section(m.action), bonus_actions: section(m.bonus), reactions: section(m.reaction),
  };
}

// ── Who grants what ───────────────────────────────────────────────────────
// Class companions: subclass + level + whether it is offered on level-up and how it behaves.
const CLASS_META = {
  'Steel Defender|TCE':     { cls: 'Artificer', subclass: 'Battle Smith', level: 3, offer: true,  persistent: true,  turn: 'afterOwner', feature: 'Steel Defender' },
  'Steel Defender|EFA':     { cls: 'Artificer', subclass: 'Battle Smith', level: 3, offer: true,  persistent: true,  turn: 'afterOwner', feature: 'Steel Defender' },
  'Homunculus Servant|TCE': { cls: 'Artificer', level: 2, offer: false, persistent: true, turn: 'afterOwner', feature: 'Homunculus Servant' },
  'Beast of the Land|TCE':  { cls: 'Ranger', subclass: 'Beast Master', level: 3, offer: true, persistent: true, turn: 'afterOwner', group: 'Primal Companion', feature: 'Primal Companion' },
  'Beast of the Sea|TCE':   { cls: 'Ranger', subclass: 'Beast Master', level: 3, offer: true, persistent: true, turn: 'afterOwner', group: 'Primal Companion', feature: 'Primal Companion' },
  'Beast of the Sky|TCE':   { cls: 'Ranger', subclass: 'Beast Master', level: 3, offer: true, persistent: true, turn: 'afterOwner', group: 'Primal Companion', feature: 'Primal Companion' },
  'Beast of the Land|XPHB': { cls: 'Ranger', subclass: 'Beast Master', level: 3, offer: true, persistent: true, turn: 'afterOwner', group: 'Primal Companion', feature: 'Primal Companion' },
  'Beast of the Sea|XPHB':  { cls: 'Ranger', subclass: 'Beast Master', level: 3, offer: true, persistent: true, turn: 'afterOwner', group: 'Primal Companion', feature: 'Primal Companion' },
  'Beast of the Sky|XPHB':  { cls: 'Ranger', subclass: 'Beast Master', level: 3, offer: true, persistent: true, turn: 'afterOwner', group: 'Primal Companion', feature: 'Primal Companion' },
  'Drake Companion|FTD':    { cls: 'Ranger', subclass: 'Drakewarden', level: 3, offer: true, persistent: true, turn: 'afterOwner', feature: 'Drake Companion' },
  'Wildfire Spirit|TCE':    { cls: 'Druid', subclass: 'Circle of Wildfire', level: 2, offer: false, persistent: false, turn: 'afterOwner' },
  'Dancing Item|TCE':       { cls: 'Bard', subclass: 'College of Creation', level: 6, offer: false, persistent: false, turn: 'afterOwner' },
  'Hound of Ill Omen|XGE':  { cls: 'Sorcerer', subclass: 'Shadow Magic', level: 6, offer: false, persistent: false, turn: 'own' },
};

// Spells: level and concentration from the spell files
const spellIndex = new Map();
for (const f of fs.readdirSync(path.join(SRC, 'spells')).filter(f => /^spells-.*\.json$/.test(f)))
  for (const s of readJson('spells/' + f).spell || []) spellIndex.set(`${s.name}|${s.source}`, s);
const isConc = s => (s.duration || []).some(d => d.concentration);
const creatureTags = s => [...JSON.stringify(s.entries || []).matchAll(/\{@creature ([^}|]+)\|?([^}|]*)/g)].map(m => [m[1], m[2]]);

// Class feature text that tells how the creature comes back (sentences mentioning revival)
const featureTexts = [];
for (const f of fs.readdirSync(path.join(SRC, 'class')).filter(f => /^class-.*\.json$/.test(f))) {
  const j = readJson('class/' + f);
  featureTexts.push(...(j.subclassFeature || []), ...(j.classFeature || []));
}
featureTexts.push(...(readJson('optionalfeatures.json').optionalfeature || []));
function reviveText(featureName, source) {
  const feats = featureTexts.filter(x => x.name === featureName && x.source === source).concat(featureTexts.filter(x => x.name === featureName));
  for (const ft of feats) {
    const sentences = stripTags(JSON.stringify(ft.entries || []).replace(/\\"/g, '"')).split(/(?<=\.)\s+|","/)
      .filter(s => /(died within the last hour|returns to life|mending)/i.test(s)).map(s => s.replace(/^["\[]+|["\]]+$/g, ''));
    if (sentences.length) return sentences.join(' ');
  }
  return null;
}

const out = {};
function add(m, meta) {
  m = resolveCopy(m);
  const key = `${m.name}|${m.source}`;
  if (out[key]) return;
  const unresolved = [];
  const versions = versionsOf(m);
  const variantData = versions.length ? Object.fromEntries(versions.map(({ variant, data }) => {
    const u = [];
    const mon = monsterOf(data, u);
    const vd = { speed: mon.speed, traits: mon.traits, actions: mon.actions, bonus_actions: mon.bonus_actions, reactions: mon.reactions,
      resistances: mon.resistances, immunities: mon.immunities };
    if (data.hp && JSON.stringify(data.hp) !== JSON.stringify(m.hp)) vd.hpF = formulaField(data.hp, u, 'hp');
    if (data.ac && JSON.stringify(data.ac) !== JSON.stringify(m.ac)) vd.acF = formulaField(data.ac, u, 'ac');
    u.forEach(x => unresolved.push(`${x} (${variant})`));
    return [variant, vd];
  })) : null;
  out[key] = {
    key, name: m.name, source: m.source, edition: edition(m.source),
    ...meta,
    variants: versions.length ? versions.map(v => v.variant) : null,
    acF: formulaField(m.ac, unresolved, 'ac'), hpF: formulaField(m.hp, unresolved, 'hp'),
    monster: monsterOf(m, unresolved), variantData,
    revive: meta.revive || null, unresolved: [...new Set(unresolved)],
  };
  // A size-list HP (Animated Object) defines the variants when 5etools has none
  if (!out[key].variants && /\(Large\)/.test(out[key].hpF.text)) out[key].variants = [...out[key].hpF.text.matchAll(/\(([^)]+)\)/g)].map(x => x[1]);
}

// 1. Formula creatures
for (const m of bestiary.filter(m => m.summonedBySpell || m.summonedByClass)) {
  const key = `${m.name}|${m.source}`;
  if (m.summonedByClass) {
    const c = CLASS_META[key];
    if (!c) throw new Error('No CLASS_META for ' + key);
    add(m, { kind: 'class', group: c.group || m.name, grantedBy: { cls: c.cls, subclass: c.subclass, level: c.level },
      offer: c.offer, persistent: c.persistent, atZero: c.persistent ? 'down' : 'vanish', turn: c.turn, concentration: false,
      revive: c.feature ? reviveText(c.feature, m.source) : null });
  } else {
    const [spName, spSrc] = m.summonedBySpell.split('|');
    const sp = spellIndex.get(`${spName}|${spSrc}`);
    const steed = /Find Steed/.test(spName);
    add(m, { kind: 'summon', group: spName, grantedBy: { spell: spName, spellLevel: m.summonedBySpellLevel || (sp && sp.level) || 1 },
      offer: false, persistent: steed, atZero: steed ? 'down' : 'vanish', turn: 'afterOwner', concentration: !!(sp && isConc(sp)) });
  }
}
// 2. Find Familiar forms (both editions) and Pact of the Chain extras
for (const [spKey, ed] of [['Find Familiar|PHB', '2014'], ['Find Familiar|XPHB', '2024']]) {
  const sp = spellIndex.get(spKey);
  for (const [n, s] of creatureTags(sp)) {
    const m = byKey.get(`${n.replace(/\b\w/g, c => c.toUpperCase())}|${s || (ed === '2024' ? 'XMM' : 'MM')}`);
    if (m) add(m, { kind: 'familiar', group: 'Find Familiar', grantedBy: { spell: 'Find Familiar', spellLevel: 1 }, offer: false,
      persistent: true, atZero: 'vanish', turn: 'own', concentration: false });
  }
}
for (const of of (readJson('optionalfeatures.json').optionalfeature || []).filter(o => o.name === 'Pact of the Chain')) {
  for (const [n, s] of creatureTags(of)) {
    const m = byKey.get(`${n.replace(/\b\w/g, c => c.toUpperCase())}|${s || (edition(of.source) === '2024' ? 'XMM' : 'MM')}`);
    if (m) add(m, { kind: 'familiar', group: 'Pact of the Chain', grantedBy: { spell: 'Find Familiar', spellLevel: 1, pact: true }, offer: false,
      persistent: true, atZero: 'vanish', turn: 'own', concentration: false });
  }
}
// 3. Find Steed (2014) forms
for (const [n, s] of creatureTags(spellIndex.get('Find Steed|PHB'))) {
  const m = byKey.get(`${n.replace(/\b\w/g, c => c.toUpperCase())}|${s || 'MM'}`);
  if (m) add(m, { kind: 'summon', group: 'Find Steed', grantedBy: { spell: 'Find Steed', spellLevel: 2 }, offer: false,
    persistent: true, atZero: 'down', turn: 'afterOwner', concentration: false });
}
// 4. Mounts & pets
// (Owl, Cat, Hawk, Raven are familiar forms — they live under Familiars, not here)
for (const n of ['Riding Horse', 'Draft Horse', 'Warhorse', 'Pony', 'Mule', 'Camel', 'Elk', 'Mastiff', 'Giant Lizard'])
  for (const s of ['MM', 'XMM']) {
    const m = byKey.get(`${n}|${s}`);
    if (m && !out[`${n}|${s}`]) add(m, { kind: 'mount', group: 'Mounts & pets', grantedBy: {}, offer: false, persistent: true,
      atZero: 'down', turn: 'own', concentration: false });
  }

const header = '// Generated by data/build-companion-templates.js — do not edit by hand.\n';
fs.writeFileSync(path.join(__dirname, 'companion_templates.js'),
  header + 'const COMPANION_TEMPLATES = ' + JSON.stringify(out) + ';\nif (typeof module !== \'undefined\') module.exports = COMPANION_TEMPLATES;\n');
const unresolved = Object.values(out).filter(t => t.unresolved.length);
console.log(`${Object.keys(out).length} templates written; ${unresolved.length} with unresolved fields`);
unresolved.forEach(t => console.log('  ' + t.key + ': ' + t.unresolved.join(', ')));
```

Note: keys are `name|source`, so a creature added once (e.g. Mastiff as a 2014 Find Steed form) is not re-added as a mount — `add()` returns early. That is fine: Find Steed forms are reachable from the spell, and the mounts list still contains the XMM Mastiff.

- [ ] **Step 4: Run the build and fix what it reports**

Run: `node data/build-companion-templates.js`
Expected: "N templates written; 0 with unresolved fields". For each unresolved line, extend `_ctTerm` / `parseFormula` in `companion-templates-rules.js` (add a unit test for the new wording in Task 1's test block first), or extend `tokenise`. If a `_mod` mode throws, add it to `applyMod`. If `stripTags` leaves a raw `{@…}` tag the test catches, add a rule to `tokenise`.

- [ ] **Step 5: Run tests**

Run: `node tests/companion-templates.test.js`
Expected: all ✓.

- [ ] **Step 6: Commit**

```bash
git add data/build-companion-templates.js data/companion_templates.js companion-templates-rules.js tests/companion-templates.test.js
git commit -m "Build companion templates from 5etools"
```

---

### Task 3: Resolve a companion against its owner

**Files:**
- Modify: `companion-templates-rules.js`
- Test: `tests/companion-templates.test.js`

**Interfaces:**
- Consumes: Task 1 functions; template shape from Task 2.
- Produces:
  - `companionContext(ch, template, oc) → vars` (the variable map for `evalExpr`, plus `_labels` for notes).
  - `resolveCompanion(template, oc, vars) → { ac, maxHP, hitDice: {count, die}|null, initBonus, speed, monster, notes: {ac, hp}, unresolved: string[], edited: string[] }` — `monster` is in `data/monsters.json` shape with numbers filled (`ac`, `hp` set), ready for the app's `_statBlockFromMonster`.
  - `newOwnCompanion(template, opts) → OwnCompanion` and `sanitizeOwnCompanion(raw, conditionNames) → OwnCompanion|null`.
  - `staleConcentrationCompanions(ch) → OwnCompanion[]`.
  - `OWN_COMPANION_OVERRIDES = ['ac', 'maxHP', 'speed', 'initBonus', 'attackBonus', 'saveDC']`.

- [ ] **Step 1: Write the failing tests** (append)

```js
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
test('newOwnCompanion starts at full HP with defaults', () => {
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `node tests/companion-templates.test.js`
Expected: FAIL — `R.newOwnCompanion is not a function`.

- [ ] **Step 3: Implement** (add to `companion-templates-rules.js` before the exports, and export the new names)

```js
const OWN_COMPANION_OVERRIDES = ['ac', 'maxHP', 'speed', 'initBonus', 'attackBonus', 'saveDC'];
const _CT_CAST_ABILITY = { Artificer: 'int', Wizard: 'int', Cleric: 'wis', Druid: 'wis', Ranger: 'wis', Bard: 'cha',
  Paladin: 'cha', Sorcerer: 'cha', Warlock: 'cha' };
const _ctMod = (ch, ab) => Math.floor((((ch.abilities || {})[ab]) || 10) / 2) - 5;
function _ctClasses(ch) {
  return ch.classes && ch.classes.length ? ch.classes : [{ class: ch.class, subclass: ch.subclass, level: parseInt(ch.level) || 1 }];
}

function companionContext(ch, t, oc) {
  const level = Math.max(1, Math.min(20, parseInt(ch.level) || 1));
  const PB = Math.ceil(level / 4) + 1;
  const classes = _ctClasses(ch);
  const gCls = t && t.grantedBy && t.grantedBy.cls;
  const gEntry = gCls && classes.find(c => c.class === gCls);
  const caster = gCls && _CT_CAST_ABILITY[gCls] ? gCls : (classes.find(c => _CT_CAST_ABILITY[c.class]) || {}).class;
  const castAb = _CT_CAST_ABILITY[caster] || 'int';
  const bonus = ch.spellBonus || {};
  const v = { PB, LVL: gEntry ? (parseInt(gEntry.level) || 1) : level, SL: (oc && oc.spellLevel) || (t && t.grantedBy && t.grantedBy.spellLevel) || 0,
    STR: _ctMod(ch, 'str'), DEX: _ctMod(ch, 'dex'), CON: _ctMod(ch, 'con'), INT: _ctMod(ch, 'int'), WIS: _ctMod(ch, 'wis'), CHA: _ctMod(ch, 'cha') };
  const castMod = _ctMod(ch, castAb);
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
    if (/^V_|\bV_/.test(term)) { const n = evalExpr(term, vars); return n ? String(n) : null; }
    if (/max\(0, SL - \d+\)/.test(term)) { const n = evalExpr(term, vars); return n ? String(n) : null; }
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
  if (!raw || typeof raw !== 'object' || typeof raw.templateKey !== 'string') return null;
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
    id: str(raw.id, 40) || ('oc' + Math.random().toString(36).slice(2, 9)), templateKey: str(raw.templateKey, 120), name: str(raw.name),
    variant: raw.variant ? str(raw.variant, 60) : null, spellLevel: raw.spellLevel ? num(raw.spellLevel, null, 0) : null,
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

function staleConcentrationCompanions(ch) {
  const active = ch && ch.activeConcentration && ch.activeConcentration.spellName;
  return ((ch && ch.ownCompanions) || []).filter(c => c.concentrationSpell && c.concentrationSpell !== active);
}
```

Exports become:

```js
  module.exports = { evalExpr, parseFormula, parseBonusText, fillTokens, variantVar, OWN_COMPANION_OVERRIDES,
    companionContext, resolveCompanion, newOwnCompanion, sanitizeOwnCompanion, staleConcentrationCompanions };
```

- [ ] **Step 4: Run tests**

Run: `node tests/companion-templates.test.js`
Expected: all ✓. If Steel Defender HP at L3 isn't 20 (2 + 3 + 15), check the hit-dice parenthetical was stripped.

- [ ] **Step 5: Commit**

```bash
git add companion-templates-rules.js tests/companion-templates.test.js
git commit -m "Resolve companion templates against their owner"
```

---

### Task 4: App plumbing — load, migrate, companion view, write routing

**Files:**
- Modify: `index.html` (script tags), `app.js` (`migrateCharacter` ~line 762; companion helpers ~lines 1460–1600; `_pvCharacterViewHtml`)
- Create: `tests/own-companions.browser.test.js`
- Modify: `tests/run-browser-tests.js` (add the file)

**Interfaces:**
- Consumes: `COMPANION_TEMPLATES`, `companionContext`, `resolveCompanion`, `sanitizeOwnCompanion`, `newOwnCompanion` (globals in the browser).
- Produces (app.js):
  - `_ownCompanionView(ch, oc) → compView` — Stage-1-shaped object: `{ id, _own: { charId }, _tpl, _res, ownerCharId, name, role, race: '', location: '', ac, maxHP, hp, tempHP, conditions, uses, statBlock, statSource, legendaryMax: 0, initBonus, portrait, portraitZoom, portraitX, portraitY, playerAccess: 'play' }`. For a missing template: `{ id, _own, _missing: true, name: oc.name || 'Unknown creature', … ac: 10, maxHP: 1, hp: 0, statBlock: null }`.
  - `_ownCompanionLabel(t, oc) → string` — "summoned, 4th level" / "familiar" / "Steel Defender" / "mount".
  - `_findOwnCompanion(id) → { ch, oc }|null`.
  - `_companionById(id)` now also returns own companion views.
  - `_companionWrite(comp, patch)` routes `comp._own` writes onto the `oc` and calls `saveData(db)` (player view → `_pvSaveCharacter` via saveData).
  - `addOwnCompanion(charId, templateKey, opts) → oc`, `dismissOwnCompanion(charId, ocId, reason?)`.

- [ ] **Step 1: Write the failing browser test**

```js
// Browser test for Stage 2 companions (own companions) — opens the app from disk:
//   cd tests && node own-companions.browser.test.js
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  await pg.evaluate(() => {
    showToast = () => {}; _showApp();
    window.out = [];
    window.check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    window.setup = (cls = 'Artificer', level = 7, sub = 'Battle Smith') => {
      db.campaigns = db.campaigns.filter(c => c.id !== 'cO');
      const ch = newCharacter('Tinker', 'Human', cls, level); ch.edition = '2014';
      ch.abilities.int = 16; ch.classes = [{ class: cls, subclass: sub, level }];
      migrateCharacter(ch); db.characters[ch.id] = ch;
      db.campaigns.push({ id: 'cO', name: 'Own', characters: [ch.id], npcs: [], journal: [], campaignTab: 'characters', initiative: { round: 1, currentIndex: 0, log: [], combatants: [] } });
      currentCampaignId = 'cO'; currentCharId = ch.id; currentView = 'character'; IS_PLAYER_VIEW = false;
      renderApp();
      return ch;
    };
  });

  // Task 4: plumbing
  await pg.evaluate(() => {
    try {
      check('templates are loaded', typeof COMPANION_TEMPLATES === 'object' && !!COMPANION_TEMPLATES['Steel Defender|TCE'], null);
      const ch = setup();
      check('migrateCharacter gives ownCompanions', Array.isArray(ch.ownCompanions), ch.ownCompanions);
      const oc = addOwnCompanion(ch.id, 'Steel Defender|TCE');
      check('adding starts at full calculated HP', oc.hp === 40, oc.hp);
      const view = _companionById(oc.id);
      check('companion view has live numbers', view && view.ac === 15 && view.maxHP === 40 && view._own.charId === ch.id, view && { ac: view.ac, maxHP: view.maxHP });
      check('stat block attacks are filled', /\+6 to hit/.test(JSON.stringify(view.statBlock.actions)), view.statBlock.actions);
      companionDamage(oc.id, 15);
      check('damage writes back to the character', ch.ownCompanions[0].hp === 25, ch.ownCompanions[0].hp);
      companionToggleCondition(oc.id, 'Prone');
      check('conditions write back', ch.ownCompanions[0].conditions.includes('Prone'), ch.ownCompanions[0].conditions);
      ch.classes[0].level = 3; ch.level = 3; migrateCharacter(ch);
      check('Review focus: level-down clamps HP to the new max', ch.ownCompanions[0].hp === 20, ch.ownCompanions[0].hp);
      ch.ownCompanions.push({ id: 'ghost', templateKey: 'Nope|XX', name: 'Ghost', hp: 3 });
      migrateCharacter(ch);
      const g = _companionById('ghost');
      check('Review focus: unknown template is shown as missing, not thrown', g && g._missing === true, g);
      ch.ownCompanions.push({ id: 'evil', templateKey: 'Steel Defender|TCE', name: '<img src=x onerror=alert(1)>', hp: 'lots' });
      migrateCharacter(ch);
      const e = ch.ownCompanions.find(c => c.id === 'evil');
      check('Review focus: junk is sanitised', e.hp === 0 && typeof e.name === 'string', e);
      dismissOwnCompanion(ch.id, 'evil'); dismissOwnCompanion(ch.id, 'ghost');
      check('dismiss removes it', !ch.ownCompanions.some(c => c.id === 'evil' || c.id === 'ghost'), ch.ownCompanions.map(c => c.id));
    } catch (err) { check('task 4 block ran', false, err.message + err.stack); }
  });

  const results = await pg.evaluate(() => out);
  results.forEach(r => console.log(r));
  if (errs.length) console.log('PAGE ERRORS:', errs);
  const failed = results.filter(r => r.startsWith('FAIL')).length + errs.length;
  console.log(failed ? `\n${failed} failed` : `\nAll ${results.length} passed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
```

Add `'own-companions.browser.test.js'` to the default list in `tests/run-browser-tests.js`.

- [ ] **Step 2: Run to verify it fails**

Run: `cd tests && node own-companions.browser.test.js`
Expected: FAIL "templates are loaded" (and the block error `addOwnCompanion is not defined`).

- [ ] **Step 3: Load the scripts** — in `index.html`, next to the other rules scripts before `app.js`:

```html
  <script src="companion-templates-rules.js?v=1"></script>
  <script src="data/companion_templates.js?v=1" defer></script>
```

(Check how `companion-rules.js` is tagged and match it; data scripts already use `defer` and `app.js` must also be `defer` or after them — follow the existing ordering of `data/class_options.js`.)

- [ ] **Step 4: Migrate** — in `migrateCharacter(ch)` after the `activeConcentration` lines:

```js
  if (!Array.isArray(ch.ownCompanions)) ch.ownCompanions = [];
  ch.ownCompanions = ch.ownCompanions.map(c => sanitizeOwnCompanion(c, CONDITIONS)).filter(Boolean);
  if (!Array.isArray(ch.companionOffers)) ch.companionOffers = [];
  _syncOwnCompanions(ch);
```

and add near the companion helpers:

```js
// ── Own companions (Stage 2): class companions, summons, familiars, mounts — stored on the character ──
function _ownTemplate(oc) { return typeof COMPANION_TEMPLATES !== 'undefined' ? COMPANION_TEMPLATES[oc?.templateKey] || null : null; }
function _ownResolve(ch, oc) {
  const t = _ownTemplate(oc); if (!t) return null;
  return resolveCompanion(t, oc, companionContext(ch, t, oc));
}
// Keeps HP inside the live maximum (a level-down or a removed GM edit can lower it)
function _syncOwnCompanions(ch) {
  (ch.ownCompanions || []).forEach(oc => {
    const r = _ownResolve(ch, oc);
    if (r && r.maxHP !== null && oc.hp > r.maxHP) oc.hp = r.maxHP;
  });
}
const _ORD = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
function _ownCompanionLabel(t, oc) {
  if (!t) return 'unknown creature';
  if (t.kind === 'summon') return oc.spellLevel ? `summoned, ${_ORD[oc.spellLevel]} level` : 'summoned';
  if (t.kind === 'familiar') return 'familiar';
  if (t.kind === 'mount') return 'mount';
  return t.group || t.name;
}
function _ownCompanionView(ch, oc) {
  const t = _ownTemplate(oc), r = t && _ownResolve(ch, oc);
  const common = { id: oc.id, _own: { charId: ch.id }, ownerCharId: ch.id, name: oc.name || t?.name || 'Unknown creature',
    tempHP: oc.tempHP || 0, conditions: oc.conditions || [], uses: oc.uses || {}, portrait: oc.portrait, portraitZoom: oc.portraitZoom,
    portraitX: oc.portraitX, portraitY: oc.portraitY, playerAccess: 'play', location: '', race: '', legendaryMax: 0 };
  if (!r) return { ...common, _missing: true, role: 'unknown creature', ac: 10, maxHP: 1, hp: 0, statBlock: null, statSource: '', initBonus: 0 };
  return { ...common, _tpl: t, _res: r, role: _ownCompanionLabel(t, oc), ac: r.ac ?? 10, maxHP: r.maxHP ?? 1,
    hp: Math.min(oc.hp, r.maxHP ?? oc.hp), statBlock: _statBlockFromMonster(r.monster).statBlock, statSource: t.name,
    initBonus: r.initBonus };
}
function _findOwnCompanion(id) {
  for (const ch of Object.values(db.characters || {})) {
    const oc = (ch.ownCompanions || []).find(c => c.id === id);
    if (oc) return { ch, oc };
  }
  return null;
}
function addOwnCompanion(charId, templateKey, opts = {}) {
  const ch = db.characters[charId], t = COMPANION_TEMPLATES[templateKey]; if (!ch || !t) return null;
  const oc = newOwnCompanion(t, { ...opts, id: uid() });
  ch.ownCompanions = ch.ownCompanions || [];
  ch.ownCompanions.push(oc);
  const r = _ownResolve(ch, oc);
  oc.hp = r && r.maxHP !== null ? r.maxHP : 0;
  saveData(db);
  return oc;
}
function dismissOwnCompanion(charId, ocId, reason) {
  const ch = db.characters[charId]; if (!ch) return;
  const oc = (ch.ownCompanions || []).find(c => c.id === ocId); if (!oc) return;
  ch.ownCompanions = ch.ownCompanions.filter(c => c.id !== ocId);
  if (reason) showToast(`<strong>${esc(oc.name)}</strong> ${esc(reason)}`);
  saveData(db);
}
```

- [ ] **Step 5: Route lookups and writes** — change the existing helpers:

```js
function _companionById(id) {
  const c = (db.companions || {})[id]; if (c) return c;
  const f = _findOwnCompanion(id);
  return f ? _ownCompanionView(f.ch, f.oc) : null;
}
```

In `_companionWrite(comp, patch)`, as the first statement after `if (!comp) return;`:

```js
  if (comp._own) {
    const f = _findOwnCompanion(comp.id); if (!f) return;
    const allowed = ['hp', 'tempHP', 'conditions', 'uses', 'portrait', 'portraitZoom', 'portraitX', 'portraitY', 'name', 'hitDiceUsed'];
    for (const [k, v] of Object.entries(patch)) if (allowed.includes(k)) f.oc[k] = v;
    Object.assign(comp, patch);
    saveData(db);
    return;
  }
```

`_companionEditable(comp)`: return `new Set(['hp','tempHP','conditions','uses','portrait','portraitZoom','portraitX','portraitY'])` when `comp?._own` (the Stage 1 Full-edit stat fields stay off; own companions have their own rename / GM edit UI in Task 6).

`setCompanionPortrait` / `removeCompanionPortrait` look up via `(db.companions || {})[companionId]` — change both to `_companionById(companionId)`.

`companionRest(id, rest)` uses `comp.maxHP` — the view's `maxHP` is live, so it works unchanged.

- [ ] **Step 6: Run the browser test**

Run: `cd tests && node own-companions.browser.test.js`
Expected: all PASS.

- [ ] **Step 7: Run the other suites** — `node tests/companion.test.js`, `node tests/companion-templates.test.js`, `cd tests && node companion.browser.test.js` → all pass.

- [ ] **Step 8: Commit**

```bash
git add index.html app.js tests/own-companions.browser.test.js tests/run-browser-tests.js
git commit -m "Store own companions on the character and reuse the companion sheet"
```

---

### Task 5: Companions panel, add picker, modal sheet, player tabs

**Files:**
- Modify: `app.js` (`renderCharacterSheet` ~8204; `_pvCharacterViewHtml`; new functions near own-companion helpers), `style.css`
- Test: `tests/own-companions.browser.test.js`

**Interfaces:**
- Consumes: Task 4 functions.
- Produces: `renderOwnCompanionsPanel(ch) → html`, `openAddOwnCompanionModal(charId)`, `_ownCompanionChoices(ch) → [{group, label, items: [{key, name, variants, spellLevel}]}]`, `confirmAddOwnCompanion(charId, key)`, `openOwnCompanionModal(charId, ocId)`, `_confirmDismissOwn` state + `askDismissOwnCompanion(charId, ocId)`.

- [ ] **Step 1: Write the failing tests** (new `await pg.evaluate` block before the results block)

```js
  // Task 5: panel, picker, modal, player tabs
  await pg.evaluate(() => {
    try {
      const ch = setup('Artificer', 7, 'Battle Smith');
      ch.spells.known = [{ name: 'Find Familiar', level_int: 1 }];
      const groups = _ownCompanionChoices(ch);
      const names = g => (groups.find(x => x.group === g)?.items || []).map(i => i.name);
      check('class group offers the Steel Defender for a Battle Smith', names('From your class').includes('Steel Defender'), groups.map(g => g.group));
      check('class group hides other classes\' companions', !names('From your class').includes('Drake Companion'), names('From your class'));
      check('familiar forms come from a known Find Familiar', names('Familiars').includes('Owl'), names('Familiars'));
      check('no Pact of the Chain forms without the pact', !names('Familiars').includes('Imp'), names('Familiars'));
      check('mounts are always offered', names('Mounts & pets').includes('Riding Horse'), names('Mounts & pets'));
      openAddOwnCompanionModal(ch.id);
      check('picker modal opens', /Add companion/.test(document.getElementById('modal-content').innerHTML), null);
      confirmAddOwnCompanion(ch.id, 'Steel Defender|TCE');
      renderApp();
      const panel = document.querySelector('.own-companions-panel');
      check('GM character page shows the panel with the companion', panel && /Steel Defender/.test(panel.textContent), panel?.textContent);
      const oc = ch.ownCompanions[0];
      openOwnCompanionModal(ch.id, oc.id);
      check('clicking opens the sheet in a modal', /companion-sheet/.test(document.getElementById('modal-content').innerHTML), null);
      closeModal();
      askDismissOwnCompanion(ch.id, oc.id); renderApp();
      check('dismiss asks first', ch.ownCompanions.length === 1 && /Dismiss/.test(document.querySelector('.own-companions-panel').innerHTML), null);
      dismissOwnCompanion(ch.id, oc.id); _confirmDismissOwn = null;
      // Player view tabs
      const oc2 = addOwnCompanion(ch.id, 'Owl|MM') || addOwnCompanion(ch.id, Object.keys(COMPANION_TEMPLATES).find(k => k.startsWith('Owl|') && COMPANION_TEMPLATES[k].kind === 'familiar'));
      IS_PLAYER_VIEW = true; renderApp();
      const tabs = [...document.querySelectorAll('.pv-tab')].map(t => t.textContent);
      check('player view has a tab per own companion', tabs.some(t => /Owl \(familiar\)/.test(t)), tabs);
      pvShowTab(oc2.id);
      check('own companion tab renders its sheet', !!document.querySelector('.companion-sheet'), null);
      IS_PLAYER_VIEW = false; _pvTab = 'character';
    } catch (err) { check('task 5 block ran', false, err.message + err.stack); }
  });
```

- [ ] **Step 2: Run to verify it fails** — `cd tests && node own-companions.browser.test.js` → task 5 FAILs (`_ownCompanionChoices is not defined`).

- [ ] **Step 3: Implement the choices**

```js
// What a character may add: their class's companions, summons from spells they know or have prepared,
// familiar forms (Pact of the Chain adds more), and mounts & pets. Templates match the character's edition.
function _ownCompanionChoices(ch) {
  const T = typeof COMPANION_TEMPLATES !== 'undefined' ? Object.values(COMPANION_TEMPLATES) : [];
  const ed = ch.edition === '2014' ? '2014' : '2024';
  const classes = (ch.classes && ch.classes.length) ? ch.classes : [{ class: ch.class, subclass: ch.subclass, level: ch.level }];
  const spellNames = new Set([...(ch.spells?.known || []), ...(ch.spells?.prepared || [])].map(s => (s && s.name) || s));
  const hasPact = (ch.featuresList || []).some(f => f.name === 'Pact of the Chain');
  // Prefer the character's edition; fall back to the other one when a creature has no version in it
  const byEdition = list => {
    const seen = new Map();
    list.forEach(t => { const k = t.name; const cur = seen.get(k); if (!cur || (cur.edition !== ed && t.edition === ed)) seen.set(k, t); });
    return [...seen.values()];
  };
  const item = t => ({ key: t.key, name: t.name, variants: t.variants, spellLevel: t.grantedBy.spellLevel || null, group: t.group });
  const fromClass = byEdition(T.filter(t => t.kind === 'class' && classes.some(c => c.class === t.grantedBy.cls
    && (parseInt(c.level) || 1) >= (t.grantedBy.level || 1) && (!t.grantedBy.subclass || String(c.subclass || '').includes(t.grantedBy.subclass)))));
  const summons = byEdition(T.filter(t => t.kind === 'summon' && spellNames.has(t.grantedBy.spell)));
  const familiars = spellNames.has('Find Familiar') || hasPact
    ? byEdition(T.filter(t => t.kind === 'familiar' && (t.group === 'Find Familiar' || hasPact))) : [];
  const mounts = byEdition(T.filter(t => t.kind === 'mount'));
  return [
    { group: 'From your class', items: fromClass.map(item) },
    { group: 'Summon spells', items: summons.map(item) },
    { group: 'Familiars', items: familiars.map(item) },
    { group: 'Mounts & pets', items: mounts.map(item) },
  ].filter(g => g.items.length);
}
```

Note: `byEdition` keys on name, so two different Steel Defenders (TCE, EFA) collapse to the edition match — intended. For a 2024 Artificer (app keeps Artificer on 2014 rules), both are `class`; `ed` is '2024' so EFA wins — correct for a 2024 character.

- [ ] **Step 4: Implement the picker and panel**

```js
let _confirmDismissOwn = null;   // ocId while the in-page "Dismiss?" confirm is shown
function openAddOwnCompanionModal(charId) {
  const ch = db.characters[charId]; if (!ch) return;
  const groups = _ownCompanionChoices(ch);
  openModal(`<h2>Add companion</h2>
    ${groups.length ? groups.map(g => `<div class="panel-title" style="margin:0.6rem 0 0.4rem">${esc(g.group)}</div>
      <div class="flex gap-1 flex-wrap">${g.items.map(i => `<button class="btn btn-sm" onclick="confirmAddOwnCompanion('${charId}','${jsStr(i.key)}')">${esc(i.name)}${i.group !== i.name && g.group === 'Summon spells' ? ` <span class="text-dim">· ${esc(i.group)}</span>` : ''}</button>`).join('')}</div>`).join('')
      : '<p class="text-dim">Nothing to add yet — learn a summon spell or Find Familiar, or reach your class\'s companion feature.</p>'}
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button></div>`);
}
// Variants and spell level are asked in a second step when the template needs them
function confirmAddOwnCompanion(charId, key, variant, spellLevel) {
  const t = COMPANION_TEMPLATES[key]; if (!t) return;
  const needLevel = t.kind === 'summon' && t.grantedBy.spellLevel && spellLevel === undefined && t.concentration;
  if ((t.variants && variant === undefined) || needLevel) { _openOwnFormPicker(charId, key, { variant, spellLevel }); return; }
  addOwnCompanion(charId, key, { variant: variant || null, spellLevel: spellLevel || null });
  closeModal(); renderApp();
}
function _openOwnFormPicker(charId, key, sel, extra = {}) {
  const t = COMPANION_TEMPLATES[key];
  const levels = t.kind === 'summon' && t.grantedBy.spellLevel ? Array.from({ length: 10 - t.grantedBy.spellLevel }, (_, i) => t.grantedBy.spellLevel + i) : [];
  openModal(`<h2>${esc(extra.title || t.name)}</h2>
    ${levels.length ? `<div class="form-group"><label>Spell level</label><select id="own-sl">${levels.map(l => `<option value="${l}"${l === (sel.spellLevel || t.grantedBy.spellLevel) ? ' selected' : ''}>${_ORD[l]}</option>`).join('')}</select></div>` : ''}
    ${t.variants ? `<div class="form-group"><label>Form</label><select id="own-variant">${t.variants.map(v => `<option${v === sel.variant ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></div>` : ''}
    ${extra.combatBox || ''}
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="${extra.onConfirm || `confirmAddOwnCompanion('${charId}','${jsStr(key)}', document.getElementById('own-variant')?.value || null, parseInt(document.getElementById('own-sl')?.value) || null)`}">Add</button></div>`);
}
function askDismissOwnCompanion(charId, ocId) { _confirmDismissOwn = ocId; renderApp(); }
function openOwnCompanionModal(charId, ocId) {
  const comp = _companionById(ocId); if (!comp) return;
  openModal(`<div class="own-companion-modal">${renderCompanionSheet(comp)}</div>
    <div class="form-actions"><button class="btn" onclick="closeModal()">Close</button></div>`);
}
function renderOwnCompanionsPanel(ch) {
  const list = (ch.ownCompanions || []).map(oc => _ownCompanionView(ch, oc));
  return `<div class="sheet-panel own-companions-panel">
    <div class="cs-section-label">Companions</div>
    ${list.map(c => `<div class="own-companion-row">
      ${_companionArtHtml(c, 40)}
      <button class="own-companion-open" onclick="openOwnCompanionModal('${ch.id}','${c.id}')">
        <strong>${esc(c.name)}</strong> <span class="text-dim">(${esc(c.role)})</span>
        ${c.hp <= 0 ? '<span class="defeated-tag">Down</span>' : ''}
        <span class="own-companion-hp">${esc(c.hp)} / ${esc(c.maxHP)} HP</span>
      </button>
      ${_confirmDismissOwn === c.id
        ? `<span class="npc-companion-confirm">Dismiss ${esc(c.name)}? <button class="btn btn-sm btn-danger" onclick="_confirmDismissOwn=null;dismissOwnCompanion('${ch.id}','${c.id}');renderApp()">Dismiss</button><button class="btn btn-sm" onclick="_confirmDismissOwn=null;renderApp()">Keep</button></span>`
        : `<button class="btn btn-sm" onclick="askDismissOwnCompanion('${ch.id}','${c.id}')">Dismiss</button>`}
    </div>`).join('') || '<p class="text-dim" style="font-size:0.82rem;margin:0">No companions.</p>'}
    <button class="btn btn-sm" style="margin-top:0.5rem" onclick="openAddOwnCompanionModal('${ch.id}')">+ Add companion</button>
  </div>`;
}
```

In `renderCharacterSheet()`, insert `${!IS_PLAYER_VIEW ? renderOwnCompanionsPanel(ch) : ''}` after the Combat panel output (find where `renderCombatSection` / the combat panel html is concatenated and add it right after). In the player view, the owner manages companions from their tabs: add a `+ Add companion` button to the player tab bar (below).

`_pvCharacterViewHtml()` — extend the tab list:

```js
  const own = (ch?.ownCompanions || []).map(oc => _ownCompanionView(ch, oc));
  const all = comps.concat(own);
  if (_pvTab !== 'character' && !all.some(c => c.id === _pvTab)) _pvTab = 'character';
  const tabs = `<div class="pv-tabs" role="tablist">
      <button class="pv-tab${_pvTab === 'character' ? ' active' : ''}" role="tab" aria-selected="${_pvTab === 'character'}" onclick="pvShowTab('character')">${esc(ch?.name || 'Character')}</button>
      ${comps.map(c => `<button class="pv-tab${_pvTab === c.id ? ' active' : ''}" role="tab" aria-selected="${_pvTab === c.id}" onclick="pvShowTab('${c.id}')">${esc(c.name)} (companion)</button>`).join('')}
      ${own.map(c => `<button class="pv-tab${_pvTab === c.id ? ' active' : ''}" role="tab" aria-selected="${_pvTab === c.id}" onclick="pvShowTab('${c.id}')">${esc(c.name)} (${esc(c.role)})</button>`).join('')}
      ${ch ? `<button class="pv-tab pv-tab-add" onclick="openAddOwnCompanionModal('${ch.id}')" title="Add companion">+</button>` : ''}
    </div>`;
  return tabs + (_pvTab === 'character' ? renderCharacterSheet() : renderCompanionSheet(_companionById(_pvTab)));
```

(The tab bar now always shows, because of the `+` button.) On an own companion's sheet in the player view, show a Dismiss button (Task 6 adds it to the sheet header for both views).

CSS (append to `style.css`):

```css
.own-companion-row { display:flex; align-items:center; gap:0.5rem; padding:0.3rem 0; border-bottom:1px solid var(--border); }
.own-companion-open { flex:1; display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap; background:none; border:0; color:inherit; text-align:left; cursor:pointer; font:inherit; }
.own-companion-hp { margin-left:auto; font-size:0.8rem; color:var(--text-dim); }
.pv-tab-add { min-width:2rem; }
```

- [ ] **Step 5: Run tests** — `cd tests && node own-companions.browser.test.js` → all PASS; `node companion.browser.test.js` still passes (its tab tests may assume tabs hidden when no companions — if it checks "no tabs without companions", update that check to "no companion tabs" i.e. only the character tab and `+`).

- [ ] **Step 6: Commit**

```bash
git add app.js style.css tests/own-companions.browser.test.js tests/companion.browser.test.js
git commit -m "Companions panel, add picker and player tabs for own companions"
```

---

### Task 6: Sheet extras — formula notes, GM edits, hit dice, revive, rename, Dismiss

**Files:**
- Modify: `app.js` (`renderCompanionSheet`; new own-companion edit functions), `style.css`
- Test: `tests/own-companions.browser.test.js`

**Interfaces:**
- Consumes: `comp._own`, `comp._res` (`notes`, `edited`, `unresolved`, `hitDice`, `formulaText`), `comp._tpl` (`revive`).
- Produces: `setOwnOverride(ocId, field, value)`, `resetOwnOverride(ocId, field)`, `renameOwnCompanion(ocId, name)`, `ownSpendHitDie(ocId)`, `renderOwnSheetExtras(comp) → html`.

- [ ] **Step 1: Write the failing tests**

```js
  // Task 6: sheet extras
  await pg.evaluate(() => {
    try {
      const ch = setup('Artificer', 7, 'Battle Smith');
      const oc = addOwnCompanion(ch.id, 'Steel Defender|TCE');
      const html = () => renderCompanionSheet(_companionById(oc.id));
      check('formula note under HP', /40 = 2 \+ INT 3 \+ 5 × Artificer 7/.test(html()), null);
      check('hit dice shown', /7d8/.test(html()) || /Hit Dice[^<]*7/.test(html()), null);
      setOwnOverride(oc.id, 'maxHP', 55);
      check('GM edit changes max HP', _companionById(oc.id).maxHP === 55, _companionById(oc.id).maxHP);
      check('GM edited mark shows', /GM edited/.test(html()), null);
      ch.classes[0].level = 9; ch.level = 9; migrateCharacter(ch);
      check('override survives a level-up', _companionById(oc.id).maxHP === 55, _companionById(oc.id).maxHP);
      resetOwnOverride(oc.id, 'maxHP');
      check('reset to calculated', _companionById(oc.id).maxHP === 50, _companionById(oc.id).maxHP);
      setOwnOverride(oc.id, 'attackBonus', 11);
      check('attack bonus override reaches the stat block', /\+11 to hit/.test(JSON.stringify(_companionById(oc.id).statBlock.actions)), null);
      renameOwnCompanion(oc.id, 'Clank');
      check('rename', ch.ownCompanions[0].name === 'Clank' && _companionById(oc.id).name === 'Clank', ch.ownCompanions[0].name);
      companionDamage(oc.id, 999);
      check('revive rule text shows when Down', /Down/.test(html()) && /(mending|returns to life)/i.test(html()), null);
      IS_PLAYER_VIEW = true;
      check('players do not get GM edit buttons', !/data-own-edit/.test(html()), null);
      check('players can rename and dismiss', /own-rename/.test(html()) && /Dismiss/.test(html()), null);
      IS_PLAYER_VIEW = false;
      ownSpendHitDie(oc.id);
      check('spending a hit die is tracked', ch.ownCompanions[0].hitDiceUsed === 1, ch.ownCompanions[0].hitDiceUsed);
      companionRest(oc.id, 'long');
      check('long rest restores HP and hit dice', ch.ownCompanions[0].hp === _companionById(oc.id).maxHP && ch.ownCompanions[0].hitDiceUsed === 0, ch.ownCompanions[0]);
    } catch (err) { check('task 6 block ran', false, err.message + err.stack); }
  });
```

- [ ] **Step 2: Run to verify it fails** — FAIL `setOwnOverride is not defined`.

- [ ] **Step 3: Implement the functions**

```js
function _ownEditTarget(ocId) { return _findOwnCompanion(ocId); }
// GM edits: stored as overrides, kept through level-ups, cleared by "Reset to calculated"
function setOwnOverride(ocId, field, value) {
  const f = _ownEditTarget(ocId); if (!f || !OWN_COMPANION_OVERRIDES.includes(field)) return;
  if (value === '' || value === null || value === undefined) { resetOwnOverride(ocId, field); return; }
  f.oc.overrides = { ...(f.oc.overrides || {}), [field]: field === 'speed' ? String(value).slice(0, 100) : (parseInt(value) || 0) };
  _syncOwnCompanions(f.ch); saveData(db); renderApp();
}
function resetOwnOverride(ocId, field) {
  const f = _ownEditTarget(ocId); if (!f) return;
  const o = { ...(f.oc.overrides || {}) }; delete o[field]; f.oc.overrides = o;
  _syncOwnCompanions(f.ch); saveData(db); renderApp();
}
function renameOwnCompanion(ocId, name) {
  const f = _ownEditTarget(ocId); if (!f) return;
  f.oc.name = String(name || '').trim().slice(0, 200) || _ownTemplate(f.oc)?.name || 'Companion';
  saveData(db); renderApp();
}
function ownSpendHitDie(ocId) {
  const f = _ownEditTarget(ocId); if (!f) return;
  const r = _ownResolve(f.ch, f.oc); if (!r?.hitDice) return;
  if ((f.oc.hitDiceUsed || 0) >= r.hitDice.count) { showToast('No hit dice left.'); return; }
  const roll = rollDice('1' + r.hitDice.die);
  const con = Math.floor(((r.monster.con || 10) - 10) / 2);
  const gain = Math.max(1, roll.total + con);
  f.oc.hitDiceUsed = (f.oc.hitDiceUsed || 0) + 1;
  f.oc.hp = Math.min(r.maxHP, f.oc.hp + gain);
  showToast(`${esc(f.oc.name)} spends a hit die: <strong>+${gain}</strong> HP`);
  saveData(db); renderApp();
}
```

`companionRest` long rest: after the existing `_companionWrite`, add `if (comp._own) { const f = _findOwnCompanion(id); if (f) { f.oc.hitDiceUsed = 0; saveData(db); } }` (2014 rules restore half — use `Math.floor(count/2)` restored when the owner is 2014: `f.oc.hitDiceUsed = f.ch.edition === '2014' ? Math.max(0, (f.oc.hitDiceUsed||0) - Math.max(1, Math.floor((r.hitDice.count)/2))) : 0`). Update the test expectation only if the test character is 2014 — it is (`setup` sets 2014), so for this test give 1 used die → restore max(1, floor(9/2)=4) → 0. Test stays as written.

- [ ] **Step 4: Render the extras** — in `renderCompanionSheet(comp)`:

1. After the `companion-owner` line, when `comp._own`: replace "Companion of X" text with `${esc(_ownCompanionLabel(comp._tpl, …))} · ${esc(_companionOwnerName(comp))}'s` — use `comp.role` (already the label): `${comp._own ? `${esc(comp.role)} &middot; ${esc(_companionOwnerName(comp))}'s` : `Companion of ${esc(_companionOwnerName(comp))}`}`.
2. Replace `${down ? ' <span class="defeated-tag">Down</span>' : ''}` — keep, and add after the vitals panel: `${comp._own ? renderOwnSheetExtras(comp) : ''}`.

```js
function renderOwnSheetExtras(comp) {
  const f = _findOwnCompanion(comp.id); if (!f) return '';
  const { ch, oc } = f, r = comp._res, t = comp._tpl;
  if (comp._missing) return `<div class="sheet-panel"><p class="text-dim">This creature's data is no longer available.</p>
    <button class="btn btn-sm btn-danger" onclick="dismissOwnCompanion('${ch.id}','${oc.id}');closeModal();renderApp()">Dismiss</button></div>`;
  const gm = !IS_PLAYER_VIEW;
  const fieldRow = (label, field, value, note) => {
    const edited = r.edited.includes(field);
    const unresolved = r.unresolved.includes(field);
    return `<div class="own-field">
      <span class="stat-label">${label}</span> <strong>${esc(value ?? '—')}</strong>
      ${edited ? `<span class="own-gm-edited">GM edited</span>${gm ? ` <button class="btn btn-sm" onclick="resetOwnOverride('${oc.id}','${field}')">Reset to calculated</button>` : ''}` : ''}
      ${note && !edited ? `<div class="own-formula-note">${esc(note)}</div>` : ''}
      ${unresolved ? `<div class="own-formula-note">${esc(r.formulaText[field === 'maxHP' ? 'hp' : 'ac'] || '')} — enter the number:
        <input type="number" class="own-manual" onchange="setOwnOverride('${oc.id}','${field}',this.value)"></div>` : ''}
      ${gm && !unresolved ? `<button class="btn btn-sm" data-own-edit="${field}" onclick="const v=prompt('${label}', '${esc(String(value ?? ''))}'); if(v!==null) setOwnOverride('${oc.id}','${field}',v)">Edit</button>` : ''}
    </div>`;
  };
  const hd = r.hitDice;
  return `<div class="sheet-panel own-sheet-extras">
    <div class="own-rename-row"><label>Name <input class="own-rename" value="${esc(oc.name)}" onchange="renameOwnCompanion('${oc.id}',this.value)"></label>
      <button class="btn btn-sm btn-danger" onclick="dismissOwnCompanion('${ch.id}','${oc.id}');closeModal();renderApp()">Dismiss</button></div>
    ${fieldRow('AC', 'ac', comp.ac, r.notes.ac)}
    ${fieldRow('Max HP', 'maxHP', comp.maxHP, r.notes.hp)}
    ${gm ? `${fieldRow('Speed', 'speed', r.speed)}${fieldRow('Initiative bonus', 'initBonus', r.initBonus)}
      ${fieldRow('Attack bonus', 'attackBonus', (oc.overrides || {}).attackBonus)}${fieldRow('Save DC', 'saveDC', (oc.overrides || {}).saveDC)}` : ''}
    ${hd ? `<div class="own-field"><span class="stat-label">Hit Dice</span> <strong>${hd.count - (oc.hitDiceUsed || 0)} / ${hd.count}${esc(hd.die)}</strong>
      <button class="btn btn-sm" onclick="ownSpendHitDie('${oc.id}')">Spend</button></div>` : ''}
    ${comp.hp <= 0 && t.revive ? `<div class="own-revive"><span class="defeated-tag">Down</span> ${esc(t.revive)}</div>` : ''}
  </div>`;
}
```

Note: `prompt()` triggers a browser dialog — the browser tests call `setOwnOverride` directly, never the button. Replace `prompt` with an inline number input if a dialog-free UI is preferred: `<input type="number" data-own-edit="${field}" placeholder="Edit" onchange="setOwnOverride('${oc.id}','${field}',this.value)">` — **use this input version** (no dialogs in this app's test setup), the `data-own-edit` attribute stays for the test.

CSS:

```css
.own-field { display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap; padding:0.2rem 0; }
.own-formula-note { flex-basis:100%; font-size:0.75rem; color:var(--text-dim); }
.own-gm-edited { font-size:0.68rem; padding:1px 6px; border-radius:99px; border:1px solid var(--gold); color:var(--gold); }
.own-field input[type=number] { width:5rem; }
.own-rename-row { display:flex; gap:0.5rem; align-items:center; justify-content:space-between; flex-wrap:wrap; margin-bottom:0.4rem; }
.own-revive { margin-top:0.4rem; font-size:0.8rem; }
```

- [ ] **Step 5: Run tests** — browser test all PASS.

- [ ] **Step 6: Commit**

```bash
git add app.js style.css tests/own-companions.browser.test.js
git commit -m "Formula notes, GM edits, hit dice and revive text on companion sheets"
```

---

### Task 7: Casting summons, Find Familiar and Find Steed

**Files:**
- Modify: `app.js` (`confirmCast`, `confirmCastPact`, `confirmCastRitual`; new `_afterCastCompanion`)
- Test: `tests/own-companions.browser.test.js`

**Interfaces:**
- Consumes: `_openOwnFormPicker(charId, key, sel, extra)` (Task 5), `addOwnCompanion` (Task 4).
- Produces: `_summonTemplatesFor(ch, spellName) → template[]`, `_afterCastCompanion(ch, spellName, level)`, `confirmSummon(charId, key, spellLevel)`.

- [ ] **Step 1: Write the failing tests**

```js
  // Task 7: cast hooks
  await pg.evaluate(() => {
    try {
      const ch = setup('Druid', 9, 'Circle of the Land'); ch.edition = '2024';
      ch.spells.slots = { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 }; ch.spells.known = [{ name: 'Summon Beast', level_int: 2 }, { name: 'Find Familiar', level_int: 1 }];
      currentCharId = ch.id;
      confirmCast('Summon Beast', 4);
      const m = document.getElementById('modal-content').innerHTML;
      check('casting a summon asks for the form', /Bestial Spirit/.test(m) && /own-variant/.test(m), m.slice(0, 200));
      document.getElementById('own-variant').value = 'Land';
      document.querySelector('#modal-content .btn-primary').click();
      const s = ch.ownCompanions.find(c => c.templateKey === 'Bestial Spirit|XPHB');
      check('summon added at the cast level with its concentration spell', s && s.spellLevel === 4 && s.variant === 'Land' && s.concentrationSpell === 'Summon Beast', s);
      check('summon HP uses the cast level', s && s.hp === 40, s?.hp);
      confirmCast('Summon Beast', 3);
      document.querySelector('#modal-content .btn-primary').click();
      check('casting it again replaces the earlier summon', ch.ownCompanions.filter(c => c.templateKey === 'Bestial Spirit|XPHB').length === 1
        && ch.ownCompanions.find(c => c.templateKey === 'Bestial Spirit|XPHB').spellLevel === 3, ch.ownCompanions);
      confirmCast('Find Familiar', 1);
      check('Find Familiar asks which form', /own-familiar-form/.test(document.getElementById('modal-content').innerHTML), null);
      const sel = document.getElementById('own-familiar-form'); sel.value = [...sel.options].find(o => /^Owl/.test(o.textContent)).value;
      document.querySelector('#modal-content .btn-primary').click();
      confirmCast('Find Familiar', 1);
      const sel2 = document.getElementById('own-familiar-form'); sel2.value = [...sel2.options].find(o => /^Cat/.test(o.textContent)).value;
      document.querySelector('#modal-content .btn-primary').click();
      const fams = ch.ownCompanions.filter(c => COMPANION_TEMPLATES[c.templateKey]?.kind === 'familiar');
      check('only one familiar at a time', fams.length === 1 && /Cat/.test(fams[0].templateKey), fams.map(f => f.templateKey));
      closeModal();
    } catch (err) { check('task 7 block ran', false, err.message + err.stack); }
  });
```

- [ ] **Step 2: Run to verify it fails** — FAIL "casting a summon asks for the form".

- [ ] **Step 3: Implement**

```js
// Summon templates for a spell, preferring the character's edition
function _summonTemplatesFor(ch, spellName) {
  if (typeof COMPANION_TEMPLATES === 'undefined') return [];
  const ed = ch.edition === '2014' ? '2014' : '2024';
  const all = Object.values(COMPANION_TEMPLATES).filter(t => t.kind === 'summon' && t.grantedBy.spell === spellName);
  const mine = all.filter(t => t.edition === ed);
  return mine.length ? mine : all;
}
// After a spell is cast: offer the creature it summons
function _afterCastCompanion(ch, spellName, level) {
  if (spellName === 'Find Familiar') { _openFamiliarPicker(ch); return true; }
  const ts = _summonTemplatesFor(ch, spellName);
  if (!ts.length) return false;
  if (ts.length === 1 && !ts[0].variants) { confirmSummon(ch.id, ts[0].key, level); return true; }
  if (ts.length === 1) {
    _openOwnFormPicker(ch.id, ts[0].key, { spellLevel: level }, {
      title: `${ts[0].name} summoned (${_ORD[level] || level} level) — choose form`,
      onConfirm: `confirmSummon('${ch.id}','${jsStr(ts[0].key)}',${level},document.getElementById('own-variant')?.value||null)`,
      combatBox: _summonCombatBox() });
    return true;
  }
  // Several creatures (Find Steed 2014 forms): pick one
  openModal(`<h2>${esc(spellName)} — choose a form</h2>
    <div class="form-group"><select id="own-summon-form">${ts.map(t => `<option value="${esc(t.key)}">${esc(t.name)}</option>`).join('')}</select></div>
    ${_summonCombatBox()}
    <div class="form-actions"><button class="btn" onclick="closeModal()">Not now</button>
      <button class="btn btn-primary" onclick="confirmSummon('${ch.id}',document.getElementById('own-summon-form').value,${level})">Add</button></div>`);
  return true;
}
function _summonCombatBox() { return ''; }   // Task 9 fills this in
function confirmSummon(charId, key, level, variant) {
  const ch = db.characters[charId], t = COMPANION_TEMPLATES[key]; if (!ch || !t) return;
  // Casting the same summon again replaces the earlier one from that spell
  ch.ownCompanions = (ch.ownCompanions || []).filter(c => COMPANION_TEMPLATES[c.templateKey]?.grantedBy?.spell !== t.grantedBy.spell);
  const oc = addOwnCompanion(charId, key, { variant: variant || null, spellLevel: t.concentration || t.hpF.expr?.includes('SL') ? level : null,
    concentrationSpell: t.concentration ? t.grantedBy.spell : null });
  closeModal(); renderApp();
  return oc;
}
function _openFamiliarPicker(ch) {
  const hasPact = (ch.featuresList || []).some(f => f.name === 'Pact of the Chain');
  const ed = ch.edition === '2014' ? '2014' : '2024';
  let forms = Object.values(COMPANION_TEMPLATES).filter(t => t.kind === 'familiar' && (t.group === 'Find Familiar' || hasPact));
  const mine = forms.filter(t => t.edition === ed); if (mine.length) forms = mine;
  openModal(`<h2>Find Familiar — choose a form</h2>
    <div class="form-group"><select id="own-familiar-form">${forms.map(t => `<option value="${esc(t.key)}">${esc(t.name)}${t.group === 'Pact of the Chain' ? ' (Pact of the Chain)' : ''}</option>`).join('')}</select></div>
    ${_summonCombatBox()}
    <div class="form-actions"><button class="btn" onclick="closeModal()">Not now</button>
      <button class="btn btn-primary" onclick="confirmFamiliar('${ch.id}',document.getElementById('own-familiar-form').value)">Add</button></div>`);
}
// One familiar at a time: a new one replaces the old
function confirmFamiliar(charId, key) {
  const ch = db.characters[charId]; if (!ch || !COMPANION_TEMPLATES[key]) return;
  ch.ownCompanions = (ch.ownCompanions || []).filter(c => COMPANION_TEMPLATES[c.templateKey]?.kind !== 'familiar');
  const oc = addOwnCompanion(charId, key);
  closeModal(); renderApp();
  return oc;
}
```

Hook it into the three cast paths. In `confirmCast`'s `docast`, replace `closeModal(); _preserveScroll(() => renderApp());` with:

```js
    closeModal();
    _preserveScroll(() => renderApp());
    _afterCastCompanion(ch, spellName, slotLevel);
```

Same in `confirmCastPact` (level `pactLvl`) and `confirmCastRitual` (level `fullSpellData(spellName, ch)?.level_int || 1`). `_afterCastCompanion` opens its own modal after the cast modal closed.

- [ ] **Step 4: Run tests** — PASS. Also run `cd tests && node spells.browser.test.js` (cast flows) → PASS.

- [ ] **Step 5: Commit**

```bash
git add app.js tests/own-companions.browser.test.js
git commit -m "Casting summon spells and Find Familiar adds the companion"
```

---

### Task 8: Concentration ends summons; class companion offers

**Files:**
- Modify: `app.js` (`_syncOwnCompanions`, `_syncSubclassFeaturesFor` caller / render path)
- Test: `tests/own-companions.browser.test.js`

**Interfaces:**
- Consumes: `staleConcentrationCompanions(ch)` (Task 3), `_ownCompanionChoices` (Task 5).
- Produces: `_pendingCompanionOffer(ch) → template|null`, `answerCompanionOffer(charId, key, add: boolean)`, `renderCompanionOffer(ch) → html`.

- [ ] **Step 1: Write the failing tests**

```js
  // Task 8: concentration + offers
  await pg.evaluate(() => {
    try {
      const ch = setup('Druid', 9, 'Circle of the Land'); ch.edition = '2024';
      ch.spells.slots = { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 }; ch.spells.known = [{ name: 'Summon Beast', level_int: 2 }, { name: 'Bless', level_int: 1 }];
      currentCharId = ch.id;
      const sum = () => ch.ownCompanions.find(c => c.concentrationSpell === 'Summon Beast');
      confirmSummon(ch.id, 'Bestial Spirit|XPHB', 2, 'Air'); ch.activeConcentration = { spellName: 'Summon Beast', castLevel: 2 };
      clearConcentration();
      check('clearing concentration dismisses the summon', !sum(), ch.ownCompanions);
      confirmSummon(ch.id, 'Bestial Spirit|XPHB', 2, 'Air'); ch.activeConcentration = { spellName: 'Summon Beast', castLevel: 2 };
      ch.activeConcentration = { spellName: 'Bless', castLevel: 1 }; renderApp();
      check('a new concentration spell dismisses it', !sum(), ch.ownCompanions);
      confirmSummon(ch.id, 'Bestial Spirit|XPHB', 2, 'Air'); ch.activeConcentration = { spellName: 'Summon Beast', castLevel: 2 };
      doLongRest();
      check('a long rest dismisses it', !sum(), ch.ownCompanions);
      const fam = addOwnCompanion(ch.id, Object.keys(COMPANION_TEMPLATES).find(k => COMPANION_TEMPLATES[k].kind === 'familiar'));
      doLongRest();
      check('familiars stay through a long rest', ch.ownCompanions.some(c => c.id === fam.id), ch.ownCompanions);
      // Offers
      const sm = setup('Artificer', 2, 'Battle Smith');
      check('no offer before the feature level', !_pendingCompanionOffer(sm), _pendingCompanionOffer(sm)?.key);
      sm.classes[0].level = 3; sm.level = 3; migrateCharacter(sm); renderApp();
      check('offer appears when the feature is gained', _pendingCompanionOffer(sm)?.name === 'Steel Defender' && /Add your Steel Defender\?/.test(document.body.innerHTML), _pendingCompanionOffer(sm)?.key);
      answerCompanionOffer(sm.id, _pendingCompanionOffer(sm).key, false);
      check('Not now records it and it does not come back', !_pendingCompanionOffer(sm) && sm.companionOffers.length === 1, sm.companionOffers);
      const sd = setup('Sorcerer', 6, 'Shadow Magic');
      check('temporary class creatures are not offered', !_pendingCompanionOffer(sd), _pendingCompanionOffer(sd)?.key);
      const bm = setup('Ranger', 3, 'Beast Master');
      const offer = _pendingCompanionOffer(bm);
      check('Beast Master gets one offer for the Primal Companion', offer && offer.group === 'Primal Companion', offer?.key);
      answerCompanionOffer(bm.id, offer.key, true);
      check('accepting opens the Land/Sea/Sky choice', /Beast of the Sea/.test(document.getElementById('modal-content').innerHTML), null);
      closeModal();
    } catch (err) { check('task 8 block ran', false, err.message + err.stack); }
  });
```

- [ ] **Step 2: Run to verify it fails.**

- [ ] **Step 3: Implement**

Extend `_syncOwnCompanions(ch)` (runs from `migrateCharacter` on every render, so it covers ×, a failed check cleared by the GM, a new concentration spell, and the long rest — check `doLongRest` clears `activeConcentration`; if it doesn't, add `ch.activeConcentration = null;` there, since a long rest ends concentration):

```js
function _syncOwnCompanions(ch) {
  const stale = typeof staleConcentrationCompanions === 'function' ? staleConcentrationCompanions(ch) : [];
  if (stale.length) {
    const gone = new Set(stale.map(c => c.id));
    ch.ownCompanions = ch.ownCompanions.filter(c => !gone.has(c.id));
    stale.forEach(c => { try { showToast(`<strong>${esc(c.name)}</strong> vanished (concentration ended)`); } catch (e) {} });
  }
  (ch.ownCompanions || []).forEach(oc => {
    const r = _ownResolve(ch, oc);
    if (r && r.maxHP !== null && oc.hp > r.maxHP) oc.hp = r.maxHP;
  });
}
```

(`showToast` may not exist during early load → the try/catch.) The dismissal mutates the record during render; `saveData` is not called there — call `saveData(db)` only when `stale.length` and `typeof saveData === 'function' && db` exist, guarded the same way.

Offers:

```js
// The first lasting class companion the character qualifies for and hasn't been asked about.
// Primal Companion beasts share one offer (by group).
function _pendingCompanionOffer(ch) {
  if (!ch || typeof COMPANION_TEMPLATES === 'undefined') return null;
  const asked = new Set(ch.companionOffers || []);
  const have = new Set((ch.ownCompanions || []).map(c => COMPANION_TEMPLATES[c.templateKey]?.group));
  const cls = (_ownCompanionChoices(ch).find(g => g.group === 'From your class')?.items || [])
    .map(i => COMPANION_TEMPLATES[i.key]).filter(t => t.offer);
  return cls.find(t => !asked.has(t.group) && !have.has(t.group)) || null;
}
function answerCompanionOffer(charId, key, add) {
  const ch = db.characters[charId], t = COMPANION_TEMPLATES[key]; if (!ch || !t) return;
  ch.companionOffers = [...new Set([...(ch.companionOffers || []), t.group])];
  saveData(db);
  if (!add) { renderApp(); return; }
  const siblings = _ownCompanionChoices(ch).find(g => g.group === 'From your class').items.filter(i => i.group === t.group);
  if (siblings.length > 1) {
    openModal(`<h2>${esc(t.group)} — choose your companion</h2>
      <div class="flex gap-1 flex-wrap">${siblings.map(i => `<button class="btn" onclick="confirmAddOwnCompanion('${charId}','${jsStr(i.key)}')">${esc(i.name)}</button>`).join('')}</div>
      <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button></div>`);
    return;
  }
  confirmAddOwnCompanion(charId, key);
}
function renderCompanionOffer(ch) {
  const t = _pendingCompanionOffer(ch); if (!t) return '';
  const name = t.group === 'Primal Companion' ? 'Primal Companion' : t.name;
  return `<div class="sheet-panel companion-offer">Add your ${esc(name)}?
    <button class="btn btn-sm btn-primary" onclick="answerCompanionOffer('${ch.id}','${jsStr(t.key)}',true)">Add</button>
    <button class="btn btn-sm" onclick="answerCompanionOffer('${ch.id}','${jsStr(t.key)}',false)">Not now</button></div>`;
}
```

Render `renderCompanionOffer(ch)` at the top of `renderOwnCompanionsPanel(ch)` (GM) and at the top of the player's character tab (in `_pvCharacterViewHtml`, before `renderCharacterSheet()` when `_pvTab === 'character'`). The test checks for "Add your Steel Defender?" in `document.body.innerHTML` with the GM character page open.

- [ ] **Step 4: Run tests** — PASS; also `node sheet.browser.test.js` (long rest) PASS.

- [ ] **Step 5: Commit**

```bash
git add app.js tests/own-companions.browser.test.js
git commit -m "End summons with concentration and offer class companions once"
```

---

### Task 9: Adding own companions to combat

**Files:**
- Modify: `app.js` (`quickAddCombatant` / `_confirmQuickAdd`, `addAllPcsToInitiative`, `openAddCombatantModal`, `_summonCombatBox`, `confirmSummon`, `confirmFamiliar`)
- Test: `tests/own-companions.browser.test.js`

**Interfaces:**
- Consumes: `_ownCompanionView`, `_findOwnCompanion`.
- Produces: `_ownCombatant(ch, oc, ownerInit?) → combatant` (with `ownCompanion: { charId, companionId }`), `_addOwnToCombat(charId, ocId, initiative?)`, `quickAddOwnCompanion(charId, ocId)`; quick-add modal for a character lists own companions as `<input type="checkbox" class="qa-own" value="<ocId>" checked>`.

- [ ] **Step 1: Write the failing tests**

```js
  // Task 9: adding to combat
  await pg.evaluate(() => {
    try {
      const ch = setup('Artificer', 7, 'Battle Smith');
      const sd = addOwnCompanion(ch.id, 'Steel Defender|TCE');
      const horse = addOwnCompanion(ch.id, Object.keys(COMPANION_TEMPLATES).find(k => k.startsWith('Riding Horse|')));
      const init = () => getCampaign().initiative;
      quickAddCombatant(ch.id, 'player');
      const boxes = [...document.querySelectorAll('#modal-content .qa-own')];
      check('quick add lists the character\'s companions ticked', boxes.length === 2 && boxes.every(b => b.checked), boxes.length);
      boxes.find(b => b.value === horse.id).checked = false;
      document.getElementById('qa-init').value = 15;
      _confirmQuickAdd();
      const rows = init().combatants;
      check('owner and ticked companion added, unticked left out', rows.length === 2 && rows.some(r => r.ownCompanion?.companionId === sd.id) && !rows.some(r => r.ownCompanion?.companionId === horse.id), rows.map(r => r.name));
      const sdRow = rows.find(r => r.ownCompanion);
      check('after-owner companion sits right below the owner with its initiative', rows.indexOf(sdRow) === rows.findIndex(r => r.charId === ch.id) + 1 && sdRow.initiative === 15, rows.map(r => [r.name, r.initiative]));
      check('linked row has live numbers and a stat block', sdRow.maxHP === 40 && sdRow.ac === 15 && !!sdRow.statBlock, sdRow);
      init().combatants = [];
      addAllPcsToInitiative();
      check('Add all PCs also adds active companions', init().combatants.some(r => r.ownCompanion?.companionId === sd.id) && init().combatants.some(r => r.ownCompanion?.companionId === horse.id), init().combatants.map(r => r.name));
      init().combatants = [];
      openAddCombatantModal();
      check('add menu lists own companions under the owner', /Steel Defender · Tinker's/.test(document.getElementById('modal-content').textContent), null);
      closeModal();
      // Summoning mid-fight
      addAllPcsToInitiative();
      ch.spells.slots = { 1: 4, 2: 3, 3: 3, 4: 1 }; ch.spells.known = [{ name: 'Find Familiar', level_int: 1 }];
      confirmCast('Find Familiar', 1);
      const box = document.getElementById('own-add-to-combat');
      check('summon popup offers Add to combat, ticked while combat runs', box && box.checked, !!box);
      document.querySelector('#modal-content .btn-primary').click();
      const fam = ch.ownCompanions.find(c => COMPANION_TEMPLATES[c.templateKey].kind === 'familiar');
      check('the familiar joined combat', init().combatants.some(r => r.ownCompanion?.companionId === fam.id), init().combatants.map(r => r.name));
    } catch (err) { check('task 9 block ran', false, err.message + err.stack); }
  });
```

- [ ] **Step 2: Run to verify it fails.**

- [ ] **Step 3: Implement**

```js
// A tracker row for an own companion. After-owner companions take the owner's initiative and sit right below them.
function _ownCombatant(ch, oc, initiative) {
  const v = _ownCompanionView(ch, oc);
  return { id: uid(), name: v.name, initiative, ac: v.ac, hp: v.hp, maxHP: v.maxHP, tempHP: v.tempHP, type: 'npc',
    conditions: JSON.parse(JSON.stringify(v.conditions || [])), notes: '', statBlock: v.statBlock ? JSON.parse(JSON.stringify(v.statBlock)) : null,
    ownCompanion: { charId: ch.id, companionId: oc.id } };
}
function _placeOwnCombatant(init, cb, oc) {
  const ownerIdx = init.combatants.findIndex(c => c.charId === cb.ownCompanion.charId);
  if (oc.turnMode === 'afterOwner' && ownerIdx >= 0) {
    const owner = init.combatants[ownerIdx];
    cb.initiative = owner.initiative;
    let at = ownerIdx + 1;
    while (at < init.combatants.length && init.combatants[at].ownCompanion?.charId === owner.charId) at++;   // after earlier followers
    init.combatants.splice(at, 0, cb);
    if (_combatStarted(init) && at <= (init.currentIndex || 0)) init.currentIndex = (init.currentIndex || 0) + 1;
  } else _insertCombatant(init, cb);
}
function _addOwnToCombat(charId, ocId, initiative) {
  const ch = db.characters[charId]; const oc = (ch?.ownCompanions || []).find(c => c.id === ocId); if (!oc) return;
  const init = getInitiative();
  if (init.combatants.some(c => c.ownCompanion?.companionId === ocId)) return;   // one row per companion
  const v = _ownCompanionView(ch, oc);
  const cb = _ownCombatant(ch, oc, initiative ?? (Math.ceil(Math.random() * 20) + (v.initBonus || 0)));
  cb.name = _uniqueCombatantName(init, cb.name);
  _placeOwnCombatant(init, cb, oc);
  combatLog(`${cb.name} (${ch.name}'s) added to combat (init ${cb.initiative})`);
}
function quickAddOwnCompanion(charId, ocId) { _addOwnToCombat(charId, ocId); saveData(db); closeModal(); renderApp(); }
function _summonCombatBox() {
  const c = getCampaign && currentCampaignId ? getCampaign() : null;
  const running = !!(c?.initiative?.combatants || []).length;
  return `<label class="own-combat-box"><input type="checkbox" id="own-add-to-combat"${running ? ' checked' : ''}> Add to combat</label>`;
}
```

- `quickAddCombatant(entityId, 'player')`: in the modal HTML, before `.form-actions`, add when the character has own companions:

```js
  const ownList = type === 'player' ? (db.characters[entityId].ownCompanions || []) : [];
  const ownHtml = ownList.length ? `<div class="form-group"><label>Also add</label>${ownList.map(oc =>
    `<label class="own-combat-box"><input type="checkbox" class="qa-own" value="${oc.id}" checked> ${esc(oc.name)}</label>`).join('')}</div>` : '';
```

  and in `_confirmQuickAdd`, read the ticked ids **before** `closeModal()` and add them after `_insertCombatant(init, cb)`:

```js
  const ownIds = [...document.querySelectorAll('#modal-content .qa-own:checked')].map(b => b.value);
  ...
  _insertCombatant(init, cb);
  combatLog(`${name} added to combat (init ${initiative})`);
  if (charId) ownIds.forEach(id => _addOwnToCombat(charId, id));
```

- `addAllPcsToInitiative`: after each character's `combatLog`, `(ch.ownCompanions || []).forEach(oc => _addOwnToCombat(id, oc.id));`.
- `openAddCombatantModal`: add a group after "Companions":

```js
  const own = pcs.flatMap(ch => (ch.ownCompanions || []).map(oc => ({ ch, oc })));
  ...
  ${own.length ? `<div class="panel-title" style="margin:0.6rem 0 0.4rem">Character companions</div>
    <div class="flex gap-1 flex-wrap">${own.map(({ ch, oc }) => `<button class="btn btn-sm" onclick="quickAddOwnCompanion('${ch.id}','${oc.id}')">${esc(oc.name)} · ${esc(ch.name)}'s</button>`).join('')}</div>` : ''}
```

  (include `own.length` in the "Quick Add from Campaign" condition).
- `confirmSummon` / `confirmFamiliar`: read `const toCombat = document.getElementById('own-add-to-combat')?.checked;` before `closeModal()`, and after adding: `if (toCombat && currentCampaignId && getCampaign()) _addOwnToCombat(charId, oc.id);` then `saveData(db)`.
- `_openOwnFormPicker` already renders `extra.combatBox`; `_afterCastCompanion` passes `_summonCombatBox()` (Task 7).

CSS: `.own-combat-box { display:flex; gap:0.4rem; align-items:center; font-size:0.85rem; margin:0.2rem 0; }`

- [ ] **Step 4: Run tests** — PASS; `node combat.browser.test.js` and `node companion.browser.test.js` PASS.

- [ ] **Step 5: Commit**

```bash
git add app.js style.css tests/own-companions.browser.test.js
git commit -m "Add character companions to combat"
```

---

### Task 10: Linked rows, follow the owner, 0 HP, removal, turn toggle

**Files:**
- Modify: `app.js` (`_syncLinkedCombatants`, `_pushLinked`, `_isDefeated`, `nextTurn`, `updateCombatantInitiative` / `rerollCombatantInitiative`, combatant row render ~2085, `companionDamage`), `style.css`
- Test: `tests/own-companions.browser.test.js`

**Interfaces:**
- Consumes: Task 9 rows (`cb.ownCompanion`).
- Produces: `_ownForRow(cb) → {ch, oc}|null`, `_dropMissingOwnRows(init)`, `toggleOwnTurnMode(i)`, `_ownAtZero(ch, oc)`.

- [ ] **Step 1: Write the failing tests**

```js
  // Task 10: linked rows
  await pg.evaluate(() => {
    try {
      const ch = setup('Artificer', 7, 'Battle Smith');
      const sd = addOwnCompanion(ch.id, 'Steel Defender|TCE');
      const mon = { id: 'm1', name: 'Goblin', initiative: 20, ac: 13, hp: 7, maxHP: 7, type: 'monster', conditions: [], notes: '', tempHP: 0 };
      const init = getInitiative(); init.combatants = [mon]; init.currentIndex = 0; init.round = 1;
      addAllPcsToInitiative();
      const idx = () => getInitiative().combatants.findIndex(r => r.ownCompanion?.companionId === sd.id);
      const row = () => getInitiative().combatants[idx()];
      damageCombatant(idx(), 10);
      check('tracker damage writes back to the companion', ch.ownCompanions[0].hp === 30, ch.ownCompanions[0].hp);
      companionHeal(sd.id, 5); getInitiative();
      check('sheet changes show in the tracker', row().hp === 35, row().hp);
      const ownerIdx = getInitiative().combatants.findIndex(r => r.charId === ch.id);
      updateCombatantInitiative(ownerIdx, 25);
      const list = getInitiative().combatants;
      check('follower moves with its owner', list.findIndex(r => r.charId === ch.id) + 1 === idx() && row().initiative === 25, list.map(r => [r.name, r.initiative]));
      // Next Turn goes owner → companion
      getInitiative().currentIndex = list.findIndex(r => r.charId === ch.id);
      nextTurn();
      check('Next Turn steps owner → companion', getInitiative().currentIndex === idx(), getInitiative().currentIndex);
      // 0 HP: Steel Defender goes Down (not skipped)
      damageCombatant(idx(), 999);
      check('class companion at 0 HP is Down, still in the order', idx() >= 0 && !_isDefeated(row()), row());
      // Summons vanish
      const fam = addOwnCompanion(ch.id, Object.keys(COMPANION_TEMPLATES).find(k => COMPANION_TEMPLATES[k].kind === 'familiar'));
      _addOwnToCombat(ch.id, fam.id, 1);
      const famIdx = getInitiative().combatants.findIndex(r => r.ownCompanion?.companionId === fam.id);
      damageCombatant(famIdx, 999);
      check('familiar at 0 HP vanishes from the character and the tracker', !ch.ownCompanions.some(c => c.id === fam.id)
        && !getInitiative().combatants.some(r => r.ownCompanion?.companionId === fam.id), getInitiative().combatants.map(r => r.name));
      // Dismiss removes the row and keeps the current turn on the same combatant
      getInitiative().currentIndex = getInitiative().combatants.findIndex(r => r.id === 'm1');
      const current = getInitiative().combatants[getInitiative().currentIndex].id;
      dismissOwnCompanion(ch.id, sd.id); getInitiative();
      check('dismiss removes the row', !getInitiative().combatants.some(r => r.ownCompanion?.companionId === sd.id), getInitiative().combatants.map(r => r.name));
      check('Review focus: current turn stays on the same combatant', getInitiative().combatants[getInitiative().currentIndex].id === current, getInitiative().currentIndex);
      // GM can flip the mode
      const sd2 = addOwnCompanion(ch.id, 'Steel Defender|TCE'); _addOwnToCombat(ch.id, sd2.id);
      toggleOwnTurnMode(getInitiative().combatants.findIndex(r => r.ownCompanion?.companionId === sd2.id));
      check('turn mode toggles to own', ch.ownCompanions.find(c => c.id === sd2.id).turnMode === 'own', ch.ownCompanions.find(c => c.id === sd2.id).turnMode);
      currentView = 'campaign'; getCampaign().campaignTab = 'initiative'; renderApp();
      check('follower rows are marked in the tracker', !!document.querySelector('.init-follower') || ch.ownCompanions.find(c => c.id === sd2.id).turnMode === 'own', null);
    } catch (err) { check('task 10 block ran', false, err.message + err.stack); }
  });
```

- [ ] **Step 2: Run to verify it fails.**

- [ ] **Step 3: Implement**

```js
function _ownForRow(cb) {
  if (!cb?.ownCompanion) return null;
  const ch = db.characters[cb.ownCompanion.charId];
  const oc = ch && (ch.ownCompanions || []).find(c => c.id === cb.ownCompanion.companionId);
  return oc ? { ch, oc } : null;
}
// Rows whose companion is gone (dismissed, vanished, concentration ended) leave the tracker; the turn stays put
function _dropMissingOwnRows(init) {
  const cur = init.combatants[init.currentIndex || 0];
  const before = init.combatants.length;
  init.combatants = init.combatants.filter(cb => !cb.ownCompanion || _ownForRow(cb));
  if (init.combatants.length === before) return;
  const at = cur ? init.combatants.indexOf(cur) : -1;
  if (at >= 0) init.currentIndex = at;
  else init.currentIndex = Math.min(init.currentIndex || 0, Math.max(0, init.combatants.length - 1));
}
// At 0 HP: lasting companions go Down; summons and familiars vanish
function _ownAtZero(ch, oc) {
  const t = _ownTemplate(oc);
  if (oc.hp <= 0 && t?.atZero === 'vanish') dismissOwnCompanion(ch.id, oc.id, 'vanished (0 hit points)');
}
function toggleOwnTurnMode(i) {
  const cb = getInitiative().combatants[i], f = _ownForRow(cb); if (!f) return;
  f.oc.turnMode = f.oc.turnMode === 'afterOwner' ? 'own' : 'afterOwner';
  const init = getInitiative();
  init.combatants.splice(init.combatants.indexOf(cb), 1);
  if (f.oc.turnMode === 'own') { cb.initiative = Math.ceil(Math.random() * 20) + (_ownCompanionView(f.ch, f.oc).initBonus || 0); _insertCombatant(init, cb); }
  else _placeOwnCombatant(init, cb, f.oc);
  saveData(db); renderApp();
}
```

- `_syncLinkedCombatants(init)`: first line `_dropMissingOwnRows(init);`, and inside the loop before the NPC branch:

```js
    const own = _ownForRow(cb);
    if (own) { const v = _ownCompanionView(own.ch, own.oc); cb.hp = v.hp; cb.tempHP = v.tempHP; cb.maxHP = v.maxHP; cb.ac = v.ac;
      cb.conditions = JSON.parse(JSON.stringify(v.conditions || [])); cb.name = cb.name || v.name; return; }
```

  Then, after the loop, keep after-owner followers on their owner's initiative and directly after them:

```js
  (init?.combatants || []).filter(cb => _ownForRow(cb)?.oc.turnMode === 'afterOwner').forEach(cb => {
    const owner = init.combatants.find(c => c.charId === cb.ownCompanion.charId);
    if (!owner) return;
    const cur = init.combatants[init.currentIndex || 0];
    init.combatants.splice(init.combatants.indexOf(cb), 1);
    cb.initiative = owner.initiative;
    let at = init.combatants.indexOf(owner) + 1;
    while (at < init.combatants.length && init.combatants[at].ownCompanion?.charId === owner.charId) at++;
    init.combatants.splice(at, 0, cb);
    if (cur) init.currentIndex = init.combatants.indexOf(cur);
  });
```

- `_pushLinked(cb)`: first:

```js
  const own = _ownForRow(cb);
  if (own) { own.oc.hp = cb.hp; own.oc.tempHP = cb.tempHP || 0; own.oc.conditions = JSON.parse(JSON.stringify(cb.conditions || [])); _ownAtZero(own.ch, own.oc); return; }
```

- `_isDefeated(cb)`: add `&& !cb.ownCompanion` (Down companions keep their turn; vanished ones are removed).
- `nextTurn`: where `if (prev.companionId) _pushLinked(prev);` → `if (prev.companionId || prev.ownCompanion) _pushLinked(prev);`.
- `updateCombatantInitiative(i, v)` and `rerollCombatantInitiative(i)`: they already update the owner's row; the follower sync in `_syncLinkedCombatants` moves followers on the next `getInitiative()`/render. Make sure `updateCombatantInitiative` re-sorts the owner (check its body; if it only sets the number, the test only needs the follower's number/position relative to the owner — satisfied by the sync).
- `companionDamage` (sheet): after `_companionWrite`, `if (comp._own) { const f = _findOwnCompanion(id); if (f) _ownAtZero(f.ch, f.oc); }`.
- Tracker row render (~line 2085 area, the element with class for a combatant row): add class `init-follower` when `_ownForRow(cb)?.oc.turnMode === 'afterOwner'`, a label `${esc(own.ch.name)}'s ${esc(own.oc.name === own.t?.name ? '' : '')}` — simply `<span class="init-owner-tag">${esc(own.ch.name)}'s</span>`, and for the GM a small button `<button class="btn btn-sm" onclick="toggleOwnTurnMode(${i})" title="Switch between acting right after its owner and its own initiative">${mode === 'afterOwner' ? 'Acts after owner' : 'Own turn'}</button>`. Down marker: rows with `cb.ownCompanion && cb.hp <= 0` show `<span class="defeated-tag">Down</span>` (reuse the Stage 1 companion Down rendering — find where `cb.companionId && cb.hp <= 0` renders Down and extend the condition to `(cb.companionId || cb.ownCompanion)`).
- Player view: rows for own companions show exact HP like Stage 1 companions — find the player-view HP condition that checks `cb.companionId` and extend it to `cb.companionId || cb.ownCompanion`.

CSS: `.init-follower { margin-left:1.2rem; border-left:2px solid var(--accent); } .init-owner-tag { font-size:0.7rem; color:var(--text-dim); margin-left:0.3rem; }`

- [ ] **Step 4: Run tests** — own-companions PASS; `node combat.browser.test.js`, `node companion.browser.test.js` PASS.

- [ ] **Step 5: Commit**

```bash
git add app.js style.css tests/own-companions.browser.test.js
git commit -m "Link character companions in combat: follow the owner, Down or vanish at 0 HP"
```

---

### Task 11: Full verification and version bump

**Files:**
- Modify: `index.html` (`app.js?v=`, `style.css?v=`, new scripts' `?v=`)

- [ ] **Step 1: Run every unit test**

Run: `for f in tests/*.test.js; do case $f in *.browser.test.js) ;; *) node "$f" || echo "FAILED $f";; esac; done`
Expected: no "FAILED" lines.

- [ ] **Step 2: Run every browser test**

Run: `cd tests && node run-browser-tests.js`
Expected: "All browser tests passed".

- [ ] **Step 3: Bump versions** — `app.js?v=205` → `206`, `style.css?v=` +1; new scripts stay `?v=1` (first release).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Bump asset versions for companions stage 2"
```

- [ ] **Step 5: Report** to the user: what was built, test results, and that deploy (hosting + the Stage 1 firestore rules still pending) and push wait for their go-ahead.
