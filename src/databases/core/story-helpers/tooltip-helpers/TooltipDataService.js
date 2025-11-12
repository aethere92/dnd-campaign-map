// ============================================
// TooltipDataService.js
// ============================================
class TooltipDataService {
	constructor(dataRegistry, supabaseClient, apiBaseUrl) {
		this.dataRegistry = dataRegistry;
		this.supabaseClient = supabaseClient;
		this.apiBaseUrl = apiBaseUrl;
	}

	async fetch(entityType, entityName) {
		const normalizedName = entityName.toLowerCase().trim();

		if (entityType === 'spell') {
			return await this.#fetchSpellData(entityName);
		}

		if (entityType === 'monster') {
			return await this.#fetchMonsterData(entityName);
		}

		if (this.dataRegistry[entityType]) {
			const data = this.dataRegistry[entityType][normalizedName];
			if (data) return data;
		}

		if (['class', 'race', 'equipment', 'condition', 'feat'].includes(entityType)) {
			return await this.#fetchFromDndApi(entityType, entityName);
		}

		return null;
	}

	async #fetchSpellData(spellName) {
		if (this.supabaseClient?.isReady()) {
			try {
				const supabaseData = await Promise.race([
					this.supabaseClient.fetchSpellByName(spellName),
					new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase timeout')), 1000)),
				]);

				if (supabaseData) {
					return SupabaseDataTransformer.transformSpell(supabaseData);
				}
			} catch (error) {
				console.warn('Failed to fetch spell from Supabase, trying fallbacks:', error);
			}
		}

		if (this.dataRegistry.spell[spellName]) {
			return this.dataRegistry.spell[spellName];
		}

		try {
			return await this.#fetchFromDndApi('spell', spellName);
		} catch (error) {
			console.warn('Failed to fetch spell from D&D API:', error);
			return null;
		}
	}

	async #fetchMonsterData(monsterName) {
		const normalizedName = monsterName.toLowerCase().trim();

		if (this.supabaseClient?.isReady()) {
			try {
				const supabaseData = await Promise.race([
					this.supabaseClient.fetchMonsterByName(monsterName),
					new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase timeout')), 1000)),
				]);

				if (supabaseData) {
					return SupabaseDataTransformer.transformMonster(supabaseData);
				}
			} catch (error) {
				console.warn('Failed to fetch monster from Supabase, trying fallbacks:', error);
			}
		}

		if (this.dataRegistry.monster[normalizedName]) {
			return this.dataRegistry.monster[normalizedName];
		}

		try {
			return await this.#fetchFromDndApi('monster', monsterName);
		} catch (error) {
			console.warn('Failed to fetch monster from D&D API:', error);
			return null;
		}
	}

	async #fetchFromDndApi(entityType, entityName) {
		const endpoints = {
			spell: 'spells',
			monster: 'monsters',
			class: 'classes',
			race: 'races',
			equipment: 'equipment',
			condition: 'conditions',
			feat: 'feats',
		};

		const endpoint = endpoints[entityType];
		if (!endpoint) return null;

		const formattedName = entityName.toLowerCase().replace(/\s+/g, '-');

		try {
			const response = await fetch(`${this.apiBaseUrl}${endpoint}/${formattedName}`);
			if (response.ok) {
				return await response.json();
			}

			const searchResponse = await fetch(`${this.apiBaseUrl}${endpoint}?name=${encodeURIComponent(entityName)}`);

			if (searchResponse.ok) {
				const searchData = await searchResponse.json();
				if (searchData.results?.length > 0) {
					const detailResponse = await fetch(`${this.apiBaseUrl}${searchData.results[0].url}`);
					if (detailResponse.ok) {
						return await detailResponse.json();
					}
				}
			}

			return null;
		} catch (error) {
			console.error(`Error fetching ${entityType} data:`, error);
			throw error;
		}
	}
}
