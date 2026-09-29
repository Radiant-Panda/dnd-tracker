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

if (typeof module !== 'undefined') {
  module.exports = { COMPANION_PLAY_FIELDS, COMPANION_FULL_FIELDS, companionFieldsFor, cleanAbilityName, parseUses,
    restoreUses, rechargeRoll, companionInitBonus, buildCompanionRecord };
}
