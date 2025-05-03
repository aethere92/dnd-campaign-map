const CAMPAIGN_002_TIMELINE = [
	{
		id: 1,
		title: `Woods before Drellyn's Ferry`,
		location: `Near Drellyn's Ferry`,
		session: '1',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
		},
		items: [
			{
				type: 'encounter',
				actors: 'Hobgoblins',
				url: {
					campaign: 'campaign-002',
					session: 'session-002',
					target: 'the-fight',
				},
			},
			{
				type: 'narrative',
				actors: 'Hobgoblin interrogation',
				sublocation: 'Abandoned farmhouse',
				url: {
					campaign: 'campaign-002',
					session: 'session-002',
					target: 'interrogation',
				},
			},
		],
	},
	{
		id: 2,
		title: `Reaching Drellyn's Ferry`,
		location: `Drellyn's Ferry`,
		session: '1 & 2',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
			target: 'reaching-drellins-ferry',
		},
		items: [
			{
				type: 'narrative',
				actors: 'Bonnie & Olek',
				sublocation: 'Tollhouse',
				url: {
					campaign: 'campaign-002',
					session: 'session-002',
					target: 'olek-and-bonnie',
				},
			},
			{
				type: 'narrative',
				actors: 'Soshi & Norr',
				sublocation: 'Shrine of Pelor',
				url: {
					campaign: 'campaign-002',
					session: 'session-002',
					target: 'norr-and-soshi',
				},
			},
			{
				type: 'narrative',
				actors: 'Kaedin',
				sublocation: 'House of Sertieren',
				url: {
					campaign: 'campaign-002',
					session: 'session-002',
					target: 'kaedin',
				},
			},
			{
				type: 'narrative',
				actors: 'Entire party',
				sublocation: 'Town Inn',
				is_new_session: true,
			},
		],
	},
	{
		id: 3,
		title: 'Going into Witchwoods',
		location: 'Witchwoods',
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
		title: "Back to Drellyn's Ferry",
		location: `Drellyn's Ferry`,
		session: '2',
		items: [
			{
				type: 'narrative',
				actors: 'Entire party',
				sublocation: null,
			},
		],
	},
];
