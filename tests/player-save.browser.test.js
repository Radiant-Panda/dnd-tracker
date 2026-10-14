// Browser test for player-view saving — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node player-save.browser.test.js
// Firestore's update() throws on undefined field values, so the player view must never send any.
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  await pg.evaluate(async () => {
    showToast = () => {}; openStartingProfsModal = () => {}; _showApp();
    window.out = [];
    window.check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    const hasUndefined = v => v === undefined || (v && typeof v === 'object' && Object.values(v).some(hasUndefined));
    // Stand-in for Firestore that behaves like the real one: update() throws on undefined
    window.writes = [];
    _fireDb = { doc: path => ({ update: data => {
      if (hasUndefined(data)) throw new Error('Function DocumentReference.update() called with invalid data. Unsupported field value: undefined');
      writes.push({ path, data }); return Promise.resolve();
    } }) };
    _firestoreReady = true; _pvGmUid = 'gm';
  });

  await pg.evaluate(async () => {
    try {
      const ch = newCharacter('Thorn', 'Human', 'Fighter', 5); ch.shareToken = 't'; migrateCharacter(ch);
      db.characters = { [ch.id]: ch };
      db.campaigns = [{ id: 'cP', name: 'P', characters: [ch.id], npcs: [], journal: [], campaignTab: 'characters', initiative: null }];
      currentCampaignId = 'cP'; currentCharId = ch.id; currentView = 'character'; IS_PLAYER_VIEW = true; _pvCharId = ch.id; _pvTab = 'character';
      renderApp();
      openWeaponPicker();
      const club = (window._wpnVisible || []).findIndex(w => w.name === 'Club');
      let threw = null;
      try { pickWeapon(club); } catch (e) { threw = e.message; }
      check('picking a weapon in the player view does not throw', !threw, threw);
      check('the weapon is added', (ch.attacks || []).some(a => a.name === 'Club'), ch.attacks);
      check('the sheet shows the new attack', [...document.querySelectorAll('.attack-input')].some(i => i.value === 'Club'), null);
      check('the character was written to Firestore', writes.some(w => (w.data.attacks || []).some(a => a.name === 'Club')), writes.length);
      // Later edits keep saving
      writes.length = 0;
      ch.notes = 'still saving'; saveData(db);
      check('later saves still go through', writes.some(w => w.data.notes === 'still saving'), writes.length);
      // Any undefined anywhere in the character is dropped, not sent
      ch.combat.weird = undefined; ch.attacks[0].extra = undefined;
      threw = null;
      try { saveData(db); } catch (e) { threw = e.message; }
      check('undefined fields anywhere never break a save', !threw && writes.length >= 2, threw);
    } catch (e) { check('player save flow ran', false, e.stack); }
  });

  const out = await pg.evaluate(() => out);
  out.forEach(l => console.log(l));
  if (errs.length) console.log('PAGE ERRORS:\n' + errs.join('\n'));
  const failed = out.filter(l => l.startsWith('FAIL')).length + errs.length;
  console.log(`\n${out.length - failed} passed, ${failed} failed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
