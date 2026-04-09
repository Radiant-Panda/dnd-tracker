// ── Data Layer ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'dnd_tracker_v1';

function migrateCharacter(ch) {
  if (ch.inspiration === undefined) ch.inspiration = false;
  if (!ch.languages)      ch.languages = '';
  if (!ch.proficiencies)  ch.proficiencies = '';
  if (!ch.currency)       ch.currency = { cp:0, sp:0, ep:0, gp:0, pp:0 };
  if (!ch.attacks)        ch.attacks = [];
  if (!ch.skillExpertise) ch.skillExpertise = [];
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
  if (currentView === 'character') window.scrollTo(0, scrollY);
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
  db.campaigns.push({ id:uid(), name, description:document.getElementById('camp-desc').value.trim(), characters:[], npcs:[], initiative:null, campaignTab:'characters', createdAt:Date.now() });
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
  if (c) c.characters = c.characters.filter(cid => cid !== id);
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
              ${(cb.conditions||[]).map(cond=>`<span class="condition-tag" onclick="removeCondition(${i},'${cond}')" title="Click to remove">${cond} &times;</span>`).join('')}
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
  let name, ac, maxHP, hp;
  if (type==='player') { const ch=db.characters[entityId]; name=ch.name; ac=ch.combat.ac; maxHP=ch.combat.maxHP; hp=ch.combat.currentHP; }
  else { const npc=db.npcs[entityId]; name=npc.name; ac=npc.ac||10; maxHP=npc.maxHP||10; hp=npc.hp||10; }
  getInitiative().combatants.push({ id:uid(), name, initiative:Math.ceil(Math.random()*20), ac, hp, maxHP, type, conditions:[] });
  saveData(db); closeModal(); renderApp();
}
function addAllPcsToInitiative() {
  const campaign=getCampaign(), init=getInitiative();
  const existing=new Set(init.combatants.map(c=>c.name));
  (campaign.characters||[]).forEach(id => { const ch=db.characters[id]; if(!ch||existing.has(ch.name)) return; init.combatants.push({id:uid(),name:ch.name,initiative:Math.ceil(Math.random()*20),ac:ch.combat.ac,hp:ch.combat.currentHP,maxHP:ch.combat.maxHP,type:'player',conditions:[]}); });
  saveData(db); renderApp();
}
function sortInitiative() { const init=getInitiative(); init.combatants.sort((a,b)=>b.initiative-a.initiative); init.currentIndex=0; saveData(db); renderApp(); }
function nextTurn() { const init=getInitiative(); if(!init.combatants.length) return; init.currentIndex=(init.currentIndex||0)+1; if(init.currentIndex>=init.combatants.length){init.currentIndex=0;init.round++;} saveData(db); renderApp(); }
function updateCombatantHP(i,val) { const init=getInitiative(); init.combatants[i].hp=Math.max(0,Math.min(val,init.combatants[i].maxHP)); saveData(db); }
function damageCombatant(i,amt) { const init=getInitiative(); init.combatants[i].hp=Math.max(0,init.combatants[i].hp-amt); saveData(db); renderApp(); }
function healCombatant(i,amt) { const init=getInitiative(); const cb=init.combatants[i]; cb.hp=Math.min(cb.maxHP,cb.hp+amt); saveData(db); renderApp(); }
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
  if(row) { const cr=row.querySelector('.condition-row'); if(cr) cr.innerHTML=`${cb.conditions.map(c=>`<span class="condition-tag" onclick="removeCondition(${i},'${c}')" title="Click to remove">${c} &times;</span>`).join('')}<button class="btn btn-sm" onclick="openConditionPicker(${i})">+ Condition</button>`; }
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
    id:uid(), name, race:race||'', class:cls||'Fighter', level:level||1,
    background:'', alignment:'True Neutral', xp:0,
    abilities:{str:10,dex:10,con:10,int:10,wis:10,cha:10},
    proficiencyBonus:profBonus(level),
    saveProficiencies:[], skillProficiencies:[],
    combat:{ac:10,initiative:0,speed:30,maxHP:10,currentHP:10,tempHP:0,hitDice:'1d8'},
    deathSaves:{successes:0,failures:0},
    equipment:[], features:'', notes:'',
    personality:'', ideals:'', bonds:'', flaws:'',
    spells:{slots:{},known:[]},
    inspiration:false, languages:'', proficiencies:'',
    currency:{cp:0,sp:0,ep:0,gp:0,pp:0},
    attacks:[], skillExpertise:[],
    createdAt:Date.now()
  };
}
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

function renderSpellsSection(ch) {
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Spells</div>
    <div class="cs-field-label" style="margin-bottom:0.4rem">Spell Slots</div>
    <div style="display:grid;grid-template-columns:repeat(9,1fr);gap:0.3rem;margin-bottom:0.8rem">
      ${[1,2,3,4,5,6,7,8,9].map(lvl=>`<div style="text-align:center">
        <div style="font-size:0.55rem;color:var(--text-dim);margin-bottom:0.1rem">${lvl}</div>
        <input type="number" min="0" max="9" value="${(ch.spells.slots||{})[lvl]||0}" oninput="updateSpellSlot(${lvl},+this.value)" style="width:100%;text-align:center;font-size:0.9rem;background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--gold);font-weight:bold;padding:0.1rem 0">
      </div>`).join('')}
    </div>
    <div class="cs-field-label" style="margin-bottom:0.4rem">Known Spells</div>
    <ul class="eq-list" style="max-height:160px;overflow-y:auto">
      ${(ch.spells.known||[]).map((sp,i)=>`<li class="eq-item"><span class="eq-name">${esc(sp)}</span><button class="btn btn-icon btn-danger" onclick="removeSpell(${i})">&times;</button></li>`).join('')}
    </ul>
    <div class="eq-add-row">
      <input type="text" id="spell-input" placeholder="Add spell..." onkeydown="if(event.key==='Enter')addSpell()">
      <button class="btn btn-sm" onclick="addSpell()">Add</button>
    </div>
  </div>`;
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
