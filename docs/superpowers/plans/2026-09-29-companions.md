# Companions (Stage 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the GM make an NPC a companion of a player character; the player runs it from a companion sheet in their player view (per the GM's access setting), with art, limited-use pips, rests and live combat sync.

**Architecture:** A new Firestore collection `users/{gm}/companions/{id}` holds only shareable NPC fields plus play state; it is the source of truth for the companion's HP while linked. Pure rules (ability-use parsing, name cleanup, record building, access checks) live in a new `companion-rules.js` tested in Node; the GM lifecycle, player view and tracker integration go in `app.js`; security lives in `firestore.rules`.

**Tech Stack:** Vanilla JS, Firebase compat v9 (Firestore, Auth), puppeteer-core browser tests opened from disk, Node `assert` unit tests, Firebase emulator + `@firebase/rules-unit-testing` for rules.

**Spec:** `docs/superpowers/specs/2026-09-28-companions-design.md`

## Global Constraints

- Keep vanilla JS — no framework.
- Player-visible companion fields: name; role, race, location; AC, HP; the stat block; art. Never `personality`, `goals`, `relationships`, `secrets`, `notes`.
- `playerAccess` is `'view'`, `'play'` (default) or `'full'`.
- Play fields: `['hp', 'tempHP', 'conditions', 'uses', 'portrait', 'portraitZoom', 'portraitX', 'portraitY']`.
- Full-edit adds: `['name', 'role', 'race', 'location', 'ac', 'maxHP', 'initBonus', 'statBlock', 'statSource', 'legendaryMax']`.
- Art is a 400×400 JPEG data URL, under 300 000 characters.
- "Add all PCs" must not add companions; companions join via quick add.
- All players see companions' exact HP. Companions at 0 HP show **Down** and are not skipped.
- Reassignment creates a new companion id.
- Bump `app.js?v=` / `style.css?v=` in `index.html` whenever those files change.
- Nothing deployed or pushed without the user's go-ahead.

## Review Focus

1. **A player's write arrives for a companion that was just reassigned or ended** — the write fails quietly (rules/doc gone) and the player view drops the tab instead of erroring.
2. **Two NPCs with the same ability name, or one action listed as both "(3/Day)" and in spellcasting** — use keys stay unique so ticking one pip never ticks another.
3. **The GM edits the NPC while the player (Full edit) edits the same companion** — last write wins without either side's form being clobbered mid-typing (GM → card copies only on GM edits; card → NPC copies only fields that changed).
4. **Old combatants whose `statBlock.senses` is an object, and NPCs with no stat block at all** — companion sheet renders AC/HP only with no errors.
5. **Deleting a campaign that has companions, and import/export of data with companions** — companion records go with the campaign and round-trip through export/import.

Tests pinning these lines are included in Tasks 2, 3, 4 and 6 (marked "Review focus").

---

### Task 1: `companion-rules.js` — pure companion logic

**Files:**
- Create: `companion-rules.js`
- Create: `tests/companion.test.js`
- Modify: `index.html` (load `companion-rules.js?v=1` before `app.js`)

**Interfaces:**
- Produces:
  - `cleanAbilityName(name: string): string`
  - `parseUses(statBlock): Array<{ key: string, label: string, max: number, restore: 'long'|'short'|'recharge'|'manual', rechargeMin?: number }>`
  - `restoreUses(uses: object, defs: Array, rest: 'short'|'long'): object`
  - `rechargeRoll(def, d6: number): boolean`
  - `buildCompanionRecord(npc, ownerCharId: string, campaignId: string, id: string, shareToken: string): object`
  - `COMPANION_PLAY_FIELDS`, `COMPANION_FULL_FIELDS`: string arrays
  - `companionFieldsFor(access: string): string[]`
  - `companionInitBonus(npc): number`

- [ ] **Step 1: Write the failing tests** — `tests/companion.test.js`:

```js
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
console.log(`\n${passed} passed`);
```

- [ ] **Step 2: Run to verify it fails**

Run: `node tests/companion.test.js` — Expected: `Cannot find module '…companion-rules.js'`.

- [ ] **Step 3: Implement `companion-rules.js`**

```js
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
```

Add to `index.html` after `senses-rules.js`: `<script src="companion-rules.js?v=1"></script>`.

- [ ] **Step 4: Run to verify it passes** — `node tests/companion.test.js` → all pass.
- [ ] **Step 5: Commit** — `git add companion-rules.js tests/companion.test.js index.html && git commit -m "Add companion rules: limited-use abilities, name cleanup, companion records"`

---

### Task 2: Store and sync companion records (GM app)

**Files:**
- Modify: `app.js` — `loadData`, `_takeSnapshot`, diff save (~line 391 pattern for npcs), Firestore initial load (~line 168), `onSnapshot` listeners (~line 509), export/import (~line 9947), campaign delete (~line 1071), empty-db literals.
- Test: `tests/companion.browser.test.js` (new)

**Interfaces:**
- Consumes: none.
- Produces: `db.companions: { [id]: companionRecord }`, always an object after load/import; `_dbSnap.companions`.

- [ ] **Step 1: Write the failing test** — create `tests/companion.browser.test.js` with the shared harness (same shape as `tests/npc.browser.test.js`: `launch`, `openApp`, `check`, `out`) and these checks:

```js
check('db.companions exists after load', typeof db.companions === 'object' && db.companions !== null, typeof db.companions);
db.companions.x1 = { id: 'x1', campaignId: 'cC', name: 'Test' }; saveData(db);
check('companions are saved to local storage', JSON.parse(localStorage.getItem(STORAGE_KEY)).companions.x1.name === 'Test', null);
_takeSnapshot(db);
check('the sync snapshot tracks companions', _dbSnap.companions && typeof _dbSnap.companions.x1 === 'string', Object.keys(_dbSnap));
// Review focus: deleting a campaign removes its companions
db.campaigns.push({ id: 'cC', name: 'Doomed', characters: [], npcs: [], journal: [] });
_deleteCampaignData('cC');
check('deleting a campaign removes its companions', !db.companions.x1, Object.keys(db.companions));
```

- [ ] **Step 2: Run** `node tests/companion.browser.test.js` → FAIL (`db.companions` undefined).
- [ ] **Step 3: Implement.**
  - Every empty-db literal `{ campaigns: [], characters: {}, npcs: {} }` gains `companions: {}`; `loadData` sets `if (!raw.companions) raw.companions = {};`; import sets `if (!db.companions) db.companions = {};`.
  - `_takeSnapshot`: `_dbSnap.companions = {}; Object.entries(data.companions || {}).forEach(([id, c]) => { _dbSnap.companions[id] = JSON.stringify(c); });`
  - Diff save: copy the npcs block for `companions` → `${base}/companions/${id}` (set when JSON differs, delete when missing).
  - Initial load: add `_fireDb.collection(`${base}/companions`).get()` to the `Promise.all` and set `db.companions` from it.
  - Listener: copy the npcs `onSnapshot` block for `companions` (removed → `delete db.companions[id]`, else set).
  - Extract the existing campaign-delete body into `function _deleteCampaignData(campaignId)` and add: `Object.values(db.companions || {}).filter(c => c.campaignId === campaignId).forEach(c => delete db.companions[c.id]);` — the confirm-dialog path calls it.
- [ ] **Step 4: Run** → PASS. Also run `node tests/run-browser-tests.js` → all pass.
- [ ] **Step 5: Commit** — `git commit -m "Store and sync companion records alongside characters and NPCs"`

---

### Task 3: GM lifecycle — make, reassign, end; NPC page panel; tags

**Files:**
- Modify: `app.js` — `renderNpcSheet`, `_npcCardHtml`, `renderCharacterCards`, `deleteNpc`, `deleteCharacter`, `npc_field`, `_applyMonsterToNpc`, `removeNpcStatBlock`.
- Modify: `style.css` — `.npc-companion-panel`, `.companion-tag`, `.companion-art`.
- Test: `tests/companion.browser.test.js`

**Interfaces:**
- Consumes: `buildCompanionRecord`, `companionInitBonus` (Task 1); `db.companions` (Task 2).
- Produces:
  - `makeCompanion(npcId, charId): string` (new companion id)
  - `changeCompanionOwner(npcId, newCharId): string` (new companion id)
  - `endCompanionship(npcId): void`
  - `setCompanionAccess(npcId, access): void`
  - `_companionForNpc(npc): companion|null`
  - `_syncCompanionFromNpc(npc): void` — copies public fields NPC → card
  - `_syncNpcFromCompanion(comp, changedKeys: string[]): void` — copies full-edit fields card → NPC
  - `setCompanionPortrait(companionId, dataUrl, zoom, x, y)` / `removeCompanionPortrait(companionId)`

- [ ] **Step 1: Write failing tests** (append to `tests/companion.browser.test.js`; setup creates campaign `cC` with characters Aria and Bram and NPC Sildar with a Bandit Captain stat block via `_applyMonsterToNpc`):

```js
let id = makeCompanion(sildar.id, aria.id);
let comp = db.companions[id];
check('making a companion creates a record', !!comp && comp.ownerCharId === aria.id && comp.playerAccess === 'play', comp);
check('the owner lists it', aria.companionIds.includes(id), aria.companionIds);
check('the NPC links to it', sildar.companionId === id, sildar.companionId);
check('private fields are not copied', !('secrets' in comp) && !('personality' in comp), Object.keys(comp));
showNpc(sildar.id);
check('the NPC page shows "Companion of Aria"', /Companion of Aria/.test(document.querySelector('.npc-companion-panel').textContent), null);
npc_field('hp', 30); check('NPC page HP edits go to the companion', comp.hp === 30, comp.hp);
sildar.role = 'Veteran'; npc_field('role', 'Veteran'); check('NPC edits update the card', comp.role === 'Veteran', comp.role);
comp.hp = 22; comp.conditions = ['Poisoned']; comp.uses = { 'actions:x': 1 }; comp.portrait = 'data:image/jpeg;base64,AA';
const newId = changeCompanionOwner(sildar.id, bram.id);
check('reassigning makes a new id', newId !== id && !db.companions[id] && !!db.companions[newId], { newId, id });
check('…moves it between characters', !aria.companionIds.includes(id) && bram.companionIds.includes(newId), { a: aria.companionIds, b: bram.companionIds });
check('…and keeps play state, art and access', db.companions[newId].hp === 22 && db.companions[newId].conditions[0] === 'Poisoned' && db.companions[newId].uses['actions:x'] === 1 && db.companions[newId].portrait === 'data:image/jpeg;base64,AA', db.companions[newId]);
setCompanionAccess(sildar.id, 'full'); check('access setting is stored', db.companions[newId].playerAccess === 'full', null);
// Review focus: full-edit changes flow back without clobbering other fields
db.companions[newId].ac = 17; _syncNpcFromCompanion(db.companions[newId], ['ac']);
check('full-edit changes copy back to the NPC', sildar.ac === 17 && sildar.role === 'Veteran', { ac: sildar.ac, role: sildar.role });
endCompanionship(sildar.id);
check('ending returns HP and art to the NPC', sildar.hp === 22 && sildar.portrait === 'data:image/jpeg;base64,AA' && !sildar.companionId, sildar);
check('…removes the record and the link', !db.companions[newId] && !bram.companionIds.includes(newId), null);
id = makeCompanion(sildar.id, aria.id); deleteNpcNow(sildar.id);
check('deleting the NPC ends the companionship', !db.companions[id] && !aria.companionIds.includes(id), null);
```

(`deleteNpcNow(id)` is the confirm callback body extracted from `deleteNpc`; `deleteCharacterNow(id)` likewise from `deleteCharacter` — add a test that deleting the owner ends its companions and returns HP to the NPC.)

- [ ] **Step 2: Run** → FAIL (`makeCompanion is not defined`).
- [ ] **Step 3: Implement** in `app.js` next to the NPC functions:

```js
function _companionForNpc(npc) { return npc?.companionId ? db.companions?.[npc.companionId] || null : null; }
function _newCompanionId() { return 'comp_' + uid(); }
function makeCompanion(npcId, charId) {
  const npc = db.npcs[npcId], ch = db.characters[charId]; if (!npc || !ch || npc.companionId) return null;
  const rec = buildCompanionRecord(npc, charId, currentCampaignId, _newCompanionId(), uid() + uid());
  db.companions[rec.id] = rec;
  ch.companionIds = [...(ch.companionIds || []), rec.id];
  npc.companionId = rec.id;
  saveData(db); renderApp(); return rec.id;
}
function changeCompanionOwner(npcId, newCharId) {
  const npc = db.npcs[npcId], old = _companionForNpc(npc), ch = db.characters[newCharId];
  if (!old || !ch || old.ownerCharId === newCharId) return old?.id || null;
  const rec = { ...JSON.parse(JSON.stringify(old)), id: _newCompanionId(), shareToken: uid() + uid(), ownerCharId: newCharId };
  const prev = db.characters[old.ownerCharId];
  if (prev) prev.companionIds = (prev.companionIds || []).filter(x => x !== old.id);
  ch.companionIds = [...(ch.companionIds || []), rec.id];
  delete db.companions[old.id]; db.companions[rec.id] = rec; npc.companionId = rec.id;
  db.campaigns.forEach(c => c.initiative?.combatants?.forEach(cb => { if (cb.companionId === old.id) cb.companionId = rec.id; }));
  saveData(db); renderApp(); return rec.id;
}
function endCompanionship(npcId) {
  const npc = db.npcs[npcId], comp = _companionForNpc(npc); if (!comp) return;
  npc.hp = comp.hp; npc.tempHP = comp.tempHP || 0;
  if (comp.portrait) { npc.portrait = comp.portrait; npc.portraitZoom = comp.portraitZoom; npc.portraitX = comp.portraitX; npc.portraitY = comp.portraitY; }
  const owner = db.characters[comp.ownerCharId];
  if (owner) owner.companionIds = (owner.companionIds || []).filter(x => x !== comp.id);
  db.campaigns.forEach(c => c.initiative?.combatants?.forEach(cb => { if (cb.companionId === comp.id) delete cb.companionId; }));
  delete db.companions[comp.id]; delete npc.companionId;
  saveData(db); renderApp();
}
function setCompanionAccess(npcId, access) {
  const comp = _companionForNpc(db.npcs[npcId]); if (!comp || !['view', 'play', 'full'].includes(access)) return;
  comp.playerAccess = access; saveData(db); renderApp();
}
const _COMPANION_FROM_NPC = ['name', 'role', 'race', 'location', 'ac', 'maxHP', 'statBlock', 'statSource', 'legendaryMax'];
function _syncCompanionFromNpc(npc) {
  const comp = _companionForNpc(npc); if (!comp) return;
  for (const k of _COMPANION_FROM_NPC) comp[k] = k === 'statBlock' ? (npc.statBlock ? JSON.parse(JSON.stringify(npc.statBlock)) : null) : (k === 'name' ? _npcName(npc) : npc[k]);
  comp.initBonus = companionInitBonus(npc);
  comp.hp = Math.min(comp.hp, comp.maxHP);
}
function _syncNpcFromCompanion(comp, changedKeys) {
  const npc = db.npcs[comp.npcId]; if (!npc) return;
  for (const k of changedKeys) if (COMPANION_FULL_FIELDS.includes(k) && !COMPANION_PLAY_FIELDS.includes(k)) npc[k] = k === 'statBlock' && comp.statBlock ? JSON.parse(JSON.stringify(comp.statBlock)) : comp[k];
}
```

  - `npc_field(field, value)`: if the NPC has a companion and `field` is `hp`/`tempHP`, write to the companion instead; otherwise set on the NPC and call `_syncCompanionFromNpc(npc)`. Same `_syncCompanionFromNpc` call at the end of `_applyMonsterToNpc` and `removeNpcStatBlock`.
  - `renderNpcSheet`: HP inputs show `comp.hp` / `comp.tempHP` when linked; add a **Companion** panel (`.npc-companion-panel`) below Combat Stats: when not a companion, a character `<select>` + **Make companion** button (hint to choose a stat block if none); when a companion, "Companion of {owner}", **Change owner** select, **Player access** select (View only / Run in play / Full edit), art preview with **Upload** / **Adjust** / **Remove** (reusing `openPortraitCropper` / `openPortraitFramer` with a target of `{ companionId }`), **End companionship** with an in-page confirm row, and a note when the owner has no `shareToken`.
  - `_npcCardHtml`: `<span class="companion-tag">Companion · {owner}</span>` when linked. `renderCharacterCards`: "Companions: {names}" when `companionIds` non-empty.
  - `deleteNpc` / `deleteCharacter`: extract the confirm callbacks into `deleteNpcNow(id)` / `deleteCharacterNow(id)` which first call `endCompanionship` for linked NPCs (for a character: every NPC whose companion's `ownerCharId` is that character).
  - Portrait helpers: `setCompanionPortrait(companionId, dataUrl, zoom, x, y)` stores on the card; `removeCompanionPortrait(companionId)` sets `portrait: null`. The existing cropper's `_pcApply` gains an optional target so a companion crop calls `setCompanionPortrait` instead of `_savePortraitWithUpload`.
- [ ] **Step 4: Run** → PASS; full browser suite → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Companions: make, reassign and end from the NPC page; access setting; art; tags"`

---

### Task 4: Companion sheet (shared by the player view and the GM preview)

**Files:**
- Modify: `app.js` — new `renderCompanionSheet(comp, { editable: string[] })`, companion actions, `renderCombatantStatBlock` name cleanup.
- Modify: `style.css` — `.companion-sheet`, `.use-pips`, `.use-pip`.
- Test: `tests/companion.browser.test.js`

**Interfaces:**
- Consumes: `parseUses`, `restoreUses`, `rechargeRoll`, `cleanAbilityName`, `companionFieldsFor` (Task 1).
- Produces:
  - `renderCompanionSheet(comp): string`
  - `companionDamage(id, amt)`, `companionHeal(id, amt)`, `companionSetTemp(id, amt)`, `companionToggleUse(id, key, pipIndex)`, `companionRollRecharge(id, key): boolean`, `companionRest(id, 'short'|'long')`, `companionToggleCondition(id, cond)`, `companionSetField(id, field, value)` (full edit), `companionChooseStatBlock(id)` (full edit)
  - `_companionWrite(comp, patch: object)` — applies `patch`, filters it to `companionFieldsFor(access)` when `IS_PLAYER_VIEW`, then saves (GM: `saveData`; player: `_pvSaveCompanion(comp.id, allowedPatch)`).

- [ ] **Step 1: Write failing tests:**

```js
const comp = db.companions[makeCompanion(sildar.id, aria.id)]; // Bandit Captain stat block
document.getElementById('app').innerHTML = renderCompanionSheet(comp);
const text = document.getElementById('app').textContent;
check('the sheet shows name, role line and owner', /Sildar/.test(text) && /Companion of Aria/.test(text), text.slice(0, 120));
check('the sheet never shows private fields', !/secret-marker|personality-marker/.test(text), null); // setup puts those markers in the NPC's private fields
check('ability names are cleaned', !/\{@recharge/.test(renderCombatantStatBlock(monsterBlock('Adult Red Dragon'), 0)), null);
companionDamage(comp.id, 5); check('damage lowers HP (temp first)', comp.hp === 47, comp.hp);
comp.hp = 0; document.getElementById('app').innerHTML = renderCompanionSheet(comp);
check('0 HP shows Down', /Down/.test(document.getElementById('app').textContent), null);
companionHeal(comp.id, 60); check('healing is capped at max HP', comp.hp === comp.maxHP, comp.hp);
const dragon = db.companions[makeCompanion(dragonNpc.id, aria.id)];
const fire = parseUses(dragon.statBlock).find(u => /Fire Breath/.test(u.label));
companionToggleUse(dragon.id, fire.key, 0); check('ticking a pip marks it used', dragon.uses[fire.key] === 1, dragon.uses);
const rnd = Math.random; Math.random = () => 0.9; companionRollRecharge(dragon.id, fire.key); Math.random = rnd;
check('a recharge roll of 6 restores it', dragon.uses[fire.key] === 0, dragon.uses);
companionToggleUse(dragon.id, fire.key, 0); companionRest(dragon.id, 'long');
check('a long rest restores uses and HP', dragon.uses[fire.key] === 0 && dragon.hp === dragon.maxHP, dragon);
// Review focus: NPC with no stat block, and old object-shaped senses
const plain = db.companions[makeCompanion(plainNpc.id, aria.id)];
check('a companion without a stat block renders', /AC/.test(renderCompanionSheet(plain)), null);
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.**
  - In `renderCombatantStatBlock`, pass every `a.name` through `cleanAbilityName` (quick-bar labels and section entries).
  - `renderCompanionSheet(comp)`: header (art, name, role • race • location, "Companion of {owner name}"); vitals (AC, speed from `statBlock.speed`, initiative `±initBonus`, HP current / max / temp); controls rendered only when the relevant field is in `companionFieldsFor(access)` (GM app: all fields); `Down` badge when `hp <= 0`; conditions as `condition-tag`s (+ Condition picker bound to the companion when editable); stat block via `renderCombatantStatBlock(comp.statBlock, null, { quickBar: true, rollTarget: 'companion' })` — attack roll/damage buttons use the existing `rollActionAttack` / `rollActionDamage` popover code (read-only rolling is always allowed); uses as pip rows from `parseUses(comp.statBlock)` (pip filled when index < `uses[key]`, recharge rows get **Roll recharge**, manual rows a **Reset**); Long / Short Rest buttons; View-only note "Your GM is tracking this companion."; in Full edit, inputs for name/role/race/location/AC/max HP/initiative bonus and **Choose stat block** (monster search in pick mode for the companion).
  - Action functions build a patch and call `_companionWrite`; damage consumes `tempHP` first; heal caps at `maxHP`; `companionRest('long')` sets `hp = maxHP`, `tempHP = 0`, `uses = restoreUses(uses, defs, 'long')`.
- [ ] **Step 4: Run** → PASS; full suite → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Companion sheet: vitals, conditions, stat block, limited-use pips and rests"`

---

### Task 5: Player view — load companions, tabs, live updates, restricted writes

**Files:**
- Modify: `app.js` — player-view load (~line 567–630), `_pvSaveCharacter` neighbour `_pvSaveCompanion`, `renderCharacterSheet`/player header for tabs.
- Test: `tests/companion.browser.test.js` (simulated player view: set `IS_PLAYER_VIEW = true` and stub Firestore writes with a recorder)

**Interfaces:**
- Consumes: `renderCompanionSheet`, `_companionWrite` (Task 4).
- Produces: `_pvCompanionListeners: { [id]: unsubscribe }`, `_pvSyncCompanionListeners(ch)`, `_pvSaveCompanion(id, patch)`, `pvShowTab(tab: 'character' | companionId)`.

- [ ] **Step 1: Write failing tests:**

```js
IS_PLAYER_VIEW = true; currentCharId = aria.id; const writes = []; _pvSaveCompanion = (id, patch) => writes.push({ id, patch });
renderApp();
check('tabs show the character and its companion', /Aria/.test(document.querySelector('.pv-tabs').textContent) && /Sildar \(companion\)/.test(document.querySelector('.pv-tabs').textContent), null);
pvShowTab(comp.id);
check('the companion tab shows the companion sheet', !!document.querySelector('.companion-sheet'), null);
companionDamage(comp.id, 3);
check('a player write sends only play fields', writes.length === 1 && Object.keys(writes[0].patch).every(k => COMPANION_PLAY_FIELDS.includes(k)), writes);
comp.playerAccess = 'view'; renderApp();
check('View only hides the controls', !document.querySelector('.companion-sheet .hp-dmg-btn') && /GM is tracking/.test(document.querySelector('.companion-sheet').textContent), null);
companionDamage(comp.id, 3); check('View only sends no writes', writes.length === 1, writes);
comp.playerAccess = 'full'; renderApp();
check('Full edit shows the stat fields', !!document.querySelector('.companion-sheet [data-cfield="ac"]'), null);
// Review focus: companion removed (reassigned) while its tab is open
aria.companionIds = []; delete db.companions[comp.id]; renderApp();
check('a removed companion drops its tab without errors', !/Sildar/.test(document.querySelector('.pv-tabs')?.textContent || '') && !!document.querySelector('.cs-header'), null);
IS_PLAYER_VIEW = false;
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.**
  - After the player's character loads and on every character snapshot, call `_pvSyncCompanionListeners(ch)`: for each id in `ch.companionIds` without a listener, `_fireDb.doc(`${base}/companions/${id}`).onSnapshot(snap => { if (snap.exists) db.companions[id] = snap.data(); else delete db.companions[id]; renderApp(); }, () => { delete db.companions[id]; renderApp(); })`; unsubscribe listeners whose id is no longer listed and delete them from `db.companions`.
  - `_pvSaveCompanion(id, patch)`: `_fireDb.doc(`${base}/companions/${id}`).update(patch).catch(e => console.warn('[PlayerView] Companion save failed:', e.message))`.
  - Tabs: when `IS_PLAYER_VIEW` and the character has companions present in `db.companions`, render `.pv-tabs` above the sheet; `let _pvTab = 'character'`; `pvShowTab(t)` sets it and re-renders; if `_pvTab` names a companion that no longer exists, fall back to `'character'`.
  - `_companionWrite` in player view: `patch` keys filtered by `companionFieldsFor(comp.playerAccess)`; if nothing remains, do nothing.
- [ ] **Step 4: Run** → PASS; full suite → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Player view: companion tabs, live companion sheets, access-limited writes"`

---

### Task 6: Combat — quick add, linked rows, exact HP, Down

**Files:**
- Modify: `app.js` — `openAddCombatantModal`, `quickAddCombatant`, `_confirmQuickAdd`, `_syncLinkedCombatants`, `_pushToNpc` (→ also companions), `_isDefeated`, tracker row render (label, hideNumbers, Down), `toggleCondition` / `setConditionDuration` / `removeCondition` / `nextTurn` condition sync.
- Test: `tests/companion.browser.test.js`

**Interfaces:**
- Consumes: `db.companions`, `_companionWrite` not used here (GM only).
- Produces: combatant field `companionId`; `quickAddCombatant(id, 'companion')`.

- [ ] **Step 1: Write failing tests:**

```js
openAddCombatantModal();
check('quick add lists companions', /Sildar · Aria/.test(document.getElementById('modal-overlay').textContent), null); closeModal();
addAllPcsToInitiative(); check('Add all PCs does not add companions', !getInitiative().combatants.some(c => c.companionId), getInitiative().combatants.map(c => c.name));
const rnd = Math.random; Math.random = () => 0.5; quickAddCombatant(comp.id, 'companion'); const qa = document.getElementById('qa-init').value; _confirmQuickAdd(); Math.random = rnd;
check('companion initiative uses its bonus', qa === String(10 + comp.initBonus), qa);
const ci = getInitiative().combatants.findIndex(c => c.companionId === comp.id);
damageCombatant(ci, 10); check('tracker damage writes to the companion', comp.hp === comp.maxHP - 10, comp.hp);
comp.hp = 5; comp.conditions = ['Prone']; showCampaign('cC', 'initiative');
const row = [...document.querySelectorAll('.initiative-row')][ci];
check('the row shows the companion\'s HP and conditions', row.querySelector('.hp-input').value === '5' && /Prone/.test(row.textContent), row.textContent.slice(0, 120));
check('the row is labelled with the owner', /Companion · Aria/.test(row.textContent), null);
IS_PLAYER_VIEW = true; renderApp();
check('players see the companion\'s exact HP', /5\s*\/\s*52/.test([...document.querySelectorAll('.initiative-row')][ci].textContent), null);
IS_PLAYER_VIEW = false;
damageCombatant(ci, 50); check('a companion at 0 shows Down', /Down/.test([...document.querySelectorAll('.initiative-row')][ci].textContent), null);
check('…and is not skipped', !_isDefeated(getInitiative().combatants[ci]), null);
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.**
  - Quick-add modal: a **Companions** group listing `db.companions` with `campaignId === currentCampaignId` as "{name} · {owner}'s companion".
  - `quickAddCombatant(id, 'companion')`: name/ac/hp/maxHP from the card, `initBonus = comp.initBonus`, `_quickAddState.companionId = id`; `_confirmQuickAdd` sets `cb.companionId`, `type: 'companion'`, copies `statBlock`/legendary like NPCs; only the first row per companion is linked (same rule as NPCs).
  - `_syncLinkedCombatants`: `const comp = cb.companionId && db.companions?.[cb.companionId]; if (comp) { cb.hp = comp.hp; cb.tempHP = comp.tempHP || 0; cb.maxHP = comp.maxHP; cb.ac = comp.ac; cb.conditions = [...(comp.conditions || [])]; return; }`.
  - Rename `_pushToNpc` → `_pushLinked(cb)`: writes `hp`/`tempHP` to a linked NPC **or** companion (and `conditions` for companions); update its three call sites. Condition changes (`toggleCondition`, `setConditionDuration`, `removeCondition`, `nextTurn` expiry) also write `comp.conditions`.
  - `_isDefeated`: return false when `cb.companionId`. Row: `Down` badge when a companion's hp ≤ 0; label "Companion · {owner}"; `hideNumbers` false for companions.
- [ ] **Step 4: Run** → PASS; full suite → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Combat: companions via quick add, linked to their card, exact HP, Down at 0"`

---

### Task 7: Security rules + emulator tests

**Files:**
- Modify: `firestore.rules`
- Create: `tests/rules/companions.rules.test.js`, `tests/rules/package.json`
- Modify: `firebase.json` (emulator block: `"emulators": { "firestore": { "port": 8080 } }`)

**Interfaces:** Consumes the field lists from the Global Constraints.

- [ ] **Step 1: Check the toolchain.** Run `java -version`. The Firestore emulator needs Java 11+ (installed: 1.8). If still 1.8, ask the user to install a current JDK (e.g. Temurin 21) and wait; skip to Step 3 meanwhile.
- [ ] **Step 2: Write the failing rules tests** (`tests/rules/companions.rules.test.js`, run with `npx firebase emulators:exec --only firestore "node tests/rules/companions.rules.test.js"`), using `@firebase/rules-unit-testing` `initializeTestEnvironment({ projectId: 'demo-dnd', firestore: { rules } })`; seed with `withSecurityRulesDisabled` a companion `users/gm/companions/c1` `{ shareToken: 't', playerAccess: 'play', hp: 10, maxHP: 20, tempHP: 0, name: 'Sildar', ac: 15, ownerCharId: 'a' }`; as `authenticatedContext('anon')` assert:
  - `assertSucceeds(get)`; `assertSucceeds(update({ hp: 5 }))`; `assertSucceeds(update({ portrait: 'data:…' }))`;
  - `assertFails(update({ ac: 18 }))`, `assertFails(update({ name: 'X' }))`, `assertFails(update({ playerAccess: 'full' }))`, `assertFails(update({ shareToken: 'z' }))`, `assertFails(update({ hp: 25 }))`, `assertFails(update({ hp: -1 }))`, `assertFails(update({ portrait: 'x'.repeat(300001) }))`, `assertFails(set new doc)`, `assertFails(delete)`, `assertFails(list collection)`;
  - after setting `playerAccess: 'view'`: `assertFails(update({ hp: 5 }))`;
  - after `playerAccess: 'full'`: `assertSucceeds(update({ ac: 18, maxHP: 30, hp: 25 }))`, `assertFails(update({ ownerCharId: 'b' }))`;
  - as `authenticatedContext('gm')`: `assertSucceeds(update({ playerAccess: 'view' }))`, `assertSucceeds(delete)`.
- [ ] **Step 3: Implement** the `match /users/{gmId}/companions/{companionId}` block exactly as in the spec's Security rules section, inside `match /databases/{database}/documents`.
- [ ] **Step 4: Run** the emulator tests → PASS (or, without Java 11+, record that rules tests are pending and tell the user).
- [ ] **Step 5: Commit** — `git commit -m "Firestore rules for companions: per-access player updates, art size limit"`

---

### Task 8: Finish

- [ ] Run `node tests/<each>.test.js` and `cd tests && node run-browser-tests.js` (add `companion.browser.test.js` to the runner list) — all pass.
- [ ] Bump `app.js?v=`, `style.css?v=`, `companion-rules.js?v=` in `index.html`.
- [ ] Screenshot the NPC Companion panel, the player companion sheet in each access mode, and the tracker row; fix anything visibly off.
- [ ] Update `project_dnd_tracker.md` memory.
- [ ] Commit; report to the user; deploy (hosting **and** `firestore.rules`) and push only when they say so.
