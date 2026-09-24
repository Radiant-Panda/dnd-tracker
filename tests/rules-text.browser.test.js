// Browser test for formatted rules text — needs the local server (npx serve -l 5173 .) and puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node rules-text.browser.test.js [screenshot-dir]
const p = require('puppeteer-core');
const shots = process.argv[2];
(async () => {
  const b = await p.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.setViewport({ width: 1300, height: 1000 });
  await pg.goto('http://localhost:5173/?t=' + Date.now(), { waitUntil: 'networkidle2' }); await new Promise(r => setTimeout(r, 2000));
  const out = [];
  const check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + JSON.stringify(detail).slice(0, 300)));
  const shot = async (sel, file) => { if (!shots) return; const el = await pg.$(sel); if (el) { await el.evaluate(e => e.scrollIntoView()); await el.screenshot({ path: `${shots}/${file}` }); } };
  const setup = (cls, lvl, sub) => pg.evaluate(async (cls, lvl, sub) => {
    saveData = () => {}; showToast = () => {}; openStartingProfsModal = () => {}; _showApp(); closeModal();
    const ch = newCharacter('T', 'Human', cls, lvl); ch.edition = '2024'; migrateCharacter(ch);
    db.characters[ch.id] = ch; currentCharId = ch.id; currentView = 'character'; renderApp();
    if (sub) { applySubclass(ch.id, cls, sub); await new Promise(r => setTimeout(r, 50)); }
    return ch.id;
  }, cls, lvl, sub);

  // Sorcerer 5: Font of Magic table with the reader's row
  let id = await setup('Sorcerer', 5);
  let r = await pg.evaluate(id => {
    openClassFeaturesModal(id, 'Sorcerer');
    const m = document.querySelector('#modal-overlay');
    return { hasTable: !!m.querySelector('.rt-table caption'), you: m.querySelector('tr.rt-you')?.textContent, raw: m.textContent.includes('[Table:') };
  }, id);
  check('Font of Magic table renders', r.hasTable && !r.raw, r);
  check('Font of Magic highlights the Sorcerer 5 row', r.you === '355', r);
  await shot('#modal-overlay .modal', 'modal-sorcerer.png');

  // Cleric 5: Channel Divinity options with the level note
  id = await setup('Cleric', 5);
  r = await pg.evaluate(id => {
    openClassFeaturesModal(id, 'Cleric');
    const m = document.querySelector('#modal-overlay');
    return { options: [...m.querySelectorAll('.rt-option-name')].map(e => e.textContent), level: m.querySelector('.rt-level')?.textContent,
      runins: m.querySelectorAll('.rt-runin').length };
  }, id);
  check('Channel Divinity shows Divine Spark and Turn Undead', r.options.includes('Divine Spark') && r.options.includes('Turn Undead'), r);
  check('Divine Spark shows the die at Cleric 5', r.level === 'At Cleric 5: 1d8', r);
  await pg.evaluate(() => { const el = [...document.querySelectorAll('#modal-overlay .rt-option')][0]; el && el.scrollIntoView(); });
  await shot('#modal-overlay .modal', 'modal-cleric.png');

  // Battle Master card: name visible, tracker on its own line, structured body
  id = await setup('Fighter', 3, 'Battle Master');
  r = await pg.evaluate(() => {
    const card = [...document.querySelectorAll('.features-panel .sf-card')].find(c => c.textContent.includes('Combat Superiority'));
    card.querySelector('.sf-card-header').click();
    const nm = card.querySelector('.sf-name');
    return { nameFits: nm.scrollWidth <= nm.clientWidth + 1, res: card.querySelector('.sf-res-row')?.textContent.trim(),
      runins: [...card.querySelectorAll('.rt-runin')].map(e => e.textContent), label: [...document.querySelectorAll('.features-panel .feat-section-label')].map(e => e.textContent.trim()) };
  });
  check('Combat Superiority name is not cut off', r.nameFits, r);
  check('Superiority Dice row shows count, die and recharge', r.res === '4 / 4 d8 · Short Rest', r);
  check('Combat Superiority body has run-in headings', ['Maneuvers.', 'Superiority Dice.', 'Saving Throws.'].every(n => r.runins.includes(n)), r);
  check('single subclass named in its section heading', r.label.some(l => l.startsWith('✦ Battle Master')), r);
  await shot('.features-panel', 'sidebar-battlemaster.png');

  // Stored text on an existing character refreshes to the formatted version
  r = await pg.evaluate(() => {
    const ch = db.characters[currentCharId];
    const f = ch.featuresList.find(x => x.name === 'Combat Superiority'); f.desc = 'old flat text';
    ch.featuresList.push({ name: 'Alert', desc: 'old', _feat: true, _featSource: 'PHB 2024' });
    migrateCharacter(ch);
    return { sub: f.desc.includes('**Superiority Dice.**'), feat: ch.featuresList.find(x => x.name === 'Alert').desc !== 'old' };
  });
  check('existing characters get the formatted text', r.sub && r.feat, r);

  // Spells: known-spell cards render structured text (tables, run-in higher-level note)
  id = await setup('Wizard', 5);
  r = await pg.evaluate(async () => {
    await fetchAllSpells();
    const ch = db.characters[currentCharId];
    ch.spells.known.push({ name: 'Confusion', level_int: 4 }, { name: 'Fireball', level_int: 3 });
    const html = renderKnownView(ch);
    const div = document.createElement('div'); div.innerHTML = html;
    const text = div.textContent;
    return { table: !!div.querySelector('.spell-desc .rt-table'), runin: [...div.querySelectorAll('.spell-desc .rt-runin')].map(e => e.textContent),
      fireballFix: text.includes('increases by 1d6 for each spell slot level above 3'), junk: /\[Area of Effect\]/.test(text) };
  });
  check('Confusion shows its behavior table', r.table, r);
  check('higher-level casting is a run-in heading', r.runin.includes('Using a Higher-Level Spell Slot.'), r);
  check('Fireball text corrected and cleaned up', r.fireballFix && !r.junk, r);

  // Phone width: nothing scrolls sideways
  await pg.setViewport({ width: 400, height: 900 });
  r = await pg.evaluate(() => { renderApp(); return document.documentElement.scrollWidth; });
  check('no sideways scroll at phone width', r <= 400, r);

  out.forEach(l => console.log(l)); if (errs.length) console.log('PAGE ERRORS', errs);
  const failed = out.filter(l => l.startsWith('FAIL')).length; console.log(`\n${out.length - failed}/${out.length} passed`);
  await b.close(); process.exit(failed || errs.length ? 1 : 0);
})();
