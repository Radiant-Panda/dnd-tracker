// Browser test for Google sign-in — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node auth.browser.test.js
// Browsers only allow a pop-up opened straight from the click. A pop-up opened after
// awaiting something else is blocked (auth/popup-blocked), so sign-in must open exactly
// one pop-up, synchronously, even when an anonymous player-link session is present.
const { launch, openApp } = require('./browser');
(async () => {
  const b = await launch();
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await openApp(pg);
  const out = await pg.evaluate(async () => {
    const out = []; const check = (name, cond, detail) => out.push((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  → ' + JSON.stringify(detail)));
    showToast = () => {};
    // Fake Firebase auth that behaves like a browser popup blocker
    let inClick = false; const popups = [];
    const popup = kind => { popups.push({ kind, allowed: inClick }); return inClick ? null : 'blocked'; };
    const alreadyInUse = Object.assign(new Error('credential already in use'), { code: 'auth/credential-already-in-use' });
    const blocked = Object.assign(new Error('Unable to establish a connection with the popup.'), { code: 'auth/popup-blocked' });
    _authReady = true;
    _fireAuth = {
      currentUser: { isAnonymous: true,
        linkWithPopup: () => { const r = popup('link'); return r ? Promise.reject(blocked) : Promise.reject(alreadyInUse); } },
      signInWithPopup: () => { const r = popup('signIn'); return r ? Promise.reject(blocked) : Promise.resolve({ user: { isAnonymous: false } }); },
    };
    // Simulate the click: the gesture only lasts for the synchronous part of the handler
    inClick = true; const p = signInWithGoogle(); inClick = false; await p;
    check('signing in with an anonymous session opens one pop-up', popups.length === 1, popups);
    check('…straight from the click, so it is not blocked', popups.every(x => x.allowed), popups);
    check('…and it signs in (not a link attempt)', popups[0]?.kind === 'signIn', popups);
    return out;
  });
  out.forEach(l => console.log(l));
  if (errs.length) console.log('PAGE ERRORS:', errs);
  const failed = out.filter(l => l.startsWith('FAIL')).length + (errs.length ? 1 : 0);
  console.log(`\n${out.length - out.filter(l => l.startsWith('FAIL')).length}/${out.length} passed`);
  await b.close();
  process.exit(failed ? 1 : 0);
})();
