// Browser test for the NPCs tab — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node npc.browser.test.js
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  await pg.evaluate(async () => {
    showToast = () => {}; _showApp();
    window.out = [];
    window.check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    window.monsters = await (await fetch('./data/monsters.json?v=3')).json();
    window.setup = () => {
      db.campaigns = db.campaigns.filter(c => c.id !== 'cN');
      db.campaigns.push({ id: 'cN', name: 'Lost Mine', characters: [], npcs: [], journal: [], campaignTab: 'npcs', initiative: { round: 1, currentIndex: 0, log: [], combatants: [] } });
      currentCampaignId = 'cN'; currentView = 'campaign'; IS_PLAYER_VIEW = false; renderApp();
    };
    window.mk = (name, race = 'Human', role = 'Knight', loc = 'Phandalin', disp = 'Friendly') => {
      openNewNpcModal(); document.getElementById('npc-name').value = name; document.getElementById('npc-race').value = race;
      document.getElementById('npc-role').value = role; document.getElementById('npc-location').value = loc; document.getElementById('npc-disposition').value = disp; createNpc();
      return db.npcs[db.campaigns.find(c => c.id === 'cN').npcs.at(-1)];
    };
    window.quickAdd = id => { quickAddCombatant(id, 'npc'); _confirmQuickAdd(); return getInitiative().combatants; };
    window.cards = () => [...document.querySelectorAll('#npc-grid .card')].map(c => c.querySelector('.card-title')?.textContent.trim());
    window.sheetNumbers = () => Object.fromEntries([...document.querySelectorAll('.npc-combat-stats input[type=number]')].map(i => [i.dataset.field, i.value]));
  });

  await pg.evaluate(async () => {
    // 1. 0 HP / 0 AC are shown as 0, not 10
    setup(); let n = mk('Sildar'); n.hp = 0; n.ac = 0; showNpc(n.id);
    check('an NPC at 0 HP and 0 AC shows 0', sheetNumbers().hp === '0' && sheetNumbers().ac === '0', sheetNumbers());

    // 2. quick-adding a 0-HP NPC keeps 0 HP
    setup(); n = mk('Sildar'); n.hp = 0; n.maxHP = 27; currentView = 'campaign';
    let cbs = quickAdd(n.id);
    check('a 0-HP NPC joins combat at 0 HP', cbs[0].hp === 0, cbs[0].hp);

    // Idea 2: NPCs are linked to combat
    setup(); n = mk('Bandit Captain', 'Human', 'Villain', 'Cragmaw', 'Hostile'); n.hp = 52; n.maxHP = 52; currentView = 'campaign';
    quickAdd(n.id); damageCombatant(0, 20);
    check('combat damage updates the NPC\'s page', n.hp === 32, n.hp);
    healCombatant(0, 5);
    check('combat healing updates the NPC\'s page', n.hp === 37, n.hp);
    setCombatantTempHP(0, 6); damageCombatant(0, 4);
    check('temp HP soaks damage and is kept on the NPC', n.tempHP === 2 && n.hp === 37, { hp: n.hp, temp: n.tempHP });
    n.hp = 10; n.ac = 17; showCampaign('cN', 'initiative');
    const row = document.querySelector('.initiative-row');
    check('HP and AC changed on the NPC\'s page show in combat', row.querySelector('.hp-input').value === '10' && row.querySelector('.init-stats strong').textContent === '17', row.textContent.replace(/\s+/g, ' ').slice(0, 100));
    updateCombatantHP(0, 4);
    check('typing HP in combat updates the NPC', n.hp === 4, n.hp);

    // 4. repeated NPCs are numbered; only the first is linked
    setup(); n = mk('Guard', 'Human', 'Guard', 'Gate', 'Neutral'); n.hp = 11; n.maxHP = 11; currentView = 'campaign';
    quickAdd(n.id); cbs = quickAdd(n.id);
    check('a repeated NPC is numbered', JSON.stringify(cbs.map(c => c.name).sort()) === '["Guard","Guard 2"]', cbs.map(c => c.name));
    const g2 = cbs.findIndex(c => c.name === 'Guard 2'); damageCombatant(g2, 5);
    check('extra copies have their own HP', n.hp === 11 && getInitiative().combatants[g2]?.hp === 6, { npc: n.hp, copy: getInitiative().combatants[g2]?.hp });

    // 5. initiative bonus
    setup(); n = mk('Scout'); n.initBonus = 3; currentView = 'campaign';
    let rnd = Math.random; Math.random = () => 0.5; quickAddCombatant(n.id, 'npc'); let qa = document.getElementById('qa-init').value; closeModal(); Math.random = rnd;
    check('an NPC\'s initiative bonus is added (10 + 3)', qa === '13', qa);

    // 6. no doubled bullets in the header
    setup(); n = mk('Mysterious Stranger', '', '', '', 'Unknown'); showNpc(n.id);
    const sub = document.querySelector('.section-header .text-dim')?.textContent.trim();
    check('blank fields leave no doubled or dangling bullets', !/•\s*•|^•|•$/.test(sub), sub);

    // 7. unnamed NPCs get a readable name in combat
    setup(); n = mk('', '', '', '', 'Neutral'); currentView = 'campaign'; openAddCombatantModal();
    const btn = [...document.querySelectorAll('#modal-overlay button')].find(b => (b.getAttribute('onclick') || '').includes("'npc'"));
    check('an unnamed NPC reads "Unnamed NPC" in quick add', btn?.textContent.trim() === 'Unnamed NPC', btn?.textContent);
    closeModal(); cbs = quickAdd(n.id);
    check('…and in combat', cbs[0].name === 'Unnamed NPC', cbs[0].name);

    // 8 & 9. readable disposition tags; long roles don't crowd the name
    setup(); ['Friendly', 'Neutral', 'Hostile', 'Unknown'].forEach(d => mk(d + ' NPC', 'Elf', "Knight of the Lords' Alliance", 'Phandalin', d)); showCampaign('cN', 'npcs');
    const rgb = c => (c.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
    const lum = c => { const [r, g, bb] = rgb(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * bb; };
    const cr = (a, bb) => { const [x, y] = [lum(a), lum(bb)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    const low = [...document.querySelectorAll('#npc-grid .npc-disposition')].map(t => { const cs = getComputedStyle(t); return [t.textContent, cr(cs.color, cs.backgroundColor)]; }).filter(([, c]) => c < 4.5);
    check('disposition tags are readable (4.5:1)', low.length === 0 && document.querySelectorAll('#npc-grid .npc-disposition').length === 4, low);
    check('the role sits under the name instead of crowding it', ![...document.querySelectorAll('#npc-grid .card .badge')].length && /Knight of the Lords/.test(document.querySelector('#npc-grid .card-sub')?.textContent || ''), null);

    // Idea 3: search, filter and group
    try {
    setup(); mk('Sildar Hallwinter', 'Human', 'Knight', 'Phandalin', 'Friendly'); mk('Glasstaff', 'Human', 'Wizard', 'Tresendar Manor', 'Hostile');
    mk('Halia Thornton', 'Human', 'Guildmaster', 'Phandalin', 'Neutral'); mk('Reidoth', 'Human', 'Druid', 'Thundertree', 'Unknown'); showCampaign('cN', 'npcs');
    const search = document.getElementById('npc-search'); search.focus(); search.value = 'phand'; search.dispatchEvent(new Event('input'));
    check('search matches name, role or location', JSON.stringify(cards()) === '["Sildar Hallwinter","Halia Thornton"]', cards());
    check('…and keeps focus in the search box', document.activeElement === search, document.activeElement?.id);
    search.value = ''; search.dispatchEvent(new Event('input'));
    setNpcDispositionFilter('Hostile');
    check('disposition filter', JSON.stringify(cards()) === '["Glasstaff"]', cards());
    setNpcDispositionFilter('');
    setNpcGroupBy('location');
    const heads = [...document.querySelectorAll('#npc-grid .npc-group-heading')].map(h => h.textContent.trim().replace(/\s+\d+$/, ''));
    check('group by location', JSON.stringify(heads) === '["Phandalin","Thundertree","Tresendar Manor"]', heads);
    setNpcGroupBy('');
    } catch (e) { check('search / filter / group run', false, e.message); }

    // Idea 1: stat blocks
    try {
    setup(); n = mk('Sildar Hallwinter'); showNpc(n.id);
    await openNpcStatBlockPicker(n.id);
    await loadMonsterStat(monsterCache.find(m => m.name === 'Bandit Captain').i);
    const useBtn = [...document.querySelectorAll('#modal-overlay button')].find(b => /Use for Sildar/.test(b.textContent));
    check('the monster search offers "Use for <NPC>"', !!useBtn, [...document.querySelectorAll('#modal-overlay button')].map(b => b.textContent.trim()));
    useBtn?.click();
    check('choosing a stat block fills AC and HP', n.ac === 15 && n.maxHP === 52 && n.hp === 52, { ac: n.ac, maxHP: n.maxHP, hp: n.hp });
    check('the NPC page shows the stat block', /Actions/.test(document.querySelector('.npc-stat-block')?.textContent || '') && /Bandit Captain/.test(document.querySelector('.npc-stat-block')?.textContent || ''), document.querySelector('.npc-stat-block')?.textContent.slice(0, 120));
    currentView = 'campaign'; rnd = Math.random; Math.random = () => 0.5; quickAddCombatant(n.id, 'npc'); qa = document.getElementById('qa-init').value; _confirmQuickAdd(); Math.random = rnd;
    check('stat block DEX sets initiative (10 + 3)', qa === '13', qa);
    const cb = getInitiative().combatants[0];
    check('the NPC brings its stat block into combat', !!cb.statBlock && cb.statBlock.actions.length > 0, cb.statBlock && Object.keys(cb.statBlock));
    showNpc(n.id); removeNpcStatBlock(n.id);
    check('removing the stat block keeps AC and HP', !n.statBlock && n.ac === 15 && n.maxHP === 52, { sb: !!n.statBlock, ac: n.ac });
    } catch (e) { check('stat blocks run', false, e.message); }
  });

  const out = await pg.evaluate(() => out);
  out.forEach(l => console.log(l));
  if (errs.length) console.log('PAGE ERRORS:', errs);
  const failed = out.filter(l => l.startsWith('FAIL')).length + (errs.length ? 1 : 0);
  console.log(`\n${out.length - out.filter(l => l.startsWith('FAIL')).length}/${out.length} passed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
