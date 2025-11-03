const CAMPAIGN_002_FACTIONS = [
    {
        id: 'arcane-brotherhood',
        name: 'The Arcane Brotherhood',
        description: "The Arcane Brotherhood is a powerful wizards' guild based in the city of Luskan on the Sword Coast North. The organization is known for its ruthlessness and the magical might of its members. The Brotherhood is led by a group of powerful archmages called the Arcane, each controlling one of the Host Towers of the Arcane. The Brotherhood harbors dark secrets and is involved in the unified enemy force threatening the region.",
        leader: 'Archmage Arcane Cashaan in 1489 DR',
        location: 'Luskan',
        sublocation: 'Host Tower of the Arcane',
        npcs: ['Kalistra', 'Soshi', 'Norr', 'Zella'],
        type: 'Enemy',
        encounters: [
            { session: 0, description: 'Both Soshi and Norr were part of the brotherhood.'}
        ]
    },
    {
        id: 'harpers',
        name: 'The Harpers',
        description: 'The Harpers are a semi-secret organization dedicated to promoting good, preserving history, and maintaining a balance between civilization and nature. They work against tyranny, aided by a network of spies and informants throughout the land.',
        leader: null,
        location: null,
        sublocation: null,
        type: 'Neutral',
    },
    {
        id: 'krynn-dynasty',
        name: 'Krynn Dynasty',
        description: `The Calamity left northern Xhorhas a burnt and cracked wasteland surrounded by blackened marshland and jagged cliffs, and survival in the valley wasteland was difficult for centuries thereafter. The Kryn Dynasty, founded by drow who had turned from Lolth to a new faith in the Luxon, is the first nation to rise in the region after the end of that period, and though they still contend with not only the scarred landscape but also lingering abominations, they have been able to incorporate diverse humanoids and giants under their banner. The cities of the Dynasty are kept shaded or even in near-perpetual night by powerful dunamancers and other umbral magic, and the capital city of Rosohna sits under constant, sparsely broken cloud cover. Its settlements are connected by dirt roads. Associated with Chronomancers mentioned by Sertieren.`,
        leader: null,
        location: 'Wildermount',
        sublocation: 'Rosohna',
        type: 'Enemy',
    },
    {
        id: 'winter-rose',
        name: 'The Winter Rose',
        description: `The Winter Rose was an adventuring fellowship from Amn, named after the beautiful winter flower frostrose. It was assembled by a paladin who was guided by his unwavering commitment to justice and duty. The name was inspired by the resilience of a frostrose that kept its petals bright red against all odds and cold of the harsh northern winter. The Winter Rose proclaimed themselves to be defenders of the north. Members include Vandal, Summoner, June Takahashi, and Groomsh of Ka tribe.`,
        leader: 'Sirge de La Sunya',
        location: 'North Faerûn',
        sublocation: 'Athkatla, Amn',
        type: 'Neutral',
    },
    {
        id: 'thieves-guild',
        name: "The Thieves' Guild",
        description: `A thieves' guild was a guild of organized thieves and rogues. Most major cities in Faerûn, and some smaller ones, had one or more thieves' guilds. Some were powerful enough to hold significant political power, which they often obtained through bribery and intimidation. Most local guilds were short-lived groups that revolved around a particular individual. Members of thieves' guild often served one of the following roles, which were divided into divisions in larger guilds: assassins, beggars, bounty hunters, burglars, con artists and tricksters, cutpurses and pickpockets, enforcers and thugs, racketeers, scouts and spies, and fences, smugglers, and pirates. Kat and Yoghurt are former members working with Drellin's Ferry.`,
        type: 'Allied',
    }
]