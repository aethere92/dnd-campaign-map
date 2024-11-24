const CAMPAIGN_DATA = [
	{
		id: 'campaign-001',
		metadata: {
			name: "A quest, a questin' we shall go",
			description:
				'Six adventurers — a cleric, ranger, sorcerer, bard, and two barbarians — receive mysterious invitations to a strange, distant land. Teaming up with a band of pirates, they embark on an epic journey, battling fearsome monsters and navigating treacherous seas. Their quest takes an unexpected turn as they find themselves stranded on the enigmatic island of Korinis, where new challenges and hidden secrets await.',
			levelRange: '3-8',
		},
		styling: {
			icon: 'images/pageicon.png',
			backgroundColor: '#795548',
		},
		defaultMap: 'korinis_island',
		data: CAMPAIGN_01,
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
		const backButton = document.createElement('button');
		backButton.id = 'back-to-campaigns';
		backButton.className = 'back-button';
		backButton.textContent = 'Campaign selection';
		backButton.addEventListener('click', () => this.showCampaignSelection());
		document.getElementById('actions').prepend(backButton);
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

		if (campaign.data) {
			card.addEventListener('click', () => this.loadCampaign(campaign.id, defaultMap));
		} else {
			card.classList.add('disabled');
		}

		return card;
	}

	#isCampaignValid(campaignId) {
		return CAMPAIGN_DATA.some((campaign) => campaign.id === campaignId && campaign.data);
	}

	loadCampaign(campaignId, mapKey = null) {
		const campaign = CAMPAIGN_DATA.find((c) => c.id === campaignId);
		if (!campaign || !campaign.data) return;

		this.#currentCampaign = campaign;
		localStorage.setItem(CampaignManager.STORAGE_KEY, campaignId);

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

		window.history.pushState({ view: 'campaigns', campaignId }, '', currentUrl.toString());

		// Show/hide appropriate views
		document.getElementById('campaign-selection').style.display = 'block';
		document.getElementById('map').style.display = 'none';
		document.getElementById('actions').style.display = 'none';
	}
}
