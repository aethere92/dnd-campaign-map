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
		},
		styling: {
			icon: 'images/pageicon.png',
			backgroundColor: '#795548',
		},
		defaultMap: 'korinis_island',
		data: CAMPAIGN_01,
		aliases: CAMPAIGN_01_ALIASES,
	},
	{
		id: 'campaign-002',
		metadata: {
			name: 'Campaign #2 placeholder',
			description: 'TBD',
		},
		data: null,
	},
];

// Campaign selection and management
class CampaignManager {
	static STORAGE_KEY = 'lastCampaignId';
	#currentCampaign = null;
	#mapInstance = null;
	#rootElement;
	#recapModal = null; // Add this new private field

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

		if (campaignId && this.#isCampaignValid(campaignId)) {
			this.loadCampaign(campaignId, mapKey);
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
				this.loadCampaign(event.state.campaignId, event.state.mapKey);
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

	#createCampaignCard(campaign) {
		const card = document.createElement('div');
		card.className = 'campaign-card';
		card.style.backgroundColor = campaign?.styling?.backgroundColor || '#2c3e50';

		// Get default map for this campaign
		const defaultMap = this.#getCampaignDefaultMap(campaign);

		card.innerHTML = `
            <h2>${campaign.metadata?.name}</h2>
            <p>${campaign.metadata?.description}</p>
            ${!campaign?.data ? '<div class="campaign-status">Coming Soon</div>' : ''}
				<div class="campaign-info">
            		${
									campaign.styling?.icon
										? `<img src="${campaign?.styling?.icon}" alt="${campaign.metadata.name} icon">`
										: ''
								}
					${campaign?.metadata?.levelRange ? `<span class="campaign-level">Levels ${campaign?.metadata?.levelRange}</span>` : ''}
				</div>
        `;

		if (campaign?.metadata?.characters) {
			const characterCards = this.#createCampaignCharacters(campaign);
			const characterCardsContainer = document.createElement('div');
			characterCardsContainer.className = 'campaign-characters';
			characterCards.forEach((card) => characterCardsContainer.appendChild(card));

			card.append(characterCardsContainer);
		}

		if (campaign.data) {
			card.addEventListener('click', () => this.loadCampaign(campaign.id, defaultMap));
		} else {
			card.classList.add('disabled');
		}

		return card;
	}

	#createCampaignCharacters(campaign) {
		if (!campaign?.metadata?.characters) return;

		const characterCards = campaign.metadata.characters.map((character) => {
			const characterCard = document.createElement('div');
			characterCard.className = `campaign-character-card`;

			characterCard.innerHTML = `
				<div class="character-card-item item-row">
					<span class="character-card-name">${character.name}</span>
					<span class="character-card-info">Lvl ${character.level} | ${character.race} | ${character.class}</span>
				</div>
				<div class="character-card-item">
					<img src="${character?.icon}" class="character-card-icon icon-${character.class.toLowerCase()}"/>
				</div>

			`;

			return characterCard;
		});

		return characterCards;
	}

	#isCampaignValid(campaignId) {
		return CAMPAIGN_DATA.some((campaign) => campaign.id === campaignId && campaign.data);
	}

	loadCampaign(campaignId, mapKey = null) {
		const campaign = CAMPAIGN_DATA.find((c) => c.id === campaignId);
		if (!campaign || !campaign.data) return;

		this.#currentCampaign = campaign;
		localStorage.setItem(CampaignManager.STORAGE_KEY, campaignId);

		// Initialize the recap modal with the campaign data
		this.#recapModal = StoryRecapModal.getInstance(campaign?.data, campaign?.aliases);

		// Determine which map to load
		const defaultMap = mapKey || this.#getCampaignDefaultMap(campaign);
		if (!defaultMap) {
			console.error('No valid map found for campaign:', campaignId);
			return;
		}

		// Update URL with both campaign and map parameters
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		params.set('campaign', campaignId);
		params.set('map', defaultMap);

		// Preserve any existing target parameter if present
		const targetParam = params.get('t');
		if (targetParam) {
			params.set('t', targetParam);
		}

		const newUrl = `${window.location.pathname}?${params.toString()}`;
		window.history.pushState({ campaignId, mapKey: defaultMap, view: 'map' }, '', newUrl);

		// Hide campaign selection and show map
		document.getElementById('campaign-selection').style.display = 'none';
		document.getElementById('map').style.display = 'block';
		document.getElementById('actions').style.display = 'block';

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

		this.#setupRecapButton();
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
		document.getElementById('actions').style.display = 'none';
	}
}

class StoryRecapModal {
	static instance = null;

	static getInstance(campaignData, mapAliases) {
		if (!StoryRecapModal.instance) {
			StoryRecapModal.instance = new StoryRecapModal(campaignData, mapAliases);
		} else if (campaignData && mapAliases) {
			// Update existing instance with new data if provided
			StoryRecapModal.instance.updateData(campaignData, mapAliases);
		}
		return StoryRecapModal.instance;
	}

	constructor(campaignData, mapAliases) {
		// Prevent direct construction
		if (StoryRecapModal.instance) {
			return StoryRecapModal.instance;
		}

		this.campaignData = campaignData;
		this.mapAliases = mapAliases;
		this.sessions = this.extractSessions();
		this.currentSession = null;
		this.modal = null;
		this.sidebar = null;
		this.mainContent = null;
		this.isVisible = false; // Add this line

		this.initialize();
		StoryRecapModal.instance = this;
	}

	updateData(campaignData, mapAliases) {
		this.campaignData = campaignData;
		this.mapAliases = mapAliases;
		this.sessions = this.extractSessions();
		this.populateSidebar();

		// Reload current session if it exists
		if (this.currentSession) {
			const updatedSession = this.sessions.find((s) => s.sessionId === this.currentSession.sessionId);
			if (updatedSession) {
				this.loadSession(updatedSession);
			} else {
				this.currentSession = null;
			}
		}
	}

	initialize() {
		// Create modal structure
		this.modal = document.createElement('div');
		this.modal.className = 'story-recap-modal';
		this.modal.style.display = 'none';

		// Create close button
		const closeButton = document.createElement('button');
		closeButton.className = 'story-recap-close';
		closeButton.innerHTML = '×';
		closeButton.onclick = () => this.hide();

		// Create modal content container
		const modalContent = document.createElement('div');
		modalContent.className = 'story-recap-content';

		// Create sidebar
		this.sidebar = document.createElement('div');
		this.sidebar.className = 'story-recap-sidebar';

		// Create main content area
		this.mainContent = document.createElement('div');
		this.mainContent.className = 'story-recap-main';

		// Assemble modal
		modalContent.appendChild(this.sidebar);
		modalContent.appendChild(this.mainContent);
		this.modal.appendChild(closeButton);
		this.modal.appendChild(modalContent);

		// Populate sidebar
		this.populateSidebar();

		// Add modal to document
		document.body.appendChild(this.modal);
	}

	// Get the correct map alias from a path
	getMapAliasFromPath(mapPath) {
		if (!mapPath) return 'world_map';

		// Remove leading slash if present
		mapPath = mapPath.replace(/^\//, '');

		// Find the matching alias
		const aliasEntry = Object.entries(this.mapAliases).find(([alias, path]) => {
			// Convert the dot notation path to regex pattern
			const pathPattern = path.replace(/\./g, '\\.').replace(/world_maps/, 'world_maps(?:\\.submaps)?');
			const regex = new RegExp(pathPattern + '$');
			return regex.test(mapPath);
		});

		return aliasEntry ? aliasEntry[0] : 'world_map';
	}

	extractSessions() {
		const sessions = [];

		const processSubmaps = (data, mapPath = '') => {
			if (data.paths) {
				data.paths.forEach((path) => {
					if (path.sessionId !== undefined) {
						sessions.push({
							name: path.name,
							sessionId: path.sessionId,
							mapPath: data.metadata.mapId,
							points: path.points,
						});
					}
				});
			}

			if (data.submaps) {
				Object.entries(data.submaps).forEach(([key, submap]) => {
					Object.values(submap).forEach((submapData) => {
						processSubmaps(submapData, submapData.metadata.mapId);
					});
				});
			}
		};

		processSubmaps(this.campaignData.world_maps);

		return sessions.sort((a, b) => a.sessionId - b.sessionId);
	}

	populateSidebar() {
		this.sidebar.innerHTML = '';
		this.sessions.forEach((session) => {
			const sessionElement = document.createElement('div');
			sessionElement.className = 'session-item';
			sessionElement.innerHTML = `
                <div>${session.name}</div>
                <div class="session-map">${session.mapPath || 'World Map'}</div>
            `;

			sessionElement.onclick = () => this.loadSession(session);

			this.sidebar.appendChild(sessionElement);
		});
	}

	loadSession(session) {
		// Update active session in sidebar
		const sessionItems = this.sidebar.querySelectorAll('.session-item');
		sessionItems.forEach((item) => item.classList.remove('active'));
		sessionItems[this.sessions.indexOf(session)].classList.add('active');

		// Clear and populate main content
		this.mainContent.innerHTML = '';

		// Add session title
		const title = document.createElement('h2');
		title.textContent = session.name;
		this.mainContent.appendChild(title);

		// Add recap points
		const recapSection = document.createElement('div');
		recapSection.className = 'recap-section';

		session.points.forEach((point, index) => {
			if (point.text) {
				const pointElement = document.createElement('div');
				pointElement.className = 'recap-point';
				if (point.coordinates) {
					pointElement.classList.add('has-location');
				}
				pointElement.textContent = point.text;

				// Add click handler if coordinates exist
				if (point.coordinates) {
					pointElement.onclick = () => {
						const target = {
							type: 'recap',
							id: `${session.sessionId}-${index}`,
							coordinates: point.coordinates,
						};

						// Get the correct map alias from the session's mapPath
						const mapKey = session.mapPath;

						// Update the URL with the new location
						UrlManager.updateUrl(mapKey, true, target);

						// Hide the modal after clicking
						// this.hide();
					};
				}

				recapSection.appendChild(pointElement);
			}

			// Add loot section if exists
			if (point.loot) {
				const lootSection = document.createElement('div');
				lootSection.className = 'loot-section';
				lootSection.innerHTML = `
                    <h3>Loot Acquired</h3>
                    <ul>
                        ${point.loot
													.map(
														(item) => `
                            <li>
                                <strong>${item.name}</strong> (${item.rarity})
                                <p>${item.description}</p>
                            </li>
                        `
													)
													.join('')}
                    </ul>
                `;
				recapSection.appendChild(lootSection);
			}

			// Add level up section if exists
			if (point.level) {
				const levelSection = document.createElement('div');
				levelSection.className = 'level-up';
				levelSection.innerHTML = `
                    <h3>Level Up!</h3>
                    <p>The party reached level ${point.level}</p>
                `;
				recapSection.appendChild(levelSection);
			}
		});

		this.mainContent.appendChild(recapSection);
		this.currentSession = session;
	}

	show() {
		this.modal.style.display = 'block';
		this.isVisible = true; // Add this line
		// Load first session by default if none is selected
		if (!this.currentSession && this.sessions.length > 0) {
			this.loadSession(this.sessions[0]);
		}
	}

	hide() {
		this.modal.style.display = 'none';
		this.isVisible = false; // Add this line
	}
}
