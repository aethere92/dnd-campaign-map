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
				description: `The [ENTITY:character:Entire party] engages into a fight with hobgoblins. They fight as a team and manage to defeat the hobgoblins, killing their captain and making the remaining still alive run in defeat. `,
			},
			{
				type: 'narrative',
				actors: 'Hobgoblin interrogation',
				sublocation: 'Abandoned farmhouse',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'interrogation' },
				description: `The party interrogates a captured hobgoblin, with [ENTITY:character:Bonnie] leading the questioning and Olek ensuring honesty through magic. Despite their efforts, the creature refuses to speak until [ENTITY:character:Olek] promises him a swift death in exchange for answers. They learn of [ENTITY:npc:Wyrmlord Koth], a powerful sorcerer gathering forces for "the Day of Ruin," but their attempts to get a location fail. A strange symbol they found elicits a reaction, but no explanation follows. When the group considers taking the prisoner to town for further interrogation, [ENTITY:character:Olek] ultimately honors his word and delivers the promised death.`,
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party]',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'towards-drellins-ferry' },
				description: `As they made their way towards Drellin's Ferry, [ENTITY:character:Olek] and [ENTITY:character:Bonnie] scared a farmer and their son who were going on the way towards the abandoned farmhouse.`,
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
				type: 'traversal',
				actors: '[ENTITY:character:Entire party]',
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
