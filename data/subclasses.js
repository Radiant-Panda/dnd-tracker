/**
 * D&D Subclass Data — generated from 5etools source
 * Covers PHB 2024, PHB 2014, XGE, TCE, and more
 */

const SUBCLASS_DATA = {
  "Barbarian": {
    "Path of the Berserker": {
      "name": "Path of the Berserker",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Path of the Berserker",
          "level": 3,
          "description": "Channel Rage into Violent Fury Barbarians who walk the Path of the Berserker direct their Rage primarily toward violence. Their path is one of untrammeled fury, and they thrill in the chaos of battle as they allow their Rage to seize and empower them.",
          "resource": null
        },
        {
          "name": "Frenzy",
          "level": 3,
          "description": "If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. To determine the extra damage, roll a number of d6s equal to your Rage Damage bonus, and add them together. The damage has the same type as the weapon or Unarmed Strike used for the attack.",
          "resource": null
        },
        {
          "name": "Mindless Rage",
          "level": 6,
          "description": "You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you're Charmed or Frightened when you enter your Rage, the condition ends on you.",
          "resource": {
            "name": "Rage",
            "maxFormula": "rage_uses",
            "die": null,
            "recharge": "long"
          }
        },
        {
          "name": "Retaliation",
          "level": 10,
          "description": "When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature, using a weapon or an Unarmed Strike.",
          "resource": null
        },
        {
          "name": "Intimidating Presence",
          "level": 14,
          "description": "As a Bonus Action, you can strike terror into others with your menacing presence and primal power. When you do so, each creature of your choice in a 30-foot Emanation [Area of Effect] originating from you must make a Wisdom saving throw (8 plus your Strength modifier and Proficiency). On a failed save, a creature has the Frightened condition for 1 minute. At the end of each of the Frightened creature's turns, the creature repeats the save, ending the effect on itself on a success. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a use of your Rage (no action required) to restore your use of it.",
          "resource": null
        }
      ]
    },
    "Path of the Totem Warrior": {
      "name": "Path of the Totem Warrior",
      "source": "PHB 2014",
      "features": [
        {
          "name": "Bear",
          "level": 3,
          "description": "While raging, you have resistance to all damage except psychic damage. The spirit of the bear makes you tough enough to stand up to any punishment.",
          "resource": null
        },
        {
          "name": "Eagle",
          "level": 3,
          "description": "While you're raging and aren't wearing heavy armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash action as a bonus action on your turn. The spirit of the eagle makes you into a predator who can weave through the fray with ease.",
          "resource": null
        },
        {
          "name": "Elk",
          "level": 3,
          "description": "While you're raging and aren't wearing heavy armor, your walking speed increases by 15 feet. The spirit of the elk makes you extraordinarily swift.",
          "resource": null
        },
        {
          "name": "Path of the Totem Warrior",
          "level": 3,
          "description": "The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration. In battle, your totem spirit fills you with supernatural might, adding magical fuel to your barbarian rage. Most barbarian tribes consider a totem animal to be kin to a particular clan. In such cases, it is unusual for an individual to have more than one totem animal spirit, though exceptions exist.",
          "resource": null
        },
        {
          "name": "Tiger",
          "level": 3,
          "description": "While raging, you can add 10 feet to your long jump distance and 3 feet to your high jump distance. The spirit of the tiger empowers your leaps.",
          "resource": null
        },
        {
          "name": "Wolf",
          "level": 3,
          "description": "While you're raging, your friends have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you. The spirit of the wolf makes you a leader of hunters.",
          "resource": null
        },
        {
          "name": "Spirit Seeker",
          "level": 3,
          "description": "Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts. At 3rd level when you adopt this path, you gain the ability to cast the beast sense and speak with animals spells, but only as rituals, as described in .",
          "resource": null
        },
        {
          "name": "Totem Spirit",
          "level": 3,
          "description": "At 3rd level, when you adopt this path, you choose a totem spirit and gain its feature. You must make or acquire a physical totem object—an amulet or similar adornment—that incorporates fur or feathers, claws, teeth, or bones of the totem animal. At your option, you also gain minor physical attributes that are reminiscent of your totem spirit. For example, if you have a bear totem spirit, you might be unusually hairy and thick-skinned, or if your totem is the eagle, your eyes turn bright yellow. Your totem animal might be an animal related to those listed here but more appropriate to your homeland. For example, you could choose a hawk or vulture in place of an eagle.",
          "resource": null
        },
        {
          "name": "Aspect of the Beast",
          "level": 6,
          "description": "At 6th level, you gain a magical benefit based on the totem animal of your choice. You can choose the same animal you selected at 3rd level or a different one.",
          "resource": null
        },
        {
          "name": "Spirit Walker",
          "level": 10,
          "description": "At 10th level, you can cast the commune with nature spell, but only as a ritual. When you do so, a spiritual version of one of the animals you chose for Totem Spirit or Aspect of the Beast appears to you to convey the information you seek.",
          "resource": null
        },
        {
          "name": "Totemic Attunement",
          "level": 14,
          "description": "At 14th level, you gain a magical benefit based on a totem animal of your choice. You can choose the same animal you selected previously or a different one.",
          "resource": null
        }
      ]
    },
    "Path of the Battlerager": {
      "name": "Path of the Battlerager",
      "source": "Sword Coast Guide",
      "features": [
        {
          "name": "Path of the Battlerager",
          "level": 3,
          "description": "Known as Kuldjargh (literally \"axe idiot\") in Dwarvish, battleragers are dwarf followers of the gods of war and take the Path of the Battlerager. They specialize in wearing bulky, spiked armor and throwing themselves into combat, striking with their body itself and giving themselves over to the fury of battle.",
          "resource": {
            "name": "Rage",
            "maxFormula": "rage_uses",
            "die": null,
            "recharge": "long"
          }
        },
        {
          "name": "Battlerager Armor",
          "level": 3,
          "description": "When you choose this path at 3rd level, you gain the ability to use spiked armor as a weapon. While you are wearing spiked armor and are raging, you can use a bonus action to make one melee weapon attack with your armor spikes at a target within 5 feet of you. If the attack hits, the spikes deal 1d4 piercing damage. You use your Strength modifier for the attack and damage rolls. Additionally, when you use the Attack action to grapple a creature, the target takes 3 piercing damage if your grapple check succeeds.",
          "resource": {
            "name": "Rage",
            "maxFormula": "rage_uses",
            "die": null,
            "recharge": "long"
          }
        },
        {
          "name": "Restriction—Dwarves Only",
          "level": 3,
          "description": "Only dwarves can follow the Path of the Battlerager. The battlerager fills a particular niche in dwarven society and culture. Your DM can lift this restriction to better suit the campaign. The restriction exists for the Forgotten Realms. It might not apply to your DM's setting or your DM's version of the Realms.",
          "resource": null
        },
        {
          "name": "Reckless Abandon",
          "level": 6,
          "description": "Beginning at 6th level, when you use Reckless Attack while raging, you also gain temporary hit points equal to your Constitution modifier (minimum of 1). They vanish if any of them are left when your rage ends.",
          "resource": null
        },
        {
          "name": "Battlerager Charge",
          "level": 10,
          "description": "Beginning at 10th level, you can take the Dash action as a bonus action while you are raging.",
          "resource": {
            "name": "Rage",
            "maxFormula": "rage_uses",
            "die": null,
            "recharge": "long"
          }
        },
        {
          "name": "Spiked Retribution",
          "level": 14,
          "description": "Starting at 14th level, when a creature within 5 feet of you hits you with a melee attack, the attacker takes 3 piercing damage if you are raging, aren't incapacitated, and are wearing spiked armor.",
          "resource": null
        }
      ]
    },
    "Path of the Ancestral Guardian": {
      "name": "Path of the Ancestral Guardian",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Path of the Ancestral Guardian",
          "level": 3,
          "description": "Some barbarians hail from cultures that revere their ancestors. These tribes teach that the warriors of the past linger in the world as mighty spirits, who can guide and protect the living. When a barbarian who follows this path rages, the barbarian contacts the spirit world and calls on these guardian spirits for aid. Barbarians who draw on their ancestral guardians can better fight to protect their tribes and their allies. In order to cement ties to their ancestral guardians, barbarians who follow this path cover themselves in elaborate tattoos that celebrate their ancestors' deeds. These tattoos tell sagas of victories against terrible monsters and other fearsome rivals.",
          "resource": null
        },
        {
          "name": "Ancestral Protectors",
          "level": 3,
          "description": "Starting when you choose this path at 3rd level, spectral warriors appear when you enter your rage. While you're raging, the first creature you hit with an attack on your turn becomes the target of the warriors, which hinder its attacks. Until the start of your next turn, that target has disadvantage on any attack roll that isn't against you, and when the target hits a creature other than you with an attack, that creature has resistance to the damage dealt by the attack. The effect on the target ends early if your rage ends.",
          "resource": null
        },
        {
          "name": "Spirit Shield",
          "level": 6,
          "description": "Beginning at 6th level, the guardian spirits that aid you can provide supernatural protection to those you defend. If you are raging and another creature you can see within 30 feet of you takes damage, you can use your reaction to reduce that damage by 2d6. When you reach certain levels in this class, you can reduce the damage by more: by 3d6 at 10th level and by 4d6 at 14th level.",
          "resource": null
        },
        {
          "name": "Consult the Spirits",
          "level": 10,
          "description": "At 10th level, you gain the ability to consult with your ancestral spirits. When you do so, you cast the augury or clairvoyance spell, without using a spell slot or material components. Rather than creating a spherical sensor, this use of clairvoyance invisibly summons one of your ancestral spirits to the chosen location. Wisdom is your spellcasting ability for these spells. After you cast either spell in this way, you can't use this feature again until you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Vengeful Ancestors",
          "level": 14,
          "description": "At 14th level, your ancestral spirits grow powerful enough to retaliate. When you use your Spirit Shield to reduce the damage of an attack, the attacker takes an amount of force damage equal to the damage that your Spirit Shield prevents.",
          "resource": null
        }
      ]
    },
    "Path of the Storm Herald": {
      "name": "Path of the Storm Herald",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Desert",
          "level": 3,
          "description": "When this effect is activated, all other creatures in your aura take 2 fire damage each. The damage increases when you reach certain levels in this class, increasing to 3 at 5th level, 4 at 10th level, 5 at 15th level, and 6 at 20th level.",
          "resource": null
        },
        {
          "name": "Path of the Storm Herald",
          "level": 3,
          "description": "All barbarians harbor a fury within. Their rage grants them superior strength, durability, and speed. Barbarians who follow the Path of the Storm Herald learn to transform that rage into a mantle of primal magic, which swirls around them. When in a fury, a barbarian of this path taps into the forces of nature to create powerful magical effects. Storm heralds are typically elite champions who train alongside druids, rangers, and others sworn to protect nature. Other storm heralds hone their craft in lodges in regions wracked by storms, in the frozen reaches at the world's end, or deep in the hottest deserts.",
          "resource": null
        },
        {
          "name": "Sea",
          "level": 3,
          "description": "When this effect is activated, you can choose one other creature you can see in your aura. The target must make a Dexterity saving throw. The target takes 1d6 lightning damage on a failed save, or half as much damage on a successful one. The damage increases when you reach certain levels in this class, increasing to 2d6 at 10th level, 3d6 at 15th level, and 4d6 at 20th level.",
          "resource": null
        },
        {
          "name": "Tundra",
          "level": 3,
          "description": "When this effect is activated, each creature of your choice in your aura gains 2 temporary hit points, as icy spirits inure it to suffering. The temporary hit points increase when you reach certain levels in this class, increasing to 3 at 5th level, 4 at 10th level, 5 at 15th level, and 6 at 20th level.",
          "resource": null
        },
        {
          "name": "Storm Aura",
          "level": 3,
          "description": "Starting at 3rd level, you emanate a stormy, magical aura while you rage. The aura extends 10 feet from you in every direction, but not through Cover. Your aura has an effect that activates when you enter your rage, and you can activate the effect again on each of your turns as a bonus action. Choose desert, sea, or tundra. Your aura's effect depends on that chosen environment, as detailed below. You can change your environment choice whenever you gain a level in this class. If your aura's effects require a saving throw, the DC equals 8 + your proficiency bonus + your Constitution modifier.",
          "resource": null
        },
        {
          "name": "Storm Soul",
          "level": 6,
          "description": "At 6th level, the storm grants you benefits even when your aura isn't active. The benefits are based on the environment you chose for your Storm Aura.",
          "resource": null
        },
        {
          "name": "Shielding Storm",
          "level": 10,
          "description": "At 10th level, you learn to use your mastery of the storm to protect others. Each creature of your choice has the damage resistance you gained from the Storm Soul feature while the creature is in your Storm Aura.",
          "resource": null
        },
        {
          "name": "Raging Storm",
          "level": 14,
          "description": "At 14th level, the power of the storm you channel grows mightier, lashing out at your foes. The effect is based on the environment you chose for your Storm Aura.",
          "resource": null
        }
      ]
    },
    "Path of the Zealot": {
      "name": "Path of the Zealot",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Path of the Zealot",
          "level": 3,
          "description": "Rage in Ecstatic Union with a God Barbarians who walk the Path of the Zealot receive boons from a god or pantheon. These Barbarians experience their Rage as an ecstatic episode of divine union that infuses them with power. They are often allies to the priests and other followers of their god or pantheon.",
          "resource": null
        },
        {
          "name": "Divine Fury",
          "level": 3,
          "description": "You can channel divine power into your strikes. On each of your turns while your Rage is active, the first creature you hit with a weapon or an Unarmed Strike takes extra damage equal to 1d6 plus half your Barbarian level (round down). The extra damage is Necrotic or Radiant; you choose the type each time you deal the damage.",
          "resource": null
        },
        {
          "name": "Warrior of the Gods",
          "level": 3,
          "description": "A divine entity helps ensure you can continue the fight. You have a pool of four d12s that you can spend to heal yourself. As a Bonus Action, you can expend dice from the pool, roll them, and regain a number of Hit Points equal to the roll's total. Your pool regains all expended dice when you finish a Long Rest. The pool's maximum number of dice increases by one when you reach Barbarian levels 6 (5 dice), 12 (6 dice), and 17 (7 dice).",
          "resource": null
        },
        {
          "name": "Fanatical Focus",
          "level": 6,
          "description": "Once per active Rage, if you fail a saving throw, you can reroll it with a bonus equal to your Rage Damage bonus, and you must use the new roll.",
          "resource": null
        },
        {
          "name": "Zealous Presence",
          "level": 10,
          "description": "As a Bonus Action, you unleash a battle cry infused with divine energy. Up to ten other creatures of your choice within 60 feet of you gain Advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a use of your Rage (no action required) to restore your use of it.",
          "resource": null
        },
        {
          "name": "Rage of the Gods",
          "level": 14,
          "description": "When you activate your Rage, you can assume the form of a divine warrior. This form lasts for 1 minute or until you drop to 0 Hit Points. Once you use this feature, you can't do so again until you finish a Long Rest. While in this form, you gain the benefits below. Flight: You have a Fly Speed equal to your Speed and can hover. Resistance: You have Resistance to Necrotic, Psychic, and Radiant damage. Revivification: When a creature within 30 feet of you would drop to 0 Hit Points, you can take a Reaction to expend a use of your Rage to instead change the target's Hit Points to a number equal to your Barbarian level.",
          "resource": {
            "name": "Rage",
            "maxFormula": "rage_uses",
            "die": null,
            "recharge": "long"
          }
        }
      ]
    },
    "Path of the Beast": {
      "name": "Path of the Beast",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Path of the Beast",
          "level": 3,
          "description": "Barbarians who walk the Path of the Beast draw their rage from a bestial spark burning within their souls. That beast bursts forth in the throes of rage, physically transforming the barbarian. Such a barbarian might be inhabited by a primal spirit or be descended from shape-shifters. You can choose the origin of your feral might or determine it by rolling on the Origin of the Beast table.",
          "resource": null
        },
        {
          "name": "Form of the Beast",
          "level": 3,
          "description": "3rd-level Path of the Beast feature When you enter your rage, you can transform, revealing the bestial power within you. Until the rage ends, you manifest a natural weapon. It counts as a simple melee weapon for you, and you add your Strength modifier to the attack and damage rolls when you attack with it, as normal. You choose the weapon's form each time you rage:",
          "resource": null
        },
        {
          "name": "Bestial Soul",
          "level": 6,
          "description": "6th-level Path of the Beast feature The feral power within you increases, causing the natural weapons of your Form of the Beast to count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. You can also alter your form to help you adapt to your surroundings. When you finish a short or long rest, choose one of the following benefits, which lasts until you finish your next short or long rest: You gain a swimming speed equal to your walking speed, and you can breathe underwater. You gain a climbing speed equal to your walking speed, and you can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check. Whe",
          "resource": null
        },
        {
          "name": "Infectious Fury",
          "level": 10,
          "description": "10th-level Path of the Beast feature When you hit a creature with your natural weapons while you are raging, the beast within you can curse your target with rabid fury. The target must succeed on a Wisdom saving throw (DC equal to 8 + your Constitution modifier + your proficiency bonus) or suffer one of the following effects (your choice): The target must use its reaction to make a melee attack against another creature of your choice that you can see. The target takes 2d12 psychic damage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": {
            "name": "Infectious Fury",
            "maxFormula": "proficiency",
            "die": null,
            "recharge": "long"
          }
        },
        {
          "name": "Call the Hunt",
          "level": 14,
          "description": "14th-level Path of the Beast feature The beast within you grows so powerful that you can spread its ferocity to others and gain resilience from them joining your hunt. When you enter your rage, you can choose a number of other willing creatures you can see within 30 feet of you equal to your Constitution modifier (minimum of one creature). You gain 5 temporary hit points for each creature that accepts this feature. Until the rage ends, the chosen creatures can each use the following benefit once on each of their turns: when the creature hits a target with an attack roll and deals damage to it, the creature can roll a d6 and gain a bonus to the damage equal to the number rolled. You can use t",
          "resource": null
        }
      ]
    },
    "Path of Wild Magic": {
      "name": "Path of Wild Magic",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Path of Wild Magic",
          "level": 3,
          "description": "Many places in the multiverse abound with beauty, intense emotion, and rampant magic; the Feywild, the Upper Planes, and other realms of supernatural power radiate with such forces and can profoundly influence people. As folk of deep feeling, barbarians are especially susceptible to these wild influences, with some barbarians being transformed by the magic. These magic-suffused barbarians walk the Path of Wild Magic. Elf, tiefling, aasimar, and genasi barbarians often seek this path, eager to manifest the otherworldly magic of their ancestors.",
          "resource": null
        },
        {
          "name": "Magic Awareness",
          "level": 3,
          "description": "3rd-level Path of Wild Magic feature As an action, you can open your awareness to the presence of concentrated magic. Until the end of your next turn, you know the location of any spell or magic item within 60 feet of you that isn't behind Cover. When you sense a spell, you learn which school of magic it belongs to. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Wild Surge",
          "level": 3,
          "description": "3rd-level Path of Wild Magic feature The magical energy roiling inside you sometimes erupts from you. When you enter your rage, roll on the Wild Magic table to determine the magical effect produced. If the effect requires a saving throw, the DC equals 8 + your proficiency bonus + your Constitution modifier.",
          "resource": null
        },
        {
          "name": "Bolstering Magic",
          "level": 6,
          "description": "6th-level Path of Wild Magic feature You can harness your wild magic to bolster yourself or a companion. As an action, you can touch one creature (which can be yourself) and confer one of the following benefits of your choice to that creature: For 10 minutes, the creature can roll a d3 whenever making an attack roll or an ability check and add the number rolled to the d20 roll. Roll a d3. The creature regains one expended spell slot, the level of which equals the number rolled or lower (the creature's choice). Once a creature receives this benefit, that creature can't receive it again until after a long rest. You can take this action a number of times equal to your proficiency bonus, and you",
          "resource": null
        },
        {
          "name": "Unstable Backlash",
          "level": 10,
          "description": "10th-level Path of Wild Magic feature When you are imperiled during your rage, the magic within you can lash out; immediately after you take damage or fail a saving throw while raging, you can use your reaction to roll on the Wild Magic table and immediately produce the effect rolled. This effect replaces your current Wild Magic effect.",
          "resource": null
        },
        {
          "name": "Controlled Surge",
          "level": 14,
          "description": "14th-level Path of Wild Magic feature Whenever you roll on the Wild Magic table, you can roll the die twice and choose which of the two effects to unleash. If you roll the same number on both dice, you can ignore the number and choose any effect on the table.",
          "resource": null
        }
      ]
    },
    "Path of the Giant": {
      "name": "Path of the Giant",
      "source": "Bigby's Giants",
      "features": [
        {
          "name": "Giant Power",
          "level": 3,
          "description": "3rd-Level Path of the Giant Feature When you choose this path, you learn to speak, read, and write Giant or one other language of your choice if you already know Giant. Additionally, you learn a cantrip of your choice: either druidcraft or thaumaturgy. Wisdom is your spellcasting ability for this spell.",
          "resource": null
        },
        {
          "name": "Giant's Havoc",
          "level": 3,
          "description": "3rd-Level Path of the Giant Feature Your rages pull strength from the primal might of giants, transforming you into a hulking force of destruction. While raging, you gain the following benefits:",
          "resource": null
        },
        {
          "name": "Path of the Giant",
          "level": 3,
          "description": "Barbarians who walk the Path of the Giant draw strength from the same primal forces as giants. As they rage, these barbarians surge with elemental power and grow in size, taking on forms that evoke the glory of giants. Some barbarians look like oversized versions of themselves, perhaps with a hint of elemental energy flaring in their eyes and around their weapons. Others transform more dramatically, taking on the appearance of an actual giant or a form similar to an Elemental, wreathed in fire, frost, or lightning.",
          "resource": null
        },
        {
          "name": "Elemental Cleaver",
          "level": 6,
          "description": "6th-Level Path of the Giant Feature Your bond with the elemental might of giants grows, and you learn to infuse weapons with primordial energy. When you enter your rage, you can choose one weapon that you are holding and infuse it with one of the following damage types: acid, cold, fire, thunder, or lightning. While you wield the infused weapon during your rage, the weapon's damage type changes to the chosen type, it deals an extra 1d6 damage of the chosen type when it hits, and it gains the thrown property, with a normal range of 20 feet and a long range of 60 feet. If you throw the weapon, it reappears in your hand the instant after it hits or misses a target. The infused weapon's benefits",
          "resource": null
        },
        {
          "name": "Mighty Impel",
          "level": 10,
          "description": "10th-Level Path of the Giant Feature Your connection to giant strength allows you to hurl both allies and enemies on the battlefield. As a bonus action while raging, you can choose one Medium or smaller creature within your reach and move it to an unoccupied space you can see within 30 feet of yourself. An unwilling creature must succeed on a Strength saving throw (DC equals 8 + your proficiency bonus + your Strength modifier) to avoid the effect. If, at the end of this movement, the thrown creature isn't on a surface or liquid that can support it, the creature falls, taking damage as normal and landing prone.",
          "resource": null
        },
        {
          "name": "Demiurgic Colossus",
          "level": 14,
          "description": "14th-Level Path of the Giant Feature The primordial power of your rage intensifies. When you rage, your reach increases by 10 feet, your size can increase to Large or Huge (your choice), and you can use your Mighty Impel to move creatures that are Large or smaller. In addition, the extra damage dealt by your Elemental Cleaver feature increases to 2d6.",
          "resource": null
        }
      ]
    },
    "Path of the Wild Heart": {
      "name": "Path of the Wild Heart",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Path of the Wild Heart",
          "level": 3,
          "description": "Walk in Community with the Animal World Barbarians who follow the Path of the Wild Heart view themselves as kin to animals. These Barbarians learn magical means to communicate with animals, and their Rage heightens their connection to animals as it fills them with supernatural might.",
          "resource": null
        },
        {
          "name": "Animal Speaker",
          "level": 3,
          "description": "You can cast the Beast Sense and Speak with Animals spells but only as Rituals. Wisdom is your spellcasting ability for them.",
          "resource": null
        },
        {
          "name": "Rage of the Wilds",
          "level": 3,
          "description": "Your Rage taps into the primal power of animals. Whenever you activate your Rage, you gain one of the following options of your choice. Bear: While your Rage is active, you have Resistance to every damage type except Force, Necrotic, Psychic, and Radiant. Eagle: When you activate your Rage, you can take the Disengage and Dash actions as part of that Bonus Action. While your Rage is active, you can take a Bonus Action to take both of those actions. Wolf: While your Rage is active, your allies have Advantage on attack rolls against any enemy of yours within 5 feet of you.",
          "resource": {
            "name": "Rage",
            "maxFormula": "rage_uses",
            "die": null,
            "recharge": "long"
          }
        },
        {
          "name": "Aspect of the Wilds",
          "level": 6,
          "description": "You gain one of the following options of your choice. Whenever you finish a Long Rest, you can change your choice. Owl: You have Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet. Panther: You have a Climb Speed equal to your Speed. Salmon: You have a Swim Speed equal to your Speed.",
          "resource": null
        },
        {
          "name": "Nature Speaker",
          "level": 10,
          "description": "You can cast the Commune with Nature spell but only as a Ritual. Wisdom is your spellcasting ability for it.",
          "resource": null
        },
        {
          "name": "Power of the Wilds",
          "level": 14,
          "description": "Whenever you activate your Rage, you gain one of the following options of your choice. Falcon: While your Rage is active, you have a Fly Speed equal to your Speed if you aren't wearing any armor. Lion: While your Rage is active, any of your enemies within 5 feet of you have Disadvantage on attack rolls against targets other than you or another Barbarian who has this option active. Ram: While your Rage is active, you can cause a Large or smaller creature to have the Prone condition when you hit it with a melee attack.",
          "resource": null
        }
      ]
    },
    "Path of the World Tree": {
      "name": "Path of the World Tree",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Path of the World Tree",
          "level": 3,
          "description": "Trace the Roots and Branches of the Multiverse Barbarians who follow the Path of the World Tree connect with the cosmic tree Yggdrasil through their Rage. This tree grows among the Outer Planes, connecting them to each other and the Material Plane. These Barbarians draw on the tree's magic for vitality and as a means of dimensional travel.",
          "resource": null
        },
        {
          "name": "Vitality of the Tree",
          "level": 3,
          "description": "Your Rage taps into the life force of the World Tree. You gain the following benefits. Vitality Surge: When you activate your Rage, you gain a number of Temporary Hit Points equal to your Barbarian level. Life-Giving Force: At the start of each of your turns while your Rage is active, you can choose another creature within 10 feet of yourself to gain Temporary Hit Points. To determine the number of Temporary Hit Points, roll a number of d6s equal to your Rage Damage bonus, and add them together. If any of these Temporary Hit Points remain when your Rage ends, they vanish.",
          "resource": null
        },
        {
          "name": "Branches of the Tree",
          "level": 6,
          "description": "Whenever a creature you can see starts its turn within 30 feet of you while your Rage is active, you can take a Reaction to summon spectral branches of the World Tree around it. The target must succeed on a Strength saving throw (8 plus your Strength modifier and Proficiency) or be teleported to an unoccupied space you can see within 5 feet of yourself or in the nearest unoccupied space you can see. After the target teleports, you can reduce its Speed to 0 until the end of the current turn.",
          "resource": null
        },
        {
          "name": "Battering Roots",
          "level": 10,
          "description": "During your turn, your reach is 10 feet greater with any , as tendrils of the World Tree extend from you. When you hit with such a weapon on your turn, you can activate the Push or Topple mastery property in addition to a different mastery property you're using with that weapon.",
          "resource": null
        },
        {
          "name": "Travel Along the Tree",
          "level": 14,
          "description": "When you activate your Rage and as a Bonus Action while your Rage is active, you can teleport up to 60 feet to an unoccupied space you can see. In addition, once per Rage, you can increase the range of that teleport to 150 feet. When you do so, you can also bring up to six willing creatures who are within 10 feet of you. Each creature teleports to an unoccupied space of your choice within 10 feet of your destination space.",
          "resource": null
        }
      ]
    }
  },
  "Bard": {
    "College of Lore": {
      "name": "College of Lore",
      "source": "PHB 2024",
      "features": [
        {
          "name": "College of Lore",
          "level": 3,
          "description": "Plumb the Depths of Magical Knowledge Bards of the College of Lore collect spells and secrets from diverse sources, such as scholarly tomes, mystical rites, and peasant tales. The college's members gather in libraries and universities to share their lore with one another. They also meet at festivals or affairs of state, where they can expose corruption, unravel lies, and poke fun at self-important figures of authority.",
          "resource": null
        },
        {
          "name": "Bonus Proficiencies",
          "level": 3,
          "description": "You gain proficiency with three skills of your choice.",
          "resource": null
        },
        {
          "name": "Cutting Words",
          "level": 3,
          "description": "You learn to use your wit to supernaturally distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of yourself makes a damage roll or succeeds on an ability check or attack roll, you can take a Reaction to expend one use of your Bardic Inspiration; roll your Bardic Inspiration die, and subtract the number rolled from the creature's roll, reducing the damage or potentially turning the success into a failure.",
          "resource": null
        },
        {
          "name": "Magical Discoveries",
          "level": 6,
          "description": "You learn two spells of your choice. These spells can come from the , , or  or any combination thereof (see a class's section for its spell list). A spell you choose must be a cantrip or a spell for which you have spell slots, as shown in the Bard Features table. You always have the chosen spells prepared, and whenever you gain a Bard level, you can replace one of the spells with another spell that meets these requirements.",
          "resource": null
        },
        {
          "name": "Peerless Skill",
          "level": 14,
          "description": "When you make an ability check or attack roll and fail, you can expend one use of Bardic Inspiration; roll the Bardic Inspiration die, and add the number rolled to the d20, potentially turning a failure into a success. On a failure, the Bardic Inspiration isn't expended.",
          "resource": null
        }
      ]
    },
    "College of Valor": {
      "name": "College of Valor",
      "source": "PHB 2024",
      "features": [
        {
          "name": "College of Valor",
          "level": 3,
          "description": "Sing the Deeds of Ancient Heroes Bards of the College of Valor are daring storytellers whose tales preserve the memory of the great heroes of the past. These Bards sing the deeds of the mighty in vaulted halls or to crowds gathered around great bonfires. They travel to witness great events firsthand and to ensure that the memory of these events doesn't pass away. With their songs, they inspire new generations to reach the same heights of accomplishment as the heroes of old.",
          "resource": null
        },
        {
          "name": "Combat Inspiration",
          "level": 3,
          "description": "You can use your wit to turn the tide of battle. A creature that has a Bardic Inspiration die from you can use it for one of the following effects. Defense: When the creature is hit by an attack roll, that creature can use its Reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, potentially causing the attack to miss. Offense: Immediately after the creature hits a target with an attack roll, the creature can roll the Bardic Inspiration die and add the number rolled to the attack's damage against the target.",
          "resource": null
        },
        {
          "name": "Martial Training",
          "level": 3,
          "description": "You gain proficiency with  and training with  and Shield. In addition, you can use a Simple or Martial weapon as a Spellcasting Focus to cast spells from your .",
          "resource": null
        },
        {
          "name": "Extra Attack",
          "level": 6,
          "description": "You can attack twice instead of once whenever you take the Attack action on your turn. In addition, you can cast one of your cantrips that has a casting time of an action in place of one of those attacks.",
          "resource": null
        },
        {
          "name": "Battle Magic",
          "level": 14,
          "description": "After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.",
          "resource": null
        }
      ]
    },
    "College of Glamour": {
      "name": "College of Glamour",
      "source": "PHB 2024",
      "features": [
        {
          "name": "College of Glamour",
          "level": 3,
          "description": "Weave Beguiling Fey Magic The College of Glamour traces its origins to the beguiling magic of the Feywild. Bards who study this magic weave threads of beauty and terror into their songs and stories, and the mightiest among them can cloak themselves in otherworldly majesty. Their performances stir up wistful longing for forgotten innocence, evoke unconscious memories of long-held fears, and tug at the emotions of even the most hard-hearted listeners.",
          "resource": null
        },
        {
          "name": "Beguiling Magic",
          "level": 3,
          "description": "You always have the Charm Person and Mirror Image spells prepared. In addition, immediately after you cast an Enchantment or Illusion spell using a spell slot, you can cause a creature you can see within 60 feet of yourself to make a Wisdom saving throw against your spell save DC. On a failed save, the target has the Charmed or Frightened condition (your choice) for 1 minute. The target repeats the save at the end of each of its turns, ending the effect on itself on a success. Once you use this benefit, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending one use of your Bardic Inspiration (no action required).",
          "resource": null
        },
        {
          "name": "Mantle of Inspiration",
          "level": 3,
          "description": "You can weave fey magic into a song or dance to fill others with vigor. As a Bonus Action, you can expend a use of Bardic Inspiration, rolling a Bardic Inspiration die. When you do so, choose a number of other creatures within 60 feet of yourself, up to a number equal to your Charisma modifier (minimum of one creature). Each of those creatures gains a number of Temporary Hit Points equal to two times the number rolled on the Bardic Inspiration die, and then each can use its Reaction to move up to its Speed without provoking Opportunity Attack.",
          "resource": null
        },
        {
          "name": "Mantle of Majesty",
          "level": 6,
          "description": "You always have the Command spell prepared. As a Bonus Action, you cast Command without expending a spell slot, and you take on an unearthly appearance for 1 minute or until your Concentration ends. During this time, you can cast Command as a Bonus Action without expending a spell slot. Any creature Charmed by you automatically fails its saving throw against the Command you cast with this feature. Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 3+ spell slot (no action required).",
          "resource": {
            "name": "Mantle of Majesty",
            "maxFormula": 1,
            "die": null,
            "recharge": "long"
          }
        },
        {
          "name": "Unbreakable Majesty",
          "level": 14,
          "description": "As a Bonus Action, you can assume a magically majestic presence for 1 minute or until you have the Incapacitated condition. For the duration, whenever any creature hits you with an attack roll for the first time on a turn, the attacker must succeed on a Charisma saving throw against your spell save DC, or the attack misses instead, as the creature recoils from your majesty. Once you assume this majestic presence, you can't do so again until you finish a Short Rest or Long Rest.",
          "resource": null
        }
      ]
    },
    "College of Swords": {
      "name": "College of Swords",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "College of Swords",
          "level": 3,
          "description": "Bards of the College of Swords are called blades, and they entertain through daring feats of weapon prowess. Blades perform stunts such as sword swallowing, knife throwing and juggling, and mock combats. Though they use their weapons to entertain, they are also highly trained and skilled warriors in their own right. Their talent with weapons inspires many blades to lead double lives. One blade might use a circus troupe as cover for nefarious deeds such as assassination, robbery, and blackmail. Other blades strike at the wicked, bringing justice to bear against the cruel and powerful. Most troupes are happy to accept a blade's talent for the excitement it adds to a performance, but few entert",
          "resource": null
        },
        {
          "name": "Defensive Flourish",
          "level": 3,
          "description": "You can expend one use of your Bardic Inspiration to cause the weapon to deal extra damage to the target you hit. The damage equals the number you roll on the Bardic Inspiration die. You also add the number rolled to your AC until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Mobile Flourish",
          "level": 3,
          "description": "You can expend one use of your Bardic Inspiration to cause the weapon to deal extra damage to the target you hit. The damage equals the number you roll on the Bardic Inspiration die. You can also push the target up to 5 feet away from you, plus a number of feet equal to the number you roll on that die. You can then immediately use your reaction to move up to your walking speed to an unoccupied space within 5 feet of the target.",
          "resource": null
        },
        {
          "name": "Slashing Flourish",
          "level": 3,
          "description": "You can expend one use of your Bardic Inspiration to cause the weapon to deal extra damage to the target you hit and to any other creature of your choice that you can see within 5 feet of you. The damage equals the number you roll on the Bardic Inspiration die.",
          "resource": null
        },
        {
          "name": "Blade Flourish",
          "level": 3,
          "description": "At 3rd level, you learn to perform impressive displays of martial prowess and speed. Whenever you take the Attack action on your turn, your walking speed increases by 10 feet until the end of the turn, and if a weapon attack that you make as part of this action hits a creature, you can use one of the following Blade Flourish options of your choice. You can use only one Blade Flourish option per turn.",
          "resource": null
        },
        {
          "name": "Bonus Proficiencies",
          "level": 3,
          "description": "When you join the College of Swords at 3rd level, you gain proficiency with medium armor and the scimitar. If you're proficient with a simple or martial melee weapon, you can use it as a spellcasting focus for your bard spells.",
          "resource": null
        },
        {
          "name": "Fighting Style",
          "level": 3,
          "description": "At 3rd level, you adopt a style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if something in the game lets you choose again.",
          "resource": null
        },
        {
          "name": "Extra Attack",
          "level": 6,
          "description": "Starting at 6th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
          "resource": null
        },
        {
          "name": "Master's Flourish",
          "level": 14,
          "description": "Starting at 14th level, whenever you use a Blade Flourish option, you can roll a d6 and use it instead of expending a Bardic Inspiration die.",
          "resource": null
        }
      ]
    },
    "College of Whispers": {
      "name": "College of Whispers",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "College of Whispers",
          "level": 3,
          "description": "Most folk are happy to welcome a bard into their midst. Bards of the College of Whispers use this to their advantage. They appear to be like other bards, sharing news, singing songs, and telling tales to the audiences they gather. In truth, the College of Whispers teaches its students that they are wolves among sheep. These bards use their knowledge and magic to uncover secrets and turn them against others through extortion and threats. Many other bards hate the College of Whispers, viewing it as a parasite that uses a bard's reputation to acquire wealth and power. For this reason, members of this college rarely reveal their true nature. They typically claim to follow some other college, or ",
          "resource": null
        },
        {
          "name": "Psychic Blades",
          "level": 3,
          "description": "When you join the College of Whispers at 3rd level, you gain the ability to make your weapon attacks magically toxic to a creature's mind. When you hit a creature with a weapon attack, you can expend one use of your Bardic Inspiration to deal an extra 2d6 psychic damage to that target. You can do so only once per round on your turn. The psychic damage increases when you reach certain levels in this class, increasing to 3d6 at 5th level, 5d6 at 10th level, and 8d6 at 15th level.",
          "resource": null
        },
        {
          "name": "Words of Terror",
          "level": 3,
          "description": "At 3rd level, you learn to infuse innocent-seeming words with an insidious magic that can inspire terror. If you speak to a humanoid alone for at least 1 minute, you can attempt to seed paranoia in its mind. At the end of the conversation, the target must succeed on a Wisdom saving throw against your spell save DC or be frightened of you or another creature of your choice. The target is frightened in this way for 1 hour, until it is attacked or damaged, or until it witnesses its allies being attacked or damaged. If the target succeeds on its saving throw, the target has no hint that you tried to frighten it. Once you use this feature, you can't use it again until you finish a short or long r",
          "resource": {
            "name": "Words of Terror",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Mantle of Whispers",
          "level": 6,
          "description": "At 6th level, you gain the ability to adopt a humanoid's persona. When a humanoid dies within 30 feet of you, you can magically capture its shadow using your reaction. You retain this shadow until you use it or you finish a long rest. You can use the shadow as an action. When you do so, it vanishes, magically transforming into a disguise that appears on you. You now look like the dead person, but healthy and alive. This disguise lasts for 1 hour or until you end it as a bonus action. While you're in the disguise, you gain access to all information that the humanoid would freely share with a casual acquaintance. Such information includes general details on its background and personal life, bu",
          "resource": null
        },
        {
          "name": "Shadow Lore",
          "level": 14,
          "description": "At 14th level, you gain the ability to weave dark magic into your words and tap into a creature's deepest fears. As an action, you magically whisper a phrase that only one creature of your choice within 30 feet of you can hear. The target must make a Wisdom saving throw against your spell save DC. It automatically succeeds if it doesn't share a language with you or if it can't hear you. On a successful saving throw, your whisper sounds like unintelligible mumbling and has no effect. On a failed saving throw, the target is charmed by you for the next 8 hours or until you or your allies attack it, damage it, or force it to make a saving throw. It interprets the whispers as a description of its",
          "resource": null
        }
      ]
    },
    "College of Creation": {
      "name": "College of Creation",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "College of Creation",
          "level": 3,
          "description": "Bards believe the cosmos is a work of art-the creation of the first dragons and gods. That creative work included harmonies that continue to resound through existence today, a power known as the Song of Creation. The bards of the College of Creation draw on that primeval song through dance, music, and poetry, and their teachers share this lesson: \"Before the sun and the moon, there was the Song, and its music awoke the first dawn. Its melodies so delighted the stones and trees that some of them gained a voice of their own. And now they sing too. Learn the Song, students, and you too can teach the mountains to sing and dance.\" Dwarves and gnomes often encourage their bards to become students ",
          "resource": null
        },
        {
          "name": "Mote of Potential",
          "level": 3,
          "description": "3rd-level College of Creation feature Whenever you give a creature a Bardic Inspiration die, you can utter a note from the Song of Creation to create a Tiny mote of potential, which orbits within 5 feet of that creature. The mote is intangible and invulnerable, and it lasts until the Bardic Inspiration die is lost. The mote looks like a musical note, a star, a flower, or another symbol of art or life that you choose. When the creature uses the Bardic Inspiration die, the mote provides an additional effect based on whether the die benefits an ability check, an attack roll, or a saving throw, as detailed below:",
          "resource": null
        },
        {
          "name": "Performance of Creation",
          "level": 3,
          "description": "3rd-level College of Creation feature As an action, you can channel the magic of the Song of Creation to create one nonmagical item of your choice in an unoccupied space within 10 feet of you. The item must appear on a surface or in a liquid that can support it. The gp value of the item can't be more than 20 times your bard level, and the item must be Medium or smaller. The item glimmers softly, and a creature can faintly hear music when touching it. The created item disappears after a number of hours equal to your proficiency bonus. For examples of items you can create, see the equipment chapter of the . Once you create an item with this feature, you can't do so again until you finish a lon",
          "resource": null
        },
        {
          "name": "Animating Performance",
          "level": 6,
          "description": "6th-level College of Creation feature As an action, you can animate one Large or smaller nonmagical item within 30 feet of you that isn't being worn or carried. The animate item uses the Dancing Item stat block, which uses your proficiency bonus (PB). The item is friendly to you and your companions and obeys your commands. It lives for 1 hour, until it is reduced to 0 hit points, or until you die. In combat, the item shares your initiative count, but it takes its turn immediately after yours. It can move and use its reaction on its own, but the only action it takes on its turn is the Dodge action, unless you take a bonus action on your turn to command it to take another action. That action c",
          "resource": null
        },
        {
          "name": "Creative Crescendo",
          "level": 14,
          "description": "14th-level College of Creation feature When you use your Performance of Creation feature, you can create more than one item at once. The number of items equals your Charisma modifier (minimum of two items). If you create an item that would exceed that number, you choose which of the previously created items disappears. Only one of these items can be of the maximum size you can create; the rest must be Small or Tiny. You are no longer limited by gp value when creating items with Performance of Creation.",
          "resource": null
        }
      ]
    },
    "College of Eloquence": {
      "name": "College of Eloquence",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "College of Eloquence",
          "level": 3,
          "description": "Adherents of the College of Eloquence master the art of oratory. Persuasion is regarded as a high art, and a well-reasoned, well-spoken argument often proves more persuasive than facts. These bards wield a blend of logic and theatrical wordplay, winning over skeptics and detractors with logical arguments and plucking at heartstrings to appeal to the emotions of audiences.",
          "resource": null
        },
        {
          "name": "Silver Tongue",
          "level": 3,
          "description": "3rd-level College of Eloquence feature You are a master at saying the right thing at the right time. When you make a Charisma (Persuasion) or Charisma (Deception) check, you can treat a d20 roll of 9 or lower as a 10.",
          "resource": null
        },
        {
          "name": "Unsettling Words",
          "level": 3,
          "description": "3rd-level College of Eloquence feature You can spin words laced with magic that unsettle a creature and cause it to doubt itself. As a bonus action, you can expend one use of your Bardic Inspiration and choose one creature you can see within 60 feet of you. Roll the Bardic Inspiration die. The creature must subtract the number rolled from the next saving throw it makes before the start of your next turn.",
          "resource": null
        },
        {
          "name": "Unfailing Inspiration",
          "level": 6,
          "description": "6th-level College of Eloquence feature Your inspiring words are so persuasive that others feel driven to succeed. When a creature adds one of your Bardic Inspiration dice to its ability check, attack roll, or saving throw and the roll fails, the creature can keep the Bardic Inspiration die.",
          "resource": null
        },
        {
          "name": "Universal Speech",
          "level": 6,
          "description": "6th-level College of Eloquence feature You have gained the ability to make your speech intelligible to any creature. As an action, choose one or more creatures within 60 feet of you, up to a number equal to your Charisma modifier (minimum of one creature). The chosen creatures can magically understand you, regardless of the language you speak, for 1 hour. Once you use this feature, you can't use it again until you finish a long rest, unless you expend a spell slot to use it again.",
          "resource": null
        },
        {
          "name": "Infectious Inspiration",
          "level": 14,
          "description": "14th-level College of Eloquence feature When you successfully inspire someone, the power of your eloquence can now spread to someone else. When a creature within 60 feet of you adds one of your Bardic Inspiration dice to its ability check, attack roll, or saving throw and the roll succeeds, you can use your reaction to encourage a different creature (other than yourself) that can hear you within 60 feet of you, giving it a Bardic Inspiration die without expending any of your Bardic Inspiration uses. You can use this reaction a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
          "resource": null
        }
      ]
    },
    "College of Spirits": {
      "name": "College of Spirits",
      "source": "Van Richten's Guide",
      "features": [
        {
          "name": "College of Spirits",
          "level": 3,
          "description": "Bards of the College of Spirits seek tales with inherent power—be they legends, histories, or fictions—and bring their subjects to life. Using occult trappings, these bards conjure spiritual embodiments of powerful forces to change the world once more. Such spirits are capricious, though, and what a bard summons isn't always entirely under their control.",
          "resource": null
        },
        {
          "name": "Guiding Whispers",
          "level": 3,
          "description": "3rd-level College of Spirits feature You can reach out to spirits to guide you and others. You learn the guidance cantrip, which doesn't count against the number of bard cantrips you know. For you, it has a range of 60 feet when you cast it.",
          "resource": null
        },
        {
          "name": "Spiritual Focus",
          "level": 3,
          "description": "3rd-level College of Spirits feature You employ tools that aid you in channeling spirits, be they historical figures or fictional archetypes. You can use the following objects as a spellcasting focus for your bard spells: a candle, crystal ball, skull, spirit board, or tarokka deck. Starting at 6th level, when you cast a bard spell that deals damage or restores hit points through the Spiritual Focus, roll a d6, and you gain a bonus to one damage or healing roll of the spell equal to the number rolled.",
          "resource": null
        },
        {
          "name": "Tales from Beyond",
          "level": 3,
          "description": "3rd-level College of Spirits feature You reach out to spirits who tell their tales through you. While you are holding your Spiritual Focus, you can use a bonus action to expend one use of your Bardic Inspiration and roll on the Spirit Tales table using your Bardic Inspiration die to determine the tale the spirits direct you to tell. You retain the tale in mind until you bestow the tale's effect or you finish a short or long rest. You can use an action to choose one creature you can see within 30 feet of you (this can be you) to be the target of the tale's effect. Once you do so, you can't bestow the tale's effect again until you roll it again. You can retain only one of these tales in mind a",
          "resource": null
        },
        {
          "name": "Spirit Session",
          "level": 6,
          "description": "6th-level College of Spirits feature Spirits provide you with supernatural insights. You can conduct an hour-long ritual channeling spirits (which can be done during a short or long rest) using your Spiritual Focus. You can conduct the ritual with a number of willing creatures equal to your proficiency bonus (including yourself). At the end of the ritual, you temporarily learn . The spell you choose must be of a level equal to the number of creatures that conducted the ritual or less, the spell must be of a level you can cast, and it must be in the school of divination or necromancy. The chosen spell counts as a bard spell for you but doesn't count against the number of bard spells you know.",
          "resource": null
        },
        {
          "name": "Mystical Connection",
          "level": 14,
          "description": "14th-level College of Spirits feature You now have the ability to nudge the spirits of Tales from Beyond toward certain tales. Whenever you roll on the Spirit Tales table, you can roll the die twice and choose which of the two effects to bestow. If you roll the same number on both dice, you can ignore the number and choose any effect on the table. Storytellers, like bards of the College of Spirits, often give voice to tales inspired by some greater theme or body of work. When determining what stories you tell, consider what unites them. Do they all feature characters from a specific group, like archetypes from the tarokka deck, figures from constellations, childhood imaginary friends, or cha",
          "resource": null
        }
      ]
    },
    "College of Dance": {
      "name": "College of Dance",
      "source": "PHB 2024",
      "features": [
        {
          "name": "College of Dance",
          "level": 3,
          "description": "Move in Harmony with the Cosmos Bards of the College of Dance know that the Words of Creation can't be contained within speech or song; the words are uttered by the movements of celestial bodies and flow through the motions of the smallest creatures. These Bards practice a way of being in harmony with the whirling cosmos that emphasizes agility, speed, and grace.",
          "resource": null
        },
        {
          "name": "Agile Strikes",
          "level": 3,
          "description": "When you expend a use of your Bardic Inspiration as part of an action, a Bonus Action, or a Reaction, you can make one Unarmed Strike as part of that action, Bonus Action, or Reaction.",
          "resource": null
        },
        {
          "name": "Bardic Damage",
          "level": 3,
          "description": "You can use Dexterity instead of Strength for the attack rolls of your Unarmed Strikes. When you deal damage with an Unarmed Strike, you can deal Bludgeoning damage equal to a roll of your Bardic Inspiration die plus your Dexterity modifier, instead of the strike's normal damage. This roll doesn't expend the die.",
          "resource": null
        },
        {
          "name": "Dance Virtuoso",
          "level": 3,
          "description": "You have Advantage on any Charisma (Performance) check you make that involves you dancing.",
          "resource": null
        },
        {
          "name": "Dazzling Footwork",
          "level": 3,
          "description": "While you aren't wearing armor or wielding a Shield, you gain the following benefits.",
          "resource": null
        },
        {
          "name": "Unarmored Defense",
          "level": 3,
          "description": "Your base Armor Class equals 10 plus your Dexterity and Charisma modifiers.",
          "resource": null
        },
        {
          "name": "Inspiring Movement",
          "level": 6,
          "description": "When an enemy you can see ends its turn within 5 feet of you, you can take a Reaction and expend one use of your Bardic Inspiration to move up to half your Speed. Then one ally of your choice within 30 feet of you can also move up to half their Speed using their Reaction. None of this feature's movement provokes Opportunity Attack.",
          "resource": null
        },
        {
          "name": "Tandem Footwork",
          "level": 6,
          "description": "When you roll Initiative, you can expend one use of your Bardic Inspiration if you don't have the Incapacitated condition. When you do so, roll your Bardic Inspiration die; you and each ally within 30 feet of you who can see or hear you gains a bonus to Initiative equal to the number rolled.",
          "resource": null
        },
        {
          "name": "Leading Evasion",
          "level": 14,
          "description": "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. If any creatures within 5 feet of you are making the same Dexterity saving throw, you can share this benefit with them for that save. You can't use this feature if you have the Incapacitated condition.",
          "resource": null
        }
      ]
    },
    "College of the Moon": {
      "name": "College of the Moon",
      "source": "Heroes of the Frontier",
      "features": [
        {
          "name": "College of the Moon",
          "level": 3,
          "description": "Inspire Allies with Primal Tales The College of the Moon traces its origins to the ancient druidic circles of the Moonshae Isles, who entrusted the first Bards of this tradition with chronicling the stories of the islands and their people. Bards of this college draw from the isles' fey magic and the primal power of the moonwells to bolster their allies, protect the natural world, and inspire their bardic works.",
          "resource": null
        },
        {
          "name": "Moon's Inspiration",
          "level": 3,
          "description": "The primal and ever-changing power of the moon flows through you, granting you the following benefits. Inspired Eclipse: When you take a Bonus Action to give a creature a Bardic Inspiration die, you can have the Invisible condition and teleport up to 30 feet to an unoccupied space you can see as part of that Bonus Action. This invisibility lasts until the start of your next turn and ends early immediately after you make an attack roll, deal damage, or cast a spell. Lunar Vitality: Once per turn when you restore Hit Points to a creature with a spell, you can expend a Bardic Inspiration die and increase the amount of Hit Points restored by a number equal to a roll of the Bardic Inspiration die",
          "resource": null
        },
        {
          "name": "Primal Lore",
          "level": 3,
          "description": "You learn Druidic and one cantrip from the Druid spell list. It counts as a Bard spell for you but doesn't count against the number of cantrips you know. Whenever you gain a Bard level, you can replace this cantrip with another cantrip of your choice from the Druid spell list. Additionally, choose one of the following skills: Animal Handling, Insight, Medicine, Nature, Perception, or Survival. You have proficiency in that skill.",
          "resource": null
        },
        {
          "name": "Blessing of Moonlight",
          "level": 6,
          "description": "You always have the Moonbeam spell prepared. When you cast Moonbeam, you can modify the spell so that you glow faintly while the spell is active. While glowing, you shed Dim Light out to 5 feet, and whenever a creature fails its saving throw against the effects of this Moonbeam, another creature of your choice that you can see within 60 feet of yourself regains 2d4 Hit Points. Once you use this feature to modify a casting of Moonbeam, you can't use it again until you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Eventide's Splendor",
          "level": 14,
          "description": "You become suffused with the might of the moon, improving your Moon's Inspiration in the following ways. Shadow of the New Moon: When you use Inspired Eclipse, the creature who received the Bardic Inspiration die can also have the Invisible condition and immediately take a Reaction to teleport up to 30 feet to an unoccupied space it can see. The creature remains Invisible until the start of its next turn. Vibrance of the Full Moon: When you use Lunar Vitality, you can roll 1d6 and use the number rolled in place of expending a Bardic Inspiration die.",
          "resource": null
        }
      ]
    }
  },
  "Cleric": {
    "Knowledge Domain": {
      "name": "Knowledge Domain",
      "source": "PHB 2014",
      "features": [
        {
          "name": "Knowledge Domain",
          "level": 1,
          "description": "The gods of knowledge—including Oghma, Boccob, Gilean, Aureon, and Thoth—value learning and understanding above all. Some teach that knowledge is to be gathered and shared in libraries and universities, or promote the practical knowledge of craft and invention. Some deities hoard knowledge and keep its secrets to themselves. And some promise their followers that they will gain tremendous power if they unlock the secrets of the multiverse. Followers of these gods study esoteric lore, collect old tomes, delve into the secret places of the earth, and learn all they can. Some gods of knowledge promote the practical knowledge of craft and invention, including smith deities like Gond, Reorx, Onata",
          "resource": null
        },
        {
          "name": "Blessings of Knowledge",
          "level": 1,
          "description": "At 1st level, you learn two languages of your choice. You also become proficient in your choice of two of the following skills: Arcana, History, Nature, or Religion. Your proficiency bonus is doubled for any ability check you make that uses either of those skills.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Knowledge of the Ages",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to tap into a divine well of knowledge. As an action, you choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Channel Divinity: Read Thoughts",
          "level": 6,
          "description": "At 6th level, you can use your Channel Divinity to read a creature's thoughts. You can then use your access to the creature's mind to command it. As an action, choose one creature that you can see within 60 feet of you. That creature must make a Wisdom saving throw. If the creature succeeds on the saving throw, you can't use this feature on it again until you finish a long rest. If the creature fails its save, you can read its surface thoughts (those foremost in its mind, reflecting its current emotions and what it is actively thinking about) when it is within 60 feet of you. This effect lasts for 1 minute. During that time, you can use your action to end this effect and cast the suggestion ",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Potent Spellcasting feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Potent Spellcasting",
          "level": 8,
          "description": "Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.",
          "resource": null
        },
        {
          "name": "Visions of the Past",
          "level": 17,
          "description": "Starting at 17th level, you can call up visions of the past that relate to an object you hold or your immediate surroundings. You spend at least 1 minute in meditation and prayer, then receive dreamlike, shadowy glimpses of recent events. You can meditate in this way for a number of minutes equal to your Wisdom score and must maintain concentration during that time, as if you were casting a spell. Once you use this feature, you can't use it again until you finish a short or long rest. Object Reading: Holding an object as you meditate, you can see visions of the object's previous owner. After meditating for 1 minute, you learn how the owner acquired and lost the object, as well as the most re",
          "resource": null
        }
      ]
    },
    "Life Domain": {
      "name": "Life Domain",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Life Domain",
          "level": 3,
          "description": "Soothe the Hurts of the World The Life Domain focuses on the positive energy that helps sustain all life in the multiverse. Clerics who tap into this domain are masters of healing, using that life force to cure many hurts. Existence itself relies on the positive energy associated with this domain, so a Cleric of almost any religious tradition might choose it. This domain is particularly associated with agricultural deities, gods of healing or endurance, and gods of home and community. Religious orders of healing also seek the magic of this domain.",
          "resource": null
        },
        {
          "name": "Disciple of Life",
          "level": 3,
          "description": "When a spell you cast with a spell slot restores Hit Points to a creature, that creature regains additional Hit Points on the turn you cast the spell. The additional Hit Points equal 2 plus the spell slot's level.",
          "resource": null
        },
        {
          "name": "Life Domain Spells",
          "level": 3,
          "description": "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Life Domain Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Preserve Life",
          "level": 3,
          "description": "As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to evoke healing energy that can restore a number of Hit Points equal to five times your Cleric level. Choose Bloodied creatures within 30 feet of yourself (which can include you), and divide those Hit Points among them. This feature can restore a creature to no more than half its Hit Points maximum.",
          "resource": null
        },
        {
          "name": "Blessed Healer",
          "level": 6,
          "description": "The healing spells you cast on others heal you as well. Immediately after you cast a spell with a spell slot that restores Hit Points to one creature other than you, you regain Hit Points equal to 2 plus the spell slot's level.",
          "resource": null
        },
        {
          "name": "Supreme Healing",
          "level": 17,
          "description": "When you would normally roll one or more dice to restore Hit Points to a creature with a spell or Channel Divinity, don't roll those dice for the healing; instead use the highest number possible for each die. For example, instead of restoring 2d6 Hit Points to a creature with a spell, you restore 12.",
          "resource": null
        }
      ]
    },
    "Light Domain": {
      "name": "Light Domain",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Light Domain",
          "level": 3,
          "description": "Bring Light to Banish Darkness The Light Domain emphasizes the divine power to bring about blazing fire and revelation. Clerics who wield this power are enlightened souls infused with radiance and the power of their deities' discerning vision, charged with chasing away lies and burning away darkness. The Light Domain is associated with gods of truth, vigilance, beauty, insight, and renewal. Some of these gods are identified with the sun or as charioteers who guide the sun across the sky. Others are sentinels who pierce deception. Some are deities of beauty and artistry who teach that art is a vehicle for the soul's improvement.",
          "resource": null
        },
        {
          "name": "Light Domain Spells",
          "level": 3,
          "description": "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Light Domain Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Radiance of the Dawn",
          "level": 3,
          "description": "As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to emit a flash of light in a 30-foot Emanation [Area of Effect] originating from yourself. Any magical Darkness—such as that created by the Darkness spell—in that area is dispelled. Additionally, each creature of your choice in that area must make a Constitution saving throw, taking Radiant damage equal to 2d10 plus your Cleric level on a failed save or half as much damage on a successful one.",
          "resource": null
        },
        {
          "name": "Warding Flare",
          "level": 3,
          "description": "When a creature that you can see within 30 feet of yourself makes an attack roll, you can take a Reaction to impose Disadvantage on the attack roll, causing light to flare before it hits or misses. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Improved Warding Flare",
          "level": 6,
          "description": "You regain all expended uses of your Warding Flare when you finish a Short Rest or Long Rest. In addition, whenever you use Warding Flare, you can give the target of the triggering attack a number of Temporary Hit Points equal to 2d6 plus your Wisdom modifier.",
          "resource": null
        },
        {
          "name": "Corona of Light",
          "level": 17,
          "description": "As a Magic action, you cause yourself to emit an aura of sunlight that lasts for 1 minute or until you dismiss it (no action required). You emit Bright Light in a 60-foot radius and Dim Light for an additional 30 feet. Your enemies in the Bright Light have Disadvantage on saving throws against your Radiance of the Dawn and any spell that deals Fire or Radiant damage. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
          "resource": null
        }
      ]
    },
    "Nature Domain": {
      "name": "Nature Domain",
      "source": "PHB 2014",
      "features": [
        {
          "name": "Nature Domain",
          "level": 1,
          "description": "Gods of nature are as varied as the natural world itself, from inscrutable gods of the deep forests (such as Silvanus, Obad-Hai, Chislev, Balinor, and Pan) to friendly deities associated with particular springs and groves (such as Eldath). Druids revere nature as a whole and might serve one of these deities, practicing mysterious rites and reciting all-but-forgotten prayers in their own secret tongue. But many of these gods have clerics as well, champions who take a more active role in advancing the interests of a particular nature god. These clerics might hunt the evil monstrosities that despoil the woodlands, bless the harvest of the faithful, or wither the crops of those who anger their g",
          "resource": null
        },
        {
          "name": "Acolyte of Nature",
          "level": 1,
          "description": "At 1st level, you learn one druid cantrip of your choice. This cantrip doesn't count against the number of cleric cantrips you know. You also gain proficiency in one of the following skills of your choice: Animal Handling, Nature, or Survival.",
          "resource": null
        },
        {
          "name": "Bonus Proficiency",
          "level": 1,
          "description": "Also at 1st level, you gain proficiency with heavy armor.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Charm Animals and Plants",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to charm animals and plants. As an action, you present your holy symbol and invoke the name of your deity. Each beast or plant creature that can see you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is charmed by you for 1 minute or until it takes damage. While it is charmed by you, it is friendly to you and other creatures you designate.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Dampen Elements",
          "level": 6,
          "description": "Starting at 6th level, when you or a creature within 30 feet of you takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to the creature against that instance of the damage.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Divine Strike feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Divine Strike",
          "level": 8,
          "description": "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 cold, fire, or lightning damage (your choice) to the target. When you reach 14th level, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Master of Nature",
          "level": 17,
          "description": "At 17th level, you gain the ability to command animals and plant creatures. While creatures are charmed by your Charm Animals and Plants feature, you can take a bonus action on your turn to verbally command what each of those creatures will do on its next turn.",
          "resource": null
        }
      ]
    },
    "Tempest Domain": {
      "name": "Tempest Domain",
      "source": "PHB 2014",
      "features": [
        {
          "name": "Tempest Domain",
          "level": 1,
          "description": "Gods whose portfolios include the Tempest domain—including Talos, Umberlee, Kord, Zeboim, the Devourer, Zeus, and Thor—govern storms, sea, and sky. They include gods of lightning and thunder, gods of earthquakes, some fire gods, and certain gods of violence, physical strength, and courage. In some pantheons, a god of this domain rules over other deities and is known for swift justice delivered by thunderbolts. In the pantheons of seafaring people, gods of this domain are ocean deities and the patrons of sailors. Tempest gods send their clerics to inspire fear in the common folk, either to keep those folk on the path of righteousness or to encourage them to offer sacrifices of propitiation to",
          "resource": null
        },
        {
          "name": "Bonus Proficiencies",
          "level": 1,
          "description": "At 1st level, you gain proficiency with martial weapons and heavy armor.",
          "resource": null
        },
        {
          "name": "Wrath of the Storm",
          "level": 1,
          "description": "Also at 1st level, you can thunderously rebuke attackers. When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage (your choice) on a failed saving throw, and half as much damage on a successful one. You can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Destructive Wrath",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to wield the power of the storm with unchecked ferocity. When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage, instead of rolling.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Thunderbolt Strike",
          "level": 6,
          "description": "At 6th level, when you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Divine Strike feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Divine Strike",
          "level": 8,
          "description": "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 thunder damage to the target. When you reach 14th level, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Stormborn",
          "level": 17,
          "description": "At 17th level, you have a flying speed equal to your current walking speed whenever you are not underground or indoors.",
          "resource": null
        }
      ]
    },
    "Trickery Domain": {
      "name": "Trickery Domain",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Trickery Domain",
          "level": 3,
          "description": "Make Mischief and Challenge Authority The Trickery Domain offers magic of deception, illusion, and stealth. Clerics who wield this magic are a disruptive force in the world, puncturing pride, mocking tyrants, freeing captives, and flouting hollow traditions. They prefer subterfuge and pranks to direct confrontation. Gods of trickery are mischief-makers and instigators who stand as a constant challenge to the accepted order among both gods and mortals. They embody the forces of change and social upheaval, and they're patrons of thieves, scoundrels, gamblers, rebels, and liberators. Religious orders that operate in secret, especially those that seek to undermine oppressive governments or hiera",
          "resource": null
        },
        {
          "name": "Blessing of the Trickster",
          "level": 3,
          "description": "As a Magic action, you can choose yourself or a willing creature within 30 feet of yourself to have Advantage on Dexterity (Stealth) checks. This blessing lasts until you finish a Long Rest or you use this feature again.",
          "resource": null
        },
        {
          "name": "Invoke Duplicity",
          "level": 3,
          "description": "As a Bonus Action, you can expend one use of your Channel Divinity to create a perfect visual illusion of yourself in an unoccupied space you can see within 30 feet of yourself. The illusion is intangible and doesn't occupy its space. It lasts for 1 minute, but it ends early if you dismiss it (no action required) or have the Incapacitated condition. The illusion is animated and mimics your expressions and gestures. While it persists, you gain the following benefits. Cast Spells: You can cast spells as though you were in the illusion's space, but you must use your own senses. Distract: When both you and your illusion are within 5 feet of a creature that can see the illusion, you have Advantag",
          "resource": null
        },
        {
          "name": "Trickery Domain Spells",
          "level": 3,
          "description": "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Trickery Domain Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Trickster's Transposition",
          "level": 6,
          "description": "Whenever you take the Bonus Action to create or move the illusion of your Invoke Duplicity, you can teleport, swapping places with the illusion.",
          "resource": null
        },
        {
          "name": "Improved Duplicity",
          "level": 17,
          "description": "The illusion of your Invoke Duplicity has grown more powerful in the following ways. Shared Distraction: When you and your allies make attack rolls against a creature within 5 feet of the illusion, the attack rolls have Advantage. Healing Illusion: When the illusion ends, you or a creature of your choice within 5 feet of it regains a number of Hit Points equal to your Cleric level.",
          "resource": null
        }
      ]
    },
    "War Domain": {
      "name": "War Domain",
      "source": "PHB 2024",
      "features": [
        {
          "name": "War Domain",
          "level": 3,
          "description": "Inspire Valor and Smite Foes War has many manifestations. It can make heroes of ordinary people. It can be desperate and horrific, with acts of cruelty and cowardice eclipsing instances of excellence and courage. Clerics who tap into the magic of the War Domain excel in battle, inspiring others to fight the good fight or offering acts of violence as prayers. Gods of the War Domain watch over warriors and reward them for their great deeds. They include champions of honor and chivalry as well as gods of destruction and pillage. Other war gods take a more neutral stance, promoting war in all its manifestations and supporting warriors in any circumstance.",
          "resource": null
        },
        {
          "name": "Guided Strike",
          "level": 3,
          "description": "When you or a creature within 30 feet of you misses with an attack roll, you can expend one use of your Channel Divinity and give that roll a +10 bonus, potentially causing it to hit. When you use this feature to benefit another creature's attack roll, you must take a Reaction to do so.",
          "resource": null
        },
        {
          "name": "War Domain Spells",
          "level": 3,
          "description": "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the War Domain Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "War Priest",
          "level": 3,
          "description": "As a Bonus Action, you can make one attack with a weapon or an Unarmed Strike. You can use this Bonus Action a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Short Rest or Long Rest.",
          "resource": null
        },
        {
          "name": "War God's Blessing",
          "level": 6,
          "description": "You can expend a use of your Channel Divinity to cast Shield of Faith or Spiritual Weapon rather than expending a spell slot. When you cast either spell in this way, the spell doesn't require Concentration. Instead the spell lasts for 1 minute, but it ends early if you cast that spell again, have the Incapacitated condition, or die.",
          "resource": null
        },
        {
          "name": "Avatar of Battle",
          "level": 17,
          "description": "You gain Resistance to Bludgeoning, Piercing, and Slashing damage.",
          "resource": null
        }
      ]
    },
    "Death Domain": {
      "name": "Death Domain",
      "source": "DMG",
      "features": [
        {
          "name": "Death Domain",
          "level": 1,
          "description": "The Death domain is concerned with the forces that cause death, as well as the negative energy that gives rise to undead creatures. Deities such as Chemosh, Myrkul, and Wee Jas are patrons of necromancers, death knights, liches, mummy lords, and vampires. Gods of the Death domain also embody murder (Anubis, Bhaal, and Pyremius), pain (Iuz or Loviatar), disease or poison (Incabulos, Talona, or Morgion), and the underworld (Hades and Hel). At each indicated cleric level, add the listed spells to your spells prepared. They do not count towards your limit.",
          "resource": null
        },
        {
          "name": "Bonus Proficiency",
          "level": 1,
          "description": "When the cleric chooses this domain at 1st level, he or she gains proficiency with martial weapons.",
          "resource": null
        },
        {
          "name": "Reaper",
          "level": 1,
          "description": "At 1st level, the cleric learns one  of his or her choice from any spell list. When the cleric casts a necromancy cantrip that normally targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Touch of Death",
          "level": 2,
          "description": "Starting at 2nd level, the cleric can use Channel Divinity to destroy another creature's life force by touch. When the cleric hits a creature with a melee attack, the cleric can use Channel Divinity to deal extra necrotic damage to the target. The damage equals 5 + twice his or her cleric level.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Inescapable Destruction",
          "level": 6,
          "description": "Starting at 6th level, the cleric's ability to channel negative energy becomes more potent. Necrotic damage dealt by the character's cleric spells and Channel Divinity options ignores resistance to necrotic damage.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Divine Strike feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Divine Strike",
          "level": 8,
          "description": "At 8th level, the cleric gains the ability to infuse his or her weapon strikes with necrotic energy. Once on each of the cleric's turns when he or she hits a creature with a weapon attack, the cleric can cause the attack to deal an extra 1d8 necrotic damage to the target. When the cleric reaches 14th level, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Improved Reaper",
          "level": 17,
          "description": "Starting at 17th level, when the cleric casts a Necromancy spell of 1st through 5th-level that targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other. If the spell consumes its material components, the cleric must provide them for each target.",
          "resource": null
        }
      ]
    },
    "Arcana Domain": {
      "name": "Arcana Domain",
      "source": "Sword Coast Guide",
      "features": [
        {
          "name": "Arcana Domain",
          "level": 1,
          "description": "Magic is an energy that suffuses the multiverse and that fuels both destruction and creation. Gods of the Arcana domain know the secrets and potential of magic intimately. For some of these gods, magical knowledge is a great responsibility that comes with a special understanding of the nature of reality. Other gods of Arcana see magic as pure power, to be used as its wielder sees fit. The gods of this domain are often associated with knowledge, as learning and arcane power tend to go hand-in-hand. In the Realms, deities of this domain include Azuth and Mystra, as well as Corellon Larethian of the elven pantheon. In other worlds, this domain includes Hecate, Math Mathonwy, and Isis; the tripl",
          "resource": null
        },
        {
          "name": "Arcane Initiate",
          "level": 1,
          "description": "When you choose this domain at 1st level, you gain proficiency in the Arcana skill, and you gain two cantrips of your choice from the . For you, these cantrips count as cleric cantrips.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Arcane Abjuration",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to abjure otherworldly creatures. As an action, you present your holy symbol, and one celestial, elemental, fey, or fiend of your choice that is within 30 feet of you must make a Wisdom saving throw, provided that the creature can see or hear you. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly end its move in a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If ",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Spell Breaker",
          "level": 6,
          "description": "Starting at 6th level, when you restore hit points to an ally with a spell of 1st level or higher, you can also end one spell of your choice on that creature. The level of the spell you end must be equal to or lower than the level of the spell slot you use to cast the healing spell.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Potent Spellcasting feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Potent Spellcasting",
          "level": 8,
          "description": "Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.",
          "resource": null
        },
        {
          "name": "Arcane Mastery",
          "level": 17,
          "description": "At 17th level, you choose four spells from the Wizard spell list, one from each of the following levels: 6th, 7th, 8th, and 9th. You add them to your list of domain spells. Like your other domain spells, they are always prepared and count as cleric spells for you.",
          "resource": null
        }
      ]
    },
    "Ambition Domain (PSA)": {
      "name": "Ambition Domain (PSA)",
      "source": "PSA",
      "features": [
        {
          "name": "Ambition Domain (PSA)",
          "level": 1,
          "description": "The worthy shall strive for greatness—supremacy in life leads to supremacy in the afterlife. Bontu has fully embraced this dictum, and though she expends little effort in teaching it, she surely leads by example. Her viziers subtly plant the seeds that flower into the ambition the God-Pharaoh desires. Through insinuation, they remind acolytes and initiates alike that achieving one's place in the afterlife at the expense of others is not shameful, but is proof of the initiate's determination and drive. Nothing is more important than that drive, they suggest—not the bonds of a crop, not friendship or love. Not even devotion to a deity. At each indicated cleric level, add the listed spells to y",
          "resource": null
        },
        {
          "name": "Warding Flare",
          "level": 1,
          "description": "When you choose this domain at 1st level, you can interpose divine light between yourself and an attacking enemy. When you are attacked by a creature within 30 feet of you that you can see, you can use your reaction to impose disadvantage on the attack roll, causing light to flare before the attacker before it hits or misses. An attacker that can't be blinded is immune to this feature. You can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Invoke Duplicity",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to create an illusory duplicate of yourself. As an action, you create a perfect illusion of yourself that lasts for 1 minute, or until you lose your concentration (as if you were concentration on a spell). The illusion appears in an unoccupied space that you can see within 30 feet of you. As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see, but it must remain within 120 feet of you. For the duration, you can cast spells as though you were in the illusion's space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the ill",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Channel Divinity: Cloak of Shadows",
          "level": 6,
          "description": "Starting at 6th level, you can use your Channel Divinity to vanish. As an action, you become invisible until the end of your next turn. You become visible if you attack or cast a spell.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Potent Spellcasting feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Potent Spellcasting",
          "level": 8,
          "description": "Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.",
          "resource": null
        },
        {
          "name": "Improved Duplicity",
          "level": 17,
          "description": "At 17th level, you can create up to four duplicates of yourself, instead of one, when you use Invoke Duplicity. As a bonus action on your turn, you can move any number of them up to 30 feet, to a maximum range of 120 feet.",
          "resource": null
        }
      ]
    },
    "Knowledge Domain (PSA)": {
      "name": "Knowledge Domain (PSA)",
      "source": "PSA",
      "features": [
        {
          "name": "Knowledge Domain (PSA)",
          "level": 1,
          "description": "The worthy shall cultivate a nimble mind that can perceive the wonders beyond imagination that wait in the afterlife. Kefnet's task is to pass on this teaching of the God-Pharaoh and elucidate its meaning. He teaches that the afterlife will be inhabited only by those who have proved by their wits that they are worthy of dwelling in the glorious presence of the God-Pharaoh. He trains acolytes and initiates to push their limits and challenge their mental capacity with spells of ever-greater power. Kefnet's domain is identical to the Cleric.",
          "resource": null
        }
      ]
    },
    "Solidarity Domain (PSA)": {
      "name": "Solidarity Domain (PSA)",
      "source": "PSA",
      "features": [
        {
          "name": "Solidarity Domain (PSA)",
          "level": 1,
          "description": "The worthy must know and respect all others whom the God-Pharaoh deems worthy, for in the afterlife, all will be united in purpose and action. Oketra is charged with expounding upon this teaching of the God-Pharaoh, instilling in every initiate the virtue of solidarity. She forges each group of children into a crop of acolytes with just one purpose: to be judged worthy of a glorious afterlife. And she instills in each crop the ability to unite in a single action in pursuit of that purpose. She is fond of poetic imagery to communicate her ideals. At each indicated cleric level, add the listed spells to your spells prepared.",
          "resource": null
        },
        {
          "name": "Bonus Proficiency",
          "level": 1,
          "description": "When you choose this domain at 1st level, you gain proficiency with heavy armor.",
          "resource": null
        },
        {
          "name": "Solidarity's Action",
          "level": 1,
          "description": "Also at 1st level, when you take the Help action to aid an ally's attack, you can make one weapon attack as a bonus action. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Preserve Life",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to heal the badly injured. As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can't use this feature on an undead or a construct.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Oketra's Blessing",
          "level": 6,
          "description": "At 6th level, when a creature within 30 feet of you makes an attack roll, you can use your reaction to grant that creature a +10 bonus to the roll, using your Channel Divinity. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Divine Strike feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Divine Strike",
          "level": 8,
          "description": "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 damage of the same type dealt by the weapon to the target. When you reach 14th level, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Supreme Healing",
          "level": 17,
          "description": "Starting at 17th level, when you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hit points to a creature, you restore 12.",
          "resource": null
        }
      ]
    },
    "Strength Domain (PSA)": {
      "name": "Strength Domain (PSA)",
      "source": "PSA",
      "features": [
        {
          "name": "Strength Domain (PSA)",
          "level": 1,
          "description": "The worthy shall hone a strong body that can withstand the boundless energies of the afterlife. It falls to Rhonas to instill this teaching in those who would enter the afterlife—but to his mind, the words themselves don't matter. Strength can't be taught. It must be built through practice and training. Rhonas demonstrates his teachings by his example, rather than by giving his students any kind of academic instruction. He welcomes the people of Naktamun to stand by the Hekma and watch him as he storms into the desert to battle the greatest horrors. He encourages them to observe his indomitable strength, for though they will never equal it, they can aspire to mimicry. He invites them to scru",
          "resource": null
        },
        {
          "name": "Acolyte of Strength",
          "level": 1,
          "description": "At 1st level, you learn one druid cantrip of your choice. You also gain proficiency in one of the following skills of your choice: Animal Handling, Athletics, Nature, or Survival.",
          "resource": null
        },
        {
          "name": "Bonus Proficiency",
          "level": 1,
          "description": "Also at 1st level, you gain proficiency with heavy armor.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Feat of Strength",
          "level": 2,
          "description": "At 2nd level, you can use your Channel Divinity to enhance your physical might. When you make an attack roll, ability check, or saving throw using Strength, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the roll succeeds or fails.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Rhonas's Blessing",
          "level": 6,
          "description": "At 6th level, when a creature within 30 feet of you makes an attack roll, ability check, or saving throw using Strength, you can use your reaction to grant that creature a +10 bonus to the roll, using your Channel Divinity. You make this choice after you see the roll, but before the DM says whether the roll succeeds or fail.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Divine Strike feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Divine Strike",
          "level": 8,
          "description": "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 damage of the same type dealt by the weapon to the target. When you reach 14th level, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Avatar of Battle",
          "level": 17,
          "description": "At 17th level, you gain resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.",
          "resource": null
        }
      ]
    },
    "Zeal Domain (PSA)": {
      "name": "Zeal Domain (PSA)",
      "source": "PSA",
      "features": [
        {
          "name": "Zeal Domain (PSA)",
          "level": 1,
          "description": "The worthy shall rush to the God-Pharaoh's side with relentless zeal, rising to overcome every obstacle in their way. The God-Pharaoh expects those he welcomes into the afterlife to desire it above all other pleasures and achievements, and for them to show their dedication, passion, and fervor through their actions. Hazoret is charged with cultivating this zeal in the initiates who come under her care, and she has undertaken the task with appropriate enthusiasm. She recognizes, however, that the best way to teach zeal is by demonstrating it. At each indicated cleric level, add the listed spells to your spells prepared.",
          "resource": null
        },
        {
          "name": "Bonus Proficiencies",
          "level": 1,
          "description": "At 1st level, you gain proficiency with martial weapons and heavy armor.",
          "resource": null
        },
        {
          "name": "Priest of Zeal",
          "level": 1,
          "description": "From 1st level, Hazoret delivers bolts of inspiration to you while you are engaged in battle. When you use the Attack action, you can make one weapon attack as a bonus action. You can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Consuming Fervor",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to channel your zeal into unchecked ferocity. When you roll fire or thunder damage, you can use your Channel Divinity to deal maximum damage instead of rolling.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Resounding Strike",
          "level": 6,
          "description": "At 6th level, when you deal thunder damage to a Large or smaller creature, you can also push it up to 10 feet away from you.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Divine Strike feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Divine Strike",
          "level": 8,
          "description": "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 damage of the same type dealt by the weapon to the target. When you reach 14th level, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Blaze of Glory",
          "level": 17,
          "description": "Starting at 17th level, you can delay death for an instant to perform a final heroic act. When you are reduced to 0 hit points by an attacker you can see, even if you would be killed outright, you can use your reaction to move up to your speed toward the attacker and make one melee weapon attack against it, as long as the movement brings it within your reach. You make this attack with advantage. If the attack hits, the creature takes an extra 5d10 fire damage and an extra 5d10 damage of the weapon's type. You then fall unconscious and begin making death saving throws as normal, or you die if the damage you took would have killed you outright. Once you use this feature, you can't use it again",
          "resource": null
        }
      ]
    },
    "Forge Domain": {
      "name": "Forge Domain",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Forge Domain",
          "level": 1,
          "description": "The gods of the forge are patrons of artisans who work with metal, from a humble blacksmith who keeps a village in horseshoes and plow blades to the mighty elf artisan whose diamond-tipped arrows of mithral have felled demon lords. The gods of the forge teach that, with patience and hard work, even the most intractable metal can be transformed from a lump of ore to a beautifully wrought object. Clerics of these deities search for objects lost to the forces of darkness, liberate mines overrun by orcs, and uncover rare and wondrous materials necessary to create potent magic items. Followers of these gods take great pride in their work, and they are willing to craft and use heavy armor and powe",
          "resource": null
        },
        {
          "name": "Blessing of the Forge",
          "level": 1,
          "description": "At 1st level, you gain the ability to imbue magic into a weapon or armor. At the end of a long rest, you can touch one nonmagical object that is a suit of armor or a . Until the end of your next long rest or until you die, the object becomes a magic item, granting a +1 bonus to AC if it's armor or a +1 bonus to attack and damage rolls if it's a weapon. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        },
        {
          "name": "Bonus Proficiency",
          "level": 1,
          "description": "When you choose this domain at 1st level, you gain proficiency with heavy armor and smith's tools.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Artisan's Blessing",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to create simple items. You conduct an hour-long ritual that crafts a nonmagical item that must include some metal: a , a suit of armor, ten pieces of ammunition, a set of tools, or another metal object (see chapter 5, \"Equipment,\" in the Player's Handbook for examples of these items). The creation is completed at the end of the hour, coalescing in an unoccupied space of your choice on a surface within 5 feet of you. The thing you create can be something that is worth no more than 100 gp. As part of this ritual, you must lay out metal, which can include coins, with a value equal to the creation. The metal irretrievably coalesces and tr",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Soul of the Forge",
          "level": 6,
          "description": "Starting at 6th level, your mastery of the forge grants you special abilities: You gain resistance to fire damage. While wearing heavy armor, you gain a +1 bonus to AC.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Divine Strike feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Divine Strike",
          "level": 8,
          "description": "At 8th level, you gain the ability to infuse your weapon strikes with the fiery power of the forge. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 fire damage to the target. When you reach 14th level, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Saint of Forge and Fire",
          "level": 17,
          "description": "At 17th level, your blessed affinity with fire and metal becomes more powerful: You gain immunity to fire damage, While wearing heavy armor, you have resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.",
          "resource": null
        }
      ]
    },
    "Grave Domain": {
      "name": "Grave Domain",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Grave Domain",
          "level": 1,
          "description": "Gods of the grave watch over the line between life and death. To these deities, death and the afterlife are a foundational part of the multiverse. To desecrate the peace of the dead is an abomination. Deities of the grave include Kelemvor, Wee Jas, the ancestral spirits of the Undying Court, Hades, Anubis, and Osiris. Followers of these deities seek to put wandering spirits to rest, destroy the undead, and ease the suffering of the dying. Their magic also allows them to stave off death for a time, particularly for a person who still has some great work to accomplish in the world. This is a delay of death, not a denial of it, for death will eventually get its due.",
          "resource": null
        },
        {
          "name": "Circle of Mortality",
          "level": 1,
          "description": "At 1st level, you gain the ability to manipulate the line between life and death. When you would normally roll one or more dice to restore hit points with a spell to a creature at 0 hit points, you instead use the highest number possible for each die. In addition, you learn the spare the dying cantrip, which doesn't count against the number of cleric cantrips you know. For you, it has a range of 30 feet, and you can cast it as a bonus action.",
          "resource": null
        },
        {
          "name": "Eyes of the Grave",
          "level": 1,
          "description": "At 1st level, you gain the ability to occasionally sense the presence of the undead, whose existence is an insult to the natural cycle of life. As an action, you can open your awareness to magically detect undead. Until the end of your next turn, you know the location of any undead within 60 feet of you that isn't behind Cover and that isn't protected from divination magic. This sense doesn't tell you anything about a creature's capabilities or identity. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Path to the Grave",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to mark another creature's life force for termination. As an action, you choose one creature you can see within 30 feet of you, cursing it until the end of your next turn. The next time you or an ally of yours hits the cursed creature with an attack, the creature has vulnerability to all of that attack's damage, and then the curse ends.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Sentinel at Death's Door",
          "level": 6,
          "description": "At 6th level, you gain the ability to impede death's progress. As a reaction when you or a creature you can see within 30 feet of you suffers a critical hit, you can turn that hit into a normal hit. Any effects triggered by a critical hit are canceled. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Potent Spellcasting feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Potent Spellcasting",
          "level": 8,
          "description": "Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.",
          "resource": null
        },
        {
          "name": "Keeper of Souls",
          "level": 17,
          "description": "Starting at 17th level, you can seize a trace of vitality from a parting soul and use it to heal the living. When an enemy you can see dies within 60 feet of you, you or one creature of your choice that is within 60 feet of you regains hit points equal to the enemy's number of Hit Dice. You can use this feature only if you aren't incapacitated. Once you use it, you can't do so again until the start of your next turn.",
          "resource": null
        }
      ]
    },
    "Order Domain": {
      "name": "Order Domain",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Order Domain",
          "level": 1,
          "description": "The Order Domain represents discipline, as well as devotion to a society or an institution and strict obedience to the laws governing it. On Ravnica, the domain is favored by clerics of the Azorius Senate, who use it to maintain and enforce the law, and of the Orzhov Syndicate, who exploit law and order for their personal gain. On other worlds, gods who grant access to this domain include Bane, Tyr, Majere, Erathis, Pholtus, Wee Jas, Aureon, Maglubiyet, Nuada, Athena, Anubis, Forseti, and Asmodeus. The ideal of order is obedience to the law above all else, rather than to a specific individual or the passing influence of emotion or popular rule. Clerics of order are typically concerned with h",
          "resource": null
        },
        {
          "name": "Bonus Proficiencies",
          "level": 1,
          "description": "When you choose this domain at 1st level, you gain proficiency with heavy armor. You also gain proficiency in the Intimidation or Persuasion skill (your choice).",
          "resource": null
        },
        {
          "name": "Voice of Authority",
          "level": 1,
          "description": "Starting at 1st level, you can invoke the power of law to drive an ally to attack. If you cast a spell with a spell slot of 1st level or higher and target an ally with the spell, that ally can use their reaction immediately after the spell to make one weapon attack against a creature of your choice that you can see. If the spell targets more than one ally, you choose the ally who can make the attack.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Order's Demand",
          "level": 2,
          "description": "Starting at 2nd level, you can use your Channel Divinity to exert an intimidating presence over others. As an action, you present your holy symbol, and each creature of your choice that can see or hear you within 30 feet of you must succeed on a Wisdom saving throw or be charmed by you until the end of your next turn or until the charmed creature takes any damage. You can also cause any of the charmed creatures to drop what they are holding when they fail the saving throw.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Embodiment of the Law",
          "level": 6,
          "description": "At 6th level, you become remarkably adept at channeling magical energy to compel others. If you cast a spell of the enchantment school using a spell slot of 1st level or higher, you can change the spell's casting time to 1 bonus action for this casting, provided the spell's casting time is normally 1 action. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Divine Strike feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Divine Strike",
          "level": 8,
          "description": "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 psychic damage to the target. When you reach 14th level, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Order's Wrath",
          "level": 17,
          "description": "Starting at 17th level, enemies you designate for destruction wilt under the combined efforts of you and your allies. If you deal your Divine Strike damage to a creature on your turn, you can curse that creature until the start of your next turn. The next time one of your allies hits the cursed creature with an attack, the target also takes 2d8 psychic damage, and the curse ends. You can curse a creature in this way only once per turn.",
          "resource": null
        }
      ]
    },
    "Peace Domain": {
      "name": "Peace Domain",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Peace Domain",
          "level": 1,
          "description": "The balm of peace thrives at the heart of healthy communities, between friendly nations, and in the souls of the kindhearted. The gods of peace inspire people of all sorts to resolve conflict and to stand up against those forces that try to prevent peace from flourishing. See the Peace Deities table for a list of some of the gods associated with this domain. Clerics of the Peace Domain preside over the signing of treaties, and they are often asked to arbitrate in disputes. These clerics' blessings draw people together and help them shoulder one another's burdens, and the clerics' magic aids those who are driven to fight for the way of peace. Domain Spells: 1st-level Peace Domain feature You ",
          "resource": null
        },
        {
          "name": "Emboldening Bond",
          "level": 1,
          "description": "1st-level Peace Domain feature You can forge an empowering bond among people who are at peace with one another. As an action, you choose a number of willing creatures within 30 feet of you (this can include yourself) equal to your proficiency bonus. You create a magical bond among them for 10 minutes or until you use this feature again. While any bonded creature is within 30 feet of another, the creature can roll a d4 and add the number rolled to an attack roll, an ability check, or a saving throw it makes. Each creature can add the d4 no more than once per turn. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a lon",
          "resource": null
        },
        {
          "name": "Implement of Peace",
          "level": 1,
          "description": "1st-level Peace Domain feature You gain proficiency in the Insight, Performance, or Persuasion skill (your choice).",
          "resource": null
        },
        {
          "name": "Channel Divinity: Balm of Peace",
          "level": 2,
          "description": "2nd-level Peace Domain feature You can use your Channel Divinity to make your very presence a soothing balm. As an action, you can move up to your speed, without provoking opportunity attacks, and when you move within 5 feet of any other creature during this action, you can restore a number of hit points to that creature equal to 2d6 + your Wisdom modifier (minimum of 1 hit point). A creature can receive this healing only once whenever you take this action.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Protective Bond",
          "level": 6,
          "description": "6th-level Peace Domain feature The bond you forge between people helps them protect each other. When a creature affected by your Emboldening Bond feature is about to take damage, a second bonded creature within 30 feet of the first can use its reaction to teleport to an unoccupied space within 5 feet of the first creature. The second creature then takes all the damage instead.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Potent Spellcasting feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Potent Spellcasting",
          "level": 8,
          "description": "8th-level Peace Domain feature You add your Wisdom modifier to the damage you deal with any cleric cantrip.",
          "resource": null
        },
        {
          "name": "Expansive Bond",
          "level": 17,
          "description": "17th-level Peace Domain feature The benefits of your Emboldening Bond and Protective Bond features now work when the creatures are within 60 feet of each other. Moreover, when a creature uses Protective Bond to take someone else's damage, the creature has resistance to that damage.",
          "resource": null
        }
      ]
    },
    "Twilight Domain": {
      "name": "Twilight Domain",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Twilight Domain",
          "level": 1,
          "description": "The twilit transition from light into darkness often brings calm and even joy, as the day's labors end and the hours of rest begin. The darkness can also bring terrors, but the gods of twilight guard against the horrors of the night. Clerics who serve these deities-examples of which appear on the Twilight Deities table-bring comfort to those who seek rest and protect them by venturing into the encroaching darkness to ensure that the dark is a comfort, not a terror. Domain Spells: 1st-level Twilight Domain feature You gain domain spells at the cleric levels listed in the Twilight Domain Spells table. See the Divine Domain class feature for how domain spells work.",
          "resource": null
        },
        {
          "name": "Bonus Proficiencies",
          "level": 1,
          "description": "1st-level Twilight Domain feature You gain proficiency with martial weapons and heavy armor.",
          "resource": null
        },
        {
          "name": "Eyes of Night",
          "level": 1,
          "description": "1st-level Twilight Domain feature You can see through the deepest gloom. You have darkvision out to a range of 300 feet. In that radius, you can see in dim light as if it were bright light and in darkness as if it were dim light. As an action, you can magically share the darkvision of this feature with willing creatures you can see within 10 feet of you, up to a number of creatures equal to your Wisdom modifier (minimum of one creature). The shared darkvision lasts for 1 hour. Once you share it, you can't do so again until you finish a long rest, unless you expend a spell slot of any level to share it again.",
          "resource": null
        },
        {
          "name": "Vigilant Blessing",
          "level": 1,
          "description": "1st-level Twilight Domain feature The night has taught you to be vigilant. As an action, you give one creature you touch (including possibly yourself) advantage on the next initiative roll the creature makes. This benefit ends immediately after the roll or if you use this feature again.",
          "resource": null
        },
        {
          "name": "Channel Divinity: Twilight Sanctuary",
          "level": 2,
          "description": "2nd-level Twilight Domain feature You can use your Channel Divinity to refresh your allies with soothing twilight. As an action, you present your holy symbol, and a sphere of twilight emanates from you. The sphere is centered on you, has a 30-foot radius, and is filled with dim light. The sphere moves with you, and it lasts for 1 minute or until you are incapacitated or die. Whenever a creature (including you) ends its turn in the sphere, you can grant that creature one of these benefits: You grant it temporary hit points equal to 1d6 plus your cleric level. You end one effect on it causing it to be charmed or frightened.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Steps of Night",
          "level": 6,
          "description": "6th-level Twilight Domain feature You can draw on the mystical power of night to rise into the air. As a bonus action when you are in dim light or darkness, you can magically give yourself a flying speed equal to your walking speed for 1 minute. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Blessed Strikes",
          "level": 8,
          "description": "8th-level cleric {@variantrule optional class features, which replaces the Divine Strike feature} You are blessed with divine might in battle. When a creature takes damage from one of your cantrips or weapon attacks, you can also deal 1d8 radiant damage to that creature. Once you deal this damage, you can't use this feature again until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Divine Strike",
          "level": 8,
          "description": "8th-level Twilight Domain feature You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage. When you reach 14th level, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Twilight Shroud",
          "level": 17,
          "description": "17th-level Twilight Domain feature The twilight that you summon offers a protective embrace: you and your allies have Cover while in the sphere created by your Twilight Sanctuary.",
          "resource": null
        }
      ]
    }
  },
  "Druid": {
    "Circle of the Land": {
      "name": "Circle of the Land",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Circle of the Land",
          "level": 3,
          "description": "Celebrate Connection to the Natural World The Circle of the Land comprises mystics and sages who safeguard ancient knowledge and rites. These Druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of their communities.",
          "resource": null
        },
        {
          "name": "Circle of the Land Spells",
          "level": 3,
          "description": "Whenever you finish a Long Rest, choose one type of land: arid, polar, temperate, or tropical. Consult the table below that corresponds to the chosen type; you have the spells listed for your Druid level and lower prepared.",
          "resource": null
        },
        {
          "name": "Land's Aid",
          "level": 3,
          "description": "As a Magic action, you can expend a use of your Wild Shape and choose a point within 60 feet of yourself. Vitality-giving flowers and life-draining thorns appear for a moment in a 10-foot-radius Sphere [Area of Effect] centered on that point. Each creature of your choice in the Sphere [Area of Effect] must make a Constitution saving throw against your spell save DC, taking 2d6 Necrotic damage on a failed save or half as much damage on a successful one. One creature of your choice in that area regains 2d6 Hit Points. The damage and healing increase by 1d6 when you reach Druid levels 10 (3d6) and 14 (4d6).",
          "resource": null
        },
        {
          "name": "Natural Recovery",
          "level": 6,
          "description": "You can cast one of the level 1+ spells that you have prepared from your Circle Spells feature without expending a spell slot, and you must finish a Long Rest before you do so again. In addition, when you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your Druid level (round up), and none of them can be level 6+. For example, if you're a level 6 Druid, you can recover up to three levels' worth of spell slots. You can recover a level 3 spell slot, a level 2 and a level 1 spell slot, or three level 1 spell slots. Once you recover spell slots with this feature, you can't do so again until you fini",
          "resource": null
        },
        {
          "name": "Nature's Ward",
          "level": 10,
          "description": "You are immune to the Poisoned condition, and you have Resistance to a damage type associated with your current land choice in the Circle Spells feature, as shown in the Nature's Ward table.",
          "resource": null
        },
        {
          "name": "Nature's Sanctuary",
          "level": 14,
          "description": "As a Magic action, you can expend a use of your Wild Shape and cause spectral trees and vines to appear in a 15-foot Cube [Area of Effect] on the ground within 120 feet of yourself. They last there for 1 minute or until you have the Incapacitated condition or die. You and your allies have Cover while in that area, and your allies gain the current Resistance of your Nature's Ward while there. As a Bonus Action, you can move the Cube [Area of Effect] up to 60 feet to ground within 120 feet of yourself.",
          "resource": null
        }
      ]
    },
    "Circle of the Moon": {
      "name": "Circle of the Moon",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Circle Forms",
          "level": 3,
          "description": "You can channel lunar magic when you assume a Wild Shape form, granting you the benefits below. Challenge Rating: The maximum Challenge Rating for the form equals your Druid level divided by 3 (round down). Armor Class: Until you leave the form, your AC equals 13 plus your Wisdom modifier if that total is higher than the Beast's AC. Temporary Hit Points: You gain a number of Temporary Hit Points equal to three times your Druid level.",
          "resource": null
        },
        {
          "name": "Circle of the Moon",
          "level": 3,
          "description": "Adopt Animal Forms to Guard the Wilds Druids of the Circle of the Moon draw on lunar magic to transform themselves. Their order gathers under the moon to share news and perform rituals. Changeable as the moon, a Druid of this circle might prowl as a great cat one night, soar over the treetops as an eagle the next day, and then crash through undergrowth as a bear to drive off a trespassing monster. The wild is in the Druid's blood.",
          "resource": null
        },
        {
          "name": "Circle of the Moon Spells",
          "level": 3,
          "description": "When you reach a Druid level specified in the Circle of the Moon Spells table, you thereafter always have the listed spells prepared. In addition, you can cast the spells from this feature while you're in a Wild Shape form.",
          "resource": null
        },
        {
          "name": "Improved Circle Forms",
          "level": 6,
          "description": "While in a Wild Shape form, you gain the following benefits. Lunar Radiance: Each of your attacks in a Wild Shape form can deal its normal damage type or Radiant damage. You make this choice each time you hit with those attacks. Increased Toughness: You can add your Wisdom modifier to your Constitution saving throws.",
          "resource": null
        },
        {
          "name": "Moonlight Step",
          "level": 10,
          "description": "You magically transport yourself, reappearing amid a burst of moonlight. As a Bonus Action, you teleport up to 30 feet to an unoccupied space you can see, and you have Advantage on the next attack roll you make before the end of this turn. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. You can also regain uses by expending a level 2+ spell slot for each use you want to restore (no action required).",
          "resource": null
        },
        {
          "name": "Lunar Form",
          "level": 14,
          "description": "The power of the moon suffuses you, granting you the following benefits. Improved Lunar Radiance: Once per turn, you can deal an extra 2d10 Radiant damage to a target you hit with a Wild Shape form's attack. Shared Moonlight: Whenever you use Moonlight Step, you can also teleport one willing creature. That creature must be within 10 feet of you, and you teleport it to an unoccupied space you can see within 10 feet of your destination space.",
          "resource": null
        }
      ]
    },
    "Circle of Dreams": {
      "name": "Circle of Dreams",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Circle of Dreams",
          "level": 2,
          "description": "Druids who are members of the Circle of Dreams hail from regions that have strong ties to the Feywild and its dreamlike realms. The druids' guardianship of the natural world makes for a natural alliance between them and good-aligned fey. These druids seek to fill the world with dreamy wonder. Their magic mends wounds and brings joy to downcast hearts, and the realms they protect are gleaming, fruitful places, where dream and reality blur together and where the weary can find rest.",
          "resource": null
        },
        {
          "name": "Balm of the Summer Court",
          "level": 2,
          "description": "At 2nd level, you become imbued with the blessings of the Summer Court. You are a font of energy that offers respite from injuries. You have a pool of fey energy represented by a number of d6s equal to your druid level. As a bonus action, you can choose one creature you can see within 120 feet of you and spend a number of those dice equal to half your druid level or less. Roll the spent dice and add them together. The target regains a number of hit points equal to the total. The target also gains 1 temporary hit point per die spent. You regain all expended dice when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Hearth of Moonlight and Shadow",
          "level": 6,
          "description": "At 6th level, home can be wherever you are. During a short or long rest, you can invoke the shadowy power of the Gloaming Court to help guard your respite. At the start of the rest, you touch a point in space, and an invisible, 30-foot-radius sphere of magic appears, centered on that point. Cover blocks the sphere. While within the sphere, you and your allies gain a +5 bonus to Dexterity (Stealth) and Wisdom (Perception) checks, and any light from open flames in the sphere (a campfire, torches, or the like) isn't visible outside it. The sphere vanishes at the end of the rest or when you leave the sphere.",
          "resource": null
        },
        {
          "name": "Hidden Paths",
          "level": 10,
          "description": "Starting at 10th level, you can use the hidden, magical pathways that some fey use to traverse space in the blink of an eye. As a bonus action on your turn, you can teleport up to 60 feet to an unoccupied space you can see. Alternatively, you can use your action to teleport one willing creature you touch up to 30 feet to an unoccupied space you can see. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Walker in Dreams",
          "level": 14,
          "description": "At 14th level, the magic of the Feywild grants you the ability to travel mentally or physically through dreamlands. When you finish a short rest, you can cast one of the following spells, without expending a spell slot or requiring material components: dream (with you as the messenger), scrying, or teleportation circle. This use of teleportation circle is special. Rather than opening a portal to a permanent teleportation circle, it opens a portal to the last location where you finished a long rest on your current plane of existence. If you haven't taken a long rest on your current plane, the spell fails but isn't wasted. Once you use this feature, you can't use it again until you finish a lo",
          "resource": null
        }
      ]
    },
    "Circle of the Shepherd": {
      "name": "Circle of the Shepherd",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Circle of the Shepherd",
          "level": 2,
          "description": "Druids of the Circle of the Shepherd commune with the spirits of nature, especially the spirits of beasts and the fey, and call to those spirits for aid. These druids recognize that all living things play a role in the natural world, yet they focus on protecting animals and fey creatures that have difficulty defending themselves. Shepherds, as they are known, see such creatures as their charges. They ward off monsters that threaten them, rebuke hunters who kill more prey than necessary, and prevent civilization from encroaching on rare animal habitats and on sites sacred to the fey. Many of these druids are happiest far from cities and towns, content to spend their days in the company of ani",
          "resource": null
        },
        {
          "name": "Speech of the Woods",
          "level": 2,
          "description": "At 2nd level, you gain the ability to converse with beasts and many fey. You learn to speak, read, and write Sylvan. In addition, beasts can understand your speech, and you gain the ability to decipher their noises and motions. Most beasts lack the intelligence to convey or understand sophisticated concepts, but a friendly beast could relay what it has seen or heard in the recent past. This ability doesn't grant you friendship with beasts, though you can combine this ability with gifts to curry favor with them as you would with any nonplayer character.",
          "resource": null
        },
        {
          "name": "Spirit Totem",
          "level": 2,
          "description": "Starting at 2nd level, you can call forth nature spirits to influence the world around you. As a bonus action, you can magically summon an incorporeal spirit to a point you can see within 60 feet of you. The spirit creates an aura in a 30-foot radius around that point. It counts as neither a creature nor an object, though it has the spectral appearance of the creature it represents. As a bonus action, you can move the spirit up to 60 feet to a point you can see. The spirit persists for 1 minute or until you're incapacitated. Once you use this feature, you can't use it again until you finish a short or long rest. The effect of the spirit's aura depends on the type of spirit you summon from th",
          "resource": null
        },
        {
          "name": "Mighty Summoner",
          "level": 6,
          "description": "Starting at 6th level, beasts and fey that you conjure are more resilient than normal. Any beast or fey summoned or created by a spell that you cast gains the following benefits: The creature appears with more hit points than normal: 2 extra hit points per Hit Die it has. The damage from its natural weapons is considered magical for the purpose of overcoming immunity and resistance to nonmagical attacks and damage.",
          "resource": null
        },
        {
          "name": "Guardian Spirit",
          "level": 10,
          "description": "Beginning at 10th level, your Spirit Totem safeguards the beasts and fey that you call forth with your magic. When a beast or fey that you summoned or created with a spell ends its turn in your Spirit Totem aura, that creature regains a number of hit points equal to half your druid level.",
          "resource": null
        },
        {
          "name": "Faithful Summons",
          "level": 14,
          "description": "Starting at 14th level, the nature spirits you commune with protect you when you are the most defenseless. If you are reduced to 0 hit points or are incapacitated against your will, you can immediately gain the benefits of conjure animals as if it were cast using a 9th-level spell slot. It summons four beasts of your choice that are challenge rating 2 or lower. The conjured beasts appear within 20 feet of you. If they receive no commands from you, they protect you from harm and attack your foes. The spell lasts for 1 hour, requiring no concentration, or until you dismiss it (no action required). Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Circle of Spores": {
      "name": "Circle of Spores",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Circle of Spores",
          "level": 2,
          "description": "Druids of the Circle of Spores find beauty in decay. They see within mold and other fungi the ability to transform lifeless material into abundant, albeit somewhat strange, life. These druids believe that life and death are parts of a grand cycle, with one leading to the other and then back again. Death isn't the end of life, but instead a change of state that sees life shift into a new form. Druids of this circle have a complex relationship with the undead. Unlike most other druids, they see nothing inherently wrong with undeath, which they consider to be a companion to life and death. But these druids believe that the natural cycle is healthiest when each segment of it is vibrant and chang",
          "resource": null
        },
        {
          "name": "Circle Spells",
          "level": 2,
          "description": "Your symbiotic link to fungus and your ability to tap into the cycle of life and death grants you access to certain spells. At 2nd level, you learn the chill touch cantrip. At 3rd, 5th, 7th, and 9th level you gain access to the spells listed for that level in the Circle of Spores Spells table. Once you gain access to one of these spells, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the druid spell list, the spell is nonetheless a druid spell for you.",
          "resource": null
        },
        {
          "name": "Halo of Spores",
          "level": 2,
          "description": "Starting at 2nd level, you are surrounded by invisible, necrotic spores that are harmless until you unleash them on a creature nearby. When a creature you can see moves into a space within 10 feet of you or starts its turn there, you can use your reaction to deal 1d4 necrotic damage to that creature unless it succeeds on a Constitution saving throw against your spell save DC. The necrotic damage increases to 1d6 at 6th level, 1d8 at 10th level, and 1d10 at 14th level.",
          "resource": null
        },
        {
          "name": "Symbiotic Entity",
          "level": 2,
          "description": "At 2nd level, you gain the ability to channel magic into your spores. As an action, you can expend a use of your Wild Shape feature to awaken those spores, rather than transforming into a beast form, and you gain 4 temporary hit points for each level you have in this class. While this feature is active, you gain the following benefits: When you deal your Halo of Spores damage, roll the damage die a second time and add it to the total. Your melee weapon attacks deal an extra 1d6 necrotic damage to any target they hit. These benefits last for 10 minutes, until you lose all these temporary hit points, or until you use your Wild Shape again.",
          "resource": null
        },
        {
          "name": "Fungal Infestation",
          "level": 6,
          "description": "At 6th level, your spores gain the ability to infest a corpse and animate it. If a beast or a humanoid that is Small or Medium dies within 10 feet of you, you can use your reaction to animate it, causing it to stand up immediately with 1 hit point. The creature uses the zombie stat block in the . It remains animate for 1 hour, after which time it collapses and dies. In combat, the zombie's turn comes immediately after yours. It obeys your mental commands, and the only action it can take is the Attack action, making one melee attack. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Spreading Spores",
          "level": 10,
          "description": "At 10th level, you gain the ability to seed an area with deadly spores. As a bonus action while your Symbiotic Entity feature is active, you can hurl spores up to 30 feet away, where they swirl in a 10-foot cube for 1 minute. The spores disappear early if you use this feature again, if you dismiss them as a bonus action, or if your Symbiotic Entity feature is no longer active. Whenever a creature moves into the cube or starts its turn there, that creature takes your Halo of Spores damage, unless the creature succeeds on a Constitution saving throw against your spell save DC. A creature can take this damage no more than once per turn. While the cube of spores persists, you can't use your Halo",
          "resource": null
        },
        {
          "name": "Fungal Body",
          "level": 14,
          "description": "At 14th level, the fungal spores in your body alter you: you can't be blinded, deafened, frightened, or poisoned, and any critical hit against you counts as a normal hit instead, unless you're incapacitated.",
          "resource": null
        }
      ]
    },
    "Circle of Stars": {
      "name": "Circle of Stars",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Circle of Stars",
          "level": 2,
          "description": "The Circle of Stars allows druids to draw on the power of starlight. These druids have tracked heavenly patterns since time immemorial, discovering secrets hidden amid the constellations. By revealing and understanding these secrets, the Circle of the Stars seeks to harness the powers of the cosmos. Many druids of this circle keep records of the constellations and the stars' effects on the world. Some groups document these observations at megalithic sites, which serve as enigmatic libraries of lore. These repositories might take the form of stone circles, pyramids, petroglyphs, and underground temples-any construction durable enough to protect the circle's sacred knowledge even against a gre",
          "resource": null
        },
        {
          "name": "Star Map",
          "level": 2,
          "description": "2nd-level Circle of the Stars feature You've created a star chart as part of your heavenly studies. It is a Tiny object and can serve as a spellcasting focus for your druid spells. You determine its form by rolling on the Star Map table or by choosing one. While holding this map, you have these benefits: You know the guidance cantrip. You have the guiding bolt spell prepared. It counts as a druid spell for you, and it doesn't count against the number of spells you can have prepared. You can cast guiding bolt without expending a spell slot. You can do so a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. If you lose the map, you ca",
          "resource": null
        },
        {
          "name": "Starry Form",
          "level": 2,
          "description": "2nd-level Circle of the Stars feature As a bonus action, you can expend a use of your Wild Shape feature to take on a starry form, rather than transforming into a beast. While in your starry form, you retain your game statistics, but your body becomes luminous; your joints glimmer like stars, and glowing lines connect them as on a star chart. This form sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The form lasts for 10 minutes. It ends early if you dismiss it (no action required), are incapacitated, die, or use this feature again. Whenever you assume your starry form, choose which of the following constellations glimmers on your body; your choice gives you c",
          "resource": null
        },
        {
          "name": "Archer",
          "level": 2,
          "description": "A constellation of an archer appears on you. When you activate this form, and as a bonus action on your subsequent turns while it lasts, you can make a ranged spell attack, hurling a luminous arrow that targets one creature within 60 feet of you. On a hit, the attack deals radiant damage equal to 1d8 + your Wisdom modifier.",
          "resource": null
        },
        {
          "name": "Chalice",
          "level": 2,
          "description": "A constellation of a life-giving goblet appears on you. Whenever you cast a spell using a spell slot that restores hit points to a creature, you or another creature within 30 feet of you can regain hit points equal to 1d8 + your Wisdom modifier.",
          "resource": null
        },
        {
          "name": "Dragon",
          "level": 2,
          "description": "A constellation of a wise dragon appears on you. When you make an Intelligence or a Wisdom check or a Constitution saving throw to maintain concentration on a spell, you can treat a roll of 9 or lower on the d20 as a 10.",
          "resource": null
        },
        {
          "name": "Cosmic Omen",
          "level": 6,
          "description": "6th-level Circle of the Stars feature Whenever you finish a long rest, you can consult your Star Map for omens. When you do so, roll a die. Until you finish your next long rest, you gain access to a special reaction based on whether you rolled an even or an odd number on the die: You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Twinkling Constellations",
          "level": 10,
          "description": "10th-level Circle of the Stars feature The constellations of your Starry Form improve. The 1d8 of the Archer and the Chalice becomes 2d8, and while the Dragon is active, you have a flying speed of 20 feet and can hover. Moreover, at the start of each of your turns while in your Starry Form, you can change which constellation glimmers on your body.",
          "resource": null
        },
        {
          "name": "Full of Stars",
          "level": 14,
          "description": "14th-level Circle of the Stars feature While in your Starry Form, you become partially incorporeal, giving you resistance to bludgeoning, piercing, and slashing damage.",
          "resource": null
        }
      ]
    },
    "Circle of Wildfire": {
      "name": "Circle of Wildfire",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Circle of Wildfire",
          "level": 2,
          "description": "Druids within the Circle of Wildfire understand that destruction is sometimes the precursor of creation, such as when a forest fire promotes later growth. These druids bond with a primal spirit that harbors both destructive and creative power, allowing the druids to create controlled flames that burn away one thing but give life to another.",
          "resource": null
        },
        {
          "name": "Circle Spells",
          "level": 2,
          "description": "2nd-level Circle of Wildfire feature You have formed a bond with a wildfire spirit, a primal being of creation and destruction. Your link with this spirit grants you access to some spells when you reach certain levels in this class, as shown on the Circle of Wildfire Spells table. Once you gain access to one of these spells, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the druid spell list, the spell is nonetheless a druid spell for you.",
          "resource": null
        },
        {
          "name": "Summon Wildfire Spirit",
          "level": 2,
          "description": "2nd-level Circle of Wildfire feature You can summon the primal spirit bound to your soul. As an action, you can expend one use of your Wild Shape feature to summon your wildfire spirit, rather than assuming a beast form. The spirit appears in an unoccupied space of your choice that you can see within 30 feet of you. Each creature within 10 feet of the spirit (other than you) when it appears must succeed on a Dexterity saving throw against your spell save DC or take 2d6 fire damage. The spirit is friendly to you and your companions and obeys your commands. See this creature's game statistics in the Wildfire Spirit stat block, which uses your proficiency bonus (PB) in several places. You deter",
          "resource": null
        },
        {
          "name": "Enhanced Bond",
          "level": 6,
          "description": "6th-level Circle of Wildfire feature The bond with your wildfire spirit enhances your destructive and restorative spells. Whenever you cast a spell that deals fire damage or restores hit points while your wildfire spirit is summoned, roll a d8, and you gain a bonus equal to the number rolled to one damage or healing roll of the spell. In addition, when you cast a spell with a range other than self, the spell can originate from you or your wildfire spirit.",
          "resource": null
        },
        {
          "name": "Cauterizing Flames",
          "level": 10,
          "description": "10th-level Circle of Wildfire feature You gain the ability to turn death into magical flames that can heal or incinerate. When a Small or larger creature dies within 30 feet of you or your wildfire spirit, a harmless spectral flame springs forth in the dead creature's space and flickers there for 1 minute. When a creature you can see enters that space, you can use your reaction to extinguish the spectral flame there and either heal the creature or deal fire damage to it. The healing or damage equals 2d10 + your Wisdom modifier. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Blazing Revival",
          "level": 14,
          "description": "14th-level Circle of Wildfire feature The bond with your wildfire spirit can save you from death. If the spirit is within 120 feet of you when you are reduced to 0 hit points and thereby fall unconscious, you can cause the spirit to drop to 0 hit points. You then regain half your hit points and immediately rise to your feet. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Circle of the Sea": {
      "name": "Circle of the Sea",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Circle of the Sea",
          "level": 3,
          "description": "Become One with Tides and Storms Druids of the Circle of the Sea draw on the tempestuous forces of oceans and storms. Some view themselves as embodiments of nature's wrath, seeking vengeance against those who despoil nature. Others seek mystical unity with nature by attuning themselves to the ebb and flow of the tides, following the rush of currents and waves and listening to the inscrutable whispers and roars of the winds.",
          "resource": null
        },
        {
          "name": "Circle of the Sea Spells",
          "level": 3,
          "description": "When you reach a Druid level specified in the Circle of the Sea Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Wrath of the Sea",
          "level": 3,
          "description": "As a Bonus Action, you can expend a use of your Wild Shape to manifest a 5-foot Emanation [Area of Effect] that takes the form of ocean spray that surrounds you for 10 minutes. It ends early if you dismiss it (no action required), manifest it again, or have the Incapacitated condition. When you manifest the Emanation [Area of Effect] and as a Bonus Action on your subsequent turns, you can choose another creature you can see in the Emanation [Area of Effect]. The target must succeed on a Constitution saving throw against your spell save DC or take Cold damage and, if the creature is Large or smaller, be pushed up to 15 feet away from you. To determine this damage, roll a number of d6s equal t",
          "resource": null
        },
        {
          "name": "Aquatic Affinity",
          "level": 6,
          "description": "The size of the Emanation [Area of Effect] created by your Wrath of the Sea increases to 10 feet. In addition, you gain a Swim Speed equal to your Speed.",
          "resource": null
        },
        {
          "name": "Stormborn",
          "level": 10,
          "description": "Your Wrath of the Sea confers two more benefits while active, as detailed below. Flight: You gain a Fly Speed equal to your Speed. Resistance: You have Resistance to Cold, Lightning, and Thunder damage.",
          "resource": null
        },
        {
          "name": "Oceanic Gift",
          "level": 14,
          "description": "Instead of manifesting the Emanation [Area of Effect] of Wrath of the Sea around yourself, you can manifest it around one willing creature within 60 feet of yourself. That creature gains all the benefits of the Emanation [Area of Effect] and uses your spell save DC and Wisdom modifier for it. In addition, you can manifest the Emanation [Area of Effect] around both the other creature and yourself if you expend two uses of your Wild Shape instead of one when manifesting it.",
          "resource": null
        }
      ]
    },
    "Circle of the Stars": {
      "name": "Circle of the Stars",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Circle of the Stars",
          "level": 3,
          "description": "Harness Secrets Hidden in Constellations The Circle of the Stars has tracked heavenly patterns since time immemorial, discovering secrets hidden amid the constellations. By understanding these secrets, the Druids of this circle seek to harness the powers of the cosmos.",
          "resource": null
        },
        {
          "name": "Star Map",
          "level": 3,
          "description": "You've created a star chart as part of your heavenly studies. It is a Tiny object, and you can use it as a Spellcasting Focus for your Druid spells. You determine its form by rolling on the Star Map table or by choosing one. While holding the map, you have the Guidance and Guiding Bolt spells prepared, and you can cast Guiding Bolt without expending a spell slot. You can cast it in that way a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. If you lose the map, you can perform a 1-hour ceremony to magically create a replacement. This ceremony can be performed during a Short Rest or Long Rest, and it destroys the pr",
          "resource": null
        },
        {
          "name": "Starry Form",
          "level": 3,
          "description": "As a Bonus Action, you can expend a use of your Wild Shape feature to take on a starry form rather than shape-shifting. While in your starry form, you retain your game statistics, but your body becomes luminous, your joints glimmer like stars, and glowing lines connect them as on a star chart. This form sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. The form lasts for 10 minutes. It ends early if you dismiss it (no action required), have the Incapacitated condition, or use this feature again. Whenever you assume your starry form, choose which of the following constellations glimmers on your body; your choice gives you certain benefits while in the form.",
          "resource": null
        },
        {
          "name": "Archer",
          "level": 3,
          "description": "A constellation of an archer appears on you. When you activate this form and as a Bonus Action on your subsequent turns while it lasts, you can make a ranged spell attack, hurling a luminous arrow that targets one creature within 60 feet of yourself. On a hit, the attack deals Radiant damage equal to 1d8 plus your Wisdom modifier.",
          "resource": null
        },
        {
          "name": "Chalice",
          "level": 3,
          "description": "A constellation of a life-giving goblet appears on you. Whenever you cast a spell using a spell slot that restores Hit Points to a creature, you or another creature within 30 feet of you can regain Hit Points equal to 1d8 plus your Wisdom modifier.",
          "resource": null
        },
        {
          "name": "Dragon",
          "level": 3,
          "description": "A constellation of a wise dragon appears on you. When you make an Intelligence or a Wisdom check or a Constitution saving throw to maintain Concentration, you can treat a roll of 9 or lower on the d20 as a 10.",
          "resource": null
        },
        {
          "name": "Cosmic Omen",
          "level": 6,
          "description": "Whenever you finish a Long Rest, you can consult your Star Map for omens and roll a die. Until you finish your next Long Rest, you gain access to a special Reaction based on whether you rolled an even or an odd number on the die: Whenever a creature you can see within 30 feet of you is about to make a D20 Test, you can take a Reaction to roll 1d6 and add the number rolled to the total. Whenever a creature you can see within 30 feet of you is about to make a D20 Test, you can take a Reaction to roll 1d6 and subtract the number rolled from the total. You can use this Reaction a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a L",
          "resource": null
        },
        {
          "name": "Twinkling Constellations",
          "level": 10,
          "description": "The constellations of your Starry Form improve. The 1d8 of the Archer and the Chalice becomes 2d8, and while the Dragon is active, you have a Fly Speed of 20 feet and can hover. Moreover, at the start of each of your turns while in your Starry Form, you can change which constellation glimmers on your body.",
          "resource": null
        },
        {
          "name": "Full of Stars",
          "level": 14,
          "description": "While in your Starry Form, you become partially incorporeal, giving you Resistance to Bludgeoning, Piercing, and Slashing damage.",
          "resource": null
        }
      ]
    }
  },
  "Fighter": {
    "Battle Master": {
      "name": "Battle Master",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Battle Master",
          "level": 3,
          "description": "Master Sophisticated Battle Maneuvers Battle Masters are students of the art of battle, learning martial techniques passed down through generations. The most accomplished Battle Masters are well-rounded figures who combine their carefully honed combat skills with academic study in the fields of history, theory, and the arts.",
          "resource": null
        },
        {
          "name": "Combat Superiority",
          "level": 3,
          "description": "Your experience on the battlefield has refined your fighting techniques. You learn maneuvers that are fueled by special dice called Superiority Dice. Maneuvers: You learn three maneuvers of your choice from the \"\" section later in this subclass's description. Many maneuvers enhance an attack in some way. You can use only one maneuver per attack. You learn two additional maneuvers of your choice when you reach Fighter levels 7, 10, and 15. Each time you learn new maneuvers, you can also replace one maneuver you know with a different one. Superiority Dice: You have four Superiority Dice, which are d8. A Superiority Die is expended when you use it. You regain all expended Superiority Dice when ",
          "resource": null
        },
        {
          "name": "Maneuver Options",
          "level": 3,
          "description": "The maneuvers are presented here in alphabetical order.",
          "resource": null
        },
        {
          "name": "Student of War",
          "level": 3,
          "description": "You gain proficiency with one type of Artisan's Tools of your choice, and you gain proficiency in one skill of your choice from the skills available to Fighters at level 1.",
          "resource": null
        },
        {
          "name": "Know Your Enemy",
          "level": 7,
          "description": "As a Bonus Action, you can discern certain strengths and weaknesses of a creature you can see within 30 feet of yourself; you know whether that creature has any Immunities, Resistances, or Vulnerabilities, and if the creature has any, you know what they are. Once you use this feature, you can't do so again until you finish a Long Rest. You can also restore a use of the feature by expending one Superiority Die (no action required).",
          "resource": null
        },
        {
          "name": "Improved Combat Superiority",
          "level": 10,
          "description": "Your Superiority Die becomes a d10.",
          "resource": null
        },
        {
          "name": "Relentless",
          "level": 15,
          "description": "Once per turn, when you use a maneuver, you can roll 1d8 and use the number rolled instead of expending a Superiority Die.",
          "resource": null
        },
        {
          "name": "Ultimate Combat Superiority",
          "level": 18,
          "description": "Your Superiority Die becomes a d12.",
          "resource": null
        }
      ]
    },
    "Champion": {
      "name": "Champion",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Champion",
          "level": 3,
          "description": "Pursue Physical Excellence in Combat A Champion focuses on the development of martial prowess in a relentless pursuit of victory. Champions combine rigorous training with physical excellence to deal devastating blows, withstand peril, and garner glory. Whether in athletic contests or bloody battle, Champions strive for the crown of the victor.",
          "resource": null
        },
        {
          "name": "Improved Critical",
          "level": 3,
          "description": "Your attack rolls with weapons and Unarmed Strikes can score a Critical Hit on a roll of 19 or 20 on the d20.",
          "resource": null
        },
        {
          "name": "Remarkable Athlete",
          "level": 3,
          "description": "Thanks to your athleticism, you have Advantage on Initiative rolls and Strength (Athletics) checks. In addition, immediately after you score a Critical Hit, you can move up to half your Speed without provoking Opportunity Attack.",
          "resource": null
        },
        {
          "name": "Additional Fighting Style",
          "level": 7,
          "description": "You gain another  of your choice.",
          "resource": null
        },
        {
          "name": "Heroic Warrior",
          "level": 10,
          "description": "The thrill of battle drives you toward victory. During combat, you can give yourself Heroic Inspiration whenever you start your turn without it.",
          "resource": null
        },
        {
          "name": "Superior Critical",
          "level": 15,
          "description": "Your attack rolls with weapons and Unarmed Strikes can now score a Critical Hit on a roll of 18–20 on the d20.",
          "resource": null
        },
        {
          "name": "Survivor",
          "level": 18,
          "description": "You attain the pinnacle of resilience in battle, giving you these benefits. Defy Death: You have Advantage on Death Saving Throw. Moreover, when you roll 18–20 on a Death Saving Throw, you gain the benefit of rolling a 20 on it. Heroic Rally: At the start of each of your turns, you regain Hit Points equal to 5 plus your Constitution modifier if you are Bloodied and have at least 1 Hit Points.",
          "resource": null
        }
      ]
    },
    "Eldritch Knight": {
      "name": "Eldritch Knight",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Eldritch Knight",
          "level": 3,
          "description": "Support Combat Skills with Arcane Magic Eldritch Knights combine the martial mastery common to all Fighters with a careful study of magic. Their spells both complement and extend their combat skills, providing additional protection to shore up their armor and also allowing them to engage many foes at once with explosive magic.",
          "resource": null
        },
        {
          "name": "Spellcasting",
          "level": 3,
          "description": "You have learned to cast spells. See  for the rules on spellcasting. The information below details how you use those rules as an Eldritch Knight. Cantrips: You know two cantrips of your choice from the  (see that class's section for its list). Ray of Frost and Shocking Grasp are recommended. Whenever you gain a Fighter level, you can replace one of these cantrips with another cantrip of your choice from the . When you reach Fighter level 10, you learn another Wizard cantrip of your choice. Spell Slots: The Eldritch Knight Spellcasting table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+:",
          "resource": null
        },
        {
          "name": "War Bond",
          "level": 3,
          "description": "You learn a ritual that creates a magical bond between yourself and one weapon. You perform the ritual over the course of 1 hour, which can be done during a Short Rest. The weapon must be within your reach throughout the ritual, at the conclusion of which you touch the weapon and forge the bond. The bond fails if another Fighter is bonded to the weapon or if the weapon is a magic item to which someone else is attuned. Once you have bonded a weapon to yourself, you can't be disarmed of that weapon unless you have the Incapacitated condition. If it is on the same plane of existence, you can summon that weapon as a Bonus Action, causing it to teleport instantly to your hand. You can have up to ",
          "resource": null
        },
        {
          "name": "War Magic",
          "level": 7,
          "description": "When you take the Attack action on your turn, you can replace one of the attacks with a casting of one of your Wizard cantrips that has a casting time of an action.",
          "resource": null
        },
        {
          "name": "Eldritch Strike",
          "level": 10,
          "description": "You learn how to make your weapon strikes undercut a creature's ability to withstand your spells. When you hit a creature with an attack using a weapon, that creature has Disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.",
          "resource": null
        },
        {
          "name": "Arcane Charge",
          "level": 15,
          "description": "When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see. You can teleport before or after the additional action.",
          "resource": null
        },
        {
          "name": "Improved War Magic",
          "level": 18,
          "description": "When you take the Attack action on your turn, you can replace two of the attacks with a casting of one of your level 1 or level 2 Wizard spells that has a casting time of an action.",
          "resource": null
        }
      ]
    },
    "Purple Dragon Knight (Banneret)": {
      "name": "Purple Dragon Knight (Banneret)",
      "source": "Sword Coast Guide",
      "features": [
        {
          "name": "Purple Dragon Knight (Banneret)",
          "level": 3,
          "description": "Purple Dragon Knights are warriors who hail from the kingdom of Cormyr. Pledged to protect the crown, they take the fight against evil beyond the kingdom's borders. They are tasked with wandering the land as knights errant, relying on their judgment, bravery, and fidelity to guide them in defeating evildoers. A Purple Dragon Knight inspires greatness in others by committing brave deeds in battle. The mere presence of a knight in a hamlet is enough to cause some orcs and bandits to seek easier prey. A lone knight is a skilled warrior, but a knight leading a band of allies can transform even the most poorly equipped militia into a ferocious war band. A knight prefers to lead through deeds, not",
          "resource": null
        },
        {
          "name": "Rallying Cry",
          "level": 3,
          "description": "When you choose this archetype at 3rd level, you learn how to inspire your allies to fight on past their injuries. When you use your Second Wind feature, you can choose up to three creatures within 60 feet of you that are allied with you. Each one regains hit points equal to your fighter level, provided that the creature can see or hear you.",
          "resource": null
        },
        {
          "name": "Restriction: Knighthood",
          "level": 3,
          "description": "Purple Dragon Knights are tied to a specific order of Cormyrean knighthood. Banneret serves as the generic name for this archetype if you use it in other campaign settings or to model warlords other than the Purple Dragon Knights.",
          "resource": null
        },
        {
          "name": "Royal Envoy",
          "level": 7,
          "description": "A Purple Dragon Knight serves as an envoy of the Cormyrean crown. Knights of high standing are expected to conduct themselves with grace. At 7th level, you gain proficiency in the Persuasion skill. If you are already proficient in it, you gain proficiency in one of the following skills of your choice: Animal Handling, Insight, Intimidation, or Performance. Your proficiency bonus is doubled for any ability check you make that uses Persuasion. You receive this benefit regardless of the skill proficiency you gain from this feature.",
          "resource": null
        },
        {
          "name": "Inspiring Surge",
          "level": 10,
          "description": "Starting at 10th level, when you use your Action Surge feature, you can choose one creature within 60 feet of you that is allied with you. That creature can make one melee or ranged weapon attack with its reaction, provided that it can see or hear you. Starting at 18th level, you can choose two allies within 60 feet of you, rather than one.",
          "resource": null
        },
        {
          "name": "Bulwark",
          "level": 15,
          "description": "Beginning at 15th level, you can extend the benefit of your Indomitable feature to an ally. When you decide to use Indomitable to reroll an Intelligence, a Wisdom, or a Charisma saving throw and you aren't incapacitated, you can choose one ally within 60 feet of you that also failed its saving throw against the same effect. If that creature can see or hear you, it can reroll its saving throw and must use the new roll.",
          "resource": null
        }
      ]
    },
    "Arcane Archer": {
      "name": "Arcane Archer",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Arcane Archer",
          "level": 3,
          "description": "An Arcane Archer studies a unique elven method of archery that weaves magic into attacks to produce supernatural effects. Arcane Archers are some of the most elite warriors among the elves. They stand watch over the fringes of elven domains, keeping a keen eye out for trespassers and using magic-infused arrows to defeat monsters and invaders before they can reach elven settlements. Over the centuries, the methods of these elf archers have been learned by members of other races who can also balance arcane aptitude with archery.",
          "resource": null
        },
        {
          "name": "Arcane Archer Lore",
          "level": 3,
          "description": "At 3rd level, you learn magical theory or some of the secrets of nature—typical for practitioners of this elven martial tradition. You choose to gain proficiency in either the Arcana or the Nature skill, and you choose to learn either the prestidigitation or the druidcraft cantrip.",
          "resource": null
        },
        {
          "name": "Arcane Shot",
          "level": 3,
          "description": "At 3rd level, you learn to unleash special magical effects with some of your shots. When you gain this feature, you learn two Arcane Shot options of your choice (see \"Arcane Shot Options\" below). Once per turn when you fire an arrow from a shortbow or longbow as part of the Attack action, you can apply one of your Arcane Shot options to that arrow. You decide to use the option when the arrow hits a creature, unless the option doesn't involve an attack roll. You have two uses of this ability, and you regain all expended uses of it when you finish a short or long rest. You gain an additional Arcane Shot option of your choice when you reach certain levels in this class: 7th, 10th, 15th, and 18t",
          "resource": null
        },
        {
          "name": "Arcane Shot Options",
          "level": 3,
          "description": "The Arcane Shot feature lets you choose options for it at certain levels. The options are presented here in alphabetical order. They are all magical effects, and each one is associated with one of the schools of magic. If an option requires a saving throw, your Arcane Shot save DC is calculated as follows:",
          "resource": null
        },
        {
          "name": "Additional Arcane Shot Option",
          "level": 7,
          "description": "You gain an additional Arcane Shot option of your choice when you reach 7th level.",
          "resource": null
        },
        {
          "name": "Curving Shot",
          "level": 7,
          "description": "At 7th level, you learn how to direct an errant arrow toward a new target. When you make an attack roll with a magic arrow and miss, you can use a bonus action to reroll the attack roll against a different target within 60 feet of the original target.",
          "resource": null
        },
        {
          "name": "Magic Arrow",
          "level": 7,
          "description": "At 7th level, you gain the ability to infuse arrows with magic. Whenever you fire a nonmagical arrow from a shortbow or longbow, you can make it magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. The magic fades from the arrow immediately after it hits or misses its target.",
          "resource": null
        },
        {
          "name": "Ever-Ready Shot",
          "level": 15,
          "description": "Starting at 15th level, your magical archery is available whenever battle starts. If you roll initiative and have no uses of Arcane Shot remaining, you regain one use of it.",
          "resource": null
        }
      ]
    },
    "Cavalier": {
      "name": "Cavalier",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Cavalier",
          "level": 3,
          "description": "The archetypal Cavalier excels at mounted combat. Usually born among the nobility and raised at court, a Cavalier is equally at home leading a cavalry charge or exchanging repartee at a state dinner. Cavaliers also learn how to guard those in their charge from harm, often serving as the protectors of their superiors and of the weak. Compelled to right wrongs or earn prestige, many of these fighters leave their lives of comfort to embark on glorious adventure.",
          "resource": null
        },
        {
          "name": "Bonus Proficiency",
          "level": 3,
          "description": "When you choose this archetype at 3rd level, you gain proficiency in one of the following skills of your choice: Animal Handling, History, Insight, Performance, or Persuasion. Alternatively, you learn one language of your choice.",
          "resource": null
        },
        {
          "name": "Born to the Saddle",
          "level": 3,
          "description": "Starting at 3rd level, your mastery as a rider becomes apparent. You have advantage on saving throws made to avoid falling off your mount. If you fall off your mount and descend no more than 10 feet, you can land on your feet if you're not incapacitated. Finally, mounting or dismounting a creature costs you only 5 feet of movement, rather than half your speed.",
          "resource": null
        },
        {
          "name": "Unwavering Mark",
          "level": 3,
          "description": "Starting at 3rd level, you can menace your foes, foiling their attacks and punishing them for harming others. When you hit a creature with a melee weapon attack, you can mark the creature until the end of your next turn. This effect ends early if you are incapacitated or you die, or if someone else marks the creature. While it is within 5 feet of you, a creature marked by you has disadvantage on any attack roll that doesn't target you. In addition, if a creature marked by you deals damage to anyone other than you, you can make a special melee weapon attack against the marked creature as a bonus action on your next turn. You have advantage on the attack roll, and if it hits, the attack's weap",
          "resource": null
        },
        {
          "name": "Warding Maneuver",
          "level": 7,
          "description": "At 7th level, you learn to fend off strikes directed at you, your mount, or other creatures nearby. If you or a creature you can see within 5 feet of you is hit by an attack, you can roll 1d8 as a reaction if you're wielding a melee weapon or a shield. Roll the die, and add the number rolled to the target's AC against that attack. If the attack still hits, the target has resistance against the attack's damage. You can use this feature a number of times equal to your Constitution modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Hold the Line",
          "level": 10,
          "description": "At 10th level, you become a master of locking down your enemies. Creatures provoke an opportunity attack from you when they move 5 feet or more while within your reach, and if you hit a creature with an opportunity attack, the target's speed is reduced to 0 until the end of the current turn.",
          "resource": null
        },
        {
          "name": "Ferocious Charger",
          "level": 15,
          "description": "Starting at 15th level, you can run down your foes, whether you're mounted or not. If you move at least 10 feet in a straight line right before attacking a creature and you hit it with the attack, that target must succeed on a Strength saving throw (8 + your proficiency bonus + your Strength modifier) or be knocked prone. You can use this feature only once on each of your turns.",
          "resource": null
        },
        {
          "name": "Vigilant Defender",
          "level": 18,
          "description": "Starting at 18th level, you respond to danger with extraordinary vigilance. In combat, you get a special reaction that you can take once on every creature's turn, except your turn. You can use this special reaction only to make an opportunity attack, and you can't use it on the same turn that you take your normal reaction.",
          "resource": null
        }
      ]
    },
    "Samurai": {
      "name": "Samurai",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Samurai",
          "level": 3,
          "description": "The Samurai is a fighter who draws on an implacable fighting spirit to overcome enemies. A Samurai's resolve is nearly unbreakable, and the enemies in a Samurai's path have two choices: yield or die fighting.",
          "resource": null
        },
        {
          "name": "Bonus Proficiency",
          "level": 3,
          "description": "When you choose this archetype at 3rd level, you gain proficiency in one of the following skills of your choice: History, Insight, Performance, or Persuasion. Alternatively, you learn one language of your choice.",
          "resource": null
        },
        {
          "name": "Fighting Spirit",
          "level": 3,
          "description": "Starting at 3rd level, your intensity in battle can shield you and help you strike true. As a bonus action on your turn, you can give yourself advantage on weapon attack rolls until the end of the current turn. When you do so, you also gain 5 temporary hit points. The number of temporary hit points increases when you reach certain levels in this class, increasing to 10 at 10th level and 15 at 15th level. You can use this feature three times, and you regain all expended uses of it when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Elegant Courtier",
          "level": 7,
          "description": "Starting at 7th level, your discipline and attention to detail allow you to excel in social situations. Whenever you make a Charisma (Persuasion) check, you gain a bonus to the check equal to your Wisdom modifier. Your self-control also causes you to gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).",
          "resource": null
        },
        {
          "name": "Tireless Spirit",
          "level": 10,
          "description": "Starting at 10th level, when you roll initiative and have no uses of Fighting Spirit remaining, you regain one use.",
          "resource": null
        },
        {
          "name": "Rapid Strike",
          "level": 15,
          "description": "Starting at 15th level, you learn to trade accuracy for swift strikes. If you take the Attack action on your turn and have advantage on an attack roll against one of the targets, you can forgo the advantage for that roll to make an additional weapon attack against that target, as part of the same action. You can do so no more than once per turn.",
          "resource": null
        },
        {
          "name": "Strength before Death",
          "level": 18,
          "description": "Starting at 18th level, your fighting spirit can delay the grasp of death. If you take damage that reduces you to 0 hit points and doesn't kill you outright, you can use your reaction to delay falling unconscious, and you can immediately take an extra turn, interrupting the current turn. While you have 0 hit points during that extra turn, taking damage causes death saving throw failures as normal, and three death saving throw failures can still kill you. When the extra turn ends, you fall unconscious if you still have 0 hit points. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Echo Knight": {
      "name": "Echo Knight",
      "source": "Explorer's Guide to Wildemount",
      "features": [
        {
          "name": "Echo Knight",
          "level": 3,
          "description": "A mysterious and feared frontline warrior of the Kryn Dynasty, the Echo Knight has mastered the art of using dunamis to summon the fading shades of unrealized timelines to aid them in battle. Surrounded by echoes of their own might, they charge into the fray as a cycling swarm of shadows and strikes.",
          "resource": null
        },
        {
          "name": "Manifest Echo",
          "level": 3,
          "description": "3rd-level Echo Knight feature You can use a bonus action to magically manifest an echo of yourself in an unoccupied space you can see within 15 feet of you. This echo is a magical, translucent, gray image of you that lasts until it is destroyed, until you dismiss it as a bonus action, until you manifest another echo, or until you're incapacitated. Your echo has AC 14 + your proficiency bonus, 1 hit point, and immunity to all conditions. If it has to make a saving throw, it uses your saving throw bonus for the roll. It is the same size as you, and it occupies its space. On your turn, you can mentally command the echo to move up to 30 feet in any direction (no action required). If your echo is",
          "resource": null
        },
        {
          "name": "Unleash Incarnation",
          "level": 3,
          "description": "3rd-level Echo Knight feature You can heighten your echo's fury. Whenever you take the Attack action, you can make one additional melee attack from the echo's position. You can use this feature a number of times equal to your Constitution modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Echo Avatar",
          "level": 7,
          "description": "7th-level Echo Knight feature You can temporarily transfer your consciousness to your echo. As an action, you can see through your echo's eyes and hear through its ears. During this time, you are deafened and blinded. You can sustain this effect for up to 10 minutes, and you can end it at any time (requires no action). While your echo is being used in this way, it can be up to 1,000 feet away from you without being destroyed.",
          "resource": null
        },
        {
          "name": "Shadow Martyr",
          "level": 10,
          "description": "10th-level Echo Knight feature You can make your echo throw itself in front of an attack directed at another creature that you can see. Before the attack roll is made, you can use your reaction to teleport the echo to an unoccupied space within 5 feet of the targeted creature. The attack roll that triggered the reaction is instead made against your echo. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Reclaim Potential",
          "level": 15,
          "description": "15th-level Echo Knight feature You've learned to absorb the fleeting magic of your echo. When an echo of yours is destroyed by taking damage, you can gain a number of temporary hit points equal to 2d6 + your Constitution modifier, provided you don't already have temporary hit points. You can use this feature a number of times equal to your Constitution modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Legion of One",
          "level": 18,
          "description": "18th-level Echo Knight feature You can use a bonus action to create two echoes with your Manifest Echo feature, and these echoes can coexist. If you try to create a third echo, the previous two echoes are destroyed. Anything you can do from one echo's position can be done from the other's instead. In addition, when you roll initiative and have no uses of your Unleash Incarnation feature left, you regain one use of that feature.",
          "resource": null
        }
      ]
    },
    "Psi Warrior": {
      "name": "Psi Warrior",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Psi Warrior",
          "level": 3,
          "description": "Augment Physical Might with Psionic Power Psi Warriors awaken the power of their minds to augment their physical might. They harness this psionic power to infuse their weapon strikes, lash out with telekinetic energy, and create barriers of mental force.",
          "resource": null
        },
        {
          "name": "Psionic Power",
          "level": 3,
          "description": "You harbor a wellspring of psionic energy within yourself. It is represented by your Psionic Energy Dice, which fuel powers you have from this subclass. The Psi Warrior Energy Dice table shows the die size and number of these dice you have when you reach certain Fighter levels. Any features in this subclass that use a Psionic Energy Die use only the dice from this subclass. Some of your powers expend the Psionic Energy Die, as specified in a power's description, and you can't use a power if it requires you to use a die when all your Psionic Energy Dice are expended. You regain one of your expended Psionic Energy Dice when you finish a Short Rest, and you regain all of them when you finish a ",
          "resource": null
        },
        {
          "name": "Protective Field",
          "level": 3,
          "description": "When you or another creature you can see within 30 feet of you takes damage, you can take a Reaction to expend one Psionic Energy Die, roll the die, and reduce the damage taken by the number rolled plus your Intelligence modifier (minimum reduction of 1), as you create a momentary shield of telekinetic force.",
          "resource": null
        },
        {
          "name": "Psionic Strike",
          "level": 3,
          "description": "You can propel your weapons with psionic force. Once on each of your turns, immediately after you hit a target within 30 feet of yourself with an attack and deal damage to it with a weapon, you can expend one Psionic Energy Die, rolling it and dealing Force damage to the target equal to the number rolled plus your Intelligence modifier.",
          "resource": null
        },
        {
          "name": "Telekinetic Movement",
          "level": 3,
          "description": "You can move an object or a creature with your mind. As a Magic action, choose one target you can see within 30 feet of yourself; the target must be a loose object that is Large or smaller or one willing creature other than you. You transport the target up to 30 feet to an unoccupied space you can see. Alternatively, if the target is a Tiny object, you can transport it to or from your hand. Once you take this action, you can't do so again until you finish a Short Rest or Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it.",
          "resource": null
        },
        {
          "name": "Psi-Powered Leap",
          "level": 7,
          "description": "As a Bonus Action, you gain a Fly Speed equal to twice your Speed until the end of the current turn. Once you take this Bonus Action, you can't do so again until you finish a Short Rest or Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it.",
          "resource": null
        },
        {
          "name": "Telekinetic Adept",
          "level": 7,
          "description": "You have mastered new ways to use your telekinetic abilities, detailed below.",
          "resource": null
        },
        {
          "name": "Telekinetic Thrust",
          "level": 7,
          "description": "When you deal damage to a target with your Psionic Strike, you can force the target to make a Strength saving throw (8 plus your Intelligence modifier and Proficiency). On a failed save, you can give the target the Prone condition or transport it up to 10 feet horizontally.",
          "resource": null
        },
        {
          "name": "Guarded Mind",
          "level": 10,
          "description": "You have Resistance to Psychic damage. Moreover, if you start your turn with the Charmed or Frightened condition, you can expend a Psionic Energy Die (no action required) and end every effect on yourself giving you those conditions.",
          "resource": null
        },
        {
          "name": "Bulwark of Force",
          "level": 15,
          "description": "You can shield yourself and others with telekinetic force. As a Bonus Action, you can choose creatures, including yourself, within 30 feet of yourself, up to a number of creatures equal to your Intelligence modifier (minimum of one creature). Each of the chosen creatures has Cover for 1 minute or until you have the Incapacitated condition. Once you use this feature, you can't do so again until you finish a Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it.",
          "resource": null
        },
        {
          "name": "Telekinetic Master",
          "level": 18,
          "description": "You always have the Telekinesis spell prepared. With this feature, you can cast it without a spell slot or components, and your spellcasting ability for it is Intelligence. On each of your turns while you maintain Concentration on it, including the turn when you cast it, you can make one attack with a weapon as a Bonus Action. Once you cast the spell with this feature, you can't do so in this way again until you finish a Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it.",
          "resource": null
        }
      ]
    },
    "Rune Knight": {
      "name": "Rune Knight",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Rune Knight",
          "level": 3,
          "description": "Rune Knights enhance their martial prowess using the supernatural power of runes, an ancient practice that originated with giants. Rune cutters can be found among any family of giants, and you likely learned your methods first or second hand from such a mystical artisan. Whether you found the giant's work carved into a hill or cave, learned of the runes from a sage, or met the giant in person, you studied the giant's craft and learned how to apply magic runes to empower your equipment.",
          "resource": null
        },
        {
          "name": "Bonus Proficiencies",
          "level": 3,
          "description": "3rd-level Rune Knight feature You gain proficiency with smith's tools, and you learn to speak, read, and write Giant.",
          "resource": null
        },
        {
          "name": "Giant's Might",
          "level": 3,
          "description": "3rd-level Rune Knight feature You have learned how to imbue yourself with the might of giants. As a bonus action, you magically gain the following benefits, which last for 1 minute: If you are smaller than Large, you become Large, along with anything you are wearing. If you lack the room to become Large, your size doesn't change. You have advantage on Strength checks and Strength saving throws. Once on each of your turns, one of your attacks with a weapon or an unarmed strike can deal an extra 1d6 damage to a target on a hit. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses of it when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Rune Carver",
          "level": 3,
          "description": "3rd-level Rune Knight feature You can use magic runes to enhance your gear. You learn two runes of your choice, from among the runes described below, and each time you gain a level in this class, you can replace one rune you know with a different one from this feature. When you reach certain levels in this class, you learn additional runes, as shown in the Runes Known table. Whenever you finish a long rest, you can touch a number of objects equal to the number of runes you know, and you inscribe a different rune onto each of the objects. To be eligible, an object must be a weapon, a suit of armor, a shield, a piece of jewelry, or something else you can wear or hold in a hand. Your rune remai",
          "resource": null
        },
        {
          "name": "Additional Rune Known",
          "level": 7,
          "description": "7th-level Rune Knight feature You learn an additional Rune.",
          "resource": null
        },
        {
          "name": "Runic Shield",
          "level": 7,
          "description": "7th-level Rune Knight feature You learn to invoke your rune magic to protect your allies. When another creature you can see within 60 feet of you is hit by an attack roll, you can use your reaction to force the attacker to reroll the d20 and use the new roll. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Great Stature",
          "level": 10,
          "description": "10th-level Rune Knight feature The magic of your runes permanently alters you. When you gain this feature, roll 3d4. You grow a number of inches in height equal to the roll. Moreover, the extra damage you deal with your Giant's Might feature increases to 1d8.",
          "resource": null
        },
        {
          "name": "Master of Runes",
          "level": 15,
          "description": "15th-level Rune Knight feature You can invoke each rune you know from your Rune Carver feature twice, rather than once, and you regain all expended uses when you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Runic Juggernaut",
          "level": 18,
          "description": "18th-level Rune Knight feature You learn how to amplify your rune-powered transformation. As a result, the extra damage you deal with the Giant's Might feature increases to 1d10. Moreover, when you use that feature, your size can increase to Huge, and while you are that size, your reach increases by 5 feet.",
          "resource": null
        }
      ]
    },
    "Banneret": {
      "name": "Banneret",
      "source": "Heroes of the Frontier",
      "features": [
        {
          "name": "Banneret",
          "level": 3,
          "description": "Rally Fellow Heroes with Inspiring Leadership Bannerets are paragons of valor and leadership who protect the innocent and rally fellow adventurers to the causes of justice and freedom. Many are knights serving in Cormyr, the Silver Marches, Damara, Chessenta, or other lands across Faerûn. They wander the realms as knights errant, taking the fight against evil beyond their kingdom's borders. A Banneret relies on judgment, bravery, and fidelity to the code of chivalry to guide them in defeating evildoers. A lone Banneret is a skilled warrior, but when leading a band of allies one of these warriors can transform even a poorly equipped militia into a ferocious war band.",
          "resource": null
        },
        {
          "name": "Group Recovery",
          "level": 3,
          "description": "When you use your Second Wind to regain Hit Points, you can choose a number of allies within a 30-foot Emanation [Area of Effect] originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies regains Hit Points equal to 1d4 plus your Fighter level. Once you use this ability, you can't use it again until you finish a Short Rest or Long Rest.",
          "resource": null
        },
        {
          "name": "Knightly Envoy",
          "level": 3,
          "description": "You know how to conduct yourself with grace as a noble ambassador. You gain the following benefits. Comprehension: You can cast the Comprehend Languages spell but only as a Ritual. Charisma is your spellcasting ability for it. Polyglot: You learn one language from the language tables in the Player's Handbook or chapter 2 of this book. When you finish a Long Rest, you can replace a language learned from this benefit with another language you have heard, seen signed, or read in the past 24 hours. Well Spoken: You gain proficiency in one of the following skills of your choice: Insight, Intimidation, Persuasion, or Performance.",
          "resource": null
        },
        {
          "name": "Team Tactics",
          "level": 7,
          "description": "When you use Group Recovery, each chosen ally has Advantage on D20 Test until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Rallying Surge",
          "level": 10,
          "description": "When you use your Action Surge, you can choose allies within a 30-foot Emanation [Area of Effect] originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies can immediately take a Reaction to use one of the following options. Attack: The ally makes one attack with a weapon or an Unarmed Strike. Move: The ally moves up to half its Speed without provoking an Opportunity Attack.",
          "resource": null
        },
        {
          "name": "Shared Resilience",
          "level": 15,
          "description": "When an ally you can see within 60 feet of yourself fails a saving throw, you can take a Reaction to expend a use of your Indomitable feature. The ally can immediately reroll the saving throw with a bonus equal to your Fighter level; the ally must use the new roll.",
          "resource": null
        },
        {
          "name": "Inspiring Commander",
          "level": 18,
          "description": "You gain the following benefits. Bolstered Rally: The area of effect for both Group Recovery and Rallying Surge is now a 60-foot Emanation [Area of Effect]. Unshakable Bravery: You have Immunity to the Charmed and Frightened conditions.",
          "resource": null
        }
      ]
    }
  },
  "Monk": {
    "Way of Shadow": {
      "name": "Way of Shadow",
      "source": "PHB 2014",
      "features": [
        {
          "name": "Way of Shadow",
          "level": 3,
          "description": "Monks of the Way of Shadow follow a tradition that values stealth and subterfuge. These monks might be called ninjas or shadow dancers, and they serve as spies and assassins. Sometimes the members of a ninja monastery are family members, forming a clan sworn to secrecy about their arts and missions. Other monasteries are more like thieves' guilds, hiring out their services to nobles, rich merchants, or anyone else who can pay their fees. Regardless of their methods, the heads of these monasteries expect the unquestioning obedience of their students.",
          "resource": null
        },
        {
          "name": "Shadow Arts",
          "level": 3,
          "description": "You can use your ki to duplicate the effects of certain spells. As an action, you can spend 2 ki points to cast darkness, darkvision, pass without trace, or silence, without providing material components. Additionally, you gain the minor illusion cantrip if you don't already know it.",
          "resource": null
        },
        {
          "name": "Shadow Step",
          "level": 6,
          "description": "You gain the ability to step from one shadow into another. When you are in dim light or darkness, as a bonus action you can teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness. You then have advantage on the first melee attack you make before the end of the turn.",
          "resource": null
        },
        {
          "name": "Cloak of Shadows",
          "level": 11,
          "description": "By 11th level, you have learned to become one with the shadows. When you are in an area of dim light or darkness, you can use your action to become invisible. You remain invisible until you make an attack, cast a spell, or are in an area of bright light.",
          "resource": null
        },
        {
          "name": "Opportunist",
          "level": 17,
          "description": "At 17th level, you can exploit a creature's momentary distraction when it is hit by an attack. Whenever a creature within 5 feet of you is hit by an attack made by a creature other than you, you can use your reaction to make a melee attack against that creature.",
          "resource": null
        }
      ]
    },
    "Way of the Four Elements": {
      "name": "Way of the Four Elements",
      "source": "PHB 2014",
      "features": [
        {
          "name": "Way of the Four Elements",
          "level": 3,
          "description": "You follow a monastic tradition that teaches you to harness the elements. When you focus your ki, you can align yourself with the forces of creation and bend the four elements to your will, using them as an extension of your body. Some members of this tradition dedicate themselves to a single element, but others weave the elements together. Many monks of this tradition tattoo their bodies with representations of their ki powers, commonly imagined as coiling dragons, but also as phoenixes, fish, plants, mountains, and cresting waves.",
          "resource": null
        },
        {
          "name": "Disciple of the Elements",
          "level": 3,
          "description": "You learn magical disciplines that harness the power of the four elements. A discipline requires you to spend ki points each time you use it. You know the Elemental Attunement discipline and one other elemental discipline of your choice. You learn one additional elemental discipline of your choice at 6th, 11th, and 17th level. Whenever you learn a new elemental discipline, you can also replace one elemental discipline that you already know with a different discipline. Casting Elemental Spells: Some elemental disciplines allow you to cast spells. See  of the Player's Handbook for the general rules of spellcasting. To cast one of these spells, you use its casting time and other rules, but you ",
          "resource": null
        },
        {
          "name": "Elemental Disciplines",
          "level": 3,
          "description": "The elemental disciplines are presented in alphabetical order. If a discipline requires a level, you must be the level in this class to learn the discipline.",
          "resource": null
        },
        {
          "name": "Extra Elemental Discipline",
          "level": 6,
          "description": "You learn one additional elemental discipline of your choice. You should know 2 elemental disciplines, as well as Elemental Attunement. Whenever you learn a new elemental discipline, you can also replace one elemental discipline that you already know with a different discipline.",
          "resource": null
        }
      ]
    },
    "Way of the Open Hand": {
      "name": "Way of the Open Hand",
      "source": "PHB 2014",
      "features": [
        {
          "name": "Way of the Open Hand",
          "level": 3,
          "description": "Monks of the Way of the Open Hand are the ultimate masters of martial arts combat, whether armed or unarmed. They learn techniques to push and trip their opponents, manipulate ki to heal damage to their bodies, and practice advanced meditation that can protect them from harm.",
          "resource": null
        },
        {
          "name": "Open Hand Technique",
          "level": 3,
          "description": "You can manipulate your enemy's ki when you harness your own. Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects on that target. It must succeed on a Dexterity saving throw or be knocked prone. It must make a Strength saving throw. If it fails, you can push it up to 15 feet away from you. It can't take reactions until the end of your next turn.",
          "resource": null
        },
        {
          "name": "Wholeness of Body",
          "level": 6,
          "description": "You gain the ability to heal yourself. As an action, you can regain hit points equal to three times your monk level. You must finish a long rest before you can use this feature again.",
          "resource": null
        },
        {
          "name": "Tranquility",
          "level": 11,
          "description": "Beginning at 11th level, you can enter a special meditation that surrounds you with an aura of peace. At the end of a long rest, you gain the effect of a sanctuary spell that lasts until the start of your next long rest (the spell can end early as normal). The saving throw DC for the spell equals 8 + your Wisdom modifier + your proficiency bonus.",
          "resource": null
        },
        {
          "name": "Quivering Palm",
          "level": 17,
          "description": "You gain the ability to set up lethal vibrations in someone's body. When you hit a creature with an unarmed strike, you can spend 3 ki points to start these imperceptible vibrations, which last for a number of days equal to your monk level. The vibrations are harmless unless you use your action to end them. To do so, you and the target must be on the same plane of existence. When you use this action, the creature must make a Constitution saving throw. If it fails, it is reduced to 0 hit points. If it succeeds, it takes 10d10 necrotic damage. You can have only one creature under the effect of this feature at a time. You can choose to end the vibrations harmlessly without using an action.",
          "resource": null
        }
      ]
    },
    "Way of the Long Death": {
      "name": "Way of the Long Death",
      "source": "Sword Coast Guide",
      "features": [
        {
          "name": "Way of the Long Death",
          "level": 3,
          "description": "Monks of the Way of the Long Death are obsessed with the meaning and mechanics of dying. They capture creatures and prepare elaborate experiments to capture, record, and understand the moments of their demise. They use this knowledge to guide their understanding of martial arts, yielding a deadly fighting style.",
          "resource": null
        },
        {
          "name": "Touch of Death",
          "level": 3,
          "description": "Starting when you choose this tradition at 3rd level, your study of death allows you to extract vitality from another creature as it nears its demise. When you reduce a creature within 5 feet of you to 0 hit points, you gain temporary hit points equal to your Wisdom modifier + your monk level (minimum of 1 temporary hit point).",
          "resource": null
        },
        {
          "name": "Hour of Reaping",
          "level": 6,
          "description": "At 6th level, you gain the ability to unsettle or terrify those around you as an action, for your soul has been touched by the shadow of death. When you take this action, each creature within 30 feet of you that can see you must succeed on a Wisdom saving throw or be frightened of you until the end of your next turn.",
          "resource": null
        },
        {
          "name": "Mastery of Death",
          "level": 11,
          "description": "Beginning at 11th level, you use your familiarity with death to escape its grasp. When you are reduced to 0 hit points, you can expend 1 ki point (no action required) to have 1 hit point instead.",
          "resource": null
        },
        {
          "name": "Touch of the Long Death",
          "level": 17,
          "description": "Starting at 17th level, your touch can channel the energy of death into a creature. As an action, you touch one creature within 5 feet of you, and you expend 1 to 10 ki points. The target must make a Constitution saving throw, and it takes 2d10 necrotic damage per ki point spent on a failed save, or half as much damage on a successful one.",
          "resource": null
        }
      ]
    },
    "Way of the Drunken Master": {
      "name": "Way of the Drunken Master",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Way of the Drunken Master",
          "level": 3,
          "description": "The Way of the Drunken Master teaches its students to move with the jerky, unpredictable movements of a drunkard. A drunken master sways, tottering on unsteady feet, to present what seems like an incompetent combatant who proves frustrating to engage. The drunken master's erratic stumbles conceal a carefully executed dance of blocks, parries, advances, attacks, and retreats. A drunken master often enjoys playing the fool to bring gladness to the despondent or to demonstrate humility to the arrogant, but when battle is joined, the drunken master can be a maddening, masterful foe.",
          "resource": null
        },
        {
          "name": "Bonus Proficiencies",
          "level": 3,
          "description": "When you choose this tradition at 3rd level, you gain proficiency in the Performance skill if you don't already have it. Your martial arts technique mixes combat training with the precision of a dancer and the antics of a jester. You also gain proficiency with brewer's supplies if you don't already have it.",
          "resource": null
        },
        {
          "name": "Drunken Technique",
          "level": 3,
          "description": "At 3rd level, you learn how to twist and turn quickly as part of your Flurry of Blows. Whenever you use Flurry of Blows, you gain the benefit of the Disengage action, and your walking speed increases by 10 feet until the end of the current turn.",
          "resource": null
        },
        {
          "name": "Leap to Your Feet",
          "level": 6,
          "description": "When you're prone, you can stand up by spending 5 feet of movement, rather than half your speed.",
          "resource": null
        },
        {
          "name": "Redirect Attack",
          "level": 6,
          "description": "When a creature misses you with a melee attack roll, you can spend 1 ki point as a reaction to cause that attack to hit one creature of your choice, other than the attacker, that you can see within 5 feet of you.",
          "resource": null
        },
        {
          "name": "Tipsy Sway",
          "level": 6,
          "description": "Starting at 6th level, you can move in sudden, swaying ways. You gain the following benefits.",
          "resource": null
        },
        {
          "name": "Drunkard's Luck",
          "level": 11,
          "description": "Starting at 11th level, you always seem to get a lucky bounce at the right moment. When you make an ability check, an attack roll, or a saving throw and have disadvantage on the roll, you can spend 2 ki points to cancel the disadvantage for that roll.",
          "resource": null
        },
        {
          "name": "Intoxicated Frenzy",
          "level": 17,
          "description": "At 17th level, you gain the ability to make an overwhelming number of attacks against a group of enemies. When you use your Flurry of Blows, you can make up to three additional attacks with it (up to a total of five Flurry of Blows attacks), provided that each Flurry of Blows attack targets a different creature this turn.",
          "resource": null
        }
      ]
    },
    "Way of the Kensei": {
      "name": "Way of the Kensei",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Agile Parry",
          "level": 3,
          "description": "If you make an unarmed strike as part of the Attack action on your turn and are holding a kensei weapon, you can use it to defend yourself if it is a melee weapon. You gain a +2 bonus to AC until the start of your next turn, while the weapon is in your hand and you aren't incapacitated.",
          "resource": null
        },
        {
          "name": "Kensei's Shot",
          "level": 3,
          "description": "You can use a bonus action on your turn to make your ranged attacks with a kensei weapon more deadly. When you do so, any target you hit with a ranged attack using a kensei weapon takes an extra 1d4 damage of the weapon's type. You retain this benefit until the end of the current turn.",
          "resource": null
        },
        {
          "name": "Way of the Kensei",
          "level": 3,
          "description": "Monks of the Way of the Kensei train relentlessly with their weapons, to the point where the weapon becomes an extension of the body. Founded on a mastery of sword fighting, the tradition has expanded to include many different weapons. A kensei sees a weapon in much the same way a calligrapher or painter regards a pen or brush. Whatever the weapon, the kensei views it as a tool used to express the beauty and precision of the martial arts. That such mastery makes a kensei a peerless warrior is but a side effect of intense devotion, practice, and study.",
          "resource": null
        },
        {
          "name": "Path of the Kensei",
          "level": 3,
          "description": "When you choose this tradition at 3rd level, your special martial arts training leads you to master the use of certain weapons. This path also includes instruction in the deft strokes of calligraphy or painting. You gain the following benefits. Kensei Weapons: Choose two types of weapons to be your kensei weapons: one melee weapon and one ranged weapon. Each of these weapons can be any . The longbow is also a valid choice. You gain proficiency with these weapons if you don't already have it. Weapons of the chosen types are monk weapons for you. Many of this tradition's features work only with your kensei weapons. When you reach 6th, 11th, and 17th level in this class, you can choose another ",
          "resource": null
        },
        {
          "name": "One with the Blade",
          "level": 6,
          "description": "At 6th level, you extend your ki into your kensei weapons, granting you the following benefits. Magic Kensei Weapons: Your attacks with your kensei weapons count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. Deft Strike: When you hit a target with a kensei weapon, you can spend 1 ki point to cause the weapon to deal extra damage to the target equal to your Martial Arts die. You can use this feature only once on each of your turns.",
          "resource": null
        },
        {
          "name": "Sharpen the Blade",
          "level": 11,
          "description": "At 11th level, you gain the ability to augment your weapons further with your ki. As a bonus action, you can expend up to 3 ki points to grant one kensei weapon you touch a bonus to attack and damage rolls when you attack with it. The bonus equals the number of ki points you spent. This bonus lasts for 1 minute or until you use this feature again. This feature has no effect on a magic weapon that already has a bonus to attack and damage rolls.",
          "resource": null
        },
        {
          "name": "Unerring Accuracy",
          "level": 17,
          "description": "At 17th level, your mastery of weapons grants you extraordinary accuracy. If you miss with an attack roll using a monk weapon on your turn, you can reroll it. You can use this feature only once on each of your turns.",
          "resource": null
        }
      ]
    },
    "Way of the Sun Soul": {
      "name": "Way of the Sun Soul",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Way of the Sun Soul",
          "level": 3,
          "description": "Monks of the Way of the Sun Soul learn to channel their life energy into searing bolts of light. They teach that meditation can unlock the ability to unleash the indomitable light shed by the soul of every living creature.",
          "resource": null
        },
        {
          "name": "Radiant Sun Bolt",
          "level": 3,
          "description": "Starting when you choose this tradition at 3rd level, you can hurl searing bolts of magical radiance. You gain a new attack option that you can use with the Attack action. The special attack is a ranged spell attack with a range of 30 feet. You are proficient with it, and you add your Dexterity modifier to its attack and damage rolls. Its damage is radiant, and its damage die is a d4. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table. When you take the Attack action on your turn and use this special attack as part of it, you can spend 1 ki point to make the special attack twice as a bonus action. When you gain the Extra Attack feature, this speci",
          "resource": null
        },
        {
          "name": "Searing Arc Strike",
          "level": 6,
          "description": "At 6th level, you gain the ability to channel your ki into searing waves of energy. Immediately after you take the Attack action on your turn, you can spend 2 ki points to cast the burning hands spell as a bonus action. You can spend additional ki points to cast burning hands as a higher-level spell. Each additional ki point you spend increases the spell's level by 1. The maximum number of ki points (2 plus any additional points) that you can spend on the spell equals half your monk level.",
          "resource": null
        },
        {
          "name": "Searing Sunburst",
          "level": 11,
          "description": "At 11th level, you gain the ability to create an orb of light that erupts into a devastating explosion. As an action, you magically create an orb and hurl it at a point you choose within 150 feet, where it erupts into a sphere of radiant light for a brief but deadly instant. Each creature in that 20-foot-radius sphere must succeed on a Constitution saving throw or take 2d6 radiant damage. A creature doesn't need to make the save if the creature is behind Cover that is opaque. You can increase the sphere's damage by spending ki points. Each point you spend, to a maximum of 3, increases the damage by 2d6.",
          "resource": null
        },
        {
          "name": "Sun Shield",
          "level": 17,
          "description": "At 17th level, you become wreathed in a luminous, magical aura. You shed bright light in a 30-foot radius and dim light for an additional 30 feet. You can extinguish or restore the light as a bonus action. If a creature hits you with a melee attack while this light shines, you can use your reaction to deal radiant damage to the creature. The radiant damage equals 5 + your Wisdom modifier.",
          "resource": null
        }
      ]
    },
    "Way of Mercy": {
      "name": "Way of Mercy",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Way of Mercy",
          "level": 3,
          "description": "Monks of the Way of Mercy learn to manipulate the life force of others to bring aid to those in need. They are wandering physicians to the poor and hurt. However, to those beyond their help, they bring a swift end as an act of mercy. Those who follow the Way of Mercy might be members of a religious order, administering to the needy and making grim choices rooted in reality rather than idealism. Some might be gentle-voiced healers, beloved by their communities, while others might be masked bringers of macabre mercies. The walkers of this way usually don robes with deep cowls, and they often conceal their faces with masks, presenting themselves as the faceless bringers of life and death.",
          "resource": null
        },
        {
          "name": "Hand of Harm",
          "level": 3,
          "description": "3rd-level Way of Mercy feature You use your ki to inflict wounds. When you hit a creature with an unarmed strike, you can spend 1 ki point to deal extra necrotic damage equal to one roll of your Martial Arts die + your Wisdom modifier. You can use this feature only once per turn.",
          "resource": null
        },
        {
          "name": "Hand of Healing",
          "level": 3,
          "description": "3rd-level Way of Mercy feature Your mystical touch can mend wounds. As an action, you can spend 1 ki point to touch a creature and restore a number of hit points equal to a roll of your Martial Arts die + your Wisdom modifier. When you use your Flurry of Blows, you can replace one of the unarmed strikes with a use of this feature without spending a ki point for the healing.",
          "resource": null
        },
        {
          "name": "Implements of Mercy",
          "level": 3,
          "description": "3rd-level Way of Mercy feature You gain proficiency in the Insight and Medicine skills, and you gain proficiency with the herbalism kit. You also gain a special mask, which you often wear when using the features of this subclass. You determine its appearance, or generate it randomly by rolling on the Merciful Mask table.",
          "resource": null
        },
        {
          "name": "Physician's Touch",
          "level": 6,
          "description": "6th-level Way of Mercy feature You can administer even greater cures with a touch, and if you feel it's necessary, you can use your knowledge to cause harm. When you use Hand of Healing on a creature, you can also end one disease or one of the following conditions affecting the creature: blinded, deafened, paralyzed, poisoned, or stunned. When you use Hand of Harm on a creature, you can subject that creature to the poisoned condition until the end of your next turn.",
          "resource": null
        },
        {
          "name": "Flurry of Healing and Harm",
          "level": 11,
          "description": "11th-level Way of Mercy feature You can now mete out a flurry of comfort and hurt. When you use Flurry of Blows, you can now replace each of the unarmed strikes with a use of your Hand of Healing, without spending ki points for the healing. In addition, when you make an unarmed strike with Flurry of Blows, you can use Hand of Harm with that strike without spending the ki point for Hand of Harm. You can still use Hand of Harm only once per turn.",
          "resource": null
        },
        {
          "name": "Hand of Ultimate Mercy",
          "level": 17,
          "description": "17th-level Way of Mercy feature Your mastery of life energy opens the door to the ultimate mercy. As an action, you can touch the corpse of a creature that died within the past 24 hours and expend 5 ki points. The creature then returns to life, regaining a number of hit points equal to 4d10 + your Wisdom modifier. If the creature died while subject to any of the following conditions, it revives with them removed: blinded, deafened, paralyzed, poisoned, and stunned. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Way of the Astral Self": {
      "name": "Way of the Astral Self",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Way of the Astral Self",
          "level": 3,
          "description": "A monk who follows the Way of the Astral Self believes their body is an illusion. They see their ki as a representation of their true form, an astral self. This astral self has the capacity to be a force of order or disorder, with some monasteries training students to use their power to protect the weak and other instructing aspirants in how to manifest their true selves in service to the mighty.",
          "resource": null
        },
        {
          "name": "Arms of the Astral Self",
          "level": 3,
          "description": "3rd-level Way of the Astral Self feature Your mastery of your ki allows you to summon a portion of your astral self. As a bonus action, you can spend 1 ki point to summon the arms of your astral self. When you do so, each creature of your choice that you can see within 10 feet of you must succeed on a Dexterity saving throw or take force damage equal to two rolls of your Martial Arts die. For 10 minutes, these spectral arms hover near your shoulders or surround your arms (your choice). You determine the arms' appearance, and they vanish early if you are incapacitated or die. While the spectral arms are present, you gain the following benefits: You can use your Wisdom modifier in place of you",
          "resource": null
        },
        {
          "name": "Forms of Your Astral Self",
          "level": 3,
          "description": "The astral self is a translucent embodiment of the monk's soul. As a result, an astral self can reflect aspects of a monk's background, ideals, flaws, and bonds, and an astral self doesn't necessarily look anything like the monk. For example, the astral self of a lanky human might be reminiscent of a minotaur-the strength of which the monk feels within. Similarly, an orc monk might manifest gossamer arms and a delicate visage, representing the gentle beauty of the orc's soul. Each astral self is unique, and some of the monks of this monastic tradition are known more for the appearance of their astral self than for their physical appearance. When choosing this path, consider the quirks that d",
          "resource": null
        },
        {
          "name": "Visage of the Astral Self",
          "level": 6,
          "description": "6th-level Way of the Astral Self feature You can summon the visage of your astral self. As a bonus action, or as part of the bonus action you take to activate Arms of the Astral Self, you can spend 1 ki point to summon this visage for 10 minutes. It vanishes early if you are incapacitated or die. The spectral visage covers your face like a helmet or mask. You determine its appearance. While the spectral visage is present, you gain the following benefits. Astral Sight: You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet. Wisdom of the Spirit: You have advantage on Wisdom (Insight) and Charisma (Intimidation) checks. Word of the Spirit: When you speak, you ",
          "resource": null
        },
        {
          "name": "Body of the Astral Self",
          "level": 11,
          "description": "11th-level Way of the Astral Self feature When you have both your astral arms and visage summoned, you can cause the body of your astral self to appear (no action required). This spectral body covers your physical form like a suit of armor, connecting with the arms and visage. You determine its appearance. While the spectral body is present, you gain the following benefits. Deflect Energy: When you take acid, cold, fire, force, lightning, or thunder damage, you can use your reaction to deflect it. When you do so, the damage you take is reduced by 1d10 + your Wisdom modifier (minimum reduction of 1). Empowered Arms: Once on each of your turns when you hit a target with the Arms of the Astral ",
          "resource": null
        },
        {
          "name": "Awakened Astral Self",
          "level": 17,
          "description": "17th-level Way of the Astral Self feature Your connection to your astral self is complete, allowing you to unleash its full potential. As a bonus action, you can spend 5 ki points to summon the arms, visage, and body of your astral self and awaken it for 10 minutes. This awakening ends early if you are incapacitated or die. While your astral self is awakened, you gain the following benefits. Armor of the Spirit: You gain a +2 bonus to Armor Class. Astral Barrage: Whenever you use the Extra Attack feature to attack twice, you can instead attack three times if all the attacks are made with your astral arms.",
          "resource": null
        }
      ]
    },
    "Way of the Ascendant Dragon": {
      "name": "Way of the Ascendant Dragon",
      "source": "Fizban's Dragons",
      "features": [
        {
          "name": "Way of the Ascendant Dragon",
          "level": 3,
          "description": "The dragon god Bahamut is known to travel the Material Plane in the guise of a young monk, and legend says that he founded the first monastery of the Way of the Ascendant Dragon in this guise. The fundamental teaching of this tradition holds that by emulating dragons, a monk becomes a more integrated part of the world and its magic. By altering their spirit to resonate with draconic might, monks who follow this tradition augment their prowess in battle, bolster their allies, and can even soar through the air on draconic wings. But all this power is in service of a greater goal: achieving a spiritual unity with the essence of the Material Plane. As a follower of the Way of the Ascendant Drago",
          "resource": null
        },
        {
          "name": "Breath of the Dragon",
          "level": 3,
          "description": "3rd-level Way of the Ascendant Dragon feature You can channel destructive waves of energy, like those created by the dragons you emulate. When you take the Attack action on your turn, you can replace one of the attacks with an exhalation of draconic energy in either a 20-foot cone or a 30-foot line that is 5 feet wide (your choice). Choose a damage type: acid, cold, fire, lightning, or poison. Each creature in that area must make a Dexterity saving throw against your ki save DC, taking damage of the chosen type equal to two rolls of your Martial Arts die on a failed save, or half as much damage on a successful one. At 11th level, the damage of this feature increases to three rolls of your Ma",
          "resource": null
        },
        {
          "name": "Draconic Disciple",
          "level": 3,
          "description": "3rd-level Way of the Ascendant Dragon feature You can channel draconic power to magnify your presence and imbue your unarmed strikes with the essence of a dragon's breath. You gain the following benefits:",
          "resource": null
        },
        {
          "name": "Wings Unfurled",
          "level": 6,
          "description": "6th-level Way of the Ascendant Dragon feature When you use your Step of the Wind, you can unfurl spectral draconic wings from your back that vanish at the end of your turn. While the wings exist, you have a flying speed equal to your walking speed. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Aspect of the Wyrm",
          "level": 11,
          "description": "11th-level Way of the Ascendant Dragon feature The power of your draconic spirit now radiates from you, warding your allies or inspiring fear in your enemies. As a bonus action, you can create an aura of draconic power that radiates 10 feet from you for 1 minute. For the duration, you gain one of the following effects of your choice: Once you create this aura, you can't create it again until you finish a long rest, unless you expend 3 ki points to create it again.",
          "resource": null
        },
        {
          "name": "Ascendant Aspect",
          "level": 17,
          "description": "17th-level Way of the Ascendant Dragon feature Your draconic spirit reaches its peak. You gain the following benefits:",
          "resource": null
        }
      ]
    },
    "Warrior of Mercy": {
      "name": "Warrior of Mercy",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Warrior of Mercy",
          "level": 3,
          "description": "Manipulate Forces of Life and Death Warriors of Mercy manipulate the life force of others. These Monks are wandering physicians, but they bring a swift end to their enemies. They often wear masks, presenting themselves as faceless bringers of life and death.",
          "resource": null
        },
        {
          "name": "Hand of Harm",
          "level": 3,
          "description": "Once per turn when you hit a creature with an Unarmed Strike and deal damage, you can expend 1 Focus Point to deal extra Necrotic damage equal to one roll of your Martial Arts die plus your Wisdom modifier.",
          "resource": null
        },
        {
          "name": "Hand of Healing",
          "level": 3,
          "description": "As a Magic action, you can expend 1 Focus Point to touch a creature and restore a number of Hit Points equal to a roll of your Martial Arts die plus your Wisdom modifier. When you use your Flurry of Blows, you can replace one of the Unarmed Strikes with a use of this feature without expending a Focus Point for the healing.",
          "resource": null
        },
        {
          "name": "Implements of Mercy",
          "level": 3,
          "description": "You gain proficiency in the Insight and Medicine skills and proficiency with the Herbalism Kit.",
          "resource": null
        },
        {
          "name": "Physician's Touch",
          "level": 6,
          "description": "Your Hand of Harm and Hand of Healing improve, as detailed below. Hand of Harm: When you use Hand of Harm on a creature, you can also give that creature the Poisoned condition until the end of your next turn. Hand of Healing: When you use Hand of Healing, you can also end one of the following conditions on the creature you heal: Blinded, Deafened, Paralyzed, Poisoned, or Stunned.",
          "resource": null
        },
        {
          "name": "Flurry of Healing and Harm",
          "level": 11,
          "description": "When you use Flurry of Blows, you can replace each of the Unarmed Strikes with a use of Hand of Healing without expending Focus Points for the healing. In addition, when you make an Unarmed Strike with Flurry of Blows and deal damage, you can use Hand of Harm with that strike without expending a Focus Point for Hand of Harm. You can still use Hand of Harm only once per turn. You can use these benefits a total number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Hand of Ultimate Mercy",
          "level": 17,
          "description": "Your mastery of life energy opens the door to the ultimate mercy. As a Magic action, you can touch the corpse of a creature that died within the past 24 hours and expend 5 Focus Points. The creature then returns to life with a number of Hit Points equal to 4d10 plus your Wisdom modifier. If the creature died with any of the following conditions, the creature revives with the conditions removed: Blinded, Deafened, Paralyzed, Poisoned, and Stunned. Once you use this feature, you can't use it again until you finish a Long Rest.",
          "resource": null
        }
      ]
    },
    "Warrior of Shadow": {
      "name": "Warrior of Shadow",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Shadow Arts",
          "level": 3,
          "description": "You have learned to draw on the power of the Shadowfell, gaining the following benefits.",
          "resource": null
        },
        {
          "name": "Warrior of Shadow",
          "level": 3,
          "description": "Harness Shadow Power for Stealth and Subterfuge Warriors of Shadow practice stealth and subterfuge, harnessing the power of the Shadowfell. They are at home in darkness, able to draw gloom around themselves to hide, leap from shadow to shadow, and take on a wraithlike form.",
          "resource": null
        },
        {
          "name": "Darkness",
          "level": 3,
          "description": "You can expend 1 Focus Point to cast the Darkness spell without spell components. You can see within the spell's area when you cast it with this feature. While the spell persists, you can move its area of Darkness to a space within 60 feet of yourself at the start of each of your turns.",
          "resource": null
        },
        {
          "name": "Darkvision",
          "level": 3,
          "description": "You gain Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet.",
          "resource": null
        },
        {
          "name": "Shadowy Figments",
          "level": 3,
          "description": "You know the Minor Illusion spell. Wisdom is your spellcasting ability for it.",
          "resource": null
        },
        {
          "name": "Shadow Step",
          "level": 6,
          "description": "While entirely within Dim Light or Darkness, you can use a Bonus Action to teleport up to 60 feet to an unoccupied space you can see that is also in Dim Light or Darkness. You then have Advantage on the next melee attack you make before the end of the current turn.",
          "resource": null
        },
        {
          "name": "Improved Shadow Step",
          "level": 11,
          "description": "You can draw on your Shadowfell connection to empower your teleportation. When you use your Shadow Step, you can expend 1 Focus Point to remove the requirement that you must start and end in Dim Light or Darkness for that use of the feature. As part of this Bonus Action, you can make an Unarmed Strike immediately after you teleport.",
          "resource": null
        },
        {
          "name": "Cloak of Shadows",
          "level": 17,
          "description": "As a Magic action while entirely within Dim Light or Darkness, you can expend 3 Focus Points to shroud yourself with shadows for 1 minute, until you have the Incapacitated condition, or until you end your turn in Bright Light. While shrouded by these shadows, you gain the following benefits. Invisibility: You have the Invisible condition. Partially Incorporeal: You can move through occupied spaces as if they were Difficult Terrain. If you end your turn in such a space, you are shunted to the last unoccupied space you were in. Shadow Flurry: You can use your Flurry of Blows without expending any Focus Points.",
          "resource": null
        }
      ]
    },
    "Warrior of the Elements": {
      "name": "Warrior of the Elements",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Elemental Attunement",
          "level": 3,
          "description": "At the start of your turn, you can expend 1 Focus Point to imbue yourself with elemental energy. The energy lasts for 10 minutes or until you have the Incapacitated condition. You gain the following benefits while this feature is active. Reach: When you make an Unarmed Strike, your reach is 10 feet greater than normal, as elemental energy extends from you. Elemental Strikes: Whenever you hit with your Unarmed Strike, you can cause it to deal your choice of Acid, Cold, Fire, Lightning, or Thunder damage rather than its normal damage type. When you deal one of these types with it, you can also force the target to make a Strength saving throw. On a failed save, you can move the target up to 10 ",
          "resource": null
        },
        {
          "name": "Manipulate Elements",
          "level": 3,
          "description": "You know the Elementalism spell. Wisdom is your spellcasting ability for it.",
          "resource": null
        },
        {
          "name": "Warrior of the Elements",
          "level": 3,
          "description": "Wield Strikes and Bursts of Elemental Power Warriors of the Elements tap into the power of the Elemental Planes. Harnessing their supernatural focus, these Monks momentarily tame the energy of the Elemental Chaos to empower themselves in and out of battle.",
          "resource": null
        },
        {
          "name": "Elemental Burst",
          "level": 6,
          "description": "As a Magic action, you can expend 2 Focus Points to cause elemental energy to burst in a 20-foot-radius Sphere [Area of Effect] centered on a point within 120 feet of yourself. Choose a damage type: Acid, Cold, Fire, Lightning, or Thunder. Each creature in the Sphere [Area of Effect] must make a Dexterity saving throw. On a failed save, a creature takes damage of the chosen type equal to three rolls of your Martial Arts die. On a successful save, a creature takes half as much damage.",
          "resource": null
        },
        {
          "name": "Stride of the Elements",
          "level": 11,
          "description": "While your Elemental Attunement is active, you also have a Fly Speed and a Swim Speed equal to your Speed.",
          "resource": null
        },
        {
          "name": "Elemental Epitome",
          "level": 17,
          "description": "While your Elemental Attunement is active, you also gain the following benefits. Damage Resistance: You gain Resistance to one of the following damage types of your choice: Acid, Cold, Fire, Lightning, or Thunder. At the start of each of your turns, you can change this choice. Destructive Stride: When you use your Step of the Wind, your Speed increases by 20 feet until the end of the turn. For that duration, any creature of your choice takes damage equal to one roll of your Martial Arts die when you enter a space within 5 feet of it. The damage type is your choice of Acid, Cold, Fire, Lightning, or Thunder. A creature can take this damage only once per turn. Empowered Strikes: Once on each o",
          "resource": null
        }
      ]
    },
    "Warrior of the Open Hand": {
      "name": "Warrior of the Open Hand",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Open Hand Technique",
          "level": 3,
          "description": "Whenever you hit a creature with an attack granted by your Flurry of Blows, you can impose one of the following effects on that target. Addle: The target can't make Opportunity Attack until the start of its next turn. Push: The target must succeed on a Strength saving throw or be pushed up to 15 feet away from you. Topple: The target must succeed on a Dexterity saving throw or have the Prone condition.",
          "resource": null
        },
        {
          "name": "Warrior of the Open Hand",
          "level": 3,
          "description": "Master Unarmed Combat Techniques Warriors of the Open Hand are masters of unarmed combat. They learn techniques to push and trip their opponents and manipulate their own energy to protect themselves from harm.",
          "resource": null
        },
        {
          "name": "Wholeness of Body",
          "level": 6,
          "description": "You gain the ability to heal yourself. As a Bonus Action, you can roll your Martial Arts die. You regain a number of Hit Points equal to the number rolled plus your Wisdom modifier (minimum of 1 Hit Points regained). You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Fleet Step",
          "level": 11,
          "description": "When you take a Bonus Action other than Step of the Wind, you can also use Step of the Wind immediately after that Bonus Action.",
          "resource": null
        },
        {
          "name": "Quivering Palm",
          "level": 17,
          "description": "You gain the ability to set up lethal vibrations in someone's body. When you hit a creature with an Unarmed Strike, you can expend 4 Focus Points to start these imperceptible vibrations, which last for a number of days equal to your Monk level. The vibrations are harmless unless you take an action to end them. Alternatively, when you take the Attack action on your turn, you can forgo one of the attacks to end the vibrations. To end them, you and the target must be on the same plane of existence. When you end them, the target must make a Constitution saving throw, taking 10d12 Force damage on a failed save or half as much damage on a successful one. You can have only one creature under the ef",
          "resource": null
        }
      ]
    }
  },
  "Paladin": {
    "Oath of Devotion": {
      "name": "Oath of Devotion",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Oath of Devotion",
          "level": 3,
          "description": "Uphold the Ideals of Justice and Order The Oath of Devotion binds Paladins to the ideals of justice and order. These Paladins meet the archetype of the knight in shining armor. They hold themselves to the highest standards of conduct, and some—for better or worse—hold the rest of the world to the same standards. Many who swear this oath are devoted to gods of law and good and use their gods' tenets as the measure of personal devotion. Others hold angels as their ideals and incorporate images of angelic wings into their helmets or coats of arms. These paladins share the following tenets: Let your word be your promise. Protect the weak and never fear to act. Let your honorable deeds be an exam",
          "resource": null
        },
        {
          "name": "Oath of Devotion Spells",
          "level": 3,
          "description": "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Devotion Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Sacred Weapon",
          "level": 3,
          "description": "When you take the Attack action, you can expend one use of your Channel Divinity to imbue one Melee weapon that you are holding with positive energy. For 10 minutes or until you use this feature again, you add your Charisma modifier to attack rolls you make with that weapon (minimum bonus of +1), and each time you hit with it, you cause it to deal its normal damage type or Radiant damage. The weapon also emits Bright Light in a 20-foot radius and Dim Light 20 feet beyond that. You can end this effect early (no action required). This effect also ends if you aren't carrying the weapon.",
          "resource": null
        },
        {
          "name": "Aura of Devotion",
          "level": 7,
          "description": "You and your allies have Immunity to the Charmed condition while in your Aura of Protection. If a Charmed ally enters the aura, that condition has no effect on that ally while there.",
          "resource": null
        },
        {
          "name": "Smite of Protection",
          "level": 15,
          "description": "Your magical smite now radiates protective energy. Whenever you cast Divine Smite, you and your allies have Cover while in your Aura of Protection. The aura has this benefit until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Holy Nimbus",
          "level": 20,
          "description": "As a Bonus Action, you can imbue your Aura of Protection with holy power, granting the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Holy Ward: You have Advantage on any saving throw you are forced to make by a Fiend or an Undead. Radiant Damage: Whenever an enemy starts its turn in the aura, that creature takes Radiant damage equal to your Charisma modifier plus your Proficiency. Sunlight: The aura is filled with Bright Light that is sunlight.",
          "resource": null
        }
      ]
    },
    "Oath of the Ancients": {
      "name": "Oath of the Ancients",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Nature's Wrath",
          "level": 3,
          "description": "As a Magic action, you can expend one use of your Channel Divinity to conjure spectral vines around nearby creatures. Each creature of your choice that you can see within 15 feet of yourself must succeed on a Strength saving throw or have the Restrained condition for 1 minute. A Restrained creature repeats the save at the end of each of its turns, ending the effect on itself on a success.",
          "resource": null
        },
        {
          "name": "Oath of the Ancients",
          "level": 3,
          "description": "Preserve Life and Light in the World The Oath of the Ancients is as old as the first elves. Paladins who swear this oath cherish the light; they love the beautiful and life-giving things of the world more than any principles of honor, courage, and justice. They often adorn their armor and clothing with images of growing things—leaves, antlers, or flowers—to reflect their commitment to preserving life and light. These paladins share the following tenets: Kindle the light of hope. Shelter life. Delight in art and laughter.",
          "resource": null
        },
        {
          "name": "Oath of the Ancients Spells",
          "level": 3,
          "description": "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of the Ancients Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Aura of Warding",
          "level": 7,
          "description": "Ancient magic lies so heavily upon you that it forms an eldritch ward, blunting energy from beyond the Material Plane; you and your allies have Resistance to Necrotic, Psychic, and Radiant damage while in your Aura of Protection.",
          "resource": null
        },
        {
          "name": "Undying Sentinel",
          "level": 15,
          "description": "When you are reduced to 0 Hit Points and not killed outright, you can drop to 1 Hit Points instead, and you regain a number of Hit Points equal to three times your Paladin level. Once you use this feature, you can't do so again until you finish a Long Rest. Additionally, you can't be aged magically, and you cease visibly aging.",
          "resource": null
        },
        {
          "name": "Elder Champion",
          "level": 20,
          "description": "As a Bonus Action, you can imbue your Aura of Protection with primal power, granting the benefits below for 1 minute or until you end them (no action required). Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Diminish Defiance: Enemies in the aura have Disadvantage on saving throws against your spells and Channel Divinity options. Regeneration: At the start of each of your turns, you regain 10 Hit Points. Swift Spells: Whenever you cast a spell that has a casting time of an action, you can cast it using a Bonus Action instead.",
          "resource": null
        }
      ]
    },
    "Oath of Vengeance": {
      "name": "Oath of Vengeance",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Oath of Vengeance",
          "level": 3,
          "description": "Punish Evildoers at Any Cost The Oath of Vengeance is a solemn commitment to punish those who have committed grievously evil acts. When evil armies slaughter helpless villagers, when a tyrant defies the will of the gods, when a thieves' guild grows too violent, when a dragon rampages through the countryside—at times like these, paladins arise and swear an Oath of Vengeance to set right what has gone wrong. These paladins share the following tenets: Show the wicked no mercy. Fight injustice and its causes. Aid those harmed by injustice.",
          "resource": null
        },
        {
          "name": "Oath of Vengeance Spells",
          "level": 3,
          "description": "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Vengeance Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Vow of Enmity",
          "level": 3,
          "description": "When you take the Attack action, you can expend one use of your Channel Divinity to utter a vow of enmity against a creature you can see within 30 feet of yourself. You have Advantage on attack rolls against the creature for 1 minute or until you use this feature again. If the creature drops to 0 Hit Points before the vow ends, you can transfer the vow to a different creature within 30 feet of yourself (no action required).",
          "resource": null
        },
        {
          "name": "Relentless Avenger",
          "level": 7,
          "description": "Your supernatural focus helps you close off a foe's retreat. When you hit a creature with an Opportunity Attack, you can reduce the creature's Speed to 0 until the end of the current turn. You can then move up to half your Speed as part of the same Reaction. This movement doesn't provoke Opportunity Attack.",
          "resource": null
        },
        {
          "name": "Soul of Vengeance",
          "level": 15,
          "description": "Immediately after a creature under the effect of your Vow of Enmity hits or misses with an attack roll, you can take a Reaction to make a melee attack against that creature if it's within range.",
          "resource": null
        },
        {
          "name": "Avenging Angel",
          "level": 20,
          "description": "As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Flight: You sprout spectral wings on your back, have a Fly Speed of 60 feet, and can hover. Frightful Aura: Whenever an enemy starts its turn in your Aura of Protection, that creature must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute or until it takes any damage. Attack rolls against the Frightened creature have Advantage.",
          "resource": null
        }
      ]
    },
    "Oathbreaker": {
      "name": "Oathbreaker",
      "source": "DMG",
      "features": [
        {
          "name": "Oathbreaker",
          "level": 3,
          "description": "An Oathbreaker is a paladin who breaks his or her sacred oaths to pursue some dark ambition or serve an evil power. Whatever light burned in the paladin's heart has been extinguished. Only darkness remains. A paladin must be evil and at least 3rd level to become an Oathbreaker. The paladin replaces the features specific to his or her Sacred Oath with Oathbreaker features.",
          "resource": null
        },
        {
          "name": "Channel Divinity",
          "level": 3,
          "description": "An Oathbreaker paladin of 3rd level or higher gains the following two Channel Divinity options.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Control Undead",
          "level": 3,
          "description": "As an action, the paladin targets one undead creature he or she can see within 30 feet of him or her. The target must make a Wisdom saving throw. On a failed save, the target must obey the paladin's commands for the next 24 hours, or until the paladin uses this Channel Divinity option again. An undead whose challenge rating is equal to or greater than the paladin's level is immune to this effect.",
          "resource": null
        },
        {
          "name": "Dreadful Aspect",
          "level": 3,
          "description": "As an action, the paladin channels the darkest emotions and focuses them into a burst of magical menace. Each creature of the paladin's choice within 30 feet of the paladin must make a Wisdom saving throw if it can see the paladin. On a failed save, the target is frightened of the paladin for 1 minute. If a creature frightened by this effect ends its turn more than 30 feet away from the paladin, it can attempt another Wisdom saving throw to end the effect on it.",
          "resource": null
        },
        {
          "name": "Oathbreaker Spells",
          "level": 3,
          "description": "You gain oathbreaker spells at the paladin levels listed.",
          "resource": null
        },
        {
          "name": "Aura of Hate",
          "level": 7,
          "description": "Starting at 7th level, the paladin, as well any fiends and undead within 10 feet of the paladin, gains a bonus to melee weapon damage rolls equal to the paladin's Charisma modifier (minimum of +1). A creature can benefit from this feature from only one paladin at a time. At 18th level, the range of this aura increases to 30 feet.",
          "resource": null
        },
        {
          "name": "Supernatural Resistance",
          "level": 15,
          "description": "At 15th level, the paladin gains resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
          "resource": null
        },
        {
          "name": "Dread Lord",
          "level": 20,
          "description": "At 20th level, the paladin can, as an action, surround himself or herself with an aura of gloom that lasts for 1 minute. The aura reduces any bright light in a 30-foot radius around the paladin to dim light. Whenever an enemy that is frightened by the paladin starts its turn in the aura, it takes 4d10 psychic damage. Additionally, the paladin and creatures he or she chooses in the aura are draped in deeper shadow. Creatures that rely on sight have disadvantage on attack rolls against creatures draped in this shadow. While the aura lasts, the paladin can use a bonus action on his or her turn to cause the shadows in the aura to attack one creature. The paladin makes a melee spell attack agains",
          "resource": null
        }
      ]
    },
    "Oath of the Crown": {
      "name": "Oath of the Crown",
      "source": "Sword Coast Guide",
      "features": [
        {
          "name": "Oath of the Crown",
          "level": 3,
          "description": "The Oath of the Crown is sworn to the ideals of civilization, be it the spirit of a nation, fealty to a sovereign, or service to a deity of law and rulership. The paladins who swear this oath dedicate themselves to serving society and, in particular, the laws that hold society together. These paladins are the watchful guardians on the walls, standing against the chaotic tides of barbarism that threaten to tear down all that civilization has built, and are commonly known as guardians, exemplars, or sentinels. Often, paladins who swear this oath are members of an order of knighthood in service to a nation or sovereign, and undergo their oath as part of their admission to the order's ranks.",
          "resource": null
        },
        {
          "name": "Champion Challenge",
          "level": 3,
          "description": "As a bonus action, you issue a challenge that compels other creatures to do battle with you. Each creature of your choice that you can see within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature can't willingly move more than 30 feet away from you. This effect ends on the creature if you are incapacitated or die or if the creature is more than 30 feet away from you.",
          "resource": null
        },
        {
          "name": "Channel Divinity",
          "level": 3,
          "description": "When you take this oath at 3rd level, you gain the following two Channel Divinity options.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Oath Spells",
          "level": 3,
          "description": "You gain oath spells at the paladin levels listed.",
          "resource": null
        },
        {
          "name": "Tenets of the Crown",
          "level": 3,
          "description": "The tenets of the Oath of the Crown are often set by the sovereign to which their oath is sworn, but generally emphasize the following tenets. Law: The law is paramount. It is the mortar that holds the stones of civilization together, and it must be respected. Loyalty: Your word is your bond. Without loyalty, oaths and laws are meaningless. Courage: You must be willing to do what needs to be done for the sake of order, even in the face of overwhelming odds. If you don't act, then who will? Responsibility: You must deal with the consequences of your actions, and you are responsible for fulfilling your duties and obligations.",
          "resource": null
        },
        {
          "name": "Turn the Tide",
          "level": 3,
          "description": "As a bonus action, you can bolster injured creatures with your Channel Divinity. Each creature of your choice that can hear you within 30 feet of you regains hit points equal to 1d6 + your Charisma modifier (minimum of 1) if it has no more than half of its hit points.",
          "resource": null
        },
        {
          "name": "Divine Allegiance",
          "level": 7,
          "description": "Starting at 7th level, when a creature within 5 feet of you takes damage, you can use your reaction to magically substitute your own health for that of the target creature, causing that creature not to take the damage. Instead, you take the damage. This damage to you can't be reduced or prevented in any way.",
          "resource": null
        },
        {
          "name": "Unyielding Spirit",
          "level": 15,
          "description": "Starting at 15th level, you have advantage on saving throws to avoid becoming paralyzed or stunned.",
          "resource": null
        },
        {
          "name": "Exalted Champion",
          "level": 20,
          "description": "At 20th level, your presence on the field of battle is an inspiration to those dedicated to your cause. You can use your action to gain the following benefits for 1 hour: You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons. Your allies have advantage on death saving throws while within 30 feet of you. You have advantage on Wisdom saving throws, as do your allies within 30 feet of you. This effect ends early if you are incapacitated or die. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Oath of Conquest": {
      "name": "Oath of Conquest",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Oath of Conquest",
          "level": 3,
          "description": "The Oath of Conquest calls to paladins who seek glory in battle and the subjugation of their enemies. It isn't enough for these paladins to establish order. They must crush the forces of chaos. Sometimes called knight tyrants or iron mongers, those who swear this oath gather into grim orders that serve gods or philosophies of war and well-ordered might. Some of these paladins go so far as to consort with the powers of the Nine Hells, valuing the rule of law over the balm of mercy. The archdevil Bel, warlord of Avernus, counts many of these paladins—called hell knights—as his most ardent supporters. Hell knights cover their armor with trophies taken from fallen enemies, a grim warning to any ",
          "resource": null
        },
        {
          "name": "Channel Divinity",
          "level": 3,
          "description": "When you take this oath at 3rd level, you gain the following two Channel Divinity options.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Conquering Presence",
          "level": 3,
          "description": "You can use your Channel Divinity to exude a terrifying presence. As an action, you force each creature of your choice that you can see within 30 feet of you to make a Wisdom saving throw. On a failed save, a creature becomes frightened of you for 1 minute. The frightened creature can repeat this saving throw at the end of each of its turns, ending the effect on itself on a success.",
          "resource": null
        },
        {
          "name": "Guided Strike",
          "level": 3,
          "description": "You can use your Channel Divinity to strike with supernatural accuracy. When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.",
          "resource": null
        },
        {
          "name": "Oath Spells",
          "level": 3,
          "description": "You gain oath spells at the paladin levels listed.",
          "resource": null
        },
        {
          "name": "Tenets of Conquest",
          "level": 3,
          "description": "A paladin who takes this oath has the tenets of conquest seared on the upper arm. Douse the Flame of Hope: It is not enough to merely defeat an enemy in battle. Your victory must be so overwhelming that your enemies' will to fight is shattered forever. A blade can end a life. Fear can end an empire. Rule with an Iron Fist: Once you have conquered, tolerate no dissent. Your word is law. Those who obey it shall be favored. Those who defy it shall be punished as an example to all who might follow. Strength Above All: You shall rule until a stronger one arises. Then you must grow mightier and meet the challenge, or fall to your own ruin.",
          "resource": null
        },
        {
          "name": "Aura of Conquest",
          "level": 7,
          "description": "Starting at 7th level, you constantly emanate a menacing aura while you're not incapacitated. The aura extends 10 feet from you in every direction, but not through Cover. If a creature is frightened of you, its speed is reduced to 0 while in the aura, and that creature takes psychic damage equal to half your paladin level if it starts its turn there. At 18th level, the range of this aura increases to 30 feet.",
          "resource": null
        },
        {
          "name": "Scornful Rebuke",
          "level": 15,
          "description": "Starting at 15th level, those who dare to strike you are psychically punished for their audacity. Whenever a creature hits you with an attack, that creature takes psychic damage equal to your Charisma modifier (minimum of 1) if you're not incapacitated.",
          "resource": null
        },
        {
          "name": "Invincible Conqueror",
          "level": 20,
          "description": "At 20th level, you gain the ability to harness extraordinary martial prowess. As an action, you can magically become an avatar of conquest, gaining the following benefits for 1 minute: You have resistance to all damage. When you take the Attack action on your turn, you can make one additional attack as part of that action. Your melee weapon attacks score a critical hit on a roll of 19 or 20 on the d20. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Oath of Redemption": {
      "name": "Oath of Redemption",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Oath of Redemption",
          "level": 3,
          "description": "The Oath of Redemption sets a paladin on a difficult path, one that requires a holy warrior to use violence only as a last resort. Paladins who dedicate themselves to this oath believe that any person can be redeemed and that the path of benevolence and justice is one that anyone can walk. These paladins face evil creatures in the hope of turning their foes to the light, and they slay their enemies only when such a deed will clearly save other lives. Paladins who follow this path are known as redeemers. While redeemers are idealists, they are no fools. Redeemers know that undead, demons, devils, and other supernatural threats can be inherently evil. Against such foes, paladins who swear this",
          "resource": null
        },
        {
          "name": "Channel Divinity",
          "level": 3,
          "description": "When you take this oath at 3rd level, you gain the following two Channel Divinity options.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Emissary of Peace",
          "level": 3,
          "description": "You can use your Channel Divinity to augment your presence with divine power. As a bonus action, you grant yourself a +5 bonus to Charisma (Persuasion) checks for the next 10 minutes.",
          "resource": null
        },
        {
          "name": "Oath Spells",
          "level": 3,
          "description": "You gain oath spells at the paladin levels listed.",
          "resource": null
        },
        {
          "name": "Rebuke the Violent",
          "level": 3,
          "description": "You can use your Channel Divinity to rebuke those who use violence. Immediately after an attacker within 30 feet of you deals damage with an attack against a creature other than you, you can use your reaction to force the attacker to make a Wisdom saving throw. On a failed save, the attacker takes radiant damage equal to the damage it just dealt. On a successful save, it takes half as much damage.",
          "resource": null
        },
        {
          "name": "Tenets of Redemption",
          "level": 3,
          "description": "The tenets of the Oath of Redemption hold a paladin to a high standard of peace and justice. Peace: Violence is a weapon of last resort. Diplomacy and understanding are the paths to long-lasting peace. Innocence: All people begin life in an innocent state, and it is their environment or the influence of dark forces that drives them to evil. By setting the proper example, and working to heal the wounds of a deeply flawed world, you can set anyone on a righteous path. Patience: Change takes time. Those who have walked the path of the wicked must be given reminders to keep them honest and true. Once you have planted the seed of righteousness in a creature, you must work day after day to allow t",
          "resource": null
        },
        {
          "name": "Aura of the Guardian",
          "level": 7,
          "description": "Starting at 7th level, you can shield others from harm at the cost of your own health. When a creature within 10 feet of you takes damage, you can use your reaction to magically take that damage, instead of that creature taking it. This feature doesn't transfer any other effects that might accompany the damage, and this damage can't be reduced in any way. At 18th level, the range of this aura increases to 30 feet.",
          "resource": null
        },
        {
          "name": "Protective Spirit",
          "level": 15,
          "description": "Starting at 15th level, a holy presence mends your wounds in battle. You regain hit points equal to 1d6 + half your paladin level if you end your turn in combat with fewer than half of your hit points remaining and you aren't incapacitated.",
          "resource": null
        },
        {
          "name": "Emissary of Redemption",
          "level": 20,
          "description": "At 20th level, you become an avatar of peace, which gives you two benefits: You have resistance to all damage dealt by other creatures (their attacks, spells, and other effects). Whenever a creature hits you with an attack, it takes radiant damage equal to half the damage you take from the attack. If you attack a creature, cast a spell on it, or deal damage to it by any means but this feature, neither benefit works against that creature until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Oath of Glory": {
      "name": "Oath of Glory",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Inspiring Smite",
          "level": 3,
          "description": "Immediately after you cast Divine Smite, you can expend one use of your Channel Divinity and distribute Temporary Hit Points to creatures of your choice within 30 feet of yourself, which can include you. The total number of Temporary Hit Points equals 2d8 plus your Paladin level, divided among the chosen creatures however you like.",
          "resource": null
        },
        {
          "name": "Oath of Glory",
          "level": 3,
          "description": "Strive for the Heights of Heroism Paladins who take the Oath of Glory believe they and their companions are destined to achieve glory through deeds of heroism. They train diligently and encourage their companions, so they're all ready when destiny calls. These paladins share the following tenets: Endeavor to be known by your deeds. Face hardships with courage. Inspire others to strive for glory.",
          "resource": null
        },
        {
          "name": "Oath of Glory Spells",
          "level": 3,
          "description": "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Glory Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Peerless Athlete",
          "level": 3,
          "description": "As a Bonus Action, you can expend one use of your Channel Divinity to augment your athleticism. For 1 hour, you have Advantage on Strength (Athletics) and Dexterity (Acrobatics) checks, and the distance of your Long and High Jumps increases by 10 feet (this extra distance costs movement as normal).",
          "resource": null
        },
        {
          "name": "Aura of Alacrity",
          "level": 7,
          "description": "Your Speed increases by 10 feet. In addition, whenever an ally enters your Aura of Protection for the first time on a turn or starts their turn there, the ally's Speed increases by 10 feet until the end of their next turn.",
          "resource": null
        },
        {
          "name": "Glorious Defense",
          "level": 15,
          "description": "You can turn defense into a sudden strike. When you or another creature you can see within 10 feet of you is hit by an attack roll, you can take a Reaction to grant a bonus to the target's AC against that attack, potentially causing it to miss. The bonus equals your Charisma modifier (minimum of +1). If the attack misses, you can make one attack with a weapon against the attacker as part of this Reaction if the attacker is within your weapon's range. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Living Legend",
          "level": 20,
          "description": "You can empower yourself with the legends—whether true or exaggerated—of your great deeds. As a Bonus Action, you gain the benefits below for 10 minutes. Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Charismatic: You are blessed with an otherworldly presence and have Advantage on all Charisma checks. Saving Throw Reroll: If you fail a saving throw, you can take a Reaction to reroll it. You must use this new roll. Unerring Strike: Once on each of your turns when you make an attack roll with a weapon and miss, you can cause that attack to hit instead.",
          "resource": null
        }
      ]
    },
    "Oath of the Watchers": {
      "name": "Oath of the Watchers",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Oath of the Watchers",
          "level": 3,
          "description": "The Oath of the Watchers binds paladins to protect mortal realms from the predations of extraplanar creatures, many of which can lay waste to mortal soldiers. Thus, the Watchers hone their minds, spirits, and bodies to be the ultimate weapons against such threats. Paladins who follow the Watchers' oath are ever vigilant in spotting the influence of extraplanar forces, often establishing a network of spies and informants to gather information on suspected cults. To a Watcher, keeping a healthy suspicion and awareness about one's surroundings is as natural as wearing armor in battle.",
          "resource": null
        },
        {
          "name": "Channel Divinity",
          "level": 3,
          "description": "3rd-level Oath of the Watchers feature You gain the following Channel Divinity options. See the Sacred Oath class feature for how Channel Divinity works.",
          "resource": {
            "name": "Channel Divinity",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Oath Spells",
          "level": 3,
          "description": "3rd-level Oath of the Watchers feature You gain oath spells at the paladin levels listed in the Oath of the Watchers table. See the Sacred Oath class feature for how oath spells work.",
          "resource": null
        },
        {
          "name": "Tenets of the Watchers",
          "level": 3,
          "description": "A paladin who assumes the Oath of the Watchers swears to safeguard mortal realms from otherworldly threats. Vigilance: The threats you face are cunning, powerful, and subversive. Be ever alert for their corruption. Loyalty: Never accept gifts or favors from fiends or those who truck with them. Stay true to your order, your comrades, and your duty. Discipline: You are the shield against the endless terrors that lie beyond the stars. Your blade must be forever sharp and your mind keen to survive what lies beyond.",
          "resource": null
        },
        {
          "name": "Abjure the Extraplanar",
          "level": 3,
          "description": "You can use your Channel Divinity to castigate unworldly beings. As an action, you present your holy symbol and each aberration, celestial, elemental, fey, or fiend within 30 feet of you that can hear you must make a Wisdom saving throw. On a failed save, the creature is turned for 1 minute or until it takes damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly end its move in a space within 30 feet of you. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can take the Dodge action.",
          "resource": null
        },
        {
          "name": "Watcher's Will",
          "level": 3,
          "description": "You can use your Channel Divinity to invest your presence with the warding power of your faith. As an action, you can choose a number of creatures you can see within 30 feet of you, up to a number equal to your Charisma modifier (minimum of one creature). For 1 minute, you and the chosen creatures have advantage on Intelligence, Wisdom, and Charisma saving throws.",
          "resource": null
        },
        {
          "name": "Aura of the Sentinel",
          "level": 7,
          "description": "7th-level Oath of the Watchers feature You emit an aura of alertness while you aren't incapacitated. When you and any creatures of your choice within 10 feet of you roll initiative, you all gain a bonus to initiative equal to your proficiency bonus. At 18th level, the range of this aura increases to 30 feet.",
          "resource": null
        },
        {
          "name": "Vigilant Rebuke",
          "level": 15,
          "description": "15th-level Oath of the Watchers feature You've learned how to chastise anyone who dares wield beguilements against you and your wards. Whenever you or a creature you can see within 30 feet of you succeeds on an Intelligence, a Wisdom, or a Charisma saving throw, you can use your reaction to deal 2d8 + your Charisma modifier force damage to the creature that forced the saving throw.",
          "resource": null
        },
        {
          "name": "Mortal Bulwark",
          "level": 20,
          "description": "20th-level Oath of the Watchers feature You manifest a spark of divine power in defense of the mortal realms. As a bonus action, you gain the following benefits for 1 minute: You gain truesight with a range of 120 feet. You have advantage on attack rolls against aberrations, celestials, elementals, fey, and fiends. When you hit a creature with an attack roll and deal damage to it, you can also force it to make a Charisma saving throw against your spell save DC. On a failed save, the creature is magically banished to its native plane of existence if it's currently not there. On a successful save, the creature can't be banished by this feature for 24 hours. Once you use this bonus action, you ",
          "resource": null
        }
      ]
    },
    "Oath of the Noble Genies": {
      "name": "Oath of the Noble Genies",
      "source": "Heroes of the Frontier",
      "features": [
        {
          "name": "Dao's Crush",
          "level": 3,
          "description": "Earth rises up around the target of your Divine Smite. The target has the Grappled condition (escape DC equal to your spell save DC). While Grappled, the target has the Restrained condition.",
          "resource": null
        },
        {
          "name": "Djinni's Escape",
          "level": 3,
          "description": "You Teleportation to an unoccupied space you can see within 30 feet of yourself and take on a semi-incorporeal form, which lasts until the end of your next turn. While in this form, you have Resistance to Bludgeoning, Piercing, and Slashing damage, and you have Immunity to the Grappled, Prone, and Restrained conditions.",
          "resource": null
        },
        {
          "name": "Efreeti's Fury",
          "level": 3,
          "description": "The target of your Divine Smite takes an extra 2d4 Fire damage, and fire jumps from the target to another creature you can see within 30 feet of yourself. The second creature also takes 2d4 Fire damage.",
          "resource": null
        },
        {
          "name": "Elemental Smite",
          "level": 3,
          "description": "Immediately after you cast Divine Smite, you can expend one use of your Channel Divinity and invoke one of the following effects.",
          "resource": null
        },
        {
          "name": "Genie Spells",
          "level": 3,
          "description": "When you reach a Paladin level specified in the Genie Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Genie's Splendor",
          "level": 3,
          "description": "When you aren't wearing any armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers. You can use a Shield and still gain this benefit. You also gain proficiency in one of the following skills of your choice: Acrobatics, Intimidation, Performance, or Persuasion.",
          "resource": null
        },
        {
          "name": "Marid's Surge",
          "level": 3,
          "description": "The target of your Divine Smite and each creature of your choice in a 10-foot Emanation [Area of Effect] originating from you make a Strength saving throw against your spell save DC. On a failed save, a creature is pushed 15 feet straight away from you and has the Prone condition.",
          "resource": null
        },
        {
          "name": "Oath of the Noble Genies",
          "level": 3,
          "description": "Brandish the Elemental Splendor of Genies Paladins sworn to the Oath of the Noble Genies revere the forces of the Elemental Planes. Through taking this oath, Paladins draw power from the four different types of genies—dao, masters of earth; djinn, masters of air; efreet, masters of fire; and marids, masters of water. In Faerûn, many Paladins who swear this oath hail from Calimshan, a land teeming with genies. Paladins who swear this oath often undertake quests that take them all over the Realms and across the multiverse—including the Elemental Planes. These paladins share the following tenets: Sow the seeds of creation amid the ashes of destruction. Lead with splendor and grace. Respect the ",
          "resource": null
        },
        {
          "name": "Aura of Elemental Shielding",
          "level": 7,
          "description": "Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. You and your allies have Resistance to that damage type while in your Aura of Protection. At the start of each of your turns, you can change the damage type affected by this feature to one of the other listed options (no action required).",
          "resource": null
        },
        {
          "name": "Elemental Rebuke",
          "level": 15,
          "description": "When you are hit by an attack roll, you can take a Reaction to halve the attack's damage against yourself (round down) and force the attacker to make a Dexterity saving throw against your spell save DC. On a failed save, the attacker takes damage equal to 2d10 plus your Charisma modifier of one of the following types (your choice): Acid, Cold, Fire, Lightning, or Thunder. On a successful save, the attacker takes half as much damage. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Noble Scion",
          "level": 20,
          "description": "As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Flight: You have a Fly Speed of 60 feet and can hover. Minor Wish: When you or an ally in your Aura of Protection fails a D20 Test, you can take a Reaction to make the D20 Test succeed instead.",
          "resource": null
        }
      ]
    }
  },
  "Ranger": {
    "Beast Master": {
      "name": "Beast Master",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Beast Master",
          "level": 3,
          "description": "Bond with a Primal Beast A Beast Master forms a mystical bond with a special animal, drawing on primal magic and a deep connection to the natural world.",
          "resource": null
        },
        {
          "name": "Primal Companion",
          "level": 3,
          "description": "You magically summon a primal beast, which draws strength from your bond with nature. Choose its stat block: Beast of the Land, Beast of the Sea, or Beast of the Sky. You also determine the kind of animal it is, choosing a kind appropriate for the stat block. Whatever beast you choose, it bears primal markings indicating its supernatural origin. The beast is Friendly to you and your allies and obeys your commands. It vanishes if you die. The Beast in Combat: In combat, the beast acts during your turn. It can move and use its Reaction on its own, but the only action it takes is the Dodge action unless you take a Bonus Action to command it to take an action in its stat block or some other acti",
          "resource": null
        },
        {
          "name": "Exceptional Training",
          "level": 7,
          "description": "When you take a Bonus Action to command your Primal Companion beast to take an action, you can also command it to take the Dash, Disengage, Dodge, or Help action using its Bonus Action. In addition, whenever it hits with an attack roll and deals damage, it can deal your choice of Force damage or its normal damage type.",
          "resource": null
        },
        {
          "name": "Bestial Fury",
          "level": 11,
          "description": "When you command your Primal Companion beast to take the Beast's Strike action, the beast can use it twice. In addition, the first time each turn it hits a creature under the effect of your Hunter's Mark spell, the beast deals extra Force damage equal to the bonus damage of that spell.",
          "resource": null
        },
        {
          "name": "Share Spells",
          "level": 15,
          "description": "When you cast a spell targeting yourself, you can also affect your Primal Companion beast with the spell if the beast is within 30 feet of you.",
          "resource": null
        }
      ]
    },
    "Hunter": {
      "name": "Hunter",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Hunter",
          "level": 3,
          "description": "Protect Nature and People from Destruction You stalk prey in the wilds and elsewhere, using your abilities as a Hunter to protect nature and people everywhere from forces that would destroy them.",
          "resource": null
        },
        {
          "name": "Hunter's Lore",
          "level": 3,
          "description": "You can call on the forces of nature to reveal certain strengths and weaknesses of your prey. While a creature is marked by your Hunter's Mark, you know whether that creature has any Immunities, Resistances, or Vulnerabilities, and if the creature has any, you know what they are.",
          "resource": null
        },
        {
          "name": "Hunter's Prey",
          "level": 3,
          "description": "You gain one of the following feature options of your choice. Whenever you finish a Short Rest or Long Rest, you can replace the chosen option with the other one. Colossus Slayer: Your tenacity can wear down even the most resilient foes. When you hit a creature with a weapon, the weapon deals an extra 1d8 damage to the target if it's missing any of its Hit Points. You can deal this extra damage only once per turn. Horde Breaker: Once on each of your turns when you make an attack with a weapon, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target, that is within the weapon's range, and that you haven't attacked this turn.",
          "resource": null
        },
        {
          "name": "Defensive Tactics",
          "level": 7,
          "description": "You gain one of the following feature options of your choice. Whenever you finish a Short Rest or Long Rest, you can replace the chosen option with the other one. Escape the Horde: Opportunity Attack have Disadvantage against you. Multiattack Defense: When a creature hits you with an attack roll, that creature has Disadvantage on all other attack rolls against you this turn.",
          "resource": null
        },
        {
          "name": "Superior Hunter's Prey",
          "level": 11,
          "description": "Once per turn when you deal damage to a creature marked by your Hunter's Mark, you can also deal that spell's extra damage to a different creature that you can see within 30 feet of the first creature.",
          "resource": null
        },
        {
          "name": "Superior Hunter's Defense",
          "level": 15,
          "description": "When you take damage, you can take a Reaction to give yourself Resistance to that damage and any other damage of the same type until the end of the current turn.",
          "resource": null
        }
      ]
    },
    "Gloom Stalker": {
      "name": "Gloom Stalker",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Dread Ambusher",
          "level": 3,
          "description": "You have mastered the art of creating fearsome ambushes, granting you the following benefits. Ambusher's Leap: At the start of your first turn of each combat, your Speed increases by 10 feet until the end of that turn. Dreadful Strike: When you attack a creature and hit it with a weapon, you can deal an extra 2d6 Psychic damage. You can use this benefit only once per turn, you can use it a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. Initiative Bonus: When you roll Initiative, you can add your Wisdom modifier to the roll.",
          "resource": null
        },
        {
          "name": "Gloom Stalker",
          "level": 3,
          "description": "Draw on Shadow Magic to Fight Your Foes Gloom Stalkers are at home in the darkest places, wielding magic drawn from the Shadowfell to combat enemies that lurk in darkness.",
          "resource": null
        },
        {
          "name": "Gloom Stalker Spells",
          "level": 3,
          "description": "When you reach a Ranger level specified in the Gloom Stalker Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Umbral Sight",
          "level": 3,
          "description": "You gain Darkvision with a range of 60 feet. If you already have Darkvision when you gain this feature, its range increases by 60 feet. You are also adept at evading creatures that rely on Darkvision. While entirely in Darkness, you have the Invisible condition to any creature that relies on Darkvision to see you in that Darkness.",
          "resource": null
        },
        {
          "name": "Iron Mind",
          "level": 7,
          "description": "You have honed your ability to resist mind-altering powers. You gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).",
          "resource": null
        },
        {
          "name": "Stalker's Flurry",
          "level": 11,
          "description": "The Psychic damage of your Dreadful Strike becomes 2d8. In addition, when you use the Dreadful Strike effect of your Dread Ambusher feature, you can cause one of the following additional effects. Sudden Strike: You can make another attack with the same weapon against a different creature that is within 5 feet of the original target and that is within the weapon's range. Mass Fear: The target and each creature within 10 feet of it must make a Wisdom saving throw against your spell save DC. On a failed save, a creature has the Frightened condition until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Shadowy Dodge",
          "level": 15,
          "description": "When a creature makes an attack roll against you, you can take a Reaction to impose Disadvantage on that roll. Whether the attack hits or misses, you can then teleport up to 30 feet to an unoccupied space you can see.",
          "resource": null
        }
      ]
    },
    "Horizon Walker": {
      "name": "Horizon Walker",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Horizon Walker",
          "level": 3,
          "description": "Horizon Walkers guard the world against threats that originate from other planes or that seek to ravage the mortal realm with otherworldly magic. They seek out planar portals and keep watch over them, venturing to the Inner Planes and the Outer Planes as needed to pursue their foes. These rangers are also friends to any forces in the multiverse—especially benevolent dragons, fey, and elementals—that work to preserve life and the order of the planes.",
          "resource": null
        },
        {
          "name": "Detect Portal",
          "level": 3,
          "description": "At 3rd level, you gain the ability to magically sense the presence of a planar portal. As an action, you detect the distance and direction to the closest planar portal within 1 mile of you. Once you use this feature, you can't use it again until you finish a short or long rest. See the \"Planar Travel\" section in chapter 2 of the Dungeon Master's Guide for examples of planar portals.",
          "resource": null
        },
        {
          "name": "Horizon Walker Magic",
          "level": 3,
          "description": "Starting at 3rd level, you learn an additional spell when you reach certain levels in this class, as shown in the Horizon Walker Spells table. The spell counts as a ranger spell for you, but it doesn't count against the number of ranger spells you know.",
          "resource": null
        },
        {
          "name": "Planar Warrior",
          "level": 3,
          "description": "At 3rd level, you learn to draw on the energy of the multiverse to augment your attacks. As a bonus action, choose one creature you can see within 30 feet of you. The next time you hit that creature on this turn with a weapon attack, all damage dealt by the attack becomes force damage, and the creature takes an extra 1d8 force damage from the attack. When you reach 11th level in this class, the extra damage increases to 2d8.",
          "resource": null
        },
        {
          "name": "Ethereal Step",
          "level": 7,
          "description": "At 7th level, you learn to step through the Ethereal Plane. As a bonus action, you can cast the etherealness spell with this feature, without expending a spell slot, but the spell ends at the end of the current turn. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Distant Strike",
          "level": 11,
          "description": "At 11th level, you gain the ability to pass between the planes in the blink of an eye. When you take the Attack action, you can teleport up to 10 feet before each attack to an unoccupied space you can see. If you attack at least two different creatures with the action, you can make one additional attack with it against a third creature.",
          "resource": null
        },
        {
          "name": "Spectral Defense",
          "level": 15,
          "description": "At 15th level, your ability to move between planes enables you to slip through the planar boundaries to lessen the harm done to you during battle. When you take damage from an attack, you can use your reaction to give yourself resistance to all of that attack's damage on this turn.",
          "resource": null
        }
      ]
    },
    "Monster Slayer": {
      "name": "Monster Slayer",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Monster Slayer",
          "level": 3,
          "description": "You have dedicated yourself to hunting down creatures of the night and wielders of grim magic. A Monster Slayer seeks out vampires, dragons, evil fey, fiends, and other magical threats. Trained in supernatural techniques to overcome such monsters, slayers are experts at unearthing and defeating mighty, mystical foes.",
          "resource": null
        },
        {
          "name": "Hunter's Sense",
          "level": 3,
          "description": "At 3rd level, you gain the ability to peer at a creature and magically discern how best to hurt it. As an action, choose one creature you can see within 60 feet of you. You immediately learn whether the creature has any damage immunities, resistances, or vulnerabilities and what they are. If the creature is hidden from divination magic, you sense that it has no damage immunities, resistances, or vulnerabilities. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses of it when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Monster Slayer Magic",
          "level": 3,
          "description": "Starting at 3rd level, you learn an additional spell when you reach certain levels in this class, as shown in the Monster Slayer Spells table. The spell counts as a ranger spell for you, but it doesn't count against the number of ranger spells you know.",
          "resource": null
        },
        {
          "name": "Slayer's Prey",
          "level": 3,
          "description": "Starting at 3rd level, you can focus your ire on one foe, increasing the harm you inflict on it. As a bonus action, you designate one creature you can see within 60 feet of you as the target of this feature. The first time each turn that you hit that target with a weapon attack, it takes an extra 1d6 damage from the weapon. This benefit lasts until you finish a short or long rest. It ends early if you designate a different creature.",
          "resource": null
        },
        {
          "name": "Supernatural Defense",
          "level": 7,
          "description": "At 7th level, you gain extra resilience against your prey's assaults on your mind and body. Whenever the target of your Slayer's Prey forces you to make a saving throw and whenever you make an ability check to escape that target's grapple, add 1d6 to your roll.",
          "resource": null
        },
        {
          "name": "Magic-User's Nemesis",
          "level": 11,
          "description": "At 11th level, you gain the ability to thwart someone else's magic. When you see a creature casting a spell or teleporting within 60 feet of you, you can use your reaction to try to magically foil it. The creature must succeed on a Wisdom saving throw against your spell save DC, or its spell or teleport fails and is wasted. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Slayer's Counter",
          "level": 15,
          "description": "At 15th level, you gain the ability to counterattack when your prey tries to sabotage you. If the target of your Slayer's Prey forces you to make a saving throw, you can use your reaction to make one weapon attack against the quarry. You make this attack immediately before making the saving throw. If your attack hits, your save automatically succeeds, in addition to the attack's normal effects.",
          "resource": null
        }
      ]
    },
    "Fey Wanderer": {
      "name": "Fey Wanderer",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Fey Wanderer",
          "level": 3,
          "description": "Wield Fey Mirth and Fury A fey mystique surrounds you, thanks to the boon of an archfey or a location in the Feywild that transformed you. However you gained fey magic, you are now a Fey Wanderer. Your joyful laughter brightens the hearts of the downtrodden, and your martial prowess strikes terror in your foes, for great is the mirth of the fey and dreadful is their fury.",
          "resource": null
        },
        {
          "name": "Dreadful Strikes",
          "level": 3,
          "description": "You can augment your weapon strikes with mind-scarring magic drawn from the murky hollows of the Feywild. When you hit a creature with a weapon, you can deal an extra 1d4 Psychic damage to the target, which can take this extra damage only once per turn. The extra damage increases to 1d6 when you reach Ranger level 11.",
          "resource": null
        },
        {
          "name": "Fey Wanderer Spells",
          "level": 3,
          "description": "When you reach a Ranger level specified in the Fey Wanderer Spells table, you thereafter always have the listed spells prepared. You also possess a fey blessing. Choose it from the Feywild Gifts table or determine it randomly.",
          "resource": null
        },
        {
          "name": "Otherworldly Glamour",
          "level": 3,
          "description": "Whenever you make a Charisma check, you gain a bonus to the check equal to your Wisdom modifier (minimum of +1). You also gain proficiency in one of these skills of your choice: Deception, Performance, or Persuasion.",
          "resource": null
        },
        {
          "name": "Beguiling Twist",
          "level": 7,
          "description": "The magic of the Feywild guards your mind. You have Advantage on saving throws to avoid or end the Charmed or Frightened condition. In addition, whenever you or a creature you can see within 120 feet of you succeeds on a saving throw to avoid or end the Charmed or Frightened condition, you can take a Reaction to force a different creature you can see within 120 feet of yourself to make a Wisdom save against your spell save DC. On a failed save, the target is Charmed or Frightened (your choice) for 1 minute. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.",
          "resource": null
        },
        {
          "name": "Fey Reinforcements",
          "level": 11,
          "description": "You can cast Summon Fey without a Material component. You can also cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you start casting the spell, you can modify it so that it doesn't require Concentration. If you do so, the spell's duration becomes 1 minute for that casting.",
          "resource": null
        },
        {
          "name": "Misty Wanderer",
          "level": 15,
          "description": "You can cast Misty Step without expending a spell slot. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. In addition, whenever you cast Misty Step, you can bring along one willing creature you can see within 5 feet of yourself. That creature teleports to an unoccupied space of your choice within 5 feet of your destination space.",
          "resource": null
        }
      ]
    },
    "Swarmkeeper": {
      "name": "Swarmkeeper",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Swarmkeeper",
          "level": 3,
          "description": "Feeling a deep connection to the environment around them, some rangers reach out through their magical connection to the world and bond with a swarm of nature spirits. The swarm becomes a potent force in battle, as well as helpful company for the ranger. Some Swarmkeepers are outcasts or hermits, keeping to themselves and their attendant swarms rather than dealing with the discomfort of others. Other Swarmkeepers enjoy building vibrant communities that work for the mutual benefit of all those they consider part of their swarm.",
          "resource": null
        },
        {
          "name": "Gathered Swarm",
          "level": 3,
          "description": "3rd-level Swarmkeeper feature A swarm of intangible nature spirits has bonded itself to you and can assist you in battle. While you're alive, the swarm remains in your space, crawling on you or flying and skittering around you within your space. You determine its appearance, or you generate its appearance by rolling on the Swarm Appearance table. Once on each of your turns, you can cause the swarm to assist you in one of the following ways, immediately after you hit a creature with an attack: The attack's target takes 1d6 piercing damage from the swarm. The attack's target must succeed on a Strength saving throw against your spell save DC or be moved by the swarm up to 15 feet horizontally i",
          "resource": null
        },
        {
          "name": "Swarmkeeper Magic",
          "level": 3,
          "description": "3rd-level Swarmkeeper feature You learn the mage hand cantrip if you don't already know it. When you cast it, the hand takes the form of your swarming nature spirits. You also learn an additional spell of 1st level or higher when you reach certain levels in this class, as shown in the Swarmkeeper Spells table. Each spell counts as a ranger spell for you, but it doesn't count against the number of ranger spells you know.",
          "resource": null
        },
        {
          "name": "Writhing Tide",
          "level": 7,
          "description": "7th-level Swarmkeeper feature You can condense part of your swarm into a focused mass that lifts you up. As a bonus action, you gain a flying speed of 10 feet and can hover. This effect lasts for 1 minute or until you are incapacitated. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Mighty Swarm",
          "level": 11,
          "description": "11th-level Swarmkeeper feature Your Gathered Swarm grows mightier in the following ways: The damage of Gathered Swarm increases to 1d8. If a creature fails its saving throw against being moved by Gathered Swarm, you can also cause the swarm to knock the creature prone. When you are moved by Gathered Swarm, it gives you Cover until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Swarming Dispersal",
          "level": 15,
          "description": "15th-level Swarmkeeper feature You can discorporate into your swarm, avoiding danger. When you take damage, you can use your reaction to give yourself resistance to that damage. You vanish into your swarm and then teleport to an unoccupied space that you can see within 30 feet of you, where you reappear with the swarm. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Drakewarden": {
      "name": "Drakewarden",
      "source": "Fizban's Dragons",
      "features": [
        {
          "name": "Drakewarden",
          "level": 3,
          "description": "Your connection to the natural world takes the form of a draconic spirit, which can manifest in physical form as a drake. As your powers grow, your drake grows as well, blossoming from a small four-legged companion to a majestic winged creature large and strong enough for you to ride. Along the way, you gain an increasing share of the awe-inspiring power of dragons. Consider the source of the draconic spirit you have bonded with. The Drakewarden Origin table offers examples.",
          "resource": null
        },
        {
          "name": "Draconic Gift",
          "level": 3,
          "description": "3rd-level Drakewarden feature The bond you share with your drake creates a connection to dragonkind, granting you understanding and empowering your presence. You gain the following benefits:",
          "resource": null
        },
        {
          "name": "Drake Companion",
          "level": 3,
          "description": "3rd-level Drakewarden feature As an action, you can magically summon the drake that is bound to you. It appears in an unoccupied space of your choice within 30 feet of you. The drake is friendly to you and your companions, and it obeys your commands. See its game statistics in the accompanying Drake Companion stat block, which uses your proficiency bonus (PB) in several places. Whenever you summon the drake, choose a damage type listed in its Draconic Essence trait. You can determine the cosmetic characteristics of the drake, such as its color, its scale texture, or any visible effect of its Draconic Essence; your choice has no effect on its game statistics. In combat, the drake shares your ",
          "resource": null
        },
        {
          "name": "Bond of Fang and Scale",
          "level": 7,
          "description": "7th-level Drakewarden feature The bond you share with your drake intensifies, protecting you and stoking the drake's fury. When you summon your drake, it grows wings on its back and gains a flying speed equal to its walking speed. In addition, while your drake is summoned, you and the drake gain the following benefits: The drake grows to Medium size. Reflecting your special bond, you can use the drake as a mount if your size is Medium or smaller. While you are riding your drake, it can't use the flying speed of this feature. The drake's Bite attack deals an extra 1d6 damage of the type chosen for the drake's Draconic Essence. You gain resistance to the damage type chosen for the drake's Drac",
          "resource": null
        },
        {
          "name": "Drake's Breath",
          "level": 11,
          "description": "11th-level Drakewarden feature As an action, you can exhale a 30-foot cone of damaging breath or cause your drake to exhale it. Choose acid, cold, fire, lightning, or poison damage (your choice doesn't have to match your drake's Draconic Essence). Each creature in the cone must make a Dexterity saving throw against your spell save DC, taking 8d6 damage on a failed save, or half as much damage on a successful one. This damage increases to 10d6 when you reach 15th level in this class. Once you use this feature, you can't do so again until you finish a long rest, unless you expend a spell slot of 3rd level or higher to use it again.",
          "resource": null
        },
        {
          "name": "Perfected Bond",
          "level": 15,
          "description": "15th-level Drakewarden feature Your bond to your drake reaches the pinnacle of its power. While your drake is summoned, you and the drake gain the following benefits: The drake's Bite attack deals an extra 1d6 damage of the type chosen for its Draconic Essence (for a total of 2d6 extra damage). The drake grows to Large size. When you ride your drake, it is no longer prohibited from using the flying speed of Bond of Fang and Scale. When either you or the drake takes damage while you're within 30 feet of each other, you can use your reaction to give yourself or the drake resistance to that instance of damage. You can use this reaction a number of times equal to your proficiency bonus, and you ",
          "resource": null
        }
      ]
    },
    "Winter Walker": {
      "name": "Winter Walker",
      "source": "Heroes of the Frontier",
      "features": [
        {
          "name": "Frigid Explorer",
          "level": 3,
          "description": "You gain the following benefits. Biting Cold: Damage from your weapon attacks, Ranger spells, and Ranger features ignores Resistance to Cold damage. Frost Resistance: You have Resistance to Cold damage. Polar Strikes: When you hit a creature with an attack roll using a weapon, you can deal an extra 1d4 Cold damage to the target, which can take this extra damage only once per turn. When you reach Ranger level 11, this extra damage increases to 1d6.",
          "resource": null
        },
        {
          "name": "Hunter's Rime",
          "level": 3,
          "description": "Ice rimes you and your prey, protecting you and slowing them. When you cast Hunter's Mark, you gain Temporary Hit Points equal to 1d10 plus your Ranger level. Additionally, while a creature is marked by your Hunter's Mark, it can't take the Disengage action.",
          "resource": null
        },
        {
          "name": "Winter Walker",
          "level": 3,
          "description": "Withstand the Horrors of Frigid Wastelands Winter Walkers hone their craft in the bleak and frozen wilds of places like Icewind Dale. These ruthless, rimed Rangers hunt monsters that haunt arctic wastelands, eventually becoming frigid terrors themselves. Winter Walkers are well versed in the phenomena of Icewind Dale, including the latent magic of fallen Netherese cities, endemic monsters like yeti and crag cat, and the rising threat of Underdark invaders. Due to their cold pragmatism, terrifying magic, and mastery of the region, Winter Walkers are regarded with equal parts respect and fear. Ten-Towns citizens say that Winter Walkers' frequent exposure to malignant entities gives them their ",
          "resource": null
        },
        {
          "name": "Winter Walker Spells",
          "level": 3,
          "description": "When you reach a Ranger level specified in the Winter Walker Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Fortifying Soul",
          "level": 7,
          "description": "Your experience surviving harrowing environments allows you to bolster your allies in addition to yourself. As a Magic action, choose a number of creatures you can see equal to your Wisdom modifier (minimum of one). Each chosen creature regains Hit Points equal to 1d10 plus your Ranger level and has Advantage on saving throws to avoid or end the Frightened condition for 1 hour. Once you use this feature, you can't use it again until you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Chilling Retribution",
          "level": 11,
          "description": "When a creature hits you with an attack roll, you can take a Reaction to force the creature to make a Wisdom saving throw against your spell save DC. On a failed save, the target has the Stunned condition until the end of your next turn. While the target is Stunned, its Speed is reduced to 0 feet. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Frozen Haunt",
          "level": 15,
          "description": "When you cast Hunter's Mark, you can adopt a ghostly, snowy form. This form lasts until the spell ends, and while you are in this form, you gain the following benefits. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a level 4+ spell slot (no action required). Frozen Soul: You have Immunity to Cold damage. When you first adopt this form and at the start of each of your subsequent turns, each creature of your choice in a 15-foot Emanation [Area of Effect] originating from you takes 2d4 Cold damage. Partially Incorporeal: You have Immunity to the Grappled, Prone, and Restrained conditions. You can move through creatures and objects as if they we",
          "resource": null
        }
      ]
    }
  },
  "Rogue": {
    "Arcane Trickster": {
      "name": "Arcane Trickster",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Arcane Trickster",
          "level": 3,
          "description": "Enhance Stealth with Arcane Spells Some Rogues enhance their fine-honed skills of stealth and agility with spells, learning magical tricks to aid them in their trade. Some Arcane Tricksters use their talents as pickpockets and burglars, while others are pranksters.",
          "resource": null
        },
        {
          "name": "Mage Hand Legerdemain",
          "level": 3,
          "description": "When you cast Mage Hand, you can cast it as a Bonus Action, and you can make the spectral hand Invisible. You can control the hand as a Bonus Action, and through it, you can make Dexterity (Sleight of Hand) checks.",
          "resource": null
        },
        {
          "name": "Spellcasting",
          "level": 3,
          "description": "You have learned to cast spells. See  for the rules on spellcasting. The information below details how you use those rules as an Arcane Trickster. Cantrips: You know three cantrips: Mage Hand and two other cantrips of your choice from the  (see that class's section for its list). Mind Sliver and Minor Illusion are recommended. Whenever you gain a Rogue level, you can replace one of your cantrips, except Mage Hand, with another Wizard cantrip of your choice. When you reach Rogue level 10, you learn another Wizard cantrip of your choice. Spell Slots: The Arcane Trickster Spellcasting table shows how many spell slots you have to cast your level 1+ spells. You regain all expended spell slots whe",
          "resource": null
        },
        {
          "name": "Magical Ambush",
          "level": 9,
          "description": "If you have the Invisible condition when you cast a spell on a creature, it has Disadvantage on any saving throw it makes against the spell on the same turn.",
          "resource": null
        },
        {
          "name": "Versatile Trickster",
          "level": 13,
          "description": "You gain the ability to distract targets with your Mage Hand. When you use the Trip option of your Cunning Strike on a creature, you can also use that option on another creature within 5 feet of the spectral hand.",
          "resource": null
        },
        {
          "name": "Spell Thief",
          "level": 17,
          "description": "You gain the ability to magically steal the knowledge of how to cast a spell from another spellcaster. Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can take a Reaction to force the creature to make an Intelligence saving throw. The DC equals your spell save DC. On a failed save, you negate the spell's effect against you, and you steal the knowledge of the spell if it is at least level 1 and of a level you can cast (it doesn't need to be a Wizard spell). For the next 8 hours, you have the spell prepared. The creature can't cast it until the 8 hours have passed. Once you steal a spell with this feature, you can't use this feature again ",
          "resource": null
        }
      ]
    },
    "Assassin": {
      "name": "Assassin",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Assassin",
          "level": 3,
          "description": "Practice the Grim Art of Death An Assassin's training focuses on using stealth, poison, and disguise to eliminate foes with deadly efficiency. While some Rogues who follow this path are hired killers, spies, or bounty hunters, the capabilities of this subclass are equally useful for adventurers facing a variety of monstrous enemies.",
          "resource": null
        },
        {
          "name": "Assassin's Tools",
          "level": 3,
          "description": "You gain a Disguise Kit and a Poisoner's Kit, and you have proficiency with them.",
          "resource": null
        },
        {
          "name": "Assassinate",
          "level": 3,
          "description": "You're adept at ambushing a target, granting you the following benefits. Initiative: You have Advantage on Initiative rolls. Surprising Strikes: During the first round of each combat, you have Advantage on attack rolls against any creature that hasn't taken a turn. If your Sneak Attack hits any target during that round, the target takes extra damage of the weapon's type equal to your Rogue level.",
          "resource": null
        },
        {
          "name": "Infiltration Expertise",
          "level": 9,
          "description": "You are expert at the following techniques that aid your infiltrations. Masterful Mimicry: You can unerringly mimic another person's speech, handwriting, or both if you have spent at least 1 hour studying them. Roving Aim: Your Speed isn't reduced to 0 by using Steady Aim.",
          "resource": null
        },
        {
          "name": "Envenom Weapons",
          "level": 13,
          "description": "When you use the Poison option of your Cunning Strike, the target also takes 2d6 Poison damage whenever it fails the saving throw. This damage ignores Resistance to Poison damage.",
          "resource": null
        },
        {
          "name": "Death Strike",
          "level": 17,
          "description": "When you hit with your Sneak Attack on the first round of a combat, the target must succeed on a Constitution saving throw (8 plus your Dexterity modifier and Proficiency), or the attack's damage is doubled against the target.",
          "resource": null
        }
      ]
    },
    "Thief": {
      "name": "Thief",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Fast Hands",
          "level": 3,
          "description": "As a Bonus Action, you can do one of the following. Sleight of Hand: Make a Dexterity (Sleight of Hand) check to pick a lock or disarm a trap with Thieves' Tools or to pick a pocket. Use an Object: Take the Utilize action, or take the Magic action to use a magic item that requires that action.",
          "resource": null
        },
        {
          "name": "Second-Story Work",
          "level": 3,
          "description": "You've trained to get into especially hard-to-reach places, granting you these benefits. Climber: You gain a Climb Speed equal to your Speed. Jumper: You can determine your jump distance using your Dexterity rather than your Strength.",
          "resource": null
        },
        {
          "name": "Thief",
          "level": 3,
          "description": "Hunt for Treasure as a Classic Adventurer A mix of burglar, treasure hunter, and explorer, you are the epitome of an adventurer. In addition to improving your agility and stealth, you gain abilities useful for delving into ruins and getting maximum benefit from the magic items you find there.",
          "resource": null
        },
        {
          "name": "Supreme Sneak",
          "level": 9,
          "description": "You gain the following Cunning Strike option. Stealth Attack (Cost: 1d6): If you have the Hide action's Invisible condition, this attack doesn't end that condition on you if you end the turn behind Cover or Cover.",
          "resource": null
        },
        {
          "name": "Use Magic Device",
          "level": 13,
          "description": "You've learned how to maximize use of magic items, granting you the following benefits. Attunement: You can attune to up to four magic items at once. Charges: Whenever you use a magic item property that expends charges, roll 1d6. On a roll of 6, you use the property without expending the charges. Scrolls: You can use any Spell Scroll, using Intelligence as your spellcasting ability for the spell. If the spell is a cantrip or a level 1 spell, you can cast it reliably. If the scroll contains a higher-level spell, you must first succeed on an Intelligence (Arcana) check (10 plus the spell's level). On a successful check, you cast the spell from the scroll. On a failed check, the scroll disinteg",
          "resource": null
        },
        {
          "name": "Thief's Reflexes",
          "level": 17,
          "description": "You are adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal Initiative and your second turn at your Initiative minus 10.",
          "resource": null
        }
      ]
    },
    "Inquisitive": {
      "name": "Inquisitive",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Inquisitive",
          "level": 3,
          "description": "As an archetypal Inquisitive, you excel at rooting out secrets and unraveling mysteries. You rely on your sharp eye for detail, but also on your finely honed ability to read the words and deeds of other creatures to determine their true intent. You excel at defeating creatures that hide among and prey upon ordinary folk, and your mastery of lore and your keen deductions make you well equipped to expose and end hidden evils.",
          "resource": null
        },
        {
          "name": "Ear for Deceit",
          "level": 3,
          "description": "When you choose this archetype at 3rd level, you develop a talent for picking out lies. Whenever you make a Wisdom (Insight) check to determine whether a creature is lying, treat a roll of 7 or lower on the d20 as an 8.",
          "resource": null
        },
        {
          "name": "Eye for Detail",
          "level": 3,
          "description": "Starting at 3rd level, you can use a bonus action to make a Wisdom (Perception) check to spot a hidden creature or object or to make an Intelligence (Investigation) check to uncover or decipher clues.",
          "resource": null
        },
        {
          "name": "Insightful Fighting",
          "level": 3,
          "description": "At 3rd level, you gain the ability to decipher an opponent's tactics and develop a counter to them. As a bonus action, you can make a Wisdom (Insight) check against a creature you can see that isn't incapacitated, contested by the target's Charisma (Deception) check. If you succeed, you can use your Sneak Attack against that target even if you don't have advantage on the attack roll, but not if you have disadvantage on it. This benefit lasts for 1 minute or until you successfully use this feature against a different target.",
          "resource": null
        },
        {
          "name": "Steady Eye",
          "level": 9,
          "description": "Starting at 9th level, you have advantage on any Wisdom (Perception) or Intelligence (Investigation) check if you move no more than half your speed on the same turn.",
          "resource": null
        },
        {
          "name": "Unerring Eye",
          "level": 13,
          "description": "Beginning at 13th level, your senses are almost impossible to foil. As an action, you sense the presence of illusions, shapechangers not in their original form, and other magic designed to deceive the senses within 30 feet of you, provided you aren't blinded or deafened. You sense that an effect is attempting to trick you, but you gain no insight into what is hidden or into its true nature. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Eye for Weakness",
          "level": 17,
          "description": "At 17th level, you learn to exploit a creature's weaknesses by carefully studying its tactics and movement. While your Insightful Fighting feature applies to a creature, your Sneak Attack damage against that creature increases by 3d6.",
          "resource": null
        }
      ]
    },
    "Mastermind": {
      "name": "Mastermind",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Mastermind",
          "level": 3,
          "description": "Your focus is on people and on the influence and secrets they have. Many spies, courtiers, and schemers follow this archetype, leading lives of intrigue. Words are your weapons as often as knives or poison, and secrets and favors are some of your favorite treasures.",
          "resource": null
        },
        {
          "name": "Master of Intrigue",
          "level": 3,
          "description": "When you choose this archetype at 3rd level, you gain proficiency with the disguise kit, the forgery kit, and one gaming set of your choice. You also learn two languages of your choice. Additionally, you can unerringly mimic the speech patterns and accent of a creature that you hear speak for at least 1 minute, enabling you to pass yourself off as a native speaker of a particular land, provided that you know the language.",
          "resource": null
        },
        {
          "name": "Master of Tactics",
          "level": 3,
          "description": "Starting at 3rd level, you can use the Help action as a bonus action. Additionally, when you use the Help action to aid an ally in attacking a creature, the target of that attack can be within 30 feet of you, rather than within 5 feet of you, if the target can see or hear you.",
          "resource": null
        },
        {
          "name": "Insightful Manipulator",
          "level": 9,
          "description": "Starting at 9th level, if you spend at least 1 minute observing or interacting with another creature outside combat, you can learn certain information about its capabilities compared to your own. The DM tells you if the creature is your equal, superior, or inferior in regard to two of the following characteristics of your choice: Intelligence score Wisdom score Charisma score Class levels (if any) At the DM's option, you might also realize you know a piece of the creature's history or one of its personality traits, if it has any.",
          "resource": null
        },
        {
          "name": "Misdirection",
          "level": 13,
          "description": "Beginning at 13th level, you can sometimes cause another creature to suffer an attack meant for you. When you are targeted by an attack while a creature within 5 feet of you is granting you cover against that attack, you can use your reaction to have the attack target that creature instead of you.",
          "resource": null
        },
        {
          "name": "Soul of Deceit",
          "level": 17,
          "description": "Starting at 17th level, your thoughts can't be read by telepathy or other means, unless you allow it. You can present false thoughts by succeeding on a Charisma (Deception) check contested by the mind reader's Wisdom (Insight) check. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates you are being truthful if you so choose, and you can't be compelled to tell the truth by magic.",
          "resource": null
        }
      ]
    },
    "Scout": {
      "name": "Scout",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Scout",
          "level": 3,
          "description": "You are skilled in stealth and surviving far from the streets of a city, allowing you to scout ahead of your companions during expeditions. Rogues who embrace this archetype are at home in the wilderness and among barbarians and rangers, and many Scouts serve as the eyes and ears of war bands. Ambusher, spy, bounty hunter—these are just a few of the roles that Scouts assume as they range the world.",
          "resource": null
        },
        {
          "name": "Skirmisher",
          "level": 3,
          "description": "Starting at 3rd level, you are difficult to pin down during a fight. You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.",
          "resource": null
        },
        {
          "name": "Survivalist",
          "level": 3,
          "description": "When you choose this archetype at 3rd level, you gain proficiency in the Nature and Survival skills if you don't already have it. Your proficiency bonus is doubled for any ability check you make that uses either of those proficiencies.",
          "resource": null
        },
        {
          "name": "Superior Mobility",
          "level": 9,
          "description": "At 9th level, your walking speed increases by 10 feet. If you have a climbing or swimming speed, this increase applies to that speed as well.",
          "resource": null
        },
        {
          "name": "Ambush Master",
          "level": 13,
          "description": "Starting at 13th level, you excel at leading ambushes and acting first in a fight. You have advantage on initiative rolls. In addition, the first creature you hit during the first round of a combat becomes easier for you and others to strike; attack rolls against that target have advantage until the start of your next turn.",
          "resource": null
        },
        {
          "name": "Sudden Strike",
          "level": 17,
          "description": "Starting at 17th level, you can strike with deadly speed. If you take the Attack action on your turn, you can make one additional attack as a bonus action. This attack can benefit from your Sneak Attack even if you have already used it this turn, but you can't use your Sneak Attack against the same target more than once in a turn.",
          "resource": null
        }
      ]
    },
    "Swashbuckler": {
      "name": "Swashbuckler",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Swashbuckler",
          "level": 3,
          "description": "You focus your training on the art of the blade, relying on speed, elegance, and charm in equal parts. While some warriors are brutes clad in heavy armor, your method of fighting looks almost like a performance. Duelists and pirates typically belong to this archetype. A Swashbuckler excels in single combat, and can fight with two weapons while safely darting away from an opponent.",
          "resource": null
        },
        {
          "name": "Fancy Footwork",
          "level": 3,
          "description": "When you choose this archetype at 3rd level, you learn how to land a strike and then slip away without reprisal. During your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn.",
          "resource": null
        },
        {
          "name": "Rakish Audacity",
          "level": 3,
          "description": "Starting at 3rd level, your confidence propels you into battle. You can give yourself a bonus to your initiative rolls equal to your Charisma modifier. You also gain an additional way to use your Sneak Attack; you don't need advantage on your attack roll to use Sneak Attack against a creature if you are within 5 feet of it, no other creatures are within 5 feet of you, and you don't have disadvantage on the attack roll. All the other rules for Sneak Attack still apply to you.",
          "resource": null
        },
        {
          "name": "Panache",
          "level": 9,
          "description": "At 9th level, your charm becomes extraordinarily beguiling. As an action, you can make a Charisma (Persuasion) check contested by a creature's Wisdom (Insight) check. The creature must be able to hear you, and the two of you must share a language. If you succeed on the check and the creature is hostile to you, it has disadvantage on attack rolls against targets other than you and can't make opportunity attacks against targets other than you. This effect lasts for 1 minute, until one of your companions attacks the target or affects it with a spell, or until you and the target are more than 60 feet apart. If you succeed on the check and the creature isn't hostile to you, it is charmed by you f",
          "resource": null
        },
        {
          "name": "Elegant Maneuver",
          "level": 13,
          "description": "Starting at 13th level, you can use a bonus action on your turn to gain advantage on the next Dexterity (Acrobatics) or Strength (Athletics) check you make during the same turn.",
          "resource": null
        },
        {
          "name": "Master Duelist",
          "level": 17,
          "description": "Beginning at 17th level, your mastery of the blade lets you turn failure into success in combat. If you miss with an attack roll, you can roll it again with advantage. Once you do so, you can't use this feature again until you finish a short or long rest.",
          "resource": null
        }
      ]
    },
    "Phantom": {
      "name": "Phantom",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Phantom",
          "level": 3,
          "description": "Many rogues walk a fine line between life and death, risking their own lives and taking the lives of others. While adventuring on that line, some rogues discover a mystical connection to death itself. These rogues take knowledge from the dead and become immersed in negative energy, eventually becoming like ghosts. Thieves' guilds value them as highly effective information gatherers and spies. Many shadar-kai of the Shadowfell are masters of these macabre techniques, and some are willing to teach this path. In places like Thay in the Forgotten Realms and Karrnath in Eberron, where many necromancers practice their craft, a Phantom can become a wizard's confidant and right hand. In temples of g",
          "resource": null
        },
        {
          "name": "Wails from the Grave",
          "level": 3,
          "description": "3rd-level Phantom feature As you nudge someone closer to the grave, you can channel the power of death to harm someone else as well. Immediately after you deal your Sneak Attack damage to a creature on your turn, you can target a second creature that you can see within 30 feet of the first creature. Roll half the number of Sneak Attack dice for your level (round up), and the second creature takes necrotic damage equal to the roll's total, as wails of the dead sound around them for a moment. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Whispers of the Dead",
          "level": 3,
          "description": "3rd-level Phantom feature Echoes of those who have died cling to you. Whenever you finish a short or long rest, you can choose one skill or tool proficiency that you lack and gain it, as a ghostly presence shares its knowledge with you. You lose this proficiency when you use this feature to choose a different proficiency that you lack.",
          "resource": null
        },
        {
          "name": "Tokens of the Departed",
          "level": 9,
          "description": "9th-level Phantom feature When a life ends in your presence, you're able to snatch a token from the departing soul, a sliver of its life essence that takes physical form: as a reaction when a creature you can see dies within 30 feet of you, you can open your free hand and cause a Tiny trinket to appear there, a soul trinket. The DM determines the trinket's form or has you roll on the Trinket table in the Player's Handbook to generate it. You can have a maximum number of soul trinkets equal to your proficiency bonus, and you can't create one while at your maximum. You can use soul trinkets in the following ways: While a soul trinket is on your person, you have advantage on death saving throws",
          "resource": null
        },
        {
          "name": "Ghost Walk",
          "level": 13,
          "description": "13th-level Phantom feature You can phase partially into the realm of the dead, becoming like a ghost. As a bonus action, you assume a spectral form. While in this form, you have a flying speed of 10 feet, you can hover, and attack rolls have disadvantage against you. You can also move through creatures and objects as if they were difficult terrain, but you take 1d10 force damage if you end your turn inside a creature or an object. You stay in this form for 10 minutes or until you end it as a bonus action. To use this feature again, you must finish a long rest or destroy one of your soul trinkets as part of the bonus action you use to activate Ghost Walk.",
          "resource": null
        },
        {
          "name": "Death's Friend",
          "level": 17,
          "description": "17th-level Phantom feature Your association with death has become so close that you gain the following benefits: When you use your Wails from the Grave, you can deal the necrotic damage to both the first and the second creature. At the end of a long rest, a soul trinket appears in your hand if you don't have any soul trinkets, as the spirits of the dead are drawn to you.",
          "resource": null
        }
      ]
    },
    "Soulknife": {
      "name": "Soulknife",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Soulknife",
          "level": 3,
          "description": "Strike Foes with Psionic Blades A Soulknife strikes with the mind, cutting through barriers both physical and psychic. These Rogues discover psionic power within themselves and channel it to do their roguish work. As a Soulknife, your psionic abilities might have haunted you since childhood, revealing their full potential only as you experienced the stress of adventure. Or you might have sought out an order of psychic adepts and spent years learning how to manifest your power.",
          "resource": null
        },
        {
          "name": "Psionic Power",
          "level": 3,
          "description": "You harbor a wellspring of psionic energy within yourself. It is represented by your Psionic Energy Dice, which fuel certain powers you have from this subclass. The Soulknife Energy Dice table shows the number of these dice you have when you reach certain Rogue levels, and the table shows the die size. Any features in this subclass that use a Psionic Energy Die use only the dice from this subclass. Some of your powers expend a Psionic Energy Die, as specified in a power's description, and you can't use a power if it requires you to use a die when your Psionic Energy Dice are all expended. You regain one of your expended Psionic Energy Dice when you finish a Short Rest, and you regain all of ",
          "resource": null
        },
        {
          "name": "Psychic Blades",
          "level": 3,
          "description": "You can manifest shimmering blades of psychic energy. Whenever you take the Attack action or make an Opportunity Attack, you can manifest a Psychic Blade in your free hand and make the attack with that blade. The magic blade has the following traits: The blade vanishes immediately after it hits or misses its target, and it leaves no mark if it deals damage. After you attack with the blade on your turn, you can make a melee or ranged attack with a second psychic blade as a Bonus Action on the same turn if your other hand is free to create it. The damage die of this bonus attack is 1d4 instead of 1d6.",
          "resource": null
        },
        {
          "name": "Psi-Bolstered Knack",
          "level": 3,
          "description": "If you fail an ability check using a skill or tool with which you have proficiency, you can roll one Psionic Energy Die and add the number rolled to the check, potentially turning failure into success. The die is expended only if the roll then succeeds.",
          "resource": null
        },
        {
          "name": "Psychic Whispers",
          "level": 3,
          "description": "You can establish telepathic communication between yourself and others. As a Magic action, choose one or more creatures you can see, up to a number of creatures equal to your Proficiency, and then roll one Psionic Energy Die. For a number of hours equal to the number rolled, the chosen creatures can speak telepathically with you, and you can speak telepathically with them. To send or receive a message (no action required), you and the other creature must be within 1 mile of each other. A creature can end the telepathic connection at any time (no action required).",
          "resource": null
        },
        {
          "name": "Homing Strikes",
          "level": 9,
          "description": "If you make an attack roll with your Psychic Blade and miss the target, you can roll one Psionic Energy Die and add the number rolled to the attack roll. If this causes the attack to hit, the die is expended.",
          "resource": null
        },
        {
          "name": "Psychic Teleportation",
          "level": 9,
          "description": "As a Bonus Action, you manifest a Psychic Blade, expend one Psionic Energy Die and roll it, and throw the blade at an unoccupied space you can see up to a number of feet away equal to 10 times the number rolled. You then teleport to that space, and the blade vanishes.",
          "resource": null
        },
        {
          "name": "Soul Blades",
          "level": 9,
          "description": "You can now use the following powers with your Psychic Blades.",
          "resource": null
        },
        {
          "name": "Psychic Veil",
          "level": 13,
          "description": "You can weave a veil of psychic static to mask yourself. As a Magic action, you gain the Invisible condition for 1 hour or until you dismiss this effect (no action required). This invisibility ends early immediately after you deal damage to a creature or you force a creature to make a saving throw. Once you use this feature, you can't do so again until you finish a Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it.",
          "resource": null
        },
        {
          "name": "Rend Mind",
          "level": 17,
          "description": "You can sweep your Psychic Blades through a creature's mind. When you use your Psychic Blades to deal Sneak Attack damage to a creature, you can force that target to make a Wisdom saving throw (8 plus your Dexterity modifier and Proficiency). If the save fails, the target has the Stunned condition for 1 minute. The Stunned target repeats the save at the end of each of its turns, ending the effect on itself on a success. Once you use this feature, you can't do so again until you finish a Long Rest unless you expend three Psionic Energy Dice (no action required) to restore your use of it.",
          "resource": null
        }
      ]
    },
    "Scion of the Three": {
      "name": "Scion of the Three",
      "source": "Heroes of the Frontier",
      "features": [
        {
          "name": "Bloodthirst",
          "level": 3,
          "description": "When an enemy you can see within 30 feet of yourself takes damage and is Bloodied after taking that damage but not killed outright, you can take a Reaction and Teleportation to an unoccupied space you can see within 5 feet of that enemy. You can then make one melee attack. You can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Dread Allegiance",
          "level": 3,
          "description": "Choose one of the Dead Three: Bane, Bhaal, or Myrkul. You gain Resistance to one type of damage and the ability to cast a cantrip, as detailed in the table below; Intelligence is your spellcasting ability for this cantrip. When you finish a Long Rest, you can change your choice.",
          "resource": null
        },
        {
          "name": "Scion of the Three",
          "level": 3,
          "description": "Become a Gruesome Agent of Malice A Scion of the Three draws power from a group of malevolent gods known as the Dead Three: Bane, deity of tyranny; Bhaal, deity of violence and murder; and Myrkul, deity of death. While some Rogues of this subclass pledge themselves ardently to those three macabre gods, others find themselves thrust on this path by a curse. Either way, a scion's power manifests as various occult gifts, as well as an uncanny talent for striking and terrifying foes. Scions of the Three are most common in Baldur's Gate, where the Dead Three have long competed for influence over mortal hearts. Underground cults to Bane, Bhaal, and Myrkul often count Scions of the Three among thei",
          "resource": null
        },
        {
          "name": "Strike Fear",
          "level": 9,
          "description": "You gain the following Cunning Strike option. Terrify (Cost: {@dice 1d6}): The target must succeed on a Wisdom saving throw, or it has the Frightened condition for 1 minute. While the target is Frightened in this way, you have Advantage on attack rolls against the target. The Frightened target repeats the save at the end of each of its turns, ending the effect on itself on a success.",
          "resource": null
        },
        {
          "name": "Aura of Malevolence",
          "level": 13,
          "description": "You radiate malignant power associated with one of the Dead Three. When you use Bloodthirst and teleport, each creature of your choice within 10 feet of either the space you left or your destination space (your choice) takes damage equal to your Intelligence modifier; the damage type is the same as the damage Resistance granted by your choice in the Dread Allegiance feature. Damage dealt by this feature ignores Resistance.",
          "resource": null
        },
        {
          "name": "Dread Incarnate",
          "level": 17,
          "description": "You gain the following benefits. Cutthroat: You regain one expended use of Bloodthirst when you finish a Short Rest. Murderous Intent: When you roll for your Sneak Attack damage, you can treat a roll of a 1 or 2 on the die as a 3.",
          "resource": null
        }
      ]
    }
  },
  "Sorcerer": {
    "Draconic Bloodline": {
      "name": "Draconic Bloodline",
      "source": "PHB 2014",
      "features": [
        {
          "name": "Draconic Bloodline",
          "level": 1,
          "description": "Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors. Most often, sorcerers with this origin trace their descent back to a mighty sorcerer of ancient times who made a bargain with a dragon or who might even have claimed a dragon parent. Some of these bloodlines are well established in the world, but most are obscure. Any given sorcerer could be the first of a new bloodline, as a result of a pact or some other exceptional circumstance.",
          "resource": null
        },
        {
          "name": "Draconic Resilience",
          "level": 1,
          "description": "As magic flows through your body, it causes physical traits of your dragon ancestors to emerge. At 1st level, your hit point maximum increases by 1 and increases by 1 again whenever you gain a level in this class. Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren't wearing armor, your AC equals 13 + your Dexterity modifier.",
          "resource": null
        },
        {
          "name": "Dragon Ancestor",
          "level": 1,
          "description": "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later. You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check.",
          "resource": null
        },
        {
          "name": "Elemental Affinity",
          "level": 6,
          "description": "Starting at 6th level, when you cast a spell that deals damage of the type associated with your draconic ancestry, you can add your Charisma modifier to one damage roll of that spell. At the same time, you can spend 1 sorcery point to gain resistance to that damage type for 1 hour.",
          "resource": null
        },
        {
          "name": "Dragon Wings",
          "level": 14,
          "description": "At 14th level, you gain the ability to sprout a pair of dragon wings from your back, gaining a flying speed equal to your current speed. You can create these wings as a bonus action on your turn. They last until you dismiss them as a bonus action on your turn. You can't manifest your wings while wearing armor unless the armor is made to accommodate them, and clothing not made to accommodate your wings might be destroyed when you manifest them.",
          "resource": null
        },
        {
          "name": "Draconic Presence",
          "level": 18,
          "description": "Beginning at 18th level, you can channel the dread presence of your dragon ancestor, causing those around you to become awestruck or frightened. As an action, you can spend 5 sorcery points to draw on this power and exude an aura of awe or fear (your choice) to a distance of 60 feet. For 1 minute or until you lose your concentration (as if you were casting a concentration spell), each hostile creature that starts its turn in this aura must succeed on a Wisdom saving throw or be charmed (if you chose awe) or frightened (if you chose fear) until the aura ends. A creature that succeeds on this saving throw is immune to your aura for 24 hours.",
          "resource": null
        }
      ]
    },
    "Wild Magic": {
      "name": "Wild Magic",
      "source": "PHB 2014",
      "features": [
        {
          "name": "Wild Magic",
          "level": 1,
          "description": "Your innate magic comes from the wild forces of chaos that underlie the order of creation. You might have endured exposure to some form of raw magic, perhaps through a planar portal leading to Limbo, the Elemental Planes, or the mysterious Far Realm. Perhaps you were blessed by a powerful fey creature or marked by a demon. Or your magic could be a fluke of your birth, with no apparent cause or reason. However it came to be, this chaotic magic churns within you, waiting for any outlet.",
          "resource": null
        },
        {
          "name": "Tides of Chaos",
          "level": 1,
          "description": "Starting at 1st level, you can manipulate the forces of chance and chaos to gain advantage on one attack roll, ability check, or saving throw. Once you do so, you must finish a long rest before you can use this feature again. Any time before you regain the use of this feature, the DM can have you roll on the Wild Magic Surge table immediately after you cast a sorcerer spell of 1st level or higher. You then regain the use of this feature.",
          "resource": null
        },
        {
          "name": "Wild Magic Surge",
          "level": 1,
          "description": "Starting when you choose this origin at 1st level, your spellcasting can unleash surges of untamed magic. Immediately after you cast a sorcerer spell of 1st level or higher, the DM can have you roll a d20. If you roll a 1, roll on the Wild Magic Surge table to create a random magical effect. A Wild Magic Surge can happen once per turn. If a Wild Magic effect is a spell, it's too wild to be affected by Metamagic. If it normally requires concentration, it doesn't require concentration in this case; the spell lasts for its full duration.",
          "resource": null
        },
        {
          "name": "Bend Luck",
          "level": 6,
          "description": "Starting at 6th level, you have the ability to twist fate using your wild magic. When another creature you can see makes an attack roll, an ability check, or a saving throw, you can use your reaction and spend 2 sorcery points to roll 1d4 and apply the number rolled as a bonus or penalty (your choice) to the creature's roll. You can do so after the creature rolls but before any effects of the roll occur.",
          "resource": null
        },
        {
          "name": "Controlled Chaos",
          "level": 14,
          "description": "At 14th level, you gain a modicum of control over the surges of your wild magic. Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number.",
          "resource": null
        },
        {
          "name": "Spell Bombardment",
          "level": 18,
          "description": "Beginning at 18th level, the harmful energy of your spells intensifies. When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again and add that roll to the damage. You can use the feature only once per turn.",
          "resource": null
        }
      ]
    },
    "Pyromancer (PSK)": {
      "name": "Pyromancer (PSK)",
      "source": "PSK",
      "features": [
        {
          "name": "Pyromancer (PSK)",
          "level": 1,
          "description": "Your innate magic manifests in fire. You are your fire, and your fire is you.",
          "resource": null
        },
        {
          "name": "Heart of Fire",
          "level": 1,
          "description": "At 1st level, whenever you start casting a spell of 1st level or higher that deals fire damage, fiery magic erupts from you. This eruption causes creatures of your choice that you can see within 10 feet of you to take fire damage equal to half your sorcerer level (minimum of 1).",
          "resource": null
        },
        {
          "name": "Fire in the Veins",
          "level": 6,
          "description": "At 6th level, you gain resistance to fire damage. In addition, spells you cast ignore resistance to fire damage.",
          "resource": null
        },
        {
          "name": "Pyromancer's Fury",
          "level": 14,
          "description": "Starting at 14th level, when you are hit by a melee attack, you can use your reaction to deal fire damage to the attacker. The damage equals your sorcerer level, and ignores resistance to fire damage.",
          "resource": null
        },
        {
          "name": "Fiery Soul",
          "level": 18,
          "description": "At 18th level, you gain immunity to fire damage. In addition, any spell or effect you create ignores resistance to fire damage and treats immunity to fire damage as resistance to fire damage.",
          "resource": null
        }
      ]
    },
    "Divine Soul": {
      "name": "Divine Soul",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Divine Soul",
          "level": 1,
          "description": "Sometimes the spark of magic that fuels a sorcerer comes from a divine source that glimmers within the soul. Having such a blessed soul is a sign that your innate magic might come from a distant but powerful familial connection to a divine being. Perhaps your ancestor was an angel, transformed into a mortal and sent to fight in a god's name. Or your birth might align with an ancient prophecy, marking you as a servant of the gods or a chosen vessel of divine magic. A Divine Soul, with a natural magnetism, is seen as a threat by some religious hierarchies. As an outsider who commands sacred power, a Divine Soul can undermine an existing order by claiming a direct tie to the divine. In some cul",
          "resource": null
        },
        {
          "name": "Divine Magic",
          "level": 1,
          "description": "Your link to the divine allows you to learn spells from the cleric class. When your Spellcasting feature lets you learn or replace a sorcerer cantrip or a sorcerer spell of 1st level or higher, you can choose the new spell from the cleric spell list or the sorcerer spell list. You must otherwise obey all the restrictions for selecting the spell, and it becomes a sorcerer spell for you. In addition, choose an affinity for the source of your divine power: good, evil, law, chaos, or neutrality. You learn an additional spell based on that affinity, as shown below. It is a sorcerer spell for you, but it doesn't count against your number of sorcerer spells known. If you later replace this spell, y",
          "resource": null
        },
        {
          "name": "Favored by the Gods",
          "level": 1,
          "description": "Starting at 1st level, divine power guards your destiny. If you fail a saving throw or miss with an attack roll, you can roll 2d4 and add it to the total, possibly changing the outcome. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Empowered Healing",
          "level": 6,
          "description": "Starting at 6th level, the divine energy coursing through you can empower healing spells. Whenever you or an ally within 5 feet of you rolls dice to determine the number of hit points a spell restores, you can spend 1 sorcery point to reroll any number of those dice once, provided you aren't incapacitated. You can use this feature only once per turn.",
          "resource": null
        },
        {
          "name": "Otherworldly Wings",
          "level": 14,
          "description": "Starting at 14th level, you can use a bonus action to manifest a pair of spectral wings from your back. While the wings are present, you have a flying speed of 30 feet. The wings last until you're incapacitated, you die, or you dismiss them as a bonus action. The affinity you chose for your Divine Magic feature determines the appearance of the spectral wings: eagle wings for good or law, bat wings for evil or chaos, and dragonfly wings for neutrality.",
          "resource": null
        },
        {
          "name": "Unearthly Recovery",
          "level": 18,
          "description": "At 18th level, you gain the ability to overcome grievous injuries. As a bonus action when you have fewer than half of your hit points remaining, you can regain a number of hit points equal to half your hit point maximum. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Shadow Magic": {
      "name": "Shadow Magic",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Shadow Magic",
          "level": 1,
          "description": "You are a creature of shadow, for your innate magic comes from the Shadowfell itself. You might trace your lineage to an entity from that place, or perhaps you were exposed to its fell energy and transformed by it. The power of shadow magic casts a strange pall over your physical presence. The spark of life that sustains you is muffled, as if it struggles to remain viable against the dark energy that imbues your soul. At your option, you can pick from or roll on the Shadow Sorcerer Quirks table to create a quirk for your character.",
          "resource": null
        },
        {
          "name": "Eyes of the Dark",
          "level": 1,
          "description": "Starting at 1st level, you have darkvision with a range of 120 feet. When you reach 3rd level in this class, you learn the darkness spell, which doesn't count against your number of sorcerer spells known. In addition, you can cast it by spending 2 sorcery points or by expending a spell slot. If you cast it with sorcery points, you can see through the darkness created by the spell.",
          "resource": null
        },
        {
          "name": "Strength of the Grave",
          "level": 1,
          "description": "Starting at 1st level, your existence in a twilight state between life and death makes you difficult to defeat. When damage reduces you to 0 hit points, you can make a Charisma saving throw (5 + the damage taken). On a success, you instead drop to 1 hit point. You can't use this feature if you are reduced to 0 hit points by radiant damage or by a critical hit. After the saving throw succeeds, you can't use this feature again until you finish a long rest.",
          "resource": null
        },
        {
          "name": "Hound of Ill Omen",
          "level": 6,
          "description": "At 6th level, you gain the ability to call forth a howling creature of darkness to harass your foes. As a bonus action, you can spend 3 sorcery points to magically summon a hound of ill omen to target one creature you can see within 120 feet of you. The hound uses the dire wolf's statistics (see the Monster Manual or appendix C in the Player's Handbook), with the following changes: The hound is size Medium, not Large, and it counts as a monstrosity, not a beast. It appears with a number of temporary hit points equal to half your sorcerer level. It can move through other creatures and objects as if they were difficult terrain. The hound takes 5 force damage if it ends its turn inside an objec",
          "resource": null
        },
        {
          "name": "Shadow Walk",
          "level": 14,
          "description": "At 14th level, you gain the ability to step from one shadow into another. When you are in dim light or darkness, as a bonus action, you can magically teleport up to 120 feet to an unoccupied space you can see that is also in dim light or darkness.",
          "resource": null
        },
        {
          "name": "Umbral Form",
          "level": 18,
          "description": "Starting at 18th level, you can spend 6 sorcery points as a bonus action to magically transform yourself into a shadowy form. In this form, you have resistance to all damage except force and radiant damage, and you can move through other creatures and objects as if they were difficult terrain. You take 5 force damage if you end your turn inside an object. You remain in this form for 1 minute. It ends early if you are incapacitated, if you die, or if you dismiss it as a bonus action.",
          "resource": null
        }
      ]
    },
    "Storm Sorcery": {
      "name": "Storm Sorcery",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "Storm Sorcery",
          "level": 1,
          "description": "Your innate magic comes from the power of elemental air. Many with this power can trace their magic back to a near-death experience caused by the Great Rain, but perhaps you were born during a howling gale so powerful that folk still tell stories of it, or your lineage might include the influence of potent air creatures such as djinn. Whatever the case, the magic of the storm permeates your being. Storm sorcerers are invaluable members of a ship's crew. Their magic allows them to exert control over wind and weather in their immediate area. Their abilities also prove useful in repelling attacks by sahuagin, pirates, and other waterborne threats.",
          "resource": null
        },
        {
          "name": "Tempestuous Magic",
          "level": 1,
          "description": "Starting at 1st level, you can use a bonus action on your turn to cause whirling gusts of elemental air to briefly surround you, immediately before or after you cast a spell of 1st level or higher. Doing so allows you to fly up to 10 feet without provoking opportunity attacks.",
          "resource": null
        },
        {
          "name": "Wind Speaker",
          "level": 1,
          "description": "The arcane magic you command is infused with elemental air. You can speak, read, and write Primordial. Knowing this language allows you to understand and be understood by those who speak its dialects: Primordial, Primordial, Primordial, and Primordial.",
          "resource": null
        },
        {
          "name": "Heart of the Storm",
          "level": 6,
          "description": "At 6th level, you gain resistance to lightning and thunder damage. In addition, whenever you start casting a spell of 1st level or higher that deals lightning or thunder damage, stormy magic erupts from you. This eruption causes creatures of your choice that you can see within 10 feet of you to take lightning or thunder damage (choose each time this ability activates) equal to half your sorcerer level.",
          "resource": null
        },
        {
          "name": "Storm Guide",
          "level": 6,
          "description": "At 6th level, you gain the ability to subtly control the weather around you. If it is raining, you can use an action to cause the rain to stop falling in a 20-foot-radius sphere centered on you. You can end this effect as a bonus action. If it is windy, you can use a bonus action each round to choose the direction that the wind blows in a 100-foot-radius sphere centered on you. The wind blows in that direction until the end of your next turn. This feature doesn't alter the speed of the wind.",
          "resource": null
        },
        {
          "name": "Storm's Fury",
          "level": 14,
          "description": "Starting at 14th level, when you are hit by a melee attack, you can use your reaction to deal lightning damage to the attacker. The damage equals your sorcerer level. The attacker must also make a Strength saving throw against your sorcerer spell save DC. On a failed save, the attacker is pushed in a straight line up to 20 feet away from you.",
          "resource": null
        },
        {
          "name": "Wind Soul",
          "level": 18,
          "description": "At 18th level, you gain immunity to lightning and thunder damage. You also gain a magical flying speed of 60 feet. As an action, you can reduce your flying speed to 30 feet for 1 hour and choose a number of creatures within 30 feet of you equal to 3 + your Charisma modifier. The chosen creatures gain a magical flying speed of 30 feet for 1 hour. Once you reduce your flying speed in this way, you can't do so again until you finish a short or long rest.",
          "resource": null
        }
      ]
    },
    "Aberrant Mind": {
      "name": "Aberrant Mind",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Aberrant Mind",
          "level": 1,
          "description": "An alien influence has wrapped its tendrils around your mind, giving you psionic power. You can now touch other minds with that power and alter the world around you by using it to control the magical energy of the multiverse. Will this power shine from you as a hopeful beacon to others? Or will you be a source of terror to those who feel the stab of your mind and witness the strange manifestations of your might? As an Aberrant Mind sorcerer, you decide how you acquired your powers. Were you born with them? Or did an event later in life leave you shining with psionic awareness? Consult the Aberrant Origins table for a possible origin of your power.",
          "resource": null
        },
        {
          "name": "Psionic Spells",
          "level": 1,
          "description": "1st-level Aberrant Mind feature You learn additional spells when you reach certain levels in this class, as shown on the Psionic Spells table. Each of these spells counts as a sorcerer spell for you, but it doesn't count against the number of sorcerer spells you know. Whenever you gain a sorcerer level, you can replace one spell you gained from this feature with another spell of the same level. The new spell must be a .",
          "resource": null
        },
        {
          "name": "Telepathic Speech",
          "level": 1,
          "description": "1st-level Aberrant Mind feature You can form a telepathic connection between your mind and the mind of another. As a bonus action, choose one creature you can see within 30 feet of you. You and the chosen creature can speak telepathically with each other while the two of you are within a number of miles of each other equal to your Charisma modifier (minimum of 1 mile). To understand each other, you each must speak mentally in a language the other knows. The telepathic connection lasts for a number of minutes equal to your sorcerer level. It ends early if you are incapacitated or die or if you use this ability to form a connection with a different creature.",
          "resource": null
        },
        {
          "name": "Psionic Sorcery",
          "level": 6,
          "description": "6th-level Aberrant Mind feature When you cast any spell of 1st level or higher from your Psionic Spells feature, you can cast it by expending a spell slot as normal or by spending a number of sorcery points equal to the spell's level. If you cast the spell using sorcery points, it requires no verbal or somatic components, and it requires no material components, unless they are consumed by the spell.",
          "resource": null
        },
        {
          "name": "Psychic Defenses",
          "level": 6,
          "description": "6th-level Aberrant Mind feature You gain resistance to psychic damage, and you have advantage on saving throws against being charmed or frightened.",
          "resource": null
        },
        {
          "name": "Revelation in Flesh",
          "level": 14,
          "description": "14th-level Aberrant Mind feature You can unleash the aberrant truth hidden within yourself. As a bonus action, you can spend 1 or more sorcery points to magically transform your body for 10 minutes. For each sorcery point you spend, you can gain one of the following benefits of your choice, the effects of which last until the transformation ends: You can see any invisible creature within 60 feet of you, provided it isn't behind Cover. Your eyes also turn black or become writhing sensory tendrils. You gain a flying speed equal to your walking speed, and you can hover. As you fly, your skin glistens with mucus or shines with an otherworldly light. You gain a swimming speed equal to twice your ",
          "resource": null
        },
        {
          "name": "Warping Implosion",
          "level": 18,
          "description": "18th-level Aberrant Mind feature You can unleash your aberrant power as a space-warping anomaly. As an action, you can teleport to an unoccupied space you can see within 120 feet of you. Immediately after you disappear, each creature within 30 feet of the space you left must make a Strength saving throw against your spell save DC. On a failed save, a creature takes 3d10 force damage and is pulled straight toward the space you left, ending in an unoccupied space as close to your former space as possible. On a successful save, the creature takes half as much damage and isn't pulled. Once you use this feature, you can't do so again until you finish a long rest, unless you spend 5 sorcery points",
          "resource": null
        }
      ]
    },
    "Clockwork Soul": {
      "name": "Clockwork Soul",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Clockwork Soul",
          "level": 1,
          "description": "The cosmic force of order has suffused you with magic. That power arises from Mechanus or a realm like it-a plane of existence shaped entirely by clockwork efficiency. You, or someone from your lineage, might have become entangled in the machinations of the modrons, the orderly beings who inhabit Mechanus. Perhaps your ancestor even took part in the Great Modron March. Whatever its origin within you, the power of order can seem strange to others, but for you, it is part of a vast and glorious system.",
          "resource": null
        },
        {
          "name": "Clockwork Magic",
          "level": 1,
          "description": "1st-level Clockwork Soul feature You learn additional spells when you reach certain levels in this class, as shown on the Clockwork Spells table. Each of these spells counts as a sorcerer spell for you, but it doesn't count against the number of sorcerer spells you know. Whenever you gain a sorcerer level, you can replace one spell you gained from this feature with another spell of the same level. The new spell must be an . In addition, consult the Manifestations of Order table and choose or randomly determine a way your connection to order manifests while you are casting any of your sorcerer spells.",
          "resource": null
        },
        {
          "name": "Restore Balance",
          "level": 1,
          "description": "1st-level Clockwork Soul feature Your connection to the plane of absolute order allows you to equalize chaotic moments. When a creature you can see within 60 feet of you is about to roll a d20 with advantage or disadvantage, you can use your reaction to prevent the roll from being affected by advantage and disadvantage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Bastion of Law",
          "level": 6,
          "description": "6th-level Clockwork Soul feature You can tap into the grand equation of existence to imbue a creature with a shimmering shield of order. As an action, you can expend 1 to 5 sorcery points to create a magical ward around yourself or another creature you can see within 30 feet of you. The ward lasts until you finish a long rest or until you use this feature again. The ward is represented by a number of d8s equal to the number of sorcery points spent to create it. When the warded creature takes damage, it can expend a number of those dice, roll them, and reduce the damage taken by the total rolled on those dice.",
          "resource": null
        },
        {
          "name": "Trance of Order",
          "level": 14,
          "description": "14th-level Clockwork Soul feature You gain the ability to align your consciousness to the endless calculations of Mechanus. As a bonus action, you can enter this state for 1 minute. For the duration, attack rolls against you can't benefit from advantage, and whenever you make an attack roll, an ability check, or a saving throw, you can treat a roll of 9 or lower on the d20 as a 10. Once you use this bonus action, you can't use it again until you finish a long rest, unless you spend 5 sorcery points to use it again.",
          "resource": null
        },
        {
          "name": "Clockwork Cavalcade",
          "level": 18,
          "description": "18th-level Clockwork Soul feature You summon spirits of order to expunge disorder around you. As an action, you summon the spirits in a 30-foot cube originating from you. The spirits look like modrons or other constructs of your choice. The spirits are intangible and invulnerable, and they create the following effects within the cube before vanishing: The spirits restore up to 100 hit points, divided as you choose among any number of creatures of your choice in the cube. Any damaged objects entirely in the cube are repaired instantly. Every spell of 6th level or lower ends on creatures and objects of your choice in the cube. Once you use this action, you can't use it again until you finish a",
          "resource": null
        }
      ]
    },
    "Lunar Sorcery": {
      "name": "Lunar Sorcery",
      "source": "Dragonlance",
      "features": [
        {
          "name": "Lunar Sorcery",
          "level": 1,
          "description": "On many worlds, the moon is a revered celestial body with magical properties. On Krynn, the gods of magic are associated with the world's three moons. On the world of Toril, the god Selûne uses the light of the moon to battle darkness. On Eberron, scholars of the Draconic Prophecy decipher ancient secrets from the waxing and waning of that world's twelve moons. You or someone from your lineage has been exposed to the concentrated magic of the moon (or moons) of your world, imbuing you with lunar magic. Perhaps your ancestor was involved in a druidic ritual involving an eclipse, or maybe a mystical fragment of a moon crashed near you. However you came to have your magic, your connection to th",
          "resource": null
        },
        {
          "name": "Lunar Embodiment",
          "level": 1,
          "description": "1st-Level Lunar Sorcery Feature You learn additional spells when you reach certain levels in this class, as shown on the Lunar Spells table. Each of these spells counts as a sorcerer spell for you, but it doesn't count against the number of sorcerer spells you know. Whenever you finish a long rest, you can choose what lunar phase manifests its power through your magic: Full Moon, New Moon, or Crescent Moon. While in the chosen phase, you can cast one 1st-level spell of the associated phase in the Lunar Spells table once without expending a spell slot. Once you cast a spell in this way, you can't do so again until you finish a long rest.",
          "resource": null
        },
        {
          "name": "Moon Fire",
          "level": 1,
          "description": "1st-Level Lunar Sorcery Feature You can call down the radiant light of the moon on command. You learn the sacred flame spell, which doesn't count against the number of sorcerer cantrips you know. When you cast the spell, you can target one creature as normal or target two creatures within range that are within 5 feet of each other.",
          "resource": null
        },
        {
          "name": "Lunar Boons",
          "level": 6,
          "description": "6th-Level Lunar Sorcery Feature The current phase of your Lunar Embodiment can affect your Metamagic feature. Each Lunar Embodiment phase is associated with certain schools of magic, as shown here: Whenever you use Metamagic on a spell of a school of magic associated with your current Lunar Embodiment phase, you can reduce the sorcery points spent by 1 (minimum 0). You can reduce the sorcery points spent for your Metamagic a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Waxing and Waning",
          "level": 6,
          "description": "6th-Level Lunar Sorcery Feature You gain greater control over the phases of your lunar magic. As a bonus action, you can spend 1 sorcery point to change your current Lunar Embodiment phase to a different one. You can now cast one 1st-level spell from each lunar phase of the Lunar Spells table once without expending a spell slot, provided your current phase is the same as the lunar phase spell. Once you cast a lunar phase spell in this way, you can't do so again until you finish a long rest.",
          "resource": null
        },
        {
          "name": "Lunar Empowerment",
          "level": 14,
          "description": "14th-Level Lunar Sorcery Feature The power of a lunar phase saturates your being. While you are in a Lunar Embodiment phase, you also gain the following benefit associated with that phase: You can use a bonus action to shed bright light in a 10-foot radius and dim light for an additional 10 feet or to douse the light. In addition, you and creatures of your choice have advantage on Intelligence (Investigation) and Wisdom (Perception) checks while within the bright light you shed. You have advantage on Dexterity (Stealth) checks. In addition, while you are entirely in darkness, attack rolls have disadvantage against you. You have resistance to necrotic and radiant damage.",
          "resource": null
        },
        {
          "name": "Lunar Phenomenon",
          "level": 18,
          "description": "18th-Level Lunar Sorcery feature As a bonus action, you can tap into a special power of your current Lunar Embodiment phase. Alternatively, as part of the bonus action you take to change your lunar phase using the Waxing and Waning feature, you can immediately use the power of the lunar phase you are entering: You radiate moonlight for a moment. Each creature of your choice within 30 feet of you must succeed on a Constitution saving throw against your spell save DC or be blinded until the end of its next turn. In addition, one creature of your choice in that area regains 3d8 hit points. You momentarily emanate gloom. Each creature of your choice within 30 feet of you must succeed on a Dexter",
          "resource": null
        }
      ]
    },
    "Aberrant Sorcery": {
      "name": "Aberrant Sorcery",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Aberrant Sorcery",
          "level": 3,
          "description": "Wield Unnatural Psionic Power An alien influence has wrapped its tendrils around your mind, giving you psionic power. You can now touch other minds with that power and alter the world around you. Will this power shine from you as a hopeful beacon to others? Or will you be a terror to those who feel the stab of your mind? Perhaps a psychic wind from the Astral Plane carried psionic energy to you, or you were exposed to the Far Realm's warping influence. Alternatively, you were implanted with a mind flayer tadpole, but your transformation into a mind flayer never occurred; now the tadpole's psionic power is yours. However you acquired this power, your mind is aflame with it.",
          "resource": null
        },
        {
          "name": "Psionic Spells",
          "level": 3,
          "description": "When you reach a Sorcerer level specified in the Psionic Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Telepathic Speech",
          "level": 3,
          "description": "You can form a telepathic connection between your mind and the mind of another. As a Bonus Action, choose one creature you can see within 30 feet of yourself. You and the chosen creature can communicate telepathically with each other while the two of you are within a number of miles of each other equal to your Charisma modifier (minimum of 1 mile). To understand each other, you each must mentally use a language the other knows. The telepathic connection lasts for a number of minutes equal to your Sorcerer level. It ends early if you use this ability to form a connection with a different creature.",
          "resource": null
        },
        {
          "name": "Psionic Sorcery",
          "level": 6,
          "description": "When you cast any level 1+ spell from your Psionic Spells feature, you can cast it by expending a spell slot as normal or by spending a number of Sorcery Points equal to the spell's level. If you cast the spell using Sorcery Points, it requires no Verbal or Somatic components, and it requires no Material components unless they are consumed by the spell or have a cost specified in it.",
          "resource": null
        },
        {
          "name": "Psychic Defenses",
          "level": 6,
          "description": "You have Resistance to Psychic damage, and you have Advantage on saving throws to avoid or end the Charmed or Frightened condition.",
          "resource": null
        },
        {
          "name": "Revelation in Flesh",
          "level": 14,
          "description": "You can unleash the aberrant truth hidden within yourself. As a Bonus Action, you can spend 1 Sorcery Point or more to magically alter your body for 10 minutes. For each Sorcery Point you spend, you gain one of the following benefits of your choice, the effects of which last until the alteration ends. Aquatic Adaptation: You gain a Swim Speed equal to twice your Speed, and you can breathe underwater. Gills grow from your neck or flare behind your ears, and your fingers become webbed or you grow wriggling cilia. Glistening Flight: You gain a Fly Speed equal to your Speed, and you can hover. As you fly, your skin glistens with mucus or otherworldly light. See the Invisible: You can see any Inv",
          "resource": null
        },
        {
          "name": "Warping Implosion",
          "level": 18,
          "description": "You can unleash a space-warping anomaly. As a Magic action, you teleport to an unoccupied space you can see within 120 feet of yourself. Immediately after you disappear, each creature within 30 feet of the space you left must make a Strength saving throw against your spell save DC. On a failed save, a creature takes 3d10 Force damage and is pulled straight toward the space you left, ending in an unoccupied space as close to your former space as possible. On a successful save, the creature takes half as much damage only. Once you use this feature, you can't do so again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it.",
          "resource": null
        }
      ]
    },
    "Clockwork Sorcery": {
      "name": "Clockwork Sorcery",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Clockwork Sorcery",
          "level": 3,
          "description": "Channel Cosmic Forces of Order The cosmic force of order has suffused you with magic. That power arises from Mechanus or a realm like it—a plane of existence shaped entirely by clockwork efficiency. You or someone from your lineage might have become entangled in the machinations of modrons, the orderly beings who inhabit Mechanus. Perhaps your ancestor even took part in the Great Modron March. Whatever its origin within you, the power of order can seem strange to others, but for you, it's part of a vast and glorious system.",
          "resource": null
        },
        {
          "name": "Clockwork Spells",
          "level": 3,
          "description": "When you reach a Sorcerer level specified in the Clockwork Spells table, you thereafter always have the listed spells prepared. In addition, consult the Manifestations of Order table and choose or randomly determine a way your connection to order manifests while you are casting any of your Sorcerer spells.",
          "resource": null
        },
        {
          "name": "Restore Balance",
          "level": 3,
          "description": "Your connection to the plane of absolute order allows you to equalize chaotic moments. When a creature you can see within 60 feet of yourself is about to roll a d20 with Advantage or Disadvantage, you can take a Reaction to prevent the roll from being affected by Advantage and Disadvantage. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Bastion of Law",
          "level": 6,
          "description": "You can tap into the grand equation of existence to imbue a creature with a shimmering shield of order. As a Magic action, you can expend 1 to 5 Sorcery Points to create a magical ward around yourself or another creature you can see within 30 feet of yourself. The ward is represented by a number of d8s equal to the number of Sorcery Points spent to create it. When the warded creature takes damage, it can expend a number of those dice, roll them, and reduce the damage taken by the total rolled on those dice. The ward lasts until you finish a Long Rest or until you use this feature again.",
          "resource": null
        },
        {
          "name": "Trance of Order",
          "level": 14,
          "description": "You gain the ability to align your consciousness with the endless calculations of Mechanus. As a Bonus Action, you can enter this state for 1 minute. For the duration, attack rolls against you can't benefit from Advantage, and whenever you make a D20 Test, you can treat a roll of 9 or lower on the d20 as a 10. Once you use this feature, you can't use it again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it.",
          "resource": null
        },
        {
          "name": "Clockwork Cavalcade",
          "level": 18,
          "description": "You momentarily summon spirits of order to expunge disorder around you. As a Magic action, you summon the spirits in a 30-foot Cube [Area of Effect] originating from you. The spirits look like modrons or other Constructs of your choice. The spirits are intangible and invulnerable, and they create the effects below within the Cube [Area of Effect] before vanishing. Once you use this action, you can't use it again until you finish a Long Rest unless you spend 7 Sorcery Points (no action required) to restore your use of it. Heal: The spirits restore up to 100 Hit Points, divided as you choose among any number of creatures of your choice in the Cube [Area of Effect]. Repair: Any damaged objects ",
          "resource": null
        }
      ]
    },
    "Draconic Sorcery": {
      "name": "Draconic Sorcery",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Draconic Sorcery",
          "level": 3,
          "description": "Breathe the Magic of Dragons Your innate magic comes from the gift of a dragon. Perhaps an ancient dragon facing death bequeathed some of its magical power to you or your ancestor. You might have absorbed magic from a site infused with dragons' power. Or perhaps you handled a treasure taken from a dragon's hoard that was steeped in draconic power. Or you might have a dragon for an ancestor.",
          "resource": null
        },
        {
          "name": "Draconic Spells",
          "level": 3,
          "description": "When you reach a Sorcerer level specified in the Draconic Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Draconic Resilience",
          "level": 3,
          "description": "The magic in your body manifests physical traits of your draconic gift. Your Hit Points maximum increases by 3, and it increases by 1 whenever you gain another Sorcerer level. Parts of you are also covered by dragon-like scales. While you aren't wearing armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers.",
          "resource": null
        },
        {
          "name": "Elemental Affinity",
          "level": 6,
          "description": "Your draconic magic has an affinity with a damage type associated with dragons. Choose one of those types: Acid, Cold, Fire, Lightning, or Poison. You have Resistance to that damage type, and when you cast a spell that deals damage of that type, you can add your Charisma modifier to one damage roll of that spell.",
          "resource": null
        },
        {
          "name": "Dragon Wings",
          "level": 14,
          "description": "As a Bonus Action, you can cause draconic wings to appear on your back. The wings last for 1 hour or until you dismiss them (no action required). For the duration, you have a Fly Speed of 60 feet. Once you use this feature, you can't use it again until you finish a Long Rest unless you spend 3 Sorcery Points (no action required) to restore your use of it.",
          "resource": null
        },
        {
          "name": "Dragon Companion",
          "level": 18,
          "description": "You can cast Summon Dragon without a Material component. You can also cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you start casting the spell, you can modify it so that it doesn't require Concentration. If you do so, the spell's duration becomes 1 minute for that casting.",
          "resource": null
        }
      ]
    },
    "Wild Magic Sorcery": {
      "name": "Wild Magic Sorcery",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Wild Magic Sorcery",
          "level": 3,
          "description": "Unleash Chaotic Magic Your innate magic stems from the forces of chaos that underlie the order of creation. You or an ancestor might have endured exposure to raw magic, perhaps through a planar portal leading to Limbo or the Elemental Planes. Perhaps you were blessed by a fey being or marked by a demon. Or your magic could be a fluke with no apparent cause. Whatever its source, this magic churns within you, waiting for any outlet.",
          "resource": null
        },
        {
          "name": "Tides of Chaos",
          "level": 3,
          "description": "You can manipulate chaos itself to give yourself Advantage on one D20 Test before you roll the d20. Once you do so, you must cast a Sorcerer spell with a spell slot or finish a Long Rest before you can use this feature again. If you do cast a Sorcerer spell with a spell slot before you finish a Long Rest, you automatically roll on the Wild Magic Surge table.",
          "resource": null
        },
        {
          "name": "Wild Magic Surge",
          "level": 3,
          "description": "Your spellcasting can unleash surges of untamed magic. Once per turn, you can roll 1d20 immediately after you cast a Sorcerer spell with a spell slot. If you roll a 20, roll on the Wild Magic Surge table to create a magical effect. If the magical effect is a spell, it is too wild to be affected by your Metamagic.",
          "resource": null
        },
        {
          "name": "Bend Luck",
          "level": 6,
          "description": "You have the ability to twist fate using your wild magic. Immediately after another creature you can see rolls the d20 for a D20 Test, you can take a Reaction and spend 1 Sorcery Point to roll 1d4 and apply the number rolled as a bonus or penalty (your choice) to the d20 roll.",
          "resource": null
        },
        {
          "name": "Controlled Chaos",
          "level": 14,
          "description": "You gain a modicum of control over the surges of your wild magic. Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number.",
          "resource": null
        },
        {
          "name": "Tamed Surge",
          "level": 18,
          "description": "Immediately after you cast a Sorcerer spell with a spell slot, you can create an effect of your choice from the Wild Magic Surge table instead of rolling on that table. You can choose any effect in the table except for the final row, and if the chosen effect involves a roll, you must make it. Once you use this feature, you can't do so again until you finish a Long Rest.",
          "resource": null
        }
      ]
    },
    "Spellfire Sorcery": {
      "name": "Spellfire Sorcery",
      "source": "Heroes of the Frontier",
      "features": [
        {
          "name": "Bolstering Flames",
          "level": 3,
          "description": "You or one creature you can see within 30 feet of yourself gains Temporary Hit Points equal to 1d4 plus your Charisma modifier.",
          "resource": null
        },
        {
          "name": "Radiant Fire",
          "level": 3,
          "description": "One creature you can see within 30 feet of yourself takes 1d4 Fire or Radiant damage (your choice).",
          "resource": null
        },
        {
          "name": "Spellfire Burst",
          "level": 3,
          "description": "When you spend at least 1 Sorcery Point as part of the Magic action or a Bonus Action on your turn, you can unleash one of the following magical effects of your choice. You can do so only once per turn.",
          "resource": null
        },
        {
          "name": "Spellfire Sorcery",
          "level": 3,
          "description": "Wield Raw Magic Your innate power stems from the source of magic itself: the Weave. This connection manifests as a rare ability known as spellfire, and you surge with radiant bursts of this raw magic. Your talent with spellfire allows you to heal allies, sear enemies, and absorb powerful spells. Wielders of spellfire tend to have a penchant for wandering. Many travel between cosmopolitan settlements, such as those along the Sword Coast, and wield their magic in service of the common good. Others realize their own strange powers by roaming equally strange lands, from the magic-blasted wastes of the desert of Anauroch to the god-touched wilds of the Old Empires. Wherever they go in the Realms,",
          "resource": null
        },
        {
          "name": "Spellfire Spells",
          "level": 3,
          "description": "When you reach a Sorcerer level specified in the Spellfire Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Absorb Spells",
          "level": 6,
          "description": "You always have Counterspell prepared. Additionally, whenever a target fails the saving throw against a Counterspell you cast, you regain 1d4 Sorcery Points.",
          "resource": null
        },
        {
          "name": "Honed Spellfire",
          "level": 14,
          "description": "Your Spellfire Burst improves. You add your Sorcerer level to the Temporary Hit Points gained from Bolstering Flames, and the damage of Radiant Fire increases to 1d8.",
          "resource": null
        },
        {
          "name": "Crown of Spellfire",
          "level": 18,
          "description": "When you use Innate Sorcery, you can alter it and infuse yourself with the essence of spellfire, gaining the following benefits while this use of Innate Sorcery is active. Once you use this feature to alter Innate Sorcery, you can't use it again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it. Burning Life Force: Once per turn when you are hit by an attack roll, you can expend a number of Hit Point Dice, up to a maximum equal to your Charisma modifier (minimum of one). Roll the expended dice, and reduce the amount of damage from that attack equal to the total rolled. Flight: You gain a Fly Speed of 60 feet and can hover. Spell Avo",
          "resource": null
        }
      ]
    }
  },
  "Warlock": {
    "The Archfey": {
      "name": "The Archfey",
      "source": "PHB 2014",
      "features": [
        {
          "name": "The Archfey",
          "level": 1,
          "description": "Your patron is a lord or lady of the fey, a creature of legend who holds secrets that were forgotten before the mortal races were born. This being's motivations are often inscrutable, and sometimes whimsical, and might involve a striving for greater magical power or the settling of age-old grudges. Beings of this sort include the Prince of Frost; the Queen of Air and Darkness, ruler of the Gloaming Court; Titania of the Summer Court; her consort Oberon, the Green Lord; Hyrsam, the Prince of Fools; and ancient hags. Expanded Spell List: The Archfey lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you.",
          "resource": null
        },
        {
          "name": "Fey Presence",
          "level": 1,
          "description": "Starting at 1st level, your patron bestows upon you the ability to project the beguiling and fearsome presence of the fey. As an action, you can cause each creature in a 10-foot cube originating from you to make a Wisdom saving throw against your warlock spell save DC. The creatures that fail their saving throws are all charmed or frightened by you (your choice) until the end of your next turn. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": {
            "name": "Fey Presence",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        },
        {
          "name": "Misty Escape",
          "level": 6,
          "description": "Starting at 6th level, you can vanish in a puff of mist in response to harm. When you take damage, you can use your reaction to turn invisible and teleport up to 60 feet to an unoccupied space you can see. You remain invisible until the start of your next turn or until you attack or cast a spell. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Beguiling Defenses",
          "level": 10,
          "description": "Beginning at 10th level, your patron teaches you how to turn the mind-affecting magic of your enemies against them. You are immune to being charmed, and when another creature attempts to charm you, you can use your reaction to attempt to turn the charm back on that creature. The creature must succeed on a Wisdom saving throw against your warlock spell save DC or be charmed by you for 1 minute or until the creature takes any damage.",
          "resource": null
        },
        {
          "name": "Dark Delirium",
          "level": 14,
          "description": "Starting at 14th level, you can plunge a creature into an illusory realm. As an action, choose a creature that you can see within 60 feet of you. It must make a Wisdom saving throw against your warlock spell save DC. On a failed save, it is charmed or frightened by you (your choice) for 1 minute or until your concentration is broken (as if you are concentration on a spell). This effect ends early if the creature takes any damage. Until this illusion ends, the creature thinks it is lost in a misty realm, the appearance of which you choose. The creature can see and hear only itself, you, and the illusion. You must finish a short or long rest before you can use this feature again.",
          "resource": {
            "name": "Dark Delirium",
            "maxFormula": 1,
            "die": null,
            "recharge": "short"
          }
        }
      ]
    },
    "The Fiend": {
      "name": "The Fiend",
      "source": "PHB 2014",
      "features": [
        {
          "name": "The Fiend",
          "level": 1,
          "description": "You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil, even if you strive against those aims. Such beings desire the corruption or destruction of all things, ultimately including you. Fiends powerful enough to forge a pact include demon lords such as Demogorgon, Orcus, Fraz-Urb'luu, and Baphomet; archdevils such as Asmodeus, Dispater, Mephistopheles, and Belial; pit fiends and balors that are especially mighty; and ultroloths and other lords of the yugoloths. Expanded Spell List: The Fiend lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you.",
          "resource": null
        },
        {
          "name": "Dark One's Blessing",
          "level": 1,
          "description": "Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).",
          "resource": null
        },
        {
          "name": "Dark One's Own Luck",
          "level": 6,
          "description": "Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll's effects occur. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Fiendish Resilience",
          "level": 10,
          "description": "Starting at 10th level, you can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance.",
          "resource": null
        },
        {
          "name": "Hurl Through Hell",
          "level": 14,
          "description": "Starting at 14th level, when you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape. At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": {
            "name": "Hurl Through Hell",
            "maxFormula": 1,
            "die": null,
            "recharge": "long"
          }
        }
      ]
    },
    "The Great Old One": {
      "name": "The Great Old One",
      "source": "PHB 2014",
      "features": [
        {
          "name": "The Great Old One",
          "level": 1,
          "description": "Your patron is a mysterious entity whose nature is utterly foreign to the fabric of reality. It might come from the Far Realm, the space beyond reality, or it could be one of the elder gods known only in legends. Its motives are incomprehensible to mortals, and its knowledge so immense and ancient that even the greatest libraries pale in comparison to the vast secrets it holds. The Great Old One might be unaware of your existence or entirely indifferent to you, but the secrets you have learned allow you to draw your magic from it. Entities of this type include Ghaunadar, called That Which Lurks; Tharizdun, the Chained God; Dendar, the Night Serpent; Zargon, the Returner; Great Cthulhu; and o",
          "resource": null
        },
        {
          "name": "Awakened Mind",
          "level": 1,
          "description": "Starting at 1st level, your alien knowledge gives you the ability to touch the minds of other creatures. You can telepathically speak to any creature you can see within 30 feet of you. You don't need to share a language with the creature for it to understand your telepathic utterances, but the creature must be able to understand at least one language.",
          "resource": null
        },
        {
          "name": "Entropic Ward",
          "level": 6,
          "description": "At 6th level, you learn to magically ward yourself against attack and to turn an enemy's failed strike into good luck for yourself. When a creature makes an attack roll against you, you can use your reaction to impose disadvantage on that roll. If the attack misses you, your next attack roll against the creature has advantage if you make it before the end of your next turn. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Thought Shield",
          "level": 10,
          "description": "Starting at 10th level, your thoughts can't be read by telepathy or other means unless you allow it. You also have resistance to psychic damage, and whenever a creature deals psychic damage to you, that creature takes the same amount of damage that you do.",
          "resource": null
        },
        {
          "name": "Create Thrall",
          "level": 14,
          "description": "At 14th level, you gain the ability to infect a humanoid's mind with the alien magic of your patron. You can use your action to touch an incapacitated humanoid. That creature is then charmed by you until a remove curse spell is cast on it, the charmed condition is removed from it, or you use this feature again. You can communicate telepathically with the charmed creature as long as the two of you are on the same plane of existence.",
          "resource": null
        }
      ]
    },
    "The Undying": {
      "name": "The Undying",
      "source": "Sword Coast Guide",
      "features": [
        {
          "name": "The Undying",
          "level": 1,
          "description": "Death holds no sway over your patron, who has unlocked the secrets of everlasting life, although such a prize—like all power—comes at a price. Once mortal, the Undying has seen mortal lifetimes pass like the seasons, like the flicker of endless days and nights. It has the secrets of the ages to share, secrets of life and death. Beings of this sort include Vecna, Lord of the Hand and the Eye; the dread Iuz; the lich-queen Vol; the Undying Court of Aerenal; Vlaakith, lich-queen of the githyanki; and the deathless wizard Fistandantilus. In the Realms, Undying patrons include Larloch the Shadow King, legendary master of Warlock's Crypt, and Gilgeam, the God-King of Unther. Expanded Spell List: T",
          "resource": null
        },
        {
          "name": "Among the Dead",
          "level": 1,
          "description": "Starting at 1st level, you learn the spare the dying cantrip, which counts as a warlock cantrip for you. You also have advantage on saving throws against any disease. Additionally, undead have difficulty harming you. If an undead targets you directly with an attack or a harmful spell, that creature must make a Wisdom saving throw against your spell save DC (an undead needn't make the save when it includes you in an area effect, such as the explosion of fireball). On a failed save, the creature must choose a new target or forfeit targeting someone instead of you, potentially wasting the attack or spell. On a successful save, the creature is immune to this effect for 24 hours. An undead is als",
          "resource": null
        },
        {
          "name": "Defy Death",
          "level": 6,
          "description": "Starting at 6th level, you can give yourself vitality when you cheat death or when you help someone else cheat it. You can regain hit points equal to 1d8 + your Constitution modifier (minimum of 1 hit point) when you succeed on a death saving throw or when you stabilize a creature with spare the dying. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        },
        {
          "name": "Undying Nature",
          "level": 10,
          "description": "Beginning at 10th level, you can hold your breath indefinitely, and you don't require food, water, or sleep, although you still require rest to reduce exhaustion and still benefit from finishing short and long rests. In addition, you age at a slower rate. For every 10 years that pass, your body ages only 1 year, and you are immune to being magically aged.",
          "resource": null
        },
        {
          "name": "Indestructible Life",
          "level": 14,
          "description": "When you reach 14th level, you partake some of the true secrets of the Undying. On your turn, you can use a bonus action to regain hit points equal to 1d8 + your warlock level. Additionally, if you put a severed body part of yours back in place when you use this feature, the part reattaches. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        }
      ]
    },
    "The Celestial": {
      "name": "The Celestial",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "The Celestial",
          "level": 1,
          "description": "Your patron is a powerful being of the Upper Planes. You have bound yourself to an ancient empyrean, solar, ki-rin, unicorn, or other entity that resides in the planes of everlasting bliss. Your pact with that being allows you to experience the barest touch of the holy light that illuminates the multiverse. Being connected to such power can cause changes in your behavior and beliefs. You might find yourself driven to annihilate the undead, to defeat fiends, and to protect the innocent. At times, your heart might also be filled with a longing for the celestial realm of your patron, and a desire to wander that paradise for the rest of your days. But you know that your mission is among mortals ",
          "resource": null
        },
        {
          "name": "Bonus Cantrips",
          "level": 1,
          "description": "At 1st level, you learn the sacred flame and light cantrips. They count as warlock cantrips for you, but they don't count against your number of cantrips known.",
          "resource": null
        },
        {
          "name": "Healing Light",
          "level": 1,
          "description": "At 1st level, you gain the ability to channel celestial energy to heal wounds. You have a pool of d6s that you spend to fuel this healing. The number of dice in the pool equals 1 + your warlock level. As a bonus action, you can heal one creature you can see within 60 feet of you, spending dice from the pool. The maximum number of dice you can spend at once equals your Charisma modifier (minimum of one die). Roll the dice you spend, add them together, and restore a number of hit points equal to the total. Your pool regains all expended dice when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Radiant Soul",
          "level": 6,
          "description": "Starting at 6th level, your link to the Celestial allows you to serve as a conduit for radiant energy. You have resistance to radiant damage, and when you cast a spell that deals radiant or fire damage, you can add your Charisma modifier to one radiant or fire damage roll of that spell against one of its targets.",
          "resource": null
        },
        {
          "name": "Celestial Resilience",
          "level": 10,
          "description": "Starting at 10th level, you gain temporary hit points whenever you finish a short or long rest. These temporary hit points equal your warlock level + your Charisma modifier. Additionally, choose up to five creatures you can see at the end of the rest. Those creatures each gain temporary hit points equal to half your warlock level + your Charisma modifier.",
          "resource": null
        },
        {
          "name": "Searing Vengeance",
          "level": 14,
          "description": "Starting at 14th level, the radiant energy you channel allows you to resist death. When you have to make a death saving throw at the start of your turn, you can instead spring back to your feet with a burst of radiant energy. You regain hit points equal to half your hit point maximum, and then you stand up if you so choose. Each creature of your choice that is within 30 feet of you takes radiant damage equal to 2d8 + your Charisma modifier, and it is blinded until the end of the current turn. Once you use this feature, you can't use it again until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "The Hexblade": {
      "name": "The Hexblade",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "The Hexblade",
          "level": 1,
          "description": "You have made your pact with a mysterious entity from the Shadowfell—a force that manifests in sentient magic weapons carved from the stuff of shadow. The mighty sword Blackrazor is the most notable of these weapons, which have been spread across the multiverse over the ages. The shadowy force behind these weapons can offer power to warlocks who form pacts with it. Many Hexblade warlocks create weapons that emulate those formed in the Shadowfell. Others forgo such arms, content to weave the dark magic of that plane into their spellcasting. Because the Raven Queen is known to have forged the first of these weapons, many sages speculate that she and the force are one and that the weapons, alon",
          "resource": null
        },
        {
          "name": "Hex Warrior",
          "level": 1,
          "description": "At 1st level, you acquire the training necessary to effectively arm yourself for battle. You gain proficiency with medium armor, shields, and martial weapons. The influence of your patron also allows you to mystically channel your will through a particular weapon. Whenever you finish a long rest, you can touch one weapon that you are proficient with and that lacks the two-handed property. When you attack with that weapon, you can use your Charisma modifier, instead of Strength or Dexterity, for the attack and damage rolls. This benefit lasts until you finish a long rest. If you later gain the Pact of the Blade feature, this benefit extends to every pact weapon you conjure with that feature, ",
          "resource": null
        },
        {
          "name": "Hexblade's Curse",
          "level": 1,
          "description": "Starting at 1st level, you gain the ability to place a baleful curse on someone. As a bonus action, choose one creature you can see within 30 feet of you. The target is cursed for 1 minute. The curse ends early if the target dies, you die, or you are incapacitated. Until the curse ends, you gain the following benefits: You gain a bonus to damage rolls against the cursed target. The bonus equals your proficiency bonus. Any attack roll you make against the cursed target is a critical hit on a roll of 19 or 20 on the d20. If the cursed target dies, you regain hit points equal to your warlock level + your Charisma modifier (minimum of 1 hit point). You can't use this feature again until you fini",
          "resource": null
        },
        {
          "name": "Accursed Specter",
          "level": 6,
          "description": "Starting at 6th level, you can curse the soul of a person you slay, temporarily binding it to your service. When you slay a humanoid, you can cause its spirit to rise from its corpse as a specter, the statistics for which are in the Monster Manual. When the specter appears, it gains temporary hit points equal to half your warlock level. Roll initiative for the specter, which has its own turns. It obeys your verbal commands, and it gains a special bonus to its attack rolls equal to your Charisma modifier (minimum of +0). The specter remains in your service until the end of your next long rest, at which point it vanishes to the afterlife. Once you bind a specter with this feature, you can't us",
          "resource": null
        },
        {
          "name": "Armor of Hexes",
          "level": 10,
          "description": "At 10th level, your hex grows more powerful. If the target cursed by your Hexblade's Curse hits you with an attack roll, you can use your reaction to roll a d6. On a 4 or higher, the attack instead misses you, regardless of its roll.",
          "resource": null
        },
        {
          "name": "Master of Hexes",
          "level": 14,
          "description": "Starting at 14th level, you can spread your Hexblade's Curse from a slain creature to another creature. When the creature cursed by your Hexblade's Curse dies, you can apply the curse to a different creature you can see within 30 feet of you, provided you aren't incapacitated. When you apply the curse in this way, you don't regain hit points from the death of the previously cursed creature.",
          "resource": null
        }
      ]
    },
    "The Fathomless": {
      "name": "The Fathomless",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "The Fathomless",
          "level": 1,
          "description": "You have plunged into a pact with the deeps. An entity of the ocean, the Elemental Plane of Water, or another otherworldly sea now allows you to draw on its thalassic power. Is it merely using you to learn about terrestrial realms, or does it want you to open cosmic floodgates and drown the world? Perhaps you were born into a generational cult that venerates the Fathomless and its spawn. Or you might have been shipwrecked and on the brink of drowning when your patron's grasp offered you a chance at life. Whatever the reason for your pact, the sea and its unknown depths call to you. Entities of the deep that might empower a warlock include krakens, ancient water elementals, godlike hallucinat",
          "resource": null
        },
        {
          "name": "Gift of the Sea",
          "level": 1,
          "description": "1st-level Fathomless feature You gain a swimming speed of 40 feet, and you can breathe underwater.",
          "resource": null
        },
        {
          "name": "Tentacle of the Deeps",
          "level": 1,
          "description": "1st-level Fathomless feature You can magically summon a spectral tentacle that strikes at your foes. As a bonus action, you create a 10-foot-long tentacle at a point you can see within 60 feet of you. The tentacle lasts for 1 minute or until you use this feature to create another tentacle. When you create the tentacle, you can make a melee spell attack against one creature within 10 feet of it. On a hit, the target takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn. When you reach 10th level in this class, the damage increases to 2d8. As a bonus action on your turn, you can move the tentacle up to 30 feet and repeat the attack. You can summon the ten",
          "resource": null
        },
        {
          "name": "Guardian Coil",
          "level": 6,
          "description": "6th-level Fathomless feature Your Tentacle of the Deeps can defend you and others, interposing itself between them and harm. When you or a creature you can see takes damage while within 10 feet of the tentacle, you can use your reaction to choose one of those creatures and reduce the damage to that creature by 1d8. When you reach 10th level in this class, the damage reduced by the tentacle increases to 2d8.",
          "resource": null
        },
        {
          "name": "Oceanic Soul",
          "level": 6,
          "description": "6th-level Fathomless feature You are now even more at home in the depths. You gain resistance to cold damage. In addition, when you are fully submerged, any creature that is also fully submerged can understand your speech, and you can understand theirs.",
          "resource": null
        },
        {
          "name": "Grasping Tentacles",
          "level": 10,
          "description": "10th-level Fathomless feature You learn the spell Evard's black tentacles. It counts as a warlock spell for you, but it doesn't count against the number of spells you know. You can also cast it once without a spell slot, and you regain the ability to do so when you finish a long rest. Whenever you cast this spell, your patron's magic bolsters you, granting you a number of temporary hit points equal to your warlock level. Moreover, damage can't break your concentration on this spell.",
          "resource": null
        },
        {
          "name": "Fathomless Plunge",
          "level": 14,
          "description": "14th-level Fathomless feature You can magically open temporary conduits to watery destinations. As an action, you can teleport yourself and up to five other willing creatures that you can see within 30 feet of you. Amid a whirl of tentacles, you all vanish and then reappear up to 1 mile away in a body of water you've seen (pond size or larger) or within 30 feet of it, each of you appearing in an unoccupied space within 30 feet of the others. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        }
      ]
    },
    "The Genie": {
      "name": "The Genie",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Bottled Respite",
          "level": 1,
          "description": "As an action, you can magically vanish and enter your vessel, which remains in the space you left. The interior of the vessel is an extradimensional space in the shape of a 20-foot-radius cylinder, 20 feet high, and resembles your vessel. The interior is appointed with cushions and low tables and is a comfortable temperature. While inside, you can hear the area around your vessel as if you were in its space. You can remain inside the vessel up to a number of hours equal to twice your proficiency bonus. You exit the vessel early if you use a bonus action to leave, if you die, or if the vessel is destroyed. When you exit the vessel, you appear in the unoccupied space closest to it. Any objects",
          "resource": null
        },
        {
          "name": "Genie's Wrath",
          "level": 1,
          "description": "Once during each of your turns when you hit with an attack roll, you can deal extra damage to the target equal to your proficiency bonus. The type of this damage is determined by your patron: bludgeoning (dao), thunder (djinni), fire (efreeti), or cold (marid).",
          "resource": null
        },
        {
          "name": "The Genie",
          "level": 1,
          "description": "You have made a pact with one of the rarest kinds of genie, a noble genie. Such entities rule vast fiefs on the Elemental Planes and have great influence over lesser genies and elemental creatures. Noble genies are varied in their motivations, but most are arrogant and wield power that rivals that of lesser deities. They delight in turning the table on mortals, who often bind genies into servitude, and readily enter into pacts that expand their reach. You choose your patron's kind or determine it randomly, using the Genie Kind table. Expanded Spell List: 1st-level Genie feature The Genie lets you choose from an expanded list of spells when you learn a warlock spell. The Genie Expanded Spells",
          "resource": null
        },
        {
          "name": "Genie's Vessel",
          "level": 1,
          "description": "1st-level Genie feature Your patron gifts you a magical vessel that grants you a measure of the genie's power. The vessel is a Tiny object, and you can use it as a spellcasting focus for your warlock spells. You decide what the object is, or you can determine what it is randomly by rolling on the Genie's Vessel table. While you are touching the vessel, you can use it in the following ways: The vessel's AC equals your spell save DC. Its hit points equal your warlock level plus your proficiency bonus, and it is immune to poison and psychic damage. If the vessel is destroyed or you lose it, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be perform",
          "resource": null
        },
        {
          "name": "Elemental Gift",
          "level": 6,
          "description": "6th-level Genie feature You begin to take on characteristics of your patron's kind. You now have resistance to a damage type determined by your patron's kind: bludgeoning (dao), thunder (djinni), fire (efreeti), or cold (marid). In addition, as a bonus action, you can give yourself a flying speed of 30 feet that lasts for 10 minutes, during which you can hover. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Sanctuary Vessel",
          "level": 10,
          "description": "10th-level Genie feature When you enter your Genie's Vessel via the Bottled Respite feature, you can now choose up to five willing creatures that you can see within 30 feet of you, and the chosen creatures are drawn into the vessel with you. As a bonus action, you can eject any number of creatures from the vessel, and everyone is ejected if you leave or die or if the vessel is destroyed. In addition, anyone (including you) who remains within the vessel for at least 10 minutes gains the benefit of finishing a short rest, and anyone can add your proficiency bonus to the number of hit points they regain if they spend any Hit Dice as part of a short rest there.",
          "resource": null
        },
        {
          "name": "Limited Wish",
          "level": 14,
          "description": "14th-level Genie feature You entreat your patron to grant you a small wish. As an action, you can speak your desire to your Genie's Vessel, requesting the effect of one . The spell can be from any class's spell list, and you don't need to meet the requirements in that spell, including costly components; the spell simply takes effect as part of this action. Once you use this feature, you can't use it again until you finish 1d4 long rests.",
          "resource": null
        }
      ]
    },
    "The Undead": {
      "name": "The Undead",
      "source": "Van Richten's Guide",
      "features": [
        {
          "name": "The Undead",
          "level": 1,
          "description": "You've made a pact with a deathless being, a creature that defies the cycle and life and death, forsaking its mortal shell so it might eternally pursue its unfathomable ambitions. For such beings, time and morality are fleeting things, the concerns of those for whom grains of sand still rush through life's hourglass. Having once been mortal themselves, these ancient undead know firsthand the paths of ambition and the routes past the doors of death. They eagerly share this profane knowledge, along with other secrets, with those who work their will among the living. Beings of this type include the demilich Acererak, the vampire tyrant Kas the Bloody-Handed, the githyanki lich-queen Vlaakith, t",
          "resource": null
        },
        {
          "name": "Form of Dread",
          "level": 1,
          "description": "1st-level Undead feature You manifest an aspect of your patron's dreadful power. As a bonus action, you transform for 1 minute. You gain the following benefits while transformed: You gain temporary hit points equal to 1d10 + your warlock level. Once during each of your turns, when you hit a creature with an attack roll, you can force it to make a Wisdom saving throw, and if the saving throw fails, the target is frightened of you until the end of your next turn. You are immune to the frightened condition. You can transform a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. The appearance of your Form of Dread reflects some aspect o",
          "resource": {
            "name": "Form of Dread",
            "maxFormula": "proficiency",
            "die": null,
            "recharge": "long"
          }
        },
        {
          "name": "Grave Touched",
          "level": 6,
          "description": "6th-level Undead feature Your patron's powers have a profound effect on your body and magic. You don't need to eat, drink, or breathe. In addition, once during each of your turns, when you hit a creature with an attack roll and roll damage against the creature, you can replace the damage type with necrotic damage. While you are using your Form of Dread, you can roll one additional damage die when determining the necrotic damage the target takes.",
          "resource": null
        },
        {
          "name": "Necrotic Husk",
          "level": 10,
          "description": "10th-level Undead feature Your connection to undeath and necrotic energy now saturates your body. You have resistance to necrotic damage. If you are transformed using your Form of Dread, you instead become immune to necrotic damage. In addition, when you would be reduced to 0 hit points, you can use your reaction to drop to 1 hit point instead and cause your body to erupt with deathly energy. Each creature of your choice that is within 30 feet of you takes necrotic damage equal to 2d10 + your warlock level. You then gain 1 level of exhaustion. Once you use this reaction, you can't do so again until you finish 1d4 long rests.",
          "resource": null
        },
        {
          "name": "Spirit Projection",
          "level": 14,
          "description": "14th-level Undead feature Your spirit can become untethered from your physical form. As an action, you can project your spirit from your body. The body you leave behind is unconscious and in a state of suspended animation. Your spirit resembles your mortal form in almost every way, replicating your game statistics but not your possessions. Any damage or other effects that apply to your spirit or physical body affects the other. Your spirit can remain outside your body for up to 1 hour or until your concentration is broken (as if concentration on a spell). When your projection ends, your spirit returns to your body or your body magically teleports to your spirit's space (your choice). While p",
          "resource": null
        }
      ]
    },
    "Archfey Patron": {
      "name": "Archfey Patron",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Archfey Patron",
          "level": 3,
          "description": "Bargain with Whimsical Fey Your pact draws on the power of the Feywild. When you choose this subclass, you might make a deal with an archfey, such as the Prince of Frost; the Queen of Air and Darkness, ruler of the Gloaming Court; Titania of the Summer Court; or an ancient hag. Or you might call on a spectrum of Fey, weaving a web of favors and debts. Whoever they are, your patron is often inscrutable and whimsical.",
          "resource": null
        },
        {
          "name": "Archfey Spells",
          "level": 3,
          "description": "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Archfey Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Steps of the Fey",
          "level": 3,
          "description": "Your patron grants you the ability to move between the boundaries of the planes. You can cast Misty Step without expending a spell slot a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. In addition, whenever you cast that spell, you can choose one of the following additional effects. Refreshing Step: Immediately after you teleport, you or one creature you can see within 10 feet of yourself gains 1d10 Temporary Hit Points. Taunting Step: Creatures within 5 feet of the space you left must succeed on a Wisdom saving throw against your spell save DC or have Disadvantage on attack rolls against creatures other than y",
          "resource": null
        },
        {
          "name": "Misty Escape",
          "level": 6,
          "description": "You can cast Misty Step as a Reaction in response to taking damage. In addition, the following effects are now among your Steps of the Fey options. Disappearing Step: You have the Invisible condition until the start of your next turn or until immediately after you make an attack roll, deal damage, or cast a spell. Dreadful Step: Creatures within 5 feet of the space you left or the space you appear in (your choice) must succeed on a Wisdom saving throw against your spell save DC or take 2d10 Psychic damage.",
          "resource": null
        },
        {
          "name": "Beguiling Defenses",
          "level": 10,
          "description": "Your patron teaches you how to guard your mind and body. You are immune to the Charmed condition. In addition, immediately after a creature you can see hits you with an attack roll, you can take a Reaction to reduce the damage you take by half (round down), and you can force the attacker to make a Wisdom saving throw against your spell save DC. On a failed save, the attacker takes Psychic damage equal to the damage you take. Once you use this Reaction, you can't use it again until you finish a Long Rest unless you expend a Pact Magic spell slot (no action required) to restore your use of it.",
          "resource": null
        },
        {
          "name": "Bewitching Magic",
          "level": 14,
          "description": "Your patron grants you the ability to weave your magic with teleportation. Immediately after you cast an Enchantment or Illusion spell using an action and a spell slot, you can cast Misty Step as part of the same action and without expending a spell slot.",
          "resource": null
        }
      ]
    },
    "Celestial Patron": {
      "name": "Celestial Patron",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Celestial Patron",
          "level": 3,
          "description": "Call on the Power of the Heavens Your pact draws on the Upper Planes, the realms of everlasting bliss. You might enter an agreement with an empyrean, a couatl, a sphinx, a unicorn, or another heavenly entity. Or you might call on numerous such beings as you pursue goals aligned with theirs. Your pact allows you to experience a hint of the holy light that illuminates the multiverse.",
          "resource": null
        },
        {
          "name": "Celestial Spells",
          "level": 3,
          "description": "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Celestial Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Healing Light",
          "level": 3,
          "description": "You gain the ability to channel celestial energy to heal wounds. You have a pool of d6s to fuel this healing. The number of dice in the pool equals 1 plus your Warlock level. As a Bonus Action, you can heal yourself or one creature you can see within 60 feet of yourself, expending dice from the pool. The maximum number of dice you can expend at once equals your Charisma modifier (minimum of one die). Roll the dice you expend, and restore a number of Hit Points equal to the roll's total. Your pool regains all expended dice when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Radiant Soul",
          "level": 6,
          "description": "Your link to your patron allows you to serve as a conduit for radiant energy. You have Resistance to Radiant damage. Once per turn, when a spell you cast deals Radiant or Fire damage, you can add your Charisma modifier to that spell's damage against one of the spell's targets.",
          "resource": null
        },
        {
          "name": "Celestial Resilience",
          "level": 10,
          "description": "You gain Temporary Hit Points whenever you use your Magical Cunning feature or finish a Short Rest or Long Rest. These Temporary Hit Points equal your Warlock level plus your Charisma modifier. Additionally, choose up to five creatures you can see when you gain the points. Those creatures each gain Temporary Hit Points equal to half your Warlock level plus your Charisma modifier.",
          "resource": null
        },
        {
          "name": "Searing Vengeance",
          "level": 14,
          "description": "When you or an ally within 60 feet of you is about to make a Death Saving Throw, you can unleash radiant energy to save the creature. The creature regains Hit Points equal to half its Hit Points maximum and can end the Prone condition on itself. Each creature of your choice that is within 30 feet of the creature takes Radiant damage equal to 2d8 plus your Charisma modifier, and each has the Blinded condition until the end of the current turn. Once you use this feature, you can't use it again until you finish a Long Rest.",
          "resource": null
        }
      ]
    },
    "Fiend Patron": {
      "name": "Fiend Patron",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Fiend Patron",
          "level": 3,
          "description": "Make a Deal with the Lower Planes Your pact draws on the Lower Planes, the realms of perdition. You might forge a bargain with a demon lord such as Demogorgon or Orcus; an archdevil such as Asmodeus; or a pit fiend, balor, yugoloth, or night hag that is especially mighty. That patron's aims are evil—the corruption or destruction of all things, ultimately including you—and your path is defined by the extent to which you strive against those aims.",
          "resource": null
        },
        {
          "name": "Dark One's Blessing",
          "level": 3,
          "description": "When you reduce an enemy to 0 Hit Points, you gain Temporary Hit Points equal to your Charisma modifier plus your Warlock level (minimum of 1 Temporary Hit Points). You also gain this benefit if someone else reduces an enemy within 10 feet of you to 0 Hit Points.",
          "resource": null
        },
        {
          "name": "Fiend Spells",
          "level": 3,
          "description": "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Fiend Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Dark One's Own Luck",
          "level": 6,
          "description": "You can call on your fiendish patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add 1d10 to your roll. You can do so after seeing the roll but before any of the roll's effects occur. You can use this feature a number of times equal to your Charisma modifier (minimum of once), but you can use it no more than once per roll. You regain all expended uses when you finish a Long Rest.",
          "resource": null
        },
        {
          "name": "Fiendish Resilience",
          "level": 10,
          "description": "Choose one damage type, other than Force, whenever you finish a Short Rest or Long Rest. You have Resistance to that damage type until you choose a different one with this feature.",
          "resource": null
        },
        {
          "name": "Hurl Through Hell",
          "level": 14,
          "description": "Once per turn when you hit a creature with an attack roll, you can try to instantly transport the target through the Lower Planes. The target must succeed on a Charisma saving throw against your spell save DC, or the target disappears and hurtles through a nightmare landscape. The target takes 8d10 Psychic damage if it isn't a Fiend, and it has the Incapacitated condition until the end of your next turn, when it returns to the space it previously occupied or the nearest unoccupied space. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a Pact Magic spell slot (no action required) to restore your use of it.",
          "resource": {
            "name": "Hurl Through Hell",
            "maxFormula": 1,
            "die": null,
            "recharge": "long"
          }
        }
      ]
    },
    "Great Old One Patron": {
      "name": "Great Old One Patron",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Great Old One Patron",
          "level": 3,
          "description": "Unearth Forbidden Lore of Ineffable Beings When you choose this subclass, you might bind yourself to an unspeakable being from the Far Realm or an elder god—a being such as Tharizdun, the Chained God; Zargon, the Returner; Hadar, the Dark Hunger; or Great Cthulhu. Or you might invoke several entities without yoking yourself to one. The motives of these beings are incomprehensible, and the Great Old One might be indifferent to your existence. But the secrets you've learned nevertheless allow you to draw strange magic from it.",
          "resource": null
        },
        {
          "name": "Awakened Mind",
          "level": 3,
          "description": "You can form a telepathic connection between your mind and the mind of another. As a Bonus Action, choose one creature you can see within 30 feet of yourself. You and the chosen creature can communicate telepathically with each other while the two of you are within a number of miles of each other equal to your Charisma modifier (minimum of 1 mile). To understand each other, you each must mentally use a language the other knows. The telepathic connection lasts for a number of minutes equal to your Warlock level. It ends early if you use this feature to connect with a different creature.",
          "resource": null
        },
        {
          "name": "Great Old One Spells",
          "level": 3,
          "description": "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Great Old One Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Psychic Spells",
          "level": 3,
          "description": "When you cast a Warlock spell that deals damage, you can change its damage type to Psychic. In addition, when you cast a Warlock spell that is an  or , you can do so without Verbal or Somatic components.",
          "resource": null
        },
        {
          "name": "Clairvoyant Combatant",
          "level": 6,
          "description": "When you form a telepathic bond with a creature using your Awakened Mind, you can force that creature to make a Wisdom saving throw against your spell save DC. On a failed save, the creature has Disadvantage on attack rolls against you, and you have Advantage on attack rolls against that creature for the duration of the bond. Once you use this feature, you can't use it again until you finish a Short Rest or Long Rest unless you expend a Pact Magic spell slot (no action required) to restore your use of it.",
          "resource": null
        },
        {
          "name": "Eldritch Hex",
          "level": 10,
          "description": "Your alien patron grants you a powerful curse. You always have the Hex spell prepared. When you cast Hex and choose an ability, the target also has Disadvantage on saving throws of the chosen ability for the duration of the spell.",
          "resource": null
        },
        {
          "name": "Thought Shield",
          "level": 10,
          "description": "Your thoughts can't be read by telepathy or other means unless you allow it. You also have Resistance to Psychic damage, and whenever a creature deals Psychic damage to you, that creature takes the same amount of damage that you take.",
          "resource": null
        },
        {
          "name": "Create Thrall",
          "level": 14,
          "description": "When you cast Summon Aberration, you can modify it so that it doesn't require Concentration. If you do so, the spell's duration becomes 1 minute for that casting, and when summoned, the Aberration has a number of Temporary Hit Points equal to your Warlock level plus your Charisma modifier. In addition, the first time each turn the Aberration hits a creature under the effect of your Hex, the Aberration deals extra Psychic damage to the target equal to the bonus damage of that spell.",
          "resource": null
        }
      ]
    }
  },
  "Wizard": {
    "School of Abjuration": {
      "name": "School of Abjuration",
      "source": "PHB 2014",
      "features": [
        {
          "name": "School of Abjuration",
          "level": 2,
          "description": "The School of Abjuration emphasizes magic that blocks, banishes, or protects. Detractors of this school say that its tradition is about denial, negation rather than positive assertion. You understand, however, that ending harmful effects, protecting the weak, and banishing evil influences is anything but a philosophical void. It is a proud and respected vocation. Called abjurers, members of this school are sought when baleful spirits require exorcism, when important locations must be guarded against magical spying, and when portals to other planes of existence must be closed.",
          "resource": null
        },
        {
          "name": "Abjuration Savant",
          "level": 2,
          "description": "Beginning when you select this school at 2nd level, the gold and time you must spend to copy an abjuration spell into your spellbook is halved.",
          "resource": null
        },
        {
          "name": "Arcane Ward",
          "level": 2,
          "description": "Starting at 2nd level, you can weave magic around yourself for protection. When you cast an , you can simultaneously use a strand of the spell's magic to create a magical ward on yourself that lasts until you finish a long rest. The ward has a hit point maximum equal to twice your wizard level + your Intelligence modifier. Whenever you take damage, the ward takes the damage instead. If this damage reduces the ward to 0 hit points, you take any remaining damage. While the ward has 0 hit points, it can't absorb damage, but its magic remains. Whenever you cast an , the ward regains a number of hit points equal to twice the level of the spell. Once you create the ward, you can't create it again ",
          "resource": null
        },
        {
          "name": "Projected Ward",
          "level": 6,
          "description": "Starting at 6th level, when a creature that you can see within 30 feet of you takes damage, you can use your reaction to cause your Arcane Ward to absorb that damage. If this damage reduces the ward to 0 hit points, the warded creature takes any remaining damage.",
          "resource": null
        },
        {
          "name": "Improved Abjuration",
          "level": 10,
          "description": "Beginning at 10th level, when you cast an abjuration spell that requires you to make an ability check as a part of casting that spell (as in counterspell and dispel magic), you add your proficiency bonus to that ability check.",
          "resource": null
        },
        {
          "name": "Spell Resistance",
          "level": 14,
          "description": "Starting at 14th level, you have advantage on saving throws against spells. Furthermore, you have resistance against the damage of spells.",
          "resource": null
        }
      ]
    },
    "School of Conjuration": {
      "name": "School of Conjuration",
      "source": "PHB 2014",
      "features": [
        {
          "name": "School of Conjuration",
          "level": 2,
          "description": "As a conjurer, you favor spells that produce objects and creatures out of thin air. You can conjure billowing clouds of killing fog or summon creatures from elsewhere to fight on your behalf. As your mastery grows, you learn spells of transportation and can teleport yourself across vast distances, even to other planes of existence, in an instant.",
          "resource": null
        },
        {
          "name": "Conjuration Savant",
          "level": 2,
          "description": "Beginning when you select this school at 2nd level, the gold and time you must spend to copy a conjuration spell into your spellbook is halved.",
          "resource": null
        },
        {
          "name": "Minor Conjuration",
          "level": 2,
          "description": "Starting at 2nd level when you select this school, you can use your action to conjure up an inanimate object in your hand or on the ground in an unoccupied space that you can see within 10 feet of you. This object can be no larger than 3 feet on a side and weigh no more than 10 pounds, and its form must be that of a nonmagical object that you have seen. The object is visibly magical, radiating dim light out to 5 feet. The object disappears after 1 hour, when you use this feature again, if it takes any damage, or if it deals any damage.",
          "resource": null
        },
        {
          "name": "Benign Transposition",
          "level": 6,
          "description": "Starting at 6th level, you can use your action to teleport up to 30 feet to an unoccupied space that you can see. Alternatively, you can choose a space within range that is occupied by a Small or Medium creature. If that creature is willing, you both teleport, swapping places. Once you use this feature, you can't use it again until you finish a long rest or you cast a conjuration spell of 1st level or higher.",
          "resource": null
        },
        {
          "name": "Focused Conjuration",
          "level": 10,
          "description": "Beginning at 10th level, while you are concentration on a conjuration spell, your concentration can't be broken as a result of taking damage.",
          "resource": null
        },
        {
          "name": "Durable Summons",
          "level": 14,
          "description": "Starting at 14th level, any creature that you summon or create with a conjuration spell has 30 temporary hit points.",
          "resource": null
        }
      ]
    },
    "School of Divination": {
      "name": "School of Divination",
      "source": "PHB 2014",
      "features": [
        {
          "name": "School of Divination",
          "level": 2,
          "description": "The counsel of a diviner is sought by royalty and commoners alike, for all seek a clearer understanding of the past, present, and future. As a diviner, you strive to part the veils of space, time, and consciousness so that you can see clearly. You work to master spells of discernment, remote viewing, supernatural knowledge, and foresight.",
          "resource": null
        },
        {
          "name": "Divination Savant",
          "level": 2,
          "description": "Beginning when you select this school at 2nd level, the gold and time you must spend to copy a divination spell into your spellbook is halved.",
          "resource": null
        },
        {
          "name": "Portent",
          "level": 2,
          "description": "Starting at 2nd level when you choose this school, glimpses of the future begin to press in on your awareness. When you finish a long rest, roll two d20s and record the numbers rolled. You can replace any attack roll, saving throw, or ability check made by you or a creature that you can see with one of these foretelling rolls. You must choose to do so before the roll, and you can replace a roll in this way only once per turn. Each foretelling roll can be used only once. When you finish a long rest, you lose any unused foretelling rolls.",
          "resource": null
        },
        {
          "name": "Expert Divination",
          "level": 6,
          "description": "Beginning at 6th level, casting divination spells comes so easily to you that it expends only a fraction of your spellcasting efforts. When you cast a  using a spell slot, you regain one expended spell slot. The slot you regain must be of a level lower than the spell you cast and can't be higher than 5th level.",
          "resource": null
        },
        {
          "name": "The Third Eye",
          "level": 10,
          "description": "Starting at 10th level, you can use your action to increase your powers of perception. When you do so, choose one of the following benefits, which lasts until you are incapacitated or you take a short or long rest. You can't use the feature again until you finish a rest. Darkvision: You gain darkvision out to a range of 60 feet. Ethereal Sight: You can see into the Ethereal Plane within 60 feet of you. Greater Comprehension: You can read any language. See Invisibility: You can see invisible creatures and objects within 10 feet of you that are within line of sight.",
          "resource": null
        },
        {
          "name": "Greater Portent",
          "level": 14,
          "description": "Starting at 14th level, the visions in your dreams intensify and paint a more accurate picture in your mind of what is to come. You roll three d20s for your Portent feature, rather than two.",
          "resource": null
        }
      ]
    },
    "School of Enchantment": {
      "name": "School of Enchantment",
      "source": "PHB 2014",
      "features": [
        {
          "name": "School of Enchantment",
          "level": 2,
          "description": "As a member of the School of Enchantment, you have honed your ability to magically entrance and beguile other people and monsters. Some enchanters are peacemakers who bewitch the violent to lay down their arms and charm the cruel into showing mercy. Others are tyrants who magically bind the unwilling into their service. Most enchanters fall somewhere in between.",
          "resource": null
        },
        {
          "name": "Enchantment Savant",
          "level": 2,
          "description": "Beginning when you select this school at 2nd level, the gold and time you must spend to copy an enchantment spell into your spellbook is halved.",
          "resource": null
        },
        {
          "name": "Hypnotic Gaze",
          "level": 2,
          "description": "Starting at 2nd level when you choose this school, your soft words and enchanting gaze can magically enthrall another creature. As an action, choose one creature that you can see within 5 feet of you. If the target can see or hear you, it must succeed on a Wisdom saving throw against your wizard spell save DC or be charmed by you until the end of your next turn. The charmed creature's speed drops to 0, and the creature is incapacitated and visibly dazed. On subsequent turns, you can use your action to maintain this effect, extending its duration until the end of your next turn. However, the effect ends if you move more than 5 feet away from the creature, if the creature can neither see nor h",
          "resource": null
        },
        {
          "name": "Instinctive Charm",
          "level": 6,
          "description": "Beginning at 6th level, when a creature you can see within 30 feet of you makes an attack roll against you, you can use your reaction to divert the attack, provided that another creature is within the attack's range. The attacker must make a Wisdom saving throw against your wizard spell save DC. On a failed save, the attacker must target the creature that is closest to it, not including you or itself. If multiple creatures are closest, the attacker chooses which one to target. On a successful save, you can't use this feature on the attacker again until you finish a long rest. You must choose to use this feature before knowing whether the attack hits or misses. Creatures that can't be charmed",
          "resource": null
        },
        {
          "name": "Split Enchantment",
          "level": 10,
          "description": "Starting at 10th level, when you cast an enchantment spell of 1st level or higher that targets only one creature, you can have it target a second creature.",
          "resource": null
        },
        {
          "name": "Alter Memories",
          "level": 14,
          "description": "At 14th level, you gain the ability to make a creature unaware of your magical influence on it. When you cast an enchantment spell to charm one or more creatures, you can alter one creature's understanding so that it remains unaware of being charmed. Additionally, once before the spell expires, you can use your action to try to make the chosen creature forget some of the time it spent charmed. The creature must succeed on an Intelligence saving throw against your wizard spell save DC or lose a number of hours of its memories equal to 1 + your Charisma modifier (minimum of 1). You can make the creature forget less time, and the amount of time can't exceed the duration of your enchantment spel",
          "resource": null
        }
      ]
    },
    "School of Evocation": {
      "name": "School of Evocation",
      "source": "PHB 2014",
      "features": [
        {
          "name": "School of Evocation",
          "level": 2,
          "description": "You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid. Some evokers find employment in military forces, serving as artillery to blast enemy armies from afar. Others use their spectacular power to protect the weak, while some seek their own gain as bandits, adventurers, or aspiring tyrants.",
          "resource": null
        },
        {
          "name": "Evocation Savant",
          "level": 2,
          "description": "Beginning when you select this school at 2nd level, the gold and time you must spend to copy an evocation spell into your spellbook is halved.",
          "resource": null
        },
        {
          "name": "Sculpt Spells",
          "level": 2,
          "description": "Beginning at 2nd level, you can create pockets of relative safety within the effects of your evocation spells. When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.",
          "resource": null
        },
        {
          "name": "Potent Cantrip",
          "level": 6,
          "description": "Starting at 6th level, your damaging cantrips affect even creatures that avoid the brunt of the effect. When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip.",
          "resource": null
        },
        {
          "name": "Empowered Evocation",
          "level": 10,
          "description": "Beginning at 10th level, you can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast.",
          "resource": null
        },
        {
          "name": "Overchannel",
          "level": 14,
          "description": "Starting at 14th level, you can increase the power of your simpler spells. When you cast a wizard spell of 1st through 5th-level that deals damage, you can deal maximum damage with that spell. The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12. This damage ignores resistance and immunity.",
          "resource": null
        }
      ]
    },
    "School of Illusion": {
      "name": "School of Illusion",
      "source": "PHB 2014",
      "features": [
        {
          "name": "School of Illusion",
          "level": 2,
          "description": "You focus your studies on magic that dazzles the senses, befuddles the mind, and tricks even the wisest folk. Your magic is subtle, but the illusions crafted by your keen mind make the impossible seem real. Some illusionists—including many gnome wizards—are benign tricksters who use their spells to entertain. Others are more sinister masters of deception, using their illusions to frighten and fool others for their personal gain.",
          "resource": null
        },
        {
          "name": "Illusion Savant",
          "level": 2,
          "description": "Beginning when you select this school at 2nd level, the gold and time you must spend to copy an illusion spell into your spellbook is halved.",
          "resource": null
        },
        {
          "name": "Improved Minor Illusion",
          "level": 2,
          "description": "When you choose this school at 2nd level, you learn the minor illusion cantrip. If you already know this cantrip, you learn a different wizard cantrip of your choice. The cantrip doesn't count against your number of cantrips known. When you cast minor illusion, you can create both a sound and an image with a single casting of the spell.",
          "resource": null
        },
        {
          "name": "Malleable Illusions",
          "level": 6,
          "description": "Starting at 6th level, when you cast an illusion spell that has a duration of 1 minute or longer, you can use your action to change the nature of that illusion (using the spell's normal parameters for the illusion), provided that you can see the illusion.",
          "resource": null
        },
        {
          "name": "Illusory Self",
          "level": 10,
          "description": "Beginning at 10th level, you can create an illusory duplicate of yourself as an instant, almost instinctual reaction to danger. When a creature makes an attack roll against you, you can use your reaction to interpose the illusory duplicate between the attacker and yourself. The attack automatically misses you, then the illusion dissipates. Once you use this feature, you can't use it again until you finish a short or long rest.",
          "resource": null
        },
        {
          "name": "Illusory Reality",
          "level": 14,
          "description": "By 14th level, you have learned the secret of weaving shadow magic into your illusions to give them a semi-reality. When you cast an illusion spell of 1st level or higher, you can choose one inanimate, nonmagical object that is part of the illusion and make that object real. You can do this on your turn as a bonus action while the spell is ongoing. The object remains real for 1 minute. For example, you can create an illusion of a bridge over a chasm and then make it real long enough for your allies to cross. The object can't deal damage or otherwise directly harm anyone.",
          "resource": null
        }
      ]
    },
    "School of Necromancy": {
      "name": "School of Necromancy",
      "source": "PHB 2014",
      "features": [
        {
          "name": "School of Necromancy",
          "level": 2,
          "description": "The School of Necromancy explores the cosmic forces of life, death, and undeath. As you focus your studies in this tradition, you learn to manipulate the energy that animates all living things. As you progress, you learn to sap the life force from a creature as your magic destroys its body, transforming that vital energy into magical power you can manipulate. Most people see necromancers as menacing, or even villainous, due to the close association with death. Not all necromancers are evil, but the forces they manipulate are considered taboo by many societies.",
          "resource": null
        },
        {
          "name": "Grim Harvest",
          "level": 2,
          "description": "At 2nd level, you gain the ability to reap life energy from creatures you kill with your spells. Once per turn when you kill one or more creatures with a spell of 1st level or higher, you regain hit points equal to twice the spell's level, or three times its level if the spell belongs to the . You don't gain this benefit for killing constructs or undead.",
          "resource": null
        },
        {
          "name": "Necromancy Savant",
          "level": 2,
          "description": "Beginning when you select this school at 2nd level, the gold and time you must spend to copy a necromancy spell into your spellbook is halved.",
          "resource": null
        },
        {
          "name": "Undead Thralls",
          "level": 6,
          "description": "At 6th level, you add the animate dead spell to your spellbook if it is not there already. When you cast animate dead, you can target one additional corpse or pile of bones, creating another zombie or skeleton, as appropriate. Whenever you create an undead using a necromancy spell, it has additional benefits: The creature's hit point maximum is increased by an amount equal to your wizard level. The creature adds your proficiency bonus to its weapon damage rolls.",
          "resource": null
        },
        {
          "name": "Inured to Undeath",
          "level": 10,
          "description": "Beginning at 10th level, you have resistance to necrotic damage, and your hit point maximum can't be reduced. You have spent so much time dealing with undead and the forces that animate them that you have become inured to some of their worst effects.",
          "resource": null
        },
        {
          "name": "Command Undead",
          "level": 14,
          "description": "Starting at 14th level, you can use magic to bring undead under your control, even those created by other wizards. As an action, you can choose one undead that you can see within 60 feet of you. That creature must make a Charisma saving throw against your wizard spell save DC. If it succeeds, you can't use this feature on it again. If it fails, it becomes friendly to you and obeys your commands until you use this feature again. Intelligent undead are harder to control in this way. If the target has an Intelligence of 8 or higher, it has advantage on the saving throw. If it fails the saving throw and has an Intelligence of 12 or higher, it can repeat the saving throw at the end of every hour ",
          "resource": null
        }
      ]
    },
    "School of Transmutation": {
      "name": "School of Transmutation",
      "source": "PHB 2014",
      "features": [
        {
          "name": "School of Transmutation",
          "level": 2,
          "description": "You are a student of spells that modify energy and matter. To you, the world is not a fixed thing, but eminently mutable, and you delight in being an agent of change. You wield the raw stuff of creation and learn to alter both physical forms and mental qualities. Your magic gives you the tools to become a smith on reality's forge. Some transmuters are tinkerers and pranksters, turning people into toads and transforming copper into silver for fun and occasional profit. Others pursue their magical studies with deadly seriousness, seeking the power of the gods to make and destroy worlds.",
          "resource": null
        },
        {
          "name": "Minor Alchemy",
          "level": 2,
          "description": "Starting at 2nd level when you select this school, you can temporarily alter the physical properties of one nonmagical object, changing it from one substance into another. You perform a special alchemical procedure on one object composed entirely of wood, stone (but not a gemstone), iron, copper, or silver, transforming it into a different one of those materials. For each 10 minutes you spend performing the procedure, you can transform up to 1 cubic foot of material. After 1 hour, or until you lose your concentration (as if you were concentration on a spell), the material reverts to its original substance.",
          "resource": null
        },
        {
          "name": "Transmutation Savant",
          "level": 2,
          "description": "Beginning when you select this school at 2nd level, the gold and time you must spend to copy a transmutation spell into your spellbook is halved.",
          "resource": null
        },
        {
          "name": "Transmuter's Stone",
          "level": 6,
          "description": "Starting at 6th level, you can spend 8 hours creating a transmuter's stone that stores transmutation magic. You can benefit from the stone yourself or give it to another creature. A creature gains a benefit of your choice as long as the stone is in the creature's possession. When you create the stone, choose the benefit from the following options: Darkvision out to a range of 60 feet, as described in chapter 8. An increase to speed of 10 feet while the creature is unencumbered. Proficiency in Constitution saving throws. Resistance to acid, cold, fire, lightning, or thunder damage (your choice whenever you choose this benefit). Each time you cast a transmutation spell of 1st level or higher, ",
          "resource": null
        },
        {
          "name": "Shapechanger",
          "level": 10,
          "description": "At 10th level, you add the polymorph spell to your spellbook, if it is not there already. You can cast polymorph without expending a spell slot. When you do so, you can target only yourself and transform into a . Once you cast polymorph in this way, you can't do so again until you finish a short or long rest, though you can still cast it normally using an available spell slot.",
          "resource": null
        },
        {
          "name": "Master Transmuter",
          "level": 14,
          "description": "Starting at 14th level, you can use your action to consume the reserve of transmutation magic stored within your transmuter's stone in a single burst. When you do so, choose one of the following effects. Your transmuter's stone is destroyed and can't be remade until you finish a long rest. Major Transformation: You can transmute one nonmagical object—no larger than a 5-foot cube—into another nonmagical object of similar size and mass and of equal or lesser value. You must spend 10 minutes handling the object to transform it. Panacea: You remove all curses, diseases, and poisons affecting a creature that you touch with the transmuter's stone. The creature also regains all its hit points. Rest",
          "resource": null
        }
      ]
    },
    "War Magic": {
      "name": "War Magic",
      "source": "Xanathar's Guide",
      "features": [
        {
          "name": "War Magic",
          "level": 2,
          "description": "A variety of arcane colleges specialize in training wizards for war. The tradition of War Magic blends principles of evocation and abjuration, rather than specializing in either of those schools. It teaches techniques that empower a caster's spells, while also providing methods for wizards to bolster their own defenses. Followers of this tradition are known as war mages. They see their magic as both a weapon and armor, a resource superior to any piece of steel. War mages act fast in battle, using their spells to seize tactical control of a situation. Their spells strike hard, while their defensive skills foil their opponents' attempts to counterattack. War mages are also adept at turning oth",
          "resource": null
        },
        {
          "name": "Arcane Deflection",
          "level": 2,
          "description": "At 2nd level, you have learned to weave your magic to fortify yourself against harm. When you are hit by an attack or you fail a saving throw, you can use your reaction to gain a +2 bonus to your AC against that attack or a +4 bonus to that saving throw. When you use this feature, you can't cast spells other than cantrips until the end of your next turn.",
          "resource": null
        },
        {
          "name": "Tactical Wit",
          "level": 2,
          "description": "Starting at 2nd level, your keen ability to assess tactical situations allows you to act quickly in battle. You can give yourself a bonus to your initiative rolls equal to your Intelligence modifier.",
          "resource": null
        },
        {
          "name": "Power Surge",
          "level": 6,
          "description": "Starting at 6th level, you can store magical energy within yourself to later empower your damaging spells. In its stored form, this energy is called a power surge. You can store a maximum number of power surges equal to your Intelligence modifier (minimum of one). Whenever you finish a long rest, your number of power surges resets to one. Whenever you successfully end a spell with dispel magic or counterspell, you gain one power surge, as you steal magic from the spell you foiled. If you end a short rest with no power surges, you gain one power surge. Once per turn when you deal damage to a creature or object with a wizard spell, you can spend one power surge to deal extra force damage to th",
          "resource": null
        },
        {
          "name": "Durable Magic",
          "level": 10,
          "description": "Beginning at 10th level, the magic you channel helps ward off harm. While you maintain concentration on a spell, you have a +2 bonus to AC and all saving throws.",
          "resource": null
        },
        {
          "name": "Deflecting Shroud",
          "level": 14,
          "description": "At 14th level, your Arcane Deflection becomes infused with deadly magic. When you use your Arcane Deflection feature, you can cause magical energy to arc from you. Up to three creatures of your choice that you can see within 60 feet of you each take force damage equal to half your wizard level.",
          "resource": null
        }
      ]
    },
    "Chronurgy Magic": {
      "name": "Chronurgy Magic",
      "source": "Explorer's Guide to Wildemount",
      "features": [
        {
          "name": "Chronurgy Magic",
          "level": 2,
          "description": "Focusing on the manipulation of time, those who follow the Chronurgy tradition learn to alter the pace of reality to their liking. Using the ramping of anticipatory dunamis energy, these mages can bend the flow of time as adroitly as a skilled musician plays an instrument, lending themselves and their allies an advantage in the blink of an eye. }.",
          "resource": null
        },
        {
          "name": "Chronal Shift",
          "level": 2,
          "description": "2nd-level Chronurgy Magic feature You can magically exert limited control over the flow of time around a creature. As a reaction, after you or a creature you can see within 30 feet of you makes an attack roll, an ability check, or a saving throw, you can force the creature to reroll. You make this decision after you see whether the roll succeeds or fails. The target must use the result of the second roll. You can use this ability twice, and you regain any expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Temporal Awareness",
          "level": 2,
          "description": "2nd-level Chronurgy Magic feature You can add your Intelligence modifier to your initiative rolls.",
          "resource": null
        },
        {
          "name": "Momentary Stasis",
          "level": 6,
          "description": "6th-level Chronurgy Magic feature As an action, you can magically force a Large or smaller creature you can see within 60 feet of you to make a Constitution saving throw against your spell save DC. Unless the saving throw is a success, the creature is encased in a field of magical energy until the end of your next turn or until the creature takes any damage. While encased in this way, the creature is incapacitated and has a speed of 0. You can use this feature a number of times equal to your Intelligence modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Arcane Abeyance",
          "level": 10,
          "description": "10th-level Chronurgy Magic feature When you cast a spell using a spell slot of 4th level or lower, you can condense the spell's magic into a mote. The spell is frozen in time at the moment of casting and held within a gray bead for 1 hour. This bead is a Tiny object with AC 15 and 1 hit point, and it is immune to poison and psychic damage. When the duration ends, or if the bead is destroyed, it vanishes in a flash of light, and the spell is lost. A creature holding the bead can use its action to release the spell within, whereupon the bead disappears. The spell uses your spell attack bonus and save DC, and the spell treats the creature who released it as the caster for all other purposes. On",
          "resource": null
        },
        {
          "name": "Convergent Future",
          "level": 14,
          "description": "14th-level Chronurgy Magic feature You can peer through possible futures and magically pull one of them into events around you, ensuring a particular outcome. When you or a creature you can see within 60 feet of you makes an attack roll, an ability check, or a saving throw, you can use your reaction to ignore the die roll and decide whether the number rolled is the minimum needed to succeed or one less than that number (your choice). When you use this feature, you gain one level of exhaustion. Only by finishing a long rest can you remove a level of exhaustion gained in this way.",
          "resource": null
        }
      ]
    },
    "Graviturgy Magic": {
      "name": "Graviturgy Magic",
      "source": "Explorer's Guide to Wildemount",
      "features": [
        {
          "name": "Graviturgy Magic",
          "level": 2,
          "description": "Understanding and mastering the forces that draw bodies of matter together or drive them apart, the students of the Graviturgy arcane tradition learn to further bend and manipulate the violent energy of gravity to their benefit, and the terrible detriment of their enemies. }.",
          "resource": null
        },
        {
          "name": "Adjust Density",
          "level": 2,
          "description": "2nd-level Graviturgy Magic feature As an action, you can magically alter the weight of one object or creature you can see within 30 feet of you. The object or creature must be Large or smaller. The target's weight is halved or doubled for up to 1 minute or until your concentration ends (as if you were concentration on a spell). While the weight of a creature is halved by this effect, the creature's speed increases by 10 feet, it can jump twice as far as normal, and it has disadvantage on Strength checks and Strength saving throws. While the weight of a creature is doubled by this effect, the creature's speed is reduced by 10 feet, and it has advantage on Strength checks and Strength saving t",
          "resource": null
        },
        {
          "name": "Gravity Well",
          "level": 6,
          "description": "6th-level Graviturgy Magic feature You've learned how to manipulate gravity around a living being: whenever you cast a spell on a creature, you can move the target 5 feet to an unoccupied space of your choice if the target is willing to move, the spell hits it with an attack, or it fails a saving throw against the spell.",
          "resource": null
        },
        {
          "name": "Violent Attraction",
          "level": 10,
          "description": "10th-level Graviturgy Magic feature When another creature that you can see within 60 feet of you hits with a weapon attack, you can use your reaction to increase the attack's velocity, causing the attack's target to take an extra 1d10 damage of the weapon's type. Alternatively, if a creature within 60 feet of you takes damage from a fall, you can use your reaction to increase the fall's damage by 2d10. You can use this feature a number of times equal to your Intelligence modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Event Horizon",
          "level": 14,
          "description": "14th-level Graviturgy Magic feature As an action, you can magically emit a powerful field of gravitational energy that tugs at other creatures for up to 1 minute or until your concentration ends (as if you were concentration on a spell). For the duration, whenever a creature hostile to you starts its turn within 30 feet of you, it must make a Strength saving throw against your spell save DC. On a failed save, it takes 2d10 force damage, and its speed is reduced to 0 until the start of its next turn. On a successful save, it takes half as much damage, and every foot it moves this turn costs 2 extra feet of movement. Once you use this feature, you can't do so again until you finish a long rest",
          "resource": null
        }
      ]
    },
    "Bladesinging": {
      "name": "Bladesinging",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Bladesinging",
          "level": 2,
          "description": "Bladesingers master a tradition of wizardry that incorporates swordplay and dance. Originally created by elves, this tradition has been adopted by non-elf practitioners, who honor and expand on the elven ways. In combat, a bladesinger uses a series of intricate, elegant maneuvers that fend off harm and allow the bladesinger to channel magic into devastating attacks and a cunning defense. Many who have observed a bladesinger at work remember the display as one of the more beautiful experiences in their life, a glorious dance accompanied by a singing blade.",
          "resource": null
        },
        {
          "name": "Bladesinger Styles",
          "level": 2,
          "description": "From its inception as a martial and magical art, Bladesinging has been tied to the sword, more specifically the longsword. Yet many generations of study gave rise to various styles of Bladesinging based on the melee weapon employed. The techniques of these styles are passed from master to students in small schools, some of which have a building dedicated to instruction. Even the newest styles are hundreds of years old, but are still taught by their original creators due to the long lives of elves. Most schools of Bladesinging are in Evermeet or Evereska. One was started in Myth Drannor, but the city's destruction has scattered those students who survived. Styles of Bladesinging are broadly c",
          "resource": null
        },
        {
          "name": "Bladesong",
          "level": 2,
          "description": "Starting at 2nd level, you can invoke a secret elven magic called the Bladesong, provided you aren't wearing medium or heavy armor or using a shield. It graces you with supernatural speed, agility, and focus. You can use a bonus action to start the Bladesong, which lasts for 1 minute. It ends early if you are incapacitated, if you don medium or heavy armor or a shield, or if you use two hands to make an attack with a weapon. You can also dismiss Bladesong at any time you choose (no action required). While your bladesong is active, you gain the following benefits: You gain a bonus to your AC equal to your Intelligence modifier (minimum of +1). Your walking speed increases by 10 feet. You have",
          "resource": null
        },
        {
          "name": "Training in War and Song (Bladesinging)",
          "level": 2,
          "description": "When you adopt this tradition at 2nd level, you gain proficiency with light armor, and you gain proficiency with one type of one-handed melee weapon of your choice. You also gain proficiency in the Performance skill if you don't already have it.",
          "resource": null
        },
        {
          "name": "Extra Attack",
          "level": 6,
          "description": "Starting at 6th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. Moreover, you can cast one of your cantrips in place of one of those attacks.",
          "resource": null
        },
        {
          "name": "Song of Defense",
          "level": 10,
          "description": "Beginning at 10th level, you can direct your magic to absorb damage while your bladesong is active. When you take damage, you can use your reaction to expend one spell slot and reduce that damage to you by an amount equal to five times the spell's slot level.",
          "resource": null
        },
        {
          "name": "Song of Victory",
          "level": 14,
          "description": "Starting at 14th level, you add your Intelligence modifier (minimum of +1) to the damage of your melee weapon attacks while your Bladesong is active.",
          "resource": null
        }
      ]
    },
    "Order of Scribes": {
      "name": "Order of Scribes",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Order of Scribes",
          "level": 2,
          "description": "Magic of the book-that's what many folk call wizardry. The name is apt, given how much time wizards spend poring over tomes and penning theories about the nature of magic. It's rare to see wizards traveling without books and scrolls sprouting from their bags, and a wizard would go to great lengths to plumb an archive of ancient knowledge. Among wizards, the Order of Scribes is the most bookish. It takes many forms in different worlds, but its primary mission is the same everywhere: recording magical discoveries so that wizardry can flourish. And while all wizards value spellbooks, a wizard in the Order of Scribes magically awakens their book, turning it into a trusted companion. All wizards ",
          "resource": null
        },
        {
          "name": "Awakened Spellbook",
          "level": 2,
          "description": "2nd-level Order of Scribes feature Using specially prepared inks and ancient incantations passed down by your wizardly order, you have awakened an arcane sentience within your spellbook. While you are holding the book, it grants you the following benefits: You can use the book as a spellcasting focus for your wizard spells. When you cast a wizard spell with a spell slot, you can temporarily replace its damage type with a type that appears in another spell in your spellbook, which magically alters the spell's formula for this casting only. The latter spell must be of the same level as the spell slot you expend. When you cast a wizard spell as a ritual, you can use the spell's normal casting t",
          "resource": null
        },
        {
          "name": "Wizardly Quill",
          "level": 2,
          "description": "2nd-level Order of Scribes feature As a bonus action, you can magically create a Tiny quill in your free hand. The magic quill has the following properties: The quill doesn't require ink. When you write with it, it produces ink in a color of your choice on the writing surface. The time you must spend to copy a spell into your spellbook equals 2 minutes per spell level if you use the quill for the transcription. You can erase anything you write with the quill if you wave the feather over the text as a bonus action, provided the text is within 5 feet of you. This quill disappears if you create another one or if you die.",
          "resource": null
        },
        {
          "name": "Manifest Mind",
          "level": 6,
          "description": "6th-level Order of Scribes feature You can conjure forth the mind of your Awakened Spellbook. As a bonus action while the book is on your person, you can cause the mind to manifest as a Tiny spectral object, hovering in an unoccupied space of your choice within 60 feet of you. The spectral mind is intangible and doesn't occupy its space, and it sheds dim light in a 10-foot radius. It looks like a ghostly tome, a cascade of text, or a scholar from the past (your choice). While manifested, the spectral mind can hear and see, and it has darkvision with a range of 60 feet. The mind can telepathically share with you what it sees and hears (no action required). Whenever you cast a wizard spell on ",
          "resource": null
        },
        {
          "name": "Master Scrivener",
          "level": 10,
          "description": "10th-level Order of Scribes feature Whenever you finish a long rest, you can create one magic scroll by touching your Wizardly Quill to a blank piece of paper or parchment and causing one spell from your Awakened Spellbook to be copied onto the scroll. The spellbook must be within 5 feet of you when you make the scroll. The chosen spell must be of 1st or 2nd level and must have a casting time of 1 action. Once in the scroll, the spell's power is enhanced, counting as one level higher than normal. You can cast the spell from the scroll by reading it as an action. The scroll is unintelligible to anyone else, and the spell vanishes from the scroll when you cast it or when you finish your next l",
          "resource": null
        },
        {
          "name": "One with the Word",
          "level": 14,
          "description": "14th-level Order of Scribes feature Your connection to your Awakened Spellbook has become so profound that your soul has become entwined with it. While the book is on your person, you have advantage on all Intelligence (Arcana) checks, as the spellbook helps you remember magical lore. Moreover, if you take damage while your spellbook's mind is manifested, you can prevent all of that damage to you by using your reaction to dismiss the spectral mind, using its magic to save yourself. Then roll 3d6. The spellbook temporarily loses spells of your choice that have a combined spell level equal to that roll or higher. For example, if the roll's total is 9, spells vanish from the book that have a co",
          "resource": null
        }
      ]
    },
    "Abjurer": {
      "name": "Abjurer",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Abjurer",
          "level": 3,
          "description": "Shield Companions and Banish Foes Your study of magic is focused on spells that block, banish, or protect—ending harmful effects, banishing evil influences, and protecting the weak. Abjurers are sought when baleful spirits require exorcism, when locations must be guarded against magical spying, and when portals to other planes of existence must be closed. Adventuring parties value Abjurers for the protection they provide against a variety of hostile magic and other attacks.",
          "resource": null
        },
        {
          "name": "Abjuration Savant",
          "level": 3,
          "description": "Choose two , each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Abjuration school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.",
          "resource": null
        },
        {
          "name": "Arcane Ward",
          "level": 3,
          "description": "You can weave magic around yourself for protection. When you cast an Abjuration spell with a spell slot, you can simultaneously use a strand of the spell's magic to create a magical ward on yourself that lasts until you finish a Long Rest. The ward has a Hit Points maximum equal to twice your Wizard level plus your Intelligence modifier. Whenever you take damage, the ward takes the damage instead, and if you have any Resistances or Vulnerabilities, apply them before reducing the ward's Hit Points. If the damage reduces the ward to 0 Hit Points, you take any remaining damage. While the ward has 0 Hit Points, it can't absorb damage, but its magic remains. Whenever you cast an Abjuration spell ",
          "resource": null
        },
        {
          "name": "Projected Ward",
          "level": 6,
          "description": "When a creature that you can see within 30 feet of yourself takes damage, you can take a Reaction to cause your Arcane Ward to absorb that damage. If this damage reduces the ward to 0 Hit Points, the warded creature takes any remaining damage. If that creature has any Resistances or Vulnerabilities, apply them before reducing the ward's Hit Points.",
          "resource": null
        },
        {
          "name": "Spell Breaker",
          "level": 10,
          "description": "You always have the Counterspell and Dispel Magic spells prepared. In addition, you can cast Dispel Magic as a Bonus Action, and you can add your Proficiency to its ability check. When you cast either spell with a spell slot, that slot isn't expended if the spell fails to stop a spell.",
          "resource": null
        },
        {
          "name": "Spell Resistance",
          "level": 14,
          "description": "You have Advantage on saving throws against spells, and you have Resistance to the damage of spells.",
          "resource": null
        }
      ]
    },
    "Diviner": {
      "name": "Diviner",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Diviner",
          "level": 3,
          "description": "Learn the Secrets of the Multiverse The counsel of a Diviner is sought by those who want a clearer understanding of the past, present, and future. As a Diviner, you strive to part the veils of space, time, and consciousness. You work to master spells of discernment, remote viewing, supernatural knowledge, and foresight.",
          "resource": null
        },
        {
          "name": "Divination Savant",
          "level": 3,
          "description": "Choose two , each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one  to your spellbook for free. The chosen spell must be of a level for which you have spell slots.",
          "resource": null
        },
        {
          "name": "Portent",
          "level": 3,
          "description": "Glimpses of the future begin to press on your awareness. Whenever you finish a Long Rest, roll two d20s and record the numbers rolled. You can replace any D20 Test made by you or a creature that you can see with one of these foretelling rolls. You must choose to do so before the roll, and you can replace a roll in this way only once per turn. Each foretelling roll can be used only once. When you finish a Long Rest, you lose any unused foretelling rolls.",
          "resource": null
        },
        {
          "name": "Expert Divination",
          "level": 6,
          "description": "Casting Divination spells comes so easily to you that it expends only a fraction of your spellcasting efforts. When you cast a Divination spell using a level 2+ spell slot, you regain one expended spell slot. The slot you regain must be of a level lower than the slot you expended and can't be higher than level 5.",
          "resource": null
        },
        {
          "name": "The Third Eye",
          "level": 10,
          "description": "You can increase your powers of perception. As a Bonus Action, choose one of the following benefits, which lasts until you start a Short Rest or Long Rest. You can't use this feature again until you finish a Short Rest or Long Rest. Darkvision: You gain Darkvision with a range of 120 feet. Greater Comprehension: You can read any language. See Invisibility: You can cast See Invisibility without expending a spell slot.",
          "resource": null
        },
        {
          "name": "Greater Portent",
          "level": 14,
          "description": "The visions in your dreams intensify and paint a more accurate picture in your mind of what is to come. Roll three d20s for your Portent feature rather than two.",
          "resource": null
        }
      ]
    },
    "Evoker": {
      "name": "Evoker",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Evoker",
          "level": 3,
          "description": "Create Explosive Elemental Effects Your studies focus on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid. Some Evokers find employment in military forces, serving as artillery to blast armies from afar. Others use their power to protect others, while some seek their own gain.",
          "resource": null
        },
        {
          "name": "Evocation Savant",
          "level": 3,
          "description": "Choose two , each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Evocation school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.",
          "resource": null
        },
        {
          "name": "Potent Cantrip",
          "level": 3,
          "description": "Your damaging cantrips affect even creatures that avoid the brunt of the effect. When you cast a cantrip at a creature and you miss with the attack roll or the target succeeds on a saving throw against the cantrip, the target takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip.",
          "resource": null
        },
        {
          "name": "Sculpt Spells",
          "level": 6,
          "description": "You can create pockets of relative safety within the effects of your evocations. When you cast an Evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 plus the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.",
          "resource": null
        },
        {
          "name": "Empowered Evocation",
          "level": 10,
          "description": "Whenever you cast a Wizard spell from the Evocation school, you can add your Intelligence modifier to one damage roll of that spell.",
          "resource": null
        },
        {
          "name": "Overchannel",
          "level": 14,
          "description": "You can increase the power of your spells. When you cast a Wizard spell with a spell slot of levels 1–5 that deals damage, you can deal maximum damage with that spell on the turn you cast it. The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a Long Rest, you take 2d12 Necrotic damage for each level of the spell slot immediately after you cast it. This damage ignores Resistance and Immunity. Each time you use this feature again before finishing a Long Rest, the Necrotic damage per spell level increases by 1d12.",
          "resource": null
        }
      ]
    },
    "Illusionist": {
      "name": "Illusionist",
      "source": "PHB 2024",
      "features": [
        {
          "name": "Illusionist",
          "level": 3,
          "description": "Weave Subtle Spells of Deception You specialize in magic that dazzles the senses and tricks the mind, and the illusions you craft make the impossible seem real.",
          "resource": null
        },
        {
          "name": "Illusion Savant",
          "level": 3,
          "description": "Choose two , each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Illusion school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.",
          "resource": null
        },
        {
          "name": "Improved Illusions",
          "level": 3,
          "description": "You can cast Illusion spells without providing Verbal components, and if an Illusion spell you cast has a range of 10+ feet, the range increases by 60 feet. You also know the Minor Illusion cantrip. If you already know it, you learn a different Wizard cantrip of your choice. The cantrip doesn't count against your number of cantrips known. You can create both a sound and an image with a single casting of Minor Illusion, and you can cast it as a Bonus Action.",
          "resource": null
        },
        {
          "name": "Phantasmal Creatures",
          "level": 6,
          "description": "You always have the Summon Beast and Summon Fey spells prepared. Whenever you cast either spell, you can change its school to Illusion, which causes the summoned creature to appear spectral. You can cast the Illusion version of each spell without expending a spell slot, but casting it without a slot halves the creature's Hit Points. Once you cast either spell without a spell slot, you must finish a Long Rest before you can cast the spell in that way again.",
          "resource": null
        },
        {
          "name": "Illusory Self",
          "level": 10,
          "description": "When a creature hits you with an attack roll, you can take a Reaction to interpose an illusory duplicate of yourself between the attacker and yourself. The attack automatically misses you, then the illusion dissipates. Once you use this feature, you can't use it again until you finish a Short Rest or Long Rest. You can also restore your use of it by expending a level 2+ spell slot (no action required).",
          "resource": null
        },
        {
          "name": "Illusory Reality",
          "level": 14,
          "description": "You have learned to weave shadow magic into your illusions to give them a semi-reality. When you cast an Illusion spell with a spell slot, you can choose one inanimate, nonmagical object that is part of the illusion and make that object real. You can do this on your turn as a Bonus Action while the spell is ongoing. The object remains real for 1 minute, during which it can't deal damage or give any conditions. For example, you can create an illusion of a bridge over a chasm and then make it real and cross it.",
          "resource": null
        }
      ]
    },
    "Bladesinger": {
      "name": "Bladesinger",
      "source": "Heroes of the Frontier",
      "features": [
        {
          "name": "Bladesinger",
          "level": 3,
          "description": "Wield Weapon and Wizardry in Elegant Tandem Bladesingers master a tradition of wizardry that incorporates swordplay and dance. In combat, a Bladesinger uses intricate, elegant maneuvers that fend off harm and allow the Bladesinger to channel magic into devastating attacks and a cunning defense. Many who have observed a Bladesinger at work remember the display as one of the more beautiful experiences in their life—a glorious dance accompanied by a singing blade. Bladesinging is associated with the ancient elven societies that first mastered the art and coined the term. Even today, most Bladesingers still hail from old elven realms, such as Myth Drannor, or from non-elven societies that share ",
          "resource": null
        },
        {
          "name": "Bladesong",
          "level": 3,
          "description": "As a Bonus Action, you invoke an elven magic called the Bladesong, provided you aren't wearing armor or using a Shield. The Bladesong lasts for 1 minute and ends early if you have the Incapacitated condition, if you don armor or a Shield, or if you use two hands to make an attack with a weapon. You can dismiss the Bladesong at any time (no action required). While the Bladesong is active, you gain the following benefits. You can invoke the Bladesong a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. You regain one expended use when you use Arcane Recovery. Agility: You gain a bonus to your AC equal to your Int",
          "resource": null
        },
        {
          "name": "Training in War and Song",
          "level": 3,
          "description": "You gain proficiency with all Melee Martial weapons that don't have the 2H or H property. You can use a Melee weapon with which you have proficiency as a Spellcasting Focus for your Wizard spells. You also gain proficiency in one of the following skills of your choice: Acrobatics, Athletics, Performance, or Persuasion.",
          "resource": null
        },
        {
          "name": "Extra Attack",
          "level": 6,
          "description": "You can attack twice, instead of once, whenever you take the Attack action on your turn. Moreover, you can cast  in place of one of those attacks.",
          "resource": null
        },
        {
          "name": "Song of Defense",
          "level": 10,
          "description": "When you take damage while your Bladesong is active, you can take a Reaction to expend one spell slot and reduce the damage taken by an amount equal to five times the spell slot's level.",
          "resource": null
        },
        {
          "name": "Song of Victory",
          "level": 14,
          "description": "After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.",
          "resource": null
        }
      ]
    }
  },
  "Artificer": {
    "Alchemist": {
      "name": "Alchemist",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Alchemist",
          "level": 3,
          "description": "An Alchemist is an expert at combining reagents to produce mystical effects. Alchemists use their creations to give life and to leech it away. Alchemy is the oldest of artificer traditions, and its versatility has long been valued during times of war and peace.",
          "resource": null
        },
        {
          "name": "Alchemist Spells",
          "level": 3,
          "description": "Starting at 3rd level, you always have certain spells prepared after you reach particular levels in this class, as shown in the Alchemist Spells table. These spells count as artificer spells for you, but they don't count against the number of artificer spells you prepare.",
          "resource": null
        },
        {
          "name": "Experimental Elixir",
          "level": 3,
          "description": "Beginning at 3rd level, whenever you finish a long rest, you can magically produce an experimental elixir in an empty flask you touch. Roll on the Experimental Elixir table for the elixir's effect, which is triggered when someone drinks the elixir. As an action, a creature can drink the elixir or administer it to an incapacitated creature. Creating an experimental elixir requires you to have alchemist's supplies on your person, and any elixir you create with this feature lasts until it is drunk or until the end of your next long rest. When you reach certain levels in this class, you can make more elixirs at the end of a long rest: two at 6th level and three at 15th level. Roll for each elixi",
          "resource": null
        },
        {
          "name": "Tool Proficiency",
          "level": 3,
          "description": "When you adopt this specialization at 3rd level, you gain proficiency with alchemist's supplies. If you already have this proficiency, you gain proficiency with one other type of artisan's tools of your choice.",
          "resource": null
        },
        {
          "name": "Alchemical Savant",
          "level": 5,
          "description": "At 5th level, you develop masterful command of magical chemicals, enhancing the healing and damage you create through them. Whenever you cast a spell using your alchemist's supplies as the spellcasting focus, you gain a bonus to one roll of the spell. That roll must restore hit points or be a damage roll that deals acid, fire, necrotic, or poison damage, and the bonus equals your Intelligence modifier (minimum of +1).",
          "resource": null
        },
        {
          "name": "Restorative Reagents",
          "level": 9,
          "description": "Starting at 9th level, you can incorporate restorative reagents into some of your works: Whenever a creature drinks an experimental elixir you created, the creature gains temporary hit points equal to 2d6 + your Intelligence modifier (minimum of 1 temporary hit point). You can cast lesser restoration without expending a spell slot and without preparing the spell, provided you use alchemist's supplies as the spellcasting focus. You can do so a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Chemical Mastery",
          "level": 15,
          "description": "By 15th level, you have been exposed to so many chemicals that they pose little risk to you, and you can use them to quickly end certain ailments: You gain resistance to acid damage and poison damage, and you are immune to the poisoned condition. You can cast greater restoration and heal without expending a spell slot, without preparing the spell, and without material components, provided you use alchemist's supplies as the spellcasting focus. Once you cast either spell with this feature, you can't cast that spell with it again until you finish a long rest.",
          "resource": null
        }
      ]
    },
    "Armorer": {
      "name": "Armorer",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Armorer",
          "level": 3,
          "description": "An artificer who specializes as an Armorer modifies armor to function almost like a second skin. The armor is enhanced to hone the artificer's magic, unleash potent attacks, and generate a formidable defense. The artificer bonds with this armor, becoming one with it even as they experiment with it and refine its magical capabilities.",
          "resource": null
        },
        {
          "name": "Dampening Field",
          "level": 3,
          "description": "You have advantage on Dexterity (Stealth) checks. If the armor normally imposes disadvantage on such checks, the advantage and disadvantage cancel each other, as normal.",
          "resource": null
        },
        {
          "name": "Defensive Field",
          "level": 3,
          "description": "As a bonus action, you can gain temporary hit points equal to your level in this class, replacing any temporary hit points you already have. You lose these temporary hit points if you doff the armor. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Lightning Launcher",
          "level": 3,
          "description": "A gemlike node appears on one of your armored fists or on the chest (your choice). It counts as a simple ranged weapon, with a normal range of 90 feet and a long range of 300 feet, and it deals 1d6 lightning damage on a hit. Once on each of your turns when you hit a creature with it, you can deal an extra 1d6 lightning damage to that target.",
          "resource": null
        },
        {
          "name": "Powered Steps",
          "level": 3,
          "description": "Your walking speed increases by 5 feet.",
          "resource": null
        },
        {
          "name": "Thunder Gauntlets",
          "level": 3,
          "description": "Each of the armor's gauntlets counts as a simple melee weapon while you aren't holding anything in it, and it deals 1d8 thunder damage on a hit. A creature hit by the gauntlet has disadvantage on attack rolls against targets other than you until the start of your next turn, as the armor magically emits a distracting pulse when the creature attacks someone else.",
          "resource": null
        },
        {
          "name": "Arcane Armor",
          "level": 3,
          "description": "3rd-level Armorer feature Your metallurgical pursuits have led to you making armor a conduit for your magic. As an action, you can turn a suit of armor you are wearing into Arcane Armor, provided you have smith's tools in hand. You gain the following benefits while wearing this armor: If the armor normally has a Strength requirement, the arcane armor lacks this requirement for you. You can use the arcane armor as a spellcasting focus for your artificer spells. The armor attaches to you and can't be removed against your will. It also expands to cover your entire body, although you can retract or deploy the helmet as a bonus action. The armor replaces any missing limbs, functioning identically",
          "resource": null
        },
        {
          "name": "Armor Model",
          "level": 3,
          "description": "3rd-level Armorer feature You can customize your Arcane Armor. When you do so, choose one of the following armor models: Guardian or Infiltrator. The model you choose gives you special benefits while you wear it. Each model includes a special weapon. When you attack with that weapon, you can add your Intelligence modifier, instead of Strength or Dexterity, to the attack and damage rolls. You can change the armor's model whenever you finish a short or long rest, provided you have smith's tools in hand. Guardian: You design your armor to be in the front line of conflict. It has the following features: Infiltrator: You customize your armor for subtle undertakings. It has the following features:",
          "resource": null
        },
        {
          "name": "Armorer Spells",
          "level": 3,
          "description": "3rd-level Armorer feature You always have certain spells prepared after you reach particular levels in this class, as shown in the Armorer Spells table. These spells count as artificer spells for you, but they don't count against the number of artificer spells you prepare.",
          "resource": null
        },
        {
          "name": "Tools of the Trade",
          "level": 3,
          "description": "3rd-level Armorer feature You gain proficiency with heavy armor. You also gain proficiency with smith's tools. If you already have this tool proficiency, you gain proficiency with one other type of artisan's tools of your choice.",
          "resource": null
        },
        {
          "name": "Extra Attack",
          "level": 5,
          "description": "5th-level Armorer feature You can attack twice, rather than once, whenever you take the Attack action on your turn.",
          "resource": null
        },
        {
          "name": "Armor Modifications",
          "level": 9,
          "description": "9th-level Armorer feature You learn how to use your artificer infusions to specially modify your Arcane Armor. That armor now counts as separate items for the purposes of your Infuse Items feature: armor (the chest piece), boots, helmet, and the armor's special weapon. Each of those items can bear one of your infusions, and the infusions transfer over if you change your armor's model with the Armor Model feature. In addition, the maximum number of items you can infuse at once increases by 2, but those extra items must be part of your Arcane Armor.",
          "resource": null
        },
        {
          "name": "Guardian",
          "level": 15,
          "description": "When a Huge or smaller creature you can see ends its turn within 30 feet of you, you can use your reaction to magically force it to make a Strength saving throw against your spell save DC. On a failed save, you pull the creature up to 25 feet directly to an unoccupied space. If you pull the target to a space within 5 feet of you, you can make a melee weapon attack against it as part of this reaction. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses of it when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Infiltrator",
          "level": 15,
          "description": "Any creature that takes lightning damage from your Lightning Launcher glimmers with magical light until the start of your next turn. The glimmering creature sheds dim light in a 5-foot radius, and it has disadvantage on attack rolls against you, as the light jolts it if it attacks you. In addition, the next attack roll against it has advantage, and if that attack hits, the target takes an extra 1d6 lightning damage.",
          "resource": null
        },
        {
          "name": "Perfected Armor",
          "level": 15,
          "description": "15th-level Armorer feature Your Arcane Armor gains additional benefits based on its model, as shown below.",
          "resource": null
        }
      ]
    },
    "Artillerist": {
      "name": "Artillerist",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Artillerist",
          "level": 3,
          "description": "An Artillerist specializes in using magic to hurl energy, projectiles, and explosions on a battlefield. This destructive power was valued by all the armies of the Last War. Now that the war is over, some members of this specialization have sought to build a more peaceful world by using their powers to fight the resurgence of strife in Khorvaire. The gnome artificer Vi, an unlikely yet key member of House Cannith's warforged project, has been especially vocal about making things right: \"It's about time we fixed things instead of blowing them all to hell.\"",
          "resource": null
        },
        {
          "name": "Artillerist Spells",
          "level": 3,
          "description": "Starting at 3rd level, you always have certain spells prepared after you reach particular levels in this class, as shown in the Artillerist Spells table. These spells count as artificer spells for you, but they don't count against the number of artificer spells you prepare.",
          "resource": null
        },
        {
          "name": "Eldritch Cannon",
          "level": 3,
          "description": "At 3rd level, you learn how to create a magical cannon. Using woodcarver's tools or smith's tools, you can take an action to magically create a Small or Tiny eldritch cannon in an unoccupied space on a horizontal surface within 5 feet of you. A Small eldritch cannon occupies its space, and a Tiny one can be held in one hand. Once you create a cannon, you can't do so again until you finish a long rest or until you expend a spell slot of 1st level or higher. You can have only one cannon at a time and can't create one while your cannon is present. The cannon is a magical object. Regardless of size, the cannon has an AC of 18 and a number of hit points equal to five times your artificer level. I",
          "resource": null
        },
        {
          "name": "Tool Proficiency",
          "level": 3,
          "description": "When you adopt this specialization at 3rd level, you gain proficiency with woodcarver's tools. If you already have this proficiency, you gain proficiency with one other type of artisan's tools of your choice.",
          "resource": null
        },
        {
          "name": "Arcane Firearm",
          "level": 5,
          "description": "At 5th level, you know how to turn a wand, staff, or rod into an arcane firearm, a conduit for your destructive spells. When you finish a long rest, you can use woodcarver's tools to carve special sigils into a wand, staff, or rod and thereby turn it into your arcane firearm. The sigils disappear from the object if you later carve them on a different item. The sigils otherwise last indefinitely. You can use your arcane firearm as a spellcasting focus for your artificer spells. When you cast an artificer spell through the firearm, roll a d8, and you gain a bonus to one of the spell's damage rolls equal to the number rolled.",
          "resource": null
        },
        {
          "name": "Explosive Cannon",
          "level": 9,
          "description": "Starting at 9th level, every eldritch cannon you create is more destructive: The cannon's damage rolls all increase by 1d8. As an action, you can command the cannon to detonate if you are within 60 feet of it. Doing so destroys the cannon and forces each creature within 20 feet of it to make a Dexterity saving throw against your spell save DC, taking 3d8 force damage on a failed save or half as much damage on a successful one.",
          "resource": null
        },
        {
          "name": "Fortified Position",
          "level": 15,
          "description": "Starting at 15th level, you're a master at forming well-defended emplacements using Eldritch Cannon: You and your allies have Cover while within 10 feet of a cannon you create with Eldritch Cannon, as a result of a shimmering field of magical protection that the cannon emits. You can now have two cannons at the same time. You can create two with the same action (but not the same spell slot), and you can activate both of them with the same bonus action. You determine whether the cannons are identical to each other or different. You can't create a third cannon while you have two.",
          "resource": null
        }
      ]
    },
    "Battle Smith": {
      "name": "Battle Smith",
      "source": "Tasha's Cauldron",
      "features": [
        {
          "name": "Battle Smith",
          "level": 3,
          "description": "Armies require protection, and someone has to put things back together if defenses fail. A combination of protector and medic, a Battle Smith is an expert at defending others and repairing both material and personnel. To aid in their work, Battle Smiths are usually accompanied by a steel defender, a protective companion of their own creation. Many soldiers tell stories of nearly dying before being saved by a Battle Smith and a steel defender. Battle Smiths played a key role in House Cannith's work on battle constructs and the original warforged, and after the Last War, these artificers led efforts to aid those who were injured in the war's horrific battles.",
          "resource": null
        },
        {
          "name": "Battle Ready",
          "level": 3,
          "description": "When you reach 3rd level, your combat training and your experiments with magic have paid off in two ways: You gain proficiency with . When you attack with a magic weapon, you can use your Intelligence modifier, instead of Strength or Dexterity modifier, for the attack and damage rolls.",
          "resource": null
        },
        {
          "name": "Battle Smith Spells",
          "level": 3,
          "description": "Starting at 3rd level, you always have certain spells prepared after you reach particular levels in this class, as shown in the Battle Smith Spells table. These spells count as artificer spells for you, but they don't count against the number of artificer spells you prepare.",
          "resource": null
        },
        {
          "name": "Steel Defender",
          "level": 3,
          "description": "By 3rd level, your tinkering has borne you a faithful companion, a steel defender. It is friendly to you and your companions, and it obeys your commands. See this creature's game statistics in the steel defender stat block, which uses your proficiency bonus (PB) in several places. You determine the creature's appearance and whether it has two legs or four; your choice has no effect on its game statistics. In combat, the defender shares your initiative count, but it takes its turn immediately after yours. It can move and use its reaction on its own, but the only action it takes on its turn is the Dodge action, unless you take a bonus action on your turn to command it to take another action. T",
          "resource": null
        },
        {
          "name": "Tool Proficiency",
          "level": 3,
          "description": "When you adopt this specialization at 3rd level, you gain proficiency with smith's tools. If you already have this proficiency, you gain proficiency with one other type of artisan's tools of your choice.",
          "resource": null
        },
        {
          "name": "Extra Attack",
          "level": 5,
          "description": "Starting at 5th level, you can attack twice, rather than once, whenever you take the Attack action on your turn.",
          "resource": null
        },
        {
          "name": "Arcane Jolt",
          "level": 9,
          "description": "At 9th level, you learn new ways to channel arcane energy to harm or heal. When either you hit a target with a magic weapon attack or your steel defender hits a target, you can channel magical energy through the strike to create one of the following effects: The target takes an extra 2d6 force damage. Choose one creature or object you can see within 30 feet of the target. Healing energy flows into the chosen recipient, restoring 2d6 hit points to it. You can use this energy a number of times equal to your Intelligence modifier (minimum of once), but you can do so no more than once on a turn. You regain all expended uses when you finish a long rest.",
          "resource": null
        },
        {
          "name": "Improved Defender",
          "level": 15,
          "description": "At 15th level, your Arcane Jolt and steel defender become more powerful: The extra damage and the healing of your Arcane Jolt both increase to 4d6. Your steel defender gains a +2 bonus to Armor Class. Whenever your steel defender uses its Deflect Attack, the attacker takes force damage equal to 1d4 + your Intelligence modifier.",
          "resource": null
        }
      ]
    },
    "Cartographer": {
      "name": "Cartographer",
      "source": "EFA",
      "features": [
        {
          "name": "Adventurer's Atlas",
          "level": 3,
          "description": "Whenever you finish a Long Rest while holding Cartographer's Tools, you can use that tool to create a set of magical maps by touching at least two creatures (one of whom can be yourself), up to a maximum number of creatures equal to 1 plus your Intelligence modifier (minimum of two creatures). Each target receives a magical map, which constantly updates to show the relative position of all the map holders but is illegible to all others. The maps last until you die or until you use this feature again, at which point any existing maps created by this feature immediately vanish. While carrying the map, a target gains the following benefits. Awareness: The target adds 1d4 to its Initiative rolls",
          "resource": null
        },
        {
          "name": "Cartographer",
          "level": 3,
          "description": "Chart Advantageous Courses through Turmoil Cartographers are the premier navigators and reconnaissance agents. Using their creations, Cartographers can highlight threats, safeguard allies, and carve portals to distant locations.",
          "resource": null
        },
        {
          "name": "Cartographer Spells",
          "level": 3,
          "description": "When you reach an Artificer level specified in the Cartographer Spells table, you thereafter always have the listed spells prepared.",
          "resource": null
        },
        {
          "name": "Mapping Magic",
          "level": 3,
          "description": "You gain the following benefits. Illuminated Cartography: You can cast Faerie Fire without expending a spell slot, outlining the affected creatures as if in ink. You can do so a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. Portal Jump: On your turn, you can spend an amount of movement equal to half your Speed (round down) to teleport to an unoccupied space you can see within 10 feet of yourself or within 5 feet of a creature that is within 30 feet of you and holding one of your Adventurer's Atlas maps. You can't use this benefit if your Speed is 0.",
          "resource": null
        },
        {
          "name": "Tools of the Trade",
          "level": 3,
          "description": "You gain the following benefits. Tool Proficiency: You gain proficiency with Calligrapher's Supplies and Cartographer's Tools. If you already have one of these proficiencies, you gain proficiency with one other type of Artisan's Tools of your choice (or with two other types if you have both). Scroll Crafting: When you scribe a Spell Scroll using the crafting rules in the , the amount of time required to craft it is halved.",
          "resource": null
        },
        {
          "name": "Guided Precision",
          "level": 5,
          "description": "Once per turn, whenever you cast a spell from your Cartographer Spells list or hit a creature affected by your Faerie Fire with an attack roll, you can add your Intelligence modifier to one damage roll of the spell or attack. In addition, taking damage can't cause you to lose Concentration on Faerie Fire.",
          "resource": null
        },
        {
          "name": "Ingenious Movement",
          "level": 9,
          "description": "When you use your Flash of Genius, you or a willing creature of your choice that you can see within 30 feet of yourself can teleport up to 30 feet to an unoccupied space you can see as part of that same Reaction.",
          "resource": null
        },
        {
          "name": "Superior Atlas",
          "level": 15,
          "description": "Your Adventurer's Atlas improves, gaining the following benefits. Safe Haven: When a map holder would be reduced to 0 Hit Points but not killed outright, that creature can destroy its map. The creature's Hit Points instead change to a number equal to twice your Artificer level, and the creature is teleported to an unoccupied space within 5 feet of you or another map holder of its choice. Unerring Path: If you are one of the map holders for your Adventurer's Atlas, you can cast Find the Path without expending a spell slot, without preparing the spell, and without needing spell components. Once you use this benefit, you can't use it again until you finish a Long Rest.",
          "resource": null
        }
      ]
    }
  }
};
