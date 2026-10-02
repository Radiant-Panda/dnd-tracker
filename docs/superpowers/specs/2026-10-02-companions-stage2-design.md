# Companions — Stage 2 Design: class companions, summons, familiars, mounts

Date: 2026-10-02
Status: approved in conversation, awaiting spec review

## Goal

Let characters have the companions their own rules give them: class companions (Steel Defender,
Primal Companion beasts, Drake Companion, Wildfire Spirit…), spell summons (Summon Beast, Find Steed,
Giant Insect…), Find Familiar forms (plus Pact of the Chain) and ordinary mounts and pets. Their
numbers are **computed live** from the owner (class level, ability modifiers, proficiency bonus, spell
attack / save DC) and from the spell level they were cast at, so they update on level-up with no one
re-typing a stat block.

Stage 1 (NPC companions the GM hands to a player) is built on branch `companions` and stays as it is.
Stage 3 (Tasha's sidekicks) is still to design. "Player attacks in combat" (players picking targets and
sending damage into the tracker) is a separate feature, designed after this one.

## Decisions (from the user)

| Topic | Decision |
|---|---|
| Scope | Everything at once: class companions, spell summons, familiars (+ Pact of the Chain), mounts & pets |
| Storage | On the **character record** (`ch.ownCompanions`), not as Stage 1 companion records — no new security rules |
| Numbers | Computed live from templates that keep the 5etools formulas; unparseable formulas show their text plus a manual number box |
| GM edits | GM can override AC, max HP, speed, initiative bonus, attack bonus, save DC; marked "GM edited" with "Reset to calculated"; overrides survive level-ups. GM-only is enforced by the app UI only (the character record is player-writable) — accepted for now |
| Summoning | Casting a summon spell pops up the form picker and adds the companion; Find Familiar asks which form |
| Concentration | Summons that need concentration are dismissed when concentration ends |
| Class features | Offered once when gained ("Add your Steel Defender?") |
| Manual add | "+ Add companion" picker for player and GM |
| Where they show | Player view tabs (like Stage 1); GM character page Companions panel. **No** campaign-level Companions tab |
| Combat | Auto-offered when the owner is added; per-template "acts right after owner" default the GM can flip |
| Build | Four phases, each usable on its own; nothing deployed until all four are done unless the user asks |

## Phase 1 — Templates and the maths

### Build script: `data/build-companion-templates.js` → `data/companion_templates.js`

Reads the 5etools bestiary (`C:\Users\Kiana\Downloads\5etools-src-main\data\bestiary`) and spell /
class data, and writes `COMPANION_TEMPLATES` keyed by `"<name>|<source>"`.

Included:

- **Formula creatures** — every monster with `summonedBySpell` or `summonedByClass` (37 today: 24 by
  spell, 13 by class, both editions; e.g. Steel Defender TCE / EFA, Beast of the Land TCE / XPHB,
  Bestial Spirit TCE / XPHB, Otherworldly Steed XPHB, Animated Object XPHB, Hound of Ill Omen XGE —
  resolve `_copy` entries before reading them).
- **Familiar forms** — the creatures named in Find Familiar (PHB and XPHB), plus the Pact of the Chain
  extras (from the Warlock class data: imp, pseudodragon, quasit, sprite; 2024 adds skeleton, slaad
  tadpole, sphinx of wonder). Fixed stats.
- **Find Steed (2014)** forms (warhorse, pony, camel, elk, mastiff). Fixed stats.
- **Mounts & pets** — beasts from the bestiary tagged as mounts / common animals (riding horse, draft
  horse, mule, mastiff, pony, camel, warhorse, cat, dog …). Fixed stats.

Each template:

```
{
  key, name, source, edition: '2014' | '2024',
  kind: 'class' | 'summon' | 'familiar' | 'mount',
  grantedBy: { cls?, subclass?, level?, spell?, spellLevel? },  // e.g. {cls:'Artificer', subclass:'Battle Smith', level:3}
  variants: ['Air','Land','Water'] | null,                       // "(Air only)" style options
  concentration: boolean,                                        // from the spell's duration
  turn: 'afterOwner' | 'own' | 'sharesOwner',                    // see Combat
  persistent: boolean,      // stays between sessions (Steel Defender, Primal Companion beasts, Drake Companion,
                            // Homunculus Servant TCE, familiars, steeds, mounts) vs. a temporary summon
                            // (Hound of Ill Omen, Wildfire Spirit, Dancing Item, every Summon X spirit…)
  atZero: 'down' | 'vanish',                                     // persistent → 'down', temporary → 'vanish'; familiars 'vanish'
  size, type, alignment,
  ac:  { value?, formula?, text },     // text = the original 5etools wording
  hp:  { value?, formula?, text, hitDie? },
  speed, abilities: {str,…}, saves, skills, senses, languages, immunities…,
  traits, actions, bonus_actions, reactions,   // entry text keeps formulas, e.g. "+ the spell's level"
  revive: string | null,                        // the creature's own "if it dies / mending" rule text
}
```

Stat block sections use the combat tracker's `statBlock` shape so the Stage 1 companion sheet and the
tracker can render them.

### Formula patterns understood

| Pattern (2014 and 2024 wordings) | Example |
|---|---|
| `A + B × your <Class> level` / "five times your ranger level" / "plus" | Beast of the Land HP |
| `+ your <Ability> modifier` | Steel Defender AC 2024: 12 + INT |
| `N + PB` | Drake Companion AC |
| `N + the level of the spell` / `the spell's level` / `1 per spell level` | Summon spirits AC, Otherworldly Steed AC |
| `N + M for each spell level above K` / `per spell level` | Summon spirits HP |
| Variants: `20 (Air only) or 30 (Land and Water only) + …` | Bestial Spirit HP |
| Variant bonus: `+ 2 (Defender only)` | Celestial Spirit AC |
| Size options: `10 (Medium or smaller), 20 (Large), 40 (Huge)` | Animated Object HP |
| In entries: `your spell attack modifier`, `your spell save DC`, `+ PB`, `the spell's level`, `your <Ability> modifier` | attack to-hit, damage bonus, DCs |

Anything not matched keeps its text; the sheet shows the text and a number box (stored as a GM-style
override, see below).

### Pure module: `companion-templates-rules.js` (loaded before `app.js`, unit-tested in Node)

- `parseFormula(text)` → `{ terms }` or `null`.
- `companionContext(ch, oc)` → `{ classLevel(cls), abilityMod(abbr), pb, spellAttack, spellDC,
  spellLevel, variant }` — owner values come from the existing rules helpers (`casterEntries`,
  ability mods, PB). Spell attack / DC use the class that grants the companion (or the casting class of
  the spell); fall back to the first caster class.
- `resolveCompanion(template, oc, ctx)` → the live sheet: `{ ac, maxHP, hitDice, speed, initBonus,
  statBlock (entries with formulas replaced by numbers), notes: { ac:'15 = 12 + INT 3', hp:'41 = 2 + INT 3 + 5 × Artificer 7', … } }`,
  then applies `oc.overrides`.
- `unresolvedFields(template)` → list of fields the parser could not read (used by the test that guards
  against a silent "HP 1").

## Data on the character

`ch.ownCompanions: OwnCompanion[]` (migrateCharacter defaults it to `[]`):

| Field | Notes |
|---|---|
| `id` | random (`uid()`) |
| `templateKey` | `"Steel Defender|TCE"` |
| `name` | defaults to the template name; owner can rename |
| `variant` | e.g. `'Air'`, `'Defender'`, `'Large'` — or null |
| `spellLevel` | for summons; null otherwise |
| `concentrationSpell` | spell name when it depends on concentration; null otherwise |
| `hp`, `tempHP`, `conditions`, `uses`, `hitDiceUsed` | play state (same meanings as Stage 1) |
| `overrides` | `{ ac?, maxHP?, speed?, initBonus?, attackBonus?, saveDC?, [field]? }` — GM edits and manual numbers for unparsed formulas |
| `portrait`, `portraitZoom`, `portraitX`, `portraitY` | art, same as Stage 1 |
| `turnMode` | `'afterOwner' | 'own'` — starts from the template's `turn` |
| `createdAt` | |

`ch.companionOffers: string[]` — template keys already offered on level-up, so each offer appears once.

Computed values are never stored. `hp` is clamped to the live max HP on every render (a level-down or a
removed override can lower the max).

Player-view writes already send the whole character, so own companions sync with no rules change.
Stored text (names, overrides) is player-writable → always escaped when rendered and sanitised on load
(numbers are numbers, strings are short, known keys only), same lesson as Stage 1.

## Phase 2 — Companion panel and sheet

### GM character page — Companions panel

- Lists own companions: art, name, "(summoned, 4th level)" / "(familiar)" / "(Steel Defender)",
  HP bar, Down marker. Clicking opens the companion sheet in a modal.
- **+ Add companion** picker with groups: *From your class* (templates the character qualifies for by
  class / subclass / level), *Summon spells* (spells the character knows or has prepared, pick level ≥ the
  spell's level), *Familiars* (Pact of the Chain forms shown if the warlock has it), *Mounts & pets*.
  Variant picker where the template has variants.
- **Dismiss** on each companion (in-page confirm).
- Stage 1 NPC companions are unchanged and still listed as before ("Companions: Sildar").

### Companion sheet

Same layout as the Stage 1 companion sheet (vitals, conditions, stat block with roll buttons, uses
pips, rests), plus:

- Formula notes under AC / HP / attacks, e.g. "HP 41 = 2 + INT 3 + 5 × Artificer 7".
- **Hit Dice** where the rules give them (count from the template, `hitDiceUsed` tracked; short rest
  can spend them).
- **Down** marker at 0 HP with the creature's own revive rule text (e.g. Steel Defender's Mending /
  spell-slot revival).
- Owner can rename and set art. No access setting (the owner always runs it).
- **GM edits** (GM app only): edit buttons on AC, max HP, speed, initiative bonus, attack bonus, save DC;
  edited values show a "GM edited" mark and **Reset to calculated**. Unparsed formulas show their text
  and a number box for both GM and player.
- Long rest restores HP and uses; summons that last until dismissed stay; concentration summons end
  (see Phase 3).

### Player view

Tabs at the top: `Aria` | `Sildar (companion)` | `Bestial Spirit (summoned, 4th level)` |
`Owl (familiar)`. Own companions render the same sheet, without the GM edit controls. The player can
add (same picker), dismiss, rename and set art.

## Phase 3 — Spell and class-feature hooks

- **Cast** (`confirmCast` / `confirmCastPact` / `confirmCastRitual`): if the spell is a summon
  spell (any template with `grantedBy.spell` matching it, by edition), a popup "Bestial Spirit summoned
  (4th level) — choose form: Air / Land / Water" adds the companion with `spellLevel` and
  `concentrationSpell`. Casting the same summon again replaces the earlier one from that spell.
- **Find Familiar**: popup asks which form (Pact of the Chain forms included when the warlock has the
  pact). Only one familiar at a time — the new one replaces the old (the rules let you change form).
- **Find Steed (2014)**: form picker; **Find Steed (2024)**: Otherworldly Steed with its variant.
- **Concentration end**: a summon with `concentrationSpell` is dismissed whenever
  `ch.activeConcentration?.spellName` no longer matches it — covers the × button, a failed check, a new
  concentration spell, and long rest. Implemented as one pure check
  (`staleConcentrationCompanions(ch)`) run after any change to `activeConcentration`, rather than in
  each place. A toast says "Bestial Spirit vanished (concentration ended)".
- Familiars, steeds, class companions and mounts stay until dismissed.
- **Class features**: when `_syncSubclassFeaturesFor` / level-up gives a character a feature whose
  template has `kind: 'class'` and `persistent: true` and the key isn't in `ch.companionOffers`, show "Add your Steel
  Defender?" (Add / Not now). Either answer records the offer. Ranger Beast Master (2014 Primal Companion
  TCE, 2024 XPHB) offers the beast picker with Land / Sea / Sky.
- Temporary class creatures (Hound of Ill Omen, Wildfire Spirit, Dancing Item, Homunculus Servant EFA)
  are not offered on level-up; they are added from *From your class* in the picker when used.

## Phase 4 — Combat

- **Adding a character** (quick add and "Add all PCs") shows their active own companions as ticked
  checkboxes; unticking leaves one out.
- **Summoning mid-fight**: when combat is running, the summon popup has "Add to combat" ticked.
- **Add menu**: own companions listed under their owner ("Bestial Spirit · Aria's") for adding later.
- **Turn order**:
  - `turnMode: 'afterOwner'` — default for Steel Defender, Primal Companion beasts, Drake Companion,
    Wildfire Spirit, Homunculus Servant and the Summon X spirits. Shown as a slightly indented row right
    below the owner; its initiative follows the owner's (moves if the owner's initiative changes or the
    owner is re-rolled); Next Turn steps owner → companion.
  - `'own'` — familiars (both editions roll their own initiative) and others; rolled with the
    companion's own initiative bonus.
  - Find Steed 2024 shares the owner's initiative — treated as `afterOwner`.
  - The GM can flip the mode on any companion row.
- **Linking**: a combatant with `ownCompanion: { charId, companionId }` is linked like `charId` /
  `npcId` / `companionId` today: `_syncLinkedCombatants` reads hp / tempHP / maxHP / ac / conditions
  from the live companion; `_pushLinked` writes hp / tempHP / conditions back to `ch.ownCompanions`.
  (Remember: write to the linked card before `combatLog`, which re-syncs.)
- **0 HP**: follows the template's `atZero`. `'down'` (Steel Defender, Primal Companion beasts, Drake
  Companion, steeds, mounts) → **Down**, not skipped. `'vanish'` (summons, familiars, temporary class
  creatures) → companion dismissed and row removed, with a log line.
- **Dismiss / concentration end** removes the row.
- **Player view**: the owner sees their companion's real numbers; other players see it as an ally (exact
  HP, as Stage 1 companions).

## Testing

- **Unit (Node), `tests/companion-templates.test.js`**: every formula pattern above; Steel Defender HP
  at Artificer 3 / 7 / 15 (TCE and EFA wordings); Beast of the Sky vs Land; Bestial Spirit Air vs Land at
  2nd and 5th level; Celestial Spirit Defender AC; Animated Object sizes; attack bonus from spell attack
  modifier; overrides win and survive a level change; `hp` clamp; `staleConcentrationCompanions`;
  sanitising bad stored data. A test lists every template with unresolved fields and fails on a new
  silent one.
- **Browser (puppeteer, from disk)** `tests/own-companions.browser.test.js`: add from each picker group;
  rename, art, dismiss; level-up changes the numbers and keeps GM edits; Reset to calculated; player view
  tabs; cast summon → picker → added; Find Familiar replace; concentration × / new concentration spell /
  long rest dismiss; class-feature offer appears once; combat auto-add checkboxes, after-owner row
  order and Next Turn, initiative follow, HP sync both ways, 0 HP Down vs vanish.
- Existing suites keep passing: `node tests/*.test.js`, `cd tests && node run-browser-tests.js`, and the
  Stage 1 rules tests (no rules change in Stage 2).
- Nothing is deployed or pushed without the user's go-ahead. Remember to bump `app.js?v=` (and the new
  scripts' `?v=`) before deploying.

## Out of scope

Players picking targets and sending damage into combat (next feature); sidekicks (Stage 3); Wild Shape;
Conjure Animals / Conjure X (2014 — they summon ordinary monsters, use "Mounts & pets"-style manual add
for now); multiple controlled creatures from Animate Dead (can be added manually one by one);
server-side enforcement of GM-only overrides; fixing the general monster-data text glitches in
`data/monsters.json`.
