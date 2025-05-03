const CAMPAIGN_DATA = [
	{
		id: 'campaign-001',
		metadata: {
			name: "A quest, a questin' we shall go",
			description:
				'Six adventurers — a cleric, ranger, sorcerer, bard, and two barbarians — receive mysterious invitations to a strange, distant land. Teaming up with a band of pirates, they embark on an epic journey, battling fearsome monsters and navigating treacherous seas. Their quest takes an unexpected turn as they find themselves stranded on the enigmatic island of Korinis, where new challenges and hidden secrets await.',
			levelRange: '3-8',
			characters: [
				{
					name: 'Aenwyn',
					class: 'Sorcerer',
					race: 'Elf',
					level: 7,
					icon: 'images/assets/character_thumbnails/campaign_001/aenwyn.jpeg',
				},
				{
					name: 'Aethere',
					class: 'Bard',
					race: 'Half-Elf',
					level: 7,
					icon: 'images/assets/character_thumbnails/campaign_001/aethere.jpeg',
				},
				{
					name: 'Alezander',
					class: 'Barbarian',
					race: 'Half-Orc',
					level: 7,
					icon: 'images/assets/character_thumbnails/campaign_001/alezander.jpeg',
				},
				{
					name: 'Nora',
					class: 'Ranger',
					race: 'Half-Elf',
					level: 7,
					icon: 'images/assets/character_thumbnails/campaign_001/nora.png',
				},
				{
					name: 'Samantha',
					class: 'Cleric',
					race: 'Halfling',
					level: 7,
					icon: 'images/assets/character_thumbnails/campaign_001/samantha.jpeg',
				},
				{
					name: 'Smasherina',
					class: 'Barbarian',
					race: 'Halfling',
					level: 7,
					icon: 'images/assets/character_thumbnails/campaign_001/smasherina.jpg',
				},
			],
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
		id: 'campaign-002',
		metadata: {
			name: 'The Red Hand of Doom',
			description: `Five unlikely heroes—diverse in race and origin—journey together through a lush subtropical forest, their past encounters ranging from friendly to conflicting. Bound now by shared purpose or hidden motives, they travel in harmony, their story beginning not on a well-worn road, but along a wild path where camaraderie grows with each step.`,
			levelRange: '6-',
			characters: CAMPAIGN_02_CHARACTERS,
			charactersPosition: 'right',
			campaignType: 'story',
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
	#storyInstance = null; // Add this for story campaigns
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
		const campaignId = urlParams.get('campaign');
		const mapKey = urlParams.get('map');
		const sessionId = urlParams.get('session'); // Add param for story sessions

		if (campaignId && this.#isCampaignValid(campaignId)) {
			this.loadCampaign(campaignId, mapKey, sessionId);
		} else {
			// Try loading last used campaign
			const lastCampaign = localStorage.getItem(CampaignManager.STORAGE_KEY);
			if (lastCampaign && this.#isCampaignValid(lastCampaign)) {
				this.loadCampaign(lastCampaign);
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
				this.loadCampaign(event.state.campaignId, event.state.mapKey, event.state.sessionId);
			}
		});
	}

	#createViews() {
		// Create campaign selection view
		const selectionView = document.createElement('div');
		selectionView.id = 'campaign-selection';
		selectionView.className = 'view';
		selectionView.style.display = 'none';

		// Create header
		const header = document.createElement('header');
		header.innerHTML = `
            <h1>Select Your Campaign</h1>
            <p>Choose a campaign to begin your adventure</p>
        `;
		selectionView.appendChild(header);

		// Create campaign list
		const campaignList = document.createElement('div');
		campaignList.className = 'campaign-list';

		CAMPAIGN_DATA.forEach((campaign) => {
			const card = this.#createCampaignCard(campaign);
			campaignList.appendChild(card);
		});

		selectionView.appendChild(campaignList);
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

	#createCampaignCard(campaign) {
		const card = document.createElement('div');
		card.className = 'campaign-card';
		card.style.backgroundColor = campaign?.styling?.backgroundColor || '#2c3e50';

		// Add campaign type badge
		const campaignType = campaign.metadata?.campaignType || 'map';
		const typeBadge = `<div class="campaign-type-badge ${campaignType}">${
			campaignType.charAt(0).toUpperCase() + campaignType.slice(1)
		}</div>`;

		card.innerHTML = `
            ${typeBadge}
            <h2>${campaign.metadata?.name}</h2>
            <p>${campaign.metadata?.description}</p>
            ${!campaign?.data ? '<div class="campaign-status">Coming Soon</div>' : ''}
            <div class="campaign-info">
                ${
									campaign.styling?.icon
										? `<img src="${campaign?.styling?.icon}" alt="${campaign.metadata.name} icon">`
										: ''
								}
                ${
									campaign?.metadata?.levelRange
										? `<span class="campaign-level">Levels ${campaign?.metadata?.levelRange}</span>`
										: ''
								}
            </div>
        `;

		if (campaign?.metadata?.characters) {
			const characterCards = this.#createCampaignCharacters(campaign);
			const characterCardsContainer = document.createElement('div');
			characterCardsContainer.className = 'campaign-characters';

			if (campaign?.metadata?.charactersPosition) {
				characterCardsContainer.classList.add(`card-position-${campaign?.metadata?.charactersPosition}`);
			}
			characterCards.forEach((card) => characterCardsContainer.appendChild(card));

			card.append(characterCardsContainer);
		}

		if (campaign.data) {
			card.addEventListener('click', () => {
				// Determine what to load based on campaign type
				const campaignType = campaign.metadata?.campaignType || 'map';

				if (campaignType === 'map') {
					// For map campaigns, get default map
					const defaultMap = this.#getCampaignDefaultMap(campaign);
					this.loadCampaign(campaign.id, defaultMap);
				} else if (campaignType === 'story') {
					// For story campaigns, get first session
					const firstSessionId = this.#getFirstSessionId(campaign);
					this.loadCampaign(campaign.id, null, firstSessionId);
				}
			});
		} else {
			card.classList.add('disabled');
		}

		return card;
	}

	#createCampaignCharacters(campaign) {
		if (!campaign?.metadata?.characters) return [];

		const characterCards = campaign.metadata.characters.map((character) => {
			const characterCard = document.createElement('div');
			characterCard.className = `campaign-character-card`;

			if (campaign?.metadata?.charactersPosition === 'left' || !campaign?.metadata?.charactersPosition) {
				characterCard.innerHTML = `
                    <div class="character-card-item item-row">
                        <span class="character-card-name">${character.name}</span>
                        <span class="character-card-info">Lvl ${character.level} | ${character.race} | ${
					character.class
				}</span>
                    </div>
                    <div class="character-card-item">
                        <img src="${character?.icon}" class="character-card-icon icon-${character.class
					.toLowerCase()
					.replace(/\s+/g, '-')}"/>
                    </div>
                `;
			} else {
				characterCard.innerHTML = `
                    <div class="character-card-item">
                        <img src="${character?.icon}" class="character-card-icon icon-${character.class
					.toLowerCase()
					.replace(/\s+/g, '-')}"/>
                    </div>
                    <div class="character-card-item item-row">
                        <span class="character-card-name">${character.name}</span>
                        <span class="character-card-info">Lvl ${character.level} | ${character.race} | ${
					character.class
				}</span>
                    </div>
                `;
			}

			return characterCard;
		});

		return characterCards;
	}

	#isCampaignValid(campaignId) {
		// Check if campaign exists and has either data or recaps (for story campaigns)
		const campaign = CAMPAIGN_DATA.find((campaign) => campaign.id === campaignId);
		return campaign && (campaign.data?.length > 0 || campaign.recaps?.length > 0);
	}

	loadCampaign(campaignId, mapKey = null, sessionId = null) {
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
		document.getElementById('actions').style.display = 'block';

		// Determine which type of campaign and load accordingly
		const campaignType = campaign.metadata?.campaignType || 'map';

		if (campaignType === 'map') {
			this.#loadMapCampaign(campaign, mapKey);
		} else if (campaignType === 'story') {
			this.#loadStoryCampaign(campaign, sessionId);
		}

		this.#setupRecapButton();
	}

	#loadMapCampaign(campaign, mapKey = null) {
		// Determine which map to load
		const defaultMap = mapKey || this.#getCampaignDefaultMap(campaign);
		if (!defaultMap) {
			console.error('No valid map found for campaign:', campaign.id);
			return;
		}

		// Update URL with both campaign and map parameters
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		params.set('campaign', campaign.id);
		params.set('map', defaultMap);

		// Preserve any existing target parameter if present
		const targetParam = params.get('t');
		if (targetParam) {
			params.set('t', targetParam);
		}

		const newUrl = `${window.location.pathname}?${params.toString()}`;
		window.history.pushState({ campaignId: campaign.id, mapKey: defaultMap, view: 'map' }, '', newUrl);

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
			// Reload map with new campaign data
			this.#mapInstance.updateCampaignData(campaign.data);
			this.#mapInstance.loadMap(defaultMap);
		}
	}

	#loadStoryCampaign(campaign, sessionId = null) {
		// Get first session if none provided
		if (!sessionId) {
			sessionId = this.#getFirstSessionId(campaign);
			if (!sessionId) {
				console.error('No valid session found for story campaign:', campaign.id);
				return;
			}
		}

		// Update URL with campaign and session parameters
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		params.set('campaign', campaign.id);
		params.set('session', sessionId);

		const newUrl = `${window.location.pathname}?${params.toString()}`;
		window.history.pushState({ campaignId: campaign.id, sessionId, view: 'story' }, '', newUrl);

		// Show story view
		document.getElementById('story-view').style.display = 'block';

		// Initialize or update story view
		if (!this.#storyInstance) {
			this.#storyInstance = new StoryView('story-view', {
				campaignData: campaign,
				initialSessionId: sessionId,
				isDebugMode: this.isDebugMode,
			});
		} else {
			// Update with new campaign data
			this.#storyInstance.updateCampaign(campaign, sessionId);
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
		const campaignId = params.get('campaign'); // Preserve campaign ID if it exists

		// Clear other parameters but keep campaign if it exists
		currentUrl.search = '';
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
	}
}
// New StoryView class for handling story campaigns
class StoryView {
	#rootElement;
	#campaign;
	#currentSessionId;
	#isDebugMode;
	#tooltipContainer;
	#selectedCharacter = null;
	#isSidebarCollapsed = false;
	#isTimelineVisible = false;
	#apiBaseUrl = 'https://www.dnd5eapi.co/api/2014/';
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

		// Create tooltip container once during initialization
		this.#createTooltipContainer();

		// Check for saved sidebar state in local storage
		const savedSidebarState = localStorage.getItem('story-sidebar-collapsed');
		if (savedSidebarState) {
			this.#isSidebarCollapsed = savedSidebarState === 'true';
		}

		this.updateCampaign(options.campaignData, options.initialSessionId);
	}

	updateCampaign(campaign, sessionId = null) {
		if (!campaign) return;

		if (campaign?.metadata?.characters) {
			campaign.metadata.characters.forEach((char) => {
				this.#customApiData.character = this.#customApiData.character || {};
				this.#customApiData.character[char.name] = char;
			});
		}

		this.#campaign = campaign;
		this.#currentSessionId = sessionId || this.#getFirstSessionId();

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

		// Load the session content - Await this async operation
		await this.#loadSessionContent(contentArea);

		mainContent.appendChild(contentArea);
		container.appendChild(mainContent);

		this.#rootElement.appendChild(container);

		// Generate table of contents after content is loaded - only for session view
		// Only generate TOC if we're viewing a session, not a character
		if (!this.#selectedCharacter && !this.#isTimelineVisible) {
			this.#generateTableOfContents(contentArea);
		}
	}

	#createHeader(container) {
		const header = document.createElement('div');
		header.className = 'story-header';

		header.innerHTML = `
            <h1>${this.#campaign.metadata?.name || 'Unnamed Campaign'}</h1>
            <div class="story-description">
                ${this.#campaign.metadata?.description || ''}
            </div>
        `;

		container.appendChild(header);
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
		campaignName.innerHTML = `<h3>${this.#campaign.metadata?.name || 'Unnamed Campaign'}</h1>`;
		sidebar.appendChild(campaignName);

		// Add characters section
		this.#createCharacterSection(sidebar);

		// Add timeline section
		this.#createTimelineSection(sidebar);

		// Add sessions section
		this.#createSessionList(sidebar);

		return sidebar;
	}

	// Modify the #toggleSidebar method to manage the animation
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
			}, 300); // Match this with the CSS transition duration
		}

		// Save state to local storage
		localStorage.setItem('story-sidebar-collapsed', this.#isSidebarCollapsed);
	}

	#createCharacterSection(sidebar) {
		const characters = this.#campaign.metadata?.characters;
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
			if (this.#selectedCharacter === character.name) {
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
				this.#handleCharacterClick(character);
			});

			characterList.appendChild(charCard);
		});

		characterSection.appendChild(characterList);
		sidebar.appendChild(characterSection);
	}

	#handleCharacterClick(character) {
		// Toggle selection if clicking the same character
		if (this.#selectedCharacter === character.name) {
			this.#selectedCharacter = null;
		} else {
			this.#selectedCharacter = character.name;
		}

		// Hide timeline when a character is selected
		this.#isTimelineVisible = false;

		// Re-render to update the content area with character background
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
			// Only highlight if viewing this session AND timeline is not visible
			if (session.id === this.#currentSessionId && !this.#selectedCharacter && !this.#isTimelineVisible) {
				sessionItem.classList.add('active');
			}

			sessionItem.innerHTML = `
				<h3>${session.title}</h3>
				<div class="session-date">${session.date || ''}</div>
			`;

			sessionItem.addEventListener('click', () => {
				this.#selectedCharacter = null; // Clear character selection
				this.#isTimelineVisible = false; // Hide timeline
				this.#currentSessionId = session.id;
				this.render();

				// Update URL
				const currentUrl = new URL(window.location.href);
				currentUrl.searchParams.set('session', session.id);
				window.history.pushState(
					{
						campaignId: this.#campaign.id,
						sessionId: session.id,
						view: 'story',
					},
					'',
					currentUrl.toString()
				);
			});

			sessionList.appendChild(sessionItem);
		});

		sessionSection.appendChild(sessionList);
		sidebar.appendChild(sessionSection);
	}

	// Add the new timeline section method
	#createTimelineSection(sidebar) {
		const timelineSection = document.createElement('div');
		timelineSection.className = 'story-timeline-section';

		const sectionTitle = document.createElement('h2');
		sectionTitle.textContent = 'Campaign';
		timelineSection.appendChild(sectionTitle);

		const timelineButton = document.createElement('button');
		timelineButton.className = 'timeline-button';
		timelineButton.textContent = 'View Timeline';

		// Change from toggle to just showing the timeline
		timelineButton.addEventListener('click', () => {
			this.#showTimeline();
		});

		timelineSection.appendChild(timelineButton);
		sidebar.appendChild(timelineSection);
	}

	// Replace toggle method with show method
	#showTimeline() {
		this.#isTimelineVisible = true;
		this.#selectedCharacter = null; // Clear character selection

		// Re-render to show the timeline
		this.render();
	}

	// Modify renderTimeline method to handle subitems differently
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

			const mainContent = document.createElement('div');
			mainContent.className = 'timeline-content';
			mainContent.innerHTML = `
				<h3>${item.title}</h3>
				<div class="timeline-location">${item.location}</div>
				${item.session ? `<span class="timeline-item-session">Session ${item.session}</span>` : ''}
			`;

			mainItem.appendChild(mainContent);
			timeline.appendChild(mainItem);

			// Flip side for the next main item group
			const nextSide = side === 'left' ? 'right' : 'left';

			// Add subitems if any, keeping them on the same side
			if (item.items && item.items.length > 0) {
				item.items.forEach((subitem) => {
					const subitemEl = document.createElement('div');
					subitemEl.className = `timeline-item timeline-subitem ${side}`;
					subitemEl.setAttribute('data-parent-id', item.id);
					subitemEl.setAttribute('data-type', subitem.type);

					const subContent = document.createElement('div');
					subContent.className = 'timeline-content';

					let subitemHTML = `
						<h4>${subitem.type.charAt(0).toUpperCase() + subitem.type.slice(1)}: ${subitem.actors}</h4>
					`;

					if (subitem.is_new_session) {
						subitemEl.classList.add('new-session-indicator');
						subitemHTML += `<div class="timeline-new-session">New session</div>`;
					}

					// Add sublocation if any
					if (subitem.sublocation) {
						subitemHTML += `<div class="timeline-sublocation">${subitem.sublocation}</div>`;
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
	}

	async #loadSessionContent(contentArea) {
		// Clear previous content (including timeline if it was shown)
		contentArea.innerHTML = '';

		// If timeline is visible, render it
		if (this.#isTimelineVisible) {
			this.#renderTimeline(contentArea);
			return;
		}

		// If a character is selected, show their background instead of session
		if (this.#selectedCharacter) {
			this.#loadCharacterBackground(contentArea);
			return;
		}

		if (!this.#currentSessionId || !this.#campaign.recaps) {
			contentArea.innerHTML = '<div class="no-content">No session content available</div>';
			return;
		}

		const session = this.#campaign.recaps.find((s) => s.id === this.#currentSessionId);
		if (!session) {
			contentArea.innerHTML = '<div class="no-content">Session not found</div>';
			return;
		}

		// --- Helper function to fetch and parse Markdown ---
		const fetchAndParseMd = async (filePath) => {
			if (!filePath || typeof filePath !== 'string' || !filePath.endsWith('.md')) {
				// If it's not a markdown path, return it directly (assuming it's HTML)
				return filePath || '';
			}

			// Construct the full path relative to the campaign data directory
			// Assuming the campaign ID corresponds to the folder name
			const basePath = `src/databases/campaign_data/${this.#campaign.id.replace('-', '_')}/`;
			const fullPath = basePath + filePath;

			try {
				const response = await fetch(fullPath);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const mdContent = await response.text();

				// Return the raw Markdown content directly
				return mdContent;
			} catch (error) {
				console.error(`Error fetching or parsing Markdown file "${fullPath}":`, error);
				return `<div class="error">Error loading content: ${error.message}</div>`;
			}
		};
		// --- End Helper function ---

		// Create session TOC container (will be populated later)
		const sessionToc = document.createElement('div');
		sessionToc.className = 'session-toc';

		// Create the TOC element that will be sticky
		const toc = document.createElement('div');
		toc.className = 'toc';
		toc.id = 'toc';
		sessionToc.appendChild(toc);

		// Add session TOC to content area
		contentArea.appendChild(sessionToc);

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

		const sessionRecap = document.createElement('div');
		sessionRecap.className = 'session-small-recap';

		// Parse the content HTML string
		const tempRecap = document.createElement('div');
		// Fetch and use raw MD content for recap
		tempRecap.innerHTML = `<h3 id="short-summary">Short summary</h3>${await fetchAndParseMd(session?.recap)}`;

		// Process images and character highlights
		this.#processImages(tempRecap);
		this.#processCharacterReferences(tempRecap); // Add this new line
		this.#processCharacterHighlights(tempRecap);
		this.#processEntityReferences(tempRecap); // Add this line
		this.#processProgressionTags(tempRecap, session); // Add this line

		// Add processed content to recap content
		sessionRecap.appendChild(tempRecap);
		sessionContent.appendChild(sessionRecap);

		// Process and add main content
		const mainContent = document.createElement('div');
		mainContent.className = 'session-main-content';

		// Parse the content HTML string
		const tempDiv = document.createElement('div');
		// Fetch and use raw MD content for main content
		tempDiv.innerHTML = `<h2 id="session-recap" style="margin: 0;">Session recap</h3>${await fetchAndParseMd(
			session.content
		)}`;

		// Process images and character highlights
		this.#processImages(tempDiv);
		this.#processCharacterReferences(tempDiv); // Add this new line
		this.#processCharacterHighlights(tempDiv);
		this.#processEntityReferences(tempDiv); // Add this line
		this.#processProgressionTags(tempDiv, session); // Add this line

		// Add processed content to main content
		mainContent.appendChild(tempDiv);
		sessionContent.appendChild(mainContent);

		// Add session content to content area
		contentArea.appendChild(sessionContent);
	}

	#generateTableOfContents(contentArea) {
		// Find all headings in the content
		const headings = contentArea.querySelectorAll('.session-content h1, .session-content h2, .session-content h3');
		if (headings.length === 0) return;

		// Get the TOC container
		const tocContainer = contentArea.querySelector('.toc');
		if (!tocContainer) return;

		// Create TOC title
		const tocTitle = document.createElement('h3');
		tocTitle.textContent = 'Table of Contents';
		tocTitle.className = 'toc-title';
		tocContainer.appendChild(tocTitle);

		// Create the list
		const tocList = document.createElement('ul');
		tocList.className = 'toc-list';
		tocContainer.appendChild(tocList);

		// Process headings and add to TOC
		headings.forEach((heading, index) => {
			// Skip headings without IDs and add IDs to those without
			if (!heading.id) {
				heading.id = `heading-${index}`;
			}

			// Create link items for TOC
			const item = document.createElement('li');
			item.className = `toc-item toc-level-${heading.tagName.toLowerCase()}`;

			const link = document.createElement('a');
			link.href = `#${heading.id}`;
			link.textContent = heading.textContent;
			link.className = 'toc-link';

			// Add smooth scroll event
			link.addEventListener('click', (e) => {
				e.preventDefault();
				document.getElementById(heading.id).scrollIntoView({
					behavior: 'smooth',
				});
				// Update URL hash without jumping
				history.pushState(null, null, `#${heading.id}`);
			});

			item.appendChild(link);
			tocList.appendChild(item);
		});
	}

	#loadCharacterBackground(contentArea) {
		if (!this.#campaign.metadata?.characters) {
			contentArea.innerHTML = '<div class="no-content">Character information not available</div>';
			return;
		}

		const character = this.#campaign.metadata.characters.find((c) => c.name === this.#selectedCharacter);

		if (!character) {
			contentArea.innerHTML = '<div class="no-content">Character not found</div>';
			return;
		}

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

			characterBg.innerHTML = character?.background;
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
					<span class="character-page__hp-item-value">${character?.stats?.metadata?.armorClass}</span>
				</div>
				<div class="character-page__hp-item">
					<span class="character-page__hp-item-name">Hit Points</span>
					<span class="character-page__hp-item-value">${character?.stats?.metadata?.healthPoints}</span>
				</div>
				<div class="character-page__hp-item">
					<span class="character-page__hp-item-name">Speed</span>
					<span class="character-page__hp-item-value">${character?.stats?.metadata?.walkingSpeed}</span>
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
						<span class="character-page__ability-score">(${ability.score})</span>
					</div>
				`;
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
					<span class="character-page__save-value">${save.value}</span>
				`;
					savingThrowsContainer.appendChild(saveItem);
				});

				metadataHolder.appendChild(savingThrowsContainer);
			}

			// Function to manage all descriptions
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
						descSpan.textContent = action.description;
						actionItem.appendChild(descSpan);

						// Add clickable class to indicate it can be toggled
						actionItem.classList.add('has-description');

						// Add click handler to toggle description visibility
						const toggleDescription = (e) => {
							e.stopPropagation(); // Prevent bubbling
							if (descSpan.classList.contains('description-hidden')) {
								descriptionManager.open(descSpan);
							} else {
								descriptionManager.closeAll();
							}
						};

						nameSpan.addEventListener('click', toggleDescription);
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
						descSpan.textContent = feature.description;
						featureItem.appendChild(descSpan);

						// Add clickable class to indicate it can be toggled
						featureItem.classList.add('has-description');

						// Add click handler to toggle description visibility
						const toggleDescription = (e) => {
							e.stopPropagation(); // Prevent bubbling
							if (descSpan.classList.contains('description-hidden')) {
								descriptionManager.open(descSpan);
							} else {
								descriptionManager.closeAll();
							}
						};

						nameSpan.addEventListener('click', toggleDescription);
						featureItem.addEventListener('click', toggleDescription);
					}

					featuresContainer.appendChild(featureItem);
				});

				metadataHolder.appendChild(featuresContainer);
			}

			// Add global click handler to close descriptions when clicking outside
			document.addEventListener('click', () => {
				descriptionManager.closeAll();
			});

			// Spells
			if (character?.stats?.metadata?.spellData?.length) {
				const spellsHeader = document.createElement('span');
				spellsHeader.className = 'character-page__header';
				spellsHeader.textContent = 'Spells';
				metadataHolder.appendChild(spellsHeader);

				const spellsContainer = document.createElement('div');
				spellsContainer.className = 'character-page__spells';

				character.stats.metadata.spellData.forEach((spellGroup) => {
					const groupHeader = document.createElement('div');
					groupHeader.className = 'character-page__spell-group-header';
					groupHeader.textContent = spellGroup.groupName;
					spellsContainer.appendChild(groupHeader);

					spellGroup.spells.forEach((spell) => {
						const spellItem = document.createElement('div');
						spellItem.className = 'character-page__spell-item';

						const spellName = document.createElement('div');
						spellName.className = 'character-page__spell-name';
						spellName.textContent = `[ENTITY:spell:${spell.spellInfo.spellName}]`;
						this.#processEntityReferences(spellName);

						const spellMeta = document.createElement('div');
						spellMeta.className = 'character-page__spell-meta';

						const rangeInfo = document.createElement('span');
						rangeInfo.className = 'character-page__spell-range';
						rangeInfo.textContent = `Range: ${spell.range}`;

						const slotInfo = document.createElement('span');
						slotInfo.className = 'character-page__spell-slot';
						slotInfo.textContent = `Slot: ${spell.slotType}`;

						const effectInfo = document.createElement('span');
						effectInfo.className = 'character-page__spell-effect';
						effectInfo.textContent = `Effect: ${spell.effect}`;

						if (spell.spellInfo.spellMetaInfo) {
							const spellNote = document.createElement('div');
							spellNote.className = 'character-page__spell-note';
							spellNote.textContent = spell.spellInfo.spellMetaInfo;
							spellMeta.appendChild(spellNote);
						}

						spellMeta.appendChild(rangeInfo);
						spellMeta.appendChild(slotInfo);
						spellMeta.appendChild(effectInfo);

						spellItem.appendChild(spellName);
						spellItem.appendChild(spellMeta);

						spellsContainer.appendChild(spellItem);
					});
				});

				metadataHolder.appendChild(spellsContainer);
			}

			characterPagePartTwo.append(metadataHolder);
		}

		characterPage.append(characterPagePartTwo);
		characterPage.append(characterPagePartOne);
		contentArea.append(characterPage);
	}

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

	#processCharacterHighlights(contentElement) {
		if (!this.#campaign.metadata?.characters?.length) return;

		// Get character names and create a map for quick lookup
		const characterMap = new Map();
		this.#campaign.metadata.characters.forEach((char) => {
			characterMap.set(char.name, char);
		});

		// Find all spans with character-highlight class
		const spans = contentElement.querySelectorAll('.character-highlight');
		spans.forEach((span) => {
			const characterName = span.getAttribute('data-character');
			if (characterMap.has(characterName)) {
				// Replace the span content to ensure it's just the character name
				span.textContent = characterName;

				// Add event listeners for tooltips
				this.#addCharacterTooltipEvents(span, characterMap.get(characterName));
			}
		});
	}

	#createTooltipContainer() {
		this.#tooltipContainer = document.getElementById('character-tooltip-container');
		if (!this.#tooltipContainer) {
			this.#tooltipContainer = document.createElement('div');
			this.#tooltipContainer.id = 'character-tooltip-container';
			this.#tooltipContainer.className = 'character-tooltip-container';
			this.#tooltipContainer.style.display = 'none';
			document.body.appendChild(this.#tooltipContainer);
		}
	}

	#addCharacterTooltipEvents(element, character) {
		element.addEventListener('mouseover', (e) => {
			// Create tooltip content
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
														? `<div class="tooltip-background">${character.shortDescription}</div>`
														: ''
												}
                    </div>
                </div>
            `;

			// Position the tooltip with smart positioning to avoid scrollbars
			this.#positionTooltip(element);
		});

		element.addEventListener('mouseout', () => {
			this.#tooltipContainer.style.display = 'none';
		});
	}

	#positionTooltip(element) {
		// Make tooltip visible to get dimensions
		this.#tooltipContainer.style.display = 'block';

		const elementRect = element.getBoundingClientRect();
		const tooltipRect = this.#tooltipContainer.getBoundingClientRect();
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
			scrollX: window.scrollX,
			scrollY: window.scrollY,
		};

		// Calculate available space in each direction
		const space = {
			above: elementRect.top - viewport.scrollY,
			below: viewport.height - (elementRect.bottom - viewport.scrollY),
			left: elementRect.left - viewport.scrollX,
			right: viewport.width - (elementRect.right - viewport.scrollX),
		};

		// Default position (prioritize positions in this order: below > above > right > left)
		let position = 'below';
		let horizontalAlign = 'left';

		// Choose best position based on available space
		if (space.below < tooltipRect.height && space.above > tooltipRect.height) {
			position = 'above';
		} else if (space.below < tooltipRect.height && space.right > tooltipRect.width) {
			position = 'right';
		} else if (space.below < tooltipRect.height && space.left > tooltipRect.width) {
			position = 'left';
		}

		// Handle horizontal alignment for above/below positions
		if (position === 'below' || position === 'above') {
			if (elementRect.left + tooltipRect.width > viewport.width) {
				horizontalAlign = 'right';
			}
		}

		// Calculate position coordinates
		let coords = { top: 0, left: 0 };

		switch (position) {
			case 'below':
				coords.top = elementRect.bottom + viewport.scrollY + 10;
				coords.left =
					horizontalAlign === 'left'
						? elementRect.left + viewport.scrollX
						: elementRect.right + viewport.scrollX - tooltipRect.width;
				break;

			case 'above':
				coords.top = elementRect.top + viewport.scrollY - tooltipRect.height - 10;
				coords.left =
					horizontalAlign === 'left'
						? elementRect.left + viewport.scrollX
						: elementRect.right + viewport.scrollX - tooltipRect.width;
				break;

			case 'right':
				coords.top = elementRect.top + viewport.scrollY;
				coords.left = elementRect.right + viewport.scrollX + 10;
				break;

			case 'left':
				coords.top = elementRect.top + viewport.scrollY;
				coords.left = elementRect.left + viewport.scrollX - tooltipRect.width - 10;
				break;
		}

		// Ensure tooltip stays within viewport bounds
		coords.left = Math.max(
			viewport.scrollX + 10,
			Math.min(coords.left, viewport.scrollX + viewport.width - tooltipRect.width - 10)
		);
		coords.top = Math.max(
			viewport.scrollY + 10,
			Math.min(coords.top, viewport.scrollY + viewport.height - tooltipRect.height - 10)
		);

		// Apply position
		this.#tooltipContainer.style.top = `${coords.top}px`;
		this.#tooltipContainer.style.left = `${coords.left}px`;
	}

	// Add these methods to the class
	#processEntityReferences(contentElement) {
		// Find all references in format [ENTITY:type:name]
		const text = contentElement.innerHTML;
		const processedText = text.replace(/\[ENTITY:(.*?):(.*?)\]/g, (match, type, name) => {
			// Create a span with appropriate classes and data attributes
			return `<span class="entity-reference" data-entity-type="${type}" data-entity-name="${name}">${name}</span>`;
		});

		contentElement.innerHTML = processedText;

		// Now attach event listeners to all entity references
		const entitySpans = contentElement.querySelectorAll('.entity-reference');
		entitySpans.forEach((span) => {
			const entityType = span.getAttribute('data-entity-type');
			const entityName = span.getAttribute('data-entity-name');

			// Add event listeners for tooltips
			this.#addEntityTooltipEvents(span, entityType, entityName);
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

	#processProgressionTags(contentElement, session) {
		const progressionRegex = /\[PROGRESSION:(levelup|loot):(.*?)\]/g;

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
			if (progressionRegex.test(text)) {
				const fragment = document.createDocumentFragment();
				let lastIndex = 0;
				let match;

				// Reset regex
				progressionRegex.lastIndex = 0;

				while ((match = progressionRegex.exec(text)) !== null) {
					// Add text before the match
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

					if (replacementNode) {
						fragment.appendChild(replacementNode);
					}

					lastIndex = progressionRegex.lastIndex;
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

	#generateLevelUpElement(level) {
		const levelUpDiv = document.createElement('div');
		levelUpDiv.className = 'progression-levelup';
		levelUpDiv.innerHTML = `
            <div class="levelup-icon">✨</div>
            <div class="levelup-text">
                <h2>Level Up!</h2>
                <p>Congratulations! The party has reached level <strong>${level}</strong>!</p>
            </div>
        `;
		return levelUpDiv;
	}

	#generateLootElement(lootId, session) {
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

			listItem.innerHTML = `
                <span class="loot-item-name">${item.itemName} ${item.count > 1 ? `(x${item.count})` : ''}</span>
                ${ownerText}
                ${item.description ? `<div class="loot-item-description">${item.description}</div>` : ''}
            `;
			list.appendChild(listItem);
		});

		lootContainer.appendChild(list);
		return lootContainer;
	}
}
