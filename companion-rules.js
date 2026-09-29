// ── Companion Rules ──────────────────────────────────────────────────────────
// Pure logic (no DOM): limited-use abilities in stat blocks, cleaned ability names,
// building a companion record from an NPC, and which fields a player may change.

const COMPANION_PLAY_FIELDS = ['hp', 'tempHP', 'conditions', 'uses', 'portrait', 'portraitZoom', 'portraitX', 'portraitY'];
const COMPANION_FULL_FIELDS = COMPANION_PLAY_FIELDS.concat(['name', 'role', 'race', 'location', 'ac', 'maxHP', 'initBonus',
  'statBlock', 'statSource', 'legendaryMax']);
const _CP_SECTIONS = ['traits', 'actions', 'bonus_actions', 'reactions', 'legendary_actions'];

function companionFieldsFor(access) {
  return access === 'full' ? COMPANION_FULL_FIELDS.slice() : access === 'play' ? COMPANION_PLAY_FIELDS.slice() : [];
}

// "{@recharge 5}" → "(Recharge 5–6)", "{@recharge}" → "(Recharge 6)"
function cleanAbilityName(name) {
  return String(name || '')
    .replace(/\{@recharge (\d)\}/g, (_, n) => `(Recharge ${n}–6)`)
    .replace(/\{@recharge\}/g, '(Recharge 6)');
}

function _cpSlug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

// → [{ key, label, max, restore, rechargeMin? }]
function parseUses(statBlock) {
  const defs = [], seen = new Set();
  const add = (base, def) => {
    let key = base, n = 2;
    while (seen.has(key)) key = `${base}-${n++}`;
    seen.add(key); defs.push({ key, ...def });
  };
  if (!statBlock) return defs;
  for (const section of _CP_SECTIONS) {
    for (const a of statBlock[section] || []) {
      const raw = String(a.name || '');
      const label = cleanAbilityName(raw).replace(/\s*\([^)]*\)\s*$/, '').trim();
      const base = `${section}:${_cpSlug(label)}`;
      let m;
      if ((m = raw.match(/\{@recharge(?: (\d))?\}/))) {
        add(base, { label, max: 1, restore: 'recharge', rechargeMin: m[1] ? +m[1] : 6 });
      } else if ((m = raw.match(/\((\d+)\/Day/i))) {
        add(base, { label, max: +m[1], restore: 'long' });
      } else if (/Recharges after a Short or Long Rest/i.test(raw)) {
        add(base, { label, max: 1, restore: 'short' });
      } else if (/Recharges after a Long Rest/i.test(raw)) {
        add(base, { label, max: 1, restore: 'long' });
      } else if (/Recharges after/i.test(raw)) {
        add(base, { label, max: 1, restore: 'manual' });
      }
      if (/^Spellcasting/i.test(raw)) {
        const re = /(\d+)\/Day Each:\s*([^.]*?)(?=\s*\d+\/Day|\.|$)/gi;
        let s;
        while ((s = re.exec(String(a.desc || '')))) {
          s[2].split(',').map(x => x.trim()).filter(Boolean).forEach(spell =>
            add(`${base}:${_cpSlug(spell)}`, { label: spell, max: +s[1], restore: 'long' }));
        }
      }
    }
  }
  return defs;
}

function restoreUses(uses, defs, rest) {
  const out = { ...(uses || {}) };
  for (const d of defs) {
    if (d.restore === 'manual') continue;
    if (rest === 'long' || d.restore === 'short') out[d.key] = 0;
  }
  return out;
}

function rechargeRoll(def, d6) { return d6 >= (def.rechargeMin || 6); }

function companionInitBonus(npc) {
  if (!npc) return 0;
  return npc.statBlock ? Math.floor(((npc.statBlock.dexterity || 10) - 10) / 2) : (parseInt(npc.initBonus) || 0);
}

function buildCompanionRecord(npc, ownerCharId, campaignId, id, shareToken) {
  return {
    id, shareToken, campaignId, npcId: npc.id, ownerCharId, createdAt: Date.now(), playerAccess: 'play',
    name: (npc.name || '').trim() || 'Unnamed NPC', role: npc.role || '', race: npc.race || '', location: npc.location || '',
    statSource: npc.statSource || '', statBlock: npc.statBlock ? JSON.parse(JSON.stringify(npc.statBlock)) : null,
    legendaryMax: npc.legendaryMax || 0,
    ac: npc.ac ?? 10, maxHP: npc.maxHP ?? 10, initBonus: companionInitBonus(npc),
    hp: npc.hp ?? npc.maxHP ?? 10, tempHP: npc.tempHP || 0, conditions: [], uses: {},
    portrait: npc.portrait || null, portraitZoom: npc.portraitZoom ?? 100, portraitX: npc.portraitX ?? 50, portraitY: npc.portraitY ?? 50,
  };
}

// A companion card can be written by a player, so treat what arrives as untrusted: numbers become
// numbers, text becomes text, conditions must be known names, and art must be an embedded image.
function sanitizeCompanion(data, conditionNames) {
  const c = { ...(data || {}) };
  const num = (v, dflt, min = -Infinity) => { const n = Number(v); return Number.isFinite(n) ? Math.max(min, n) : dflt; };
  const str = v => (v === undefined || v === null ? '' : String(v)).slice(0, 200);
  c.ac = num(c.ac, 10); c.maxHP = num(c.maxHP, 10, 0); c.hp = num(c.hp, 0, 0); c.tempHP = num(c.tempHP, 0, 0);
  c.initBonus = num(c.initBonus, 0); c.legendaryMax = num(c.legendaryMax, 0, 0);
  c.portraitZoom = num(c.portraitZoom, 100); c.portraitX = num(c.portraitX, 50); c.portraitY = num(c.portraitY, 50);
  for (const k of ['name', 'role', 'race', 'location', 'statSource']) c[k] = str(c[k]);
  if (!['view', 'play', 'full'].includes(c.playerAccess)) c.playerAccess = 'view';
  const known = new Set(conditionNames || []);
  c.conditions = (Array.isArray(c.conditions) ? c.conditions : []).map(x => {
    if (typeof x === 'string') return known.has(x) ? x : null;
    if (x && typeof x === 'object' && known.has(x.name)) { const d = num(x.duration, 0, 0); return d > 0 ? { name: x.name, duration: d } : x.name; }
    return null;
  }).filter(Boolean);
  c.uses = Object.fromEntries(Object.entries(c.uses && typeof c.uses === 'object' ? c.uses : {}).map(([k, v]) => [k, num(v, 0, 0)]));
  c.portrait = typeof c.portrait === 'string' && /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]*$/.test(c.portrait) ? c.portrait : null;
  if (c.statBlock !== null && typeof c.statBlock !== 'object') c.statBlock = null;
  return c;
}

if (typeof module !== 'undefined') {
  module.exports = { COMPANION_PLAY_FIELDS, COMPANION_FULL_FIELDS, companionFieldsFor, cleanAbilityName, parseUses,
    restoreUses, rechargeRoll, companionInitBonus, buildCompanionRecord, sanitizeCompanion };
}
