class CampaignManager {
	static STORAGE_KEY = 'lastCampaignId';
	#currentCampaign = null;
	#mapInstance = null;
	#storyInstance = null;
	#rootElement;
	#recapModal = null;
	#storyUrlManager;

	constructor(rootElementId, isDebugMode = false) {
		this.#rootElement = document.getElementById(rootElementId);
		this.isDebugMode = isDebugMode;
		this.#storyUrlManager = new StoryURLManager();
		this.#initialize();
	}

	#initialize() {
		this.#createViews();
		this.#handleInitialNavigation();
		this.#setupPopStateHandler();
	}

	#handleInitialNavigation() {
		const params = this.#storyUrlManager.getParams();
		const state = params.get(StoryURLManager.PARAMS.STATE);
		const campaignId = params.get(StoryURLManager.PARAMS.CAMPAIGN);
		const mapKey = params.get(StoryURLManager.PARAMS.MAP);
		const sessionId = params.get(StoryURLManager.PARAMS.SESSION);
		const characterName = params.get(StoryURLManager.PARAMS.CHARACTER);
		const viewType = params.get(StoryURLManager.PARAMS.VIEW);

		// MODIFIED: Find any item-specific parameter (e.g., location, quest, npc)
		let itemId = null;
		for (const param of StoryURLManager.ITEM_PARAMS) {
			const id = params.get(param);
			if (id) {
				itemId = id;
				break;
			}
		}

		// Campaign selection state takes precedence
		if (state === StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION) {
			this.showCampaignSelection();
			return;
		}

		// Try to load specific campaign
		if (campaignId && this.#isCampaignValid(campaignId)) {
			// MODIFIED: Pass the found itemId to loadCampaign
			this.loadCampaign(campaignId, mapKey, sessionId, characterName, viewType, itemId);
			return;
		}

		// Fall back to last used campaign
		const lastCampaign = localStorage.getItem(CampaignManager.STORAGE_KEY);
		if (lastCampaign && this.#isCampaignValid(lastCampaign)) {
			this.loadCampaign(lastCampaign);
			return;
		}

		// Default to campaign selection
		this.showCampaignSelection();
	}

	#setupPopStateHandler() {
		window.addEventListener('popstate', (event) => {
			const state = event.state;

			if (state?.view === 'campaigns' || state?.state === StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION) {
				this.showCampaignSelection();
			} else if (state?.campaignId) {
				// MODIFIED: Pass state.itemId from the popstate event
				this.loadCampaign(
					state.campaignId,
					state.mapKey,
					state.sessionId,
					state.characterName,
					state.viewType,
					state.itemId // This property is set by StoryBase's updateUrl
				);
			}
		});
	}

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

		const campaignCards = document.createElement('div');
		campaignCards.className = 'campaign-cards-grid';
		campaignGrid.appendChild(campaignCards);

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

	// Campaign validation helpers
	#hasMapData(campaign) {
		return !!(campaign.data && this.#getCampaignDefaultMap(campaign));
	}

	#hasStoryData(campaign) {
		return !!(campaign.recaps && Array.isArray(campaign.recaps) && campaign.recaps.length > 0);
	}

	#getCampaignTypes(campaign) {
		const types = [];
		if (this.#hasMapData(campaign)) types.push('map');
		if (this.#hasStoryData(campaign)) types.push('story');
		return types;
	}

	#isCampaignValid(campaignId) {
		const campaign = CAMPAIGN_DATA.find((campaign) => campaign.id === campaignId);
		return campaign && (this.#hasMapData(campaign) || this.#hasStoryData(campaign));
	}

	#getCampaignDefaultMap(campaign) {
		if (campaign.defaultMap) return campaign.defaultMap;

		const data = campaign.data;
		if (!data) return null;

		const findFirstMap = (obj) => {
			if (!obj || typeof obj !== 'object') return null;
			for (const key in obj) {
				if (obj[key]?.image) return key;
				const result = findFirstMap(obj[key]);
				if (result) return `${key}.${result}`;
			}
			return null;
		};

		return findFirstMap(data);
	}

	#getFirstSessionId(campaign) {
		return campaign.recaps?.[0]?.id || null;
	}

	// Campaign grid management
	#updateCampaignGrid() {
		const campaignCards = document.querySelector('.campaign-cards-grid');
		campaignCards.innerHTML = '';

		CAMPAIGN_DATA.forEach((campaign) => {
			const card = this.#createCampaignCard(campaign);
			campaignCards.appendChild(card);
		});
	}

	#createCampaignCard(campaign) {
		const card = document.createElement('div');
		card.className = 'campaign-card';
		card.dataset.campaignId = campaign.id;

		const availableTypes = this.#getCampaignTypes(campaign);
		const hasMap = availableTypes.includes('map');
		const hasStory = availableTypes.includes('story');
		const hasAnyContent = hasMap || hasStory;

		card.innerHTML = `
			<div class="campaign-card-header">
				${this.#createTypeBadges(hasMap, hasStory)}
				<div class="campaign-card-level-container">
					<span>Levels</span>
					<span class="campaign-card-level">${campaign?.metadata?.levelRange || 'N/A'}</span>
				</div>
			</div>
			<div class="campaign-card-content">
				<h2>${campaign.metadata?.name || 'Unnamed Campaign'}</h2>
				${
					campaign?.metadata?.description
						? `<div class="campaign-short-description">${campaign.metadata.description}</div>`
						: ''
				}
				${this.#createCharactersList(campaign)}
			</div>
			<div class="campaign-card-actions">
				${this.#createActionButtons(campaign, hasMap, hasStory, hasAnyContent)}
			</div>
		`;

		this.#attachCardListeners(card, campaign, hasMap, hasStory, hasAnyContent);
		return card;
	}

	#createTypeBadges(hasMap, hasStory) {
		if (hasMap && hasStory) {
			return `
				<div class="campaign-type-badges">
					<div class="campaign-type-badge map">Map</div>
					<div class="campaign-type-badge story">Story</div>
				</div>
			`;
		} else if (hasMap) {
			return `<div class="campaign-type-badge map">Map</div>`;
		} else if (hasStory) {
			return `<div class="campaign-type-badge story">Story</div>`;
		}
		return '';
	}

	#createCharactersList(campaign) {
		if (!campaign?.metadata?.characters) return '';

		let html = `
			<div class="campaign-characters-container">
				<span class="campaign-characters-text">Party: </span>
				<div class="campaign-characters-content">
		`;

		campaign.metadata.characters.forEach((character) => {
			html += `
				<div class="campaign-selection-character-container" title="${character?.name}">
					<img src="${character?.icon}" class="campaign-selection-character-image"/>
				</div>
			`;
		});

		html += `</div></div>`;
		return html;
	}

	#createActionButtons(campaign, hasMap, hasStory, hasAnyContent) {
		if (hasMap && hasStory) {
			return `
				<div class="campaign-action-buttons">
					<button class="select-campaign-btn map-btn" data-type="map">View Map</button>
					<button class="select-campaign-btn story-btn" data-type="story">Read Story</button>
				</div>
			`;
		} else if (hasAnyContent) {
			const type = hasMap ? 'map' : 'story';
			const label = hasMap ? 'Read Map' : 'Read Story';
			return `<button class="select-campaign-btn" data-type="${type}">${label}</button>`;
		} else {
			return `<button class="select-campaign-btn" disabled>No Content Available</button>`;
		}
	}

	#attachCardListeners(card, campaign, hasMap, hasStory, hasAnyContent) {
		if (!hasAnyContent) return;

		const selectBtns = card.querySelectorAll('.select-campaign-btn:not([disabled])');
		selectBtns.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.stopPropagation();
				const type = btn.dataset.type;

				if (type === 'map') {
					const defaultMap = this.#getCampaignDefaultMap(campaign);
					this.loadCampaign(campaign.id, defaultMap);
				} else if (type === 'story') {
					const firstSessionId = this.#getFirstSessionId(campaign);
					this.loadCampaign(campaign.id, null, firstSessionId);
				}
			});
		});
	}

	// Main campaign loading
	// MODIFIED: Added itemId = null to the signature
	loadCampaign(campaignId, mapKey = null, sessionId = null, characterName = null, viewType = null, itemId = null) {
		const campaign = CAMPAIGN_DATA.find((c) => c.id === campaignId);
		if (!campaign || !this.#isCampaignValid(campaignId)) return;

		this.#currentCampaign = campaign;
		localStorage.setItem(CampaignManager.STORAGE_KEY, campaignId);
		this.#recapModal = StoryRecapModal.getInstance(campaign?.recaps, campaign?.aliases);

		const targetView = this.#determineTargetView(campaign, mapKey, sessionId, characterName, viewType);
		this.#hideAllViews();

		if (targetView === StoryURLManager.VIEW_TYPES.MAP) {
			this.#loadMapCampaign(campaign, mapKey);
		} else if (targetView === StoryURLManager.VIEW_TYPES.STORY) {
			// MODIFIED: Pass itemId to #loadStoryCampaign
			this.#loadStoryCampaign(campaign, sessionId, characterName, viewType, itemId);
		} else {
			console.error('No valid content type determined for campaign:', campaign.id);
			this.showCampaignSelection();
			return;
		}

		this.#setupRecapButton();
	}

	#determineTargetView(campaign, mapKey, sessionId, characterName, viewType) {
		const hasMap = this.#hasMapData(campaign);
		const hasStory = this.#hasStoryData(campaign);

		// Map explicitly requested or default
		if (mapKey || (!sessionId && !characterName && !viewType && hasMap)) {
			return StoryURLManager.VIEW_TYPES.MAP;
		}

		// Story explicitly requested or fallback
		const storyViewTypes = [
			StoryURLManager.VIEW_TYPES.TIMELINE,
			StoryURLManager.VIEW_TYPES.QUESTS,
			StoryURLManager.VIEW_TYPES.NPCS,
			StoryURLManager.VIEW_TYPES.LOCATIONS,
			StoryURLManager.VIEW_TYPES.FACTIONS,
			StoryURLManager.VIEW_TYPES.ENCOUNTERS,
		];

		if (sessionId || characterName || storyViewTypes.includes(viewType) || (!hasMap && hasStory)) {
			return StoryURLManager.VIEW_TYPES.STORY;
		}

		// Default preference: map > story
		return hasMap ? StoryURLManager.VIEW_TYPES.MAP : hasStory ? StoryURLManager.VIEW_TYPES.STORY : null;
	}

	#hideAllViews() {
		document.getElementById('campaign-selection').style.display = 'none';
		document.getElementById('map').style.display = 'none';
		document.getElementById('story-view').style.display = 'none';
	}

	#loadMapCampaign(campaign, mapKey = null) {
		const defaultMap = mapKey || this.#getCampaignDefaultMap(campaign);
		if (!defaultMap) {
			console.error('No valid map found for campaign:', campaign.id);
			this.showCampaignSelection();
			return;
		}

		// Build URL and state
		const url = this.#storyUrlManager.buildURL({
			campaign: campaign.id,
			map: defaultMap,
			target: this.#storyUrlManager.getParam(StoryURLManager.PARAMS.TARGET),
		});

		const state = this.#storyUrlManager.createState(StoryURLManager.VIEW_TYPES.MAP, {
			campaignId: campaign.id,
			mapKey: defaultMap,
		});

		this.#storyUrlManager.updateHistory(url, state);

		// Show and initialize map
		document.getElementById('map').style.display = 'block';
		document.getElementById('actions').style.display = 'block';

		if (!this.#mapInstance) {
			this.#mapInstance = new CustomMap('map', {
				initialMapKey: defaultMap,
				campaignData: campaign.data,
				isDebugMode: this.isDebugMode,
			});
		} else {
			this.#mapInstance.updateCampaignData(campaign.data);
			this.#mapInstance.loadMap(defaultMap);
		}
	}

	// MODIFIED: Added itemId = null to the signature
	#loadStoryCampaign(campaign, sessionId = null, characterName = null, viewType = null, itemId = null) {
		const storyConfig = this.#determineStoryConfig(campaign, sessionId, characterName, viewType);

		if (!storyConfig) {
			console.error('No valid session found for story campaign:', campaign.id);
			this.showCampaignSelection();
			return;
		}

		// Build URL and state
		const urlConfig = { campaign: campaign.id };
		const stateConfig = { campaignId: campaign.id };

		if (storyConfig.view === StoryURLManager.VIEW_TYPES.SESSION) {
			urlConfig.session = storyConfig.sessionId;
			stateConfig.sessionId = storyConfig.sessionId;
		} else if (storyConfig.view === StoryURLManager.VIEW_TYPES.CHARACTER) {
			urlConfig.character = storyConfig.characterName;
			stateConfig.characterName = storyConfig.characterName;
		} else {
			urlConfig.view = storyConfig.view;
			stateConfig.viewType = storyConfig.view;

			// MODIFIED: If an itemId was passed (from initial load or popstate),
			// add it to the URL and state configs.
			if (itemId) {
				const itemType = StoryURLManager.getItemParamName(storyConfig.view);
				if (itemType) {
					urlConfig.itemType = itemType; // e.g., 'location'
					urlConfig.itemId = itemId; // e.g., 'kaedins-village'
					stateConfig.itemType = itemType;
					stateConfig.itemId = itemId;
				}
			}
		}

		const url = this.#storyUrlManager.buildURL(urlConfig);
		const state = this.#storyUrlManager.createState(StoryURLManager.VIEW_TYPES.STORY, stateConfig);

		// MODIFIED: Use replace=true so the back button doesn't just
		// reload the same view without the item parameter.
		this.#storyUrlManager.updateHistory(url, state, true);

		// Show and initialize story view
		document.getElementById('story-view').style.display = 'block';
		document.getElementById('actions').style.display = 'none';

		if (!this.#storyInstance) {
			this.#storyInstance = new StoryManager('story-view', {
				campaignData: campaign,
				initialSessionId: storyConfig.sessionId,
				initialCharacterName: storyConfig.characterName,
				initialViewType: storyConfig.view,
				isDebugMode: this.isDebugMode,
			});
			this.#storyInstance.setCampaignManager(this, () => this.showCampaignSelection());
		} else {
			this.#storyInstance.updateCampaign(campaign, storyConfig.sessionId, storyConfig.characterName, storyConfig.view);
			this.#storyInstance.setCampaignManager(this, () => this.showCampaignSelection());
		}
	}

	#determineStoryConfig(campaign, sessionId, characterName, viewType) {
		const viewTypes = {
			[StoryURLManager.VIEW_TYPES.TIMELINE]: StoryURLManager.VIEW_TYPES.TIMELINE,
			[StoryURLManager.VIEW_TYPES.QUESTS]: StoryURLManager.VIEW_TYPES.QUESTS,
			[StoryURLManager.VIEW_TYPES.LOCATIONS]: StoryURLManager.VIEW_TYPES.LOCATIONS,
			[StoryURLManager.VIEW_TYPES.NPCS]: StoryURLManager.VIEW_TYPES.NPCS,
			[StoryURLManager.VIEW_TYPES.FACTIONS]: StoryURLManager.VIEW_TYPES.FACTIONS,
			[StoryURLManager.VIEW_TYPES.ENCOUNTERS]: StoryURLManager.VIEW_TYPES.ENCOUNTERS,
		};

		// Special views
		if (viewTypes[viewType]) {
			return {
				view: viewTypes[viewType],
				sessionId: null,
				characterName: null,
			};
		}

		// Character view
		if (characterName) {
			return {
				view: StoryURLManager.VIEW_TYPES.CHARACTER,
				sessionId: null,
				characterName: characterName,
			};
		}

		// Session view (default)
		const finalSessionId = sessionId || this.#getFirstSessionId(campaign);
		if (!finalSessionId) return null;

		return {
			view: StoryURLManager.VIEW_TYPES.SESSION,
			sessionId: finalSessionId,
			characterName: null,
		};
	}

	#setupRecapButton() {
		const recapButton = document.getElementById('view-recap');
		if (!recapButton) return;

		if (!this._boundToggleRecap) {
			this._boundToggleRecap = this.toggleRecap.bind(this);
		}

		recapButton.removeEventListener('click', this._boundToggleRecap);
		recapButton.addEventListener('click', this._boundToggleRecap);
	}

	toggleRecap() {
		if (!this.#recapModal) return;

		const recapButton = document.getElementById('view-recap');

		if (!this.#recapModal.isVisible) {
			this.#recapModal.show();
			recapButton?.classList.add('active');
		} else {
			this.#recapModal.hide();
			recapButton?.classList.remove('active');
		}
	}

	showCampaignSelection() {
		// Hide recap modal
		this.#recapModal?.hide();

		// Build URL and state
		const url = this.#storyUrlManager.buildCampaignSelectionURL();
		const state = this.#storyUrlManager.createState(StoryURLManager.VIEW_TYPES.CAMPAIGN_SELECTION);

		this.#storyUrlManager.updateHistory(url, state, false);

		// Show campaign selection view
		document.getElementById('campaign-selection').style.display = 'flex';
		document.getElementById('map').style.display = 'none';
		document.getElementById('story-view').style.display = 'none';
		document.getElementById('actions').style.display = 'none';

		// Update grid and clear selection
		this.#updateCampaignGrid();
		document.querySelectorAll('.campaign-card').forEach((card) => {
			card.classList.remove('active');
		});
	}
}
