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
					name: 'Session 1 highlights',
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
