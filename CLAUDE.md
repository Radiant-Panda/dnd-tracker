# Tiny Tome

A D&D campaign tracker (characters, spells, monsters, NPCs, sessions, combat) for a GM and their players.
Live at https://dungeons-and-dragons-edd42.web.app. It used to be called "D&D tracker"; always call it Tiny Tome.

## Stack

- Vanilla JS, no framework and no build step: `index.html`, `style.css`, `app.js` (very large; search it, don't read it whole).
- Pure rules modules load before `app.js` and are unit-tested: `*-rules.js`, `rules-text.js`.
- Firebase compat v9: Firestore, Storage, Auth. GMs sign in with Google; players use anonymous auth plus a `shareToken`; setup links use a `setupToken`.
- Game data lives in `data/` as generated JS or JSON. The source is the 5etools dataset at `C:\Users\Kiana\Downloads\5etools-src-main`.

## Running and testing

- Local preview: `npx serve -l 5173 .`. Only start it when asked; it has been killed by memory pressure before.
- Unit tests: `node tests/<name>.test.js`.
- Browser tests: `cd tests && node run-browser-tests.js`. They use puppeteer-core with Chrome and open `index.html` from disk, so no server is needed.
- Firestore rules tests (`tests/rules/`) need the Firestore emulator and Java 21+. This PC has Java 8, so use a portable Temurin 21.
- Browser test gotchas: `await fetchAllSpells()` before casting (spells load lazily); `closeModal` only hides the modal (clear `#modal-content` yourself); `showConfirm` needs its `.btn-danger` clicked.
- Use TDD for new rules logic: put it in a `*-rules.js` module with a node test.

## 5e rules reference

Check rules questions against these instead of answering from memory. Both cover the 2014 and 2024 rules.

- **Readable Markdown (use this first):** `C:\Users\Kiana\5etools-for-claude\output\`. Start at `00-INDEX.md`. Folders: `spells/` (one file per level), `bestiary/` (one file per letter), `classes/` (one file per class and edition, e.g. `class-wizard-phb.md` vs `class-wizard-xphb.md`), `character/`, `items/`, `rules/`, `rulebooks/`, `adventures/`, `world/`, `misc/`. Each entry heading ends with its source code, e.g. `Fireball [PHB]` (2014) vs `Fireball [XPHB]` (2024). Grep the heading instead of reading whole files; they are large.
- **Raw 5etools JSON (what the build scripts read):** `C:\Users\Kiana\Downloads\5etools-src-main\data\`, e.g. `spells/`, `bestiary/`, `class/class-<name>.json`, `feats.json`, `races.json`, `backgrounds.json`, `items.json`, `optionalfeatures.json`. Text uses `{@tag ...}` markup.
- Neither is copied into this repo; it would bloat git and the hosting deploy.

## Regenerating data

- Class features: `node data/build-class-features.js && node data/inject-class-features.js`
- Class options: `node data/build-class-options.js`
- Rules-text markup (subclasses, feats, species, spells): `node data/update-rules-text.js`
- Official book imports: `node data/import-official-books.js [--dry] [spells|spells2014|feats|backgrounds|species|subclasses]`
- Others: `build-spellcasting.js`, `build-proficiencies.js`, `build-item-weights.js`, `build-companion-templates.js`, `add-subclass-resources.js`
- `data/subclass_spells.js` also holds SUBCLASS_TABLES. Never rewrite it wholesale.
- `process-spells.js` reads `../dnd-data-main`, not 5etools.

## Key patterns

- `migrateCampaign(c)` and `migrateCharacter(ch)` handle data migrations. `migrateCharacter` must stay side-effect free: a `saveData` call inside it once wiped data on load.
- Resources: `syncClassResources(ch)` runs on every render and never refills `current`.
- Subclass state lives in both `ch.subclass` and `ch.classes[i].subclass`. Always change it through `applySubclassForClass`.
- Spells: `spells.json` holds both editions. Use `_spellByName` / `getMergedSpells(ch)` / `fullSpellData(sp, ch)`; stored spell copies only contribute `_`-prefixed flags.
- Species: use `_speciesPool()` / `_findSpecies(name, ed)`.
- Typed fields autosave through `_queueSave()`.
- Combat: linked characters, NPCs, and companions are the source of truth (`_syncLinkedCombatants`). `combatLog()` re-syncs linked rows, so write to a linked card before logging.
- Anything a player can write (player view, companions) must be sanitized and escaped (`esc()`). An XSS was found here before.
- Sign-in: `signInWithGoogle` must open exactly one popup straight from the click, with no `await` before it.

## Deploying

- Deploys are outward-facing. Always ask the user first.
- Bump the `?v=` query on every changed asset in `index.html` (`app.js?v=`, `style.css?v=`, data files) before deploying. JS/CSS are cached for an hour, and only `/` and HTML are no-cache.
- `firebase deploy --only hosting`, or add `firestore:rules` when the rules changed.
- Hosting ignore must keep both `**/.*` and `**/.*/**` so `.git` is never published.

## Git

- `master` is the default branch. Start feature work on a branch.
- The default git/gh account on this PC (`ckiana`) has no access to the repo. Push as the owner:
  `git -c credential.helper= -c 'credential.helper=!f() { test "$1" = get && echo username=x-access-token && echo "password=$(gh auth token --user Radiant-Panda)"; }; f' push`
- The user merges PRs on GitHub themselves.
- `core.autocrlf=true`: checkout and stash turn files into CRLF. Edit scripts must normalise `\r\n` before exact-text matching.

## Specs and plans

Feature specs and plans are in `docs/superpowers/specs/` and `docs/superpowers/plans/`.

## Preferences

- Desktop comes first. Phone layout isn't a priority, but new UI should still work on phones where that's cheap: no fixed widths that force sideways scrolling, and tap targets that work without hover. Small overflow (about 14px at 390px wide) is known and acceptable.
- Keep it vanilla JS.
