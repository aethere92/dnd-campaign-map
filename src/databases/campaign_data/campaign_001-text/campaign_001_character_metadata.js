const CAMPAIGN_001_METADATA = {
	AENWYN: {
		abilityScores: [
			{ name: 'Strength', abbr: 'str', score: '+0', value: '10' },
			{ name: 'Dexterity', abbr: 'dex', score: '+0', value: '10' },
			{ name: 'Constitution', abbr: 'con', score: '+2', value: '14' },
			{ name: 'Intelligence', abbr: 'int', score: '+1', value: '12' },
			{ name: 'Wisdom', abbr: 'wis', score: '+2', value: '14' },
			{ name: 'Charisma', abbr: 'cha', score: '+3', value: '17' },
		],
		savingThrows: [
			{ name: 'str', value: '+0' },
			{ name: 'dex', value: '+0' },
			{ name: 'con', value: '+5' },
			{ name: 'int', value: '+1' },
			{ name: 'wis', value: '+2' },
			{ name: 'cha', value: '+6' },
		],
		spellData: [
			{
				groupName: 'Cantrip',
				spells: [
					{
						spellInfo: { spellName: 'Fire Bolt', spellMetaInfo: 'Legacy | Sorcerer' },
						range: '120ft.',
						slotType: '1A',
						effect: '2d10',
					},
					{
						spellInfo: { spellName: 'Mending', spellMetaInfo: 'Legacy | Sorcerer' },
						range: 'Touch',
						slotType: '1m',
						effect: 'Utility',
					},
					{
						spellInfo: { spellName: 'Message', spellMetaInfo: 'Legacy | Sorcerer' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Communication*',
					},
					{
						spellInfo: { spellName: 'Ray of Frost', spellMetaInfo: 'Legacy | Sorcerer' },
						range: '60ft.',
						slotType: '1A',
						effect: '2d8',
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
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1R',
						effect: '1d6*',
					},
					{
						spellInfo: { spellName: 'Shield', spellMetaInfo: 'Legacy | Sorcerer' },
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
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1R',
						effect: '2d6*',
					},
					{
						spellInfo: { spellName: 'Invisibility', spellMetaInfo: 'Legacy | Sorcerer' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Invisible',
					},
					{
						spellInfo: { spellName: 'Scorching Ray', spellMetaInfo: 'Legacy | Sorcerer' },
						range: '120ft.',
						slotType: '1A',
						effect: '2d6',
					},
					{
						spellInfo: { spellName: 'Warding Wind', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1A',
						effect: 'Deafened*',
					},
				],
			},
			{
				groupName: '3rd Level',
				spells: [
					{
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1R',
						effect: '3d6*',
					},
					{
						spellInfo: { spellName: 'Blink', spellMetaInfo: 'Legacy | Sorcerer' },
						range: 'Self',
						slotType: '1A',
						effect: 'Utility',
					},
					{
						spellInfo: { spellName: 'Fireball', spellMetaInfo: 'Legacy | Sorcerer' },
						range: '150ft.',
						slotType: '1A',
						effect: '8d6',
					},
					{
						spellInfo: { spellName: 'Haste', spellMetaInfo: 'Legacy | Sorcerer' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Invisibility', spellMetaInfo: 'Legacy | Sorcerer' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Invisible',
					},
					{
						spellInfo: { spellName: 'Scorching Ray', spellMetaInfo: 'Legacy | Sorcerer' },
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
						spellInfo: { spellName: 'Absorb Elements', spellMetaInfo: 'Sorcerer' },
						range: 'Self',
						slotType: '1R',
						effect: '4d6*',
					},
					{
						spellInfo: { spellName: 'Fireball', spellMetaInfo: 'Legacy | Sorcerer' },
						range: '150ft.',
						slotType: '1A',
						effect: '9d6',
					},
					{
						spellInfo: { spellName: 'Invisibility', spellMetaInfo: 'Legacy | Sorcerer' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Invisible',
					},
					{
						spellInfo: { spellName: 'Scorching Ray', spellMetaInfo: 'Legacy | Sorcerer' },
						range: '120ft.',
						slotType: '1A',
						effect: '2d6',
					},
					{
						spellInfo: { spellName: 'Wall of Fire', spellMetaInfo: 'Sorcerer' },
						range: '120ft.',
						slotType: '1A',
						effect: '5d8*',
					},
				],
			},
		],
		actionData: [
			{
				name: 'Sorcery Points ',
				description: 'You have 8 sorcery points that you regain when you finish a long rest.',
			},
			{
				name: 'Unarmed Strike ',
				description:
					'You make a melee attack that involves using your body to deal one of the following effects:Damage. You make an attack roll against the creature, and on a hit, you deal 1 + STR Bludgeoning damage.Grapple. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or it has the Grappled condition.Shove. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or you can either push it 5 ft. away or cause it to have the Prone condition.',
			},
			{
				name: 'Convert Sorcery Points ',
				description:
					'You can use your sorcery points to gain additional spell slots or sacrifice spell slots to gain additional sorcery points as a bonus action.',
			},
			{
				name: 'Elemental Affinity (Special)',
				description:
					'When you cast a spell that deals damage of the type associated with your draconic ancestry, you can add +3 to one damage roll of that spell. At the same time, you can spend 1 sorcery point to gain resistance to that damage type for 1 hour.',
			},
			{
				name: 'Mask of the Wild (Special)',
				description: 'You can attempt to hide even when you are only lightly obscured.',
			},
			{
				name: 'Metamagic - Empowered Spell (Special)',
				description:
					"When you roll damage for a spell, you can spend 1 sorcery point to reroll up to 3 of the dice. You must use the new rolls and you can use this option even if you've already used another Metamagic option.",
			},
			{
				name: 'Metamagic - Twinned Spell (Special)',
				description:
					"You can spend sorcery points equal to a spell's level (1 for a cantrip) to target a second creature in range with the same spell, as long as the spell at the level it's being cast is incapable of targeting more than one creature.",
			},
		],
		features: [
			{ name: 'Hit Points' },
			{ name: 'Proficiencies' },
			{
				name: 'Spellcasting',
				description:
					'You can cast known sorcerer spells using CHA as your spellcasting modifier (Spell DC 14, Spell Attack +6). You can use an arcane focus as a spellcasting focus.',
			},
			{ name: 'Sorcerous Origin' },
			{
				name: 'Dragon Ancestor',
				description:
					'You have a specific dragon type as your ancestor. You can speak, read, and write Draconic and you double your proficiency bonus for CHA checks involving dragons. ',
			},
			{
				name: 'Draconic Resilience',
				description: 'Your max HP increases by 8. When you aren’t wearing armor, your AC equals 13.',
			},
			{
				name: 'Font of Magic',
				description:
					'You have 8 sorcery points that you regain when you finish a long rest. You can use your sorcery points to gain additional spell slots or sacrifice spell slots to gain additional sorcery points as a bonus action.',
			},
			{ name: 'Metamagic', description: 'You gain the ability to twist spells to suit your needs.' },
			{ name: 'Ability Score Improvement' },
			{
				name: 'Elemental Affinity (Poison)',
				description:
					'When you cast a spell that deals damage of the type associated with your draconic ancestry, you can add +3 to one damage roll of that spell. At the same time, you can spend 1 sorcery point to gain resistance to that damage type for 1 hour.',
			},
			{ name: 'Ability Score Increase', description: 'Your Dexterity score increases by 2.' },
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
			{ name: 'Ability Score Increase', description: 'Your Wisdom score increases by 1.' },
			{
				name: 'Elf Weapon Training',
				description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.',
			},
			{ name: 'Fleet of Foot', description: 'Your base walking speed increases to 35 feet.' },
			{ name: 'Mask of the Wild', description: 'You can attempt to hide even when you are only lightly obscured.' },
		],
		healthPoints: '58',
		armorClass: '13',
		walkingSpeed: '35ft.',
	},
	AETHERE: {
		abilityScores: [
			{ name: 'Strength', abbr: 'str', score: '-1', value: '8' },
			{ name: 'Dexterity', abbr: 'dex', score: '+2', value: '14' },
			{ name: 'Constitution', abbr: 'con', score: '+0', value: '10' },
			{ name: 'Intelligence', abbr: 'int', score: '+2', value: '14' },
			{ name: 'Wisdom', abbr: 'wis', score: '+2', value: '14' },
			{ name: 'Charisma', abbr: 'cha', score: '+4', value: '18' },
		],
		savingThrows: [
			{ name: 'str', value: '-1' },
			{ name: 'dex', value: '+5' },
			{ name: 'con', value: '+0' },
			{ name: 'int', value: '+2' },
			{ name: 'wis', value: '+2' },
			{ name: 'cha', value: '+7' },
		],
		spellData: [
			{
				groupName: 'Cantrip',
				spells: [
					{
						spellInfo: { spellName: 'Mage Hand', spellMetaInfo: 'Bard' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Utility',
					},
					{
						spellInfo: { spellName: 'Starry Wisp', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: '2d8',
					},
					{
						spellInfo: { spellName: 'Vicious Mockery', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: '2d6*',
					},
				],
			},
			{
				groupName: '1st Level',
				spells: [
					{
						spellInfo: { spellName: 'Command', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Prone',
					},
					{
						spellInfo: { spellName: 'Dissonant Whispers', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: '3d6*',
					},
					{
						spellInfo: { spellName: 'Healing Word', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1BA',
						effect: '2d4+4 ',
					},
					{
						spellInfo: { spellName: 'Thunderwave', spellMetaInfo: 'Bard' },
						range: 'Self',
						slotType: '1A',
						effect: '2d8*',
					},
				],
			},
			{
				groupName: '2nd Level',
				spells: [
					{
						spellInfo: { spellName: 'Blindness/Deafness', spellMetaInfo: 'Bard' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Blinded*',
					},
					{
						spellInfo: { spellName: 'Command', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Prone',
					},
					{
						spellInfo: { spellName: 'Dissonant Whispers', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: '4d6*',
					},
					{
						spellInfo: { spellName: 'Healing Word', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1BA',
						effect: '4d4+4 ',
					},
					{ spellInfo: { spellName: 'Shatter', spellMetaInfo: 'Bard' }, range: '60ft.', slotType: '1A', effect: '3d8' },
					{
						spellInfo: { spellName: 'Silence', spellMetaInfo: 'Bard' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Control',
					},
					{
						spellInfo: { spellName: 'Thunderwave', spellMetaInfo: 'Bard' },
						range: 'Self',
						slotType: '1A',
						effect: '3d8*',
					},
				],
			},
			{
				groupName: '3rd Level',
				spells: [
					{
						spellInfo: { spellName: 'Blindness/Deafness', spellMetaInfo: 'Bard' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Blinded*',
					},
					{
						spellInfo: { spellName: 'Command', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Prone',
					},
					{
						spellInfo: { spellName: 'Counterspell', spellMetaInfo: 'Additional Magical Secrets' },
						range: '60ft.',
						slotType: '1R',
						effect: 'Negation',
					},
					{
						spellInfo: { spellName: 'Dissonant Whispers', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: '5d6*',
					},
					{
						spellInfo: { spellName: 'Healing Word', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1BA',
						effect: '6d4+4 ',
					},
					{
						spellInfo: { spellName: 'Hypnotic Pattern', spellMetaInfo: 'Bard' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Charmed*',
					},
					{
						spellInfo: { spellName: 'Plant Growth', spellMetaInfo: 'Bard' },
						range: '150ft.',
						slotType: 'S',
						effect: 'Control',
					},
					{ spellInfo: { spellName: 'Shatter', spellMetaInfo: 'Bard' }, range: '60ft.', slotType: '1A', effect: '4d8' },
					{
						spellInfo: { spellName: 'Spirit Guardians', spellMetaInfo: 'Additional Magical Secrets' },
						range: 'Self',
						slotType: '1A',
						effect: '3d8*',
					},
					{
						spellInfo: { spellName: 'Thunderwave', spellMetaInfo: 'Bard' },
						range: 'Self',
						slotType: '1A',
						effect: '4d8*',
					},
				],
			},
			{
				groupName: '4th Level',
				spells: [
					{
						spellInfo: { spellName: 'Blindness/Deafness', spellMetaInfo: 'Bard' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Blinded*',
					},
					{
						spellInfo: { spellName: 'Command', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Prone',
					},
					{
						spellInfo: { spellName: 'Counterspell', spellMetaInfo: 'Additional Magical Secrets' },
						range: '60ft.',
						slotType: '1R',
						effect: 'Negation',
					},
					{
						spellInfo: { spellName: 'Dissonant Whispers', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: '6d6*',
					},
					{
						spellInfo: { spellName: 'Greater Invisibility', spellMetaInfo: 'Bard' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Invisible',
					},
					{
						spellInfo: { spellName: 'Healing Word', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1BA',
						effect: '8d4+4 ',
					},
					{
						spellInfo: { spellName: 'Polymorph', spellMetaInfo: 'Bard' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Control*',
					},
					{ spellInfo: { spellName: 'Shatter', spellMetaInfo: 'Bard' }, range: '60ft.', slotType: '1A', effect: '5d8' },
					{
						spellInfo: { spellName: 'Spirit Guardians', spellMetaInfo: 'Additional Magical Secrets' },
						range: 'Self',
						slotType: '1A',
						effect: '4d8*',
					},
					{
						spellInfo: { spellName: 'Thunderwave', spellMetaInfo: 'Bard' },
						range: 'Self',
						slotType: '1A',
						effect: '5d8*',
					},
				],
			},
		],
		actionData: [
			{
				name: 'Countercharm ',
				description:
					'As an action, you can perform until the end of your next turn. During that time, you and any friendly creatures within 30 ft. that can hear you gain advantage on saving throws against being frightened or charmed.',
			},
			{
				name: 'Unarmed Strike ',
				description:
					'You make a melee attack that involves using your body to deal one of the following effects:Damage. You make an attack roll against the creature, and on a hit, you deal 1 + STR Bludgeoning damage.Grapple. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or it has the Grappled condition.Shove. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or you can either push it 5 ft. away or cause it to have the Prone condition.',
			},
			{
				name: 'Bardic Inspiration ',
				description:
					'As a bonus action, a creature (other than yourself) within 60 ft. that can hear you gains an inspiration die (1d8). For 10 minutes, the creature can add it to one ability check, attack roll, or saving throw. This can be added after seeing the roll, but before knowing the outcome.',
			},
			{
				name: 'Cutting Words ',
				description:
					"As a reaction when a creature (that's not immune to being charmed) you can see within 60 ft. makes an attack roll, ability check, or damage roll, you can expend one use of Bardic Inspiration, roll the die, and subtract the number from the creature's roll. You can do so after the roll but before knowing the result.",
			},
			{
				name: 'Luck Points (Special)',
				description:
					'You have 3 Luck Points that you can spend on the benefits below. You regain expended Luck Points after a Long Rest.Advantage. When you roll a d20 for a D20 Test, you can spend 1 Luck Point to give yourself Advantage on the roll.Disadvantage. When a creature rolls a d20 for an attack roll against you, you can spend 1 Luck Point to impose Disadvantage on that roll.',
			},
		],
		features: [],
		healthPoints: '43',
		armorClass: '14',
		walkingSpeed: '30ft.',
	},
	ALEZANDER: {},
	NORA: {
		abilityScores: [
			{ name: 'Strength', abbr: 'str', score: '+0', value: '10' },
			{ name: 'Dexterity', abbr: 'dex', score: '+5', value: '20' },
			{ name: 'Constitution', abbr: 'con', score: '+1', value: '12' },
			{ name: 'Intelligence', abbr: 'int', score: '+0', value: '10' },
			{ name: 'Wisdom', abbr: 'wis', score: '+3', value: '16' },
			{ name: 'Charisma', abbr: 'cha', score: '+0', value: '10' },
		],
		savingThrows: [
			{ name: 'str', value: '+5' },
			{ name: 'dex', value: '+10' },
			{ name: 'con', value: '+1' },
			{ name: 'int', value: '+0' },
			{ name: 'wis', value: '+3' },
			{ name: 'cha', value: '+0' },
		],
		spellData: [
			{
				groupName: '1st Level',
				spells: [
					{
						spellInfo: { spellName: 'Ensnaring Strike', spellMetaInfo: 'Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '1d6*',
					},
					{
						spellInfo: { spellName: 'Hail of Thorns', spellMetaInfo: 'Legacy | Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '1d10',
					},
					{
						spellInfo: { spellName: "Hunter's Mark", spellMetaInfo: 'Legacy | Ranger' },
						range: '90ft.',
						slotType: '1BA',
						effect: '1d6*',
					},
					{
						spellInfo: { spellName: 'Speak with Animals', spellMetaInfo: 'Legacy | Primal Awareness' },
						range: 'Self',
						slotType: '1A',
						effect: 'Communication*',
					},
					{
						spellInfo: { spellName: 'Zephyr Strike', spellMetaInfo: 'Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '1d8*',
					},
				],
			},
			{
				groupName: '2nd Level',
				spells: [
					{
						spellInfo: { spellName: 'Beast Sense', spellMetaInfo: 'Legacy | Primal Awareness' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Detection',
					},
					{
						spellInfo: { spellName: 'Darkness', spellMetaInfo: 'Eyes of the Dark' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Control',
					},
					{
						spellInfo: { spellName: 'Ensnaring Strike', spellMetaInfo: 'Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '2d6*',
					},
					{
						spellInfo: { spellName: 'Hail of Thorns', spellMetaInfo: 'Legacy | Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '2d10',
					},
					{
						spellInfo: { spellName: "Hunter's Mark", spellMetaInfo: 'Legacy | Ranger' },
						range: '90ft.',
						slotType: '1BA',
						effect: '1d6*',
					},
					{
						spellInfo: { spellName: 'Pass without Trace', spellMetaInfo: 'Legacy | Ranger' },
						range: 'Self',
						slotType: '1A',
						effect: 'Buff*',
					},
				],
			},
			{
				groupName: '3rd Level',
				spells: [
					{
						spellInfo: { spellName: 'Darkness', spellMetaInfo: 'Eyes of the Dark' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Control',
					},
					{
						spellInfo: { spellName: 'Ensnaring Strike', spellMetaInfo: 'Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '3d6*',
					},
					{
						spellInfo: { spellName: 'Hail of Thorns', spellMetaInfo: 'Legacy | Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '3d10',
					},
					{
						spellInfo: { spellName: "Hunter's Mark", spellMetaInfo: 'Legacy | Ranger' },
						range: '90ft.',
						slotType: '1BA',
						effect: '1d6*',
					},
				],
			},
			{
				groupName: '4th Level',
				spells: [
					{
						spellInfo: { spellName: 'Darkness', spellMetaInfo: 'Eyes of the Dark' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Control',
					},
					{
						spellInfo: { spellName: 'Ensnaring Strike', spellMetaInfo: 'Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '4d6*',
					},
					{
						spellInfo: { spellName: 'Hail of Thorns', spellMetaInfo: 'Legacy | Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '4d10',
					},
					{
						spellInfo: { spellName: "Hunter's Mark", spellMetaInfo: 'Legacy | Ranger' },
						range: '90ft.',
						slotType: '1BA',
						effect: '1d6*',
					},
				],
			},
			{
				groupName: '5th Level',
				spells: [
					{
						spellInfo: { spellName: 'Darkness', spellMetaInfo: 'Eyes of the Dark' },
						range: '60ft.',
						slotType: '1A',
						effect: 'Control',
					},
					{
						spellInfo: { spellName: 'Ensnaring Strike', spellMetaInfo: 'Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '5d6*',
					},
					{
						spellInfo: { spellName: 'Hail of Thorns', spellMetaInfo: 'Legacy | Ranger' },
						range: 'Self',
						slotType: '1BA',
						effect: '5d10',
					},
					{
						spellInfo: { spellName: "Hunter's Mark", spellMetaInfo: 'Legacy | Ranger' },
						range: '90ft.',
						slotType: '1BA',
						effect: '1d6*',
					},
				],
			},
		],
		actionData: [
			{ name: 'Beast Strike ', description: 'Beast’s Strike' },
			{
				name: 'Charge Attack ',
				description:
					"As part of a melee attack action, if you move at least 10 feet in a straight line toward the target prior to hitting it, choose one of the following effects: gain 1d8 bonus to the attack's damage, or push the target up to 10 ft. away if it is no more than one size larger than you. You can use this once per turn.",
			},
			{ name: 'Improved Dash ', description: 'When you Dash, your Speed increases by 10 ft. for that action.' },
			{
				name: 'Unarmed Strike ',
				description:
					'You make a melee attack that involves using your body to deal one of the following effects:Damage. You make an attack roll against the creature, and on a hit, you deal 1 + STR Bludgeoning damage.Grapple. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or it has the Grappled condition.Shove. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or you can either push it 5 ft. away or cause it to have the Prone condition.',
			},
			{
				name: 'Exceptional Training ',
				description:
					"On any of your turns when your beast companion doesn’t attack, you can use a bonus action to command the beast to take the Dash, Disengage, or Help action on its turn. In addition, the beast's attacks now count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
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
				name: 'Hound of Ill Omen ',
				description:
					'As a bonus action, you can spend 3 sorcery points to magically summon a hound of ill omen (modified dire wolf) to target one creature you can see within 120 ft. of you.',
			},
			{
				name: 'Innate Sorcery ',
				description:
					'Twice per Long Rest, you can take a Bonus Action to unleash the simmering magic within you for 1 minute.',
			},
			{
				name: 'Primal Companion: Take Action ',
				description:
					'As a bonus action on your turn you command your Primal Companion to take another action. That action can be one in its stat block or some other action. You can also sacrifice one of your attacks when you take the Attack action to command the beast to take the Attack action. If you are incapacitated, the beast can take any action of its choice, not just Dodge.AC: 18Hit Points: (8d8)',
			},
			{
				name: 'Favored Foe (Special)',
				description:
					'When you hit a creature with an attack roll, you can mark the target as your favored enemy for 1 minute or until you lose your concentration (as if you were concentrating on a spell).The first time on each of your turns that you hit the favored enemy and deal damage to it, including when you mark it, you can increase that damage by 1d6.',
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
				name: 'Metamagic: Heightened Spell (Special)',
				description:
					'When you cast a spell that forces a creature to make a saving throw, you can spend 2 Sorcery Points to give one target Disadvantage on saves against the spell.',
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
			{
				name: 'Strength of the Grave (Special)',
				description:
					"When damage (that isn't radiant or from a critical hit) reduces you to 0 HP, you can make a CHA saving throw (DC 5 + the damage taken). On a success, you instead drop to 1 HP (and can't use this feature again until you finish a long rest).",
			},
		],
		features: [
			{
				name: 'Deft Explorer',
				description:
					'You are an unsurpassed explorer and survivor, both in the wilderness and in dealing with others on your travels.',
			},
			{ name: 'Hit Points' },
			{
				name: 'Favored Foe',
				description:
					'When you hit a creature with an attack roll, you can mark the target as your favored enemy for 1 minute or until you lose your concentration (as if you were concentrating on a spell).',
			},
			{ name: 'Proficiencies' },
			{ name: 'Fighting Style', description: 'You adopt a particular style of fighting as your specialty.' },
			{
				name: 'Spellcasting',
				description:
					'You can cast known ranger spells using WIS as your spellcasting modifier (Spell DC 16, Spell Attack +8).',
			},
			{
				name: 'Primal Awareness',
				description:
					'You learn additional spells when you reach certain levels in this class if you don’t already know them, as shown in the Primal Awareness Spells table.',
			},
			{ name: 'Ranger Archetype' },
			{
				name: 'Primal Companion',
				description: 'You magically summon a primal beast, which draws strength from your bond with nature.',
			},
			{ name: 'Ability Score Improvement' },
			{ name: 'Extra Attack', description: 'You can attack twice whenever you take the Attack action on your turn.' },
			{
				name: 'Exceptional Training',
				description:
					"On any of your turns when your beast companion doesn’t attack, you can use a bonus action to command the beast to take the Dash, Disengage, or Help action on its turn. In addition, the beast's attacks now count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
			},
			{
				name: 'Land’s Stride',
				description:
					'Moving through nonmagical difficult terrain costs you no extra movement and you can also pass through nonmagical plants without being slowed by them and without taking damage from them. You have advantage on saving throws against plants that are magically created or manipulated to impede movement.',
			},
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
					'When you cast a spell with a casting time of an action, you can spend 2 Sorcery Points to change the casting time to a Bonus Action for this casting. You can’t modify a spell in this way if you’ve already cast a level 1+ spell on the current turn, nor can you cast a level 1+ spell on the current turn after modifying a spell in this way.',
			},
			{ name: 'Sorcerer Subclass' },
			{
				name: 'Eyes of the Dark',
				description:
					'You have darkvision out to 120 ft. [3rd] You learn the darkness spell and can cast it with a spell slot or by spending 2 sorcery points (you can see through the darkness created by the spell if cast with sorcery points).',
			},
			{
				name: 'Strength of the Grave',
				description:
					"When damage (that isn't radiant or from a critical hit) reduces you to 0 HP, you can make a CHA saving throw (DC 5 + the damage taken). On a success, you instead drop to 1 HP (and can't use this feature again until you finish a long rest).",
			},
			{ name: 'Ability Score Improvement' },
			{
				name: 'Sorcerous Restoration',
				description:
					'When you finish a Short Rest, you can regain up to 3 Sorcery Points. Once used, you can’t use this feature again until you finish a Long Rest.',
			},
			{
				name: 'Hound of Ill Omen',
				description:
					'As a bonus action, you can spend 3 sorcery points to magically summon a hound of ill omen (modified dire wolf) to target one creature you can see within 120 ft. of you.',
			},
			{ name: 'Ability Score Increase', description: 'Choose an ability score to increase by 2.' },
			{ name: 'Darkvision', description: 'You can see in darkness (shades of gray) up to 60 ft.' },
			{
				name: 'Fey Ancestry',
				description: 'You have advantage on saving throws against being charmed, and magic can’t put you to sleep.',
			},
			{ name: 'Skill Versatility', description: 'You gain proficiency in two skills of your choice.' },
			{ name: 'Piercer', description: 'Ability Score Increase. Increase your Str. or Dex. by 1.' },
			{ name: 'Charger', description: 'Ability Score Increase. Increase your Str. or Dex. by 1.' },
			{ name: 'Combat blessing of the Water Mages', description: 'Your maximum HP is increased by 5.' },
		],
		healthPoints: '95',
		armorClass: '16',
		walkingSpeed: '35ft.',
	},
	SAMANTHA: {
		abilityScores: [
			{ name: 'Strength', abbr: 'str', score: '+1', value: '13' },
			{ name: 'Dexterity', abbr: 'dex', score: '+2', value: '14' },
			{ name: 'Constitution', abbr: 'con', score: '+2', value: '14' },
			{ name: 'Intelligence', abbr: 'int', score: '+0', value: '10' },
			{ name: 'Wisdom', abbr: 'wis', score: '+4', value: '18' },
			{ name: 'Charisma', abbr: 'cha', score: '+0', value: '10' },
		],
		savingThrows: [
			{ name: 'str', value: '+1' },
			{ name: 'dex', value: '+2' },
			{ name: 'con', value: '+2' },
			{ name: 'int', value: '+0' },
			{ name: 'wis', value: '+7' },
			{ name: 'cha', value: '+3' },
		],
		spellData: [
			{
				groupName: 'Cantrip',
				spells: [
					{
						spellInfo: { spellName: 'Guidance', spellMetaInfo: 'Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Sacred Flame', spellMetaInfo: 'Cleric' },
						range: '60ft.',
						slotType: '1A',
						effect: '2d8',
					},
					{
						spellInfo: { spellName: 'Toll the Dead', spellMetaInfo: 'Legacy | Cleric' },
						range: '60ft.',
						slotType: '1A',
						effect: '2d8',
					},
					{
						spellInfo: { spellName: 'Word of Radiance', spellMetaInfo: 'Legacy | Cleric' },
						range: '5ft.',
						slotType: '1A',
						effect: '2d6',
					},
				],
			},
			{
				groupName: '1st Level',
				spells: [
					{
						spellInfo: { spellName: 'Bless', spellMetaInfo: 'Legacy | Cleric' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Cure Wounds', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: '1d8+7 ',
					},
					{
						spellInfo: { spellName: 'Guiding Bolt', spellMetaInfo: 'Cleric' },
						range: '120ft.',
						slotType: '1A',
						effect: '4d6*',
					},
					{
						spellInfo: { spellName: 'Healing Word', spellMetaInfo: 'Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: '2d4+7 ',
					},
					{
						spellInfo: { spellName: 'Inflict Wounds', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: '3d10',
					},
					{
						spellInfo: { spellName: 'Protection from Evil and Good', spellMetaInfo: 'Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Sanctuary', spellMetaInfo: 'Cleric' },
						range: '30ft.',
						slotType: '1BA',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Shield of Faith', spellMetaInfo: 'Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: 'Buff*',
					},
				],
			},
			{
				groupName: '2nd Level',
				spells: [
					{
						spellInfo: { spellName: 'Bless', spellMetaInfo: 'Legacy | Cleric' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Cure Wounds', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: '2d8+8 ',
					},
					{
						spellInfo: { spellName: 'Guiding Bolt', spellMetaInfo: 'Cleric' },
						range: '120ft.',
						slotType: '1A',
						effect: '5d6*',
					},
					{
						spellInfo: { spellName: 'Healing Word', spellMetaInfo: 'Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: '4d4+8 ',
					},
					{
						spellInfo: { spellName: 'Inflict Wounds', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: '4d10',
					},
					{
						spellInfo: { spellName: 'Lesser Restoration', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Blinded*',
					},
					{
						spellInfo: { spellName: 'Spiritual Weapon', spellMetaInfo: 'Legacy | Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: '1d8+4',
					},
				],
			},
			{
				groupName: '3rd Level',
				spells: [
					{
						spellInfo: { spellName: 'Amulet of Slow', spellMetaInfo: 'Amulet of Slow' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Control*',
					},
					{
						spellInfo: { spellName: 'Beacon of Hope', spellMetaInfo: 'Legacy | Cleric' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Bless', spellMetaInfo: 'Legacy | Cleric' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Cure Wounds', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: '3d8+9 ',
					},
					{
						spellInfo: { spellName: 'Dispel Magic', spellMetaInfo: 'Cleric' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Control',
					},
					{
						spellInfo: { spellName: 'Guiding Bolt', spellMetaInfo: 'Cleric' },
						range: '120ft.',
						slotType: '1A',
						effect: '6d6*',
					},
					{
						spellInfo: { spellName: 'Healing Word', spellMetaInfo: 'Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: '6d4+9 ',
					},
					{
						spellInfo: { spellName: 'Inflict Wounds', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: '5d10',
					},
					{
						spellInfo: { spellName: 'Magic Circle', spellMetaInfo: 'Cleric' },
						range: '10ft.',
						slotType: '1m',
						effect: '',
					},
					{
						spellInfo: { spellName: 'Mass Healing Word', spellMetaInfo: 'Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: '2d4+9 ',
					},
					{
						spellInfo: { spellName: 'Revivify', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: '1 ',
					},
					{
						spellInfo: { spellName: 'Spirit Guardians', spellMetaInfo: 'Cleric' },
						range: 'Self',
						slotType: '1A',
						effect: '3d8*',
					},
					{
						spellInfo: { spellName: 'Spirit Shroud', spellMetaInfo: 'Cleric' },
						range: 'Self',
						slotType: '1BA',
						effect: '1d8*',
					},
					{
						spellInfo: { spellName: 'Spiritual Weapon', spellMetaInfo: 'Legacy | Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: '1d8+4',
					},
				],
			},
			{
				groupName: '4th Level',
				spells: [
					{
						spellInfo: { spellName: 'Banishment', spellMetaInfo: 'Cleric' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Control*',
					},
					{
						spellInfo: { spellName: 'Bless', spellMetaInfo: 'Legacy | Cleric' },
						range: '30ft.',
						slotType: '1A',
						effect: 'Buff',
					},
					{
						spellInfo: { spellName: 'Cure Wounds', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: '4d8+10 ',
					},
					{
						spellInfo: { spellName: 'Death Ward', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: 'Buff*',
					},
					{
						spellInfo: { spellName: 'Dispel Magic', spellMetaInfo: 'Cleric' },
						range: '120ft.',
						slotType: '1A',
						effect: 'Control',
					},
					{
						spellInfo: { spellName: 'Guardian of Faith', spellMetaInfo: 'Legacy | Cleric' },
						range: '30ft.',
						slotType: '1A',
						effect: '20*',
					},
					{
						spellInfo: { spellName: 'Guiding Bolt', spellMetaInfo: 'Cleric' },
						range: '120ft.',
						slotType: '1A',
						effect: '7d6*',
					},
					{
						spellInfo: { spellName: 'Healing Word', spellMetaInfo: 'Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: '8d4+10 ',
					},
					{
						spellInfo: { spellName: 'Inflict Wounds', spellMetaInfo: 'Legacy | Cleric' },
						range: 'Touch',
						slotType: '1A',
						effect: '6d10',
					},
					{
						spellInfo: { spellName: 'Magic Circle', spellMetaInfo: 'Cleric' },
						range: '10ft.',
						slotType: '1m',
						effect: '',
					},
					{
						spellInfo: { spellName: 'Mass Healing Word', spellMetaInfo: 'Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: '3d4+10 ',
					},
					{
						spellInfo: { spellName: 'Spirit Guardians', spellMetaInfo: 'Cleric' },
						range: 'Self',
						slotType: '1A',
						effect: '4d8*',
					},
					{
						spellInfo: { spellName: 'Spirit Shroud', spellMetaInfo: 'Cleric' },
						range: 'Self',
						slotType: '1BA',
						effect: '1d8*',
					},
					{
						spellInfo: { spellName: 'Spiritual Weapon', spellMetaInfo: 'Legacy | Cleric' },
						range: '60ft.',
						slotType: '1BA',
						effect: '2d8+4',
					},
				],
			},
		],
		actionData: [
			{
				name: 'Channel Divinity: Preserve Life ',
				description:
					'As an action, you can restore 40 HP. Choose any creatures within 30 ft. of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can’t use this feature on an undead or a construct.',
			},
			{
				name: 'Channel Divinity: Turn Undead ',
				description:
					'As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a WIS saving throw (DC 15). If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there’s nowhere to move, the creature can use the Dodge action.',
			},
			{
				name: 'Unarmed Strike ',
				description:
					'You make a melee attack that involves using your body to deal one of the following effects:Damage. You make an attack roll against the creature, and on a hit, you deal 1 + STR Bludgeoning damage.Grapple. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or it has the Grappled condition.Shove. The target must succeed on a Str./Dex. (it chooses which) saving throw (DC = 8 + Prof. Bonus + Str.) or you can either push it 5 ft. away or cause it to have the Prone condition.',
			},
			{
				name: 'Blessed Healer (No Action)',
				description:
					'When you cast a spell of 1st level or higher that restores HP to a creature other than you, you regain HP equal to 2 + the spell’s level.',
			},
			{
				name: 'Channel Divinity (Special)',
				description: 'You can channel divine energy to fuel magical effects a number of times per short rest.',
			},
			{
				name: 'Destroy Undead (Special)',
				description:
					'At 5th level, when an undead fails its saving throw against your Turn Undead feature, it is instantly destroyed if it is of CR ½ or lower.At 8th level and higher, it is instead destroyed if it is of CR 1 or lower.',
			},
		],
		features: [
			{ name: 'Hit Points' },
			{ name: 'Proficiencies' },
			{
				name: 'Spellcasting',
				description:
					'You can cast prepared cleric spells using WIS as your spellcasting modifier (Spell DC 15, Spell Attack +7) and prepared cleric spells as rituals if they have the ritual tag. You can use a holy symbol as a spellcasting focus.',
			},
			{
				name: 'Divine Domain',
				description:
					'You choose a divine domain that grants you additional spells and other features related to your deity.',
			},
			{ name: 'Bonus Proficiency', description: 'You gain proficiency with heavy armor.' },
			{
				name: 'Disciple of Life',
				description:
					'Whenever you use a spell of 1st level or higher to restore HP, the creature regains additional HP equal to 2 + the spell’s level.',
			},
			{
				name: 'Channel Divinity',
				description: 'You can channel divine energy to fuel magical effects a number of times per short rest',
			},
			{
				name: 'Channel Divinity: Preserve Life',
				description:
					'As an action, you can restore 40 HP. Choose any creatures within 30 ft. of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can’t use this feature on an undead or a construct.',
			},
			{ name: 'Ability Score Improvement' },
			{
				name: 'Destroy Undead',
				description:
					'When an undead fails its saving throw against your Turn Undead feature, it is instantly destroyed if its CR is lower than the threshold for your level.',
			},
			{
				name: 'Blessed Healer',
				description:
					'When you cast a spell of 1st level or higher that restores HP to a creature other than you, you regain HP equal to 2 + the spell’s level.',
			},
			{
				name: 'Divine Strike',
				description:
					'Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage.',
			},
			{ name: 'Ability Score Increase', description: 'Your Dexterity score increases by 2.' },
			{
				name: 'Lucky',
				description:
					'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
			},
			{ name: 'Brave', description: 'You have advantage on saving throws against being frightened.' },
			{
				name: 'Halfling Nimbleness',
				description: 'You can move through the space of any creature that is of a size larger than yours.',
			},
			{ name: 'Ability Score Increase', description: 'Your Charisma score increases by 1.' },
			{
				name: 'Naturally Stealthy',
				description:
					'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',
			},
			{ name: "Caster's Blessing of Mystra" },
			{
				name: 'Trained with Cord',
				description: 'Your training with Cord helped you get +1 to hit and +1 to damage with Two-Handed weapons.',
			},
			{ name: "Tecla's Stew", description: 'Your maximum HP is increased by 5' },
		],
		healthPoints: '61',
		armorClass: '19',
		walkingSpeed: '45ft.',
	},
	SMASHERINA: {},
};
