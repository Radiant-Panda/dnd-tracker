const FEATS_ITEMS_DATA = {
  "feats": [
    {
      "name": "Ability Score Improvement",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": true,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 2,
          "amount": 1
        }
      },
      "desc": "Increase one ability score of your choice by 2, or increase two ability scores of your choice by 1. This feat can't increase an ability score above 20. Repeatable: You can take this feat more than once."
    },
    {
      "name": "Actor",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, CHA 13+",
      "repeatable": false,
      "ability_bonus": {
        "cha": 1
      },
      "desc": "You gain the following benefits. Impersonation: While you're disguised as a real or fictional person, you have Advantage on Charisma (Deception or Performance) checks to convince others that you are that person. Mimicry: You can mimic the sounds of other creatures, including speech. A creature that hears the mimicry must succeed on a Wisdom (Insight) check to determine the effect is faked (8 plus your Charisma modifier and Proficiency)."
    },
    {
      "name": "Alert",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You gain the following benefits. Initiative Proficiency: When you roll Initiative, you can add your Proficiency to the roll. Initiative Swap: Immediately after you roll Initiative, you can swap your Initiative with the Initiative of one willing ally in the same combat. You can't make this swap if you or the ally has the Incapacitated condition."
    },
    {
      "name": "Archery",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You gain a +2 bonus to attack rolls you make with Ranged weapons."
    },
    {
      "name": "Athlete",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, STR 13+, Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Climb Speed: You gain a Climb Speed equal to your Speed. Hop Up: When you have the Prone condition, you can right yourself with only 5 feet of movement. Jumping: You can make a running Long Jump or High Jump after moving only 5 feet."
    },
    {
      "name": "Blessed Warrior",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "FS:P",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You learn two Cleric cantrips of your choice. Guidance and Sacred Flame are recommended. The chosen cantrips count as Paladin spells for you, and Charisma is your spellcasting ability for them. Whenever you gain a Paladin level, you can replace one of these cantrips with another Cleric cantrip."
    },
    {
      "name": "Blind Fighting",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have Blindsight with a range of 10 feet."
    },
    {
      "name": "Boon of Combat Prowess",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Peerless Aim: When you miss with an attack roll, you can hit instead. Once you use this benefit, you can't use it again until the start of your next turn."
    },
    {
      "name": "Boon of Dimensional Travel",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Blink Steps: Immediately after you take the Attack action or the Magic action, you can teleport up to 30 feet to an unoccupied space you can see."
    },
    {
      "name": "Boon of Energy Resistance",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Energy Resistances: You gain Resistance to two of the following damage types of your choice: Acid, Cold, Fire, Lightning, Necrotic, Poison, Psychic, Radiant, or Thunder. Whenever you finish a Long Rest, you can change your choices. Energy Redirection: When you take damage of one of the types chosen for the Energy Resistances benefit, you can take a Reaction to direct damage of the same type toward another creature you can see within 60 feet of yourself that isn't behind Cover. If you do so, that creature must succeed on a Dexterity saving throw (8 plus your Con"
    },
    {
      "name": "Boon of Fate",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Improve Fate: When you or another creature within 60 feet of you succeeds on or fails a D20 Test, you can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once you use this benefit, you can't use it again until you roll Initiative or finish a Short Rest or Long Rest."
    },
    {
      "name": "Boon of Fortitude",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Fortified Health: Your Hit Points maximum increases by 40. In addition, whenever you regain Hit Points, you can regain additional Hit Points equal to your Constitution modifier. Once you've regained these additional Hit Points, you can't do so again until the start of your next turn."
    },
    {
      "name": "Boon of Irresistible Offense",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Overcome Defenses: The Bludgeoning, Piercing, and Slashing damage you deal always ignores Resistance. Overwhelming Strike: When you roll a 20 on the d20 for an attack roll, you can deal extra damage to the target equal to the ability score increased by this feat. The extra damage's type is the same as the attack's type."
    },
    {
      "name": "Boon of Recovery",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Last Stand: When you would be reduced to 0 Hit Points, you can drop to 1 Hit Points instead and regain a number of Hit Points equal to half your Hit Points maximum. Once you use this benefit, you can't use it again until you finish a Long Rest. Recover Vitality: You have a pool of ten d10s. As a Bonus Action, you can expend dice from the pool, roll those dice, and regain a number of Hit Points equal to the roll's total. You regain all the expended dice when you finish a Long Rest."
    },
    {
      "name": "Boon of Skill",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. All-Around Adept: You gain proficiency in all skills. Expertise: Choose one skill in which you lack Expertise. You gain Expertise in that skill."
    },
    {
      "name": "Boon of Speed",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Escape Artist: As a Bonus Action, you can take the Disengage action, which also ends the Grappled condition on you. Quickness: Your Speed increases by 30 feet."
    },
    {
      "name": "Boon of Spell Recall",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Free Casting: Whenever you cast a spell with a level 1-4 spell slot, roll 1d4. If the number you roll is the same as the slot's level, the slot isn't expended."
    },
    {
      "name": "Boon of Truesight",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Truesight: You have Truesight with a range of 60 feet."
    },
    {
      "name": "Boon of the Night Spirit",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "EB",
      "prerequisite": "Level 19+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Merge with Shadows: While within Dim Light or Darkness, you can give yourself the Invisible condition as a Bonus Action. The condition ends on you immediately after you take an action, a Bonus Action, or a Reaction. Shadowy Form: While within Dim Light or Darkness, you have Resistance to all damage except Psychic and Radiant."
    },
    {
      "name": "Charger",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, STR 13+, Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Improved Dash: When you take the Dash action, your Speed increases by 10 feet for that action. Charge Attack: If you move at least 10 feet in a straight line toward a target immediately before hitting it with a melee attack roll as part of the Attack action, choose one of the following effects: gain a 1d8 bonus to the attack's damage roll, or push the target up to 10 feet away if it is no more than one size larger than you. You can use this benefit only once on each of your turns."
    },
    {
      "name": "Chef",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "con",
            "wis"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Cook's Utensils: You gain proficiency with Cook's Utensils if you don't already have it. Replenishing Meal: As part of a Short Rest, you can cook special food if you have ingredients and Cook's Utensils on hand. You can prepare enough of this food for a number of creatures equal to 4 plus your Proficiency. At the end of the Short Rest, any creature who eats the food and spends one or more Hit Dice to regain Hit Points regains an extra 1d8 Hit Points. Bolstering Treats: With 1 hour of work or when you finish a Long Rest, you can cook a number of treats equal to "
    },
    {
      "name": "Crafter",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You gain the following benefits. Tool Proficiency: You gain proficiency with three different Artisan's Tools of your choice from the Fast Crafting table. Discount: Whenever you buy a nonmagical item, you receive a 20 percent discount on it. Fast Crafting: When you finish a Long Rest, you can craft one piece of gear from the Fast Crafting table, provided you have the Artisan's Tools associated with that item and have proficiency with those tools. The item lasts until you finish another Long Rest, at which point the item falls apart."
    },
    {
      "name": "Crossbow Expert",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "dex": 1
      },
      "desc": "You gain the following benefits. Ignore Loading: You ignore the LD property of the Hand Crossbow, Heavy Crossbow, and Light Crossbow (all called crossbows elsewhere in this feat). If you're holding one of them, you can load a piece of ammunition into it even if you lack a free hand. Firing in Melee: Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with crossbows. Dual Wielding: When you make the extra attack of the L property, you can add your ability modifier to the damage of the extra attack if that attack is with a crossbow that has the L property and you are"
    },
    {
      "name": "Crusher",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Push: Once per turn, when you hit a creature with an attack that deals Bludgeoning damage, you can move it 5 feet to an unoccupied space if the target is no more than one size larger than you. Enhanced Critical: When you score a Critical Hit that deals Bludgeoning damage to a creature, attack rolls against that creature have Advantage until the start of your next turn."
    },
    {
      "name": "Defense",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "While you're wearing Light, Medium, or Heavy armor, you gain a +1 bonus to Armor Class."
    },
    {
      "name": "Defensive Duelist",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "dex": 1
      },
      "desc": "You gain the following benefits. Parry: If you're holding a Finesse weapon and another creature hits you with a melee attack, you can take a Reaction to add your Proficiency to your Armor Class, potentially causing the attack to miss you. You gain this bonus to your AC against melee attacks until the start of your next turn."
    },
    {
      "name": "Druidic Warrior",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "FS:R",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You learn two Druid cantrips of your choice. Guidance and Starry Wisp are recommended. The chosen cantrips count as Ranger spells for you, and Wisdom is your spellcasting ability for them. Whenever you gain a Ranger level, you can replace one of these cantrips with another Druid cantrip."
    },
    {
      "name": "Dual Wielder",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, STR 13+, Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Enhanced Dual Wielding: When you take the Attack action on your turn and attack with a weapon that has the L property, you can make one extra attack as a Bonus Action later on the same turn with a different weapon, which must be a Melee weapon that lacks the 2H property. You don't add your ability modifier to the extra attack's damage unless that modifier is negative. Quick Draw: You can draw or stow two weapons that lack the 2H property when you would normally be able to draw or stow only one."
    },
    {
      "name": "Dueling",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When you're holding a Melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon."
    },
    {
      "name": "Durable",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "con": 1
      },
      "desc": "You gain the following benefits. Defy Death: You have Advantage on Death Saving Throw. Speedy Recovery: As a Bonus Action, you can expend one of your Hit Point Dice, roll the die, and regain a number of Hit Points equal to the roll."
    },
    {
      "name": "Elemental Adept",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": true,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Energy Mastery: Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. Spells you cast ignore Resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. Repeatable: You can take this feat more than once, but you must choose a different damage type each time for Energy Mastery."
    },
    {
      "name": "Fey-Touched",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Your exposure to the Feywild's magic grants you the following benefits. Fey Magic: Choose one level 1 spell from the Divination or Enchantment school of magic. You always have that spell and the Misty Step spell prepared. You can cast each of these spells without expending a spell slot. Once you cast either spell in this way, you can't cast that spell in this way again until you finish a Long Rest. You can also cast these spells using spell slots you have of the appropriate level. The spells' spellcasting ability is the ability increased by this feat."
    },
    {
      "name": "Grappler",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, STR 13+, Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Punch and Grab: When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can use both the Damage and the Grapple option. You can use this benefit only once per turn. Attack Advantage: You have Advantage on attack rolls against a creature Grappled by you. Fast Wrestler: You don't have to spend extra movement to move a creature Grappled by you if the creature is your size or smaller."
    },
    {
      "name": "Great Weapon Fighting",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When you roll damage for an attack you make with a Melee weapon that you are holding with two hands, you can treat any 1 or 2 on a damage die as a 3. The weapon must have the 2h or V property to gain this benefit."
    },
    {
      "name": "Great Weapon Master",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, STR 13+",
      "repeatable": false,
      "ability_bonus": {
        "str": 1
      },
      "desc": "You gain the following benefits. Heavy Weapon Mastery: When you hit a creature with a weapon that has the H property as part of the Attack action on your turn, you can cause the weapon to deal extra damage to the target. The extra damage equals your Proficiency. Hew: Immediately after you score a Critical Hit with a Melee weapon or reduce a creature to 0 Hit Points with one, you can make one attack with the same weapon as a Bonus Action."
    },
    {
      "name": "Healer",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You gain the following benefits. Battle Medic: If you have a Healer's Kit, you can expend one use of it and tend to a creature within 5 feet of yourself as a Utilize action. That creature can expend one of its Hit Point Dice, and you then roll that die. The creature regains a number of Hit Points equal to the roll plus your Proficiency. Healing Rerolls: Whenever you roll a die to determine the number of Hit Points you restore with a spell or with this feat's Battle Medic benefit, you can reroll the die if it rolls a 1, and you must use the new roll."
    },
    {
      "name": "Heavily Armored",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, Proficiency",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "con",
            "str"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Armor Training: You gain training with Heavy armor."
    },
    {
      "name": "Heavy Armor Master",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, Proficiency",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "con",
            "str"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Damage Reduction: When you're hit by an attack while you're wearing Heavy armor, any Bludgeoning, Piercing, and Slashing damage dealt to you by that attack is reduced by an amount equal to your Proficiency."
    },
    {
      "name": "Inspiring Leader",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, WIS 13+, Level 4+, CHA 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Bolstering Performance: When you finish a Short Rest or Long Rest, you can give an inspiring performance: a speech, song, or dance. When you do so, choose up to six allies (which can include yourself) within 30 feet of yourself who witness the performance. The chosen creatures each gain Temporary Hit Points equal to your character level plus the modifier of the ability you increased with this feat."
    },
    {
      "name": "Interception",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When a creature you can see hits another creature within 5 feet of you with an attack roll, you can take a Reaction to reduce the damage dealt to the target by 1d10 plus your Proficiency. You must be holding a Shield or a Simple or Martial weapon to use this Reaction."
    },
    {
      "name": "Keen Mind",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, INT 13+",
      "repeatable": false,
      "ability_bonus": {
        "int": 1
      },
      "desc": "You gain the following benefits. Lore Knowledge: Choose one of the following skills: Arcana, History, Investigation, Nature, or Religion. If you lack proficiency in the chosen skill, you gain proficiency in it, and if you already have proficiency in it, you gain Expertise in it. Quick Study: You can take the Study action as a Bonus Action."
    },
    {
      "name": "Lightly Armored",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Armor Training: You gain training with Light armor and Shields."
    },
    {
      "name": "Lucky",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You gain the following benefits. Luck Points: You have a number of Luck Points equal to your Proficiency and can spend the points on the benefits below. You regain your expended Luck Points when you finish a Long Rest. Advantage: When you roll a d20 for a D20 Test, you can spend 1 Luck Point to give yourself Advantage on the roll. Disadvantage: When a creature rolls a d20 for an attack roll against you, you can spend 1 Luck Point to impose Disadvantage on that roll."
    },
    {
      "name": "Mage Slayer",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Concentration Breaker: When you damage a creature that is Concentration, it has Disadvantage on the saving throw it makes to maintain Concentration. Guarded Mind: If you fail an Intelligence, a Wisdom, or a Charisma saving throw, you can cause yourself to succeed instead. Once you use this benefit, you can't use it again until you finish a Short Rest or Long Rest."
    },
    {
      "name": "Magic Initiate",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": true,
      "ability_bonus": {},
      "desc": "You gain the following benefits. Two Cantrips: You learn two cantrips of your choice from the Cleric, Druid, or Wizard spell list. Intelligence, Wisdom, or Charisma is your spellcasting ability for this feat's spells (choose when you select this feat). Level 1 Spell: Choose a level 1 spell from the same list you selected for this feat's cantrips. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have. Spell Change: Whenever you gain "
    },
    {
      "name": "Martial Weapon Training",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Weapon Proficiency: You gain proficiency with Martial weapons."
    },
    {
      "name": "Medium Armor Master",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, Proficiency",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Dexterous Wearer: While you're wearing Medium armor, you can add 3, rather than 2 to your AC if you have a Dexterity score of 16 or higher."
    },
    {
      "name": "Moderately Armored",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, Proficiency",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Armor Training: You gain training with Medium armor."
    },
    {
      "name": "Mounted Combatant",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "wis"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Mounted Strike: While mounted, you have Advantage on attack rolls against any unmounted creature within 5 feet of your mount that is at least one size smaller than the mount. Leap Aside: If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw and only half damage if it fails. For your mount to gain this benefit, you must be riding it, and neither of you can have the Incapacitated condition. Veer: While mounted, you can force an attack that hit"
    },
    {
      "name": "Musician",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You gain the following benefits. Instrument Training: You gain proficiency with three Musical Instruments of your choice. Encouraging Song: As you finish a Short Rest or Long Rest, you can play a song on a Musical Instrument with which you have proficiency and give Heroic Inspiration to allies who hear the song. The number of allies you can affect in this way equals your Proficiency."
    },
    {
      "name": "Observant",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, INT 13+, Level 4+, WIS 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Keen Observer: Choose one of the following skills: Insight, Investigation, or Perception. If you lack proficiency with the chosen skill, you gain proficiency in it, and if you already have proficiency in it, you gain Expertise in it. Quick Search: You can take the Search action as a Bonus Action."
    },
    {
      "name": "Piercer",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Puncture: Once per turn, when you hit a creature with an attack that deals Piercing damage, you can reroll one of the attack's damage dice, and you must use the new roll. Enhanced Critical: When you score a Critical Hit that deals Piercing damage to a creature, you can roll one additional damage die when determining the extra Piercing damage the target takes."
    },
    {
      "name": "Poisoner",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "dex",
            "int"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Potent Poison: When you make a damage roll that deals Poison damage, it ignores Resistance to Poison damage. Brew Poison: You gain proficiency with the Poisoner's Kit. With 1 hour of work using such a kit and expending 50 GP worth of materials, you can create a number of poison doses equal to your Proficiency. As a Bonus Action, you can apply a poison dose to a weapon or piece of ammunition. Once applied, the poison retains its potency for 1 minute or until you deal damage with the poisoned item, whichever is shorter. When a creature takes damage from the poiso"
    },
    {
      "name": "Polearm Master",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, STR 13+, Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "dex",
            "str"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Pole Strike: Immediately after you take the Attack action and attack with a Quarterstaff, a Spear, or a weapon that has the Heavy and Reach properties, you can use a Bonus Action to make a melee attack with the opposite end of the weapon. The weapon deals Bludgeoning damage, and the weapon's damage die for this attack is a d4. Reactive Strike: While you're holding a Quarterstaff, a Spear, or a weapon that has the Heavy and Reach properties, you can take a Reaction to make one melee attack against a creature that enters the reach you have with that weapon."
    },
    {
      "name": "Protection",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When a creature you can see attacks a target other than you that is within 5 feet of you, you can take a Reaction to interpose your Shield if you're holding one. You impose Disadvantage on the triggering attack roll and all other attack rolls against the target until the start of your next turn if you remain within 5 feet of the target."
    },
    {
      "name": "Resilient",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Saving Throw Proficiency: You gain saving throw proficiency with the chosen ability."
    },
    {
      "name": "Ritual Caster",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, INT 13+, Level 4+, WIS 13+, Level 4+, CHA 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Ritual Spells: Choose a number of level 1 spells equal to your Proficiency that have the Ritual tag. You always have those spells prepared, and you can cast them with any spell slots you have. The spells' spellcasting ability is the ability increased by this feat. Whenever your Proficiency increases thereafter, you can add an additional level 1 spell with the Ritual tag to the spells always prepared with this feature. Quick Ritual: With this benefit, you can cast a Ritual spell that you have prepared using its regular casting time rather than the extended time "
    },
    {
      "name": "Savage Attacker",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You've trained to deal particularly damaging strikes. Once per turn when you hit a target with a weapon, you can roll the weapon's damage dice twice and use either roll against the target."
    },
    {
      "name": "Sentinel",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, STR 13+, Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Guardian: Immediately after a creature within 5 feet of you takes the Disengage action or hits a target other than you with an attack, you can make an Opportunity Attack against that creature. Halt: When you hit a creature with an Opportunity Attack, the creature's Speed becomes 0 for the rest of the current turn."
    },
    {
      "name": "Shadow-Touched",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Your exposure to the Shadowfell's magic grants you the following benefits. Shadow Magic: Choose one level 1 spell from the Illusion or Necromancy school of magic. You always have that spell and the Invisibility spell prepared. You can cast each of these spells without expending a spell slot. Once you cast either spell in this way, you can't cast that spell in this way again until you finish a Long Rest. You can also cast these spells using spell slots you have of the appropriate level. The spells' spellcasting ability is the ability increased by this feat."
    },
    {
      "name": "Sharpshooter",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "dex": 1
      },
      "desc": "You gain the following benefits. Bypass Cover: Your ranged attacks with weapons ignore Cover and Cover. Firing in Melee: Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with Ranged weapons. Long Shots: Attacking at long range doesn't impose Disadvantage on your attack rolls with Ranged weapons."
    },
    {
      "name": "Shield Master",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, Proficiency",
      "repeatable": false,
      "ability_bonus": {
        "str": 1
      },
      "desc": "You gain the following benefits. Shield Bash: If you attack a creature within 5 feet of you as part of the Attack action and hit with a Melee weapon, you can immediately bash the target with your Shield if it's equipped, forcing the target to make a Strength saving throw (8 plus your Strength modifier and Proficiency). On a failed save, you either push the target 5 feet from you or cause it to have the Prone condition (your choice). You can use this benefit only once on each of your turns. Interpose Shield: If you're subjected to an effect that allows you to make a Dexterity saving throw to ta"
    },
    {
      "name": "Skill Expert",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Skill Proficiency: You gain proficiency in one skill of your choice. Expertise: Choose one skill in which you have proficiency but lack Expertise. You gain Expertise with that skill."
    },
    {
      "name": "Skilled",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": true,
      "ability_bonus": {},
      "desc": "You gain proficiency in any combination of three Skill List; Skills or tools of your choice. Repeatable: You can take this feat more than once."
    },
    {
      "name": "Skulker",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, DEX 13+",
      "repeatable": false,
      "ability_bonus": {
        "dex": 1
      },
      "desc": "You gain the following benefits. Blindsight: You have Blindsight with a range of 10 feet. Fog of War: You exploit the distractions of battle, gaining Advantage on any Dexterity (Stealth) check you make as part of the Hide action during combat. Sniper: If you make an attack roll while hidden and the roll misses, making the attack roll doesn't reveal your location."
    },
    {
      "name": "Slasher",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Hamstring: Once per turn when you hit a creature with an attack that deals Slashing damage, you can reduce the Speed of that creature by 10 feet until the start of your next turn. Enhanced Critical: When you score a Critical Hit that deals Slashing damage to a creature, it has Disadvantage on attack rolls until the start of your next turn."
    },
    {
      "name": "Speedy",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+, DEX 13+, Level 4+, CON 13+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "dex",
            "con"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Speed Increase: Your Speed increases by 10 feet. Dash over Difficult Terrain: When you take the Dash action on your turn, Difficult Terrain doesn't cost you extra movement for the rest of that turn. Agile Movement: Opportunity Attack have Disadvantage against you."
    },
    {
      "name": "Spell Sniper",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Bypass Cover: Your attack rolls for spells ignore Cover and Cover. Casting in Melee: Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with spells. Increased Range: When you cast a spell that has a range of at least 10 feet and requires you to make an attack roll, you can increase the spell's range by 60 feet."
    },
    {
      "name": "Tavern Brawler",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You gain the following benefits. Enhanced Unarmed Strike: When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d4 plus your Strength modifier instead of the normal damage of an Unarmed Strike. Damage Rerolls: Whenever you roll a damage die for your Unarmed Strike, you can reroll the die if it rolls a 1, and you must use the new roll. Improvised Weaponry: You have proficiency with improvised weapons. Push: When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can deal damage to the target and also push it 5 feet"
    },
    {
      "name": "Telekinetic",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Minor Telekinesis: You learn the Mage Hand spell. You can cast it without Verbal or Somatic components, you can make the spectral hand Invisible, and its range and the distance it can be away from you both increase by 30 feet when you cast it. The spell's spellcasting ability is the ability increased by this feat. Telekinetic Shove: As a Bonus Action, you can telekinetically shove one creature you can see within 30 feet of yourself. When you do so, the target must succeed on a Strength saving throw (8 plus the ability modifier of the score increased by this fea"
    },
    {
      "name": "Telepathic",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Telepathic Utterance: You can speak telepathically to any creature you can see within 60 feet of yourself. Your telepathic utterances are in a language you know, and the creature understands you only if it knows that language. Your communication doesn't give the creature the ability to respond to you telepathically. Detect Thoughts: You always have the Detect Thoughts spell prepared. You can cast it without a spell slot or spell components, and you must finish a Long Rest before you can cast it in this way again. You can also cast it using spell slots you have "
    },
    {
      "name": "Thrown Weapon Fighting",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When you hit with a ranged attack roll using a weapon that has the T property, you gain a +2 bonus to the damage roll."
    },
    {
      "name": "Tough",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Origin",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Your Hit Points maximum increases by an amount equal to twice your character level when you gain this feat. Whenever you gain a character level thereafter, your Hit Points maximum increases by an additional 2 Hit Points."
    },
    {
      "name": "Two-Weapon Fighting",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When you make an extra attack as a result of using a weapon that has the L property, you can add your ability modifier to the damage of that attack if you aren't already adding it to the damage."
    },
    {
      "name": "Unarmed Fighting",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "Fighting Style",
      "prerequisite": "Fighting Style",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d6 plus your Strength modifier instead of the normal damage of an Unarmed Strike. If you aren't holding any weapons or a Shield when you make the attack roll, the d6 becomes a d8. At the start of each of your turns, you can deal 1d4 Bludgeoning damage to one creature Grappled by you."
    },
    {
      "name": "War Caster",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Concentration: You have Advantage on Constitution saving throws that you make to maintain Concentration. Reactive Spell: When a creature provokes an Opportunity Attack from you by leaving your reach, you can take a Reaction to cast a spell at the creature rather than making an Opportunity Attack. The spell must have a casting time of one action and must target only that creature. Somatic Components: You can perform the Somatic components of spells even when you have weapons or a Shield in one or both hands."
    },
    {
      "name": "Weapon Master",
      "source": "PHB 2024",
      "source_key": "XPHB",
      "category": "General",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You gain the following benefits. Mastery Property: Your training with weapons allows you to use the mastery property of one kind of Simple or Martial weapon of your choice, provided you have proficiency with it. Whenever you finish a Long Rest, you can change the kind of weapon to another eligible kind."
    },
    {
      "name": "Actor",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "cha": 1
      },
      "desc": "Skilled at mimicry and dramatics, you gain the following benefits: You have advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person. You can mimic the speech of another person or the sounds made by other creatures. You must have heard the person speaking, or heard the creature make the sound, for at least 1 minute. A successful Wisdom (Insight) check contested by your Charisma (Deception) check allows a listener to determine that the effect is faked."
    },
    {
      "name": "Adept of the Black Robes",
      "source": "Dragonlance",
      "source_key": "DSotDQ",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You chose the moon Nuitari to influence your magic, and your ambition and loyalty to the Order of the Black Robes have been recognized, granting you these benefits: You learn one 2nd-level spell of your choice. The 2nd-level spell must be from the enchantment or necromancy school of magic. You can cast this feat's 2nd-level spell without a spell slot, and you must finish a long rest before you can cast it in this way again. You can also cast this spell using spell slots you have of the appropriate level. The spell's spellcasting ability is the one chosen when you gained the Initiate of High So"
    },
    {
      "name": "Adept of the Red Robes",
      "source": "Dragonlance",
      "source_key": "DSotDQ",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You chose the moon Lunitari to influence your magic, and your dedication to maintaining the balance between all things has been recognized by the Order of the Red Robes, granting you these benefits: You learn one 2nd-level spell of your choice. The 2nd-level spell must be from the illusion or transmutation school of magic. You can cast this feat's 2nd-level spell without a spell slot, and you must finish a long rest before you can cast it in this way again. You can also cast this spell using spell slots you have of the appropriate level. The spell's spellcasting ability is the one chosen when "
    },
    {
      "name": "Adept of the White Robes",
      "source": "Dragonlance",
      "source_key": "DSotDQ",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You chose the moon Solinari to influence your magic, and your oath to use magic to make the world a better place has been recognized by the Order of the White Robes, granting you these benefits: You learn one 2nd-level spell of your choice. The 2nd-level spell must be from the abjuration or divination school of magic. You can cast this feat's 2nd-level spell without a spell slot, and you must finish a long rest before you can cast it in this way again. You can also cast this spell using spell slots you have of the appropriate level. The spell's spellcasting ability is the one chosen when you g"
    },
    {
      "name": "Alert",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Always on the lookout for danger, you gain the following benefits: You gain a +5 bonus to initiative. You can't be surprised while you are conscious. Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you."
    },
    {
      "name": "Artificer Initiate",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You've learned some of an artificer's inventiveness: You learn one cantrip of your choice from the artificer spell list, and you learn one 1st-level spell of your choice from that list. Intelligence is your spellcasting ability for these spells. You can cast this feat's 1st-level spell without a spell slot, and you must finish a long rest before you can cast it in this way again. You can also cast the spell using any spell slots you have. You gain proficiency with one type of artisan's tools of your choice, and you can use that type of tool as a spellcasting focus for any spell you cast that u"
    },
    {
      "name": "Athlete",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You have undergone extensive physical training to gain the following benefits: When you are prone, standing up uses only 5 feet of your movement. Climbing doesn't cost you extra movement. You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet."
    },
    {
      "name": "Bountiful Luck",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "halfling",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Your people have extraordinary luck, which you have learned to mystically lend to your companions when you see them falter. You're not sure how you do it; you just wish it, and it happens. Surely a sign of fortune's favor! When an ally you can see within 30 feet of you rolls a 1 on the d20 for an attack roll, an ability check, or a saving throw, you can use your reaction to let the ally reroll the die. The ally must use the new roll. When you use this ability, you can't use your Lucky racial trait before the end of your next turn."
    },
    {
      "name": "Charger",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature. If you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack's damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove and you succeed)."
    },
    {
      "name": "Chef",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "con",
            "wis"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Time spent mastering the culinary arts has paid off, granting you the following benefits: You gain proficiency with cook's utensils if you don't already have it. As part of a short rest, you can cook special food, provided you have ingredients and cook's utensils on hand. You can prepare enough of this food for a number of creatures equal to 4 + your proficiency bonus. At the end of the short rest, any creature who eats the food and spends one or more Hit Dice to regain hit points regains an extra 1d8 hit points. With one hour of work or when you finish a long rest, you can cook a number of tr"
    },
    {
      "name": "Crossbow Expert",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Thanks to extensive practice with the crossbow, you gain the following benefits: You ignore the loading quality of crossbows with which you are proficient. Being within 5 feet of a hostile creature doesn't impose disadvantage on your ranged attack rolls. When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding."
    },
    {
      "name": "Crusher",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You are practiced in the art of crushing your enemies, granting you the following benefits: Once per turn, when you hit a creature with an attack that deals bludgeoning damage, you can move it 5 feet to an unoccupied space, provided the target is no more than one size larger than you. When you score a critical hit that deals bludgeoning damage to a creature, attack rolls against that creature are made with advantage until the start of your next turn."
    },
    {
      "name": "Defensive Duelist",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "DEX 13+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you."
    },
    {
      "name": "Divinely Favored",
      "source": "Dragonlance",
      "source_key": "DSotDQ",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "A god chose you to carry a spark of their power. You learn one cantrip of your choice from the cleric spell list and one 1st-level spell based on the alignment of your character, as specified in the Alignment Spells table below. You also learn the augury spell. You can cast the chosen 1st-level spell and the augury spell without a spell slot, and you must finish a long rest before you can cast either of these spells in this way again. You can also cast these spells using spell slots you have of the appropriate level. Your spellcasting ability for this feat's spells is Intelligence, Wisdom, or "
    },
    {
      "name": "Dragon Fear",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "dragonborn",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "When angered, you radiate menace. You gain the following benefits: Instead of exhaling destructive energy, you can expend a use of your Breath Weapon trait to roar, forcing each creature of your choice within 30 feet of you to make a Wisdom saving throw (8 + your proficiency bonus + your Charisma modifier). A target automatically succeeds on the save if it can't hear or see you. On a failed save, a target becomes frightened of you for 1 minute. If the frightened target takes any damage, it can repeat the saving throw, ending the effect on itself on a success."
    },
    {
      "name": "Dragon Hide",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "dragonborn",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You manifest scales and claws reminiscent of your draconic ancestors. You gain the following benefits: Your scales harden. While you aren't wearing armor, you can calculate your AC as 13 + your Dexterity modifier. You can use a shield and still gain this benefit. You grow retractable claws from the tips of your fingers. Extending or retracting the claws requires no action. The claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the normal bludgeoning damage for an unarmed strike."
    },
    {
      "name": "Drow High Magic",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "elf",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You learn more of the magic typical of dark elves. You learn the detect magic spell and can cast it at will, without expending a spell slot. You also learn levitate and dispel magic, each of which you can cast once without expending a spell slot. You regain the ability to cast those two spells in this way when you finish a long rest. Charisma is your spellcasting ability for all three spells."
    },
    {
      "name": "Dual Wielder",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You master fighting with two weapons, gaining the following benefits: You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand. You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren't light. You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one."
    },
    {
      "name": "Dungeon Delver",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Alert to the hidden traps and secret doors found in many dungeons, you gain the following benefits: You have advantage on Wisdom (Perception) and Intelligence (Investigation) checks made to detect the presence of secret doors. You have advantage on saving throws made to avoid or resist traps. You have resistance to the damage dealt by traps. Traveling at a fast pace doesn't impose the normal -5 penalty on your passive Wisdom (Perception) score."
    },
    {
      "name": "Durable",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "con": 1
      },
      "desc": "Hardy and resilient, you gain the following benefits: When you roll a Hit Die to regain hit points, the minimum number of hit points you regain from the roll equals twice your Constitution modifier (minimum of 2)."
    },
    {
      "name": "Dwarven Fortitude",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "dwarf",
      "repeatable": false,
      "ability_bonus": {
        "con": 1
      },
      "desc": "You have the blood of dwarf heroes flowing through your veins. You gain the following benefits: Whenever you take the Dodge action in combat, you can spend one Hit Die to heal yourself. Roll the die, add your Constitution modifier, and regain a number of hit points equal to the total (minimum of 1)."
    },
    {
      "name": "Eldritch Adept",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Studying occult lore, you learn one Eldritch Invocation option of your choice from the warlock class. Your spellcasting ability for the invocation is Intelligence, Wisdom, or Charisma (choose when you select this feat). If the invocation has a prerequisite of any kind, you can choose that invocation only if you're a warlock who meets the prerequisite. Whenever you gain a level, you can replace the invocation with another one from the warlock class."
    },
    {
      "name": "Elemental Adept",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "Spellcasting",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times. Each time you do so, you must choose a different damage type."
    },
    {
      "name": "Elven Accuracy",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "elf or half-elf",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "dex",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "The accuracy of elves is legendary, especially that of elf archers and spellcasters. You have uncanny aim with attacks that rely on precision rather than brute force. You gain the following benefits: Whenever you have advantage on an attack roll using Dexterity, Intelligence, Wisdom, or Charisma, you can reroll one of the dice once."
    },
    {
      "name": "Ember of the Fire Giant",
      "source": "Bigby's",
      "source_key": "BGG",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con",
            "wis"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You've manifested the fiery combat emblematic of fire giants, granting you the following benefits: You have resistance to fire damage. When you take the Attack action on your turn, you can replace a single attack with a magical burst of flame. Each creature of your choice in a 15-foot-radius sphere centered on you must make a Dexterity saving throw (DC equals 8 + your proficiency bonus + the modifier of the ability increased by this feat). On a failed save, a creature takes fire damage equal to 1d8 + your proficiency bonus, and it has the blinded condition until the start of your next turn. On"
    },
    {
      "name": "Fade Away",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "gnome",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "dex",
            "int"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Your people are clever, with a knack for illusion magic. You have learned a magical trick for fading away when you suffer harm. You gain the following benefits: Immediately after you take damage, you can use a reaction to magically become invisible until the end of your next turn or until you attack, deal damage, or force someone to make a saving throw. Once you use this ability, you can't do so again until you finish a short or long rest."
    },
    {
      "name": "Fey Teleportation",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "elf",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Your study of high elven lore has unlocked fey power that few other elves possess, except your eladrin cousins. Drawing on your fey ancestry, you can momentarily stride through the Feywild to shorten your path from one place to another. You gain the following benefits: You learn to speak, read, and write Sylvan. You learn the misty step spell and can cast it once without expending a spell slot. You regain the ability to cast it in this way when you finish a short or long rest. Intelligence is your spellcasting ability for this spell."
    },
    {
      "name": "Fey Touched",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Your exposure to the Feywild's magic has changed you, granting you the following benefits: You learn the misty step spell and one 1st-level spell of your choice. The 1st-level spell must be from the divination or enchantment school of magic. You can cast each of these spells without expending a spell slot. Once you cast either of these spells in this way, you can't cast that spell in this way again until you finish a long rest. You can also cast these spells using spell slots you have of the appropriate level. The spells' spellcasting ability is the ability increased by this feat."
    },
    {
      "name": "Fighting Initiate",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "Proficiency",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Your martial training has helped you develop a particular style of fighting. As a result, you learn one Fighting Style option of your choice from the fighter class. If you already have a style, the one you choose must be different. Whenever you reach a level that grants the Ability Score Improvement feature, you can replace this feat's fighting style with another one from the fighter class that you don't have."
    },
    {
      "name": "Flames of Phlegethos",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "tiefling",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You learn to call on hellfire to serve your commands. You gain the following benefits: When you roll fire damage for a spell you cast, you can reroll any roll of 1 on the fire damage dice, but you must use the new roll, even if it is another 1. Whenever you cast a spell that deals fire damage, you can cause flames to wreathe you until the end of your next turn. The flames don't harm you or your possessions, and they shed bright light out to 30 feet and dim light for an additional 30 feet. While the flames are present, any creature within 5 feet of you that hits you with a melee attack takes 1d"
    },
    {
      "name": "Fury of the Frost Giant",
      "source": "Bigby's",
      "source_key": "BGG",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con",
            "wis"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You've manifested the icy might emblematic of frost giants, granting you the following benefits: You have resistance to cold damage. Immediately after a creature you can see within 30 feet of you hits you with an attack roll and deals damage, you can use your reaction to retaliate with a conjured blast of ice. The creature must make a Constitution saving throw (DC equals 8 + your proficiency bonus + the modifier of the ability increased by this feat). On a failed save, the creature takes cold damage equal to 1d8 + your proficiency bonus, and its speed is reduced to 0 until the end of its next "
    },
    {
      "name": "Grappler",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "STR 13+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You've developed the skills necessary to hold your own in close-quarters grappling. You gain the following benefits: You have advantage on attack rolls against a creature you are grappling. You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends."
    },
    {
      "name": "Great Weapon Master",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits: On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage."
    },
    {
      "name": "Guile of the Cloud Giant",
      "source": "Bigby's",
      "source_key": "BGG",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You've manifested the confounding magic emblematic of cloud giants, granting you the following benefits: When a creature you can see hits you with an attack roll, you can use your reaction to give yourself resistance to that attack's damage. You then teleport to an unoccupied space that you can see within 30 feet of yourself. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
    },
    {
      "name": "Gunner",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "dex": 1
      },
      "desc": "You have a quick hand and keen eye when employing firearms, granting you the following benefits: You gain proficiency with firearms (see \"Firearms\" in the Dungeon Master's Guide). You ignore the LD property of firearms. Being within 5 feet of a hostile creature doesn't impose disadvantage on your ranged attack rolls."
    },
    {
      "name": "Healer",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You are an able physician, allowing you to mend wounds quickly and get your allies back in the fight. You gain the following benefits: When you use a healer's kit to stabilize a dying creature, that creature also regains 1 hit point. As an action, you can spend one use of a healer's kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature's maximum number of Hit Dice. The creature can't regain hit points from this feat again until it finishes a short or long rest."
    },
    {
      "name": "Heavily Armored",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "Proficiency",
      "repeatable": false,
      "ability_bonus": {
        "str": 1
      },
      "desc": "You have trained to master the use of heavy armor, gaining the following benefits: You gain proficiency with heavy armor."
    },
    {
      "name": "Heavy Armor Master",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "Proficiency",
      "repeatable": false,
      "ability_bonus": {
        "str": 1
      },
      "desc": "You can use your armor to deflect strikes that would kill others. You gain the following benefits: While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from nonmagical attacks is reduced by 3."
    },
    {
      "name": "Infernal Constitution",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "tiefling",
      "repeatable": false,
      "ability_bonus": {
        "con": 1
      },
      "desc": "Fiendish blood runs strong in you, unlocking a resilience akin to that possessed by some fiends. You gain the following benefits: You have resistance to cold and poison damage. You have advantage on saving throws against being poisoned."
    },
    {
      "name": "Initiate of High Sorcery",
      "source": "Dragonlance",
      "source_key": "DSotDQ",
      "category": "",
      "prerequisite": "Level {'level': 1, 'class': {'name': 'Sorcerer', 'visible': True}}+, Level {'level': 1, 'class': {'name': 'Wizard', 'visible': True}}+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You've received training from magic-users affiliated with the Mages of High Sorcery. Choose one of the three moons of Krynn to influence your magic: the black moon, Nuitari; the red moon, Lunitari; or the white moon, Solinari. You learn one cantrip of your choice from the wizard spell list and two 1st-level spells based on the moon you choose, as specified in the Lunar Spells table. You can cast each of the chosen 1st-level spells without a spell slot, and you must finish a long rest before you can cast them in this way again. You can also cast the spells using any spell slots you have. Your s"
    },
    {
      "name": "Inspiring Leader",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "CHA 13+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You can spend 10 minutes inspiring your companions, shoring up their resolve to fight. When you do so, choose up to six friendly creatures (which can include yourself) within 30 feet of you who can see or hear you and who can understand you. Each creature can gain temporary hit points equal to your level + your Charisma modifier. A creature can't gain temporary hit points from this feat again until it has finished a short or long rest."
    },
    {
      "name": "Keen Mind",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "int": 1
      },
      "desc": "You have a mind that can track time, direction, and detail with uncanny precision. You gain the following benefits: You always know which way is north. You always know the number of hours left before the next sunrise or sunset. You can accurately recall anything you have seen or heard within the past month."
    },
    {
      "name": "Keenness of the Stone Giant",
      "source": "Bigby's",
      "source_key": "BGG",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con",
            "wis"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You've manifested the physical talents emblematic of stone giants, granting you the following benefits: You gain darkvision with a range of 60 feet. If you already have darkvision from another source, its range increases by 60 feet. As a bonus action, you can take a rock and make a magical attack with it. The attack is a ranged spell attack with a range of 60 feet that uses the ability score you increased with this feat as the spellcasting ability. On a hit, the rock deals 1d10 force damage, and the target must succeed on a Strength saving throw (DC equals 8 + your proficiency bonus + the spel"
    },
    {
      "name": "Knight of the Crown",
      "source": "Dragonlance",
      "source_key": "DSotDQ",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You are a Knight of Solamnia aligned with the Order of the Crown, a group that extols the virtues of cooperation, loyalty, and obedience. You excel in group combat and gain these benefits: As a bonus action, you can command one ally within 30 feet of yourself to attack. If that ally can see or hear you, they can immediately make one weapon attack as a reaction. If the attack hits, the ally can roll a d8 and add the number rolled as a bonus to the attack's damage roll. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you fini"
    },
    {
      "name": "Knight of the Rose",
      "source": "Dragonlance",
      "source_key": "DSotDQ",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "con",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You are a Knight of Solamnia aligned with the Order of the Rose, a group known for leadership, justice, and wisdom. Your resolve grants you these benefits: As a bonus action, you can encourage one creature you can see within 30 feet of yourself (you can choose yourself). If the target can see or hear you, the target gains temporary hit points equal to 1d8 + your proficiency bonus + the ability modifier of the ability score increased by this feat. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. Knight"
    },
    {
      "name": "Knight of the Sword",
      "source": "Dragonlance",
      "source_key": "DSotDQ",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You are a Knight of Solamnia aligned with the Order of the Sword, a group devoted to heroism and courage. Bravery steels your spirit, granting you these benefits: Once per turn, when you hit a creature with a weapon attack roll, you can attempt to frighten that target. The target must make a Wisdom saving throw (DC equals 8 + your proficiency bonus + the ability modifier of the score increased by this feat). On a failed save, the target is frightened of you until the end of your next turn. On a successful save, the target has disadvantage on the next attack roll it makes before the end of its "
    },
    {
      "name": "Lightly Armored",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You have trained to master the use of light armor, gaining the following benefits: You gain proficiency with light armor."
    },
    {
      "name": "Linguist",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "int": 1
      },
      "desc": "You have studied languages and codes, gaining the following benefits: You learn three languages of your choice. You can ably create written ciphers. Others can't decipher a code you create unless you teach them, they succeed on an Intelligence check (DC equal to your Intelligence score + your proficiency bonus), or they use magic to decipher it."
    },
    {
      "name": "Lucky",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have inexplicable luck that seems to kick in at just the right moment. You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw. You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker's roll or yours. If more than one "
    },
    {
      "name": "Mage Slayer",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have practiced techniques useful in melee combat against spellcasters, gaining the following benefits: When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature. When you damage a creature that is concentration on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration. You have advantage on saving throws against spells cast by creatures within 5 feet of you."
    },
    {
      "name": "Magic Initiate",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class's spell list. In addition, choose one 1st-level spell to learn from that same list. Using this feat, you can cast the spell once at its lowest level, and you must finish a long rest before you can cast it in this way again. Your spellcasting ability for these spells depends on the class you chose: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; or Intelligence for wizard."
    },
    {
      "name": "Martial Adept",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have martial training that allows you to perform special combat maneuvers. You gain the following benefits: You learn two maneuvers of your choice from among those available to the fighter archetype in the fighter class. If a maneuver you use requires your target to make a saving throw to resist the maneuver's effects, the saving throw DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice). You gain one superiority die, which is a d6 (this die is added to any superiority dice you have from another source). This die is used to fuel your maneuvers. A superio"
    },
    {
      "name": "Medium Armor Master",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "Proficiency",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have practiced moving in medium armor to gain the following benefits: Wearing medium armor doesn't impose disadvantage on your Dexterity (Stealth) checks. When you wear medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity of 16 or higher."
    },
    {
      "name": "Metamagic Adept",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You've learned how to exert your will on your spells to alter how they function: You learn two Metamagic options of your choice from the sorcerer class. You can use only one Metamagic option on a spell when you cast it, unless the option says otherwise. Whenever you reach a level that grants the Ability Score Improvement feature, you can replace one of these Metamagic options with another one from the sorcerer class. You gain 2 sorcery points to spend on Metamagic (these points are added to any sorcery points you have from another source but can be used only on Metamagic). You regain all spent"
    },
    {
      "name": "Mobile",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You are exceptionally speedy and agile. You gain the following benefits: Your speed increases by 10 feet. When you use the Dash action, difficult terrain doesn't cost you extra movement on that turn. When you make a melee attack against a creature, you don't provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not."
    },
    {
      "name": "Moderately Armored",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "Proficiency",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You have trained to master the use of medium armor and shields, gaining the following benefits: You gain proficiency with medium armor and shields."
    },
    {
      "name": "Mounted Combatant",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You are a dangerous foe to face while mounted. While you are mounted and aren't incapacitated, you gain the following benefits: You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount. You can force an attack targeted at your mount to target you instead. If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails."
    },
    {
      "name": "Observant",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Quick to notice details of your environment, you gain the following benefits: If you can see a creature's mouth while it is speaking a language you understand, you can interpret what it's saying by reading its lips. You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores."
    },
    {
      "name": "Orcish Fury",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "half-orc",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Your fury burns tirelessly. You gain the following benefits: When you hit with an attack using a simple or martial weapon, you can roll one of the weapon's damage dice an additional time and add it as extra damage of the weapon's damage type. Once you use this ability, you can't use it again until you finish a short or long rest. Immediately after you use your Relentless Endurance trait, you can use your reaction to make one weapon attack."
    },
    {
      "name": "Piercer",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You have achieved a penetrating precision in combat, granting you the following benefits: Once per turn, when you hit a creature with an attack that deals piercing damage, you can reroll one of the attack's damage dice, and you must use the new roll. When you score a critical hit that deals piercing damage to a creature, you can roll one additional damage die when determining the extra piercing damage the target takes."
    },
    {
      "name": "Poisoner",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You can prepare and deliver deadly poisons, granting you the following benefits: When you make a damage roll that deals poison damage, it ignores resistance to poison damage. You can apply poison to a weapon or piece of ammunition as a bonus action, instead of an action. You gain proficiency with the poisoner's kit if you don't already have it. With one hour of work using a poisoner's kit and expending 50 gp worth of materials, you can create a number of doses of potent poison equal to your proficiency bonus. Once applied to a weapon or piece of ammunition, the poison retains its potency for 1"
    },
    {
      "name": "Polearm Master",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You can keep your enemies at bay with reach weapons. You gain the following benefits: When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon; this attack uses the same ability modifier as the primary attack. The weapon's damage die for this attack is a d4, and the attack deals bludgeoning damage. While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter the reach you have with that wea"
    },
    {
      "name": "Prodigy",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "half-elf or half-orc or human",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have a knack for learning new things. You gain the following benefits: You gain one skills of your choice, one tool proficiency of your choice, and fluency in one language of your choice. Choose one skill in which you have proficiency. You gain expertise with that skill, which means your proficiency bonus is doubled for any ability check you make with it. The skill you choose must be one that isn't already benefiting from a feature, such as Expertise, that doubles your proficiency bonus."
    },
    {
      "name": "Resilient",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Choose one ability score. You gain the following benefits: You gain proficiency in saving throws using the chosen ability."
    },
    {
      "name": "Ritual Caster",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "INT 13+, WIS 13+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have learned a number of spells that you can cast as rituals. These spells are written in a ritual book, which you must have in hand while casting one of them. When you choose this feat, you acquire a ritual book holding two 1st-level spells of your choice. Choose one of the following classes: bard, cleric, druid, sorcerer, warlock, or wizard. You must choose your spells from that class's spell list, and the spells you choose must have the ritual tag. The class you choose also determines your spellcasting ability for these spells: Charisma for bard, sorcerer, or warlock; Wisdom for cleric "
    },
    {
      "name": "Rune Shaper",
      "source": "Bigby's",
      "source_key": "BGG",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You've studied the magic of Giant runes, granting you the following benefits: You learn the comprehend languages spell. You can cast this spell without expending a spell slot, and you must finish a long rest before you can cast it in this way again. You can also cast this spell using any spell slots you have. You know a number of runes equal to half your proficiency bonus (rounded down), chosen from the Rune Spells table. Whenever you finish a long rest, you can inscribe each rune you know onto one nonmagical weapon, armor, piece of clothing, or other object you touch. You temporarily learn th"
    },
    {
      "name": "Savage Attacker",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice and use either total."
    },
    {
      "name": "Second Chance",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "halfling",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "dex",
            "con",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Fortune favors you when someone tries to strike you. You gain the following benefits: When a creature you can see hits you with an attack roll, you can use your reaction to force that creature to reroll. Once you use this ability, you can't use it again until you roll initiative at the start of combat or until you finish a short or long rest."
    },
    {
      "name": "Sentinel",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have mastered techniques to take advantage of every drop in any enemy's guard, gaining the following benefits: When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach. When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature."
    },
    {
      "name": "Shadow Touched",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Your exposure to the Shadowfell's magic has changed you, granting you the following benefits: You learn the invisibility spell and one 1st-level spell of your choice. The 1st-level spell must be from the illusion or necromancy school of magic. You can cast each of these spells without expending a spell slot. Once you cast either of these spells in this way, you can't cast that spell in this way again until you finish a long rest. You can also cast these spells using spell slots you have of the appropriate level. The spells' spellcasting ability is the ability increased by this feat."
    },
    {
      "name": "Sharpshooter",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits: Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore Cover and Cover. Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage."
    },
    {
      "name": "Shield Master",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You use shields not just for protection but also for offense. You gain the following benefits while you are wielding a shield: If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield. If you aren't incapacitated, you can add your shield's AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you. If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed on"
    },
    {
      "name": "Skill Expert",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You have honed your proficiency with particular skills, granting you the following benefits: You gain proficiency in one skills of your choice. Choose one skill in which you have proficiency. You gain expertise with that skill, which means your proficiency bonus is doubled for any ability check you make with it. The skill you choose must be one that isn't already benefiting from a feature, such as Expertise, that doubles your proficiency bonus."
    },
    {
      "name": "Skilled",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You gain proficiency in any combination of three skills or tools of your choice."
    },
    {
      "name": "Skulker",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "DEX 13+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You are expert at slinking through shadows. You gain the following benefits: You can try to hide when you are lightly obscured from the creature from which you are hiding. When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn't reveal your position. Dim light doesn't impose disadvantage on your Wisdom (Perception) checks relying on sight."
    },
    {
      "name": "Slasher",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You've learned where to cut to have the greatest results, granting you the following benefits: Once per turn when you hit a creature with an attack that deals slashing damage, you can reduce the speed of the target by 10 feet until the start of your next turn. When you score a critical hit that deals slashing damage to a creature, you grievously wound it. Until the start of your next turn, the target has disadvantage on all attack rolls."
    },
    {
      "name": "Soul of the Storm Giant",
      "source": "Bigby's",
      "source_key": "BGG",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You've manifested the tempest magic emblematic of storm giants, granting you the following benefits: As a bonus action, you surround yourself with an aura of magical wind and lightning that extends 10 feet from you in every direction but not through Cover. The aura lasts until the start of your next turn or until you are incapacitated. While the aura is active, you have resistance to lightning and thunder damage. In addition, attack rolls against you have disadvantage, and whenever another creature starts its turn within the aura, you can force the creature to make a Strength saving throw (DC "
    },
    {
      "name": "Spell Sniper",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "Spellcasting",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have learned techniques to enhance your attacks with certain kinds of spells, gaining the following benefits: When you cast a spell that requires you to make an attack roll, the spell's range is doubled. Your ranged spell attacks ignore Cover and Cover. You learn one cantrip that requires an attack roll. Choose the cantrip from the bard, cleric, druid, sorcerer, warlock, or wizard spell list. Your spellcasting ability for this cantrip depends on the spell list you chose from: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; or Intelligence for wizard."
    },
    {
      "name": "Squat Nimbleness",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "dwarf or small race",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You are uncommonly nimble for your race. You gain the following benefits: Increase your walking speed by 5 feet. You gain proficiency in the Acrobatics or Athletics skill (your choice). You have advantage on any Strength (Athletics) or Dexterity (Acrobatics) check you make to escape from being grappled."
    },
    {
      "name": "Squire of Solamnia",
      "source": "Dragonlance",
      "source_key": "DSotDQ",
      "category": "",
      "prerequisite": "Level {'level': 1, 'class': {'name': 'Fighter', 'visible': True}}+, Level {'level': 1, 'class': {'name': 'Paladin', 'visible': True}}+",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Your training in the ways of the Knights of Solamnia grants you these benefits: Mounting or dismounting costs you only 5 feet of movement. Once per turn, when you make a weapon attack roll against a creature, you can cause the attack roll to have advantage. If the attack hits, you roll a d8 and add the number rolled as a bonus to the attack's damage roll. You can use this benefit a number of times equal to your proficiency bonus, but a use is expended only if the attack hits. You regain all expended uses when you finish a long rest. Knights of Solamnia are only ever members of one of their org"
    },
    {
      "name": "Strike of the Giants",
      "source": "Bigby's",
      "source_key": "BGG",
      "category": "",
      "prerequisite": "Proficiency",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have absorbed primeval magic that gives you an echo of the might of giants. When you take this feat, choose one of the benefits listed below. Once per turn, when you hit a target with a melee weapon attack or a ranged weapon attack using a thrown weapon, you can imbue the attack with an additional effect depending on the benefit you chose: Cloud Strike: The target takes an extra 1d4 thunder damage. If the target is a creature, it must succeed on a Wisdom saving throw, or you become invisible to it until the start of your next turn or until immediately after you make an attack roll or cast "
    },
    {
      "name": "Tavern Brawler",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "Accustomed to rough-and-tumble fighting using whatever weapons happen to be at hand, you gain the following benefits: You are proficient with improvised weapons. Your unarmed strike uses a d4 for damage. When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target."
    },
    {
      "name": "Telekinetic",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You learn to move things with your mind, granting you the following benefits: You learn the mage hand cantrip. You can cast it without verbal or somatic components, and you can make the spectral hand invisible. If you already know this spell, its range increases by 30 feet when you cast it. Its spellcasting ability is the ability increased by this feat. As a bonus action, you can try to telekinetically shove one creature you can see within 30 feet of you. When you do so, the target must succeed on a Strength saving throw (8 + your proficiency bonus + the ability modifier of the score increased"
    },
    {
      "name": "Telepathic",
      "source": "Tasha's",
      "source_key": "TCE",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "int",
            "wis",
            "cha"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You awaken the ability to mentally connect with others, granting you the following benefits: You can speak telepathically to any creature you can see within 60 feet of you. Your telepathic utterances are in a language you know, and the creature understands you only if it knows that language. Your communication doesn't give the creature the ability to respond to you telepathically. You can cast the detect thoughts spell, requiring no spell slot or components, and you must finish a long rest before you can cast it this way again. Your spellcasting ability for the spell is the ability increased b"
    },
    {
      "name": "Tough",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points."
    },
    {
      "name": "Vigor of the Hill Giant",
      "source": "Bigby's",
      "source_key": "BGG",
      "category": "",
      "prerequisite": "Level 4+",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "con",
            "wis"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You've manifested the resilience emblematic of hill giants, granting you the following benefits: When you are subjected to an effect that would move you at least 5 feet or give you the prone condition, you can use your reaction to steady yourself. You aren't moved and don't have the prone condition. Whenever you eat food as part of a short rest and spend one or more Hit Dice to regain hit points, you regain additional hit points equal to your Constitution modifier + your proficiency bonus."
    },
    {
      "name": "War Caster",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "Spellcasting",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits: You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands. When a hostile creature's movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only t"
    },
    {
      "name": "Weapon Master",
      "source": "PHB 2014",
      "source_key": "PHB",
      "category": "",
      "prerequisite": "",
      "repeatable": false,
      "ability_bonus": {
        "choose": {
          "from": [
            "str",
            "dex"
          ],
          "count": 1,
          "amount": 1
        }
      },
      "desc": "You have practiced extensively with a variety of weapons, gaining the following benefits: You gain proficiency with four weapons of your choice. Each one must be a simple or a martial weapon."
    },
    {
      "name": "Wood Elf Magic",
      "source": "Xanathar's",
      "source_key": "XGE",
      "category": "",
      "prerequisite": "elf",
      "repeatable": false,
      "ability_bonus": {},
      "desc": "You learn the magic of the primeval woods, which are revered and protected by your people. You learn one druid cantrip of your choice. You also learn the longstrider and pass without trace spells, each of which you can cast once without expending a spell slot. You regain the ability to cast these two spells in this way when you finish a long rest. Wisdom is your spellcasting ability for all three spells."
    }
  ],
  "magic_items": [
    {
      "name": "Bead of Nourishment",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This flavorless, gelatinous bead dissolves on your tongue and provides as much nourishment as 1 day of Rations."
    },
    {
      "name": "Bead of Nourishment",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This spongy, flavorless, gelatinous bead dissolves on your tongue and provides as much nourishment as 1 day of rations."
    },
    {
      "name": "Bead of Refreshment",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This flavorless, gelatinous bead dissolves in liquid, transforming up to a pint of the liquid into fresh, cold drinking water. The bead has no effect on magical liquids or harmful substances such as poison."
    },
    {
      "name": "Bead of Refreshment",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This spongy, flavorless, gelatinous bead dissolves in liquid, transforming up to a pint of the liquid into fresh, cold drinking water. The bead has no effect on magical liquids or harmful substances such as poison."
    },
    {
      "name": "Boots of False Tracks",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing these boots, you can have them leave tracks like those of any kind of Humanoid of your size."
    },
    {
      "name": "Boots of False Tracks",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Only humanoids can wear these boots. While wearing the boots, you can choose to have them leave tracks like those of another kind of humanoid of your size."
    },
    {
      "name": "Candle of the Deep",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "The flame of this candle isn't extinguished when immersed in water. It gives off light and heat like a normal candle."
    },
    {
      "name": "Candle of the Deep",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "The flame of this candle is not extinguished when immersed in water. It gives off light and heat like a normal candle."
    },
    {
      "name": "Charlatan's Die",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Whenever you roll this six-sided die, you can control which number it rolls."
    },
    {
      "name": "Charlatan's Die",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Whenever you roll this six-sided die, you can control which number it rolls."
    },
    {
      "name": "Cloak of Billowing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this cloak, you can take a Bonus Action to make it billow dramatically for 1 minute."
    },
    {
      "name": "Cloak of Billowing",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this cloak, you can use a bonus action to make it billow dramatically."
    },
    {
      "name": "Cloak of Many Fashions",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this cloak, you can take a Bonus Action to change the style, color, and apparent quality of the garment. The cloak's weight doesn't change. Regardless of its appearance, the cloak can't be anything but a cloak. Although it can duplicate the appearance of other magic cloaks, it doesn't gain their magical properties."
    },
    {
      "name": "Cloak of Many Fashions",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this cloak, you can use a bonus action to change the style, color, and apparent quality of the garment. The cloak's weight doesn't change. Regardless of its appearance, the cloak can't be anything but a cloak. Although it can duplicate the appearance of other magic cloaks, it doesn't gain their magical properties."
    },
    {
      "name": "Clockwork Amulet",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This copper amulet contains tiny interlocking gears and is powered by magic from Mechanus, a plane of clockwork predictability. Faint ticking and whirring noises emanate from within. When you make an attack roll while wearing the amulet, you can forgo rolling the d20 to get a 10 on the die. Once used, this property can't be used again until the next dawn."
    },
    {
      "name": "Clockwork Amulet",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This copper amulet contains tiny interlocking gears and is powered by magic from Mechanus, a plane of clockwork predictability. A creature that puts an ear to the amulet can hear faint ticking and whirring noises coming from within. When you make an attack roll while wearing the amulet, you can forgo rolling the d20 to get a 10 on the die. Once used, this property can't be used again until the next dawn."
    },
    {
      "name": "Clothes of Mending",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This elegant outfit magically mends itself to counteract daily wear and tear. Pieces of the outfit that are destroyed can't be repaired in this way."
    },
    {
      "name": "Clothes of Mending",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This elegant outfit of traveler's clothes magically mends itself to counteract daily wear and tear. Pieces of the outfit that are destroyed can't be repaired in this way."
    },
    {
      "name": "Dark Shard Amulet",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a warlock)",
      "desc": "This amulet is fashioned from a shard of resilient material originating from an otherworldly realm. While you are wearing it, you gain the following benefits. Spellcasting Focus: You can use the amulet as a Spellcasting Focus for your Warlock spells. Unknown Spell: As a Magic action, you can try to cast a cantrip that you don't know. The cantrip must be on the Warlock spell list and have a casting time of an action, and you make a 10 Intelligence (Arcana) check. On a successful check, you cast the spell. On a failed check, the spell fails, and the action used to cast it is wasted. In either ca"
    },
    {
      "name": "Dark Shard Amulet",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a warlock)",
      "desc": "This amulet is fashioned from a single shard of resilient extraplanar material originating from the realm of your warlock patron. While you are wearing it, you gain the following benefits: You can use the amulet as a spellcasting focus for your warlock spells. You can try to cast a cantrip that you don't know. The cantrip must be on the warlock spell list, and you must make a 10 Intelligence (Arcana) check. If the check succeeds, you cast the spell. If the check fails, so does the spell, and the action used to cast the spell is wasted. In either case, you can't use this property again until yo"
    },
    {
      "name": "Dread Helm",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While you're wearing this fearsome steel helm, your eyes glow red and the rest of your face is hidden in shadow."
    },
    {
      "name": "Dread Helm",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This fearsome steel helm makes your eyes glow red while you wear it."
    },
    {
      "name": "Ear Horn of Hearing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While held up to your ear, this horn suppresses the effects of the Deafened condition on you."
    },
    {
      "name": "Ear Horn of Hearing",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While held up to your ear, this horn suppresses the effects of the deafened condition on you, allowing you to hear normally."
    },
    {
      "name": "Enduring Spellbook",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This spellbook, along with anything written on its pages, can't be damaged by fire or water. In addition, the spellbook doesn't deteriorate with age."
    },
    {
      "name": "Enduring Spellbook",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This spellbook, along with anything written on its pages, can't be damaged by fire or immersion in water. In addition, the spellbook doesn't deteriorate with age."
    },
    {
      "name": "Ersatz Eye",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This magical eye replaces a real one that was lost or removed. While the Ersatz Eye is embedded in your eye socket, you can see through the tiny orb as though it were your natural eye. You can insert or remove the Ersatz Eye as a Magic action, and it can't be removed against your will while you are alive."
    },
    {
      "name": "Ersatz Eye",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This artificial eye replaces a real one that was lost or removed. While the ersatz eye is embedded in your eye socket, it can't be removed by anyone other than you, and you can see through the tiny orb as though it were a normal eye."
    },
    {
      "name": "Hat of Vermin",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This hat has 3 charges. While holding the hat, you can take a Magic action to expend 1 charge and summon your choice of a Bat, a Frog, or a Rat. The summoned creature magically appears in the hat and tries to get away from you as quickly as possible. The creature is Indifferent [Attitude] toward you and other creatures, and it isn't under your control. It behaves as an ordinary creature of its kind and disappears after 1 hour or when it drops to 0 Hit Points. The hat regains all expended charges daily at dawn."
    },
    {
      "name": "Hat of Vermin",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This hat has 3 charges. While holding the hat, you can use an action to expend 1 of its charges and speak a command word that summons your choice of a bat, a frog, or a rat. The summoned creature magically appears in the hat and tries to get away from you as quickly as possible. The creature is neither friendly nor hostile, and it isn't under your control. It behaves as an ordinary creature of its kind and disappears after 1 hour or when it drops to 0 hit points. The hat regains all expended charges daily at dawn."
    },
    {
      "name": "Hat of Wizardry",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This cone-shaped hat is adorned with moons and stars. While you are wearing it, you gain the following benefits. Spellcasting Focus: You can use the hat as a Spellcasting Focus for your Wizard spells. Unknown Spell: As a Magic action, you can try to cast a cantrip that you don't know. The cantrip must be on the Wizard spell list and have a casting time of an action, and you make a 10 Intelligence (Arcana) check. On a successful check, you cast the spell. On a failed check, the spell fails, and the action used to cast the spell is wasted. In either case, you can't use this property again until "
    },
    {
      "name": "Hat of Wizardry",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This antiquated, cone—shaped hat is adorned with gold crescent moons and stars. While you are wearing it, you gain the following benefits: You can use the hat as a spellcasting focus for your wizard spells. You can try to cast a cantrip that you don't know. The cantrip must be on the wizard spell list, and you must make a 10 Intelligence (Arcana) check. If the check succeeds, you cast the spell. If the check fails, so does the spell, and the action used to cast the spell is wasted. In either case, you can't use this property again until you finish a long rest."
    },
    {
      "name": "Heward's Handy Spice Pouch",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This belt pouch appears empty and has 10 charges. While holding the pouch, you can take a Magic action to expend 1 charge, name any nonmagical food seasoning (such as salt, pepper, saffron, or cilantro), and remove a pinch of the desired seasoning from the pouch. A pinch is enough to season a single meal. The pouch regains 1d6 + 4 expended charges daily at dawn."
    },
    {
      "name": "Heward's Handy Spice Pouch",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This belt pouch appears empty and has 10 charges. While holding the pouch, you can use an action to expend 1 of its charges, speak the name of any nonmagical food seasoning (such as salt, pepper, saffron, or cilantro), and remove a pinch of the desired seasoning from the pouch. A pinch is enough to season a single meal. The pouch regains 1d6 + 4 expended charges daily at dawn."
    },
    {
      "name": "Horn of Silent Alarm",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This horn has 4 charges and regains 1d4 expended charges daily at dawn. As a Magic action, you can blow the horn while expending 1 charge. One creature of your choice hears the horn's blare, provided that creature is within 600 feet of the horn. No other creature hears the horn."
    },
    {
      "name": "Horn of Silent Alarm",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This horn has 4 charges. When you use an action to blow it, one creature of your choice can hear the horn's blare, provided the creature is within 600 feet of the horn and not deafened. No other creature hears sound coming from the horn. The horn regains 1d4 expended charges daily at dawn."
    },
    {
      "name": "Illuminator's Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo features beautiful calligraphy, images of writing implements, and the like. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Magical Scribing: While this tattoo is on your skin, you can write with your fingertip "
    },
    {
      "name": "Instrument of Illusions",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While you are playing this musical instrument, you can take a Magic action to create harmless, illusory visual effects within a 5-foot Emanation [Area of Effect] originating from the instrument. If you are a Bard, the size of the Emanation [Area of Effect] increases to 15 feet. Sample visual effects include luminous musical notes, a spectral dancer, butterflies, and gently falling snow. The magical effects have neither substance nor sound, and they are obviously illusory. The effects end when you stop playing."
    },
    {
      "name": "Instrument of Illusions",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you are playing this musical instrument, you can create harmless, illusory visual effects within a 5-foot-radius sphere centered on the instrument. If you are a bard, the radius increases to 15 feet. Sample visual effects include luminous musical notes, a spectral dancer, butterflies, and gently falling snow. The magical effects have neither substance nor sound, and they are obviously illusory. The effects end when you stop playing."
    },
    {
      "name": "Instrument of Scribing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This musical instrument has 3 charges and regains all expended charges daily at dawn. While you are playing it, you can take a Magic action to expend 1 charge and write a magical message on a nonmagical object or surface that you can see within 30 feet of yourself. The message can be up to six words long and is written in a language you know. If you are a Bard, you can scribe an additional seven words and make the message glow faintly, allowing it to be seen in nonmagical Darkness. Casting the Dispel Magic spell on the message erases it. Otherwise, the message fades away after 24 hours."
    },
    {
      "name": "Instrument of Scribing",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This musical instrument has 3 charges. While you are playing it, you can use an action to expend 1 charge from the instrument and write a magical message on a nonmagical object or surface that you can see within 30 feet of you. The message can be up to six words long and is written in a language you know. If you are a bard, you can scribe an additional seven words and choose to make the message glow faintly, allowing it to be seen in nonmagical darkness. Casting dispel magic on the message erases it. Otherwise, the message fades away after 24 hours. The instrument regains all expended charges "
    },
    {
      "name": "Lock of Trickery",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This lock appears to be an ordinary Lock (of the type described in chapter 6 of the Player's Handbook) and comes with a single key. The tumblers in this lock magically adjust to thwart burglars. Dexterity checks made to pick the lock have Disadvantage."
    },
    {
      "name": "Lock of Trickery",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This lock appears to be an ordinary lock (of the type described in chapter 5 of the Player's Handbook) and comes with a single key. The tumblers in this lock magically adjust to thwart burglars. Dexterity checks made to pick the lock have disadvantage."
    },
    {
      "name": "Masquerade Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo appears on your body as whatever you desire. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Fluid Ink: As a bonus action, you can shape the tattoo into any color or pattern and move it to any area of your skin."
    },
    {
      "name": "Mystery Key",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A question mark is worked into the head of this key. The key has a 5 chance of unlocking any lock into which it's inserted. Once it unlocks something, the key disappears."
    },
    {
      "name": "Mystery Key",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A question mark is worked into the head of this key. The key has a 5 chance of unlocking any lock into which it's inserted. Once it unlocks something, the key disappears."
    },
    {
      "name": "Orb of Direction",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This orb can be used as an Arcane Focus. While holding this orb, you can take a Magic action to determine which way is magnetic north. Nothing happens if the orb is used in a location that has no magnetic north."
    },
    {
      "name": "Orb of Direction",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While holding this orb, you can use an action to determine which way is north. This property functions only on the Material Plane."
    },
    {
      "name": "Orb of Time",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This orb can be used as an Arcane Focus. While holding the orb, you can take a Magic action to determine whether it is morning, afternoon, evening, or nighttime. This property functions only on the Material Plane."
    },
    {
      "name": "Orb of Time",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While holding this orb, you can use an action to determine whether it is morning, afternoon, evening, or nighttime outside. This property functions only on the Material Plane."
    },
    {
      "name": "Perfume of Bewitching",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tiny vial contains magic perfume, enough for one use. You can take a Magic action to apply the perfume to yourself, and its effect lasts 1 hour. For the duration, you have Advantage on all Charisma (Deception and Persuasion) checks made to influence a creature within 5 feet of yourself."
    },
    {
      "name": "Perfume of Bewitching",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tiny vial contains magic perfume, enough for one use. You can use an action to apply the perfume to yourself, and its effect lasts 1 hour. For the duration, you have advantage on all Charisma checks directed at humanoids of challenge rating 1 or lower. Those subjected to the perfume's effect are not aware that they've been influenced by magic."
    },
    {
      "name": "Pipe of Smoke Monsters",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While smoking this pipe, you can take a Magic action to exhale a puff of smoke that takes the form of a creature, such as a dragon, a flumph, or a slaad. The form must be small enough to fit in a 1-foot cube and loses its shape after a few seconds, becoming an ordinary puff of smoke."
    },
    {
      "name": "Pipe of Smoke Monsters",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While smoking this pipe, you can use an action to exhale a puff of smoke that takes the form of a single creature, such as a dragon, a flumph, or a froghemoth. The form must be small enough to fit in a 1-foot cube and loses its shape after a few seconds, becoming an ordinary puff of smoke."
    },
    {
      "name": "Pole of Angling",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This item functions as a Pole. While holding it, you can take a Magic action to cause it to transform into a fishing pole with a hook, a line, and a reel, or have the fishing pole revert to a Pole."
    },
    {
      "name": "Pole of Angling",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While holding this 10-foot pole, you can speak a command word and transform it into a fishing pole with a hook, a line, and a reel. Speaking the command word again changes the fishing pole back into a normal 10-foot pole."
    },
    {
      "name": "Pole of Collapsing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This item functions as a Pole. While holding it, you can take a Magic action to collapse it into a 1-foot-long rod for ease of storage (the pole's weight doesn't change) or cause the 1-foot-long rod to revert to a Pole. The rod elongates only as far as the surrounding space allows."
    },
    {
      "name": "Pole of Collapsing",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While holding this 10-foot pole, you can use an action to speak a command word and cause it to collapse into a 1-foot-long rod, for ease of storage. The pole's weight doesn't change. You can use an action to speak a different command word and cause the rod to revert to a pole; however, the rod will elongate only as far as the surrounding space allows."
    },
    {
      "name": "Pot of Awakening",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "If you plant an ordinary shrub in this 10-pound clay pot and let it grow for 30 days, the shrub magically transforms into an Awakened Shrub at the end of that time. When the shrub awakens, its roots break the pot, destroying it. The awakened shrub is Friendly [Attitude] toward you and obeys your commands. Absent commands from you, it does nothing."
    },
    {
      "name": "Pot of Awakening",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "If you plant an ordinary shrub in this 10-pound clay pot and let it grow for 30 days, the shrub magically transforms into an awakened shrub at the end of that time. When the shrub awakens, its roots break the pot, destroying it. The awakened shrub is friendly toward you. Absent commands from you, it does nothing."
    },
    {
      "name": "Potion of Climbing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain a climbing speed equal to your walking speed for 1 hour. During this time, you have advantage on Strength (Athletics) checks you make to climb. The potion is separated into brown, silver, and gray layers resembling bands of stone. Shaking the bottle fails to mix the colors."
    },
    {
      "name": "Potion of Climbing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain a Climb Speed equal to your Speed for 1 hour. During this time, you have Advantage on Strength (Athletics) checks to climb. This potion is separated into brown, silver, and gray layers resembling bands of stone. Shaking the bottle fails to mix the colors."
    },
    {
      "name": "Potion of Comprehension",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the effect of the Comprehend Languages spell for 1 hour. This potion's liquid is a clear concoction with bits of salt and soot swirling in it."
    },
    {
      "name": "Potion of Healing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "You regain 2d4 + 2 hit points when you drink this potion. The potion's red liquid glimmers when agitated."
    },
    {
      "name": "Potion of Healing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "This potion is a magic item. As a Bonus Action, you can drink it or administer it to another creature within 5 feet of yourself. The creature that drinks the magical red fluid in this vial regains 2d4 + 2 Hit Points. The potion's red liquid glimmers when agitated."
    },
    {
      "name": "Prosthetic Limb",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This item replaces a lost limb-a hand, an arm, a foot, a leg, or a similar body part. While the prosthetic is attached, it functions identically to the part it replaces. You can detach or reattach it as an action, and it can't be removed against your will. It detaches if you die."
    },
    {
      "name": "Prosthetic Limb",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This magic item replaces a lost limb—a hand, an arm, a foot, a leg, or a similar body part. While the prosthetic is attached, it functions identically to the part it replaces. You can detach or reattach it as a Magic action, and it can't be removed against your will while you are alive."
    },
    {
      "name": "Rival Coin",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gold coin has a creature embossed on each side. The two depicted creatures must be famous rivals or enemies of each other. For example, a Rival Coin might show Iggwilv on one side and Mordenkainen on the other, or Venger on one side and Tiamat on the other. One of these figures is on the \"heads\" side of the coin, the other on the \"tails\" side. The coin has 1 charge and regains its expended charge daily at dawn. You can take a Magic action to toss the coin, expending its charge. Roll any die to determine whether the coin comes up heads (on an even number) or tails (on an odd number). The r"
    },
    {
      "name": "Rope of Mending",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This 50-foot coil of rope can repair itself when cut into any number of smaller pieces. As a Magic action, you can cause all pieces of the rope that are in contact with each other and not otherwise in use to knit back together. A Rope of Mending is forever shortened if a section of it is lost or destroyed."
    },
    {
      "name": "Rope of Mending",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can cut this 50-foot coil of hempen rope into any number of smaller pieces, and then use an action to speak a command word and cause the pieces to knit back together. The pieces must be in contact with each other and not otherwise in use. A rope of mending is forever shortened if a section of it is lost or destroyed."
    },
    {
      "name": "Ruby of the War Mage",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "Etched with eldritch runes, this 1-inch-diameter ruby allows you to use a Simple or Martial weapon as a Spellcasting Focus for your spells. For this property to work, you must attach the ruby to the weapon by pressing the ruby against it for at least 10 minutes. Thereafter, the ruby can't be removed unless you detach it as a Magic action, the weapon is destroyed, or your Attunement to the ruby ends."
    },
    {
      "name": "Ruby of the War Mage",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "Etched with eldritch runes, this 1-inch-diameter ruby allows you to use a simple or martial weapon as a spellcasting focus for your spells. For this property to work, you must attach the ruby to the weapon by pressing the ruby against it for at least 10 minutes. Thereafter, the ruby can't be removed unless you detach it as an action or the weapon is destroyed. Not even an antimagic field causes it to fall off. The ruby does fall off the weapon if your attunement to the ruby ends."
    },
    {
      "name": "Shield of Expression",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "The front of this Shield is shaped in the likeness of a face. While bearing the Shield, you can take a Bonus Action to alter the face's expression."
    },
    {
      "name": "Shield of Expression",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "The front of this shield is shaped in the likeness of a face. While bearing the shield, you can use a bonus action to alter the face's expression."
    },
    {
      "name": "Spell Scroll (1st Level)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (Cantrip)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (Cantrip)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 10 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Spell Scroll (Level 1)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 11 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Spellwrought Tattoo (1st Level)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Produced by a special needle, this magic tattoo contains a single 1st level spell, wrought on your skin by a magic needle. To use the tattoo, you must hold the needle against your skin and speak the command word. The needle turns into ink that becomes the tattoo, which appears on the skin in whatever design you like. Once the tattoo is there, you can cast its spell, requiring no material components. The tattoo glows faintly while you cast the spell and for the spell's duration. Once the spell ends, the tattoo vanishes from your skin. The Ability modifier for this spell is +3; the Save DC is 13"
    },
    {
      "name": "Spellwrought Tattoo (Cantrip)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Produced by a special needle, this magic tattoo contains a single cantrip, wrought on your skin by a magic needle. To use the tattoo, you must hold the needle against your skin and speak the command word. The needle turns into ink that becomes the tattoo, which appears on the skin in whatever design you like. Once the tattoo is there, you can cast its spell, requiring no material components. The tattoo glows faintly while you cast the spell and for the spell's duration. Once the spell ends, the tattoo vanishes from your skin. The Ability modifier for this spell is +3; the Save DC is 13 and the"
    },
    {
      "name": "Staff of Adornment",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Staff",
      "attunement": "",
      "desc": "If you place a Tiny object weighing no more than 1 pound (such as a shard of crystal, an egg, or a stone) above the tip of this staff while holding it, the object floats an inch from the staff's tip and remains there until it is removed or until the staff is no longer in your possession. The staff can have up to three such objects floating over its tip at any given time. While holding the staff, you can make one or more of the objects slowly spin or turn in place."
    },
    {
      "name": "Staff of Adornment",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Staff",
      "attunement": "",
      "desc": "If you place an object weighing no more than 1 pound (such as a shard of crystal, an egg, or a stone) above the tip of the staff while holding it, the object floats an inch from the staff's tip and remains there until it is removed or until the staff is no longer in your possession. The staff can have up to three such objects floating over its tip at any given time. While holding the staff, you can make one or more of the objects slowly spin or turn in place."
    },
    {
      "name": "Staff of Birdcalls",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Staff",
      "attunement": "",
      "desc": "This wooden staff is decorated with bird carvings. It has 10 charges. While holding it, you can take a Magic action to expend 1 charge from the staff and cause it to create one of the following sounds, which can be heard out to 120 feet: a finch's chirp, a raven's caw, a duck's quack, a chicken's cluck, a goose's honk, a loon's call, a turkey's gobble, a seagull's cry, an owl's hoot, or an eagle's shriek. Regaining Charges: The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff explodes in a harmless cloud of bird feathers and is l"
    },
    {
      "name": "Staff of Birdcalls",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Staff",
      "attunement": "",
      "desc": "This wooden staff is decorated with bird carvings. It has 10 charges. While holding it, you can use an action to expend 1 charge from the staff and cause it to create one of the following sounds out to a range of 60 feet: a finch's chirp, a raven's caw, a duck's quack, a chicken's cluck, a goose's honk, a loon's call, a turkey's gobble, a seagull's cry, an owl's hoot, or an eagle's shriek. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff explodes in a harmless cloud of bird feathers and is lost forever."
    },
    {
      "name": "Staff of Flowers",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Staff",
      "attunement": "",
      "desc": "This wooden staff has 10 charges. While holding it, you can take a Magic action to expend 1 charge from the staff and cause a flower to sprout from a patch of earth or soil within 5 feet of yourself, or from the staff itself. Unless you choose a specific kind of flower, the staff creates a mild-scented daisy. The flower is harmless and nonmagical, and it grows or withers as a normal flower would. Regaining Charges: The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff turns into flower petals and is lost forever."
    },
    {
      "name": "Staff of Flowers",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Staff",
      "attunement": "",
      "desc": "This wooden staff has 10 charges. While holding it, you can use an action to expend 1 charge from the staff and cause a flower to sprout from a patch of earth or soil within 5 feet of you, or from the staff itself. Unless you choose a specific kind of flower, the staff creates a mild-scented daisy. The flower is harmless and nonmagical, and it grows or withers as a normal flower would. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff turns into flower petals and is lost forever."
    },
    {
      "name": "Talking Doll",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While this doll is within 5 feet of you, you can spend a Short Rest telling it to say up to six phrases, none of which can be more than six words long, and set a condition under which the doll speaks each phrase. You can also replace old phrases with new ones. Whatever the condition, it must occur within 5 feet of the doll to make it speak. For example, whenever someone picks up the doll, it might say, \"I want a piece of candy.\" The doll's phrases are lost when your Attunement to the doll ends."
    },
    {
      "name": "Talking Doll",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While this stuffed doll is within 5 feet of you, you can spend a short rest telling it to say up to six phrases, none of which can be more than six words long, and set an observable condition under which the doll speaks each phrase. You can also replace old phrases with new ones. Whatever the condition, it must occur within 5 feet of the doll to make it speak. For example, whenever someone picks up the doll, it might say, \"I want a piece of candy.\" The doll's phrases are lost when your attunement to the doll ends."
    },
    {
      "name": "Tankard of Sobriety",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tankard has a stern face sculpted into one side. You can drink ale, wine, or any other nonmagical alcoholic beverage poured into it without becoming inebriated. The tankard has no effect on magical liquids or harmful substances such as poison."
    },
    {
      "name": "Tankard of Sobriety",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tankard has a stern face sculpted into one side. You can drink ale, wine, or any other nonmagical alcoholic beverage poured into it without becoming inebriated. The tankard has no effect on magical liquids or harmful substances such as poison."
    },
    {
      "name": "Unbreakable Arrow",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "This arrow can't be broken, except when it is within an antimagic field."
    },
    {
      "name": "Veteran's Cane",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "As a Bonus Action, you can transform this walking cane into an ordinary Longsword or change the Longsword back into a walking cane. In either case, you must be holding the item."
    },
    {
      "name": "Veteran's Cane",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "When you grasp this walking cane and use a bonus action to speak the command word, it transforms into an ordinary longsword and ceases to be magical."
    },
    {
      "name": "Wand of Conducting",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 3 charges. While holding it, you can take a Magic action to expend 1 charge and create orchestral music by waving it around. The music can be heard out to 120 feet and ends when you stop waving the wand. Regaining Charges: The wand regains all expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, a sad tuba sound plays as the wand crumbles into dust and is destroyed."
    },
    {
      "name": "Wand of Conducting",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 3 charges. While holding it, you can use an action to expend 1 of its charges and create orchestral music by waving it around. The music can be heard out to a range of 60 feet and ends when you stop waving the wand. The wand regains all expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, a sad tuba sound plays as the wand crumbles to dust and is destroyed."
    },
    {
      "name": "Wand of Pyrotechnics",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge and create a harmless burst of multicolored light at a point you can see up to 120 feet away. The burst of light is accompanied by a crackling noise that can be heard up to 300 feet away. The light is as bright as a torch flame but lasts only a second. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand erupts in a harmless pyrotechnic display and is destroyed."
    },
    {
      "name": "Wand of Pyrotechnics",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges and create a harmless burst of multicolored light at a point you can see up to 60 feet away. The burst of light is accompanied by a crackling noise that can be heard up to 300 feet away. The light is as bright as a torch flame but lasts only a second. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand erupts in a harmless pyrotechnic display and is destroyed."
    },
    {
      "name": "Wand of Scowls",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 3 charges. While holding it, you can use an action to expend 1 of its charges and target a humanoid you can see within 30 feet of you. The target must succeed on a 10 Charisma saving throw or be forced to scowl for 1 minute. The wand regains all expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand transforms into a wand of smiles."
    },
    {
      "name": "Wand of Smiles",
      "source": "Xanathar's",
      "source_key": "XGE",
      "rarity": "common",
      "rarity_order": 0,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 3 charges. While holding it, you can use an action to expend 1 of its charges and target a humanoid you can see within 30 feet of you. The target must succeed on a 10 Charisma saving throw or be forced to smile for 1 minute. The wand regains all expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand transforms into a wand of scowls."
    },
    {
      "name": "+1 All-Purpose Tool",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by an artificer)",
      "desc": "This simple screwdriver can transform into a variety of tools; as an action, you can touch the item and transform it into any type of artisan's tool of your choice (see the \"Equipment\" chapter in the Player's Handbook for a list of artisan's tools). Whatever form the tool takes, you are proficient with it. While holding this tool, you gain a +1 bonus to the spell attack rolls and the saving throw DCs of your artificer spells. As an action, you can focus on the tool to channel your creative forces. Choose a cantrip that you don't know from any class list. For 8 hours, you can cast that cantrip,"
    },
    {
      "name": "+1 Amulet of the Devout",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a cleric or paladin)",
      "desc": "This amulet bears the symbol of a deity inlaid with precious stones or metals. While you wear the holy symbol, you gain a +1 bonus to spell attack rolls and the saving throw DCs of your spells. While you wear this amulet, you can use your Channel Divinity feature without expending one of the feature's uses. Once this property is used, it can't be used again until the next dawn."
    },
    {
      "name": "+1 Arcane Grimoire",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "While you are holding this leather-bound book, you can use it as a spellcasting focus for your wizard spells, and you gain a +1 bonus to spell attack rolls and to the saving throw DCs of your wizard spells. You can use this book as a spellbook. In addition, when you use your Arcane Recovery feature, you can increase the number of spell slot levels you regain by 1."
    },
    {
      "name": "+1 Bloodwell Vial",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "To attune to this vial, you must place a few drops of your blood into it. The vial can't be opened while your attunement to it lasts. If your attunement to the vial ends, the contained blood turns to ash. You can use the vial as a spellcasting focus for your spells while wearing or holding it, and you gain a +1 bonus to spell attack rolls and to the saving throw DCs of your sorcerer spells. In addition, when you roll any Hit Dice to recover hit points while you are carrying the vial, you can regain 5 sorcery points. This property of the vial can't be used again until the next dawn."
    },
    {
      "name": "+1 Dragonhide Belt",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a monk)",
      "desc": "This finely detailed belt is made of dragonhide. While wearing it, you gain a +1 bonus to the saving throw DCs of your ki features. In addition, you can use an action to regain ki points equal to a roll of your Martial Arts die. You can't use this action again until the next dawn."
    },
    {
      "name": "+1 Moon Sickle",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement (by a druid or ranger)",
      "desc": "This silver-bladed sickle glimmers softly with moonlight. While holding this magic weapon, you gain a +1 bonus to attack and damage rolls made with it, and you gain a +1 bonus to spell attack rolls and the saving throw DCs of your druid and ranger spells. In addition, you can use the sickle as a spellcasting focus for your druid and ranger spells. When you cast a spell that restores hit points, you can roll a d4 and add the number rolled to the amount of hit points restored, provided you are holding the sickle."
    },
    {
      "name": "+1 Rhythm-Maker's Drum",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "While holding this drum, you gain a +1 bonus to spell attack rolls and to the saving throw DCs of your bard spells. As an action, you can play the drum to regain one use of your Bardic Inspiration feature. This property of the drum can't be used again until the next dawn."
    },
    {
      "name": "+1 Rod of the Pact Keeper",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement (by a warlock)",
      "desc": "While holding this rod, you gain a +1 bonus to spell attack rolls and to the saving throw DCs of your warlock spells. In addition, you can regain one warlock spell slot as an action while holding the rod. You can't use this property again until you finish a long rest."
    },
    {
      "name": "+1 Rod of the Pact Keeper",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement (by a warlock)",
      "desc": "While holding this rod, you gain a +1 bonus to spell attack rolls and to the saving throw DCs of your Warlock spells. In addition, you can regain one spell slot as a Magic action while holding the rod. You can't use this property again until you finish a Long Rest."
    },
    {
      "name": "+1 Wand of the War Mage",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "While you are holding this wand, you gain a +1 bonus to spell attack rolls. In addition, you ignore Cover when making a spell attack."
    },
    {
      "name": "+1 Wand of the War Mage",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "While holding this wand, you gain a +1 bonus to spell attack rolls. In addition, you ignore Cover when making a spell attack roll."
    },
    {
      "name": "+1 Wraps of Unarmed Power",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing these wraps, you have a +1 bonus to attack rolls and damage rolls made with your Unarmed Strikes. Those strikes deal your choice of Force damage or their normal damage type."
    },
    {
      "name": "Alchemy Jug",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This ceramic jug appears to be able to hold a gallon of liquid and weighs 12 pounds whether full or empty. Sloshing sounds can be heard from within the jug when it is shaken, even if the jug is empty. You can use an action and name one liquid from the table below to cause the jug to produce the chosen liquid. Afterward, you can uncork the jug as an action and pour that liquid out, up to 2 gallons per minute. The maximum amount of liquid the jug can produce depends on the liquid you named. Once the jug starts producing a liquid, it can't produce a different one, or more of one that has reached "
    },
    {
      "name": "Alchemy Jug",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This ceramic jug appears to be able to hold a gallon of liquid and weighs 12 pounds whether full or empty. The jug sloshes when it is shaken, even if the jug is empty. You can take a Magic action and name one liquid from the Alchemy Jug Liquids table to cause the jug to produce the chosen liquid. Afterward, you can uncork the jug as a Utilize action and pour that liquid out, up to 2 gallons per minute. The maximum amount of liquid the jug can produce depends on the liquid you named. Once the jug starts producing a liquid, it can't produce a different one, or more of one that has reached its ma"
    },
    {
      "name": "Amulet of Proof against Detection and Location",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this amulet, you are hidden from divination magic. You can't be targeted by such magic or perceived through magical scrying sensors."
    },
    {
      "name": "Amulet of Proof against Detection and Location",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this amulet, you can't be targeted by Divination spells or perceived through magical scrying sensors unless you allow it."
    },
    {
      "name": "Baba Yaga's Dancing Broom",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The archfey Baba Yaga crafted many of these magic brooms. No two appear exactly alike. While holding the broom, you can take a Magic action to transform it into an Animated Broom under your control. The broom then moves into an unoccupied space as close to you as possible. The broom acts immediately after you on your Initiative count and remains animate until you take a Bonus Action and use a command word to render it inanimate. On your turn, you can mentally command the animated broom if it is within 30 feet of you and you don't have the Incapacitated condition (no action required). You decid"
    },
    {
      "name": "Bag of Holding",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents. Retrieving an item from the bag requires an action. If the bag is overloaded, pierced, or torn, it ruptures and is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth, unharmed, but the bag must be put right before it can be used again. Breathing creatures inside "
    },
    {
      "name": "Bag of Holding",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This bag has an interior space considerably larger than its outside dimensions—roughly 2 feet square and 4 feet deep on the inside. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 5 pounds, regardless of its contents. Retrieving an item from the bag requires a Utilize action. If the bag is overloaded, pierced, or torn, it is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth unharmed, but the bag must be put right before it can be used again. The bag holds enough air for 10 minutes "
    },
    {
      "name": "Bag of Tricks, Gray",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This ordinary bag, made from gray cloth, appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. You can use an action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling a d8 and consulting the table. The creature vanishes at the next dawn or when it is reduced to 0 hit points. The creature is friendly to you and your companions, and it acts on your turn. You can use a bonus action to command how the creature moves and what action it takes on its next turn, or to"
    },
    {
      "name": "Bag of Tricks, Gray",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This bag made from gray cloth appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. You can take a Magic action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling on the table below. See the Monster Manual for the creature's stat block. The creature vanishes at the next dawn or when it is reduced to 0 Hit Points. The creature is Friendly [Attitude] to you and your allies, and it acts immediately after you on your Initiative count. You can take a Bonus Action to"
    },
    {
      "name": "Bag of Tricks, Rust",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This ordinary bag, made from rust cloth, appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. You can use an action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling a d8 and consulting the table. The creature vanishes at the next dawn or when it is reduced to 0 hit points. The creature is friendly to you and your companions, and it acts on your turn. You can use a bonus action to command how the creature moves and what action it takes on its next turn, or to"
    },
    {
      "name": "Bag of Tricks, Rust",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This bag made from rust cloth appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. You can take a Magic action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling on the table below. See the Monster Manual for the creature's stat block. The creature vanishes at the next dawn or when it is reduced to 0 Hit Points. The creature is Friendly [Attitude] to you and your allies, and it acts immediately after you on your Initiative count. You can take a Bonus Action to"
    },
    {
      "name": "Bag of Tricks, Tan",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This ordinary bag, made from tan cloth, appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. You can use an action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling a d8 and consulting the table. The creature vanishes at the next dawn or when it is reduced to 0 hit points. The creature is friendly to you and your companions, and it acts on your turn. You can use a bonus action to command how the creature moves and what action it takes on its next turn, or to "
    },
    {
      "name": "Bag of Tricks, Tan",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This bag made from tan cloth appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. You can take a Magic action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling on the table below. See the Monster Manual for the creature's stat block. The creature vanishes at the next dawn or when it is reduced to 0 Hit Points. The creature is Friendly [Attitude] to you and your allies, and it acts immediately after you on your Initiative count. You can take a Bonus Action to "
    },
    {
      "name": "Barrier Tattoo (Small)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo depicts protective imagery and uses ink that resembles liquid metal. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Protection: While you aren't wearing armor, the tattoo grants you an Armor Class of 12 + your "
    },
    {
      "name": "Boots of Elvenkind",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have advantage on Dexterity (Stealth) checks that rely on moving silently."
    },
    {
      "name": "Boots of Elvenkind",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have Advantage on Dexterity (Stealth) checks."
    },
    {
      "name": "Boots of Striding and Springing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear these boots, your walking speed becomes 30 feet, unless your walking speed is higher, and your speed isn't reduced if you are encumbered or wearing heavy armor. In addition, you can jump three times the normal distance, though you can't jump farther than your remaining movement would allow."
    },
    {
      "name": "Boots of Striding and Springing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear these boots, your Speed becomes 30 feet unless your Speed is higher, and your Speed isn't reduced by you carrying weight in excess of your carrying capacity or wearing Heavy Armor. Once on each of your turns, you can jump up to 30 feet by spending only 10 feet of movement."
    },
    {
      "name": "Boots of the Winterlands",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "These furred boots are snug and feel quite warm. While you wear them, you gain the following benefits: You have resistance to cold damage. You ignore difficult terrain created by ice or snow. You can tolerate temperatures as low as -50 degrees Fahrenheit without any additional protection. If you wear heavy clothes, you can tolerate temperatures as low as -100 degrees Fahrenheit."
    },
    {
      "name": "Boots of the Winterlands",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "These furred boots are snug and feel warm. While wearing them, you gain the following benefits. Cold Resistance: You have Resistance to Cold damage and can tolerate temperatures of 0 degrees Fahrenheit or lower without any additional protection. Winter Strider: You ignore Difficult Terrain created by ice or snow."
    },
    {
      "name": "Bracers of Archery",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing these bracers, you have proficiency with the longbow and shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons."
    },
    {
      "name": "Bracers of Archery",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing these bracers, you have proficiency with the Longbow and Shortbow, and you gain a +2 bonus to damage rolls made with such weapons."
    },
    {
      "name": "Brooch of Shielding",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this brooch, you have resistance to force damage, and you have immunity to damage from the magic missile spell."
    },
    {
      "name": "Brooch of Shielding",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this brooch, you have Resistance to Force damage, and you have Immunity to damage from the Magic Missile spell."
    },
    {
      "name": "Broom of Flying",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This wooden broom, which weighs 3 pounds, functions like a mundane broom until you stand astride it and speak its command word. It then hovers beneath you and can be ridden in the air. It has a flying speed of 50 feet. It can carry up to 400 pounds, but its flying speed becomes 30 feet while carrying over 200 pounds. The broom stops hovering when you land. You can send the broom to travel alone to a destination within 1 mile of you if you speak the command word, name the location, and are familiar with that place. The broom comes back to you when you speak another command word, provided that t"
    },
    {
      "name": "Broom of Flying",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This wooden broom functions like a mundane broom until you stand astride it and take a Magic action to make it hover beneath you, at which time it can be ridden in the air. It has a Fly Speed of 50 feet. It can carry up to 400 pounds, but its Fly Speed becomes 30 feet while carrying over 200 pounds. The broom stops hovering when you land or when you're no longer riding it. As a Magic action, you can send the broom to travel alone to a destination within 1 mile of you if you name the location and are familiar with it. The broom comes back to you when you take a Magic action and use a command wo"
    },
    {
      "name": "Cap of Water Breathing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this cap underwater, you can speak its command word as an action to create a bubble of air around your head. It allows you to breathe normally underwater. This bubble stays with you until you speak the command word again, the cap is removed, or you are no longer underwater."
    },
    {
      "name": "Cap of Water Breathing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this cap underwater, you can take a Magic action to create a bubble of air around your head. This bubble allows you to breathe normally underwater. This bubble stays with you until the cap is removed or you are no longer underwater."
    },
    {
      "name": "Circlet of Blasting",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this circlet, you can use an action to cast the scorching ray spell with it. When you make the spell's attacks, you do so with an attack bonus of 5. The circlet can't be used this way again until the next dawn."
    },
    {
      "name": "Circlet of Blasting",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this circlet, you can cast Scorching Ray with it (5 to hit). The circlet can't cast this spell again until the next dawn."
    },
    {
      "name": "Cloak of Elvenkind",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have disadvantage, and you have advantage on Dexterity (Stealth) checks made to hide, as the cloak's color shifts to camouflage you. Pulling the hood up or down requires an action."
    },
    {
      "name": "Cloak of Elvenkind",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear this cloak, Wisdom (Perception) checks made to perceive you have Disadvantage, and you have Advantage on Dexterity (Stealth) checks."
    },
    {
      "name": "Cloak of Protection",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "You gain a +1 bonus to AC and saving throws while you wear this cloak."
    },
    {
      "name": "Cloak of Protection",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "You gain a +1 bonus to Armor Class and saving throws while you wear this cloak."
    },
    {
      "name": "Cloak of the Manta Ray",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this cloak with its hood up, you can breathe underwater, and you have a swimming speed of 60 feet. Pulling the hood up or down requires an action."
    },
    {
      "name": "Cloak of the Manta Ray",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this cloak, you can breathe underwater, and you have a Swim Speed of 60 feet."
    },
    {
      "name": "Coiling Grasp Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo has long intertwining designs. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Grasping Tendrils: While the tattoo is on your skin, you can, as an action, cause the tattoo to extrude into inky tendrils, which re"
    },
    {
      "name": "Decanter of Endless Water",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This stoppered flask sloshes when shaken, as if it contains water. The decanter weighs 2 pounds. You can use an action to remove the stopper and speak one of three command words, whereupon an amount of fresh water or salt water (your choice) pours out of the flask. The water stops pouring out at the start of your next turn. Choose from the following options: \"Stream\" produces 1 gallon of water. \"Fountain\" produces 5 gallons of water. \"Geyser\" produces 30 gallons of water that gushes forth in a geyser 30 feet long and 1 foot wide. As a bonus action while holding the decanter, you can aim the ge"
    },
    {
      "name": "Decanter of Endless Water",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This stoppered flask sloshes when shaken, as if it contains water. The decanter weighs 2 pounds. You can take a Magic action to remove the stopper and issue one of three command words, whereupon an amount of fresh water or salt water (your choice) pours out of the flask. The water stops pouring out at the start of your next turn. Choose from the following command words: The decanter produces 1 gallon of water. The decanter produces 5 gallons of water. The decanter produces 30 gallons of water that gushes forth in a Line [Area of Effect] 30 feet long and 1 foot wide. If you're holding the decan"
    },
    {
      "name": "Deck of Illusions",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This box contains a set of parchment cards. A full deck has 34 cards. A deck found as treasure is usually missing 1d20 - 1 cards. The magic of the deck functions only if cards are drawn at random (you can use an altered deck of playing cards to simulate the deck). You can use an action to draw a card at random from the deck and throw it to the ground at a point within 30 feet of you. An illusion of one or more creatures forms over the thrown card and remains until dispelled. An illusory creature appears real, of the appropriate size, and behaves as if it were a real creature, except that it ca"
    },
    {
      "name": "Deck of Illusions",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This box contains a set of cards. A full deck has 34 cards: 32 depicting specific creatures and two with a mirrored surface. A deck found as treasure is usually missing 1d20 - 1 cards. The magic of the deck functions only if its cards are drawn at random. You can take a Magic action to draw a card at random from the deck and throw it to the ground at a point within 30 feet of yourself. An illusion of a creature, determined by rolling on the Deck of Illusions table, forms over the thrown card and remains until dispelled. The illusory creature created by the card looks and behaves like a real cr"
    },
    {
      "name": "Driftglobe",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This small sphere of thick glass weighs 1 pound. If you are within 60 feet of it, you can speak its command word and cause it to emanate the light or daylight spell. Once used, the daylight effect can't be used again until the next dawn. You can speak another command word as an action to make the illuminated globe rise into the air and float no more than 5 feet off the ground. The globe hovers in this way until you or another creature grasps it. If you move more than 60 feet from the hovering globe, it follows you until it is within 60 feet of you. It takes the shortest route to do so. If prev"
    },
    {
      "name": "Driftglobe",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This small sphere of thick glass weighs 1 pound. If you are within 60 feet of it, you can command it to emanate light equivalent to that of the Light or Daylight spell (your choice). Once used, the Daylight effect can't be used again until the next dawn. You can issue another command as a Magic action to make the illuminated globe rise into the air and float no more than 5 feet off the ground. The globe hovers in this way until you or another creature grasps it. If you move more than 60 feet from the hovering globe, it follows you until it is within 60 feet of you. It takes the shortest route "
    },
    {
      "name": "Dust of Disappearance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Found in a small packet, this powder resembles very fine sand. There is enough of it for one use. When you use an action to throw the dust into the air, you and each creature and object within 10 feet of you become invisible for 2d4 minutes. The duration is the same for all subjects, and the dust is consumed when its magic takes effect. If a creature affected by the dust attacks or casts a spell, the invisibility ends for that creature."
    },
    {
      "name": "Dust of Disappearance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This powder resembles fine sand. There is enough of it for one use. When you take a Utilize action to throw the dust into the air, you and each creature and object within a 10-foot Emanation [Area of Effect] originating from you have the Invisible condition for 2d4 minutes. The duration is the same for all subjects, and the dust is consumed when its magic takes effect. Immediately after an affected creature makes an attack roll, deals damage, or casts a spell, the Invisible condition ends for that creature."
    },
    {
      "name": "Dust of Dryness",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This small packet contains 1d6 + 4 pinches of dust. You can use an action to sprinkle a pinch of it over water. The dust turns a cube of water 15 feet on a side into one marble-sized pellet, which floats or rests near where the dust was sprinkled. The pellet's weight is negligible. Someone can use an action to smash the pellet against a hard surface, causing the pellet to shatter and release the water the dust absorbed. Doing so ends that pellet's magic. An elemental composed mostly of water that is exposed to a pinch of the dust must make a 13 Constitution saving throw, taking 10d6 necrotic d"
    },
    {
      "name": "Dust of Dryness",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This small packet contains 1d6 + 4 pinches of dust. As a Utilize action, you can sprinkle a pinch of the dust over water, turning up to a 15-foot Cube [Area of Effect] of water into one marble-sized pellet, which floats or rests near where the dust was sprinkled. The pellet's weight is negligible. A creature can take a Utilize action to smash the pellet against a hard surface, causing the pellet to shatter and release the water the dust absorbed. Doing so destroys the pellet and ends its magic. As a Utilize action, you can sprinkle a pinch of the dust on an Elemental within 5 feet of yourself "
    },
    {
      "name": "Dust of Sneezing and Choking",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Found in a small container, this powder resembles very fine sand. It appears to be dust of disappearance, and an identify spell reveals it to be such. There is enough of it for one use. When you use an action to throw a handful of the dust into the air, you and each creature that needs to breathe within 30 feet of you must succeed on a 15 Constitution saving throw or become unable to breathe while sneezing uncontrollably. A creature affected in this way is incapacitated and suffocating. As long as it is conscious, a creature can repeat the saving throw at the end of each of its turns, ending t"
    },
    {
      "name": "Dust of Sneezing and Choking",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Found in a small container, this powder resembles Dust of Disappearance, and Identify reveals it to be such. There is enough of it for one use. As a Utilize action, you can throw the dust into the air, forcing yourself and every creature in a 30-foot Emanation [Area of Effect] originating from you to make a 15 Constitution saving throw. Constructs, Elementals, Oozes, Plants, and Undead succeed on the save automatically. On a failed save, a creature begins sneezing uncontrollably; it has the Incapacitated condition and is suffocating. The creature repeats the save at the end of each of its turn"
    },
    {
      "name": "Eldritch Claw Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo depicts claw-like forms and other jagged shapes. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Magical Strikes: While the tattoo is on your skin, your unarmed strikes are considered magical for the purpose of "
    },
    {
      "name": "Elemental Gem, Blue Sapphire",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gem contains a mote of elemental energy. When you use an action to break the gem, an air elemental is summoned as if you had cast the conjure elemental spell, and the gem's magic is lost."
    },
    {
      "name": "Elemental Gem, Blue Sapphire",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gem contains a mote of elemental energy. When you take a Utilize action to break the gem, an Air Elemental is summoned, and the gem ceases to be magical. The elemental appears in an unoccupied space as close to the broken gem as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action."
    },
    {
      "name": "Elemental Gem, Emerald",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gem contains a mote of elemental energy. When you use an action to break the gem, a water elemental is summoned as if you had cast the conjure elemental spell, and the gem's magic is lost."
    },
    {
      "name": "Elemental Gem, Emerald",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gem contains a mote of elemental energy. When you take a Utilize action to break the gem, a Water Elemental is summoned, and the gem ceases to be magical. The elemental appears in an unoccupied space as close to the broken gem as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action."
    },
    {
      "name": "Elemental Gem, Red Corundum",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gem contains a mote of elemental energy. When you use an action to break the gem, a fire elemental is summoned as if you had cast the conjure elemental spell, and the gem's magic is lost."
    },
    {
      "name": "Elemental Gem, Red Corundum",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gem contains a mote of elemental energy. When you take a Utilize action to break the gem, a Fire Elemental is summoned, and the gem ceases to be magical. The elemental appears in an unoccupied space as close to the broken gem as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action."
    },
    {
      "name": "Elemental Gem, Yellow Diamond",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gem contains a mote of elemental energy. When you use an action to break the gem, an earth elemental is summoned as if you had cast the conjure elemental spell, and the gem's magic is lost."
    },
    {
      "name": "Elemental Gem, Yellow Diamond",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gem contains a mote of elemental energy. When you take a Utilize action to break the gem, an Earth Elemental is summoned, and the gem ceases to be magical. The elemental appears in an unoccupied space as close to the broken gem as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action."
    },
    {
      "name": "Emerald Pen",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This pen is tipped with an emerald nib and requires no ink to write. While holding this pen, you can cast illusory script at will, requiring no material components."
    },
    {
      "name": "Enspelled Staff (Cantrip)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Staff",
      "attunement": "requires attunement (by a Spellcaster)",
      "desc": "Bound into this staff is a cantrip. The cantrip is determined when the staff is created and can be of any school of magic. The staff has 6 charges and regains 1d6 expended charges daily at dawn. While holding the staff, you can expend 1 charge to cast its spell. If you expend the staff's last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff. The spell's saving throw DC is 13, and its attack bonus is 5."
    },
    {
      "name": "Enspelled Staff (Level 1)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Staff",
      "attunement": "requires attunement (by a Spellcaster)",
      "desc": "Bound into this staff is a level 1 spell. The spell is determined when the staff is created and can be of any school of magic. The staff has 6 charges and regains 1d6 expended charges daily at dawn. While holding the staff, you can expend 1 charge to cast its spell. If you expend the staff's last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff. The spell's saving throw DC is 13, and its attack bonus is 5."
    },
    {
      "name": "Eversmoking Bottle",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Smoke leaks from the lead-stoppered mouth of this brass bottle, which weighs 1 pound. When you use an action to remove the stopper, a cloud of thick smoke pours out in a 60-foot radius from the bottle. The cloud's area is heavily obscured. Each minute the bottle remains open and within the cloud, the radius increases by 10 feet until it reaches its maximum radius of 120 feet. The cloud persists as long as the bottle is open. Closing the bottle requires you to speak its command word as an action. Once the bottle is closed, the cloud disperses after 10 minutes. A moderate wind (11 to 20 miles pe"
    },
    {
      "name": "Eversmoking Bottle",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "As a Magic action, you can open or close this bottle. Opening the bottle causes thick smoke to billow out, forming a cloud that fills a 60-foot Emanation [Area of Effect] originating from the bottle. The area within the smoke is Heavily Obscured. Each minute the bottle remains open, the size of the Emanation [Area of Effect] increases by 10 feet until it reaches its maximum size of 120 feet. Closing the bottle causes the cloud to become fixed in place until it disperses after 10 minutes. A strong wind (such as that created by the Gust of Wind spell) disperses the cloud after 1 minute."
    },
    {
      "name": "Eyes of Charming",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "These crystal lenses fit over the eyes. They have 3 charges. While wearing them, you can expend 1 charge as an action to cast the charm person spell (save 13) on a humanoid within 30 feet of you, provided that you and the target can see each other. The lenses regain all expended charges daily at dawn."
    },
    {
      "name": "Eyes of Charming",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "These crystal lenses fit over the eyes. They have 3 charges. While wearing them, you can expend 1 or more charges to cast Charm Person (save 13). For 1 charge, you cast the level 1 version of the spell. You increase the spell's level by one for each additional charge you expend. The lenses regain all expended charges daily at dawn."
    },
    {
      "name": "Eyes of Minute Seeing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These crystal lenses fit over the eyes. While wearing them, you can see much better than normal out to a range of 1 foot. You have advantage on Intelligence (Investigation) checks that rely on sight while searching an area or studying an object within that range."
    },
    {
      "name": "Eyes of Minute Seeing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These crystal lenses fit over the eyes. While wearing them, your vision improves significantly out to a range of 1 foot, granting you Darkvision within that range and Advantage on Intelligence (Investigation) checks made to examine something within that range."
    },
    {
      "name": "Eyes of the Eagle",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "These crystal lenses fit over the eyes. While wearing them, you have advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across."
    },
    {
      "name": "Eyes of the Eagle",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These crystal lenses fit over the eyes. While wearing them, you have Advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across."
    },
    {
      "name": "Feywild Shard",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This warm crystal glints with the sunset colors of the Feywild sky and evokes whispers of emotional memory. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can roll on the Wild Magic Surge table in the Player's Handbook. If the result is a spell, it is too wild to be affected by your Metamagic, and if it normally requires conce"
    },
    {
      "name": "Figurine of Wondrous Power, Silver Raven",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but take"
    },
    {
      "name": "Figurine of Wondrous Power, Silver Raven",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Figurine of Wondrous Power is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is Friendly [Attitude] to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on yo"
    },
    {
      "name": "Gauntlets of Ogre Power",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is already 19 or higher without them."
    },
    {
      "name": "Gauntlets of Ogre Power",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is 19 or higher without them."
    },
    {
      "name": "Gem of Brightness",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This prism has 50 charges. While you are holding it, you can use an action to speak one of three command words to cause one of the following effects: The first command word causes the gem to shed bright light in a 30-foot radius and dim light for an additional 30 feet. This effect doesn't expend a charge. It lasts until you use a bonus action to repeat the command word or until you use another function of the gem. The second command word expends 1 charge and causes the gem to fire a brilliant beam of light at one creature you can see within 60 feet of you. The creature must succeed on a 15 Con"
    },
    {
      "name": "Gem of Brightness",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This prism has 50 charges. While you are holding it, you can take a Magic action and use one of three command words to cause one of the following effects: The gem sheds Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. This effect doesn't expend a charge. It lasts until you take a Bonus Action to repeat the command word or until you use another function of the gem. You expend 1 charge and cause the gem to fire a brilliant beam of light at one creature you can see within 60 feet of yourself. The creature must succeed on a 15 Constitution saving throw or have the Blinded "
    },
    {
      "name": "Gloves of Missile Snaring",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "These gloves seem to almost meld into your hands when you don them. When a ranged weapon attack hits you while you're wearing them, you can use your reaction to reduce the damage by 1d10 + your Dexterity modifier, provided that you have a free hand. If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in that hand."
    },
    {
      "name": "Gloves of Missile Snaring",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "If you're hit by an attack roll made with a Ranged or Thrown weapon while wearing these gloves, you can take a Reaction to reduce the damage by 1d10 plus your Dexterity modifier if you have a free hand. If you reduce the damage to 0, you can catch the ammunition or weapon if it is small enough for you to hold in that hand."
    },
    {
      "name": "Gloves of Swimming and Climbing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing these gloves, climbing and swimming don't cost you extra movement, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim."
    },
    {
      "name": "Gloves of Swimming and Climbing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing these gloves, climbing and swimming don't cost you extra movement, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim."
    },
    {
      "name": "Gloves of Thievery",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These gloves are invisible while worn. While wearing them, you gain a +5 bonus to Dexterity (Sleight of Hand) checks and Dexterity checks made to pick locks."
    },
    {
      "name": "Gloves of Thievery",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These gloves are imperceptible while worn. While wearing them, you gain a +5 bonus to Dexterity (Sleight of Hand) checks."
    },
    {
      "name": "Goggles of Night",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing these dark lenses, you have darkvision out to a range of 60 feet. If you already have darkvision, wearing the goggles increases its range by 60 feet."
    },
    {
      "name": "Goggles of Night",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing these dark lenses, you have Darkvision out to 60 feet. If you already have Darkvision, wearing the goggles increases its range by 60 feet."
    },
    {
      "name": "Guardian Emblem",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a cleric or paladin)",
      "desc": "This emblem is the symbol of a deity or a spiritual tradition. As an action, you can attach the emblem to a suit of armor or a shield or remove it. The emblem has 3 charges. When you or a creature you can see within 30 feet of you suffers a critical hit while you're wearing the armor or wielding the shield that bears the emblem, you can use your reaction to expend 1 charge to turn the critical hit into a normal hit instead. The emblem regains all expended charges daily at dawn."
    },
    {
      "name": "Hag Eye",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Hag Eye has 3 charges. While wearing or holding this item, you can expend 1 charge to cast Darkvision (targeting yourself only) or See Invisibility. The Hag Eye regains all expended charges daily at dawn. Coven Sensor: The Hag Eye is usually entrusted to a hag's minion for safekeeping and transport. As a Magic action, a hag who belongs to the coven that created the Hag Eye can see what the Hag Eye sees if the hag and the Hag Eye are on the same plane of existence. This effect lasts as long as the hag maintains Concentration. Multiple hags in the coven can see through the Hag Eye simultaneous"
    },
    {
      "name": "Hat of Disguise",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this hat, you can use an action to cast the disguise self spell from it at will. The spell ends if the hat is removed."
    },
    {
      "name": "Hat of Disguise",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this hat, you can cast the Disguise Self spell. The spell ends if the hat is removed."
    },
    {
      "name": "Headband of Intellect",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is already 19 or higher without it."
    },
    {
      "name": "Headband of Intellect",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is 19 or higher without it."
    },
    {
      "name": "Helm of Comprehending Languages",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this helm, you can use an action to cast the comprehend languages spell from it at will."
    },
    {
      "name": "Helm of Comprehending Languages",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing this helm, you can cast Comprehend Languages from it."
    },
    {
      "name": "Helm of Telepathy",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this helm, you can use an action to cast the detect thoughts spell (save 13) from it. As long as you maintain concentration on the spell, you can use a bonus action to send a telepathic message to a creature you are focused on. It can reply—using a bonus action to do so—while your focus on it continues. While focusing on a creature with detect thoughts, you can use an action to cast the suggestion spell (save 13) from the helm on that creature. Once used, the suggestion property can't be used again until the next dawn."
    },
    {
      "name": "Helm of Telepathy",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this helm, you have telepathy with a range of 30 feet, and you can cast Detect Thoughts or Suggestion (save 13) from the helm. Once either spell is cast from the helm, that spell can't be cast from it again until the next dawn."
    },
    {
      "name": "Immovable Rod",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This flat iron rod has a button on one end. You can use an action to press the button, which causes the rod to become magically fixed in place. Until you or another creature uses an action to push the button again, the rod doesn't move, even if it is defying gravity. The rod can hold up to 8,000 pounds of weight. More weight causes the rod to deactivate and fall. A creature can use an action to make a 30 Strength check, moving the fixed rod up to 10 feet on a success."
    },
    {
      "name": "Immovable Rod",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This iron rod has a button on one end. You can take a Utilize action to press the button, which causes the rod to become magically fixed in place. Until you or another creature takes a Utilize action to push the button again, the rod doesn't move, even if it defies gravity. The rod can hold up to 8,000 pounds of weight. More weight causes the rod to deactivate and fall. A creature can take a Utilize action to make a 30 Strength (Athletics) check, moving the fixed rod up to 10 feet on a successful check."
    },
    {
      "name": "Instrument of the Bards, Doss Lute",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An instrument of the bards is an exquisite example of its kind, superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a legendary bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 psychic damage. You can use an action to play the instrument and cast one of its spells. Once the instrument has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellcasting ability and spell save DC. You can play"
    },
    {
      "name": "Instrument of the Bards, Doss Lute",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An Instrument of the Bards is superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 Psychic damage. You can play the Doss Lute to cast one of the following spells: Fly, Invisibility, Levitate, Protection from Evil and Good, Animal Friendship, Protection from Energy (Fire damage only), and Protection from Poison. Once the Doss Lute has been used to cast a spell, it can't be used to cast that spell aga"
    },
    {
      "name": "Instrument of the Bards, Fochlucan Bandore",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An instrument of the bards is an exquisite example of its kind, superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a legendary bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 psychic damage. You can use an action to play the instrument and cast one of its spells. Once the instrument has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellcasting ability and spell save DC. You can play"
    },
    {
      "name": "Instrument of the Bards, Fochlucan Bandore",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An Instrument of the Bards is superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 Psychic damage. You can play the Fochlucan Bandore to cast one of the following spells: Fly, Invisibility, Levitate, Protection from Evil and Good, Entangle, Faerie Fire, Shillelagh, and Speak with Animals. Once the Fochlucan Bandore has been used to cast a spell, it can't be used to cast that spell again until the ne"
    },
    {
      "name": "Instrument of the Bards, Mac-Fuirmidh Cittern",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An instrument of the bards is an exquisite example of its kind, superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a legendary bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 psychic damage. You can use an action to play the instrument and cast one of its spells. Once the instrument has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellcasting ability and spell save DC. You can play"
    },
    {
      "name": "Instrument of the Bards, Mac-Fuirmidh Cittern",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An Instrument of the Bards is superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 Psychic damage. You can play the Mac-Fuirmidh Cittern to cast one of the following spells: Fly, Invisibility, Levitate, Protection from Evil and Good, Barkskin, Cure Wounds, and Fog Cloud. Once the Mac-Fuirmidh Cittern has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The sp"
    },
    {
      "name": "Javelin of Lightning",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This javelin is a magic weapon. When you hurl it and speak its command word, it transforms into a bolt of lightning, forming a line 5 feet wide that extends out from you to a target within 120 feet. Each creature in the line excluding you and the target must make a 13 Dexterity saving throw, taking 4d6 lightning damage on a failed save, and half as much damage on a successful one. The lightning bolt turns back into a javelin when it reaches the target. Make a ranged weapon attack against the target. On a hit, the target takes damage from the javelin plus 4d6 lightning damage. The javelin's pro"
    },
    {
      "name": "Javelin of Lightning",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "Each time you make an attack roll with this magic weapon and hit, you can have it deal Lightning damage instead of Piercing damage. Lightning Bolt: When you throw this weapon at a target no farther than 120 feet from you, you can forgo making a ranged attack roll and instead turn the weapon into a bolt of lightning. This bolt forms a 5-foot-wide Line [Area of Effect] between you and the target. The target and each other creature in the Line [Area of Effect] (excluding you) makes a 13 Dexterity saving throw, taking 4d6 Lightning damage on a failed save or half as much damage on a successful one"
    },
    {
      "name": "Keoghtom's Ointment",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This glass jar, 3 inches in diameter, contains 1d4 + 1 doses of a thick mixture that smells faintly of aloe. The jar and its contents weigh ½ pound. As an action, one dose of the ointment can be swallowed or applied to the skin. The creature that receives it regains 2d8 + 2 hit points, ceases to be poisoned, and is cured of any disease."
    },
    {
      "name": "Keoghtom's Ointment",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This glass jar, 3 inches in diameter, contains 1d4 + 1 doses of a thick mixture that smells faintly of aloe. The jar and its contents weigh 1/2 pound. As a Utilize action, you can swallow one dose of the ointment or apply it to a creature within 5 feet of yourself. The creature that receives it regains 2d8 + 2 Hit Points and ceases to have the Poisoned condition."
    },
    {
      "name": "Lantern of Revealing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding bright light in a 30-foot radius and dim light for an additional 30 feet. Invisible creatures and objects are visible as long as they are in the lantern's bright light. You can use an action to lower the hood, reducing the light to dim light in a 5-foot radius."
    },
    {
      "name": "Lantern of Revealing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. Invisible creatures and objects are visible as long as they are in the lantern's Bright Light. You can take a Utilize action to lower the hood, reducing the lantern's light to Dim Light in a 5-foot radius."
    },
    {
      "name": "Medallion of Thoughts",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The medallion has 3 charges. While wearing it, you can use an action and expend 1 charge to cast the detect thoughts spell (save 13) from it. The medallion regains 1d3 expended charges daily at dawn."
    },
    {
      "name": "Medallion of Thoughts",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The medallion has 5 charges. While wearing it, you can expend 1 charge to cast Detect Thoughts (save 13) from it. The medallion regains 1d4 expended charges daily at dawn."
    },
    {
      "name": "Nature's Mantle",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a druid or ranger)",
      "desc": "This cloak shifts color and texture to blend with the terrain surrounding you. While wearing the cloak, you can use it as a spellcasting focus for your druid and ranger spells. While you are in an area that is lightly obscured, you can Hide as a bonus action even if you are being directly observed."
    },
    {
      "name": "Nature's Mantle",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a druid or ranger)",
      "desc": "This cloak shifts color and texture to blend with the terrain surrounding you. While wearing the cloak, you can use it as a Spellcasting Focus for your Druid and Ranger spells. While you are in an area that is Lightly Obscured, you can Hide as a Bonus Action even if you are being directly observed."
    },
    {
      "name": "Necklace of Adaptation",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this necklace, you can breathe normally in any environment, and you have advantage on saving throws made against harmful gases and vapors (such as cloudkill and stinking cloud effects, inhaled poisons, and the breath weapons of some dragons)."
    },
    {
      "name": "Necklace of Adaptation",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this necklace, you can breathe normally in any environment, and you have Advantage on saving throws made to avoid or end the Poisoned condition."
    },
    {
      "name": "Oil of Slipperiness",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This sticky black unguent is thick and heavy in the container, but it flows quickly when poured. The oil can cover a Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of a freedom of movement spell for 8 hours. Alternatively, the oil can be poured on the ground as an action, where it covers a 10-foot square, duplicating the effect of the grease spell in that area for 8 hours."
    },
    {
      "name": "Oil of Slipperiness",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "One vial of this oil can cover one Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the Freedom of Movement spell for 8 hours. Alternatively, the oil can be poured on the ground as a Magic action, where it covers a 10-foot square, duplicating the effect of the Grease spell in that area for 8 hours. This sticky, black unguent is thick and heavy, but it flows quickly when poured."
    },
    {
      "name": "Pearl of Power",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "While this pearl is on your person, you can use an action to speak its command word and regain one expended spell slot. If the expended slot was of 4th level or higher, the new slot is 3rd level. Once you have used the pearl, it can't be used again until the next dawn."
    },
    {
      "name": "Pearl of Power",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "While this pearl is on your person, you can take a Magic action to regain one expended spell slot of level 3 or lower. Once you use the pearl, it can't be used again until the next dawn."
    },
    {
      "name": "Periapt of Health",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You are immune to contracting any disease while you wear this pendant. If you are already infected with a disease, the effects of the disease are suppressed while you wear the pendant."
    },
    {
      "name": "Periapt of Health",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this pendant, you can take a Magic action to regain 2d4 + 2 Hit Points. Once used, this property can't be used again until the next dawn. In addition, you have Advantage on saving throws to avoid or end the Poisoned condition while you wear this pendant."
    },
    {
      "name": "Periapt of Wound Closure",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear this pendant, you stabilize whenever you are dying at the start of your turn. In addition, whenever you roll a Hit Die to regain hit points, double the number of hit points it restores."
    },
    {
      "name": "Periapt of Wound Closure",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this pendant, you gain the following benefits. Life Preservation: Whenever you make a Death Saving Throw, you can change a roll of 9 or lower to a 10, turning a failed save into a successful one. Natural Healing Boost: Whenever you roll a Hit Point Dice to regain Hit Points, double the number of Hit Points it restores."
    },
    {
      "name": "Philter of Love",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "The next time you see a creature within 10 minutes after drinking this philter, you become charmed by that creature for 1 hour. If the creature is of a species and gender you are normally attracted to, you regard it as your true love while you are charmed. This potion's rose-hued, effervescent liquid contains one easy-to-miss bubble shaped like a heart."
    },
    {
      "name": "Philter of Love",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "The next time you see a creature within 10 minutes after drinking this philter, you are charmed by that creature and have the Charmed condition for 1 hour. This rose-hued, effervescent liquid contains one easy-to-miss bubble shaped like a heart."
    },
    {
      "name": "Pipes of Haunting",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You must be proficient with wind instruments to use these pipes. They have 3 charges. You can use an action to play them and expend 1 charge to create an eerie, spellbinding tune. Each creature within 30 feet of you that hears you play must succeed on a 15 Wisdom saving throw or become frightened of you for 1 minute. If you wish, all creatures in the area that aren't hostile toward you automatically succeed on the saving throw. A creature that fails the saving throw can repeat it at the end of each of its turns, ending the effect on itself on a success. A creature that succeeds on its saving t"
    },
    {
      "name": "Pipes of Haunting",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These pipes have 3 charges and regain 1d3 expended charges daily at dawn. You can take a Magic action to play them and expend 1 charge to create an eerie, spellbinding tune. Each creature of your choice within 30 feet of you must succeed on a 15 Wisdom saving throw or have the Frightened condition for 1 minute. A creature that fails the save repeats it at the end of each of its turns, ending the effect on itself on a success. A creature that succeeds on its save is immune to the effect of these pipes for 24 hours."
    },
    {
      "name": "Pipes of the Sewers",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "You must be proficient with wind instruments to use these pipes. While you are attuned to the pipes, ordinary rats and giant rats are indifferent toward you and will not attack you unless you threaten or harm them. The pipes have 3 charges. If you play the pipes as an action, you can use a bonus action to expend 1 to 3 charges, calling forth one swarm of rats with each expended charge, provided that enough rats are within half a mile of you to be called in this fashion (as determined by the DM). If there aren't enough rats to form a swarm, the charge is wasted. Called swarms move toward the mu"
    },
    {
      "name": "Pipes of the Sewers",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While these pipes are on your person, ordinary rat and giant rat are Indifferent [Attitude] toward you and won't attack you unless you threaten or harm them. The pipes have 3 charges and regain 1d3 expended charges daily at dawn. If you play the pipes as a Magic action, you can take a Bonus Action to expend 1 to 3 charges, calling forth one Swarm of Rats with each expended charge if enough rats are within half a mile of you to be called in this fashion (as determined by the DM). If there aren't enough rats to form a swarm, the charge is wasted. Called swarms move toward the music by the shorte"
    },
    {
      "name": "Potion of Acid Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Acid Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Animal Friendship",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you can cast the animal friendship spell (save 13) for 1 hour at will. Agitating this muddy liquid brings little bits into view: a fish scale, a hummingbird tongue, a cat claw, or a squirrel hair."
    },
    {
      "name": "Potion of Animal Friendship",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you can cast the level 3 version of the Animal Friendship spell (save 13). Agitating this potion's muddy liquid brings little bits into view: a fish scale, a hummingbird feather, a cat claw, or a squirrel hair."
    },
    {
      "name": "Potion of Cold Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Cold Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Fire Breath",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "After drinking this potion, you can use a bonus action to exhale fire at a target within 30 feet of you. The target must make a 13 Dexterity saving throw, taking 4d6 fire damage on a failed save, or half as much damage on a successful one. The effect ends after you exhale the fire three times or when 1 hour has passed. This potion's orange liquid flickers, and smoke fills the top of the container and wafts out whenever it is opened."
    },
    {
      "name": "Potion of Fire Breath",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "After drinking this potion, you can take a Bonus Action to exhale fire at a target within 30 feet of yourself. The target makes a 13 Dexterity saving throw, taking 4d6 Fire damage on a failed save or half as much damage on a successful one. The effect ends after you exhale the fire three times or when 1 hour has passed. This potion's orange liquid flickers, and smoke fills the top of the container and wafts out whenever it is opened."
    },
    {
      "name": "Potion of Fire Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Fire Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Force Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Force Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Greater Healing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "You regain 4d4 + 4 hit points when you drink this potion. The potion's red liquid glimmers when agitated."
    },
    {
      "name": "Potion of Greater Healing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "You regain 4d4 + 4 Hit Points when you drink this potion. The potion's red liquid glimmers when agitated."
    },
    {
      "name": "Potion of Growth",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the \"enlarge\" effect of the enlarge/reduce spell for 1d4 hours (no concentration required). The red in the potion's liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts. Shaking the bottle fails to interrupt this process."
    },
    {
      "name": "Potion of Growth",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the \"enlarge\" effect of the Enlarge/Reduce spell for 10 minutes (no Concentration required). The red in the potion's liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts. Shaking the bottle fails to interrupt this process."
    },
    {
      "name": "Potion of Hill Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 21 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a hill giant."
    },
    {
      "name": "Potion of Hill Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 21 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a hill giant."
    },
    {
      "name": "Potion of Lightning Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Lightning Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Necrotic Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Necrotic Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Poison",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This concoction looks, smells, and tastes like a potion of healing or other beneficial potion. However, it is actually poison masked by illusion magic. An identify spell reveals its true nature. If you drink it, you take 3d6 poison damage, and you must succeed on a 13 Constitution saving throw or be poisoned. At the start of each of your turns while you are poisoned in this way, you take 3d6 poison damage. At the end of each of your turns, you can repeat the saving throw. On a successful save, the poison damage you take on your subsequent turns decreases by 1d6. The poison ends when the damage"
    },
    {
      "name": "Potion of Poison",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This concoction looks, smells, and tastes like a Potion of Healing or another beneficial potion. However, it is actually poison masked by illusion magic. Identify reveals its true nature. If you drink this potion, you take 4d6 Poison damage and must succeed on a 13 Constitution saving throw or have the Poisoned condition for 1 hour."
    },
    {
      "name": "Potion of Poison Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Poison Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Psychic Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Psychic Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Pugilism",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "After you drink this potion, each Unarmed Strike you make deals an extra 1d6 Force damage on a hit. This effect lasts 10 minutes. This potion is a thick green fluid that tastes like spinach."
    },
    {
      "name": "Potion of Radiant Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Radiant Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Thunder Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance}"
    },
    {
      "name": "Potion of Thunder Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Potion of Resistance|XDMG}"
    },
    {
      "name": "Potion of Water Breathing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "You can breathe underwater for 1 hour after drinking this potion. Its cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it."
    },
    {
      "name": "Potion of Water Breathing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "You can breathe underwater for 24 hours after drinking this potion. This potion's cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it."
    },
    {
      "name": "Prehistoric Figurine of Wondrous Power, Pyrite Plesiosaurus",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Larger and more roughly hewn than typical figurines of wondrous power, these statuettes depict dinosaurs and related creatures from the earliest days of the world. As an action, you can throw a prehistoric figurine of wondrous power to a point on the ground within 60 feet of yourself while speaking a command word, whereupon the figurine magically transforms into a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and you"
    },
    {
      "name": "Quaal's Feather Token, Anchor",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This object looks like a feather. You can take a Magic action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears."
    },
    {
      "name": "Quaal's Feather Token, Fan",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This object looks like a feather. If you are on a boat or ship, you can take a Magic action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a strong wind. This wind can fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as a Magic action."
    },
    {
      "name": "Quaal's Feather Token, Tree",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This object looks like a feather. You must be outdoors to use this token. You can take a Magic action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius."
    },
    {
      "name": "Quiver of Ehlonna",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Each of the quiver's three compartments connects to an extradimensional space that allows the quiver to hold numerous items while never weighing more than 2 pounds. The shortest compartment can hold up to sixty arrow, crossbow bolt, or similar objects. The midsize compartment holds up to eighteen javelin or similar objects. The longest compartment holds up to six long objects, such as bows, quarterstaff, or spear. You can draw any item the quiver contains as if doing so from a regular quiver or scabbard."
    },
    {
      "name": "Quiver of Ehlonna",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Each of the quiver's three compartments connects to an extradimensional space that allows the quiver to hold numerous items while never weighing more than 2 pounds. The shortest compartment can hold up to 60 Arrow, Bolt, or similar objects. The midsize compartment holds up to 18 Javelin or similar objects. The longest compartment holds up to 6 long objects, such as bows, Quarterstaff, or Spear. You can draw any item the quiver contains as if doing so from a regular quiver or scabbard."
    },
    {
      "name": "Ring of Jumping",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can cast the jump spell from it as a bonus action at will, but can target only yourself when you do so."
    },
    {
      "name": "Ring of Jumping",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can cast Jump from it, but can target only yourself when you do so."
    },
    {
      "name": "Ring of Mind Shielding",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you are immune to magic that allows other creatures to read your thoughts, determine whether you are lying, know your alignment, or know your creature type. Creatures can telepathically communicate with you only if you allow it. You can use an action to cause the ring to become invisible until you use another action to make it visible, until you remove the ring, or until you die. If you die while wearing the ring, your soul enters it, unless it already houses a soul. You can remain in the ring or depart for the afterlife. As long as your soul is in the ring, you can te"
    },
    {
      "name": "Ring of Mind Shielding",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you are immune to magic that allows other creatures to read your thoughts, determine whether you are lying, know your alignment, or know your creature type. Creatures can telepathically communicate with you only if you allow it. You can take a Magic action to cause the ring to become imperceptible until you take another Magic action to make it perceptible, until you remove the ring, or until you die. If you die while wearing the ring, your soul enters it, unless it already houses a soul. You can remain in the ring or depart for the afterlife. As long as your soul is in"
    },
    {
      "name": "Ring of Swimming",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "You have a swimming speed of 40 feet while wearing this ring."
    },
    {
      "name": "Ring of Swimming",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "You have a Swim Speed of 40 feet while wearing this ring."
    },
    {
      "name": "Ring of Warmth",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you have resistance to cold damage. In addition, you and everything you wear and carry are unharmed by temperatures as low as -50 degrees Fahrenheit."
    },
    {
      "name": "Ring of Warmth",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "If you take Cold damage while wearing this ring, the ring reduces the damage you take by 2d8. In addition, while wearing this ring, you and everything you wear and carry are unharmed by temperatures of 0 degrees Fahrenheit or lower."
    },
    {
      "name": "Ring of Water Walking",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "While wearing this ring, you can stand on and move across any liquid surface as if it were solid ground."
    },
    {
      "name": "Ring of Water Walking",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "While wearing this ring, you cast Water Walk from it, targeting only yourself."
    },
    {
      "name": "Robe of Useful Items",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This robe has cloth patches of various shapes and colors covering it. While wearing the robe, you can use an action to detach one of the patches, causing it to become the object or creature it represents. Once the last patch is removed, the robe becomes an ordinary garment. The robe has two of each of the following patches: Dagger Bullseye lantern (filled and lit) Steel mirror 10-foot pole Hempen rope (50 feet, coiled) Sack In addition, the robe has 4d4 other patches. The DM chooses the patches or determines them randomly."
    },
    {
      "name": "Robe of Useful Items",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This robe has cloth patches of various shapes and colors covering it. While wearing the robe, you can take a Magic action to detach one of the patches, causing it to become the object or creature it represents. Once the last patch is removed, the robe becomes an ordinary garment. The robe has two of each of the following patches: Bullseye Lantern (filled and lit) Dagger Mirror Pole Rope (coiled) Sack In addition, the robe has 4d4 other patches. The DM chooses the patches or determines them randomly by rolling on the following table."
    },
    {
      "name": "Rope of Climbing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This 60-foot length of silk rope weighs 3 pounds and can hold up to 3,000 pounds. If you hold one end of the rope and use an action to speak the command word, the rope animates. As a bonus action, you can command the other end to move toward a destination you choose. That end moves 10 feet on your turn when you first command it and 10 feet on each of your turns until reaching its destination, up to its maximum length away, or until you tell it to stop. You can also tell the rope to fasten itself securely to an object or to unfasten itself, to knot or unknot itself, or to coil itself for carryi"
    },
    {
      "name": "Rope of Climbing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This 60-foot length of rope can hold up to 3,000 pounds. While holding one end of the rope, you can take a Magic action to command the other end of the rope to animate and move toward a destination you choose, up to the rope's length away from you. That end moves 10 feet on your turn when you first command it and 10 feet at the start of each of your subsequent turns until reaching its destination or until you tell it to stop. You can also tell the rope to fasten itself securely to an object or to unfasten itself, to knot or unknot itself, or to coil itself for carrying. If you tell the rope to"
    },
    {
      "name": "Saddle of the Cavalier",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While in this saddle on a mount, you can't be dismounted against your will if you're conscious, and attack rolls against the mount have disadvantage."
    },
    {
      "name": "Saddle of the Cavalier",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While in this saddle on a mount, you can't be dismounted against your will if you're conscious, and attack rolls against the mount have disadvantage."
    },
    {
      "name": "Sending Stones",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Sending stones come in pairs, with each smooth stone carved to match the other so the pairing is easily recognized. While you touch one stone, you can use an action to cast the sending spell from it. The target is the bearer of the other stone. If no creature bears the other stone, you know that fact as soon as you use the stone and don't cast the spell. Once sending is cast through the stones, they can't be used again until the next dawn. If one of the stones in a pair is destroyed, the other one becomes nonmagical."
    },
    {
      "name": "Sending Stones",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Sending Stones come in pairs, with each stone carved to match the other so the pairing is easily recognized. While you touch one stone, you can cast Sending from it. The target is the bearer of the other stone. If no creature bears the other stone, you know that fact as soon as you use the stone, and you don't cast the spell. Once Sending is cast using either stone, the stones can't be used again until the next dawn. If one of the stones in a pair is destroyed, the other one becomes nonmagical."
    },
    {
      "name": "Sentinel Shield",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "While holding this shield, you have advantage on initiative rolls and Wisdom (Perception) checks. The shield is emblazoned with a symbol of an eye."
    },
    {
      "name": "Sentinel Shield",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "While holding this Shield, you have Advantage on Initiative rolls and Wisdom (Perception) checks. The Shield is emblazoned with a symbol of an eye."
    },
    {
      "name": "Slippers of Spider Climbing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear these light shoes, you can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free. You have a climbing speed equal to your walking speed. However, the slippers don't allow you to move this way on a slippery surface, such as one covered by ice or oil."
    },
    {
      "name": "Slippers of Spider Climbing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear these light shoes, you can move up, down, and across vertical surfaces and along ceilings, while leaving your hands free. You have a Climb Speed equal to your Speed. However, the slippers don't allow you to move this way on a slippery surface, such as one covered by ice or oil."
    },
    {
      "name": "Slumbering Dragon Vessel",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This vessel can be a potion bottle, drinking horn, or other container meant to hold a liquid. As a bonus action, if the vessel is empty, you can speak the command word to fill the vessel with one of the following (your choice): ale, olive oil, a potion of healing, or a potion of climbing. Once this property is used, it can't be used until the next dawn. A potion you create in this way loses its magical properties if it isn't imbibed within 24 hours."
    },
    {
      "name": "Slumbering Dragon-Touched Focus",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wondrous item can be a scepter, an orb, an amulet, a crystal, or another finely crafted object. It typically incorporates imagery of dragons' wings, claws, teeth, or scales. You have advantage on initiative rolls. While you are holding the focus, it can function as a spellcasting focus for all your spells."
    },
    {
      "name": "Slumbering Scaled Ornament",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This ornament can be jewelry, a cloak, or another wearable accessory. It appears to be fashioned from a dragon's scale, tooth, or claw, or it incorporates images in those shapes. You have advantage on saving throws you make to avoid being charmed or frightened or to end those conditions on you."
    },
    {
      "name": "Spell Scroll (2nd Level)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (3rd Level)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (Level 2)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 12 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Spell Scroll (Level 3)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 13 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Spellwrought Tattoo (2nd Level)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Produced by a special needle, this magic tattoo contains a single 2nd level spell, wrought on your skin by a magic needle. To use the tattoo, you must hold the needle against your skin and speak the command word. The needle turns into ink that becomes the tattoo, which appears on the skin in whatever design you like. Once the tattoo is there, you can cast its spell, requiring no material components. The tattoo glows faintly while you cast the spell and for the spell's duration. Once the spell ends, the tattoo vanishes from your skin. The Ability modifier for this spell is +3; the Save DC is 13"
    },
    {
      "name": "Spellwrought Tattoo (3rd Level)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Produced by a special needle, this magic tattoo contains a single 3rd level spell, wrought on your skin by a magic needle. To use the tattoo, you must hold the needle against your skin and speak the command word. The needle turns into ink that becomes the tattoo, which appears on the skin in whatever design you like. Once the tattoo is there, you can cast its spell, requiring no material components. The tattoo glows faintly while you cast the spell and for the spell's duration. Once the spell ends, the tattoo vanishes from your skin. The Ability modifier for this spell is +4; the Save DC is 15"
    },
    {
      "name": "Staff of the Adder",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Staff",
      "attunement": "requires attunement (by a cleric, druid, or warlock)",
      "desc": "You can use a bonus action to speak this staff's command word and make the head of the staff become that of an animate poisonous snake for 1 minute. By using another bonus action to speak the command word again, you return the staff to its normal inanimate form. You can make a melee attack using the snake head, which has a reach of 5 feet. Your proficiency bonus applies to the attack roll. On a hit, the target takes 1d6 piercing damage and must succeed on a 15 Constitution saving throw or take 3d6 poison damage. The snake head can be attacked while it is animate. It has an Armor Class of 15 an"
    },
    {
      "name": "Staff of the Adder",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Staff",
      "attunement": "requires attunement",
      "desc": "As a Bonus Action, you can turn the head of this staff into that of an animate, venomous snake for 1 minute or revert the staff to its inanimate form. When you take the Attack action, you can make one of the attack rolls using the animated snake head, which has a reach of 5 feet. Apply your Proficiency and Wisdom modifier to the attack roll. On a hit, the target takes 1d6 Piercing damage and 3d6 Poison damage. The snake head can be attacked while it is animate. It has AC 15, HP 20, and Immunity to Poison and Psychic damage. If the head drops to 0 Hit Points, the staff is destroyed. As long as "
    },
    {
      "name": "Staff of the Python",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Staff",
      "attunement": "requires attunement (by a cleric, druid, or warlock)",
      "desc": "You can use an action to speak this staff's command word and throw the staff on the ground within 10 feet of you. The staff becomes a giant constrictor snake under your control and acts on its own initiative count. By using a bonus action to speak the command word again, you return the staff to its normal form in a space formerly occupied by the snake. On your turn, you can mentally command the snake if it is within 60 feet of you and you aren't incapacitated. You decide what action the snake takes and where it moves during its next turn, or you can issue it a general command, such as to attac"
    },
    {
      "name": "Staff of the Python",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Staff",
      "attunement": "requires attunement",
      "desc": "As a Magic action, you can throw this staff so that it lands in an unoccupied space within 10 feet of you, causing the staff to become a Giant Constrictor Snake in that space. The snake is under your control and shares your Initiative count, taking its turn immediately after yours. On your turn, you can mentally command the snake (no action required) if it is within 60 feet of you and you don't have the Incapacitated condition. You decide what action the snake takes and where it moves during its turn, or you can issue it a general command, such as to attack your enemies or guard a location. Ab"
    },
    {
      "name": "Stone of Good Luck",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws."
    },
    {
      "name": "Stone of Good Luck",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws."
    },
    {
      "name": "Trident of Fish Command",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This trident is a magic weapon. It has 3 charges. While you carry it, you can use an action and expend 1 charge to cast dominate beast (save 15) from it on a beast that has an innate swimming speed. The trident regains 1d3 expended charges daily at dawn."
    },
    {
      "name": "Trident of Fish Command",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This magic weapon has 3 charges, and it regains 1d3 expended charges daily at dawn. While you carry it, you can expend 1 charge to cast Dominate Beast (save 15) from it on a Beast that has a Swim Speed."
    },
    {
      "name": "Wand of Magic Detection",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 3 charges. While holding it, you can expend 1 charge as an action to cast the detect magic spell from it. The wand regains 1d3 expended charges daily at dawn."
    },
    {
      "name": "Wand of Magic Detection",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 3 charges. While holding it, you can expend 1 charge to cast Detect Magic from it. The wand regains 1d3 expended charges daily at dawn."
    },
    {
      "name": "Wand of Magic Missiles",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the magic missile spell from it. For 1 charge, you cast the 1st-level version of the spell. You can increase the spell slot level by one for each additional charge you expend. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Magic Missiles",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 7 charges. While holding it, you can expend no more than 3 charges to cast Magic Missile from it. For 1 charge, you cast the level 1 version of the spell. You can increase the spell's level by 1 for each additional charge you expend. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Secrets",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "The wand has 3 charges. While holding it, you can use an action to expend 1 of its charges, and if a secret door or trap is within 30 feet of you, the wand pulses and points at the one nearest to you. The wand regains 1d3 expended charges daily at dawn."
    },
    {
      "name": "Wand of Secrets",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "",
      "desc": "This wand has 3 charges and regains 1d3 expended charges daily at dawn. While holding it, you can take a Magic action to expend 1 charge, and if a secret door or trap is within 60 feet of you, the wand pulses and points at the one nearest to you."
    },
    {
      "name": "Wand of Web",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cast the web spell (save 15) from it. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Web",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can expend 1 charge to cast Web (save 13) from it. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wind Fan",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While holding this fan, you can use an action to cast the gust of wind spell (save 13) from it. Once used, the fan shouldn't be used again until the next dawn. Each time it is used again before then, it has a cumulative 20 chance of not working and tearing into useless, nonmagical tatters."
    },
    {
      "name": "Wind Fan",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While holding this fan, you can cast Gust of Wind (save 13) from it. Each subsequent time the fan is used before the next dawn, it has a cumulative 20 chance of not working; if the fan fails to work, it tears into useless, nonmagical tatters."
    },
    {
      "name": "Winged Boots",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear these boots, you have a flying speed equal to your walking speed. You can use the boots to fly for up to 4 hours, all at once or in several shorter flights, each one using a minimum of 1 minute from the duration. If you are flying when the duration expires, you descend at a rate of 30 feet per round until you land. The boots regain 2 hours of flying capability for every 12 hours they aren't in use."
    },
    {
      "name": "Winged Boots",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "uncommon",
      "rarity_order": 1,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "These boots have 4 charges and regain 1d4 expended charges daily at dawn. While wearing the boots, you can take a Magic action to expend 1 charge, gaining a Fly Speed of 30 feet for 1 hour. If you are flying when the duration expires, you descend at a rate of 30 feet per round until you land."
    },
    {
      "name": "+2 All-Purpose Tool",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by an artificer)",
      "desc": "This simple screwdriver can transform into a variety of tools; as an action, you can touch the item and transform it into any type of artisan's tool of your choice (see the \"Equipment\" chapter in the Player's Handbook for a list of artisan's tools). Whatever form the tool takes, you are proficient with it. While holding this tool, you gain a +2 bonus to the spell attack rolls and the saving throw DCs of your artificer spells. As an action, you can focus on the tool to channel your creative forces. Choose a cantrip that you don't know from any class list. For 8 hours, you can cast that cantrip,"
    },
    {
      "name": "+2 Amulet of the Devout",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a cleric or paladin)",
      "desc": "This amulet bears the symbol of a deity inlaid with precious stones or metals. While you wear the holy symbol, you gain a +2 bonus to spell attack rolls and the saving throw DCs of your spells. While you wear this amulet, you can use your Channel Divinity feature without expending one of the feature's uses. Once this property is used, it can't be used again until the next dawn."
    },
    {
      "name": "+2 Arcane Grimoire",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "While you are holding this leather-bound book, you can use it as a spellcasting focus for your wizard spells, and you gain a +2 bonus to spell attack rolls and to the saving throw DCs of your wizard spells. You can use this book as a spellbook. In addition, when you use your Arcane Recovery feature, you can increase the number of spell slot levels you regain by 1."
    },
    {
      "name": "+2 Bloodwell Vial",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "To attune to this vial, you must place a few drops of your blood into it. The vial can't be opened while your attunement to it lasts. If your attunement to the vial ends, the contained blood turns to ash. You can use the vial as a spellcasting focus for your spells while wearing or holding it, and you gain a +2 bonus to spell attack rolls and to the saving throw DCs of your sorcerer spells. In addition, when you roll any Hit Dice to recover hit points while you are carrying the vial, you can regain 5 sorcery points. This property of the vial can't be used again until the next dawn."
    },
    {
      "name": "+2 Dragonhide Belt",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a monk)",
      "desc": "This finely detailed belt is made of dragonhide. While wearing it, you gain a +2 bonus to the saving throw DCs of your ki features. In addition, you can use an action to regain ki points equal to a roll of your Martial Arts die. You can't use this action again until the next dawn."
    },
    {
      "name": "+2 Moon Sickle",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a druid or ranger)",
      "desc": "This silver-bladed sickle glimmers softly with moonlight. While holding this magic weapon, you gain a +2 bonus to attack and damage rolls made with it, and you gain a +2 bonus to spell attack rolls and the saving throw DCs of your druid and ranger spells. In addition, you can use the sickle as a spellcasting focus for your druid and ranger spells. When you cast a spell that restores hit points, you can roll a d4 and add the number rolled to the amount of hit points restored, provided you are holding the sickle."
    },
    {
      "name": "+2 Rhythm-Maker's Drum",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "While holding this drum, you gain a +2 bonus to spell attack rolls and to the saving throw DCs of your bard spells. As an action, you can play the drum to regain one use of your Bardic Inspiration feature. This property of the drum can't be used again until the next dawn."
    },
    {
      "name": "+2 Rod of the Pact Keeper",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a warlock)",
      "desc": "While holding this rod, you gain a +2 bonus to spell attack rolls and to the saving throw DCs of your warlock spells. In addition, you can regain one warlock spell slot as an action while holding the rod. You can't use this property again until you finish a long rest."
    },
    {
      "name": "+2 Rod of the Pact Keeper",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a warlock)",
      "desc": "While holding this rod, you gain a +2 bonus to spell attack rolls and to the saving throw DCs of your Warlock spells. In addition, you can regain one spell slot as a Magic action while holding the rod. You can't use this property again until you finish a Long Rest."
    },
    {
      "name": "+2 Wand of the War Mage",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "While you are holding this wand, you gain a +2 bonus to spell attack rolls. In addition, you ignore Cover when making a spell attack."
    },
    {
      "name": "+2 Wand of the War Mage",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "While holding this wand, you gain a +2 bonus to spell attack rolls. In addition, you ignore Cover when making a spell attack roll."
    },
    {
      "name": "+2 Wraps of Unarmed Power",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing these wraps, you have a +2 bonus to attack rolls and damage rolls made with your Unarmed Strikes. Those strikes deal your choice of Force damage or their normal damage type."
    },
    {
      "name": "Alchemical Compendium",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "Acrid odors cling to this stained, heavy volume. The book's metal fittings are copper, iron, lead, silver, and gold, some frozen mid-transition from one metal to another. When found, the book contains the following spells: enlarge/reduce, feather fall, flesh to stone, gaseous form, magic weapon, and polymorph. It functions as a spellbook for you. While you are holding the book, you can use it as a spellcasting focus for your wizard spells. The book has 3 charges, and it regains 1d3 expended charges daily at dawn. You can use the charges in the following ways while holding it: If you spend 1 mi"
    },
    {
      "name": "Amulet of Health",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution score is already 19 or higher without it."
    },
    {
      "name": "Amulet of Health",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher without it."
    },
    {
      "name": "Armor of Vulnerability (Bludgeoning)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this armor, you have resistance to bludgeoning damage. Curse: This armor is cursed, a fact that is revealed only when an identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by the remove curse spell or similar magic; removing the armor fails to end the curse. While cursed you have vulnerability to piercing and slashing damage."
    },
    {
      "name": "Armor of Vulnerability (Piercing)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this armor, you have resistance to piercing damage. Curse: This armor is cursed, a fact that is revealed only when an identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by the remove curse spell or similar magic; removing the armor fails to end the curse. While cursed you have vulnerability to bludgeoning and slashing damage."
    },
    {
      "name": "Armor of Vulnerability (Slashing)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this armor, you have resistance to slashing damage. Curse: This armor is cursed, a fact that is revealed only when an identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by the remove curse spell or similar magic; removing the armor fails to end the curse. While cursed you have vulnerability to bludgeoning and piercing damage."
    },
    {
      "name": "Arrow-Catching Shield",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You gain a +2 bonus to AC against ranged attacks while you wield this shield. This bonus is in addition to the shield's normal bonus to AC. In addition, whenever an attacker makes a ranged attack against a target within 5 feet of you, you can use your reaction to become the target of the attack instead."
    },
    {
      "name": "Arrow-Catching Shield",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You gain a +2 bonus to Armor Class against ranged attack rolls while you wield this Shield. This bonus is in addition to the Shield's normal bonus to AC. Whenever an attacker makes a ranged attack roll against a target within 5 feet of you, you can take a Reaction to become the target of the attack instead."
    },
    {
      "name": "Astral Shard",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This crystal is a solidified shard of the Astral Plane, swirling with silver mist. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, immediately after casting the spell you can teleport to an unoccupied space you can see within 30 feet of you."
    },
    {
      "name": "Astromancy Archive",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This brass disc of articulated, concentric rings unfolds into an armillary sphere. As a bonus action, you can unfold it into the sphere or back into a disc. When found, it contains the following spells, which are wizard spells for you while you are attuned to it: augury, divination, find the path, foresight, locate creature, and locate object. It functions as a spellbook for you, with spells encoded on the rings. While you are holding the archive, you can use it as a spellcasting focus for your wizard spells. The archive has 3 charges, and it regains 1d3 expended charges daily at dawn. You can"
    },
    {
      "name": "Atlas of Endless Horizons",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This thick book is bound in dark leather, crisscrossed with inlaid silver lines suggesting a map or chart. When found, the book contains the following spells, which are wizard spells for you while you are attuned to the book: arcane gate, dimension door, gate, misty step, plane shift, teleportation circle, and word of recall. It functions as a spellbook for you. While you are holding the book, you can use it as a spellcasting focus for your wizard spells. The book has 3 charges, and it regains 1d3 expended charges daily at dawn. You can use the charges in the following ways while holding it: I"
    },
    {
      "name": "Bag of Beans",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Inside this heavy cloth bag are 3d4 dry beans. The bag weighs ½ pound plus ¼ pound for each bean it contains. If you dump the bag's contents out on the ground, they explode in a 10-foot radius, extending from the beans. Each creature in the area, including you, must make a 15 Dexterity saving throw, taking 5d4 fire damage on a failed save, or half as much damage on a successful one. The fire ignites flammable objects in the area that aren't being worn or carried. If you remove a bean from the bag, plant it in dirt or sand, and then water it, the bean produces an effect 1 minute later from the "
    },
    {
      "name": "Bag of Beans",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This heavy cloth bag contains 3d4 dry beans when found. The bag weighs half a pound regardless of how many beans it contains and becomes a nonmagical item when it no longer contains any beans. If you dump one or more beans out of the bag, they explode in a 10-foot-radius Sphere [Area of Effect] centered on them. All the dumped beans are destroyed in the explosion, and each creature in the Sphere [Area of Effect], including you, makes a 15 Dexterity saving throw, taking 5d4 Force damage on a failed save or half as much damage on a successful one. If you remove a bean from the bag, plant it in d"
    },
    {
      "name": "Barrier Tattoo (Medium)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo depicts protective imagery and uses ink that resembles liquid metal. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Protection: While you aren't wearing armor, the tattoo grants you an Armor Class of 15 + your "
    },
    {
      "name": "Bead of Force",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This small black sphere measures ¾ of an inch in diameter and weighs an ounce. Typically, 1d4 + 4 beads of force are found together. You can use an action to throw the bead up to 60 feet. The bead explodes on impact and is destroyed. Each creature within a 10-foot radius of where the bead landed must succeed on a 15 Dexterity saving throw or take 5d4 force damage. A sphere of transparent force then encloses the area for 1 minute. Any creature that failed the save and is completely within the area is trapped inside this sphere. Creatures that succeeded on the save, or are partially within the a"
    },
    {
      "name": "Bead of Force",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This small black sphere measures 3/4 of an inch in diameter and weighs an ounce. Typically, 1d4 + 4 Beads of Force are found together. You can take a Magic action to throw the bead up to 60 feet. The bead explodes in a 10-foot-radius Sphere [Area of Effect] on impact and is destroyed. Each creature in the Sphere [Area of Effect] must succeed on a 15 Dexterity saving throw or take 5d4 Force damage. A sphere of transparent force then encloses the area for 1 minute. Any creature that failed the save and is completely within the area is trapped inside this sphere. Creatures that succeeded on the s"
    },
    {
      "name": "Bell Branch",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a druid or warlock)",
      "desc": "This silver implement is shaped like a tree branch and is strung with small golden bells. The branch is a spellcasting focus for your spells while you hold it. The branch has 3 charges, and it regains 1d3 expended charges daily at dawn. You can use the charges in the following ways while holding it: As a bonus action, you can expend 1 charge to detect the presence of aberrations, celestials, constructs, elementals, fey, fiends, or undead within 60 feet of you. If such creatures are present and don't have Cover from you, the bells ring softly, their tone indicating the creature types present. A"
    },
    {
      "name": "Belt of Dwarvenkind",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, you gain the following benefits: Your Constitution score increases by 2, to a maximum of 20. You have advantage on Charisma (Persuasion) checks made to interact with dwarves. In addition, while attuned to the belt, you have a 50 chance each day at dawn of growing a full beard if you're capable of growing one, or a visibly thicker beard if you already have one. If you aren't a dwarf, you gain the following additional benefits while wearing the belt: You have advantage on saving throws against poison, and you have resistance against poison damage. You have darkvision out"
    },
    {
      "name": "Belt of Dwarvenkind",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, you gain the following benefits: You know Dwarvish. You have Advantage on Charisma (Persuasion) checks made to interact with dwarves and duergar. Your Constitution increases by 2, to a maximum of 20. In addition, while attuned to the belt, you have a 50 chance each day at dawn of growing a full beard if you can grow one, or a thicker beard if you already have one. If you aren't a dwarf or duergar, you gain the following additional benefits while wearing the belt: You have Darkvision with a range of 60 feet. You have Resistance to Poison damage. You also have Advantage "
    },
    {
      "name": "Belt of Hill Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 21. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Belt of Hill Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 21. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Boots of Levitation",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear these boots, you can use an action to cast the levitate spell on yourself at will."
    },
    {
      "name": "Boots of Levitation",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear these boots, you can cast Levitate on yourself."
    },
    {
      "name": "Boots of Speed",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear these boots, you can use a bonus action and click the boots' heels together. If you do, the boots double your walking speed, and any creature that makes an opportunity attack against you has disadvantage on the attack roll. If you click your heels together again, you end the effect. When the boots' property has been used for a total of 10 minutes, the magic ceases to function until you finish a long rest."
    },
    {
      "name": "Boots of Speed",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear these boots, you can take a Bonus Action to click the boots' heels together. If you do, the boots double your Speed, and any creature that makes an Opportunity Attack against you has Disadvantage on the attack roll. If you click your heels together again, you end the effect. When you've used the boots' property for a total of 10 minutes, the magic ceases to function for you until you finish a Long Rest."
    },
    {
      "name": "Bowl of Commanding Water Elementals",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While this bowl is filled with water, you can use an action to speak the bowl's command word and summon a water elemental, as if you had cast the conjure elemental spell. The bowl can't be used this way again until the next dawn. The bowl is about 1 foot in diameter and half as deep. It weighs 3 pounds and holds about 3 gallons."
    },
    {
      "name": "Bowl of Commanding Water Elementals",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While this bowl is filled with water and you are within 5 feet of it, you can take a Magic action to summon a Water Elemental. The elemental appears in an unoccupied space as close to the bowl as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The bowl can't be used this way again until the next dawn. The bowl is about 1 foot in diameter and half as deep. It holds about 3 gallons."
    },
    {
      "name": "Bracers of Defense",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor and using no shield."
    },
    {
      "name": "Bracers of Defense",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing these bracers, you gain a +2 bonus to Armor Class if you are wearing no armor and using no Shield."
    },
    {
      "name": "Brazier of Commanding Fire Elementals",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While a fire burns in this brass brazier, you can use an action to speak the brazier's command word and summon a fire elemental, as if you had cast the conjure elemental spell. The brazier can't be used this way again until the next dawn. The brazier weighs 5 pounds."
    },
    {
      "name": "Brazier of Commanding Fire Elementals",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While you are within 5 feet of this brazier, you can take a Magic action to summon a Fire Elemental. The elemental appears in an unoccupied space as close to the brazier as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The brazier can't be used this way again until the next dawn."
    },
    {
      "name": "Cape of the Mountebank",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This cape smells faintly of brimstone. While wearing it, you can use it to cast the dimension door spell as an action. This property of the cape can't be used again until the next dawn. When you disappear, you leave behind a cloud of smoke, and you appear in a similar cloud of smoke at your destination. The smoke lightly obscures the space you left and the space you appear in, and it dissipates at the end of your next turn. A light or stronger wind disperses the smoke."
    },
    {
      "name": "Cape of the Mountebank",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This cape smells faintly of brimstone. While wearing it, you can use it to cast Dimension Door as a Magic action. This property can't be used again until the next dawn. When you teleport with that spell, you leave behind a cloud of smoke. The space you left is Lightly Obscured by that smoke until the end of your next turn."
    },
    {
      "name": "Censer of Controlling Air Elementals",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While incense is burning in this censer, you can use an action to speak the censer's command word and summon an air elemental, as if you had cast the conjure elemental spell. The censer can't be used this way again until the next dawn. This 6-inch-wide, 1-foot-high vessel resembles a chalice with a decorated lid. It weighs 1 pound."
    },
    {
      "name": "Censer of Controlling Air Elementals",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While gently swinging this censer, you can take a Magic action to summon an Air Elemental. The elemental appears in an unoccupied space as close to the censer as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The censer can't be used this way again until the next dawn."
    },
    {
      "name": "Chime of Opening",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This hollow metal tube measures about 1 foot long and weighs 1 pound. You can strike it as an action, pointing it at an object within 120 feet of you that can be opened, such as a door, lid, or lock. The chime issues a clear tone, and one lock or latch on the object opens unless the sound can't reach the object. If no locks or latches remain, the object itself opens. The chime can be used ten times. After the tenth time it cracks and becomes useless."
    },
    {
      "name": "Chime of Opening",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This hollow metal tube measures about 1 foot long and weighs 1 pound. As a Magic action, you can strike the chime to cast Knock. The spell's customary knocking sound is replaced by the clear, ringing tone of the chime, which is audible out to 300 feet. The chime can be used 10 times. After the tenth time, it cracks and becomes useless."
    },
    {
      "name": "Cloak of Displacement",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear this cloak, it projects an illusion that makes you appear to be standing in a place near your actual location, causing any creature to have disadvantage on attack rolls against you. If you take damage, the property ceases to function until the start of your next turn. This property is suppressed while you are incapacitated, restrained, or otherwise unable to move."
    },
    {
      "name": "Cloak of Displacement",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While you wear this cloak, it magically projects an illusion that makes you appear to be standing in a place near your actual location, causing any creature to have Disadvantage on attack rolls against you. If you take damage, the property ceases to function until the start of your next turn. This property is suppressed while your Speed is 0."
    },
    {
      "name": "Cloak of the Bat",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this cloak, you have advantage on Dexterity (Stealth) checks. In an area of dim light or darkness, you can grip the edges of the cloak with both hands and use it to fly at a speed of 40 feet. If you ever fail to grip the cloak's edges while flying in this way, or if you are no longer in dim light or darkness, you lose this flying speed. While wearing the cloak in an area of dim light or darkness, you can use your action to cast polymorph on yourself, transforming into a bat. While you are in the form of the bat, you retain your Intelligence, Wisdom, and Charisma scores. The cloak"
    },
    {
      "name": "Cloak of the Bat",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this cloak, you have Advantage on Dexterity (Stealth) checks. In an area of Dim Light or Darkness, you can grip the edges of the cloak and use it to gain a Fly Speed of 40 feet. If you ever fail to grip the cloak's edges while flying in this way, or if you are no longer in Dim Light or Darkness, you lose this Fly Speed. While wearing the cloak in an area of Dim Light or Darkness, you can cast Polymorph on yourself, shape-shifting into a Bat. While in that form, you retain your Intelligence, Wisdom, and Charisma scores. The cloak can't be used this way again until the next dawn."
    },
    {
      "name": "Crown of the Wrath Bringer",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This jagged iron circlet bears ornaments in the shape of the enemy rune. When worn, the crown glows with pale light as it draws upon the wearer's fury to strike opponents with vicious terror. When you make an attack roll against a creature and hit it while wearing this crown, you can spend and roll one of your unspent Hit Dice. The creature takes extra psychic damage equal to the number rolled. Invoking the Rune: As an action, you can invoke the crown's rune to cast the fear spell (save 15) with it; the spell has a duration of 1 minute and doesn't require concentration. Once the rune has been "
    },
    {
      "name": "Cube of Force",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This cube is about an inch across. Each face has a distinct marking on it that can be pressed. The cube starts with 36 charges, and it regains 1d20 expended charges daily at dawn. You can use an action to press one of the cube's faces, expending a number of charges based on the chosen face, as shown in the Cube of Force Faces table. Each face has a different effect. If the cube has insufficient charges remaining, nothing happens. Otherwise, a barrier of invisible force springs into existence, forming a cube 15 feet on a side. The barrier is centered on you, moves with you, and lasts for 1 minu"
    },
    {
      "name": "Cube of Force",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This cube is about an inch across. Each face has a distinct marking on it. You can press one of those faces, expend the number of charges required for it, and thereby cast the spell associated with it (save 17), as shown in the Cube of Force Faces table. The cube starts with 10 charges, and it regains 1d6 expended charges daily at dawn."
    },
    {
      "name": "Cube of Summoning",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This Tiny cube looks like a jack-in-the-box. When you wind its crank as a Magic action, a merry tune emits from the box, the lid pops open, a creature appears in the nearest unoccupied space, and the lid closes. The lid can't otherwise be opened. Roll on the Cube of Summoning table to determine which spell the cube casts to summon the creature. The spell is cast at level 5 (save 17, +9 attack bonus) and doesn't require Concentration, but you otherwise function as the spell's caster. Once the cube summons a creature, the cube can't do so again until the next dawn."
    },
    {
      "name": "Daern's Instant Fortress",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can use an action to place this 1-inch metal cube on the ground and speak its command word. The cube rapidly grows into a fortress that remains until you use an action to speak the command word that dismisses it, which works only if the fortress is empty. The fortress is a square tower, 20 feet on a side and 30 feet high, with arrow slits on all sides and a battlement atop it. Its interior is divided into two floors. with a ladder running along one wall to connect them. The ladder ends at a trapdoor leading to the roof. When activated, the tower has a small door on the side facing you. The"
    },
    {
      "name": "Daern's Instant Fortress",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "As a Magic action, you can place this 1-inch adamantine statuette on the ground and, using a command word, cause it to grow rapidly into a square adamantine tower. Repeating the command word causes the tower to revert to statuette form, which works only if the tower is empty. Each creature in the area where the tower appears is pushed to an unoccupied space outside but next to the tower. Objects in the area that aren't being worn or carried are also pushed clear of the tower. The tower is 20 feet on a side and 30 feet high, with arrow slits on all sides and a battlement atop it. Its interior i"
    },
    {
      "name": "Dagger of Venom",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "You gain a +1 bonus to attack and damage rolls made with this magic weapon. You can use an action to cause thick, black poison to coat the blade. The poison remains for 1 minute or until an attack using this weapon hits a creature. That creature must succeed on a 15 Constitution saving throw or take 2d10 poison damage and become poisoned for 1 minute. The dagger can't be used this way again until the next dawn."
    },
    {
      "name": "Dagger of Venom",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. You can take a Bonus Action to magically coat the blade with poison. The poison remains for 1 minute or until an attack using this weapon hits a creature. That creature must succeed on a 15 Constitution saving throw or take 2d10 Poison damage and have the Poisoned condition for 1 minute. The weapon can't be used this way again until the next dawn."
    },
    {
      "name": "Delver's Claws",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The back of this weatherworn leather glove is adorned with three large metal hooks shaped like a mole's claws. Stitched into the glove's palm is the mountain rune. The glove is considered a simple melee weapon with the finesse and light properties, and it deals 1d4 slashing damage on a hit. While attuned to the glove, you gain a burrowing speed equal to your walking speed and blindsight to 15 feet. Invoking the Rune: As an action, you can invoke the glove's rune to bolster yourself with the sturdiness of the earth. Spend and roll a number of your unspent Hit Dice up to a maximum equal to your "
    },
    {
      "name": "Devotee's Censer",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a cleric or paladin)",
      "desc": "The rounded head of this flail is perforated with tiny holes, arranged in symbols and patterns. The flail counts as a holy symbol for you. When you hit with an attack using this magic flail, the target takes an extra 1d8 radiant damage. As a bonus action, you can speak the command word to cause the flail to emanate a thin cloud of incense out to 10 feet for 1 minute. At the start of each of your turns, you and any other creatures in the incense each regain 1d4 hit points. This property can't be used again until the next dawn."
    },
    {
      "name": "Dimensional Shackles",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can use an action to place these shackles on an incapacitated creature. The shackles adjust to fit a creature of Small to Large size. In addition to serving as mundane manacles, the shackles prevent a creature bound by them from using any method of extradimensional movement, including teleportation or travel to a different plane of existence. They don't prevent the creature from passing-through an interdimensional portal. You and any creature you designate when you use the shackles can use an action to remove them. Once every 30 days, the bound creature can make a 30 Strength (Athletics) c"
    },
    {
      "name": "Dimensional Shackles",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can take a Utilize action to place these shackles on a creature that has the Incapacitated condition. The shackles adjust to fit a creature of Small to Large size. The shackles prevent a creature bound by them from using any method of extradimensional movement, including teleportation or travel to a different plane of existence. They don't prevent the creature from passing through an interdimensional portal. You and any creature you designate when you use the shackles can take a Utilize action to remove them. Once every 30 days, the bound creature can make a 30 Strength (Athletics) check. "
    },
    {
      "name": "Duplicitous Manuscript",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "To you, this book is a magical spellbook. To anyone else, the book appears to be a volume of verbose romance fiction. As an action, you can change the book's appearance and alter the plot of the romance. When found, the book contains the following spells: hallucinatory terrain, major image, mirror image, mislead, Nystul's magic aura, phantasmal force, and silent image. It functions as a spellbook for you. While you are holding the book, you can use it as a spellcasting focus for your wizard spells. The book has 3 charges, and it regains 1d3 expended charges daily at dawn. You can use the charg"
    },
    {
      "name": "Elemental Essence Shard",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This crackling crystal contains the essence of an elemental plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. Roll a d4 and consult the Elemental Essence Shards table to determine the shard's essence and property. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use that property."
    },
    {
      "name": "Elemental Essence Shard (Air)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This crackling crystal contains the essence of an elemental plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use the following property: Property: You can immediately fly up to 60 feet without provoking opportunity attacks."
    },
    {
      "name": "Elemental Essence Shard (Earth)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This crackling crystal contains the essence of an elemental plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use the following property: Property: You gain resistance to a damage type of your choice until the start of your next turn."
    },
    {
      "name": "Elemental Essence Shard (Fire)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This crackling crystal contains the essence of an elemental plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use the following property: Property: One target of the spell that you can see catches fire. The burning target takes 2d10 fire damage at the start of its next turn, and then the flames go out."
    },
    {
      "name": "Elemental Essence Shard (Water)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This crackling crystal contains the essence of an elemental plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use the following property: Property: You create a wave of water that bursts out from you in a 10-foot radius. Each creature of your choice that you can see in that area takes 2d6 cold damage and must succeed o"
    },
    {
      "name": "Elixir of Health",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, it cures any disease afflicting you, and it removes the blinded, deafened, paralyzed, and poisoned conditions. The clear red liquid has tiny bubbles of light in it."
    },
    {
      "name": "Elixir of Health",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you are cured of all magical contagions. In addition, the following conditions end on you: Blinded, Deafened, Paralyzed, and Poisoned. The clear, red liquid has tiny bubbles of light in it."
    },
    {
      "name": "Elven Chain",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "You gain a +1 bonus to AC while you wear this armor. You are considered proficient with this armor even if you lack proficiency with medium armor."
    },
    {
      "name": "Enspelled Staff (Level 2)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a Spellcaster)",
      "desc": "Bound into this staff is a level 2 spell. The spell is determined when the staff is created and can be of any school of magic. The staff has 6 charges and regains 1d6 expended charges daily at dawn. While holding the staff, you can expend 1 charge to cast its spell. If you expend the staff's last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff. The spell's saving throw DC is 13, and its attack bonus is 5."
    },
    {
      "name": "Enspelled Staff (Level 3)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a Spellcaster)",
      "desc": "Bound into this staff is a level 3 spell. The spell is determined when the staff is created and can be of any school of magic. The staff has 6 charges and regains 1d6 expended charges daily at dawn. While holding the staff, you can expend 1 charge to cast its spell. If you expend the staff's last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff. The spell's saving throw DC is 15, and its attack bonus is 7."
    },
    {
      "name": "Far Realm Shard",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This writhing crystal is steeped in the warped essence of the Far Realm. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can cause a slimy tentacle to rip through the fabric of reality and strike one creature you can see within 30 feet of you. The creature must succeed on a Charisma saving throw against your spell save DC or ta"
    },
    {
      "name": "Figurine of Wondrous Power, Bronze Griffon",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but take"
    },
    {
      "name": "Figurine of Wondrous Power, Bronze Griffon",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Figurine of Wondrous Power is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is Friendly [Attitude] to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on yo"
    },
    {
      "name": "Figurine of Wondrous Power, Ebony Fly",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but take"
    },
    {
      "name": "Figurine of Wondrous Power, Ebony Fly",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Figurine of Wondrous Power is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is Friendly [Attitude] to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on yo"
    },
    {
      "name": "Figurine of Wondrous Power, Golden Lions",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but take"
    },
    {
      "name": "Figurine of Wondrous Power, Golden Lions",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Figurine of Wondrous Power is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is Friendly [Attitude] to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on yo"
    },
    {
      "name": "Figurine of Wondrous Power, Ivory Goats",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but take"
    },
    {
      "name": "Figurine of Wondrous Power, Ivory Goats",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Figurine of Wondrous Power is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is Friendly [Attitude] to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on yo"
    },
    {
      "name": "Figurine of Wondrous Power, Marble Elephant",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but take"
    },
    {
      "name": "Figurine of Wondrous Power, Marble Elephant",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Figurine of Wondrous Power is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is Friendly [Attitude] to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on yo"
    },
    {
      "name": "Figurine of Wondrous Power, Onyx Dog",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but take"
    },
    {
      "name": "Figurine of Wondrous Power, Onyx Dog",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Figurine of Wondrous Power is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is Friendly [Attitude] to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on yo"
    },
    {
      "name": "Figurine of Wondrous Power, Serpentine Owl",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but take"
    },
    {
      "name": "Figurine of Wondrous Power, Serpentine Owl",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Figurine of Wondrous Power is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is Friendly [Attitude] to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on yo"
    },
    {
      "name": "Folding Boat",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This object appears as a wooden box that measures 12 inches long, 6 inches wide, and 6 inches deep. It weighs 4 pounds and floats. It can be opened to store items inside. This item also has three command words, each requiring you to use an action to speak it. One command word causes the box to unfold into a boat 10 feet long, 4 feet wide, and 2 feet deep. The boat has one pair of oars, an anchor, a mast, and a lateen sail. The boat can hold up to four Medium creatures comfortably. The second command word causes the box to unfold into a ship 24 feet long, 8 feet wide; and 6 feet deep. The ship "
    },
    {
      "name": "Folding Boat",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This object appears as a wooden box that measures 12 inches long, 6 inches wide, and 6 inches deep. It weighs 4 pounds and floats. It can be opened to store items inside. This item also has three command words, each requiring a Magic action to use: The box unfolds into a Rowboat. The box unfolds into a Keelboat. The Folding Boat folds back into a box if no creatures are aboard. Any objects in the vessel that can't fit inside the box remain outside the box as it folds. Any objects in the vessel that can fit inside the box do so. When the box becomes a vessel, its weight becomes that of a normal"
    },
    {
      "name": "Fulminating Treatise",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This thick, scorched spellbook reeks of smoke and ozone, and sparks of energy crackles along the edges of its pages. When found, the book contains the following spells: contingency, fireball, gust of wind, Leomund's tiny hut, magic missile, thunderwave, and wall of force. It functions as a spellbook for you. While you are holding the book, you can use it as a spellcasting focus for your wizard spells. The book has 3 charges, and it regains 1d3 expended charges daily at dawn. You can use the charges in the following ways while holding it: If you spend 1 minute studying the book, you can expend "
    },
    {
      "name": "Gem of Seeing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This gem has 3 charges. As an action, you can speak the gem's command word and expend 1 charge. For the next 10 minutes, you have truesight out to 120 feet when you peer through the gem. The gem regains 1d3 expended charges daily at dawn."
    },
    {
      "name": "Gem of Seeing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This gem has 3 charges. As a Magic action, you can expend 1 charge. For the next 10 minutes, you have Truesight out to 120 feet when you peer through the gem. The gem regains 1d3 expended charges daily at dawn."
    },
    {
      "name": "Glamoured Studded Leather",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "While wearing this armor, you gain a +1 bonus to AC. You can also use a bonus action to speak the armor's command word and cause the armor to assume the appearance of a normal set of clothing or some other kind of armor. You decide what it looks like, including color, style, and accessories, but the armor retains its normal bulk and weight. The illusory appearance lasts until you use this property again or remove the armor."
    },
    {
      "name": "Glamoured Studded Leather",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "While wearing this armor, you gain a +1 bonus to Armor Class. You can also take a Bonus Action to cause the armor to assume the appearance of a normal set of clothing or some other kind of armor. You decide what it looks like—including color, style, and accessories—but the armor retains its normal bulk and weight. The illusory appearance lasts until you use this property again or doff the armor."
    },
    {
      "name": "Glowrune Pigment",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This set of 1d4 + 2 small paint pots contains pigments mixed from crushed luminescent gemstones. This magical paint bestows temporary magical gifts on creatures with runes drawn on their skin with this paint. One paint pot contains enough pigment to paint one rune. A creature can spend 10 minutes to paint one of the following runes onto itself or another creature: Journey Rune: difficult terrain doesn't cost the painted creature extra movement. Life Rune: The painted creature gains 10 temporary hit points and has advantage on death saving throws. Light Rune: The painted creature gains darkvisi"
    },
    {
      "name": "Heart Weaver's Primer",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This pristine book smells faintly of a random scent you find pleasing. When found, the book contains the following spells: antipathy/sympathy, charm person, dominate person, enthrall, hypnotic pattern, modify memory, and suggestion. It functions as a spellbook for you. While you are holding the book, you can use it as a spellcasting focus for your wizard spells. The book has 3 charges, and it regains 1d3 expended charges daily at dawn. You can use the charges in the following ways while holding it: If you spend 1 minute studying the book, you can expend 1 charge to replace one of your prepared"
    },
    {
      "name": "Helm of Teleportation",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This helm has 3 charges. While wearing it, you can use an action and expend 1 charge to cast the teleport spell from it. The helm regains 1d3 expended charges daily at dawn."
    },
    {
      "name": "Helm of Teleportation",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This helm has 3 charges. While wearing it, you can expend 1 charge to cast Teleport from it. The helm regains 1d3 expended charges daily at dawn."
    },
    {
      "name": "Heward's Handy Haversack",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This backpack has a central pouch and two side pouches, each of which is an extradimensional space. Each side pouch can hold up to 20 pounds of material, not exceeding a volume of 2 cubic feet. The large central pouch can hold up to 8 cubic feet or 80 pounds of material. The backpack always weighs 5 pounds, regardless of its contents. Placing an object in the haversack follows the normal rules for interacting with objects. Retrieving an item from the haversack requires you to use an action. When you reach into the haversack for a specific item, the item is always magically on top. The haversac"
    },
    {
      "name": "Heward's Handy Haversack",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This backpack has a central pouch and two side pouches, each of which is an extradimensional space. Each side pouch can hold up to 200 pounds of material, not exceeding a volume of 25 cubic feet. The central pouch can hold up to 500 pounds of material, not exceeding a volume of 64 cubic feet. The haversack always weighs 5 pounds, regardless of its contents. Retrieving an item from the haversack requires a Utilize action or a Bonus Action (your choice). When you reach into the haversack for a specific item, the item is always magically on top. If any of its pouches is overloaded, pierced, or to"
    },
    {
      "name": "Horn of Blasting",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can use an action to speak the horn's command word and then blow the horn, which emits a thunderous blast in a 30-foot cone that is audible 600 feet away. Each creature in the cone must make a 15 Constitution saving throw. On a failed save, a creature takes 5d6 thunder damage and is deafened for 1 minute. On a successful save, a creature takes half as much damage and isn't deafened. Creatures and objects made of glass or crystal have disadvantage on the saving throw and take 10d6 thunder damage instead of 5d6. Each use of the horn's magic has a 20 chance of causing the horn to explode. The"
    },
    {
      "name": "Horn of Blasting",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can take a Magic action to blow the horn, which emits a thunderous blast in a 30-foot Cone [Area of Effect] that is audible out to 600 feet. Each creature in the Cone [Area of Effect] makes a 15 Constitution saving throw. On a failed save, a creature takes 5d8 Thunder damage and has the Deafened condition for 1 minute. On a successful save, a creature takes half as much damage only. Glass or crystal objects in the Cone [Area of Effect] that aren't being worn or carried take 10d8 Thunder damage. Each use of the horn's magic has a 20 chance of causing the horn to explode. The explosion deals"
    },
    {
      "name": "Horn of Valhalla, Brass",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can use an action to blow this horn. In response, warrior spirits from the plane of Ysgard appear within 60 feet of you. These spirits use the berserker statistics. They return to Ysgard after 1 hour or when they drop to 0 hit points. Once you use the horn, it can't be used again until 7 days have passed. A brass horn summons 3d4 + 3 berserker. To use the brass horn, you must be proficient with all simple weapons. If you blow the horn without meeting its requirement, the summoned berserker attack you. If you meet the requirement, they are friendly to you and your companions and follow your"
    },
    {
      "name": "Horn of Valhalla, Brass",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can take a Magic action to blow this horn. In response, warrior spirits from the plane of Ysgard appear in unoccupied spaces within 60 feet of you. Each spirit uses the Berserker stat block and returns to Ysgard after 1 hour or when it drops to 0 Hit Points. The spirits look like living, breathing warriors, and they have Immunity to the Charmed and Frightened conditions. Once you use the horn, it can't be used again until 7 days have passed. A brass horn summons 3 Berserker. To use the brass horn, you must have Proficiency with all Simple weapons. If you blow the horn without meeting its r"
    },
    {
      "name": "Horn of Valhalla, Silver",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can use an action to blow this horn. In response, warrior spirits from the plane of Ysgard appear within 60 feet of you. These spirits use the berserker statistics. They return to Ysgard after 1 hour or when they drop to 0 hit points. Once you use the horn, it can't be used again until 7 days have passed. The silver horn summons 2d4 + 2 berserker. The berserker are friendly to you and your companions and follow your commands."
    },
    {
      "name": "Horn of Valhalla, Silver",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can take a Magic action to blow this horn. In response, warrior spirits from the plane of Ysgard appear in unoccupied spaces within 60 feet of you. Each spirit uses the Berserker stat block and returns to Ysgard after 1 hour or when it drops to 0 Hit Points. The spirits look like living, breathing warriors, and they have Immunity to the Charmed and Frightened conditions. Once you use the horn, it can't be used again until 7 days have passed. A silver horn summons 2 Berserker. They are Friendly [Attitude] to you and your allies and follow your commands."
    },
    {
      "name": "Horseshoes of Speed",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These iron horseshoes come in a set of four. While all four shoes are affixed to the hooves of a horse or similar creature, they increase the creature's walking speed by 30 feet."
    },
    {
      "name": "Horseshoes of Speed",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These horseshoes come in a set of four. As a Magic action, you can touch one of the horseshoes to the hoof of a horse or similar creature, whereupon the horseshoe affixes itself to the hoof. Removing a horseshoe also takes a Magic action. While all four horseshoes are attached to the same creature, its Speed is increased by 30 feet."
    },
    {
      "name": "Instrument of the Bards, Canaith Mandolin",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An instrument of the bards is an exquisite example of its kind, superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a legendary bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 psychic damage. You can use an action to play the instrument and cast one of its spells. Once the instrument has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellcasting ability and spell save DC. You can play"
    },
    {
      "name": "Instrument of the Bards, Canaith Mandolin",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An Instrument of the Bards is superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 Psychic damage. You can play the Canaith Mandolin to cast one of the following spells: Fly, Invisibility, Levitate, Protection from Evil and Good, Cure Wounds (level 3), Dispel Magic, and Protection from Energy (Lightning damage only). Once the Canaith Mandolin has been used to cast a spell, it can't be used to cast t"
    },
    {
      "name": "Instrument of the Bards, Cli Lyre",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An instrument of the bards is an exquisite example of its kind, superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a legendary bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 psychic damage. You can use an action to play the instrument and cast one of its spells. Once the instrument has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellcasting ability and spell save DC. You can play"
    },
    {
      "name": "Instrument of the Bards, Cli Lyre",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An Instrument of the Bards is superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 Psychic damage. You can play the Cli Lyre to cast one of the following spells: Fly, Invisibility, Levitate, Protection from Evil and Good, Stone Shape, Wall of Fire, and Wind Wall. Once the Cli Lyre has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellc"
    },
    {
      "name": "Ioun Stone, Awareness",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Awareness",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} While this dark-blue rhomboid orbits your head, you have Advantage on Initiative rolls and Wisdom (Perception) checks."
    },
    {
      "name": "Ioun Stone, Protection",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Protection",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} You gain a +1 bonus to Armor Class while this dusty-rose prism orbits your head."
    },
    {
      "name": "Ioun Stone, Reserve",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Reserve",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} This vibrant purple prism stores spells cast into it, holding them until you use them. The stone can store up to 4 levels of spells at a time. When found, it contains 1d4 levels of stored spells chosen by the DM. Any creature can cast a spell of level 1 through 4 into the stone by touching it as the spell is cast. The spell has no effect, other than to be stored in the stone. If the stone can't hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses. While this stone orbits your head, you "
    },
    {
      "name": "Ioun Stone, Sustenance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Sustenance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} You don't need to eat or drink while this clear spindle orbits your head."
    },
    {
      "name": "Iron Bands of Bilarro",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This rusty iron sphere measures 3 inches in diameter and weighs 1 pound. You can use an action to speak the command word and throw the sphere at a Huge or smaller creature you can see within 60 feet of you. As the sphere moves through the air, it opens into a tangle of metal bands. Make a ranged attack roll with an attack bonus equal to your Dexterity modifier plus your proficiency bonus. On a hit, the target is restrained until you take a bonus action to speak the command word again to release it. Doing so, or missing with the attack, causes the bands to contract and become a sphere once more"
    },
    {
      "name": "Iron Bands of Bilarro",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This rusty iron sphere measures 3 inches in diameter and weighs 1 pound. You can take a Magic action to throw the sphere at a Huge or smaller creature you can see within 60 feet of yourself. As the sphere moves through the air, it opens into a tangle of metal bands. Make a ranged attack roll with an attack bonus equal to your Dexterity modifier plus your Proficiency. On a hit, the target has the Restrained condition until you take a Bonus Action to issue a command that releases it. Doing so or missing with the attack causes the bands to contract and become a sphere once more. A creature that c"
    },
    {
      "name": "Lash of Immolation",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "The handle of this dark leather whip bears the fire rune, and embers dance around the whip's tail. You gain a +1 bonus to attack and damage rolls made with this weapon, and on a hit, the whip deals an extra 1d6 fire damage. When you score a critical hit with an attack using this whip, the target also has the restrained condition until the start of your next turn, as fiery bands lash around the target. Invoking the Rune: When you make an attack with the whip and hit, you can use your reaction to invoke the whip's rune. Doing so increases the extra fire damage dealt by the whip to 2d6. Once the "
    },
    {
      "name": "Libram of Souls and Flesh",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "With covers made of skin and fittings of bone, this tome is cold to the touch, and it whispers faintly. When found, the book contains the following spells, which are wizard spells for you while you are attuned to the book: animate dead, circle of death, false life, finger of death, speak with dead, summon undead, and vampiric touch. It functions as a spellbook for you. While you are holding the book, you can use it as a spellcasting focus for your wizard spells. The book has 3 charges, and it regains 1d3 expended charges daily at dawn. You can use the charges in the following ways while holdin"
    },
    {
      "name": "Lyre of Building",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "While holding this lyre, you can cast mending as an action. You can also play the lyre as a reaction when an object or a structure you can see within 300 feet of you takes damage, causing it to be immune to that damage and any further damage of the same type until the start of your next turn. In addition, you can play the lyre as an action to cast fabricate, move earth, passwall, or summon construct, and that spell can't be cast from it again until the next dawn."
    },
    {
      "name": "Mace of Disruption",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "When you hit a fiend or an undead with this magic weapon, that creature takes an extra 2d6 radiant damage. If the target has 25 hit points or fewer after taking this damage, it must succeed on a 15 Wisdom saving throw or be destroyed. On a successful save, the creature becomes frightened of you until the end of your next turn. While you hold this weapon, it sheds bright light in a 20-foot radius and dim light for an additional 20 feet."
    },
    {
      "name": "Mace of Disruption",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "When you hit a Fiend or an Undead with this magic weapon, that creature takes an extra 2d6 Radiant damage. If the target has 25 Hit Points or fewer after taking this damage, it must succeed on a 15 Wisdom saving throw or be destroyed. On a successful save, the creature has the Frightened condition until the end of your next turn. Light: While you hold this weapon, it sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet."
    },
    {
      "name": "Mace of Smiting",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "You gain a +1 bonus to attack and damage rolls made with this magic weapon. The bonus increases to +3 when you use the mace to attack a construct. When you roll a 20 on an attack roll made with this weapon, the target takes an extra 7 bludgeoning damage, or an extra 14 bludgeoning damage if it's a construct. If a construct has 25 hit points or fewer after taking this damage, it is destroyed. Note: According to the SRD, it is an extra {@damage 2d6 and 4d6 bludgeoning damage, although this is incorrect}."
    },
    {
      "name": "Mace of Smiting",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. The bonus increases to +3 when you use the weapon to attack a Construct. When you roll a 20 on an attack roll made with this weapon, the target takes an extra 7 Bludgeoning damage, or 14 Bludgeoning damage if it's a Construct. If a Construct has 25 Hit Points or fewer after taking this damage, it is destroyed."
    },
    {
      "name": "Mace of Terror",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This magic weapon has 3 charges. While holding it, you can use an action and expend 1 charge to release a wave of terror. Each creature of your choice in a 30-foot radius extending from you must succeed on a 15 Wisdom saving throw or become frightened of you for 1 minute. While it is frightened in this way, a creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action it can use only the Dash action or try to escape from an effect that prevents it from moving. If it has n"
    },
    {
      "name": "Mace of Terror",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This magic weapon has 3 charges and regains 1d3 expended charges daily at dawn. While holding the weapon, you can take a Magic action and expend 1 charge to release a wave of terror from it. Each creature of your choice within 30 feet of you must succeed on a 15 Wisdom saving throw or have the Frightened condition for 1 minute. While Frightened in this way, a creature must spend its turns trying to move as far away from you as it can, and it can't make Opportunity Attack. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If it has now"
    },
    {
      "name": "Mantle of Spell Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "You have advantage on saving throws against spells while you wear this cloak."
    },
    {
      "name": "Mantle of Spell Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "You have Advantage on saving throws against spells while you wear this cloak."
    },
    {
      "name": "Necklace of Fireballs",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This necklace has 1d6 + 3 beads hanging from it. You can use an action to detach a bead and throw it up to 60 feet away. When it reaches the end of its trajectory, the bead detonates as a 3rd-level fireball spell (save 15). You can hurl multiple beads, or even the whole necklace, as one action. When you do so, increase the level of the fireball by 1 for each bead beyond the first."
    },
    {
      "name": "Necklace of Fireballs",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This necklace has 1d6 + 3 beads hanging from it. You can take a Magic action to detach a bead and throw it up to 60 feet away. When it reaches the end of its trajectory, the bead detonates as a level 3 Fireball (save 15). You can hurl multiple beads, or even the whole necklace, at one time. When you do so, increase the damage of the Fireball by 1d6 for each bead after the first (maximum 12d6)."
    },
    {
      "name": "Necklace of Prayer Beads",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a cleric, druid, or paladin)",
      "desc": "This necklace has 1d4 + 2 magic beads made from aquamarine, black pearl, or topaz. It also has many nonmagical beads made from stones such as amber, bloodstone, citrine, coral, jade, pearl, or quartz. If a magic bead is removed from the necklace, that bead loses its magic. Six types of magic beads exist. The DM decides the type of each bead on the necklace or determines it randomly. A necklace can have more than one bead of the same type. To use one, you must be wearing the necklace. Each bead contains a spell that you can cast from it as a bonus action (using your spell save DC if a save is n"
    },
    {
      "name": "Necklace of Prayer Beads",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a cleric, druid, or paladin)",
      "desc": "This necklace has 1d4 + 2 magic beads made from aquamarine, black pearl, or topaz. It also has many nonmagical beads made from stones such as amber, bloodstone, citrine, coral, jade, pearl, or quartz. If a magic bead is removed from the necklace, that bead loses its magic. Six types of magic beads exist. The DM decides the type of each bead on the necklace or determines it randomly by rolling on the table below. A necklace can have more than one bead of the same type. To use one, you must be wearing the necklace. Each bead contains a spell that you can cast from it as a Bonus Action (using you"
    },
    {
      "name": "Oil of Etherealness",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "Beads of this cloudy gray oil form on the outside of its container and quickly evaporate. The oil can cover a Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the etherealness spell for 1 hour."
    },
    {
      "name": "Oil of Etherealness",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "One vial of this oil can cover one Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the Etherealness spell for 1 hour. Beads of this cloudy, gray oil form on the outside of its container and quickly evaporate."
    },
    {
      "name": "Outer Essence Shard",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This flickering crystal holds the essence of an Outer Plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. Roll a d4 and consult the Outer Essence Shards table to determine the shard's essence and property. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use that property."
    },
    {
      "name": "Outer Essence Shard (Chaotic)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This flickering crystal holds the essence of an Outer Plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use that property. Property: Choose one creature who takes damage from the spell. That target has disadvantage on attack rolls and ability checks made before the start of your next turn."
    },
    {
      "name": "Outer Essence Shard (Evil)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This flickering crystal holds the essence of an Outer Plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use that property. Property: Choose one creature who takes damage from the spell. That target takes an extra 3d6 necrotic damage."
    },
    {
      "name": "Outer Essence Shard (Good)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This flickering crystal holds the essence of an Outer Plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use that property. Property: You or one creature of your choice that you can see within 30 feet of you gains 3d6 temporary hit points."
    },
    {
      "name": "Outer Essence Shard (Lawful)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This flickering crystal holds the essence of an Outer Plane. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can use that property. Property: You can end one of the following conditions affecting yourself or one creature you can see within 30 feet of you: charmed, blinded, deafened, frightened, poisoned, or stunned."
    },
    {
      "name": "Periapt of Proof against Poison",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This delicate silver chain has a brilliant-cut black gem pendant. While you wear it, poisons have no effect on you. You are immune to the poisoned condition and have immunity to poison damage."
    },
    {
      "name": "Periapt of Proof against Poison",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This delicate silver chain has a brilliant-cut black gem pendant. While you wear it, you have Immunity to the Poisoned condition and Poison damage."
    },
    {
      "name": "Planecaller's Codex",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "The pages of this book are bound in fiend hide, and its cover is embossed with a diagram of the Great Wheel of the multiverse. When found, the book contains the following spells: banishment, find familiar, gate, magic circle, planar binding, and summon elemental. It functions as a spellbook for you. While you are holding the book, you can use it as a spellcasting focus for your wizard spells. The book has 3 charges, and it regains 1d3 expended charges daily at dawn. You can use the charges in the following ways while holding it: If you spend 1 minute studying the book, you can expend 1 charge "
    },
    {
      "name": "Portable Hole",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can use an action to unfold a portable hole and place it on or against a solid surface, whereupon the portable hole creates an extradimensional hole 10 feet deep. The cylindrical space within the hole exists on a different plane, so it can't be used to create open passages. Any creature inside an open portable hole can exit the hole by climbing out of it. You can use an action to close a portable hole by taking hold of the edges of the cloth and foldin"
    },
    {
      "name": "Portable Hole",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can take a Magic action to unfold a Portable Hole and place it on or against a solid surface, whereupon the Portable Hole creates an extradimensional hole 10 feet deep. The cylindrical space within the hole exists on a different plane of existence, so it can't be used to create open passages. Any creature inside an open Portable Hole can exit the hole by climbing out of it. You can take a Magic action to close a Portable Hole by taking hold of the edge"
    },
    {
      "name": "Potion of Clairvoyance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the effect of the clairvoyance spell. An eyeball bobs in this yellowish liquid but vanishes when the potion is opened."
    },
    {
      "name": "Potion of Clairvoyance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the effect of the Clairvoyance spell (no Concentration required). An eyeball bobs in this potion's yellowish liquid but vanishes when the potion is opened."
    },
    {
      "name": "Potion of Diminution",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the \"reduce\" effect of the enlarge/reduce spell for 1d4 hours (no concentration required). The red in the potion's liquid continuously contracts to a tiny bead and then expands to color the clear liquid around it. Shaking the bottle fails to interrupt this process."
    },
    {
      "name": "Potion of Diminution",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the \"reduce\" effect of the Enlarge/Reduce spell for 1d4 hours (no Concentration required). The red in the potion's liquid continuously contracts to a tiny bead and then expands to color the clear liquid around it. Shaking the bottle fails to interrupt this process."
    },
    {
      "name": "Potion of Fire Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 25 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a fire giant."
    },
    {
      "name": "Potion of Fire Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 25 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a fire giant."
    },
    {
      "name": "Potion of Frost Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 23 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a frost giant."
    },
    {
      "name": "Potion of Frost Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 23 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a frost giant."
    },
    {
      "name": "Potion of Gaseous Form",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the effect of the gaseous form spell for 1 hour (no concentration required) or until you end the effect as a bonus action. This potion's container seems to hold fog that moves and pours like water."
    },
    {
      "name": "Potion of Gaseous Form",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the effect of the Gaseous Form spell for 1 hour (no Concentration required) or until you end the effect as a Bonus Action. This potion's container seems to hold fog that moves and pours like water."
    },
    {
      "name": "Potion of Heroism",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "For 1 hour after drinking it, you gain 10 temporary hit points that last for 1 hour. For the same duration, you are under the effect of the bless spell (no concentration required). This blue potion bubbles and steams as if boiling."
    },
    {
      "name": "Potion of Heroism",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain 10 Temporary Hit Points that last for 1 hour. For the same duration, you are under the effect of the Bless spell (no Concentration required). This potion's blue liquid bubbles and steams as if boiling."
    },
    {
      "name": "Potion of Invisibility",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "This potion's container looks empty but feels as though it holds liquid. When you drink the potion, you have the Invisible condition for 1 hour. The effect ends early if you make an attack roll, deal damage, or cast a spell."
    },
    {
      "name": "Potion of Invulnerability",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "For 1 minute after you drink this potion, you have resistance to all damage. The potion's syrupy liquid looks like liquefied iron."
    },
    {
      "name": "Potion of Invulnerability",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "For 1 minute after you drink this potion, you have Resistance to all damage. This potion's syrupy liquid looks like liquefied iron."
    },
    {
      "name": "Potion of Mind Reading",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the effect of the detect thoughts spell (save 13). The potion's dense, purple liquid has an ovoid cloud of pink floating in it."
    },
    {
      "name": "Potion of Mind Reading",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the effect of the Detect Thoughts spell (save 13) for 10 minutes (no Concentration required). This potion's dense, purple liquid has an ovoid cloud of pink floating in it."
    },
    {
      "name": "Potion of Stone Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 23 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a stone giant."
    },
    {
      "name": "Potion of Stone Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 23 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a stone giant."
    },
    {
      "name": "Potion of Superior Healing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "You regain 8d4 + 8 hit points when you drink this potion. The potion's red liquid glimmers when agitated."
    },
    {
      "name": "Potion of Superior Healing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "You regain 8d4 + 8 Hit Points when you drink this potion. The potion's red liquid glimmers when agitated."
    },
    {
      "name": "Prehistoric Figurine of Wondrous Power, Kyanite Pteranodon",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Larger and more roughly hewn than typical figurines of wondrous power, these statuettes depict dinosaurs and related creatures from the earliest days of the world. As an action, you can throw a prehistoric figurine of wondrous power to a point on the ground within 60 feet of yourself while speaking a command word, whereupon the figurine magically transforms into a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and you"
    },
    {
      "name": "Protective Verses",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This leather-bound spellbook is reinforced with iron and silver fittings and an iron lock (20 to open). As an action, you can touch the book's cover and cause it to lock as if you cast arcane lock on it. When found, the book contains the following spells: arcane lock, dispel magic, globe of invulnerability, glyph of warding, Mordenkainen's private sanctum, protection from evil and good, and symbol. It functions as a spellbook for you. While you are holding the book, you can use it as a spellcasting focus for your wizard spells. The book has 3 charges, and it regains 1d3 expended charges daily "
    },
    {
      "name": "Quaal's Feather Token, Anchor",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tiny object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. Anchor: You can use an action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears."
    },
    {
      "name": "Quaal's Feather Token, Bird",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tiny object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. Bird: You can use an action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a roc, but it obeys your simple commands and can't attack. It can carry up to 500 pounds while flying at its maximum speed (16 miles an hour for a maximum of 144 miles per day. with a one-hour rest for every 3 hours of flying), or 1,000 pounds at half that speed. The bird disappears after flying its maximum"
    },
    {
      "name": "Quaal's Feather Token, Bird",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This object looks like a feather. You can take a Magic action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a Roc, but it can't attack. It obeys your simple commands and can carry up to 500 pounds while flying at its maximum speed (16 miles per hour for a maximum of 144 miles per day, with a 1-hour rest for every 3 hours of flying) or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 Hit Points. You can dismiss the bird as a Magic a"
    },
    {
      "name": "Quaal's Feather Token, Fan",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tiny object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. Fan: If you are on a boat or ship, you can use an action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a wind strong enough to fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as an action."
    },
    {
      "name": "Quaal's Feather Token, Swan Boat",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tiny object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. Swan Boat: You can use an action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-foot-long, 20-foot-wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can use an action while on the boat to command it to move or to turn up to 90 degrees. The boat can carry up to thirty-two Medium or smaller creatures. A Large creature counts as four Medium creat"
    },
    {
      "name": "Quaal's Feather Token, Swan Boat",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This object looks like a feather. You can take a Magic action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-foot-long, 20-foot-wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can take a Magic action while on the boat to command it to move or to turn up to 90 degrees. The boat remains for 24 hours and then disappears. You can dismiss the boat as a Magic action."
    },
    {
      "name": "Quaal's Feather Token, Tree",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tiny object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. Tree: You must be outdoors to use this token. You can use an action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius."
    },
    {
      "name": "Quaal's Feather Token, Whip",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tiny object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. Whip: You can use an action to throw the token to a point within 10 feet of you. The token disappears, and a floating whip takes its place. You can then use a bonus action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of 9. On a hit, the target takes 1d6 + 5 force damage. As a bonus action on your turn, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of it. The whip disapp"
    },
    {
      "name": "Quaal's Feather Token, Whip",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This object looks like a feather. You can take a Magic action to throw the token to a point within 10 feet of yourself. The token disappears, and a floating whip takes its place. You can then take a Bonus Action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 Force damage. As a Bonus Action, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of the whip. The whip disappears after 1 hour, when you take a Magic action to dismiss it, or when you die or have "
    },
    {
      "name": "Reveler's Concertina",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "While holding this concertina, you gain a +2 bonus to the saving throw DC of your bard spells. As an action, you can use the concertina to cast Otto's irresistible dance from the item. This property of the concertina can't be used again until the next dawn."
    },
    {
      "name": "Ring of Acid Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Acid Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of Animal Influence",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, you can use an action to expend 1 of its charges to cast one of the following spells: Animal friendship (save 13) Fear (save 13), targeting only beasts that have an Intelligence of 3 or lower Speak with animals"
    },
    {
      "name": "Ring of Animal Influence",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, you can expend 1 charge to cast one of the following spells (save 13) from it: Animal Friendship Fear (affects Beasts only) Speak with Animals"
    },
    {
      "name": "Ring of Cold Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Cold Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of Evasion",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing it, you can use your reaction to expend 1 of its charges to succeed on that saving throw instead."
    },
    {
      "name": "Ring of Evasion",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing the ring, you can take a Reaction to expend 1 charge to succeed on that save instead."
    },
    {
      "name": "Ring of Feather Falling",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling."
    },
    {
      "name": "Ring of Feather Falling",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling."
    },
    {
      "name": "Ring of Fire Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Fire Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of Force Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Force Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of Free Action",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While you wear this ring, difficult terrain doesn't cost you extra movement. In addition, magic can neither reduce your speed nor cause you to be paralyzed or restrained."
    },
    {
      "name": "Ring of Free Action",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While you wear this ring, Difficult Terrain doesn't cost you extra movement. In addition, magic can neither reduce any of your Speeds nor cause you to have the Paralyzed or Restrained condition."
    },
    {
      "name": "Ring of Lightning Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Lightning Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of Necrotic Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Necrotic Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of Poison Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Poison Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of Protection",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You gain a +1 bonus to AC and saving throws while wearing this ring."
    },
    {
      "name": "Ring of Protection",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You gain a +1 bonus to Armor Class and saving throws while wearing this ring."
    },
    {
      "name": "Ring of Psychic Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Psychic Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of Radiant Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Radiant Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of Spell Storing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time. When found, it contains 1d6 - 1 levels of stored spells chosen by the DM. Any creature can cast a spell of 1st through 5th level into the ring by touching the ring as the spell is cast. The spell has no effect, other than to be stored in the ring. If the ring can't hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses. While wearing this ring, you can cast any spell stor"
    },
    {
      "name": "Ring of Spell Storing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time. When found, it contains 1d6 - 1 levels of stored spells chosen by the DM. Any creature can cast a spell of level 1 through 5 into the ring by touching the ring as the spell is cast. The spell has no effect other than to be stored in the ring. If the ring can't hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses. While wearing this ring, you can cast any spell stored in"
    },
    {
      "name": "Ring of Thunder Resistance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ring of Resistance}"
    },
    {
      "name": "Ring of Thunder Resistance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Ring of Resistance|XDMG}"
    },
    {
      "name": "Ring of X-ray Vision",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can use an action to speak its command word. When you do so, you can see into and through solid matter for 1 minute. This vision has a radius of 30 feet. To you, solid objects within that radius appear transparent and don't prevent light from passing through them. The vision can penetrate 1 foot of stone, 1 inch of common metal, or up to 3 feet of wood or dirt. Thicker substances block the vision, as does a thin sheet of lead. Whenever you use the ring again before taking a long rest, you must succeed on a 15 Constitution saving throw or gain one level of exhaustio"
    },
    {
      "name": "Ring of X-ray Vision",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can take a Magic action to gain X-ray vision with a range of 30 feet for 1 minute. To you, solid objects within that radius appear transparent and don't prevent light from passing through them. The vision can penetrate 1 foot of stone, 1 inch of common metal, or up to 3 feet of wood or dirt. Thicker substances or a thin sheet of lead block the vision. Whenever you use the ring again before taking a Long Rest, you must succeed on a 15 Constitution saving throw or gain 1 Exhaustion level."
    },
    {
      "name": "Ring of the Ram",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, you can use an action to expend 1 to 3 of its charges to make a ranged spell attack against one creature you can see within 60 feet of you. The ring produces a spectral ram's head and makes its attack roll with a +7 bonus. On a hit, for each charge you spend, the target takes 2d10 force damage and is pushed 5 feet away from you. Alternatively, you can expend 1 to 3 of the ring's charges as an action to try to break an object you can see within 60 feet of you that isn't being worn or carried. The"
    },
    {
      "name": "Ring of the Ram",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This ring has 3 charges and regains 1d3 expended charges daily at dawn. While wearing the ring, you can take a Magic action to expend 1 to 3 charges to make a ranged spell attack against one creature you can see within 60 feet of yourself. The ring produces a spectral ram's head and makes its attack roll with a +7 bonus. On a hit, for each charge you spend, the target takes 2d10 Force damage and is pushed 5 feet away from you. Alternatively, you can expend 1 to 3 of the ring's charges as a Magic action to try to break a nonmagical object you can see within 60 feet of yourself that isn't being "
    },
    {
      "name": "Robe of Eyes",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This robe is adorned with eyelike patterns. While you wear the robe, you gain the following benefits: The robe lets you see in all directions, and you have advantage on Wisdom (Perception) checks that rely on sight. You have darkvision out to a range of 120 feet. You can see invisible creatures and objects, as well as see into the Ethereal Plane, out to a range of 120 feet. The eyes on the robe can't be closed or averted. Although you can close or avert your own eyes, you are never considered to be doing so while wearing this robe. A light spell cast on the robe or a daylight spell cast within"
    },
    {
      "name": "Robe of Eyes",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This robe is adorned with eyelike patterns. While you wear the robe, you gain the following benefits: The robe gives you Advantage on Wisdom (Perception) checks that rely on sight. You have Darkvision and Truesight, both with a range of 120 feet. Drawbacks: A Light spell cast on the robe or a Daylight spell cast within 5 feet of the robe gives you the Blinded condition for 1 minute. At the end of each of your turns, you make a Constitution saving throw (11 for Light or 15 for Daylight), ending the condition on yourself on a success."
    },
    {
      "name": "Rod of Rulership",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You can use an action to present the rod and command obedience from each creature of your choice that you can see within 120 feet of you. Each target must succeed on a 15 Wisdom saving throw or be charmed by you for 8 hours. While charmed in this way, the creature regards you as its trusted leader. If harmed by you or your companions, or commanded to do something contrary to its nature, a target ceases to be charmed in this way. The rod can't be used again until the next dawn."
    },
    {
      "name": "Rod of Rulership",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You can take a Magic action to present the rod and command obedience from each creature of your choice that you can see within 120 feet of yourself. Each target must succeed on a 15 Wisdom saving throw or have the Charmed condition for 8 hours. While Charmed in this way, the creature regards you as its trusted leader. If harmed by you or your allies or commanded to do something contrary to its nature, a target ceases to be Charmed in this way. Once used, this property can't be used again until the next dawn."
    },
    {
      "name": "Rope of Entanglement",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This rope is 30 feet long and weighs 3 pounds. If you hold one end of the rope and use an action to speak its command word, the other end darts forward to entangle a creature you can see within 20 feet of you. The target must succeed on a 15 Dexterity saving throw or become restrained. You can release the creature by using a bonus action to speak a second command word. A target restrained by the rope can use an action to make a 15 Strength or Dexterity check (target's choice). On a success, the creature is no longer restrained by the rope. The rope has AC 20 and 20 hit points. It regains 1 hit"
    },
    {
      "name": "Rope of Entanglement",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This rope is 30 feet long. While holding one end of the rope, you can take a Magic action to command the other end to dart forward and entangle one creature you can see within 20 feet of yourself. The target must succeed on a 15 Dexterity saving throw or have the Restrained condition. You can release the target by letting go of your end of the rope (causing the rope to coil up in the target's space) or by using a Bonus Action to repeat the command (causing the rope to coil up in your hand). A target Restrained by the rope can take an action to make its choice of a 15 Strength (Athletics) or De"
    },
    {
      "name": "Scroll of Protection (Aberrations)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Beasts)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Celestials)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Constructs)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Dragons)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Elementals)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Fey)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Fiends)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Giants)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Humanoids)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Monstrosities)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Oozes)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Plants)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection (Undead)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "{#itemEntry Scroll of Protection|XDMG}"
    },
    {
      "name": "Scroll of Protection from Aberrations",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "Using an action to read the scroll encloses you in an invisible barrier that extends from you to form a 5-foot-radius, 10-foot-high cylinder. For 5 minutes, this barrier prevents aberrations from entering or affecting anything within the cylinder. The cylinder moves with you and remains centered on you. However, if you move in such a way that an aberration would be inside the cylinder, the effect ends. A creature can attempt to overcome the barrier by using an action to make a 15 Charisma check. On a success, the creature ceases to be affected by the barrier."
    },
    {
      "name": "Scroll of Protection from Beasts",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "Using an action to read the scroll encloses you in an invisible barrier that extends from you to form a 5-foot-radius, 10-foot-high cylinder. For 5 minutes, this barrier prevents beasts from entering or affecting anything within the cylinder. The cylinder moves with you and remains centered on you. However, if you move in such a way that a beast would be inside the cylinder, the effect ends. A creature can attempt to overcome the barrier by using an action to make a 15 Charisma check. On a success, the creature ceases to be affected by the barrier."
    },
    {
      "name": "Scroll of Protection from Celestials",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "Using an action to read the scroll encloses you in an invisible barrier that extends from you to form a 5-foot-radius, 10-foot-high cylinder. For 5 minutes, this barrier prevents celestials from entering or affecting anything within the cylinder. The cylinder moves with you and remains centered on you. However, if you move in such a way that a celestial would be inside the cylinder, the effect ends. A creature can attempt to overcome the barrier by using an action to make a 15 Charisma check. On a success, the creature ceases to be affected by the barrier."
    },
    {
      "name": "Scroll of Protection from Elementals",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "Using an action to read the scroll encloses you in an invisible barrier that extends from you to form a 5-foot-radius, 10-foot-high cylinder. For 5 minutes, this barrier prevents elementals from entering or affecting anything within the cylinder. The cylinder moves with you and remains centered on you. However, if you move in such a way that an elemental would be inside the cylinder, the effect ends. A creature can attempt to overcome the barrier by using an action to make a 15 Charisma check. On a success, the creature ceases to be affected by the barrier."
    },
    {
      "name": "Scroll of Protection from Fey",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "Using an action to read the scroll encloses you in an invisible barrier that extends from you to form a 5-foot-radius, 10-foot-high cylinder. For 5 minutes, this barrier prevents fey from entering or affecting anything within the cylinder. The cylinder moves with you and remains centered on you. However, if you move in such a way that a fey would be inside the cylinder, the effect ends. A creature can attempt to overcome the barrier by using an action to make a 15 Charisma check. On a success, the creature ceases to be affected by the barrier."
    },
    {
      "name": "Scroll of Protection from Fiends",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "Using an action to read the scroll encloses you in an invisible barrier that extends from you to form a 5-foot-radius, 10-foot-high cylinder. For 5 minutes, this barrier prevents fiends from entering or affecting anything within the cylinder. The cylinder moves with you and remains centered on you. However, if you move in such a way that a fiend would be inside the cylinder, the effect ends. A creature can attempt to overcome the barrier by using an action to make a 15 Charisma check. On a success, the creature ceases to be affected by the barrier."
    },
    {
      "name": "Scroll of Protection from Plants",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "Using an action to read the scroll encloses you in an invisible barrier that extends from you to form a 5-foot-radius, 10-foot-high cylinder. For 5 minutes, this barrier prevents plants from entering or affecting anything within the cylinder. The cylinder moves with you and remains centered on you. However, if you move in such a way that a plant would be inside the cylinder, the effect ends. A creature can attempt to overcome the barrier by using an action to make a 15 Charisma check. On a success, the creature ceases to be affected by the barrier."
    },
    {
      "name": "Scroll of Protection from Undead",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "Using an action to read the scroll encloses you in an invisible barrier that extends from you to form a 5-foot-radius, 10-foot-high cylinder. For 5 minutes, this barrier prevents undead from entering or affecting anything within the cylinder. The cylinder moves with you and remains centered on you. However, if you move in such a way that an undead would be inside the cylinder, the effect ends. A creature can attempt to overcome the barrier by using an action to make a 15 Charisma check. On a success, the creature ceases to be affected by the barrier."
    },
    {
      "name": "Shadowfell Brand Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo is dark in color and abstract. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Shadow Essence: You gain darkvision with a range of 60 feet, and you have advantage on Dexterity (Stealth) checks. Shadowy Defense: "
    },
    {
      "name": "Shadowfell Shard",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "This dull, cold crystal sits heavy and leaden, saturated by the Shadowfell's despair. As an action, you can attach the shard to a Tiny object (such as a weapon or a piece of jewelry) or detach it. It falls off if your attunement to it ends. You can use the shard as a spellcasting focus while you hold or wear it. When you use a Metamagic option on a spell while you are holding or wearing the shard, you can momentarily curse one creature targeted by the spell; choose one ability score, and until the end of your next turn, the creature has disadvantage on ability checks and saving throws that use"
    },
    {
      "name": "Shield of Missile Attraction",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While holding this shield, you have resistance to damage from ranged weapon attacks. Curse: This shield is cursed. Attuning to it curses you until you are targeted by the remove curse spell or similar magic. Removing the shield fails to end the curse on you. Whenever a ranged weapon attack is made against a target within 10 feet of you, the curse causes you to become the target instead."
    },
    {
      "name": "Shield of Missile Attraction",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While holding this Shield, you have Resistance to damage from attacks made with Ranged weapons. Curse: This Shield is cursed. Attuning to it curses you until you are targeted by a Remove Curse spell or similar magic. Removing the Shield fails to end the curse on you. Whenever an attack with a Ranged weapon targets a creature within 10 feet of you, the curse causes you to become the target instead."
    },
    {
      "name": "Spell Scroll (4th Level)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (5th Level)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (Level 4)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 14 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Spell Scroll (Level 5)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 15 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Spellwrought Tattoo (4th Level)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Produced by a special needle, this magic tattoo contains a single 4th level spell, wrought on your skin by a magic needle. To use the tattoo, you must hold the needle against your skin and speak the command word. The needle turns into ink that becomes the tattoo, which appears on the skin in whatever design you like. Once the tattoo is there, you can cast its spell, requiring no material components. The tattoo glows faintly while you cast the spell and for the spell's duration. Once the spell ends, the tattoo vanishes from your skin. The Ability modifier for this spell is +4; the Save DC is 15"
    },
    {
      "name": "Spellwrought Tattoo (5th Level)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Produced by a special needle, this magic tattoo contains a single 5th level spell, wrought on your skin by a magic needle. To use the tattoo, you must hold the needle against your skin and speak the command word. The needle turns into ink that becomes the tattoo, which appears on the skin in whatever design you like. Once the tattoo is there, you can cast its spell, requiring no material components. The tattoo glows faintly while you cast the spell and for the spell's duration. Once the spell ends, the tattoo vanishes from your skin. The Ability modifier for this spell is +5; the Save DC is 17"
    },
    {
      "name": "Staff of Charming",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a bard, cleric, druid, sorcerer, warlock, or wizard)",
      "desc": "While holding this staff, you can use an action to expend 1 of its 10 charges to cast charm person, command, or comprehend languages from it using your spell save DC. The staff can also be used as a magic quarterstaff. If you are holding the staff and fail a saving throw against an enchantment spell that targets only you, you can turn your failed save into a successful one. You can't use this property of the staff again until the next dawn. If you succeed on a save against an enchantment spell that targets only you, with or without the staff's intervention, you can use your reaction to expend "
    },
    {
      "name": "Staff of Charming",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a bard, cleric, druid, sorcerer, warlock, or wizard)",
      "desc": "This staff has 10 charges. While holding the staff, you can use any of its properties: You can expend 1 of the staff's charges to cast Charm Person, Command, or Comprehend Languages from it using your spell save DC. If you succeed on a saving throw against an Enchantment spell that targets only you, you can take a Reaction to expend 1 charge from the staff and turn the spell back on its caster as if you had cast the spell. If you fail a saving throw against an Enchantment spell that targets only you, you can turn your failed save into a successful one. You can't use this property of the staff "
    },
    {
      "name": "Staff of Healing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a bard, cleric, or druid)",
      "desc": "This staff has 10 charges. While holding it, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC and spellcasting ability modifier: cure wounds (1 charge per spell level, up to 4th), lesser restoration (2 charges). or mass cure wounds (5 charges). The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1. the staff vanishes in a flash of light, lost forever."
    },
    {
      "name": "Staff of Healing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a bard, cleric, or druid)",
      "desc": "This staff has 10 charges. While holding the staff, you can cast one of the spells on the following table from it, using your spellcasting ability modifier. The table indicates how many charges you must expend to cast the spell. Regaining Charges: The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff vanishes in a flash of light, lost forever."
    },
    {
      "name": "Staff of Swarming Insects",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a bard, cleric, druid, sorcerer, warlock, or wizard)",
      "desc": "This staff has 10 charges and regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, a swarm of insects consumes and destroys the staff, then disperses. Spells: While holding the staff, you can use an action to expend some of its charges to cast one of the following spells from it, using your spell save DC: giant insect (4 charges) or insect plague (5 charges). Insect Cloud: While holding the staff, you can use an action and expend 1 charge to cause a swarm of harmless flying insects to spread out in a 30-foot radius from you. The insects remain for "
    },
    {
      "name": "Staff of Swarming Insects",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a bard, cleric, druid, sorcerer, warlock, or wizard)",
      "desc": "This staff has 10 charges. Insect Cloud: While holding the staff , you can take a Magic action and expend 1 charge to cause a swarm of harmless flying insects to fill a 30-foot Emanation [Area of Effect] originating from you. The insects remain for 10 minutes, making the area Heavily Obscured for creatures other than you. A strong wind (like that created by Gust of Wind) disperses the swarm and ends the effect. Spells: While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC and spell attack modifier. The table indicates how many charges "
    },
    {
      "name": "Staff of Withering",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a cleric, druid, or warlock)",
      "desc": "This staff has 3 charges and regains 1d3 expended charges daily at dawn. The staff can be wielded as a magic quarterstaff. On a hit, it deals damage as a normal quarterstaff, and you can expend 1 charge to deal an extra 2d10 necrotic damage to the target. In addition, the target must succeed on a 15 Constitution saving throw or have disadvantage for 1 hour on any ability check or saving throw that uses Strength or Constitution."
    },
    {
      "name": "Staff of Withering",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a cleric, druid, or warlock)",
      "desc": "This staff has 3 charges and regains 1d3 expended charges daily at dawn. The staff can be wielded as a magic Quarterstaff. On a hit, it deals damage as a normal Quarterstaff , and you can expend 1 charge to deal an extra 2d10 Necrotic damage to the target and force it to make a 15 Constitution saving throw. On a failed save, the target has Disadvantage for 1 hour on any ability check or saving throw that uses Strength or Constitution."
    },
    {
      "name": "Staff of the Rooted Hills",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement",
      "desc": "The hill rune is carved into this gnarled wooden staff. The staff magically resizes to match the height of any creature that attunes to it. The staff can be wielded as a magic quarterstaff that grants a +1 bonus to attack and damage rolls made with it. The first time you hit any creature with the staff on your turn, the creature must succeed on a 12 Strength saving throw or be restrained by spectral vines until the start of your next turn. Invoking the Rune: As an action, you can invoke the staff's rune to cast either hold person (save 12) or speak with plants with the staff. When you cast hol"
    },
    {
      "name": "Staff of the Woodlands",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a druid)",
      "desc": "This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While holding it, you have a +2 bonus to spell attack rolls. The staff has 10 charges for the following properties. It regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff loses its properties and becomes a nonmagical quarterstaff. Spells: You can use an action to expend 1 or more of the staff's charges to cast one of the following spells from it, using your spell save DC: animal friendship (1 charge), awaken (5 charges), bark"
    },
    {
      "name": "Staff of the Woodlands",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Staff",
      "attunement": "requires attunement (by a druid)",
      "desc": "This staff has 6 charges and can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. While holding it, you have a +2 bonus to spell attack rolls. Spells: While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell. Tree Form: You can take a Magic action to plant one end of the staff in earth in an unoccupied space and expend 1 charge to transform the staff into a healthy tree. The tree is 60 feet tall and has a 5-foot-"
    },
    {
      "name": "Stirring Dragon Vessel",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "This vessel can be a potion bottle, drinking horn, or other container meant to hold a liquid. As a bonus action, if the vessel is empty, you can speak the command word to fill the vessel with one of the following (your choice): ale, olive oil, mead, a potion of healing, a potion of greater healing, a potion of climbing, or a potion of fire breath. Once this property is used, it can't be used until the next dawn. A potion you create in this way loses its magical properties if it isn't imbibed within 24 hours."
    },
    {
      "name": "Stirring Dragon-Touched Focus",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "This wondrous item can be a scepter, an orb, an amulet, a crystal, or another finely crafted object. It typically incorporates imagery of dragons' wings, claws, teeth, or scales. You have advantage on initiative rolls. While you are holding the focus, it can function as a spellcasting focus for all your spells. The focus gains an additional property determined by the family of the dragon in whose hoard it became Stirring: Whenever you use a spell slot to cast a spell that deals acid, cold, fire, lightning, or poison damage, roll a d6, and you gain a bonus equal to the number rolled to one of t"
    },
    {
      "name": "Stirring Scaled Ornament",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "",
      "desc": "This ornament can be jewelry, a cloak, or another wearable accessory. It appears to be fashioned from a dragon's scale, tooth, or claw, or it incorporates images in those shapes. You gain a +1 bonus to AC, and you can't be charmed or frightened. Moreover, each creature of your choice within 30 feet of you has advantage on saving throws it makes to avoid being charmed or frightened or to end those conditions on itself."
    },
    {
      "name": "Stone of Controlling Earth Elementals",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "If the stone is touching the ground, you can use an action to speak its command word and summon an earth elemental, as if you had cast the conjure elemental spell. The stone can't be used this way again until the next dawn. The stone weighs 5 pounds."
    },
    {
      "name": "Stone of Controlling Earth Elementals",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While touching this 5-pound stone to the ground, you can take a Magic action to summon an Earth Elemental. The elemental appears in an unoccupied space you choose within 30 feet of yourself, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The stone can't be used this way again until the next dawn."
    },
    {
      "name": "Sun Blade",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This item appears to be a longsword hilt. While grasping the hilt, you can use a bonus action to cause a blade of pure radiance to spring into existence, or make the blade disappear. While the blade exists, this magic longsword has the finesse property. If you are proficient with shortsword or longsword, you are proficient with the sun blade. You gain a +2 bonus to attack and damage rolls made with this weapon, which deals radiant damage instead of slashing damage. When you hit an undead with it, that target takes an extra 1d8 radiant damage. The sword's luminous blade emits bright light in a "
    },
    {
      "name": "Sun Blade",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This item appears to be a sword hilt. Blade of Radiance: While grasping the hilt, you can take a Bonus Action to cause a blade of pure radiance to spring into existence or make the blade disappear. While the blade exists, this magic weapon functions as a Longsword with F. If you are proficient with Longswords or Shortswords, you are proficient with the Sun Blade. You gain a +2 bonus to attack rolls and damage rolls made with this weapon, which deals Radiant damage instead of Slashing damage. When you hit an Undead with it, that target takes an extra 1d8 Radiant damage. Sunlight: The sword's lu"
    },
    {
      "name": "Tentacle Rod",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Made by the drow, this rod is a magic weapon that ends in three rubbery tentacles. While holding the rod, you can use an action to direct each tentacle to attack a creature you can see within 15 feet of you. Each tentacle makes a melee attack roll with a +9 bonus. On a hit, the tentacle deals 1d6 bludgeoning damage. If you hit a target with all three tentacles, it must make a 15 Constitution saving throw. On a failure, the creature's speed is halved, it has disadvantage on Dexterity saving throws, and it can't use reactions for 1 minute. Moreover, on each of its turns, it can take either an ac"
    },
    {
      "name": "Tentacle Rod",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This rod ends in three rubbery tentacles. While holding the rod, you can take a Magic action to direct the tentacles to stretch outward, each one attacking a creature you can see within 15 feet of yourself. For each tentacle, make a melee attack roll with a +9 bonus. A tentacle deals 1d6 Psychic damage on a hit. If you hit the same target with all three tentacles, the target must succeed on a 15 Dexterity saving throw or have the Restrained condition until you have the Incapacitated condition, until you take a Bonus Action to release the target, or until the target is no longer within 15 feet "
    },
    {
      "name": "Wand of Binding",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges for the following properties. It regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed. Spells: While holding the wand, you can use an action to expend some of its charges to cast one of the following spells (save 17): hold monster (5 charges) or hold person (2 charges). Assisted Escape: While holding the wand, you can use your reaction to expend 1 charge and gain advantage on a saving throw you make to avoid being paralyzed or restrained, or you can expend 1 charge and gai"
    },
    {
      "name": "Wand of Binding",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This wand has 7 charges. Spells: While holding the wand, you can cast one of the spells (save 17) on the following table from it. The table indicates how many charges you must expend to cast the spell. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Enemy Detection",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This wand has 7 charges. While holding it, you can use an action and expend 1 charge to speak its command word. For the next minute, you know the direction of the nearest creature hostile to you within 60 feet, but not its distance from you. The wand can sense the presence of hostile creatures that are ethereal, invisible, disguised, or hidden, as well as those in plain sight. The effect ends if you stop holding the wand. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Enemy Detection",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge. For 1 minute, you know the direction of the nearest creature Hostile [Attitude] to you within 60 feet, but not its distance from you. The wand can sense the presence of Hostile [Attitude] creatures that are Invisible, ethereal, disguised, or hidden, as well as those in plain sight. The effect ends if you stop holding the wand. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Fear",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This wand has 7 charges for the following properties. It regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed. Command: While holding the wand, you can use an action to expend 1 charge and command another creature to flee or grovel, as with the command spell (save 15). Cone of Fear: While holding the wand, you can use an action to expend 2 charges, causing the wand's tip to emit a 60-foot cone of amber light. Each creature in the cone must succeed on a 15 Wisdom saving throw or become frightened "
    },
    {
      "name": "Wand of Fear",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This wand has 7 charges. Spells: While holding the wand, you can cast one of the spells (save 15) on the following table from it. The table indicates how many charges you must expend to cast the spell. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Fireballs",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the fireball spell (save 15) from it. For 1 charge, you cast the 3rd-level version of the spell. You can increase the spell slot level by one for each additional charge you expend. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Fireballs",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can expend no more than 3 charges to cast Fireball (save 15) from it. For 1 charge, you cast the level 3 version of the spell. You can increase the spell's level by 1 for each additional charge you expend. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Lightning Bolts",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the lightning bolt spell (save 15) from it. For 1 charge, you cast the 3rd-level version of the spell. You can increase the spell slot level by one for each additional charge you expend. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Lightning Bolts",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can expend no more than 3 charges to cast Lightning Bolt (save 15) from it. For 1 charge, you cast the level 3 version of the spell. You can increase the spell's level by 1 for each additional charge you expend. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Paralysis",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cause a thin blue ray to streak from the tip toward a creature you can see within 60 feet of you. The target must succeed on a 15 Constitution saving throw or be paralyzed for 1 minute. At the end of each of the target's turns, it can repeat the saving throw, ending the effect on itself on a success. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Paralysis",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge to cause a thin blue ray to streak from the tip toward a creature you can see within 60 feet of yourself. The target must succeed on a 15 Constitution saving throw or have the Paralyzed condition for 1 minute. At the end of each of the target's turns, it repeats the save, ending the effect on itself on a success. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Wonder",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges and choose a target within 120 feet of you. The target can be a creature, an object, or a point in space. Roll d100 and consult the following table to discover what happens. If the effect causes you to cast a spell from the wand, the spell's save DC is 15. If the spell normally has a range expressed in feet, its range becomes 120 feet if it isn't already. If an effect covers an area, you must center the spell on and include the target. If an effect has multiple possible subjects, the DM randomly determi"
    },
    {
      "name": "Wand of Wonder",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge while choosing a point within 120 feet of yourself. That location becomes the point of origin of a spell or other magical effect determined by rolling on the Wand of Wonder Effects table. Spells cast from the wand have a save DC of 15. If a spell's maximum range is normally less than 120 feet, it becomes 120 feet when cast from the wand. If an effect has multiple possible subjects, the DM determines randomly which among them are affected. Regaining Charges: The wand regains 1d6 + 1 expended charges daily "
    },
    {
      "name": "War Horn of Valor",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This brass war horn is engraved with the war rune, which glows purple when the horn is blown. You can blow the horn as a bonus action. When you do, if you have the frightened condition, you immediately end that condition on yourself. You also have advantage on saving throws against being frightened until the start of your next turn. Invoking the Rune: When you blow the horn, you can also invoke the rune, imbuing the horn's deep call with protective magic that affects creatures of your choice within 30 feet of yourself. You and all affected creatures gain a +1 bonus to AC until the start of you"
    },
    {
      "name": "Wayfarer's Boots",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This pair of boots is made of durable cloth, with the journey rune stitched in golden thread above each heel. While you are wearing this item, your walking speed increases by 10 feet, and you have advantage on Wisdom (Survival) checks. Invoking the Runes: As a bonus action, you can invoke the boots' runes to cast the expeditious retreat spell with them. Once the runes have been invoked, they can't be invoked again until the next dawn."
    },
    {
      "name": "Wings of Flying",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this cloak, you can use an action to speak its command word. This turns the cloak into a pair of bat wings or bird wings on your back for 1 hour or until you repeat the command word as an action. The wings give you a flying speed of 60 feet. When they disappear, you can't use them again for 1d12 hours."
    },
    {
      "name": "Wings of Flying",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "rare",
      "rarity_order": 2,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this cloak, you can take a Magic action to turn the cloak into a pair of wings on your back. The wings lasts for 1 hour or until you end the effect early as a Magic action. The wings give you a Fly Speed of 60 feet. If you are aloft when the wings disappear, you fall. When the wings disappear, you can't use them again for 1d12 hours."
    },
    {
      "name": "+3 All-Purpose Tool",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by an artificer)",
      "desc": "This simple screwdriver can transform into a variety of tools; as an action, you can touch the item and transform it into any type of artisan's tool of your choice (see the \"Equipment\" chapter in the Player's Handbook for a list of artisan's tools). Whatever form the tool takes, you are proficient with it. While holding this tool, you gain a +3 bonus to the spell attack rolls and the saving throw DCs of your artificer spells. As an action, you can focus on the tool to channel your creative forces. Choose a cantrip that you don't know from any class list. For 8 hours, you can cast that cantrip,"
    },
    {
      "name": "+3 Amulet of the Devout",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a cleric or paladin)",
      "desc": "This amulet bears the symbol of a deity inlaid with precious stones or metals. While you wear the holy symbol, you gain a +3 bonus to spell attack rolls and the saving throw DCs of your spells. While you wear this amulet, you can use your Channel Divinity feature without expending one of the feature's uses. Once this property is used, it can't be used again until the next dawn."
    },
    {
      "name": "+3 Arcane Grimoire",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "While you are holding this leather-bound book, you can use it as a spellcasting focus for your wizard spells, and you gain a +3 bonus to spell attack rolls and to the saving throw DCs of your wizard spells. You can use this book as a spellbook. In addition, when you use your Arcane Recovery feature, you can increase the number of spell slot levels you regain by 1."
    },
    {
      "name": "+3 Bloodwell Vial",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer)",
      "desc": "To attune to this vial, you must place a few drops of your blood into it. The vial can't be opened while your attunement to it lasts. If your attunement to the vial ends, the contained blood turns to ash. You can use the vial as a spellcasting focus for your spells while wearing or holding it, and you gain a +3 bonus to spell attack rolls and to the saving throw DCs of your sorcerer spells. In addition, when you roll any Hit Dice to recover hit points while you are carrying the vial, you can regain 5 sorcery points. This property of the vial can't be used again until the next dawn."
    },
    {
      "name": "+3 Dragonhide Belt",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a monk)",
      "desc": "This finely detailed belt is made of dragonhide. While wearing it, you gain a +3 bonus to the saving throw DCs of your ki features. In addition, you can use an action to regain ki points equal to a roll of your Martial Arts die. You can't use this action again until the next dawn."
    },
    {
      "name": "+3 Moon Sickle",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a druid or ranger)",
      "desc": "This silver-bladed sickle glimmers softly with moonlight. While holding this magic weapon, you gain a +3 bonus to attack and damage rolls made with it, and you gain a +3 bonus to spell attack rolls and the saving throw DCs of your druid and ranger spells. In addition, you can use the sickle as a spellcasting focus for your druid and ranger spells. When you cast a spell that restores hit points, you can roll a d4 and add the number rolled to the amount of hit points restored, provided you are holding the sickle."
    },
    {
      "name": "+3 Rhythm-Maker's Drum",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "While holding this drum, you gain a +3 bonus to spell attack rolls and to the saving throw DCs of your bard spells. As an action, you can play the drum to regain one use of your Bardic Inspiration feature. This property of the drum can't be used again until the next dawn."
    },
    {
      "name": "+3 Rod of the Pact Keeper",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a warlock)",
      "desc": "While holding this rod, you gain a +3 bonus to spell attack rolls and to the saving throw DCs of your warlock spells. In addition, you can regain one warlock spell slot as an action while holding the rod. You can't use this property again until you finish a long rest."
    },
    {
      "name": "+3 Rod of the Pact Keeper",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a warlock)",
      "desc": "While holding this rod, you gain a +3 bonus to spell attack rolls and to the saving throw DCs of your Warlock spells. In addition, you can regain one spell slot as a Magic action while holding the rod. You can't use this property again until you finish a Long Rest."
    },
    {
      "name": "+3 Wand of the War Mage",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "While you are holding this wand, you gain a +3 bonus to spell attack rolls. In addition, you ignore Cover when making a spell attack."
    },
    {
      "name": "+3 Wand of the War Mage",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "While holding this wand, you gain a +3 bonus to spell attack rolls. In addition, you ignore Cover when making a spell attack roll."
    },
    {
      "name": "+3 Wraps of Unarmed Power",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While wearing these wraps, you have a +3 bonus to attack rolls and damage rolls made with your Unarmed Strikes. Those strikes deal your choice of Force damage or their normal damage type."
    },
    {
      "name": "Acid Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Amethyst Lodestone",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This fist-sized chunk of amethyst is infused with an amethyst dragon's ability to bend gravitational forces. While you are carrying the lodestone, you have advantage on Strength saving throws. The lodestone has 6 charges for the following properties, which you can use while you are holding the stone. The stone regains 1d6 expended charges daily at dawn. Flight: As a bonus action, you can expend 1 charge to gain the power of flight for 10 minutes. For the duration, you gain a flying speed equal to your walking speed, and you can hover. Gravitational Thrust: As an action, you can expend 1 charge"
    },
    {
      "name": "Amulet of the Planes",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this amulet, you can use an action to name a location that you are familiar with on another plane of existence. Then make a 15 Intelligence check. On a successful check, you cast the plane shift spell. On a failure, you and each creature and object within 15 feet of you travel to a random destination. Roll a d100. On a 1-60, you travel to a random location on the plane you named. On a 61-100, you travel to a randomly determined plane of existence."
    },
    {
      "name": "Amulet of the Planes",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this amulet, you can take a Magic action to name a location that you are familiar with on another plane of existence. Then make a 15 Intelligence (Arcana) check. On a successful check, you cast Plane Shift. On a failed check, you and each creature and object within 15 feet of you travel to a random destination determined by rolling 1d100 and consulting the following table."
    },
    {
      "name": "Animated Shield",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While holding this shield, you can speak its command word as a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The shield remains animated for 1 minute, until you use a bonus action to end this effect, or until you are incapacitated or die, at which point the shield falls to the ground or into your hand if you have one free."
    },
    {
      "name": "Animated Shield",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While holding this Shield, you can take a Bonus Action to cause it to animate. The Shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The Shield remains animate for 1 minute, until you take a Bonus Action to end this effect, or until you die or have the Incapacitated condition, at which point the Shield falls to the ground or into your hand if you have one free."
    },
    {
      "name": "Bag of Devouring",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This bag superficially resembles a bag of holding but is a feeding orifice for a gigantic extradimensional creature. Turning the bag inside out closes the orifice. The extradimensional creature attached to the bag can sense whatever is placed inside the bag. Animal or vegetable matter placed wholly in the bag is devoured and lost forever. When part of a living creature is placed in the bag, as happens when someone reaches inside it, there is a 50 chance that the creature is pulled inside the bag. A creature inside the bag can use its action to try to escape with a successful 15 Strength check."
    },
    {
      "name": "Bag of Devouring",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This bag resembles a Bag of Holding but is a feeding orifice for a gigantic extradimensional creature. Turning the bag inside out closes the orifice. The extradimensional creature attached to the bag can sense whatever is placed inside the bag. Animal or vegetable matter placed wholly in the bag is devoured and lost forever. When part of a living creature is placed in the bag, as happens when someone reaches inside it, there is a 50 chance that the creature is pulled inside the bag. A creature inside the bag can take an action to try to escape, doing so with a successful 15 Strength (Athletics"
    },
    {
      "name": "Barrier Tattoo (Large)",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo depicts protective imagery and uses ink that resembles liquid metal. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Protection: While you aren't wearing armor, the tattoo grants you an Armor Class of 18. You ca"
    },
    {
      "name": "Belt of Fire Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 25. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Belt of Fire Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 25. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Belt of Frost Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 23. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Belt of Frost Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 23. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Belt of Stone Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 23. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Belt of Stone Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 23. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Black Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to acid damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest black dragon within 30 mil"
    },
    {
      "name": "Black Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Blue Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to lightning damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest blue dragon within 30"
    },
    {
      "name": "Blue Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Brass Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to fire damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest brass dragon within 30 mil"
    },
    {
      "name": "Brass Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Bronze Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to lightning damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest bronze dragon within "
    },
    {
      "name": "Bronze Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Candle of Invocation",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This slender taper is dedicated to a deity and shares that deity's alignment. The candle's alignment can be detected with the detect evil and good spell. The DM chooses the god and associated alignment or determines the alignment randomly. The candle's magic is activated when the candle is lit, which requires an action. After burning for 4 hours, the candle is destroyed. You can snuff it out early for use at a later time. Deduct the time it burned in increments of 1 minute from the candle's total burn time. While lit, the candle sheds dim light in a 30-foot radius. Any creature within that lig"
    },
    {
      "name": "Candle of Invocation",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This candle's magic is activated when the candle is lit, which requires a Magic action. After burning for 4 hours, the candle is destroyed. You can snuff it out early for use at a later time. Deduct the time it burned in increments of 1 minute from its total burn time. While lit, the candle sheds Dim Light in a 30-foot radius. While you are within that light, you have Advantage on D20 Test. In addition, a Cleric or Druid in the light can cast level 1 spells they have prepared without expending spell slots. Alternatively, when you light the candle for the first time, you can cast Gate with it. "
    },
    {
      "name": "Carpet of Flying, 3 ft. × 5 ft.",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can speak the carpet's command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it. A 3 ft. × 5 ft. carpet can carry up to 200 lb. at a fly speed of 80 feet. A carpet can carry up to twice this weight, but it flies at half speed if it carries more than its normal capacity."
    },
    {
      "name": "Carpet of Flying, 3 ft. × 5 ft.",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can make this carpet hover and fly by taking a Magic action and using the carpet's command word. It moves according to your directions if you are within 30 feet of it. A 3 ft. × 5 ft. carpet can carry up to 200 lb. at a fly speed of 80 feet. A carpet can carry up to twice the weight shown on the table, but its Fly Speed is halved if it carries more than its normal capacity."
    },
    {
      "name": "Carpet of Flying, 4 ft. × 6 ft.",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can speak the carpet's command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it. A 4 ft. × 6 ft. carpet can carry up to 400 lb. at a fly speed of 60 feet. A carpet can carry up to twice this weight, but it flies at half speed if it carries more than its normal capacity."
    },
    {
      "name": "Carpet of Flying, 4 ft. × 6 ft.",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can make this carpet hover and fly by taking a Magic action and using the carpet's command word. It moves according to your directions if you are within 30 feet of it. A 4 ft. × 6 ft. carpet can carry up to 400 lb. at a fly speed of 60 feet. A carpet can carry up to twice the weight shown on the table, but its Fly Speed is halved if it carries more than its normal capacity."
    },
    {
      "name": "Carpet of Flying, 5 ft. × 7 ft.",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can speak the carpet's command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it. A 5 ft. × 7 ft. carpet can carry up to 600 lb. at a fly speed of 40 feet. A carpet can carry up to twice this weight, but it flies at half speed if it carries more than its normal capacity."
    },
    {
      "name": "Carpet of Flying, 5 ft. × 7 ft.",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can make this carpet hover and fly by taking a Magic action and using the carpet's command word. It moves according to your directions if you are within 30 feet of it. A 5 ft. × 7 ft. carpet can carry up to 600 lb. at a fly speed of 40 feet. A carpet can carry up to twice the weight shown on the table, but its Fly Speed is halved if it carries more than its normal capacity."
    },
    {
      "name": "Carpet of Flying, 6 ft. × 9 ft.",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can speak the carpet's command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it. A 6 ft. × 9 ft. carpet can carry up to 800 lb. at a fly speed of 30 feet. A carpet can carry up to twice this weight, but it flies at half speed if it carries more than its normal capacity."
    },
    {
      "name": "Carpet of Flying, 6 ft. × 9 ft.",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can make this carpet hover and fly by taking a Magic action and using the carpet's command word. It moves according to your directions if you are within 30 feet of it. A 6 ft. × 9 ft. carpet can carry up to 800 lb. at a fly speed of 30 feet. A carpet can carry up to twice the weight shown on the table, but its Fly Speed is halved if it carries more than its normal capacity."
    },
    {
      "name": "Cauldron of Rebirth",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a druid or warlock)",
      "desc": "This Tiny pot bears relief scenes of heroes on its cast iron sides. You can use the cauldron as a spellcasting focus for your spells, and it functions as a suitable component for the scrying spell. When you finish a long rest, you can use the cauldron to create a potion of greater healing. The potion lasts for 24 hours, then loses its magic if not consumed. As an action, you can cause the cauldron to grow large enough for a Medium creature to crouch within. You can revert the cauldron to its normal size as an action, harmlessly shunting anything that can't fit inside to the nearest unoccupied "
    },
    {
      "name": "Cauldron of Rebirth",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a druid or warlock)",
      "desc": "This Tiny pot bears relief scenes of heroes on its cast-iron sides. You can use the cauldron as a Spellcasting Focus for your spells, and it functions as a suitable component for the Scrying spell. Brew Potion: When you finish a Long Rest, you can use the cauldron to create a Potion of Greater Healing, which takes 1 minute. The potion lasts for 24 hours, then loses its magic if not consumed. Raise Dead: As a Magic action, you can cause the cauldron to grow large enough for a Medium creature to crouch within. You can revert the cauldron to its normal size as a Magic action, harmlessly shunting "
    },
    {
      "name": "Cloak of Arachnida",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This fine garment is made of black silk interwoven with faint silvery threads. While wearing it, you gain the following benefits: You have resistance to poison damage. You have a climbing speed equal to your walking speed. You can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free. You can't be caught in webs of any sort and can move through webs as if they were difficult terrain. You can use an action to cast the web spell (save 13). The web created by the spell fills twice its normal area. Once used, this property of the cloak can't be u"
    },
    {
      "name": "Cloak of Arachnida",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This fine garment is made of black silk interwoven with faint, silvery threads. While wearing it, you gain the following benefits. Poison Resistance: You have Resistance to Poison damage. Spider Climb: You have a Climb Speed equal to your Speed and can move up, down, and across vertical surfaces and along ceilings, while leaving your hands free. Spider Walk: You can't be caught in webs of any sort and can move through webs as if they were Difficult Terrain. Web: You can cast Web (save 13). The web created by the spell fills twice its normal area. Once used, this property can't be used again un"
    },
    {
      "name": "Cold Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Copper Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to acid damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest copper dragon within 30 mi"
    },
    {
      "name": "Copper Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Crystal Ball",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This crystal ball is about 6 inches in diameter. While touching it, you can cast the scrying spell (save 17) with it."
    },
    {
      "name": "Crystal Ball",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the Scrying spell (save 17) with it."
    },
    {
      "name": "Crystalline Chronicle",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "An etched crystal sphere the size of a grapefruit hums faintly and pulses with irregular flares of inner light. While you are touching the crystal, you can retrieve and store information and spells within the crystal at the same rate as reading and writing. When found, the crystal contains the following spells: detect thoughts, intellect fortress, Rary's telepathic bond, sending, telekinesis, Tasha's mind whip, and Tenser's floating disk. It functions as a spellbook for you, with its spells and other writing psychically encoded within it. While you are holding the crystal, you can use it as a "
    },
    {
      "name": "Demon Armor",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this armor, you gain a +1 bonus to AC, and you can understand and speak Abyssal. In addition, the armor's clawed gauntlets turn unarmed strikes with your hands into magic weapons that deal slashing damage, with a +1 bonus to attack and damage rolls and a damage die of 1d8. Curse: Once you don this cursed armor, you can't doff it unless you are targeted by the remove curse spell or similar magic. While wearing the armor, you have disadvantage on attack rolls against demons and on saving throws against their spells and special abilities."
    },
    {
      "name": "Dwarven Plate",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "While wearing this armor, you gain a +2 bonus to AC. In addition, if an effect moves you against your will along the ground, you can use your reaction to reduce the distance you are moved by up to 10 feet."
    },
    {
      "name": "Dwarven Thrower",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a dwarf)",
      "desc": "You gain a +3 bonus to attack and damage rolls made with this magic weapon. It has the thrown property with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged attack using this weapon, it deals an extra 1d8 damage or, if the target is a giant, 2d8 damage. Immediately after the attack, the weapon flies back to your hand."
    },
    {
      "name": "Dwarven Thrower",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a Dwarf or a Creature Attuned to a {@item Belt of Dwarvenkind|XDMG})",
      "desc": "You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. It has T with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged attack using this weapon, it deals an extra 1d8 Force damage, or an extra 2d8 Force damage if the target is a Giant. Immediately after hitting or missing, the weapon flies back to your hand."
    },
    {
      "name": "Efreeti Bottle",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This painted brass bottle weighs 1 pound. When you use an action to remove the stopper, a cloud of thick smoke flows out of the bottle. At the end of your turn, the smoke disappears with a flash of harmless fire, and an efreeti appears in an unoccupied space within 30 feet of you. The first time the bottle is opened, the DM rolls to determine what happens."
    },
    {
      "name": "Efreeti Bottle",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "When you take a Magic action to remove the stopper of this painted brass bottle, a cloud of thick smoke flows out of it. At the end of your turn, the smoke disappears with a flash of harmless fire, and an Efreeti appears in an unoccupied space within 30 feet of you. The first time the bottle is opened, the DM rolls on the following table to determine what happens."
    },
    {
      "name": "Elven Thrower",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a elf)",
      "desc": "You gain a +3 bonus to attack and damage rolls made with this magic weapon. It has the thrown property with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged attack using this weapon, it deals an extra 1d8 damage or, if the target is a Giant, 2d8 damage. Immediately after the attack, the weapon flies back to your hand."
    },
    {
      "name": "Enspelled Staff (Level 4)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement (by a Spellcaster)",
      "desc": "Bound into this staff is a level 4 spell. The spell is determined when the staff is created and can be of any school of magic. The staff has 6 charges and regains 1d6 expended charges daily at dawn. While holding the staff, you can expend 1 charge to cast its spell. If you expend the staff's last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff. The spell's saving throw DC is 15, and its attack bonus is 7."
    },
    {
      "name": "Enspelled Staff (Level 5)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement (by a Spellcaster)",
      "desc": "Bound into this staff is a level 5 spell. The spell is determined when the staff is created and can be of any school of magic. The staff has 6 charges and regains 1d6 expended charges daily at dawn. While holding the staff, you can expend 1 charge to cast its spell. If you expend the staff's last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff. The spell's saving throw DC is 17, and its attack bonus is 9."
    },
    {
      "name": "Figurine of Wondrous Power, Obsidian Steed",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A figurine of wondrous power is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but take"
    },
    {
      "name": "Figurine of Wondrous Power, Obsidian Steed",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Figurine of Wondrous Power is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is Friendly [Attitude] to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on yo"
    },
    {
      "name": "Fire Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Force Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Ghost Step Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this tattoo shifts and wavers on the skin, parts of it appearing blurred. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Ghostly Form: The tattoo has 3 charges, and it regains all expended charges daily at dawn. As a bonus actio"
    },
    {
      "name": "Gold Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to fire damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest gold dragon within 30 mile"
    },
    {
      "name": "Gold Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Green Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to poison damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest green dragon within 30 m"
    },
    {
      "name": "Green Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Hat of Many Spells",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This pointed hat has the following properties. Spellcasting Focus: While holding the hat, you can use it as a Spellcasting Focus for your Wizard spells. Any spell you cast using the hat gains a special Somatic component: you must reach into the hat and \"pull\" the spell out of it. Unknown Spell: While holding the hat, you can try to cast a level 1+ spell you don't know. The spell must be on the Wizard spell list, it must be of a level you can cast, and it can't have Material components costing more than 1,000 GP. Once you decide on the spell, you must expend a spell slot of the spell's level. T"
    },
    {
      "name": "Helm of Brilliance",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This dazzling helm is set with 1d10 diamonds, 2d10 rubies, 3d10 fire opals, and 4d10 opals. Any gem pried from the helm crumbles to dust. When all the gems are removed or destroyed, the helm loses its magic. You gain the following benefits while wearing it: You can use an action to cast one of the following spells (save 18), using one of the helm's gems of the specified type as a component: daylight (opal), fireball (fire opal), prismatic spray (diamond), or wall of fire (ruby). The gem is destroyed when the spell is cast and disappears from the helm. As long as it has at least one diamond, th"
    },
    {
      "name": "Helm of Brilliance",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This helm is set with 1d10 diamonds, 2d10 rubies, 3d10 fire opals, and 4d10 opals. Any gem pried from the helm crumbles to dust. When all the gems are removed or destroyed, the helm loses its magic. You gain the following benefits while wearing the helm. Diamond Light: As long as it has at least one diamond, the helm emits a 30-foot Emanation [Area of Effect]. When at least one Undead is within that area, the Emanation [Area of Effect] is filled with Dim Light. Any Undead that starts its turn in that area takes 1d6 Radiant damage. Fire Opal Flames: As long as the helm has at least one fire opa"
    },
    {
      "name": "Horn of Valhalla, Bronze",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can use an action to blow this horn. In response, warrior spirits from the plane of Ysgard appear within 60 feet of you. These spirits use the berserker statistics. They return to Ysgard after 1 hour or when they drop to 0 hit points. Once you use the horn, it can't be used again until 7 days have passed. A bronze horn summons 4d4 + 4 berserker. To use the bronze horn, you must be proficient with medium armor. If you blow the horn without meeting its requirement, the summoned berserker attack you. If you meet the requirement, they are friendly to you and your companions and follow your com"
    },
    {
      "name": "Horn of Valhalla, Bronze",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can take a Magic action to blow this horn. In response, warrior spirits from the plane of Ysgard appear in unoccupied spaces within 60 feet of you. Each spirit uses the Berserker stat block and returns to Ysgard after 1 hour or when it drops to 0 Hit Points. The spirits look like living, breathing warriors, and they have Immunity to the Charmed and Frightened conditions. Once you use the horn, it can't be used again until 7 days have passed. A bronze horn summons 4 Berserker. To use the bronze horn, you must have training with all Medium armor. If you blow the horn without meeting its requ"
    },
    {
      "name": "Horseshoes of a Zephyr",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These iron horseshoes come in a set of four. While all four shoes are affixed to the hooves of a horse or similar creature, they allow the creature to move normally while floating 4 inches above the ground. This effect means the creature can cross or stand above nonsolid or unstable surfaces, such as water or lava. The creature leaves no tracks and ignores difficult terrain. In addition, the creature can move at normal speed for up to 12 hours a day without suffering exhaustion from a forced march."
    },
    {
      "name": "Horseshoes of a Zephyr",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "These horseshoes come in a set of four. As a Magic action, you can touch one of the horseshoes to the hoof of a horse or similar creature, whereupon the horseshoe affixes itself to the hoof. Removing a horseshoe also takes a Magic action. While all four shoes are affixed to the hooves of a horse or similar creature, they allow the creature to move normally while floating 4 inches above a surface. This effect means the creature can cross or stand above nonsolid or unstable surfaces, such as water or lava. The creature leaves no tracks and ignores Difficult Terrain. In addition, the creature can"
    },
    {
      "name": "Instrument of the Bards, Anstruth Harp",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An instrument of the bards is an exquisite example of its kind, superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a legendary bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 psychic damage. You can use an action to play the instrument and cast one of its spells. Once the instrument has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellcasting ability and spell save DC. You can play"
    },
    {
      "name": "Instrument of the Bards, Anstruth Harp",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An Instrument of the Bards is superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 Psychic damage. You can play Anstruth Harp to cast one of the following spells: Fly, Invisibility, Levitate, Protection from Evil and Good, Cure Wounds (level 5), Ice Storm, and Wall of Thorns. Once the Anstruth Harp has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spel"
    },
    {
      "name": "Ioun Stone, Absorption",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Absorption",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} While this pale lavender ellipsoid orbits your head, you can take a Reaction to cancel a spell of level 4 or lower cast by a creature you can see. A canceled spell has no effect, and any resources used to cast it are wasted. Once the stone has canceled 20 levels of spells, it burns out, turns dull gray, and loses its magic."
    },
    {
      "name": "Ioun Stone, Agility",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Agility",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} Your Dexterity increases by 2, to a maximum of 20, while this deep-red sphere orbits your head."
    },
    {
      "name": "Ioun Stone, Fortitude",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Fortitude",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} Your Constitution increases by 2, to a maximum of 20, while this pink rhomboid orbits your head."
    },
    {
      "name": "Ioun Stone, Insight",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Insight",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} Your Wisdom increases by 2, to a maximum of 20, while this incandescent blue sphere orbits your head."
    },
    {
      "name": "Ioun Stone, Intellect",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Intellect",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} Your Intelligence increases by 2, to a maximum of 20, while this marbled scarlet and blue sphere orbits your head."
    },
    {
      "name": "Ioun Stone, Leadership",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Leadership",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} Your Charisma increases by 2, to a maximum of 20, while this marbled pink and green sphere orbits your head."
    },
    {
      "name": "Ioun Stone, Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} Your Strength increases by 2, to a maximum of 20, while this pale blue rhomboid orbits your head."
    },
    {
      "name": "Lifewell Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo features symbols of life and rebirth. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Necrotic Resistance: You have resistance to necrotic damage. Life Ward: When you would be reduced to 0 hit points, you drop t"
    },
    {
      "name": "Lightning Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Lucent Destroyer",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This magic weapon is a triple-barreled bronze musket. You gain a +1 bonus to attack and damage rolls made with it. It requires no ammunition, its damage is radiant instead of piercing, and it doesn't have the loading property. The base of the weapon is emblazoned with the light rune. Additionally, while attuned to the weapon, you can cast dancing lights from the musket at will. Invoking the Rune: As an action, you can invoke the weapon's rune to cast the sunbeam spell (save 17) with it. Once the rune has been invoked, it can't be invoked again until the next dawn."
    },
    {
      "name": "Lute of Thunderous Thumping",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "This reinforced lute can be wielded as a magic Club that deals an extra 2d8 Thunder damage on a hit. Sing and Swing: If you're a Bard, you can use your Charisma modifier instead of your Strength modifier when making a melee attack roll with the lute, provided you sing or hum while making the attack."
    },
    {
      "name": "Manual of Bodily Health",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains health and diet tips, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Constitution score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Manual of Bodily Health",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains health and diet tips, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Constitution increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Manual of Clay Golems",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tome contains information and incantations necessary to make a particular type of golem. The DM chooses the type or determines it randomly. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can't use a manual of golems and attempts to read it takes 6d6 psychic damage. To create a clay golem, you must spend 30 days, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay 65,000 gp to purchase supplies. Once you finish creating the golem, the book is consumed in eldritch"
    },
    {
      "name": "Manual of Clay Golems",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tome contains information and incantations necessary to make a clay golem. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can't use a manual of golems and attempts to read it takes 6d6 psychic damage. To create a clay golem, you must spend 30 days, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay 65,000 gp to purchase supplies. Once you finish creating the golem, the book is consumed in eldritch flames. The golem becomes animate when the ashes of the manual a"
    },
    {
      "name": "Manual of Flesh Golems",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tome contains information and incantations necessary to make a particular type of golem. The DM chooses the type or determines it randomly. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can't use a manual of golems and attempts to read it takes 6d6 psychic damage. To create a flesh golem, you must spend 60 days, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay 50,000 gp to purchase supplies. Once you finish creating the golem, the book is consumed in eldritc"
    },
    {
      "name": "Manual of Flesh Golems",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tome contains information and incantations necessary to make a flesh golem. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can't use a manual of golems and attempts to read it takes 6d6 psychic damage. To create a flesh golem, you must spend 60 days, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay 50,000 gp to purchase supplies. Once you finish creating the golem, the book is consumed in eldritch flames. The golem becomes animate when the ashes of the manual"
    },
    {
      "name": "Manual of Gainful Exercise",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book describes fitness exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Strength score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Manual of Gainful Exercise",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book describes fitness exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Strength increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Manual of Iron Golems",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tome contains information and incantations necessary to make a particular type of golem. The DM chooses the type or determines it randomly. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can't use a manual of golems and attempts to read it takes 6d6 psychic damage. To create an iron golem, you must spend 120 days, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay 100,000 gp to purchase supplies. Once you finish creating the golem, the book is consumed in eldri"
    },
    {
      "name": "Manual of Iron Golems",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tome contains information and incantations necessary to make a iron golem. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can't use a manual of golems and attempts to read it takes 6d6 psychic damage. To create an iron golem, you must spend 120 days, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay 100,000 gp to purchase supplies. Once you finish creating the golem, the book is consumed in eldritch flames. The golem becomes animate when the ashes of the manua"
    },
    {
      "name": "Manual of Quickness of Action",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains coordination and balance exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Dexterity score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Manual of Quickness of Action",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains coordination and balance exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Dexterity increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Manual of Stone Golems",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tome contains information and incantations necessary to make a particular type of golem. The DM chooses the type or determines it randomly. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can't use a manual of golems and attempts to read it takes 6d6 psychic damage. To create a stone golem, you must spend 90 days, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay 80,000 gp to purchase supplies. Once you finish creating the golem, the book is consumed in eldritc"
    },
    {
      "name": "Manual of Stone Golems",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tome contains information and incantations necessary to make a stone golem. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can't use a manual of golems and attempts to read it takes 6d6 psychic damage. To create a stone golem, you must spend 90 days, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay 80,000 gp to purchase supplies. Once you finish creating the golem, the book is consumed in eldritch flames. The golem becomes animate when the ashes of the manual"
    },
    {
      "name": "Mirror of Life Trapping",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "When this 4-foot-tall mirror is viewed indirectly, its surface shows faint images of creatures. The mirror weighs 50 pounds, and it has AC 11, 10 hit points, and vulnerability to bludgeoning damage. It shatters and is destroyed when reduced to 0 hit points. If the mirror is hanging on a vertical surface and you are within 5 feet of it, you can use an action to speak its command word and activate it. It remains activated until you use an action to speak the command word again. Any creature other than you that sees its reflection in the activated mirror while within 30 feet of it must succeed on"
    },
    {
      "name": "Mirror of Life Trapping",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "When this 4-foot-tall, 2-foot-wide mirror is viewed indirectly, its surface shows faint images of creatures. The mirror weighs 50 pounds, and it has AC 11, HP 10, Immunity to Poison and Psychic damage, and Vulnerability to Bludgeoning damage. It shatters and is destroyed when reduced to 0 Hit Points. If the mirror is hanging on a vertical surface and you are within 5 feet of it, you can take a Magic action and use a command word to activate it. It remains activated until you take a Magic action and repeat the command word to deactivate it. Any creature other than you that sees its reflection i"
    },
    {
      "name": "Mistral Mantle",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This thick, fur-lined cloak has the frost rune stitched on the hem in silvery blue thread. Frigid wind swirls around the cloak, regardless of the weather. While wearing this cloak, you have resistance to cold damage. Additionally, when you move within 5 feet of a creature, you can cause the cloak's cold wind to buffet the creature. The creature must succeed on a 14 Dexterity saving throw or take 1d6 cold damage and have the prone condition. A creature can be affected by the mantle only once during a turn. Invoking the Rune: As an action, you can invoke the mantle's rune to cast the sleet storm"
    },
    {
      "name": "Necrotic Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Nimbus Coronet",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The design of this bronze circlet resembles swirling clouds. At its center is set a deep-blue stone, upon which is inscribed the cloud rune. While wearing this circlet, you take no damage from falling. Additionally, as a bonus action, you and everything you are wearing or carrying can teleport to an unoccupied space you can see within 15 feet of yourself, reappearing in a puff of shimmering clouds. Invoking the Rune: As an action, you can invoke the circlet's rune to assume a cloudlike form. The form lasts for 1 minute, until you are incapacitated, or until you dismiss it (no action required)."
    },
    {
      "name": "Nolzur's Marvelous Pigments",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Typically found in 1d4 pots inside a fine wooden box with a brush (weighing 1 pound in total), these pigments allow you to create three-dimensional objects by painting them in two dimensions. The paint flows from the brush to form the desired object as you concentrate on its image. Each pot of paint is sufficient to cover 1,000 square feet of a surface, which lets you create inanimate objects or terrain features—such as a door, a pit, flowers, trees, cells, rooms, or weapons—that are up to 10,000 cubic feet. It takes 10 minutes to cover 100 square feet. When you complete the painting, the obje"
    },
    {
      "name": "Nolzur's Marvelous Pigments",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This fine wooden box contains 1d4 pots of pigment and a brush (weighing 1 pound in total). Using the brush and expending 1 pot of pigment, you can paint any number of three-dimensional objects and terrain features (such as walls, doors, trees, flowers, weapons, webs, and pits), provided these elements are all confined to a 20-foot Cube [Area of Effect]. The effort takes 10 minutes (regardless of the number of elements you create), during which time you must remain in the Cube [Area of Effect], and requires Concentration. If your Concentration is broken or you leave the Cube [Area of Effect] be"
    },
    {
      "name": "Oathbow",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "When you nock an arrow on this bow, it whispers in Elvish, \"Swift defeat to my enemies.\" When you use this weapon to make a ranged attack, you can, as a command phrase, say, \"Swift death to you who have wronged me.\" The target of your attack becomes your sworn enemy until it dies or until dawn seven days later. You can have only one such sworn enemy at a time. When your sworn enemy dies, you can choose a new one after the next dawn. When you make a ranged attack roll with this weapon against your sworn enemy, you have advantage on the roll. In addition, your target gains no benefit from cover,"
    },
    {
      "name": "Oil of Sharpness",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "This clear, gelatinous oil sparkles with tiny, ultrathin silver shards. The oil can coat one slashing or piercing weapon or up to 5 pieces of slashing or piercing ammunition. Applying the oil takes 1 minute. For 1 hour, the coated item is magical and has a +3 bonus to attack and damage rolls."
    },
    {
      "name": "Oil of Sharpness",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "One vial of this oil can coat one Melee weapon or twenty pieces of ammunition, but only ammunition and Melee weapons that are nonmagical and deal Slashing or Piercing damage are affected. Applying the oil takes 1 minute, after which the oil magically seeps into whatever it coats, turning the coated weapon into a +3 Weapon or the coated ammunition into +3 Ammunition. This clear, gelatinous oil sparkles with tiny, ultrathin silver shards."
    },
    {
      "name": "Poison Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Potion of Cloud Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 27 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a cloud giant."
    },
    {
      "name": "Potion of Cloud Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 27 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a cloud giant."
    },
    {
      "name": "Potion of Flying",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain a flying speed equal to your walking speed for 1 hour and can hover. If you're in the air when the potion wears off, you fall unless you have some other means of staying aloft. This potion's clear liquid floats at the top of its container and has cloudy white impurities drifting in it."
    },
    {
      "name": "Potion of Flying",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain a Fly Speed equal to your Speed for 1 hour and can hover. If you're in the air when the potion wears off, you fall unless you have some other means of staying aloft. This potion's clear liquid floats at the top of its container and has cloudy white impurities drifting in it."
    },
    {
      "name": "Potion of Greater Invisibility",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "This potion's container looks empty but feels as though it holds liquid. When you drink the potion, you have the Invisible condition for 1 hour."
    },
    {
      "name": "Potion of Invisibility",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "This potion's container looks empty but feels as though it holds liquid. When you drink it, you become invisible for 1 hour. Anything you wear or carry is invisible with you. The effect ends early if you attack or cast a spell."
    },
    {
      "name": "Potion of Longevity",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your physical age is reduced by 1d6 + 6 years, to a minimum of 13 years. Each time you subsequently drink a potion of longevity, there is a 10 cumulative chance that you instead age by 1d6 + 6 years. Suspended in this amber liquid are a scorpion's tail, an adder's fang, a dead spider, and a tiny heart that, against all reason, is still beating. These ingredients vanish when the potion is opened."
    },
    {
      "name": "Potion of Longevity",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your physical age is reduced by 1d6 + 6 years, to a minimum of 13 years. Each time you subsequently drink a Potion of Longevity, there is 10 percent cumulative chance that you instead age by 1d6 + 6 years. Suspended in this amber liquid is a tiny heart that, against all reason, is still beating. These ingredients vanish when the potion is opened."
    },
    {
      "name": "Potion of Speed",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the effect of the haste spell for 1 minute (no concentration required). The potion's yellow fluid is streaked with black and swirls on its own."
    },
    {
      "name": "Potion of Speed",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, you gain the effect of the Haste spell for 1 minute (no Concentration required) without suffering the wave of lethargy that typically occurs when the effect ends. This potion's yellow fluid is streaked with black and swirls on its own."
    },
    {
      "name": "Potion of Supreme Healing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "You regain 10d4 + 20 hit points when you drink this potion. The potion's red liquid glimmers when agitated."
    },
    {
      "name": "Potion of Supreme Healing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "You regain 10d4 + 20 Hit Points when you drink this potion. The potion's red liquid glimmers when agitated."
    },
    {
      "name": "Potion of Vitality",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, it removes any exhaustion you are suffering and cures any disease or poison affecting you. For the next 24 hours, you regain the maximum number of hit points for any Hit Die you spend. The potion's crimson liquid regularly pulses with dull light, calling to mind a heartbeat."
    },
    {
      "name": "Potion of Vitality",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, it removes any Exhaustion levels you have and ends the Poisoned condition on you. For the next 24 hours, you regain the maximum number of Hit Points for any Hit Point Dice you spend. This potion's crimson liquid regularly pulses with dull light, calling to mind a heartbeat."
    },
    {
      "name": "Prehistoric Figurine of Wondrous Power, Carnelian Triceratops",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Larger and more roughly hewn than typical figurines of wondrous power, these statuettes depict dinosaurs and related creatures from the earliest days of the world. As an action, you can throw a prehistoric figurine of wondrous power to a point on the ground within 60 feet of yourself while speaking a command word, whereupon the figurine magically transforms into a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and you"
    },
    {
      "name": "Psychic Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Quarterstaff of the Acrobat",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement",
      "desc": "You have a +2 bonus to attack rolls and damage rolls made with this magic weapon. While holding this weapon, you can cause it to emit green Dim Light out to 10 feet, either as a Bonus Action or after you roll Initiative, or you can extinguish the light as a Bonus Action. While holding this weapon, you can take a Bonus Action to alter its form, turning it into a 6-inch rod (for ease of storage) or a 10-foot pole, or reverting it a Quarterstaff; the weapon will elongate only as far as the surrounding space allows. In certain forms, the weapon has the following additional properties. Acrobatic As"
    },
    {
      "name": "Radiant Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Red Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to fire damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest red dragon within 30 miles"
    },
    {
      "name": "Red Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Ring of Amity",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This ring is carved from hematite and bears an engraving of the friend rune. When you first attune to this ring, you can touch one willing creature and form a magical bond between the two of you. While this bond lasts, whenever you are subjected to a spell or magical effect that restores hit points, the bonded creature also receives the benefits of the spell or effect. You can bond with a different creature whenever you finish a long rest, provided that you can touch the creature and the creature is willing. A creature can benefit from only one ring of amity's bond at a time. The bond ends if "
    },
    {
      "name": "Ring of Regeneration",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you regain 1d6 hit points every 10 minutes, provided that you have at least 1 hit point. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days if you have at least 1 hit point the whole time."
    },
    {
      "name": "Ring of Regeneration",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you regain 1d6 Hit Points every 10 minutes if you have at least 1 Hit Points. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days if you have at least 1 Hit Points the whole time."
    },
    {
      "name": "Ring of Shooting Stars",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (outdoors at night)",
      "desc": "While wearing this ring in dim light or darkness, you can cast dancing lights and light from the ring at will. Casting either spell from the ring requires an action. The ring has 6 charges for the following other properties. The ring regains 1d6 expended charges daily at dawn. Faerie Fire: You can expend 1 charge as an action to cast faerie fire from the ring. Ball Lightning: You can expend 2 charges as an action to create one to four 3-foot-diameter spheres of lightning. The more spheres you create, the less powerful each sphere is individually. Each sphere appears in an unoccupied space you "
    },
    {
      "name": "Ring of Shooting Stars",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You can cast Dancing Lights or Light from the ring. The ring has 6 charges and regains 1d6 expended charges daily at dawn. You can expend its charges to use the properties below. Faerie Fire: You can expend 1 charge to cast Faerie Fire from the ring. Lightning Spheres: You can expend 2 charges as a Magic action to create up to four 3-foot-diameter spheres of lightning. Each sphere appears in an unoccupied space you can see within 120 feet of yourself. The spheres last as long as you maintain Concentration, up to 1 minute. Each sphere sheds Dim Light in a 30-foot radius. As a Bonus Action, you "
    },
    {
      "name": "Ring of Telekinesis",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can cast the telekinesis spell at will, but you can target only objects that aren't being worn or carried."
    },
    {
      "name": "Ring of Telekinesis",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can cast Telekinesis from it."
    },
    {
      "name": "Robe of Scintillating Colors",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This robe has 3 charges, and it regains 1d3 expended charges daily at dawn. While you wear it, you can use an action and expend 1 charge to cause the garment to display a shifting pattern of dazzling hues until the end of your next turn. During this time, the robe sheds bright light in a 30-foot radius and dim light for an additional 30 feet. Creatures that can see you have disadvantage on attack rolls against you. In addition, any creature in the bright light that can see you when the robe's power is activated must succeed on a 15 Wisdom saving throw or become stunned until the effect ends."
    },
    {
      "name": "Robe of Scintillating Colors",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This robe has 3 charges, and it regains 1d3 expended charges daily at dawn. While you wear it, you can take a Magic action and expend 1 charge to cause the garment to display a shifting pattern of dazzling hues until the end of your next turn. During this time, the robe sheds Bright Light in a 30-foot radius and Dim Light for an additional 30 feet, and creatures that can see you have Disadvantage on attack rolls against you. Any creature in the Bright Light that can see you when the robe's power is activated must succeed on a 15 Wisdom saving throw or have the Stunned condition until the effec"
    },
    {
      "name": "Robe of Stars",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This black or dark blue robe is embroidered with small white or silver stars. You gain a +1 bonus to saving throws while you wear it. Six stars, located on the robe's upper front portion, are particularly large. While wearing this robe, you can use an action to pull off one of the stars and use it to cast magic missile as a 5th-level spell. Daily at dusk, 1d6 removed stars reappear on the robe. While you wear the robe, you can use an action to enter the Astral Plane along with everything you are wearing and carrying. You remain there until you use an action to return to the plane you were on. "
    },
    {
      "name": "Robe of Stars",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This black or dark-blue robe is embroidered with small white or silver stars. You gain a +1 bonus to saving throws while you wear it. Six stars, located on the robe's upper-front portion, are particularly large. While wearing this robe, you can take a Magic action to remove one of the stars and expend it to cast the level 5 version of Magic Missile. Daily at dusk, 1d6 removed stars reappear on the robe. While you wear the robe, you can take a Magic action to enter the Astral Plane along with everything you are wearing and carrying. You remain there until you take a Magic action to return to th"
    },
    {
      "name": "Rod of Absorption",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While holding this rod, you can use your reaction to absorb a spell that is targeting only you and not with an area of effect. The absorbed spell's effect is canceled, and the spell's energy—not the spell itself—is stored in the rod. The energy has the same level as the spell when it was cast. The rod can absorb and store up to 50 levels of energy over the course of its existence. Once the rod absorbs 50 levels of energy, it can't absorb more. If you are targeted by a spell that the rod can't store, the rod has no effect on that spell. When you become attuned to the rod, you know how many leve"
    },
    {
      "name": "Rod of Absorption",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While holding this rod, you can take a Reaction to absorb a spell that is targeting only you and doesn't create an area of effect. The absorbed spell's effect is canceled, and the spell's energy—not the spell itself—is stored in the rod. The energy has the same level as the spell when it was cast. A canceled spell dissipates with no effect, and any resources used to cast it are wasted. The rod can absorb and store up to 50 levels of energy over the course of its existence. Once the rod absorbs 50 levels of energy, it can't absorb more. If you are targeted by a spell that the rod can't store, t"
    },
    {
      "name": "Rod of Alertness",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This rod has a flanged head and the following properties. Alertness: While holding the rod, you have advantage on Wisdom (Perception) checks and on rolls for initiative. Spells: While holding the rod, you can use an action to cast one of the following spells from it: detect evil and good, detect magic, detect poison and disease, or see invisibility. Protective Aura: As an action, you can plant the haft end of the rod in the ground, whereupon the rod's head sheds bright light in a 60-foot radius and dim light for an additional 60 feet. While in that bright light, you and any creature that is fr"
    },
    {
      "name": "Rod of Alertness",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This rod has the following properties. Alertness: While holding the rod, you have Advantage on Wisdom (Perception) checks and on Initiative rolls. Spells. While holding the rod, you can cast the following spells from it: Detect Evil and Good Detect Magic Detect Poison and Disease See Invisibility Protective Aura: As a Magic action, you can plant the haft end of the rod in the ground, whereupon the rod's head sheds Bright Light in a 60-foot radius and Dim Light for an additional 60 feet. While in that Bright Light, you and your allies gain a +1 bonus to Armor Class and saving throws and can sen"
    },
    {
      "name": "Rod of Security",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "While holding this rod, you can use an action to activate it. The rod then instantly transports you and up to 199 other willing creatures you can see to a paradise that exists in an extraplanar space. You choose the form that the paradise takes. It could be a tranquil garden, lovely glade, cheery tavern, immense palace, tropical island, fantastic carnival, or whatever else you can imagine. Regardless of its nature, the paradise contains enough water and food to sustain its visitors. Everything else that can be interacted with inside the extraplanar space can exist only there. For example, a fl"
    },
    {
      "name": "Rod of Security",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "While holding this rod, you can take a Magic action to activate it. The rod then instantly transports you and up to 199 other willing creatures you can see to a demiplane. You choose the form the demiplane takes. It could be a tranquil garden, a cheery tavern, an immense palace, a tropical island, a fantastic carnival, or whatever else you can imagine. Regardless of its nature, the demiplane contains enough water and food to sustain its visitors, and the demiplane's environment can't harm its occupants. Everything else that can be interacted with there can exist only there. For example, a flow"
    },
    {
      "name": "Sanctum Amulet",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "A black opal pendant hangs at the base of this pearlescent chain. The sacred rune is inscribed on the back of the pendant. While wearing this item, you have resistance to necrotic damage. Additionally, you can cast the spare the dying cantrip using either an action or a bonus action. Invoking the Rune: When a creature you can see within 60 feet of you is reduced to 0 hit points as a result of taking damage, you can use your reaction to invoke the item's rune, causing the pendant to flash with pale light. The creature then instead drops to 1 hit point. Once the rune has been invoked, it can't b"
    },
    {
      "name": "Sapphire Buckler",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This crystalline blue shield is fashioned from a sapphire dragon's scale and is created to aid in rooting out the influence of Aberrations. While wielding the shield, you have resistance to psychic and thunder damage. Also, when you take damage from a creature that is within 5 feet of you, you can use your reaction to deal 2d6 thunder damage to that creature. As an action, you can use the shield to help you locate Aberrations until the end of your next turn. If any Aberrations are within 1 mile of you, the shield emits a low humming tone for a moment, and you know the direction of all Aberrati"
    },
    {
      "name": "Scimitar of Speed",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You gain a +2 bonus to attack and damage rolls made with this magic weapon. In addition, you can make one attack with it as a bonus action on each of your turns."
    },
    {
      "name": "Scimitar of Speed",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon. In addition, you can make one attack with it as a Bonus Action on each of your turns."
    },
    {
      "name": "Shield of the Cavalier",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While holding this Shield, you have a +2 bonus to Armor Class. This bonus is in addition to the Shield's normal bonus to AC. The Shield has the following additional properties that you can use while holding it. Forceful Bash: When you take the Attack action, you can make one of the attack rolls using the Shield against a target within 5 feet of yourself. Apply your Proficiency and Strength modifier to the attack roll. On a hit, the Shield deals Force damage to the target equal to 2d6 + 2 plus your Strength modifier, and if the target is a creature, you can push it up to 10 feet directly away f"
    },
    {
      "name": "Silver Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to cold damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest silver dragon within 30 mi"
    },
    {
      "name": "Silver Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Spell Scroll (6th Level)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (7th Level)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (8th Level)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (Level 6)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 16 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Spell Scroll (Level 7)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 17 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Spell Scroll (Level 8)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 18 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Spellguard Shield",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While holding this shield, you have advantage on saving throws against spells and other magical effects, and spell attacks have disadvantage against you."
    },
    {
      "name": "Spellguard Shield",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While holding this Shield, you have Advantage on saving throws against spells and other magical effects, and spell attack rolls have Disadvantage against you."
    },
    {
      "name": "Spirit Board",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This ornate wooden board has the letters of the Common alphabet printed on one side, alongside the words \"Yes\" and \"No\" and symbols representing \"Weal\" and \"Woe.\" The board comes with a heart-shaped, wooden planchette. This planchette must be resting on the lettered side of the board for the board's magic to function. This board has 3 charges and regains 1 expended charge daily at dawn. While touching the planchette, you can take 1 minute to cast one of the spells on the table below. The table indicates how many charges you must expend to cast the spell. As you cast the spell, you call on the "
    },
    {
      "name": "Staff of Fire",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement (by a druid, sorcerer, warlock, or wizard)",
      "desc": "You have resistance to fire damage while you hold this staff. The staff has 10 charges. While holding it, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC: burning hands (1 charge), fireball (3 charges), or wall of fire (4 charges). The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff blackens, crumbles into cinders, and is destroyed."
    },
    {
      "name": "Staff of Fire",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement (by a druid, sorcerer, warlock, or wizard)",
      "desc": "You have Resistance to Fire damage while you hold this staff. Spells: The staff has 10 charges. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell. Regaining Charges: The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff crumbles into cinders and is destroyed."
    },
    {
      "name": "Staff of Frost",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement (by a druid, sorcerer, warlock, or wizard)",
      "desc": "You have resistance to cold damage while you hold this staff. The staff has 10 charges. While holding it, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC: cone of cold (5 charges), fog cloud (1 charge), ice storm (4 charges), or wall of ice (4 charges). The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1. the staff turns to water and is destroyed."
    },
    {
      "name": "Staff of Frost",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement (by a druid, sorcerer, warlock, or wizard)",
      "desc": "You have Resistance to Cold damage while you hold this staff. Spells: The staff has 10 charges. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell. Regaining Charges: The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff turns to water and is destroyed."
    },
    {
      "name": "Staff of Power",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement (by a sorcerer, warlock, or wizard)",
      "desc": "This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While holding it, you gain a +2 bonus to Armor Class, saving throws, and spell attack rolls. The staff has 20 charges for the following properties. The staff regains 2d8 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff retains its +2 bonus to attack and damage roll but loses all other properties. On a 20, the staff regain 1d8 + 2 charges. Power Strike: When you hit with a melee attack using the staff, you can expend 1 charge to deal a"
    },
    {
      "name": "Staff of Power",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement (by a sorcerer, warlock, or wizard)",
      "desc": "This staff has 20 charges and can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. While holding it, you gain a +2 bonus to Armor Class, saving throws, and spell attack rolls. Spells: While holding the staff , you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell. Regaining Charges: The staff regains 2d8 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff retains its +2 bonus to attack rolls"
    },
    {
      "name": "Staff of Striking",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement",
      "desc": "This staff can be wielded as a magic quarterstaff that grants a +3 bonus to attack and damage rolls made with it. The staff has 10 charges. When you hit with a melee attack using it, you can expend up to 3 of its charges. For each charge you expend, the target takes an extra 1d6 force damage. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff becomes a nonmagical quarterstaff."
    },
    {
      "name": "Staff of Striking",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement",
      "desc": "This staff can be wielded as a magic Quarterstaff that grants a +3 bonus to attack rolls and damage rolls made with it. The staff has 10 charges. When you hit with a melee attack using it, you can expend up to 3 charges. For each charge you expend, the target takes an extra 1d6 Force damage. Regaining Charges: The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff becomes a nonmagical Quarterstaff."
    },
    {
      "name": "Staff of Thunder and Lightning",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement",
      "desc": "This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. It also has the following additional properties. When one of these properties is used, it can't be used again until the next dawn. Lightning: When you hit with a melee attack using the staff, you can cause the target to take an extra 2d6 lightning damage. Thunder: When you hit with a melee attack using the staff, you can cause the staff to emit a crack of thunder, audible out to 300 feet. The target you hit must succeed on a 17 Constitution saving throw or become stunned until the "
    },
    {
      "name": "Staff of Thunder and Lightning",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Staff",
      "attunement": "requires attunement",
      "desc": "This staff can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. It also has the following additional properties. Once one of these properties is used, it can't be used again until the next dawn. Lightning: When you hit with a melee attack using the staff, you can cause the target to take an extra 2d6 Lightning damage (no action required). Thunder: When you hit with a melee attack using the staff, you can cause the staff to emit a crack of thunder audible out to 300 feet (no action required). The target you hit must succeed on a 17 Constit"
    },
    {
      "name": "Thunder Absorbing Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Absorbing Tattoo|TCE}"
    },
    {
      "name": "Thunderbuss",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "This magic ranged weapon is a flared pistol with the storm rune engraved along the barrel. You gain a +1 bonus to attack and damage rolls made with it. It requires no ammunition, its damage is thunder instead of piercing, and it doesn't have the loading property. Invoking the Rune: As a bonus action, you can invoke the weapon's rune to launch a ball of energy to a point you can see within 30 feet of yourself. The energy then detonates into a 10-foot-radius sphere of turbulent wind and thunder centered on that point, and each creature in that sphere must make a 14 Constitution saving throw. On "
    },
    {
      "name": "Thunderous Greatclub",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While you are attuned to this magic weapon, your Strength is 20 unless your Strength is already equal to or greater than that score. The weapon deals an extra 1d8 Thunder damage to any creature it hits and an extra 3d8 Thunder damage to objects it hits that aren't being worn or carried. The weapon has the following additional properties. Clap of Thunder: As a Magic action, you can strike the weapon against a hard surface to create a loud clap of thunder audible out to 300 feet. You also create a 30-foot Cone [Area of Effect] of thunderous energy. Each creature in the Cone [Area of Effect] must"
    },
    {
      "name": "Tome of Clear Thought",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains memory and logic exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Intelligence score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Tome of Clear Thought",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains memory and logic exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Intelligence increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Tome of Leadership and Influence",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains guidelines for influencing and charming others, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Charisma score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Tome of Leadership and Influence",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains guidelines for influencing and charming others, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Charisma increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Tome of Understanding",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains intuition and insight exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Wisdom score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Tome of Understanding",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This book contains intuition and insight exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Wisdom increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century."
    },
    {
      "name": "Wakened Dragon Vessel",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "This vessel can be a potion bottle, drinking horn, or other container meant to hold a liquid. As a bonus action, if the vessel is empty, you can speak the command word to fill the vessel with one of the following (your choice): ale, olive oil, mead, wine, a potion of healing, a potion of greater healing, a potion of superior healing, a potion of climbing, a potion of fire breath, or a potion of flying. Once this property is used, it can't be used until the next dawn. A potion you create in this way loses its magical properties if it isn't imbibed within 24 hours."
    },
    {
      "name": "Wakened Dragon-Touched Focus",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "This wondrous item can be a scepter, an orb, an amulet, a crystal, or another finely crafted object. It typically incorporates imagery of dragons' wings, claws, teeth, or scales. You have advantage on initiative rolls. While you are holding the focus, it can function as a spellcasting focus for all your spells. The focus gains an additional property determined by the family of the dragon in whose hoard it became Stirring: Whenever you use a spell slot to cast a spell that deals acid, cold, fire, lightning, or poison damage, roll a d6, and you gain a bonus equal to the number rolled to one of t"
    },
    {
      "name": "Wakened Scaled Ornament",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "",
      "desc": "This ornament can be jewelry, a cloak, or another wearable accessory. It appears to be fashioned from a dragon's scale, tooth, or claw, or it incorporates images in those shapes. You gain a +1 bonus to AC, and you can't be charmed or frightened. Moreover, each creature of your choice within 30 feet of you has advantage on saving throws it makes to avoid being charmed or frightened or to end those conditions on itself. When you would take damage of the type dealt by the breath of the dragon in whose hoard the ornament became Wakened, you can use your reaction to take no damage instead, and you "
    },
    {
      "name": "Wand of Polymorph",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cast the polymorph spell (save 15) from it. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "Wand of Polymorph",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "This wand has 7 charges. While holding it, you can expend 1 charge to cast Polymorph (save 15) from it. Regaining Charges: The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed."
    },
    {
      "name": "White Dragon Scale Mail",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to cold damage. Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest white dragon within 30 mil"
    },
    {
      "name": "White Dragon Scale Mail",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Dragon Scale Mail|XDMG}"
    },
    {
      "name": "Wyrmreaver Gauntlets",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "very rare",
      "rarity_order": 3,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Originally crafted for ground-bound giant brawlers to fight against dragons and other enormous predators of the sky, these studded gauntlets are engraved with the dragon rune. While you are wearing these gauntlets, your unarmed strike deals an additional 1d6 force damage on a hit. Additionally, whenever you finish a long rest, choose one of the following damage types: acid, cold, fire, lightning, or poison. You have resistance to the chosen damage type until you finish another long rest. Invoking the Runes: As a bonus action, you can invoke the gauntlets' runes and summon two enormous spectral"
    },
    {
      "name": "Apparatus of Kwalish",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This item first appears to be a Large sealed iron barrel weighing 500 pounds. The barrel has a hidden catch, which can be found with a successful 20 Intelligence (Investigation) check. Releasing the catch unlocks a hatch at one end of the barrel, allowing two Medium or smaller creatures to crawl inside. Ten levers are set in a row at the far end, each in a neutral position, able to move either up or down. When certain levers are used, the apparatus transforms to resemble a giant lobster. The apparatus of Kwalish is a Large object with the following statistics: To be used as a vehicle, the appa"
    },
    {
      "name": "Apparatus of Kwalish",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This item first appears to be a sealed iron barrel weighing 500 pounds. The barrel has a hidden catch, which can be found with a successful 20 Intelligence (Investigation) check. Releasing the catch unlocks a hatch at one end of the barrel, allowing two Medium or smaller creatures to crawl inside. Ten levers are set in a row at the far end, each in a neutral position, able to move up or down. When certain levers are used, the apparatus transforms to resemble a giant lobster. The Apparatus of Kwalish is a Large object with the following statistics: AC 20; HP 200; Speed 30 ft., Swim 30 ft. (or 0"
    },
    {
      "name": "Armor of Invulnerability",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You have resistance to nonmagical damage while you wear this armor. Additionally, you can use an action to make yourself immune to nonmagical damage for 10 minutes or until you are no longer wearing the armor. Once this special action is used, it can't be used again until the next dawn."
    },
    {
      "name": "Armor of Invulnerability",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You have Resistance to Bludgeoning, Piercing, and Slashing damage while you wear this armor. Metal Shell: You can take a Magic action to give yourself Immunity to Bludgeoning, Piercing, and Slashing damage for 10 minutes or until you are no longer wearing the armor. Once this property is used, it can't be used again until the next dawn."
    },
    {
      "name": "Ascendant Dragon Vessel",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "This vessel can be a potion bottle, drinking horn, or other container meant to hold a liquid. As a bonus action, if the vessel is empty, you can speak the command word to fill the vessel with one of the following (your choice): ale, olive oil, mead, wine, whiskey, a potion of healing, a potion of greater healing, a potion of superior healing, a potion of supreme healing, a potion of climbing, a potion of fire breath, a potion of flying, or a potion of dragon's majesty. Once this property is used, it can't be used until the next dawn. A potion you create in this way loses its magical properties"
    },
    {
      "name": "Ascendant Dragon-Touched Focus",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "This wondrous item can be a scepter, an orb, an amulet, a crystal, or another finely crafted object. It typically incorporates imagery of dragons' wings, claws, teeth, or scales. You have advantage on initiative rolls. While you are holding the focus, it can function as a spellcasting focus for all your spells. The focus gains an additional property determined by the family of the dragon in whose hoard it became Stirring: Whenever you use a spell slot to cast a spell that deals acid, cold, fire, lightning, or poison damage, roll a d6, and you gain a bonus equal to the number rolled to one of t"
    },
    {
      "name": "Ascendant Scaled Ornament",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "This ornament can be jewelry, a cloak, or another wearable accessory. It appears to be fashioned from a dragon's scale, tooth, or claw, or it incorporates images in those shapes. You gain a +1 bonus to AC, and you can't be charmed or frightened. Moreover, each creature of your choice within 30 feet of you has advantage on saving throws it makes to avoid being charmed or frightened or to end those conditions on itself. When you would take damage of the type dealt by the breath of the dragon in whose hoard the ornament became Wakened, you can use your reaction to take no damage instead, and you "
    },
    {
      "name": "Belt of Cloud Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 27. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Belt of Cloud Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 27. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Belt of Storm Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 29. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Belt of Storm Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this belt, your Strength score changes to 29. The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score."
    },
    {
      "name": "Blackrazor",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a creature of non-lawful alignment)",
      "desc": "Hidden in the dungeon of White Plume Mountain, Blackrazor shines like a piece of night sky filled with stars. Its black scabbard is decorated with pieces of cut obsidian. You gain a +3 bonus to attack and damage rolls made with this magic weapon. It has the following additional properties. Devour Soul: Whenever you use it to reduce a creature to 0 hit points, the sword slays the creature and devours its soul, unless it is a construct or an undead. A creature whose soul has been devoured by Blackrazor can be restored to life only by a wish spell. When it devours a soul, Blackrazor grants you te"
    },
    {
      "name": "Blood Fury Tattoo",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Produced by a special needle, this magic tattoo evokes fury in its form and colors. Tattoo Attunement: To attune to this item, you hold the needle to your skin where you want the tattoo to appear, pressing the needle there throughout the attunement process. When the attunement is complete, the needle turns into the ink that becomes the tattoo, which appears on the skin. If your attunement to the tattoo ends, the tattoo vanishes, and the needle reappears in your space. Bloodthirsty Strikes: The tattoo has 10 charges, and it regains all expended charges daily at dawn. While this tattoo is on you"
    },
    {
      "name": "Cloak of Invisibility",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While wearing this cloak, you can pull its hood over your head to cause yourself to become invisible. While you are invisible, anything you are carrying or wearing is invisible with you. You become visible when you cease wearing the hood. Pulling the hood up or down requires an action. Deduct the time you are invisible, in increments of 1 minute, from the cloak's maximum duration of 2 hours. After 2 hours of use, the cloak ceases to function. For every uninterrupted period of 12 hours the cloak goes unused, it regains 1 hour of duration."
    },
    {
      "name": "Cloak of Invisibility",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This cloak has 3 charges and regains 1d3 expended charges daily at dawn. While wearing the cloak, you can take a Magic action to pull its hood over your head and expend 1 charge to give yourself the Invisible condition for 1 hour. The effect ends early if you pull the hood down (no action required) or cease wearing the hood."
    },
    {
      "name": "Crystal Ball of Mind Reading",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This crystal ball is about 6 inches in diameter. While touching it, you can cast the scrying spell (save 17) with it. You can use an action to cast the detect thoughts spell (save 17) while you are scrying with the crystal ball, targeting creatures you can see within 30 feet of the spell's sensor. You don't need to concentrate on this detect thoughts to maintain it during its duration, but it ends if scrying ends."
    },
    {
      "name": "Crystal Ball of Mind Reading",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While touching this crystal orb, you can cast Scrying (save 17) with it. In addition, you can cast Detect Thoughts (save 17) targeting creatures you can see within 30 feet of the spell's sensor. You don't need to concentrate on this Detect Thoughts spell to maintain it during its duration, but it ends if the Scrying spell ends."
    },
    {
      "name": "Crystal Ball of Telepathy",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This crystal ball is about 6 inches in diameter. While touching it, you can cast the scrying spell (save 17) with it. While scrying with the crystal ball, you can communicate telepathically with creatures you can see within 30 feet of the spell's sensor. You can also use an action to cast the suggestion spell (save 17) through the sensor on one of those creatures. You don't need to concentrate on this suggestion to maintain it during its duration, but it ends if scrying ends. Once used, the suggestion power of the crystal ball can't be used again until the next dawn."
    },
    {
      "name": "Crystal Ball of Telepathy",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While touching this crystal orb, you can cast Scrying (save 17) with it. In addition, you can communicate telepathically with creatures you can see within 30 feet of the spell's sensor. You can also cast Suggestion (save 17) through the sensor on one of those creatures. You don't need to concentrate on this Suggestion to maintain it during its duration, but it ends if Scrying ends. You can't cast Suggestion in this way again until the next dawn."
    },
    {
      "name": "Crystal Ball of True Seeing",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This crystal ball is about 6 inches in diameter. While touching it, you can cast the scrying spell (save 17) with it. While scrying with the crystal ball, you have truesight with a radius of 120 feet centered on the spell's sensor."
    },
    {
      "name": "Crystal Ball of True Seeing",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While touching this crystal orb, you can cast Scrying (save 17) with it. In addition, you have Truesight with a range of 120 feet centered on the spell's sensor."
    },
    {
      "name": "Cubic Gate",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This cube is 3 inches across and radiates palpable magical energy. The six sides of the cube are each keyed to a different plane of existence, one of which is the Material Plane. The other sides are linked to planes determined by the DM. You can use an action to press one side of the cube to cast the gate spell with it, opening a portal to the plane keyed to that side. Alternatively, if you use an action to press one side twice, you can cast the plane shift spell (save 17) with the cube and transport the targets to the plane keyed to that side. The cube has 3 charges. Each use of the cube expe"
    },
    {
      "name": "Cubic Gate",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This cube is 3 inches across and radiates palpable magical energy. The six sides of the cube are each keyed to a different plane of existence, one of which is the Material Plane. The other sides are linked to planes determined by the DM. The cube has 3 charges and regains 1d3 expended charges daily at dawn. As a Magic action, you can expend 1 of the cube's charges to cast one of the following spells using the cube. Gate: Pressing one side of the cube, you cast Gate, opening a portal to the plane of existence keyed to that side. Plane Shift: Pressing one side of the cube twice, you cast Plane S"
    },
    {
      "name": "Deck of Many Things",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Usually found in a box or pouch, this deck contains a number of cards made of ivory or vellum. Most (75) of these decks have only thirteen cards, but the rest have twenty-two. Before you draw a card, you must declare how many cards you intend to draw and then draw them randomly (you can use an altered deck of playing cards to simulate the deck). Any cards drawn in excess of this number have no effect. Otherwise, as soon as you draw a card from the deck, its magic takes effect. You must draw each card no more than 1 hour after the previous draw. If you fail to draw the chosen number, the remain"
    },
    {
      "name": "Deck of Many Things",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Usually found in a box or pouch, this deck contains a number of cards made of ivory or vellum. Most (75 percent) of these decks have thirteen cards, but some have twenty-two. Use the appropriate column of the Deck of Many Things table when randomly determining cards drawn from the deck. Before you draw a card, you must declare how many cards you intend to draw and then draw them randomly. Any cards drawn in excess of this number have no effect. Otherwise, as soon as you draw a card from the deck, its magic takes effect. You must draw each card no more than 1 hour after the previous draw. If yo"
    },
    {
      "name": "Efreeti Chain",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this armor, you gain a +3 bonus to AC, you are immune to fire damage, and you can understand and speak Primordial. In addition, you can stand on and walk across molten rock as if it were solid ground."
    },
    {
      "name": "Enspelled Staff (Level 6)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Staff",
      "attunement": "requires attunement (by a Spellcaster)",
      "desc": "Bound into this staff is a level 6 spell. The spell is determined when the staff is created and can be of any school of magic. The staff has 6 charges and regains 1d6 expended charges daily at dawn. While holding the staff, you can expend 1 charge to cast its spell. If you expend the staff's last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff. The spell's saving throw DC is 17, and its attack bonus is 9."
    },
    {
      "name": "Enspelled Staff (Level 7)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Staff",
      "attunement": "requires attunement (by a Spellcaster)",
      "desc": "Bound into this staff is a level 7 spell. The spell is determined when the staff is created and can be of any school of magic. The staff has 6 charges and regains 1d6 expended charges daily at dawn. While holding the staff, you can expend 1 charge to cast its spell. If you expend the staff's last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff. The spell's saving throw DC is 18, and its attack bonus is 10."
    },
    {
      "name": "Enspelled Staff (Level 8)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Staff",
      "attunement": "requires attunement (by a Spellcaster)",
      "desc": "Bound into this staff is a level 8 spell. The spell is determined when the staff is created and can be of any school of magic. The staff has 6 charges and regains 1d6 expended charges daily at dawn. While holding the staff, you can expend 1 charge to cast its spell. If you expend the staff's last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff. The spell's saving throw DC is 18, and its attack bonus is 10."
    },
    {
      "name": "Flail of Tiamat",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This magic flail is made in the image of Tiamat, with five jagged heads shaped like the heads of five different chromatic dragons. You gain a +3 bonus to attack and damage rolls made with this flail. When you hit with an attack roll using it, the target takes an extra 5d4 damage of your choice of one of the following damage types: acid, cold, fire, lightning, or poison. While holding the flail, you can use an action and speak a command word to cause the heads to breathe multicolored flames in a 90-foot cone. Each creature in that area must make a 18 Dexterity saving throw. On a failed save, it"
    },
    {
      "name": "Gold Canary Figurine of Wondrous Power",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This gold statuette is carved in the likeness of a canary and is small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature in one of two forms (you choose). If there isn't enough space for the creature where it would appear, the figurine doesn't become a creature. The two forms are as follows: Giant Canary Form: The figurine becomes a giant canary for up to 8 hours and can be ridden as a mount. Once the figurine has become a giant canary, it can't be used this way"
    },
    {
      "name": "Hammer of Thunderbolts",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "You gain a +1 bonus to attack and damage rolls made with this magic weapon. Giant's Bane (Requires Attunement): You must be wearing a belt of giant strength (any variety) and gauntlets of ogre power to attune to this weapon. The attunement ends if you take off either of those items. While you are attuned to this weapon and holding it, your Strength score increases by 4 and can exceed 20, but not 30. When you roll a 20 on an attack roll made with this weapon against a giant, the giant must succeed on a 17 Constitution saving throw or die. The hammer also has 5 charges. While attuned to it, you "
    },
    {
      "name": "Harp of Gilded Plenty",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This golden harp is sculpted in the image of the god Iallanis, depicted as a young cloud giant woman. When a creature comes within 5 feet of the harp, the instrument animates and is capable of speaking, singing, and playing by itself. Whenever you attempt to attune to the harp, you must first make either a 15 Charisma (Performance) check or a 20 Charisma (Persuasion) check to convince the harp that you are worthy, attuning to the harp on a success. If you fail, you can't attempt to attune to the harp again until the next dawn. Once you have successfully attuned to the harp, the harp resizes to"
    },
    {
      "name": "Horn of Valhalla, Iron",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can use an action to blow this horn. In response, warrior spirits from the plane of Ysgard appear within 60 feet of you. These spirits use the berserker statistics. They return to Ysgard after 1 hour or when they drop to 0 hit points. Once you use the horn, it can't be used again until 7 days have passed. The iron horn summons 5d4 + 5 berserker. To use the iron horn, you must be proficient with all martial weapons. If you blow the horn without meeting its requirement, the summoned berserker attack you. If you meet the requirement, they are friendly to you and your companions and follow you"
    },
    {
      "name": "Horn of Valhalla, Iron",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "You can take a Magic action to blow this horn. In response, warrior spirits from the plane of Ysgard appear in unoccupied spaces within 60 feet of you. Each spirit uses the Berserker stat block and returns to Ysgard after 1 hour or when it drops to 0 Hit Points. The spirits look like living, breathing warriors, and they have Immunity to the Charmed and Frightened conditions. Once you use the horn, it can't be used again until 7 days have passed. A iron horn summons 5 Berserker. To use the iron horn, you must have Proficiency with all Martial weapons. If you blow the horn without meeting its re"
    },
    {
      "name": "Instrument of the Bards, Ollamh Harp",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An instrument of the bards is an exquisite example of its kind, superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a legendary bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 psychic damage. You can use an action to play the instrument and cast one of its spells. Once the instrument has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellcasting ability and spell save DC. You can play"
    },
    {
      "name": "Instrument of the Bards, Ollamh Harp",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a bard)",
      "desc": "An Instrument of the Bards is superior to an ordinary instrument in every way. Seven types of these instruments exist, each named after a bard college. A creature that attempts to play the instrument without being attuned to it must succeed on a 15 Wisdom saving throw or take 2d4 Psychic damage. You can play the Ollamh Harp to cast one of the following spells: Fly, Invisibility, Levitate, Protection from Evil and Good, Confusion, Control Weather, and Fire Storm. Once the Ollamh Harp has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use you"
    },
    {
      "name": "Ioun Stone, Greater Absorption",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Greater Absorption",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} While this marbled lavender and green ellipsoid orbits your head, you can take a Reaction to cancel a spell of level 8 or lower cast by a creature you can see. A canceled spell has no effect, and any resources used to cast it are wasted. Once the stone has canceled 20 levels of spells, it burns out, turns dull gray, and loses its magic."
    },
    {
      "name": "Ioun Stone, Mastery",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Mastery",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} Your Proficiency increases by 1 while this pale green prism orbits your head."
    },
    {
      "name": "Ioun Stone, Regeneration",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color. When you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect. A "
    },
    {
      "name": "Ioun Stone, Regeneration",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "{#itemEntry Ioun Stone|XDMG} You regain 15 Hit Points at the end of each hour this pearly white spindle orbits your head if you have at least 1 Hit Points."
    },
    {
      "name": "Iron Flask",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This iron bottle has a brass stopper. You can use an action to speak the flask's command word, targeting a creature that you can see within 60 feet of you. If the target is native to a plane of existence other than the one you're on, the target must succeed on a 17 Wisdom saving throw or be trapped in the flask. If the target has been trapped by the flask before, it has advantage on the saving throw. Once trapped, a creature remains in the flask until released. The flask can hold only one creature at a time. A creature trapped in the flask doesn't need to breathe, eat, or drink and doesn't age"
    },
    {
      "name": "Iron Flask",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "While holding this brass-stoppered iron flask, you can take a Magic action to target a creature that you can see within 60 feet of yourself. If the flask is empty and the target is native to a plane of existence other than the one you're on, the target must succeed on a 17 Wisdom saving throw or be trapped in the flask. If the target has been trapped by the flask before, it has Advantage on the save. Once trapped, a creature remains in the flask until released. The flask can hold only one creature at a time. A creature trapped in the flask doesn't age and doesn't need to breathe, eat, or drink"
    },
    {
      "name": "Longbow of the Healing Hearth",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This ivory longbow is inscribed with a prayer to the god Hiatea, the runes of which are entwined with gilded engravings of wheat stalks and deer antlers. You gain a +3 bonus to attack and damage rolls made with this weapon. If you load no ammunition in the weapon, it produces its own, automatically creating one magic arrow when you pull back the string. The arrow created by the bow vanishes the instant after it hits or misses a target. The bow has 8 charges for the following properties, which you can use while wielding the bow. The bow regains 1d4 + 1 charges daily at dawn. Curative Arrow: Whe"
    },
    {
      "name": "Moonblade",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by an elf or half-elf of neutral good alignment)",
      "desc": "Of all the magic items created by the elves, one of the most prized and jealously guarded is a moon blade. In ancient times, nearly all elven noble houses claimed one such blade. Over the centuries, some blades have faded from the world, their magic lost as family lines have become extinct. Other blades have vanished with their bearers during great quests. Thus, only a few of these weapons remain. A moonblade passes down from parent to child. The sword chooses its bearer and remains bonded to that person for life. If the bearer dies, another heir can claim the blade. If no worthy heir exists, "
    },
    {
      "name": "Orb of Skoraeus",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "Said to be infused with the wisdom and power of the god Skoraeus, this polished stone orb is veined with iridescent crystal that seems to glow from within. The orb is 8 inches in diameter and weighs 8 pounds, making it a palm-sized trinket for a stone giant but a more unwieldy item for a Medium creature to use. While holding this orb, you can use it as a spellcasting focus for your spells. You also gain the following benefits: Abundant Components: The orb has 3 charges and regains all expended charges at dawn. When you cast a spell while holding this orb, you can expend up to 3 charges to igno"
    },
    {
      "name": "Plate Armor of Etherealness",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While you're wearing this armor, you can speak its command word as an action to gain the effect of the etherealness spell, which lasts for 10 minutes or until you remove the armor or use an action to speak the command word again. This property of the armor can't be used again until the next dawn."
    },
    {
      "name": "Platinum Scarf",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This scarf is made of sturdy cloth and covered in platinum-colored scales. As an action, you can pull a scale from the scarf and speak a command word. When you do so, choose one of the following effects: Breath of Life: The scale disappears, and you or a creature you touch regains 10d4 hit points. Platinum Shield: For 1 hour or until you dismiss it (no action required), the scale becomes a +1 shield, which you or another creature can use. A creature wielding the shield has immunity to radiant damage. Radiant Hammer: For 1 hour or until you dismiss it (no action required), the scale becomes a m"
    },
    {
      "name": "Potion of Dragon's Majesty",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "This potion looks like liquid gold, with a single scale from a chromatic, gem, or metallic dragon suspended in it. When you drink this potion, you transform into an adult dragon of the same kind as the dragon the scale came from. The transformation lasts for 1 hour. Any equipment you are wearing or carrying melds into your new form or falls to the ground (your choice). For the duration, you use the game statistics of the adult dragon instead of your own, but you retain your languages, personality, and memories. You can't use a dragon's Change Shape or its legendary or lair actions."
    },
    {
      "name": "Potion of Storm Giant Strength",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 29 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a storm giant."
    },
    {
      "name": "Potion of Storm Giant Strength",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "When you drink this potion, your Strength score changes to 29 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score. This potion's transparent liquid has floating in it a sliver of fingernail from a storm giant."
    },
    {
      "name": "Prehistoric Figurine of Wondrous Power, Jasper Tyrannosaurus Rex",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "Larger and more roughly hewn than typical figurines of wondrous power, these statuettes depict dinosaurs and related creatures from the earliest days of the world. As an action, you can throw a prehistoric figurine of wondrous power to a point on the ground within 60 feet of yourself while speaking a command word, whereupon the figurine magically transforms into a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature. The creature is friendly to you and you"
    },
    {
      "name": "Reaper's Scream",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "The spikes of this iron morningstar glow with sickly, pale light. The death rune is inscribed on its shaft and inlaid with pearl. You gain a +2 bonus to attack and damage rolls made with this weapon, and attacks with this weapon deal necrotic damage instead of piercing damage. When you attack a creature with this weapon and roll a 20 on the attack roll, you gain 10 temporary hit points. Any creature that hits you with a melee attack while you have 1 or more of these temporary hit points takes 10 necrotic damage. Invoking the Rune: As a bonus action, you can invoke the weapon's rune, unleashing"
    },
    {
      "name": "Ring of Air Elemental Command",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you have advantage on attack rolls against elementals from the Elemental Plane of Air, and they have disadvantage on attack rolls against you. In addition, you have access to properties based on the Elemental Plane of Air. The ring has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from the ring have a save DC of 17. You can expend 2 of the ring's charges to cast dominate monster on an air elemental. In addition, when you fall, you descend 60 feet per round and take no damage from falling. You can also speak and understand Auran. If you help "
    },
    {
      "name": "Ring of Djinni Summoning",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can speak its command word as an action to summon a particular djinni from the Elemental Plane of Air. The djinni appears in an unoccupied space you choose within 120 feet of you. It remains as long as you concentrate (as if concentration on a spell), to a maximum of 1 hour, or until it drops to 0 hit points. It then returns to its home plane. While summoned, the djinni is friendly to you and your companions. It obeys any commands you give it, no matter what language you use. If you fail to command it, the djinni defends itself against attackers but takes no other "
    },
    {
      "name": "Ring of Djinni Summoning",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can take a Magic action to summon a particular Djinni from the Elemental Plane of Air. The djinni appears in an unoccupied space you choose within 120 feet of yourself. It remains as long as you maintain Concentration, to a maximum of 1 hour, or until it drops to 0 Hit Points. While summoned, the djinni is Friendly [Attitude] to you and your allies, and it obeys your commands. If you fail to command it, the djinni defends itself against attackers but takes no other actions. After the djinni departs, it can't be summoned again for 24 hours, and the ring becomes nonm"
    },
    {
      "name": "Ring of Earth Elemental Command",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you have advantage on attack rolls against elementals from the Elemental Plane of Earth and they have disadvantage on attack rolls against you. In addition, you have access to properties based on the Elemental Plane of Earth. The ring has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from the ring have a save DC of 17. You can expend 2 of the ring's charges to cast dominate monster on an earth elemental. In addition, you can move in difficult terrain that is composed of rubble, rocks, or dirt as if it were normal terrain. You can also speak "
    },
    {
      "name": "Ring of Elemental Command (Air)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "The Ring of Elemental Command (air) is linked to the Elemental Plane of Air. Every Ring of Elemental Command has the following two properties: While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you. While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its next t"
    },
    {
      "name": "Ring of Elemental Command (Earth)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "The Ring of Elemental Command (earth) is linked to the Elemental Plane of Earth. Every Ring of Elemental Command has the following two properties: While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you. While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its ne"
    },
    {
      "name": "Ring of Elemental Command (Fire)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "The Ring of Elemental Command (fire) is linked to the Elemental Plane of Fire. Every Ring of Elemental Command has the following two properties: While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you. While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its next"
    },
    {
      "name": "Ring of Elemental Command (Water)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "The Ring of Elemental Command (water) is linked to the Elemental Plane of Water. Every Ring of Elemental Command has the following two properties: While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you. While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its ne"
    },
    {
      "name": "Ring of Fire Elemental Command",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you have advantage on attack rolls against elementals from the Elemental Plane of Fire and they have disadvantage on attack rolls against you. In addition, you have access to properties based on the Elemental Plane of Fire. The ring has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from the ring have a save DC of 17. You can expend 2 of the ring's charges to cast dominate monster on a fire elemental. In addition, you have resistance to fire damage. You can also speak and understand Ignan. If you help slay a fire elemental while attuned to th"
    },
    {
      "name": "Ring of Invisibility",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can turn invisible as an action. Anything you are wearing or carrying is invisible with you. You remain invisible until the ring is removed, until you attack or cast a spell, or until you use a bonus action to become visible again."
    },
    {
      "name": "Ring of Invisibility",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you can take a Magic action to give yourself the Invisible condition. You remain Invisible until the ring is removed or until you take a Bonus Action to become visible again."
    },
    {
      "name": "Ring of Spell Turning",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you have advantage on saving throws against any spell that targets only you (not in an area of effect). In addition, if you roll a 20 for the save and the spell is 7th level or lower, the spell has no effect on you and instead targets the caster, using the slot level, spell save DC, attack bonus, and spellcasting ability of the caster."
    },
    {
      "name": "Ring of Spell Turning",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you have Advantage on saving throws against spells. If you succeed on the save for a spell of level 7 or lower, the spell has no effect on you. If that spell targeted only you and didn't create an area of effect, you can take a Reaction to deflect the spell back at the spell's caster; the caster must make a saving throw against the spell using their own spell save DC."
    },
    {
      "name": "Ring of Three Wishes",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "While wearing this ring, you can use an action to expend 1 of its 3 charges to cast the wish spell from it. The ring becomes nonmagical when you use the last charge."
    },
    {
      "name": "Ring of Three Wishes",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "While wearing this ring, you can expend 1 of its 3 charges to cast Wish from it. The ring becomes nonmagical when you use the last charge."
    },
    {
      "name": "Ring of Water Elemental Command",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "While wearing this ring, you have advantage on attack rolls against elementals from the Elemental Plane of Water and they have disadvantage on attack rolls against you. In addition, you have access to properties based on the Elemental Plane of Water. The ring has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from the ring have a save DC of 17. You can expend 2 of the ring's charges to cast dominate monster on a water elemental. In addition, you can stand on and walk across liquid surfaces as if they were solid ground. You can also speak and understand Aquan. If you "
    },
    {
      "name": "Robe of the Archmagi",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer, warlock, or wizard)",
      "desc": "This elegant garment is made from exquisite cloth of white, gray, or black and adorned with silvery runes. The robe's color corresponds to the alignment for which the item was created. A white robe was made for good, gray for neutral, and black for evil. You can't attune to a robe of the archmagi that doesn't correspond to your alignment. You gain these benefits while wearing the robe: If you aren't wearing armor, your base Armor Class is 15 + your Dexterity modifier. You have advantage on saving throws against spell and other magical effects. Your spell save DC and spell attack bonus each inc"
    },
    {
      "name": "Robe of the Archmagi",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a sorcerer, warlock, or wizard)",
      "desc": "This elegant garment is made from exquisite cloth and adorned with runes. You gain these benefits while wearing the robe. Armor: If you aren't wearing armor, your base Armor Class is 15 plus your Dexterity modifier. Magic Resistance: You have Advantage on saving throws against spells and other magical effects. War Mage: Your spell save DC and spell attack bonus each increase by 2."
    },
    {
      "name": "Rod of Lordly Might",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This rod has a flanged head, and it functions as a magic mace that grants a +3 bonus to attack and damage roll made with it. The rod has properties associated with six different buttons that are set in a row along the haft. It has three other properties as well, detailed below. Six Buttons: You can press one of the rod's six buttons as a bonus action. A button's effect lasts until you push a different button or until you push the same button again, which causes the rod to revert to its normal form. If you press button 1, the rod becomes a flame tongue as a fiery blade sprouts from the end oppo"
    },
    {
      "name": "Rod of Lordly Might",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This rod has a flanged head, and it functions as a magic Mace that grants a +3 bonus to attack rolls and damage rolls made with it. The rod has properties associated with six different buttons that are set in a row along the haft. It has three other properties as well, detailed below. Buttons: You can press one of the following buttons as a Bonus Action; a button's effect lasts until you push a different button or until you push the same button again, which causes the rod to revert to its normal form: A fiery blade sprouts from the end opposite the rod's flanged head. The flames shed Bright Li"
    },
    {
      "name": "Rod of Resurrection",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a cleric, druid, or paladin)",
      "desc": "The rod has 5 charges. While you hold it, you can use an action to cast one of the following spells from it: heal (expends 1 charge) or resurrection (expends 5 charges). The rod regains 1 expended charge daily at dawn. If the rod is reduced to 0 charges, roll a d20. On a 1, the rod disappears in a burst of radiance."
    },
    {
      "name": "Rod of Resurrection",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a cleric, druid, or paladin)",
      "desc": "The rod has 5 charges. While you hold it, you can cast one of the following spells from it: Heal (expends 1 charge) or Resurrection (expends 5 charges). The rod regains 1 expended charge daily at dawn. If you expend the last charge, roll 1d20. On a 1, the rod disappears in a harmless burst of radiance."
    },
    {
      "name": "Ruby Weave Gem",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a spellcaster)",
      "desc": "While you are holding this gem, you can use it as a spellcasting focus for your spells. The gem has 3 charges and regains all expended charges daily at dawn. When you cast a spell while holding this gem, you can expend up to 3 charges to ignore the spell's material components with a gold piece cost, up to 500 gp per charge expended. When you finish a long rest, choose a spell from any class list. The spell you choose must be of a level you can cast. You know the chosen spell and can cast it with your spell slots of the appropriate level until the end of your next long rest."
    },
    {
      "name": "Scarab of Protection",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "If you hold this beetle-shaped medallion in your hand for 1 round, an inscription appears on its surface revealing its magical nature. It provides two benefits while it is on your person: You have advantage on saving throws against spells. The scarab has 12 charges. If you fail a saving throw against a necromancy spell or a harmful effect originating from an undead creature, you can use your reaction to expend 1 charge and turn the failed save into a successful one. The scarab crumbles into powder and is destroyed when its last charge is expended."
    },
    {
      "name": "Scarab of Protection",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This beetle-shaped medallion provides three benefits while it is on your person. Defense: You gain a +1 bonus to Armor Class. Preservation: The scarab has 12 charges. If you fail a saving throw against a Necromancy spell or a harmful effect originating from an Undead, you can take a Reaction to expend 1 charge and turn the failed save into a successful one. The scarab crumbles into powder and is destroyed when its last charge is expended. Spell Resistance: You have Advantage on saving throws against spells."
    },
    {
      "name": "Scroll of Titan Summoning (Animal Lord)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "When you take a Magic action to read this scroll, an Animal Lord appears in an unoccupied space on the ground or in water that you can see within 1 mile of yourself. The Animal Lord is Hostile [Attitude] toward all other creatures and disappears when it drops to 0 Hit Points. If the Animal Lord is summoned into a space that isn't large enough to contain it, the summoning fails, and the scroll is wasted."
    },
    {
      "name": "Scroll of Titan Summoning (Blob of Annihilation)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "When you take a Magic action to read this scroll, a Blob of Annihilation appears in an unoccupied space on the ground or in water that you can see within 1 mile of yourself. The Blob of Annihilation is Hostile [Attitude] toward all other creatures and disappears when it drops to 0 Hit Points. If the Blob of Annihilation is summoned into a space that isn't large enough to contain it, the summoning fails, and the scroll is wasted."
    },
    {
      "name": "Scroll of Titan Summoning (Colossus)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "When you take a Magic action to read this scroll, a Colossus appears in an unoccupied space on the ground or in water that you can see within 1 mile of yourself. The Colossus is Hostile [Attitude] toward all other creatures and disappears when it drops to 0 Hit Points. If the Colossus is summoned into a space that isn't large enough to contain it, the summoning fails, and the scroll is wasted."
    },
    {
      "name": "Scroll of Titan Summoning (Elemental Cataclysm)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "When you take a Magic action to read this scroll, an Elemental Cataclysm appears in an unoccupied space on the ground or in water that you can see within 1 mile of yourself. The Elemental Cataclysm is Hostile [Attitude] toward all other creatures and disappears when it drops to 0 Hit Points. If the Elemental Cataclysm is summoned into a space that isn't large enough to contain it, the summoning fails, and the scroll is wasted."
    },
    {
      "name": "Scroll of Titan Summoning (Empyrean)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "When you take a Magic action to read this scroll, an Empyrean appears in an unoccupied space on the ground or in water that you can see within 1 mile of yourself. The Empyrean is Hostile [Attitude] toward all other creatures and disappears when it drops to 0 Hit Points. If the Empyrean is summoned into a space that isn't large enough to contain it, the summoning fails, and the scroll is wasted."
    },
    {
      "name": "Scroll of Titan Summoning (Kraken)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "When you take a Magic action to read this scroll, a Kraken appears in an unoccupied space in water that you can see within 1 mile of yourself. A kraken requires a body of water large enough to contain it, or the summoning fails and the scroll is wasted The Kraken is Hostile [Attitude] toward all other creatures and disappears when it drops to 0 Hit Points. If the Kraken is summoned into a space that isn't large enough to contain it, the summoning fails, and the scroll is wasted."
    },
    {
      "name": "Scroll of Titan Summoning (Tarrasque)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "When you take a Magic action to read this scroll, a Tarrasque appears in an unoccupied space on the ground or in water that you can see within 1 mile of yourself. The Tarrasque is Hostile [Attitude] toward all other creatures and disappears when it drops to 0 Hit Points. If the Tarrasque is summoned into a space that isn't large enough to contain it, the summoning fails, and the scroll is wasted."
    },
    {
      "name": "Shield of the Blazing Dreadnought",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Modeled after the formidable spiked tower shields wielded by some fire giants, this iron shield emanates a constant warmth. You can use a bonus action to activate the shield, causing glowing lava to flow through the shield's grooves for 1 minute. While the shield is active, you gain the following benefits: Blazing Soul: You have immunity to fire damage. Cleansing Fire: As an action, you can cause the shield to flare with the cleansing fire of the god Surtur. Choose one creature you can see within 30 feet of yourself (you can choose yourself). One disease or condition of your choice affecting t"
    },
    {
      "name": "Sovereign Glue",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This viscous, milky-white substance can form a permanent adhesive bond between any two objects. It must be stored in a jar or flask that has been coated inside with oil of slipperiness. When found, a container contains 1d6 + 1 ounces. One ounce of the glue can cover a 1-foot square surface. The glue takes 1 minute to set. Once it has done so, the bond it creates can be broken only by the application of universal solvent or oil of etherealness, or with a wish spell."
    },
    {
      "name": "Sovereign Glue",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This viscous, milky-white substance can form a permanent adhesive bond between any two objects. It must be stored in a jar or flask that has been coated inside with Oil of Slipperiness. When found, a container contains 1d6 + 1 ounces. One ounce of the glue can cover a 1-foot square surface. Applying an ounce of Sovereign Glue takes a Utilize action, and the applied glue takes 1 minute to set. Once it has done so, the bond it creates can be broken only by the application of Universal Solvent or Oil of Etherealness, or with a Wish spell."
    },
    {
      "name": "Spell Scroll (9th Level)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "A spell scroll bears the words of a single spell, written as a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost. If the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using you"
    },
    {
      "name": "Spell Scroll (Level 9)",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "",
      "desc": "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost. If the spell is on your spell list but of a higher level than you can normally cast, you make a 19 ability check using your spellcasting ability to determine whether you cast the spe"
    },
    {
      "name": "Sphere of Annihilation",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This 2-foot-diameter black sphere is a hole in the multiverse, hovering in space and stabilized by a magical field surrounding it. The sphere obliterates all matter it passes through and all matter that passes through it. Artifacts are the exception. Unless an artifact is susceptible to damage from a sphere of annihilation, it passes through the sphere unscathed. Anything else that touches the sphere but isn't wholly engulfed and obliterated by it takes 4d10 force damage. The sphere is stationary until someone controls it. If you are within 60 feet of an uncontrolled sphere, you can use an act"
    },
    {
      "name": "Sphere of Annihilation",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This 2-foot-diameter black sphere is a hole in the multiverse, hovering in space and stabilized by a magical field surrounding it. The sphere obliterates all matter it passes through and all matter that passes through it. Artifacts are the exception. Unless an Artifact is susceptible to damage from a Sphere of Annihilation, it passes through the sphere unscathed. Anything else that touches the sphere but isn't wholly engulfed and obliterated by it takes 8d10 Force damage. Controlling the Sphere: A Sphere of Annihilation is stationary until someone takes control of it. If you are within 60 feet"
    },
    {
      "name": "Staff of the Magi",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Staff",
      "attunement": "requires attunement (by a sorcerer, warlock, or wizard)",
      "desc": "This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While you hold it, you gain a +2 bonus to spell attack rolls. The staff has 50 charges for the following properties. It regains 4d6 + 2 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 20, the staff regains 1d12 + 1 charges. Spell Absorption: While holding the staff, you have advantage on saving throws against spells. In addition, you can use your reaction when another creature casts a spell that targets only you. If you do, the staff absorbs the magi"
    },
    {
      "name": "Staff of the Magi",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Staff",
      "attunement": "requires attunement (by a sorcerer, warlock, or wizard)",
      "desc": "This staff has 50 charges and can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. While you hold it, you gain a +2 bonus to spell attack rolls. Spell Absorption: While holding the staff , you have Advantage on saving throws against spells. In addition, you can take a Reaction when another creature casts a spell that targets only you. If you do, the staff absorbs the magic of the spell, canceling its effect and gaining a number of charges equal to the absorbed spell's level. However, if doing so brings the staff's total number of charges "
    },
    {
      "name": "Stonebreaker's Breastplate",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This breastplate is made from marbled granite, though it feels no heavier than a typical metal breastplate. Its chest is emblazoned with the stone rune. While wearing this breastplate, you have resistance to bludgeoning, piercing, and slashing damage and are immune to being knocked prone. Invoking the Rune: As an action, you can invoke the breastplate's rune to cast the wall of stone spell (save 14) with it. When you cast the spell in this way, you have advantage on saving throws made to maintain concentration on the spell. Once the rune has been invoked, it can't be invoked again until the ne"
    },
    {
      "name": "Sword of Answering",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "You gain a +3 bonus to attack rolls and damage rolls made with this sword. In addition, while you hold the sword, you can take a Reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have Advantage on the attack roll, and any damage dealt with this special attack ignores any Immunity or Resistance the target has to that damage."
    },
    {
      "name": "Sword of Answering (Answerer)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a chaotic good creature)",
      "desc": "In the world of Greyhawk, only nine of these blades are known to exist. Each is patterned after the legendary sword Fragarach, which is variously translated as \"Final Word.\" Each of the nine swords has its own name and alignment, and each bears a different gem in its pommel. Answerer, the Chaotic Good sword, has an emerald set in its pommel. You gain a +3 bonus to attack and damage rolls made with this sword. In addition, while you hold the sword, you can use your reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have advantage on the at"
    },
    {
      "name": "Sword of Answering (Back Talker)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a chaotic evil creature)",
      "desc": "In the world of Greyhawk, only nine of these blades are known to exist. Each is patterned after the legendary sword Fragarach, which is variously translated as \"Final Word.\" Each of the nine swords has its own name and alignment, and each bears a different gem in its pommel. Back Talker, the Chaotic Evil sword, has jet set in its pommel. You gain a +3 bonus to attack and damage rolls made with this sword. In addition, while you hold the sword, you can use your reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have advantage on the attack"
    },
    {
      "name": "Sword of Answering (Concluder)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a lawful neutral creature)",
      "desc": "In the world of Greyhawk, only nine of these blades are known to exist. Each is patterned after the legendary sword Fragarach, which is variously translated as \"Final Word.\" Each of the nine swords has its own name and alignment, and each bears a different gem in its pommel. Concluder, the Lawful Neutral sword, has an amethyst set in its pommel. You gain a +3 bonus to attack and damage rolls made with this sword. In addition, while you hold the sword, you can use your reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have advantage on th"
    },
    {
      "name": "Sword of Answering (Last Quip)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a chaotic neutral creature)",
      "desc": "In the world of Greyhawk, only nine of these blades are known to exist. Each is patterned after the legendary sword Fragarach, which is variously translated as \"Final Word.\" Each of the nine swords has its own name and alignment, and each bears a different gem in its pommel. Last Quip, the Chaotic Neutral sword, has a tourmaline set in its pommel. You gain a +3 bonus to attack and damage rolls made with this sword. In addition, while you hold the sword, you can use your reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have advantage on "
    },
    {
      "name": "Sword of Answering (Rebutter)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a neutral good creature)",
      "desc": "In the world of Greyhawk, only nine of these blades are known to exist. Each is patterned after the legendary sword Fragarach, which is variously translated as \"Final Word.\" Each of the nine swords has its own name and alignment, and each bears a different gem in its pommel. Rebutter, the Neutral Good sword, has a topaz set in its pommel. You gain a +3 bonus to attack and damage rolls made with this sword. In addition, while you hold the sword, you can use your reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have advantage on the attac"
    },
    {
      "name": "Sword of Answering (Replier)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a neutral creature)",
      "desc": "In the world of Greyhawk, only nine of these blades are known to exist. Each is patterned after the legendary sword Fragarach, which is variously translated as \"Final Word.\" Each of the nine swords has its own name and alignment, and each bears a different gem in its pommel. Replier, the Neutral sword, has a peridot set in its pommel. You gain a +3 bonus to attack and damage rolls made with this sword. In addition, while you hold the sword, you can use your reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have advantage on the attack ro"
    },
    {
      "name": "Sword of Answering (Retorter)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a lawful good creature)",
      "desc": "In the world of Greyhawk, only nine of these blades are known to exist. Each is patterned after the legendary sword Fragarach, which is variously translated as \"Final Word.\" Each of the nine swords has its own name and alignment, and each bears a different gem in its pommel. Retorter, the Lawful Good sword, has an aquamarine set in its pommel. You gain a +3 bonus to attack and damage rolls made with this sword. In addition, while you hold the sword, you can use your reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have advantage on the "
    },
    {
      "name": "Sword of Answering (Scather)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a lawful evil creature)",
      "desc": "In the world of Greyhawk, only nine of these blades are known to exist. Each is patterned after the legendary sword Fragarach, which is variously translated as \"Final Word.\" Each of the nine swords has its own name and alignment, and each bears a different gem in its pommel. Scather, the Lawful Evil sword, has a garnet set in its pommel. You gain a +3 bonus to attack and damage rolls made with this sword. In addition, while you hold the sword, you can use your reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have advantage on the attack"
    },
    {
      "name": "Sword of Answering (Squelcher)",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a neutral evil creature)",
      "desc": "In the world of Greyhawk, only nine of these blades are known to exist. Each is patterned after the legendary sword Fragarach, which is variously translated as \"Final Word.\" Each of the nine swords has its own name and alignment, and each bears a different gem in its pommel. Squelcher, the Neutral Evil sword, has a spinel set in its pommel. You gain a +3 bonus to attack and damage rolls made with this sword. In addition, while you hold the sword, you can use your reaction to make one melee attack with it against any creature in your reach that deals damage to you. You have advantage on the att"
    },
    {
      "name": "Talisman of Pure Good",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a creature of good alignment)",
      "desc": "This talisman is a mighty symbol of goodness. A creature that is neither good nor evil in alignment takes 6d6 radiant damage upon touching the talisman. An evil creature takes 8d6 radiant damage upon touching the talisman. Either sort of creature takes the damage again each time it ends its turn holding or carrying the talisman. If you are a good cleric or paladin, you can use the talisman as a holy symbol, and you gain a +2 bonus to spell attack rolls while you wear or hold it. The talisman has 7 charges. If you are wearing or holding it, you can use an action to expend 1 charge from it and c"
    },
    {
      "name": "Talisman of Pure Good",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a cleric or paladin)",
      "desc": "This talisman is a mighty symbol of goodness. A Fiend or an Undead that touches the talisman takes 8d6 Radiant damage and takes the damage again each time it ends its turn holding or carrying the talisman. Holy Symbol: You can use the talisman as a Holy Symbol. You gain a +2 bonus to spell attack rolls while you wear or hold it. Pure Rebuke: The talisman has 7 charges. While wearing or holding the talisman, you can take a Magic action to expend 1 charge and target one creature you can see on the ground within 120 feet of yourself. A flaming fissure opens under the target, and the target makes "
    },
    {
      "name": "Talisman of Ultimate Evil",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a creature of evil alignment)",
      "desc": "This item symbolizes unrepentant evil. A creature that is neither good nor evil in alignment takes 6d6 necrotic damage upon touching the talisman. A good creature takes 8d6 necrotic damage upon touching the talisman. Either sort of creature takes the damage again each time it ends its turn holding or carrying the talisman. If you are an evil cleric or paladin, you can use the talisman as a holy symbol, and you gain a +2 bonus to spell attack rolls while you wear or hold it. The talisman has 6 charges. If you are wearing or holding it, you can use an action to expend 1 charge from the talisman "
    },
    {
      "name": "Talisman of Ultimate Evil",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This item symbolizes unrepentant evil. A creature that isn't a Fiend or an Undead that touches the talisman takes 8d6 Necrotic damage and takes the damage again each time it ends its turn holding or carrying the talisman. Holy Symbol: You can use the talisman as a Holy Symbol. You gain a +2 bonus to spell attack rolls while you wear or hold it. Ultimate End: The talisman has 6 charges. While wearing or holding the talisman, you can take a Magic action to expend 1 charge and target one creature you can see on the ground within 120 feet of yourself. A flaming fissure opens under the target, and "
    },
    {
      "name": "Talisman of the Sphere",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "When you make an Intelligence (Arcana) check to control a sphere of annihilation while you are holding this talisman, you double your proficiency bonus on the check. In addition, when you start your turn with control over a sphere of annihilation, you can use an action to levitate it 10 feet plus a number of additional feet equal to 10 × your Intelligence modifier."
    },
    {
      "name": "Talisman of the Sphere",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "While holding or wearing this talisman, you have Advantage on any Intelligence (Arcana) check you make to control a Sphere of Annihilation. In addition, when you start your turn in control of a Sphere of Annihilation, you can take a Magic action to move it 10 feet plus a number of additional feet equal to 10 times your Intelligence modifier. This movement doesn't have to be in a straight line."
    },
    {
      "name": "Tome of the Stilled Tongue",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This thick leather-bound volume has a desiccated tongue pinned to the front cover. Five of these tomes exist, and it's unknown which one is the original. The grisly cover decoration on the first tome of the stilled tongue once belonged to a treacherous former servant of the lich-god Vecna, keeper of secrets. The tongues pinned to the covers of the four copies came from other spellcasters who crossed Vecna. The first few pages of each tome are filled with indecipherable scrawls. The remaining pages are blank and pristine. If you can attune to this item, you can use it as a spellbook and an arca"
    },
    {
      "name": "Tome of the Stilled Tongue",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a wizard)",
      "desc": "This book has a desiccated tongue pinned to its front cover. Five of these tomes exist, and it's unknown which one is the original. The tongue on the first Tome of the Stilled Tongue belonged to a treacherous former servant of the lich Vecna. The tongues pinned to the covers of the four copies came from other spellcasters who crossed Vecna. The first few pages of each tome are filled with indecipherable scrawls. The remaining pages are blank. While attuned to this item, you can use it as a Spellbook and an Arcane Focus. In addition, while holding the tome, you can take a Bonus Action to cast a"
    },
    {
      "name": "Topaz Annihilator",
      "source": "Fizban's",
      "source_key": "FTD",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This magic ranged weapon resembles a musket, but in lieu of any ammunition, it holds a glowing yellow scale from a topaz dragon in its heart. The weapon has a normal range of 100 feet and a long range of 300 feet, and it has the two-handed property. It deals 2d6 necrotic damage on a hit. If this damage reduces a creature or object to 0 hit points, the target is reduced to dust. A creature reduced to dust can be restored to life only by a true resurrection or wish spell. While the weapon is on your person, you can use an action to cast the disintegrate spell (save 18). Once this property is use"
    },
    {
      "name": "Universal Solvent",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tube holds milky liquid with a strong alcohol smell. You can use an action to pour the contents of the tube onto a surface within reach. The liquid instantly dissolves up to 1 square foot of adhesive it touches, including sovereign glue."
    },
    {
      "name": "Universal Solvent",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This tube holds milky liquid with a strong alcohol smell. When found, a tube contains 1d6 + 1 ounces. You can take a Utilize action to pour 1 or more ounces of solvent from the tube onto a surface within reach. Each ounce instantly dissolves up to 1 square foot of adhesive it touches, including Sovereign Glue."
    },
    {
      "name": "Wave",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a creature that worships a god of the sea)",
      "desc": "Held in the dungeon of White Plume Mountain, this trident is an exquisite weapon engraved with images of waves, shells, and sea creatures. Although you must worship a god of the sea to attune to this weapon, Wave happily accepts new converts. You gain a +3 bonus to attack and damage rolls made with this magic weapon. If you score a critical hit with it, the target takes extra necrotic damage equal to half its hit point maximum. The weapon also functions as a trident of fish command and a weapon of warning. It can confer the benefit of a cap of water breathing while you hold it, and you can use"
    },
    {
      "name": "Well of Many Worlds",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can use an action to unfold and place the well of many worlds on a solid surface, whereupon it creates a two-way portal to another world or plane of existence. Each time the item opens a portal, the DM decides where it leads. You can use an action to close an open portal by taking hold of the edges of the cloth and folding it up. Once well of many worlds has opened a portal, it can't do so again for 1d8 hours."
    },
    {
      "name": "Well of Many Worlds",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can take a Magic action to unfold the Well of Many Worlds and place it on a solid surface, whereupon it forms a two-way, 6-foot-diameter, circular portal to another world or plane of existence. Each time the item opens a portal, the DM decides where it leads. The portal remains open until a creature within 5 feet of it takes a Magic action to close it by taking hold of the edges of the cloth and folding it up. Once the Well of Many Worlds has opened a "
    },
    {
      "name": "Whelm",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "legendary",
      "rarity_order": 4,
      "type": "Item",
      "attunement": "requires attunement (by a dwarf)",
      "desc": "Whelm is a powerful warhammer forged by dwarves and lost in the dungeon of White Plume Mountain. You gain a +3 bonus to attack and damage rolls made with this magic weapon. At dawn the day after you first make an attack roll with Whelm, you develop a fear of being outdoors that persists as long as you remain attuned to the weapon. This causes you to have disadvantage on attack rolls, saving throws, and ability checks while you can see the daytime sky. Thrown Weapon: Whelm has the thrown property, with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged weapon atta"
    },
    {
      "name": "Adze of Annam",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "This massive adze is said to have been wielded by All-Father Annam, not as a weapon but as the tool he used to shape the various worlds of the Material Plane eons ago. Random Properties: The adze has the following random properties, determined by rolling on the appropriate table in the Dungeon Master's Guide: 2 Artifact Properties; Minor Beneficial Properties properties 1 Artifact Properties; Major Beneficial Properties property 2 Artifact Properties; Minor Detrimental Properties properties Magic Weapon: When a creature attunes to the adze, the artifact magically adjusts its size so that creat"
    },
    {
      "name": "Axe of the Dwarvish Lords",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Seeing the peril his people faced, a young dwarf prince came to believe that his people needed something to unite them. Thus, he set out to forge a weapon that would be such a symbol. Venturing deep under the mountains, deeper than any dwarf had ever delved, the young prince came to the blazing heart of a great volcano. With the aid of Moradin, the dwarven god of creation, he first crafted four great tools: the Brutal Pick, the Earthheart Forge, the Anvil of Songs, and the Shaping Hammer. With them, he forged the Axe of the Dwarvish Lords. Armed with the artifact, the prince returned to the dw"
    },
    {
      "name": "Axe of the Dwarvish Lords",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "A young dwarf prince set out to forge a weapon that would be regarded as a symbol of unity among his people. Venturing deep under the mountains, deeper than any dwarf had ever delved, the prince came to the blazing heart of a great volcano. With the aid of Moradin, a god of creation, he first crafted four mighty tools: the Starmetal Pick, the Earthheart Forge, the Anvil of Songs, and the Shaping Hammer. With these tools, he forged the Axe of the Dwarvish Lords. Armed with the Artifact, the prince brought peace to the dwarf clans, ending grudges and answering slights. The clans became allies, a"
    },
    {
      "name": "Baba Yaga's Mortar and Pestle",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The creations of the immortal hag Baba Yaga defy the laws of mortal magic. Among the notorious implements that cement her legend on countless worlds are the artifacts that propel her through the planes: Baba Yaga's Mortar and Pestle. These signature tools of Baba Yaga are a single artifact for purposes of attunement. Should the two objects become separated, the pestle appears next to the mortar at the next dawn. Random Properties: This artifact has the following random properties, which you can determine by rolling on the tables in the \"Artifacts\" section of the Dungeon Master's Guide: 2 Artif"
    },
    {
      "name": "Baba Yaga's Pestle",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "The pestle is a 6-inch-long, worn wooden tool. Once during your turn while you are holding the pestle, you can extend it into a quarterstaff or shrink it back into a pestle (no action required). As a quarterstaff, the pestle is a magic weapon that grants a +3 bonus to attack and damage rolls made with it. The pestle has 12 charges. When you hit with a melee attack using the pestle, you can expend up to 3 of its charges to deal an extra 1d8 force damage for each charge expended. The pestle regains all expended charges daily at dawn."
    },
    {
      "name": "Bigby's Beneficent Bracelet",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This gorgeous jewelry piece, crafted by the wizard Bigby himself, consists of four gold rings attached via delicate chains to a wrist cuff studded with sapphires and diamonds. Random Properties: The bracelet has the following random properties, determined by rolling on the appropriate table in the Dungeon Master's Guide: 1 Artifact Properties; Minor Beneficial Properties property 1 Artifact Properties; Major Beneficial Properties property 1 Artifact Properties; Minor Detrimental Properties property Dexterous Fingers: While wearing the bracelet, you can cast mage hand. Force Sculpture: By focus"
    },
    {
      "name": "Blackrazor",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Hidden in the dungeon of White Plume Mountain, Blackrazor shines like a piece of night sky filled with stars. Its black scabbard is decorated with pieces of cut obsidian. You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. If you hit an Undead with this weapon, you take 1d10 Necrotic damage, and the target regains 1d10 Hit Points. If this Necrotic damage reduces you to 0 Hit Points, Blackrazor devours your soul (see \"Devour Soul\" below). While you hold this weapon, you have Immunity to the Charmed and Frightened conditions, and you have Blindsight with a range of "
    },
    {
      "name": "Book of Exalted Deeds",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement (by a creature of good alignment)",
      "desc": "The definitive treatise on all that is good in the multiverse, the fabled Book of Exalted Deeds figures prominently in many religions. Rather than being a scripture devoted to a particular faith, the book's various authors filled the pages with their own vision of true virtue, providing guidance for defeating evil. The Book of Exalted Deeds rarely lingers in one place. As soon as the book is read, it vanishes to some other corner of the multiverse where its moral guidance can bring light to a darkened world. Although attempts have been made to copy the work, efforts to do so fail to capture it"
    },
    {
      "name": "Book of Exalted Deeds",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The definitive treatise on all that is good in the multiverse, the Book of Exalted Deeds figures prominently in many religions. Rather than being a scripture devoted to a particular faith, the book's authors filled the pages with their own visions of true virtue, providing guidance for defeating evil. The Book of Exalted Deeds rarely lingers in one place. As soon as the book is read, it vanishes to some other corner of the multiverse where its moral guidance can bring hope to an endangered world. Although attempts have been made to copy the work, efforts to do so fail to capture its magical na"
    },
    {
      "name": "Book of Vile Darkness",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The contents of this foul manuscript of ineffable wickedness are the meat and drink of those in evil's thrall. No mortal was meant to know the secrets it contains, knowledge so horrid that to even glimpse the scrawled pages invites madness. Most believe the lich-god Vecna authored the Book of Vile Darkness. He recorded in its pages every diseased idea, every unhinged thought, and every example of blackest magic he came across or devised. Vecna covered every vile topic he could, making the book a gruesome catalog of all mortal wrongs. Other practitioners of evil have held the book and added the"
    },
    {
      "name": "Book of Vile Darkness",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The contents of this foul manuscript are the meat and drink of the wicked. It contains knowledge so horrid that to even glimpse the scrawled pages invites doom. Most believe the lich-god Vecna authored the Book of Vile Darkness. He recorded in its pages every horrid idea, every corrupt thought, and every example of foul magic he came across or devised. Other practitioners of evil have added their own input to the book's catalog of vile knowledge. Their additions are clear, for the writers of later works stitched whatever they were writing into the tome or, in some cases, made notations and add"
    },
    {
      "name": "Crook of Rao",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Ages ago, the serene god Rao created a tool to shield his fledgling faithful against the evils of the Lower Planes. Yet, as eons passed, mortals developed their own methods of dealing with existential threats, and the crook was largely forgotten. In recent ages, though, the Crook of Rao was rediscovered and leveraged against the rising power of the Witch Queen Iggwilv (one of the names of the wizard Tasha). Although she was defeated, Iggwilv managed to damage the crook during the battle, infecting it with an insidious curse-and the potential for future victory. In the aftermath, the crook was "
    },
    {
      "name": "Demonomicon of Iggwilv",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "An expansive treatise documenting the Abyss's infinite layers and inhabitants, the Demonomicon of Iggwilv is the most thorough and blasphemous tome of demonology in the multiverse. The tome recounts both the oldest and most current profanities of the Abyss and demons. Demons have attempted to censor the text, and while sections have been ripped from the book's spine, the general chapters remain, ever revealing demonic secrets. And the book holds more than blasphemies. Caged behind lines of script roils a secret piece of the Abyss itself, which keeps the book up-to-date, no matter how many page"
    },
    {
      "name": "Demonomicon of Iggwilv",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This treatise, composed by Iggwilv the archmage, documents the Abyss's layers and inhabitants and is widely regarded as the most thorough and blasphemous tome of demonology in the multiverse. The tome recounts both the oldest and most current profanities of the Abyss and demons. Demons have attempted to censor the text, and while sections have been ripped from the book's spine, the general chapters remain, ever revealing demonic secrets. Caged behind lines of script roils a secret piece of the Abyss itself, which keeps the book up-to-date, no matter how many pages are removed, and it longs to "
    },
    {
      "name": "Eye of Vecna",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Seldom is the name of Vecna spoken except in a hushed voice. Vecna was, in his time, one of the mightiest of all wizards. Through dark magic and conquest, he forged a terrible empire. For all his power, Vecna couldn't escape his own mortality. He began to fear death and take steps to prevent his end from ever coming about. Orcus, the demon prince of undeath, taught Vecna a ritual that would allow him to live on as a lich. Beyond death, he became the greatest of all liches. Even though his body gradually withered and decayed, Vecna continued to expand his evil dominion. So formidable and hideou"
    },
    {
      "name": "Eye of Vecna",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Vecna was a mighty wizard who, through magic and conquest, forged a terrible empire. For all his power, however, Vecna feared death and took steps to prevent his demise by becoming a lich. A treacherous lieutenant named Kas brought Vecna's rule to an end in a terrible battle. Of Vecna, all that remained were one hand and one eye, grisly Artifacts that still seek to work Vecna's will in the world. The Eye of Vecna and the Hand of Vecna are separate Artifacts that might be found together or separately. The eye looks like a bloodshot organ torn free from the socket. The hand is a shriveled left e"
    },
    {
      "name": "Hand of Vecna",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Seldom is the name of Vecna spoken except in a hushed voice. Vecna was, in his time, one of the mightiest of all wizards. Through dark magic and conquest, he forged a terrible empire. For all his power, Vecna couldn't escape his own mortality. He began to fear death and take steps to prevent his end from ever coming about. Orcus, the demon prince of undeath, taught Vecna a ritual that would allow him to live on as a lich. Beyond death, he became the greatest of all liches. Even though his body gradually withered and decayed, Vecna continued to expand his evil dominion. So formidable and hideou"
    },
    {
      "name": "Hand of Vecna",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Vecna was a mighty wizard who, through magic and conquest, forged a terrible empire. For all his power, however, Vecna feared death and took steps to prevent his demise by becoming a lich. A treacherous lieutenant named Kas brought Vecna's rule to an end in a terrible battle. Of Vecna, all that remained were one hand and one eye, grisly Artifacts that still seek to work Vecna's will in the world. The Eye of Vecna and the Hand of Vecna are separate Artifacts that might be found together or separately. The eye looks like a bloodshot organ torn free from the socket. The hand is a shriveled left e"
    },
    {
      "name": "Helm of Perfect Potential",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "This copper-hued helm contains a shard of the Elemental Chaos embedded in its forehead, surrounded by a motif of a rising sun. Legend says Annam fashioned this helm for his daughter Diancastra to hold the fragment of chaos she used to prove her worth to her father. Random Properties: The helm has the following random properties, determined by rolling on the appropriate table in the Dungeon Master's Guide: 2 Artifact Properties; Minor Beneficial Properties properties 1 Artifact Properties; Major Beneficial Properties property 1 Artifact Properties; Minor Detrimental Properties property Master o"
    },
    {
      "name": "Luba's Tarokka of Souls",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Not all lingering spirits are tragic souls, lost on their way to the hereafter. Some languish as prisoners, souls so wicked mortals dare not free them upon an unsuspecting afterlife. Created by a figure of Vistani legend, Luba's Tarokka of Souls shaped the destiny of countless heroes. The prophecies of this deck of cards also revealed great evils and guided its creator into the path of nefarious forces. Untold times the deck's creator, Mother Luba, narrowly escaped doom, spared only by her keen insights. But even for her, not all wickedness could be escaped. In the most dire cases, Mother Luba"
    },
    {
      "name": "Mighty Servant of Leuk-o",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Named for the warlord who infamously employed it, the Mighty Servant of Leuk-o is a fantastically powerful, 10-foot-tall machine that turns into an animate construct when piloted. Crafted of a gleaming black alloy of unknown origin, the servant is often described as a combination of a disproportioned dwarf and an oversized beetle. The servant contains enough space for 1 ton of cargo and a crew compartment within, from which up to two Medium creatures can control it-and potentially execute a spree of unstoppable destruction. Tales of the servant's origins involve more conjecture than fact, ofte"
    },
    {
      "name": "Orb of Dragonkind",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Ages past, on the world of Krynn, elves and humans waged a terrible war against evil dragons. When the world seemed doomed, the wizards of the Towers of High Sorcery came together and worked their greatest magic, forging five Orbs of Dragonkind (or Dragon Orbs) to help them defeat the dragons. One orb was taken to each of the five towers, and there they were used to speed the war toward a victorious end. The wizards used the orbs to lure dragons to them, then destroyed the dragons with powerful magic. As the Towers of High Sorcery fell in later ages, the orbs were destroyed or faded into legen"
    },
    {
      "name": "Orb of Dragonkind",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "Long ago, in the Dragonlance setting, elves and humans waged a terrible war against chromatic dragons. When the world seemed doomed, the wizards of the Towers of High Sorcery came together and forged five Orbs of Dragonkind to help defeat the dragons. One orb was taken to each of the five towers, and there they were used to speed the war toward a victorious end. The wizards used the orbs to lure dragons to them, then destroyed the dragons with powerful magic. As the Towers of High Sorcery fell in later ages, the orbs were destroyed or faded into legend, and only three are thought to survive. T"
    },
    {
      "name": "Sword of Kas",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "When Vecna grew in power, he appointed an evil and ruthless lieutenant, Kas the Bloody Handed, to act as his bodyguard and right hand. This despicable villain served as advisor, warlord, and assassin. His successes earned him Vecna's admiration and a reward: a sword with as dark a pedigree as the man who would wield it. For a long time, Kas faithfully served the lich but as Kas's power grew, so did his hubris. His sword urged him to supplant Vecna, so that they could rule the lich empire in Vecna's stead. Legend says Vecna's destruction came at Kas's hand, but Vecna also wrought his rebellious"
    },
    {
      "name": "Sword of Kas",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Kas was a powerful warrior who served Vecna and whose loyalty was rewarded with this sword. As Kas's power grew, so did his hubris. The sword urged Kas to destroy Vecna and usurp his throne. Legend says Vecna's destruction came at Kas's hand, but Vecna also wrought his rebellious lieutenant's doom, leaving only Kas's sword behind. Bloodthirst: The sword thirsts for blood. If the sword doesn't taste blood on its blade within 1 minute of being drawn from its scabbard, its wielder makes a 15 Charisma saving throw. On a successful save, the wielder takes 3d6 Psychic damage. On a failed save, the w"
    },
    {
      "name": "Teeth of Dahlver-Nar",
      "source": "Tasha's",
      "source_key": "TCE",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Wondrous Item",
      "attunement": "requires attunement",
      "desc": "The Teeth of Dahlver-Nar are stories given form. They are a collection of teeth, each suggestive of wildly different origins and made from various materials. The collection rests within a leather pouch, stitched with images of heroes and whimsical creatures. Where the teeth fall, they bring legends to life. Using the Teeth: While you are holding the pouch, you can use an action to draw one tooth. Roll on the Teeth of Dahlver-Nar table to determine which tooth you draw, and you can either sow the tooth or implant it (both of which are described later). If you don't sow or implant the tooth, rol"
    },
    {
      "name": "Wand of Orcus",
      "source": "DMG",
      "source_key": "DMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "The ghastly Wand of Orcus rarely leaves Orcus side. The device, as evil as its creator, shares the demon lord's aims to snuff out the lives of all living things and bind the Material Plane in the stasis of undeath. Orcus allows the wand to slip from his grasp from time to time. When it does, it magically appears wherever its master senses an opportunity to achieve some fell goal. Made from bones as hard as iron, the wand is topped with a magically enlarged skull that once belonged to a human hero slain by Orcus. The wand can magically change in size to better conform to the grip of its user. P"
    },
    {
      "name": "Wand of Orcus",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Crafted and wielded by Orcus, this ghastly wand slips from the demon lord's grasp from time to time. When it does, it magically appears wherever the demon lord senses an opportunity to achieve some fell goal. The wand is topped with a skull that once belonged to a human hero slain by Orcus. The wand can magically change in size to better conform to the grip of its user. All Holy Water within 10 feet of the wand is destroyed. Any creature besides Orcus that tries to attune to the wand makes a 17 Constitution saving throw. On a successful save, the creature takes 10d6 Necrotic damage. On a faile"
    },
    {
      "name": "Wave",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement",
      "desc": "Held in the dungeon of White Plume Mountain, Wave is engraved with images of waves, shells, and sea creatures. You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you roll a 20 on the d20 for an attack roll with this weapon, the target takes an extra 21 Necrotic damage. While holding Wave, you gain the following benefits: You have Advantage on Initiative rolls. A bubble of air forms around your head while you are underwater, allowing you to breathe normally in that environment. Aquatic Command: Wave has 3 charges and regains 1d3 expended charges daily at dawn"
    },
    {
      "name": "Whelm",
      "source": "XDMG",
      "source_key": "XDMG",
      "rarity": "artifact",
      "rarity_order": 5,
      "type": "Item",
      "attunement": "requires attunement (by a dwarf or a creature attuned to a belt of dwarvenkind)",
      "desc": "Whelm is a powerful weapon forged by dwarves and lost in the dungeon of White Plume Mountain. You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. Hurl: Whelm has T with a normal range of 60 feet and a long range of 180 feet. When you hit with a ranged attack roll using Whelm, the target takes an extra 1d8 Force damage, or an extra 4d8 Force damage if the target is a Construct, an Elemental, or a Giant. Immediately after hitting or missing, the weapon flies back to your hand. Shock Wave: You can take a Magic action to strike the ground with Whelm and send a shock w"
    },
    {
      "name": "Horizon Puzzle Cube",
      "source": "Bigby's",
      "source_key": "BGG",
      "rarity": "unknown (magic)",
      "rarity_order": 7,
      "type": "Wondrous Item",
      "attunement": "",
      "desc": "A Horizon puzzle cube is an 8-inch magical cube made of gold, iron, crystal, and copper, and it is worth 5,000 gp to a sage or collector. A functioning puzzle cube can be solved with 30 minutes of work and a successful 25 Intelligence (Investigation) check. When the cube is solved, a 30-foot-diameter portal appears before the creature who solved the cube, leading to the northeastern platform of Horizon's Edge. The portal is two-way and remains open for 10 minutes or until a creature uses an action to change the puzzle's configuration. Puzzle cubes don't function while on Horizon's Edge, but a "
    }
  ]
};
