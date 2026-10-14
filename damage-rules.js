// ── Damage Rules ─────────────────────────────────────────────────────────────
// Pure logic (no DOM) for combat requests: players send damage or healing to targets in the
// tracker, the GM's app works out saves and damage defenses, then applies it.
// Player-written requests are untrusted: sanitizeRequest rebuilds them field by field.

const DAMAGE_TYPES = ['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic',
  'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'];
const _DR_PHYSICAL = ['bludgeoning', 'piercing', 'slashing'];
const _DR_ABILITIES = ['', 'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const _DR_MAX_TARGETS = 20, _DR_MAX_PARTS = 4, _DR_MAX_AMOUNT = 999;
const _DR_ID = /^[A-Za-z0-9_-]{1,64}$/;

// Split on commas that aren't inside brackets
function _drTopLevelSplit(s) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}

// One stat block field ("cold, bludgeoning, piercing, slashing (from nonmagical attacks)") into plain
// types plus conditional groups. A bracketed condition covers the types since the previous condition;
// when that group ends in physical types after other types (the usual "…, bludgeoning, piercing,
// slashing (from nonmagical attacks)"), it covers only that physical run.
function _drParseField(value, kind, plain, conditional) {
  const text = Array.isArray(value) ? value.filter(v => typeof v === 'string').join(', ')
    : typeof value === 'string' ? value : '';
  for (const segment of text.split(';')) {
    let group = [];
    for (const piece of _drTopLevelSplit(segment)) {
      const m = piece.match(/^(.*?)\s*\(+\s*(.*?)\s*\)+\s*$/);
      const word = (m ? m[1] : piece).trim().toLowerCase();
      if (DAMAGE_TYPES.includes(word)) group.push(word);
      if (!m) continue;
      let covered = group;
      let run = 0;
      while (run < group.length && _DR_PHYSICAL.includes(group[group.length - 1 - run])) run++;
      if (run > 0 && run < group.length) {
        covered = group.slice(group.length - run);
        group.slice(0, group.length - run).forEach(t => plain.add(t));
      }
      if (covered.length) conditional.push({ kind, types: covered, text: m[2] });
      group = [];
    }
    group.forEach(t => plain.add(t));
  }
}

function parseDefenses(statBlock) {
  const d = { resist: new Set(), immune: new Set(), vulnerable: new Set(), conditional: [] };
  if (!statBlock || typeof statBlock !== 'object') return d;
  _drParseField(statBlock.damage_resistances, 'resist', d.resist, d.conditional);
  _drParseField(statBlock.damage_immunities, 'immune', d.immune, d.conditional);
  _drParseField(statBlock.damage_vulnerabilities, 'vulnerable', d.vulnerable, d.conditional);
  return d;
}

const _DR_CONDITIONAL_VERB = { resist: 'resists', immune: 'is immune to', vulnerable: 'is vulnerable to' };

// Final damage for one target. The save comes first (half rounds each part down, or none), then
// defenses per part: immune → 0, resistant → half rounded down, vulnerable → double
// (resistant and vulnerable to the same type cancel out). Heal parts have no type.
function resolveTargetDamage(parts, defenses, opts = {}) {
  const d = defenses || parseDefenses(null);
  const saved = !!opts.saved && (opts.onSave === 'half' || opts.onSave === 'none');
  const tags = saved ? ['saved'] : [];
  const warnings = [];
  let total = 0;
  for (const part of parts || []) {
    let amount = Math.max(0, Math.floor(+part.amount || 0));
    if (saved) amount = opts.onSave === 'none' ? 0 : Math.floor(amount / 2);
    const type = part.type || '';
    if (type) {
      if (d.immune.has(type)) { amount = 0; tags.push('immune to ' + type); }
      else {
        const res = d.resist.has(type), vul = d.vulnerable.has(type);
        if (res && !vul) { amount = Math.floor(amount / 2); tags.push('resistant to ' + type); }
        else if (vul && !res) { amount *= 2; tags.push('vulnerable to ' + type); }
      }
      d.conditional.filter(c => c.types.includes(type)).forEach(c => {
        const w = `${_DR_CONDITIONAL_VERB[c.kind]} ${type} ${c.text}`;
        if (!warnings.includes(w)) warnings.push(w);
      });
    }
    total += amount;
  }
  return { total, tags: [...new Set(tags)], warnings };
}

function _drText(v, max) { return typeof v === 'string' ? v.slice(0, max) : ''; }
function _drAmount(v) { return Number.isInteger(v) && v >= 0 && v <= _DR_MAX_AMOUNT; }

// Rebuild a player-written request from scratch, or null if anything is off.
// ctx: { charIds: [...campaign character ids], ownsCompanion(charId, companionId) → bool }
function sanitizeRequest(raw, ctx) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const kind = raw.kind;
  if (kind !== 'damage' && kind !== 'heal') return null;
  if (typeof raw.charId !== 'string' || !_DR_ID.test(raw.charId)) return null;
  if (!ctx || !(ctx.charIds || []).includes(raw.charId)) return null;
  const fromCompanionId = typeof raw.fromCompanionId === 'string' ? raw.fromCompanionId : '';
  if (fromCompanionId && (!_DR_ID.test(fromCompanionId) || !ctx.ownsCompanion || !ctx.ownsCompanion(raw.charId, fromCompanionId))) return null;

  let save = null;
  if (kind === 'damage' && raw.save) {
    const s = raw.save;
    if (typeof s !== 'object' || (s.onSave !== 'half' && s.onSave !== 'none')) return null;
    const ability = s.ability || '';
    if (!_DR_ABILITIES.includes(ability)) return null;
    const dc = s.dc || 0;
    if (!Number.isInteger(dc) || dc < 0 || dc > 30) return null;
    save = { onSave: s.onSave, ability, dc };
  }

  if (!Array.isArray(raw.targets) || raw.targets.length < 1 || raw.targets.length > _DR_MAX_TARGETS) return null;
  const targets = [], seen = new Set();
  for (const t of raw.targets) {
    if (!t || typeof t.cbId !== 'string' || !_DR_ID.test(t.cbId)) return null;
    if (!Array.isArray(t.parts) || t.parts.length < 1 || t.parts.length > _DR_MAX_PARTS) return null;
    if (kind === 'heal' && t.parts.length !== 1) return null;
    const parts = [];
    for (const p of t.parts) {
      if (!p || !_drAmount(p.amount)) return null;
      const type = p.type || '';
      if (kind === 'heal' ? type !== '' : !DAMAGE_TYPES.includes(type)) return null;
      parts.push({ amount: p.amount, type });
    }
    if (seen.has(t.cbId)) continue;
    seen.add(t.cbId);
    targets.push({ cbId: t.cbId, parts });
  }

  return {
    uid: _drText(raw.uid, 128), charId: raw.charId, combatId: _drText(raw.combatId, 64),
    fromCompanionId, fromName: _drText(raw.fromName, 60), kind, note: _drText(raw.note, 100),
    save, targets,
  };
}

// Combat log line. results: [{ cbId, name, total, tags }] for the targets that were applied.
function summarizeRequest(req, results) {
  const head = req.fromName + (req.note ? ` (${req.note})` : '');
  const lines = results.map(r => {
    if (req.kind === 'heal') return `${r.name} heals ${r.total}`;
    const target = req.targets.find(t => t.cbId === r.cbId);
    const types = [...new Set((target ? target.parts : []).map(p => p.type).filter(Boolean))].join(' + ');
    return `${r.name} takes ${r.total}${types ? ' ' + types : ''}${r.tags && r.tags.length ? ` (${r.tags.join(', ')})` : ''}`;
  });
  return `${head}: ${lines.join('; ')}`;
}

if (typeof module !== 'undefined') {
  module.exports = { DAMAGE_TYPES, parseDefenses, resolveTargetDamage, sanitizeRequest, summarizeRequest };
}
