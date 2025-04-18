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
		return CAMPAIGN_DATA.some((campaign) => campaign.id === campaignId && campaign.data);
	}

	loadCampaign(campaignId, mapKey = null, sessionId = null) {
		const campaign = CAMPAIGN_DATA.find((c) => c.id === campaignId);
		if (!campaign || !campaign.data) return;

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

	render() {
		if (!this.#rootElement || !this.#campaign) return;

		// Clear the container
		this.#rootElement.innerHTML = '';

		// Create main container
		const container = document.createElement('div');
		container.className = 'story-container';

		// Add campaign header
		this.#createHeader(container);

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

		// Load the session content
		this.#loadSessionContent(contentArea);

		mainContent.appendChild(contentArea);
		container.appendChild(mainContent);

		this.#rootElement.appendChild(container);

		// Generate table of contents after content is loaded - only for session view
		// Only generate TOC if we're viewing a session, not a character
		if (!this.#selectedCharacter) {
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

		// Add characters section
		this.#createCharacterSection(sidebar);

		// Add sessions section
		this.#createSessionList(sidebar);

		return sidebar;
	}

	#toggleSidebar(toggleButton) {
		this.#isSidebarCollapsed = !this.#isSidebarCollapsed;

		// Update button text
		toggleButton.innerHTML = this.#isSidebarCollapsed ? '&raquo;' : '&laquo;';
		toggleButton.setAttribute('aria-label', this.#isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar');

		// Find and toggle the main content container
		const mainContent = this.#rootElement.querySelector('.story-main-content');
		if (mainContent) {
			mainContent.classList.toggle('sidebar-collapsed', this.#isSidebarCollapsed);
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
                    <div class="character-details">
                        <span>Level ${character.level} ${character.race} ${character.class}</span>
                    </div>
                </div>
            `;

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
			if (session.id === this.#currentSessionId && !this.#selectedCharacter) {
				sessionItem.classList.add('active');
			}

			sessionItem.innerHTML = `
                <h3>${session.title}</h3>
                <div class="session-date">${session.date || ''}</div>
            `;

			sessionItem.addEventListener('click', () => {
				this.#selectedCharacter = null; // Clear character selection
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

	#loadSessionContent(contentArea) {
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
		tempRecap.innerHTML = `<h3 id="short-summary">Short summary</h3>${session?.recap}`;

		// Process images and character highlights
		this.#processImages(tempRecap);
		this.#processCharacterReferences(tempRecap); // Add this new line
		this.#processCharacterHighlights(tempRecap);
		this.#processEntityReferences(tempRecap); // Add this line

		// Add processed content to recap content
		sessionRecap.appendChild(tempRecap);
		sessionContent.appendChild(sessionRecap);

		// Process and add main content
		const mainContent = document.createElement('div');
		mainContent.className = 'session-main-content';

		// Parse the content HTML string
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = `<h2 id="session-recap" style="margin: 0;">Session recap</h3>${session.content}`;

		// Process images and character highlights
		this.#processImages(tempDiv);
		this.#processCharacterReferences(tempDiv); // Add this new line
		this.#processCharacterHighlights(tempDiv);
		this.#processEntityReferences(tempDiv); // Add this line

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

		// Create character content container
		const characterContent = document.createElement('div');
		characterContent.className = 'session-content character-content';

		// Add character header with back button
		const characterHeader = document.createElement('div');
		characterHeader.className = 'character-header';

		// Back button to return to session view
		const backButton = document.createElement('button');
		backButton.className = 'back-button';
		backButton.innerHTML = '&larr; Back to Session';
		backButton.style.right = '0';
		backButton.style.left = '0.75rem';
		backButton.style.width = 'max-content';
		backButton.addEventListener('click', () => {
			this.#selectedCharacter = null;
			this.render();
		});

		characterHeader.appendChild(backButton);

		// Character name and details
		const characterHeaderInfo = document.createElement('div');
		characterHeaderInfo.className = 'character-header-info';
		characterHeaderInfo.innerHTML = `
			<div class="character-profile">
				<img src="${character.icon}" alt="${character.name}" class="character-profile-image" />
				<div class="character-profile-details">
					<h2 id="character-name">${character.name}</h2>
					<div class="character-profile-meta">
						Level ${character.level} ${character.race} ${character.class}
					</div>
				</div>
			</div>
		`;

		characterHeader.appendChild(characterHeaderInfo);
		characterContent.appendChild(characterHeader);

		// Character background content
		const backgroundContent = document.createElement('div');
		backgroundContent.className = 'character-background-content';

		// Add full background if available
		if (character.background) {
			const fullBackground = document.createElement('div');
			fullBackground.className = 'character-full-background';
			fullBackground.innerHTML = `
				<h3 id="character-background">Background</h3>
				<div class="background-text">${character.background}</div>
			`;
			this.#processEntityReferences(fullBackground);
			backgroundContent.appendChild(fullBackground);
		} else {
			// If no background is available
			const noBackground = document.createElement('div');
			noBackground.className = 'no-background';
			noBackground.textContent = 'No detailed background available for this character.';
			backgroundContent.appendChild(noBackground);
		}

		characterContent.appendChild(backgroundContent);
		contentArea.appendChild(characterContent);
	}

	#processImages(contentElement) {
		// Find all image placeholders
		// Format: [IMAGE:path/to/image.jpg:optional-caption:optional-width:optional-alignment]
		const text = contentElement.innerHTML;
		const processedText = text.replace(
			/\[IMAGE:(.*?)(?::(.*?))?(?::(.*?))?(?::(.*?))?\]/g,
			(match, src, caption = '', width = '', alignment = 'center') => {
				const widthAttr = width ? `width="${width}"` : '';
				const alignClass = `image-align-${alignment}`;

				return `
                    <div class="story-image-container ${alignClass}">
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
		  <div class="tooltip-description">${
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
		  <div class="tooltip-description">${entityData.desc || entityData.description || 'No description available.'}</div>
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
					  <div class="tooltip-description">${entityData.desc || entityData.description || 'No description available.'}</div>
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
				<div class="tooltip-description">${entityData.description || 'No description available.'}</div>
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
			default:
				content += `
		  <div class="tooltip-description">${entityData.desc || entityData.description || JSON.stringify(entityData)}</div>
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
}
