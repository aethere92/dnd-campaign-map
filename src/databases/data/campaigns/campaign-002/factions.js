const CAMPAIGN_002_FACTIONS = [
	{
		id: 'arcane-brotherhood',
		name: 'The Arcane Brotherhood',
		description:
			"The Arcane Brotherhood is a powerful wizards' guild based in the city of Luskan on the Sword Coast North. The organization is known for its ruthlessness and the magical might of its members. The Brotherhood is led by a group of powerful archmages called the Arcane, each controlling one of the Host Towers of the Arcane. The Brotherhood harbors dark secrets and is involved in the unified enemy force threatening the region. Soshi and Norr are former members, trained by Calistra. The Brotherhood is actively seeking powerful artifacts, such as the Null Brand, and its operatives (like Calistra) have been found in the region. Stolen relics from the Brotherhood (Breaker of Hulls, Winder) were seen in the possession of the Leviathan's Hall commanders. Visions of the future showed them aiding the siege of Neverwinter.",
		leader: 'Archmage Arcane Cashaan in 1489 DR',
		location: 'Luskan',
		sublocation: 'Host Tower of the Arcane',
		npcs: ['Kalistra', 'Soshi', 'Norr', 'Zella'],
		type: 'Enemy',
		encounters: [
			{
				session: 1,
				description: "Soshi and Norr's background is tied to the Brotherhood, having been trained by Calistra.",
			},
			{
				session: 4,
				description: "Found a ledger signed by Calistra of the Brotherhood, who was Norr's former teacher.",
			},
			{
				session: 5,
				description:
					'Commanders Turiados and Bianca possess stolen Brotherhood relics (Breaker of Hulls and Winder). Bianca identified Soshi as a member.',
			},
			{
				session: 7,
				description:
					'Markings for the Brotherhood were found at a ritual site. Kalistra was found alive, bound to the Null Brand artifact, which she was trying to claim for the Brotherhood.',
			},
			{
				session: 8,
				description:
					'A vision of the future showed the Arcane Brotherhood assisting the siege of Neverwinter. Kalistra was killed when the Null Brand destabilized.',
			},
		],
	},
	{
		id: 'harpers',
		name: 'The Harpers',
		description:
			'The Harpers are a semi-secret organization dedicated to promoting good, preserving history, and maintaining a balance between civilization and nature. They work against tyranny, aided by a network of spies and informants throughout the land.',
		leader: 'The High Harpers',
		location: 'Unknown',
		sublocation: null,
		type: 'Neutral',
	},
	{
		id: 'Kryn-dynasty',
		name: 'Kryn Dynasty',
		description:
			'The Calamity left northern Xhorhas a burnt and cracked wasteland surrounded by blackened marshland and jagged cliffs, and survival in the valley wasteland was difficult for centuries thereafter. The Kryn Dynasty, founded by drow who had turned from Lolth to a new faith in the Luxon, is the first nation to rise in the region after the end of that period, and though they still contend with not only the scarred landscape but also lingering abominations, they have been able to incorporate diverse humanoids and giants under their banner. The cities of the Dynasty are kept shaded or even in near-perpetual night by powerful dunamancers and other umbral magic, and the capital city of Rosohna sits under constant, sparsely broken cloud cover. Its settlements are connected by dirt roads. Associated with Chronomancers mentioned by Sertieren.',
		leader: 'Bright Queen Leylas Kryn',
		location: 'Wildermount',
		sublocation: 'Rosohna',
		type: 'Neutral',
		npcs: [],
		encounters: [
			{
				session: 1,
				description: "Mentioned by the wizard Sertieren, who spoke of 'rumors of the Chronomancers of Krynn'.",
			},
		],
	},
	{
		id: 'winter-rose',
		name: 'The Winter Rose',
		description:
			'The Winter Rose was an adventuring fellowship from Amn, named after the beautiful winter flower frostrose. It was assembled by a paladin who was guided by his unwavering commitment to justice and duty. The name was inspired by the resilience of a frostrose that kept its petals bright red against all odds and cold of the harsh northern winter. The Winter Rose proclaimed themselves to be defenders of the north. Members include Vandal, Summoner, June Takahashi, and Groomsh of Ka tribe. They provided the party with a magical tattoo to call for help  and shared intelligence.',
		leader: 'Sirge de La Sunya',
		location: 'North Faerûn',
		sublocation: 'Athkatla, Amn',
		type: 'Neutral',
		npcs: ['Jun Takashi', 'Vandal', 'Summoner'],
		encounters: [
			{
				session: 2,
				description: 'Met Jun Takashi, who gave Olek a magical tattoo to call for help against a spider demon.',
			},
			{
				session: 3,
				description:
					'Encountered Vandal and Summoner at the inn. They shared intel about a raptor ambush. Later helped the party stop a tavern brawl they were in.',
			},
			{
				session: 4,
				description: 'Traveled with the party through the caves and escaped on the ship.',
			},
			{
				session: 5,
				description: "Were captured by the Leviathan's Hall pirates and later stranded on the beach with the party.",
			},
		],
	},
	{
		id: 'thieves-guild',
		name: "The Thieves' Guild",
		description:
			"A thieves' guild was a guild of organized thieves and rogues. Most major cities in Faerûn, and some smaller ones, had one or more thieves' guilds. Some were powerful enough to hold significant political power, which they often obtained through bribery and intimidation. Most local guilds were short-lived groups that revolved around a particular individual. Members of thieves' guild often served one of the following roles, which were divided into divisions in larger guilds: assassins, beggars, bounty hunters, burglars, con artists and tricksters, cutpurses and pickpockets, enforcers and thugs, racketeers, scouts and spies, and fences, smugglers, and pirates.  Kat (a tiefling) and Yoghurt (a half-ogre) are former members exiled to Drellin's Ferry. They were tasked by Soranna to investigate the cave system. Bonnie is also affiliated, using thieves' cant and contacting acquaintances.",
		type: 'Allied',
		npcs: ['Kat', 'Yoghurt', 'Bonnie'],
		encounters: [
			{
				session: 3,
				description:
					'Met Kat and Yoghurt, exiled guild members. They shared intel on the flooded caves beneath the city.',
			},
			{
				session: 6,
				description: "Bonnie contacted a guild acquaintance to purchase new thieves' tools.",
			},
			{
				session: 8,
				description:
					'Yoghurt reappeared, having followed the party, and was given a letter by Bonnie to deliver to Soranna.',
			},
		],
	},
	{
		id: 'red-hand',
		name: 'The Red Hand (Wyrmlords)',
		description:
			"A hobgoblin army gathering tribes for a 'Day of Ruin', led by figures like Wyrmlord Koth and other 'Wormlords'. They are a major component of the allied horde seen in apocalyptic visions of the future, fighting alongside the Blue Bear clan and chromatic dragons.",
		leader: 'Wyrmlord Koth',
		location: 'Elsir Vale / Witchwood',
		sublocation: null,
		type: 'Enemy',
		npcs: ['Wyrmlord Koth'],
		encounters: [
			{
				session: 1,
				description:
					"Ambushed the party near Drellin's Ferry. A captured hobgoblin mentioned Wyrmlord Koth and a 'Day of Ruin'.",
			},
			{
				session: 6,
				description: "A shaman from the fortress battle shouted to 'Alert the Wormlord!'.",
			},
			{
				session: 8,
				description: 'Visions of the future showed the Red Hand as part of a massive invading army.',
			},
		],
	},
	{
		id: 'broken-shackle',
		name: 'Broken Shackle Tribe',
		description:
			'A faction of raiders (orcs, hobgoblins) identified by tattoos of broken shackles. They may be escaped slaves turned violent. This orcish tribe is known to tame and use Megatherium.',
		leader: null,
		location: 'Elsir Vale',
		sublocation: null,
		type: 'Enemy',
		npcs: [],
		encounters: [
			{
				session: 2,
				description: 'Tattoos of broken shackles were found on an orc shaman and hobgoblins at the hydra ambush.',
			},
			{
				session: 3,
				description:
					'Winter Rose mercenaries reported raptors bearing shackle markings, suggesting a different hobgoblin clan.',
			},
			{
				session: 4,
				description:
					"Megatherium found in the caves bore the mark of the Broken Shackle tribe. The creatures indicated their handlers had answered a call from the 'red hand'.",
			},
		],
	},
	{
		id: 'leviathans-hall',
		name: "The Leviathan's Hall Crew (House Corina)",
		description:
			"A pirate-paladin alliance sailing The Leviathan's Hall. They are led by Commander Turiados (formerly of the Order of Inos) and Commander Bianca of House Corina. Bianca claims to be the true Queen of Pelagos, seeking to reclaim her throne from a necromancer named Sandro. Their crew is diverse, many of whom are former slaves bound by loyalty to Bianca.",
		leader: 'Commander Turiados, Commander Bianca',
		location: 'At sea (Lost, originally from Lustria)',
		sublocation: "The Leviathan's Hall",
		type: 'Neutral',
		npcs: ['Commander Turiados', 'Commander Bianca', 'Glass', 'Marise Curs'],
		encounters: [
			{
				session: 4,
				description: "'Rescued' the party from the sea after they escaped the collapsing caves.",
			},
			{
				session: 5,
				description:
					'Held the party on their ship, demanding a 20% rescue fee. Turiados offered a deal for the head of the necromancer Sandro. They ultimately stranded the party on a beach after taking some of their gear.',
			},
		],
	},
	{
		id: 'blue-bear-horde',
		name: 'The Blue Bear Horde',
		description:
			"The primary invading army seen in the party's apocalyptic visions. Their sigil is a snarling blue bear. They are allied with the Red Hand , chromatic dragons , and factions of the Arcane Brotherhood in a multi-front war.",
		leader: null,
		location: null,
		sublocation: null,
		type: 'Enemy',
		npcs: [],
		encounters: [
			{
				session: 8,
				description:
					"Seen in visions attacking Kaedin's neighboring village, fighting in the Feywild, and besieging Neverwinter.",
			},
		],
	},
	{
		id: 'lamashtu-cults',
		name: "Lamashtu's Cults",
		description:
			"A subversive cult responsible for infiltrating and corrupting a Paladin fortress in Olek's vision. They infiltrated the order after its ranks were depleted at the Battle for Bremen.",
		leader: null,
		location: null,
		sublocation: null,
		type: 'Enemy',
		npcs: [],
		encounters: [
			{
				session: 8,
				description: "Revealed in Olek and Norr's vision as the force that corrupted a Paladin order from within.",
			},
		],
	},
	{
		id: 'red-wizards',
		name: 'Red Wizards of Thay',
		description:
			"A notorious magocracy of evil wizards from Thay. A Red Wizard was seen in Soshi's vision overseeing a ritual to destroy the walls of Neverwinter, using prisoners as fuel.",
		leader: null,
		location: 'Thay',
		sublocation: null,
		type: 'Enemy',
		npcs: [],
		encounters: [
			{
				session: 8,
				description:
					"A Red Wizard was seen leading a ritual sacrifice of prisoners during the siege of Neverwinter in Soshi's vision.",
			},
		],
	},
	{
		id: 'angevin-fleet',
		name: 'Angevin Fleet',
		description:
			"A powerful naval force mentioned in Olek and Norr's vision. They were responsible for the fall of the Paladin fortress at Bremen by storming the harbor with their 'resurrected God, Kresimir'.",
		leader: null,
		location: null,
		sublocation: null,
		type: 'Enemy',
		npcs: ['Kresimir (resurrected God)'],
		encounters: [
			{
				session: 8,
				description: 'Seen in a vision as the force that ensured the defeat of the paladins at the Battle for Bremen].',
			},
		],
	},
];
