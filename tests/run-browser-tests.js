// Runs the browser tests. They open index.html from disk (see browser.js), so no server is needed.
//   cd tests && npm i --no-save puppeteer-core@23 && node run-browser-tests.js [test files...]
const { spawnSync } = require('child_process');
const path = require('path');

const tests = process.argv.slice(2).length ? process.argv.slice(2)
  : ['class-switch.browser.test.js', 'features.browser.test.js', 'rules-text.browser.test.js', 'books.browser.test.js',
     'spells.browser.test.js', 'proficiencies.browser.test.js', 'sheet.browser.test.js', 'combat.browser.test.js'];

let failed = 0;
for (const t of tests) {
  console.log(`\n── ${t}`);
  const r = spawnSync(process.execPath, [path.resolve(__dirname, t)], { stdio: 'inherit' });
  if (r.status !== 0) failed++;
}
console.log(failed ? `\n${failed} browser test file(s) failed` : '\nAll browser tests passed');
process.exit(failed ? 1 : 0);
