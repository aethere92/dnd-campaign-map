const CAMPAIGN_002_API_DATA = {
	location: {
		Feywilds: {
			name: 'The Feywild',
			metadata: {
				Natives: 'Eladrin, elves, fey, fomorians, goblins',
				Type: 'Dimensional plane',
			},
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
			description: `At the spot where the Dawn Way crosses the River Elsir stands the small town of Drellin's Ferry, once known as Dwarfbridge. As the old name implies, long ago the Elsir was spanned by a sturdy dwarf-made bridge at this spot, but a hundred years ago the bridge washed out in a great flood. An enterprising man named Drellin hammered together a small horse-drawn ferry to maintain a river crossing here, and a town eventually grew up around the enterprise.`,
			metadata: {
				Population: '1,150',
				Races: 'Mixed (humans, halfling, dwarf)',
				Ruler: 'Norro Wiston',
			},
		},
		Brindol: {
			name: 'Brindol',
			description:
				"Brindol is a small city in the heart of Elsir Vale. One of the largest settlements in the Vale, Brindol is a prosperous farming community and caravan stopover located along the Dawn Way on the south bank of the Elsir River. Orchards of apple and pear trees follow the river's winding shores, while broad grain fields and farmlands surround the town for miles in all directions. Brindol is the home of Lord Aaron Jarmaath. His small keep and the city walls are the only fortifications of note this side of Dennovar (city 100 miles to east).",
			metadata: {
				Population: '6,700',
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
		Neverwinter: {
			name: 'Neverwinter',
			description:
				'Major city targeted in visions by a unified enemy force including Red Wizards of Thay, Arcane Brotherhood mages, and chromatic dragons. The siege involves mass sacrifice rituals to destroy the city walls.',
		},
		Pelagos: {
			name: 'Pelagos',
			description:
				"Bianca's homeland on the continent of Lustria; torn by civil war and usurped by the necromancer Sandro who murdered her father and seized the throne.",
		},
		Lustria: {
			name: 'Lustria',
			description: 'Continent where Pelagos is located; origin of the Arcane Brotherhood.',
		},
		'Elsir Vale': {
			name: 'Elsir Vale',
			description: "Region containing Drellin's Ferry and Brindol; connected by the Dawn Way road system.",
		},
		Witchwood: {
			name: 'The Witchwood',
			description: `Generally held to be haunted by the restless spirits of the ancient human druidic folk who once dwelt here, the Witchwood is a lush, wet woodland interspersed with swampy stretches in the vicinity of the larger rivers. The Witchwood is a warm forest with a mix of oaks, subtropical evergreens, and plenty of undergrowth. Any party cutting cross-country through the forest without following a trail stands an excellent chance of getting very lost. Location of missing barbarian scouts and enemy activity.`,
		},
		'Green Apple Inn': {
			name: 'The Green Apple Inn',
			description: `One of the inns in Drellin's Ferry, where the party currently resides. Run by Tharma, the dwarven innkeeper.`,
		},
		'Shrine of Pelor': {
			name: 'Shrine of Pelor',
			description:
				"Religious site in Drellin's Ferry where offerings are made and guidance is sought. Overseen by Brother Denny.",
		},
		"Sertieren's Manor": {
			name: "Sertieren's Manor",
			description:
				"Magical residence of the local wizard in Drellin's Ferry. Features a magical speaking fountain and halfling servant.",
		},
		'Wrath Keep': {
			name: 'Wrath Keep',
			description: 'Cursed fortress deep in the Witchwood containing undead.',
		},
		Ramashen: {
			name: 'Ramashen',
			description: 'Druidic location capable of returning creatures to the Feywild.',
		},
		"Avarthel's Grove": {
			name: "Avarthel's Grove",
			description:
				"Magical grove near the Feywild; healing site and refuge near Drellin's Ferry. Home to the phoenix Loïc and protected by a snake guardian.",
		},
		"Leviathan's Hall": {
			name: "Leviathan's Hall",
			description:
				"Massive black warship with green sails commanded by Captain Bianca Turiados and Commander Turiados. Crewed by a diverse mix including minotaurs, troglodytes, an Efreeti, and other species. The crew is magically bound to Bianca's family by blood oath.",
		},
		'Penal Colony': {
			name: 'Penal Colony',
			description: "Where Bianca's pirate crew were enslaved before being freed by General Lee.",
		},
		'Blighted Fortress': {
			name: 'Blighted Fortress',
			description:
				"Corrupted Paladin stronghold seen in Olek and Norr's vision, overrun by crystalline blight. The fortress commander revealed infiltration by Lamashu's cults after the Battle for Bremen.",
		},
		Bremen: {
			name: 'Bremen',
			description:
				'Site of a key battle that weakened defenses and allowed cult infiltration into paladin orders, leading to widespread corruption.',
		},
	},
	guild: {
		'Arcane Brotherhood': {
			name: 'The Arcane Brotherhood',
			description:
				"The Arcane Brotherhood is a powerful wizards' guild based in the city of Luskan on the Sword Coast North. The organization is known for its ruthlessness and the magical might of its members. The Brotherhood is led by a group of powerful archmages called the Arcane, each controlling one of the Host Towers of the Arcane. The Brotherhood harbors dark secrets and is involved in the unified enemy force threatening the region.",
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
		'House Corzina': {
			name: 'House Corzina',
			description:
				"Drow noble house connected to Jareth and Matron Zaya; operates trade links with Drellin's Ferry, selling healing potions and other goods.",
		},
		'Arcane Seekers': {
			name: 'Arcane Seekers',
			description:
				"Magical faction involved in the temple ritual chamber; linked to the map carried by the party. Their markings were found in Thieves' Cant at the ritual site.",
		},
		'Kryn Dynasty': {
			name: 'Kryn Dynasty',
			description: `The Calamity left northern Xhorhas a burnt and cracked wasteland surrounded by blackened marshland and jagged cliffs, and survival in the valley wasteland was difficult for centuries thereafter. The Kryn Dynasty, founded by drow who had turned from Lolth to a new faith in the Luxon, is the first nation to rise in the region after the end of that period, and though they still contend with not only the scarred landscape but also lingering abominations, they have been able to incorporate diverse humanoids and giants under their banner. The cities of the Dynasty are kept shaded or even in near-perpetual night by powerful dunamancers and other umbral magic, and the capital city of Rosohna sits under constant, sparsely broken cloud cover. Its settlements are connected by dirt roads. Associated with Chronomancers mentioned by Sertieren.`,
			metadata: {
				Base: 'Rosohna, Wildermount',
				Religion: 'The Luxon',
			},
		},
		'Winter Rose': {
			name: 'The Winter Rose',
			description: `The Winter Rose was an adventuring fellowship from Amn, named after the beautiful winter flower – frostrose. It was assembled by a paladin who was guided by his unwavering commitment to justice and duty. The name was inspired by the resilience of a frostrose that kept its petals bright red against all odds and cold of the harsh northern winter. The Winter Rose proclaimed themselves to be defenders of the north. Members include Vandal, Summoner, June Takahashi, and Groomsh of Ka tribe.`,
			metadata: {
				Base: 'Athkatla, Amn - North Faerûn',
				Leader: 'Sirge de La Sunya',
			},
		},
		'Thieves Guild': {
			name: "The Thieves' Guild",
			description: `A thieves' guild was a guild of organized thieves and rogues. Most major cities in Faerûn, and some smaller ones, had one or more thieves' guilds. Some were powerful enough to hold significant political power, which they often obtained through bribery and intimidation. Most local guilds were short-lived groups that revolved around a particular individual. Members of thieves' guild often served one of the following roles, which were divided into divisions in larger guilds: assassins, beggars, bounty hunters, burglars, con artists and tricksters, cutpurses and pickpockets, enforcers and thugs, racketeers, scouts and spies, and fences, smugglers, and pirates. Kat and Yoghurt are former members working with Drellin's Ferry.`,
		},
		'Red Hand': {
			name: 'The Red Hand',
			description:
				'Allied faction in the unified enemy army threatening the region. Their banners were seen in visions of the future alongside the Blue Bear sigil and chromatic dragons.',
		},
		'Broken Shackle Tribe': {
			name: 'Broken Shackle Tribe',
			description:
				'Orc tribe that previously tamed and used Megatherium creatures. Their handlers left two weeks before the party\'s encounter, answering "the call of the Red Hand."',
		},
		'Te Snatchers Clan': {
			name: 'Te Snatchers Clan',
			description:
				'Goblin faction associated with the Arthropleura fersanguinus (giant millipede-like creatures with acidic blood).',
		},
		'Blue Bear': {
			name: 'Blue Bear',
			description:
				'Unifying banner and sigil of the enemy force seen in multiple prophetic visions. Associated with slavers, cultists, chromatic dragons, and the unified army threatening Neverwinter and the Feywild.',
		},
		'Lamashu Cults': {
			name: 'Lamashu Cults',
			description:
				'Demonic cult responsible for infiltrating paladin orders after the Battle for Bremen. Their corruption is marked by black-veined mutations and spreads through weakened organizations.',
		},
		'Red Wizards of Thay': {
			name: 'Red Wizards of Thay',
			description:
				"Powerful magical organization leading the siege of Neverwinter in visions. They use mass sacrifice rituals powered by prisoners' life force to fuel devastating spells.",
		},
		'Crazy Hogs': {
			name: 'Crazy Hogs',
			description:
				'Adventuring party once led by Sertieren and Kalistra before Kalistra joined the Arcane Brotherhood.',
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
			description: `Tracing their ancestry to the genies of the Elemental Planes, each genasi can tap into the power of one of the elements. Air, earth, fire, and water - these are the four pillars of the Material Plane and the four types of genasi. Some genasi are direct descendants of a genie, while others were born to non-genasi parents who lived near a place suffused by a genie's magic. A typical genasi has a life span of 120 years.`,
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
	npc: {
		Zella: {
			name: 'Zella',
			affinity: 'Arcane Brotherhood',
			class: 'Sorcerer',
			role: 'Mentor',
			description:
				'Powerful sorcerer who met Norr on a rain-soaked night while being attacked by bandits. Acting as mentor to Norr, she was the one who taught her everything she knows and sent her to the Arcane Brotherhood.',
		},
		Thalos: {
			name: 'Thalos',
			affinity: 'Earth Genasi',
			class: 'N/A',
			role: 'Missing Friend',
			description: `Kaedin's childhood best friend from a deeply religious Earth Genasi family. Absorbed by an ancient monolith of pure energy after stepping on a pressure plate in a tunnel, he was deemed lost forever. He is the reason Kaedin is who he is today and the person whom he searches for. Only his traditional garb was left behind, which Kaedin now wears in his memory.`,
		},
		Clyde: {
			name: 'Clyde',
			affinity: 'Feywilds | Quicklings',
			class: 'N/A',
			role: 'Friend',
			description: `Bonnie's best friend in the Feywilds. After being captured in one of their endeavors alongside Bonnie, Clyde was sentenced to death and only saved through Bonnie's sacrifice - she chose banishment from the Feywilds to spare Clyde.`,
		},
		Jacques: {
			name: 'Jacques',
			affinity: 'Bonnie | Rats',
			class: 'N/A',
			role: "Bonnie's companion",
			description:
				"An antlered giant rat, he is Bonnie's companion and the closest she has to a family. He is smaller in the Material Plane than he was in the Feywild.",
		},
		'Wyrmlord Koth': {
			name: 'Wyrmlord Koth',
			affinity: 'Hobgoblins',
			class: 'Sorcerer',
			role: 'Hobgoblins Captain',
			description: `Initially thought to be a hobgoblin warlord, but later revealed to be only a captain, he's one of the main antagonists gathering the hobgoblin forces for the "Day of Ruin". Information about him was discovered by interrogating a captured hobgoblin at the battle before Drellin's Ferry.`,
		},
		Soranna: {
			name: 'Soranna Anitah',
			affinity: "Drellin's Ferry",
			class: 'N/A',
			role: 'Leader of the Town Guard',
			description: `Leader of the Town Guard, captain of the militia, and chief constable, Soranna is a tall, strong-boned woman with simple good looks hidden behind an unsmiling manner. As leader of the town's guardsmen, Soranna holds a seat on the council. She coordinates town defense and assigns missions to the party.`,
		},
		'Sergeant Hersk': {
			name: 'Sergeant Hersk',
			affinity: "Drellin's Ferry",
			class: 'N/A',
			role: 'Town guard sergeant',
			description: "Town guard in Drellin's Ferry who briefs the party on local dangers upon their arrival.",
		},
		'Brother Denny': {
			name: 'Brother Denny',
			affinity: 'Shrine of Pelor',
			class: 'Cleric',
			role: 'Priest',
			description:
				"Priest at the Shrine of Pelor in Drellin's Ferry. Accepts offerings and attempts to sell wares. Unhelpful when Norr sought assistance with Thylacoleo cubs.",
		},
		Sertieren: {
			name: 'Sertieren',
			affinity: "Drellin's Ferry",
			class: 'Wizard',
			role: 'Local wizard',
			description:
				"Local wizard in Drellin's Ferry; shares rumors about Chronomancers of Kryn and magical threats. Former companion of Kalistra in the Crazy Hogs adventuring party. Provides containment spheres for magical creatures and identifies potions. Warned that recent events portend a coming storm and intends to leave Drellin's Ferry soon.",
		},
		'Nels Huto': {
			name: 'Nels Huto',
			affinity: 'Witchwood',
			class: 'Necromancer',
			role: "Keeper of Dead Man's Boots",
			description: "Necromancer who last held the item Dead Man's Boots; heading into the Witchwood.",
		},
		'Rilon Paln': {
			name: 'Rilon Paln',
			affinity: 'N/A',
			class: 'N/A',
			role: 'Artifact source',
			description: 'Source of the artifact delivered by Bonnie to Soranna.',
		},
		Anya: {
			name: 'Anya',
			affinity: "Drellin's Ferry",
			class: 'N/A',
			role: 'Barmaid',
			description: `Described as 1.8m, redheaded and freckled, Anya worked as a barmaid at the Green Apple Inn until she was found weak, bleeding, delirious, and pregnant. She was taken into the druid Avarthel's care at his grove to give birth and mend her physical and mental injuries. Healed by the phoenix Loïc's tears.`,
		},
		Lem: {
			name: 'Lem',
			affinity: "Drellin's Ferry",
			class: 'N/A',
			role: 'Town guard',
			description: `Anya's love interest, described as a pudgy, short (1.5m) human who works as a Town guard. He got injured in one of the Warg raids. He had a casual relationship with Anya but was unaware of her pregnancy.`,
		},
		Kat: {
			name: 'Kat',
			affinity: "Drellin's Ferry | Thieves Guild",
			class: 'Trickster',
			role: 'Town agent',
			description: `Tiefling thief who loves cats. Has magical globes containing cats and a tiger. Works with Yoghurt as an agent for Drellin's Ferry, helping investigate the cave system beneath the town. Former Thieves Guild member.`,
		},
		Yoghurt: {
			name: 'Yoghurt',
			affinity: "Drellin's Ferry | Thieves Guild",
			class: 'Assassin',
			role: 'Town agent',
			description: `Half-ogre ninja assassin who is lactose intolerant. Works with Kat as an agent for Drellin's Ferry. Former Thieves Guild member. Delivered Bonnie's warning letter to Soranna and eliminated infiltrators near the ruined fortress.`,
		},
		Avarthel: {
			name: 'Avarthel',
			affinity: "Drellin's Ferry | Circle of the Land",
			class: 'Druid',
			role: 'Healer',
			description: `Druid and healer who maintains a grove near the Feywild. Refused to hatch hydra eggs citing ecological danger and agreed to store them securely, noting only druids in Ramashen could return them to the Feywild. Provided tactical advice about distracting thylacoleos with honey. Took Anya into his care for long-term recovery. Was away from his grove for months when the party returned with Thylacoleo cubs.`,
		},
		Loic: {
			name: 'Loic',
			affinity: "Avarthel's Grove",
			class: 'Phoenix',
			role: 'Healer',
			description: "Phoenix residing in Avarthel's Grove; healed Anya with tears.",
		},
		Vandal: {
			name: 'Vandal',
			affinity: 'The Winter Rose',
			class: 'N/A',
			role: 'Mercenary',
			description: `Winter Rose mercenary who shared tactical information with the party. Survived the temple expedition and was attacked by drunk townsfolk at the Green Apple Inn. Warned the party about undead pirates after being stranded on the coast.`,
		},
		Summoner: {
			name: 'Summoner',
			affinity: 'The Winter Rose',
			class: 'Spellcaster',
			role: 'Mercenary',
			description: `Winter Rose mercenary and spellcaster who coordinated with the party during the temple expedition. Used magical dolphins to rescue survivors after the pirate ship emerged from the mountain waterfall.`,
		},
		'June Takahashi': {
			name: 'June Takahashi',
			affinity: 'The Winter Rose',
			class: 'Spellcaster',
			role: 'Mercenary',
			description:
				'Winter Rose spellcaster who shares intel with Kaedin; can detect magic or abilities within 60 feet.',
		},
		'Groomsh of Ka': {
			name: 'Groomsh of Ka',
			affinity: 'The Winter Rose',
			class: 'N/A',
			role: 'Mercenary',
			description: 'Member of the Winter Rose mercenary company.',
		},
		Jareth: {
			name: 'Jareth',
			affinity: "Drellin's Ferry | House Corzina",
			class: 'N/A',
			role: 'Merchant',
			description: `Muscular drow merchant from House Corzina. Sells healing potions while nearly nude and cloaked in illusion magic.`,
		},
		Zaya: {
			name: 'Zaya',
			affinity: 'House Corzina',
			class: 'N/A',
			role: 'Matron',
			description: "Matron of House Corzina; sent Jareth to Drellin's Ferry.",
		},
		Norro: {
			name: 'Norro Wiston',
			affinity: "Drellin's Ferry",
			class: 'N/A',
			role: 'Town counselor/elder',
			description:
				'Town counselor and administrator who provided a discount note for the armorer. Discussed town threats and the Day of Ruin with the party at the Tollhouse.',
		},
		Palo: {
			name: 'Palo',
			affinity: 'Olek',
			class: 'Magical Cat',
			role: 'Companion',
			description:
				"Olek's magical feline companion; caused havoc in the inn's kitchen by consuming stew, milk, and honey. Initially trapped in a magical sphere by a dragonkin during battle but was freed by Olek. Returns to his master after the Null Brand explosion.",
		},
		'Captain Bianca Turiados': {
			name: 'Captain Bianca Turiados',
			affinity: "Leviathan's Hall",
			class: 'N/A',
			role: 'Pirate queen and commander',
			description:
				"Fey-touched pirate queen and exiled monarch of Pelagos; commands the Leviathan's Hall. Wields Winder, a storm-forged glass blade stolen from the Brotherhood. Her father was murdered by the necromancer Sandro who usurped her throne. The crew is magically bound to her family by blood oath. Demanded a 20% rescue fee from the party and confiscated their valuables.",
		},
		'Commander Turiados': {
			name: 'Commander Turiados',
			affinity: "Leviathan's Hall",
			class: 'Ex-Paladin',
			role: 'Pirate commander',
			description:
				"Former paladin, now pirate commander; seeks vengeance against Sandro. Towering, tattooed warrior with Sahuagin ritual markings. Wields the Breaker of Hulls cutlass (a Brotherhood relic). Owns a magical compass that points to one's greatest desire. Offered to trade the compass for a locket of hair from Sandro.",
		},
		'Marise Curs': {
			name: 'Marise Curs',
			affinity: "Leviathan's Hall",
			class: 'Pirate',
			role: 'Crewman',
			description: 'Peg-legged pirate with a living mug; shares history of the crew and General Lee with Bonnie.',
		},
		'General Lee': {
			name: 'General Lee',
			affinity: 'N/A',
			class: 'Commander',
			role: 'Liberator',
			description:
				"Former convict and commander who freed Bianca's pirate crew from a penal colony. Died, after which Bianca took control of the ship.",
		},
		'Bardin Cratcho': {
			name: 'Bardin Cratcho',
			affinity: "Leviathan's Hall",
			class: 'Dwarf Rune-Forger',
			role: 'Forge-master',
			description:
				"Augmented dwarf rune-forger working with an Efreeti in the Leviathan's Hall forge. Offered to inscribe weapon runes for 50 gold.",
		},
		Scoundrel: {
			name: 'Scoundrel',
			affinity: 'Winter Rose',
			class: 'Mercenary',
			role: 'Companion',
			description:
				'Mercenary companion of Vandal; stranded with the party on the coast after being cast adrift by the pirates.',
		},
		Gică: {
			name: 'Gică',
			affinity: 'N/A',
			class: 'Megatherium',
			role: 'Ally',
			description:
				'Megatherium befriended by Bonnie; helps the party navigate caves. Roughly 8 feet tall, prehistoric sloth-bear-like creature resistant to fear/stun, primarily herbivorous but drawn to insect prey. Bears Broken Shackle Tribe markings.',
		},
		Mișu: {
			name: 'Mișu',
			affinity: 'N/A',
			class: 'Megatherium',
			role: 'Ally',
			description:
				'Second Megatherium befriended by Bonnie; joins combat as an ally. Gained combat buff (double speed, bonus attacks) after killing an Arthropleura. Bears Broken Shackle Tribe markings.',
		},
		Tharma: {
			name: 'Tharma',
			affinity: "Drellin's Ferry",
			class: 'N/A',
			role: 'Innkeeper',
			description: `Dwarven innkeeper at the Green Apple Inn. Lover of novels; gifted Soshi a romance novel. Serves food and reacts to chaos caused by the party's magical cats. Waived room fees in gratitude for the party's service. Later demanded 5 silver per night from Kaedin for damages to his room.`,
		},
		Kalistra: {
			name: 'Kalistra',
			affinity: 'Arcane Brotherhood',
			class: 'Alteration Specialist',
			role: 'Former teacher',
			description:
				"Former teacher of Norr from the Arcane Brotherhood; known for 'mind spiking' students. Left the Brotherhood 10 years prior. Former member of the Crazy Hogs adventuring party with Sertieren. Found bound to the Null Brand in the temple vault, using her life to contain the artifact's corruption. Authored a ledger detailing demon disciples' experiments, arena trials, and plans for the Festival of Life. Killed during the ritual destabilization.",
		},
		Kilgor: {
			name: 'Kilgor',
			affinity: 'N/A',
			class: 'N/A',
			role: 'Antagonist',
			description:
				"Mysterious figure collecting combatants for the Festival of Life; suspected of sending harpy spies. Seen in Bonnie's vision wielding energy spears against Titania and the Queen of Air and Darkness, seizing their crowns and causing the withering of the Feywild.",
		},
		Sandro: {
			name: 'Sandro',
			affinity: 'Pelagos',
			class: 'Necromancer',
			role: 'Usurper',
			description:
				"Necromancer who murdered Bianca's father and usurped the throne of Pelagos. Target of Commander Turiados's vengeance. The party was tasked with bringing a locket of his hair in exchange for Turiados's magical compass.",
		},
		Titania: {
			name: 'Titania',
			affinity: 'Feywild',
			class: 'Fey Queen',
			role: 'Ruler',
			description:
				"Queen of the Summer Court who sentenced Clyde to execution before Bonnie's intervention. Seen in Bonnie's vision fighting alongside the Queen of Air and Darkness against Kilgor before losing her crown.",
		},
		'Queen of Air and Darkness': {
			name: 'Queen of Air and Darkness',
			affinity: 'Feywild',
			class: 'Fey Queen',
			role: 'Ruler',
			description:
				"Winter Queen of the Feywild. Seen in Bonnie's vision fighting alongside Titania against Kilgor before losing her crown.",
		},
		'Verenn Yorr': {
			name: 'Verenn Yorr',
			affinity: 'Exiles',
			class: 'Mage',
			role: 'Mentor',
			description:
				'Wizened mage living among exiles in shadowy tunnels who helped Kaedin master his Echo Knight abilities and trained him in combat.',
		},
		Kresimir: {
			name: 'Kresimir',
			affinity: 'Angevin',
			class: 'God',
			role: 'Deity',
			description: "Resurrected god leading the Angevin fleet in Olek's vision, attacking the paladin fortress.",
		},
	},
	spell: DND_SPELL_DB,
	events: {
		'Prophetic Visions': {
			name: 'Prophetic Visions',
			description:
				"After the Null Brand explosion, each party member experienced individual visions of a ruined future showing the consequences of the unified enemy army's rise.",
		},
		'Day of Ruin': {
			name: 'Day of Ruin',
			description:
				"Mysterious plan involving tribal raids and destruction led by Wyrmlord Koth. The hobgoblin army is estimated to arrive at Drellin's Ferry in approximately 4 days, with forces roughly 19x greater than previous engagements.",
		},
		'Festival of Life': {
			name: 'Festival of Life',
			description:
				'Event mentioned in Kalistra\'s ledger where Kilgor was collecting arena combatants. All combatants had completed "arena trials."',
		},
		'Battle for Bremen': {
			name: 'Battle for Bremen',
			description:
				'Key historical battle that weakened defenses and allowed Lamashu cult infiltration into paladin orders, leading to widespread corruption.',
		},
		'Angevin Fleet': {
			name: 'Angevin Fleet',
			description:
				"Military force led by the resurrected god Kresimir. Attacked the paladin fortress in Olek's vision.",
		},
	},
};
