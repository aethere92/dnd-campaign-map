// ============================================
// SupabaseDataTransformer.js
// ============================================
class SupabaseDataTransformer {
	static transformSpell(supabaseSpell) {
		if (!supabaseSpell) return null;

		const spell = Array.isArray(supabaseSpell) ? supabaseSpell[0] : supabaseSpell;
		if (!spell) return null;

		return {
			spellName: spell.spell_name || spell.spellName,
			level: spell.level,
			spellClass: spell.school || spell.spellClass,
			castingTime: spell.casting_time || spell.castingTime,
			range: spell.range,
			components: spell.components,
			duration: spell.duration,
			description: spell.description || spell.desc,
			classes: spell.classes || [],
			source: spell.source,
			...spell,
		};
	}

	static transformMonster(supabaseMonster) {
		if (!supabaseMonster) return null;

		const monster = Array.isArray(supabaseMonster) ? supabaseMonster[0] : supabaseMonster;
		if (!monster) return null;

		const parseJson = (field) => {
			if (!field) return null;
			if (typeof field === 'string') {
				try {
					return JSON.parse(field);
				} catch {
					return null;
				}
			}
			return field;
		};

		const abilityScores = parseJson(monster.ability_scores);
		const traits = parseJson(monster.traits) || [];
		const actions = parseJson(monster.actions) || [];
		const legendaryActions = parseJson(monster.legendary_actions) || [];

		return {
			name: monster.name,
			type: monster.meta || '',
			size: this.#extractSize(monster.meta),
			alignment: this.#extractAlignment(monster.meta),
			armor_class: monster.armor_class,
			hit_points: monster.hit_points,
			hit_points_roll: monster.hit_points,
			speed: this.#parseSpeed(monster.speed),
			strength: this.#parseAbilityScore(abilityScores?.str),
			dexterity: this.#parseAbilityScore(abilityScores?.dex),
			constitution: this.#parseAbilityScore(abilityScores?.con),
			intelligence: this.#parseAbilityScore(abilityScores?.int),
			wisdom: this.#parseAbilityScore(abilityScores?.wis),
			charisma: this.#parseAbilityScore(abilityScores?.cha),
			str: abilityScores?.str || '10 (+0)',
			dex: abilityScores?.dex || '10 (+0)',
			con: abilityScores?.con || '10 (+0)',
			int: abilityScores?.int || '10 (+0)',
			wis: abilityScores?.wis || '10 (+0)',
			cha: abilityScores?.cha || '10 (+0)',
			saving_throws: monster.saving_throws,
			skills: monster.skills,
			damage_immunities: monster.damage_immunities,
			condition_immunities: monster.condition_immunities,
			senses: monster.senses,
			languages: monster.languages,
			challenge_rating: monster.challenge,
			challenge: monster.challenge,
			traits: traits,
			actions: actions,
			legendary_actions: legendaryActions,
			legendary_actions_description: monster.legendary_actions_description,
			...monster,
		};
	}

	static #extractSize(meta) {
		if (!meta) return 'Unknown';
		const sizeMatch = meta.match(/(Tiny|Small|Medium|Large|Huge|Gargantuan)/i);
		return sizeMatch ? sizeMatch[1] : 'Unknown';
	}

	static #extractAlignment(meta) {
		if (!meta) return 'Unaligned';
		const alignmentMatch = meta.match(/\), (.+)$/);
		return alignmentMatch ? alignmentMatch[1] : 'Unaligned';
	}

	static #parseSpeed(speedStr) {
		if (!speedStr) return {};
		if (typeof speedStr === 'object') return speedStr;

		const speeds = {};
		const parts = speedStr.split(',').map((s) => s.trim());

		parts.forEach((part) => {
			if (part.includes('fly')) {
				speeds.fly = part.replace('fly', '').trim();
			} else if (part.includes('swim')) {
				speeds.swim = part.replace('swim', '').trim();
			} else if (part.includes('climb')) {
				speeds.climb = part.replace('climb', '').trim();
			} else if (part.includes('burrow')) {
				speeds.burrow = part.replace('burrow', '').trim();
			} else {
				speeds.walk = part;
			}
		});

		return speeds;
	}

	static #parseAbilityScore(scoreStr) {
		if (!scoreStr) return 10;
		if (typeof scoreStr === 'number') return scoreStr;
		const match = String(scoreStr).match(/^(\d+)/);
		return match ? parseInt(match[1], 10) : 10;
	}

	static transformNPC(supabaseNPC) {
		if (!supabaseNPC) return null;
		const npc = Array.isArray(supabaseNPC) ? supabaseNPC[0] : supabaseNPC;
		if (!npc) return null;

		// Parse JSON fields if they're strings
		const parseJson = (field) => {
			if (!field) return null;
			if (typeof field === 'string') {
				try {
					return JSON.parse(field);
				} catch {
					return null;
				}
			}
			return field;
		};

		return {
			...npc,
			location: parseJson(npc.location),
			goals: parseJson(npc.goals),
			items: parseJson(npc.items),
			relationships: parseJson(npc.relationships),
			encounters: parseJson(npc.encounters),
			link: parseJson(npc.link),
		};
	}

	static transformLocation(supabaseLocation) {
		if (!supabaseLocation) return null;
		const loc = Array.isArray(supabaseLocation) ? supabaseLocation[0] : supabaseLocation;
		if (!loc) return null;

		const parseJson = (field) => {
			if (!field) return null;
			if (typeof field === 'string') {
				try {
					return JSON.parse(field);
				} catch {
					return null;
				}
			}
			return field;
		};

		return {
			...loc,
			features: parseJson(loc.features),
			npcs: parseJson(loc.npcs),
			connections: parseJson(loc.connections),
			threats: parseJson(loc.threats),
			items: parseJson(loc.items),
		};
	}

	static transformQuest(supabaseQuest) {
		if (!supabaseQuest) return null;
		const quest = Array.isArray(supabaseQuest) ? supabaseQuest[0] : supabaseQuest;
		if (!quest) return null;

		const parseJson = (field) => {
			if (!field) return null;
			if (typeof field === 'string') {
				try {
					return JSON.parse(field);
				} catch {
					return null;
				}
			}
			return field;
		};

		return {
			...quest,
			sessions: parseJson(quest.sessions),
		};
	}

	static transformEncounter(supabaseEncounter) {
		if (!supabaseEncounter) return null;
		const enc = Array.isArray(supabaseEncounter) ? supabaseEncounter[0] : supabaseEncounter;
		if (!enc) return null;

		const parseJson = (field) => {
			if (!field) return null;
			if (typeof field === 'string') {
				try {
					return JSON.parse(field);
				} catch {
					return null;
				}
			}
			return field;
		};

		return {
			...enc,
			environment: parseJson(enc.environment),
			initiative: parseJson(enc.initiative),
			rounds: parseJson(enc.rounds),
			outcome: parseJson(enc.outcome),
			post_combat: parseJson(enc.post_combat),
		};
	}

	static transformCharacter(supabaseCharacter) {
		if (!supabaseCharacter) return null;
		const char = Array.isArray(supabaseCharacter) ? supabaseCharacter[0] : supabaseCharacter;
		if (!char) return null;

		const parseJson = (field) => {
			if (!field) return null;
			if (typeof field === 'string') {
				try {
					return JSON.parse(field);
				} catch {
					return null;
				}
			}
			return field;
		};

		return {
			...char,
			shortDescription,
			stats: parseJson(char.stats),
		};
	}

	static transformFaction(supabaseFaction) {
		if (!supabaseFaction) return null;
		const faction = Array.isArray(supabaseFaction) ? supabaseFaction[0] : supabaseFaction;
		if (!faction) return null;

		const parseJson = (field) => {
			if (!field) return null;
			if (typeof field === 'string') {
				try {
					return JSON.parse(field);
				} catch {
					return null;
				}
			}
			return field;
		};

		return {
			...faction,
			npcs: parseJson(faction.npcs),
			encounters: parseJson(faction.encounters),
		};
	}
}
