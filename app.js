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
  if (!ch.combat)          ch.combat = {ac:10,initiative:0,speed:30,maxHP:10,currentHP:10,tempHP:0,hitDice:'1d8'};
  if (!ch.deathSaves)      ch.deathSaves = {successes:0,failures:0};
  if (!ch.saveProficiencies)  ch.saveProficiencies = [];
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
          <div class="init-order">${cb.initiative}</div>
          <div class="init-body">
            <div class="init-top">
              <span class="init-name">${esc(cb.name)}</span>
              <span class="init-type ${cb.type}">${cb.type}</span>
              ${isActive?'<span class="active-arrow">&#9654; Active</span>':''}
            </div>
            <div class="init-stats">
              <span>AC <strong>${cb.ac}</strong></span>
              <span>HP <input type="number" value="${cb.hp}" min="0" max="${cb.maxHP}" oninput="updateCombatantHP(${i},+this.value)" style="width:48px;background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--gold);text-align:center;font-weight:bold"> / ${cb.maxHP}</span>
              <span><button class="btn btn-sm" onclick="healCombatant(${i},1)">+</button><button class="btn btn-sm btn-danger" onclick="damageCombatant(${i},1)">-</button></span>
            </div>
            <div class="hp-bar-wrap"><div class="hp-bar ${hpPct<=25?'low':hpPct<=50?'mid':''}" style="width:${hpPct}%"></div></div>
            <div class="condition-row">
              ${(cb.conditions||[]).map(cond=>`<span class="condition-tag ${getConditionClass(cond)}" onclick="removeCondition(${i},'${cond}')" title="Click to remove">${getConditionEmoji(cond)} ${cond} &times;</span>`).join('')}
              <button class="btn btn-sm" onclick="openConditionPicker(${i})">+ Condition</button>
            </div>
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
    charId=entityId; // link back to character record for HP sync
  } else {
    const npc=db.npcs[entityId]; name=npc.name; ac=npc.ac||10; maxHP=npc.maxHP||10; hp=npc.hp||10;
  }
  getInitiative().combatants.push({ id:uid(), charId, name, initiative:Math.ceil(Math.random()*20), ac, hp, maxHP, type, conditions:[] });
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
async function openMonsterSearchModal() {
  openModal(`<h2>&#128269; Monster Search</h2>
    <div class="flex gap-1" style="margin-bottom:1rem"><input type="text" id="monster-query" placeholder="Search monsters..." style="flex:1" oninput="searchMonsters(this.value)"></div>
    <div id="monster-results" class="monster-results"><p class="text-dim" style="text-align:center">Loading monster list...</p></div>`);
  document.getElementById('monster-query').focus();
  await loadMonsterList();
}
async function loadMonsterList() {
  if (monsterCache) { renderMonsterResults(''); return; }
  try { const res=await fetch('https://www.dnd5eapi.co/api/monsters'); const data=await res.json(); monsterCache=data.results; renderMonsterResults(''); }
  catch { const el=document.getElementById('monster-results'); if(el) el.innerHTML=`<p class="text-red">Could not load monster list. Check your internet connection.</p>`; }
}
function searchMonsters(query) { renderMonsterResults(query); }
function renderMonsterResults(query) {
  const el=document.getElementById('monster-results'); if(!el||!monsterCache) return;
  const q=query.toLowerCase().trim();
  const filtered=q?monsterCache.filter(m=>m.name.toLowerCase().includes(q)):monsterCache.slice(0,40);
  if(!filtered.length){el.innerHTML=`<p class="text-dim">No monsters found.</p>`;return;}
  el.innerHTML=`<div style="font-size:0.78rem;color:var(--text-dim);margin-bottom:0.5rem">${filtered.length} results</div>${filtered.slice(0,60).map(m=>`<div class="monster-row" onclick="loadMonsterStat('${m.index}','${esc(m.name)}')">${esc(m.name)}<span class="text-dim" style="font-size:0.78rem">&#9656;</span></div>`).join('')}`;
}
async function loadMonsterStat(index, name) {
  const el=document.getElementById('monster-results'); if(el) el.innerHTML=`<p class="text-dim" style="text-align:center">Loading ${name}...</p>`;
  try { const res=await fetch(`https://www.dnd5eapi.co/api/monsters/${index}`); const m=await res.json(); if(el) el.innerHTML=renderMonsterStatBlock(m); }
  catch { if(el) el.innerHTML=`<p class="text-red">Failed to load monster stats.</p>`; }
}
function renderMonsterStatBlock(m) {
  const abilityMod=s=>{const mod=Math.floor((s-10)/2);return (mod>=0?'+':'')+mod;};
  return `<button class="btn btn-sm" onclick="renderMonsterResults(document.getElementById('monster-query').value)" style="margin-bottom:0.8rem">&#8592; Back</button>
    <div class="stat-block">
      <div class="stat-block-name">${esc(m.name)}</div>
      <div class="stat-block-meta">${esc(m.size)} ${esc(m.type)}, ${esc(m.alignment)}</div>
      <hr class="stat-block-divider">
      <div><strong>AC</strong> ${m.armor_class?.[0]?.value||m.armor_class} &nbsp;<strong>HP</strong> ${m.hit_points} (${esc(m.hit_points_roll||'')}) &nbsp;<strong>Speed</strong> ${Object.entries(m.speed||{}).map(([k,v])=>`${k} ${v}`).join(', ')}</div>
      <hr class="stat-block-divider">
      <div class="ability-grid" style="margin:0.5rem 0">
        ${['strength','dexterity','constitution','intelligence','wisdom','charisma'].map(a=>`<div class="ability-box"><div class="ability-name">${a.slice(0,3).toUpperCase()}</div><div style="font-size:1rem;font-weight:bold;color:var(--gold)">${m[a]}</div><div class="ability-mod">${abilityMod(m[a])}</div></div>`).join('')}
      </div>
      <hr class="stat-block-divider">
      ${m.challenge_rating!==undefined?`<div><strong>CR</strong> ${m.challenge_rating} &nbsp;<strong>XP</strong> ${m.xp?.toLocaleString()||'—'}</div>`:''}
      ${m.special_abilities?.length?`<div style="margin-top:0.5rem"><strong>Special:</strong> ${m.special_abilities.map(a=>esc(a.name)).join(', ')}</div>`:''}
      ${m.actions?.length?`<div style="margin-top:0.3rem"><strong>Actions:</strong> ${m.actions.map(a=>esc(a.name)).join(', ')}</div>`:''}
      <div class="form-actions" style="margin-top:1rem"><button class="btn btn-primary" onclick='addMonsterToCombat(${JSON.stringify(m).replace(/'/g,"&#39;")})'>+ Add to Initiative</button></div>
    </div>`;
}
function addMonsterToCombat(m) {
  const init=getInitiative(), dexMod=Math.floor(((m.dexterity||10)-10)/2);
  init.combatants.push({id:uid(),name:m.name,initiative:Math.ceil(Math.random()*20)+dexMod,ac:m.armor_class?.[0]?.value||m.armor_class||10,hp:m.hit_points,maxHP:m.hit_points,type:'monster',conditions:[]});
  saveData(db); closeModal(); showCampaign(currentCampaignId,'initiative');
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
  return `<div class="sheet-panel">
    <div class="cs-section-label">Combat</div>
    <div class="cs-combat-trio">
      <div class="stat-box"><div class="stat-label">Armor Class</div><input type="number" value="${ch.combat.ac}" oninput="combatField('ac',+this.value)" style="width:100%;text-align:center;font-size:1.3rem;background:transparent;border:none;color:var(--gold);font-weight:bold"></div>
      <div class="stat-box"><div class="stat-label">Initiative</div><input type="number" value="${ch.combat.initiative}" oninput="combatField('initiative',+this.value)" style="width:100%;text-align:center;font-size:1.3rem;background:transparent;border:none;color:var(--gold);font-weight:bold"></div>
      <div class="stat-box"><div class="stat-label">Speed</div><input type="number" value="${ch.combat.speed}" oninput="combatField('speed',+this.value)" style="width:100%;text-align:center;font-size:1.3rem;background:transparent;border:none;color:var(--gold);font-weight:bold"></div>
    </div>
    <div class="cs-combat-trio" style="margin-top:0.5rem">
      <div class="stat-box"><div class="stat-label">Max HP</div><input type="number" value="${ch.combat.maxHP}" oninput="combatField('maxHP',+this.value)" style="width:100%;text-align:center;font-size:1.1rem;background:transparent;border:none;color:var(--gold);font-weight:bold"></div>
      <div class="stat-box"><div class="stat-label">Current HP</div><input type="number" value="${ch.combat.currentHP}" oninput="combatField('currentHP',+this.value)" style="width:100%;text-align:center;font-size:1.1rem;background:transparent;border:none;color:var(--gold);font-weight:bold"></div>
      <div class="stat-box"><div class="stat-label">Temp HP</div><input type="number" value="${ch.combat.tempHP}" oninput="combatField('tempHP',+this.value)" style="width:100%;text-align:center;font-size:1.1rem;background:transparent;border:none;color:var(--gold);font-weight:bold"></div>
    </div>
    <div class="hp-bar-wrap"><div class="hp-bar ${barClass}" style="width:${hpPct}%"></div></div>
    <div class="flex gap-2" style="margin-top:0.8rem">
      <div style="flex:1">
        <div class="cs-field-label">Hit Dice</div>
        <input class="cs-field-underline" type="text" value="${esc(ch.combat.hitDice)}" placeholder="1d8" oninput="combatField('hitDice',this.value)">
      </div>
      <div>
        <div class="cs-field-label">Death Saves</div>
        <div class="flex gap-1" style="align-items:center;margin-top:0.3rem;font-size:0.75rem">
          <span style="color:var(--green-lt)">S:</span>
          ${[0,1,2].map(i=>`<input type="checkbox" ${(ch.deathSaves.successes||0)>i?'checked':''} onchange="updateDeathSave('successes',${i},this.checked)">`).join('')}
          <span style="color:var(--red-lt);margin-left:0.3rem">F:</span>
          ${[0,1,2].map(i=>`<input type="checkbox" ${(ch.deathSaves.failures||0)>i?'checked':''} onchange="updateDeathSave('failures',${i},this.checked)">`).join('')}
        </div>
      </div>
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
const SPELL_ALL_KEY    = 'dnd_spells_all_v2';
const CUSTOM_SPELLS_KEY = 'dnd_custom_spells_v1';

let allSpellsDb   = null; // sorted master list from API
let customSpells  = null; // [{...}, ...]  user-created
let spellViewTab  = 'all'; // 'all' | 'known' | 'prepared'
let spellFilters  = { q:'', level:'all', school:'all', cls:'all', conc:false, ritual:false };
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
  setSpellStatus('✾ Loading all spells…');
  try {
    let url = 'https://api.open5e.com/spells/?limit=400&format=json';
    let all = [];
    while (url) {
      const res  = await fetch(url);
      const data = await res.json();
      all = all.concat(data.results || []);
      url = data.next || null;
    }
    allSpellsDb = all.sort((a,b) => (a.level_int||0)-(b.level_int||0) || a.name.localeCompare(b.name));
    saveAllSpells();
    setSpellStatus('');
    renderSpellTabContent();
  } catch(e) {
    setSpellStatus('Could not load spells — check connection.', true);
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
    if (f.conc   && sp.concentration !== 'yes') return false;
    if (f.ritual && sp.ritual        !== 'yes') return false;
    return true;
  });
}

function renderFilterBar() {
  const schools = ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'];
  const classes = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard','Artificer','Blood Hunter'];
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
        <button class="btn btn-sm" onclick="fetchAllSpells()" title="Refresh from API">↻</button>
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
          const safeData = encodeURIComponent(JSON.stringify({name:sp.name,level_int:sp.level_int||0,school:sp.school||'',casting_time:sp.casting_time||'',range:sp.range||'',components:sp.components||'',concentration:sp.concentration||'no',ritual:sp.ritual||'no',desc:sp.desc||'',dnd_class:sp.dnd_class||'',_custom:sp._custom||false}));
          return `<div class="spell-browser-row">
            <div class="spell-browser-left">
              ${sp._custom?`<span style="font-size:0.6rem;color:#c084fc;border:1px solid rgba(192,132,252,0.4);border-radius:3px;padding:0 3px;flex-shrink:0">✏</span>`:''}
              <span class="spell-name" style="font-size:0.82rem">${esc(sp.name)}</span>
              <span class="spell-badge" style="border-color:${sc};color:${sc};font-size:0.58rem">${esc(lvlLabel)}${lvlLabel&&school?' · ':''}${esc(school)}</span>
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

  // Session log
  const log = (ch.sessionLog || []).slice(0, 8);
  const logHtml = log.length ? `
    <div class="spell-group" style="margin-top:0.6rem">
      <div class="spell-group-heading">✿ Session Log</div>
      ${log.map(e => `<div class="spell-log-entry">${esc(e.text)}<span class="spell-log-ts">${new Date(e.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div>`).join('')}
    </div>` : '';

  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Spells</div>
    ${headerStats}
    ${slotsHtml}
    <div class="spell-tabs">
      <button class="spell-tab${spellViewTab==='all'?' active':''}" data-tab="all" onclick="switchSpellTab('all')">✿ All Spells</button>
      <button class="spell-tab${spellViewTab==='known'?' active':''}" data-tab="known" onclick="switchSpellTab('known')">Known <span class="spell-count">${known}</span></button>
      <button class="spell-tab${spellViewTab==='prepared'?' active':''}" data-tab="prepared" onclick="switchSpellTab('prepared')">Prepared <span class="spell-count">${prepared}</span></button>
    </div>
    <div id="spell-tab-content"></div>
    ${logHtml}
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

function renderFeaturesSection(ch) {
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Features &amp; Traits</div>
    <textarea class="sheet-textarea" rows="8" placeholder="Class features, racial traits, feats..." oninput="ch_field('features',this.value)">${esc(ch.features||'')}</textarea>
  </div>`;
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

// ── Character Sheet — Main Render ──────────────────────────────────────────────
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
        ${renderAbilityScores(ch)}
        ${renderCoreStats(ch, pb)}
        ${renderSavingThrows(ch, pb)}
        ${renderSkillList(ch, pb)}
      </div>
      <div class="cs-col-mid">
        ${renderCombatSection(ch)}
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
function ch_field(field, value) { db.characters[currentCharId][field] = value; }
function ch_field_level(value) {
  const ch = db.characters[currentCharId];
  ch.level = Math.min(20, Math.max(1, parseInt(value)||1));
  ch.proficiencyBonus = profBonus(ch.level);
  saveData(db); renderApp();
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
