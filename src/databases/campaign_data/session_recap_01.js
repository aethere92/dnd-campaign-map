const SESSION_RECAPS = {
	SESSION_09: {
		name: 'Session 9 RECAP',
		map: 'Korinis Island',
		chapters: [
			{
				name: 'Discoveries and Deceptions',
				items: [
					{
						text: 'The session began with the adventurers speaking to two mercenaries, learning about the presence of two additional mages in the area and the death of a farmer at the hands of one of them. Returning to the inn to rest, the party also discovered from General Lee that they had been attacked. Determined to uncover more, the adventurers decided to speak with General Lee directly.',
					},
					{
						text: 'While entering the valley, their mind played tricks on the Ranger, thinking that they had seen a large shadow resembling a werewolf for a split second. Entering Oviedo’s farm domain, the party encountered Silvestro and Cord. Confronted by the adventurers, the duo denied being werewolves, instead claiming that they used potions to enlarge themselves.',
					},
					{
						text: "After waking General Lee, the group informed him of Bianca’s treachery and revealed the location of the pyramid as well as Finley's description. They resolved to head toward the Penal Colony to continue their mission.",
					},
				],
			},
			{
				name: 'Journey Through the Penal Colony',
				items: [
					{
						text: 'Reaching the entrance to the Penal Colony, the party encountered two Paladins standing guard. The Paladins granted them two keys and allowed passage into the colony. Following Lee’s advice, the adventurers entered the shortcut.',
					},
					{
						text: 'However, while navigating the shortcut cave, the group was ambushed by spiders, barely escaping with their lives. Pressing onward, they discovered abandoned mines, realizing this was the path General Lee had described.',
					},
					{
						text: 'Approaching the mine exit, they found themselves on a ledge overlooking the Paladin Citadel in the distance. Using ropes tied to the cave wall, they descended safely and continued their journey.',
					},
					{
						text: 'Climbing up a ladder, they met two merchants: a penguin named Zero and a drugged rabbit called Quickse. The group purchased items, including powerful magical artifacts, and took a much-needed long rest to replenish their stamina and health.',
						loot: [
							{
								name: 'Boots of Speed',
								description: 'Click heels and receive +20ft movement speed for 1 minute.',
								rarity: 'uncommon',
								type: 'item',
							},
							{
								name: 'Ring of Haste',
								description: 'Cast haste on a weapon granting an extra attack with that weapon - 5 uses per long rest.',
								rarity: 'uncommon',
								type: 'item',
							},
							{
								name: 'Amulet of Slow',
								description: 'Cast slow on a target, it has to save 14DC - 6 uses per long rest.',
								rarity: 'uncommon',
								type: 'item',
							},
						],
					},
				],
			},
			{
				name: 'Ambushes and Revelations',
				items: [
					{
						text: 'While traveling towards the citadel, the adventurers were ambushed by dinosaurs in a fierce battle that nearly wiped out the party. Just as the battle concluded, Diego appeared, not fully revealing himself as a werewolf, but smelling like a wet dog. Learning of the reason they had come such a long way to this place, Diego decided to guide the group to his hideout.',
						level: 7,
					},
					{
						text: 'The party followed Diego to his hideout, where they ended their session, recovering from the harrowing events of the day and preparing for the challenges ahead.',
					},
				],
			},
		],
	},
	SESSION_10: {
		name: 'Session 10 RECAP',
		map: 'Korinis Island',
		chapters: [
			{
				name: 'The Calm Before the Storm',
				items: [
					{
						text: "The session began at Diego's cabin, where the party took a well-earned long rest to prepare for their journey to the Paladin Citadel. Their respite was shattered by a loud bang from the harbor. Looking out, they saw a massive dragon bursting through a sea wall riddled with portals, followed by the Wicked Wench bombarding the harbor. Amidst the chaos, the party noticed some lizardfolk retreating after a gong sounded - their weekend tradition kept them from further fighting.",
					},
				],
			},
			{
				name: 'The Journey to the Citadel',
				items: [
					{
						text: 'Setting out for the citadel, the group took the route leading to the battering ram section of the wall. Along the way, they spotted a wooden fence with a fallen paladin nearby. The ranger stealthily approached and discovered the scene: a dead paladin killed by punctured holes in their chest, two deceased prisoners, and several ominous holes in the ground. Six carts filled with ore and a letter in a nearby shack hinted at something darker.',
					},
					{
						text: 'Deciding to press on, the party devised a bold plan: the sorcerer, bard, and ranger transformed into wargs for speed; Mitzy sprinted ahead; the barbarian consumed a concoction of drugs for a boost; and the cleric flew invisibly to scout from above. The cleric reached the citadel first, alerting the guards to their arrival-and casually discussing soup recipes. Meanwhile, the barbarian and the wargs struggled to traverse the terrain. The barbarian was impaled on barbs, and the bard (in warg form) failed an intelligence check, chasing squirrels before finally reuniting with the group at the citadel.',
					},
				],
			},
			{
				name: 'The Citadel',
				items: [
					{
						text: 'Once inside, they dispelled their transformations and met Lord Garrond, the paladin in charge. From him, they learned that only 11 carts of ore had been mined.',
					},
					{
						text: 'While two members visited the chapel to speak with the Fire Mage Milton, the others conversed with newly arrived dragon hunters who had heard rumors of a dragon in the area. The riders agreed to help the party escape the citadel, either by carrying them or casting Fly. At the chapel, Milton revealed that Gorn was imprisoned with a ransom of 1.000 gold. Pooling their resources, they gathered 250 gold from the mage, contributed an idol worth 250, and scrounged up the remaining 500 in gold and jewelry.',
					},
				],
			},
			{
				name: 'The Escape Plan',
				items: [
					{
						text: "After much discussion, the party formulated a two-part plan. The bard and sorcerer would use Dimension Door to teleport to Diego's hut, while the others sought aid from the dragon riders. The riders provided three Fly potions, and the sorcerer cast Invisibility on the flying party members. Meanwhile, the fire mage and mercenary teleported to the open sea, swimming toward Korinis.",
					},
					{
						text: "Near Diego's hut, the party was ambushed by a group of hooded figures: four mages, a barbarian, and a rogue. The ensuing battle was fierce, but the party emerged victorious. Exhausted from their ordeal, they took turns resting at Diego's hut.",
						loot: [
							{
								name: 'Cloak of Shifting Patterns',
								description:
									'Your body is blurred. Any attack on you is made with disadvantage. If the attack hits, the blur drops and is reapplied after 3 turns.',
								rarity: 'uncommon',
								type: 'item',
							},
							{
								name: 'Belt of the Trickster',
								description:
									'After a successful 1h melee attack you can use your BONUS ATTACK or REACTION to turn invisible for 1 round.',
								rarity: 'uncommon',
								type: 'item',
							},
						],
					},
				],
			},
			{
				name: "Diego's Return",
				items: [
					{
						text: "Six hours into their rest, Diego returned with trolls and a large coffer. However, upon trying to open it the coffer exploded, damaging some of the party members. When finally opened, it revealed 10 otter hides and some gold. Diego generously split the gold with the party. Resolving to leave the Penal Colony, the party retraced their steps to the paladin checkpoint. There, they found the entrance destroyed and the guards slain. General Lee, contacted via magical means, revealed that the attackers were creatures called 'seekers'. He sent reinforcements to assist the party's escape.",
					},
				],
			},
			{
				name: 'Seekers and Detours',
				items: [
					{
						text: "As they traveled toward the tavern, the party spotted seekers lying in wait to ambush them. Opting for a safer route, they detoured through a lake and made their way to Erol's house. The journey was arduous, particularly for the cleric, but they eventually arrived. After regrouping, they pressed onward to meet General Lee.",
					},
					{
						text: "At Oviedo's farm, Lee rewarded the party with 2.000 gold for their efforts. To avoid further seeker ambushes, the party turned invisible on their way to back to the city. Near the tavern, they saw Diego and took him to the city with them via the teleporters. During their traversal they had seen many more Seekers waiting to ambush them at various points.",
					},
				],
			},
			{
				name: 'Back in the City',
				items: [
					{
						text: 'The ranger, eager to stock up on supplies, visited Thorben, who reprimanded her for being a poor apprentice but sold her 40 +hit arrows and 100 regular ones. The party then headed to the merchant district to purchase mana and healing potions.',
					},
				],
			},
			{
				name: 'Familiar Faces',
				items: [
					{
						text: "In the upper city, the party encountered Diego dealing with a traitor. He offered them a safe place to stay whenever needed. After that, the party reached Salamander's place and learned that he had been scammed.",
					},
					{
						text: 'With the session winding down, they prepared to rest and strategize for the next leg of their journey.',
					},
				],
			},
		],
	},
};
