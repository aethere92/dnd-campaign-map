// --- START OF FILE StoryUrlManager.js ---

class StoryURLManager {
	static VIEW_TYPES = {
		CAMPAIGN_SELECTION: 'campaign-selection',
		MAP: 'map',
		STORY: 'story',
		SESSION: 'session',
		CHARACTER: 'character',
		QUESTS: 'quests',
		LOCATIONS: 'locations',
		NPCS: 'npcs',
		FACTIONS: 'factions',
		ENCOUNTERS: 'encounters',
		RELATIONSHIPS: 'relationships',
		TIMELINE: 'timeline',
	};

	static PARAMS = {
		CAMPAIGN: 'campaign',
		VIEW: 'view',
		SESSION: 'session',
		CHARACTER: 'charId', // Updated to match ID usage
		MAP: 'map',
		ITEM_ID: 'itemId',
		STATE: 'state',
	};

	static ITEM_PARAMS = ['quest', 'location', 'npc', 'faction', 'encounter'];

	constructor() {
		this.url = new URL(window.location.href);
	}

	getParams() {
		return this.url.searchParams;
	}
	getParam(key) {
		return this.url.searchParams.get(key);
	}

	buildURL(config) {
		const params = new URLSearchParams();
		if (config.campaign) params.set(StoryURLManager.PARAMS.CAMPAIGN, config.campaign);
		if (config.view) params.set(StoryURLManager.PARAMS.VIEW, config.view);

		if (config.session) params.set(StoryURLManager.PARAMS.SESSION, config.session);
		if (config.charId) params.set(StoryURLManager.PARAMS.CHARACTER, config.charId);

		if (config.itemId) {
			// Determine param name based on view or passed explicitly
			const key = config.itemType || 'itemId';
			params.set(key, config.itemId);
		}

		if (config.map) params.set(StoryURLManager.PARAMS.MAP, config.map);

		return `?${params.toString()}`;
	}

	buildCampaignSelectionURL() {
		return `?${StoryURLManager.PARAMS.STATE}=${StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION}`;
	}

	buildStoryItemURL(campaignId, viewType, itemId) {
		// Map view types to param keys
		const typeMap = {
			[StoryURLManager.VIEW_TYPES.QUESTS]: 'quest',
			[StoryURLManager.VIEW_TYPES.LOCATIONS]: 'location',
			[StoryURLManager.VIEW_TYPES.NPCS]: 'npc',
			[StoryURLManager.VIEW_TYPES.FACTIONS]: 'faction',
		};
		const itemType = typeMap[viewType] || 'itemId';
		return this.buildURL({ campaign: campaignId, view: viewType, itemId, itemType });
	}

	createState(view, data) {
		return { view, ...data };
	}

	updateHistory(url, state, replace = false) {
		if (replace) window.history.replaceState(state, '', url);
		else window.history.pushState(state, '', url);
	}

	clearItemParamsExcept(params, keep) {
		StoryURLManager.ITEM_PARAMS.forEach((p) => {
			if (p !== keep) params.delete(p);
		});
	}
}
