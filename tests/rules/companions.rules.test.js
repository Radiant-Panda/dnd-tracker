// Security-rule tests for companion cards. Needs Java 11+ and the Firestore emulator:
//   cd tests/rules && npm install && npx firebase emulators:exec --only firestore --project demo-dnd "node companions.rules.test.js"
const fs = require('fs');
const path = require('path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } = require('firebase/firestore');

(async () => {
  const env = await initializeTestEnvironment({
    projectId: 'demo-dnd',
    firestore: { rules: fs.readFileSync(path.join(__dirname, '..', '..', 'firestore.rules'), 'utf8'), host: '127.0.0.1', port: 8080 },
  });
  let passed = 0, failed = 0;
  const test = async (name, fn) => {
    try { await fn(); passed++; console.log('  ✓ ' + name); }
    catch (e) { failed++; console.log('  ✗ ' + name + ' — ' + (e.message || e).split('\n')[0]); }
  };
  const base = { id: 'c1', shareToken: 't', playerAccess: 'play', hp: 10, maxHP: 20, tempHP: 0, name: 'Sildar', ac: 15,
    ownerCharId: 'a', npcId: 'n1', campaignId: 'camp', conditions: [], uses: {}, portrait: null };
  const seed = async (over = {}) => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async ctx => { await setDoc(doc(ctx.firestore(), 'users/gm/companions/c1'), { ...base, ...over }); });
  };
  const player = () => doc(env.authenticatedContext('anon').firestore(), 'users/gm/companions/c1');
  const gm = () => doc(env.authenticatedContext('gm').firestore(), 'users/gm/companions/c1');

  // Run in play
  await seed();
  await test('a player can read a shared companion', () => assertSucceeds(getDoc(player())));
  await test('Run in play: player can change HP', () => assertSucceeds(updateDoc(player(), { hp: 5 })));
  await test('Run in play: player can change temp HP, conditions and uses', () => assertSucceeds(updateDoc(player(), { tempHP: 3, conditions: ['Prone'], uses: { 'actions:x': 1 } })));
  await test('Run in play: player can set art', () => assertSucceeds(updateDoc(player(), { portrait: 'data:image/jpeg;base64,AAAA', portraitZoom: 120 })));
  await test('Run in play: player cannot change AC', () => assertFails(updateDoc(player(), { ac: 18 })));
  await test('Run in play: player cannot rename', () => assertFails(updateDoc(player(), { name: 'X' })));
  await test('player cannot change the access setting', () => assertFails(updateDoc(player(), { playerAccess: 'full' })));
  await test('player cannot change the share token', () => assertFails(updateDoc(player(), { shareToken: 'z' })));
  await test('player cannot change the owner', () => assertFails(updateDoc(player(), { ownerCharId: 'b' })));
  await test('HP cannot go above max HP', () => assertFails(updateDoc(player(), { hp: 25 })));
  await test('HP cannot go below 0', () => assertFails(updateDoc(player(), { hp: -1 })));
  await test('temp HP cannot go below 0', () => assertFails(updateDoc(player(), { tempHP: -2 })));
  await test('art over the size limit is rejected', () => assertFails(updateDoc(player(), { portrait: 'x'.repeat(300001) })));
  await test('a player cannot create a companion', () => assertFails(setDoc(doc(env.authenticatedContext('anon').firestore(), 'users/gm/companions/c2'), { ...base, id: 'c2' })));
  await test('a player cannot delete a companion', () => assertFails(deleteDoc(player())));
  await test('a player cannot list companions', () => assertFails(getDocs(collection(env.authenticatedContext('anon').firestore(), 'users/gm/companions'))));
  await test('signed-out visitors cannot read it', () => assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'users/gm/companions/c1'))));

  // View only
  await seed({ playerAccess: 'view' });
  await test('View only: player can still read', () => assertSucceeds(getDoc(player())));
  await test('View only: player cannot change HP', () => assertFails(updateDoc(player(), { hp: 5 })));
  await test('View only: player cannot change art', () => assertFails(updateDoc(player(), { portrait: 'data:image/jpeg;base64,AA' })));

  // Full edit
  await seed({ playerAccess: 'full' });
  await test('Full edit: player can change stats and name', () => assertSucceeds(updateDoc(player(), { ac: 18, maxHP: 30, hp: 25, name: 'Sir Sildar' })));
  await test('Full edit: player can swap the stat block', () => assertSucceeds(updateDoc(player(), { statBlock: { actions: [] }, statSource: 'Knight', legendaryMax: 0, initBonus: 1 })));
  await test('Full edit: player still cannot change links or access', () => assertFails(updateDoc(player(), { ownerCharId: 'b' })));
  await test('Full edit: HP still capped at the new max', () => assertFails(updateDoc(player(), { maxHP: 12, hp: 15 })));

  // Not shared
  await seed({ shareToken: null });
  await test('an unshared companion cannot be read by players', () => assertFails(getDoc(player())));

  // GM
  await seed();
  await test('the GM can change anything', () => assertSucceeds(updateDoc(gm(), { playerAccess: 'view', ac: 12, name: 'Renamed' })));
  await test('the GM can delete', () => assertSucceeds(deleteDoc(gm())));

  await env.cleanup();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
