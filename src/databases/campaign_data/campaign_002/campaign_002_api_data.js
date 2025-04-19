const CAMPAIGN_02_API_DATA = {
	location: {
		Feywilds: {
			name: 'The Feywild',
			description:
				'Also called the Plane of Faerie, the Feywild is a realm of everlasting twilight, with glittering lights dancing in the air and stunning beauty that can captivate travelers. It exists as an "echo" of the Material Plane, overlapping with the ordinary world but containing magnificent features: towering mountains, breathtaking canyons, and vast seas. The Feywild is inhabited by sylvan creatures such as elves, dryads, satyrs, pixies, and other fey beings.',
		},
		Underdark: {
			name: 'The Underdark',
			description:
				'The Underdark is a vast subterranean realm that exists beneath the surface world. It consists of a network of caves, tunnels, and caverns that stretch for thousands of miles. The Underdark is home to many strange and dangerous creatures, including drow (dark elves), mind flayers, beholders, and other aberrations.',
		},
		"Drellin's Ferry": {
			name: "Drellin's Ferry",
			description: `At the spot where the Dawn Way crosses the River Elsir stands the small town of Drellin\'s Ferry, once known as Dwarfbridge. As the old name implies, long ago the Elsir was spanned by a sturdy dwarf-made bridge at this spot, but a hundred years ago the bridge washed out in a great flood. An enterprising man named Drellin hammered together a small horse-drawn ferry to maintain a river crossing here, and a town eventually grew up around the enterprise.`,
			metadata: {
				Population: '1.150',
				Races: 'Mixed (humans, halfling, dwarf)',
				Ruler: 'Norro Wiston',
			},
		},
		Brindol: {
			name: 'Brindol',
			description:
				"Brindol is a small city in the heart of Elsir Vale. One of the largest settlements in the Vale, Brindol is a prosperous farming community and caravan stopover located along the Dawn Way on the south bank of the Elsir River. Orchards of apple and pear trees follow the river's winding shores, while broad grain fields and farmlands surround the town for miles in all directions. Brindol is the home of Lord Aaron Jarmaath. His small keep and the city walls are the only fortifications of note this side of Dennovar (city 100 miles to east).",
			metadata: {
				Population: '6.700',
				Races: 'Humans, half-elves, dwarves',
				Ruler: 'Lord Jarmaath',
			},
		},
		Luskan: {
			name: 'Luskan',
			description: `Luskan, also known as the City of Sails, was a port city at the mouth of the River Mirar on the Sword Coast North. Luskan, despite the presence of the Ten Towns, was considered by many to be civilization's farthest reach. Although once a bustling city, in the days prior to the Spellplague, the city would suffer greatly at the hands of Arklem Greeth. The resulting disaster would allow the Spellplague to nearly annihilate the city, with it having only a fraction of its former populace.`,
			metadata: {
				Region: 'Sword Coast North, northwest Faerûn',
				Size: 'Large town (1480 DR)',
				Races: 'Mostly humans; drow',
				Imports: 'Silver, scrimshaw, timber, dwarven weapons',
				Exports: 'Netherese artifacts, weapons',
				Type: 'Oligarchy',
				Ruler: 'Jarlaxle Baenre (1489 DR)',
			},
		},
	},
	guild: {
		'Arcane Brotherhood': {
			name: 'The Arcane Brotherhood',
			description:
				"The Arcane Brotherhood is a powerful wizards' guild based in the city of Luskan on the Sword Coast North. The organization is known for its ruthlessness and the magical might of its members. The Brotherhood is led by a group of powerful archmages called the Arcane, each controlling one of the Host Towers of the Arcane.",
			metadata: {
				Base: 'Host Tower of the Arcane, Luskan',
				'Leader(s)': 'Archmage Arcane Cashaan in 1489 DR',
			},
		},
		Harpers: {
			name: 'The Harpers',
			description:
				'The Harpers are a semi-secret organization dedicated to promoting good, preserving history, and maintaining a balance between civilization and nature. They work against tyranny, aided by a network of spies and informants throughout the land.',
		},
	},
	subclass: {
		'Echo Knight': {
			name: 'Echo Knight',
			class: {
				name: 'Fighter',
			},
			description:
				'Echo Knights have mastered the art of summoning duplicates of themselves from alternate timelines to aid them in battle. These echoes can be used to attack foes, scout ahead, or even switch places with the knight. This martial archetype originated in the lands of Wildemount.',
		},
	},
	race: {
		'Earth Genasi': {
			name: 'Earth Genasi',
			description: `Tracing their ancestry to the genies of the Elemental Planes, each genasi can tap into the power of one of the elements. Air, earth, fire, and water — these are the four pillars of the Material Plane and the four types of genasi. Some genasi are direct descendants of a genie, while others were born to non-genasi parents who lived near a place suffused by a genie’s magic. A typical genasi has a life span of 120 years.`,
			metadata: {
				'Ability Score Increase': '2/1 or 1/1/1',
				'Creature Type': 'Humanoid',
				Size: 'Medium or small',
				Speed: '30ft',
				Languages: 'Common + 1 other',
				Traits: 'Earth Walk, Merge with Stone',
			},
		},
	},
};
