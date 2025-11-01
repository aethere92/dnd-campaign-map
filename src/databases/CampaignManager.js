class CampaignManager {
	static STORAGE_KEY = 'lastCampaignId';
	#currentCampaign = null;
	#mapInstance = null;
	#storyInstance = null;
	#rootElement;
	#recapModal = null;

	constructor(rootElementId, isDebugMode = false) {
		this.#rootElement = document.getElementById(rootElementId);
		this.isDebugMode = isDebugMode;
		this.#initialize();
	}

	#initialize() {
		this.#createViews();

		// Check URL parameters first
		const urlParams = new URLSearchParams(window.location.search);
		const state = urlParams.get('state');
		const campaignId = urlParams.get('campaign');
		const mapKey = urlParams.get('map');
		const sessionId = urlParams.get('session');
		const characterName = urlParams.get('character');
		const viewType = urlParams.get('view');

		// If state is campaign-selection, show selection view regardless of other params
		if (state === 'campaign-selection') {
			this.showCampaignSelection();
			return;
		}

		if (campaignId && this.#isCampaignValid(campaignId)) {
			this.loadCampaign(campaignId, mapKey, sessionId, characterName, viewType);
		} else {
			// Try loading last used campaign
			const lastCampaign = localStorage.getItem(CampaignManager.STORAGE_KEY);
			if (lastCampaign && this.#isCampaignValid(lastCampaign)) {
				this.loadCampaign(lastCampaign); // Load default view for last campaign
			} else {
				// Show campaign selection if no valid campaign is found
				this.showCampaignSelection();
			}
		}

		// Handle browser navigation
		window.addEventListener('popstate', (event) => {
			if (event.state?.view === 'campaigns' || event.state?.state === 'campaign-selection') {
				this.showCampaignSelection();
			} else if (event.state?.campaignId) {
				this.loadCampaign(
					event.state.campaignId,
					event.state.mapKey,
					event.state.sessionId,
					event.state.characterName,
					event.state.viewType
				);
			}
		});
	}

	#createViews() {
		// Create campaign selection view with grid layout
		const selectionView = document.createElement('div');
		selectionView.id = 'campaign-selection';
		selectionView.className = 'view';
		selectionView.style.display = 'none';

		// Create header with DnD themed styling
		const header = document.createElement('header');
		header.className = 'campaign-header';
		header.innerHTML = `
			<h1>Select Your Campaign</h1>
			<p>Choose a campaign to begin your adventure</p>
		`;
		selectionView.appendChild(header);

		// Create campaign grid container
		const campaignGrid = document.createElement('div');
		campaignGrid.className = 'campaign-grid-container';

		// Create campaign cards grid
		const campaignCards = document.createElement('div');
		campaignCards.className = 'campaign-cards-grid';
		campaignGrid.appendChild(campaignCards);

		selectionView.appendChild(campaignGrid);
		this.#rootElement.appendChild(selectionView);

		// Create map view (reuse existing map div)
		const mapView = document.getElementById('map');
		mapView.className = 'view';

		// Create story view
		const storyView = document.createElement('div');
		storyView.id = 'story-view';
		storyView.className = 'view';
		storyView.style.display = 'none';
		this.#rootElement.appendChild(storyView);

		// Add back button to map view
		const backButton = document.getElementById('campaign-select');
		backButton.addEventListener('click', () => this.showCampaignSelection());
	}

	// Helper methods to determine campaign capabilities
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

	#updateCampaignGrid() {
		const campaignCards = document.querySelector('.campaign-cards-grid');
		campaignCards.innerHTML = '';

		// Add all campaigns to the grid
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

		// Create type badges for available content
		let typeBadges = '';
		if (hasMap && hasStory) {
			typeBadges = `
				<div class="campaign-type-badges">
					<div class="campaign-type-badge map">Map</div>
					<div class="campaign-type-badge story">Story</div>
				</div>
			`;
		} else if (hasMap) {
			typeBadges = `<div class="campaign-type-badge map">Map</div>`;
		} else if (hasStory) {
			typeBadges = `<div class="campaign-type-badge story">Story</div>`;
		}

		// Create action buttons based on available content
		let actionButtons = '';
		if (hasMap && hasStory) {
			// Both available - show two buttons
			actionButtons = `
				<div class="campaign-action-buttons">
					<button class="select-campaign-btn map-btn" data-type="map">View Map</button>
					<button class="select-campaign-btn story-btn" data-type="story">Read Story</button>
				</div>
			`;
		} else if (hasAnyContent) {
			// Single type available
			const type = hasMap ? 'map' : 'story';
			const label = hasMap ? 'Read Map' : 'Read Story';
			actionButtons = `
				<button class="select-campaign-btn" data-type="${type}">${label}</button>
			`;
		} else {
			// No content available
			actionButtons = `
				<button class="select-campaign-btn" disabled>No Content Available</button>
			`;
		}

		let characters = '';
		if (campaign?.metadata?.characters) {
			characters += `
				<div class="campaign-characters-container">
					<span class="campaign-characters-text">Party: </span>
					<div class="campaign-characters-content">
				`;
			campaign?.metadata?.characters.forEach((character) => {
				characters += `
					<div class="campaign-selection-character-container" title="${character?.name}">
						<img src="${character?.icon}" class="campaign-selection-character-image"/>
					</div>
				`;
			});
			characters += `</div></div>`;
		}

		// Create main content
		card.innerHTML = `
			<div class="campaign-card-header">
				${typeBadges}
				<div class="campaign-card-level-container">
					<span>Levels</span>
					<span class="campaign-card-level">${campaign?.metadata?.levelRange || 'N/A'}</span>
				</div>
			</div>
			<div class="campaign-card-content">
				<h2>${campaign.metadata?.name || 'Unnamed Campaign'}</h2>
				${
					campaign?.metadata?.description
						? `<div class="campaign-short-description">${campaign?.metadata?.description}</div>`
						: ''
				}
						${characters}
			</div>
			<div class="campaign-card-actions">
				${actionButtons}
			</div>
		`;

		// Add event listeners for action buttons
		if (hasAnyContent) {
			const selectBtns = card.querySelectorAll('.select-campaign-btn:not([disabled])');
			selectBtns.forEach((btn) => {
				btn.addEventListener('click', (e) => {
					e.stopPropagation();
					const type = btn.dataset.type;

					// Clear the campaign-selection state from URL
					const currentUrl = new URL(window.location.href);
					currentUrl.searchParams.delete('state');

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

		return card;
	}

	#getCampaignDefaultMap(campaign) {
		// Helper function to get the default map key for a campaign
		if (campaign.defaultMap) return campaign.defaultMap;
		// If no default map is specified, try to find the first available map
		const data = campaign.data;
		if (!data) return null;

		// Helper function to find the first map key in the object
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
		// Helper function to get the first session ID for a story campaign
		if (!campaign.recaps || !Array.isArray(campaign.recaps) || campaign.recaps.length === 0) {
			return null;
		}
		return campaign.recaps[0].id;
	}

	#isCampaignValid(campaignId) {
		// Check if campaign exists and has either data or recaps (for story campaigns)
		const campaign = CAMPAIGN_DATA.find((campaign) => campaign.id === campaignId);
		return campaign && (this.#hasMapData(campaign) || this.#hasStoryData(campaign));
	}

	loadCampaign(campaignId, mapKey = null, sessionId = null, characterName = null, viewType = null) {
		const campaign = CAMPAIGN_DATA.find((c) => c.id === campaignId);
		// Allow loading if campaign exists and has valid content
		if (!campaign || !this.#isCampaignValid(campaignId)) return;

		this.#currentCampaign = campaign;
		localStorage.setItem(CampaignManager.STORAGE_KEY, campaignId);
		// Initialize the recap modal with the campaign data
		this.#recapModal = StoryRecapModal.getInstance(campaign?.recaps, campaign?.aliases);

		// Hide all views first
		document.getElementById('campaign-selection').style.display = 'none';
		document.getElementById('map').style.display = 'none';
		if (document.getElementById('story-view')) {
			document.getElementById('story-view').style.display = 'none';
		}

		// Determine which type of campaign to load based on parameters
		const hasMap = this.#hasMapData(campaign);
		const hasStory = this.#hasStoryData(campaign);

		// Determine the intended view type
		let targetView = null;
		if (mapKey || (!sessionId && !characterName && !viewType && hasMap)) {
			// Map was explicitly requested, or default to map if available
			targetView = 'map';
		} else if (
			sessionId ||
			characterName ||
			viewType === 'timeline' ||
			viewType === 'quests' ||
			(!hasMap && hasStory)
		) {
			// Story was explicitly requested, or default to story if no map available
			targetView = 'story';
		} else if (hasMap) {
			// Default to map if both available and no specific preference
			targetView = 'map';
		} else if (hasStory) {
			// Fall back to story
			targetView = 'story';
		}

		// Update URL - clear campaign-selection state
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.delete('state'); // Remove campaign-selection state

		if (targetView === 'map' && hasMap) {
			document.getElementById('actions').style.display = 'block';
			currentUrl.searchParams.delete('session');
			currentUrl.searchParams.delete('character');
			currentUrl.searchParams.delete('view');
			// Update history without these params before loading map
			window.history.replaceState(null, '', currentUrl.toString());

			this.#loadMapCampaign(campaign, mapKey);
		} else if (targetView === 'story' && hasStory) {
			document.getElementById('actions').style.display = 'none';
			this.#loadStoryCampaign(campaign, sessionId, characterName, viewType);
		} else {
			console.error('No valid content type determined for campaign:', campaign.id);
			this.showCampaignSelection();
			return;
		}

		this.#setupRecapButton();
	}

	#loadMapCampaign(campaign, mapKey = null) {
		// Determine which map to load
		const defaultMap = mapKey || this.#getCampaignDefaultMap(campaign);
		if (!defaultMap) {
			console.error('No valid map found for campaign:', campaign.id);
			this.showCampaignSelection(); // Go back if no map
			return;
		}

		// Update URL with campaign and map parameters, remove story params
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		params.set('campaign', campaign.id);
		params.set('map', defaultMap);
		params.delete('session');
		params.delete('character');
		params.delete('view');

		// Preserve any existing target parameter if present
		const targetParam = params.get('t');
		if (targetParam) {
			params.set('t', targetParam);
		} else {
			params.delete('t'); // Clean up target if not needed
		}

		const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
		const state = {
			campaignId: campaign.id,
			mapKey: defaultMap,
			view: 'map',
		};
		if (window.history.state?.campaignId === campaign.id && window.history.state?.view === 'map') {
			window.history.replaceState(state, '', newUrl);
		} else {
			window.history.pushState(state, '', newUrl);
		}

		// Show map view
		document.getElementById('map').style.display = 'block';
		// Initialize or update map
		if (!this.#mapInstance) {
			this.#mapInstance = new CustomMap('map', {
				initialMapKey: defaultMap,
				campaignData: campaign.data,
				isDebugMode: this.isDebugMode,
			});
		} else {
			// Reload map with new campaign data and map key
			this.#mapInstance.updateCampaignData(campaign.data); // Update data first
			this.#mapInstance.loadMap(defaultMap); // Then load the specific map
		}
	}

	#loadStoryCampaign(campaign, sessionId = null, characterName = null, viewType = null) {
		// Determine initial state based on URL params passed in
		let initialView = 'session'; // Default to session view
		let initialSessionId = sessionId;
		let initialCharacterName = characterName;

		if (viewType === 'timeline') {
			initialView = 'timeline';
			initialSessionId = null; // Not showing a session
			initialCharacterName = null; // Not showing a character
		} else if (viewType === 'quests') {
			initialView = 'quests';
			initialSessionId = null; // Not showing a session
			initialCharacterName = null; // Not showing a character
		} else if (characterName) {
			initialView = 'character';
			initialSessionId = null; // Not showing a session
			initialCharacterName = characterName;
		} else {
			// If no specific view/character, ensure we have a session ID
			if (!initialSessionId) {
				initialSessionId = this.#getFirstSessionId(campaign);
				if (!initialSessionId) {
					console.error('No valid session found for story campaign:', campaign.id);
					this.showCampaignSelection(); // Go back if no session
					return;
				}
			}
			initialView = 'session';
			initialCharacterName = null; // Ensure character is cleared
		}

		// Update URL with current state
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		params.set('campaign', campaign.id);
		params.delete('map');
		params.delete('t');
		params.delete('state'); // Clear campaign-selection state

		// Set/delete params based on the determined view
		if (initialView === 'timeline') {
			params.set('view', 'timeline');
			params.delete('session');
			params.delete('character');
		} else if (initialView === 'quests') {
			params.set('view', 'quests');
			params.delete('session');
			params.delete('character');
		} else if (initialView === 'character') {
			params.set('character', initialCharacterName);
			params.delete('session');
			params.delete('view');
		} else {
			// Session view
			params.set('session', initialSessionId);
			params.delete('character');
			params.delete('view');
		}

		const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
		const state = {
			campaignId: campaign.id,
			sessionId: initialView === 'session' ? initialSessionId : null,
			characterName: initialView === 'character' ? initialCharacterName : null,
			viewType: initialView === 'quests' ? 'quests' : initialView === 'timeline' ? 'timeline' : null,
			view: 'story', // Generic view state for popstate handling
		};

		if (window.history.state?.campaignId === campaign.id && window.history.state?.view === 'story') {
			window.history.replaceState(state, '', newUrl);
		} else {
			window.history.pushState(state, '', newUrl);
		}

		// Show story view
		document.getElementById('story-view').style.display = 'block';

		// Initialize or update story view with a reference to this campaign manager
		if (!this.#storyInstance) {
			this.#storyInstance = new StoryManager('story-view', {
				campaignData: campaign,
				initialSessionId: initialSessionId,
				initialCharacterName: initialCharacterName,
				initialViewType: viewType, // Pass timeline/character view preference
				isDebugMode: this.isDebugMode,
			});

			// Pass the campaign manager and selection callback to the StoryView
			this.#storyInstance.setCampaignManager(this, () => this.showCampaignSelection());
		} else {
			this.#storyInstance.updateCampaign(campaign, initialSessionId, initialCharacterName, viewType);

			// Make sure the story instance has access to the campaign manager and selection callback
			this.#storyInstance.setCampaignManager(this, () => this.showCampaignSelection());
		}
	}

	#setupRecapButton() {
		const recapButton = document.getElementById('view-recap');
		if (recapButton) {
			// Store the bound function as a property so we can remove it later
			if (!this._boundToggleRecap) {
				this._boundToggleRecap = this.toggleRecap.bind(this);
			}

			// Remove old listener if it exists
			recapButton.removeEventListener('click', this._boundToggleRecap);

			// Add new listener
			recapButton.addEventListener('click', this._boundToggleRecap);
		}
	}

	toggleRecap() {
		if (!this.#recapModal) return;
		const recapButton = document.getElementById('view-recap');
		if (!this.#recapModal.isVisible) {
			// Use the modal's state
			this.#recapModal.show();
			recapButton.classList.add('active');
		} else {
			this.#recapModal.hide();
			recapButton.classList.remove('active');
		}
	}

	showCampaignSelection() {
		// Create a clean URL for campaign selection
		const currentUrl = new URL(window.location.href);
		currentUrl.search = ''; // Clear all search params
		currentUrl.hash = ''; // Clear hash

		// Add campaign-selection state parameter
		currentUrl.searchParams.set('state', 'campaign-selection');

		// Hide recap modal if it exists
		if (this.#recapModal) {
			this.#recapModal.hide();
		}

		// Create state object for history
		const state = {
			view: 'campaigns',
			state: 'campaign-selection',
			campaignId: null, // Clear campaign ID when showing selection
		};

		// Update history with new state
		window.history.pushState(state, '', currentUrl.toString());

		// Show/hide appropriate views
		document.getElementById('campaign-selection').style.display = 'flex';
		document.getElementById('map').style.display = 'none';
		if (document.getElementById('story-view')) {
			document.getElementById('story-view').style.display = 'none';
		}
		document.getElementById('actions').style.display = 'none';

		// Update grid with current campaigns
		this.#updateCampaignGrid();

		// Remove active state from all cards
		document.querySelectorAll('.campaign-card').forEach((card) => {
			card.classList.remove('active');
		});
	}
}
