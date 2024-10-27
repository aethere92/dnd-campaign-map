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
						mapLink: 'world_maps.submaps.islands.unnamed_island_01',
					},
					{
						lat: -214.5,
						lng: 74.875,
						label: 'Korinis',
						type: 'place',
						icon: 'cityCapital',
						iconType: 'png',
						mapLink: 'world_maps.submaps.islands.main_map_01',
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
					},
				],
			},
		},
		submaps: {
			islands: {
				main_map_01: {
					metadata: {
						path: 'maps/world_maps/main_map_01',
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
								},
								{
									lat: -57.890625,
									lng: 81.734375,
									label: 'Valros (Water mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
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
									mapLink: 'world_maps.submaps.islands.main_map_01.submaps.interiors.main_map_interior_blacksmith',
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
									lat: -1.875,
									lng: 100.875,
									label: 'World Map',
									type: 'text',
									mapLink: 'world_maps',
								},
								{
									lat: -50.5,
									lng: 106.8125,
									label: 'Inn',
									type: 'place',
									icon: 'poiBed',
									iconType: 'png',
									mapLink: 'world_maps.submaps.islands.main_map_01.submaps.interiors.main_map_interior_town_inn',
								},
								{ lat: -61.59375, lng: 185.328125, label: 'Inn', type: 'place', icon: 'poiBed', iconType: 'png' },
								{
									lat: -27.5625,
									lng: 71.875,
									label: 'Harbour Inn',
									type: 'place',
									icon: 'poiBed',
									iconType: 'png',
									image: 'harbour_inn.png',
									mapLink: 'world_maps.submaps.islands.main_map_01.submaps.interiors.main_map_interior_harbour_inn',
								},
								{
									lat: -36.90625,
									lng: 109.25,
									label: 'Paladin Barracks',
									type: 'place',
									icon: 'city',
									iconType: 'png',
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
								{ lat: -2.34375, lng: 55.25, label: 'Paladin ship', type: 'place', icon: 'city' },
								{
									lat: -34.390625,
									lng: 133.75,
									label: 'Teleporter Exit B',
									type: 'place',
									icon: 'mageTower',
								},
								{
									lat: -71.5625,
									lng: 176.625,
									label: 'Teleporter Exit C',
									type: 'place',
									icon: 'mageTower',
									mapLink:
										'world_maps.submaps.islands.main_map_01.submaps.interiors.main_map_interior_pyramid_teleporter_c',
								},
								{
									lat: -2.953125,
									lng: 142.953125,
									label: 'Water Mages Pyramid',
									type: 'place',
									icon: 'templePyramid',
									mapLink:
										'world_maps.submaps.islands.main_map_01.submaps.interiors.main_map_interior_water_mages_pyramid',
								},
							],
						},
						navigation: {
							name: 'Navigation arrows',
							items: [
								{
									lat: -56.1875,
									lng: 204.875,
									label: 'To Mercenaries',
									type: 'place',
									icon: 'arrowRight',
									iconType: 'svg',
								},
								{
									lat: -81.21875,
									lng: 195.953125,
									label: 'To Penal Colony',
									type: 'place',
									icon: 'arrowDown',
									iconType: 'svg',
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
									mapLink: 'world_maps.submaps.islands.main_map_01.submaps.encounters.main_map_encounters_bandits_01',
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
									image: 'goblin_camp_01.png',
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
									icon: 'poiLandmarks',
									iconType: 'png',
									description: `The main town of Korinis is a captivating town of contrasts. Nestled between the open waters and rugged hills, its bustling harbour is alive with the scent of saltwater and the sounds of merchants peddling their wares amidst poverty and resourcefulness. The lower city, a maze of alleys and market squares, thrives with commerce and crafts, shadowed by the vigilant paladins who ensure safety at the cost of freedom. The upper city, dominated by the paladins' formidable barracks, exudes grandeur and control, with wide streets and grand homes. In this town of Lustria, prosperity and poverty coexist, and every street tells a story.`,
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
									text: "Reached Lombart farm and talked to its master. Learned the cost of entry into the city and were told to do deeds to gain money for it. Talked to the lead farmer's wife and got a task from her.",
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
							name: 'Session 3 Recap',
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
									text: 'Decided to go to pyramids.',
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
									text: 'Ranger and Sorcerer failed athletics check and injured.',
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
									text: 'Saw inactive golem to the right',
								},
								{
									coordinates: [-22.46875, 152.03125],
								},
								{
									coordinates: [-19.140625, 153.4375],
									text: 'Paid 2 silver per person to cross the river to the troll.',
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
									text: 'Saw ruins to the right and 2 chests.',
								},
								{
									coordinates: [-3.1875, 151.96875],
								},
								{
									coordinates: [-2.5625, 150.28125],
									text: 'Went into tents and found water mages location',
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
									text: 'Entered the pyramid to find water mages.',
								},
							],
						},
					],
					submaps: {
						interiors: {
							main_map_interior_town_inn: {
								metadata: {
									path: 'maps/interiors/main_map_01/town_inn',
									sizes: {
										maxZoom: 3,
										imageWidth: 3300,
										imageHeight: 3300,
									},
									backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
								},
							},
							main_map_interior_harbour_inn: {
								metadata: {
									path: 'maps/interiors/main_map_01/harbour_inn',
									sizes: {
										maxZoom: 3,
										imageWidth: 4200,
										imageHeight: 4500,
									},
									backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
								},
							},
							main_map_interior_blacksmith: {
								metadata: {
									path: 'maps/interiors/main_map_01/blacksmith',
									sizes: {
										maxZoom: 3,
										imageWidth: 3450,
										imageHeight: 2250,
									},
									backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
								},
							},
							main_map_interior_pyramid_teleporter_c: {
								metadata: {
									path: 'maps/interiors/main_map_01/pyramid_teleporter/teleporter_c',
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
												lat: -103.875,
												lng: 196.625,
												label: 'Teleporter to A/B/C',
												type: 'place',
												icon: 'mageTower',
												iconType: 'png',
											},
										],
									},
								},
							},
							main_map_interior_water_mages_pyramid: {
								metadata: {
									path: 'maps/interiors/main_map_01/water_mages_pyramid',
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
							main_map_encounters_bandits_01: {
								metadata: {
									path: 'maps/encounters/main_map_01/bandit_encounters/bandit_encounter_01',
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
												icon: 'arrowDown',
												iconType: 'svg',
											},
											{
												lat: -200,
												lng: 498,
												label: "Bandits' hideout",
												type: 'place',
												icon: 'arrowDown',
												iconType: 'svg',
											},
										],
									},
								},
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
									icon: 'mageTower',
									iconType: 'png',
									mapLink: 'world_maps.submaps.islands.unnamed_island_01.submaps.encounters.finneas_encounter',
								},
							],
						},
					},
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
		},
	},
};
