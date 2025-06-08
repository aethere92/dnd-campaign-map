const CAMPAIGN_002_METADATA = {
	BONNIE: {
		abilityScores: [
			{ name: 'Strength', abbr: 'str', score: '-1', value: '8' },
			{ name: 'Dexterity', abbr: 'dex', score: '+4', value: '19' },
			{ name: 'Constitution', abbr: 'con', score: '+2', value: '14' },
			{ name: 'Intelligence', abbr: 'int', score: '+2', value: '14' },
			{ name: 'Wisdom', abbr: 'wis', score: '+0', value: '10' },
			{ name: 'Charisma', abbr: 'cha', score: '+1', value: '12' },
		],
		savingThrows: [
			{ name: 'str', value: '-1' },
			{ name: 'dex', value: '+7' },
			{ name: 'con', value: '+2' },
			{ name: 'int', value: '+5' },
			{ name: 'wis', value: '+0' },
			{ name: 'cha', value: '+1' },
		],
		spellData: [
			{
				groupName: 'Cantrip',
				spells: [
					{
						spellInfo: { spellName: 'Druidcraft', spellMetaInfo: 'Fairy Magic' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Utility',
					},
					{
						spellInfo: { spellName: 'Green-Flame Blade', spellMetaInfo: 'Rogue' },
						range: 'Self',
						slotType: '1A',
						effect: '1d8*',
					},
					{
						spellInfo: { spellName: 'Mage Hand', spellMetaInfo: 'Mage Hand Legerdemain' },
						range: '30ft.',
						slotType: '1BA',
						effect: 'Utility',
					},
					{
						spellInfo: { spellName: 'Message', spellMetaInfo: 'Rogue' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Communication*',
					},
				],
			},
			{
				groupName: '1st Level',
				spells: [
					{
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Rogue' },
						range: 'Self',
						slotType: '1R',
						effect: '1d6*',
					},
					{
						spellInfo: { spellName: 'Comprehend Languages', spellMetaInfo: 'Rogue' },
						range: 'Self',
						slotType: '1A',
						effect: 'Social',
					},
					{
						spellInfo: { spellName: 'Faerie Fire', spellMetaInfo: 'Fairy Magic' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Invisible',
					},
					{
						spellInfo: { spellName: 'Find Familiar', spellMetaInfo: 'Rogue' },
						range: '10ft.',
						slotType: '1h',
						effect: 'Summoning',
					},
					{
						spellInfo: { spellName: 'Shield', spellMetaInfo: 'Rogue' },
						range: 'Self',
						slotType: '1R',
						effect: 'Warding',
					},
				],
			},
			{
				groupName: '2nd Level',
				spells: [
					{
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Rogue' },
						range: 'Self',
						slotType: '1R',
						effect: '2d6*',
					},
					{
						spellInfo: { spellName: 'Enlarge/Reduce', spellMetaInfo: 'Fairy Magic' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Misty Step', spellMetaInfo: 'Rogue' },
						range: 'Self',
						slotType: '1BA',
						effect: 'Teleportation',
					},
				],
			},
		],
		actionData: [
			{ name: 'Invisibility ' },
			{
				name: 'Nick (Dagger) ',
				description:
					'Nick. When you make the extra attack of the Light property, you can make it as part of the Attack action instead of as a Bonus Action. This extra attack can only be made once per turn.',
			},
			{
				name: 'Unarmed Strike ',
				description:
					'You make a melee attack that involves using your body to deal one of the following effects:Damage. You make an attack roll against the creature, and on a hit, you deal 1 + STR Bludgeoning damage.Grapple. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or it has the Grappled condition.Shove. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or you can either push it 5 ft. away or cause it to have the Prone condition.',
			},
			{
				name: 'Vex (Shortsword) ',
				description:
					'Vex. If you hit a creature with a Shortsword and deal damage to it, you have Advantage on your next attack roll against that creature before the end of your next turn.',
			},
			{
				name: 'Cunning Action ',
				description:
					'On your turn, you can take one of the following actions as a Bonus Actions: Dash, Disengage, or Hide.',
			},
			{
				name: 'Steady Aim ',
				description:
					'You give yourself Advantage on your next attack roll on the current turn, provided that you haven’t moved during this turn. After you use it, your Speed is 0 until the end of the current turn.',
			},
			{
				name: 'Uncanny Dodge ',
				description:
					'When an attacker you can see hits you with an attack, you can take a Reaction to halve the attack’s damage against you (round down).',
			},
			{
				name: 'Sneak Attack (Special)',
				description:
					'Once per turn you can deal an extra 4d6 damage to one creature you hit with an attack if you have Advantage on the roll and the attack uses a Finesse or Ranged weapon. The extra damage’s type is the same as the weapon’s type.You don’t need Advantage on the attack if at least one of your allies is within 5 ft. of the target, the ally doesn’t have the Incapacitated condition, and you don’t have Disadvantage on the attack roll.',
			},
			{
				name: 'Sneak Attack: Poison (Cost: 1d6) (No Action)',
				description:
					'You add a toxin to your strike, forcing the target to make a DC 15 Con. saving throw. On a failed save, the target has the Poisoned condition for 1 minute, and at the end of each of its turns, the Poisoned target repeats the save, ending the effect on itself on a success. You must have a Poisoner’s Kit on your person to use this effect.',
			},
			{
				name: 'Sneak Attack: Trip (Cost: 1d6) (No Action)',
				description:
					'If the target is Large or smaller, it must succeed on a DC 15 Dex. saving throw or have the Prone condition.',
			},
			{
				name: 'Sneak Attack: Withdraw (Cost: 1d6) (No Action)',
				description:
					'Immediately after the attack, you move up to half your Speed without provoking Opportunity Attacks.',
			},
		],
		features: [
			{ name: 'Core Rogue Traits' },
			{ name: 'Expertise', description: 'You gain Expertise in two of your skill proficiencies of your choice.' },
			{
				name: 'Sneak Attack',
				description:
					'Once per turn you can deal an extra 4d6 damage to one creature you hit with an attack if you have Advantage on the roll and the attack uses a Finesse or Ranged weapon. The extra damage’s type is the same as the weapon’s type.',
			},
			{ name: 'Thieves’ Cant', description: 'You know Thieves’ Cant and one other language of your choice.' },
			{
				name: 'Weapon Mastery',
				description:
					'Vex. If you hit a creature with a Shortsword and deal damage to it, you have Advantage on your next attack roll against that creature before the end of your next turn.',
			},
			{
				name: 'Cunning Action',
				description:
					'On your turn, you can take one of the following actions as a Bonus Actions: Dash, Disengage, or Hide.',
			},
			{ name: 'Rogue Subclass' },
			{
				name: 'Steady Aim',
				description:
					'As a Bonus Action, you give yourself Advantage on your next attack roll on the current turn, provided that you haven’t moved during this turn. After you use it, your Speed is 0 until the end of the current turn.',
			},
			{ name: 'Spellcasting' },
			{
				name: 'Mage Hand Legerdemain',
				description:
					'When you cast Mage Hand, you can cast it as a Bonus Action, and make it Invisible. You can control the hand as a Bonus Action, and through it, you can make Dexterity (Sleight of Hand) checks.',
			},
			{ name: 'Ability Score Improvement' },
			{
				name: 'Cunning Strike',
				description:
					'When you deal Sneak Attack damage you can add one of the following Cunning Strike effects. Each effect has a die cost, which is the number of Sneak Attack damage dice you must forgo to add the effect. You remove the die before rolling, and the effect occurs immediately after the attack’s damage is dealt.',
			},
			{
				name: 'Uncanny Dodge',
				description:
					'When an attacker you can see hits you with an attack, you can take a Reaction to halve the attack’s damage against you (round down).',
			},
			{
				name: '6: Expertise',
				description: 'You gain Expertise in two more of your skill proficiencies of your choice.',
			},
			{
				name: 'Evasion',
				description:
					'When you’re subjected to an effect that allows you to make a Dex. saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. You can’t use this feature if you have the Incapacitated condition.',
			},
			{
				name: 'Reliable Talent',
				description:
					'Whenever you make an ability check that uses one of your skill or tool proficiencies, you can treat a d20 roll of 9 or lower as a 10.',
			},
			{
				name: 'Fairy Magic',
				description:
					' You know the Druidcraft cantrip. Starting at 3rd level, you can cast the Faerie Fire spell with this trait. Starting at 5th level, you can also cast the Enlarge/Reduce spell with this trait.',
			},
			{
				name: 'Hidden Tricksters.',
				description: 'Your innate magic helps you stay hidden from the dark creatures of the world.',
			},
			{ name: 'Ability Score Improvement', description: 'Increase one ability score by 2 or two ability scores by 1.' },
		],
		healthPoints: '50',
		armorClass: '16',
		walkingSpeed: '30ft.',
	},
	KAEDIN: {
		abilityScores: [
			{ name: 'Strength', abbr: 'str', score: '+4', value: '18' },
			{ name: 'Dexterity', abbr: 'dex', score: '+1', value: '12' },
			{ name: 'Constitution', abbr: 'con', score: '+3', value: '16' },
			{ name: 'Intelligence', abbr: 'int', score: '+0', value: '10' },
			{ name: 'Wisdom', abbr: 'wis', score: '+1', value: '13' },
			{ name: 'Charisma', abbr: 'cha', score: '-1', value: '8' },
		],
		savingThrows: [
			{ name: 'str', value: '+7' },
			{ name: 'dex', value: '+1' },
			{ name: 'con', value: '+6' },
			{ name: 'int', value: '+0' },
			{ name: 'wis', value: '+1' },
			{ name: 'cha', value: '-1' },
		],
		spellData: [
			{
				groupName: '2nd Level',
				spells: [
					{
						spellInfo: { spellName: 'Pass without Trace', spellMetaInfo: 'Legacy | Merge with Stone' },
						range: 'Self',
						slotType: '1A',
						effect: 'Buff*',
					},
				],
			},
		],
		actionData: [
			{
				name: 'Cleave (Greataxe) ',
				description:
					'Cleave. Once per turn, if you hit a creature with a melee attack using a Greataxe, you can make another melee attack with it against a second creature within 5 ft. of the first that’s within your reach. On a hit, the second creature takes the Greataxe’s damage, but without your ability modifier (unless the modifier is negative).',
			},
			{
				name: 'Cleave (Halberd) ',
				description:
					'Cleave. Once per turn, if you hit a creature with a melee attack using a Halberd, you can make another melee attack with it against a second creature within 5 ft. of the first that’s within your reach. On a hit, the second creature takes the Halberd’s damage, but without your ability modifier (unless the modifier is negative).',
			},
			{
				name: 'Echo Avatar ',
				description:
					'As an Action, you temporarily transfer your consciousness to your echo allowing you to see through your echo’s eyes and hear through its ears. For up to 10 minutes or until you cancel it (requires no action), you are deafened and blinded however, while your echo is being used in this way, it can be up to 1,000 feet away from you without being destroyed.',
			},
			{
				name: 'Graze (Glaive) ',
				description:
					'Graze. If your attack roll with a Glaive misses a creature, you can deal damage to it equal to the ability modifier used to make the attack. This damage is the same type dealt by the Glaive, and can only be increased by increasing the ability modifier.',
			},
			{
				name: 'Graze (Greatsword) ',
				description:
					'Graze. If your attack roll with a Greatsword misses a creature, you can deal damage to it equal to the ability modifier used to make the attack. This damage is the same type dealt by the Greatsword, and can only be increased by increasing the ability modifier.',
			},
			{
				name: 'Heavy Weapon Mastery ',
				description:
					'When you hit a creature with a weapon that has the Heavy property as part of the Attack action on your turn, you can cause the weapon to deal extra 3 damage to the target.',
			},
			{
				name: 'Unarmed Strike ',
				description:
					'You make a melee attack that involves using your body to deal one of the following effects:Damage. You make an attack roll against the creature, and on a hit, you deal 1 + STR Bludgeoning damage.Grapple. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or it has the Grappled condition.Shove. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or you can either push it 5 ft. away or cause it to have the Prone condition.',
			},
			{
				name: 'Hew ',
				description:
					'Immediately after you score a Critical Hit with a Melee weapon or reduce a creature to 0 Hit Points with one, you can make one attack with the same weapon as a Bonus Action.',
			},
			{
				name: 'Manifest Echo ',
				description:
					'As a Bonus Action, you magically coalesce dunamis into an echo of yourself that appears in an unoccupied space you can see within 15 ft. The echo lasts until it is destroyed by damage, it is more than 30 ft. from you at the end of your turn, you dismiss it as a Bonus Action, you manifest another echo, or until you are incapacitated.The echo has AC 17, 1 hit point, and immunity to all conditions. If it makes a saving throw, it uses your bonuses for the roll. At all times it is the same size as you and occupies its space.',
			},
			{
				name: 'Manifest Echo: Step ',
				description:
					'As a Bonus Action, you magically swap places with your echo at a cost of 15 ft. of your movement, regardless of the distance travelled.',
			},
			{
				name: 'Second Wind ',
				description:
					'You can draw upon a limited well of physical and mental stamina and regain 1d10+7 HP.You can use this 3 times per Long Rest, and can regain one expended use when you finish a Short Rest.',
			},
			{
				name: 'Second Wind: Tactical Shift ',
				description:
					'Whenever you activate your Second Wind with a Bonus Action, you can move up to half your Speed without provoking Opportunity Attacks.',
			},
			{
				name: 'Manifest Echo: React ',
				description:
					"When a creature that you can see would provoke an Opportunity Attack from your echo, you can use your reaction to make an Opportunity Attack as if you were in the echo's space.",
			},
			{
				name: 'Action Surge (Special)',
				description:
					'On your turn you can take one additional action, except the Magic action.You can use this feature 1 time(s) until you finish a Short or Long Rest.',
			},
			{
				name: 'Manifest Echo: Command (Special)',
				description: 'You mentally command your echo to move up to 30 feet in any direction (no action required).',
			},
			{
				name: 'Manifest Echo: Strike (Special)',
				description:
					"When you take the Attack action, any attack you make can originate from either your space or the echo's. You make this choice with each attack.",
			},
			{
				name: 'Tactical Mind (Special)',
				description:
					'When you fail an ability check, you can expend a use of Second Wind, and instead of regaining HP, you roll 1d10 and add the result to the ability check. If the check still fails, this use of Second Wind isn’t expended.',
			},
			{
				name: 'Unleash Incarnation (Special)',
				description:
					'You can heighten your echo’s fury. Whenever you take the Attack Action, you can make one additional melee attack from the echo’s position.You can use this feature 3 time(s) per Long Rest.',
			},
		],
		features: [
			{ name: 'Core Fighter Traits' },
			{
				name: 'Fighting Style',
				description:
					'You gain a Fighting Style feat of your choice, and whenever you gain a Fighter level, you can replace the feat you chose with a different Fighting Style feat.',
			},
			{
				name: 'Second Wind',
				description:
					'As a Bonus Action, you can draw upon a limited well of physical and mental stamina and regain 1d10+7 HP.',
			},
			{
				name: 'Weapon Mastery',
				description:
					'Graze. If your attack roll with a Greatsword misses a creature, you can deal damage to it equal to the ability modifier used to make the attack. This damage is the same type dealt by the Greatsword, and can only be increased by increasing the ability modifier.',
			},
			{
				name: 'Action Surge',
				description: 'On your turn you can take one additional action, except the Magic action.',
			},
			{
				name: 'Tactical Mind',
				description:
					'When you fail an ability check, you can expend a use of Second Wind, and instead of regaining HP, you roll 1d10 and add the result to the ability check. If the check still fails, this use of Second Wind isn’t expended.',
			},
			{ name: 'Fighter Subclass' },
			{
				name: 'Manifest Echo',
				description:
					'As a Bonus Action, you magically coalesce dunamis into an echo of yourself that appears in an unoccupied space you can see within 15 ft. The echo lasts until it is destroyed by damage, it is more than 30 ft. from you at the end of your turn, you dismiss it as a Bonus Action, you manifest another echo, or until you are incapacitated.',
			},
			{
				name: 'Unleash Incarnation',
				description:
					'Whenever you take the Attack action, you can make one additional melee attack from the echo’s position.',
			},
			{
				name: '4: Weapon Mastery',
				description:
					'Cleave. Once per turn, if you hit a creature with a melee attack using a Halberd, you can make another melee attack with it against a second creature within 5 ft. of the first that’s within your reach. On a hit, the second creature takes the Halberd’s damage, but without your ability modifier (unless the modifier is negative).',
			},
			{ name: 'Ability Score Improvement' },
			{
				name: 'Extra Attack',
				description: 'You can attack 2 times instead of once whenever you take the Attack action on your turn.',
			},
			{
				name: 'Tactical Shift',
				description:
					'Whenever you activate your Second Wind with a Bonus Action, you can move up to half your Speed without provoking Opportunity Attacks.',
			},
			{ name: '6: Ability Score Improvement' },
			{
				name: 'Echo Avatar',
				description:
					'As an Action, you temporarily transfer your consciousness to your echo allowing you to see through your echo’s eyes and hear through its ears. For up to 10 minutes or until you cancel it (requires no action), you are deafened and blinded however, while your echo is being used in this way, it can be up to 1,000 feet away from you without being destroyed.',
			},
			{
				name: 'Earth Walk',
				description: 'You can move across difficult terrain made of earth or stone without expending extra movement.',
			},
			{
				name: 'Merge with Stone',
				description:
					'You can cast pass without trace (w/o material components) once per long rest. CON is your spellcasting ability.',
			},
			{
				name: 'Great Weapon Fighting',
				description:
					'When you roll damage for an attack you make with a Melee weapon that has the Two-Handed or Versatile properties, you can treat any 1 or 2 on a damage die as a 3.',
			},
			{ name: 'Sentinel', description: 'Ability Score Increase. Increase your Str. or Dex. by 1.' },
			{ name: 'Great Weapon Master', description: 'Ability Score Increase.  Your Str. is increased by 1.' },
			{
				name: 'Savage Attacker',
				description:
					'Once per turn when you hit a target with a weapon, you can roll the weapon’s damage dice twice and use either roll against the target.',
			},
		],
		healthPoints: '67',
		armorClass: '16',
		walkingSpeed: '30ft.',
	},
	SOSHI: {
		abilityScores: [
			{ name: 'Strength', abbr: 'str', score: '-1', value: '8' },
			{ name: 'Dexterity', abbr: 'dex', score: '+2', value: '15' },
			{ name: 'Constitution', abbr: 'con', score: '+3', value: '16' },
			{ name: 'Intelligence', abbr: 'int', score: '+2', value: '15' },
			{ name: 'Wisdom', abbr: 'wis', score: '+1', value: '12' },
			{ name: 'Charisma', abbr: 'cha', score: '+0', value: '10' },
		],
		savingThrows: [
			{ name: 'str', value: '-1' },
			{ name: 'dex', value: '+2' },
			{ name: 'con', value: '+6' },
			{ name: 'int', value: '+5' },
			{ name: 'wis', value: '+4' },
			{ name: 'cha', value: '+0' },
		],
		spellData: [
			{
				groupName: 'Cantrip',
				spells: [
					{
						spellInfo: { spellName: 'Acid Splash', spellMetaInfo: 'Wizard' },
						range: '60ft.',
						slotType: '1A',
						effect: '2d6',
					},
					{
						spellInfo: { spellName: 'Booming Blade', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1A',
						effect: '1d8*',
					},
					{
						spellInfo: { spellName: 'Chill Touch', spellMetaInfo: 'Wizard' },
						range: 'Touch',
						slotType: '1A',
						effect: '2d10',
					},
					{
						spellInfo: { spellName: 'Elementalism', spellMetaInfo: 'Magic Initiate (Wizard)' },
						range: '30ft.',
						slotType: '1A',
						effect: '',
					},
					{
						spellInfo: { spellName: 'Fire Bolt', spellMetaInfo: 'Evocation Savant' },
						range: '120ft.',
						slotType: '1A',
						effect: '2d10',
					},
					{
						spellInfo: { spellName: 'Poison Spray', spellMetaInfo: 'Magic Initiate (Wizard)' },
						range: '30ft.',
						slotType: '1A',
						effect: '2d12',
					},
					{
						spellInfo: { spellName: 'Ray of Frost', spellMetaInfo: 'Wizard' },
						range: '60ft.',
						slotType: '1A',
						effect: '2d8',
					},
				],
			},
			{
				groupName: '1st Level',
				spells: [
					{
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1R',
						effect: '1d6*',
					},
					{
						spellInfo: { spellName: 'Mage Armor', spellMetaInfo: 'Wizard' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Mage Armor', spellMetaInfo: 'Magic Initiate (Wizard)' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Shield', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1R',
						effect: 'Warding',
					},
				],
			},
			{
				groupName: '2nd Level',
				spells: [
					{
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1R',
						effect: '2d6*',
					},
					{
						spellInfo: { spellName: 'Detect Thoughts', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1A',
						effect: 'Social*',
					},
					{
						spellInfo: { spellName: 'Mirror Image', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1A',
						effect: 'Deception*',
					},
					{
						spellInfo: { spellName: 'Misty Step', spellMetaInfo: 'Legacy | Fey Step' },
						range: 'Self',
						slotType: '1BA',
						effect: 'Teleportation',
					},
					{
						spellInfo: { spellName: 'Scorching Ray', spellMetaInfo: 'Evocation Savant' },
						range: '120ft.',
						slotType: '1A',
						effect: '2d6',
					},
					{
						spellInfo: { spellName: 'See Invisibility', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1A',
						effect: 'Detection',
					},
				],
			},
			{
				groupName: '3rd Level',
				spells: [
					{
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1R',
						effect: '3d6*',
					},
					{
						spellInfo: { spellName: 'Blink', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1A',
						effect: 'Utility',
					},
					{
						spellInfo: { spellName: 'Dispel Magic', spellMetaInfo: 'Wizard' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Control',
					},
					{
						spellInfo: { spellName: 'Fireball', spellMetaInfo: 'Wizard' },
						range: '150ft.',
						slotType: '1A',
						effect: '8d6',
					},
					{
						spellInfo: { spellName: 'Fly', spellMetaInfo: 'Wizard' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Movement',
					},
					{
						spellInfo: { spellName: 'Scorching Ray', spellMetaInfo: 'Evocation Savant' },
						range: '120ft.',
						slotType: '1A',
						effect: '2d6',
					},
				],
			},
			{
				groupName: '4th Level',
				spells: [
					{
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Wizard' },
						range: 'Self',
						slotType: '1R',
						effect: '4d6*',
					},
					{
						spellInfo: { spellName: 'Dispel Magic', spellMetaInfo: 'Wizard' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Control',
					},
					{
						spellInfo: { spellName: 'Fireball', spellMetaInfo: 'Wizard' },
						range: '150ft.',
						slotType: '1A',
						effect: '9d6',
					},
					{
						spellInfo: { spellName: 'Fly', spellMetaInfo: 'Wizard' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Movement',
					},
					{
						spellInfo: { spellName: 'Polymorph', spellMetaInfo: 'Wizard' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Control*',
					},
					{
						spellInfo: { spellName: 'Scorching Ray', spellMetaInfo: 'Evocation Savant' },
						range: '120ft.',
						slotType: '1A',
						effect: '2d6',
					},
				],
			},
		],
		actionData: [
			{
				name: 'Unarmed Strike ',
				description:
					'You make a melee attack that involves using your body to deal one of the following effects:Damage. You make an attack roll against the creature, and on a hit, you deal 1 + STR Bludgeoning damage.Grapple. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or it has the Grappled condition.Shove. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or you can either push it 5 ft. away or cause it to have the Prone condition.',
			},
			{
				name: 'Arcane Recovery (Special)',
				description:
					'Once per Long Rest, whenever you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level up to 4.',
			},
			{ name: 'Elemental Acuity Stacks (No Action)' },
			{
				name: 'Sculpt Spells (Special)',
				description:
					'When you cast an Evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell’s level. The chosen creatures automatically succeed on their saving throws, and take no damage if they would normally take half on a successful save.',
			},
		],
		features: [
			{ name: 'Core Wizard Traits' },
			{ name: 'Spellcasting' },
			{ name: 'Ritual Adept' },
			{
				name: 'Arcane Recovery',
				description:
					'When you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level equal to 4, but none of the slots can be level 6 or higher.',
			},
			{
				name: 'Scholar',
				description: 'You can choose one of the skills in which you’re proficient and gain Expertise in it.',
			},
			{ name: 'Wizard Subclass' },
			{
				name: 'Evocation Savant',
				description:
					'Choose two Evocation spells, each of which must not be higher than level 2, and add them to your spellbook for free.',
			},
			{
				name: 'Potent Cantrip',
				description:
					'When you cast a cantrip at a creature and you miss with the attack roll or the target succeeds on the saving throw, the target takes half the damage (if any) but suffers no additional effect.',
			},
			{ name: 'Ability Score Improvement' },
			{
				name: 'Memorize Spell',
				description:
					'Whenever you finish a Short Rest, you can study your spellbook and replace one of the level 1+ Wizard spells with another level 1+ spell.',
			},
			{
				name: 'Sculpt Spells',
				description:
					'When you cast an Evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell’s level. The chosen creatures automatically succeed on their saving throws, and take no damage if they would normally take half on a successful save.',
			},
			{ name: 'Darkvision', description: 'You can see in darkness (shades of gray) up to 60 ft.' },
			{ name: 'Keen Senses', description: 'You have proficiency in the Perception skill.' },
			{
				name: 'Fey Ancestry',
				description: 'You have advantage on saves against being charmed, and magic can’t put you to sleep.',
			},
			{
				name: 'Trance',
				description:
					"You don't need to sleep, but meditate semiconsciously for 4 hours a day. While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.",
			},
			{
				name: 'Elf Weapon Training',
				description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.',
			},
			{ name: 'Fey Step', description: 'Once per short rest, you can cast the misty step spell.' },
			{
				name: 'Resilient',
				description:
					'Ability Score Increase.  Choose one ability in which you lack saving throw proficiency and increase the chosen ability score by 1.',
			},
			{
				name: 'Magic Initiate (Wizard)',
				description:
					"Two Cantrips. You learn two cantrips of your choice from the Wizard spell list. Int., Wis., or Cha. is your spellcasting ability for this feat's spells.",
			},
			{
				name: 'Elemental Acuity Reservoir',
				description:
					'Gain 1d4 of same element added to next damaging attack whenever 15 elemental damage is dealt within 15ft of you by an ally. Stackable.',
			},
		],
		healthPoints: '51',
		armorClass: '12',
		walkingSpeed: '30ft.',
	},
	NORR: {
		abilityScores: [
			{ name: 'Strength', abbr: 'str', score: '-1', value: '8' },
			{ name: 'Dexterity', abbr: 'dex', score: '+2', value: '14' },
			{ name: 'Constitution', abbr: 'con', score: '+2', value: '14' },
			{ name: 'Intelligence', abbr: 'int', score: '+0', value: '10' },
			{ name: 'Wisdom', abbr: 'wis', score: '+1', value: '12' },
			{ name: 'Charisma', abbr: 'cha', score: '+4', value: '18' },
		],
		savingThrows: [
			{ name: 'str', value: '-1' },
			{ name: 'dex', value: '+2' },
			{ name: 'con', value: '+5' },
			{ name: 'int', value: '+0' },
			{ name: 'wis', value: '+1' },
			{ name: 'cha', value: '+7' },
		],
		spellData: [
			{
				groupName: 'Cantrip',
				spells: [
					{
						spellInfo: { spellName: 'Fire Bolt', spellMetaInfo: 'Sorcerer' },
						range: '120ft.',
						slotType: '1A',
						effect: '2d10',
					},
					{
						spellInfo: { spellName: 'Friends', spellMetaInfo: 'Sorcerer' },
						range: '10ft.',
						slotType: '1A',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Guidance', spellMetaInfo: 'Magic Initiate (Cleric)' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Light', spellMetaInfo: 'Magic Initiate (Cleric)' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Creation*',
					},
					{
						spellInfo: { spellName: 'Mending', spellMetaInfo: 'Sorcerer' },
						range: 'Touch',
						slotType: '1m',
						effect: 'Utility',
					},
					{
						spellInfo: { spellName: 'Message', spellMetaInfo: 'Sorcerer' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Communication*',
					},
					{
						spellInfo: { spellName: 'Sorcerous Burst', spellMetaInfo: 'Sorcerer' },
						range: '120ft.',
						slotType: '1A',
						effect: '2d8*',
					},
				],
			},
			{
				groupName: '1st Level',
				spells: [
					{
						spellInfo: { spellName: 'Chromatic Orb', spellMetaInfo: 'Draconic Spells' },
						range: '90ft.',
						slotType: '1A',
						effect: '3d8*',
					},
					{
						spellInfo: { spellName: 'Command', spellMetaInfo: 'Draconic Spells' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Prone',
					},
					{
						spellInfo: { spellName: 'Create or Destroy Water', spellMetaInfo: 'Magic Initiate (Cleric)' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Creation',
					},
					{
						spellInfo: { spellName: 'Grease', spellMetaInfo: 'Sorcerer' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Prone',
					},
					{
						spellInfo: { spellName: 'Shield', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1R',
						effect: 'Warding',
					},
				],
			},
			{
				groupName: '2nd Level',
				spells: [
					{
						spellInfo: { spellName: 'Alter Self', spellMetaInfo: 'Draconic Spells' },
						range: 'Self',
						slotType: '1A',
						effect: 'Shapechanging',
					},
					{
						spellInfo: { spellName: 'Chromatic Orb', spellMetaInfo: 'Draconic Spells' },
						range: '90ft.',
						slotType: '1A',
						effect: '4d8*',
					},
					{
						spellInfo: { spellName: 'Command', spellMetaInfo: 'Draconic Spells' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Prone',
					},
					{
						spellInfo: { spellName: 'Detect Thoughts', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1A',
						effect: 'Social*',
					},
					{
						spellInfo: { spellName: "Dragon's Breath", spellMetaInfo: 'Draconic Spells' },
						range: 'Touch',
						slotType: '1BA',
						effect: '3d6*',
					},
					{
						spellInfo: { spellName: 'Misty Step', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1BA',
						effect: 'Teleportation',
					},
				],
			},
			{
				groupName: '3rd Level',
				spells: [
					{
						spellInfo: { spellName: 'Alter Self', spellMetaInfo: 'Draconic Spells' },
						range: 'Self',
						slotType: '1A',
						effect: 'Shapechanging',
					},
					{
						spellInfo: { spellName: 'Blink', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1A',
						effect: 'Utility',
					},
					{
						spellInfo: { spellName: 'Chromatic Orb', spellMetaInfo: 'Draconic Spells' },
						range: '90ft.',
						slotType: '1A',
						effect: '5d8*',
					},
					{
						spellInfo: { spellName: 'Command', spellMetaInfo: 'Draconic Spells' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Prone',
					},
					{
						spellInfo: { spellName: 'Counterspell', spellMetaInfo: 'Sorcerer' },
						range: '60ft.',
						slotType: '1R',
						effect: 'Negation',
					},
					{
						spellInfo: { spellName: "Dragon's Breath", spellMetaInfo: 'Draconic Spells' },
						range: 'Touch',
						slotType: '1BA',
						effect: '4d6*',
					},
					{
						spellInfo: { spellName: 'Fear', spellMetaInfo: 'Draconic Spells' },
						range: 'Self',
						slotType: '1A',
						effect: 'Frightened*',
					},
					{
						spellInfo: { spellName: 'Fireball', spellMetaInfo: 'Sorcerer' },
						range: '150ft.',
						slotType: '1A',
						effect: '8d6',
					},
					{
						spellInfo: { spellName: 'Fly', spellMetaInfo: 'Draconic Spells' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Movement',
					},
					{
						spellInfo: { spellName: 'Haste', spellMetaInfo: 'Sorcerer' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Lightning Bolt', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1A',
						effect: '8d6',
					},
					{
						spellInfo: { spellName: 'Slow', spellMetaInfo: 'Sorcerer' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Control*',
					},
				],
			},
		],
		actionData: [
			{
				name: 'Unarmed Strike ',
				description:
					'You make a melee attack that involves using your body to deal one of the following effects:Damage. You make an attack roll against the creature, and on a hit, you deal 1 + STR Bludgeoning damage.Grapple. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or it has the Grappled condition.Shove. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or you can either push it 5 ft. away or cause it to have the Prone condition.',
			},
			{
				name: 'Font of Magic: Create Spell Slot Level 1 ',
				description:
					'You can transform 2 unexpended Sorcery Points into a level 1 spell slot, which vanishes when you finish a Long Rest.',
			},
			{
				name: 'Font of Magic: Create Spell Slot Level 2 ',
				description:
					'You can transform 3 unexpended Sorcery Points into a level 2 spell slot, which vanishes when you finish a Long Rest.',
			},
			{
				name: 'Font of Magic: Create Spell Slot Level 3 ',
				description:
					'You can transform 5 unexpended Sorcery Points into a level 3 spell slot, which vanishes when you finish a Long Rest.',
			},
			{
				name: 'Innate Sorcery ',
				description:
					'Twice per Long Rest, you can take a Bonus Action to unleash the simmering magic within you for 1 minute.',
			},
			{
				name: 'Font of Magic: Convert Spell Slots (No Action)',
				description:
					'You can expend a spell slot to gain a number of Sorcery Points equal to the slot’s level (no action required).',
			},
			{
				name: 'Font of Magic: Sorcery Points (Special)',
				description:
					'You can tap into the wellspring of magic within yourself, which is represented by Sorcery Points (SP). Sorcery Points fuel various magical effects. You have 6 SP and regain all expended points when you finish a Long Rest.',
			},
			{
				name: 'Metamagic: Empowered Spell (Special)',
				description:
					'When you roll damage for a spell, you can spend 1 Sorcery Point to reroll up to 4 damage dice and you must use the new rolls. You can use Empowered Spell even if you’ve already used a different Metamagic option during the casting of the spell.',
			},
			{
				name: 'Metamagic: Quickened Spell (Special)',
				description:
					'When you cast a spell with a casting time of an action, you can spend 2 Sorcery Points to change the casting time to a Bonus Action for this casting. You can’t modify a spell in this way if you’ve already cast a level 1+ spell on the current turn, nor can you cast a level 1+ spell on the current turn after modifying a spell in this way.',
			},
			{
				name: 'Sorcerous Restoration (Special)',
				description:
					'When you finish a Short Rest, you can regain up to 3 Sorcery Points. Once used, you can’t use this feature again until you finish a Long Rest.',
			},
		],
		features: [
			{ name: 'Core Sorcerer Traits' },
			{ name: 'Spellcasting' },
			{
				name: 'Innate Sorcery',
				description:
					'Twice per Long Rest, you can take a Bonus Action to unleash the simmering magic within you for 1 minute.',
			},
			{ name: 'Font of Magic' },
			{
				name: 'Metamagic',
				description:
					'You can alter spells to suit your needs; you know 2 Metamagic options which can be used to temporarily modify spells you cast.',
			},
			{
				name: 'Metamagic Options',
				description:
					'When you roll damage for a spell, you can spend 1 Sorcery Points to reroll up to 4 damage dice and you must use the new rolls. You can use Empowered Spell even if you’ve already used a different Metamagic option during the casting of the spell.',
			},
			{ name: 'Sorcerer Subclass' },
			{
				name: 'Draconic Resilience',
				description:
					'Your HP maximum increases by 6, and while you aren’t wearing armor, your base AC equals 10 + Dex. modifier + Cha. modifier.',
			},
			{
				name: 'Draconic Spells',
				description:
					'When you reach a Sorcerer level specified in the Draconic Spells table, you thereafter always have the listed spells prepared.',
			},
			{ name: 'Ability Score Improvement' },
			{
				name: 'Sorcerous Restoration',
				description:
					'When you finish a Short Rest, you can regain up to 3 Sorcery Points. Once used, you can’t use this feature again until you finish a Long Rest.',
			},
			{
				name: 'Elemental Affinity',
				description:
					'You choose a damage type associated with Dragons: Acid, Cold, Fire, Lightning, or Poison. You gain the following benefits:',
			},
			{ name: 'Creature Type', description: "You're a Humanoid." },
			{ name: 'Size', description: 'Your Size is Medium or Small, chosen when you select this species.' },
			{ name: 'Speed', description: 'Your Speed is 30 ft.' },
			{ name: 'Resourceful', description: 'You gain Heroic Inspiration whenever you finish a Long Rest.' },
			{ name: 'Skillful', description: 'You gain proficiency in one skill of your choice.' },
			{ name: 'Versatile', description: 'You gain an Origin feat of your choice.' },
			{
				name: 'Ability Score Increases',
				description:
					'When determining your character’s ability scores, increase one score by 2 and a different one by 1, or increase three scores by 1.',
			},
			{ name: 'Elemental Adept', description: 'Ability Score Increase. Int., Wis., or Cha. increased by 1.' },
			{
				name: 'Magic Initiate (Cleric)',
				description:
					"Two Cantrips. You learn two cantrips of your choice from the Cleric spell list. Int., Wis., or Cha. is your spellcasting ability for this feat's spells.",
			},
			{
				name: 'Tough',
				description:
					'When you take this feat, your HP maximum increases by 12. Whenever you gain a character level thereafter, your HP maximum increases an additional 2 HP.',
			},
		],
		healthPoints: '56',
		armorClass: '16',
		walkingSpeed: '30ft.',
	},
	OLEK: {
		abilityScores: [
			{ name: 'Strength', abbr: 'str', score: '+2', value: '14' },
			{ name: 'Dexterity', abbr: 'dex', score: '-1', value: '8' },
			{ name: 'Constitution', abbr: 'con', score: '+2', value: '14' },
			{ name: 'Intelligence', abbr: 'int', score: '+0', value: '10' },
			{ name: 'Wisdom', abbr: 'wis', score: '+1', value: '12' },
			{ name: 'Charisma', abbr: 'cha', score: '+4', value: '18' },
		],
		savingThrows: [
			{ name: 'str', value: '+2' },
			{ name: 'dex', value: '-1' },
			{ name: 'con', value: '+2' },
			{ name: 'int', value: '+0' },
			{ name: 'wis', value: '+4' },
			{ name: 'cha', value: '+7' },
		],
		spellData: [
			{
				groupName: 'Cantrip',
				spells: [
					{
						spellInfo: { spellName: 'Booming Blade', spellMetaInfo: 'Warlock' },
						range: 'Self',
						slotType: '1A',
						effect: '1d8*',
					},
					{
						spellInfo: { spellName: 'Guidance', spellMetaInfo: 'Eldritch Invocations' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Light', spellMetaInfo: 'Light Bearer' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Creation*',
					},
					{
						spellInfo: { spellName: 'Mage Hand', spellMetaInfo: 'Warlock' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Utility',
					},
					{
						spellInfo: { spellName: 'Message', spellMetaInfo: 'Eldritch Invocations' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Communication*',
					},
					{
						spellInfo: { spellName: 'Shillelagh', spellMetaInfo: 'Eldritch Invocations' },
						range: 'Self',
						slotType: '1BA',
						effect: '1d10+6*',
					},
				],
			},
			{
				groupName: '1st Level',
				spells: [
					{
						spellInfo: { spellName: 'Bless', spellMetaInfo: 'Paladin' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Cure Wounds', spellMetaInfo: 'Paladin' },
						range: 'Touch',
						slotType: '1A',
						effect: '2d8+4 ',
					},
					{
						spellInfo: { spellName: 'Detect Magic', spellMetaInfo: 'Eldritch Invocations' },
						range: 'Self',
						slotType: '1A',
						effect: 'Detection',
					},
					{
						spellInfo: { spellName: 'Divine Smite', spellMetaInfo: 'Paladin’s Smite' },
						range: 'Self',
						slotType: '1BA',
						effect: '2d8',
					},
					{
						spellInfo: { spellName: 'Divine Smite', spellMetaInfo: 'Paladin’s Smite' },
						range: 'Self',
						slotType: '1BA',
						effect: '2d8',
					},
					{
						spellInfo: { spellName: 'Protection from Evil and Good', spellMetaInfo: 'Oath of Devotion Spells' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Searing Smite', spellMetaInfo: 'Paladin' },
						range: 'Self',
						slotType: '1BA',
						effect: '1d6*',
					},
					{
						spellInfo: { spellName: 'Shield of Faith', spellMetaInfo: 'Oath of Devotion Spells' },
						range: '60ft.',
						slotType: '1BA',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Speak with Animals', spellMetaInfo: 'Warlock' },
						range: 'Self',
						slotType: '1A',
						effect: 'Communication*',
					},
					{
						spellInfo: { spellName: "Tasha's Hideous Laughter", spellMetaInfo: 'Warlock' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Prone*',
					},
					{
						spellInfo: { spellName: "Tenser's Floating Disk", spellMetaInfo: 'Eldritch Invocations' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Movement*',
					},
				],
			},
			{
				groupName: '2nd Level',
				spells: [
					{
						spellInfo: { spellName: 'Aid', spellMetaInfo: 'Oath of Devotion Spells' },
						range: '30ft.',
						slotType: '1A',
						effect: '5 ',
					},
					{
						spellInfo: { spellName: 'Bless', spellMetaInfo: 'Paladin' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Cure Wounds', spellMetaInfo: 'Paladin' },
						range: 'Touch',
						slotType: '1A',
						effect: '4d8+4 ',
					},
					{
						spellInfo: { spellName: 'Detect Magic', spellMetaInfo: 'Eldritch Invocations' },
						range: 'Self',
						slotType: '1A',
						effect: 'Detection',
					},
					{
						spellInfo: { spellName: 'Divine Smite', spellMetaInfo: 'Paladin’s Smite' },
						range: 'Self',
						slotType: '1BA',
						effect: '3d8',
					},
					{
						spellInfo: { spellName: 'Find Steed', spellMetaInfo: 'Faithful Steed' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Summoning',
					},
					{
						spellInfo: { spellName: 'Find Steed', spellMetaInfo: 'Faithful Steed' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Summoning',
					},
					{
						spellInfo: { spellName: 'Locate Object', spellMetaInfo: 'Paladin' },
						range: 'Self',
						slotType: '1A',
						effect: 'Detection',
					},
					{
						spellInfo: { spellName: 'Magic Weapon', spellMetaInfo: 'Paladin' },
						range: 'Touch',
						slotType: '1BA',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Protection from Evil and Good', spellMetaInfo: 'Oath of Devotion Spells' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Searing Smite', spellMetaInfo: 'Paladin' },
						range: 'Self',
						slotType: '1BA',
						effect: '2d6*',
					},
					{
						spellInfo: { spellName: 'Shield of Faith', spellMetaInfo: 'Oath of Devotion Spells' },
						range: '60ft.',
						slotType: '1BA',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Shining Smite', spellMetaInfo: 'Paladin' },
						range: 'Self',
						slotType: '1BA',
						effect: '2d6',
					},
					{
						spellInfo: { spellName: "Tasha's Hideous Laughter", spellMetaInfo: 'Warlock' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Prone*',
					},
					{
						spellInfo: { spellName: "Tenser's Floating Disk", spellMetaInfo: 'Eldritch Invocations' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Movement*',
					},
					{
						spellInfo: { spellName: 'Zone of Truth', spellMetaInfo: 'Oath of Devotion Spells' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Control',
					},
				],
			},
		],
		actionData: [
			{
				name: 'Channel Divinity ',
				description:
					'You can channel energy directly from the Outer Planes to fuel magical effects. Each time you use this class’s Channel Divinity, you can choose which effect to create. You can use this class’s Channel Divinity 2 times per Long Rest, but can regain one expended use after finishing a Short Rest.If your Channel Divinity requires a saving throw, the DC equals your Paladin spell save DC (DC 15).',
			},
			{
				name: 'Cleave (Greataxe) ',
				description:
					'Cleave. Once per turn, if you hit a creature with a melee attack using a Greataxe, you can make another melee attack with it against a second creature within 5 ft. of the first that’s within your reach. On a hit, the second creature takes the Greataxe’s damage, but without your ability modifier (unless the modifier is negative).',
			},
			{
				name: 'Healing Hands ',
				description: 'Once per Long Rest as a Magic action, you touch a creature and they regain 3d4 HP.',
			},
			{
				name: 'Sacred Weapon: Imbue Weapon ',
				description:
					'When you take the Attack action, you can expend one use of Channel Divinity to imbue a Melee weapon with positive energy. For 10 minutes or until you use this feature again, you add +4 to attack rolls made with that weapon and each time you can cause it to deal its normal damage type or Radiant damage. The weapon also emits a Bright Light in a 20-ft.-radius and Dim Light 20 ft. beyond that.You can end this effect early (no action required), and it ends early if you aren’t carrying the weapon.',
			},
			{
				name: 'Topple (Quarterstaff) ',
				description:
					'Topple. If you hit a creature with a Quarterstaff, you can force it to make a Con. saving throw (DC 8 + 3 + the ability modifier used to make the attack). On a failed save, the creature has the Prone condition.',
			},
			{
				name: 'Unarmed Strike ',
				description:
					'You make a melee attack that involves using your body to deal one of the following effects:Damage. You make an attack roll against the creature, and on a hit, you deal 1 + STR Bludgeoning damage.Grapple. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or it has the Grappled condition.Shove. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or you can either push it 5 ft. away or cause it to have the Prone condition.',
			},
			{
				name: 'Celestial Revelation ',
				description:
					'Once per Long Rest, you transform using one of the options below (choose the option each time you transform). The transformation lasts for 1 minute or until you end it (no action required).Once on each of your turns before the transformation ends, you can deal 3 extra damage (Necrotic for Necrotic Shroud or Radiant for Heavenly Wings and Inner Radiance) to one target when you deal damage to it with an attack or a spell.Heavenly Wings. You have a Fly Speed equal to your Speed.Inner Radiance. You shed Bright Light in a 10-ft. radius and Dim Light for an additional 10 ft., and at the end of each of your turns, each creature within 10 ft. of you takes 3 Radiant damage.Necrotic Shroud. Creatures other than your allies within 10 ft. of you must succeed on a Cha. saving throw (DC 15) or have the Frightened condition until the end of your next turn.',
			},
			{
				name: 'Channel Divinity: Divine Sense ',
				description:
					'For the next 10 min. or until you have the Incapacitated condition, you know the location of any Celestials, Fiends, and Undead within 60 ft., and you know its creature type. In the same radius, you also detect the presence of any place/object that has been consecrated or desecrated, as with the Hallow spell.',
			},
			{
				name: 'Lay On Hands: Heal ',
				description:
					'As a Bonus Action, you can touch a creature (which could be yourself) and restore a number HP to that creature, up to the maximum amount remaining in the pool.',
			},
			{
				name: 'Lay On Hands: Healing Pool ',
				description:
					'You have a pool of healing power that replenishes when you finish a Long Rest. With that pool, you can restore a total of 25 HP.',
			},
			{
				name: 'Lay On Hands: Purify Poison ',
				description:
					'You can expend 5 HP from the pool of healing to remove the Poisoned condition from the creature; those points don’t also restore HP to the creature.',
			},
			{
				name: 'Reactive Spell ',
				description:
					'When a creature provokes an Opportunity Attack from you, you can take a Reaction to cast a spell at the creature rather than making an Opportunity Attack. The spell must have a casting time of one action and must target only that creature.',
			},
		],
		features: [
			{ name: 'Core Paladin Traits' },
			{
				name: 'Lay On Hands',
				description:
					'You have a pool of healing power that replenishes when you finish a Long Rest. With that pool, you can restore a total of 25 HP.',
			},
			{ name: 'Spellcasting' },
			{
				name: 'Weapon Mastery',
				description:
					'Topple. If you hit a creature with a Quarterstaff, you can force it to make a Con. saving throw (DC 8 + 3 + the ability modifier used to make the attack). On a failed save, the creature has the Prone condition.',
			},
			{ name: 'Fighting Style' },
			{
				name: 'Paladin’s Smite',
				description:
					'You always have Divine Smite prepared and cast it without expending a spell slot once per Long Rest.',
			},
			{
				name: 'Channel Divinity',
				description:
					'You can channel energy directly from the Outer Planes to fuel magical effects. Each time you use this class’s Channel Divinity, you can choose which effect to create. You can use this class’s Channel Divinity 2 times per Long Rest, but can regain one expended use after finishing a Short Rest.',
			},
			{ name: 'Paladin Subclass' },
			{ name: 'Oath of Devotion Spells' },
			{
				name: 'Sacred Weapon',
				description:
					'When you take the Attack action, you can expend one use of Channel Divinity to imbue a Melee weapon with positive energy. For 10 minutes or until you use this feature again, you add +4 to attack rolls made with that weapon and each time you can cause it to deal its normal damage type or Radiant damage. The weapon also emits a Bright Light in a 20-ft.-radius and Dim Light 20 ft. beyond that.',
			},
			{ name: 'Ability Score Improvement' },
			{
				name: 'Extra Attack',
				description: 'You can attack twice instead of once whenever you take the Attack action on your turn.',
			},
			{
				name: 'Faithful Steed',
				description:
					'You always have Find Steed prepared, and can cast it once per Long Rest without expending a spell slot.',
			},
			{ name: 'Core Warlock Traits' },
			{
				name: 'Eldritch Invocations',
				description:
					'You have unearthed Eldritch Invocations, pieces of forbidden knowledge that imbue you with an abiding magical ability or other lessons. If an invocation has a prerequisite, you must meet it to learn that invocation.',
			},
			{ name: 'Pact Magic' },
			{ name: 'Creature Type', description: 'You are a Humanoid.' },
			{ name: 'Size', description: 'You are Medium or Small, chosen when you select this species.' },
			{ name: 'Speed', description: 'Your speed is 30 ft.' },
			{ name: 'Celestial Resistance', description: 'You have Resistance to Necrotic & Radiant damage.' },
			{ name: 'Darkvision', description: 'You have Darkvision with a range of 60 ft.' },
			{
				name: 'Healing Hands',
				description: 'Once per Long Rest as a Magic action, you touch a creature and they regain 3d4 HP.',
			},
			{
				name: 'Light Bearer',
				description: 'You know the Light cantrip and Charisma is your spellcasting ability for it.',
			},
			{
				name: 'Celestial Revelation',
				description:
					'Once per Long Rest, you transform using one of the options below (choose the option each time you transform). The transformation lasts for 1 minute or until you end it (no action required).',
			},
			{
				name: 'Ability Score Increases',
				description:
					'When determining your character’s ability scores, increase one score by 2 and a different one by 1, or increase three scores by 1.',
			},
			{ name: 'War Caster', description: 'Ability Score Increase. Increase your Int., Wis., or Cha. by 1.' },
			{ name: 'Alert', description: 'Initiative Proficiency. When you roll Initiative, add +3 to the roll.' },
			{
				name: 'Dueling',
				description:
					'While holding a Melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
			},
		],
		healthPoints: '51',
		armorClass: '18',
		walkingSpeed: '30ft.',
	},
};
