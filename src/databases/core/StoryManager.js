class StoryManager {
	#rootElement;
	#campaign;
	#currentSessionId;
	#currentView = 'session';
	#selectedCharacterName = null;
	#isSidebarCollapsed = false;

	// Helper instances
	#contentRenderer;
	#sidebarManager;
	#tooltipManager;
	#placeholderProcessor;
	#navigationManager;

	constructor(elementId, options = {}) {
		this.#rootElement = document.getElementById(elementId);
		if (!this.#rootElement) {
			console.error('StoryManager: Root element not found:', elementId);
			return;
		}

		// Initialize helpers
		this.#tooltipManager = this.#tooltipManager = new StoryHelperTooltip({
			characters: options.campaignData?.metadata?.characters || [],
			npcs: options.campaignData?.npcs || [],
			locations: options.campaignData?.locations || [],
			quests: options.campaignData?.quests || [],
		});
		this.#placeholderProcessor = new StoryHelperPlaceholder(this.#tooltipManager, options.campaignData);
		this.#navigationManager = new StoryHelperNavigation();
		this.#sidebarManager = new StoryHelperSidebar(
			() => this.#campaign,
			() => this.#currentView,
			() => this.#currentSessionId,
			() => this.#selectedCharacterName,
			(collapsed) => this.#handleSidebarToggle(collapsed),
			(characterName) => this.#handleCharacterClick(characterName),
			(sessionId) => this.#handleSessionClick(sessionId),
			() => this.#handleTimelineClick(),
			() => this.#handleQuestsClick(),
			() => this.#handleLocationsClick(),
			() => this.#handleNPCsClick()
		);
		this.#contentRenderer = new StoryHelperContent(
			this.#placeholderProcessor,
			() => this.#campaign,
			() => this.#currentSessionId
		);

		// Load saved sidebar state
		const savedState = localStorage.getItem('story-sidebar-collapsed');
		if (savedState) {
			this.#isSidebarCollapsed = savedState === 'true';
		}

		this.updateCampaign(
			options.campaignData,
			options.initialSessionId,
			options.initialCharacterName,
			options.initialViewType
		);
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

		// Determine initial state based on viewType
		if (viewType === 'timeline') {
			this.#currentView = 'timeline';
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId();
		} else if (viewType === 'quests') {
			this.#currentView = 'quests';
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId();
		} else if (viewType === 'locations') {
			this.#currentView = 'locations';
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId();
		} else if (viewType === 'npcs') {
			this.#currentView = 'npcs';
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId();
		} else if (characterName) {
			this.#currentView = 'character';
			this.#selectedCharacterName = characterName;
			this.#currentSessionId = sessionId || this.#getFirstSessionId();
		} else {
			this.#currentView = 'session';
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId();
		}

		// Validate session view
		if (this.#currentView === 'session' && !this.#currentSessionId) {
			console.error('StoryManager: No valid session ID for session view');
			this.#currentSessionId = this.#getFirstSessionId();

			if (!this.#currentSessionId) {
				this.#rootElement.innerHTML = '<p>Error: No sessions found for this campaign.</p>';
				return;
			}
		}

		this.render();
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

		if (this.#currentView === 'session') {
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
		if (this.#currentView === 'character' && this.#selectedCharacterName === characterName) {
			this.#currentView = 'session';
			this.#selectedCharacterName = null;
		} else {
			this.#currentView = 'character';
			this.#selectedCharacterName = characterName;
		}

		this.#updateURL();
		this.render();
	}

	#handleSessionClick(sessionId) {
		this.#currentView = 'session';
		this.#selectedCharacterName = null;
		this.#currentSessionId = sessionId;

		this.#updateURL();
		this.render();
	}

	#handleTimelineClick() {
		if (this.#currentView === 'timeline') return;

		this.#currentView = 'timeline';
		this.#selectedCharacterName = null;

		this.#updateURL();
		this.render();
	}

	#handleQuestsClick() {
		if (this.#currentView === 'quests') return;

		this.#currentView = 'quests';
		this.#selectedCharacterName = null;

		this.#updateURL();
		this.render();
	}

	#handleLocationsClick() {
		if (this.#currentView === 'locations') return;

		this.#currentView = 'locations';
		this.#selectedCharacterName = null;

		this.#updateURL();
		this.render();
	}

	#handleNPCsClick() {
		if (this.#currentView === 'npcs') return;

		this.#currentView = 'npcs';
		this.#selectedCharacterName = null;

		this.#updateURL();
		this.render();
	}

	#updateURL() {
		const url = new URL(window.location.href);
		const params = url.searchParams;

		params.set('campaign', this.#campaign.id);
		params.delete('map');

		// Clear all view-specific params first
		params.delete('session');
		params.delete('character');
		params.delete('view');

		// Clear item-specific params that don't match the current view
		// Preserve the one that matches (if any) - StoryBase will handle setting it if needed
		const itemParams = {
			quests: 'quest',
			locations: 'location',
			npcs: 'npc',
		};

		Object.entries(itemParams).forEach(([view, param]) => {
			if (this.#currentView !== view) {
				params.delete(param);
			}
			// If it matches, leave it alone - StoryBase will manage it
		});

		// Set appropriate params based on current view
		switch (this.#currentView) {
			case 'timeline':
			case 'quests':
			case 'locations':
			case 'npcs':
				params.set('view', this.#currentView);
				break;
			case 'character':
				params.set('character', this.#selectedCharacterName);
				break;
			case 'session':
			default:
				params.set('session', this.#currentSessionId);
				break;
		}

		const state = {
			campaignId: this.#campaign.id,
			sessionId: this.#currentView === 'session' ? this.#currentSessionId : null,
			characterName: this.#currentView === 'character' ? this.#selectedCharacterName : null,
			view: this.#currentView,
		};

		window.history.replaceState(state, '', `${url.pathname}?${params.toString()}`);
	}

	async #loadContentArea(contentArea) {
		contentArea.innerHTML = '';

		switch (this.#currentView) {
			case 'timeline':
				this.#contentRenderer.renderTimeline(contentArea);
				break;
			case 'quests':
				this.#contentRenderer.renderQuests(contentArea);
				break;
			case 'locations':
				this.#contentRenderer.renderLocations(contentArea);
				break;
			case 'npcs':
				this.#contentRenderer.renderNPCs(contentArea);
				break;
			case 'character':
				this.#contentRenderer.renderCharacter(contentArea, this.#selectedCharacterName);
				break;
			case 'session':
			default:
				await this.#contentRenderer.renderSession(contentArea);
				break;
		}
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
