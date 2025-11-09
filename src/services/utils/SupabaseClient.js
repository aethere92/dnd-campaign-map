class SupabaseClient {
	static instance = null;
	#client = null;
	#isInitialized = false;

	constructor() {
		if (SupabaseClient.instance) {
			return SupabaseClient.instance;
		}

		// Using the public anon key (safe to expose with proper RLS policies)
		const SUPABASE_URL = 'https://cqumntwoephyeutyckjh.supabase.co'; // e.g., 'https://xxxxx.supabase.co'
		const SUPABASE_ANON_KEY =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdW1udHdvZXBoeWV1dHlja2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NjU3MTIsImV4cCI6MjA3ODI0MTcxMn0.bKWD7u8v0dg72aEr5a_mgyyto3IwUilBuOg9o9IlShM';

		try {
			this.#client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
			this.#isInitialized = true;
		} catch (error) {
			console.error('Failed to initialize Supabase client:', error);
			this.#isInitialized = false;
		}

		SupabaseClient.instance = this;
	}

	static getInstance() {
		if (!SupabaseClient.instance) {
			new SupabaseClient();
		}
		return SupabaseClient.instance;
	}

	getClient() {
		return this.#client;
	}

	isReady() {
		return this.#isInitialized && this.#client !== null;
	}

	/**
	 * Fetch session data from Supabase
	 */
	async fetchSessionData(campaignId, sessionId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('sessions')
				.select('narrative, summary')
				.eq('campaign_id', campaignId)
				.eq('id', sessionId)
				.single();

			if (error) throw error;
			if (!data) throw new Error(`No session found for ${campaignId}/${sessionId}`);

			return data;
		} catch (error) {
			console.error(`Error fetching session ${sessionId}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch all sessions for a campaign
	 */
	async fetchCampaignSessions(campaignId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('sessions')
				.select('*')
				.eq('campaign_id', campaignId)
				.order('session_order', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error(`Error fetching sessions for ${campaignId}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch all characters for a campaign
	 */
	async fetchCharacters(campaignId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('characters')
				.select('*')
				.eq('campaign_id', campaignId)
				.order('name', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error(`Error fetching characters for ${campaignId}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch a single character
	 */
	async fetchCharacter(campaignId, characterName) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('characters')
				.select('*')
				.eq('campaign_id', campaignId)
				.eq('name', characterName)
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error(`Error fetching character ${characterName}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch all NPCs for a campaign
	 */
	async fetchNPCs(campaignId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('npcs')
				.select('*')
				.eq('campaign_id', campaignId)
				.order('name', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error(`Error fetching NPCs for ${campaignId}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch all locations for a campaign
	 */
	async fetchLocations(campaignId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('locations')
				.select('*')
				.eq('campaign_id', campaignId)
				.order('name', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error(`Error fetching locations for ${campaignId}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch all quests for a campaign
	 */
	async fetchQuests(campaignId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('quests')
				.select('*')
				.eq('campaign_id', campaignId)
				.order('title', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error(`Error fetching quests for ${campaignId}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch all factions for a campaign
	 */
	async fetchFactions(campaignId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('factions')
				.select('*')
				.eq('campaign_id', campaignId)
				.order('name', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error(`Error fetching factions for ${campaignId}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch all encounters for a campaign
	 */
	async fetchEncounters(campaignId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('encounters')
				.select('*')
				.eq('campaign_id', campaignId)
				.order('session', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error(`Error fetching encounters for ${campaignId}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch timeline for a campaign
	 */
	async fetchTimeline(campaignId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#client
				.from('timeline')
				.select('*')
				.eq('campaign_id', campaignId)
				.order('order_index', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error(`Error fetching timeline for ${campaignId}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch all campaign data at once (more efficient)
	 */
	async fetchAllCampaignData(campaignId) {
		if (!this.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const [sessions, characters, npcs, locations, quests, factions, encounters, timeline] = await Promise.all([
				this.fetchCampaignSessions(campaignId).catch(() => []),
				this.fetchCharacters(campaignId).catch(() => []),
				this.fetchNPCs(campaignId).catch(() => []),
				this.fetchLocations(campaignId).catch(() => []),
				this.fetchQuests(campaignId).catch(() => []),
				this.fetchFactions(campaignId).catch(() => []),
				this.fetchEncounters(campaignId).catch(() => []),
				this.fetchTimeline(campaignId).catch(() => []),
			]);

			return {
				sessions,
				characters,
				npcs,
				locations,
				quests,
				factions,
				encounters,
				timeline,
			};
		} catch (error) {
			console.error(`Error fetching all campaign data for ${campaignId}:`, error);
			throw error;
		}
	}
}
