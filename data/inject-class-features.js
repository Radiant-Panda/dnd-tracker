/**
 * Replaces CLASS_FEATURES and CLASS_FEATURES_2024 in app.js with the generated versions.
 * Run: node data/inject-class-features.js
 */
const fs = require('fs');

const appPath  = 'C:\\Users\\Kiana\\dnd-tracker\\app.js';
const genPath  = 'C:\\Users\\Kiana\\dnd-tracker\\data\\class-features-generated.js';

let appSrc = fs.readFileSync(appPath, 'utf8');
const genSrc = fs.readFileSync(genPath, 'utf8');

// Find the end index of a `const NAME = {...};` block starting at startIdx
function blockEnd(src, startIdx) {
  let depth = 0, endIdx = startIdx;
  for (let i = startIdx; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }
  }
  if (src[endIdx] === ';') endIdx++;
  return endIdx;
}

function extractBlock(src, name) {
  const marker = `const ${name} = {`;
  const start = src.indexOf(marker);
  if (start === -1) return null;
  return src.slice(start, blockEnd(src, start));
}

for (const name of ['CLASS_FEATURES', 'CLASS_FEATURES_2024']) {
  const newBlock = extractBlock(genSrc, name);
  if (!newBlock) { console.error(`Could not find ${name} in generated file`); process.exit(1); }

  const startIdx = appSrc.indexOf(`const ${name} = {`);
  if (startIdx !== -1) {
    const endIdx = blockEnd(appSrc, startIdx);
    appSrc = appSrc.slice(0, startIdx) + newBlock + appSrc.slice(endIdx);
    console.log(`Replaced ${name} in app.js (${newBlock.length} chars)`);
  } else if (name === 'CLASS_FEATURES_2024') {
    // Insert right after the CLASS_FEATURES block
    const cfStart = appSrc.indexOf('const CLASS_FEATURES = {');
    if (cfStart === -1) { console.error('Could not find CLASS_FEATURES in app.js'); process.exit(1); }
    const cfEnd = blockEnd(appSrc, cfStart);
    appSrc = appSrc.slice(0, cfEnd) + '\n\n' + newBlock + appSrc.slice(cfEnd);
    console.log(`Inserted ${name} into app.js (${newBlock.length} chars)`);
  } else {
    console.error(`Could not find ${name} in app.js`);
    process.exit(1);
  }
}

fs.writeFileSync(appPath, appSrc, 'utf8');
console.log('Done.');
