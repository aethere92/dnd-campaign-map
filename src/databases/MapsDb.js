const MAP_DATABASE = {
	world_maps: {
		main_map_01: {
			metadata: {
				path: 'maps/world_maps/main_map_01',
				sizes: {
					maxZoom: 6,
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
							lat: -57.34375,
							lng: 91.5,
							label: 'Darren (Fire mage)',
							type: 'people',
							icon: 'poiGenericNPC',
							iconType: 'png',
						},
						{
							lat: -75.421875,
							lng: 74.96875,
							label: 'Constantine (Water mage)',
							type: 'people',
							icon: 'poiGenericNPC',
							iconType: 'png',
						},
						{
							lat: -69.65625,
							lng: 151.71875,
							label: 'Erol (tablets)',
							type: 'place',
							icon: 'poiGenericNPC',
							iconType: 'png',
						},
						{
							lat: -41.09375,
							lng: 156.734375,
							label: 'Isgaroth (Fire mage)',
							type: 'people',
							icon: 'poiGenericNPC',
							iconType: 'png',
						},
						{
							lat: -75.75,
							lng: 62.71875,
							label: 'Bosper (Hunter)',
							type: 'people',
							icon: 'tradeHunter',
							iconType: 'png',
						},
						{
							lat: -70.71875,
							lng: 67.15625,
							label: 'Thorben (Alchemist)',
							type: 'people',
							icon: 'tradeAlchemy',
							iconType: 'png',
						},
						{
							lat: -54.625,
							lng: 72.5625,
							label: 'Thoren (Blacksmith)',
							type: 'people',
							icon: 'tradeForge',
							iconType: 'png',
							mapLink: 'world_maps.main_map_01.submaps.interiors.main_map_interior_blacksmith',
						},
						{
							lat: -48.25,
							lng: 18.25,
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
							lat: -69.375,
							lng: 86.375,
							label: 'Inn',
							type: 'place',
							icon: 'poiBed',
							iconType: 'png',
							mapLink: 'world_maps.main_map_01.submaps.interiors.main_map_interior_town_inn',
						},
						{ lat: -73.125, lng: 171.375, label: 'Inn', type: 'place', icon: 'poiBed', iconType: 'png' },
						{
							lat: -39.875,
							lng: 62,
							label: 'Harbour Inn',
							type: 'place',
							icon: 'poiBed',
							iconType: 'png',
							image: 'harbour_inn.png',
							mapLink: 'world_maps.main_map_01.submaps.interiors.main_map_interior_harbour_inn',
						},
						{ lat: -48.125, lng: 88.875, label: 'Paladin Barracks', type: 'place', icon: 'city', iconType: 'png' },
						{
							lat: -23.3125,
							lng: 163.6875,
							label: 'Fire Mages Monastery',
							type: 'place',
							icon: 'templeCathedral',
							iconType: 'png',
						},
						{ lat: -53.65625, lng: 51.4375, label: 'Pawn shop', type: 'place', icon: 'tradeShop', iconType: 'png' },
						{ lat: -56.625, lng: 126.625, label: 'Sefob Farm', type: 'place', icon: 'poiFarm', iconType: 'png' },
						{
							lat: -71.875,
							lng: 17.375,
							label: 'Lobart Farm',
							type: 'place',
							icon: 'poiFarm',
							iconType: 'png',
							description:
								"The adventurers arrived at a farm on the outskirts of the city, seeking entry but lacking the necessary gold. Speaking with one of the farmers, they learned that the head farmer might offer them a way in. They approached him and were given a proposition: earn gold by helping with the crops and assisting the farmer's wife with her tasks.",
						},
						{
							lat: -99.25,
							lng: 140.5,
							label: 'Caves (scales + blue blood)',
							type: 'place',
							icon: 'poiCave',
							iconType: 'png',
						},
						{ lat: -11.5, lng: 39.5, label: 'Paladin ship', type: 'place', icon: 'city' },
					],
				},
				navigation: {
					name: 'Navigation arrows',
					items: [
						{
							lat: -25.375,
							lng: 184.5,
							label: 'To Hunter Camp',
							type: 'place',
							icon: 'arrowUpRight',
							iconType: 'svg',
						},
						{ lat: -66.625, lng: 198, label: 'To Mercenaries', type: 'place', icon: 'arrowRight', iconType: 'svg' },
						{ lat: -99, lng: 182.625, label: 'To Penal Colony', type: 'place', icon: 'arrowDown', iconType: 'svg' },
					],
				},
				combat_encounters: {
					name: 'Combat encounters',
					items: [
						{ lat: -52.375, lng: 33.875, label: 'Wolves', type: 'place', icon: 'poiCombat', iconType: 'png' },
						{ lat: -88.125, lng: 133.125, label: 'Wolves', type: 'place', icon: 'poiCombat', iconType: 'png' },
						{
							lat: -41.5,
							lng: 36.78125,
							label: 'Bandits',
							type: 'people',
							icon: 'poiCombat',
							iconType: 'png',
							mapLink: 'world_maps.main_map_01.submaps.encounters.main_map_encounters_bandits_01',
						},
						{
							lat: -57.75,
							lng: 25.125,
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
					lineColor: '#E2B203',
					points: [
						{
							coordinates: [-66.9375, 2.625],
						},
						{
							coordinates: [-66.5625, 16.1875],
						},
						{
							coordinates: [-70.875, 20.625],
							text: "Reached Lombart farm and talked to its master. Learned the cost of entry into the city and were told to do deeds to gain money for it. Talked to the lead farmer's wife and got a task from her.",
						},
						{
							coordinates: [-66.5, 23.3125],
						},
						{
							coordinates: [-65.0625, 31],
							text: "Down the road, we met a merchant which sold us entry to the city for a favour once inside. Also got a pan for the lead farmer's wife as part of her task.",
						},
						{
							coordinates: [-77.1875, 30.8125],
							text: "We went back to the farmer's wife and gave her the pan. She gave us food to eat. After that, we talked to the lead farmer again and slept in the barn.",
						},
						{
							coordinates: [-66.9375, 36.4375],
						},
						{
							coordinates: [-66.5, 45.4375],
							text: 'Talked to the guards and showed them our entry pass. They allowed us into the city.',
						},
						{
							coordinates: [-66.25, 53.5625],
							text: 'Talked to the master paladin guarding the door and learned of the city rules and some whereabouts of the locations we were interested in.',
						},
						{
							coordinates: [-66.125, 56.125],
						},
						{
							coordinates: [-67.75, 57.5625],
						},
						{
							coordinates: [-67.625, 58.9375],
						},
						{
							coordinates: [-66.125, 60.0625],
						},
						{
							coordinates: [-65.9375, 67.375],
						},
						{
							coordinates: [-66, 76.6875],
						},
						{
							coordinates: [-65.875, 83.3125],
						},
						{
							coordinates: [-69.375, 86.375],
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
