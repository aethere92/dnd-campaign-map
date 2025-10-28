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
		date: 'Apr 12th',
		content: 'session_data/session_001/session_001_content.md',
		recap: 'session_data/session_001/session_001_recap.md',
	},
	{
		id: 'session-002',
		title: "01 - To Drellin's Ferry",
		date: 'Apr 12th',
		content: 'session_data/session_002/session_002_content.md',
		recap: 'session_data/session_002/session_002_recap.md',
		factual_recap: 'session_data/session_002/session_002_factual.md',
		name_db: 'session_data/session_002/session_002_name_db.md',
	},
	{
		id: 'session-003',
		title: '02 - Witchwood',
		date: 'May 1st',
		content: 'session_data/session_003/session_003_content.md',
		recap: 'session_data/session_003/session_003_recap.md',
		factual_recap: 'session_data/session_003/session_003_factual.md',
		name_db: 'session_data/session_003/session_003_name_db.md',
	},
	{
		id: 'session-004',
		title: '03 - Into the Depths',
		date: 'Jun 7th',
		content: 'session_data/session_004/session_004_content.md',
		recap: 'session_data/session_004/session_004_recap.md',
		factual_recap: 'session_data/session_004/session_004_factual.md',
		name_db: 'session_data/session_004/session_004_name_db.md',
		progression: {
			loot: [
				{
					id: 'reptile-loot-01',
					data: [
						{
							itemName: 'Old jewelry',
							count: 1,
							rarity: 'common',
							description: 'Worth 10 gold pieces',
							owner: 'Entire party',
						},
						{
							itemName: 'Vials with mysterious elixirs',
							count: 2,
							rarity: 'uncommon',
							description: 'N/A',
							owner: 'Bonnie',
						},
						{ itemName: 'Magical Bow', count: 1, rarity: 'uncommon', description: 'N/A', owner: 'Entire party' },
						{ itemName: 'Enchanted Helmet', count: 1, rarity: 'uncommon', description: 'N/A', owner: 'Entire party' },
					],
				},
			],
		},
	},
	{
		id: 'session-005',
		title: '04 - Echoes of the Arena',
		date: 'Jul 8th',
		content: 'session_data/session_005/session_005_content.md',
		recap: 'session_data/session_005/session_005_recap.md',
		factual_recap: 'session_data/session_005/session_005_factual.md',
		name_db: 'session_data/session_005/session_005_name_db.md',
		progression: {
			loot: [],
		},
	},
	{
		id: 'session-006',
		title: '05 - Pirates, Pelts, and Cargo',
		date: 'Jul 8th',
		content: 'session_data/session_006/session_006_content.md',
		recap: 'session_data/session_006/session_006_recap.md',
		factual_recap: 'session_data/session_006/session_006_factual.md',
		name_db: 'session_data/session_006/session_006_name_db.md',
		progression: {
			loot: [],
		},
	},
	{
		id: 'session-007',
		title: '06 - The Ruined Fortress',
		date: 'Jul 8th',
		content: 'session_data/session_007/session_007_content.md',
		recap: 'session_data/session_007/session_007_recap.md',
		factual_recap: 'session_data/session_007/session_007_factual.md',
		name_db: 'session_data/session_007/session_007_name_db.md',
		progression: {
			loot: [],
		},
	},
	{
		id: 'session-008',
		title: '07 - Assault on the Fortress',
		date: 'Aug 4th',
		content: 'session_data/session_008/session_008_content.md',
		recap: 'session_data/session_008/session_008_recap.md',
		factual_recap: 'session_data/session_008/session_008_factual.md',
		name_db: 'session_data/session_008/session_008_name_db.md',
		progression: {
			loot: [],
		},
	},
	{
		id: 'session-009',
		title: '08 - The Shattered Artifact',
		date: 'Oct 18th',
		content: 'session_data/session_009/session_009_content.md',
		recap: 'session_data/session_009/session_009_recap.md',
		factual_recap: 'session_data/session_009/session_009_factual.md',
		name_db: 'session_data/session_009/session_009_name_db.md',
		progression: {
			loot: [],
		},
	},
];
