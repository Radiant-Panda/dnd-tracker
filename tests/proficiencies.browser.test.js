// Browser test for Proficiencies & Languages — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node proficiencies.browser.test.js
const p = require('puppeteer-core');
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  const results = await pg.evaluate(async () => {
    saveData = () => {}; showToast = () => {}; openStartingProfsModal = () => {}; _showApp();
    const out = []; const check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    const mk = (cls, lvl, ed = '2024') => { const ch = newCharacter('T', 'Human', cls, lvl); ch.edition = ed; migrateCharacter(ch); db.characters[ch.id] = ch; currentCharId = ch.id; currentView = 'character'; renderApp(); return ch; };
    const startProfs = (ch, cls) => { window._spCharId = ch.id; window._spClass = cls; confirmStartingProfs(); };
    const panel = () => [...document.querySelectorAll('.sheet-panel')].find(el => el.textContent.includes('Proficiencies & Languages'));
    const chips = cat => [...(panel()?.querySelectorAll(`.prof-group[data-cat="${cat}"] .prof-chip-name`) || [])].map(e => e.textContent);
    const saveDots = () => { const el = [...document.querySelectorAll('.sheet-panel')].find(e => e.textContent.includes('Saving Throws'));
      return [...el.querySelectorAll('li')].filter(li => li.querySelector('.prof-dot.proficient')).map(li => li.textContent.trim().split(/\s+/)[0]); };

    // P1 / I1: proficiencies grouped, each removable, and addable
    let ch = mk('Rogue', 1); startProfs(ch, 'Rogue');
    check('armor shows under Armor', chips('armor').includes('Light armor'), chips('armor'));
    check('weapons show under Weapons', chips('weapons').includes('Simple weapons'), chips('weapons'));
    check("Thieves' tools shows under Tools", chips('tools').includes("Thieves' tools"), chips('tools'));
    check('class proficiencies are tagged with the class', (panel()?.querySelector('.prof-group[data-cat="armor"] .prof-chip')?.textContent || '').includes('Rogue'), panel()?.querySelector('.prof-chip')?.textContent);
    removeProficiency('Light armor');
    check('a proficiency can be removed', !chips('armor').includes('Light armor') && !/Light armor/.test(ch.proficiencies), ch.proficiencies);
    addProficiency('Vehicles (land)');
    check('a proficiency can be added and lands in the right group', chips('tools').includes('Vehicles (land)'), chips('tools'));

    // P2: apostrophe languages can be removed with their button
    addLanguage("Thieves' Cant"); renderApp();
    const btn = [...panel().querySelectorAll('.lang-pill')].find(el => el.textContent.includes('Thieves'))?.querySelector('button');
    try { btn.click(); } catch (e) {}
    check("Thieves' Cant can be removed", !ch.knownLanguages.includes("Thieves' Cant"), ch.knownLanguages);

    // P3 / P4: saves from the first class only; granted saves can be switched off
    ch = mk('Fighter', 3); addCharClass(); chClassField(1, 'class', 'Wizard'); renderApp();
    check('Fighter/Wizard is proficient in STR and CON saves only', JSON.stringify(saveDots()) === JSON.stringify(['Strength', 'Constitution']), saveDots());
    toggleSaveProf('str'); renderApp();
    check('a class-granted save can be switched off', !saveDots().includes('Strength'), saveDots());
    toggleSaveProf('str'); renderApp();
    check('…and back on', saveDots().includes('Strength'), saveDots());

    // P5: changing class removes the old class's armor and weapons
    ch = mk('Fighter', 1); startProfs(ch, 'Fighter');
    chClassField(0, 'class', 'Wizard');
    check('Fighter → Wizard drops Heavy armor and Martial weapons', !/Heavy armor|Martial weapons/.test(ch.proficiencies), ch.proficiencies);

    // P6: Jack of All Trades
    ch = mk('Bard', 2); ch.abilities.str = 10;
    check('Bard 2 adds half proficiency to Athletics', skillBonus(ch, 'Athletics', 'str', profBonus(2)) === 1, skillBonus(ch, 'Athletics', 'str', profBonus(2)));

    // P7: language dropdown follows the edition
    ch = mk('Wizard', 1, '2014');
    const groups = () => [...panel().querySelectorAll('.lang-add-select optgroup')].map(g => g.label);
    const options = () => [...panel().querySelectorAll('.lang-add-select option')].map(o => o.value);
    check('2014 offers Standard / Exotic / Secret without Common Sign Language', JSON.stringify(groups()) === '["Standard","Exotic","Secret"]' && !options().includes('Common Sign Language'), { g: groups() });
    ch = mk('Wizard', 1, '2024');
    check('2024 offers Standard / Rare', JSON.stringify(groups()) === '["Standard","Rare"]', groups());

    // P8: species languages
    ch = mk('Wizard', 1, '2014');
    changeRace('2014|Elf');
    check('2014 Elf learns Elvish', ch.knownLanguages.includes('Elvish'), ch.knownLanguages);
    changeRace('2014|Dwarf');
    check('changing species swaps its languages', ch.knownLanguages.includes('Dwarvish') && !ch.knownLanguages.includes('Elvish'), ch.knownLanguages);

    // P9: class languages
    ch = mk('Rogue', 1);
    check('Rogue knows Thieves\' Cant', ch.knownLanguages.includes("Thieves' Cant"), ch.knownLanguages);
    chClassField(0, 'class', 'Druid');
    check('Rogue → Druid swaps to Druidic', ch.knownLanguages.includes('Druidic') && !ch.knownLanguages.includes("Thieves' Cant"), ch.knownLanguages);

    // P10 / I2: multiclassing adds the right edition's proficiencies, and removing the class takes them away
    ch = mk('Wizard', 3, '2024'); addCharClass(); chClassField(1, 'class', 'Paladin');
    check('2024 Paladin multiclass adds Martial weapons and armor', /Martial weapons/.test(ch.proficiencies) && /Shields/.test(ch.proficiencies), ch.proficiencies);
    check('…but not Simple weapons (a 2014-only grant)', !/Simple weapons/.test(ch.proficiencies), ch.proficiencies);
    removeCharClass(1);
    check('removing the multiclass removes its proficiencies', !/Martial weapons|Shields/.test(ch.proficiencies), ch.proficiencies);

    // I3: 2024 language reminder
    ch = mk('Wizard', 1, '2024'); renderApp();
    check('2024 character with only Common sees the reminder', (panel()?.textContent || '').includes('choose 2 more languages'), panel()?.textContent.slice(0, 200));
    addLanguage('Elvish'); addLanguage('Dwarvish'); renderApp();
    check('…which disappears once chosen', !(panel()?.textContent || '').includes('choose 2 more languages'), null);
    return out;
  });
  results.forEach(r => console.log(r)); if (errs.length) console.log('PAGE ERRORS', errs);
  const failed = results.filter(r => r.startsWith('FAIL')).length; console.log(`\n${results.length - failed}/${results.length} passed`);
  await b.close(); process.exit(failed || errs.length ? 1 : 0);
})();
