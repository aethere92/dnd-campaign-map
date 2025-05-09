const CAMPAIGN_002_CHARACTERS = [
	{
		name: 'Bonnie',
		race: 'Pixie',
		class: 'Rogue',
		level: 6,
		icon: 'images/assets/character_thumbnails/campaign_002/bonnie.jpeg',
		background: CAMPAIGN_02_BACKGROUNDS.BONNIE.background,
		shortDescription: CAMPAIGN_02_BACKGROUNDS.BONNIE.shortDescription,
		stats: {
			abilityScores: { STR: 8, DEX: 19, CON: 14, INT: 14, WIS: 10, CHA: 12 },
			metadata: CAMPAIGN_002_METADATA.BONNIE,
		},
		is_included: true,
	},
	{
		name: 'Kaedin',
		race: 'Earth Genasi',
		class: 'Echo Knight',
		level: 6,
		icon: 'images/assets/character_thumbnails/campaign_002/kaedin.jpeg',
		imageBg: 'images/assets/campaign_002/characters/kaedin_bg.jpg',
		background: CAMPAIGN_02_BACKGROUNDS.KAEDIN.background,
		shortDescription: CAMPAIGN_02_BACKGROUNDS.KAEDIN.shortDescription,
		stats: {
			abilityScores: { STR: 18, DEX: 12, CON: 16, INT: 10, WIS: 13, CHA: 8 },
			metadata: CAMPAIGN_002_METADATA.KAEDIN,
		},
		is_included: true,
	},
	{
		name: 'Norr',
		race: 'Human',
		class: 'Sorcerer',
		level: 6,
		icon: 'images/assets/character_thumbnails/campaign_002/norr.jpeg',
		background: CAMPAIGN_02_BACKGROUNDS.NORR.background,
		shortDescription: CAMPAIGN_02_BACKGROUNDS.NORR.shortDescription,
		stats: {
			abilityScores: { STR: 8, DEX: 14, CON: 14, INT: 10, WIS: 12, CHA: 18 },
			metadata: CAMPAIGN_002_METADATA.NORR,
		},
		is_included: true,
	},
	{
		name: 'Olek',
		race: 'Aasimar',
		class: 'Paladin',
		level: 6,
		icon: 'images/assets/character_thumbnails/campaign_002/olek.jpeg',
		background: CAMPAIGN_02_BACKGROUNDS.OLEK.background,
		shortDescription: CAMPAIGN_02_BACKGROUNDS.OLEK.shortDescription,
		stats: {
			abilityScores: { STR: 14, DEX: 8, CON: 14, INT: 10, WIS: 12, CHA: 18 },
			metadata: CAMPAIGN_002_METADATA.OLEK,
		},
		is_included: true,
	},
	{
		name: 'Soshi',
		race: 'Elf',
		class: 'Wizard',
		level: 6,
		icon: 'images/assets/character_thumbnails/campaign_002/soshi.jpeg',
		imageBg: 'images/assets/campaign_002/characters/soshi_bg.jpeg',
		background: CAMPAIGN_02_BACKGROUNDS.SOSHI.background,
		shortDescription: CAMPAIGN_02_BACKGROUNDS.SOSHI.shortDescription,
		stats: {
			abilityScores: { STR: 8, DEX: 15, CON: 16, INT: 15, WIS: 12, CHA: 10 },
			metadata: CAMPAIGN_002_METADATA.SOSHI,
		},
		is_included: true,
	},
	{
		name: 'Entire party',
		race: 'Pixie | Earth Genasi | Human | Aasimar | Elf',
		class: 'Rogue | Echo Knight | Sorcerer | Paladin | Wizard',
		icon: 'images/pageicon.png',
		level: 6,
		is_included: false,
		shortDescription: `<p style="margin: 0; padding-block: 0"><strong>Olek</strong>, a Paladin of Helm, walks with the calm strength of one touched by the divine.<br>
			<strong>Norr</strong>, a Sorcerer touched by dragon's blood and haunted by a stolen map. <br>
			<strong>Soshi</strong> — a Feyborn wizard who traded whimsy for power. <br>
			<strong>Kaedin</strong>, the Echo Knight genasi who seeks a friend lost to a trap and a mystery buried in time.<br>
			<strong>Bonnie</strong> — a rogue pixie exiled from the Feywilds for loving too deeply and breaking too many rules.</p>`,
	},
];
