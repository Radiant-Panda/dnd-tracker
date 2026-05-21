/**
 * Subclass Spell Lists & Special Tables
 * Source: 5etools data — verified against official books
 *
 * prepareType:
 *   "always_prepared" — added to prepared list, doesn't count toward limit
 *   "expanded_list"   — added to spells known / available list
 *   "always_known"    — always known, can't be swapped out
 */

const SUBCLASS_SPELL_LISTS = {

  // ── CLERIC DOMAINS ─────────────────────────────────────────────────────────

  "Knowledge Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Command","Identify"], 3: ["Augury","Suggestion"], 5: ["Nondetection","Speak With Dead"], 7: ["Arcane Eye","Confusion"], 9: ["Legend Lore","Scrying"] }
  },

  "Life Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Bless","Cure Wounds"], 3: ["Lesser Restoration","Spiritual Weapon"], 5: ["Beacon Of Hope","Revivify"], 7: ["Death Ward","Guardian Of Faith"], 9: ["Mass Cure Wounds","Raise Dead"] }
  },

  "Light Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Burning Hands","Faerie Fire"], 3: ["Flaming Sphere","Scorching Ray"], 5: ["Daylight","Fireball"], 7: ["Guardian Of Faith","Wall Of Fire"], 9: ["Flame Strike","Scrying"] }
  },

  "Nature Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Animal Friendship","Speak With Animals"], 3: ["Barkskin","Spike Growth"], 5: ["Plant Growth","Wind Wall"], 7: ["Dominate Beast","Grasping Vine"], 9: ["Insect Plague","Tree Stride"] }
  },

  "Tempest Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Fog Cloud","Thunderwave"], 3: ["Gust Of Wind","Shatter"], 5: ["Call Lightning","Sleet Storm"], 7: ["Control Water","Ice Storm"], 9: ["Destructive Wave","Insect Plague"] }
  },

  "Trickery Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Charm Person","Disguise Self"], 3: ["Mirror Image","Pass Without Trace"], 5: ["Blink","Dispel Magic"], 7: ["Dimension Door","Polymorph"], 9: ["Dominate Person","Modify Memory"] }
  },

  "War Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Divine Favor","Shield Of Faith"], 3: ["Magic Weapon","Spiritual Weapon"], 5: ["Crusader's Mantle","Spirit Guardians"], 7: ["Freedom Of Movement","Stoneskin"], 9: ["Flame Strike","Hold Monster"] }
  },

  "Death Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["False Life","Ray Of Sickness"], 3: ["Blindness/Deafness","Ray Of Enfeeblement"], 5: ["Animate Dead","Vampiric Touch"], 7: ["Blight","Death Ward"], 9: ["Antilife Shell","Cloudkill"] }
  },

  "Arcana Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Detect Magic","Magic Missile"], 3: ["Magic Weapon","Nystul's Magic Aura"], 5: ["Dispel Magic","Magic Circle"], 7: ["Arcane Eye","Leomund's Secret Chest"], 9: ["Planar Binding","Teleportation Circle"] }
  },

  "Forge Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Identify","Searing Smite"], 3: ["Heat Metal","Magic Weapon"], 5: ["Elemental Weapon","Protection From Energy"], 7: ["Fabricate","Wall Of Fire"], 9: ["Animate Objects","Creation"] }
  },

  "Grave Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Bane","False Life"], 3: ["Gentle Repose","Ray Of Enfeeblement"], 5: ["Revivify","Vampiric Touch"], 7: ["Blight","Death Ward"], 9: ["Antilife Shell","Raise Dead"] }
  },

  "Order Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Command","Heroism"], 3: ["Hold Person","Zone Of Truth"], 5: ["Mass Healing Word","Slow"], 7: ["Compulsion","Locate Creature"], 9: ["Commune","Dominate Person"] }
  },

  "Peace Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Heroism","Sanctuary"], 3: ["Aid","Warding Bond"], 5: ["Beacon Of Hope","Sending"], 7: ["Aura Of Purity","Otiluke's Resilient Sphere"], 9: ["Greater Restoration","Rary's Telepathic Bond"] }
  },

  "Twilight Domain": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 1: ["Faerie Fire","Sleep"], 3: ["Moonbeam","See Invisibility"], 5: ["Aura Of Vitality","Leomund's Tiny Hut"], 7: ["Aura Of Life","Greater Invisibility"], 9: ["Circle Of Power","Mislead"] }
  },

  // PHB 2024 domains
  "Life Domain (2024)": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024 version",
    spells: { 3: ["Aid","Bless","Cure Wounds","Lesser Restoration"], 5: ["Mass Healing Word","Revivify"], 7: ["Aura Of Life","Death Ward"], 9: ["Greater Restoration","Mass Cure Wounds"] }
  },

  "Light Domain (2024)": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024 version",
    spells: { 3: ["Burning Hands","Faerie Fire","Scorching Ray","See Invisibility"], 5: ["Daylight","Fireball"], 7: ["Arcane Eye","Wall Of Fire"], 9: ["Flame Strike","Scrying"] }
  },

  "Trickery Domain (2024)": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024 version",
    spells: { 3: ["Charm Person","Disguise Self","Invisibility","Pass Without Trace"], 5: ["Hypnotic Pattern","Nondetection"], 7: ["Confusion","Dimension Door"], 9: ["Dominate Person","Modify Memory"] }
  },

  "War Domain (2024)": {
    class: "Cleric", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024 version",
    spells: { 3: ["Guiding Bolt","Magic Weapon","Shield Of Faith","Spiritual Weapon"], 5: ["Crusader's Mantle","Spirit Guardians"], 7: ["Fire Shield","Freedom Of Movement"], 9: ["Hold Monster","Steel Wind Strike"] }
  },

  // ── PALADIN OATHS ──────────────────────────────────────────────────────────

  "Oath of Devotion": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Protection From Evil And Good","Sanctuary"], 5: ["Lesser Restoration","Zone Of Truth"], 9: ["Beacon Of Hope","Dispel Magic"], 13: ["Freedom Of Movement","Guardian Of Faith"], 17: ["Commune","Flame Strike"] }
  },

  "Oath of the Ancients": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Ensnaring Strike","Speak With Animals"], 5: ["Moonbeam","Misty Step"], 9: ["Plant Growth","Protection From Energy"], 13: ["Ice Storm","Stoneskin"], 17: ["Commune With Nature","Tree Stride"] }
  },

  "Oath of Vengeance": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Bane","Hunter's Mark"], 5: ["Hold Person","Misty Step"], 9: ["Haste","Protection From Energy"], 13: ["Banishment","Dimension Door"], 17: ["Hold Monster","Scrying"] }
  },

  "Oathbreaker": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Hellish Rebuke","Inflict Wounds"], 5: ["Crown Of Madness","Darkness"], 9: ["Animate Dead","Bestow Curse"], 13: ["Blight","Confusion"], 17: ["Contagion","Dominate Person"] }
  },

  "Oath of the Crown": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Command","Compelled Duel"], 5: ["Warding Bond","Zone Of Truth"], 9: ["Aura Of Vitality","Spirit Guardians"], 13: ["Banishment","Guardian Of Faith"], 17: ["Circle Of Power","Geas"] }
  },

  "Oath of Conquest": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Armor Of Agathys","Command"], 5: ["Hold Person","Spiritual Weapon"], 9: ["Bestow Curse","Fear"], 13: ["Dominate Beast","Stoneskin"], 17: ["Cloudkill","Dominate Person"] }
  },

  "Oath of Redemption": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Sanctuary","Sleep"], 5: ["Calm Emotions","Hold Person"], 9: ["Counterspell","Hypnotic Pattern"], 13: ["Otiluke's Resilient Sphere","Stoneskin"], 17: ["Hold Monster","Wall Of Force"] }
  },

  "Oath of Glory": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Guiding Bolt","Heroism"], 5: ["Enhance Ability","Magic Weapon"], 9: ["Haste","Protection From Energy"], 13: ["Compulsion","Freedom Of Movement"], 17: ["Commune","Flame Strike"] }
  },

  "Oath of the Watchers": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Alarm","Detect Magic"], 5: ["Moonbeam","See Invisibility"], 9: ["Counterspell","Nondetection"], 13: ["Aura Of Purity","Banishment"], 17: ["Hold Monster","Scrying"] }
  },

  "Oath of the Noble Genies": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Chromatic Orb","Elementalism","Thunderous Smite"], 5: ["Mirror Image","Phantasmal Force"], 9: ["Fly","Gaseous Form"], 13: ["Conjure Minor Elementals","Summon Elemental"], 17: ["Banishing Smite","Contact Other Plane"] }
  },

  // PHB 2024 Paladin versions
  "Oath of Devotion (2024)": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024 version",
    spells: { 3: ["Protection From Evil And Good","Shield Of Faith"], 5: ["Aid","Zone Of Truth"], 9: ["Beacon Of Hope","Dispel Magic"], 13: ["Freedom Of Movement","Guardian Of Faith"], 17: ["Commune","Flame Strike"] }
  },

  "Oath of Glory (2024)": {
    class: "Paladin", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024 version",
    spells: { 3: ["Guiding Bolt","Heroism"], 5: ["Enhance Ability","Magic Weapon"], 9: ["Haste","Protection From Energy"], 13: ["Compulsion","Freedom Of Movement"], 17: ["Legend Lore","Yolande's Regal Presence"] }
  },

  // ── DRUID CIRCLES ──────────────────────────────────────────────────────────

  "Circle of the Land": {
    class: "Druid", prepareType: "always_prepared",
    note: "Always prepared — choose a terrain type",
    spells: {
      Arctic:     { 3: ["Hold Person","Spike Growth"], 5: ["Sleet Storm","Slow"], 7: ["Freedom Of Movement","Ice Storm"], 9: ["Commune With Nature","Cone Of Cold"] },
      Coast:      { 3: ["Mirror Image","Misty Step"], 5: ["Water Breathing","Water Walk"], 7: ["Control Water","Freedom Of Movement"], 9: ["Conjure Elemental","Scrying"] },
      Desert:     { 3: ["Blur","Silence"], 5: ["Create Food And Water","Protection From Energy"], 7: ["Blight","Hallucinatory Terrain"], 9: ["Insect Plague","Wall Of Stone"] },
      Forest:     { 3: ["Barkskin","Spider Climb"], 5: ["Call Lightning","Plant Growth"], 7: ["Divination","Freedom Of Movement"], 9: ["Commune With Nature","Tree Stride"] },
      Grassland:  { 3: ["Invisibility","Pass Without Trace"], 5: ["Daylight","Haste"], 7: ["Divination","Freedom Of Movement"], 9: ["Dream","Insect Plague"] },
      Mountain:   { 3: ["Spider Climb","Spike Growth"], 5: ["Lightning Bolt","Meld Into Stone"], 7: ["Stone Shape","Stoneskin"], 9: ["Passwall","Wall Of Stone"] },
      Swamp:      { 3: ["Darkness","Melf's Acid Arrow"], 5: ["Water Walk","Stinking Cloud"], 7: ["Freedom Of Movement","Locate Creature"], 9: ["Insect Plague","Scrying"] },
      Underdark:  { 3: ["Spider Climb","Web"], 5: ["Gaseous Form","Stinking Cloud"], 7: ["Greater Invisibility","Stone Shape"], 9: ["Cloudkill","Insect Plague"] }
    }
  },

  "Circle of the Land (2024)": {
    class: "Druid", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024. Choose a land type.",
    spells: {
      "Arid Land":      { 3: ["Blur","Burning Hands","Fire Bolt"], 5: ["Fireball"], 7: ["Blight"], 9: ["Wall Of Stone"] },
      "Polar Land":     { 3: ["Fog Cloud","Hold Person","Ray Of Frost"], 5: ["Sleet Storm"], 7: ["Ice Storm"], 9: ["Cone Of Cold"] },
      "Temperate Land": { 3: ["Misty Step","Shocking Grasp","Sleep"], 5: ["Lightning Bolt"], 7: ["Freedom Of Movement"], 9: ["Tree Stride"] },
      "Tropical Land":  { 3: ["Acid Splash","Ray Of Sickness","Web"], 5: ["Stinking Cloud"], 7: ["Polymorph"], 9: ["Insect Plague"] }
    }
  },

  "Circle of the Moon": {
    class: "Druid", prepareType: "always_prepared",
    note: "Always prepared — can also cast while in Wild Shape",
    spells: { 3: ["Cure Wounds","Moonbeam","Starry Wisp"], 5: ["Conjure Animals"], 7: ["Fount Of Moonlight"], 9: ["Mass Cure Wounds"] }
  },

  "Circle of the Sea": {
    class: "Druid", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Fog Cloud","Gust Of Wind","Ray Of Frost","Shatter","Thunderwave"], 5: ["Lightning Bolt","Water Breathing"], 7: ["Control Water","Ice Storm"], 9: ["Conjure Elemental","Hold Monster"] }
  },

  "Circle of Stars": {
    class: "Druid", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 2: ["Guiding Bolt"] }
  },

  "Circle of Spores": {
    class: "Druid", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Blindness/Deafness","Gentle Repose"], 5: ["Animate Dead","Gaseous Form"], 7: ["Blight","Confusion"], 9: ["Cloudkill","Contagion"] }
  },

  "Circle of Wildfire": {
    class: "Druid", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 2: ["Burning Hands","Cure Wounds"], 3: ["Flaming Sphere","Scorching Ray"], 5: ["Plant Growth","Revivify"], 7: ["Aura Of Life","Fire Shield"], 9: ["Flame Strike","Mass Cure Wounds"] }
  },

  // ── RANGER CONCLAVES ───────────────────────────────────────────────────────

  "Gloom Stalker": {
    class: "Ranger", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Disguise Self"], 5: ["Rope Trick"], 9: ["Fear"], 13: ["Greater Invisibility"], 17: ["Seeming"] }
  },

  "Horizon Walker": {
    class: "Ranger", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Protection From Evil And Good"], 5: ["Misty Step"], 9: ["Haste"], 13: ["Banishment"], 17: ["Teleportation Circle"] }
  },

  "Monster Slayer": {
    class: "Ranger", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Protection From Evil And Good"], 5: ["Zone Of Truth"], 9: ["Magic Circle"], 13: ["Banishment"], 17: ["Hold Monster"] }
  },

  "Fey Wanderer": {
    class: "Ranger", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Charm Person"], 5: ["Misty Step"], 9: ["Dispel Magic"], 13: ["Dimension Door"], 17: ["Mislead"] }
  },

  "Swarmkeeper": {
    class: "Ranger", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Mage Hand"], 5: ["Web"], 9: ["Gaseous Form"], 13: ["Arcane Eye"], 17: ["Insect Plague"] }
  },

  "Winter Walker": {
    class: "Ranger", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Ice Knife"], 5: ["Hold Person"], 9: ["Remove Curse"], 13: ["Ice Storm"], 17: ["Cone Of Cold"] }
  },

  // ── WARLOCK PATRONS (PHB 2014) ─────────────────────────────────────────────

  "The Archfey": {
    class: "Warlock", prepareType: "expanded_list",
    note: "Expanded spell list — added to spells you can know",
    spells: { 1: ["Faerie Fire","Sleep"], 3: ["Calm Emotions","Phantasmal Force"], 5: ["Blink","Plant Growth"], 7: ["Dominate Beast","Greater Invisibility"], 9: ["Dominate Person","Seeming"] }
  },

  "The Fiend": {
    class: "Warlock", prepareType: "expanded_list",
    note: "Expanded spell list — added to spells you can know",
    spells: { 1: ["Burning Hands","Command"], 3: ["Blindness/Deafness","Scorching Ray"], 5: ["Fireball","Stinking Cloud"], 7: ["Fire Shield","Wall Of Fire"], 9: ["Flame Strike","Hallow"] }
  },

  "The Great Old One": {
    class: "Warlock", prepareType: "expanded_list",
    note: "Expanded spell list — added to spells you can know",
    spells: { 1: ["Dissonant Whispers","Tasha's Hideous Laughter"], 3: ["Detect Thoughts","Phantasmal Force"], 5: ["Clairvoyance","Sending"], 7: ["Dominate Beast","Evard's Black Tentacles"], 9: ["Dominate Person","Telekinesis"] }
  },

  "The Celestial": {
    class: "Warlock", prepareType: "expanded_list",
    note: "Expanded spell list — added to spells you can know",
    spells: { 1: ["Cure Wounds","Guiding Bolt"], 3: ["Flaming Sphere","Lesser Restoration"], 5: ["Daylight","Revivify"], 7: ["Guardian Of Faith","Wall Of Fire"], 9: ["Flame Strike","Mass Cure Wounds"] }
  },

  "The Fathomless": {
    class: "Warlock", prepareType: "expanded_list",
    note: "Expanded spell list — added to spells you can know",
    spells: { 1: ["Create Or Destroy Water","Thunderwave"], 3: ["Gust Of Wind","Silence"], 5: ["Lightning Bolt","Sleet Storm"], 7: ["Control Water","Summon Elemental"], 9: ["Bigby's Hand","Cone Of Cold"] }
  },

  "The Hexblade": {
    class: "Warlock", prepareType: "expanded_list",
    note: "Expanded spell list — added to spells you can know",
    spells: { 1: ["Shield","Wrathful Smite"], 3: ["Blur","Branding Smite"], 5: ["Blink","Elemental Weapon"], 7: ["Phantasmal Killer","Staggering Smite"], 9: ["Banishing Smite","Cone Of Cold"] }
  },

  "The Undying": {
    class: "Warlock", prepareType: "expanded_list",
    note: "Expanded spell list — added to spells you can know",
    spells: { 1: ["False Life","Ray Of Sickness"], 3: ["Blindness/Deafness","Silence"], 5: ["Feign Death","Speak With Dead"], 7: ["Aura Of Life","Death Ward"], 9: ["Contagion","Legend Lore"] }
  },

  "The Undead": {
    class: "Warlock", prepareType: "expanded_list",
    note: "Expanded spell list — added to spells you can know",
    spells: { 1: ["Bane","False Life"], 3: ["Blindness/Deafness","Phantasmal Force"], 5: ["Phantom Steed","Speak With Dead"], 7: ["Death Ward","Greater Invisibility"], 9: ["Antilife Shell","Cloudkill"] }
  },

  // PHB 2024 Warlock Patrons
  "Archfey Patron": {
    class: "Warlock", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024",
    spells: { 3: ["Calm Emotions","Faerie Fire","Misty Step","Phantasmal Force","Sleep"], 5: ["Blink","Plant Growth"], 7: ["Dominate Beast","Greater Invisibility"], 9: ["Dominate Person","Seeming"] }
  },

  "Celestial Patron": {
    class: "Warlock", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024",
    spells: { 3: ["Aid","Cure Wounds","Guiding Bolt","Lesser Restoration"], 5: ["Daylight","Revivify"], 7: ["Guardian Of Faith","Wall Of Fire"], 9: ["Greater Restoration","Summon Celestial"] }
  },

  "Fiend Patron": {
    class: "Warlock", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024",
    spells: { 3: ["Burning Hands","Command","Scorching Ray","Suggestion"], 5: ["Fireball","Stinking Cloud"], 7: ["Fire Shield","Wall Of Fire"], 9: ["Geas","Insect Plague"] }
  },

  "Great Old One Patron": {
    class: "Warlock", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024",
    spells: { 3: ["Detect Thoughts","Dissonant Whispers","Phantasmal Force","Tasha's Hideous Laughter"], 5: ["Clairvoyance","Hunger Of Hadar"], 7: ["Confusion","Summon Aberration"], 9: ["Modify Memory","Telekinesis"] }
  },

  // ── SORCERER SUBCLASSES ───────────────────────────────────────────────────

  "Aberrant Mind": {
    class: "Sorcerer", prepareType: "always_known",
    note: "Always known — can replace with divination/enchantment spells when leveling",
    spells: { 1: ["Arms Of Hadar","Dissonant Whispers"], 3: ["Calm Emotions","Detect Thoughts"], 5: ["Hunger Of Hadar","Sending"], 7: ["Evard's Black Tentacles","Summon Aberration"], 9: ["Telekinesis","Telepathy"] }
  },

  "Clockwork Soul": {
    class: "Sorcerer", prepareType: "always_known",
    note: "Always known — can replace when leveling",
    spells: { 1: ["Alarm","Protection From Evil And Good"], 3: ["Aid","Lesser Restoration"], 5: ["Dispel Magic","Protection From Energy"], 7: ["Freedom Of Movement","Summon Construct"], 9: ["Greater Restoration","Wall Of Force"] }
  },

  "Aberrant Sorcery": {
    class: "Sorcerer", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024",
    spells: { 3: ["Arms Of Hadar","Calm Emotions","Detect Thoughts","Dissonant Whispers","Mind Sliver"], 5: ["Hunger Of Hadar","Sending"], 7: ["Evard's Black Tentacles","Summon Aberration"], 9: ["Rary's Telepathic Bond","Telekinesis"] }
  },

  "Clockwork Sorcery": {
    class: "Sorcerer", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024",
    spells: { 3: ["Aid","Alarm","Lesser Restoration","Protection From Evil And Good"], 5: ["Dispel Magic","Protection From Energy"], 7: ["Freedom Of Movement","Summon Construct"], 9: ["Greater Restoration","Wall Of Force"] }
  },

  "Draconic Sorcery": {
    class: "Sorcerer", prepareType: "always_prepared",
    note: "Always prepared — PHB 2024",
    spells: { 3: ["Alter Self","Chromatic Orb","Command","Dragon's Breath"], 5: ["Fear","Fly"], 7: ["Arcane Eye","Charm Monster"], 9: ["Legend Lore","Summon Dragon"] }
  },

  // ── ARTIFICER SUBCLASSES ──────────────────────────────────────────────────

  "Alchemist": {
    class: "Artificer", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Healing Word","Ray Of Sickness"], 5: ["Flaming Sphere","Melf's Acid Arrow"], 9: ["Gaseous Form","Mass Healing Word"], 13: ["Blight","Death Ward"], 17: ["Cloudkill","Raise Dead"] }
  },

  "Armorer": {
    class: "Artificer", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Magic Missile","Thunderwave"], 5: ["Mirror Image","Shatter"], 9: ["Hypnotic Pattern","Lightning Bolt"], 13: ["Fire Shield","Greater Invisibility"], 17: ["Passwall","Wall Of Force"] }
  },

  "Artillerist": {
    class: "Artificer", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Shield","Thunderwave"], 5: ["Scorching Ray","Shatter"], 9: ["Fireball","Wind Wall"], 13: ["Ice Storm","Wall Of Fire"], 17: ["Cone Of Cold","Wall Of Force"] }
  },

  "Battle Smith": {
    class: "Artificer", prepareType: "always_prepared",
    note: "Always prepared — don't count toward limit",
    spells: { 3: ["Heroism","Shield"], 5: ["Branding Smite","Warding Bond"], 9: ["Aura Of Vitality","Conjure Barrage"], 13: ["Aura Of Purity","Fire Shield"], 17: ["Banishing Smite","Mass Cure Wounds"] }
  },

  // ── BARD SUBCLASSES ───────────────────────────────────────────────────────

  "College of Glamour": {
    class: "Bard", prepareType: "always_known",
    note: "Always known — PHB 2024",
    spells: { 3: ["Charm Person","Mirror Image"], 6: ["Command"] }
  }

};

// ── SPECIAL TABLES ─────────────────────────────────────────────────────────────

const SUBCLASS_TABLES = {

  "Wild Magic": {
    class: "Sorcerer",
    tables: [{
      name: "Wild Magic Surge",
      die: "d100",
      trigger: "After casting a 1st-level or higher spell, the DM may have you roll a d20. On a 1, roll d100 here.",
      entries: [
        { roll: "01–02", text: "Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls." },
        { roll: "03–04", text: "For the next minute, you can see any invisible creature if you have line of sight to it." },
        { roll: "05–06", text: "A modron chosen and controlled by the DM appears in an unoccupied space within 5 feet of you, then disappears 1 minute later." },
        { roll: "07–08", text: "You cast Fireball as a 3rd-level spell centered on yourself." },
        { roll: "09–10", text: "You cast Magic Missile as a 5th-level spell." },
        { roll: "11–12", text: "Roll a d10. Your height changes by a number of inches equal to the roll. If odd, you shrink. If even, you grow." },
        { roll: "13–14", text: "You cast Confusion centered on yourself." },
        { roll: "15–16", text: "For the next minute, you regain 5 hit points at the start of each of your turns." },
        { roll: "17–18", text: "You grow a long beard made of feathers that remains until you sneeze, at which point the feathers explode from your face." },
        { roll: "19–20", text: "You cast Grease centered on yourself." },
        { roll: "21–22", text: "Creatures have disadvantage on saving throws against the next spell you cast in the next minute that involves a saving throw." },
        { roll: "23–24", text: "Your skin turns a vibrant shade of blue. A Remove Curse spell can end this effect." },
        { roll: "25–26", text: "An eye appears on your forehead for the next minute. During that time, you have advantage on Perception checks that rely on sight." },
        { roll: "27–28", text: "For the next minute, all your spells with a casting time of 1 action have a casting time of 1 bonus action." },
        { roll: "29–30", text: "You teleport up to 60 feet to an unoccupied space of your choice that you can see." },
        { roll: "31–32", text: "You are transported to the Astral Plane until the end of your next turn, after which you return to the space you previously occupied or the nearest unoccupied space." },
        { roll: "33–34", text: "Maximize the damage of the next damaging spell you cast within the next minute." },
        { roll: "35–36", text: "Roll a d10. Your age changes by a number of years equal to the roll. If odd, you get younger (minimum 1 year old). If even, you get older." },
        { roll: "37–38", text: "1d6 flumphs controlled by the DM appear in unoccupied spaces within 60 feet of you and are frightened of you. They vanish after 1 minute." },
        { roll: "39–40", text: "You regain 2d10 hit points." },
        { roll: "41–42", text: "You turn into a potted plant until the start of your next turn. While a plant, you are incapacitated and have vulnerability to all damage. If you drop to 0 HP, your pot breaks and your form reverts." },
        { roll: "43–44", text: "For the next minute, you can teleport up to 20 feet as a bonus action on each of your turns." },
        { roll: "45–46", text: "You cast Levitate on yourself." },
        { roll: "47–48", text: "A unicorn controlled by the DM appears in a space within 5 feet of you, then disappears 1 minute later." },
        { roll: "49–50", text: "You can't speak for the next minute. Whenever you try, pink bubbles float out of your mouth." },
        { roll: "51–52", text: "A spectral shield hovers near you for the next minute, granting you a +2 bonus to AC and immunity to Magic Missile." },
        { roll: "53–54", text: "You are immune to being intoxicated by alcohol for the next 5d6 days." },
        { roll: "55–56", text: "Your hair falls out but grows back within 24 hours." },
        { roll: "57–58", text: "For the next minute, any flammable object you touch that isn't being worn or carried by another creature bursts into flame." },
        { roll: "59–60", text: "You regain your lowest-level expended spell slot." },
        { roll: "61–62", text: "For the next minute, you must shout when you speak." },
        { roll: "63–64", text: "You cast Fog Cloud centered on yourself." },
        { roll: "65–66", text: "Up to three creatures you choose within 30 feet of you take 4d10 lightning damage." },
        { roll: "67–68", text: "You are frightened by the nearest creature until the end of your next turn." },
        { roll: "69–70", text: "Each creature within 30 feet of you becomes invisible for the next minute. The invisibility ends on a creature when it attacks or casts a spell." },
        { roll: "71–72", text: "You gain resistance to all damage for the next minute." },
        { roll: "73–74", text: "A random creature within 60 feet of you becomes poisoned for 1d4 hours." },
        { roll: "75–76", text: "You glow with bright light in a 30-foot radius for the next minute. Any creature that ends its turn within 5 feet of you is blinded until the end of its next turn." },
        { roll: "77–78", text: "You cast Polymorph on yourself. If you fail the saving throw, you turn into a sheep for the spell's duration." },
        { roll: "79–80", text: "Illusory butterflies and flower petals flutter in the air within 10 feet of you for the next minute." },
        { roll: "81–82", text: "You can take one additional action immediately." },
        { roll: "83–84", text: "Each creature within 30 feet of you takes 1d10 necrotic damage. You regain hit points equal to the sum of the necrotic damage dealt." },
        { roll: "85–86", text: "You cast Mirror Image." },
        { roll: "87–88", text: "You cast Fly on a random creature within 60 feet of you." },
        { roll: "89–90", text: "You become invisible until the start of your next turn or until you attack or cast a spell." },
        { roll: "91–92", text: "If you die within the next minute, you immediately come back to life as if by the Reincarnate spell." },
        { roll: "93–94", text: "Your size increases by one size category for the next minute." },
        { roll: "95–96", text: "You and all creatures within 30 feet of you gain vulnerability to piercing damage for the next minute." },
        { roll: "97–98", text: "You are surrounded by faint, ethereal music for the next minute." },
        { roll: "99–00", text: "You regain all expended sorcery points." }
      ]
    }]
  },

  "Wild Magic Sorcery": {
    class: "Sorcerer",
    tables: [{
      name: "Wild Magic Surge",
      die: "d20 → d100",
      trigger: "After casting a spell with a spell slot, roll 1d20. On a 20, roll d100 on the table below.",
      entries: [
        { roll: "01–02", text: "Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls." },
        { roll: "03–04", text: "For the next minute, you can see any invisible creature if you have line of sight to it." },
        { roll: "05–06", text: "A modron chosen and controlled by the DM appears in an unoccupied space within 5 feet of you, then disappears 1 minute later." },
        { roll: "07–08", text: "You cast Fireball as a 3rd-level spell centered on yourself." },
        { roll: "09–10", text: "You cast Magic Missile as a 5th-level spell." },
        { roll: "11–12", text: "Roll a d10. Your height changes by a number of inches equal to the roll. If odd, you shrink. If even, you grow." },
        { roll: "13–14", text: "You cast Confusion centered on yourself." },
        { roll: "15–16", text: "For the next minute, you regain 5 hit points at the start of each of your turns." },
        { roll: "17–18", text: "You grow a long beard made of feathers that remains until you sneeze, at which point the feathers explode from your face." },
        { roll: "19–20", text: "You cast Grease centered on yourself." },
        { roll: "21–22", text: "Creatures have disadvantage on saving throws against the next spell you cast in the next minute that involves a saving throw." },
        { roll: "23–24", text: "Your skin turns a vibrant shade of blue. A Remove Curse spell can end this effect." },
        { roll: "25–26", text: "An eye appears on your forehead for the next minute. During that time, you have advantage on Perception checks that rely on sight." },
        { roll: "27–28", text: "For the next minute, all your spells with a casting time of 1 action have a casting time of 1 bonus action." },
        { roll: "29–30", text: "You teleport up to 60 feet to an unoccupied space of your choice that you can see." },
        { roll: "31–32", text: "You are transported to the Astral Plane until the end of your next turn, after which you return to the space you previously occupied or the nearest unoccupied space." },
        { roll: "33–34", text: "Maximize the damage of the next damaging spell you cast within the next minute." },
        { roll: "35–36", text: "Roll a d10. Your age changes by a number of years equal to the roll. If odd, you get younger (minimum 1 year old). If even, you get older." },
        { roll: "37–38", text: "1d6 flumphs controlled by the DM appear in unoccupied spaces within 60 feet of you and are frightened of you. They vanish after 1 minute." },
        { roll: "39–40", text: "You regain 2d10 hit points." },
        { roll: "41–42", text: "You turn into a potted plant until the start of your next turn. While a plant, you are incapacitated and have vulnerability to all damage. If you drop to 0 HP, your pot breaks and your form reverts." },
        { roll: "43–44", text: "For the next minute, you can teleport up to 20 feet as a bonus action on each of your turns." },
        { roll: "45–46", text: "You cast Levitate on yourself." },
        { roll: "47–48", text: "A unicorn controlled by the DM appears in a space within 5 feet of you, then disappears 1 minute later." },
        { roll: "49–50", text: "You can't speak for the next minute. Whenever you try, pink bubbles float out of your mouth." },
        { roll: "51–52", text: "A spectral shield hovers near you for the next minute, granting you a +2 bonus to AC and immunity to Magic Missile." },
        { roll: "53–54", text: "You are immune to being intoxicated by alcohol for the next 5d6 days." },
        { roll: "55–56", text: "Your hair falls out but grows back within 24 hours." },
        { roll: "57–58", text: "For the next minute, any flammable object you touch that isn't being worn or carried by another creature bursts into flame." },
        { roll: "59–60", text: "You regain your lowest-level expended spell slot." },
        { roll: "61–62", text: "For the next minute, you must shout when you speak." },
        { roll: "63–64", text: "You cast Fog Cloud centered on yourself." },
        { roll: "65–66", text: "Up to three creatures you choose within 30 feet of you take 4d10 lightning damage." },
        { roll: "67–68", text: "You are frightened by the nearest creature until the end of your next turn." },
        { roll: "69–70", text: "Each creature within 30 feet of you becomes invisible for the next minute. The invisibility ends on a creature when it attacks or casts a spell." },
        { roll: "71–72", text: "You gain resistance to all damage for the next minute." },
        { roll: "73–74", text: "A random creature within 60 feet of you becomes poisoned for 1d4 hours." },
        { roll: "75–76", text: "You glow with bright light in a 30-foot radius for the next minute. Any creature that ends its turn within 5 feet of you is blinded until the end of its next turn." },
        { roll: "77–78", text: "You cast Polymorph on yourself. If you fail the saving throw, you turn into a sheep for the spell's duration." },
        { roll: "79–80", text: "Illusory butterflies and flower petals flutter in the air within 10 feet of you for the next minute." },
        { roll: "81–82", text: "You can take one additional action immediately." },
        { roll: "83–84", text: "Each creature within 30 feet of you takes 1d10 necrotic damage. You regain hit points equal to the sum of the necrotic damage dealt." },
        { roll: "85–86", text: "You cast Mirror Image." },
        { roll: "87–88", text: "You cast Fly on a random creature within 60 feet of you." },
        { roll: "89–90", text: "You become invisible until the start of your next turn or until you attack or cast a spell." },
        { roll: "91–92", text: "If you die within the next minute, you immediately come back to life as if by the Reincarnate spell." },
        { roll: "93–94", text: "Your size increases by one size category for the next minute." },
        { roll: "95–96", text: "You and all creatures within 30 feet of you gain vulnerability to piercing damage for the next minute." },
        { roll: "97–98", text: "You are surrounded by faint, ethereal music for the next minute." },
        { roll: "99–00", text: "You regain all expended sorcery points." }
      ]
    }]
  },

  "Path of Wild Magic": {
    class: "Barbarian",
    tables: [{
      name: "Wild Magic",
      die: "d8",
      trigger: "Roll when you enter Rage.",
      entries: [
        { roll: "1", text: "Shadowy tendrils lash around you. Each creature within 5 feet of you takes 1d12 necrotic damage. You gain temporary hit points equal to the damage dealt." },
        { roll: "2", text: "You teleport up to 30 feet to an unoccupied space you can see." },
        { roll: "3", text: "An intangible spirit appears within 5 feet of a random creature within 30 feet of you. At the end of the current turn, the spirit explodes — each creature within 5 feet must make a DC 16 Constitution save or take 1d6 force damage." },
        { roll: "4", text: "Magic infuses one weapon of your choice that you are holding. Until your rage ends, the weapon's damage type changes to force, and it gains the light and thrown properties (range 20/60 ft). It reappears in your hand after each throw." },
        { roll: "5", text: "Whenever a creature hits you with an attack roll before your rage ends, that creature takes 1d6 force damage." },
        { roll: "6", text: "Until your rage ends, you are surrounded by multicolored lights. You gain a +1 bonus to AC, and allies within 10 feet of you gain the same bonus." },
        { roll: "7", text: "Flowers and vines temporarily grow around you. Until your rage ends, the ground within 15 feet of you is difficult terrain for your enemies." },
        { roll: "8", text: "A bolt of light shoots from your chest. One creature of your choice within 30 feet must succeed on a Constitution save (DC 8 + proficiency + Constitution modifier) or take 1d6 radiant damage and be blinded until the start of your next turn." }
      ]
    }]
  },

  "College of Spirits": {
    class: "Bard",
    tables: [{
      name: "Tales from Beyond",
      die: "d6",
      trigger: "When you use Spiritual Focus with Bardic Inspiration, roll to determine the tale told.",
      entries: [
        { roll: "1", text: "Tale of the Clever Animal: The target can forgo rolling the Bardic Inspiration die to instead reroll one ability check, attack roll, or saving throw." },
        { roll: "2", text: "Tale of the Renowned Duelist: The target rolls the Bardic Inspiration die twice and uses the higher result. If either roll is a 6, the target can make one weapon attack as a bonus action." },
        { roll: "3", text: "Tale of the Beloved Friends: The target can use the die to grant a nearby creature temporary hit points equal to the roll + your Charisma modifier (minimum 1)." },
        { roll: "4", text: "Tale of the Runaway: The target can move up to their speed as a reaction when a creature ends its turn within 5 feet of them. The die is not expended." },
        { roll: "5", text: "Tale of the Avenger: After the target takes damage, they can use their reaction to roll the die and deal force damage equal to the roll to the attacker." },
        { roll: "6", text: "Tale of the Traveler: The target gains temporary hit points equal to the roll + your Bardic Inspiration level, and their speed increases by 10 feet until the end of their next turn." }
      ]
    }]
  }

};
