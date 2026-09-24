// Shared setup for the browser tests: opens index.html straight from disk (no server needed).
// --allow-file-access-from-files lets the page fetch data/spells.json from disk.
const p = require('puppeteer-core');
const path = require('path');
const APP_URL = 'file:///' + path.join(__dirname, '..', 'index.html').replace(/\\/g, '/');
const launch = () => p.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--allow-file-access-from-files'] });
async function openApp(page) {
  await page.goto(APP_URL, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1500));
}
module.exports = { launch, openApp };
