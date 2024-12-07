const CAMPAIGN_01_ALIASES = {
	world_map: 'world_maps',

	// UNNAMED ISLAND
	unnamed_island_01: 'world_maps.submaps.islands.unnamed_island_01',
	finneas_encounter: 'world_maps.submaps.islands.unnamed_island_01.submaps.encounters.finneas_encounter',

	//BONE WRAITHS
	bone_wraiths_01: 'world_maps.submaps.combat_encounters.bone_wraiths_encounter_01',

	// KORINIS
	korinis_island: 'world_maps.submaps.islands.korinis_island',
	korinis_pyramid:
		'world_maps.submaps.islands.korinis_island.submaps.interiors.korinis_island_interior_water_mages_pyramid',
	korinis_teleporter_c:
		'world_maps.submaps.islands.korinis_island.submaps.interiors.korinis_island_interior_pyramid_teleporter_c',

	// KORINIS ENCOUNTERS
	korinis_bandits_01:
		'world_maps.submaps.islands.korinis_island.submaps.encounters.korinis_island_encounters_bandits_01',
	korinis_spider_cave: 'world_maps.submaps.islands.korinis_island.submaps.encounters.korinis_island_spider_cave',
};

const CAMPAIGN_01 = {
	world_maps: {
		metadata: {
			path: 'maps/world_maps/world_map',
			sizes: {
				maxZoom: 5,
				imageWidth: 8192,
				imageHeight: 8192,
			},
			backgroundColor: `linear-gradient(rgba(26, 20, 18, 0.97), rgba(26, 20, 18, 0.97)),url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23241c1a' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
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
						mapLink: 'korinis_island',
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
						path: 'maps/world_maps/korinis_island',
						sizes: {
							maxZoom: 5,
							imageWidth: 32069,
							imageHeight: 16845,
						},
						backgroundColor: `linear-gradient(rgba(26, 20, 18, 0.97), rgba(26, 20, 18, 0.97)),url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23241c1a' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
					},
					annotations: {
						npcs: {
							name: 'NPCs',
							items: [
								{
									lat: -127.25,
									lng: 511.125,
									label: 'Darren (Fire mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
									image: 'f965a770-b841-462c-8325-8dd483cca8a1.jpg',
								},
								{
									lat: -166.03125,
									lng: 442.5,
									label: 'Valros (Water mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
									image: 'bcaa3de1-7d67-4909-92b0-dea60f63bf71.jpg',
								},
								{
									lat: -165.25,
									lng: 621,
									label: 'Erol (tablets)',
									type: 'place',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -98.5,
									lng: 652.1875,
									label: 'Isgaroth (Fire mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -162.5625,
									lng: 425.1875,
									label: 'Thorben (Carpenter)',
									type: 'people',
									icon: 'tradeHunter',
									iconType: 'png',
								},
								{
									lat: -155.3125,
									lng: 428.03125,
									label: 'Constantine (Alchemist)',
									type: 'people',
									icon: 'tradeAlchemy',
									iconType: 'png',
								},
								{
									lat: -124.21875,
									lng: 453.125,
									label: 'Thorek (Blacksmith)',
									type: 'people',
									icon: 'tradeForge',
									iconType: 'png',
								},
								{
									lat: -98.25,
									lng: 316.34375,
									label: 'Lizardman',
									type: 'people',
									icon: 'cityLizard',
									iconType: 'png',
								},
								{
									lat: -75.9375,
									lng: 604.0625,
									label: 'Bridge Troll',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -57.5,
									lng: 911.96875,
									label: 'Farm Blacksmith',
									type: 'people',
									icon: 'tradeForge',
									iconType: 'png',
								},
								{
									lat: -63.625,
									lng: 888.75,
									label: 'General Lee',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -82.9375,
									lng: 893.375,
									label: 'Quixie & The Other Merchant',
									type: 'people',
									icon: 'tradeCampLarge',
									iconType: 'png',
								},
								{
									lat: -88.625,
									lng: 897.375,
									label: 'Silvestro',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -159.75,
									lng: 804.8125,
									label: 'Mercenary Guards',
									type: 'people',
									icon: 'fort',
									iconType: 'png',
								},
								{
									lat: -356.875,
									lng: 698.75,
									label: 'Penal Colony Paladin Guards',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -423.25,
									lng: 590.25,
									label: 'Quickse and the Penguin',
									type: 'people',
									icon: 'tradeCamp',
									iconType: 'png',
								},
							],
						},
						points_of_interest: {
							name: 'Points of interest',
							items: [
								{
									lat: -274.375,
									lng: 137.375,
									label: 'Landing zone',
									type: 'place',
									icon: 'cityCapital',
									iconType: 'png',
								},
								{
									lat: -277,
									lng: 412,
									label: 'World Map',
									type: 'text',
									fontSize: 20,
									mapLink: 'world_maps',
								},
								{
									lat: -148,
									lng: 497.5,
									label: 'Lower City Inn',
									type: 'place',
									icon: 'poiBed',
									iconType: 'png',
								},
								{ lat: -173.3125, lng: 676.1875, label: 'Inn', type: 'place', icon: 'poiBed', iconType: 'png' },
								{
									lat: -96.25,
									lng: 416.5625,
									label: 'Harbour Inn',
									type: 'place',
									icon: 'poiBed',
									iconType: 'png',
									image: 'af14542d-6e79-4d4d-b9d7-8e2037a45307.jpg',
								},
								{
									lat: -116.5,
									lng: 502.75,
									label: 'Paladin Barracks',
									type: 'place',
									icon: 'city',
									iconType: 'png',
									image: 'cd2dbe90-39eb-483d-9ad5-85e36fda39b2.jpg',
								},
								{ lat: -220.5, lng: 389.375, label: 'Paladin Hall', type: 'place', icon: 'city', iconType: 'png' },
								{
									lat: -57.5,
									lng: 670.3125,
									label: 'Fire Mages Monastery',
									type: 'place',
									icon: 'templeCathedral',
									iconType: 'png',
								},
								{
									lat: -120.1875,
									lng: 390.6875,
									label: 'Pawn shop',
									type: 'place',
									icon: 'tradeShop',
									iconType: 'png',
								},
								{
									lat: -138.34375,
									lng: 565.78125,
									label: 'Secob Farm',
									type: 'place',
									icon: 'poiFarm',
									iconType: 'png',
								},
								{
									lat: -145.375,
									lng: 283.15625,
									label: 'Lobart Farm',
									type: 'place',
									icon: 'poiFarm',
									iconType: 'png',
									description:
										"The adventurers arrived at a farm on the outskirts of the city, seeking entry but lacking the necessary gold. Speaking with one of the farmers, they learned that the head farmer might offer them a way in. They approached him and were given a proposition: earn gold by helping with the crops and assisting the farmer's wife with her tasks.",
								},
								{
									lat: -290.75,
									lng: 713.375,
									label: 'Unnamed farm',
									type: 'people',
									icon: 'poiFarm',
									iconType: 'png',
								},
								{
									lat: -217.25,
									lng: 585.5625,
									label: 'Caves (scales + blue blood)',
									type: 'place',
									icon: 'poiCave',
									iconType: 'png',
								},
								{ lat: -41, lng: 378, label: 'Paladin ship', type: 'place', icon: 'poiShip' },
								{
									lat: -110.6875,
									lng: 558.0625,
									label: 'Teleporter Exit B',
									type: 'place',
									icon: 'iconPortal',
									animationType: 'spin',
								},
								{
									lat: -198.3125,
									lng: 655.8125,
									label: 'Teleporter Exit C',
									type: 'place',
									icon: 'iconPortal',
									animationType: 'spin',
									mapLink: 'korinis_teleporter_c',
								},
								{
									lat: -40.125,
									lng: 580.125,
									label: 'Water Mages Pyramid',
									type: 'place',
									icon: 'templePyramid',
									image: '241bf32d-094b-49d7-ba81-3a224d39da82.jpg',
									mapLink: 'korinis_pyramid',
								},
								{
									lat: -179.9375,
									lng: 803.5625,
									label: "Erol's house",
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -88.5625,
									lng: 858.34375,
									label: 'Farm Chapel',
									type: 'people',
									icon: 'templeShrine',
									iconType: 'png',
								},
								{
									lat: -77.6875,
									lng: 863.5625,
									label: 'The Chocolate Contest Tavern',
									type: 'people',
									icon: 'poiBed_map',
									iconType: 'png',
								},
								{
									lat: -41.25,
									lng: 927.15625,
									label: 'Tower',
									type: 'people',
									icon: 'fortTower',
									iconType: 'png',
								},
								{
									lat: -384.9375,
									lng: 708,
									label: 'Cave shortcut entrance',
									type: 'people',
									icon: 'poiCave',
									iconType: 'png',
									mapLink: 'korinis_spider_cave',
								},
								{
									lat: -392.5,
									lng: 714.6875,
									label: 'Cave shortcut exit',
									type: 'people',
									icon: 'poiCave',
									iconType: 'png',
									mapLink: 'korinis_spider_cave',
								},
								{
									lat: -391.625,
									lng: 686.1875,
									label: 'Mine entrance',
									type: 'people',
									icon: 'poiCave',
									iconType: 'png',
								},
								{
									lat: -418.3125,
									lng: 646.9375,
									label: 'Mine shortcut exit',
									type: 'people',
									icon: 'poiCave',
									iconType: 'png',
								},
								{
									lat: -414.125,
									lng: 531.375,
									label: "Diego's hideout",
									type: 'people',
									icon: 'poiBed',
									iconType: 'png',
								},
								{
									lat: -503.75,
									lng: 534.5,
									label: 'Paladin Citadel',
									type: 'people',
									icon: 'city',
									iconType: 'png',
								},
							],
						},
						combat_encounters: {
							name: 'Combat encounters',
							items: [
								{ lat: -111.25, lng: 349.25, label: 'Wolves', type: 'place', icon: 'poiDanger', iconType: 'png' },
								{ lat: -200.1875, lng: 564.34375, label: 'Wolves', type: 'place', icon: 'poiCombat', iconType: 'png' },
								{
									lat: -94.1875,
									lng: 361.90625,
									label: 'Bandits',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
									mapLink: 'korinis_bandits_01',
								},
								{
									lat: -125.9375,
									lng: 605.5625,
									label: 'Bandits',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
								},
								{
									lat: -114.0625,
									lng: 332.59375,
									label: 'Goblin camp',
									type: 'place',
									icon: 'poiCombat',
									iconType: 'png',
									description: `The adventurers, hoping to make a new ally, approached the lizardman with friendly intentions. However, their efforts were met with hostility as the lizardman attacked them. The battle was intense, with the group struggling to subdue their reptilian foe. Just as they seemed to gain the upper hand, a group of goblins ambushed them from the shadows. The adventurers fought valiantly, managing to defeat the goblins, but in the chaos, one of the goblins used a spell to explode nearby corpses, which killed the lizardman, whom they had been trying to keep alive.`,
									image: '5f2e59cb-3f54-452f-bbd9-63905789961a.jpg',
								},
								{
									lat: -89.0625,
									lng: 614.3125,
									label: 'Inactive Golem',
									type: 'place',
									icon: 'poiDanger',
									iconType: 'png',
								},
								{
									lat: -46.9375,
									lng: 594.1875,
									label: 'Snapers',
									type: 'place',
									icon: 'poiDanger',
									iconType: 'png',
								},
								{
									lat: -32.75,
									lng: 609.9375,
									label: 'Wasps',
									type: 'place',
									icon: 'poiDanger',
									iconType: 'png',
								},
								{
									lat: -238.9375,
									lng: 683.5625,
									label: 'Ruined Tower Mages',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
								},
								{
									lat: -193.625,
									lng: 200.625,
									label: "Bandits' cave",
									type: 'place',
									icon: 'poiCave',
									iconType: 'png',
								},
								{
									lat: -386.5,
									lng: 716,
									label: 'Cave spiders encounter',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
								},
								{
									lat: -445,
									lng: 584.125,
									label: 'Dinosaurs combat ambush',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
								},
							],
						},
						landmarks: {
							name: 'Landmarks',
							items: [
								{
									lat: -142.0625,
									lng: 376.0625,
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
							lineColor: '#e2b203',
							points: [
								{
									coordinates: [-275.25, 138.375],
									text: 'Landing zone for the party.',
								},
								{
									coordinates: [-260.75, 144.0625],
								},
								{
									coordinates: [-248.6875, 147.5],
								},
								{
									coordinates: [-240.1875, 148],
									text: 'Went up the path towards the mountains.',
								},
								{
									coordinates: [-229.0625, 147.125],
								},
								{
									coordinates: [-220.3125, 145.25],
								},
								{
									coordinates: [-207.625, 146],
								},
								{
									coordinates: [-197.375, 150],
								},
								{
									coordinates: [-192.0625, 153.625],
								},
								{
									coordinates: [-192.25, 161.1875],
									text: 'At the crossroads, they met up with a guy who told them to follow him in the caves as there were some people looking for them. The party, after arguing a bit, agreed.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-193.3125, 173.5625],
								},
								{
									coordinates: [-193.9375, 188.9375],
								},
								{
									coordinates: [-193.9375, 199.3125],
									text: 'Turns out the people looking for them were bandits. Who could have guessed? After a fierce battle, the party emerged victorious.',
									animation: {
										timer: 3,
										type: 'fight',
									},
									filter: ['fight'],
								},
								{
									coordinates: [-192.5, 196.625],
									filter: null,
								},
								{
									coordinates: [-191.5625, 172.6875],
								},
								{
									coordinates: [-190.6875, 155.625],
									text: 'Back at the crossroads, they decided to go onwards to what they hoped would be a settlement.',
								},
								{
									coordinates: [-186.375, 153.8125],
								},
								{
									coordinates: [-172.8125, 152.125],
								},
								{
									coordinates: [-157.125, 151.1875],
								},
								{
									coordinates: [-142.5, 154.375],
								},
								{
									coordinates: [-132.875, 165.4375],
								},
								{
									coordinates: [-126.5625, 181.5625],
								},
								{
									coordinates: [-126.375, 198.9375],
								},
								{
									coordinates: [-131.0625, 213.6875],
								},
								{
									coordinates: [-134.375, 224.9375],
								},
								{
									coordinates: [-136.1875, 234.875],
									text: 'They saw a city in the background and a few farms to their right. Exhausted, they decided to go to one of the farmers.',
									animation: {
										timer: 1,
										type: 'question',
									},
								},
								{
									coordinates: [-138.625, 247.75],
								},
								{
									coordinates: [-138.875, 262.1875],
								},
								{
									coordinates: [-138.8125, 276.25],
								},
								{
									coordinates: [-144.4375, 284.8125],
									text: "Reached Lobart farm and talked to its master. Learned the cost of entry into the city and were told to do deeds to gain money for it. Talked to the lead farmer's wife and got a task from her.",
									animation: {
										timer: 2,
										type: 'conversation',
									},
									filter: ['night-10'],
								},
								{
									coordinates: [-139.1875, 288.1875],
								},
								{
									coordinates: [-139.6875, 309.9375],
								},
								{
									coordinates: [-139.8125, 330.125],
									filter: ['night-30'],
								},
								{
									coordinates: [-133.75, 335.3125],
									text: "Down the road, we met a merchant which sold us entry to the city for a favour once inside. Also got a pan for the lead farmer's wife as part of her task.",
									animation: {
										timer: 2,
										type: 'conversation',
									},
									filter: ['night-50'],
								},
								{
									coordinates: [-138.9375, 337.9375],
									filter: ['night-70'],
								},
								{
									coordinates: [-137.875, 342.5],
									text: "We went back to the farmer's wife and gave her the pan. She gave us food to eat. After that, we talked to the lead farmer again and slept in the barn.",
									animation: {
										timer: 3,
										type: 'rest',
									},
									filter: ['night'],
								},
								{
									coordinates: [-137.6875, 347.75],
									filter: null,
								},
								{
									coordinates: [-140.25, 358.625],
								},
								{
									coordinates: [-143.25, 367.5625],
								},
								{
									coordinates: [-143.1875, 377.1875],
									text: 'Talked to the guards and showed them our entry pass. They allowed us into the city.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-142.5625, 393.1875],
								},
								{
									coordinates: [-142.875, 406.625],
									text: 'Talked to the master paladin guarding the door and learned of the city rules and some whereabouts of the locations we were interested in.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-146.875, 410.4375],
								},
								{
									coordinates: [-147.8125, 414.75],
								},
								{
									coordinates: [-145.5625, 417.5],
								},
								{
									coordinates: [-142.4375, 419.1875],
								},
								{
									coordinates: [-141.9375, 447.25],
								},
								{
									coordinates: [-141.625, 472.875],
								},
								{
									coordinates: [-141.3125, 489.0625],
								},
								{
									coordinates: [-146.0625, 489.6875],
								},
								{
									coordinates: [-146.25, 492.5],
								},
								{
									coordinates: [-147.4375, 494.625],
								},
								{
									coordinates: [-149.375, 496.8125],
									text: 'Walked into the inn and slept. During the night, some of the gold and some of our belongings were stolen.',
									animation: {
										timer: 5,
										type: 'rest',
									},
									filter: 'night',
								},
							],
						},
						{
							name: 'Session 3 Recap',
							lineColor: '#2898bd',
							points: [
								{
									coordinates: [-150.0625, 495.75],
									text: 'Woken up, the party decided to go into the woods and gather the plants that were requested by the alchemist.',
									animation: {
										timer: 2,
										type: 'walk',
									},
								},
								{
									coordinates: [-146.75, 493.5625],
								},
								{
									coordinates: [-146.375, 490.6875],
								},
								{
									coordinates: [-142.875, 489.625],
								},
								{
									coordinates: [-141.75, 503.875],
								},
								{
									coordinates: [-141.1875, 528.1875],
								},
								{
									coordinates: [-142.0625, 544.875],
									text: 'On the way out of the city, guards stopped them and asked them what they were doing. Upon learning they were headed into the forest, the guards wished them good luck.',
									animation: {
										timer: 1,
										type: 'conversation',
									},
								},
								{
									coordinates: [-145.125, 548.375],
								},
								{
									coordinates: [-150.5, 549.1875],
								},
								{
									coordinates: [-156.0625, 549.6875],
								},
								{
									coordinates: [-159.8125, 551.6875],
								},
								{
									coordinates: [-161.625, 555.5625],
									text: 'The party ventured into the forest down this path.',
									animation: {
										type: 'walk',
									},
								},
								{
									coordinates: [-165.375, 555.8125],
								},
								{
									coordinates: [-168.9375, 554.8125],
								},
								{
									coordinates: [-170.9375, 559.4375],
								},
								{
									coordinates: [-174, 558.875],
								},
								{
									coordinates: [-175, 557.5625],
								},
								{
									coordinates: [-176.625, 560],
								},
								{
									coordinates: [-178, 561.625],
								},
								{
									coordinates: [-181.5, 561.3125],
								},
								{
									coordinates: [-184.625, 558.5625],
								},
								{
									coordinates: [-188.5625, 555.875],
								},
								{
									coordinates: [-190.875, 555.3125],
								},
								{
									coordinates: [-194.75, 558.875],
								},
								{
									coordinates: [-196.3125, 562.25],
								},
								{
									coordinates: [-201.4375, 564.1875],
									text: 'They attacked a pack of wolves which were roaming around in the forest. The battle was fierce, but they were victorious. They managed to find hides, which would prove useful to gain apprenticeship.',
									animation: {
										timer: 3,
										type: 'fight',
									},
									filter: ['fight'],
								},
								{
									coordinates: [-204.6875, 564.75],
									filter: null,
								},
								{
									coordinates: [-209.375, 566.1875],
								},
								{
									coordinates: [-213.3125, 570.875],
								},
								{
									coordinates: [-217.1875, 577.625],
								},
								{
									coordinates: [-217.6875, 584.375],
									text: 'Entering the nearby caves, they saw what looked like blue blood - lizardmen blood, and a few creatures which looked way too powerful for them to handle.',
								},
								{
									coordinates: [-213.1875, 585.125],
								},
								{
									coordinates: [-206.6875, 583.625],
								},
								{
									coordinates: [-202.5, 584.5],
								},
								{
									coordinates: [-196.8125, 582.5],
								},
								{
									coordinates: [-195.75, 573],
								},
								{
									coordinates: [-195.375, 564.3125],
								},
								{
									coordinates: [-192.0625, 557.875],
								},
								{
									coordinates: [-188.75, 557.75],
								},
								{
									coordinates: [-185.1875, 559.8125],
								},
								{
									coordinates: [-183.0625, 562.9375],
								},
								{
									coordinates: [-176.4375, 563.125],
								},
								{
									coordinates: [-171.1875, 561.6875],
								},
								{
									coordinates: [-168.75, 558.3125],
								},
								{
									coordinates: [-164.0625, 557.125],
								},
								{
									coordinates: [-161.8125, 558.125],
								},
								{
									coordinates: [-160.5, 583.5],
								},
								{
									coordinates: [-160.375, 593.4375],
								},
								{
									coordinates: [-160.25, 599.75],
								},
								{
									coordinates: [-160.1875, 612.3125],
								},
								{
									coordinates: [-160.0625, 616.5],
								},
								{
									coordinates: [-164.0625, 617.8125],
								},
								{
									coordinates: [-166.5625, 620.1875],
									text: 'Near the bridge, they met Erol, who had been robbed by the bandits on the bridge nearby. He had a broken leg, which the party Cleric mended.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-160.25, 619.5],
								},
								{
									coordinates: [-160.375, 641.5625],
								},
								{
									coordinates: [-159.8125, 663.25],
								},
								{
									coordinates: [-158.1875, 666.8125],
								},
								{
									coordinates: [-154.75, 668.6875],
								},
								{
									coordinates: [-153.125, 673.875],
								},
								{
									coordinates: [-141.5625, 673.75],
								},
								{
									coordinates: [-127.75, 672.9375],
								},
								{
									coordinates: [-116.9375, 672.75],
								},
								{
									coordinates: [-105.4375, 671.75],
								},
								{
									coordinates: [-100.6875, 671.125],
								},
								{
									coordinates: [-99.1875, 666.75],
								},
								{
									coordinates: [-98.4375, 658.875],
								},
								{
									coordinates: [-99.8125, 655.0625],
								},
								{
									coordinates: [-100, 650.5625],
									text: 'They saw Isgaroth, a Fire Mage, who was doing a prayer. They waited for two hours for the prayer to finish and after that they received the Fire Mage blessing for free, as they had made the trip to the Monastery.',
									animation: {
										timer: 7,
										type: 'conversation',
									},
								},
								{
									coordinates: [-97.0625, 649.9375],
								},
								{
									coordinates: [-95.6875, 654.625],
								},
								{
									coordinates: [-96.5625, 665.25],
								},
								{
									coordinates: [-98.375, 668.25],
								},
								{
									coordinates: [-98.1875, 672.9375],
								},
								{
									coordinates: [-113.9375, 674.3125],
								},
								{
									coordinates: [-131.1875, 675.75],
								},
								{
									coordinates: [-148.375, 675.75],
								},
								{
									coordinates: [-153.6875, 676.4375],
								},
								{
									coordinates: [-158.125, 679.5],
								},
								{
									coordinates: [-163.25, 678.1875],
								},
								{
									coordinates: [-165.3125, 676.9375],
								},
								{
									coordinates: [-167.125, 677.875],
								},
								{
									coordinates: [-168.8125, 674.375],
								},
								{
									coordinates: [-173.8125, 674.9375],
									text: 'The party checked out the inn at the crossroads, looking for a place to spend the night in, but the prices were too steep for them, so they went back in town.',
									animation: {
										timer: 5,
										type: 'rest',
									},
									filter: 'night',
								},
							],
						},
						{
							name: 'Session 4 Recap',
							lineColor: '#ff7e55',
							points: [
								{
									coordinates: [-150.1875, 495.6875],
								},
								{
									coordinates: [-146.875, 494.375],
								},
								{
									coordinates: [-146.0625, 491],
								},
								{
									coordinates: [-143.75, 488.8125],
								},
								{
									coordinates: [-142.4375, 486.75],
								},
								{
									coordinates: [-141.6875, 477.5],
								},
								{
									coordinates: [-141.4375, 469.25],
									text: 'The party decided to venture outside, into the forest they saw when they first entered the city.',
									animation: {
										type: 'walk',
									},
								},
								{
									coordinates: [-141.375, 451.1875],
								},
								{
									coordinates: [-141.75, 426.4375],
								},
								{
									coordinates: [-141.125, 419],
								},
								{
									coordinates: [-138.3125, 417.125],
								},
								{
									coordinates: [-137.375, 412.5625],
								},
								{
									coordinates: [-139.5, 408.1875],
								},
								{
									coordinates: [-141.75, 405.0625],
								},
								{
									coordinates: [-141.3125, 383.8125],
								},
								{
									coordinates: [-141.4375, 371.25],
								},
								{
									coordinates: [-140.75, 364.5625],
								},
								{
									coordinates: [-139.25, 358.875],
								},
								{
									coordinates: [-135.6875, 359.0625],
								},
								{
									coordinates: [-130.875, 360.9375],
								},
								{
									coordinates: [-124.8125, 361.9375],
								},
								{
									coordinates: [-118.6875, 361.25],
								},
								{
									coordinates: [-113.125, 360.75],
									text: 'Seeing a pack of wolves and a goblin camp in the nearby forest, they took a more secluded path, going stealthily deeper in the forest.',
								},
								{
									coordinates: [-110.1875, 359.875],
								},
								{
									coordinates: [-105.625, 357.4375],
								},
								{
									coordinates: [-103.8125, 349.9375],
									text: 'In the distance stood a Lizardman. The party cleric decided to send a spell to them in order to make contact, hoping to come in peace and talk.',
									animation: {
										timer: 2,
										type: 'question',
									},
								},
								{
									coordinates: [-104.375, 339.0625],
								},
								{
									coordinates: [-103.625, 333.25],
								},
								{
									coordinates: [-101.8125, 326.625],
									text: "The plan didn't work out. The lizardman attacked, enraged, and a battle started. In the midst of the battle, the goblin horde attacked as well, killing the downed Lizarman. The party emerged victorious.",
									animation: {
										timer: 5,
										type: 'fight',
									},
									filter: ['fight'],
								},
								{
									coordinates: [-100.875, 322.5],
									filter: null,
								},
								{
									coordinates: [-98.5625, 318.5],
								},
								{
									coordinates: [-94.4375, 317.875],
								},
								{
									coordinates: [-92.75, 321],
								},
								{
									coordinates: [-92.375, 329.8125],
								},
								{
									coordinates: [-92.75, 339.4375],
								},
								{
									coordinates: [-93.3125, 347.6875],
								},
								{
									coordinates: [-93.8125, 353.6875],
								},
								{
									coordinates: [-93.75, 357.375],
									text: 'The party was ambushed by some bandits who looked like they were smuggling things into the city. Overwhelmed and outnumbered, they wisely chose to run away from this encounter.',
									animation: {
										timer: 3,
										type: 'fight',
									},
									filter: ['fight'],
								},
								{
									coordinates: [-91.9375, 351.625],
									filter: null,
								},
								{
									coordinates: [-90.9375, 340.4375],
								},
								{
									coordinates: [-90.4375, 335.625],
									animation: {
										type: 'walk',
									},
								},
								{
									coordinates: [-90.4375, 327],
								},
								{
									coordinates: [-91.4375, 319.5625],
								},
								{
									coordinates: [-93.875, 316.0625],
								},
								{
									coordinates: [-100.375, 317.4375],
								},
								{
									coordinates: [-105.3125, 316.4375],
								},
								{
									coordinates: [-109.125, 315.9375],
								},
								{
									coordinates: [-114.125, 315.5625],
									text: 'Hoping to avoid the wildlife they had seen, they took another path through the forest.',
								},
								{
									coordinates: [-117.4375, 317.4375],
								},
								{
									coordinates: [-120.75, 322.0625],
								},
								{
									coordinates: [-127.3125, 333.25],
								},
								{
									coordinates: [-131.9375, 334.9375],
								},
								{
									coordinates: [-138.4375, 337.25],
								},
								{
									coordinates: [-137.9375, 345.0625],
								},
								{
									coordinates: [-138.8125, 353.1875],
								},
								{
									coordinates: [-143.3125, 367.75],
								},
								{
									coordinates: [-143.3125, 377.125],
								},
								{
									coordinates: [-143.4375, 389.25],
								},
								{
									coordinates: [-143.6875, 400.3125],
								},
								{
									coordinates: [-143.3125, 408.25],
									text: 'Back into the city, they stopped and talked to the Paladin guard and informed them of the bandits they had seen and their location.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-146.875, 410.3125],
								},
								{
									coordinates: [-148.125, 415.125],
								},
								{
									coordinates: [-143.375, 420.1875],
								},
								{
									coordinates: [-143.4375, 432.0625],
								},
								{
									coordinates: [-143, 452.5625],
								},
								{
									coordinates: [-142.9375, 470.125],
								},
								{
									coordinates: [-143.4375, 481.5],
								},
								{
									coordinates: [-143.5625, 485.3125],
								},
								{
									coordinates: [-144.625, 488.25],
								},
								{
									coordinates: [-150.25, 491.375],
								},
								{
									coordinates: [-150.625, 494.375],
									text: 'Exhausted for the day, they rested at the inn once more.',
									animation: {
										timer: 5,
										type: 'rest',
									},
									filter: 'night',
								},
							],
						},
						{
							name: 'Session 7 Recap',
							lineColor: '#84d8e3',
							points: [
								{
									coordinates: [-166.625, 440.6875],
								},
								{
									coordinates: [-163.4375, 440],
								},
								{
									coordinates: [-155.75, 438.375],
								},
								{
									coordinates: [-147.8125, 437.4375],
									text: 'The adventurers decide to journey to the pyramids in search of the water mages party.',
									animation: {
										timer: 1,
										type: 'walk',
									},
								},
								{
									coordinates: [-141.875, 437.75],
								},
								{
									coordinates: [-142, 447.375],
								},
								{
									coordinates: [-141.9375, 474.1875],
								},
								{
									coordinates: [-142, 495.625],
								},
								{
									coordinates: [-141.625, 517.6875],
								},
								{
									coordinates: [-141.375, 539],
								},
								{
									coordinates: [-141.1875, 545.3125],
								},
								{
									coordinates: [-143.625, 548.6875],
								},
								{
									coordinates: [-149.25, 549.5625],
								},
								{
									coordinates: [-155.5, 549.8125],
								},
								{
									coordinates: [-159.375, 552.875],
								},
								{
									coordinates: [-161.3125, 559.6875],
								},
								{
									coordinates: [-161.5625, 568.875],
								},
								{
									coordinates: [-161.1875, 573],
								},
								{
									coordinates: [-158.5625, 572.5625],
								},
								{
									coordinates: [-155.5, 573.25],
								},
								{
									coordinates: [-147.4375, 572.3125],
								},
								{
									coordinates: [-146.125, 572.25],
								},
								{
									coordinates: [-147, 569.125],
								},
								{
									coordinates: [-146.6875, 568.0625],
								},
								{
									coordinates: [-146.0625, 566.9375],
								},
								{
									coordinates: [-145, 566.5625],
								},
								{
									coordinates: [-142.3125, 566.5625],
								},
								{
									coordinates: [-140.8125, 565.75],
								},
								{
									coordinates: [-140, 564.6875],
								},
								{
									coordinates: [-136.75, 567.0625],
								},
								{
									coordinates: [-133.0625, 567.5],
								},
								{
									coordinates: [-123.1875, 574.4375],
								},
								{
									coordinates: [-119.3125, 578.3125],
								},
								{
									coordinates: [-117.3125, 581.3125],
								},
								{
									coordinates: [-115.4375, 582.4375],
								},
								{
									coordinates: [-113.3125, 587.5],
								},
								{
									coordinates: [-110.5625, 591.25],
									text: 'While navigating the tough terrain, both the Ranger and Sorcerer fail an athletics check and get injured.',
									animation: {
										timer: 1,
										type: 'walk',
									},
								},
								{
									coordinates: [-106.5625, 593.5],
								},
								{
									coordinates: [-101.9375, 594.75],
								},
								{
									coordinates: [-97.125, 596.5625],
								},
								{
									coordinates: [-94.75, 597.3125],
								},
								{
									coordinates: [-93.3125, 599.875],
								},
								{
									coordinates: [-90.1875, 600.3125],
									text: 'The group spots an inactive golem to their right, which catches their interest.',
									animation: {
										timer: 1,
										type: 'question',
									},
								},
								{
									coordinates: [-86.25, 600.6875],
								},
								{
									coordinates: [-81.8125, 602.875],
								},
								{
									coordinates: [-79.875, 604.3125],
								},
								{
									coordinates: [-77.25, 604.3125],
									text: 'They pay 2 silver per person to cross the river over a shaky bridge guarded by a troll.',
									animation: {
										timer: 2,
										type: 'merchant',
									},
								},
								{
									coordinates: [-70.3125, 604],
								},
								{
									coordinates: [-64.875, 603],
								},
								{
									coordinates: [-62.3125, 602.1875],
								},
								{
									coordinates: [-58.1875, 602.0625],
								},
								{
									coordinates: [-55.1875, 602.125],
								},
								{
									coordinates: [-51.25, 601.625],
								},
								{
									coordinates: [-48.5625, 601.1875],
									text: 'To their right, they find ruins and two ancient chests, sparking their curiosity.',
									animation: {
										timer: 1,
										type: 'loot',
									},
								},
								{
									coordinates: [-45.3125, 601.375],
								},
								{
									coordinates: [-41.4375, 600.875],
									text: 'Straight ahead, they entered a group of tents and discovered the location of the water mages.',
									animation: {
										type: 'walk',
									},
								},
								{
									coordinates: [-39.75, 600.1875],
								},
								{
									coordinates: [-38.1875, 596.1875],
								},
								{
									coordinates: [-36.5, 592.5],
								},
								{
									coordinates: [-35.6875, 590.25],
								},
								{
									coordinates: [-36.125, 587.75],
								},
								{
									coordinates: [-38.625, 586.75],
								},
								{
									coordinates: [-41.25, 586.4375],
								},
								{
									coordinates: [-43.5, 585.25],
								},
								{
									coordinates: [-44.5625, 582.4375],
								},
								{
									coordinates: [-44.0625, 580.125],
								},
								{
									coordinates: [-41.5625, 580.125],
									text: 'The group entered the pyramids. In the first chamber they saw a huge door to their left, which was locked. Straight ahead through a corridor they fought a fierce battle against lich-like creatures and undead. They were victorious in the end with the help of the water mages party. Learning more about the strange devices of the land, they decided to help the mages with what looked like a teleporter. Once they stepped on it, they were teleported to a different location, but they managed to work out the system behind the teleporters: one would take you to a cave in the mountains, close to the city, and the other to another small cave near the inn.',
									animation: {
										timer: 5,
										type: 'fight',
									},
									filter: ['fight'],
								},
								{
									coordinates: [-111.21875, 558.65625],
									pointWidth: 1,
									pointColor: 'yellow',
									filter: null,
								},
								{
									coordinates: [-199.53125, 655.65625],
									pointWidth: 1,
									pointColor: 'yellow',
								},
								{
									coordinates: [-41.5625, 580.6875],
									pointWidth: 1,
									pointColor: 'yellow',
								},
								{
									coordinates: [-41.5625, 580.125],
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
									coordinates: [-111.625, 558.9375],
									text: 'This is where the previous session ended.',
								},
								{
									coordinates: [-115.9375, 560.125],
								},
								{
									coordinates: [-118.375, 559.3125],
								},
								{
									coordinates: [-120.4375, 553.375],
								},
								{
									coordinates: [-122.1875, 551.9375],
								},
								{
									coordinates: [-126, 552.1875],
								},
								{
									coordinates: [-131.25, 549.875],
								},
								{
									coordinates: [-140.0625, 545.25],
								},
								{
									coordinates: [-145.125, 548.8125],
								},
								{
									coordinates: [-152, 549.25],
								},
								{
									coordinates: [-159.1875, 552.3125],
								},
								{
									coordinates: [-161.25, 561.125],
								},
								{
									coordinates: [-161.125, 573.75],
								},
								{
									coordinates: [-160.0625, 586.25],
								},
								{
									coordinates: [-160.125, 601.0625],
								},
								{
									coordinates: [-159.625, 617.25],
								},
								{
									coordinates: [-160.1875, 638.875],
								},
								{
									coordinates: [-160.1875, 655.25],
								},
								{
									coordinates: [-162.9375, 667.8125],
								},
								{
									coordinates: [-167.0625, 674.5625],
								},
								{
									coordinates: [-170.5625, 675.375],
									text: 'Went into the inn and talked with the bartender, who was a follower of the water mages. Learned about the mercenaries and got a key to unlock the teleporter B lock.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-167.875, 676.25],
								},
								{
									coordinates: [-166.75, 677.625],
								},
								{
									coordinates: [-164.0625, 677.375],
								},
								{
									coordinates: [-161, 679.375],
								},
								{
									coordinates: [-160.9375, 694.5],
								},
								{
									coordinates: [-161.125, 721.5625],
								},
								{
									coordinates: [-161.0625, 743],
								},
								{
									coordinates: [-161.375, 769.75],
								},
								{
									coordinates: [-161.25, 794.9375],
								},
								{
									coordinates: [-162.8125, 796.4375],
								},
								{
									coordinates: [-166.25, 796.125],
								},
								{
									coordinates: [-173.1875, 796.125],
								},
								{
									coordinates: [-179.75, 796.375],
								},
								{
									coordinates: [-181.75, 798.5],
								},
								{
									coordinates: [-180.5, 802.3125],
									text: "Went to Erol's house and met with him. Learned about the guards and Silvestro's quota.",
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-179.75, 799.1875],
								},
								{
									coordinates: [-169.375, 797.125],
								},
								{
									coordinates: [-164.375, 797.25],
								},
								{
									coordinates: [-161.5, 798.5625],
								},
								{
									coordinates: [-161.4375, 805.3125],
								},
								{
									coordinates: [-161.5, 827.4375],
								},
								{
									coordinates: [-161.9375, 846],
								},
								{
									coordinates: [-161.75, 862.25],
								},
								{
									coordinates: [-161.8125, 872.3125],
									text: 'Saw a meadow with a lot of cows and sheep on the right, and huge farmlands to the left.',
								},
								{
									coordinates: [-161.5625, 882.375],
								},
								{
									coordinates: [-161.6875, 897.5625],
								},
								{
									coordinates: [-159.5625, 899.8125],
									text: 'Decided to make a left turn here towards the farm.',
								},
								{
									coordinates: [-150.6875, 899.3125],
								},
								{
									coordinates: [-136.625, 898.25],
								},
								{
									coordinates: [-125.9375, 897.9375],
								},
								{
									coordinates: [-110.3125, 897.375],
								},
								{
									coordinates: [-98.3125, 897.75],
								},
								{
									coordinates: [-92.625, 898.1875],
								},
								{
									coordinates: [-89.9375, 897.25],
									text: 'Met up with Silvestro, learned about the farm and paid the 20 gold per person tax.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-86.625, 895.875],
								},
								{
									coordinates: [-84.25, 893.625],
									text: 'Met up with the two merchants - Quixie and Jabba the Hutt. Bought 1 haste potion and two items for approximately 1000g.',
									animation: {
										timer: 2,
										type: 'merchant',
									},
								},
								{
									coordinates: [-85.3125, 891.25],
								},
								{
									coordinates: [-85, 882.375],
									text: 'Saw that the inn to the left was holding a competition for whoever could eat the most chocolate. Nobody could resist such temptation.',
								},
								{
									coordinates: [-80.9375, 879.375],
								},
								{
									coordinates: [-79.25, 877.5625],
								},
								{
									coordinates: [-79.125, 872.75],
								},
								{
									coordinates: [-79.5625, 868.75],
								},
								{
									coordinates: [-78.125, 864.9375],
									text: 'Entered the contest - the Cleric and the Barbarian won, and ate a stew which increased their max HP by 5. The others puked.',
									animation: {
										timer: 2,
										type: 'loot',
									},
								},
								{
									coordinates: [-76.875, 871.125],
								},
								{
									coordinates: [-76.125, 876.375],
								},
								{
									coordinates: [-77.3125, 879.5625],
								},
								{
									coordinates: [-77.6875, 887.375],
								},
								{
									coordinates: [-75.1875, 888.9375],
								},
								{
									coordinates: [-71.375, 889.3125],
								},
								{
									coordinates: [-68.25, 888.375],
									text: "Met up with General Lee and learned that they wanted to leave the island and were planning to take over the city. While trying to help, the party might've accidentally killed Captain Cunts by revealing his location to the pirate queen Bianca. Lee told the party, under the condition that they help Lee's lieutenants too, that the valley of mines was currently under siege by the Lizardmen, and that the only 'safe' entrance was through another path his spies had been using for a while.",
									animation: {
										timer: 3,
										type: 'conversation',
									},
								},
								{
									coordinates: [-69, 893.3125],
									text: 'Met up with another follower of the Water Mages guild who was training the mercenary recruits. Trained with him and gained expertise with chosen weapons.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-74.8125, 893],
								},
								{
									coordinates: [-73.75, 902.9375],
								},
								{
									coordinates: [-67.3125, 906.875],
								},
								{
									coordinates: [-62.6875, 908.5],
								},
								{
									coordinates: [-61.9375, 910.9375],
									text: 'Went to the Blacksmith to learn about their trade.',
									animation: {
										timer: 1,
										type: 'null',
									},
								},
								{
									coordinates: [-64.25, 911.6875],
								},
								{
									coordinates: [-68.0625, 908.125],
								},
								{
									coordinates: [-78.375, 902.5625],
								},
								{
									coordinates: [-89.125, 898.875],
								},
								{
									coordinates: [-94.4375, 896.5625],
								},
								{
									coordinates: [-112.5625, 895.125],
								},
								{
									coordinates: [-126.125, 896.3125],
								},
								{
									coordinates: [-150.25, 896.75],
								},
								{
									coordinates: [-158.9375, 897.375],
								},
								{
									coordinates: [-159.0625, 870.1875],
								},
								{
									coordinates: [-158.875, 833],
								},
								{
									coordinates: [-158.875, 812.0625],
									text: 'Noticed there was another set of guards compared to the first time.',
								},
								{
									coordinates: [-158.5625, 790.1875],
								},
								{
									coordinates: [-158.3125, 748],
								},
								{
									coordinates: [-158.6875, 711.625],
								},
								{
									coordinates: [-158.5625, 692.6875],
									text: 'Made a left turn here towards the Penal Colony. What could go wrong?',
									animation: {
										timer: 1,
										type: 'question',
									},
								},
								{
									coordinates: [-164.3125, 693.4375],
								},
								{
									coordinates: [-176.0625, 696.25],
								},
								{
									coordinates: [-188.25, 699.3125],
								},
								{
									coordinates: [-205, 700.125],
								},
								{
									coordinates: [-217, 700.4375],
								},
								{
									coordinates: [-222, 700.5625],
									text: 'In front of them, they saw the road and two paladins standing guard. To their right, a ruined tower; to their left, farmland.',
								},
								{
									coordinates: [-226.4375, 700.875],
								},
								{
									coordinates: [-233.125, 695.3125],
								},
								{
									coordinates: [-238.5, 685.75],
									text: 'Their passive perception not enough, the party was ambushed by a party of 3 orc mages - each master of a different element: fire, ice and lightning. After a fierce battle, they emerged victorious.',
									animation: {
										timer: 5,
										type: 'fight',
									},
									filter: ['fight'],
								},
							],
						},
						{
							name: 'Session 9 Recap',
							lineColor: 'rgb(188 64 255)',
							points: [
								{
									coordinates: [-242.625, 686.375],
									text: 'This is where the last session ended.',
									filter: ['night-10'],
								},
								{
									coordinates: [-250.375, 691.625],
									filter: ['night-20'],
								},
								{
									coordinates: [-254.375, 698.625],
									text: 'The adventurers talked to 2 mercenaries and found out that 2 more mages were in the area, and a farmer had been killed by one of them.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
									filter: ['night-30'],
								},
								{
									coordinates: [-226, 698.375],
									filter: ['night-40'],
								},
								{
									coordinates: [-201.875, 698.875],
									filter: ['night-50'],
								},
								{
									coordinates: [-185.75, 697.5],
									filter: ['night-60'],
								},
								{
									coordinates: [-173, 695.25],
									filter: ['night-70'],
								},
								{
									coordinates: [-162.75, 692.375],
									filter: ['night-80'],
								},
								{
									coordinates: [-160.375, 684.625],
									filter: ['night-90'],
								},
								{
									coordinates: [-162.25, 678.75],
									filter: ['night-95'],
								},
								{
									coordinates: [-173.125, 678.875],
									text: 'The party went back to the inn to rest, learning from General Lee that they had also been attacked.',
									animation: {
										type: 'rest',
										timer: 5,
									},
									filter: ['night'],
									lights: {
										intensity: 0.5,
										coordinates: [
											[-166.59375, 679.25],
											[-151, 678.125],
											[-163.9375, 799],
											[-182.3125, 799.5625],
											[-156.125, 832.5625],
											[-156.25, 872.1875],
											[-164.25, 882.375],
											[-200.25, 869.6875],
											[-128.4375, 899.75],
											[-125.0625, 875.5],
											[-86.5625, 884.5625],
											[-71.8125, 887.875],
											[-61.5, 909.125],
											[-84, 819.5],
											[-290.75, 788.5625],
											[-294.3125, 704.6875],
											[-89.1875, 814.6875],
											[-73.625, 819.3125],
											[-95.5, 867.03125],
											[-77.90625, 866.0625],
											[-86.53125, 855.1875],
											[-356.6875, 700.5625],
											[-428.21875, 679.21875],
											[-416.21875, 532.15625],
											[-479.96875, 535.09375],
											[-481.75, 547.8125],
											[-478.9375, 580.6875],
											[-503.125, 585.4375],
											[-510.875, 565.25],
											[-484.25, 517.375],
										],
										radius: 60,
										type: 'warm',
									},
								},
								{
									coordinates: [-174.875, 673.125],
								},
								{
									coordinates: [-166.25, 672.5],
								},
								{
									coordinates: [-164.75, 675.5],
								},
								{
									coordinates: [-157.125, 679],
								},
								{
									coordinates: [-158, 688.75],
									text: 'The adventurers decided to speak to General Lee directly.',
								},
								{
									coordinates: [-158.125, 703.375],
								},
								{
									coordinates: [-158.5, 724.625],
									text: "Entering Oviedo's farm domain, they saw a large figure and encountered Silvestro and another individual.",
								},
								{
									coordinates: [-158.75, 801.75],
									text: 'They confronted Silvestro and the other guy, who denied being werewolves and claimed they used potions to enlarge themselves.',
									animation: {
										timer: 3,
										type: 'conversation',
									},
								},
								{
									coordinates: [-158.5, 854.375],
								},
								{
									coordinates: [-158, 896.5],
								},
								{
									coordinates: [-123.375, 896.625],
								},
								{
									coordinates: [-92.25, 896.375],
								},
								{
									coordinates: [-85.75, 892],
								},
								{
									coordinates: [-84.5, 883.625],
								},
								{
									coordinates: [-77.625, 888.125],
								},
								{
									coordinates: [-71.125, 889.25],
									text: "Having reached and woken up Lee, the group informed Lee about Bianca's treachery and the pyramid's location.",
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-77, 900.875],
								},
								{
									coordinates: [-93.625, 898.75],
								},
								{
									coordinates: [-161.25, 899.375],
								},
								{
									coordinates: [-161, 787.75],
								},
								{
									coordinates: [-160.75, 695.75],
									text: 'They headed towards the Penal Colony.',
									animation: {
										type: 'walk',
									},
								},
								{
									coordinates: [-168.25, 695.625],
								},
								{
									coordinates: [-187.625, 700.75],
								},
								{
									coordinates: [-241.625, 701.375],
									filter: ['night-90'],
								},
								{
									coordinates: [-293.125, 701.875],
								},
								{
									coordinates: [-315, 703.625],
								},
								{
									coordinates: [-348, 703.75],
								},
								{
									coordinates: [-359.25, 699.0625],
									text: 'Upon reaching 2 Paladins guarding the entrance, they received 2 keys and passage into the Penal Colony.',
									animation: {
										timer: 2,
										type: 'conversation',
									},
								},
								{
									coordinates: [-364.25, 702.625],
									filter: ['night-70'],
								},
								{
									coordinates: [-369.875, 703],
								},
								{
									coordinates: [-376.625, 704.0625],
								},
								{
									coordinates: [-381.5625, 705.1875],
									overlays: ['Penal Colony Spider Cave'],
								},

								{
									coordinates: [-385.34375, 708.34375],
									text: 'The adventurers entered the shortcut as Lee had advised.',
									animation: {
										type: 'null',
									},
								},
								{
									coordinates: [-385.125, 714.84375],
								},
								{
									coordinates: [-386.4375, 716.5625],
									text: 'However, in the middle of the cave, they were ambushed by spiders and barely escaped.',
									animation: {
										timer: 3,
										type: 'fight',
									},
									filter: ['night-70', 'fight'],
								},
								{
									coordinates: [-388.1875, 716],
								},
								{
									coordinates: [-389.78125, 714.625],
								},
								{
									coordinates: [-393.28125, 714.71875],
									filter: ['night-70'],
									overlays: [],
								},
								{
									coordinates: [-395.78125, 714.46875],
								},
								{
									coordinates: [-394.40625, 699.40625],
								},
								{
									coordinates: [-392.90625, 691.84375],
									text: 'In front of them there were abandoned mines, which they figured were the way Lee had suggested to go.',
									filter: ['night-70'],
									overlays: ['Penal Colony Mine Cave'],
								},
								{
									coordinates: [-391.90625, 687.6875],
								},
								{
									coordinates: [-390.875, 680.53125],
								},
								{
									coordinates: [-391.53125, 676.34375],
								},
								{
									coordinates: [-393.625, 672.84375],
									animation: {
										timer: 2,
										type: 'question',
									},
								},
								{
									coordinates: [-393.4375, 668.96875],
								},
								{
									coordinates: [-392.25, 666.6875],
								},
								{
									coordinates: [-389.09375, 666.625],
								},
								{
									coordinates: [-386.4375, 664.1875],
								},
								{
									coordinates: [-386.0625, 658.78125],
								},
								{
									coordinates: [-387.25, 649.5],
								},
								{
									coordinates: [-383.28125, 647.78125],
								},
								{
									coordinates: [-381.125, 645.8125],
								},
								{
									coordinates: [-380.75, 639.84375],
								},
								{
									coordinates: [-382.625, 635.8125],
								},
								{
									coordinates: [-387.1875, 636.84375],
								},
								{
									coordinates: [-391.4375, 639.15625],
								},
								{
									coordinates: [-394.03125, 637.3125],
								},
								{
									coordinates: [-393.875, 631.0625],
								},
								{
									coordinates: [-394.34375, 624.5],
								},
								{
									coordinates: [-397.875, 622.875],
								},
								{
									coordinates: [-401.78125, 622.25],
								},
								{
									coordinates: [-403.21875, 623.875],
								},
								{
									coordinates: [-404.125, 628.0625],
								},
								{
									coordinates: [-402.875, 630.5],
								},
								{
									coordinates: [-401.03125, 631.3125],
								},
								{
									coordinates: [-402, 633.78125],
								},
								{
									coordinates: [-403.59375, 634.75],
								},
								{
									coordinates: [-407.5625, 634.59375],
								},
								{
									coordinates: [-407.34375, 640.09375],
								},
								{
									coordinates: [-406.84375, 642.15625],
								},
								{
									coordinates: [-403.84375, 642.6875],
								},
								{
									coordinates: [-403.46875, 647.6875],
								},
								{
									coordinates: [-404.65625, 650.15625],
								},
								{
									coordinates: [-407.53125, 648.875],
								},
								{
									coordinates: [-410.03125, 646.59375],
								},
								{
									coordinates: [-414.1875, 646.21875],
								},
								{
									coordinates: [-418.84375, 646.25],
									text: 'Approaching the mine exit, they found themselves on a ledge, from which they could see the Paladin citadel in the distance. Deciding the best course of action, they tied roped to the cave wall and climbed down from the ledge safely.',
									animation: {
										timer: 2,
										type: 'walk',
									},
									lights: null,
								},
								{
									coordinates: [-421.9375, 646.28125],
								},
								{
									coordinates: [-429, 648.46875],
								},
								{
									coordinates: [-428.65625, 643.5625],
								},
								{
									coordinates: [-423.34375, 635.6875],
								},
								{
									coordinates: [-423.15625, 629.0625],
								},
								{
									coordinates: [-430.5, 619.21875],
								},
								{
									coordinates: [-437.625, 612.8125],
								},
								{
									coordinates: [-444.9375, 608.125],
								},
								{
									coordinates: [-442.96875, 603.71875],
								},
								{
									coordinates: [-436.75, 597.375],
								},
								{
									coordinates: [-431.375, 596.71875],
									overlays: ['Penal Colony Merchants Cave'],
								},
								{
									coordinates: [-424.4375, 590.15625],
									text: 'Climbing up a ladder, they met two merchants — a penguin and a drugged rabbit - they purchased some items, and took a long rest to replenish their stamina and health.',
									animation: {
										timer: 5,
										type: 'merchant',
									},
									loot: [
										{
											name: 'Boots of Speed',
											description: 'Click heels and receive +20ft movement speed for 1 minute.',
											rarity: 'uncommon',
											type: 'item',
										},
										{
											name: 'Ring of Haste',
											description:
												'Cast haste on a weapon granting an extra attack with that weapon - 5 uses per long rest.',
											rarity: 'uncommon',
											type: 'item',
										},
										{
											name: 'Amulet of Slow',
											description: 'Cast slow on a target, it has to save 14DC - 6 uses per long rest.',
											rarity: 'uncommon',
											type: 'item',
										},
									],
									filter: ['night-50'],
								},
								{
									coordinates: [-431.46875, 594.75],
								},
								{
									coordinates: [-437.375, 596],
								},
								{
									coordinates: [-444.71875, 603.40625],
								},
								{
									coordinates: [-453.65625, 597.5],
									overlays: [],
								},
								{
									coordinates: [-445.96875, 583.9375],
									text: 'The adventurers were ambushed by dinosaurs and nearly wiped out.',
									animation: {
										timer: 4,
										type: 'fight',
									},
									level: 7,
								},
								{
									coordinates: [-442.875, 579.53125],
								},
								{
									coordinates: [-438.875, 576.90625],
									text: 'Just as the battle was ending, Diego appeared, clearly a werewolf. After talking with the adventurers, he decided to take them to his hideout.',
									animation: {
										type: 'walk',
									},
									filter: ['night-20'],
								},
								{
									coordinates: [-436.15625, 562.75],
								},
								{
									coordinates: [-429.375, 554.40625],
								},
								{
									coordinates: [-425.96875, 546.09375],
								},
								{
									coordinates: [-420.28125, 543.34375],
								},
								{
									coordinates: [-420.3125, 537.6875],
								},
								{
									coordinates: [-417.5625, 531.875],
								},
								{
									coordinates: [-415.65625, 531.46875],
									text: "They reached Diego's hideout, concluding the session.",
									animation: {
										timer: 5,
									},
								},
							],
						},
					],
					areas: {
						korinis_city: {
							name: 'Korinis city',
							items: [
								{
									name: 'Harbour Area',
									textRotation: '346deg',
									textSize: 14,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(220 223 228 / 50%)',
									points: [
										{
											coordinates: [-87.25, 372],
										},
										{
											coordinates: [-76, 374],
										},
										{
											coordinates: [-44.25, 499.75],
										},
										{
											coordinates: [-51.5, 511.25],
										},
										{
											coordinates: [-67.5, 480],
										},
										{
											coordinates: [-78.75, 432.5],
										},
										{
											coordinates: [-84.25, 413.25],
										},
										{
											coordinates: [-85.25, 387.5],
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
											coordinates: [-87.25, 373.5],
										},
										{
											coordinates: [-84.75, 386.25],
										},
										{
											coordinates: [-84.5, 407.75],
										},
										{
											coordinates: [-81.25, 425],
										},
										{
											coordinates: [-75.25, 436],
										},
										{
											coordinates: [-72.5, 460.25],
										},
										{
											coordinates: [-65.25, 474.5],
										},
										{
											coordinates: [-66.25, 483.75],
										},
										{
											coordinates: [-51, 509.25],
										},
										{
											coordinates: [-56.5, 516.25],
										},
										{
											coordinates: [-91, 517.25],
										},
										{
											coordinates: [-107.5, 531.25],
										},
										{
											coordinates: [-117.5, 519.75],
										},
										{
											coordinates: [-117.25, 380],
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
											coordinates: [-118, 379.25],
										},
										{
											coordinates: [-117, 518.75],
										},
										{
											coordinates: [-107, 530.5],
										},
										{
											coordinates: [-119.75, 541.5],
										},
										{
											coordinates: [-149.25, 541],
										},
										{
											coordinates: [-149.75, 528],
										},
										{
											coordinates: [-174, 484.25],
										},
										{
											coordinates: [-174, 370.25],
										},
										{
											coordinates: [-149.25, 379],
										},
										{
											coordinates: [-145.75, 380.25],
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
											coordinates: [-173.75, 371],
										},
										{
											coordinates: [-173.75, 485.25],
										},
										{
											coordinates: [-149.75, 529],
										},
										{
											coordinates: [-148, 541.5],
										},
										{
											coordinates: [-169, 535],
										},
										{
											coordinates: [-228.25, 505.5],
										},
										{
											coordinates: [-229.75, 379.25],
										},
										{
											coordinates: [-198.5, 370.75],
										},
									],
								},
							],
						},
						farms: {
							name: 'Farms',
							items: [
								{
									name: 'Secob Farm',
									textRotation: '0deg',
									textSize: 16,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(226 178 3 / 40%)',
									points: [
										{
											coordinates: [-141.75, 550.0625],
										},
										{
											coordinates: [-136.5, 556.6875],
										},
										{
											coordinates: [-135.4375, 563.5625],
										},
										{
											coordinates: [-136.375, 567.6875],
										},
										{
											coordinates: [-135.1875, 576.4375],
										},
										{
											coordinates: [-139, 585.75],
										},
										{
											coordinates: [-144.8125, 590.6875],
										},
										{
											coordinates: [-155.1875, 597.3125],
										},
										{
											coordinates: [-156.1875, 591.5625],
										},
										{
											coordinates: [-157.75, 579.625],
										},
										{
											coordinates: [-158, 569.6875],
										},
										{
											coordinates: [-155.125, 555.1875],
										},
										{
											coordinates: [-147.875, 553.375],
										},
										{
											coordinates: [-143.375, 553.5],
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
											coordinates: [-145.5, 251.25],
										},
										{
											coordinates: [-141.5, 259.5],
										},
										{
											coordinates: [-145.375, 283.15625],
										},
										{
											coordinates: [-143, 304],
										},
										{
											coordinates: [-143.75, 328],
										},
										{
											coordinates: [-141.5, 352],
										},
										{
											coordinates: [-161.75, 353],
										},
										{
											coordinates: [-171.25, 341.5],
										},
										{
											coordinates: [-174.75, 327],
										},
										{
											coordinates: [-181.75, 317.75],
										},
										{
											coordinates: [-185.75, 292.5],
										},
										{
											coordinates: [-184, 276.75],
										},
										{
											coordinates: [-172.5, 276.5],
										},
										{
											coordinates: [-170.75, 255.75],
										},
										{
											coordinates: [-166.75, 249],
										},
										{
											coordinates: [-157.5, 249],
										},
									],
								},
								{
									name: "Oviedo's Farm",
									textRotation: '0deg',
									textSize: 16,
									textFontType: 'title',
									lineColor: null,
									interiorColor: 'rgb(226 178 3 / 40%)',
									points: [
										{
											coordinates: [-152.5, 795.375],
										},
										{
											coordinates: [-128.25, 796.125],
										},
										{
											coordinates: [-122.5, 786],
										},
										{
											coordinates: [-105.875, 794.875],
										},
										{
											coordinates: [-97.5, 806.625],
										},
										{
											coordinates: [-90.625, 807.5],
										},
										{
											coordinates: [-77.625, 814.875],
										},
										{
											coordinates: [-75.625, 812.25],
										},
										{
											coordinates: [-58.5, 815.5],
										},
										{
											coordinates: [-54.75, 835.375],
										},
										{
											coordinates: [-59, 856.375],
										},
										{
											coordinates: [-56.5, 872.875],
										},
										{
											coordinates: [-69.125, 871.625],
										},
										{
											coordinates: [-73.75, 854.875],
										},
										{
											coordinates: [-87, 852.5],
										},
										{
											coordinates: [-96.625, 858.125],
										},
										{
											coordinates: [-105.375, 862.25],
										},
										{
											coordinates: [-110.75, 862.75],
										},
										{
											coordinates: [-121.875, 871.625],
										},
										{
											coordinates: [-123, 875.375],
										},
										{
											coordinates: [-115.5, 876.25],
										},
										{
											coordinates: [-105.625, 873],
										},
										{
											coordinates: [-99.875, 874.375],
										},
										{
											coordinates: [-86.375, 883.25],
										},
										{
											coordinates: [-85.875, 891],
										},
										{
											coordinates: [-89.375, 894.875],
										},
										{
											coordinates: [-155.5, 895.625],
										},
									],
								},
							],
						},
					},
					overlays: [
						{
							name: 'Penal Colony Mine Cave',
							bounds: [
								[-356, 602],
								[-418, 687],
							],
							rotate: 2,
							image: 'images/overlays/korinis_island/korinis_island_penal_colony_mine_cave.png',
						},
						{
							name: 'Penal Colony Spider Cave',
							bounds: [
								[-381.5, 709.5],
								[-392, 720],
							],
							image: 'images/overlays/korinis_island/korinis_island_penal_colony_spider_cave.png',
						},
						{
							name: 'Penal Colony Merchants Cave',
							bounds: [
								[-411, 580],
								[-433, 604],
							],
							image: 'images/overlays/korinis_island/korinis_island_penal_colony_merchants_cave.png',
						},
					],
					submaps: {
						interiors: {
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
												label: 'Teleporter to A (Pyramid)',
												type: 'place',
												icon: 'iconPortal',
												animationType: 'spin',
												iconType: 'png',
												mapLink: 'korinis_pyramid',
												map: {
													exitCoordinates: [-370, 610],
													exitZoom: 2,
												},
											},
										],
									},
									navigation_arrows: {
										name: 'Navigation arrows',
										items: [
											{
												lat: -38.625,
												lng: 63.125,
												label: 'To Korinis Island',
												type: 'place',
												icon: 'arrowDirectionUp',
												iconType: 'png',
												mapLink: 'korinis_island',
												map: {
													exitCoordinates: [-195, 656],
													exitZoom: 4,
												},
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
								annotations: {
									navigation: {
										name: 'Navigation arrows',
										items: [
											{
												lat: -579.5,
												lng: 882,
												label: 'To Korinis Island',
												type: 'people',
												icon: 'arrowDirectionDown',
												iconType: 'png',
												mapLink: 'korinis_island',
												map: {
													exitCoordinates: [-43, 580],
													exitZoom: 4,
												},
											},
										],
									},
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
												mapLink: 'korinis_island',
												map: {
													exitCoordinates: [-99, 318],
													exitZoom: 4,
												},
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
							korinis_island_spider_cave: {
								metadata: {
									path: 'maps/encounters/korinis_island/spider_cave_encounter',
									sizes: {
										maxZoom: 3,
										imageWidth: 4095,
										imageHeight: 6144,
									},
									backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
								},
								annotations: {
									navigation: {
										name: 'Navigation arrows',
										items: [
											{
												lat: -764,
												lng: 262.5,
												label: 'To Penal Colony',
												type: 'people',
												icon: 'arrowDirectionDown',
												iconType: 'png',
												mapLink: 'korinis_island',
												map: {
													exitCoordinates: [-395, 710],
													exitZoom: 4,
												},
											},
											{
												lat: -10.5,
												lng: 419.5,
												label: 'To Shortcut Terrace',
												type: 'people',
												icon: 'arrowDirectionUp',
												iconType: 'png',
												mapLink: 'korinis_island',
												map: {
													exitCoordinates: [-395, 710],
													exitZoom: 4,
												},
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
									lat: -329.375,
									lng: 203.125,
									label: 'Landing zone',
									type: 'place',
									icon: 'cityCapital',
									iconType: 'png',
								},
								{
									lat: -367,
									lng: 16,
									label: 'Back to world map',
									type: 'text',
									fontSize: 15,
									mapLink: 'world_maps',
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
									animation: {
										timer: 2,
										type: 'fight',
									},
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
									animation: {
										timer: 5,
										type: 'fight',
									},
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
									animation: {
										timer: 2,
										type: 'loot',
									},
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
					annotations: {
						points_of_interest: {
							name: 'Points of Interest',
							items: [
								{
									lat: -364,
									lng: 36,
									label: 'Back to world map',
									type: 'text',
									fontSize: 15,
									mapLink: 'world_maps',
								},
							],
						},
					},
				},
			},
		},
	},
};
