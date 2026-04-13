// ── Data Layer ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'dnd_tracker_v1';

function migrateCharacter(ch) {
  if (ch.inspiration === undefined) ch.inspiration = false;
  if (!ch.languages)      ch.languages = '';
  if (!ch.proficiencies)  ch.proficiencies = '';
  if (ch.attunedItems === undefined) ch.attunedItems = [];
  if (ch.activeConcentration === undefined) ch.activeConcentration = null;
  if (ch.exhaustionLevel === undefined) ch.exhaustionLevel = 0;
  if (ch.portraitZoom === undefined) ch.portraitZoom = 100;
  if (ch.portraitX    === undefined) ch.portraitX    = 50;
  if (ch.portraitY    === undefined) ch.portraitY    = 50;
  // Ensure equipment is always an array of strings or valid objects
  if (!ch.equipment) ch.equipment = [];
  ch.equipment = ch.equipment.map(e => (e === null || e === undefined) ? '' : e).filter(Boolean);
  if (!ch.knownLanguages) {
    const raw = (ch.languages || '').trim();
    const looksLikeList = raw && raw.split(',').length > 1;
    ch.knownLanguages = looksLikeList
      ? raw.split(',').map(s => s.trim()).filter(Boolean)
      : ['Common'];
  }
  if (!ch.currency)       ch.currency = { cp:0, sp:0, ep:0, gp:0, pp:0 };
  if (!ch.attacks)        ch.attacks = [];
  if (!ch.skillExpertise) ch.skillExpertise = [];
  if (!ch.sessionLog)    ch.sessionLog = [];
  // v2 fields
  if (!ch.subclass)       ch.subclass = '';
  if (!ch.traits)         ch.traits = '';
  if (!ch.spells)         ch.spells = {};
  if (!ch.spells.slots)    ch.spells.slots    = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  if (!ch.spells.slotsMax) ch.spells.slotsMax = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  if (!ch.spells.known)    ch.spells.known    = [];
  if (!ch.spells.prepared) ch.spells.prepared = [];
  if (ch.spells.pactSlots     === undefined) ch.spells.pactSlots     = 0;
  if (ch.spells.pactSlotsMax  === undefined) ch.spells.pactSlotsMax  = 0;
  if (ch.spells.pactSlotLevel === undefined) ch.spells.pactSlotLevel = 0;
  if (!ch.combat)          ch.combat = {ac:10,initiative:0,speed:30,maxHP:10,currentHP:10,tempHP:0,hitDice:'1d8',hitDiceUsed:0};
  if (ch.combat.hitDiceUsed === undefined) ch.combat.hitDiceUsed = 0;
  if (!ch.featuresList)    ch.featuresList = [];
  if (ch.carryWeight === undefined) ch.carryWeight = 0;
  if (ch.resistances        === undefined) ch.resistances        = '';
  if (ch.vulnerabilities    === undefined) ch.vulnerabilities    = '';
  if (ch.damageImmunities   === undefined) ch.damageImmunities   = '';
  if (ch.conditionImmunities=== undefined) ch.conditionImmunities= '';
  if (ch.otherSenses        === undefined) ch.otherSenses        = '';
  if (!ch.deathSaves)      ch.deathSaves = {successes:0,failures:0};
  if (!ch.saveProficiencies)  ch.saveProficiencies = [];
  if (!ch.resources)       ch.resources = [];
  ch.resources.forEach(r => {
    if (r.type === undefined) r.type = (r.maxFormula === 'level_x5' || r.name.includes('Hands') || r.name.includes('Pool')) ? 'pool' : 'pips';
    if (r.custom === undefined) r.custom = !r._subclass;
    if (r.source === undefined) r.source = r._subclass || '';
    if (r.desc === undefined) r.desc = '';
  });
  if (!ch.skillProficiencies) ch.skillProficiencies = [];
  // v3: multiclass support
  if (!ch.classes) {
    ch.classes = [{ class: ch.class || 'Fighter', subclass: ch.subclass || '', level: ch.level || 1 }];
  }
  // v4: auto-calculate spell slots on first migration
  if (!ch.spells._autoCalcApplied && typeof calculateSpellSlots === 'function') {
    applySpellSlots(ch);
    // Remove old Pact Magic Slots resource (now handled by pact magic fields)
    ch.resources = (ch.resources || []).filter(r => r.name !== 'Pact Magic Slots');
    ch.spells._autoCalcApplied = true;
  }
  // Inject base class resources inline (deduplicates by name)
  _injectBaseClassResourcesForCh(ch);
  return ch;
}

function loadData() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!raw) return { campaigns: [], characters: {}, npcs: {} };
    if (!raw.npcs) raw.npcs = {};
    raw.campaigns.forEach(c => {
      if (!c.npcs) c.npcs = [];
      if (!c.initiative) c.initiative = null;
      if (!c.campaignTab) c.campaignTab = 'characters';
      if (c.activeCharId === undefined) c.activeCharId = (c.characters||[])[0] || null;
      if (!c.journal) c.journal = [];
    });
    Object.values(raw.characters).forEach(ch => migrateCharacter(ch));
    return raw;
  } catch { return { campaigns: [], characters: {}, npcs: {} }; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── State ──────────────────────────────────────────────────────────────────────
let db = loadData();
let currentView = 'campaigns';
let currentCampaignId = null;
let currentCharId = null;
let currentNpcId = null;
let currentTab = 'core'; // still used by campaign tabs
let monsterCache = null;
let charPanelOpen = false;
let wizardData = {};

// ── Routing & Breadcrumb ───────────────────────────────────────────────────────
function showCampaigns() {
  currentView = 'campaigns'; currentCampaignId = null; currentCharId = null; currentNpcId = null;
  renderBreadcrumb(); renderApp();
}
function showCampaign(id, tab) {
  currentView = 'campaign'; currentCampaignId = id; currentCharId = null; currentNpcId = null;
  if (tab) { const c = db.campaigns.find(c => c.id === id); if (c) c.campaignTab = tab; }
  renderBreadcrumb(); renderApp();
}
function showCharacter(id) {
  currentView = 'character'; currentCharId = id;
  CharacterStore.setActive(id);
  renderBreadcrumb(); renderApp();
}
function showNpc(id) {
  currentView = 'npc'; currentNpcId = id;
  renderBreadcrumb(); renderApp();
}

function renderBreadcrumb() {
  const el = document.getElementById('breadcrumb');
  const parts = [];
  if (currentView !== 'campaigns') parts.push(`<span class="crumb" onclick="showCampaigns()">Campaigns</span>`);
  if (['campaign','character','npc'].includes(currentView)) {
    const c = db.campaigns.find(c => c.id === currentCampaignId);
    if (c) {
      parts.push(`<span class="sep">❧</span>`);
      if (currentView !== 'campaign') parts.push(`<span class="crumb" onclick="showCampaign('${currentCampaignId}')">${esc(c.name)}</span>`);
      else parts.push(`<span>${esc(c.name)}</span>`);
    }
  }
  if (currentView === 'character') { const ch = db.characters[currentCharId]; if (ch) parts.push(`<span class="sep">❧</span><span>${esc(ch.name||'Unnamed')}</span>`); }
  if (currentView === 'npc') { const npc = db.npcs[currentNpcId]; if (npc) parts.push(`<span class="sep">❧</span><span>${esc(npc.name||'NPC')}</span>`); }
  el.innerHTML = parts.join('');
}

// ── Main Render ───────────────────────────────────────────────────────────────
function renderApp() {
  const scrollY = window.scrollY;
  const app = document.getElementById('app');
  if      (currentView === 'campaigns')  app.innerHTML = renderCampaignList();
  else if (currentView === 'campaign')   app.innerHTML = renderCampaignDetail();
  else if (currentView === 'character')  app.innerHTML = renderCharacterSheet();
  else if (currentView === 'npc')        app.innerHTML = renderNpcSheet();
  if (currentView === 'character') {
    window.scrollTo(0, scrollY);
    // Populate spell tab after DOM is ready
    setTimeout(() => renderSpellTabContent(), 0);
  }
  renderCharSelector();
}

// ── Campaign List ─────────────────────────────────────────────────────────────
function renderCampaignList() {
  return `
    <div class="section-header">
      <h2>Campaigns</h2>
      <button class="btn btn-primary" onclick="openNewCampaignModal()">+ New Campaign</button>
    </div>
    ${db.campaigns.length === 0 ? `<div class="empty"><div class="empty-icon">&#9876;</div><p>No campaigns yet. Create one to get started!</p></div>` : `
    <div class="card-grid">
      ${db.campaigns.map(c => {
        const charCount = (c.characters||[]).length, npcCount = (c.npcs||[]).length;
        return `<div class="card" onclick="showCampaign('${c.id}')">
          <div class="badge">${charCount} PC${charCount!==1?'s':''} &bull; ${npcCount} NPC${npcCount!==1?'s':''}</div>
          <div class="card-title">${esc(c.name)}</div>
          ${c.description?`<div class="card-sub">${esc(c.description)}</div>`:''}
          <div class="card-actions" onclick="event.stopPropagation()">
            <button class="btn btn-sm" onclick="openEditCampaignModal('${c.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCampaign('${c.id}')">Delete</button>
          </div>
        </div>`;
      }).join('')}
    </div>`}`;
}

function openNewCampaignModal() {
  openModal(`<h2>New Campaign</h2>
    <div class="form-group"><label>Campaign Name</label><input type="text" id="camp-name" placeholder="The Lost Mine of Phandelver"></div>
    <div class="form-group"><label>Description (optional)</label><input type="text" id="camp-desc" placeholder="A brief description..."></div>
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="createCampaign()">Create</button></div>`);
  document.getElementById('camp-name').focus();
}
function openEditCampaignModal(id) {
  const c = db.campaigns.find(c => c.id === id); if (!c) return;
  openModal(`<h2>Edit Campaign</h2>
    <div class="form-group"><label>Campaign Name</label><input type="text" id="camp-name" value="${esc(c.name)}"></div>
    <div class="form-group"><label>Description</label><input type="text" id="camp-desc" value="${esc(c.description||'')}"></div>
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="updateCampaign('${id}')">Save</button></div>`);
}
function createCampaign() {
  const name = document.getElementById('camp-name').value.trim();
  if (!name) { alert('Please enter a campaign name.'); return; }
  db.campaigns.push({ id:uid(), name, description:document.getElementById('camp-desc').value.trim(), characters:[], npcs:[], initiative:null, campaignTab:'characters', activeCharId:null, journal:[], createdAt:Date.now() });
  saveData(db); closeModal(); renderApp();
}
function updateCampaign(id) {
  const name = document.getElementById('camp-name').value.trim();
  if (!name) { alert('Please enter a campaign name.'); return; }
  const c = db.campaigns.find(c => c.id === id);
  c.name = name; c.description = document.getElementById('camp-desc').value.trim();
  saveData(db); closeModal(); renderApp();
}
function deleteCampaign(id) {
  if (!confirm('Delete this campaign and all its characters & NPCs?')) return;
  const c = db.campaigns.find(c => c.id === id);
  if (c) { (c.characters||[]).forEach(cid => delete db.characters[cid]); (c.npcs||[]).forEach(nid => delete db.npcs[nid]); }
  db.campaigns = db.campaigns.filter(c => c.id !== id);
  saveData(db); renderApp();
}

// ── Campaign Detail ───────────────────────────────────────────────────────────
function renderCampaignDetail() {
  const campaign = db.campaigns.find(c => c.id === currentCampaignId);
  if (!campaign) return '<p>Campaign not found.</p>';
  const tab = campaign.campaignTab || 'characters';
  return `
    <div class="section-header">
      <h2>${esc(campaign.name)}</h2>
      <div class="flex gap-1 flex-wrap">
        ${tab==='characters'?`<button class="btn btn-primary" onclick="openNewCharModal()">+ Add Character</button>`:''}
        ${tab==='npcs'?`<button class="btn btn-primary" onclick="openNewNpcModal()">+ Add NPC</button>`:''}
        ${tab==='initiative'?`<button class="btn btn-primary" onclick="openAddCombatantModal()">+ Add Combatant</button><button class="btn btn-sm" onclick="nextTurn()">Next Turn &#8594;</button><button class="btn btn-sm btn-danger" onclick="clearInitiative()">End Combat</button>`:''}
        ${tab==='journal'?`<button class="btn btn-primary" onclick="addJournalEntry()">+ New Entry</button>`:''}
        <button class="btn btn-sm" onclick="openMagicItemRandomizer()">🎲 Magic Items</button>
      </div>
    </div>
    ${campaign.description?`<p class="text-dim" style="margin-bottom:1rem">${esc(campaign.description)}</p>`:''}
    <div class="tabs">
      <div class="tab ${tab==='characters'?'active':''}" onclick="showCampaign('${campaign.id}','characters')">Characters</div>
      <div class="tab ${tab==='npcs'?'active':''}" onclick="showCampaign('${campaign.id}','npcs')">NPCs</div>
      <div class="tab ${tab==='initiative'?'active':''}" onclick="showCampaign('${campaign.id}','initiative')">&#9876; Initiative</div>
      <div class="tab ${tab==='journal'?'active':''}" onclick="showCampaign('${campaign.id}','journal')">📖 Journal ${(campaign.journal||[]).length>0?`<span class="spell-count">${(campaign.journal||[]).length}</span>`:''}</div>
    </div>
    ${tab==='characters' ? renderCharacterCards(campaign) : ''}
    ${tab==='npcs'       ? renderNpcCards(campaign) : ''}
    ${tab==='initiative' ? renderInitiativeTracker(campaign) : ''}
    ${tab==='journal'    ? renderJournalTab(campaign) : ''}`;
}

// ── Characters Tab ────────────────────────────────────────────────────────────
function renderCharacterCards(campaign) {
  const chars = (campaign.characters||[]).map(id => db.characters[id]).filter(Boolean);
  if (chars.length === 0) return `<div class="empty"><div class="empty-icon">&#9876;</div><p>No characters yet.</p></div>`;
  return `<div class="card-grid">${chars.map(ch => {
    const pct = ch.combat.maxHP>0?Math.round((ch.combat.currentHP/ch.combat.maxHP)*100):100;
    return `<div class="card" onclick="showCharacter('${ch.id}')">
      <div class="card-title">${esc(ch.name||'Unnamed')}</div>
      <div class="card-sub">Level ${ch.level} ${esc(ch.race)} ${formatClassLine(ch)}</div>
      <div style="margin-top:0.6rem;font-size:0.8rem;color:var(--text-dim)">HP ${ch.combat.currentHP}/${ch.combat.maxHP}</div>
      <div class="hp-bar-wrap"><div class="hp-bar ${pct<=25?'low':pct<=50?'mid':''}" style="width:${pct}%"></div></div>
      <div class="card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm" onclick="showCharacter('${ch.id}')">Open</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCharacter('${ch.id}')">Delete</button>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function openNewCharModal() { openCharWizard(); }
function createCharacter() {
  const name = document.getElementById('ch-name').value.trim();
  const level = parseInt(document.getElementById('ch-level').value)||1;
  const ch = newCharacter(name, document.getElementById('ch-race').value.trim(), document.getElementById('ch-class').value, level);
  db.characters[ch.id] = ch;
  injectBaseClassResources(ch.id);
  applySpellSlots(ch);
  const campaign = db.campaigns.find(c => c.id === currentCampaignId);
  (campaign.characters = campaign.characters||[]).push(ch.id);
  saveData(db); closeModal(); renderApp();
}
function deleteCharacter(id) {
  if (!confirm('Delete this character?')) return;
  delete db.characters[id];
  const c = db.campaigns.find(c => c.id === currentCampaignId);
  if (c) {
    c.characters = c.characters.filter(cid => cid !== id);
    if (c.activeCharId === id) c.activeCharId = c.characters[0] || null;
  }
  saveData(db); renderApp();
}

// ── NPC Manager ───────────────────────────────────────────────────────────────
function renderNpcCards(campaign) {
  const npcs = (campaign.npcs||[]).map(id => db.npcs[id]).filter(Boolean);
  if (npcs.length === 0) return `<div class="empty"><div class="empty-icon">&#128100;</div><p>No NPCs yet.</p></div>`;
  return `<div class="card-grid">${npcs.map(npc => `
    <div class="card" onclick="showNpc('${npc.id}')">
      <div class="badge">${esc(npc.role||'NPC')}</div>
      <div class="card-title">${esc(npc.name||'Unnamed')}</div>
      <div class="card-sub">${esc(npc.race||'')}${npc.location?' &bull; '+esc(npc.location):''}</div>
      ${npc.disposition?`<div class="mt-1"><span class="condition-tag" style="background:${dispositionColor(npc.disposition)}">${esc(npc.disposition)}</span></div>`:''}
      <div class="card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm" onclick="showNpc('${npc.id}')">Open</button>
        <button class="btn btn-sm btn-danger" onclick="deleteNpc('${npc.id}')">Delete</button>
      </div>
    </div>`).join('')}</div>`;
}
function dispositionColor(d) { return ({Friendly:'#2d5a2d',Neutral:'#4a3d1a',Hostile:'#5a1a1a',Unknown:'#1a2d4a'})[d]||'#2c1f0e'; }
function openNewNpcModal() {
  openModal(`<h2>Add NPC</h2>
    <div class="form-row">
      <div class="form-group"><label>Name</label><input type="text" id="npc-name" placeholder="Gundren Rockseeker"></div>
      <div class="form-group"><label>Race</label><input type="text" id="npc-race" placeholder="Dwarf"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Role / Occupation</label><input type="text" id="npc-role" placeholder="Quest Giver, Merchant..."></div>
      <div class="form-group"><label>Location</label><input type="text" id="npc-location" placeholder="Phandalin"></div>
    </div>
    <div class="form-group"><label>Disposition</label>
      <select id="npc-disposition"><option>Friendly</option><option>Neutral</option><option>Hostile</option><option>Unknown</option></select>
    </div>
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="createNpc()">Create</button></div>`);
  document.getElementById('npc-name').focus();
}
function createNpc() {
  const npc = { id:uid(), campaignId:currentCampaignId, name:document.getElementById('npc-name').value.trim(), race:document.getElementById('npc-race').value.trim(), role:document.getElementById('npc-role').value.trim(), location:document.getElementById('npc-location').value.trim(), disposition:document.getElementById('npc-disposition').value, ac:10, hp:10, maxHP:10, personality:'', secrets:'', goals:'', relationships:'', notes:'', createdAt:Date.now() };
  db.npcs[npc.id] = npc;
  const c = db.campaigns.find(c => c.id === currentCampaignId);
  (c.npcs = c.npcs||[]).push(npc.id);
  saveData(db); closeModal(); renderApp();
}
function deleteNpc(id) {
  if (!confirm('Delete this NPC?')) return;
  delete db.npcs[id];
  const c = db.campaigns.find(c => c.id === currentCampaignId);
  if (c) c.npcs = c.npcs.filter(nid => nid !== id);
  saveData(db); renderApp();
}

// ── Session Journal ───────────────────────────────────────────────────────────
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function addJournalEntry() {
  const c = db.campaigns.find(c => c.id === currentCampaignId);
  if (!c) return;
  c.journal = c.journal || [];
  const entry = { id: uid(), date: todayISO(), title: '', body: '', createdAt: Date.now() };
  c.journal.unshift(entry);
  saveData(db); renderApp();
  // Scroll to first entry
  setTimeout(() => document.getElementById(`jentry-${entry.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

function updateJournalEntry(campaignId, entryId, field, value) {
  const c = db.campaigns.find(c => c.id === campaignId);
  if (!c) return;
  const entry = (c.journal||[]).find(e => e.id === entryId);
  if (entry) { entry[field] = value; saveData(db); }
}

function deleteJournalEntry(campaignId, entryId) {
  if (!confirm('Delete this journal entry?')) return;
  const c = db.campaigns.find(c => c.id === campaignId);
  if (!c) return;
  c.journal = (c.journal||[]).filter(e => e.id !== entryId);
  saveData(db); renderApp();
}

function toggleJournalEntry(id) {
  const body = document.getElementById(`jbody-${id}`);
  const chevron = document.getElementById(`jchev-${id}`);
  if (!body) return;
  const collapsed = body.style.display === 'none';
  body.style.display = collapsed ? '' : 'none';
  if (chevron) chevron.textContent = collapsed ? '▴' : '▾';
}

function renderJournalTab(campaign) {
  const entries = [...(campaign.journal||[])].sort((a,b) => b.createdAt - a.createdAt);
  if (entries.length === 0) {
    return `<div class="empty"><div class="empty-icon">📖</div><p>No journal entries yet.<br><button class="btn btn-primary" style="margin-top:0.6rem" onclick="addJournalEntry()">+ New Entry</button></p></div>`;
  }
  return `<div class="journal-list">${entries.map((entry, i) => {
    const isNewest = i === 0;
    const cid = esc(campaign.id);
    const eid = esc(entry.id);
    const displayDate = entry.date ? entry.date.replace(/-/g,'/') : '—';
    return `<div class="sheet-panel journal-entry" id="jentry-${eid}" style="margin-bottom:0.75rem;padding:0.6rem 0.75rem 0.6rem 1rem">
      <div class="journal-header" onclick="toggleJournalEntry('${eid}')" style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;user-select:none">
        <input type="date" class="journal-date-input" value="${esc(entry.date||'')}"
          onclick="event.stopPropagation()"
          oninput="updateJournalEntry('${cid}','${eid}','date',this.value)"
          style="background:none;border:none;color:var(--gold);font-size:0.78rem;cursor:pointer;padding:0;width:120px;flex-shrink:0">
        <input type="text" class="journal-title-input" value="${esc(entry.title||'')}" placeholder="Session title…"
          onclick="event.stopPropagation()"
          oninput="updateJournalEntry('${cid}','${eid}','title',this.value)"
          style="flex:1;background:none;border:none;font-size:0.92rem;font-weight:600;color:var(--text);padding:0">
        <button class="btn btn-icon btn-danger" onclick="event.stopPropagation();deleteJournalEntry('${cid}','${eid}')" style="flex-shrink:0">&times;</button>
        <span id="jchev-${eid}" style="color:var(--text-dim);font-size:0.75rem;flex-shrink:0">${isNewest?'▴':'▾'}</span>
      </div>
      <div id="jbody-${eid}" style="display:${isNewest?'':'none'};margin-top:0.5rem">
        <textarea class="journal-body-input" placeholder="What happened this session…"
          oninput="updateJournalEntry('${cid}','${eid}','body',this.value)"
          style="width:100%;min-height:140px;resize:vertical;background:rgba(0,0,0,0.2);border:1px solid var(--border);border-radius:4px;padding:0.5rem;color:var(--text);font-size:0.85rem;line-height:1.5;font-family:inherit"
        >${esc(entry.body||'')}</textarea>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function renderNpcSheet() {
  const npc = db.npcs[currentNpcId];
  if (!npc) return '<p>NPC not found.</p>';
  return `
    <div class="section-header">
      <div><h2>${esc(npc.name||'Unnamed NPC')}</h2><div class="text-dim" style="font-size:0.85rem">${esc(npc.role||'NPC')} &bull; ${esc(npc.race||'')} &bull; ${esc(npc.location||'Unknown location')}</div></div>
      <button class="btn btn-primary btn-sm" onclick="saveNpcSheet()">Save</button>
    </div>
    <div class="sheet-grid">
      <div>
        <div class="sheet-panel">
          <div class="panel-title">Info</div>
          <div class="form-group"><label>Name</label><input type="text" value="${esc(npc.name)}" oninput="npc_field('name',this.value)"></div>
          <div class="form-group"><label>Race</label><input type="text" value="${esc(npc.race)}" oninput="npc_field('race',this.value)"></div>
          <div class="form-group"><label>Role</label><input type="text" value="${esc(npc.role)}" oninput="npc_field('role',this.value)"></div>
          <div class="form-group"><label>Location</label><input type="text" value="${esc(npc.location)}" oninput="npc_field('location',this.value)"></div>
          <div class="form-group"><label>Disposition</label>
            <select onchange="npc_field('disposition',this.value)">${['Friendly','Neutral','Hostile','Unknown'].map(d=>`<option${npc.disposition===d?' selected':''}>${d}</option>`).join('')}</select>
          </div>
        </div>
        <div class="sheet-panel" style="margin-top:0.8rem">
          <div class="panel-title">Combat Stats</div>
          <div class="form-row">
            <div class="form-group"><label>AC</label><input type="number" value="${npc.ac||10}" oninput="npc_field('ac',+this.value)"></div>
            <div class="form-group"><label>Max HP</label><input type="number" value="${npc.maxHP||10}" oninput="npc_field('maxHP',+this.value)"></div>
            <div class="form-group"><label>Current HP</label><input type="number" value="${npc.hp||10}" oninput="npc_field('hp',+this.value)"></div>
          </div>
        </div>
      </div>
      <div>
        ${['Personality Traits|personality|How do they speak, act, carry themselves?','Goals & Motivations|goals|What do they want?','Secrets (DM only)|secrets|What are they hiding?','Relationships|relationships|Allies, enemies, family connections...','Notes|notes|Session appearances, dialogue, plot hooks...'].map(s => {
          const [label, field, ph] = s.split('|');
          return `<div class="sheet-panel" style="margin-bottom:0.8rem"><div class="panel-title">${label}</div><textarea class="sheet-textarea" rows="3" oninput="npc_field('${field}',this.value)" placeholder="${ph}">${esc(npc[field])}</textarea></div>`;
        }).join('')}
      </div>
    </div>`;
}
function npc_field(field, value) { db.npcs[currentNpcId][field] = value; }
function saveNpcSheet() {
  saveData(db);
  const btn = document.querySelector('.btn-primary');
  if (btn) { const o=btn.textContent; btn.textContent='Saved!'; setTimeout(()=>btn.textContent=o,1000); }
}

// ── Initiative Tracker ────────────────────────────────────────────────────────
const CONDITIONS = ['Blinded','Charmed','Deafened','Exhausted','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious'];

const CONDITIONS_RULES = {
  Blinded: {
    desc: 'The creature cannot see and automatically fails any ability check requiring sight.',
    rules: [
      'A blinded creature can\'t see and automatically fails any ability check that requires sight.',
      'Attack rolls against the creature have advantage.',
      'The creature\'s attack rolls have disadvantage.'
    ]
  },
  Charmed: {
    desc: 'The creature cannot attack the charmer and the charmer has advantage on social checks against it.',
    rules: [
      'A charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects.',
      'The charmer has advantage on any ability check to interact socially with the creature.'
    ]
  },
  Deafened: {
    desc: 'The creature cannot hear and automatically fails ability checks requiring hearing.',
    rules: [
      'A deafened creature can\'t hear and automatically fails any ability check that requires hearing.'
    ]
  },
  Exhausted: {
    desc: 'Exhaustion has 6 cumulative levels; each imposes increasing penalties until death at level 6.',
    rules: [
      'Level 1 — Disadvantage on ability checks.',
      'Level 2 — Speed halved.',
      'Level 3 — Disadvantage on attack rolls and saving throws.',
      'Level 4 — Hit point maximum halved.',
      'Level 5 — Speed reduced to 0.',
      'Level 6 — Death.',
      'Finishing a long rest reduces exhaustion level by 1, provided the creature has had food and water.'
    ]
  },
  Frightened: {
    desc: 'The creature has disadvantage on checks and attacks while it can see the source of its fear, and cannot move closer to it.',
    rules: [
      'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.',
      'The creature can\'t willingly move closer to the source of its fear.'
    ]
  },
  Grappled: {
    desc: 'The creature\'s speed is reduced to 0 and cannot benefit from bonuses to speed.',
    rules: [
      'A grappled creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed.',
      'The condition ends if the grappler is incapacitated.',
      'The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect.'
    ]
  },
  Incapacitated: {
    desc: 'The creature cannot take actions or reactions.',
    rules: [
      'An incapacitated creature can\'t take actions or reactions.'
    ]
  },
  Invisible: {
    desc: 'The creature cannot be seen without magic or special senses; it is heavily obscured for hiding.',
    rules: [
      'An invisible creature is impossible to see without the aid of magic or a special sense.',
      'For the purpose of hiding, the creature is heavily obscured.',
      'The creature\'s location can be detected by any noise it makes or any tracks it leaves.',
      'Attack rolls against the creature have disadvantage.',
      'The creature\'s attack rolls have advantage.'
    ]
  },
  Paralyzed: {
    desc: 'The creature is incapacitated, cannot move or speak, and automatically fails STR and DEX saves; attacks against it have advantage and hits within 5 feet are critical hits.',
    rules: [
      'A paralyzed creature is incapacitated and can\'t move or speak.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against the creature have advantage.',
      'Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.'
    ]
  },
  Petrified: {
    desc: 'The creature is transformed into solid inanimate matter, incapacitated, and unaware of its surroundings.',
    rules: [
      'A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone).',
      'Its weight increases by a factor of ten, and it ceases aging.',
      'The creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.',
      'Attack rolls against the creature have advantage.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'The creature has resistance to all damage.',
      'The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.'
    ]
  },
  Poisoned: {
    desc: 'The creature has disadvantage on attack rolls and ability checks.',
    rules: [
      'A poisoned creature has disadvantage on attack rolls and ability checks.'
    ]
  },
  Prone: {
    desc: 'The creature can only crawl unless it stands up; its attacks have disadvantage, and attackers have advantage if within 5 feet.',
    rules: [
      'A prone creature\'s only movement option is to crawl, unless it stands up and thereby ends the condition.',
      'The creature has disadvantage on attack rolls.',
      'An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.'
    ]
  },
  Restrained: {
    desc: 'The creature\'s speed is 0, its attacks have disadvantage, and attack rolls against it have advantage; it has disadvantage on DEX saves.',
    rules: [
      'A restrained creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed.',
      'Attack rolls against the creature have advantage.',
      'The creature\'s attack rolls have disadvantage.',
      'The creature has disadvantage on Dexterity saving throws.'
    ]
  },
  Stunned: {
    desc: 'The creature is incapacitated, cannot move, can speak only falteringly, and automatically fails STR and DEX saves; attacks against it have advantage.',
    rules: [
      'A stunned creature is incapacitated, can\'t move, and can speak only falteringly.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against the creature have advantage.'
    ]
  },
  Unconscious: {
    desc: 'The creature is incapacitated, drops everything, falls prone, and fails STR and DEX saves; attacks have advantage and hits within 5 feet are critical hits.',
    rules: [
      'An unconscious creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.',
      'The creature drops whatever it\'s holding and falls prone.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against the creature have advantage.',
      'Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.'
    ]
  }
};

function condName(c) { return typeof c === 'string' ? c : c.name; }
function condDuration(c) { return typeof c === 'object' ? c.duration : undefined; }

function getConditionEmoji(cond) {
  cond = condName(cond);
  const emojis = {
    'Blinded': '👁️',
    'Charmed': '💕',
    'Deafened': '🔇',
    'Exhausted': '😩',
    'Frightened': '😨',
    'Grappled': '🤝',
    'Incapacitated': '💤',
    'Invisible': '👻',
    'Paralyzed': '🔒',
    'Petrified': '🪨',
    'Poisoned': '☠️',
    'Prone': '⬇️',
    'Restrained': '⛓️',
    'Stunned': '⚡',
    'Unconscious': '😴'
  };
  return emojis[cond] || '•';
}

function getConditionClass(cond) {
  cond = condName(cond);
  const classes = {
    'Poisoned': 'poisoned',
    'Stunned': 'stunned',
    'Prone': 'prone',
    'Frightened': 'frightened'
  };
  return classes[cond] || '';
}

function getCampaign() { return db.campaigns.find(c => c.id === currentCampaignId); }
function getInitiative() { const c=getCampaign(); if(!c.initiative) c.initiative={round:1,currentIndex:0,combatants:[]}; c.initiative.combatants.forEach(cb => { if(typeof cb.tempHP === 'undefined') cb.tempHP = 0; }); return c.initiative; }

function renderInitiativeTracker(campaign) {
  const init = campaign.initiative || {round:1,currentIndex:0,combatants:[]};
  const combatants = init.combatants || [];
  if (combatants.length === 0) return `
    <div class="empty"><div class="empty-icon">&#9876;</div><p>No combatants yet.</p>
      <div style="margin-top:1rem;display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openAddCombatantModal()">+ Add Combatant</button>
        <button class="btn" onclick="openMonsterSearchModal()">&#128269; Monster Search</button>
        <button class="btn" onclick="addAllPcsToInitiative()">Add All PCs</button>
      </div>
    </div>`;
  return `
    <div class="initiative-header">
      <span class="round-badge">Round ${init.round}</span>
      <div class="flex gap-1">
        <button class="btn btn-sm" onclick="openMonsterSearchModal()">&#128269; Monster Search</button>
        <button class="btn btn-sm" onclick="openAoeDamageModal()">&#128165; AoE Damage</button>
        <button class="btn btn-sm" onclick="addAllPcsToInitiative()">Add All PCs</button>
        <button class="btn btn-sm" onclick="sortInitiative()">Sort &#8595;</button>
      </div>
    </div>
    <div class="initiative-list">
      ${combatants.map((cb,i) => {
        const isActive = i===(init.currentIndex%combatants.length);
        const hpPct = cb.maxHP>0?Math.round((cb.hp/cb.maxHP)*100):100;
        return `<div class="initiative-row ${isActive?'active':''}">
          <div class="init-order"><input type="number" class="init-order-input" value="${cb.initiative}" min="1" max="30" title="Click to edit initiative" oninput="updateCombatantInitiative(${i},+this.value)"></div>
          <div class="init-body">
            <div class="init-top">
              <span class="init-name">${esc(cb.name)}</span>
              <span class="init-type ${cb.type}">${cb.type}</span>
              ${(()=>{ const cs = _getConcentrationSpell(cb); return cs ? `<span class="conc-badge" title="Concentrating on ${esc(cs)}">C: ${esc(cs)}</span>` : ''; })()}
              ${isActive?'<span class="active-arrow">&#9654; Active</span>':''}
            </div>
            <div class="init-stats">
              <span>AC <strong>${cb.ac}</strong></span>
              <span>HP <input type="number" class="hp-input" value="${cb.hp}" min="0" max="${cb.maxHP}" oninput="updateCombatantHP(${i},+this.value)"> / ${cb.maxHP}${cb.tempHP > 0 ? ` (<span class="temp-hp-display">+${cb.tempHP} temp</span>)` : ''}<button class="btn btn-sm" style="padding:0.2rem 0.35rem; font-size:0.75rem; margin-left:0.3rem;" onclick="openTempHPInput(${i})" title="Add temp HP">+T</button></span>
              <span><button class="btn btn-sm" onclick="healCombatant(${i},1)">+</button><button class="btn btn-sm btn-danger" onclick="damageCombatant(${i},1)">-</button></span>
            </div>
            <div class="hp-bar-wrap" style="position:relative; overflow:hidden;"><div class="hp-bar ${hpPct<=25?'low':hpPct<=50?'mid':''}" style="width:${hpPct}%; position:relative; z-index:2;"></div>${cb.tempHP > 0 ? '<div class="hp-bar-temp" style="width:'+Math.min(100, Math.round(((cb.hp + cb.tempHP) / cb.maxHP) * 100))+'%; position:absolute; top:0; left:0; z-index:1;"></div>' : ''}</div>
            ${cb._concCheck ? `<div class="conc-warning">&#9888; Concentration check required — DC ${cb._concCheck.dc} (${esc(cb._concCheck.spell)})<button class="conc-dismiss" onclick="dismissConcCheck(${i})">&times;</button></div>` : ''}
            ${cb.legendaryMax ? `<div class="legendary-pips" id="leg-pips-${i}" title="Legendary Actions — reset at the start of this creature's turn">
              ${Array.from({length: cb.legendaryMax}, (_,j) => {
                const available = j >= (cb.legendaryUsed||0);
                return `<button class="leg-pip ${available?'available':'spent'}" onclick="spendLegendary(${i},${j})">${available?'◆':'◇'}</button>`;
              }).join('')}
              <button class="btn btn-sm leg-reset-btn" onclick="resetLegendary(${i})">Reset</button>
            </div>` : ''}
            <div class="condition-row">
              ${_conditionRowHtml(i, cb.conditions)}
            </div>
            ${cb.notes ? `<div class="combatant-notes-collapsed">📝 <span class="notes-preview">${esc(cb.notes)}</span></div>` : ''}
            ${cb._notesOpen ? `<div class="combatant-notes-expanded">
              <input type="text" class="notes-input" value="${esc(cb.notes||'')}" placeholder="Add notes (bloodied, hiding, etc.)"
                oninput="setCombatantNotes(${i},this.value)" onblur="closeCombatantNotes(${i})">
            </div>` : ''}
            ${cb.statBlock?`<button class="btn btn-sm stat-block-toggle" onclick="toggleStatBlock(${i})">&#128214; Stat Block</button>
            <div class="stat-block-panel" id="stat-block-${i}">${renderCombatantStatBlock(cb.statBlock, i)}</div>`:''}
          </div>
          <div class="combatant-actions">
            <button class="btn btn-icon note-btn ${cb.notes ? 'has-notes' : ''}" onclick="toggleCombatantNotes(${i})" title="Notes">${cb.notes ? '●' : ''}📝</button>
            <button class="btn btn-icon btn-danger" onclick="removeCombatant(${i})">&times;</button>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="nextTurn()">Next Turn &#8594;</button>
      <button class="btn btn-sm" onclick="openAddCombatantModal()">+ Add Combatant</button>
      <button class="btn btn-sm btn-danger" onclick="clearInitiative()">End Combat</button>
    </div>`;
}

function openAddCombatantModal() {
  const campaign = getCampaign();
  const pcs = (campaign.characters||[]).map(id=>db.characters[id]).filter(Boolean);
  const npcs = (campaign.npcs||[]).map(id=>db.npcs[id]).filter(Boolean);
  openModal(`<h2>Add Combatant</h2>
    <div class="form-row">
      <div class="form-group"><label>Name</label><input type="text" id="cb-name" placeholder="Goblin Archer"></div>
      <div class="form-group"><label>Initiative Roll</label><input type="number" id="cb-init" value="${Math.ceil(Math.random()*20)}" min="1" max="30"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>AC</label><input type="number" id="cb-ac" value="12"></div>
      <div class="form-group"><label>Max HP</label><input type="number" id="cb-hp" value="10" min="1"></div>
      <div class="form-group"><label>Type</label><select id="cb-type"><option value="monster">Monster</option><option value="player">Player</option><option value="npc">NPC</option></select></div>
    </div>
    ${pcs.length>0||npcs.length>0?`<hr class="divider"><div class="panel-title" style="margin-bottom:0.5rem">Quick Add from Campaign</div>
    <div class="flex gap-1 flex-wrap">
      ${pcs.map(ch=>`<button class="btn btn-sm" onclick="quickAddCombatant('${ch.id}','player')">${esc(ch.name)}</button>`).join('')}
      ${npcs.map(n=>`<button class="btn btn-sm" onclick="quickAddCombatant('${n.id}','npc')">${esc(n.name)}</button>`).join('')}
    </div>`:''}
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="addCombatant()">Add</button></div>`);
  document.getElementById('cb-name').focus();
}
function addCombatant() {
  const init = getInitiative();
  init.combatants.push({ id:uid(), name:document.getElementById('cb-name').value.trim()||'Unknown', initiative:parseInt(document.getElementById('cb-init').value)||1, ac:parseInt(document.getElementById('cb-ac').value)||10, hp:parseInt(document.getElementById('cb-hp').value)||10, maxHP:parseInt(document.getElementById('cb-hp').value)||10, type:document.getElementById('cb-type').value, conditions:[], notes:'', tempHP:0 });
  saveData(db); closeModal(); renderApp();
}
function quickAddCombatant(entityId, type) {
  let name, ac, maxHP, hp, charId = null;
  if (type==='player') {
    const ch=db.characters[entityId];
    name=ch.name; ac=ch.combat.ac; maxHP=ch.combat.maxHP; hp=ch.combat.currentHP;
    charId=entityId;
  } else {
    const npc=db.npcs[entityId]; name=npc.name; ac=npc.ac||10; maxHP=npc.maxHP||10; hp=npc.hp||10;
  }
  const rolled = Math.ceil(Math.random()*20);
  const raw = prompt(`Initiative roll for ${name}:`, rolled);
  if (raw === null) return; // cancelled
  const initiative = parseInt(raw) || rolled;
  getInitiative().combatants.push({ id:uid(), charId, name, initiative, ac, hp, maxHP, type, conditions:[], notes:'', tempHP:0 });
  saveData(db); closeModal(); renderApp();
}
function addAllPcsToInitiative() {
  const campaign=getCampaign(), init=getInitiative();
  const linked=new Set(init.combatants.filter(c=>c.charId).map(c=>c.charId));
  (campaign.characters||[]).forEach(id => {
    const ch=db.characters[id]; if(!ch||linked.has(id)) return;
    init.combatants.push({id:uid(),charId:id,name:ch.name,initiative:Math.ceil(Math.random()*20),ac:ch.combat.ac,hp:ch.combat.currentHP,maxHP:ch.combat.maxHP,type:'player',conditions:[],notes:'',tempHP:ch.combat.tempHP||0});
  });
  saveData(db); renderApp();
}
function _getConcentrationSpell(cb) {
  if (!cb.charId) return null;
  const ch = db.characters[cb.charId];
  if (!ch) return null;
  const prepared = ch.spells?.prepared || [];
  const concSpell = prepared.find(s => typeof s === 'object' && s.concentration === 'yes');
  return concSpell ? concSpell.name : null;
}
function _checkConcentration(i, dmg) {
  const cb = getInitiative().combatants[i];
  if (!cb) return;
  const spell = _getConcentrationSpell(cb);
  if (!spell || dmg <= 0) return;
  const dc = Math.max(10, Math.floor(dmg / 2));
  cb._concCheck = { dc, spell, dmg };
  saveData(db);
  showToast(`<strong>${esc(cb.name)}</strong>: Concentration check — DC ${dc} (${esc(spell)})`);
}

function dismissConcCheck(i) {
  const cb = getInitiative().combatants[i];
  if (cb) { delete cb._concCheck; saveData(db); renderApp(); }
}

function toggleCombatantNotes(i) {
  const cb = getInitiative().combatants[i];
  if (cb) {
    cb._notesOpen = !cb._notesOpen;
    saveData(db);
    renderApp();
    if (cb._notesOpen) setTimeout(() => document.querySelector(`.notes-input`)?.focus(), 50);
  }
}

function setCombatantNotes(i, text) {
  const cb = getInitiative().combatants[i];
  if (cb) {
    cb.notes = text.trim();
    saveData(db);
  }
}

function closeCombatantNotes(i) {
  const cb = getInitiative().combatants[i];
  if (cb) {
    cb._notesOpen = false;
    saveData(db);
    renderApp();
  }
}

function sortInitiative() { const init=getInitiative(); init.combatants.sort((a,b)=>b.initiative-a.initiative); init.currentIndex=0; saveData(db); renderApp(); }
function nextTurn() {
  const init=getInitiative(); if(!init.combatants.length) return;
  // Clear concentration warnings from all combatants at turn change
  init.combatants.forEach(cb => delete cb._concCheck);
  // Decrement timed conditions on the combatant whose turn just ended
  const prevIdx = (init.currentIndex||0) % init.combatants.length;
  const prev = init.combatants[prevIdx];
  if (prev && prev.conditions?.length) {
    const expired = [];
    prev.conditions = prev.conditions.filter(c => {
      if (typeof c === 'object' && c.duration) {
        c.duration--;
        if (c.duration <= 0) { expired.push(c.name); return false; }
      }
      return true;
    });
    expired.forEach(name => showToast(`${esc(prev.name)}: <strong>${name}</strong> has expired.`));
  }
  init.currentIndex=(init.currentIndex||0)+1;
  if(init.currentIndex>=init.combatants.length){init.currentIndex=0;init.round++;}
  // Auto-reset legendary actions for the now-active combatant
  const active = init.combatants[init.currentIndex % init.combatants.length];
  if (active && active.legendaryMax) {
    active.legendaryUsed = 0;
    active._legFlash = true;
  }
  saveData(db); renderApp();
  // Flash the pips briefly
  if (active && active._legFlash) {
    const pips = document.getElementById('leg-pips-' + (init.currentIndex % init.combatants.length));
    if (pips) { pips.classList.add('flash'); setTimeout(() => pips.classList.remove('flash'), 800); }
    delete active._legFlash;
  }
}
function updateCombatantHP(i,val) {
  const cb=getInitiative().combatants[i];
  const oldHP = cb ? cb.hp : 0;
  CharacterStore.updateInitiativeHP(currentCampaignId,i,+val,cb.tempHP);
  if (cb && +val < oldHP) _checkConcentration(i, oldHP - +val);
}
function updateCombatantInitiative(i,val) { if(!val||isNaN(val)) return; getInitiative().combatants[i].initiative=val; saveData(db); }
function damageCombatant(i,amt) {
  const cb=getInitiative().combatants[i];
  if (!cb || amt <= 0) return;
  let remaining = amt;
  // Temp HP absorbs first
  if (cb.tempHP > 0) {
    const absorbed = Math.min(cb.tempHP, remaining);
    cb.tempHP -= absorbed;
    remaining -= absorbed;
  }
  // Remaining damage applies to real HP
  const newHP = Math.max(0, cb.hp - remaining);
  CharacterStore.updateInitiativeHP(currentCampaignId,i,newHP,cb.tempHP);
  _checkConcentration(i,amt);
  renderApp();
}
function healCombatant(i,amt) {
  const cb=getInitiative().combatants[i];
  if (!cb || amt <= 0) return;
  const newHP = Math.min(cb.maxHP, cb.hp + amt);
  CharacterStore.updateInitiativeHP(currentCampaignId,i,newHP,cb.tempHP);
  renderApp();
}
function openTempHPInput(i) {
  openModal(`<h2>Add Temp HP</h2>
    <div class="form-group">
      <label>Temp HP Amount</label>
      <input type="number" id="temp-hp-input" placeholder="0" min="0" max="999" autofocus>
    </div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="setTempHP(${i},+document.getElementById('temp-hp-input').value);closeModal()">Add</button>
    </div>`);
  document.getElementById('temp-hp-input').focus();
}
function setTempHP(i, amount) {
  const cb=getInitiative().combatants[i];
  if (cb) {
    cb.tempHP = Math.max(0, amount);
    CharacterStore.updateInitiativeHP(currentCampaignId,i,cb.hp,cb.tempHP);
    renderApp();
  }
}
function removeCombatant(i) { const init=getInitiative(); init.combatants.splice(i,1); if(init.currentIndex>=init.combatants.length) init.currentIndex=0; saveData(db); renderApp(); }
function spendLegendary(i, pipIdx) {
  const cb = getInitiative().combatants[i];
  if (!cb || !cb.legendaryMax) return;
  // Clicking a filled pip sets legendaryUsed to pipIdx+1 (spend that many)
  const newUsed = pipIdx + 1;
  if (newUsed <= (cb.legendaryUsed||0)) return; // already spent
  cb.legendaryUsed = Math.min(newUsed, cb.legendaryMax);
  saveData(db); renderApp();
}
function resetLegendary(i) {
  const cb = getInitiative().combatants[i];
  if (!cb || !cb.legendaryMax) return;
  cb.legendaryUsed = 0;
  saveData(db); renderApp();
}
function clearInitiative() { if(!confirm('End combat and clear all combatants?')) return; getCampaign().initiative={round:1,currentIndex:0,combatants:[]}; saveData(db); renderApp(); }

function openAoeDamageModal() {
  const combatants = getInitiative().combatants;
  if (!combatants.length) return;
  const rows = combatants.map((cb, i) => {
    const hpPct = cb.maxHP > 0 ? Math.round((cb.hp / cb.maxHP) * 100) : 100;
    return `<div class="aoe-row">
      <label class="aoe-check"><input type="checkbox" data-idx="${i}" checked><span class="aoe-name">${esc(cb.name)}</span>
        <span class="aoe-hp ${hpPct <= 25 ? 'low' : hpPct <= 50 ? 'mid' : ''}">${cb.hp}/${cb.maxHP}</span></label>
      <select class="aoe-save" data-idx="${i}">
        <option value="full">Full Damage</option>
        <option value="half">Half (saved)</option>
        <option value="none">No Damage (saved)</option>
      </select>
    </div>`;
  }).join('');
  openModal(`<h2>AoE Damage</h2>
    <div class="form-group"><label>Damage Amount</label><input type="number" id="aoe-dmg" min="1" value="28" class="hp-input" style="width:100%;font-size:1.1rem;padding:0.5rem"></div>
    <div class="aoe-batch-row">
      <button class="btn btn-sm" onclick="aoeBatchSave('full')">All Full</button>
      <button class="btn btn-sm" onclick="aoeBatchSave('half')">All Half</button>
      <button class="btn btn-sm" onclick="aoeBatchSave('none')">All No Dmg</button>
      <label class="aoe-toggle-all"><input type="checkbox" checked onchange="aoeToggleAll(this.checked)"> Select All</label>
    </div>
    <div class="aoe-list">${rows}</div>
    <div id="aoe-summary" class="aoe-summary"></div>
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="applyAoeDamage()">Apply Damage</button></div>`);
  document.getElementById('aoe-dmg').focus();
}

function aoeBatchSave(val) {
  document.querySelectorAll('.aoe-save').forEach(s => s.value = val);
}
function aoeToggleAll(checked) {
  document.querySelectorAll('.aoe-row input[type=checkbox]').forEach(cb => cb.checked = checked);
}

function applyAoeDamage() {
  const baseDmg = parseInt(document.getElementById('aoe-dmg').value) || 0;
  if (baseDmg <= 0) return;
  const combatants = getInitiative().combatants;
  let totalHit = 0, fullCount = 0, halfCount = 0, halfDmg = 0;

  document.querySelectorAll('.aoe-row').forEach(row => {
    const checkbox = row.querySelector('input[type=checkbox]');
    if (!checkbox || !checkbox.checked) return;
    const idx = parseInt(checkbox.dataset.idx);
    const saveType = row.querySelector('.aoe-save').value;
    let dmg = 0;
    if (saveType === 'full') { dmg = baseDmg; fullCount++; }
    else if (saveType === 'half') { dmg = Math.floor(baseDmg / 2); halfCount++; halfDmg = dmg; }
    // 'none' = 0 damage
    if (dmg <= 0) return;
    totalHit++;
    // Apply temp HP absorption
    const cb = combatants[idx];
    let remaining = dmg;
    let newTempHP = cb.tempHP || 0;
    if (newTempHP > 0) {
      const absorbed = Math.min(newTempHP, remaining);
      newTempHP -= absorbed;
      remaining -= absorbed;
    }
    const newHP = Math.max(0, cb.hp - remaining);
    CharacterStore.updateInitiativeHP(currentCampaignId, idx, newHP, newTempHP);
    _checkConcentration(idx, dmg);
  });

  const parts = [];
  if (fullCount) parts.push(`${fullCount} took full`);
  if (halfCount) parts.push(`${halfCount} saved for ${halfDmg} each`);
  const summary = `Dealt ${baseDmg} damage to ${totalHit} combatant${totalHit !== 1 ? 's' : ''}` + (parts.length ? ` (${parts.join(', ')})` : '') + '.';

  document.getElementById('aoe-summary').textContent = summary;
  document.getElementById('aoe-summary').classList.add('visible');

  // Re-render the HP values in the checklist
  document.querySelectorAll('.aoe-row').forEach(row => {
    const idx = parseInt(row.querySelector('input[type=checkbox]').dataset.idx);
    const cb = combatants[idx];
    const hpEl = row.querySelector('.aoe-hp');
    if (hpEl) {
      hpEl.textContent = `${cb.hp}/${cb.maxHP}`;
      const pct = cb.maxHP > 0 ? Math.round((cb.hp / cb.maxHP) * 100) : 100;
      hpEl.className = 'aoe-hp' + (pct <= 25 ? ' low' : pct <= 50 ? ' mid' : '');
    }
  });
}
function openConditionPicker(i) {
  const cb=getInitiative().combatants[i];
  const activeNames = (cb.conditions||[]).map(c => condName(c));
  openModal(`<h2>Conditions — ${esc(cb.name)}</h2>
    <div class="condition-picker">${CONDITIONS.map(cond => {
      const active = activeNames.includes(cond) ? 'active' : '';
      const existing = (cb.conditions||[]).find(c => condName(c) === cond);
      const dur = existing ? condDuration(existing) : '';
      return `<div class="condition-option ${active}" onclick="toggleCondition(${i},'${cond}')">
        <span>${getConditionEmoji(cond)} ${cond}</span>
        <span class="cond-option-right">
          <input type="number" class="cond-dur-input" data-cond="${cond}" min="1" max="99" placeholder="Rds" value="${dur||''}" onclick="event.stopPropagation()" onchange="event.stopPropagation();setConditionDuration(${i},'${cond}',+this.value)" title="Duration in rounds (optional)">
          <span class="condition-info-btn" onclick="event.stopPropagation();openConditionRef('${cond}',${i})" title="View rules">ⓘ</span>
        </span>
      </div>`;
    }).join('')}</div>
    <div class="form-actions"><button class="btn btn-primary" onclick="closeModal()">Done</button></div>`);
}
function toggleCondition(i, cond) {
  const cb=getInitiative().combatants[i]; cb.conditions=cb.conditions||[];
  const existIdx = cb.conditions.findIndex(c => condName(c) === cond);
  if (existIdx >= 0) {
    cb.conditions.splice(existIdx, 1);
  } else {
    const durInput = document.querySelector(`.cond-dur-input[data-cond="${cond}"]`);
    const dur = durInput ? parseInt(durInput.value) : 0;
    cb.conditions.push(dur > 0 ? { name: cond, duration: dur } : cond);
  }
  saveData(db);
  const isActive = cb.conditions.some(c => condName(c) === cond);
  document.querySelectorAll('.condition-option').forEach(el => {
    const name = el.querySelector('span')?.textContent?.trim().replace(/^[^\s]+\s/,'') || el.textContent.trim();
    if(name===cond) el.classList.toggle('active', isActive);
  });
  const row=document.querySelectorAll('.initiative-row')[i];
  if(row) { const cr=row.querySelector('.condition-row'); if(cr) cr.innerHTML=_conditionRowHtml(i, cb.conditions); }
}
function setConditionDuration(i, cond, dur) {
  const cb=getInitiative().combatants[i]; cb.conditions=cb.conditions||[];
  const existIdx = cb.conditions.findIndex(c => condName(c) === cond);
  if (existIdx < 0) return; // not active, ignore duration change
  if (dur > 0) {
    cb.conditions[existIdx] = { name: cond, duration: dur };
  } else {
    cb.conditions[existIdx] = cond; // revert to indefinite string
  }
  saveData(db);
  const row=document.querySelectorAll('.initiative-row')[i];
  if(row) { const cr=row.querySelector('.condition-row'); if(cr) cr.innerHTML=_conditionRowHtml(i, cb.conditions); }
}
function _conditionRowHtml(i, conditions) {
  return `${(conditions||[]).map(c=>{
    const name = condName(c);
    const dur = condDuration(c);
    const durBadge = dur ? `<span class="cond-dur-badge">${dur}rd${dur!==1?'s':''}</span>` : '';
    return `<span class="condition-tag ${getConditionClass(c)}" onclick="openConditionRef('${name}',${i})" title="${dur ? dur+' round'+(dur!==1?'s':'')+' remaining' : 'Click to view rules'}">${getConditionEmoji(c)} ${name}${durBadge}</span>`;
  }).join('')}<button class="btn btn-sm" onclick="openConditionPicker(${i})">+ Condition</button>`;
}
function removeCondition(i,cond) {
  const init=getInitiative(); init.combatants[i].conditions=(init.combatants[i].conditions||[]).filter(c=>condName(c)!==cond);
  saveData(db); renderApp();
}
function openConditionRef(cond, combatantIdx) {
  const ref = CONDITIONS_RULES[cond] || { desc: '', rules: [] };
  const emoji = getConditionEmoji(cond);
  const hasCombatant = combatantIdx !== undefined && combatantIdx !== null;
  openModal(`
    <div class="condition-ref-header">
      <div class="condition-ref-emoji">${emoji}</div>
      <h2 class="condition-ref-name">${esc(cond)}</h2>
      <p class="condition-ref-desc">${esc(ref.desc)}</p>
    </div>
    <ul class="condition-ref-rules">
      ${ref.rules.map(r=>`<li>${esc(r)}</li>`).join('')}
    </ul>
    <div class="form-actions">
      ${hasCombatant ? `<button class="btn btn-danger" onclick="removeCondition(${combatantIdx},'${cond}');closeModal()">Remove Condition</button>` : ''}
      <button class="btn" onclick="closeModal()">Keep</button>
    </div>`);
}

// ── Monster Search ─────────────────────────────────────────────────────────────
let monsterFullData = null;
let monsterBookFilter = 'all';
let monsterShowCount = 80;

const MONSTER_BOOK_NAMES = {
  MM:'Monster Manual', BR14:'Basic Rules 2014', BR24:'Basic Rules 2024', MPMM:"Mordenkainen's Multiverse",
  VGM:"Volo's Guide", MTF:"Mordenkainen's Foes", FM:'Flee Mortals', FTD:"Fizban's Dragons",
  TCE:"Tasha's Cauldron", BGG:"Bigby's Giants", ToB:'Tome of Beasts', ToB2:'Tome of Beasts 2',
  ToB3:'Tome of Beasts 3', CC:'Creature Codex', SJ:'Spelljammer', EGW:'Wildemount',
  MOT:'Theros', PAM:'Planescape', VER:'Vecna', QIS:'Infinite Staircase', PHB24:'PHB 2024',
  XMM:'MM 2024',
};
const MONSTER_BOOK_COLORS = {
  MM:'#c084fc', BR14:'#9b6dff', BR24:'#9b6dff', MPMM:'#3b82f6', VGM:'#6d8fd4',
  MTF:'#6d8fd4', FM:'#e87070', FTD:'#f59e0b', TCE:'#14b8a6', BGG:'#c4a85a',
  ToB:'#7bbdb8', ToB2:'#7bbdb8', ToB3:'#7bbdb8', CC:'#9c7bc4',
  SJ:'#6dba8f', EGW:'#f59e0b', MOT:'#c4a85a', PAM:'#6dba8f',
  VER:'#e87070', QIS:'#7b9dd4', PHB24:'#c084fc', XMM:'#c084fc',
};

async function openMonsterSearchModal() {
  openModal(`<h2>&#128269; Monster Search</h2>
    <div class="flex gap-1" style="margin-bottom:0.5rem">
      <input type="text" id="monster-query" placeholder="Search monsters..." style="flex:1" oninput="searchMonsters()">
    </div>
    <div class="flex gap-1" style="margin-bottom:0.8rem">
      <select id="monster-book-filter" onchange="monsterBookFilter=this.value;searchMonsters()" style="flex:1;font-size:0.8rem">
        <option value="all">All Books</option>
      </select>
      <select id="monster-cr-filter" onchange="searchMonsters()" style="width:80px;font-size:0.8rem">
        <option value="all">All CR</option>
        <option value="0">CR 0</option><option value="0.125">CR 1/8</option><option value="0.25">CR 1/4</option><option value="0.5">CR 1/2</option>
        ${Array.from({length:30},(_,i)=>i+1).map(n=>`<option value="${n}">CR ${n}</option>`).join('')}
      </select>
    </div>
    <div id="monster-results" class="monster-results"><p class="text-dim" style="text-align:center">Loading monster list...</p></div>`);
  document.getElementById('monster-query').focus();
  await loadMonsterList();
}

async function loadMonsterList() {
  if (monsterCache) { populateBookFilter(); searchMonsters(); return; }
  try {
    const res = await fetch('./data/monsters-index.json?v=2');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    monsterCache = await res.json();
    populateBookFilter();
    searchMonsters();
  } catch {
    const el = document.getElementById('monster-results');
    if (el) el.innerHTML = `<p class="text-red">Could not load monster list — data/monsters-index.json missing.</p>`;
  }
}

function populateBookFilter() {
  const sel = document.getElementById('monster-book-filter'); if (!sel) return;
  const books = [...new Set(monsterCache.map(m => m.book))].sort();
  // Build a map of book → source_label from index entries
  const labelMap = {};
  monsterCache.forEach(m => { if (m.source_label && !labelMap[m.book]) labelMap[m.book] = m.source_label; });
  sel.innerHTML = `<option value="all">All Books (${monsterCache.length})</option>`
    + books.map(b => {
      const count = monsterCache.filter(m => m.book === b).length;
      const fullName = labelMap[b] || MONSTER_BOOK_NAMES[b] || b;
      return `<option value="${b}"${monsterBookFilter===b?' selected':''}>${fullName} (${count})</option>`;
    }).join('');
}

function searchMonsters(resetCount) {
  if (resetCount !== false) monsterShowCount = 80;
  const el = document.getElementById('monster-results'); if (!el || !monsterCache) return;
  const q = (document.getElementById('monster-query')?.value || '').toLowerCase().trim();
  const bookF = document.getElementById('monster-book-filter')?.value || 'all';
  const crF = document.getElementById('monster-cr-filter')?.value || 'all';

  let filtered = monsterCache;
  if (q) filtered = filtered.filter(m => m.name.toLowerCase().includes(q));
  if (bookF !== 'all') filtered = filtered.filter(m => m.book === bookF);
  if (crF !== 'all') filtered = filtered.filter(m => m.cr_num === parseFloat(crF));

  if (!filtered.length) { el.innerHTML = `<p class="text-dim">No monsters found.</p>`; return; }
  const showing = filtered.slice(0, monsterShowCount);
  const remaining = filtered.length - showing.length;
  el.innerHTML = `<div style="font-size:0.78rem;color:var(--text-dim);margin-bottom:0.5rem">${filtered.length} results${remaining > 0 ? ` (showing ${showing.length})` : ''}</div>`
    + showing.map(m => {
      const color = MONSTER_BOOK_COLORS[m.book] || '#888';
      const fullName = m.source_label || MONSTER_BOOK_NAMES[m.book] || m.book;
      const limitedBadge = m.limited ? `<span class="monster-limited-badge">limited</span>` : '';
      return `<div class="monster-row" onclick="loadMonsterStat(${m.i})">
        <span>${esc(m.name)}${limitedBadge}</span>
        <span class="monster-row-meta">
          <span class="monster-cr-badge">CR ${m.cr}</span>
          <span class="monster-book-badge" style="background:${color}">${esc(fullName)}</span>
          <span class="text-dim" style="font-size:0.78rem">&#9656;</span>
        </span>
      </div>`;
    }).join('')
    + (remaining > 0 ? `<button class="btn btn-sm" style="width:100%;margin-top:0.5rem" onclick="monsterShowCount+=80;searchMonsters(false)">Show more (${remaining} remaining)</button>` : '');
}
function showMoreMonsters() { monsterShowCount += 80; searchMonsters(false); }

function _isLimitedMonster(m) {
  return !m.str && !Object.values(m.desc_sections || {}).some(v => v);
}

let _limitedFlagsApplied = false;
function _applyLimitedFlags() {
  if (_limitedFlagsApplied || !monsterFullData || !monsterCache) return;
  _limitedFlagsApplied = true;
  const limitedSet = new Set();
  monsterFullData.forEach((m, i) => { if (_isLimitedMonster(m)) limitedSet.add(i); });
  monsterCache.forEach(m => { if (limitedSet.has(m.i)) m.limited = true; });
  searchMonsters(false);
}

async function loadMonsterStat(idx) {
  const el = document.getElementById('monster-results');
  if (el) el.innerHTML = `<p class="text-dim" style="text-align:center">Loading...</p>`;
  try {
    if (!monsterFullData) {
      const res = await fetch('./data/monsters.json?v=2');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      monsterFullData = await res.json();
      _applyLimitedFlags();
    }
    const m = monsterFullData[idx];
    if (el) el.innerHTML = renderMonsterStatBlock(m);
  } catch {
    if (el) el.innerHTML = `<p class="text-red">Failed to load monster stats.</p>`;
  }
}

let _pendingMonster = null;

function parseDescEntries(text) {
  if (!text) return [];
  // Split on "Name: desc" where Name is a capitalised phrase preceded by period+space or start of string
  const re = /(?:^|\.\s+)([A-Z][A-Za-z ,()'-]+?):\s*/g;
  const entries = [];
  let match, lastEnd = 0, foundFirst = false;
  while ((match = re.exec(text)) !== null) {
    if (foundFirst) {
      // close out previous entry desc
      entries[entries.length - 1].desc = text.slice(lastEnd, match.index).replace(/\.\s*$/, '').trim();
    }
    entries.push({ name: match[1].trim(), desc: '' });
    lastEnd = re.lastIndex;
    foundFirst = true;
  }
  if (foundFirst) {
    entries[entries.length - 1].desc = text.slice(lastEnd).trim();
  }
  return entries;
}

function renderMonsterStatBlock(m) {
  _pendingMonster = m;
  const abilityMod = s => { const v = Math.floor(((s||10)-10)/2); return (v>=0?'+':'')+v; };
  const hasAbilities = m.str !== undefined;
  const bookColor = MONSTER_BOOK_COLORS[m.source] || '#888';

  const sectionDivider = `<div class="sb-section-divider"></div>`;

  let body = '';

  if (hasAbilities) {
    const _acNote = m.ac_note && m.ac_note !== String(m.ac) && !/^\d+$/.test(m.ac_note.trim()) ? ` <span class="text-dim">(${esc(m.ac_note)})</span>` : '';
    const _speedStr = typeof m.speed === 'string' ? esc(m.speed) : Object.entries(m.speed||{}).map(([k,v])=>`${k} ${v}`).join(', ');
    body += `<div class="sb-stats-row"><span><strong>AC</strong> ${m.ac}${_acNote}</span><span><strong>HP</strong> ${m.hp}${m.hp_formula ? ` <span class="text-dim">(${esc(m.hp_formula)})</span>` : ''}</span><span><strong>Speed</strong> ${_speedStr}</span></div>`;
    body += `<hr class="stat-block-divider">`;
    body += `<div class="sb-ability-grid">${[['STR',m.str],['DEX',m.dex],['CON',m.con],['INT',m.int],['WIS',m.wis],['CHA',m.cha]].map(([n,v])=>`<div class="sb-ability-cell"><div class="sb-ability-name">${n}</div><div class="sb-ability-score">${v} <span class="sb-ability-mod">(${abilityMod(v)})</span></div></div>`).join('')}</div>`;
    body += `<hr class="stat-block-divider">`;
    if (m.saving_throws) body += `<div class="sb-prop"><strong>Saving Throws</strong> ${esc(m.saving_throws)}</div>`;
    if (m.skills) body += `<div class="sb-prop"><strong>Skills</strong> ${esc(m.skills)}</div>`;
    if (m.resistances) body += `<div class="sb-prop"><strong>Damage Resistances</strong> ${esc(m.resistances)}</div>`;
    if (m.immunities) body += `<div class="sb-prop"><strong>Damage Immunities</strong> ${esc(m.immunities)}</div>`;
    if (m.condition_immunities) body += `<div class="sb-prop"><strong>Condition Immunities</strong> ${esc(m.condition_immunities)}</div>`;
    if (m.vulnerabilities) body += `<div class="sb-prop"><strong>Vulnerabilities</strong> ${esc(m.vulnerabilities)}</div>`;
    if (m.senses) body += `<div class="sb-prop"><strong>Senses</strong> ${esc(m.senses)}</div>`;
    if (m.languages) body += `<div class="sb-prop"><strong>Languages</strong> ${esc(m.languages)}</div>`;
    body += `<div class="sb-prop"><strong>Challenge</strong> ${esc(m.cr)} (${(m.xp||0).toLocaleString()} XP)</div>`;

    const _section = (title, arr) => {
      if (!arr?.length) return '';
      return sectionDivider + `<div class="stat-section-title">${title}</div>` + arr.map(t => `<div class="stat-entry"><strong>${esc(t.name)}.</strong> ${esc(t.desc)}</div>`).join('');
    };
    body += _section('Traits', m.traits);
    body += _section('Actions', m.actions);
    body += _section('Bonus Actions', m.bonus_actions);
    body += _section('Reactions', m.reactions);
    body += _section('Legendary Actions', m.legendary_actions);
  } else {
    body += `<div class="sb-prop"><strong>Challenge</strong> ${esc(m.cr)}</div>`;
    body += `<p class="monster-limited-msg">Full stat block not available for this monster — check the source book for complete stats.</p>`;
  }

  return `<button class="btn sb-back-btn" onclick="searchMonsters()">&#8592; Back to Search</button>
    <div class="stat-block">
      <div class="sb-header">
        <div class="stat-block-name">${esc(m.name)}</div>
        <div class="sb-summary">${esc(m.size)} ${esc(m.type)}, ${esc(m.alignment)} &mdash; CR ${esc(m.cr)}
          <span class="monster-book-badge" style="background:${bookColor};margin-left:0.4rem">${esc(m.source_label)}</span>
        </div>
      </div>
      <div class="sb-body">${body}</div>
    </div>
    <div class="sb-footer">
      <button class="btn btn-primary" style="width:100%" onclick="addMonsterToCombat(_pendingMonster)">+ Add to Initiative</button>
    </div>`;
}

function addMonsterToCombat(m) {
  const init = getInitiative();
  const dexMod = Math.floor(((m.dex || m.dexterity || 10) - 10) / 2);
  const initiative = Math.ceil(Math.random() * 20) + dexMod;
  const ac = m.ac || 10;
  const hp = m.hp || 10;

  const statBlock = {
    size: m.size || '', type: m.type || '', alignment: m.alignment || '',
    hit_points_roll: m.hp_formula || '',
    speed: typeof m.speed === 'string' ? m.speed : Object.entries(m.speed||{}).map(([k,v])=>`${k} ${v}`).join(', '),
    strength: m.str||10, dexterity: m.dex||10, constitution: m.con||10,
    intelligence: m.int||10, wisdom: m.wis||10, charisma: m.cha||10,
    saving_throws: m.saving_throws || '',
    skills: m.skills || '',
    damage_immunities: m.immunities ? m.immunities.split(', ') : [],
    damage_resistances: m.resistances ? m.resistances.split(', ') : [],
    condition_immunities: m.condition_immunities ? m.condition_immunities.split(', ') : [],
    senses: typeof m.senses === 'string' ? {passive_perception: parseInt((m.senses.match(/passive perception (\d+)/i)||[])[1])||10} : (m.senses||{}),
    languages: m.languages || '',
    challenge_rating: m.cr, xp: m.xp || 0,
    traits: m.traits || [],
    actions: m.actions || [],
    bonus_actions: m.bonus_actions || [],
    reactions: m.reactions || [],
    legendary_actions: m.legendary_actions || [],
  };

  const combatant = {
    id: uid(), name: m.name, initiative, ac, hp, maxHP: hp,
    type: 'monster', conditions: [], statBlock, notes: '', tempHP: 0
  };
  if (m.legendary_count) {
    combatant.legendaryMax = m.legendary_count;
    combatant.legendaryUsed = 0;
  }
  init.combatants.push(combatant);
  saveData(db); closeModal(); showCampaign(currentCampaignId, 'initiative');
}

function toggleStatBlock(i) {
  const el = document.getElementById('stat-block-'+i);
  if (el) el.classList.toggle('open');
}

function parseAttackInfo(desc) {
  const hitMatch = desc.match(/([+-]\d+)\s+to hit/i);
  const dmgMatch = desc.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?)\)?\s+(\w+)\s+damage/i);
  return {
    attackBonus: hitMatch ? hitMatch[1] : null,
    damageDice: dmgMatch ? dmgMatch[1].replace(/\s/g,'') : null,
    damageType: dmgMatch ? dmgMatch[2] : null
  };
}

function rollDice(diceStr) {
  const parts = diceStr.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!parts) return { total: 0, rolls: [], modifier: 0, formula: diceStr };
  const count = parseInt(parts[1]), sides = parseInt(parts[2]), mod = parseInt(parts[3]||'0');
  const rolls = [];
  for (let i = 0; i < count; i++) rolls.push(Math.ceil(Math.random()*sides));
  return { total: rolls.reduce((s,r)=>s+r,0)+mod, rolls, modifier: mod, formula: diceStr };
}

function showActionPopover(combatantIdx, actionIdx, actionType) {
  // Close any existing popover
  document.querySelectorAll('.action-popover').forEach(el => el.remove());

  const sb = getInitiative().combatants[combatantIdx].statBlock;
  const actionList = actionType === 'legendary' ? sb.legendary_actions :
                     actionType === 'reaction' ? sb.reactions : sb.actions;
  const action = actionList[actionIdx];
  if (!action) return;

  const attack = parseAttackInfo(action.desc || '');
  const btn = document.getElementById(`action-btn-${combatantIdx}-${actionType}-${actionIdx}`);

  let popHtml = `<div class="action-popover" id="action-popover-${combatantIdx}">`;
  popHtml += `<div class="action-popover-header"><strong>${esc(action.name)}</strong><button class="action-popover-close" onclick="this.closest('.action-popover').remove()">&times;</button></div>`;

  if (attack.attackBonus || attack.damageDice) {
    popHtml += `<div class="action-popover-attack">`;
    if (attack.attackBonus) popHtml += `<span class="attack-bonus">${attack.attackBonus} to hit</span>`;
    if (attack.damageDice) {
      popHtml += `<span class="attack-damage">${attack.damageDice} ${attack.damageType||''}</span>`;
      popHtml += `<button class="btn btn-sm dice-roll-btn" onclick="rollActionDamage(this,'${attack.damageDice}')" title="Roll damage">&#127922;</button>`;
    }
    popHtml += `</div>`;
  }

  popHtml += `<div class="action-popover-desc">${esc(action.desc||'')}</div>`;
  popHtml += `</div>`;

  if (btn) btn.insertAdjacentHTML('afterend', popHtml);
}

function rollActionDamage(btnEl, diceStr) {
  const result = rollDice(diceStr);
  let resultEl = btnEl.closest('.action-popover-attack').querySelector('.dice-result');
  if (!resultEl) {
    btnEl.insertAdjacentHTML('afterend', `<span class="dice-result"></span>`);
    resultEl = btnEl.closest('.action-popover-attack').querySelector('.dice-result');
  }
  resultEl.textContent = `= ${result.total} [${result.rolls.join('+')}${result.modifier?result.modifier>0?'+'+result.modifier:result.modifier:''}]`;
  resultEl.classList.add('dice-flash');
  setTimeout(() => resultEl.classList.remove('dice-flash'), 400);
}

function renderCombatantStatBlock(sb, combatantIdx) {
  const abilityMod = s => { const mod=Math.floor((s-10)/2); return (mod>=0?'+':'')+mod; };

  // Quick-reference action buttons
  const allActions = [];
  (sb.actions||[]).forEach((a,j) => allActions.push({...a, idx:j, type:'action'}));
  (sb.reactions||[]).forEach((a,j) => allActions.push({...a, idx:j, type:'reaction'}));
  (sb.legendary_actions||[]).forEach((a,j) => allActions.push({...a, idx:j, type:'legendary'}));

  let html = '';
  if (allActions.length) {
    html += `<div class="action-quick-bar">`;
    allActions.forEach(a => {
      const atk = parseAttackInfo(a.desc||'');
      const badge = atk.attackBonus ? ` <span class="action-badge">${atk.attackBonus}</span>` : '';
      html += `<button class="btn btn-sm action-quick-btn" id="action-btn-${combatantIdx}-${a.type}-${a.idx}" onclick="showActionPopover(${combatantIdx},${a.idx},'${a.type}')">${esc(a.name)}${badge}</button>`;
    });
    html += `</div><hr class="stat-block-divider">`;
  }

  html += `<div class="stat-block-meta">${esc(sb.size)} ${esc(sb.type)}, ${esc(sb.alignment)}</div>`;
  html += `<hr class="stat-block-divider">`;
  const speedStr = typeof sb.speed === 'string'
    ? esc(sb.speed)
    : Object.entries(sb.speed||{}).map(([k,v])=>`${k} ${v}`).join(', ');
  html += `<div><strong>Speed</strong> ${speedStr}</div>`;
  html += `<hr class="stat-block-divider">`;
  html += `<div class="ability-grid" style="margin:0.5rem 0">`;
  ['strength','dexterity','constitution','intelligence','wisdom','charisma'].forEach(a => {
    html += `<div class="ability-box"><div class="ability-name">${a.slice(0,3).toUpperCase()}</div><div style="font-size:1rem;font-weight:bold;color:var(--gold)">${sb[a]}</div><div class="ability-mod">${abilityMod(sb[a])}</div></div>`;
  });
  html += `</div><hr class="stat-block-divider">`;
  if (sb.saving_throws) html += `<div><strong>Saving Throws</strong> ${esc(sb.saving_throws)}</div>`;
  if (sb.skills) html += `<div><strong>Skills</strong> ${esc(sb.skills)}</div>`;
  if (sb.damage_resistances?.length) html += `<div><strong>Damage Resistances</strong> ${sb.damage_resistances.join(', ')}</div>`;
  if (sb.damage_immunities?.length) html += `<div><strong>Damage Immunities</strong> ${sb.damage_immunities.join(', ')}</div>`;
  if (sb.condition_immunities?.length) html += `<div><strong>Condition Immunities</strong> ${sb.condition_immunities.join(', ')}</div>`;
  const senseStr = Object.entries(sb.senses||{}).map(([k,v])=>`${k.replace(/_/g,' ')} ${v}`).join(', ');
  if (senseStr) html += `<div><strong>Senses</strong> ${senseStr}</div>`;
  if (sb.languages) html += `<div><strong>Languages</strong> ${esc(sb.languages)}</div>`;
  if (sb.challenge_rating !== undefined) html += `<div><strong>CR</strong> ${sb.challenge_rating} (${(sb.xp||0).toLocaleString()} XP)</div>`;
  html += `<hr class="stat-block-divider">`;
  if (sb.traits?.length) {
    html += `<div class="stat-block-section"><strong>Traits</strong>`;
    sb.traits.forEach(a => { html += `<div class="stat-block-entry"><em>${esc(a.name)}.</em> ${esc(a.desc||'')}</div>`; });
    html += `</div>`;
  }
  if (sb.actions?.length) {
    html += `<div class="stat-block-section"><strong>Actions</strong>`;
    sb.actions.forEach(a => { html += `<div class="stat-block-entry"><em>${esc(a.name)}.</em> ${esc(a.desc||'')}</div>`; });
    html += `</div>`;
  }
  if (sb.bonus_actions?.length) {
    html += `<div class="stat-block-section"><strong>Bonus Actions</strong>`;
    sb.bonus_actions.forEach(a => { html += `<div class="stat-block-entry"><em>${esc(a.name)}.</em> ${esc(a.desc||'')}</div>`; });
    html += `</div>`;
  }
  if (sb.reactions?.length) {
    html += `<div class="stat-block-section"><strong>Reactions</strong>`;
    sb.reactions.forEach(a => { html += `<div class="stat-block-entry"><em>${esc(a.name)}.</em> ${esc(a.desc||'')}</div>`; });
    html += `</div>`;
  }
  if (sb.legendary_actions?.length) {
    html += `<div class="stat-block-section"><strong>Legendary Actions</strong>`;
    sb.legendary_actions.forEach(a => { html += `<div class="stat-block-entry"><em>${esc(a.name)}.</em> ${esc(a.desc||'')}</div>`; });
    html += `</div>`;
  }
  return html;
}

// ── Character Data Model ──────────────────────────────────────────────────────
function syncClassFields(ch) {
  if (!ch.classes || !ch.classes.length) return;
  ch.class = ch.classes[0].class;
  ch.subclass = ch.classes[0].subclass;
  const total = ch.classes.reduce((sum, c) => sum + (c.level || 1), 0);
  ch.level = Math.min(total, 20);
  ch.proficiencyBonus = profBonus(ch.level);
}

function formatClassLine(ch) {
  if (!ch.classes || ch.classes.length <= 1) return esc(ch.class || 'Fighter');
  return ch.classes.map(c => `${esc(c.class)} ${c.level}`).join(' / ');
}

function newCharacter(name, race, cls, level) {
  return {
    id: uid(),
    name, race: race||'', class: cls||'Fighter', subclass: '', level: level||1,
    classes: [{ class: cls||'Fighter', subclass: '', level: level||1 }],
    background: '', alignment: 'True Neutral', xp: 0,
    proficiencyBonus: profBonus(level),
    inspiration: false,
    abilities: { str:10, dex:10, con:10, int:10, wis:10, cha:10 },
    saveProficiencies: [], skillProficiencies: [], skillExpertise: [],
    combat: { ac:10, initiative:0, speed:30, maxHP:10, currentHP:10, tempHP:0, hitDice:'1d8' },
    deathSaves: { successes:0, failures:0 },
    spells: {
      slots:    { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 },
      slotsMax: { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 },
      known: [], prepared: [],
      pactSlots: 0, pactSlotsMax: 0, pactSlotLevel: 0, _autoCalcApplied: true
    },
    attacks: [],
    equipment: [],
    currency: { cp:0, sp:0, ep:0, gp:0, pp:0 },
    features: '', traits: '', personality: '', ideals: '', bonds: '', flaws: '',
    proficiencies: '', languages: '', notes: '',
    createdAt: Date.now()
  };
}

// ── CharacterStore — central state manager ────────────────────────────────────
const CharacterStore = {
  /** Get a character by ID */
  get(id) { return db.characters[id] || null; },

  /** Get the active character for the current campaign */
  getActive() {
    const c = db.campaigns.find(c => c.id === currentCampaignId);
    if (!c || !c.activeCharId) return null;
    return db.characters[c.activeCharId] || null;
  },

  /** Mark a character as the active one for its campaign */
  setActive(charId) {
    const c = db.campaigns.find(c => c.id === currentCampaignId);
    if (c) { c.activeCharId = charId; saveData(db); }
  },

  /** Get all characters belonging to a campaign, in order */
  getAllForCampaign(campaignId) {
    const c = db.campaigns.find(c => c.id === campaignId);
    return (c?.characters || []).map(id => db.characters[id]).filter(Boolean);
  },

  /** Shallow-patch top-level fields on a character and save */
  update(id, patch) {
    if (!db.characters[id]) return;
    Object.assign(db.characters[id], patch);
    saveData(db);
  },

  /** Update current HP on the character record, then sync to any initiative
   *  combatant that is linked to this character via charId */
  updateCombatHP(charId, newHP) {
    const ch = db.characters[charId];
    if (!ch) return;
    ch.combat.currentHP = Math.max(0, Math.min(newHP, ch.combat.maxHP));
    // Sync to linked initiative combatant if present
    const campaign = db.campaigns.find(c => c.id === currentCampaignId);
    if (campaign?.initiative) {
      const cb = campaign.initiative.combatants.find(cb => cb.charId === charId);
      if (cb) { cb.hp = ch.combat.currentHP; cb.maxHP = ch.combat.maxHP; }
    }
    saveData(db);
  },

  /** Update a combatant's HP in the initiative tracker and sync back to character
   *  sheet if the combatant is a linked player character */
  updateInitiativeHP(campaignId, combatantIndex, newHP, newTempHP) {
    const campaign = db.campaigns.find(c => c.id === campaignId);
    if (!campaign?.initiative) return;
    const cb = campaign.initiative.combatants[combatantIndex];
    if (!cb) return;
    cb.hp = Math.max(0, Math.min(newHP, cb.maxHP));
    cb.tempHP = Math.max(0, newTempHP || 0);
    if (cb.type === 'player' && cb.charId) {
      const ch = db.characters[cb.charId];
      if (ch) {
        ch.combat.currentHP = cb.hp;
        ch.combat.tempHP = cb.tempHP;
      }
    }
    saveData(db);
  },

  /** Decrement a spell slot (current), floor 0 */
  useSpellSlot(charId, level) {
    const ch = db.characters[charId];
    if (!ch) return;
    const cur = ch.spells.slots[level] || 0;
    if (cur > 0) { ch.spells.slots[level] = cur - 1; saveData(db); }
  },

  /** Increment a spell slot (current), ceiling = slotsMax */
  restoreSpellSlot(charId, level) {
    const ch = db.characters[charId];
    if (!ch) return;
    const cur = ch.spells.slots[level] || 0;
    const max = ch.spells.slotsMax[level] || 0;
    if (cur < max) { ch.spells.slots[level] = cur + 1; saveData(db); }
  },

  /** Long rest: restore HP, spell slots, clear temp HP + death saves */
  longRest(charId) {
    const ch = db.characters[charId];
    if (!ch) return;
    ch.combat.currentHP = ch.combat.maxHP;
    ch.combat.tempHP    = 0;
    ch.deathSaves       = { successes:0, failures:0 };
    ch.inspiration      = false;
    ch.spells.slots     = { ...ch.spells.slotsMax };
    this.updateCombatHP(charId, ch.combat.currentHP);
    saveData(db);
  },

  /** Proficiency bonus derived from level */
  profBonus(charId) {
    const ch = db.characters[charId];
    return ch ? profBonus(ch.level) : 2;
  }
};
function profBonus(level) { return Math.ceil(level/4)+1; }

// ── Character Sheet — Helpers ─────────────────────────────────────────────────
const ABILITIES = ['str','dex','con','int','wis','cha'];
const ABILITY_NAMES = {str:'Strength',dex:'Dexterity',con:'Constitution',int:'Intelligence',wis:'Wisdom',cha:'Charisma'};
const ABILITY_SHORT = {str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA'};
const STANDARD_LANGUAGES = {
  standard: ['Common','Common Sign Language','Dwarvish','Elvish','Giant','Gnomish','Goblin','Halfling','Orc'],
  exotic:   ['Abyssal','Celestial','Deep Speech','Draconic','Infernal','Primordial','Sylvan','Undercommon'],
  secret:   ['Druidic',"Thieves' Cant"],
};
const SKILLS = [
  {name:'Acrobatics',ability:'dex'},{name:'Animal Handling',ability:'wis'},{name:'Arcana',ability:'int'},
  {name:'Athletics',ability:'str'},{name:'Deception',ability:'cha'},{name:'History',ability:'int'},
  {name:'Insight',ability:'wis'},{name:'Intimidation',ability:'cha'},{name:'Investigation',ability:'int'},
  {name:'Medicine',ability:'wis'},{name:'Nature',ability:'int'},{name:'Perception',ability:'wis'},
  {name:'Performance',ability:'cha'},{name:'Persuasion',ability:'cha'},{name:'Religion',ability:'int'},
  {name:'Sleight of Hand',ability:'dex'},{name:'Stealth',ability:'dex'},{name:'Survival',ability:'wis'},
];
const CLASS_ICONS = {
  Barbarian:'⚔', Bard:'♬', Cleric:'✙', Druid:'❧', Fighter:'⚔',
  Monk:'☯', Paladin:'✦', Ranger:'⚹', Rogue:'◈', Sorcerer:'✴',
  Warlock:'⛧', Wizard:'✶', Artificer:'⚙', 'Blood Hunter':'✸'
};
const HIT_DICE = {
  Barbarian:12, Bard:8, Cleric:8, Druid:8, Fighter:10, Monk:8, Paladin:10,
  Ranger:10, Rogue:8, Sorcerer:6, Warlock:8, Wizard:6, Artificer:8, 'Blood Hunter':10
};
// Saving throw proficiencies granted at class level 1
const CLASS_SAVE_PROFS = {
  Barbarian:['str','con'], Bard:['dex','cha'], Cleric:['wis','cha'],
  Druid:['int','wis'], Fighter:['str','con'], Monk:['str','dex'],
  Paladin:['wis','cha'], Ranger:['str','dex'], Rogue:['dex','int'],
  Sorcerer:['con','cha'], Warlock:['wis','cha'], Wizard:['int','wis'],
  Artificer:['con','int'], 'Blood Hunter':['dex','int']
};
// Starting skill proficiency choices per class (2024 PHB)
const CLASS_STARTING_PROFICIENCIES = {
  Barbarian:    { saves:['str','con'], choose:2, skills:['Animal Handling','Athletics','Intimidation','Nature','Perception','Survival'] },
  Bard:         { saves:['dex','cha'], choose:3, skills:['Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight','Intimidation','Investigation','Medicine','Nature','Perception','Performance','Persuasion','Religion','Sleight of Hand','Stealth','Survival'] },
  Cleric:       { saves:['wis','cha'], choose:2, skills:['History','Insight','Medicine','Persuasion','Religion'] },
  Druid:        { saves:['int','wis'], choose:2, skills:['Arcana','Animal Handling','Insight','Medicine','Nature','Perception','Religion','Survival'] },
  Fighter:      { saves:['str','con'], choose:2, skills:['Acrobatics','Animal Handling','Athletics','History','Insight','Intimidation','Perception','Survival'] },
  Monk:         { saves:['str','dex'], choose:2, skills:['Acrobatics','Athletics','History','Insight','Religion','Stealth'] },
  Paladin:      { saves:['wis','cha'], choose:2, skills:['Athletics','Insight','Intimidation','Medicine','Persuasion','Religion'] },
  Ranger:       { saves:['str','dex'], choose:3, skills:['Animal Handling','Athletics','Insight','Investigation','Nature','Perception','Stealth','Survival'] },
  Rogue:        { saves:['dex','int'], choose:4, skills:['Acrobatics','Athletics','Deception','Insight','Intimidation','Investigation','Perception','Performance','Persuasion','Sleight of Hand','Stealth'] },
  Sorcerer:     { saves:['con','cha'], choose:2, skills:['Arcana','Deception','Insight','Intimidation','Persuasion','Religion'] },
  Warlock:      { saves:['wis','cha'], choose:2, skills:['Arcana','Deception','History','Intimidation','Investigation','Nature','Religion'] },
  Wizard:       { saves:['int','wis'], choose:2, skills:['Arcana','History','Insight','Investigation','Medicine','Religion'] },
  Artificer:    { saves:['con','int'], choose:2, skills:['Arcana','History','Investigation','Medicine','Nature','Perception','Sleight of Hand'] },
  'Blood Hunter':{ saves:['dex','int'], choose:2, skills:['Acrobatics','Arcana','Athletics','History','Insight','Investigation','Perception','Survival'] },
};

// Proficiencies gained when multiclassing INTO a class (5e rules)
const CLASS_MC_PROFS = {
  Barbarian: 'Shields, simple weapons, martial weapons',
  Bard: 'Light armor, one skill of your choice, one instrument',
  Cleric: 'Light armor, medium armor, shields',
  Druid: 'Light armor, medium armor, shields',
  Fighter: 'Light armor, medium armor, shields, simple weapons, martial weapons',
  Monk: 'Simple weapons, shortswords',
  Paladin: 'Light armor, medium armor, shields, simple weapons, martial weapons',
  Ranger: 'Light armor, medium armor, shields, simple weapons, martial weapons, one skill from the Ranger list',
  Rogue: 'Light armor, one skill of your choice, thieves\' tools',
  Sorcerer: '—',
  Warlock: 'Light armor, simple weapons',
  Wizard: '—',
  Artificer: 'Light armor, medium armor, shields, thieves\' tools, tinker\'s tools',
  'Blood Hunter': 'Medium armor, martial weapons'
};
// Short accent color per class for badges
const CLASS_BADGE_COLORS = {
  Barbarian:'#ef4444', Bard:'#f59e0b', Cleric:'#fbbf24', Druid:'#22c55e',
  Fighter:'#64748b', Monk:'#06b6d4', Paladin:'#c084fc', Ranger:'#4ade80',
  Rogue:'#94a3b8', Sorcerer:'#f97316', Warlock:'#a855f7', Wizard:'#3b82f6',
  Artificer:'#14b8a6', 'Blood Hunter':'#dc2626'
};

// Returns the skill name from a skillProficiencies entry (string or {name,_class} object)
function skillProfName(entry) { return typeof entry === 'object' ? entry.name : entry; }
// Returns the source class from an entry, or null
function skillProfClass(entry) { return typeof entry === 'object' ? (entry._class || null) : null; }

function mod(score) { return Math.floor((score-10)/2); }
function modStr(score) { const m=mod(score); return (m>=0?'+':'')+m; }
function skillBonus(ch, skillName, abilityKey, pb) {
  const prof=(ch.skillProficiencies||[]).some(e=>skillProfName(e)===skillName);
  const exp=(ch.skillExpertise||[]).includes(skillName);
  return mod(ch.abilities[abilityKey])+(prof?pb:0)+(exp?pb:0);
}
function passivePerception(ch, pb) {
  return 10 + skillBonus(ch, 'Perception', 'wis', pb);
}

function renderPortraitCard(ch) {
  const icon = CLASS_ICONS[ch.class] || '⚔';
  const hasPortrait = !!ch.portrait;
  const zoom = ch.portraitZoom || 100;
  const px = ch.portraitX !== undefined ? ch.portraitX : 50;
  const py = ch.portraitY !== undefined ? ch.portraitY : 50;
  const portraitInner = hasPortrait
    ? `<div class="portrait-img-wrap">
        <img src="${ch.portrait}" style="width:100%;height:100%;object-fit:cover;object-position:${px}% ${py}%;transform:scale(${zoom/100});transform-origin:${px}% ${py}%">
      </div>`
    : `<span class="portrait-icon">${icon}</span>`;
  return `<div class="portrait-card">
    <div class="portrait-frame">${portraitInner}</div>
    <div class="portrait-info">
      <div class="portrait-name">${esc(ch.name)}</div>
      <div class="portrait-meta">${esc(ch.race || '—')} ${formatClassLine(ch)} &bull; Lv ${ch.level}</div>
    </div>
    <div class="flex gap-1" style="flex-wrap:wrap;justify-content:center">
      <label class="btn btn-sm portrait-upload-btn">
        ${hasPortrait ? 'Change' : 'Upload Portrait'}
        <input type="file" accept="image/*" onchange="uploadPortrait(event)" style="display:none">
      </label>
      ${hasPortrait ? `<button class="btn btn-sm portrait-upload-btn" onclick="openPortraitFramer(null)">Adjust</button>` : ''}
      ${hasPortrait ? `<button class="btn btn-sm portrait-upload-btn" onclick="removePortrait()">Remove</button>` : ''}
    </div>
  </div>`;
}

function uploadPortrait(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    openPortraitFramer(e.target.result);
  };
  reader.readAsDataURL(file);
}

function openPortraitFramer(newDataUrl) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const src = newDataUrl || ch.portrait;
  if (!src) return;
  const zoom = newDataUrl ? 100 : (ch.portraitZoom || 100);
  const px   = newDataUrl ? 50  : (ch.portraitX !== undefined ? ch.portraitX : 50);
  const py   = newDataUrl ? 50  : (ch.portraitY !== undefined ? ch.portraitY : 50);
  // Store pending src on window so sliders can read it
  window._pfSrc = src;
  openModal(`<h2>Frame Your Portrait ✦</h2>
    <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem">
      <div class="portrait-frame" style="overflow:hidden;position:relative">
        <img id="pf-img" src="${src}"
          style="width:100%;height:100%;object-fit:cover;
                 object-position:${px}% ${py}%;
                 transform:scale(${zoom/100});
                 transform-origin:${px}% ${py}%">
      </div>
      <div style="width:100%;max-width:320px">
        <div class="pf-slider-row">
          <label class="pf-label">Zoom</label>
          <input type="range" id="pf-zoom" min="100" max="300" value="${zoom}" step="1"
            oninput="pfUpdate()" style="accent-color:#9b6dff;flex:1">
          <span id="pf-zoom-val" class="pf-val">${zoom}%</span>
        </div>
        <div class="pf-slider-row">
          <label class="pf-label">Horizontal</label>
          <input type="range" id="pf-x" min="0" max="100" value="${px}" step="1"
            oninput="pfUpdate()" style="accent-color:#9b6dff;flex:1">
        </div>
        <div class="pf-slider-row">
          <label class="pf-label">Vertical</label>
          <input type="range" id="pf-y" min="0" max="100" value="${py}" step="1"
            oninput="pfUpdate()" style="accent-color:#9b6dff;flex:1">
        </div>
      </div>
      <div style="display:flex;gap:0.5rem;width:100%;max-width:320px">
        <button class="btn" style="flex:1" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" style="flex:2" onclick="savePortrait()">Save Portrait</button>
      </div>
    </div>
  `);
}

function pfUpdate() {
  const img = document.getElementById('pf-img'); if (!img) return;
  const zoom = document.getElementById('pf-zoom')?.value || 100;
  const px   = document.getElementById('pf-x')?.value || 50;
  const py   = document.getElementById('pf-y')?.value || 50;
  img.style.objectPosition = `${px}% ${py}%`;
  img.style.transform = `scale(${zoom/100})`;
  img.style.transformOrigin = `${px}% ${py}%`;
  const zv = document.getElementById('pf-zoom-val');
  if (zv) zv.textContent = zoom + '%';
}

function savePortrait() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.portrait    = window._pfSrc;
  ch.portraitZoom = parseInt(document.getElementById('pf-zoom')?.value) || 100;
  ch.portraitX   = parseInt(document.getElementById('pf-x')?.value);
  ch.portraitY   = parseInt(document.getElementById('pf-y')?.value);
  saveData(db);
  closeModal();
  renderApp();
}

function removePortrait() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  delete ch.portrait;
  ch.portraitZoom = 100; ch.portraitX = 50; ch.portraitY = 50;
  saveData(db); renderApp();
}

function renderAbilityScores(ch) {
  return `<div class="sheet-panel">
    <div class="cs-section-label">Ability Scores</div>
    <div class="ability-grid">
      ${ABILITIES.map(a=>`
        <div class="ability-box">
          <div class="ability-name">${ABILITY_SHORT[a]}</div>
          <input class="ability-score-input" type="number" id="ab-${a}" value="${ch.abilities[a]}" min="1" max="30" oninput="updateAbility('${a}',this.value)">
          <div class="ability-mod-circle" id="mod-${a}">${modStr(ch.abilities[a])}</div>
        </div>`).join('')}
    </div>
  </div>`;
}

const EXHAUSTION_EFFECTS = [
  '', // 0 — nothing shown
  'Disadvantage on ability checks',
  '+Speed halved',
  '+Disadv. on attacks/saves',
  '+HP max halved',
  '+Speed = 0',
  'Dead',
];

function renderCoreStats(ch, pb) {
  const exLevel = ch.exhaustionLevel || 0;
  const exEffect = EXHAUSTION_EFFECTS[exLevel] || '';
  const exPips = [1,2,3,4,5,6].map(n => {
    const filled = n <= exLevel;
    // clicking a filled pip at current level resets to 0; otherwise sets to n
    const onclick = filled && n === exLevel ? `setExhaustion(0)` : `setExhaustion(${n})`;
    return `<span class="ex-pip ${filled?'filled':''}" onclick="${onclick}" title="${filled?'Click to clear exhaustion':'Set exhaustion '+n}"></span>`;
  }).join('');
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Core Stats</div>
    <div class="cs-core-row"><span>Proficiency Bonus</span><span class="text-gold cs-core-val">+${pb}</span></div>
    <div class="cs-core-row"><span>Passive Perception</span><span class="text-gold cs-core-val">${passivePerception(ch,pb)}</span></div>
    <div class="cs-core-row"><span>Inspiration</span>
      <button class="cs-inspiration-toggle ${ch.inspiration?'active':''}" onclick="toggleInspiration()" title="Inspiration">&#9733;</button>
    </div>
    <div class="cs-core-row" style="border:none;flex-wrap:wrap;gap:0.25rem">
      <span>Exhaustion</span>
      <div class="ex-pips-row">${exPips}</div>
      ${exLevel > 0 ? `<span class="ex-effect-text">${esc(exEffect)}</span>` : ''}
    </div>
  </div>`;
}

function renderSavingThrows(ch, pb) {
  // Build a map: ability → [classNames] that grant it
  const classGrants = {};
  (ch.classes || []).forEach(entry => {
    const saves = CLASS_SAVE_PROFS[entry.class] || [];
    saves.forEach(a => {
      if (!classGrants[a]) classGrants[a] = [];
      if (!classGrants[a].includes(entry.class)) classGrants[a].push(entry.class);
    });
  });
  // Union: manually toggled OR granted by any class
  const allProfs = new Set([...(ch.saveProficiencies||[]), ...Object.keys(classGrants)]);
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Saving Throws</div>
    <ul class="skill-list">
      ${ABILITIES.map(a=>{
        const prof = allProfs.has(a);
        const total = mod(ch.abilities[a])+(prof?pb:0);
        const grantedBy = classGrants[a] || [];
        const badges = grantedBy.length > 1
          ? grantedBy.map(cls => `<span class="class-save-badge" style="background:${CLASS_BADGE_COLORS[cls]||'#9b6dff'}">${cls.slice(0,3).toUpperCase()}</span>`).join('')
          : (grantedBy.length === 1 ? `<span class="class-save-badge" style="background:${CLASS_BADGE_COLORS[grantedBy[0]]||'#9b6dff'}">${CLASS_ICONS[grantedBy[0]]||''}</span>` : '');
        return `<li>
          <span class="prof-dot ${prof?'proficient':''}" onclick="toggleSaveProf('${a}')" title="Toggle proficiency"></span>
          <span style="font-size:0.8rem">${ABILITY_NAMES[a]}</span>
          ${badges}
          <span class="skill-mod">${total>=0?'+':''}${total}</span>
        </li>`;
      }).join('')}
    </ul>
  </div>`;
}

function renderSkillList(ch, pb) {
  const profEntries = ch.skillProficiencies || [];
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Skills <span style="font-size:0.65rem;letter-spacing:0;color:var(--text-dim);text-transform:none">(click ● = prof, ◉ = expertise)</span></div>
    <ul class="skill-list">
      ${SKILLS.map(s=>{
        const entry = profEntries.find(e => skillProfName(e) === s.name);
        const prof = !!entry;
        const exp  = (ch.skillExpertise||[]).includes(s.name);
        const dotClass = exp?'expert':prof?'proficient':'';
        const total = skillBonus(ch,s.name,s.ability,pb);
        const srcClass = prof ? skillProfClass(entry) : null;
        const badge = srcClass
          ? `<span class="class-skill-badge" style="background:${CLASS_BADGE_COLORS[srcClass]||'#9b6dff'}" title="Granted by ${srcClass}">${CLASS_ICONS[srcClass]||srcClass.slice(0,2)}</span>`
          : '';
        return `<li>
          <span class="prof-dot ${dotClass}" onclick="toggleSkillProf('${s.name}')" title="${exp?'Expert':prof?'Proficient':'Not proficient'} — click to cycle"></span>
          <span style="font-size:0.8rem">${s.name}</span>
          ${badge}
          <span class="text-dim" style="font-size:0.7rem">(${ABILITY_SHORT[s.ability]})</span>
          <span class="skill-mod">${total>=0?'+':''}${total}</span>
        </li>`;
      }).join('')}
    </ul>
  </div>`;
}

function renderCombatSection(ch) {
  const hpPct=ch.combat.maxHP>0?Math.round((ch.combat.currentHP/ch.combat.maxHP)*100):100;
  const barClass=hpPct<=25?'low':hpPct<=50?'mid':'';
  const hdSides = HIT_DICE[ch.class] || 8;
  const hdTotal = ch.level || 1;
  const hdUsed = ch.combat.hitDiceUsed || 0;
  const hdRemaining = Math.max(0, hdTotal - hdUsed);
  return `<div class="sheet-panel">
    <div class="cs-section-label">Combat</div>
    <div class="cs-combat-trio">
      <div class="stat-box"><div class="stat-label">Armor Class</div><input type="number" value="${ch.combat.ac}" oninput="combatField('ac',+this.value)" style="width:100%;text-align:center;font-size:1.3rem;background:transparent;border:none;color:var(--gold);font-weight:bold"></div>
      <div class="stat-box"><div class="stat-label">Initiative</div><input type="number" value="${ch.combat.initiative}" oninput="combatField('initiative',+this.value)" style="width:100%;text-align:center;font-size:1.3rem;background:transparent;border:none;color:var(--gold);font-weight:bold"></div>
      <div class="stat-box"><div class="stat-label">Speed</div><input type="number" value="${ch.combat.speed}" oninput="combatField('speed',+this.value)" style="width:100%;text-align:center;font-size:1.3rem;background:transparent;border:none;color:var(--gold);font-weight:bold"></div>
    </div>
    <div class="hp-display" style="margin-top:0.6rem">
      <div class="hp-duo">
        <div class="hp-block" onclick="openEditHP('maxHP')"><div class="hp-block-label">Max HP</div><div class="hp-block-val">${ch.combat.maxHP}</div></div>
        <div class="hp-block hp-current" id="hp-current-block"><div class="hp-block-label">Current HP</div><div class="hp-block-val" id="hp-current-val">${ch.combat.currentHP}</div></div>
      </div>
      <div class="hp-bar-wrap">
        <div class="hp-bar ${barClass}" id="cs-hp-bar" style="width:${hpPct}%"></div>
        ${ch.combat.tempHP > 0 ? `<div class="hp-bar-temp" id="cs-hp-temp-bar" style="width:${Math.min(100, Math.round(((ch.combat.currentHP + ch.combat.tempHP) / ch.combat.maxHP) * 100))}%"></div>` : ''}
      </div>
      <div class="temp-hp-row">
        <span class="temp-hp-label">Temp HP</span>
        <button class="btn btn-sm hd-adj-btn" onclick="adjustTempHP(-1)">&#8722;</button>
        <input type="number" class="temp-hp-input" id="temp-hp-val" value="${ch.combat.tempHP}" min="0"
          onchange="setTempHP(+this.value)" onkeydown="if(event.key==='Enter'){this.blur();}">
        <button class="btn btn-sm hd-adj-btn" onclick="adjustTempHP(1)">+</button>
      </div>
      <div class="hp-inline-controls">
        <div class="hp-inline-row hp-dmg-row">
          <input type="number" id="dmg-inline" class="hp-inline-input" min="0" value="" placeholder="0"
            onkeydown="if(event.key==='Enter')applyDamageInline()">
          <button class="hp-inline-btn hp-dmg-btn" onclick="applyDamageInline()">&#8722; Damage</button>
        </div>
        <div class="hp-inline-row hp-heal-row">
          <input type="number" id="heal-inline" class="hp-inline-input" min="0" value="" placeholder="0"
            onkeydown="if(event.key==='Enter')applyHealInline()">
          <button class="hp-inline-btn hp-heal-btn" onclick="applyHealInline()">+ Heal</button>
        </div>
      </div>
      <div class="hp-rest-row">
        <button class="hp-grid-btn hp-long-btn" onclick="doLongRest()"><span class="hp-grid-icon">&#9789;</span><span class="hp-grid-label">Long Rest</span></button>
        <button class="hp-grid-btn hp-short-btn" onclick="openShortRestDialog()"><span class="hp-grid-icon">&#10040;</span><span class="hp-grid-label">Short Rest</span></button>
      </div>
    </div>
    ${ch.activeConcentration ? `
    <div class="conc-tracker">
      <span class="conc-pill">◈ Concentrating: ${esc(ch.activeConcentration.spellName)}${ch.activeConcentration.castLevel ? ` (${['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'][ch.activeConcentration.castLevel]})` : ''}</span>
      <button class="conc-clear-btn" onclick="clearConcentration()" title="End concentration">×</button>
    </div>` : ''}
    <div class="death-saves-row">
      <span class="cs-field-label">Death Saves</span>
      <span class="ds-group">
        <span class="ds-label" style="color:var(--green-lt)">Success:</span>
        ${[0,1,2].map(i=>`<input type="checkbox" ${(ch.deathSaves.successes||0)>i?'checked':''} onchange="updateDeathSave('successes',${i},this.checked)">`).join('')}
      </span>
      <span class="ds-group">
        <span class="ds-label" style="color:var(--red-lt)">Fail:</span>
        ${[0,1,2].map(i=>`<input type="checkbox" ${(ch.deathSaves.failures||0)>i?'checked':''} onchange="updateDeathSave('failures',${i},this.checked)">`).join('')}
      </span>
    </div>
    <div class="hd-row">
      <span class="cs-field-label">Hit Dice:</span>
      <span class="hd-val">${hdRemaining}/${hdTotal}d${hdSides}</span>
      <button class="btn btn-sm hd-adj-btn" onclick="adjustHitDice(-1)" title="Use a hit die">&#8722;</button>
      <button class="btn btn-sm hd-adj-btn" onclick="adjustHitDice(1)" title="Restore a hit die">+</button>
    </div>
  </div>`;
}

function renderAttacksSection(ch) {
  const rows = ch.attacks||[];
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Attacks &amp; Spellcasting</div>
    <table class="attacks-table">
      <thead><tr>
        <th style="width:24%">Name</th>
        <th style="width:19%">Type</th>
        <th style="width:13%">Bonus</th>
        <th style="width:26%">Damage / Type</th>
        <th style="width:18%"></th>
      </tr></thead>
      <tbody>
        ${rows.length === 0 ? `<tr><td colspan="5" style="text-align:center;color:var(--text-dim);font-style:italic;padding:0.8rem">No attacks added yet.</td></tr>` : ''}
        ${rows.map((atk,i)=>`<tr>
          <td><input class="attack-input" value="${esc(atk.name)}" placeholder="Longsword" oninput="updateAttack(${i},'name',this.value)"></td>
          <td><select class="attack-type-select" onchange="autoCalcAttackBonus(${i},this.value)">
            <option value="" ${!atk.weaponType?'selected':''}>—</option>
            <option value="melee-str" ${atk.weaponType==='melee-str'?'selected':''}>Melee (STR)</option>
            <option value="melee-finesse" ${atk.weaponType==='melee-finesse'?'selected':''}>Melee Finesse</option>
            <option value="ranged-dex" ${atk.weaponType==='ranged-dex'?'selected':''}>Ranged (DEX)</option>
            <option value="spell" ${atk.weaponType==='spell'?'selected':''}>Spell Attack</option>
          </select></td>
          <td><input class="attack-input" value="${esc(atk.bonus)}" placeholder="+5" oninput="updateAttack(${i},'bonus',this.value)"></td>
          <td><input class="attack-input" value="${esc(atk.damage)}" placeholder="1d8+3 slashing" oninput="updateAttack(${i},'damage',this.value)"></td>
          <td class="attack-actions">
            <button class="btn btn-icon" onclick="rollAttack(${i})" title="Roll attack">🎲</button>
            <button class="btn btn-icon" onclick="rollDamage(${i})" title="Roll damage">⚄</button>
            <button class="btn btn-icon btn-danger" onclick="removeAttack(${i})">&times;</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div style="display:flex;gap:0.4rem;margin-top:0.5rem">
      <button class="btn btn-sm" onclick="addAttack()">+ Add Attack</button>
      <button class="btn btn-sm" onclick="openWeaponPicker()">⚔ Pick Weapon</button>
    </div>
  </div>`;
}

function renderEquipmentCurrency(ch) {
  const eqRows = (ch.equipment||[]).map((item, i) => {
    if (item && typeof item === 'object' && item._magic) {
      const color = MAGIC_RARITY_COLORS[item.rarity] || '#9ca3af';
      const attuneTxt = item.attunement ? ` <span style="font-size:0.65rem;color:#f59e0b">⟡</span>` : '';
      const descBtn = item.desc ? `<button id="eqbt-${i}" class="btn btn-icon" onclick="toggleEquipDesc(${i})" style="font-size:0.7rem;padding:0 0.25rem">▾</button>` : '';
      return `<li class="eq-item eq-item-magic">
        <span class="eq-magic-dot" style="background:${color}" title="${esc(MAGIC_RARITY_LABELS[item.rarity]||item.rarity)}"></span>
        <span class="eq-name">${esc(item.name)}${attuneTxt}</span>
        ${descBtn}
        <button class="btn btn-icon btn-danger" onclick="removeEquipment(${i})">&times;</button>
        ${item.desc ? `<div id="eqdesc-${i}" style="display:none;width:100%;font-size:0.75rem;color:var(--text-dim);padding:0.25rem 0 0.1rem;border-top:1px solid var(--border);margin-top:0.2rem">${esc(item.desc)}</div>` : ''}
      </li>`;
    }
    const label = typeof item === 'object' ? (item.name || '?') : item;
    return `<li class="eq-item"><span class="eq-name">${esc(label)}</span><button class="btn btn-icon btn-danger" onclick="removeEquipment(${i})">&times;</button></li>`;
  }).join('');
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Equipment</div>
    <ul class="eq-list" style="max-height:200px;overflow-y:auto">${eqRows}</ul>
    <div class="eq-add-row">
      <input type="text" id="eq-input" placeholder="Add item..." onkeydown="if(event.key==='Enter')addEquipment()">
      <button class="btn btn-sm" onclick="addEquipment()">Add</button>
      <button class="btn btn-sm" onclick="openMagicItemBrowser()">⚔ Magic Item</button>
    </div>
    <div style="margin-top:0.8rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.3rem">
        <div class="cs-field-label" style="margin:0">Attunement</div>
        <span class="attune-count">${(ch.attunedItems||[]).length}/3</span>
      </div>
      <div class="attune-slots">
        ${[0,1,2].map(i => {
          const item = (ch.attunedItems||[])[i];
          if (item) {
            return `<div class="attune-slot attune-filled">
              <span class="attune-name">${esc(item)}</span>
              <button class="btn btn-icon btn-danger" onclick="unattuneItem(${i})" style="font-size:0.7rem;padding:0 0.2rem">&times;</button>
            </div>`;
          }
          // Find magic items with attunement requirement not already attuned
          const attunable = (ch.equipment||[]).filter(e =>
            typeof e === 'object' && e._magic && e.attunement && !(ch.attunedItems||[]).includes(e.name)
          );
          if (!attunable.length) {
            return `<div class="attune-slot attune-empty"><span class="attune-empty-label">— empty —</span></div>`;
          }
          const opts = attunable.map(e => `<option value="${esc(e.name)}">${esc(e.name)}</option>`).join('');
          return `<div class="attune-slot attune-empty">
            <select class="lang-add-select" style="font-size:0.72rem;width:100%" onchange="attuneItem(this.value,${i});this.value=''">
              <option value="">+ Attune item…</option>${opts}
            </select>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div style="margin-top:0.8rem">
      <div class="cs-field-label" style="color:var(--gold);margin-bottom:0.4rem">Currency</div>
      <div class="currency-grid">
        ${['cp','sp','ep','gp','pp'].map(coin=>`<div class="currency-cell"><label>${coin.toUpperCase()}</label><input type="number" min="0" value="${(ch.currency||{})[coin]||0}" oninput="updateCurrency('${coin}',+this.value)"></div>`).join('')}
      </div>
    </div>
  </div>`;
}

// ── Spells System ─────────────────────────────────────────────────────────────
const SPELL_ABILITY = {
  Bard:'cha', Cleric:'wis', Druid:'wis', Paladin:'cha', Ranger:'wis',
  Sorcerer:'cha', Warlock:'cha', Wizard:'int', Artificer:'int',
  'Blood Hunter':'int'
};
// ── Spellcasting Tables ──────────────────────────────────────────────────────
const CASTER_TYPE = {
  Bard:'full',Cleric:'full',Druid:'full',Sorcerer:'full',Wizard:'full',
  Paladin:'half',Ranger:'half',Artificer:'artificer',Warlock:'pact'
};
const THIRD_CASTER_SUBCLASSES = { Fighter:['Eldritch Knight'], Rogue:['Arcane Trickster'] };
// index 0 unused; index 1..20 = slots per spell level [1st..9th]
const FULL_CASTER_SLOTS = [null,
  [2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]
];
const HALF_CASTER_SLOTS = [null,
  [0,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],[4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,0,0,0,0]
];
const THIRD_CASTER_SLOTS = [null,
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],
  [3,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],
  [4,3,3,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,1,0,0,0,0,0]
];
const ARTIFICER_SLOTS = [null,
  [2,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],[4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,0,0,0,0]
];
// Pact Magic: { slots, level } per warlock level
const PACT_MAGIC_TABLE = [null,
  {slots:1,level:1},{slots:2,level:1},{slots:2,level:2},{slots:2,level:2},
  {slots:2,level:3},{slots:2,level:3},{slots:2,level:4},{slots:2,level:4},
  {slots:2,level:5},{slots:2,level:5},{slots:3,level:5},{slots:3,level:5},
  {slots:3,level:5},{slots:3,level:5},{slots:3,level:5},{slots:3,level:5},
  {slots:4,level:5},{slots:4,level:5},{slots:4,level:5},{slots:4,level:5}
];
const PREPARED_SPELL_LIMIT = {
  Wizard: (level, intMod) => level + intMod,
  Cleric: (level, wisMod) => level + wisMod,
  Druid: (level, wisMod) => level + wisMod,
  Paladin: (level, chaMod) => Math.max(1, Math.floor(level/2) + chaMod),
  Artificer: (level, intMod) => Math.max(1, Math.ceil(level/2) + intMod)
};

function _classCasterType(entry) {
  const ct = CASTER_TYPE[entry.class];
  if (ct) return ct;
  const subs = THIRD_CASTER_SUBCLASSES[entry.class];
  if (subs && subs.includes(entry.subclass)) return 'third';
  return null;
}

function calculateSpellSlots(ch) {
  const classes = ch.classes || [];
  const result = { slotsMax:{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0}, pactSlots:0, pactSlotLevel:0, hasWarlock:false };
  // Pact Magic (Warlock)
  const warlock = classes.find(c => c.class === 'Warlock');
  if (warlock) {
    result.hasWarlock = true;
    const pm = PACT_MAGIC_TABLE[Math.min(warlock.level||1, 20)];
    if (pm) { result.pactSlots = pm.slots; result.pactSlotLevel = pm.level; }
  }
  // Gather non-Warlock caster classes
  const casters = [];
  for (const c of classes) {
    const ct = _classCasterType(c);
    if (ct && ct !== 'pact') casters.push({ ...c, casterType: ct });
  }
  let table;
  if (casters.length === 0) {
    return result; // no regular slots
  } else if (casters.length === 1) {
    // Single-class: use class-specific table
    const c = casters[0], lvl = Math.min(c.level||1, 20);
    if (c.casterType === 'full') table = FULL_CASTER_SLOTS[lvl];
    else if (c.casterType === 'half') table = HALF_CASTER_SLOTS[lvl];
    else if (c.casterType === 'third') table = THIRD_CASTER_SLOTS[lvl];
    else if (c.casterType === 'artificer') table = ARTIFICER_SLOTS[lvl];
  } else {
    // Multiclass: sum effective caster levels
    let effectiveLevel = 0;
    for (const c of casters) {
      const lvl = c.level || 1;
      if (c.casterType === 'full') effectiveLevel += lvl;
      else if (c.casterType === 'half') effectiveLevel += (lvl >= 2 ? Math.floor(lvl / 2) : 0);
      else if (c.casterType === 'third') effectiveLevel += (lvl >= 3 ? Math.floor(lvl / 3) : 0);
      else if (c.casterType === 'artificer') effectiveLevel += Math.ceil(lvl / 2);
    }
    effectiveLevel = Math.min(effectiveLevel, 20);
    table = effectiveLevel > 0 ? FULL_CASTER_SLOTS[effectiveLevel] : null;
  }
  if (table) {
    for (let i = 0; i < 9; i++) result.slotsMax[i+1] = table[i] || 0;
  }
  return result;
}

function applySpellSlots(ch) {
  const calc = calculateSpellSlots(ch);
  for (let lvl = 1; lvl <= 9; lvl++) {
    ch.spells.slotsMax[lvl] = calc.slotsMax[lvl] || 0;
    if ((ch.spells.slots[lvl]||0) > ch.spells.slotsMax[lvl]) ch.spells.slots[lvl] = ch.spells.slotsMax[lvl];
  }
  ch.spells.pactSlotsMax = calc.hasWarlock ? calc.pactSlots : 0;
  ch.spells.pactSlotLevel = calc.hasWarlock ? calc.pactSlotLevel : 0;
  if ((ch.spells.pactSlots||0) > ch.spells.pactSlotsMax) ch.spells.pactSlots = ch.spells.pactSlotsMax;
}

const SCHOOL_COLORS = {
  Abjuration:'#6d8fd4', Conjuration:'#6dba8f', Divination:'#c4a85a',
  Enchantment:'#c084fc', Evocation:'#e87070', Illusion:'#7b9dd4',
  Necromancy:'#9c7bc4', Transmutation:'#7bbdb8'
};
const SPELL_ALL_KEY    = 'dnd_spells_local_v1';
const CUSTOM_SPELLS_KEY = 'dnd_custom_spells_v1';

let allSpellsDb   = null; // sorted master list from API
let customSpells  = null; // [{...}, ...]  user-created
let spellViewTab  = 'all'; // 'all' | 'known' | 'prepared'
let spellFilters  = { q:'', level:'all', school:'all', cls:'all', source:'all', conc:false, ritual:false };
let spellFetching = false;
let spellShowCount = 100;

function loadAllSpells() {
  if (allSpellsDb) return;
  try { allSpellsDb = JSON.parse(localStorage.getItem(SPELL_ALL_KEY)) || null; }
  catch { allSpellsDb = null; }
}
function saveAllSpells() {
  try { localStorage.setItem(SPELL_ALL_KEY, JSON.stringify(allSpellsDb)); } catch {}
}
function loadCustomSpells() {
  if (customSpells) return;
  try { customSpells = JSON.parse(localStorage.getItem(CUSTOM_SPELLS_KEY)) || []; }
  catch { customSpells = []; }
}
function saveCustomSpells() {
  try { localStorage.setItem(CUSTOM_SPELLS_KEY, JSON.stringify(customSpells)); } catch {}
}

function getMergedSpells() {
  loadAllSpells(); loadCustomSpells();
  const api = allSpellsDb || [];
  // Deduplicate API spells by name (same spell can appear in multiple sourcebooks)
  const seen = new Set();
  const deduped = [];
  for (const sp of api) {
    if (!seen.has(sp.name)) { seen.add(sp.name); deduped.push(sp); }
  }
  return [...deduped, ...customSpells.map(s => ({...s, _custom:true}))];
}

async function fetchAllSpells() {
  if (spellFetching) return;
  spellFetching = true;
  setSpellStatus('✾ Loading spells…');
  try {
    const res = await fetch('./data/spells.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const all = await res.json();
    allSpellsDb = Array.isArray(all) ? all : [];
    saveAllSpells();
    setSpellStatus('');
    renderSpellTabContent();
  } catch(e) {
    setSpellStatus('Could not load spells — data/spells.json missing or invalid.', true);
  } finally { spellFetching = false; }
}

function setSpellStatus(msg, isErr) {
  const el = document.getElementById('spell-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = isErr ? 'var(--red-lt)' : 'var(--text-dim)';
}

function switchSpellTab(tab) {
  spellViewTab = tab;
  spellShowCount = 100;  // Reset to initial count when switching tabs
  renderSpellTabContent();
  document.querySelectorAll('.spell-tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
}

function applySpellFilter(key, value) {
  if (typeof spellFilters[key] === 'boolean') spellFilters[key] = !spellFilters[key];
  else spellFilters[key] = value;
  spellShowCount = 100;
  if (spellViewTab === 'all') updateSpellResults();
  else renderSpellTabContent();
}

function renderSpellTabContent() {
  const el = document.getElementById('spell-tab-content'); if (!el) return;
  const ch = db.characters[currentCharId]; if (!ch) return;
  // Auto-fetch spells if not loaded yet and not already fetching
  if (spellViewTab === 'all' && !allSpellsDb && !spellFetching) {
    fetchAllSpells();
    return;
  }
  if      (spellViewTab === 'all')      el.innerHTML = renderAllSpellsView(ch);
  else if (spellViewTab === 'known')    el.innerHTML = renderKnownView(ch);
  else if (spellViewTab === 'prepared') el.innerHTML = renderPreparedView(ch);
  // Keep tab count badges in sync
  document.querySelectorAll('.spell-tab').forEach(btn => {
    const tab = btn.dataset.tab;
    const badge = btn.querySelector('.spell-count');
    if (!badge) return;
    if (tab === 'known')    badge.textContent = (ch.spells.known    || []).length;
    if (tab === 'prepared') {
      const prepared = (ch.spells.prepared || []).length;
      // Calculate prepared spell limit if applicable
      const classesWithLimit = (ch.classes||[]).filter(c => PREPARED_SPELL_LIMIT[c.class]);
      if (classesWithLimit.length > 0) {
        const c = classesWithLimit[0];
        const ab = SPELL_ABILITY[c.class];
        const abilityMod = mod(ch.abilities[ab]);
        const limit = PREPARED_SPELL_LIMIT[c.class](c.level, abilityMod);
        badge.textContent = `${prepared}/${limit}`;
        badge.style.color = prepared > limit ? 'var(--red-lt)' : '';
      } else {
        badge.textContent = prepared;
      }
    }
  });
}

function getFilteredAllSpells(ch) {
  const merged = getMergedSpells();
  const f = spellFilters;
  return merged.filter(sp => {
    if (f.q && !sp.name.toLowerCase().includes(f.q.toLowerCase()) && !(sp.school||'').toLowerCase().includes(f.q.toLowerCase()) && !(sp.desc||'').toLowerCase().includes(f.q.toLowerCase())) return false;
    if (f.level !== 'all' && (sp.level_int ?? -1) !== parseInt(f.level)) return false;
    if (f.school !== 'all' && (sp.school||'').toLowerCase() !== f.school.toLowerCase()) return false;
    if (f.cls !== 'all') {
      const classes = (sp.dnd_class || sp.page || '').toLowerCase();
      if (!classes.includes(f.cls.toLowerCase())) return false;
    }
    if (f.source !== 'all') {
      const sourceMap = { "Player's Handbook (2024)": 'phb2024', "Xanathar's Guide to Everything": 'xge', "Tasha's Cauldron of Everything": 'tce', "Explorer's Guide to Wildemount": 'egw', "Free Basic Rules (2024)": 'basic2024', "Free Basic Rules (2014)": 'basic2014', "Player's Handbook": 'phb2014' };
      if (sourceMap[sp.source] !== f.source) return false;
    }
    if (f.conc   && sp.concentration !== 'yes') return false;
    if (f.ritual && sp.ritual        !== 'yes') return false;
    return true;
  });
}

function renderFilterBar() {
  const schools = ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'];
  const classes = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard','Artificer','Blood Hunter'];
  const sources = [
    {val:'all',label:'All Sources'},
    {val:'phb2024',label:'PHB 2024'},
    {val:'phb2014',label:'PHB 2014'},
    {val:'xge',label:"Xanathar's (XGE)"},
    {val:'tce',label:"Tasha's (TCE)"},
    {val:'egw',label:"Explorer's Guide (EGW)"},
    {val:'basic2024',label:'Basic Rules 2024'},
    {val:'basic2014',label:'Basic Rules 2014'},
  ];
  return `<div class="spell-filter-bar">
    <div class="spell-search-wrap">
      <span class="spell-search-icon">✾</span>
      <input type="text" class="spell-filter-input" placeholder="Search spells…" value="${esc(spellFilters.q)}"
        oninput="spellFilters.q=this.value;updateSpellResults()">
    </div>
    <select class="spell-filter-select" onchange="applySpellFilter('level',this.value)">
      <option value="all"${spellFilters.level==='all'?' selected':''}>All Levels</option>
      <option value="0"${spellFilters.level==='0'?' selected':''}>Cantrip</option>
      ${[1,2,3,4,5,6,7,8,9].map(l=>`<option value="${l}"${spellFilters.level===String(l)?' selected':''}>${l}${['st','nd','rd','th','th','th','th','th','th'][l-1]}-level</option>`).join('')}
    </select>
    <select class="spell-filter-select" onchange="applySpellFilter('school',this.value)">
      <option value="all"${spellFilters.school==='all'?' selected':''}>All Schools</option>
      ${schools.map(s=>`<option value="${s}"${spellFilters.school===s?' selected':''}>${s}</option>`).join('')}
    </select>
    <select class="spell-filter-select" onchange="applySpellFilter('cls',this.value)">
      <option value="all"${spellFilters.cls==='all'?' selected':''}>All Classes</option>
      ${classes.map(c=>`<option value="${c}"${spellFilters.cls===c?' selected':''}>${c}</option>`).join('')}
    </select>
    <select class="spell-filter-select" onchange="applySpellFilter('source',this.value)">
      <option value="all"${spellFilters.source==='all'?' selected':''}>All Sources</option>
      ${sources.map(s=>`<option value="${s.val}"${spellFilters.source===s.val?' selected':''}>${s.label}</option>`).join('')}
    </select>
    <label class="spell-filter-toggle${spellFilters.conc?' active':''}">
      <input type="checkbox" ${spellFilters.conc?'checked':''} onchange="applySpellFilter('conc')"> C
    </label>
    <label class="spell-filter-toggle${spellFilters.ritual?' active':''}">
      <input type="checkbox" ${spellFilters.ritual?'checked':''} onchange="applySpellFilter('ritual')"> R
    </label>
  </div>`;
}

function renderSpellResultsHtml(ch) {
  if (!allSpellsDb) {
    return `<div class="spell-loading" style="padding:1rem;text-align:center">
      <span id="spell-status" style="font-size:0.75rem;color:var(--text-dim)">✾ Loading spells…</span>
    </div>`;
  }
  const known    = new Set((ch.spells.known    ||[]).map(s=>typeof s==='object'?s.name:s));
  const prepared = new Set((ch.spells.prepared ||[]).map(s=>typeof s==='object'?s.name:s));
  const filtered = getFilteredAllSpells(ch);
  const show = filtered.slice(0, spellShowCount);
  const remaining = Math.max(0, filtered.length - spellShowCount);
  return `<div style="display:flex;align-items:center;justify-content:space-between;margin:0.3rem 0 0.4rem;font-size:0.7rem;color:var(--text-dim)">
      <span>${filtered.length} spells${filtered.length > spellShowCount ? ` (showing ${spellShowCount})` : ''}</span>
      <div class="flex gap-1">
        <button class="btn btn-sm" onclick="openCustomSpellModal()">+ Custom Spell</button>
        <button class="btn btn-sm" onclick="fetchAllSpells()" title="Reload spells from local file">↻</button>
      </div>
    </div>
    <span id="spell-status" style="font-size:0.72rem"></span>
    <div class="spell-api-list">
      ${show.length === 0 ? `<p class="spell-empty">No spells match filters.</p>` :
        show.map(sp => {
          const school = sp.school || '';
          const sc = SCHOOL_COLORS[school] || '#7b6d8d';
          const lvlLabel = sp.level_int === 0 ? 'Cantrip' : sp.level || '';
          const inK = known.has(sp.name), inP = prepared.has(sp.name);
          const sourceMap = { "Player's Handbook (2024)": {abbr:'PHB24',color:'#c084fc'}, "Xanathar's Guide to Everything": {abbr:'XGE',color:'#3b82f6'}, "Tasha's Cauldron of Everything": {abbr:'TCE',color:'#14b8a6'}, "Explorer's Guide to Wildemount": {abbr:'EGW',color:'#f59e0b'}, "Free Basic Rules (2024)": {abbr:'BR24',color:'#9b6dff'}, "Free Basic Rules (2014)": {abbr:'BR14',color:'#9b6dff'}, "Player's Handbook": {abbr:'PHB14',color:'#6d7b9b'} };
          const srcInfo = sourceMap[sp.source] || {abbr:'?',color:'#7b6d8d'};
          const safeData = encodeURIComponent(JSON.stringify({name:sp.name,level_int:sp.level_int||0,school:sp.school||'',casting_time:sp.casting_time||'',range:sp.range||'',components:sp.components||'',concentration:sp.concentration||'no',ritual:sp.ritual||'no',dnd_class:sp.dnd_class||'',_custom:sp._custom||false}));
          return `<div class="spell-browser-row">
            <div class="spell-browser-left">
              ${sp._custom?`<span style="font-size:0.6rem;color:#c084fc;border:1px solid rgba(192,132,252,0.4);border-radius:3px;padding:0 3px;flex-shrink:0">✏</span>`:''}
              <span class="spell-name" style="font-size:0.82rem">${esc(sp.name)}</span>
              <span class="spell-badge" style="border-color:${sc};color:${sc};font-size:0.58rem">${esc(lvlLabel)}${lvlLabel&&school?' · ':''}${esc(school)}</span>
              ${srcInfo.abbr !== '?' ? `<span class="spell-source-badge" style="background:${srcInfo.color}">${srcInfo.abbr}</span>` : ''}
              ${sp.concentration==='yes'?`<span class="spell-tag conc">C</span>`:''}
              ${sp.ritual==='yes'?`<span class="spell-tag ritual">R</span>`:''}
            </div>
            <div class="flex gap-1" style="flex-shrink:0">
              <button class="btn btn-sm" onclick="toggleSpellDesc('sd-all-${esc(sp.name).replace(/\s/g,'-')}')">▾</button>
              <button class="btn btn-sm${inP?' btn-primary':''}" onclick="spellAddFromEncoded('prepared','${safeData}')">${inP?'✓ Prep':'Prepare'}</button>
              <button class="btn btn-sm${inK?' btn-primary':''}" onclick="spellAddFromEncoded('known','${safeData}')">${inK?'✓ Known':'Learn'}</button>
            </div>
          </div>
          <div class="spell-desc hidden" id="sd-all-${esc(sp.name).replace(/\s/g,'-')}" style="margin:0 0 0.3rem 0.5rem;border-top:none;padding-top:0.2rem">${esc(sp.desc||'No description.')}</div>`;
        }).join('')}
    </div>
    ${remaining > 0 ? `<button class="btn btn-sm" style="width:100%;margin-top:0.5rem" onclick="spellShowCount+=100;updateSpellResults()">Show more (${remaining} remaining)</button>` : ''}`;
}

function updateSpellResults() {
  const el = document.getElementById('spell-results');
  const ch = db.characters[currentCharId];
  if (!el || !ch) return;
  el.innerHTML = renderSpellResultsHtml(ch);
}

function renderAllSpellsView(ch) {
  loadAllSpells(); loadCustomSpells();
  return `${renderFilterBar()}<div id="spell-results">${renderSpellResultsHtml(ch)}</div>`;
}

function fullSpellData(sp) {
  // Merge stored spell with full entry from allSpellsDb so desc is never truncated
  const name = typeof sp === 'object' ? sp.name : sp;
  const fromDb = (allSpellsDb || []).find(s => s.name === name)
              || (customSpells || []).find(s => s.name === name);
  return fromDb ? { ...fromDb, ...(typeof sp === 'object' ? sp : {}), desc: fromDb.desc || (typeof sp === 'object' ? sp.desc : '') } : sp;
}

function groupSpellsByLevel(spells) {
  const levelLabel = lvl => lvl === 0 ? 'Cantrips' : `${['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'][lvl] || lvl+'th'} Level`;
  const groups = {};
  const order = [];
  spells.forEach(entry => {
    const lvl = typeof entry.full === 'object' ? (entry.full.level_int ?? 99) : 99;
    const key = levelLabel(lvl);
    if (!groups[key]) { groups[key] = []; order.push({ key, lvl }); }
    groups[key].push(entry);
  });
  order.sort((a, b) => a.lvl - b.lvl);
  return order.map(({ key }) => ({ label: key, spells: groups[key] }));
}

function renderKnownView(ch) {
  const known    = ch.spells.known    || [];
  const prepared = new Set((ch.spells.prepared||[]).map(s=>typeof s==='object'?s.name:s));
  if (known.length === 0) return `<p class="spell-empty" style="padding:1rem 0">No known spells. Add some from All Spells ↑</p>`;
  const entries = known.map((sp, i) => ({ full: fullSpellData(sp), i }));
  const grouped = groupSpellsByLevel(entries);
  return `<div>${grouped.map(({ label, spells }) => `
    <div class="spell-group">
      <div class="spell-group-heading">${label} <span class="spell-count">${spells.length}</span></div>
      ${spells.map(({ full: sp, i }) => {
        const isObj = typeof sp === 'object';
        const name = isObj ? sp.name : sp;
        const inPrep = prepared.has(name);
        const sc = SCHOOL_COLORS[isObj?sp.school:''] || '#7b6d8d';
        const lvlLabel = isObj ? (sp.level_int===0?'Cantrip':sp.level_int?`Lv ${sp.level_int}`:'') : '';
        const id = `sd-known-${i}`;
        return `<div class="spell-card" style="border-left-color:${sc}">
          <div class="spell-card-top">
            <div class="spell-card-left">
              <span class="spell-name">${esc(name)}</span>
              ${lvlLabel||isObj&&sp.school?`<span class="spell-badge" style="border-color:${sc};color:${sc}">${lvlLabel}${lvlLabel&&isObj&&sp.school?' · ':''}${esc(isObj?sp.school||'':'')}</span>`:''}
              ${isObj&&sp.concentration==='yes'?`<span class="spell-tag conc">C</span>`:''}
              ${isObj&&sp.ritual==='yes'?`<span class="spell-tag ritual">R</span>`:''}
            </div>
            <div class="spell-card-right">
              <button class="btn btn-sm${inPrep?' btn-primary':''}" onclick="togglePrepareFromKnown(${i})" title="${inPrep?'Remove from Prepared':'Add to Prepared'}">${inPrep?'✓ Prep':'Prepare'}</button>
              <button class="btn btn-sm" onclick="toggleSpellCard('${id}',this)" title="Toggle description">▴</button>
              <button class="btn btn-icon btn-danger" onclick="removeSpellEntry('known',${i})">&times;</button>
            </div>
          </div>
          ${isObj&&(sp.casting_time||sp.range||sp.components)?`<div class="spell-meta">${[sp.casting_time,sp.range,sp.components].filter(Boolean).map(esc).join(' · ')}</div>`:''}
          ${isObj?`<div class="spell-desc" id="${id}">${esc(sp.desc||'No description available.')}</div>`:''}
        </div>`;
      }).join('')}
    </div>`).join('')}</div>`;
}

function renderPreparedView(ch) {
  const prepared = ch.spells.prepared || [];
  if (prepared.length === 0) return `<p class="spell-empty" style="padding:1rem 0">No prepared spells. Mark spells as Prepared from Known ↑ or All Spells.</p>`;
  const entries = prepared.map((sp, i) => ({ full: fullSpellData(sp), i }));
  const grouped = groupSpellsByLevel(entries);
  return `<div>${grouped.map(({ label, spells }) => `
    <div class="spell-group">
      <div class="spell-group-heading">${label} <span class="spell-count">${spells.length}</span></div>
      ${spells.map(({ full: sp, i }) => {
        const isObj = typeof sp === 'object';
        const name = isObj ? sp.name : sp;
        const sc = SCHOOL_COLORS[isObj?sp.school:''] || '#7b6d8d';
        const lvlLabel = isObj ? (sp.level_int===0?'Cantrip':sp.level_int?`Lv ${sp.level_int}`:'') : '';
        const id = `sd-prep-${i}`;
        return `<div class="spell-card" style="border-left-color:${sc}">
          <div class="spell-card-top">
            <div class="spell-card-left">
              <span class="spell-name">${esc(name)}</span>
              ${lvlLabel||isObj&&sp.school?`<span class="spell-badge" style="border-color:${sc};color:${sc}">${lvlLabel}${lvlLabel&&isObj&&sp.school?' · ':''}${esc(isObj?sp.school||'':'')}</span>`:''}
              ${isObj&&sp.concentration==='yes'?`<span class="spell-tag conc">C</span>`:''}
              ${isObj&&sp.ritual==='yes'?`<span class="spell-tag ritual">R</span>`:''}
            </div>
            <div class="spell-card-right">
              <button class="btn btn-sm btn-primary btn-cast" onclick="spellCastFx(this);castPreparedByIdx(${i})">Cast</button>
              <button class="btn btn-sm" onclick="toggleSpellCard('${id}',this)" title="Toggle description">▴</button>
              <button class="btn btn-icon btn-danger" onclick="removeSpellEntry('prepared',${i})">&times;</button>
            </div>
          </div>
          ${isObj&&(sp.casting_time||sp.range||sp.components)?`<div class="spell-meta">${[sp.casting_time,sp.range,sp.components].filter(Boolean).map(esc).join(' · ')}</div>`:''}
          ${isObj?`<div class="spell-desc" id="${id}">${esc(sp.desc||'No description available.')}</div>`:''}
        </div>`;
      }).join('')}
    </div>`).join('')}</div>`;
}

function spellAddFromEncoded(listType, encoded) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const sp = JSON.parse(decodeURIComponent(encoded));
  ch.spells[listType] = ch.spells[listType] || [];
  const already = ch.spells[listType].some(s => (typeof s==='object'?s.name:s) === sp.name);
  if (!already) { ch.spells[listType].push(sp); }
  // Preparing a spell also adds it to Known
  if (listType === 'prepared') {
    ch.spells.known = ch.spells.known || [];
    const inKnown = ch.spells.known.some(s => (typeof s==='object'?s.name:s) === sp.name);
    if (!inKnown) ch.spells.known.push(sp);
  }
  saveData(db);
  renderSpellTabContent();
}

function togglePrepareFromKnown(knownIdx) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const sp = ch.spells.known[knownIdx]; if (!sp) return;
  const name = typeof sp==='object' ? sp.name : sp;
  ch.spells.prepared = ch.spells.prepared || [];
  const pIdx = ch.spells.prepared.findIndex(s => (typeof s==='object'?s.name:s) === name);
  if (pIdx >= 0) ch.spells.prepared.splice(pIdx, 1);
  else ch.spells.prepared.push(typeof sp==='object' ? {...sp} : sp);
  saveData(db); renderSpellTabContent();
}

// ── Cast Modal ────────────────────────────────────────────────────────────────
function castPreparedByIdx(idx) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const sp = (ch.spells.prepared || [])[idx]; if (!sp) return;
  const name = typeof sp === 'object' ? sp.name : sp;
  const lvl = typeof sp === 'object' ? (sp.level_int || 0) : 0;
  openCastModal(name, lvl);
}

function openCastModal(spellName, minLevel) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  // Cantrips don't use slots — cast directly
  if (minLevel === 0) { castCantrip(spellName); return; }
  const slots = ch.spells.slots || {};
  const maxSlots = ch.spells.slotsMax || {};
  const availableLevels = [];
  for (let lvl = Math.max(1, minLevel); lvl <= 9; lvl++) {
    if ((slots[lvl] || 0) > 0) availableLevels.push(lvl);
  }
  const ordinals = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];
  openModal(`<h2>Cast ${esc(spellName)}</h2>
    <p style="font-size:0.8rem;color:var(--text-dim);margin-bottom:0.9rem">Choose a slot level:</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:1rem">
      ${[1,2,3,4,5,6,7,8,9].map(lvl => {
        const cur = slots[lvl] || 0;
        const available = cur > 0 && lvl >= minLevel;
        return `<button class="btn${available?' btn-primary':''}" ${!available?'disabled style="opacity:0.35"':''}
          onclick="confirmCast('${esc(spellName)}',${lvl})">
          <div style="font-size:0.75rem">${ordinals[lvl]}</div>
          <div style="font-size:0.62rem;opacity:0.7">${cur} slot${cur!==1?'s':''}</div>
        </button>`;
      }).join('')}
    </div>
    ${availableLevels.length===0?`<p style="color:var(--red-lt);font-size:0.82rem">No spell slots available!</p>`:''}
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button></div>`);
}

function castCantrip(spellName) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const allSpells = [...(ch.spells.known||[]), ...(ch.spells.prepared||[])];
  const sp = allSpells.find(s => typeof s === 'object' && s.name === spellName);
  const isConc = sp?.concentration === 'yes';
  if (isConc && ch.activeConcentration && ch.activeConcentration.spellName !== spellName) {
    if (!confirm(`This will end your concentration on ${ch.activeConcentration.spellName}. Continue?`)) return;
  }
  ch.sessionLog = ch.sessionLog || [];
  ch.sessionLog.unshift({ text: `${spellName} (cantrip)`, ts: Date.now() });
  if (ch.sessionLog.length > 100) ch.sessionLog = ch.sessionLog.slice(0, 100);
  if (isConc) ch.activeConcentration = { spellName, castLevel: 0 };
  saveData(db);
  showToast(`<strong>${esc(spellName)}</strong> cast!`);
  if (isConc) renderApp();
}

function confirmCast(spellName, slotLevel) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if ((ch.spells.slots[slotLevel] || 0) <= 0) { alert('No slots at that level!'); return; }
  // Find the spell to check concentration
  const allSpells = [...(ch.spells.known||[]), ...(ch.spells.prepared||[])];
  const sp = allSpells.find(s => (typeof s==='object' ? s.name : s) === spellName && typeof s === 'object');
  const isConc = sp?.concentration === 'yes';
  if (isConc && ch.activeConcentration && ch.activeConcentration.spellName !== spellName) {
    if (!confirm(`This will end your concentration on ${ch.activeConcentration.spellName}. Continue?`)) return;
  }
  CharacterStore.useSpellSlot(currentCharId, slotLevel);
  const ordinals = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];
  const entry = `${spellName} cast at ${ordinals[slotLevel]} level`;
  ch.sessionLog = ch.sessionLog || [];
  ch.sessionLog.unshift({ text: entry, ts: Date.now() });
  if (ch.sessionLog.length > 100) ch.sessionLog = ch.sessionLog.slice(0, 100);
  if (isConc) ch.activeConcentration = { spellName, castLevel: slotLevel };
  saveData(db);
  closeModal();
  renderApp(); // refresh slots, combat pill, everything
}

// ── Custom Spell ──────────────────────────────────────────────────────────────
function openCustomSpellModal(editIdx) {
  loadCustomSpells();
  const editing = editIdx != null ? customSpells[editIdx] : null;
  const sp = editing || {};
  const schools = ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation',''];
  openModal(`<h2>${editing ? 'Edit' : '✏ New'} Custom Spell</h2>
    <div class="form-row">
      <div class="form-group"><label>Name</label><input type="text" id="csp-name" value="${esc(sp.name||'')}"></div>
      <div class="form-group"><label>Level (0=Cantrip)</label><input type="number" id="csp-level" value="${sp.level_int??0}" min="0" max="9"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>School</label>
        <select id="csp-school">${schools.map(s=>`<option${sp.school===s?' selected':''}>${s}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Casting Time</label><input type="text" id="csp-cast" value="${esc(sp.casting_time||'1 action')}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Range</label><input type="text" id="csp-range" value="${esc(sp.range||'')}"></div>
      <div class="form-group"><label>Components</label><input type="text" id="csp-comp" value="${esc(sp.components||'')}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Duration</label><input type="text" id="csp-dur" value="${esc(sp.duration||'')}"></div>
      <div class="form-group"><label>Classes</label><input type="text" id="csp-cls" value="${esc(sp.dnd_class||'')}" placeholder="Wizard, Sorcerer…"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label style="display:flex;align-items:center;gap:0.5rem"><input type="checkbox" id="csp-conc" ${sp.concentration==='yes'?'checked':''}> Concentration</label></div>
      <div class="form-group"><label style="display:flex;align-items:center;gap:0.5rem"><input type="checkbox" id="csp-ritual" ${sp.ritual==='yes'?'checked':''}> Ritual</label></div>
    </div>
    <div class="form-group"><label>Description</label><textarea id="csp-desc" rows="4">${esc(sp.desc||'')}</textarea></div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      ${editing?`<button class="btn btn-danger" onclick="deleteCustomSpell(${editIdx})">Delete</button>`:''}
      <button class="btn btn-primary" onclick="saveCustomSpell(${editIdx??'null'})">Save Spell</button>
    </div>`);
  document.getElementById('csp-name')?.focus();
}

function saveCustomSpell(editIdx) {
  loadCustomSpells();
  const name = document.getElementById('csp-name')?.value.trim();
  if (!name) { alert('Spell name required.'); return; }
  const sp = {
    name, level_int: parseInt(document.getElementById('csp-level')?.value)||0,
    school: document.getElementById('csp-school')?.value,
    casting_time: document.getElementById('csp-cast')?.value.trim(),
    range: document.getElementById('csp-range')?.value.trim(),
    components: document.getElementById('csp-comp')?.value.trim(),
    duration: document.getElementById('csp-dur')?.value.trim(),
    dnd_class: document.getElementById('csp-cls')?.value.trim(),
    concentration: document.getElementById('csp-conc')?.checked ? 'yes' : 'no',
    ritual: document.getElementById('csp-ritual')?.checked ? 'yes' : 'no',
    desc: document.getElementById('csp-desc')?.value.trim(),
    level: document.getElementById('csp-level')?.value === '0' ? 'cantrip' : `${document.getElementById('csp-level')?.value}th-level`,
  };
  if (editIdx != null) customSpells[editIdx] = sp; else customSpells.push(sp);
  saveCustomSpells();
  closeModal();
  renderSpellTabContent();
}

function deleteCustomSpell(idx) {
  if (!confirm('Delete this custom spell?')) return;
  customSpells.splice(idx, 1);
  saveCustomSpells();
  closeModal();
  renderSpellTabContent();
}

function renderSpellsSection(ch) {
  const pb = profBonus(ch.level);
  const known    = (ch.spells.known    || []).length;
  const prepared = (ch.spells.prepared || []).length;

  // Determine if any class is a spellcaster
  const isSpellcaster = (ch.classes||[]).some(c => {
    const ct = CASTER_TYPE[c.class];
    if (ct) return true;
    const subs = THIRD_CASTER_SUBCLASSES[c.class];
    return subs && subs.includes(c.subclass);
  });

  // Calculate prepared spell limit for applicable classes
  let preparedLimit = null;
  let prepareLimitFormula = '';
  const classesWithLimit = (ch.classes||[]).filter(c => PREPARED_SPELL_LIMIT[c.class]);
  if (classesWithLimit.length > 0) {
    const c = classesWithLimit[0]; // Use first class with limit
    const ab = SPELL_ABILITY[c.class];
    const abilityMod = mod(ch.abilities[ab]);
    preparedLimit = PREPARED_SPELL_LIMIT[c.class](c.level, abilityMod);
    const abilityName = ABILITY_SHORT[ab].toUpperCase();
    const abilityModStr = abilityMod >= 0 ? `+ ${ABILITY_SHORT[ab]} +${abilityMod}` : `+ ${ABILITY_SHORT[ab]} ${abilityMod}`;
    prepareLimitFormula = `Prepare up to ${preparedLimit} spells (level ${c.level} ${abilityModStr})`;
  }

  // Build per-class spellcasting stat rows
  let headerStats = '';
  if (isSpellcaster) {
    const seen = new Set();
    const statRows = (ch.classes||[]).map(c => {
      const ab = SPELL_ABILITY[c.class];
      if (!ab || seen.has(ab)) return '';
      // For third-casters, only show if subclass matches
      const ct = _classCasterType(c);
      if (!ct) return '';
      seen.add(ab);
      const sMod = mod(ch.abilities[ab]);
      const dc = 8 + pb + sMod;
      const atk = pb + sMod;
      const limitNote = PREPARED_SPELL_LIMIT[c.class] ? `<div style="font-size:0.7rem;color:var(--text-dim);margin-top:0.3rem">${prepareLimitFormula}</div>` : '';
      return `<div class="spell-stat-row">
        <div class="spell-stat-box"><div class="spell-stat-label">${esc(c.class)}</div><div class="spell-stat-val">${ABILITY_SHORT[ab]}</div></div>
        <div class="spell-stat-box"><div class="spell-stat-label">Spell Save DC</div><div class="spell-stat-val">${dc}</div></div>
        <div class="spell-stat-box"><div class="spell-stat-label">Spell Attack</div><div class="spell-stat-val">${atk>=0?'+':''}${atk}</div></div>
      </div>${limitNote}`;
    }).filter(Boolean);
    headerStats = statRows.join('');
  } else {
    headerStats = `<p class="text-dim" style="font-size:0.82rem;margin-bottom:0.8rem">${esc(ch.class)} does not use spellcasting.</p>`;
  }

  // Regular spell slots (hide grid if all zeros and has pact magic)
  const hasRegularSlots = [1,2,3,4,5,6,7,8,9].some(l => (ch.spells.slotsMax||{})[l] > 0);
  const slotsHtml = isSpellcaster && hasRegularSlots ? `
    <div class="spell-slots-section">
      <div class="cs-field-label" style="margin-bottom:0.55rem">Spell Slots</div>
      <div class="spell-slots-grid">
        ${[1,2,3,4,5,6,7,8,9].map(lvl => {
          const cur = (ch.spells.slots||{})[lvl] || 0;
          const max = (ch.spells.slotsMax||{})[lvl] || 0;
          const ordinal = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'][lvl];
          return `<div class="spell-slot-row${max === 0 ? ' spell-slot-row-empty' : ''}">
            <span class="spell-slot-lbl">${ordinal}</span>
            <div class="spell-slot-bubbles">
              ${Array.from({length:Math.max(max,0)},(_,i)=>`<div class="spell-bubble ${i<cur?'filled':''}" onclick="toggleSpellBubble(${lvl},${i})" title="Click to use/restore slot ${i+1}"></div>`).join('')}
            </div>
            <div class="slot-max-ctrl">
              <button class="slot-adj-btn" onclick="slotMaxAdj(${lvl},-1)">−</button>
              <span class="slot-max-val">${max}</span>
              <button class="slot-adj-btn" onclick="slotMaxAdj(${lvl},1)">+</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>` : '';

  // Pact Magic (Warlock)
  const pactMax = ch.spells.pactSlotsMax || 0;
  const pactCur = ch.spells.pactSlots || 0;
  const pactLvl = ch.spells.pactSlotLevel || 0;
  const pactOrd = ['','1st','2nd','3rd','4th','5th'][pactLvl] || `${pactLvl}th`;
  const pactHtml = pactMax > 0 ? `
    <div class="pact-magic-section">
      <div class="cs-field-label" style="margin-bottom:0.55rem">Pact Magic · ${pactOrd}-level · short rest</div>
      <div class="spell-slot-row">
        <span class="spell-slot-lbl">Pact</span>
        <div class="spell-slot-bubbles">
          ${Array.from({length:pactMax},(_,i)=>`<div class="spell-bubble pact-bubble ${i<pactCur?'filled':''}" onclick="togglePactBubble(${i})" title="Pact slot ${i+1}"></div>`).join('')}
        </div>
        <div class="slot-max-ctrl">
          <button class="slot-adj-btn" onclick="pactSlotMaxAdj(-1)">−</button>
          <span class="slot-max-val">${pactMax}</span>
          <button class="slot-adj-btn" onclick="pactSlotMaxAdj(1)">+</button>
        </div>
      </div>
    </div>` : '';

  return `<div class="sheet-panel">
    <div class="cs-section-label">Spells</div>
    ${headerStats}
    ${slotsHtml}
    ${pactHtml}
    <div class="spell-tabs">
      <button class="spell-tab${spellViewTab==='all'?' active':''}" data-tab="all" onclick="switchSpellTab('all')">✿ All Spells</button>
      <button class="spell-tab${spellViewTab==='known'?' active':''}" data-tab="known" onclick="switchSpellTab('known')">Known <span class="spell-count">${known}</span></button>
      <button class="spell-tab${spellViewTab==='prepared'?' active':''}" data-tab="prepared" onclick="switchSpellTab('prepared')">Prepared <span class="spell-count" style="${preparedLimit && prepared > preparedLimit ? 'color:var(--red-lt)' : ''}">${prepared}${preparedLimit ? `/${preparedLimit}` : ''}</span></button>
    </div>
    <div id="spell-tab-content"></div>
  </div>`;
}

function toggleSpellDesc(id) { document.getElementById(id)?.classList.toggle('hidden'); }

function toggleSpellCard(descId, btn) {
  const el = document.getElementById(descId);
  if (!el) return;
  const nowHidden = el.classList.toggle('hidden');
  if (btn) btn.textContent = nowHidden ? '▾' : '▴';
}

function spellCastFx(el) {
  const rect = el.getBoundingClientRect();
  const fx = document.createElement('div');
  fx.className = 'spell-cast-fx';
  fx.style.cssText = `left:${rect.left + rect.width / 2}px;top:${rect.top + 4}px;`;
  const symbols = ['✦','✦','✦','✦'];
  const cfg = [{s:'0.65rem',l:'-14px',d:'0ms'},{s:'0.5rem',l:'6px',d:'90ms'},{s:'0.45rem',l:'-4px',d:'40ms'},{s:'0.6rem',l:'12px',d:'150ms'}];
  cfg.forEach((c, i) => {
    const p = document.createElement('span');
    p.className = 'particle';
    p.textContent = symbols[i];
    p.style.cssText = `font-size:${c.s};left:${c.l};animation-delay:${c.d};`;
    fx.appendChild(p);
  });
  document.body.appendChild(fx);
  setTimeout(() => fx.remove(), 1000);
}

function removeSpellEntry(listType, idx) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.spells[listType].splice(idx, 1);
  saveData(db); renderSpellTabContent();
}

function toggleSpellBubble(level, index) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const cur = ch.spells.slots[level] || 0;
  ch.spells.slots[level] = index < cur ? index : index + 1;
  saveData(db); renderApp();
}

function updateSpellSlotMax(level, value) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.spells.slotsMax = ch.spells.slotsMax || {};
  ch.spells.slotsMax[level] = Math.max(0, parseInt(value) || 0);
  if ((ch.spells.slots[level] || 0) > ch.spells.slotsMax[level]) ch.spells.slots[level] = ch.spells.slotsMax[level];
  saveData(db); renderApp();
}

function slotMaxAdj(level, delta) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.spells.slotsMax = ch.spells.slotsMax || {};
  const newMax = Math.min(9, Math.max(0, (ch.spells.slotsMax[level] || 0) + delta));
  ch.spells.slotsMax[level] = newMax;
  if ((ch.spells.slots[level] || 0) > newMax) ch.spells.slots[level] = newMax;
  saveData(db); renderApp();
}

function togglePactBubble(index) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const cur = ch.spells.pactSlots || 0;
  ch.spells.pactSlots = index < cur ? index : index + 1;
  saveData(db); renderApp();
}

function pactSlotMaxAdj(delta) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const newMax = Math.min(9, Math.max(0, (ch.spells.pactSlotsMax || 0) + delta));
  ch.spells.pactSlotsMax = newMax;
  if ((ch.spells.pactSlots || 0) > newMax) ch.spells.pactSlots = newMax;
  saveData(db); renderApp();
}

function restorePactSlots() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.spells.pactSlots = ch.spells.pactSlotsMax || 0;
}

function renderPersonalitySection(ch) {
  const fields = [['Personality Traits','personality','How do you act? Quirks, mannerisms...'],['Ideals','ideals','What principles guide you?'],['Bonds','bonds','Who or what do you care most about?'],['Flaws','flaws','What are your vices or weaknesses?']];
  return `<div class="sheet-panel">
    ${fields.map(([label,field,ph],i)=>`
      ${i>0?`<div class="cs-section-label" style="margin:0.6rem -1rem 0.5rem">${label}</div>`:`<div class="cs-section-label">${label}</div>`}
      <textarea class="sheet-textarea" rows="${i===0?3:2}" oninput="ch_field('${field}',this.value)" placeholder="${ph}">${esc(ch[field]||'')}</textarea>`).join('')}
  </div>`;
}

// ── Class Features Lookup ────────────────────────────────────────────────────
const CLASS_FEATURES = {
  Barbarian: [
    [1, 'Rage', 'Enter a rage as a bonus action. Advantage on STR checks and saving throws, bonus to melee damage, resistance to bludgeoning/piercing/slashing damage.'],
    [1, 'Unarmored Defense', 'While not wearing armor, AC equals 10 + DEX modifier + CON modifier.'],
    [2, 'Reckless Attack', 'When you make your first attack on your turn, you can decide to attack recklessly, gaining advantage but giving enemies advantage against you until your next turn.'],
    [2, 'Danger Sense', 'Advantage on DEX saving throws against effects you can see, such as traps and spells, while not blinded, deafened, or incapacitated.'],
    [3, 'Primal Path', 'Choose a subclass that shapes your rage.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [5, 'Extra Attack', 'You can attack twice, instead of once, whenever you take the Attack action on your turn.'],
    [5, 'Fast Movement', 'Your speed increases by 10 ft while not wearing heavy armor.'],
    [6, 'Path Feature', 'Additional feature from your Primal Path.'],
    [7, 'Feral Instinct', 'Advantage on initiative rolls. If surprised, you can still act normally on your first turn if you enter your rage before doing anything else.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [9, 'Brutal Critical', 'Roll one additional weapon damage die when scoring a critical hit.'],
    [10, 'Path Feature', 'Additional feature from your Primal Path.'],
    [11, 'Relentless Rage', 'When you drop to 0 HP while raging, make a DC 10 CON save to drop to 1 HP instead. DC increases by 5 each time you use this feature until you finish a short or long rest.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Bard: [
    [1, 'Bardic Inspiration', 'As a bonus action, grant a creature within 60 ft a Bardic Inspiration die (d6) to add to one ability check, attack roll, or saving throw within 10 minutes.'],
    [1, 'Spellcasting', 'You can cast bard spells using CHA as your spellcasting ability.'],
    [2, 'Jack of All Trades', 'Add half your proficiency bonus (rounded down) to ability checks you aren\'t proficient in.'],
    [2, 'Song of Rest', 'If you perform during a short rest, friendly creatures regain extra HP when they spend Hit Dice (d6 extra).'],
    [3, 'Bard College', 'Choose a Bard College subclass.'],
    [3, 'Expertise', 'Choose two skill proficiencies to double your proficiency bonus with.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [5, 'Bardic Inspiration (d8)', 'Your Bardic Inspiration die increases to d8.'],
    [5, 'Font of Inspiration', 'You regain all uses of Bardic Inspiration when you finish a short or long rest.'],
    [6, 'Countercharm', 'Use an action to perform music; friendly creatures within 30 ft have advantage on saving throws against being frightened or charmed until you stop.'],
    [6, 'College Feature', 'Additional feature from your Bard College.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [10, 'Bardic Inspiration (d10)', 'Your Bardic Inspiration die increases to d10.'],
    [10, 'Expertise', 'Choose two more skill proficiencies to double your proficiency bonus with.'],
    [10, 'Magical Secrets', 'Choose two spells from any class. They count as bard spells for you.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Cleric: [
    [1, 'Spellcasting', 'You can cast cleric spells using WIS as your spellcasting ability.'],
    [1, 'Divine Domain', 'Choose a divine domain subclass that grants you domain spells and features.'],
    [2, 'Channel Divinity', 'Channel divine energy to fuel magical effects. You have one use, regained on short or long rest.'],
    [2, 'Channel Divinity: Turn Undead', 'As an action, present your holy symbol; undead within 30 ft that can see or hear you must make a WIS save or be turned for 1 minute.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [5, 'Destroy Undead (CR 1/2)', 'When undead fails its saving throw against your Turn Undead, it is instantly destroyed if its CR is at or below 1/2.'],
    [6, 'Channel Divinity (2/rest)', 'You can use Channel Divinity twice between rests.'],
    [6, 'Divine Domain Feature', 'Additional feature from your Divine Domain.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [8, 'Destroy Undead (CR 1)', 'Your Destroy Undead now affects CR 1 or lower creatures.'],
    [10, 'Divine Intervention', 'Implore your deity for aid. Roll d100; if you roll equal to or lower than your cleric level, your deity intervenes.'],
    [11, 'Destroy Undead (CR 2)', 'Your Destroy Undead now affects CR 2 or lower creatures.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Druid: [
    [1, 'Druidic', 'You know Druidic, the secret language of druids. You can speak and leave hidden messages in it.'],
    [1, 'Spellcasting', 'You can cast druid spells using WIS as your spellcasting ability.'],
    [2, 'Wild Shape', 'Use your action to magically assume the shape of a beast you have seen before (up to CR 1/4, no fly or swim speed at level 2).'],
    [2, 'Druid Circle', 'Choose a Druid Circle subclass.'],
    [4, 'Wild Shape Improvement', 'Can now assume the shape of beasts up to CR 1/2 with a swimming speed.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [6, 'Druid Circle Feature', 'Additional feature from your Druid Circle.'],
    [8, 'Wild Shape Improvement', 'Can now assume the shape of beasts up to CR 1 with a flying speed.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [10, 'Druid Circle Feature', 'Additional feature from your Druid Circle.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Fighter: [
    [1, 'Fighting Style', 'Adopt a particular style of fighting as your specialty.'],
    [1, 'Second Wind', 'Use a bonus action to regain HP equal to 1d10 + your fighter level once per short or long rest.'],
    [2, 'Action Surge', 'On your turn, take one additional action. Usable once per short or long rest (twice at level 17).'],
    [3, 'Martial Archetype', 'Choose a Martial Archetype subclass.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [5, 'Extra Attack', 'You can attack twice whenever you take the Attack action on your turn.'],
    [6, 'ASI', 'Ability Score Improvement or feat.'],
    [7, 'Martial Archetype Feature', 'Additional feature from your Martial Archetype.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [9, 'Indomitable', 'Reroll a saving throw that you fail (once per long rest).'],
    [10, 'Martial Archetype Feature', 'Additional feature from your Martial Archetype.'],
    [11, 'Extra Attack (3)', 'You can attack three times whenever you take the Attack action.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Monk: [
    [1, 'Unarmored Defense', 'While not wearing armor or wielding a shield, AC equals 10 + DEX modifier + WIS modifier.'],
    [1, 'Martial Arts', 'Use DEX instead of STR for monk weapons and unarmed strikes. Roll a d4 for unarmed strike damage. Make one unarmed strike as a bonus action.'],
    [2, 'Ki', 'You have ki points equal to your monk level. Regained on short or long rest.'],
    [2, 'Flurry of Blows', 'Spend 1 ki point to make two unarmed strikes as a bonus action after taking the Attack action.'],
    [2, 'Patient Defense', 'Spend 1 ki point to take the Dodge action as a bonus action.'],
    [2, 'Step of the Wind', 'Spend 1 ki point to Dash or Disengage as a bonus action. Your jump distance is doubled.'],
    [2, 'Unarmored Movement', 'Speed increases by 10 ft while not wearing armor or wielding a shield.'],
    [3, 'Monastic Tradition', 'Choose a Monastic Tradition subclass.'],
    [3, 'Deflect Missiles', 'Use your reaction to deflect or catch a ranged weapon attack, reducing damage by 1d10 + DEX + monk level.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [4, 'Slow Fall', 'Reduce falling damage by 5 × monk level using your reaction.'],
    [5, 'Extra Attack', 'You can attack twice whenever you take the Attack action.'],
    [5, 'Stunning Strike', 'Spend 1 ki point when you hit with a melee attack; the target must succeed on a CON save or be stunned until end of your next turn.'],
    [6, 'Ki-Empowered Strikes', 'Your unarmed strikes count as magical for overcoming resistance and immunity.'],
    [6, 'Monastic Tradition Feature', 'Additional feature from your Monastic Tradition.'],
    [7, 'Evasion', 'When subjected to a DEX save for half damage, you take no damage on a success and half on a failure.'],
    [7, 'Stillness of Mind', 'Use an action to end the charmed or frightened condition on yourself.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Paladin: [
    [1, 'Divine Sense', 'As an action, detect the presence of celestials, fiends, and undead within 60 ft until end of next turn. Uses equal to 1 + CHA modifier per long rest.'],
    [1, 'Lay on Hands', 'Pool of healing equal to 5 × paladin level. Use an action to restore HP from the pool or expend 5 points to cure a disease or poison.'],
    [2, 'Fighting Style', 'Adopt a particular style of fighting as your specialty.'],
    [2, 'Spellcasting', 'You can cast paladin spells using CHA as your spellcasting ability.'],
    [2, 'Divine Smite', 'When you hit with a melee weapon attack, expend a spell slot to deal extra radiant damage (2d8 + 1d8 per spell level above 1st).'],
    [3, 'Divine Health', 'The divine magic flowing through you makes you immune to disease.'],
    [3, 'Sacred Oath', 'Choose a Sacred Oath subclass.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [5, 'Extra Attack', 'You can attack twice whenever you take the Attack action.'],
    [6, 'Aura of Protection', 'Add your CHA modifier (min +1) to saving throws for you and friendly creatures within 10 ft while you are conscious.'],
    [7, 'Sacred Oath Feature', 'Additional feature from your Sacred Oath.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [10, 'Aura of Courage', 'Friendly creatures within 10 ft can\'t be frightened while you are conscious.'],
    [11, 'Improved Divine Smite', 'Whenever you hit with a melee weapon, deal an extra 1d8 radiant damage.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Ranger: [
    [1, 'Favored Enemy', 'Choose a type of favored enemy. Advantage on survival checks to track them, INT checks to recall info, learn one language of your favored enemies.'],
    [1, 'Natural Explorer', 'Choose a favored terrain. Gain several exploration benefits in that terrain.'],
    [2, 'Fighting Style', 'Adopt a particular style of fighting as your specialty.'],
    [2, 'Spellcasting', 'You can cast ranger spells using WIS as your spellcasting ability.'],
    [3, 'Ranger Archetype', 'Choose a Ranger Archetype subclass.'],
    [3, 'Primeval Awareness', 'Expend a spell slot to sense the presence of certain creature types within 1 mile (6 miles in favored terrain) for 1 minute.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [5, 'Extra Attack', 'You can attack twice whenever you take the Attack action.'],
    [6, 'Favored Enemy Improvement', 'Choose one more favored enemy and one more language.'],
    [6, 'Natural Explorer Improvement', 'Choose one more favored terrain.'],
    [7, 'Ranger Archetype Feature', 'Additional feature from your Ranger Archetype.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [8, 'Land\'s Stride', 'Moving through nonmagical difficult terrain costs no extra movement. Advantage on saves against plants that impede movement.'],
    [10, 'Natural Explorer Improvement', 'Choose one more favored terrain.'],
    [10, 'Hide in Plain Sight', 'Spend 1 minute camouflaging yourself, gaining +10 bonus to DEX (Stealth) while motionless.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Rogue: [
    [1, 'Expertise', 'Double your proficiency bonus for two skill proficiencies of your choice.'],
    [1, 'Sneak Attack', 'Deal extra 1d6 damage once per turn when you have advantage or an ally is adjacent to the target (increases by 1d6 every odd level).'],
    [1, 'Thieves\' Cant', 'A secret mix of dialect, jargon, and code that allows you to hide messages in normal conversation.'],
    [2, 'Cunning Action', 'Use a bonus action to Dash, Disengage, or Hide on each of your turns.'],
    [3, 'Roguish Archetype', 'Choose a Roguish Archetype subclass.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [5, 'Uncanny Dodge', 'When an attacker you can see hits you, use your reaction to halve the attack\'s damage.'],
    [6, 'Expertise', 'Double your proficiency bonus for two more skill proficiencies.'],
    [7, 'Evasion', 'When subjected to a DEX save for half damage, you take no damage on success and half on failure.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [9, 'Roguish Archetype Feature', 'Additional feature from your Roguish Archetype.'],
    [10, 'ASI', 'Ability Score Improvement or feat.'],
    [11, 'Reliable Talent', 'Treat any d20 roll of 9 or lower as a 10 for ability checks you are proficient in.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Sorcerer: [
    [1, 'Spellcasting', 'You can cast sorcerer spells using CHA as your spellcasting ability.'],
    [1, 'Sorcerous Origin', 'Choose a Sorcerous Origin subclass that grants you features at levels 1, 6, 14, and 18.'],
    [2, 'Font of Magic', 'You have sorcery points equal to your sorcerer level. Regained on long rest.'],
    [2, 'Flexible Casting', 'Convert sorcery points to spell slots or convert spell slots to sorcery points.'],
    [3, 'Metamagic', 'Choose two Metamagic options to twist your spells.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [5, 'Sorcerous Origin Feature', 'Additional feature from your Sorcerous Origin.'],
    [6, 'Sorcerous Origin Feature', 'Additional feature from your Sorcerous Origin.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [10, 'Metamagic', 'Choose one more Metamagic option.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Warlock: [
    [1, 'Otherworldly Patron', 'Choose an Otherworldly Patron subclass that grants you spells and features.'],
    [1, 'Pact Magic', 'Your spells are cast at your highest available slot and all slots are regained on short or long rest. Use CHA as your spellcasting ability.'],
    [2, 'Eldritch Invocations', 'Choose two Eldritch Invocations that grant you permanent magical abilities.'],
    [3, 'Pact Boon', 'Choose a Pact Boon: Pact of the Chain, Blade, or Tome.'],
    [3, 'Otherworldly Patron Feature', 'Additional feature from your Otherworldly Patron.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [5, 'Eldritch Invocations', 'Choose one more Eldritch Invocation.'],
    [6, 'Otherworldly Patron Feature', 'Additional feature from your Otherworldly Patron.'],
    [7, 'Eldritch Invocations', 'Choose one more Eldritch Invocation.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [9, 'Eldritch Invocations', 'Choose one more Eldritch Invocation.'],
    [10, 'Otherworldly Patron Feature', 'Additional feature from your Otherworldly Patron.'],
    [11, 'Mystic Arcanum (6th level)', 'Choose a 6th-level spell as your mystic arcanum. Cast it once per long rest without using a spell slot.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
  Wizard: [
    [1, 'Spellcasting', 'You can cast wizard spells using INT as your spellcasting ability.'],
    [1, 'Arcane Recovery', 'Once per day during a short rest, recover spell slots with combined level up to half your wizard level (rounded up).'],
    [2, 'Arcane Tradition', 'Choose an Arcane Tradition subclass.'],
    [4, 'ASI', 'Ability Score Improvement or feat.'],
    [6, 'Arcane Tradition Feature', 'Additional feature from your Arcane Tradition.'],
    [8, 'ASI', 'Ability Score Improvement or feat.'],
    [10, 'Arcane Tradition Feature', 'Additional feature from your Arcane Tradition.'],
    [12, 'ASI', 'Ability Score Improvement or feat.'],
  ],
};

function getClassFeaturesUpToLevel(className, level) {
  const list = CLASS_FEATURES[className] || [];
  return list.filter(([lvl]) => lvl <= level).map(([lvl, name, desc]) => ({ name, desc }));
}

function renderFeaturesSection(ch) {
  const allFeatures = ch.featuresList || [];
  const subFeatures = allFeatures.filter(f => f._subclass);
  const customFeatures = allFeatures.filter(f => !f._subclass);

  // Build a map from resource name → resource object for quick lookup
  const resourceMap = {};
  (ch.resources || []).forEach(r => { resourceMap[r.name] = r; });

  // Look up the level a subclass feature was gained at
  function featLevel(f) {
    const sd = typeof SUBCLASS_DATA !== 'undefined' &&
      SUBCLASS_DATA[ch.class]?.[f._subclass]?.features;
    if (!sd) return null;
    const match = sd.find(s => s.name === f.name);
    return match ? match.level : null;
  }

  // Look up a linked resource for a subclass feature
  function linkedResource(f) {
    const sd = typeof SUBCLASS_DATA !== 'undefined' &&
      SUBCLASS_DATA[ch.class]?.[f._subclass]?.features;
    if (!sd) return null;
    const match = sd.find(s => s.name === f.name);
    if (!match?.resource) return null;
    return resourceMap[match.resource.name] || null;
  }

  function renderResourceMini(r) {
    if (!r) return '';
    const max = resolveMaxFormula(r.max, ch);
    const current = Math.min(r.current || 0, max);
    if (max >= 20) {
      return `<span class="feat-res-mini feat-res-pool">${current}/${max}</span>`;
    }
    const pips = Array.from({length: Math.min(max, 10)}, (_, p) =>
      `<span class="feat-res-pip${p < current ? ' feat-res-pip-on' : ''}"></span>`
    ).join('');
    const overflow = max > 10 ? `<span class="feat-res-overflow">+${max-10}</span>` : '';
    return `<span class="feat-res-mini">${pips}${overflow}</span>`;
  }

  // Subclass feature cards
  const subCards = subFeatures.map((f, rawI) => {
    const i = allFeatures.indexOf(f);
    const lvl = featLevel(f);
    const res = linkedResource(f);
    const resMini = renderResourceMini(res);
    const idKey = `sf-desc-${i}`;
    return `
      <div class="sf-card" id="sf-card-${i}">
        <div class="sf-card-header" onclick="toggleSfCard('${idKey}', this)">
          <span class="sf-source-badge">${esc(f._subclass)}</span>
          <span class="sf-name">${esc(f.name)}</span>
          ${lvl ? `<span class="sf-level">Lv ${lvl}</span>` : ''}
          ${resMini}
          <span class="sf-toggle">▼</span>
        </div>
        <div class="sf-card-body hidden" id="${idKey}">
          <div class="sf-body-name">${esc(f.name)}</div>
          <p class="sf-desc">${esc(f.desc || 'No description.')}</p>
        </div>
      </div>`;
  }).join('');

  // Custom feature cards (styled like subclass cards but editable)
  const customRows = customFeatures.map(f => {
    const i = allFeatures.indexOf(f);
    const idKey = `cf-desc-${i}`;
    // Feat/background entries are read-only collapsed cards
    if (f._feat || f._background) {
      const srcInfo = f._feat ? (FEAT_SOURCE_COLORS[f._featSource] || { abbr: f._featSource || 'Feat', color: '#9b6dff' }) : { abbr: 'Background', color: '#22c55e' };
      return `
        <div class="sf-card cf-card" id="feat-row-${i}">
          <div class="sf-card-header" onclick="toggleSfCard('${idKey}', this)">
            <span class="sf-source-badge" style="background:${srcInfo.color};color:#fff;padding:0.1rem 0.4rem;border-radius:3px;font-size:0.65rem;font-weight:bold">${srcInfo.abbr}</span>
            <span class="sf-name">${esc(f.name)}</span>
            <span class="sf-toggle">▼</span>
            <button class="feature-del-btn cf-del-btn" onclick="event.stopPropagation();removeFeature(${i})" title="Remove">&times;</button>
          </div>
          <div class="sf-card-body hidden" id="${idKey}">
            <p class="sf-desc">${esc(f.desc || 'No description.')}</p>
          </div>
        </div>`;
    }
    return `
      <div class="sf-card cf-card" id="feat-row-${i}">
        <div class="sf-card-header cf-card-header" onclick="toggleSfCard('${idKey}', this)">
          <span class="cf-custom-badge">Custom</span>
          <input class="cf-name-input" value="${esc(f.name)}" placeholder="Feature name"
            oninput="updateFeatureField(${i},'name',this.value)" onblur="saveData(db)"
            onclick="event.stopPropagation()">
          <span class="sf-toggle">▼</span>
          <button class="feature-del-btn cf-del-btn" onclick="event.stopPropagation();removeFeature(${i})" title="Remove">&times;</button>
        </div>
        <div class="sf-card-body hidden" id="${idKey}">
          <textarea class="cf-desc-input sheet-textarea" rows="3" placeholder="Describe this feature..."
            oninput="updateFeatureField(${i},'desc',this.value)" onblur="saveData(db)">${esc(f.desc || '')}</textarea>
        </div>
      </div>`;
  }).join('');

  const subSection = subFeatures.length ? `
    <div class="feat-section-label">✦ Class &amp; Subclass Features</div>
    ${subCards}` : '';

  const customSection = `
    <div class="feat-section-divider${subFeatures.length ? '' : ' feat-section-first'}">
      <span>Custom Features</span>
    </div>
    <div id="features-list">
      ${customRows || '<div class="feature-empty">No custom features yet.</div>'}
    </div>
    <div class="feature-add-row">
      <button class="btn btn-sm feature-add-btn" onclick="addFeatureInline()">+ Add Feature</button>
      <button class="btn btn-sm" onclick="openFeatBrowser()">✦ Browse Feats</button>
    </div>`;

  return `<div class="sheet-panel features-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Features &amp; Traits</div>
    ${subSection}
    ${customSection}
  </div>`;
}

// ── Feat Browser ──────────────────────────────────────────────────────────────
const FEAT_SOURCE_COLORS = {
  'PHB 2024':    { abbr: 'PHB24', color: '#c084fc' },
  'PHB 2014':    { abbr: 'PHB14', color: '#6d7b9b' },
  "Xanathar's":  { abbr: 'XGE',   color: '#14b8a6' },
  "Tasha's":     { abbr: 'TCE',   color: '#22c55e' },
  "Bigby's":     { abbr: 'BGG',   color: '#f59e0b' },
  'Dragonlance': { abbr: 'DSotDQ',color: '#ef4444' },
};
const FEAT_CAT_COLORS = {
  'General': '#9b6dff', 'Origin': '#f59e0b',
  'Fighting Style': '#ef4444', 'FS:P': '#ef4444', 'FS:R': '#ef4444',
  'EB': '#c084fc',
};
const FEAT_CAT_LABELS = { 'EB': 'Epic Boon', 'FS:P': 'Fighting Style', 'FS:R': 'Fighting Style' };

let _featSearch = '', _featCatFilter = 'All', _featSrcFilter = 'All', _featShowCount = 50;

const FEAT_CAT_OPTS = ['All','General','Origin','Fighting Style','Epic Boon'];
const FEAT_SRC_OPTS = ['All','PHB 2024','PHB 2014',"Xanathar's","Tasha's"];

// Magic item browser
const MAGIC_RARITY_OPTS = ['All','common','uncommon','rare','very rare','legendary'];
const MAGIC_RARITY_COLORS = {
  common:     '#9ca3af',
  uncommon:   '#22c55e',
  rare:       '#3b82f6',
  'very rare':'#a855f7',
  legendary:  '#f59e0b',
  artifact:   '#ef4444',
};
const MAGIC_RARITY_LABELS = {
  common:'Common', uncommon:'Uncommon', rare:'Rare',
  'very rare':'Very Rare', legendary:'Legendary', artifact:'Artifact',
};
let _magicSearch = '', _magicRarityFilter = 'All', _magicShowCount = 50;

function openFeatBrowser() {
  _featSearch = ''; _featCatFilter = 'All'; _featSrcFilter = 'All'; _featShowCount = 50;
  const catBtns = FEAT_CAT_OPTS.map((c,i) =>
    `<button class="btn btn-sm ${i===0?'btn-primary':''}" onclick="setFeatFilter('cat',${i},this)">${esc(c)}</button>`).join('');
  const srcBtns = FEAT_SRC_OPTS.map((s,i) =>
    `<button class="btn btn-sm ${i===0?'btn-primary':''}" onclick="setFeatFilter('src',${i},this)">${esc(s)}</button>`).join('');
  openModal(`<h2>✦ Browse Feats</h2>
    <input type="text" id="feat-search" placeholder="Search feats..." style="width:100%;margin-bottom:0.4rem" oninput="_featSearch=this.value;_featShowCount=50;updateFeatResults()">
    <div class="feat-filter-row" id="feat-cat-filters">${catBtns}</div>
    <div class="feat-filter-row" style="margin-top:0.25rem;margin-bottom:0.4rem" id="feat-src-filters">${srcBtns}</div>
    <div style="font-size:0.7rem;color:var(--text-dim);margin-bottom:0.3rem" id="feat-count"></div>
    <div id="feat-results" style="max-height:52vh;overflow-y:auto"></div>`);
  setTimeout(() => { updateFeatResults(); document.getElementById('feat-search')?.focus(); }, 20);
}

function setFeatFilter(type, idx, btn) {
  if (type === 'cat') {
    _featCatFilter = FEAT_CAT_OPTS[idx] || 'All';
    document.querySelectorAll('#feat-cat-filters .btn').forEach(b => b.classList.remove('btn-primary'));
  } else {
    _featSrcFilter = FEAT_SRC_OPTS[idx] || 'All';
    document.querySelectorAll('#feat-src-filters .btn').forEach(b => b.classList.remove('btn-primary'));
  }
  btn.classList.add('btn-primary');
  _featShowCount = 50;
  updateFeatResults();
}

function updateFeatResults() {
  const el = document.getElementById('feat-results');
  const countEl = document.getElementById('feat-count');
  if (!el) return;
  const ch = db.characters[currentCharId];
  const added = new Set((ch?.featuresList || []).filter(f => f._feat).map(f => f.name));
  const q = _featSearch.toLowerCase();
  const all = FEATS_ITEMS_DATA?.feats || [];
  const filtered = all.filter(f => {
    if (q && !f.name.toLowerCase().includes(q) && !(f.desc||'').toLowerCase().includes(q)) return false;
    if (_featCatFilter !== 'All') {
      const match = _featCatFilter === 'Fighting Style'
        ? (f.category === 'Fighting Style' || f.category === 'FS:P' || f.category === 'FS:R')
        : _featCatFilter === 'Epic Boon' ? f.category === 'EB' : f.category === _featCatFilter;
      if (!match) return false;
    }
    if (_featSrcFilter !== 'All' && f.source !== _featSrcFilter) return false;
    return true;
  });
  if (countEl) countEl.textContent = `${filtered.length} feat${filtered.length !== 1 ? 's' : ''}`;
  if (filtered.length === 0) { el.innerHTML = '<p style="color:var(--text-dim);padding:0.5rem 0">No feats match.</p>'; return; }
  const show = filtered.slice(0, _featShowCount);
  const remaining = filtered.length - show.length;
  window._featVisible = show; // index lookup for onclick
  el.innerHTML = show.map((f, fi) => {
    const src = FEAT_SOURCE_COLORS[f.source] || { abbr: (f.source||'?').split(' ')[0], color: '#7b6d8d' };
    const catColor = FEAT_CAT_COLORS[f.category] || '#9b6dff';
    const catLabel = FEAT_CAT_LABELS[f.category] || f.category || '';
    const isAdded = added.has(f.name);
    const uid = 'fd-' + f.name.replace(/[^a-z0-9]/gi, '-');
    // Format ability bonus
    let abLine = '';
    if (f.ability_bonus && Object.keys(f.ability_bonus).length) {
      const ab = f.ability_bonus;
      if (ab.choose) {
        const from = (ab.choose.from||[]).map(s=>s.toUpperCase()).join(', ');
        abLine = `+${ab.choose.amount} to ${ab.choose.count > 1 ? ab.choose.count + ' of' : 'one from'} [${from}]`;
      } else {
        abLine = Object.entries(ab).map(([k,v])=>`+${v} ${k.toUpperCase()}`).join(', ');
      }
    }
    return `<div class="spell-browser-row" style="flex-wrap:wrap">
      <div class="spell-browser-left">
        <span style="font-size:0.82rem;font-weight:600">${esc(f.name)}</span>
        <span class="spell-source-badge" style="background:${src.color}">${src.abbr}</span>
        <span class="feat-cat-badge" style="border-color:${catColor};color:${catColor}">${catLabel}</span>
        ${f.prerequisite ? `<span style="font-size:0.68rem;color:var(--text-dim)">${esc(f.prerequisite)}</span>` : ''}
      </div>
      <div style="display:flex;gap:0.3rem;flex-shrink:0">
        <button id="fbt-${uid}" class="btn btn-sm" onclick="toggleFeatDesc('${uid}')">▾</button>
        ${isAdded
          ? `<button class="btn btn-sm btn-primary" disabled style="opacity:0.7">✓ Added</button>`
          : `<button class="btn btn-sm" onclick="addFeatByIdx(${fi})">+ Add</button>`}
      </div>
      <div id="${uid}" style="display:none;width:100%;padding:0.3rem 0.25rem 0.4rem;font-size:0.78rem;color:var(--text-dim);border-top:1px solid rgba(155,109,255,0.15);margin-top:0.2rem">
        <p style="margin:0 0 0.3rem">${esc(f.desc || '')}</p>
        ${abLine ? `<div style="color:var(--gold-lt);font-size:0.74rem">Ability bonus: ${esc(abLine)}</div>` : ''}
      </div>
    </div>`;
  }).join('') + (remaining > 0 ? `<button class="btn btn-sm" style="width:100%;margin-top:0.4rem" onclick="_featShowCount+=${Math.min(remaining,100)};updateFeatResults()">Show more (${remaining} remaining)</button>` : '');
}

function toggleFeatDesc(uid) {
  const el = document.getElementById(uid);
  if (!el) return;
  const hidden = el.style.display === 'none';
  el.style.display = hidden ? 'block' : 'none';
  const btn = document.getElementById('fbt-' + uid);
  if (btn) btn.textContent = hidden ? '▴' : '▾';
}

function addFeatByIdx(i) {
  const f = (window._featVisible || [])[i];
  if (f) addFeatToChar(f.name);
}

function addFeatToChar(featName) {
  const ch = db.characters[currentCharId];
  if (!ch) return;
  const f = (FEATS_ITEMS_DATA?.feats || []).find(x => x.name === featName);
  if (!f) return;
  ch.featuresList = ch.featuresList || [];
  ch.featuresList.push({ name: f.name, desc: f.desc || '', _feat: true, _featSource: f.source });
  saveData(db);
  updateFeatResults();
  renderApp();
}

// ── Magic Item Randomizer (DM Tool) ───────────────────────────────────────────
const MAGIC_TYPE_OPTS = ['All Types','Weapon','Armor','Wondrous','Potion','Scroll','Ring','Staff','Wand','Rod'];
let _randRarities = new Set(['common','uncommon','rare','very rare','legendary']);
let _randTypeFilter = 'All Types';
let _randHistory = []; // last 5 rolled items
let _randCurrent = null;

function openMagicItemRandomizer() {
  _randHistory = [];
  _randCurrent = null;
  openModal(_buildRandModal());
}

function _buildRandModal() {
  const campaign = db.campaigns.find(c => c.id === currentCampaignId);
  const chars = (campaign?.characters || []).map(id => db.characters[id]).filter(Boolean);
  const rarityBtns = ['common','uncommon','rare','very rare','legendary'].map(r => {
    const color = MAGIC_RARITY_COLORS[r] || '#9ca3af';
    const active = _randRarities.has(r);
    return `<button class="btn btn-sm rand-rarity-btn ${active?'rand-rarity-active':''}"
      style="border-color:${color};color:${active?'#0d0d1a':color};background:${active?color:'transparent'}"
      onclick="toggleRandRarity('${r}',this,'${color}')">${MAGIC_RARITY_LABELS[r]}</button>`;
  }).join('');
  const typeOpts = MAGIC_TYPE_OPTS.map(t =>
    `<option value="${esc(t)}" ${_randTypeFilter===t?'selected':''}>${esc(t)}</option>`
  ).join('');
  const charOpts = chars.length
    ? chars.map(ch => `<option value="${esc(ch.id)}">${esc(ch.name||'Unnamed')}</option>`).join('')
    : `<option disabled>No characters in campaign</option>`;

  const resultHtml = _randCurrent ? _buildRandResultCard(_randCurrent) : `
    <div class="rand-empty-state">Press <strong>Roll Random Item</strong> to get started</div>`;

  const historyHtml = _randHistory.length > 0 ? `
    <div class="rand-history-label">Recent Rolls</div>
    ${_randHistory.map((item, i) => {
      const color = MAGIC_RARITY_COLORS[item.rarity] || '#9ca3af';
      return `<div class="rand-history-row">
        <span class="eq-magic-dot" style="background:${color};margin-top:3px"></span>
        <span style="flex:1;font-size:0.8rem">${esc(item.name)}</span>
        <select class="lang-add-select" onchange="awardHistoryItem(${i},this.value);this.value=''">
          <option value="">Award to…</option>
          ${charOpts}
        </select>
      </div>`;
    }).join('')}` : '';

  return `<h2>🎲 Magic Item Randomizer</h2>
    <div style="margin-bottom:0.5rem">
      <div class="cs-field-label" style="margin-bottom:0.3rem">Rarity</div>
      <div class="feat-filter-row">${rarityBtns}</div>
    </div>
    <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.75rem">
      <div class="cs-field-label" style="margin:0">Type</div>
      <select class="lang-add-select" style="font-size:0.8rem;padding:0.25rem 0.5rem" onchange="_randTypeFilter=this.value">${typeOpts}</select>
    </div>
    <button class="btn btn-primary" style="width:100%;margin-bottom:0.75rem" onclick="rollRandomItem()">🎲 Roll Random Item</button>
    <div id="rand-result">${resultHtml}</div>
    ${_randCurrent ? `<div style="display:flex;gap:0.5rem;margin-top:0.6rem;align-items:center">
      <button class="btn btn-sm" onclick="rollRandomItem()">🎲 Roll Again</button>
      <select class="lang-add-select" style="font-size:0.8rem;padding:0.25rem 0.5rem;flex:1" onchange="awardCurrentItem(this.value);this.value=''">
        <option value="">⊕ Award to Character…</option>
        ${charOpts}
      </select>
    </div>` : ''}
    ${historyHtml ? `<div class="rand-history">${historyHtml}</div>` : ''}
  `;
}

function _buildRandResultCard(item) {
  const color = MAGIC_RARITY_COLORS[item.rarity] || '#9ca3af';
  const label = MAGIC_RARITY_LABELS[item.rarity] || item.rarity;
  const attuneTxt = item.attunement
    ? `<div style="font-size:0.75rem;color:#f59e0b;margin-top:0.2rem">⟡ ${esc(item.attunement)}</div>` : '';
  return `<div class="rand-result-card" style="border-color:${color}40;box-shadow:0 0 16px ${color}30">
    <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.4rem">
      <span style="font-size:1.05rem;font-weight:700;color:var(--text-main)">${esc(item.name)}</span>
      <span class="feat-cat-badge" style="border-color:${color};color:${color}">${esc(label)}</span>
      ${item.type ? `<span style="font-size:0.72rem;color:var(--text-dim)">${esc(item.type)}</span>` : ''}
    </div>
    ${attuneTxt}
    <div style="font-size:0.78rem;color:var(--text-dim);margin-top:0.4rem;line-height:1.5">${esc(item.desc||'')}</div>
  </div>`;
}

function toggleRandRarity(rarity, btn, color) {
  if (_randRarities.has(rarity)) {
    if (_randRarities.size === 1) return; // keep at least one
    _randRarities.delete(rarity);
    btn.classList.remove('rand-rarity-active');
    btn.style.background = 'transparent';
    btn.style.color = color;
  } else {
    _randRarities.add(rarity);
    btn.classList.add('rand-rarity-active');
    btn.style.background = color;
    btn.style.color = '#0d0d1a';
  }
}

function rollRandomItem() {
  const typeQ = _randTypeFilter === 'All Types' ? '' : _randTypeFilter.toLowerCase();
  const pool = (FEATS_ITEMS_DATA?.magic_items || []).filter(item => {
    if (!_randRarities.has(item.rarity)) return false;
    if (typeQ && !(item.type||'').toLowerCase().includes(typeQ)) return false;
    return true;
  });
  if (!pool.length) { alert('No items match the current filters.'); return; }
  const item = pool[Math.floor(Math.random() * pool.length)];
  // Push to history (keep last 5, avoid immediate duplicate at top)
  if (_randCurrent && (_randHistory.length === 0 || _randHistory[0].name !== _randCurrent.name)) {
    _randHistory.unshift(_randCurrent);
    if (_randHistory.length > 5) _randHistory.pop();
  }
  _randCurrent = item;
  // Rebuild the modal content (preserves filter state)
  openModal(_buildRandModal());
  // Shimmer animation on result card
  const card = document.querySelector('.rand-result-card');
  if (card) { card.classList.add('rand-shimmer'); setTimeout(() => card.classList.remove('rand-shimmer'), 500); }
}

function awardCurrentItem(charId) {
  if (!charId || !_randCurrent) return;
  _awardItemToChar(_randCurrent, charId);
}

function awardHistoryItem(historyIdx, charId) {
  if (!charId) return;
  const item = _randHistory[historyIdx];
  if (!item) return;
  _awardItemToChar(item, charId);
}

function _awardItemToChar(item, charId) {
  const ch = db.characters[charId];
  if (!ch) return;
  ch.equipment = ch.equipment || [];
  ch.equipment.push({ name: item.name, rarity: item.rarity, type: item.type||'', attunement: item.attunement||'', desc: item.desc||'', _magic: true });
  saveData(db);
  showToast(`<strong>${esc(item.name)}</strong> awarded to <strong>${esc(ch.name||'Unnamed')}</strong>`);
}

// ── Magic Item Browser ─────────────────────────────────────────────────────────
function openMagicItemBrowser() {
  _magicSearch = ''; _magicRarityFilter = 'All'; _magicShowCount = 50;
  const rarityBtns = MAGIC_RARITY_OPTS.map((r, i) => {
    const color = MAGIC_RARITY_COLORS[r] || 'var(--text-dim)';
    const style = i === 0 ? '' : `border-color:${color};color:${color}`;
    return `<button class="btn btn-sm ${i===0?'btn-primary':''}" style="${style}" onclick="setMagicFilter(${i},this)">${i===0?'All':MAGIC_RARITY_LABELS[r]}</button>`;
  }).join('');
  openModal(`<h2>⚔ Magic Items</h2>
    <input type="text" id="magic-search" placeholder="Search magic items..." style="width:100%;margin-bottom:0.4rem" oninput="_magicSearch=this.value;_magicShowCount=50;updateMagicResults()">
    <div class="feat-filter-row" id="magic-rarity-filters" style="margin-bottom:0.5rem">${rarityBtns}</div>
    <div id="magic-results" style="max-height:360px;overflow-y:auto"></div>
  `);
  updateMagicResults();
}

function setMagicFilter(idx, btn) {
  _magicRarityFilter = MAGIC_RARITY_OPTS[idx] || 'All';
  _magicShowCount = 50;
  document.querySelectorAll('#magic-rarity-filters .btn').forEach(b => b.classList.remove('btn-primary'));
  btn.classList.add('btn-primary');
  updateMagicResults();
}

function updateMagicResults() {
  const container = document.getElementById('magic-results');
  if (!container) return;
  const ch = db.characters[currentCharId];
  const addedNames = new Set((ch?.equipment || []).filter(e => typeof e === 'object' && e._magic).map(e => e.name));

  const q = _magicSearch.toLowerCase();
  let items = (FEATS_ITEMS_DATA?.magic_items || []).filter(item => {
    if (_magicRarityFilter !== 'All' && item.rarity !== _magicRarityFilter) return false;
    if (q && !item.name.toLowerCase().includes(q) && !(item.type||'').toLowerCase().includes(q)) return false;
    return true;
  });

  // Deduplicate by name+rarity (keep first)
  const seen = new Set();
  items = items.filter(item => {
    const key = item.name + '|' + item.rarity;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const total = items.length;
  const visible = items.slice(0, _magicShowCount);
  const remaining = total - visible.length;

  window._magicVisible = visible; // index lookup for onclick
  container.innerHTML = visible.map((item, i) => {
    const uid = 'mi-' + i + '-' + item.name.replace(/\W/g,'').slice(0,8);
    const color = MAGIC_RARITY_COLORS[item.rarity] || '#9ca3af';
    const label = MAGIC_RARITY_LABELS[item.rarity] || item.rarity;
    const isAdded = addedNames.has(item.name);
    const attuneTxt = item.attunement ? `<span style="font-size:0.68rem;color:#f59e0b">⟡ ${esc(item.attunement)}</span>` : '';
    return `<div style="border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.5rem;margin-bottom:0.3rem">
      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap">
        <span style="font-size:0.82rem;font-weight:600">${esc(item.name)}</span>
        <span class="feat-cat-badge" style="border-color:${color};color:${color}">${esc(label)}</span>
        ${item.type ? `<span style="font-size:0.68rem;color:var(--text-dim)">${esc(item.type)}</span>` : ''}
        ${attuneTxt}
        <div style="display:flex;gap:0.3rem;flex-shrink:0;margin-left:auto">
          <button id="mibt-${uid}" class="btn btn-sm" onclick="toggleMagicDesc('${uid}')">▾</button>
          ${isAdded
            ? `<button class="btn btn-sm btn-primary" disabled style="opacity:0.7">✓ Added</button>`
            : `<button class="btn btn-sm" onclick="addMagicItemByIdx(${i})">+ Add</button>`}
        </div>
      </div>
      <div id="${uid}" style="display:none;width:100%;padding:0.3rem 0.25rem 0.4rem;font-size:0.78rem;color:var(--text-dim);border-top:1px solid rgba(155,109,255,0.15);margin-top:0.2rem">
        ${esc(item.desc || 'No description available.')}
      </div>
    </div>`;
  }).join('') + (remaining > 0
    ? `<button class="btn btn-sm" style="width:100%;margin-top:0.4rem" onclick="_magicShowCount+=50;updateMagicResults()">Show more (${remaining} remaining)</button>`
    : '');
}

function toggleMagicDesc(uid) {
  const el = document.getElementById(uid);
  if (!el) return;
  const hidden = el.style.display === 'none';
  el.style.display = hidden ? 'block' : 'none';
  const btn = document.getElementById('mibt-' + uid);
  if (btn) btn.textContent = hidden ? '▴' : '▾';
}

function addMagicItemToChar(itemName, itemRarity) {
  const ch = db.characters[currentCharId];
  if (!ch) return;
  const item = (FEATS_ITEMS_DATA?.magic_items || []).find(x => x.name === itemName && x.rarity === itemRarity);
  if (!item) return;
  ch.equipment = ch.equipment || [];
  ch.equipment.push({ name: item.name, rarity: item.rarity, type: item.type || '', attunement: item.attunement || '', desc: item.desc || '', _magic: true });
  // Prompt to attune if needed
  if (item.attunement && ch.attunedItems !== undefined) {
    if (confirm(`"${item.name}" ${item.attunement}. Add to attuned items?`)) {
      ch.attunedItems = ch.attunedItems || [];
      if (!ch.attunedItems.includes(item.name)) ch.attunedItems.push(item.name);
    }
  }
  saveData(db);
  updateMagicResults();
  renderApp();
}

function addMagicItemByIdx(i) {
  const item = (window._magicVisible || [])[i];
  if (item) addMagicItemToChar(item.name, item.rarity);
}

function toggleEquipDesc(idx) {
  const el = document.getElementById('eqdesc-' + idx);
  if (!el) return;
  const hidden = el.style.display === 'none';
  el.style.display = hidden ? 'block' : 'none';
  const btn = document.getElementById('eqbt-' + idx);
  if (btn) btn.textContent = hidden ? '▴' : '▾';
}

function toggleSfCard(id, headerEl) {
  const body = document.getElementById(id);
  if (!body) return;
  const hidden = body.classList.toggle('hidden');
  const toggle = headerEl.querySelector('.sf-toggle');
  if (toggle) toggle.textContent = hidden ? '▼' : '▲';
}

function addLanguage(lang) {
  const ch = db.characters[currentCharId];
  if (!ch) return;
  ch.knownLanguages = ch.knownLanguages || ['Common'];
  if (!ch.knownLanguages.includes(lang)) {
    ch.knownLanguages.push(lang);
    saveData(db);
    renderApp();
  }
}

function removeLanguage(lang) {
  const ch = db.characters[currentCharId];
  if (!ch) return;
  ch.knownLanguages = (ch.knownLanguages || []).filter(l => l !== lang);
  saveData(db);
  renderApp();
}

function renderProficienciesLanguages(ch) {
  const extraClasses = (ch.classes || []).slice(1);
  const mcNote = extraClasses.length > 0 ? `
    <div class="cs-field-label" style="margin:0.6rem 0 0.25rem">Multiclass Proficiencies</div>
    <div class="mc-prof-list">
      ${extraClasses.map(entry => {
        const cls = entry.class;
        const color = CLASS_BADGE_COLORS[cls] || '#9b6dff';
        const profs = CLASS_MC_PROFS[cls] || '—';
        return `<div class="mc-prof-entry">
          <span class="mc-prof-badge" style="background:${color}">${CLASS_ICONS[cls]||''} ${cls}</span>
          <span class="mc-prof-text">${esc(profs)}</span>
        </div>`;
      }).join('')}
    </div>` : '';

  const known = ch.knownLanguages || ['Common'];
  const allKnown = new Set(known);
  const pills = known.map(l =>
    `<span class="lang-pill">${esc(l)}<button class="lang-pill-remove" onclick="removeLanguage(${JSON.stringify(l)})" title="Remove">×</button></span>`
  ).join('');

  const allLangs = [...STANDARD_LANGUAGES.standard, ...STANDARD_LANGUAGES.exotic, ...STANDARD_LANGUAGES.secret];
  const stdOpts = STANDARD_LANGUAGES.standard.filter(l => !allKnown.has(l))
    .map(l => `<option value="${esc(l)}">${esc(l)}</option>`).join('');
  const exoOpts = STANDARD_LANGUAGES.exotic.filter(l => !allKnown.has(l))
    .map(l => `<option value="${esc(l)}">${esc(l)}</option>`).join('');
  const secOpts = STANDARD_LANGUAGES.secret.filter(l => !allKnown.has(l))
    .map(l => `<option value="${esc(l)}">${esc(l)}</option>`).join('');

  const hasOptions = stdOpts || exoOpts || secOpts;
  const dropdown = hasOptions ? `
    <select class="lang-add-select" onchange="if(this.value){addLanguage(this.value);this.value=''}">
      <option value="">+ Add language…</option>
      ${stdOpts ? `<optgroup label="Standard">${stdOpts}</optgroup>` : ''}
      ${exoOpts ? `<optgroup label="Exotic">${exoOpts}</optgroup>` : ''}
      ${secOpts ? `<optgroup label="Secret">${secOpts}</optgroup>` : ''}
    </select>` : '';

  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Proficiencies &amp; Languages</div>
    <div class="cs-field-label" style="margin-bottom:0.3rem">Proficiencies</div>
    <textarea class="sheet-textarea" rows="3" placeholder="Weapons, armor, tools..." oninput="ch_field('proficiencies',this.value)">${esc(ch.proficiencies||'')}</textarea>
    ${mcNote}
    <div class="cs-field-label" style="margin:0.6rem 0 0.3rem">Languages</div>
    <div class="lang-pills-row">${pills}${dropdown}</div>
    <div class="cs-field-label" style="margin:0.5rem 0 0.2rem;font-size:0.72rem;opacity:0.7">Additional Notes</div>
    <textarea class="sheet-textarea" rows="2" placeholder="Custom languages, dialects, notes…" oninput="ch_field('languages',this.value)">${esc(ch.languages||'')}</textarea>
  </div>`;
}

function renderNotesSection(ch) {
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Notes</div>
    <textarea class="sheet-textarea" rows="6" placeholder="Session notes, quest logs, NPC info..." oninput="ch_field('notes',this.value)">${esc(ch.notes||'')}</textarea>
  </div>`;
}

// ── Sheet Tab System ─────────────────────────────────────────────────────────

function renderInventoryTab(ch) {
  const strScore = ch.abilities?.str || 10;
  const maxCarry = strScore * 15;
  const items = ch.equipment || [];
  const encumbrance = renderEncumbrance(ch, maxCarry);
  return `${renderEquipmentCurrency(ch)}
    ${encumbrance}`;
}

function renderEncumbrance(ch, maxCarry) {
  const totalWeight = (ch.carryWeight || 0);
  const pct = maxCarry > 0 ? Math.min(100, Math.round((totalWeight / maxCarry) * 100)) : 0;
  const barClass = pct >= 100 ? 'low' : pct >= 66 ? 'mid' : '';
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Encumbrance</div>
    <div class="flex gap-2" style="align-items:center;margin-bottom:0.4rem">
      <input type="number" min="0" value="${totalWeight}" oninput="ch_field('carryWeight',+this.value)" style="width:60px;text-align:center;background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--gold);font-weight:bold;font-size:1rem" title="Current carry weight">
      <span class="text-dim" style="font-size:0.8rem">/ ${maxCarry} lbs (STR ${ch.abilities?.str || 10} &times; 15)</span>
    </div>
    <div class="hp-bar-wrap"><div class="hp-bar ${barClass}" style="width:${pct}%"></div></div>
  </div>`;
}

function renderFeaturesTab(ch) {
  const features = ch.featuresList || [];
  const featureCards = features.length ? features.map((f, i) => `
    <div class="feature-card">
      <div class="feature-card-header" onclick="toggleFeatureDesc('feature-desc-${i}')">
        <span class="feature-card-name">${esc(f.name)}</span>
        <span class="feature-card-toggle">&#9662;</span>
      </div>
      <div class="feature-card-body hidden" id="feature-desc-${i}">
        <textarea class="sheet-textarea" rows="3" placeholder="Description..." oninput="updateFeatureField(${i},'desc',this.value)">${esc(f.desc || '')}</textarea>
      </div>
    </div>`).join('') : '';

  return `<div class="sheet-panel">
    <div class="cs-section-label">Features &amp; Traits</div>
    ${featureCards}
    <div class="flex gap-1" style="margin-top:0.5rem">
      <input type="text" id="feature-name-input" placeholder="Feature name..." style="flex:1" onkeydown="if(event.key==='Enter')addFeature()">
      <button class="btn btn-sm" onclick="addFeature()">+ Add</button>
    </div>
    <div style="margin-top:0.8rem">
      <div class="cs-field-label" style="margin-bottom:0.2rem;color:var(--text-dim)">Legacy (freeform)</div>
      <textarea class="sheet-textarea" rows="4" placeholder="Class features, racial traits, feats..." oninput="ch_field('features',this.value)">${esc(ch.features || '')}</textarea>
    </div>
  </div>
  ${renderProficienciesLanguages(ch)}`;
}

function renderNotesTab(ch) {
  const log = (ch.sessionLog || []).slice(0, 20);
  const logHtml = log.length ? `
    <div class="sheet-panel" style="margin-top:0.6rem">
      <div class="cs-section-label">Session Log</div>
      ${log.map(e => `<div class="spell-log-entry">${esc(e.text)}<span class="spell-log-ts">${new Date(e.ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span></div>`).join('')}
    </div>` : '';
  return `<div class="sheet-panel">
    <div class="cs-section-label">Notes</div>
    <textarea class="sheet-textarea" rows="14" placeholder="Session notes, quest logs, NPC info..." oninput="ch_field('notes',this.value)">${esc(ch.notes || '')}</textarea>
  </div>
  ${logHtml}`;
}

function toggleFeatureDesc(id) { document.getElementById(id)?.classList.toggle('hidden'); }
function addFeatureInline() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.featuresList = ch.featuresList || [];
  ch.featuresList.push({ name: '', desc: '' });
  saveData(db); renderApp();
  // Focus the new name input
  setTimeout(() => {
    const inputs = document.querySelectorAll('.feature-name-input');
    if (inputs.length) inputs[inputs.length - 1].focus();
  }, 50);
}
function addFeature() {
  const input = document.getElementById('feature-name-input');
  const val = input?.value?.trim(); if (!val) return;
  const ch = db.characters[currentCharId];
  ch.featuresList = ch.featuresList || [];
  ch.featuresList.push({ name: val, desc: '' });
  input.value = '';
  saveData(db); renderApp();
}
function removeFeature(i) {
  db.characters[currentCharId].featuresList.splice(i, 1);
  saveData(db); renderApp();
}
function updateFeatureField(i, field, value) {
  const ch = db.characters[currentCharId];
  if (ch.featuresList && ch.featuresList[i]) ch.featuresList[i][field] = value;
}
function populateClassFeatures() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const cls = ch.class || ch.className || '';
  const lvl = parseInt(ch.level) || 1;
  const feats = getClassFeaturesUpToLevel(cls, lvl);
  if (!feats.length) return;
  ch.featuresList = [...(ch.featuresList || []), ...feats];
  saveData(db); renderApp();
}

function renderDefensesSection(ch) {
  const fields = [
    ['Resistances',         'resistances',        'Fire, cold, bludgeoning...'],
    ['Vulnerabilities',     'vulnerabilities',    'Lightning, poison...'],
    ['Immunities',          'damageImmunities',   'Poison, psychic...'],
    ['Condition Immunities','conditionImmunities','Charmed, frightened...'],
  ];
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Defenses</div>
    ${fields.map(([label, field, ph]) => `
      <div class="cs-field-label" style="margin-bottom:0.2rem">${label}</div>
      <textarea class="sheet-textarea" rows="2" placeholder="${ph}" oninput="ch_field('${field}',this.value)">${esc(ch[field] || '')}</textarea>`).join('')}
  </div>`;
}

function renderSensesSection(ch, pb) {
  const passPerc = 10 + skillBonus(ch, 'Perception',   'wis', pb);
  const passInv  = 10 + skillBonus(ch, 'Investigation','int', pb);
  const passIns  = 10 + skillBonus(ch, 'Insight',      'wis', pb);
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Senses</div>
    <div class="senses-passive-grid">
      <div class="senses-passive-row"><span class="cs-field-label">Passive Perception</span><span class="senses-val">${passPerc}</span></div>
      <div class="senses-passive-row"><span class="cs-field-label">Passive Investigation</span><span class="senses-val">${passInv}</span></div>
      <div class="senses-passive-row"><span class="cs-field-label">Passive Insight</span><span class="senses-val">${passIns}</span></div>
    </div>
    <div class="cs-field-label" style="margin:0.6rem 0 0.2rem">Other Senses</div>
    <textarea class="sheet-textarea" rows="2" placeholder="Darkvision 60 ft., Tremorsense 30 ft...." oninput="ch_field('otherSenses',this.value)">${esc(ch.otherSenses || '')}</textarea>
  </div>`;
}

// ── Character Sheet — Main Render ──────────────────────────────────────────────
// ── Resources Panel ───────────────────────────────────────────────────────────
// ── Resources Panel ───────────────────────────────────────────────────────────
function renderResourceCard(r, i, ch) {
  const max = resolveMaxFormula(r.max, ch);
  const current = Math.min(r.current || 0, max);
  const rechargeLabel = { short: 'Short Rest', long: 'Long Rest', dawn: 'Dawn', manual: 'Manual' }[r.recharge] || 'Long Rest';
  const dieBadge = r.die ? `<span class="res-die-badge">${r.die}</span>` : '';
  const controls = r.type === 'pool'
    ? `<div class="res-pool-controls">
        <button class="res-pool-btn" onclick="adjustResource(${i},-1)">−</button>
        <input type="number" class="res-pool-input" value="${current}" min="0" max="${max}"
          onchange="setResourceCurrent(${i},+this.value)" onkeydown="if(event.key==='Enter')this.blur()">
        <span class="res-pool-sep">/ ${max}</span>
        <button class="res-pool-btn" onclick="adjustResource(${i},1)">+</button>
      </div>`
    : `<div class="res-pips">${Array.from({length: Math.min(max, 20)}, (_, p) => {
        const filled = p < current;
        return `<button class="res-pip${filled ? ' res-pip-filled' : ''}" onclick="toggleResourcePip(${i},${p})"></button>`;
      }).join('')}${max > 20 ? `<span class="res-overflow">+${max-20}</span>` : ''}</div>`;

  return `<div class="res-card" data-res-id="${esc(r.id||i)}">
    <div class="res-card-header">
      <div class="res-card-meta">
        <span class="res-name">${esc(r.name)}</span>
        ${dieBadge}
        <span class="res-recharge">⟳ ${rechargeLabel}</span>
      </div>
      <div class="res-card-actions">
        <button class="res-action-btn" onclick="openResourceEditModal(${i})" title="Edit">✎</button>
        <button class="res-action-btn res-delete-btn" onclick="deleteResource(${i})" title="Delete">✕</button>
      </div>
    </div>
    ${controls}
  </div>`;
}

function renderResourcesPanel(ch) {
  const resources = ch.resources || [];
  const classRes = resources.filter(r => !r.custom);
  const customRes = resources.filter(r => r.custom);

  const hasAny = resources.length > 0;

  const classSection = classRes.length ? `
    <div class="res-group-label">Class &amp; Subclass</div>
    ${classRes.map(r => renderResourceCard(r, resources.indexOf(r), ch)).join('')}` : '';

  const customSection = `
    <div class="res-group-divider${!classRes.length ? ' res-group-first' : ''}"><span>Custom</span></div>
    ${customRes.length
      ? customRes.map(r => renderResourceCard(r, resources.indexOf(r), ch)).join('')
      : '<div class="feature-empty">No custom resources.</div>'}
    <button class="btn btn-sm res-add-btn" onclick="openResourceEditModal(-1)" style="margin-top:0.4rem">+ Add Resource</button>`;

  return `<div class="sheet-panel res-panel">
    <div class="cs-section-label">Resources</div>
    ${classSection}
    ${customSection}
  </div>`;
}

function toggleResourcePip(index, pipIndex) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const r = ch.resources[index]; if (!r) return;
  const max = resolveMaxFormula(r.max, ch);
  const current = Math.min(r.current || 0, max);
  r.current = pipIndex < current ? pipIndex : pipIndex + 1;
  r.current = Math.max(0, Math.min(max, r.current));
  saveData(db);
  const panel = document.querySelector('.res-panel');
  if (panel) panel.outerHTML = renderResourcesPanel(db.characters[currentCharId]);
  else renderApp();
}

function adjustResource(index, delta) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const r = ch.resources[index]; if (!r) return;
  const max = resolveMaxFormula(r.max, ch);
  r.current = Math.max(0, Math.min(max, (r.current || 0) + delta));
  saveData(db); renderApp();
}

function setResourceCurrent(index, val) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const r = ch.resources[index]; if (!r) return;
  const max = resolveMaxFormula(r.max, ch);
  r.current = Math.max(0, Math.min(max, Math.floor(val) || 0));
  saveData(db); renderApp();
}

function deleteResource(index) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.resources.splice(index, 1);
  saveData(db); renderApp();
}

function openResourceEditModal(index) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const isNew = index === -1;
  const r = isNew ? { name: '', type: 'pips', max: 3, current: 3, maxFormula: 3, die: null, recharge: 'long', source: '', desc: '', custom: true } : ch.resources[index];
  const dies = ['', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20'];
  openModal(`<h2>${isNew ? 'Add Resource' : 'Edit Resource'}</h2>
    <div class="form-group"><label>Name</label><input type="text" id="re-name" value="${esc(r.name)}" placeholder="Bardic Inspiration" autofocus></div>
    <div class="form-group"><label>Type</label>
      <div class="res-type-toggle">
        <button class="res-type-btn${r.type==='pips'?' active':''}" onclick="resTypeToggle('pips',this)">Pips</button>
        <button class="res-type-btn${r.type==='pool'?' active':''}" onclick="resTypeToggle('pool',this)">Pool</button>
      </div>
      <input type="hidden" id="re-type" value="${r.type}">
    </div>
    <div class="form-group"><label>Max</label><input type="number" id="re-max" value="${r.max}" min="1" max="999"></div>
    <div class="form-group"><label>Die (optional)</label>
      <select id="re-die">${dies.map(d=>`<option value="${d}"${(r.die||'')=== d?' selected':''}>${d||'None'}</option>`).join('')}</select>
    </div>
    <div class="form-group"><label>Recharge</label>
      <select id="re-recharge">
        ${['short','long','dawn','manual'].map(v=>`<option value="${v}"${r.recharge===v?' selected':''}>${{short:'Short Rest',long:'Long Rest',dawn:'Dawn',manual:'Manual'}[v]}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>Source</label><input type="text" id="re-source" value="${esc(r.source||'')}" placeholder="e.g. College of Lore"></div>
    <div class="form-group"><label>Description</label><textarea id="re-desc" rows="3" class="sheet-textarea" placeholder="What does this resource represent?">${esc(r.desc||'')}</textarea></div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveResourceEdit(${index})">Save</button>
    </div>`);
  setTimeout(() => document.getElementById('re-name')?.focus(), 50);
}

function resTypeToggle(type, btn) {
  document.getElementById('re-type').value = type;
  btn.closest('.res-type-toggle').querySelectorAll('.res-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function saveResourceEdit(index) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const name = document.getElementById('re-name').value.trim();
  if (!name) return;
  const max = Math.max(1, parseInt(document.getElementById('re-max').value) || 1);
  const entry = {
    id: index === -1 ? `res_${Date.now()}_${Math.random().toString(36).slice(2,6)}` : (ch.resources[index]?.id || `res_${Date.now()}`),
    name,
    type: document.getElementById('re-type').value || 'pips',
    max,
    maxFormula: max,
    current: index === -1 ? max : Math.min(ch.resources[index]?.current ?? max, max),
    die: document.getElementById('re-die').value || null,
    recharge: document.getElementById('re-recharge').value || 'long',
    source: document.getElementById('re-source').value.trim(),
    desc: document.getElementById('re-desc').value.trim(),
    custom: true,
  };
  ch.resources = ch.resources || [];
  if (index === -1) ch.resources.push(entry);
  else ch.resources[index] = { ...ch.resources[index], ...entry, custom: ch.resources[index]?.custom ?? true };
  saveData(db); closeModal(); renderApp();
}

function restoreResources(rechargeType, charId) {
  const id = charId || currentCharId;
  const ch = db.characters[id]; if (!ch) return;
  (ch.resources || []).forEach(r => {
    if (r.recharge === rechargeType) r.current = resolveMaxFormula(r.max, ch);
    if (rechargeType === 'long' && r.recharge === 'short') r.current = resolveMaxFormula(r.max, ch);
  });
}

// ── Die Scaling Rules ─────────────────────────────────────────────────────────
// Maps resource name → [[minLevel, die], ...] sorted ascending
const RESOURCE_DIE_SCALE = {
  'Bardic Inspiration':   [[1,'d6'],[5,'d8'],[10,'d10'],[15,'d12']],
  'Superiority Dice':     [[3,'d8'],[10,'d10'],[18,'d12']],
  'Psionic Energy Dice':  [[3,'d6'],[5,'d8'],[11,'d10'],[17,'d12']],
};

function scaledDie(resourceName, level) {
  const tiers = RESOURCE_DIE_SCALE[resourceName];
  if (!tiers) return null;
  let die = tiers[0][1];
  for (const [lvl, d] of tiers) { if (level >= lvl) die = d; }
  return die;
}

// ── Toast Notifications ───────────────────────────────────────────────────────
function showToast(html, duration = 5000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = html;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ── Sync Subclass Features on Level Change ────────────────────────────────────
function syncSubclassFeatures(charId) {
  const ch = db.characters[charId];
  if (!ch || !ch.subclass) return;

  const cls = ch.class || '';
  const subclassName = ch.subclass;
  const level = ch.level || 1;
  const subclassData = typeof SUBCLASS_DATA !== 'undefined' &&
    SUBCLASS_DATA[cls]?.[subclassName];
  if (!subclassData) return;

  const unlocked = [];

  // 1. Add newly unlocked features
  const existingNames = new Set((ch.featuresList || []).filter(f => f._subclass === subclassName).map(f => f.name));
  (subclassData.features || []).forEach(feat => {
    if (feat.level <= level && !existingNames.has(feat.name)) {
      ch.featuresList = ch.featuresList || [];
      ch.featuresList.push({ name: feat.name, desc: feat.description, _subclass: subclassName });
      unlocked.push({ name: feat.name, resource: feat.resource });
    }
  });

  // 2. Update resource maxes and die scaling
  (ch.resources || []).forEach(r => {
    if (!r._subclass) return;
    // Recalculate max from stored formula
    if (r.maxFormula !== undefined) {
      const newMax = resolveMaxFormula(r.maxFormula, ch);
      if (r.max !== newMax) {
        r.current = Math.min(r.current || 0, newMax);
        r.max = newMax;
      }
    }
    // Update die scaling
    const newDie = scaledDie(r.name, level);
    if (newDie && r.die !== newDie) {
      r.die = newDie;
    }
    // Bardic Inspiration recharges on short rest at level 5+
    if (r.name === 'Bardic Inspiration' && cls === 'Bard') {
      r.recharge = level >= 5 ? 'short' : 'long';
    }
  });

  // 3. Create resource trackers for newly unlocked features
  const existingResNames = new Set((ch.resources || []).filter(r => r._subclass === subclassName).map(r => r.name));
  unlocked.forEach(({ resource }) => {
    if (!resource || existingResNames.has(resource.name)) return;
    existingResNames.add(resource.name);
    const max = resolveMaxFormula(resource.maxFormula, ch);
    ch.resources = ch.resources || [];
    ch.resources.push({
      id: `res_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      name: resource.name,
      type: (resource.maxFormula === 'level_x5' || resource.name.includes('Hands') || resource.name.includes('Pool')) ? 'pool' : 'pips',
      current: max,
      max,
      maxFormula: resource.maxFormula,
      die: scaledDie(resource.name, level) || resource.die || null,
      recharge: resource.recharge || 'long',
      source: subclassName,
      desc: '',
      custom: false,
      _subclass: subclassName,
    });
  });

  // 4. Toast
  if (unlocked.length) {
    const lines = unlocked.map(u => {
      let msg = `<strong>${esc(u.name)}</strong>`;
      if (u.resource) {
        const die = scaledDie(u.resource.name, level) || u.resource.die;
        const recharge = u.resource.recharge === 'short' ? 'short rest' : 'long rest';
        msg += ` — ${esc(u.resource.name)}${die ? ' '+die : ''}, recharges on ${recharge}`;
      }
      return msg;
    }).join('<br>');
    showToast(`<div class="toast-title">✦ Level ${level} unlocked:</div>${lines}`);
  }

  // Sync base class resource maxes for level-scaling resources
  (ch.resources || []).forEach(r => {
    if (!r._baseClass) return;
    const newMax = resolveMaxFormula(r.maxFormula, ch);
    if (r.max !== newMax) {
      r.current = Math.min(r.current || 0, newMax);
      r.max = newMax;
    }
    // Sync die scaling (Bardic Inspiration)
    const scaledDieVal = scaledDie(r.name, level);
    if (scaledDieVal) r.die = scaledDieVal;
    // Bardic Inspiration recharge changes at level 5
    if (r.name === 'Bardic Inspiration') {
      r.recharge = level >= 5 ? 'short' : 'long';
    }
    // Action Surge gets 2 uses at level 17
    if (r.name === 'Action Surge') {
      const newMax2 = level >= 17 ? 2 : 1;
      if (r.max !== newMax2) { r.max = newMax2; r.current = Math.min(r.current, newMax2); }
    }
  });
}

function renderSubclassField(ch) {
  const cls = ch.class || '';
  const subclasses = (typeof SUBCLASS_DATA !== 'undefined' && SUBCLASS_DATA[cls])
    ? Object.keys(SUBCLASS_DATA[cls]) : [];
  const current = ch.subclass || '';
  const sourceLabel = current && SUBCLASS_DATA?.[cls]?.[current]?.source
    ? `<span class="subclass-source-badge">${SUBCLASS_DATA[cls][current].source}</span>` : '';

  if (!subclasses.length) {
    return `<input type="text" value="${esc(current)}" placeholder="Subclass..."
      oninput="ch_field('subclass',this.value)" onblur="saveData(db)">`;
  }

  const currentInList = subclasses.includes(current);
  function editionSuffix(subclassName) {
    const src = SUBCLASS_DATA?.[cls]?.[subclassName]?.source || '';
    if (src.includes('2024')) return ' (2024)';
    if (src.includes('2014') || src === 'PHB') return ' (2014)';
    if (src) return ` (${src})`;
    return '';
  }
  let opts = `<option value="">Choose subclass...</option>`;
  if (current && !currentInList) {
    opts += `<option value="${esc(current)}" selected>${esc(current)}</option>`;
  }
  opts += subclasses.map(s => `<option value="${esc(s)}"${current===s?' selected':''}>${esc(s)}${editionSuffix(s)}</option>`).join('');

  return `<div class="subclass-wrap">
    <select onchange="applySubclass('${ch.id}','${esc(cls)}',this.value)"
      style="flex:1;font-size:0.85rem;padding:0.1rem 0;background:transparent;border:none;border-bottom:1px solid var(--border);border-radius:0;color:var(--text)">
      ${opts}
    </select>
    ${sourceLabel}
  </div>`;
}

// ── Base Class Resources ──────────────────────────────────────────────────────
const BASE_CLASS_RESOURCES = {
  Barbarian: ch => [
    { name: 'Rage', maxFormula: 'rage_uses', die: null, recharge: 'long', type: 'pips',
      desc: 'Enter a rage as a Bonus Action. Lasts 1 minute.' },
  ],
  Bard: ch => [
    { name: 'Bardic Inspiration', maxFormula: 'cha_mod',
      die: scaledDie('Bardic Inspiration', ch.level || 1) || 'd6',
      recharge: (ch.level || 1) >= 5 ? 'short' : 'long', type: 'pips',
      desc: 'Give a creature a Bardic Inspiration die as a Bonus Action.' },
  ],
  Cleric: ch => [
    { name: 'Channel Divinity', maxFormula: 'channel_divinity', die: null, recharge: 'short', type: 'pips',
      desc: 'Channel divine energy to fuel special abilities.' },
  ],
  Druid: ch => [
    { name: 'Wild Shape', maxFormula: 2, die: null, recharge: 'short', type: 'pips',
      desc: 'Magically assume the shape of a beast.' },
  ],
  Fighter: ch => [
    { name: 'Second Wind', maxFormula: 1, die: 'd10', recharge: 'short', type: 'pips',
      desc: 'Regain 1d10 + Fighter level HP as a Bonus Action.' },
    { name: 'Action Surge', maxFormula: (ch.level || 1) >= 17 ? 2 : 1, die: null, recharge: 'short', type: 'pips',
      desc: 'Take one additional action on your turn.' },
  ],
  Monk: ch => [
    { name: 'Ki Points', maxFormula: 'level', die: null, recharge: 'short', type: 'pips',
      desc: 'Fuel special monk abilities like Flurry of Blows and Patient Defense.' },
  ],
  Paladin: ch => [
    { name: 'Lay on Hands', maxFormula: 'level_x5', die: null, recharge: 'long', type: 'pool',
      desc: 'Restore HP by touch. Pool of HP equal to 5× Paladin level.' },
    { name: 'Channel Divinity', maxFormula: 2, die: null, recharge: 'short', type: 'pips',
      desc: 'Channel divine energy through your sacred oath.' },
  ],
  Sorcerer: ch => [
    { name: 'Sorcery Points', maxFormula: 'level', die: null, recharge: 'long', type: 'pips',
      desc: 'Points that fuel Metamagic and other sorcerous effects.' },
  ],
  Warlock: ch => [],
  Wizard: ch => [
    { name: 'Arcane Recovery', maxFormula: 1, die: null, recharge: 'long', type: 'pips',
      desc: 'Recover expended spell slots during a Short Rest (once per Long Rest).' },
  ],
  Artificer: ch => [
    { name: 'Infuse Item', maxFormula: 'proficiency', die: null, recharge: 'long', type: 'pips',
      desc: 'Infuse mundane items with magical power.' },
  ],
};

function _injectBaseClassResourcesForCh(ch) {
  if (!ch) return;
  const factory = BASE_CLASS_RESOURCES[ch.class];
  if (!factory) return;
  if (!ch.resources) ch.resources = [];
  // Remove old base class resources for this class
  ch.resources = ch.resources.filter(r => !(r._baseClass === true && r.source === ch.class));
  const toAdd = factory(ch);
  const existingNames = new Set(ch.resources.map(r => r.name));
  toAdd.forEach(def => {
    if (existingNames.has(def.name)) return;
    const max = resolveMaxFormula(def.maxFormula, ch);
    ch.resources.push({
      id: `res_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      name: def.name,
      type: def.type,
      current: max,
      max,
      maxFormula: def.maxFormula,
      die: def.die || null,
      recharge: def.recharge,
      source: ch.class,
      desc: def.desc,
      custom: false,
      _baseClass: true,
    });
    existingNames.add(def.name);
  });
}

function injectBaseClassResources(charId) {
  _injectBaseClassResourcesForCh(db.characters[charId]);
}

// ── Subclass System ───────────────────────────────────────────────────────────
function resolveMaxFormula(formula, ch) {
  if (typeof formula === 'number') return formula;
  const abilityMod = s => Math.floor(((ch.abilities?.[s] || 10) - 10) / 2);
  const lv = ch.level || 1;
  switch (formula) {
    case 'cha_mod':    return Math.max(1, abilityMod('cha'));
    case 'int_mod':    return Math.max(1, abilityMod('int'));
    case 'wis_mod':    return Math.max(1, abilityMod('wis'));
    case 'proficiency': return profBonus(lv);
    case 'level':      return lv;
    case 'level_div_2': return Math.max(1, Math.floor(lv / 2));
    case 'level_x5':   return lv * 5;
    case 'rage_uses':  return lv >= 17 ? 6 : lv >= 12 ? 5 : lv >= 6 ? 4 : lv >= 3 ? 3 : 2;
    case 'channel_divinity': return lv >= 18 ? 3 : lv >= 6 ? 2 : 1;
    default:           return parseInt(formula) || 1;
  }
}

function applySubclass(charId, className, subclassName) {
  const ch = db.characters[charId];
  if (!ch) return;

  // Show spinner next to subclass field
  const subWrap = document.querySelector('.subclass-wrap');
  let spinner = null;
  if (subWrap) {
    spinner = document.createElement('span');
    spinner.className = 'subclass-spinner';
    spinner.textContent = '✾';
    subWrap.appendChild(spinner);
  }

  // Remove features/resources injected by previous subclass
  ch.featuresList = (ch.featuresList || []).filter(f => !f._subclass);
  ch.resources = (ch.resources || []).filter(r => !r._subclass);

  ch.subclass = subclassName;

  const removeSpinner = () => { if (spinner && spinner.parentNode) spinner.parentNode.removeChild(spinner); };

  if (!subclassName) {
    renderApp(); refreshPanels();
    setTimeout(() => saveData(db), 0);
    return;
  }

  const subclassData = (typeof SUBCLASS_DATA !== 'undefined') &&
    SUBCLASS_DATA[className] && SUBCLASS_DATA[className][subclassName];
  if (!subclassData) {
    renderApp(); refreshPanels();
    setTimeout(() => saveData(db), 0);
    return;
  }

  // Check for empty/missing features — inject a placeholder note
  const features = subclassData.features || [];
  const hasFeatures = features.length > 0;
  if (!hasFeatures) {
    ch.featuresList.push({
      name: subclassName,
      desc: '<em class="no-features-note">No features data yet.</em>',
      _subclass: subclassName,
      _placeholder: true,
    });
  }

  const level = ch.level || 1;

  // Inject features up to current level, deduplicating resources (one per resource name)
  const injectedResources = new Set();
  features.forEach(feat => {
    if (feat.level > level) return;

    ch.featuresList.push({
      name: feat.name,
      desc: feat.description,
      _subclass: subclassName,
    });

    if (feat.resource && !injectedResources.has(feat.resource.name)) {
      injectedResources.add(feat.resource.name);
      const max = resolveMaxFormula(feat.resource.maxFormula, ch);
      ch.resources.push({
        id: `res_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
        name: feat.resource.name,
        type: (feat.resource.maxFormula === 'level_x5' || feat.resource.name.includes('Hands') || feat.resource.name.includes('Pool')) ? 'pool' : 'pips',
        current: max,
        max,
        maxFormula: feat.resource.maxFormula,
        die: feat.resource.die || null,
        recharge: feat.resource.recharge || 'long',
        source: subclassName,
        desc: feat.description || '',
        custom: false,
        _subclass: subclassName,
      });
    }
  });

  renderApp();
  refreshPanels();

  // Animate source badge pop
  requestAnimationFrame(() => {
    const badge = document.querySelector('.subclass-source-badge');
    if (badge) {
      badge.classList.add('badge-pop');
      setTimeout(() => badge.classList.remove('badge-pop'), 250);
    }
  });

  setTimeout(() => saveData(db), 0);
}

function refreshPanels() {
  requestAnimationFrame(() => {
    const panels = document.querySelectorAll('.res-panel, .features-panel');
    panels.forEach(el => {
      el.classList.add('panel-refreshing');
    });
    setTimeout(() => {
      document.querySelectorAll('.panel-refreshing').forEach(el => el.classList.remove('panel-refreshing'));
    }, 300);
  });
}

function renderCharacterSheet() {
  const ch = db.characters[currentCharId];
  if (!ch) return '<p>Character not found.</p>';
  migrateCharacter(ch);
  const pb = profBonus(ch.level);
  const cls = ch.class || 'Fighter';

  return `
    <div class="section-header" style="margin-bottom:0.5rem">
      <div></div>
      <div class="flex gap-1 items-center">
        <button class="btn btn-sm" onclick="openLevelModal()">Level Up</button>
        <button class="btn btn-sm btn-primary" id="save-btn" onclick="saveCharSheet()">Save</button>
      </div>
    </div>

    <!-- Header Banner -->
    <div class="cs-header">
      <div class="cs-header-field cs-header-name">
        <label>Character Name</label>
        <input type="text" value="${esc(ch.name)}" oninput="ch_field('name',this.value)">
      </div>
      <div class="cs-header-field cs-header-classes">
        <label>Classes</label>
        <div class="mc-pills">
          ${(ch.classes||[]).map((entry, i) => {
            const icon = CLASS_ICONS[entry.class] || '⚔';
            return `<div class="mc-pill${mcEditIdx===i?' active':''}" onclick="toggleClassEditor(${i})">
              <span class="mc-pill-icon">${icon}</span>
              <span>${esc(entry.class)} ${entry.level}</span>
            </div>`;
          }).join('')}
          <div class="mc-pill mc-pill-add" onclick="addCharClass()">+ Add Class</div>
        </div>
        <div id="mc-editor-slot">${mcEditIdx !== null ? renderClassEditor(ch, mcEditIdx) : ''}</div>
        <div class="mc-total">Total Level ${ch.level} · PB +${pb}</div>
      </div>
      <div class="cs-header-field">
        <label>Background</label>
        <input type="text" value="${esc(ch.background)}" oninput="ch_field('background',this.value)" placeholder="Soldier">
      </div>
      <div class="cs-header-field">
        <label>Species / Race</label>
        <input type="text" value="${esc(ch.race)}" oninput="ch_field('race',this.value)" placeholder="Human">
      </div>
      <div class="cs-header-field">
        <label>Alignment</label>
        <select onchange="ch_field('alignment',this.value)" style="background:transparent;border:none;border-bottom:1px solid var(--border);border-radius:0;color:var(--text);padding:0.1rem 0;font-size:0.85rem">
          ${['Lawful Good','Neutral Good','Chaotic Good','Lawful Neutral','True Neutral','Chaotic Neutral','Lawful Evil','Neutral Evil','Chaotic Evil'].map(a=>`<option${ch.alignment===a?' selected':''}>${a}</option>`).join('')}
        </select>
      </div>
      <div class="cs-header-field">
        <label>Experience Points</label>
        <input type="number" value="${ch.xp}" min="0" oninput="ch_field('xp',+this.value)">
      </div>
    </div>

    <!-- 3-Column Body -->
    <div class="cs-page">
      <div class="cs-col-left">
        ${renderPortraitCard(ch)}
        ${renderAbilityScores(ch)}
        ${renderCoreStats(ch, pb)}
        ${renderSavingThrows(ch, pb)}
        ${renderSkillList(ch, pb)}
      </div>
      <div class="cs-col-mid">
        ${renderCombatSection(ch)}
        ${renderResourcesPanel(ch)}
        ${renderAttacksSection(ch)}
        ${renderEquipmentCurrency(ch)}
        ${renderSpellsSection(ch)}
      </div>
      <div class="cs-col-right">
        ${renderPersonalitySection(ch)}
        ${renderFeaturesSection(ch)}
        ${renderProficienciesLanguages(ch)}
        ${renderNotesSection(ch)}
      </div>
    </div>`;
}

// ── Character Field Update Functions ──────────────────────────────────────────
function ch_field(field, value) {
  const ch = db.characters[currentCharId];
  ch[field] = value;
  if (field === 'class') {
    ch.subclass = '';
    ch.classes[0].class = value;
    ch.classes[0].subclass = '';
    // Clear base class and subclass resources, reinject for new class
    ch.resources = (ch.resources || []).filter(r => !r._baseClass && !r._subclass);
    ch.featuresList = (ch.featuresList || []).filter(f => !f._subclass);
    injectBaseClassResources(currentCharId);
    renderApp();
    refreshPanels();
    setTimeout(() => saveData(db), 0);
  }
}

let mcEditIdx = null;

function toggleClassEditor(idx) {
  mcEditIdx = mcEditIdx === idx ? null : idx;
  const slot = document.getElementById('mc-editor-slot');
  const ch = db.characters[currentCharId];
  if (slot && ch) {
    slot.innerHTML = mcEditIdx !== null ? renderClassEditor(ch, mcEditIdx) : '';
  }
  document.querySelectorAll('.mc-pill:not(.mc-pill-add)').forEach((pill, i) => {
    pill.classList.toggle('active', i === mcEditIdx);
  });
}

function renderClassEditor(ch, idx) {
  const entry = ch.classes[idx]; if (!entry) return '';
  const eClass = entry.class || 'Fighter';
  const eSub = entry.subclass || '';
  const eSubclasses = (typeof SUBCLASS_DATA !== 'undefined' && SUBCLASS_DATA[eClass]) ? Object.keys(SUBCLASS_DATA[eClass]) : [];
  function eSuffix(sn) { const src = SUBCLASS_DATA?.[eClass]?.[sn]?.source||''; if(src.includes('2024')) return ' (2024)'; if(src.includes('2014')||src==='PHB') return ' (2014)'; if(src) return ` (${src})`; return ''; }
  const ALL_CLASSES = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard','Artificer','Blood Hunter'];
  return `<div class="mc-editor">
    <select onchange="chClassField(${idx},'class',this.value)">
      ${ALL_CLASSES.map(c=>`<option${eClass===c?' selected':''}>${c}</option>`).join('')}
    </select>
    ${eSubclasses.length ? `<select onchange="chClassField(${idx},'subclass',this.value)" title="Subclass">
      <option value="">Subclass...</option>
      ${eSubclasses.map(s=>`<option value="${esc(s)}"${eSub===s?' selected':''}>${esc(s)}${eSuffix(s)}</option>`).join('')}
    </select>` : `<input type="text" value="${esc(eSub)}" placeholder="Subclass..." style="max-width:120px;font-size:0.82rem;background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--text);padding:0.15rem 0" oninput="chClassField(${idx},'subclass',this.value)">`}
    <div class="mc-level-stepper">
      <button onclick="chClassField(${idx},'level',${entry.level - 1})">−</button>
      <span>${entry.level}</span>
      <button onclick="chClassField(${idx},'level',${entry.level + 1})">+</button>
    </div>
    ${ch.classes.length > 1 ? `<button class="btn btn-sm btn-danger" onclick="removeCharClass(${idx})" style="font-size:0.65rem;padding:0.15rem 0.4rem">Remove</button>` : ''}
  </div>`;
}

function _injectResourcesForClass(ch, className) {
  const factory = BASE_CLASS_RESOURCES[className];
  if (!factory) return;
  if (!ch.resources) ch.resources = [];
  // Remove old base class resources for this class
  ch.resources = ch.resources.filter(r => !(r._baseClass === true && r.source === className));
  const toAdd = factory(ch);
  const existingNames = new Set(ch.resources.map(r => r.name));
  toAdd.forEach(def => {
    if (existingNames.has(def.name)) return;
    const max = resolveMaxFormula(def.maxFormula, ch);
    ch.resources.push({
      id: `res_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      name: def.name, type: def.type, current: max, max,
      maxFormula: def.maxFormula, die: def.die || null,
      recharge: def.recharge, source: className,
      desc: def.desc, custom: false, _baseClass: true, _forClass: className,
    });
    existingNames.add(def.name);
  });
}

function applySubclassForClass(charId, idx, className, subclassName) {
  const ch = db.characters[charId]; if (!ch) return;
  // Remove old subclass features/resources for this class
  ch.featuresList = (ch.featuresList || []).filter(f => f._forClass !== className);
  ch.resources = (ch.resources || []).filter(r => !(r._subclass && r._forClass === className));
  // Backward compat: keep ch.subclass synced with primary
  if (idx === 0) ch.subclass = subclassName;
  if (!subclassName) return;
  const subclassData = (typeof SUBCLASS_DATA !== 'undefined') && SUBCLASS_DATA[className]?.[subclassName];
  if (!subclassData) return;
  const features = subclassData.features || [];
  if (!features.length) {
    ch.featuresList.push({ name: subclassName, desc: '<em class="no-features-note">No features data yet.</em>', _subclass: subclassName, _forClass: className, _placeholder: true });
  }
  const level = ch.level || 1;
  const injectedResources = new Set();
  features.forEach(feat => {
    if (feat.level > level) return;
    ch.featuresList.push({ name: feat.name, desc: feat.description, _subclass: subclassName, _forClass: className });
    if (feat.resource && !injectedResources.has(feat.resource.name)) {
      injectedResources.add(feat.resource.name);
      const max = resolveMaxFormula(feat.resource.maxFormula, ch);
      ch.resources.push({
        id: `res_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
        name: feat.resource.name,
        type: (feat.resource.maxFormula === 'level_x5' || feat.resource.name.includes('Hands') || feat.resource.name.includes('Pool')) ? 'pool' : 'pips',
        current: max, max, maxFormula: feat.resource.maxFormula,
        die: feat.resource.die || null, recharge: feat.resource.recharge || 'long',
        source: subclassName, desc: feat.description || '',
        custom: false, _subclass: subclassName, _forClass: className,
      });
    }
  });
}

function chClassField(idx, field, value) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (!ch.classes[idx]) return;
  const oldClass = ch.classes[idx].class;
  if (field === 'class') {
    // Remove old class resources/features
    ch.resources = (ch.resources || []).filter(r => r._forClass !== oldClass && r.source !== oldClass);
    ch.featuresList = (ch.featuresList || []).filter(f => f._forClass !== oldClass);
    ch.classes[idx].class = value;
    ch.classes[idx].subclass = '';
    syncClassFields(ch);
    _injectResourcesForClass(ch, value);
    // Clear old primary class proficiencies and prompt for new ones
    if (idx === 0) {
      ch.saveProficiencies = (ch.saveProficiencies || []).filter(s => {
        // Keep saves not granted by old class
        return !(CLASS_STARTING_PROFICIENCIES[oldClass]?.saves || []).includes(s);
      });
      ch.skillProficiencies = (ch.skillProficiencies || []).filter(e =>
        (typeof e === 'object' ? e._class : null) !== oldClass
      );
    }
  } else if (field === 'level') {
    const newLvl = Math.min(20, Math.max(1, parseInt(value)||1));
    const otherSum = ch.classes.reduce((s, c, i) => i === idx ? s : s + c.level, 0);
    ch.classes[idx].level = Math.min(newLvl, 20 - otherSum);
    syncClassFields(ch);
  } else if (field === 'subclass') {
    ch.classes[idx].subclass = value;
    syncClassFields(ch);
    applySubclassForClass(currentCharId, idx, ch.classes[idx].class, value);
  }
  applySpellSlots(ch);
  saveData(db);
  renderApp();
  refreshPanels();
  // After primary class change, prompt for starting proficiencies
  if (field === 'class' && idx === 0) {
    openStartingProfsModal(ch);
  }
}

function addCharClass() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (ch.level >= 20) return;
  ch.classes.push({ class: 'Fighter', subclass: '', level: 1 });
  syncClassFields(ch);
  _injectResourcesForClass(ch, 'Fighter');
  applySpellSlots(ch);
  saveData(db);
  mcEditIdx = ch.classes.length - 1;
  renderApp();
  refreshPanels();
}

function removeCharClass(idx) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (ch.classes.length <= 1) return;
  const removed = ch.classes[idx];
  // Remove resources/features tagged with the removed class
  ch.resources = (ch.resources || []).filter(r => r._forClass !== removed.class && r.source !== removed.class);
  ch.featuresList = (ch.featuresList || []).filter(f => f._forClass !== removed.class);
  if (removed.subclass) {
    ch.resources = ch.resources.filter(r => r._subclass !== removed.subclass || r._forClass !== removed.class);
    ch.featuresList = ch.featuresList.filter(f => f._subclass !== removed.subclass || f._forClass !== removed.class);
  }
  ch.classes.splice(idx, 1);
  syncClassFields(ch);
  mcEditIdx = null;
  // Re-inject primary class resources if primary changed
  if (idx === 0) {
    _injectResourcesForClass(ch, ch.classes[0].class);
    if (ch.classes[0].subclass) applySubclassForClass(currentCharId, 0, ch.classes[0].class, ch.classes[0].subclass);
  }
  applySpellSlots(ch);
  saveData(db);
  renderApp();
  refreshPanels();
}

function combatField(field, value) {
  db.characters[currentCharId].combat[field] = value;
  if (['maxHP','currentHP'].includes(field)) {
    const ch = db.characters[currentCharId];
    const pct = ch.combat.maxHP>0?Math.round((ch.combat.currentHP/ch.combat.maxHP)*100):100;
    const bar = document.querySelector('.hp-bar');
    if (bar) { bar.style.width=pct+'%'; bar.className='hp-bar '+(pct<=25?'low':pct<=50?'mid':''); }
  }
}
function updateAbility(ability, value) {
  db.characters[currentCharId].abilities[ability] = parseInt(value)||10;
  // Recalculate any ability-score-based resource maxes
  const ch = db.characters[currentCharId];
  (ch.resources || []).forEach(r => {
    if (r.maxFormula !== undefined && typeof r.maxFormula === 'string') {
      const newMax = resolveMaxFormula(r.maxFormula, ch);
      if (r.max !== newMax) {
        r.current = Math.min(r.current || 0, newMax);
        r.max = newMax;
      }
    }
  });
  saveData(db); renderApp();
}
function toggleInspiration() {
  const ch = db.characters[currentCharId]; ch.inspiration = !ch.inspiration;
  saveData(db);
  const btn = document.querySelector('.cs-inspiration-toggle');
  if (btn) btn.classList.toggle('active', ch.inspiration);
}
function clearConcentration() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.activeConcentration = null;
  saveData(db); renderApp();
}
function setExhaustion(level) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.exhaustionLevel = Math.min(6, Math.max(0, level));
  saveData(db); renderApp();
}
function attuneItem(itemName, slotIdx) {
  const ch = db.characters[currentCharId]; if (!ch || !itemName) return;
  ch.attunedItems = ch.attunedItems || [];
  if (ch.attunedItems.length >= 3) { showToast('Already attuned to 3 items (maximum).'); return; }
  if (!ch.attunedItems.includes(itemName)) ch.attunedItems.push(itemName);
  saveData(db); renderApp();
}
function unattuneItem(idx) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.attunedItems = ch.attunedItems || [];
  ch.attunedItems.splice(idx, 1);
  saveData(db); renderApp();
}
function toggleSaveProf(ability) {
  const ch = db.characters[currentCharId];
  ch.saveProficiencies = ch.saveProficiencies||[];
  const idx = ch.saveProficiencies.indexOf(ability);
  if (idx>=0) ch.saveProficiencies.splice(idx,1); else ch.saveProficiencies.push(ability);
  saveData(db); renderApp();
}
function toggleSkillProf(skillName) {
  const ch = db.characters[currentCharId];
  ch.skillProficiencies = ch.skillProficiencies||[];
  ch.skillExpertise = ch.skillExpertise||[];
  const prof = ch.skillProficiencies.some(e => skillProfName(e) === skillName);
  const exp  = ch.skillExpertise.includes(skillName);
  if (!prof && !exp) {
    ch.skillProficiencies.push(skillName);
  } else if (prof && !exp) {
    ch.skillExpertise.push(skillName);
  } else {
    ch.skillProficiencies = ch.skillProficiencies.filter(e => skillProfName(e) !== skillName);
    ch.skillExpertise = ch.skillExpertise.filter(s=>s!==skillName);
  }
  saveData(db); renderApp();
}
function updateDeathSave(type, index, checked) {
  db.characters[currentCharId].deathSaves[type] = checked?index+1:index;
  saveData(db);
}

function updateHPDisplay() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const pct = ch.combat.maxHP > 0 ? Math.round((ch.combat.currentHP / ch.combat.maxHP) * 100) : 100;
  const bar = document.getElementById('cs-hp-bar');
  if (bar) {
    bar.style.width = pct + '%';
    bar.className = 'hp-bar ' + (pct <= 25 ? 'low' : pct <= 50 ? 'mid' : '');
  }
  const valEl = document.getElementById('hp-current-val');
  if (valEl) valEl.textContent = ch.combat.currentHP;
  saveData(db);
}

function openDamagePrompt() {
  openModal(`<h2>&#8722; Take Damage</h2>
    <div class="form-group"><label>Damage Amount</label><input type="number" id="dmg-amount" min="1" value="1" autofocus></div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="applyDamage()">Apply Damage</button>
    </div>`);
  setTimeout(() => document.getElementById('dmg-amount')?.focus(), 50);
}

function applyDamage() {
  const amount = parseInt(document.getElementById('dmg-amount')?.value) || 0;
  if (amount <= 0) { closeModal(); return; }
  const ch = db.characters[currentCharId]; if (!ch) return;
  let remaining = amount;
  if (ch.combat.tempHP > 0) {
    const absorbed = Math.min(ch.combat.tempHP, remaining);
    ch.combat.tempHP -= absorbed;
    remaining -= absorbed;
  }
  ch.combat.currentHP = Math.max(0, ch.combat.currentHP - remaining);
  closeModal(); saveData(db); renderApp();
}

function applyDamageInline() {
  const input = document.getElementById('dmg-inline');
  const amount = parseInt(input?.value) || 0;
  if (amount <= 0) return;
  const ch = db.characters[currentCharId]; if (!ch) return;
  let remaining = amount;
  if (ch.combat.tempHP > 0) {
    const absorbed = Math.min(ch.combat.tempHP, remaining);
    ch.combat.tempHP -= absorbed;
    remaining -= absorbed;
  }
  ch.combat.currentHP = Math.max(0, ch.combat.currentHP - remaining);
  saveData(db); renderApp();
}

function applyHealInline() {
  const input = document.getElementById('heal-inline');
  const amount = parseInt(input?.value) || 0;
  if (amount <= 0) return;
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.combat.currentHP = Math.min(ch.combat.maxHP, ch.combat.currentHP + amount);
  saveData(db); renderApp();
}

function openHealPrompt() {
  openModal(`<h2>+ Heal</h2>
    <div class="form-group"><label>Heal Amount</label><input type="number" id="heal-amount" min="1" value="1" autofocus></div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="applyHeal()">Apply Healing</button>
    </div>`);
  setTimeout(() => document.getElementById('heal-amount')?.focus(), 50);
}

function applyHeal() {
  const amount = parseInt(document.getElementById('heal-amount')?.value) || 0;
  if (amount <= 0) { closeModal(); return; }
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.combat.currentHP = Math.min(ch.combat.maxHP, ch.combat.currentHP + amount);
  closeModal(); saveData(db); renderApp();
}

function adjustTempHP(delta) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.combat.tempHP = Math.max(0, (ch.combat.tempHP || 0) + delta);
  saveData(db); renderApp();
}

function setTempHP(val) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.combat.tempHP = Math.max(0, Math.floor(val) || 0);
  saveData(db); renderApp();
}

function openEditHP(field) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const label = field === 'maxHP' ? 'Max HP' : 'Temp HP';
  const val = ch.combat[field] || 0;
  openModal(`<h2>Edit ${label}</h2>
    <div class="form-group"><label>${label}</label><input type="number" id="edit-hp-val" min="0" value="${val}" autofocus></div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="combatField('${field}',+document.getElementById('edit-hp-val').value);closeModal();saveData(db);renderApp()">Save</button>
    </div>`);
  setTimeout(() => document.getElementById('edit-hp-val')?.focus(), 50);
}

function doLongRest() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.combat.currentHP = ch.combat.maxHP;
  ch.combat.tempHP = 0;
  // Restore half hit dice (minimum 1)
  const hdTotal = ch.level || 1;
  const restore = Math.max(1, Math.floor(hdTotal / 2));
  ch.combat.hitDiceUsed = Math.max(0, (ch.combat.hitDiceUsed || 0) - restore);
  // Restore all spell slots
  if (ch.spells?.slotsMax) {
    for (let lvl = 1; lvl <= 9; lvl++) {
      ch.spells.slots[lvl] = ch.spells.slotsMax[lvl] || 0;
    }
  }
  // Restore pact magic slots
  if (ch.spells?.pactSlotsMax) ch.spells.pactSlots = ch.spells.pactSlotsMax;
  // Reset death saves
  ch.deathSaves = { successes: 0, failures: 0 };
  // Restore resources
  restoreResources('long', currentCharId);
  saveData(db); renderApp();
}

function openShortRestDialog() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const hdSides = HIT_DICE[ch.class] || 8;
  const hdTotal = ch.level || 1;
  const hdUsed = ch.combat.hitDiceUsed || 0;
  const hdRemaining = Math.max(0, hdTotal - hdUsed);
  const conMod = mod(ch.abilities?.con || 10);

  openModal(`<h2>&#9788; Short Rest</h2>
    <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:0.8rem">Spend hit dice to recover HP. Each die rolls 1d${hdSides} + ${conMod >= 0 ? '+' : ''}${conMod} (CON).</p>
    <div style="font-size:0.9rem;margin-bottom:0.6rem"><strong>Hit Dice Remaining:</strong> <span id="sr-hd-remaining">${hdRemaining}</span> / ${hdTotal}d${hdSides}</div>
    <div style="font-size:0.9rem;margin-bottom:0.6rem"><strong>Current HP:</strong> <span id="sr-hp-current">${ch.combat.currentHP}</span> / ${ch.combat.maxHP}</div>
    <div id="sr-roll-log" style="max-height:120px;overflow-y:auto;margin-bottom:0.8rem"></div>
    <div class="form-actions">
      <button class="btn" id="sr-roll-btn" onclick="shortRestRollHD()" ${hdRemaining <= 0 || ch.combat.currentHP >= ch.combat.maxHP ? 'disabled' : ''}>Roll Hit Die</button>
      <button class="btn btn-primary" onclick="restorePactSlots();restoreResources('short',currentCharId);saveData(db);closeModal();renderApp()">Done</button>
    </div>`);
}

function shortRestRollHD() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const hdSides = HIT_DICE[ch.class] || 8;
  const hdTotal = ch.level || 1;
  const hdUsed = ch.combat.hitDiceUsed || 0;
  const hdRemaining = hdTotal - hdUsed;
  if (hdRemaining <= 0 || ch.combat.currentHP >= ch.combat.maxHP) return;

  const conMod = mod(ch.abilities?.con || 10);
  const roll = Math.ceil(Math.random() * hdSides);
  const healed = Math.max(1, roll + conMod);
  ch.combat.currentHP = Math.min(ch.combat.maxHP, ch.combat.currentHP + healed);
  ch.combat.hitDiceUsed = (ch.combat.hitDiceUsed || 0) + 1;
  saveData(db);

  // Update dialog
  const log = document.getElementById('sr-roll-log');
  if (log) {
    log.innerHTML += `<div style="font-size:0.82rem;padding:0.2rem 0;border-bottom:1px solid var(--border)">Rolled <strong>1d${hdSides} = ${roll}</strong> + ${conMod} CON = <span style="color:var(--green-lt);font-weight:bold">+${healed} HP</span></div>`;
    log.scrollTop = log.scrollHeight;
  }
  const remEl = document.getElementById('sr-hd-remaining');
  if (remEl) remEl.textContent = hdTotal - ch.combat.hitDiceUsed;
  const hpEl = document.getElementById('sr-hp-current');
  if (hpEl) hpEl.textContent = ch.combat.currentHP;

  // Disable button if no more dice or full HP
  const btn = document.getElementById('sr-roll-btn');
  if (btn && (hdTotal - ch.combat.hitDiceUsed <= 0 || ch.combat.currentHP >= ch.combat.maxHP)) {
    btn.disabled = true;
  }

  // Update bar behind modal
  updateHPDisplay();
}

function adjustHitDice(delta) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const hdTotal = ch.level || 1;
  const used = ch.combat.hitDiceUsed || 0;
  if (delta < 0) {
    // Use a die (increase used)
    if (used >= hdTotal) return;
    ch.combat.hitDiceUsed = used + 1;
  } else {
    // Restore a die (decrease used)
    if (used <= 0) return;
    ch.combat.hitDiceUsed = used - 1;
  }
  saveData(db); renderApp();
}

function addAttack() {
  const ch = db.characters[currentCharId];
  ch.attacks = ch.attacks||[];
  ch.attacks.push({id:uid(),name:'',bonus:'',damage:'',weaponType:''});
  saveData(db); renderApp();
}
function removeAttack(i) { db.characters[currentCharId].attacks.splice(i,1); saveData(db); renderApp(); }
function updateAttack(i, field, value) {
  const ch = db.characters[currentCharId];
  if (ch.attacks[i]) ch.attacks[i][field] = value;
}
function autoCalcAttackBonus(i, weaponType) {
  const ch = db.characters[currentCharId];
  if (!ch || !ch.attacks[i]) return;
  ch.attacks[i].weaponType = weaponType;
  if (weaponType) {
    const pb = profBonus(ch.level);
    const abs = ch.abilities || {};
    const strMod = mod(abs.str || 10);
    const dexMod = mod(abs.dex || 10);
    let abilityMod;
    if (weaponType === 'melee-str')      abilityMod = strMod;
    else if (weaponType === 'melee-finesse') abilityMod = Math.max(strMod, dexMod);
    else if (weaponType === 'ranged-dex')  abilityMod = dexMod;
    else { // spell
      const spellAbil = SPELL_ABILITY[ch.class] || 'int';
      abilityMod = mod(abs[spellAbil] || 10);
    }
    const bonus = pb + abilityMod;
    ch.attacks[i].bonus = (bonus >= 0 ? '+' : '') + bonus;
  }
  saveData(db); renderApp();
}

// ── Weapon Picker ─────────────────────────────────────────────────────────────
let _wpnSearch = '', _wpnFilter = { simple: true, martial: true };

function openWeaponPicker() {
  _wpnSearch = '';
  _wpnFilter = { simple: true, martial: true };
  openModal(`<h2>⚔ Pick Weapon</h2>
    <input type="text" id="wpn-search" placeholder="Search weapons…" style="width:100%;margin-bottom:0.4rem"
      oninput="_wpnSearch=this.value;updateWeaponResults()">
    <div style="display:flex;gap:0.4rem;margin-bottom:0.5rem">
      <button id="wpn-f-simple"  class="btn btn-sm btn-primary" onclick="toggleWpnFilter('simple',this)">Simple</button>
      <button id="wpn-f-martial" class="btn btn-sm btn-primary" onclick="toggleWpnFilter('martial',this)">Martial</button>
    </div>
    <div id="wpn-results" style="max-height:400px;overflow-y:auto"></div>
  `);
  updateWeaponResults();
}

function toggleWpnFilter(cat, btn) {
  _wpnFilter[cat] = !_wpnFilter[cat];
  btn.classList.toggle('btn-primary', _wpnFilter[cat]);
  updateWeaponResults();
}

function updateWeaponResults() {
  const container = document.getElementById('wpn-results');
  if (!container) return;
  const q = _wpnSearch.toLowerCase();
  const filtered = (typeof WEAPONS_DATA !== 'undefined' ? WEAPONS_DATA : []).filter(w => {
    if (!_wpnFilter[w.category]) return false;
    if (q && !w.name.toLowerCase().includes(q) && !w.dmg.toLowerCase().includes(q)) return false;
    return true;
  });

  window._wpnVisible = filtered;

  const groups = [
    { key: 'simple',  label: 'Simple Weapons',  color: '#9b6dff' },
    { key: 'martial', label: 'Martial Weapons',  color: '#f59e0b' },
  ];

  container.innerHTML = groups.map(g => {
    const items = filtered.filter(w => w.category === g.key);
    if (!items.length) return '';
    const rows = items.map((w, _i) => {
      const idx = filtered.indexOf(w);
      const dmgParts = w.dmg.split(' ');
      const dice = dmgParts[0];
      const dmgType = dmgParts.slice(1).join(' ');
      const chips = w.properties.map(p =>
        `<span style="font-size:0.6rem;border:1px solid rgba(155,109,255,0.45);color:var(--text-dim);border-radius:3px;padding:0 3px;white-space:nowrap">${esc(p)}</span>`
      ).join('');
      const rangeTxt = w.range ? `<span style="font-size:0.65rem;color:var(--text-dim)">${esc(w.range)}</span>` : '';
      return `<div class="wpn-row" onclick="pickWeapon(${idx})"
          style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;
                 padding:0.3rem 0.5rem;border-radius:5px;cursor:pointer;
                 border:1px solid var(--border);margin-bottom:0.25rem">
        <span style="font-size:0.82rem;font-weight:600;min-width:110px">${esc(w.name)}</span>
        <span style="font-size:0.82rem;color:#f59e0b;font-weight:600">${esc(dice)}</span>
        <span style="font-size:0.72rem;color:var(--text-dim)">${esc(dmgType)}</span>
        ${rangeTxt}
        <div style="display:flex;gap:0.2rem;flex-wrap:wrap;margin-left:auto">${chips}</div>
      </div>`;
    }).join('');
    return `<div style="font-size:0.7rem;font-weight:700;color:${g.color};text-transform:uppercase;letter-spacing:0.06em;margin:0.5rem 0 0.25rem">${g.label}</div>${rows}`;
  }).join('') || `<p style="color:var(--text-dim);font-size:0.82rem;text-align:center;padding:1rem">No weapons match.</p>`;
}

function pickWeapon(idx) {
  const w = (window._wpnVisible || [])[idx];
  if (!w) return;
  closeModal();

  const isVersatile = w.properties.includes('Versatile');
  const isThrown    = w.properties.includes('Thrown');
  const isMelee     = w.weapon_type !== 'ranged-dex';

  // Determine weapon_type and damage, then possibly ask follow-up questions
  function applyWeapon(weaponType, dmg) {
    const ch = db.characters[currentCharId];
    ch.attacks = ch.attacks || [];
    const pb = profBonus(ch.level);
    const abs = ch.abilities || {};
    const strMod = mod(abs.str || 10);
    const dexMod = mod(abs.dex || 10);
    let abilityMod;
    if (weaponType === 'melee-str')       abilityMod = strMod;
    else if (weaponType === 'melee-finesse') abilityMod = Math.max(strMod, dexMod);
    else                                  abilityMod = dexMod;
    const bonus = pb + abilityMod;
    const bonusStr = (bonus >= 0 ? '+' : '') + bonus;
    ch.attacks.push({ id: uid(), name: w.name, weaponType, bonus: bonusStr, damage: dmg });
    saveData(db); renderApp();
  }

  // Step 1: thrown+melee asks Melee or Thrown?
  function askThrown(dmg, meleeType) {
    openModal(`<h2>${esc(w.name)}</h2>
      <p style="margin-bottom:1rem">How do you want to use this weapon?</p>
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-primary" style="flex:1" onclick="closeModal();pickWeaponApply('${meleeType}','${esc(dmg)}')">Melee</button>
        <button class="btn" style="flex:1" onclick="closeModal();pickWeaponApply('ranged-dex','${esc(dmg)}')">Thrown (DEX)</button>
      </div>`);
  }

  // Step 2: versatile asks 1H or 2H?
  function askVersatile(weaponType) {
    const dmg1h = w.dmg;
    const dmg2h = w.versatile_dmg || w.dmg;
    openModal(`<h2>${esc(w.name)}</h2>
      <p style="margin-bottom:1rem">One-handed or two-handed?</p>
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-primary" style="flex:1" onclick="closeModal();pickWeaponApply('${weaponType}','${esc(dmg1h)}')">One-handed (${esc(dmg1h.split(' ')[0])})</button>
        <button class="btn" style="flex:1" onclick="closeModal();pickWeaponApply('${weaponType}','${esc(dmg2h)}')">Two-handed (${esc(dmg2h.split(' ')[0])})</button>
      </div>`);
  }

  // Store pending apply for onclick strings
  window._pendingWeapon = w;
  window.pickWeaponApply = function(weaponType, dmg) { applyWeapon(weaponType, dmg); };

  if (isThrown && isMelee && !w.properties.includes('Ammunition')) {
    // Dagger, Handaxe, Javelin, Spear, Trident etc — ask melee or thrown first
    if (isVersatile) {
      // Ask thrown/melee, then versatile — do thrown path without versatile option
      openModal(`<h2>${esc(w.name)}</h2>
        <p style="margin-bottom:1rem">How do you want to use this weapon?</p>
        <div style="display:flex;gap:0.5rem">
          <button class="btn btn-primary" style="flex:1" onclick="closeModal();_askVersatileFor('${w.weapon_type}')">Melee</button>
          <button class="btn" style="flex:1" onclick="closeModal();pickWeaponApply('ranged-dex','${esc(w.dmg)}')">Thrown (DEX)</button>
        </div>`);
      window._askVersatileFor = function(wt) { askVersatile(wt); };
    } else {
      askThrown(w.dmg, w.weapon_type);
    }
  } else if (isVersatile) {
    askVersatile(w.weapon_type);
  } else {
    applyWeapon(w.weapon_type, w.dmg);
  }
}

function rollAttack(i) {
  const ch = db.characters[currentCharId];
  const atk = ch?.attacks?.[i];
  if (!atk) return;
  const d20 = Math.floor(Math.random() * 20) + 1;
  const bonusNum = parseInt(atk.bonus) || 0;
  const total = d20 + bonusNum;
  const bonusStr = bonusNum >= 0 ? `+ ${bonusNum}` : `\u2212 ${Math.abs(bonusNum)}`;
  showToast(`<strong>${esc(atk.name || 'Attack')} attack:</strong> d20(${d20}) ${bonusStr} = <strong>${total}</strong>`);
}
function rollDamage(i) {
  const ch = db.characters[currentCharId];
  const atk = ch?.attacks?.[i];
  if (!atk?.damage) { showToast('No damage dice set.'); return; }
  const diceStr = atk.damage.trim().split(/\s+/)[0];
  const m = diceStr.match(/^(\d+)d(\d+)([+-]\d+)?/i);
  if (!m) { showToast(`Cannot parse: <strong>${esc(atk.damage)}</strong>`); return; }
  const count = parseInt(m[1]), sides = parseInt(m[2]), bonus = parseInt(m[3] || '0');
  const rolls = Array.from({length: count}, () => Math.floor(Math.random() * sides) + 1);
  const rollSum = rolls.reduce((a, b) => a + b, 0);
  const total = rollSum + bonus;
  const rollsStr = count === 1 ? `${rolls[0]}` : `${rolls.join('+')}=${rollSum}`;
  const bonusStr = bonus > 0 ? ` + ${bonus}` : bonus < 0 ? ` \u2212 ${Math.abs(bonus)}` : '';
  showToast(`<strong>${esc(atk.name || 'Attack')} damage:</strong> ${count}d${sides}(${rollsStr})${bonusStr} = <strong>${total}</strong>`);
}
function updateCurrency(coin, value) {
  const ch = db.characters[currentCharId];
  ch.currency = ch.currency||{cp:0,sp:0,ep:0,gp:0,pp:0};
  ch.currency[coin] = Math.max(0, parseInt(value)||0);
}
function addEquipment() {
  const input = document.getElementById('eq-input'); const val=input.value.trim(); if(!val) return;
  db.characters[currentCharId].equipment = db.characters[currentCharId].equipment||[];
  db.characters[currentCharId].equipment.push(val); input.value='';
  saveData(db); renderApp();
}
function removeEquipment(i) { db.characters[currentCharId].equipment.splice(i,1); saveData(db); renderApp(); }
function addSpell() {
  const input = document.getElementById('spell-input'); const val=input.value.trim(); if(!val) return;
  db.characters[currentCharId].spells.known = db.characters[currentCharId].spells.known||[];
  db.characters[currentCharId].spells.known.push(val); input.value='';
  saveData(db); renderApp();
}
function removeSpell(i) { db.characters[currentCharId].spells.known.splice(i,1); saveData(db); renderApp(); }
function updateSpellSlot(level, value) {
  db.characters[currentCharId].spells.slots = db.characters[currentCharId].spells.slots||{};
  db.characters[currentCharId].spells.slots[level] = value;
}
function saveCharSheet() {
  saveData(db);
  const btn = document.getElementById('save-btn');
  if (btn) { const o=btn.textContent; btn.textContent='Saved!'; setTimeout(()=>btn.textContent=o,1000); }
}
function openLevelModal() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (ch.level >= 20) {
    openModal(`<h2>Level Up</h2><p style="color:var(--text-dim);margin:0.5rem 0 1rem">Total level is already 20 — the maximum.</p><div class="form-actions"><button class="btn btn-primary" onclick="closeModal()">OK</button></div>`);
    return;
  }
  if (!ch.classes || ch.classes.length <= 1) {
    _openLevelUpHPModal(ch, 0);
  } else {
    const opts = ch.classes.map((c, i) => `<option value="${i}">${esc(c.class)} (currently Lv ${c.level})</option>`).join('');
    openModal(`<h2>Level Up</h2>
      <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:0.75rem">Total Level ${ch.level} → ${ch.level + 1} &nbsp;·&nbsp; PB +${profBonus(ch.level + 1)}</p>
      <div class="form-group">
        <label>Which class is gaining a level?</label>
        <select id="levelup-class-idx" style="width:100%;margin-top:0.3rem;padding:0.4rem;background:var(--surface2);border:1px solid var(--border);border-radius:4px;color:var(--text)">
          ${opts}
        </select>
      </div>
      <div class="form-actions">
        <button class="btn" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="_levelUpPickedClass()">Next →</button>
      </div>`);
  }
}

function _levelUpPickedClass() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const idx = parseInt(document.getElementById('levelup-class-idx').value) || 0;
  _openLevelUpHPModal(ch, idx);
}

function _openLevelUpHPModal(ch, classIdx) {
  const entry = ch.classes[classIdx];
  const className = entry ? entry.class : ch.class;
  const hd = HIT_DICE[className] || 8;
  const avg = Math.floor(hd / 2) + 1;
  const conMod = Math.floor(((ch.abilities?.con || 10) - 10) / 2);
  const conStr = conMod >= 0 ? `+${conMod}` : `${conMod}`;
  openModal(`<h2>Level Up — ${esc(className)}</h2>
    <p style="font-size:0.82rem;color:var(--text-dim);margin-bottom:0.75rem">
      Hit Die: d${hd} &nbsp;·&nbsp; CON modifier: ${conStr} &nbsp;·&nbsp; New total level: ${ch.level + 1}
    </p>
    <div class="form-group" style="display:flex;flex-direction:column;gap:0.5rem">
      <button class="btn btn-primary" onclick="_levelUpGainHP(${classIdx}, ${Math.floor(Math.random()*hd)+1} + ${conMod})">
        Roll d${hd} (you'll see the result)
      </button>
      <button class="btn" onclick="_levelUpGainHP(${classIdx}, ${avg + conMod})">
        Take Average — ${avg}${conMod >= 0 ? '+' : ''}${conMod} = <strong>${Math.max(1, avg + conMod)} HP</strong>
      </button>
    </div>
    <div class="form-group" style="margin-top:0.75rem">
      <label style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim)">Or enter manually</label>
      <div class="flex gap-1" style="margin-top:0.3rem">
        <input type="number" id="levelup-hp-manual" min="1" value="${Math.max(1, avg + conMod)}" style="flex:1;padding:0.35rem;background:var(--surface2);border:1px solid var(--border);border-radius:4px;color:var(--text)">
        <button class="btn btn-sm" onclick="_levelUpGainHP(${classIdx}, +document.getElementById('levelup-hp-manual').value)">Apply</button>
      </div>
    </div>
    <div class="form-actions" style="margin-top:0.5rem">
      <button class="btn" onclick="closeModal()">Cancel</button>
    </div>
    <p id="levelup-result" style="margin-top:0.5rem;font-size:0.85rem;color:var(--gold-lt);min-height:1.2em"></p>`);
}

function _levelUpGainHP(classIdx, hpGain) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (ch.level >= 20) { closeModal(); return; }
  const gained = Math.max(1, Math.round(hpGain));
  const entry = ch.classes[classIdx];
  if (entry) {
    const otherSum = ch.classes.reduce((s, c, i) => i === classIdx ? s : s + c.level, 0);
    entry.level = Math.min(entry.level + 1, 20 - otherSum);
  }
  syncClassFields(ch);
  applySpellSlots(ch);
  ch.combat.maxHP = (ch.combat.maxHP || 0) + gained;
  ch.combat.currentHP = Math.min(ch.combat.currentHP + gained, ch.combat.maxHP);
  syncSubclassFeatures(currentCharId);
  saveData(db);
  const result = document.getElementById('levelup-result');
  if (result) {
    result.textContent = `+${gained} HP · Now Level ${ch.level} · Max HP ${ch.combat.maxHP}`;
  }
  setTimeout(() => { closeModal(); renderApp(); refreshPanels(); }, 900);
}

// ── Character Selector ────────────────────────────────────────────────────────
function renderCharSelector() {
  const wrap = document.getElementById('char-selector-wrap');
  if (!wrap) return;
  if (!currentCampaignId) { wrap.innerHTML = ''; return; }
  const campaign = db.campaigns.find(c => c.id === currentCampaignId);
  if (!campaign) { wrap.innerHTML = ''; return; }
  const ch = campaign.activeCharId ? db.characters[campaign.activeCharId] : null;
  const icon = ch ? (CLASS_ICONS[ch.class] || '⚔') : '✾';
  const name = ch ? esc(ch.name || 'Unnamed') : 'No Character';
  const meta = ch ? `Lv ${ch.level} ${formatClassLine(ch)}` : 'Select a character';
  wrap.innerHTML = `
    <button class="char-selector-btn${charPanelOpen ? ' open' : ''}" id="char-selector-btn" onclick="toggleCharPanel()">
      <span class="char-selector-icon">${icon}</span>
      <div><div class="char-selector-name">${name}</div><div class="char-selector-meta">${meta}</div></div>
    </button>`;
}

function toggleCharPanel() { charPanelOpen ? closeCharPanel() : openCharPanel(); }

function openCharPanel() {
  charPanelOpen = true;
  renderCharSelector();
  document.getElementById('char-panel')?.remove();
  if (!currentCampaignId) return;
  const campaign = db.campaigns.find(c => c.id === currentCampaignId);
  if (!campaign) return;
  const chars = CharacterStore.getAllForCampaign(currentCampaignId);
  const atLimit = chars.length >= 20;
  const panel = document.createElement('div');
  panel.id = 'char-panel';
  panel.className = 'char-panel';
  panel.innerHTML = `
    <div class="char-panel-header">
      <span class="char-panel-title">✿ Characters (${chars.length}/20)</span>
      <button class="btn btn-sm btn-primary" onclick="openCharWizard()"${atLimit ? ' disabled title="Limit reached"' : ''}>+ New</button>
    </div>
    ${chars.length === 0
      ? `<p class="text-dim" style="text-align:center;padding:0.8rem 0;font-size:0.85rem">No characters yet.</p>`
      : chars.map(ch => renderCharPanelCard(ch, campaign.activeCharId === ch.id)).join('')}`;
  document.body.appendChild(panel);
  const btn = document.getElementById('char-selector-btn');
  if (btn) {
    const r = btn.getBoundingClientRect();
    panel.style.top   = (r.bottom + 6) + 'px';
    panel.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
  }
  setTimeout(() => document.addEventListener('click', charPanelOutsideClick), 0);
}

function closeCharPanel() {
  charPanelOpen = false;
  document.getElementById('char-panel')?.remove();
  document.removeEventListener('click', charPanelOutsideClick);
  renderCharSelector();
}

function charPanelOutsideClick(e) {
  const panel = document.getElementById('char-panel');
  const btn   = document.getElementById('char-selector-btn');
  if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) closeCharPanel();
}

function renderCharPanelCard(ch, isActive) {
  const icon = CLASS_ICONS[ch.class] || '⚔';
  const pct  = ch.combat.maxHP > 0 ? Math.round((ch.combat.currentHP / ch.combat.maxHP) * 100) : 100;
  const bar  = pct <= 25 ? 'low' : pct <= 50 ? 'mid' : '';
  return `<div class="char-panel-card${isActive ? ' active-char' : ''}">
    <div class="char-panel-card-top">
      <span class="char-panel-icon">${icon}</span>
      <span class="char-panel-name">${esc(ch.name || 'Unnamed')}</span>
      <span class="char-panel-level">Lv ${ch.level}</span>
    </div>
    <div class="char-panel-sub">${esc(ch.race || '—')} ${formatClassLine(ch)}</div>
    <div style="font-size:0.7rem;color:var(--text-dim);margin-bottom:0.25rem">HP ${ch.combat.currentHP}/${ch.combat.maxHP}</div>
    <div class="hp-bar-wrap" style="height:6px;margin-bottom:0.4rem"><div class="hp-bar ${bar}" style="width:${pct}%"></div></div>
    <div class="char-panel-actions">
      ${isActive
        ? `<span class="btn btn-sm" style="opacity:0.45;cursor:default;pointer-events:none">Active</span>`
        : `<button class="btn btn-sm btn-primary" onclick="switchToCharacter('${ch.id}')">Switch</button>`}
      <button class="btn btn-sm" onclick="duplicateCharacter('${ch.id}')">Duplicate</button>
      <button class="btn btn-sm btn-danger" onclick="deleteCharacterFromPanel('${ch.id}')">Delete</button>
    </div>
  </div>`;
}

function switchToCharacter(charId) {
  closeCharPanel();
  const app = document.getElementById('app');
  app.classList.add('char-switching');
  setTimeout(() => {
    app.classList.remove('char-switching');
    currentCharId = charId;
    currentView   = 'character';
    CharacterStore.setActive(charId);
    renderBreadcrumb();
    renderApp();
    app.classList.add('char-showing');
    setTimeout(() => app.classList.remove('char-showing'), 280);
  }, 180);
}

function duplicateCharacter(charId) {
  if (CharacterStore.getAllForCampaign(currentCampaignId).length >= 20) {
    alert('20 character limit reached.'); return;
  }
  const orig = db.characters[charId]; if (!orig) return;
  const copy = JSON.parse(JSON.stringify(orig));
  copy.id = uid(); copy.name = (orig.name || 'Unnamed') + ' (Copy)'; copy.createdAt = Date.now();
  db.characters[copy.id] = copy;
  const c = db.campaigns.find(c => c.id === currentCampaignId);
  c.characters.push(copy.id);
  saveData(db);
  closeCharPanel(); openCharPanel();
}

function deleteCharacterFromPanel(charId) {
  if (!confirm('Delete this character?')) return;
  delete db.characters[charId];
  const c = db.campaigns.find(c => c.id === currentCampaignId);
  if (c) {
    c.characters = c.characters.filter(id => id !== charId);
    if (c.activeCharId === charId) c.activeCharId = c.characters[0] || null;
  }
  saveData(db);
  if (currentCharId === charId) {
    closeCharPanel();
    if (c?.activeCharId) { currentCharId = c.activeCharId; renderApp(); }
    else showCampaign(currentCampaignId);
  } else {
    closeCharPanel(); openCharPanel();
  }
  renderCharSelector();
}

// ── Character Setup Wizard ────────────────────────────────────────────────────
function openCharWizard() {
  closeCharPanel();
  wizardData = {
    name: '', race: '', raceSource: '', raceData: null,
    background: '', backgroundData: null,
    abilityBonuses: {},
    abilityMethod: 'pointbuy',
    _speciesSource: '2024',
    class: 'Fighter', level: 1,
    abilities: { str:8, dex:8, con:8, int:8, wis:8, cha:8 },
    maxHP: 10, maxHPSet: false
  };
  renderWizardStep(0);
}

function wizardProgress(current) {
  return `<div class="wizard-progress">${[0,1,2,3,4,5,6,7].map(i =>
    `<div class="wizard-step-dot ${i < current ? 'done' : i === current ? 'current' : ''}"></div>`
  ).join('')}</div>`;
}

function _wizSpeciesCards() {
  const srcKey = wizardData._speciesSource === '2014' ? 'races_2014' : wizardData._speciesSource === 'mpmm' ? 'races_mpmm' : 'species_2024';
  const list = SPECIES_DATA[srcKey] || [];
  return list.map((sp, i) => {
    const sel = wizardData.race === sp.name && wizardData.raceSource === srcKey;
    const traits = (sp.traits || []).slice(0, 2).map(t => esc(t.name)).join(', ');
    let bonusLine = '';
    if (sp.abilityBonuses) {
      bonusLine = Object.entries(sp.abilityBonuses).map(([k,v]) => `+${v} ${k.toUpperCase()}`).join(', ');
    } else if (srcKey === 'races_mpmm') {
      bonusLine = '+2/+1 choose any';
    }
    return `<div class="wiz-card ${sel?'selected':''}" onclick="wiz_selectSpecies('${srcKey}',${i})">
      <div style="font-weight:bold;font-size:0.9rem">${esc(sp.name)}</div>
      <div style="font-size:0.72rem;color:var(--text-dim)">${esc(sp.size||'')} · ${sp.speed||30} ft</div>
      ${bonusLine ? `<div style="font-size:0.72rem;color:var(--gold-lt);margin-top:0.15rem">${bonusLine}</div>` : ''}
      ${traits ? `<div style="font-size:0.7rem;color:var(--text-dim);margin-top:0.15rem">${traits}</div>` : ''}
    </div>`;
  }).join('');
}

function _wizBackgroundCards() {
  const list = SPECIES_DATA.backgrounds_2024 || [];
  return list.map((bg, i) => {
    const sel = wizardData.background === bg.name;
    const chips = (bg.abilityGroup || []).map(a => `<span class="wiz-stat-chip">${a.toUpperCase()}</span>`).join(' ');
    return `<div class="wiz-card ${sel?'selected':''}" onclick="wiz_selectBackground(${i})">
      <div style="font-weight:bold;font-size:0.9rem">${esc(bg.name)}</div>
      <div style="margin-top:0.2rem">${chips}</div>
      <div style="font-size:0.72rem;color:var(--text-dim);margin-top:0.15rem">Skills: ${(bg.skills||[]).map(s=>esc(s)).join(', ')}</div>
      <div style="font-size:0.72rem;color:var(--text-dim)">Tool: ${(bg.tools||[]).map(t=>esc(t)).join(', ')}</div>
      <div style="font-size:0.72rem;color:var(--gold-lt);margin-top:0.15rem">Feat: ${esc(bg.feat||'—')}</div>
    </div>`;
  }).join('');
}

function renderWizardStep(step) {
  let body = '';
  if (step === 0) {
    body = `<h2>✾ New Character</h2>${wizardProgress(0)}
      <div class="form-group"><label>Character Name</label>
        <input type="text" id="wiz-name" value="${esc(wizardData.name)}" placeholder="Thorin Ironfist">
      </div>
      <div class="form-actions">
        <button class="btn" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="wizardNext(0)">Next →</button>
      </div>`;
  } else if (step === 1) {
    const s = wizardData._speciesSource;
    body = `<h2>✾ Species</h2>${wizardProgress(1)}
      <div class="wiz-source-toggle">
        <button class="btn btn-sm ${s==='2024'?'btn-primary':''}" onclick="wizardData._speciesSource='2024';renderWizardStep(1)">2024 PHB</button>
        <button class="btn btn-sm ${s==='2014'?'btn-primary':''}" onclick="wizardData._speciesSource='2014';renderWizardStep(1)">2014 PHB</button>
        <button class="btn btn-sm ${s==='mpmm'?'btn-primary':''}" onclick="wizardData._speciesSource='mpmm';renderWizardStep(1)">Mordenkainen's</button>
      </div>
      <div class="wiz-card-grid">${_wizSpeciesCards()}</div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(0)">← Back</button>
        <button class="btn btn-primary" onclick="wizardNext(1)">Next →</button>
      </div>`;
  } else if (step === 2) {
    body = `<h2>✾ Background</h2>${wizardProgress(2)}
      <div class="wiz-card-grid">${_wizBackgroundCards()}</div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(1)">← Back</button>
        <button class="btn btn-primary" onclick="renderWizardStep(3)">Next →</button>
      </div>`;
  } else if (step === 3) {
    const classes = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard','Artificer','Blood Hunter'];
    body = `<h2>✾ Class</h2>${wizardProgress(3)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.35rem;margin-bottom:1rem">
        ${classes.map(c => `<button class="btn btn-sm ${wizardData.class === c ? 'btn-primary' : ''}" onclick="wiz_setClass('${c}')" style="justify-content:flex-start;gap:0.4rem"><span>${CLASS_ICONS[c] || '⚔'}</span>${c}</button>`).join('')}
      </div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(2)">← Back</button>
        <button class="btn btn-primary" onclick="renderWizardStep(4)">Next →</button>
      </div>`;
  } else if (step === 4) {
    body = `<h2>✾ Level</h2>${wizardProgress(4)}
      <div style="text-align:center;padding:1.2rem 0">
        <div class="cs-field-label" style="margin-bottom:0.8rem">Character Level</div>
        <div style="display:flex;align-items:center;justify-content:center;gap:1.4rem">
          <button class="btn" onclick="wiz_setLevel(${Math.max(1, wizardData.level - 1)})">−</button>
          <span style="font-size:2.8rem;font-weight:bold;color:var(--gold);min-width:2ch;text-align:center">${wizardData.level}</span>
          <button class="btn" onclick="wiz_setLevel(${Math.min(20, wizardData.level + 1)})">+</button>
        </div>
        <div style="font-size:0.8rem;color:var(--text-dim);margin-top:0.7rem">Proficiency Bonus: +${profBonus(wizardData.level)}</div>
      </div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(3)">← Back</button>
        <button class="btn btn-primary" onclick="renderWizardStep(5)">Next →</button>
      </div>`;
  } else if (step === 5) {
    // Ability Scores with method selector + bonus picker
    if (!wizardData.abilityMethod) wizardData.abilityMethod = 'pointbuy';
    const method = wizardData.abilityMethod;

    // Background bonus section
    let bonusSection = '';
    const bg = wizardData.backgroundData;
    const is2014 = wizardData.raceSource === 'races_2014';
    if (is2014 && wizardData.raceData?.abilityBonuses) {
      wizardData.abilityBonuses = { ...wizardData.raceData.abilityBonuses };
      const chips = Object.entries(wizardData.raceData.abilityBonuses)
        .map(([a,v]) => `<span class="wiz-stat-chip" style="opacity:0.6">+${v} ${a.toUpperCase()}</span>`).join(' ');
      bonusSection = `<div style="margin-bottom:0.6rem;font-size:0.82rem">
        <div style="color:var(--text-dim);margin-bottom:0.3rem">Racial bonuses (fixed):</div>${chips}</div>`;
    } else if (bg && bg.abilityGroup) {
      const chips = bg.abilityGroup.map(a => {
        const v = wizardData.abilityBonuses[a];
        const cls = v === 2 ? 'bonus-2' : v === 1 ? 'bonus-1' : '';
        const label = v ? `+${v} ${a.toUpperCase()}` : a.toUpperCase();
        return `<span class="wiz-stat-chip wiz-bonus-chip ${cls}" onclick="wiz_toggleBonus('${a}')">${label}</span>`;
      }).join(' ');
      bonusSection = `<div style="margin-bottom:0.6rem;font-size:0.82rem">
        <div style="color:var(--text-dim);margin-bottom:0.3rem">Background grants +2 to one and +1 to another from:</div>${chips}</div>`;
    }

    // Method toggle
    const methodToggle = `<div class="wiz-source-toggle" style="margin-bottom:0.6rem">
      <button class="btn btn-sm ${method==='pointbuy'?'btn-primary':''}" onclick="wiz_setAbilityMethod('pointbuy')">Point Buy</button>
      <button class="btn btn-sm ${method==='array'?'btn-primary':''}" onclick="wiz_setAbilityMethod('array')">Standard Array</button>
      <button class="btn btn-sm ${method==='manual'?'btn-primary':''}" onclick="wiz_setAbilityMethod('manual')">Manual Roll</button>
    </div>`;

    let scoreSection = '';
    if (method === 'pointbuy') {
      scoreSection = _wizPointBuySection();
    } else if (method === 'array') {
      scoreSection = _wizArraySection();
    } else {
      scoreSection = _wizManualSection();
    }

    body = `<h2>✾ Ability Scores</h2>${wizardProgress(5)}
      ${methodToggle}${bonusSection}${scoreSection}
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(4)">← Back</button>
        <button class="btn btn-primary" onclick="renderWizardStep(6)">Next →</button>
      </div>`;
  } else if (step === 6) {
    // Review step
    const bg = wizardData.backgroundData;
    const pb = profBonus(wizardData.level);
    let scoresHtml = ABILITIES.map(a => {
      const base = wizardData.abilities[a];
      const bonus = wizardData.abilityBonuses[a] || 0;
      const total = base + bonus;
      return `<div class="wizard-ability-box">
        <label>${ABILITY_SHORT[a]}</label>
        <div style="font-size:1.2rem;font-weight:bold;color:${bonus ? 'var(--gold)' : 'var(--text)'}">${total}</div>
        ${bonus ? `<div style="font-size:0.65rem;color:var(--text-dim)">${base}+${bonus}</div>` : ''}
      </div>`;
    }).join('');
    body = `<h2>✾ Review</h2>${wizardProgress(6)}
      <div style="background:var(--surface2);border-radius:var(--radius);padding:0.75rem;font-size:0.82rem;margin-bottom:0.8rem">
        <div style="font-weight:bold;color:var(--gold-lt);font-size:1rem;margin-bottom:0.4rem">${CLASS_ICONS[wizardData.class] || '⚔'} ${esc(wizardData.name)}</div>
        <div style="margin-bottom:0.3rem">
          <strong>Species:</strong> ${esc(wizardData.race || '—')}
          ${wizardData.raceData?.source ? `<span class="wiz-stat-chip" style="margin-left:0.3rem">${esc(wizardData.raceData.source)}</span>` : ''}
        </div>
        <div style="margin-bottom:0.3rem">
          <strong>Background:</strong> ${esc(wizardData.background || '—')}
          ${bg?.feat ? ` · <span style="color:var(--gold-lt)">Feat: ${esc(bg.feat)}</span>` : ''}
        </div>
        ${bg?.skills?.length ? `<div style="margin-bottom:0.3rem"><strong>Skills:</strong> ${bg.skills.map(s=>esc(s)).join(', ')}</div>` : ''}
        <div style="margin-bottom:0.3rem">
          <strong>Class:</strong> ${esc(wizardData.class)} &nbsp;·&nbsp; <strong>Level:</strong> ${wizardData.level} &nbsp;·&nbsp; PB +${pb}
        </div>
        <div style="font-size:0.75rem;color:var(--text-dim)">Scores: ${wizardData.abilityMethod==='pointbuy'?'Point Buy':wizardData.abilityMethod==='array'?'Standard Array':'Manual Roll'}</div>
      </div>
      <div class="wizard-ability-grid" style="margin-bottom:0.8rem">${scoresHtml}</div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(5)">← Back</button>
        <button class="btn btn-primary" onclick="renderWizardStep(7)">Next →</button>
      </div>`;
  } else if (step === 7) {
    const hd = HIT_DICE[wizardData.class] || 8;
    const conBase = wizardData.abilities.con || 10;
    const conBonus = wizardData.abilityBonuses.con || 0;
    const conMod = Math.floor(((conBase + conBonus) - 10) / 2);
    const suggested = Math.max(1, (hd + conMod) * wizardData.level);
    if (!wizardData.maxHPSet) wizardData.maxHP = suggested;
    body = `<h2>✾ Hit Points</h2>${wizardProgress(7)}
      <div class="form-group"><label>Maximum HP</label>
        <input type="number" id="wiz-hp" value="${wizardData.maxHP}" min="1">
        <div style="font-size:0.75rem;color:var(--text-dim);margin-top:0.4rem">
          Hit Die: d${hd} &nbsp;|&nbsp; CON mod: ${conMod >= 0 ? '+' : ''}${conMod}
          <button class="btn btn-sm" style="margin-left:0.5rem" onclick="document.getElementById('wiz-hp').value=${suggested};wizardData.maxHP=${suggested};wizardData.maxHPSet=true">Use Suggested (${suggested})</button>
        </div>
      </div>
      <div style="background:var(--surface2);border-radius:var(--radius);padding:0.75rem;font-size:0.82rem;margin:0.5rem 0 0.8rem">
        <div style="font-weight:bold;color:var(--gold-lt);margin-bottom:0.3rem">${CLASS_ICONS[wizardData.class] || '⚔'} ${esc(wizardData.name)}</div>
        <div style="color:var(--text-dim)">Level ${wizardData.level} ${esc(wizardData.race || '—')} ${esc(wizardData.class)} &nbsp;&bull;&nbsp; PB +${profBonus(wizardData.level)}</div>
      </div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(6)">← Back</button>
        <button class="btn btn-primary" onclick="wizardFinish()">Create Character ✦</button>
      </div>`;
  }
  openModal(body);
  setTimeout(() => {
    const inp = document.querySelector('#modal-content input[type="text"], #modal-content input[type="number"]');
    if (inp && step !== 1 && step !== 2 && step !== 3 && step !== 4 && step !== 6) inp.focus();
  }, 40);
}

function wizardNext(step) {
  if (step === 0) {
    const v = document.getElementById('wiz-name')?.value.trim();
    if (!v) { const el = document.getElementById('wiz-name'); if (el) { el.style.borderColor = 'var(--red-lt)'; el.focus(); } return; }
    wizardData.name = v; renderWizardStep(1);
  } else if (step === 1) {
    renderWizardStep(2);
  }
}

function wiz_selectSpecies(srcKey, idx) {
  const sp = SPECIES_DATA[srcKey]?.[idx];
  if (!sp) return;
  wizardData.race = sp.name;
  wizardData.raceSource = srcKey;
  wizardData.raceData = sp;
  // Clear ability bonuses if switching source types
  if (srcKey === 'races_2014' && sp.abilityBonuses) {
    wizardData.abilityBonuses = { ...sp.abilityBonuses };
  } else if (srcKey !== 'races_2014') {
    wizardData.abilityBonuses = {};
  }
  renderWizardStep(1);
}

function wiz_selectBackground(idx) {
  const bg = SPECIES_DATA.backgrounds_2024?.[idx];
  if (!bg) return;
  wizardData.background = bg.name;
  wizardData.backgroundData = bg;
  // Reset ability bonuses when changing background (for 2024 mode)
  if (wizardData.raceSource !== 'races_2014') {
    wizardData.abilityBonuses = {};
  }
  renderWizardStep(2);
}

function wiz_toggleBonus(ability) {
  const bonuses = wizardData.abilityBonuses;
  const current = bonuses[ability];
  if (current) {
    // Clicking assigned stat clears it
    delete bonuses[ability];
  } else {
    const has2 = Object.values(bonuses).includes(2);
    const has1 = Object.values(bonuses).includes(1);
    if (!has2) bonuses[ability] = 2;
    else if (!has1) bonuses[ability] = 1;
  }
  renderWizardStep(5);
}

// ── Ability Score Methods ──
const PB_COST = { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9 };
const PB_BUDGET = 27;

function wiz_setAbilityMethod(method) {
  wizardData.abilityMethod = method;
  if (method === 'pointbuy') {
    ABILITIES.forEach(a => { wizardData.abilities[a] = 8; });
  } else if (method === 'array') {
    ABILITIES.forEach(a => { wizardData.abilities[a] = 8; });
    wizardData._arrayAssign = {};
  } else {
    if (!wizardData._manualSet) {
      ABILITIES.forEach(a => { wizardData.abilities[a] = 10; });
    }
  }
  wizardData._diceRolls = wizardData._diceRolls || {};
  renderWizardStep(5);
}

function _wizPointBuySpent() {
  return ABILITIES.reduce((sum, a) => sum + (PB_COST[wizardData.abilities[a]] || 0), 0);
}

function _wizPointBuySection() {
  const spent = _wizPointBuySpent();
  const remaining = PB_BUDGET - spent;
  let color = 'var(--green, #4caf50)';
  let extra = '';
  if (remaining === 0) { color = 'var(--gold)'; extra = ' ✦'; }
  else if (remaining <= 3) color = 'var(--red-lt, #ef5350)';
  else if (remaining <= 8) color = 'var(--amber, #ffa726)';

  const rows = ABILITIES.map(a => {
    const score = wizardData.abilities[a];
    const cost = PB_COST[score] || 0;
    const bonus = wizardData.abilityBonuses[a] || 0;
    const total = score + bonus;
    const canInc = score < 15 && remaining > 0 && (PB_COST[score + 1] - cost) <= remaining;
    const canDec = score > 8;
    return `<tr>
      <td style="font-weight:600;font-size:0.82rem;padding:0.3rem 0.4rem">${ABILITY_SHORT[a]}</td>
      <td style="text-align:center"><button class="btn btn-sm pb-btn" ${canDec?'':`disabled`} onclick="wiz_pbAdjust('${a}',-1)">−</button></td>
      <td style="text-align:center"><span class="pb-score">${score}</span></td>
      <td style="text-align:center"><button class="btn btn-sm pb-btn" ${canInc?'':`disabled`} onclick="wiz_pbAdjust('${a}',1)">+</button></td>
      <td style="font-size:0.72rem;color:var(--text-dim);text-align:center">${cost} pts</td>
      ${bonus ? `<td style="font-size:0.72rem;color:var(--gold);text-align:center">+${bonus}=${total}</td>` : '<td></td>'}
    </tr>`;
  }).join('');

  return `<div class="pb-counter ${remaining===0?'pb-perfect':''}" style="text-align:center;margin-bottom:0.6rem">
      <div style="font-size:0.72rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Points Remaining</div>
      <div class="pb-remaining" style="font-size:2rem;font-weight:bold;color:${color}">${remaining}${extra} <span style="font-size:1rem;font-weight:normal;color:var(--text-dim)">/ ${PB_BUDGET}</span></div>
    </div>
    <table style="width:100%;border-collapse:collapse">${rows}</table>`;
}

function wiz_pbAdjust(ability, dir) {
  const cur = wizardData.abilities[ability];
  const next = cur + dir;
  if (next < 8 || next > 15) return;
  const costDiff = (PB_COST[next] || 0) - (PB_COST[cur] || 0);
  if (costDiff > (PB_BUDGET - _wizPointBuySpent())) return;
  wizardData.abilities[ability] = next;
  renderWizardStep(5);
  // Pulse animation
  setTimeout(() => {
    const el = document.querySelector('.pb-remaining');
    if (el) { el.classList.remove('pb-pulse'); void el.offsetWidth; el.classList.add('pb-pulse'); }
  }, 20);
}

function _wizArraySection() {
  const stdArray = [15, 14, 13, 12, 10, 8];
  const assign = wizardData._arrayAssign || {};
  const used = new Set(Object.values(assign));
  const available = stdArray.filter(v => !used.has(v) || Object.entries(assign).filter(([,val]) => val === v).length < stdArray.filter(x => x === v).length);

  const rows = ABILITIES.map(a => {
    const assigned = assign[a];
    const bonus = wizardData.abilityBonuses[a] || 0;
    // Build available options for this dropdown
    const opts = stdArray.filter(v => {
      if (v === assigned) return true;
      const usedCount = Object.values(assign).filter(x => x === v).length;
      const totalCount = stdArray.filter(x => x === v).length;
      return usedCount < totalCount;
    });
    const options = opts.map(v => `<option value="${v}" ${v===assigned?'selected':''}>${v}</option>`).join('');
    const total = assigned ? assigned + bonus : null;
    return `<div class="wizard-ability-box">
      <label>${ABILITY_SHORT[a]}</label>
      <select class="attack-type-select" style="font-size:1rem;text-align:center;color:var(--gold);font-weight:bold" onchange="wiz_arrayAssign('${a}',+this.value)">
        <option value="">—</option>
        ${options}
      </select>
      ${total && bonus ? `<div style="font-size:0.7rem;color:var(--gold);margin-top:0.15rem">${assigned} + ${bonus} = <strong>${total}</strong></div>` : ''}
    </div>`;
  }).join('');

  const allAssigned = ABILITIES.every(a => assign[a] !== undefined);
  return `<p style="font-size:0.75rem;color:var(--text-dim);margin-bottom:0.5rem">Assign each value (15, 14, 13, 12, 10, 8) to one ability.</p>
    <div class="wizard-ability-grid">${rows}</div>
    ${allAssigned ? '<div style="text-align:center;font-size:0.8rem;color:var(--gold);margin-top:0.3rem">✦ All scores assigned</div>' : ''}`;
}

function wiz_arrayAssign(ability, value) {
  wizardData._arrayAssign = wizardData._arrayAssign || {};
  if (value) {
    wizardData._arrayAssign[ability] = value;
    wizardData.abilities[ability] = value;
  } else {
    delete wizardData._arrayAssign[ability];
    wizardData.abilities[ability] = 8;
  }
  renderWizardStep(5);
}

function _wizManualSection() {
  const rolls = wizardData._diceRolls || {};
  const rows = ABILITIES.map(a => {
    const base = wizardData.abilities[a];
    const bonus = wizardData.abilityBonuses[a] || 0;
    const total = base + bonus;
    const rollInfo = rolls[a];
    return `<div class="wizard-ability-box">
      <label>${ABILITY_SHORT[a]}</label>
      <input type="number" value="${base}" min="3" max="18" oninput="wizardData.abilities['${a}']=+this.value||10;wizardData._manualSet=true;renderWizardStep(5)"
        style="width:100%;text-align:center;background:transparent;border:none;border-bottom:1px solid rgba(155,109,255,0.3);color:var(--gold);font-size:1.2rem;font-weight:bold;font-family:inherit">
      ${bonus ? `<div style="font-size:0.7rem;color:var(--gold);margin-top:0.15rem">${base} + ${bonus} = <strong>${total}</strong></div>` : ''}
      ${rollInfo ? `<div style="font-size:0.65rem;color:var(--text-dim);margin-top:0.1rem">🎲 ${rollInfo}</div>` : ''}
      <button class="btn btn-sm" style="margin-top:0.25rem;font-size:0.65rem;padding:0.1rem 0.3rem" onclick="wiz_rollSingle('${a}')">Roll</button>
    </div>`;
  }).join('');

  return `<p style="font-size:0.75rem;color:var(--text-dim);margin-bottom:0.5rem">Enter scores manually or roll 4d6 drop lowest.</p>
    <div style="display:flex;gap:0.4rem;justify-content:center;margin-bottom:0.5rem">
      <button class="btn btn-sm" onclick="wiz_rollAll()">🎲 Roll All (4d6 drop lowest)</button>
      <button class="btn btn-sm" onclick="wiz_rollAll()">Reroll All</button>
    </div>
    <div class="wizard-ability-grid">${rows}</div>`;
}

function _roll4d6drop1() {
  const dice = Array.from({length:4}, () => Math.floor(Math.random()*6)+1);
  dice.sort((a,b) => b-a);
  const dropped = dice[3];
  const kept = dice.slice(0,3);
  const total = kept.reduce((a,b) => a+b, 0);
  return { dice, dropped, total, text: `${dice.join(', ')} → drop ${dropped} → ${total}` };
}

function wiz_rollAll() {
  wizardData._diceRolls = {};
  ABILITIES.forEach(a => {
    const r = _roll4d6drop1();
    wizardData.abilities[a] = r.total;
    wizardData._diceRolls[a] = r.text;
  });
  wizardData._manualSet = true;
  renderWizardStep(5);
}

function wiz_rollSingle(ability) {
  const r = _roll4d6drop1();
  wizardData.abilities[ability] = r.total;
  wizardData._diceRolls = wizardData._diceRolls || {};
  wizardData._diceRolls[ability] = r.text;
  wizardData._manualSet = true;
  renderWizardStep(5);
}

function wiz_setClass(cls) { wizardData.class = cls; renderWizardStep(3); }
function wiz_setLevel(lvl) { wizardData.level = Math.min(20, Math.max(1, lvl)); renderWizardStep(4); }

function wizardFinish() {
  if (CharacterStore.getAllForCampaign(currentCampaignId).length >= 20) {
    alert('20 character limit reached.'); return;
  }
  wizardData.maxHP = Math.max(1, parseInt(document.getElementById('wiz-hp')?.value) || wizardData.maxHP || 1);
  const ch = newCharacter(wizardData.name, wizardData.race, wizardData.class, wizardData.level);
  ch.abilities = { ...wizardData.abilities };
  // Apply +2/+1 ability bonuses
  for (const [ab, bonus] of Object.entries(wizardData.abilityBonuses || {})) {
    ch.abilities[ab] = (ch.abilities[ab] || 10) + bonus;
  }
  ch.combat.maxHP     = wizardData.maxHP;
  ch.combat.currentHP = wizardData.maxHP;
  ch.proficiencyBonus = profBonus(wizardData.level);
  // Background data
  if (wizardData.backgroundData) {
    ch.background = wizardData.background;
    (wizardData.backgroundData.skills || []).forEach(skill => {
      if (!ch.skillProficiencies.includes(skill)) ch.skillProficiencies.push(skill);
    });
    const tools = (wizardData.backgroundData.tools || []).join(', ');
    if (tools) ch.proficiencies = tools;
    if (wizardData.backgroundData.feat) {
      ch.featuresList = ch.featuresList || [];
      ch.featuresList.push({ name: wizardData.backgroundData.feat, desc: 'Granted by background.', _background: true });
    }
  }
  // Set speed from species
  if (wizardData.raceData?.speed) ch.combat.speed = wizardData.raceData.speed;
  db.characters[ch.id] = ch;
  injectBaseClassResources(ch.id);
  applySpellSlots(ch);
  const c = db.campaigns.find(c => c.id === currentCampaignId);
  (c.characters = c.characters || []).push(ch.id);
  if (!c.activeCharId) c.activeCharId = ch.id;
  saveData(db);
  switchToCharacter(ch.id);
  // Open starting proficiencies picker
  openStartingProfsModal(ch);
}

// ── Starting Proficiencies Modal ───────────────────────────────────────────────
function openStartingProfsModal(ch) {
  const cls = ch.classes[0].class;
  const data = CLASS_STARTING_PROFICIENCIES[cls];
  if (!data) return;
  const color = CLASS_BADGE_COLORS[cls] || '#9b6dff';
  const saveRows = data.saves.map(a =>
    `<label class="sp-save-row sp-save-granted">
      <input type="checkbox" checked disabled>
      <span>${ABILITY_NAMES[a]}</span>
      <span class="sp-granted-label">saving throw</span>
    </label>`
  ).join('');
  const skillBoxes = data.skills.map(s =>
    `<label class="sp-skill-row">
      <input type="checkbox" class="sp-skill-cb" value="${esc(s)}" onchange="spUpdateCounter()">
      <span>${esc(s)}</span>
    </label>`
  ).join('');
  openModal(`
    <h2 style="color:${color}">${CLASS_ICONS[cls]||''} ${cls} Starting Proficiencies</h2>
    <p style="font-size:0.8rem;color:var(--text-dim);margin:0 0 0.75rem">These proficiencies are granted at character creation.</p>
    <div class="cs-field-label" style="margin-bottom:0.35rem">Saving Throws <span style="font-size:0.7rem;opacity:0.6">(granted)</span></div>
    <div class="sp-saves-list">${saveRows}</div>
    <div class="cs-field-label" style="margin:0.75rem 0 0.35rem">
      Skills —
      <span id="sp-counter" style="color:${color}">Choose ${data.choose} of ${data.skills.length}</span>
    </div>
    <div class="sp-skills-grid">${skillBoxes}</div>
    <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem">
      <button class="btn" onclick="closeModal()">Skip</button>
      <button class="btn btn-primary" id="sp-confirm-btn" onclick="confirmStartingProfs()" disabled>Confirm</button>
    </div>
  `);
  // Store target on window for confirmStartingProfs
  window._spCharId = ch.id;
  window._spClass = cls;
  window._spChoose = data.choose;
  spUpdateCounter();
}

function spUpdateCounter() {
  const choose = window._spChoose || 0;
  const checked = document.querySelectorAll('.sp-skill-cb:checked').length;
  const counter = document.getElementById('sp-counter');
  const confirmBtn = document.getElementById('sp-confirm-btn');
  if (counter) counter.textContent = `${checked} / ${choose} chosen`;
  if (confirmBtn) confirmBtn.disabled = checked !== choose;
  // Disable unchecked boxes when at limit
  document.querySelectorAll('.sp-skill-cb').forEach(cb => {
    if (!cb.checked) cb.disabled = checked >= choose;
  });
}

function confirmStartingProfs() {
  const ch = db.characters[window._spCharId];
  if (!ch) return;
  const cls = window._spClass;
  const data = CLASS_STARTING_PROFICIENCIES[cls];
  if (!data) return;
  // Write save proficiencies (remove any old _class entries for this class first)
  ch.saveProficiencies = (ch.saveProficiencies || []).filter(s => s !== data.saves[0] && s !== data.saves[1]);
  data.saves.forEach(a => { if (!ch.saveProficiencies.includes(a)) ch.saveProficiencies.push(a); });
  // Write chosen skill proficiencies
  ch.skillProficiencies = (ch.skillProficiencies || []).filter(e => {
    const src = typeof e === 'object' ? e._class : null;
    return src !== cls;
  });
  document.querySelectorAll('.sp-skill-cb:checked').forEach(cb => {
    ch.skillProficiencies.push({ name: cb.value, _class: cls });
  });
  saveData(db);
  closeModal();
  renderApp();
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function openModal(html) { document.getElementById('modal-content').innerHTML=html; document.getElementById('modal-overlay').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// ── Import / Export ────────────────────────────────────────────────────────────
function exportData() {
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='dnd-tracker-'+new Date().toISOString().slice(0,10)+'.json'; a.click(); URL.revokeObjectURL(url);
}
function importData(event) {
  const file=event.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try {
      const imported=JSON.parse(e.target.result);
      if(!imported.campaigns||!imported.characters) throw new Error('Invalid');
      if(!confirm('This will replace all current data. Continue?')) return;
      db=imported; if(!db.npcs) db.npcs={};
      Object.values(db.characters).forEach(ch=>migrateCharacter(ch));
      saveData(db); showCampaigns(); alert('Import successful!');
    } catch { alert('Invalid file.'); }
  };
  reader.readAsText(file); event.target.value='';
}

// ── Utility ────────────────────────────────────────────────────────────────────
function esc(str) {
  if(str==null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ───────────────────────────────────────────────────────────────────────
renderBreadcrumb();
renderApp();
