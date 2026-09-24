// ── Class Options Rules ──────────────────────────────────────────────────────
// Pure logic (no DOM) for Eldritch Invocations, Metamagic, Maneuvers, etc.:
// how many a character gets, which ones they've chosen, and whether they meet
// an option's prerequisites. Data comes from data/class_options.js.

function _coLower(s) { return String(s || '').toLowerCase(); }

// Which edition's option rules apply to one of the character's classes.
// Mirrors _classFeaturesFor: classes without 2024 data (Artificer) fall back to 2014.
function _coClassEdition(ch, cls) {
  if ((ch.edition || '2024') === '2014') return '2014';
  return (typeof CLASS_FEATURES_2024 !== 'undefined' && CLASS_FEATURES_2024[cls]) ? '2024' : '2014';
}

function _coClassEntries(ch) {
  if (ch.classes && ch.classes.length) return ch.classes;
  return [{ class: ch.class, subclass: ch.subclass, level: parseInt(ch.level) || 1 }];
}

function _coChosen(ch) {
  return (ch.featuresList || []).filter(f => f._option);
}

// One group per option type a class grants, e.g. "Eldritch Invocations 3 / 5".
// Progressions with the same types (Fighter + Champion Fighting Style) are summed.
function classOptionGroups(ch) {
  if (typeof CLASS_OPTIONS_DATA === 'undefined') return [];
  const groups = [];
  for (const entry of _coClassEntries(ch)) {
    const cls = entry.class;
    const lvl = Math.max(1, Math.min(20, parseInt(entry.level) || 1));
    const ed = _coClassEdition(ch, cls);
    const sub = _coLower(entry.subclass);
    const progs = CLASS_OPTIONS_DATA.progressions.filter(p => p.cls === cls);

    const matched = progs.filter(p => !p.subclass && p.edition === ed);
    if (sub) {
      const subProgs = progs.filter(p => p.subclass && sub.includes(_coLower(p.subclass)));
      // Use the character's edition. A 2024 character can still take a 2014-only subclass
      // (Rune Knight), but a subclass reprinted in 2024 (Champion) uses only its 2024 rules.
      matched.push(...subProgs.filter(p => p.edition === ed || (ed === '2024' &&
        !CLASS_OPTIONS_DATA.subclasses2024.includes(cls + '|' + p.subclass))));
    }

    const byKey = {};
    for (const p of matched) {
      const key = cls + ':' + p.types.join(',');
      const max = p.counts[lvl - 1] || 0;
      if (!byKey[key]) byKey[key] = { key, cls, label: p.label, types: p.types, edition: p.edition, max: 0 };
      byKey[key].max += max;
    }
    for (const g of Object.values(byKey)) {
      if (g.max <= 0) continue;
      g.chosen = _coChosen(ch).filter(f =>
        (f._optionClass || cls) === cls && (f._optionTypes || [f._option]).some(t => g.types.includes(t)));
      groups.push(g);
    }
  }
  return groups;
}

function _coClassLevel(ch, cls) {
  if (!cls) return parseInt(ch.level) || 1;
  const e = _coClassEntries(ch).find(c => c.class === cls);
  return e ? (parseInt(e.level) || 1) : 0;
}

function _coKnowsSpell(ch, name) {
  const n = _coLower(name);
  const lists = [(ch.spells && ch.spells.known) || [], (ch.spells && ch.spells.prepared) || []];
  return lists.some(l => l.some(s => _coLower(typeof s === 'object' ? s.name : s) === n));
}

function _coTitle(s) { return s.replace(/\b\w/g, c => c.toUpperCase()); }

// Checks one alternative (all conditions must hold). Returns unmet reasons + informational notes.
function _coCheckAlt(alt, ch) {
  const unmet = [], notes = [];
  if (alt.level) {
    const label = (alt.cls || 'Character') + ' ' + alt.level + '+' + (alt.subclass ? ' (' + alt.subclass + ')' : '');
    const entry = alt.cls ? _coClassEntries(ch).find(c => c.class === alt.cls) : null;
    const lvlOk = _coClassLevel(ch, alt.cls) >= alt.level;
    const subOk = !alt.subclass || (entry && _coLower(entry.subclass).includes(_coLower(alt.subclass)));
    if (!lvlOk || !subOk) unmet.push(label);
  }
  const chosenNames = new Set(_coChosen(ch).map(f => _coLower(f.name)));
  for (const o of alt.options || []) if (!chosenNames.has(_coLower(o))) unmet.push(o);
  for (const s of alt.spells || []) if (!_coKnowsSpell(ch, s)) unmet.push(_coTitle(s) + ' spell');
  if (alt.hexOrCurse) {
    const hasCurse = (ch.featuresList || []).some(f => /curse/i.test(f.name || ''));
    if (!_coKnowsSpell(ch, 'hex') && !hasCurse) unmet.push('Hex spell or a curse feature');
  }
  if (alt.other) notes.push(alt.other);
  return { unmet, notes };
}

// Prerequisite alternatives are OR'd: met if any one is fully met.
// Free-text conditions ("a Warlock cantrip that deals damage") can't be checked, so they count as met.
function classOptionPrereqStatus(opt, ch) {
  if (!opt.prereq || !opt.prereq.length) return { met: true, unmet: [], notes: [] };
  const results = opt.prereq.map(a => _coCheckAlt(a, ch));
  const ok = results.find(r => !r.unmet.length);
  if (ok) return { met: true, unmet: [], notes: ok.notes };
  return { met: false, unmet: results[0].unmet, notes: results[0].notes };
}

function classOptionPrereqLabel(opt) {
  if (!opt.prereq || !opt.prereq.length) return '';
  return opt.prereq.map(a => [
    a.level ? (a.cls || 'Level') + ' ' + a.level + '+' + (a.subclass ? ' (' + a.subclass + ')' : '') : '',
    ...(a.options || []),
    ...(a.spells || []).map(s => _coTitle(s) + ' spell'),
    a.hexOrCurse ? 'Hex spell or a curse feature' : '',
    a.other || '',
  ].filter(Boolean).join(' · ')).join(' or ');
}

// Options available to a group, split into ones the character qualifies for and the rest.
function classOptionsForGroup(group, ch, showAllEditions) {
  const opts = CLASS_OPTIONS_DATA.options.filter(o =>
    o.types.some(t => group.types.includes(t)) && (showAllEditions || o.edition === group.edition));
  const suggested = [], other = [];
  for (const o of opts) {
    const status = classOptionPrereqStatus(o, ch);
    (status.met ? suggested : other).push({ opt: o, status });
  }
  return { suggested, other };
}

if (typeof module !== 'undefined') {
  module.exports = { classOptionGroups, classOptionPrereqStatus, classOptionPrereqLabel, classOptionsForGroup };
}
