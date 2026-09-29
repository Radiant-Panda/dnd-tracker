# Companions — Stage 1 Design

Date: 2026-09-28
Status: approved in conversation, awaiting spec review

## Goal

Let the GM hand an NPC to a player as a **companion** (an NPC ally or hireling). The player sees a
play-focused sheet for it in their player view and runs it in play: HP, temp HP, conditions,
limited-use abilities and dice rolls. The GM keeps ownership of its stats and everything private
about the NPC.

This is stage 1 of three. Later stages build on the same companion record:

- **Stage 2 — class companions** (Ranger's beast, Find Familiar, Steel Defender): stats that scale
  with the owner's level; some act on the owner's turn.
- **Stage 3 — sidekicks** (Tasha's Expert / Spellcaster / Warrior): their own levels and level-up,
  death saves.

## Decisions (from the user)

| Topic | Decision |
|---|---|
| Kinds of companion wanted | NPC allies, class companions, sidekicks — built in that order |
| Player control | Three settings per companion, chosen by the GM: **View only**, **Run in play** (default), **Full edit** — see "Player access settings". |
| Art | Both the GM and the owning player can add and frame art for the companion (not in View only). |
| What the player can see | Name; role, race and location; AC, HP; the stat block. **Not** personality, goals, relationships, secrets or notes. |
| Storage approach | A separate companion record holding only shareable fields + play state (approach A). Can be revisited later. |
| Owners | One owning character at a time; a character can have several companions. |
| Reassigning | Moves live between players' views; the old owner's access is cut off. |
| Combat entry | Quick add only. "Add all PCs" does **not** add companions. |
| HP visibility | All players see companions' exact HP (they are party members). |
| 0 HP | Shown as **Down**; not skipped in the turn order; no death saves in stage 1. |

## Data

### Companion record — `users/{gmId}/companions/{companionId}`

| Field | Written by | Notes |
|---|---|---|
| `id`, `campaignId`, `npcId`, `ownerCharId`, `createdAt` | GM app | links |
| `shareToken` | GM app | random; must be non-null for players to read it (same model as shared characters) |
| `name`, `role`, `race`, `location` | GM app; player in `full` | copied from the NPC |
| `statSource`, `statBlock`, `legendaryMax` | GM app; player in `full` | copied from the NPC (`statBlock` has the combat tracker's shape) |
| `ac`, `maxHP`, `initBonus` | GM app; player in `full` | copied from the NPC; `initBonus` = DEX mod from the stat block, else the NPC's initiative bonus |
| `playerAccess` | GM app | `'view'`, `'play'` (default) or `'full'` |
| `hp`, `tempHP`, `conditions`, `uses` | GM app; player in `play` / `full` | play state; `uses` = `{ [useKey]: usedCount }` |
| `portrait`, `portraitZoom`, `portraitX`, `portraitY` | GM app; player in `play` / `full` | art: a 400×400 JPEG data URL from the existing crop tool, plus the framing values |

The NPC's private fields (`personality`, `goals`, `relationships`, `secrets`, `notes`) are never copied.

### Links on existing records

- **Character:** `companionIds: string[]` — how the player view finds its companions.
- **NPC:** `companionId: string | null` — while set, the companion record is the source of truth for
  HP, temp HP and conditions; the NPC's own `hp`/`tempHP` are not used.
- **Combatant (tracker row):** `companionId` — linked like `charId` / `npcId` today.

Existing records are untouched until an NPC is made a companion.

### GM app storage and sync

`db.companions` (keyed by id) joins `db.characters` and `db.npcs` everywhere they are handled today:
local storage, the initial Firestore load, the diff-based batch save (`_takeSnapshot` / sync), the live
`onSnapshot` listener, export / import, and deleting a campaign (its companions go with it).

## Security rules

```
match /users/{gmId}/companions/{companionId} {
  function playFields() {
    return ['hp', 'tempHP', 'conditions', 'uses', 'portrait', 'portraitZoom', 'portraitX', 'portraitY'];
  }
  function fullFields() {
    return playFields().concat(['name', 'role', 'race', 'location', 'ac', 'maxHP', 'initBonus',
                                'statBlock', 'statSource', 'legendaryMax']);
  }
  function changed() { return request.resource.data.diff(resource.data).affectedKeys(); }

  allow get: if request.auth != null && resource.data.shareToken != null;
  allow update: if request.auth != null
    && resource.data.shareToken != null
    && ((resource.data.playerAccess == 'play' && changed().hasOnly(playFields()))
        || (resource.data.playerAccess == 'full' && changed().hasOnly(fullFields())))
    && request.resource.data.hp is number
    && request.resource.data.hp >= 0
    && request.resource.data.hp <= request.resource.data.maxHP
    && request.resource.data.tempHP is number
    && request.resource.data.tempHP >= 0
    && (!('portrait' in request.resource.data) || request.resource.data.portrait == null
        || (request.resource.data.portrait is string && request.resource.data.portrait.size() < 300000));
}
```

- The GM keeps full access through the existing `users/{gmId}/{document=**}` owner rule.
- In **View only** (`playerAccess == 'view'`) players cannot change anything.
- Players can never create, delete or list companions, change `playerAccess`, the links or the
  `shareToken`, or read NPC secrets (those never leave the NPC). Stats and names change only in `full`.
- As with shared characters today, a companion is reachable only by its long random ID. Reassignment
  therefore issues a **new ID** (see below) so a previous owner's remembered ID stops working.

## GM experience

### NPC page — Companion panel

- Not a companion: **Make companion of** `[campaign character ▾]`. Suggests choosing a stat block first
  if the NPC has none (allowed without one; the player then sees AC and HP only).
- Companion: "Companion of Aria" with **Change owner** `[▾]` and **End companionship** (in-page confirm).
- **Player access** control with three options: *View only* / *Run in play* / *Full edit* (default *Run in play*).
- **Art**: shows the companion's art with **Upload** / **Adjust** / **Remove**, using the character
  sheet's crop and framing tools.
- If the owner's character has no share link yet: a note to use **Share** on that character.
- The NPC page's HP fields read and write the companion record while it is a companion.
- Editing the NPC's name, role, race, location, AC, max HP, initiative bonus or stat block updates the
  companion record's copies. In **Full edit**, the player's changes to those fields are copied back onto
  the NPC by the GM app when it sees them. Whichever change is made last wins.

### Lifecycle (all done by the GM app, record and links changed together)

| Action | Effect |
|---|---|
| Make companion | Create record (copy public fields and any NPC art; `hp`/`tempHP` from the NPC; `conditions: []`; `uses: {}`; `playerAccess: 'play'`); add id to owner's `companionIds`; set `npc.companionId`. |
| Change owner | Create a **new** record with a new id and `shareToken`, copying everything incl. play state, art and `playerAccess`; delete the old record; move the id between the two characters' `companionIds`; update `npc.companionId` and any combatant `companionId`. |
| End companionship | Copy `hp`/`tempHP` and the art back to the NPC; delete the record; remove from owner's `companionIds`; clear `npc.companionId`; tracker rows keep their current numbers but lose the link. |
| Delete the NPC | End companionship first, then delete. |
| Delete the owning character | End each of its companionships first (HP back to the NPCs). |

### Where companions show for the GM

- NPC list card: tag **Companion · Aria**.
- Characters tab card: "Companions: Sildar".

## Player experience

- **Tabs** at the top of the player view: `Aria` | `Sildar (companion)` — shown only when the character
  has companions.
- The player view listens to its character live; when `companionIds` changes it attaches or detaches
  companion listeners, so a reassigned companion disappears / appears without a reload.
- **Companion sheet** (play-focused, not a full character sheet):
  - Header: art, name, role • race • location, "Companion of Aria".
  - Vitals: AC, speed, initiative bonus, HP current / max / temp with Damage / Heal / Temp HP controls.
    Damage uses temp HP first. At 0 HP: **Down** marker.
  - Conditions: add / remove tags with the rules pop-up; durations count down in combat as today.
  - Stat block: abilities, saves, skills, senses; actions, bonus actions, reactions, legendary actions;
    each attack with **roll to hit** and **roll damage**.
  - Limited-use abilities as pips (next section).
  - **Long Rest** (HP to max, all uses back) and **Short Rest** (short-rest uses back).

### Player access settings

| Setting | On the companion sheet the player can… |
|---|---|
| **View only** | view everything and roll dice. HP, conditions, pips, rest buttons and art controls are shown read-only, with a note that the GM is tracking this companion. |
| **Run in play** | also change HP / temp HP, conditions and pips, use the rest buttons, and upload / adjust / remove art. |
| **Full edit** | also edit name, role, race, location, AC, max HP and initiative bonus, and choose or remove the stat block from the monster search — the same fields as the GM's NPC page, minus the private ones. |

The sheet updates live when the GM changes the setting. Writes from the player contain only the fields
their setting allows, and the security rules reject anything else.

## Combat

- **Quick add** gains a **Companions** group ("Sildar · Aria's companion"). Initiative = d20 + the
  record's `initBonus`. "Add all PCs" is unchanged (characters only).
- A combatant with `companionId` reads HP, temp HP, max HP, AC and conditions from the record, and
  tracker changes write back to it (same pattern as `_syncLinkedCombatants` / `_pushToNpc`).
- Own initiative and turn (acting on the owner's turn is a stage 2 option).
- GM view: row labelled "Companion · Aria"; stat block and action buttons as for monsters.
- Player view: exact HP shown to all players (not Healthy / Bloodied); tracker stays read-only.
- At 0 HP: **Down**, not defeated, not skipped.

## Limited-use abilities

New pure module `companion-rules.js` (loaded before `app.js`, unit-tested in Node).

| Stat block text | Use definition | Restored by |
|---|---|---|
| Name contains `{@recharge N}` | 1 use, label "Recharge N–6" | a **Roll recharge** d6 ≥ N; long rest |
| Name contains `{@recharge}` | 1 use, label "Recharge 6" | d6 = 6; long rest |
| Name contains `(N/Day)` or `(N/Day, or M/Day in Lair)` | N uses | long rest |
| Name contains `Recharges after a Short or Long Rest` | 1 use | short or long rest |
| Name contains `Recharges after a Long Rest` | 1 use | long rest |
| Spellcasting description `N/Day Each: A, B` | N uses per listed spell | long rest |
| Any other "Recharges after …" | 1 use | manual reset |

- Use keys are stable strings derived from section + ability name (+ spell name).
- `cleanAbilityName(name)` turns `{@recharge 5}` into `(Recharge 5–6)` and `{@recharge}` into
  `(Recharge 6)`; used wherever stat blocks are shown (companion sheet, NPC page, combat tracker).
- Tapping a pip marks a use spent; tapping a spent pip restores it. Recharge rolls are manual.

## Testing

- **Unit (Node):** use parsing for every row above against real `data/monsters.json` entries; name
  cleanup; rest restoration; building a companion record from an NPC (private fields excluded).
- **Browser (puppeteer, from disk):** make / change owner (new id, play state kept, combatant relinked) /
  end companionship; delete NPC or owner ends it; player-view tabs appear and disappear on
  reassignment; companion sheet hides private fields; each access setting shows and hides the right
  controls and switches live; art upload / adjust / remove by GM and player; Full edit changes copied back
  to the NPC; damage / heal / rests /
  pips; combat sync both ways; quick add group; "Add all PCs" excludes companions; exact HP in player
  view; Down at 0 HP and not skipped.
- **Security rules:** Firebase emulator tests (needs Java — check first; if missing, the user installs
  it): per setting — View only rejects every player write; Run in play allows play fields and art but not
  stats or names; Full edit allows stats and names but never `playerAccess`, links or `shareToken`;
  `hp` never above `maxHP` or below 0; art over the size limit rejected; players cannot create or delete;
  GM full access.
- Nothing is deployed or pushed without the user's go-ahead.

## Out of scope for stage 1

Class companions and level scaling; sidekicks, levelling and death saves; companions acting on the
owner's turn; portraits for NPCs that are not companions (art is kept on the NPC for later); players
seeing GM-private NPC fields; editing individual stat block entries (Full edit swaps whole stat blocks); spell slots
for spellcasting NPCs beyond N/Day uses; fixing the other monster-data text glitches
("to hit to hit", "m,r +4").
