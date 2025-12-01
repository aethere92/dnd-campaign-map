// --- START OF FILE StoryManager.js ---

class StoryManager {
	#rootElement;
	#supabase;
	#storyUrlManager;

	// State
	#campaignId;
	#campaignData;
	#currentSessionId;
	#currentView;
	#selectedCharacterId;
	#currentItemId;
	#isSidebarCollapsed = false;

	// Helpers
	#contentRenderer;
	#sidebarManager;
	#tooltipManager;
	#placeholderProcessor;
	#navigationManager;
	#searchManager;
	#relationshipsRenderer;

	// External callbacks
	campaignManager;
	showCampaignSelection;

	constructor(elementId, options = {}) {
		this.#rootElement = document.getElementById(elementId);
		if (!this.#rootElement) {
			console.error('StoryManager: Root element not found:', elementId);
			return;
		}

		this.#supabase = SupabaseClient.getInstance();
		this.#storyUrlManager = new StoryURLManager();
		this.#campaignId = options.campaignId;

		this.#loadSavedState();
	}

	// ==========================================
	// INITIALIZATION & CONTEXT
	// ==========================================

	async loadContext(campaign, sessionId, characterIdentifier, viewType, itemId) {
		this.#campaignData = campaign;
		this.#campaignId = campaign.id;
		this.#currentItemId = itemId;

		// Resolve View Type
		if (viewType) {
			this.#currentView = viewType;
			this.#selectedCharacterId = null;
			this.#currentSessionId = sessionId;
		} else if (characterIdentifier) {
			this.#currentView = StoryURLManager.VIEW_TYPES.CHARACTER;
			this.#selectedCharacterId = await this.#resolveCharacterId(characterIdentifier);
		} else {
			this.#currentView = StoryURLManager.VIEW_TYPES.SESSION;
			this.#currentSessionId = sessionId;
		}

		// Initialize Helpers if not already done
		if (!this.#sidebarManager) {
			await this.#initializeHelpers();
		}

		await this.render();
	}

	async #resolveCharacterId(identifier) {
		// Simple check if string is UUID
		const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
		if (isUUID) return identifier;

		return identifier;
	}

	async #initializeHelpers() {
		// 1. Fetch "Lite" data for global tools (Sidebar search, tooltips)
		const [chars, npcs, locs, quests, factions] = await Promise.all([
			this.#supabase.getCharacters(this.#campaignId),
			this.#supabase.getNPCs(this.#campaignId),
			this.#supabase.getLocations(this.#campaignId),
			this.#supabase.getQuests(this.#campaignId),
			this.#supabase.getFactions(this.#campaignId),
		]);

		const contextData = {
			campaignId: this.#campaignId,
			characters: chars,
			npcs,
			locations: locs,
			quests,
			factions,
		};

		// 2. Instantiate Helpers
		this.#tooltipManager = new StoryHelperTooltip(contextData, this.#supabase);
		this.#placeholderProcessor = new StoryHelperPlaceholder(this.#tooltipManager, contextData);
		this.#navigationManager = new StoryHelperNavigation();

		this.#searchManager = new StoryHelperSearch(
			() => contextData,
			(nav) => this.#handleSearchNavigation(nav)
		);

		this.#sidebarManager = new StoryHelperSidebar(
			() => this.#campaignData,
			() => this.#currentView,
			() => this.#currentSessionId,
			() => this.#selectedCharacterId,
			(collapsed) => this.#handleSidebarToggle(collapsed),
			(id) => this.#handleCharacterClick(id),
			(id) => this.#handleSessionClick(id),
			// Navigation callbacks
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.TIMELINE),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.QUESTS),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.LOCATIONS),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.NPCS),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.FACTIONS),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.ENCOUNTERS),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.MAP),
			() => this.#handleViewChange(StoryURLManager.VIEW_TYPES.RELATIONSHIPS),
			this.#searchManager,
			this.#supabase
		);

		this.#relationshipsRenderer = new StoryHelperRelationships(this.#campaignData);

		this.#contentRenderer = new StoryHelperContent(this.#placeholderProcessor, this.#supabase, this.#campaignId);
	}

	#loadSavedState() {
		const savedState = localStorage.getItem('story-sidebar-collapsed');
		if (savedState) {
			this.#isSidebarCollapsed = savedState === 'true';
		}
	}

	setCampaignManager(manager, callback) {
		this.campaignManager = manager;
		this.showCampaignSelection = callback;
	}

	// ==========================================
	// MAIN RENDER LOOP
	// ==========================================

	async render() {
		if (!this.#rootElement || !this.#campaignId) return;

		// Clear existing
		this.#rootElement.innerHTML = '';

		// Container
		const container = document.createElement('div');
		container.className = 'story-container';

		const mainContent = document.createElement('div');
		mainContent.className = 'story-main-content';
		if (this.#isSidebarCollapsed) mainContent.classList.add('sidebar-collapsed');

		// Sidebar
		const sidebar = await this.#sidebarManager.createSidebar(this.#isSidebarCollapsed, this.#campaignId);

		// Content Area
		const contentArea = document.createElement('div');
		contentArea.className = 'story-content-area';
		contentArea.innerHTML = '<div class="loader">Loading content...</div>';

		mainContent.append(sidebar, contentArea);
		container.appendChild(mainContent);
		this.#rootElement.appendChild(container);

		// Load Content
		await this.#loadContentArea(contentArea);

		// Post-Load Utilities
		if (this.#currentView === StoryURLManager.VIEW_TYPES.SESSION) {
			this.#generateTableOfContents(contentArea);
			this.#navigationManager.scrollToHash();
		}

		this.#ensureCampaignSelectionButton(sidebar);
	}

	async #loadContentArea(contentArea) {
		contentArea.innerHTML = '';

		// Route to appropriate renderer
		switch (this.#currentView) {
			case StoryURLManager.VIEW_TYPES.SESSION:
				if (this.#currentSessionId) {
					await this.#contentRenderer.renderSession(contentArea, this.#currentSessionId);
				} else {
					contentArea.innerHTML = '<div class="empty-state">No session selected.</div>';
				}
				break;
			case StoryURLManager.VIEW_TYPES.CHARACTER:
				await this.#contentRenderer.renderCharacter(contentArea, this.#selectedCharacterId);
				break;
			case StoryURLManager.VIEW_TYPES.TIMELINE:
				await this.#contentRenderer.renderTimeline(contentArea);
				break;
			case StoryURLManager.VIEW_TYPES.QUESTS:
				await this.#contentRenderer.renderQuests(contentArea);
				break;
			case StoryURLManager.VIEW_TYPES.LOCATIONS:
				await this.#contentRenderer.renderLocations(contentArea);
				break;
			case StoryURLManager.VIEW_TYPES.NPCS:
				await this.#contentRenderer.renderNPCs(contentArea);
				break;
			case StoryURLManager.VIEW_TYPES.FACTIONS:
				await this.#contentRenderer.renderFactions(contentArea);
				break;
			case StoryURLManager.VIEW_TYPES.ENCOUNTERS:
				await this.#contentRenderer.renderEncounters(contentArea);
				break;
			case StoryURLManager.VIEW_TYPES.RELATIONSHIPS:
				await this.#relationshipsRenderer.render(contentArea, this.#campaignId);
				break;
			case StoryURLManager.VIEW_TYPES.MAP:
				// Map is typically handled by CampaignManager overlay, but we provide a placeholder here
				// in case it's embedded. If your Map view is separate, this might remain empty.
				contentArea.innerHTML = '<div class="empty-state">Map View Active</div>';
				break;
			default:
				console.warn(`View type not found: ${this.#currentView}`);
				contentArea.innerHTML = '<p>View not implemented yet.</p>';
		}

		// Handle Deeplinking to specific items
		if (this.#currentItemId) {
			setTimeout(() => {
				const el = document.getElementById(this.#currentItemId);
				if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 100);
		}
	}

	// ==========================================
	// UI UTILITIES
	// ==========================================

	#generateTableOfContents(contentArea) {
		const sessionContent = contentArea.querySelector('.session-main-content') || contentArea;

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

	#ensureCampaignSelectionButton(sidebar) {
		if (!sidebar) return;

		sidebar.querySelector('.story-campaign-selection')?.remove();

		const btnContainer = document.createElement('div');
		btnContainer.className = 'story-campaign-selection';
		btnContainer.style.marginTop = 'auto';
		btnContainer.style.padding = '10px';

		const btn = document.createElement('button');
		btn.textContent = 'Back to Campaigns';
		btn.className = 'sidebar-back-button button-secondary';
		btn.style.width = '100%';
		btn.onclick = () => this.showCampaignSelection();

		btnContainer.appendChild(btn);
		sidebar.appendChild(btnContainer);
	}

	// ==========================================
	// EVENT HANDLERS
	// ==========================================

	#handleSidebarToggle(collapsed) {
		this.#isSidebarCollapsed = collapsed;
		localStorage.setItem('story-sidebar-collapsed', collapsed);
		const main = this.#rootElement.querySelector('.story-main-content');
		if (main) {
			collapsed ? main.classList.add('sidebar-collapsed') : main.classList.remove('sidebar-collapsed');
		}
	}

	#handleCharacterClick(characterId) {
		this.#currentView = StoryURLManager.VIEW_TYPES.CHARACTER;
		this.#selectedCharacterId = characterId;
		this.#updateURL();
		this.render();
	}

	#handleSessionClick(sessionId) {
		this.#currentView = StoryURLManager.VIEW_TYPES.SESSION;
		this.#currentSessionId = sessionId;
		this.#updateURL();
		this.render();
	}

	#handleViewChange(viewType) {
		this.#currentView = viewType;
		this.#selectedCharacterId = null;
		this.#updateURL();
		this.render();
	}

	#handleSearchNavigation(navData) {
		if (navData.view) this.#currentView = navData.view;
		if (navData.id) this.#currentItemId = navData.id;
		if (navData.sessionId) this.#currentSessionId = navData.sessionId;

		this.#updateURL();
		this.render();
	}

	#updateURL() {
		const config = {
			campaign: this.#campaignId,
			view: this.#currentView,
		};

		if (this.#currentView === StoryURLManager.VIEW_TYPES.SESSION) {
			config.session = this.#currentSessionId;
		} else if (this.#currentView === StoryURLManager.VIEW_TYPES.CHARACTER) {
			config.charId = this.#selectedCharacterId;
		}

		const url = this.#storyUrlManager.buildURL(config);
		const state = {
			campaignId: this.#campaignId,
			sessionId: this.#currentView === StoryURLManager.VIEW_TYPES.SESSION ? this.#currentSessionId : null,
			characterId: this.#currentView === StoryURLManager.VIEW_TYPES.CHARACTER ? this.#selectedCharacterId : null,
			viewType: this.#currentView,
		};

		this.#storyUrlManager.updateHistory(url, state, true);
	}
}
