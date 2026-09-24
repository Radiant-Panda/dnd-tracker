/**
 * Converts 5etools `entries` into the tracker's rules-text markup, keeping structure
 * instead of flattening it. rules-text.js (loaded by the app) renders the markup.
 *
 * Markup — blocks are separated by a blank line:
 *   paragraph      plain text; "**Name.** text" starts with a run-in heading
 *   list           every line starts with "• " (items may start with "**Name.** ")
 *   table          optional "Table: Caption" line, then "| a | b |" rows; first row is the header
 *   option         every line starts with ">"; first inner block "**Name**" names the option,
 *                  the rest is rules-text (used for features offered by another feature)
 */

// Required lazily: build-class-features.js also requires this module
const clean = s => require('./build-class-features').stripTags(String(s == null ? '' : s)).replace(/\s*\n\s*/g, ' ').trim();
const runinName = n => clean(n).replace(/[.:]\s*$/, '');

function cellText(c) {
  if (c && typeof c === 'object') {
    if (c.type === 'cell' && c.roll) {
      const r = c.roll;
      return r.exact != null ? String(r.exact) : `${r.min}–${r.max}`;
    }
    if (c.entry) return clean(c.entry);
    if (c.entries) return c.entries.map(cellText).join(' ');
  }
  return clean(c);
}

// Inline text of an item, for list lines (nested structure collapses to one line)
function inlineText(entries) {
  return blocks(entries, {}).map(b => b.replace(/\n/g, ' ')).join(' ');
}

// opts.resolveRef(entry) → { name, entries } | null, for refClassFeature/refSubclassFeature/refOptionalfeature
function blocks(entries, opts, runin) {
  const out = [];
  let pending = runin || null;
  const para = t => {
    if (!t) return;
    out.push(pending ? `**${pending}.** ${t}` : t);
    pending = null;
  };
  for (const e of entries || []) {
    if (typeof e === 'string') { para(clean(e)); continue; }
    if (!e || typeof e !== 'object') continue;
    switch (e.type) {
      case 'list': {
        if (pending) { out.push(`**${pending}.**`); pending = null; }
        // Tables inside an item can't sit on one line; they follow the list as their own blocks
        const after = [];
        const lines = (e.items || []).map(item => {
          if (typeof item === 'string') return '• ' + clean(item);
          const name = item.name ? `**${runinName(item.name)}.** ` : '';
          const kids = item.entries || [];
          const tables = kids.filter(k => k && k.type === 'table');
          after.push(...blocks(tables, opts));
          const body = item.entry ? clean(item.entry) : inlineText(kids.filter(k => !tables.includes(k)));
          return '• ' + name + body;
        }).filter(l => l.trim() !== '•');
        if (lines.length) out.push(lines.join('\n'));
        out.push(...after);
        break;
      }
      case 'table': {
        if (pending) { out.push(`**${pending}.**`); pending = null; }
        const esc = s => s.replace(/\|/g, '/');
        const rows = [];
        if (e.caption) rows.push('Table: ' + clean(e.caption));
        if (e.colLabels) rows.push('| ' + e.colLabels.map(c => esc(clean(c))).join(' | ') + ' |');
        for (const r of e.rows || []) {
          const cells = Array.isArray(r) ? r : (r.row || []);
          rows.push('| ' + cells.map(c => esc(cellText(c))).join(' | ') + ' |');
        }
        if (rows.length) out.push(rows.join('\n'));
        break;
      }
      case 'refClassFeature':
      case 'refSubclassFeature':
      case 'refOptionalfeature': {
        const ref = opts.resolveRef && opts.resolveRef(e);
        if (!ref) break;
        const inner = [`**${runinName(ref.name)}**`, ...blocks(ref.entries, opts)];
        out.push(inner.join('\n\n').split('\n').map(l => (l ? '> ' + l : '>')).join('\n'));
        break;
      }
      default: {
        // entries, section, inset, options, variant... — recurse, carrying a name as run-in heading
        const kids = e.entries || e.items || [];
        if (e.name) {
          if (pending) { out.push(`**${pending}.**`); pending = null; }
          out.push(...blocks(kids, opts, runinName(e.name)));
        } else {
          out.push(...blocks(kids, opts, pending));
          pending = null;
        }
      }
    }
  }
  if (pending) out.push(`**${pending}.**`);
  return out;
}

function entriesToRulesText(entries, opts = {}) {
  return blocks(entries, opts).join('\n\n');
}

module.exports = { entriesToRulesText };
