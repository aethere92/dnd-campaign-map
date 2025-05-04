const CAMPAIGN_001_TIMELINE = [
	{
		id: 1,
		title: `Story begins`,
		location: `Small town, near Baldur's Gate`,
		session: '1',
		items: [
			{
				type: 'narrative',
				actors: 'Entire party',
				sublocation: 'Tavern',
			},
		],
	},
	{
		id: 2,
		title: `Unnamed island`,
		location: `Unnamed island #1`,
		session: '2',
		items: [
			{
				type: 'encounter',
				actors: 'Dinosaurs',
				sublocation: 'Forest',
			},
			{
				type: 'narrative',
				actors: 'Entire party',
				sublocation: 'Lake',
			},
			{
				type: 'encounter',
				actors: 'Finneas & Undeads',
				sublocation: 'Platforms',
			},
			{
				type: 'narrative',
				actors: 'Entire party',
				sublocation: 'Forest',
			},
		],
	},
	{
		id: 3,
		title: `Uncharted waters`,
		location: `Middle of ocean`,
		session: '3',
		items: [
			{
				type: 'encounter',
				actors: 'Bone wraiths',
			},
		],
	},
	{
		id: 4,
		title: 'Reaching Korinis Island',
		location: 'Korinis Island',
		session: '4',
		items: [
			{
				type: 'narrative',
				actors: 'Party & Bandit',
				sublocation: 'Crossroads',
			},
			{
				type: 'encounter',
				actors: 'Bandits',
				sublocation: 'Bandit cave',
			},
			{
				type: 'narrative',
				actors: 'Farmers',
				sublocation: 'Lobart Farm',
				is_new_session: true,
			},
			{
				type: 'narrative',
				actors: 'Shady merchant',
				sublocation: 'Lobart Farm',
			},
		],
	},
	{
		id: 5,
		title: 'Korinis City',
		location: 'Korinis City',
		session: '3 & 4',
		items: [
			{
				type: 'narrative',
				actors: 'Paladin',
				sublocation: 'Lower city fountain',
			},
			{
				type: 'narrative',
				actors: 'Entire party',
				sublocation: 'Lower city inn',
			},
			{
				type: 'narrative',
				actors: 'Town guards',
				sublocation: 'East city exit',
				is_new_session: true,
			},
		],
	},
	{
		id: 6,
		title: 'To Fire Mages Cathedral',
		location: 'Korinis Island',
		session: '4',
		items: [
			{
				type: 'encounter',
				actors: 'Pack of wolves',
				sublocation: 'Forest',
			},
			{
				type: 'narrative',
				actors: 'Erol',
				sublocation: 'Bridge',
			},
			{
				type: 'narrative',
				actors: 'Isgaroth',
				sublocation: 'Fire Mages Shrine',
			},
			{
				type: 'narrative',
				actors: 'Entire party',
				sublocation: 'Inn',
			},
			{
				type: 'narrative',
				actors: 'Entire party',
				sublocation: 'Korinis Inn',
			},
		],
	},
	{
		id: 7,
		title: 'First lizardmen encounter',
		location: 'Korinis forest',
		session: '5',
		items: [
			{
				type: 'encounter',
				actors: 'Lizardman & Goblins',
				sublocation: 'Korinis Forest',
			},
			{
				type: 'encounter',
				actors: 'Bandits',
				sublocation: 'Bandit hideout',
			},
			{
				type: 'narrative',
				actors: 'Party & Paladin',
				sublocation: 'Lower city fountain',
			},
		],
	},
	{
		id: 8,
		title: 'Towards the pyramids',
		location: 'Korinis Island',
		session: '8',
		items: [
			{
				type: 'traversal',
				actors: 'Entire party',
				sublocation: 'Secob Farm',
			},
			{
				type: 'narrative',
				actors: 'Party & Troll',
				sublocation: 'Bridge before pyramids',
			},
			{
				type: 'investigation',
				actors: 'Entire party',
				sublocation: 'Water mages tents',
			},
		],
	},
	{
		id: 9,
		title: 'Water Mages Pyramid',
		location: 'Korinis Pyramids',
		session: 8,
		items: [
			{
				type: 'encounter',
				actors: 'Lich & undeads',
				sublocation: 'Water Mages Pyramid',
			},
			{
				type: 'narrative',
				actors: 'Party & Water Mages',
				sublocation: 'Pyramid',
			},
		],
	},
];
