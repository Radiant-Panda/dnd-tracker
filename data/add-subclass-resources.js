/**
 * Adds resource trackers to subclass features in data/subclasses.js.
 * Uses per feature are read from the rules text ("a number of times equal to your
 * Wisdom modifier... Long Rest"); dice pools whose text is table-driven are listed in DICE_POOLS.
 * Run: node data/add-subclass-resources.js [--dry]
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'subclasses.js');
const src = fs.readFileSync(FILE, 'utf8');
const header = src.slice(0, src.indexOf('const SUBCLASS_DATA'));
const SUBCLASS_DATA = new Function(src + ';return SUBCLASS_DATA')();

// Dice pools described by a table rather than a sentence. `maxFormula` names a resources-rules.js formula.
const DICE_POOLS = {
  'Fighter|Battle Master|Combat Superiority':      { name: 'Superiority Dice', maxFormula: 'superiority_dice', die: 'd8', recharge: 'short' },
  'Fighter|Psi Warrior|Psionic Power':              { name: 'Psionic Energy Dice', maxFormula: 'psionic_dice', die: 'd6', recharge: 'long' },
  'Rogue|Soulknife|Psionic Power':                  { name: 'Psionic Energy Dice', maxFormula: 'psionic_dice', die: 'd6', recharge: 'long' },
};

const ABILITY = { strength: 'str_mod', dexterity: 'dex_mod', constitution: 'con_mod', intelligence: 'int_mod', wisdom: 'wis_mod', charisma: 'cha_mod' };
const WORD_COUNT = { once: 1, twice: 2, two: 2, three: 3, four: 4 };

// Returns { maxFormula, recharge } or null when the text doesn't describe a limited number of uses.
function usesFromText(text) {
  const t = text.replace(/\s+/g, ' ');
  const recharge = /finish a Short or Long Rest|finish a short or long rest/.test(t) ? 'short'
    : /finish a Long Rest|finish a long rest/i.test(t) ? 'long' : null;
  if (!recharge) return null;
  let m = t.match(/number of times equal to (?:your|1 \+ your) (Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) modifier/i);
  if (m) return { maxFormula: ABILITY[m[1].toLowerCase()], recharge };
  if (/number of times equal to your Proficiency Bonus/i.test(t)) return { maxFormula: 'proficiency', recharge };
  m = t.match(/\b(twice|two times|three times|four times)\b[^.]{0,120}(?:Long Rest|Short or Long Rest)/i);
  if (m) return { maxFormula: WORD_COUNT[m[1].split(' ')[0].toLowerCase()], recharge };
  if (/Once you use this (?:feature|ability|trait)[^.]{0,80}(?:can't|cannot) (?:use it|do so) again until you finish/i.test(t) ||
      /you can't use (?:it|this feature) again until you finish/i.test(t)) return { maxFormula: 1, recharge };
  return null;
}

const added = [], skipped = [];
for (const [cls, subs] of Object.entries(SUBCLASS_DATA)) {
  for (const sub of Object.values(subs)) {
    for (const f of sub.features || []) {
      if (f.resource) continue;
      const shortName = Object.keys(DICE_POOLS).find(k => {
        const [c, s, feat] = k.split('|');
        return c === cls && sub.name.includes(s) && f.name === feat;
      });
      const res = shortName ? DICE_POOLS[shortName] : (() => {
        const u = usesFromText(f.description || '');
        return u && { name: f.name, die: null, ...u };
      })();
      if (!res) continue;
      // A use that spends another resource (Channel Divinity, Sorcery Points...) isn't its own tracker
      if (/expend (?:a|one) use of (?:your )?Channel Divinity|spend \d+ Sorcery Points|expend (?:a|one) (?:use of )?Bardic Inspiration|Wild Shape use/i.test(f.description || '') && !shortName) {
        skipped.push(`${cls} | ${sub.name} | ${f.name} (spends another resource)`);
        continue;
      }
      f.resource = { name: res.name, maxFormula: res.maxFormula, die: res.die || null, recharge: res.recharge };
      added.push(`${cls} | ${sub.name} (${sub.source}) | L${f.level} ${f.name} → ${res.name}: ${res.maxFormula} / ${res.recharge}`);
    }
  }
}

console.log(added.join('\n'));
console.log(`\n${added.length} resources added, ${skipped.length} skipped:\n  ${skipped.join('\n  ')}`);
if (!process.argv.includes('--dry')) {
  fs.writeFileSync(FILE, header + 'const SUBCLASS_DATA = ' + JSON.stringify(SUBCLASS_DATA, null, 2) + ';\n', 'utf8');
  console.log('Written to ' + FILE);
}
