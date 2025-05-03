const CAMPAIGN_002_TIMELINE = [
	{
		id: 1,
		title: `Woods before Drellyn's Ferry`,
		location: `Near Drellyn's Ferry`,
		session: '1',
		items: [
			{
				type: 'encounter',
				actors: 'Hobgoblins',
			},
			{
				type: 'narrative',
				actors: 'Hobgoblin interrogation',
				sublocation: 'Abandoned farmhouse',
			},
		],
	},
	{
		id: 2,
		title: `Reaching Drellyn's Ferry`,
		location: `Drellyn's Ferry`,
		session: '1 & 2',
		items: [
			{
				type: 'narrative',
				actors: 'Bonnie & Olek',
				sublocation: 'Tollhouse',
			},
			{
				type: 'narrative',
				actors: 'Soshi & Norr',
				sublocation: 'Shrine of Pelor',
			},
			{
				type: 'narrative',
				actors: 'Kaedin',
				sublocation: 'House of Sertieren',
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
