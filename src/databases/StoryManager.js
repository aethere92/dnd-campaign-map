// ===== HELPER: CONTENT RENDERER =====
class StoryHelperContent {
	#placeholderProcessor;
	#getCampaign;
	#getCurrentSessionId;

	constructor(placeholderProcessor, getCampaign, getCurrentSessionId) {
		this.#placeholderProcessor = placeholderProcessor;
		this.#getCampaign = getCampaign;
		this.#getCurrentSessionId = getCurrentSessionId;
	}

	async renderSession(contentArea) {
		const campaign = this.#getCampaign();
		const sessionId = this.#getCurrentSessionId();

		if (!sessionId || !campaign.recaps) {
			contentArea.innerHTML = '<div class="no-content">Select a session to view its content.</div>';
			return;
		}

		const session = campaign.recaps.find((s) => s.id === sessionId);
		if (!session) {
			console.error(`Session not found: ${sessionId}`);
			contentArea.innerHTML = '<div class="no-content">Session not found. Please select another session.</div>';
			return;
		}

		const sessionToc = document.createElement('div');
		sessionToc.className = 'session-toc';
		const toc = document.createElement('div');
		toc.className = 'toc';
		toc.id = 'toc';
		sessionToc.appendChild(toc);
		contentArea.appendChild(sessionToc);

		const sessionContent = document.createElement('div');
		sessionContent.className = 'session-content';

		const header = this.#createSessionHeader(session);
		const recap = await this.#createRecapSection(session);
		const factual = session.factual_recap ? await this.#createFactualSection(session) : null;
		const nameDb = session.name_db ? await this.#createNameDbSection(session) : null;
		const mainContent = await this.#createMainContent(session);

		sessionContent.append(header, recap);
		if (factual) sessionContent.appendChild(factual);
		if (nameDb) sessionContent.appendChild(nameDb);
		sessionContent.appendChild(mainContent);

		contentArea.appendChild(sessionContent);
	}

	#createSessionHeader(session) {
		const header = document.createElement('div');
		header.className = 'session-header';
		header.innerHTML = `
			<h2 id="session-title">${session.title}</h2>
			${session.date ? `<div class="session-date">${session.date}</div>` : ''}
		`;
		return header;
	}

	async #createRecapSection(session) {
		const recap = document.createElement('div');
		recap.className = 'session-small-recap';

		const temp = document.createElement('div');
		temp.innerHTML = `<h3 id="short-summary">Short Summary</h3>${await this.#fetchAndParseMd(session.recap)}`;
		this.#placeholderProcessor.processAll(temp, session);

		recap.appendChild(temp);
		return recap;
	}

	async #createFactualSection(session) {
		const section = document.createElement('div');
		section.className = 'session-factual';

		const header = document.createElement('div');
		header.className = 'session-factual-header';
		header.innerHTML = `
			<h3 id="factual-recap">Factual Recap</h3>
			<button class="factual-toggle" aria-expanded="false" aria-controls="factual-content">
				<span class="toggle-icon">▶</span>
			</button>
		`;

		const content = document.createElement('div');
		content.className = 'session-factual-content';
		content.id = 'factual-content';
		content.style.display = 'none';

		const temp = document.createElement('div');
		temp.innerHTML = await this.#fetchAndParseMd(session.factual_recap);
		this.#placeholderProcessor.processAll(temp, session);
		content.appendChild(temp);

		const toggleBtn = header.querySelector('.factual-toggle');
		toggleBtn.addEventListener('click', () => {
			const isExpanded = content.style.display !== 'none';
			content.style.display = isExpanded ? 'none' : 'block';
			toggleBtn.setAttribute('aria-expanded', !isExpanded);
			toggleBtn.querySelector('.toggle-icon').textContent = isExpanded ? '▶' : '▼';
		});

		section.append(header, content);
		return section;
	}

	async #createNameDbSection(session) {
		const section = document.createElement('div');
		section.className = 'session-factual';

		const header = document.createElement('div');
		header.className = 'session-factual-header';
		header.innerHTML = `
			<h3 id="name-db">Name, Items and Location Database</h3>
			<button class="factual-toggle" aria-expanded="false" aria-controls="name-db-content">
				<span class="toggle-icon">▶</span>
			</button>
		`;

		const content = document.createElement('div');
		content.className = 'session-factual-content';
		content.id = 'name-db-content';
		content.style.display = 'none';

		const temp = document.createElement('div');
		temp.innerHTML = await this.#fetchAndParseMd(session.name_db);
		this.#placeholderProcessor.processAll(temp, session);
		content.appendChild(temp);

		const toggleBtn = header.querySelector('.factual-toggle');
		toggleBtn.addEventListener('click', () => {
			const isExpanded = content.style.display !== 'none';
			content.style.display = isExpanded ? 'none' : 'block';
			toggleBtn.setAttribute('aria-expanded', !isExpanded);
			toggleBtn.querySelector('.toggle-icon').textContent = isExpanded ? '▶' : '▼';
		});

		section.append(header, content);
		return section;
	}

	async #createMainContent(session) {
		const main = document.createElement('div');
		main.className = 'session-main-content';

		const temp = document.createElement('div');
		temp.innerHTML = await this.#fetchAndParseMd(session.content);
		this.#placeholderProcessor.processAll(temp, session);

		main.appendChild(temp);
		return main;
	}

	async #fetchAndParseMd(filePath) {
		if (!filePath || typeof filePath !== 'string' || !filePath.endsWith('.md')) {
			return filePath || '';
		}

		const campaign = this.#getCampaign();
		const basePath = `src/databases/campaign_data/${campaign.id.replace('-', '_')}/`;
		const fullPath = basePath + filePath;

		try {
			const response = await fetch(fullPath);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return await response.text();
		} catch (error) {
			console.error(`Error fetching Markdown file "${fullPath}":`, error);
			return `<div class="error">Error loading content: ${error.message}</div>`;
		}
	}

	renderTimeline(contentArea) {
		const campaign = this.#getCampaign();
		const timelineRenderer = new StoryHelperTimeline(campaign, this.#placeholderProcessor);
		timelineRenderer.render(contentArea);
	}

	renderCharacter(contentArea, characterName) {
		const campaign = this.#getCampaign();
		const characterRenderer = new StoryHelperCharacter(campaign, this.#placeholderProcessor);
		characterRenderer.render(contentArea, characterName);
	}
}

// ===== HELPER: SIDEBAR =====
class StoryHelperSidebar {
	#getCampaign;
	#getCurrentView;
	#getCurrentSessionId;
	#getSelectedCharacterName;
	#onToggle;
	#onCharacterClick;
	#onSessionClick;
	#onTimelineClick;

	constructor(
		getCampaign,
		getCurrentView,
		getCurrentSessionId,
		getSelectedCharacterName,
		onToggle,
		onCharacterClick,
		onSessionClick,
		onTimelineClick
	) {
		this.#getCampaign = getCampaign;
		this.#getCurrentView = getCurrentView;
		this.#getCurrentSessionId = getCurrentSessionId;
		this.#getSelectedCharacterName = getSelectedCharacterName;
		this.#onToggle = onToggle;
		this.#onCharacterClick = onCharacterClick;
		this.#onSessionClick = onSessionClick;
		this.#onTimelineClick = onTimelineClick;
	}

	createSidebar(isCollapsed) {
		const sidebar = document.createElement('div');
		sidebar.className = 'story-sidebar';

		const campaignName = this.#createCampaignHeader();

		sidebar.append(
			campaignName,
			this.#createCharacterSection(),
			this.#createTimelineSection(),
			this.#createSessionList()
		);

		return sidebar;
	}

	#createCampaignHeader() {
		const campaign = this.#getCampaign();
		const header = document.createElement('div');
		header.className = 'story-campaign-name';
		header.innerHTML = `<h3>${campaign.metadata?.name || 'Unnamed Campaign'}</h3>`;
		return header;
	}

	#createCharacterSection() {
		const campaign = this.#getCampaign();
		const characters = campaign.metadata?.characters?.filter((char) => char?.is_included);

		if (!characters?.length) {
			return document.createDocumentFragment();
		}

		const section = document.createElement('div');
		section.className = 'story-characters-section';

		const title = document.createElement('h2');
		title.textContent = 'Characters';

		const list = document.createElement('div');
		list.className = 'story-character-list';

		characters.forEach((character) => {
			const card = document.createElement('div');
			card.className = 'story-character-card';

			if (this.#getCurrentView() === 'character' && this.#getSelectedCharacterName() === character.name) {
				card.classList.add('active');
			}

			card.innerHTML = `
				<div class="character-avatar">
					<img src="${character.icon}" alt="${character.name}" />
				</div>
				<div class="character-info">
					<h3>${character.name}</h3>
				</div>
			`;
			card.title = `Lvl ${character.level} ${character.race} ${character.class}`;

			card.addEventListener('click', () => this.#onCharacterClick(character.name));

			list.appendChild(card);
		});

		section.append(title, list);
		return section;
	}

	#createTimelineSection() {
		const section = document.createElement('div');
		section.className = 'story-timeline-section';

		const title = document.createElement('h2');
		title.textContent = 'Campaign';

		const button = document.createElement('button');
		button.className = 'timeline-button';
		button.textContent = 'View Timeline';

		if (this.#getCurrentView() === 'timeline') {
			button.classList.add('active');
		}

		button.addEventListener('click', () => this.#onTimelineClick());

		section.append(title, button);
		return section;
	}

	#createSessionList() {
		const campaign = this.#getCampaign();
		const recaps = campaign.recaps;

		if (!recaps?.length) {
			const noSessions = document.createElement('div');
			noSessions.className = 'no-sessions';
			noSessions.textContent = 'No sessions available';
			return noSessions;
		}

		const section = document.createElement('div');
		section.className = 'story-sessions-section';

		const title = document.createElement('h2');
		title.textContent = 'Sessions';

		const list = document.createElement('div');
		list.className = 'story-session-list';

		recaps.forEach((session) => {
			const item = document.createElement('div');
			item.className = 'story-session-item';

			if (this.#getCurrentView() === 'session' && session.id === this.#getCurrentSessionId()) {
				item.classList.add('active');
			}

			item.innerHTML = `
				<h3>${session.title}</h3>
				<div class="session-date">${session.date || ''}</div>
			`;

			item.addEventListener('click', () => this.#onSessionClick(session.id));

			list.appendChild(item);
		});

		section.append(title, list);
		return section;
	}
}

// ===== HELPER: NAVIGATION =====
class StoryHelperNavigation {
	scrollToHash() {
		const hash = window.location.hash;
		if (!hash) return;

		try {
			const element = document.getElementById(hash.substring(1));
			if (element) {
				setTimeout(() => {
					element.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}, 100);
			}
		} catch (e) {
			console.warn(`Could not scroll to element: ${hash}`, e);
		}
	}
}

// ===== MAIN STORY MANAGER =====
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
		this.#tooltipManager = new StoryHelperTooltip(options.campaignData?.api_data);
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
			() => this.#handleTimelineClick()
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

		// Process character data for custom API
		if (campaign?.metadata?.characters) {
			const customApiData = this.#tooltipManager.getCustomApiData();
			customApiData.character = customApiData.character || {};

			campaign.metadata.characters.forEach((char) => {
				customApiData.character[char.name] = char;
			});
		}

		this.#campaign = campaign;

		// Determine initial state
		if (viewType === 'timeline') {
			this.#currentView = 'timeline';
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

	#updateURL() {
		const url = new URL(window.location.href);
		const params = url.searchParams;

		params.set('campaign', this.#campaign.id);
		params.delete('map');

		if (this.#currentView === 'timeline') {
			params.set('view', 'timeline');
			params.delete('session');
			params.delete('character');
		} else if (this.#currentView === 'character') {
			params.set('character', this.#selectedCharacterName);
			params.delete('session');
			params.delete('view');
		} else {
			params.set('session', this.#currentSessionId);
			params.delete('character');
			params.delete('view');
		}

		const state = {
			campaignId: this.#campaign.id,
			sessionId: this.#currentView === 'session' ? this.#currentSessionId : null,
			characterName: this.#currentView === 'character' ? this.#selectedCharacterName : null,
			view: 'story',
		};

		window.history.replaceState(state, '', `${url.pathname}?${params.toString()}`);
	}

	async #loadContentArea(contentArea) {
		contentArea.innerHTML = '';

		switch (this.#currentView) {
			case 'timeline':
				this.#contentRenderer.renderTimeline(contentArea);
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

// ===== HELPER: TIMELINE RENDERER =====
class StoryHelperTimeline {
	#campaign;
	#placeholderProcessor;

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
	}

	render(contentArea) {
		const timelineData = this.#campaign?.timeline;

		if (!timelineData?.length) {
			contentArea.innerHTML = `
				<div class="story-timeline-container visible">
					<div class="timeline-header"><h2>Campaign Timeline</h2></div>
					<div class="no-content">Timeline data not available for this campaign.</div>
				</div>
			`;
			return;
		}

		const container = document.createElement('div');
		container.className = 'story-timeline-container visible';

		const header = this.#createHeader();
		const timeline = this.#createTimeline(timelineData);

		container.append(header, timeline);
		contentArea.appendChild(container);

		this.#placeholderProcessor.processTimelinePlaceholders(container);
	}

	#createHeader() {
		const header = document.createElement('div');
		header.className = 'timeline-header';
		header.innerHTML = '<h2>Campaign Timeline</h2>';

		const toggleButton = document.createElement('button');
		toggleButton.className = 'timeline-toggle-all-button';
		toggleButton.textContent = 'Toggle descriptions';
		toggleButton.type = 'button';

		toggleButton.addEventListener('click', (e) => {
			const container = e.target.closest('.story-timeline-container');
			const descriptions = container.querySelectorAll('.timeline-main-description, .timeline-sub-description');
			const anyActive = Array.from(descriptions).some((desc) => desc.classList.contains('active'));

			descriptions.forEach((desc) => desc.classList.remove('active'));

			if (!anyActive) {
				setTimeout(() => {
					descriptions.forEach((desc) => desc.classList.add('active'));
				}, 50);
			}
		});

		header.appendChild(toggleButton);
		return header;
	}

	#createTimeline(timelineData) {
		const timeline = document.createElement('div');
		timeline.className = 'timeline';

		const typeMap = {
			narrative: '💬',
			encounter: '⚔️',
			investigation: '🔎',
			traversal: '👣',
		};

		let side = 'left';

		timelineData.forEach((item) => {
			const mainItem = this.#createMainItem(item, side);
			timeline.appendChild(mainItem);

			if (item.items?.length) {
				item.items.forEach((subitem) => {
					const subitemEl = this.#createSubItem(subitem, item.id, side, typeMap);
					timeline.appendChild(subitemEl);
				});
			}

			side = side === 'left' ? 'right' : 'left';
		});

		return timeline;
	}

	#createMainItem(item, side) {
		const mainItem = document.createElement('div');
		mainItem.className = `timeline-item timeline-main-item ${side}`;
		mainItem.setAttribute('data-id', item.id);

		const mainContent = document.createElement('div');
		mainContent.className = 'timeline-content';
		mainContent.innerHTML = `
			<h3>${item.title}</h3>
			<div class="timeline-location" style="margin-left: auto">${item.location}</div>
			${item.is_new_session ? '<div class="timeline-new-session">New session</div>' : ''}
			${item.session ? `<span class="timeline-item-session">Session ${item.session}</span>` : ''}
		`;

		if (item.url) {
			const link = document.createElement('a');
			link.href = `?campaign=${item.url.campaign}&session=${item.url.session}${
				item.url.target ? `#${item.url.target}` : ''
			}`;
			link.title = 'Go to this session recap point.';
			link.appendChild(mainContent);
			mainItem.appendChild(link);
		} else {
			mainItem.appendChild(mainContent);
		}

		if (item.description) {
			const button = document.createElement('button');
			button.className = 'timeline-main-button';
			button.textContent = '›';
			button.type = 'button';

			const description = document.createElement('div');
			description.className = 'timeline-main-description';
			description.innerHTML = item.description;

			button.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				description.classList.toggle('active');
			};

			mainItem.append(button, description);
		}

		return mainItem;
	}

	#createSubItem(subitem, parentId, side, typeMap) {
		const subitemEl = document.createElement('div');
		subitemEl.className = `timeline-item timeline-subitem ${side}`;
		subitemEl.setAttribute('data-parent-id', parentId);
		subitemEl.setAttribute('data-type', subitem.type);

		const subContent = document.createElement('div');
		subContent.className = 'timeline-content';

		let html = `
			<h4>
				<span style="font-size: 8pt">${typeMap[subitem.type] || '❓'}</span>
				${subitem.type.charAt(0).toUpperCase() + subitem.type.slice(1)}: ${subitem.actors}
			</h4>
		`;

		if (subitem.is_new_session) {
			subitemEl.classList.add('new-session-indicator');
			html += '<div class="timeline-new-session">New session</div>';
		}

		if (subitem.sublocation) {
			html += `<div class="timeline-sublocation">${subitem.sublocation}</div>`;
		}

		subContent.innerHTML = html;

		if (subitem.url) {
			const link = document.createElement('a');
			link.href = `?campaign=${subitem.url.campaign}&session=${subitem.url.session}${
				subitem.url.target ? `#${subitem.url.target}` : ''
			}`;
			link.title = 'Go to this session recap point.';
			link.appendChild(subContent);
			subitemEl.appendChild(link);
		} else {
			subitemEl.appendChild(subContent);
		}

		if (subitem.description) {
			const button = document.createElement('button');
			button.className = 'timeline-sub-button';
			button.textContent = '›';
			button.type = 'button';

			const description = document.createElement('div');
			description.className = 'timeline-sub-description';
			description.innerHTML = subitem.description;

			button.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				description.classList.toggle('active');
			};

			subitemEl.append(button, description);
		}

		return subitemEl;
	}
}

// ===== HELPER: CHARACTER RENDERER =====
class StoryHelperCharacter {
	#campaign;
	#placeholderProcessor;

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
	}

	render(contentArea, characterName) {
		if (!characterName) {
			contentArea.innerHTML = '<div class="no-content">No character selected.</div>';
			return;
		}

		if (!this.#campaign.metadata?.characters) {
			contentArea.innerHTML = '<div class="no-content">Character information not available for this campaign.</div>';
			return;
		}

		const character = this.#campaign.metadata.characters.find((c) => c.name === characterName);
		if (!character) {
			console.error(`Character not found: ${characterName}`);
			contentArea.innerHTML = '<div class="no-content">Character details not found.</div>';
			return;
		}

		const sheet = document.createElement('div');
		sheet.className = 'character-sheet';

		const header = this.#createHeader(character);
		const columns = this.#createColumns(character);

		sheet.append(header, columns);
		contentArea.appendChild(sheet);
	}

	#createHeader(character) {
		const header = document.createElement('header');
		header.className = 'character-header';

		const title = document.createElement('h1');
		title.className = 'character-title';
		title.textContent = character.name;

		const subtitle = document.createElement('h2');
		subtitle.className = 'character-subtitle';
		subtitle.textContent = `${character.race} ${character.class} • Level ${character.level}`;

		header.append(title, subtitle);
		return header;
	}

	#createColumns(character) {
		const container = document.createElement('div');
		container.className = 'character-columns';

		const leftColumn = this.#createLeftColumn(character);
		const rightColumn = this.#createRightColumn(character);

		container.append(leftColumn, rightColumn);
		return container;
	}

	#createLeftColumn(character) {
		const column = document.createElement('div');
		column.className = 'character-column character-column--left';

		if (character.imageBg) {
			const portrait = document.createElement('div');
			portrait.className = 'character-portrait';

			const img = document.createElement('img');
			img.src = character.imageBg;
			img.alt = `${character.name} portrait`;
			img.className = 'character-portrait__image';

			portrait.appendChild(img);
			column.appendChild(portrait);
		}

		if (character.background) {
			const section = this.#createBackgroundSection(character.background);
			column.appendChild(section);
		}

		if (character.stats?.metadata?.spellData?.length) {
			const spells = this.#createSpellsSection(character.stats.metadata.spellData);
			column.appendChild(spells);
		}

		return column;
	}

	#createBackgroundSection(background) {
		const section = document.createElement('section');
		section.className = 'character-section character-background';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Background';

		const content = document.createElement('div');
		content.className = 'character-section__content';
		content.innerHTML = background;
		this.#placeholderProcessor.processEntityReferences(content);

		section.append(header, content);
		return section;
	}

	#createRightColumn(character) {
		const column = document.createElement('div');
		column.className = 'character-column character-column--right';

		const metadata = character.stats?.metadata;
		if (!metadata) return column;

		if (metadata.armorClass || metadata.healthPoints || metadata.walkingSpeed) {
			column.appendChild(this.#createVitalsSection(metadata));
		}

		if (metadata.abilityScores?.length) {
			column.appendChild(this.#createAbilitiesSection(metadata.abilityScores));
		}

		if (metadata.savingThrows?.length) {
			column.appendChild(this.#createSavingThrowsSection(metadata.savingThrows));
		}

		if (metadata.actionData?.length) {
			column.appendChild(this.#createActionsSection(metadata.actionData));
		}

		if (metadata.features?.length) {
			column.appendChild(this.#createFeaturesSection(metadata.features));
		}

		return column;
	}

	#createVitalsSection(metadata) {
		const section = document.createElement('section');
		section.className = 'character-section character-vitals';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Vital Statistics';

		const grid = document.createElement('div');
		grid.className = 'character-vitals__grid';

		const vitals = [
			{ name: 'Armor Class', value: metadata.armorClass || '-', class: 'ac' },
			{ name: 'Hit Points', value: metadata.healthPoints || '-', class: 'hp' },
			{ name: 'Speed', value: metadata.walkingSpeed || '-', class: 'speed' },
		];

		vitals.forEach((vital) => {
			const item = document.createElement('div');
			item.className = `character-vitals__item character-vitals__item--${vital.class}`;
			item.innerHTML = `
				<span class="character-vitals__label">${vital.name}</span>
				<span class="character-vitals__value">${vital.value}</span>
			`;
			grid.appendChild(item);
		});

		section.append(header, grid);
		return section;
	}

	#createAbilitiesSection(abilityScores) {
		const section = document.createElement('section');
		section.className = 'character-section character-abilities';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Ability Scores';

		const grid = document.createElement('div');
		grid.className = 'character-abilities__grid';

		abilityScores.forEach((ability) => {
			const item = document.createElement('div');
			item.className = 'character-abilities__item';
			item.innerHTML = `
				<div class="character-abilities__name">${ability.abbr.toUpperCase()}</div>
				<div class="character-abilities__value">${ability.value}</div>
				<div class="character-abilities__modifier">(${ability.score})</div>
			`;
			grid.appendChild(item);
		});

		section.append(header, grid);
		return section;
	}

	#createSavingThrowsSection(savingThrows) {
		const section = document.createElement('section');
		section.className = 'character-section character-saves';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Saving Throws';

		const list = document.createElement('div');
		list.className = 'character-saves__list';

		savingThrows.forEach((save) => {
			const item = document.createElement('div');
			item.className = 'character-saves__item';
			item.innerHTML = `
				<span class="character-saves__name">${save.name.toUpperCase()}</span>
				<span class="character-saves__value">${save.value}</span>
			`;
			list.appendChild(item);
		});

		section.append(header, list);
		return section;
	}

	#createActionsSection(actions) {
		const section = document.createElement('section');
		section.className = 'character-section character-actions';

		const headerRow = document.createElement('div');
		headerRow.className = 'character-section__header-row';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Actions';
		headerRow.appendChild(header);

		if (actions.some((action) => action.description)) {
			const toggleAll = document.createElement('button');
			toggleAll.className = 'character-section__toggle-all';
			toggleAll.textContent = 'Toggle All';
			toggleAll.addEventListener('click', () => {
				const descriptions = section.querySelectorAll('.character-actions__description');
				const anyVisible = Array.from(descriptions).some((d) => d.style.display !== 'none');

				descriptions.forEach((desc) => (desc.style.display = anyVisible ? 'none' : 'block'));
				section.querySelectorAll('.character-actions__toggle').forEach((btn) => {
					btn.textContent = anyVisible ? 'Show' : 'Hide';
				});
			});
			headerRow.appendChild(toggleAll);
		}

		section.appendChild(headerRow);

		const list = document.createElement('div');
		list.className = 'character-actions__list';

		actions.forEach((action) => {
			const item = this.#createActionItem(action);
			list.appendChild(item);
		});

		section.appendChild(list);
		return section;
	}

	#createActionItem(action) {
		const item = document.createElement('div');
		item.className = 'character-actions__item';

		const nameRow = document.createElement('div');
		nameRow.className = 'character-actions__name-row';

		const name = document.createElement('h4');
		name.className = 'character-actions__name';
		name.textContent = action.name;
		nameRow.appendChild(name);

		if (action.description) {
			const toggle = document.createElement('button');
			toggle.className = 'character-actions__toggle';
			toggle.textContent = 'Show';

			const desc = document.createElement('div');
			desc.className = 'character-actions__description';
			desc.innerHTML = action.description;
			desc.style.display = 'none';
			this.#placeholderProcessor.processEntityReferences(desc);

			toggle.addEventListener('click', () => {
				const isVisible = desc.style.display !== 'none';
				desc.style.display = isVisible ? 'none' : 'block';
				toggle.textContent = isVisible ? 'Show' : 'Hide';
			});

			nameRow.appendChild(toggle);
			item.append(nameRow, desc);
		} else {
			item.appendChild(nameRow);
		}

		return item;
	}

	#createFeaturesSection(features) {
		const section = document.createElement('section');
		section.className = 'character-section character-features';

		const headerRow = document.createElement('div');
		headerRow.className = 'character-section__header-row';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Features & Traits';
		headerRow.appendChild(header);

		if (features.some((feature) => feature.description)) {
			const toggleAll = document.createElement('button');
			toggleAll.className = 'character-section__toggle-all';
			toggleAll.textContent = 'Toggle All';
			toggleAll.addEventListener('click', () => {
				const descriptions = section.querySelectorAll('.character-features__description');
				const anyVisible = Array.from(descriptions).some((d) => d.style.display !== 'none');

				descriptions.forEach((desc) => (desc.style.display = anyVisible ? 'none' : 'block'));
				section.querySelectorAll('.character-features__toggle').forEach((btn) => {
					btn.textContent = anyVisible ? 'Show' : 'Hide';
				});
			});
			headerRow.appendChild(toggleAll);
		}

		section.appendChild(headerRow);

		const list = document.createElement('div');
		list.className = 'character-features__list';

		features.forEach((feature) => {
			const item = this.#createFeatureItem(feature);
			list.appendChild(item);
		});

		section.appendChild(list);
		return section;
	}

	#createFeatureItem(feature) {
		const item = document.createElement('div');
		item.className = 'character-features__item';

		const nameRow = document.createElement('div');
		nameRow.className = 'character-features__name-row';

		const name = document.createElement('h4');
		name.className = 'character-features__name';
		name.textContent = feature.name;
		nameRow.appendChild(name);

		if (feature.description) {
			const toggle = document.createElement('button');
			toggle.className = 'character-features__toggle';
			toggle.textContent = 'Show';

			const desc = document.createElement('div');
			desc.className = 'character-features__description';
			desc.innerHTML = feature.description;
			desc.style.display = 'none';
			this.#placeholderProcessor.processEntityReferences(desc);

			toggle.addEventListener('click', () => {
				const isVisible = desc.style.display !== 'none';
				desc.style.display = isVisible ? 'none' : 'block';
				toggle.textContent = isVisible ? 'Show' : 'Hide';
			});

			nameRow.appendChild(toggle);
			item.append(nameRow, desc);
		} else {
			item.appendChild(nameRow);
		}

		return item;
	}

	#createSpellsSection(spellData) {
		const section = document.createElement('section');
		section.className = 'character-section character-spells';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Spells';

		section.appendChild(header);

		spellData.forEach((group) => {
			const groupContainer = this.#createSpellGroup(group);
			section.appendChild(groupContainer);
		});

		return section;
	}

	#createSpellGroup(group) {
		const container = document.createElement('div');
		container.className = 'character-spells__group';

		const headerRow = document.createElement('div');
		headerRow.className = 'character-spells__group-header-row';

		const header = document.createElement('h4');
		header.className = 'character-spells__group-header';
		header.textContent = group.groupName;
		headerRow.appendChild(header);

		const list = document.createElement('div');
		list.className = 'character-spells__list';

		if (group.spells.length > 0) {
			const toggle = document.createElement('button');
			toggle.className = 'character-spells__group-toggle';
			toggle.textContent = 'Hide spells';
			toggle.addEventListener('click', () => {
				const isVisible = list.style.display !== 'none';
				list.style.display = isVisible ? 'none' : 'flex';
				toggle.textContent = isVisible ? 'Show spells' : 'Hide spells';
			});
			headerRow.appendChild(toggle);
		}

		container.appendChild(headerRow);

		group.spells.forEach((spell) => {
			const item = this.#createSpellItem(spell);
			list.appendChild(item);
		});

		container.appendChild(list);
		return container;
	}

	#createSpellItem(spell) {
		const item = document.createElement('div');
		item.className = 'character-spells__item';

		const name = document.createElement('div');
		name.className = 'character-spells__name';
		name.innerHTML = `[ENTITY:spell:${spell.spellInfo.spellName}]`;
		this.#placeholderProcessor.processEntityReferences(name);

		const meta = document.createElement('div');
		meta.className = 'character-spells__meta';

		const range = document.createElement('span');
		range.className = 'character-spells__range';
		range.textContent = spell.range;

		const slot = document.createElement('span');
		slot.className = 'character-spells__slot';
		slot.textContent = spell.slotType;

		const effect = document.createElement('span');
		effect.className = 'character-spells__effect';
		effect.textContent = spell.effect;

		meta.append(range, slot, effect);

		if (spell.spellInfo.spellMetaInfo) {
			const note = document.createElement('div');
			note.className = 'character-spells__note';
			note.textContent = spell.spellInfo.spellMetaInfo;
			meta.appendChild(note);
		}

		item.append(name, meta);
		return item;
	}
}

// ===== HELPER: PLACEHOLDER PROCESSOR =====
class StoryHelperPlaceholder {
	#tooltipManager;
	#campaign;

	constructor(tooltipManager, campaign) {
		this.#tooltipManager = tooltipManager;
		this.#campaign = campaign;
	}

	processAll(contentElement, session = null) {
		this.#processImages(contentElement);
		this.#processCharacterReferences(contentElement);
		this.processEntityReferences(contentElement);

		if (session) {
			this.#processProgressionTags(contentElement, session);
		}

		this.#processCharacterHighlights(contentElement);
	}

	processTimelinePlaceholders(timelineContainer) {
		const timelineItems = timelineContainer.querySelectorAll('.timeline-item');

		timelineItems.forEach((item) => {
			const contentElements = item.querySelectorAll(
				'.timeline-content, .timeline-sub-description, .timeline-main-description'
			);

			contentElements.forEach((element) => {
				this.#processImages(element);
				this.#processCharacterReferences(element);
				this.processEntityReferences(element);

				if (item.classList.contains('timeline-main-item')) {
					const itemId = item.getAttribute('data-id');
					const timelineData = this.#campaign?.timeline;

					if (timelineData?.length) {
						const itemData = timelineData.find((data) => data.id === itemId);
						if (itemData) {
							this.#processProgressionTags(element, itemData);
						}
					}
				}

				this.#processCharacterHighlights(element);
			});
		});
	}

	processEntityReferences(contentElement) {
		const text = contentElement.innerHTML;
		const processedText = text.replace(
			/\[ENTITY:([\w-]+):([^:\]]+)(?::([^\]]+))?\]/gi,
			(match, type, name, givenName) => {
				const cleanType = type.toLowerCase().trim();
				const cleanName = name.trim();

				if (!cleanType || !cleanName) return match;

				const displayText = givenName ? givenName.trim() : cleanName;
				return `<span class="entity-reference entity-${cleanType}" data-entity-type="${cleanType}" data-entity-name="${cleanName}">${displayText}</span>`;
			}
		);

		contentElement.innerHTML = processedText;

		const entitySpans = contentElement.querySelectorAll('.entity-reference');
		entitySpans.forEach((span) => {
			const entityType = span.getAttribute('data-entity-type');
			const entityName = span.getAttribute('data-entity-name');

			if (entityType && entityName) {
				this.#tooltipManager.addEntityTooltipEvents(span, entityType, entityName);
			}
		});
	}

	#processImages(contentElement) {
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

		const characterNames = this.#campaign.metadata.characters
			.map((char) => char.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
			.join('|');

		if (!characterNames) return;

		const characterRegex = new RegExp(`\\[CHARACTER:(${characterNames})\\]`, 'g');
		const textNodes = this.#getTextNodes(contentElement);

		textNodes.forEach((textNode) => {
			const text = textNode.nodeValue;
			if (!characterRegex.test(text)) return;

			const fragment = document.createDocumentFragment();
			let lastIndex = 0;
			characterRegex.lastIndex = 0;

			let match;
			while ((match = characterRegex.exec(text)) !== null) {
				if (match.index > lastIndex) {
					fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
				}

				const span = document.createElement('span');
				span.className = 'character-highlight';
				span.setAttribute('data-character', match[1]);
				span.textContent = match[1];
				fragment.appendChild(span);

				lastIndex = characterRegex.lastIndex;
			}

			if (lastIndex < text.length) {
				fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
			}

			textNode.parentNode.replaceChild(fragment, textNode);
		});
	}

	#processCharacterHighlights(contentElement) {
		if (!this.#campaign.metadata?.characters?.length) return;

		const characterMap = new Map();
		this.#campaign.metadata.characters.forEach((char) => {
			characterMap.set(char.name, char);
		});

		const spans = contentElement.querySelectorAll('span.character-highlight');
		spans.forEach((span) => {
			const characterName = span.getAttribute('data-character');
			const character = characterMap.get(characterName);

			if (character) {
				span.textContent = characterName;
				this.#tooltipManager.addCharacterTooltipEvents(span, character);
			}
		});
	}

	#processProgressionTags(contentElement, session) {
		const progressionRegex = /\[PROGRESSION:(levelup|loot):(.*?)\]/g;
		const textNodes = this.#getTextNodes(contentElement);

		textNodes.forEach((node) => {
			const text = node.nodeValue;
			if (!progressionRegex.test(text)) return;

			const fragment = document.createDocumentFragment();
			let lastIndex = 0;
			progressionRegex.lastIndex = 0;

			let match;
			while ((match = progressionRegex.exec(text)) !== null) {
				if (match.index > lastIndex) {
					fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
				}

				const type = match[1];
				const value = match[2];
				let replacementNode = null;

				if (type === 'levelup') {
					replacementNode = this.#createLevelUpElement(value);
				} else if (type === 'loot') {
					replacementNode = this.#createLootElement(value, session);
				}

				if (replacementNode) {
					fragment.appendChild(replacementNode);
				}

				lastIndex = progressionRegex.lastIndex;
			}

			if (lastIndex < text.length) {
				fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
			}

			node.parentNode.replaceChild(fragment, node);
		});
	}

	#createLevelUpElement(level) {
		const div = document.createElement('div');
		div.className = 'progression-levelup';
		div.innerHTML = `
			<div class="levelup-icon">
				<img src="images/assets/d20.png"/>
			</div>
			<div class="levelup-text">
				<span>Level Up!</span>
				<p>Congratulations! The party has reached level <strong>${level}</strong>!</p>
			</div>
		`;
		return div;
	}

	#createLootElement(lootId, session) {
		const container = document.createElement('div');
		container.className = 'progression-loot';

		const lootData = session?.progression?.loot?.find((l) => l.id === lootId);
		if (!lootData?.data?.length) {
			container.innerHTML = '<p><em>Loot information not found.</em></p>';
			return container;
		}

		const title = document.createElement('span');
		title.textContent = 'Loot found';
		title.className = 'progression-loot-title';
		container.appendChild(title);

		const list = document.createElement('ul');
		list.className = 'loot-list';

		lootData.data.forEach((item) => {
			const listItem = document.createElement('li');
			listItem.className = `loot-item rarity-${item.rarity || 'common'}`;

			const ownerText = item.owner ? ` <span class="loot-owner">[ENTITY:character:${item.owner}]</span>` : '';

			const itemNameSpan = document.createElement('span');
			itemNameSpan.className = 'loot-item-name';
			itemNameSpan.innerHTML = `${item.itemName}${item.count > 1 ? ` (x${item.count})` : ''}`;

			listItem.innerHTML = `
				<div class="loot-item-metadata">
					${itemNameSpan.outerHTML}
					${item.description ? `<span class="loot-item-description">${item.description}</span>` : ''}
				</div>
				${ownerText}
			`;

			this.processEntityReferences(listItem);

			if (item.description) {
				const descDiv = listItem.querySelector('.loot-item-description');
				if (descDiv) this.processEntityReferences(descDiv);
			}

			list.appendChild(listItem);
		});

		container.appendChild(list);
		return container;
	}

	#getTextNodes(element) {
		const textNodes = [];
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);

		let node;
		while ((node = walker.nextNode())) {
			textNodes.push(node);
		}

		return textNodes;
	}
}

// ===== HELPER: TOOLTIP MANAGER =====
class StoryHelperTooltip {
	#tooltipContainer;
	#customApiData;
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
		npc: 'npc',
	};

	constructor(customApiData = {}) {
		this.#customApiData = customApiData || {};
		this.#createTooltipContainer();
	}

	getCustomApiData() {
		return this.#customApiData;
	}

	#createTooltipContainer() {
		this.#tooltipContainer = document.getElementById('character-tooltip-container');

		if (!this.#tooltipContainer) {
			this.#tooltipContainer = document.createElement('div');
			this.#tooltipContainer.id = 'character-tooltip-container';
			this.#tooltipContainer.className = 'character-tooltip-container';
			Object.assign(this.#tooltipContainer.style, {
				position: 'absolute',
				zIndex: '1000',
				display: 'none',
			});
			document.body.appendChild(this.#tooltipContainer);
		}
	}

	addCharacterTooltipEvents(element, character) {
		element.addEventListener('mouseover', (e) => {
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
			this.#positionTooltip(element);
		});

		element.addEventListener('mouseout', () => {
			this.#tooltipContainer.style.display = 'none';
		});
	}

	addEntityTooltipEvents(element, entityType, entityName) {
		element.classList.add('entity-' + entityType);

		element.addEventListener('mouseover', async (e) => {
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

			this.#tooltipContainer.style.display = 'block';
			this.#positionTooltip(element);

			try {
				const entityData = await this.#fetchEntityData(entityType, entityName);

				if (entityData) {
					this.#tooltipContainer.innerHTML = this.#generateEntityTooltipContent(entityType, entityData);
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
				console.error('Error fetching entity data:', error);
			}
		});

		element.addEventListener('mouseout', () => {
			this.#tooltipContainer.style.display = 'none';
		});
	}

	#positionTooltip(element) {
		Object.assign(this.#tooltipContainer.style, {
			visibility: 'hidden',
			display: 'block',
			top: '-9999px',
			left: '-9999px',
		});

		const elementRect = element.getBoundingClientRect();
		const tooltipRect = this.#tooltipContainer.getBoundingClientRect();
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
			scrollX: window.scrollX,
			scrollY: window.scrollY,
		};

		const space = {
			above: elementRect.top,
			below: viewport.height - elementRect.bottom,
			left: elementRect.left,
			right: viewport.width - elementRect.right,
		};

		let position = 'below';
		let horizontalAlign = 'left';
		let verticalAlign = 'top';

		if (space.below >= tooltipRect.height) {
			position = 'below';
		} else if (space.above >= tooltipRect.height) {
			position = 'above';
		} else if (space.right >= tooltipRect.width) {
			position = 'right';
		} else if (space.left >= tooltipRect.width) {
			position = 'left';
		}

		if (position === 'below' || position === 'above') {
			horizontalAlign = elementRect.left + tooltipRect.width > viewport.width - 10 ? 'right' : 'left';
		}

		if (position === 'left' || position === 'right') {
			verticalAlign = elementRect.top + tooltipRect.height > viewport.height - 10 ? 'bottom' : 'top';
		}

		const buffer = 8;
		let coords = { top: 0, left: 0 };

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

		coords.left = Math.max(
			viewport.scrollX + 10,
			Math.min(coords.left, viewport.scrollX + viewport.width - tooltipRect.width - 10)
		);
		coords.top = Math.max(
			viewport.scrollY + 10,
			Math.min(coords.top, viewport.scrollY + viewport.height - tooltipRect.height - 10)
		);

		Object.assign(this.#tooltipContainer.style, {
			top: `${coords.top}px`,
			left: `${coords.left}px`,
			visibility: 'visible',
		});
	}

	async #fetchEntityData(entityType, entityName) {
		if (this.#customApiData[entityType]?.[entityName]) {
			return this.#customApiData[entityType][entityName];
		}

		if (this.#supportedEntityTypes.includes(entityType)) {
			const formattedName = entityName.toLowerCase().replace(/\s+/g, '-');

			try {
				const response = await fetch(`${this.#apiBaseUrl}${this.#entityEndpoints[entityType]}/${formattedName}`);

				if (response.ok) {
					return await response.json();
				}

				const searchResponse = await fetch(
					`${this.#apiBaseUrl}${this.#entityEndpoints[entityType]}?name=${encodeURIComponent(entityName)}`
				);

				if (searchResponse.ok) {
					const searchData = await searchResponse.json();

					if (searchData.results?.length > 0) {
						const detailResponse = await fetch(`${this.#apiBaseUrl}${searchData.results[0].url}`);
						if (detailResponse.ok) {
							return await detailResponse.json();
						}
					}
				}

				return null;
			} catch (error) {
				console.error(`Error fetching ${entityType} data for ${entityName}:`, error);
				throw error;
			}
		}

		return null;
	}

	#generateEntityTooltipContent(entityType, entityData) {
		let content = `
			<div class="entity-tooltip entity-${entityType}-tooltip">
				<div class="tooltip-header">
					${entityType === 'character' ? `<img src="${entityData.icon}" alt="${entityData.name}" />` : ''}
					<h3>${entityData.name || entityData.title || entityData.spellName || 'Unknown'}</h3>
				</div>
				<div class="tooltip-content">
		`;

		switch (entityType) {
			case 'spell':
				content += `
					<div><strong>Level:</strong> ${entityData.level || 'Cantrip'}</div>
					<div><strong>School:</strong> ${
						entityData.spellClass
							? entityData.spellClass.charAt(0).toUpperCase() + entityData.spellClass.slice(1)
							: 'Unknown'
					}</div>
					<div><strong>Casting Time:</strong> ${entityData.castingTime || 'N/A'}</div>
					<div><strong>Range:</strong> ${entityData.range || 'N/A'}</div>
					<div><strong>Components:</strong> ${entityData.components || 'None'}</div>
					<div><strong>Duration:</strong> ${entityData.duration || 'Instantaneous'}</div>
					<div><strong>Classes:</strong> ${entityData.classes?.join(', ') || 'N/A'}</div>
					<div><strong>Source:</strong> ${entityData.source || 'Unknown'}</div>
					<div class="tooltip-description tooltip-background">${entityData.description || 'No description available.'}</div>
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

			case 'location':
			case 'guild':
			case 'race':
				content += `
					${
						entityData?.metadata
							? Object.entries(entityData.metadata)
									.map(([key, entry]) => `<div class="tooltip-metadata"><span>${key}</span><span>${entry}</span></div>`)
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
							  Object.entries(entityData.stats.abilityScores)
									.map(
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
					<div><strong>Class:</strong> ${entityData.class || 'Unknown'}</div>
					<div><strong>Affinity:</strong> ${entityData.affinity || 'Unknown'}</div>
					<div><strong>Role:</strong> ${entityData.role || 'Unknown'}</div>
				`;
				break;

			default:
				content += `
					<div class="tooltip-description tooltip-background">${
						entityData.desc || entityData.description || JSON.stringify(entityData)
					}</div>
				`;
		}

		content += '</div></div>';
		return content;
	}
}
