const MAP_DATABASE = {
	world_maps: {
		main_map_01: {
			metadata: {
				path: 'maps/world_maps/main_map_01',
				sizes: {
					maxZoom: 5,
					imageWidth: 13458,
					imageHeight: 6961,
				},
				backgroundColor: '#e7dabb',
			},
			annotations: {
				npcs: {
					name: 'NPCs',
					items: [
						{
							lat: -118.21875,
							lng: 189.59375,
							label: 'Darren (Fire mage)',
							type: 'people',
							icon: 'poiGenericNPC',
							iconType: 'png',
						},
						{
							lat: -149.65625,
							lng: 134.875,
							label: 'Constantine (Water mage)',
							type: 'people',
							icon: 'poiGenericNPC',
							iconType: 'png',
						},
						{
							lat: -139.65625,
							lng: 302.75,
							label: 'Erol (tablets)',
							type: 'place',
							icon: 'poiGenericNPC',
							iconType: 'png',
						},
						{
							lat: -81.03125,
							lng: 314.78125,
							label: 'Isgaroth (Fire mage)',
							type: 'people',
							icon: 'poiGenericNPC',
							iconType: 'png',
						},
						{
							lat: -137.09375,
							lng: 117.9375,
							label: 'Bosper (Hunter)',
							type: 'people',
							icon: 'tradeHunter',
							iconType: 'png',
						},
						{
							lat: -146.5,
							lng: 126.0625,
							label: 'Thorben (Alchemist)',
							type: 'people',
							icon: 'tradeAlchemy',
							iconType: 'png',
						},
						{
							lat: -110.5,
							lng: 135,
							label: 'Thoren (Blacksmith)',
							type: 'people',
							icon: 'tradeForge',
							iconType: 'png',
							mapLink: 'world_maps.main_map_01.submaps.interiors.main_map_interior_blacksmith',
						},
						{
							lat: -95.75,
							lng: 35.9375,
							label: 'Lizardman',
							type: 'people',
							icon: 'cityLizard',
							iconType: 'png',
						},
					],
				},
				points_of_interest: {
					name: 'Points of interest',
					items: [
						{
							lat: -137.75,
							lng: 172.5,
							label: 'Inn',
							type: 'place',
							icon: 'poiBed',
							iconType: 'png',
							mapLink: 'world_maps.main_map_01.submaps.interiors.main_map_interior_town_inn',
						},
						{ lat: -146.75, lng: 342.5, label: 'Inn', type: 'place', icon: 'poiBed', iconType: 'png' },
						{
							lat: -80.25,
							lng: 121.625,
							label: 'Harbour Inn',
							type: 'place',
							icon: 'poiBed',
							iconType: 'png',
							image: 'harbour_inn.png',
							mapLink: 'world_maps.main_map_01.submaps.interiors.main_map_interior_harbour_inn',
						},
						{ lat: -99, lng: 177, label: 'Paladin Barracks', type: 'place', icon: 'city', iconType: 'png' },
						{
							lat: -47.47,
							lng: 328,
							label: 'Fire Mages Monastery',
							type: 'place',
							icon: 'templeCathedral',
							iconType: 'png',
						},
						{ lat: -122.40625, lng: 102.96875, label: 'Pawn shop', type: 'place', icon: 'tradeShop', iconType: 'png' },
						{ lat: -111.53125, lng: 252.3125, label: 'Sefob Farm', type: 'place', icon: 'poiFarm', iconType: 'png' },
						{
							lat: -144.5,
							lng: 32.625,
							label: 'Lobart Farm',
							type: 'place',
							icon: 'poiFarm',
							iconType: 'png',
							description:
								"The adventurers arrived at a farm on the outskirts of the city, seeking entry but lacking the necessary gold. Speaking with one of the farmers, they learned that the head farmer might offer them a way in. They approached him and were given a proposition: earn gold by helping with the crops and assisting the farmer's wife with her tasks.",
						},
						{
							lat: -198.75,
							lng: 282.25,
							label: 'Caves (scales + blue blood)',
							type: 'place',
							icon: 'poiCave',
							iconType: 'png',
						},
						{ lat: -24.75, lng: 79.75, label: 'Paladin ship', type: 'place', icon: 'city' },
					],
				},
				navigation: {
					name: 'Navigation arrows',
					items: [
						{
							lat: -48.53125,
							lng: 369.65625,
							label: 'To Hunter Camp',
							type: 'place',
							icon: 'arrowUpRight',
							iconType: 'svg',
						},
						{ lat: -129.25, lng: 415.5, label: 'To Mercenaries', type: 'place', icon: 'arrowRight', iconType: 'svg' },
						{ lat: -202.5, lng: 365.75, label: 'To Penal Colony', type: 'place', icon: 'arrowDown', iconType: 'svg' },
					],
				},
				combat_encounters: {
					name: 'Combat encounters',
					items: [
						{ lat: -172, lng: 265.75, label: 'Wolves', type: 'place', icon: 'poiCombat', iconType: 'png' },
						{ lat: -104.3125, lng: 68.3125, label: 'Wolves', type: 'place', icon: 'poiCombat', iconType: 'png' },
						{
							lat: -82.25,
							lng: 72.75,
							label: 'Bandits',
							type: 'people',
							icon: 'poiCombat',
							iconType: 'png',
							mapLink: 'world_maps.main_map_01.submaps.encounters.main_map_encounters_bandits_01',
						},
						{
							lat: -116.25,
							lng: 48.5,
							label: 'Goblin camp',
							type: 'place',
							icon: 'poiCombat',
							iconType: 'png',
							description: `The adventurers, hoping to make a new ally, approached the lizardman with friendly intentions. However, their efforts were met with hostility as the lizardman attacked them. The battle was intense, with the group struggling to subdue their reptilian foe. Just as they seemed to gain the upper hand, a group of goblins ambushed them from the shadows. The adventurers fought valiantly, managing to defeat the goblins, but in the chaos, one of the goblins used a spell to explode nearby corpses, which killed the lizardman, whom they had been trying to keep alive.`,
							image: 'goblin_camp_01.png',
						},
					],
				},
			},
			paths: [
				{
					name: 'Session 1 Recap',
					lineColor: '#F15B50',
					points: [
						{ coordinates: [-134.125, 5.625] },
						{ coordinates: [-133.125, 34.75] },
						{
							coordinates: [-139.625, 42.875],
							text: "Reached Lombart farm and talked to its master. Learned the cost of entry into the city and were told to do deeds to gain money for it. Talked to the lead farmer's wife and got a task from her.",
						},
						{
							coordinates: [-129.84, 63.5],
							text: "Down the road, we met a merchant which sold us entry to the city for a favour once inside. Also got a pan for the lead farmer's wife as part of her task.",
						},
						{
							coordinates: [-150.75, 61.5],
							text: "We went back to the farmer's wife and gave her the pan. She gave us food to eat. After that, we talked to the lead farmer again and slept in the barn.",
						},
						{ coordinates: [-133.375, 69.125] },
						{
							coordinates: [-132.75, 90.125],
							text: 'Talked to the guards and showed them our entry pass. They allowed us into the city.',
						},
						{
							coordinates: [-132.5, 106.75],
							text: 'Talked to the master paladin guarding the door and learned of the city rules and some whereabouts of the locations we were interested in.',
						},
						{ coordinates: [-127.25, 117.125] },
						{ coordinates: [-127.75, 129.875] },
						{ coordinates: [-140.875, 144.375] },
						{ coordinates: [-140.75, 152.25] },
						{ coordinates: [-134.375, 158.25] },
						{ coordinates: [-128.375, 159.75] },
						{ coordinates: [-126.75, 164.375] },
						{
							coordinates: [-130.875, 167.625],
							text: 'Walked into the inn and slept. During the night, some of the gold and some of our belongings were stolen.',
						},
					],
				},
				{
					name: 'Session 3 Recap',
					lineColor: '#2898BD',
					points: [
						{
							coordinates: [-137.75, 172.5],
							text: 'Woken up, the party decided to go into the woods and gather the plants that were requested by the alchemist.',
						},
						{
							coordinates: [-130.25, 166.5],
						},
						{
							coordinates: [-124.4375, 177.0625],
						},
						{
							coordinates: [-131.5, 189.625],
						},
						{
							coordinates: [-132.9375, 210.4375],
							text: 'On the way out of the city, guards stopped them and asked them what they were doing. Upon learning they were headed into the forest, the guards wished them good luck.',
						},
						{
							coordinates: [-133.1875, 302.875],
						},
						{
							coordinates: [-133, 218.75],
						},
						{
							coordinates: [-136.6875, 221.4375],
							text: 'The party ventured into the forest down this path.',
						},
						{
							coordinates: [-137.9375, 235.5],
						},
						{
							coordinates: [-143.8125, 240.4375],
						},
						{
							coordinates: [-152.3125, 242.75],
						},
						{
							coordinates: [-159.6875, 239.375],
						},
						{
							coordinates: [-164.125, 231.9375],
						},
						{
							coordinates: [-171.9375, 229.4375],
						},
						{
							coordinates: [-180.75, 231.5625],
						},
						{
							coordinates: [-186.4375, 242.3125],
						},
						{
							coordinates: [-185.3125, 252.9375],
						},
						{
							coordinates: [-181.125, 262.3125],
						},
						{
							coordinates: [-172, 265.75],
							text: 'They attacked a pack of wolves which were roaming around in the forest. The battle was fierce, but they were victorious. They managed to find hides, which would prove useful to gain apprenticeship.',
						},
						{
							coordinates: [-183.5625, 268.125],
						},
						{
							coordinates: [-190.3125, 274.125],
						},
						{
							coordinates: [-198.75, 282.25],
							text: 'Entering the nearby caves, they saw what looked like blue blood - lizardmen blood, and a few creatures which looked way too powerful for them to handle.',
						},
						{
							coordinates: [-174.3125, 285.375],
						},
						{
							coordinates: [-139.65625, 302.75],
							text: 'Near the bridge, they met Erol, who had been robbed by the bandits on the bridge nearby. He had a broken leg, which the party Cleric mended.',
						},
						{
							coordinates: [-133.125, 299.9375],
						},
						{
							coordinates: [-132.8125, 330.75],
						},
						{
							coordinates: [-126.3125, 337.6875],
							text: "At the crossroads, they took a left turn to go towards the Fire Mages Monastery, in order to seek a Fire Mage's blessing.",
						},
						{
							coordinates: [-100.5625, 338],
						},
						{
							coordinates: [-81.625, 335.25],
						},
						{
							coordinates: [-81.4375, 325.25],
						},
						{
							coordinates: [-83.3125, 315.9375],
							text: 'They saw Isgaroth, a Fire Mage, who was doing a prayer. They waited for two hours for the prayer to finish and after that they received the Fire Mage blessing for free, as they had made the trip to the Monastery.',
						},
						{
							coordinates: [-81.03125, 314.78125],
						},
						{
							coordinates: [-82.3125, 315.4375],
						},
						{
							coordinates: [-81.03125, 314.78125],
						},
						{
							coordinates: [-83.3125, 315.9375],
						},
						{
							coordinates: [-81.4375, 325.25],
						},
						{
							coordinates: [-81.625, 335.25],
						},
						{
							coordinates: [-100.5625, 338],
						},
						{
							coordinates: [-126.3125, 337.6875],
						},
						{
							coordinates: [-132.8125, 330.75],
						},
						{
							coordinates: [-140.09375, 339.4375],
						},
						{
							coordinates: [-146.75, 342.5],
							text: 'The party checked out the inn at the crossroads, looking for a place to spend the night in, but the prices were too steep for them, so they went back in town.',
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
									{ lat: -200, lng: 498, label: "Bandits' hideout", type: 'place', icon: 'arrowDown', iconType: 'svg' },
								],
							},
						},
					},
				},
			},
		},
	},
};
