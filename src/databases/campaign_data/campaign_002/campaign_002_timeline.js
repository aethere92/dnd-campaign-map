const CAMPAIGN_002_TIMELINE = [
	{
		id: 1,
		title: `Woods before Drellin's Ferry`,
		location: `Near [ENTITY:location:Drellin's Ferry]`,
		session: '1',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
		},
		description: ``,
		items: [
			{
				type: 'encounter',
				actors: 'Hobgoblins',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'the-fight' },
				description: `The [ENTITY:character:Entire party:Party] engages into a fight with hobgoblins. They fight as a team and manage to defeat the hobgoblins, killing their captain and making the remaining still alive run in defeat. `,
			},
			{
				type: 'narrative',
				actors: 'Hobgoblin interrogation',
				sublocation: 'Abandoned farmhouse',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'interrogation' },
				description: `The party interrogates a captured hobgoblin, with [ENTITY:character:Bonnie] leading the questioning and [ENTITY:character:Olek] ensuring honesty through magic. Despite their efforts, the creature refuses to speak until [ENTITY:character:Olek] promises him a swift death in exchange for answers. They learn of [ENTITY:npc:Wyrmlord Koth], a powerful sorcerer gathering forces for "the Day of Ruin," but their attempts to get a location fail. A strange symbol they found elicits a reaction, but no explanation follows. When the group considers taking the prisoner to town for further interrogation, [ENTITY:character:Olek] ultimately honors his word and delivers the promised death.`,
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'towards-drellins-ferry' },
				description: `As they made their way towards [ENTITY:location:Drellin's Ferry], [ENTITY:character:Olek] and [ENTITY:character:Bonnie] scared a farmer and their son who were going on the way towards the abandoned farmhouse.`,
			},
		],
	},
	{
		id: 2,
		title: `Reaching Drellin's Ferry`,
		location: `[ENTITY:location:Drellin's Ferry]`,
		session: '1 & 2',
		url: {
			campaign: 'campaign-002',
			session: 'session-002',
			target: 'reaching-drellins-ferry',
		},
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Bonnie] & [ENTITY:character:Olek]',
				sublocation: 'Tollhouse',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'olek-and-bonnie' },
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Soshi] & [ENTITY:character:Norr]',
				sublocation: 'Shrine of Pelor',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'norr-and-soshi' },
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Kaedin]',
				sublocation: 'House of Sertieren',
				url: { campaign: 'campaign-002', session: 'session-002', target: 'kaedin' },
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Town Inn',
				is_new_session: true,
			},
		],
	},
	{
		id: 3,
		title: 'Going into the Witchwood',
		location: 'The [ENTITY:location:Witchwood]',
		session: '2',
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Into the woods',
			},
			{
				type: 'encounter',
				actors: 'Hydra & Hobgoblins',
			},
			{
				type: 'encounter',
				actors: 'Wargs',
			},
		],
	},
	{
		id: 4,
		title: "Back to Drellin's Ferry",
		location: `[ENTITY:location:Drellin's Ferry]`,
		session: '2 & 3',
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: null,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:npc:Soranna]',
				sublocation: 'Tollhouse',
				is_new_session: true,
				description: `Talked to Soranna, found out about Kat and Yoghurt and tunnel.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: '[ENTITY:location:Green Apple Inn]',
				description: 'N/A',
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: `Anya's house`,
				description: 'N/A',
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Summoner], [ENTITY:npc:Vandal]',
				sublocation: `[ENTITY:location:Green Apple Inn]`,
				description: 'Talked with Winter Rose',
			},
		],
	},
	{
		id: 5,
		title: 'Dawn of a new day',
		location: `[ENTITY:location:Drellin's Ferry]`,
		session: '3',
		items: [
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
				sublocation: `[ENTITY:location:Green Apple Inn]`,
				description: 'Talked with the two guards.',
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'To Avarthel',
			},
			{
				type: 'narrative',
				actors: 'Hydra eggs talk',
				sublocation: "Avarthel's Grove",
				description: 'Talked about eggs.',
			},
			{
				type: 'narrative',
				actors: 'Potions from [ENTITY:npc:Jareth]',
				sublocation: 'Town market',
				description: 'Met potion seller Jareth.',
			},
			{
				type: 'narrative',
				actors: 'Talking to [ENTITY:npc:Lem]',
				sublocation: `Tollhouse`,
				description: 'Spoke to Lem about Anya.',
			},
			{
				type: 'investigation',
				actors: 'Finding [ENTITY:npc:Anya]',
				sublocation: `Forest Pond`,
				description: 'Found Anya in the woods, brought her to Avarthel.',
			},
			{
				type: 'encounter',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
				sublocation: `[ENTITY:location:Green Apple Inn]`,
				description: 'Helped break up tavern brawl non-lethally.',
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
				sublocation: 'Temple tunnel entrance',
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Kat], [ENTITY:npc:Yoghurt]',
				sublocation: `Temple entrance`,
				description: 'Passed through magical barrier; Kat & Yoghurt blocked.',
			},
		],
	},
	{
		id: 7,
		title: 'The Sunken Temple',
		location: `Sunken Temple`,
		session: '3',
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Temple Hallways',
				description: 'Chose the reptile path. Encountered traps and poisonous creatures.',
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Leech pond',
				description: 'Bypassed massive guardian creature using stealth.',
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Flooded room',
				description: 'Found note about Demon Lord disciples creating monsters.',
			},
			{
				type: 'encounter',
				actors: 'Reptile',
				sublocation: 'Underground Lab',
				description: 'Fought and polymorphed monstrous reptile; looted magical items.',
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
				sublocation: 'Rune platform',
				description: 'Activated rune with Winter Rose, opening new path.',
			},
		],
	},
	{
		id: 8,
		title: 'The Collapsing Cavern and The Pirate Paladins',
		location: 'Cavern Network / Luskan Coast',
		session: '4',
		items: [
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Ritual Chamber/Camp',
				description:
					"Found evidence of dark rituals, decay, and cages. Identified the camp as belonging to Calistra of the Brotherhood (Norr's former teacher). Discovered a ledger detailing creature collection for 'Kilgor' and the 'Festival of Life,' along with a failed Brotherhood reinforcement note and a reference to a hidden treasure at 'the old fort north of the woods.'",
			},
			{
				type: 'discovery',
				actors: '[ENTITY:character:Norr]',
				sublocation: 'Ritual Chamber/Camp',
				description:
					'Norr suffered a psychic spike, recognizing Calistra as a harsh former teacher specializing in alteration magic who vanished a decade prior.',
			},
			{
				type: 'discovery',
				actors: '[ENTITY:character:Norr], [ENTITY:character:Bonnie]',
				sublocation: 'Deep Cavern',
				description:
					"Encountered Megatherium, massive prehistoric bear-sloth creatures marked by the Broken Shackle orc tribe. Norr's mind-spike identified them as herbivores used for insect consumption. Bonnie befriended two (Gică and Mișu), learning their handlers left two weeks prior for the Red Hand.",
			},
			{
				type: 'encounter',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Megatherium]',
				sublocation: 'Deep Cavern',
				description:
					"Ambushed by Spitters (acidic millipede-like creatures of the Te Snatchers goblin clan) and their Drider handlers. Olek's armor was severely damaged by acid. The Megatherium became aggressive and helped defeat the monsters. The party harvested valuable venom and identified toxic Garlic Agaricoms.",
			},
			{
				type: 'reunion',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
				sublocation: 'Cavern River',
				description: 'Vandal and the Summoner reunited with the group, having found a partially submerged ship.',
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Vandal], [ENTITY:npc:Summoner]',
				sublocation: 'Collapsing Cave System',
				description:
					"Vandal's spell blew out a cavern wall. The ship was caught in a massive surge, rocketing through the collapsing cave system until it shot out of a mountain waterfall and crashed into the sea.",
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Captain Bianca Turiados]',
				sublocation: 'Luskan Coast',
				description:
					'The battered survivors were rescued by a galleon flying a jolly roger, crewed by a bizarre mix of pirates and fully armored paladins. The captain, Bianca Turiados, was recognized by Olek as the paladin commander he was seeking, suggesting a vast conspiracy.',
			},
		],
	},
	{
		id: 9,
		title: "The Pirate's Debt and The Thylacoleo Cubs",
		location: 'The Leviathan’s Hall / Desolate Beach / Drellin’s Ferry',
		session: '5',
		items: [
			{
				type: 'discovery',
				actors: '[ENTITY:character:Soshi]',
				sublocation: 'The Leviathan’s Hall (Galleon)',
				description:
					"The party was brought before commanders Turiados (Sahuagin Shaman) and Bianca (Fey-touched Queen of Pelagos). Soshi recognized Turiados's cutlass, the **Breaker of Hulls**, and Bianca's thunder-blade, **Winder**, as relics stolen from her organization, the Brotherhood.",
			},
			{
				type: 'negotiation',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Glass]',
				sublocation: 'The Leviathan’s Hall (Quarterdeck)',
				description:
					'Bianca demanded a 20% rescue fee. Bonnie confessed their gold was **cursed copper** (nearly worthless) due to a pirate coin. Quartermaster Glass, an Ice Elemental, refused the cursed money but took 20% of their non-monetary assets: Olek’s javelins, Norr’s climbing rope, and eight precious pearls.',
			},
			{
				type: 'intelligence',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Marise Curs]',
				sublocation: 'The Leviathan’s Hall (Deck)',
				description:
					'A drunken pirate, Marise Curs, revealed the crew were former slaves, liberated by General Ilie, whom Bianca betrayed to steal the ship. Vandal and Scoundrel confirmed they would pay their share and warned the party against trouble.',
			},
			{
				type: 'conflict',
				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Bianca]',
				sublocation: 'The Leviathan’s Hall (Deck)',
				description:
					"Turiados offered to trade his spinning compass (which pointed to Soshi's greatest desire) for a lock of King Sandro's hair. When Bonnie slyly dropped a cursed coin, Bianca instantly blasted her with a powerful bolt of force, knocking her down.",
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Desolate Beach / Forest',
				description:
					"The party was dumped on a beach. Vandal and Scoundrel warned them of local undead pirates before departing. After a night's rest (marked by a giant seagull caught in Bonnie's bear trap and eaten by crabs), the party trekked toward Drellin's Ferry.",
			},
			{
				type: 'encounter',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Thylacoleos]',
				sublocation: 'Oak Clearing',
				description:
					'Ambushed by three **Thylacoleos** (massive, pouched predators). Soshi was grappled and Kaedin was dragged up a tree. Bonnie used Misty Step to strike, Kaedin manifested his Echo Knight double, and Soshi cast **Polymorph** to turn Norr into a **Giant Ape**. The beasts were defeated, though the Ape took heavy damage.',
			},
			{
				type: 'discovery',
				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Entire party:Party]',
				sublocation: 'Oak Clearing',
				description:
					'Kaedin salvaged three pelts and fangs. The party found the reason for the attack: seven impossibly cute **Thylacoleo cubs** in a hollow tree, which they took in.',
			},
			{
				type: 'negotiation',
				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Sertieren]',
				sublocation: "Drellin's Ferry (Wizard's Mansion)",
				description:
					'The party fed the cubs with a local goat-herd’s milk. Bonnie successfully convinced the wizard Sertieren to sell her seven **containment spheres** on credit. Sertieren placed a magical, glowing brand on Bonnie’s wrist as collateral for the 7 gold debt.',
			},
			{
				type: 'transaction',
				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Soshi], [ENTITY:npc:Sertieren]',
				sublocation: "Drellin's Ferry (Wizard's Mansion)",
				description:
					'Kaedin and Soshi paid the 7 gold debt. The party sold Sertieren half a kilo of **Storm Dust** (15g) and a preserved cave worm head/Artus Plura mushrooms (10g). Sertieren also identified the vials: a celerity potion and a potent anti-poison with the side effect of “severe, explosive dysentery.”',
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Soshi], [ENTITY:npc:Sertieren]',
				sublocation: "Drellin's Ferry (Wizard's Mansion)",
				description:
					"Soshi inquired about the mage Calistra. Sertieren revealed they were former adventuring partners ('Crazy Hogs') but he stole her spellbook to stop her from casting an earthquake spell. He warned the party that a storm is coming (referencing hydras, potions, and tribal unity) and that he plans to leave town.",
			},
		],
	},
	{
		id: 10,
		title: 'The Menagerie and The Fort Siege',
		location: 'Drellin’s Ferry / Witchwood / Ruined Fort',
		session: '6',
		items: [
			{
				type: 'discovery',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'The Inn',
				description: 'Arrived at the inn weary. Consumed a mushroom/herb stew that granted them temporary hit points.',
			},
			{
				type: 'animal_care',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'The Inn',
				description:
					'The party released their juvenile, leopard-sized magical cats for their 48-hour maturation period. The cats caused immense chaos and destruction: Kaedin’s pets chewed a massive hole in his room, Norr’s scaled her walls, and Olek’s cat, Palo, ransacked the kitchen, causing the innkeeper to pass out. Olek paid a gold piece for kitchen damages, and Kaedin incurred an expensive ongoing repair fee for his wall. The creatures were returned to their spheres.',
			},
			{
				type: 'transaction',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Market/Armorer',
				description:
					"Restocked with supplies, milk, and various honeys (for training mounts). Bonnie contacted a thieves’ guild acquaintance. Used a discount note to purchase new armor (Splint Mail for Kaedin, Chain Mail for Olek). Sold two 'Taylas' pelts and used the third to reinforce the new armor and Bonnie’s leather gear for added damage resistance.",
			},
			{
				type: 'mission_update',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Captain Sorana]',
				sublocation: 'Town Hall/Office',
				description:
					'Reported their temple investigation to Captain Sorana. She confirmed pirates were in the harbor and paid the party 20 gold. Assigned a new mission: investigate the disappearance of four barbarian riders in the **Witchwood** forest to the northwest.',
			},
			{
				type: 'discovery',
				actors: '[ENTITY:character:Bonnie], [ENTITY:character:Entire party:Party]',
				sublocation: 'Road to Witchwood',
				description:
					'Encountered the smoldering wreckage of two caravans and a massacre of ten innocents. Bonnie’s tracking revealed the culprits were at least twenty **Orcs on Warg-back**, heading toward the ruined fort.',
			},
			{
				type: 'scouting',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Ruined Fort',
				description:
					'Located a ruined fortress. The land felt cleansed by powerful abjuration magic. Identified a stable with **Hobgoblins** playing dice and a **skeleton** patrolling the main keep wall. Realized the enemy was expecting them.',
			},
			{
				type: 'encounter',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Wormlord Faction]',
				sublocation: 'Ruined Fort Courtyard',
				description:
					'Launched a surprise attack: Soshi cast **Grease** and Norr followed with a devastating **Fireball**, igniting the stable and killing several enemies. The courtyard erupted with two Wargs, two Hobgoblin Warg-riders, a hulking **Minotaur**, a **Mud Elemental**, and a terrifying **Manticore**.',
			},
			{
				type: 'combat',
				actors:
					'[ENTITY:character:Olek], [ENTITY:character:Norr], [ENTITY:character:Bonnie], [ENTITY:character:Kaedin]',
				sublocation: 'Ruined Fort Courtyard',
				description:
					'Olek was immediately snatched and poisoned by the Manticore. A Hobgoblin shaman blinded Norr. Bonnie, using invisibility, assassinated a shaman. Kaedin used his **Echo Knight** abilities to flank the riders. Olek crashed-landed on the battlement and killed the last archer. Kaedin destroyed the Mud Elemental.',
			},
			{
				type: 'victory',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Wormlord Faction]',
				sublocation: 'Ruined Fort Courtyard',
				description:
					'The final shaman and the Minotaur fled through the main gate, shouting an ominous warning: **"Alert the Wormlord!"** The party stood victorious, having survived the siege and identified a new primary threat.',
			},
		],
	},
	{
		id: 11,
		title: 'The Blood Ritual and The Dragon’s Arrival',
		location: 'Ruined Fort / Underground Temple',
		session: '7',
		items: [
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Ruined Fort Barracks',
				description:
					'Party recovered health but avoided a full short rest. They chose stealth through the burned-out barracks (the main gate was locked). The attempt at silence was compromised by Kaedin’s noisy armor and Soshi snagging her cloak. Bonnie scouted, finding an abandoned throne room with signs of recent violence.',
			},
			{
				type: 'investigation',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:character:Bonnie]',
				sublocation: 'Underground Tunnel',
				description:
					"Found a map detailing a major enemy force (thirty units, 19x stronger than what they’d faced) gathering to strike **Drellin's Ferry** in four days. Identified a key vulnerability: destroying a bridge one day away could delay the attack by two to three days. Bonnie found the magical signature of a **Red Dragon** in the area.",
			},
			{
				type: 'discovery',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:character:Bonnie]',
				sublocation: 'Ritual Chamber',
				description:
					'Entered a circular stone chamber with a large, blood-stained ritual circle. Found half-dozen corpses, including their former teacher, **Calistra**, who had apparently sacrificed herself in a blood binding ritual to open a sealed stone door. Markings indicated the involvement of both the **Arcane Seekers** and the **Brotherhood**.',
			},
			{
				type: 'conflict',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:creature:Spectral Entities]',
				sublocation: 'Ritual Chamber',
				description:
					"The party performed the ritual to open the door, which awakened the souls of the dead mercenaries who rose as wraith-like spectral entities. The ghosts' attacks tore away the party members' traumatic memories. Soshi debated drawing more energy from the tortured souls than was needed.",
			},
			{
				type: 'sacrifice',
				actors: '[ENTITY:character:Norr]',
				sublocation: 'Ritual Chamber',
				description:
					"**Norr** maintained the magical channel for the ritual. A surge of green electrical energy erupted, striking her, channelling into the stone door, and instantly refreshing all her spell slots. She was critically injured, briefly became a ghostly visage, and collapsed. With a final check, she **shattered the door**. Norr's Intelligence was permanently reduced by two, but her alignment shifted to **Neutral**, and she gained **permanent additional spell slots**.",
			},
			{
				type: 'combat',
				actors: '[ENTITY:character:Kaedin], [ENTITY:character:Olek]',
				sublocation: 'Temple Entrance',
				description:
					"Entered the temple and engaged in fierce combat. A support caster revived the unconscious Norr from a wall of fire. Kaedin and Olek delivered devastating critical hits against enemy casters, with Olek's **Divine Smite** ending a major threat.",
			},
			{
				type: 'climactic_discovery',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Calistra], [ENTITY:creature:Red Dragon]',
				sublocation: 'Blackstone Vault',
				description:
					'Found the artifact, the **Null Brand**, on a pedestal. Calistra (their former teacher) was there, one hand fused to the cursed object, using her life force to contain its corrupting influence. As the party debated helping her, a wall of **twenty armored orcs** and a booming **Red Dragon** appeared, commanded to take the Brand, creating a sudden, chaotic final battle.',
			},
		],
	},
	// SESSION 008
	{
		id: 12,
		title: 'The Shattered Artifact',
		location: `Corrupted Fortress`,
		session: '8',
		items: [
			{
				type: 'encounter',
				actors: '[ENTITY:character:Entire party:Party], Red Hand Army, Dragonkin',
				sublocation: 'Ritual Chamber',
				description: `An army breaches the chamber wall. [ENTITY:character:Bonnie] uses Fairy Fire while [ENTITY:character:Olek] discovers his divine connection is severed by corrupting magic. [ENTITY:character:Norr]'s wild magic triggers a Fireball centered on herself, devastating both party and enemies. [ENTITY:character:Soshi] summons spectral cats while [ENTITY:character:Kaedin] and [ENTITY:character:Olek] form a defensive line. The party battles orcs, soldiers, and dragonkin leaders. [ENTITY:character:Bonnie] assassinates a dragonkin using her medallion's teleportation and greater invisibility.`,
			},
			{
				type: 'narrative',
				actors: 'Ritualist death & Artifact',
				sublocation: 'Ritual Chamber',
				description: `With the ritualist's death, the artifact releases uncontrolled necrotic energy, intensifying the land's corruption. The artifact becomes unstable and detonates in a catastrophic explosion, casting the party into apocalyptic visions.`,
			},
			{
				type: 'vision',
				actors: '[ENTITY:character:Olek], [ENTITY:character:Norr]',
				sublocation: 'Blighted Paladin Fortress',
				description: `[ENTITY:character:Olek] and [ENTITY:character:Norr] witness a corrupted fortress overrun by crystalline growths. The impaled commander reveals [ENTITY:npc:Lamashtu]'s cults infiltrated after the Battle for Bremen depleted their ranks. He speaks of defeat caused by the Angevin fleet and their resurrected god [ENTITY:npc:Kresimir] attacking from the harbor. [ENTITY:character:Norr] notices her right arm is replaced by a prosthetic in this dark future.`,
			},
			{
				type: 'vision',
				actors: '[ENTITY:character:Kaedin]',
				sublocation: 'Burning Village',
				description: `[ENTITY:character:Kaedin] finds his neighboring village ablaze. He rescues two children who reveal invaders bearing a yellow banner with a blue bear sigil, accompanied by Red Hand symbols, came two days prior and took villagers as slaves for a ritual. They warn his home village is next.`,
			},
			{
				type: 'vision',
				actors: '[ENTITY:character:Bonnie]',
				sublocation: 'The Feywild',
				description: `[ENTITY:character:Bonnie] witnesses Titania and the Queen of Air and Darkness fighting together against a warrior wielding energy spears. Chromatic dragons destroy pegasus knights and hippogriff riders while Spring and Autumn courts are annihilated. Only unknown paladins hold the line against Red Hand forces, black orcs, and blue bear warriors. The warrior defeats both queens and steals their crowns, dooming the Feywild to wither.`,
			},
			{
				type: 'vision',
				actors: '[ENTITY:character:Soshi]',
				sublocation: 'Siege of Neverwinter',
				description: `[ENTITY:character:Soshi] finds herself chained on a platform with hundreds of prisoners before Neverwinter's walls. A Red Wizard of Thay forces them to power a ritual to breach the city. Blue Bear banners dominate the siege, with chromatic dragons circling overhead and the Arcane Brotherhood overseeing the death ritual.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Entire party:Party], [ENTITY:npc:Yoghurt]',
				sublocation: 'Outside the Fortress',
				description: `The party recovers from the explosion and their shared visions. [ENTITY:npc:Yoghurt] appears, having followed them, dragging corpses of shadow-clad scouts with blackened veins. [ENTITY:character:Bonnie] discovers they're foreigners, likely corrupted agents.`,
			},
			{
				type: 'narrative',
				actors: '[ENTITY:character:Bonnie], [ENTITY:npc:Yoghurt]',
				sublocation: 'Outside the Fortress',
				description: `[ENTITY:character:Bonnie] writes an urgent letter to [ENTITY:npc:Soranna] detailing the approaching army's four-day timeline, the visions, enemy factions (Red Hand, Blue Bear, Arcane Brotherhood, chromatic dragons), and warns against trusting the Arcane Brotherhood. She pays [ENTITY:npc:Yoghurt] three gold and makes him swear to deliver it only to [ENTITY:npc:Soranna], not [ENTITY:npc:Kat], promising his Raven master will hear of his service.`,
			},
			{
				type: 'traversal',
				actors: '[ENTITY:character:Entire party:Party]',
				sublocation: 'Towards the Bridge',
				description: `Armed with knowledge of the apocalyptic future, the party sets off toward their immediate goal: reaching and destroying the bridge to buy the North time against the coming war.`,
			},
		],
	},
];
