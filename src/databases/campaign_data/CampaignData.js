const CAMPAIGN_DATA = [
	{
		id: 'campaign-001',
		campaignId: 1,
		metadata: {
			name: "A quest, a questin' we shall go",
			description:
				'Six adventurers receive mysterious invitations to a strange, distant land. Teaming up with pirates, they battle monsters and navigate treacherous seas toward the enigmatic island of Korinis.',
			levelRange: '3-8',
			characters: CAMPAIGN_001_CHARACTERS,
			charactersPosition: 'left',
			// Remove campaignType - we'll determine this dynamically based on available data
		},
		styling: {
			icon: 'images/pageicon.png',
			backgroundColor: '#795548',
		},
		defaultMap: 'korinis_island',
		data: CAMPAIGN_01, // Map data
		aliases: CAMPAIGN_01_ALIASES,
		recaps: CAMPAIGN_001_RECAPS, // Story data
		timeline: CAMPAIGN_001_TIMELINE, // Story timeline
		api_data: CAMPAIGN_001_API_DATA, // Story API data
	},
	{
		id: 'campaign-002',
		campaignId: 2,
		metadata: {
			name: 'The Red Hand of Doom',
			description: `Five unlikely heroes journey through lush subtropical forests. Bound by shared purpose or hidden motives, their story begins on a wild path where camaraderie grows with each step.`,
			levelRange: '6+',
			characters: CAMPAIGN_002_CHARACTERS,
			charactersPosition: 'right',
		},
		styling: {
			icon: 'images/pageicon.png',
		},
		recaps: CAMPAIGN_002_RECAPS,
		timeline: CAMPAIGN_002_TIMELINE,
		api_data: CAMPAIGN_002_API_DATA,
		quests: CAMPAIGN_002_QUESTS,
		npcs: CAMPAIGN_002_NPCS,
		locations: CAMPAIGN_002_LOCATIONS,
	},
];
