/**
 * D&D Species, Races & Backgrounds — generated from 5etools
 * species_2024: 2024 PHB species (no fixed ability bonuses)
 * races_2014: 2014 PHB races (fixed ability bonuses)
 * races_mpmm: Mordenkainen's Multiverse races (+2/+1 choose any)
 * backgrounds_2024: 2024 PHB backgrounds (fixed stat group, skills, tools, feat)
 */

const SPECIES_DATA = {
  "species_2024": [
    {
      "name": "Aasimar",
      "source": "PHB 2024",
      "size": "Small/Medium",
      "speed": 30,
      "traits": [
        {
          "name": "Celestial Resistance",
          "desc": "You have Resistance to Necrotic damage and Radiant damage."
        },
        {
          "name": "Darkvision",
          "desc": "You have Darkvision with a range of 60 feet."
        },
        {
          "name": "Healing Hands",
          "desc": "As a Magic action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains a number of Hit Points equal to the total rolled. Once you use this trait, you can't use it again until you finish a Long Rest."
        },
        {
          "name": "Light Bearer",
          "desc": "You know the Light cantrip. Charisma is your spellcasting ability for it."
        },
        {
          "name": "Celestial Revelation",
          "desc": "When you reach character level 3, you can transform as a Bonus Action using one of the options below (choose the option each time you transform). The transformation lasts for 1 minute or until you end it (no action required). Once you transform, you can't do so again until you finish a Long Rest.\n\nOnce on each of your turns before the transformation ends, you can deal extra damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your Proficiency Bonus, and the extra damage's type is either Necrotic for Necrotic Shroud or Radiant for Heavenly Wings and Inner Radiance.\n\nHere are the transformation options:\n\n• **Heavenly Wings.** Two spectral wings sprout from your back temporarily. Until the transformation ends, you have a Fly Speed equal to your Speed.\n• **Inner Radiance.** Searing light temporarily radiates from your eyes and mouth. For the duration, you shed Bright Light in a 10-foot radius and Dim Light for an additional 10 feet, and at the end of each of your turns, each creature within 10 feet of you takes Radiant damage equal to your Proficiency Bonus.\n• **Necrotic Shroud.** Your eyes briefly become pools of darkness, and flightless wings sprout from your back temporarily. Creatures other than your allies within 10 feet of you must succeed on a Charisma saving throw (8 plus your Charisma modifier and Proficiency Bonus) or have the Frightened condition until the end of your next turn."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    },
    {
      "name": "Dragonborn",
      "source": "PHB 2024",
      "size": "Medium",
      "speed": 30,
      "traits": [
        {
          "name": "Draconic Ancestry",
          "desc": "Your lineage stems from a dragon progenitor. Choose the kind of dragon from the Draconic Ancestors table. Your choice affects your Breath Weapon and Damage Resistance traits as well as your appearance.\n\nTable: Draconic Ancestors\n| Dragon | Damage Type |\n| Black | Acid |\n| Blue | Lightning |\n| Brass | Fire |\n| Bronze | Lightning |\n| Copper | Acid |\n| Gold | Fire |\n| Green | Poison |\n| Red | Fire |\n| Silver | Cold |\n| White | Cold |"
        },
        {
          "name": "Breath Weapon",
          "desc": "When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line that is 5 feet wide (choose the shape each time). Each creature in that area must make a Dexterity saving throw (8 plus your Constitution modifier and Proficiency Bonus). On a failed save, a creature takes 1d10 damage of the type determined by your Draconic Ancestry trait. On a successful save, a creature takes half as much damage. This damage increases by 1d10 when you reach character levels 5 (2d10), 11 (3d10), and 17 (4d10).\n\nYou can use this Breath Weapon a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest."
        },
        {
          "name": "Damage Resistance",
          "desc": "You have Resistance to the damage type determined by your Draconic Ancestry trait."
        },
        {
          "name": "Darkvision",
          "desc": "You have Darkvision with a range of 60 feet."
        },
        {
          "name": "Draconic Flight",
          "desc": "When you reach character level 5, you can channel draconic magic to give yourself temporary flight. As a Bonus Action, you sprout spectral wings on your back that last for 10 minutes or until you retract the wings (no action required) or have the Incapacitated condition. During that time, you have a Fly Speed equal to your Speed. Your wings appear to be made of the same energy as your Breath Weapon. Once you use this trait, you can't use it again until you finish a Long Rest."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    },
    {
      "name": "Dwarf",
      "source": "PHB 2024",
      "size": "Medium",
      "speed": 30,
      "traits": [
        {
          "name": "Darkvision",
          "desc": "You have Darkvision with a range of 120 feet."
        },
        {
          "name": "Dwarven Resilience",
          "desc": "You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition."
        },
        {
          "name": "Dwarven Toughness",
          "desc": "Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level."
        },
        {
          "name": "Stonecunning",
          "desc": "As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes. You must be on a stone surface or touching a stone surface to use this Tremorsense. The stone can be natural or worked.\n\nYou can use this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    },
    {
      "name": "Elf",
      "source": "PHB 2024",
      "size": "Medium",
      "speed": 30,
      "traits": [
        {
          "name": "Darkvision",
          "desc": "You have Darkvision with a range of 60 feet."
        },
        {
          "name": "Elven Lineage",
          "desc": "You are part of a lineage that grants you supernatural abilities. Choose a lineage from the Elven Lineages table. You gain the level 1 benefit of that lineage.\n\nWhen you reach character levels 3 and 5, you learn a higher-level spell, as shown on the table. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select the lineage).\n\nTable: Elven Lineages\n| Lineage | Level 1 | Level 3 | Level 5 |\n| Drow | The range of your Darkvision increases to 120 feet. You also know the Dancing Lights cantrip. | Faerie Fire | Darkness |\n| High Elf | You know the Prestidigitation cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Wizard spell list. | Detect Magic | Misty Step |\n| Wood Elf | Your Speed increases to 35 feet. You also know the Druidcraft cantrip. | Longstrider | Pass without Trace |"
        },
        {
          "name": "Fey Ancestry",
          "desc": "You have Advantage on saving throws you make to avoid or end the Charmed condition."
        },
        {
          "name": "Keen Senses",
          "desc": "You have proficiency in the Insight, Perception, or Survival skill."
        },
        {
          "name": "Trance",
          "desc": "You don't need to sleep, and magic can't put you to sleep. You can finish a Long Rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    },
    {
      "name": "Gnome",
      "source": "PHB 2024",
      "size": "Small",
      "speed": 30,
      "traits": [
        {
          "name": "Darkvision",
          "desc": "You have Darkvision with a range of 60 feet."
        },
        {
          "name": "Gnomish Cunning",
          "desc": "You have Advantage on Intelligence, Wisdom, and Charisma saving throws."
        },
        {
          "name": "Gnomish Lineage",
          "desc": "You are part of a lineage that grants you supernatural abilities. Choose one of the following options; whichever one you choose, Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select the lineage):\n\n• **Forest Gnome.** You know the Minor Illusion cantrip. You also always have the Speak with Animals spell prepared. You can cast it without a spell slot a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. You can also use any spell slots you have to cast the spell.\n• **Rock Gnome.** You know the Mending and Prestidigitation cantrips. In addition, you can spend 10 minutes casting Prestidigitation to create a Tiny clockwork device (AC 5, 1 HP), such as a toy, fire starter, or music box. When you create the device, you determine its function by choosing one effect from Prestidigitation; the device produces that effect whenever you or another creature takes a Bonus Action to activate it with a touch. If the chosen effect has options within it, you choose one of those options for the device when you create it. For example, if you choose the spell's ignite-extinguish effect, you determine whether the device ignites or extinguishes fire; the device doesn't do both. You can have three such devices in existence at a time, and each falls apart 8 hours after its creation or when you dismantle it with a touch as a Utilize action."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    },
    {
      "name": "Goliath",
      "source": "PHB 2024",
      "size": "Medium",
      "speed": 35,
      "traits": [
        {
          "name": "Giant Ancestry",
          "desc": "You are descended from Giants. Choose one of the following benefits—a supernatural boon from your ancestry; you can use the chosen benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest:\n\n• **Cloud's Jaunt (Cloud Giant).** As a Bonus Action, you magically teleport up to 30 feet to an unoccupied space you can see.\n• **Fire's Burn (Fire Giant).** When you hit a target with an attack roll and deal damage to it, you can also deal 1d10 Fire damage to that target.\n• **Frost's Chill (Frost Giant).** When you hit a target with an attack roll and deal damage to it, you can also deal 1d6 Cold damage to that target and reduce its Speed by 10 feet until the start of your next turn.\n• **Hill's Tumble (Hill Giant).** When you hit a Large or smaller creature with an attack roll and deal damage to it, you can give that target the Prone condition.\n• **Stone's Endurance (Stone Giant).** When you take damage, you can take a Reaction to roll 1d12. Add your Constitution modifier to the number rolled and reduce the damage by that total.\n• **Storm's Thunder (Storm Giant).** When you take damage from a creature within 60 feet of you, you can take a Reaction to deal 1d8 Thunder damage to that creature."
        },
        {
          "name": "Large Form",
          "desc": "Starting at character level 5, you can change your size to Large as a Bonus Action if you're in a big enough space. This transformation lasts for 10 minutes or until you end it (no action required). For that duration, you have Advantage on Strength checks, and your Speed increases by 10 feet. Once you use this trait, you can't use it again until you finish a Long Rest."
        },
        {
          "name": "Powerful Build",
          "desc": "You have Advantage on any ability check you make to end the Grappled condition. You also count as one size larger when determining your carrying capacity."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    },
    {
      "name": "Halfling",
      "source": "PHB 2024",
      "size": "Small",
      "speed": 30,
      "traits": [
        {
          "name": "Brave",
          "desc": "You have Advantage on saving throws you make to avoid or end the Frightened condition."
        },
        {
          "name": "Halfling Nimbleness",
          "desc": "You can move through the space of any creature that is a size larger than you, but you can't stop in the same space."
        },
        {
          "name": "Luck",
          "desc": "When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll."
        },
        {
          "name": "Naturally Stealthy",
          "desc": "You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    },
    {
      "name": "Human",
      "source": "PHB 2024",
      "size": "Small/Medium",
      "speed": 30,
      "traits": [
        {
          "name": "Resourceful",
          "desc": "You gain Heroic Inspiration whenever you finish a Long Rest."
        },
        {
          "name": "Skillful",
          "desc": "You gain proficiency in one skill of your choice."
        },
        {
          "name": "Versatile",
          "desc": "You gain an Origin feat of your choice."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    },
    {
      "name": "Orc",
      "source": "PHB 2024",
      "size": "Medium",
      "speed": 30,
      "traits": [
        {
          "name": "Adrenaline Rush",
          "desc": "You can take the Dash action as a Bonus Action. When you do so, you gain a number of Temporary Hit Points equal to your Proficiency Bonus.\n\nYou can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest."
        },
        {
          "name": "Darkvision",
          "desc": "You have Darkvision with a range of 120 feet."
        },
        {
          "name": "Relentless Endurance",
          "desc": "When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can't do so again until you finish a Long Rest."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    },
    {
      "name": "Tiefling",
      "source": "PHB 2024",
      "size": "Small/Medium",
      "speed": 30,
      "traits": [
        {
          "name": "Darkvision",
          "desc": "You have Darkvision with a range of 60 feet."
        },
        {
          "name": "Fiendish Legacy",
          "desc": "You are the recipient of a legacy that grants you supernatural abilities. Choose a legacy from the Fiendish Legacies table. You gain the level 1 benefit of the chosen legacy.\n\nWhen you reach character levels 3 and 5, you learn a higher-level spell, as shown on the table. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select the legacy).\n\nTable: Fiendish Legacies\n| Legacy | Level 1 | Level 3 | Level 5 |\n| Abyssal | You have Resistance to Poison damage. You also know the Poison Spray cantrip. | Ray of Sickness | Hold Person |\n| Chthonic | You have Resistance to Necrotic damage. You also know the Chill Touch cantrip. | False Life | Ray of Enfeeblement |\n| Infernal | You have Resistance to Fire damage. You also know the Fire Bolt cantrip. | Hellish Rebuke | Darkness |"
        },
        {
          "name": "Otherworldly Presence",
          "desc": "You know the Thaumaturgy cantrip. When you cast it with this trait, the spell uses the same spellcasting ability you use for your Fiendish Legacy Trait."
        }
      ],
      "abilityNote": "Ability score increases come from your Background (+2 and +1 to stats in your background's group)"
    }
  ],
  "races_2014": [
    {
      "name": "Dragonborn",
      "source": "PHB 2014",
      "size": "Medium",
      "speed": 30,
      "abilityBonuses": {
        "str": 2,
        "cha": 1
      },
      "abilityChoices": [],
      "traits": [
        {
          "name": "Age",
          "desc": "Young dragonborn grow quickly. They walk hours after hatching, attain the size and development of a 10-year-old human child by the age of 3, and reach adulthood by 15. They live to be around 80."
        },
        {
          "name": "Size",
          "desc": "Dragonborn are taller and heavier than humans, standing well over 6 feet tall and averaging almost 250 pounds. Your size is Medium."
        },
        {
          "name": "Draconic Ancestry",
          "desc": "You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type, as shown in the table.\n\nTable: Draconic Ancestry\n| Dragon | Damage Type | Breath Weapon |\n| Black | Acid | 5 by 30 ft. line (Dex. save) |\n| Blue | Lightning | 5 by 30 ft. line (Dex. save) |\n| Brass | Fire | 5 by 30 ft. line (Dex. save) |\n| Bronze | Lightning | 5 by 30 ft. line (Dex. save) |\n| Copper | Acid | 5 by 30 ft. line (Dex. save) |\n| Gold | Fire | 15 ft. cone (Dex. save) |\n| Green | Poison | 15 ft. cone (Con. save) |\n| Red | Fire | 15 ft. cone (Dex. save) |\n| Silver | Cold | 15 ft. cone (Con. save) |\n| White | Cold | 15 ft. cone (Con. save) |"
        },
        {
          "name": "Breath Weapon",
          "desc": "You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.\n\nWhen you use your breath weapon, each creature in the area of the exhalation must make a saving throw, the type of which is determined by your draconic ancestry. The DC for this saving throw equals 8 + your Constitution modifier + your proficiency bonus. A creature takes 2d6 damage on a failed save, and half as much damage on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.\n\nAfter you use your breath weapon, you can't use it again until you complete a short or long rest."
        },
        {
          "name": "Damage Resistance",
          "desc": "You have resistance to the damage type associated with your draconic ancestry."
        },
        {
          "name": "Languages",
          "desc": "You can speak, read, and write Common and Draconic. Draconic is thought to be one of the oldest languages and is often used in the study of magic. The language sounds harsh to most other creatures and includes numerous hard consonants and sibilants."
        }
      ]
    },
    {
      "name": "Dwarf",
      "source": "PHB 2014",
      "size": "Medium",
      "speed": 25,
      "abilityBonuses": {
        "con": 2
      },
      "abilityChoices": [],
      "traits": [
        {
          "name": "Age",
          "desc": "Dwarves mature at the same rate as humans, but they're considered young until they reach the age of 50. On average, they live about 350 years."
        },
        {
          "name": "Size",
          "desc": "Dwarves stand between 4 and 5 feet tall and average about 150 pounds. Your size is Medium."
        },
        {
          "name": "Speed",
          "desc": "Your speed is not reduced by wearing heavy armor."
        },
        {
          "name": "Darkvision",
          "desc": "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
        },
        {
          "name": "Dwarven Resilience",
          "desc": "You have advantage on saving throws against poison, and you have resistance against poison damage."
        },
        {
          "name": "Dwarven Combat Training",
          "desc": "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer."
        },
        {
          "name": "Tool Proficiency",
          "desc": "You gain proficiency with the artisan's tools of your choice: Smith's tools, brewer's supplies, or mason's tools."
        },
        {
          "name": "Stonecunning",
          "desc": "Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus."
        },
        {
          "name": "Languages",
          "desc": "You can speak, read, and write Common and Dwarvish. Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak."
        }
      ]
    },
    {
      "name": "Elf",
      "source": "PHB 2014",
      "size": "Medium",
      "speed": 30,
      "abilityBonuses": {
        "dex": 2
      },
      "abilityChoices": [],
      "traits": [
        {
          "name": "Age",
          "desc": "Although elves reach physical maturity at about the same age as humans, the elven understanding of adulthood goes beyond physical growth to encompass worldly experience. An elf typically claims adulthood and an adult name around the age of 100 and can live to be 750 years old."
        },
        {
          "name": "Size",
          "desc": "Elves range from under 5 to over 6 feet tall and have slender builds. Your size is Medium."
        },
        {
          "name": "Darkvision",
          "desc": "Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
        },
        {
          "name": "Keen Senses",
          "desc": "You have proficiency in the Perception skill."
        },
        {
          "name": "Fey Ancestry",
          "desc": "You have advantage on saving throws against being charmed, and magic can't put you to sleep."
        },
        {
          "name": "Trance",
          "desc": "Elves don't need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is \"trance.\") While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.\n\nIf you meditate during a long rest, you finish the rest after only 4 hours. You otherwise obey all the rules for a long rest; only the duration is changed."
        },
        {
          "name": "Languages",
          "desc": "You can speak, read, and write Common and Elvish. Elvish is fluid, with subtle intonations and intricate grammar. Elven literature is rich and varied, and their songs and poems are famous among other races. Many bards learn their language so they can add Elvish ballads to their repertoires."
        }
      ]
    },
    {
      "name": "Gnome",
      "source": "PHB 2014",
      "size": "Small",
      "speed": 25,
      "abilityBonuses": {
        "int": 2
      },
      "abilityChoices": [],
      "traits": [
        {
          "name": "Age",
          "desc": "Gnomes mature at the same rate humans do, and most are expected to settle down into an adult life by around age 40. They can live 350 to almost 500 years."
        },
        {
          "name": "Size",
          "desc": "Gnomes are between 3 and 4 feet tall and average about 40 pounds. Your size is Small."
        },
        {
          "name": "Darkvision",
          "desc": "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
        },
        {
          "name": "Gnome Cunning",
          "desc": "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic."
        },
        {
          "name": "Languages",
          "desc": "You can speak, read, and write Common and Gnomish. The Gnomish language, which uses the Dwarvish script, is renowned for its technical treatises and its catalogs of knowledge about the natural world."
        }
      ]
    },
    {
      "name": "Half-Elf",
      "source": "PHB 2014",
      "size": "Medium",
      "speed": 30,
      "abilityBonuses": {},
      "abilityChoices": [
        {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis"
          ],
          "count": 2,
          "amount": 1
        }
      ],
      "traits": [
        {
          "name": "Age",
          "desc": "Half-elves mature at the same rate humans do and reach adulthood around the age of 20. They live much longer than humans, however, often exceeding 180 years."
        },
        {
          "name": "Size",
          "desc": "Half-elves are about the same size as humans, ranging from 5 to 6 feet tall. Your size is Medium."
        },
        {
          "name": "Darkvision",
          "desc": "Thanks to your elf blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
        },
        {
          "name": "Fey Ancestry",
          "desc": "You have advantage on saving throws against being charmed, and magic can't put you to sleep."
        },
        {
          "name": "Skill Versatility",
          "desc": "You gain proficiency in two skills of your choice."
        },
        {
          "name": "Languages",
          "desc": "You can speak, read, and write Common, Elvish, and one extra language of your choice."
        }
      ]
    },
    {
      "name": "Half-Orc",
      "source": "PHB 2014",
      "size": "Medium",
      "speed": 30,
      "abilityBonuses": {
        "str": 2,
        "con": 1
      },
      "abilityChoices": [],
      "traits": [
        {
          "name": "Age",
          "desc": "Half-orcs mature a little faster than humans, reaching adulthood around age 14. They age noticeably faster and rarely live longer than 75 years."
        },
        {
          "name": "Size",
          "desc": "Half-orcs are somewhat larger and bulkier than humans, and they range from 5 to well over 6 feet tall. Your size is Medium."
        },
        {
          "name": "Darkvision",
          "desc": "Thanks to your orc blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
        },
        {
          "name": "Menacing",
          "desc": "You gain proficiency in the Intimidation skill."
        },
        {
          "name": "Relentless Endurance",
          "desc": "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can't use this feature again until you finish a long rest."
        },
        {
          "name": "Savage Attacks",
          "desc": "When you score a critical hit with a melee weapon attack, you can roll one of the weapon's damage dice one additional time and add it to the extra damage of the critical hit."
        },
        {
          "name": "Languages",
          "desc": "You can speak, read, and write Common and Orc. Orc is a harsh, grating language with hard consonants. It has no script of its own but is written in the Dwarvish script."
        }
      ]
    },
    {
      "name": "Halfling",
      "source": "PHB 2014",
      "size": "Small",
      "speed": 25,
      "abilityBonuses": {
        "dex": 2
      },
      "abilityChoices": [],
      "traits": [
        {
          "name": "Age",
          "desc": "A halfling reaches adulthood at the age of 20 and generally lives into the middle of his or her second century."
        },
        {
          "name": "Size",
          "desc": "Halflings average about 3 feet tall and weigh about 40 pounds. Your size is Small."
        },
        {
          "name": "Lucky",
          "desc": "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll."
        },
        {
          "name": "Brave",
          "desc": "You have advantage on saving throws against being frightened."
        },
        {
          "name": "Halfling Nimbleness",
          "desc": "You can move through the space of any creature that is of a size larger than yours."
        },
        {
          "name": "Languages",
          "desc": "You can speak, read, and write Common and Halfling. The Halfling language isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong. Almost all halflings speak Common to converse with the people in whose lands they dwell or through which they are traveling."
        }
      ]
    },
    {
      "name": "Human",
      "source": "PHB 2014",
      "size": "Medium",
      "speed": 30,
      "abilityBonuses": {},
      "abilityChoices": [],
      "traits": [
        {
          "name": "Age",
          "desc": "Humans reach adulthood in their late teens and live less than a century."
        },
        {
          "name": "Size",
          "desc": "Humans vary widely in height and build, from barely 5 feet to well over 6 feet tall. Regardless of your position in that range, your size is Medium."
        },
        {
          "name": "Languages",
          "desc": "You can speak, read, and write Common and one extra language of your choice. Humans typically learn the languages of other peoples they deal with, including obscure dialects. They are fond of sprinkling their speech with words borrowed from other tongues: Orc curses, Elvish musical expressions, Dwarvish military phrases, and so on."
        }
      ]
    },
    {
      "name": "Tiefling",
      "source": "PHB 2014",
      "size": "Medium",
      "speed": 30,
      "abilityBonuses": {
        "cha": 2,
        "int": 1
      },
      "abilityChoices": [],
      "traits": [
        {
          "name": "Age",
          "desc": "Tieflings mature at the same rate as humans but live a few years longer."
        },
        {
          "name": "Size",
          "desc": "Tieflings are about the same size and build as humans. Your size is Medium."
        },
        {
          "name": "Darkvision",
          "desc": "Thanks to your infernal heritage, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
        },
        {
          "name": "Hellish Resistance",
          "desc": "You have resistance to fire damage."
        },
        {
          "name": "Infernal Legacy",
          "desc": "You know the thaumaturgy cantrip. Once you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell with this trait; you regain the ability to cast it when you finish a long rest. Once you reach 5th level, you can also cast the darkness spell once per day with this trait; you regain the ability to cast it when you finish a long rest. Charisma is your spellcasting ability for these spells."
        },
        {
          "name": "Languages",
          "desc": "You can speak, read, and write Common and Infernal."
        }
      ]
    }
  ],
  "races_mpmm": [
    {
      "name": "Aarakocra",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Flight",
          "desc": "Because of your wings, you have a flying speed equal to your walking speed. You can't use this flying speed if you're wearing medium or heavy armor."
        },
        {
          "name": "Talons",
          "desc": "You have talons that you can use to make unarmed strikes. When you hit with them, the strike deals 1d6 + your Strength modifier slashing damage, instead of the bludgeoning damage normal for an unarmed strike."
        },
        {
          "name": "Wind Caller",
          "desc": "Starting at 3rd level, you can cast the gust of wind spell with this trait, without requiring a material component. Once you cast the spell with this trait, you can't do so again until you finish a long rest. You can also cast the spell using any spell slots you have of 2nd level or higher.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for when you cast gust of wind with this trait (choose when you select this race)."
        }
      ]
    },
    {
      "name": "Aasimar",
      "source": "Mordenkainen's Multiverse",
      "size": "Small/Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Size",
          "desc": "You are Medium or Small. You choose the size when you select this race."
        },
        {
          "name": "Celestial Resistance",
          "desc": "You have resistance to necrotic damage and radiant damage."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Healing Hands",
          "desc": "As an action, you can touch a creature and roll a number of d4s equal to your proficiency bonus. The creature regains a number of hit points equal to the total rolled. Once you use this trait, you can't use it again until you finish a long rest."
        },
        {
          "name": "Light Bearer",
          "desc": "You know the light cantrip. Charisma is your spellcasting ability for it."
        },
        {
          "name": "Celestial Revelation",
          "desc": "When you reach 3rd level, choose one of the revelation options below. Thereafter, you can use a bonus action to unleash the celestial energy within yourself, gaining the benefits of that revelation. Your transformation lasts for 1 minute or until you end it as a bonus action. Once you transform using your revelation below, you can't use it again until you finish a long rest.\n\n• **Necrotic Shroud.** Your eyes briefly become pools of darkness, and ghostly, flightless wings sprout from your back temporarily. Creatures other than your allies within 10 feet of you that can see you must succeed on a Charisma saving throw (8 + your proficiency bonus + your Charisma modifier) or become frightened of you until the end of your next turn. Until the transformation ends, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your proficiency bonus.\n• **Radiant Consumption.** Searing light temporarily radiates from your eyes and mouth. For the duration, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, each creature within 10 feet of you takes radiant damage equal to your proficiency bonus. Until the transformation ends, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your proficiency bonus.\n• **Radiant Soul.** Two luminous, spectral wings sprout from your back temporarily. Until the transformation ends, you have a flying speed equal to your walking speed, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your proficiency bonus."
        }
      ]
    },
    {
      "name": "Bugbear",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Humanoid. You are also considered a goblinoid for any prerequisite or effect that requires you to be a goblinoid."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Fey Ancestry",
          "desc": "You have advantage on saving throws you make to avoid or end the charmed condition on yourself."
        },
        {
          "name": "Long-Limbed",
          "desc": "When you make a melee attack on your turn, your reach for it is 5 feet greater than normal."
        },
        {
          "name": "Powerful Build",
          "desc": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
        },
        {
          "name": "Sneaky",
          "desc": "You are proficient in the Stealth skill. In addition, without squeezing, you can move through and stop in a space large enough for a Small creature."
        },
        {
          "name": "Surprise Attack",
          "desc": "If you hit a creature with an attack roll, the creature takes an extra 2d6 damage if it hasn't taken a turn yet in the current combat."
        }
      ]
    },
    {
      "name": "Centaur",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 40,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Fey."
        },
        {
          "name": "Charge",
          "desc": "If you move at least 30 feet straight toward a target and then hit it with a melee weapon attack on the same turn, you can immediately follow that attack with a bonus action, making one attack against the target with your hooves."
        },
        {
          "name": "Equine Build",
          "desc": "You count as one size larger when determining your carrying capacity and the weight you can push or drag.\n\nIn addition, any climb that requires hands and feet is especially difficult for you because of your equine legs. When you make such a climb, each foot of movement costs you 4 extra feet instead of the normal 1 extra foot."
        },
        {
          "name": "Hooves",
          "desc": "You have hooves that you can use to make unarmed strikes. When you hit with them, the strike deals 1d6 + your Strength modifier bludgeoning damage, instead of the bludgeoning damage normal for an unarmed strike."
        },
        {
          "name": "Natural Affinity",
          "desc": "Your fey connection to nature gives you an intuitive connection to the natural world and the animals within it. You therefore have proficiency in one of the following skills of your choice: Animal Handling, Medicine, Nature, or Survival."
        }
      ]
    },
    {
      "name": "Changeling",
      "source": "Mordenkainen's Multiverse",
      "size": "Small/Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Fey."
        },
        {
          "name": "Size",
          "desc": "You are Medium or Small. You choose the size when you select this race."
        },
        {
          "name": "Changeling Instincts",
          "desc": "Thanks to your connection to the fey realm, you gain proficiency with two of the following skills of your choice: Deception, Insight, Intimidation, Performance, or Persuasion."
        },
        {
          "name": "Shapechanger",
          "desc": "As an action, you change your appearance and your voice. You determine the specifics of the changes, including your coloration, hair length, and sex. You can also adjust your height between Medium and Small. You can make yourself appear as a member of another race, though none of your game statistics change. You can't duplicate the appearance of an individual you've never seen, and you must adopt a form that has the same basic arrangement of limbs that you have. Your clothing and equipment aren't changed by this trait.\n\nYou stay in the new form until you use an action to revert to your true form or until you die."
        }
      ]
    },
    {
      "name": "Deep Gnome",
      "source": "Mordenkainen's Multiverse",
      "size": "Small",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Humanoid. You are also considered a gnome for any prerequisite or effect that requires you to be a gnome."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 120 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Gift of the Svirfneblin",
          "desc": "Starting at 3rd level, you can cast the disguise self spell with this trait. Starting at 5th level, you can also cast the nondetection spell with it, without requiring a material component. Once you cast either of these spells with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast these using spell slots you have of the appropriate level.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race)."
        },
        {
          "name": "Gnomish Magic Resistance",
          "desc": "You have advantage on Intelligence, Wisdom, and Charisma saving throws against spells."
        },
        {
          "name": "Svirfneblin Camouflage",
          "desc": "When you make a Dexterity (Stealth) check, you can make the check with advantage. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
        }
      ]
    },
    {
      "name": "Duergar",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Humanoid. You are also considered a dwarf for any prerequisite or effect that requires you to be a dwarf."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 120 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Duergar Magic",
          "desc": "Starting at 3rd level, you can cast the enlarge/reduce spell on yourself with this trait, without requiring a material component. Starting at 5th level, you can also cast the invisibility spell on yourself with this trait, without requiring a material component. Once you cast either of these spells with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast these spells using spell slots you have of the appropriate level.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race)."
        },
        {
          "name": "Dwarven Resilience",
          "desc": "You have advantage on saving throws you make to avoid or end the poisoned condition on yourself. You also have resistance to poison damage."
        },
        {
          "name": "Psionic Fortitude",
          "desc": "You have advantage on saving throws you make to avoid or end the charmed or stunned condition on yourself."
        }
      ]
    },
    {
      "name": "Eladrin",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Humanoid. You are also considered an elf for any prerequisite or effect that requires you to be an elf."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Fey Ancestry",
          "desc": "You have advantage on saving throws you make to avoid or end the charmed condition on yourself."
        },
        {
          "name": "Fey Step",
          "desc": "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.\n\nWhen you reach 3rd level, your Fey Step gain an additional effect based on your season; if the effect requires a saving throw, the DC equals 8 + your proficiency bonus + your Intelligence, Wisdom, or Charisma modifier (choose when you select this race):\n\n• **Autumn.** Immediately after you use your Fey Step, up to two creatures of your choice that you can see within 10 feet of you must succeed on a Wisdom saving throw or be charmed by you for 1 minute, or until you or your companions deal any damage to the creatures.\n• **Winter.** When you use your Fey Step, one creature of your choice that you can see within 5 feet of you before you teleport must succeed on a Wisdom saving throw or be frightened of you until the end of your next turn.\n• **Spring.** When you use your Fey Step, you can touch one willing creature within 5 feet of you. That creature then teleports instead of you, appearing in an unoccupied space of your choice that you can see within 30 feet of you.\n• **Summer.** Immediately after you use your Fey Step, each creature of your choice that you can see within 5 feet of you takes fire damage equal to your proficiency bonus."
        },
        {
          "name": "Keen Senses",
          "desc": "You have proficiency in the Perception skill."
        },
        {
          "name": "Trance",
          "desc": "You don't need to sleep, and magic can't put you to sleep. You can finish a long rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness.\n\nWhenever you finish this trance, you can change your season, and you can gain two proficiencies that you don't have, each one with a weapon or a tool of your choice selected from the Player's Handbook. You mystically acquire these proficiencies by drawing them from shared elven memory, and you retain them until you finish your next long rest."
        }
      ]
    },
    {
      "name": "Fairy",
      "source": "Mordenkainen's Multiverse",
      "size": "Small",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Fey."
        },
        {
          "name": "Fairy Magic",
          "desc": "You know the druidcraft cantrip. Starting at 3rd level, you can cast the faerie fire spell with this trait. Starting at 5th level, you can also cast the enlarge/reduce spell with this trait. Once you cast faerie fire or enlarge/reduce with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast either of those spells using any spell slots you have of the appropriate level.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race)."
        },
        {
          "name": "Flight",
          "desc": "Because of your wings, you have a flying speed equal to your walking speed. You can't use this flying speed if you're wearing medium or heavy armor."
        }
      ]
    },
    {
      "name": "Firbolg",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Firbolg Magic",
          "desc": "You can cast detect magic and disguise self spells with this trait. When you use this version of disguise self, you can seem up to 3 feet shorter or taller. Once you cast either of these spells with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast these spells using any spell slots you have.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race)."
        },
        {
          "name": "Hidden Step",
          "desc": "As a bonus action, you can magically turn invisible until the start of your next turn or until you attack, make a damage roll, or force someone to make a saving throw. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
        },
        {
          "name": "Powerful Build",
          "desc": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
        },
        {
          "name": "Speech of Beast and Leaf",
          "desc": "You have the ability to communicate in a limited manner with Beasts, Plants, and vegetation. They can understand the meaning of your words, though you have no special ability to understand them in return. You have advantage on all Charisma checks you make to influence them."
        }
      ]
    },
    {
      "name": "Genasi",
      "source": "Mordenkainen's Multiverse",
      "size": "Small/Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Size",
          "desc": "You are Medium or Small. You choose the size when you select this race."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        }
      ]
    },
    {
      "name": "Githyanki",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Astral Knowledge",
          "desc": "You can mystically access a reservoir of experiences of entities connected to the Astral Plane. Whenever you finish a long rest, you gain proficiency in one skill of your choice and with one weapon or tool of your choice, selected from the Player's Handbook, as you momentarily project your consciousness into the Astral Plane. These proficiencies last until the end of your next long rest."
        },
        {
          "name": "Githyanki Psionics",
          "desc": "You know the mage hand cantrip, and the hand is invisible when you cast the cantrip with this trait.\n\nStarting at 3rd level, you can cast the jump spell with this trait. Starting at 5th level, you can also cast misty step with it. Once you cast jump or misty step with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast either of those spells using any spell slots you have of the appropriate level.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race). None of these spells require spell components when you cast them with this trait."
        },
        {
          "name": "Psychic Resilience",
          "desc": "You have resistance to psychic damage."
        }
      ]
    },
    {
      "name": "Githzerai",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Githzerai Psionics",
          "desc": "You know the mage hand cantrip, and the hand is invisible when you cast the cantrip with this trait.\n\nStarting at 3rd level, you can cast the shield spell with this trait. Starting at 5th level, you can also cast the detect thoughts spell with it. Once you cast shield or detect thoughts spell with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast either of those spells using any spell slots you have of the appropriate level.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race). None of these spells require spell components when you cast them with this trait."
        },
        {
          "name": "Mental Discipline",
          "desc": "Your innate psychic defenses grant you advantage on saving throws you make to avoid or end the charmed and frightened conditions on yourself."
        },
        {
          "name": "Psychic Resilience",
          "desc": "You have resistance to psychic damage."
        }
      ]
    },
    {
      "name": "Goblin",
      "source": "Mordenkainen's Multiverse",
      "size": "Small",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Humanoid. You are also considered a goblinoid for any prerequisite or effect that requires you to be a goblinoid."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were in dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Fey Ancestry",
          "desc": "You have advantage on saving throws you make to avoid or end the charmed condition on yourself."
        },
        {
          "name": "Fury of the Small",
          "desc": "When you damage a creature with an attack or a spell and the creature's size is larger than yours, you can cause the attack or spell to deal extra damage to the creature. The extra damage equals your proficiency bonus.\n\nYou can use this trait a number of times equal to your proficiency bonus, regaining all expended uses when you finish a long rest, and you can use it no more than once per turn."
        },
        {
          "name": "Nimble Escape",
          "desc": "You can take the Disengage or Hide action as a bonus action on each of your turns."
        }
      ]
    },
    {
      "name": "Goliath",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Little Giant",
          "desc": "You have proficiency in the Athletics skill, and you count as one size larger when determining your carrying weight and the weight you can push, drag, or lift."
        },
        {
          "name": "Mountain Born",
          "desc": "You have resistance to cold damage. You also naturally acclimate to high altitudes, even if you've never been to one. This includes elevations above 20,000 feet."
        },
        {
          "name": "Stone's Endurance",
          "desc": "You can supernaturally draw on unyielding stone to shrug off harm. When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled and reduce the damage by that total.\n\nYou can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
        }
      ]
    },
    {
      "name": "Harengon",
      "source": "Mordenkainen's Multiverse",
      "size": "Small/Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Size",
          "desc": "You are Medium or Small. You choose the size when you select this race."
        },
        {
          "name": "Hare-Trigger",
          "desc": "You can add your proficiency bonus to your initiative rolls."
        },
        {
          "name": "Leporine Senses",
          "desc": "You have proficiency in the Perception skill."
        },
        {
          "name": "Lucky Footwork",
          "desc": "When you fail a Dexterity saving throw, you can use your reaction to roll a d4 and add it to the save, potentially turning the failure into a success. You can't use this reaction if you're prone or your speed is 0."
        },
        {
          "name": "Rabbit Hop",
          "desc": "As a bonus action, you can jump a number of feet equal to five times your proficiency bonus, without provoking opportunity attacks. You can use this trait only if your speed is greater than 0. You can use it a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
        }
      ]
    },
    {
      "name": "Hobgoblin",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Humanoid. You are also considered a goblinoid for any prerequisite or effect that requires you to be a goblinoid."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Fey Ancestry",
          "desc": "You have advantage on saving throws you make to avoid or end the charmed condition on yourself."
        },
        {
          "name": "Fey Gift",
          "desc": "You can use this trait to take the Help action as a bonus action, and you can do so a number of times equal to your proficiency bonus. You regain all expended uses when you finish a long rest.\n\nStarting at 3rd level, choose one of the options below each time you take the Help action with this trait:\n\n• **Hospitality.** You and the creature you help each gain a number of temporary hit points equal to 1d6 plus your proficiency bonus.\n• **Passage.** You and the creature you help each increase your walking speeds by 10 feet until the start of your next turn.\n• **Spite.** Until the start of your next turn, the first time the creature you help hits a target with an attack roll, that target has disadvantage on the next attack roll it makes within the next minute."
        },
        {
          "name": "Fortune from the Many",
          "desc": "If you miss with an attack roll or fail an ability check or a saving throw, you can draw on your bonds of reciprocity to gain a bonus to the roll equal to the number of allies you can see within 30 feet of you (maximum bonus of +3). You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
        }
      ]
    },
    {
      "name": "Kenku",
      "source": "Mordenkainen's Multiverse",
      "size": "Small/Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Size",
          "desc": "Your size is Medium or Small. You choose the size when you select this race."
        },
        {
          "name": "Expert Duplication",
          "desc": "When you copy writing or craftwork produced by yourself or someone else, you have advantage on any ability checks you make to produce an exact duplicate."
        },
        {
          "name": "Kenku Recall",
          "desc": "Thanks to your supernaturally good memory, you have proficiency in two skills of your choice.\n\nMoreover, when you make an ability check using any skill in which you have proficiency, you can give yourself advantage on the check before rolling the d20. You can give yourself advantage in this way a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
        },
        {
          "name": "Mimicry",
          "desc": "You can accurately mimic sounds you have heard, including voices. A creature that hears the sounds you make can tell they are imitations only with a successful Wisdom (Insight) check against a DC of 8 + your proficiency bonus + your Charisma modifier."
        }
      ]
    },
    {
      "name": "Kobold",
      "source": "Mordenkainen's Multiverse",
      "size": "Small",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were in dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Draconic Cry",
          "desc": "As a bonus action, you let out a cry at your enemies within 10 feet of you. Until the start of your next turn, you and your allies have advantage on attack rolls against any of those enemies who could hear you. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
        },
        {
          "name": "Kobold Legacy",
          "desc": "Kobold's connections to dragons can manifest in unpredictable ways in an individual kobold. Choose one of the following legacy options for your kobold.\n\n• **Craftiness.** You have proficiency in one of the following skills of your choice: Arcana, Investigation, Medicine, Sleight of Hand, or Survival.\n• **Defiance.** You have advantage on saving throws to avoid or end the frightened condition on yourself.\n• **Draconic Sorcery.** You know one cantrip of your choice from the sorcerer spell list. Intelligence, Wisdom, or Charisma is your spellcasting ability for that cantrip (choose when you select this race)."
        }
      ]
    },
    {
      "name": "Lizardfolk",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Speed",
          "desc": "Your walking speed is 30 feet, and you have a swimming speed equal to your walking speed."
        },
        {
          "name": "Bite",
          "desc": "You have a fanged maw that you can use to make unarmed strikes. When you hit with it, the strike deals 1d6 + your Strength modifier slashing damage, instead of the bludgeoning damage normal for an unarmed strike."
        },
        {
          "name": "Hold Breath",
          "desc": "You can hold your breath for up to 15 minutes at a time."
        },
        {
          "name": "Hungry Jaws",
          "desc": "You can throw yourself into a feeding frenzy. As a bonus action, you can make a special attack with your Bite. If the attack hits, it deals its normal damage, and you gain temporary hit points equal to your proficiency bonus. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
        },
        {
          "name": "Natural Armor",
          "desc": "You have tough, scaly skin. When you aren't wearing armor, your base AC is 13 + Dexterity modifier. You can use your natural armor to determine your AC if the armor you wear would leave you with a lower AC. A shield's benefits apply as normal while you use your natural armor."
        },
        {
          "name": "Nature's Intuition",
          "desc": "Thanks to your mystical connection to nature, you gain proficiency with two of the following skills of your choice: Animal Handling, Medicine, Nature, Perception, Stealth, or Survival."
        }
      ]
    },
    {
      "name": "Minotaur",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Horns",
          "desc": "You have horns that you can use to make unarmed strikes. When you hit with them, the strike deals 1d6 + your Strength modifier piercing damage, instead of the bludgeoning damage normal for an unarmed strike."
        },
        {
          "name": "Goring Rush",
          "desc": "Immediately after you take the Dash action on your turn and move at least 20 feet, you can make one melee attack with your Horns as a bonus action."
        },
        {
          "name": "Hammering Horns",
          "desc": "Immediately after you hit a creature with a melee attack as part of the Attack action on your turn, you can use a bonus action to attempt to push that target with your horns. The target must be within 5 feet of you and no more than one size larger than you. Unless it succeeds on a Strength saving throw against a DC equal to 8 + your proficiency bonus + your Strength modifier, you can push it up to 10 feet away from you."
        },
        {
          "name": "Labyrinthine Recall",
          "desc": "You always know which direction is north, and you have advantage on any Wisdom (Survival) check you make to navigate or track."
        }
      ]
    },
    {
      "name": "Orc",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Adrenaline Rush",
          "desc": "You can take the Dash action as a bonus action. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.\n\nWhenever you use this trait, you gain a number of temporary hit points equal to your proficiency bonus."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Powerful Build",
          "desc": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
        },
        {
          "name": "Relentless Endurance",
          "desc": "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. Once you use this trait, you can't do so again until you finish a long rest."
        }
      ]
    },
    {
      "name": "Satyr",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 35,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Fey."
        },
        {
          "name": "Ram",
          "desc": "You can use your head and horns to make unarmed strikes. When you hit with them, the strike deals 1d6 + your Strength modifier bludgeoning damage, instead of the bludgeoning damage normal for an unarmed strike."
        },
        {
          "name": "Magic Resistance",
          "desc": "You have advantage on saving throws against spells."
        },
        {
          "name": "Mirthful Leaps",
          "desc": "Whenever you make a long jump or a high jump, you can roll a d8 and add the number rolled to the number of feet you cover, even when making a standing jump. This extra distance costs movement as usual."
        },
        {
          "name": "Reveler",
          "desc": "As an embodiment of revelry, you have proficiency in the Performance and Persuasion skills, and you have proficiency with one musical instrument of your choice."
        }
      ]
    },
    {
      "name": "Sea Elf",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Humanoid. You are also considered an elf for any prerequisite or effect that requires you to be an elf."
        },
        {
          "name": "Speed",
          "desc": "Your walking speed is 30 feet, and you have a swimming speed equal to your walking speed."
        },
        {
          "name": "Child of the Sea",
          "desc": "You can breathe air and water, and you have resistance to cold damage."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Fey Ancestry",
          "desc": "You have advantage on saving throws you make to avoid or end the charmed condition on yourself."
        },
        {
          "name": "Friend of the Sea",
          "desc": "Aquatic animals have an extraordinary affinity with your people. You can communicate simple ideas to any Beast that has a swimming speed. It can understand your words, though you have no special ability to understand it in return."
        },
        {
          "name": "Keen Senses",
          "desc": "You have proficiency in the Perception skill."
        },
        {
          "name": "Trance",
          "desc": "You don't need to sleep, and magic can't put you to sleep. You can finish a long rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness.\n\nWhenever you finish this trance, you can gain two proficiencies that you don't have, each one with a weapon or a tool of your choice selected from the Player's Handbook. You mystically acquire these proficiencies by drawing them from shared elven memory, and you retain them until you finish your next long rest."
        }
      ]
    },
    {
      "name": "Shadar-Kai",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Creature Type",
          "desc": "You are a Humanoid. You are also considered an elf for any prerequisite or effect that requires you to be an elf."
        },
        {
          "name": "Blessing of the Raven Queen",
          "desc": "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.\n\nStarting at 3rd level, you also gain resistance to all damage when you teleport using this trait. The resistance lasts until the start of your next turn. During that time, you appear ghostly and translucent."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Fey Ancestry",
          "desc": "You have advantage on saving throws you make to avoid or end the charmed condition on yourself."
        },
        {
          "name": "Keen Senses",
          "desc": "You have proficiency in the Perception skill."
        },
        {
          "name": "Necrotic Resistance",
          "desc": "You have resistance to necrotic damage."
        },
        {
          "name": "Trance",
          "desc": "You don't need to sleep, and magic can't put you to sleep. You can finish a long rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness.\n\nWhenever you finish this trance, you can gain two proficiencies that you don't have, each one with a weapon or a tool of your choice selected from the Player's Handbook. You mystically acquire these proficiencies by drawing them from shared elven memory, and you retain them until you finish your next long rest."
        }
      ]
    },
    {
      "name": "Shifter",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Bestial Instincts",
          "desc": "Channeling the beast within, you have proficiency in one of the following skills of your choice: Acrobatics, Athletics, Intimidation, or Survival."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were in dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Shifting",
          "desc": "As a bonus action, you can assume a more bestial appearance. This transformation lasts for 1 minute, until you die, or until you revert to your normal appearance as a bonus action. When you shift, you gain temporary hit points equal to 2 × your proficiency bonus. You can shift a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.\n\nWhenever you shift, you gain an additional benefit based on one of the following options (choose when you select this race):\n\n• **Beasthide.** You gain 1d6 additional temporary hit points. While shifted, you have a +1 bonus to your Armor Class.\n• **Longtooth.** When you shift and as a bonus action on your other turns while shifted, you can use your elongated fangs to make an unarmed strike. If you hit with your fangs, you can deal piercing damage equal to 1d6 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.\n• **Swiftstride.** While shifted, your walking speed increases by 10 feet. Additionally, you can move up to 10 feet as a reaction when a creature ends its turn within 5 feet of you. This reactive movement doesn't provoke opportunity attacks.\n• **Wildhunt.** While shifted, you have advantage on Wisdom checks, and no creature within 30 feet of you can make an attack roll with advantage against you unless you're incapacitated."
        }
      ]
    },
    {
      "name": "Tabaxi",
      "source": "Mordenkainen's Multiverse",
      "size": "Small/Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Size",
          "desc": "You are Medium or Small. You choose the size when you select this race."
        },
        {
          "name": "Speed",
          "desc": "Your walking speed is 30 feet, and you have a climbing speed equal to your walking speed."
        },
        {
          "name": "Cat's Claws",
          "desc": "You can use your claws to make unarmed strikes. When you hit with them, the strike deals 1d6 + your Strength modifier slashing damage, instead of the bludgeoning damage normal for an unarmed strike."
        },
        {
          "name": "Cat's Talent",
          "desc": "You have proficiency in the Perception and Stealth skills."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Feline Agility",
          "desc": "Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can't use it again until you move 0 feet on one of your turns."
        }
      ]
    },
    {
      "name": "Tortle",
      "source": "Mordenkainen's Multiverse",
      "size": "Small/Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Size",
          "desc": "You are Medium or Small. You choose the size when you select this race."
        },
        {
          "name": "Claws",
          "desc": "You have claws that you can use to make unarmed strikes. When you hit with them, the strike deals 1d6 + your Strength modifier slashing damage, instead of the bludgeoning damage normal for an unarmed strike."
        },
        {
          "name": "Hold Breath",
          "desc": "You can hold your breath for up to 1 hour."
        },
        {
          "name": "Natural Armor",
          "desc": "Your shell provides you a base AC of 17 (your Dexterity modifier doesn't affect this number). You can't wear light, medium, or heavy armor, but if you are using a shield, you can apply the shield's bonus as normal."
        },
        {
          "name": "Nature's Intuition",
          "desc": "Thanks to your mystical connection to nature, you gain proficiency with one of the following skills of your choice: Animal Handling, Medicine, Nature, Perception, Stealth, or Survival."
        },
        {
          "name": "Shell Defense",
          "desc": "You can withdraw into your shell as an action. Until you emerge, you gain a +4 bonus to your AC, and you have advantage on Strength and Constitution saving throws. While in your shell, you are prone, your speed is 0 and can't increase, you have disadvantage on Dexterity saving throws, you can't take reactions, and the only action you can take is a bonus action to emerge from your shell."
        }
      ]
    },
    {
      "name": "Triton",
      "source": "Mordenkainen's Multiverse",
      "size": "Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Speed",
          "desc": "Your walking speed is 30 feet, and you have a swimming speed equal to your walking speed."
        },
        {
          "name": "Amphibious",
          "desc": "You can breathe air and water."
        },
        {
          "name": "Control Air and Water",
          "desc": "You can cast fog cloud with this trait. Starting at 3rd level, you can cast the gust of wind spell with this trait. Starting at 5th level, you can also cast the water walk spell with it. Once you cast any of these spells with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast these spells using any spell slots you have of the appropriate level.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race)."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Emissary of the Sea",
          "desc": "You can communicate simple ideas to any Beast, Elemental, or Monstrosity that has a swimming speed. It can understand your words, though you have no special ability to understand it in return."
        },
        {
          "name": "Guardian of the Depths",
          "desc": "Adapted to the frigid ocean depths, you have resistance to cold damage."
        }
      ]
    },
    {
      "name": "Yuan-Ti",
      "source": "Mordenkainen's Multiverse",
      "size": "Small/Medium",
      "speed": 30,
      "abilityNote": "Choose +2 to one ability and +1 to another (any)",
      "traits": [
        {
          "name": "Size",
          "desc": "You are Medium or Small. You choose the size when you select this race."
        },
        {
          "name": "Darkvision",
          "desc": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."
        },
        {
          "name": "Magic Resistance",
          "desc": "You have advantage on saving throws against spells."
        },
        {
          "name": "Poison Resilience",
          "desc": "You have advantage on saving throws you make to avoid or end the poisoned condition on yourself. You also have resistance to poison damage."
        },
        {
          "name": "Serpentine Spellcasting",
          "desc": "You know the poison spray cantrip. You can cast animal friendship an unlimited number of times with this trait, but you can target only snakes with it. Starting at 3rd level, you can also cast suggestion with this trait. Once you cast it, you can't do so again until you finish a long rest. You can also cast it using any spell slots you have of 2nd level or higher.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for these spells when you cast them with this trait (choose when you select this race)."
        }
      ]
    }
  ],
  "backgrounds_2024": [
    {
      "name": "Acolyte",
      "source": "PHB 2024",
      "abilityGroup": [
        "int",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Intelligence",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Insight",
        "Religion"
      ],
      "tools": [
        "Calligrapher's Supplies"
      ],
      "feat": "Magic Initiate (Cleric)",
      "desc": "+2/+1 to Intelligence, Wisdom or Charisma. Skills: Insight, Religion. Magic Initiate (Cleric)"
    },
    {
      "name": "Artisan",
      "source": "PHB 2024",
      "abilityGroup": [
        "str",
        "dex",
        "int"
      ],
      "abilityGroupNames": [
        "Strength",
        "Dexterity",
        "Intelligence"
      ],
      "skills": [
        "Investigation",
        "Persuasion"
      ],
      "tools": [
        "Any Artisan's Tools"
      ],
      "feat": "Crafter",
      "desc": "+2/+1 to Strength, Dexterity or Intelligence. Skills: Investigation, Persuasion. Crafter"
    },
    {
      "name": "Charlatan",
      "source": "PHB 2024",
      "abilityGroup": [
        "dex",
        "con",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Constitution",
        "Charisma"
      ],
      "skills": [
        "Deception",
        "Sleight of Hand"
      ],
      "tools": [
        "Forgery Kit"
      ],
      "feat": "Skilled",
      "desc": "+2/+1 to Dexterity, Constitution or Charisma. Skills: Deception, Sleight of Hand. Skilled"
    },
    {
      "name": "Criminal",
      "source": "PHB 2024",
      "abilityGroup": [
        "dex",
        "con",
        "int"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Constitution",
        "Intelligence"
      ],
      "skills": [
        "Sleight of Hand",
        "Stealth"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "feat": "Alert",
      "desc": "+2/+1 to Dexterity, Constitution or Intelligence. Skills: Sleight of Hand, Stealth. Alert"
    },
    {
      "name": "Entertainer",
      "source": "PHB 2024",
      "abilityGroup": [
        "str",
        "dex",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Dexterity",
        "Charisma"
      ],
      "skills": [
        "Acrobatics",
        "Performance"
      ],
      "tools": [
        "Any Musical Instrument"
      ],
      "feat": "Musician",
      "desc": "+2/+1 to Strength, Dexterity or Charisma. Skills: Acrobatics, Performance. Musician"
    },
    {
      "name": "Farmer",
      "source": "PHB 2024",
      "abilityGroup": [
        "str",
        "con",
        "wis"
      ],
      "abilityGroupNames": [
        "Strength",
        "Constitution",
        "Wisdom"
      ],
      "skills": [
        "Animal Handling",
        "Nature"
      ],
      "tools": [
        "Carpenter's Tools"
      ],
      "feat": "Tough",
      "desc": "+2/+1 to Strength, Constitution or Wisdom. Skills: Animal Handling, Nature. Tough"
    },
    {
      "name": "Guard",
      "source": "PHB 2024",
      "abilityGroup": [
        "str",
        "int",
        "wis"
      ],
      "abilityGroupNames": [
        "Strength",
        "Intelligence",
        "Wisdom"
      ],
      "skills": [
        "Athletics",
        "Perception"
      ],
      "tools": [
        "Any Gaming Set"
      ],
      "feat": "Alert",
      "desc": "+2/+1 to Strength, Intelligence or Wisdom. Skills: Athletics, Perception. Alert"
    },
    {
      "name": "Guide",
      "source": "PHB 2024",
      "abilityGroup": [
        "dex",
        "con",
        "wis"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Constitution",
        "Wisdom"
      ],
      "skills": [
        "Stealth",
        "Survival"
      ],
      "tools": [
        "Cartographer's Tools"
      ],
      "feat": "Magic Initiate (Druid)",
      "desc": "+2/+1 to Dexterity, Constitution or Wisdom. Skills: Stealth, Survival. Magic Initiate (Druid)"
    },
    {
      "name": "Hermit",
      "source": "PHB 2024",
      "abilityGroup": [
        "con",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Constitution",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Medicine",
        "Religion"
      ],
      "tools": [
        "Herbalism Kit"
      ],
      "feat": "Healer",
      "desc": "+2/+1 to Constitution, Wisdom or Charisma. Skills: Medicine, Religion. Healer"
    },
    {
      "name": "Merchant",
      "source": "PHB 2024",
      "abilityGroup": [
        "con",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Constitution",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Animal Handling",
        "Persuasion"
      ],
      "tools": [
        "Navigator's Tools"
      ],
      "feat": "Lucky",
      "desc": "+2/+1 to Constitution, Intelligence or Charisma. Skills: Animal Handling, Persuasion. Lucky"
    },
    {
      "name": "Noble",
      "source": "PHB 2024",
      "abilityGroup": [
        "str",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "History",
        "Persuasion"
      ],
      "tools": [
        "Any Gaming Set"
      ],
      "feat": "Skilled",
      "desc": "+2/+1 to Strength, Intelligence or Charisma. Skills: History, Persuasion. Skilled"
    },
    {
      "name": "Sage",
      "source": "PHB 2024",
      "abilityGroup": [
        "con",
        "int",
        "wis"
      ],
      "abilityGroupNames": [
        "Constitution",
        "Intelligence",
        "Wisdom"
      ],
      "skills": [
        "Arcana",
        "History"
      ],
      "tools": [
        "Calligrapher's Supplies"
      ],
      "feat": "Magic Initiate (Wizard)",
      "desc": "+2/+1 to Constitution, Intelligence or Wisdom. Skills: Arcana, History. Magic Initiate (Wizard)"
    },
    {
      "name": "Sailor",
      "source": "PHB 2024",
      "abilityGroup": [
        "str",
        "dex",
        "wis"
      ],
      "abilityGroupNames": [
        "Strength",
        "Dexterity",
        "Wisdom"
      ],
      "skills": [
        "Acrobatics",
        "Perception"
      ],
      "tools": [
        "Navigator's Tools"
      ],
      "feat": "Tavern Brawler",
      "desc": "+2/+1 to Strength, Dexterity or Wisdom. Skills: Acrobatics, Perception. Tavern Brawler"
    },
    {
      "name": "Scribe",
      "source": "PHB 2024",
      "abilityGroup": [
        "dex",
        "int",
        "wis"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Intelligence",
        "Wisdom"
      ],
      "skills": [
        "Investigation",
        "Perception"
      ],
      "tools": [
        "Calligrapher's Supplies"
      ],
      "feat": "Skilled",
      "desc": "+2/+1 to Dexterity, Intelligence or Wisdom. Skills: Investigation, Perception. Skilled"
    },
    {
      "name": "Soldier",
      "source": "PHB 2024",
      "abilityGroup": [
        "str",
        "dex",
        "con"
      ],
      "abilityGroupNames": [
        "Strength",
        "Dexterity",
        "Constitution"
      ],
      "skills": [
        "Athletics",
        "Intimidation"
      ],
      "tools": [
        "Any Gaming Set"
      ],
      "feat": "Savage Attacker",
      "desc": "+2/+1 to Strength, Dexterity or Constitution. Skills: Athletics, Intimidation. Savage Attacker"
    },
    {
      "name": "Wayfarer",
      "source": "PHB 2024",
      "abilityGroup": [
        "dex",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Insight",
        "Stealth"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "feat": "Lucky",
      "desc": "+2/+1 to Dexterity, Wisdom or Charisma. Skills: Insight, Stealth. Lucky"
    },
    {
      "name": "Aberrant Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "str",
        "con",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Constitution",
        "Charisma"
      ],
      "skills": [
        "History",
        "Intimidation"
      ],
      "tools": [
        "Disguise Kit"
      ],
      "feat": "Aberrant Dragonmark",
      "desc": "+2/+1 to Strength, Constitution or Charisma. Skills: History, Intimidation. Aberrant Dragonmark"
    },
    {
      "name": "Archaeologist",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "dex",
        "int",
        "wis"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Intelligence",
        "Wisdom"
      ],
      "skills": [
        "History",
        "Survival"
      ],
      "tools": [
        "Cartographer's Tools"
      ],
      "feat": "Skilled",
      "desc": "+2/+1 to Dexterity, Intelligence or Wisdom. Skills: History, Survival. Skilled"
    },
    {
      "name": "Carouser",
      "source": "Astarion's Book of Hungers",
      "abilityGroup": [
        "dex",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Deception",
        "Persuasion"
      ],
      "tools": [
        "Gaming Set"
      ],
      "feat": "Tireless Reveler",
      "desc": "+2/+1 to Dexterity, Intelligence or Charisma. Skills: Deception, Persuasion. Tireless Reveler"
    },
    {
      "name": "Chondathan Freebooter",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "str",
        "dex",
        "wis"
      ],
      "abilityGroupNames": [
        "Strength",
        "Dexterity",
        "Wisdom"
      ],
      "skills": [
        "Athletics",
        "Sleight of Hand"
      ],
      "tools": [
        "Weaver's Tools"
      ],
      "feat": "Skilled",
      "desc": "+2/+1 to Strength, Dexterity or Wisdom. Skills: Athletics, Sleight of Hand. Skilled"
    },
    {
      "name": "Dead Magic Dweller",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "str",
        "con",
        "wis"
      ],
      "abilityGroupNames": [
        "Strength",
        "Constitution",
        "Wisdom"
      ],
      "skills": [
        "Medicine",
        "Survival"
      ],
      "tools": [
        "Leatherworker's Tools"
      ],
      "feat": "Healer",
      "desc": "+2/+1 to Strength, Constitution or Wisdom. Skills: Medicine, Survival. Healer"
    },
    {
      "name": "Dragon Cultist",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "dex",
        "con",
        "int"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Constitution",
        "Intelligence"
      ],
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Calligrapher's Supplies"
      ],
      "feat": "Cult of the Dragon Initiate",
      "desc": "+2/+1 to Dexterity, Constitution or Intelligence. Skills: Deception, Stealth. Cult of the Dragon Initiate"
    },
    {
      "name": "Emerald Enclave Caretaker",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "con",
        "int",
        "wis"
      ],
      "abilityGroupNames": [
        "Constitution",
        "Intelligence",
        "Wisdom"
      ],
      "skills": [
        "Nature",
        "Survival"
      ],
      "tools": [
        "Herbalism Kit"
      ],
      "feat": "Emerald Enclave Fledgling",
      "desc": "+2/+1 to Constitution, Intelligence or Wisdom. Skills: Nature, Survival. Emerald Enclave Fledgling"
    },
    {
      "name": "Flaming Fist Mercenary",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "str",
        "con",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Constitution",
        "Charisma"
      ],
      "skills": [
        "Intimidation",
        "Perception"
      ],
      "tools": [
        "Smith's Tools"
      ],
      "feat": "Tough",
      "desc": "+2/+1 to Strength, Constitution or Charisma. Skills: Intimidation, Perception. Tough"
    },
    {
      "name": "Genie Touched",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "dex",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Perception",
        "Persuasion"
      ],
      "tools": [
        "Glassblower's Tools"
      ],
      "feat": "",
      "desc": "+2/+1 to Dexterity, Wisdom or Charisma. Skills: Perception, Persuasion."
    },
    {
      "name": "Harper",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "dex",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Performance",
        "Sleight of Hand"
      ],
      "tools": [
        "Disguise Kit"
      ],
      "feat": "Harper Agent",
      "desc": "+2/+1 to Dexterity, Intelligence or Charisma. Skills: Performance, Sleight of Hand. Harper Agent"
    },
    {
      "name": "House Agent",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "str",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Investigation",
        "Persuasion"
      ],
      "tools": [],
      "feat": "Lucky",
      "desc": "+2/+1 to Strength, Intelligence or Charisma. Skills: Investigation, Persuasion. Lucky"
    },
    {
      "name": "House Cannith Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "str",
        "dex",
        "int"
      ],
      "abilityGroupNames": [
        "Strength",
        "Dexterity",
        "Intelligence"
      ],
      "skills": [
        "Investigation",
        "Sleight of Hand"
      ],
      "tools": [],
      "feat": "Mark of Making",
      "desc": "+2/+1 to Strength, Dexterity or Intelligence. Skills: Investigation, Sleight of Hand. Mark of Making"
    },
    {
      "name": "House Deneith Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "str",
        "con",
        "wis"
      ],
      "abilityGroupNames": [
        "Strength",
        "Constitution",
        "Wisdom"
      ],
      "skills": [
        "Insight",
        "Perception"
      ],
      "tools": [],
      "feat": "Mark of Sentinel",
      "desc": "+2/+1 to Strength, Constitution or Wisdom. Skills: Insight, Perception. Mark of Sentinel"
    },
    {
      "name": "House Ghallanda Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "dex",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Insight",
        "Persuasion"
      ],
      "tools": [
        "Cook's Utensils"
      ],
      "feat": "Mark of Hospitality",
      "desc": "+2/+1 to Dexterity, Wisdom or Charisma. Skills: Insight, Persuasion. Mark of Hospitality"
    },
    {
      "name": "House Jorasco Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "dex",
        "con",
        "wis"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Constitution",
        "Wisdom"
      ],
      "skills": [
        "Medicine",
        "Stealth"
      ],
      "tools": [
        "Herbalism Kit"
      ],
      "feat": "Mark of Healing",
      "desc": "+2/+1 to Dexterity, Constitution or Wisdom. Skills: Medicine, Stealth. Mark of Healing"
    },
    {
      "name": "House Kundarak Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "str",
        "con",
        "int"
      ],
      "abilityGroupNames": [
        "Strength",
        "Constitution",
        "Intelligence"
      ],
      "skills": [
        "Arcana",
        "Investigation"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "feat": "Mark of Warding",
      "desc": "+2/+1 to Strength, Constitution or Intelligence. Skills: Arcana, Investigation. Mark of Warding"
    },
    {
      "name": "House Lyrandar Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "str",
        "dex",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Dexterity",
        "Charisma"
      ],
      "skills": [
        "Acrobatics",
        "Nature"
      ],
      "tools": [
        "Navigator's Tools"
      ],
      "feat": "Mark of Storm",
      "desc": "+2/+1 to Strength, Dexterity or Charisma. Skills: Acrobatics, Nature. Mark of Storm"
    },
    {
      "name": "House Medani Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "dex",
        "int",
        "wis"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Intelligence",
        "Wisdom"
      ],
      "skills": [
        "Insight",
        "Investigation"
      ],
      "tools": [
        "Disguise Kit"
      ],
      "feat": "Mark of Detection",
      "desc": "+2/+1 to Dexterity, Intelligence or Wisdom. Skills: Insight, Investigation. Mark of Detection"
    },
    {
      "name": "House Orien Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "dex",
        "con",
        "int"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Constitution",
        "Intelligence"
      ],
      "skills": [
        "Acrobatics",
        "Athletics"
      ],
      "tools": [
        "Cartographer's Tools"
      ],
      "feat": "Mark of Passage",
      "desc": "+2/+1 to Dexterity, Constitution or Intelligence. Skills: Acrobatics, Athletics. Mark of Passage"
    },
    {
      "name": "House Phiarlan Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "dex",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Disguise Kit"
      ],
      "feat": "Mark of Shadow",
      "desc": "+2/+1 to Dexterity, Wisdom or Charisma. Skills: Deception, Stealth. Mark of Shadow"
    },
    {
      "name": "House Sivis Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "int",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Intelligence",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "History",
        "Perception"
      ],
      "tools": [
        "Calligrapher's Supplies"
      ],
      "feat": "Mark of Scribing",
      "desc": "+2/+1 to Intelligence, Wisdom or Charisma. Skills: History, Perception. Mark of Scribing"
    },
    {
      "name": "House Tharashk Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "con",
        "int",
        "wis"
      ],
      "abilityGroupNames": [
        "Constitution",
        "Intelligence",
        "Wisdom"
      ],
      "skills": [
        "Perception",
        "Survival"
      ],
      "tools": [],
      "feat": "Mark of Finding",
      "desc": "+2/+1 to Constitution, Intelligence or Wisdom. Skills: Perception, Survival. Mark of Finding"
    },
    {
      "name": "House Thuranni Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "dex",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Performance",
        "Stealth"
      ],
      "tools": [],
      "feat": "Mark of Shadow",
      "desc": "+2/+1 to Dexterity, Intelligence or Charisma. Skills: Performance, Stealth. Mark of Shadow"
    },
    {
      "name": "House Vadalis Heir",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "con",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Constitution",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Animal Handling",
        "Nature"
      ],
      "tools": [
        "Herbalism Kit"
      ],
      "feat": "Mark of Handling",
      "desc": "+2/+1 to Constitution, Wisdom or Charisma. Skills: Animal Handling, Nature. Mark of Handling"
    },
    {
      "name": "Ice Fisher",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "str",
        "dex",
        "con"
      ],
      "abilityGroupNames": [
        "Strength",
        "Dexterity",
        "Constitution"
      ],
      "skills": [
        "Animal Handling",
        "Athletics"
      ],
      "tools": [
        "Woodcarver's Tools"
      ],
      "feat": "Alert",
      "desc": "+2/+1 to Strength, Dexterity or Constitution. Skills: Animal Handling, Athletics. Alert"
    },
    {
      "name": "Inquisitive",
      "source": "Eberron: Forge of the Artificer",
      "abilityGroup": [
        "con",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Constitution",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Insight",
        "Investigation"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "feat": "Alert",
      "desc": "+2/+1 to Constitution, Intelligence or Charisma. Skills: Insight, Investigation. Alert"
    },
    {
      "name": "Knight of the Gauntlet",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "str",
        "int",
        "wis"
      ],
      "abilityGroupNames": [
        "Strength",
        "Intelligence",
        "Wisdom"
      ],
      "skills": [
        "Athletics",
        "Medicine"
      ],
      "tools": [
        "Smith's Tools"
      ],
      "feat": "Tyro of the Gauntlet",
      "desc": "+2/+1 to Strength, Intelligence or Wisdom. Skills: Athletics, Medicine. Tyro of the Gauntlet"
    },
    {
      "name": "Lords' Alliance Vassal",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "str",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Insight",
        "Persuasion"
      ],
      "tools": [
        "Calligrapher's Supplies"
      ],
      "feat": "Lords' Alliance Agent",
      "desc": "+2/+1 to Strength, Intelligence or Charisma. Skills: Insight, Persuasion. Lords' Alliance Agent"
    },
    {
      "name": "Lorwyn Expert",
      "source": "Lorwyn: First Light",
      "abilityGroup": [
        "str",
        "con",
        "wis"
      ],
      "abilityGroupNames": [
        "Strength",
        "Constitution",
        "Wisdom"
      ],
      "skills": [
        "Athletics",
        "Nature"
      ],
      "tools": [
        "Cartographer's Tools"
      ],
      "feat": "Child of the Sun",
      "desc": "+2/+1 to Strength, Constitution or Wisdom. Skills: Athletics, Nature. Child of the Sun"
    },
    {
      "name": "Moonwell Pilgrim",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "con",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Constitution",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Nature",
        "Performance"
      ],
      "tools": [
        "Painter's Supplies"
      ],
      "feat": "Magic Initiate (Druid)",
      "desc": "+2/+1 to Constitution, Wisdom or Charisma. Skills: Nature, Performance. Magic Initiate (Druid)"
    },
    {
      "name": "Mulhorandi Tomb Raider",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "dex",
        "con",
        "int"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Constitution",
        "Intelligence"
      ],
      "skills": [
        "Investigation",
        "Religion"
      ],
      "tools": [
        "Mason's Tools"
      ],
      "feat": "Lucky",
      "desc": "+2/+1 to Dexterity, Constitution or Intelligence. Skills: Investigation, Religion. Lucky"
    },
    {
      "name": "Mythalkeeper",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "int",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Intelligence",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Arcana",
        "History"
      ],
      "tools": [
        "Jeweler's Tools"
      ],
      "feat": "Crafter",
      "desc": "+2/+1 to Intelligence, Wisdom or Charisma. Skills: Arcana, History. Crafter"
    },
    {
      "name": "Purple Dragon Squire",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "str",
        "wis",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Wisdom",
        "Charisma"
      ],
      "skills": [
        "Animal Handling",
        "Insight"
      ],
      "tools": [
        "Navigator's Tools"
      ],
      "feat": "Purple Dragon Rook",
      "desc": "+2/+1 to Strength, Wisdom or Charisma. Skills: Animal Handling, Insight. Purple Dragon Rook"
    },
    {
      "name": "Rashemi Wanderer",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "str",
        "con",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Constitution",
        "Charisma"
      ],
      "skills": [
        "Intimidation",
        "Perception"
      ],
      "tools": [
        "Cartographer's Tools"
      ],
      "feat": "Tough",
      "desc": "+2/+1 to Strength, Constitution or Charisma. Skills: Intimidation, Perception. Tough"
    },
    {
      "name": "Shadowmasters Exile",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "dex",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Acrobatics",
        "Stealth"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "feat": "Savage Attacker",
      "desc": "+2/+1 to Dexterity, Intelligence or Charisma. Skills: Acrobatics, Stealth. Savage Attacker"
    },
    {
      "name": "Shadowmoor Expert",
      "source": "Lorwyn: First Light",
      "abilityGroup": [
        "dex",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Acrobatics",
        "Deception"
      ],
      "tools": [
        "Glassblower's Tools"
      ],
      "feat": "Shadowmoor Hexer",
      "desc": "+2/+1 to Dexterity, Intelligence or Charisma. Skills: Acrobatics, Deception. Shadowmoor Hexer"
    },
    {
      "name": "Spellfire Initiate",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "con",
        "int",
        "cha"
      ],
      "abilityGroupNames": [
        "Constitution",
        "Intelligence",
        "Charisma"
      ],
      "skills": [
        "Arcana",
        "Perception"
      ],
      "tools": [],
      "feat": "Spellfire Spark",
      "desc": "+2/+1 to Constitution, Intelligence or Charisma. Skills: Arcana, Perception. Spellfire Spark"
    },
    {
      "name": "Vampire Devotee",
      "source": "Astarion's Book of Hungers",
      "abilityGroup": [
        "str",
        "con",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Constitution",
        "Charisma"
      ],
      "skills": [
        "Persuasion",
        "Stealth"
      ],
      "tools": [
        "Cook's Utensils"
      ],
      "feat": "Vampire's Plaything",
      "desc": "+2/+1 to Strength, Constitution or Charisma. Skills: Persuasion, Stealth. Vampire's Plaything"
    },
    {
      "name": "Vampire Survivor",
      "source": "Astarion's Book of Hungers",
      "abilityGroup": [
        "dex",
        "con",
        "wis"
      ],
      "abilityGroupNames": [
        "Dexterity",
        "Constitution",
        "Wisdom"
      ],
      "skills": [
        "Insight",
        "Religion"
      ],
      "tools": [
        "Woodcarver's Tools"
      ],
      "feat": "Vampire Hunter",
      "desc": "+2/+1 to Dexterity, Constitution or Wisdom. Skills: Insight, Religion. Vampire Hunter"
    },
    {
      "name": "Zhentarim Mercenary",
      "source": "Forgotten Realms: Heroes of Faerûn",
      "abilityGroup": [
        "str",
        "dex",
        "cha"
      ],
      "abilityGroupNames": [
        "Strength",
        "Dexterity",
        "Charisma"
      ],
      "skills": [
        "Intimidation",
        "Perception"
      ],
      "tools": [
        "Forgery Kit"
      ],
      "feat": "Zhentarim Ruffian",
      "desc": "+2/+1 to Strength, Dexterity or Charisma. Skills: Intimidation, Perception. Zhentarim Ruffian"
    }
  ],
  "backgrounds_2014": [
    {
      "name": "Acolyte",
      "skills": [
        "Insight",
        "Religion"
      ],
      "tools": [],
      "desc": "You have spent your life in service to a temple, gods, or religious order."
    },
    {
      "name": "Charlatan",
      "skills": [
        "Deception",
        "Sleight of Hand"
      ],
      "tools": [
        "Disguise Kit",
        "Forgery Kit"
      ],
      "desc": "You have always had a way with people, bending truth and identity to your advantage."
    },
    {
      "name": "Criminal",
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Any Gaming Set",
        "Thieves' Tools"
      ],
      "desc": "You are an experienced criminal with a history of breaking the law."
    },
    {
      "name": "Entertainer",
      "skills": [
        "Acrobatics",
        "Performance"
      ],
      "tools": [
        "Disguise Kit",
        "Any Musical Instrument"
      ],
      "desc": "You thrive in front of an audience, knowing how to entrance, entertain, and inspire."
    },
    {
      "name": "Folk Hero",
      "skills": [
        "Animal Handling",
        "Survival"
      ],
      "tools": [
        "Any Artisan's Tools"
      ],
      "desc": "You come from a humble social rank but are destined for so much more."
    },
    {
      "name": "Guild Artisan",
      "skills": [
        "Insight",
        "Persuasion"
      ],
      "tools": [
        "Any Artisan's Tools"
      ],
      "desc": "You are a member of an artisan's guild, skilled in a particular field."
    },
    {
      "name": "Hermit",
      "skills": [
        "Medicine",
        "Religion"
      ],
      "tools": [
        "Herbalism Kit"
      ],
      "desc": "You lived in seclusion for a formative part of your life."
    },
    {
      "name": "Noble",
      "skills": [
        "History",
        "Persuasion"
      ],
      "tools": [
        "Any Gaming Set"
      ],
      "desc": "You understand wealth, power, and privilege."
    },
    {
      "name": "Outlander",
      "skills": [
        "Athletics",
        "Survival"
      ],
      "tools": [
        "Any Musical Instrument"
      ],
      "desc": "You grew up in the wilds, far from civilization and the comforts of town and technology."
    },
    {
      "name": "Sage",
      "skills": [
        "Arcana",
        "History"
      ],
      "tools": [],
      "desc": "You spent years learning the lore of the multiverse."
    },
    {
      "name": "Sailor",
      "skills": [
        "Athletics",
        "Perception"
      ],
      "tools": [
        "Navigator's Tools"
      ],
      "desc": "You sailed on a seagoing vessel for years, weathering storms and seeing wonders."
    },
    {
      "name": "Soldier",
      "skills": [
        "Athletics",
        "Intimidation"
      ],
      "tools": [
        "Any Gaming Set"
      ],
      "desc": "War has been your life for as long as you care to remember."
    },
    {
      "name": "Urchin",
      "skills": [
        "Sleight of Hand",
        "Stealth"
      ],
      "tools": [
        "Disguise Kit",
        "Thieves' Tools"
      ],
      "desc": "You grew up on the streets alone, orphaned, and poor."
    },
    {
      "name": "Criminal (Spy)",
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Any Gaming Set",
        "Thieves' Tools"
      ],
      "desc": "Variant Criminal — you secretly gathered information for a crime lord, noble, or other patron. Feature: Spy Contact."
    },
    {
      "name": "Entertainer (Gladiator)",
      "skills": [
        "Acrobatics",
        "Performance"
      ],
      "tools": [
        "Disguise Kit",
        "Any Musical Instrument"
      ],
      "desc": "Variant Entertainer — you fought in arenas for the entertainment of the masses. Feature: By Popular Demand (fighting venues)."
    },
    {
      "name": "Guild Artisan (Guild Merchant)",
      "skills": [
        "Insight",
        "Persuasion"
      ],
      "tools": [
        "Navigator's Tools"
      ],
      "desc": "Variant Guild Artisan — you belong to a guild of traders and shippers rather than craftspeople. You may take Navigator's Tools or an additional language."
    },
    {
      "name": "Noble (Knight)",
      "skills": [
        "History",
        "Persuasion"
      ],
      "tools": [
        "Any Gaming Set"
      ],
      "desc": "Variant Noble — you are a knight with a retinue. Feature: Retainers (three commoners, one of whom is a squire)."
    },
    {
      "name": "Noble (Retainers)",
      "skills": [
        "History",
        "Persuasion"
      ],
      "tools": [
        "Any Gaming Set"
      ],
      "desc": "Variant Noble — instead of Position of Privilege, you have the Retainers feature: three loyal commoner servants."
    },
    {
      "name": "Sailor (Pirate)",
      "skills": [
        "Athletics",
        "Perception"
      ],
      "tools": [
        "Navigator's Tools"
      ],
      "desc": "Variant Sailor — you sailed under a pirate flag. Feature: Bad Reputation (people fear you; minor crimes go unpunished)."
    },
    {
      "name": "Anthropologist",
      "source": "Tomb of Annihilation",
      "skills": [
        "Insight",
        "Religion"
      ],
      "tools": [],
      "desc": "Before becoming an adventurer, you spent much of your adult life away from your homeland, living among people different from your kin. You came to understand these foreign cultures and the ways of their people, who eventually treated you as one of their own. One culture had more of an influence on you than any other, shaping your beliefs and customs Choose a race whose culture you've adopted, or roll on the Adopted Culture table."
    },
    {
      "name": "Astral Drifter",
      "source": "Astral Adventurer's Guide",
      "skills": [
        "Insight",
        "Religion"
      ],
      "tools": [],
      "desc": "You are 20d6 years older than you look, because you have spent that much time in the Astral Sea without aging."
    },
    {
      "name": "Athlete",
      "source": "Mythic Odysseys of Theros",
      "skills": [
        "Acrobatics",
        "Athletics"
      ],
      "tools": [
        "Vehicles (Land)"
      ],
      "desc": "You have attracted admiration among spectators, fellow athletes, and trainers in the region that hosted your past athletic victories. When visiting any settlement within 100 miles of where you grew up, there is a 50 chance you can find someone there who admires you and is willing to provide information or temporary shelter."
    },
    {
      "name": "Augen Trust (Spy)",
      "source": "Explorer's Guide to Wildemount",
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "desc": "You have a reliable and trustworthy contact who acts as your liaison to a network of other spies. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you."
    },
    {
      "name": "Azorius Functionary",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Insight",
        "Intimidation"
      ],
      "tools": [],
      "desc": "You have the authority to enforce the laws of Ravnica, and that status inspires a certain amount of respect and even fear in the populace. People mind their manners in your presence and avoid drawing your attention; they assume you have the right to be wherever you are. Showing your Azorius insignia gets you an audience with anyone you want to talk to (though it might cause more problems than it solves when you're dealing with incorrigible lawbreakers). If you abuse this privilege, though, you can get in serious trouble with your superiors and even be stripped of your position."
    },
    {
      "name": "Baldur's Gate Acolyte",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Insight",
        "Religion"
      ],
      "tools": [],
      "desc": "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle."
    },
    {
      "name": "Baldur's Gate Charlatan",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Deception",
        "Sleight of Hand"
      ],
      "tools": [
        "Disguise Kit",
        "Forgery Kit"
      ],
      "desc": "You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy."
    },
    {
      "name": "Baldur's Gate Criminal",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "desc": "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you."
    },
    {
      "name": "Baldur's Gate Entertainer",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Acrobatics",
        "Performance"
      ],
      "tools": [
        "Disguise Kit"
      ],
      "desc": "You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble's court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you."
    },
    {
      "name": "Baldur's Gate Folk Hero",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Animal Handling",
        "Survival"
      ],
      "tools": [
        "Vehicles (Land)"
      ],
      "desc": "Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you."
    },
    {
      "name": "Baldur's Gate Guild Artisan",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Insight",
        "Persuasion"
      ],
      "tools": [],
      "desc": "As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed. In some cities and towns, a guildhall offers a central place to meet other members of your profession, which can be a good place to meet potential patrons, allies, or hirelings."
    },
    {
      "name": "Baldur's Gate Hermit",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Medicine",
        "Religion"
      ],
      "tools": [
        "Herbalism Kit"
      ],
      "desc": "The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society."
    },
    {
      "name": "Baldur's Gate Noble",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "History",
        "Persuasion"
      ],
      "tools": [],
      "desc": "The effects of a Baldur's Gate feature can be used only while the character is in Baldur's Gate—though, at the DM's discretion, they might have applicable effects in situations similar to those in Baldur's Gate."
    },
    {
      "name": "Baldur's Gate Outlander",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Athletics",
        "Survival"
      ],
      "tools": [],
      "desc": "You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth."
    },
    {
      "name": "Baldur's Gate Sage",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Arcana",
        "History"
      ],
      "tools": [],
      "desc": "When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found. Unearthing the deepest secrets of the multiverse can require an adventure or even a whole campaign."
    },
    {
      "name": "Baldur's Gate Sailor",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Athletics",
        "Perception"
      ],
      "tools": [
        "Navigator's Tools",
        "Vehicles (Water)"
      ],
      "desc": "When you need to, you can secure free passage on a sailing ship for yourself and your adventuring companions. You might sail on the ship you served on, or another ship you have good relations with (perhaps one captained by a former crewmate). Because you're calling in a favor, you can't be certain of a schedule or route that will meet your every need. Your Dungeon Master will determine how long it takes to get where you need to go. In return for your free passage, you and your companions are expected to assist the crew during the voyage."
    },
    {
      "name": "Baldur's Gate Soldier",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Athletics",
        "Intimidation"
      ],
      "tools": [
        "Vehicles (Land)"
      ],
      "desc": "You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use. You can also usually gain access to friendly military encampments and fortresses where your rank is recognized."
    },
    {
      "name": "Baldur's Gate Urchin",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Sleight of Hand",
        "Stealth"
      ],
      "tools": [
        "Disguise Kit",
        "Thieves' Tools"
      ],
      "desc": "You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in the city twice as fast as your speed would normally allow."
    },
    {
      "name": "Boros Legionnaire",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Athletics",
        "Intimidation"
      ],
      "tools": [],
      "desc": "You have an established place in the hierarchy of the Boros Legion. You can requisition simple equipment for temporary use, and you can gain access to any Boros garrison in Ravnica, where you can rest in safety and receive the attention of medics. You are also paid a salary of 1 gp (a Boros-minted 1-zino coin) per week, which (combined with free lodging in your garrison) enables you to maintain a poor lifestyle between adventures."
    },
    {
      "name": "Celebrity Adventurer's Scion",
      "source": "Acquisitions Incorporated",
      "skills": [
        "Perception",
        "Performance"
      ],
      "tools": [
        "Disguise Kit"
      ],
      "desc": "You know and have met any number of powerful people across the land—and some of them might even remember you. You might be able to wrangle minor assistance from a major figure in the campaign, at the DM's discretion. Additionally, the common folk treat you with deference, and your heritage and the stories you tell might be good for a free meal or a place to sleep."
    },
    {
      "name": "City Watch",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "Athletics",
        "Insight"
      ],
      "tools": [],
      "desc": "Your experience in enforcing the law, and dealing with lawbreakers, gives you a feel for local laws and criminals. You can easily find the local outpost of the watch or a similar organization, and just as easily pick out the dens of criminal activity in a community, although you're more likely to be welcome in the former locations rather than the latter."
    },
    {
      "name": "Clan Crafter",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "History",
        "Insight"
      ],
      "tools": [],
      "desc": "As well respected as clan crafters are among outsiders, no one esteems them quite so highly as dwarves do. You always have free room and board in any place where shield dwarves or gold dwarves dwell, and the individuals in such a settlement might vie among themselves to determine who can offer you (and possibly your companions) the finest accommodations and assistance."
    },
    {
      "name": "Cloistered Scholar",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "History"
      ],
      "tools": [],
      "desc": "Though others must often endure extensive interviews and significant fees to gain access to even the most common archives in your library, you have free and easy access to the majority of the library, though it might also have repositories of lore that are too valuable, magical, or secret to permit anyone immediate access. Choose 1 skill from Arcana, Nature, Religion."
    },
    {
      "name": "Cobalt Scholar (Sage)",
      "source": "Explorer's Guide to Wildemount",
      "skills": [
        "Arcana",
        "History"
      ],
      "tools": [],
      "desc": "When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found. Unearthing the deepest secrets of the multiverse can require an adventure or even a whole campaign."
    },
    {
      "name": "Courtier",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "Insight",
        "Persuasion"
      ],
      "tools": [],
      "desc": "Your knowledge of how bureaucracies function lets you gain access to the records and inner workings of any noble court or government you encounter. You know who the movers and shakers are, whom to go to for the favors you seek, and what the current intrigues of interest in the group are."
    },
    {
      "name": "Custom Background",
      "source": "Player's Handbook (2014)",
      "skills": [],
      "tools": [],
      "desc": "Choose a feature from any background."
    },
    {
      "name": "Dimir Operative",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Disguise Kit"
      ],
      "desc": "You have more than one identity. The one you wear most of the time makes you appear to be a member of a guild other than House Dimir. You have documentation, established acquaintances, and disguises that allow you to assume that persona and fit into the secondary guild."
    },
    {
      "name": "Faceless",
      "source": "Baldur's Gate: Descent Into Avernus",
      "skills": [
        "Deception",
        "Intimidation"
      ],
      "tools": [
        "Disguise Kit"
      ],
      "desc": "A faceless character adventures behind the mask of a public persona. This persona is as natural to them as their hidden, true face, but it disguises their identity. Roll on the Faceless Persona table to determine your persona, or work with the DM to create a persona that's unique to your character and suits the tone of your game."
    },
    {
      "name": "Faction Agent",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "Insight"
      ],
      "tools": [],
      "desc": "As a faction agent, you have access to a secret network of supporters and operatives who can provide assistance on your adventures. You know a set of secret signs and passwords you can use to identify such operatives, who can provide you with access to a hidden safe house, free room and board, or assistance in finding information. These agents never risk their lives for you or risk revealing their true identities. Choose 1 skill from Arcana, Animal Handling, Deception, History, Intimidation, Investigation, Medicine, Nature, Perception, Performance, Persuasion, Religion, Survival."
    },
    {
      "name": "Failed Merchant",
      "source": "Acquisitions Incorporated",
      "skills": [
        "Investigation",
        "Persuasion"
      ],
      "tools": [],
      "desc": "From your time as a merchant, you retain connections with wholesalers, suppliers, and other merchants and entrepreneurs. You can call upon these connections when looking for items or information."
    },
    {
      "name": "Far Traveler",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "Insight",
        "Perception"
      ],
      "tools": [],
      "desc": "Your accent, mannerisms, figures of speech, and perhaps even your appearance all mark you as foreign. Curious glances are directed your way wherever you go, which can be a nuisance, but you also gain the friendly interest of scholars and others intrigued by far-off lands, to say nothing of everyday folk who are eager to hear stories of your homeland. Choose 1 tool from Musical Instrument, Gaming Set."
    },
    {
      "name": "Feylost",
      "source": "The Wild Beyond the Witchlight",
      "skills": [
        "Deception",
        "Survival"
      ],
      "tools": [],
      "desc": "Your mannerisms and knowledge of fey customs are recognized by natives of the Feywild, who see you as one of their own. Because of this, friendly Fey creatures are inclined to come to your aid if you are lost or need help in the Feywild."
    },
    {
      "name": "Fisher",
      "source": "Ghosts of Saltmarsh",
      "skills": [
        "History",
        "Survival"
      ],
      "tools": [],
      "desc": "You gain advantage on ability checks made using fishing tackle. If you have access to a body of water that sustains marine life, you can maintain a moderate lifestyle while working as a fisher, and you can catch enough food to feed yourself and up to ten other people each day."
    },
    {
      "name": "Gambler",
      "source": "Acquisitions Incorporated",
      "skills": [
        "Deception",
        "Insight"
      ],
      "tools": [],
      "desc": "Odds and probability are your bread and butter. During downtime activities that involve games of chance or figuring odds on the best plan, you can get a solid sense of which choice is likely the best one and which opportunities seem too good to be true, at the DM's determination."
    },
    {
      "name": "Gate Warden",
      "source": "Sigil and the Outlands",
      "skills": [
        "Persuasion",
        "Survival"
      ],
      "tools": [],
      "desc": "Living in a gate-town or a similar location steeped you in planar energy. You gain the Scion of the Outer Planes feat. In addition, you know where to find free, modest lodging and food in the community you grew up in."
    },
    {
      "name": "Giant Foundling",
      "source": "Bigby Presents: Glory of the Giants",
      "skills": [
        "Intimidation",
        "Survival"
      ],
      "tools": [],
      "desc": "How you came to live among colossal creatures is up to you to determine, but the Foundling Origin table suggests a variety of possibilities."
    },
    {
      "name": "Golgari Agent",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Nature",
        "Survival"
      ],
      "tools": [
        "Poisoner's Kit"
      ],
      "desc": "You know hidden, underground pathways that you can use to bypass crowds, obstacles, and observation as you move through the city. When you aren't in combat, you and companions you lead can travel between any two locations in the city twice as fast as your speed would normally allow. The paths of the undercity are haunted by dangers that rarely brave the light of the surface world, so your journey isn't guaranteed to be safe."
    },
    {
      "name": "Grinner",
      "source": "Explorer's Guide to Wildemount",
      "skills": [
        "Deception",
        "Performance"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "desc": "Like every Grinner, you know how to find a hideout. In any city of 10,000 people or more on the Menagerie Coast or in the lands of the Dwendalian Empire, you can play the \"Ballad of the Grinning Fool\" in a major tavern or inn. A member of the Golden Grin will find you and give shelter to you and any companions you vouch for. This shelter might be discontinued if it becomes too dangerous to hide you, at the DM's discretion."
    },
    {
      "name": "Gruul Anarch",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Animal Handling",
        "Athletics"
      ],
      "tools": [
        "Herbalism Kit"
      ],
      "desc": "You are intimately familiar with areas of the city that most people shun: ruined neighborhoods where wurms rampaged, overgrown parks that no hand has tended in decades, and the vast, sprawling rubblebelts of broken terrain that civilized folk have long abandoned. You can find a suitable place for you and your allies to hide or rest in these areas. In addition, you can find food and fresh water in these areas for yourself and up to five other people each day."
    },
    {
      "name": "Haunted One",
      "source": "Van Richten's Guide to Ravenloft",
      "skills": [],
      "tools": [],
      "desc": "Those who look into your eyes can see that you have faced unimaginable horror and that you are no stranger to darkness. Though they might fear you, commoners will extend you every courtesy and do their utmost to help you. Unless you have shown yourself to be a danger to them, they will even take up arms to fight alongside you, should you find yourself facing an enemy alone. Choose 2 skills from Arcana, Investigation, Religion, Survival."
    },
    {
      "name": "Inheritor",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "Survival"
      ],
      "tools": [],
      "desc": "Choose or randomly determine your inheritance from the possibilities in the table below. Work with your Dungeon Master to come up with details: Why is your inheritance so important, and what is its full story? You might prefer for the DM to invent these details as part of the game, allowing you to learn more about your inheritance as your character does. Choose 1 skill from Arcana, History, Religion. Choose 1 tool from Musical Instrument, Gaming Set."
    },
    {
      "name": "Initiate",
      "source": "Plane Shift: Amonkhet",
      "skills": [
        "Athletics",
        "Intimidation"
      ],
      "tools": [
        "Vehicles (Land)"
      ],
      "desc": "Your life is oriented around your participation in the five trials that will determine your worthiness in the afterlife. While you prepare for and undergo those trials, you have constant access to training. A comfortable place to live and regular meals are provided to you by servitor mummies (the anointed) under the supervision of viziers. You can enjoy these benefits only as long as you obey the societal norms of Naktamun—training for the trials (with or without your crop), obeying the orders of the gods, and following the instructions of their viziers. If you violate these norms, you risk being treated as a dissenter. See \"Trials of the Five Gods\" for more information about undertaking the trials and their rewards."
    },
    {
      "name": "Initiate (Dissenter)",
      "source": "Plane Shift: Amonkhet",
      "skills": [
        "Athletics",
        "Intimidation"
      ],
      "tools": [
        "Vehicles (Land)"
      ],
      "desc": "If they wish to have any hope of survival, whether hiding within the city or cast out into the desert, dissenters must help each other. You can find a place to hide, rest, or recuperate among other dissenters. They will help shield you from those who hunt you, possibly even risking their lives for you."
    },
    {
      "name": "Inquisitor",
      "source": "Plane Shift: Ixalan",
      "skills": [
        "Investigation",
        "Religion"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "desc": "As an inquisitor of the church, you have the authority to arrest criminals. In the absence of other authorities, you are authorized to pass judgement and even carry out sentencing. If you abuse this power, however, your superiors in the church might strip it from you."
    },
    {
      "name": "Investigator",
      "source": "Van Richten's Guide to Ravenloft",
      "skills": [],
      "tools": [
        "Disguise Kit",
        "Thieves' Tools"
      ],
      "desc": "You're experienced at gaining access to people and places to get the information you need. Through a combination of fast-talking, determination, and official-looking documentation, you can gain access to a place or an individual related to a crime you're investigating. Those who aren't involved in your investigation avoid impeding you or pass along your requests. Additionally, local law enforcement has firm opinions about you, viewing you as either a nuisance or one of their own. Choose 2 skills from Insight, Investigation, Perception."
    },
    {
      "name": "Izzet Engineer",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Arcana",
        "Investigation"
      ],
      "tools": [],
      "desc": "The popular conception of the Izzet League is based on mad inventions, dangerous experiments, and explosive blasts. Much of that perception is accurate, but the league is also involved with mundane tasks of construction and architecture—primarily in crafting the infrastructure that allows Ravnicans to enjoy running water, levitating platforms, and other magical and technological wonders."
    },
    {
      "name": "Knight of Solamnia",
      "source": "Dragonlance: Shadow of the Dragon Queen",
      "skills": [
        "Athletics",
        "Survival"
      ],
      "tools": [],
      "desc": "You gain the Squire of Solamnia feat."
    },
    {
      "name": "Knight of the Order",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "Persuasion"
      ],
      "tools": [],
      "desc": "You receive shelter and succor from members of your knightly order and those who are sympathetic to its aims. If your order is a religious one, you can gain aid from temples and other religious communities of your deity. Knights of civic orders can get help from the community—whether a lone settlement or a great nation—that they serve, and knights of philosophical orders can find help from those they have aided in pursuit of their ideals, and those who share their ideals. Choose 1 skill from Arcana, History, Nature, Religion. Choose 1 tool from Musical Instrument, Gaming Set."
    },
    {
      "name": "Lorehold Student",
      "source": "Strixhaven: A Curriculum of Chaos",
      "skills": [
        "History",
        "Religion"
      ],
      "tools": [],
      "desc": "You gain the Strixhaven Initiate feat and must choose Lorehold within it."
    },
    {
      "name": "Luxonborn (Acolyte)",
      "source": "Explorer's Guide to Wildemount",
      "skills": [
        "Insight",
        "Religion"
      ],
      "tools": [],
      "desc": "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle."
    },
    {
      "name": "Mage of High Sorcery",
      "source": "Dragonlance: Shadow of the Dragon Queen",
      "skills": [
        "Arcana",
        "History"
      ],
      "tools": [],
      "desc": "You gain the Initiate of High Sorcery feat."
    },
    {
      "name": "Marine",
      "source": "Ghosts of Saltmarsh",
      "skills": [
        "Athletics",
        "Survival"
      ],
      "tools": [
        "Vehicles (Water)",
        "Vehicles (Land)"
      ],
      "desc": "You can move twice the normal amount of time (up to 16 hours) each day before being subject to the effect of a forced march (see \"Travel Pace\" in chapter 8 of the Player's Handbook). Additionally, you can automatically find a safe route to land a boat on shore, provided such a route exists."
    },
    {
      "name": "Mercenary Veteran",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "Athletics",
        "Persuasion"
      ],
      "tools": [
        "Vehicles (Land)"
      ],
      "desc": "You know the mercenary life as only someone who has experienced it can. You are able to identify mercenary companies by their emblems, and you know a little about any such company, including who has hired them recently. You can find the taverns and festhalls where mercenaries abide in any area, as long as you speak the language. You can find mercenary work between adventures sufficient to maintain a comfortable lifestyle (see \"Practicing a Profession\" under \"Downtime Activities\" in chapter 8 of the Player's Handbook)."
    },
    {
      "name": "Myriad Operative (Criminal)",
      "source": "Explorer's Guide to Wildemount",
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "desc": "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you."
    },
    {
      "name": "Orzhov Representative",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Intimidation",
        "Religion"
      ],
      "tools": [],
      "desc": "You can exert leverage over one or more individuals below you in the guild's hierarchy and demand their help as needs warrant. For example, you can have a message carried across a neighborhood, procure a short carriage ride without paying, or have others clean up a bloody mess you left in an alley. The DM decides if your demands are reasonable and if there are subordinates available to fulfill them. As your status in the guild improves, you gain influence over more people, including ones in greater positions of power."
    },
    {
      "name": "Plaintiff",
      "source": "Acquisitions Incorporated",
      "skills": [
        "Medicine",
        "Persuasion"
      ],
      "tools": [],
      "desc": "Your experience with your local legal system has given you a firm knowledge of the ins and outs of that system. Even when the law is not on your side, you can use complex terms like ex injuria jus non oritur and cogitationis poenam nemo patitur to frighten people into thinking you know what you're talking about. With common folks who don't know any better, you might be able to intimidate or deceive to get favors or special treatment."
    },
    {
      "name": "Planar Philosopher",
      "source": "Sigil and the Outlands",
      "skills": [
        "Arcana"
      ],
      "tools": [],
      "desc": "Twelve factions have risen to prominence in the City of Doors, though many more exist. Your character might belong to one of these groups or another ideological faction, perhaps one of your own creation. Choose 1 skill from Religion, Insight, Nature, Intimidation, History, Stealth, Perception, Medicine, Survival, Persuasion, Performance, Athletics."
    },
    {
      "name": "Prismari Student",
      "source": "Strixhaven: A Curriculum of Chaos",
      "skills": [
        "Acrobatics",
        "Performance"
      ],
      "tools": [],
      "desc": "You gain the Strixhaven Initiate feat and must choose Prismari within it. Choose 1 tool from AnyArtisansTool, Musical Instrument."
    },
    {
      "name": "Quandrix Student",
      "source": "Strixhaven: A Curriculum of Chaos",
      "skills": [
        "Arcana",
        "Nature"
      ],
      "tools": [],
      "desc": "You gain the Strixhaven Initiate feat and must choose Quandrix within it."
    },
    {
      "name": "Rakdos Cultist",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Acrobatics",
        "Performance"
      ],
      "tools": [],
      "desc": "Rakdos performance styles typically fuse standard circus-style acrobatics with fire, wrought-iron spikes and hooks, and monsters. You can roll a d8 or choose from the options in the Performance Options table to determine your preferred style of performance."
    },
    {
      "name": "Revelry Pirate (Sailor)",
      "source": "Explorer's Guide to Wildemount",
      "skills": [
        "Athletics",
        "Perception"
      ],
      "tools": [
        "Navigator's Tools",
        "Vehicles (Water)"
      ],
      "desc": "When you need to, you can secure free passage on a sailing ship for yourself and your adventuring companions. You might sail on the ship you served on, or another ship you have good relations with (perhaps one captained by a former crewmate). Because you're calling in a favor, you can't be certain of a schedule or route that will meet your every need. Your Dungeon Master will determine how long it takes to get where you need to go. In return for your free passage, you and your companions are expected to assist the crew during the voyage."
    },
    {
      "name": "Rewarded",
      "source": "The Book of Many Things",
      "skills": [
        "Insight",
        "Persuasion"
      ],
      "tools": [],
      "desc": "Your unexpected good fortune is reflected by a minor boon. You gain the Lucky, Magic Initiate, or Skilled feat (your choice). Your choice of feat reflects the transformation that changed your life. An encounter with a genie who gave you three wishes might have resulted in magical powers represented by Magic Initiate. If you paid off all your family debts with a fortuitous round of three-dragon ante, you might be Lucky instead. Alternatively, you could use the Skilled feat to reflect whatever trial you endured to secure your new destiny and to model the knowledge and abilities imparted to you by whatever force transformed your life."
    },
    {
      "name": "Rival Intern",
      "source": "Acquisitions Incorporated",
      "skills": [
        "History",
        "Investigation"
      ],
      "tools": [],
      "desc": "You have connections to your previous employer or other groups you dealt with during your previous employment. You can communicate with your contacts, gaining information at the DM's discretion."
    },
    {
      "name": "Ruined",
      "source": "The Book of Many Things",
      "skills": [
        "Stealth",
        "Survival"
      ],
      "tools": [],
      "desc": "You have weathered ruinous misfortune, and you possess hidden reserves others don't expect. You gain the Alert, Skilled, or Tough feat (your choice). Your choice of feat reflects how you've dealt with the terrible loss that changed your life forever. If you've kept your senses sharp for every opportunity and climbed your way out of misery by seizing the tiniest scrap of hope, choose Alert. If you've redoubled your efforts to reclaim what was once yours, choose Skilled. If you've stoically persevered through your misfortune, select Tough."
    },
    {
      "name": "Rune Carver",
      "source": "Bigby Presents: Glory of the Giants",
      "skills": [
        "History",
        "Perception"
      ],
      "tools": [],
      "desc": "Each rune carver has a unique style and preferred medium. To determine how you make your runes, you can roll on the Rune Style table."
    },
    {
      "name": "Selesnya Initiate",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Nature",
        "Persuasion"
      ],
      "tools": [],
      "desc": "As a member of the Selesnya Conclave, you can count on your guild mates to provide shelter and aid. You and your companions can find a place to hide or rest in any Selesnya enclave in the city, unless you have proven to be a danger to them. The members of the enclave will shield you from the law or anyone else searching for you, though they will not risk their lives in this effort. Choose 1 tool from AnyArtisansTool, Musical Instrument."
    },
    {
      "name": "Shipwright",
      "source": "Ghosts of Saltmarsh",
      "skills": [
        "History",
        "Perception"
      ],
      "tools": [
        "Carpenter's Tools",
        "Vehicles (Water)"
      ],
      "desc": "Provided you have carpenter's tools and wood, you can perform repairs on a water vehicle. When you use this ability, you restore a number of hit points to the hull of a water vehicle equal to 5 × your proficiency modifier. A vehicle cannot be patched by you in this way again until after it has been pulled ashore and fully repaired."
    },
    {
      "name": "Silverquill Student",
      "source": "Strixhaven: A Curriculum of Chaos",
      "skills": [
        "Intimidation",
        "Persuasion"
      ],
      "tools": [],
      "desc": "You gain the Strixhaven Initiate feat and must choose Silverquill within it."
    },
    {
      "name": "Simic Scientist",
      "source": "Guildmasters' Guide to Ravnica",
      "skills": [
        "Arcana",
        "Medicine"
      ],
      "tools": [],
      "desc": "As a Simic researcher, you are part of a clade—a diverse group of individuals combining disparate talents in pursuit of a common goal—or a researcher on a specialized, short-term project focused on addressing an immediate need. You can roll a d6 or choose from the options in the Research Options table to determine your area of research."
    },
    {
      "name": "Smuggler",
      "source": "Ghosts of Saltmarsh",
      "skills": [
        "Athletics",
        "Deception"
      ],
      "tools": [
        "Vehicles (Water)"
      ],
      "desc": "You are acquainted with a network of smugglers who are willing to help you out of tight situations. While in a particular town, city, or other similarly sized community (DM's discretion), you and your companions can stay for free in safe houses. Safe houses provide a poor lifestyle. While staying at a safe house, you can choose to keep your presence (and that of your companions) a secret."
    },
    {
      "name": "Urban Bounty Hunter",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [],
      "tools": [],
      "desc": "You are in frequent contact with people in the segment of society that your chosen quarries move through. These people might be associated with the criminal underworld, the rough-and-tumble folk of the streets, or members of high society. This connection comes in the form of a contact in any city you visit, a person who provides information about the people and places of the local area. Choose 2 skills from Deception, Insight, Persuasion, Stealth. Choose 2 tools from Gaming Set, Musical Instrument, Thieves' Tools."
    },
    {
      "name": "Uthgardt Tribe Member",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "Athletics",
        "Survival"
      ],
      "tools": [],
      "desc": "You have an excellent knowledge of not only your tribe's territory, but also the terrain and natural resources of the rest of the North. You are familiar enough with any wilderness area that you can find twice as much food and water as you normally would when you forage there. Choose 1 tool from Musical Instrument, AnyArtisansTool."
    },
    {
      "name": "Variant City Watch (Investigator)",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "Insight",
        "Investigation"
      ],
      "tools": [],
      "desc": "Your experience in enforcing the law, and dealing with lawbreakers, gives you a feel for local laws and criminals. You can easily find the local outpost of the watch or a similar organization, and just as easily pick out the dens of criminal activity in a community, although you're more likely to be welcome in the former locations rather than the latter."
    },
    {
      "name": "Variant Criminal (Spy)",
      "source": "Player's Handbook (2014)",
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Thieves' Tools"
      ],
      "desc": "You have a reliable and trustworthy contact who acts as your liaison to a network of other spies. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you."
    },
    {
      "name": "Variant Entertainer (Gladiator)",
      "source": "Player's Handbook (2014)",
      "skills": [
        "Acrobatics",
        "Performance"
      ],
      "tools": [
        "Disguise Kit"
      ],
      "desc": "You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble's court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you."
    },
    {
      "name": "Variant Guild Artisan (Guild Merchant)",
      "source": "Player's Handbook (2014)",
      "skills": [
        "Insight",
        "Persuasion"
      ],
      "tools": [],
      "desc": "As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed. In some cities and towns, a guildhall offers a central place to meet other members of your profession, which can be a good place to meet potential patrons, allies, or hirelings. Choose 1 tool from AnyArtisansTool, Navigator'S Tools."
    },
    {
      "name": "Variant Noble (Knight)",
      "source": "Player's Handbook (2014)",
      "skills": [
        "History",
        "Persuasion"
      ],
      "tools": [],
      "desc": "A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature instead of the Position of Privilege feature."
    },
    {
      "name": "Variant Noble (Retainers)",
      "source": "Player's Handbook (2014)",
      "skills": [
        "History",
        "Persuasion"
      ],
      "tools": [],
      "desc": "You have the service of three retainers loyal to your family. These retainers can be attendants or messengers, and one might be a majordomo. Your retainers are commoners who can perform mundane tasks for you, but they do not fight for you, will not follow you into obviously dangerous areas (such as dungeons), and will leave if they are frequently endangered or abused."
    },
    {
      "name": "Variant Sailor (Pirate)",
      "source": "Player's Handbook (2014)",
      "skills": [
        "Athletics",
        "Perception"
      ],
      "tools": [
        "Navigator's Tools",
        "Vehicles (Water)"
      ],
      "desc": "No matter where you go, people are afraid of you due to your reputation. When you are in a civilized settlement, you can get away with minor criminal offenses, such as refusing to pay for food at a tavern or breaking down doors at a local shop, since most people will not report your activity to the authorities."
    },
    {
      "name": "Vizier",
      "source": "Plane Shift: Amonkhet",
      "skills": [
        "History",
        "Religion"
      ],
      "tools": [],
      "desc": "Your voice is the voice of your god, at least in theory. Your job might include training and instructing initiates, and they are required to obey you. In any circumstance, an initiate is expected to defer to your voice and obey your commands. If you abuse this authority, though, your god might personally punish you."
    },
    {
      "name": "Vizier (Dissenter)",
      "source": "Plane Shift: Amonkhet",
      "skills": [
        "History",
        "Religion"
      ],
      "tools": [],
      "desc": "If they wish to have any hope of survival, whether hiding within the city or cast out into the desert, dissenters must help each other. You can find a place to hide, rest, or recuperate among other dissenters. They will help shield you from those who hunt you, possibly even risking their lives for you."
    },
    {
      "name": "Volstrucker Agent",
      "source": "Explorer's Guide to Wildemount",
      "skills": [
        "Deception",
        "Stealth"
      ],
      "tools": [
        "Poisoner's Kit"
      ],
      "desc": "You have access to the Volstrucker shadow network, which allows you to communicate with other members of the order over long distances. If you write a letter in a special arcane ink, address it to a member of the Volstrucker, and cast it into a fire, the letter will burn to cinders and materialize whole again on the person of the agent you addressed it to."
    },
    {
      "name": "Waterdhavian Noble",
      "source": "Sword Coast Adventurer's Guide",
      "skills": [
        "History",
        "Persuasion"
      ],
      "tools": [],
      "desc": "While you are in Waterdeep or elsewhere in the North, your house sees to your everyday needs. Your name and signet are sufficient to cover most of your expenses; the inns, taverns, and festhalls you frequent are glad to record your debt and send an accounting to your family's estate in Waterdeep to settle what you owe. Choose 1 tool from Gaming Set, Musical Instrument."
    },
    {
      "name": "Wildspacer",
      "source": "Astral Adventurer's Guide",
      "skills": [
        "Athletics",
        "Survival"
      ],
      "tools": [
        "Navigator's Tools",
        "Vehicles (Space)"
      ],
      "desc": "You had a harrowing encounter with one of Wildspace's many terrors. You escaped with your life, but the encounter left you with a scar or two, or perhaps a recurring nightmare. Roll on the Close Encounter table to determine which creature nearly got the best of you. Creatures marked with an asterisk appear in Boo's Astral Menagerie; the others are described in the Monster Manual."
    },
    {
      "name": "Witchlight Hand",
      "source": "The Wild Beyond the Witchlight",
      "skills": [
        "Performance",
        "Sleight of Hand"
      ],
      "tools": [],
      "desc": "The Witchlight Carnival provides you with free, modest lodging and food. In addition, you may wander about the carnival and partake of its many wonders at no cost to you, provided you don't disrupt its shows or cause any other trouble. Choose 1 tool from Disguise Kit, Musical Instrument."
    },
    {
      "name": "Witherbloom Student",
      "source": "Strixhaven: A Curriculum of Chaos",
      "skills": [
        "Nature",
        "Survival"
      ],
      "tools": [
        "Herbalism Kit"
      ],
      "desc": "You gain the Strixhaven Initiate feat and must choose Witherbloom within it."
    }
  ]
};
