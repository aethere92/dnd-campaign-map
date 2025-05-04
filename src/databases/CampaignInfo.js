const CAMPAIGN_DATA = [
	{
		id: 'campaign-001',
		campaignId: 1,
		metadata: {
			name: "A quest, a questin' we shall go",
			description:
				'Six adventurers — a cleric, ranger, sorcerer, bard, and two barbarians — receive mysterious invitations to a strange, distant land. Teaming up with a band of pirates, they embark on an epic journey, battling fearsome monsters and navigating treacherous seas. Their quest takes an unexpected turn as they find themselves stranded on the enigmatic island of Korinis, where new challenges and hidden secrets await.',
			levelRange: '3-8',
			characters: CAMPAIGN_01_CHARACTERS,
			charactersPosition: 'left',
			campaignType: 'map',
		},
		styling: {
			icon: 'images/pageicon.png',
			backgroundColor: '#795548',
		},
		defaultMap: 'korinis_island',
		data: CAMPAIGN_01,
		aliases: CAMPAIGN_01_ALIASES,
		recaps: SESSION_RECAPS,
	},
	{
		id: 'campaign-001-text',
		campaignId: 1,
		metadata: {
			name: "A quest, a questin' we shall go",
			description:
				'Six adventurers — a cleric, ranger, sorcerer, bard, and two barbarians — receive mysterious invitations to a strange, distant land. Teaming up with a band of pirates, they embark on an epic journey, battling fearsome monsters and navigating treacherous seas. Their quest takes an unexpected turn as they find themselves stranded on the enigmatic island of Korinis, where new challenges and hidden secrets await.',
			levelRange: '3-8',
			characters: CAMPAIGN_01_CHARACTERS,
			charactersPosition: 'left',
			campaignType: 'story',
		},
		styling: {
			icon: 'images/pageicon.png',
		},
		data: [],
		recaps: CAMPAIGN_01_RECAPS,
		timeline: CAMPAIGN_001_TIMELINE,
	},
	{
		id: 'campaign-002',
		campaignId: 2,
		metadata: {
			name: 'The Red Hand of Doom',
			description: `Five unlikely heroes—diverse in race and origin—journey together through a lush subtropical forest, their past encounters ranging from friendly to conflicting. Bound now by shared purpose or hidden motives, they travel in harmony, their story beginning not on a well-worn road, but along a wild path where camaraderie grows with each step.`,
			levelRange: '6-',
			characters: CAMPAIGN_02_CHARACTERS,
			charactersPosition: 'right',
			campaignType: 'story',
		},
		styling: {
			icon: 'images/pageicon.png',
		},
		data: [],
		// aliases: CAMPAIGN_02_ALIASES,
		recaps: CAMPAIGN_02_RECAPS,
		timeline: CAMPAIGN_002_TIMELINE,
	},
];

// Campaign selection and management
class CampaignManager {
	static STORAGE_KEY = 'lastCampaignId';
	#currentCampaign = null;
	#mapInstance = null;
	#storyInstance = null;
	#rootElement;
	#recapModal = null;
	#currentCarouselIndex = 0;
	#campaignDetailsVisible = false;

	constructor(rootElementId, isDebugMode = false) {
		this.#rootElement = document.getElementById(rootElementId);
		this.isDebugMode = isDebugMode;
		this.#initialize();
	}

	#initialize() {
		this.#createViews();

		// Check URL parameters first
		const urlParams = new URLSearchParams(window.location.search);
		const campaignId = urlParams.get('campaign');
		const mapKey = urlParams.get('map');
		const sessionId = urlParams.get('session'); // Add param for story sessions
		const characterName = urlParams.get('character');
		const viewType = urlParams.get('view'); // e.g., 'timeline'

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
			if (event.state?.view === 'campaigns') {
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

		// Add campaign details panel (initially hidden)
		const detailsPanel = document.createElement('div');
		detailsPanel.className = 'campaign-details-panel hidden';
		campaignGrid.appendChild(detailsPanel);

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

		// Add campaign type badge
		const campaignType = campaign.metadata?.campaignType || 'map';
		const typeBadge = `<div class="campaign-type-badge ${campaignType}">${
			campaignType.charAt(0).toUpperCase() + campaignType.slice(1)
		}</div>`;

		// Create main content
		card.innerHTML = `
			${typeBadge}
			<div class="campaign-card-content">
				<h2>${campaign.metadata?.name || 'Unnamed Campaign'}</h2>
				${
					campaign.styling?.icon
						? `<img src="${campaign.styling.icon}" alt="${
								campaign.metadata?.name || 'Campaign'
						  } icon" class="campaign-icon">`
						: '<div class="campaign-icon-placeholder"></div>'
				}
				${
					campaign?.metadata?.description
						? `<div class="campaign-short-description">${campaign?.metadata?.description}</div>`
						: ''
				}
			</div>
			<div class="campaign-card-actions">
				<button class="view-details-btn">View Details</button>
				<button class="select-campaign-btn" ${
					!campaign?.data && !(campaign.metadata?.campaignType === 'story' && campaign.recaps?.length) ? 'disabled' : ''
				}>
					Select Campaign
				</button>
			</div>
		`;

		// Add event listeners for buttons
		if (campaign.data || (campaign.metadata?.campaignType === 'story' && campaign.recaps?.length > 0)) {
			const selectBtn = card.querySelector('.select-campaign-btn');
			selectBtn.addEventListener('click', (e) => {
				e.stopPropagation();

				// Determine what to load based on campaign type
				const campaignType = campaign.metadata?.campaignType || 'map';

				if (campaignType === 'map') {
					// For map campaigns, get default map
					const defaultMap = this.#getCampaignDefaultMap(campaign);
					this.loadCampaign(campaign.id, defaultMap);
				} else if (campaignType === 'story') {
					// For story campaigns, get first session by default
					const firstSessionId = this.#getFirstSessionId(campaign);
					// Load the campaign, defaulting to the first session
					this.loadCampaign(campaign.id, null, firstSessionId);
				}
			});
		}

		const detailsBtn = card.querySelector('.view-details-btn');
		detailsBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.#showCampaignDetails(campaign);

			// Mark this card as active
			document.querySelectorAll('.campaign-card').forEach((c) => {
				c.classList.remove('active');
			});
			card.classList.add('active');
		});

		return card;
	}
	#showCampaignDetails(campaign) {
		const detailsPanel = document.querySelector('.campaign-details-panel');

		// Populate details panel
		let charactersHTML = '';
		if (campaign?.metadata?.characters) {
			charactersHTML = '<div class="details-characters-section"><h3>Characters</h3><div class="details-characters">';

			campaign.metadata.characters
				.filter((character) => character?.is_included)
				.forEach((character) => {
					charactersHTML += `
						<div class="details-character">
							<img src="${character?.icon}" class="character-icon icon-${character.class.toLowerCase().replace(/\s+/g, '-')}"/>
							<div class="character-info">
								<span class="character-name">${character.name}</span>
								<span class="character-stats">${character.class}</span>
							</div>
						</div>
					`;
				});

			charactersHTML += '</div></div>';
		}

		detailsPanel.innerHTML = `
			<div class="details-header">
				<h2>${campaign.metadata?.name || 'Campaign Details'}</h2>
				<button class="details-close-button">×</button>
			</div>
			<div class="details-content">
				<div class="details-description">
					<h3>Description</h3>
					<p>${campaign.metadata?.description || 'No description available.'}</p>
				</div>
				${
					campaign?.metadata?.levelRange
						? `<div class="details-levels">
						<h3>Level Range</h3>
						<p>Levels ${campaign.metadata.levelRange}</p>
					</div>`
						: ''
				}
				${charactersHTML}
				${
					campaign.data || (campaign.metadata?.campaignType === 'story' && campaign.recaps?.length > 0)
						? `<div class="details-action">
							<button class="start-campaign-btn">Begin Adventure</button>
						</div>`
						: ''
				}
			</div>
		`;

		// Add event listener to close button
		const closeButton = detailsPanel.querySelector('.details-close-button');
		closeButton.addEventListener('click', () => {
			this.#toggleDetailsPanel(false);
			// Remove active state from all cards
			document.querySelectorAll('.campaign-card').forEach((card) => {
				card.classList.remove('active');
			});
		});

		// Add event listener for start campaign button
		const startBtn = detailsPanel.querySelector('.start-campaign-btn');
		if (startBtn) {
			startBtn.addEventListener('click', () => {
				// Determine what to load based on campaign type
				const campaignType = campaign.metadata?.campaignType || 'map';

				if (campaignType === 'map') {
					// For map campaigns, get default map
					const defaultMap = this.#getCampaignDefaultMap(campaign);
					this.loadCampaign(campaign.id, defaultMap);
				} else if (campaignType === 'story') {
					// For story campaigns, get first session by default
					const firstSessionId = this.#getFirstSessionId(campaign);
					// Load the campaign, defaulting to the first session
					this.loadCampaign(campaign.id, null, firstSessionId);
				}
			});
		}

		// Show the panel
		this.#toggleDetailsPanel(true);
	}

	#toggleDetailsPanel(show) {
		const detailsPanel = document.querySelector('.campaign-details-panel');

		if (show) {
			this.#campaignDetailsVisible = true;

			// Add animation class
			setTimeout(() => {
				detailsPanel.classList.add('visible');
				detailsPanel.classList.remove('hidden');
			}, 10);
		} else {
			detailsPanel.classList.remove('visible');
			this.#campaignDetailsVisible = false;

			// Wait for animation to complete before hiding
			if (!this.#campaignDetailsVisible) {
				detailsPanel.classList.add('hidden');
				detailsPanel.classList.remove('visible');
			}
		}
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
		return campaign && (campaign.data || campaign.recaps?.length > 0); // Allow story campaigns without map data
	}

	loadCampaign(campaignId, mapKey = null, sessionId = null, characterName = null, viewType = null) {
		const campaign = CAMPAIGN_DATA.find((c) => c.id === campaignId);
		// Allow loading if campaign exists, even without map data (for story)
		if (!campaign) return;

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
		// Determine which type of campaign and load accordingly
		const campaignType = campaign.metadata?.campaignType || 'map';
		document.getElementById('actions').style.display = campaignType === 'story' ? 'none' : 'block';

		if (campaignType === 'map') {
			const currentUrl = new URL(window.location.href);
			currentUrl.searchParams.delete('session');
			currentUrl.searchParams.delete('character');
			currentUrl.searchParams.delete('view');
			// Update history without these params before loading map
			window.history.replaceState(null, '', currentUrl.toString());

			this.#loadMapCampaign(campaign, mapKey);
		} else if (campaignType === 'story') {
			this.#loadStoryCampaign(campaign, sessionId, characterName, viewType);
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

	// Replace the #loadStoryCampaign method with this fixed version:

	#loadStoryCampaign(campaign, sessionId = null, characterName = null, viewType = null) {
		// Determine initial state based on URL params passed in
		let initialView = 'session'; // Default to session view
		let initialSessionId = sessionId;
		let initialCharacterName = characterName;

		if (viewType === 'timeline') {
			initialView = 'timeline';
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

		// Set/delete params based on the determined view
		if (initialView === 'timeline') {
			params.set('view', 'timeline');
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
			viewType: initialView === 'timeline' ? 'timeline' : null, // Store the specific view type if needed
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
			this.#storyInstance = new StoryView('story-view', {
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
		// Update URL while preserving campaign parameter
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		const campaignId = params.get('campaign');
		// Preserve campaign ID if it exists

		// Clear other parameters but keep campaign if it exists
		currentUrl.search = '';
		currentUrl.hash = ''; // Clear hash too
		if (campaignId) {
			currentUrl.searchParams.set('campaign', campaignId);
		}

		if (this.#recapModal) {
			this.#recapModal.hide();
		}

		window.history.pushState({ view: 'campaigns', campaignId }, '', currentUrl.toString());

		// Show/hide appropriate views
		document.getElementById('campaign-selection').style.display = 'flex';
		document.getElementById('map').style.display = 'none';
		if (document.getElementById('story-view')) {
			document.getElementById('story-view').style.display = 'none';
		}
		document.getElementById('actions').style.display = 'none';

		// Update grid with current campaigns
		this.#updateCampaignGrid();

		// Hide details panel when showing selection
		this.#toggleDetailsPanel(false);

		// Remove active state from all cards
		document.querySelectorAll('.campaign-card').forEach((card) => {
			card.classList.remove('active');
		});
	}
}

class StoryView {
	#rootElement;
	#campaign;
	#currentSessionId;
	#currentView = 'session'; // 'session', 'character', 'timeline'
	#selectedCharacterName = null;
	#isDebugMode;
	#tooltipContainer;
	#isSidebarCollapsed = false;
	// #isTimelineVisible = false; // Replaced by #currentView
	#apiBaseUrl = 'https://www.dnd5eapi.co/api/2014/'; // Example API
	#supportedEntityTypes = [
		'spell',
		'monster',
		'class',
		'background',
		'race',
		'equipment',
		'magic-item',
		'feat',
		'condition',
		'character',
		'race',
		'npc',
	];
	#entityEndpoints = {
		spell: 'spells',
		monster: 'monsters',
		class: 'classes',
		background: 'backgrounds',
		race: 'races',
		equipment: 'equipment',
		'magic-item': 'magic-item',
		feat: 'feats',
		condition: 'conditions',
		character: 'character',
		race: 'race',
		npc: 'npc',
	};
	#customApiData = CAMPAIGN_02_API_DATA;

	constructor(elementId, options = {}) {
		this.#rootElement = document.getElementById(elementId);
		this.#isDebugMode = options.isDebugMode || false;
		if (!this.#rootElement) {
			console.error('StoryView: Root element not found:', elementId);
			return;
		}
		// Load custom data if available
		if (window.CAMPAIGN_02_API_DATA) {
			this.#customApiData = window.CAMPAIGN_02_API_DATA;
		}

		// Create tooltip container once during initialization
		this.#createTooltipContainer();
		// Check for saved sidebar state in local storage
		const savedSidebarState = localStorage.getItem('story-sidebar-collapsed');
		if (savedSidebarState) {
			this.#isSidebarCollapsed = savedSidebarState === 'true';
		}

		this.updateCampaign(
			options.campaignData,
			options.initialSessionId,
			options.initialCharacterName,
			options.initialViewType
		);
	}

	/**
	 * Returns the sidebar DOM element.
	 * @returns {HTMLElement|null} The sidebar element or null if not found.
	 */
	getSidebarElement() {
		// Ensure the root element is valid before querying
		if (!this.#rootElement) return null;
		return this.#rootElement.querySelector('.story-sidebar');
	}

	setCampaignManager(campaignManager, showCampaignSelectionCallback) {
		this.campaignManager = campaignManager;
		this.showCampaignSelection = showCampaignSelectionCallback;
		this.ensureCampaignSelectionButton();
	}

	ensureCampaignSelectionButton() {
		// This needs to be called whenever the sidebar is refreshed
		const sidebar = this.getSidebarElement();
		if (sidebar) {
			// First remove any existing button to avoid duplicates
			const existingButton = sidebar.querySelector('.story-campaign-selection');
			if (existingButton) {
				existingButton.remove();
			}

			// Create and add the button
			const buttonContainer = document.createElement('div');
			buttonContainer.className = 'story-campaign-selection';
			buttonContainer.style.marginTop = 'auto';
			buttonContainer.style.padding = '10px';

			const backToSelectionButton = document.createElement('button');
			backToSelectionButton.textContent = 'Campaign selection';
			backToSelectionButton.className = 'sidebar-back-button button-secondary';
			backToSelectionButton.style.width = '100%';

			// Use the callback provided by CampaignManager
			backToSelectionButton.addEventListener('click', this.showCampaignSelection);

			buttonContainer.appendChild(backToSelectionButton);
			sidebar.appendChild(buttonContainer);
		}
	}

	updateCampaign(campaign, sessionId = null, characterName = null, viewType = null) {
		if (!campaign) return;

		// Process characters for custom API data
		if (campaign?.metadata?.characters) {
			campaign.metadata.characters.forEach((char) => {
				this.#customApiData.character = this.#customApiData.character || {};
				this.#customApiData.character[char.name] = char;
			});
		}

		this.#campaign = campaign;

		// Determine the initial state based on parameters
		if (viewType === 'timeline') {
			this.#currentView = 'timeline';
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId(); // Keep track of a session even if not displayed
		} else if (characterName) {
			this.#currentView = 'character';
			this.#selectedCharacterName = characterName;
			this.#currentSessionId = sessionId || this.#getFirstSessionId(); // Keep track of a session
		} else {
			this.#currentView = 'session';
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId(); // Must have a session ID here
		}

		// Ensure we have a valid session ID if needed
		if (this.#currentView === 'session' && !this.#currentSessionId) {
			console.error('StoryView: Attempting to show session view without a valid session ID.');
			// Potentially switch to a default state or show an error
			this.#currentSessionId = this.#getFirstSessionId();
			if (!this.#currentSessionId) {
				this.#rootElement.innerHTML = '<p>Error: No sessions found for this campaign.</p>';
				return; // Stop if no sessions exist at all
			}
		}

		this.render();
	}

	#getFirstSessionId() {
		if (!this.#campaign?.recaps?.length) {
			return null;
		}
		return this.#campaign.recaps[0].id;
	}

	async render() {
		if (!this.#rootElement || !this.#campaign) return;

		// Clear the container
		this.#rootElement.innerHTML = '';

		// Create main container
		const container = document.createElement('div');
		container.className = 'story-container';

		// Create main content area with sidebar and content
		const mainContent = document.createElement('div');
		mainContent.className = 'story-main-content';
		if (this.#isSidebarCollapsed) {
			mainContent.classList.add('sidebar-collapsed');
		}

		// Create sidebar with characters and session list
		const sidebar = this.#createSidebar();
		mainContent.appendChild(sidebar);
		// Create content area
		const contentArea = document.createElement('div');
		contentArea.className = 'story-content-area';
		// Load the appropriate content based on the current view - Await this async operation
		await this.#loadContentArea(contentArea);

		mainContent.appendChild(contentArea);
		container.appendChild(mainContent);

		this.#rootElement.appendChild(container);
		// Generate table of contents AFTER content is loaded - only for session view
		if (this.#currentView === 'session') {
			this.#generateTableOfContents(contentArea);
			this.#scrollToHash();
		}
		this.ensureCampaignSelectionButton();
	}

	#createSidebar() {
		const sidebar = document.createElement('div');
		sidebar.className = 'story-sidebar';

		// Add toggle button for sidebar
		const toggleButton = document.createElement('button');
		toggleButton.className = 'sidebar-toggle';
		toggleButton.innerHTML = this.#isSidebarCollapsed ? '&raquo;' : '&laquo;';
		toggleButton.setAttribute('aria-label', this.#isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
		toggleButton.addEventListener('click', () => this.#toggleSidebar(toggleButton));
		sidebar.appendChild(toggleButton);

		// Add campaign name at the top of sidebar
		const campaignName = document.createElement('div');
		campaignName.className = 'story-campaign-name';
		campaignName.innerHTML = `<h3>${this.#campaign.metadata?.name || 'Unnamed Campaign'}</h3>`;
		sidebar.appendChild(campaignName);

		// Add characters section
		this.#createCharacterSection(sidebar);

		// Add timeline section
		this.#createTimelineSection(sidebar);

		// Add sessions section
		this.#createSessionList(sidebar);

		return sidebar;
	}

	// #toggleSidebar remains the same...
	#toggleSidebar(toggleButton) {
		this.#isSidebarCollapsed = !this.#isSidebarCollapsed;
		// Update button text
		toggleButton.innerHTML = this.#isSidebarCollapsed ? '&raquo;' : '&laquo;';
		toggleButton.setAttribute('aria-label', this.#isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
		// Find and toggle the main content container
		const mainContent = this.#rootElement.querySelector('.story-main-content');
		const sidebar = this.#rootElement.querySelector('.story-sidebar');
		if (mainContent) {
			// Add transitioning class to enable animation
			mainContent.classList.add('sidebar-transitioning');

			// Toggle the collapsed class
			mainContent.classList.toggle('sidebar-collapsed', this.#isSidebarCollapsed);
			// Add animation class to sidebar content
			if (sidebar) {
				sidebar.classList.toggle('sidebar-content-collapsed', this.#isSidebarCollapsed);
			}

			// Remove transitioning class after animation completes
			setTimeout(() => {
				mainContent.classList.remove('sidebar-transitioning');
			}, 300); // Match CSS transition duration
		}

		// Save state to local storage
		localStorage.setItem('story-sidebar-collapsed', this.#isSidebarCollapsed);
	}

	#createCharacterSection(sidebar) {
		const characters = this.#campaign.metadata?.characters.filter((character) => character?.is_included);
		if (!characters?.length) {
			return;
		}

		const characterSection = document.createElement('div');
		characterSection.className = 'story-characters-section';

		const sectionTitle = document.createElement('h2');
		sectionTitle.textContent = 'Characters';
		characterSection.appendChild(sectionTitle);
		const characterList = document.createElement('div');
		characterList.className = 'story-character-list';

		characters.forEach((character) => {
			const charCard = document.createElement('div');
			charCard.className = 'story-character-card';

			if (this.#currentView === 'character' && this.#selectedCharacterName === character.name) {
				charCard.classList.add('active');
			}

			charCard.innerHTML = `
                <div class="character-avatar">
                    <img src="${character.icon}" alt="${character.name}" />
                </div>
                <div class="character-info">

             <h3>${character.name}</h3>
                </div>
            `;
			charCard.title = `Lvl ${character.level} ${character.race} ${character.class}`;

			// Add click event to show character background
			charCard.addEventListener('click', () => {
				this.#handleCharacterClick(character.name);
			});

			characterList.appendChild(charCard);
		});
		characterSection.appendChild(characterList);
		sidebar.appendChild(characterSection);
	}

	#handleCharacterClick(characterName) {
		// Toggle selection
		if (this.#currentView === 'character' && this.#selectedCharacterName === characterName) {
			// Deselecting the current character - go back to the current session view
			this.#currentView = 'session';
			this.#selectedCharacterName = null;
		} else {
			// Selecting a new character (or the first time)
			this.#currentView = 'character';
			this.#selectedCharacterName = characterName;
		}

		// Update URL
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		params.set('campaign', this.#campaign.id); // Ensure campaign is set
		params.delete('map'); // Clean up other view params
		params.delete('view');
		params.delete('session'); // Usually hide session when showing character

		if (this.#currentView === 'character') {
			params.set('character', this.#selectedCharacterName);
		} else {
			// Switched back to session view
			params.delete('character');
			// Make sure a session param exists if we fell back to session view
			if (this.#currentSessionId) {
				params.set('session', this.#currentSessionId);
			} else {
				// If no current session somehow, try getting the first one
				const firstSession = this.#getFirstSessionId();
				if (firstSession) params.set('session', firstSession);
			}
		}

		const state = {
			campaignId: this.#campaign.id,
			sessionId: this.#currentView === 'session' ? this.#currentSessionId : null,
			characterName: this.#currentView === 'character' ? this.#selectedCharacterName : null,
			view: 'story', // Keep the main view type
		};
		// Use replaceState as we are interacting within the story view
		window.history.replaceState(state, '', `${currentUrl.pathname}?${params.toString()}`);

		// Re-render to update the content area
		this.render();
	}

	#createSessionList(sidebar) {
		const recaps = this.#campaign.recaps;
		if (!recaps?.length) {
			const noSessions = document.createElement('div');
			noSessions.className = 'no-sessions';
			noSessions.textContent = 'No sessions available';
			sidebar.appendChild(noSessions);
			return;
		}

		const sessionSection = document.createElement('div');
		sessionSection.className = 'story-sessions-section';

		const sectionTitle = document.createElement('h2');
		sectionTitle.textContent = 'Sessions';
		sessionSection.appendChild(sectionTitle);

		const sessionList = document.createElement('div');
		sessionList.className = 'story-session-list';
		recaps.forEach((session) => {
			const sessionItem = document.createElement('div');
			sessionItem.className = 'story-session-item';

			if (this.#currentView === 'session' && session.id === this.#currentSessionId) {
				sessionItem.classList.add('active');
			}

			sessionItem.innerHTML = `
				<h3>${session.title}</h3>
				<div class="session-date">${session.date || ''}</div>
			`;

			sessionItem.addEventListener('click', () => {
				this.#currentView = 'session';
				this.#selectedCharacterName = null; // Clear character selection
				this.#currentSessionId = session.id; // Set the clicked session as current

				// Update URL - Remove character/view params, set session
				const currentUrl = new URL(window.location.href);
				const params = currentUrl.searchParams;
				params.set('session', session.id);
				params.delete('character');
				params.delete('view');
				params.set('campaign', this.#campaign.id); // Ensure campaign stays
				params.delete('map'); // Clean map param

				const state = {
					campaignId: this.#campaign.id,
					sessionId: session.id,
					characterName: null, // Ensure cleared
					viewType: null, // Ensure cleared
					view: 'story', // Main view type
				};
				// Use replaceState for intra-story navigation
				window.history.replaceState(state, '', `${currentUrl.pathname}?${params.toString()}`);

				// Re-render to show the new session
				this.render();
			});

			sessionList.appendChild(sessionItem);
		});

		sessionSection.appendChild(sessionList);
		sidebar.appendChild(sessionSection);
	}

	#createTimelineSection(sidebar) {
		const timelineSection = document.createElement('div');
		timelineSection.className = 'story-timeline-section';
		const sectionTitle = document.createElement('h2');
		sectionTitle.textContent = 'Campaign';
		timelineSection.appendChild(sectionTitle);

		const timelineButton = document.createElement('button');
		timelineButton.className = 'timeline-button';
		timelineButton.textContent = 'View Timeline';
		if (this.#currentView === 'timeline') {
			timelineButton.classList.add('active');
		}

		timelineButton.addEventListener('click', () => {
			this.#handleTimelineClick();
		});

		timelineSection.appendChild(timelineButton);
		sidebar.appendChild(timelineSection);
	}

	#handleTimelineClick() {
		// Don't do anything if already on timeline vieactw
		if (this.#currentView === 'timeline') return;

		this.#currentView = 'timeline';
		this.#selectedCharacterName = null; // Clear character selection

		// Update URL
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		params.set('campaign', this.#campaign.id); // Ensure campaign
		params.set('view', 'timeline'); // Set the view param
		params.delete('session'); // Remove other view params
		params.delete('character');
		params.delete('map');

		const state = {
			campaignId: this.#campaign.id,
			sessionId: null,
			characterName: null,
			viewType: 'timeline', // Specific view type
			view: 'story', // Main view type
		};
		// Use replaceState for intra-story navigation
		window.history.replaceState(state, '', `${currentUrl.pathname}?${params.toString()}`);

		// Re-render to show the timeline
		this.render();
	}

	#processTimelinePlaceholders(timelineContainer) {
		// Process all timeline items inside the container
		const timelineItems = timelineContainer.querySelectorAll('.timeline-item');

		timelineItems.forEach((item) => {
			// Get the content div inside each timeline item
			const contentElement = item.querySelector('.timeline-content');
			if (!contentElement) return;

			// Process the same elements as in the session content
			this.#processImages(contentElement);
			this.#processCharacterReferences(contentElement);
			this.#processEntityReferences(contentElement);

			// If this is a main timeline item, we might want to process progression tags
			if (item.classList.contains('timeline-main-item')) {
				const itemId = item.getAttribute('data-id');
				const timelineData = this.#campaign?.timeline;
				if (timelineData && Array.isArray(timelineData)) {
					const itemData = timelineData.find((data) => data.id === itemId);
					if (itemData) {
						this.#processProgressionTags(contentElement, itemData);
					}
				}
			}

			// Process character highlights after references have been created
			this.#processCharacterHighlights(contentElement);
		});
	}

	// #renderTimeline remains the same...
	#renderTimeline(contentArea) {
		// Check if the current campaign has timeline data
		const timelineData = this.#campaign?.timeline;
		if (!timelineData || !Array.isArray(timelineData) || timelineData.length === 0) {
			console.error('Timeline data not available for this campaign:', this.#campaign?.id);
			// Display an error message to the user
			const timelineContainer = document.createElement('div');
			timelineContainer.className = 'story-timeline-container visible';
			timelineContainer.innerHTML = `
				<div class="timeline-header">
					<h2>Campaign Timeline</h2>
				</div>
				<div class="no-content">
					Timeline data not available for this campaign.
				</div>
			`;

			contentArea.appendChild(timelineContainer);
			return;
		}

		// Create timeline container
		const timelineContainer = document.createElement('div');
		timelineContainer.className = 'story-timeline-container visible';

		// Create timeline header
		const header = document.createElement('div');
		header.className = 'timeline-header';
		header.innerHTML = `<h2>Campaign Timeline</h2>`;
		timelineContainer.appendChild(header);

		// Create timeline wrapper
		const timeline = document.createElement('div');
		timeline.className = 'timeline';
		// Track which side to place the next item
		let side = 'left';
		// Process timeline data
		timelineData.forEach((item) => {
			// Create main item
			const mainItem = document.createElement('div');
			mainItem.className = `timeline-item timeline-main-item ${side}`;
			mainItem.setAttribute('data-id', item.id);

			const mainContent = document.createElement('a');
			mainContent.className = 'timeline-content';
			mainContent.innerHTML = `
				<h3>${item.title}</h3>
				<div class="timeline-location">${item.location}</div>
				${item.session ? `<span class="timeline-item-session">Session ${item.session}</span>` : ''}
			`;

			if (item.url) {
				const params = `?campaign=${item.url.campaign}&session=${item.url.session}${
					item.url.target ? `#${item.url.target}` : ''
				}`;
				mainContent.href = params;
				mainContent.title = 'Go to this session recap point.';
			}

			mainItem.appendChild(mainContent);
			timeline.appendChild(mainItem);

			// Flip side for the next main item group
			const nextSide = side === 'left' ? 'right' : 'left';

			const typeMap = {
				narrative: '💬',
				encounter: '⚔️',
				investigation: '🔎',
				traversal: '👣',
			};

			// Add subitems if any, keeping them on the same side
			if (item.items && item.items.length > 0) {
				item.items.forEach((subitem) => {
					const subitemEl = document.createElement('div');
					subitemEl.className = `timeline-item timeline-subitem ${side}`;
					subitemEl.setAttribute('data-parent-id', item.id);
					subitemEl.setAttribute('data-type', subitem.type);

					const subContent = document.createElement('a');
					subContent.className = 'timeline-content';

					let subitemHTML = `
						<h4><span style="font-size: 8pt">${typeMap[subitem.type]}</span> ${
						subitem.type.charAt(0).toUpperCase() + subitem.type.slice(1)
					}: ${subitem.actors}</h4>
					`;

					if (subitem.is_new_session) {
						subitemEl.classList.add('new-session-indicator');
						subitemHTML += `<div class="timeline-new-session">New session</div>`;
					}

					// Add sublocation if any
					if (subitem.sublocation) {
						subitemHTML += `<div class="timeline-sublocation">${subitem.sublocation}</div>`;
					}

					if (subitem.url) {
						const params = `?campaign=${subitem.url.campaign}&session=${subitem.url.session}${
							subitem.url.target ? `#${subitem.url.target}` : ''
						}`;
						subContent.href = params;
						subContent.title = 'Go to this session recap point.';
					}

					subContent.innerHTML = subitemHTML;
					subitemEl.appendChild(subContent);
					timeline.appendChild(subitemEl);
				});
			}

			// Switch sides for next main item group
			side = nextSide;
		});

		timelineContainer.appendChild(timeline);
		contentArea.appendChild(timelineContainer);
		this.#processTimelinePlaceholders(timelineContainer);
	}

	async #loadContentArea(contentArea) {
		// Clear previous content
		contentArea.innerHTML = '';

		switch (this.#currentView) {
			case 'timeline':
				this.#renderTimeline(contentArea);
				break;
			case 'character':
				this.#loadCharacterBackground(contentArea);
				break;
			case 'session':
			default:
				await this.#loadSessionContent(contentArea); // Needs await
				break;
		}
	}

	async #loadSessionContent(contentArea) {
		// Assume contentArea is already cleared by #loadContentArea
		// If timeline is visible, render it (Handled by #loadContentArea)
		// if (this.#isTimelineVisible) { ... }
		// If a character is selected, show their background (Handled by #loadContentArea)
		// if (this.#selectedCharacterName) { ... }

		if (!this.#currentSessionId || !this.#campaign.recaps) {
			contentArea.innerHTML = '<div class="no-content">Select a session to view its content.</div>';
			return;
		}

		const session = this.#campaign.recaps.find((s) => s.id === this.#currentSessionId);
		if (!session) {
			console.error(`Session not found: ${this.#currentSessionId}`);
			contentArea.innerHTML = '<div class="no-content">Session not found. Please select another session.</div>';
			return;
		}

		// Helper function to fetch and parse Markdown (remains the same)
		const fetchAndParseMd = async (filePath) => {
			if (!filePath || typeof filePath !== 'string' || !filePath.endsWith('.md')) {
				return filePath || ''; // Return non-MD paths/content directly
			}
			const basePath = `src/databases/campaign_data/${this.#campaign.id.replace('-', '_')}/`;
			const fullPath = basePath + filePath;
			try {
				const response = await fetch(fullPath);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const mdContent = await response.text();
				return `${mdContent}`; // Fallback: display as preformatted text
			} catch (error) {
				console.error(`Error fetching or parsing Markdown file "${fullPath}":`, error);
				return `<div class="error">Error loading content: ${error.message}</div>`;
			}
		};

		// Create session TOC container (will be populated by #generateTableOfContents)
		const sessionToc = document.createElement('div');
		sessionToc.className = 'session-toc';
		const toc = document.createElement('div');
		toc.className = 'toc';
		toc.id = 'toc'; // Keep the ID for potential styling/JS hooks
		sessionToc.appendChild(toc);
		contentArea.appendChild(sessionToc); // Add TOC container to content area

		// Create session content container
		const sessionContent = document.createElement('div');
		sessionContent.className = 'session-content';
		// Add session header
		const sessionHeader = document.createElement('div');
		sessionHeader.className = 'session-header';
		sessionHeader.innerHTML = `
            <h2 id="session-title">${session.title}</h2>
            ${session.date ? `<div class="session-date">${session.date}</div>` : ''}
        `;
		sessionContent.appendChild(sessionHeader);

		// Process Short Summary (Recap)
		const sessionRecap = document.createElement('div');
		sessionRecap.className = 'session-small-recap';
		const tempRecap = document.createElement('div');
		tempRecap.innerHTML = `<h3 id="short-summary">Short Summary</h3>${await fetchAndParseMd(session?.recap)}`;
		this.#processPlaceholders(tempRecap, session);
		sessionRecap.appendChild(tempRecap);
		sessionContent.appendChild(sessionRecap);

		// Process Main Content
		const mainContentEl = document.createElement('div');
		mainContentEl.className = 'session-main-content';
		const tempMain = document.createElement('div');
		tempMain.innerHTML = `<h2 id="session-recap">Session Recap</h2>${await fetchAndParseMd(session.content)}`;
		this.#processPlaceholders(tempMain, session);
		mainContentEl.appendChild(tempMain);
		sessionContent.appendChild(mainContentEl);

		// Add session content to content area
		contentArea.appendChild(sessionContent);
	}

	#processPlaceholders(contentElement, session = null) {
		this.#processImages(contentElement);
		this.#processCharacterReferences(contentElement);
		this.#processEntityReferences(contentElement);
		// Process progression tags only if session data is available
		if (session) {
			this.#processProgressionTags(contentElement, session);
		}
		// Needs to run *after* character/entity references have created the spans
		this.#processCharacterHighlights(contentElement);
	}

	#scrollToHash() {
		const hash = window.location.hash;
		if (hash) {
			try {
				// Use substring(1) to remove the '#'
				const element = document.getElementById(hash.substring(1));
				if (element) {
					// Use setTimeout to ensure rendering is complete, especially after async ops
					setTimeout(() => {
						element.scrollIntoView({
							behavior: 'smooth',
							block: 'start', // Align to top
						});
					}, 100); // Small delay might be needed
				}
			} catch (e) {
				// Catch potential errors if ID is invalid for querySelector
				console.warn(`Could not find or scroll to element with ID: ${hash}`, e);
			}
		}
	}

	#generateTableOfContents(contentArea) {
		// Find headings only within the main session content, not the TOC itself
		const sessionContent = contentArea.querySelector('.session-content');
		if (!sessionContent) return; // No session content rendered

		const headings = sessionContent.querySelectorAll('h1, h2, h3, h4'); // Include h4 if needed
		if (headings.length === 0) return;

		// Get the TOC container (already created in #loadSessionContent)
		const tocContainer = contentArea.querySelector('.toc');
		if (!tocContainer) return;
		tocContainer.innerHTML = ''; // Clear previous TOC content

		// Create TOC title
		const tocTitle = document.createElement('h3');
		tocTitle.textContent = 'On this page'; // More common TOC title
		tocTitle.className = 'toc-title';
		tocContainer.appendChild(tocTitle);
		// Create the list
		const tocList = document.createElement('ul');
		tocList.className = 'toc-list';
		tocContainer.appendChild(tocList);
		// Process headings and add to TOC
		headings.forEach((heading, index) => {
			// Ensure heading has an ID for linking
			if (!heading.id) {
				// Create a simple slug from text content
				const slug = heading.textContent
					.toLowerCase()
					.trim()
					.replace(/\s+/g, '-') // Replace spaces with dashes
					.replace(/[^\w-]+/g, ''); // Remove non-word characters except dashes
				heading.id = slug || `heading-${index}`; // Fallback to index if slug is empty
			}

			// Create link items for TOC
			const item = document.createElement('li');
			item.className = `toc-item toc-level-${heading.tagName.toLowerCase()}`; // e.g., toc-level-h2

			const link = document.createElement('a');
			link.href = `#${heading.id}`; // Link to the heading ID
			link.textContent = heading.textContent;
			link.className = 'toc-link';

			// Add smooth scroll event AND update URL hash without reloading
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetElement = document.getElementById(heading.id);
				if (targetElement) {
					targetElement.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
					// Update URL hash without triggering navigation or adding to history stack
					history.replaceState(null, '', `#${heading.id}`);
				}
			});

			item.appendChild(link);
			tocList.appendChild(item);
		});
	}

	#loadCharacterBackground(contentArea) {
		// Assume contentArea is cleared by #loadContentArea
		if (!this.#selectedCharacterName) {
			contentArea.innerHTML = '<div class="no-content">No character selected.</div>';
			return;
		}

		if (!this.#campaign.metadata?.characters) {
			contentArea.innerHTML = '<div class="no-content">Character information not available for this campaign.</div>';
			return;
		}

		const character = this.#campaign.metadata.characters.find((c) => c.name === this.#selectedCharacterName);
		if (!character) {
			console.error(`Character not found: ${this.#selectedCharacterName}`);
			contentArea.innerHTML = '<div class="no-content">Character details not found.</div>';
			return;
		}

		// --- Character Page rendering logic ---
		// This part remains largely the same as your provided code
		// It builds the character sheet HTML.
		// Ensure #processEntityReferences is called on relevant parts (like background).

		const addSeparator = (elm) => {
			const separator = document.createElement('div');
			separator.className = 'character-page__separator';
			elm.append(separator);
		};

		const characterPage = document.createElement('div');
		characterPage.className = 'character-page';

		const characterPagePartOne = document.createElement('div');
		characterPagePartOne.className = 'character-side-one';
		const characterPagePartTwo = document.createElement('div');
		characterPagePartTwo.className = 'character-side-two';

		if (character?.imageBg) {
			const img = document.createElement('img');
			img.src = character?.imageBg;
			img.alt = `${character?.name} - ${character?.race} - ${character?.class}`;
			img.className = 'character-page__image';
			characterPagePartOne.appendChild(img);
		}

		if (character?.background) {
			const itemHeader = document.createElement('span');
			itemHeader.className = 'character-page__header';
			itemHeader.textContent = 'Background';

			const characterBg = document.createElement('div');
			characterBg.className = 'character-page__background';

			characterBg.innerHTML = character?.background; // Assuming background is HTML or plain text
			this.#processEntityReferences(characterBg);
			characterPagePartOne.appendChild(itemHeader);
			characterPagePartOne.appendChild(characterBg);
		}

		if (character?.stats?.metadata) {
			const metadataHolder = document.createElement('div');
			metadataHolder.className = 'character-page__metadata';

			if (character?.name) {
				const charIdentifiers = document.createElement('div');
				charIdentifiers.className = 'character-page__identifiers';
				charIdentifiers.innerHTML = `<span class="character-page__name">${character?.name}</span>
					<span class="character-page__identifier">Lvl ${character?.level} ${character?.race} ${character?.class}</span>`;
				metadataHolder.append(charIdentifiers);
			}

			addSeparator(metadataHolder);

			const characterHealth = document.createElement('div');
			characterHealth.className = 'character-page__hp';
			characterHealth.innerHTML = `
				<div class="character-page__hp-item">
					<span class="character-page__hp-item-name">Armor Class</span>
					<span class="character-page__hp-item-value">${character?.stats?.metadata?.armorClass || '-'}</span>
				</div>
				<div class="character-page__hp-item">
					<span class="character-page__hp-item-name">Hit Points</span>
					<span class="character-page__hp-item-value">${character?.stats?.metadata?.healthPoints || '-'}</span>
				</div>
				<div class="character-page__hp-item">
					<span class="character-page__hp-item-name">Speed</span>
					<span class="character-page__hp-item-value">${character?.stats?.metadata?.walkingSpeed || '-'}</span>
				</div>
				`;
			metadataHolder.append(characterHealth);

			// Ability Scores
			if (character?.stats?.metadata?.abilityScores?.length) {
				const abilityScoresHeader = document.createElement('span');
				abilityScoresHeader.className = 'character-page__header';
				abilityScoresHeader.textContent = 'Ability Scores';
				metadataHolder.appendChild(abilityScoresHeader);

				const abilityScoresContainer = document.createElement('div');
				abilityScoresContainer.className = 'character-page__ability-scores';
				character.stats.metadata.abilityScores.forEach((ability) => {
					const abilityBox = document.createElement('div');
					abilityBox.className = 'character-page__ability-box';
					abilityBox.innerHTML = `
					<span class="character-page__ability-name">${ability.abbr.toUpperCase()}</span>
					<div class="character-page__ability-values">
						<span class="character-page__ability-value">${ability.value}</span>
						<span class="character-page__ability-score">(${ability.score >= 0 ? '+' : ''}${ability.score})</span>
					</div>
				`; // Added sign for score
					abilityScoresContainer.appendChild(abilityBox);
				});
				metadataHolder.appendChild(abilityScoresContainer);
			}

			// Saving Throws
			if (character?.stats?.metadata?.savingThrows?.length) {
				const savingThrowsHeader = document.createElement('span');
				savingThrowsHeader.className = 'character-page__header';
				savingThrowsHeader.textContent = 'Saving Throws';
				metadataHolder.appendChild(savingThrowsHeader);

				const savingThrowsContainer = document.createElement('div');
				savingThrowsContainer.className = 'character-page__saving-throws';
				character.stats.metadata.savingThrows.forEach((save) => {
					const saveItem = document.createElement('div');
					saveItem.className = 'character-page__save-item';
					saveItem.innerHTML = `
					<span class="character-page__save-name">${save.name.toUpperCase()}</span>
					<span class="character-page__save-value">${save.value >= 0 ? '+' : ''}${save.value}</span>
				`; // Added sign
					savingThrowsContainer.appendChild(saveItem);
				});
				metadataHolder.appendChild(savingThrowsContainer);
			}

			// --- Description Manager (for Actions/Features) ---
			// This logic can remain the same as in your original code
			const descriptionManager = {
				openDescriptions: [],
				closeAll: function () {
					this.openDescriptions.forEach((descEl) => {
						descEl.classList.add('description-hidden');
					});
					this.openDescriptions = [];
				},
				open: function (descEl) {
					this.closeAll();
					descEl.classList.remove('description-hidden');
					this.openDescriptions.push(descEl);
					this.adjustPosition(descEl);
				},
				adjustPosition: function (descEl) {
					// Reset any previous positioning
					descEl.style.left = '0';

					// Wait for the element to be visible to get its dimensions
					setTimeout(() => {
						const rect = descEl.getBoundingClientRect();
						const parentRect = descEl.parentElement.getBoundingClientRect();

						// Check if the description is going off the right edge of the viewport
						if (rect.right > window.innerWidth) {
							descEl.style.left = 'auto';
							descEl.style.right = '0';
							descEl.style.transform = 'none';
						}
						// Check if the description is going off the left edge of the viewport
						else if (rect.left < 0) {
							descEl.style.left = '0';
							descEl.style.transform = 'none';
						}
					}, 0);
				},
			};

			// Actions
			if (character?.stats?.metadata?.actionData?.length) {
				const actionsHeader = document.createElement('span');
				actionsHeader.className = 'character-page__header';
				actionsHeader.textContent = 'Actions';
				metadataHolder.appendChild(actionsHeader);

				const actionsContainer = document.createElement('div');
				actionsContainer.className = 'character-page__actions';
				character.stats.metadata.actionData.forEach((action) => {
					const actionItem = document.createElement('div');
					actionItem.className = 'character-page__action-item';

					const nameSpan = document.createElement('span');
					nameSpan.className = 'character-page__action-item-name';
					nameSpan.textContent = action.name;
					actionItem.appendChild(nameSpan);

					if (action.description) {
						const descSpan = document.createElement('span');
						descSpan.className = 'character-page__action-item-description description-hidden';
						descSpan.innerHTML = action.description; // Use innerHTML if description contains HTML
						this.#processEntityReferences(descSpan); // Process entities in description
						actionItem.appendChild(descSpan);
						actionItem.classList.add('has-description');

						const toggleDescription = (e) => {
							e.stopPropagation();
							if (descSpan.classList.contains('description-hidden')) {
								descriptionManager.open(descSpan);
							} else {
								descriptionManager.closeAll();
							}
						};
						actionItem.addEventListener('click', toggleDescription);
					}
					actionsContainer.appendChild(actionItem);
				});
				metadataHolder.appendChild(actionsContainer);
			}

			// Features
			if (character?.stats?.metadata?.features?.length) {
				const featuresHeader = document.createElement('span');
				featuresHeader.className = 'character-page__header';
				featuresHeader.textContent = 'Features';
				metadataHolder.appendChild(featuresHeader);

				const featuresContainer = document.createElement('div');
				featuresContainer.className = 'character-page__features';
				character.stats.metadata.features.forEach((feature) => {
					const featureItem = document.createElement('div');
					featureItem.className = 'character-page__feature-item';

					const nameSpan = document.createElement('span');
					nameSpan.className = 'character-page__feature-item-name';
					nameSpan.textContent = feature.name;
					featureItem.appendChild(nameSpan);

					if (feature.description) {
						const descSpan = document.createElement('span');
						descSpan.className = 'character-page__feature-item-description description-hidden';
						descSpan.innerHTML = feature.description; // Use innerHTML
						this.#processEntityReferences(descSpan); // Process entities
						featureItem.appendChild(descSpan);
						featureItem.classList.add('has-description');

						const toggleDescription = (e) => {
							e.stopPropagation();
							if (descSpan.classList.contains('description-hidden')) {
								descriptionManager.open(descSpan);
							} else {
								descriptionManager.closeAll();
							}
						};
						featureItem.addEventListener('click', toggleDescription);
					}
					featuresContainer.appendChild(featureItem);
				});
				metadataHolder.appendChild(featuresContainer);
			}

			// Global click handler to close descriptions
			document.addEventListener('click', () => descriptionManager.closeAll(), true); // Use capture phase

			// Spells (remains largely the same, ensure #processEntityReferences runs on spell name)
			if (character?.stats?.metadata?.spellData?.length) {
				const spellsHeader = document.createElement('span');
				spellsHeader.className = 'character-page__header';
				spellsHeader.textContent = 'Spells';
				metadataHolder.appendChild(spellsHeader);

				const spellsContainer = document.createElement('div');
				spellsContainer.className = 'character-page__spells';
				character.stats.metadata.spellData.forEach((spellGroup) => {
					// ... (spell group header logic) ... [cite: 161]
					const groupHeader = document.createElement('div'); // Added
					groupHeader.className = 'character-page__spell-group-header'; // Added
					groupHeader.textContent = spellGroup.groupName; // Added
					spellsContainer.appendChild(groupHeader); // Added

					spellGroup.spells.forEach((spell) => {
						const spellItem = document.createElement('div');
						spellItem.className = 'character-page__spell-item';

						const spellName = document.createElement('div');
						spellName.className = 'character-page__spell-name';

						spellName.innerHTML = `[ENTITY:spell:${spell.spellInfo.spellName}]`;
						this.#processEntityReferences(spellName); // Process the entity reference

						const spellMeta = document.createElement('div');
						spellMeta.className = 'character-page__spell-meta';
						// ... (range, slot, effect info) ...
						const rangeInfo = document.createElement('span'); // Added
						rangeInfo.className = 'character-page__spell-range'; // Added
						rangeInfo.textContent = `Range: ${spell.range}`; // Added
						spellMeta.appendChild(rangeInfo); // Added

						const slotInfo = document.createElement('span'); // Added
						slotInfo.className = 'character-page__spell-slot'; // Added
						slotInfo.textContent = `Slot: ${spell.slotType}`; // Added
						spellMeta.appendChild(slotInfo); // Added

						const effectInfo = document.createElement('span'); // Added
						effectInfo.className = 'character-page__spell-effect'; // Added
						effectInfo.textContent = `Effect: ${spell.effect}`; // Added
						spellMeta.appendChild(effectInfo); // Added

						if (spell.spellInfo.spellMetaInfo) {
							const spellNote = document.createElement('div');
							spellNote.className = 'character-page__spell-note';
							spellNote.textContent = spell.spellInfo.spellMetaInfo;
							spellMeta.appendChild(spellNote);
						}

						spellItem.appendChild(spellName);
						spellItem.appendChild(spellMeta);
						spellsContainer.appendChild(spellItem);
					});
				});
				metadataHolder.appendChild(spellsContainer);
			}

			characterPagePartTwo.append(metadataHolder);
		} // End of if (character?.stats?.metadata)

		// Assemble character page parts
		characterPage.append(characterPagePartTwo); // Metadata side
		characterPage.append(characterPagePartOne); // Image/Background side
		contentArea.append(characterPage); // Add to the main content area
	}

	// --- Placeholder Processing Methods ---

	#processImages(contentElement) {
		// Find all image placeholders
		// Format: [IMAGE:path/to/image.jpg:optional-caption:optional-width:optional-alignment:optional-inline]
		const text = contentElement.innerHTML;
		const processedText = text.replace(
			/\[IMAGE:(.*?)(?::(.*?))?(?::(.*?))?(?::(.*?))?(?::(.*?))?\]/g,
			(match, src, caption = '', width = '', alignment = 'center', inline = 'false') => {
				const widthAttr = width ? `width="${width}"` : '';
				const alignClass = `image-align-${alignment}`;
				const inlineClass = inline === 'true' ? 'image-inline' : '';

				return `
					<div class="story-image-container ${alignClass} ${inlineClass}">
						<img src="${src}" ${widthAttr} alt="${caption}" />
						${caption ? `<div class="image-caption">${caption}</div>` : ''}
					</div>
				`;
			}
		);

		contentElement.innerHTML = processedText;
	}

	#processCharacterReferences(contentElement) {
		if (!this.#campaign.metadata?.characters?.length) return;

		// Get character names for regex pattern
		const characterNames = this.#campaign.metadata.characters
			.map((char) => char.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
			.join('|');

		// Skip if no characters
		if (!characterNames) return;

		// Create regex to find character names in text
		const characterRegex = new RegExp(`\\[CHARACTER:(${characterNames})\\]`, 'g');

		// Find all text nodes in the content
		const textNodes = [];
		const walker = document.createTreeWalker(contentElement, NodeFilter.SHOW_TEXT, null, false);

		let node;
		while ((node = walker.nextNode())) {
			textNodes.push(node);
		}

		// Process each text node
		textNodes.forEach((textNode) => {
			const text = textNode.nodeValue;
			if (characterRegex.test(text)) {
				const fragment = document.createDocumentFragment();
				let lastIndex = 0;
				let match;

				// Reset regex
				characterRegex.lastIndex = 0;

				while ((match = characterRegex.exec(text)) !== null) {
					// Add text before the match
					if (match.index > lastIndex) {
						fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
					}

					// Create highlighted span for character
					const span = document.createElement('span');
					span.className = 'character-highlight';
					span.setAttribute('data-character', match[1]);
					span.textContent = match[1];
					fragment.appendChild(span);

					lastIndex = characterRegex.lastIndex;
				}

				// Add remaining text
				if (lastIndex < text.length) {
					fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
				}

				// Replace the text node with the fragment
				textNode.parentNode.replaceChild(fragment, textNode);
			}
		});
	}

	#processCharacterHighlights(contentElement) {
		// Attaches tooltips to spans with 'character-highlight' class
		if (!this.#campaign.metadata?.characters?.length) return;

		const characterMap = new Map();
		this.#campaign.metadata.characters.forEach((char) => {
			characterMap.set(char.name, char);
		});

		const spans = contentElement.querySelectorAll('span.character-highlight'); // Target the spans created by #processCharacterReferences
		spans.forEach((span) => {
			const characterName = span.getAttribute('data-character');
			if (characterMap.has(characterName)) {
				// Ensure text content matches (might be redundant if #processCharacterReferences works)
				span.textContent = characterName;
				// Add tooltip events
				this.#addCharacterTooltipEvents(span, characterMap.get(characterName));
			} else {
				// Optional: Remove attribute or class if character data is missing
				// span.removeAttribute('data-character');
				// span.classList.remove('character-highlight');
			}
		});
	}

	#processEntityReferences(contentElement) {
		// Finds [ENTITY:type:name] and replaces with spans for tooltips
		// This should run *before* tooltip attachment logic if separated
		const text = contentElement.innerHTML;
		const processedText = text.replace(/\[ENTITY:([\w-]+):(.*?)\]/gi, (match, type, name) => {
			// More specific type regex
			const cleanType = type.toLowerCase().trim();
			const cleanName = name.trim();
			// Basic validation
			if (!cleanType || !cleanName) return match; // Return original if malformed
			return `<span class="entity-reference entity-${cleanType}" data-entity-type="${cleanType}" data-entity-name="${cleanName}">${cleanName}</span>`;
		});
		contentElement.innerHTML = processedText;

		// Attach event listeners
		const entitySpans = contentElement.querySelectorAll('.entity-reference');
		entitySpans.forEach((span) => {
			const entityType = span.getAttribute('data-entity-type');
			const entityName = span.getAttribute('data-entity-name');
			if (entityType && entityName) {
				this.#addEntityTooltipEvents(span, entityType, entityName);
			}
		});
	}

	#processProgressionTags(contentElement, session) {
		// Finds [PROGRESSION:type:value] - remains the same
		const progressionRegex = /\[PROGRESSION:(levelup|loot):(.*?)\]/g;
		const walker = document.createTreeWalker(contentElement, NodeFilter.SHOW_TEXT, null, false);
		const textNodes = [];
		while (walker.nextNode()) textNodes.push(walker.currentNode);

		textNodes.forEach((node) => {
			const text = node.nodeValue;
			if (!progressionRegex.test(text)) return;

			const fragment = document.createDocumentFragment();
			let lastIndex = 0;
			let match;
			progressionRegex.lastIndex = 0;

			while ((match = progressionRegex.exec(text)) !== null) {
				if (match.index > lastIndex) {
					fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
				}
				const type = match[1];
				const value = match[2];
				let replacementNode = null;
				if (type === 'levelup') {
					replacementNode = this.#generateLevelUpElement(value);
				} else if (type === 'loot') {
					replacementNode = this.#generateLootElement(value, session);
				}
				if (replacementNode) fragment.appendChild(replacementNode);
				lastIndex = progressionRegex.lastIndex;
			}
			if (lastIndex < text.length) {
				fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
			}
			node.parentNode.replaceChild(fragment, node);
		});
	}

	#generateLevelUpElement(level) {
		/* ... remains the same ... */ //
		const levelUpDiv = document.createElement('div');
		levelUpDiv.className = 'progression-levelup';
		levelUpDiv.innerHTML = `
            <div class="levelup-icon">✨</div>
            <div class="levelup-text">
                <h2>Level Up!</h2>
                <p>Congratulations!
The party has reached level <strong>${level}</strong>!</p>
            </div>
        `;
		return levelUpDiv;
	}
	#generateLootElement(lootId, session) {
		/* ... remains the same ... */ //
		const lootContainer = document.createElement('div');
		lootContainer.className = 'progression-loot';

		const lootData = session?.progression?.loot?.find((l) => l.id === lootId);
		if (!lootData || !lootData.data || lootData.data.length === 0) {
			lootContainer.innerHTML = '<p><em>Loot information not found.</em></p>';
			return lootContainer;
		}

		const title = document.createElement('h4');
		title.textContent = `Loot Found (${lootId})`;
		lootContainer.appendChild(title);

		const list = document.createElement('ul');
		list.className = 'loot-list';
		lootData.data.forEach((item) => {
			const listItem = document.createElement('li');
			listItem.className = `loot-item rarity-${item.rarity || 'common'}`;

			let ownerText = item.owner ? ` <span class="loot-owner">(${item.owner})</span>` : '';
			// Process item name for entities
			const itemNameSpan = document.createElement('span');
			itemNameSpan.className = 'loot-item-name';
			itemNameSpan.innerHTML = item.itemName; // Assume item name might contain entity refs
			this.#processEntityReferences(itemNameSpan);

			listItem.innerHTML = `
                ${itemNameSpan.outerHTML} ${item.count > 1 ? `(x${item.count})` : ''}
                ${ownerText}
                ${item.description ? `<div class="loot-item-description">${item.description}</div>` : ''}
            `;
			// Process description for entities if it exists
			if (item.description) {
				const descDiv = listItem.querySelector('.loot-item-description');
				if (descDiv) this.#processEntityReferences(descDiv);
			}

			list.appendChild(listItem);
		});
		lootContainer.appendChild(list);
		return lootContainer;
	}

	// --- Tooltip Methods ---

	#createTooltipContainer() {
		/* ... remains the same ... */
		this.#tooltipContainer = document.getElementById('character-tooltip-container');
		if (!this.#tooltipContainer) {
			this.#tooltipContainer = document.createElement('div');
			this.#tooltipContainer.id = 'character-tooltip-container';
			this.#tooltipContainer.className = 'character-tooltip-container'; // Use a more generic name maybe? 'dynamic-tooltip-container'
			this.#tooltipContainer.style.position = 'absolute'; // Ensure positioning works
			this.#tooltipContainer.style.zIndex = '1000'; // Keep on top
			this.#tooltipContainer.style.display = 'none';
			document.body.appendChild(this.#tooltipContainer);
		}
	}

	#addCharacterTooltipEvents(element, character) {
		/* ... remains the same ... */ //
		element.addEventListener('mouseover', (e) => {
			// Prevent triggering parent tooltips if nested
			e.stopPropagation();
			this.#tooltipContainer.innerHTML = `
                <div class="character-tooltip">
                    <div class="tooltip-header">
                        <img src="${character.icon}" alt="${character.name}" />
                        <h3>${character.name}</h3>

                   </div>
                    <div class="tooltip-content">
                        <div><strong>Race:</strong> ${character.race}</div>
                        <div><strong>Class:</strong> ${character.class}</div>

              <div><strong>Level:</strong> ${character.level}</div>
                        ${
													character.shortDescription
														? `<div class="tooltip-description tooltip-background">${character.shortDescription}</div>`
														: ''
												}
                    </div>
                </div>
            `;
			this.#positionTooltip(element); // Position and show
		});

		element.addEventListener('mouseout', () => {
			this.#tooltipContainer.style.display = 'none';
		});
	}

	#addEntityTooltipEvents(element, entityType, entityName) {
		element.classList.add('entity-' + entityType);

		element.addEventListener('mouseover', async (e) => {
			// Show loading state
			this.#tooltipContainer.innerHTML = `
				<div class="entity-tooltip">
				<div class="tooltip-header">
					<h3>${entityName}</h3>
				</div>
				<div class="tooltip-content">
					<div>Loading ${entityType} information...</div>
				</div>
				</div>
			`;

			// Position and show the tooltip
			this.#tooltipContainer.style.display = 'block';
			this.#positionTooltip(element);

			// Fetch entity data
			try {
				const entityData = await this.#fetchEntityData(entityType, entityName);

				// Update tooltip with fetched data
				if (entityData) {
					this.#tooltipContainer.innerHTML = this.#generateEntityTooltipContent(entityType, entityData);
					// Reposition in case content size changed
					this.#positionTooltip(element);
				} else {
					this.#tooltipContainer.innerHTML = `
						<div class="entity-tooltip">
						<div class="tooltip-header">
							<h3>${entityName}</h3>
						</div>
						<div class="tooltip-content">
							<div>No information found for this ${entityType}.</div>
						</div>
						</div>
					`;
				}
			} catch (error) {
				this.#tooltipContainer.innerHTML = `
					<div class="entity-tooltip">
						<div class="tooltip-header">
						<h3>${entityName}</h3>
						</div>
						<div class="tooltip-content">
						<div>Error loading information: ${error.message}</div>
						</div>
					</div>
					`;
				console.error(`Error fetching entity data:`, error);
			}
		});

		element.addEventListener('mouseout', () => {
			this.#tooltipContainer.style.display = 'none';
		});
	}

	#positionTooltip(element) {
		/* ... remains the same ... */ //
		// Make tooltip visible to calculate dimensions, but keep off-screen initially
		this.#tooltipContainer.style.visibility = 'hidden';
		this.#tooltipContainer.style.display = 'block';
		this.#tooltipContainer.style.top = '-9999px';
		this.#tooltipContainer.style.left = '-9999px';

		const elementRect = element.getBoundingClientRect();
		const tooltipRect = this.#tooltipContainer.getBoundingClientRect();
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
			scrollX: window.scrollX,
			scrollY: window.scrollY,
		};
		// Calculate available space
		const space = {
			above: elementRect.top, // Distance from top of element to top of viewport
			below: viewport.height - elementRect.bottom, // Distance from bottom of element to bottom of viewport
			left: elementRect.left, // Distance from left of element to left of viewport
			right: viewport.width - elementRect.right, // Distance from right of element to right of viewport
		};

		// Default position: below, aligned left
		let position = 'below';
		let horizontalAlign = 'left'; // 'left', 'right', 'center' (for element)
		let verticalAlign = 'top'; // 'top', 'bottom', 'center' (for element)

		// Determine best vertical position
		if (space.below >= tooltipRect.height) {
			position = 'below';
		} else if (space.above >= tooltipRect.height) {
			position = 'above';
		} else if (space.right >= tooltipRect.width) {
			// Try side if below/above don't fit
			position = 'right';
		} else if (space.left >= tooltipRect.width) {
			position = 'left';
		} // else: stick with 'below' and let overflow logic handle it

		// Determine horizontal alignment for above/below
		if (position === 'below' || position === 'above') {
			if (elementRect.left + tooltipRect.width > viewport.width - 10) {
				// Check overflow right (10px buffer)
				horizontalAlign = 'right'; // Align tooltip right edge with element right edge
			} else {
				horizontalAlign = 'left'; // Align tooltip left edge with element left edge
			}
		}
		// Determine vertical alignment for left/right
		if (position === 'left' || position === 'right') {
			if (elementRect.top + tooltipRect.height > viewport.height - 10) {
				verticalAlign = 'bottom'; // Align tooltip bottom with element bottom
			} else {
				verticalAlign = 'top'; // Align tooltip top with element top
			}
		}

		// Calculate position coordinates based on elementRect and viewport scroll offset
		let coords = { top: 0, left: 0 };
		const buffer = 8; // Small gap between element and tooltip

		switch (position) {
			case 'below':
				coords.top = elementRect.bottom + viewport.scrollY + buffer;
				coords.left =
					horizontalAlign === 'left'
						? elementRect.left + viewport.scrollX
						: elementRect.right + viewport.scrollX - tooltipRect.width;
				break;
			case 'above':
				coords.top = elementRect.top + viewport.scrollY - tooltipRect.height - buffer;
				coords.left =
					horizontalAlign === 'left'
						? elementRect.left + viewport.scrollX
						: elementRect.right + viewport.scrollX - tooltipRect.width;
				break;
			case 'right':
				coords.top =
					verticalAlign === 'top'
						? elementRect.top + viewport.scrollY
						: elementRect.bottom + viewport.scrollY - tooltipRect.height;
				coords.left = elementRect.right + viewport.scrollX + buffer;
				break;
			case 'left':
				coords.top =
					verticalAlign === 'top'
						? elementRect.top + viewport.scrollY
						: elementRect.bottom + viewport.scrollY - tooltipRect.height;
				coords.left = elementRect.left + viewport.scrollX - tooltipRect.width - buffer;
				break;
		}

		// Ensure tooltip stays within viewport bounds (add 10px margin)
		coords.left = Math.max(
			viewport.scrollX + 10,
			Math.min(coords.left, viewport.scrollX + viewport.width - tooltipRect.width - 10)
		);
		coords.top = Math.max(
			viewport.scrollY + 10,
			Math.min(coords.top, viewport.scrollY + viewport.height - tooltipRect.height - 10)
		);

		// Apply final position and make visible
		this.#tooltipContainer.style.top = `${coords.top}px`;
		this.#tooltipContainer.style.left = `${coords.left}px`;
		this.#tooltipContainer.style.visibility = 'visible'; // Make visible now that it's positioned
	}

	async #fetchEntityData(entityType, entityName) {
		// First check our custom data for locations, guilds, etc
		if (this.#customApiData[entityType] && this.#customApiData[entityType][entityName]) {
			return this.#customApiData[entityType][entityName];
		}

		// For standard DND 5e API entities
		if (this.#supportedEntityTypes.includes(entityType)) {
			// Format the name for API (lowercase, dashes instead of spaces)
			const formattedName = entityName.toLowerCase().replace(/\s+/g, '-');

			try {
				// First, try direct access if we know the exact endpoint
				const response = await fetch(`${this.#apiBaseUrl}${this.#entityEndpoints[entityType]}/${formattedName}`);

				if (response.ok) {
					return await response.json();
				}

				// If direct access fails, try to search
				const searchResponse = await fetch(
					`${this.#apiBaseUrl}${this.#entityEndpoints[entityType]}?name=${encodeURIComponent(entityName)}`
				);

				if (searchResponse.ok) {
					const searchData = await searchResponse.json();

					// If we have results, fetch the first one
					if (searchData.results && searchData.results.length > 0) {
						const detailResponse = await fetch(`${this.#apiBaseUrl}${searchData.results[0].url}`);
						if (detailResponse.ok) {
							return await detailResponse.json();
						}
					}
				}

				// If all attempts fail, return null
				return null;
			} catch (error) {
				console.error(`Error fetching ${entityType} data for ${entityName}:`, error);
				throw error;
			}
		}

		// Return null for unsupported entity types
		return null;
	}

	#generateEntityTooltipContent(entityType, entityData) {
		let content = `
			<div class="entity-tooltip entity-${entityType}-tooltip">
				<div class="tooltip-header">
				${entityType === 'character' ? `<img src="${entityData.icon}" alt="${entityData.name}" />` : ''}
				<h3>${entityData.name || entityData.title || 'Unknown'}</h3>
				</div>
				<div class="tooltip-content">
			`;

		// Different formatting based on entity type
		switch (entityType) {
			case 'spell':
				content += `
					<div><strong>Level:</strong> ${entityData.level || 'Cantrip'}</div>
					<div><strong>School:</strong> ${entityData.school?.name || 'Unknown'}</div>
					<div><strong>Casting Time:</strong> ${entityData.casting_time || 'N/A'}</div>
					<div><strong>Range:</strong> ${entityData.range || 'N/A'}</div>
					<div><strong>Components:</strong> ${entityData.components?.join(', ') || 'None'}</div>
					<div><strong>Duration:</strong> ${entityData.duration || 'Instantaneous'}</div>
					<div class="tooltip-description tooltip-background">${
						entityData.desc?.join('<br>') || entityData.description || 'No description available.'
					}</div>
					`;
				break;

			case 'monster':
				content += `
					<div><strong>Type:</strong> ${entityData.type || 'Unknown'}</div>
					<div><strong>CR:</strong> ${entityData.challenge_rating || 'Unknown'}</div>
					<div><strong>AC:</strong> ${entityData.armor_class || 'Unknown'}</div>
					<div><strong>HP:</strong> ${entityData.hit_points || 'Unknown'}</div>
					<div class="tooltip-description tooltip-background">${
						entityData.desc || entityData.description || 'No description available.'
					}</div>
					`;
				break;

			case 'class':
				content += `
					  <div><strong>Hit Die:</strong> d${entityData.hit_die || '?'}</div>
					  <div><strong>Proficiencies:</strong> ${entityData.proficiencies?.map((p) => p.name).join(', ') || 'None'}</div>
					  <div><strong>Saves:</strong> ${entityData.saving_throws?.map((s) => s.name).join(', ') || 'None'}</div>
					  <div><strong>Spellcasting:</strong> ${entityData.spellcasting ? 'Yes' : 'No'}</div>
					  <div><strong>Subclasses:</strong> ${entityData.subclasses?.map((p) => p.name).join(', ') || 'None'}</div>
					`;
				break;

			case 'subclass':
				content += `
					  <div><strong>Subclass Of:</strong> ${entityData.class?.name || 'Unknown'}</div>
					  <div><strong>Features:</strong> ${entityData.subclass_flavor || 'No flavor text'}</div>
					  <div class="tooltip-description tooltip-background">${
							entityData.desc || entityData.description || 'No description available.'
						}</div>
					`;
				break;
			case 'location':
			case 'guild':
			case 'race':
				content += `
										${
											entityData?.metadata
												? Object.entries(entityData?.metadata)
														.map(
															([key, entry]) =>
																`<div class="tooltip-metadata"><span>${key}</span><span>${entry}</span></div>`
														)
														.join('')
												: ''
										}
				<div class="tooltip-description tooltip-background">${entityData.description || 'No description available.'}</div>
				`;
				break;
			case 'character':
				content += `
					<div><strong>Race:</strong> ${entityData.race || 'Unknown'}</div>
					<div><strong>Class:</strong> ${entityData.class || 'Unknown'}</div>
					<div><strong>Level:</strong> ${entityData.level || 'Unknown'}</div>
					${
						entityData?.stats?.abilityScores
							? '<div class="tooltip-scores-container tooltip-background">' +
							  Object.entries(entityData?.stats?.abilityScores)
									?.map(
										([key, entry]) =>
											`<div class="tooltip-ability"><span class="tooltip-ability-name">${key}</span><span class="tooltip-ability-value">${entry}</span></div>`
									)
									.join('') +
							  '</div>'
							: ''
					}
					<div class="tooltip-description tooltip-background">${entityData.shortDescription || 'No description available.'}</div>
					`;
				break;
			case 'npc':
				content += `
					<div><strong>Class: </strong>${entityData.class || 'Unknown'}</div>
					<div><strong>Affinity: </strong>${entityData.affinity || 'Unknown'}</div>
					<div><strong>Role: </strong>${entityData.role || 'Unknown'}</div>
				`;
			default:
				content += `
		  <div class="tooltip-description tooltip-background">${
				entityData.desc || entityData.description || JSON.stringify(entityData)
			}</div>
		`;
		}

		content += `
		</div>
	  </div>
	`;

		return content;
	}
}
