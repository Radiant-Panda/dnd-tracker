// Starts a temporary local server, runs the browser tests, and always stops the server.
//   cd tests && npm i --no-save puppeteer-core@23 && node run-browser-tests.js [test files...]
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const http = require('http');

const root = path.join(__dirname, '..');
const tests = process.argv.slice(2).length ? process.argv.slice(2)
  : ['class-switch.browser.test.js', 'features.browser.test.js', 'rules-text.browser.test.js', 'books.browser.test.js'];

const server = spawn('npx', ['--yes', 'serve', '-l', '5173', root], { shell: true, stdio: 'ignore', windowsHide: true });
const stop = () => {
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill();
};
process.on('exit', stop);
process.on('SIGINT', () => process.exit(130));

const up = () => new Promise(res => http.get('http://localhost:5173/', r => { r.resume(); res(true); }).on('error', () => res(false)));

(async () => {
  for (let i = 0; i < 60 && !(await up()); i++) await new Promise(r => setTimeout(r, 500));
  let failed = 0;
  for (const t of tests) {
    console.log(`\n── ${t}`);
    const r = spawnSync(process.execPath, [path.join(__dirname, t)], { stdio: 'inherit' });
    if (r.status !== 0) failed++;
  }
  console.log(failed ? `\n${failed} browser test file(s) failed` : '\nAll browser tests passed');
  process.exit(failed ? 1 : 0);
})();
