// Browser test for combat requests — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node combat-requests.browser.test.js
// Firestore is replaced by an in-memory store; the player and GM sides share one page and take turns.
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  await pg.evaluate(async () => {
    showToast = () => {}; openStartingProfsModal = () => {}; _showApp();
    window.out = [];
    window.check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + String(JSON.stringify(detail)).slice(0, 300)));
    window.monsters = await (await fetch('./data/monsters.json?v=3')).json();
    window.block = name => _statBlockFromMonster(monsters.find(m => m.name === name)).statBlock;

    // In-memory stand-in for the Firestore request collection
    window.store = {
      docs: {}, n: 0, listeners: [],
      _list(uid) { return Object.entries(this.docs).filter(([, d]) => uid == null || d.uid === uid).map(([id, d]) => ({ id, data: JSON.parse(JSON.stringify(d)) })); },
      _emit() { this.listeners.forEach(l => l.cb(this._list(l.uid))); },
      send(g, c, data) { const id = 'req' + (++this.n); this.docs[id] = { ...data, createdAt: 1000 + this.n }; this._emit(); return Promise.resolve({ id }); },
      remove(g, c, id) { delete this.docs[id]; this._emit(); return Promise.resolve(); },
      claim(g, c, id) { if (!this.docs[id]) return Promise.resolve(false); delete this.docs[id]; this._emit(); return Promise.resolve(true); },
      listenAll(g, c, cb) { const l = { cb, uid: null }; this.listeners.push(l); cb(this._list()); return () => { this.listeners = this.listeners.filter(x => x !== l); }; },
      listenOwn(g, c, uid, cb) { const l = { cb, uid }; this.listeners.push(l); cb(this._list(uid)); return () => { this.listeners = this.listeners.filter(x => x !== l); }; },
    };
    _reqStore = store;
    _syncRequestListener = () => {};   // the GM listener is wired by hand below

    window.setup = () => {
      _stopRequestListener(); store.docs = {}; store.listeners = []; _pvReqs = [];
      db.campaigns = db.campaigns.filter(c => c.id !== 'cR');
      const pc = newCharacter('Thorn', 'Human', 'Fighter', 5); pc.combat.maxHP = 40; pc.combat.currentHP = 40; pc.shareToken = 'tok'; migrateCharacter(pc);
      db.characters[pc.id] = pc;
      const mira = newCharacter('Mira', 'Human', 'Cleric', 5); mira.combat.maxHP = 30; mira.combat.currentHP = 10; migrateCharacter(mira);
      db.characters[mira.id] = mira;
      const mon = (name, init, hp, sb) => ({ id: uid(), name, initiative: init, ac: 13, hp, maxHP: hp, type: 'monster', conditions: [], notes: '', tempHP: 0, statBlock: sb });
      const camp = { id: 'cR', name: 'Requests', characters: [pc.id, mira.id], npcs: [], journal: [], campaignTab: 'initiative',
        initiative: { round: 1, currentIndex: 0, log: [], combatants: [
          mon('Goblin 1', 18, 30, block('Goblin')), mon('Goblin 2', 17, 30, block('Goblin')),
          mon('Fire Elemental', 16, 102, block('Fire Elemental')),
          { id: uid(), charId: pc.id, name: 'Thorn', initiative: 15, ac: 16, hp: 40, maxHP: 40, type: 'player', conditions: [], notes: '', tempHP: 0 },
          { id: uid(), charId: mira.id, name: 'Mira', initiative: 12, ac: 14, hp: 10, maxHP: 30, type: 'player', conditions: [], notes: '', tempHP: 0 },
          mon('Dire Troll', 10, 172, block('Dire Troll')), mon('Dead Rat', 2, 1, null)] } };
      camp.initiative.combatants[6].hp = 0;
      db.campaigns.push(camp); currentCampaignId = 'cR'; currentView = 'campaign'; IS_PLAYER_VIEW = false;
      getInitiative();   // GM assigns the combat id
      _reqCampaign = 'cR'; _reqUnsub = store.listenAll('gm', 'cR', docs => _onCombatRequests('cR', docs));
      renderApp();
      return { camp, pc, mira };
    };
    window.cbId = name => getInitiative().combatants.find(c => c.name === name)?.id;
    window.hp = name => getInitiative().combatants.find(c => c.name === name)?.hp;
    window.asPlayer = (pc) => { IS_PLAYER_VIEW = true; currentCharId = pc.id; currentView = 'campaign'; renderApp(); };
    window.asGM = () => { IS_PLAYER_VIEW = false; currentView = 'campaign'; renderApp(); };
    window.tick = name => document.querySelector(`.req-pick[data-cb="${cbId(name)}"] input[type=checkbox]`);
    window.flush = () => new Promise(r => setTimeout(r, 0));
  });

  // ── Player sends a Fireball through the real form ──
  await pg.evaluate(async () => {
    try {
      const { pc } = setup();
      check('the combat has an id', !!getInitiative().combatId, getInitiative().combatId);
      asPlayer(pc);
      const btn = [...document.querySelectorAll('.req-bar button')].find(b => b.textContent.includes('Send damage'));
      check('player sees the Send damage / heal button', !!btn, document.querySelector('.req-bar')?.outerHTML);
      btn.click();
      check('the send form opens', !!document.getElementById('req-send-btn'), null);
      const defeated = tick('Dead Rat');
      check('defeated monsters cannot be ticked', defeated && defeated.disabled, defeated?.outerHTML);
      const pickText = document.querySelector('.req-pick-list').textContent;
      check('monsters show a health label, not numbers', pickText.includes('Healthy') && !pickText.includes('30/30') && !pickText.includes('102'), pickText);
      check('allies show their HP', pickText.includes('HP 10/30'), pickText);
      // Empty send → error
      document.getElementById('req-send-btn').click(); await flush();
      check('sending with no target explains why', document.querySelector('.req-error')?.textContent.includes('target'), document.querySelector('.req-error')?.textContent);
      // Fill: 28 fire, save for half DEX 15, three targets, note
      const amt = document.querySelector('.req-part-row input'); amt.value = '28'; amt.dispatchEvent(new Event('input'));
      const type = document.querySelector('.req-part-row select'); type.value = 'fire'; type.dispatchEvent(new Event('change'));
      const saveBox = [...document.querySelectorAll('.req-check input')][0]; saveBox.checked = true; saveBox.dispatchEvent(new Event('change'));
      const [onSave, ability] = document.querySelectorAll('.req-save-row select');
      ability.value = 'DEX'; ability.dispatchEvent(new Event('change'));
      const dc = document.querySelector('.req-save-row input'); dc.value = '15'; dc.dispatchEvent(new Event('input'));
      for (const n of ['Goblin 1', 'Goblin 2', 'Fire Elemental']) { const t = tick(n); t.checked = true; t.dispatchEvent(new Event('change')); }
      const note = document.getElementById('req-note'); note.value = 'Fireball'; note.dispatchEvent(new Event('input'));
      document.getElementById('req-send-btn').click(); await flush();
      const docs = Object.values(store.docs);
      check('one request was sent', docs.length === 1, docs);
      const r = docs[0];
      check('the request carries the share token and combat id', r.shareToken === 'tok' && r.combatId === getInitiative().combatId, r);
      check('the request lists three targets with 28 fire each', r.targets.length === 3 && r.targets.every(t => t.parts[0].amount === 28 && t.parts[0].type === 'fire'), r.targets);
      check('the request records the save', r.save && r.save.onSave === 'half' && r.save.ability === 'DEX' && r.save.dc === 15, r.save);
      check('the note is sent', r.note === 'Fireball', r.note);
      // Pending list on the player's side
      _pvReqs = store._list().map(d => ({ id: d.id, ...d.data })); renderApp();
      check('the player sees their request waiting', document.querySelector('.req-pending')?.textContent.includes('Fireball'), document.querySelector('.req-bar')?.textContent);
    } catch (e) { check('player send flow ran', false, e.stack); }
  });

  // ── GM sees the card, ticks saves, applies ──
  await pg.evaluate(async () => {
    try {
      asGM();
      const card = document.querySelector('.req-card');
      check('the GM sees a request card', !!card, document.querySelector('.req-panel')?.outerHTML);
      check('the Combat tab shows the count', document.querySelector('.req-count')?.textContent === '1', null);
      const text = card.textContent;
      check('the card shows the save line', text.includes('DEX save DC 15') && text.includes('half on a success'), text);
      check('the Fire Elemental line says immune', text.includes('immune to fire'), text);
      const amounts = () => [...document.querySelectorAll('.req-card .req-amount')].map(i => +i.value);
      check('amounts start at 28 / 28 / 0', JSON.stringify(amounts()) === '[28,28,0]', amounts());
      // Goblin 2 saves
      const saved = document.querySelectorAll('.req-card .req-saved input')[1];
      saved.checked = true; saved.dispatchEvent(new Event('change'));
      check('ticking Saved halves that target', JSON.stringify(amounts()) === '[28,14,0]', amounts());
      document.querySelector('.req-card .btn-primary').click(); await flush(); await flush();
      check('Goblin 1 took 28', hp('Goblin 1') === 2, hp('Goblin 1'));
      check('Goblin 2 took 14 (saved)', hp('Goblin 2') === 16, hp('Goblin 2'));
      check('the Fire Elemental took nothing', hp('Fire Elemental') === 102, hp('Fire Elemental'));
      check('the request is gone from the store', Object.keys(store.docs).length === 0, store.docs);
      check('the panel is empty again', !document.querySelector('.req-card'), null);
      const last = getInitiative().log.at(-1);
      check('one log line describes it', last.text === 'Thorn (Fireball): Goblin 1 takes 28 fire; Goblin 2 takes 14 fire (saved); Fire Elemental takes 0 fire (immune to fire)', last.text);
      check('the log entry can be undone', !!last.undoId && document.querySelector('.req-last .req-undo'), last);
      // Undo
      document.querySelector('.req-last .req-undo').click();
      check('undo restores HP', hp('Goblin 1') === 30 && hp('Goblin 2') === 30, [hp('Goblin 1'), hp('Goblin 2')]);
      check('undo is logged', getInitiative().log.at(-1).text.startsWith('Undid: Thorn (Fireball)'), getInitiative().log.at(-1).text);
      check('the undo entry is used up', (getInitiative().undo || []).length === 0, getInitiative().undo);
    } catch (e) { check('GM apply flow ran', false, e.stack); }
  });

  // ── Split damage, mixed types, edited amounts, conditional resistance ──
  await pg.evaluate(async () => {
    try {
      const { pc } = setup();
      asPlayer(pc);
      openSendRequestModal();
      _reqDraft.parts = [{ amount: '8', type: 'slashing' }, { amount: '9', type: 'radiant' }];
      reqDraftTarget(cbId('Goblin 1'), true); reqDraftTarget(cbId('Dire Troll'), true);
      reqDraftOwnParts(cbId('Goblin 1'), true);
      check('a target\'s own parts start as a copy', _reqDraft.targets[cbId('Goblin 1')].parts.length === 2, _reqDraft.targets);
      _reqDraft.targets[cbId('Goblin 1')].parts = [{ amount: '5', type: 'slashing' }];
      await sendCombatRequest();
      const r = Object.values(store.docs)[0];
      check('split damage: each target keeps its own parts', JSON.stringify(r.targets.map(t => t.parts.map(p => p.amount))) === '[[5],[8,9]]', r.targets);
      asGM();
      const text = document.querySelector('.req-card').textContent;
      check('the Dire Troll warns about nonmagical slashing', text.includes('Dire Troll resists slashing from nonmagical attacks'), text);
      check('conditional resistance is not applied (8 slashing + 9 radiant = 17)', [...document.querySelectorAll('.req-amount')].map(i => +i.value).join() === '5,17', [...document.querySelectorAll('.req-amount')].map(i => i.value));
      // GM edits the troll's amount to 13
      const box = document.querySelectorAll('.req-amount')[1]; box.value = '13'; box.dispatchEvent(new Event('input'));
      await applyCombatRequest(Object.keys(store.docs)[0] || _reqList[0].id);
      check('the edited amount is applied', hp('Dire Troll') === 159, hp('Dire Troll'));
      check('the log marks it as set by the GM', getInitiative().log.at(-1).text.includes('Dire Troll takes 13 slashing + radiant (set by GM)'), getInitiative().log.at(-1).text);
    } catch (e) { check('split damage flow ran', false, e.stack); }
  });

  // ── Healing, auto-apply, cancel, stale requests, end of combat ──
  await pg.evaluate(async () => {
    try {
      const { pc, mira } = setup();
      asPlayer(pc);
      openSendRequestModal(); reqDraftKind('heal'); _reqDraft.heal = '50'; reqDraftTarget(cbId('Mira'), true);
      await sendCombatRequest();
      asGM();
      check('a heal card says heals', document.querySelector('.req-card').textContent.includes('heals'), document.querySelector('.req-card').textContent);
      await applyCombatRequest(_reqList[0].id);
      check('healing stops at max HP', mira.combat.currentHP === 30, mira.combat.currentHP);
      check('heal log line', getInitiative().log.at(-1).text === 'Thorn: Mira heals 50', getInitiative().log.at(-1).text);

      // Auto-apply: plain hits go straight in, save effects wait
      document.getElementById('req-auto-toggle').click(); await flush();
      check('auto-apply is on for this fight', getInitiative().autoApply === true, getInitiative().autoApply);
      asPlayer(pc);
      openSendRequestModal(); _reqDraft.parts = [{ amount: '6', type: 'piercing' }]; reqDraftTarget(cbId('Goblin 1'), true);
      await sendCombatRequest(); await flush(); await flush();
      check('a plain hit applies itself', hp('Goblin 1') === 24, hp('Goblin 1'));
      openSendRequestModal(); _reqDraft.parts = [{ amount: '10', type: 'fire' }]; _reqDraft.isSave = true; reqDraftTarget(cbId('Goblin 2'), true);
      await sendCombatRequest(); await flush(); await flush();
      check('a save effect waits for the GM', hp('Goblin 2') === 30 && _reqList.length === 1, [hp('Goblin 2'), _reqList.length]);

      // Player cancels it
      _pvReqs = store._list().map(d => ({ id: d.id, ...d.data })); renderApp();
      document.querySelector('.req-pending .btn-link').click(); await flush();
      check('cancel removes the request', Object.keys(store.docs).length === 0 && _reqList.length === 0, store.docs);

      // A request from an earlier fight is thrown away
      IS_PLAYER_VIEW = false;
      await store.send('gm', 'cR', { uid: 'u', charId: pc.id, shareToken: 'tok', combatId: 'old-fight', fromCompanionId: '', fromName: 'Thorn',
        kind: 'damage', note: '', save: null, targets: [{ cbId: cbId('Goblin 1'), parts: [{ amount: 5, type: 'fire' }] }] });
      await flush();
      check('a request from another fight is deleted, not applied', Object.keys(store.docs).length === 0 && hp('Goblin 1') === 24, [store.docs, hp('Goblin 1')]);
      // A request for a character outside the campaign is thrown away
      await store.send('gm', 'cR', { uid: 'u', charId: 'stranger', shareToken: 'x', combatId: getInitiative().combatId, fromName: 'X',
        kind: 'damage', note: '', save: null, targets: [{ cbId: cbId('Goblin 1'), parts: [{ amount: 5, type: 'fire' }] }] });
      await flush();
      check('a request from outside the campaign is deleted', Object.keys(store.docs).length === 0 && hp('Goblin 1') === 24, store.docs);
      // Hostile text is escaped on the card
      document.getElementById('req-auto-toggle').click(); await flush();
      await store.send('gm', 'cR', { uid: 'u', charId: pc.id, shareToken: 'tok', combatId: getInitiative().combatId, fromCompanionId: '',
        fromName: '<img src=x onerror="window.pwned=1">', kind: 'damage', note: '<b>bold</b>', save: null,
        targets: [{ cbId: cbId('Goblin 1'), parts: [{ amount: 5, type: 'fire' }] }] });
      asGM(); await flush();
      check('player text is escaped on the card', !document.querySelector('.req-card img') && !document.querySelector('.req-card b') && !window.pwned, document.querySelector('.req-card')?.innerHTML);

      // A request whose id could break out of the card's buttons is thrown away
      store.docs["x');window.pwned2=1;('"] = { uid: 'u', charId: pc.id, shareToken: 'tok', combatId: getInitiative().combatId, fromCompanionId: '', fromName: 'T',
        kind: 'damage', note: '', save: null, targets: [{ cbId: cbId('Goblin 2'), parts: [{ amount: 5, type: 'fire' }] }], createdAt: 1 };
      store._emit(); await flush();
      check('a request with an odd id is deleted', !Object.keys(store.docs).some(k => k.includes('pwned2')) && !_reqList.some(r => r.id.includes('pwned2')), Object.keys(store.docs));
      // Undo when a row has left the fight
      await applyCombatRequest(_reqList[0].id);
      const undoId = getInitiative().undo[0].id;
      const gi = getInitiative().combatants.findIndex(c => c.name === 'Goblin 1'); getInitiative().combatants.splice(gi, 1);
      undoCombatRequest(undoId);
      check('undo skips a row that is gone and says so', getInitiative().log.at(-1).text.includes('Goblin 1 was gone, not restored'), getInitiative().log.at(-1).text);

      // End of combat clears waiting requests and auto-apply
      document.getElementById('req-auto-toggle').click(); await flush();
      document.getElementById('req-auto-toggle').click(); await flush();
      await store.send('gm', 'cR', { uid: 'u', charId: pc.id, shareToken: 'tok', combatId: getInitiative().combatId, fromCompanionId: '', fromName: 'Thorn',
        kind: 'damage', note: '', save: { onSave: 'half', ability: '', dc: 0 }, targets: [{ cbId: cbId('Goblin 2'), parts: [{ amount: 5, type: 'fire' }] }] });
      await flush();
      check('a waiting request before End Combat', _reqList.length === 1, _reqList.length);
      clearInitiative(); document.querySelector('#modal-content .btn-danger')?.click(); await flush();
      check('End Combat deletes waiting requests', Object.keys(store.docs).length === 0 && _reqList.length === 0, store.docs);
      check('End Combat resets auto-apply and undo', !getInitiative().autoApply && !(getInitiative().undo || []).length && !getInitiative().combatId, getInitiative());
    } catch (e) { check('heal/auto/cancel flow ran', false, e.stack); }
  });

  const out = await pg.evaluate(() => out);
  out.forEach(l => console.log(l));
  if (errs.length) console.log('PAGE ERRORS:\n' + errs.join('\n'));
  const failed = out.filter(l => l.startsWith('FAIL')).length + errs.length;
  console.log(`\n${out.length - failed} passed, ${failed} failed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
