// Browser test for the spells system. Run through run-browser-tests.js.
const p = require('puppeteer-core');
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
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

    // B2: each edition sees its own version of a spell
    ch = mk('Cleric', 1, '2014');
    ch.spells.known.push({ name: 'Cure Wounds', level_int: 1, school: 'Abjuration' }); // stored while shown as 2024
    let cw = fullSpellData(ch.spells.known.at(-1), ch);
    check('2014 character gets 2014 Cure Wounds (Evocation, 1d8)', cw.school === 'Evocation' && /1d8/.test(cw.desc), { school: cw.school, desc: cw.desc.slice(0, 80) });
    ch = mk('Cleric', 1, '2024');
    cw = fullSpellData('Cure Wounds', ch);
    check('2024 character gets 2024 Cure Wounds (Abjuration, 2d8)', cw.school === 'Abjuration' && /2d8/.test(cw.desc), { school: cw.school });
    const names = getMergedSpells(ch).map(s => s.name);
    check('one copy of each spell in the list', names.length === new Set(names).size, names.length);
    spellFilters = { q: '', level: 'all', school: 'all', cls: 'all', source: 'phb2014', conc: false, ritual: false };
    const phb14 = getFilteredAllSpells(ch);
    check('PHB 2014 filter shows the 2014 book, even for a 2024 character', phb14.length > 300 && phb14.every(s => s.edition === '2014'), phb14.length);
    spellFilters.source = 'all';
    ch.spells.known.push({ name: 'Cure Wounds', level_int: 1, _fromFeat: 'Magic Initiate', _miId: 'x' });
    cw = fullSpellData(ch.spells.known.at(-1), ch);
    check('stored flags survive the lookup', cw._fromFeat === 'Magic Initiate' && cw._miId === 'x', cw);

    // B8: custom spell level label
    customSpells = [];
    document.body.insertAdjacentHTML('beforeend', '<div id="cspt"><input id="csp-name" value="Zap"><input id="csp-level" value="2"><select id="csp-school"><option>Evocation</option></select></div>');
    saveCustomSpell(null); document.getElementById('cspt').remove();
    check('custom 2nd-level spell label', customSpells[0]?.level === '2nd-level', customSpells[0]);

    // B9: custom spells travel with the character
    customSpells[0].desc = 'A bolt of homebrew lightning.'; customSpells[0].duration = '1 round';
    ch = mk('Wizard', 3);
    spellAddFromEncoded('known', encodeURIComponent(JSON.stringify({ name: 'Zap', level_int: 2, _custom: true })));
    const stored = ch.spells.known.find(sp => sp.name === 'Zap');
    check('learned custom spell is stored whole', stored && stored.desc === 'A bolt of homebrew lightning.' && stored.duration === '1 round', stored);
    customSpells = null; try { localStorage.removeItem(CUSTOM_SPELLS_KEY); } catch (e) {} // a fresh device
    loadCustomSpells();
    check('another device rebuilds the custom spell list', customSpells.some(sp => sp.name === 'Zap' && sp.desc), customSpells);
    document.body.insertAdjacentHTML('beforeend', '<div id="cspt"><input id="csp-name" value="Zap"><input id="csp-level" value="2"><select id="csp-school"><option>Evocation</option></select><textarea id="csp-desc">Now with thunder.</textarea></div>');
    saveCustomSpell(customSpells.findIndex(sp => sp.name === 'Zap')); document.getElementById('cspt').remove();
    check('editing a custom spell updates characters that know it', ch.spells.known.find(sp => sp.name === 'Zap')?.desc === 'Now with thunder.', ch.spells.known.find(sp => sp.name === 'Zap'));
    // Improvements ─────────────────────────────────────────────
    const knownCard = name => [...document.querySelectorAll('#spell-tab-content .spell-card')].find(c => c.querySelector('.spell-name')?.textContent === name);
    // Cast from the Known tab
    ch = mk('Sorcerer', 3, '2014');
    ch.spells.known.push({ name: 'Magic Missile', level_int: 1 }, { name: 'Fire Bolt', level_int: 0 });
    spellViewTab = 'known'; renderApp(); await wait();
    check('2014 Sorcerer can cast a known spell from Known', !!knownCard('Magic Missile')?.querySelector('.btn-cast'), null);
    check('cantrips have a Cast button on Known', !!knownCard('Fire Bolt')?.querySelector('.btn-cast'), null);
    ch = mk('Wizard', 3, '2024');
    ch.spells.known.push({ name: 'Sleep', level_int: 1 });
    spellViewTab = 'known'; renderApp(); await wait();
    check('2024 Wizard must prepare before casting', !knownCard('Sleep')?.querySelector('.btn-cast'), null);

    // Cast window: ritual + upcasting
    ch = mk('Wizard', 5, '2024');
    openCastModal('Detect Magic', 1);
    check('ritual spells offer ritual casting', !!document.querySelector('#modal-overlay [onclick*="confirmCastRitual"]'), null);
    const slotsBefore = ch.spells.slots[1];
    confirmCastRitual('Detect Magic');
    check('ritual casting uses no slot and is logged', ch.spells.slots[1] === slotsBefore && ch.sessionLog[0].text === 'Detect Magic (ritual)', ch.sessionLog[0]);
    openCastModal('Fireball', 3);
    const castText = document.querySelector('#modal-overlay')?.textContent || '';
    check('cast window explains upcasting', castText.includes('Using a Higher-Level Spell Slot') && castText.includes('for each spell slot level above 3'), castText.slice(0, 200));
    closeModal();

    // Cantrip scaling and costly components
    ch = mk('Wizard', 5, '2024');
    ch.spells.known.push({ name: 'Fire Bolt', level_int: 0 }, { name: 'Revivify', level_int: 3 });
    spellViewTab = 'known'; renderApp(); await wait();
    check('cantrip shows its damage at your level', (knownCard('Fire Bolt')?.textContent || '').includes('At level 5: 2d10'), knownCard('Fire Bolt')?.textContent.slice(0, 200));
    check('priced components are tagged', (knownCard('Revivify')?.querySelector('.spell-tag.cost')?.textContent || '') === '300 gp · used up', knownCard('Revivify')?.querySelector('.spell-tag.cost')?.textContent);

    // "My class spells" filter
    spellFilters = { q: '', level: 'all', school: 'all', cls: 'mine', source: 'all', conc: false, ritual: false };
    ch = mk('Cleric', 5, '2024');
    let mine = getFilteredAllSpells(ch).map(sp => sp.name);
    check('Cleric sees Cleric spells, not Fireball', mine.includes('Cure Wounds') && !mine.includes('Fireball'), mine.length);
    chClassField(0, 'subclass', 'Light Domain');
    mine = getFilteredAllSpells(ch).map(sp => sp.name);
    check('subclass spells join the list (Light Domain: Fireball)', mine.includes('Fireball'), mine.length);
    ch = mk('Fighter', 3, '2024'); chClassField(0, 'subclass', 'Eldritch Knight');
    mine = getFilteredAllSpells(ch).map(sp => sp.name);
    check('Eldritch Knight sees the Wizard list', mine.includes('Shield') && !mine.includes('Cure Wounds'), mine.length);

    // Feat-spell DC and item bonus
    ch = mk('Fighter', 1, '2024', { wis: 16 });
    ch.spells.known.push({ name: 'Guidance', level_int: 0, _fromFeat: 'Magic Initiate', _miAbility: 'wis' });
    renderApp(); await wait();
    const rows = () => [...document.querySelectorAll('.spell-stat-row')].map(r => r.textContent.replace(/\s+/g, ' ').trim());
    check('feat spells get their own DC row (8 + 2 + 3 = 13)', rows().some(r => r.includes('Feat spells') && r.includes('13')), rows());
    setSpellBonus('dc', 2);
    check('item bonus raises the DC', rows().some(r => r.includes('Feat spells') && r.includes('15')), rows());
    return out;
  });
  results.forEach(r => console.log(r)); if (errs.length) console.log('PAGE ERRORS', errs);
  const failed = results.filter(r => r.startsWith('FAIL')).length; console.log(`\n${results.length - failed}/${results.length} passed`);
  await b.close(); process.exit(failed || errs.length ? 1 : 0);
})();
