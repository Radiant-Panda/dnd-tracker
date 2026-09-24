// ── Rules Text ───────────────────────────────────────────────────────────────
// Renders feature/trait/feat descriptions to HTML. Understands the markup written by
// data/rules-text-build.js (paragraphs, run-in headings, lists, tables, nested options)
// and still renders older flat text as a paragraph. Pure string → string, no DOM.
//
// ctx (optional): { cls, level } — the class and class level reading this text, used to
// highlight "at your level" rows in tables and the current die in scaling sentences.

function _rtEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const _RT_TERMS = [
  'Short Rest', 'Long Rest', 'Short or Long Rest', 'short rest', 'long rest', 'short or long rest',
  'Bonus Action', 'Reaction', 'Magic action', 'Advantage', 'Disadvantage', 'Temporary Hit Points',
  'Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened', 'Grappled', 'Incapacitated',
  'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
].sort((a, b) => b.length - a.length);
const _RT_TERM_RE = new RegExp('\\b(' + _RT_TERMS.map(t => t.replace(/ /g, '\\s')).join('|') + ')\\b', 'g');
const _RT_DICE_RE = /\b(\d*d(?:4|6|8|10|12|20|100))(s?)\b/g;

// Inline formatting on already-escaped text; bold spans (headings) are left undecorated
function _rtInline(escaped) {
  return escaped.split(/(\*\*.+?\*\*)/).map(part => part.startsWith('**') && part.endsWith('**') && part.length > 4
    ? `<strong>${part.slice(2, -2)}</strong>`
    : part.replace(_RT_DICE_RE, '<span class="rt-dice">$1</span>$2').replace(_RT_TERM_RE, '<span class="rt-term">$1</span>')
  ).join('');
}

// "…at Cleric levels 7 (2d8), 13 (3d8), and 18 (4d8)" → the dice at the reader's level
function _rtScalingNote(block, allText, ctx) {
  if (!ctx || !ctx.level) return '';
  const steps = [...block.matchAll(/(\d+)(?:st|nd|rd|th)?(?: level)? \((\d+d\d+)\)/g)].map(m => [+m[1], m[2]]);
  if (steps.length < 2) return '';
  const die = steps[0][1].replace(/^\d+/, '');
  let current = null;
  for (const [lvl, dice] of steps) if (ctx.level >= lvl) current = dice;
  if (!current) {
    const base = allText.match(new RegExp('\\b(\\d+' + die + ')\\b'));
    current = base ? base[1] : '1' + die;
  }
  const who = ctx.cls ? _rtEsc(ctx.cls) + ' ' : 'level ';
  return `<span class="rt-level">At ${who}${ctx.level}: <span class="rt-dice">${_rtEsc(current)}</span></span>`;
}

function _rtTable(lines, ctx) {
  let caption = '';
  if (/^Table: /.test(lines[0])) caption = lines.shift().slice(7);
  const rows = lines.map(l => l.replace(/^\|\s?|\s?\|$/g, '').split(' | '));
  const [head, ...body] = rows;
  // Highlight the reader's row: the last row whose class-level column is at or below their level
  let youIdx = -1;
  if (ctx && ctx.level && head) {
    const col = head.findIndex(h => /\blevel\b/i.test(h) && !/slot|spell|circle/i.test(h));
    if (col >= 0) body.forEach((r, i) => { const n = parseInt(r[col]); if (n && n <= ctx.level) youIdx = i; });
  }
  return `<div class="rt-table-wrap"><table class="rt-table">${caption ? `<caption>${_rtInline(_rtEsc(caption))}</caption>` : ''}
    <thead><tr>${(head || []).map(h => `<th>${_rtInline(_rtEsc(h))}</th>`).join('')}</tr></thead>
    <tbody>${body.map((r, i) => `<tr${i === youIdx ? ' class="rt-you"' : ''}>${r.map(c => `<td${c.length > 24 ? ' class="rt-long"' : ''}>${_rtInline(_rtEsc(c))}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

function renderRulesText(text, ctx) {
  const src = String(text || '').trim();
  if (!src) return '';
  return src.split(/\n{2,}/).map(block => {
    const lines = block.split('\n');
    if (lines.every(l => l.startsWith('>'))) {
      const inner = lines.map(l => l.replace(/^> ?/, '')).join('\n');
      const m = inner.match(/^\*\*(.+?)\*\*(?:\n\n|$)/);
      const name = m ? `<div class="rt-option-name">${_rtInline(_rtEsc(m[1]))}</div>` : '';
      return `<div class="rt-option">${name}${renderRulesText(m ? inner.slice(m[0].length) : inner, ctx)}</div>`;
    }
    if (lines.every(l => l.startsWith('• '))) {
      return `<ul class="rt-list">${lines.map(l => `<li>${_rtRunin(_rtInline(_rtEsc(l.slice(2))))}</li>`).join('')}</ul>`;
    }
    if (lines.some(l => l.startsWith('| ')) && lines.every(l => l.startsWith('| ') || /^Table: /.test(l))) {
      return _rtTable(lines, ctx);
    }
    return `<p>${_rtRunin(_rtInline(_rtEsc(block.replace(/\n/g, ' '))))}${_rtScalingNote(block, src, ctx)}</p>`;
  }).join('');
}

// A leading <strong>Name.</strong> is a run-in heading
function _rtRunin(html) {
  return html.replace(/^<strong>(.+?\.)<\/strong>/, '<strong class="rt-runin">$1</strong>');
}

if (typeof module !== 'undefined') module.exports = { renderRulesText };
