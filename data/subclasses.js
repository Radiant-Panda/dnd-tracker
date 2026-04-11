/**
 * D&D 5e Subclass Data - PHB 2024
 * Structure: SUBCLASS_DATA[className][subclassName] = { name, source, features }
 * Each feature: { name, level, description, resource }
 * Resource (optional): { name, maxFormula, die, recharge }
 */

const SUBCLASS_DATA = {
  Barbarian: {
    Berserker: {
      name: 'Path of the Berserker',
      source: 'PHB',
      features: [
        { name: 'Frenzy', level: 3, description: 'When you enter a rage, you can make one melee weapon attack as a bonus action.', resource: null },
        { name: 'Mindless Rage', level: 6, description: 'Your rage can\'t be ended early by anything other than your choice or becoming unconscious.', resource: null },
        { name: 'Intimidating Presence', level: 10, description: 'You can use an action to frighten a creature within 30 feet with a menacing presence.', resource: null },
      ]
    },
    'Totem Warrior': {
      name: 'Path of the Totem Warrior',
      source: 'PHB',
      features: [
        { name: 'Totem Spirit', level: 3, description: 'Choose a totem spirit (Bear, Eagle, Wolf) and gain benefits from it.', resource: null },
        { name: 'Aspect of the Beast', level: 6, description: 'Gain benefits based on your totem spirit choice.', resource: null },
        { name: 'Spirit Walker', level: 10, description: 'Cast spells on creatures that you can see within 30 feet of you using an action.', resource: null },
      ]
    },
    'Wild Magic': {
      name: 'Path of Wild Magic',
      source: 'PHB',
      features: [
        { name: 'Magic Awareness', level: 3, description: 'You sense magical auras. You can sense the presence of magic within 60 feet of you.', resource: null },
        { name: 'Wild Magic', level: 3, description: 'When you enter a rage, roll on a table to gain a magical effect.', resource: null },
        { name: 'Unstable Backlash', level: 6, description: 'When you take damage while raging, you can use your reaction to roll on the wild magic table.', resource: null },
      ]
    },
    Zealot: {
      name: 'Path of the Zealot',
      source: 'PHB',
      features: [
        { name: 'Divine Fury', level: 3, description: 'While raging, the first creature you hit each turn takes an extra 1d6 damage.', resource: null },
        { name: 'Warrior of the Gods', level: 6, description: 'Your connection to your god allows you to attack recklessly without fear.', resource: null },
        { name: 'Zealous Presence', level: 10, description: 'Use your action to fill nearby allies with zealous wrath, granting them advantage on melee attacks.', resource: null },
      ]
    },
    Beast: {
      name: 'Path of the Beast',
      source: 'PHB',
      features: [
        { name: 'Form of the Beast', level: 3, description: 'When you enter a rage, you grow dangerous natural weapons.', resource: null },
        { name: 'Bestial Soul', level: 6, description: 'Gain additional benefits to your natural weapons based on your rage form.', resource: null },
        { name: 'Infectious Fury', level: 10, description: 'When a creature hits you with a melee attack while you\'re raging, it takes psychic damage.', resource: null },
      ]
    },
    'Storm Herald': {
      name: 'Path of the Storm Herald',
      source: 'PHB',
      features: [
        { name: 'Storm Aura', level: 3, description: 'When you enter a rage, storm magic surrounds you, granting you a benefit based on your chosen environment.', resource: null },
        { name: 'Storm Soul', level: 6, description: 'Gain resistance to a damage type based on your chosen storm aura.', resource: null },
        { name: 'Raging Storm', level: 10, description: 'Your storm aura becomes more powerful while you\'re raging.', resource: null },
      ]
    },
  },
  Bard: {
    Lore: {
      name: 'College of Lore',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 3, description: 'Gain proficiency with three skill of your choice.', resource: null },
        { name: 'Cutting Words', level: 3, description: 'When a creature within 60 feet makes an attack, you can use your reaction to subtract from their roll.', resource: { name: 'Bardic Inspiration', maxFormula: 'cha_mod', die: 'd6', recharge: 'long' } },
        { name: 'Peerless Skill', level: 6, description: 'When you make an ability check, you can add a Bardic Inspiration die.', resource: null },
      ]
    },
    Valor: {
      name: 'College of Valor',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 3, description: 'Gain proficiency with medium armor, shields, and martial melee weapons.', resource: null },
        { name: 'Combat Inspiration', level: 3, description: 'Grant a Bardic Inspiration die to an ally within 60 feet as a bonus action.', resource: { name: 'Bardic Inspiration', maxFormula: 'cha_mod', die: 'd6', recharge: 'long' } },
        { name: 'Extra Attack', level: 6, description: 'You can attack twice whenever you take the Attack action.', resource: null },
      ]
    },
    Glamour: {
      name: 'College of Glamour',
      source: 'PHB',
      features: [
        { name: 'Mantle of Inspiration', level: 3, description: 'Grant temporary hit points and remove a condition using a Bardic Inspiration die.', resource: { name: 'Bardic Inspiration', maxFormula: 'cha_mod', die: 'd6', recharge: 'long' } },
        { name: 'Enthralling Performance', level: 3, description: 'Charm creatures with a performance for 1 hour.', resource: null },
        { name: 'Mantle of Majesty', level: 6, description: 'Cast command using Bardic Inspiration, affecting multiple creatures.', resource: null },
      ]
    },
    Spirits: {
      name: 'College of Spirits',
      source: 'PHB',
      features: [
        { name: 'Guiding Whispers', level: 3, description: 'Cast guidance as a bonus action.', resource: null },
        { name: 'Spiritual Focus', level: 3, description: 'Gain a special focus for spell casting.', resource: null },
        { name: 'Tales from Beyond', level: 3, description: 'Roll on a table to tell a tale granting temporary effects.', resource: { name: 'Bardic Inspiration', maxFormula: 'cha_mod', die: 'd6', recharge: 'long' } },
      ]
    },
    Swords: {
      name: 'College of Swords',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 3, description: 'Gain proficiency with medium armor and scimitars.', resource: null },
        { name: 'Fighting Style', level: 3, description: 'Choose a fighting style: Two-Weapon Fighting or Dueling.', resource: null },
        { name: 'Blade Flourish', level: 3, description: 'Spend a Bardic Inspiration die to add flourishes to your weapon attack.', resource: { name: 'Bardic Inspiration', maxFormula: 'cha_mod', die: 'd6', recharge: 'long' } },
      ]
    },
    Whispers: {
      name: 'College of Whispers',
      source: 'PHB',
      features: [
        { name: 'Psychic Blades', level: 3, description: 'Once per turn, spend a Bardic Inspiration die to deal extra psychic damage.', resource: { name: 'Bardic Inspiration', maxFormula: 'cha_mod', die: 'd6', recharge: 'long' } },
        { name: 'Words of Terror', level: 3, description: 'Spend 1 minute speaking to frighten a humanoid.', resource: null },
        { name: 'Mask of Many Faces', level: 6, description: 'Cast disguise self at will.', resource: null },
      ]
    },
    Creation: {
      name: 'College of Creation',
      source: 'PHB',
      features: [
        { name: 'Mote of Potential', level: 3, description: 'Enhance a creature\'s ability check or saving throw with a Bardic Inspiration die.', resource: { name: 'Bardic Inspiration', maxFormula: 'cha_mod', die: 'd6', recharge: 'long' } },
        { name: 'Performance of Creation', level: 3, description: 'Use a performance to create nonmagical items.', resource: null },
        { name: 'Animating Performance', level: 6, description: 'Animate a Large or smaller nonmagical object with magic.', resource: null },
      ]
    },
  },
  Cleric: {
    Life: {
      name: 'Life Domain',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 1, description: 'Gain proficiency with heavy armor.', resource: null },
        { name: 'Disciple of Life', level: 1, description: 'When you cast a spell that restores hit points, add extra healing.', resource: null },
        { name: 'Channel Divinity: Preserve Life', level: 2, description: 'Restore hit points to creatures within 30 feet.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Blessed Healer', level: 6, description: 'When you cast a healing spell, you gain temporary hit points.', resource: null },
      ]
    },
    Light: {
      name: 'Light Domain',
      source: 'PHB',
      features: [
        { name: 'Warding Flare', level: 1, description: 'When a creature within 30 feet attacks you, use your reaction to impose disadvantage.', resource: null },
        { name: 'Channel Divinity: Radiance of the Dawn', level: 2, description: 'Shed bright light and damage fiends and undead.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Improved Flare', level: 6, description: 'You gain more uses of Warding Flare per turn.', resource: null },
      ]
    },
    Trickery: {
      name: 'Trickery Domain',
      source: 'PHB',
      features: [
        { name: 'Blessing of the Trickster', level: 1, description: 'Grant advantage on Stealth checks to a creature.', resource: null },
        { name: 'Channel Divinity: Invoke Duplicity', level: 2, description: 'Create an illusory duplicate of yourself.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Improved Duplicity', level: 6, description: 'Your duplicate becomes more useful in combat.', resource: null },
      ]
    },
    Knowledge: {
      name: 'Knowledge Domain',
      source: 'PHB',
      features: [
        { name: 'Blessing of Knowledge', level: 1, description: 'Gain proficiency with two skills of your choice.', resource: null },
        { name: 'Channel Divinity: Visions of the Past', level: 2, description: 'Learn about recent events in a location.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Read Thoughts', level: 6, description: 'Cast detect thoughts using Channel Divinity.', resource: null },
      ]
    },
    Nature: {
      name: 'Nature Domain',
      source: 'PHB',
      features: [
        { name: 'Acolyte of Nature', level: 1, description: 'Learn two druid cantrips of your choice.', resource: null },
        { name: 'Channel Divinity: Charm Animals and Plants', level: 2, description: 'Charm beasts and plants within 30 feet.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Dampen Elements', level: 6, description: 'Grant resistance to a damage type to nearby creatures.', resource: null },
      ]
    },
    Tempest: {
      name: 'Tempest Domain',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 1, description: 'Gain proficiency with martial melee weapons and heavy armor.', resource: null },
        { name: 'Wrath of the Storm', level: 1, description: 'Deal lightning damage when a creature within 5 feet hits you.', resource: null },
        { name: 'Channel Divinity: Destructive Wrath', level: 2, description: 'Deal maximum damage with lightning or thunder spells.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
      ]
    },
    War: {
      name: 'War Domain',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 1, description: 'Gain proficiency with martial melee weapons and heavy armor.', resource: null },
        { name: 'War Priest', level: 1, description: 'Make a melee weapon attack as a bonus action after casting a spell.', resource: null },
        { name: 'Channel Divinity: Guided Strike', level: 2, description: 'Add your WIS modifier to a melee attack roll.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
      ]
    },
    Forge: {
      name: 'Forge Domain',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 1, description: 'Gain proficiency with heavy armor and smith\'s tools.', resource: null },
        { name: 'Blessing of the Forge', level: 1, description: 'Use an action to grant a nonmagical weapon or armor a +1 bonus.', resource: null },
        { name: 'Channel Divinity: Artisan\'s Blessing', level: 2, description: 'Create nonmagical items using Channel Divinity.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
      ]
    },
    Grave: {
      name: 'Grave Domain',
      source: 'PHB',
      features: [
        { name: 'Sentinel at Death\'s Door', level: 1, description: 'Detect undead and fiends, and learn their creature types.', resource: null },
        { name: 'Channel Divinity: Path to the Grave', level: 2, description: 'Mark a creature to take extra damage from the next hit.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Sentinel Remark', level: 6, description: 'Advantage on death saving throws and grants it to nearby allies.', resource: null },
      ]
    },
    Peace: {
      name: 'Peace Domain',
      source: 'PHB',
      features: [
        { name: 'Emboldening Bond', level: 1, description: 'Grant temporary hit points and advantage to nearby allies.', resource: null },
        { name: 'Channel Divinity: Protective Bond', level: 2, description: 'Grant resistance to a nearby ally.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Potent Spellcasting', level: 6, description: 'Add your WIS modifier to spell damage.', resource: null },
      ]
    },
    Twilight: {
      name: 'Twilight Domain',
      source: 'PHB',
      features: [
        { name: 'Twilight Sanctuary', level: 1, description: 'Create an aura of dim light granting temporary hit points.', resource: null },
        { name: 'Channel Divinity: Twilight Sanctuary', level: 2, description: 'Recharge your Twilight Sanctuary feature.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Flight', level: 6, description: 'Gain a flying speed equal to your walking speed.', resource: null },
      ]
    },
    Arcana: {
      name: 'Arcana Domain',
      source: 'PHB',
      features: [
        { name: 'Arcane Initiate', level: 1, description: 'Learn two wizard cantrips of your choice.', resource: null },
        { name: 'Channel Divinity: Spell Absorption', level: 2, description: 'Cast a wizard spell using Channel Divinity.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Potent Spellcasting', level: 6, description: 'Add your WIS modifier to spell damage.', resource: null },
      ]
    },
    Death: {
      name: 'Death Domain',
      source: 'PHB',
      features: [
        { name: 'Death\'s Touch', level: 1, description: 'Deal extra necrotic damage with your weapon attacks.', resource: null },
        { name: 'Channel Divinity: Touch of Death', level: 2, description: 'Deal necrotic damage with Channel Divinity.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Improved Reaper', level: 6, description: 'Cast a necromancy spell at half spell level cost.', resource: null },
      ]
    },
    Order: {
      name: 'Order Domain',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 1, description: 'Gain proficiency with heavy armor.', resource: null },
        { name: 'Order\'s Demand', level: 1, description: 'When you cast a spell, use your reaction to grant an ally an extra attack.', resource: null },
        { name: 'Channel Divinity: Order\'s Wrath', level: 2, description: 'Stun a creature with Channel Divinity.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
      ]
    },
  },
  Druid: {
    Land: {
      name: 'Circle of the Land',
      source: 'PHB',
      features: [
        { name: 'Bonus Cantrip', level: 2, description: 'Learn an additional druid cantrip of your choice.', resource: null },
        { name: 'Circle Spells', level: 2, description: 'Add bonus spells based on your chosen land.', resource: null },
        { name: 'Land\'s Stride', level: 8, description: 'Moving through difficult terrain costs no extra movement.', resource: null },
      ]
    },
    Moon: {
      name: 'Circle of the Moon',
      source: 'PHB',
      features: [
        { name: 'Combat Wild Shape', level: 2, description: 'Use Wild Shape as a bonus action and gain extra hit points.', resource: { name: 'Wild Shape', maxFormula: 2, die: null, recharge: 'short' } },
        { name: 'Primal Strike', level: 6, description: 'Your natural weapon attacks count as magical.', resource: null },
        { name: 'Improved Wild Shape', level: 8, description: 'Wild Shape damage increases and you gain more forms.', resource: null },
      ]
    },
    Dreams: {
      name: 'Circle of Dreams',
      source: 'PHB',
      features: [
        { name: 'Balm of the Summer Court', level: 2, description: 'Grant temporary hit points to nearby allies using Wild Shape.', resource: null },
        { name: 'Hearth of Moonlight and Shadow', level: 6, description: 'Create dim light around you and teleport.', resource: null },
        { name: 'Hidden Paths', level: 10, description: 'Cast pass without trace without expending a spell slot.', resource: null },
      ]
    },
    Shepherd: {
      name: 'Circle of the Shepherd',
      source: 'PHB',
      features: [
        { name: 'Guiding Instinct', level: 2, description: 'Cast guidance using an action.', resource: null },
        { name: 'Faithful Summons', level: 2, description: 'Summon a beast companion that follows your commands.', resource: null },
        { name: 'Beast Companion', level: 2, description: 'Gain a permanent beast companion.', resource: null },
      ]
    },
    Spores: {
      name: 'Circle of Spores',
      source: 'PHB',
      features: [
        { name: 'Fungal Body', level: 2, description: 'Gain resistance to poison and advantage against being poisoned.', resource: null },
        { name: 'Symbiotic Entity', level: 2, description: 'Summon a fungal colony that grants benefits.', resource: null },
        { name: 'Infectious Fungi', level: 6, description: 'Spread spores to nearby creatures.', resource: null },
      ]
    },
    Stars: {
      name: 'Circle of Stars',
      source: 'PHB',
      features: [
        { name: 'Star Map', level: 2, description: 'Gain astronomical knowledge and benefits.', resource: null },
        { name: 'Starry Form', level: 2, description: 'Transform into constellations granting benefits.', resource: null },
        { name: 'Cosmic Omen', level: 6, description: 'Read omens to learn about future events.', resource: null },
      ]
    },
    Wildfire: {
      name: 'Circle of Wildfire',
      source: 'PHB',
      features: [
        { name: 'Summon Wildfire Spirit', level: 2, description: 'Summon a spirit that grants benefits and teleportation.', resource: null },
        { name: 'Enhanced Bond', level: 6, description: 'Your summon becomes more powerful.', resource: null },
        { name: 'Blazing Endurance', level: 10, description: 'Grant temporary hit points using Wildfire Spirit.', resource: null },
      ]
    },
  },
  Fighter: {
    Champion: {
      name: 'Champion',
      source: 'PHB',
      features: [
        { name: 'Improved Critical', level: 3, description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.', resource: null },
        { name: 'Remarkable Athlete', level: 7, description: 'Add your fighting spirit bonus to non-attack rolls and saves.', resource: null },
        { name: 'Superior Critical', level: 15, description: 'Your weapon attacks score a critical hit on a roll of 18-20.', resource: null },
      ]
    },
    'Battle Master': {
      name: 'Battle Master',
      source: 'PHB',
      features: [
        { name: 'Combat Superiority', level: 3, description: 'You learn maneuvers using superiority dice.', resource: { name: 'Superiority Dice', maxFormula: 4, die: 'd8', recharge: 'short' } },
        { name: 'Know Your Enemy', level: 7, description: 'Make an Intelligence check to learn details about a creature.', resource: null },
        { name: 'Improved Combat Superiority', level: 10, description: 'Your superiority die increases and you gain more dice.', resource: null },
      ]
    },
    'Eldritch Knight': {
      name: 'Eldritch Knight',
      source: 'PHB',
      features: [
        { name: 'Spellcasting', level: 3, description: 'Learn wizard spells using INT as your spellcasting ability.', resource: null },
        { name: 'Weapon Bond', level: 3, description: 'Bond with a weapon to summon it and gain benefits.', resource: null },
        { name: 'War Magic', level: 7, description: 'Make a melee weapon attack as a bonus action after casting a spell.', resource: null },
      ]
    },
    'Arcane Archer': {
      name: 'Arcane Archer',
      source: 'PHB',
      features: [
        { name: 'Arcane Shot', level: 3, description: 'Infuse your ranged attacks with arcane magic.', resource: { name: 'Arcane Shots', maxFormula: 2, die: null, recharge: 'short' } },
        { name: 'Magic Arrow', level: 7, description: 'Your ammunition counts as magical for overcoming resistance.', resource: null },
        { name: 'Improved Arcane Shot', level: 15, description: 'Your arcane shots become more powerful.', resource: null },
      ]
    },
    Cavalier: {
      name: 'Cavalier',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 3, description: 'Gain proficiency with heavy armor and vehicles.', resource: null },
        { name: 'Born to the Saddle', level: 3, description: 'Gain advantage on saves to avoid falling.', resource: null },
        { name: 'Unwavering Mark', level: 7, description: 'Mark a creature with disadvantage on attacks against others.', resource: null },
      ]
    },
    'Echo Knight': {
      name: 'Echo Knight',
      source: 'PHB',
      features: [
        { name: 'Manifest Echo', level: 3, description: 'Summon an echo of yourself to enhance your attacks.', resource: null },
        { name: 'Echo Avatar', level: 7, description: 'See through and hear from your echo.', resource: null },
        { name: 'Reclaim Potential', level: 15, description: 'Regain superiority dice when you use them.', resource: null },
      ]
    },
    'Psi Warrior': {
      name: 'Psi Warrior',
      source: 'PHB',
      features: [
        { name: 'Psionic Power', level: 3, description: 'Use psionic energy to enhance your abilities.', resource: { name: 'Psionic Energy', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Telekinetic Movement', level: 3, description: 'Move a creature or object using psychic power.', resource: null },
        { name: 'Improved Psionic Power', level: 7, description: 'Gain more psionic energy uses.', resource: null },
      ]
    },
    'Rune Knight': {
      name: 'Rune Knight',
      source: 'PHB',
      features: [
        { name: 'Rune Magic', level: 3, description: 'Learn runes that grant magical abilities.', resource: null },
        { name: 'Giant\'s Might', level: 3, description: 'Grow to Large size and gain strength benefits.', resource: null },
        { name: 'Powerful Runes', level: 10, description: 'Your runes become more powerful.', resource: null },
      ]
    },
    Samurai: {
      name: 'Samurai',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 3, description: 'Gain proficiency with heavy armor and katanas.', resource: null },
        { name: 'Fighting Spirit', level: 3, description: 'Gain advantage on attacks and resistance to damage.', resource: { name: 'Fighting Spirit', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Elegant Courtier', level: 7, description: 'Gain advantage on Insight and Persuasion checks.', resource: null },
      ]
    },
  },
  Monk: {
    'Open Hand': {
      name: 'Way of the Open Hand',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiency', level: 3, description: 'Gain proficiency with one artisan\'s tool or instrument.', resource: null },
        { name: 'Martial Arts', level: 1, description: 'Use DEX for unarmed strikes and roll d4 damage.', resource: null },
        { name: 'Open Hand Technique', level: 3, description: 'Add special effects to your unarmed strikes.', resource: null },
      ]
    },
    Shadow: {
      name: 'Way of Shadow',
      source: 'PHB',
      features: [
        { name: 'Shadow Arts', level: 3, description: 'Cast spells using ki points.', resource: { name: 'Ki Points', maxFormula: 'level', die: null, recharge: 'short' } },
        { name: 'Invisibility', level: 3, description: 'Turn invisible in dim light or darkness using ki.', resource: null },
        { name: 'Cloak of Shadows', level: 6, description: 'Become invisible in dim light without using ki.', resource: null },
      ]
    },
    'Four Elements': {
      name: 'Way of Four Elements',
      source: 'PHB',
      features: [
        { name: 'Disciple of the Elements', level: 3, description: 'Cast elemental spells using ki points.', resource: { name: 'Ki Points', maxFormula: 'level', die: null, recharge: 'short' } },
        { name: 'Elemental Attunement', level: 3, description: 'Gain control over the elements around you.', resource: null },
        { name: 'Improved Elements', level: 6, description: 'Your elemental spells become more powerful.', resource: null },
      ]
    },
    'Astral Self': {
      name: 'Way of Mercy',
      source: 'PHB',
      features: [
        { name: 'Hands of Healing', level: 3, description: 'Use ki to heal allies as a bonus action.', resource: { name: 'Ki Points', maxFormula: 'level', die: null, recharge: 'short' } },
        { name: 'Hands of Harm', level: 3, description: 'Deal extra damage with your strikes.', resource: null },
        { name: 'Improved Healing', level: 6, description: 'Your healing becomes more effective.', resource: null },
      ]
    },
    'Drunken Master': {
      name: 'Way of the Drunken Master',
      source: 'PHB',
      features: [
        { name: 'Drunken Technique', level: 3, description: 'Gain AC and damage benefits while spending ki.', resource: { name: 'Ki Points', maxFormula: 'level', die: null, recharge: 'short' } },
        { name: 'Tipsy Sway', level: 3, description: 'Use your reaction to gain advantage on saves.', resource: null },
        { name: 'Improved Drunken Technique', level: 6, description: 'Gain additional movement or damage benefits.', resource: null },
      ]
    },
    Kensei: {
      name: 'Way of the Kensei',
      source: 'PHB',
      features: [
        { name: 'Kensei Weapons', level: 3, description: 'Use monk weapons with DEX and add martial arts damage.', resource: null },
        { name: 'One with the Blade', level: 3, description: 'Gain AC benefits when wielding a kensei weapon.', resource: null },
        { name: 'Improved Weapons', level: 6, description: 'Your kensei weapons become more deadly.', resource: null },
      ]
    },
    'Long Death': {
      name: 'Way of Long Death',
      source: 'PHB',
      features: [
        { name: 'Touch of Death', level: 3, description: 'When a creature within 5 feet dies, you gain ki.', resource: null },
        { name: 'Hour of Reaping', level: 3, description: 'When you damage a creature, it gains vulnerability to damage.', resource: null },
        { name: 'Mastery of Death', level: 6, description: 'When you would drop to 0 HP, use ki to drop to 1 instead.', resource: null },
      ]
    },
    Mercy: {
      name: 'Way of Mercy',
      source: 'PHB',
      features: [
        { name: 'Hand of Healing', level: 3, description: 'Spend ki to heal an ally with an unarmed strike.', resource: { name: 'Ki Points', maxFormula: 'level', die: null, recharge: 'short' } },
        { name: 'Hand of Harm', level: 3, description: 'Deal extra damage with your strikes.', resource: null },
        { name: 'Physician\'s Touch', level: 6, description: 'Cure diseases with your hands.', resource: null },
      ]
    },
    'Sun Soul': {
      name: 'Way of the Sun Soul',
      source: 'PHB',
      features: [
        { name: 'Radiant Sun Bolt', level: 3, description: 'Make ranged attacks using ki that deal radiant damage.', resource: { name: 'Ki Points', maxFormula: 'level', die: null, recharge: 'short' } },
        { name: 'Searing Sunburst', level: 3, description: 'Spend ki to blind creatures around you.', resource: null },
        { name: 'Sun Shield', level: 6, description: 'Gain damage reduction when wearing light or no armor.', resource: null },
      ]
    },
  },
  Paladin: {
    Devotion: {
      name: 'Oath of Devotion',
      source: 'PHB',
      features: [
        { name: 'Sacred Weapon', level: 3, description: 'Use your action to gain advantage on attacks and add CHA to damage.', resource: { name: 'Sacred Weapon', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Holy Nimbus', level: 7, description: 'Shed bright light and grant advantage to nearby allies.', resource: null },
        { name: 'Sanctified Wrath', level: 15, description: 'Deal extra radiant damage with attacks against fiends and undead.', resource: null },
      ]
    },
    Ancients: {
      name: 'Oath of the Ancients',
      source: 'PHB',
      features: [
        { name: 'Channel Divinity: Ensnaring Strike', level: 3, description: 'Restrain a creature you hit with an attack.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Primal Strike', level: 7, description: 'Your weapon attacks count as magical.', resource: null },
        { name: 'Elder Champion', level: 15, description: 'Gain advantage and gain extra movement speed.', resource: null },
      ]
    },
    Vengeance: {
      name: 'Oath of Vengeance',
      source: 'PHB',
      features: [
        { name: 'Channel Divinity: Abjure Enemy', level: 3, description: 'Force a creature to make a STR save or be pushed.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Relentless Avenger', level: 7, description: 'Make a melee attack as a reaction after taking damage.', resource: null },
        { name: 'Soul of Vengeance', level: 15, description: 'Deal extra damage against your marked enemy.', resource: null },
      ]
    },
    Conquest: {
      name: 'Oath of Conquest',
      source: 'PHB',
      features: [
        { name: 'Channel Divinity: Conquering Strike', level: 3, description: 'Frighten a creature you hit with a melee attack.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Aura of Conquest', level: 7, description: 'Frighten creatures within 30 feet when they start their turn.', resource: null },
        { name: 'Mighty Conqueror', level: 15, description: 'Gain extra damage against frightened creatures.', resource: null },
      ]
    },
    Crown: {
      name: 'Oath of the Crown',
      source: 'PHB',
      features: [
        { name: 'Channel Divinity: Champion Challenge', level: 3, description: 'Challenge a creature to attack only you.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Divine Protection', level: 7, description: 'Grant bonus AC to nearby allies.', resource: null },
        { name: 'Exalted Champion', level: 15, description: 'Gain advantage on saves and deal extra damage.', resource: null },
      ]
    },
    Glory: {
      name: 'Oath of Glory',
      source: 'PHB',
      features: [
        { name: 'Channel Divinity: Peerless Athlete', level: 3, description: 'Gain advantage on athletic checks or long jump distance.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Inspiring Smite', level: 7, description: 'Grant temporary hit points when you hit with Divine Smite.', resource: null },
        { name: 'Glorious Defense', level: 15, description: 'Reduce damage taken and move without opportunity attacks.', resource: null },
      ]
    },
    Redemption: {
      name: 'Oath of Redemption',
      source: 'PHB',
      features: [
        { name: 'Channel Divinity: Emissary of Peace', level: 3, description: 'Grant advantage on Persuasion checks and immunity to damage.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Protective Spirit', level: 7, description: 'Grant temporary hit points to nearby allies.', resource: null },
        { name: 'Emissary of Redemption', level: 15, description: 'Deal radiant damage to attackers.', resource: null },
      ]
    },
    Watchers: {
      name: 'Oath of the Watchers',
      source: 'PHB',
      features: [
        { name: 'Channel Divinity: Watcher\'s Will', level: 3, description: 'Grant advantage on Initiative or ability checks.', resource: { name: 'Channel Divinity', maxFormula: 1, die: null, recharge: 'short' } },
        { name: 'Aura of the Sentinel', level: 7, description: 'Grant advantage on perception checks to nearby allies.', resource: null },
        { name: 'Vigilant Protector', level: 15, description: 'Use your reaction to reduce damage taken by others.', resource: null },
      ]
    },
  },
  Ranger: {
    Hunter: {
      name: 'Hunter',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 3, description: 'Gain proficiency with one skill and one weapon.', resource: null },
        { name: 'Colossus Slayer', level: 3, description: 'Deal extra damage when attacking a wounded creature.', resource: null },
        { name: 'Multiattack Defense', level: 11, description: 'Gain AC when attacked multiple times.', resource: null },
      ]
    },
    'Beast Master': {
      name: 'Beast Master',
      source: 'PHB',
      features: [
        { name: 'Beast Companion', level: 3, description: 'Gain a permanent animal companion that fights with you.', resource: null },
        { name: 'Primal Bond', level: 5, description: 'Your beast gains proficiency bonuses and telepathy.', resource: null },
        { name: 'Beast Strikes', level: 11, description: 'Your beast\'s attacks count as magical.', resource: null },
      ]
    },
    'Gloom Stalker': {
      name: 'Gloom Stalker',
      source: 'PHB',
      features: [
        { name: 'Dread Ambusher', level: 3, description: 'Gain extra attack and movement when rolling Initiative.', resource: null },
        { name: 'Shadowy Dodge', level: 7, description: 'Take half damage from ranged attacks in dim light.', resource: null },
        { name: 'Iron Mind', level: 15, description: 'Gain proficiency with WIS saves.', resource: null },
      ]
    },
    'Horizon Walker': {
      name: 'Horizon Walker',
      source: 'PHB',
      features: [
        { name: 'Planar Warrior', level: 3, description: 'Deal extra damage to creatures from other planes.', resource: null },
        { name: 'Ethereal Step', level: 7, description: 'Teleport up to 30 feet as a bonus action.', resource: null },
        { name: 'Distant Strike', level: 11, description: 'Teleport between attack targets.', resource: null },
      ]
    },
    'Monster Slayer': {
      name: 'Monster Slayer',
      source: 'PHB',
      features: [
        { name: 'Hunter\'s Sense', level: 3, description: 'Learn information about a creature\'s weaknesses.', resource: null },
        { name: 'Slayer\'s Counter', level: 7, description: 'Use your reaction to attack when a creature hits you.', resource: null },
        { name: 'Magic-User\'s Nemesis', level: 15, description: 'Gain advantage against spellcasters.', resource: null },
      ]
    },
    'Fey Wanderer': {
      name: 'Fey Wanderer',
      source: 'PHB',
      features: [
        { name: 'Dreadful Strikes', level: 3, description: 'Deal psychic damage with your attacks.', resource: null },
        { name: 'Fey Reinforcements', level: 7, description: 'Summon fey spirits to aid you in combat.', resource: null },
        { name: 'Fey Fortitude', level: 11, description: 'Gain advantage on saves against being charmed or frightened.', resource: null },
      ]
    },
    Swarmkeeper: {
      name: 'Swarmkeeper',
      source: 'PHB',
      features: [
        { name: 'Swarm of Insects', level: 3, description: 'Command a swarm that deals damage and provides movement.', resource: null },
        { name: 'Gathered Swarm', level: 7, description: 'Your swarm grows stronger and grants more benefits.', resource: null },
        { name: 'Mighty Swarm', level: 11, description: 'Your swarm deals more damage and affects more creatures.', resource: null },
      ]
    },
  },
  Rogue: {
    Thief: {
      name: 'Thief',
      source: 'PHB',
      features: [
        { name: 'Fast Hands', level: 3, description: 'Use a bonus action to use an object or attempt to disarm/pick locks.', resource: null },
        { name: 'Second-Story Work', level: 9, description: 'Climb at your full speed and add DEX to jump distance.', resource: null },
        { name: 'Weapon Mastery', level: 13, description: 'Gain additional benefits from using light weapons.', resource: null },
      ]
    },
    Assassin: {
      name: 'Assassin',
      source: 'PHB',
      features: [
        { name: 'Assassinate', level: 3, description: 'Gain advantage on attacks against surprised creatures.', resource: null },
        { name: 'Assassinate', level: 3, description: 'Automatically succeed on initiative checks.', resource: null },
        { name: 'Infiltration Expertise', level: 9, description: 'Forge documents and assume false identities.', resource: null },
      ]
    },
    'Arcane Trickster': {
      name: 'Arcane Trickster',
      source: 'PHB',
      features: [
        { name: 'Spellcasting', level: 3, description: 'Learn wizard spells using INT as your spellcasting ability.', resource: null },
        { name: 'Mage Hand Legerdemain', level: 3, description: 'Your mage hand is invisible and can use magic items.', resource: null },
        { name: 'Magical Ambush', level: 9, description: 'Gain advantage on spells against surprised creatures.', resource: null },
      ]
    },
    Inquisitive: {
      name: 'Inquisitive',
      source: 'PHB',
      features: [
        { name: 'Eye for Detail', level: 3, description: 'Gain proficiency with Insight and learn additional languages.', resource: null },
        { name: 'Insightful Fighting', level: 3, description: 'Learn a creature\'s AC or ability scores with Insight.', resource: null },
        { name: 'Steady Eye', level: 9, description: 'Advantage on Perception and Stealth checks while moving.', resource: null },
      ]
    },
    Mastermind: {
      name: 'Mastermind',
      source: 'PHB',
      features: [
        { name: 'Master of Intrigue', level: 3, description: 'Gain proficiency with additional languages and tools.', resource: null },
        { name: 'Master of Tactics', level: 3, description: 'Grant advantage to an ally\'s attack using a reaction.', resource: null },
        { name: 'Insightful Manipulator', level: 9, description: 'Learn a creature\'s mental ability scores with Insight.', resource: null },
      ]
    },
    Scout: {
      name: 'Scout',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 3, description: 'Gain proficiency with Nature and Survival.', resource: null },
        { name: 'Skirmisher', level: 3, description: 'Move without opportunity attacks when using Cunning Action.', resource: null },
        { name: 'Ambush Master', level: 9, description: 'Gain advantage on Initiative and ambush rolls.', resource: null },
      ]
    },
    Soulknife: {
      name: 'Soulknife',
      source: 'PHB',
      features: [
        { name: 'Psychic Blades', level: 3, description: 'Create psychic blades that deal extra damage.', resource: null },
        { name: 'Soul Blades', level: 3, description: 'Your blades can be thrown and have telepathic properties.', resource: null },
        { name: 'Masterful Blades', level: 9, description: 'Your blades become more powerful and versatile.', resource: null },
      ]
    },
    Swashbuckler: {
      name: 'Swashbuckler',
      source: 'PHB',
      features: [
        { name: 'Fancy Footwork', level: 3, description: 'Move without provoking opportunity attacks during attacks.', resource: null },
        { name: 'Rakish Audacity', level: 3, description: 'Add CHA modifier to initiative and your Sneak Attack damage.', resource: null },
        { name: 'Panache', level: 9, description: 'Charm a creature you hit with an attack.', resource: null },
      ]
    },
    Phantom: {
      name: 'Phantom',
      source: 'PHB',
      features: [
        { name: 'Whispers of the Dead', level: 3, description: 'Learn the secrets of dead creatures you touch.', resource: null },
        { name: 'Wails from the Grave', level: 3, description: 'Deal extra necrotic damage with Sneak Attack.', resource: null },
        { name: 'Ghost Walk', level: 9, description: 'Become invisible as a bonus action.', resource: null },
      ]
    },
  },
  Sorcerer: {
    Draconic: {
      name: 'Draconic Bloodline',
      source: 'PHB',
      features: [
        { name: 'Draconic Resilience', level: 1, description: 'Gain AC benefits and fire resistance based on your draconic ancestor.', resource: null },
        { name: 'Elemental Affinity', level: 6, description: 'Add CHA to damage when casting spells of your chosen element.', resource: null },
        { name: 'Dragon Wings', level: 14, description: 'Gain a flying speed as a bonus action.', resource: null },
      ]
    },
    'Wild Magic': {
      name: 'Wild Magic',
      source: 'PHB',
      features: [
        { name: 'Wild Magic Surge', level: 1, description: 'Roll on a table when you cast a spell to gain magical effects.', resource: null },
        { name: 'Tides of Chaos', level: 1, description: 'Gain advantage on an attack, ability check, or save using sorcery points.', resource: { name: 'Sorcery Points', maxFormula: 'level', die: null, recharge: 'long' } },
        { name: 'Bend Luck', level: 6, description: 'Spend sorcery points to modify die rolls.', resource: null },
      ]
    },
    Shadow: {
      name: 'Shadow Magic',
      source: 'PHB',
      features: [
        { name: 'Eyes of Darkness', level: 1, description: 'See in darkness and cast spells in dim light.', resource: null },
        { name: 'Strength of the Grave', level: 1, description: 'Spend sorcery points to gain temporary hit points.', resource: { name: 'Sorcery Points', maxFormula: 'level', die: null, recharge: 'long' } },
        { name: 'Hound of Ill Omen', level: 6, description: 'Summon a shadow hound to chase a creature.', resource: null },
      ]
    },
    Storm: {
      name: 'Storm Sorcery',
      source: 'PHB',
      features: [
        { name: 'Wind Speaker', level: 1, description: 'Learn Primordial and gain bonuses with wind/lightning spells.', resource: null },
        { name: 'Tempestuous Magic', level: 1, description: 'Gain flying speed as a bonus action when casting spells.', resource: null },
        { name: 'Heart of the Storm', level: 6, description: 'Resistance to lightning and thunder damage.', resource: null },
      ]
    },
    'Aberrant Mind': {
      name: 'Aberrant Mind',
      source: 'PHB',
      features: [
        { name: 'Telepathic', level: 1, description: 'Cast spells using telepathy instead of speaking.', resource: null },
        { name: 'Psionic Sorcery', level: 1, description: 'Cast spells using sorcery points without verbal components.', resource: { name: 'Sorcery Points', maxFormula: 'level', die: null, recharge: 'long' } },
        { name: 'Expanded Spell List', level: 1, description: 'Know additional spells from the wizard spell list.', resource: null },
      ]
    },
    'Clockwork Soul': {
      name: 'Clockwork Soul',
      source: 'PHB',
      features: [
        { name: 'Clockwork Magic', level: 1, description: 'Know additional spells that can\'t be dispelled.', resource: null },
        { name: 'Restore Balance', level: 1, description: 'Spend sorcery points to grant advantage or disadvantage.', resource: { name: 'Sorcery Points', maxFormula: 'level', die: null, recharge: 'long' } },
        { name: 'Bastion of Law', level: 6, description: 'Protect nearby allies from damage.', resource: null },
      ]
    },
    Lunar: {
      name: 'Lunar Sorcery',
      source: 'PHB',
      features: [
        { name: 'Lunar Sorcery', level: 1, description: 'Choose lunar phase benefits that modify your spells.', resource: null },
        { name: 'Moon Fire', level: 1, description: 'Add bonus damage or effects based on the lunar phase.', resource: null },
        { name: 'Lunar Embodiment', level: 6, description: 'Gain benefits based on your lunar phase.', resource: null },
      ]
    },
  },
  Warlock: {
    Archfey: {
      name: 'Archfey',
      source: 'PHB',
      features: [
        { name: 'One with Shadows', level: 6, description: 'Become invisible in dim light or darkness.', resource: null },
        { name: 'Misty Escape', level: 6, description: 'Become invisible and teleport as a reaction when hit.', resource: null },
        { name: 'Bewitching Defense', level: 10, description: 'Charm a creature that damages you.', resource: null },
      ]
    },
    Fiend: {
      name: 'Fiend',
      source: 'PHB',
      features: [
        { name: 'Dark One\'s Blessing', level: 1, description: 'Gain temporary hit points when you drop a creature.', resource: null },
        { name: 'Dark One\'s Own Luck', level: 6, description: 'Add 1d10 to an attack roll, ability check, or save.', resource: null },
        { name: 'Fiendish Resilience', level: 10, description: 'Choose damage resistances that regain at short rest.', resource: null },
      ]
    },
    'Great Old One': {
      name: 'Great Old One',
      source: 'PHB',
      features: [
        { name: 'Awaken Mind', level: 1, description: 'Communicate telepathically with creatures you can see.', resource: null },
        { name: 'Entropic Ward', level: 6, description: 'Use your reaction to impose disadvantage on attacks against you.', resource: null },
        { name: 'Thought Shield', level: 10, description: 'Gain advantages on saves and deal damage to psychic attackers.', resource: null },
      ]
    },
    Celestial: {
      name: 'Celestial',
      source: 'PHB',
      features: [
        { name: 'Healing Light', level: 1, description: 'Heal allies using a pool of d6 dice.', resource: { name: 'Healing Light', maxFormula: 'level', die: 'd6', recharge: 'long' } },
        { name: 'Radiant Soul', level: 6, description: 'Add CHA to spell damage and gain resistance.', resource: null },
        { name: 'Celestial Resilience', level: 10, description: 'Regenerate hit points at the start of your turn.', resource: null },
      ]
    },
    Hexblade: {
      name: 'Hexblade',
      source: 'PHB',
      features: [
        { name: 'Hex Warrior', level: 1, description: 'Use CHA for melee weapon attacks and damage.', resource: null },
        { name: 'Accursed Specter', level: 6, description: 'Summon a ghost to fight for you.', resource: null },
        { name: 'Armor of Hexes', level: 7, description: 'Reduce damage taken and impose disadvantage on attacks.', resource: null },
      ]
    },
    Fathomless: {
      name: 'Fathomless',
      source: 'PHB',
      features: [
        { name: 'Gift of the Sea', level: 1, description: 'Gain swimming speed and water breathing.', resource: null },
        { name: 'Tentacle of the Deeps', level: 1, description: 'Summon a tentacle that attacks and grapples.', resource: null },
        { name: 'Guardian Coil', level: 6, description: 'Your tentacle can protect allies.', resource: null },
      ]
    },
    Genie: {
      name: 'Genie',
      source: 'PHB',
      features: [
        { name: 'Genie\'s Vessel', level: 1, description: 'Gain a magical vessel that provides benefits.', resource: null },
        { name: 'Elemental Gift', level: 1, description: 'Gain resistance to an element and cast elemental spells.', resource: null },
        { name: 'Sanctuary Vessel', level: 6, description: 'Your vessel grants temporary hit points and hiding.', resource: null },
      ]
    },
  },
  Wizard: {
    Abjuration: {
      name: 'Abjuration',
      source: 'PHB',
      features: [
        { name: 'Arcane Ward', level: 2, description: 'Gain temporary hit points from abjuration spells.', resource: null },
        { name: 'Protective Ward', level: 6, description: 'Grant nearby creatures the benefits of your ward.', resource: null },
        { name: 'Spell Resistance', level: 10, description: 'Gain resistance to spell damage and saving throw benefits.', resource: null },
      ]
    },
    Divination: {
      name: 'Divination',
      source: 'PHB',
      features: [
        { name: 'Divination Savant', level: 2, description: 'Learn divination spells and copy them faster.', resource: null },
        { name: 'Portent', level: 2, description: 'Roll d20s to later replace ability checks or attack rolls.', resource: null },
        { name: 'Expert Divination', level: 10, description: 'Reroll divination spell saves with your own roll.', resource: null },
      ]
    },
    Conjuration: {
      name: 'Conjuration',
      source: 'PHB',
      features: [
        { name: 'Conjuration Savant', level: 2, description: 'Learn conjuration spells and copy them faster.', resource: null },
        { name: 'Benign Transposition', level: 2, description: 'Teleport and swap places with a creature as a bonus action.', resource: null },
        { name: 'Focused Conjuration', level: 10, description: 'Your conjured creatures gain extra benefits.', resource: null },
      ]
    },
    Enchantment: {
      name: 'Enchantment',
      source: 'PHB',
      features: [
        { name: 'Enchantment Savant', level: 2, description: 'Learn enchantment spells and copy them faster.', resource: null },
        { name: 'Hypnotic Gaze', level: 2, description: 'Use your action to charm a creature you can see.', resource: null },
        { name: 'Instinctive Charm', level: 6, description: 'React to an attack with a charm effect.', resource: null },
      ]
    },
    Evocation: {
      name: 'Evocation',
      source: 'PHB',
      features: [
        { name: 'Evocation Savant', level: 2, description: 'Learn evocation spells and copy them faster.', resource: null },
        { name: 'Sculpt Spells', level: 2, description: 'Exclude creatures from your spell area when casting.', resource: null },
        { name: 'Potent Cantrip', level: 6, description: 'Deal half damage with cantrips on saves.', resource: null },
      ]
    },
    Illusion: {
      name: 'Illusion',
      source: 'PHB',
      features: [
        { name: 'Illusion Savant', level: 2, description: 'Learn illusion spells and copy them faster.', resource: null },
        { name: 'Improved Minor Illusion', level: 2, description: 'Create illusory sounds and images with cantrips.', resource: null },
        { name: 'Malleable Illusions', level: 6, description: 'Change your illusions as an action.', resource: null },
      ]
    },
    Necromancy: {
      name: 'Necromancy',
      source: 'PHB',
      features: [
        { name: 'Necromancy Savant', level: 2, description: 'Learn necromancy spells and copy them faster.', resource: null },
        { name: 'Grim Harvest', level: 2, description: 'Gain temporary hit points when creatures die nearby.', resource: null },
        { name: 'Undead Thralls', level: 6, description: 'Control undead creatures with improved spells.', resource: null },
      ]
    },
    Transmutation: {
      name: 'Transmutation',
      source: 'PHB',
      features: [
        { name: 'Transmutation Savant', level: 2, description: 'Learn transmutation spells and copy them faster.', resource: null },
        { name: 'Minor Alchemy', level: 2, description: 'Transform nonmagical materials into other materials.', resource: null },
        { name: 'Transmuter\'s Stone', level: 6, description: 'Create a magical stone granting benefits.', resource: null },
      ]
    },
    Bladesinging: {
      name: 'Bladesinging',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 2, description: 'Gain proficiency with light armor and scimitars.', resource: null },
        { name: 'Bladesong', level: 2, description: 'Enter a dance granting AC and benefits to abilities.', resource: null },
        { name: 'Extra Attack', level: 6, description: 'Attack twice when using the Attack action.', resource: null },
      ]
    },
    Chronurgy: {
      name: 'Chronurgy Magic',
      source: 'PHB',
      features: [
        { name: 'Chronal Shift', level: 2, description: 'Reroll an attack roll or save using sorcery points.', resource: { name: 'Sorcery Points', maxFormula: 'level', die: null, recharge: 'long' } },
        { name: 'Momentary Flux', level: 6, description: 'Grant advantage or disadvantage to ability checks.', resource: null },
        { name: 'Force of Personality', level: 10, description: 'Use INT for spellcasting ability checks.', resource: null },
      ]
    },
    Graviturgy: {
      name: 'Graviturgy Magic',
      source: 'PHB',
      features: [
        { name: 'Adjust Density', level: 2, description: 'Modify a creature\'s weight or jumping ability.', resource: null },
        { name: 'Gravity Well', level: 6, description: 'Pull creatures to you and reduce their mobility.', resource: null },
        { name: 'Event Horizon', level: 10, description: 'Creatures near you have reduced movement.', resource: null },
      ]
    },
    'Order of Scribes': {
      name: 'Order of Scribes',
      source: 'PHB',
      features: [
        { name: 'Wizardly Quill', level: 2, description: 'Use a magical quill to write spells.', resource: null },
        { name: 'Awakened Spellbook', level: 2, description: 'Your spellbook becomes an awoken object that helps you.', resource: null },
        { name: 'One with the Word', level: 6, description: 'Gain benefits when reading from your spellbook.', resource: null },
      ]
    },
    'War Magic': {
      name: 'War Magic',
      source: 'PHB',
      features: [
        { name: 'Bonus Proficiencies', level: 2, description: 'Gain proficiency with light armor and martial weapons.', resource: null },
        { name: 'War Magic', level: 2, description: 'Attack with a weapon as a bonus action when casting spells.', resource: null },
        { name: 'Durable Magic', level: 6, description: 'Gain temporary hit points from abjuration spells.', resource: null },
      ]
    },
  },
};

if (typeof module !== 'undefined' && module.exports) module.exports = SUBCLASS_DATA;
