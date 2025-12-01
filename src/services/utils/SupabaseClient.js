// --- START OF FILE SupabaseClient.js ---

class SupabaseClient {
	static instance = null;
	#client = null;
	#isInitialized = false;

	// Configuration
	#SUPABASE_URL = 'https://yffukfulnggfhlgoyowg.supabase.co';
	#SUPABASE_ANON_KEY =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZnVrZnVsbmdnZmhsZ295b3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTcyMDYsImV4cCI6MjA3OTEzMzIwNn0.BcB9Uea-vfnxwKA22YpQU0QlFCA0bfigsiDC_r2SNQ4';

	constructor() {
		if (SupabaseClient.instance) {
			return SupabaseClient.instance;
		}

		try {
			// Assumes the Supabase JS library is loaded via CDN in your HTML file
			// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
			this.#client = supabase.createClient(this.#SUPABASE_URL, this.#SUPABASE_ANON_KEY);
			this.#isInitialized = true;
		} catch (error) {
			console.error('SupabaseClient: Failed to initialize:', error);
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

	isReady() {
		return this.#isInitialized && this.#client !== null;
	}

	getClient() {
		return this.#client;
	}

	// ==========================================
	// CAMPAIGN MANAGEMENT
	// ==========================================

	/**
	 * Get a list of all available campaigns.
	 */
	async getAllCampaigns() {
		if (!this.isReady()) return [];

		const { data, error } = await this.#client
			.from('campaigns')
			.select('id, name, description, metadata, styling')
			.order('name');

		if (error) {
			console.error('Error fetching campaigns:', error);
			throw error;
		}
		return data || [];
	}

	/**
	 * Get full metadata for a specific campaign.
	 */
	async getCampaignById(campaignId) {
		if (!this.isReady()) return null;

		const { data, error } = await this.#client.from('campaigns').select('*').eq('id', campaignId).single();

		if (error) {
			console.error(`Error fetching campaign ${campaignId}:`, error);
			throw error;
		}
		return data;
	}

	// ==========================================
	// CORE ENTITIES (Sessions & Events)
	// ==========================================

	/**
	 * Get the list of sessions for the sidebar/navigation (lightweight).
	 */
	async getSessionList(campaignId) {
		const { data, error } = await this.#client
			.from('sessions')
			.select('id, session_number, title, session_date, summary')
			.eq('campaign_id', campaignId)
			.order('session_number', { ascending: true });

		if (error) throw error;
		return data || [];
	}

	/**
	 * Get full details for a single session, including linked events.
	 */
	async getSessionDetails(sessionId) {
		// We fetch the session and join the session_events
		const { data, error } = await this.#client
			.from('sessions')
			.select(
				`
                *,
                events:session_events(
                    *,
                    npc:npcs(id, name),
                    location:locations(id, name),
                    quest:quests(id, title),
                    encounter:encounters(id, name),
                    faction:factions(id, name)
                )
            `
			)
			.eq('id', sessionId)
			.single();

		if (error) throw error;

		// Sort events by order if they aren't already
		if (data.events) {
			data.events.sort((a, b) => a.event_order - b.event_order);
		}
		return data;
	}

	// ==========================================
	// CHARACTERS & NPCS
	// ==========================================

	async getCharacters(campaignId) {
		const { data, error } = await this.#client
			.from('characters')
			.select('*')
			.eq('campaign_id', campaignId)
			.eq('is_active', true)
			.order('name');

		if (error) throw error;
		return data || [];
	}

	async getCharacterDetails(characterId) {
		const { data, error } = await this.#client
			.from('characters')
			.select(
				`
                *,
                sessions:character_sessions(
                    notes,
                    session:sessions(id, title, session_number)
                )
            `
			)
			.eq('id', characterId)
			.single();

		if (error) throw error;
		return data;
	}

	async getNPCs(campaignId) {
		const { data, error } = await this.#client.from('npcs').select('*').eq('campaign_id', campaignId).order('name');

		if (error) throw error;
		return data || [];
	}

	// ==========================================
	// WORLD DATA (Locations, Quests, Factions)
	// ==========================================

	async getLocations(campaignId) {
		const { data, error } = await this.#client
			.from('locations')
			.select('*')
			.eq('campaign_id', campaignId)
			.order('name');

		if (error) throw error;
		return data || [];
	}

	async getQuests(campaignId) {
		const { data, error } = await this.#client
			.from('quests')
			.select(
				`
                *,
                objectives:quest_objectives(*)
            `
			)
			.eq('campaign_id', campaignId)
			.order('status')
			.order('title');

		if (error) throw error;
		return data || [];
	}

	async getFactions(campaignId) {
		const { data, error } = await this.#client.from('factions').select('*').eq('campaign_id', campaignId).order('name');

		if (error) throw error;
		return data || [];
	}

	async getEncounters(campaignId) {
		const { data, error } = await this.#client
			.from('encounters')
			.select(
				`
                *,
                rounds:encounter_rounds(*),
                combatants:encounter_initiative(*)
            `
			)
			.eq('campaign_id', campaignId)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	}

	async getTimeline(campaignId) {
		// Assuming you might have a view or table for timeline,
		// or you construct it from sessions/events.
		// For now, fetching sessions serves as a basic timeline.
		return this.getSessionList(campaignId);
	}

	// ==========================================
	// RELATIONSHIPS & ADVANCED VIEWS
	// ==========================================

	/**
	 * Fetch the 'complete' view of an entity for the Wiki/Popup system.
	 */
	async getEntityCompleteData(entityId) {
		const { data, error } = await this.#client.from('entity_complete_view').select('*').eq('id', entityId).single();

		if (error) {
			console.warn(`Entity view fetch failed for ${entityId}`, error);
			return null;
		}
		return data;
	}

	async getGlobalRelationships(campaignId) {
		// This is for the node graph visualization
		const { data, error } = await this.#client
			.from('entity_relationships')
			.select(
				`
                *,
                from:entities!fk_from_entity(name, type),
                to:entities!fk_to_entity(name, type)
            `
			)
			.limit(1000); // Safety limit

		if (error) throw error;
		return data || [];
	}

	/**
	 * Fetch full timeline data: Sessions -> Events -> Related Entities
	 */
	async getTimelineWithEvents(campaignId) {
		if (!this.isReady()) return [];

		const { data, error } = await this.#client
			.from('sessions')
			.select(
				`
                id,
                session_number,
                title,
                session_date,
                events:session_events(
                    id,
                    event_order,
                    event_type,
                    title,
                    description,
                    created_at,
                    npc:npcs(id, name),
                    location:locations(id, name),
                    quest:quests(id, title),
                    encounter:encounters(id, name),
                    faction:factions(id, name),
                    character:characters(id, name)
                )
            `
			)
			.eq('campaign_id', campaignId)
			.order('session_number', { ascending: true });

		if (error) {
			console.error('Error fetching timeline:', error);
			throw error;
		}

		// Sort events within sessions (Supabase sort on nested relation is sometimes tricky, safe to sort in JS)
		if (data) {
			data.forEach((session) => {
				if (session.events) {
					session.events.sort((a, b) => a.event_order - b.event_order);
				}
			});
		}

		return data || [];
	}
}
