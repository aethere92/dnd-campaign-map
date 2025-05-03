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
		items: [
			{
				type: 'encounter',
				actors: 'Hobgoblins',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'the-fight' },
			},
			{
				type: 'narrative',
				actors: 'Hobgoblin interrogation',
				sublocation: 'Abandoned farmhouse',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'interrogation' },
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
				actors: '[ENTITY:character:Entire party]',
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
		session: '2',
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party]',
				sublocation: null,
			},
		],
	},
];
