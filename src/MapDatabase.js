// Map Database Configuration
const MAP_DATABASE = {
	main: {
		path: 'maps/main',
		sizes: {
			maxZoom: 5,
			imageWidth: 13568,
			imageHeight: 7168,
		},
		backgroundColor: '#e7dabb',
		annotations: {
			'Friendly NPCs': [
				{ lat: -118.21875, lng: 189.59375, label: 'Darren (Fire mage)', type: 'people', icon: 'poiGenericNPC', iconType: 'png' },
				{ lat: -149.65625, lng: 134.875, label: 'Constantine (Water mage)', type: 'people', icon: 'poiGenericNPC', iconType: 'png' },
				{ lat: -139.65625, lng: 302.75, label: 'Erol (tablets)', type: 'place', icon: 'poiGenericNPC', iconType: 'png' },
				{ lat: -81.03125, lng: 314.78125, label: 'Isgaroth (Fire mage)', type: 'people', icon: 'poiGenericNPC', iconType: 'png' },
				{ lat: -137.09375, lng: 117.9375, label: 'Bosper (Hunter)', type: 'people', icon: 'tradeHunter', iconType: 'png' },
				{ lat: -146.5, lng: 126.0625, label: 'Thorben (Alchemist)', type: 'people', icon: 'tradeAlchemy', iconType: 'png' },
				{ lat: -110.5, lng: 135, label: 'Thoren (Blacksmith)', type: 'people', icon: 'tradeForge', iconType: 'png', mapLink: 'main_town_blacksmith' },
			],
			'Enemy NPCs': [{ lat: -95.65625, lng: 35.875, label: 'Lizardman', type: 'people', icon: 'cityLizard', iconType: 'png' }],
			'Combat locations': [
				{ lat: -172, lng: 265.75, label: 'Wolves', type: 'place', icon: 'poiCombat', iconType: 'png' },
				{ lat: -104.3125, lng: 68.3125, label: 'Wolves', type: 'place', icon: 'poiCombat', iconType: 'png' },
				{ lat: -82.25, lng: 72.75, label: 'Bandits', type: 'people', icon: 'poiCombat', iconType: 'png', mapLink: 'bandits_01' },
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
			'Navigation arrows': [
				{ lat: -48.53125, lng: 369.65625, label: 'To Hunter Camp', type: 'place', icon: 'arrowUpRight', iconType: 'svg' },
				{ lat: -129.25, lng: 415.5, label: 'To Mercenaries', type: 'place', icon: 'arrowRight', iconType: 'svg' },
				{ lat: -202.5, lng: 365.75, label: 'To Penal Colony', type: 'place', icon: 'arrowDown', iconType: 'svg' },
			],
			'Cardinal points': [],
			'Points of interest': [
				{ lat: -137.75, lng: 172.5, label: 'Inn', type: 'place', icon: 'poiBed', iconType: 'png', mapLink: 'main_town_inn' },
				{ lat: -146.75, lng: 342.5, label: 'Inn', type: 'place', icon: 'poiBed', iconType: 'png' },
				{ lat: -80.25, lng: 121.625, label: 'Harbour Inn', type: 'place', icon: 'poiBed', iconType: 'png', image: 'harbour_inn.png' },
				{ lat: -99, lng: 177, label: 'Paladin Barracks', type: 'place', icon: 'city', iconType: 'png' },
				{ lat: -47.47, lng: 328, label: 'Fire Mages Monastery', type: 'place', icon: 'templeCathedral', iconType: 'png' },
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
				{ lat: -198.75, lng: 282.25, label: 'Caves (scales + blue blood)', type: 'place', icon: 'poiCave', iconType: 'png' },
				{ lat: -24.75, lng: 79.75, label: 'Paladin ship', type: 'place', icon: 'city' },
			],
		},
	},
	bandits_01: {
		path: 'maps/encounters/bandits/01',
		sizes: {
			maxZoom: 3,
			imageWidth: 4864,
			imageHeight: 2048,
		},
		backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
		annotations: {
			'Navigation arrows': [
				{ lat: -200, lng: 82.5, label: 'Towards goblin camp', type: 'place', icon: 'arrowDown', iconType: 'svg' },
				{ lat: -200, lng: 498, label: "Bandits' hideout", type: 'place', icon: 'arrowDown', iconType: 'svg' },
			],
		},
	},
	main_town_inn: {
		path: 'maps/interiors/taverns/main-town-inn',
		sizes: {
			maxZoom: 3,
			imageWidth: 3328,
			imageHeight: 3328,
		},
		backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
	},
	main_town_blacksmith: {
		path: 'maps/interiors/blacksmiths/main-town-blacksmith',
		sizes: {
			maxZoom: 3,
			imageWidth: 3584,
			imageHeight: 2304,
		},
		backgroundColor: 'linear-gradient(0deg, #292315, #0c0805)',
	},
};
