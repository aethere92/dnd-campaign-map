// const CAMPAIGN_002_TIMELINE = [
// 	{
// 		id: 1,
// 		title: `Woods before [ENTITY:location:Drellin's Ferry]`,
// 		location: `Near [ENTITY:location:Drellin's Ferry]`,
// 		session: '1',
// 		url: {
// 			campaign: 'campaign-002',
// 			session: 'session-002',
// 		},
// 		description: ``,
// 		items: [
// 			{
// 				type: 'encounter',
// 				actors: 'Hobgoblins',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'the-fight' },
// 				description: `The [ENTITY:character:Entire party:Party] engages into a fight with hobgoblins. They fight as a team and manage to defeat the hobgoblins, killing their captain and making the remaining still alive run in defeat. `,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Hobgoblin interrogation',
// 				sublocation: 'Abandoned farmhouse',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'interrogation' },
// 				description: `The party interrogates a captured hobgoblin, with [ENTITY:character:Bonnie] leading the questioning and [ENTITY:character:Olek] ensuring honesty through magic. Despite their efforts, the creature refuses to speak until [ENTITY:character:Olek] promises him a swift death in exchange for answers. They learn of [ENTITY:npc:Wyrmlord Koth], a powerful sorcerer gathering forces for "the Day of Ruin," but their attempts to get a location fail. A strange symbol they found elicits a reaction, but no explanation follows. When the group considers taking the prisoner to town for further interrogation, [ENTITY:character:Olek] ultimately honors his word and delivers the promised death.`,
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'towards-drellins-ferry' },
// 				description: `As they made their way towards [ENTITY:location:Drellin's Ferry], [ENTITY:character:Olek] and [ENTITY:character:Bonnie] scared a farmer and their son who were going on the way towards the abandoned farmhouse.`,
// 			},
// 		],
// 	},
// 	{
// 		id: 2,
// 		title: `Reaching [ENTITY:location:Drellin's Ferry]`,
// 		location: `[ENTITY:location:Drellin's Ferry]`,
// 		session: '1 & 2',
// 		url: {
// 			campaign: 'campaign-002',
// 			session: 'session-002',
// 			target: 'reaching-drellins-ferry',
// 		},
// 		items: [
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Bonnie] & [ENTITY:character:Olek]',
// 				sublocation: 'Tollhouse',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'olek-and-bonnie' },
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Soshi] & [ENTITY:character:Norr]',
// 				sublocation: 'Shrine of Pelor',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'norr-and-soshi' },
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Kaedin]',
// 				sublocation: 'House of Sertieren',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'kaedin' },
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Town Inn',
// 				is_new_session: true,
// 			},
// 		],
// 	},
// 	{
// 		id: 3,
// 		title: 'Going into the Witchwood',
// 		location: 'The [ENTITY:location:Witchwood]',
// 		session: '2',
// 		items: [
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Into the woods',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: 'Hydra & Hobgoblins',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: 'Wargs',
// 			},
// 		],
// 	},
// 	{
// 		id: 4,
// 		title: "Back to [ENTITY:location:Drellin's Ferry]",
// 		location: `[ENTITY:location:Drellin's Ferry]`,
// 		session: '2 & 3',
// 		items: [
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: null,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:npc:Soranna]',
// 				sublocation: 'Tollhouse',
// 				is_new_session: true,
// 				description: `Talked to [ENTITY:npc:Soranna], found out about [ENTITY:npc:Kat] and [ENTITY:npc:Yoghurt] and tunnel.`,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: '[ENTITY:location:Green Apple Inn]',
// 				description: 'N/A',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: `[ENTITY:npc:Anya]'s house`,
// 				description: 'N/A',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Summoner], [ENTITY:npc:Vandal]',
// 				sublocation: `[ENTITY:location:Green Apple Inn]`,
// 				description: 'Talked with Winter Rose',
// 			},
// 		],
// 	},
// 	{
// 		id: 5,
// 		title: 'Dawn of a new day',
// 		location: `[ENTITY:location:Drellin's Ferry]`,
// 		session: '3',
// 		items: [
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
// 				sublocation: `[ENTITY:location:Green Apple Inn]`,
// 				description: 'Talked with the two guards.',
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'To [ENTITY:npc:Avarthel]',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Hydra eggs talk',
// 				sublocation: "[ENTITY:npc:Avarthel]'s Grove",
// 				description: 'Talked about eggs.',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Potions from [ENTITY:npc:Jareth]',
// 				sublocation: 'Town market',
// 				description: 'Met potion seller [ENTITY:npc:Jareth].',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Talking to [ENTITY:npc:Lem]',
// 				sublocation: `Tollhouse`,
// 				description: 'Spoke to [ENTITY:npc:Lem] about [ENTITY:npc:Anya].',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: 'Finding [ENTITY:npc:Anya]',
// 				sublocation: `Forest Pond`,
// 				description: 'Found [ENTITY:npc:Anya] in the woods, brought her to [ENTITY:npc:Avarthel].',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
// 				sublocation: `[ENTITY:location:Green Apple Inn]`,
// 				description: 'Helped break up tavern brawl non-lethally.',
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
// 				sublocation: 'Temple tunnel entrance',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
// 				sublocation: `Temple entrance`,
// 				description: 'Passed through magical barrier; Kat & Yoghurt blocked.',
// 			},
// 		],
// 	},
// 	{
// 		id: 7,
// 		title: 'The Sunken Temple',
// 		location: `Sunken Temple`,
// 		session: '3',
// 		items: [
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Temple Hallways',
// 				description: 'Chose the reptile path. Encountered traps and poisonous creatures.',
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Leech pond',
// 				description: 'Bypassed massive guardian creature using stealth.',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Flooded room',
// 				description: 'Found note about Demon Lord disciples creating monsters.',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: 'Reptile',
// 				sublocation: 'Underground Lab',
// 				description: 'Fought and polymorphed monstrous reptile; looted magical items.',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
// 				sublocation: 'Rune platform',
// 				description: 'Activated rune with Winter Rose, opening new path.',
// 			},
// 		],
// 	},
// 	{
// 		id: 8,
// 		title: 'The Collapsing Cavern and The Pirate Paladins',
// 		location: 'Cavern Network / Luskan Coast',
// 		session: '4',
// 		items: [
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Ritual Chamber/Camp',
// 				description:
// 					"Found evidence of dark rituals, decay, and cages. Identified the camp as belonging to Calistra of the Brotherhood ([ENTITY:character:Norr]'s former teacher). Discovered a ledger detailing creature collection for 'Kilgor' and the 'Festival of Life,' along with a failed Brotherhood reinforcement note and a reference to a hidden treasure at 'the old fort north of the woods.'",
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Norr]',
// 				sublocation: 'Ritual Chamber/Camp',
// 				description:
// 					'[ENTITY:character:Norr] suffered a psychic spike, recognizing Calistra as a harsh former teacher specializing in alteration magic who vanished a decade prior.',
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Norr], [ENTITY:character:Bonnie]',
// 				sublocation: 'Deep Cavern',
// 				description:
// 					"Encountered Megatherium, massive prehistoric bear-sloth creatures marked by the Broken Shackle orc tribe. [ENTITY:character:Norr]'s mind-spike identified them as herbivores used for insect consumption. [ENTITY:character:Bonnie] befriended two (Gică and Mișu), learning their handlers left two weeks prior for the Red Hand.",
// 			},
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Megatherium]',
// 				sublocation: 'Deep Cavern',
// 				description:
// 					"Ambushed by Spitters (acidic millipede-like creatures of the Te Snatchers goblin clan) and their Drider handlers. [ENTITY:character:Olek]'s armor was severely damaged by acid. The Megatherium became aggressive and helped defeat the monsters. The party harvested valuable venom and identified toxic Garlic Agaricoms.",
// 			},
// 			{
// 				type: 'reunion',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
// 				sublocation: 'Cavern River',
// 				description: '[ENTITY:npc:Vandal] and the [ENTITY:npc:Summoner] reunited with the group, having found a partially submerged ship.',
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
// 				sublocation: 'Collapsing Cave System',
// 				description:
// 					"[ENTITY:npc:Vandal]'s spell blew out a cavern wall. The ship was caught in a massive surge, rocketing through the collapsing cave system until it shot out of a mountain waterfall and crashed into the sea.",
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Captain Bianca Turiados]',
// 				sublocation: 'Luskan Coast',
// 				description:
// 					'The battered survivors were rescued by a galleon flying a jolly roger, crewed by a bizarre mix of pirates and fully armored paladins. The captain, Bianca Turiados, was recognized by Olek as the paladin commander he was seeking, suggesting a vast conspiracy.',
// 			},
// 		],
// 	},
// 	{
// 		id: 9,
// 		title: "The Pirate's Debt and The Thylacoleo Cubs",
// 		location: 'The Leviathan’s Hall / Desolate Beach / Drellin’s Ferry',
// 		session: '5',
// 		items: [
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Soshi]',
// 				sublocation: 'The Leviathan’s Hall (Galleon)',
// 				description:
// 					"The party was brought before commanders Turiados (Sahuagin Shaman) and Bianca (Fey-touched Queen of Pelagos). [ENTITY:character:Soshi] recognized Turiados's cutlass, the Breaker of Hulls, and Bianca's thunder-blade, Winder, as relics stolen from her organization, the Brotherhood.",
// 			},
// 			{
// 				type: 'negotiation',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Glass]',
// 				sublocation: 'The Leviathan’s Hall (Quarterdeck)',
// 				description:
// 					'Bianca demanded a 20% rescue fee. [ENTITY:character:Bonnie] confessed their gold was cursed copper (nearly worthless) due to a pirate coin. Quartermaster Glass, an Ice Elemental, refused the cursed money but took 20% of their non-monetary assets: [ENTITY:character:Olek]’s javelins, [ENTITY:character:Norr]’s climbing rope, and eight precious pearls.',
// 			},
// 			{
// 				type: 'intelligence',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Marise Curs]',
// 				sublocation: 'The Leviathan’s Hall (Deck)',
// 				description:
// 					'A drunken pirate, Marise Curs, revealed the crew were former slaves, liberated by General Ilie, whom Bianca betrayed to steal the ship. [ENTITY:npc:Vandal] and Scoundrel confirmed they would pay their share and warned the party against trouble.',
// 			},
// 			{
// 				type: 'conflict',
// 				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Bianca]',
// 				sublocation: 'The Leviathan’s Hall (Deck)',
// 				description:
// 					"Turiados offered to trade his spinning compass (which pointed to [ENTITY:character:Soshi]'s greatest desire) for a lock of King Sandro's hair. When [ENTITY:character:Bonnie] slyly dropped a cursed coin, Bianca instantly blasted her with a powerful bolt of force, knocking her down.",
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Desolate Beach / Forest',
// 				description:
// 					"The party was dumped on a beach. [ENTITY:npc:Vandal] and Scoundrel warned them of local undead pirates before departing. After a night's rest (marked by a giant seagull caught in [ENTITY:character:Bonnie]'s bear trap and eaten by crabs), the party trekked toward [ENTITY:location:Drellin's Ferry].",
// 			},
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Thylacoleos]',
// 				sublocation: 'Oak Clearing',
// 				description:
// 					'Ambushed by three Thylacoleos (massive, pouched predators). [ENTITY:character:Soshi] was grappled and [ENTITY:character:Kaedin] was dragged up a tree. [ENTITY:character:Bonnie] used Misty Step to strike, [ENTITY:character:Kaedin] manifested his [ENTITY:subclass:Echo Knight] double, and [ENTITY:character:Soshi] cast Polymorph to turn [ENTITY:character:Norr] into a Giant Ape. The beasts were defeated, though the Ape took heavy damage.',
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Entire party:Party]',
// 				sublocation: 'Oak Clearing',
// 				description:
// 					'[ENTITY:character:Kaedin] salvaged three pelts and fangs. The party found the reason for the attack: seven impossibly cute Thylacoleo cubs in a hollow tree, which they took in.',
// 			},
// 			{
// 				type: 'negotiation',
// 				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Sertieren]',
// 				sublocation: "[ENTITY:location:Drellin's Ferry] (Wizard's Mansion)",
// 				description:
// 					'The party fed the cubs with a local goat-herd’s milk. [ENTITY:character:Bonnie] successfully convinced the wizard Sertieren to sell her seven containment spheres on credit. Sertieren placed a magical, glowing brand on [ENTITY:character:Bonnie]’s wrist as collateral for the 7 gold debt.',
// 			},
// 			{
// 				type: 'transaction',
// 				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Soshi], [ENTITY:npc:Sertieren]',
// 				sublocation: "[ENTITY:location:Drellin's Ferry] (Wizard's Mansion)",
// 				description:
// 					'[ENTITY:character:Kaedin] and [ENTITY:character:Soshi] paid the 7 gold debt. The party sold Sertieren half a kilo of Storm Dust (15g) and a preserved cave worm head/Artus Plura mushrooms (10g). Sertieren also identified the vials: a celerity potion and a potent anti-poison with the side effect of “severe, explosive dysentery.”',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Soshi], [ENTITY:npc:Sertieren]',
// 				sublocation: "Drellin's Ferry (Wizard's Mansion)",
// 				description:
// 					"Soshi inquired about the mage Calistra. Sertieren revealed they were former adventuring partners ('Crazy Hogs') but he stole her spellbook to stop her from casting an earthquake spell. He warned the party that a storm is coming (referencing hydras, potions, and tribal unity) and that he plans to leave town.",
// 			},
// 		],
// 	},
// 	{
// 		id: 10,
// 		title: 'The Menagerie and The Fort Siege',
// 		location: 'Drellin’s Ferry / Witchwood / Ruined Fort',
// 		session: '6',
// 		items: [
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'The Inn',
// 				description: 'Arrived at the inn weary. Consumed a mushroom/herb stew that granted them temporary hit points.',
// 			},
// 			{
// 				type: 'animal_care',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'The Inn',
// 				description:
// 					'The party released their juvenile, leopard-sized magical cats for their 48-hour maturation period. The cats caused immense chaos and destruction: [ENTITY:character:Kaedin]’s pets chewed a massive hole in his room, [ENTITY:character:Norr]’s scaled her walls, and [ENTITY:character:Olek]’s cat, Palo, ransacked the kitchen, causing the innkeeper to pass out. [ENTITY:character:Olek] paid a gold piece for kitchen damages, and [ENTITY:character:Kaedin] incurred an expensive ongoing repair fee for his wall. The creatures were returned to their spheres.',
// 			},
// 			{
// 				type: 'transaction',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Market/Armorer',
// 				description:
// 					"Restocked with supplies, milk, and various honeys (for training mounts). [ENTITY:character:Bonnie] contacted a thieves’ guild acquaintance. Used a discount note to purchase new armor (Splint Mail for [ENTITY:character:Kaedin], Chain Mail for [ENTITY:character:Olek]). Sold two 'Taylas' pelts and used the third to reinforce the new armor and [ENTITY:character:Bonnie]’s leather gear for added damage resistance.",
// 			},
// 			{
// 				type: 'mission_update',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Captain Sorana]',
// 				sublocation: 'Town Hall/Office',
// 				description:
// 					'Reported their temple investigation to Captain Sorana. She confirmed pirates were in the harbor and paid the party 20 gold. Assigned a new mission: investigate the disappearance of four barbarian riders in the Witchwood forest to the northwest.',
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Bonnie], [ENTITY:character:Entire party:Party]',
// 				sublocation: 'Road to Witchwood',
// 				description:
// 					'Encountered the smoldering wreckage of two caravans and a massacre of ten innocents. [ENTITY:character:Bonnie]’s tracking revealed the culprits were at least twenty Orcs on Warg-back, heading toward the ruined fort.',
// 			},
// 			{
// 				type: 'scouting',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Ruined Fort',
// 				description:
// 					'Located a ruined fortress. The land felt cleansed by powerful abjuration magic. Identified a stable with Hobgoblins playing dice and a skeleton patrolling the main keep wall. Realized the enemy was expecting them.',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Wormlord Faction]',
// 				sublocation: 'Ruined Fort Courtyard',
// 				description:
// 					'Launched a surprise attack: [ENTITY:character:Soshi] cast Grease and [ENTITY:character:Norr] followed with a devastating Fireball, igniting the stable and killing several enemies. The courtyard erupted with two Wargs, two Hobgoblin Warg-riders, a hulking Minotaur, a Mud Elemental, and a terrifying Manticore.',
// 			},
// 			{
// 				type: 'combat',
// 				actors:
// 					'[ENTITY:character:Olek], [ENTITY:character:Norr], [ENTITY:character:Bonnie], [ENTITY:character:Kaedin]',
// 				sublocation: 'Ruined Fort Courtyard',
// 				description:
// 					'[ENTITY:character:Olek] was immediately snatched and poisoned by the Manticore. A Hobgoblin shaman blinded [ENTITY:character:Norr]. [ENTITY:character:Bonnie], using invisibility, assassinated a shaman. [ENTITY:character:Kaedin] used his [ENTITY:subclass:Echo Knight] abilities to flank the riders. [ENTITY:character:Olek] crashed-landed on the battlement and killed the last archer. [ENTITY:character:Kaedin] destroyed the Mud Elemental.',
// 			},
// 			{
// 				type: 'victory',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Wormlord Faction]',
// 				sublocation: 'Ruined Fort Courtyard',
// 				description:
// 					'The final shaman and the Minotaur fled through the main gate, shouting an ominous warning: "Alert the Wormlord!" The party stood victorious, having survived the siege and identified a new primary threat.',
// 			},
// 		],
// 	},
// 	{
// 		id: 11,
// 		title: 'The Blood Ritual and The Dragon’s Arrival',
// 		location: 'Ruined Fort / Underground Temple',
// 		session: '7',
// 		items: [
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Ruined Fort Barracks',
// 				description:
// 					'Party recovered health but avoided a full short rest. They chose stealth through the burned-out barracks (the main gate was locked). The attempt at silence was compromised by [ENTITY:character:Kaedin]’s noisy armor and [ENTITY:character:Soshi] snagging her cloak. [ENTITY:character:Bonnie] scouted, finding an abandoned throne room with signs of recent violence.',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:character:Bonnie]',
// 				sublocation: 'Underground Tunnel',
// 				description:
// 					"Found a map detailing a major enemy force (thirty units, 19x stronger than what they’d faced) gathering to strike [ENTITY:location:Drellin's Ferry] in four days. Identified a key vulnerability: destroying a bridge one day away could delay the attack by two to three days. [ENTITY:character:Bonnie] found the magical signature of a Red Dragon in the area.",
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:character:Bonnie]',
// 				sublocation: 'Ritual Chamber',
// 				description:
// 					'Entered a circular stone chamber with a large, blood-stained ritual circle. Found half-dozen corpses, including their former teacher, Calistra, who had apparently sacrificed herself in a blood binding ritual to open a sealed stone door. Markings indicated the involvement of both the Arcane Seekers and the Brotherhood.',
// 			},
// 			{
// 				type: 'conflict',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Spectral Entities]',
// 				sublocation: 'Ritual Chamber',
// 				description:
// 					"The party performed the ritual to open the door, which awakened the souls of the dead mercenaries who rose as wraith-like spectral entities. The ghosts' attacks tore away the party members' traumatic memories. [ENTITY:character:Soshi] debated drawing more energy from the tortured souls than was needed.",
// 			},
// 			{
// 				type: 'sacrifice',
// 				actors: '[ENTITY:character:Norr]',
// 				sublocation: 'Ritual Chamber',
// 				description:
// 					"[ENTITY:character:Norr] maintained the magical channel for the ritual. A surge of green electrical energy erupted, striking her, channelling into the stone door, and instantly refreshing all her spell slots. She was critically injured, briefly became a ghostly visage, and collapsed. With a final check, she shattered the door. [ENTITY:character:Norr]'s Intelligence was permanently reduced by two, but her alignment shifted to Neutral, and she gained permanent additional spell slots.",
// 			},
// 			{
// 				type: 'combat',
// 				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Olek]',
// 				sublocation: 'Temple Entrance',
// 				description:
// 					"Entered the temple and engaged in fierce combat. A support caster revived the unconscious [ENTITY:character:Norr] from a wall of fire. [ENTITY:character:Kaedin] and [ENTITY:character:Olek] delivered devastating critical hits against enemy casters, with [ENTITY:character:Olek]'s Divine Smite ending a major threat.",
// 			},
// 			{
// 				type: 'climactic_discovery',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Calistra], [ENTITY:creature:Red Dragon]',
// 				sublocation: 'Blackstone Vault',
// 				description:
// 					'Found the artifact, the Null Brand, on a pedestal. Calistra (their former teacher) was there, one hand fused to the cursed object, using her life force to contain its corrupting influence. As the party debated helping her, a wall of twenty armored orcs and a booming Red Dragon appeared, commanded to take the Brand, creating a sudden, chaotic final battle.',
// 			},
// 		],
// 	},
// 	// SESSION 008
// 	{
// 		id: 12,
// 		title: 'The Shattered Artifact',
// 		location: `Corrupted Fortress`,
// 		session: '8',
// 		items: [
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], Red Hand Army, Dragonkin',
// 				sublocation: 'Ritual Chamber',
// 				description: `An army breaches the chamber wall. [ENTITY:character:Bonnie] uses Fairy Fire while [ENTITY:character:Olek] discovers his divine connection is severed by corrupting magic. [ENTITY:character:Norr]'s wild magic triggers a Fireball centered on herself, devastating both party and enemies. [ENTITY:character:Soshi] summons spectral cats while [ENTITY:character:Kaedin] and [ENTITY:character:Olek] form a defensive line. The party battles orcs, soldiers, and dragonkin leaders. [ENTITY:character:Bonnie] assassinates a dragonkin using her medallion's teleportation and greater invisibility.`,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Ritualist death & Artifact',
// 				sublocation: 'Ritual Chamber',
// 				description: `With the ritualist's death, the artifact releases uncontrolled necrotic energy, intensifying the land's corruption. The artifact becomes unstable and detonates in a catastrophic explosion, casting the party into apocalyptic visions.`,
// 			},
// 			{
// 				type: 'vision',
// 				actors: '[ENTITY:character:Olek], [ENTITY:character:Norr]',
// 				sublocation: 'Blighted [ENTITY:class:Paladin] Fortress',
// 				description: `[ENTITY:character:Olek] and [ENTITY:character:Norr] witness a corrupted fortress overrun by crystalline growths. The impaled commander reveals [ENTITY:npc:Lamashtu]'s cults infiltrated after the Battle for Bremen depleted their ranks. He speaks of defeat caused by the Angevin fleet and their resurrected god [ENTITY:npc:Kresimir] attacking from the harbor. [ENTITY:character:Norr] notices her right arm is replaced by a prosthetic in this dark future.`,
// 			},
// 			{
// 				type: 'vision',
// 				actors: '[ENTITY:character:Kaedin]',
// 				sublocation: 'Burning Village',
// 				description: `[ENTITY:character:Kaedin] finds his neighboring village ablaze. He rescues two children who reveal invaders bearing a yellow banner with a blue bear sigil, accompanied by Red Hand symbols, came two days prior and took villagers as slaves for a ritual. They warn his home village is next.`,
// 			},
// 			{
// 				type: 'vision',
// 				actors: '[ENTITY:character:Bonnie]',
// 				sublocation: 'The Feywild',
// 				description: `[ENTITY:character:Bonnie] witnesses Titania and the Queen of Air and Darkness fighting together against a warrior wielding energy spears. Chromatic dragons destroy pegasus knights and hippogriff riders while Spring and Autumn courts are annihilated. Only unknown paladins hold the line against Red Hand forces, black orcs, and blue bear warriors. The warrior defeats both queens and steals their crowns, dooming the Feywild to wither.`,
// 			},
// 			{
// 				type: 'vision',
// 				actors: '[ENTITY:character:Soshi]',
// 				sublocation: 'Siege of Neverwinter',
// 				description: `[ENTITY:character:Soshi] finds herself chained on a platform with hundreds of prisoners before Neverwinter's walls. A Red Wizard of Thay forces them to power a ritual to breach the city. Blue Bear banners dominate the siege, with chromatic dragons circling overhead and the [ENTITY:guild:Arcane Brotherhood] overseeing the death ritual.`,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Yoghurt]',
// 				sublocation: 'Outside the Fortress',
// 				description: `The party recovers from the explosion and their shared visions. [ENTITY:npc:Yoghurt] appears, having followed them, dragging corpses of shadow-clad scouts with blackened veins. [ENTITY:character:Bonnie] discovers they're foreigners, likely corrupted agents.`,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Yoghurt]',
// 				sublocation: 'Outside the Fortress',
// 				description: `[ENTITY:character:Bonnie] writes an urgent letter to [ENTITY:npc:Soranna] detailing the approaching army's four-day timeline, the visions, enemy factions (Red Hand, Blue Bear, [ENTITY:guild:Arcane Brotherhood], chromatic dragons), and warns against trusting the [ENTITY:guild:Arcane Brotherhood]. She pays [ENTITY:npc:Yoghurt] three gold and makes him swear to deliver it only to [ENTITY:npc:Soranna], not [ENTITY:npc:Kat], promising his Raven master will hear of his service.`,
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Towards the Bridge',
// 				description: `Armed with knowledge of the apocalyptic future, the party sets off toward their immediate goal: reaching and destroying the bridge to buy the North time against the coming war.`,
// 			},
// 		],
// 	},
// ];

// const CAMPAIGN_002_TIMELINE = [
// 	{
// 		id: 1,
// 		title: `Woods before [ENTITY:location:Drellin's Ferry]`,
// 		location: `Near [ENTITY:location:Drellin's Ferry]`,
// 		session: '1',
// 		url: {
// 			campaign: 'campaign-002',
// 			session: 'session-002',
// 		},
// 		description: ``,
// 		items: [
// 			{
// 				type: 'encounter',
// 				actors: 'Hobgoblins',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'the-fight' },
// 				description: `The [ENTITY:character:Entire party:Party] engages into a fight with hobgoblins. They fight as a team and manage to defeat the hobgoblins, killing their captain and making the remaining still alive run in defeat. `,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Hobgoblin interrogation',
// 				sublocation: 'Abandoned farmhouse',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'interrogation' },
// 				description: `The party interrogates a captured hobgoblin, with [ENTITY:character:Bonnie] leading the questioning and [ENTITY:character:Olek] ensuring honesty through magic. Despite their efforts, the creature refuses to speak until [ENTITY:character:Olek] promises him a swift death in exchange for answers. They learn of [ENTITY:npc:Wyrmlord Koth], a powerful sorcerer gathering forces for "the Day of Ruin," but their attempts to get a location fail. A strange symbol they found elicits a reaction, but no explanation follows. When the group considers taking the prisoner to town for further interrogation, [ENTITY:character:Olek] ultimately honors his word and delivers the promised death.`,
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'towards-drellins-ferry' },
// 				description: `As they made their way towards [ENTITY:location:Drellin's Ferry], [ENTITY:character:Olek] and [ENTITY:character:Bonnie] scared a farmer and their son who were going on the way towards the abandoned farmhouse.`,
// 			},
// 		],
// 	},
// 	{
// 		id: 2,
// 		title: `Reaching [ENTITY:location:Drellin's Ferry]`,
// 		location: `[ENTITY:location:Drellin's Ferry]`,
// 		session: '1 & 2',
// 		url: {
// 			campaign: 'campaign-002',
// 			session: 'session-002',
// 			target: 'reaching-drellins-ferry',
// 		},
// 		items: [
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Bonnie] & [ENTITY:character:Olek]',
// 				sublocation: 'Tollhouse',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'olek-and-bonnie' },
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Soshi] & [ENTITY:character:Norr]',
// 				sublocation: 'Shrine of Pelor',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'norr-and-soshi' },
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Kaedin]',
// 				sublocation: 'House of Sertieren',
// 				url: { campaign: 'campaign-002', session: 'session-002', target: 'kaedin' },
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Town Inn',
// 				is_new_session: true,
// 			},
// 		],
// 	},
// 	{
// 		id: 3,
// 		title: 'Going into the Witchwood',
// 		location: 'The [ENTITY:location:Witchwood]',
// 		session: '2',
// 		items: [
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Into the woods',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: 'Hydra & Hobgoblins',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: 'Wargs',
// 			},
// 		],
// 	},
// 	{
// 		id: 4,
// 		title: "Back to [ENTITY:location:Drellin's Ferry]",
// 		location: `[ENTITY:location:Drellin's Ferry]`,
// 		session: '2 & 3',
// 		items: [
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: null,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:npc:Soranna]',
// 				sublocation: 'Tollhouse',
// 				is_new_session: true,
// 				description: `Talked to [ENTITY:npc:Soranna], found out about [ENTITY:npc:Kat] and [ENTITY:npc:Yoghurt] and tunnel.`,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: '[ENTITY:location:Green Apple Inn]',
// 				description: 'N/A',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: `[ENTITY:npc:Anya]'s house`,
// 				description: 'N/A',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Summoner], [ENTITY:npc:Vandal]',
// 				sublocation: `[ENTITY:location:Green Apple Inn]`,
// 				description: 'Talked with Winter Rose',
// 			},
// 		],
// 	},
// 	{
// 		id: 5,
// 		title: 'Dawn of a new day',
// 		location: `[ENTITY:location:Drellin's Ferry]`,
// 		session: '3',
// 		items: [
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
// 				sublocation: `[ENTITY:location:Green Apple Inn]`,
// 				description: 'Talked with the two guards.',
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'To [ENTITY:npc:Avarthel]',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Hydra eggs talk',
// 				sublocation: "[ENTITY:npc:Avarthel]'s Grove",
// 				description: 'Talked about eggs.',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Potions from [ENTITY:npc:Jareth]',
// 				sublocation: 'Town market',
// 				description: 'Met potion seller [ENTITY:npc:Jareth].',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Talking to [ENTITY:npc:Lem]',
// 				sublocation: `Tollhouse`,
// 				description: 'Spoke to [ENTITY:npc:Lem] about [ENTITY:npc:Anya].',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: 'Finding [ENTITY:npc:Anya]',
// 				sublocation: `Forest Pond`,
// 				description: 'Found [ENTITY:npc:Anya] in the woods, brought her to [ENTITY:npc:Avarthel].',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
// 				sublocation: `[ENTITY:location:Green Apple Inn]`,
// 				description: 'Helped break up tavern brawl non-lethally.',
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
// 				sublocation: 'Temple tunnel entrance',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
// 				sublocation: `Temple entrance`,
// 				description: 'Passed through magical barrier; Kat & Yoghurt blocked.',
// 			},
// 		],
// 	},
// 	{
// 		id: 7,
// 		title: 'The Sunken Temple',
// 		location: `Sunken Temple`,
// 		session: '3',
// 		items: [
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Temple Hallways',
// 				description: 'Chose the reptile path. Encountered traps and poisonous creatures.',
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Leech pond',
// 				description: 'Bypassed massive guardian creature using stealth.',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Flooded room',
// 				description: 'Found note about Demon Lord disciples creating monsters.',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: 'Reptile',
// 				sublocation: 'Underground Lab',
// 				description: 'Fought and polymorphed monstrous reptile; looted magical items.',
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
// 				sublocation: 'Rune platform',
// 				description: 'Activated rune with Winter Rose, opening new path.',
// 			},
// 		],
// 	},
// 	{
// 		id: 8,
// 		title: 'The Collapsing Cavern and The Pirate Paladins',
// 		location: 'Cavern Network / Luskan Coast',
// 		session: '4',
// 		items: [
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Ritual Chamber/Camp',
// 				description:
// 					"Found evidence of dark rituals, decay, and cages. Identified the camp as belonging to Calistra of the Brotherhood ([ENTITY:character:Norr]'s former teacher). Discovered a ledger detailing creature collection for 'Kilgor' and the 'Festival of Life,' along with a failed Brotherhood reinforcement note and a reference to a hidden treasure at 'the old fort north of the woods.'",
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Norr]',
// 				sublocation: 'Ritual Chamber/Camp',
// 				description:
// 					'[ENTITY:character:Norr] suffered a psychic spike, recognizing Calistra as a harsh former teacher specializing in alteration magic who vanished a decade prior.',
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Norr], [ENTITY:character:Bonnie]',
// 				sublocation: 'Deep Cavern',
// 				description:
// 					"Encountered Megatherium, massive prehistoric bear-sloth creatures marked by the Broken Shackle orc tribe. [ENTITY:character:Norr]'s mind-spike identified them as herbivores used for insect consumption. [ENTITY:character:Bonnie] befriended two (Gică and Mișu), learning their handlers left two weeks prior for the Red Hand.",
// 			},
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Megatherium]',
// 				sublocation: 'Deep Cavern',
// 				description:
// 					"Ambushed by Spitters (acidic millipede-like creatures of the Te Snatchers goblin clan) and their Drider handlers. [ENTITY:character:Olek]'s armor was severely damaged by acid. The Megatherium became aggressive and helped defeat the monsters. The party harvested valuable venom and identified toxic Garlic Agaricoms.",
// 			},
// 			{
// 				type: 'reunion',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
// 				sublocation: 'Cavern River',
// 				description: '[ENTITY:npc:Vandal] and the [ENTITY:npc:Summoner] reunited with the group, having found a partially submerged ship.',
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
// 				sublocation: 'Collapsing Cave System',
// 				description:
// 					"[ENTITY:npc:Vandal]'s spell blew out a cavern wall. The ship was caught in a massive surge, rocketing through the collapsing cave system until it shot out of a mountain waterfall and crashed into the sea.",
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Captain Bianca Turiados]',
// 				sublocation: 'Luskan Coast',
// 				description:
// 					'The battered survivors were rescued by a galleon flying a jolly roger, crewed by a bizarre mix of pirates and fully armored paladins. The captain, Bianca Turiados, was recognized by Olek as the paladin commander he was seeking, suggesting a vast conspiracy.',
// 			},
// 		],
// 	},
// 	{
// 		id: 9,
// 		title: "The Pirate's Debt and The Thylacoleo Cubs",
// 		location: 'The Leviathan’s Hall / Desolate Beach / Drellin’s Ferry',
// 		session: '5',
// 		items: [
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Soshi]',
// 				sublocation: 'The Leviathan’s Hall (Galleon)',
// 				description:
// 					"The party was brought before commanders Turiados (Sahuagin Shaman) and Bianca (Fey-touched Queen of Pelagos). [ENTITY:character:Soshi] recognized Turiados's cutlass, the Breaker of Hulls, and Bianca's thunder-blade, Winder, as relics stolen from her organization, the Brotherhood.",
// 			},
// 			{
// 				type: 'negotiation',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Glass]',
// 				sublocation: 'The Leviathan’s Hall (Quarterdeck)',
// 				description:
// 					'Bianca demanded a 20% rescue fee. [ENTITY:character:Bonnie] confessed their gold was cursed copper (nearly worthless) due to a pirate coin. Quartermaster Glass, an Ice Elemental, refused the cursed money but took 20% of their non-monetary assets: [ENTITY:character:Olek]’s javelins, [ENTITY:character:Norr]’s climbing rope, and eight precious pearls.',
// 			},
// 			{
// 				type: 'intelligence',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Marise Curs]',
// 				sublocation: 'The Leviathan’s Hall (Deck)',
// 				description:
// 					'A drunken pirate, Marise Curs, revealed the crew were former slaves, liberated by General Ilie, whom Bianca betrayed to steal the ship. [ENTITY:npc:Vandal] and Scoundrel confirmed they would pay their share and warned the party against trouble.',
// 			},
// 			{
// 				type: 'conflict',
// 				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Bianca]',
// 				sublocation: 'The Leviathan’s Hall (Deck)',
// 				description:
// 					"Turiados offered to trade his spinning compass (which pointed to [ENTITY:character:Soshi]'s greatest desire) for a lock of King Sandro's hair. When [ENTITY:character:Bonnie] slyly dropped a cursed coin, Bianca instantly blasted her with a powerful bolt of force, knocking her down.",
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Desolate Beach / Forest',
// 				description:
// 					"The party was dumped on a beach. [ENTITY:npc:Vandal] and Scoundrel warned them of local undead pirates before departing. After a night's rest (marked by a giant seagull caught in [ENTITY:character:Bonnie]'s bear trap and eaten by crabs), the party trekked toward [ENTITY:location:Drellin's Ferry].",
// 			},
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Thylacoleos]',
// 				sublocation: 'Oak Clearing',
// 				description:
// 					'Ambushed by three Thylacoleos (massive, pouched predators). [ENTITY:character:Soshi] was grappled and [ENTITY:character:Kaedin] was dragged up a tree. [ENTITY:character:Bonnie] used Misty Step to strike, [ENTITY:character:Kaedin] manifested his [ENTITY:subclass:Echo Knight] double, and [ENTITY:character:Soshi] cast Polymorph to turn [ENTITY:character:Norr] into a Giant Ape. The beasts were defeated, though the Ape took heavy damage.',
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Entire party:Party]',
// 				sublocation: 'Oak Clearing',
// 				description:
// 					'[ENTITY:character:Kaedin] salvaged three pelts and fangs. The party found the reason for the attack: seven impossibly cute Thylacoleo cubs in a hollow tree, which they took in.',
// 			},
// 			{
// 				type: 'negotiation',
// 				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Sertieren]',
// 				sublocation: "[ENTITY:location:Drellin's Ferry] (Wizard's Mansion)",
// 				description:
// 					'The party fed the cubs with a local goat-herd’s milk. [ENTITY:character:Bonnie] successfully convinced the wizard Sertieren to sell her seven containment spheres on credit. Sertieren placed a magical, glowing brand on [ENTITY:character:Bonnie]’s wrist as collateral for the 7 gold debt.',
// 			},
// 			{
// 				type: 'transaction',
// 				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Soshi], [ENTITY:npc:Sertieren]',
// 				sublocation: "[ENTITY:location:Drellin's Ferry] (Wizard's Mansion)",
// 				description:
// 					'[ENTITY:character:Kaedin] and [ENTITY:character:Soshi] paid the 7 gold debt. The party sold Sertieren half a kilo of Storm Dust (15g) and a preserved cave worm head/Artus Plura mushrooms (10g). Sertieren also identified the vials: a celerity potion and a potent anti-poison with the side effect of “severe, explosive dysentery.”',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Soshi], [ENTITY:npc:Sertieren]',
// 				sublocation: "Drellin's Ferry (Wizard's Mansion)",
// 				description:
// 					"Soshi inquired about the mage Calistra. Sertieren revealed they were former adventuring partners ('Crazy Hogs') but he stole her spellbook to stop her from casting an earthquake spell. He warned the party that a storm is coming (referencing hydras, potions, and tribal unity) and that he plans to leave town.",
// 			},
// 		],
// 	},
// 	{
// 		id: 10,
// 		title: 'The Menagerie and The Fort Siege',
// 		location: 'Drellin’s Ferry / Witchwood / Ruined Fort',
// 		session: '6',
// 		items: [
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'The Inn',
// 				description: 'Arrived at the inn weary. Consumed a mushroom/herb stew that granted them temporary hit points.',
// 			},
// 			{
// 				type: 'animal_care',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'The Inn',
// 				description:
// 					'The party released their juvenile, leopard-sized magical cats for their 48-hour maturation period. The cats caused immense chaos and destruction: [ENTITY:character:Kaedin]’s pets chewed a massive hole in his room, [ENTITY:character:Norr]’s scaled her walls, and [ENTITY:character:Olek]’s cat, Palo, ransacked the kitchen, causing the innkeeper to pass out. [ENTITY:character:Olek] paid a gold piece for kitchen damages, and [ENTITY:character:Kaedin] incurred an expensive ongoing repair fee for his wall. The creatures were returned to their spheres.',
// 			},
// 			{
// 				type: 'transaction',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Market/Armorer',
// 				description:
// 					"Restocked with supplies, milk, and various honeys (for training mounts). [ENTITY:character:Bonnie] contacted a thieves’ guild acquaintance. Used a discount note to purchase new armor (Splint Mail for [ENTITY:character:Kaedin], Chain Mail for [ENTITY:character:Olek]). Sold two 'Taylas' pelts and used the third to reinforce the new armor and [ENTITY:character:Bonnie]’s leather gear for added damage resistance.",
// 			},
// 			{
// 				type: 'mission_update',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Captain Sorana]',
// 				sublocation: 'Town Hall/Office',
// 				description:
// 					'Reported their temple investigation to Captain Sorana. She confirmed pirates were in the harbor and paid the party 20 gold. Assigned a new mission: investigate the disappearance of four barbarian riders in the Witchwood forest to the northwest.',
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Bonnie], [ENTITY:character:Entire party:Party]',
// 				sublocation: 'Road to Witchwood',
// 				description:
// 					'Encountered the smoldering wreckage of two caravans and a massacre of ten innocents. [ENTITY:character:Bonnie]’s tracking revealed the culprits were at least twenty Orcs on Warg-back, heading toward the ruined fort.',
// 			},
// 			{
// 				type: 'scouting',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Ruined Fort',
// 				description:
// 					'Located a ruined fortress. The land felt cleansed by powerful abjuration magic. Identified a stable with Hobgoblins playing dice and a skeleton patrolling the main keep wall. Realized the enemy was expecting them.',
// 			},
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Wormlord Faction]',
// 				sublocation: 'Ruined Fort Courtyard',
// 				description:
// 					'Launched a surprise attack: [ENTITY:character:Soshi] cast Grease and [ENTITY:character:Norr] followed with a devastating Fireball, igniting the stable and killing several enemies. The courtyard erupted with two Wargs, two Hobgoblin Warg-riders, a hulking Minotaur, a Mud Elemental, and a terrifying Manticore.',
// 			},
// 			{
// 				type: 'combat',
// 				actors:
// 					'[ENTITY:character:Olek], [ENTITY:character:Norr], [ENTITY:character:Bonnie], [ENTITY:character:Kaedin]',
// 				sublocation: 'Ruined Fort Courtyard',
// 				description:
// 					'[ENTITY:character:Olek] was immediately snatched and poisoned by the Manticore. A Hobgoblin shaman blinded [ENTITY:character:Norr]. [ENTITY:character:Bonnie], using invisibility, assassinated a shaman. [ENTITY:character:Kaedin] used his [ENTITY:subclass:Echo Knight] abilities to flank the riders. [ENTITY:character:Olek] crashed-landed on the battlement and killed the last archer. [ENTITY:character:Kaedin] destroyed the Mud Elemental.',
// 			},
// 			{
// 				type: 'victory',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Wormlord Faction]',
// 				sublocation: 'Ruined Fort Courtyard',
// 				description:
// 					'The final shaman and the Minotaur fled through the main gate, shouting an ominous warning: "Alert the Wormlord!" The party stood victorious, having survived the siege and identified a new primary threat.',
// 			},
// 		],
// 	},
// 	{
// 		id: 11,
// 		title: 'The Blood Ritual and The Dragon’s Arrival',
// 		location: 'Ruined Fort / Underground Temple',
// 		session: '7',
// 		items: [
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Ruined Fort Barracks',
// 				description:
// 					'Party recovered health but avoided a full short rest. They chose stealth through the burned-out barracks (the main gate was locked). The attempt at silence was compromised by [ENTITY:character:Kaedin]’s noisy armor and [ENTITY:character:Soshi] snagging her cloak. [ENTITY:character:Bonnie] scouted, finding an abandoned throne room with signs of recent violence.',
// 			},
// 			{
// 				type: 'investigation',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:character:Bonnie]',
// 				sublocation: 'Underground Tunnel',
// 				description:
// 					"Found a map detailing a major enemy force (thirty units, 19x stronger than what they’d faced) gathering to strike [ENTITY:location:Drellin's Ferry] in four days. Identified a key vulnerability: destroying a bridge one day away could delay the attack by two to three days. [ENTITY:character:Bonnie] found the magical signature of a Red Dragon in the area.",
// 			},
// 			{
// 				type: 'discovery',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:character:Bonnie]',
// 				sublocation: 'Ritual Chamber',
// 				description:
// 					'Entered a circular stone chamber with a large, blood-stained ritual circle. Found half-dozen corpses, including their former teacher, Calistra, who had apparently sacrificed herself in a blood binding ritual to open a sealed stone door. Markings indicated the involvement of both the Arcane Seekers and the Brotherhood.',
// 			},
// 			{
// 				type: 'conflict',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Spectral Entities]',
// 				sublocation: 'Ritual Chamber',
// 				description:
// 					"The party performed the ritual to open the door, which awakened the souls of the dead mercenaries who rose as wraith-like spectral entities. The ghosts' attacks tore away the party members' traumatic memories. [ENTITY:character:Soshi] debated drawing more energy from the tortured souls than was needed.",
// 			},
// 			{
// 				type: 'sacrifice',
// 				actors: '[ENTITY:character:Norr]',
// 				sublocation: 'Ritual Chamber',
// 				description:
// 					"[ENTITY:character:Norr] maintained the magical channel for the ritual. A surge of green electrical energy erupted, striking her, channelling into the stone door, and instantly refreshing all her spell slots. She was critically injured, briefly became a ghostly visage, and collapsed. With a final check, she shattered the door. [ENTITY:character:Norr]'s Intelligence was permanently reduced by two, but her alignment shifted to Neutral, and she gained permanent additional spell slots.",
// 			},
// 			{
// 				type: 'combat',
// 				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Olek]',
// 				sublocation: 'Temple Entrance',
// 				description:
// 					"Entered the temple and engaged in fierce combat. A support caster revived the unconscious [ENTITY:character:Norr] from a wall of fire. [ENTITY:character:Kaedin] and [ENTITY:character:Olek] delivered devastating critical hits against enemy casters, with [ENTITY:character:Olek]'s Divine Smite ending a major threat.",
// 			},
// 			{
// 				type: 'climactic_discovery',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Calistra], [ENTITY:creature:Red Dragon]',
// 				sublocation: 'Blackstone Vault',
// 				description:
// 					'Found the artifact, the Null Brand, on a pedestal. Calistra (their former teacher) was there, one hand fused to the cursed object, using her life force to contain its corrupting influence. As the party debated helping her, a wall of twenty armored orcs and a booming Red Dragon appeared, commanded to take the Brand, creating a sudden, chaotic final battle.',
// 			},
// 		],
// 	},
// 	// SESSION 008
// 	{
// 		id: 12,
// 		title: 'The Shattered Artifact',
// 		location: `Corrupted Fortress`,
// 		session: '8',
// 		items: [
// 			{
// 				type: 'encounter',
// 				actors: '[ENTITY:character:Entire party:Party], Red Hand Army, Dragonkin',
// 				sublocation: 'Ritual Chamber',
// 				description: `An army breaches the chamber wall. [ENTITY:character:Bonnie] uses Fairy Fire while [ENTITY:character:Olek] discovers his divine connection is severed by corrupting magic. [ENTITY:character:Norr]'s wild magic triggers a Fireball centered on herself, devastating both party and enemies. [ENTITY:character:Soshi] summons spectral cats while [ENTITY:character:Kaedin] and [ENTITY:character:Olek] form a defensive line. The party battles orcs, soldiers, and dragonkin leaders. [ENTITY:character:Bonnie] assassinates a dragonkin using her medallion's teleportation and greater invisibility.`,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: 'Ritualist death & Artifact',
// 				sublocation: 'Ritual Chamber',
// 				description: `With the ritualist's death, the artifact releases uncontrolled necrotic energy, intensifying the land's corruption. The artifact becomes unstable and detonates in a catastrophic explosion, casting the party into apocalyptic visions.`,
// 			},
// 			{
// 				type: 'vision',
// 				actors: '[ENTITY:character:Olek], [ENTITY:character:Norr]',
// 				sublocation: 'Blighted [ENTITY:class:Paladin] Fortress',
// 				description: `[ENTITY:character:Olek] and [ENTITY:character:Norr] witness a corrupted fortress overrun by crystalline growths. The impaled commander reveals [ENTITY:npc:Lamashtu]'s cults infiltrated after the Battle for Bremen depleted their ranks. He speaks of defeat caused by the Angevin fleet and their resurrected god [ENTITY:npc:Kresimir] attacking from the harbor. [ENTITY:character:Norr] notices her right arm is replaced by a prosthetic in this dark future.`,
// 			},
// 			{
// 				type: 'vision',
// 				actors: '[ENTITY:character:Kaedin]',
// 				sublocation: 'Burning Village',
// 				description: `[ENTITY:character:Kaedin] finds his neighboring village ablaze. He rescues two children who reveal invaders bearing a yellow banner with a blue bear sigil, accompanied by Red Hand symbols, came two days prior and took villagers as slaves for a ritual. They warn his home village is next.`,
// 			},
// 			{
// 				type: 'vision',
// 				actors: '[ENTITY:character:Bonnie]',
// 				sublocation: 'The Feywild',
// 				description: `[ENTITY:character:Bonnie] witnesses Titania and the Queen of Air and Darkness fighting together against a warrior wielding energy spears. Chromatic dragons destroy pegasus knights and hippogriff riders while Spring and Autumn courts are annihilated. Only unknown paladins hold the line against Red Hand forces, black orcs, and blue bear warriors. The warrior defeats both queens and steals their crowns, dooming the Feywild to wither.`,
// 			},
// 			{
// 				type: 'vision',
// 				actors: '[ENTITY:character:Soshi]',
// 				sublocation: 'Siege of Neverwinter',
// 				description: `[ENTITY:character:Soshi] finds herself chained on a platform with hundreds of prisoners before Neverwinter's walls. A Red Wizard of Thay forces them to power a ritual to breach the city. Blue Bear banners dominate the siege, with chromatic dragons circling overhead and the [ENTITY:guild:Arcane Brotherhood] overseeing the death ritual.`,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Yoghurt]',
// 				sublocation: 'Outside the Fortress',
// 				description: `The party recovers from the explosion and their shared visions. [ENTITY:npc:Yoghurt] appears, having followed them, dragging corpses of shadow-clad scouts with blackened veins. [ENTITY:character:Bonnie] discovers they're foreigners, likely corrupted agents.`,
// 			},
// 			{
// 				type: 'narrative',
// 				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Yoghurt]',
// 				sublocation: 'Outside the Fortress',
// 				description: `[ENTITY:character:Bonnie] writes an urgent letter to [ENTITY:npc:Soranna] detailing the approaching army's four-day timeline, the visions, enemy factions (Red Hand, Blue Bear, [ENTITY:guild:Arcane Brotherhood], chromatic dragons), and warns against trusting the [ENTITY:guild:Arcane Brotherhood]. She pays [ENTITY:npc:Yoghurt] three gold and makes him swear to deliver it only to [ENTITY:npc:Soranna], not [ENTITY:npc:Kat], promising his Raven master will hear of his service.`,
// 			},
// 			{
// 				type: 'traversal',
// 				actors: '[ENTITY:character:Entire party:Party]',
// 				sublocation: 'Towards the Bridge',
// 				description: `Armed with knowledge of the apocalyptic future, the party sets off toward their immediate goal: reaching and destroying the bridge to buy the North time against the coming war.`,
// 			},
// 		],
// 	},
// ];

const CAMPAIGN_002_TIMELINE = [
	{
		id: 1,
		title: `Ambush and Interrogation`,
		location: `Woods near [ENTITY:location:Drellin's Ferry]`,
		session: '1',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
		},
		description: `The party travels through the subtropical forest toward [ENTITY:location:Drellin's Ferry], where they encounter a critical ambush.`,
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'forest-travel' },
				description: `The party makes their way through a dense subtropical forest toward their destination.`,
			},
			{
				type: 'encounter',
				actors: 'Hobgoblins',
				sublocation: 'Abandoned Farmhouse',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'farmhouse-ambush' },
				description: `The party spots an abandoned farmhouse in a shallow dell. [ENTITY:character:Bonnie] correctly identifies it as a potential ambush site. A battle ensues with a group of hobgoblins. Despite terrain and fatigue challenges, the party coordinates their attacks—[ENTITY:character:Norr] (lightning), [ENTITY:character:Soshi] (fire), [ENTITY:character:Kaedin] (echo strike), [ENTITY:character:Olek] (melee), and [ENTITY:character:Bonnie] (dagger)—to defeat them. They manage to kill the enemy captain, causing the remaining forces to retreat.`,
			},
			{
				type: 'narrative',
				actors: 'Hobgoblin interrogation',
				sublocation: 'Abandoned Farmhouse',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'interrogation' },
				description: `The party captures one hobgoblin survivor. The initial interrogation fails until [ENTITY:character:Olek] casts Zone of Truth and promises the creature a swift death in exchange for answers. They learn of Wyrmlord Koth, a captain gathering tribes for "the Day of Ruin," though the plans and location remain vague or refused. [ENTITY:character:Olek] honors his word, releasing and killing the hobgoblin. The party then takes the precaution of burning three dead travelers' bodies found nearby to prevent their misuse.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Olek] and [ENTITY:character:Bonnie], farmer and sons',
				sublocation: "Path to [ENTITY:location:Drellin's Ferry]",
				url: { campaign: 'campaign-002', session: 'session-002', target: 'civilian-scare' },
				description: `A farmer and his two sons walk toward the abandoned farmhouse. [ENTITY:character:Olek]'s attempt to warn them fails as they panic at his appearance. [ENTITY:character:Bonnie] telepathically scares them ("Boo"), causing them to flee. [ENTITY:character:Bonnie] collects supplies the civilians left behind, and [ENTITY:character:Olek] returns most of them, keeping only some spoiled wine.`,
			},
		],
	},
	{
		id: 2,
		title: `Arrival and Investigation in [ENTITY:location:Drellin's Ferry]`,
		location: `[ENTITY:location:Drellin's Ferry]`,
		session: '1',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
		},
		description: `The party arrives at the river town of [ENTITY:location:Drellin's Ferry] and splits up to gather intelligence.`,
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'arrival' },
				description: `The party arrives at [ENTITY:location:Drellin's Ferry], a town situated along the river, using ferryboats in place of a missing bridge. They note the presence of orchards, fields, and five watchtowers. They are met by town guards led by Sergeant Hersk, who briefs them on local dangers (Witchwood, goblins, orcs, undead rumors) before providing directions.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Olek], [ENTITY:character:Bonnie], [ENTITY:npc:Sorana], [ENTITY:npc:Norro]',
				sublocation: 'Tollhouse',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'tollhouse-meeting' },
				description: `[ENTITY:character:Olek] and [ENTITY:character:Bonnie] head to the Tollhouse to contact [ENTITY:npc:Sorana] and report the ambush. [ENTITY:character:Bonnie] delivers an artifact from Rilon Paln. [ENTITY:npc:Sorana] identifies one item as Dead Man's Boots, last held by the necromancer Nels Huto, who was heading into the Witchwood. They also discuss local threats with a man named Norro, learning raids are ongoing and a base is likely deep in the Witchwood. The party is offered a reward to stop the raiders. [ENTITY:character:Olek] and [ENTITY:character:Bonnie] then leave to reunite with the party.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Norr], [ENTITY:character:Soshi], [ENTITY:npc:Brother Denny], [ENTITY:npc:Avartel]',
				sublocation: 'Shrine of Pelor',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'shrine-meeting' },
				description: `[ENTITY:character:Norr] and [ENTITY:character:Soshi] visit the Shrine of Pelor (purchasing offerings first) and speak with Brother Denny and the druid Avartel. [ENTITY:npc:Avartel] provides key information on the Witchwood, mentioning a cursed fortress called Wrath Keep haunted by skeletons. [ENTITY:npc:Brother Denny] accepts the offerings and attempts to sell them wares. They depart for the meeting point.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Kaedin], [ENTITY:npc:Sertieren]',
				sublocation: 'Sertieren Mansion',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'sertieren-meeting' },
				description: `[ENTITY:character:Kaedin] goes to the mansion of the wizard Sertieren, encountering a speaking magical fountain. The wizard answers questions about Talos, disappearances, and magical phenomena, mentioning rumors of the Chronomancers of Krynn being killed by dragons. He points out a powerful magical nexus in the Witchwood and comments on local defenses. [ENTITY:character:Kaedin] then departs for the meeting point.`,
			},
		],
	},
	{
		id: 3,
		title: `The Fickle Feather Tavern Encounters`,
		location: `[ENTITY:location:Drellin's Ferry]: The Fickle Feather Tavern`,
		session: '2',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
		},
		description: `The party meets at the tavern, where they encounter mercenaries and bounty hunters and exchange information.`,
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Town Market',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'market-healing' },
				description: `Upon arrival at the tavern by sundown, [ENTITY:character:Olek] leaves to find and heal a girl in the market after [ENTITY:character:Soshi] and [ENTITY:character:Norr] share details of their earlier encounter. [ENTITY:character:Kaedin] withholds some information from the group, claiming his investigation yielded nothing useful.`,
			},
			{
				type: 'narrative',
				actors:
					'[ENTITY:character:Entire party:Party], [ENTITY:npc:Tharma], [ENTITY:guild:Winter Rose] mercenaries, Iron Wolves bounty hunters',
				sublocation: 'Tavern main room',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'tavern-entry' },
				description: `While [ENTITY:character:Olek] is away, the rest of the party enters the tavern. [ENTITY:character:Bonnie] secures a table by throwing her rat familiar, [ENTITY:npc:Jacques]. [ENTITY:character:Norr] identifies two key groups: two [ENTITY:guild:Winter Rose] mercenaries (a known company from Luskan) and a group from the Iron Wolves (identified by [ENTITY:character:Olek] as bounty hunters), both of whom were signaling each other. The dwarven innkeeper, Tharma, takes their orders. [ENTITY:character:Bonnie] amuses herself by cheating at dice with villagers, getting caught, but successfully pick-pocketing one of them. [ENTITY:character:Jacques] causes minor chaos by drinking and eating.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Olek], [ENTITY:guild:Winter Rose] mercenaries',
				sublocation: 'Tavern main room',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'spellcaster-detection' },
				description: `Suspicion arises toward the two mercenary tables, but they receive only deflective answers. The [ENTITY:guild:Winter Rose] group notices the party's spellcasting; their female member is noted to be a spellcaster capable of detecting magic or abilities within 60 ft. [ENTITY:character:Soshi] and [ENTITY:character:Norr] noted that the [ENTITY:guild:Arcane Brotherhood] has been uncooperative recently.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Kaedin], [ENTITY:npc:June Takahashi]',
				sublocation: 'Tavern',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'midnight-debrief' },
				description: `Late at night, the [ENTITY:guild:Winter Rose] spellcaster, June Takahashi, requests a private word with [ENTITY:character:Kaedin]. They exchange intelligence regarding the hobgoblin raids and incursions. The mercenaries are primarily looking for a large spider bounty. The departure is friendly and informational.`,
			},
		],
	},
	{
		id: 4,
		title: `Approach to the Rigged Bridge`,
		location: `Woods outside [ENTITY:location:Drellin's Ferry]`,
		session: '2',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
		},
		description: `The party attempts to make their way to the suspected raider location, navigating the challenging terrain and making preparations for stealth.`,
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'offroad-travel' },
				description: `In the morning, [ENTITY:character:Soshi] disguises herself with a spell, and [ENTITY:character:Norr] is disguised via magical makeup by [ENTITY:character:Bonnie]. The party sets out of town, moving off-road and briefly getting lost and going in circles before correcting their path.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Lake',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'bridge-scouting' },
				description: `The party reaches a lake overlooking a bridge. Choosing a stealth approach, they move by swimming or flying low. They discover the bridge is rigged with explosives. Beneath the bridge in the swamp, they find a huge mound of bodies.`,
			},
		],
	},
	{
		id: 5,
		title: `Bridge Combat and Retreat`,
		location: `Lake and Bridge (near [ENTITY:location:Witchwood])`,
		session: '2',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
		},
		description: `The party engages in a challenging fight at the bridge and is ambushed during their retreat.`,
		items: [
			{
				type: 'encounter',
				actors: 'Hydra, Goblins, Wargs',
				sublocation: 'Bridge and Lake',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'hydra-fight' },
				description: `The party is attacked by a formidable opponent: a hydra, along with several goblins and wargs. The fight is challenging but ultimately successful. [ENTITY:character:Bonnie] successfully disarms all the explosive traps on the bridge and loots the area.`,
			},
			{
				type: 'encounter',
				actors: 'Warg Riders',
				sublocation: 'Road back to town',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'warg-ambush' },
				description: `On the way back to town, the party is ambushed multiple times by warg riders. After engaging in two additional skirmishes, the group opts to retreat and return to [ENTITY:location:Drellin's Ferry].`,
			},
		],
	},
	{
		id: 6,
		title: `[ENTITY:location:Drellin's Ferry] Briefing and Town Intel`,
		location: `[ENTITY:location:Drellin's Ferry]: Tollhouse and [ENTITY:location:Green Apple Inn]`,
		session: '3',
		url: {
			campaign: 'campaign-002',
			session: 'session-003',
		},
		description: `The party returns to town, reports their findings to [ENTITY:npc:Soranna], deals with pressing civilian matters, and receives the next mission.`,
		items: [
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Soranna]',
				sublocation: 'Tollhouse Basement',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'soranna-briefing' },
				description: `The party returns to [ENTITY:location:Drellin's Ferry] and meets with Captain [ENTITY:npc:Soranna] at the Tollhouse. Due to their filthy state and the need for discretion, they are led to the basement for a private briefing. They report sightings of mauled corpses, green-cloaked figures, a missing woodsman, and the hydra encounter. [ENTITY:npc:Soranna] marks the incidents on a map with red-flagged pins, rewards them with 10 gold pieces, and reveals a vast cave system beneath the city—a potential secret invasion route. She informs them two agents will meet them the following morning.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Soshi], [ENTITY:npc:Tharma], Townsfolk',
				sublocation: "[ENTITY:location:Green Apple Inn] and [ENTITY:npc:Anya]'s Home",
				url: { campaign: 'campaign-002', session: 'session-003', target: 'hydra-eggs-and-anya' },
				description: `After returning to the [ENTITY:location:Green Apple Inn] to clean up, [ENTITY:character:Soshi] discovers two hydra eggs in her pack, at risk of hatching due to the warmth. The innkeeper, Tharma, informs them that her young assistant, [ENTITY:npc:Anya], is missing. At [ENTITY:npc:Anya]'s home, they find dried blood and a love letter to [ENTITY:npc:Lem] (a town guard). Suspicious townsfolk observe them, and gossip reveals [ENTITY:npc:Anya] had been romantically involved with multiple men until six months prior.`,
			},
			{
				type: 'encounter',
				actors: '[ENTITY:guild:Winter Rose] Mercenaries, Townsfolk',
				sublocation: '[ENTITY:location:Green Apple Inn]',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'winter-rose-intel' },
				description: `The party reunites with the [ENTITY:guild:Winter Rose] mercenaries, [ENTITY:npc:Vandal] and [ENTITY:npc:Summoner], who narrowly escaped an ambush in the eastern woods. Their attackers included giant raptors and thylacoleos, some marked with shackles, suggesting another hobgoblin clan. The raptors were noted to be afraid of fire and strong light. Later, upon returning to the inn, the party finds 10–15 drunken townsfolk attacking [ENTITY:npc:Vandal] and [ENTITY:npc:Summoner] after an attempted groping of [ENTITY:npc:Vandal]. The party non-lethally subdues the brawl, and [ENTITY:npc:Tharma] thanks them for restoring order.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
				sublocation: 'Town (Morning)',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'agents-meeting' },
				description: `The party meets with the agents, [ENTITY:npc:Kat] (Tiefling, surrounded by cats and a tiger) and [ENTITY:npc:Yoghurt] (half-ogre ninja). [ENTITY:character:Bonnie] recognizes them. They confirm the cave system is connected to an old temple blocked by a magical barrier that only outsiders like the party can pass. [ENTITY:npc:Kat] asks for gold to repay debts, which the party refuses. The thieves are cautious, fearing the [ENTITY:guild:Winter Rose] mercenaries.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Lem]',
				sublocation: 'Barracks',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'lem-account' },
				description: `The party visits [ENTITY:npc:Lem] at the barracks, a young, pudgy human guard. He confesses to a casual relationship with [ENTITY:npc:Anya] but was unaware of her pregnancy. He reveals their meeting spot near a forest pond and describes a recent attack by worg riders that resulted in his minor injuries.`,
			},
		],
	},
	{
		id: 7,
		title: `The Druid's Grove and [ENTITY:npc:Anya]'s Rescue`,
		location: `[ENTITY:location:Avarthel's Grove]`,
		session: '3',
		url: {
			campaign: 'campaign-002',
			session: 'session-003',
		},
		description: `The party visits the druid [ENTITY:npc:Avarthel] for counsel and healing, leading to the successful rescue of the missing assistant, [ENTITY:npc:Anya].`,
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Avarthel]',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'druid-counsel' },
				description: `The party approaches [ENTITY:npc:Avarthel] while he is mid-wedding. He leads them to his grove near the Feywild, where the natural energy rejuvenates the party members, [ENTITY:character:Bonnie], and [ENTITY:npc:Jacques]. [ENTITY:npc:Avarthel] refuses to hatch the hydra eggs due to ecological danger but agrees to store them securely. He states only druids in Ramashen could return them to the Feywild. He also provides tactical advice: thylacoleos could be distracted with honey.`,
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Anya], [ENTITY:npc:Loïc]',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'anya-rescue' },
				description: `Following [ENTITY:npc:Lem]'s directions, the party finds [ENTITY:npc:Anya] near the forest pond—weak, bleeding, delirious, and attempting suicide. [ENTITY:character:Kaedin] renders her unconscious for safe transport while [ENTITY:character:Bonnie] comforts her. They take her to [ENTITY:npc:Avarthel]'s grove, where Loïc (a phoenix) sheds healing tears upon her. [ENTITY:npc:Avarthel] then escorts [ENTITY:npc:Anya] deeper into the forest for long-term recovery.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Jareth]',
				sublocation: 'Town Market',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'potion-purchase' },
				description: `The party purchases ten lesser healing potions from Jareth, an illusion-cloaked, nearly nude drow, before moving on to their main objective.`,
			},
		],
	},
	{
		id: 8,
		title: `Into the Sunken Temple`,
		location: `Old Sunken Temple (Cave System)`,
		session: '3 & 4',
		url: {
			campaign: 'campaign-002',
			session: 'session-003',
		},
		description: `Guided by agents, the party enters the Sunken Temple through a magical barrier and faces the initial hazards of the reptilian path.`,
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'temple-entry' },
				description: `Joining [ENTITY:npc:Kat] and [ENTITY:npc:Yoghurt], the party enters the partially submerged temple. As predicted, the magical barrier allows only the party entry, rejecting the city affiliates. The agents instruct the party to collapse the tunnels after their mission. The party finds a superior stone ring with skeletal remains and weapons near two doors: a reptile carving (the party's chosen path) and a storm cloud carving (the mercenaries' path).`,
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Reptilian Path Corridor',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'path-hazards' },
				description: `The party navigates the initial hazards of the Reptilian Path using stealth and magic, including Pass Without Trace, Misty Step, Fly, and [ENTITY:character:Kaedin]'s Echo teleportation. They bypass a poisonous gas cloud ([ENTITY:character:Kaedin] damaged, [ENTITY:character:Bonnie] triggers a fire trap), venomous snakes and spiders, and a flooded pond containing giant leeches and a sleeping red-eyed guardian.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Laboratory of Horrors',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'laboratory-discovery' },
				description: `The party enters the Laboratory of Horrors, finding a note detailing demon disciples’ experiments involving the breeding of monsters for infernal tournaments. A red glow in the water reveals treasure hidden among piranhas, snakes, and human-sized bats. They find electronic devices, dissected monsters, and the entrance to the arena.`,
			},
			{
				type: 'encounter',
				actors: 'Massive Reptile, Spiders',
				sublocation: 'Final Laboratory',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'reptile-fight' },
				description: `A massive reptile attacks the party. [ENTITY:character:Kaedin] and [ENTITY:character:Olek] are frightened. [ENTITY:character:Soshi] observes approaching spiders. [ENTITY:character:Bonnie] lands a critical hit, and [ENTITY:character:Kaedin] deals substantial damage. [ENTITY:character:Soshi] ends the combat by polymorphing the reptile into a harmless caterpillar.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:guild:Winter Rose] Mercenaries',
				sublocation: 'Final Laboratory',
				url: { campaign: 'campaign-002', session: 'session-003', target: 'temple-closure' },
				description: `The party loots the area, finding jewelry (10 gold), vials of elixirs, a magical bow, and an enchanted helmet. They coordinate with the mercenaries (presumably via communication) to press runes, collapsing arena skeletons into a pit. The coordinated action opens a third passage while the previous corridor is sealed, forcing the party to continue exploration through the new route.`,
			},
			{
				type: 'investigation',
				is_new_session: true,
				actors: '[ENTITY:character:Norr], [ENTITY:character:Kaedin]',
				sublocation: 'Ritual Site and Barracks',
				url: { campaign: 'campaign-002', session: 'session-004', target: 'cavern-discovery' },
				description: `The party emerges into a huge cavern filled with magically reinforced cages containing dozens of skulls (humanoid, reptilian, and unknown). [ENTITY:character:Norr] identifies remnants of a powerful ritual—burned reagents, shattered crystals, and magical residue suggesting a recent summoning or transportation spell. An adjacent chamber contains makeshift barracks for 20 soldiers, now abandoned. [ENTITY:character:Norr] chooses not to risk bypassing the illusion script ward on the obscured text in the ledger.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Norr]',
				sublocation: 'Arcane Tent',
				url: { campaign: 'campaign-002', session: 'session-004', target: 'ledger-deciphering' },
				description: `[ENTITY:character:Kaedin] recovers a half-burned ledger from a tent containing arcane materials. Decipherable entries, signed by Calistra of the Brotherhood, reveal: all combatants completed "arena trials;" a figure named Kilgor was collecting them for the "Festival of Life;" and plans to travel to Luskan via pirates, leaving treasure at "the old fort north of the woods." [ENTITY:character:Norr] recognizes Calistra as her former teacher, an alteration specialist known for "mind spiking" students, who left the Brotherhood 10 years prior.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Cavern',
				url: { campaign: 'campaign-002', session: 'session-004', target: 'crystal-insects' },
				description: `Large, female mosquito-like insects are found clinging to luminous crystals (white, yellow, purple) throughout the cavern. The party refrains from disturbing them.`,
			},
			{
				type: 'encounter',
				actors: 'Megatherium, [ENTITY:character:Olek], [ENTITY:character:Norr], [ENTITY:character:Bonnie]',
				url: { campaign: 'campaign-002', session: 'session-004', target: 'megatherium-taming' },
				description: `The party encounters two massive sloth-bear-like creatures, Megatherium (8 feet tall). [ENTITY:character:Olek]'s Divine Sense confirms they are natural. [ENTITY:character:Norr] identifies them (suffering 3 psychic damage from a "mind spike" flashback) as prehistoric, crossbred, fear-resistant beasts with Broken Shackle Tribe markings. [ENTITY:character:Bonnie] successfully befriends them, naming them Gică and Mișu. [ENTITY:character:Bonnie] later persuades the Megatherium to follow and assist them through an underground lake where a ship's prow is lodged 90 ft deep.`,
			},
			{
				type: 'encounter',
				actors: 'Arthropleura fersanguinus ("Spitters"), Dridder Commanders',
				sublocation: 'Underwater Passage Approach',
				url: { campaign: 'campaign-002', session: 'session-004', target: 'spider-ambush' },
				description: `The party is ambushed by Arthropleura fersanguinus ("Spitters")—giant millipede-like creatures with acidic blood belonging to the Te Snatchers goblin clan. [ENTITY:character:Norr] suffers another mind spike flashback. The acidic blood melts [ENTITY:character:Olek]'s armor and shield. The Megatherium turn feral, with Mișu gaining a combat buff after a kill. [ENTITY:character:Norr] uses large-scale fire spells, and [ENTITY:character:Kaedin] uses his Sacred Weapon. Dridder-like commanders are defeated, but the party is left heavily damaged and their gear degraded.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Bonnie], Megatherium',
				sublocation: 'Post-Combat',
				url: { campaign: 'campaign-002', session: 'session-004', target: 'venom-intel' },
				description: `The party loots the area, harvesting Arthropleura venom and finding 10 Garlic Agaricoms (toxic mushrooms used to craft King’s Blood Venom). [ENTITY:character:Bonnie] communicates with Gică and Mișu, learning their previous handlers (Broken Shackle tribe) left two weeks earlier, answering “the call of the Red Hand.”`,
			},
		],
	},
	{
		id: 12,
		title: `The Great Escape and Capture`,
		location: `Sea near [ENTITY:location:Drellin's Ferry]`,
		session: '4 & 5',
		url: {
			campaign: 'campaign-002',
			session: 'session-004',
		},
		description: `The party reunites with the mercenaries for a chaotic escape that leads to an unexpected confrontation with a pirate-paladin galleon.`,
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:guild:Winter Rose] Mercenaries',
				sublocation: 'Collapsing Tunnels',
				url: { campaign: 'campaign-002', session: 'session-004', target: 'ship-escape' },
				description: `The party reunites with [ENTITY:npc:Vandal] and the [ENTITY:npc:Summoner], who were freeing a partially submerged pirate ship. [ENTITY:npc:Vandal] triggers an explosion that opens a path, sending the ship hurtling through the collapsing tunnels. The party is swept along with the vessel as the cave system collapses, emerging from a mountain waterfall and crashing into the sea below. Several members are injured; [ENTITY:character:Norr] uses Alter Self to survive, and the [ENTITY:npc:Summoner]'s magical dolphins rescue survivors.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Olek], War Galleon Crew (Pirates and Paladins)',
				sublocation: 'Open Sea',
				url: { campaign: 'campaign-002', session: 'session-004', target: 'pirate-paladin-capture' },
				description: `As the exhausted, half-armored party regroups at sea, a war galleon flying a pirate flag approaches. Boarding parties consist of both pirates and paladins. They are hailed as "new guests" by emissaries of Captain Bianca Turiados. The name alarms [ENTITY:character:Olek] as Commander Turiados is the paladin he has been seeking. The party is brought aboard as "guests" or captives, ending the session on a cliffhanger.`,
			},
			{
				type: 'narrative',
				is_new_session: true,
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Bianca Corina], [ENTITY:npc:Commander Turiados]',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'leviathan-hall' },
				description: `The party is pulled from the sea and finds themselves aboard the massive black warship, The Leviathan’s Hall. They are greeted by Commander Turiados (a towering warrior with Sahuagin markings and the Breaker of Hulls cutlass) and Commander Bianca Corina (fey-touched Queen-in-exile of Pelagos, wielding Winder, a storm-forged glass blade). Both weapons are identified as Brotherhood relics. [ENTITY:character:Soshi] explains their escape, but [ENTITY:npc:Bianca] and [ENTITY:npc:Turiados] are confused, realizing they are displaced from their homeland of Lustria.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Marise Curs], [ENTITY:npc:Glass]',
				sublocation: 'Ship Deck',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'ship-gossip' },
				description: `The deck is chaotic, hosting various species, including a minotaur and an Efreeti in the forge. [ENTITY:character:Bonnie] contacts [ENTITY:npc:Vandal] telepathically, who warns against provoking the pirates. [ENTITY:character:Bonnie] befriends Marise Curs, a peg-legged pirate, and learns the crew is magically bound by a blood oath to [ENTITY:npc:Bianca]'s family, having been freed from a penal colony by a convict general named Ilie. [ENTITY:character:Bonnie] also meets Glass, the massive Ice Elemental quartermaster, who confirmed [ENTITY:npc:Bianca] earned his eternal loyalty by freeing him from servitude.`,
			},
			{
				type: 'narrative',
				actors:
					'[ENTITY:character:Entire party:Party], [ENTITY:npc:Bianca Corina], [ENTITY:npc:Commander Turiados], [ENTITY:npc:Glass]',
				sublocation: 'Helm',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'negotiation-and-curse' },
				description: `[ENTITY:character:Soshi] realizes the ship is sailing away from [ENTITY:location:Drellin's Ferry] and convinces the group to negotiate. [ENTITY:npc:Turiados]'s magical compass stops spinning, pointing at [ENTITY:character:Soshi] (revealing "the direction of one's greatest desire"). [ENTITY:npc:Turiados] offers to trade the compass for a locket of hair from the necromancer Sandro and gives them a carved whistle to guide them. [ENTITY:npc:Glass] appraises their items for the 20% "rescue fee." [ENTITY:character:Bonnie] mentions a cursed coin, leading [ENTITY:npc:Glass] to confirm the curse had spread, turning all the party's gold into unstable, near-worthless copper. The pirates confiscate [ENTITY:character:Olek]'s javelins, [ENTITY:character:Norr]'s climbing rope, and several pearls. [ENTITY:character:Bonnie]'s attempt at petty revenge with a cursed coin results in [ENTITY:npc:Bianca] blasting her with force magic. [ENTITY:npc:Turiados] orders them "Row them to shore."`,
			},
		],
	},
	{
		id: 14,
		title: `Stranded and Ambushed`,
		location: `Rocky Coast and Oak Forest`,
		session: '5',
		url: {
			campaign: 'campaign-002',
			session: 'session-005',
		},
		description: `The party is left ashore and ambushed by thylacoleos during their journey back to [ENTITY:location:Drellin's Ferry].`,
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:guild:Winter Rose] Mercenaries',
				sublocation: 'Rocky Beach',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'stranded-and-shelter' },
				description: `The party, along with the mercenaries [ENTITY:npc:Vandal] and Scoundrel, is cast adrift and left on a rocky beach. The mercenaries immediately depart north on their reptilian mounts, warning of undead pirates. [ENTITY:character:Soshi] calculates they are 6-7 hours from [ENTITY:location:Drellin's Ferry] and finds a small cave for shelter, where [ENTITY:character:Bonnie] sets two concealed bear traps. [ENTITY:character:Bonnie] catches a giant seagull in her trap during her watch.`,
			},
			{
				type: 'encounter',
				actors: 'Thylacoleo Predators',
				sublocation: 'Dense Oak Forest',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'thylacoleo-fight' },
				description: `Journeying inland, the party is ambushed by three large marsupial predators in a clearing. [ENTITY:character:Kaedin] is mauled and grappled but escapes via [ENTITY:subclass:Echo Knight] abilities. [ENTITY:character:Soshi] is dragged into a tree but escapes using Misty Step and Mirror Image. The battle turns when [ENTITY:character:Soshi] Polymorphs [ENTITY:character:Norr] into a Giant Ape. [ENTITY:character:Bonnie] finishes the final beast. They salvage three intact pelts and six fangs.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Thylacoleo Den',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'cub-discovery' },
				description: `After the fight, the group discovers seven Thylacoleo cubs in a tree hollow and decides to care for them, needing to find a safe way to transport and house them.`,
			},
		],
	},
	{
		id: 15,
		title: `Trade, Debt, and Magical Intel`,
		location: `[ENTITY:location:Drellin's Ferry]: Town Square and Sertieren's Mansion`,
		session: '5 & 6',
		url: {
			campaign: 'campaign-002',
			session: 'session-005',
		},
		description: `The party manages their new financial reality, secures their animal companions, and gains critical information about their enemies from the town wizard.`,
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Avarthel], [ENTITY:npc:Brother Denny]',
				sublocation: 'Town',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'failed-aid' },
				description: `The party finds [ENTITY:npc:Avarthel]'s druid grove empty (his snake guardian reports he is gone for months). [ENTITY:character:Norr] seeks help from Brother Denny at the shrine, who is unhelpful. A goat-herd provides milk for the cubs in exchange for gold.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Sertieren the Wise]',
				sublocation: 'Sertieren Mansion',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'cub-containment' },
				description: `[ENTITY:character:Bonnie] visits Sertieren the Wise, the town wizard, who offers containment spheres for the cubs at one gold each, requiring magical naming attunement. Lacking money, [ENTITY:character:Bonnie] agrees to "collateral," receiving a magical debt brand on her wrist. The cubs are named and secured in their spheres: Tom, Garfield, Milly, Yoli, Avatar, and Bella.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Sertieren the Wise]',
				sublocation: 'Sertieren Mansion',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'potion-and-calistra-intel' },
				description: `The party sells various goods to regain solvency: Storm Dust (15 gold) and Cave worm head & mushrooms (10 gold), while keeping the Thylacoleo pelts for armor reinforcement. [ENTITY:npc:Sertieren] identifies their alchemical vials: Green - Demonic Vitality Serum, White - Potion of Celerity, and "Hops" - Poison Immunity with an explosive side effect. Critically, [ENTITY:npc:Sertieren] confirms knowledge of Kalistra, [ENTITY:character:Norr]'s old teacher, revealing she was his former companion before she joined the Brotherhood. He warns that recent events are portents of a coming storm and intends to leave [ENTITY:location:Drellin's Ferry] soon.`,
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: '[ENTITY:location:Green Apple Inn]',
				url: { campaign: 'campaign-002', session: 'session-005', target: 'session-end-rest' },
				description: `The party rests at the inn, having financially recovered and secured their new cub companions, preparing for the next stage of their investigation.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Olek], Innkeeper',
				is_new_session: true,
				url: { campaign: 'campaign-002', session: 'session-006', target: 'blessed-stew' },
				description: `The party arrives at the inn around 8 p.m. exhausted. The innkeeper is testing a new stew recipe (mushroom and exotic herbs). [ENTITY:character:Olek] blesses the stew, granting temporary hit points to those who eat it. The innkeeper, pleased, waives the party's room fees in gratitude.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], Thylacoleo Cubs',
				sublocation: 'Guest Rooms and Kitchen',
				url: { campaign: 'campaign-002', session: 'session-006', target: 'feline-mayhem' },
				description: `The party releases their magical Thylacoleo cubs (which require 48 hours outside their spheres). [ENTITY:character:Kaedin]'s cats consume milk, then escape through a wall, hunting numerous animals (pigeons, dogs, a seagull, etc.), leaving a massive hole to the street. [ENTITY:character:Norr]'s cat climbs walls, damaging the room. At dawn, the innkeeper screams as [ENTITY:character:Olek]'s cat, Palo, had raided the kitchen. [ENTITY:character:Olek] compensates the innkeeper with 1 gp for the kitchen damage. The innkeeper also discovers [ENTITY:character:Kaedin]'s damaged room and demands 5 silver per night until repairs are made. The group decides to return all cats to their spheres for safety.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Jaret], Honey Vendor',
				sublocation: 'Market',
				url: { campaign: 'campaign-002', session: 'session-006', target: 'resupply-and-gems' },
				description: `The party goes to the market to resupply. Posters of missing pets cover the town, a result of [ENTITY:character:Kaedin]'s cats' hunt. They find a honey vendor selling 30+ types of honey, including exotic pink-glowing varieties recognized by [ENTITY:character:Soshi] as key for training magical mounts; they purchase several jars and a barrel. At the general store, run by [ENTITY:npc:Jaret], they sell uncut gems for 10 gp after discovering their pearls were fakes. [ENTITY:character:Soshi] and [ENTITY:character:Norr] buy elegant new robes.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Olek], [ENTITY:character:Kaedin], Dwarf Smith, Gnome Partner',
				sublocation: "The Armorer's Forge",
				url: { campaign: 'campaign-002', session: 'session-006', target: 'armor-and-reinforcement' },
				description: `At the forge, [ENTITY:character:Olek] uses a discount note from [ENTITY:npc:Noro] for a 20% discount. [ENTITY:character:Kaedin] buys Splint Mail and [ENTITY:character:Olek] buys Chain Mail. The smith examines the "Taylas" pelts (Thylacoleo), recognizing them as rare, and offers to reinforce three armors for 1 gp each. The group sells two pelts and uses the third for reinforcement on [ENTITY:character:Olek]'s, [ENTITY:character:Kaedin]'s, and [ENTITY:character:Bonnie]'s armor, giving them enhanced physical and magical resistance.`,
			},
			{
				type: 'investigation',
				actors:
					'[ENTITY:character:Olek], [ENTITY:character:Kaedin], [ENTITY:character:Bonnie], [ENTITY:npc:Captain Sorana]',
				sublocation: 'Barracks',
				url: { campaign: 'campaign-002', session: 'session-006', target: 'new-contract' },
				description: `While waiting for the armor, they report to Captain Sorana. [ENTITY:character:Olek] and [ENTITY:character:Kaedin] assist in drilling her recruits. [ENTITY:character:Bonnie] uses Mage Hand for pranks. They report their findings from the temple ruins and pirate encounter. [ENTITY:npc:Sorana] confirms reports of robbed ships. She awards them 20 gp for the temple mission and assigns a new task: investigate four missing barbarian riders last seen in the Witchwood, northwest of town.`,
			},
		],
	},
	{
		id: 18,
		title: `The Trail of Carnage`,
		location: `Road to the [ENTITY:location:Witchwood]`,
		session: '6',
		url: {
			campaign: 'campaign-002',
			session: 'session-006',
		},
		description: `The party sets out towards the Witchwood, quickly encountering evidence of a recent, brutal orc raid.`,
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party], Thylacoleo Cubs',
				url: { campaign: 'campaign-002', session: 'session-006', target: 'march-with-honey' },
				description: `The party retrieves their reinforced armor and departs. They bring the barrel of honey on [ENTITY:character:Olek]'s spectral steed and release their cats to travel alongside them.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Bonnie]',
				url: { campaign: 'campaign-002', session: 'session-006', target: 'caravan-massacre' },
				description: `Hours into their journey, they discover the remains of two burned caravans and ten civilian victims (men, women, and children). [ENTITY:character:Bonnie] tracks the culprits: approximately 20 orcs on Warg-back, heading northwest toward the [ENTITY:location:Witchwood]. The attack was recent (the previous night). The group advances cautiously.`,
			},
		],
	},
	{
		id: 19,
		title: `Trial by Fire at the Ruined Fortress`,
		location: `[ENTITY:location:Ruined Fortress] (Witchwood)`,
		session: '6 & 7',
		url: {
			campaign: 'campaign-002',
			session: 'session-006',
		},
		description: `The party executes a surprise attack on an enemy outpost, leading to a massive, chaotic battle against multiple monster types.`,
		items: [
			{
				type: 'investigation',
				actors: '[ENTITY:character:Bonnie]',
				url: { campaign: 'campaign-002', session: 'session-006', target: 'fortress-scouting' },
				description: `The party arrives at a clearing with a ruined fortress. The forest is unnaturally lifeless. A single large skeleton patrols the battlements. [ENTITY:character:Bonnie] scouts via flight, spotting stables (with Hobgoblins playing dice), a ruined tower, and the main keep. She overhears the enemy, who knows the party is coming.`,
			},
			{
				type: 'encounter',
				actors: 'Hobgoblins, Wargs, Manticore, Minotaur, Mud Elemental, Warg Riders, Shaman',
				sublocation: 'Stable and Courtyard',
				url: { campaign: 'campaign-002', session: 'session-006', target: 'fortress-battle' },
				description: `The party initiates combat with a planned strike: [ENTITY:character:Soshi] casts Grease, followed by [ENTITY:character:Norr]'s Fireball, destroying the stable and incinerating several Hobgoblins. This triggers an all-out battle against a diverse array of foes, including a Manticore (which seizes and poisons [ENTITY:character:Olek] midair) and a Minotaur (which grapples [ENTITY:character:Norr]). [ENTITY:character:Bonnie] turns invisible and assassinates the shaman. [ENTITY:character:Kaedin] uses his Echo to flank, cutting down a Warg. The party utilizes high mobility and magic to free captured allies and defeat the enemies. The last shaman orders a retreat, warning, "Alert the Wormlord!" as he and the Minotaur flee. The combat ends with the fortress ablaze and the party victorious but exhausted.`,
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Fortress Courtyard',
				is_new_session: true,
				url: { campaign: 'campaign-002', session: 'session-007', target: 'regrouping' },
				description: `After the previous battle, the heavily injured party ([ENTITY:character:Kaedin] at 5 HP) regroups and decides against a short rest to maintain momentum. They patch wounds in a more defensible position. [ENTITY:character:Bonnie]'s familiar returns with a "gift" of fish. [ENTITY:character:Kaedin] uses hit dice to recover to 49 HP.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Bonnie], [ENTITY:character:Kaedin]',
				sublocation: 'Fortress Perimeter and Halls',
				url: { campaign: 'campaign-002', session: 'session-007', target: 'noisy-scouting' },
				description: `[ENTITY:character:Bonnie] scouts the perimeter (Investigation 21), discovering the main gate is locked and recommending the less-defended burned barracks route. Despite [ENTITY:character:Bonnie] leading the stealth approach, the party is audibly detected due to [ENTITY:character:Kaedin]'s "clink-clank" armor and [ENTITY:character:Soshi]'s torn cloak. [ENTITY:character:Bonnie] scouts alone, finding an empty throne room with torture devices and dead merchants, and recovers an uninterpretable tactical map.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Lower Tunnels',
				url: { campaign: 'campaign-002', session: 'session-007', target: 'war-intel' },
				description: `The party descends into lower tunnels, where [ENTITY:character:Bonnie] searches for traps. They analyze documents revealing a large enemy force marching toward [ENTITY:location:Drellin's Ferry] (ETA ≈ 4 days), estimated to be 19× greater than previous engagements. They identify a single bridge as a potential choke point. [ENTITY:character:Bonnie] notes signs of a red dragon's involvement (magical residue and claw marks). The discovery creates high urgency and internal debate over whether to warn the town or destroy the bridge.`,
			},
		],
	},
	{
		id: 21,
		title: `The Blood-Binding Ritual`,
		location: `[ENTITY:location:Ruined Fortress]: Ritual Chamber`,
		session: '7',
		url: {
			campaign: 'campaign-002',
			session: 'session-007',
		},
		description: `The party discovers the ritual site of their former mentor, [ENTITY:npc:Kalistra], and performs a dangerous blood ritual to breach the final chamber, resulting in a permanent shift in [ENTITY:character:Norr]'s power and alignment.`,
		items: [
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kalistra]',
				url: { campaign: 'campaign-002', session: 'session-007', target: 'ritual-discovery' },
				description: `The party investigates the right corridor (while sending a familiar left) and reaches a circular chamber with a blood-stained ritual circle and scattered corpses of mercenaries and rogues. They find [ENTITY:npc:Kalistra] among the dead, confirming her death during a suspended blood-binding ritual intended to open a sealed stone door. [ENTITY:character:Bonnie]'s Thieves’ Cant links the Arcane Seekers and the Brotherhood to this operation, fueling accusations of deception within the party.`,
			},
			{
				type: 'encounter',
				actors: 'Spectral Guardians',
				url: { campaign: 'campaign-002', session: 'session-007', target: 'ritual-combat' },
				description: `The party decides to complete the ritual to open the door. As they perform the necessary blood draw (Con save) and energy channeling (Cha check), the corpses animate as Spectral Guardians. The ghostly attacks drain memories, and [ENTITY:character:Olek]'s divine powers temporarily fail. [ENTITY:character:Norr] maintains focus under extreme pressure to channel the ritual's energy while allies defend her. [ENTITY:character:Soshi] debates using the energy of the bound souls but is reinforced in her good alignment by [ENTITY:character:Olek].`,
			},
			{
				type: 'narrative',
				actors:
					'[ENTITY:character:Norr], [ENTITY:character:Olek], [ENTITY:character:Bonnie], [ENTITY:character:Kaedin]',
				url: { campaign: 'campaign-002', session: 'session-007', target: 'ritual-climax' },
				description: `[ENTITY:character:Norr]'s ritual beam intensifies into a green-electric arc, shattering the door. She gains +2 3rd-level and +2 2nd-level spell slots permanently but suffers Intelligence -2 and her Alignment shifts to Neutral. During the final phase, concentrated ghost attacks drop [ENTITY:character:Norr] to 0 HP, causing her spirit to briefly separate before [ENTITY:character:Olek] stabilizes her with a potion. [ENTITY:character:Kaedin] and [ENTITY:character:Bonnie] land massive critical attacks to destroy the final ghosts.`,
			},
		],
	},
	{
		id: 22,
		title: `Corrupted Temple and Vault`,
		location: `[ENTITY:location:Ruined Fortress]: Temple and Vault`,
		session: '7 & 8',
		url: {
			campaign: 'campaign-002',
			session: 'session-007',
		},
		description: `The ritual opens the way to a final temple chamber, leading to another exhausting fight, the discovery of powerful loot, and a final confrontation with a still-living [ENTITY:npc:Kalistra].`,
		items: [
			{
				type: 'encounter',
				actors: 'Enemy Casters and Warriors',
				sublocation: 'Corrupted Temple',
				url: { campaign: 'campaign-002', session: 'session-007', target: 'temple-battle' },
				description: `The newly opened chamber triggers a massive fight against enemy casters and warriors. [ENTITY:character:Kaedin]'s Green-Flame Blade and a critical opportunity attack save [ENTITY:character:Norr] from execution. [ENTITY:character:Soshi] uses a modified *Aganazar’s Scorcher* as a healing conduit to restore 22 HP to [ENTITY:character:Norr] and others. [ENTITY:character:Norr] retaliates with Dragon’s Breath – Lightning (killing two enemies). [ENTITY:character:Olek] lands a critical smite (34 damage) to finish the final caster. The party is victorious but exhausted, with multiple members having fallen unconscious during the fight.`,
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Kalistra], Red Dragonkin, Orcs',
				sublocation: 'The Vault',
				url: { campaign: 'campaign-002', session: 'session-007', target: 'vault-discovery' },
				description: `An Investigation 27 reveals key loot: a Strength Belt (STR 18), Amulet of Absorption, a bone flute, a book (*The Deama Sutrel*), and strange mushrooms. The party proceeds to the final vault: a blackstone chamber containing the Null Brand (a black iron brand glowing with red runes). [ENTITY:npc:Kalistra] is found, aged and corrupted, bound to the Brand by arcane chains to contain its energy. [ENTITY:character:Bonnie] (Stealth Nat 20) recovers magical boots. [ENTITY:npc:Kalistra] requests aid to stabilize the Brand, hinting at plans to later claim it. Before the party can act, a red dragonkin and 20 orcs arrive, commanded by the dragonkin to "take the artifact!" The session ends with the party trapped between [ENTITY:npc:Kalistra] and the incoming dragon-led force.`,
			},
			{
				type: 'encounter',
				actors: 'Red-Armored Soldiers, Orcs, Dragonkin Commanders',
				is_new_session: true,
				url: { campaign: 'campaign-002', session: 'session-008', target: 'onslaught-begins' },
				description: `The session opens with an army of crimson-armored figures and orcish soldiers approaching through the breach. [ENTITY:character:Olek] warns the others of the "army coming" and orders [ENTITY:character:Kaedin] to close the breach. With no other option, [ENTITY:character:Bonnie] casts Fairy Fire to mark targets before disappearing into the chaos. [ENTITY:character:Olek], his divine connection severed by the artifact's corruption, fights on through martial skill alone.`,
			},
			{
				type: 'encounter',
				actors: '[ENTITY:character:Norr], [ENTITY:character:Soshi], Red-Armored Soldiers, Orcs',
				sublocation: 'Vault Interior',
				url: { campaign: 'campaign-002', session: 'session-008', target: 'wild-magic-fireball' },
				description: `[ENTITY:character:Norr]'s Wild Magic surges, triggering a Fireball centered on her, severely injuring her and [ENTITY:character:Soshi] but incinerating six enemies. Enemy archers destroy [ENTITY:character:Kaedin]'s Echo and overwhelm the defensive line, knocking [ENTITY:character:Olek] and [ENTITY:character:Kaedin] prone. [ENTITY:character:Norr] retaliates with Lightning Bolt, electrocuting seven orcs. [ENTITY:character:Soshi] releases additional spectral cats into the fight (one absorbing the lightning and gaining a temporary shield).`,
			},
			{
				type: 'encounter',
				actors: '[ENTITY:character:Bonnie], [ENTITY:character:Olek], Dragonkin',
				url: { campaign: 'campaign-002', session: 'session-008', target: 'tide-turning' },
				description: `The party turns the tide: [ENTITY:character:Olek] breaks a dragonkin's concentration with a warhammer strike, freeing his trapped cat familiar, which immediately slashes its former captor. [ENTITY:character:Bonnie] (under Greater Invisibility) teleports behind the second dragonkin commander using her medallion and delivers lethal dual strikes, killing a shaman outright and inflicting massive bleeding. [ENTITY:character:Soshi] harasses archers with acidic blasts that melt armor.`,
			},
		],
	},
	{
		id: 24,
		title: `Prophetic Visions of Ruin`,
		location: `[ENTITY:location:Ruined Fortress]: Artifact Explosion`,
		session: '8',
		url: {
			campaign: 'campaign-002',
			session: 'session-008',
		},
		description: `The artifact explodes, hurling the party into collective prophetic visions of a catastrophic future defined by a widespread cult-military alliance.`,
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Vault Chamber',
				url: { campaign: 'campaign-002', session: 'session-008', target: 'artifact-explosion' },
				description: `With the ritualist slain, the artifact destabilizes, emitting a wave of necrotic energy that weakens casters. It then explodes violently, obliterating the chamber and tearing the party's consciousnesses into individual prophetic visions of a ruined future. The recurring enemies are the Blue Bear sigil, Red Hand, [ENTITY:guild:Arcane Brotherhood], and chromatic dragons.`,
			},
			{
				type: 'narrative',
				actors:
					'[ENTITY:character:Olek], [ENTITY:character:Norr], [ENTITY:character:Kaedin], [ENTITY:character:Bonnie], [ENTITY:character:Soshi]',
				sublocation: 'Shared Prophecies',
				url: { campaign: 'campaign-002', session: 'session-008', target: 'visions-detailed' },
				description: `
                - [ENTITY:character:Olek] & [ENTITY:character:Norr]: Witness a Blighted [ENTITY:class:Paladin] Stronghold infiltrated by Lamashtu's cults after the Battle for Bremen. The fortress falls to the Angevin fleet and their resurrected god, Kresimir. [ENTITY:character:Norr] notes her future self has lost her right arm.
                - [ENTITY:character:Kaedin]: Sees his neighboring village burning, led by the Blue Bear sigil. Villagers are being taken for ritual sacrifice.
                - [ENTITY:character:Bonnie]: Witnesses the Fall of the Feywild and the annihilation of the Spring and Autumn Courts. Titania and the Queen of Air and Darkness fight a warrior wielding energy spears, later revealed as Kilgor, under banners of the Red Hand and Black Orcs.
                - [ENTITY:character:Soshi]: Is chained during the Siege of Neverwinter, where Red Wizards of Thay and Arcane Brotherhood mages lead the assault under Blue Bear banners, using prisoners' life force to destroy the city walls.`,
			},
		],
	},
	{
		id: 25,
		title: `The Final Warning`,
		location: `[ENTITY:location:Ruined Fortress]: Exit`,
		session: '8',
		url: {
			campaign: 'campaign-002',
			session: 'session-008',
		},
		description: `The party recovers, identifies the unifying enemy forces, and entrusts an urgent warning to [ENTITY:npc:Yoghurt] for [ENTITY:npc:Captain Soranna] in [ENTITY:location:Drellin's Ferry].`,
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Yoghurt]',
				sublocation: 'Fortress Exit',
				url: { campaign: 'campaign-002', session: 'session-008', target: 'recovery-and-spies' },
				description: `The party recovers from the blast, finding the artifact shattered and the chamber's corruption gone. As they exit, [ENTITY:npc:Yoghurt], the ninja-ogre, reappears, dragging two corpses of cloaked infiltrators showing the same black-veined corruption seen in [ENTITY:character:Olek]'s vision. [ENTITY:character:Bonnie] investigates, finding only foreign-made gear.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Yoghurt], [ENTITY:npc:Captain Soranna]',
				url: { campaign: 'campaign-002', session: 'session-008', target: 'soranna-message' },
				description: `Recognizing the immediate threat, [ENTITY:character:Bonnie] writes a detailed letter to [ENTITY:npc:Captain Soranna] in [ENTITY:location:Drellin's Ferry], warning her of the approaching army (ETA four days), the prophetic visions, and the untrustworthiness of the [ENTITY:guild:Arcane Brotherhood]. She pays [ENTITY:npc:Yoghurt] 3 gp and gives him strict instructions to deliver the message only to [ENTITY:npc:Soranna] and "Do not show it to Cat," before he disappears into the woods.`,
			},
		],
	},
];
