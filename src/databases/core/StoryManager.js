class StoryManager {
	#rootElement;
	#campaign;
	#currentSessionId;
	#currentView = StoryURLManager.VIEW_TYPES.SESSION;
	#selectedCharacterName = null;
	#isSidebarCollapsed = false;
	#storyUrlManager;

	// Helper instances
	#contentRenderer;
	#sidebarManager;
	#tooltipManager;
	#placeholderProcessor;
	#navigationManager;
	#searchManager;

	constructor(elementId, options = {}) {
		this.#rootElement = document.getElementById(elementId);
		if (!this.#rootElement) {
			console.error('StoryManager: Root element not found:', elementId);
			return;
		}

		this.#storyUrlManager = new StoryURLManager();
		this.#initializeHelpers(options);
		this.#loadSavedState();

		this.updateCampaign(
			options.campaignData,
			options.initialSessionId,
			options.initialCharacterName,
			options.initialViewType
		);
	}

	#initializeHelpers(options) {
		this.#tooltipManager = new StoryHelperTooltip({
			campaignId: options.campaignData?.id,
			characters: options.campaignData?.metadata?.characters || [],
			npcs: options.campaignData?.npcs || [],
			locations: options.campaignData?.locations || [],
			quests: options.campaignData?.quests || [],
			factions: options.campaignData?.factions || [],
		});

		this.#placeholderProcessor = new StoryHelperPlaceholder(this.#tooltipManager, options.campaignData);
		this.#navigationManager = new StoryHelperNavigation();
		this.#searchManager = new StoryHelperSearch(
			() => this.#campaign,
			(navigation) => this.#handleSearchNavigation(navigation)
		);

		this.#sidebarManager = new StoryHelperSidebar(
			() => this.#campaign,
			() => this.#currentView,
			() => this.#currentSessionId,
			() => this.#selectedCharacterName,
			(collapsed) => this.#handleSidebarToggle(collapsed),
			(characterName) => this.#handleCharacterClick(characterName),
			(sessionId) => this.#handleSessionClick(sessionId),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.TIMELINE),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.QUESTS),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.LOCATIONS),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.NPCS),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.FACTIONS),
			this.#searchManager
		);

		this.#contentRenderer = new StoryHelperContent(
			this.#placeholderProcessor,
			() => this.#campaign,
			() => this.#currentSessionId
		);
	}

	#loadSavedState() {
		const savedState = localStorage.getItem('story-sidebar-collapsed');
		if (savedState) {
			this.#isSidebarCollapsed = savedState === 'true';
		}
	}

	getSidebarElement() {
		return this.#rootElement?.querySelector('.story-sidebar');
	}

	setCampaignManager(campaignManager, showCampaignSelectionCallback) {
		this.campaignManager = campaignManager;
		this.showCampaignSelection = showCampaignSelectionCallback;
		this.#ensureCampaignSelectionButton();
	}

	#ensureCampaignSelectionButton() {
		const sidebar = this.getSidebarElement();
		if (!sidebar) return;

		const existingButton = sidebar.querySelector('.story-campaign-selection');
		existingButton?.remove();

		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'story-campaign-selection';
		Object.assign(buttonContainer.style, {
			marginTop: 'auto',
			padding: '10px',
		});

		const button = document.createElement('button');
		button.textContent = 'Campaign selection';
		button.className = 'sidebar-back-button button-secondary';
		button.style.width = '100%';
		button.addEventListener('click', this.showCampaignSelection);

		buttonContainer.appendChild(button);
		sidebar.appendChild(buttonContainer);
	}

	updateCampaign(campaign, sessionId = null, characterName = null, viewType = null) {
		if (!campaign) return;

		this.#campaign = campaign;
		this.#determineView(viewType, characterName, sessionId);
		this.#searchManager?.invalidateIndex();
		this.render();
	}

	#determineView(viewType, characterName, sessionId) {
		const viewTypeMap = {
			[StoryURLManager.VIEW_TYPES.TIMELINE]: StoryURLManager.VIEW_TYPES.TIMELINE,
			[StoryURLManager.VIEW_TYPES.QUESTS]: StoryURLManager.VIEW_TYPES.QUESTS,
			[StoryURLManager.VIEW_TYPES.LOCATIONS]: StoryURLManager.VIEW_TYPES.LOCATIONS,
			[StoryURLManager.VIEW_TYPES.NPCS]: StoryURLManager.VIEW_TYPES.NPCS,
			[StoryURLManager.VIEW_TYPES.FACTIONS]: StoryURLManager.VIEW_TYPES.FACTIONS,
		};

		if (viewTypeMap[viewType]) {
			this.#currentView = viewTypeMap[viewType];
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId();
		} else if (characterName) {
			this.#currentView = StoryURLManager.VIEW_TYPES.CHARACTER;
			this.#selectedCharacterName = characterName;
			this.#currentSessionId = sessionId || this.#getFirstSessionId();
		} else {
			this.#currentView = StoryURLManager.VIEW_TYPES.SESSION;
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId();

			if (!this.#currentSessionId) {
				console.error('StoryManager: No valid session ID for session view');
				this.#currentSessionId = this.#getFirstSessionId();

				if (!this.#currentSessionId) {
					this.#rootElement.innerHTML = '<p>Error: No sessions found for this campaign.</p>';
					return;
				}
			}
		}
	}

	#getFirstSessionId() {
		return this.#campaign?.recaps?.[0]?.id ?? null;
	}

	async render() {
		if (!this.#rootElement || !this.#campaign) return;

		this.#rootElement.innerHTML = '';

		const container = document.createElement('div');
		container.className = 'story-container';

		const mainContent = document.createElement('div');
		mainContent.className = 'story-main-content';
		if (this.#isSidebarCollapsed) {
			mainContent.classList.add('sidebar-collapsed');
		}

		const sidebar = this.#sidebarManager.createSidebar(this.#isSidebarCollapsed);
		const contentArea = document.createElement('div');
		contentArea.className = 'story-content-area';

		await this.#loadContentArea(contentArea);

		mainContent.append(sidebar, contentArea);
		container.appendChild(mainContent);
		this.#rootElement.appendChild(container);

		if (this.#currentView === StoryURLManager.VIEW_TYPES.SESSION) {
			this.#generateTableOfContents(contentArea);
			this.#navigationManager.scrollToHash();
		}

		this.#ensureCampaignSelectionButton();
	}

	#handleSidebarToggle(collapsed) {
		this.#isSidebarCollapsed = collapsed;
		localStorage.setItem('story-sidebar-collapsed', collapsed);
	}

	#handleCharacterClick(characterName) {
		if (this.#currentView === StoryURLManager.VIEW_TYPES.CHARACTER && this.#selectedCharacterName === characterName) {
			this.#currentView = StoryURLManager.VIEW_TYPES.SESSION;
			this.#selectedCharacterName = null;
		} else {
			this.#currentView = StoryURLManager.VIEW_TYPES.CHARACTER;
			this.#selectedCharacterName = characterName;
		}

		this.#updateURL();
		this.render();
	}

	#handleSessionClick(sessionId) {
		this.#currentView = StoryURLManager.VIEW_TYPES.SESSION;
		this.#selectedCharacterName = null;
		this.#currentSessionId = sessionId;

		this.#updateURL();
		this.render();
	}

	#handleViewChange(viewType) {
		if (this.#currentView === viewType) return;

		this.#currentView = viewType;
		this.#selectedCharacterName = null;

		this.#updateURL();
		this.render();
	}

	#handleSearchNavigation(navigation) {
		const { view, sessionId, characterName, itemId } = navigation;

		switch (view) {
			case StoryURLManager.VIEW_TYPES.SESSION:
				this.#handleSessionClick(sessionId);
				break;
			case StoryURLManager.VIEW_TYPES.CHARACTER:
				this.#handleCharacterClick(characterName);
				break;
			case StoryURLManager.VIEW_TYPES.QUESTS:
			case StoryURLManager.VIEW_TYPES.LOCATIONS:
			case StoryURLManager.VIEW_TYPES.NPCS:
			case StoryURLManager.VIEW_TYPES.FACTIONS:
				this.#currentView = view;
				this.#selectedCharacterName = null;

				const url = this.#storyUrlManager.buildStoryItemURL(this.#campaign.id, view, itemId);
				this.#storyUrlManager.updateHistory(url, null, true);
				this.render();
				break;
		}
	}

	#updateURL() {
		const config = {
			campaign: this.#campaign.id,
		};

		// Set view-specific parameters
		switch (this.#currentView) {
			case StoryURLManager.VIEW_TYPES.TIMELINE:
			case StoryURLManager.VIEW_TYPES.QUESTS:
			case StoryURLManager.VIEW_TYPES.LOCATIONS:
			case StoryURLManager.VIEW_TYPES.FACTIONS:
			case StoryURLManager.VIEW_TYPES.NPCS:
				config.view = this.#currentView;
				break;
			case StoryURLManager.VIEW_TYPES.CHARACTER:
				config.character = this.#selectedCharacterName;
				break;
			case StoryURLManager.VIEW_TYPES.SESSION:
			default:
				config.session = this.#currentSessionId;
				break;
		}

		const url = this.#storyUrlManager.buildURL(config);
		const state = this.#storyUrlManager.createState(this.#currentView, {
			campaignId: this.#campaign.id,
			sessionId: this.#currentView === StoryURLManager.VIEW_TYPES.SESSION ? this.#currentSessionId : null,
			characterName: this.#currentView === StoryURLManager.VIEW_TYPES.CHARACTER ? this.#selectedCharacterName : null,
			viewType: this.#currentView,
		});

		this.#storyUrlManager.updateHistory(url, state, true);
	}

	async #loadContentArea(contentArea) {
		contentArea.innerHTML = '';

		const viewMap = {
			[StoryURLManager.VIEW_TYPES.TIMELINE]: () => this.#contentRenderer.renderTimeline(contentArea),
			[StoryURLManager.VIEW_TYPES.QUESTS]: () => this.#contentRenderer.renderQuests(contentArea),
			[StoryURLManager.VIEW_TYPES.LOCATIONS]: () => this.#contentRenderer.renderLocations(contentArea),
			[StoryURLManager.VIEW_TYPES.NPCS]: () => this.#contentRenderer.renderNPCs(contentArea),
			[StoryURLManager.VIEW_TYPES.FACTIONS]: () => this.#contentRenderer.renderFactions(contentArea),
			[StoryURLManager.VIEW_TYPES.CHARACTER]: () =>
				this.#contentRenderer.renderCharacter(contentArea, this.#selectedCharacterName),
			[StoryURLManager.VIEW_TYPES.SESSION]: () => this.#contentRenderer.renderSession(contentArea),
		};

		const renderMethod = viewMap[this.#currentView] || viewMap[StoryURLManager.VIEW_TYPES.SESSION];
		await renderMethod();
	}

	#generateTableOfContents(contentArea) {
		const sessionContent = contentArea.querySelector('.session-main-content');
		if (!sessionContent) return;

		const headings = sessionContent.querySelectorAll('h1, h2, h3, h4');
		if (headings.length === 0) return;

		const tocContainer = contentArea.querySelector('.toc');
		if (!tocContainer) return;

		tocContainer.innerHTML = '';

		const tocTitle = document.createElement('h3');
		tocTitle.textContent = 'On this page';
		tocTitle.className = 'toc-title';

		const tocList = document.createElement('ul');
		tocList.className = 'toc-list';

		headings.forEach((heading, index) => {
			if (!heading.id) {
				const slug = heading.textContent
					.toLowerCase()
					.trim()
					.replace(/\s+/g, '-')
					.replace(/[^\w-]+/g, '');
				heading.id = slug || `heading-${index}`;
			}

			const item = document.createElement('li');
			item.className = `toc-item toc-level-${heading.tagName.toLowerCase()}`;

			const link = document.createElement('a');
			link.href = `#${heading.id}`;
			link.textContent = heading.textContent;
			link.className = 'toc-link';

			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetElement = document.getElementById(heading.id);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
					history.replaceState(null, '', `#${heading.id}`);
				}
			});

			item.appendChild(link);
			tocList.appendChild(item);
		});

		tocContainer.append(tocTitle, tocList);
	}
}
