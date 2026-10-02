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

  // Task 5: panel, picker, modal, player tabs
  await pg.evaluate(() => {
    try {
      const ch = setup('Artificer', 7, 'Battle Smith');
      ch.spells.known = [{ name: 'Find Familiar', level_int: 1 }];
      const groups = _ownCompanionChoices(ch);
      const names = g => (groups.find(x => x.group === g)?.items || []).map(i => i.name);
      check('class group offers the Steel Defender for a Battle Smith', names('From your class').includes('Steel Defender'), groups.map(g => g.group));
      check('class group hides other classes\' companions', !names('From your class').includes('Drake Companion'), names('From your class'));
      check('familiar forms come from a known Find Familiar', names('Familiars').includes('Owl'), names('Familiars'));
      check('no Pact of the Chain forms without the pact', !names('Familiars').includes('Imp'), names('Familiars'));
      check('mounts are always offered', names('Mounts & pets').includes('Riding Horse'), names('Mounts & pets'));
      openAddOwnCompanionModal(ch.id);
      check('picker modal opens', /Add companion/.test(document.getElementById('modal-content').innerHTML), null);
      confirmAddOwnCompanion(ch.id, 'Steel Defender|TCE');
      renderApp();
      const panel = document.querySelector('.own-companions-panel');
      check('GM character page shows the panel with the companion', panel && /Steel Defender/.test(panel.textContent), panel?.textContent);
      const oc = ch.ownCompanions[0];
      openOwnCompanionModal(ch.id, oc.id);
      check('clicking opens the sheet in a modal', /companion-sheet/.test(document.getElementById('modal-content').innerHTML), null);
      closeModal();
      askDismissOwnCompanion(ch.id, oc.id);
      check('dismiss asks first', ch.ownCompanions.length === 1 && /Dismiss Steel Defender\?/.test(document.querySelector('.own-companions-panel').textContent), null);
      dismissOwnCompanion(ch.id, oc.id); _confirmDismissOwn = null;
      // Variant picker for a template with forms
      ch.spells.known.push({ name: 'Summon Beast', level_int: 2 });
      confirmAddOwnCompanion(ch.id, 'Bestial Spirit|TCE');
      check('a template with forms asks for form and spell level', !!document.getElementById('own-variant') && !!document.getElementById('own-sl'), null);
      closeModal();
      // Player view tabs
      const oc2 = addOwnCompanion(ch.id, 'Owl|MM');
      IS_PLAYER_VIEW = true; renderApp();
      const tabs = [...document.querySelectorAll('.pv-tab')].map(t => t.textContent);
      check('player view has a tab per own companion', tabs.some(t => /Owl \(familiar\)/.test(t)), tabs);
      pvShowTab(oc2.id);
      check('own companion tab renders its sheet', !!document.querySelector('.companion-sheet'), null);
      IS_PLAYER_VIEW = false; _pvTab = 'character';
    } catch (err) { check('task 5 block ran', false, err.message + err.stack); }
  });

  // Task 6: sheet extras
  await pg.evaluate(() => {
    try {
      const ch = setup('Artificer', 7, 'Battle Smith');
      const oc = addOwnCompanion(ch.id, 'Steel Defender|TCE');
      const html = () => renderCompanionSheet(_companionById(oc.id));
      check('formula note under HP', /40 = 2 \+ INT 3 \+ 5 × Artificer 7/.test(html()), null);
      check('hit dice shown', /7 \/ 7d8/.test(html()), null);
      setOwnOverride(oc.id, 'maxHP', 55);
      check('GM edit changes max HP', _companionById(oc.id).maxHP === 55, _companionById(oc.id).maxHP);
      check('GM edited mark shows', /GM edited/.test(html()), null);
      ch.classes[0].level = 9; ch.level = 9; migrateCharacter(ch);
      check('override survives a level-up', _companionById(oc.id).maxHP === 55, _companionById(oc.id).maxHP);
      resetOwnOverride(oc.id, 'maxHP');
      check('reset to calculated', _companionById(oc.id).maxHP === 50, _companionById(oc.id).maxHP);
      setOwnOverride(oc.id, 'attackBonus', 11);
      check('attack bonus override reaches the stat block', /\+11 to hit/.test(JSON.stringify(_companionById(oc.id).statBlock.actions)), null);
      renameOwnCompanion(oc.id, 'Clank');
      check('rename', ch.ownCompanions[0].name === 'Clank' && _companionById(oc.id).name === 'Clank', ch.ownCompanions[0].name);
      companionDamage(oc.id, 999);
      check('revive rule text shows when Down', /Down/.test(html()) && /returns to life/i.test(html()), null);
      IS_PLAYER_VIEW = true;
      check('players do not get GM edit controls', !/data-own-edit/.test(html()), null);
      check('players can rename and dismiss', /own-rename/.test(html()) && /Dismiss/.test(html()), null);
      IS_PLAYER_VIEW = false;
      companionHeal(oc.id, 10);
      ownSpendHitDie(oc.id);
      check('spending a hit die is tracked', ch.ownCompanions[0].hitDiceUsed === 1, ch.ownCompanions[0].hitDiceUsed);
      companionRest(oc.id, 'long');
      check('long rest restores HP and hit dice', ch.ownCompanions[0].hp === _companionById(oc.id).maxHP && ch.ownCompanions[0].hitDiceUsed === 0, ch.ownCompanions[0]);
    } catch (err) { check('task 6 block ran', false, err.message + err.stack); }
  });

  const results = await pg.evaluate(() => out);
  results.forEach(r => console.log(r));
  if (errs.length) console.log('PAGE ERRORS:', errs);
  const failed = results.filter(r => r.startsWith('FAIL')).length + errs.length;
  console.log(failed ? `\n${failed} failed` : `\nAll ${results.length} passed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
