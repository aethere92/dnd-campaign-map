const CAMPAIGN_002_TIMELINE = [
	{
		id: 1,
		title: `Woods before Drellin's Ferry`,
		location: `Near [ENTITY:location:Drellin's Ferry]`,
		session: '1',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
		},
		description: ``,
		items: [
			{
				type: 'encounter',
				actors: 'Hobgoblins',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'the-fight' },
				description: `The [ENTITY:character:Entire party:Party] engages into a fight with hobgoblins. They fight as a team and manage to defeat the hobgoblins, killing their captain and making the remaining still alive run in defeat. `,
			},
			{
				type: 'narrative',
				actors: 'Hobgoblin interrogation',
				sublocation: 'Abandoned farmhouse',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'interrogation' },
				description: `The party interrogates a captured hobgoblin, with [ENTITY:character:Bonnie] leading the questioning and [ENTITY:character:Olek] ensuring honesty through magic. Despite their efforts, the creature refuses to speak until [ENTITY:character:Olek] promises him a swift death in exchange for answers. They learn of [ENTITY:npc:Wyrmlord Koth], a powerful sorcerer gathering forces for "the Day of Ruin," but their attempts to get a location fail. A strange symbol they found elicits a reaction, but no explanation follows. When the group considers taking the prisoner to town for further interrogation, [ENTITY:character:Olek] ultimately honors his word and delivers the promised death.`,
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'towards-drellins-ferry' },
				description: `As they made their way towards [ENTITY:location:Drellin's Ferry], [ENTITY:character:Olek] and [ENTITY:character:Bonnie] scared a farmer and their son who were going on the way towards the abandoned farmhouse.`,
			},
		],
	},
	{
		id: 2,
		title: `Reaching Drellin's Ferry`,
		location: `[ENTITY:location:Drellin's Ferry]`,
		session: '1 & 2',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
			target: 'reaching-drellins-ferry',
		},
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Bonnie] & [ENTITY:character:Olek]',
				sublocation: 'Tollhouse',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'olek-and-bonnie' },
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Soshi] & [ENTITY:character:Norr]',
				sublocation: 'Shrine of Pelor',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'norr-and-soshi' },
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Kaedin]',
				sublocation: 'House of Sertieren',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'kaedin' },
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Town Inn',
				is_new_session: true,
			},
		],
	},
	{
		id: 3,
		title: 'Going into the Witchwood',
		location: 'The [ENTITY:location:Witchwood]',
		session: '2',
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Into the woods',
			},
			{
				type: 'encounter',
				actors: 'Hydra & Hobgoblins',
			},
			{
				type: 'encounter',
				actors: 'Wargs',
			},
		],
	},
	{
		id: 4,
		title: "Back to Drellin's Ferry",
		location: `[ENTITY:location:Drellin's Ferry]`,
		session: '2 & 3',
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: null,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:npc:Soranna]',
				sublocation: 'Tollhouse',
				is_new_session: true,
				description: `Talked to Soranna, found out about Kat and Yoghurt and tunnel.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: '[ENTITY:location:Green Apple Inn]',
				description: 'N/A',
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: `Anya's house`,
				description: 'N/A',
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Summoner], [ENTITY:npc:Vandal]',
				sublocation: `[ENTITY:location:Green Apple Inn]`,
				description: 'Talked with Winter Rose',
			},
		],
	},
	{
		id: 5,
		title: 'Dawn of a new day',
		location: `[ENTITY:location:Drellin's Ferry]`,
		session: '3',
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
				sublocation: `[ENTITY:location:Green Apple Inn]`,
				description: 'Talked with the two guards.',
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'To Avarthel',
			},
			{
				type: 'narrative',
				actors: 'Hydra eggs talk',
				sublocation: "Avarthel's Grove",
				description: 'Talked about eggs.',
			},
			{
				type: 'narrative',
				actors: 'Potions from [ENTITY:npc:Jareth]',
				sublocation: 'Town market',
				description: 'Met potion seller Jareth.',
			},
			{
				type: 'narrative',
				actors: 'Talking to [ENTITY:npc:Lem]',
				sublocation: `Tollhouse`,
				description: 'Spoke to Lem about Anya.',
			},
			{
				type: 'investigation',
				actors: 'Finding [ENTITY:npc:Anya]',
				sublocation: `Forest Pond`,
				description: 'Found Anya in the woods, brought her to Avarthel.',
			},
			{
				type: 'encounter',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
				sublocation: `[ENTITY:location:Green Apple Inn]`,
				description: 'Helped break up tavern brawl non-lethally.',
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
				sublocation: 'Temple tunnel entrance',
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
				sublocation: `Temple entrance`,
				description: 'Passed through magical barrier; Kat & Yoghurt blocked.',
			},
		],
	},
	{
		id: 7,
		title: 'The Sunken Temple',
		location: `Sunken Temple`,
		session: '3',
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Temple Hallways',
				description: 'Chose the reptile path. Encountered traps and poisonous creatures.',
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Leech pond',
				description: 'Bypassed massive guardian creature using stealth.',
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Flooded room',
				description: 'Found note about Demon Lord disciples creating monsters.',
			},
			{
				type: 'encounter',
				actors: 'Reptile',
				sublocation: 'Underground Lab',
				description: 'Fought and polymorphed monstrous reptile; looted magical items.',
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
				sublocation: 'Rune platform',
				description: 'Activated rune with Winter Rose, opening new path.',
			},
		],
	},

	// SESSION 008
	{
		id: 8,
		title: 'The Shattered Artifact',
		location: `Corrupted Fortress`,
		session: '8',
		items: [
			{
				type: 'encounter',
				actors: '[ENTITY:character:Entire party:Party], Red Hand Army, Dragonkin',
				sublocation: 'Ritual Chamber',
				description: `An army breaches the chamber wall. [ENTITY:character:Bonnie] uses Fairy Fire while [ENTITY:character:Olek] discovers his divine connection is severed by corrupting magic. [ENTITY:character:Norr]'s wild magic triggers a Fireball centered on herself, devastating both party and enemies. [ENTITY:character:Soshi] summons spectral cats while [ENTITY:character:Kaedin] and [ENTITY:character:Olek] form a defensive line. The party battles orcs, soldiers, and dragonkin leaders. [ENTITY:character:Bonnie] assassinates a dragonkin using her medallion's teleportation and greater invisibility.`,
			},
			{
				type: 'narrative',
				actors: 'Ritualist death & Artifact',
				sublocation: 'Ritual Chamber',
				description: `With the ritualist's death, the artifact releases uncontrolled necrotic energy, intensifying the land's corruption. The artifact becomes unstable and detonates in a catastrophic explosion, casting the party into apocalyptic visions.`,
			},
			{
				type: 'vision',
				actors: '[ENTITY:character:Olek], [ENTITY:character:Norr]',
				sublocation: 'Blighted Paladin Fortress',
				description: `[ENTITY:character:Olek] and [ENTITY:character:Norr] witness a corrupted fortress overrun by crystalline growths. The impaled commander reveals [ENTITY:npc:Lamashtu]'s cults infiltrated after the Battle for Bremen depleted their ranks. He speaks of defeat caused by the Angevin fleet and their resurrected god [ENTITY:npc:Kresimir] attacking from the harbor. [ENTITY:character:Norr] notices her right arm is replaced by a prosthetic in this dark future.`,
			},
			{
				type: 'vision',
				actors: '[ENTITY:character:Kaedin]',
				sublocation: 'Burning Village',
				description: `[ENTITY:character:Kaedin] finds his neighboring village ablaze. He rescues two children who reveal invaders bearing a yellow banner with a blue bear sigil, accompanied by Red Hand symbols, came two days prior and took villagers as slaves for a ritual. They warn his home village is next.`,
			},
			{
				type: 'vision',
				actors: '[ENTITY:character:Bonnie]',
				sublocation: 'The Feywild',
				description: `[ENTITY:character:Bonnie] witnesses Titania and the Queen of Air and Darkness fighting together against a warrior wielding energy spears. Chromatic dragons destroy pegasus knights and hippogriff riders while Spring and Autumn courts are annihilated. Only unknown paladins hold the line against Red Hand forces, black orcs, and blue bear warriors. The warrior defeats both queens and steals their crowns, dooming the Feywild to wither.`,
			},
			{
				type: 'vision',
				actors: '[ENTITY:character:Soshi]',
				sublocation: 'Siege of Neverwinter',
				description: `[ENTITY:character:Soshi] finds herself chained on a platform with hundreds of prisoners before Neverwinter's walls. A Red Wizard of Thay forces them to power a ritual to breach the city. Blue Bear banners dominate the siege, with chromatic dragons circling overhead and the Arcane Brotherhood overseeing the death ritual.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Yoghurt]',
				sublocation: 'Outside the Fortress',
				description: `The party recovers from the explosion and their shared visions. [ENTITY:npc:Yoghurt] appears, having followed them, dragging corpses of shadow-clad scouts with blackened veins. [ENTITY:character:Bonnie] discovers they're foreigners, likely corrupted agents.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Yoghurt]',
				sublocation: 'Outside the Fortress',
				description: `[ENTITY:character:Bonnie] writes an urgent letter to [ENTITY:npc:Soranna] detailing the approaching army's four-day timeline, the visions, enemy factions (Red Hand, Blue Bear, Arcane Brotherhood, chromatic dragons), and warns against trusting the Arcane Brotherhood. She pays [ENTITY:npc:Yoghurt] three gold and makes him swear to deliver it only to [ENTITY:npc:Soranna], not [ENTITY:npc:Kat], promising his Raven master will hear of his service.`,
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Towards the Bridge',
				description: `Armed with knowledge of the apocalyptic future, the party sets off toward their immediate goal: reaching and destroying the bridge to buy the North time against the coming war.`,
			},
		],
	},
];
