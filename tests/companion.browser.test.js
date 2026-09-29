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

  // Task 3: GM lifecycle
  await pg.evaluate(() => {
    try {
      let { aria, bram, sildar } = setup();
      let id = makeCompanion(sildar.id, aria.id);
      let comp = db.companions[id];
      check('making a companion creates a record', !!comp && comp.ownerCharId === aria.id && comp.playerAccess === 'play', comp);
      check('the owner lists it', (aria.companionIds || []).includes(id), aria.companionIds);
      check('the NPC links to it', sildar.companionId === id, sildar.companionId);
      check('private fields are not copied', !('secrets' in comp) && !('personality' in comp) && !JSON.stringify(comp).includes('marker'), Object.keys(comp));
      showNpc(sildar.id);
      check('the NPC page shows "Companion of Aria"', /Companion of Aria/.test(document.querySelector('.npc-companion-panel')?.textContent || ''), null);
      check('the NPC page offers the three access settings', document.querySelectorAll('.npc-companion-panel select[data-role="access"] option').length === 3, null);
      currentNpcId = sildar.id; npc_field('hp', 30);
      check('NPC page HP edits go to the companion', comp.hp === 30, comp.hp);
      npc_field('role', 'Veteran');
      check('NPC edits update the card', comp.role === 'Veteran', comp.role);
      comp.hp = 22; comp.conditions = ['Poisoned']; comp.uses = { 'actions:x': 1 }; comp.portrait = 'data:image/jpeg;base64,AA';
      const newId = changeCompanionOwner(sildar.id, bram.id);
      check('reassigning makes a new id', newId !== id && !db.companions[id] && !!db.companions[newId], { newId, id });
      check('…moves it between characters', !aria.companionIds.includes(id) && bram.companionIds.includes(newId), { a: aria.companionIds, b: bram.companionIds });
      const moved = db.companions[newId] || {};
      check('…and keeps play state, art and access', moved.hp === 22 && moved.conditions?.[0] === 'Poisoned' && moved.uses?.['actions:x'] === 1 && moved.portrait === 'data:image/jpeg;base64,AA' && moved.playerAccess === 'play', moved);
      check('…with a new share token', moved.shareToken && moved.shareToken !== comp.shareToken, null);
      setCompanionAccess(sildar.id, 'full');
      check('access setting is stored', db.companions[newId].playerAccess === 'full', null);
      // Review focus: full-edit changes flow back without clobbering other fields
      db.companions[newId].ac = 17; _syncNpcFromCompanion(db.companions[newId], ['ac']);
      check('full-edit changes copy back to the NPC', sildar.ac === 17 && sildar.role === 'Veteran', { ac: sildar.ac, role: sildar.role });
      endCompanionship(sildar.id);
      check('ending returns HP and art to the NPC', sildar.hp === 22 && sildar.portrait === 'data:image/jpeg;base64,AA' && !sildar.companionId, { hp: sildar.hp, link: sildar.companionId });
      check('…removes the record and the link', !db.companions[newId] && !bram.companionIds.includes(newId), null);
      id = makeCompanion(sildar.id, aria.id); deleteNpcNow(sildar.id);
      check('deleting the NPC ends the companionship', !db.companions[id] && !aria.companionIds.includes(id), null);
      ({ aria, sildar } = setup());
      id = makeCompanion(sildar.id, aria.id); db.companions[id].hp = 7; deleteCharacterNow(aria.id);
      check('deleting the owner ends it and returns HP to the NPC', !db.companions[id] && sildar.hp === 7 && !sildar.companionId, { hp: sildar.hp });
      ({ aria, sildar } = setup()); makeCompanion(sildar.id, aria.id); showCampaign('cC', 'npcs');
      check('the NPC card shows "Companion · Aria"', /Companion · Aria/.test(document.getElementById('npc-grid')?.textContent || ''), null);
      showCampaign('cC', 'characters');
      check('the character card lists its companions', /Companions: Sildar/.test(document.getElementById('app').textContent), null);
      showNpc(sildar.id);
      check('the NPC page notes when the owner is not shared yet', /Share/.test(document.querySelector('.npc-companion-panel')?.textContent || ''), null);
      setCompanionPortrait(sildar.companionId, 'data:image/jpeg;base64,BB', 120, 40, 60);
      check('art can be set on the companion', db.companions[sildar.companionId].portrait === 'data:image/jpeg;base64,BB' && db.companions[sildar.companionId].portraitZoom === 120, null);
      removeCompanionPortrait(sildar.companionId);
      check('…and removed', db.companions[sildar.companionId].portrait === null, null);
    } catch (e) { check('lifecycle runs', false, e.message); }
  });

  // Task 4: companion sheet
  await pg.evaluate(() => {
    try {
      const { aria, sildar, wyrm, plain } = setup();
      const comp = db.companions[makeCompanion(sildar.id, aria.id)];
      const app = document.getElementById('app');
      app.innerHTML = renderCompanionSheet(comp);
      const text = app.textContent;
      check('the sheet shows name, role line and owner', /Sildar/.test(text) && /Knight/.test(text) && /Companion of Aria/.test(text), text.slice(0, 160));
      check('the sheet never shows private fields', !/marker/.test(text), null);
      check('the sheet shows the stat block actions', /Actions/.test(text) && /Scimitar/.test(text), null);
      check('ability names are cleaned in stat blocks', !/\{@recharge/.test(renderCombatantStatBlock(monsterBlock('Adult Red Dragon'), 0)) && /Recharge 5–6/.test(renderCombatantStatBlock(monsterBlock('Adult Red Dragon'), 0)), null);
      companionDamage(comp.id, 5);
      check('damage lowers HP', comp.hp === 47, comp.hp);
      comp.tempHP = 4; companionDamage(comp.id, 6);
      check('damage uses temp HP first', comp.tempHP === 0 && comp.hp === 45, { hp: comp.hp, temp: comp.tempHP });
      comp.hp = 0; app.innerHTML = renderCompanionSheet(comp);
      check('0 HP shows Down', /Down/.test(app.textContent), null);
      companionHeal(comp.id, 999);
      check('healing is capped at max HP', comp.hp === comp.maxHP, comp.hp);
      companionToggleCondition(comp.id, 'Prone');
      check('conditions can be added', comp.conditions.includes('Prone'), comp.conditions);
      companionToggleCondition(comp.id, 'Prone');
      check('…and removed', !comp.conditions.includes('Prone'), comp.conditions);
      const dragon = db.companions[makeCompanion(wyrm.id, aria.id)];
      const fire = parseUses(dragon.statBlock).find(u => /Fire Breath/.test(u.label));
      app.innerHTML = renderCompanionSheet(dragon);
      check('limited-use abilities show as pips', app.querySelectorAll('.use-pip').length >= 4 && /Fire Breath/.test(app.querySelector('.use-pips')?.textContent || ''), null);
      companionToggleUse(dragon.id, fire.key, 0);
      check('ticking a pip marks it used', dragon.uses[fire.key] === 1, dragon.uses);
      const rnd = Math.random; Math.random = () => 0.9; const ok = companionRollRecharge(dragon.id, fire.key); Math.random = rnd;
      check('a recharge roll of 6 restores it', ok === true && dragon.uses[fire.key] === 0, dragon.uses);
      companionToggleUse(dragon.id, fire.key, 0); dragon.hp = 10;
      companionRest(dragon.id, 'short');
      check('a short rest keeps recharge uses spent', dragon.uses[fire.key] === 1 && dragon.hp === 10, dragon.uses);
      companionRest(dragon.id, 'long');
      check('a long rest restores uses and HP', dragon.uses[fire.key] === 0 && dragon.hp === dragon.maxHP, { uses: dragon.uses, hp: dragon.hp });
      // Review focus: no stat block, and old object-shaped senses
      const p = db.companions[makeCompanion(plain.id, aria.id)];
      check('a companion without a stat block renders AC and HP', /AC/.test(renderCompanionSheet(p)) && /HP/.test(renderCompanionSheet(p)), null);
      const oldSenses = { ...monsterBlock('Goblin'), senses: { passive_perception: 9 } };
      check('old object-shaped senses still render', /passive perception 9/.test(renderCombatantStatBlock(oldSenses, null, { quickBar: false })), null);
      app.innerHTML = renderCompanionSheet(comp);
      const atkBtn = [...app.querySelectorAll('.action-quick-btn')].find(b => b.querySelector('.action-badge'));
      atkBtn?.click();
      check('attack buttons open the roll pop-up', !!document.querySelector('.action-popover .attack-roll-btn'), document.querySelector('.action-popover')?.innerHTML?.slice(0, 120));
    } catch (e) { check('companion sheet runs', false, e.message + ' ' + (e.stack || '').split('\n')[1]); }
  });

  // Task 5: player view
  await pg.evaluate(() => {
    const realSave = _pvSaveCompanion;
    try {
      const { aria, sildar } = setup();
      const id = makeCompanion(sildar.id, aria.id); const comp = db.companions[id];
      const writes = []; _pvSaveCompanion = (cid, patch) => writes.push({ cid, patch });
      IS_PLAYER_VIEW = true; currentCharId = aria.id; currentView = 'character'; renderApp();
      const tabs = () => document.querySelector('.pv-tabs')?.textContent || '';
      check('tabs show the character and its companion', /Aria/.test(tabs()) && /Sildar \(companion\)/.test(tabs()), tabs());
      pvShowTab(id);
      check('the companion tab shows the companion sheet', !!document.querySelector('.companion-sheet') && !document.querySelector('.cs-header'), null);
      companionDamage(id, 3);
      check('a player write sends only play fields', writes.length === 1 && Object.keys(writes[0].patch).every(k => COMPANION_PLAY_FIELDS.includes(k)), writes);
      check('…to this companion', writes[0]?.cid === id, writes[0]);
      comp.playerAccess = 'view'; renderApp();
      check('View only hides the controls', !document.querySelector('.companion-sheet .hp-dmg-btn') && /GM is tracking/.test(document.querySelector('.companion-sheet')?.textContent || ''), null);
      const hpBefore = comp.hp; companionDamage(id, 3);
      check('View only sends no writes and changes nothing', writes.length === 1 && comp.hp === hpBefore, { writes: writes.length, hp: comp.hp });
      companionSetField(id, 'ac', 20);
      check('Run in play / View only cannot change stats', comp.ac !== 20 && writes.length === 1, comp.ac);
      comp.playerAccess = 'full'; renderApp();
      check('Full edit shows the stat fields', !!document.querySelector('.companion-sheet [data-cfield="ac"]'), null);
      companionSetField(id, 'ac', 20);
      check('Full edit writes stats', comp.ac === 20 && writes.at(-1)?.patch?.ac === 20, writes.at(-1));
      check('the player view never shows the NPC page or its secrets', !/marker/.test(document.getElementById('app').textContent), null);
      // Review focus: a player's character save must not write back a stale companion list
      const saved = []; const realFire = _fireDb, realReady = _firestoreReady, realGm = _pvGmUid;
      _fireDb = { doc: () => ({ update: data => { saved.push(data); return Promise.resolve(); } }) }; _firestoreReady = true; _pvGmUid = 'gm';
      _pvSaveCharacter();
      _fireDb = realFire; _firestoreReady = realReady; _pvGmUid = realGm;
      check('player character saves leave the companion list to the GM', saved.length === 1 && !('companionIds' in saved[0]), saved[0] && Object.keys(saved[0]).includes('companionIds'));
      // Review focus: companion removed (reassigned or ended) while its tab is open
      aria.companionIds = []; delete db.companions[id]; renderApp();
      check('a removed companion drops its tab without errors', !/Sildar/.test(tabs()) && !!document.querySelector('.cs-header'), tabs());
    } catch (e) { check('player view runs', false, e.message + ' ' + (e.stack || '').split('\n')[1]); }
    finally { IS_PLAYER_VIEW = false; _pvSaveCompanion = realSave; }
  });

  // Task 6: combat
  await pg.evaluate(() => {
    try {
      const { aria, sildar } = setup();
      const id = makeCompanion(sildar.id, aria.id); const comp = db.companions[id];
      openAddCombatantModal();
      check('quick add lists companions', /Sildar · Aria/.test(document.getElementById('modal-overlay').textContent), null);
      closeModal();
      addAllPcsToInitiative();
      check('Add all PCs does not add companions', !getInitiative().combatants.some(c => c.companionId), getInitiative().combatants.map(c => c.name));
      const rnd = Math.random; Math.random = () => 0.5;
      quickAddCombatant(id, 'companion'); const qa = document.getElementById('qa-init').value; _confirmQuickAdd();
      Math.random = rnd;
      check('companion initiative uses its bonus (10 + 3)', qa === String(10 + comp.initBonus) && comp.initBonus === 3, { qa, bonus: comp.initBonus });
      const ci = () => getInitiative().combatants.findIndex(c => c.companionId === id);
      check('the combatant is linked to the companion card', ci() >= 0 && getInitiative().combatants[ci()].type === 'companion', getInitiative().combatants.map(c => c.name + ':' + c.companionId));
      damageCombatant(ci(), 10);
      check('tracker damage writes to the companion', comp.hp === comp.maxHP - 10, comp.hp);
      healCombatant(ci(), 4);
      check('tracker healing writes to the companion', comp.hp === comp.maxHP - 6, comp.hp);
      comp.hp = 5; comp.conditions = ['Prone']; showCampaign('cC', 'initiative');
      const row = () => [...document.querySelectorAll('.initiative-row')][ci()];
      check('the row shows the companion\'s HP and conditions', row().querySelector('.hp-input').value === '5' && /Prone/.test(row().textContent), row().textContent.replace(/\s+/g, ' ').slice(0, 140));
      check('the row is labelled with the owner', /Companion · Aria/.test(row().textContent), null);
      openConditionPicker(ci()); toggleCondition(ci(), 'Poisoned'); closeModal();
      check('conditions set in the tracker reach the companion', comp.conditions.includes('Poisoned'), comp.conditions);
      IS_PLAYER_VIEW = true; renderApp();
      check('players see the companion\'s exact HP', /5\s*\/\s*52/.test(row().textContent), row().textContent.replace(/\s+/g, ' ').slice(0, 140));
      IS_PLAYER_VIEW = false; renderApp();
      damageCombatant(ci(), 50);
      check('a companion at 0 shows Down', /Down/.test(row().textContent) && comp.hp === 0, comp.hp);
      check('…and is not skipped', !_isDefeated(getInitiative().combatants[ci()]), null);
      const newId = changeCompanionOwner(sildar.id, db.campaigns.find(c => c.id === 'cC').characters[1]);
      check('reassigning relinks the combat row', getInitiative().combatants.some(c => c.companionId === newId), getInitiative().combatants.map(c => c.companionId));
    } catch (e) { check('combat runs', false, e.message + ' ' + (e.stack || '').split('\n')[1]); }
  });

  // Final review fixes: data a player can write is treated as untrusted
  await pg.evaluate(() => {
    try {
      const { aria, sildar } = setup();
      const id = makeCompanion(sildar.id, aria.id);
      window.__pwn = 0;
      const evil = '<img src=x onerror="window.__pwn=1">';
      // What a hostile player could write straight to Firestore, as the GM's app receives it
      _onCompanionSnapshot({ ...db.companions[id], ac: evil, maxHP: 52, initBonus: evil, name: evil,
        conditions: ["Prone'); window.__pwn=1; ('", { name: evil, duration: 2 }, 'Poisoned'],
        statBlock: { ...db.companions[id].statBlock, damage_resistances: [evil], condition_immunities: [evil], challenge_rating: evil, strength: evil, senses: { [evil]: evil } },
        portrait: 'https://tracker.example/pixel.png' });
      const comp = db.companions[id];
      check('numbers from a player are forced to numbers', typeof comp.ac === 'number' && typeof comp.initBonus === 'number', { ac: comp.ac, init: comp.initBonus });
      check('only real condition names are kept', JSON.stringify(comp.conditions.map(c => typeof c === 'string' ? c : c.name)) === '["Poisoned"]', comp.conditions);
      check('art must be an embedded image', comp.portrait === null, comp.portrait);
      quickAddCombatant(id, 'companion'); _confirmQuickAdd(); showCampaign('cC', 'initiative');
      document.querySelectorAll('.initiative-row .condition-tag').forEach(t => { try { t.click(); } catch (e) {} }); closeModal();
      const ci = getInitiative().combatants.findIndex(c => c.companionId === id); toggleStatBlock(ci);
      showNpc(sildar.id);
      document.getElementById('app').insertAdjacentHTML('beforeend', renderCompanionSheet(comp) + renderCombatantStatBlock(comp.statBlock, null, { quickBar: false }));
      check('no injected elements anywhere', !document.querySelector('#app img[src="x"]'), document.querySelector('#app img[src="x"]')?.outerHTML);
      check('no injected script ran', window.__pwn === 0, window.__pwn);
      // Full edit changes made by the player reach the NPC page when the GM's app receives them
      setCompanionAccess(sildar.id, 'full');
      _onCompanionSnapshot({ ...db.companions[id], ac: 19, role: 'Veteran', name: 'Sir Sildar' });
      check('player Full edit changes are copied onto the NPC', sildar.ac === 19 && sildar.role === 'Veteran' && sildar.name === 'Sir Sildar', { ac: sildar.ac, role: sildar.role, name: sildar.name });
      setCompanionAccess(sildar.id, 'play');
      _onCompanionSnapshot({ ...db.companions[id], ac: 11 });
      check('stat changes are not copied onto the NPC outside Full edit', sildar.ac === 19, sildar.ac);
    } catch (e) { check('untrusted data checks run', false, e.message + ' ' + (e.stack || '').split('\n')[1]); }
  });

  const out = await pg.evaluate(() => out);
  out.forEach(l => console.log(l));
  if (errs.length) console.log('PAGE ERRORS:', errs);
  const failed = out.filter(l => l.startsWith('FAIL')).length + (errs.length ? 1 : 0);
  console.log(`\n${out.length - out.filter(l => l.startsWith('FAIL')).length}/${out.length} passed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
