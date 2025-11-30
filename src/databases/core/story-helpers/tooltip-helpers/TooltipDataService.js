// ============================================
// TooltipDataService.js - COMPLETE VERSION (No Character Supabase)
// ============================================
class TooltipDataService {
	constructor(dataRegistry, supabaseClient, apiBaseUrl) {
		this.dataRegistry = dataRegistry;
		this.supabaseClient = supabaseClient;
		this.apiBaseUrl = apiBaseUrl;
		this.campaignId = null;
		this.#extractCampaignId();
	}

	#extractCampaignId() {
		if (this.dataRegistry.campaign?.id) {
			this.campaignId = this.dataRegistry.campaign.id;
		}
	}

	async fetch(entityType, entityName) {
		const normalizedName = entityName.toLowerCase().trim();

		// Try Supabase first for supported entity types (removed 'character')
		if (['spell', 'monster', 'npc', 'location', 'faction', 'quest', 'encounter'].includes(entityType)) {
			const supabaseData = await this.#fetchFromSupabase(entityType, entityName, normalizedName);
			if (supabaseData) return supabaseData;
		}

		// Fallback to local registry
		if (this.dataRegistry[entityType]) {
			const data = this.dataRegistry[entityType][normalizedName];
			if (data) return data;
		}

		// Fallback to D&D API for reference data
		if (['class', 'race', 'equipment', 'condition', 'feat'].includes(entityType)) {
			return await this.#fetchFromDndApi(entityType, entityName);
		}

		return null;
	}

	async #fetchFromSupabase(entityType, entityName, normalizedName) {
		if (!this.supabaseClient?.isReady()) return null;

		try {
			let supabaseData = null;

			switch (entityType) {
				case 'spell':
					supabaseData = await Promise.race([
						this.supabaseClient.fetchSpellByName(entityName),
						new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase timeout')), 1000)),
					]);
					break;

				case 'monster':
					supabaseData = await Promise.race([
						this.supabaseClient.fetchMonsterByName(entityName),
						new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase timeout')), 1000)),
					]);
					break;

				case 'npc':
				case 'location':
				case 'faction':
				case 'quest':
				case 'encounter':
					supabaseData = await this.#fetchEntityByQuery(entityType, entityName, normalizedName);
					break;
			}

			if (supabaseData) {
				return this.#transformSupabaseData(entityType, supabaseData);
			}
		} catch (error) {
			console.warn(`Failed to fetch ${entityType} from Supabase:`, error);
		}

		return null;
	}

	async #fetchEntityByQuery(entityType, entityName, normalizedName) {
		if (!this.supabaseClient?.isReady() || !this.campaignId) return null;

		const client = this.supabaseClient.getClient();
		if (!client) return null;

		const tableMap = {
			npc: 'npcs',
			location: 'locations',
			faction: 'factions',
			quest: 'quests',
			encounter: 'encounters',
		};

		const nameFieldMap = {
			npc: 'name',
			location: 'name',
			faction: 'name',
			quest: 'title',
			encounter: 'name',
		};

		const table = tableMap[entityType];
		const nameField = nameFieldMap[entityType];

		if (!table || !nameField) return null;

		try {
			// Wrap the entire operation in a single timeout
			return await Promise.race([
				(async () => {
					// Try by name first (case-insensitive)
					const { data: dataByName, error: errorByName } = await client
						.from(table)
						.select('*')
						.eq('campaign_id', this.campaignId)
						.ilike(nameField, entityName)
						.single();

					if (!errorByName && dataByName) return dataByName;

					// Try by ID as fallback
					const { data: dataById, error: errorById } = await client
						.from(table)
						.select('*')
						.eq('campaign_id', this.campaignId)
						.eq('id', normalizedName)
						.single();

					if (!errorById && dataById) return dataById;

					return null;
				})(),
				new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase timeout')), 1000)),
			]);
		} catch (error) {
			console.warn(`Error in fetchEntityByQuery for ${entityType}:`, error);
			return null;
		}
	}

	#transformSupabaseData(entityType, data) {
		const transformers = {
			spell: SupabaseDataTransformer.transformSpell,
			monster: SupabaseDataTransformer.transformMonster,
			npc: SupabaseDataTransformer.transformNPC,
			location: SupabaseDataTransformer.transformLocation,
			quest: SupabaseDataTransformer.transformQuest,
			encounter: SupabaseDataTransformer.transformEncounter,
			faction: SupabaseDataTransformer.transformFaction,
		};

		const transformer = transformers[entityType];
		return transformer ? transformer(data) : Array.isArray(data) ? data[0] : data;
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
