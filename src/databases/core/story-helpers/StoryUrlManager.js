// Centralized URL and Navigation Management
class StoryURLManager {
	static VIEW_TYPES = {
		CAMPAIGN_SELECTION: 'campaign-selection',
		MAP: 'map',
		STORY: 'story',
		SESSION: 'session',
		CHARACTER: 'character',
		TIMELINE: 'timeline',
		QUESTS: 'quests',
		LOCATIONS: 'locations',
		NPCS: 'npcs',
		FACTIONS: 'factions',
	};

	static PARAMS = {
		STATE: 'state',
		CAMPAIGN: 'campaign',
		MAP: 'map',
		SESSION: 'session',
		CHARACTER: 'character',
		VIEW: 'view',
		TARGET: 't',
		// Item-specific params
		QUEST: 'quest',
		LOCATION: 'location',
		NPC: 'npc',
		FACTION: 'faction',
	};

	static ITEM_PARAMS = [
		StoryURLManager.PARAMS.QUEST,
		StoryURLManager.PARAMS.LOCATION,
		StoryURLManager.PARAMS.NPC,
		StoryURLManager.PARAMS.FACTION,
	];

	constructor() {
		this.currentUrl = new URL(window.location.href);
	}

	// Get current parameters
	getParams() {
		return new URLSearchParams(this.currentUrl.search);
	}

	getParam(key) {
		return this.getParams().get(key);
	}

	// Build clean URL with ordered parameters
	buildURL(config = {}) {
		const { campaign, view, map, session, character, itemType, itemId, target, hash } = config;

		const params = new URLSearchParams();

		// Add parameters in specific order
		if (campaign) params.set(StoryURLManager.PARAMS.CAMPAIGN, campaign);
		if (view) params.set(StoryURLManager.PARAMS.VIEW, view);
		if (map) params.set(StoryURLManager.PARAMS.MAP, map);
		if (session) params.set(StoryURLManager.PARAMS.SESSION, session);
		if (character) params.set(StoryURLManager.PARAMS.CHARACTER, character);
		if (itemType && itemId) params.set(itemType, encodeURIComponent(itemId));
		if (target) params.set(StoryURLManager.PARAMS.TARGET, target);

		const hashStr = hash ? `#${hash}` : '';
		return `${window.location.pathname}?${params.toString()}${hashStr}`;
	}

	// Build URL for campaign selection
	buildCampaignSelectionURL() {
		const params = new URLSearchParams();
		params.set(StoryURLManager.PARAMS.STATE, StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION);
		return `${window.location.pathname}?${params.toString()}`;
	}

	// Build URL for story view with item targeting
	buildStoryItemURL(campaignId, viewType, itemId = null) {
		const config = {
			campaign: campaignId,
			view: viewType,
		};

		if (itemId) {
			const paramMap = {
				[StoryURLManager.VIEW_TYPES.QUESTS]: StoryURLManager.PARAMS.QUEST,
				[StoryURLManager.VIEW_TYPES.LOCATIONS]: StoryURLManager.PARAMS.LOCATION,
				[StoryURLManager.VIEW_TYPES.NPCS]: StoryURLManager.PARAMS.NPC,
				[StoryURLManager.VIEW_TYPES.FACTIONS]: StoryURLManager.PARAMS.FACTION,
			};
			config.itemType = paramMap[viewType];
			config.itemId = itemId;
		}

		return this.buildURL(config);
	}

	// Clear specific parameter types
	clearMapParams(params) {
		params.delete(StoryURLManager.PARAMS.MAP);
		params.delete(StoryURLManager.PARAMS.TARGET);
	}

	clearStoryParams(params) {
		params.delete(StoryURLManager.PARAMS.SESSION);
		params.delete(StoryURLManager.PARAMS.CHARACTER);
		params.delete(StoryURLManager.PARAMS.VIEW);
		this.clearItemParams(params);
	}

	clearItemParams(params) {
		StoryURLManager.ITEM_PARAMS.forEach((param) => params.delete(param));
	}

	clearItemParamsExcept(params, keepParam) {
		StoryURLManager.ITEM_PARAMS.forEach((param) => {
			if (param !== keepParam) params.delete(param);
		});
	}

	// Create history state object
	createState(type, data = {}) {
		const baseState = { view: type };

		switch (type) {
			case StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION:
				return { ...baseState, state: StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION, campaignId: null };

			case StoryURLManager.VIEW_TYPES.MAP:
				return { ...baseState, campaignId: data.campaignId, mapKey: data.mapKey };

			case StoryURLManager.VIEW_TYPES.STORY:
			case StoryURLManager.VIEW_TYPES.SESSION:
			case StoryURLManager.VIEW_TYPES.CHARACTER:
			case StoryURLManager.VIEW_TYPES.TIMELINE:
			case StoryURLManager.VIEW_TYPES.QUESTS:
			case StoryURLManager.VIEW_TYPES.LOCATIONS:
			case StoryURLManager.VIEW_TYPES.NPCS:
			case StoryURLManager.VIEW_TYPES.FACTIONS:
				return {
					...baseState,
					campaignId: data.campaignId,
					sessionId: data.sessionId || null,
					characterName: data.characterName || null,
					viewType: data.viewType || null,
					itemId: data.itemId || null,
					itemType: data.itemType || null,
				};

			default:
				return baseState;
		}
	}

	// Update browser history
	updateHistory(url, state, replace = false) {
		if (replace) {
			window.history.replaceState(state, '', url);
		} else {
			// Check if we should replace instead of push (same view/campaign)
			const currentState = window.history.state;
			const shouldReplace = currentState?.campaignId === state.campaignId && currentState?.view === state.view;

			if (shouldReplace) {
				window.history.replaceState(state, '', url);
			} else {
				window.history.pushState(state, '', url);
			}
		}
	}

	// Navigation helper for story items
	static getItemParamName(viewType) {
		const paramMap = {
			[StoryURLManager.VIEW_TYPES.QUESTS]: StoryURLManager.PARAMS.QUEST,
			[StoryURLManager.VIEW_TYPES.LOCATIONS]: StoryURLManager.PARAMS.LOCATION,
			[StoryURLManager.VIEW_TYPES.NPCS]: StoryURLManager.PARAMS.NPC,
			[StoryURLManager.VIEW_TYPES.FACTIONS]: StoryURLManager.PARAMS.FACTION,
		};
		return paramMap[viewType];
	}
}
