// --- START OF FILE CampaignManager.js ---

class CampaignManager {
	static STORAGE_KEY = 'lastCampaignId';

	// Core Dependencies
	#supabase;
	#storyUrlManager;

	// State
	#currentCampaign = null;
	#mapInstance = null;
	#storyInstance = null;

	// UI Elements
	#rootElement;
	#recapModal = null; // Re-implemented for backward compatibility if you keep the modal class

	constructor(rootElementId, isDebugMode = false) {
		this.#rootElement = document.getElementById(rootElementId);
		this.isDebugMode = isDebugMode;
		this.#supabase = SupabaseClient.getInstance();
		this.#storyUrlManager = new StoryURLManager();

		this.#initialize();
	}

	async #initialize() {
		this.#createViews();

		if (!this.#supabase.isReady()) {
			this.#showError('Database connection failed. Please check your configuration.');
			return;
		}

		await this.#handleInitialNavigation();
		this.#setupPopStateHandler();
	}

	async #handleInitialNavigation() {
		const params = this.#storyUrlManager.getParams();
		const state = params.get(StoryURLManager.PARAMS.STATE);
		const campaignId = params.get(StoryURLManager.PARAMS.CAMPAIGN);

		// Extract specific view params
		const mapKey = params.get(StoryURLManager.PARAMS.MAP);
		const sessionId = params.get(StoryURLManager.PARAMS.SESSION);
		const characterName = params.get(StoryURLManager.PARAMS.CHARACTER);
		const characterId = params.get('charId');
		const viewType = params.get(StoryURLManager.PARAMS.VIEW);

		let itemId = null;
		for (const param of StoryURLManager.ITEM_PARAMS) {
			const id = params.get(param);
			if (id) {
				itemId = id;
				break;
			}
		}

		// 1. Explicit Campaign Selection Screen
		if (state === StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION) {
			await this.showCampaignSelection();
			return;
		}

		// 2. Load via URL Param
		if (campaignId) {
			await this.loadCampaign(campaignId, mapKey, sessionId, characterId || characterName, viewType, itemId);
			return;
		}

		// 3. Load Last Used
		const lastCampaignId = localStorage.getItem(CampaignManager.STORAGE_KEY);
		if (lastCampaignId) {
			// Validate it exists first
			try {
				await this.loadCampaign(lastCampaignId);
			} catch (e) {
				console.warn('Last campaign invalid, showing selection.');
				await this.showCampaignSelection();
			}
			return;
		}

		// 4. Default to selection
		await this.showCampaignSelection();
	}

	#setupPopStateHandler() {
		window.addEventListener('popstate', async (event) => {
			const state = event.state;

			if (!state || state.view === 'campaigns' || state.state === StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION) {
				await this.showCampaignSelection();
			} else if (state.campaignId) {
				await this.loadCampaign(
					state.campaignId,
					state.mapKey,
					state.sessionId,
					state.characterId || state.characterName,
					state.viewType,
					state.itemId
				);
			}
		});
	}

	// ==========================================
	// VIEW CREATION
	// ==========================================

	#createViews() {
		this.#createCampaignSelectionView();
		this.#createStoryView();
		this.#setupBackButton();
	}

	#createCampaignSelectionView() {
		const selectionView = document.createElement('div');
		selectionView.id = 'campaign-selection';
		selectionView.className = 'view';
		selectionView.style.display = 'none';

		const header = document.createElement('header');
		header.className = 'campaign-header';
		header.innerHTML = `
            <h1>Select Your Campaign</h1>
            <p>Choose a campaign to begin your adventure</p>
        `;

		const campaignGrid = document.createElement('div');
		campaignGrid.className = 'campaign-grid-container';
		campaignGrid.innerHTML = '<div class="loader">Loading campaigns...</div>';

		selectionView.append(header, campaignGrid);
		this.#rootElement.appendChild(selectionView);
	}

	#createStoryView() {
		const storyView = document.createElement('div');
		storyView.id = 'story-view';
		storyView.className = 'view';
		storyView.style.display = 'none';
		this.#rootElement.appendChild(storyView);
	}

	#setupBackButton() {
		const backButton = document.getElementById('campaign-select');
		backButton?.addEventListener('click', () => this.showCampaignSelection());
	}

	#showError(msg) {
		this.#rootElement.innerHTML = `<div class="error-screen" style="padding: 2rem; color: #ff6b6b;">${msg}</div>`;
	}

	// ==========================================
	// CAMPAIGN LOADING LOGIC
	// ==========================================

	async loadCampaign(
		campaignId,
		mapKey = null,
		sessionId = null,
		characterIdentifier = null,
		viewType = null,
		itemId = null
	) {
		// If switching campaigns or first load
		if (!this.#currentCampaign || this.#currentCampaign.id !== campaignId) {
			try {
				this.#currentCampaign = await this.#supabase.getCampaignById(campaignId);
			} catch (e) {
				console.error('Campaign not found', e);
				await this.showCampaignSelection();
				return;
			}
		}

		if (!this.#currentCampaign) {
			await this.showCampaignSelection();
			return;
		}

		localStorage.setItem(CampaignManager.STORAGE_KEY, campaignId);

		// Reset Recap Modal state (if using the old StoryRecapModal class)
		// We defer loading the actual recap content until requested to save bandwidth
		this.#recapModal = null;

		const targetView = await this.#determineTargetView(
			this.#currentCampaign,
			mapKey,
			sessionId,
			characterIdentifier,
			viewType
		);
		this.#hideAllViews();

		if (targetView === StoryURLManager.VIEW_TYPES.MAP) {
			this.#loadMapCampaign(this.#currentCampaign, mapKey);
		} else if (targetView === StoryURLManager.VIEW_TYPES.STORY) {
			await this.#loadStoryCampaign(this.#currentCampaign, sessionId, characterIdentifier, viewType, itemId);
		}

		this.#setupRecapButton();
	}

	async #determineTargetView(campaign, mapKey, sessionId, characterIdentifier, viewType) {
		const metadata = campaign.metadata || {};

		// Map explicitly requested
		if (mapKey) return StoryURLManager.VIEW_TYPES.MAP;

		// Story explicitly requested via params
		const storyViewTypes = Object.values(StoryURLManager.VIEW_TYPES);
		if (sessionId || characterIdentifier || (viewType && storyViewTypes.includes(viewType))) {
			return StoryURLManager.VIEW_TYPES.STORY;
		}

		// Default logic: If defaultMap exists, show Map, otherwise Story
		return metadata.defaultMap ? StoryURLManager.VIEW_TYPES.MAP : StoryURLManager.VIEW_TYPES.STORY;
	}

	#hideAllViews() {
		const select = document.getElementById('campaign-selection');
		const map = document.getElementById('map');
		const story = document.getElementById('story-view');

		if (select) select.style.display = 'none';
		if (map) map.style.display = 'none';
		if (story) story.style.display = 'none';
	}

	// ==========================================
	// MAP VIEW
	// ==========================================

	#loadMapCampaign(campaign, mapKey = null) {
		const metadata = campaign.metadata || {};
		const defaultMap = mapKey || metadata.defaultMap;

		if (!defaultMap) {
			console.warn('No map configuration found, falling back to story.');
			this.#loadStoryCampaign(campaign);
			return;
		}

		// URL Update
		const url = this.#storyUrlManager.buildURL({
			campaign: campaign.id,
			map: defaultMap,
		});
		const state = this.#storyUrlManager.createState(StoryURLManager.VIEW_TYPES.MAP, {
			campaignId: campaign.id,
			mapKey: defaultMap,
		});
		this.#storyUrlManager.updateHistory(url, state);

		// Move Map DOM Element if needed
		const mapEl = document.getElementById('map');
		const rootEl = document.getElementById('root');
		if (mapEl && rootEl && mapEl.parentElement !== rootEl) {
			rootEl.appendChild(mapEl);
		}

		if (mapEl) mapEl.style.display = 'block';
		const actionsEl = document.getElementById('actions');
		if (actionsEl) actionsEl.style.display = 'block';

		// Map Initialization
		// We expect mapData (markers, paths) to be in metadata.mapData or loaded separately
		const mapData = metadata.mapData || {};

		if (!this.#mapInstance && window.customMap) {
			this.#mapInstance = window.customMap;
		}

		if (!this.#mapInstance) {
			this.#mapInstance = new CustomMap('map', {
				initialMapKey: defaultMap,
				campaignData: mapData,
				isDebugMode: this.isDebugMode,
			});
		} else {
			this.#mapInstance.updateCampaignData(mapData);
			this.#mapInstance.loadMap(defaultMap);
			setTimeout(() => {
				try {
					this.#mapInstance.getCurrentMap()?.invalidateSize(true);
				} catch (_) {}
			}, 100);
		}
	}

	// ==========================================
	// STORY VIEW
	// ==========================================

	async #loadStoryCampaign(campaign, sessionId, characterIdentifier, viewType, itemId) {
		// If no specific session is requested, we need to find the first one
		let finalSessionId = sessionId;
		if (!sessionId && !characterIdentifier && !viewType) {
			const sessions = await this.#supabase.getSessionList(campaign.id);
			if (sessions.length > 0) finalSessionId = sessions[0].id;
		}

		const urlConfig = { campaign: campaign.id };
		const stateConfig = { campaignId: campaign.id };

		// Configure URL/State
		if (viewType) {
			urlConfig.view = viewType;
			stateConfig.viewType = viewType;
			if (itemId) {
				urlConfig.itemId = itemId;
				stateConfig.itemId = itemId;
			}
		} else if (characterIdentifier) {
			// Check UUID vs Name
			const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(characterIdentifier);
			if (isUUID) {
				urlConfig.charId = characterIdentifier;
				stateConfig.characterId = characterIdentifier;
			} else {
				urlConfig.character = characterIdentifier;
				stateConfig.characterName = characterIdentifier;
			}
			stateConfig.viewType = StoryURLManager.VIEW_TYPES.CHARACTER;
		} else {
			urlConfig.session = finalSessionId;
			stateConfig.sessionId = finalSessionId;
			stateConfig.viewType = StoryURLManager.VIEW_TYPES.SESSION;
		}

		const url = this.#storyUrlManager.buildURL(urlConfig);
		const state = this.#storyUrlManager.createState(StoryURLManager.VIEW_TYPES.STORY, stateConfig);

		this.#storyUrlManager.updateHistory(url, state, true);

		// UI Toggle
		document.getElementById('story-view').style.display = 'block';
		const actions = document.getElementById('actions');
		if (actions) actions.style.display = 'none';

		// Initialize Story Manager
		if (!this.#storyInstance) {
			this.#storyInstance = new StoryManager('story-view', {
				campaignId: campaign.id,
				isDebugMode: this.isDebugMode,
			});
			this.#storyInstance.setCampaignManager(this, () => this.showCampaignSelection());
		}

		// Trigger Render
		await this.#storyInstance.loadContext(campaign, finalSessionId, characterIdentifier, viewType, itemId);
	}

	// ==========================================
	// CAMPAIGN SELECTION SCREEN
	// ==========================================

	async showCampaignSelection() {
		this.#recapModal?.hide();

		// Update URL
		const url = this.#storyUrlManager.buildCampaignSelectionURL();
		const state = this.#storyUrlManager.createState(StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION);
		this.#storyUrlManager.updateHistory(url, state, false);

		// UI Reset
		const selectionView = document.getElementById('campaign-selection');
		selectionView.style.display = 'flex';

		const mapEl = document.getElementById('map');
		if (mapEl) mapEl.style.display = 'none';

		const storyView = document.getElementById('story-view');
		if (storyView) storyView.style.display = 'none';

		const actions = document.getElementById('actions');
		if (actions) actions.style.display = 'none';

		// Fetch and Render Grid
		const gridContainer = selectionView.querySelector('.campaign-grid-container');
		try {
			const campaigns = await this.#supabase.getAllCampaigns();
			this.#renderCampaignGrid(gridContainer, campaigns);
		} catch (error) {
			gridContainer.innerHTML = `<p class="error">Error loading campaigns: ${error.message}</p>`;
		}
	}

	#renderCampaignGrid(container, campaigns) {
		container.innerHTML = '';
		const cardsGrid = document.createElement('div');
		cardsGrid.className = 'campaign-cards-grid';

		if (campaigns.length === 0) {
			container.innerHTML = '<p>No campaigns found.</p>';
			return;
		}

		campaigns.forEach((campaign) => {
			const card = this.#createCampaignCard(campaign);
			cardsGrid.appendChild(card);
		});

		container.appendChild(cardsGrid);
	}

	#createCampaignCard(campaign) {
		const metadata = campaign.metadata || {};
		const card = document.createElement('div');
		card.className = 'campaign-card';
		card.dataset.id = campaign.id;

		card.innerHTML = `
            <div class="campaign-card-header">
                <div class="campaign-type-badges">
                    <div class="campaign-type-badge story">Story</div>
                    ${metadata.defaultMap ? '<div class="campaign-type-badge map">Map</div>' : ''}
                </div>
            </div>
            <div class="campaign-card-content">
                <h2>${campaign.name}</h2>
                <div class="campaign-short-description">${campaign.description || ''}</div>
            </div>
            <div class="campaign-card-actions">
                <button class="select-campaign-btn story-btn">Enter Campaign</button>
            </div>
        `;

		card.querySelector('.story-btn').addEventListener('click', () => {
			this.loadCampaign(campaign.id);
		});

		return card;
	}

	// ==========================================
	// RECAP MODAL LOGIC
	// ==========================================

	#setupRecapButton() {
		const recapButton = document.getElementById('view-recap');
		if (!recapButton) return;

		// Clean up old listeners
		if (this._boundToggleRecap) {
			recapButton.removeEventListener('click', this._boundToggleRecap);
		}

		this._boundToggleRecap = this.toggleRecap.bind(this);
		recapButton.addEventListener('click', this._boundToggleRecap);
	}

	async toggleRecap() {
		const recapButton = document.getElementById('view-recap');

		// If we haven't initialized the modal for this session yet
		if (!this.#recapModal) {
			// Fetch session summaries from DB
			const sessions = await this.#supabase.getSessionList(this.#currentCampaign.id);
			// Transform to format expected by StoryRecapModal (id, title, summary)
			const recaps = sessions.map((s) => ({
				id: s.id,
				title: s.title,
				summary: s.summary,
			}));

			// Assume StoryRecapModal is a global class available in your app
			if (typeof StoryRecapModal !== 'undefined') {
				this.#recapModal = StoryRecapModal.getInstance(recaps, {});
			} else {
				console.warn('StoryRecapModal class not found');
				return;
			}
		}

		if (!this.#recapModal.isVisible) {
			this.#recapModal.show();
			recapButton?.classList.add('active');
		} else {
			this.#recapModal.hide();
			recapButton?.classList.remove('active');
		}
	}
}
