// Browser test for companions — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node companion.browser.test.js
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  await pg.evaluate(async () => {
    showToast = () => {}; _showApp();
    window.out = [];
    window.check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    window.monsters = await (await fetch('./data/monsters.json?v=3')).json();
    window.monsterBlock = name => _statBlockFromMonster(monsters.find(m => m.name === name)).statBlock;
    // Campaign cC with characters Aria and Bram and NPCs Sildar (Bandit Captain), Wyrm (Adult Red Dragon), Plain (no stat block)
    window.setup = () => {
      db.campaigns = db.campaigns.filter(c => c.id !== 'cC');
      Object.values(db.companions || {}).filter(c => c.campaignId === 'cC').forEach(c => delete db.companions[c.id]);
      const mkChar = name => { const ch = newCharacter(name, 'Human', 'Fighter', 3); migrateCharacter(ch); db.characters[ch.id] = ch; return ch; };
      const aria = mkChar('Aria'), bram = mkChar('Bram');
      const mkNpc = (name, monster) => {
        const npc = { id: uid(), campaignId: 'cC', name, race: 'Human', role: 'Knight', location: 'Phandalin', disposition: 'Friendly', ac: 12, hp: 20, maxHP: 20,
          personality: 'personality-marker', goals: 'goals-marker', relationships: 'relationships-marker', secrets: 'secret-marker', notes: 'notes-marker', createdAt: Date.now() };
        db.npcs[npc.id] = npc;
        if (monster) _applyMonsterToNpc(npc.id, monsters.find(m => m.name === monster));
        return npc;
      };
      db.campaigns.push({ id: 'cC', name: 'Companions', characters: [aria.id, bram.id], npcs: [], journal: [], campaignTab: 'npcs', initiative: { round: 1, currentIndex: 0, log: [], combatants: [] } });
      currentCampaignId = 'cC'; currentView = 'campaign'; IS_PLAYER_VIEW = false;
      const sildar = mkNpc('Sildar', 'Bandit Captain'), wyrm = mkNpc('Wyrm', 'Adult Red Dragon'), plain = mkNpc('Plain', null);
      db.campaigns.find(c => c.id === 'cC').npcs = [sildar.id, wyrm.id, plain.id];
      renderApp();
      return { aria, bram, sildar, wyrm, plain };
    };
  });

  // Task 2: storage and sync
  await pg.evaluate(() => {
    check('db.companions exists after load', typeof db.companions === 'object' && db.companions !== null, typeof db.companions);
    db.companions = db.companions || {};
    db.companions.x1 = { id: 'x1', campaignId: 'cC', name: 'Test' }; saveData(db);
    check('companions are saved to local storage', JSON.parse(localStorage.getItem(STORAGE_KEY)).companions?.x1?.name === 'Test', null);
    _takeSnapshot(db);
    check('the sync snapshot tracks companions', !!_dbSnap.companions && typeof _dbSnap.companions.x1 === 'string', Object.keys(_dbSnap));
    // Review focus: deleting a campaign removes its companions; import keeps them
    db.campaigns.push({ id: 'cC', name: 'Doomed', characters: [], npcs: [], journal: [] });
    if (typeof _deleteCampaignData === 'function') _deleteCampaignData('cC');
    check('deleting a campaign removes its companions', !db.companions.x1, Object.keys(db.companions));
    const imported = typeof _normalizeImportedDb === 'function' ? _normalizeImportedDb({ campaigns: [], characters: {}, npcs: {} }) : null;
    check('imported data always has a companions table', !!imported && typeof imported.companions === 'object', imported);
  });

  const out = await pg.evaluate(() => out);
  out.forEach(l => console.log(l));
  if (errs.length) console.log('PAGE ERRORS:', errs);
  const failed = out.filter(l => l.startsWith('FAIL')).length + (errs.length ? 1 : 0);
  console.log(`\n${out.length - out.filter(l => l.startsWith('FAIL')).length}/${out.length} passed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
