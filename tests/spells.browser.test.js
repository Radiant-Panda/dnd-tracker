// Browser test for the spells system. Run through run-browser-tests.js.
const p = require('puppeteer-core');
(async () => {
  const b = await p.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('http://localhost:5173/?t=' + Date.now(), { waitUntil: 'networkidle2' }); await new Promise(r => setTimeout(r, 2000));
  const results = await pg.evaluate(async () => {
    saveData = () => {}; showToast = () => {}; openStartingProfsModal = () => {}; showConfirm = (m, fn) => fn(); _showApp();
    const out = []; const check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + JSON.stringify(detail).slice(0, 300)));
    const wait = (ms = 50) => new Promise(r => setTimeout(r, ms));
    // Same steps as the character wizard: create, then apply slots
    function mk(cls, lvl, ed = '2024', abilities = {}) {
      const ch = newCharacter('T', 'Human', cls, lvl); ch.edition = ed; Object.assign(ch.abilities, abilities);
      migrateCharacter(ch); applySpellSlots(ch); db.characters[ch.id] = ch; currentCharId = ch.id; currentView = 'character'; renderApp(); return ch;
    }
    const badge = tab => document.querySelector(`.spell-tab[data-tab="${tab}"] .spell-count`)?.textContent;
    await fetchAllSpells();

    // B1: slots available at creation and on level-up; spent slots stay spent
    let ch = mk('Wizard', 3);
    check('new Wizard 3 starts with full slots', ch.spells.slots[1] === 4 && ch.spells.slots[2] === 2, ch.spells.slots);
    ch.spells.slots[1] = 1;
    chClassField(0, 'level', '5');
    check('level-up adds the new slots only', ch.spells.slots[1] === 1 && ch.spells.slots[3] === 2, ch.spells.slots);
    chClassField(0, 'level', '4');
    check('level-down removes lost slots', ch.spells.slots[3] === 0 && ch.spells.slotsMax[3] === 0, ch.spells.slots);

    // B3/B4: 2024 half casters
    check('2024 Paladin 1 has 2 slots', mk('Paladin', 1).spells.slotsMax[1] === 2, null);
    ch = mk('Paladin', 5); addCharClass(); chClassField(1, 'class', 'Wizard'); chClassField(1, 'level', '1');
    check('2024 Paladin 5 / Wizard 1 has 3 second-level slots', ch.spells.slotsMax[2] === 3, ch.spells.slotsMax);

    // B5/B6: cantrips and limits in the UI
    mk('Cleric', 4, '2014'); await wait();
    check('2014 Cleric 4 cantrip limit is 4', _cantripMax(db.characters[currentCharId]) === 4, _cantripMax(db.characters[currentCharId]));
    mk('Wizard', 1, '2024', { int: 10 }); spellViewTab = 'known'; renderApp(); await wait();
    check('2024 Wizard 1 prepared badge reads 0/4', badge('prepared') === '0/4', badge('prepared'));
    mk('Sorcerer', 3, '2014'); renderApp(); await wait();
    check('2014 Sorcerer 3 known badge reads 0/4', badge('known') === '0/4', badge('known'));
    mk('Fighter', 3, '2014'); chClassField(0, 'subclass', 'Eldritch Knight'); renderApp(); await wait();
    const efDc = [...document.querySelectorAll('.spell-stat-row .spell-stat-label')].map(e => e.textContent);
    check('Eldritch Knight shows a spell save DC', efDc.includes('Fighter') && efDc.includes('Spell Save DC'), efDc);

    // B7: removing a known spell also unprepares it
    ch = mk('Wizard', 3);
    spellAddFromEncoded('prepared', encodeURIComponent(JSON.stringify({ name: 'Shield', level_int: 1 })));
    removeSpellEntry('known', ch.spells.known.findIndex(s => s.name === 'Shield'));
    check('removing a known spell unprepares it', !ch.spells.prepared.some(s => s.name === 'Shield'), ch.spells.prepared);

    // B8: custom spell level label
    customSpells = [];
    document.body.insertAdjacentHTML('beforeend', '<div id="cspt"><input id="csp-name" value="Zap"><input id="csp-level" value="2"><select id="csp-school"><option>Evocation</option></select></div>');
    saveCustomSpell(null); document.getElementById('cspt').remove();
    check('custom 2nd-level spell label', customSpells[0]?.level === '2nd-level', customSpells[0]);
    return out;
  });
  results.forEach(r => console.log(r)); if (errs.length) console.log('PAGE ERRORS', errs);
  const failed = results.filter(r => r.startsWith('FAIL')).length; console.log(`\n${results.length - failed}/${results.length} passed`);
  await b.close(); process.exit(failed || errs.length ? 1 : 0);
})();
