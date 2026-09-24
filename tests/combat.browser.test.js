// Browser test for the combat tracker — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node combat.browser.test.js
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  await pg.evaluate(async () => {
    showToast = () => {}; openStartingProfsModal = () => {}; _showApp();
    window.out = [];
    window.check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    window.monsters = await (await fetch('./data/monsters.json?v=3')).json();
    // Ogre 20, Aria (linked PC) 15, Goblin 10, Wolf 5
    window.setup = () => {
      db.campaigns = db.campaigns.filter(c => c.id !== 'cT');
      const pc = newCharacter('Aria', 'Human', 'Wizard', 3); pc.abilities.dex = 14; pc.combat.maxHP = 20; pc.combat.currentHP = 20; pc.combat.ac = 12; migrateCharacter(pc);
      db.characters[pc.id] = pc;
      const mon = (name, init, hp) => ({ id: uid(), name, initiative: init, ac: 13, hp, maxHP: hp, type: 'monster', conditions: [], notes: '', tempHP: 0 });
      const camp = { id: 'cT', name: 'Test', characters: [pc.id], npcs: [], journal: [], campaignTab: 'initiative',
        initiative: { round: 1, currentIndex: 0, log: [], combatants: [mon('Ogre', 20, 59),
          { id: uid(), charId: pc.id, name: 'Aria', initiative: 15, ac: 12, hp: 20, maxHP: 20, type: 'player', conditions: [], notes: '', tempHP: 0 },
          mon('Goblin', 10, 7), mon('Wolf', 5, 11)] } };
      db.campaigns.push(camp); currentCampaignId = 'cT'; currentView = 'campaign'; IS_PLAYER_VIEW = false;
      renderApp(); return { camp, pc };
    };
    window.names = () => getInitiative().combatants.map(c => c.name);
    window.activeName = () => document.querySelector('.initiative-row.active .init-name')?.textContent;
    window.row = name => [...document.querySelectorAll('.initiative-row')].find(r => r.querySelector('.init-name')?.textContent === name);
    window.logText = () => getInitiative().log.map(e => e.text);
  });

  // 1. Typing into a combatant's HP box applies once, when you finish
  await pg.evaluate(() => { const { pc } = setup(); pc.activeConcentration = { spellName: 'Haste', castLevel: 3 }; renderApp(); });
  const hp = await pg.evaluateHandle(() => row('Aria').querySelector('.hp-input'));
  await hp.click({ clickCount: 3 }); await pg.keyboard.type('15');
  await pg.evaluate(() => check('typing in the HP box changes nothing until you finish', logText().length === 0, logText()));
  await pg.keyboard.press('Enter');
  await pg.evaluate(() => {
    check('finishing applies one change and one concentration check', JSON.stringify(logText()) === JSON.stringify(['Aria took 5 damage (HP 20→15)', 'Aria: Concentration check DC 10 (Haste)']), logText());
    check('…and the character sheet gets it', db.characters[getInitiative().combatants[1].charId].combat.currentHP === 15, null);
  });

  await pg.evaluate(async () => {
    // 2. Linked characters: the tracker shows the sheet's numbers
    let { pc } = setup(); _takeDamage(pc, 8); pc.combat.ac = 15; pc.combat.tempHP = 3; renderApp();
    check('damage taken on the sheet shows in the tracker', row('Aria').querySelector('.hp-input').value === '12', row('Aria').querySelector('.hp-input').value);
    check('AC changed on the sheet shows in the tracker', row('Aria').querySelector('.init-stats strong').textContent === '15', row('Aria').querySelector('.init-stats strong').textContent);
    check('temp HP from the sheet shows in the tracker', /\+3 temp/.test(row('Aria').textContent), row('Aria').textContent.slice(0, 120));

    // 3. Sort keeps whose turn it is
    setup(); nextTurn(); nextTurn();
    getInitiative().combatants.push({ id: 'late', name: 'Late Orc', initiative: 18, ac: 13, hp: 15, maxHP: 15, type: 'monster', conditions: [], notes: '', tempHP: 0 });
    sortInitiative();
    check('sorting mid-round keeps the current turn', activeName() === 'Goblin', activeName());

    // 4. Removing combatants keeps the turn with the right creature
    setup(); nextTurn(); nextTurn(); removeCombatant(0);
    check('removing someone above the current turn keeps the turn', activeName() === 'Goblin', activeName());
    setup(); nextTurn(); nextTurn(); removeCombatant(2);
    check('removing the current combatant passes the turn to the next', activeName() === 'Wolf', activeName());

    // 5. New combatants go into initiative order
    setup(); nextTurn(); nextTurn();
    openAddCombatantModal(); document.getElementById('cb-name').value = 'Orc'; document.getElementById('cb-init').value = '12'; addCombatant();
    check('a new combatant is placed by initiative', JSON.stringify(names()) === '["Ogre","Aria","Orc","Goblin","Wolf"]', names());
    check('…without changing whose turn it is', activeName() === 'Goblin', activeName());
    let s = setup(); s.camp.initiative.combatants = s.camp.initiative.combatants.filter(c => !c.charId);
    const rnd = Math.random; Math.random = () => 0.99; addAllPcsToInitiative(); Math.random = rnd;
    check('Add all PCs places them by initiative (20 + 2 = 22 goes first)', names()[0] === 'Aria', names());
    check('Add all PCs is logged', logText().some(t => /Aria added to combat/.test(t)), logText());

    // 6. Tracker damage/healing follows the death-save rules for characters
    ({ pc } = setup()); damageCombatant(1, 20); damageCombatant(1, 5);
    check('tracker damage at 0 HP is a failed death save', pc.deathSaves.failures === 1, pc.deathSaves);
    pc.deathSaves = { successes: 1, failures: 2 }; healCombatant(1, 5);
    check('tracker healing from 0 HP clears death saves', pc.deathSaves.failures === 0 && pc.deathSaves.successes === 0 && pc.combat.currentHP === 5, pc.deathSaves);
    ({ pc } = setup()); damageCombatant(1, 45);
    check('massive damage from the tracker kills outright', pc.deathSaves.failures === 3, pc.deathSaves);
    ({ pc } = setup()); pc.combat.tempHP = 4; damageCombatant(1, 6);
    check('temp HP soaks tracker damage first', pc.combat.tempHP === 0 && pc.combat.currentHP === 18, pc.combat);

    // 7. AoE damage updates the tracker and the log
    setup(); openAoeDamageModal(); document.getElementById('aoe-dmg').value = '5'; applyAoeDamage(); closeModal();
    check('AoE damage shows in the tracker', row('Ogre').querySelector('.hp-input').value === '54', row('Ogre').querySelector('.hp-input').value);
    check('AoE damage is logged per target', logText().filter(t => /took 5 damage/.test(t)).length === 4, logText());

    // 8. Player view hides the GM's information
    s = setup(); s.camp.initiative.combatants[0].notes = 'GM: flees at half HP'; s.camp.initiative.combatants[0].statBlock = { actions: [], traits: [] };
    s.camp.initiative.combatants[2].hp = 3; IS_PLAYER_VIEW = true; renderApp();
    const ogre = row('Ogre').textContent.replace(/\s+/g, ' ');
    check('players see a health word, not monster HP', /Healthy/.test(ogre) && !/59/.test(ogre), ogre.slice(0, 120));
    check('bloodied monsters read Bloodied', /Bloodied/.test(row('Goblin').textContent), row('Goblin').textContent.replace(/\s+/g, ' ').slice(0, 120));
    check('players do not see GM notes', !/flees at half/.test(ogre), ogre.slice(0, 160));
    check('players do not get stat blocks', !row('Ogre').querySelector('.stat-block-toggle'), null);
    check('players do not get a + Condition button', ![...document.querySelectorAll('.initiative-row button')].some(b => /Condition/.test(b.textContent)), null);
    check('players still see player characters\' HP', /20\s*\/\s*20/.test(row('Aria').textContent), row('Aria').textContent.replace(/\s+/g, ' ').slice(0, 120));
    IS_PLAYER_VIEW = false; db.characters[s.camp.characters[0]].activeConcentration = { spellName: 'Haste', castLevel: 3 }; IS_PLAYER_VIEW = true; renderApp();
    check('players cannot end another character\'s concentration', !row('Aria').querySelector('.conc-clear-combat'), null);
    IS_PLAYER_VIEW = false;

    // 9. Defeated monsters are marked and skipped
    setup(); damageCombatant(2, 7);
    check('a monster at 0 HP is marked defeated', row('Goblin').classList.contains('defeated') && /Defeated/.test(row('Goblin').textContent), row('Goblin').className);
    nextTurn(); nextTurn();
    check('defeated monsters are skipped in the turn order', activeName() === 'Wolf', activeName());
    ({ pc } = setup()); damageCombatant(1, 20); nextTurn();
    check('characters at 0 HP still get their turn (death saves)', activeName() === 'Aria', activeName());
    setup(); getInitiative().combatants.forEach(c => { if (!c.charId) c.hp = 0; }); nextTurn(); nextTurn();
    check('with everyone else defeated, turns still move without hanging', activeName() === 'Aria', activeName());

    // 10. Duplicate monsters are numbered
    setup(); getInitiative().combatants = [];
    const gob = monsters.find(m => m.name === 'Goblin'); addMonsterToCombat(gob); addMonsterToCombat(gob); addMonsterToCombat(gob);
    check('duplicate monsters are numbered', JSON.stringify(names().sort()) === '["Goblin","Goblin 2","Goblin 3"]', names());
    check('adding a monster is logged', logText().filter(t => /Goblin.* added to combat/.test(t)).length === 3, logText());

    // 13. Stat block details
    const sb = getInitiative().combatants[0].statBlock;
    check('stat block keeps darkvision', /darkvision 60/i.test(renderCombatantStatBlock(sb, 0)), renderCombatantStatBlock(sb, 0).match(/Senses<\/strong>[^<]*/)?.[0]);
    const shrub = monsters.find(m => m.name === 'Awakened Shrub'); addMonsterToCombat(shrub);
    const si = getInitiative().combatants.findIndex(c => c.name === 'Awakened Shrub');
    check('stat block shows vulnerabilities', /Vulnerab[^<]*<\/strong>\s*fire/i.test(renderCombatantStatBlock(getInitiative().combatants[si].statBlock, si)), null);
    const drag = monsters.find(m => m.bonus_actions?.length && m.actions?.length); addMonsterToCombat(drag);
    const di = getInitiative().combatants.findIndex(c => c.name === drag.name);
    check('bonus actions get quick buttons', renderCombatantStatBlock(getInitiative().combatants[di].statBlock, di).split('<hr')[0].includes(esc(drag.bonus_actions[0].name)), drag.bonus_actions[0].name);
    renderApp();
    const gi = getInitiative().combatants.findIndex(c => c.name === 'Goblin');
    toggleStatBlock(gi); showActionPopover(gi, 0, 'action');
    const atkBtn = document.querySelector('.action-popover .attack-roll-btn');
    check('attacks have a to-hit roll button', !!atkBtn, document.querySelector('.action-popover')?.innerHTML.slice(0, 200));
    const rnd2 = Math.random; Math.random = () => 0.5; atkBtn?.click(); Math.random = rnd2;
    check('…which rolls d20 + the bonus (11 + 4)', /15/.test(document.querySelector('.action-popover .attack-result')?.textContent || ''), document.querySelector('.action-popover .attack-result')?.textContent);

    // 11. Conditions set in the tracker show on the character sheet
    ({ pc } = setup()); openConditionPicker(1); toggleCondition(1, 'Poisoned'); closeModal();
    currentCharId = pc.id; currentView = 'character'; renderApp();
    const combatPanel = [...document.querySelectorAll('.sheet-panel')].find(p => p.querySelector('.cs-section-label')?.textContent.trim() === 'Combat');
    check('tracker conditions show on the character sheet', /Poisoned/.test(combatPanel?.textContent || ''), null);
    currentView = 'campaign';

    // 12. Exhaustion is shared with the character sheet
    ({ pc } = setup()); openConditionPicker(1);
    check('the condition picker has an exhaustion level for characters', !!document.querySelector('.cond-exhaustion-level'), null);
    if (typeof setCombatantExhaustion === 'function') setCombatantExhaustion(1, 2); closeModal(); renderApp();
    check('setting exhaustion in the tracker updates the sheet', pc.exhaustionLevel === 2, pc.exhaustionLevel);
    check('the tracker shows the exhaustion level', /Exhaustion 2/.test(row('Aria').textContent), row('Aria').textContent.replace(/\s+/g, ' ').slice(0, 160));
    pc.exhaustionLevel = 3; renderApp();
    check('exhaustion set on the sheet shows in the tracker', /Exhaustion 3/.test(row('Aria').textContent), null);
  });

  const out = await pg.evaluate(() => out);
  out.forEach(l => console.log(l));
  if (errs.length) console.log('PAGE ERRORS:', errs);
  const failed = out.filter(l => l.startsWith('FAIL')).length + (errs.length ? 1 : 0);
  console.log(`\n${out.length - out.filter(l => l.startsWith('FAIL')).length}/${out.length} passed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
