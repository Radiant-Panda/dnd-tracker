// Browser test for content added from the remaining official books.
// Run through run-browser-tests.js (starts and stops the local server).
const p = require('puppeteer-core');
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  const results = await pg.evaluate(async () => {
    saveData = () => {}; openStartingProfsModal = () => {}; showToast = () => {}; _showApp();
    const out = []; const check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + JSON.stringify(detail).slice(0, 300)));
    const wait = () => new Promise(r => setTimeout(r, 50));
    function mk(cls, lvl, ed = '2024') { const ch = newCharacter('T', 'Human', cls, lvl); ch.edition = ed; migrateCharacter(ch); db.characters[ch.id] = ch; currentCharId = ch.id; currentView = 'character'; renderApp(); return ch; }

    // Spells
    await fetchAllSpells();
    const barbs = allSpellsDb.find(s => s.name === 'Silvery Barbs');
    check('Silvery Barbs is a Bard spell', barbs && /Bard/.test(barbs.dnd_class), barbs);
    const bar = document.createElement('div'); bar.innerHTML = renderFilterBar();
    check('spell source filter lists new books', ['scc', 'ftd', 'frhof'].every(v => bar.querySelector(`option[value="${v}"]`)), [...bar.querySelectorAll('option')].map(o => o.value));

    // Feats
    check('feat source filter lists new books', featSrcOpts().includes('Forge of the Artificer') && featSrcOpts().includes('Strixhaven'), featSrcOpts());
    const ib = FEATS_ITEMS_DATA.feats.find(f => f.name === 'Initiate of High Sorcery');
    check('prerequisites read as text', ib && !/\{/.test(ib.prerequisite) && ib.prerequisite.includes('Sorcerer 1+ or Wizard 1+'), ib && ib.prerequisite);

    // Backgrounds
    let ch = mk('Rogue', 1);
    changeBackground('Criminal');
    const pb = profBonus(ch.level);
    const soh = skillBonus(ch, 'Sleight of Hand', 'dex', pb) - mod(ch.abilities.dex);
    check('2024 Criminal grants Sleight of Hand proficiency', soh === pb, { soh, pb, profs: ch.skillProficiencies });
    ch = mk('Wizard', 1);
    ch.skillProficiencies.push({ name: 'Sleight Of Hand', _source: 'background' }); ch.proficiencies = "Calligrapher'S Supplies";
    migrateCharacter(ch);
    check('old characters get the corrected skill name', ch.skillProficiencies.some(e => e.name === 'Sleight of Hand') && ch.proficiencies === "Calligrapher's Supplies", ch.skillProficiencies);
    changeBackground('House Cannith Heir');
    check('Eberron heir background grants Mark of Making', ch.featuresList.some(f => f._feat && f.name === 'Mark of Making'), ch.featuresList.map(f => f.name));

    // Species
    ch = mk('Fighter', 1, '2014'); renderApp();
    const opts = [...document.querySelectorAll('select option')].map(o => o.value);
    check('species dropdown lists both Warforged', opts.includes('2014|Warforged') && opts.includes('2024|Warforged'), opts.filter(o => /Warforged/.test(o)));
    changeRace('2024|Warforged');
    check('2024 Warforged traits', ch.featuresList.some(f => f._species && f.name === 'Construct Resilience'), ch.featuresList.filter(f => f._species).map(f => f.name));
    changeRace('2014|Warforged');
    check('2014 Warforged traits', ch.featuresList.some(f => f._species && f.name === 'Constructed Resilience') && ch.raceEdition === '2014', ch.featuresList.filter(f => f._species).map(f => f.name));
    openCharWizard(); wizardData._speciesSource = 'more'; renderWizardStep(1);
    const cards = [...document.querySelectorAll('.wiz-card')].map(c => c.textContent);
    check('wizard has an Other books species tab', cards.some(t => t.includes('Yuan-ti Pureblood')), cards.length);
    const yi = SPECIES_DATA.species_more.findIndex(s => s.name === 'Yuan-ti Pureblood');
    wiz_selectSpecies('species_more', yi);
    check('wizard applies fixed species bonuses', wizardData.abilityBonuses.cha === 2 && wizardData.abilityBonuses.int === 1, wizardData.abilityBonuses);
    closeModal();

    // 2024 Knowledge Domain
    ch = mk('Cleric', 3);
    applySubclass(ch.id, 'Cleric', 'Knowledge Domain (2024)'); await wait();
    check('2024 Knowledge Domain features', ch.featuresList.some(f => f._subclass && f.name === 'Mind Magic'), ch.featuresList.filter(f => f._subclass).map(f => f.name));
    applySubclassSpells(ch.id); closeModal();
    const known = ch.spells.known.map(s => typeof s === 'object' ? s.name : s);
    check('2024 Knowledge Domain spells prepared', ['Command', 'Detect Thoughts', 'Mind Spike'].every(n => known.includes(n)), known);
    return out;
  });
  results.forEach(r => console.log(r)); if (errs.length) console.log('PAGE ERRORS', errs);
  const failed = results.filter(r => r.startsWith('FAIL')).length; console.log(`\n${results.length - failed}/${results.length} passed`);
  await b.close(); process.exit(failed || errs.length ? 1 : 0);
})();
