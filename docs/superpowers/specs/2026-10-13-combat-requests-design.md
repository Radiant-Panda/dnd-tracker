# Combat Requests — players send damage and healing to the tracker

Date: 2026-10-13
Status: approved in conversation, awaiting spec review

## Goal

During a fight, a player tells the app what their attack or spell did — targets, amounts, damage
types, save details — and the GM's tracker turns that into HP changes. Hit or miss stays at the table:
players roll real dice and say their attack roll aloud; the GM says whether it hits. The app only
carries the damage (or healing) once it is known, and works out resistances so the GM doesn't have to.

## Decisions (from the user)

| Topic | Decision |
|---|---|
| Dice | Real dice. No attack rolls in the app; the player types the damage they rolled |
| Hit/miss | Handled aloud at the table — the app never compares rolls to AC |
| GM control | GM approves every request, unless they switch on **auto-apply** for the current fight |
| Auto-apply | Off at the start of every combat; resets when combat ends |
| What the player sees | Only the tracker changing (monster labels Healthy/Bloodied/Defeated, ally HP as today). No "applied"/"dismissed" message; a dismissed request just disappears |
| Damage types | Resistances, immunities and vulnerabilities from the target's stat block apply automatically; GM can edit the final number. Conditional ones ("from nonmagical attacks") are flagged, not applied |
| Multi-target | One request can hit several targets |
| Split / mixed damage | Damage is entered as **parts** (amount + type). Targets copy the shared parts by default; each target can have its own parts |
| Saves | The **GM** marks who saved (the GM rolls monster saves). The player only says it is a save effect, what a success does (half / none) and optionally the save ability and DC |
| Healing | Same form with a Heal toggle; any combatant can be targeted |
| Notes | Short free-text note ("Fireball", "Sneak Attack") shown on the GM card and in the log |
| Undo | Yes — for applied requests (manual or auto), last 10 of the current combat |
| Transport | Separate request records in a new Firestore sub-collection (approach A) |

## Player side

While combat is active (the campaign has combatants), the player view's combat tab shows a
**"⚔ Send damage / heal"** button. No combat → no button.

The button opens a modal:

- **From** — the player's character, or one of their companions (own companions on the character and
  Stage 1 companions they own). Default: the character.
- **Damage / Heal** toggle.
- **Damage parts** (Damage only) — one or more rows of *amount* + *type* (13 types: acid, bludgeoning,
  cold, fire, force, lightning, necrotic, piercing, poison, psychic, radiant, slashing, thunder).
  "+ part" adds a row, up to 4. For Heal: a single amount, no type.
- **Saving throw effect** (Damage only) — checkbox. When ticked: *On a success:* half / none, and
  optional save ability (STR…CHA) and DC (1–30).
- **Targets** — tick list of every combatant in the tracker. Monsters show their name and health label
  only; no AC or HP numbers for monsters/NPCs. Defeated monsters/NPCs are greyed out and can't be
  ticked; characters and companions at 0 HP stay selectable (they can be healed).
- Each ticked target uses the shared parts. An **"edit"** link on a target line turns on that target's
  own parts (prefilled from the shared ones); "use shared" turns it back off.
- **Note** — optional, up to 100 characters.
- **Send** — disabled until at least one target is ticked and every amount is a whole number 0–999.

After sending, under the button: **"Waiting for the GM"** with a line per pending request
("Fireball → Goblin 1, Goblin 2") and a **Cancel** link. A pending line disappears when the GM applies
or dismisses it (the record is deleted) or the player cancels.

## GM side

### Requests panel

Above the initiative list, a **Requests** panel shown only when requests are waiting, with a count.
Next to it (always visible during combat) the **Auto-apply** switch.

Each request is a card:

> **Thorn → Fireball** · DEX save DC 15 · half on save
> ☐ Saved · Goblin 1 — 28 fire → [28]
> ☑ Saved · Goblin 2 — 28 fire → [14]
> ☐ Saved · Ogre — 8 slashing + 9 fire *(immune to fire)* → [8]
> ⚠ Wraith resists slashing from nonmagical attacks — check

- Title: sender name (companion name if a companion sent it) and the note.
- Save line only on save requests; **Saved** ticks only on save requests.
- Each target line shows its parts, explanation tags (resistant / immune / vulnerable / saved), and a
  number box holding the calculated amount. Ticking Saved recalculates the box; typing in the box
  overrides it (an edited box is no longer recalculated by Saved ticks).
- Targets that are no longer in the tracker show "(gone)" and are skipped.
- Buttons: **Apply**, **Dismiss**. Both delete the record.

### Applying

`applyCombatRequest(req, amounts)` — for each surviving target, in order:

1. Snapshot the row (and linked character / companion): hp, tempHP, death saves.
2. Damage → `_damageCombatant(i, amount)`; Heal → the existing heal path (never above max HP; a dead
   monster/NPC at 0 HP is not revived by healing — matches current behaviour). Rows are found by
   combatant id each time, because summons may vanish mid-request.
3. One combat log entry per request, e.g.
   "Thorn (Fireball): Goblin 1 takes 28 fire; Goblin 2 takes 14 fire (saved); Ogre takes 8 (immune to fire)".
   Heal: "Mira (Cure Wounds): Thorn heals 9".

Linked characters/companions stay in sync through the existing `_syncLinkedCombatants` / write-back
paths (write before logging — see the companions gotcha about `combatLog()` re-syncing).

### Auto-apply

Stored on the initiative record (`init.autoApply`), so ending combat resets it. When on, a newly
arrived **non-save** request is applied immediately with its calculated amounts. **Save requests
always wait** in the panel — their saves haven't been rolled. Conditional-resistance requests apply at
the calculated (un-reduced) amount, and the log entry adds "check: <condition text>".

### Undo

Every applied request pushes `{requestSummary, snapshots}` onto `init.undo` (max 10, newest first).
Recent log entries for applied requests carry an **Undo** link. Undo restores each snapshot onto rows
that still exist (by combatant id; linked characters/companions written back), skips rows that are gone
(log says "Steel Defender was gone — not restored"), removes the undo entry and logs "Undid: …".
Undo is GM-only.

### End of combat

`clearInitiative()` deletes every waiting request for the campaign and clears `init.undo` and
`init.autoApply`. Requests also carry `combatId`; the GM ignores and deletes requests whose `combatId`
doesn't match the current combat (left over from an earlier fight).

## Data

### Combat id

`init.combatId` — random id created when the first combatant is added to an empty tracker (and on
migration if missing). Players read it from the campaign doc they already receive.

### Request record

`users/{gmId}/campaigns/{campaignId}/combatRequests/{requestId}`

```
{
  uid:        <creator's auth uid>,
  charId:     <sending character id>,
  shareToken: <that character's share token>      // proves the player holds the link
  combatId:   <init.combatId at send time>,
  fromCompanionId: <companion id or ''>,
  fromName:   <display name, ≤ 60 chars>,
  kind:       'damage' | 'heal',
  note:       <≤ 100 chars>,
  save:       null | { onSave: 'half'|'none', ability: ''|'STR'..'CHA', dc: 0..30 },
  targets:    [ { cbId: <combatant id>, parts: [ { amount: 0..999, type: <damage type or ''> } ] } ],
  createdAt:  <server timestamp>
}
```

Each target always carries its own parts in the record (the "shared parts" idea is player-UI only).
Limits: 1–20 targets, 1–4 parts per target; heal requests have exactly one part with type `''`.

### Security rules

```
match /users/{gmId}/campaigns/{campaignId}/combatRequests/{reqId} {
  // GM: covered by the existing /users/{gmId}/{document=**} owner rule.
  allow create: if signed in
    && request.resource.data.uid == request.auth.uid
    && campaign(gmId, campaignId).characters has request.resource.data.charId
    && character(gmId, charId).shareToken != null
    && request.resource.data.shareToken == character(gmId, charId).shareToken
    && validRequest(request.resource.data);      // shape + limits above, exact key set
  allow get, list, delete: if signed in && resource.data.uid == request.auth.uid;
  // no update
}
```

`validRequest` checks the exact key set, types, string lengths, `kind`, `save` shape, target and part
counts (lists up to 20 / 4 can be checked by index in rules), amount ranges and that each `type` is in
the fixed list. Players list their own pending requests with `where('uid', '==', auth.uid)`, which
these rules allow and which survives a page reload (anonymous uid persists).

The GM app **re-validates** every request with `sanitizeRequest` regardless of the rules, and escapes
every player-written string (`fromName`, `note`) when rendering. A request whose `charId` isn't in the
campaign, or whose `fromCompanionId` isn't a companion owned by that character, is dropped.

## Code units

### `damage-rules.js` (new, pure, loaded before app.js, unit-tested in `tests/damage-rules.test.js`)

- `DAMAGE_TYPES` — the 13 types.
- `parseDefenses(statBlock)` → `{ resist: Set, immune: Set, vulnerable: Set, conditional: [ {kind, text} ] }`.
  Reads `damage_resistances` / `damage_immunities` / `damage_vulnerabilities` arrays (and string forms
  from older combatants). Handles the 5etools-converted strings where a condition in parentheses follows
  a list ("bludgeoning, piercing, slashing (from nonmagical attacks)") — those types become conditional,
  not plain.
- `resolveTargetDamage(parts, defenses, { saved, onSave })` → `{ total, tags, warnings }`.
  Order: save first (half → floor of each part, none → 0), then per part: immune → 0, resistant →
  floor(half), vulnerable → ×2 (resistant + vulnerable cancel). Total = sum of parts.
- `sanitizeRequest(raw, ctx)` → clean request or `null`. `ctx` gives the campaign's character ids and a
  companion-ownership check.
- `summarizeRequest(req, results, nameOf)` → combat-log text.

Players' characters (not monsters) have no structured damage defenses in the app; they get none
(`parseDefenses` of nothing → empty), and the GM edits the number if needed.

### app.js

- Player view: `openSendRequestModal()`, the form, `_sendCombatRequest()`, pending list listener
  (`_pvRequestUnsub`, torn down with the other player listeners), Cancel.
- GM: requests listener on the active campaign (torn down on sign-out / campaign switch),
  `renderRequestsPanel(init)`, `applyCombatRequest`, `dismissCombatRequest`, auto-apply toggle,
  `undoCombatRequest`, `clearInitiative` cleanup, `init.combatId` creation/migration.
- Bump `app.js?v=` (and `style.css?v=` if CSS changes) in index.html.

### firestore.rules

New `combatRequests` match block. Deploy needs **hosting and firestore rules** — ask the user first.

## Error handling

- Send fails (offline / rules reject) → the modal stays open with "Couldn't send — try again".
- GM applies a request whose targets are all gone → "Nothing to apply — targets are gone", record
  deleted.
- Two GM tabs open with auto-apply on: the apply deletes the record inside a transaction-style check
  (delete first; only the tab whose delete succeeds applies), so a request is never applied twice.
- Malformed requests (fails `sanitizeRequest`) are deleted silently.

## Testing

- **Unit** (`node tests/damage-rules.test.js`): parseDefenses on real strings from data/monsters.json
  (plain, multiple, conditional, mixed), resolveTargetDamage (half/none save, resist, immune,
  vulnerable, resist+vulnerable, save then resist ordering, odd numbers round down, multi-part mixed),
  sanitizeRequest (bad kinds, too many targets, out-of-range amounts, unknown types, long strings,
  foreign charId, wrong companion), summarizeRequest text.
- **Rules** (`tests/rules/combat-requests.rules.test.js`, Firestore emulator, portable Java 21): create
  allowed with valid shape + token; rejected for wrong token, character not in campaign, unshared
  character, extra keys, 21 targets, 5 parts, amount 1000, bad type, long note, uid mismatch; players
  can get/list/delete only their own; nobody but the GM can update; GM full access.
- **Browser** (`tests/combat-requests.browser.test.js`): player sends a multi-target fire request →
  GM card shows resistance/immunity maths; GM ticks Saved → amounts halve; Apply → HP and log correct;
  Undo restores; auto-apply applies a plain hit immediately but holds a save request; player Cancel
  removes it; End Combat deletes waiting requests; heal request respects max HP; summon that vanished
  is skipped by Undo; request with a stale combatId is ignored.

## Out of scope

- Attack rolls, hit/miss checks against AC.
- Players seeing results beyond what the tracker already shows.
- Structured damage defenses for player characters.
- Hiding monster AC/HP from the downloaded campaign doc (it is UI-hidden only — known, accepted).
