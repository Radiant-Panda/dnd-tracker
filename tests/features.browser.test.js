// Browser regression test for the Features & Traits panel — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node features.browser.test.js
const p = require('puppeteer-core');
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  const results = await pg.evaluate(async () => {
    saveData = () => {}; openStartingProfsModal = () => {}; showToast = () => {}; _showApp();
    const out = []; const check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + JSON.stringify(detail)));
    const wait = () => new Promise(r => setTimeout(r, 50));
    const subNames = (ch, sub) => ch.featuresList.filter(f => f._subclass === sub).map(f => f.name);
    function mk(cls, lvl, ed = '2024') { const ch = newCharacter('T', 'Human', cls, lvl); ch.edition = ed; migrateCharacter(ch); db.characters[ch.id] = ch; currentCharId = ch.id; currentView = 'character'; renderApp(); return ch; }

    // F1: the +/− level stepper unlocks and removes subclass features
    let ch = mk('Cleric', 3);
    applySubclass(ch.id, 'Cleric', 'Life Domain'); await wait();
    const l6 = SUBCLASS_DATA.Cleric['Life Domain'].features.filter(f => f.level === 6).map(f => f.name);
    chClassField(0, 'level', '6');
    check('stepper level-up unlocks subclass features', l6.every(n => subNames(ch, 'Life Domain').includes(n)), { want: l6, have: subNames(ch, 'Life Domain') });
    chClassField(0, 'level', '3');
    check('stepper level-down removes subclass features', !l6.some(n => subNames(ch, 'Life Domain').includes(n)), subNames(ch, 'Life Domain'));

    // F1: multiclass uses the subclass's own class level
    ch = mk('Fighter', 3);
    applySubclass(ch.id, 'Fighter', 'Battle Master'); await wait();
    addCharClass(); chClassField(1, 'class', 'Wizard'); chClassField(1, 'level', '5');
    check('multiclass: Battle Master stays at Fighter 3 features', !subNames(ch, 'Battle Master').includes('Know Your Enemy'), subNames(ch, 'Battle Master'));
    check('multiclass: subclass resources at Fighter 3', ch.resources.some(r => r.name === 'Superiority Dice' && resourceMax(r, ch) === 4), ch.resources.map(r => r.name));

    // F2: both classes' features are shown
    renderApp();
    const labels = [...document.querySelectorAll('.features-panel .feat-section-label')].map(e => e.textContent.trim());
    const cards = document.querySelector('.features-panel')?.textContent || '';
    check('multiclass: panel shows Wizard class features', cards.includes('WIZARD'), labels);

    // F3: class features modal uses the class level
    openClassFeaturesModal(ch.id, 'Fighter');
    const hdr = document.querySelector('#modal-overlay p')?.textContent || '';
    check('class features modal uses class level', hdr.startsWith('Level 3'), hdr);
    closeModal();
    openClassFeaturesModal(ch.id, 'Wizard');
    const title = document.querySelector('#modal-overlay h2')?.textContent || '';
    check('class features modal can show the second class', title.includes('Wizard'), title);
    closeModal();

    // F4: species follow the chosen edition
    ch = mk('Wizard', 1, '2014');
    changeRace('2014|Elf');
    const elf14 = ch.featuresList.filter(f => f._species).map(f => f.name);
    check('2014 Elf pick gets 2014 traits', !elf14.includes('Elven Lineage') && ch.race === 'Elf', { race: ch.race, elf14 });
    changeRace('2024|Elf');
    check('2024 Elf pick gets 2024 traits', ch.featuresList.some(f => f._species && f.name === 'Elven Lineage'), ch.featuresList.filter(f => f._species).map(f => f.name));
    changeRace('Elf'); // older value format: follows the character's edition
    check('plain species name follows character edition', !ch.featuresList.some(f => f._species && f.name === 'Elven Lineage'), ch.featuresList.filter(f => f._species).map(f => f.name));

    // F5: background Magic Initiate gets the spell picker, preset to its class
    ch = mk('Wizard', 1, '2024');
    changeBackground('Acolyte'); renderApp();
    const i = ch.featuresList.findIndex(f => f._feat && /^Magic Initiate/.test(f.name));
    check('background Magic Initiate shows Choose Spells', (document.querySelector('.features-panel')?.innerHTML || '').includes(`_editMiFeat(${i})`), ch.featuresList[i]);
    _editMiFeat(i);
    check('background Magic Initiate picker preset to Cleric', _miState && _miState.cls === 'Cleric', _miState && _miState.cls);
    closeModal();
    return out;
  });
  results.forEach(r => console.log(r)); if (errs.length) console.log('PAGE ERRORS', errs);
  const failed = results.filter(r => r.startsWith('FAIL')).length; console.log(`\n${results.length - failed}/${results.length} passed`);
  await b.close(); process.exit(failed || errs.length ? 1 : 0);
})();
