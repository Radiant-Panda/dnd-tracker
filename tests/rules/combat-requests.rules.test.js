// Security-rule tests for combat requests. Needs Java 11+ and the Firestore emulator:
//   cd tests/rules && npm install && npx firebase emulators:exec --only firestore --project demo-dnd "node combat-requests.rules.test.js"
const fs = require('fs');
const path = require('path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where, serverTimestamp } = require('firebase/firestore');

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
  const REQS = 'users/gm/campaigns/camp/combatRequests';
  const seed = async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async ctx => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'users/gm/campaigns/camp'), { id: 'camp', characters: ['c1', 'c2', 'c3'] });
      await setDoc(doc(db, 'users/gm/characters/c1'), { id: 'c1', shareToken: 'tok1' });
      await setDoc(doc(db, 'users/gm/characters/c2'), { id: 'c2', shareToken: null });
      await setDoc(doc(db, 'users/gm/characters/c9'), { id: 'c9', shareToken: 'tok9' });
    });
  };
  const db = (who = 'p1') => env.authenticatedContext(who).firestore();
  const req = (over = {}) => ({
    uid: 'p1', charId: 'c1', shareToken: 'tok1', combatId: 'cmb', fromCompanionId: '', fromName: 'Thorn',
    kind: 'damage', note: 'Fireball', save: { onSave: 'half', ability: 'DEX', dc: 15 },
    targets: [{ cbId: 'a', parts: [{ amount: 28, type: 'fire' }] }], createdAt: serverTimestamp(), ...over,
  });
  const create = (data, id = 'r1', who = 'p1') => setDoc(doc(db(who), `${REQS}/${id}`), data);

  await seed();
  await test('a player can send a valid request', () => assertSucceeds(create(req())));
  await test('a player can read their own request', () => assertSucceeds(getDoc(doc(db(), `${REQS}/r1`))));
  await test('a player can list their own requests', () => assertSucceeds(getDocs(query(collection(db(), REQS), where('uid', '==', 'p1')))));
  await test('a player cannot list everyone\'s requests', () => assertFails(getDocs(collection(db(), REQS))));
  await test('another player cannot read it', () => assertFails(getDoc(doc(db('p2'), `${REQS}/r1`))));
  await test('another player cannot cancel it', () => assertFails(deleteDoc(doc(db('p2'), `${REQS}/r1`))));
  await test('nobody but the GM can change a request', () => assertFails(updateDoc(doc(db(), `${REQS}/r1`), { note: 'x' })));
  await test('a player can cancel their own request', () => assertSucceeds(deleteDoc(doc(db(), `${REQS}/r1`))));

  await seed();
  await test('heal requests are allowed', () => assertSucceeds(create(req({ kind: 'heal', save: null, targets: [{ cbId: 'a', parts: [{ amount: 9, type: '' }] }] }))));
  await test('20 targets with 4 parts each are allowed', () => assertSucceeds(create(req({
    targets: Array.from({ length: 20 }, (_, i) => ({ cbId: 'x' + i, parts: Array(4).fill({ amount: 9, type: 'fire' }) })) }), 'r20')));
  await test('a wrong share token is rejected', () => assertFails(create(req({ shareToken: 'nope' }), 'r2')));
  await test('a character outside the campaign is rejected', () => assertFails(create(req({ charId: 'c9', shareToken: 'tok9' }), 'r3')));
  await test('an unshared character is rejected', () => assertFails(create(req({ charId: 'c2', shareToken: null }), 'r4')));
  await test('a character that does not exist is rejected', () => assertFails(create(req({ charId: 'c3', shareToken: 'x' }), 'r5')));
  await test('the uid must be the sender', () => assertFails(create(req({ uid: 'p2' }), 'r6')));
  await test('extra fields are rejected', () => assertFails(create(req({ hp: 0 }), 'r7')));
  await test('21 targets are rejected', () => assertFails(create(req({
    targets: Array.from({ length: 21 }, (_, i) => ({ cbId: 'x' + i, parts: [{ amount: 1, type: 'fire' }] })) }), 'r8')));
  await test('no targets are rejected', () => assertFails(create(req({ targets: [] }), 'r10')));
  await test('a long note is rejected', () => assertFails(create(req({ note: 'x'.repeat(101) }), 'r12')));
  await test('an unknown kind is rejected', () => assertFails(create(req({ kind: 'kill' }), 'r13')));
  await test('a made-up timestamp is rejected', () => assertFails(create(req({ createdAt: new Date(0) }), 'r14')));
  await test('an id with odd characters is rejected', () => assertFails(create(req(), "x');alert(1);('")));
  await test('signed-out visitors cannot send', () => assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), `${REQS}/r15`), req())));

  await seed();
  await create(req());
  await test('the GM can read every request', () => assertSucceeds(getDocs(collection(db('gm'), REQS))));
  await test('the GM can delete a request', () => assertSucceeds(deleteDoc(doc(db('gm'), `${REQS}/r1`))));

  await env.cleanup();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
