// ── Encumbrance Rules ────────────────────────────────────────────────────────
// Pure logic (no DOM): weight of what a character carries and how much they can carry.
// Item weights come from data/item_weights.js (generated from 5etools).
// Equipment entries are free text ("20 arrows", "Dagger x2", "+1 Longsword") or magic
// item objects ({ name, _magic: true }).

function _enWeights() { return typeof ITEM_WEIGHTS !== 'undefined' ? ITEM_WEIGHTS : {}; }

function _enLookup(name, edition) {
  const w = _enWeights()[String(name).trim().toLowerCase()];
  if (w === undefined) return null;
  return typeof w === 'number' ? w : (w[edition] ?? w['2024']);
}

// Tries the name as written, then the singular form ("Daggers" → "dagger", "Arrows" → "arrow")
function _enLookupLoose(name, edition) {
  const n = name.trim();
  let w = _enLookup(n, edition);
  if (w === null && /ies$/i.test(n)) w = _enLookup(n.replace(/ies$/i, 'y'), edition);
  if (w === null && /es$/i.test(n)) w = _enLookup(n.replace(/es$/i, ''), edition);
  if (w === null && /s$/i.test(n)) w = _enLookup(n.replace(/s$/i, ''), edition);
  return w;
}

// Weight of one equipment entry: { weight, qty } — weight is null when the item is unknown
function entryWeight(entry, edition = '2024') {
  const text = String(typeof entry === 'object' && entry ? entry.name : entry || '').trim();
  const exact = _enLookup(text, edition);
  if (exact !== null) return { weight: exact, qty: 1 };
  let name = text, qty = 1, m;
  if ((m = name.match(/^(\d+)\s*[x×]?\s+(.+)$/i))) { qty = +m[1]; name = m[2]; }
  else if ((m = name.match(/^(.+?)\s*[x×]\s*(\d+)$/i))) { name = m[1]; qty = +m[2]; }
  else if ((m = name.match(/^(.+?)\s*\((\d+)\)$/))) { name = m[1]; qty = +m[2]; }
  name = name.replace(/^\+\d+\s+/, '').replace(/\s+\+\d+$/, '');   // "+1 Longsword" weighs a Longsword
  const each = _enLookupLoose(name, edition);
  return { weight: each === null ? null : Math.round(each * qty * 100) / 100, qty };
}

// Items + coins (50 coins weigh 1 lb) + the manual "other" amount (ch.carryWeight)
function carriedWeight(ch) {
  const edition = ch.edition === '2014' ? '2014' : '2024';
  let items = 0; const unknown = [];
  (ch.equipment || []).forEach(e => {
    const { weight } = entryWeight(e, edition);
    if (weight !== null) items += weight;
    else if (!(typeof e === 'object' && e && e._magic)) unknown.push(typeof e === 'object' ? e.name : e);
  });
  const c = ch.currency || {};
  const coinCount = ['cp', 'sp', 'ep', 'gp', 'pp'].reduce((s, k) => s + (parseInt(c[k]) || 0), 0);
  const round = n => Math.round(n * 100) / 100;
  const coins = round(coinCount / 50), other = parseFloat(ch.carryWeight) || 0;
  return { items: round(items), coins, other, total: round(items + coins + other), unknown };
}

// Carry STR × 15, drag/lift/push STR × 30 (Small and Medium); Powerful Build counts one size larger
function carryCapacity(ch) {
  const str = parseInt(ch.abilities?.str) || 10;
  const powerful = (ch.featuresList || []).some(f => /^powerful build$/i.test(String(f.name || '').trim()));
  const mult = powerful ? 2 : 1;
  return { carry: str * 15 * mult, push: str * 30 * mult, powerful };
}

function encumbranceStatus(total, cap) {
  if (total > cap.push) return { level: 'immobile', text: 'Too heavy to move' };
  if (total > cap.carry) return { level: 'over', text: 'Over capacity — you can only drag it, at a Speed of 5 ft' };
  return { level: 'ok', text: '' };
}

if (typeof module !== 'undefined') {
  module.exports = { entryWeight, carriedWeight, carryCapacity, encumbranceStatus };
}
