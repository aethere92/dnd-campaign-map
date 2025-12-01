// --- START OF FILE TooltipDataService.js ---

class TooltipDataService {
	constructor(campaignId, supabaseClient, apiBaseUrl) {
		this.campaignId = campaignId;
		this.supabaseClient = supabaseClient;
		this.apiBaseUrl = apiBaseUrl;
	}

	async fetch(entityType, entityName) {
		const normalizedType = entityType.toLowerCase();

		// 1. Campaign Entities (Fetch from Supabase View)
		if (['npc', 'location', 'faction', 'quest', 'encounter', 'character'].includes(normalizedType)) {
			return await this.#fetchFromSupabase(normalizedType, entityName);
		}

		// 2. Reference Data (Fetch from Supabase specific tables or D&D API)
		if (['spell', 'monster'].includes(normalizedType)) {
			return await this.#fetchReferenceData(normalizedType, entityName);
		}

		// 3. Rules Data (Fetch from D&D API)
		if (['class', 'race', 'equipment', 'condition', 'feat'].includes(normalizedType)) {
			return await this.#fetchFromDndApi(normalizedType, entityName);
		}

		return null;
	}

	async #fetchFromSupabase(entityType, entityName) {
		if (!this.supabaseClient.isReady()) return null;

		try {
			const { data, error } = await this.supabaseClient
				.getClient()
				.from('entity_complete_view')
				.select('*')
				.eq('campaign_id', this.campaignId)
				.eq('type', entityType)
				.ilike('name', entityName) // Case-insensitive search
				.maybeSingle(); // Returns null instead of error if not found

			if (error) throw error;
			if (!data) return null;

			return this.#transformEntityData(data);
		} catch (error) {
			console.warn(`Tooltip fetch failed for ${entityType}:${entityName}`, error);
			return null;
		}
	}

	async #fetchReferenceData(entityType, entityName) {
		if (!this.supabaseClient.isReady()) return null;

		// Spells and Monsters might be in their own reference tables in your DB,
		// or we might fall back to D&D API. Assuming DB tables based on previous prompts:
		try {
			const table = entityType === 'spell' ? 'spells' : 'monsters';
			const nameCol = entityType === 'spell' ? 'spell_name' : 'name';

			const { data, error } = await this.supabaseClient
				.getClient()
				.from(table)
				.select('*')
				.ilike(nameCol, entityName)
				.maybeSingle();

			if (data) return data;

			// If not in DB, try API
			return await this.#fetchFromDndApi(entityType, entityName);
		} catch (e) {
			return await this.#fetchFromDndApi(entityType, entityName);
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
			if (response.ok) return await response.json();
			return null;
		} catch (error) {
			console.error(`API fetch error for ${entityType}:`, error);
			return null;
		}
	}

	#transformEntityData(data) {
		// Helper to extract attribute values
		const getAttr = (key) => {
			if (!data.attributes || !data.attributes[key]) return null;
			const val = data.attributes[key];
			return Array.isArray(val) ? val[0]?.value : val;
		};

		// Normalize data for generators
		return {
			...data,
			// Add convenience fields for common attributes
			race: getAttr('race'),
			class: getAttr('class'),
			level: getAttr('level'),
			status: getAttr('status'),
			description: data.description || getAttr('description'),
			icon: data.icon || getAttr('Portrait') || getAttr('Image'),
		};
	}
}
