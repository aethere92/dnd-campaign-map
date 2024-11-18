const MAP_ALIASES = {
	world_map: 'world_maps',

	// UNNAMED ISLAND
	unnamed_island_01: 'world_maps.submaps.islands.unnamed_island_01',
	finneas_encounter: 'world_maps.submaps.islands.unnamed_island_01.submaps.encounters.finneas_encounter',

	//BONE WRAITHS
	bone_wraiths_01: 'world_maps.submaps.combat_encounters.bone_wraiths_encounter_01',

	// KORINIS
	korinis_landing: 'world_maps.submaps.islands.korinis_island.submaps.extensions.korinis_island_landing_zone',
	korinis_city: 'world_maps.submaps.islands.korinis_island',
	korinis_mercenaries_camp:
		'world_maps.submaps.islands.korinis_island.submaps.extensions.korinis_island_mercenaries_camp',
	korinis_penal_colony: 'world_maps.submaps.islands.korinis_island.submaps.extensions.korinis_island_penal_colony',

	// KORINIS POIs
	korinis_city_blacksmith:
		'world_maps.submaps.islands.korinis_island.submaps.interiors.korinis_island_interior_blacksmith',
	korinis_lower_city_inn:
		'world_maps.submaps.islands.korinis_island.submaps.interiors.korinis_island_interior_town_inn',
	korinis_city_harbour_inn:
		'world_maps.submaps.islands.korinis_island.submaps.interiors.korinis_island_interior_harbour_inn',
	korinis_pyramid:
		'world_maps.submaps.islands.korinis_island.submaps.interiors.korinis_island_interior_water_mages_pyramid',
	korinis_teleporter_c:
		'world_maps.submaps.islands.korinis_island.submaps.interiors.korinis_island_interior_pyramid_teleporter_c',

	// KORINIS ENCOUNTERS
	korinis_bandits_01:
		'world_maps.submaps.islands.korinis_island.submaps.encounters.korinis_island_encounters_bandits_01',
};

const MAP_DATABASE = {
	world_maps: {
		metadata: {
			path: 'maps/world_maps/world_map',
			sizes: {
				maxZoom: 5,
				imageWidth: 8192,
				imageHeight: 8192,
			},
			backgroundColor: '#0a1c21',
		},
		annotations: {
			points_of_interest: {
				name: 'Points of Interest',
				items: [
					{
						lat: -159.25,
						lng: 206.25,
						label: 'Initial town',
						type: 'place',
						icon: 'townDock',
						iconType: 'png',
					},
					{
						lat: -197.8125,
						lng: 165.125,
						label: 'First unnamed island',
						type: 'place',
						icon: 'templeShrine',
						iconType: 'png',
						mapLink: 'unnamed_island_01',
					},
					{
						lat: -214.5,
						lng: 74.875,
						label: 'Korinis',
						type: 'place',
						icon: 'cityCapital',
						iconType: 'png',
						mapLink: 'korinis_landing',
					},
				],
			},
			cities: {
				name: 'Cities & Towns',
				items: [
					{
						lat: -17.46875,
						lng: 139.8125,
						label: 'Ironmaster',
						type: 'place',
						icon: null,
					},
					{
						lat: -32.375,
						lng: 143.78125,
						label: 'Fireshear',
						type: 'place',
						icon: null,
					},
					{
						lat: -35.625,
						lng: 154.21875,
						label: 'Luskan',
						type: 'place',
						icon: null,
					},
					{
						lat: -33.5625,
						lng: 157.5,
						label: 'Blackford crossing',
						type: 'place',
						icon: null,
					},
					{
						lat: -26.25,
						lng: 175,
						label: 'Mirabar',
						type: 'place',
						icon: null,
					},
					{
						lat: -37.59375,
						lng: 173.625,
						label: "Morgur's Mound",
						type: 'place',
						icon: null,
					},
					{
						lat: -44.5,
						lng: 165.875,
						label: 'Gauntlgrym',
						type: 'place',
						icon: null,
					},
					{
						lat: -46.1875,
						lng: 163.71875,
						label: 'Mount Hotenow',
						type: 'place',
						icon: null,
					},
					{
						lat: -52.28125,
						lng: 159.3125,
						label: 'Neverwinter',
						type: 'place',
						icon: null,
					},
					{
						lat: -55.53125,
						lng: 164.25,
						label: "Helm's Hold",
						type: 'place',
						icon: null,
					},
					{
						lat: -45.65625,
						lng: 182.75,
						label: 'Longsaddle',
						type: 'place',
						icon: null,
					},
					{
						lat: -58.03125,
						lng: 189,
						label: 'Triboar',
						type: 'place',
						icon: null,
					},
					{
						lat: -33.125,
						lng: 211.40625,
						label: 'Settlestone',
						type: 'place',
						icon: null,
					},
					{
						lat: -31.40625,
						lng: 212.75,
						label: 'Mithral Hall',
						type: 'place',
						icon: null,
					},
					{
						lat: -32.21875,
						lng: 215.53125,
						label: 'Menzoberranzan',
						type: 'place',
						icon: null,
					},
					{
						lat: -30.8125,
						lng: 223.84375,
						label: 'One Stone',
						type: 'place',
						icon: null,
					},
					{
						lat: -21.21875,
						lng: 226.75,
						label: "BEorunna's Well",
						type: 'place',
						icon: null,
					},
					{
						lat: -30.28125,
						lng: 235.9375,
						label: 'Citadel Felbarr',
						type: 'place',
						icon: null,
					},
					{
						lat: -38.625,
						lng: 239.71875,
						label: 'Sundabar',
						type: 'place',
						icon: null,
					},
					{
						lat: -44.5625,
						lng: 237.4375,
						label: 'Stone Stand',
						type: 'place',
						icon: null,
					},
					{
						lat: -39.8125,
						lng: 223.0625,
						label: 'Silverymoon',
						type: 'place',
						icon: null,
					},
					{
						lat: -51.28125,
						lng: 197.28125,
						label: 'Flint Rock',
						type: 'place',
						icon: null,
					},
					{
						lat: -58.6875,
						lng: 196.40625,
						label: 'Yartar',
						type: 'place',
						icon: null,
					},
					{
						lat: -55.5,
						lng: 225.3125,
						label: 'Grandfather Tree',
						type: 'place',
						icon: null,
					},
					{
						lat: -66.46875,
						lng: 232.25,
						label: 'Karse',
						type: 'place',
						icon: null,
					},
					{
						lat: -84.1875,
						lng: 170.4375,
						label: 'Thornhold',
						type: 'place',
						icon: null,
					},
					{
						lat: -88.375,
						lng: 181.6875,
						label: 'Amphail',
						type: 'place',
						icon: null,
					},
					{
						lat: -96.625,
						lng: 183.125,
						label: 'Waterdeep',
						type: 'place',
						icon: null,
					},
					{
						lat: -103.03125,
						lng: 191.3125,
						label: 'Daggerford',
						type: 'place',
						icon: null,
					},
					{
						lat: -95.375,
						lng: 211.59375,
						label: 'Secomber',
						type: 'place',
						icon: null,
					},
					{
						lat: -109.40625,
						lng: 233.71875,
						label: 'Orogoth',
						type: 'place',
						icon: null,
					},
					{
						lat: -133.40625,
						lng: 199.9375,
						label: "Warlock's Crypt",
						type: 'place',
						icon: null,
					},
					{
						lat: -129.65625,
						lng: 214.96875,
						label: 'Dragonspear Castle',
						type: 'place',
						icon: null,
					},
					{
						lat: -127.84375,
						lng: 253.4375,
						label: "Ss'thar'tiss'ssun",
						type: 'place',
						icon: null,
					},
					{
						lat: -143.0625,
						lng: 234.0625,
						label: 'Boareskyr Bridge',
						type: 'place',
						icon: null,
					},
					{
						lat: -144.0625,
						lng: 218.34375,
						label: 'Trollclaw Ford',
						type: 'place',
						icon: null,
					},
					{
						lat: -163.40625,
						lng: 255.3125,
						label: 'Scornubel',
						type: 'place',
						icon: null,
					},
					{
						lat: -158.3125,
						lng: 247.375,
						label: 'Triel',
						type: 'place',
						icon: null,
					},
					{
						lat: -160.875,
						lng: 229.6875,
						label: 'Elturel',
						type: 'place',
						icon: null,
					},
					{
						lat: -163.6875,
						lng: 223.46875,
						label: 'Fort Morninglord',
						type: 'place',
						icon: null,
					},
					{
						lat: -167.34375,
						lng: 210.40625,
						label: "Baldur's Gate",
						type: 'place',
						icon: null,
					},
					{
						lat: -188.8125,
						lng: 203.125,
						label: 'Candlekeep',
						type: 'place',
						icon: null,
					},
				],
			},
			combat_encounters: {
				name: 'Combat Encounters',
				items: [
					{
						lat: -209.375,
						lng: 116.875,
						label: 'Bone wraiths encounter',
						type: 'place',
						icon: 'poiCombat',
						iconType: 'png',
						mapLink: 'bone_wraiths_01',
					},
				],
			},
		},
		paths: [
			{
				name: 'The Story So Far',
				lineColor: '#FFDD00',
				points: [
					{
						coordinates: [-159.375, 206.34375],
						text: 'This is where the adventure began.',
					},
					{
						coordinates: [-160.15625, 204.90625],
					},
					{
						coordinates: [-161.625, 201.28125],
					},
					{
						coordinates: [-161.75, 197.875],
					},
					{
						coordinates: [-161.5625, 194.90625],
					},
					{
						coordinates: [-161.90625, 191.96875],
					},
					{
						coordinates: [-162.46875, 188.15625],
					},
					{
						coordinates: [-163.0625, 185.4375],
					},
					{
						coordinates: [-164.96875, 182.09375],
					},
					{
						coordinates: [-167.9375, 179.28125],
					},
					{
						coordinates: [-171.78125, 178.25],
					},
					{
						coordinates: [-178, 177.1875],
					},
					{
						coordinates: [-180.625, 176.46875],
					},
					{
						coordinates: [-182.6875, 174.5625],
					},
					{
						coordinates: [-185.53125, 170.1875],
					},
					{
						coordinates: [-187.3125, 166.03125],
					},
					{
						coordinates: [-188.46875, 160.90625],
					},
					{
						coordinates: [-190.09375, 156.125],
					},
					{
						coordinates: [-191.34375, 154.25],
					},
					{
						coordinates: [-194.28125, 153.1875],
					},
					{
						coordinates: [-197.15625, 153.34375],
					},
					{
						coordinates: [-199.84375, 155.6875],
					},
					{
						coordinates: [-201.53125, 158.84375],
					},
					{
						coordinates: [-200.90625, 161.34375],
					},
					{
						coordinates: [-199.9375, 163.15625],
					},
					{
						coordinates: [-197.96875, 165.125],
						text: 'Reaching an unnamed island, they stopped by to get water. Here they met Finneas, entered a temple and barely escaped a horde of undead.',
					},
					{
						coordinates: [-200.5625, 165.34375],
					},
					{
						coordinates: [-202.34375, 164.59375],
					},
					{
						coordinates: [-204.03125, 160.96875],
					},
					{
						coordinates: [-204.84375, 156.34375],
					},
					{
						coordinates: [-204.875, 150.71875],
					},
					{
						coordinates: [-203.5, 144.3125],
					},
					{
						coordinates: [-201.53125, 139.28125],
					},
					{
						coordinates: [-201.40625, 133.5],
					},
					{
						coordinates: [-201.75, 130.125],
					},
					{
						coordinates: [-204.84375, 126.09375],
					},
					{
						coordinates: [-206.40625, 122.8125],
					},
					{
						coordinates: [-206.71875, 118.59375],
					},
					{
						coordinates: [-209.59375, 116.9375],
						text: 'The bone the Barbarian had picked up was cursed. The party was attacked by wraiths summoned by the bone and barely managed to escape.',
					},
					{
						coordinates: [-207.78125, 113.78125],
					},
					{
						coordinates: [-207.375, 111.21875],
					},
					{
						coordinates: [-208.8125, 108.90625],
					},
					{
						coordinates: [-208.78125, 104.3125],
					},
					{
						coordinates: [-208.03125, 99.96875],
					},
					{
						coordinates: [-206.84375, 96.0625],
					},
					{
						coordinates: [-207.15625, 93.78125],
					},
					{
						coordinates: [-208.90625, 91.34375],
					},
					{
						coordinates: [-214.84375, 89.21875],
					},
					{
						coordinates: [-219.78125, 85.03125],
					},
					{
						coordinates: [-221.875, 81.28125],
					},
					{
						coordinates: [-222.28125, 76.4375],
					},
					{
						coordinates: [-221.03125, 72.9375],
					},
					{
						coordinates: [-219.15625, 72.125],
					},
					{
						coordinates: [-217.46875, 72.8125],
					},
					{
						coordinates: [-214.8125, 74.78125],
					},
					{
						coordinates: [-214.5, 74.90625],
						text: 'They reached the isle of Korinis, where their adventure is still ongoing.',
					},
				],
			},
		],
		submaps: {
			islands: {
				korinis_island: {
					metadata: {
						path: 'maps/world_maps/korinis_island/center',
						sizes: {
							maxZoom: 6,
							imageWidth: 13184,
							imageHeight: 5508,
						},
						backgroundColor: '#0a1c21',
					},
					annotations: {
						npcs: {
							name: 'NPCs',
							items: [
								{
									lat: -41.5,
									lng: 113.15625,
									label: 'Darren (Fire mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
									image: 'f965a770-b841-462c-8325-8dd483cca8a1.jpg',
								},
								{
									lat: -57.890625,
									lng: 81.734375,
									label: 'Valros (Water mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
									image: 'bcaa3de1-7d67-4909-92b0-dea60f63bf71.jpg',
								},
								{
									lat: -58.484375,
									lng: 160.78125,
									label: 'Erol (tablets)',
									type: 'place',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -29.046875,
									lng: 173.765625,
									label: 'Isgaroth (Fire mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -56.03125,
									lng: 74.65625,
									label: 'Thorben (Carpenter)',
									type: 'people',
									icon: 'tradeHunter',
									iconType: 'png',
								},
								{
									lat: -53.375,
									lng: 76.53125,
									label: 'Constantine (Alchemist)',
									type: 'people',
									icon: 'tradeAlchemy',
									iconType: 'png',
								},
								{
									lat: -40.125,
									lng: 87.46875,
									label: 'Thorek (Blacksmith)',
									type: 'people',
									icon: 'tradeForge',
									iconType: 'png',
									mapLink: 'korinis_city_blacksmith',
								},
								{
									lat: -29.640625,
									lng: 28.046875,
									label: 'Lizardman',
									type: 'people',
									icon: 'cityLizard',
									iconType: 'png',
								},
								{
									lat: -19.140625,
									lng: 153.4375,
									label: 'Bridge Troll',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
							],
						},
						points_of_interest: {
							name: 'Points of interest',
							items: [
								{
									lat: -1.88,
									lng: 3.75,
									label: 'World Map',
									type: 'text',
									fontSize: 20,
									mapLink: 'world_maps',
								},
								{
									lat: -50.5,
									lng: 106.8125,
									label: 'Lower City Inn',
									type: 'place',
									icon: 'poiBed',
									iconType: 'png',
									mapLink: 'korinis_lower_city_inn',
								},
								{ lat: -61.59375, lng: 185.328125, label: 'Inn', type: 'place', icon: 'poiBed', iconType: 'png' },
								{
									lat: -27.5625,
									lng: 71.875,
									label: 'Harbour Inn',
									type: 'place',
									icon: 'poiBed',
									iconType: 'png',
									image: 'af14542d-6e79-4d4d-b9d7-8e2037a45307.jpg',
									mapLink: 'korinis_city_harbour_inn',
								},
								{
									lat: -36.90625,
									lng: 109.25,
									label: 'Paladin Barracks',
									type: 'place',
									icon: 'city',
									iconType: 'png',
									image: 'cd2dbe90-39eb-483d-9ad5-85e36fda39b2.jpg',
								},
								{ lat: -82.203125, lng: 59.4375, label: 'Paladin Hall', type: 'place', icon: 'city', iconType: 'png' },
								{
									lat: -10.578125,
									lng: 182.6875,
									label: 'Fire Mages Monastery',
									type: 'place',
									icon: 'templeCathedral',
									iconType: 'png',
								},
								{
									lat: -38.21875,
									lng: 59.859375,
									label: 'Pawn shop',
									type: 'place',
									icon: 'tradeShop',
									iconType: 'png',
								},
								{
									lat: -46.75,
									lng: 136.265625,
									label: 'Secob Farm',
									type: 'place',
									icon: 'poiFarm',
									iconType: 'png',
								},
								{
									lat: -49.125,
									lng: 11.84375,
									label: 'Lobart Farm',
									type: 'place',
									icon: 'poiFarm',
									iconType: 'png',
									description:
										"The adventurers arrived at a farm on the outskirts of the city, seeking entry but lacking the necessary gold. Speaking with one of the farmers, they learned that the head farmer might offer them a way in. They approached him and were given a proposition: earn gold by helping with the crops and assisting the farmer's wife with her tasks.",
								},
								{
									lat: -80.078125,
									lng: 144.84375,
									label: 'Caves (scales + blue blood)',
									type: 'place',
									icon: 'poiCave',
									iconType: 'png',
								},
								{ lat: -2.34375, lng: 55.25, label: 'Paladin ship', type: 'place', icon: 'poiShip' },
								{
									lat: -34.390625,
									lng: 133.75,
									label: 'Teleporter Exit B',
									type: 'place',
									icon: 'iconPortal',
									animationType: 'spin',
								},
								{
									lat: -71.5625,
									lng: 176.625,
									label: 'Teleporter Exit C',
									type: 'place',
									icon: 'iconPortal',
									animationType: 'spin',
									mapLink: 'korinis_teleporter_c',
								},
								{
									lat: -2.953125,
									lng: 142.953125,
									label: 'Water Mages Pyramid',
									type: 'place',
									icon: 'templePyramid',
									image: '241bf32d-094b-49d7-ba81-3a224d39da82.jpg',
									mapLink: 'korinis_pyramid',
								},
							],
						},
						navigation: {
							name: 'Navigation arrows',
							items: [
								{
									lat: -46.45,
									lng: 0.72,
									label: 'To Landing Zone',
									type: 'place',
									icon: 'arrowDirectionLeft',
									iconType: 'png',
									mapLink: 'korinis_landing',
								},
								{
									lat: -56.3,
									lng: 204.48,
									label: 'To Mercenaries',
									type: 'place',
									icon: 'arrowDirectionRight',
									iconType: 'png',
									mapLink: 'korinis_mercenaries_camp',
								},
								{
									lat: -81.21875,
									lng: 195.953125,
									label: 'To Penal Colony',
									type: 'place',
									icon: 'arrowDirectionDown',
									iconType: 'png',
									mapLink: 'korinis_penal_colony',
								},
							],
						},
						combat_encounters: {
							name: 'Combat encounters',
							items: [
								{ lat: -34.375, lng: 40.96875, label: 'Wolves', type: 'place', icon: 'poiDanger', iconType: 'png' },
								{ lat: -73.4375, lng: 136.71875, label: 'Wolves', type: 'place', icon: 'poiCombat', iconType: 'png' },
								{
									lat: -26.03125,
									lng: 42.1875,
									label: 'Bandits',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
									mapLink: 'korinis_bandits_01',
								},
								{
									lat: -40.59375,
									lng: 153.71875,
									label: 'Bandits',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
								},
								{
									lat: -35.578125,
									lng: 33.8125,
									label: 'Goblin camp',
									type: 'place',
									icon: 'poiCombat',
									iconType: 'png',
									description: `The adventurers, hoping to make a new ally, approached the lizardman with friendly intentions. However, their efforts were met with hostility as the lizardman attacked them. The battle was intense, with the group struggling to subdue their reptilian foe. Just as they seemed to gain the upper hand, a group of goblins ambushed them from the shadows. The adventurers fought valiantly, managing to defeat the goblins, but in the chaos, one of the goblins used a spell to explode nearby corpses, which killed the lizardman, whom they had been trying to keep alive.`,
									image: '5f2e59cb-3f54-452f-bbd9-63905789961a.jpg',
								},
								{
									lat: -24.375,
									lng: 158.0625,
									label: 'Inactive Golem',
									type: 'place',
									icon: 'poiDanger',
									iconType: 'png',
								},
								{
									lat: -7.03125,
									lng: 148.40625,
									label: 'Snapers',
									type: 'place',
									icon: 'poiDanger',
									iconType: 'png',
								},
								{
									lat: -1.71875,
									lng: 156.140625,
									label: 'Wasps',
									type: 'place',
									icon: 'poiDanger',
									iconType: 'png',
								},
							],
						},
						landmarks: {
							name: 'Landmarks',
							items: [
								{
									lat: -47.8125,
									lng: 52.78125,
									label: 'Main town of Korinis',
									type: 'landmark',
									icon: 'poiLandmarks3',
									iconType: 'png',
									description: `The main town of Korinis is a captivating town of contrasts. Nestled between the open waters and rugged hills, its bustling harbour is alive with the scent of saltwater and the sounds of merchants peddling their wares amidst poverty and resourcefulness. The lower city, a maze of alleys and market squares, thrives with commerce and crafts, shadowed by the vigilant paladins who ensure safety at the cost of freedom. The upper city, dominated by the paladins' formidable barracks, exudes grandeur and control, with wide streets and grand homes. In this town of Korinis, prosperity and poverty coexist, and every street tells a story.`,
									image: '797410b1-f8a8-4d16-810c-011927fa1f8d.jpg',
								},
							],
						},
					},
					paths: [
						{
							name: 'Session 1 Recap',
							lineColor: '#E2B203',
							points: [
								{
									coordinates: [-46.375, 0.125],
								},
								{
									coordinates: [-46.5625, 9.3125],
								},
								{
									coordinates: [-49.125, 11.84375],
									text: "Reached Lobart farm and talked to its master. Learned the cost of entry into the city and were told to do deeds to gain money for it. Talked to the lead farmer's wife and got a task from her.",
								},
								{
									coordinates: [-46.6875, 14.1875],
								},
								{
									coordinates: [-46.3125, 22.8125],
								},
								{
									coordinates: [-46.8125, 31.75],
								},
								{
									coordinates: [-44.25, 36.0625],
									text: "Down the road, we met a merchant which sold us entry to the city for a favour once inside. Also got a pan for the lead farmer's wife as part of her task.",
								},
								{
									coordinates: [-45.875, 38.125],
									text: "We went back to the farmer's wife and gave her the pan. She gave us food to eat. After that, we talked to the lead farmer again and slept in the barn.",
								},
								{
									coordinates: [-46.5625, 43.75],
								},
								{
									coordinates: [-48, 50.375],
								},
								{
									coordinates: [-47.8125, 55.1875],
									text: 'Talked to the guards and showed them our entry pass. They allowed us into the city.',
								},
								{
									coordinates: [-48, 66.5625],
									text: 'Talked to the master paladin guarding the door and learned of the city rules and some whereabouts of the locations we were interested in.',
								},
								{
									coordinates: [-50.875, 69.3125],
								},
								{
									coordinates: [-49.75, 71],
								},
								{
									coordinates: [-47.75, 72.375],
								},
								{
									coordinates: [-47.875, 81.6875],
								},
								{
									coordinates: [-47.625, 93.375],
								},
								{
									coordinates: [-47.625, 102.5625],
								},
								{
									coordinates: [-49.4375, 103.46875],
								},
								{
									coordinates: [-49.671875, 104.546875],
								},
								{
									coordinates: [-50.046875, 105.234375],
									text: 'Walked into the inn and slept. During the night, some of the gold and some of our belongings were stolen.',
								},
							],
						},
						{
							name: 'Session 2 Recap',
							lineColor: '#2898BD',
							points: [
								{
									coordinates: [-50.5, 106.8125],
									text: 'Woken up, the party decided to go into the woods and gather the plants that were requested by the alchemist.',
								},
								{
									coordinates: [-50.53125, 105.6875],
								},
								{
									coordinates: [-49.8125, 104.8125],
								},
								{
									coordinates: [-49.6875, 103.65625],
								},
								{
									coordinates: [-48.84375, 103.1875],
								},
								{
									coordinates: [-48.15625, 103.25],
								},
								{
									coordinates: [-47.25, 118.53125],
								},
								{
									coordinates: [-47.53125, 126.75],
									text: 'On the way out of the city, guards stopped them and asked them what they were doing. Upon learning they were headed into the forest, the guards wished them good luck.',
								},
								{
									coordinates: [-48.84375, 129.125],
								},
								{
									coordinates: [-51.96875, 129.625],
								},
								{
									coordinates: [-54.71875, 130.15625],
								},
								{
									coordinates: [-56.0625, 132.46875],
									text: 'The party ventured into the forest down this path.',
								},
								{
									coordinates: [-57.8125, 132.625],
								},
								{
									coordinates: [-59.09375, 132.3125],
								},
								{
									coordinates: [-60.375, 134.21875],
								},
								{
									coordinates: [-61.25, 135.3125],
								},
								{
									coordinates: [-62.25, 133.71875],
								},
								{
									coordinates: [-62.96875, 133.90625],
								},
								{
									coordinates: [-63.84375, 135.4375],
								},
								{
									coordinates: [-64.625, 135.5625],
								},
								{
									coordinates: [-66.9375, 133.34375],
								},
								{
									coordinates: [-68.65625, 132.125],
								},
								{
									coordinates: [-69.9375, 132.5625],
								},
								{
									coordinates: [-70.90625, 134.46875],
								},
								{
									coordinates: [-73.4375, 136.71875],
									text: 'They attacked a pack of wolves which were roaming around in the forest. The battle was fierce, but they were victorious. They managed to find hides, which would prove useful to gain apprenticeship.',
								},
								{
									coordinates: [-76.3125, 136.21875],
								},
								{
									coordinates: [-78.34375, 137.71875],
								},
								{
									coordinates: [-79.78125, 139.59375],
								},
								{
									coordinates: [-80.84375, 140.9375],
								},
								{
									coordinates: [-80.8125, 143.15625],
								},
								{
									coordinates: [-80.078125, 144.84375],
									text: 'Entering the nearby caves, they saw what looked like blue blood - lizardmen blood, and a few creatures which looked way too powerful for them to handle.',
								},
								{
									coordinates: [-80.078125, 144.84375],
								},
								{
									coordinates: [-73, 144.359375],
								},
								{
									coordinates: [-72.015625, 143.28125],
								},
								{
									coordinates: [-72.15625, 139.0625],
								},
								{
									coordinates: [-72.28125, 136.296875],
								},
								{
									coordinates: [-70.546875, 134.71875],
								},
								{
									coordinates: [-69.328125, 133.0625],
								},
								{
									coordinates: [-67.171875, 133.59375],
								},
								{
									coordinates: [-65.640625, 136.109375],
								},
								{
									coordinates: [-63.35656751865134, 136.05525840836606],
								},
								{
									coordinates: [-62.75, 134.5625],
								},
								{
									coordinates: [-61.515625, 136.265625],
								},
								{
									coordinates: [-60.90625, 136.265625],
								},
								{
									coordinates: [-58.734375, 132.953125],
								},
								{
									coordinates: [-56.56391480275695, 133.00229117665427],
								},
								{
									coordinates: [-56.234375, 135.453125],
								},
								{
									coordinates: [-55.984375, 143.953125],
								},
								{
									coordinates: [-55.734375, 151.125],
								},
								{
									coordinates: [-55.40625, 158.796875],
								},
								{
									coordinates: [-58.484375, 160.78125],
									text: 'Near the bridge, they met Erol, who had been robbed by the bandits on the bridge nearby. He had a broken leg, which the party Cleric mended.',
								},
								{
									coordinates: [-55.390625, 162.328125],
								},
								{
									coordinates: [-55.484375, 180.703125],
								},
								{
									coordinates: [-53.03125, 182.015625],
								},
								{
									coordinates: [-52.640625, 184.015625],
									text: "At the crossroads, they took a left turn to go towards the Fire Mages Monastery, in order to seek a Fire Mage's blessing.",
								},
								{
									coordinates: [-45.859375, 184.28125],
								},
								{
									coordinates: [-36.296875, 183.96875],
								},
								{
									coordinates: [-31.109375, 183.546875],
								},
								{
									coordinates: [-29.109375, 183.1875],
								},
								{
									coordinates: [-28.40625, 178.625],
								},
								{
									coordinates: [-29.046875, 173.765625],
								},
								{
									coordinates: [-29.046875, 173.765625],
									text: 'They saw Isgaroth, a Fire Mage, who was doing a prayer. They waited for two hours for the prayer to finish and after that they received the Fire Mage blessing for free, as they had made the trip to the Monastery.',
								},
								{
									coordinates: [-28.03125, 175.84375],
								},
								{
									coordinates: [-27.796875, 177.71875],
								},
								{
									coordinates: [-28.796875, 183.9375],
								},
								{
									coordinates: [-34.390625, 184.265625],
								},
								{
									coordinates: [-45.90625, 185.0625],
								},
								{
									coordinates: [-52.078125, 184.921875],
								},
								{
									coordinates: [-54.09375, 186.21875],
								},
								{
									coordinates: [-56.953125, 185.890625],
								},
								{
									coordinates: [-58.828125, 185.6875],
								},
								{
									coordinates: [-61.59375, 185.328125],
									text: 'The party checked out the inn at the crossroads, looking for a place to spend the night in, but the prices were too steep for them, so they went back in town.',
								},
							],
						},
						{
							name: 'Session 3 Recap',
							lineColor: '#ff7e55',
							points: [
								{
									coordinates: [-50.875, 107],
								},
								{
									coordinates: [-47.5625, 101.9375],
								},
								{
									coordinates: [-47.5, 96.625],
									text: 'The party decided to venture outside, into the forest they saw when they first entered the city.',
								},
								{
									coordinates: [-47.3125, 73.1875],
								},
								{
									coordinates: [-46.125, 70.3125],
								},
								{
									coordinates: [-47.6875, 66.3125],
								},
								{
									coordinates: [-47.1875, 55.6875],
								},
								{
									coordinates: [-47.0625, 48.625],
								},
								{
									coordinates: [-46.375, 45.875],
								},
								{
									coordinates: [-43.3125, 46.8125],
								},
								{
									coordinates: [-39.375, 47.375],
								},
								{
									coordinates: [-36.875, 47.125],
									text: 'Seeing a pack of wolves and a goblin camp in the nearby forest, they took a more secluded path, going stealthily deeper in the forest.',
								},
								{
									coordinates: [-33.8125, 46.5625],
								},
								{
									coordinates: [-31.375, 45.125],
								},
								{
									coordinates: [-31.125, 42.25],
									text: 'In the distance stood a Lizardman. The party cleric decided to send a spell to them in order to make contact, hoping to come in peace and talk.',
								},
								{
									coordinates: [-31.3125, 35.8125],
								},
								{
									coordinates: [-29.875, 31.625],
									text: "The plan didn't work out. The lizardman attacked, enraged, and a battle started. In the midst of the battle, the goblin horde attacked as well, killing the downed Lizarman. The party emerged victorious.",
								},
								{
									coordinates: [-29.109375, 28.953125],
								},
								{
									coordinates: [-27.890625, 28.09375],
								},
								{
									coordinates: [-26.296875, 28.109375],
								},
								{
									coordinates: [-26.265625, 29.234375],
								},
								{
									coordinates: [-26.109375, 34.796875],
								},
								{
									coordinates: [-26.15625, 38.734375],
								},
								{
									coordinates: [-26.125, 42.234375],
									text: 'The party was ambushed by some bandits who looked like they were smuggling things into the city. Overwhelmed and outnumbered, they wisely chose to run away from this encounter.',
								},
								{
									coordinates: [-25.265625, 35.796875],
								},
								{
									coordinates: [-25.5625, 30.203125],
								},
								{
									coordinates: [-26.03125, 27.453125],
								},
								{
									coordinates: [-28.25, 27.265625],
								},
								{
									coordinates: [-30.609375, 27.71875],
								},
								{
									coordinates: [-32.96875, 27.421875],
									text: 'Hoping to avoid the wildlife they had seen, they took another path through the forest.',
								},
								{
									coordinates: [-36.46875, 27.71875],
								},
								{
									coordinates: [-38.03125, 29.28125],
								},
								{
									coordinates: [-39.34375, 30.78125],
								},
								{
									coordinates: [-40.15625, 33.875],
								},
								{
									coordinates: [-41.4375, 35],
								},
								{
									coordinates: [-43.6875, 35.3125],
								},
								{
									coordinates: [-45.40625, 36.34375],
								},
								{
									coordinates: [-46.125, 38.875],
								},
								{
									coordinates: [-45.90625, 40.9375],
								},
								{
									coordinates: [-46.96875, 43.78125],
								},
								{
									coordinates: [-48.15625, 47.46875],
								},
								{
									coordinates: [-48.3125, 51.59375],
								},
								{
									coordinates: [-47.96875, 53.9375],
								},
								{
									coordinates: [-48.40625, 57.71875],
								},
								{
									coordinates: [-48.625, 65.21875],
								},
								{
									coordinates: [-48.21875, 67.21875],
									text: 'Back into the city, they stopped and talked to the Paladin guard and informed them of the bandits they had seen and their location. ',
								},
								{
									coordinates: [-49.625, 69.1875],
								},
								{
									coordinates: [-49.9375, 70.78125],
								},
								{
									coordinates: [-48.78125, 72.09375],
								},
								{
									coordinates: [-48.03125, 73.34375],
								},
								{
									coordinates: [-48.03125, 78.0625],
								},
								{
									coordinates: [-48, 85.875],
								},
								{
									coordinates: [-47.96875, 94.0625],
								},
								{
									coordinates: [-48.1875, 100.09375],
								},
								{
									coordinates: [-48.40625, 102.46875],
								},
								{
									coordinates: [-49.625, 103.53125],
								},
								{
									coordinates: [-50.515625, 106.484375],
									text: 'Exhausted for the day, they rested at the inn once more.',
								},
							],
						},
						{
							name: 'Session 7 Recap',
							lineColor: '#84d8e3',
							points: [
								{
									coordinates: [-57.890625, 81.734375],
								},
								{
									coordinates: [-54.5625, 81.125],
								},
								{
									coordinates: [-50.34375, 80.40625],
									text: 'The adventurers decide to journey to the pyramids in search of the water mages party.',
								},
								{
									coordinates: [-47.90625, 80.53125],
								},
								{
									coordinates: [-47.90625, 109.15625],
								},
								{
									coordinates: [-47.4375, 123.75],
								},
								{
									coordinates: [-47.3125, 127.375],
								},
								{
									coordinates: [-49.1875, 129.34375],
								},
								{
									coordinates: [-52.875, 129.6875],
								},
								{
									coordinates: [-55.71875, 130.9375],
								},
								{
									coordinates: [-56.1875, 133.53125],
								},
								{
									coordinates: [-56.09375, 139.25],
								},
								{
									coordinates: [-55, 139.65625],
								},
								{
									coordinates: [-53.5, 139.84375],
								},
								{
									coordinates: [-49.625, 139.5625],
								},
								{
									coordinates: [-49.84375, 137.75],
								},
								{
									coordinates: [-49.03125, 136.90625],
								},
								{
									coordinates: [-48.75, 135.875],
								},
								{
									coordinates: [-47.6875, 135.75],
								},
								{
									coordinates: [-46.75, 136.265625],
								},
								{
									coordinates: [-44.625, 137.15625],
								},
								{
									coordinates: [-40.9375, 139.0625],
								},
								{
									coordinates: [-39.40625, 140.53125],
								},
								{
									coordinates: [-38.03125, 142.125],
									text: 'While navigating the tough terrain, both the Ranger and Sorcerer fail an athletics check and get injured.',
								},
								{
									coordinates: [-36.5625, 143.3125],
								},
								{
									coordinates: [-34.8125, 146.25],
								},
								{
									coordinates: [-33.5625, 148.1875],
								},
								{
									coordinates: [-29.625, 149.625],
								},
								{
									coordinates: [-25.9375, 150.875],
									text: 'The group spots an inactive golem to their right, which catches their interest.',
								},
								{
									coordinates: [-22.46875, 152.03125],
								},
								{
									coordinates: [-19.140625, 153.4375],
									text: 'They pay 2 silver per person to cross the river over a shaky bridge guarded by a troll.',
								},
								{
									coordinates: [-15.9375, 153.3125],
								},
								{
									coordinates: [-12.625, 152.71875],
								},
								{
									coordinates: [-10.46875, 152.6875],
								},
								{
									coordinates: [-6.84375, 152.1875],
									text: 'To their right, they find ruins and two ancient chests, sparking their curiosity.',
								},
								{
									coordinates: [-3.1875, 151.96875],
								},
								{
									coordinates: [-2.5625, 150.28125],
									text: 'Straight ahead, they entered a group of tents and discovered the location of the water mages.',
								},
								{
									coordinates: [-0.96875, 147.125],
								},
								{
									coordinates: [-2.25, 145.625],
								},
								{
									coordinates: [-4.3125, 145.25],
								},
								{
									coordinates: [-5.125, 144.40625],
								},
								{
									coordinates: [-5, 143.0625],
								},
								{
									coordinates: [-2.96875, 143.015625],
									text: 'The group entered the pyramids. In the first chamber they saw a huge door to their left, which was locked. Straight ahead through a corridor they fought a fierce battle against lich-like creatures and undead. They were victorious in the end with the help of the water mages party. Learning more about the strange devices of the land, they decided to help the mages with what looked like a teleporter. Once they stepped on it, they were teleported to a different location, but they managed to work out the system behind the teleporters: one would take you to a cave in the mountains, close to the city, and the other to another small cave near the inn.',
								},
								{
									coordinates: [-4, 143.125],
									pointWidth: 1,
									pointColor: 'yellow',
								},
								{
									coordinates: [-36, 133.5],
									pointWidth: 1,
									pointColor: 'yellow',
								},
								{
									coordinates: [-73.375, 175.5],
									pointWidth: 1,
									pointColor: 'yellow',
								},
								{
									coordinates: [-3.234375, 143.359375],
									pointWidth: 1,
									pointColor: 'yellow',
								},
							],
						},
						{
							name: 'Session 8 Recap',
							lineColor: '#ff5722',
							points: [
								{
									coordinates: [-35.0625, 134.25],
								},
								{
									coordinates: [-36.5, 134.25],
								},
								{
									coordinates: [-38.0625, 131.6875],
								},
								{
									coordinates: [-38.875, 130.625],
								},
								{
									coordinates: [-40.6875, 130.8125],
								},
								{
									coordinates: [-46.0625, 127.875],
								},
								{
									coordinates: [-49.4375, 129.5625],
								},
								{
									coordinates: [-54.75, 130],
								},
								{
									coordinates: [-56.3125, 135.5625],
								},
								{
									coordinates: [-55.4375, 150.1875],
								},
								{
									coordinates: [-55.1875, 163.5],
								},
								{
									coordinates: [-55.125, 177.625],
								},
								{
									coordinates: [-56.6875, 181.25],
								},
								{
									coordinates: [-58, 183.9375],
								},
								{
									coordinates: [-62.125, 185.625],
									text: 'Went into the inn and talked with the bartender, who was a follower of the water mages. Learned about the mercenaries and got a key to unlock the teleporter B lock.',
								},
								{
									coordinates: [-57.5, 185.3125],
								},
								{
									coordinates: [-55.0625, 187.5],
								},
								{
									coordinates: [-54.9375, 203.125],
									text: 'Went to the mercenaries. \n\nFEATURE WIP TO GO TO THE NEXT MAP DIRECTLY, FOR NOW CLICK THE ARROW BUTTON NEAR AND TOGGLE THE SESSION RECAP FROM THERE.',
								},
								{
									coordinates: [-56.125, 202.875],
								},
								{
									coordinates: [-55.9375, 192.9375],
									text: '[Continued from where session 8 ends from the other map]\n\nMade a left turn here towards the Penal Colony. What could go wrong?',
								},
								{
									coordinates: [-59.75, 193.4375],
								},
								{
									coordinates: [-73.6875, 195.625],
								},
								{
									coordinates: [-78.875, 196.0625],
								},
							],
						},
					],
					areas: {
						korinis_city: {
							name: 'Korinis city',
							items: [
								{
									name: 'Harbour area',
									textRotation: '346deg',
									textSize: 12,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(220 223 228 / 50%)',
									points: [
										{
											coordinates: [-19.09375, 52.953125],
										},
										{
											coordinates: [-19.078125, 55.625],
										},
										{
											coordinates: [-18.734375, 57.359375],
										},
										{
											coordinates: [-18.46875, 60.09375],
										},
										{
											coordinates: [-18.546875, 62.5625],
										},
										{
											coordinates: [-18.421875, 64.15625],
										},
										{
											coordinates: [-18.390625, 65.5],
										},
										{
											coordinates: [-17.9375, 67.984375],
										},
										{
											coordinates: [-17.5625, 70.234375],
										},
										{
											coordinates: [-17.078125, 73.1875],
										},
										{
											coordinates: [-16.75, 75.109375],
										},
										{
											coordinates: [-16.65625, 76],
										},
										{
											coordinates: [-16.46875, 77.078125],
										},
										{
											coordinates: [-13.703125, 83.828125],
										},
										{
											coordinates: [-12.171875, 88.015625],
										},
										{
											coordinates: [-10.09375, 92.84375],
										},
										{
											coordinates: [-10.15625, 96.875],
										},
										{
											coordinates: [-10.09375, 97.796875],
										},
										{
											coordinates: [-10.28125, 101.671875],
										},
										{
											coordinates: [-8.453125, 104.109375],
										},
										{
											coordinates: [-6.640625, 106.96875],
										},
										{
											coordinates: [-5.40625, 108.78125],
										},
										{
											coordinates: [-7.078125, 111.375],
										},
										{
											coordinates: [-7.296875, 111.84375],
										},
										{
											coordinates: [-8.90625, 111.375],
										},
										{
											coordinates: [-10.578125, 107.921875],
										},
										{
											coordinates: [-11.796875, 106.71875],
										},
										{
											coordinates: [-14.34375, 101.203125],
										},
										{
											coordinates: [-15.015625, 99.28125],
										},
										{
											coordinates: [-14.890625, 97.921875],
										},
										{
											coordinates: [-14.5, 96.84375],
										},
										{
											coordinates: [-14.984375, 95.875],
										},
										{
											coordinates: [-14.625, 94.15625],
										},
										{
											coordinates: [-14.984375, 93.109375],
										},
										{
											coordinates: [-15.90625, 92.234375],
										},
										{
											coordinates: [-17.375, 91.203125],
										},
										{
											coordinates: [-17.609375, 89.421875],
										},
										{
											coordinates: [-17.53125, 88.5],
										},
										{
											coordinates: [-18.234375, 86.140625],
										},
										{
											coordinates: [-18, 84.40625],
										},
										{
											coordinates: [-17.703125, 83.421875],
										},
										{
											coordinates: [-18.671875, 80.40625],
										},
										{
											coordinates: [-20.078125, 79.25],
										},
										{
											coordinates: [-21.875, 73.21875],
										},
										{
											coordinates: [-21.484375, 71.84375],
										},
										{
											coordinates: [-21.875, 70.578125],
										},
										{
											coordinates: [-22.25, 69.265625],
										},
										{
											coordinates: [-22.328125, 67.65625],
										},
										{
											coordinates: [-22.28125, 65.5],
										},
										{
											coordinates: [-22.703125, 62.3125],
										},
										{
											coordinates: [-23.171875, 59.953125],
										},
										{
											coordinates: [-22.75, 57.921875],
										},
										{
											coordinates: [-23.484375, 52.234375],
										},
									],
								},
								{
									name: 'Harbour',
									textRotation: '0deg',
									textSize: 16,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(248 113 104 / 50%)',
									points: [
										{
											coordinates: [-23.875, 52],
										},
										{
											coordinates: [-22.6875, 58.125],
										},
										{
											coordinates: [-23.1875, 59.8125],
										},
										{
											coordinates: [-22.1875, 65],
										},
										{
											coordinates: [-22.4375, 68.375],
										},
										{
											coordinates: [-22.4375, 70.9375],
										},
										{
											coordinates: [-21.875, 72.8125],
										},
										{
											coordinates: [-22.09375, 73.171875],
										},
										{
											coordinates: [-20.265625, 79.5625],
										},
										{
											coordinates: [-18.890625, 80.390625],
										},
										{
											coordinates: [-17.953125, 83.453125],
										},
										{
											coordinates: [-18.328125, 84.640625],
										},
										{
											coordinates: [-18.515625, 85.765625],
										},
										{
											coordinates: [-17.765625, 88.625],
										},
										{
											coordinates: [-17.53125, 91.4375],
										},
										{
											coordinates: [-16.171875, 92.28125],
										},
										{
											coordinates: [-15.28125, 93.015625],
										},
										{
											coordinates: [-14.890625, 94.3125],
										},
										{
											coordinates: [-15.203125, 95.984375],
										},
										{
											coordinates: [-14.78125, 96.8125],
										},
										{
											coordinates: [-15.359375, 98.578125],
										},
										{
											coordinates: [-14.921875, 100.375],
										},
										{
											coordinates: [-13.6875, 103.46875],
										},
										{
											coordinates: [-12.5625, 105.71875],
										},
										{
											coordinates: [-12.03125, 106.640625],
										},
										{
											coordinates: [-10.859375, 108.015625],
										},
										{
											coordinates: [-9.078125, 111.53125],
										},
										{
											coordinates: [-8.265625, 111.796875],
										},
										{
											coordinates: [-10.21875, 114.484375],
										},
										{
											coordinates: [-26.203125, 114.78125],
										},
										{
											coordinates: [-32.546875, 120.734375],
										},
										{
											coordinates: [-36.171875, 116.75],
										},
										{
											coordinates: [-36.15625, 111.015625],
										},
										{
											coordinates: [-35.296875, 110.390625],
										},
										{
											coordinates: [-35.140625, 108.859375],
										},
										{
											coordinates: [-35.4375, 107.953125],
										},
										{
											coordinates: [-36.109375, 107.828125],
										},
										{
											coordinates: [-36.40625, 107.515625],
										},
										{
											coordinates: [-36.03125, 103.453125],
										},
										{
											coordinates: [-36.25, 71.234375],
										},
										{
											coordinates: [-36.8125, 71.15625],
										},
										{
											coordinates: [-36.828125, 69.21875],
										},
										{
											coordinates: [-36.421875, 68.53125],
										},
										{
											coordinates: [-36.484375, 55.734375],
										},
										{
											coordinates: [-24.46875, 53.25],
										},
									],
								},
								{
									name: 'Lower City',
									textRotation: '0deg',
									textSize: 16,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(245 205 71 / 30%)',
									points: [
										{
											coordinates: [-37.1875, 55.8125],
										},
										{
											coordinates: [-37, 68.75],
										},
										{
											coordinates: [-36.90625, 89.3125],
										},
										{
											coordinates: [-36.6875, 103.78125],
										},
										{
											coordinates: [-36.4375, 107.40625],
										},
										{
											coordinates: [-35.4375, 107.65625],
										},
										{
											coordinates: [-35.28125, 110.25],
										},
										{
											coordinates: [-36.75, 111.21875],
										},
										{
											coordinates: [-36.84375, 117.28125],
										},
										{
											coordinates: [-32.875, 121.21875],
										},
										{
											coordinates: [-38.4375, 125.875],
										},
										{
											coordinates: [-50.5, 125.34375],
										},
										{
											coordinates: [-50.9375, 120.5],
										},
										{
											coordinates: [-53.03125, 114.6875],
										},
										{
											coordinates: [-61.1875, 100.9375],
										},
										{
											coordinates: [-61.40625, 67.8125],
										},
										{
											coordinates: [-61.3125, 52.46875],
										},
										{
											coordinates: [-60.25, 52.3125],
										},
										{
											coordinates: [-48.90625, 55.96875],
										},
									],
								},
								{
									name: 'Upper City',
									textRotation: '0deg',
									textSize: 16,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(87 157 255 / 40%)',
									points: [
										{
											coordinates: [-61.625, 51.53125],
										},
										{
											coordinates: [-61.53125, 64.375],
										},
										{
											coordinates: [-61.9375, 64.9375],
										},
										{
											coordinates: [-62, 66.9375],
										},
										{
											coordinates: [-61.625, 67.65625],
										},
										{
											coordinates: [-61.5, 100.8125],
										},
										{
											coordinates: [-53.375, 114.6875],
										},
										{
											coordinates: [-51, 120.875],
										},
										{
											coordinates: [-50.6875, 126],
										},
										{
											coordinates: [-53.9375, 125.25],
										},
										{
											coordinates: [-59.5, 123.25],
										},
										{
											coordinates: [-85.90625, 109.59375],
										},
										{
											coordinates: [-86, 55.40625],
										},
										{
											coordinates: [-73.28125, 51.53125],
										},
									],
								},
							],
						},
						farms: {
							name: 'Farms',
							items: [
								{
									name: 'Secob farm',
									textRotation: '0deg',
									textSize: 16,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(226 178 3 / 40%)',
									points: [
										{
											coordinates: [-46.828125, 130.765625],
										},
										{
											coordinates: [-45.46875, 132.375],
										},
										{
											coordinates: [-44.875, 133.921875],
										},
										{
											coordinates: [-44.8125, 135.90625],
										},
										{
											coordinates: [-44.984375, 136.6875],
										},
										{
											coordinates: [-44.90625, 138.09375],
										},
										{
											coordinates: [-44.625, 140],
										},
										{
											coordinates: [-44.609375, 141.921875],
										},
										{
											coordinates: [-45.203125, 143.625],
										},
										{
											coordinates: [-46.40625, 145.375],
										},
										{
											coordinates: [-47.125, 146.234375],
										},
										{
											coordinates: [-47.75, 146.078125],
										},
										{
											coordinates: [-48.34375, 147.59375],
										},
										{
											coordinates: [-50.8125, 150.25],
										},
										{
											coordinates: [-54.515625, 150.71875],
										},
										{
											coordinates: [-54.453125, 148.34375],
										},
										{
											coordinates: [-54.828125, 145.765625],
										},
										{
											coordinates: [-55.046875, 140.765625],
										},
										{
											coordinates: [-54.953125, 139.21875],
										},
										{
											coordinates: [-54.453125, 132.984375],
										},
										{
											coordinates: [-53.515625, 131.921875],
										},
										{
											coordinates: [-50.984375, 131.46875],
										},
										{
											coordinates: [-48.640625, 131.25],
										},
									],
								},
								{
									name: 'Lobart farm',
									textRotation: '0deg',
									textSize: 16,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(226 178 3 / 40%)',
									points: [
										{
											coordinates: [-48.46875, 0.03125],
										},
										{
											coordinates: [-49.125, 9.9375],
										},
										{
											coordinates: [-49.21875, 13.8125],
										},
										{
											coordinates: [-48.46875, 22.375],
										},
										{
											coordinates: [-48.65625, 33.09375],
										},
										{
											coordinates: [-47.46875, 42.46875],
										},
										{
											coordinates: [-50.3125, 43],
										},
										{
											coordinates: [-56, 42.5],
										},
										{
											coordinates: [-57.84375, 41.3125],
										},
										{
											coordinates: [-60.09375, 36.96875],
										},
										{
											coordinates: [-60.1875, 32.03125],
										},
										{
											coordinates: [-63.34375, 28.3125],
										},
										{
											coordinates: [-63.90625, 21.9375],
										},
										{
											coordinates: [-65.3125, 15.90625],
										},
										{
											coordinates: [-64.0625, 7.8125],
										},
										{
											coordinates: [-63.84375, 0.09375],
										},
									],
								},
							],
						},
						pois: {
							name: 'Points of interest',
							items: [
								{
									name: 'Inn',
									textRotation: '0deg',
									textSize: 16,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(87 157 255 / 40%)',
									points: [
										{
											coordinates: [-58.375, 181.59375],
										},
										{
											coordinates: [-58.875, 183.28125],
										},
										{
											coordinates: [-58.75, 184.90625],
										},
										{
											coordinates: [-58.3125, 185.75],
										},
										{
											coordinates: [-57.40625, 186.59375],
										},
										{
											coordinates: [-56.53125, 187.0625],
										},
										{
											coordinates: [-56.75, 191.5625],
										},
										{
											coordinates: [-60.4375, 192.84375],
										},
										{
											coordinates: [-63.96875, 193.71875],
										},
										{
											coordinates: [-67.03125, 194],
										},
										{
											coordinates: [-67.75, 191.34375],
										},
										{
											coordinates: [-69.09375, 185.71875],
										},
										{
											coordinates: [-69.40625, 182.4375],
										},
										{
											coordinates: [-67.96875, 179.90625],
										},
										{
											coordinates: [-65.625, 179.8125],
										},
										{
											coordinates: [-64.9375, 179.09375],
										},
										{
											coordinates: [-62.40625, 179.09375],
										},
										{
											coordinates: [-60.53125, 180.21875],
										},
										{
											coordinates: [-60.25, 181],
										},
									],
								},
								{
									name: 'Fire Mages Monastery',
									textRotation: '0deg',
									textSize: 12,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(255 0 0 / 20%)',
									points: [
										{
											coordinates: [-0.125, 177.8125],
										},
										{
											coordinates: [-2.125, 178],
										},
										{
											coordinates: [-3.4375, 175.75],
										},
										{
											coordinates: [-6.1875, 171.0625],
										},
										{
											coordinates: [-9.625, 171.5625],
										},
										{
											coordinates: [-13.25, 171.75],
										},
										{
											coordinates: [-15.6875, 171.6875],
										},
										{
											coordinates: [-15.9375, 172.9375],
										},
										{
											coordinates: [-15.125, 175.625],
										},
										{
											coordinates: [-17, 177.75],
										},
										{
											coordinates: [-16.0625, 181.6875],
										},
										{
											coordinates: [-26.9375, 182.125],
										},
										{
											coordinates: [-26.1875, 177.9375],
										},
										{
											coordinates: [-26.4375, 172.0625],
										},
										{
											coordinates: [-28.3125, 168.5],
										},
										{
											coordinates: [-29.8125, 168.1875],
										},
										{
											coordinates: [-30.5, 172.75],
										},
										{
											coordinates: [-29.875, 179.6875],
										},
										{
											coordinates: [-31, 182.5625],
										},
										{
											coordinates: [-31.25, 184.75],
										},
										{
											coordinates: [-16.5, 184.3125],
										},
										{
											coordinates: [-16.5625, 187.9375],
										},
										{
											coordinates: [-17.875, 189.625],
										},
										{
											coordinates: [-15, 192.75],
										},
										{
											coordinates: [-16.1875, 196.8125],
										},
										{
											coordinates: [-16.375, 199.5625],
										},
										{
											coordinates: [-4.3125, 192.8125],
										},
										{
											coordinates: [-2, 186.6875],
										},
										{
											coordinates: [-0.0625, 187.625],
										},
									],
								},
							],
						},
					},
					submaps: {
						interiors: {
							korinis_island_interior_town_inn: {
								metadata: {
									path: 'maps/interiors/korinis_island/town_inn',
									sizes: {
										maxZoom: 3,
										imageWidth: 3300,
										imageHeight: 3300,
									},
									backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
								},
							},
							korinis_island_interior_harbour_inn: {
								metadata: {
									path: 'maps/interiors/korinis_island/harbour_inn',
									sizes: {
										maxZoom: 3,
										imageWidth: 4200,
										imageHeight: 4500,
									},
									backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
								},
							},
							korinis_island_interior_blacksmith: {
								metadata: {
									path: 'maps/interiors/korinis_island/blacksmith',
									sizes: {
										maxZoom: 3,
										imageWidth: 3450,
										imageHeight: 2250,
									},
									backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
								},
							},
							korinis_island_interior_pyramid_teleporter_c: {
								metadata: {
									path: 'maps/interiors/korinis_island/pyramid_teleporter/teleporter_c',
									sizes: {
										maxZoom: 3,
										imageWidth: 1800,
										imageHeight: 1200,
									},
									backgroundColor: 'rgb(13 15 3)',
								},
								annotations: {
									points_of_interest: {
										name: 'Points of Interest',
										items: [
											{
												lat: -110,
												lng: 196.625,
												label: 'Teleporter to A/B/C',
												type: 'place',
												icon: 'iconPortal',
												animationType: 'spin',
												iconType: 'png',
											},
										],
									},
								},
							},
							korinis_island_interior_water_mages_pyramid: {
								metadata: {
									path: 'maps/interiors/korinis_island/water_mages_pyramid',
									sizes: {
										maxZoom: 3,
										imageWidth: 7800,
										imageHeight: 4800,
									},
									backgroundColor: 'rgb(13 15 3)',
								},
							},
						},
						encounters: {
							korinis_island_encounters_bandits_01: {
								metadata: {
									path: 'maps/encounters/korinis_island/bandit_encounters/bandit_encounter_01',
									sizes: {
										maxZoom: 3,
										imageWidth: 4800,
										imageHeight: 1800,
									},
									backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
								},
								annotations: {
									navigation: {
										name: 'Navigation arrows',
										items: [
											{
												lat: -200,
												lng: 82.5,
												label: 'Towards goblin camp',
												type: 'place',
												icon: 'arrowDirectionDown',
												iconType: 'png',
											},
											{
												lat: -200,
												lng: 498,
												label: "Bandits' hideout",
												type: 'place',
												icon: 'arrowDirectionDown',
												iconType: 'png',
											},
										],
									},
								},
							},
						},
						extensions: {
							korinis_island_landing_zone: {
								metadata: {
									path: 'maps/world_maps/korinis_island/left_landing',
									sizes: {
										maxZoom: 5,
										imageWidth: 6144,
										imageHeight: 5805,
									},
									backgroundColor: 'rgb(10, 28, 33)',
								},
								annotations: {
									points_of_interest: {
										name: 'Points of Interest',
										items: [
											{
												lat: -169.9375,
												lng: 82.75,
												label: 'Landing zone',
												type: 'place',
												icon: 'cityCapital',
												iconType: 'png',
											},
											{
												lat: -174.72,
												lng: 24.25,
												label: 'World Map',
												type: 'text',
												fontSize: 14,
												mapLink: 'world_maps',
											},
										],
									},
									navigation_arrows: {
										name: 'Navigation Arrows',
										items: [
											{
												lat: -65.625,
												lng: 188.375,
												label: 'To Korinis City',
												type: 'place',
												icon: 'arrowDirectionRight',
												iconType: 'png',
												mapLink: 'korinis_city',
											},
										],
									},
									encounters: {
										name: 'Encounters',
										items: [
											{
												lat: -109.53125,
												lng: 131.71875,
												label: "Bandits' cave",
												type: 'place',
												icon: 'poiCave',
												iconType: 'png',
											},
										],
									},
								},
								paths: [
									{
										name: 'Session 1 recap',
										lineColor: '#352C63',
										points: [
											{
												coordinates: [-169.9375, 82.75],
												text: 'Landing zone for the party.',
											},
											{
												coordinates: [-160.3125, 88.5],
											},
											{
												coordinates: [-149.8125, 90.4375],
											},
											{
												coordinates: [-137.75, 91],
												text: 'Went up the path towards the mountains.',
											},
											{
												coordinates: [-129.875, 89.6875],
											},
											{
												coordinates: [-119.3125, 89.5625],
											},
											{
												coordinates: [-109.625, 94.625],
											},
											{
												coordinates: [-107.875, 97.25],
												text: 'At the crossroads, they met up with a guy who told them to follow him in the caves as there were some people looking for them. The party, after arguing a bit, agreed.',
											},
											{
												coordinates: [-108.6875, 105.875],
											},
											{
												coordinates: [-109.0625, 119.625],
											},
											{
												coordinates: [-109.53125, 131.71875],
												text: 'Turns out the people looking for them were bandits. Who could have guessed? After a fierce battle, the party emerged victorious. ',
											},
											{
												coordinates: [-107.9375, 118.4375],
											},
											{
												coordinates: [-107.625, 103.625],
											},
											{
												coordinates: [-105.4375, 96.6875],
												text: 'Back at the crossroads, they decided to go onwards to what they hoped would be a settlement.',
											},
											{
												coordinates: [-89.4375, 94.0625],
											},
											{
												coordinates: [-73.25, 95.4375],
											},
											{
												coordinates: [-64.5625, 103.875],
											},
											{
												coordinates: [-60.1875, 112.9375],
											},
											{
												coordinates: [-59.125, 125.6875],
											},
											{
												coordinates: [-62.0625, 139.5625],
											},
											{
												coordinates: [-65.0625, 151.5625],
												text: 'They saw a city in the background and a few farms to their right. Exhausted, they decided to go to one of the farmers.',
											},
											{
												coordinates: [-64.875, 166.375],
											},
											{
												coordinates: [-65.625, 188.375],
											},
										],
									},
								],
							},
							korinis_island_mercenaries_camp: {
								metadata: {
									path: 'maps/world_maps/korinis_island/mercenaries_camp',
									sizes: {
										maxZoom: 6,
										imageWidth: 8192,
										imageHeight: 6282,
									},
									backgroundColor: 'rgb(10, 28, 33)',
								},
								annotations: {
									navigation: {
										name: 'Navigation arrows',
										items: [
											{
												lat: -68.5,
												lng: 1.3,
												label: 'Towards Korinis City',
												type: 'place',
												icon: 'arrowDirectionLeft',
												iconType: 'png',
												mapLink: 'korinis_city',
											},
										],
									},
									npcs: {
										name: 'NPCs',
										items: [
											{
												lat: -68,
												lng: 41.625,
												label: 'Mercenary Guards',
												type: 'people',
												icon: 'fort',
												iconType: 'png',
											},
											{
												lat: -77.625,
												lng: 40.96875,
												label: "Erol's house",
												type: 'people',
												icon: 'poiGenericNPC',
												iconType: 'png',
											},
											{
												lat: -32.125,
												lng: 87.40625,
												label: 'Silvestro',
												type: 'people',
												icon: 'poiGenericNPC',
												iconType: 'png',
											},
											{
												lat: -28.84375,
												lng: 85.265625,
												label: 'Quixie & The Other Merchant',
												type: 'people',
												icon: 'tradeCampLarge',
												iconType: 'png',
											},
											{
												lat: -20.0625,
												lng: 83.375,
												label: 'General Lee',
												type: 'people',
												icon: 'poiGenericNPC',
												iconType: 'png',
											},
											{
												lat: -17.1875,
												lng: 94.96875,
												label: 'Farm Blacksmith',
												type: 'people',
												icon: 'tradeForge',
												iconType: 'png',
											},
										],
									},
									points_of_interest: {
										name: 'Points of Interest',
										items: [
											{
												lat: -26.90625,
												lng: 70.375,
												label: 'The Chocolate Contest Tavern',
												type: 'people',
												icon: 'poiBed_map',
												iconType: 'png',
											},
											{
												lat: -32.25,
												lng: 67.5625,
												label: 'Farm Chapel',
												type: 'people',
												icon: 'templeShrine',
												iconType: 'png',
											},
											{
												lat: -8.53125,
												lng: 102.171875,
												label: 'Tower',
												type: 'people',
												icon: 'fortTower',
												iconType: 'png',
											},
										],
									},
								},
								paths: [
									{
										name: 'Session 8 Recap',
										lineColor: '#ff5722',
										points: [
											{
												coordinates: [-68.1875, 3.125],
											},
											{
												coordinates: [-68.1875, 35.5625],
											},
											{
												coordinates: [-69.25, 36.75],
											},
											{
												coordinates: [-75.625, 36.5625],
											},
											{
												coordinates: [-79.4375, 37.875],
											},
											{
												coordinates: [-77.625, 40.9375],
												text: "Went to Erol's house and met with him. Learned about the guards and Silvestro's quota.",
											},
											{
												coordinates: [-75.5, 38.1875],
											},
											{
												coordinates: [-68.5, 38],
											},
											{
												coordinates: [-68.3125, 42.125],
											},
											{
												coordinates: [-68, 46.6875],
											},
											{
												coordinates: [-68.375, 62.9375],
											},
											{
												coordinates: [-68.34375, 68.515625],
												text: 'Saw a meadow with a lot of cows and sheep on the right, and huge farmlands to the left.',
											},
											{
												coordinates: [-68.4375, 87.25],
											},
											{
												coordinates: [-67.6875, 88.4375],
												text: 'Decided to make a left turn here towards the farm.',
											},
											{
												coordinates: [-58.875, 87.8125],
											},
											{
												coordinates: [-46, 87.625],
											},
											{
												coordinates: [-39.0625, 87.375],
											},
											{
												coordinates: [-34.4375, 87.6875],
											},
											{
												coordinates: [-32.5, 87.625],
											},
											{
												coordinates: [-32.25, 87.5],
												text: 'Met up with Silvestro, learned about the farm and paid the 20 gold per person tax.',
											},
											{
												coordinates: [-29.546875, 85.4375],
												text: 'Met up with the two merchants - Quixie and Jabba the Hutt. Bought 1 haste potion and two items for approximately 1000g.',
											},
											{
												coordinates: [-30.5, 84.40625],
											},
											{
												coordinates: [-30.421875, 80.375],
											},
											{
												coordinates: [-30.34375, 80.3125],
												text: 'Saw that the inn to the left was holding a competition for whoever could eat the most chocolate. Nobody could resist such temptation.',
											},
											{
												coordinates: [-29.171875, 78.90625],
											},
											{
												coordinates: [-26.9375, 77.734375],
											},
											{
												coordinates: [-27, 70.390625],
												text: 'Entered the contest - the Cleric and the Barbarian won, and ate a stew which increased their max HP by 5. The others puked.',
											},
											{
												coordinates: [-26.421875, 77.078125],
											},
											{
												coordinates: [-26.65625, 78.09375],
											},
											{
												coordinates: [-26.40625, 82.578125],
											},
											{
												coordinates: [-24.40625, 83.203125],
											},
											{
												coordinates: [-22.171875, 82.84375],
												text: "Met up with General Lee and learned that they wanted to leave the island and were planning to take over the city. While trying to help, the party might've accidentally killed Captain Cunts by revealing his location to the pirate queen Bianca. Lee told the party, under the condition that they help Lee's lieutenants too, that the valley of mines was currently under siege by the Lizardmen, and that the only 'safe' entrance was through another path his spies had been using for a while.",
											},
											{
												coordinates: [-22.28125, 84.765625],
												text: 'Met up with another follower of the Water Mages guild who was training the mercenary recruits. Trained with him and gained expertise with chosen weapons.',
											},
											{
												coordinates: [-24.71875, 84.078125],
											},
											{
												coordinates: [-23.25, 87.75],
											},
											{
												coordinates: [-22.515625, 91.03125],
											},
											{
												coordinates: [-19.15625, 93.484375],
												text: 'Went to the Blacksmith to learn about their trade.',
											},
											{
												coordinates: [-19.75, 93.921875],
											},
											{
												coordinates: [-23.703125, 91.1875],
											},
											{
												coordinates: [-26.765625, 89.28125],
											},
											{
												coordinates: [-33.171875, 87.921875],
											},
											{
												coordinates: [-39.34375, 87.734375],
											},
											{
												coordinates: [-45.390625, 86.734375],
											},
											{
												coordinates: [-55.328125, 86.765625],
											},
											{
												coordinates: [-60.8125, 87.140625],
											},
											{
												coordinates: [-66.921875, 87.390625],
											},
											{
												coordinates: [-67.453125, 82.484375],
												text: 'Going back to the inn and towards the penal colony.',
											},
											{
												coordinates: [-67.140625, 74.453125],
											},
											{
												coordinates: [-67.25, 52.25],
											},
											{
												coordinates: [-66.890625, 41.765625],
												text: 'Noticed there was another set of guards compared to the first time.',
											},
											{
												coordinates: [-67.1875, 31.859375],
											},
											{
												coordinates: [-67.15625, 9.3125],
											},
											{
												coordinates: [-67.21875, 0.859375],
											},
										],
									},
								],
								areas: {
									buildings: {
										name: 'Buildings',
										items: [
											{
												name: "Erol's house",
												textRotation: '0deg',
												textSize: 16,
												textFontType: 'title',
												lineColor: 'rgb(50 94 102 / 40%)',
												interiorColor: 'rgb(50 94 102 / 40%)',
												points: [
													{
														coordinates: [-69.25, 35.84375],
													},
													{
														coordinates: [-69.09375, 25.0625],
													},
													{
														coordinates: [-73.84375, 21.0625],
													},
													{
														coordinates: [-79.9375, 21.15625],
													},
													{
														coordinates: [-79.40625, 24.46875],
													},
													{
														coordinates: [-78.3125, 29.3125],
													},
													{
														coordinates: [-78.78125, 33.90625],
													},
													{
														coordinates: [-79.71875, 35.5],
													},
													{
														coordinates: [-80.53125, 38.25],
													},
													{
														coordinates: [-81.4375, 44.375],
													},
													{
														coordinates: [-80.59375, 46.8125],
													},
													{
														coordinates: [-73.96875, 47.4375],
													},
													{
														coordinates: [-70.125, 49.1875],
													},
													{
														coordinates: [-69.25, 47.0625],
													},
													{
														coordinates: [-69.09375, 38.53125],
													},
												],
											},
										],
									},
									farms: {
										name: 'Farmlands',
										items: [
											{
												name: 'Farmland with bovine and sheep',
												textRotation: '0deg',
												textSize: 12,
												textFontType: 'title',
												lineColor: 'rgb(226 178 3 / 40%)',
												interiorColor: 'rgb(226 178 3 / 40%)',
												points: [
													{
														coordinates: [-69.1875, 52.5],
													},
													{
														coordinates: [-71.828125, 49.65625],
													},
													{
														coordinates: [-75.328125, 47.703125],
													},
													{
														coordinates: [-79.453125, 47.515625],
													},
													{
														coordinates: [-85.609375, 56.359375],
													},
													{
														coordinates: [-89.15625, 58.4375],
													},
													{
														coordinates: [-93.28125, 57.25],
													},
													{
														coordinates: [-96.6875, 58.09375],
													},
													{
														coordinates: [-96.796875, 64.703125],
													},
													{
														coordinates: [-96.796875, 74.640625],
													},
													{
														coordinates: [-95.390625, 79.5],
													},
													{
														coordinates: [-92.4375, 82.4375],
													},
													{
														coordinates: [-90.6875, 85.1875],
													},
													{
														coordinates: [-84.375, 86.703125],
													},
													{
														coordinates: [-74.625, 87.125],
													},
													{
														coordinates: [-70.84375, 87.234375],
													},
													{
														coordinates: [-69.265625, 85.5],
													},
													{
														coordinates: [-69.359375, 69.46875],
													},
												],
											},
											{
												name: "Oviedo's Farms",
												textRotation: '0deg',
												textSize: 16,
												textFontType: 'title',
												lineColor: 'rgb(226 178 3 / 40%)',
												interiorColor: 'rgb(226 178 3 / 40%)',
												points: [
													{
														coordinates: [-63.8125, 37.25],
													},
													{
														coordinates: [-43.75, 37.375],
													},
													{
														coordinates: [-37.5, 41.75],
													},
													{
														coordinates: [-37.625, 48.75],
													},
													{
														coordinates: [-31.125, 48.9375],
													},
													{
														coordinates: [-17.3125, 50.5],
													},
													{
														coordinates: [-17.625, 66.3125],
													},
													{
														coordinates: [-16.6875, 73.6875],
													},
													{
														coordinates: [-20.125, 74.1875],
													},
													{
														coordinates: [-23.5625, 65],
													},
													{
														coordinates: [-29.8125, 65.1875],
													},
													{
														coordinates: [-31.5625, 64.25],
													},
													{
														coordinates: [-35.4375, 66.5],
													},
													{
														coordinates: [-38.3125, 65],
													},
													{
														coordinates: [-40.75, 67.4375],
													},
													{
														coordinates: [-43.9375, 67.6875],
													},
													{
														coordinates: [-49.125, 72.625],
													},
													{
														coordinates: [-50.625, 74.75],
													},
													{
														coordinates: [-50.6875, 76.9375],
													},
													{
														coordinates: [-47.625, 77.6875],
													},
													{
														coordinates: [-40.25, 75.5625],
													},
													{
														coordinates: [-36.3125, 77.9375],
													},
													{
														coordinates: [-32.0625, 80.9375],
													},
													{
														coordinates: [-32.0625, 85.6875],
													},
													{
														coordinates: [-44.6875, 84.75],
													},
													{
														coordinates: [-56.5, 84.875],
													},
													{
														coordinates: [-64.0625, 84.625],
													},
												],
											},
										],
									},
								},
							},
							korinis_island_penal_colony: {
								metadata: {
									path: 'maps/world_maps/korinis_island/penal_colony',
									sizes: {
										maxZoom: 6,
										imageWidth: 8192,
										imageHeight: 6430,
									},
									backgroundColor: 'rgb(10, 28, 33)',
								},
								annotations: {
									navigation_arrows: {
										name: 'Navigation arrows',
										items: [
											{
												lat: -1.46875,
												lng: 64.40625,
												label: 'To Korinis City',
												type: 'people',
												icon: 'arrowDirectionUp',
												iconType: 'png',
												mapLink: 'korinis_city',
											},
										],
									},
									points_of_interest: {
										name: 'Points of Interest',
										items: [
											{
												lat: -26.8125,
												lng: 33.8125,
												label: 'Unnamed farm',
												type: 'people',
												icon: 'poiFarm',
												iconType: 'png',
											},
										],
									},
									combat_encounters: {
										name: 'Combat encounters',
										items: [
											{
												lat: -20.75,
												lng: 80.3125,
												label: 'Ruined Tower Mages',
												type: 'people',
												icon: 'poiCombat',
												iconType: 'png',
											},
										],
									},
								},
								paths: [
									{
										name: 'Session 8 Recap',
										lineColor: '#ff5722',
										points: [
											{
												coordinates: [-2.375, 64.75],
												text: '[Continued from Korinis City map]\nIn front of them, they saw the road and two paladins standing guard. To their left, a ruined tower; to their right, farmland.',
											},
											{
												coordinates: [-10.25, 65.125],
											},
											{
												coordinates: [-17, 73.25],
												text: 'Their passive perception not enough, the party was ambushed by a party of 3 orc mages - each master of a different element: fire, ice and lightning. After a fierce battle, they emerged victorious.',
											},
										],
									},
								],
							},
						},
					},
				},
				unnamed_island_01: {
					metadata: {
						path: 'maps/world_maps/unnamed_island_01',
						sizes: {
							maxZoom: 3,
							imageWidth: 4096,
							imageHeight: 3072,
						},
						backgroundColor: 'radial-gradient(rgb(22 62 72), rgb(20 62 75))',
					},
					annotations: {
						combat_encounters: {
							name: 'Combat encounters',
							items: [
								{
									lat: -126.625,
									lng: 314.75,
									label: 'Finneas combat encounter',
									type: 'place',
									icon: 'iconPortal',
									iconType: 'png',
									mapLink: 'finneas_encounter',
								},
								{
									lat: -193.5,
									lng: 241.5,
									label: 'Dinosaurs combat encounter',
									type: 'place',
									icon: 'poiCombat',
									iconType: 'png',
								},
							],
						},
						points_of_interest: {
							name: 'Points of Interest',
							items: [
								{
									lat: -326.25,
									lng: 206.75,
									label: 'Landing zone',
									type: 'place',
									icon: 'cityCapital',
									iconType: 'png',
								},
							],
						},
					},
					paths: [
						{
							name: 'Session 1 Recap',
							points: [
								{
									coordinates: [-329.5, 180.75],
									text: 'Landed on beach.',
								},
								{
									coordinates: [-289.5, 222.5],
								},
								{
									coordinates: [-289.5, 222.5],
									text: 'Went up to the mountain path',
								},
								{
									coordinates: [-272, 227],
								},
								{
									coordinates: [-266.5, 214.5],
								},
								{
									coordinates: [-260, 206],
								},
								{
									coordinates: [-253.5, 212],
								},
								{
									coordinates: [-250.5, 223.5],
								},
								{
									coordinates: [-247.5, 229],
								},
								{
									coordinates: [-240, 232],
								},
								{
									coordinates: [-232.5, 232],
								},
								{
									coordinates: [-224, 226.5],
								},
								{
									coordinates: [-215.5, 226.5],
								},
								{
									coordinates: [-209.5, 235],
								},
								{
									coordinates: [-198.5, 229],
								},
								{
									coordinates: [-193.5, 241.5],
									text: 'Fought dinosaurs',
								},
								{
									coordinates: [-171, 244],
								},
								{
									coordinates: [-163, 257],
								},
								{
									coordinates: [-154, 271],
								},
								{
									coordinates: [-143, 277.5],
								},
								{
									coordinates: [-138.5, 286],
								},
								{
									coordinates: [-150.5, 289],
								},
								{
									coordinates: [-162, 296],
									text: 'Reached lake.',
								},
								{
									coordinates: [-147.5, 306],
									text: 'Climbed onto platforms.',
								},
								{
									coordinates: [-126.625, 314.75],
									text: 'Entered door, met Finneas, fought undeads.',
								},
								{
									coordinates: [-143.5, 324.5],
								},
								{
									coordinates: [-170, 305.5],
									text: 'Left, shot flare to notify the crew we found water.',
								},
								{
									coordinates: [-176, 289.5],
								},
								{
									coordinates: [-183, 277.5],
								},
								{
									coordinates: [-197.5, 276],
									text: 'Took another path down the mountain, found dead crew member parties bodies and looted them.',
								},
								{
									coordinates: [-209.5, 281.5],
								},
								{
									coordinates: [-215, 274.5],
								},
								{
									coordinates: [-222.5, 251.5],
								},
								{
									coordinates: [-222.5, 238.5],
								},
								{
									coordinates: [-225.75, 234],
								},
								{
									coordinates: [-236.5, 237.625],
								},
								{
									coordinates: [-248, 235],
								},
								{
									coordinates: [-254.625, 218.25],
								},
								{
									coordinates: [-262.5, 218],
								},
								{
									coordinates: [-273.25, 232.75],
								},
								{
									coordinates: [-298.625, 230],
									text: 'Saw the ship preparing to depart without waiting for us.',
								},
								{
									coordinates: [-317.375, 218.375],
								},
								{
									coordinates: [-317.375, 218.375],
								},
								{
									coordinates: [-346.875, 193.75],
								},
								{
									coordinates: [-351.75, 125.25],
									text: "Made a run for it and reached the ship back in time so we didn't get left behind.",
								},
							],
						},
					],
					submaps: {
						encounters: {
							finneas_encounter: {
								metadata: {
									path: 'maps/encounters/unnamed_island_01/finneas_dungeon',
									sizes: {
										maxZoom: 3,
										imageWidth: 7800,
										imageHeight: 4800,
									},
									backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
								},
							},
						},
					},
				},
			},
			combat_encounters: {
				bone_wraiths_encounter_01: {
					metadata: {
						path: 'maps/encounters/world_map/bone_wraiths_encounter_01',
						sizes: {
							maxZoom: 3,
							imageWidth: 6144,
							imageHeight: 3072,
						},
						backgroundColor: '#0a1c21',
					},
				},
			},
		},
	},
};
