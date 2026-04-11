// ── Data Layer ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'dnd_tracker_v1';

function migrateCharacter(ch) {
  if (ch.inspiration === undefined) ch.inspiration = false;
  if (!ch.languages)      ch.languages = '';
  if (!ch.proficiencies)  ch.proficiencies = '';
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
let sheetTab = 'combat';
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
  db.campaigns.push({ id:uid(), name, description:document.getElementById('camp-desc').value.trim(), characters:[], npcs:[], initiative:null, campaignTab:'characters', activeCharId:null, createdAt:Date.now() });
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
      </div>
    </div>
    ${campaign.description?`<p class="text-dim" style="margin-bottom:1rem">${esc(campaign.description)}</p>`:''}
    <div class="tabs">
      <div class="tab ${tab==='characters'?'active':''}" onclick="showCampaign('${campaign.id}','characters')">Characters</div>
      <div class="tab ${tab==='npcs'?'active':''}" onclick="showCampaign('${campaign.id}','npcs')">NPCs</div>
      <div class="tab ${tab==='initiative'?'active':''}" onclick="showCampaign('${campaign.id}','initiative')">&#9876; Initiative</div>
    </div>
    ${tab==='characters' ? renderCharacterCards(campaign) : ''}
    ${tab==='npcs'       ? renderNpcCards(campaign) : ''}
    ${tab==='initiative' ? renderInitiativeTracker(campaign) : ''}`;
}

// ── Characters Tab ────────────────────────────────────────────────────────────
function renderCharacterCards(campaign) {
  const chars = (campaign.characters||[]).map(id => db.characters[id]).filter(Boolean);
  if (chars.length === 0) return `<div class="empty"><div class="empty-icon">&#9876;</div><p>No characters yet.</p></div>`;
  return `<div class="card-grid">${chars.map(ch => {
    const pct = ch.combat.maxHP>0?Math.round((ch.combat.currentHP/ch.combat.maxHP)*100):100;
    return `<div class="card" onclick="showCharacter('${ch.id}')">
      <div class="card-title">${esc(ch.name||'Unnamed')}</div>
      <div class="card-sub">Level ${ch.level} ${esc(ch.race)} ${esc(ch.class)}</div>
      <div style="margin-top:0.6rem;font-size:0.8rem;color:var(--text-dim)">HP ${ch.combat.currentHP}/${ch.combat.maxHP}</div>
      <div class="hp-bar-wrap"><div class="hp-bar ${pct<=25?'low':pct<=50?'mid':''}" style="width:${pct}%"></div></div>
      <div class="card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm" onclick="showCharacter('${ch.id}')">Open</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCharacter('${ch.id}')">Delete</button>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function openNewCharModal() {
  openModal(`<h2>Add Character</h2>
    <div class="form-row">
      <div class="form-group"><label>Name</label><input type="text" id="ch-name" placeholder="Thorin Ironfist"></div>
      <div class="form-group"><label>Race / Species</label><input type="text" id="ch-race" placeholder="Dwarf"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Class</label>
        <select id="ch-class">${['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard','Artificer','Blood Hunter'].map(c=>`<option>${c}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Level</label><input type="number" id="ch-level" value="1" min="1" max="20"></div>
    </div>
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="createCharacter()">Create</button></div>`);
  document.getElementById('ch-name').focus();
}
function createCharacter() {
  const name = document.getElementById('ch-name').value.trim();
  const level = parseInt(document.getElementById('ch-level').value)||1;
  const ch = newCharacter(name, document.getElementById('ch-race').value.trim(), document.getElementById('ch-class').value, level);
  db.characters[ch.id] = ch;
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

function getConditionEmoji(cond) {
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
  const classes = {
    'Poisoned': 'poisoned',
    'Stunned': 'stunned',
    'Prone': 'prone',
    'Frightened': 'frightened'
  };
  return classes[cond] || '';
}

function getCampaign() { return db.campaigns.find(c => c.id === currentCampaignId); }
function getInitiative() { const c=getCampaign(); if(!c.initiative) c.initiative={round:1,currentIndex:0,combatants:[]}; return c.initiative; }

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
              ${isActive?'<span class="active-arrow">&#9654; Active</span>':''}
            </div>
            <div class="init-stats">
              <span>AC <strong>${cb.ac}</strong></span>
              <span>HP <input type="number" class="hp-input" value="${cb.hp}" min="0" max="${cb.maxHP}" oninput="updateCombatantHP(${i},+this.value)"> / ${cb.maxHP}</span>
              <span><button class="btn btn-sm" onclick="healCombatant(${i},1)">+</button><button class="btn btn-sm btn-danger" onclick="damageCombatant(${i},1)">-</button></span>
            </div>
            <div class="hp-bar-wrap"><div class="hp-bar ${hpPct<=25?'low':hpPct<=50?'mid':''}" style="width:${hpPct}%"></div></div>
            <div class="condition-row">
              ${(cb.conditions||[]).map(cond=>`<span class="condition-tag ${getConditionClass(cond)}" onclick="removeCondition(${i},'${cond}')" title="Click to remove">${getConditionEmoji(cond)} ${cond} &times;</span>`).join('')}
              <button class="btn btn-sm" onclick="openConditionPicker(${i})">+ Condition</button>
            </div>
            ${cb.statBlock?`<button class="btn btn-sm stat-block-toggle" onclick="toggleStatBlock(${i})">&#128214; Stat Block</button>
            <div class="stat-block-panel" id="stat-block-${i}">${renderCombatantStatBlock(cb.statBlock, i)}</div>`:''}
          </div>
          <button class="btn btn-icon btn-danger" onclick="removeCombatant(${i})">&times;</button>
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
  init.combatants.push({ id:uid(), name:document.getElementById('cb-name').value.trim()||'Unknown', initiative:parseInt(document.getElementById('cb-init').value)||1, ac:parseInt(document.getElementById('cb-ac').value)||10, hp:parseInt(document.getElementById('cb-hp').value)||10, maxHP:parseInt(document.getElementById('cb-hp').value)||10, type:document.getElementById('cb-type').value, conditions:[] });
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
  getInitiative().combatants.push({ id:uid(), charId, name, initiative, ac, hp, maxHP, type, conditions:[] });
  saveData(db); closeModal(); renderApp();
}
function addAllPcsToInitiative() {
  const campaign=getCampaign(), init=getInitiative();
  const linked=new Set(init.combatants.filter(c=>c.charId).map(c=>c.charId));
  (campaign.characters||[]).forEach(id => {
    const ch=db.characters[id]; if(!ch||linked.has(id)) return;
    init.combatants.push({id:uid(),charId:id,name:ch.name,initiative:Math.ceil(Math.random()*20),ac:ch.combat.ac,hp:ch.combat.currentHP,maxHP:ch.combat.maxHP,type:'player',conditions:[]});
  });
  saveData(db); renderApp();
}
function sortInitiative() { const init=getInitiative(); init.combatants.sort((a,b)=>b.initiative-a.initiative); init.currentIndex=0; saveData(db); renderApp(); }
function nextTurn() { const init=getInitiative(); if(!init.combatants.length) return; init.currentIndex=(init.currentIndex||0)+1; if(init.currentIndex>=init.combatants.length){init.currentIndex=0;init.round++;} saveData(db); renderApp(); }
function updateCombatantHP(i,val) { CharacterStore.updateInitiativeHP(currentCampaignId,i,+val); }
function updateCombatantInitiative(i,val) { if(!val||isNaN(val)) return; getInitiative().combatants[i].initiative=val; saveData(db); }
function damageCombatant(i,amt) { const cb=getInitiative().combatants[i]; CharacterStore.updateInitiativeHP(currentCampaignId,i,cb.hp-amt); renderApp(); }
function healCombatant(i,amt)  { const cb=getInitiative().combatants[i]; CharacterStore.updateInitiativeHP(currentCampaignId,i,cb.hp+amt); renderApp(); }
function removeCombatant(i) { const init=getInitiative(); init.combatants.splice(i,1); if(init.currentIndex>=init.combatants.length) init.currentIndex=0; saveData(db); renderApp(); }
function clearInitiative() { if(!confirm('End combat and clear all combatants?')) return; getCampaign().initiative={round:1,currentIndex:0,combatants:[]}; saveData(db); renderApp(); }
function openConditionPicker(i) {
  const cb=getInitiative().combatants[i];
  openModal(`<h2>Conditions — ${esc(cb.name)}</h2>
    <div class="condition-picker">${CONDITIONS.map(cond=>`<div class="condition-option ${(cb.conditions||[]).includes(cond)?'active':''}" onclick="toggleCondition(${i},'${cond}')">${cond}</div>`).join('')}</div>
    <div class="form-actions"><button class="btn btn-primary" onclick="closeModal()">Done</button></div>`);
}
function toggleCondition(i, cond) {
  const cb=getInitiative().combatants[i]; cb.conditions=cb.conditions||[];
  const idx=cb.conditions.indexOf(cond); if(idx>=0) cb.conditions.splice(idx,1); else cb.conditions.push(cond);
  saveData(db);
  document.querySelectorAll('.condition-option').forEach(el => { if(el.textContent.trim()===cond) el.classList.toggle('active',cb.conditions.includes(cond)); });
  const row=document.querySelectorAll('.initiative-row')[i];
  if(row) { const cr=row.querySelector('.condition-row'); if(cr) cr.innerHTML=`${cb.conditions.map(c=>`<span class="condition-tag ${getConditionClass(c)}" onclick="removeCondition(${i},'${c}')" title="Click to remove">${getConditionEmoji(c)} ${c} &times;</span>`).join('')}<button class="btn btn-sm" onclick="openConditionPicker(${i})">+ Condition</button>`; }
}
function removeCondition(i,cond) { const init=getInitiative(); init.combatants[i].conditions=(init.combatants[i].conditions||[]).filter(c=>c!==cond); saveData(db); renderApp(); }

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
};
const MONSTER_BOOK_COLORS = {
  MM:'#c084fc', BR14:'#9b6dff', BR24:'#9b6dff', MPMM:'#3b82f6', VGM:'#6d8fd4',
  MTF:'#6d8fd4', FM:'#e87070', FTD:'#f59e0b', TCE:'#14b8a6', BGG:'#c4a85a',
  ToB:'#7bbdb8', ToB2:'#7bbdb8', ToB3:'#7bbdb8', CC:'#9c7bc4',
  SJ:'#6dba8f', EGW:'#f59e0b', MOT:'#c4a85a', PAM:'#6dba8f',
  VER:'#e87070', QIS:'#7b9dd4', PHB24:'#c084fc',
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
    const res = await fetch('./data/monsters-index.json');
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
  sel.innerHTML = `<option value="all">All Books (${monsterCache.length})</option>`
    + books.map(b => {
      const count = monsterCache.filter(m => m.book === b).length;
      const fullName = MONSTER_BOOK_NAMES[b] || b;
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
      const fullName = MONSTER_BOOK_NAMES[m.book] || m.book;
      return `<div class="monster-row" onclick="loadMonsterStat(${m.i})">
        <span>${esc(m.name)}</span>
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

async function loadMonsterStat(idx) {
  const el = document.getElementById('monster-results');
  if (el) el.innerHTML = `<p class="text-dim" style="text-align:center">Loading...</p>`;
  try {
    if (!monsterFullData) {
      const res = await fetch('./data/monsters.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      monsterFullData = await res.json();
    }
    const m = monsterFullData[idx];
    if (el) el.innerHTML = renderMonsterStatBlock(m);
  } catch {
    if (el) el.innerHTML = `<p class="text-red">Failed to load monster stats.</p>`;
  }
}

let _pendingMonster = null;

function renderMonsterStatBlock(m) {
  _pendingMonster = m;
  const abilityMod = s => { const v = Math.floor(((s||10)-10)/2); return (v>=0?'+':'')+v; };
  const hasAbilities = m.str !== undefined;
  const bookColor = MONSTER_BOOK_COLORS[m.book_short] || '#888';

  let html = `<button class="btn btn-sm" onclick="searchMonsters()" style="margin-bottom:0.8rem">&#8592; Back</button>
    <div class="stat-block">
      <div class="stat-block-name">${esc(m.name)}</div>
      <div class="stat-block-meta">${esc(m.size)} ${esc(m.type)}, ${esc(m.alignment)}
        <span class="monster-book-badge" style="background:${bookColor};margin-left:0.5rem">${esc(m.book_short)}</span>
      </div>
      <hr class="stat-block-divider">`;

  if (hasAbilities) {
    // Structured stat block from properties
    html += `<div><strong>AC</strong> ${m.ac} ${m.ac_note && m.ac_note!==String(m.ac) ? `<span class="text-dim">(${esc(m.ac_note)})</span>` : ''} &nbsp;<strong>HP</strong> ${m.hp} ${m.hp_note ? `<span class="text-dim">(${esc(m.hp_note)})</span>` : ''} &nbsp;<strong>Speed</strong> ${esc(m.speed)}</div>
      <hr class="stat-block-divider">
      <div class="ability-grid" style="margin:0.5rem 0">
        ${[['STR',m.str],['DEX',m.dex],['CON',m.con],['INT',m.int],['WIS',m.wis],['CHA',m.cha]].map(([n,v])=>`<div class="ability-box"><div class="ability-name">${n}</div><div style="font-size:1rem;font-weight:bold;color:var(--gold)">${v}</div><div class="ability-mod">${abilityMod(v)}</div></div>`).join('')}
      </div>
      <hr class="stat-block-divider">`;
    if (m.saving_throws) html += `<div><strong>Saves</strong> ${esc(m.saving_throws)}</div>`;
    if (m.skills) html += `<div><strong>Skills</strong> ${esc(m.skills)}</div>`;
    if (m.resistances) html += `<div><strong>Resistances</strong> ${esc(m.resistances)}</div>`;
    if (m.immunities) html += `<div><strong>Immunities</strong> ${esc(m.immunities)}</div>`;
    if (m.condition_immunities) html += `<div><strong>Condition Immunities</strong> ${esc(m.condition_immunities)}</div>`;
    if (m.vulnerabilities) html += `<div><strong>Vulnerabilities</strong> ${esc(m.vulnerabilities)}</div>`;
    if (m.senses) html += `<div><strong>Senses</strong> ${esc(m.senses)}</div>`;
    if (m.languages) html += `<div><strong>Languages</strong> ${esc(m.languages)}</div>`;
    html += `<div><strong>CR</strong> ${esc(m.cr)} &nbsp;<strong>XP</strong> ${(m.xp||0).toLocaleString()}</div>`;

    if (m.traits?.length) {
      html += `<hr class="stat-block-divider"><div class="stat-section-title">Traits</div>`;
      m.traits.forEach(t => { html += `<div class="stat-entry"><strong>${esc(t.name)}.</strong> ${esc(t.desc)}</div>`; });
    }
    if (m.actions?.length) {
      html += `<hr class="stat-block-divider"><div class="stat-section-title">Actions</div>`;
      m.actions.forEach(t => { html += `<div class="stat-entry"><strong>${esc(t.name)}.</strong> ${esc(t.desc)}</div>`; });
    }
    if (m.reactions?.length) {
      html += `<hr class="stat-block-divider"><div class="stat-section-title">Reactions</div>`;
      m.reactions.forEach(t => { html += `<div class="stat-entry"><strong>${esc(t.name)}.</strong> ${esc(t.desc)}</div>`; });
    }
    if (m.legendary_actions?.length) {
      html += `<hr class="stat-block-divider"><div class="stat-section-title">Legendary Actions</div>`;
      m.legendary_actions.forEach(t => { html += `<div class="stat-entry"><strong>${esc(t.name)}.</strong> ${esc(t.desc)}</div>`; });
    }
  } else {
    // Description-based stat block
    html += `<div><strong>CR</strong> ${esc(m.cr)}</div>`;
    const ds = m.desc_sections || {};
    if (ds.traits) html += `<hr class="stat-block-divider"><div class="stat-section-title">Traits</div><div class="stat-entry">${esc(ds.traits)}</div>`;
    if (ds.actions) html += `<hr class="stat-block-divider"><div class="stat-section-title">Actions</div><div class="stat-entry">${esc(ds.actions)}</div>`;
    if (ds.reactions) html += `<hr class="stat-block-divider"><div class="stat-section-title">Reactions</div><div class="stat-entry">${esc(ds.reactions)}</div>`;
    if (ds.legendary) html += `<hr class="stat-block-divider"><div class="stat-section-title">Legendary Actions</div><div class="stat-entry">${esc(ds.legendary)}</div>`;
  }

  html += `<div class="form-actions" style="margin-top:1rem"><button class="btn btn-primary" onclick="addMonsterToCombat(_pendingMonster)">+ Add to Initiative</button></div>
    </div>`;
  return html;
}

function addMonsterToCombat(m) {
  const init = getInitiative();
  const dexMod = Math.floor(((m.dex || m.dexterity || 10) - 10) / 2);
  const initiative = Math.ceil(Math.random() * 20) + dexMod;
  const ac = m.ac || 10;
  const hp = m.hp || 10;

  const statBlock = {
    size: m.size || '', type: m.type || '', alignment: m.alignment || '',
    hit_points_roll: m.hp_note || '',
    speed: typeof m.speed === 'string' ? m.speed : Object.entries(m.speed||{}).map(([k,v])=>`${k} ${v}`).join(', '),
    strength: m.str||10, dexterity: m.dex||10, constitution: m.con||10,
    intelligence: m.int||10, wisdom: m.wis||10, charisma: m.cha||10,
    saving_throws: m.saving_throws ? (typeof m.saving_throws==='string'?m.saving_throws.split(', ').map(s=>{const p=s.split(' ');return{name:p[0],value:parseInt(p[1])||0}}):[]) : [],
    skills: m.skills ? (typeof m.skills==='string'?m.skills.split(', ').map(s=>{const p=s.split(' ');return{name:p.slice(0,-1).join(' '),value:parseInt(p[p.length-1])||0}}):[]) : [],
    damage_immunities: m.immunities ? m.immunities.split(', ') : [],
    damage_resistances: m.resistances ? m.resistances.split(', ') : [],
    condition_immunities: m.condition_immunities ? m.condition_immunities.split(', ') : [],
    senses: typeof m.senses === 'string' ? {passive_perception: parseInt((m.senses.match(/passive perception (\d+)/i)||[])[1])||10} : (m.senses||{}),
    languages: m.languages || '',
    challenge_rating: m.cr, xp: m.xp || 0,
    special_abilities: m.traits || [],
    actions: m.actions || [],
    reactions: m.reactions || [],
    legendary_actions: m.legendary_actions || [],
    desc_sections: m.desc_sections || null,
  };

  init.combatants.push({
    id: uid(), name: m.name, initiative, ac, hp, maxHP: hp,
    type: 'monster', conditions: [], statBlock
  });
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
  if (sb.saving_throws?.length) html += `<div><strong>Saving Throws</strong> ${sb.saving_throws.map(s=>`${s.name.replace('Saving Throw: ','')} +${s.value}`).join(', ')}</div>`;
  if (sb.skills?.length) html += `<div><strong>Skills</strong> ${sb.skills.map(s=>`${s.name.replace('Skill: ','')} +${s.value}`).join(', ')}</div>`;
  if (sb.damage_resistances?.length) html += `<div><strong>Damage Resistances</strong> ${sb.damage_resistances.join(', ')}</div>`;
  if (sb.damage_immunities?.length) html += `<div><strong>Damage Immunities</strong> ${sb.damage_immunities.join(', ')}</div>`;
  if (sb.condition_immunities?.length) html += `<div><strong>Condition Immunities</strong> ${sb.condition_immunities.join(', ')}</div>`;
  const senseStr = Object.entries(sb.senses||{}).map(([k,v])=>`${k.replace(/_/g,' ')} ${v}`).join(', ');
  if (senseStr) html += `<div><strong>Senses</strong> ${senseStr}</div>`;
  if (sb.languages) html += `<div><strong>Languages</strong> ${esc(sb.languages)}</div>`;
  if (sb.challenge_rating !== undefined) html += `<div><strong>CR</strong> ${sb.challenge_rating} (${(sb.xp||0).toLocaleString()} XP)</div>`;
  html += `<hr class="stat-block-divider">`;
  if (sb.special_abilities?.length) {
    html += `<div class="stat-block-section"><strong>Special Abilities</strong>`;
    sb.special_abilities.forEach(a => { html += `<div class="stat-block-entry"><em>${esc(a.name)}.</em> ${esc(a.desc||'')}</div>`; });
    html += `</div>`;
  }
  if (sb.actions?.length) {
    html += `<div class="stat-block-section"><strong>Actions</strong>`;
    sb.actions.forEach(a => { html += `<div class="stat-block-entry"><em>${esc(a.name)}.</em> ${esc(a.desc||'')}</div>`; });
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
function newCharacter(name, race, cls, level) {
  return {
    id: uid(),
    name, race: race||'', class: cls||'Fighter', subclass: '', level: level||1,
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
      known: [],
      prepared: []
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
  updateInitiativeHP(campaignId, combatantIndex, newHP) {
    const campaign = db.campaigns.find(c => c.id === campaignId);
    if (!campaign?.initiative) return;
    const cb = campaign.initiative.combatants[combatantIndex];
    if (!cb) return;
    cb.hp = Math.max(0, Math.min(newHP, cb.maxHP));
    if (cb.type === 'player' && cb.charId) {
      const ch = db.characters[cb.charId];
      if (ch) ch.combat.currentHP = cb.hp;
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

function mod(score) { return Math.floor((score-10)/2); }
function modStr(score) { const m=mod(score); return (m>=0?'+':'')+m; }
function skillBonus(ch, skillName, abilityKey, pb) {
  const prof=(ch.skillProficiencies||[]).includes(skillName);
  const exp=(ch.skillExpertise||[]).includes(skillName);
  return mod(ch.abilities[abilityKey])+(prof?pb:0)+(exp?pb:0);
}
function passivePerception(ch, pb) {
  return 10 + skillBonus(ch, 'Perception', 'wis', pb);
}

function renderPortraitCard(ch) {
  const icon = CLASS_ICONS[ch.class] || '⚔';
  const hasPortrait = !!ch.portrait;
  return `<div class="portrait-card">
    <div class="portrait-frame" ${hasPortrait ? `style="background-image:url(${ch.portrait})"` : ''}>
      ${hasPortrait ? '' : `<span class="portrait-icon">${icon}</span>`}
    </div>
    <div class="portrait-info">
      <div class="portrait-name">${esc(ch.name)}</div>
      <div class="portrait-meta">${esc(ch.race || '—')} ${esc(ch.class)} &bull; Lv ${ch.level}</div>
    </div>
    <div class="flex gap-1">
      <label class="btn btn-sm portrait-upload-btn">
        ${hasPortrait ? 'Change' : 'Upload Portrait'}
        <input type="file" accept="image/*" onchange="uploadPortrait(event)" style="display:none">
      </label>
      ${hasPortrait ? '<button class="btn btn-sm portrait-upload-btn" onclick="removePortrait()">Remove</button>' : ''}
    </div>
  </div>`;
}

function uploadPortrait(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    db.characters[currentCharId].portrait = e.target.result;
    saveData(db); renderApp();
  };
  reader.readAsDataURL(file);
}

function removePortrait() {
  delete db.characters[currentCharId].portrait;
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

function renderCoreStats(ch, pb) {
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Core Stats</div>
    <div class="cs-core-row"><span>Proficiency Bonus</span><span class="text-gold cs-core-val">+${pb}</span></div>
    <div class="cs-core-row"><span>Passive Perception</span><span class="text-gold cs-core-val">${passivePerception(ch,pb)}</span></div>
    <div class="cs-core-row" style="border:none"><span>Inspiration</span>
      <button class="cs-inspiration-toggle ${ch.inspiration?'active':''}" onclick="toggleInspiration()" title="Inspiration">&#9733;</button>
    </div>
  </div>`;
}

function renderSavingThrows(ch, pb) {
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Saving Throws</div>
    <ul class="skill-list">
      ${ABILITIES.map(a=>{
        const prof=(ch.saveProficiencies||[]).includes(a);
        const total=mod(ch.abilities[a])+(prof?pb:0);
        return `<li>
          <span class="prof-dot ${prof?'proficient':''}" onclick="toggleSaveProf('${a}')" title="Toggle proficiency"></span>
          <span style="font-size:0.8rem">${ABILITY_NAMES[a]}</span>
          <span class="skill-mod">${total>=0?'+':''}${total}</span>
        </li>`;
      }).join('')}
    </ul>
  </div>`;
}

function renderSkillList(ch, pb) {
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Skills <span style="font-size:0.65rem;letter-spacing:0;color:var(--text-dim);text-transform:none">(click ● = prof, ◉ = expertise)</span></div>
    <ul class="skill-list">
      ${SKILLS.map(s=>{
        const prof=(ch.skillProficiencies||[]).includes(s.name);
        const exp=(ch.skillExpertise||[]).includes(s.name);
        const dotClass=exp?'expert':prof?'proficient':'';
        const total=skillBonus(ch,s.name,s.ability,pb);
        return `<li>
          <span class="prof-dot ${dotClass}" onclick="toggleSkillProf('${s.name}')" title="${exp?'Expert':prof?'Proficient':'Not proficient'} — click to cycle"></span>
          <span style="font-size:0.8rem">${s.name}</span>
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
      <div class="hp-btn-grid">
        <button class="hp-grid-btn hp-dmg-btn" onclick="openDamagePrompt()"><span class="hp-grid-icon">&#8722;</span><span class="hp-grid-label">Damage</span></button>
        <button class="hp-grid-btn hp-heal-btn" onclick="openHealPrompt()"><span class="hp-grid-icon">+</span><span class="hp-grid-label">Heal</span></button>
        <button class="hp-grid-btn hp-long-btn" onclick="doLongRest()"><span class="hp-grid-icon">&#9789;</span><span class="hp-grid-label">Long Rest</span></button>
        <button class="hp-grid-btn hp-short-btn" onclick="openShortRestDialog()"><span class="hp-grid-icon">&#10040;</span><span class="hp-grid-label">Short Rest</span></button>
      </div>
    </div>
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
  const emptyCount = Math.max(0, 3-rows.length);
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Attacks &amp; Spellcasting</div>
    <table class="attacks-table">
      <thead><tr><th style="width:42%">Name</th><th style="width:22%">Atk Bonus</th><th style="width:30%">Damage / Type</th><th style="width:6%"></th></tr></thead>
      <tbody>
        ${rows.map((atk,i)=>`<tr>
          <td><input class="attack-input" value="${esc(atk.name)}" placeholder="Longsword" oninput="updateAttack(${i},'name',this.value)"></td>
          <td><input class="attack-input" value="${esc(atk.bonus)}" placeholder="+5" oninput="updateAttack(${i},'bonus',this.value)"></td>
          <td><input class="attack-input" value="${esc(atk.damage)}" placeholder="1d8+3 slashing" oninput="updateAttack(${i},'damage',this.value)"></td>
          <td><button class="btn btn-icon btn-danger" onclick="removeAttack(${i})">&times;</button></td>
        </tr>`).join('')}
        ${Array.from({length:emptyCount},()=>`<tr><td><input class="attack-input" placeholder="—"></td><td><input class="attack-input" placeholder="—"></td><td><input class="attack-input" placeholder="—"></td><td></td></tr>`).join('')}
      </tbody>
    </table>
    <button class="btn btn-sm" style="margin-top:0.5rem" onclick="addAttack()">+ Add Attack</button>
  </div>`;
}

function renderEquipmentCurrency(ch) {
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Equipment</div>
    <ul class="eq-list" style="max-height:140px;overflow-y:auto">
      ${(ch.equipment||[]).map((item,i)=>`<li class="eq-item"><span class="eq-name">${esc(item)}</span><button class="btn btn-icon btn-danger" onclick="removeEquipment(${i})">&times;</button></li>`).join('')}
    </ul>
    <div class="eq-add-row">
      <input type="text" id="eq-input" placeholder="Add item..." onkeydown="if(event.key==='Enter')addEquipment()">
      <button class="btn btn-sm" onclick="addEquipment()">Add</button>
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
  renderSpellTabContent();
  document.querySelectorAll('.spell-tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
}

function applySpellFilter(key, value) {
  if (typeof spellFilters[key] === 'boolean') spellFilters[key] = !spellFilters[key];
  else spellFilters[key] = value;
  renderSpellTabContent();
}

function renderSpellTabContent() {
  const el = document.getElementById('spell-tab-content'); if (!el) return;
  const ch = db.characters[currentCharId]; if (!ch) return;
  if      (spellViewTab === 'all')      el.innerHTML = renderAllSpellsView(ch);
  else if (spellViewTab === 'known')    el.innerHTML = renderKnownView(ch);
  else if (spellViewTab === 'prepared') el.innerHTML = renderPreparedView(ch);
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
    <input type="text" class="spell-filter-input" placeholder="Search spells…" value="${esc(spellFilters.q)}"
      oninput="spellFilters.q=this.value;renderSpellTabContent()">
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

function renderAllSpellsView(ch) {
  loadAllSpells(); loadCustomSpells();
  const known    = new Set((ch.spells.known    ||[]).map(s=>typeof s==='object'?s.name:s));
  const prepared = new Set((ch.spells.prepared ||[]).map(s=>typeof s==='object'?s.name:s));

  if (!allSpellsDb) {
    return `${renderFilterBar()}
      <div class="spell-loading">
        No spell data loaded. <button class="btn btn-sm btn-primary" onclick="fetchAllSpells()">✾ Load All Spells</button>
        <span id="spell-status" style="margin-left:0.5rem;font-size:0.75rem"></span>
      </div>`;
  }

  const filtered = getFilteredAllSpells(ch);
  const show = filtered.slice(0, 100);

  return `${renderFilterBar()}
    <div style="display:flex;align-items:center;justify-content:space-between;margin:0.3rem 0 0.4rem;font-size:0.7rem;color:var(--text-dim)">
      <span>${filtered.length} spells${filtered.length > 100 ? ' (showing 100)' : ''}</span>
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
          const safeData = encodeURIComponent(JSON.stringify({name:sp.name,level_int:sp.level_int||0,school:sp.school||'',casting_time:sp.casting_time||'',range:sp.range||'',components:sp.components||'',concentration:sp.concentration||'no',ritual:sp.ritual||'no',desc:sp.desc||'',dnd_class:sp.dnd_class||'',_custom:sp._custom||false}));
          return `<div class="spell-browser-row">
            <div class="spell-browser-left">
              ${sp._custom?`<span style="font-size:0.6rem;color:#c084fc;border:1px solid rgba(192,132,252,0.4);border-radius:3px;padding:0 3px;flex-shrink:0">✏</span>`:''}
              <span class="spell-name" style="font-size:0.82rem">${esc(sp.name)}</span>
              <span class="spell-badge" style="border-color:${sc};color:${sc};font-size:0.58rem">${esc(lvlLabel)}${lvlLabel&&school?' · ':''}${esc(school)}</span>
              <span class="spell-source-badge" style="background:${srcInfo.color}">${srcInfo.abbr}</span>
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
    </div>`;
}

function renderKnownView(ch) {
  const known    = ch.spells.known    || [];
  const prepared = new Set((ch.spells.prepared||[]).map(s=>typeof s==='object'?s.name:s));
  if (known.length === 0) return `<p class="spell-empty" style="padding:1rem 0">No known spells. Add some from All Spells ↑</p>`;
  return `<div>${known.map((sp,i) => {
    const isObj = typeof sp === 'object';
    const name = isObj ? sp.name : sp;
    const inPrep = prepared.has(name);
    const sc = SCHOOL_COLORS[isObj?sp.school:''] || '#7b6d8d';
    const lvlLabel = isObj ? (sp.level_int===0?'Cantrip':sp.level_int?`Lv ${sp.level_int}`:'') : '';
    const id = `sd-known-${i}`;
    return `<div class="spell-card">
      <div class="spell-card-top">
        <div class="spell-card-left">
          <span class="spell-name">${esc(name)}</span>
          ${lvlLabel||isObj&&sp.school?`<span class="spell-badge" style="border-color:${sc};color:${sc}">${lvlLabel}${lvlLabel&&isObj&&sp.school?' · ':''}${esc(isObj?sp.school||'':'')}</span>`:''}
          ${isObj&&sp.concentration==='yes'?`<span class="spell-tag conc">C</span>`:''}
          ${isObj&&sp.ritual==='yes'?`<span class="spell-tag ritual">R</span>`:''}
        </div>
        <div class="spell-card-right">
          <button class="btn btn-sm${inPrep?' btn-primary':''}" onclick="togglePrepareFromKnown(${i})" title="${inPrep?'Remove from Prepared':'Add to Prepared'}">${inPrep?'✓ Prep':'Prepare'}</button>
          ${isObj?`<button class="btn btn-sm" onclick="toggleSpellDesc('${id}')">▾</button>`:''}
          <button class="btn btn-icon btn-danger" onclick="removeSpellEntry('known',${i})">&times;</button>
        </div>
      </div>
      ${isObj&&(sp.casting_time||sp.range||sp.components)?`<div class="spell-meta">${[sp.casting_time,sp.range,sp.components].filter(Boolean).map(esc).join(' · ')}</div>`:''}
      ${isObj?`<div class="spell-desc hidden" id="${id}">${esc(sp.desc||'')}</div>`:''}
    </div>`;
  }).join('')}</div>`;
}

function renderPreparedView(ch) {
  const prepared = ch.spells.prepared || [];
  if (prepared.length === 0) return `<p class="spell-empty" style="padding:1rem 0">No prepared spells. Mark spells as Prepared from Known ↑ or All Spells.</p>`;
  return `<div>${prepared.map((sp,i) => {
    const isObj = typeof sp === 'object';
    const name = isObj ? sp.name : sp;
    const sc = SCHOOL_COLORS[isObj?sp.school:''] || '#7b6d8d';
    const lvlLabel = isObj ? (sp.level_int===0?'Cantrip':sp.level_int?`Lv ${sp.level_int}`:'') : '';
    const id = `sd-prep-${i}`;
    return `<div class="spell-card">
      <div class="spell-card-top">
        <div class="spell-card-left">
          <span class="spell-name">${esc(name)}</span>
          ${lvlLabel||isObj&&sp.school?`<span class="spell-badge" style="border-color:${sc};color:${sc}">${lvlLabel}${lvlLabel&&isObj&&sp.school?' · ':''}${esc(isObj?sp.school||'':'')}</span>`:''}
          ${isObj&&sp.concentration==='yes'?`<span class="spell-tag conc">C</span>`:''}
          ${isObj&&sp.ritual==='yes'?`<span class="spell-tag ritual">R</span>`:''}
        </div>
        <div class="spell-card-right">
          <button class="btn btn-sm btn-primary" onclick="openCastModal('${esc(name)}',${isObj?sp.level_int||0:0})">Cast</button>
          ${isObj?`<button class="btn btn-sm" onclick="toggleSpellDesc('${id}')">▾</button>`:''}
          <button class="btn btn-icon btn-danger" onclick="removeSpellEntry('prepared',${i})">&times;</button>
        </div>
      </div>
      ${isObj&&(sp.casting_time||sp.range||sp.components)?`<div class="spell-meta">${[sp.casting_time,sp.range,sp.components].filter(Boolean).map(esc).join(' · ')}</div>`:''}
      ${isObj?`<div class="spell-desc hidden" id="${id}">${esc(sp.desc||'')}</div>`:''}
    </div>`;
  }).join('')}</div>`;
}

function spellAddFromEncoded(listType, encoded) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const sp = JSON.parse(decodeURIComponent(encoded));
  ch.spells[listType] = ch.spells[listType] || [];
  const already = ch.spells[listType].some(s => (typeof s==='object'?s.name:s) === sp.name);
  if (!already) { ch.spells[listType].push(sp); saveData(db); }
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
function openCastModal(spellName, minLevel) {
  const ch = db.characters[currentCharId]; if (!ch) return;
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

function confirmCast(spellName, slotLevel) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if ((ch.spells.slots[slotLevel] || 0) <= 0) { alert('No slots at that level!'); return; }
  CharacterStore.useSpellSlot(currentCharId, slotLevel);
  const ordinals = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];
  const entry = `${spellName} cast at ${ordinals[slotLevel]} level`;
  ch.sessionLog = ch.sessionLog || [];
  ch.sessionLog.unshift({ text: entry, ts: Date.now() });
  if (ch.sessionLog.length > 100) ch.sessionLog = ch.sessionLog.slice(0, 100);
  saveData(db);
  closeModal();
  renderSpellTabContent();
  // Flash the slot grid
  const slotEl = document.querySelector(`.spell-slot-col:nth-child(${slotLevel}) .spell-slot-bubbles`);
  if (slotEl) { slotEl.style.transition='opacity 0.1s'; slotEl.style.opacity='0.3'; setTimeout(()=>slotEl.style.opacity='1', 200); }
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
  const spellAbility = SPELL_ABILITY[ch.class] || null;
  const spellMod  = spellAbility ? mod(ch.abilities[spellAbility]) : null;
  const saveDC    = spellAbility ? (8 + pb + spellMod) : null;
  const atkBonus  = spellAbility ? (pb + spellMod) : null;
  const abilLabel = spellAbility ? ABILITY_SHORT[spellAbility] : null;
  const isSpellcaster = !!spellAbility;
  const known    = (ch.spells.known    || []).length;
  const prepared = (ch.spells.prepared || []).length;

  const headerStats = isSpellcaster
    ? `<div class="spell-stat-row">
        <div class="spell-stat-box"><div class="spell-stat-label">Spellcasting Ability</div><div class="spell-stat-val">${abilLabel}</div></div>
        <div class="spell-stat-box"><div class="spell-stat-label">Spell Save DC</div><div class="spell-stat-val">${saveDC}</div></div>
        <div class="spell-stat-box"><div class="spell-stat-label">Spell Attack</div><div class="spell-stat-val">${atkBonus>=0?'+':''}${atkBonus}</div></div>
      </div>`
    : `<p class="text-dim" style="font-size:0.82rem;margin-bottom:0.8rem">${esc(ch.class)} does not use spellcasting.</p>`;

  const slotsHtml = isSpellcaster ? `
    <div class="spell-slots-section">
      <div class="cs-field-label" style="margin-bottom:0.55rem">Spell Slots</div>
      <div class="spell-slots-grid">
        ${[1,2,3,4,5,6,7,8,9].map(lvl => {
          const cur = (ch.spells.slots||{})[lvl] || 0;
          const max = (ch.spells.slotsMax||{})[lvl] || 0;
          return `<div class="spell-slot-col">
            <div class="spell-slot-level">${lvl}</div>
            <div class="spell-slot-bubbles">
              ${Array.from({length:Math.max(cur,max,1)},(_,i)=>`<div class="spell-bubble ${i<cur?'filled':''}" onclick="toggleSpellBubble(${lvl},${i})" title="Slot ${i+1}"></div>`).join('')}
            </div>
            <div class="spell-slot-inputs">
              <input type="number" min="0" max="9" value="${cur}" title="Current" oninput="updateSpellSlot(${lvl},+this.value)" class="spell-slot-num">
              <span class="spell-slot-sep">/</span>
              <input type="number" min="0" max="9" value="${max}" title="Max" oninput="updateSpellSlotMax(${lvl},+this.value)" class="spell-slot-num">
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>` : '';

  return `<div class="sheet-panel">
    <div class="cs-section-label">Spells</div>
    ${headerStats}
    ${slotsHtml}
    <div class="spell-tabs">
      <button class="spell-tab${spellViewTab==='all'?' active':''}" data-tab="all" onclick="switchSpellTab('all')">✿ All Spells</button>
      <button class="spell-tab${spellViewTab==='known'?' active':''}" data-tab="known" onclick="switchSpellTab('known')">Known <span class="spell-count">${known}</span></button>
      <button class="spell-tab${spellViewTab==='prepared'?' active':''}" data-tab="prepared" onclick="switchSpellTab('prepared')">Prepared <span class="spell-count">${prepared}</span></button>
    </div>
    <div id="spell-tab-content"></div>
  </div>`;
}

function toggleSpellDesc(id) { document.getElementById(id)?.classList.toggle('hidden'); }

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
          <p class="sf-desc">${esc(f.desc || 'No description.')}</p>
        </div>
      </div>`;
  }).join('');

  // Custom feature cards (styled like subclass cards but editable)
  const customRows = customFeatures.map(f => {
    const i = allFeatures.indexOf(f);
    const idKey = `cf-desc-${i}`;
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
    </div>`;

  return `<div class="sheet-panel features-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Features &amp; Traits</div>
    ${subSection}
    ${customSection}
  </div>`;
}

function toggleSfCard(id, headerEl) {
  const body = document.getElementById(id);
  if (!body) return;
  const hidden = body.classList.toggle('hidden');
  const toggle = headerEl.querySelector('.sf-toggle');
  if (toggle) toggle.textContent = hidden ? '▼' : '▲';
}

function renderProficienciesLanguages(ch) {
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Proficiencies &amp; Languages</div>
    <div class="cs-field-label" style="margin-bottom:0.3rem">Proficiencies</div>
    <textarea class="sheet-textarea" rows="3" placeholder="Weapons, armor, tools..." oninput="ch_field('proficiencies',this.value)">${esc(ch.proficiencies||'')}</textarea>
    <div class="cs-field-label" style="margin:0.6rem 0 0.3rem">Languages</div>
    <textarea class="sheet-textarea" rows="2" placeholder="Common, Elvish, Dwarvish..." oninput="ch_field('languages',this.value)">${esc(ch.languages||'')}</textarea>
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
  'Bardic Inspiration': [[1,'d6'],[5,'d8'],[10,'d10'],[15,'d12']],
  'Superiority Dice':   [[3,'d8'],[10,'d10'],[18,'d12']],
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

  const opts = `<option value="">Choose subclass...</option>` +
    subclasses.map(s => `<option value="${esc(s)}"${current===s?' selected':''}>${esc(s)}</option>`).join('');

  return `<div class="subclass-wrap">
    <select onchange="applySubclass('${ch.id}','${esc(cls)}',this.value)"
      style="flex:1;font-size:0.85rem;padding:0.1rem 0;background:transparent;border:none;border-bottom:1px solid var(--border);border-radius:0;color:var(--text)">
      ${opts}
    </select>
    ${sourceLabel}
  </div>`;
}

// ── Subclass System ───────────────────────────────────────────────────────────
function resolveMaxFormula(formula, ch) {
  if (typeof formula === 'number') return formula;
  const abilityMod = s => Math.floor(((ch.abilities?.[s] || 10) - 10) / 2);
  switch (formula) {
    case 'cha_mod':    return Math.max(1, abilityMod('cha'));
    case 'int_mod':    return Math.max(1, abilityMod('int'));
    case 'wis_mod':    return Math.max(1, abilityMod('wis'));
    case 'proficiency': return profBonus(ch.level || 1);
    case 'level':      return ch.level || 1;
    case 'level_div_2': return Math.max(1, Math.floor((ch.level || 1) / 2));
    default:           return 1;
  }
}

function applySubclass(charId, className, subclassName) {
  const ch = db.characters[charId];
  if (!ch) return;

  const oldSubclass = ch.subclass || '';

  // Remove features injected by any previous subclass
  ch.featuresList = (ch.featuresList || []).filter(f => !f._subclass);

  // Remove resources injected by any previous subclass
  ch.resources = (ch.resources || []).filter(r => !r._subclass);

  ch.subclass = subclassName;

  if (!subclassName) { renderApp(); refreshPanels(); setTimeout(() => saveData(db), 0); return; }

  const subclassData = (typeof SUBCLASS_DATA !== 'undefined') &&
    SUBCLASS_DATA[className] && SUBCLASS_DATA[className][subclassName];
  if (!subclassData) { renderApp(); refreshPanels(); setTimeout(() => saveData(db), 0); return; }

  const level = ch.level || 1;

  // Inject features up to current level, deduplicating resources (one per resource name)
  const injectedResources = new Set();
  (subclassData.features || []).forEach(feat => {
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
  // Fade in the affected panels after browser paints initial state
  refreshPanels();
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
      <div class="cs-header-field">
        <label>Class &amp; Level</label>
        <div class="flex gap-1">
          <select onchange="ch_field('class',this.value)" style="flex:1;font-size:0.85rem;padding:0.1rem 0;background:transparent;border:none;border-bottom:1px solid var(--border);border-radius:0;color:var(--text)">
            ${['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard','Artificer','Blood Hunter'].map(c=>`<option${cls===c?' selected':''}>${c}</option>`).join('')}
          </select>
          <input type="number" value="${ch.level}" min="1" max="20" oninput="ch_field_level(+this.value)" style="width:36px;text-align:center;background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--gold);font-weight:bold;font-size:1rem">
        </div>
      </div>
      <div class="cs-header-field">
        <label>Subclass</label>
        ${renderSubclassField(ch)}
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
    const wrap = document.querySelector('.subclass-wrap') || document.querySelector('.cs-header-field:has(label)');
    const container = document.querySelector('.cs-header-field:nth-child(3)');
    if (container) {
      const label = container.querySelector('label');
      container.innerHTML = '';
      if (label) container.appendChild(label);
      container.insertAdjacentHTML('beforeend', renderSubclassField(ch));
    }
  }
}
let _levelDebounce = null;
function ch_field_level(value) {
  const ch = db.characters[currentCharId];
  ch.level = Math.min(20, Math.max(1, parseInt(value)||1));
  ch.proficiencyBonus = profBonus(ch.level);
  if (_levelDebounce) clearTimeout(_levelDebounce);
  _levelDebounce = setTimeout(() => {
    syncSubclassFeatures(currentCharId);
    renderApp();
    refreshPanels();
    setTimeout(() => saveData(db), 0);
  }, 400);
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
  const prof = ch.skillProficiencies.includes(skillName);
  const exp  = ch.skillExpertise.includes(skillName);
  if (!prof && !exp) {
    ch.skillProficiencies.push(skillName);
  } else if (prof && !exp) {
    ch.skillExpertise.push(skillName);
  } else {
    ch.skillProficiencies = ch.skillProficiencies.filter(s=>s!==skillName);
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
  // Temp HP absorbs first
  if (ch.combat.tempHP > 0) {
    const absorbed = Math.min(ch.combat.tempHP, remaining);
    ch.combat.tempHP -= absorbed;
    remaining -= absorbed;
  }
  ch.combat.currentHP = Math.max(0, ch.combat.currentHP - remaining);
  closeModal(); saveData(db); renderApp();
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
      <button class="btn btn-primary" onclick="restoreResources('short',currentCharId);saveData(db);closeModal();renderApp()">Done</button>
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
  ch.attacks.push({id:uid(),name:'',bonus:'',damage:''});
  saveData(db); renderApp();
}
function removeAttack(i) { db.characters[currentCharId].attacks.splice(i,1); saveData(db); renderApp(); }
function updateAttack(i, field, value) {
  const ch = db.characters[currentCharId];
  if (ch.attacks[i]) ch.attacks[i][field] = value;
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
  const ch = db.characters[currentCharId];
  openModal(`<h2>Character Level</h2>
    <div class="form-group"><label>Current Level</label><input type="number" id="level-input" value="${ch.level}" min="1" max="20"></div>
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="setLevel()">Set Level</button></div>`);
}
function setLevel() {
  const val = parseInt(document.getElementById('level-input').value)||1;
  const ch = db.characters[currentCharId];
  ch.level = Math.min(20,Math.max(1,val)); ch.proficiencyBonus = profBonus(ch.level);
  syncSubclassFeatures(currentCharId);
  saveData(db); closeModal(); renderApp();
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
  const meta = ch ? `Lv ${ch.level} ${esc(ch.class)}` : 'Select a character';
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
    <div class="char-panel-sub">${esc(ch.race || '—')} ${esc(ch.class)}</div>
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
    name: '', race: '', class: 'Fighter', level: 1,
    abilities: { str:10, dex:10, con:10, int:10, wis:10, cha:10 },
    maxHP: 10, maxHPSet: false
  };
  renderWizardStep(0);
}

function wizardProgress(current) {
  return `<div class="wizard-progress">${[0,1,2,3,4,5].map(i =>
    `<div class="wizard-step-dot ${i < current ? 'done' : i === current ? 'current' : ''}"></div>`
  ).join('')}</div>`;
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
    body = `<h2>✾ Species</h2>${wizardProgress(1)}
      <div class="form-group"><label>Species / Race</label>
        <input type="text" id="wiz-race" value="${esc(wizardData.race)}" placeholder="Dwarf, Elf, Human, Tiefling...">
      </div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(0)">← Back</button>
        <button class="btn btn-primary" onclick="wizardNext(1)">Next →</button>
      </div>`;
  } else if (step === 2) {
    const classes = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard','Artificer','Blood Hunter'];
    body = `<h2>✾ Class</h2>${wizardProgress(2)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.35rem;margin-bottom:1rem">
        ${classes.map(c => `<button class="btn btn-sm ${wizardData.class === c ? 'btn-primary' : ''}" onclick="wiz_setClass('${c}')" style="justify-content:flex-start;gap:0.4rem"><span>${CLASS_ICONS[c] || '⚔'}</span>${c}</button>`).join('')}
      </div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(1)">← Back</button>
        <button class="btn btn-primary" onclick="renderWizardStep(3)">Next →</button>
      </div>`;
  } else if (step === 3) {
    body = `<h2>✾ Level</h2>${wizardProgress(3)}
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
        <button class="btn" onclick="renderWizardStep(2)">← Back</button>
        <button class="btn btn-primary" onclick="renderWizardStep(4)">Next →</button>
      </div>`;
  } else if (step === 4) {
    body = `<h2>✾ Ability Scores</h2>${wizardProgress(4)}
      <p style="font-size:0.75rem;color:var(--text-dim);margin-bottom:0.5rem">Standard array: 15, 14, 13, 12, 10, 8 — or roll your own.</p>
      <div class="wizard-ability-grid">
        ${ABILITIES.map(a => `<div class="wizard-ability-box">
          <label>${ABILITY_SHORT[a]}</label>
          <input type="number" id="wiz-ab-${a}" value="${wizardData.abilities[a]}" min="1" max="30" oninput="wizardData.abilities['${a}']=+this.value||10">
        </div>`).join('')}
      </div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(3)">← Back</button>
        <button class="btn btn-primary" onclick="renderWizardStep(5)">Next →</button>
      </div>`;
  } else if (step === 5) {
    const hd = HIT_DICE[wizardData.class] || 8;
    const conMod = Math.floor((wizardData.abilities.con - 10) / 2);
    const suggested = Math.max(1, (hd + conMod) * wizardData.level);
    if (!wizardData.maxHPSet) wizardData.maxHP = suggested;
    body = `<h2>✾ Hit Points</h2>${wizardProgress(5)}
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
        <button class="btn" onclick="renderWizardStep(4)">← Back</button>
        <button class="btn btn-primary" onclick="wizardFinish()">Create Character ✦</button>
      </div>`;
  }
  openModal(body);
  setTimeout(() => {
    const inp = document.querySelector('#modal-content input[type="text"], #modal-content input[type="number"]');
    if (inp && step !== 2 && step !== 3) inp.focus();
  }, 40);
}

function wizardNext(step) {
  if (step === 0) {
    const v = document.getElementById('wiz-name')?.value.trim();
    if (!v) { const el = document.getElementById('wiz-name'); if (el) { el.style.borderColor = 'var(--red-lt)'; el.focus(); } return; }
    wizardData.name = v; renderWizardStep(1);
  } else if (step === 1) {
    wizardData.race = document.getElementById('wiz-race')?.value.trim() || '';
    renderWizardStep(2);
  }
}

function wiz_setClass(cls) { wizardData.class = cls; renderWizardStep(2); }
function wiz_setLevel(lvl) { wizardData.level = Math.min(20, Math.max(1, lvl)); renderWizardStep(3); }

function wizardFinish() {
  if (CharacterStore.getAllForCampaign(currentCampaignId).length >= 20) {
    alert('20 character limit reached.'); return;
  }
  wizardData.maxHP = Math.max(1, parseInt(document.getElementById('wiz-hp')?.value) || wizardData.maxHP || 1);
  const ch = newCharacter(wizardData.name, wizardData.race, wizardData.class, wizardData.level);
  ch.abilities        = { ...wizardData.abilities };
  ch.combat.maxHP     = wizardData.maxHP;
  ch.combat.currentHP = wizardData.maxHP;
  ch.proficiencyBonus = profBonus(wizardData.level);
  db.characters[ch.id] = ch;
  const c = db.campaigns.find(c => c.id === currentCampaignId);
  (c.characters = c.characters || []).push(ch.id);
  if (!c.activeCharId) c.activeCharId = ch.id;
  saveData(db);
  closeModal();
  switchToCharacter(ch.id);
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
