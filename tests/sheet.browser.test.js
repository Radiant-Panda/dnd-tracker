// Browser test for the character sheet audit fixes — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node sheet.browser.test.js
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  await pg.evaluate(() => {
    showToast = () => {}; openStartingProfsModal = () => {}; _showApp();
    window.out = [];
    window.check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    window.mk = (cls, lvl, ed = '2024') => { const ch = newCharacter('T', 'Human', cls, lvl); ch.edition = ed; migrateCharacter(ch);
      db.characters[ch.id] = ch; currentCharId = ch.id; currentView = 'character'; renderApp(); return ch; };
    window.stored = id => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').characters?.[id];
    window.sleep = ms => new Promise(r => setTimeout(r, ms));
    window.type = (el, v) => { el.value = v; el.dispatchEvent(new Event('input')); };
    window.skillMod = name => [...document.querySelectorAll('.skill-list li')].find(l => l.textContent.includes(name))?.querySelector('.skill-mod').textContent;
    window.ib = x => typeof initiativeBonus === 'function' ? initiativeBonus(x) : 'missing';
    window.initInput = () => [...document.querySelectorAll('.combat-stat-card')].find(c => c.textContent.includes('Initiative')).querySelector('input');
  });

  // 1. Typed fields save without pressing Save
  await pg.evaluate(async () => {
    const ch = mk('Fighter', 1); saveData(db);
    type([...document.querySelectorAll('.combat-stat-card')][0].querySelector('input'), '17');
    type(document.querySelector('.cs-header-name input'), 'Renamed');
    type(document.querySelectorAll('.currency-cell input')[3], '55');
    await sleep(900);
    const s = stored(ch.id);
    check('typed AC is saved', s.combat.ac === 17, s.combat.ac);
    check('typed name is saved', s.name === 'Renamed', s.name);
    check('typed gold is saved', s.currency.gp === 55, s.currency);
    const ch2 = mk('Fighter', 1); saveData(db);
    openACCalcModal(); document.getElementById('ac-armor-sel').value = '12'; _acCalcApply();
    check('AC calculator Apply is saved', stored(ch2.id).combat.ac === 18, stored(ch2.id).combat.ac);
  });

  // 2. Typing an ability score keeps focus and the whole number
  await pg.evaluate(() => mk('Fighter', 1));
  await pg.click('#ab-str', { clickCount: 3 }); await pg.keyboard.type('1');
  const focusMid = await pg.evaluate(() => document.activeElement?.id);
  await pg.keyboard.type('5'); await pg.keyboard.press('Tab');
  await pg.evaluate(focusMid => {
    check('ability box keeps focus while typing', focusMid === 'ab-str', focusMid);
    check('typing 15 sets STR to 15', db.characters[currentCharId].abilities.str === 15, db.characters[currentCharId].abilities.str);
  }, focusMid);

  await pg.evaluate(async () => {
    // 3. 2014 backgrounds show on 2014 characters
    let ch = mk('Fighter', 1, '2014'); ch.background = 'Folk Hero'; renderApp();
    const bgSelect = () => [...document.querySelectorAll('.cs-header-field')].find(f => f.textContent.includes('Background')).querySelector('select');
    check('2014 character shows its 2014 background', bgSelect().options[bgSelect().selectedIndex]?.text === 'Folk Hero', bgSelect().options[bgSelect().selectedIndex]?.text);
    ch = mk('Fighter', 1, '2024'); ch.background = 'Sage'; renderApp();
    check('2024 character shows its 2024 background', bgSelect().options[bgSelect().selectedIndex]?.text === 'Sage', bgSelect().options[bgSelect().selectedIndex]?.text);

    // 4. Removing an attuned item ends the attunement
    ch = mk('Fighter', 1); ch.equipment = [{ name: 'Cloak of Protection', _magic: true, attunement: true, rarity: 'uncommon' }];
    attuneItem('Cloak of Protection', 0); removeEquipment(0);
    check('removing an attuned item frees its slot', ch.attunedItems.length === 0, ch.attunedItems);

    // 5. Damage and healing around 0 HP
    const dmg = n => { document.getElementById('dmg-inline').value = n; applyDamageInline(); };
    const heal = n => { document.getElementById('heal-inline').value = n; applyHealInline(); };
    ch = mk('Fighter', 1); ch.combat.maxHP = 10; ch.combat.currentHP = 0; renderApp();
    dmg(3);
    check('damage at 0 HP is a failed death save', ch.deathSaves.failures === 1, ch.deathSaves);
    ch.deathSaves = { successes: 1, failures: 2 }; renderApp(); heal(5);
    check('healing from 0 HP clears death saves', ch.deathSaves.successes === 0 && ch.deathSaves.failures === 0 && ch.combat.currentHP === 5, ch.deathSaves);
    ch.combat.currentHP = 5; ch.deathSaves = { successes: 0, failures: 0 }; renderApp(); dmg(12);
    check('dropping to 0 with less than max HP left over is not death', ch.deathSaves.failures === 0 && ch.combat.currentHP === 0, ch.deathSaves);
    ch.combat.currentHP = 5; ch.deathSaves = { successes: 0, failures: 0 }; renderApp(); dmg(15);
    check('massive damage (max HP left over) kills outright', ch.deathSaves.failures === 3, ch.deathSaves);

    // 6. Long rest: hit dice by edition, exhaustion drops by 1
    ch = mk('Fighter', 8); ch.combat.hitDiceUsed = { Fighter: 8 }; ch.exhaustionLevel = 2; renderApp(); doLongRest();
    check('2024 long rest restores all hit dice', ch.combat.hitDiceUsed.Fighter === 0, ch.combat.hitDiceUsed);
    check('long rest lowers exhaustion by 1', ch.exhaustionLevel === 1, ch.exhaustionLevel);
    ch = mk('Fighter', 8, '2014'); ch.combat.hitDiceUsed = { Fighter: 8 }; renderApp(); doLongRest();
    check('2014 long rest restores half the hit dice', ch.combat.hitDiceUsed.Fighter === 4, ch.combat.hitDiceUsed);

    // 7. Exhaustion by edition
    ch = mk('Fighter', 1, '2014'); setExhaustion(2);
    const exText = document.querySelector('.ex-effect-text')?.textContent || '';
    check('2014 exhaustion 2 lists its 2014 effects', /disadvantage on ability checks/i.test(exText) && /speed halved/i.test(exText), exText);
    ch = mk('Fighter', 1); ch.abilities.dex = 14; ch.abilities.wis = 10; setExhaustion(2);
    check('2024 exhaustion 2 takes 4 off skills', skillMod('Acrobatics') === '-2', skillMod('Acrobatics'));
    const dexSave = [...document.querySelectorAll('.skill-list')][0].querySelectorAll('li')[1].querySelector('.skill-mod').textContent;
    check('2024 exhaustion 2 takes 4 off saves', dexSave === '-2', dexSave);
    check('passive Perception is not a roll, so it is unchanged', passivePerception(ch, 2) === 10, passivePerception(ch, 2));
    ch.attacks = [{ name: 'Axe', bonus: '+5', damage: '1d8' }];
    let toast = ''; const realToast = showToast; showToast = h => { toast = h; };
    const rnd0 = Math.random; Math.random = () => 0.5; rollAttack(0); Math.random = rnd0; showToast = realToast;
    check('2024 exhaustion 2 takes 4 off attack rolls (11 + 5 − 4)', /<strong>12<\/strong>/.test(toast), toast);

    // 8. Combat panel spell DC matches the Spells panel
    const combatDC = () => [...document.querySelectorAll('.cs-combat-duo .stat-box')].map(e => e.textContent.replace(/\s+/g, ' ').trim()).join(' | ');
    ch = mk('Wizard', 5); ch.abilities.int = 16; ch.spellBonus = { dc: 1, atk: 1 }; renderApp();
    check('combat spell DC includes the item bonus', /DC.*15/.test(combatDC()) && /\+7/.test(combatDC()), combatDC());
    ch = mk('Cleric', 1); ch.abilities.wis = 18; ch.abilities.int = 8; addCharClass(); chClassField(1, 'class', 'Wizard'); renderApp();
    check('multiclass casters show a DC for each class', /DC · Cleric14/.test(combatDC()) && /DC · Wizard9/.test(combatDC()), combatDC());

    // 9. Initiative follows DEX, keeping any extra bonus
    ch = mk('Fighter', 1); updateAbility('dex', 16);
    check('initiative follows DEX', initInput().value === '3', initInput().value);
    adjustCombatStat('initiative', 1); updateAbility('dex', 18);
    check('an extra initiative bonus survives a DEX change', initInput().value === '5', initInput().value);
    type(initInput(), '9'); updateAbility('dex', 10);
    check('a typed initiative is kept as a bonus over DEX', initInput().value === '5', initInput().value);
    const old1 = newCharacter('Old', 'Human', 'Fighter', 1); old1.abilities.dex = 14; old1.combat.initiative = 0; migrateCharacter(old1);
    check('old characters that never set initiative get their DEX', ib(old1) === 2, ib(old1));
    const old2 = newCharacter('Old', 'Human', 'Fighter', 1); old2.abilities.dex = 14; old2.combat.initiative = 5; migrateCharacter(old2);
    check('old characters keep a hand-set initiative', ib(old2) === 5, ib(old2));

    // 10. Initiative tracker adds the character's bonus
    ch = mk('Fighter', 1); ch.abilities.dex = 14; migrateCharacter(ch);
    const camp = { id: 'camp-t', name: 'C', characters: [ch.id], npcs: [], journal: [], initiative: { round: 1, currentIndex: 0, combatants: [], log: [] } };
    db.campaigns.push(camp); currentCampaignId = camp.id;
    const rnd = Math.random; Math.random = () => 0.5;
    addAllPcsToInitiative(); const addedAll = camp.initiative.combatants[0]?.initiative;
    quickAddCombatant(ch.id, 'player'); const qa = document.getElementById('qa-init').value; closeModal();
    camp.initiative.combatants[0].initiative = 1; rerollCombatantInitiative(0);
    const rerolled = camp.initiative.combatants[0].initiative;
    Math.random = rnd;
    check('re-rolling a linked character adds their bonus (10 + 2)', rerolled === 12, rerolled);
    check('"Add all PCs" adds the initiative bonus (10 + 2)', addedAll === 12, addedAll);
    check('quick add suggests roll + bonus (10 + 2)', qa === '12', qa);
    currentView = 'character';

    // 11. Losing levels gives back hit dice that no longer exist
    ch = mk('Fighter', 5); ch.combat.hitDiceUsed = { Fighter: 5 }; chClassField(0, 'level', 2); renderApp();
    check('used hit dice are capped at the new level', ch.combat.hitDiceUsed.Fighter === 2, ch.combat.hitDiceUsed);
  });

  // 12. Senses panel
  await pg.evaluate(async () => {
    const panel = label => [...document.querySelectorAll('.sheet-panel')].find(el => el.querySelector('.cs-section-label')?.textContent.trim() === label);
    let ch = mk('Fighter', 1); ch.abilities.wis = 14; ch.abilities.int = 12; ch.skillProficiencies = ['Perception']; changeRace('2024|Elf');
    const senses = panel('Senses');
    check('the sheet has a Senses panel', !!senses, null);
    const txt = (senses?.textContent || '').replace(/\s+/g, ' ');
    check('Senses shows passive Perception, Investigation and Insight', /Passive Perception\s*14/.test(txt) && /Passive Investigation\s*11/.test(txt) && /Passive Insight\s*12/.test(txt), txt);
    check('Senses shows darkvision from the species', /Darkvision 60 ft/.test(txt) && /Elf/.test(txt), txt);
    check('Core Stats no longer repeats passive Perception', !/Passive Perception/.test(panel('Core Stats')?.textContent || ''), panel('Core Stats')?.textContent);
    saveData(db); type(senses.querySelector('textarea'), 'Tremorsense 10 ft (boots)'); await sleep(900);
    check('other senses notes are saved', stored(ch.id).otherSenses === 'Tremorsense 10 ft (boots)', stored(ch.id).otherSenses);
    ch = mk('Fighter', 1); changeRace('2024|Human');
    check('no special senses reads as none', /No special senses/.test(panel('Senses')?.textContent || ''), panel('Senses')?.textContent);

    // 13. Encumbrance panel
    ch = mk('Fighter', 1); ch.abilities.str = 10; ch.equipment = ['Longsword', '20 arrows', 'Lucky pebble']; ch.currency = { cp: 0, sp: 0, ep: 0, gp: 100, pp: 0 }; renderApp();
    const enc = () => (panel('Encumbrance')?.textContent || '').replace(/\s+/g, ' ');
    check('the sheet has an Encumbrance panel', !!panel('Encumbrance'), null);
    check('it adds items and coins against STR × 15', /\b6 \/ 150 lb/.test(enc()), enc());
    check('items with no known weight are named', /Lucky pebble/.test(enc()), enc());
    check('drag/lift/push limit is shown', /300 lb/.test(enc()), enc());
    const eqWeights = [...document.querySelectorAll('.eq-item .eq-weight')].map(e => e.textContent.trim());
    check('equipment rows show their weight', eqWeights.includes('3 lb') && eqWeights.includes('1 lb'), eqWeights);
    const gp = document.querySelectorAll('.currency-cell input')[3]; gp.focus(); type(gp, '600');
    check('typing coins updates the total straight away', /\b16 \/ 150 lb/.test(enc()), enc());
    check('…without losing focus', document.activeElement === gp, document.activeElement?.outerHTML?.slice(0, 80));
    const other = panel('Encumbrance').querySelector('input'); other.focus(); type(other, '10');
    check('the Other amount adds to the total', /\b26 \/ 150 lb/.test(enc()) && document.activeElement === other, enc());
    ch.abilities.str = 3; ch.equipment = ['Chain Mail']; ch.currency = {}; ch.carryWeight = 0; renderApp();
    check('over capacity (55 lb vs 45) says so', /Over capacity/.test(enc()), enc());
    ch.abilities.str = 1; renderApp();
    check('past the drag limit (55 lb vs 30) is too heavy to move', /Too heavy to move/.test(enc()), enc());
  });

  // 14. Themes: pastel Sapphire and Rose Gold exist; text on accent-coloured pills is readable in every theme
  await pg.evaluate(() => {
    const rgb = c => (c.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
    const lum = c => { const [r, g, b] = rgb(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    check('there is a pastel blue theme', Object.values(THEMES).some(t => t.name === 'Powder Blue'), Object.values(THEMES).map(t => t.name));
    check('there is a pastel rose theme', Object.values(THEMES).some(t => t.name === 'Blush'), Object.values(THEMES).map(t => t.name));
    check('the green theme is the earthy Forest', THEMES.emerald.name === 'Forest', THEMES.emerald.name);
    check('there is a Maroon theme', Object.values(THEMES).some(t => t.name === 'Maroon'), Object.values(THEMES).map(t => t.name));
    mk('Fighter', 1);
    const low = [];
    for (const key of Object.keys(THEMES)) {
      applyTheme(key); renderApp();
      const pill = [...document.querySelectorAll('.mc-total button')].find(b => b.textContent === '2024');
      const cs = getComputedStyle(pill);
      const c = contrast(cs.color, cs.backgroundColor);
      if (c < 4.5) low.push(`${key} ${c.toFixed(1)}`);
    }
    check('edition pill text is readable in every theme (4.5:1)', low.length === 0, low);

    // Page pieces that used to stay purple follow the theme; Arcane looks exactly as before
    const look = () => ({
      header: getComputedStyle(document.querySelector('.cs-header')).backgroundImage,
      portrait: getComputedStyle(document.querySelector('.portrait-frame')).backgroundImage,
      glow: getComputedStyle(document.body).backgroundImage.slice(0, 120),
      dim: getComputedStyle(document.documentElement).getPropertyValue('--text-dim').trim(),
    });
    applyTheme('arcane'); renderApp(); const arcane = look();
    check('Arcane keeps its header, portrait, glow and dim text', /rgb\(31, 31, 38\)/.test(arcane.header) && /rgb\(30, 19, 50\)/.test(arcane.portrait) && /124, 79, 212/.test(arcane.glow) && arcane.dim === '#857fa8', arcane);
    applyTheme('emerald'); renderApp(); const forest = look();
    check('Forest header uses its own surfaces', /rgb\(25, 31, 23\)/.test(forest.header), forest.header);
    check('Forest portrait frame is not purple', !/rgb\(30, 19, 50\)|rgb\(61, 34, 96\)/.test(forest.portrait), forest.portrait);
    check('Forest background glow is not purple', !/124, 79, 212|232, 121, 249/.test(forest.glow), forest.glow);
    check('Forest dim text is not purple', forest.dim !== '#857fa8', forest.dim);
    const pillBg = getComputedStyle(document.querySelector('.mc-pill')).backgroundColor;
    check('Forest class pills are not purple', !/30, 19, 50/.test(pillBg), pillBg);
    applyTheme('arcane');
  });

  const out = await pg.evaluate(() => out);
  out.forEach(l => console.log(l));
  if (errs.length) console.log('PAGE ERRORS:', errs);
  const failed = out.filter(l => l.startsWith('FAIL')).length + (errs.length ? 1 : 0);
  console.log(`\n${out.length - out.filter(l => l.startsWith('FAIL')).length}/${out.length} passed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
