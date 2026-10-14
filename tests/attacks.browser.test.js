// Browser test for attack rows that follow level and ability scores — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node attacks.browser.test.js
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  await pg.evaluate(async () => {
    window.toasts = [];
    showToast = html => toasts.push(String(html)); openStartingProfsModal = () => {}; saveData = () => {}; _showApp();
    window.out = [];
    window.check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    await fetchAllSpells();
    window.open = (ch) => {
      migrateCharacter(ch);
      db.characters = { [ch.id]: ch };
      db.campaigns = [{ id: 'cA', name: 'A', characters: [ch.id], npcs: [], journal: [], campaignTab: 'characters', initiative: null }];
      currentCampaignId = 'cA'; currentCharId = ch.id; currentView = 'character';
      renderApp();
    };
    window.setLevel = (ch, lv) => { ch.classes[0].level = lv; ch.level = lv; renderApp(); };
    // The attack table's cells for row i: [name, type, bonus, damage]
    window.row = i => {
      const tr = document.querySelectorAll('.attacks-table tbody tr')[i];
      if (!tr) return null;
      const ins = tr.querySelectorAll('.attack-input');
      return { name: ins[0].value, bonus: ins[1].value, damage: ins[2].value, tag: tr.querySelector('.atk-auto, .atk-auto-link')?.textContent || '',
        rollBtn: !!tr.querySelector('[title="Roll attack"]'), save: tr.querySelector('.atk-save')?.textContent || '', tr };
    };
    window.clickText = (sel, text) => { const el = [...document.querySelectorAll(sel)].find(e => e.textContent.includes(text)); el && el.click(); return !!el; };
  });

  // Weapons follow level and ability scores
  await pg.evaluate(async () => {
    try {
      const ch = newCharacter('Brann', 'Human', 'Fighter', 1); ch.abilities.str = 16; ch.abilities.dex = 14; ch.attacks = [];
      open(ch);
      openWeaponPicker();
      pickWeapon(_wpnVisible.findIndex(w => w.name === 'Longsword'));
      clickText('#modal-content button', 'One-handed');
      let r = row(0);
      check('a picked weapon gets its bonus from PB + STR', r && r.bonus === '+5', r);
      check('a picked weapon adds STR to its damage', r && r.damage === '1d8+3 slashing', r);
      check('a picked weapon is tagged auto', r && r.tag === 'auto', r);
      setLevel(ch, 5);
      check('levelling up raises the attack bonus', row(0).bonus === '+6', row(0));
      ch.abilities.str = 18; renderApp();
      check('a higher STR raises bonus and damage', row(0).bonus === '+7' && row(0).damage === '1d8+4 slashing', row(0));
      toasts.length = 0; rollDamage(0);
      check('the damage roll includes the modifier', /\+ 4 = <strong>/.test(toasts[0] || ''), toasts);

      // Typing your own bonus makes the row manual and keeps what you typed
      const bonusIn = row(0).tr.querySelectorAll('.attack-input')[1];
      bonusIn.value = '+8'; bonusIn.dispatchEvent(new Event('input'));
      check('typing over the bonus switches the tag to ↺ auto', row(0).tag === '↺ auto', row(0));
      check('the row is saved as manual', ch.attacks[0].auto === false, ch.attacks[0]);
      setLevel(ch, 9);
      check('a manual row keeps what was typed after levelling', row(0).bonus === '+8' && row(0).damage === '1d8+4 slashing', row(0));
      row(0).tr.querySelector('.atk-auto-link').click();
      check('↺ auto works it out again', row(0).bonus === '+8' && row(0).tag === 'auto' && ch.attacks[0].auto === true, row(0));
      setLevel(ch, 13);
      check('…and it follows the next level up', row(0).bonus === '+9', row(0));

      // Thrown weapons keep their melee ability
      openWeaponPicker();
      pickWeapon(_wpnVisible.findIndex(w => w.name === 'Handaxe'));
      clickText('#modal-content button', 'Thrown');
      const t = row(1);
      check('a thrown handaxe uses STR', t && t.name === 'Handaxe (thrown)' && t.bonus === '+9' && t.damage === '1d6+4 slashing', t);

      // Unarmed strike for a non-monk: 1 + STR
      openWeaponPicker();
      pickWeapon(_wpnVisible.findIndex(w => w.name === 'Unarmed Strike'));
      check('a non-monk unarmed strike is 1 + STR', row(2).damage === '5 bludgeoning', row(2));
      toasts.length = 0; rollDamage(2);
      check('flat damage rolls without dice', /<strong>5<\/strong>/.test(toasts[0] || ''), toasts);

      // A new blank row is manual; choosing a weapon type on bare dice makes it auto
      addAttack();
      const ins = row(3).tr.querySelectorAll('.attack-input');
      ins[2].value = '1d10 piercing'; ins[2].dispatchEvent(new Event('input'));
      check('a typed row is manual with no tag', row(3).tag === '' && ch.attacks[3].auto === false, row(3));
      autoCalcAttackBonus(3, 'ranged-dex');
      check('choosing a weapon type on bare dice makes it auto', row(3).bonus === '+7' && row(3).damage === '1d10+2 piercing' && row(3).tag === 'auto', row(3));
      autoCalcAttackBonus(3, '');
      check('clearing the type makes it manual again', ch.attacks[3].auto === false, ch.attacks[3]);
    } catch (e) { check('weapon flow ran', false, e.stack); }
  });

  // Monks
  await pg.evaluate(async () => {
    try {
      const ch = newCharacter('Lin', 'Human', 'Monk', 5); ch.abilities.str = 10; ch.abilities.dex = 16; ch.attacks = [];
      open(ch);
      openWeaponPicker();
      pickWeapon(_wpnVisible.findIndex(w => w.name === 'Unarmed Strike'));
      check('a level 5 monk unarmed strike is 1d8 + DEX', row(0).damage === '1d8+3 bludgeoning' && row(0).bonus === '+6', row(0));
      openWeaponPicker();
      pickWeapon(_wpnVisible.findIndex(w => w.name === 'Quarterstaff'));
      clickText('#modal-content button', 'One-handed');
      check('a monk quarterstaff uses DEX and the martial arts die', row(1).damage === '1d8+3 bludgeoning' && row(1).bonus === '+6', row(1));
      setLevel(ch, 11);
      check('the martial arts die grows at monk level 11', row(0).damage === '1d10+3 bludgeoning', row(0));
    } catch (e) { check('monk flow ran', false, e.stack); }
  });

  // Rows saved before this change
  await pg.evaluate(async () => {
    try {
      const ch = newCharacter('Old', 'Human', 'Wizard', 5); ch.abilities.str = 14; ch.abilities.int = 16;
      ch.attacks = [
        { id: 'a', name: 'Dagger', weaponType: 'melee-finesse', bonus: '+4', damage: '1d4 piercing', mastery: 'Nick', _unarmed: false },
        { id: 'b', name: 'Flame Tongue', weaponType: 'melee-str', bonus: '+5', damage: '1d8+2 slashing + 2d6 fire' },
        { id: 'c', name: 'Fire Bolt', weaponType: 'spell', bonus: '+5', damage: '1d10 fire' },
        { id: 'd', name: 'Magic Missile', weaponType: 'spell', bonus: '', damage: '3d4+3 force' },
      ];
      open(ch);
      check('an old picker row switches to auto', ch.attacks[0].auto === true && row(0).damage === '1d4+2 piercing' && row(0).bonus === '+5', row(0));
      check('a typed row with its own modifiers stays as typed', ch.attacks[1].auto === undefined && row(1).damage === '1d8+2 slashing + 2d6 fire' && row(1).tag === '', row(1));
      check('a Spell Attack row named after a cantrip is linked and scales', ch.attacks[2].cantrip === 'Fire Bolt' && row(2).damage === '2d10 fire' && row(2).bonus === '+6', row(2));
      check('other spell rows stay as typed', !ch.attacks[3].auto && row(3).damage === '3d4+3 force', row(3));
    } catch (e) { check('old rows flow ran', false, e.stack); }
  });

  // Cantrips
  await pg.evaluate(async () => {
    try {
      const ch = newCharacter('Ilsa', 'Human', 'Cleric', 4); ch.abilities.wis = 16; ch.attacks = [];
      ch.spells.known = [_spellByName('Sacred Flame', ch), _spellByName('Toll the Dead', ch), _spellByName('Guidance', ch)].filter(Boolean).map(s => ({ ...s }));
      open(ch);
      openCantripPicker();
      const names = [...document.querySelectorAll('.cantrip-pick-name')].map(e => e.textContent);
      check('the picker lists the damage cantrips the character knows', names.join() === 'Sacred Flame,Toll the Dead', names);
      document.querySelector('.cantrip-pick-row[data-cantrip="Sacred Flame"]').click();
      check('a save cantrip shows its save and DC', row(0).bonus === 'DC 13' && row(0).save === 'DEX save' && row(0).damage === '1d8 radiant' && row(0).tag === 'auto', row(0));
      check('a save cantrip has no attack roll button', !row(0).rollBtn, row(0));
      setLevel(ch, 5);
      check('cantrip dice grow at level 5', row(0).damage === '2d8 radiant' && row(0).bonus === 'DC 14', row(0));
      openCantripPicker();
      check('an added cantrip is shown as added', document.querySelector('.cantrip-pick-row[data-cantrip="Sacred Flame"]').disabled, null);
      document.querySelector('.cantrip-pick-row[data-cantrip="Toll the Dead"]').click();
      check('a second damage line is shown', row(1).damage === '2d8 necrotic (2d12 if it is hurt)', row(1));

      const wl = newCharacter('Vex', 'Human', 'Warlock', 5); wl.abilities.cha = 18; wl.attacks = []; wl.spells.known = [];
      open(wl);
      openCantripPicker();
      check('with no damage cantrips known, all of them are offered', document.querySelectorAll('.cantrip-pick-row').length > 10, null);
      document.querySelector('.cantrip-pick-row[data-cantrip="Eldritch Blast"]').click();
      check('Eldritch Blast shows its beams and CHA attack', row(0).damage === '1d10 force ×2 beams' && row(0).bonus === '+7' && row(0).rollBtn, row(0));
      toasts.length = 0; rollDamage(0);
      check('rolling Eldritch Blast damage rolls one beam', /one beam/.test(toasts[0] || ''), toasts);
    } catch (e) { check('cantrip flow ran', false, e.stack); }
  });

  // The player view uses the same table
  await pg.evaluate(async () => {
    try {
      const ch = newCharacter('Pip', 'Halfling', 'Rogue', 3); ch.abilities.dex = 18; ch.attacks = []; ch.shareToken = 't';
      open(ch);
      IS_PLAYER_VIEW = true; _pvCharId = ch.id; _pvTab = 'character'; renderApp();
      openWeaponPicker();
      pickWeapon(_wpnVisible.findIndex(w => w.name === 'Rapier'));
      check('the player view gets auto weapons too', row(0) && row(0).bonus === '+6' && row(0).damage === '1d8+4 piercing' && row(0).tag === 'auto', row(0));
      IS_PLAYER_VIEW = false;
    } catch (e) { check('player view flow ran', false, e.stack); }
  });

  const out = await pg.evaluate(() => out);
  out.forEach(l => console.log(l));
  if (errs.length) console.log('PAGE ERRORS:\n' + errs.join('\n'));
  const failed = out.filter(l => l.startsWith('FAIL')).length + errs.length;
  console.log(`\n${out.length - failed} passed, ${failed} failed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
