// ── Data Layer ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'dnd_tracker_v1';
const STORAGE_KEY_BACKUP = 'dnd_tracker_v1_backup';

// Firebase configuration — replace placeholder values with your project's config
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDRsD6PpWIbeeW3JkyfEjphEnMcGkCQ8eQ",
  authDomain:        "dungeons-and-dragons-edd42.firebaseapp.com",
  projectId:         "dungeons-and-dragons-edd42",
  storageBucket:     "dungeons-and-dragons-edd42.firebasestorage.app",
  messagingSenderId: "428793871397",
  appId:             "1:428793871397:web:f761551d74af12400ad3cc",
  measurementId:     "G-WMJJ10TDV4"
};

// ── Firebase / Firestore Internals ───────────────────────────────────────────
let _fireDb = null;          // Firestore instance (null when unconfigured)
let _fireStorage = null;     // Firebase Storage instance (null when unconfigured)
let _fireAuth = null;        // Firebase Auth instance
let _firestoreReady = false; // true once Firebase is initialised
let _storageReady = false;   // true once Firebase Storage is initialised
let _authReady = false;      // true once Firebase Auth is initialised
let _fsWriteTimer = null;    // debounce handle
let _spellSearchTimer = null; // debounce handle for spell search
const _FS_DEBOUNCE = 1500;   // ms to wait before writing to Firestore
let _FS_USER = 'local';      // authenticated user's UID (set on sign-in)

// Snapshot of each doc's JSON — used for change detection
let _dbSnap = { campaigns: {}, characters: {}, npcs: {} };

// Flag to suppress Firestore re-writes when we're applying a Firestore snapshot
let _fromFirestore = false;

function _initFirebase() {
  if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'REPLACE_ME') return;
  if (typeof firebase === 'undefined') { console.warn('[Firebase] SDK not loaded'); return; }
  try {
    // Only init once
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    _fireDb = firebase.firestore();
    _firestoreReady = true;
    if (firebase.storage) {
      _fireStorage = firebase.storage();
      _storageReady = true;
    }
    if (firebase.auth) {
      _fireAuth = firebase.auth();
      _authReady = true;
    }

  } catch (e) { console.warn('[Firebase] Init failed:', e); }
}

// ── Authentication ──────────────────────────────────────────────────────────

function _showAuthGate() {
  document.getElementById('auth-gate').style.display = '';
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('app').style.display = 'none';
}

function _showApp() {
  document.getElementById('auth-gate').style.display = 'none';
  document.getElementById('app-header').style.display = '';
  document.getElementById('app').style.display = '';
}

async function signInWithGoogle() {
  if (!_authReady) {
    // Firebase not configured — run in local-only mode
    _FS_USER = 'local';
    _showApp();
    renderBreadcrumb();
    renderApp();
    initData();
    return;
  }
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const cur = _fireAuth.currentUser;
    if (cur && cur.isAnonymous) {
      // Upgrade the anonymous session in place. linkWithPopup keeps the same uid,
      // so anything already written under it stays reachable after signing in.
      try {
        await cur.linkWithPopup(provider);
      } catch (err) {
        // Already have a real account? Sign into it instead of failing outright.
        // Anything created under the anonymous uid stays behind and needs migrating.
        if (err && (err.code === 'auth/credential-already-in-use'
                 || err.code === 'auth/email-already-in-use')) {
          await _fireAuth.signInWithPopup(provider);
        } else {
          throw err;
        }
      }
    } else {
      await _fireAuth.signInWithPopup(provider);
    }
    // onAuthStateChanged will handle the rest
  } catch (e) {
    console.warn('[Auth] Sign-in failed:', e.message);
    if (typeof showToast === 'function') {
      showToast('<span style="color:#ef4444">Sign-in failed:</span> ' + e.message, 5000);
    }
  }
}

function signOut() {
  if (_authReady && _fireAuth) {
    _fireAuth.signOut();
  }
  // Tear down Firestore listeners
  _snapshotUnsubs.forEach(fn => fn());
  _snapshotUnsubs = [];
  Object.values(_playerCharListeners).forEach(fn => fn());
  _playerCharListeners = {};
  _pvListeners.forEach(fn => fn());
  _pvListeners = [];
  // Clear local state
  _FS_USER = 'local';
  db = { campaigns: [], characters: {}, npcs: {} };
  currentView = 'campaigns';
  currentCampaignId = null;
  currentCharId = null;
  currentNpcId = null;
  _takeSnapshot(db);
  _showAuthGate();
}

async function _onAuthStateChanged(user) {
  // Anonymous sessions are created by the player and setup views purely to satisfy
  // the Firestore rules. They must never reach GM mode: an anonymous uid lives only
  // in browser storage, so campaigns created under one are orphaned the moment that
  // storage is cleared or the player switches browser or device.
  if (!user || user.isAnonymous) {
    _showAuthGate();
    return;
  }

  // Set user ID for all Firestore/Storage paths
  _FS_USER = user.uid;

  // Show the app
  _showApp();

  // Load data from localStorage first (instant render)
  db = loadData();
  renderBreadcrumb();
  renderApp();

  // Check for local data that should be migrated to this user's Firestore
  const hasLocalData = db.campaigns.length > 0 || Object.keys(db.characters).length > 0;

  // Try loading from Firestore for this user
  await _initDataForUser(hasLocalData);
}

async function _initDataForUser(hasLocalData) {
  if (!_firestoreReady) {
    _takeSnapshot(db);
    return;
  }
  const base = `users/${_FS_USER}`;
  try {
    const [campSnap, charSnap, npcSnap] = await Promise.all([
      _fireDb.collection(`${base}/campaigns`).get(),
      _fireDb.collection(`${base}/characters`).get(),
      _fireDb.collection(`${base}/npcs`).get(),
    ]);

    const hasRemoteData = !campSnap.empty || !charSnap.empty || !npcSnap.empty;

    if (hasRemoteData) {
      // Load from Firestore
      const remoteCampaigns = [];
      campSnap.forEach(doc => {
        remoteCampaigns.push(migrateCampaign(doc.data()));
      });
      const remoteChars = {};
      charSnap.forEach(doc => {
        const ch = doc.data();
        migrateCharacter(ch);
        remoteChars[ch.id || doc.id] = ch;
      });
      const remoteNpcs = {};
      npcSnap.forEach(doc => {
        const npc = doc.data();
        remoteNpcs[npc.id || doc.id] = npc;
      });

      db.campaigns  = remoteCampaigns;
      db.characters = remoteChars;
      db.npcs       = remoteNpcs;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch (_) {}

      renderApp();

      // If there was also local data that's different, offer to merge
      if (hasLocalData) {
        const localRaw = localStorage.getItem(STORAGE_KEY_BACKUP);
        if (localRaw) {
          try {
            const local = JSON.parse(localRaw);
            const localHasContent = (local.campaigns || []).length > 0 || Object.keys(local.characters || {}).length > 0;
            if (localHasContent) {
              showToast('Cloud data loaded. Local backup available via Export if needed.', 4000);
            }
          } catch (_) {}
        }
      }
    } else if (hasLocalData) {
      // No remote data — offer to migrate local data up

      showToast(
        '<span style="cursor:pointer" onclick="_migrateLocalToCloud()">Local data found — <b>click here</b> to sync it to the cloud.</span>',
        10000
      );
    }

    _takeSnapshot(db);
    _setupFirestoreListeners();
  } catch (e) {
    console.warn('[Firestore] Initial load failed — using localStorage:', e.message);
    _takeSnapshot(db);
  }
}

async function _migrateLocalToCloud() {
  if (!_firestoreReady) return;
  _takeSnapshot({ campaigns: [], characters: {}, npcs: {} });
  await _writeChangesToFirestore(db);
  showToast('<span style="color:#22c55e">&#10003; Data synced to cloud!</span>', 3000);
}

// ── Firebase Storage — Portrait Helpers ──────────────────────────────────────

// Upload a base64 data URL to Firebase Storage, return the download URL
function _dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const binary = atob(parts[1]);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new Blob([array], { type: mime });
}

async function _uploadPortraitToStorage(charId, dataUrl) {
  if (!_storageReady) throw new Error('Storage not ready');
  const path = `portraits/${_FS_USER}/${charId}.jpg`;
  const ref = _fireStorage.ref(path);
  const blob = _dataUrlToBlob(dataUrl);
  const timeout = ms => new Promise((_, rej) => setTimeout(() => rej(new Error('Upload timed out')), ms));
  await Promise.race([ref.put(blob, { contentType: 'image/jpeg' }), timeout(8000)]);
  return await Promise.race([ref.getDownloadURL(), timeout(5000)]);
}

// Delete a portrait from Firebase Storage
async function _deletePortraitFromStorage(charId) {
  if (!_storageReady) return;
  const path = `portraits/${_FS_USER}/${charId}.jpg`;
  try {
    await _fireStorage.ref(path).delete();

  } catch (e) {
    // Ignore "not found" errors — portrait may not exist in Storage
    if (e.code !== 'storage/object-not-found') {
      console.warn('[Storage] Delete failed:', e.message);
    }
  }
}

// Check if a portrait URL is a Firebase Storage URL
function _isStorageUrl(url) {
  return typeof url === 'string' && url.includes('firebasestorage.googleapis.com');
}

// Check if a portrait is a base64 data URL
function _isBase64Portrait(url) {
  return typeof url === 'string' && url.startsWith('data:image');
}

// Save portrait — upload to Storage if available, fall back to base64 locally
async function _savePortraitWithUpload(charId, dataUrl) {
  const ch = db.characters[charId]; if (!ch) return;

  // Show loading spinner on portrait card
  const portraitFrame = document.querySelector('.portrait-frame');
  if (portraitFrame) {
    portraitFrame.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--muted)">
      <div class="portrait-uploading"><span class="portrait-spinner"></span> Uploading...</div>
    </div>`;
  }

  // Only attempt Firebase Storage when the user is actually signed in
  // (_FS_USER === 'local' means unauthenticated / local-only mode)
  if (_storageReady && _FS_USER !== 'local') {
    try {
      const downloadUrl = await _uploadPortraitToStorage(charId, dataUrl);
      ch.portrait = downloadUrl;

      saveData(db);
      renderApp();
      return;
    } catch (e) {
      console.warn('[Storage] Upload failed, saving base64 locally:', e.message);
    }
  }

  // Fallback: save base64 directly (offline, unauthenticated, or Storage unavailable)
  ch.portrait = dataUrl;
  saveData(db);
  renderApp();
}

// Migrate a base64 portrait to Storage (called during migrateCharacter)
function _queuePortraitMigration(charId) {
  // Defer so it doesn't block character loading
  setTimeout(async () => {
    const ch = db.characters[charId];
    if (!ch || !_isBase64Portrait(ch.portrait) || !_storageReady) return;
    try {
      const downloadUrl = await _uploadPortraitToStorage(charId, ch.portrait);
      ch.portrait = downloadUrl;
      saveData(db);
      renderApp();

    } catch (e) {
      console.warn(`[Storage] Portrait migration failed for ${charId}:`, e.message);
    }
  }, 2000);
}

// Take a snapshot of the current db state for change detection
function _takeSnapshot(data) {
  _dbSnap = { campaigns: {}, characters: {}, npcs: {} };
  (data.campaigns || []).forEach(c => { _dbSnap.campaigns[c.id] = JSON.stringify(c); });
  Object.entries(data.characters || {}).forEach(([id, ch]) => { _dbSnap.characters[id] = JSON.stringify(ch); });
  Object.entries(data.npcs || {}).forEach(([id, npc]) => { _dbSnap.npcs[id] = JSON.stringify(npc); });
  window._dbSnap = _dbSnap; // keep window reference in sync for player listeners
}

// Debounced Firestore write — called by saveData()
function _debouncedFirestoreWrite(data) {
  if (!_firestoreReady || _fromFirestore) return;
  clearTimeout(_fsWriteTimer);
  _fsWriteTimer = setTimeout(() => _writeChangesToFirestore(data), _FS_DEBOUNCE);
}

function _debouncedSpellSearch() {
  clearTimeout(_spellSearchTimer);
  _spellSearchTimer = setTimeout(updateSpellResults, 200);
}

async function _writeChangesToFirestore(data) {
  if (!_firestoreReady) return;
  const base = `users/${_FS_USER}`;
  const batch = _fireDb.batch();
  let changeCount = 0;

  // ── Campaigns ──
  const curCampaigns = {};
  (data.campaigns || []).forEach(c => {
    const json = JSON.stringify(c);
    curCampaigns[c.id] = json;
    if (_dbSnap.campaigns[c.id] !== json) {
      batch.set(_fireDb.doc(`${base}/campaigns/${c.id}`), JSON.parse(json));
      changeCount++;
    }
  });
  // Detect deleted campaigns
  Object.keys(_dbSnap.campaigns).forEach(id => {
    if (!curCampaigns[id]) { batch.delete(_fireDb.doc(`${base}/campaigns/${id}`)); changeCount++; }
  });

  // ── Characters ──
  const curChars = {};
  Object.entries(data.characters || {}).forEach(([id, ch]) => {
    const json = JSON.stringify(ch);
    curChars[id] = json;
    if (_dbSnap.characters[id] !== json) {
      batch.set(_fireDb.doc(`${base}/characters/${id}`), JSON.parse(json));
      changeCount++;
    }
  });
  Object.keys(_dbSnap.characters).forEach(id => {
    if (!curChars[id]) { batch.delete(_fireDb.doc(`${base}/characters/${id}`)); changeCount++; }
  });

  // ── NPCs ──
  const curNpcs = {};
  Object.entries(data.npcs || {}).forEach(([id, npc]) => {
    const json = JSON.stringify(npc);
    curNpcs[id] = json;
    if (_dbSnap.npcs[id] !== json) {
      batch.set(_fireDb.doc(`${base}/npcs/${id}`), JSON.parse(json));
      changeCount++;
    }
  });
  Object.keys(_dbSnap.npcs).forEach(id => {
    if (!curNpcs[id]) { batch.delete(_fireDb.doc(`${base}/npcs/${id}`)); changeCount++; }
  });

  if (changeCount === 0) return;
  try {
    await batch.commit();
    _takeSnapshot(data);
    _syncPlayerLinkedChars();

  } catch (e) {
    console.warn('[Firestore] Write failed — data safe in localStorage:', e.message);
  }
}

// ── Firestore → local real-time listeners ────────────────────────────────────
let _snapshotUnsubs = [];

// Per-character listeners for player-editable chars (keeps GM db in sync with player saves)
let _playerCharListeners = {};

function _syncPlayerLinkedChars() {
  if (IS_PLAYER_VIEW || !_fireDb) return;
  const user = firebase.auth().currentUser;
  if (!user) return;
  // Remove listeners for characters that were deleted or had their shareToken revoked
  Object.keys(_playerCharListeners).forEach(id => {
    const ch = db.characters[id];
    if (!ch || !ch.shareToken) {
      _playerCharListeners[id]();
      delete _playerCharListeners[id];
    }
  });
  const base = `users/${user.uid}`;
  Object.entries(db.characters || {}).forEach(([id, ch]) => {
    if (!ch.shareToken || _playerCharListeners[id]) return;
    _playerCharListeners[id] = _fireDb
      .doc(`${base}/characters/${id}`)
      .onSnapshot(snap => {
        if (!snap.exists || snap.metadata.hasPendingWrites) return;
        const fresh = snap.data();
        if (!fresh) return;
        // Merge player-owned fields into GM's in-memory db
        const merged = { ...db.characters[id] };
        ['combat', 'spells'].forEach(f => {
          if (fresh[f] !== undefined) merged[f] = fresh[f];
        });
        db.characters[id] = merged;
        // Update snapshot so next GM save doesn't re-overwrite these fields
        if (window._dbSnap) {
          window._dbSnap.characters = window._dbSnap.characters || {};
          window._dbSnap.characters[id] = JSON.stringify(merged);
        }
        renderApp();
      });
  });
}

function _setupFirestoreListeners() {
  if (!_firestoreReady) return;
  // Tear down any existing listeners
  _snapshotUnsubs.forEach(fn => fn());
  _snapshotUnsubs = [];
  Object.values(_playerCharListeners).forEach(fn => fn());
  _playerCharListeners = {};
  const base = `users/${_FS_USER}`;

  // Campaigns listener
  _snapshotUnsubs.push(
    _fireDb.collection(`${base}/campaigns`).onSnapshot(snap => {
      if (snap.metadata.hasPendingWrites) return; // ignore local echoes
      _fromFirestore = true;
      const remoteCampaigns = {};
      snap.forEach(doc => { remoteCampaigns[doc.id] = doc.data(); });
      // Merge: keep remote as source of truth for existing docs, preserve local-only additions
      const remoteIds = new Set(Object.keys(remoteCampaigns));
      const merged = [];
      // Add all remote campaigns (update or new)
      Object.values(remoteCampaigns).forEach(c => { merged.push(migrateCampaign(c)); });
      db.campaigns = merged;
      _takeSnapshot(db);
      saveData(db); // localStorage only (re-write suppressed by _fromFirestore flag)
      _fromFirestore = false;
      renderApp();
    }, err => console.warn('[Firestore] Campaigns listener error:', err))
  );

  // Characters listener
  _snapshotUnsubs.push(
    _fireDb.collection(`${base}/characters`).onSnapshot(snap => {
      if (snap.metadata.hasPendingWrites) return;
      _fromFirestore = true;
      snap.docChanges().forEach(change => {
        if (change.type === 'removed') {
          delete db.characters[change.doc.id];
        } else {
          const ch = change.doc.data();
          migrateCharacter(ch);
          db.characters[ch.id || change.doc.id] = ch;
        }
      });
      _takeSnapshot(db);
      saveData(db);
      _fromFirestore = false;
      renderApp();
    }, err => console.warn('[Firestore] Characters listener error:', err))
  );

  // NPCs listener
  _snapshotUnsubs.push(
    _fireDb.collection(`${base}/npcs`).onSnapshot(snap => {
      if (snap.metadata.hasPendingWrites) return;
      _fromFirestore = true;
      snap.docChanges().forEach(change => {
        if (change.type === 'removed') {
          delete db.npcs[change.doc.id];
        } else {
          const npc = change.doc.data();
          db.npcs[npc.id || change.doc.id] = npc;
        }
      });
      _takeSnapshot(db);
      saveData(db);
      _fromFirestore = false;
      renderApp();
    }, err => console.warn('[Firestore] NPCs listener error:', err))
  );
}

// ── Async init — sets up Firebase and auth listener ─────────────────────────
function initData() {
  try { localStorage.removeItem(SPELL_ALL_KEY); } catch (_) {} // free quota from old spell cache
  _initFirebase();
  if (!_authReady) {
    // No auth available — run in local-only mode, show app immediately
    _FS_USER = 'local';
    _showApp();
    _takeSnapshot(db);
    renderBreadcrumb();
    renderApp();
    return;
  }
  // Auth available — listen for auth state changes
  _fireAuth.onAuthStateChanged(_onAuthStateChanged);
}

// ── Player View Bootstrap ────────────────────────────────────────────────────
async function _initPlayerView() {
  _initFirebase();
  if (!_firestoreReady) {
    _pvShowError('Player view requires an active connection. Please try again later.');
    return;
  }
  // Sign in anonymously so Firestore rules (request.auth != null) are satisfied
  if (_authReady) {
    try {
      await _fireAuth.signInAnonymously();
    } catch (e) {
      console.warn('[PlayerView] Anonymous sign-in failed:', e.message);
      // Non-fatal — continue and let Firestore rules decide access
    }
  }
  _showApp();
  document.getElementById('app').innerHTML = '<div style="text-align:center;padding:4rem 1rem;color:var(--muted)"><span class="portrait-spinner" style="display:inline-block;width:32px;height:32px;border-width:3px"></span><p style="margin-top:1rem">Loading character...</p></div>';

  try {
    // We need the GM's uid to build the Firestore path
    // The share URL includes ?gm={gmUid}
    if (!_pvGmUid) {
      _pvShowError('Invalid share link — missing GM identifier.');
      return;
    }
    const base = `users/${_pvGmUid}`;

    // Load campaign and character docs
    const [campDoc, charDoc] = await Promise.all([
      _fireDb.doc(`${base}/campaigns/${_PV_CAMPAIGN}`).get(),
      _fireDb.doc(`${base}/characters/${_PV_PLAYER}`).get(),
    ]);

    if (!campDoc.exists || !charDoc.exists) {
      _pvShowError('Campaign or character not found.');
      return;
    }

    const ch = charDoc.data();
    if (!ch.shareToken || ch.shareToken !== _PV_TOKEN) {
      _pvShowError('Invalid or expired link.');
      return;
    }

    // Set up app state
    const camp = campDoc.data();
    migrateCampaign(camp);
    migrateCharacter(ch);

    db.campaigns = [camp];
    db.characters = { [ch.id]: ch };
    db.npcs = {};

    currentCampaignId = camp.id || _PV_CAMPAIGN;
    currentCharId = ch.id || _PV_PLAYER;
    currentView = 'character';

    // Update header for player view
    _pvUpdateHeader(ch.name);

    renderBreadcrumb();
    renderApp();

    // Set up real-time listeners
    _pvListeners.push(
      _fireDb.doc(`${base}/campaigns/${_PV_CAMPAIGN}`).onSnapshot(snap => {
        if (!snap.exists) return;
        const updated = migrateCampaign(snap.data());
        db.campaigns = [updated];
        // Re-render if viewing the campaign/initiative
        if (currentView === 'campaign') renderApp();
      }, err => console.warn('[PlayerView] Campaign listener error:', err))
    );

    _pvListeners.push(
      _fireDb.doc(`${base}/characters/${_PV_PLAYER}`).onSnapshot(snap => {
        if (!snap.exists || snap.metadata.hasPendingWrites) return;
        const updated = snap.data();
        migrateCharacter(updated);
        db.characters[updated.id || _PV_PLAYER] = updated;
        if (currentView === 'character') renderApp();
      }, err => console.warn('[PlayerView] Character listener error:', err))
    );


  } catch (e) {
    console.error('[PlayerView] Init failed:', e);
    _pvShowError('Failed to load character. Check your connection and try again.');
  }
}

function _pvShowError(msg) {
  _showApp();
  document.getElementById('app').innerHTML = `
    <div style="text-align:center;padding:4rem 1rem">
      <div style="font-size:2.5rem;margin-bottom:1rem">⚠</div>
      <h2 style="color:var(--gold-lt);margin-bottom:0.5rem">Player View</h2>
      <p style="color:var(--muted);max-width:400px;margin:0 auto">${esc(msg)}</p>
    </div>`;
}

function _pvUpdateHeader(charName) {
  const actions = document.querySelector('.header-actions');
  if (actions) {
    actions.innerHTML = `
      <span style="color:var(--muted);font-size:0.8rem;white-space:nowrap">Player View — <strong style="color:var(--gold-lt)">${esc(charName)}</strong></span>
      <div class="theme-wrap">
        <button class="btn btn-sm theme-btn" id="theme-btn" onclick="toggleThemeDropdown(event)" title="Change color theme" aria-label="Change color theme">🎨</button>
        <div class="theme-dropdown hidden" id="theme-dropdown"></div>
      </div>`;
  }
}

// Player view saves — write the full character back to GM's Firestore
function _pvSaveCharacter() {
  if (!IS_PLAYER_VIEW || !_firestoreReady || !_pvGmUid) return;
  const ch = db.characters[_PV_PLAYER];
  if (!ch) return;
  const base = `users/${_pvGmUid}`;
  _fireDb.doc(`${base}/characters/${_PV_PLAYER}`).update(ch).catch(e => {
    console.warn('[PlayerView] Save failed:', e.message);
  });
}

// ── GM: Share Link Generation ────────────────────────────────────────────────
function openShareModal(charId) {
  const ch = db.characters[charId]; if (!ch) return;
  // Generate a share token if one doesn't exist
  if (!ch.shareToken) {
    ch.shareToken = uid();
    saveData(db);
  }
  const base = window.location.origin + window.location.pathname;
  const url = `${base}?campaign=${encodeURIComponent(currentCampaignId)}&player=${encodeURIComponent(charId)}&token=${encodeURIComponent(ch.shareToken)}&gm=${encodeURIComponent(_FS_USER)}`;
  openModal(`<div style="text-align:center">
    <h3 style="margin:0 0 0.75rem;color:var(--gold)">Share Character</h3>
    <p style="color:var(--muted);font-size:0.85rem;margin:0 0 1rem">Share this link with your player. They'll see their character sheet and the combat tracker.</p>
    <input type="text" id="share-url-input" value="${esc(url)}" readonly
      style="width:100%;padding:0.5rem;background:var(--surface2);color:var(--text);border:1px solid var(--border);border-radius:6px;font-size:0.78rem;margin-bottom:0.75rem"
      onclick="this.select()">
    <div class="form-actions" style="justify-content:center">
      <button class="btn" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="_copyShareUrl()">Copy Link</button>
    </div>
  </div>`);
}

function _copyShareUrl() {
  const input = document.getElementById('share-url-input');
  if (!input) return;
  input.select();
  navigator.clipboard.writeText(input.value).then(() => {
    showToast('<span style="color:#22c55e">&#10003; Link copied!</span>', 2000);
  }).catch(() => {
    document.execCommand('copy');
    showToast('<span style="color:#22c55e">&#10003; Link copied!</span>', 2000);
  });
}

function migrateCampaign(c) {
  if (!c.npcs) c.npcs = [];
  if (!c.initiative) c.initiative = null;
  if (!c.campaignTab) c.campaignTab = 'characters';
  if (c.activeCharId === undefined) c.activeCharId = (c.characters || [])[0] || null;
  if (!c.journal) c.journal = [];
  return c;
}

// Infer which rules edition an existing character was built with (subclass era first,
// then species era); new characters default to 2024
function _inferEdition(ch) {
  try {
    if (ch.subclass && ch.class && typeof SUBCLASS_DATA !== 'undefined') {
      const sd = SUBCLASS_DATA[ch.class] && SUBCLASS_DATA[ch.class][ch.subclass];
      if (sd && sd.source) return sd.source === 'PHB 2024' ? '2024' : '2014';
    }
    if (ch.race && typeof SPECIES_DATA !== 'undefined') {
      if ((SPECIES_DATA.species_2024 || []).some(s => s.name === ch.race)) return '2024';
      if ([...(SPECIES_DATA.races_2014 || []), ...(SPECIES_DATA.races_mpmm || [])].some(s => s.name === ch.race)) return '2014';
      const more = (SPECIES_DATA.species_more || []).find(s => s.name === ch.race);
      if (more) return more.edition || '2014';
    }
  } catch (e) {}
  return '2024';
}

function migrateCharacter(ch) {
  if (!ch.edition) ch.edition = _inferEdition(ch);
  if (ch.inspiration === undefined) ch.inspiration = false;
  if (!ch.languages)      ch.languages = '';
  if (!ch.proficiencies)  ch.proficiencies = '';
  if (ch.attunedItems === undefined) ch.attunedItems = [];
  if (ch.activeConcentration === undefined) ch.activeConcentration = null;
  if (typeof ch.activeConcentration === 'string') ch.activeConcentration = { spellName: ch.activeConcentration, castLevel: 0 };
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
  if (!ch.combat)          ch.combat = {ac:10,initiative:0,speed:30,maxHP:10,currentHP:10,tempHP:0,hitDice:'1d8',hitDiceUsed:{}};
  if (!ch.combat.conditions) ch.combat.conditions = [];
  // Migrate hitDiceUsed from old single-number format to per-class object
  if (typeof ch.combat.hitDiceUsed === 'number') {
    const primaryClass = ch.class || 'Fighter';
    ch.combat.hitDiceUsed = { [primaryClass]: ch.combat.hitDiceUsed };
  }
  if (typeof ch.combat.hitDiceUsed !== 'object' || ch.combat.hitDiceUsed === null) ch.combat.hitDiceUsed = {};
  if (!ch.featuresList)    ch.featuresList = [];
  ch.featuresList.forEach(f => {
    if (!f._feat && !f._subclass && !f._species && !f._background &&
        (f._fromBackground || (typeof f._featSource === 'string' && f._featSource.startsWith('Background')))) {
      f._feat = true;
    }
  });
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
  // v6: the sheet-header subclass dropdown used to write only ch.subclass, leaving
  // classes[0].subclass empty and subclass features untagged (so class switches couldn't remove them)
  if (ch.subclass && ch.classes[0] && !ch.classes[0].subclass) ch.classes[0].subclass = ch.subclass;
  const _classForSub = sub => (ch.classes.find(c => c.subclass === sub) || ch.classes[0] || {}).class;
  (ch.featuresList || []).forEach(f => { if (f._subclass && !f._forClass) f._forClass = _classForSub(f._subclass); });
  (ch.resources || []).forEach(r => { if (r._subclass && !r._forClass) r._forClass = _classForSub(r._subclass); });
  _syncSubclassFeaturesFor(ch, false);
  _refreshStoredRulesText(ch);
  if (typeof PROFICIENCY_DATA !== 'undefined') {
    if (!ch.knownLanguages) ch.knownLanguages = ['Common'];
    _syncClassLanguages(ch);
    if (!ch._speciesLanguagesApplied) { _applySpeciesLanguages(ch); ch._speciesLanguagesApplied = true; }
  }
  // Older 2024 background data spelled "Sleight Of Hand" (never matched the skill list) and "Calligrapher'S"
  (ch.skillProficiencies || []).forEach((e, i) => {
    if (e === 'Sleight Of Hand') ch.skillProficiencies[i] = 'Sleight of Hand';
    else if (e && e.name === 'Sleight Of Hand') e.name = 'Sleight of Hand';
  });
  if (typeof ch.proficiencies === 'string') ch.proficiencies = ch.proficiencies.replace(/'S\b/g, "'s");
  if (Array.isArray(ch.backgroundTools)) ch.backgroundTools = ch.backgroundTools.map(t => String(t).replace(/'S\b/g, "'s"));
  // v5: proficiency source tracking — one-time migration
  if (!ch._profMigrationApplied) {
    const _migClass = ch.classes[0]?.class || 'Fighter';
    const _migBgPool = [...(SPECIES_DATA?.backgrounds_2024||[]), ...(SPECIES_DATA?.backgrounds_2014||[])];
    const _migBgData = ch.background ? _migBgPool.find(b => b.name === ch.background) : null;
    if (!ch.backgroundTools) ch.backgroundTools = _migBgData ? [...(_migBgData.tools||[])] : [];
    if (_migBgData && (_migBgData.skills||[]).length) {
      const bgSkillSet = new Set(_migBgData.skills);
      ch.skillProficiencies = ch.skillProficiencies.reduce((acc, e) => {
        if (typeof e === 'string' && bgSkillSet.has(e)) {
          const hasTagged = acc.some(x => typeof x === 'object' && skillProfName(x) === e);
          if (!hasTagged) acc.push({ name: e, _source: 'background' });
          // else: class entry already present — drop the plain-string duplicate
        } else {
          acc.push(e);
        }
        return acc;
      }, []);
    }
    const _migClassTools = CLASS_STARTING_PROFICIENCIES[_migClass]?.tools || [];
    if (_migClassTools.length) ch.proficiencies = mergeProfString(ch.proficiencies, _migClassTools);
    ch._profMigrationApplied = true;
  }
  // v4: auto-calculate spell slots on first migration
  if (!ch.spells._autoCalcApplied && typeof calculateSpellSlots === 'function') {
    applySpellSlots(ch);
    // Remove old Pact Magic Slots resource (now handled by pact magic fields)
    ch.resources = (ch.resources || []).filter(r => r.name !== 'Pact Magic Slots');
    ch.spells._autoCalcApplied = true;
  }
  // Keep class resource trackers in step with classes/levels (never refills uses)
  syncClassResources(ch);
  // Initiative used to be a stored number that ignored DEX changes. Keep a hand-set value as an
  // extra bonus over DEX; 0 was the untouched default, so those characters just follow DEX.
  if (ch.combat.initMisc === undefined) {
    const init = parseInt(ch.combat.initiative) || 0;
    ch.combat.initMisc = init === 0 ? 0 : init - mod(ch.abilities?.dex || 10);
  }
  ch.combat.initiative = initiativeBonus(ch);
  // Losing levels can't leave more hit dice spent than the class now has
  (ch.classes || []).forEach(c => {
    if ((ch.combat.hitDiceUsed[c.class] || 0) > (c.level || 0)) ch.combat.hitDiceUsed[c.class] = c.level || 0;
  });
  // Migrate cantrips: move any level_int===0 spells from prepared into known only
  if (ch.spells.prepared && ch.spells.prepared.length) {
    const cantripsPrepared = ch.spells.prepared.filter(s => typeof s === 'object' && s.level_int === 0);
    if (cantripsPrepared.length) {
      ch.spells.known = ch.spells.known || [];
      cantripsPrepared.forEach(sp => {
        const already = ch.spells.known.some(s => (typeof s==='object'?s.name:s) === sp.name);
        if (!already) ch.spells.known.push(sp);
      });
      ch.spells.prepared = ch.spells.prepared.filter(s => !(typeof s === 'object' && s.level_int === 0));
    }
  }
  // Queue base64 portrait migration to Firebase Storage (async, non-blocking)
  if (ch.id && _isBase64Portrait(ch.portrait)) {
    _queuePortraitMigration(ch.id);
  }
  return ch;
}

function loadData() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY_BACKUP));
    if (!raw) return { campaigns: [], characters: {}, npcs: {} };
    if (!raw.npcs) raw.npcs = {};
    raw.campaigns.forEach(c => migrateCampaign(c));
    Object.values(raw.characters).forEach(ch => migrateCharacter(ch));
    return raw;
  } catch { return { campaigns: [], characters: {}, npcs: {} }; }
}

function saveData(data) {
  // ① Synchronous localStorage write — always immediate
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
    // Also write to backup key for export/import resilience
    try { localStorage.setItem(STORAGE_KEY_BACKUP, json); } catch (_) {}
  } catch (e) {
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      showToast('<span style="color:#ef4444;font-weight:700">⚠ Storage nearly full</span> — remove a portrait or export your data to free space.', 7000);
    }
  }
  // ② Player view: write character back to GM's Firestore immediately
  if (IS_PLAYER_VIEW) {
    _pvSaveCharacter();
    return; // don't run GM's debounced Firestore write
  }
  // ③ Debounced Firestore write — async layer on top (GM only)
  _debouncedFirestoreWrite(data);
}

function uid() {
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  return Date.now().toString(36) + Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

// ── Player View Detection ────────────────────────────────────────────────────
const _urlParams = new URLSearchParams(window.location.search);
const _PV_CAMPAIGN = _urlParams.get('campaign');
const _PV_PLAYER   = _urlParams.get('player');
const _PV_TOKEN    = _urlParams.get('token');
let IS_PLAYER_VIEW = !!((_PV_CAMPAIGN && _PV_PLAYER && _PV_TOKEN));
let _pvGmUid       = _urlParams.get('gm') || null; // GM's uid for Firestore paths
let _pvListeners   = []; // player-view onSnapshot unsubscribe handles

// ── Setup View Detection ─────────────────────────────────────────────────────
// Setup mode = anonymous player following a setup link to create a new character.
// IS_PLAYER_VIEW wins if both URL patterns are somehow present.
const IS_SETUP_VIEW = !IS_PLAYER_VIEW && _urlParams.get('mode') === 'setup';
const SETUP_GM_UID = IS_SETUP_VIEW ? _urlParams.get('gmId') : null;
const SETUP_CAMPAIGN_ID = IS_SETUP_VIEW ? _urlParams.get('campaignId') : null;
const SETUP_TOKEN = IS_SETUP_VIEW ? _urlParams.get('token') : null;

// ── State ──────────────────────────────────────────────────────────────────────
let db = loadData();
let currentView = 'campaigns';
let currentCampaignId = null;
let currentCharId = null;
let currentNpcId = null;
let monsterCache = null;
let charPanelOpen = false;
let _combatLogOpen = false;
let wizardData = {};

// ── Routing & Breadcrumb ───────────────────────────────────────────────────────
function showCampaigns() {
  if (IS_PLAYER_VIEW) return; // players can't navigate away
  currentView = 'campaigns'; currentCampaignId = null; currentCharId = null; currentNpcId = null;
  renderBreadcrumb(); renderApp();
}
function showCampaign(id, tab) {
  currentView = 'campaign'; currentCampaignId = id; currentCharId = null; currentNpcId = null;
  if (tab) { const c = db.campaigns.find(c => c.id === id); if (c) c.campaignTab = tab; }
  renderBreadcrumb(); renderApp();
  _syncPlayerLinkedChars();
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
  const appEl = document.getElementById('app');
  const appScrollTop = appEl ? appEl.scrollTop : 0;
  const listScrollTop = document.querySelector('.spell-api-list')?.scrollTop || 0;
  const app = appEl;
  if      (currentView === 'campaigns')  app.innerHTML = renderCampaignList();
  else if (currentView === 'campaign')   app.innerHTML = renderCampaignDetail();
  else if (currentView === 'character')  app.innerHTML = renderCharacterSheet();
  else if (currentView === 'npc')        app.innerHTML = renderNpcSheet();
  if (currentView === 'character') {
    window.scrollTo(0, scrollY);
    if (appEl) appEl.scrollTop = appScrollTop;
    // Populate spell tab after DOM is ready, then restore spell-list scroll
    setTimeout(() => {
      renderSpellTabContent();
      if (listScrollTop > 0) requestAnimationFrame(() => {
        const listEl = document.querySelector('.spell-api-list');
        if (listEl) listEl.scrollTop = listScrollTop;
      });
    }, 0);
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
  if (!name) { showAlert('Please enter a campaign name.'); return; }
  db.campaigns.push({ id:uid(), name, description:document.getElementById('camp-desc').value.trim(), characters:[], npcs:[], initiative:null, campaignTab:'characters', activeCharId:null, journal:[], createdAt:Date.now() });
  saveData(db); closeModal(); renderApp();
}
function updateCampaign(id) {
  const name = document.getElementById('camp-name').value.trim();
  if (!name) { showAlert('Please enter a campaign name.'); return; }
  const c = db.campaigns.find(c => c.id === id);
  c.name = name; c.description = document.getElementById('camp-desc').value.trim();
  saveData(db); closeModal(); renderApp();
}
function deleteCampaign(id) {
  showConfirm('Delete this campaign and all its characters & NPCs?', () => {
    const c = db.campaigns.find(c => c.id === id);
    if (c) { (c.characters||[]).forEach(cid => delete db.characters[cid]); (c.npcs||[]).forEach(nid => delete db.npcs[nid]); }
    db.campaigns = db.campaigns.filter(c => c.id !== id);
    saveData(db); renderApp();
  });
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
        ${!IS_PLAYER_VIEW && tab==='characters'?`<button class="btn btn-primary" onclick="openNewCharModal()">+ Add Character</button>`:''}
        ${!IS_PLAYER_VIEW && tab==='npcs'?`<button class="btn btn-primary" onclick="openNewNpcModal()">+ Add NPC</button>`:''}
        ${!IS_PLAYER_VIEW && tab==='initiative'?`<button class="btn btn-primary" onclick="openAddCombatantModal()">+ Add Combatant</button><button class="btn btn-sm" onclick="nextTurn()">Next Turn &#8594;</button><button class="btn btn-sm btn-danger" onclick="clearInitiative()">End Combat</button>`:''}
        ${!IS_PLAYER_VIEW && tab==='journal'?`<button class="btn btn-primary" onclick="addJournalEntry()">+ New Entry</button>`:''}
        ${!IS_PLAYER_VIEW ? `<button class="btn btn-sm" onclick="openMagicItemRandomizer()">🎲 Magic Items</button>` : ''}
        ${!IS_PLAYER_VIEW ? `<button class="btn btn-sm" onclick="openSetupLinkModal()" title="Generate a link players can use to create their own characters">✦ Player Setup Link</button>` : ''}
      </div>
    </div>
    ${campaign.description?`<p class="text-dim" style="margin-bottom:1rem">${esc(campaign.description)}</p>`:''}
    <div class="tabs">
      <div class="tab ${tab==='characters'?'active':''}" onclick="showCampaign('${campaign.id}','characters')">Characters</div>
      ${!IS_PLAYER_VIEW ? `<div class="tab ${tab==='npcs'?'active':''}" onclick="showCampaign('${campaign.id}','npcs')">NPCs</div>` : ''}
      <div class="tab ${tab==='initiative'?'active':''}" onclick="showCampaign('${campaign.id}','initiative')">&#9876; Combat</div>
      ${!IS_PLAYER_VIEW ? `<div class="tab ${tab==='journal'?'active':''}" onclick="showCampaign('${campaign.id}','journal')">📖 Journal ${(campaign.journal||[]).length>0?`<span class="spell-count">${(campaign.journal||[]).length}</span>`:''}</div>` : ''}
    </div>
    ${tab==='characters' ? renderCharacterCards(campaign) : ''}
    ${tab==='npcs'       ? renderNpcCards(campaign) : ''}
    ${tab==='initiative' ? renderInitiativeTracker(campaign) : ''}
    ${tab==='journal'    ? renderJournalTab(campaign) : ''}`;
}

// ── Player Setup Link (GM-side) ──────────────────────────────────────────────
function openSetupLinkModal() {
  const camp = db.campaigns.find(c => c.id === currentCampaignId);
  if (!camp) return;
  const hasToken = !!camp.setupToken;
  const currentUserUid = firebase.auth().currentUser?.uid || '';
  const link = hasToken
    ? `${window.location.origin}${window.location.pathname}?mode=setup&gmId=${currentUserUid}&campaignId=${camp.id}&token=${camp.setupToken}`
    : '';
  const safeLink = link.replace(/'/g, "\\'");
  openModal(`
    <h2>✦ Player Setup Link</h2>
    <p style="color:var(--text-dim);font-size:0.9rem">
      Share this link with players so they can create their own characters.
      Characters they create will appear in this campaign automatically.
    </p>
    ${hasToken ? `
      <div style="margin:1rem 0;padding:1rem;background:var(--surface2);border-radius:8px;word-break:break-all;font-family:monospace;font-size:0.85rem">
        ${esc(link)}
      </div>
      <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${safeLink}').then(()=>showToast('Link copied!'))">Copy Link</button>
      <button class="btn btn-danger" onclick="_revokeSetupToken()" style="margin-left:0.5rem">Revoke Link</button>
    ` : `
      <p>No active setup link. Generate one to invite players.</p>
      <button class="btn btn-primary" onclick="_generateSetupToken()">Generate Setup Link</button>
    `}
  `);
}

function _generateSetupToken() {
  const camp = db.campaigns.find(c => c.id === currentCampaignId);
  if (!camp) return;
  camp.setupToken = 'setup_' + uid();
  saveData(db);
  openSetupLinkModal(); // re-render
}

function _revokeSetupToken() {
  const camp = db.campaigns.find(c => c.id === currentCampaignId);
  if (!camp) return;
  showConfirm('Revoke the setup link? Existing characters are unaffected, but the link will stop working.', () => {
    camp.setupToken = null;
    saveData(db);
    openSetupLinkModal();
  });
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
        ${!IS_PLAYER_VIEW ? `<button class="btn btn-sm" onclick="openShareModal('${ch.id}')" title="Share with player">Share</button>` : ''}
        ${!IS_PLAYER_VIEW ? `<button class="btn btn-sm btn-danger" onclick="deleteCharacter('${ch.id}')">Delete</button>` : ''}
      </div>
    </div>`;
  }).join('')}</div>`;
}

function openNewCharModal() { openCharWizard(); }
function deleteCharacter(id) {
  showConfirm('Delete this character?', () => {
    const ch = db.characters[id];
    // Delete portrait from Firebase Storage if applicable
    if (ch && _isStorageUrl(ch.portrait)) _deletePortraitFromStorage(id);
    delete db.characters[id];
    const c = db.campaigns.find(c => c.id === currentCampaignId);
    if (c) {
      c.characters = c.characters.filter(cid => cid !== id);
      if (c.activeCharId === id) c.activeCharId = c.characters[0] || null;
    }
    saveData(db); renderApp();
  });
}

// ── NPC Manager ───────────────────────────────────────────────────────────────
function renderNpcCards(campaign) {
  const npcs = (campaign.npcs||[]).map(id => db.npcs[id]).filter(Boolean);
  if (npcs.length === 0) return `<div class="empty-frame"><div class="empty-frame-header">✦ ───── ✾ ───── ✦</div><div class="empty"><div class="empty-icon empty-icon-themed"><svg viewBox="0 0 24 24" width="3rem" height="3rem" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4"/><path d="M12 14c-6.075 0-9 2.686-9 4v1h18v-1c0-1.314-2.925-4-9-4z"/></svg></div><p>No NPCs yet.</p></div></div>`;
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
  showConfirm('Delete this NPC?', () => {
    delete db.npcs[id];
    const c = db.campaigns.find(c => c.id === currentCampaignId);
    if (c) c.npcs = c.npcs.filter(nid => nid !== id);
    saveData(db); renderApp();
  });
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
  showConfirm('Delete this journal entry?', () => {
    const c = db.campaigns.find(c => c.id === campaignId);
    if (!c) return;
    c.journal = (c.journal||[]).filter(e => e.id !== entryId);
    saveData(db); renderApp();
  });
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
      <button id="npc-save-btn" class="btn btn-primary btn-sm" onclick="saveNpcSheet()">Save</button>
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
function npc_field(field, value) { db.npcs[currentNpcId][field] = value; _queueSave(); }
function saveNpcSheet() {
  saveData(db);
  const btn = document.getElementById('npc-save-btn');
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
function getInitiative() { const c=getCampaign(); if(!c.initiative) c.initiative={round:1,currentIndex:0,combatants:[],log:[]}; c.initiative.combatants.forEach(cb => { if(typeof cb.tempHP === 'undefined') cb.tempHP = 0; }); if(!c.initiative.log) c.initiative.log=[]; return c.initiative; }

function combatLog(text) {
  const init = getInitiative();
  init.log.push({ round: init.round||1, text, ts: Date.now() });
  saveData(db);
  // Update log panel in-place if visible — no full re-render needed
  const panel = document.getElementById('combat-log-entries');
  if (panel) panel.innerHTML = _renderCombatLogEntries(init);
}
function _renderCombatLogEntries(init) {
  const log = [...(init.log||[])].reverse();
  if (!log.length) return `<p style="color:var(--text-dim);font-size:0.78rem;text-align:center;padding:0.4rem">No events yet.</p>`;
  return log.map(e =>
    `<div style="display:flex;align-items:baseline;gap:0.4rem;padding:0.15rem 0">
      <span style="font-size:0.6rem;background:rgba(var(--accent-rgb),0.25);color:#c4b5fd;border:1px solid rgba(var(--accent-rgb),0.35);border-radius:99px;padding:1px 5px;flex-shrink:0;white-space:nowrap">R${e.round}</span>
      <span style="font-size:0.75rem;color:var(--text-dim)">${esc(e.text)}</span>
    </div>`
  ).join('');
}

function renderInitiativeTracker(campaign) {
  const init = campaign.initiative || {round:1,currentIndex:0,combatants:[]};
  const combatants = init.combatants || [];
  if (combatants.length === 0) return IS_PLAYER_VIEW
    ? `<div class="empty-frame"><div class="empty-frame-header">✦ ───── ✾ ───── ✦</div><div class="empty"><div class="empty-icon">&#9876;</div><p>No active combat.</p></div></div>`
    : `<div class="empty-frame"><div class="empty-frame-header">✦ ───── ✾ ───── ✦</div><div class="empty"><div class="empty-icon">&#9876;</div><p>No combatants yet.</p>
      <div style="margin-top:1rem;display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openAddCombatantModal()">+ Add Combatant</button>
        <button class="btn" onclick="openMonsterSearchModal()">&#128269; Monster Search</button>
        <button class="btn" onclick="addAllPcsToInitiative()">Add All PCs</button>
      </div>
    </div></div>`;
  return `
    <div class="initiative-header">
      <span class="round-badge">Round ${init.round}</span>
      ${!IS_PLAYER_VIEW ? `<div class="flex gap-1">
        <button class="btn btn-sm" onclick="openMonsterSearchModal()">&#128269; Monster Search</button>
        <button class="btn btn-sm" onclick="openAoeDamageModal()">&#128165; AoE Damage</button>
        <button class="btn btn-sm" onclick="addAllPcsToInitiative()">Add All PCs</button>
        <button class="btn btn-sm" onclick="sortInitiative()">Sort &#8595;</button>
        <button class="btn btn-sm${_combatLogOpen?' btn-primary':''}" onclick="toggleCombatLog()">📜 Log${(init.log||[]).length>0?` (${init.log.length})`:''}</button>
      </div>` : ''}
    </div>
    <div class="initiative-list">
      ${combatants.map((cb,i) => {
        const isActive = i===(init.currentIndex%combatants.length);
        const hpPct = cb.maxHP>0?Math.round((cb.hp/cb.maxHP)*100):100;
        return `<div class="initiative-row ${isActive?'active':''}">
          <div class="init-order">${IS_PLAYER_VIEW ? `<span class="init-order-input" style="text-align:center">${cb.initiative}</span>` : `<input type="number" class="init-order-input" value="${cb.initiative}" min="1" max="30" title="Click to edit initiative" oninput="updateCombatantInitiative(${i},+this.value)"><button class="btn-reroll-init" onclick="rerollCombatantInitiative(${i})" title="Re-roll initiative">🎲</button>`}</div>
          <div class="init-body">
            <div class="init-top">
              <span class="init-name">${esc(cb.name)}</span>
              <span class="init-type ${cb.type}">${cb.type}</span>
              ${(()=>{ const cs = _getConcentrationSpell(cb); return cs ? `<span class="conc-badge" title="Concentrating on ${esc(cs)}">C: ${esc(cs)}</span><button class="btn btn-sm conc-clear-combat" onclick="clearConcentrationForCombatant('${cb.charId}')" title="End concentration" style="font-size:0.6rem;padding:0.1rem 0.3rem;margin-left:0.25rem;opacity:0.7">&times;</button>` : ''; })()}
              ${isActive?'<span class="active-arrow">&#9654; Active</span>':''}
            </div>
            <div class="init-stats">
              <span>AC <strong>${cb.ac}</strong></span>
              ${IS_PLAYER_VIEW
                ? `<span>HP <strong>${cb.hp}</strong> / ${cb.maxHP}${cb.tempHP > 0 ? ` (<span class="temp-hp-display">+${cb.tempHP} temp</span>)` : ''}</span>`
                : `<span>HP <input type="number" class="hp-input" value="${cb.hp}" min="0" max="${cb.maxHP}" oninput="updateCombatantHP(${i},+this.value)"> / ${cb.maxHP}${cb.tempHP > 0 ? ` (<span class="temp-hp-display">+${cb.tempHP} temp</span>)` : ''}<button class="btn btn-sm" style="padding:0.2rem 0.35rem; font-size:0.75rem; margin-left:0.3rem;" onclick="openTempHPInput(${i})" title="Add temp HP">+T</button></span>
              <span><button class="btn btn-sm" onclick="toggleCombatantHP(${i})" title="Apply damage or healing">HP</button></span>`}
            </div>
            <div class="hp-bar-wrap" style="position:relative; overflow:hidden;"><div class="hp-bar ${hpPct<=25?'low':hpPct<=50?'mid':''}" style="width:${hpPct}%; position:relative; z-index:2;"></div>${cb.tempHP > 0 ? '<div class="hp-bar-temp" style="width:'+Math.min(100, Math.round(((cb.hp + cb.tempHP) / cb.maxHP) * 100))+'%; position:absolute; top:0; left:0; z-index:1;"></div>' : ''}</div>
            ${cb._hpOpen ? `<div class="cb-hp-popover" tabindex="-1" onfocusout="if(!this.contains(event.relatedTarget))closeCombatantHP(${i})">
              <div class="cb-hp-popover-row">
                <input type="number" class="cb-hp-input cb-hp-dmg" id="cb-hp-dmg-${i}" placeholder="0" min="1"
                  onkeydown="if(event.key==='Enter'){applyCombatantDamage(${i})}else if(event.key==='Escape'){closeCombatantHP(${i})}">
                <button class="btn btn-sm btn-danger" onclick="applyCombatantDamage(${i})">Damage</button>
                <input type="number" class="cb-hp-input cb-hp-heal" id="cb-hp-heal-${i}" placeholder="0" min="1"
                  onkeydown="if(event.key==='Enter'){applyCombatantHeal(${i})}else if(event.key==='Escape'){closeCombatantHP(${i})}">
                <button class="btn btn-sm cb-hp-heal-btn" onclick="applyCombatantHeal(${i})">Heal</button>
              </div>
            </div>` : ''}
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
          ${!IS_PLAYER_VIEW ? `<div class="combatant-actions">
            <button class="btn btn-icon note-btn ${cb.notes ? 'has-notes' : ''}" onclick="toggleCombatantNotes(${i})" title="Notes">${cb.notes ? '●' : ''}📝</button>
            <button class="btn btn-icon btn-danger" onclick="removeCombatant(${i})">&times;</button>
          </div>` : ''}
        </div>`;
      }).join('')}
    </div>
    ${_combatLogOpen ? `<div id="combat-log-panel" style="margin-top:0.75rem;background:rgba(0,0,0,0.25);border:1px solid rgba(var(--accent-rgb),0.25);border-radius:6px;padding:0.5rem 0.6rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem">
        <span style="font-size:0.72rem;font-weight:700;color:#c4b5fd;letter-spacing:0.05em">COMBAT LOG</span>
        <div style="display:flex;gap:0.3rem">
          <button class="btn btn-sm" onclick="copyCombatLog()" title="Copy to clipboard">📋 Copy</button>
          <button class="btn btn-sm btn-danger" onclick="clearCombatLog()" style="padding:0.15rem 0.4rem;font-size:0.72rem">Clear</button>
        </div>
      </div>
      <div id="combat-log-entries" style="max-height:200px;overflow-y:auto">${_renderCombatLogEntries(init)}</div>
    </div>` : ''}
    ${!IS_PLAYER_VIEW ? `<div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="nextTurn()">Next Turn &#8594;</button>
      <button class="btn btn-sm" onclick="openAddCombatantModal()">+ Add Combatant</button>
      <button class="btn btn-sm btn-danger" onclick="clearInitiative()">End Combat</button>
    </div>` : ''}`;
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
  const name = document.getElementById('cb-name').value.trim()||'Unknown';
  init.combatants.push({ id:uid(), name, initiative:parseInt(document.getElementById('cb-init').value)||1, ac:parseInt(document.getElementById('cb-ac').value)||10, hp:parseInt(document.getElementById('cb-hp').value)||10, maxHP:parseInt(document.getElementById('cb-hp').value)||10, type:document.getElementById('cb-type').value, conditions:[], notes:'', tempHP:0 });
  combatLog(`${name} added to combat`);
  saveData(db); closeModal(); renderApp();
}
let _quickAddState = null; // State for quick add initiative modal
function quickAddCombatant(entityId, type) {
  let name, ac, maxHP, hp, charId = null;
  if (type==='player') {
    const ch=db.characters[entityId];
    name=ch.name; ac=ch.combat.ac; maxHP=ch.combat.maxHP; hp=ch.combat.currentHP;
    charId=entityId;
  } else {
    const npc=db.npcs[entityId]; name=npc.name; ac=npc.ac||10; maxHP=npc.maxHP||10; hp=npc.hp||10;
  }
  const d20 = Math.ceil(Math.random()*20);
  const initBonus = type === 'player' ? initiativeBonus(db.characters[entityId]) : 0;
  const rolled = d20 + initBonus;

  // Store state and open modal
  _quickAddState = { charId, name, type, ac, hp, maxHP, rolled };
  openModal(`
    <div class="panel surface2">
      <div class="panel-title">Add to Initiative</div>
      <div style="padding: 1rem 0;">
        <div style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem;">${esc(name)}</div>
        <div class="form-group">
          <label for="qa-init">Initiative${initBonus ? ` <span class="text-dim" style="font-weight:normal">(d20 ${d20} ${initBonus >= 0 ? '+' : '−'} ${Math.abs(initBonus)})</span>` : ''}</label>
          <input type="number" id="qa-init" value="${rolled}">
        </div>
        <div class="form-actions">
          <button class="btn" onclick="_closeQuickAdd()">Cancel</button>
          <button class="btn btn-primary" onclick="_confirmQuickAdd()">Add</button>
        </div>
      </div>
    </div>
  `);
  document.getElementById('qa-init').focus();
}
function _confirmQuickAdd() {
  if (!_quickAddState) return;
  const initiative = parseInt(document.getElementById('qa-init').value) || _quickAddState.rolled;
  const { charId, name, type, ac, hp, maxHP } = _quickAddState;

  getInitiative().combatants.push({ id:uid(), charId, name, initiative, ac, hp, maxHP, type, conditions:[], notes:'', tempHP:0 });
  combatLog(`${name} added to combat (init ${initiative})`);
  _quickAddState = null;
  saveData(db); closeModal(); renderApp();
}
function _closeQuickAdd() {
  _quickAddState = null;
  closeModal();
}
function addAllPcsToInitiative() {
  const campaign=getCampaign(), init=getInitiative();
  const linked=new Set(init.combatants.filter(c=>c.charId).map(c=>c.charId));
  (campaign.characters||[]).forEach(id => {
    const ch=db.characters[id]; if(!ch||linked.has(id)) return;
    init.combatants.push({id:uid(),charId:id,name:ch.name,initiative:Math.ceil(Math.random()*20)+initiativeBonus(ch),ac:ch.combat.ac,hp:ch.combat.currentHP,maxHP:ch.combat.maxHP,type:'player',conditions:ch.combat.conditions||[],notes:'',tempHP:ch.combat.tempHP||0});
  });
  saveData(db); renderApp();
}
function _getConcentrationSpell(cb) {
  if (!cb.charId) return null;
  const ch = db.characters[cb.charId];
  if (!ch) return null;
  // Only show concentration badge when explicitly set by casting a spell —
  // do not scan the spell list (causes false positives and blocks clearing)
  return ch.activeConcentration ? ch.activeConcentration.spellName : null;
}
function _checkConcentration(i, dmg) {
  const cb = getInitiative().combatants[i];
  if (!cb) return;
  const spell = _getConcentrationSpell(cb);
  if (!spell || dmg <= 0) return;
  const dc = Math.min(30, Math.max(10, Math.floor(dmg / 2)));
  cb._concCheck = { dc, spell, dmg };
  saveData(db);
  combatLog(`${cb.name}: Concentration check DC ${dc} (${spell})`);
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

function toggleCombatantHP(i) {
  const init = getInitiative();
  init.combatants.forEach((cb, idx) => { if (idx !== i) cb._hpOpen = false; });
  const cb = init.combatants[i];
  if (cb) {
    cb._hpOpen = !cb._hpOpen;
    saveData(db);
    renderApp();
    if (cb._hpOpen) setTimeout(() => document.getElementById(`cb-hp-dmg-${i}`)?.focus(), 50);
  }
}
function closeCombatantHP(i) {
  const cb = getInitiative().combatants[i];
  if (cb) { cb._hpOpen = false; saveData(db); renderApp(); }
}
function applyCombatantDamage(i) {
  const val = parseInt(document.getElementById(`cb-hp-dmg-${i}`)?.value) || 0;
  if (val > 0) damageCombatant(i, val);
  closeCombatantHP(i);
}
function applyCombatantHeal(i) {
  const val = parseInt(document.getElementById(`cb-hp-heal-${i}`)?.value) || 0;
  if (val > 0) healCombatant(i, val);
  closeCombatantHP(i);
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
    if (prev.charId && db.characters[prev.charId]) {
      db.characters[prev.charId].combat.conditions = [...prev.conditions];
    }
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

function rerollCombatantInitiative(i) {
  const init = getInitiative();
  const cb = init.combatants[i];
  if (!cb) return;

  const roll = Math.ceil(Math.random() * 20);

  if (cb.statBlock) {
    // Monster: roll d20 + DEX modifier and set automatically
    const dexMod = Math.floor(((cb.statBlock.dexterity || 10) - 10) / 2);
    const newInitiative = roll + dexMod;
    cb.initiative = newInitiative;
    combatLog(`${cb.name} re-rolled initiative: ${newInitiative}`);
    saveData(db);
    renderApp();
  } else if (cb.charId && db.characters[cb.charId]) {
    // Linked character: d20 + their initiative bonus
    const bonus = initiativeBonus(db.characters[cb.charId]);
    cb.initiative = roll + bonus;
    combatLog(`${cb.name} re-rolled initiative: ${cb.initiative} (d20 ${roll} ${bonus >= 0 ? '+' : '−'} ${Math.abs(bonus)})`);
    saveData(db);
    renderApp();
  } else {
    // Unlinked player: show toast with d20 result
    showToast(`<strong>${esc(cb.name)}</strong>: Rolled d20 = <strong>${roll}</strong> — enter manually`);
  }
}

function updateCombatantHP(i,val) {
  const cb=getInitiative().combatants[i];
  const oldHP = cb ? cb.hp : 0;
  const newHP = +val;
  CharacterStore.updateInitiativeHP(currentCampaignId,i,newHP,cb.tempHP);
  if (cb && newHP !== oldHP) {
    const diff = Math.abs(newHP - oldHP);
    if (newHP < oldHP) {
      combatLog(`${cb.name} took ${diff} damage (HP ${oldHP}→${newHP})`);
      _checkConcentration(i, diff);
    } else {
      combatLog(`${cb.name} healed ${diff} HP (HP ${oldHP}→${newHP})`);
    }
  }
}
function updateCombatantInitiative(i,val) { if(!val||isNaN(val)) return; getInitiative().combatants[i].initiative=val; saveData(db); }
function damageCombatant(i,amt) {
  const cb=getInitiative().combatants[i];
  if (!cb || amt <= 0) return;
  const oldHP = cb.hp;
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
  combatLog(`${cb.name} took ${amt} damage (HP ${oldHP}→${newHP})`);
  _checkConcentration(i,amt);
  renderApp();
}
function healCombatant(i,amt) {
  const cb=getInitiative().combatants[i];
  if (!cb || amt <= 0) return;
  const oldHP = cb.hp;
  const newHP = Math.min(cb.maxHP, cb.hp + amt);
  CharacterStore.updateInitiativeHP(currentCampaignId,i,newHP,cb.tempHP);
  combatLog(`${cb.name} healed ${amt} HP (HP ${oldHP}→${newHP})`);
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
      <button class="btn btn-primary" onclick="setCombatantTempHP(${i},+document.getElementById('temp-hp-input').value);closeModal()">Add</button>
    </div>`);
  document.getElementById('temp-hp-input').focus();
}
function setCombatantTempHP(i, amount) {
  const cb=getInitiative().combatants[i];
  if (cb) {
    cb.tempHP = Math.max(0, amount);
    CharacterStore.updateInitiativeHP(currentCampaignId,i,cb.hp,cb.tempHP);
    renderApp();
  }
}
function removeCombatant(i) { const init=getInitiative(); const name=init.combatants[i]?.name||'Unknown'; init.combatants.splice(i,1); if(init.currentIndex>=init.combatants.length) init.currentIndex=0; combatLog(`${name} removed from combat`); saveData(db); renderApp(); }
function spendLegendary(i, pipIdx) {
  const cb = getInitiative().combatants[i];
  if (!cb || !cb.legendaryMax) return;
  // Clicking a filled pip sets legendaryUsed to pipIdx+1 (spend that many)
  const newUsed = pipIdx + 1;
  if (newUsed <= (cb.legendaryUsed||0)) return; // already spent
  const prev = cb.legendaryUsed||0;
  cb.legendaryUsed = Math.min(newUsed, cb.legendaryMax);
  const spent = cb.legendaryUsed - prev;
  const remaining = cb.legendaryMax - cb.legendaryUsed;
  combatLog(`${cb.name} used ${spent} legendary action${spent!==1?'s':''} (${remaining} remaining)`);
  saveData(db); renderApp();
}
function resetLegendary(i) {
  const cb = getInitiative().combatants[i];
  if (!cb || !cb.legendaryMax) return;
  cb.legendaryUsed = 0;
  saveData(db); renderApp();
}
function toggleCombatLog() { _combatLogOpen = !_combatLogOpen; renderApp(); }
function clearCombatLog() { const init=getInitiative(); init.log=[]; saveData(db); renderApp(); }
function copyCombatLog() {
  const init=getInitiative();
  const text = [...(init.log||[])].map(e=>`[Round ${e.round}] ${e.text}`).join('\n');
  if (!text) { showToast('Combat log is empty.'); return; }
  navigator.clipboard.writeText(text).then(()=>showToast('Combat log copied to clipboard!')).catch(()=>showToast('Copy failed — try a different browser.'));
}
function clearInitiative() {
  showConfirm('End combat and clear all combatants?', () => {
    _combatLogOpen = false;
    // Clear conditions on any linked characters
    const combatants = getInitiative().combatants;
    combatants.forEach(cb => {
      if (cb.charId && db.characters[cb.charId]) {
        db.characters[cb.charId].combat.conditions = [];
      }
    });
    getCampaign().initiative={round:1,currentIndex:0,combatants:[],log:[]};
    saveData(db); renderApp();
  });
}

function clearConcentrationForCombatant(charId) {
  const ch = db.characters[charId];
  if (!ch) return;
  ch.activeConcentration = null;
  saveData(db);
  renderApp();
}

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
    combatLog(`${cb.name}: ${cond} removed`);
  } else {
    const durInput = document.querySelector(`.cond-dur-input[data-cond="${cond}"]`);
    const dur = durInput ? parseInt(durInput.value) : 0;
    cb.conditions.push(dur > 0 ? { name: cond, duration: dur } : cond);
    combatLog(`${cb.name}: ${cond} applied${dur>0?` (${dur} rounds)`:''}`);
  }
  if (cb.charId && db.characters[cb.charId]) {
    db.characters[cb.charId].combat.conditions = [...cb.conditions];
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
  if (cb.charId && db.characters[cb.charId]) {
    db.characters[cb.charId].combat.conditions = [...cb.conditions];
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
  const init=getInitiative(); const cb=init.combatants[i];
  cb.conditions=(cb.conditions||[]).filter(c=>condName(c)!==cond);
  if (cb.charId && db.characters[cb.charId]) {
    db.characters[cb.charId].combat.conditions = [...cb.conditions];
  }
  combatLog(`${cb.name}: ${cond} removed`);
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
    const res = await fetch('./data/monsters-index.json?v=3');
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
          <span class="monster-cr-badge">CR ${m.cr === '?' ? '—' : m.cr}</span>
          <span class="monster-book-badge" style="background:${color}">${esc(fullName)}</span>
          <span class="text-dim" style="font-size:0.78rem">&#9656;</span>
        </span>
      </div>`;
    }).join('')
    + (remaining > 0 ? `<button class="btn btn-sm" style="width:100%;margin-top:0.5rem" onclick="monsterShowCount+=80;searchMonsters(false)">Show more (${remaining} remaining)</button>` : '');
}

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
      const res = await fetch('./data/monsters.json?v=3');
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
    body += `<div class="sb-prop"><strong>Challenge</strong> ${m.cr === '?' ? '— (scales with spell level)' : esc(m.cr) + ` (${(m.xp||0).toLocaleString()} XP)`}</div>`;

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
    body += `<div class="sb-prop"><strong>Challenge</strong> ${m.cr === '?' ? '— (scales with spell level)' : esc(m.cr)}</div>`;
    body += `<p class="monster-limited-msg">Full stat block not available for this monster — check the source book for complete stats.</p>`;
  }

  return `<button class="btn sb-back-btn" onclick="searchMonsters()">&#8592; Back to Search</button>
    <div class="stat-block">
      <div class="sb-header">
        <div class="stat-block-name">${esc(m.name)}</div>
        <div class="sb-summary">${esc(m.size)} ${esc(m.type)}, ${esc(m.alignment)} &mdash; CR ${m.cr === '?' ? '—' : esc(m.cr)}
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

  /** Decrement a pact magic slot, floor 0 */
  usePactSlot(charId) {
    const ch = db.characters[charId];
    if (!ch) return;
    if ((ch.spells.pactSlots || 0) > 0) { ch.spells.pactSlots--; saveData(db); }
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
// Starting skill proficiency choices per class (2024 PHB)
const CLASS_STARTING_PROFICIENCIES = {
  Barbarian:    { saves:['str','con'], choose:2, skills:['Animal Handling','Athletics','Intimidation','Nature','Perception','Survival'], armor:['Light armor','Medium armor','Shields'], weapons:['Simple weapons','Martial weapons'], tools:[] },
  Bard:         { saves:['dex','cha'], choose:3, skills:['Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight','Intimidation','Investigation','Medicine','Nature','Perception','Performance','Persuasion','Religion','Sleight of Hand','Stealth','Survival'], armor:['Light armor'], weapons:['Simple weapons'], tools:['Three musical instruments of your choice'] },
  Cleric:       { saves:['wis','cha'], choose:2, skills:['History','Insight','Medicine','Persuasion','Religion'], armor:['Light armor','Medium armor','Shields'], weapons:['Simple weapons'], tools:[] },
  Druid:        { saves:['int','wis'], choose:2, skills:['Arcana','Animal Handling','Insight','Medicine','Nature','Perception','Religion','Survival'], armor:['Light armor','Medium armor','Shields'], weapons:['Simple weapons'], tools:['Herbalism kit'] },
  Fighter:      { saves:['str','con'], choose:2, skills:['Acrobatics','Animal Handling','Athletics','History','Insight','Intimidation','Perception','Survival'], armor:['Light armor','Medium armor','Heavy armor','Shields'], weapons:['Simple weapons','Martial weapons'], tools:[] },
  Monk:         { saves:['str','dex'], choose:2, skills:['Acrobatics','Athletics','History','Insight','Religion','Stealth'], armor:[], weapons:['Simple weapons'], tools:['One artisan tool or musical instrument of your choice'] },
  Paladin:      { saves:['wis','cha'], choose:2, skills:['Athletics','Insight','Intimidation','Medicine','Persuasion','Religion'], armor:['Light armor','Medium armor','Heavy armor','Shields'], weapons:['Simple weapons','Martial weapons'], tools:[] },
  Ranger:       { saves:['str','dex'], choose:3, skills:['Animal Handling','Athletics','Insight','Investigation','Nature','Perception','Stealth','Survival'], armor:['Light armor','Medium armor','Shields'], weapons:['Simple weapons','Martial weapons'], tools:[] },
  Rogue:        { saves:['dex','int'], choose:4, skills:['Acrobatics','Athletics','Deception','Insight','Intimidation','Investigation','Perception','Performance','Persuasion','Sleight of Hand','Stealth'], armor:['Light armor'], weapons:['Simple weapons','Martial weapons with the finesse or light property'], tools:["Thieves' tools"] },
  Sorcerer:     { saves:['con','cha'], choose:2, skills:['Arcana','Deception','Insight','Intimidation','Persuasion','Religion'], armor:[], weapons:['Simple weapons'], tools:[] },
  Warlock:      { saves:['wis','cha'], choose:2, skills:['Arcana','Deception','History','Intimidation','Investigation','Nature','Religion'], armor:['Light armor'], weapons:['Simple weapons'], tools:[] },
  Wizard:       { saves:['int','wis'], choose:2, skills:['Arcana','History','Insight','Investigation','Medicine','Religion'], armor:[], weapons:['Simple weapons'], tools:[] },
  Artificer:    { saves:['con','int'], choose:2, skills:['Arcana','History','Investigation','Medicine','Nature','Perception','Sleight of Hand'], armor:['Light armor','Medium armor','Shields'], weapons:['Simple weapons'], tools:["Thieves' tools","Tinker's tools",'One type of artisan tools of your choice'] },
  'Blood Hunter':{ saves:['dex','int'], choose:2, skills:['Acrobatics','Arcana','Athletics','History','Insight','Investigation','Perception','Survival'], armor:['Light armor','Medium armor'], weapons:['Simple weapons','Martial weapons'], tools:[] },
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
// Returns 'background', the class name, or null for a skillProficiencies entry
function skillProfSource(entry) {
  if (typeof entry !== 'object' || !entry) return null;
  if (entry._class) return entry._class;
  if (entry._source === 'background') return 'background';
  return null;
}
// Merges an array of prof strings into a comma-separated string with case-insensitive dedup
function mergeProfString(existing, additions) {
  const parts = (existing || '').split(',').map(s => s.trim()).filter(Boolean);
  const lower = new Set(parts.map(s => s.toLowerCase()));
  (additions || []).forEach(p => { if (p && !lower.has(p.toLowerCase())) { parts.push(p); lower.add(p.toLowerCase()); } });
  return parts.join(', ');
}
// Proficiencies live in ch.proficiencies (a comma list, kept for older code); ch.profSources
// records who granted each one ("Rogue", "Background", "Paladin (multiclass)") so changing a
// class or background can take its grants back without touching anything added by hand.
function _grantProficiencies(ch, items, source) {
  ch.profSources = ch.profSources || {};
  ch.proficiencies = mergeProfString(ch.proficiencies, items);
  items.forEach(p => { const k = p.toLowerCase(); if (!ch.profSources[k]) ch.profSources[k] = source; });
}
// Removes what `source` granted. `fallback` covers older saves that never recorded sources.
function _revokeProficiencies(ch, source, fallback = []) {
  ch.profSources = ch.profSources || {};
  const fallbackLower = new Set(fallback.map(p => p.toLowerCase()));
  const keep = splitProficiencies(ch.proficiencies).filter(p => {
    const k = p.toLowerCase(), src = ch.profSources[k];
    const drop = src ? src === source : fallbackLower.has(k);
    if (drop) delete ch.profSources[k];
    return !drop;
  });
  ch.proficiencies = joinProficiencies(keep);
}

// Pushes {name, _source:'background'} only if no entry already has that skill name
function addBackgroundSkill(ch, skill) {
  if (!(ch.skillProficiencies || []).some(e => skillProfName(e) === skill))
    ch.skillProficiencies.push({ name: skill, _source: 'background' });
}

function mod(score) { return Math.floor((score-10)/2); }
function modStr(score) { const m=mod(score); return (m>=0?'+':'')+m; }
function skillBonus(ch, skillName, abilityKey, pb) {
  const prof=(ch.skillProficiencies||[]).some(e=>skillProfName(e)===skillName);
  const exp=(ch.skillExpertise||[]).includes(skillName);
  return mod(ch.abilities[abilityKey])+(prof?pb:0)+(exp?pb:0)+(!prof && !exp ? jackOfAllTrades(ch, pb) : 0);
}
// Initiative is DEX plus any extra bonus (Alert, items…) kept in combat.initMisc
function initiativeBonus(ch) {
  return mod(ch.abilities?.dex || 10) + (parseInt(ch.combat?.initMisc) || 0);
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
        <img src="${esc(ch.portrait)}" style="width:100%;height:100%;object-fit:cover;object-position:${px}% ${py}%;transform:scale(${zoom/100});transform-origin:${px}% ${py}%">
      </div>`
    : `<span class="portrait-icon">${icon}</span>`;
  return `<div class="portrait-card">
    <div class="portrait-frame">${portraitInner}<span class="portrait-corners"></span></div>
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
    const img = new Image();
    img.onload = function() {
      const MAX = 1200;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else        { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      openPortraitCropModal(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function openPortraitCropModal(imageSrc) {
  const PREVIEW = 300, CROP = 200;
  const CX = (PREVIEW - CROP) / 2, CY = (PREVIEW - CROP) / 2; // 50, 50

  window._cropState = {
    img: null, zoom: 1,
    imgX: PREVIEW / 2, imgY: PREVIEW / 2,
    dragging: false, dragStartX: 0, dragStartY: 0, dragImgX: 0, dragImgY: 0
  };

  openModal(`<div style="text-align:center;user-select:none">
    <h3 style="margin:0 0 0.75rem;color:var(--gold)">Crop Portrait</h3>
    <canvas id="pc-canvas" width="${PREVIEW}" height="${PREVIEW}"
      style="cursor:grab;border-radius:8px;border:2px solid var(--purple);display:block;margin:0 auto;touch-action:none">
    </canvas>
    <div style="display:flex;align-items:center;gap:0.6rem;margin:0.7rem auto 0;max-width:280px">
      <span style="color:var(--muted);font-size:0.8rem;white-space:nowrap">Zoom</span>
      <input type="range" id="pc-zoom" min="50" max="200" value="100" step="1"
        style="accent-color:var(--purple);flex:1" oninput="_pcZoom(+this.value)">
      <span id="pc-zoom-val" style="color:var(--muted);font-size:0.8rem;width:38px;text-align:right">100%</span>
    </div>
    <p style="color:var(--muted);font-size:0.75rem;margin:0.3rem 0 0.8rem">Drag image to reposition &bull; Zoom to fit</p>
    <div class="form-actions" style="justify-content:center">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="_pcApply()">Apply Crop</button>
    </div>
  </div>`);

  window._pcDraw = function() {
    const s = window._cropState;
    const canvas = document.getElementById('pc-canvas'); if (!canvas || !s.img) return;
    const ctx = canvas.getContext('2d');
    const iw = s.img.naturalWidth * s.zoom, ih = s.img.naturalHeight * s.zoom;
    ctx.clearRect(0, 0, PREVIEW, PREVIEW);
    ctx.drawImage(s.img, s.imgX - iw / 2, s.imgY - ih / 2, iw, ih);
    // Dark vignette outside crop square
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, PREVIEW, CY);
    ctx.fillRect(0, CY + CROP, PREVIEW, PREVIEW - CY - CROP);
    ctx.fillRect(0, CY, CX, CROP);
    ctx.fillRect(CX + CROP, CY, PREVIEW - CX - CROP, CROP);
    // Crop border
    ctx.strokeStyle = 'rgba(var(--accent-rgb),0.95)';
    ctx.lineWidth = 2;
    ctx.strokeRect(CX, CY, CROP, CROP);
    // Rule-of-thirds guides
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(CX + CROP/3*i, CY); ctx.lineTo(CX + CROP/3*i, CY+CROP); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(CX, CY + CROP/3*i); ctx.lineTo(CX+CROP, CY + CROP/3*i); ctx.stroke();
    }
  };

  window._pcClamp = function() {
    const s = window._cropState; if (!s.img) return;
    const iw = s.img.naturalWidth * s.zoom, ih = s.img.naturalHeight * s.zoom;
    // If image is larger than crop box, clamp so it always covers the box
    // If smaller, center it
    s.imgX = iw >= CROP ? Math.max(CX + CROP - iw/2, Math.min(CX + iw/2, s.imgX)) : PREVIEW / 2;
    s.imgY = ih >= CROP ? Math.max(CY + CROP - ih/2, Math.min(CY + ih/2, s.imgY)) : PREVIEW / 2;
  };

  window._pcZoom = function(pct) {
    const s = window._cropState;
    // pct=100 means "image covers crop frame"; 50=zoomed out, 200=zoomed in
    s.zoom = (s.coverZoom || 1) * (pct / 100);
    const zv = document.getElementById('pc-zoom-val');
    if (zv) zv.textContent = pct + '%';
    _pcClamp(); _pcDraw();
  };

  window._pcApply = function() {
    const s = window._cropState; if (!s.img) { closeModal(); return; }
    const OUT = 400;
    const out = document.createElement('canvas');
    out.width = OUT; out.height = OUT;
    const ctx = out.getContext('2d');
    const iw = s.img.naturalWidth * s.zoom, ih = s.img.naturalHeight * s.zoom;
    const imgL = s.imgX - iw / 2, imgT = s.imgY - ih / 2;
    // Map crop box back to source image pixel coords
    const sx = (CX - imgL) / s.zoom, sy = (CY - imgT) / s.zoom;
    const sw = CROP / s.zoom, sh = CROP / s.zoom;
    ctx.drawImage(s.img, sx, sy, sw, sh, 0, 0, OUT, OUT);
    const dataUrl = out.toDataURL('image/jpeg', 0.85);
    closeModal();
    // Upload to Firebase Storage (async), fall back to base64
    _savePortraitWithUpload(currentCharId, dataUrl);
  };

  setTimeout(() => {
    const canvas = document.getElementById('pc-canvas'); if (!canvas) return;
    const s = window._cropState;

    const img = new Image();
    img.onload = function() {
      s.img = img;
      // Store coverZoom so _pcZoom can use relative scaling
      s.coverZoom = Math.max(CROP / img.naturalWidth, CROP / img.naturalHeight);
      const slider = document.getElementById('pc-zoom');
      if (slider) { slider.value = 100; slider.min = 50; slider.max = 200; }
      const zv = document.getElementById('pc-zoom-val'); if (zv) zv.textContent = '100%';
      s.imgX = PREVIEW / 2; s.imgY = PREVIEW / 2;
      _pcZoom(100); // 100% = image just covers the crop frame
    };
    img.src = imageSrc;

    // Mouse drag
    canvas.addEventListener('mousedown', e => {
      s.dragging = true; s.dragStartX = e.clientX; s.dragStartY = e.clientY;
      s.dragImgX = s.imgX; s.dragImgY = s.imgY; canvas.style.cursor = 'grabbing'; e.preventDefault();
    });
    canvas.addEventListener('mousemove', e => {
      if (!s.dragging) return;
      s.imgX = s.dragImgX + (e.clientX - s.dragStartX);
      s.imgY = s.dragImgY + (e.clientY - s.dragStartY);
      _pcClamp(); _pcDraw();
    });
    const stopDrag = () => { s.dragging = false; canvas.style.cursor = 'grab'; };
    canvas.addEventListener('mouseup', stopDrag);
    canvas.addEventListener('mouseleave', stopDrag);
    // Touch drag
    canvas.addEventListener('touchstart', e => {
      const t = e.touches[0]; s.dragging = true;
      s.dragStartX = t.clientX; s.dragStartY = t.clientY;
      s.dragImgX = s.imgX; s.dragImgY = s.imgY; e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', e => {
      if (!s.dragging) return;
      const t = e.touches[0];
      s.imgX = s.dragImgX + (t.clientX - s.dragStartX);
      s.imgY = s.dragImgY + (t.clientY - s.dragStartY);
      _pcClamp(); _pcDraw(); e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchend', () => { s.dragging = false; });
  }, 0);
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
            oninput="pfUpdate()" style="accent-color:var(--accent);flex:1">
          <span id="pf-zoom-val" class="pf-val">${zoom}%</span>
        </div>
        <div class="pf-slider-row">
          <label class="pf-label">Horizontal</label>
          <input type="range" id="pf-x" min="0" max="100" value="${px}" step="1"
            oninput="pfUpdate()" style="accent-color:var(--accent);flex:1">
        </div>
        <div class="pf-slider-row">
          <label class="pf-label">Vertical</label>
          <input type="range" id="pf-y" min="0" max="100" value="${py}" step="1"
            oninput="pfUpdate()" style="accent-color:var(--accent);flex:1">
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
  const newSrc = window._pfSrc;
  ch.portraitZoom = parseInt(document.getElementById('pf-zoom')?.value) || 100;
  ch.portraitX   = parseInt(document.getElementById('pf-x')?.value);
  ch.portraitY   = parseInt(document.getElementById('pf-y')?.value);
  closeModal();
  // If the source is a base64 data URL, upload to Storage
  if (_isBase64Portrait(newSrc)) {
    _savePortraitWithUpload(currentCharId, newSrc);
  } else {
    // Already a Storage URL — just save zoom/pan changes
    ch.portrait = newSrc;
    saveData(db);
    renderApp();
  }
}

function removePortrait() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  // Delete from Firebase Storage if it's a Storage URL
  if (_isStorageUrl(ch.portrait)) {
    _deletePortraitFromStorage(currentCharId);
  }
  delete ch.portrait;
  ch.portraitZoom = 100; ch.portraitX = 50; ch.portraitY = 50;
  saveData(db); renderApp();
}

function renderAbilityScores(ch) {
  return `<div class="sheet-panel">
    <div class="cs-section-label">Ability Scores</div>
    <div class="ability-grid">
      ${ABILITIES.map(a => `
        <div class="ability-box">
          <div class="ability-name">${ABILITY_SHORT[a]}</div>
          <div class="stat-value-row">
            <button class="stat-step-btn" onclick="adjustAbility('${a}',-1)">−</button>
            <input class="ability-score-input" type="number" id="ab-${a}" value="${ch.abilities[a]}" min="1" max="30" onchange="updateAbility('${a}',this.value)" onkeydown="if(event.key==='Enter')this.blur()">
            <button class="stat-step-btn" onclick="adjustAbility('${a}',1)">+</button>
          </div>
          <div class="ability-mod-circle" id="mod-${a}">${modStr(ch.abilities[a])}</div>
        </div>`).join('')}
    </div>
  </div>`;
}

// 2014 exhaustion effects stack: each level adds its own on top of the earlier ones
const EXHAUSTION_EFFECTS_2014 = [
  '',
  'Disadvantage on ability checks',
  'Speed halved',
  'Disadvantage on attack rolls and saving throws',
  'Hit point maximum halved',
  'Speed reduced to 0',
  'Dead',
];
function exhaustionEffect(ch) {
  const lvl = ch.exhaustionLevel || 0;
  if (ch.edition !== '2014') return EXHAUSTION_EFFECTS[lvl] || '';
  return lvl >= 6 ? 'Dead' : EXHAUSTION_EFFECTS_2014.slice(1, lvl + 1).join(' · ');
}
// 2024: every D20 Test (checks, saves, attacks) is reduced by 2 per exhaustion level
function exhaustionPenalty(ch) {
  return ch.edition === '2014' ? 0 : 2 * Math.min(5, ch.exhaustionLevel || 0);
}

const EXHAUSTION_EFFECTS = [
  '',
  '−2 to d20 Tests, Speed −5 ft',
  '−4 to d20 Tests, Speed −10 ft',
  '−6 to d20 Tests, Speed −15 ft',
  '−8 to d20 Tests, Speed −20 ft',
  '−10 to d20 Tests, Speed −25 ft',
  'Dead',
];

function renderCoreStats(ch, pb) {
  const exLevel = ch.exhaustionLevel || 0;
  const exEffect = exhaustionEffect(ch);
  const exPips = [1,2,3,4,5,6].map(n => {
    const filled = n <= exLevel;
    // clicking a filled pip at current level resets to 0; otherwise sets to n
    const onclick = filled && n === exLevel ? `setExhaustion(0)` : `setExhaustion(${n})`;
    return `<span class="ex-pip ${filled?'filled':''}" onclick="${onclick}" title="${filled?'Click to clear exhaustion':'Set exhaustion '+n}"></span>`;
  }).join('');
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Core Stats</div>
    <div class="cs-core-row"><span>Proficiency Bonus</span><span class="text-gold cs-core-val">+${pb}</span></div>
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
  // Only the first class grants saving throws (multiclassing never adds them)
  const classGrants = {};
  const firstClass = (ch.classes || [])[0]?.class || ch.class;
  grantedSaves(ch).forEach(a => { classGrants[a] = [firstClass]; });
  const off = new Set(ch.saveOff || []);
  const allProfs = new Set([...(ch.saveProficiencies||[]), ...Object.keys(classGrants)].filter(a => !off.has(a)));
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Saving Throws</div>
    <ul class="skill-list">
      ${ABILITIES.map(a=>{
        const prof = allProfs.has(a);
        const total = mod(ch.abilities[a])+(prof?pb:0)-exhaustionPenalty(ch);
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
        const total = skillBonus(ch,s.name,s.ability,pb) - exhaustionPenalty(ch);
        const skillSrc = prof ? skillProfSource(entry) : null;
        const badge = skillSrc
          ? (skillSrc === 'background'
              ? `<span class="class-skill-badge" style="background:#6b7280" title="Granted by background">BG</span>`
              : `<span class="class-skill-badge" style="background:${CLASS_BADGE_COLORS[skillSrc]||'#9b6dff'}" title="Granted by ${skillSrc}">${CLASS_ICONS[skillSrc]||skillSrc.slice(0,2)}</span>`)
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

function openACCalcModal() {
  const ch = db.characters[currentCharId];
  if (!ch) return;
  const dex = mod(ch.abilities.dex || 10);
  const con = mod(ch.abilities.con || 10);
  const wis = mod(ch.abilities.wis || 10);
  const ARMORS = [
    { group: 'Unarmored', label: 'Unarmored (10 + DEX)', base: 10, type: 'dex', dexCap: null },
    { group: 'Light', label: 'Padded (11 + DEX)', base: 11, type: 'dex', dexCap: null },
    { group: 'Light', label: 'Leather (11 + DEX)', base: 11, type: 'dex', dexCap: null },
    { group: 'Light', label: 'Studded Leather (12 + DEX)', base: 12, type: 'dex', dexCap: null },
    { group: 'Medium', label: 'Hide (12 + DEX max 2)', base: 12, type: 'dex', dexCap: 2 },
    { group: 'Medium', label: 'Chain Shirt (13 + DEX max 2)', base: 13, type: 'dex', dexCap: 2 },
    { group: 'Medium', label: 'Scale Mail (14 + DEX max 2)', base: 14, type: 'dex', dexCap: 2 },
    { group: 'Medium', label: 'Breastplate (14 + DEX max 2)', base: 14, type: 'dex', dexCap: 2 },
    { group: 'Medium', label: 'Half Plate (15 + DEX max 2)', base: 15, type: 'dex', dexCap: 2 },
    { group: 'Heavy', label: 'Ring Mail (14)', base: 14, type: 'flat', dexCap: 0 },
    { group: 'Heavy', label: 'Chain Mail (16)', base: 16, type: 'flat', dexCap: 0 },
    { group: 'Heavy', label: 'Splint (17)', base: 17, type: 'flat', dexCap: 0 },
    { group: 'Heavy', label: 'Plate (18)', base: 18, type: 'flat', dexCap: 0 },
    { group: 'Special', label: 'Unarmored Defense — Barbarian (10 + DEX + CON)', base: 10, type: 'dex+con', dexCap: null },
    { group: 'Special', label: 'Unarmored Defense — Monk (10 + DEX + WIS)', base: 10, type: 'dex+wis', dexCap: null },
    { group: 'Spells', label: 'Mage Armor (13 + DEX)', base: 13, type: 'dex', dexCap: null },
  ];
  function calcAC(armorIdx, shield) {
    const a = ARMORS[armorIdx];
    let ac, formula;
    const shieldBonus = shield ? 2 : 0;
    if (a.type === 'flat') {
      ac = a.base + shieldBonus;
      formula = `${a.base}${shield ? ' + 2 (shield)' : ''}`;
    } else if (a.type === 'dex') {
      const dexAdd = a.dexCap !== null ? Math.min(dex, a.dexCap) : dex;
      ac = a.base + dexAdd + shieldBonus;
      formula = `${a.base} + ${dexAdd} DEX${a.dexCap !== null ? ` (cap ${a.dexCap})` : ''}${shield ? ' + 2 (shield)' : ''}`;
    } else if (a.type === 'dex+con') {
      ac = a.base + dex + con + shieldBonus;
      formula = `10 + ${dex} DEX + ${con} CON${shield ? ' + 2 (shield)' : ''}`;
    } else if (a.type === 'dex+wis') {
      ac = a.base + dex + wis + shieldBonus;
      formula = `10 + ${dex} DEX + ${wis} WIS${shield ? ' + 2 (shield)' : ''}`;
    }
    return { ac, formula };
  }
  // Build grouped select options
  const groups = {};
  ARMORS.forEach((a, i) => { (groups[a.group] = groups[a.group] || []).push({ ...a, i }); });
  const optionsHtml = Object.entries(groups).map(([g, items]) =>
    `<optgroup label="${g}">${items.map(a => `<option value="${a.i}">${esc(a.label)}</option>`).join('')}</optgroup>`
  ).join('');
  // Find current AC match to pre-select (best-effort)
  let defaultIdx = 0;
  openModal(`<div style="min-width:280px">
    <h3 style="margin:0 0 1rem;color:var(--gold)">⚙ AC Calculator</h3>
    <div style="margin-bottom:0.75rem">
      <label class="cs-field-label" style="display:block;margin-bottom:0.3rem">Armor</label>
      <select id="ac-armor-sel" style="width:100%;padding:0.4rem;background:var(--surface2);color:var(--text);border:1px solid var(--border);border-radius:6px" onchange="_acCalcUpdate()">
        ${optionsHtml}
      </select>
    </div>
    <div style="margin-bottom:1rem">
      <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;color:var(--text)">
        <input type="checkbox" id="ac-shield-chk" onchange="_acCalcUpdate()" style="accent-color:var(--purple)">
        Shield (+2 AC)
      </label>
    </div>
    <div id="ac-calc-preview" style="background:var(--surface2);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;text-align:center">
      <div id="ac-calc-val" style="font-size:2rem;font-weight:bold;color:var(--gold)">—</div>
      <div id="ac-calc-formula" style="font-size:0.8rem;color:var(--muted);margin-top:0.2rem">Select armor above</div>
    </div>
    <div class="form-actions" style="justify-content:flex-end">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="_acCalcApply()">Apply</button>
    </div>
  </div>`);
  // Attach helpers to window for inline onclick access
  window._acCalcData = { ARMORS, calcAC };
  window._acCalcUpdate = function() {
    const idx = +document.getElementById('ac-armor-sel').value;
    const shield = document.getElementById('ac-shield-chk').checked;
    const { ac, formula } = calcAC(idx, shield);
    document.getElementById('ac-calc-val').textContent = ac;
    document.getElementById('ac-calc-formula').textContent = formula;
  };
  window._acCalcApply = function() {
    const idx = +document.getElementById('ac-armor-sel').value;
    const shield = document.getElementById('ac-shield-chk').checked;
    const { ac } = calcAC(idx, shield);
    combatField('ac', ac);
    closeModal();
    saveData(db);
    renderApp();
  };
  // Trigger initial preview render
  setTimeout(() => window._acCalcUpdate?.(), 0);
}

function renderCombatSection(ch) {
  const hpPct=ch.combat.maxHP>0?Math.round((ch.combat.currentHP/ch.combat.maxHP)*100):100;
  const barClass=hpPct<=25?'low':hpPct<=50?'mid':'';
  const hdUsedMap = (typeof ch.combat.hitDiceUsed === 'object' && ch.combat.hitDiceUsed !== null) ? ch.combat.hitDiceUsed : {};
  const hdClasses = (ch.classes && ch.classes.length > 0) ? ch.classes : [{ class: ch.class || 'Fighter', level: ch.level || 1 }];
  const hdTotalAll = hdClasses.reduce((s, c) => s + (c.level || 0), 0);
  const hdUsedAll  = hdClasses.reduce((s, c) => s + (hdUsedMap[c.class] || 0), 0);
  const hdRemainingAll = Math.max(0, hdTotalAll - hdUsedAll);
  // Build display string: "5/5d10" for single class, "3/5d10 · 4/5d6" for multi
  const hdDisplayParts = hdClasses.map(c => {
    const sides = HIT_DICE[c.class] || 8;
    const total = c.level || 0;
    const used  = hdUsedMap[c.class] || 0;
    const rem   = Math.max(0, total - used);
    return `${rem}/${total}d${sides}`;
  });
  const hdDisplay = hdClasses.length === 1
    ? hdDisplayParts[0]
    : hdClasses.map((c, i) => `${c.class} ${hdDisplayParts[i]}`).join(' · ');
  // Spell DC / attack per casting ability — the same numbers as the Spells panel (incl. item bonus)
  const spellStats = (() => {
    const pb = profBonus(ch.level || 1);
    const bonus = { dc: parseInt(ch.spellBonus?.dc) || 0, atk: parseInt(ch.spellBonus?.atk) || 0 };
    const seen = new Set();
    return casterEntries(ch).filter(e => e.prog.ability && !seen.has(e.prog.ability) && seen.add(e.prog.ability)).map(e => {
      const sMod = mod(ch.abilities[e.prog.ability] || 10);
      return { cls: e.cls, dc: 8 + pb + sMod + bonus.dc, atk: pb + sMod + bonus.atk };
    });
  })();
  const spellBoxes = spellStats.map(st => {
    const tag = spellStats.length > 1 ? ` · ${esc(st.cls)}` : '';
    return `<div class="cs-combat-duo" style="margin-top:0.6rem;display:grid;grid-template-columns:1fr 1fr;gap:0.6rem">
      <div class="stat-box"><div class="stat-label">Spell DC${tag}</div><div style="text-align:center;font-size:1.3rem;color:var(--gold);font-weight:bold">${st.dc}</div></div>
      <div class="stat-box"><div class="stat-label">Spell Atk${tag}</div><div style="text-align:center;font-size:1.3rem;color:var(--gold);font-weight:bold">${st.atk >= 0 ? '+' : ''}${st.atk}</div></div>
    </div>`;
  }).join('');
  return `<div class="sheet-panel">
    <div class="cs-section-label">Combat</div>
    <div class="cs-combat-trio">
      <div class="combat-stat-card">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3z"/></svg>
        <div class="stat-label">Armor Class</div>
        <div class="stat-value-row">
          <button class="stat-step-btn" onclick="adjustCombatStat('ac',-1)">−</button>
          <input type="number" class="stat-value-input" value="${ch.combat.ac}" oninput="combatField('ac',+this.value)">
          <button class="stat-step-btn" onclick="adjustCombatStat('ac',1)">+</button>
        </div>
        <button class="ac-calc-btn" onclick="openACCalcModal()">Calc AC</button>
      </div>
      <div class="combat-stat-card">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>
        <div class="stat-label">Initiative</div>
        <div class="stat-value-row">
          <button class="stat-step-btn" onclick="adjustCombatStat('initiative',-1)">−</button>
          <input type="number" class="stat-value-input" value="${initiativeBonus(ch)}" oninput="setInitiative(+this.value)" title="DEX modifier ${modStr(ch.abilities.dex || 10)}${ch.combat.initMisc ? `, plus ${ch.combat.initMisc} extra` : ''}">
          <button class="stat-step-btn" onclick="adjustCombatStat('initiative',1)">+</button>
        </div>
      </div>
      <div class="combat-stat-card">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8h10a3 3 0 0 0 0-6M3 14h14a3 3 0 0 1 0 6M3 20h6"/></svg>
        <div class="stat-label">Speed</div>
        <div class="stat-value-row">
          <button class="stat-step-btn" onclick="adjustCombatStat('speed',-1)">−</button>
          <input type="number" class="stat-value-input" value="${ch.combat.speed}" oninput="combatField('speed',+this.value)">
          <button class="stat-step-btn" onclick="adjustCombatStat('speed',1)">+</button>
        </div>
      </div>
    </div>
    ${spellBoxes}
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
      <span class="hd-val">${hdDisplay}</span>
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
          <td><input class="attack-input" value="${esc(atk.name)}" placeholder="Longsword" oninput="updateAttack(${i},'name',this.value)">${atk.mastery ? `<div title="${esc((typeof WEAPON_MASTERY_DESC !== 'undefined' && WEAPON_MASTERY_DESC[atk.mastery]) || '')}" style="font-size:0.58rem;color:#f59e0b;margin-top:1px;cursor:help">✦ ${esc(atk.mastery)}</div>` : ''}</td>
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
  const eqWeight = item => { const w = entryWeight(item, ch.edition === '2014' ? '2014' : '2024').weight;
    return w ? `<span class="eq-weight">${+w.toFixed(2)} lb</span>` : ''; };
  const eqRows = (ch.equipment||[]).map((item, i) => {
    if (item && typeof item === 'object' && item._magic) {
      const color = MAGIC_RARITY_COLORS[item.rarity] || '#9ca3af';
      const attuneTxt = item.attunement ? ` <span style="font-size:0.65rem;color:#f59e0b">⟡</span>` : '';
      const descBtn = item.desc ? `<button id="eqbt-${i}" class="btn btn-icon" onclick="toggleEquipDesc(${i})" style="font-size:0.7rem;padding:0 0.25rem">▾</button>` : '';
      return `<li class="eq-item eq-item-magic">
        <span class="eq-magic-dot" style="background:${color}" title="${esc(MAGIC_RARITY_LABELS[item.rarity]||item.rarity)}"></span>
        <span class="eq-name">${esc(item.name)}${attuneTxt}</span>
        ${eqWeight(item)}
        ${descBtn}
        <button class="btn btn-icon btn-danger" onclick="removeEquipment(${i})">&times;</button>
        ${item.desc ? `<div id="eqdesc-${i}" style="display:none;width:100%;font-size:0.75rem;color:var(--text-dim);padding:0.25rem 0 0.1rem;border-top:1px solid var(--border);margin-top:0.2rem">${esc(item.desc)}</div>` : ''}
      </li>`;
    }
    const label = typeof item === 'object' ? (item.name || '?') : item;
    return `<li class="eq-item"><span class="eq-name">${esc(label)}</span>${eqWeight(item)}<button class="btn btn-icon btn-danger" onclick="removeEquipment(${i})">&times;</button></li>`;
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
// ── Spellcasting ─────────────────────────────────────────────────────────────
// Slot tables, cantrip/prepared/known progressions: spellcasting-rules.js + data/spellcasting_data.js

function calculateSpellSlots(ch) {
  const r = spellSlotMaxes(ch);
  return { slotsMax: r.slots, pactSlots: r.pactSlots, pactSlotLevel: r.pactLevel, hasWarlock: r.hasPact };
}

// New maxes from the rules. Slots gained (a new character, a level-up) arrive ready to use;
// slots lost are removed from what's left.
function applySpellSlots(ch) {
  if (typeof SPELLCASTING_DATA === 'undefined') return; // never zero slots out before the rules load
  const calc = calculateSpellSlots(ch);
  const adjust = (cur, oldMax, newMax) => Math.max(0, Math.min(newMax, (cur || 0) + Math.max(0, newMax - (oldMax || 0))));
  for (let lvl = 1; lvl <= 9; lvl++) {
    const newMax = calc.slotsMax[lvl] || 0;
    ch.spells.slots[lvl] = adjust(ch.spells.slots[lvl], ch.spells.slotsMax[lvl], newMax);
    ch.spells.slotsMax[lvl] = newMax;
  }
  const pactMax = calc.hasWarlock ? calc.pactSlots : 0;
  ch.spells.pactSlots = adjust(ch.spells.pactSlots, ch.spells.pactSlotsMax, pactMax);
  ch.spells.pactSlotsMax = pactMax;
  ch.spells.pactSlotLevel = calc.hasWarlock ? calc.pactSlotLevel : 0;
}

// Leveled spells that count against a spells-known limit (not feat spells or subclass-granted ones)
function _knownSpellCount(ch) {
  const granted = new Set();
  _charSubclasses(ch).forEach(sub => {
    const data = _sslDataFor(ch, sub);
    if (!data || data.prepareType === 'expanded_list') return;
    (function collect(v) {
      if (typeof v === 'string') granted.add(v.toLowerCase());
      else if (v && typeof v === 'object') Object.values(v).forEach(collect);
    })(data.spells || data.levels || {});
  });
  return (ch.spells.known || []).filter(sp => typeof sp === 'object' && sp.level_int > 0 && !sp._fromFeat
    && !granted.has(String(sp.name).toLowerCase())).length;
}

// "7/11" style summaries for the tab badges; null when the character has no such limit
function _preparedSummary(ch) {
  const limits = preparedLimits(ch);
  if (!limits.length) return null;
  const apNames = _getAlwaysPreparedNames(ch);
  const count = (ch.spells.prepared || []).filter(sp => !apNames.has(String(typeof sp === 'object' ? sp.name : sp).toLowerCase())).length;
  return { count, limit: limits.reduce((sum, p) => sum + p.limit, 0), parts: limits };
}
function _knownSummary(ch) {
  const limits = knownLimits(ch);
  if (!limits.length) return null;
  return { count: _knownSpellCount(ch), limit: limits.reduce((sum, p) => sum + p.limit, 0), parts: limits };
}

const SCHOOL_COLORS = {
  Abjuration:'#6d8fd4', Conjuration:'#6dba8f', Divination:'#c4a85a',
  Enchantment:'#c084fc', Evocation:'#e87070', Illusion:'#7b9dd4',
  Necromancy:'#9c7bc4', Transmutation:'#7bbdb8'
};
const SPELL_ALL_KEY    = 'dnd_spells_local_v1';
const CUSTOM_SPELLS_KEY = 'dnd_custom_spells_v1';

const _SPELL_SRC_DISPLAY = { "Player's Handbook (2024)":{abbr:'PHB24',color:'#c084fc'}, "Xanathar's Guide to Everything":{abbr:'XGE',color:'#3b82f6'}, "Tasha's Cauldron of Everything":{abbr:'TCE',color:'#14b8a6'}, "Explorer's Guide to Wildemount":{abbr:'EGW',color:'#f59e0b'}, "Free Basic Rules (2024)":{abbr:'BR24',color:'#9b6dff'}, "Free Basic Rules (2014)":{abbr:'BR14',color:'#9b6dff'}, "Player's Handbook":{abbr:'PHB14',color:'#6d7b9b'} };

let allSpellsDb   = null; // sorted master list from API
let customSpells  = null; // [{...}, ...]  user-created
let spellViewTab  = 'all'; // 'all' | 'known' | 'prepared'
let spellFilters  = { q:'', level:'all', school:'all', cls:'mine', source:'all', conc:false, ritual:false };
let spellFetching = false;
let spellShowCount = 100;

function loadAllSpells() { /* in-memory only — spells.json is browser-cached by HTTP */ }
function saveAllSpells() { /* no-op — removed localStorage caching to save quota */ }
function loadCustomSpells() {
  if (customSpells) return;
  try { customSpells = JSON.parse(localStorage.getItem(CUSTOM_SPELLS_KEY)) || []; }
  catch { customSpells = []; }
  // Custom spells travel with the characters that know them (characters sync to the account),
  // so a new device rebuilds the list from them
  const have = new Set(customSpells.map(sp => sp.name));
  Object.values(db.characters || {}).forEach(ch => [...(ch.spells?.known || []), ...(ch.spells?.prepared || [])].forEach(sp => {
    if (sp && typeof sp === 'object' && sp._custom && !have.has(sp.name) && sp.desc !== undefined) {
      const { _custom, ...spell } = sp;
      customSpells.push(spell); have.add(sp.name);
    }
  }));
}
function saveCustomSpells() {
  try { localStorage.setItem(CUSTOM_SPELLS_KEY, JSON.stringify(customSpells)); } catch {}
}

// Many spells exist in a 2014 and a 2024 version; each character sees their own edition's.
function _spellEditionFor(ch) {
  return ((ch || db.characters[currentCharId])?.edition || '2024') === '2014' ? '2014' : '2024';
}
function _spellByName(name, ch) {
  const lc = String(name).toLowerCase(), ed = _spellEditionFor(ch);
  const matches = (allSpellsDb || []).filter(s => String(s.name).toLowerCase() === lc);
  return matches.find(s => (s.edition || '2024') === ed) || matches[0] || null;
}

// Priced material components: "M (diamonds worth 300+ GP, which the spell consumes)" → { gp: 300, consumed: true }
function _costlyComponent(components) {
  const m = String(components || '').match(/([\d,]+)\+?\s*gp/i);
  return m ? { gp: m[1], consumed: /consume/i.test(components) } : null;
}
function _costTag(sp) {
  const c = _costlyComponent(sp.components);
  return c ? `<span class="spell-tag cost" title="${esc(sp.components)}">${esc(c.gp)} gp${c.consumed ? ' · used up' : ''}</span>` : '';
}
// Cantrips scale with character level ("At level 5: 2d10"); leveled spells scale with the slot instead
function _spellTextCtx(sp, ch) {
  return sp && sp.level_int === 0 ? { level: parseInt(ch?.level) || 1 } : null;
}

// Class spell lists the character casts from (Eldritch Knights and Arcane Tricksters use the Wizard list)
function _mySpellClasses(ch) {
  const out = new Set();
  casterEntries(ch).forEach(e => out.add(SPELLCASTING_DATA.classes[e.cls] ? e.cls : 'Wizard'));
  return out;
}

function getMergedSpells(ch, pool) {
  loadAllSpells(); loadCustomSpells();
  const ed = _spellEditionFor(ch);
  const best = new Map();
  for (const sp of (pool || allSpellsDb || [])) {
    const cur = best.get(sp.name);
    if (!cur || ((cur.edition || '2024') !== ed && (sp.edition || '2024') === ed)) best.set(sp.name, sp);
  }
  return [...best.values(), ...(pool ? [] : customSpells.map(s => ({...s, _custom:true})))];
}

async function fetchAllSpells() {
  if (spellFetching) return;
  spellFetching = true;
  setSpellStatus('✾ Loading spells…');
  try {
    const res = await fetch('./data/spells.json?v=5');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const all = await res.json();
    allSpellsDb = Array.isArray(all) ? all : [];
    saveAllSpells();
    setSpellStatus('');
    renderSpellTabContent();
    if (_miState && _miState.step > 1) _renderMiModal();
    if (_sfState && _sfState.step > 0) _renderSfModal();
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

function _preserveScroll(fn) {
  const appEl = document.getElementById('app');
  const bodyScrollY = window.scrollY || document.documentElement.scrollTop;
  const appScrollTop = appEl ? appEl.scrollTop : 0;
  fn();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, bodyScrollY);
      const appEl2 = document.getElementById('app');
      if (appEl2) appEl2.scrollTop = appScrollTop;
    });
  });
}

function renderSpellTabContent() {
  const el = document.getElementById('spell-tab-content'); if (!el) return;
  const ch = db.characters[currentCharId]; if (!ch) return;
  // Auto-fetch spells if not loaded yet and not already fetching
  if (spellViewTab === 'all' && !allSpellsDb && !spellFetching) {
    fetchAllSpells();
    return;
  }
  // Preserve .spell-api-list scroll across every innerHTML replacement
  const listScroll = document.querySelector('.spell-api-list')?.scrollTop || 0;
  if      (spellViewTab === 'all')      el.innerHTML = renderAllSpellsView(ch);
  else if (spellViewTab === 'known')    el.innerHTML = renderKnownView(ch);
  else if (spellViewTab === 'prepared') el.innerHTML = renderPreparedView(ch);
  requestAnimationFrame(() => {
    const listEl = document.querySelector('.spell-api-list');
    if (listEl) listEl.scrollTop = listScroll;
  });
  // Keep tab count badges in sync
  document.querySelectorAll('.spell-tab').forEach(btn => {
    const tab = btn.dataset.tab;
    const badge = btn.querySelector('.spell-count');
    if (!badge) return;
    const summary = tab === 'known' ? _knownSummary(ch) : tab === 'prepared' ? _preparedSummary(ch) : null;
    if (tab === 'known' && !summary) badge.textContent = (ch.spells.known || []).length;
    if (tab === 'prepared' && !summary) badge.textContent = (ch.spells.prepared || []).length;
    if (summary) {
      badge.textContent = `${summary.count}/${summary.limit}`;
      badge.style.color = summary.count > summary.limit ? 'var(--red-lt)' : '';
    }
  });
}

function getFilteredAllSpells(ch) {
  const merged = spellFilters.source !== 'all'
    ? getMergedSpells(ch, (allSpellsDb || []).filter(sp => sp.src === spellFilters.source))
    : getMergedSpells(ch);
  const f = spellFilters;
  const mine = f.cls === 'mine' ? _mySpellClasses(ch) : new Set();
  const myExtra = new Set();
  if (f.cls === 'mine') _charSubclasses(ch).forEach(sub => {
    const data = _sslDataFor(ch, sub);
    (function collect(v) {
      if (typeof v === 'string') myExtra.add(v.toLowerCase());
      else if (v && typeof v === 'object') Object.values(v).forEach(collect);
    })(data && (data.spells || data.levels));
  });
  return merged.filter(sp => {
    if (f.q && !sp.name.toLowerCase().includes(f.q.toLowerCase()) && !(sp.school||'').toLowerCase().includes(f.q.toLowerCase()) && !(sp.desc||'').toLowerCase().includes(f.q.toLowerCase())) return false;
    if (f.level !== 'all' && (sp.level_int ?? -1) !== parseInt(f.level)) return false;
    if (f.school !== 'all' && (sp.school||'').toLowerCase() !== f.school.toLowerCase()) return false;
    if (f.cls === 'mine') {
      // Your classes' lists, plus subclass lists; characters with no spellcasting see everything
      if (mine.size && !myExtra.has(sp.name.toLowerCase()) && !sp._custom
          && ![...mine].some(c => (sp.dnd_class || '').toLowerCase().includes(c.toLowerCase()))) return false;
    } else if (f.cls !== 'all') {
      const classes = (sp.dnd_class || sp.page || '').toLowerCase();
      if (!classes.includes(f.cls.toLowerCase())) return false;
    }
    if (f.source !== 'all' && sp.src !== f.source) return false;
    if (f.conc   && sp.concentration !== 'yes') return false;
    if (f.ritual && sp.ritual        !== 'yes') return false;
    return true;
  });
}

function renderFilterBar() {
  const schools = ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'];
  const classes = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard','Artificer','Blood Hunter'];
  const sources = [
    {val:'phb2024',label:'PHB 2024'},
    {val:'phb2014',label:'PHB 2014'},
    {val:'xge',label:"Xanathar's (XGE)"},
    {val:'tce',label:"Tasha's (TCE)"},
    {val:'egw',label:"Explorer's Guide (EGW)"},
  ];
  // Every other book in the spell data, alphabetically
  const knownSrc = new Set(sources.map(s => s.val));
  const extra = new Map();
  (allSpellsDb || []).forEach(sp => { if (sp.src && !knownSrc.has(sp.src)) extra.set(sp.src, sp.book || sp.src); });
  [...extra].sort((a, b) => a[1].localeCompare(b[1])).forEach(([val, label]) => sources.push({ val, label }));
  return `<div class="spell-filter-bar">
    <div class="spell-search-wrap">
      <span class="spell-search-icon">✾</span>
      <input type="text" class="spell-filter-input" placeholder="Search spells…" value="${esc(spellFilters.q)}"
        oninput="spellFilters.q=this.value;_debouncedSpellSearch()">
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
      <option value="mine"${spellFilters.cls==='mine'?' selected':''}>My class spells</option>
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
          const inK = known.has(sp.name);
          const inP = prepared.has(sp.name);
          const srcInfo = _SPELL_SRC_DISPLAY[sp.source] || {abbr:(sp.src||'?').toUpperCase(),color:'#7b6d8d'};
          const safeData = encodeURIComponent(JSON.stringify({name:sp.name,level_int:sp.level_int||0,school:sp.school||'',casting_time:sp.casting_time||'',range:sp.range||'',components:sp.components||'',concentration:sp.concentration||'no',ritual:sp.ritual||'no',dnd_class:sp.dnd_class||'',_custom:sp._custom||false}));
          return `<div class="spell-browser-row">
            <div class="spell-browser-left">
              ${sp._custom?`<span style="font-size:0.6rem;color:var(--gold);border:1px solid rgba(var(--accent-rgb),0.4);border-radius:3px;padding:0 3px;flex-shrink:0">✏</span>`:''}
              <span class="spell-name" style="font-size:0.82rem">${esc(sp.name)}</span>
              <span class="spell-badge" style="border-color:${sc};color:${sc};font-size:0.58rem">${esc(lvlLabel)}${lvlLabel&&school?' · ':''}${esc(school)}</span>
              ${srcInfo.abbr !== '?' ? `<span class="spell-source-badge" style="background:${srcInfo.color}">${srcInfo.abbr}</span>` : ''}
              ${sp.concentration==='yes'?`<span class="spell-tag conc">C</span>`:''}
              ${sp.ritual==='yes'?`<span class="spell-tag ritual">R</span>`:''}
              ${_costTag(sp)}
            </div>
            <div class="flex gap-1" style="flex-shrink:0">
              <button class="btn btn-sm" onclick="toggleSpellDesc('sd-all-${jsStr(sp.name).replace(/\s/g,'-')}')">▾</button>
              ${sp.level_int === 0
                ? (inK
                    ? `<button class="btn btn-sm btn-primary" disabled style="opacity:0.6;cursor:default">✓ Known</button>`
                    : `<button class="btn btn-sm" onclick="spellAddFromEncoded('known','${safeData}')">Learn</button>`)
                : `<button class="btn btn-sm${inP?' btn-primary':''}" onclick="spellAddFromEncoded('prepared','${safeData}')">${inP?'✓ Prep':'Prepare'}</button>
              <button class="btn btn-sm${inK?' btn-primary':''}" onclick="spellAddFromEncoded('known','${safeData}')">${inK?'✓ Known':'Learn'}</button>`}
            </div>
          </div>
          <div class="spell-desc rules-text hidden" id="sd-all-${esc(sp.name).replace(/\s/g,'-')}" style="margin:0 0 0.3rem 0.5rem;border-top:none;padding-top:0.2rem">${renderRulesText(sp.desc, _spellTextCtx(sp, ch)) || 'No description.'}</div>`;
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

function fullSpellData(sp, ch) {
  // The spell's rules come from the database (in the character's edition); the stored copy
  // contributes only its own flags (_fromFeat, _miId, free casts…), which start with "_"
  const name = typeof sp === 'object' ? sp.name : sp;
  if (typeof sp === 'object' && sp._custom && sp.desc !== undefined) return sp;
  const fromDb = _spellByName(name, ch) || (customSpells || []).find(s => s.name === name);
  if (!fromDb) return sp;
  const own = typeof sp === 'object' ? Object.fromEntries(Object.entries(sp).filter(([k]) => k.startsWith('_'))) : {};
  return { ...(typeof sp === 'object' ? sp : {}), ...fromDb, ...own };
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
  const entries = known.map((sp, i) => ({ full: fullSpellData(sp, ch), i }));
  const castsFromKnown = casterEntries(ch).some(e => e.prog.known);
  const castBtn = sp => `<button class="btn btn-sm btn-primary btn-cast" onclick="spellCastFx(this);openCastModal('${jsStr(sp.name)}',${sp.level_int || 0})">Cast</button>`;
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
              ${isObj?_costTag(sp):''}
              ${isObj&&sp._fromFeat?`<span style="font-size:0.58rem;color:#9b6dff;border:1px solid rgba(155,109,255,0.35);border-radius:3px;padding:0 3px;flex-shrink:0" title="${esc(sp._fromFeat)}">${_featBadgeAbbr(sp._fromFeat)}</span>`:''}
            </div>
            <div class="spell-card-right">
              ${isObj && (sp.level_int === 0 || castsFromKnown || inPrep || sp._fromFeat) ? castBtn(sp) : ''}
              ${isObj && sp.level_int === 0
                ? ''
                : isObj && sp._miFreeCast
                ? `<span style="font-size:0.7rem;color:#9b6dff;align-self:center;padding:0 0.3rem" title="Always available — cast free 1/LR or use a spell slot">✓ MI Spell</span>`
                : isObj && sp._sfFreeCast
                ? `<span style="font-size:0.7rem;color:#9b6dff;align-self:center;padding:0 0.3rem" title="Free cast 1/Long Rest — from ${esc(sp._fromFeat||'')}">✓ Feat Spell</span>`
                : `<button class="btn btn-sm${inPrep?' btn-primary':''}" onclick="togglePrepareFromKnown(${i})" title="${inPrep?'Remove from Prepared':'Add to Prepared'}">${inPrep?'✓ Prep':'Prepare'}</button>`}
              <button class="btn btn-sm" onclick="toggleSpellCard('${id}',this)" title="Toggle description">▾</button>
              <button class="btn btn-icon btn-danger" onclick="removeSpellEntry('known',${i})">&times;</button>
            </div>
          </div>
          ${isObj&&(sp.casting_time||sp.range||sp.components)?`<div class="spell-meta">${[sp.casting_time,sp.range,sp.components].filter(Boolean).map(esc).join(' · ')}</div>`:''}
          ${isObj?`<div class="spell-desc rules-text hidden" id="${id}">${renderRulesText(sp.desc, _spellTextCtx(sp, ch)) || 'No description available.'}</div>`:''}
        </div>`;
      }).join('')}
    </div>`).join('')}</div>`;
}

function renderPreparedView(ch) {
  const prepared = ch.spells.prepared || [];
  if (prepared.length === 0) return `<p class="spell-empty" style="padding:1rem 0">No prepared spells. Mark spells as Prepared from Known ↑ or All Spells.</p>`;
  const entries = prepared.map((sp, i) => ({ full: fullSpellData(sp, ch), i }));
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
              ${isObj?_costTag(sp):''}
            </div>
            <div class="spell-card-right">
              <button class="btn btn-sm btn-primary btn-cast" onclick="spellCastFx(this);castPreparedByIdx(${i})">Cast</button>
              <button class="btn btn-sm" onclick="toggleSpellCard('${id}',this)" title="Toggle description">▾</button>
              <button class="btn btn-icon btn-danger" onclick="removeSpellEntry('prepared',${i})">&times;</button>
            </div>
          </div>
          ${isObj&&(sp.casting_time||sp.range||sp.components)?`<div class="spell-meta">${[sp.casting_time,sp.range,sp.components].filter(Boolean).map(esc).join(' · ')}</div>`:''}
          ${isObj?`<div class="spell-desc rules-text hidden" id="${id}">${renderRulesText(sp.desc, _spellTextCtx(sp, ch)) || 'No description available.'}</div>`:''}
        </div>`;
      }).join('')}
    </div>`).join('')}</div>`;
}

function _updateCantripCountDisplay() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const _cMax = _cantripMax(ch);
  const _cCount = _cantripCount(ch);
  // Update the cantrip count in the spells section (e.g., "5 / 5")
  const countElements = document.querySelectorAll('.sheet-panel:has(.spell-tabs) > div');
  for (const el of countElements) {
    if (el.textContent.includes('Cantrips')) {
      const spans = el.querySelectorAll('span');
      for (const sp of spans) {
        if (sp.textContent.match(/\d+\s*\/\s*\d+/)) {
          sp.textContent = `${_cCount} / ${_cMax}`;
          sp.style.color = _cCount > _cMax ? 'var(--red-lt)' : 'var(--text)';
        }
      }
    }
  }
  // Update the Known tab badge
  const knownTabBtn = document.querySelector('.spell-tab[data-tab="known"]');
  if (knownTabBtn) {
    const badge = knownTabBtn.querySelector('.spell-count');
    if (badge) badge.textContent = (ch.spells.known || []).length;
  }
}

function spellAddFromEncoded(listType, encoded) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  let sp = JSON.parse(decodeURIComponent(encoded));
  // A custom spell is stored whole on the character, so it shows up on every device
  if (sp._custom) { loadCustomSpells(); const full = customSpells.find(c => c.name === sp.name); if (full) sp = { ...full, _custom: true }; }
  // Cantrip limit check — only when adding a genuinely new cantrip
  if (sp.level_int === 0) {
    const alreadyKnown = (ch.spells.known||[])
      .some(s => (typeof s==='object' ? s.name : s) === sp.name);
    if (!alreadyKnown) {
      const max = _cantripMax(ch);
      if (max !== null && _cantripCount(ch) >= max) {
        const who = casterEntries(ch).filter(e => e.prog.cantrips).map(e => `${e.cls} ${e.level}`).join(' + ') || (ch.class || 'this class');
        showToast(`Cantrip limit reached (${max} cantrips for ${who})`);
        return;
      }
    }
  }
  if (sp.level_int === 0) {
    // Cantrips: surgical update instead of full re-render
    const appEl = document.getElementById('app');
    const st = appEl ? appEl.scrollTop : 0;
    const listSt = document.querySelector('.spell-api-list')?.scrollTop || 0;

    ch.spells.known = ch.spells.known || [];
    const already = ch.spells.known.some(s => (typeof s==='object'?s.name:s) === sp.name);
    if (!already) ch.spells.known.push(sp);

    saveData(db);
    _updateCantripCountDisplay();

    // Update visible tab content synchronously
    if (spellViewTab === 'all') {
      // Re-render just the spell results (updates Learn → ✓ Known button)
      updateSpellResults();
      // .spell-api-list was replaced by updateSpellResults — restore its scroll on the new element
      const newListEl = document.querySelector('.spell-api-list');
      if (newListEl && listSt > 0) newListEl.scrollTop = listSt;
    } else if (spellViewTab === 'known') {
      const tabContentEl = document.getElementById('spell-tab-content');
      if (tabContentEl) tabContentEl.innerHTML = renderKnownView(ch);
    }

    // Restore app scroll synchronously
    if (appEl) appEl.scrollTop = st;
    return;
  }
  // Leveled spells — toggle: clicking ✓ Prep / ✓ Known removes the spell; clicking Prepare / Learn adds it
  ch.spells[listType] = ch.spells[listType] || [];
  const existIdx = ch.spells[listType].findIndex(s => (typeof s==='object'?s.name:s) === sp.name);
  if (existIdx >= 0) {
    ch.spells[listType].splice(existIdx, 1);
  } else {
    ch.spells[listType].push(sp);
    if (listType === 'prepared') {
      ch.spells.known = ch.spells.known || [];
      const inKnown = ch.spells.known.some(s => (typeof s==='object'?s.name:s) === sp.name);
      if (!inKnown) ch.spells.known.push(sp);
    }
  }
  _preserveScroll(() => { saveData(db); renderSpellTabContent(); });
}

function togglePrepareFromKnown(knownIdx) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const sp = ch.spells.known[knownIdx]; if (!sp) return;
  // Cantrips live only in known — never toggle them to prepared
  if (typeof sp === 'object' && sp.level_int === 0) return;
  const name = typeof sp==='object' ? sp.name : sp;
  ch.spells.prepared = ch.spells.prepared || [];
  const pIdx = ch.spells.prepared.findIndex(s => (typeof s==='object'?s.name:s) === name);
  if (pIdx >= 0) ch.spells.prepared.splice(pIdx, 1);
  else ch.spells.prepared.push(typeof sp==='object' ? {...sp} : sp);
  _preserveScroll(() => { saveData(db); renderSpellTabContent(); });
}

// ── Subclass Spell Lists & Special Tables (modal) ────────────────────────────
const _SUBCLASS_TERRAIN_VARIANTS = new Set(['Circle of the Land', 'Circle of the Land (2024)']);
let _subclassTerrainPick = {}; // { "Subclass": "TerrainName" }

function _getSubclassSpellLists() {
  return (typeof SUBCLASS_SPELL_LISTS !== 'undefined') ? SUBCLASS_SPELL_LISTS : {};
}
function _getSubclassTables() {
  return (typeof SUBCLASS_TABLES !== 'undefined') ? SUBCLASS_TABLES : {};
}
function _charSubclasses(ch) {
  const out = [];
  const seen = new Set();
  (ch.classes || []).forEach(c => {
    if (c.subclass && !seen.has(c.subclass)) { seen.add(c.subclass); out.push(c.subclass); }
  });
  if (ch.subclass && !seen.has(ch.subclass)) out.push(ch.subclass);
  return out;
}
function _subclassTargetList(prepareType) {
  return prepareType === 'always_prepared' ? 'prepared' : 'known';
}
function _resolveSpellByName(name) {
  return _spellByName(name);
}
function _spellListHasCI(list, name) {
  const lc = String(name).toLowerCase();
  return (list || []).some(s => String(typeof s === 'object' ? s.name : s).toLowerCase() === lc);
}
function _isTerrainSubclass(sub) {
  return _SUBCLASS_TERRAIN_VARIANTS.has(sub);
}

// Look up the spell list for a subclass, preferring the "(2024)" variant for
// 2024-edition characters (SUBCLASS_DATA stores 2024 subclasses under plain names)
function _sslDataFor(ch, sub) {
  const lists = _getSubclassSpellLists();
  if (((ch && ch.edition) || '2024') !== '2014' && lists[sub + ' (2024)']) return lists[sub + ' (2024)'];
  return lists[sub] || null;
}

// Removes the spells a subclass list adds. Matched by name because these spells were never
// tagged when stored; spells granted by a feat are kept even if the name matches.
function _removeSubclassSpells(ch, sub) {
  const data = _sslDataFor(ch, sub);
  if (!data || !ch.spells) return;
  const names = new Set();
  (function collect(v) {
    if (typeof v === 'string') names.add(v.toLowerCase());
    else if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === 'object') Object.values(v).forEach(collect);
  })(data.spells || data.levels || {});
  const keep = s => (typeof s === 'object' && (s._fromFeat || s._sfId)) ||
    !names.has(String(typeof s === 'object' ? s.name : s).toLowerCase());
  ch.spells.known = (ch.spells.known || []).filter(keep);
  ch.spells.prepared = (ch.spells.prepared || []).filter(keep);
}

function _getAlwaysPreparedNames(ch) {
  const names = new Set();
  const lists = _getSubclassSpellLists();
  _charSubclasses(ch).forEach(sub => {
    const data = _sslDataFor(ch, sub); if (!data) return;
    if ((data.prepareType || 'always_prepared') !== 'always_prepared') return;
    let spellsByLevel = data.spells || data.levels || {};
    if (_isTerrainSubclass(sub)) {
      // Terrain subclasses nest lists one level deeper: { Terrain: { lvl: [...] } }
      const picked = (ch.terrainPicks || {})[sub] || _subclassTerrainPick[sub];
      spellsByLevel = (picked && spellsByLevel[picked]) || {};
    }
    Object.entries(spellsByLevel).forEach(([lvlKey, spells]) => {
      const lvl = parseInt(lvlKey, 10);
      if (!isFinite(lvl) || ch.level < lvl) return;
      const list = Array.isArray(spells) ? spells : (Array.isArray(spells.spells) ? spells.spells : null);
      if (!list) return;
      list.forEach(name => names.add(String(name).toLowerCase()));
    });
  });
  return names;
}

function pickSubclassTerrain(subclass, terrain, charId) {
  _subclassTerrainPick[subclass] = terrain;
  const ch = charId && db.characters[charId];
  if (ch) {
    ch.terrainPicks = ch.terrainPicks || {};
    ch.terrainPicks[subclass] = terrain;
    saveData(db);
  }
  if (charId) openSubclassModal(charId);
}

function addSubclassSpellOne(charId, spellName, prepareType) {
  const ch = db.characters[charId]; if (!ch) return;
  ch.spells = ch.spells || {};
  ch.spells.known    = ch.spells.known    || [];
  ch.spells.prepared = ch.spells.prepared || [];
  const target = _subclassTargetList(prepareType);
  const sp = _resolveSpellByName(spellName) || spellName;
  if (target === 'prepared') {
    if (!_spellListHasCI(ch.spells.prepared, spellName)) ch.spells.prepared.push(sp);
    if (!_spellListHasCI(ch.spells.known, spellName))    ch.spells.known.push(sp);
  } else {
    if (!_spellListHasCI(ch.spells.known, spellName))    ch.spells.known.push(sp);
  }
  saveData(db);
  openSubclassModal(charId); // re-render modal
}

function applySubclassSpells(charId) {
  const ch = db.characters[charId]; if (!ch) return;
  const lists = _getSubclassSpellLists();
  ch.spells = ch.spells || {};
  ch.spells.known    = ch.spells.known    || [];
  ch.spells.prepared = ch.spells.prepared || [];
  _charSubclasses(ch).forEach(sub => {
    if (_isTerrainSubclass(sub)) return; // user picks manually
    const data = _sslDataFor(ch, sub); if (!data) return;
    const prepareType = data.prepareType || 'always_prepared';
    const spellsByLevel = data.spells || data.levels || {};
    Object.entries(spellsByLevel).forEach(([lvlKey, spells]) => {
      const lvl = parseInt(lvlKey, 10);
      if (!isFinite(lvl) || ch.level < lvl) return;
      const list = Array.isArray(spells) ? spells : (Array.isArray(spells.spells) ? spells.spells : null);
      if (!list) return;
      list.forEach(spName => {
        const sp = _resolveSpellByName(spName) || spName;
        if (prepareType === 'always_prepared') {
          if (!_spellListHasCI(ch.spells.prepared, spName)) ch.spells.prepared.push(sp);
          if (!_spellListHasCI(ch.spells.known, spName))    ch.spells.known.push(sp);
        } else {
          if (!_spellListHasCI(ch.spells.known, spName))    ch.spells.known.push(sp);
        }
      });
    });
  });
  saveData(db);
  openSubclassModal(charId); // re-render modal
}

function _hasSubclassData(ch) {
  const lists = _getSubclassSpellLists();
  const tables = _getSubclassTables();
  return _charSubclasses(ch).some(sub => _sslDataFor(ch, sub) || tables[sub]);
}

function _renderSubclassSpellRow(charId, ch, spellName, prepareType) {
  const inK = _spellListHasCI(ch.spells?.known    || [], spellName);
  const inP = _spellListHasCI(ch.spells?.prepared || [], spellName);
  const have = (prepareType === 'always_prepared') ? (inK && inP) : inK;
  return `<div class="subclass-spell-row" style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;padding:0.3rem 0.5rem;border-bottom:1px dashed rgba(var(--accent-rgb),0.12)">
    <span style="font-size:0.88rem">${esc(spellName)}</span>
    ${have
      ? `<span style="font-size:0.78rem;color:#4ade80;font-weight:bold">✓</span>`
      : `<button class="btn btn-sm btn-primary" onclick="addSubclassSpellOne('${charId}', '${spellName.replace(/'/g, "\\'")}', '${prepareType}')" style="font-size:0.7rem;padding:0.1rem 0.5rem">+ Add</button>`}
  </div>`;
}

function _renderSubclassSpellsSection(charId, ch, sub, data) {
  const prepareType = data.prepareType || 'always_prepared';
  const spellsByLevel = data.spells || data.levels || {};
  const isTerrain = _isTerrainSubclass(sub);
  const prepLabel = ({ always_prepared: 'Always prepared', expanded_list: 'Expanded spell list', always_known: 'Always known' })[prepareType] || prepareType;
  const noteHtml = data.note ? `<div style="font-size:0.8rem;color:var(--text-dim);margin:0.4rem 0 0.6rem;font-style:italic">${esc(data.note)}</div>` : '';

  // Terrain variant: spellsByLevel = { "Arctic": { 3: [...], 5: [...] }, ... }
  if (isTerrain) {
    const terrainNames = Object.keys(spellsByLevel);
    if (!terrainNames.length) return '';
    const picked = (ch.terrainPicks || {})[sub] || _subclassTerrainPick[sub] || terrainNames[0];
    const opts = terrainNames.map(t => `<option value="${esc(t)}"${t === picked ? ' selected' : ''}>${esc(t)}</option>`).join('');
    const terrainData = spellsByLevel[picked] || {};
    const levelEntries = Object.entries(terrainData)
      .map(([k, v]) => [parseInt(k, 10), v])
      .filter(([n]) => isFinite(n))
      .sort((a, b) => a[0] - b[0])
      .filter(([n]) => ch.level >= n);

    const groups = levelEntries.map(([lvl, spells]) => {
      const list = Array.isArray(spells) ? spells : [];
      const rows = list.map(sp => _renderSubclassSpellRow(charId, ch, sp, prepareType)).join('');
      return `<div style="margin-top:0.6rem">
        <strong style="font-size:0.85rem;color:var(--gold-lt)">Level ${lvl}</strong>
        <div style="margin-top:0.2rem">${rows}</div>
      </div>`;
    }).join('');

    return `<div class="subclass-spell-section" style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.3rem">
        <strong style="color:var(--gold);font-size:1rem">${esc(sub)}</strong>
        <span style="font-size:0.7rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">${esc(prepLabel)}</span>
      </div>
      ${noteHtml}
      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.3rem">
        <label style="font-size:0.78rem;color:var(--text-dim)">Land:</label>
        <select onchange="pickSubclassTerrain(${JSON.stringify(sub)}, this.value, ${JSON.stringify(charId)})" style="font-size:0.85rem;padding:0.15rem 0.35rem">${opts}</select>
      </div>
      ${groups || '<div style="font-size:0.78rem;color:var(--text-dim);margin-top:0.3rem">No unlocked levels yet.</div>'}
    </div>`;
  }

  // Standard subclass: spellsByLevel = { 3: [...], 5: [...] }
  const levelEntries = Object.entries(spellsByLevel)
    .map(([k, v]) => [parseInt(k, 10), v])
    .filter(([n]) => isFinite(n))
    .sort((a, b) => a[0] - b[0])
    .filter(([n]) => ch.level >= n);

  const groups = levelEntries.map(([lvl, spells]) => {
    const list = Array.isArray(spells) ? spells : (Array.isArray(spells.spells) ? spells.spells : []);
    const rows = list.map(sp => _renderSubclassSpellRow(charId, ch, sp, prepareType)).join('');
    return `<div style="margin-top:0.6rem">
      <strong style="font-size:0.85rem;color:var(--gold-lt)">Level ${lvl}</strong>
      <div style="margin-top:0.2rem">${rows}</div>
    </div>`;
  }).join('');

  const addAllBtn = `<button class="btn btn-primary" onclick="applySubclassSpells('${charId}')" style="margin-top:0.8rem;width:100%">Add all unlocked spells</button>`;

  return `<div class="subclass-spell-section" style="margin-bottom:1rem">
    <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.3rem">
      <strong style="color:var(--gold);font-size:1rem">${esc(sub)}</strong>
      <span style="font-size:0.7rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">${esc(prepLabel)}</span>
    </div>
    ${noteHtml}
    ${groups || '<div style="font-size:0.78rem;color:var(--text-dim);margin-top:0.3rem">No unlocked levels yet.</div>'}
    ${levelEntries.length ? addAllBtn : ''}
  </div>`;
}

function _renderSubclassTablesSection(sub, data) {
  const tables = Array.isArray(data) ? data : (Array.isArray(data.tables) ? data.tables : []);
  if (!tables.length) return '';

  const tablesHtml = tables.map((t, ti) => {
    const entries = t.entries || [];
    const entriesHtml = entries.map(e => {
      const txt = e.text != null ? e.text : (e.effect != null ? e.effect : '');
      return `<tr>
        <td style="min-width:60px;width:60px;padding:0.4rem 0.6rem;text-align:center;font-weight:bold;color:var(--gold);border-bottom:1px dashed rgba(var(--accent-rgb),0.15);font-family:'Georgia',serif;vertical-align:top">${esc(String(e.roll))}</td>
        <td style="padding:0.4rem 0.6rem;font-size:0.88rem;line-height:1.45;border-bottom:1px dashed rgba(var(--accent-rgb),0.15);vertical-align:top">${esc(txt)}</td>
      </tr>`;
    }).join('');
    return `<div class="subclass-table" style="margin-top:${ti === 0 ? '0.5rem' : '1.2rem'}">
      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.3rem">
        <strong style="color:var(--gold-lt);font-size:0.95rem">${esc(t.name || 'Table')}</strong>
        ${t.die ? `<span style="border:1px solid var(--border);color:var(--accent);font-size:0.7rem;padding:0.08rem 0.45rem;border-radius:99px;letter-spacing:1px">${esc(t.die)}</span>` : ''}
      </div>
      ${t.trigger ? `<div style="font-size:0.78rem;color:var(--text-dim);margin-bottom:0.4rem;font-style:italic">${esc(t.trigger)}</div>` : ''}
      <table style="width:100%;border-collapse:collapse">${entriesHtml}</table>
    </div>`;
  }).join('');

  return `<div class="subclass-tables-section" style="margin-bottom:1rem">
    <div style="margin-bottom:0.3rem"><strong style="color:var(--gold);font-size:1rem">${esc(sub)}</strong></div>
    ${tablesHtml}
  </div>`;
}

function openSubclassModal(charId) {
  const ch = db.characters[charId]; if (!ch) return;
  const lists = _getSubclassSpellLists();
  const tables = _getSubclassTables();
  const subs = _charSubclasses(ch);

  const spellsBlocks = subs.filter(sub => _sslDataFor(ch, sub))
    .map(sub => _renderSubclassSpellsSection(charId, ch, sub, _sslDataFor(ch, sub)))
    .filter(Boolean).join('');

  const tablesBlocks = subs.filter(sub => tables[sub])
    .map(sub => _renderSubclassTablesSection(sub, tables[sub]))
    .filter(Boolean).join('');

  if (!spellsBlocks && !tablesBlocks) {
    openModal(`<h2>✦ Subclass Spells &amp; Tables</h2>
      <p style="color:var(--text-dim)">No subclass spell list or special tables found for this character's subclass.</p>
      <div class="form-actions"><button class="btn" onclick="closeModal()">Close</button></div>`);
    // Widen the modal anyway
    const modalEl = document.querySelector('#modal-overlay .modal');
    if (modalEl) modalEl.style.maxWidth = '640px';
    return;
  }

  const spellsHeading = spellsBlocks ? `<h3 style="color:var(--gold-lt);font-size:1rem;margin:0.4rem 0 0.6rem;border-bottom:1px solid rgba(var(--accent-rgb),0.25);padding-bottom:0.3rem">Subclass Spells</h3>${spellsBlocks}` : '';
  const tablesHeading = tablesBlocks ? `<h3 style="color:var(--gold-lt);font-size:1rem;margin:1rem 0 0.6rem;border-bottom:1px solid rgba(var(--accent-rgb),0.25);padding-bottom:0.3rem">Special Tables</h3>${tablesBlocks}` : '';

  openModal(`<h2 style="margin-bottom:0.4rem">✦ Subclass Spells &amp; Tables</h2>
    ${spellsHeading}
    ${tablesHeading}
    <div class="form-actions" style="margin-top:1rem"><button class="btn" onclick="closeModal()">Close</button></div>`);

  // Widen the modal for this specific use
  const modalEl = document.querySelector('#modal-overlay .modal');
  if (modalEl) modalEl.style.maxWidth = '640px';
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
  const availableLevels = [];
  for (let lvl = Math.max(1, minLevel); lvl <= 9; lvl++) {
    if ((slots[lvl] || 0) > 0) availableLevels.push(lvl);
  }
  const pactCur = ch.spells.pactSlots || 0;
  const pactMax = ch.spells.pactSlotsMax || 0;
  const pactLvl = ch.spells.pactSlotLevel || 0;
  const pactAvail = pactCur > 0 && pactLvl >= minLevel;
  const ordinals = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];
  const pactOrd = ordinals[pactLvl] || `${pactLvl}th`;
  const noSlots = availableLevels.length === 0 && !pactAvail;
  const full = fullSpellData(spellName, ch) || {};
  const upcast = String(full.desc || '').split(/\n{2,}/).find(b => /^\*\*(Using a Higher-Level Spell Slot|At Higher Levels)\.\*\*/.test(b));
  const ritualHtml = full.ritual === 'yes' ? `
    <div style="border-top:1px solid var(--border);padding-top:0.6rem;margin-top:0.2rem">
      <button class="btn" onclick="confirmCastRitual('${jsStr(spellName)}')">Cast as a ritual</button>
      <span style="font-size:0.72rem;color:var(--text-dim);margin-left:0.4rem">No slot · takes 10 minutes longer</span>
    </div>` : '';
  const upcastHtml = upcast ? `<div class="rules-text" style="margin-top:0.6rem;font-size:0.76rem;color:var(--text-dim)">${renderRulesText(upcast)}</div>` : '';
  openModal(`<h2>Cast ${esc(spellName)}</h2>
    <p style="font-size:0.8rem;color:var(--text-dim);margin-bottom:0.9rem">Choose a slot level:</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:1rem">
      ${[1,2,3,4,5,6,7,8,9].map(lvl => {
        const cur = slots[lvl] || 0;
        const available = cur > 0 && lvl >= minLevel;
        return `<button class="btn${available?' btn-primary':''}" ${!available?'disabled style="opacity:0.35"':''}
          onclick="confirmCast('${jsStr(spellName)}',${lvl})">
          <div style="font-size:0.75rem">${ordinals[lvl]}</div>
          <div style="font-size:0.62rem;opacity:0.7">${cur} slot${cur!==1?'s':''}</div>
        </button>`;
      }).join('')}
    </div>
    ${pactMax > 0 ? `
      <div style="border-top:1px solid var(--border);padding-top:0.6rem;margin-top:0.2rem">
        <div style="font-size:0.7rem;color:var(--text-dim);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.05em">Pact Magic · short rest</div>
        <button class="btn${pactAvail?' btn-primary':''}" ${!pactAvail?'disabled style="opacity:0.35"':''}
          onclick="confirmCastPact('${jsStr(spellName)}')">
          <div style="font-size:0.75rem">Pact Slot (${pactOrd})</div>
          <div style="font-size:0.62rem;opacity:0.7">${pactCur}/${pactMax} remaining</div>
        </button>
        ${!pactAvail && pactCur === 0 ? `<p style="font-size:0.7rem;color:var(--text-dim);margin-top:0.25rem">No pact slots remaining</p>` : ''}
        ${!pactAvail && pactCur > 0 ? `<p style="font-size:0.7rem;color:var(--text-dim);margin-top:0.25rem">Spell level too high for pact slot (${pactOrd})</p>` : ''}
      </div>` : ''}
    ${noSlots?`<p style="color:var(--red-lt);font-size:0.82rem;margin-top:0.4rem">No spell slots available!</p>`:''}
    ${upcastHtml}
    ${ritualHtml}
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cancel</button></div>`);
}

function confirmCastPact(spellName) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if ((ch.spells.pactSlots || 0) <= 0) { showAlert('No pact slots remaining!'); return; }
  const isConc = fullSpellData(spellName, ch)?.concentration === 'yes';
  const pactLvl = ch.spells.pactSlotLevel || 1;
  const ordinals = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];
  const docast = () => {
    CharacterStore.usePactSlot(currentCharId);
    const entry = `${spellName} cast at ${ordinals[pactLvl]} level (pact)`;
    ch.sessionLog = ch.sessionLog || [];
    ch.sessionLog.unshift({ text: entry, ts: Date.now() });
    if (ch.sessionLog.length > 100) ch.sessionLog = ch.sessionLog.slice(0, 100);
    if (isConc) ch.activeConcentration = { spellName, castLevel: pactLvl };
    saveData(db);
    closeModal();
    _preserveScroll(() => renderApp());
  };
  if (isConc && ch.activeConcentration && ch.activeConcentration.spellName !== spellName) {
    showConfirm(`This will end your concentration on ${esc(ch.activeConcentration.spellName)}. Continue?`, docast);
  } else {
    docast();
  }
}

function confirmCastRitual(spellName) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const isConc = fullSpellData(spellName, ch)?.concentration === 'yes';
  const docast = () => {
    ch.sessionLog = ch.sessionLog || [];
    ch.sessionLog.unshift({ text: `${spellName} (ritual)`, ts: Date.now() });
    if (ch.sessionLog.length > 100) ch.sessionLog = ch.sessionLog.slice(0, 100);
    if (isConc) ch.activeConcentration = { spellName, castLevel: fullSpellData(spellName, ch)?.level_int || 1 };
    saveData(db);
    closeModal();
    showToast(`<strong>${esc(spellName)}</strong> cast as a ritual`);
    _preserveScroll(() => renderApp());
  };
  if (isConc && ch.activeConcentration && ch.activeConcentration.spellName !== spellName) {
    showConfirm(`This will end your concentration on ${esc(ch.activeConcentration.spellName)}. Continue?`, docast);
  } else {
    docast();
  }
}

function castCantrip(spellName) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const isConc = fullSpellData(spellName, ch)?.concentration === 'yes';
  const docast = () => {
    const appEl = document.getElementById('app');
    const st = appEl ? appEl.scrollTop : 0;

    ch.sessionLog = ch.sessionLog || [];
    ch.sessionLog.unshift({ text: `${spellName} (cantrip)`, ts: Date.now() });
    if (ch.sessionLog.length > 100) ch.sessionLog = ch.sessionLog.slice(0, 100);
    if (isConc) ch.activeConcentration = { spellName, castLevel: 0 };
    saveData(db);
    showToast(`<strong>${esc(spellName)}</strong> cast!`);

    if (isConc) {
      // Concentration change requires updating combat info + spells section
      renderCharacterSheet();
      if (appEl) appEl.scrollTop = st;
    }
  };
  if (isConc && ch.activeConcentration && ch.activeConcentration.spellName !== spellName) {
    showConfirm(`This will end your concentration on ${esc(ch.activeConcentration.spellName)}. Continue?`, docast);
  } else {
    docast();
  }
}

function confirmCast(spellName, slotLevel) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if ((ch.spells.slots[slotLevel] || 0) <= 0) { showAlert('No slots at that level!'); return; }
  // Find the spell to check concentration
  const isConc = fullSpellData(spellName, ch)?.concentration === 'yes';
  const docast = () => {
    CharacterStore.useSpellSlot(currentCharId, slotLevel);
    const ordinals = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];
    const entry = `${spellName} cast at ${ordinals[slotLevel]} level`;
    ch.sessionLog = ch.sessionLog || [];
    ch.sessionLog.unshift({ text: entry, ts: Date.now() });
    if (ch.sessionLog.length > 100) ch.sessionLog = ch.sessionLog.slice(0, 100);
    if (isConc) ch.activeConcentration = { spellName, castLevel: slotLevel };
    saveData(db);
    closeModal();
    _preserveScroll(() => renderApp()); // refresh slots, combat pill, everything
  };
  if (isConc && ch.activeConcentration && ch.activeConcentration.spellName !== spellName) {
    showConfirm(`This will end your concentration on ${esc(ch.activeConcentration.spellName)}. Continue?`, docast);
  } else {
    docast();
  }
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
  if (!name) { showAlert('Spell name required.'); return; }
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
    level: (() => { const n = parseInt(document.getElementById('csp-level')?.value) || 0;
      return n === 0 ? 'Cantrip' : `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}-level`; })(),
  };
  const oldName = editIdx != null ? customSpells[editIdx]?.name : null;
  if (editIdx != null) customSpells[editIdx] = sp; else customSpells.push(sp);
  saveCustomSpells();
  // Characters that know this spell get the edited version
  if (oldName) {
    Object.values(db.characters || {}).forEach(c => ['known', 'prepared'].forEach(list => {
      (c.spells?.[list] || []).forEach((entry, i) => {
        if (entry && typeof entry === 'object' && entry._custom && entry.name === oldName) {
          const own = Object.fromEntries(Object.entries(entry).filter(([k]) => k.startsWith('_')));
          c.spells[list][i] = { ...sp, ...own };
        }
      });
    }));
    saveData(db);
  }
  closeModal();
  renderSpellTabContent();
}

function deleteCustomSpell(idx) {
  showConfirm('Delete this custom spell?', () => {
    customSpells.splice(idx, 1);
    saveCustomSpells();
    renderSpellTabContent();
  });
}

function _cantripCount(ch) {
  return (ch.spells.known || []).filter(s => typeof s === 'object' && s.level_int === 0 && !s._fromFeat).length;
}

function _cantripMax(ch) {
  return cantripMax(ch);
}

function renderSpellsSection(ch) {
  const pb = profBonus(ch.level);
  const known    = (ch.spells.known    || []).length;
  const apNames  = _getAlwaysPreparedNames(ch);
  const prepared = (ch.spells.prepared || []).filter(sp => !apNames.has(String(typeof sp === 'object' ? sp.name : sp).toLowerCase())).length;

  const casters = casterEntries(ch);
  const isSpellcaster = casters.length > 0;
  const prepSummary = _preparedSummary(ch);
  const knownSummary = _knownSummary(ch);
  const limitText = (summary, verb) => {
    if (!summary) return '';
    const detail = summary.parts.map(p => p.how === 'formula'
      ? `${p.cls} ${p.level}: half/full level ${p.mod >= 0 ? '+' : ''}${p.mod} ${p.ability.toUpperCase()} = ${p.limit}`.replace('half/full level', p.divisor === 2 ? 'half level' : 'level')
      : `${p.cls} ${p.level}: ${p.limit}`).join(', ');
    return `${verb} up to ${summary.limit} spells (${detail})`;
  };
  const prepareLimitFormula = [limitText(prepSummary, 'Prepare'), limitText(knownSummary, 'Know')].filter(Boolean).join(' · ');

  // Item bonuses (Wand of the War Mage, Rod of the Pact Keeper…) apply to every spell DC/attack
  const bonus = { dc: parseInt(ch.spellBonus?.dc) || 0, atk: parseInt(ch.spellBonus?.atk) || 0 };
  // Feat spells (Magic Initiate, Fey Touched…) use the ability chosen for the feat
  const featAbilities = [...new Set((ch.spells.known || []).map(sp => sp && (sp._miAbility || sp._sfAbility))
    .filter(ab => ab && ABILITY_SHORT[ab]))];
  const featRows = featAbilities.filter(ab => !casters.some(e => e.prog.ability === ab)).map(ab => {
    const sMod = mod(ch.abilities[ab]);
    return `<div class="spell-stat-row">
      <div class="spell-stat-box"><div class="spell-stat-label">Feat spells</div><div class="spell-stat-val">${ABILITY_SHORT[ab]}</div></div>
      <div class="spell-stat-box"><div class="spell-stat-label">Spell Save DC</div><div class="spell-stat-val">${8 + pb + sMod + bonus.dc}</div></div>
      <div class="spell-stat-box"><div class="spell-stat-label">Spell Attack</div><div class="spell-stat-val">${(pb + sMod + bonus.atk) >= 0 ? '+' : ''}${pb + sMod + bonus.atk}</div></div>
    </div>`;
  }).join('');
  const bonusHtml = (isSpellcaster || featRows) ? `<div class="spell-bonus-row">
      <span>Item bonus</span>
      <label>DC <input type="number" id="spell-bonus-dc" value="${bonus.dc}" onchange="setSpellBonus('dc',this.value)"></label>
      <label>Attack <input type="number" id="spell-bonus-atk" value="${bonus.atk}" onchange="setSpellBonus('atk',this.value)"></label>
    </div>` : '';

  // Per-class spellcasting stat rows (one per casting ability)
  let headerStats = '';
  if (isSpellcaster) {
    const seen = new Set();
    headerStats = casters.map(e => {
      const ab = e.prog.ability;
      if (!ab || seen.has(ab)) return '';
      seen.add(ab);
      const sMod = mod(ch.abilities[ab]);
      const dc = 8 + pb + sMod + bonus.dc;
      const atk = pb + sMod + bonus.atk;
      return `<div class="spell-stat-row">
        <div class="spell-stat-box"><div class="spell-stat-label">${esc(e.cls)}</div><div class="spell-stat-val">${ABILITY_SHORT[ab]}</div></div>
        <div class="spell-stat-box"><div class="spell-stat-label">Spell Save DC</div><div class="spell-stat-val">${dc}</div></div>
        <div class="spell-stat-box"><div class="spell-stat-label">Spell Attack</div><div class="spell-stat-val">${atk>=0?'+':''}${atk}</div></div>
      </div>`;
    }).join('') + (prepareLimitFormula ? `<div style="font-size:0.7rem;color:var(--text-dim);margin-top:0.3rem">${esc(prepareLimitFormula)}</div>` : '');
  } else if (!featRows) {
    headerStats = `<p class="text-dim" style="font-size:0.82rem;margin-bottom:0.8rem">${esc(ch.class)} does not use spellcasting.</p>`;
  }
  headerStats += featRows + bonusHtml;

  // Cantrips line — shown above spell slots when the character's class has a cantrip table
  const _cMax = _cantripMax(ch);
  const _cCount = _cantripCount(ch);
  const cantripsLineHtml = isSpellcaster && _cMax !== null ? `
    <div style="display:flex;align-items:baseline;gap:0.45rem;margin-bottom:0.45rem">
      <span class="cs-field-label" style="margin-bottom:0">Cantrips</span>
      <span style="font-size:0.88rem;font-weight:bold;color:${_cCount > _cMax ? 'var(--red-lt)' : 'var(--text)'}">${_cCount} / ${_cMax}</span>
    </div>` : '';

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
    ${cantripsLineHtml}
    ${slotsHtml}
    ${pactHtml}
    <div class="spell-tabs">
      <button class="spell-tab${spellViewTab==='all'?' active':''}" data-tab="all" onclick="switchSpellTab('all')">✿ All Spells</button>
      <button class="spell-tab${spellViewTab==='known'?' active':''}" data-tab="known" onclick="switchSpellTab('known')">Known <span class="spell-count" style="${knownSummary && knownSummary.count > knownSummary.limit ? 'color:var(--red-lt)' : ''}">${knownSummary ? `${knownSummary.count}/${knownSummary.limit}` : known}</span></button>
      <button class="spell-tab${spellViewTab==='prepared'?' active':''}" data-tab="prepared" onclick="switchSpellTab('prepared')">Prepared <span class="spell-count" style="${prepSummary && prepSummary.count > prepSummary.limit ? 'color:var(--red-lt)' : ''}">${prepSummary ? `${prepSummary.count}/${prepSummary.limit}` : prepared}</span></button>
    </div>
    <div id="spell-tab-content"></div>
  </div>`;
}

function setSpellBonus(kind, value) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.spellBonus = { ...(ch.spellBonus || {}), [kind]: parseInt(value) || 0 };
  saveData(db); renderApp();
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
  const sp = (ch.spells[listType] || [])[idx];
  const isCantrip = typeof sp === 'object' && sp.level_int === 0;
  ch.spells[listType].splice(idx, 1);
  // A spell you no longer know can't stay prepared
  if (listType === 'known' && sp) {
    const name = typeof sp === 'object' ? sp.name : sp;
    ch.spells.prepared = (ch.spells.prepared || []).filter(p => (typeof p === 'object' ? p.name : p) !== name);
  }

  if (isCantrip) {
    // Surgical update for cantrip removal
    const appEl = document.getElementById('app');
    const st = appEl ? appEl.scrollTop : 0;
    const listSt = document.querySelector('.spell-api-list')?.scrollTop || 0;

    saveData(db);
    _updateCantripCountDisplay();

    // Update visible tab content synchronously
    if (spellViewTab === 'all') {
      updateSpellResults();
      const newListEl = document.querySelector('.spell-api-list');
      if (newListEl && listSt > 0) newListEl.scrollTop = listSt;
    } else if (spellViewTab === 'known') {
      const tabContentEl = document.getElementById('spell-tab-content');
      if (tabContentEl) tabContentEl.innerHTML = renderKnownView(ch);
    }

    // Restore app scroll synchronously
    if (appEl) appEl.scrollTop = st;
  } else {
    _preserveScroll(() => { saveData(db); renderSpellTabContent(); });
  }
}

function toggleSpellBubble(level, index) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const cur = ch.spells.slots[level] || 0;
  ch.spells.slots[level] = index < cur ? index : index + 1;
  saveData(db); renderApp();
  _popSpellSlot(level, index);
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
  Artificer: [
    [1, 'Magical Tinkering', '1st-level artificer feature\n\nYou\'ve learned how to invest a spark of magic into mundane objects. To use this ability, you must have thieves\' tools or artisan\'s tools in hand. You then touch a Tiny nonmagical object as an action and give it one of the following magical properties of your choice:\n\n• The object sheds bright light in a 5-foot radius and dim light for an additional 5 feet.\n• Whenever tapped by a creature, the object emits a recorded message that can be heard up to 10 feet away. You utter the message when you bestow this property on the object, and the recording can be no more than 6 seconds long.\n• The object continuously emits your choice of an odor or a nonverbal sound (wind, waves, chirping, or the like). The chosen phenomenon is perceivable up to 10 feet away.\n• A static visual effect appears on one of the object\'s surfaces. This effect can be a picture, up to 25 words of text, lines and shapes, or a mixture of these elements, as you like.\n\nThe chosen property lasts indefinitely. As an action, you can touch the object and end the property early.\n\nYou can bestow magic on multiple objects, touching one object each time you use this feature, though a single object can only bear one property at a time. The maximum number of objects you can affect with this feature at one time is equal to your Intelligence modifier (minimum of one object). If you try to exceed your maximum, the oldest property immediately ends, and then the new property applies.'],
    [1, 'Optional Rule: Firearm Proficiency', 'The secrets of creating and operating gunpowder weapons have been discovered in various corners of the D&D multiverse. If your Dungeon Master uses the rules on firearms in chapter 9 of the Dungeon Master\'s Guide and your artificer has been exposed to the operation of such weapons, your artificer is proficient with them.'],
    [1, 'Spellcasting', '1st-level artificer feature\n\nYou\'ve studied the workings of magic and how to cast spells, channeling the magic through objects. To observers, you don\'t appear to be casting spells in a conventional way; you appear to produce wonders from mundane items and outlandish inventions.\n\n**Tools Required.** You produce your artificer spell effects through your tools. You must have a spellcasting focus—specifically thieves\' tools or some kind of artisan\'s tool—in hand when you cast any spell with this Spellcasting feature (meaning the spell has an \'M\' component when you cast it). You must be proficient with the tool to use it in this way. See chapter 5, "Equipment," in the Player\'s Handbook for descriptions of these tools.\n\nAfter you gain the Infuse Item feature at 2nd level, you can also use any item bearing one of your infusions as a spellcasting focus.\n\n**The Magic of Artifice.** As an artificer, you use tools when you cast your spells. When describing your spellcasting, think about how you\'re using a tool to perform the spell effect. If you cast cure wounds using alchemist\'s supplies, you could be quickly producing a salve. If you cast it using tinker\'s tools, you might have a miniature mechanical spider that binds wounds. When you cast poison spray, you could fling foul chemicals or use a wand that spits venom. The effect of the spell is the same as for a spellcaster of any other class, but your method of spellcasting is special.\n\nThe same principle applies when you prepare your spells. As an artificer, you don\'t study a spellbook or pray to prepare your spells. Instead, you work with your tools and create the specialized items you\'ll use to produce your effects. If you replace cure wounds with heat metal, you might be altering the device you use to heal—perhaps modifying a tool so that it channels heat instead of healing energy.\n\nSuch details don\'t limit you in any way or provide you with any benefit beyond the spell\'s effects. You don\'t have to justify how you\'re using tools to cast a spell. But describing your spellcasting creatively is a fun way to distinguish yourself from other spellcasters.\n\n**Cantrips (0-Level Spells).** At 1st level, you know two cantrips of your choice from the artificer spell list. At higher levels, you learn additional artificer cantrips of your choice, as shown in the Cantrips Known column of the Artificer table.\n\nWhen you gain a level in this class, you can replace one of the artificer cantrips you know with another cantrip from the artificer spell list.\n\n**Preparing and Casting Spells.** The Artificer table shows how many spell slots you have to cast your artificer spells. To cast one of your artificer spells of 1st level or higher, you must expend a slot of the spell\'s level or higher. You regain all expended spell slots when you finish a long rest.\n\nYou prepare the list of artificer spells that are available for you to cast, choosing from the artificer spell list. When you do so, choose a number of artificer spells equal to your Intelligence modifier + half your artificer level, rounded down (minimum of one spell). The spells must be of a level for which you have spell slots.\n\nFor example, if you are a 5th-level artificer, you have four 1st-level and two 2nd-level spell slots. With an Intelligence of 14, your list of prepared spells can include four spells of 1st or 2nd level, in any combination. If you prepare the 1st-level spell cure wounds, you can cast it using a 1st-level or a 2nd-level slot. Casting the spell doesn\'t remove it from your list of prepared spells.\n\nYou can change your list of prepared spells when you finish a long rest. Preparing a new list of artificer spells requires time spent tinkering with your spellcasting focuses: at least 1 minute per spell level for each spell on your list.\n\n**Spellcasting Ability.** Intelligence is your spellcasting ability for your artificer spells; your understanding of the theory behind magic allows you to wield these spells with superior skill. You use your Intelligence whenever an artificer spell refers to your spellcasting ability. In addition, you use your Intelligence modifier when setting the saving throw DC for an artificer spell you cast and when making an attack roll with one.\n\n**Spell.**\n\n**Spell.**\n\n**Ritual Casting.** You can cast an artificer spell as a ritual if that spell has the ritual tag and you have the spell prepared.'],
    [2, 'Infuse Item', '2nd-level artificer feature\n\nYou\'ve gained the ability to imbue mundane items with certain magical infusions, turning those objects into magic items.\n\n> **Infusions Known**\n>\n> When you gain this feature, pick four artificer infusions to learn, choosing from the "Artificer Infusions" section at the end of the class\'s description. You learn additional infusions of your choice when you reach certain levels in this class, as shown in the Infusions Known column of the Artificer table.\n>\n> Whenever you gain a level in this class, you can replace one of the artificer infusions you learned with a new one.\n\n**Artificer Infusions.** Artificers have invented numerous magical infusions, extraordinary processes that rapidly create magic items. To many, artificers seem like wonderworkers, accomplishing in hours what others need weeks to complete.\n\nThe description of each of the following infusions details the type of item that can receive it, along with whether the resulting magic item requires attunement.\n\nSome infusions specify a minimum artificer level. You can\'t learn such an infusion until you are at least that level.\n\nUnless an infusion\'s description says otherwise, you can\'t learn an infusion more than once.\n\n**Infusing an Item.** Whenever you finish a long rest, you can touch a nonmagical object and imbue it with one of your artificer infusions, turning it into a magic item. An infusion works on only certain kinds of objects, as specified in the infusion\'s description. If the item requires attunement, you can attune yourself to it the instant you infuse the item. If you decide to attune to the item later, you must do so using the normal process for attunement (see "Attunement" in chapter 7 of the Dungeon Master\'s Guide).\n\nYour infusion remains in an item indefinitely, but when you die, the infusion vanishes after a number of days have passed equal to your Intelligence modifier (minimum of 1 day). The infusion also vanishes if you give up your knowledge of the infusion for another one.\n\nYou can infuse more than one nonmagical object at the end of a long rest; the maximum number of objects appears in the Infused Items column of the Artificer table. You must touch each of the objects, and each of your infusions can be in only one object at a time. Moreover, no object can bear more than one of your infusions at a time. If you try to exceed your maximum number of infusions, the oldest infusion immediately ends, and then the new infusion applies.\n\nIf an infusion ends on an item that contains other things, like a bag of holding, its contents harmlessly appear in and around its space.'],
    [3, 'Artificer Specialist', '3rd-level artificer feature\n\nChoose the type of specialist you are, each of which is detailed at the end of the class\'s description. Your choice grants you features at 5th level and again at 9th and 15th level.'],
    [3, 'The Right Tool for the Job', '3rd-level artificer feature\n\nYou\'ve learned how to produce exactly the tool you need: with thieves\' tools or artisan\'s tools in hand, you can magically create one set of artisan\'s tools in an unoccupied space within 5 feet of you. This creation requires 1 hour of uninterrupted work, which can coincide with a short or long rest. Though the product of magic, the tools are nonmagical, and they vanish when you use this feature again.'],
    [4, 'Ability Score Improvement', '4th-level artificer feature\n\nWhen you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [5, 'Artificer Specialist Feature', '5th-level artificer feature\n\nYou gain a feature granted by your Artificer Specialist choice.'],
    [6, 'Tool Expertise', '6th-level artificer feature\n\nYour proficiency bonus is now doubled for any ability check you make that uses your proficiency with a tool.'],
    [7, 'Flash of Genius', '7th-level artificer feature\n\nYou\'ve gained the ability to come up with solutions under pressure. When you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll.\n\nYou can use this feature a number of times equal to your Intelligence modifier (minimum of once). You regain all expended uses when you finish a long rest.'],
    [8, 'Ability Score Improvement', '8th-level artificer feature\n\nWhen you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [9, 'Artificer Specialist Feature', '9th-level artificer feature\n\nYou gain a feature granted by your Artificer Specialist choice.'],
    [10, 'Magic Item Adept', '10th-level artificer feature\n\nYou\'ve achieved a profound understanding of how to use and make magic items:\n\n• You can attune to up to four magic items at once.\n• If you craft a magic item with a rarity of common or uncommon, it takes you a quarter of the normal time, and it costs you half as much of the usual gold.'],
    [11, 'Spell-Storing Item', '11th-level artificer feature\n\nYou can now store a spell in an object. Whenever you finish a long rest, you can touch one simple or martial weapon or one item that you can use as a spellcasting focus, and you store a spell in it, choosing a 1st- or 2nd-level spell from the artificer spell list that requires 1 action to cast (you needn\'t have it prepared).\n\nWhile holding the object, a creature can take an action to produce the spell\'s effect from it, using your spellcasting ability modifier. If the spell requires concentration, the creature must concentrate. The spell stays in the object until it\'s been used a number of times equal to twice your Intelligence modifier (minimum of twice) or until you use this feature again to store a spell in an object.'],
    [12, 'Ability Score Improvement', '12th-level artificer feature\n\nWhen you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [14, 'Magic Item Savant', '14th-level artificer feature\n\nYour skill with magic items deepens:\n\n• You can attune to up to five magic items at once.\n• You ignore all class, race, spell, and level requirements on attuning to or using a magic item.'],
    [15, 'Artificer Specialist Feature', '15th-level artificer feature\n\nYou gain a feature granted by your Artificer Specialist choice.'],
    [16, 'Ability Score Improvement', '16th-level artificer feature\n\nWhen you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [18, 'Magic Item Master', '18th-level artificer feature\n\nYou can now attune to up to six magic items at once.'],
    [19, 'Ability Score Improvement', '19th-level artificer feature\n\nWhen you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Soul of Artifice', '20th-level artificer feature\n\nYou have developed a mystical connection to your magic items, which you can draw on for protection:\n\n• You gain a +1 bonus to all saving throws per magic item you are currently attuned to.\n• If you\'re reduced to 0 hit points but not killed outright, you can use your reaction to end one of your artificer infusions, causing you to drop to 1 hit point instead of 0.'],
  ],
  Barbarian: [
    [1, 'Rage', 'In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.\n\nWhile raging, you gain the following benefits if you aren\'t wearing heavy armor:\n\n• You have advantage on Strength checks and Strength saving throws.\n• When you make a melee weapon attack using Strength, you gain a +2 bonus to the damage roll. This bonus increases as you level.\n• You have resistance to bludgeoning, piercing, and slashing damage.\n\nIf you are able to cast spells, you can\'t cast them or concentrate on them while raging.\n\nYour rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven\'t attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.\n\nOnce you have raged the maximum number of times for your barbarian level, you must finish a long rest before you can rage again. You may rage 2 times at 1st level, 3 at 3rd, 4 at 6th, 5 at 12th, and 6 at 17th.'],
    [1, 'Unarmored Defense', 'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.'],
    [2, 'Danger Sense', 'At 2nd level, you gain an uncanny sense of when things nearby aren\'t as they should be, giving you an edge when you dodge away from danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can\'t be blinded, deafened, or incapacitated.'],
    [2, 'Reckless Attack', 'Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.'],
    [3, 'Primal Path', 'At 3rd level, you choose a path that shapes the nature of your rage from the list of available paths. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [5, 'Extra Attack', 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.'],
    [5, 'Fast Movement', 'Starting at 5th level, your speed increases by 10 feet while you aren\'t wearing heavy armor.'],
    [6, 'Path Feature', 'At 6th level, you gain a feature from your Primal Path.'],
    [7, 'Feral Instinct', 'By 7th level, your instincts are so honed that you have advantage on initiative rolls.\n\nAdditionally, if you are surprised at the beginning of combat and aren\'t incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [9, 'Brutal Critical (1 die)', 'Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.\n\nThis increases to two additional dice at 13th level and three additional dice at 17th level.'],
    [10, 'Path feature', 'At 10th level, you gain a feature from your Primal Path.'],
    [11, 'Relentless Rage', 'Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you\'re raging and don\'t die outright, you can make a 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.\n\nEach time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [13, 'Brutal Critical (2 dice)', 'At 13th level, you can roll two additional weapon damage dice when determining the extra damage for a critical hit with a melee attack.\n\nThis increases to three additional dice at 17th level.'],
    [14, 'Path feature', 'At 14th level, you gain a feature from your Primal Path.'],
    [15, 'Persistent Rage', 'Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [17, 'Brutal Critical (3 dice)', 'At 17th level, you can roll three additional weapon damage dice when determining the extra damage for a critical hit with a melee attack.'],
    [18, 'Indomitable Might', 'Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Primal Champion', 'At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.'],
  ],
  Bard: [
    [1, 'Bardic Inspiration', 'You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.\n\nOnce within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.\n\nYou can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest.\n\nYour Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.'],
    [1, 'Spellcasting', 'You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. Your spells are part of your vast repertoire, magic that you can tune to different situations. See chapter 10 for the general rules of spellcasting and chapter 11 for the bard spell list.\n\n**Cantrips.** You know two cantrips of your choice from the bard spell list. You learn additional bard cantrips of your choice at higher levels, learning a 3rd cantrip at 4th level and a 4th at 10th level.\n\n**Spell Slots.** The Bard table shows how many spell slots you have to cast your bard spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell\'s level or higher. You regain all expended spell slots when you finish a long rest.\n\nFor example, if you know the 1st-level spell cure wounds and have a 1st-level and a 2nd-level spell slot available, you can cast cure wounds using either slot.\n\n**Spells Known of 1st Level and Higher.** You know four 1st-level spells of your choice from the bard spell list.\n\nYou learn an additional bard spell of your choice at each level except 12th, 16th, 19th, and 20th. Each of these spells must be of a level for which you have spell slots. For instance, when you reach 3rd level in this class, you can learn one new spell of 1st or 2nd level.\n\nAdditionally, when you gain a level in this class, you can choose one of the bard spells you know and replace it with another spell from the bard spell list, which also must be of a level for which you have spell slots.\n\n**Spellcasting Ability.** Charisma is your spellcasting ability for your bard spells. Your magic comes from the heart and soul you pour into the performance of your music or oration. You use your Charisma whenever a spell refers to your spellcasting ability. In addition, you use your Charisma modifier when setting the saving throw DC for a bard spell you cast and when making an attack roll with one.\n\n**Spell.**\n\n**Spell.**\n\n**Ritual Casting.** You can cast any bard spell you know as a ritual if that spell has the ritual tag.\n\n**Spellcasting Focus.** You can use a musical instrument as a spellcasting focus for your bard spells.'],
    [2, 'Jack of All Trades', 'Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn\'t already include your proficiency bonus.'],
    [2, 'Song of Rest (d6)', 'Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points by spending Hit Dice at the end of the short rest, each of those creatures regains an extra 1d6 hit points.\n\nThe extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level.'],
    [3, 'Bard College', 'At 3rd level, you delve into the advanced techniques of a bard college of your choice from the list of available colleges. Your choice grants you features at 3rd level and again at 6th and 14th level.'],
    [3, 'Expertise', 'At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.\n\nAt 10th level, you can choose another two skill proficiencies to gain this benefit.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [5, 'Bardic Inspiration (d8)', 'At 5th level, your Bardic Inspiration die changes to a d8.'],
    [5, 'Font of Inspiration', 'Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.'],
    [6, 'Bard College feature', 'At 6th level, you gain a feature from your Bard College.'],
    [6, 'Countercharm', 'At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required).'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [9, 'Song of Rest (d8)', 'At 9th level, the extra hit points gained from Song of Rest increases to 1d8.'],
    [10, 'Bardic Inspiration (d10)', 'At 10th level, your Bardic Inspiration die changes to a d10.'],
    [10, 'Expertise', 'At 10th level, you can choose another two skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.'],
    [10, 'Magical Secrets', 'By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any classes, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.\n\nThe chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table.\n\nYou learn two additional spells from any classes at 14th level and again at 18th level.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [13, 'Song of Rest (d10)', 'At 13th level, the extra hit points gained from Song of Rest increases to 1d10.'],
    [14, 'Bard College feature', 'At 14th level, you gain a feature from your Bard College.'],
    [14, 'Magical Secrets', 'At 14th level, choose two additional spells from any classes, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.\n\nThe chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table.'],
    [15, 'Bardic Inspiration (d12)', 'At 15th level, your Bardic Inspiration die changes to a d12.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [17, 'Song of Rest (d12)', 'At 17th level, the extra hit points gained from Song of Rest increases to 1d12.'],
    [18, 'Magical Secrets', 'At 18th level, choose two additional spells from any class, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.\n\nThe chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Superior Inspiration', 'At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.'],
  ],
  Cleric: [
    [1, 'Divine Domain', 'Choose one domain related to your deity from the list of available domains. Each domain is detailed in their own feature, and each one provides examples of gods associated with it. Your choice grants you domain spells and other features when you choose it at 1st level. It also grants you additional ways to use Channel Divinity when you gain that feature at 2nd level, and additional benefits at 6th, 8th, and 17th levels.\n\n**Domain Spells.** Each domain has a list of spells—its domain spells—that you gain at the cleric levels noted in the domain description. Once you gain a domain spell, you always have it prepared, and it doesn\'t count against the number of spells you can prepare each day.\n\nIf you have a domain spell that doesn\'t appear on the cleric spell list, the spell is nonetheless a cleric spell for you.'],
    [1, 'Spellcasting', 'As a conduit for divine power, you can cast cleric spells. See chapter 10 for the general rules of spellcasting and chapter 11 for a selection of cleric spells.\n\n**Cantrips.** At 1st level, you know three cantrips of your choice from the cleric spell list. You learn additional cleric cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Cleric table.\n\n**Preparing and Casting Spells.** The Cleric table shows how many spell slots you have to cast your cleric spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell\'s level or higher. You regain all expended spell slots when you finish a long rest.\n\nYou prepare the list of cleric spells that are available for you to cast, choosing from the cleric spell list. When you do so, choose a number of cleric spells equal to your Wisdom modifier + your cleric level (minimum of one spell). The spells must be of a level for which you have spell slots.\n\nFor example, if you are a 3rd-level cleric, you have four 1st-level and two 2nd-level spell slots. With a Wisdom of 16, your list of prepared spells can include six spells of 1st or 2nd level, in any combination. If you prepare the 1st-level spell cure wounds, you can cast it using a 1st-level or 2nd-level slot. Casting the spell doesn\'t remove it from your list of prepared spells.\n\nYou can change your list of prepared spells when you finish a long rest. Preparing a new list of cleric spells requires time spent in prayer and meditation: at least 1 minute per spell level for each spell on your list.\n\n**Spellcasting Ability.** Wisdom is your spellcasting ability for your cleric spells. The power of your spells comes from your devotion to your deity. You use your Wisdom whenever a cleric spell refers to your spellcasting ability. In addition, you use your Wisdom modifier when setting the saving throw DC for a cleric spell you cast and when making an attack roll with one.\n\n**Spell.**\n\n**Spell.**\n\n**Ritual Casting.** You can cast a cleric spell as a ritual if that spell has the ritual tag and you have the spell prepared.\n\n**Spellcasting Focus.** You can use a holy symbol as a spellcasting focus for your cleric spells.'],
    [2, 'Channel Divinity', 'At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with two such effects: Turn Undead and an effect determined by your domain. Some domains grant you additional effects as you advance in levels, as noted in the domain description.\n\nWhen you use your Channel Divinity, you choose which effect to create. You must then finish a short or long rest to use your Channel Divinity again.\n\nSome Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your cleric spell save DC.\n\nBeginning at 6th level, you can use your Channel Divinity twice between rests, and beginning at 18th level, you can use it three times between rests. When you finish a short or long rest, you regain your expended uses.\n\n> **Channel Divinity: Turn Undead**\n>\n> As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.\n>\n> A turned creature must spend its turns trying to move as far away from you as it can, and it can\'t willingly move to a space within 30 feet of you. It also can\'t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there\'s nowhere to move, the creature can use the Dodge action.'],
    [2, 'Divine Domain feature', 'At 2nd level, you gain a feature from your Divine Domain.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [5, 'Destroy Undead (CR 1/2)', 'Starting at 5th level, when an undead of CR 1/2 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.'],
    [6, 'Channel Divinity', 'Beginning at 6th level, you can use your Channel Divinity twice between rests.'],
    [6, 'Divine Domain feature', 'At 6th level, you gain a feature from your Divine Domain.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [8, 'Destroy Undead (CR 1)', 'Starting at 8th level, when an undead of CR 1 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.'],
    [8, 'Divine Domain feature', 'At 8th level, you gain a feature from your Divine Domain.'],
    [10, 'Divine Intervention', 'Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great.\n\nImploring your deity\'s aid requires you to use your action. Describe the assistance you seek, and roll percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes. The DM chooses the nature of the intervention; the effect of any cleric spell or cleric domain spell would be appropriate. If your deity intervenes, you can\'t use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest.\n\nAt 20th level, your call for intervention succeeds automatically, no roll required.'],
    [11, 'Destroy Undead (CR 2)', 'Starting at 11th level, when an undead of CR 2 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [14, 'Destroy Undead (CR 3)', 'Starting at 14th level, when an undead of CR 3 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [17, 'Destroy Undead (CR 4)', 'Starting at 17th level, when an undead of CR 4 or lower fails its saving throw against your Turn Undead feature, the creature is instantly destroyed.'],
    [17, 'Divine Domain feature', 'At 17th level, you gain a feature from your Divine Domain.'],
    [18, 'Channel Divinity', 'Beginning at 18th level, you can use your Channel Divinity three times between rests.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Divine Intervention Improvement', 'At 20th level, your call for intervention succeeds automatically, no roll required.'],
  ],
  Druid: [
    [1, 'Druidic', 'You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message\'s presence with a successful 15 Wisdom (Perception) check but can\'t decipher it without magic.'],
    [1, 'Spellcasting', 'Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will. See chapter 10 for the general rules of spellcasting and chapter 11 for the druid spell list.\n\n**Cantrips.** At 1st level, you know two cantrips of your choice from the druid spell list. You learn additional druid cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Druid table.\n\n**Preparing and Casting Spells.** The Druid table shows how many spell slots you have to cast your druid spells of 1st level and higher. To cast one of these druid spells, you must expend a slot of the spell\'s level or higher. You regain all expended spell slots when you finish a long rest.\n\nYou prepare the list of druid spells that are available for you to cast, choosing from the druid spell list. When you do so, choose a number of druid spells equal to your Wisdom modifier + your druid level (minimum of one spell). The spells must be of a level for which you have spell slots.\n\nFor example, if you are a 3rd-level druid, you have four 1st-level and two 2nd-level spell slots. With a Wisdom of 16, your list of prepared spells can include six spells of 1st or 2nd level, in any combination. If you prepare the 1st-level spell cure wounds, you can cast it using a 1st-level or 2nd-level slot. Casting the spell doesn\'t remove it from your list of prepared spells.\n\nYou can also change your list of prepared spells when you finish a long rest. Preparing a new list of druid spells requires time spent in prayer and meditation: at least 1 minute per spell level for each spell on your list.\n\n**Spellcasting Ability.** Wisdom is your spellcasting ability for your druid spells, since your magic draws upon your devotion and attunement to nature. You use your Wisdom whenever a spell refers to your spellcasting ability. In addition, you use your Wisdom modifier when setting the saving throw DC for a druid spell you cast and when making an attack roll with one.\n\n**Spell.**\n\n**Spell.**\n\n**Ritual Casting.** You can cast a druid spell as a ritual if that spell has the ritual tag and you have the spell prepared.\n\n**Spellcasting Focus.** You can use a druidic focus as a spellcasting focus for your druid spells.'],
    [2, 'Druid Circle', 'At 2nd level, you choose to identify with a circle of druids from the list of available circles. Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level.'],
    [2, 'Wild Shape', 'Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.\n\nYour druid level determines the beasts you can transform into, as shown in the Beast Shapes table. At 2nd level, for example, you can transform into any beast that has a challenge rating of 1/4 or lower that doesn\'t have a flying or swimming speed.\n\nTable: Beast Shapes\n| Level | Max. CR | Limitations | Example |\n| 2nd | 1/4 | No flying or swimming speed | Wolf |\n| 4th | 1/2 | No flying speed | Crocodile |\n| 8th | 1 | — | Giant eagle |\n\nYou can stay in a beast shape for a number of hours equal to half your druid level (rounded down). You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.\n\nWhile you are transformed, the following rules apply:\n\n• Your game statistics are replaced by the statistics of the beast, but you retain your alignment, personality, and Intelligence, Wisdom, and Charisma scores. You also retain all of your skill and saving throw proficiencies, in addition to gaining those of the creature. If the creature has the same proficiency as you and the bonus in its stat block is higher than yours, use the creature\'s bonus instead of yours. If the creature has any legendary or lair actions, you can\'t use them.\n• When you transform, you assume the beast\'s hit points and Hit Dice. When you revert to your normal form, you return to the number of hit points you had before you transformed. However, if you revert as a result of dropping to 0 hit points, any excess damage carries over to your normal form. For example, if you take 10 damage in animal form and have only 1 hit point left, you revert and take 9 damage. As long as the excess damage doesn\'t reduce your normal form to 0 hit points, you aren\'t knocked unconscious.\n• You can\'t cast spells, and your ability to speak or take any action that requires hands is limited to the capabilities of your beast form. Transforming doesn\'t break your concentration on a spell you\'ve already cast, however, or prevent you from taking actions that are part of a spell, such as call lightning, that you\'ve already cast.\n• You retain the benefit of any features from your class, race, or other source and can use them if the new form is physically capable of doing so. However, you can\'t use any of your special senses, such as darkvision, unless your new form also has that sense.\n• You choose whether your equipment falls to the ground in your space, merges into your new form, or is worn by it. Worn equipment functions as normal, but the DM decides whether it is practical for the new form to wear a piece of equipment, based on the creature\'s shape and size. Your equipment doesn\'t change size or shape to match the new form, and any equipment that the new form can\'t wear must either fall to the ground or merge with it. Equipment that merges with the form has no effect until you leave the form.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [4, 'Wild Shape Improvement', 'At 4th level, your Wild Shape improves as shown on the Beast Shapes table.'],
    [6, 'Druid Circle feature', 'At 6th level, you gain a feature granted by your Druid Circle.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [8, 'Wild Shape Improvement', 'At 8th level, your Wild Shape improves as shown on the Beast Shapes table.'],
    [10, 'Druid Circle feature', 'At 10th level, you gain a feature granted by your Druid Circle feature.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [14, 'Druid Circle feature', 'At 14th level, you gain a feature granted by your Druid Circle feature.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [18, 'Beast Spells', 'Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren\'t able to provide material components.'],
    [18, 'Timeless Body', 'Starting at 18th level, the primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Archdruid', 'At 20th level, you can use your Wild Shape an unlimited number of times.\n\nAdditionally, you can ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren\'t consumed by a spell. You gain this benefit in both your normal shape and your beast shape from Wild Shape.'],
  ],
  Fighter: [
    [1, 'Fighting Style', 'You adopt a particular style of fighting as your specialty. Choose one of the following options. You can\'t take the same Fighting Style option more than once, even if you get to choose again.'],
    [1, 'Second Wind', 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.\n\nOnce you use this feature, you must finish a short or long rest before you can use it again.'],
    [2, 'Action Surge', 'Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.\n\nOnce you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.'],
    [3, 'Martial Archetype', 'At 3rd level, you choose an archetype from the list available that you strive to emulate in your combat styles and techniques. The archetype you choose grants you features at 3rd level and again at 7th, 10th, 15th, and 18th level.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [5, 'Extra Attack', 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.\n\nThe number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.'],
    [6, 'Ability Score Improvement', 'When you reach 6th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [7, 'Martial Archetype feature', 'At 7th level, you gain a feature granted by your Martial Archetype.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [9, 'Indomitable', 'Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can\'t use this feature again until you finish a long rest.\n\nYou can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.'],
    [10, 'Martial Archetype feature', 'At 10th level, you gain a feature granted by your Martial Archetype.'],
    [11, 'Extra Attack (2)', 'At 11th level, you can attack three times whenever you take the Attack action on your turn.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [13, 'Indomitable (two uses)', 'At 13th level, you can use Indomitable twice between long rests.'],
    [14, 'Ability Score Improvement', 'When you reach 14th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [15, 'Martial Archetype feature', 'At 15th level, you gain a feature granted by your Martial Archetype.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [17, 'Action Surge (two uses)', 'At 17th level, you can use Action Surge twice before a rest, but only once on the same turn.'],
    [17, 'Indomitable (three uses)', 'At 17th level, you can use Indomitable three times between long rests.'],
    [18, 'Martial Archetype feature', 'At 18th level, you gain a feature granted by your Martial Archetype.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Extra Attack (3)', 'At 20th level, you can attack four times whenever you take the Attack action on your turn.'],
  ],
  Monk: [
    [1, 'Martial Arts', 'Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don\'t have the two-handed or heavy property.\n\nYou gain the following benefits while you are unarmed or wielding only monk weapons and you aren\'t wearing armor or wielding a shield.\n\n• You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.\n• You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table.\n• When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven\'t already taken a bonus action this turn.\n\nCertain monasteries use specialized forms of the monk weapons. For example, you might use a club that is two lengths of wood connected by a short chain (called a nunchaku) or a sickle with a shorter, straighter blade (called a kama).'],
    [1, 'Unarmored Defense', 'Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.'],
    [2, 'Ki', 'Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points. Your monk level determines the number of points you have, as shown in the Ki Points column of the Monk table.\n\nYou can spend these points to fuel various ki features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind. You learn more ki features as you gain levels in this class.\n\nWhen you spend a ki point, it is unavailable until you finish a short or long rest, at the end of which you draw all of your expended ki back into yourself. You must spend at least 30 minutes of the rest meditating to regain your ki points.\n\nSome of your ki features require your target to make a saving throw to resist the feature\'s effects. The saving throw DC is calculated as follows:\n\n**Ki.**\n\n> **Flurry of Blows**\n>\n> Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action.\n\n> **Patient Defense**\n>\n> You can spend 1 ki point to take the Dodge action as a bonus action on your turn.\n\n> **Step of the Wind**\n>\n> You can spend 1 ki point to take the Disengage or Dash action as a bonus action on your turn, and your jump distance is doubled for the turn.'],
    [2, 'Unarmored Movement', 'Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain monk levels, as shown in the Monk table.\n\nAt 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.'],
    [3, 'Deflect Missiles', 'Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level.\n\nIf you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack (range 20/60 feet) with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the attack.'],
    [3, 'Monastic Tradition', 'When you reach 3rd level, you commit yourself to a monastic tradition, chosen from the list of available traditions. Your tradition grants you features at 3rd level and again at 6th, 11th, and 17th level.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [4, 'Slow Fall', 'Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.'],
    [5, 'Extra Attack', 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.'],
    [5, 'Stunning Strike', 'Starting at 5th level, you can interfere with the flow of ki in an opponent\'s body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.'],
    [6, 'Ki-Empowered Strikes', 'Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.'],
    [6, 'Monastic Tradition feature', 'At 6th level, you gain one feature granted by your Monastic Tradition.'],
    [7, 'Evasion', 'At 7th level, your instinctive agility lets you dodge out of the way of certain area effects, such as a blue dragon\'s lightning breath or a fireball spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.'],
    [7, 'Stillness of Mind', 'Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [9, 'Unarmored Movement improvement', 'At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.'],
    [10, 'Purity of Body', 'At 10th level, your mastery of the ki flowing through you makes you immune to disease and poison.'],
    [11, 'Monastic Tradition feature', 'At 11th level, you gain one feature granted by your Monastic Tradition.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [13, 'Tongue of the Sun and Moon', 'Starting at 13th level, you learn to touch the ki of other minds so that you understand all spoken languages. Moreover, any creature that can understand a language can understand what you say.'],
    [14, 'Diamond Soul', 'Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws.\n\nAdditionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.'],
    [15, 'Timeless Body', 'At 15th level, your ki sustains you so that you suffer none of the frailty of old age, and you can\'t be aged magically. You can still die of old age, however. In addition, you no longer need food or water.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [17, 'Monastic Tradition feature', 'At 17th level, you gain one feature granted by your Monastic Tradition.'],
    [18, 'Empty Body', 'Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.\n\nAdditionally, you can spend 8 ki points to cast the astral projection spell, without needing material components. When you do so, you can\'t take any other creatures with you.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Perfect Self', 'At 20th level, when you roll for initiative and have no ki points remaining, you regain 4 ki points.'],
  ],
  Paladin: [
    [1, 'Divine Sense', 'The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind Cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity (the vampire Count Strahd von Zarovich, for instance). Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the hallow spell.\n\nYou can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses.'],
    [1, 'Lay on Hands', 'Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5.\n\nAs an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.\n\nAlternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.\n\nThis feature has no effect on undead and constructs.'],
    [2, 'Divine Smite', 'Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon\'s damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend, to a maximum of 6d8.'],
    [2, 'Fighting Style', 'At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. You can\'t take the same Fighting Style option more than once, even if you get to choose again.'],
    [2, 'Spellcasting', 'By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does. See chapter 10 for the general rules of spellcasting and chapter 11 for the paladin spell list.\n\n**Preparing and Casting Spells.** The Paladin table shows how many spell slots you have to cast your paladin spells. To cast one of your paladin spells of 1st level or higher, you must expend a slot of the spell\'s level or higher. You regain all expended spell slots when you finish a long rest.\n\nYou prepare the list of paladin spells that are available for you to cast, choosing from the paladin spell list. When you do so, choose a number of paladin spells equal to your Charisma modifier + half your paladin level, rounded down (minimum of one spell). The spells must be of a level for which you have spell slots.\n\nFor example, if you are a 5th-level paladin, you have four 1st-level and two 2nd-level spell slots. With a Charisma of 14, your list of prepared spells can include four spells of 1st or 2nd-level, in any combination. If you prepare the 1st-level spell cure wounds, you can cast it using a 1st-level or a 2nd-level slot. Casting the spell doesn\'t remove it from your list of prepared spells.\n\nYou can change your list of prepared spells when you finish a long rest. Preparing a new list of paladin spells requires time spent in prayer and meditation: at least 1 minute per spell level for each spell on your list.\n\n**Spellcasting Ability.** Charisma is your spellcasting ability for your paladin spells, since their power derives from the strength of your convictions. You use your Charisma whenever a spell refers to your spellcasting ability. In addition, you use your Charisma modifier when setting the saving throw DC for a paladin spell you cast and when making an attack roll with one.\n\n**Spell.**\n\n**Spell.**\n\n**Spellcasting Focus.** You can use a holy symbol as a spellcasting focus for your paladin spells.'],
    [3, 'Divine Health', 'By 3rd level, the divine magic flowing through you makes you immune to disease.'],
    [3, 'Sacred Oath', 'When you reach 3rd level, you swear the oath that binds you as a paladin forever. Up to this time you have been in a preparatory stage, committed to the path but not yet sworn to it. Now you choose from the list of available oaths.\n\nYour choice grants you features at 3rd level and again at 7th, 15th, and 20th level. Those features include oath spells and the Channel Divinity feature.\n\n**Oath Spells.** Each oath has a list of associated spells. You gain access to these spells at the levels specified in the oath description. Once you gain access to an oath spell, you always have it prepared. Oath spells don\'t count against the number of spells you can prepare each day.\n\nIf you gain an oath spell that doesn\'t appear on the paladin spell list, the spell is nonetheless a paladin spell for you.\n\n> **Channel Divinity**\n>\n> Your oath allows you to channel divine energy to fuel magical effects. Each Channel Divinity option provided by your oath explains how to use it.\n>\n> When you use your Channel Divinity, you choose which option to use. You must then finish a short or long rest to use your Channel Divinity again.\n>\n> Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your paladin spell save DC.\n\n**Breaking Your Oath.** A paladin tries to hold to the highest standards of conduct, but even the most virtuous paladin is fallible. Sometimes the right path proves too demanding, sometimes a situation calls for the lesser of two evils, and sometimes the heat of emotion causes a paladin to transgress his or her oath.\n\nA paladin who has broken a vow typically seeks absolution from a cleric who shares his or her faith or from another paladin of the same order. The paladin might spend an all-night vigil in prayer as a sign of penitence, or undertake a fast or similar act of self-denial. After a rite of confession and forgiveness, the paladin starts fresh.\n\nIf a paladin willfully violates his or her oath and shows no sign of repentance, the consequences can be more serious. At the DM\'s discretion, an impenitent paladin might be forced to abandon this class and adopt another, or perhaps to take the Oathbreaker paladin option that appears in the Dungeon Master\'s Guide.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [5, 'Extra Attack', 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.'],
    [6, 'Aura of Protection', 'Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.\n\nAt 18th level, the range of this aura increases to 30 feet.'],
    [7, 'Sacred Oath feature', 'At 7th level, you gain a feature granted to you by your Sacred Oath.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [10, 'Aura of Courage', 'Starting at 10th level, you and friendly creatures within 10 feet of you can\'t be frightened while you are conscious.\n\nAt 18th level, the range of this aura increases to 30 feet.'],
    [11, 'Improved Divine Smite', 'By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [14, 'Cleansing Touch', 'Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.\n\nYou can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain expended uses when you finish a long rest.'],
    [15, 'Sacred Oath feature', 'At 15th level, you gain a feature granted to you by your Sacred Oath.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [18, 'Aura improvements', 'At 18th level, the range of your Aura of Protection increases to 30 feet.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Sacred Oath feature', 'At 20th level, you gain a feature granted to you by your Sacred Oath.'],
  ],
  Ranger: [
    [1, 'Favored Enemy', 'Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.\n\nChoose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.\n\nYou have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.\n\nWhen you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.\n\nYou choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures.'],
    [1, 'Natural Explorer', 'You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, swamp, or the Underdark. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you\'re proficient in.\n\nWhile traveling for an hour or more in your favored terrain, you gain the following benefits:\n\n• Difficult terrain doesn\'t slow your group\'s travel.\n• Your group can\'t become lost except by magical means.\n• Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.\n• If you are traveling alone, you can move stealthily at a normal pace.\n• When you forage, you find twice as much food as you normally would.\n• While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.\n\nYou choose additional favored terrain types at 6th and 10th level.'],
    [2, 'Fighting Style', 'At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. You can\'t take a Fighting Style option more than once, even if you later get to choose again.'],
    [2, 'Spellcasting', 'By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does. See chapter 10 for the general rules of spellcasting and chapter 11 for the ranger spell list.\n\n**Spell Slots.** The Ranger table shows how many spell slots you have to cast your ranger spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell\'s level or higher. You regain all expended spell slots when you finish a long rest.\n\nFor example, if you know the 1st-level spell animal friendship and have a 1st-level and a 2nd-level spell slot available, you can cast animal friendship using either slot.\n\n**Spells Known of 1st Level and Higher.** You know two 1st-level spells of your choice from the ranger spell list.\n\nThe Spells Known column of the Ranger table shows when you learn more ranger spells of your choice. Each of these spells must be of a level for which you have spell slots. For instance, when you reach 5th level in this class, you can learn one new spell of 1st or 2nd level.\n\nAdditionally, when you gain a level in this class, you can choose one of the ranger spells you know and replace it with another spell from the ranger spell list, which also must be of a level for which you have spell slots.\n\n**Spellcasting Ability.** Wisdom is your spellcasting ability for your ranger spells, since your magic draws on your attunement to nature. You use your Wisdom whenever a spell refers to your spellcasting ability. In addition, you use your Wisdom modifier when setting the saving throw DC for a ranger spell you cast and when making an attack roll with one.\n\n**Spell.**\n\n**Spell.**'],
    [3, 'Primeval Awareness', 'Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn\'t reveal the creatures\' location or number.'],
    [3, 'Ranger Archetype', 'At 3rd level, you choose an archetype that you strive to emulate from the list of available archetypes. Your choice grants features at 3rd level, and again at 7th, 11th, and 15th level.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [5, 'Extra Attack', 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.'],
    [6, 'Favored Enemy and Natural Explorer improvements', 'At 6th level, you gain an additional favored terrain.\n\nAt 6th level, you choose one additional favored enemy, as well as an associated language. Your choice should reflect the types of monsters you have encountered on your adventures.'],
    [7, 'Ranger Archetype feature', 'At 7th level, you gain a feature granted to you by your Ranger Archetype.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [8, 'Land\'s Stride', 'Starting at 8th level, moving through nonmagical 3 costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.\n\nIn addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the entangle spell.'],
    [10, 'Hide in Plain Sight', 'Starting at 10th level, you can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage.\n\nOnce you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Dexterity (Stealth) checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit.'],
    [10, 'Natural Explorer improvement', 'You gain an additional favored terrain.'],
    [11, 'Ranger Archetype feature', 'At 11th level, you gain a feature granted to you by your Ranger Archetype.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [14, 'Favored Enemy improvement', 'At 14th level, you choose one additional favored enemy, as well as an associated language. Your choice should reflect the types of monsters you have encountered on your adventures.'],
    [14, 'Vanish', 'Starting at 14th level, you can use the Hide action as a bonus action on your turn. Also, you can\'t be tracked by nonmagical means, unless you choose to leave a trail.'],
    [15, 'Ranger Archetype feature', 'At 15th level, you gain a feature granted to you by your Ranger Archetype.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [18, 'Feral Senses', 'At 18th level, you gain preternatural senses that help you fight creatures you can\'t see. When you attack a creature you can\'t see, your inability to see it doesn\'t impose disadvantage on your attack rolls against it. You are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn\'t hidden from you and you aren\'t blinded or deafened.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Foe Slayer', 'At 20th level, you become an unparalleled hunter of your enemies. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied.'],
  ],
  Rogue: [
    [1, 'Expertise', 'At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.\n\nAt 6th level, you can choose two more of your proficiencies (in skills or with thieves\' tools) to gain this benefit.'],
    [1, 'Sneak Attack', 'Beginning at 1st level, you know how to strike subtly and exploit a foe\'s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.\n\nYou don\'t need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn\'t incapacitated, and you don\'t have disadvantage on the attack roll.\n\nThe amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.'],
    [1, 'Thieves\' Cant', 'During your rogue training you learned thieves\' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves\' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.\n\nIn addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves\' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.'],
    [2, 'Cunning Action', 'Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.'],
    [3, 'Roguish Archetype', 'At 3rd level, you choose an archetype that you emulate in the exercise of your rogue abilities from the list of available archetypes. Your archetype choice grants you features at 3rd level and then again at 9th, 13th, and 17th level.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [5, 'Uncanny Dodge', 'Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.'],
    [6, 'Expertise', 'At 6th level, you can choose two more of your proficiencies (in skills or with thieves\' tools) to gain the benefit of Expertise.'],
    [7, 'Evasion', 'Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon\'s fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [9, 'Roguish Archetype feature', 'At 9th level, you gain a feature granted by your Roguish Archetype.'],
    [10, 'Ability Score Improvement', 'When you reach 10th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [11, 'Reliable Talent', 'By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [13, 'Roguish Archetype feature', 'At 13th level, you gain a feature granted by your Roguish Archetype.'],
    [14, 'Blindsense', 'Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.'],
    [15, 'Slippery Mind', 'By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [17, 'Roguish Archetype feature', 'At 17th level, you gain a feature granted by your Roguish Archetype.'],
    [18, 'Elusive', 'Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren\'t incapacitated.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Stroke of Luck', 'At 20th level, you have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.\n\nOnce you use this feature, you can\'t use it again until you finish a short or long rest.'],
  ],
  Sorcerer: [
    [1, 'Sorcerous Origin', 'Choose a sorcerous origin, which describes the source of your innate magical power, from the list of available origins.\n\nYour choice grants you features when you choose it at 1st level and again at 6th, 14th, and 18th level.'],
    [1, 'Spellcasting', 'An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic. This font of magic, whatever its origin, fuels your spells. See chapter 10 for the general rules of spellcasting and chapter 11 for the sorcerer spell list.\n\n**Cantrips.** At 1st level, you know four cantrips of your choice from the sorcerer spell list. You learn an additional sorcerer cantrip of your choice at 4th level and another at 10th level.\n\n**Spell Slots.** The Sorcerer table shows how many spell slots you have to cast your sorcerer spells of 1st level and higher. To cast one of these sorcerer spells, you must expend a slot of the spell\'s level or higher. You regain all expended spell slots when you finish a long rest.\n\nFor example, if you know the 1st-level spell burning hands and have a 1st-level and a 2nd-level spell slot available, you can cast burning hands using either slot.\n\n**Spells Known of 1st Level and Higher.** You know two 1st-level spells of your choice from the sorcerer spell list.\n\nYou learn an additional sorcerer spell of your choice at each level except 12th, 14th, 16th, 18th, 19th, and 20th. Each of these spells must be of a level for which you have spell slots. For instance, when you reach 3rd level in this class, you can learn one new spell of 1st or 2nd level.\n\nAdditionally, when you gain a level in this class, you can choose one of the sorcerer spells you know and replace it with another spell from the sorcerer spell list, which also must be of a level for which you have spell slots.\n\n**Spellcasting Ability.** Charisma is your spellcasting ability for your sorcerer spells, since the power of your magic relies on your ability to project your will into the world. You use your Charisma whenever a spell refers to your spellcasting ability. In addition, you use your Charisma modifier when setting the saving throw DC for a sorcerer spell you cast and when making an attack roll with one.\n\n**Spell.**\n\n**Spell.**\n\n**Spellcasting Focus.** You can use an arcane focus as a spellcasting focus for your sorcerer spells.'],
    [2, 'Font of Magic', 'At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects.\n\n> **Sorcery Points**\n>\n> You have 2 sorcery points, and you gain one additional point every time you level up, to a maximum of 20 at level 20. You can never have more sorcery points than shown on the table for your level. You regain all spent sorcery points when you finish a long rest.\n\n> **Flexible Casting**\n>\n> You can use your sorcery points to gain additional spell slots, or sacrifice spell slots to gain additional sorcery points. You learn other ways to use your sorcery points as you reach higher levels.\n>\n> **Creating Spell Slots.** You can transform unexpended sorcery points into one spell slot as a bonus action on your turn. The created spell slots vanish at the end of a long rest. The Creating Spell Slots table shows the cost of creating a spell slot of a given level. You can create spell slots no higher in level than 5th.\n>\n> Table: Creating Spell Slots\n> | Spell Slot Level | Sorcery Point Cost |\n> | 1st | 2 |\n> | 2nd | 3 |\n> | 3rd | 5 |\n> | 4th | 6 |\n> | 5th | 7 |\n>\n> **Converting a Spell Slot to Sorcery Points.** As a bonus action on your turn, you can expend one spell slot and gain a number of sorcery points equal to the slot\'s level.'],
    [3, 'Metamagic', 'At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level.\n\nYou can use only one Metamagic option on a spell when you cast it, unless otherwise noted.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [6, 'Sorcerous Origin feature', 'At 6th level, you gain a feature granted by your Sorcerous Origin.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [10, 'Metamagic', 'At 10th level, you learn an additional metamagic option.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [14, 'Sorcerous Origin feature', 'At 14th level, you gain a feature granted by your Sorcerous Origin.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [17, 'Metamagic', 'At 17th level, you learn an additional metamagic option.'],
    [18, 'Sorcerous Origin feature', 'At 18th level, you gain a feature granted by your Sorcerous Origin.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Sorcerous Restoration', 'At 20th level, you regain 4 expended sorcery points whenever you finish a short rest.'],
  ],
  Warlock: [
    [1, 'Otherworldly Patron', 'At 1st level, you have struck a bargain with an otherworldly being chosen from the list of available patrons. Your choice grants you features at 1st level and again at 6th, 10th, and 14th level.'],
    [1, 'Pact Magic', 'Your arcane research and the magic bestowed on you by your patron have given you facility with spells. See chapter 10 for the general rules of spellcasting and chapter 11 for the warlock spell list.\n\n**Cantrips.** You know two cantrips of your choice from the warlock spell list. You learn additional warlock cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Warlock table.\n\n**Spell Slots.** The Warlock table shows how many spell slots you have to cast your warlock spells of 1st through 5th level. The table also shows what the level of those slots is; all of your spell slots are the same level. To cast one of your warlock spells of 1st level or higher, you must expend a spell slot. You regain all expended spell slots when you finish a short or long rest.\n\nFor example, when you are 5th level, you have two 3rd-level spell slots. To cast the 1st-level spell witch bolt, you must spend one of those slots, and you cast it as a 3rd-level spell.\n\n**Spells Known of 1st Level and Higher.** At 1st level, you know two 1st-level spells of your choice from the warlock spell list.\n\nThe Spells Known column of the Warlock table shows when you learn more warlock spells of your choice of 1st level and higher. A spell you choose must be of a level no higher than what\'s shown in the table\'s Slot Level column for your level. When you reach 6th level, for example, you learn a new warlock spell, which can be 1st, 2nd, or 3rd level.\n\nAdditionally, when you gain a level in this class, you can choose one of the warlock spells you know and replace it with another spell from the warlock spell list, which also must be of a level for which you have spell slots.\n\n**Spellcasting Ability.** Charisma is your spellcasting ability for your warlock spells, so you use your Charisma whenever a spell refers to your spellcasting ability. In addition, you use your Charisma modifier when setting the saving throw DC for a warlock spell you cast and when making an attack roll with one.\n\n**Spell.**\n\n**Spell.**\n\n**Spellcasting Focus.** You can use an arcane focus as a spellcasting focus for your warlock spells.'],
    [2, 'Eldritch Invocations', 'In your study of occult lore, you have unearthed eldritch invocations, fragments of forbidden knowledge that imbue you with an abiding magical ability.\n\nAt 2nd level, you gain two eldritch invocations of your choice. A list of the available options can be found on the Optional Features page. When you gain certain warlock levels, you gain additional invocations of your choice, as shown in the Invocations Known column of the Warlock table.\n\nAdditionally, when you gain a level in this class, you can choose one of the invocations you know and replace it with another invocation that you could learn at that level.\n\nIf an eldritch invocation has prerequisites, you must meet them to learn it. You can learn the invocation at the same time that you meet its prerequisites. A level prerequisite refers to your level in this class.'],
    [3, 'Pact Boon', 'At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [6, 'Otherworldly Patron feature', 'At 6th level, you gain a feature granted by your Otherworldly Patron.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [10, 'Otherworldly Patron feature', 'At 10th level, you gain a feature granted by your Otherworldly Patron.'],
    [11, 'Mystic Arcanum (6th level)', 'At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list as this arcanum.\n\nYou can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.\n\nAt higher levels, you gain more warlock spells of your choice that can be cast in this way: one 7th-level spell at 13th level, one 8th-level spell at 15th level, and one 9th-level spell at 17th level. You regain all uses of your Mystic Arcanum when you finish a long rest.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [13, 'Mystic Arcanum (7th level)', 'At 13th level, your patron bestows upon you a magical secret called an arcanum. Choose one 7th-level spell from the warlock spell list as this arcanum.\n\nYou can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.'],
    [14, 'Otherworldly Patron feature', 'At 14th level, you gain a feature granted by your Otherworldly Patron.'],
    [15, 'Mystic Arcanum (8th level)', 'At 15th level, your patron bestows upon you a magical secret called an arcanum. Choose one 8th-level spell from the warlock spell list as this arcanum.\n\nYou can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [17, 'Mystic Arcanum (9th level)', 'At 17th level, your patron bestows upon you a magical secret called an arcanum. Choose one 9th-level spell from the warlock spell list as this arcanum.\n\nYou can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Eldritch Master', 'At 20th level, you can draw on your inner reserve of mystical power while entreating your patron to regain expended spell slots. You can spend 1 minute entreating your patron for aid to regain all your expended spell slots from your Pact Magic feature. Once you regain spell slots with this feature, you must finish a long rest before you can do so again.'],
  ],
  Wizard: [
    [1, 'Arcane Recovery', 'You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.\n\nFor example, if you\'re a 4th-level wizard, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level spell slot or two 1st-level spell slots.'],
    [1, 'Spellcasting', 'As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power. See chapter 10 for the general rules of spellcasting and chapter 11 for the wizard spell list.\n\n**Cantrips.** At 1st level, you know three cantrips of your choice from the wizard spell list. You learn additional wizard cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Wizard table.\n\n**Spellbook.** At 1st level, you have a spellbook containing six 1st-level wizard spells of your choice. Your spellbook is the repository of the wizard spells you know, except your cantrips, which are fixed in your mind.\n\n**Preparing and Casting Spells.** The Wizard table shows how many spell slots you have to cast your wizard spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell\'s level or higher. You regain all expended spell slots when you finish a long rest.\n\nYou prepare the list of wizard spells that are available for you to cast. To do so, choose a number of wizard spells from your spellbook equal to your Intelligence modifier + your wizard level (minimum of one spell). The spells must be of a level for which you have spell slots.\n\nFor example, if you\'re a 3rd-level wizard, you have four 1st-level and two 2nd-level spell slots. With an Intelligence of 16, your list of prepared spells can include six spells of 1st or 2nd level, in any combination, chosen from your spellbook. If you prepare the 1st-level spell magic missile, you can cast it using a 1st-level or a 2nd-level slot. Casting the spell doesn\'t remove it from your list of prepared spells.\n\nYou can change your list of prepared spells when you finish a long rest. Preparing a new list of wizard spells requires time spent studying your spellbook and memorizing the incantations and gestures you must make to cast the spell: at least 1 minute per spell level for each spell on your list.\n\n**Spellcasting Ability.** Intelligence is your spellcasting ability for your wizard spells, since you learn your wizard spells through dedicated study and memorization. You use your Intelligence whenever a spell refers to your spellcasting ability. In addition, you use your Intelligence modifier when setting the saving throw DC for a wizard spell you cast and when making an attack roll with one.\n\n**Spell.**\n\n**Spell.**\n\n**Ritual Casting.** You can cast a wizard spell as a ritual if that spell has the ritual tag and you have the spell in your spellbook. You don\'t need to have the spell prepared.\n\n**Spellcasting Focus.** You can use an arcane focus as a spellcasting focus for your wizard spells.\n\n**Learning Spells of 1st Level and Higher.** Each time you gain a wizard level, you can add two wizard spells of your choice to your spellbook. Each of these spells must be of a level for which you have spell slots, as shown on the Wizard table. On your adventures, you might find other spells that you can add to your spellbook (see "Your Spellbook").\n\n**Your Spellbook.** The spells that you add to your spellbook as you gain levels reflect the arcane research you conduct on your own, as well as intellectual breakthroughs you have had about the nature of the multiverse. You might find other spells during your adventures. You could discover a spell recorded on a scroll in an evil wizard\'s chest, for example, or in a dusty tome in an ancient library.\n\nA spellbook doesn\'t contain cantrips.\n\n**Copying a Spell into the Book.** When you find a wizard spell of 1st level or higher, you can add it to your spellbook if it is of a spell level you can prepare and if you can spare the time to decipher and copy it.\n\nCopying a spell into your spellbook involves reproducing the basic form of the spell, then deciphering the unique system of notation used by the wizard who wrote it. You must practice the spell until you understand the sounds or gestures required, then transcribe it into your spellbook using your own notation.\n\nFor each level of the spell, the process takes 2 hours and costs 50 gp. The cost represents material components you expend as you experiment with the spell to master it, as well as the fine inks you need to record it. Once you have spent this time and money, you can prepare the spell just like your other spells.\n\n**Copying from a Spell Scroll.** A wizard spell on a spell scroll can be copied just as spells in spellbooks can be copied. When you copy a spell from a spell scroll, you must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell\'s level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the spell scroll is destroyed.\n\n**Replacing the Book.** You can copy a spell from your own spellbook into another book—for example, if you want to make a backup copy of your spellbook. This is just like copying a new spell into your spellbook, but faster and easier, since you understand your own notation and already know how to cast the spell. You need spend only 1 hour and 10 gp for each level of the copied spell.\n\nIf you lose your spellbook, you can use the same procedure to transcribe the spells that you have prepared into a new spellbook. Filling out the remainder of your spellbook requires you to find new spells to do so, as normal. For this reason, many wizards keep backup spellbooks in a safe place.\n\n**The Book\'s Appearance.** Your spellbook is a unique compilation of spells, with its own decorative flourishes and margin notes. It might be a plain, functional leather volume that you received as a gift from your master, a finely bound gilt-edged tome you found in an ancient library, or even a loose collection of notes scrounged together after you lost your previous spellbook in a mishap.'],
    [2, 'Arcane Tradition', 'When you reach 2nd level, you choose an arcane tradition from the list of available traditions, shaping your practice of magic. Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level.'],
    [4, 'Ability Score Improvement', 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [6, 'Arcane Tradition feature', 'At 6th level, you gain a feature granted by your Arcane Tradition.'],
    [8, 'Ability Score Improvement', 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [10, 'Arcane Tradition feature', 'At 10th level, you gain a feature granted by your Arcane Tradition.'],
    [12, 'Ability Score Improvement', 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [14, 'Arcane Tradition feature', 'At 14th level, you gain a feature granted by your Arcane Tradition.'],
    [16, 'Ability Score Improvement', 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [18, 'Spell Mastery', 'At 18th level, you have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared. If you want to cast either spell at a higher level, you must expend a spell slot as normal.\n\nBy spending 8 hours in study, you can exchange one or both of the spells you chose for different spells of the same levels.'],
    [19, 'Ability Score Improvement', 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.\n\nIf your DM allows the use of feats, you may instead take a a feat.'],
    [20, 'Signature Spells', 'When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort. Choose two 3rd-level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don\'t count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot. When you do so, you can\'t do so again until you finish a short or long rest.\n\nIf you want to cast either spell at a higher level, you must expend a spell slot as normal.'],
  ],
};

const CLASS_FEATURES_2024 = {
  Barbarian: [
    [1, 'Rage', 'You can imbue yourself with a primal power called Rage, a force that grants you extraordinary might and resilience. You can enter it as a Bonus Action if you aren\'t wearing Heavy armor.\n\nYou can enter your Rage the number of times shown for your Barbarian level in the Rages column of the Barbarian Features table. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.\n\nWhile active, your Rage follows the rules below.\n\n**Damage Resistance.** You have Resistance to Bludgeoning, Piercing, and Slashing damage.\n\n**Rage Damage.** When you make an attack using Strength—with either a weapon or an Unarmed Strike—and deal damage to the target, you gain a bonus to the damage that increases as you gain levels as a Barbarian, as shown in the Rage Damage column of the Barbarian Features table.\n\n**Strength Advantage.** You have Advantage on Strength checks and Strength saving throws.\n\n**No Concentration or Spells.** You can\'t maintain Concentration, and you can\'t cast spells.\n\n**Duration.** The Rage lasts until the end of your next turn, and it ends early if you don Heavy armor or have the Incapacitated condition. If your Rage is still active on your next turn, you can extend the Rage for another round by doing one of the following:\n\n• Make an attack roll against an enemy.\n• Force an enemy to make a saving throw.\n• Take a Bonus Action to extend your Rage.\n\nEach time the Rage is extended, it lasts until the end of your next turn. You can maintain a Rage for up to 10 minutes.'],
    [1, 'Unarmored Defense', 'While you aren\'t wearing any armor, your base Armor Class equals 10 plus your Dexterity and Constitution modifiers. You can use a Shield and still gain this benefit.'],
    [1, 'Weapon Mastery', 'Your training with weapons allows you to use the mastery properties of two kinds of Simple or Martial Melee weapons of your choice, such as Greataxes and Handaxes. Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices.\n\nWhen you reach certain Barbarian levels, you gain the ability to use the mastery properties of more kinds of weapons, as shown in the Weapon Mastery column of the Barbarian Features table.'],
    [2, 'Danger Sense', 'You gain an uncanny sense of when things aren\'t as they should be, giving you an edge when you dodge perils. You have Advantage on Dexterity saving throws unless you have the Incapacitated condition.'],
    [2, 'Reckless Attack', 'You can throw aside all concern for defense to attack with increased ferocity. When you make your first attack roll on your turn, you can decide to attack recklessly. Doing so gives you Advantage on attack rolls using Strength until the start of your next turn, but attack rolls against you have Advantage during that time.'],
    [3, 'Barbarian Subclass', 'You gain a Barbarian subclass of your choice. A subclass is a specialization that grants you features at certain Barbarian levels. For the rest of your career, you gain each of your subclass\'s features that are of your Barbarian level or lower.'],
    [3, 'Primal Knowledge', 'You gain proficiency in another skill of your choice from the skill list available to Barbarians at level 1.\n\nIn addition, while your Rage is active, you can channel primal power when you attempt certain tasks; whenever you make an ability check using one of the following skills, you can make it as a Strength check even if it normally uses a different ability: Acrobatics, Intimidation, Perception, Stealth, or Survival. When you use this ability, your Strength represents primal power coursing through you, honing your agility, bearing, and senses.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Barbarian levels 8, 12, and 16.'],
    [5, 'Extra Attack', 'You can attack twice instead of once whenever you take the Attack action on your turn.'],
    [5, 'Fast Movement', 'Your speed increases by 10 feet while you aren\'t wearing Heavy armor.'],
    [6, 'Subclass Feature', 'You gain a feature from your Barbarian subclass.'],
    [7, 'Feral Instinct', 'Your instincts are so honed that you have Advantage on Initiative rolls.'],
    [7, 'Instinctive Pounce', 'As part of the Bonus Action you take to enter your Rage, you can move up to half your Speed.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [9, 'Brutal Strike', 'If you use Reckless Attack, you can forgo any Advantage on one Strength-based attack roll of your choice on your turn. The chosen attack roll mustn\'t have Disadvantage. If the chosen attack roll hits, the target takes an extra 1d10 damage of the same type dealt by the weapon or Unarmed Strike, and you can cause one Brutal Strike effect of your choice. You have the following effect options.\n\n**Forceful Blow.** The target is pushed 15 feet straight away from you. You can then move up to half your Speed straight toward the target without provoking Opportunity Attacks.\n\n**Hamstring Blow.** The target\'s Speed is reduced by 15 feet until the start of your next turn. A target can be affected by only one Hamstring Blow at a time—the most recent one.'],
    [10, 'Subclass Feature', 'You gain a feature from your Barbarian subclass.'],
    [11, 'Relentless Rage', 'Your Rage can keep you fighting despite grievous wounds. If you drop to 0 Hit Points while your Rage is active and don\'t die outright, you can make a 10 Constitution saving throw. If you succeed, your Hit Points instead change to a number equal to twice your Barbarian level.\n\nEach time you use this feature after the first, the DC increases by 5. When you finish a Short or Long Rest, the DC resets to 10.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [13, 'Improved Brutal Strike', 'You have honed new ways to attack furiously. The following effects are now among your Brutal Strike options.\n\n**Staggering Blow.** The target has Disadvantage on the next saving throw it makes, and it can\'t make Opportunity Attacks until the start of your next turn.\n\n**Sundering Blow.** Before the start of your next turn, the next attack roll made by another creature against the target gains a +5 bonus to the roll. An attack roll can gain only one Sundering Blow bonus.'],
    [14, 'Subclass Feature', 'You gain a feature from your Barbarian subclass.'],
    [15, 'Persistent Rage', 'When you roll Initiative, you can regain all expended uses of Rage. After you regain uses of Rage in this way, you can\'t do so again until you finish a Long Rest.\n\nIn addition, your Rage is so fierce that it now lasts for 10 minutes without you needing to do anything to extend it from round to round. Your Rage ends early if you have the Unconscious condition (not just the Incapacitated condition) or don Heavy armor.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [17, 'Improved Brutal Strike', 'The extra damage of your Brutal Strike increases to 2d10. In addition, you can use two different Brutal Strike effects whenever you use your Brutal Strike feature.'],
    [18, 'Indomitable Might', 'If your total for a Strength check or Strength saving throw is less than your Strength score, you can use that score in place of the total.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Irresistible Offense is recommended.'],
    [20, 'Primal Champion', 'You embody primal power. Your Strength and Constitution scores increase by 4, to a maximum of 25.'],
  ],
  Bard: [
    [1, 'Bardic Inspiration', 'You can supernaturally inspire others through words, music, or dance. This inspiration is represented by your Bardic Inspiration die, which is a d6.\n\n**Using Bardic Inspiration.** As a Bonus Action, you can inspire another creature within 60 feet of yourself who can see or hear you. That creature gains one of your Bardic Inspiration dice. A creature can have only one Bardic Inspiration die at a time.\n\nOnce within the next hour when the creature fails a D20 Test, the creature can roll the Bardic Inspiration die and add the number rolled to the d20, potentially turning the failure into a success. A Bardic Inspiration die is expended when it\'s rolled.\n\n**Number of Uses.** You can confer a Bardic Inspiration die a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.\n\n**At Higher Levels.** Your Bardic Inspiration die changes when you reach certain Bard levels, as shown in the Bardic Die column of the Bard Features table. The die becomes a d8 at level 5, a d10 at level 10, and a d12 at level 15.'],
    [1, 'Spellcasting', 'You have learned to cast spells through your bardic arts. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Bard spells, which appear in the Bard spell list later in the class\'s description.\n\n**Cantrips.** You know two cantrips of your choice from the Bard spell list. Dancing Lights and Vicious Mockery are recommended.\n\nWhenever you gain a Bard level, you can replace one of your cantrips with another cantrip of your choice from the Bard spell list.\n\nWhen you reach Bard levels 4 and 10, you learn another cantrip of your choice from the Bard spell list, as shown in the Cantrips column of the Bard Features table.\n\n**Spell Slots.** The Bard Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.\n\n**Prepared Spells of Level 1+.** You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose four level 1 spells from the Bard spell list. Charm Person, Color Spray, Dissonant Whispers, and Healing Word are recommended.\n\nThe number of spells on your list increases as you gain Bard levels, as shown in the Prepared Spells column of the Bard Features table. Whenever that number increases, choose additional spells from the Bard spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 3 Bard, your list of prepared spells can include six spells of levels 1 and 2 in any combination.\n\nIf another Bard feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Bard spells for you.\n\n**Changing Your Prepared Spells.** Whenever you gain a Bard level, you can replace one spell on your list with another Bard spell for which you have spell slots.\n\n**Spellcasting Ability.** Charisma is your spellcasting ability for your Bard spells.\n\n**Spellcasting Focus.** You can use a Musical Instrument as a Spellcasting Focus for your Bard spells.'],
    [2, 'Expertise', 'You gain Expertise in two of your skill proficiencies of your choice. Performance and Persuasion are recommended if you have proficiency in them.\n\nAt Bard level 9, you gain Expertise in two more of your skill proficiencies of your choice.'],
    [2, 'Jack of All Trades', 'You can add half your Proficiency Bonus (round down) to any ability check you make that uses a skill proficiency you lack and that doesn\'t otherwise use your Proficiency Bonus.\n\nFor example, if you make a Strength (Athletics) check and lack Athletics proficiency, you can add half your Proficiency Bonus to the check.\n\n**A Bard\'s Repertoire.** Does your Bard beat a drum while chanting the deeds of ancient heroes? Strum a lute while crooning romantic tunes? Perform arias of stirring power? Recite dramatic monologues from classic tragedies? Use the rhythm of a folk dance to coordinate the movement of allies in battle? Compose naughty limericks?\n\nWhen you play a Bard, consider the style of artistic performance you favor, the moods you might invoke, and the themes that inspire your own creations. Are your poems inspired by moments of natural beauty, or are they brooding reflections on loss? Do you prefer lofty hymns or rowdy tavern songs? Are you drawn to laments for the fallen or celebrations of joy? Do you dance merry jigs or perform elaborate interpretive choreography? Do you focus on one style of performance or strive to master them all?'],
    [3, 'Bard Subclass', 'You gain a Bard subclass of your choice. A subclass is a specialization that grants you features at certain Bard levels. For the rest of your career, you gain each of your subclass\'s features that are of your Bard level or lower.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Bard levels 8, 12, and 16.'],
    [5, 'Font of Inspiration', 'You now regain all your expended uses of Bardic Inspiration when you finish a Short or Long Rest.\n\nIn addition, you can expend a spell slot (no action required) to regain one expended use of Bardic Inspiration.'],
    [6, 'Subclass Feature', 'You gain a feature from your Bard Subclass.'],
    [7, 'Countercharm', 'You can use musical notes or words of power to disrupt mind-influencing effects. If you or a creature within 30 feet of you fails a saving throw against an effect that applies the Charmed or Frightened condition, you can take a Reaction to cause the save to be rerolled, and the new roll has Advantage.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [9, 'Expertise', 'You gain Expertise in two of your Skill Proficiencies of your choice.'],
    [10, 'Magical Secrets', 'You\'ve learned secrets from various magical traditions. Whenever you reach a Bard level (including this level) and the Prepared Spells number in the Bard Features table increases, you can choose any of your new prepared spells from the Bard, Cleric, Druid, and Wizard spell lists, and the chosen spells count as Bard spells for you (see a class\'s section for its spell list). In addition, whenever you replace a spell prepared for this class, you can replace it with a spell from those lists.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [14, 'Subclass Feature', 'You gain a feature from your Bard Subclass.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [18, 'Superior Inspiration', 'When you roll Initiative, you regain expended uses of Bardic Inspiration until you have two if you have fewer than that.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Spell Recall is recommended.'],
    [20, 'Words of Creation', 'You have mastered two of the Words of Creation: the words of life and death. You therefore always have the Power Word Heal and Power Word Kill spells prepared. When you cast either spell, you can target a second creature with it if that creature is within 10 feet of the first target.'],
  ],
  Cleric: [
    [1, 'Divine Order', 'You have dedicated yourself to one of the following sacred roles of your choice.\n\n> **Protector**\n>\n> Trained for battle, you gain proficiency with Martial weapons and training with Heavy armor.\n\n> **Thaumaturge**\n>\n> You know one extra cantrip from the Cleric spell list. In addition, your mystical connection to the divine gives you a bonus to your Intelligence (Arcana or Religion) checks. The bonus equals your Wisdom modifier (minimum of +1).'],
    [1, 'Spellcasting', 'You have learned to cast spells through prayer and meditation. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Cleric spells, which appear on the Cleric spell list later in the class\'s description.\n\n**Cantrips.** You know three cantrips of your choice from the Cleric spell list. Guidance, Sacred Flame, and Thaumaturgy are recommended.\n\nWhenever you gain a Cleric level, you can replace one of your cantrips with another cantrip of your choice from the Cleric spell list.\n\nWhen you reach Cleric levels 4 and 10, you learn another cantrip of your choice from the Cleric spell list, as shown in the Cantrips column of the Cleric Features table.\n\n**Spell Slots.** The Cleric Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.\n\n**Prepared Spells of Level 1+.** You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose four level 1 spells from the Cleric spell list. Bless, Cure Wounds, Guiding Bolt, and Shield of Faith are recommended.\n\nThe number of spells on your list increases as you gain Cleric levels, as shown in the Prepared Spells column of the Cleric Features table. Whenever that number increases, choose additional spells from the Cleric spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 3 Cleric, your list of prepared spells can include six spells of levels 1 and 2 in any combination.\n\nIf another Cleric feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Cleric spells for you.\n\n**Changing Your Prepared Spells.** Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells there with other Cleric spells for which you have spell slots.\n\n**Spellcasting Ability.** Wisdom is your spellcasting ability for your Cleric spells.\n\n**Spellcasting Focus.** You can use a Holy Symbol as a Spellcasting Focus for your Cleric spells.'],
    [2, 'Channel Divinity', 'You can channel divine energy directly from the Outer Planes to fuel magical effects. You start with two such effects: Divine Spark and Turn Undead, each of which is described below. Each time you use this class\'s Channel Divinity, choose which Channel Divinity effect from this class to create. You gain additional effect options at higher Cleric levels.\n\nYou can use this class\'s Channel Divinity twice. You regain one of its expended uses when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. You gain additional uses when you reach certain Cleric levels, as shown in the Channel Divinity column of the Cleric Features table.\n\nIf a Channel Divinity effect requires a saving throw, the DC equals the spell save DC from this class\'s Spellcasting feature.\n\n> **Divine Spark**\n>\n> As a Magic action, you point your Holy Symbol at another creature you can see within 30 feet of yourself and focus divine energy at it. Roll 1d8 and add your Wisdom modifier. You either restore Hit Points to the creature equal to that total or force the creature to make a Constitution saving throw. On a failed save, the creature takes Necrotic or Radiant damage (your choice) equal to that total. On a successful save, the creature takes half as much damage (round down).\n>\n> You roll an additional d8 when you reach Cleric levels 7 (2d8), 13 (3d8), and 18 (4d8).\n\n> **Turn Undead**\n>\n> As a Magic action, you present your Holy Symbol and censure Undead creatures. Each Undead of your choice within 30 feet of you must make a Wisdom saving throw. If the creature fails its save, it has the Frightened and Incapacitated conditions for 1 minute. For that duration, it tries to move as far from you as it can on its turns. This effect ends early on the creature if it takes any damage, if you have the Incapacitated condition, or if you die.'],
    [3, 'Cleric Subclass', 'You gain a Cleric subclass of your choice. A subclass is a specialization that grants you features at certain Cleric levels. For the rest of your career, you gain each of your subclass\'s features that are of your Cleric level or lower.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Cleric levels 8, 12, and 16.'],
    [5, 'Sear Undead', 'Whenever you use Turn Undead, you can roll a number of d8s equal to your Wisdom modifier (minimum of 1d8) and add the rolls together. Each Undead that fails its saving throw against that use of Turn Undead takes Radiant damage equal to the roll\'s total. This damage doesn\'t end the turn effect.'],
    [6, 'Subclass Feature', 'You gain a feature from your Cleric Subclass.'],
    [7, 'Blessed Strikes', 'Divine power infuses you in battle. You gain one of the following options of your choice (if you get either option from a Cleric subclass in an older book, use only the option you choose for this feature).\n\n> **Divine Strike**\n>\n> Once on each of your turns when you hit a creature with an attack roll using a weapon, you can cause the target to take an extra 1d8 Necrotic or Radiant damage (your choice).\n\n> **Potent Spellcasting**\n>\n> Add your Wisdom modifier to the damage you deal with any Cleric cantrip.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [10, 'Divine Intervention', 'You can call on your deity or pantheon to intervene on your behalf. As a Magic action, choose any Cleric spell of level 5 or lower that doesn\'t require a Reaction to cast. As part of the same action, you cast that spell without expending a spell slot or needing Material components. You can\'t use this feature again until you finish a Long Rest.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [14, 'Improved Blessed Strikes', 'The option you chose for Blessed Strikes grows more powerful.\n\n**Divine Strike.** The extra damage of your Divine Strike increases to 2d8.\n\n**Potent Spellcasting.** When you cast a Cleric cantrip and deal damage to a creature with it, you can give vitality to yourself or another creature within 60 feet of yourself, granting a number of Temporary Hit Points equal to twice your Wisdom modifier.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [17, 'Subclass Feature', 'You gain a feature from your Cleric Subclass.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Fate is recommended.'],
    [20, 'Greater Divine Intervention', 'You can call on even more powerful divine intervention. When you use your Divine Intervention feature, you can choose Wish when you select a spell. If you do so, you can\'t use Divine Intervention again until you finish 2d4 Long Rests.'],
  ],
  Druid: [
    [1, 'Druidic', 'You know Druidic, the secret language of Druids. While learning this ancient tongue, you also unlocked the magic of communicating with animals; you always have the Speak with Animals spell prepared.\n\nYou can use Druidic to leave hidden messages. You and others who know Druidic automatically spot such a message. Others spot the message\'s presence with a successful 15 Intelligence (Investigation) check but can\'t decipher it without magic.'],
    [1, 'Primal Order', 'You have dedicated yourself to one of the following sacred roles of your choice.\n\n> **Magician**\n>\n> You know one extra cantrip from the Druid spell list. In addition, your mystical connection to nature gives you a bonus to your Intelligence (Arcana or Nature) checks. The bonus equals your Wisdom modifier (minimum bonus of +1).\n\n> **Warden**\n>\n> Trained for battle, you gain proficiency with Martial weapons and training with Medium armor.'],
    [1, 'Spellcasting', 'You have learned to cast spells through studying the mystical forces of nature. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Druid spells, which appear on the Druid spell list later in the class\'s description.\n\n**Cantrips.** You know two cantrips of your choice from the Druid spell list. Druidcraft and Produce Flame are recommended.\n\nWhenever you gain a Druid level, you can replace one of your cantrips with another cantrip of your choice from the Druid spell list.\n\nWhen you reach Druid levels 4 and 10, you learn another cantrip of your choice from the Druid spell list, as shown in the Cantrips column of the Druid Features table.\n\n**Spell Slots.** The Druid Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.\n\n**Prepared Spells of Level 1+.** You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose four level 1 spells from the Druid spell list. Animal Friendship, Cure Wounds, Faerie Fire, and Thunderwave are recommended.\n\nThe number of spells on your list increases as you gain Druid levels, as shown in the Prepared Spells column of the Druid Features table. Whenever that number increases, choose additional spells from the Druid spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 3 Druid, your list of prepared spells can include six spells of levels 1 and 2 in any combination.\n\nIf another Druid feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Druid spells for you.\n\n**Changing Your Prepared Spells.** Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells with other Druid spells for which you have spell slots.\n\n**Spellcasting Ability.** Wisdom is your spellcasting ability for your Druid spells.\n\n**Spellcasting Focus.** You can use a Druidic Focus as a Spellcasting Focus for your Druid spells.'],
    [2, 'Wild Companion', 'You can summon a nature spirit that assumes an animal form to aid you. As a Magic action, you can expend a spell slot or a use of Wild Shape to cast the Find Familiar spell without Material components.\n\nWhen you cast the spell in this way, the familiar is Fey and disappears when you finish a Long Rest.'],
    [2, 'Wild Shape', 'The power of nature allows you to assume the form of an animal. As a Bonus Action, you shape-shift into a Beast form that you have learned for this feature (see "Known Forms" below). You stay in that form for a number of hours equal to half your Druid level or until you use Wild Shape again, have the Incapacitated condition, or die. You can also leave the form early as a Bonus Action.\n\n**Number of Uses.** You can use Wild Shape twice. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.\n\nYou gain additional uses when you reach certain Druid levels, as shown in the Wild Shape column of the Druid Features table.\n\n**Known Forms.** You know four Beast forms for this feature, chosen from among Beast stat blocks that have a maximum Challenge Rating of 1/4 and that lack a Fly Speed (see appendix B for stat block options). The Rat, Riding Horse, Spider, and Wolf are recommended. Whenever you finish a Long Rest, you can replace one of your known forms with another eligible form.\n\nWhen you reach certain Druid levels, your number of known forms and the maximum Challenge Rating for those forms increases, as shown in the Beast Shapes table. In addition, starting at level 8, you can adopt a form that has a Fly Speed.\n\nWhen choosing known forms, you may look in the Monster Manual or elsewhere for eligible Beasts if the Dungeon Master permits you to do so.\n\nTable: Beast Shapes\n| Druid Level | Known Forms | Max CR | Fly Speed |\n| 2 | 4 | 1/4 | No |\n| 4 | 6 | 1/2 | No |\n| 8 | 8 | 1 | Yes |\n\n**Rules While Shape-Shifted.** While in a form, you retain your personality, memories, and ability to speak, and the following rules apply:\n\n• **Temporary Hit Points.** When you assume a Wild Shape form, you gain a number of Temporary Hit Points equal to your Druid level.\n• **Game Statistics.** Your game statistics are replaced by the Beast\'s stat block, but you retain your creature type; Hit Points; Hit Point Dice; Intelligence, Wisdom, and Charisma scores; class features; languages; and feats. You also retain your skill and saving throw proficiencies and use your Proficiency Bonus for them, in addition to gaining the proficiencies of the creature. If a skill or saving throw modifier in the Beast\'s stat block is higher than yours, use the one in the stat block.\n• **No Spellcasting.** You can\'t cast spells, but shape-shifting doesn\'t break your Concentration or otherwise interfere with a spell you\'ve already cast.\n• **Objects.** Your ability to handle objects is determined by the form\'s limbs rather than your own. In addition, you choose whether your equipment falls in your space, merges into your new form, or is worn by it. Worn equipment functions as normal, but the DM decides whether it\'s practical for the new form to wear a piece of equipment based on the creature\'s size and shape. Your equipment doesn\'t change size or shape to match the new form, and any equipment that the new form can\'t wear must either fall to the ground or merge with the form. Equipment that merges with the form has no effect while you\'re in that form.'],
    [3, 'Druid Subclass', 'You gain a Druid subclass of your choice. A subclass is a specialization that grants you features at certain Druid levels. For the rest of your career, you gain each of your subclass\'s features that are of your Druid level or lower.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Druid levels 8, 12, and 16.'],
    [5, 'Wild Resurgence', 'Once on each of your turns, if you have no uses of Wild Shape left, you can give yourself one use by expending a spell slot (no action required).\n\nIn addition, you can expend one use of Wild Shape (no action required) to give yourself a level 1 spell slot, but you can\'t do so again until you finish a Long Rest.'],
    [6, 'Subclass Feature', 'You gain a feature from your Druid Subclass.'],
    [7, 'Elemental Fury', 'The might of the elements flows through you. You gain one of the following options of your choice.\n\n> **Potent Spellcasting**\n>\n> Add your Wisdom modifier to the damage you deal with any Druid cantrip.\n\n> **Primal Strike**\n>\n> Once on each of your turns when you hit a creature with an attack roll using a weapon or a Beast form\'s attack in Wild Shape, you can cause the target to take an extra 1d8 Cold, Fire, Lightning, or Thunder damage (choose when you hit).'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [10, 'Subclass Feature', 'You gain a feature from your Druid Subclass.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [14, 'Subclass Feature', 'You gain a feature from your Druid Subclass.'],
    [15, 'Improved Elemental Fury', 'The option you chose for Elemental Fury grows more powerful, as detailed below.\n\n**Potent Spellcasting.** When you cast a Druid cantrip with a range of 10 feet or greater, the spell\'s range increases by 300 feet.\n\n**Primal Strike.** The extra damage of your Primal Strike increases to 2d8.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [18, 'Beast Spells', 'While using Wild Shape, you can cast spells in Beast form, except for any spell that has a Material component with a cost specified or that consumes its Material component.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Dimensional Travel is recommended.'],
    [20, 'Archdruid', 'The vitality of nature constantly blooms within you, granting you the following benefits.\n\n**Evergreen Wild Shape.** Whenever you roll Initiative and have no uses of Wild Shape left, you regain one expended use of it.\n\n**Nature Magician.** You can convert uses of Wild Shape into a spell slot (no action required). Choose a number of your unexpended uses of Wild Shape and convert them into a single spell slot, with each use contributing 2 spell levels. For example, if you convert two uses of Wild Shape, you produce a level 4 spell slot. Once you use this benefit, you can\'t do so again until you finish a Long Rest.\n\n**Longevity.** The primal magic that you wield causes you to age more slowly. For every ten years that pass, your body ages only one year.'],
  ],
  Fighter: [
    [1, 'Fighting Style', 'You have honed your martial prowess and gain a Fighting Style feat of your choice. Defense is recommended.\n\nWhenever you gain a Fighter level, you can replace the feat you chose with a different Fighting Style feat.'],
    [1, 'Second Wind', 'You have a limited well of physical and mental stamina that you can draw on. As a Bonus Action, you can use it to regain Hit Points equal to 1d10 plus your Fighter level.\n\nYou can use this feature twice. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.\n\nWhen you reach certain Fighter levels, you gain more uses of this feature, as shown in the Second Wind column of the Fighter Features table.'],
    [1, 'Weapon Mastery', 'Your training with weapons allows you to use the mastery properties of three kinds of Simple or Martial weapons of your choice. Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices.\n\nWhen you reach certain Fighter levels, you gain the ability to use the mastery properties of more kinds of weapons, as shown in the Weapon Mastery column of the Fighter Features table.'],
    [2, 'Action Surge', 'You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action, except the Magic action.\n\nOnce you use this feature, you can\'t do so again until you finish a Short or Long Rest. Starting at level 17, you can use it twice before a rest but only once on a turn.'],
    [2, 'Tactical Mind', 'You have a mind for tactics on and off the battlefield. When you fail an ability check, you can expend a use of your Second Wind to push yourself toward success. Rather than regaining Hit Points, you roll 1d10 and add the number rolled to the ability check, potentially turning it into a success. If the check still fails, this use of Second Wind isn\'t expended.'],
    [3, 'Fighter Subclass', 'You gain a Fighter subclass of your choice. A subclass is a specialization that grants you features at certain Fighter levels. For the rest of your career, you gain each of your subclass\'s features that are of your Fighter level or lower.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Fighter levels 6, 8, 12, 14, and 16.'],
    [5, 'Extra Attack', 'You can attack twice instead of once whenever you take the Attack action on your turn.'],
    [5, 'Tactical Shift', 'Whenever you activate your Second Wind with a Bonus Action, you can move up to half your Speed without provoking Opportunity Attacks.'],
    [6, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [7, 'Subclass Feature', 'You gain a feature from your Fighter Subclass.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [9, 'Indomitable', 'If you fail a saving throw, you can reroll it with a bonus equal to your Fighter level. You must use the new roll, and you can\'t use this feature again until you finish a Long Rest.\n\nYou can use this feature twice before a Long Rest starting at level 13 and three times before a Long Rest starting at level 17.'],
    [9, 'Tactical Master', 'When you attack with a weapon whose mastery property you can use, you can replace that property with the , , or property for that attack.'],
    [10, 'Subclass Feature', 'You gain a feature from your Fighter Subclass.'],
    [11, 'Two Extra Attacks', 'You can attack three times instead of once whenever you take the Attack action on your turn.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [13, 'Indomitable', 'If you fail a saving throw, you can reroll it with a bonus equal to your Fighter level. You must use the new roll, and you can\'t use this feature again until you finish a Long Rest.\n\nYou can use this feature twice before a Long Rest starting at level 13 and three times before a Long Rest starting at level 17.'],
    [13, 'Studied Attacks', 'You study your opponents and learn from each attack you make. If you make an attack roll against a creature and miss, you have Advantage on your next attack roll against that creature before the end of your next turn.'],
    [14, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [15, 'Subclass Feature', 'You gain a feature from your Fighter Subclass.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [17, 'Action Surge', 'You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action, except the Magic action.\n\nOnce you use this feature, you can\'t do so again until you finish a Short or Long Rest. Starting at level 17, you can use it twice before a rest but only once on a turn.'],
    [17, 'Indomitable', 'If you fail a saving throw, you can reroll it with a bonus equal to your Fighter level. You must use the new roll, and you can\'t use this feature again until you finish a Long Rest.\n\nYou can use this feature twice before a Long Rest starting at level 13 and three times before a Long Rest starting at level 17.'],
    [18, 'Subclass Feature', 'You gain a feature from your Fighter Subclass.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Combat Prowess is recommended.'],
    [20, 'Three Extra Attacks', 'You can attack four times instead of once whenever you take the Attack action on your turn.'],
  ],
  Monk: [
    [1, 'Martial Arts', 'Your practice of martial arts gives you mastery of combat styles that use your Unarmed Strike and Monk weapons, which are the following:\n\n• Simple Melee Weapons\n• Martial Melee Weapons that have the Light property\n\nYou gain the following benefits while you are unarmed or wielding only Monk weapons and you aren\'t wearing armor or wielding a Shield.\n\n> **Bonus Unarmed Strike**\n>\n> You can make an Unarmed Strike as a Bonus Action.\n\n> **Martial Arts Die**\n>\n> You can roll 1d6 in place of the normal damage of your Unarmed Strike or Monk weapons. This die changes as you gain Monk levels, as shown in the Martial Arts column of the Monk Features table.\n\n> **Dexterous Attacks**\n>\n> You can use your Dexterity modifier instead of your Strength modifier for the attack and damage rolls of your Unarmed Strikes and Monk weapons. In addition, when you use the Grapple or Shove option of your Unarmed Strike, you can use your Dexterity modifier instead of your Strength modifier to determine the save DC.'],
    [1, 'Unarmored Defense', 'While you aren\'t wearing armor or wielding a Shield, your base Armor Class equals 10 plus your Dexterity and Wisdom modifiers.'],
    [2, 'Monk\'s Focus', 'Your focus and martial training allow you to harness a well of extraordinary energy within yourself. This energy is represented by Focus Points. Your Monk level determines the number of points you have, as shown in the Focus Points column of the Monk Features table.\n\nYou can expend these points to enhance or fuel certain Monk features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind, each of which is detailed below.\n\nWhen you expend a Focus Point, it is unavailable until you finish a Short or Long Rest, at the end of which you regain all your expended points.\n\nSome features that use Focus Points require your target to make a saving throw. The save DC equals 8 plus your Wisdom modifier and Proficiency Bonus.\n\n> **Flurry of Blows**\n>\n> You can expend 1 Focus Point to make two Unarmed Strikes as a Bonus Action.\n\n> **Patient Defense**\n>\n> You can take the Disengage action as a Bonus Action. Alternatively, you can expend 1 Focus Point to take both the Disengage and the Dodge actions as a Bonus Action.\n\n> **Step of the Wind**\n>\n> You can take the Dash action as a Bonus Action. Alternatively, you can expend 1 Focus Point to take both the Disengage and Dash actions as a Bonus Action, and your jump distance is doubled for the turn.'],
    [2, 'Unarmored Movement', 'Your speed increases by 10 feet while you aren\'t wearing armor or wielding a Shield. This bonus increases when you reach certain Monk levels, as shown on the Monk Features table.'],
    [2, 'Uncanny Metabolism', 'When you roll Initiative, you can regain all expended Focus Points. When you do so, roll your Martial Arts die, and regain a number of Hit Points equal to your Monk level plus the number rolled.\n\nOnce you use this feature, you can\'t use it again until you finish a Long Rest.'],
    [3, 'Deflect Attacks', 'When an attack roll hits you and its damage includes Bludgeoning, Piercing, or Slashing damage, you can take a Reaction to reduce the attack\'s total damage against you. The reduction equals 1d10 plus your Dexterity modifier and Monk level.\n\nIf you reduce the damage to 0, you can expend 1 Focus Point to redirect some of the attack\'s force. If you do so, choose a creature you can see within 5 feet of yourself if the attack was a melee attack or a creature you can see within 60 feet of yourself that isn\'t behind Total Cover if the attack was a ranged attack. That creature must succeed on a Dexterity saving throw or take damage equal to two rolls of your Martial Arts die plus your Dexterity modifier. The damage is the same type dealt by the attack.'],
    [3, 'Monk Subclass', 'You gain a Monk subclass of your choice. A subclass is a specialization that grants you features at certain Monk levels. For the rest of your career, you gain each of your subclass\'s features that are of your Monk level or lower.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Monk levels 8, 12, and 16.'],
    [4, 'Slow Fall', 'You can take a Reaction when you fall to reduce any damage you take from the fall by an amount equal to five times your Monk level.'],
    [5, 'Extra Attack', 'You can attack twice instead of once whenever you take the Attack action on your turn.'],
    [5, 'Stunning Strike', 'Once per turn when you hit a creature with a Monk weapon or an Unarmed Strike, you can expend 1 Focus Point to attempt a stunning strike. The target must make a Constitution saving throw. On a failed save, the target has the Stunned condition until the start of your next turn. On a successful save, the target\'s Speed is halved until the start of your next turn, and the next attack roll made against the target before then has Advantage.'],
    [6, 'Empowered Strikes', 'Whenever you deal damage with your Unarmed Strike, it can deal your choice of Force damage or its normal damage type.'],
    [6, 'Subclass Feature', 'You gain a feature from your Monk subclass.'],
    [7, 'Evasion', 'When you\'re subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail.\n\nYou don\'t benefit from this feature if you have the Incapacitated condition.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [9, 'Acrobatic Movement', 'While you aren\'t wearing armor or wielding a Shield, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the movement.'],
    [10, 'Heightened Focus', 'Your Flurry of Blows, Patient Defense, and Step of the Wind gain the following benefits.\n\n**Flurry of Blows.** You can expend 1 Focus Point to use Flurry of Blows and make three Unarmed Strikes with it instead of two.\n\n**Patient Defense.** When you expend a Focus Point to use Patient Defense, you gain a number of Temporary Hit Points equal to two rolls of your Martial Arts die.\n\n**Step of the Wind.** When you expend a Focus Point to use Step of the Wind, you can choose a willing creature within 5 feet of yourself that is Large or smaller. You move the creature with you until the end of your turn. The creature\'s movement doesn\'t provoke Opportunity Attacks.'],
    [10, 'Self-Restoration', 'Through sheer force of will, you can remove one of the following conditions from yourself at the end of each of your turns: Charmed, Frightened, or Poisoned.\n\nIn addition, forgoing food and drink doesn\'t give you levels of Exhaustion.'],
    [11, 'Subclass Feature', 'You gain a feature from your Monk subclass.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [13, 'Deflect Energy', 'You can now use your Deflect Attacks feature against attacks that deal any damage type, not just Bludgeoning, Piercing, or Slashing.'],
    [14, 'Disciplined Survivor', 'Your physical and mental discipline grant you proficiency in all saving throws.\n\nAdditionally, whenever you make a saving throw and fail, you can expend 1 Focus Point to reroll it, and you must use the new roll.'],
    [15, 'Perfect Focus', 'When you roll Initiative and don\'t use Uncanny Metabolism, you regain expended Focus Points until you have 4 if you have 3 or fewer.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [17, 'Subclass Feature', 'You gain a feature from your Monk subclass.'],
    [18, 'Superior Defense', 'At the start of your turn, you can expend 3 Focus Points to bolster yourself against harm for 1 minute or until you have the Incapacitated condition. During that time, you have Resistance to all damage except Force damage.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Irresistible Offense is recommended.'],
    [20, 'Body and Mind', 'You have developed your body and mind to new heights. Your Dexterity and Wisdom scores increase by 4, to a maximum of 25.'],
  ],
  Paladin: [
    [1, 'Lay on Hands', 'Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you finish a Long Rest. With that pool, you can restore a total number of Hit Points equal to five times your Paladin level.\n\nAs a Bonus Action, you can touch a creature (which could be yourself) and draw power from the pool of healing to restore a number of Hit Points to that creature, up to the maximum amount remaining in the pool.\n\nYou can also expend 5 Hit Points from the pool of healing power to remove the Poisoned condition from the creature; those points don\'t also restore Hit Points to the creature.'],
    [1, 'Spellcasting', 'You have learned to cast spells through prayer and meditation. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Paladin spells, which appear in the Paladin spell list later in the class\'s description.\n\n**Spell Slots.** The Paladin Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.\n\n**Prepared Spells of Level 1+.** You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Paladin spells. Heroism and Searing Smite are recommended.\n\nThe number of spells on your list increases as you gain Paladin levels, as shown in the Prepared Spells column of the Paladin Features table. Whenever that number increases, choose additional Paladin spells until the number of spells on your list matches the number in the Paladin Features table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 5 Paladin, your list of prepared spells can include six Paladin spells of level 1 or 2 in any combination.\n\nIf another Paladin feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Paladin spells for you.\n\n**Changing Your Prepared Spells.** Whenever you finish a Long Rest, you can replace one spell on your list with another Paladin spell for which you have spell slots.\n\n**Spellcasting Ability.** Charisma is your spellcasting ability for your Paladin spells.\n\n**Spellcasting Focus.** You can use a Holy Symbol as a Spellcasting Focus for your Paladin spells.'],
    [1, 'Weapon Mastery', 'Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Longswords and Javelins.\n\nWhenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Halberds and Flails.'],
    [2, 'Fighting Style', 'You gain a Fighting Style feat of your choice. Instead of choosing one of those feats, you can choose the option below.'],
    [2, 'Paladin\'s Smite', 'You always have the Divine Smite spell prepared. In addition, you can cast it without expending a spell slot, but you must finish a Long Rest before you can cast it in this way again.'],
    [3, 'Channel Divinity', 'You can channel divine energy directly from the Outer Planes, using it to fuel magical effects. You start with one such effect: Divine Sense, which is described below. Other Paladin features give additional Channel Divinity effect options. Each time you use this class\'s Channel Divinity, you choose which effect from this class to create.\n\nYou can use this class\'s Channel Divinity twice. You regain one of its expended uses when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. You gain an additional use when you reach Paladin level 11.\n\nIf a Channel Divinity effect requires a saving throw, the DC equals the spell save DC from this class\'s Spellcasting feature.\n\n> **Divine Sense**\n>\n> As a Bonus Action, you can open your awareness to detect Celestials, Fiends, and Undead. For the next 10 minutes or until you have the Incapacitated condition, you know the location of any creature of those types within 60 feet of yourself, and you know its creature type. Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the Hallow spell.'],
    [3, 'Paladin Subclass', 'You gain a Paladin subclass of your choice. A subclass is a specialization that grants you features at certain Paladin levels. For the rest of your career, you gain each of your subclass\'s features that are of your Paladin level or lower.\n\n**Breaking Your Oath.** A Paladin tries to hold to the highest standards of conduct, but even the most dedicated are fallible. Sometimes a Paladin transgresses their oath.\n\nA Paladin who has broken a vow typically seeks absolution, spending an all-night vigil as a sign of penitence or undertaking a fast. After a rite of forgiveness, the Paladin starts fresh.\n\nIf your Paladin unrepentantly violates their oath, talk to your DM. Your Paladin should probably take a more appropriate subclass or even abandon the class and adopt another one.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Paladin levels 8, 12, and 16.'],
    [5, 'Extra Attack', 'You can attack twice instead of once whenever you take the Attack action on your turn.'],
    [5, 'Faithful Steed', 'You can call on the aid of an otherworldly steed. You always have the Find Steed spell prepared.\n\nYou can also cast the spell once without expending a spell slot, and you regain the ability to do so when you finish a Long Rest.'],
    [6, 'Aura of Protection', 'You radiate a protective, unseeable aura in a 10-foot Emanation that originates from you. The aura is inactive while you have the Incapacitated condition.\n\nYou and your allies in the aura gain a bonus to saving throws equal to your Charisma modifier (minimum bonus of +1).\n\nIf another Paladin is present, a creature can benefit from only one Aura of Protection at a time; the creature chooses which aura while in them.'],
    [7, 'Subclass Feature', 'You gain a feature from your Paladin Subclass.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [9, 'Abjure Foes', 'As a Magic action, you can expend one use of this class\'s Channel Divinity to overwhelm foes with awe. As you present your Holy Symbol or weapon, you can target a number of creatures equal to your Charisma modifier (minimum of one creature) that you can see within 60 feet of yourself. Each target must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute or until it takes any damage. While Frightened in this way, a target can do only one of the following on its turns: move, take an action, or take a Bonus Action.'],
    [10, 'Aura of Courage', 'You and your allies have Immunity to the Frightened condition while in your Aura of Protection. If a Frightened ally enters the aura, that condition has no effect on that ally while there.'],
    [11, 'Radiant Strikes', 'Your strikes now carry supernatural power. When you hit a target with an attack roll using a Melee weapon or an Unarmed Strike, the target takes an extra 1d8 Radiant damage.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [14, 'Restoring Touch', 'When you use Lay On Hands on a creature, you can also remove one or more of the following conditions from the creature: Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned. You must expend 5 Hit Points from the healing pool of Lay On Hands for each of these conditions you remove; those points don\'t also restore Hit Points to the creature.'],
    [15, 'Subclass Feature', 'You gain a feature from your Paladin Subclass.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [18, 'Aura Expansion', 'Your Aura of Protection is now a 30-foot Emanation.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Truesight is recommended.'],
    [20, 'Subclass Feature', 'You gain a feature from your Paladin Subclass.'],
  ],
  Ranger: [
    [1, 'Favored Enemy', 'You always have the Hunter\'s Mark spell prepared. You can cast it twice without expending a spell slot, and you regain all expended uses of this ability when you finish a Long Rest.\n\nThe number of times you can cast the spell without a spell slot increases when you reach certain Ranger levels, as shown in the Favored Enemy column of the Ranger Features table.'],
    [1, 'Spellcasting', 'You have learned to channel the magical essence of nature to cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Ranger spells, which appear in the Ranger spell list later in the class\'s description.\n\n**Spell Slots.** The Ranger Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.\n\n**Prepared Spells of Level 1+.** You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Ranger spells. Cure Wounds and Ensnaring Strike are recommended.\n\nThe number of spells on your list increases as you gain Ranger levels, as shown in the Prepared Spells column of the Ranger Features table. Whenever that number increases, choose additional Ranger spells until the number of spells on your list matches the number in the Ranger Features table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 5 Ranger, your list of prepared spells can include six Ranger spells of level 1 or 2 in any combination.\n\nIf another Ranger feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Ranger spells for you.\n\n**Changing Your Prepared Spells.** Whenever you finish a Long Rest, you can replace one spell on your list with another Ranger spell for which you have spell slots.\n\n**Spellcasting Ability.** Wisdom is your spellcasting ability for your Ranger spells.\n\n**Spellcasting Focus.** You can use a Druidic Focus as a Spellcasting Focus for your Ranger spells.'],
    [1, 'Weapon Mastery', 'Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Longbows and Shortswords.\n\nWhenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Scimitars and Longswords.'],
    [2, 'Deft Explorer', 'Thanks to your travels, you gain the following benefits.\n\n**Expertise.** Choose one of your skill proficiencies with which you lack Expertise. You gain Expertise in that skill.\n\n**Languages.** You know two languages of your choice from the language tables in chapter 2.'],
    [2, 'Fighting Style', 'You gain a Fighting Style feat of your choice. Instead of choosing one of those feats, you can choose the option below.'],
    [3, 'Ranger Subclass', 'You gain a Ranger subclass of your choice. A subclass is a specialization that grants you features at certain Ranger levels. For the rest of your career, you gain each of your subclass\'s features that are of your Ranger level or lower.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Ranger levels 8, 12, and 16.'],
    [5, 'Extra Attack', 'You can attack twice instead of once whenever you take the Attack action on your turn.'],
    [6, 'Roving', 'Your Speed increases by 10 feet while you aren\'t wearing Heavy armor. You also have a Climb Speed and a Swim Speed equal to your Speed.'],
    [7, 'Subclass Feature', 'You gain a feature from your Ranger Subclass.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [9, 'Expertise', 'Choose two of your skill proficiencies with which you lack Expertise. You gain Expertise in those skills.'],
    [10, 'Tireless', 'Primal forces now help fuel you on your journeys, granting you the following benefits.\n\n**Temporary Hit Points.** As a Magic action, you can give yourself a number of Temporary Hit Points equal to 1d8 plus your Wisdom modifier (minimum of 1). You can use this action a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.\n\n**Decrease Exhaustion.** Whenever you finish a Short Rest, your Exhaustion level, if any, decreases by 1.'],
    [11, 'Subclass Feature', 'You gain a feature from your Ranger Subclass.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [13, 'Relentless Hunter', 'Taking damage can\'t break your Concentration on Hunter\'s Mark.'],
    [14, 'Nature\'s Veil', 'You invoke spirits of nature to magically hide yourself. As a Bonus Action, you can give yourself the Invisible condition until the end of your next turn.\n\nYou can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.'],
    [15, 'Subclass Feature', 'You gain a feature from your Ranger Subclass.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [17, 'Precise Hunter', 'You have Advantage on attack rolls against the creature currently marked by your Hunter\'s Mark.'],
    [18, 'Feral Senses', 'Your connection to the forces of nature grants you Blindsight with a range of 30 feet.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Dimensional Travel is recommended.'],
    [20, 'Foe Slayer', 'The damage die of your Hunter\'s Mark is a d10 rather than a d6.'],
  ],
  Rogue: [
    [1, 'Expertise', 'You gain Expertise in two of your skill proficiencies of your choice. Sleight of Hand and Stealth are recommended if you have proficiency in them.\n\nAt Rogue level 6, you gain Expertise in two more of your skill proficiencies of your choice.'],
    [1, 'Sneak Attack', 'You know how to strike subtly and exploit a foe\'s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack roll if you have Advantage on the roll and the attack uses a Finesse or a Ranged weapon. The extra damage\'s type is the same as the weapon\'s type.\n\nYou don\'t need Advantage on the attack roll if at least one of your allies is within 5 feet of the target, the ally doesn\'t have the Incapacitated condition, and you don\'t have Disadvantage on the attack roll.\n\nThe extra damage increases as you gain Rogue levels, as shown in the Sneak Attack column of the Rogue Features table.'],
    [1, 'Thieves\' Cant', 'You picked up various languages in the communities where you plied your roguish talents. You know Thieves\' Cant and one other language of your choice, which you choose from the language tables in chapter 2.'],
    [1, 'Weapon Mastery', 'Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Daggers and Shortbows.\n\nWhenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Scimitars and Shortswords.'],
    [2, 'Cunning Action', 'Your quick thinking and agility allow you to move and act quickly. On your turn, you can take one of the following actions as a Bonus Action: Dash, Disengage, or Hide.'],
    [3, 'Rogue Subclass', 'You gain a Rogue subclass of your choice. A subclass is a specialization that grants you features at certain Rogue levels. For the rest of your career, you gain each of your subclass\'s features that are of your Rogue level or lower.'],
    [3, 'Steady Aim', 'As a Bonus Action, you give yourself Advantage on your next attack roll on the current turn. You can use this feature only if you haven\'t moved during this turn, and after you use it, your Speed is 0 until the end of the current turn.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Rogue levels 8, 10, 12, and 16.'],
    [5, 'Cunning Strike', 'You\'ve developed cunning ways to use your Sneak Attack. When you deal Sneak Attack damage, you can add one of the following Cunning Strike effects. Each effect has a die cost, which is the number of Sneak Attack damage dice you must forgo to add the effect. You remove the die before rolling, and the effect occurs immediately after the attack\'s damage is dealt. For example, if you add the Poison effect, remove 1d6 from the Sneak Attack\'s damage before rolling.\n\nIf a Cunning Strike effect requires a saving throw, the DC equals 8 plus your Dexterity modifier and Proficiency Bonus.\n\n> **Poison (Cost: 1d6)**\n>\n> You add a toxin to your strike, forcing the target to make a Constitution saving throw. On a failed save, the target has the Poisoned condition for 1 minute. At the end of each of its turns, the Poisoned target repeats the save, ending the effect on itself on a success.\n>\n> To use this effect, you must have a Poisoner\'s Kit on your person.\n\n> **Trip (Cost: 1d6)**\n>\n> If the target is Large or smaller, it must succeed on a Dexterity saving throw or have the Prone condition.\n\n> **Withdraw (Cost: 1d6)**\n>\n> Immediately after the attack, you move up to half your Speed without provoking Opportunity Attacks.'],
    [5, 'Uncanny Dodge', 'When an attacker that you can see hits you with an attack roll, you can take a Reaction to halve the attack\'s damage against you (round down).'],
    [6, 'Expertise', 'You gain Expertise in two of your Skill Proficiencies of your choice.'],
    [7, 'Evasion', 'You can nimbly dodge out of the way of certain dangers. When you\'re subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. You can\'t use this feature if you have the Incapacitated condition.'],
    [7, 'Reliable Talent', 'Whenever you make an ability check that uses one of your skill or tool proficiencies, you can treat a d20 roll of 9 or lower as a 10.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [9, 'Subclass Feature', 'You gain a feature from your Rogue Subclass.'],
    [10, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [11, 'Improved Cunning Strike', 'You can use up to two Cunning Strike effects when you deal Sneak Attack damage, paying the die cost for each effect.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [13, 'Subclass Feature', 'You gain a feature from your Rogue Subclass.'],
    [14, 'Devious Strikes', 'You\'ve practiced new ways to use your Sneak Attack deviously. The following effects are now among your Cunning Strike options.\n\n> **Daze (Cost: 2d6)**\n>\n> The target must succeed on a Constitution saving throw, or on its next turn, it can do only one of the following: move or take an action or a Bonus Action.\n\n> **Knock Out (Cost: 6d6)**\n>\n> The target must succeed on a Constitution saving throw, or it has the Unconscious condition for 1 minute or until it takes any damage. The Unconscious target repeats the save at the end of each of its turns, ending the effect on itself on a success.\n\n> **Obscure (Cost: 3d6)**\n>\n> The target must succeed on a Dexterity saving throw, or it has the Blinded condition until the end of its next turn.'],
    [15, 'Slippery Mind', 'Your cunning mind is exceptionally difficult to control. You gain proficiency in Wisdom and Charisma saving throws.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [17, 'Subclass Feature', 'You gain a feature from your Rogue Subclass.'],
    [18, 'Elusive', 'You\'re so evasive that attackers rarely gain the upper hand against you. No attack roll can have Advantage against you unless you have the Incapacitated condition.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of the Night Spirit is recommended.'],
    [20, 'Stroke of Luck', 'You have a marvelous knack for succeeding when you need to. If you fail a D20 Test, you can turn the roll into a 20.\n\nOnce you use this feature, you can\'t use it again until you finish a Short or Long Rest.'],
  ],
  Sorcerer: [
    [1, 'Innate Sorcery', 'An event in your past left an indelible mark on you, infusing you with simmering magic. As a Bonus Action, you can unleash that magic for 1 minute, during which you gain the following benefits:\n\n• The spell save DC of your Sorcerer spells increases by 1.\n• You have Advantage on the attack rolls of Sorcerer spells you cast.\n\nYou can use this feature twice, and you regain all expended uses of it when you finish a Long Rest.'],
    [1, 'Spellcasting', 'Drawing from your innate magic, you can cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Sorcerer spells, which appear in the Sorcerer spell list later in the class\'s description.\n\n**Cantrips.** You know four Sorcerer cantrips of your choice. Light, Prestidigitation, Shocking Grasp, and Sorcerous Burst are recommended. Whenever you gain a Sorcerer level, you can replace one of your cantrips from this feature with another Sorcerer cantrip of your choice.\n\nWhen you reach Sorcerer levels 4 and 10, you learn another Sorcerer cantrip of your choice, as shown in the Cantrips column of the Sorcerer Features table.\n\n**Spell Slots.** The Sorcerer Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.\n\n**Prepared Spells of Level 1+.** You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Sorcerer spells. Burning Hands and Detect Magic are recommended.\n\nThe number of spells on your list increases as you gain Sorcerer levels, as shown in the Prepared Spells column of the Sorcerer Features table. Whenever that number increases, choose additional Sorcerer spells until the number of spells on your list matches the number in the Sorcerer Features table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 3 Sorcerer, your list of prepared spells can include six Sorcerer spells of level 1 or 2 in any combination.\n\nIf another Sorcerer feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Sorcerer spells for you.\n\n**Changing Your Prepared Spells.** Whenever you gain a Sorcerer level, you can replace one spell on your list with another Sorcerer spell for which you have spell slots.\n\n**Spellcasting Ability.** Charisma is your spellcasting ability for your Sorcerer spells.\n\n**Spellcasting Focus.** You can use an Arcane Focus as a Spellcasting Focus for your Sorcerer spells.'],
    [2, 'Font of Magic', 'You can tap into the wellspring of magic within yourself. This wellspring is represented by Sorcery Points, which allow you to create a variety of magical effects.\n\nYou have 2 Sorcery Points, and you gain more as you reach higher levels, as shown in the Sorcery Points column of the Sorcerer Features table. You can\'t have more Sorcery Points than the number shown in the table for your level. You regain all expended Sorcery Points when you finish a Long Rest.\n\nYou can use your Sorcery Points to fuel the options below, along with other features, such as Metamagic, that use those points.\n\n**Converting Spell Slots to Sorcery Points.** You can expend a spell slot to gain a number of Sorcery Points equal to the slot\'s level (no action required).\n\n**Creating Spell Slots.** As a Bonus Action, you can transform unexpended Sorcery Points into one spell slot. The Creating Spell Slots table shows the cost of creating a spell slot of a given level, and it lists the minimum Sorcerer level you must be to create a slot. You can create a spell slot no higher than level 5.\n\nAny spell slot you create with this feature vanishes when you finish a Long Rest.\n\nTable: Creating Spell Slots\n| Spell Slot Level | Sorcery Point Cost | Min. Sorcerer Level |\n| 1 | 2 | 2 |\n| 2 | 3 | 3 |\n| 3 | 5 | 5 |\n| 4 | 6 | 7 |\n| 5 | 7 | 9 |'],
    [2, 'Metamagic', 'Because your magic flows from within, you can alter your spells to suit your needs; you gain two Metamagic options of your choice from "Metamagic Options" later in this class\'s description. You use the chosen options to temporarily modify spells you cast. To use an option, you must spend the number of Sorcery Points that it costs.\n\nYou can use only one Metamagic option on a spell when you cast it unless otherwise noted in one of those options.\n\nWhenever you gain a Sorcerer level, you can replace one of your Metamagic options with one you don\'t know. You gain two more options at Sorcerer level 10 and two more at Sorcerer level 17.'],
    [2, 'Metamagic Options', 'The following options are available to your Metamagic feature. The options are presented in alphabetical order.'],
    [3, 'Sorcerer Subclass', 'You gain a Sorcerer subclass of your choice. A subclass is a specialization that grants you features at certain Sorcerer levels. For the rest of your career, you gain each of your subclass\'s features that are of your Sorcerer level or lower.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Sorcerer levels 8, 12, and 16.'],
    [5, 'Sorcerous Restoration', 'When you finish a Short Rest, you can regain expended Sorcery Points, but no more than a number equal to half your Sorcerer level (round down). Once you use this feature, you can\'t do so again until you finish a Long Rest.'],
    [6, 'Subclass Feature', 'You gain a feature from your Sorcerer subclass.'],
    [7, 'Sorcery Incarnate', 'If you have no uses of Innate Sorcery left, you can use it if you spend 2 Sorcery Points when you take the Bonus Action to activate it.\n\nIn addition, while your Innate Sorcery feature is active, you can use up to two of your Metamagic options on each spell you cast.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [10, 'Metamagic', 'Because your magic flows from within you, you can alter your spells to suit your needs; you gain two Metamagic options of your choice from the "Metamagic Options" section later in this class\'s description.\n\nYou can use only one Metamagic option on a spell when you cast it, unless otherwise noted in one of those options.\n\nWhenever you gain a Sorcerer level, you can replace one of your Metamagic options with one you don\'t know.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [14, 'Subclass Feature', 'You gain a feature from your Sorcerer subclass.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify.'],
    [17, 'Metamagic', 'Because your magic flows from within you, you can alter your spells to suit your needs; you gain two Metamagic options of your choice from the "Metamagic Options" section later in this class\'s description.\n\nYou can use only one Metamagic option on a spell when you cast it, unless otherwise noted in one of those options.\n\nWhenever you gain a Sorcerer level, you can replace one of your Metamagic options with one you don\'t know.'],
    [18, 'Subclass Feature', 'You gain a feature from your Sorcerer subclass.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Dimensional Travel is recommended.'],
    [20, 'Arcane Apotheosis', 'While your Innate Sorcery feature is active, you can use one Metamagic option on each of your turns without spending Sorcery Points on it.'],
  ],
  Warlock: [
    [1, 'Eldritch Invocation Options', 'Eldritch Invocation options appear in alphabetical order.'],
    [1, 'Eldritch Invocations', 'You have unearthed Eldritch Invocations, pieces of forbidden knowledge that imbue you with an abiding magical ability or other lessons. You gain one invocation of your choice, such as Pact of the Tome. Invocations are described in the "Eldritch Invocation Options" section later in this class\'s description.\n\n**Prerequisites.** If an invocation has a prerequisite, you must meet it to learn that invocation. For example, if an invocation requires you to be a level 5+ Warlock, you can select the invocation once you reach Warlock level 5.\n\n**Replacing and Gaining Invocations.** Whenever you gain a Warlock level, you can replace one of your invocations with another one for which you qualify. You can\'t replace an invocation if it\'s a prerequisite for another invocation that you have.\n\nWhen you gain certain Warlock levels, you gain more invocations of your choice, as shown in the Invocations column of the Warlock Features table.\n\nYou can\'t pick the same invocation more than once unless its description says otherwise.'],
    [1, 'Pact Magic', 'Through occult ceremony, you have formed a pact with a mysterious entity to gain magical powers. The entity is a voice in the shadows—its identity unclear—but its boon to you is concrete: the ability to cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Warlock spells, which appear in the Warlock spell list later in the class\'s description.\n\n**Cantrips.** You know two Warlock cantrips of your choice. Eldritch Blast and Prestidigitation are recommended. Whenever you gain a Warlock level, you can replace one of your cantrips from this feature with another Warlock cantrip of your choice.\n\nWhen you reach Warlock levels 4 and 10, you learn another Warlock cantrip of your choice, as shown in the Cantrips column of the Warlock Features table.\n\n**Spell Slots.** The Warlock Features table shows how many spell slots you have to cast your Warlock spells of levels 1–5. The table also shows the level of those slots, all of which are the same level. You regain all expended Pact Magic spell slots when you finish a Short or Long Rest.\n\nFor example, when you\'re a level 5 Warlock, you have two level 3 spell slots. To cast the level 1 spell Witch Bolt, you must spend one of those slots, and you cast it as a level 3 spell.\n\n**Prepared Spells of Level 1+.** You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Warlock spells. Charm Person and Hex are recommended.\n\nThe number of spells on your list increases as you gain Warlock levels, as shown in the Prepared Spells column of the Warlock Features table. Whenever that number increases, choose additional Warlock spells until the number of spells on your list matches the number in the table. The chosen spells must be of a level no higher than what\'s shown in the table\'s Slot Level column for your level. When you reach level 6, for example, you learn a new Warlock spell, which can be of levels 1–3.\n\nIf another Warlock feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Warlock spells for you.\n\n**Changing Your Prepared Spells.** Whenever you gain a Warlock level, you can replace one spell on your list with another Warlock spell of an eligible level.\n\n**Spellcasting Ability.** Charisma is the spellcasting ability for your Warlock spells.\n\n**Spellcasting Focus.** You can use an Arcane Focus as a Spellcasting Focus for your Warlock spells.'],
    [2, 'Magical Cunning', 'You can perform an esoteric rite for 1 minute. At the end of it, you regain expended Pact Magic spell slots but no more than a number equal to half your maximum (round up). Once you use this feature, you can\'t do so again until you finish a Long Rest.'],
    [3, 'Warlock Subclass', 'You gain a Warlock subclass of your choice. A subclass is a specialization that grants you features at certain Warlock levels. For the rest of your career, you gain each of your subclass\'s features that are of your Warlock level or lower.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Warlock levels 8, 12, and 16.'],
    [6, 'Subclass Feature', 'You gain a feature from your Warlock subclass.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [9, 'Contact Patron', 'In the past, you usually contacted your patron through intermediaries. Now you can communicate directly; you always have the Contact Other Plane spell prepared. With this feature, you can cast the spell without expending a spell slot to contact your patron, and you automatically succeed on the spell\'s saving throw.\n\nOnce you cast the spell with this feature, you can\'t do so in this way again until you finish a Long Rest.'],
    [10, 'Subclass Feature', 'You gain a feature from your Warlock subclass.'],
    [11, 'Mystic Arcanum', 'Your patron grants you a magical secret called an arcanum. Choose one level 6 Warlock spell as this arcanum.\n\nYou can cast your arcanum spell once without expending a spell slot, and you must finish a Long Rest before you can cast it in this way again.\n\nAs shown in the Warlock Features table, you gain another Warlock spell of your choice that can be cast in this way when you reach Warlock levels 13 (level 7 spell), 15 (level 8 spell), and 17 (level 9 spell). You regain all uses of your Mystic Arcanum when you finish a Long Rest.\n\nWhenever you gain a Warlock level, you can replace one of your arcanum spells with another Warlock spell of the same level.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [13, 'Mystic Arcanum', 'You gain a level 7 Warlock Spell of your choice.'],
    [14, 'Subclass Feature', 'You gain a feature from your Warlock subclass.'],
    [15, 'Mystic Arcanum', 'You gain a level 8 Warlock Spell of your choice.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [17, 'Mystic Arcanum', 'You gain a level 9 Warlock Spell of your choice.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Fate is recommended.'],
    [20, 'Eldritch Master', 'When you use your Magical Cunning feature, you regain all your expended Pact Magic spell slots.'],
  ],
  Wizard: [
    [1, 'Arcane Recovery', 'You can regain some of your magical energy by studying your spellbook. When you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level equal to no more than half your Wizard level (round up), and none of the slots can be level 6 or higher. For example, if you\'re a level 4 Wizard, you can recover up to two levels\' worth of spell slots, regaining either one level 2 spell slot or two level 1 spell slots.\n\nOnce you use this feature, you can\'t do so again until you finish a Long Rest.'],
    [1, 'Ritual Adept', 'You can cast any spell as a Ritual if that spell has the Ritual tag and the spell is in your spellbook. You needn\'t have the spell prepared, but you must read from the book to cast a spell in this way.'],
    [1, 'Spellcasting', 'As a student of arcane magic, you have learned to cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules with Wizard spells, which appear in the Wizard spell list later in the class\'s description.\n\n**Cantrips.** You know three Wizard cantrips of your choice. Light, Mage Hand, and Ray of Frost are recommended. Whenever you finish a Long Rest, you can replace one of your cantrips from this feature with another Wizard cantrip of your choice.\n\nWhen you reach Wizard levels 4 and 10, you learn another Wizard cantrip of your choice, as shown in the Cantrips column of the Wizard Features table.\n\n**Spellbook.** Your wizardly apprenticeship culminated in the creation of a unique book: your spellbook. It is a Tiny object that weighs 3 pounds, contains 100 pages, and can be read only by you or someone casting Identify. You determine the book\'s appearance and materials, such as a gilt-edged tome or a collection of vellum bound with twine.\n\nThe book contains the level 1+ spells you know. It starts with six level 1 Wizard spells of your choice. Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, and Thunderwave are recommended.\n\nWhenever you gain a Wizard level after 1, add two Wizard spells of your choice to your spellbook. Each of these spells must be of a level for which you have spell slots, as shown in the Wizard Features table. The spells are the culmination of arcane research you do regularly.\n\n**Spell Slots.** The Wizard Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.\n\n**Prepared Spells of Level 1+.** You prepare the list of level 1+ spells that are available for you to cast with this feature. To do so, choose four spells from your spellbook. The chosen spells must be of a level for which you have spell slots.\n\nThe number of spells on your list increases as you gain Wizard levels, as shown in the Prepared Spells column of the Wizard Features table. Whenever that number increases, choose additional Wizard spells until the number of spells on your list matches the number in the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 3 Wizard, your list of prepared spells can include six spells of levels 1 and 2 in any combination, chosen from your spellbook.\n\nIf another Wizard feature gives you spells that you always have prepared, those spells don\'t count against the number of spells you can prepare with this feature, but those spells otherwise count as Wizard spells for you.\n\n**Changing Your Prepared Spells.** Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells there with spells from your spellbook.\n\n**Spellcasting Ability.** Intelligence is your spellcasting ability for your Wizard spells.\n\n**Spellcasting Focus.** You can use an Arcane Focus or your spellbook as a Spellcasting Focus for your Wizard spells.\n\n**Expanding and Replacing a Spellbook.** The spells you add to your spellbook as you gain levels reflect your ongoing magical research, but you might find other spells during your adventures that you can add to the book. You could discover a Wizard spell on a Spell Scroll, for example, and then copy it into your spellbook.\n\n**Copying a Spell into the Book.** When you find a level 1+ Wizard spell, you can copy it into your spellbook if it\'s of a level you can prepare and if you have time to copy it. For each level of the spell, the transcription takes 2 hours and costs 50 GP. Afterward you can prepare the spell like the other spells in your spellbook.\n\n**Copying the Book.** You can copy a spell from your spellbook into another book. This is like copying a new spell into your spellbook but faster, since you already know how to cast the spell. You need spend only 1 hour and 10 GP for each level of the copied spell.\n\nIf you lose your spellbook, you can use the same procedure to transcribe the Wizard spells that you have prepared into a new spellbook. Filling out the remainder of the new book requires you to find new spells to do so. For this reason, many wizards keep a backup spellbook.'],
    [2, 'Scholar', 'While studying magic, you also specialized in another field of study. Choose one of the following skills in which you have proficiency: Arcana, History, Investigation, Medicine, Nature, or Religion. You have Expertise in the chosen skill.'],
    [3, 'Wizard Subclass', 'You gain a Wizard subclass of your choice. A subclass is a specialization that grants you features at certain Wizard levels. For the rest of your career, you gain each of your subclass\'s features that are of your Wizard level or lower.'],
    [4, 'Ability Score Improvement', 'You gain the Ability Score Improvement feat or another a feat of your choice for which you qualify. You gain this feature again at Wizard levels 8, 12, and 16.'],
    [5, 'Memorize Spell', 'Whenever you finish a Short Rest, you can study your spellbook and replace one of the level 1+ Wizard spells you have prepared for your Spellcasting feature with another level 1+ spell from the book.'],
    [6, 'Subclass Feature', 'You gain a feature from your Wizard Subclass.'],
    [8, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [10, 'Subclass Feature', 'You gain a feature from your Wizard Subclass.'],
    [12, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [14, 'Subclass Feature', 'You gain a feature from your Wizard Subclass.'],
    [16, 'Ability Score Improvement', 'You gain the Ability Score Improvement Feat or another a feat of your choice for which you qualify.'],
    [18, 'Spell Mastery', 'You have achieved such mastery over certain spells that you can cast them at will. Choose a level 1 and a level 2 spell in your spellbook that have a casting time of an action. You always have those spells prepared, and you can cast them at their lowest level without expending a spell slot. To cast either spell at a higher level, you must expend a spell slot.\n\nWhenever you finish a Long Rest, you can study your spellbook and replace one of those spells with an eligible spell of the same level from the book.'],
    [19, 'Epic Boon', 'You gain an Epic Boon feat or another a feat of your choice for which you qualify. Boon of Spell Recall is recommended.'],
    [20, 'Signature Spells', 'Choose two level 3 spells in your spellbook as your signature spells. You always have these spells prepared, and you can cast each of them once at level 3 without expending a spell slot. When you do so, you can\'t cast them in this way again until you finish a Short or Long Rest. To cast either spell at a higher level, you must expend a spell slot.'],
  ],
};

// Pick the feature set matching the character's rules edition (2024 falls back to 2014
// for classes without an XPHB version, e.g. Artificer)
function _classFeaturesFor(className, ch) {
  const ed = (ch && ch.edition) || '2024';
  if (ed !== '2014' && typeof CLASS_FEATURES_2024 !== 'undefined' && CLASS_FEATURES_2024[className]) return CLASS_FEATURES_2024[className];
  return CLASS_FEATURES[className] || [];
}

function getClassFeaturesUpToLevel(className, level, ch) {
  const list = _classFeaturesFor(className, ch);
  return list.filter(([lvl]) => lvl <= level).map(([lvl, name, desc]) => ({ name, desc }));
}

function openClassFeaturesModal(charId, className) {
  const ch = db.characters[charId]; if (!ch) return;
  const cls = className || ch.class || '';
  const level = _resClassLevel(ch, cls) || parseInt(ch.level) || 1;
  const allFeats = _classFeaturesFor(cls, ch);

  // Group by level
  const byLevel = {};
  allFeats.forEach(([lvl, name, desc]) => {
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push({ name, desc });
  });

  const unlockedTotal = allFeats.filter(([lvl]) => lvl <= level).length;

  const rows = Object.keys(byLevel).map(Number).sort((a, b) => a - b).map(lvl => {
    const unlocked = lvl <= level;
    const feats = byLevel[lvl].map(f => `
      <div style="margin-bottom:0.8rem;opacity:${unlocked ? 1 : 0.4}">
        <div style="font-weight:600;color:${unlocked ? 'var(--gold-lt)' : 'var(--text-dim)'};font-size:0.85rem;margin-bottom:0.25rem">${esc(f.name)}</div>
        <div class="rules-text rules-text-lg">${renderRulesText(f.desc, { cls, level })}</div>
      </div>`).join('');
    return `
      <div style="margin-bottom:1.1rem">
        <div style="font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${unlocked ? 'var(--gold)' : 'var(--text-dim)'};margin-bottom:0.5rem;padding-bottom:0.25rem;border-bottom:1px solid rgba(var(--accent-rgb),${unlocked ? '0.25' : '0.1'})">
          Level ${lvl}${!unlocked ? '&ensp;<span style="font-weight:400;font-size:0.65rem;opacity:0.55">not yet</span>' : ''}
        </div>
        ${feats}
      </div>`;
  }).join('');

  openModal(`
    <h2 style="margin:0 0 0.2rem">✦ ${esc(cls)} Features</h2>
    <p style="color:var(--text-dim);font-size:0.8rem;margin:0 0 1rem">Level ${level} &middot; ${unlockedTotal} feature${unlockedTotal !== 1 ? 's' : ''} unlocked</p>
    <div style="max-height:62vh;overflow-y:auto;padding-right:0.4rem">
      ${rows || '<p style="color:var(--text-dim)">No feature data available.</p>'}
    </div>
    <div class="form-actions" style="margin-top:1rem"><button class="btn" onclick="closeModal()">Close</button></div>`);

  const modalEl = document.querySelector('#modal-overlay .modal');
  if (modalEl) modalEl.style.maxWidth = '520px';
}

// Rules text (feature/trait/feat descriptions) as formatted HTML. ctx = { cls, level } for "at your level" hints.
function rulesHtml(text, ctx, fallback = 'No description.') {
  const html = renderRulesText(text, ctx);
  return `<div class="sf-desc rules-text">${html || `<p>${esc(fallback)}</p>`}</div>`;
}

function renderFeaturesSection(ch) {
  const allFeatures = ch.featuresList || [];
  const speciesFeatures  = allFeatures.filter(f => f._species);
  const subFeatures      = allFeatures.filter(f => f._subclass);
  const bgFeatures       = allFeatures.filter(f => f._background);
  const featFeatures     = allFeatures.filter(f => f._feat);
  // Class features: either explicitly flagged, or name matches a known class feature (handles old data without _class flag)
  const charClasses      = (ch.classes && ch.classes.length ? ch.classes : [{ class: ch.class, level: ch.level }]);
  const knownClassNames  = new Set(charClasses.flatMap(c => [
    ...(CLASS_FEATURES[c.class] || []),
    ...((typeof CLASS_FEATURES_2024 !== 'undefined' && CLASS_FEATURES_2024[c.class]) || []),
  ]).map(([, name]) => name));
  const classFeatures    = allFeatures.filter(f => !f._subclass && !f._species && !f._background && !f._feat && !f._option && (f._class || knownClassNames.has(f.name)));
  const customFeatures   = allFeatures.filter(f => !f._subclass && !f._species && !f._background && !f._feat && !f._option && !f._class && !knownClassNames.has(f.name));

  // Build a map from resource name → resource object for quick lookup
  const resourceMap = {};
  (ch.resources || []).forEach(r => { resourceMap[r.name] = r; });

  // Look up the level a subclass feature was gained at
  function featLevel(f) {
    const sd = typeof SUBCLASS_DATA !== 'undefined' &&
      SUBCLASS_DATA[f._forClass || ch.class]?.[f._subclass]?.features;
    if (!sd) return null;
    const match = sd.find(s => s.name === f.name);
    return match ? match.level : null;
  }

  // Look up a linked resource for a subclass feature
  function linkedResource(f) {
    const sd = typeof SUBCLASS_DATA !== 'undefined' &&
      SUBCLASS_DATA[f._forClass || ch.class]?.[f._subclass]?.features;
    if (!sd) return null;
    const match = sd.find(s => s.name === f.name);
    if (!match?.resource) return null;
    return resourceMap[match.resource.name] || null;
  }

  function renderResourceMini(r) {
    if (!r) return '';
    const max = resourceMax(r, ch);
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

  // Helper: inline badge style
  function badgeStyle(color) {
    return `style="background:${color};color:#fff;padding:0.1rem 0.4rem;border-radius:3px;font-size:0.65rem;font-weight:bold"`;
  }

  // Species feature cards — teal badge
  const speciesCards = speciesFeatures.map(f => {
    const i = allFeatures.indexOf(f);
    const idKey = `sp-desc-${i}`;
    return `
      <div class="sf-card" id="sp-card-${i}">
        <div class="sf-card-header" onclick="toggleSfCard('${idKey}', this)">
          <span class="sf-source-badge" ${badgeStyle('#14b8a6')}>${esc(f._species)}</span>
          <span class="sf-name">${esc(f.name)}</span>
          <span class="sf-toggle">▼</span>
        </div>
        <div class="sf-card-body hidden" id="${idKey}">
          ${rulesHtml(f.desc)}
        </div>
      </div>`;
  }).join('');

  // Subclass feature cards — default purple sf-source-badge
  const manySubclasses = new Set(subFeatures.map(f => f._subclass)).size > 1;
  const subCards = subFeatures.map(f => {
    const i = allFeatures.indexOf(f);
    const lvl = featLevel(f);
    const res = linkedResource(f);
    const idKey = `sf-desc-${i}`;
    const resRow = res ? (() => {
      const max = resourceMax(res, ch), die = resourceDie(res, ch);
      const recharge = { short: 'Short Rest', long: 'Long Rest', dawn: 'Dawn', manual: 'Manual' }[resourceRecharge(res, ch)] || 'Long Rest';
      return `<div class="sf-res-row">${renderResourceMini(res)}<span>${Math.min(res.current || 0, max)} / ${max}${die ? ` <span class="rt-dice">${esc(die)}</span>` : ''} · ${recharge}</span></div>`;
    })() : '';
    const ctx = { cls: f._forClass || ch.class, level: _resClassLevel(ch, f._forClass || ch.class) };
    return `
      <div class="sf-card" id="sf-card-${i}">
        <div class="sf-card-header sf-card-header-stack" onclick="toggleSfCard('${idKey}', this)">
          <div class="sf-head-row">
            ${manySubclasses ? `<span class="sf-source-badge">${esc(f._subclass)}</span>` : ''}
            <span class="sf-name">${esc(f.name)}</span>
            ${lvl ? `<span class="sf-level">Lv ${lvl}</span>` : ''}
            <span class="sf-toggle">▼</span>
          </div>
          ${resRow}
        </div>
        <div class="sf-card-body hidden" id="${idKey}">
          ${f._placeholder ? rulesHtml('', null, 'No features data yet.') : rulesHtml(f.desc, ctx)}
        </div>
      </div>`;
  }).join('');

  // Background feature cards — gold badge showing background name
  const bgCards = bgFeatures.map(f => {
    const i = allFeatures.indexOf(f);
    const idKey = `bg-desc-${i}`;
    const label = esc(ch.background || 'Background');
    return `
      <div class="sf-card cf-card" id="bg-card-${i}">
        <div class="sf-card-header" onclick="toggleSfCard('${idKey}', this)">
          <span class="sf-source-badge" ${badgeStyle('#f59e0b')}>${label}</span>
          <span class="sf-name">${esc(f.name)}</span>
          <span class="sf-toggle">▼</span>
          <button class="feature-del-btn cf-del-btn" onclick="event.stopPropagation();removeFeature(${i})" title="Remove">&times;</button>
        </div>
        <div class="sf-card-body hidden" id="${idKey}">
          ${rulesHtml(f.desc)}
        </div>
      </div>`;
  }).join('');

  // Feat feature cards — source-coloured badge showing feat source
  const featCards = featFeatures.map(f => {
    const i = allFeatures.indexOf(f);
    const idKey = `ft-desc-${i}`;
    const srcInfo = FEAT_SOURCE_COLORS[f._featSource] || { abbr: f._featSource || 'Feat', color: '#9b6dff' };
    const _AB  = { int:'INT', wis:'WIS', cha:'CHA' };
    const _DIV = `<div style="margin-top:0.5rem;border-top:1px solid rgba(var(--accent-rgb),0.15);padding-top:0.4rem">`;
    let spellSection = '';
    if (f._mi) {
      spellSection = `${_DIV}
          <div style="font-size:0.72rem;color:var(--text-dim);margin-bottom:0.3rem">${esc(f._mi.cls)} list · ${_AB[f._mi.ability] || ''}</div>
          ${(f._mi.cantripNames || []).map(n => `<span class="spell-badge" style="margin:0 2px 2px 0;font-size:0.7rem;display:inline-block">${esc(n)}</span>`).join('')}
          ${f._mi.spellName ? `<span class="spell-badge" style="margin:0 2px 2px 0;font-size:0.7rem;display:inline-block;border-color:#f59e0b;color:#f59e0b">${esc(f._mi.spellName)} <em>1/LR</em></span>` : ''}
          <button class="btn btn-sm" style="margin-top:0.4rem;font-size:0.72rem;display:block" onclick="event.stopPropagation();_editMiFeat(${i})">Edit Spell Choices</button>
        </div>`;
    } else if (/^Magic Initiate\b/.test(f.name)) {
      spellSection = `${_DIV}<button class="btn btn-sm" style="font-size:0.72rem" onclick="event.stopPropagation();_editMiFeat(${i})">Choose Spells</button></div>`;
    } else if (f._sf) {
      const _sfCfg = _sfConfigKey({ name: f.name, source: f._featSource || '' });
      const _fixedNames = [
        ...(_sfCfg?.fixed || []).map(fx => fx.name),
        ...(f._sf.archetype && _sfCfg?.classFixed?.[f._sf.archetype] ? _sfCfg.classFixed[f._sf.archetype].map(x => x.name) : [])
      ];
      const _pickNames = (f._sf.pickNames || []).flat();
      const _allNames  = [..._fixedNames, ..._pickNames];
      const _hasPicks  = !!((_sfCfg?.picks || []).length || _sfCfg?.classChoice);
      const _abilityLine = f._sf.archetype
        ? `${esc(f._sf.archetype)} · ${_AB[f._sf.ability] || _AB[_sfCfg?.ability] || ''}`
        : (_AB[f._sf.ability] || '');
      spellSection = `${_DIV}
          ${_abilityLine ? `<div style="font-size:0.72rem;color:var(--text-dim);margin-bottom:0.3rem">${_abilityLine}</div>` : ''}
          ${_allNames.map(n => `<span class="spell-badge" style="margin:0 2px 2px 0;font-size:0.7rem;display:inline-block">${esc(n)}</span>`).join('')}
          ${_hasPicks ? `<button class="btn btn-sm" style="margin-top:0.4rem;font-size:0.72rem;display:block" onclick="event.stopPropagation();_editSfFeat(${i})">Edit Spell Choices</button>` : ''}
        </div>`;
    } else if (_sfConfigKey({ name: f.name, source: f._featSource || '' })) {
      spellSection = `${_DIV}<button class="btn btn-sm" style="font-size:0.72rem" onclick="event.stopPropagation();_editSfFeat(${i})">Choose Spells</button></div>`;
    }
    return `
      <div class="sf-card cf-card" id="ft-card-${i}">
        <div class="sf-card-header" onclick="toggleSfCard('${idKey}', this)">
          <span class="sf-source-badge" ${badgeStyle(srcInfo.color)}>${esc(srcInfo.abbr)}</span>
          <span class="sf-name">${esc(f.name)}</span>
          <span class="sf-toggle">▼</span>
          <button class="feature-del-btn cf-del-btn" onclick="event.stopPropagation();removeFeatureByName('${jsStr(f.name)}','_feat')" title="Remove">&times;</button>
        </div>
        <div class="sf-card-body hidden" id="${idKey}">
          ${rulesHtml(f.desc)}
          ${f._fromBackground ? `<p style="font-size:0.75rem;color:var(--text-dim);margin-top:0.4rem">Granted by ${esc(f._fromBackground)} background</p>` : ''}
          ${spellSection}
        </div>
      </div>`;
  }).join('');

  // Class features — one card per class, each opening the full modal at that class's level
  const classCard = charClasses.filter(c => _classFeaturesFor(c.class, ch).length).map(c => {
    const total = _classFeaturesFor(c.class, ch).filter(([lvl]) => lvl <= (parseInt(c.level) || 1)).length;
    return `
    <div class="sf-card" onclick="openClassFeaturesModal('${ch.id}','${jsStr(c.class)}')" style="cursor:pointer">
      <div class="sf-card-header">
        <span class="sf-source-badge" ${badgeStyle('#6366f1')}>${esc(c.class || 'Class').toUpperCase()}${charClasses.length > 1 ? ' ' + (parseInt(c.level) || 1) : ''}</span>
        <span class="sf-name" style="flex:1">${total} feature${total !== 1 ? 's' : ''} at your level</span>
        <span style="color:var(--text-dim);font-size:0.72rem">View all ↗</span>
      </div>
    </div>`;
  }).join('');

  // Custom feature cards — editable
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

  // Section order: Species → Subclass → Background → Feat → Custom
  // Track how many sections precede each, for feat-section-first class
  let hasPrev = false;
  function sectionLabel(text) {
    const cls = hasPrev ? 'feat-section-label' : 'feat-section-label feat-section-first';
    hasPrev = true;
    return `<div class="${cls}">${text}</div>`;
  }

  const speciesSection = speciesFeatures.length ? `
    ${sectionLabel('Species &amp; Racial Traits')}
    ${speciesCards}` : '';

  const hasSubclassModalData = _hasSubclassData(ch);
  const subclassModalBtn = hasSubclassModalData
    ? `<button class="btn btn-sm" onclick="openSubclassModal('${ch.id}')" style="font-size:0.7rem;padding:0.2rem 0.5rem;margin-left:0.5rem;vertical-align:middle;text-transform:none;letter-spacing:0">✦ Spells &amp; Tables</button>`
    : '';
  const classSection = classCard ? `
    ${sectionLabel(charClasses.length > 1 ? 'Class Features' : `${esc(ch.class || 'Class')} Features`)}
    ${classCard}` : '';

  // Class options (Invocations, Metamagic, Maneuvers...) — a picker button per group, then the chosen cards
  const optionGroups = classOptionGroups(ch);
  const multiclass = (ch.classes || []).length > 1;
  const optionCards = optionGroups.map(g => {
    const n = g.chosen.length;
    const countColor = n > g.max ? '#ef4444' : n < g.max ? 'var(--gold-lt)' : 'var(--text-dim)';
    const cards = g.chosen.map(f => {
      const i = allFeatures.indexOf(f);
      const idKey = `co-desc-${i}`;
      return `
      <div class="sf-card cf-card" id="co-card-${i}">
        <div class="sf-card-header" onclick="toggleSfCard('${idKey}', this)">
          <span class="sf-source-badge" ${badgeStyle('#0ea5e9')}>${esc(f._optionSource || '')}</span>
          <span class="sf-name">${esc(f.name)}</span>
          <span class="sf-toggle">▼</span>
          <button class="feature-del-btn cf-del-btn" onclick="event.stopPropagation();removeClassOption(${i})" title="Remove">&times;</button>
        </div>
        <div class="sf-card-body hidden" id="${idKey}">
          ${rulesHtml(f.desc, { cls: f._optionClass, level: _resClassLevel(ch, f._optionClass) })}
        </div>
      </div>`;
    }).join('');
    return `
      <div class="sf-card" onclick="openClassOptionPicker('${jsStr(g.key)}')" style="cursor:pointer">
        <div class="sf-card-header">
          <span class="sf-name" style="flex:1;white-space:normal;overflow:visible">${esc(g.label)}${multiclass ? ` <span style="color:var(--text-dim);font-weight:400">(${esc(g.cls)})</span>` : ''}</span>
          <span style="color:${countColor};font-size:0.78rem;font-weight:700;margin-right:0.5rem" title="${n > g.max ? 'More chosen than your level allows' : ''}">${n} / ${g.max}</span>
          <span style="color:var(--text-dim);font-size:0.72rem">${n < g.max ? 'Choose ↗' : 'Change ↗'}</span>
        </div>
      </div>
      ${cards}`;
  }).join('');
  const optionsSection = optionGroups.length ? `
    ${sectionLabel('Class Options')}
    ${optionCards}` : '';

  const subSection = (subFeatures.length || hasSubclassModalData) ? `
    ${sectionLabel((manySubclasses || !subFeatures.length ? '✦ Subclass Features' : `✦ ${esc(subFeatures[0]._subclass)}`) + subclassModalBtn)}
    ${subCards}` : '';

  const bgSection = bgFeatures.length ? `
    ${sectionLabel('Background Features')}
    ${bgCards}` : '';

  const featSection = featFeatures.length ? `
    ${sectionLabel('Feats')}
    ${featCards}` : '';

  const customSection = `
    ${sectionLabel('Custom Features')}
    <div id="features-list">
      ${customRows || '<div class="feature-empty">No custom features yet.</div>'}
    </div>
    <div class="feature-add-row">
      <button class="btn btn-sm feature-add-btn" onclick="addFeatureInline()">+ Add Feature</button>
      <button class="btn btn-sm" onclick="openFeatBrowser()">✦ Browse Feats</button>
    </div>`;

  return `<div class="sheet-panel features-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Features &amp; Traits</div>
    ${speciesSection}
    ${classSection}
    ${optionsSection}
    ${subSection}
    ${bgSection}
    ${featSection}
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
  'Eberron':     { abbr: 'ERLW',  color: '#8b5cf6' },
  "Fizban's":    { abbr: 'FTD',   color: '#eab308' },
  'Sigil and the Outlands': { abbr: 'SatO', color: '#06b6d4' },
};
const FEAT_CAT_COLORS = {
  'General': '#9b6dff', 'Origin': '#f59e0b',
  'Fighting Style': '#ef4444', 'FS:P': '#ef4444', 'FS:R': '#ef4444',
  'EB': '#c084fc', 'Dragonmark': '#0ea5e9',
};
const FEAT_CAT_LABELS = { 'EB': 'Epic Boon', 'FS:P': 'Fighting Style', 'FS:R': 'Fighting Style' };

let _featSearch = '', _featCatFilter = 'All', _featSrcFilter = 'All', _featShowCount = 50;

const FEAT_CAT_OPTS = ['All','General','Origin','Fighting Style','Epic Boon','Dragonmark'];
// Source filter: the familiar books first, then every other book in the feat data
const _FEAT_SRC_FIRST = ['PHB 2024','PHB 2014',"Xanathar's","Tasha's"];
function featSrcOpts() {
  const rest = [...new Set((FEATS_ITEMS_DATA?.feats || []).map(f => f.source))].filter(s => s && !_FEAT_SRC_FIRST.includes(s)).sort();
  return ['All', ..._FEAT_SRC_FIRST, ...rest];
}

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
  const srcBtns = featSrcOpts().map((s,i) =>
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
    _featSrcFilter = featSrcOpts()[idx] || 'All';
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
      <div id="${uid}" style="display:none;width:100%;padding:0.3rem 0.25rem 0.4rem;font-size:0.78rem;color:var(--text-dim);border-top:1px solid rgba(var(--accent-rgb),0.15);margin-top:0.2rem">
        <div class="rules-text">${renderRulesText(f.desc || '')}</div>
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
  if (!f) return;
  if (f.name === 'Magic Initiate') openMagicInitiatePicker(f);
  else if (_sfConfigKey(f)) openSpellFeatPicker(f);
  else addFeatToChar(f.name);
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

// ── Class Options Picker (Invocations, Metamagic, Maneuvers...) ─────────────
let _coState = null;

function _coCurrentGroup(ch) {
  return classOptionGroups(ch).find(g => g.key === _coState.key);
}

function openClassOptionPicker(groupKey) {
  const ch = db.characters[currentCharId];
  if (!ch) return;
  _coState = { key: groupKey, search: '', showAll: false };
  const g = _coCurrentGroup(ch);
  if (!g) return;
  const otherEd = g.edition === '2024' ? '2014' : '2024';
  const hasOtherEd = CLASS_OPTIONS_DATA.options.some(o => o.types.some(t => g.types.includes(t)) && o.edition === otherEd);
  openModal(`<h2 style="margin:0 0 0.2rem">✦ ${esc(g.label)}</h2>
    <p id="co-count" style="color:var(--text-dim);font-size:0.8rem;margin:0 0 0.6rem"></p>
    <input type="text" id="co-search" placeholder="Search ${esc(g.label.toLowerCase())}..." style="width:100%;margin-bottom:0.4rem" oninput="_coState.search=this.value;updateClassOptionResults()">
    ${hasOtherEd ? `<label style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;color:var(--text-dim);margin-bottom:0.5rem;cursor:pointer">
      <input type="checkbox" onchange="_coState.showAll=this.checked;updateClassOptionResults()"> Also show ${otherEd} options</label>` : ''}
    <div id="co-results" style="max-height:55vh;overflow-y:auto"></div>
    <div class="form-actions" style="margin-top:0.8rem"><button class="btn" onclick="closeModal()">Done</button></div>`);
  const modalEl = document.querySelector('#modal-overlay .modal');
  if (modalEl) modalEl.style.maxWidth = '560px';
  setTimeout(() => { updateClassOptionResults(); document.getElementById('co-search')?.focus(); }, 20);
}

function updateClassOptionResults() {
  const el = document.getElementById('co-results');
  const ch = db.characters[currentCharId];
  if (!el || !ch || !_coState) return;
  const g = _coCurrentGroup(ch);
  if (!g) { el.innerHTML = '<p style="color:var(--text-dim)">Your class no longer gets these options.</p>'; return; }

  const n = g.chosen.length;
  const countEl = document.getElementById('co-count');
  if (countEl) countEl.innerHTML = n > g.max
    ? `<span style="color:#ef4444">${n} chosen — your level allows ${g.max}</span>`
    : `${n} of ${g.max} chosen at ${esc(g.cls)} level ${_coClassLevel(ch, g.cls)}`;

  const q = _coState.search.toLowerCase();
  const match = x => !q || x.opt.name.toLowerCase().includes(q) || x.opt.desc.toLowerCase().includes(q);
  const { suggested, other } = classOptionsForGroup(g, ch, _coState.showAll);
  const chosenNames = new Set(g.chosen.map(f => f.name));
  window._coVisible = [];

  const row = ({ opt, status }) => {
    const idx = window._coVisible.push(opt) - 1;
    const uid = 'co-' + idx;
    const taken = chosenNames.has(opt.name);
    const prereq = classOptionPrereqLabel(opt);
    const reason = status.met ? '' : `<div style="font-size:0.68rem;color:#f59e0b;width:100%;padding-left:0.1rem">Requires ${esc(status.unmet.join(' · '))}</div>`;
    const btn = taken && !opt.repeatable
      ? `<button class="btn btn-sm btn-primary" onclick="removeClassOptionByName('${jsStr(opt.name)}')" title="Remove">✓ Chosen</button>`
      : `<button class="btn btn-sm" onclick="addClassOption(${idx})">+ ${taken ? 'Again' : 'Add'}</button>`;
    return `<div class="spell-browser-row" style="flex-wrap:wrap;${status.met ? '' : 'opacity:0.6'}">
      <div class="spell-browser-left">
        <span style="font-size:0.82rem;font-weight:600">${esc(opt.name)}</span>
        <span class="spell-source-badge" style="background:${opt.edition === '2024' ? '#c084fc' : '#6d7b9b'}">${esc(opt.source)}</span>
        ${prereq && status.met ? `<span style="font-size:0.68rem;color:var(--text-dim)">${esc(prereq)}</span>` : ''}
      </div>
      <div style="display:flex;gap:0.3rem;flex-shrink:0">
        <button id="fbt-${uid}" class="btn btn-sm" onclick="toggleFeatDesc('${uid}')">▾</button>
        ${btn}
      </div>
      ${reason}
      <div id="${uid}" style="display:none;width:100%;padding:0.3rem 0.25rem 0.4rem;font-size:0.78rem;color:var(--text-dim);border-top:1px solid rgba(var(--accent-rgb),0.15);margin-top:0.2rem">
        <div class="rules-text">${renderRulesText(opt.desc, { cls: g.cls, level: _resClassLevel(ch, g.cls) })}</div>
      </div>
    </div>`;
  };
  const heading = t => `<div class="feat-section-label" style="margin:0.6rem 0 0.3rem">${t}</div>`;
  const s = suggested.filter(match), o = other.filter(match);
  el.innerHTML =
    heading(`Suggested — you meet the prerequisites (${s.length})`) +
    (s.map(row).join('') || '<p style="color:var(--text-dim);font-size:0.8rem">None match.</p>') +
    (o.length ? heading(`Other options (${o.length})`) + o.map(row).join('') : '');
}

function addClassOption(idx) {
  const ch = db.characters[currentCharId];
  const opt = (window._coVisible || [])[idx];
  const g = ch && _coCurrentGroup(ch);
  if (!opt || !g) return;
  ch.featuresList = ch.featuresList || [];
  ch.featuresList.push({
    name: opt.name, desc: opt.desc,
    _option: opt.types[0], _optionTypes: opt.types, _optionClass: g.cls, _optionSource: opt.source,
  });
  saveData(db);
  renderApp();
  updateClassOptionResults();
}

function removeClassOption(i) {
  const ch = db.characters[currentCharId];
  if (!ch?.featuresList?.[i]?._option) return;
  ch.featuresList.splice(i, 1);
  saveData(db);
  renderApp();
}

function removeClassOptionByName(name) {
  const ch = db.characters[currentCharId];
  const g = ch && _coCurrentGroup(ch);
  const f = g && g.chosen.find(x => x.name === name);
  if (!f) return;
  removeClassOption(ch.featuresList.indexOf(f));
  updateClassOptionResults();
}

// ── Magic Initiate Spell Picker ──────────────────────────────────────────────
const _MI_2014_CLASSES = ['Bard','Cleric','Druid','Sorcerer','Warlock','Wizard'];
const _MI_2024_CLASSES = ['Cleric','Druid','Wizard'];
const _MI_DEFAULT_ABILITY = { Bard:'cha', Cleric:'wis', Druid:'wis', Sorcerer:'cha', Warlock:'cha', Wizard:'int' };
let _miState = null;
let _miSpellPool = [];

function openMagicInitiatePicker(featData, editIdx) {
  if (!allSpellsDb && !spellFetching) fetchAllSpells();
  const is2024 = (featData.source_key || '') === 'XPHB';
  const classes = is2024 ? _MI_2024_CLASSES : _MI_2014_CLASSES;
  const defaultCls = classes[0];
  let miId = Math.random().toString(36).slice(2, 8);
  let initCls = featData._fixedCls || defaultCls;
  let initAbility = _MI_DEFAULT_ABILITY[initCls] || 'wis';
  if (editIdx >= 0) {
    const existingFeat = db.characters[currentCharId]?.featuresList?.[editIdx];
    if (existingFeat?._mi) {
      miId = existingFeat._mi.id || miId;
      initCls = existingFeat._mi.cls || initCls;
      initAbility = existingFeat._mi.ability || initAbility;
    }
  }
  _miState = { featData, editIdx: editIdx ?? -1, miId, step: 1, cls: initCls, ability: initAbility, cantrips: [], spell1: null, is2024, classes: featData._fixedCls ? [featData._fixedCls] : classes };
  // Pre-fill existing selections from tagged known spells when editing
  if (editIdx >= 0) {
    const knownSpells = db.characters[currentCharId]?.spells?.known || [];
    const miKnown = knownSpells.filter(s => typeof s === 'object' && s._miId === miId);
    _miState.cantrips = miKnown.filter(s => s.level_int === 0).map(s => ({
      name: s.name, level_int: 0, school: s.school || '', casting_time: s.casting_time || '', range: s.range || '', components: s.components || '', concentration: s.concentration || 'no', ritual: s.ritual || 'no', dnd_class: s.dnd_class || ''
    }));
    const sp1 = miKnown.find(s => s._miFreeCast);
    if (sp1) _miState.spell1 = { name: sp1.name, level_int: sp1.level_int || 1, school: sp1.school || '', casting_time: sp1.casting_time || '', range: sp1.range || '', components: sp1.components || '', concentration: sp1.concentration || 'no', ritual: sp1.ritual || 'no', dnd_class: sp1.dnd_class || '' };
  }
  _renderMiModal();
}

function _renderMiModal() {
  if (!_miState) return;
  const { step, cls, is2024, classes, ability } = _miState;
  const ABILITY_LABELS = { int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
  if (step === 1) {
    const classBtns = classes.map(c =>
      `<button class="btn btn-sm ${c === cls ? 'btn-primary' : ''}" onclick="_miSetClass('${c}')">${esc(c)}</button>`
    ).join('');
    const abilBtns = ['int', 'wis', 'cha'].map(a =>
      `<button class="btn btn-sm ${ability === a ? 'btn-primary' : ''}" onclick="_miSetAbility('${a}')">${esc(ABILITY_LABELS[a])}</button>`
    ).join('');
    openModal(`<h2>✦ Magic Initiate</h2>
      <p style="color:var(--text-dim);font-size:0.85rem;margin-bottom:0.9rem">Choose a class and spellcasting ability, then pick 2 cantrips and 1 level 1 spell.</p>
      <div class="form-group"><label>Spell List</label><div class="flex gap-1 flex-wrap" style="margin-top:0.3rem">${classBtns}</div></div>
      <div class="form-group" style="margin-top:0.7rem"><label>Spellcasting Ability</label><div class="flex gap-1" style="margin-top:0.3rem">${abilBtns}</div></div>
      <div class="form-actions" style="margin-top:1.1rem">
        <button class="btn" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="_miNextStep(2)">Next: Cantrips →</button>
      </div>`);
  } else if (step === 2) {
    _renderMiSpellStep(0, 2, 'Choose 2 Cantrips', 3);
  } else {
    _renderMiSpellStep(1, 1, 'Choose 1 Level 1 Spell', null);
  }
}

function _renderMiSpellStep(level, count, title, nextStep) {
  const { cls, cantrips, spell1, ability } = _miState;
  const ABILITY_LABELS = { int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
  if (!allSpellsDb) {
    openModal(`<h2>✦ Magic Initiate — ${esc(title)}</h2>
      <p style="color:var(--text-dim);padding:0.5rem 0">Spell data is still loading. Try again in a moment.</p>
      <div class="form-actions">
        <button class="btn" onclick="_miNextStep(${level === 0 ? 1 : 2})">← Back</button>
        <button class="btn btn-primary" onclick="_renderMiModal()">Retry</button>
      </div>`);
    return;
  }
  _miSpellPool = getMergedSpells().filter(sp =>
    sp.level_int === level && (sp.dnd_class || '').toLowerCase().includes(cls.toLowerCase())
  ).slice(0, 300);
  const selectedNames = new Set(level === 0 ? cantrips.map(s => s.name) : (spell1 ? [spell1.name] : []));
  const selCount = selectedNames.size;
  const rows = _miSpellPool.map((sp, idx) => {
    const isSel = selectedNames.has(sp.name);
    const sc = SCHOOL_COLORS[sp.school || ''] || '#7b6d8d';
    return `<div class="spell-browser-row" style="${isSel ? 'background:rgba(var(--accent-rgb),0.1)' : ''}">
      <div class="spell-browser-left" style="flex:1;min-width:0">
        <span class="spell-name" style="font-size:0.82rem">${esc(sp.name)}</span>
        <span class="spell-badge" style="border-color:${sc};color:${sc};font-size:0.58rem">${esc(sp.school || '')}</span>
        ${sp.concentration === 'yes' ? `<span class="spell-tag conc">C</span>` : ''}
        ${sp.ritual === 'yes' ? `<span class="spell-tag ritual">R</span>` : ''}
      </div>
      <button class="btn btn-sm${isSel ? ' btn-primary' : ''}" onclick="_miToggleByIdx(${idx},${level})">${isSel ? '✓' : 'Select'}</button>
    </div>`;
  }).join('');
  const canProceed = selCount >= count;
  const nextBtn = nextStep !== null
    ? `<button class="btn btn-primary" onclick="_miNextStep(${nextStep})" ${canProceed ? '' : 'disabled'}>Next: Level 1 Spell →</button>`
    : `<button class="btn btn-primary" onclick="_miConfirm()" ${canProceed ? '' : 'disabled'}>✓ Add Magic Initiate</button>`;
  openModal(`<h2>✦ Magic Initiate — ${esc(title)}</h2>
    <p style="color:var(--text-dim);font-size:0.82rem;margin-bottom:0.5rem">${esc(cls)} list · ${esc(ABILITY_LABELS[ability] || ability)} · Selected: <strong>${selCount}/${count}</strong></p>
    <div style="max-height:340px;overflow-y:auto;border:1px solid rgba(var(--accent-rgb),0.2);border-radius:6px;padding:0.2rem">
      ${rows || '<p style="padding:0.5rem;color:var(--text-dim)">No spells found for this class.</p>'}
    </div>
    <div class="form-actions" style="margin-top:0.8rem">
      <button class="btn" onclick="_miNextStep(${level === 0 ? 1 : 2})">← Back</button>
      ${nextBtn}
    </div>`);
}

function _miToggleByIdx(idx, level) {
  const sp = _miSpellPool[idx]; if (!sp) return;
  const mini = { name: sp.name, level_int: sp.level_int || 0, school: sp.school || '', casting_time: sp.casting_time || '', range: sp.range || '', components: sp.components || '', concentration: sp.concentration || 'no', ritual: sp.ritual || 'no', dnd_class: sp.dnd_class || '' };
  if (level === 0) {
    const i = _miState.cantrips.findIndex(s => s.name === sp.name);
    if (i >= 0) _miState.cantrips.splice(i, 1);
    else if (_miState.cantrips.length < 2) _miState.cantrips.push(mini);
  } else {
    _miState.spell1 = _miState.spell1?.name === sp.name ? null : mini;
  }
  _renderMiModal();
}

function _miSetClass(cls) {
  _miState.cls = cls;
  _miState.ability = _MI_DEFAULT_ABILITY[cls] || 'wis';
  _miState.cantrips = []; _miState.spell1 = null;
  _renderMiModal();
}

function _miSetAbility(a) { _miState.ability = a; _renderMiModal(); }
function _miNextStep(step) { _miState.step = step; _renderMiModal(); }

function _miConfirm() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const { featData, editIdx, miId, cls, ability, cantrips, spell1 } = _miState;
  ch.featuresList = ch.featuresList || []; ch.spells.known = ch.spells.known || []; ch.resources = ch.resources || [];
  const existing = editIdx >= 0 ? ch.featuresList[editIdx] : null;
  if (existing?._mi) _cleanupMiFeatData(ch, existing._mi);
  const featEntry = { name: featData.name, desc: featData.desc || '', _feat: true, _featSource: featData.source, _mi: { id: miId, cls, ability, cantripNames: cantrips.map(s => s.name), spellName: spell1?.name || null } };
  if (editIdx >= 0) ch.featuresList[editIdx] = featEntry;
  else ch.featuresList.push(featEntry);
  cantrips.forEach(sp => {
    if (!ch.spells.known.some(s => (typeof s === 'object' ? s.name : s) === sp.name))
      ch.spells.known.push({ ...sp, _fromFeat: 'Magic Initiate', _miId: miId, _miAbility: ability });
  });
  if (spell1) {
    if (!ch.spells.known.some(s => (typeof s === 'object' ? s.name : s) === spell1.name))
      ch.spells.known.push({ ...spell1, _fromFeat: 'Magic Initiate', _miId: miId, _miAbility: ability, _miFreeCast: true });
    const resIdx = ch.resources.findIndex(r => r._miId === miId);
    const AB_SHORT = { int: 'INT', wis: 'WIS', cha: 'CHA' };
    const resEntry = { name: `MI: ${spell1.name}`, max: 1, current: 1, recharge: 'long', type: 'pips', custom: true, _fromFeat: 'Magic Initiate', _miId: miId, desc: `Free cast once per Long Rest (no spell slot needed). Spellcasting ability: ${AB_SHORT[ability] || ability}.` };
    if (resIdx >= 0) ch.resources[resIdx] = resEntry;
    else ch.resources.push(resEntry);
  }
  _miState = null;
  saveData(db); closeModal(); renderApp();
}

function _cleanupMiFeatData(ch, miData) {
  const miId = miData?.id; if (!miId) return;
  ch.spells.known = (ch.spells.known || []).filter(s => typeof s !== 'object' || s._miId !== miId);
  ch.resources    = (ch.resources || []).filter(r => r._miId !== miId);
}

function _editMiFeat(i) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const feat = (ch.featuresList || [])[i];
  if (!feat || !/^Magic Initiate\b/.test(feat.name)) return;
  // Backgrounds grant a fixed list, e.g. "Magic Initiate (Cleric)" — always the 2024 feat
  const fixedCls = (feat.name.match(/\((\w+)\)/) || [])[1];
  const feats = FEATS_ITEMS_DATA?.feats || [];
  const featData = fixedCls
    ? feats.find(x => x.name === 'Magic Initiate' && x.source_key === 'XPHB')
    : feats.find(x => x.name === 'Magic Initiate' && x.source === feat._featSource) || feats.find(x => x.name === 'Magic Initiate');
  if (!featData) return;
  openMagicInitiatePicker(fixedCls ? { ...featData, name: feat.name, source: feat._featSource, _fixedCls: fixedCls } : featData, i);
}

// ── Spell-Feat Picker (General) ───────────────────────────────────────────────
const _SF_SRC_MAP = { 'PHB 2024':'XPHB', 'PHB 2014':'PHB', "Xanathar's":'XGE', "Tasha's":'TCE', 'Dragonlance':'DSotDQ', "Strixhaven":'SCC', "Spelljammer":'BAM', "Bigby's":'BGG' };

const SPELL_FEAT_CONFIG = {
  'Blessed Warrior':    { ability:'cha', picks:[{type:'cantrip',count:2,classFilter:'Cleric',label:'2 Cleric Cantrips'}] },
  'Druidic Warrior':    { ability:'wis', picks:[{type:'cantrip',count:2,classFilter:'Druid',label:'2 Druid Cantrips'}] },
  'Artificer Initiate': { ability:'int', picks:[
    {type:'cantrip',count:1,classFilter:'Artificer',label:'1 Artificer Cantrip'},
    {type:'spell',level:1,count:1,classFilter:'Artificer',freeCast:true,label:'1st-Level Artificer Spell (free 1/LR)'}
  ]},
  'Fey-Touched':    { ability:'choose', fixed:[{name:'Misty Step',freeCast:true,level:2}], picks:[{type:'spell',level:1,count:1,schoolFilter:['Divination','Enchantment'],freeCast:true,label:'1st-Level Divination or Enchantment Spell (free 1/LR)'}] },
  'Fey Touched':    { ability:'choose', fixed:[{name:'Misty Step',freeCast:true,level:2}], picks:[{type:'spell',level:1,count:1,schoolFilter:['Divination','Enchantment'],freeCast:true,label:'1st-Level Divination or Enchantment Spell (free 1/LR)'}] },
  'Shadow-Touched': { ability:'choose', fixed:[{name:'Invisibility',freeCast:true,level:2}], picks:[{type:'spell',level:1,count:1,schoolFilter:['Illusion','Necromancy'],freeCast:true,label:'1st-Level Illusion or Necromancy Spell (free 1/LR)'}] },
  'Shadow Touched': { ability:'choose', fixed:[{name:'Invisibility',freeCast:true,level:2}], picks:[{type:'spell',level:1,count:1,schoolFilter:['Illusion','Necromancy'],freeCast:true,label:'1st-Level Illusion or Necromancy Spell (free 1/LR)'}] },
  'Wood Elf Magic': { ability:'wis', fixed:[{name:'Longstrider',freeCast:true,level:1},{name:'Pass Without Trace',freeCast:true,level:2}], picks:[{type:'cantrip',count:1,classFilter:'Druid',label:'1 Druid Cantrip'}] },
  'Telekinetic':    { ability:'choose', fixed:[{name:'Mage Hand',freeCast:false,level:0}] },
  'Telepathic':     { ability:'choose', fixed:[{name:'Detect Thoughts',freeCast:true,level:2}] },
  'Drow High Magic':   { ability:'cha', fixed:[{name:'Detect Magic',freeCast:false,level:1},{name:'Levitate',freeCast:true,level:2},{name:'Dispel Magic',freeCast:true,level:3}] },
  'Fey Teleportation': { ability:'int', fixed:[{name:'Misty Step',freeCast:true,level:2}] },
  'Adept of the Black Robes': { ability:'choose', picks:[{type:'spell',level:2,count:1,schoolFilter:['Enchantment','Necromancy'],freeCast:true,label:'2nd-Level Enchantment or Necromancy Spell (free 1/LR)'}] },
  'Adept of the Red Robes':   { ability:'choose', picks:[{type:'spell',level:2,count:1,schoolFilter:['Illusion','Transmutation'],freeCast:true,label:'2nd-Level Illusion or Transmutation Spell (free 1/LR)'}] },
  'Adept of the White Robes': { ability:'choose', picks:[{type:'spell',level:2,count:1,schoolFilter:['Abjuration','Divination'],freeCast:true,label:'2nd-Level Abjuration or Divination Spell (free 1/LR)'}] },
  'Divinely Favored': {
    classChoice:['Evil','Good','Neutral'], classLabel:'Alignment', ability:'choose',
    classFixed:{ Evil:[{name:'Augury',freeCast:true,level:2}], Good:[{name:'Augury',freeCast:true,level:2}], Neutral:[{name:'Augury',freeCast:true,level:2}] },
    archetypeClassFilter:{ Evil:'Warlock', Good:'Cleric', Neutral:'Druid' },
    picks:[
      {type:'cantrip',count:1,classFilter:'Cleric',label:'1 Cleric Cantrip'},
      {type:'spell',level:1,count:1,classFilter:'{class}',freeCast:true,label:'1st-Level Spell from Alignment Class (free 1/LR)'}
    ]
  },
  'Initiate of High Sorcery': {
    classChoice:['Nuitari','Lunitari','Solinari'], classLabel:'Moon', ability:'choose',
    archetypeSpellList:{
      Nuitari:['Dissonant Whispers','False Life','Hex','Ray of Sickness'],
      Lunitari:['Color Spray','Disguise Self','Feather Fall','Longstrider'],
      Solinari:['Comprehend Languages','Detect Evil and Good','Protection from Evil and Good','Shield']
    },
    picks:[
      {type:'cantrip',count:1,classFilter:'Wizard',label:'1 Wizard Cantrip'},
      {type:'fromList',count:1,freeCast:true,label:'1st-Level Spell from Moon List (free 1/LR)'}
    ]
  },
  'Ritual Caster|PHB': {
    classChoice:['Bard','Cleric','Druid','Sorcerer','Warlock','Wizard'], classLabel:'Class',
    classAbility:{Bard:'cha',Cleric:'wis',Druid:'wis',Sorcerer:'cha',Warlock:'cha',Wizard:'int'},
    picks:[{type:'spell',level:1,count:2,classFilter:'{class}',ritual:true,label:'2 Level-1 Ritual Spells from {class} List'}]
  },
  'Ritual Caster|XPHB': { ability:'choose', picks:[{type:'spell',level:1,count:2,ritual:true,label:'2 Level-1 Ritual Spells (Any Class)'}] },
  'Spell Sniper|PHB': {
    classChoice:['Bard','Cleric','Druid','Sorcerer','Warlock','Wizard'], classLabel:'Class',
    classAbility:{Bard:'cha',Cleric:'wis',Druid:'wis',Sorcerer:'cha',Warlock:'cha',Wizard:'int'},
    picks:[{type:'cantrip',count:1,classFilter:'{class}',label:'1 Attack-Roll Cantrip from {class} List'}]
  }
};

function _sfConfigKey(featData) {
  if (!featData) return null;
  const n = featData.name;
  const rawSrc = featData.source_key || featData.source || featData._featSource || '';
  const sk = _SF_SRC_MAP[rawSrc] || rawSrc;
  return SPELL_FEAT_CONFIG[n + '|' + sk] || SPELL_FEAT_CONFIG[n] || null;
}

function _featBadgeAbbr(featName) {
  return (featName || '').split(/[\s-]+/)
    .filter(w => /^[A-Za-z]/.test(w) && !['of','the','a','an'].includes(w.toLowerCase()))
    .map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'SF';
}

let _sfState = null;

function openSpellFeatPicker(featData, editIdx = -1) {
  const config = _sfConfigKey(featData);
  if (!config) return;
  if (!allSpellsDb && !spellFetching && (config.picks?.length)) fetchAllSpells();

  const existingSf = editIdx >= 0 ? db.characters[currentCharId]?.featuresList?.[editIdx]?._sf : null;
  const sfId = existingSf?.id || Math.random().toString(36).slice(2, 8);

  const hasPicks    = !!(config.picks?.length);
  const needsConfig = !!(config.classChoice || config.ability === 'choose');

  // Fixed-ability, no-picks feats: skip modal on add; on edit, re-apply spells
  if (!needsConfig && !hasPicks) {
    const ch = db.characters[currentCharId]; if (!ch) return;
    ch.featuresList = ch.featuresList || []; ch.spells = ch.spells || {};
    ch.spells.known = ch.spells.known || []; ch.resources = ch.resources || [];
    const ability = config.ability !== 'choose' ? config.ability : null;
    if (editIdx >= 0) {
      const ex = ch.featuresList[editIdx]?._sf;
      if (ex) _cleanupSfFeatData(ch, ex);
      ch.featuresList[editIdx] = { name: featData.name, desc: featData.desc || '', _feat: true, _featSource: featData.source || '', _sf: { id: sfId, ability, archetype: null, pickNames: [] } };
    } else {
      ch.featuresList.push({ name: featData.name, desc: featData.desc || '', _feat: true, _featSource: featData.source || '', _sf: { id: sfId, ability, archetype: null, pickNames: [] } });
    }
    _sfAddSpells(ch, featData.name, config, sfId, ability, null, []);
    saveData(db); renderApp(); return;
  }

  let initArchetype = existingSf?.archetype || null;
  let initAbility   = existingSf?.ability   || (config.ability !== 'choose' ? config.ability : null);
  let initPicks     = existingSf?.pickNames ? existingSf.pickNames.map(arr => [...arr]) : [];
  if (!initAbility && initArchetype && config.classAbility) initAbility = config.classAbility[initArchetype] || null;

  _sfState = { featData, editIdx, sfId, archetype: initArchetype, ability: initAbility, step: needsConfig ? 0 : 1, picks: initPicks, _filter: '' };
  _renderSfModal();
}

function _sfCancel() { _sfState = null; closeModal(); }

function _renderSfModal() {
  if (!_sfState) return;
  const config = _sfConfigKey(_sfState.featData);
  if (!config) return;
  const picks = config.picks || [];
  if (_sfState.step === 0) { _renderSfConfigStep(); return; }
  const pickIdx = _sfState.step - 1;
  if (pickIdx >= 0 && pickIdx < picks.length) _renderSfPickStep(pickIdx);
}

function _renderSfConfigStep() {
  const { featData, archetype, ability } = _sfState;
  const config = _sfConfigKey(featData);
  const archetypeLabel = config.classLabel || 'Class';
  const hasPicks = !!(config.picks?.length);
  const AB_OPTS = [['int','Intelligence'],['wis','Wisdom'],['cha','Charisma']];

  const archetypeSection = config.classChoice ? `
    <div style="margin-bottom:1rem">
      <div style="font-size:0.8rem;color:var(--text-dim);margin-bottom:0.5rem">${esc(archetypeLabel)}:</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem">
        ${config.classChoice.map(c => `<button class="btn btn-sm${archetype===c?' btn-primary':''}" onclick="_sfSetArchetype('${jsStr(c)}')">${esc(c)}</button>`).join('')}
      </div>
    </div>` : '';

  const abilitySection = config.ability === 'choose' ? `
    <div style="margin-bottom:1rem">
      <div style="font-size:0.8rem;color:var(--text-dim);margin-bottom:0.5rem">Spellcasting Ability:</div>
      <div style="display:flex;gap:0.4rem">
        ${AB_OPTS.map(([k,v]) => `<button class="btn btn-sm${ability===k?' btn-primary':''}" onclick="_sfSetAbility('${k}')">${esc(v)}</button>`).join('')}
      </div>
    </div>` : '';

  const canContinue = !!((!config.classChoice || archetype) && (config.ability !== 'choose' || ability));

  openModal(`
    <h3 style="margin:0 0 1rem">${esc(featData.name)}</h3>
    ${archetypeSection}
    ${abilitySection}
    <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.5rem">
      <button class="btn" onclick="_sfCancel()">Cancel</button>
      <button class="btn btn-primary" onclick="${hasPicks ? '_sfNextStep(1)' : '_sfConfirm()'}" ${canContinue ? '' : 'disabled'}>${hasPicks ? 'Choose Spells →' : 'Add Feat'}</button>
    </div>`);
}

function _sfSetArchetype(a) {
  if (!_sfState) return;
  _sfState.archetype = a;
  const cfg = _sfConfigKey(_sfState.featData);
  if (cfg?.classAbility?.[a]) _sfState.ability = cfg.classAbility[a];
  _renderSfConfigStep();
}

function _sfSetAbility(a) { if (_sfState) { _sfState.ability = a; _renderSfConfigStep(); } }

function _sfNextStep(step) {
  if (!_sfState) return;
  _sfState._filter = '';
  _sfState.step = step;
  _renderSfModal();
}

function _sfGetPool(pick, state) {
  const config = _sfConfigKey(state.featData);
  const all = getMergedSpells();
  if (pick.type === 'fromList') {
    const names = config.archetypeSpellList?.[state.archetype] || [];
    return all.filter(sp => names.includes(sp.name));
  }
  let pool = all;
  if (pick.type === 'cantrip') pool = pool.filter(sp => sp.level_int === 0);
  else if (pick.type === 'spell') pool = pool.filter(sp => sp.level_int === pick.level);
  let classF = pick.classFilter;
  if (classF === '{class}') classF = config.archetypeClassFilter?.[state.archetype] || state.archetype || '';
  if (classF) pool = pool.filter(sp => sp.dnd_class && sp.dnd_class.includes(classF));
  if (pick.schoolFilter?.length) pool = pool.filter(sp => pick.schoolFilter.includes(sp.school));
  if (pick.ritual) pool = pool.filter(sp => sp.ritual === 'yes');
  return pool;
}

function _sfSetFilter(val, pickIdx) {
  if (!_sfState) return;
  _sfState._filter = val;
  _renderSfPickStep(pickIdx);
}

function _renderSfPickStep(pickIdx) {
  if (!_sfState) return;
  const config = _sfConfigKey(_sfState.featData);
  const picks = config.picks || [];
  const pick  = picks[pickIdx];
  if (!pick) return;

  const pool = _sfGetPool(pick, _sfState);
  const needsConfig = !!(config.classChoice || config.ability === 'choose');

  if (!allSpellsDb) {
    openModal(`
      <h3 style="margin:0 0 1rem">${esc(_sfState.featData.name)}</h3>
      <p style="color:var(--text-dim)">Loading spell list…</p>
      <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn" onclick="${needsConfig ? '_sfNextStep(0)' : '_sfCancel()'}">${needsConfig ? '← Back' : 'Cancel'}</button>
        <button class="btn btn-primary" onclick="_renderSfModal()">Retry</button>
      </div>`);
    return;
  }

  const state    = _sfState;
  const curPick  = state.picks[pickIdx] || [];
  let classF = pick.classFilter;
  if (classF === '{class}') classF = config.archetypeClassFilter?.[state.archetype] || state.archetype || '';
  const label = pick.label.replace('{class}', classF || '');
  const totalSteps = picks.length;
  const stepLabel  = totalSteps > 1 ? ` (${pickIdx + 1}/${totalSteps})` : '';
  const backStep   = pickIdx === 0 ? (needsConfig ? 0 : 'cancel') : pickIdx;
  const isLast     = pickIdx + 1 >= totalSteps;
  const sfFilter   = (state._filter || '').toLowerCase();
  const filtered   = pool.filter(sp => !sfFilter || sp.name.toLowerCase().includes(sfFilter));

  const rows = filtered.map(sp => {
    const sel = curPick.includes(sp.name);
    const sc  = _schoolColor(sp.school || '');
    return `<div class="spell-list-item" onclick="_sfToggle(${pool.indexOf(sp)},${pickIdx})"
        style="cursor:pointer;padding:0.4rem 0.6rem;border-radius:6px;margin-bottom:2px;${sel ? 'background:rgba(var(--accent-rgb),0.18)' : ''}">
      <div style="display:flex;align-items:center;gap:0.4rem">
        <span style="flex:1;font-size:0.88rem">${esc(sp.name)}</span>
        <span class="spell-badge" style="font-size:0.65rem;border-color:${sc};color:${sc}">${esc(sp.school || '')}</span>
        ${sp.ritual === 'yes' ? `<span class="spell-tag ritual">R</span>` : ''}
        ${sp.concentration === 'yes' ? `<span class="spell-tag conc">C</span>` : ''}
        ${sel ? `<span style="color:var(--accent);font-size:0.9rem">✓</span>` : ''}
      </div>
    </div>`;
  }).join('');

  const selected   = curPick.length;
  const needed     = pick.count;
  const canProceed = selected === needed;

  openModal(`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
      <h3 style="margin:0">${esc(state.featData.name)}</h3>
      <span style="font-size:0.8rem;color:var(--text-dim)">${selected}/${needed} chosen${stepLabel}</span>
    </div>
    <div style="font-size:0.82rem;color:var(--text-dim);margin-bottom:0.6rem">${esc(label)}</div>
    <input id="sf-pick-filter" type="text" class="search-input" placeholder="Search spells…" value="${esc(sfFilter)}"
      oninput="_sfSetFilter(this.value,${pickIdx})" style="width:100%;margin-bottom:0.6rem;box-sizing:border-box">
    <div style="max-height:55vh;overflow-y:auto">${rows || '<p style="color:var(--text-dim);text-align:center;padding:1rem">No spells found.</p>'}</div>
    <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:0.75rem">
      <button class="btn" onclick="${backStep === 'cancel' ? '_sfCancel()' : '_sfNextStep(' + backStep + ')'}">${backStep === 'cancel' ? 'Cancel' : '← Back'}</button>
      <button class="btn btn-primary" onclick="${isLast ? '_sfConfirm()' : '_sfNextStep(' + (pickIdx + 2) + ')'}" ${canProceed ? '' : 'disabled'}>${isLast ? 'Confirm →' : 'Next →'}</button>
    </div>`);
}

function _sfToggle(idx, pickIdx) {
  if (!_sfState) return;
  const config = _sfConfigKey(_sfState.featData);
  const pick   = (config.picks || [])[pickIdx]; if (!pick) return;
  const pool   = _sfGetPool(pick, _sfState);
  const sp     = pool[idx]; if (!sp) return;
  _sfState.picks = _sfState.picks || [];
  const cur    = _sfState.picks[pickIdx] = _sfState.picks[pickIdx] || [];
  const i = cur.indexOf(sp.name);
  if (i >= 0) cur.splice(i, 1);
  else if (cur.length < pick.count) cur.push(sp.name);
  _renderSfPickStep(pickIdx);
}

function _sfAddSpells(ch, featName, config, sfId, ability, archetype, pickNamesArr) {
  const AB_SHORT = { int:'INT', wis:'WIS', cha:'CHA' };
  const abStr = AB_SHORT[ability] || '';
  const all = getMergedSpells();
  const resolve = (name, levelHint) => {
    const found = all.find(s => s.name.toLowerCase() === name.toLowerCase());
    return found || { name, level_int: levelHint ?? 1, school:'', casting_time:'', range:'', components:'', concentration:'no', ritual:'no', dnd_class:'', desc:'' };
  };

  const fixedList = [
    ...(config.fixed || []),
    ...(archetype && config.classFixed?.[archetype] ? config.classFixed[archetype] : [])
  ];
  fixedList.forEach(fx => {
    const sp = resolve(fx.name, fx.level);
    const spLevel = fx.level ?? sp.level_int;
    if (!ch.spells.known.some(s => (typeof s === 'object' ? s.name : s) === sp.name))
      ch.spells.known.push({ ...sp, _fromFeat: featName, _sfId: sfId, _sfAbility: ability, _sfFixed: true, _sfFreeCast: !!fx.freeCast });
    if (fx.freeCast && spLevel > 0) {
      const res = { name: `${featName}: ${sp.name}`, max: 1, current: 1, recharge: 'long', type: 'pips', custom: true, _fromFeat: featName, _sfId: sfId, desc: `Free cast 1/Long Rest.${abStr ? ' Ability: ' + abStr + '.' : ''}` };
      const ei = ch.resources.findIndex(r => r._sfId === sfId && r.name === res.name);
      if (ei >= 0) ch.resources[ei] = res; else ch.resources.push(res);
    }
  });

  (config.picks || []).forEach((pick, pi) => {
    (pickNamesArr[pi] || []).forEach(name => {
      const sp = resolve(name, pick.level ?? 0);
      if (!ch.spells.known.some(s => (typeof s === 'object' ? s.name : s) === sp.name))
        ch.spells.known.push({ ...sp, _fromFeat: featName, _sfId: sfId, _sfAbility: ability, _sfPickIdx: pi, _sfFreeCast: !!pick.freeCast });
      if (pick.freeCast) {
        const res = { name: `${featName}: ${sp.name}`, max: 1, current: 1, recharge: 'long', type: 'pips', custom: true, _fromFeat: featName, _sfId: sfId, desc: `Free cast 1/Long Rest.${abStr ? ' Ability: ' + abStr + '.' : ''}` };
        const ei = ch.resources.findIndex(r => r._sfId === sfId && r.name === res.name);
        if (ei >= 0) ch.resources[ei] = res; else ch.resources.push(res);
      }
    });
  });
}

function _sfConfirm() {
  if (!_sfState) return;
  const { featData, editIdx, sfId, ability, archetype, picks } = _sfState;
  const config = _sfConfigKey(featData); if (!config) return;
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.featuresList = ch.featuresList || []; ch.spells = ch.spells || {};
  ch.spells.known = ch.spells.known || []; ch.resources = ch.resources || [];
  if (editIdx >= 0) {
    const ex = ch.featuresList[editIdx]?._sf;
    if (ex) _cleanupSfFeatData(ch, ex);
  }
  const featEntry = { name: featData.name, desc: featData.desc || '', _feat: true, _featSource: featData.source || '', _sf: { id: sfId, ability, archetype, pickNames: picks.map(arr => [...(arr || [])]) } };
  if (editIdx >= 0) ch.featuresList[editIdx] = featEntry;
  else ch.featuresList.push(featEntry);
  _sfAddSpells(ch, featData.name, config, sfId, ability, archetype, picks);
  _sfState = null;
  closeModal(); saveData(db); renderApp();
}

function _cleanupSfFeatData(ch, sfData) {
  if (!sfData?.id) return;
  const sfId = sfData.id;
  ch.spells = ch.spells || {}; ch.spells.known = ch.spells.known || [];
  ch.resources = ch.resources || [];
  ch.spells.known = ch.spells.known.filter(s => !(typeof s === 'object' && s._sfId === sfId));
  ch.resources    = ch.resources.filter(r => r._sfId !== sfId);
}

function _editSfFeat(i) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const feat = (ch.featuresList || [])[i]; if (!feat) return;
  const config = _sfConfigKey({ name: feat.name, source: feat._featSource || '' }); if (!config) return;
  const featData = (FEATS_ITEMS_DATA?.feats || []).find(x => x.name === feat.name && x.source === feat._featSource)
    || (FEATS_ITEMS_DATA?.feats || []).find(x => x.name === feat.name)
    || { name: feat.name, desc: feat.desc || '', source: feat._featSource || '' };
  openSpellFeatPicker(featData, i);
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
  if (!pool.length) { showAlert('No items match the current filters.'); return; }
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
      <div id="${uid}" style="display:none;width:100%;padding:0.3rem 0.25rem 0.4rem;font-size:0.78rem;color:var(--text-dim);border-top:1px solid rgba(var(--accent-rgb),0.15);margin-top:0.2rem">
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
    showConfirm(`"${esc(item.name)}" ${esc(item.attunement)}. Add to attuned items?`, () => {
      ch.attunedItems = ch.attunedItems || [];
      if (!ch.attunedItems.includes(item.name)) ch.attunedItems.push(item.name);
      saveData(db); updateMagicResults(); renderApp();
    }, () => { saveData(db); updateMagicResults(); renderApp(); });
    return;
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

// Languages a source granted are recorded in ch.languageSources ("species" / "class"), so a
// species or class change swaps them without touching languages picked by hand.
function _grantLanguages(ch, langs, source) {
  ch.knownLanguages = ch.knownLanguages || ['Common'];
  ch.languageSources = ch.languageSources || {};
  langs.forEach(l => {
    if (!ch.knownLanguages.includes(l)) { ch.knownLanguages.push(l); ch.languageSources[l] = source; }
  });
}
function _revokeLanguages(ch, source, keep = []) {
  const src = ch.languageSources || {};
  ch.knownLanguages = (ch.knownLanguages || []).filter(l => src[l] !== source || keep.includes(l));
  Object.keys(src).forEach(l => { if (src[l] === source && !keep.includes(l)) delete src[l]; });
}
function _applySpeciesLanguages(ch) {
  _revokeLanguages(ch, 'species');
  if (!ch.race) return;
  _grantLanguages(ch, speciesLanguages(ch.race, ch.raceEdition || (ch.edition === '2014' ? '2014' : '2024')).fixed, 'species');
}
function _syncClassLanguages(ch) {
  const want = classLanguages(ch).filter(l => !(ch.dismissedLanguages || []).includes(l));
  _revokeLanguages(ch, 'class', want);
  _grantLanguages(ch, want, 'class');
}

function addProficiency(item) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const p = String(item || '').trim(); if (!p) return;
  ch.proficiencies = mergeProfString(ch.proficiencies, [p]);
  saveData(db); renderApp();
}
function addProficiencyFromInput() {
  const el = document.getElementById('prof-add-input');
  if (el && el.value.trim()) addProficiency(el.value);
}
function removeProficiency(item) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const k = String(item).toLowerCase();
  ch.proficiencies = joinProficiencies(splitProficiencies(ch.proficiencies).filter(p => p.toLowerCase() !== k));
  if (ch.profSources) delete ch.profSources[k];
  saveData(db); renderApp();
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
  // A class language removed on purpose stays removed
  if ((ch.languageSources || {})[lang] === 'class') ch.dismissedLanguages = [...new Set([...(ch.dismissedLanguages || []), lang])];
  if (ch.languageSources) delete ch.languageSources[lang];
  saveData(db);
  renderApp();
}

function renderProficienciesLanguages(ch) {
  const src = ch.profSources || {};
  const items = splitProficiencies(ch.proficiencies);
  const toolInfo = name => (typeof TOOLS_DATA !== 'undefined' ? TOOLS_DATA : []).find(t => {
    const a = t.name.toLowerCase(), b = name.toLowerCase();
    return a === b || b.includes(a);
  });
  const GROUPS = [['armor', 'Armor'], ['weapons', 'Weapons'], ['tools', 'Tools'], ['other', 'Other']];
  const groupsHtml = GROUPS.map(([cat, label]) => {
    const list = items.filter(p => proficiencyCategory(p) === cat);
    if (!list.length) return '';
    return `<div class="prof-group" data-cat="${cat}">
      <span class="prof-group-label">${label}</span>
      <div class="prof-chips">${list.map(p => {
        const info = cat === 'tools' ? toolInfo(p) : null;
        const from = src[p.toLowerCase()];
        return `<span class="prof-chip"${info?.desc ? ` title="${esc(info.desc)}"` : ''}>
          <span class="prof-chip-name">${esc(p)}</span>${from ? `<span class="prof-chip-src">${esc(from)}</span>` : ''}
          <button class="prof-chip-remove" data-prof="${esc(p)}" onclick="removeProficiency(this.dataset.prof)" title="Remove">×</button>
        </span>`;
      }).join('')}</div>
    </div>`;
  }).join('');
  const suggestions = [...new Set(['Light armor', 'Medium armor', 'Heavy armor', 'Shields', 'Simple weapons', 'Martial weapons',
    ...(typeof TOOLS_DATA !== 'undefined' ? TOOLS_DATA : []).map(t => t.name)])].filter(n => !items.some(p => p.toLowerCase() === n.toLowerCase()));

  const known = ch.knownLanguages || ['Common'];
  const langSrc = ch.languageSources || {};
  const pills = known.map(l => `<span class="lang-pill">${esc(l)}${langSrc[l] ? `<span class="prof-chip-src">${langSrc[l] === 'species' ? esc(ch.race || 'species') : 'class'}</span>` : ''}<button class="lang-pill-remove" data-lang="${esc(l)}" onclick="removeLanguage(this.dataset.lang)" title="Remove">×</button></span>`).join('');
  const groups = languageGroups(ch).map(g => ({ ...g, languages: g.languages.filter(l => !known.includes(l)) })).filter(g => g.languages.length);
  const dropdown = groups.length ? `
    <select class="lang-add-select" onchange="if(this.value){addLanguage(this.value);this.value=''}">
      <option value="">+ Add language…</option>
      ${groups.map(g => `<optgroup label="${g.label}">${g.languages.map(l => `<option value="${esc(l)}">${esc(l)}</option>`).join('')}</optgroup>`).join('')}
    </select>` : '';
  // 2024: every character knows Common plus two languages of their choice
  const missing = ch.edition !== '2014' ? Math.max(0, 3 - known.length) : 0;
  const langHint = missing ? `<div class="lang-hint">2024 rules: you know Common plus two languages — choose ${missing} more language${missing > 1 ? 's' : ''}.</div>` : '';

  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Proficiencies &amp; Languages</div>
    ${groupsHtml || '<div class="feature-empty">No proficiencies yet.</div>'}
    <div class="prof-add-row">
      <input type="text" id="prof-add-input" list="prof-suggestions" placeholder="Add armor, weapon, tool…" onkeydown="if(event.key==='Enter')addProficiencyFromInput()">
      <datalist id="prof-suggestions">${suggestions.map(n => `<option value="${esc(n)}">`).join('')}</datalist>
      <button class="btn btn-sm" onclick="addProficiencyFromInput()">Add</button>
    </div>
    <div class="cs-field-label" style="margin:0.6rem 0 0.3rem">Languages</div>
    <div class="lang-pills-row">${pills}${dropdown}</div>
    ${langHint}
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


function renderEncumbrance(ch) {
  const w = carriedWeight(ch), cap = carryCapacity(ch), status = encumbranceStatus(w.total, cap);
  const pct = cap.carry > 0 ? Math.min(100, Math.round((w.total / cap.carry) * 100)) : 0;
  const barClass = status.level !== 'ok' ? 'low' : pct >= 66 ? 'mid' : '';
  const lb = n => `${+n.toFixed(2)} lb`;
  const str = parseInt(ch.abilities?.str) || 10;
  return `<div class="sheet-panel enc-panel" id="encumbrance-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Encumbrance</div>
    <div class="enc-total"><span class="enc-carried">${+w.total.toFixed(2)} / ${cap.carry} lb</span>
      <span class="text-dim">carry limit (STR ${str} × 15${cap.powerful ? ' × 2, Powerful Build' : ''})</span></div>
    <div class="hp-bar-wrap"><div class="hp-bar ${barClass}" style="width:${pct}%"></div></div>
    ${status.text ? `<div class="enc-status enc-${status.level}">${esc(status.text)}</div>` : ''}
    <div class="enc-breakdown">
      <span>Items ${lb(w.items)}</span>
      <span>Coins ${lb(w.coins)}</span>
      <label title="Anything the sheet can't weigh: loot, mounts' packs, homebrew items">Other
        <input type="number" min="0" step="0.5" value="${w.other}" oninput="setCarryOther(this.value)"> lb</label>
    </div>
    <div class="enc-note text-dim">Drag, lift or push up to ${cap.push} lb (Speed 5 ft above ${cap.carry} lb).</div>
    ${w.unknown.length ? `<div class="enc-note enc-unknown">No weight known for: ${w.unknown.map(esc).join(', ')} — add them under Other.</div>` : ''}
  </div>`;
}
// Redraws just this panel, so typing coins or Other keeps focus in the input
function _refreshEncumbrance() {
  const ch = db.characters[currentCharId], el = document.getElementById('encumbrance-panel');
  if (ch && el) el.outerHTML = renderEncumbrance(ch);
}
function setCarryOther(value) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.carryWeight = Math.max(0, parseFloat(value) || 0);
  _queueSave();
  const el = document.getElementById('encumbrance-panel'); if (!el) return;
  // Swap in the new total, bar and status but keep the input being typed in
  const next = document.createElement('div'); next.innerHTML = renderEncumbrance(ch);
  el.querySelector('.enc-total').replaceWith(next.querySelector('.enc-total'));
  el.querySelector('.hp-bar-wrap').replaceWith(next.querySelector('.hp-bar-wrap'));
  el.querySelector('.enc-status')?.remove();
  const status = next.querySelector('.enc-status'); if (status) el.querySelector('.hp-bar-wrap').after(status);
}



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
function removeFeature(i) {
  const ch = db.characters[currentCharId];
  if (!ch || !ch.featuresList) return;
  const target = ch.featuresList[i];
  if (target !== undefined) {
    if (target._mi) _cleanupMiFeatData(ch, target._mi);
    if (target._sf) _cleanupSfFeatData(ch, target._sf);
    ch.featuresList.splice(i, 1);
  }
  saveData(db); renderApp();
}
function removeFeatureByName(name, flag) {
  const ch = db.characters[currentCharId];
  if (!ch || !ch.featuresList) return;
  const idx = ch.featuresList.findIndex(f =>
    f.name === name && (flag ? f[flag] : true)
  );
  if (idx >= 0) {
    const feat = ch.featuresList[idx];
    if (feat._mi) _cleanupMiFeatData(ch, feat._mi);
    if (feat._sf) _cleanupSfFeatData(ch, feat._sf);
    ch.featuresList.splice(idx, 1);
  }
  saveData(db); renderApp();
}
function updateFeatureField(i, field, value) {
  const ch = db.characters[currentCharId];
  if (ch.featuresList && ch.featuresList[i]) ch.featuresList[i][field] = value;
  _queueSave();
}
function ch_edition(ed) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (ch.edition === ed) return;
  ch.edition = ed;
  // Refresh stored class features so their text matches the new edition
  ch.featuresList = (ch.featuresList || []).filter(f => !f._class);
  populateClassFeatures(currentCharId);
  saveData(db); renderApp();
}

function populateClassFeatures(charIdOverride) {
  const charId = charIdOverride || currentCharId;
  const ch = db.characters[charId]; if (!ch) return;
  const cls = ch.class || ch.className || '';
  const lvl = parseInt(ch.level) || 1;
  const feats = getClassFeaturesUpToLevel(cls, lvl, ch);
  if (!feats.length) return;
  const existingNames = new Set((ch.featuresList || []).map(f => f.name));
  const newFeats = feats.filter(f => !existingNames.has(f.name) && f.name !== 'ASI');
  (ch.featuresList = ch.featuresList || []);
  newFeats.forEach(f => ch.featuresList.push({ ...f, _class: cls }));
  if (!charIdOverride) { saveData(db); renderApp(); } // only save/render if called from current character
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
  const passive = (skill, ab) => 10 + skillBonus(ch, skill, ab, pb);
  const senses = detectSenses(ch);
  return `<div class="sheet-panel" style="margin-top:0.6rem">
    <div class="cs-section-label">Senses</div>
    <div class="senses-passive-grid">
      <div class="senses-passive-row"><span>Passive Perception</span><span class="senses-val">${passivePerception(ch, pb)}</span></div>
      <div class="senses-passive-row"><span>Passive Investigation</span><span class="senses-val">${passive('Investigation', 'int')}</span></div>
      <div class="senses-passive-row"><span>Passive Insight</span><span class="senses-val">${passive('Insight', 'wis')}</span></div>
    </div>
    <div class="senses-special">${senses.length
      ? senses.map(s => `<span class="sense-chip">${s.sense} ${s.range} ft<span class="prof-chip-src">${esc(s.source)}</span></span>`).join('')
      : '<span class="feature-empty">No special senses.</span>'}</div>
    <textarea class="sheet-textarea" rows="2" placeholder="Other senses — from items, spells…" oninput="ch_field('otherSenses',this.value)">${esc(ch.otherSenses || '')}</textarea>
  </div>`;
}

// ── Character Sheet — Main Render ──────────────────────────────────────────────
// ── Resources Panel ───────────────────────────────────────────────────────────
// ── Resources Panel ───────────────────────────────────────────────────────────
function renderResourceCard(r, i, ch) {
  const max = resourceMax(r, ch);
  const current = Math.min(r.current || 0, max);
  const rechargeLabel = { short: 'Short Rest', long: 'Long Rest', dawn: 'Dawn', manual: 'Manual' }[resourceRecharge(r, ch)] || 'Long Rest';
  const die = resourceDie(r, ch);
  const dieBadge = die ? `<span class="res-die-badge">${die}</span>` : '';
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
  const max = resourceMax(r, ch);
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
  const max = resourceMax(r, ch);
  r.current = Math.max(0, Math.min(max, (r.current || 0) + delta));
  saveData(db); renderApp();
}

function setResourceCurrent(index, val) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const r = ch.resources[index]; if (!r) return;
  const max = resourceMax(r, ch);
  r.current = Math.max(0, Math.min(max, Math.floor(val) || 0));
  saveData(db); renderApp();
}

function deleteResource(index) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const r = ch.resources[index];
  // Remember deleted class trackers so syncClassResources doesn't bring them back
  if (r && r._baseClass) ch.dismissedResources = [...new Set([...(ch.dismissedResources || []), r.name])];
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
  const prev = index === -1 ? null : ch.resources[index];
  if (prev && !prev.custom) {
    // Class resource: keep its formula; a changed max becomes a manual override
    Object.assign(prev, {
      name, type: document.getElementById('re-type').value || prev.type,
      die: document.getElementById('re-die').value || null,
      recharge: document.getElementById('re-recharge').value || prev.recharge,
      source: document.getElementById('re-source').value.trim(),
      desc: document.getElementById('re-desc').value.trim(),
    });
    if (max !== prev.max) prev.maxOverride = max;
    prev.current = Math.min(prev.current ?? max, resourceMax(prev, ch));
    saveData(db); closeModal(); renderApp();
    return;
  }
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
    const recharge = resourceRecharge(r, ch);
    if (recharge === rechargeType || (rechargeType === 'long' && recharge === 'short')) r.current = resourceMax(r, ch);
  });
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

function _updateOnlineBanner(isOnline) {
  if (!IS_PLAYER_VIEW) return;
  let banner = document.getElementById('offline-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'offline-banner';
    banner.style.cssText = `
      position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%);
      background: var(--danger, #8b2e2e); color: #fff;
      padding: 0.5rem 1.25rem; border-radius: 8px;
      font-size: 0.85rem; z-index: 9999;
      display: none; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    `;
    banner.textContent = '⚠ You\'re offline — changes won\'t save until reconnected';
    document.body.appendChild(banner);
  }
  banner.style.display = isOnline ? 'none' : 'block';
}

// ── Sync Subclass Features on Level Change ────────────────────────────────────
function _newSubclassResource(res, subclassName, cls, ch, desc) {
  const max = resourceMax({ maxFormula: res.maxFormula, _subclass: subclassName, _forClass: cls }, ch);
  return {
    id: `res_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    name: res.name,
    type: (res.maxFormula === 'level_x5' || res.name.includes('Hands') || res.name.includes('Pool')) ? 'pool' : 'pips',
    current: max, max, maxFormula: res.maxFormula,
    die: res.die || null, recharge: res.recharge || 'long',
    source: subclassName, desc: desc || '',
    custom: false, _subclass: subclassName, _forClass: cls,
  };
}

// Brings every class's subclass features and trackers in line with that class's level:
// adds ones now unlocked (announced when notify is set) and removes ones above the level.
function _syncSubclassFeaturesFor(ch, notify) {
  if (!ch || typeof SUBCLASS_DATA === 'undefined') return;
  ch.featuresList = ch.featuresList || [];
  ch.resources = ch.resources || [];
  const unlocked = [];
  (ch.classes || []).forEach(entry => {
    const cls = entry.class, sub = entry.subclass, lvl = parseInt(entry.level) || 1;
    const feats = (sub && SUBCLASS_DATA[cls]?.[sub]?.features) || [];
    if (!feats.length) return;
    const open = feats.filter(f => f.level <= lvl);
    const openNames = new Set(open.map(f => f.name));
    const openRes = new Set(open.filter(f => f.resource).map(f => f.resource.name));
    const mine = f => f._subclass === sub && f._forClass === cls;
    ch.featuresList = ch.featuresList.filter(f => !mine(f) || f._placeholder || openNames.has(f.name));
    ch.resources = ch.resources.filter(r => !mine(r) || openRes.has(r.name));
    // Stored copies of the text follow the data (e.g. after a formatting update)
    ch.featuresList.forEach(f => {
      if (!mine(f) || f._placeholder) return;
      const d = open.find(x => x.name === f.name);
      if (d && d.description && f.desc !== d.description) f.desc = d.description;
    });
    const have = new Set(ch.featuresList.filter(mine).map(f => f.name));
    const haveRes = new Set(ch.resources.map(r => r.name));
    open.forEach(feat => {
      if (!have.has(feat.name)) {
        have.add(feat.name);
        ch.featuresList.push({ name: feat.name, desc: feat.description, _subclass: sub, _forClass: cls });
        unlocked.push({ name: feat.name, resource: feat.resource, cls });
      }
      if (feat.resource && !haveRes.has(feat.resource.name)) {
        haveRes.add(feat.resource.name);
        ch.resources.push(_newSubclassResource(feat.resource, sub, cls, ch, feat.description));
      }
    });
  });
  syncClassResources(ch);
  if (notify && unlocked.length) {
    const lines = unlocked.map(u => {
      let msg = `<strong>${esc(u.name)}</strong>`;
      if (u.resource) {
        const die = scaledDie(u.resource.name, _resClassLevel(ch, u.cls)) || u.resource.die;
        const recharge = u.resource.recharge === 'short' ? 'short rest' : 'long rest';
        msg += ` — ${esc(u.resource.name)}${die ? ' '+die : ''}, recharges on ${recharge}`;
      }
      return msg;
    }).join('<br>');
    showToast(`<div class="toast-title">✦ Unlocked:</div>${lines}`);
  }
}

// Feature cards store a copy of their text; bring class options, feats and species traits
// in line with the current data (subclass features are refreshed by the subclass sync).
function _refreshStoredRulesText(ch) {
  const feats = (typeof FEATS_ITEMS_DATA !== 'undefined' && FEATS_ITEMS_DATA.feats) || [];
  const opts = (typeof CLASS_OPTIONS_DATA !== 'undefined' && CLASS_OPTIONS_DATA.options) || [];
  // Without a recorded edition, only trust a species entry that has every trait the character has
  const myTraits = (ch.featuresList || []).filter(f => f._species === ch.race).map(f => f.name);
  const race = !ch.race ? null : ch.raceEdition ? _findSpecies(ch.race, ch.raceEdition)
    : _speciesPool().map(x => x.s).find(s => s.name === ch.race && myTraits.every(n => (s.traits || []).some(t => t.name === n)));
  (ch.featuresList || []).forEach(f => {
    let desc = null;
    if (f._option) desc = opts.find(o => o.name === f.name && o.source === f._optionSource)?.desc;
    else if (f._feat) {
      const base = f.name.replace(/\s*\(.*\)$/, '');
      desc = (feats.find(x => x.name === f.name && x.source === f._featSource) || feats.find(x => x.name === base))?.desc;
    } else if (f._species && race && f._species === ch.race) desc = race.traits?.find(t => t.name === f.name)?.desc;
    if (desc && f.desc !== desc) f.desc = desc;
  });
}

function syncSubclassFeatures(charId, notify = true) {
  _syncSubclassFeaturesFor(db.characters[charId], notify);
}


// ── Base Class Resources ──────────────────────────────────────────────────────
// Rules (formulas, BASE_CLASS_RESOURCES, resourceMax/Die/Recharge) live in resources-rules.js.

// Brings class resource trackers in line with the character's classes and levels: adds newly
// unlocked ones, drops ones no longer granted, and refreshes stored max/die/recharge.
// Never refills: a higher max adds the new uses, a lower max caps current.
function syncClassResources(ch) {
  if (!ch) return;
  const want = expectedBaseResources(ch);
  const wantNames = new Set(want.map(w => w.def.name));
  const dismissed = new Set(ch.dismissedResources || []);
  // A base tracker covers the subclass copies of the same resource (2014 Cleric domains' Channel Divinity)
  ch.resources = (ch.resources || []).filter(r =>
    r.custom || (r._baseClass ? wantNames.has(r.name) : !(r._subclass && wantNames.has(r.name))));
  const have = new Set(ch.resources.map(r => r.name));
  want.forEach(({ def, cls }) => {
    if (have.has(def.name) || dismissed.has(def.name)) return;
    const r = {
      id: `res_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      name: def.name, type: def.type, maxFormula: def.maxFormula, die: def.die || null,
      recharge: def.recharge, source: cls, desc: def.desc, custom: false, _baseClass: true, _forClass: cls,
    };
    r.max = r.current = resourceMax(r, ch);
    ch.resources.push(r);
  });
  ch.resources.forEach(r => {
    const max = resourceMax(r, ch);
    const gained = typeof r.max === 'number' && max > r.max ? max - r.max : 0;
    r.current = Math.min((r.current ?? max) + gained, max);
    r.max = max;
    if (!r.custom) { r.die = resourceDie(r, ch); r.recharge = resourceRecharge(r, ch); }
  });
}

// ── Subclass System ───────────────────────────────────────────────────────────
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

  const removeSpinner = () => { if (spinner && spinner.parentNode) spinner.parentNode.removeChild(spinner); };

  // Same data path as the class editor, so ch.subclass and ch.classes[] stay in sync
  const idx = Math.max(0, (ch.classes || []).findIndex(c => c.class === className));
  applySubclassForClass(charId, idx, className, subclassName);
  syncClassFields(ch);

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
        <div class="mc-total" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span>Total Level ${ch.level} · PB +${pb}</span>
          ${(()=>{
            const pillBase = 'padding:1px 7px;font-size:0.65rem;border-radius:10px;cursor:pointer;border:1px solid var(--border);transition:background 0.15s,color 0.15s;';
            const ed = ch.edition || '2024';
            const p24 = pillBase + (ed==='2024' ? 'background:var(--accent);color:#fff;' : 'background:transparent;color:var(--muted);');
            const p14 = pillBase + (ed==='2014' ? 'background:var(--accent);color:#fff;' : 'background:transparent;color:var(--muted);');
            return `<span style="margin-left:auto;display:inline-flex;gap:4px;align-items:center" title="Which edition's class features this character uses">
              <span style="font-size:0.6rem;color:var(--text-dim)">Rules</span>
              <button style="${p24}" onclick="ch_edition('2024')">2024</button>
              <button style="${p14}" onclick="ch_edition('2014')">2014</button>
            </span>`;
          })()}
        </div>
      </div>
      <div class="cs-header-field">
        <label>Background</label>
        ${(()=>{
          const ddStyle = 'background:transparent;border:none;border-bottom:1px solid var(--border);border-radius:0;color:var(--text);padding:0.1rem 0;font-size:0.85rem;width:100%';
          const bgEd = _bgEditionFor(ch);
          const bgSourceList = bgEd === '2014' ? (SPECIES_DATA?.backgrounds_2014 || []) : (SPECIES_DATA?.backgrounds_2024 || []);
          const bgList = bgSourceList.map(b => b.name);
          const allBgNames = [...(SPECIES_DATA?.backgrounds_2024||[]), ...(SPECIES_DATA?.backgrounds_2014||[])].map(b => b.name);
          const customBg = ch.background && !allBgNames.includes(ch.background) ? ch.background : null;
          const bgOpts = bgList.map(n => `<option${ch.background===n?' selected':''}>${esc(n)}</option>`).join('');
          const customOpt = customBg ? `<option value="${esc(customBg)}" selected>${esc(customBg)}</option>` : '';
          const pillBase = 'padding:1px 7px;font-size:0.65rem;border-radius:10px;cursor:pointer;border:1px solid var(--border);transition:background 0.15s,color 0.15s;';
          const pill2024 = pillBase + (bgEd==='2024' ? 'background:var(--accent);color:#fff;' : 'background:transparent;color:var(--muted);');
          const pill2014 = pillBase + (bgEd==='2014' ? 'background:var(--accent);color:#fff;' : 'background:transparent;color:var(--muted);');
          return `<div style="display:flex;gap:4px;margin-bottom:3px">
            <button style="${pill2024}" onclick="_setBgEdition('2024')">2024</button>
            <button style="${pill2014}" onclick="_setBgEdition('2014')">2014</button>
          </div>
          <select style="${ddStyle}" onchange="changeBackground(this.value)">
            <option value=""${!ch.background?' selected':''}>Choose background…</option>
            ${customOpt}
            ${bgOpts}
          </select>`;
        })()}
      </div>
      <div class="cs-header-field">
        <label>Species / Race</label>
        ${(()=>{
          const ddStyle = 'background:transparent;border:none;border-bottom:1px solid var(--border);border-radius:0;color:var(--text);padding:0.1rem 0;font-size:0.85rem;width:100%';
          const s2024 = (SPECIES_DATA?.species_2024 || []).map(s => s.name);
          const r2014 = (SPECIES_DATA?.races_2014 || []).map(r => r.name);
          const rmpmm = (SPECIES_DATA?.races_mpmm || []).map(r => r.name);
          const more = SPECIES_DATA?.species_more || [];
          const allRaces = [...s2024, ...r2014, ...rmpmm, ...more.map(s => s.name)];
          const customRace = ch.race && !allRaces.includes(ch.race) ? ch.race : null;
          const raceEd = ch.raceEdition || ((ch.edition || '2024') === '2014' && r2014.includes(ch.race) ? '2014' : '2024');
          const makeOpts = (arr, ed) => arr.map(n => `<option value="${ed}|${esc(n)}"${ch.race===n && (raceEd===ed || !s2024.includes(n) || !r2014.includes(n)) ?' selected':''}>${esc(n)}</option>`).join('');
          const customGrp = customRace ? `<optgroup label="Other"><option value="${esc(customRace)}" selected>${esc(customRace)}</option></optgroup>` : '';
          return `<select style="${ddStyle}" onchange="changeRace(this.value)">
            <option value=""${!ch.race?' selected':''}>Choose species…</option>
            ${customGrp}
            <optgroup label="2024 PHB">${makeOpts(s2024, '2024')}</optgroup>
            <optgroup label="2014 PHB">${makeOpts(r2014, '2014')}</optgroup>
            <optgroup label="Mordenkainen's Multiverse">${makeOpts(rmpmm, '2014')}</optgroup>
            <optgroup label="Other books">${more.map(sp => { const ed = sp.edition || '2014';
              const dup = more.filter(x => x.name === sp.name).length > 1 || s2024.includes(sp.name) || r2014.includes(sp.name);
              const sel = ch.race === sp.name && (!dup || raceEd === ed);
              return `<option value="${ed}|${esc(sp.name)}"${sel ? ' selected' : ''}>${esc(sp.name)}${dup ? ` (${ed})` : ''}</option>`; }).join('')}</optgroup>
          </select>`;
        })()}
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
        ${renderSensesSection(ch, pb)}
      </div>
      <div class="cs-col-mid">
        ${renderCombatSection(ch)}
        <div class="floral-divider">✾ ✿ ✾</div>
        ${renderResourcesPanel(ch)}
        ${renderAttacksSection(ch)}
        <div class="floral-divider">✾ ✿ ✾</div>
        ${renderEquipmentCurrency(ch)}
        ${renderEncumbrance(ch)}
        ${renderSpellsSection(ch)}
      </div>
      <div class="cs-col-right">
        ${renderPersonalitySection(ch)}
        <div class="floral-divider">✾ ✿ ✾</div>
        ${renderFeaturesSection(ch)}
        ${renderProficienciesLanguages(ch)}
        <div class="floral-divider">✾ ✿ ✾</div>
        ${renderNotesSection(ch)}
      </div>
    </div>`;
}

// ── Character Field Update Functions ──────────────────────────────────────────
function changeBackground(newBg) {
  const ch = db.characters[currentCharId];
  if (!ch) return;
  const bgEd = _bgEditionFor(ch); // the list the picker was showing
  ch.backgroundTools = ch.backgroundTools || [];

  // Strip skills the OLD background added (tagged entries + legacy plain strings)
  if (ch.background) {
    const allBgPool = [...(SPECIES_DATA?.backgrounds_2024||[]), ...(SPECIES_DATA?.backgrounds_2014||[])];
    const oldBgData = allBgPool.find(b => b.name === ch.background);
    const oldBgSkillSet = new Set(oldBgData?.skills || []);
    ch.skillProficiencies = (ch.skillProficiencies || []).filter(e => {
      if (!oldBgSkillSet.has(skillProfName(e))) return true;
      const src = skillProfSource(e);
      return src !== 'background' && src !== null; // keep class entries, remove bg-tagged and plain strings
    });
    // Remove old background tools from ch.proficiencies, guarding against class-shared tools
    const primaryClass = ch.classes?.[0]?.class || ch.class || 'Fighter';
    const classToolsLower = new Set((CLASS_STARTING_PROFICIENCIES[primaryClass]?.tools || []).map(t => t.toLowerCase()));
    const oldBgToolsToRemove = new Set(
      (oldBgData?.tools || []).filter(t => !classToolsLower.has(t.toLowerCase())).map(t => t.toLowerCase())
    );
    if (oldBgToolsToRemove.size) {
      const parts = (ch.proficiencies || '').split(',').map(s => s.trim()).filter(Boolean);
      ch.proficiencies = parts.filter(p => !oldBgToolsToRemove.has(p.toLowerCase())).join(', ');
    }
  }

  // Strip old background-sourced features and feat, including spells the feat granted
  const fromOldBg = f => f._background === true || (f._feat && f._featSource?.startsWith('Background ('));
  (ch.featuresList || []).filter(fromOldBg).forEach(f => {
    if (f._mi) _cleanupMiFeatData(ch, f._mi);
    if (f._sf) _cleanupSfFeatData(ch, f._sf);
  });
  ch.featuresList = (ch.featuresList || []).filter(f => !fromOldBg(f));

  ch.background = newBg;

  // Look up new background — prefer current edition, fall back to the other
  const _bgPrimary = bgEd === '2014' ? (SPECIES_DATA?.backgrounds_2014||[]) : (SPECIES_DATA?.backgrounds_2024||[]);
  const _bgSecondary = bgEd === '2014' ? (SPECIES_DATA?.backgrounds_2024||[]) : (SPECIES_DATA?.backgrounds_2014||[]);
  const newBgData = _bgPrimary.find(b => b.name === newBg) || _bgSecondary.find(b => b.name === newBg);
  if (newBgData) {
    // Skills — tagged as background source
    (newBgData.skills || []).forEach(skill => addBackgroundSkill(ch, skill));
    // Tool proficiencies — merge additively to preserve class profs
    _grantProficiencies(ch, newBgData.tools || [], 'Background');
    ch.backgroundTools = [...(newBgData.tools || [])];
    // Feat
    if (newBgData.feat) {
      const featName = newBgData.feat;
      const featsPool = FEATS_ITEMS_DATA?.feats || [];
      const featData = featsPool.find(x => x.name === featName)
        || featsPool.find(x => x.name === featName.replace(/\s*\(.*\)$/, ''));
      ch.featuresList.push({ name: featName, desc: featData?.desc || 'Granted by your background.', _feat: true, _featSource: 'Background (' + newBg + ')' });
    }
  } else {
    // Custom/unknown background — clear background tools only, class profs stay
    ch.backgroundTools = [];
  }

  saveData(db);
  renderApp();
}

// Every species entry with the ruleset it follows, in dropdown order. "Elf" exists in
// several lists, so lookups take the edition the character picked.
function _speciesPool() {
  const D = typeof SPECIES_DATA !== 'undefined' ? SPECIES_DATA : {};
  return [
    ...(D.species_2024 || []).map(s => ({ s, ed: '2024' })),
    ...(D.races_2014 || []).map(s => ({ s, ed: '2014' })),
    ...(D.races_mpmm || []).map(s => ({ s, ed: '2014' })),
    ...(D.species_more || []).map(s => ({ s, ed: s.edition || '2014' })),
  ];
}
function _findSpecies(name, edition) {
  const matches = _speciesPool().filter(x => x.s.name === name);
  return (matches.find(x => x.ed === edition) || matches[0])?.s || null;
}

function changeRace(newRace) {
  const ch = db.characters[currentCharId];
  if (!ch) return;

  // Strip old species traits
  ch.featuresList = (ch.featuresList || []).filter(f => !f._species);

  // Values look like "2014|Elf" (the dropdown); a plain name follows the character's edition
  const [edPart, namePart] = String(newRace || '').includes('|') ? newRace.split('|') : [null, newRace];
  const edition = edPart || ((ch.edition || '2024') === '2014' ? '2014' : '2024');
  ch.race = namePart;
  ch.raceEdition = edition;

  const raceData = _findSpecies(namePart, edition);
  if (raceData) {
    // Traits
    (raceData.traits || []).forEach(trait => {
      ch.featuresList.push({ name: trait.name, desc: trait.desc, _species: namePart });
    });
    // Speed
    if (raceData.speed) ch.combat.speed = raceData.speed;
  }
  _applySpeciesLanguages(ch);

  saveData(db);
  renderApp();
}

function ch_field(field, value) {
  const ch = db.characters[currentCharId];
  ch[field] = value;
  _queueSave();
  if (field === 'class') {
    ch.subclass = '';
    ch.classes[0].class = value;
    ch.classes[0].subclass = '';
    // Clear base class and subclass resources, reinject for new class
    ch.resources = (ch.resources || []).filter(r => !r._baseClass && !r._subclass);
    ch.featuresList = (ch.featuresList || []).filter(f => !f._subclass);
    syncClassResources(ch);
    renderApp();
    refreshPanels();
    setTimeout(() => saveData(db), 0);
  }
}

let mcEditIdx = null;
// Which background list the picker shows: the one the user picked with the 2024/2014 pills,
// else the list the current background comes from, else the character's rules edition.
function _bgEditionFor(ch) {
  if (ch.bgEdition) return ch.bgEdition;
  const has = ed => (SPECIES_DATA?.[`backgrounds_${ed}`] || []).some(b => b.name === ch.background);
  if (has('2014') && !has('2024')) return '2014';
  if (has('2024') && !has('2014')) return '2024';
  return ch.edition === '2014' ? '2014' : '2024';
}

function _setBgEdition(edition) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.bgEdition = edition;
  saveData(db); renderApp();
}

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
  const subSpellLists = _getSubclassSpellLists();
  const subTables = _getSubclassTables();
  const hasModalData = eSub && (subSpellLists[eSub] || subTables[eSub]);
  const modalBtn = hasModalData
    ? `<button class="btn btn-sm" onclick="openSubclassModal('${ch.id}')" style="font-size:0.65rem;padding:0.15rem 0.45rem" title="Subclass spell list & special tables">✦ Spells &amp; Tables</button>`
    : '';
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
    ${modalBtn}
    ${ch.classes.length > 1 ? `<button class="btn btn-sm btn-danger" onclick="removeCharClass(${idx})" style="font-size:0.65rem;padding:0.15rem 0.4rem">Remove</button>` : ''}
  </div>`;
}

function applySubclassForClass(charId, idx, className, subclassName) {
  const ch = db.characters[charId]; if (!ch) return;
  // Remove old subclass features/resources/spells for this class
  const oldSubs = new Set((ch.featuresList || []).filter(f => f._subclass && f._forClass === className).map(f => f._subclass));
  if (ch.classes[idx]?.subclass) oldSubs.add(ch.classes[idx].subclass);
  oldSubs.delete(subclassName);
  oldSubs.forEach(sub => _removeSubclassSpells(ch, sub));
  ch.featuresList = (ch.featuresList || []).filter(f => !(f._subclass && f._forClass === className));
  ch.resources = (ch.resources || []).filter(r => !(r._subclass && r._forClass === className));
  if (ch.classes[idx]) ch.classes[idx].subclass = subclassName;
  // Backward compat: keep ch.subclass synced with primary
  if (idx === 0) ch.subclass = subclassName;
  if (!subclassName) return;
  const subclassData = (typeof SUBCLASS_DATA !== 'undefined') && SUBCLASS_DATA[className]?.[subclassName];
  if (!subclassData) return;
  if (!(subclassData.features || []).length) {
    ch.featuresList.push({ name: subclassName, desc: '<em class="no-features-note">No features data yet.</em>', _subclass: subclassName, _forClass: className, _placeholder: true });
  }
  _syncSubclassFeaturesFor(ch, false);
}

function chClassField(idx, field, value) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (!ch.classes[idx]) return;
  const oldClass = ch.classes[idx].class;
  if (field === 'class') {
    // Remove old class resources/features, and spells the old subclass added
    if (ch.classes[idx].subclass) _removeSubclassSpells(ch, ch.classes[idx].subclass);
    if (!ch.classes.some((c, i) => i !== idx && c.class === oldClass)) {
      ch.resources = (ch.resources || []).filter(r => r._forClass !== oldClass && r.source !== oldClass);
      ch.featuresList = (ch.featuresList || []).filter(f => f._forClass !== oldClass);
    }
    ch.classes[idx].class = value;
    ch.classes[idx].subclass = '';
    syncClassFields(ch);
    syncClassResources(ch);
    if (idx === 0) {
      const old = CLASS_STARTING_PROFICIENCIES[oldClass] || {};
      _revokeProficiencies(ch, oldClass, [...(old.armor || []), ...(old.weapons || []), ...(old.tools || [])]);
    } else {
      _revokeProficiencies(ch, `${oldClass} (multiclass)`);
      ch.skillProficiencies = (ch.skillProficiencies || []).filter(e => !(typeof e === 'object' && e._class === oldClass && e._multiclass));
      _applyMulticlassProficiencies(ch, idx);
    }
    _syncClassLanguages(ch);
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
    syncSubclassFeatures(currentCharId);
  } else if (field === 'subclass') {
    applySubclassForClass(currentCharId, idx, ch.classes[idx].class, value);
    syncClassFields(ch);
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

function _applyMulticlassProficiencies(ch, idx) {
  const cls = ch.classes[idx]?.class; if (!cls || idx === 0) return;
  const mc = multiclassProficiencies(cls, ch.edition === '2014' ? '2014' : '2024');
  _grantProficiencies(ch, [...mc.armor, ...mc.weapons, ...mc.tools], `${cls} (multiclass)`);
  if (mc.skillChoice && typeof document !== 'undefined') openMulticlassSkillModal(ch.id, cls, mc.skillChoice);
}

function openMulticlassSkillModal(charId, cls, choice) {
  const ch = db.characters[charId]; if (!ch) return;
  const have = new Set((ch.skillProficiencies || []).map(skillProfName));
  const from = (choice.from || SKILLS.map(sk => sk.name)).filter(n => !have.has(n));
  openModal(`<h2>${esc(cls)} multiclass</h2>
    <p style="font-size:0.82rem;color:var(--text-dim);margin-bottom:0.6rem">Multiclassing into ${esc(cls)} gives you proficiency in ${choice.count} skill${choice.count > 1 ? 's' : ''} of your choice.</p>
    <div class="mc-skill-grid">${from.map(n => `<label><input type="checkbox" class="mc-skill-cb" value="${esc(n)}"> ${esc(n)}</label>`).join('')}</div>
    <div class="form-actions"><button class="btn" onclick="closeModal()">Skip</button>
      <button class="btn btn-primary" onclick="confirmMulticlassSkill('${jsStr(charId)}','${jsStr(cls)}',${choice.count})">Add</button></div>`);
}

function confirmMulticlassSkill(charId, cls, count) {
  const ch = db.characters[charId]; if (!ch) return;
  [...document.querySelectorAll('.mc-skill-cb:checked')].slice(0, count).forEach(cb => {
    if (!(ch.skillProficiencies || []).some(e => skillProfName(e) === cb.value))
      ch.skillProficiencies.push({ name: cb.value, _class: cls, _multiclass: true });
  });
  saveData(db); closeModal(); renderApp();
}

function addCharClass() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (ch.level >= 20) return;
  ch.classes.push({ class: 'Fighter', subclass: '', level: 1 });
  syncClassFields(ch);
  syncClassResources(ch);
  _applyMulticlassProficiencies(ch, ch.classes.length - 1);
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
  if (removed.subclass) _removeSubclassSpells(ch, removed.subclass);
  if (idx > 0) {
    _revokeProficiencies(ch, `${removed.class} (multiclass)`);
    ch.skillProficiencies = (ch.skillProficiencies || []).filter(e => !(typeof e === 'object' && e._class === removed.class && e._multiclass));
  }
  // Remove resources/features tagged with the removed class (unless another entry still has it)
  if (!ch.classes.some((c, i) => i !== idx && c.class === removed.class)) {
    ch.resources = (ch.resources || []).filter(r => r._forClass !== removed.class && r.source !== removed.class);
    ch.featuresList = (ch.featuresList || []).filter(f => f._forClass !== removed.class);
  }
  if (removed.subclass) {
    ch.resources = ch.resources.filter(r => r._subclass !== removed.subclass || r._forClass !== removed.class);
    ch.featuresList = ch.featuresList.filter(f => f._subclass !== removed.subclass || f._forClass !== removed.class);
  }
  ch.classes.splice(idx, 1);
  syncClassFields(ch);
  mcEditIdx = null;
  // Re-inject primary class resources if primary changed
  if (idx === 0) {
    syncClassResources(ch);
    if (ch.classes[0].subclass) applySubclassForClass(currentCharId, 0, ch.classes[0].class, ch.classes[0].subclass);
  }
  applySpellSlots(ch);
  saveData(db);
  renderApp();
  refreshPanels();
}

// Typed fields save shortly after the last keystroke (and when the page is hidden),
// so edits survive a reload without pressing Save.
let _autosaveTimer = null;
function _queueSave() {
  clearTimeout(_autosaveTimer);
  _autosaveTimer = setTimeout(() => { _autosaveTimer = null; saveData(db); }, 400);
}
function _flushSave() {
  if (_autosaveTimer) { clearTimeout(_autosaveTimer); _autosaveTimer = null; saveData(db); }
}
window.addEventListener('pagehide', _flushSave);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') _flushSave(); });

function combatField(field, value) {
  db.characters[currentCharId].combat[field] = value;
  _queueSave();
  if (['maxHP','currentHP'].includes(field)) {
    const ch = db.characters[currentCharId];
    const pct = ch.combat.maxHP>0?Math.round((ch.combat.currentHP/ch.combat.maxHP)*100):100;
    const bar = document.querySelector('.hp-bar');
    if (bar) { bar.style.width=pct+'%'; bar.className='hp-bar '+(pct<=25?'low':pct<=50?'mid':''); }
  }
}
// Typing a total keeps the difference from DEX as an extra bonus
function setInitiative(value) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  ch.combat.initMisc = (parseInt(value) || 0) - mod(ch.abilities.dex || 10);
  ch.combat.initiative = initiativeBonus(ch);
  _queueSave();
}
function adjustCombatStat(field, delta) {
  const ch = db.characters[currentCharId];
  if (!ch) return;
  if (field === 'initiative') { setInitiative(initiativeBonus(ch) + delta); saveData(db); renderApp(); return; }
  ch.combat[field] = (+ch.combat[field] || 0) + delta;
  saveData(db);
  renderApp();
}
function updateAbility(ability, value) {
  // Commits on change (blur/Enter), not per keystroke — re-rendering mid-typing turned "15" into 1
  db.characters[currentCharId].abilities[ability] = Math.max(1, Math.min(30, parseInt(value) || 10));
  // Recalculate any ability-score-based resource maxes
  const ch = db.characters[currentCharId];
  syncClassResources(ch);
  saveData(db); renderApp();
}
function adjustAbility(ability, delta) {
  const ch = db.characters[currentCharId];
  if (!ch) return;
  const next = Math.max(1, Math.min(30, (+ch.abilities[ability] || 10) + delta));
  updateAbility(ability, next);
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
  ch.saveProficiencies = ch.saveProficiencies || [];
  ch.saveOff = ch.saveOff || [];
  const granted = grantedSaves(ch).includes(ability);
  const on = (granted && !ch.saveOff.includes(ability)) || ch.saveProficiencies.includes(ability);
  if (on) {
    ch.saveProficiencies = ch.saveProficiencies.filter(a => a !== ability);
    if (granted) ch.saveOff.push(ability);
  } else {
    ch.saveOff = ch.saveOff.filter(a => a !== ability);
    if (!granted) ch.saveProficiencies.push(ability);
  }
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
  const ch = db.characters[currentCharId];
  ch.deathSaves[type] = checked ? index + 1 : index;

  const { successes, failures } = ch.deathSaves;

  if (failures >= 3) {
    _markDead(ch, '3 failed death saves');
  } else if (successes >= 3) {
    ch.deathSaves = { successes: 0, failures: 0 };
    showToast(`<span style="color:#22c55e">✦ <strong>${esc(ch.name)}</strong> has stabilised — 3 successful death saves.</span>`);
  }

  saveData(db);
  renderApp();
}

function _markDead(ch, reason) {
  ch.combat.currentHP = 0;
  ch.deathSaves = { successes: 0, failures: 3 };
  showToast(`<span style="color:#ef4444">💀 <strong>${esc(ch.name)}</strong> has died — ${reason}.</span>`);
  // Add Unconscious condition to linked combatant
  const campaign = db.campaigns.find(c => c.id === currentCampaignId);
  const cb = campaign?.initiative?.combatants?.find(c => c.charId === ch.id);
  if (cb) {
    cb.conditions = cb.conditions || [];
    if (!cb.conditions.some(c => (typeof c === 'string' ? c : c.name) === 'Unconscious')) cb.conditions.push('Unconscious');
  }
}

// Temp HP soaks damage first. At 0 HP any damage is a failed death save; damage that leaves
// at least your max HP over after dropping you to 0 kills outright.
function _takeDamage(ch, amount) {
  let remaining = amount;
  if (ch.combat.tempHP > 0) {
    const absorbed = Math.min(ch.combat.tempHP, remaining);
    ch.combat.tempHP -= absorbed;
    remaining -= absorbed;
  }
  if (remaining <= 0) return;
  const wasDown = ch.combat.currentHP <= 0;
  const overflow = remaining - Math.max(0, ch.combat.currentHP);
  ch.combat.currentHP = Math.max(0, ch.combat.currentHP - remaining);
  ch.deathSaves = ch.deathSaves || { successes: 0, failures: 0 };
  if (overflow >= ch.combat.maxHP && ch.combat.maxHP > 0) { _markDead(ch, 'massive damage'); return; }
  if (wasDown) {
    ch.deathSaves.failures = Math.min(3, (ch.deathSaves.failures || 0) + 1);
    if (ch.deathSaves.failures >= 3) _markDead(ch, '3 failed death saves');
    else showToast(`<strong>${esc(ch.name)}</strong> took damage at 0 HP — a failed death save.`);
  }
}

// Regaining any HP from 0 ends dying, so the death saves reset
function _heal(ch, amount) {
  if (amount <= 0) return;
  if (ch.combat.currentHP <= 0) ch.deathSaves = { successes: 0, failures: 0 };
  ch.combat.currentHP = Math.min(ch.combat.maxHP, ch.combat.currentHP + amount);
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



function applyDamageInline() {
  const input = document.getElementById('dmg-inline');
  const amount = parseInt(input?.value) || 0;
  if (amount <= 0) return;
  const ch = db.characters[currentCharId]; if (!ch) return;
  _takeDamage(ch, amount);
  saveData(db); renderApp();
  _flashHPDamage();
}

function applyHealInline() {
  const input = document.getElementById('heal-inline');
  const amount = parseInt(input?.value) || 0;
  if (amount <= 0) return;
  const ch = db.characters[currentCharId]; if (!ch) return;
  _heal(ch, amount);
  saveData(db); renderApp();
  _flashHPHeal();
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
  // Hit dice: 2024 restores all of them, 2014 half your total (minimum 1)
  const hdClasses = (ch.classes && ch.classes.length > 0) ? ch.classes : [{ class: ch.class || 'Fighter', level: ch.level || 1 }];
  const hdTotal = hdClasses.reduce((s, c) => s + (c.level || 0), 0);
  const totalRestore = ch.edition === '2014' ? Math.max(1, Math.floor(hdTotal / 2)) : hdTotal;
  if (typeof ch.combat.hitDiceUsed !== 'object' || ch.combat.hitDiceUsed === null) ch.combat.hitDiceUsed = {};
  let leftToRestore = totalRestore;
  for (const cls of hdClasses) {
    if (leftToRestore <= 0) break;
    const used = ch.combat.hitDiceUsed[cls.class] || 0;
    const restore = Math.min(used, leftToRestore);
    ch.combat.hitDiceUsed[cls.class] = used - restore;
    leftToRestore -= restore;
  }
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
  // A long rest removes one level of exhaustion (both editions)
  ch.exhaustionLevel = Math.max(0, (ch.exhaustionLevel || 0) - 1);
  // Clear concentration
  ch.activeConcentration = null;
  // Clear concentration warnings on any initiative combatant linked to this character
  const charId = currentCharId;
  db.campaigns.forEach(camp => {
    camp.initiative?.combatants?.forEach(cb => {
      if (cb.charId === charId) delete cb._concCheck;
    });
  });
  // Restore resources
  restoreResources('long', currentCharId);
  saveData(db); renderApp();
  _shimmerLongRestBtn();
}

function openShortRestDialog() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  const conMod = mod(ch.abilities?.con || 10);
  const hdClasses = (ch.classes && ch.classes.length > 0) ? ch.classes : [{ class: ch.class || 'Fighter', level: ch.level || 1 }];
  if (typeof ch.combat.hitDiceUsed !== 'object' || ch.combat.hitDiceUsed === null) ch.combat.hitDiceUsed = {};
  const hdTotal = hdClasses.reduce((s, c) => s + (c.level || 0), 0);
  const hdUsedAll = hdClasses.reduce((s, c) => s + (ch.combat.hitDiceUsed[c.class] || 0), 0);
  const hdRemainingAll = Math.max(0, hdTotal - hdUsedAll);

  // Per-class breakdown lines
  const breakdownLines = hdClasses.map(c => {
    const sides = HIT_DICE[c.class] || 8;
    const used = ch.combat.hitDiceUsed[c.class] || 0;
    const rem = Math.max(0, c.level - used);
    return `<span style="margin-right:0.8rem">${c.class}: <strong>${rem}/${c.level}d${sides}</strong></span>`;
  }).join('');

  // Dropdown for multiclass: which die to roll
  const isMulti = hdClasses.length > 1;
  const availClasses = hdClasses.filter(c => (c.level - (ch.combat.hitDiceUsed[c.class] || 0)) > 0);
  const dropdownHtml = isMulti ? `
    <div style="margin-bottom:0.6rem;font-size:0.9rem">
      <label style="color:var(--text-dim);margin-right:0.4rem">Roll die from:</label>
      <select id="sr-class-select" style="background:var(--bg-input,#1a1a2e);color:var(--text);border:1px solid var(--border);border-radius:4px;padding:0.2rem 0.4rem">
        ${hdClasses.map(c => {
          const sides = HIT_DICE[c.class] || 8;
          const rem = Math.max(0, c.level - (ch.combat.hitDiceUsed[c.class] || 0));
          return `<option value="${c.class}" ${rem <= 0 ? 'disabled' : ''}>${c.class} (d${sides}, ${rem} left)</option>`;
        }).join('')}
      </select>
    </div>` : '';

  const rollDisabled = hdRemainingAll <= 0 || ch.combat.currentHP >= ch.combat.maxHP;
  const singleSides = HIT_DICE[hdClasses[0].class] || 8;

  openModal(`<h2>&#9788; Short Rest</h2>
    <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:0.8rem">Spend hit dice to recover HP. Each die rolls its hit die + ${conMod >= 0 ? '+' : ''}${conMod} (CON).</p>
    <div style="font-size:0.85rem;margin-bottom:0.5rem">${breakdownLines}</div>
    <div style="font-size:0.9rem;margin-bottom:0.6rem"><strong>Current HP:</strong> <span id="sr-hp-current">${ch.combat.currentHP}</span> / ${ch.combat.maxHP}</div>
    ${dropdownHtml}
    <div id="sr-roll-log" style="max-height:120px;overflow-y:auto;margin-bottom:0.8rem"></div>
    <div class="form-actions">
      <button class="btn" id="sr-roll-btn" onclick="shortRestRollHD()" ${rollDisabled ? 'disabled' : ''}>Roll Hit Die</button>
      <button class="btn btn-primary" onclick="restorePactSlots();restoreResources('short',currentCharId);saveData(db);closeModal();renderApp()">Done</button>
    </div>`);
}

function shortRestRollHD() {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (typeof ch.combat.hitDiceUsed !== 'object' || ch.combat.hitDiceUsed === null) ch.combat.hitDiceUsed = {};
  const hdClasses = (ch.classes && ch.classes.length > 0) ? ch.classes : [{ class: ch.class || 'Fighter', level: ch.level || 1 }];
  if (ch.combat.currentHP >= ch.combat.maxHP) return;

  // Determine which class die to roll
  const isMulti = hdClasses.length > 1;
  let chosenClass;
  if (isMulti) {
    const sel = document.getElementById('sr-class-select');
    chosenClass = hdClasses.find(c => c.class === sel?.value) || hdClasses[0];
  } else {
    chosenClass = hdClasses[0];
  }
  const usedForClass = ch.combat.hitDiceUsed[chosenClass.class] || 0;
  if (usedForClass >= chosenClass.level) return; // none left for this class

  const hdSides = HIT_DICE[chosenClass.class] || 8;
  const conMod = mod(ch.abilities?.con || 10);
  const roll = Math.ceil(Math.random() * hdSides);
  const healed = Math.max(1, roll + conMod);
  ch.combat.currentHP = Math.min(ch.combat.maxHP, ch.combat.currentHP + healed);
  ch.combat.hitDiceUsed[chosenClass.class] = usedForClass + 1;
  saveData(db);

  // Update roll log
  const log = document.getElementById('sr-roll-log');
  if (log) {
    const label = isMulti ? `${chosenClass.class} 1d${hdSides}` : `1d${hdSides}`;
    log.innerHTML += `<div style="font-size:0.82rem;padding:0.2rem 0;border-bottom:1px solid var(--border)">Rolled <strong>${label} = ${roll}</strong> + ${conMod} CON = <span style="color:var(--green-lt);font-weight:bold">+${healed} HP</span></div>`;
    log.scrollTop = log.scrollHeight;
  }

  // Update HP display
  const hpEl = document.getElementById('sr-hp-current');
  if (hpEl) hpEl.textContent = ch.combat.currentHP;

  // Refresh dropdown options and disable exhausted classes
  if (isMulti) {
    const sel = document.getElementById('sr-class-select');
    if (sel) {
      Array.from(sel.options).forEach(opt => {
        const cls = hdClasses.find(c => c.class === opt.value);
        if (cls) {
          const rem = Math.max(0, cls.level - (ch.combat.hitDiceUsed[cls.class] || 0));
          opt.text = `${cls.class} (d${HIT_DICE[cls.class]||8}, ${rem} left)`;
          opt.disabled = rem <= 0;
        }
      });
      // If current selection is exhausted, pick next available
      const curOpt = sel.options[sel.selectedIndex];
      if (curOpt?.disabled) {
        const firstAvail = Array.from(sel.options).find(o => !o.disabled);
        if (firstAvail) sel.value = firstAvail.value;
      }
    }
  }

  // Disable Roll button if no more dice or at full HP
  const hdUsedAll = hdClasses.reduce((s, c) => s + (ch.combat.hitDiceUsed[c.class] || 0), 0);
  const hdTotal = hdClasses.reduce((s, c) => s + (c.level || 0), 0);
  const btn = document.getElementById('sr-roll-btn');
  if (btn && (hdUsedAll >= hdTotal || ch.combat.currentHP >= ch.combat.maxHP)) btn.disabled = true;

  updateHPDisplay();
}

function adjustHitDice(delta) {
  const ch = db.characters[currentCharId]; if (!ch) return;
  if (typeof ch.combat.hitDiceUsed !== 'object' || ch.combat.hitDiceUsed === null) ch.combat.hitDiceUsed = {};
  const hdClasses = (ch.classes && ch.classes.length > 0) ? ch.classes : [{ class: ch.class || 'Fighter', level: ch.level || 1 }];
  if (delta < 0) {
    // Use a die: spend from first class with remaining dice
    const cls = hdClasses.find(c => (ch.combat.hitDiceUsed[c.class] || 0) < c.level);
    if (!cls) return;
    ch.combat.hitDiceUsed[cls.class] = (ch.combat.hitDiceUsed[cls.class] || 0) + 1;
  } else {
    // Restore a die: restore from last class with used dice
    const cls = [...hdClasses].reverse().find(c => (ch.combat.hitDiceUsed[c.class] || 0) > 0);
    if (!cls) return;
    ch.combat.hitDiceUsed[cls.class] = (ch.combat.hitDiceUsed[cls.class] || 0) - 1;
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
  _queueSave();
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

  // Add Unarmed Strike to the beginning of simple weapons
  const ch = db.characters[currentCharId];
  const isMonk = ch && (ch.class === 'Monk' || (ch.classes && ch.classes.some(c => c.class === 'Monk')));
  const monkLevel = isMonk ? (ch.classes ? ch.classes.find(c => c.class === 'Monk')?.level || ch.level : ch.level) : 0;
  let unarmedDmg = '1 bludgeoning';
  const unarmedStrike = { id: '_unarmed', name: 'Unarmed Strike', weapon_type: 'melee-str', dmg: unarmedDmg, category: 'simple', properties: [], _isUnarmed: true };
  if (isMonk) {
    let die = 'd6';
    if (monkLevel >= 17) die = 'd12';
    else if (monkLevel >= 11) die = 'd10';
    else if (monkLevel >= 5) die = 'd8';
    unarmedDmg = `1${die} bludgeoning`;
    unarmedStrike.dmg = unarmedDmg;
    unarmedStrike._monkBadge = true;
  }

  // Filter unarmed strike in search
  const matchesSearch = !q || 'unarmed'.includes(q) || unarmedDmg.toLowerCase().includes(q);
  if (matchesSearch && _wpnFilter['simple']) {
    filtered.unshift(unarmedStrike);
  }

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
        `<span style="font-size:0.6rem;border:1px solid rgba(var(--accent-rgb),0.45);color:var(--text-dim);border-radius:3px;padding:0 3px;white-space:nowrap">${esc(p)}</span>`
      ).join('') + (w.mastery ?
        `<span title="${esc((typeof WEAPON_MASTERY_DESC !== 'undefined' && WEAPON_MASTERY_DESC[w.mastery]) || '')}" style="font-size:0.6rem;border:1px solid #f59e0b;color:#f59e0b;border-radius:3px;padding:0 3px;white-space:nowrap">✦ ${esc(w.mastery)}</span>` : '');
      const rangeTxt = w.range ? `<span style="font-size:0.65rem;color:var(--text-dim)">${esc(w.range)}</span>` : '';
      return `<div class="wpn-row" onclick="pickWeapon(${idx})"
          style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;
                 padding:0.3rem 0.5rem;border-radius:5px;cursor:pointer;
                 border:1px solid var(--border);margin-bottom:0.25rem">
        <span style="font-size:0.82rem;font-weight:600;min-width:110px">${esc(w.name)}${w._monkBadge ? '<span style="font-size:0.55rem;background:var(--accent);color:#fff;padding:0.1rem 0.3rem;border-radius:2px;margin-left:0.3rem">Monk</span>' : ''}</span>
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

    // For unarmed strike, adjust damage based on Monk status
    let finalDmg = dmg;
    if (w._isUnarmed) {
      const isMonk = ch.class === 'Monk' || (ch.classes && ch.classes.some(c => c.class === 'Monk'));
      if (!isMonk) {
        // Non-Monk: damage is 1 + STR mod (no dice, stored as flat bonus)
        const flatDamage = 1 + strMod;
        finalDmg = flatDamage + ' bludgeoning';
      }
    }

    ch.attacks.push({ id: uid(), name: w.name, weaponType, bonus: bonusStr, damage: finalDmg, mastery: w.mastery || '', _unarmed: w._isUnarmed });
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
  const exPen = exhaustionPenalty(ch);
  const total = d20 + bonusNum - exPen;
  const bonusStr = bonusNum >= 0 ? `+ ${bonusNum}` : `\u2212 ${Math.abs(bonusNum)}`;
  const totalDisplay = `d20(${d20}) ${bonusStr}${exPen ? ` \u2212 ${exPen} (exhaustion)` : ''} = <strong>${total}</strong>`;
  let html;
  let duration = 5000;
  if (d20 === 20) {
    html = `<span style="color:#f59e0b;font-weight:700">✦ CRITICAL HIT!</span> <strong>${esc(atk.name || 'Attack')} attack:</strong> ${totalDisplay} — roll damage dice twice`;
    duration = 7000;
  } else if (d20 === 1) {
    html = `<span style="color:#ef4444;font-weight:700">✗ CRITICAL MISS!</span> <strong>${esc(atk.name || 'Attack')} attack:</strong> ${totalDisplay}`;
    duration = 7000;
  } else {
    html = `<strong>${esc(atk.name || 'Attack')} attack:</strong> ${totalDisplay}`;
  }
  showToast(html, duration);
}
function rollDamage(i) {
  const ch = db.characters[currentCharId];
  const atk = ch?.attacks?.[i];
  if (!atk?.damage) { showToast('No damage dice set.'); return; }

  // Handle unarmed strike for non-Monks (flat damage, no dice)
  if (atk._unarmed) {
    const flatMatch = atk.damage.match(/^(\d+)\s/);
    if (flatMatch) {
      const flatDamage = parseInt(flatMatch[1]);
      const dmgType = atk.damage.split(/\s+/).slice(1).join(' ');
      showToast(`<strong>${esc(atk.name || 'Unarmed Strike')} damage:</strong> <strong>${flatDamage}</strong> ${esc(dmgType)}`);
      return;
    }
  }

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
  _queueSave();
  _refreshEncumbrance();
}
function addEquipment() {
  const input = document.getElementById('eq-input'); const val=input.value.trim(); if(!val) return;
  db.characters[currentCharId].equipment = db.characters[currentCharId].equipment||[];
  db.characters[currentCharId].equipment.push(val); input.value='';
  saveData(db); renderApp();
}
function removeEquipment(i) {
  const ch = db.characters[currentCharId];
  const [removed] = ch.equipment.splice(i, 1);
  // Giving up the last copy of an attuned item ends the attunement
  const name = typeof removed === 'object' ? removed?.name : removed;
  if (name && !ch.equipment.some(e => (typeof e === 'object' ? e?.name : e) === name))
    ch.attunedItems = (ch.attunedItems || []).filter(n => n !== name);
  saveData(db); renderApp();
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
  const newClassLevel = (entry ? entry.level : ch.level) + 1;
  const classFeats = _classFeaturesFor(className, ch)
    .filter(f => f[0] === newClassLevel)
    .map(f => ({ name: f[1], desc: f[2], tag: null }));
  const subclassFeats = (() => {
    const sub = entry?.subclass || ch.subclass;
    if (!sub || typeof SUBCLASS_DATA === 'undefined') return [];
    const sdata = SUBCLASS_DATA[className]?.[sub];
    if (!sdata?.features) return [];
    return sdata.features.filter(f => f.level === newClassLevel)
      .map(f => ({ name: f.name, desc: f.description, tag: 'subclass' }));
  })();
  const allFeats = [...classFeats, ...subclassFeats];
  const featuresHTML = allFeats.length > 0 ? `
    <div class="levelup-features">
      <div class="levelup-features-title">New Features at Level ${newClassLevel}</div>
      ${allFeats.map(f => `<div class="levelup-feature-row">
        <span class="levelup-feat-name">${esc(f.name)}</span>${f.tag ? `<span class="levelup-feat-tag">${f.tag}</span>` : ''}<div class="levelup-feat-desc rules-text">${renderRulesText(f.desc, { cls: className, level: newClassLevel })}</div>
      </div>`).join('')}
    </div>` : '';
  openModal(`<h2>Level Up — ${esc(className)}</h2>
    <p style="font-size:0.82rem;color:var(--text-dim);margin-bottom:0.75rem">
      Hit Die: d${hd} &nbsp;·&nbsp; CON modifier: ${conStr} &nbsp;·&nbsp; New total level: ${ch.level + 1}
    </p>
    ${featuresHTML}
    <div class="form-group" style="display:flex;flex-direction:column;gap:0.5rem">
      <button class="btn btn-primary" onclick="_levelUpRollHP(${classIdx}, ${hd}, ${conMod})">
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

function _levelUpRollHP(classIdx, hd, conMod) {
  const roll = Math.floor(Math.random() * hd) + 1;
  const total = Math.max(1, roll + conMod);
  _levelUpGainHP(classIdx, total, { roll, hd, conMod });
}

function _levelUpGainHP(classIdx, hpGain, rollInfo) {
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
    let resultMsg = `+${gained} HP · Now Level ${ch.level} · Max HP ${ch.combat.maxHP}`;
    if (rollInfo) {
      const conStr = rollInfo.conMod >= 0 ? `+${rollInfo.conMod}` : rollInfo.conMod;
      resultMsg = `Rolled d${rollInfo.hd}: ${rollInfo.roll} ${conStr} CON = +${gained} HP · Now Level ${ch.level} · Max HP ${ch.combat.maxHP}`;
    }
    result.textContent = resultMsg;
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
      ${!IS_PLAYER_VIEW ? `<button class="btn btn-sm btn-primary" onclick="openCharWizard()"${atLimit ? ' disabled title="Limit reached"' : ''}>+ New</button>` : ''}
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
    showAlert('20 character limit reached.'); return;
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
  showConfirm('Delete this character?', () => {
    const ch = db.characters[charId];
    if (ch && _isStorageUrl(ch.portrait)) _deletePortraitFromStorage(charId);
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
  });
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
    _bgSource: '2024',
    class: 'Fighter', level: 1, subclass: '',
    abilities: { str:8, dex:8, con:8, int:8, wis:8, cha:8 },
    maxHP: 10, maxHPSet: false
  };
  renderWizardStep(0);
}

function wizardProgress(current) {
  return `<div class="wizard-progress">${[0,1,2,3,4,5,6,7,8].map(i =>
    `<div class="wizard-step-dot ${i < current ? 'done' : i === current ? 'current' : ''}"></div>`
  ).join('')}</div>`;
}

// Determine whether the subclass step (5) should be skipped for the current data
function _wizSubclassAvailable() {
  if ((wizardData.level || 1) < 3) return false;
  if (typeof SUBCLASS_DATA === 'undefined') return false;
  const subs = SUBCLASS_DATA[wizardData.class];
  return !!(subs && Object.keys(subs).length > 0);
}

function _wizSpeciesCards() {
  const srcKey = { '2014': 'races_2014', mpmm: 'races_mpmm', more: 'species_more' }[wizardData._speciesSource] || 'species_2024';
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
    if (sp.abilityNote && srcKey === 'species_more') bonusLine = [bonusLine, sp.abilityNote].filter(Boolean).join(' · ');
    const edTag = srcKey === 'species_more' ? ` · ${esc(sp.edition || '2014')} rules` : '';
    return `<div class="wiz-card ${sel?'selected':''}" onclick="wiz_selectSpecies('${srcKey}',${i})">
      <div style="font-weight:bold;font-size:0.9rem">${esc(sp.name)}</div>
      <div style="font-size:0.72rem;color:var(--text-dim)">${esc(sp.size||'')} · ${sp.speed||30} ft${edTag}</div>
      ${bonusLine ? `<div style="font-size:0.72rem;color:var(--gold-lt);margin-top:0.15rem">${bonusLine}</div>` : ''}
      ${traits ? `<div style="font-size:0.7rem;color:var(--text-dim);margin-top:0.15rem">${traits}</div>` : ''}
    </div>`;
  }).join('');
}

function _wizBackgroundCards() {
  const srcKey = wizardData._bgSource === '2014' ? 'backgrounds_2014' : 'backgrounds_2024';
  const list = SPECIES_DATA[srcKey] || [];
  return list.map((bg, i) => {
    const sel = wizardData.background === bg.name;
    const chips = (bg.abilityGroup || []).map(a => `<span class="wiz-stat-chip">${a.toUpperCase()}</span>`).join(' ');
    return `<div class="wiz-card ${sel?'selected':''}" onclick="wiz_selectBackground(${i})">
      <div style="font-weight:bold;font-size:0.9rem">${esc(bg.name)}</div>
      ${chips ? `<div style="margin-top:0.2rem">${chips}</div>` : ''}
      <div style="font-size:0.72rem;color:var(--text-dim);margin-top:0.15rem">Skills: ${(bg.skills||[]).map(s=>esc(s)).join(', ')}</div>
      ${(bg.tools||[]).length > 0 ? `<div style="font-size:0.72rem;color:var(--text-dim)">Tool: ${(bg.tools||[]).map(t=>esc(t)).join(', ')}</div>` : ''}
      ${bg.feat ? `<div style="font-size:0.72rem;color:var(--gold-lt);margin-top:0.15rem">Feat: ${esc(bg.feat)}</div>` : ''}
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
        <button class="btn btn-sm ${s==='more'?'btn-primary':''}" onclick="wizardData._speciesSource='more';renderWizardStep(1)">Other books</button>
      </div>
      <div class="wiz-card-grid">${_wizSpeciesCards()}</div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(0)">← Back</button>
        <button class="btn btn-primary" onclick="wizardNext(1)">Next →</button>
      </div>`;
  } else if (step === 2) {
    const bs = wizardData._bgSource || '2024';
    body = `<h2>✾ Background</h2>${wizardProgress(2)}
      <div class="wiz-source-toggle">
        <button class="btn btn-sm ${bs==='2024'?'btn-primary':''}" onclick="wizardData._bgSource='2024';renderWizardStep(2)">2024 PHB</button>
        <button class="btn btn-sm ${bs==='2014'?'btn-primary':''}" onclick="wizardData._bgSource='2014';renderWizardStep(2)">2014 PHB</button>
      </div>
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
    // Subclass — skip entirely if level < 3 or no subclass data for this class
    if (!_wizSubclassAvailable()) {
      return renderWizardStep(6);
    }
    const subData = SUBCLASS_DATA[wizardData.class];
    const subNames = Object.keys(subData);
    function _wizEditionSuffix(name) {
      const src = subData[name]?.source || '';
      if (src.includes('2024')) return ' (2024)';
      if (src.includes('2014') || src === 'PHB') return ' (2014)';
      if (src) return ` (${src})`;
      return '';
    }
    const cards = subNames.map(name => {
      const sel = wizardData.subclass === name;
      const sub = subData[name];
      const desc = sub?.description ? esc(String(sub.description)).slice(0, 110) : '';
      const safeName = String(name).replace(/'/g, "\\'");
      return `<div class="wiz-card ${sel?'selected':''}" onclick="wiz_selectSubclass('${safeName}')">
        <div style="font-weight:bold;font-size:0.9rem">${esc(name)}${_wizEditionSuffix(name)}</div>
        ${desc ? `<div style="font-size:0.72rem;color:var(--text-dim);margin-top:0.2rem">${desc}</div>` : ''}
      </div>`;
    }).join('');
    body = `<h2>✾ Subclass</h2>${wizardProgress(5)}
      <p style="font-size:0.78rem;color:var(--text-dim);margin-bottom:0.6rem">
        Choose a ${esc(wizardData.class)} subclass. You can change this later.
      </p>
      <div class="wiz-card-grid">${cards}</div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(4)">← Back</button>
        <button class="btn" onclick="wizardData.subclass='';renderWizardStep(6)">Skip subclass for now</button>
        <button class="btn btn-primary" onclick="renderWizardStep(6)">Next →</button>
      </div>`;
  } else if (step === 6) {
    // Ability Scores with method selector + bonus picker
    if (!wizardData.abilityMethod) wizardData.abilityMethod = 'pointbuy';
    const method = wizardData.abilityMethod;

    // Background bonus section
    let bonusSection = '';
    const bg = wizardData.backgroundData;
    const hasFixedBonuses = Object.keys(wizardData.raceData?.abilityBonuses || {}).length > 0;
    if (hasFixedBonuses) {
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

    body = `<h2>✾ Ability Scores</h2>${wizardProgress(6)}
      ${methodToggle}${bonusSection}${scoreSection}
      <div id="wiz-step6-error" style="color:var(--red-lt);font-size:0.8rem;margin-top:0.4rem;display:none"></div>
      <div class="form-actions">
        <button class="btn" onclick="${_wizSubclassAvailable() ? 'renderWizardStep(5)' : 'renderWizardStep(4)'}">← Back</button>
        <button class="btn btn-primary" onclick="wizardNext(6)">Next →</button>
      </div>`;
  } else if (step === 7) {
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
    body = `<h2>✾ Review</h2>${wizardProgress(7)}
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
          ${wizardData.subclass ? ` &nbsp;·&nbsp; <strong>Subclass:</strong> ${esc(wizardData.subclass)}` : ''}
        </div>
        <div style="font-size:0.75rem;color:var(--text-dim)">Scores: ${wizardData.abilityMethod==='pointbuy'?'Point Buy':wizardData.abilityMethod==='array'?'Standard Array':'Manual Roll'}</div>
      </div>
      <div class="wizard-ability-grid" style="margin-bottom:0.8rem">${scoresHtml}</div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(6)">← Back</button>
        <button class="btn btn-primary" onclick="renderWizardStep(8)">Next →</button>
      </div>`;
  } else if (step === 8) {
    const hd = HIT_DICE[wizardData.class] || 8;
    const conBase = wizardData.abilities.con || 10;
    const conBonus = wizardData.abilityBonuses.con || 0;
    const conMod = Math.floor(((conBase + conBonus) - 10) / 2);
    const suggested = Math.max(1, (hd + conMod) * wizardData.level);
    if (!wizardData.maxHPSet) wizardData.maxHP = suggested;
    body = `<h2>✾ Hit Points</h2>${wizardProgress(8)}
      <div class="form-group"><label>Maximum HP</label>
        <input type="number" id="wiz-hp" value="${wizardData.maxHP}" min="1">
        <div style="font-size:0.75rem;color:var(--text-dim);margin-top:0.4rem">
          Hit Die: d${hd} &nbsp;|&nbsp; CON mod: ${conMod >= 0 ? '+' : ''}${conMod}
          <button class="btn btn-sm" style="margin-left:0.5rem" onclick="document.getElementById('wiz-hp').value=${suggested};wizardData.maxHP=${suggested};wizardData.maxHPSet=true">Use Suggested (${suggested})</button>
        </div>
      </div>
      <div style="background:var(--surface2);border-radius:var(--radius);padding:0.75rem;font-size:0.82rem;margin:0.5rem 0 0.8rem">
        <div style="font-weight:bold;color:var(--gold-lt);margin-bottom:0.3rem">${CLASS_ICONS[wizardData.class] || '⚔'} ${esc(wizardData.name)}</div>
        <div style="color:var(--text-dim)">Level ${wizardData.level} ${esc(wizardData.race || '—')} ${esc(wizardData.class)}${wizardData.subclass ? ' (' + esc(wizardData.subclass) + ')' : ''} &nbsp;&bull;&nbsp; PB +${profBonus(wizardData.level)}</div>
      </div>
      <div class="form-actions">
        <button class="btn" onclick="renderWizardStep(7)">← Back</button>
        <button class="btn btn-primary" onclick="wizardFinish()">Create Character ✦</button>
      </div>`;
  }
  openModal(body);
  setTimeout(() => {
    const inp = document.querySelector('#modal-content input[type="text"], #modal-content input[type="number"]');
    if (inp && step !== 1 && step !== 2 && step !== 3 && step !== 4 && step !== 5 && step !== 7) inp.focus();
  }, 40);
}

function wizardNext(step) {
  if (step === 0) {
    const v = document.getElementById('wiz-name')?.value.trim();
    if (!v) { const el = document.getElementById('wiz-name'); if (el) { el.style.borderColor = 'var(--red-lt)'; el.focus(); } return; }
    wizardData.name = v; renderWizardStep(1);
  } else if (step === 1) {
    renderWizardStep(2);
  } else if (step === 6) {
    // Validate background bonuses for 2024 backgrounds with stat groups
    // Skip validation for 2014 backgrounds (no stat group)
    if (wizardData._bgSource === '2014') {
      renderWizardStep(7);
      return;
    }
    const bg = wizardData.backgroundData;
    if (bg && bg.abilityGroup && bg.abilityGroup.length > 0) {
      // Check that both +2 and +1 bonuses are assigned
      const bonuses = wizardData.abilityBonuses;
      const has2 = Object.values(bonuses).includes(2);
      const has1 = Object.values(bonuses).includes(1);
      if (!has2 || !has1) {
        const errEl = document.getElementById('wiz-step6-error');
        if (errEl) {
          errEl.textContent = 'Please assign your +2 and +1 background bonuses before continuing.';
          errEl.style.display = '';
        }
        return;
      }
    }
    renderWizardStep(7);
  }
}

function wiz_selectSubclass(name) {
  wizardData.subclass = name;
  renderWizardStep(5);
}

function wiz_selectSpecies(srcKey, idx) {
  const sp = SPECIES_DATA[srcKey]?.[idx];
  if (!sp) return;
  wizardData.race = sp.name;
  wizardData.raceSource = srcKey;
  wizardData.raceData = sp;
  // Clear ability bonuses if switching source types
  wizardData.abilityBonuses = Object.keys(sp.abilityBonuses || {}).length ? { ...sp.abilityBonuses } : {};
  renderWizardStep(1);
}

function wiz_selectBackground(idx) {
  const srcKey = wizardData._bgSource === '2014' ? 'backgrounds_2014' : 'backgrounds_2024';
  const bg = SPECIES_DATA[srcKey]?.[idx];
  if (!bg) return;
  wizardData.background = bg.name;
  wizardData.backgroundData = bg;
  // Reset ability bonuses when changing background (for 2024 mode)
  if (!Object.keys(wizardData.raceData?.abilityBonuses || {}).length) {
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
  renderWizardStep(6);
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
  renderWizardStep(6);
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
  renderWizardStep(6);
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
  renderWizardStep(6);
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
      <input type="number" value="${base}" min="3" max="18" oninput="wizardData.abilities['${a}']=+this.value||10;wizardData._manualSet=true;renderWizardStep(6)"
        style="width:100%;text-align:center;background:transparent;border:none;border-bottom:1px solid rgba(var(--accent-rgb),0.3);color:var(--gold);font-size:1.2rem;font-weight:bold;font-family:inherit">
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
  renderWizardStep(6);
}

function wiz_rollSingle(ability) {
  const r = _roll4d6drop1();
  wizardData.abilities[ability] = r.total;
  wizardData._diceRolls = wizardData._diceRolls || {};
  wizardData._diceRolls[ability] = r.text;
  wizardData._manualSet = true;
  renderWizardStep(6);
}

function wiz_setClass(cls) {
  if (wizardData.class !== cls) wizardData.subclass = ''; // class change invalidates subclass
  wizardData.class = cls;
  renderWizardStep(3);
}
function wiz_setLevel(lvl) {
  wizardData.level = Math.min(20, Math.max(1, lvl));
  if (wizardData.level < 3) wizardData.subclass = ''; // subclass requires level 3+
  renderWizardStep(4);
}

function wizardFinish() {
  if (IS_SETUP_VIEW) {
    return _setupWizardFinish();
  }
  if (CharacterStore.getAllForCampaign(currentCampaignId).length >= 20) {
    showAlert('20 character limit reached.'); return;
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
  if (wizardData.subclass && ch.classes && ch.classes[0]) {
    ch.classes[0].subclass = wizardData.subclass;
    ch.subclass = wizardData.subclass; // backward-compat with code that reads ch.subclass directly
  }
  if (wizardData.subclass) {
    ch.subclass = wizardData.subclass;
    ch.class = wizardData.class;
  }
  // Background data
  if (wizardData.backgroundData) {
    ch.background = wizardData.background;
    (wizardData.backgroundData.skills || []).forEach(skill => addBackgroundSkill(ch, skill));
    const bgTools = wizardData.backgroundData.tools || [];
    ch.proficiencies = mergeProfString(ch.proficiencies, bgTools);
    ch.backgroundTools = [...bgTools];
    if (wizardData.backgroundData.feat) {
      ch.featuresList = ch.featuresList || [];
      const featName = wizardData.backgroundData.feat;
      const featsPool = FEATS_ITEMS_DATA?.feats || [];
      const featData = featsPool.find(x => x.name === featName)
        || featsPool.find(x => x.name === featName.replace(/\s*\(.*\)$/, ''));
      ch.featuresList.push({ name: featName, desc: featData?.desc || 'Granted by your background.', _feat: true, _featSource: 'PHB24', _fromBackground: wizardData.background });
    }
  }
  // Store species traits
  if (wizardData.raceData?.traits && Array.isArray(wizardData.raceData.traits) && wizardData.raceData.traits.length > 0) {
    ch.featuresList = ch.featuresList || [];
    wizardData.raceData.traits.forEach(trait => {
      ch.featuresList.push({ name: trait.name, desc: trait.desc, _species: wizardData.race });
    });
    ch.raceEdition = wizardData.raceSource === 'species_2024' ? '2024'
      : wizardData.raceSource === 'species_more' ? (wizardData.raceData.edition || '2014') : '2014';
    _applySpeciesLanguages(ch);
  }
  // Set speed from species
  if (wizardData.raceData?.speed) ch.combat.speed = wizardData.raceData.speed;
  db.characters[ch.id] = ch;
  syncClassResources(ch);
  if (wizardData.subclass) syncSubclassFeatures(ch.id);
  populateClassFeatures(ch.id);
  applySpellSlots(ch);
  const c = db.campaigns.find(c => c.id === currentCampaignId);
  (c.characters = c.characters || []).push(ch.id);
  if (!c.activeCharId) c.activeCharId = ch.id;
  saveData(db);
  switchToCharacter(ch.id);
  // Open starting proficiencies picker
  openStartingProfsModal(ch);
}

// ── Setup-Mode Wizard Finish ───────────────────────────────────────────────────
// Used when an anonymous player created a character via a setup link.
// Writes the character directly to the GM's Firestore path (no local db save)
// and appends its ID to the campaign's characters array.
let _setupPendingChar = null; // held for retry so we don't create a second doc on failure

async function _setupWizardFinish() {
  wizardData.maxHP = Math.max(1, parseInt(document.getElementById('wiz-hp')?.value) || wizardData.maxHP || 1);
  // Build character locally using the same logic as wizardFinish
  const ch = newCharacter(wizardData.name, wizardData.race, wizardData.class, wizardData.level);
  ch.id = 'char_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  ch.abilities = { ...wizardData.abilities };
  for (const [ab, bonus] of Object.entries(wizardData.abilityBonuses || {})) {
    ch.abilities[ab] = (ch.abilities[ab] || 10) + bonus;
  }
  ch.combat.maxHP = wizardData.maxHP;
  ch.combat.currentHP = wizardData.maxHP;
  ch.combat.initMisc = 0; // initiative follows DEX (after species bonuses)
  ch.proficiencyBonus = profBonus(wizardData.level);
  if (wizardData.subclass && ch.classes && ch.classes[0]) {
    ch.classes[0].subclass = wizardData.subclass;
    ch.subclass = wizardData.subclass;
  }
  if (wizardData.subclass) {
    ch.subclass = wizardData.subclass;
    ch.class = wizardData.class;
  }
  if (wizardData.backgroundData) {
    ch.background = wizardData.background;
    (wizardData.backgroundData.skills || []).forEach(skill => addBackgroundSkill(ch, skill));
    const bgTools = wizardData.backgroundData.tools || [];
    ch.proficiencies = mergeProfString(ch.proficiencies, bgTools);
    ch.backgroundTools = [...bgTools];
    if (wizardData.backgroundData.feat) {
      ch.featuresList = ch.featuresList || [];
      const featName = wizardData.backgroundData.feat;
      const featsPool = (typeof FEATS_ITEMS_DATA !== 'undefined' && FEATS_ITEMS_DATA?.feats) || [];
      const featData = featsPool.find(x => x.name === featName)
        || featsPool.find(x => x.name === featName.replace(/\s*\(.*\)$/, ''));
      ch.featuresList.push({
        name: featName,
        desc: featData?.desc || 'Granted by your background.',
        _feat: true,
        _featSource: 'PHB24',
        _fromBackground: wizardData.background
      });
    }
  }
  if (wizardData.raceData?.traits?.length) {
    ch.featuresList = ch.featuresList || [];
    wizardData.raceData.traits.forEach(trait => {
      ch.featuresList.push({ name: trait.name, desc: trait.desc, _species: wizardData.race });
    });
    ch.raceEdition = wizardData.raceSource === 'species_2024' ? '2024'
      : wizardData.raceSource === 'species_more' ? (wizardData.raceData.edition || '2014') : '2014';
    _applySpeciesLanguages(ch);
  }
  if (wizardData.raceData?.speed) ch.combat.speed = wizardData.raceData.speed;

  // Apply class resources, spell slots, share token via the in-memory db
  db = db || { characters: {}, campaigns: [], npcs: {} };
  db.characters[ch.id] = ch;
  try { syncClassResources(ch); } catch (e) { console.warn('[Setup] syncClassResources failed:', e); }
  try { if (wizardData.subclass) syncSubclassFeatures(ch.id); } catch (e) { console.warn('[Setup] syncSubclassFeatures failed:', e); }
  try { populateClassFeatures(ch.id); } catch (e) { console.warn('[Setup] populateClassFeatures failed:', e); }
  try { applySpellSlots(ch); } catch (e) { console.warn('[Setup] applySpellSlots failed:', e); }
  ch.shareToken = 'tok_' + uid();

  _setupPendingChar = ch; // save before first write so retry reuses same doc
  closeModal();
  await _retrySaveSetupChar();
}

async function _retrySaveSetupChar() {
  const ch = _setupPendingChar;
  if (!ch) return;
  const appEl = document.getElementById('app');
  appEl.innerHTML = `
    <div style="padding:3rem;text-align:center">
      <div style="font-size:2rem">✾</div>
      <p>Saving your character…</p>
    </div>`;

  try {
    // charRef.set is idempotent — safe to repeat on retry
    const charRef = firebase.firestore().doc(`users/${SETUP_GM_UID}/characters/${ch.id}`);
    await charRef.set(ch);
    const campRef = firebase.firestore().doc(`users/${SETUP_GM_UID}/campaigns/${SETUP_CAMPAIGN_ID}`);
    await campRef.update({
      characters: firebase.firestore.FieldValue.arrayUnion(ch.id)
    });
  } catch (e) {
    appEl.innerHTML = `
      <div style="padding:2rem;max-width:600px;margin:0 auto;text-align:center">
        <h2 style="color:var(--red-lt)">⚠ Could not save</h2>
        <p>${esc(e.message || 'Network error')}</p>
        <button class="btn btn-primary" onclick="_retrySaveSetupChar()">Try Again</button>
      </div>`;
    return;
  }

  _setupPendingChar = null;
  // Show success screen with personal player link
  const playerLink = `${window.location.origin}${window.location.pathname}?campaign=${SETUP_CAMPAIGN_ID}&player=${ch.id}&token=${ch.shareToken}&gm=${SETUP_GM_UID}`;
  const safeLink = playerLink.replace(/'/g, "\\'");
  appEl.innerHTML = `
    <div style="padding:2rem;max-width:600px;margin:0 auto;text-align:center">
      <div style="font-size:3rem">✦</div>
      <h1>${esc(ch.name)} is ready!</h1>
      <p style="color:var(--text-dim)">Bookmark this link — it's your personal character sheet.</p>
      <div style="margin:1.5rem 0;padding:1rem;background:var(--surface2);border-radius:8px;word-break:break-all;font-family:monospace;font-size:0.85rem">
        ${esc(playerLink)}
      </div>
      <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${safeLink}').then(()=>showToast('Link copied!'))">Copy Link</button>
      <a href="${playerLink}" class="btn" style="margin-left:0.5rem">Open Now</a>
    </div>`;
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
  const allProfs = [...(data.armor||[]), ...(data.weapons||[]), ...(data.tools||[])];
  const profSection = allProfs.length ? `
    <div class="cs-field-label" style="margin:0.75rem 0 0.35rem">Armor, Weapons &amp; Tools <span style="font-size:0.7rem;opacity:0.6">(granted)</span></div>
    <div class="sp-saves-list">${allProfs.map(p =>
      `<label class="sp-save-row sp-save-granted">
        <input type="checkbox" checked disabled>
        <span>${esc(p)}</span>
      </label>`
    ).join('')}</div>` : '';
  openModal(`
    <h2 style="color:${color}">${CLASS_ICONS[cls]||''} ${cls} Starting Proficiencies</h2>
    <p style="font-size:0.8rem;color:var(--text-dim);margin:0 0 0.75rem">These proficiencies are granted at character creation.</p>
    <div class="cs-field-label" style="margin-bottom:0.35rem">Saving Throws <span style="font-size:0.7rem;opacity:0.6">(granted)</span></div>
    <div class="sp-saves-list">${saveRows}</div>
    ${profSection}
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
  // Merge armor/weapon/tool proficiencies into ch.proficiencies
  const allProfs = [...(data.armor||[]), ...(data.weapons||[]), ...(data.tools||[])];
  if (allProfs.length) _grantProficiencies(ch, allProfs, cls);
  saveData(db);
  closeModal();
  renderApp();
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function openModal(html) { document.getElementById('modal-content').innerHTML=html; document.getElementById('modal-overlay').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// ── Confirm / Alert helpers (replace native confirm() / alert()) ───────────────
let _modalConfirmFn = null, _modalCancelFn = null;
function showConfirm(msg, onConfirm, onCancel) {
  _modalConfirmFn = onConfirm || null;
  _modalCancelFn = onCancel || null;
  openModal(`<div style="text-align:center;padding:0.5rem 0 0.75rem">
    <div style="font-size:2rem;margin-bottom:0.5rem;color:#f59e0b">⚠</div>
    <p style="margin:0 0 1.25rem;font-size:0.95rem;color:var(--text);line-height:1.5">${esc(msg)}</p>
    <div class="form-actions" style="justify-content:center">
      <button class="btn" onclick="_modalDismiss()">Cancel</button>
      <button class="btn btn-danger" onclick="_modalAccept()">Confirm</button>
    </div>
  </div>`);
}
function showAlert(msg, success) {
  openModal(`<div style="text-align:center;padding:0.5rem 0 0.75rem">
    <div style="font-size:2rem;margin-bottom:0.5rem;color:${success?'#22c55e':'#f59e0b'}">${success?'✓':'⚠'}</div>
    <p style="margin:0 0 1.25rem;font-size:0.95rem;color:var(--text);line-height:1.5">${esc(msg)}</p>
    <div class="form-actions" style="justify-content:center">
      <button class="btn btn-primary" onclick="closeModal()">OK</button>
    </div>
  </div>`);
}
function _modalAccept() { closeModal(); const fn=_modalConfirmFn; _modalConfirmFn=null; _modalCancelFn=null; fn?.(); }
function _modalDismiss() { closeModal(); const fn=_modalCancelFn; _modalConfirmFn=null; _modalCancelFn=null; fn?.(); }

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
      showConfirm('This will replace all current data. Continue?', ()=>{
        db=imported; if(!db.npcs) db.npcs={};
        Object.values(db.characters).forEach(ch=>migrateCharacter(ch));
        // Reset snapshot so Firestore sees everything as new/changed
        _takeSnapshot({ campaigns: [], characters: {}, npcs: {} });
        saveData(db); showCampaigns(); showAlert('Import successful!', true);
      });
    } catch { showAlert('Invalid file.'); }
  };
  reader.readAsText(file); event.target.value='';
}

// ── Utility ────────────────────────────────────────────────────────────────────
function esc(str) {
  if(str==null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
// For embedding values inside single-quoted JS strings in onclick attributes.
// HTML entities decoded before JS runs, so use backslash-escaping instead of &#39;.
function jsStr(str) {
  if(str==null) return '';
  return String(str).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
}

// ══════════════════════════════════════════════════════════════════════════════
// Color Theme Selector
// ══════════════════════════════════════════════════════════════════════════════

const THEMES = {
  arcane: {
    name: 'Arcane',
    accent: '#9b6dff', accentRGB: '155,109,255', gold: '#c084fc', goldLt: '#d8b4fe',
    bg: '#0f0a1a', surface: '#1f1f26', surface2: '#26262f',
    hpGradient: 'linear-gradient(90deg, #ec4899, #9b6dff)',
  },
  emerald: {
    name: 'Emerald',
    accent: '#4ade80', accentRGB: '74,222,128', gold: '#86efac', goldLt: '#bbf7d0',
    bg: '#0a1a0f', surface: '#0f2415', surface2: '#163020',
    hpGradient: 'linear-gradient(90deg, #fde047, #4ade80)',
  },
  crimson: {
    name: 'Crimson',
    accent: '#ef4444', accentRGB: '239,68,68', gold: '#fca5a5', goldLt: '#fecaca',
    bg: '#1a0808', surface: '#250d0d', surface2: '#301212',
    hpGradient: 'linear-gradient(90deg, #fb923c, #ef4444)',
  },
  sapphire: {
    name: 'Sapphire',
    accent: '#60a5fa', accentRGB: '96,165,250', gold: '#93c5fd', goldLt: '#bfdbfe',
    bg: '#0a0f1a', surface: '#101525', surface2: '#161e30',
    hpGradient: 'linear-gradient(90deg, #22d3ee, #60a5fa)',
  },
  'rose-gold': {
    name: 'Rose Gold',
    accent: '#f472b6', accentRGB: '244,114,182', gold: '#fbcfe8', goldLt: '#fce7f3',
    bg: '#1a0d14', surface: '#251018', surface2: '#30141e',
    hpGradient: 'linear-gradient(90deg, #fcd34d, #f472b6)',
  },
};

const THEME_STORAGE_KEY = 'dnd_theme_v1';

// Convert hex (#rrggbb) to RGB object
function _hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substr(0, 2), 16),
    g: parseInt(h.substr(2, 2), 16),
    b: parseInt(h.substr(4, 2), 16)
  };
}

// Convert hex (#rrggbb) to rgba string with given alpha
function _hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Lighten a hex color by mixing it with white by amt (0-1)
function _lighten(hex, amt) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  const lr = Math.round(r + (255 - r) * amt);
  const lg = Math.round(g + (255 - g) * amt);
  const lb = Math.round(b + (255 - b) * amt);
  return `rgb(${lr},${lg},${lb})`;
}

// Lighten a gold by slight amount for --gold-lt (a paler variant)
function _paler(hex, amt) {
  return _lighten(hex, amt);
}

function applyTheme(themeKey) {
  const theme = THEMES[themeKey] || THEMES.arcane;
  const root = document.documentElement;
  const surface  = theme.surface  || _lighten(theme.bg, 0.06);
  const surface2 = theme.surface2 || _lighten(theme.bg, 0.12);
  const goldLt   = theme.goldLt   || _paler(theme.gold, 0.35);
  const accentRGB = theme.accentRGB || `${_hexToRgb(theme.accent).r},${_hexToRgb(theme.accent).g},${_hexToRgb(theme.accent).b}`;

  root.style.setProperty('--accent',      theme.accent);
  root.style.setProperty('--accent-rgb',  accentRGB);
  root.style.setProperty('--accent-dim',  _hexToRgba(theme.accent, 0.6));
  root.style.setProperty('--gold',        theme.gold);
  root.style.setProperty('--gold-lt',     goldLt);
  root.style.setProperty('--bg',          theme.bg);
  root.style.setProperty('--surface',     surface);
  root.style.setProperty('--surface2',    surface2);
  root.style.setProperty('--border',      _hexToRgba(theme.accent, 0.25));
  root.style.setProperty('--hp-gradient', theme.hpGradient || 'linear-gradient(90deg, #ec4899, #9b6dff)');
  // Also update body backgroundColor for the hard-coded base
  document.body.style.backgroundColor = theme.bg;
  try { localStorage.setItem(THEME_STORAGE_KEY, themeKey); } catch (e) {}
  renderThemeSwatches(themeKey);
}

function renderThemeSwatches(selectedKey) {
  const dd = document.getElementById('theme-dropdown');
  if (!dd) return;
  const items = Object.entries(THEMES).map(([key, t]) => `
    <div class="theme-swatch-item" onclick="applyTheme('${key}')">
      <div class="theme-swatch ${key === selectedKey ? 'selected' : ''}" style="background:${t.accent}"></div>
      <div class="theme-name">${t.name}</div>
    </div>
  `).join('');
  dd.innerHTML = `<div class="theme-dropdown-title">✾ Color Theme</div>
    <div class="theme-swatch-list">${items}</div>`;
}

function toggleThemeDropdown(e) {
  if (e) e.stopPropagation();
  const dd = document.getElementById('theme-dropdown');
  if (!dd) return;
  const isHidden = dd.classList.contains('hidden');
  if (isHidden) {
    const current = (() => { try { return localStorage.getItem(THEME_STORAGE_KEY) || 'arcane'; } catch (e) { return 'arcane'; } })();
    renderThemeSwatches(current);
    dd.classList.remove('hidden');
    // Close on outside click (next tick so this click doesn't trigger it)
    setTimeout(() => {
      document.addEventListener('click', _closeThemeDropdownOnOutside, { once: true });
    }, 0);
  } else {
    dd.classList.add('hidden');
  }
}

function _closeThemeDropdownOnOutside(e) {
  const dd = document.getElementById('theme-dropdown');
  const btn = document.getElementById('theme-btn');
  if (!dd || dd.classList.contains('hidden')) return;
  if (dd.contains(e.target) || (btn && btn.contains(e.target))) {
    // Re-register listener — swatch clicks re-render but should not close dropdown
    document.addEventListener('click', _closeThemeDropdownOnOutside, { once: true });
    return;
  }
  dd.classList.add('hidden');
}

// Restore theme on load
(function _initTheme() {
  let saved = 'arcane';
  try { saved = localStorage.getItem(THEME_STORAGE_KEY) || 'arcane'; } catch (e) {}
  if (!THEMES[saved]) saved = 'arcane';
  // Apply immediately (before render) so FOUC is minimized
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTheme(saved));
  } else {
    applyTheme(saved);
  }
})();

// ══════════════════════════════════════════════════════════════════════════════
// Visual Enhancements — Particle System & Micro-animation Helpers
// ══════════════════════════════════════════════════════════════════════════════

function _prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Background particle system: tiny drifting purple dots & occasional ✦ glyphs
(function _initBgParticles() {
  if (typeof document === 'undefined') return;
  if (_prefersReducedMotion()) return;

  function start() {
    if (document.getElementById('bg-particles')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particles';
    (document.body || document.documentElement).appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const MAX = 35;
    const particles = [];
    function spawn() {
      particles.push({
        x: Math.random() * W,
        y: H + 8,
        vy: 0.18 + Math.random() * 0.35,
        size: 1 + Math.random() * 1.3,
        life: 0,
        maxLife: 6000 + Math.random() * 4000,
        drift: (Math.random() - 0.5) * 0.22,
        glyph: Math.random() < 0.13 ? '✦' : null
      });
    }

    let last = performance.now();
    function tick(now) {
      requestAnimationFrame(tick);
      if (document.hidden) { last = now; return; }
      const dt = Math.min(50, now - last);
      last = now;

      if (particles.length < MAX && Math.random() < 0.015 * dt) spawn();

      ctx.clearRect(0, 0, W, H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life > p.maxLife) { particles.splice(i, 1); continue; }
        p.y -= p.vy;
        p.x += p.drift;
        const t = p.life / p.maxLife;
        const alpha = t < 0.15 ? t / 0.15 : (1 - t) * 0.65;
        if (p.glyph) {
          ctx.fillStyle = 'rgba(196,180,84,' + (alpha * 0.55).toFixed(3) + ')';
          ctx.font = Math.round(8 + p.size * 3) + 'px serif';
          ctx.fillText(p.glyph, p.x, p.y);
        } else {
          ctx.fillStyle = 'rgba(var(--accent-rgb),' + (alpha * 0.45).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

// ── Animation trigger helpers ─────────────────────────────────────────────────
function _flashHPDamage() {
  if (_prefersReducedMotion()) return;
  const btn = document.querySelector('.hp-dmg-btn');
  if (btn) { btn.classList.remove('flash'); void btn.offsetWidth; btn.classList.add('flash'); setTimeout(() => btn.classList.remove('flash'), 400); }
  const val = document.getElementById('hp-current-val');
  if (val) { val.classList.remove('hp-shake'); void val.offsetWidth; val.classList.add('hp-shake'); setTimeout(() => val.classList.remove('hp-shake'), 400); }
}

function _flashHPHeal() {
  if (_prefersReducedMotion()) return;
  const btn = document.querySelector('.hp-heal-btn');
  if (btn) { btn.classList.remove('flash'); void btn.offsetWidth; btn.classList.add('flash'); setTimeout(() => btn.classList.remove('flash'), 400); }
  const val = document.getElementById('hp-current-val');
  if (val) { val.classList.remove('hp-bounce'); void val.offsetWidth; val.classList.add('hp-bounce'); setTimeout(() => val.classList.remove('hp-bounce'), 400); }
}

function _popSpellSlot(level, index) {
  if (_prefersReducedMotion()) return;
  const rows = document.querySelectorAll('.spell-slot-row');
  const bubbles = rows[level - 1]?.querySelectorAll('.spell-bubble');
  const el = bubbles && bubbles[index];
  if (!el) return;
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  setTimeout(() => el.classList.remove('pop'), 240);
}

function _shimmerLongRestBtn() {
  if (_prefersReducedMotion()) return;
  const btn = document.querySelector('.hp-long-btn');
  if (!btn) return;
  btn.classList.remove('shimmer'); void btn.offsetWidth; btn.classList.add('shimmer');
  setTimeout(() => btn.classList.remove('shimmer'), 780);
}

// ── Init ───────────────────────────────────────────────────────────────────────
if (IS_SETUP_VIEW) {
  // Setup view: anonymous player creates a character via setup link
  _setupBootstrap();
} else if (IS_PLAYER_VIEW) {
  // Player view: skip auth, load character directly from Firestore
  _initPlayerView();
  window.addEventListener('online',  () => _updateOnlineBanner(true));
  window.addEventListener('offline', () => _updateOnlineBanner(false));
  _updateOnlineBanner(navigator.onLine);
} else {
  // GM mode: Firebase auth controls the app lifecycle
  initData();
}

// ── Setup View Bootstrap ─────────────────────────────────────────────────────
async function _setupBootstrap() {
  _initFirebase();
  // Hide auth gate, show app shell
  const gate = document.getElementById('auth-gate');
  const header = document.getElementById('app-header');
  const appEl = document.getElementById('app');
  if (gate) gate.style.display = 'none';
  if (header) header.style.display = 'none';
  if (appEl) appEl.style.display = '';

  if (!_firestoreReady) {
    appEl.innerHTML =
      '<div style="padding:2rem;text-align:center;color:var(--red-lt)">Could not initialize. Please refresh and try again.</div>';
    return;
  }

  // Sign in anonymously so Firestore rules (request.auth != null) are satisfied
  try {
    await firebase.auth().signInAnonymously();
  } catch (e) {
    appEl.innerHTML =
      '<div style="padding:2rem;text-align:center;color:var(--red-lt)">Could not initialize. Please refresh and try again.</div>';
    return;
  }

  // Validate the setup link by reading the campaign doc
  try {
    const campSnap = await firebase.firestore()
      .doc(`users/${SETUP_GM_UID}/campaigns/${SETUP_CAMPAIGN_ID}`).get();
    if (!campSnap.exists) throw new Error('Campaign not found');
    const camp = campSnap.data();
    if (!camp.setupToken || camp.setupToken !== SETUP_TOKEN) {
      throw new Error('Invalid or expired setup link');
    }
    window._setupCampaign = camp;
    window._setupCampaignName = camp.name || 'Campaign';
  } catch (e) {
    appEl.innerHTML =
      `<div style="padding:2rem;text-align:center;color:var(--red-lt)">
        ⚠ ${esc(e.message || 'Invalid setup link')}<br><br>
        <span style="color:var(--text-dim);font-size:0.9rem">Ask your GM for a new link.</span>
      </div>`;
    return;
  }

  // Initialize an in-memory db so the wizard can operate
  db = db || { characters: {}, campaigns: [], npcs: {} };

  // Show a friendly intro then open the wizard
  appEl.innerHTML = `
    <div style="padding:2rem;max-width:600px;margin:0 auto;text-align:center">
      <div style="font-size:3rem">✾</div>
      <h1>Welcome to ${esc(window._setupCampaignName)}</h1>
      <p style="color:var(--text-dim);margin-bottom:2rem">
        Your GM has invited you to create a character.
      </p>
      <button class="btn btn-primary" onclick="openCharWizard()">Begin Character Creation</button>
    </div>`;
}
