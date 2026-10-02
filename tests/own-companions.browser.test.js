// Browser test for Stage 2 companions (own companions: class companions, summons, familiars, mounts).
// Opens the app from disk:   cd tests && node own-companions.browser.test.js
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  await pg.evaluate(() => {
    showToast = () => {}; _showApp();
    window.out = [];
    window.check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    // Campaign cO with one character "Tinker" (2014, INT 16) open on the GM character page
    window.setup = (cls = 'Artificer', level = 7, sub = 'Battle Smith') => {
      db.campaigns = db.campaigns.filter(c => c.id !== 'cO');
      const ch = newCharacter('Tinker', 'Human', cls, level); ch.edition = '2014';
      ch.abilities.int = 16; ch.abilities.wis = 16; ch.classes = [{ class: cls, subclass: sub, level }];
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
      ch.ownCompanions[0].hp = 40;
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
