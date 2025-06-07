// SAMPLE ON HOW LOOT LOOKS.
// progression: {
// 	loot: [
// 		{ id: 'farmhouse-01', data: [
// 			{ itemName: 'Rusty Shortsword', count: 2, rarity: 'common', description: 'Standard hobgoblin issue, slightly worn.', owner: 'Party' },
// 			{ itemName: 'Leather Armor Scrap', count: 1, rarity: 'common', description: 'Torn leather armor piece.', owner: 'Party' },
// 			{ itemName: 'Gold Pieces', count: 15, rarity: 'common', description: 'Scattered coins.', owner: 'Party' }
// 		]},
// 		{ id: 'cart-01', data: [
// 			{ itemName: 'Poorly Made Wine', count: 1, rarity: 'common', description: 'A bottle of questionable vintage.', owner: 'Bonnie' },
// 			{ itemName: 'Vegetables', count: 5, rarity: 'common', description: 'Assorted fresh greens.', owner: 'Returned' },
// 			{ itemName: 'Simple Foods', count: 3, rarity: 'common', description: 'Basic travel rations.', owner: 'Returned' }
// 		]}
// 	]
// },

const CAMPAIGN_002_RECAPS = [
	{
		id: 'session-001',
		title: 'Introduction',
		date: 'April 12th',
		content: 'session_data/session_001/session_001_content.md',
		recap: 'session_data/session_001/session_001_recap.md',
	},
	{
		id: 'session-002',
		title: "001 - To Drellin's Ferry",
		date: 'April 12th',
		content: 'session_data/session_002/session_002_content.md',
		recap: 'session_data/session_002/session_002_recap.md',
	},
	{
		id: 'session-003',
		title: '002 - Witchwood',
		date: 'May 1st',
		content: 'session_data/session_003/session_003_content.md',
		recap: 'session_data/session_003/session_003_recap.md',
	},
	{
		id: 'session-004',
		title: '003 - Into the Depths',
		date: 'June 7th',
		content: 'session_data/session_004/session_004_content.md',
		recap: 'session_data/session_004/session_004_recap.md',
		progression: {
			loot: [
				{
					id: 'reptile-loot-01',
					data: [
						{ itemName: 'Old jewelry', count: 1, rarity: 'common', description: 'Worth 10 pieces', owner: 'Party' },
						{
							itemName: 'Vials with misterious elixirs',
							count: 2,
							rarity: 'uncommon',
							description: 'N/A',
							owner: 'Bonnie',
						},
						{ itemName: 'Magical Bow', count: 1, rarity: 'uncommon', description: 'N/A', owner: 'Party' },
						{ itemName: 'Enchanted Helmet', count: 1, rarity: 'uncommon', description: 'N/A', owner: 'Party' },
					],
				},
			],
		},
	},
];
