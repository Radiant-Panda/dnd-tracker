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
| Player control | "Run it in play": HP, temp HP, conditions, limited-use abilities, rolls. GM owns stats. |
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
| `name`, `role`, `race`, `location` | GM app | copied from the NPC |
| `statSource`, `statBlock`, `legendaryMax` | GM app | copied from the NPC (`statBlock` has the combat tracker's shape) |
| `ac`, `maxHP`, `initBonus` | GM app | copied from the NPC; `initBonus` = DEX mod from the stat block, else the NPC's initiative bonus |
| `hp`, `tempHP`, `conditions`, `uses` | GM app **and owning player** | play state; `uses` = `{ [useKey]: usedCount }` |

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
  allow get: if request.auth != null && resource.data.shareToken != null;
  allow update: if request.auth != null
    && resource.data.shareToken != null
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['hp', 'tempHP', 'conditions', 'uses'])
    && request.resource.data.hp is number
    && request.resource.data.hp >= 0
    && request.resource.data.hp <= resource.data.maxHP
    && request.resource.data.tempHP is number
    && request.resource.data.tempHP >= 0;
}
```

- The GM keeps full access through the existing `users/{gmId}/{document=**}` owner rule.
- Players cannot create, delete, list, rename, change stats, or read NPC secrets (those never leave the NPC).
- As with shared characters today, a companion is reachable only by its long random ID. Reassignment
  therefore issues a **new ID** (see below) so a previous owner's remembered ID stops working.

## GM experience

### NPC page — Companion panel

- Not a companion: **Make companion of** `[campaign character ▾]`. Suggests choosing a stat block first
  if the NPC has none (allowed without one; the player then sees AC and HP only).
- Companion: "Companion of Aria" with **Change owner** `[▾]` and **End companionship** (in-page confirm).
- If the owner's character has no share link yet: a note to use **Share** on that character.
- The NPC page's HP fields read and write the companion record while it is a companion.
- Editing the NPC's name, role, race, location, AC, max HP, initiative bonus or stat block updates the
  companion record's copies.

### Lifecycle (all done by the GM app, record and links changed together)

| Action | Effect |
|---|---|
| Make companion | Create record (copy public fields; `hp`/`tempHP` from the NPC; `conditions: []`; `uses: {}`); add id to owner's `companionIds`; set `npc.companionId`. |
| Change owner | Create a **new** record with a new id and `shareToken`, copying everything incl. play state; delete the old record; move the id between the two characters' `companionIds`; update `npc.companionId` and any combatant `companionId`. |
| End companionship | Copy `hp`/`tempHP` back to the NPC; delete the record; remove from owner's `companionIds`; clear `npc.companionId`; tracker rows keep their current numbers but lose the link. |
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
  - Header: name, role • race • location, "Companion of Aria".
  - Vitals: AC, speed, initiative bonus, HP current / max / temp with Damage / Heal / Temp HP controls.
    Damage uses temp HP first. At 0 HP: **Down** marker.
  - Conditions: add / remove tags with the rules pop-up; durations count down in combat as today.
  - Stat block: abilities, saves, skills, senses; actions, bonus actions, reactions, legendary actions;
    each attack with **roll to hit** and **roll damage**.
  - Limited-use abilities as pips (next section).
  - **Long Rest** (HP to max, all uses back) and **Short Rest** (short-rest uses back).
- Stats, name and stat block are not editable; player writes contain only `hp`, `tempHP`,
  `conditions`, `uses`.

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
  reassignment; companion sheet hides private fields and has no stat editing; damage / heal / rests /
  pips; combat sync both ways; quick add group; "Add all PCs" excludes companions; exact HP in player
  view; Down at 0 HP and not skipped.
- **Security rules:** Firebase emulator tests (needs Java — check first; if missing, the user installs
  it): player can update play fields, cannot change stats or name, cannot set `hp` above `maxHP` or
  below 0, cannot create or delete; GM full access.
- Nothing is deployed or pushed without the user's go-ahead.

## Out of scope for stage 1

Class companions and level scaling; sidekicks, levelling and death saves; companions acting on the
owner's turn; companion portraits; players editing stats or seeing GM-private NPC fields; spell slots
for spellcasting NPCs beyond N/Day uses; fixing the other monster-data text glitches
("to hit to hit", "m,r +4").
