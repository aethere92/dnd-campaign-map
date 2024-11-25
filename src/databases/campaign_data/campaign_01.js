const CAMPAIGN_01_ALIASES = {
	world_map: 'world_maps',

	// UNNAMED ISLAND
	unnamed_island_01: 'world_maps.submaps.islands.unnamed_island_01',
	finneas_encounter: 'world_maps.submaps.islands.unnamed_island_01.submaps.encounters.finneas_encounter',

	//BONE WRAITHS
	bone_wraiths_01: 'world_maps.submaps.combat_encounters.bone_wraiths_encounter_01',

	// KORINIS
	korinis_island: 'world_maps.submaps.islands.korinis_island',

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
							maxZoom: 6,
							imageWidth: 32069,
							imageHeight: 12624,
						},
						backgroundColor: `linear-gradient(rgba(26, 20, 18, 0.97), rgba(26, 20, 18, 0.97)),url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23241c1a' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
					},
					annotations: {
						npcs: {
							name: 'NPCs',
							items: [
								{
									lat: -64.03125,
									lng: 255.953125,
									label: 'Darren (Fire mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
									image: 'f965a770-b841-462c-8325-8dd483cca8a1.jpg',
								},
								{
									lat: -82.6875,
									lng: 220.578125,
									label: 'Valros (Water mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
									image: 'bcaa3de1-7d67-4909-92b0-dea60f63bf71.jpg',
								},
								{
									lat: -83.078125,
									lng: 310.515625,
									label: 'Erol (tablets)',
									type: 'place',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -49.25,
									lng: 325.8125,
									label: 'Isgaroth (Fire mage)',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -81.234375,
									lng: 212.71875,
									label: 'Thorben (Carpenter)',
									type: 'people',
									icon: 'tradeHunter',
									iconType: 'png',
								},
								{
									lat: -77.546875,
									lng: 214.171875,
									label: 'Constantine (Alchemist)',
									type: 'people',
									icon: 'tradeAlchemy',
									iconType: 'png',
								},
								{
									lat: -62.25,
									lng: 226.5,
									label: 'Thorek (Blacksmith)',
									type: 'people',
									icon: 'tradeForge',
									iconType: 'png',
									mapLink: 'korinis_city_blacksmith',
								},
								{
									lat: -48.96875,
									lng: 157.828125,
									label: 'Lizardman',
									type: 'people',
									icon: 'cityLizard',
									iconType: 'png',
								},
								{
									lat: -37.875,
									lng: 302.03125,
									label: 'Bridge Troll',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -29.0625,
									lng: 456.1875,
									label: 'Farm Blacksmith',
									type: 'people',
									icon: 'tradeForge',
									iconType: 'png',
								},
								{
									lat: -31.828125,
									lng: 444.78125,
									label: 'General Lee',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -41.453125,
									lng: 446.59375,
									label: 'Quixie & The Other Merchant',
									type: 'people',
									icon: 'tradeCampLarge',
									iconType: 'png',
								},
								{
									lat: -44.203125,
									lng: 448.65625,
									label: 'Silvestro',
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -79.875,
									lng: 401.875,
									label: 'Mercenary Guards',
									type: 'people',
									icon: 'fort',
									iconType: 'png',
								},
							],
						},
						points_of_interest: {
							name: 'Points of interest',
							items: [
								{
									lat: -136.90625,
									lng: 68.78125,
									label: 'Landing zone',
									type: 'place',
									icon: 'cityCapital',
									iconType: 'png',
								},
								{
									lat: -7.625,
									lng: 213.5,
									label: 'World Map',
									type: 'text',
									fontSize: 20,
									mapLink: 'world_maps',
								},
								{
									lat: -74.5,
									lng: 248.53125,
									label: 'Lower City Inn',
									type: 'place',
									icon: 'poiBed',
									iconType: 'png',
									mapLink: 'korinis_lower_city_inn',
								},
								{ lat: -86.78125, lng: 338.34375, label: 'Inn', type: 'place', icon: 'poiBed', iconType: 'png' },
								{
									lat: -48.03125,
									lng: 209.09375,
									label: 'Harbour Inn',
									type: 'place',
									icon: 'poiBed',
									iconType: 'png',
									image: 'af14542d-6e79-4d4d-b9d7-8e2037a45307.jpg',
									mapLink: 'korinis_city_harbour_inn',
								},
								{
									lat: -58.71875,
									lng: 251.625,
									label: 'Paladin Barracks',
									type: 'place',
									icon: 'city',
									iconType: 'png',
									image: 'cd2dbe90-39eb-483d-9ad5-85e36fda39b2.jpg',
								},
								{ lat: -110.0625, lng: 194.9375, label: 'Paladin Hall', type: 'place', icon: 'city', iconType: 'png' },
								{
									lat: -28.53125,
									lng: 335.15625,
									label: 'Fire Mages Monastery',
									type: 'place',
									icon: 'templeCathedral',
									iconType: 'png',
								},
								{
									lat: -60.09375,
									lng: 195.59375,
									label: 'Pawn shop',
									type: 'place',
									icon: 'tradeShop',
									iconType: 'png',
								},
								{
									lat: -69.75,
									lng: 282.75,
									label: 'Secob Farm',
									type: 'place',
									icon: 'poiFarm',
									iconType: 'png',
								},
								{
									lat: -72.46875,
									lng: 141.59375,
									label: 'Lobart Farm',
									type: 'place',
									icon: 'poiFarm',
									iconType: 'png',
									description:
										"The adventurers arrived at a farm on the outskirts of the city, seeking entry but lacking the necessary gold. Speaking with one of the farmers, they learned that the head farmer might offer them a way in. They approached him and were given a proposition: earn gold by helping with the crops and assisting the farmer's wife with her tasks.",
								},
								{
									lat: -108.8125,
									lng: 292.8125,
									label: 'Caves (scales + blue blood)',
									type: 'place',
									icon: 'poiCave',
									iconType: 'png',
								},
								{ lat: -20.25, lng: 189.875, label: 'Paladin ship', type: 'place', icon: 'poiShip' },
								{
									lat: -55.421875,
									lng: 278.8125,
									label: 'Teleporter Exit B',
									type: 'place',
									icon: 'iconPortal',
									animationType: 'spin',
								},
								{
									lat: -98.84375,
									lng: 328.0625,
									label: 'Teleporter Exit C',
									type: 'place',
									icon: 'iconPortal',
									animationType: 'spin',
									mapLink: 'korinis_teleporter_c',
								},
								{
									lat: -19.96875,
									lng: 290.03125,
									label: 'Water Mages Pyramid',
									type: 'place',
									icon: 'templePyramid',
									image: '241bf32d-094b-49d7-ba81-3a224d39da82.jpg',
									mapLink: 'korinis_pyramid',
								},
								{
									lat: -89.96875,
									lng: 402.03125,
									label: "Erol's house",
									type: 'people',
									icon: 'poiGenericNPC',
									iconType: 'png',
								},
								{
									lat: -44.328125,
									lng: 429.109375,
									label: 'Farm Chapel',
									type: 'people',
									icon: 'templeShrine',
									iconType: 'png',
								},
								{
									lat: -38.96875,
									lng: 431.875,
									label: 'The Chocolate Contest Tavern',
									type: 'people',
									icon: 'poiBed_map',
									iconType: 'png',
								},
								{
									lat: -20.65625,
									lng: 463.5,
									label: 'Tower',
									type: 'people',
									icon: 'fortTower',
									iconType: 'png',
								},
							],
						},
						combat_encounters: {
							name: 'Combat encounters',
							items: [
								{ lat: -55.03125, lng: 173.90625, label: 'Wolves', type: 'place', icon: 'poiDanger', iconType: 'png' },
								{ lat: -100.375, lng: 282.84375, label: 'Wolves', type: 'place', icon: 'poiCombat', iconType: 'png' },
								{
									lat: -47.1875,
									lng: 181.3125,
									label: 'Bandits',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
									mapLink: 'korinis_bandits_01',
								},
								{
									lat: -63.9375,
									lng: 303.03125,
									label: 'Bandits',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
								},
								{
									lat: -56.71875,
									lng: 165.75,
									label: 'Goblin camp',
									type: 'place',
									icon: 'poiCombat',
									iconType: 'png',
									description: `The adventurers, hoping to make a new ally, approached the lizardman with friendly intentions. However, their efforts were met with hostility as the lizardman attacked them. The battle was intense, with the group struggling to subdue their reptilian foe. Just as they seemed to gain the upper hand, a group of goblins ambushed them from the shadows. The adventurers fought valiantly, managing to defeat the goblins, but in the chaos, one of the goblins used a spell to explode nearby corpses, which killed the lizardman, whom they had been trying to keep alive.`,
									image: '5f2e59cb-3f54-452f-bbd9-63905789961a.jpg',
								},
								{
									lat: -43.9375,
									lng: 307.09375,
									label: 'Inactive Golem',
									type: 'place',
									icon: 'poiDanger',
									iconType: 'png',
								},
								{
									lat: -24.15625,
									lng: 296.515625,
									label: 'Snapers',
									type: 'place',
									icon: 'poiDanger',
									iconType: 'png',
								},
								{
									lat: -16.65625,
									lng: 305.453125,
									label: 'Wasps',
									type: 'place',
									icon: 'poiDanger',
									iconType: 'png',
								},
								{
									lat: -119.125,
									lng: 341.8125,
									label: 'Ruined Tower Mages',
									type: 'people',
									icon: 'poiCombat',
									iconType: 'png',
								},
								{
									lat: -97,
									lng: 100.75,
									label: "Bandits' cave",
									type: 'place',
									icon: 'poiCave',
									iconType: 'png',
								},
							],
						},
						landmarks: {
							name: 'Landmarks',
							items: [
								{
									lat: -71,
									lng: 188.59375,
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
									coordinates: [-137.078125, 69.46875],
									text: 'Landing zone for the party.',
								},
								{
									coordinates: [-127.296875, 72.671875],
								},
								{
									coordinates: [-120.34375, 73.84375],
								},
								{
									coordinates: [-117.484375, 73.6875],
									text: 'Went up the path towards the mountains.',
								},
								{
									coordinates: [-112.703125, 73.234375],
								},
								{
									coordinates: [-103.703125, 73.078125],
								},
								{
									coordinates: [-99.5, 74.46875],
								},
								{
									coordinates: [-97.015625, 76.328125],
								},
								{
									coordinates: [-96.859375, 79.703125],
									text: 'At the crossroads, they met up with a guy who told them to follow him in the caves as there were some people looking for them. The party, after arguing a bit, agreed.',
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-97.328125, 100.734375],
									text: 'Turns out the people looking for them were bandits. Who could have guessed? After a fierce battle, the party emerged victorious.',
									animationInfo: {
										waitTimer: 3,
										animationType: 'fight',
									},
								},
								{
									coordinates: [-95.9375, 90.9375],
								},
								{
									coordinates: [-95.40625, 78.296875],
									text: 'Back at the crossroads, they decided to go onwards to what they hoped would be a settlement.',
								},
								{
									coordinates: [-92.609375, 76.734375],
								},
								{
									coordinates: [-87.171875, 76.0625],
								},
								{
									coordinates: [-79.859375, 75.859375],
								},
								{
									coordinates: [-75.1875, 76.296875],
								},
								{
									coordinates: [-70.40625, 78.09375],
								},
								{
									coordinates: [-66.046875, 83.875],
								},
								{
									coordinates: [-63.6875, 90.203125],
								},
								{
									coordinates: [-62.90625, 96.625],
								},
								{
									coordinates: [-64.171875, 103.90625],
								},
								{
									coordinates: [-66.671875, 110.4375],
								},
								{
									coordinates: [-67.59375, 114.03125],
									text: 'They saw a city in the background and a few farms to their right. Exhausted, they decided to go to one of the farmers.',
								},
								{
									coordinates: [-69.125, 124.375],
								},
								{
									coordinates: [-69.21875, 132.78125],
								},
								{
									coordinates: [-69.09375, 138.8125],
								},
								{
									coordinates: [-73.3125, 141.53125],
									text: "Reached Lobart farm and talked to its master. Learned the cost of entry into the city and were told to do deeds to gain money for it. Talked to the lead farmer's wife and got a task from her.",
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-69.65625, 143.96875],
								},
								{
									coordinates: [-69.28125, 154.6875],
								},
								{
									coordinates: [-69.875, 162.84375],
								},
								{
									coordinates: [-69.71875, 166.46875],
								},
								{
									coordinates: [-67.21875, 168.3125],
									text: "Down the road, we met a merchant which sold us entry to the city for a favour once inside. Also got a pan for the lead farmer's wife as part of her task.",
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-69.296875, 170.453125],
									text: "We went back to the farmer's wife and gave her the pan. She gave us food to eat. After that, we talked to the lead farmer again and slept in the barn.",
								},
								{
									coordinates: [-68.875, 174.9375],
								},
								{
									coordinates: [-70.765625, 181.03125],
								},
								{
									coordinates: [-71.171875, 186.984375],
								},
								{
									coordinates: [-71, 190.671875],
									text: 'Talked to the guards and showed them our entry pass. They allowed us into the city.',
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-71.53125, 199.734375],
								},
								{
									coordinates: [-71.5, 203.6875],
									text: 'Talked to the master paladin guarding the door and learned of the city rules and some whereabouts of the locations we were interested in.\n',
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-73.734375, 205.421875],
								},
								{
									coordinates: [-73.8125, 207.75],
								},
								{
									coordinates: [-72.203125, 209.53125],
								},
								{
									coordinates: [-71.0625, 210.4375],
								},
								{
									coordinates: [-71, 235.59375],
								},
								{
									coordinates: [-70.734375, 244.5625],
								},
								{
									coordinates: [-72.734375, 244.78125],
								},
								{
									coordinates: [-73.390625, 246.71875],
									text: 'Walked into the inn and slept. During the night, some of the gold and some of our belongings were stolen.',
									animationInfo: {
										waitTimer: 5,
										animationType: 'rest',
									},
								},
							],
						},
						{
							name: 'Session 3 Recap',
							lineColor: '#2898bd',
							points: [
								{
									coordinates: [-74.96875, 247.59375],
									text: 'Woken up, the party decided to go into the woods and gather the plants that were requested by the alchemist.',
									animationInfo: {
										waitTimer: 2,
										animationType: 'walk',
									},
								},
								{
									coordinates: [-73.625, 246.75],
								},
								{
									coordinates: [-73.0625, 245.375],
								},
								{
									coordinates: [-71.5625, 244.65625],
								},
								{
									coordinates: [-71.21875, 248.5],
								},
								{
									coordinates: [-71.28125, 266.40625],
								},
								{
									coordinates: [-71.4375, 271.65625],
									text: 'On the way out of the city, guards stopped them and asked them what they were doing. Upon learning they were headed into the forest, the guards wished them good luck.',
									animationInfo: {
										waitTimer: 1,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-71.90625, 273.46875],
								},
								{
									coordinates: [-74.5625, 274.40625],
								},
								{
									coordinates: [-76.84375, 274.25],
								},
								{
									coordinates: [-78.96875, 274.84375],
								},
								{
									coordinates: [-80.5625, 276.375],
								},
								{
									coordinates: [-81.125, 277.90625],
									text: 'The party ventured into the forest down this path.',
									animationInfo: {
										animationType: 'walk',
									},
								},
								{
									coordinates: [-83.0625, 278],
								},
								{
									coordinates: [-84.1875, 277.5],
								},
								{
									coordinates: [-85.15625, 279.71875],
								},
								{
									coordinates: [-86.15625, 279.71875],
								},
								{
									coordinates: [-87.28125, 278.9375],
								},
								{
									coordinates: [-88.4375, 280.09375],
								},
								{
									coordinates: [-89.59375, 280.75],
								},
								{
									coordinates: [-91.9375, 279.71875],
								},
								{
									coordinates: [-93.75, 277.875],
								},
								{
									coordinates: [-95.625, 278],
								},
								{
									coordinates: [-96.96875, 279],
								},
								{
									coordinates: [-98.46875, 280.4375],
								},
								{
									coordinates: [-99.875, 281.5625],
								},
								{
									coordinates: [-100.6875, 282.90625],
									text: 'They attacked a pack of wolves which were roaming around in the forest. The battle was fierce, but they were victorious. They managed to find hides, which would prove useful to gain apprenticeship.\n',
									animationInfo: {
										waitTimer: 3,
										animationType: 'fight',
									},
								},
								{
									coordinates: [-102.75, 282.5625],
								},
								{
									coordinates: [-103.890625, 282.734375],
								},
								{
									coordinates: [-105.703125, 283.625],
								},
								{
									coordinates: [-107.0625, 285],
								},
								{
									coordinates: [-108.59375, 290.65625],
								},
								{
									coordinates: [-108.921875, 292.453125],
									text: 'Entering the nearby caves, they saw what looked like blue blood - lizardmen blood, and a few creatures which looked way too powerful for them to handle.',
								},
								{
									coordinates: [-107.296875, 292.890625],
								},
								{
									coordinates: [-104.625, 291.578125],
								},
								{
									coordinates: [-100.625, 292.109375],
								},
								{
									coordinates: [-99.03125, 291.40625],
								},
								{
									coordinates: [-98.453125, 286.203125],
								},
								{
									coordinates: [-95.703125, 278.796875],
								},
								{
									coordinates: [-93.671875, 278.796875],
								},
								{
									coordinates: [-91.671875, 281.125],
								},
								{
									coordinates: [-88.34375, 281.703125],
								},
								{
									coordinates: [-84.890625, 280.265625],
								},
								{
									coordinates: [-84.078125, 279.328125],
								},
								{
									coordinates: [-80.859375, 278.5],
								},
								{
									coordinates: [-80.5, 286.3125],
								},
								{
									coordinates: [-80.015625, 300.609375],
								},
								{
									coordinates: [-79.859375, 308.234375],
								},
								{
									coordinates: [-83.546875, 310.15625],
									text: 'Near the bridge, they met Erol, who had been robbed by the bandits on the bridge nearby. He had a broken leg, which the party Cleric mended.',
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-79.828125, 310.9375],
								},
								{
									coordinates: [-80.140625, 328.15625],
								},
								{
									coordinates: [-79.421875, 332.671875],
								},
								{
									coordinates: [-77.015625, 334.078125],
								},
								{
									coordinates: [-76.046875, 336.328125],
									text: "At the crossroads, they took a left turn to go towards the Fire Mages Monastery, in order to seek a Fire Mage's blessing.",
									animationInfo: {
										animationType: 'walk',
									},
								},
								{
									coordinates: [-69.6875, 336.53125],
								},
								{
									coordinates: [-64.703125, 336.375],
								},
								{
									coordinates: [-59.8125, 336.3125],
								},
								{
									coordinates: [-51.875, 335.71875],
								},
								{
									coordinates: [-49.578125, 335.421875],
								},
								{
									coordinates: [-49.59375, 331.5625],
								},
								{
									coordinates: [-50.203125, 327],
								},
								{
									coordinates: [-49.515625, 324.765625],
									text: 'They saw Isgaroth, a Fire Mage, who was doing a prayer. They waited for two hours for the prayer to finish and after that they received the Fire Mage blessing for free, as they had made the trip to the Monastery.\n',
									animationInfo: {
										waitTimer: 7,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-48.21875, 326.125],
								},
								{
									coordinates: [-48.71875, 336.5625],
								},
								{
									coordinates: [-58.859375, 337.34375],
								},
								{
									coordinates: [-65.953125, 337.625],
								},
								{
									coordinates: [-76.03125, 337.75],
								},
								{
									coordinates: [-79.21875, 339.6875],
								},
								{
									coordinates: [-81.71875, 338.734375],
								},
								{
									coordinates: [-83.359375, 338.9375],
								},
								{
									coordinates: [-84.3125, 337.453125],
								},
								{
									coordinates: [-85.609375, 337.859375],
									text: 'The party checked out the inn at the crossroads, looking for a place to spend the night in, but the prices were too steep for them, so they went back in town.',
									animationInfo: {
										waitTimer: 2,
										animationType: 'rest',
									},
								},
							],
						},
						{
							name: 'Session 4 Recap',
							lineColor: '#ff7e55',
							points: [
								{
									coordinates: [-73.875, 247.71875],
								},
								{
									coordinates: [-72.875, 246.40625],
								},
								{
									coordinates: [-72.375, 244.78125],
								},
								{
									coordinates: [-70.875, 242.71875],
								},
								{
									coordinates: [-70.90625, 235.25],
									text: 'The party decided to venture outside, into the forest they saw when they first entered the city.',
									animationInfo: {
										animationType: 'walk',
									},
								},
								{
									coordinates: [-70.84375, 224.59375],
								},
								{
									coordinates: [-70.28125, 209.1875],
								},
								{
									coordinates: [-68.75, 207.25],
								},
								{
									coordinates: [-69.8125, 204.375],
								},
								{
									coordinates: [-70.96875, 201.71875],
								},
								{
									coordinates: [-70.625, 192.4375],
								},
								{
									coordinates: [-70.625, 183.375],
								},
								{
									coordinates: [-69.78125, 179.28125],
								},
								{
									coordinates: [-66.3125, 179.625],
								},
								{
									coordinates: [-62.375, 180.6875],
								},
								{
									coordinates: [-57.28125, 180.53125],
									text: 'Seeing a pack of wolves and a goblin camp in the nearby forest, they took a more secluded path, going stealthily deeper in the forest.\n',
								},
								{
									coordinates: [-52.84375, 178.75],
								},
								{
									coordinates: [-51.8125, 175.34375],
									text: 'In the distance stood a Lizardman. The party cleric decided to send a spell to them in order to make contact, hoping to come in peace and talk.\n',
								},
								{
									coordinates: [-50.78125, 163.3125],
									text: "The plan didn't work out. The lizardman attacked, enraged, and a battle started. In the midst of the battle, the goblin horde attacked as well, killing the downed Lizarman. The party emerged victorious.\n",
									animationInfo: {
										waitTimer: 5,
										animationType: 'fight',
									},
								},
								{
									coordinates: [-49.84375, 159.21875],
								},
								{
									coordinates: [-47.0625, 158.875],
								},
								{
									coordinates: [-46.46875, 160],
								},
								{
									coordinates: [-46.53125, 166.125],
								},
								{
									coordinates: [-46.5625, 172.625],
								},
								{
									coordinates: [-47, 179.25],
									text: 'The party was ambushed by some bandits who looked like they were smuggling things into the city. Overwhelmed and outnumbered, they wisely chose to run away from this encounter.',
									animationInfo: {
										waitTimer: 3,
										animationType: 'fight',
									},
								},
								{
									coordinates: [-45.8125, 173.15625],
								},
								{
									coordinates: [-45.1875, 165.0625],
								},
								{
									coordinates: [-45.78125, 159.5625],
									animationInfo: {
										animationType: 'walk',
									},
								},
								{
									coordinates: [-47.25, 157.84375],
								},
								{
									coordinates: [-50.4375, 158.34375],
								},
								{
									coordinates: [-52.375, 158.875],
								},
								{
									coordinates: [-55, 158.21875],
								},
								{
									coordinates: [-57.1875, 158.03125],
									text: 'Hoping to avoid the wildlife they had seen, they took another path through the forest.',
								},
								{
									coordinates: [-59.625, 160.34375],
								},
								{
									coordinates: [-61.4375, 161.59375],
								},
								{
									coordinates: [-61.75, 164.03125],
								},
								{
									coordinates: [-62.8125, 165.84375],
								},
								{
									coordinates: [-64.84375, 166.75],
								},
								{
									coordinates: [-67.71875, 167.875],
								},
								{
									coordinates: [-69.28125, 170.71875],
								},
								{
									coordinates: [-70.15625, 177.5],
								},
								{
									coordinates: [-71.59375, 183.59375],
								},
								{
									coordinates: [-71.4375, 191.15625],
								},
								{
									coordinates: [-71.78125, 200.71875],
								},
								{
									coordinates: [-71.8125, 203.75],
									text: 'Back into the city, they stopped and talked to the Paladin guard and informed them of the bandits they had seen and their location.',
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-73.84375, 206.53125],
								},
								{
									coordinates: [-73.4375, 208.65625],
								},
								{
									coordinates: [-71.28125, 210.46875],
								},
								{
									coordinates: [-71.40625, 219.875],
								},
								{
									coordinates: [-71.40625, 234.625],
								},
								{
									coordinates: [-71.5625, 241.90625],
								},
								{
									coordinates: [-71.84375, 243.40625],
								},
								{
									coordinates: [-73.625, 244.84375],
								},
								{
									coordinates: [-74.46875, 247.8125],
									text: 'Exhausted for the day, they rested at the inn once more.',
									animationInfo: {
										waitTimer: 2,
										animationType: 'rest',
									},
								},
							],
						},
						{
							name: 'Session 7 Recap',
							lineColor: '#84d8e3',
							points: [
								{
									coordinates: [-81.5625, 219.8125],
								},
								{
									coordinates: [-77.40625, 219],
								},
								{
									coordinates: [-73.875, 218.78125],
									text: 'The adventurers decide to journey to the pyramids in search of the water mages party.',
									animationInfo: {
										waitTimer: 1,
										animationType: 'walk',
									},
								},
								{
									coordinates: [-71.15625, 218.78125],
								},
								{
									coordinates: [-70.96875, 229.03125],
								},
								{
									coordinates: [-71.0625, 247.875],
								},
								{
									coordinates: [-70.8125, 263.96875],
								},
								{
									coordinates: [-70.625, 272.375],
								},
								{
									coordinates: [-72.84375, 274.46875],
								},
								{
									coordinates: [-77.84375, 275.09375],
								},
								{
									coordinates: [-80.5625, 277.25],
								},
								{
									coordinates: [-80.59375, 286.90625],
								},
								{
									coordinates: [-78.71875, 286.40625],
								},
								{
									coordinates: [-75.125, 286.3125],
								},
								{
									coordinates: [-73.03125, 286.125],
								},
								{
									coordinates: [-73.40625, 284.09375],
								},
								{
									coordinates: [-72.65625, 283.03125],
								},
								{
									coordinates: [-72.03125, 283.34375],
								},
								{
									coordinates: [-70.46875, 283.09375],
								},
								{
									coordinates: [-70.21875, 282.15625],
								},
								{
									coordinates: [-68.28125, 283.21875],
								},
								{
									coordinates: [-67.125, 283.34375],
								},
								{
									coordinates: [-65.5625, 284.1875],
								},
								{
									coordinates: [-63.09375, 285.59375],
								},
								{
									coordinates: [-60.375, 288.40625],
								},
								{
									coordinates: [-57.90625, 291.28125],
								},
								{
									coordinates: [-56.4375, 293.6875],
									text: 'While navigating the tough terrain, both the Ranger and Sorcerer fail an athletics check and get injured.',
									animationInfo: {
										waitTimer: 1,
										animationType: 'walk',
									},
								},
								{
									coordinates: [-54.1875, 296.6875],
								},
								{
									coordinates: [-50.3125, 297.5],
								},
								{
									coordinates: [-48.03125, 298.3125],
								},
								{
									coordinates: [-46.375, 300],
								},
								{
									coordinates: [-44.5625, 300.1875],
									text: 'The group spots an inactive golem to their right, which catches their interest.',
								},
								{
									coordinates: [-41.90625, 300.75],
								},
								{
									coordinates: [-40.03125, 301.8125],
								},
								{
									coordinates: [-38.625, 301.96875],
									text: 'They pay 2 silver per person to cross the river over a shaky bridge guarded by a troll.',
									animationInfo: {
										waitTimer: 2,
										animationType: 'merchant',
									},
								},
								{
									coordinates: [-35.90625, 302],
								},
								{
									coordinates: [-33.71875, 301.59375],
								},
								{
									coordinates: [-31.34375, 301.21875],
								},
								{
									coordinates: [-30.3125, 301.125],
								},
								{
									coordinates: [-27.625, 301.0625],
								},
								{
									coordinates: [-23.5625, 300.625],
									text: 'To their right, they find ruins and two ancient chests, sparking their curiosity.',
								},
								{
									coordinates: [-21.25, 300.34375],
								},
								{
									coordinates: [-20.34375, 300.40625],
								},
								{
									coordinates: [-19.625, 298.59375],
									text: 'Straight ahead, they entered a group of tents and discovered the location of the water mages.',
									animationInfo: {
										animationType: 'walk',
									},
								},
								{
									coordinates: [-18.25, 295.84375],
								},
								{
									coordinates: [-17.6875, 294.625],
								},
								{
									coordinates: [-18.09375, 293.6875],
								},
								{
									coordinates: [-19.34375, 293.1875],
								},
								{
									coordinates: [-20.90625, 293.0625],
								},
								{
									coordinates: [-22.34375, 290.9375],
								},
								{
									coordinates: [-22, 289.75],
								},
								{
									coordinates: [-20.71875, 290.09375],
									text: 'The group entered the pyramids. In the first chamber they saw a huge door to their left, which was locked. Straight ahead through a corridor they fought a fierce battle against lich-like creatures and undead. They were victorious in the end with the help of the water mages party. Learning more about the strange devices of the land, they decided to help the mages with what looked like a teleporter. Once they stepped on it, they were teleported to a different location, but they managed to work out the system behind the teleporters: one would take you to a cave in the mountains, close to the city, and the other to another small cave near the inn.\n',
									animationInfo: {
										waitTimer: 5,
										animationType: 'fight',
									},
								},
								{
									coordinates: [-20.875, 290.25],
									pointColor: 'yellow',
									pointWidth: 1,
								},
								{
									coordinates: [-55.11, 278.8],
									pointColor: 'yellow',
									pointWidth: 1,
								},
								{
									coordinates: [-98.64, 328.05],
									pointColor: 'yellow',
									pointWidth: 1,
								},
								{
									coordinates: [-20.875, 290.25],
									pointColor: 'yellow',
									pointWidth: 1,
								},
							],
						},
						{
							name: 'Session 8 Recap',
							lineColor: '#ff5722',
							points: [
								{
									coordinates: [-55.84375, 279.34375],
									text: 'This is where the previous session ended.',
								},
								{
									coordinates: [-58.125, 280.1875],
								},
								{
									coordinates: [-59.34375, 279.21875],
								},
								{
									coordinates: [-60.34375, 276.3125],
								},
								{
									coordinates: [-62.1875, 276.21875],
								},
								{
									coordinates: [-63.5, 276.4375],
								},
								{
									coordinates: [-68.8125, 273.0625],
								},
								{
									coordinates: [-70.75, 272.71875],
								},
								{
									coordinates: [-72.34375, 274.84375],
								},
								{
									coordinates: [-75.40625, 275.1875],
								},
								{
									coordinates: [-79.15625, 275.6875],
								},
								{
									coordinates: [-80.5625, 278.3125],
								},
								{
									coordinates: [-80.59375, 289.65625],
								},
								{
									coordinates: [-80.3125, 297.625],
								},
								{
									coordinates: [-79.84375, 309.03125],
								},
								{
									coordinates: [-79.84375, 319.59375],
								},
								{
									coordinates: [-79.5, 329.03125],
								},
								{
									coordinates: [-80, 332.71875],
								},
								{
									coordinates: [-82.28125, 335.46875],
								},
								{
									coordinates: [-86.71875, 337.765625],
									text: 'Went into the inn and talked with the bartender, who was a follower of the water mages. Learned about the mercenaries and got a key to unlock the teleporter B lock.\n',
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-83.65625, 338.421875],
								},
								{
									coordinates: [-80.671875, 339.90625],
								},
								{
									coordinates: [-80.453125, 347.34375],
								},
								{
									coordinates: [-80.515625, 363.28125],
								},
								{
									coordinates: [-80.328125, 373.09375],
								},
								{
									coordinates: [-80.515625, 387.265625],
								},
								{
									coordinates: [-80.546875, 393.828125],
								},
								{
									coordinates: [-80.609375, 397.25],
								},
								{
									coordinates: [-81.25, 397.90625],
								},
								{
									coordinates: [-85.25, 397.921875],
								},
								{
									coordinates: [-90.359375, 398.0625],
								},
								{
									coordinates: [-91.5625, 400.125],
								},
								{
									coordinates: [-90.15625, 401.59375],
									text: "Went to Erol's house and met with him. Learned about the guards and Silvestro's quota.",
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-89.734375, 399.265625],
								},
								{
									coordinates: [-84.484375, 398.40625],
								},
								{
									coordinates: [-81.1875, 398.796875],
								},
								{
									coordinates: [-80.71875, 401.84375],
								},
								{
									coordinates: [-80.8125, 409.875],
								},
								{
									coordinates: [-80.859375, 421.609375],
								},
								{
									coordinates: [-80.8125, 430.984375],
									text: 'Saw a meadow with a lot of cows and sheep on the right, and huge farmlands to the left.\n',
								},
								{
									coordinates: [-80.828125, 445.09375],
								},
								{
									coordinates: [-80.625, 450.125],
									text: 'Decided to make a left turn here towards the farm.\n',
								},
								{
									coordinates: [-74.765625, 449.625],
								},
								{
									coordinates: [-68.5625, 449.203125],
								},
								{
									coordinates: [-57.234375, 448.96875],
								},
								{
									coordinates: [-47.84375, 448.953125],
								},
								{
									coordinates: [-44.765625, 449.078125],
									text: 'Met up with Silvestro, learned about the farm and paid the 20 gold per person tax.\n',
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-42.09375, 446.796875],
									text: 'Met up with the two merchants - Quixie and Jabba the Hutt. Bought 1 haste potion and two items for approximately 1000g.\n',
									animationInfo: {
										waitTimer: 2, // seconds to wait at this point
										animationType: 'merchant', // or 'merchant' or 'rest'
									},
								},
								{
									coordinates: [-42.796875, 445.21875],
								},
								{
									coordinates: [-42.515625, 441.53125],
									text: 'Saw that the inn to the left was holding a competition for whoever could eat the most chocolate. Nobody could resist such temptation.',
								},
								{
									coordinates: [-39.921875, 439.25],
								},
								{
									coordinates: [-39.90625, 435.28125],
								},
								{
									coordinates: [-39.25, 432.34375],
									text: 'Entered the contest - the Cleric and the Barbarian won, and ate a stew which increased their max HP by 5. The others puked.',
								},
								{
									coordinates: [-38.6875, 438.765625],
								},
								{
									coordinates: [-39.25, 439.578125],
								},
								{
									coordinates: [-39, 443.671875],
								},
								{
									coordinates: [-37.4375, 444.53125],
								},
								{
									coordinates: [-35.265625, 444.5625],
								},
								{
									coordinates: [-34.328125, 444.125],
									text: "Met up with General Lee and learned that they wanted to leave the island and were planning to take over the city. While trying to help, the party might've accidentally killed Captain Cunts by revealing his location to the pirate queen Bianca. Lee told the party, under the condition that they help Lee's lieutenants too, that the valley of mines was currently under siege by the Lizardmen, and that the only 'safe' entrance was through another path his spies had been using for a while.\n",
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-34.40625, 445.953125],
									text: 'Met up with another follower of the Water Mages guild who was training the mercenary recruits. Trained with him and gained expertise with chosen weapons.\n',
									animationInfo: {
										waitTimer: 2,
										animationType: 'conversation',
									},
								},
								{
									coordinates: [-37.171875, 445.734375],
								},
								{
									coordinates: [-37.234375, 448.34375],
								},
								{
									coordinates: [-36.609375, 450.796875],
								},
								{
									coordinates: [-35.421875, 451.890625],
								},
								{
									coordinates: [-33.234375, 453.40625],
								},
								{
									coordinates: [-32, 454.1875],
								},
								{
									coordinates: [-31.078125, 455.03125],
									text: 'Went to the Blacksmith to learn about their trade.',
								},
								{
									coordinates: [-32.125, 455.609375],
								},
								{
									coordinates: [-33.265625, 454.375],
								},
								{
									coordinates: [-37.3125, 451.5625],
								},
								{
									coordinates: [-42.953125, 449.65625],
								},
								{
									coordinates: [-46.90625, 448.21875],
								},
								{
									coordinates: [-53.53125, 448.015625],
								},
								{
									coordinates: [-63.46875, 448.484375],
								},
								{
									coordinates: [-76.078125, 448.8125],
								},
								{
									coordinates: [-79.75, 448.796875],
								},
								{
									coordinates: [-79.890625, 438.5],
									text: 'Going back to the inn and towards the penal colony.',
								},
								{
									coordinates: [-79.0625, 418.90625],
								},
								{
									coordinates: [-79.046875, 402.171875],
									text: 'Noticed there was another set of guards compared to the first time.',
								},
								{
									coordinates: [-79.46875, 346.40625],
									text: 'Made a left turn here towards the Penal Colony. What could go wrong?',
								},
								{
									coordinates: [-83.375, 346.796875],
								},
								{
									coordinates: [-87.703125, 348.53125],
								},
								{
									coordinates: [-94.484375, 349.515625],
								},
								{
									coordinates: [-99.1875, 350.421875],
								},
								{
									coordinates: [-107.40625, 350.125],
								},
								{
									coordinates: [-111.09375, 350.390625],
									text: 'In front of them, they saw the road and two paladins standing guard. To their left, a ruined tower; to their right, farmland.',
								},
								{
									coordinates: [-115.484375, 350.484375],
								},
								{
									coordinates: [-116.453125, 344.890625],
									text: 'Their passive perception not enough, the party was ambushed by a party of 3 orc mages - each master of a different element: fire, ice and lightning. After a fierce battle, they emerged victorious.\n',
									animationInfo: {
										waitTimer: 5,
										animationType: 'fight',
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
											coordinates: [-43.34375, 186.65625],
										},
										{
											coordinates: [-42.4375, 193.0625],
										},
										{
											coordinates: [-42.9375, 195.4375],
										},
										{
											coordinates: [-41.90625, 201.1875],
										},
										{
											coordinates: [-42.0625, 204.46875],
										},
										{
											coordinates: [-42.03125, 205.96875],
										},
										{
											coordinates: [-41.15625, 209.3125],
										},
										{
											coordinates: [-41.5625, 210.46875],
										},
										{
											coordinates: [-39.4375, 217.5],
										},
										{
											coordinates: [-37.78125, 218.5625],
										},
										{
											coordinates: [-36.6875, 222.40625],
										},
										{
											coordinates: [-37.3125, 225.25],
										},
										{
											coordinates: [-36.53125, 228.09375],
										},
										{
											coordinates: [-36.28125, 231.1875],
										},
										{
											coordinates: [-34.65625, 232.21875],
										},
										{
											coordinates: [-33.4375, 233.34375],
										},
										{
											coordinates: [-33.28125, 234.9375],
										},
										{
											coordinates: [-33.53125, 236.0625],
										},
										{
											coordinates: [-33.15625, 237.375],
										},
										{
											coordinates: [-33.71875, 239.84375],
										},
										{
											coordinates: [-30.0625, 248.53125],
										},
										{
											coordinates: [-27.3125, 252.96875],
										},
										{
											coordinates: [-25.15625, 254.71875],
										},
										{
											coordinates: [-22.34375, 250.875],
										},
										{
											coordinates: [-28.375, 242.96875],
										},
										{
											coordinates: [-28.09375, 233.03125],
										},
										{
											coordinates: [-35.40625, 215],
										},
										{
											coordinates: [-37.6875, 200.5],
										},
										{
											coordinates: [-37.6875, 195.1875],
										},
										{
											coordinates: [-38.25, 187.65625],
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
											coordinates: [-43.5, 186.6875],
										},
										{
											coordinates: [-42.4375, 193.3125],
										},
										{
											coordinates: [-43.0625, 195.40625],
										},
										{
											coordinates: [-42, 200.875],
										},
										{
											coordinates: [-42.03125, 205.3125],
										},
										{
											coordinates: [-41.1875, 209.4375],
										},
										{
											coordinates: [-41.5, 210.6875],
										},
										{
											coordinates: [-39.5, 217.375],
										},
										{
											coordinates: [-37.84375, 218.625],
										},
										{
											coordinates: [-36.6875, 222.3125],
										},
										{
											coordinates: [-37.34375, 225.3125],
										},
										{
											coordinates: [-36.625, 227.9375],
										},
										{
											coordinates: [-36.4375, 231.4375],
										},
										{
											coordinates: [-33.6875, 233.03125],
										},
										{
											coordinates: [-33.03125, 237.34375],
										},
										{
											coordinates: [-33.78125, 239.25],
										},
										{
											coordinates: [-31.78125, 244.46875],
										},
										{
											coordinates: [-30.25, 248.34375],
										},
										{
											coordinates: [-28.40625, 250.5],
										},
										{
											coordinates: [-26.6875, 254],
										},
										{
											coordinates: [-24.96875, 254.5625],
										},
										{
											coordinates: [-27.65625, 258.0625],
										},
										{
											coordinates: [-45.84375, 258.46875],
										},
										{
											coordinates: [-53.71875, 265.71875],
										},
										{
											coordinates: [-58.5, 260.28125],
										},
										{
											coordinates: [-58.3125, 247.65625],
										},
										{
											coordinates: [-58.34375, 208.8125],
										},
										{
											coordinates: [-58.5, 189.71875],
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
											coordinates: [-58.5625, 189.5625],
										},
										{
											coordinates: [-58.21875, 254],
										},
										{
											coordinates: [-58.53125, 260.3125],
										},
										{
											coordinates: [-53.28125, 265.40625],
										},
										{
											coordinates: [-60.40625, 270.84375],
										},
										{
											coordinates: [-74.5625, 270.84375],
										},
										{
											coordinates: [-75, 264.78125],
										},
										{
											coordinates: [-77.875, 257.5],
										},
										{
											coordinates: [-86.90625, 242.125],
										},
										{
											coordinates: [-86.875, 185.625],
										},
										{
											coordinates: [-85.125, 185.6875],
										},
										{
											coordinates: [-74.90625, 189.6875],
										},
										{
											coordinates: [-69.15625, 190.03125],
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
											coordinates: [-86.75, 185.5],
										},
										{
											coordinates: [-86.78125, 242.03125],
										},
										{
											coordinates: [-77.5625, 257.84375],
										},
										{
											coordinates: [-74.9375, 264.71875],
										},
										{
											coordinates: [-74.625, 270.625],
										},
										{
											coordinates: [-84.21875, 267.8125],
										},
										{
											coordinates: [-114.25, 252.6875],
										},
										{
											coordinates: [-114.4375, 190.34375],
										},
										{
											coordinates: [-99.84375, 185.84375],
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
											coordinates: [-71, 275.1875],
										},
										{
											coordinates: [-68.96875, 276.25],
										},
										{
											coordinates: [-67.34375, 279.25],
										},
										{
											coordinates: [-67.5, 282.59375],
										},
										{
											coordinates: [-67.75, 284.625],
										},
										{
											coordinates: [-67.0625, 287.53125],
										},
										{
											coordinates: [-68.0625, 291.75],
										},
										{
											coordinates: [-70.0625, 294.34375],
										},
										{
											coordinates: [-72.46875, 297.09375],
										},
										{
											coordinates: [-78.875, 299.375],
										},
										{
											coordinates: [-78.875, 294.15625],
										},
										{
											coordinates: [-79.6875, 287.09375],
										},
										{
											coordinates: [-79.90625, 281.59375],
										},
										{
											coordinates: [-78.5, 277.53125],
										},
										{
											coordinates: [-75.34375, 276.53125],
										},
										{
											coordinates: [-72.78125, 276.625],
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
											coordinates: [-73.625, 125],
										},
										{
											coordinates: [-71.125, 128.375],
										},
										{
											coordinates: [-72, 139.9375],
										},
										{
											coordinates: [-72.625, 143.9375],
										},
										{
											coordinates: [-71.4375, 152.1875],
										},
										{
											coordinates: [-71.5, 163],
										},
										{
											coordinates: [-70.5625, 174.5625],
										},
										{
											coordinates: [-71.125, 176.625],
										},
										{
											coordinates: [-76.3125, 176.6875],
										},
										{
											coordinates: [-83.75, 175.9375],
										},
										{
											coordinates: [-85.6875, 170.125],
										},
										{
											coordinates: [-87.1875, 164.75],
										},
										{
											coordinates: [-89.875, 160.9375],
										},
										{
											coordinates: [-90.125, 152.4375],
										},
										{
											coordinates: [-91.9375, 146.3125],
										},
										{
											coordinates: [-88.0625, 132.4375],
										},
										{
											coordinates: [-84.1875, 124.4375],
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
											coordinates: [-30, 411.75],
										},
										{
											coordinates: [-28.6875, 435.75],
										},
										{
											coordinates: [-33.125, 436.0625],
										},
										{
											coordinates: [-36.5, 427.4375],
										},
										{
											coordinates: [-43.125, 426.125],
										},
										{
											coordinates: [-47.0625, 427.5625],
										},
										{
											coordinates: [-49.5625, 429.8125],
										},
										{
											coordinates: [-56.0625, 428.875],
										},
										{
											coordinates: [-59.625, 433.0625],
										},
										{
											coordinates: [-61.0625, 433.375],
										},
										{
											coordinates: [-62.125, 435.8125],
										},
										{
											coordinates: [-62.75, 438.25],
										},
										{
											coordinates: [-59.875, 439.125],
										},
										{
											coordinates: [-52.25, 436.625],
										},
										{
											coordinates: [-48.5, 438],
										},
										{
											coordinates: [-45.875, 440.875],
										},
										{
											coordinates: [-43.1875, 441.8125],
										},
										{
											coordinates: [-43.1875, 445.4375],
										},
										{
											coordinates: [-45.3125, 447.4375],
										},
										{
											coordinates: [-60.5625, 447.625],
										},
										{
											coordinates: [-76.875, 448],
										},
										{
											coordinates: [-76.375, 398.25],
										},
										{
											coordinates: [-56.5, 398.25],
										},
										{
											coordinates: [-49.6875, 402.9375],
										},
										{
											coordinates: [-49.75, 410.4375],
										},
										{
											coordinates: [-43.6875, 410.1875],
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
									animationInfo: {
										waitTimer: 2,
										animationType: 'fight',
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
									animationInfo: {
										waitTimer: 5,
										animationType: 'fight',
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
									animationInfo: {
										waitTimer: 2,
										animationType: 'loot',
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
				},
			},
		},
	},
};
