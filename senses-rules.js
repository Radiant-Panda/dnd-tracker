// ── Senses Rules ─────────────────────────────────────────────────────────────
// Pure logic (no DOM): special senses (darkvision, blindsight, tremorsense, truesight)
// read from the rules text of the character's species traits, class/subclass features and feats.

const _SN_SENSES = ['Darkvision', 'Blindsight', 'Tremorsense', 'Truesight'];
// Sentences describing a sense you only have for a while, or only with an item or action
const _SN_TEMPORARY = /\bfor (?:the next )?\d+ (?:minute|hour)s?|\bfor 1 minute|while wearing|when you peer|while scrying|as a bonus action|as an action|as a magic action/i;

// Features that offer a sense as one pick among options, or switch it on with an action
const _SN_CHOICE_OR_ACTIVATED = /one of the following (?:options|benefits)|choose one of the following|use your action to|as a bonus action,? you gain|benefits for 1 minute/i;

function _snSource(f) {
  if (f._species) return typeof f._species === 'string' ? f._species : f.name;
  if (f._subclass) return typeof f._subclass === 'string' ? f._subclass : f.name;
  return f.name;
}

function _snSentences(text) {
  return String(text || '').replace(/\*\*/g, '').split(/(?<=\.)\s+|\n+/).map(s => s.trim()).filter(Boolean);
}

// → [{ sense, range, source }], longest range per sense, in a fixed order
function detectSenses(ch) {
  const found = {};      // sense → { range, source }
  const extends_ = [];   // "if you already have darkvision, its range increases by N feet"
  const note = (sense, range, source) => {
    if (!found[sense] || range > found[sense].range) found[sense] = { range, source };
  };
  (ch.featuresList || []).forEach(f => {
    const source = _snSource(f);
    const name = String(f.name || '').trim();
    if (_SN_CHOICE_OR_ACTIVATED.test(f.desc || '')) return;
    const sentences = _snSentences(f.desc);
    if (/^(superior )?darkvision$/i.test(name)) {
      const m = String(f.desc || '').match(/(\d+)\s*(?:feet|ft)/i);
      if (m) note('Darkvision', +m[1], source);
    }
    sentences.forEach(s => {
      if (_SN_TEMPORARY.test(s)) return;
      const inc = s.match(/already have darkvision[^.]*?increases?(?: its range)? by (\d+)\s*(?:feet|ft)/i);
      if (inc) { extends_.push({ by: +inc[1], source }); return; }
      const m = s.match(/\b(?:have|gain)\s+(darkvision|blindsight|tremorsense|truesight)\b[^.]*?(\d+)\s*(?:feet|ft)/i);
      if (m) {
        const sense = _SN_SENSES.find(x => x.toLowerCase() === m[1].toLowerCase());
        // A feature that both grants and extends darkvision only extends it when another source has it
        const grantsAndExtends = sense === 'Darkvision' && sentences.some(t => /already have darkvision/i.test(t));
        if (grantsAndExtends) extends_.push({ grant: +m[2], source });
        else note(sense, +m[2], source);
      }
    });
  });
  // Features like Umbral Sight: grant darkvision if you have none, else add to what you have
  const grants = extends_.filter(e => e.grant), incs = extends_.filter(e => e.by);
  grants.forEach(g => {
    const inc = incs.find(i => i.source === g.source);
    if (found.Darkvision && inc) found.Darkvision = { range: found.Darkvision.range + inc.by, source: `${found.Darkvision.source} + ${g.source}` };
    else note('Darkvision', g.grant, g.source);
  });
  return _SN_SENSES.filter(s => found[s]).map(s => ({ sense: s, range: found[s].range, source: found[s].source }));
}

if (typeof module !== 'undefined') {
  module.exports = { detectSenses };
}
