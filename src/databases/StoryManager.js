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
	#onQuestsClick;
	#onLocationsClick;
	#onNPCsClick;

	// Sidebar section toggle states
	#sectionStates = {
		characters: true,
		campaignTools: true,
		sessions: true,
	};

	constructor(
		getCampaign,
		getCurrentView,
		getCurrentSessionId,
		getSelectedCharacterName,
		onToggle,
		onCharacterClick,
		onSessionClick,
		onTimelineClick,
		onQuestsClick,
		onLocationsClick,
		onNPCsClick
	) {
		this.#getCampaign = getCampaign;
		this.#getCurrentView = getCurrentView;
		this.#getCurrentSessionId = getCurrentSessionId;
		this.#getSelectedCharacterName = getSelectedCharacterName;
		this.#onToggle = onToggle;
		this.#onCharacterClick = onCharacterClick;
		this.#onSessionClick = onSessionClick;
		this.#onTimelineClick = onTimelineClick;
		this.#onQuestsClick = onQuestsClick;
		this.#onLocationsClick = onLocationsClick;
		this.#onNPCsClick = onNPCsClick;

		// Load saved section states
		this.#loadSectionStates();
	}

	createSidebar(isCollapsed) {
		const sidebar = document.createElement('div');
		sidebar.className = 'story-sidebar';

		const campaignName = this.#createCampaignHeader();

		sidebar.append(
			campaignName,
			this.#createCharacterSection(),
			this.#createCampaignToolsSection(),
			this.#createSessionSection()
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
		section.className = 'story-sidebar-section';

		const header = this.#createSectionHeader('Characters', 'characters', this.#sectionStates.characters);

		const content = document.createElement('div');
		content.className = 'story-sidebar-section-content';
		content.style.display = this.#sectionStates.characters ? 'block' : 'none';

		const list = document.createElement('div');
		list.className = 'story-character-list';

		characters.forEach((character) => {
			const card = this.#createCharacterCard(character);
			list.appendChild(card);
		});

		content.appendChild(list);
		section.append(header, content);
		return section;
	}

	#createCharacterCard(character) {
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

		return card;
	}

	#createCampaignToolsSection() {
		const section = document.createElement('div');
		section.className = 'story-sidebar-section';

		const header = this.#createSectionHeader('Campaign', 'campaignTools', this.#sectionStates.campaignTools);

		const content = document.createElement('div');
		content.className = 'story-sidebar-section-content';
		content.style.display = this.#sectionStates.campaignTools ? 'block' : 'none';

		const toolsList = document.createElement('div');
		toolsList.className = 'story-campaign-tools-list';

		// Timeline button
		const timelineBtn = this.#createToolButton('Timeline', 'timeline');
		toolsList.appendChild(timelineBtn);

		// Quests button
		const campaign = this.#getCampaign();
		if (campaign?.quests?.length) {
			const questsBtn = this.#createToolButton('Quests', 'quests');
			toolsList.appendChild(questsBtn);
		}

		// Locations button
		if (campaign?.locations?.length) {
			const locationsBtn = this.#createToolButton('Locations', 'locations');
			toolsList.appendChild(locationsBtn);
		}

		// NPCs button
		if (campaign?.npcs?.length) {
			const npcsBtn = this.#createToolButton('NPCs', 'npcs');
			toolsList.appendChild(npcsBtn);
		}

		content.appendChild(toolsList);
		section.append(header, content);
		return section;
	}

	#createToolButton(text, viewType) {
		const button = document.createElement('button');
		button.className = 'campaign-tool-button';
		button.textContent = text;

		if (this.#getCurrentView() === viewType) {
			button.classList.add('active');
		}

		button.addEventListener('click', () => {
			switch (viewType) {
				case 'timeline':
					this.#onTimelineClick();
					break;
				case 'quests':
					this.#onQuestsClick();
					break;
				case 'locations':
					this.#onLocationsClick();
					break;
				case 'npcs':
					this.#onNPCsClick();
					break;
			}
		});

		return button;
	}

	#createSessionSection() {
		const campaign = this.#getCampaign();
		const recaps = campaign.recaps;

		const section = document.createElement('div');
		section.className = 'story-sidebar-section';

		const header = this.#createSectionHeader('Sessions', 'sessions', this.#sectionStates.sessions);

		const content = document.createElement('div');
		content.className = 'story-sidebar-section-content';
		content.style.display = this.#sectionStates.sessions ? 'block' : 'none';

		if (!recaps?.length) {
			const noSessions = document.createElement('div');
			noSessions.className = 'no-sessions';
			noSessions.textContent = 'No sessions available';
			content.appendChild(noSessions);
		} else {
			const list = this.#createSessionList(recaps);
			content.appendChild(list);
		}

		section.append(header, content);
		return section;
	}

	#createSessionList(recaps) {
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

		return list;
	}

	#createSectionHeader(title, sectionKey, isExpanded) {
		const header = document.createElement('div');
		header.className = 'story-sidebar-section-header';

		const titleElement = document.createElement('h2');
		titleElement.textContent = title;

		const toggleButton = document.createElement('button');
		toggleButton.className = 'sidebar-section-toggle';
		toggleButton.setAttribute('aria-expanded', isExpanded);
		toggleButton.innerHTML = `<span class="toggle-icon">${isExpanded ? '▼' : '▶'}</span>`;

		toggleButton.addEventListener('click', () => {
			const section = header.parentElement;
			const content = section.querySelector('.story-sidebar-section-content');
			const isCurrentlyExpanded = content.style.display !== 'none';

			content.style.display = isCurrentlyExpanded ? 'none' : 'block';
			toggleButton.setAttribute('aria-expanded', !isCurrentlyExpanded);
			toggleButton.querySelector('.toggle-icon').textContent = isCurrentlyExpanded ? '▶' : '▼';

			this.#sectionStates[sectionKey] = !isCurrentlyExpanded;
			this.#saveSectionStates();
		});

		header.append(titleElement, toggleButton);
		return header;
	}

	#loadSectionStates() {
		const saved = localStorage.getItem('story-sidebar-sections');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				this.#sectionStates = { ...this.#sectionStates, ...parsed };
			} catch (e) {
				console.warn('Failed to load sidebar section states:', e);
			}
		}
	}

	#saveSectionStates() {
		try {
			localStorage.setItem('story-sidebar-sections', JSON.stringify(this.#sectionStates));
		} catch (e) {
			console.warn('Failed to save sidebar section states:', e);
		}
	}
}

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
		const mainContent = await this.#createMainContent(session);

		sessionContent.append(header);
		if (session.factual_recap) sessionContent.append(recap);
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
		temp.innerHTML = `${await this.#fetchAndParseMd(session.factual_recap)}`;
		this.#placeholderProcessor.processAll(temp, session);

		recap.appendChild(temp);
		return recap;
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

	renderQuests(contentArea) {
		const campaign = this.#getCampaign();
		const questRenderer = new StoryHelperQuest(campaign, this.#placeholderProcessor);
		questRenderer.render(contentArea);
	}

	renderLocations(contentArea) {
		const campaign = this.#getCampaign();
		const locationRenderer = new StoryHelperLocation(campaign, this.#placeholderProcessor);
		locationRenderer.render(contentArea);
	}

	renderNPCs(contentArea) {
		const campaign = this.#getCampaign();
		const npcRenderer = new StoryHelperNPC(campaign, this.#placeholderProcessor);
		npcRenderer.render(contentArea);
	}

	renderCharacter(contentArea, characterName) {
		const campaign = this.#getCampaign();
		const characterRenderer = new StoryHelperCharacter(campaign, this.#placeholderProcessor);
		characterRenderer.render(contentArea, characterName);
	}
}

// ===== HELPER: LOCATION RENDERER =====
class StoryHelperLocation {
	#campaign;
	#placeholderProcessor;
	#selectedLocationId = null;
	#locationListPanel = null;

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
	}

	render(contentArea) {
		const locations = this.#campaign?.locations;

		if (!locations?.length) {
			contentArea.innerHTML = `
				<div class="story-location-container">
					<div class="location-header"><h2>Locations</h2></div>
					<div class="no-content">No locations available for this campaign.</div>
				</div>
			`;
			return;
		}

		const container = document.createElement('div');
		container.className = 'story-location-container';

		const header = document.createElement('div');
		header.className = 'location-header';
		header.innerHTML = '<h2>Locations</h2>';

		const locationBody = document.createElement('div');
		locationBody.className = 'location-body';

		// Left panel: Location list
		const locationListPanel = document.createElement('div');
		locationListPanel.className = 'location-list-panel';
		this.#locationListPanel = locationListPanel;

		// Right panel: Location details
		const locationDetailPanel = document.createElement('div');
		locationDetailPanel.className = 'location-detail-panel';

		// Group locations by type/category
		const groupedLocations = this.#groupLocationsByType(locations);

		// Render location groups in left panel
		Object.entries(groupedLocations).forEach(([type, locs]) => {
			this.#renderLocationGroup(locationListPanel, type, locs, locationDetailPanel);
		});

		// Select first location by default
		if (locations.length > 0) {
			this.#selectLocation(locations[0], locationDetailPanel);
		}

		locationBody.append(locationListPanel, locationDetailPanel);
		container.append(header, locationBody);
		contentArea.appendChild(container);
	}

	#groupLocationsByType(locations) {
		const grouped = {};

		locations.forEach((location) => {
			const type = location.type || 'Other';
			if (!grouped[type]) {
				grouped[type] = [];
			}
			grouped[type].push(location);
		});

		// Sort each group alphabetically
		Object.values(grouped).forEach((group) => {
			group.sort((a, b) => a.name.localeCompare(b.name));
		});

		return grouped;
	}

	#renderLocationGroup(container, typeName, locations, detailPanel) {
		const group = document.createElement('div');
		group.className = 'location-group';

		const groupHeader = document.createElement('div');
		groupHeader.className = 'location-group-header';
		groupHeader.textContent = this.#formatTypeName(typeName);
		group.appendChild(groupHeader);

		locations.forEach((location) => {
			const locationItem = this.#createLocationListItem(location, detailPanel);
			group.appendChild(locationItem);
		});

		container.appendChild(group);
	}

	#formatTypeName(type) {
		return type
			.split(/[-_]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	#createLocationListItem(location, detailPanel) {
		const item = document.createElement('div');
		item.className = 'location-list-item';
		item.dataset.locationId = location.id || location.name;

		const name = document.createElement('span');
		name.className = 'location-item-name';
		name.textContent = location.name;

		item.appendChild(name);

		// Click handler to show location details
		item.addEventListener('click', () => {
			this.#selectLocation(location, detailPanel);
		});

		return item;
	}

	#selectLocation(location, detailPanel) {
		// Update selected state in list
		this.#selectedLocationId = location.id || location.name;

		if (this.#locationListPanel) {
			const allItems = this.#locationListPanel.querySelectorAll('.location-list-item');
			allItems.forEach((item) => {
				if (item.dataset.locationId === this.#selectedLocationId) {
					item.classList.add('selected');
				} else {
					item.classList.remove('selected');
				}
			});
		}

		// Render location details
		detailPanel.innerHTML = '';
		const detailContent = this.#createLocationDetail(location);
		detailPanel.appendChild(detailContent);
	}

	#createLocationDetail(location) {
		const detail = document.createElement('div');
		detail.className = 'location-detail-content';

		// Location header with name and type
		const detailHeader = document.createElement('div');
		detailHeader.className = 'location-detail-header';

		const name = document.createElement('h3');
		name.className = 'location-detail-name';
		name.textContent = location.name;

		const meta = document.createElement('div');
		meta.className = 'location-detail-meta';

		if (location.type) {
			const typeSpan = document.createElement('span');
			typeSpan.className = 'location-detail-type';
			typeSpan.textContent = this.#formatTypeName(location.type);
			meta.appendChild(typeSpan);
		}

		if (location.region) {
			const regionSpan = document.createElement('span');
			regionSpan.className = 'location-detail-region';
			regionSpan.textContent = location.region;
			meta.appendChild(regionSpan);
		}

		detailHeader.append(name, meta);
		detail.appendChild(detailHeader);

		// Description
		if (location.description) {
			const descSection = this.#createSection('Description', location.description);
			detail.appendChild(descSection);
		}

		// Notable features
		if (location.features?.length) {
			const featuresSection = document.createElement('div');
			featuresSection.className = 'location-section';

			const header = document.createElement('div');
			header.className = 'location-section-header';
			header.textContent = 'Notable Features';

			const content = document.createElement('ul');
			content.className = 'location-section-content location-features-list';

			location.features.forEach((feature) => {
				const li = document.createElement('li');
				li.textContent = feature;
				this.#placeholderProcessor.processEntityReferences(li);
				content.appendChild(li);
			});

			featuresSection.append(header, content);
			detail.appendChild(featuresSection);
		}

		// NPCs/Inhabitants
		if (location.npcs?.length) {
			const npcsSection = document.createElement('div');
			npcsSection.className = 'location-section';

			const header = document.createElement('div');
			header.className = 'location-section-header';
			header.textContent = 'Notable NPCs';

			const content = document.createElement('ul');
			content.className = 'location-section-content location-npcs-list';

			location.npcs.forEach((npc) => {
				const li = document.createElement('li');
				li.innerHTML = typeof npc === 'string' ? npc : `${npc.name}${npc.role ? ` - ${npc.role}` : ''}`;
				this.#placeholderProcessor.processEntityReferences(li);
				content.appendChild(li);
			});

			npcsSection.append(header, content);
			detail.appendChild(npcsSection);
		}

		// Connected locations
		if (location.connections?.length) {
			const connectionsSection = document.createElement('div');
			connectionsSection.className = 'location-section';

			const header = document.createElement('div');
			header.className = 'location-section-header';
			header.textContent = 'Connected Locations';

			const content = document.createElement('ul');
			content.className = 'location-section-content location-connections-list';

			location.connections.forEach((connection) => {
				const li = document.createElement('li');
				li.textContent = connection;
				this.#placeholderProcessor.processEntityReferences(li);
				content.appendChild(li);
			});

			connectionsSection.append(header, content);
			detail.appendChild(connectionsSection);
		}

		// History/Lore
		if (location.history) {
			const historySection = this.#createSection('History & Lore', location.history);
			detail.appendChild(historySection);
		}

		return detail;
	}

	#createSection(title, content) {
		const section = document.createElement('div');
		section.className = 'location-section';

		const header = document.createElement('div');
		header.className = 'location-section-header';
		header.textContent = title;

		const contentDiv = document.createElement('div');
		contentDiv.className = 'location-section-content';
		contentDiv.innerHTML = content;
		this.#placeholderProcessor.processEntityReferences(contentDiv);

		section.append(header, contentDiv);
		return section;
	}
}

// ===== HELPER: NPC RENDERER =====
class StoryHelperNPC {
	#campaign;
	#placeholderProcessor;
	#selectedNPCId = null;
	#npcListPanel = null;

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
	}

	render(contentArea) {
		const npcs = this.#campaign?.npcs;

		if (!npcs?.length) {
			contentArea.innerHTML = `
				<div class="story-npc-container">
					<div class="npc-header"><h2>NPCs</h2></div>
					<div class="no-content">No NPCs available for this campaign.</div>
				</div>
			`;
			return;
		}

		const container = document.createElement('div');
		container.className = 'story-npc-container';

		const header = document.createElement('div');
		header.className = 'npc-header';
		header.innerHTML = '<h2>NPCs</h2>';

		const npcBody = document.createElement('div');
		npcBody.className = 'npc-body';

		// Left panel: NPC list
		const npcListPanel = document.createElement('div');
		npcListPanel.className = 'npc-list-panel';
		this.#npcListPanel = npcListPanel;

		// Right panel: NPC details
		const npcDetailPanel = document.createElement('div');
		npcDetailPanel.className = 'npc-detail-panel';

		// Group NPCs by affinity/faction
		const groupedNPCs = this.#groupNPCsByAffinity(npcs);

		// Render NPC groups in left panel
		Object.entries(groupedNPCs).forEach(([affinity, npcList]) => {
			this.#renderNPCGroup(npcListPanel, affinity, npcList, npcDetailPanel);
		});

		// Select first NPC by default
		if (npcs.length > 0) {
			this.#selectNPC(npcs[0], npcDetailPanel);
		}

		npcBody.append(npcListPanel, npcDetailPanel);
		container.append(header, npcBody);
		contentArea.appendChild(container);
	}

	#groupNPCsByAffinity(npcs) {
		const grouped = {};

		npcs.forEach((npc) => {
			const affinity = npc.affinity || 'Neutral';
			if (!grouped[affinity]) {
				grouped[affinity] = [];
			}
			grouped[affinity].push(npc);
		});

		// Sort each group alphabetically
		Object.values(grouped).forEach((group) => {
			group.sort((a, b) => a.name.localeCompare(b.name));
		});

		return grouped;
	}

	#renderNPCGroup(container, affinityName, npcs, detailPanel) {
		const group = document.createElement('div');
		group.className = 'npc-group';

		const groupHeader = document.createElement('div');
		groupHeader.className = 'npc-group-header';
		groupHeader.textContent = affinityName;
		group.appendChild(groupHeader);

		npcs.forEach((npc) => {
			const npcItem = this.#createNPCListItem(npc, detailPanel);
			group.appendChild(npcItem);
		});

		container.appendChild(group);
	}

	#createNPCListItem(npc, detailPanel) {
		const item = document.createElement('div');
		item.className = 'npc-list-item';
		item.dataset.npcId = npc.id || npc.name;

		if (npc.status) {
			item.classList.add(`npc-status-${npc.status.toLowerCase()}`);
		}

		const name = document.createElement('span');
		name.className = 'npc-item-name';
		name.textContent = npc.name;

		const role = document.createElement('span');
		role.className = 'npc-item-role';
		role.textContent = npc.role || '';

		item.append(name, role);

		// Click handler to show NPC details
		item.addEventListener('click', () => {
			this.#selectNPC(npc, detailPanel);
		});

		return item;
	}

	#selectNPC(npc, detailPanel) {
		// Update selected state in list
		this.#selectedNPCId = npc.id || npc.name;

		if (this.#npcListPanel) {
			const allItems = this.#npcListPanel.querySelectorAll('.npc-list-item');
			allItems.forEach((item) => {
				if (item.dataset.npcId === this.#selectedNPCId) {
					item.classList.add('selected');
				} else {
					item.classList.remove('selected');
				}
			});
		}

		// Render NPC details
		detailPanel.innerHTML = '';
		const detailContent = this.#createNPCDetail(npc);
		detailPanel.appendChild(detailContent);
	}

	#createNPCDetail(npc) {
		const detail = document.createElement('div');
		detail.className = 'npc-detail-content';

		// NPC header with name and portrait
		const detailHeader = document.createElement('div');
		detailHeader.className = 'npc-detail-header';

		if (npc.portrait) {
			const portrait = document.createElement('img');
			portrait.src = npc.portrait;
			portrait.alt = npc.name;
			portrait.className = 'npc-portrait';
			detailHeader.appendChild(portrait);
		}

		const headerText = document.createElement('div');
		headerText.className = 'npc-header-text';

		const name = document.createElement('h3');
		name.className = 'npc-detail-name';
		name.textContent = npc.name;

		const meta = document.createElement('div');
		meta.className = 'npc-detail-meta';

		if (npc.race || npc.class) {
			const raceClass = document.createElement('span');
			raceClass.className = 'npc-detail-race-class';
			const parts = [];
			if (npc.race) parts.push(npc.race);
			if (npc.class) parts.push(npc.class);
			raceClass.textContent = parts.join(' ');
			meta.appendChild(raceClass);
		}

		if (npc.role) {
			const role = document.createElement('span');
			role.className = 'npc-detail-role';
			role.textContent = npc.role;
			meta.appendChild(role);
		}

		if (npc.affinity) {
			const affinity = document.createElement('span');
			affinity.className = 'npc-detail-affinity';
			affinity.textContent = npc.affinity;
			meta.appendChild(affinity);
		}

		if (npc.status) {
			const status = document.createElement('span');
			status.className = `npc-detail-status npc-status-${npc.status.toLowerCase()}`;
			status.textContent = npc.status;
			meta.appendChild(status);
		}

		headerText.append(name, meta);
		detailHeader.appendChild(headerText);
		detail.appendChild(detailHeader);

		// Description
		if (npc.description) {
			const descSection = this.#createSection('Description', npc.description);
			detail.appendChild(descSection);
		}

		// Personality
		if (npc.personality) {
			const personalitySection = this.#createSection('Personality', npc.personality);
			detail.appendChild(personalitySection);
		}

		// Background
		if (npc.background) {
			const backgroundSection = this.#createSection('Background', npc.background);
			detail.appendChild(backgroundSection);
		}

		// Location
		if (npc.location) {
			const locationSection = document.createElement('div');
			locationSection.className = 'npc-section';

			const header = document.createElement('div');
			header.className = 'npc-section-header';
			header.textContent = 'Location';

			const content = document.createElement('div');
			content.className = 'npc-section-content';
			content.innerHTML = npc.location;
			this.#placeholderProcessor.processEntityReferences(content);

			locationSection.append(header, content);
			detail.appendChild(locationSection);
		}

		// Goals/Motivations
		if (npc.goals?.length) {
			const goalsSection = document.createElement('div');
			goalsSection.className = 'npc-section';

			const header = document.createElement('div');
			header.className = 'npc-section-header';
			header.textContent = 'Goals & Motivations';

			const content = document.createElement('ul');
			content.className = 'npc-section-content npc-goals-list';

			npc.goals.forEach((goal) => {
				const li = document.createElement('li');
				li.textContent = goal;
				this.#placeholderProcessor.processEntityReferences(li);
				content.appendChild(li);
			});

			goalsSection.append(header, content);
			detail.appendChild(goalsSection);
		}

		// Relationships
		if (npc.relationships?.length) {
			const relationshipsSection = document.createElement('div');
			relationshipsSection.className = 'npc-section';

			const header = document.createElement('div');
			header.className = 'npc-section-header';
			header.textContent = 'Relationships';

			const content = document.createElement('div');
			content.className = 'npc-section-content npc-relationships-list';

			npc.relationships.forEach((rel) => {
				const relDiv = document.createElement('div');
				relDiv.className = 'npc-relationship';
				relDiv.innerHTML =
					typeof rel === 'string' ? rel : `<strong>${rel.name}</strong>: ${rel.description || rel.type || ''}`;
				this.#placeholderProcessor.processEntityReferences(relDiv);
				content.appendChild(relDiv);
			});

			relationshipsSection.append(header, content);
			detail.appendChild(relationshipsSection);
		}

		// Notable items/possessions
		if (npc.items?.length) {
			const itemsSection = document.createElement('div');
			itemsSection.className = 'npc-section';

			const header = document.createElement('div');
			header.className = 'npc-section-header';
			header.textContent = 'Notable Items';

			const content = document.createElement('ul');
			content.className = 'npc-section-content npc-items-list';

			npc.items.forEach((item) => {
				const li = document.createElement('li');
				li.textContent = item;
				this.#placeholderProcessor.processEntityReferences(li);
				content.appendChild(li);
			});

			itemsSection.append(header, content);
			detail.appendChild(itemsSection);
		}

		// Encounters/History
		if (npc.encounters?.length) {
			const encountersSection = document.createElement('div');
			encountersSection.className = 'npc-section';

			const header = document.createElement('div');
			header.className = 'npc-section-header';
			header.textContent = 'Party Encounters';

			const content = document.createElement('div');
			content.className = 'npc-section-content npc-encounters-list';

			npc.encounters.forEach((encounter) => {
				const encounterDiv = this.#createEncounterCard(encounter);
				content.appendChild(encounterDiv);
			});

			encountersSection.append(header, content);
			detail.appendChild(encountersSection);
		}

		return detail;
	}

	#createEncounterCard(encounter) {
		const card = document.createElement('div');
		card.className = 'npc-encounter-card';

		if (encounter.session) {
			const sessionLabel = document.createElement('div');
			sessionLabel.className = 'npc-encounter-session';
			sessionLabel.textContent = `Session ${encounter.session}`;
			card.appendChild(sessionLabel);
		}

		if (encounter.description) {
			const desc = document.createElement('p');
			desc.className = 'npc-encounter-description';
			desc.textContent = encounter.description;
			this.#placeholderProcessor.processEntityReferences(desc);
			card.appendChild(desc);
		}

		return card;
	}

	#createSection(title, content) {
		const section = document.createElement('div');
		section.className = 'npc-section';

		const header = document.createElement('div');
		header.className = 'npc-section-header';
		header.textContent = title;

		const contentDiv = document.createElement('div');
		contentDiv.className = 'npc-section-content';
		contentDiv.innerHTML = content;
		this.#placeholderProcessor.processEntityReferences(contentDiv);

		section.append(header, contentDiv);
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

		// Process character data for custom API
		if (campaign?.metadata?.characters) {
			const customApiData = this.#tooltipManager.getCustomApiData();
			customApiData.character = customApiData.character || {};

			campaign.metadata.characters.forEach((char) => {
				customApiData.character[char.name] = char;
			});
		}

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

// ===== HELPER: TIMELINE RENDERER =====
class StoryHelperTimeline {
	#campaign;
	#placeholderProcessor;

	// Type icon mapping
	#typeIcons = {
		narrative: '💬',
		encounter: '⚔️',
		investigation: '🔎',
		traversal: '👣',
	};

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

		let side = 'left';

		timelineData.forEach((item) => {
			const mainItem = this.#createMainItem(item, side);
			timeline.appendChild(mainItem);

			if (item.items?.length) {
				item.items.forEach((subitem) => {
					const subitemEl = this.#createSubItem(subitem, item.id, side);
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
			const link = this.#createSessionLink(item.url, mainContent);
			mainItem.appendChild(link);
		} else {
			mainItem.appendChild(mainContent);
		}

		if (item.description) {
			const { button, description } = this.#createToggleableDescription(
				item.description,
				'timeline-main-button',
				'timeline-main-description'
			);
			mainItem.append(button, description);
		}

		return mainItem;
	}

	#createSubItem(subitem, parentId, side) {
		const subitemEl = document.createElement('div');
		subitemEl.className = `timeline-item timeline-subitem ${side}`;
		subitemEl.setAttribute('data-parent-id', parentId);
		subitemEl.setAttribute('data-type', subitem.type);

		const subContent = document.createElement('div');
		subContent.className = 'timeline-content';

		let html = `
			<h4>
				<span style="font-size: 8pt">${this.#typeIcons[subitem.type] || '❓'}</span>
				${this.#capitalize(subitem.type)}: ${subitem.actors}
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
			const link = this.#createSessionLink(subitem.url, subContent);
			subitemEl.appendChild(link);
		} else {
			subitemEl.appendChild(subContent);
		}

		if (subitem.description) {
			const { button, description } = this.#createToggleableDescription(
				subitem.description,
				'timeline-sub-button',
				'timeline-sub-description'
			);
			subitemEl.append(button, description);
		}

		return subitemEl;
	}

	#createSessionLink(urlData, content) {
		const link = document.createElement('a');
		link.href = `?campaign=${urlData.campaign}&session=${urlData.session}${urlData.target ? `#${urlData.target}` : ''}`;
		link.title = 'Go to this session recap point.';
		link.appendChild(content);
		return link;
	}

	#createToggleableDescription(descriptionHtml, buttonClass, descriptionClass) {
		const button = document.createElement('button');
		button.className = buttonClass;
		button.textContent = '›';
		button.type = 'button';

		const description = document.createElement('div');
		description.className = descriptionClass;
		description.innerHTML = descriptionHtml;

		button.onclick = (e) => {
			e.preventDefault();
			e.stopPropagation();
			description.classList.toggle('active');
		};

		return { button, description };
	}

	#capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
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
			const portrait = this.#createPortrait(character);
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

	#createPortrait(character) {
		const portrait = document.createElement('div');
		portrait.className = 'character-portrait';

		const img = document.createElement('img');
		img.src = character.imageBg;
		img.alt = `${character.name} portrait`;
		img.className = 'character-portrait__image';

		portrait.appendChild(img);
		return portrait;
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

		const headerRow = this.#createToggleableHeaderRow(
			'Actions',
			actions,
			'.character-actions__description',
			'.character-actions__toggle'
		);
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
			const { toggle, description } = this.#createToggleableContent(
				action.description,
				'character-actions__toggle',
				'character-actions__description'
			);
			nameRow.appendChild(toggle);
			item.append(nameRow, description);
		} else {
			item.appendChild(nameRow);
		}

		return item;
	}

	#createFeaturesSection(features) {
		const section = document.createElement('section');
		section.className = 'character-section character-features';

		const headerRow = this.#createToggleableHeaderRow(
			'Features & Traits',
			features,
			'.character-features__description',
			'.character-features__toggle'
		);
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
			const { toggle, description } = this.#createToggleableContent(
				feature.description,
				'character-features__toggle',
				'character-features__description'
			);
			nameRow.appendChild(toggle);
			item.append(nameRow, description);
		} else {
			item.appendChild(nameRow);
		}

		return item;
	}

	#createToggleableHeaderRow(title, items, descriptionSelector, toggleSelector) {
		const headerRow = document.createElement('div');
		headerRow.className = 'character-section__header-row';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = title;
		headerRow.appendChild(header);

		if (items.some((item) => item.description)) {
			const toggleAll = document.createElement('button');
			toggleAll.className = 'character-section__toggle-all';
			toggleAll.textContent = 'Toggle All';
			toggleAll.addEventListener('click', (e) => {
				const section = e.target.closest('.character-section');
				const descriptions = section.querySelectorAll(descriptionSelector);
				const anyVisible = Array.from(descriptions).some((d) => d.style.display !== 'none');

				descriptions.forEach((desc) => (desc.style.display = anyVisible ? 'none' : 'block'));
				section.querySelectorAll(toggleSelector).forEach((btn) => {
					btn.textContent = anyVisible ? 'Show' : 'Hide';
				});
			});
			headerRow.appendChild(toggleAll);
		}

		return headerRow;
	}

	#createToggleableContent(content, toggleClass, descriptionClass) {
		const toggle = document.createElement('button');
		toggle.className = toggleClass;
		toggle.textContent = 'Show';

		const description = document.createElement('div');
		description.className = descriptionClass;
		description.innerHTML = content;
		description.style.display = 'none';
		this.#placeholderProcessor.processEntityReferences(description);

		toggle.addEventListener('click', () => {
			const isVisible = description.style.display !== 'none';
			description.style.display = isVisible ? 'none' : 'block';
			toggle.textContent = isVisible ? 'Show' : 'Hide';
		});

		return { toggle, description };
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
// ===== HELPER: QUEST RENDERER =====
class StoryHelperQuest {
	#campaign;
	#placeholderProcessor;
	#selectedQuestId = null;
	#questListPanel = null;

	// Priority order for sorting
	#priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
	}

	render(contentArea) {
		const quests = this.#campaign?.quests;

		if (!quests?.length) {
			contentArea.innerHTML = `
				<div class="story-quest-container">
					<div class="quest-header"><h2>Quest Log</h2></div>
					<div class="no-content">No quests available for this campaign.</div>
				</div>
			`;
			return;
		}

		const container = document.createElement('div');
		container.className = 'story-quest-container';

		const header = document.createElement('div');
		header.className = 'quest-header';
		header.innerHTML = '<h2>Quest Log</h2>';

		const questLogBody = document.createElement('div');
		questLogBody.className = 'quest-log-body';

		// Left panel: Quest list
		const questListPanel = document.createElement('div');
		questListPanel.className = 'quest-list-panel';
		this.#questListPanel = questListPanel;

		// Right panel: Quest details
		const questDetailPanel = document.createElement('div');
		questDetailPanel.className = 'quest-detail-panel';

		// Group quests by status
		const groupedQuests = this.#groupQuestsByStatus(quests);

		// Render quest groups in left panel
		['Active', 'Completed', 'Failed', 'Other'].forEach((status) => {
			if (groupedQuests[status]?.length) {
				this.#renderQuestGroup(questListPanel, `${status} Quests`, groupedQuests[status], questDetailPanel);
			}
		});

		// Select first quest by default
		if (quests.length > 0) {
			this.#selectQuest(quests[0], questDetailPanel);
		}

		questLogBody.append(questListPanel, questDetailPanel);
		container.append(header, questLogBody);
		contentArea.appendChild(container);
	}

	#groupQuestsByStatus(quests) {
		const grouped = {
			Active: [],
			Completed: [],
			Failed: [],
			Other: [],
		};

		quests.forEach((quest) => {
			const status = quest.status || 'Other';
			if (grouped[status]) {
				grouped[status].push(quest);
			} else {
				grouped.Other.push(quest);
			}
		});

		// Sort each group by priority
		Object.values(grouped).forEach((group) => {
			group.sort((a, b) => {
				const aPriority = this.#priorityOrder[a.priority?.toLowerCase()] ?? 999;
				const bPriority = this.#priorityOrder[b.priority?.toLowerCase()] ?? 999;
				return aPriority - bPriority;
			});
		});

		return grouped;
	}

	#renderQuestGroup(container, title, quests, detailPanel) {
		const group = document.createElement('div');
		group.className = 'quest-group';

		const groupHeader = document.createElement('div');
		groupHeader.className = 'quest-group-header';
		groupHeader.textContent = title;
		group.appendChild(groupHeader);

		quests.forEach((quest) => {
			const questItem = this.#createQuestListItem(quest, detailPanel);
			group.appendChild(questItem);
		});

		container.appendChild(group);
	}

	#createQuestListItem(quest, detailPanel) {
		const item = document.createElement('div');
		item.className = `quest-list-item quest-status-${quest.status.toLowerCase()}`;
		item.dataset.questId = quest.title;

		// Quest level/priority indicator
		const level = document.createElement('span');
		level.className = `quest-level quest-priority-${quest.priority.toLowerCase()}`;
		level.textContent = this.#getPrioritySymbol(quest.priority);

		// Quest title
		const title = document.createElement('span');
		title.className = 'quest-item-title';
		title.textContent = quest.title;

		item.append(level, title);

		// Click handler to show quest details
		item.addEventListener('click', () => {
			this.#selectQuest(quest, detailPanel);
		});

		return item;
	}

	#getPrioritySymbol(priority) {
		const symbols = {
			critical: '!!!',
			high: '!!',
			normal: '!',
			low: '·',
		};
		return symbols[priority?.toLowerCase()] || '!';
	}

	#selectQuest(quest, detailPanel) {
		// Update selected state in list
		this.#selectedQuestId = quest.title;

		if (this.#questListPanel) {
			const allItems = this.#questListPanel.querySelectorAll('.quest-list-item');
			allItems.forEach((item) => {
				item.classList.toggle('selected', item.dataset.questId === quest.title);
			});
		}

		// Render quest details
		detailPanel.innerHTML = '';
		const detailContent = this.#createQuestDetail(quest);
		detailPanel.appendChild(detailContent);
	}

	#createQuestDetail(quest) {
		const detail = document.createElement('div');
		detail.className = 'quest-detail-content';

		// Quest header with title and status
		const detailHeader = this.#createQuestHeader(quest);
		detail.appendChild(detailHeader);

		// Current objective
		if (quest.current_objective) {
			const objectiveSection = this.#createSection('Objective', quest.current_objective, 'quest-objective-text');
			detail.appendChild(objectiveSection);
		}

		// Quest History
		if (quest.sessions?.length) {
			const historySection = this.#createHistorySection(quest.sessions);
			detail.appendChild(historySection);
		}

		return detail;
	}

	#createQuestHeader(quest) {
		const header = document.createElement('div');
		header.className = 'quest-detail-header';

		const title = document.createElement('h3');
		title.className = 'quest-detail-title';
		title.textContent = quest.title;

		const meta = document.createElement('div');
		meta.className = 'quest-detail-meta';
		meta.innerHTML = `
			<span class="quest-detail-priority ${quest.priority.toLowerCase()}">${quest.priority} Priority</span>
			<span class="quest-detail-status ${quest.status.toLowerCase()}">${quest.status}</span>
		`;

		header.append(title, meta);
		return header;
	}

	#createSection(title, content, additionalClass = '') {
		const section = document.createElement('div');
		section.className = 'quest-section';

		const header = document.createElement('div');
		header.className = 'quest-section-header';
		header.textContent = title;

		const contentDiv = document.createElement('div');
		contentDiv.className = `quest-section-content ${additionalClass}`.trim();
		contentDiv.textContent = content;

		this.#placeholderProcessor.processEntityReferences(contentDiv);
		section.append(header, contentDiv);
		return section;
	}

	#createHistorySection(sessions) {
		const section = document.createElement('div');
		section.className = 'quest-section';

		const header = document.createElement('div');
		header.className = 'quest-section-header';
		header.textContent = 'Quest Progress';

		const content = document.createElement('div');
		content.className = 'quest-section-content';

		sessions.forEach((session) => {
			const sessionCard = this.#createSessionDetail(session);
			content.appendChild(sessionCard);
		});

		section.append(header, content);
		return section;
	}

	#createSessionDetail(session) {
		const card = document.createElement('div');
		card.className = 'quest-session-detail';

		const header = document.createElement('div');
		header.className = 'quest-session-detail-header';
		header.textContent = `Session ${session.session || 'Unknown'}`;
		card.appendChild(header);

		if (session.description) {
			const desc = document.createElement('p');
			desc.className = 'quest-session-description';
			desc.textContent = session.description;
			card.appendChild(desc);
		}

		if (session.details?.length) {
			const detailsList = this.#createList(session.details, 'quest-session-details');
			card.appendChild(detailsList);
		}

		if (session.visions?.length) {
			card.appendChild(this.#createVisionsSection(session.visions));
		}

		if (session.recurring_elements) {
			card.appendChild(this.#createRecurringElementsSection(session.recurring_elements));
		}

		if (session.first_countermeasure?.length) {
			card.appendChild(this.#createListSection('First Countermeasure', session.first_countermeasure));
		}

		if (session.allied_forces?.length) {
			card.appendChild(this.#createListSection('Allied Forces', session.allied_forces));
		}

		if (session.threat_assessment) {
			const threat = document.createElement('div');
			threat.className = 'quest-threat-assessment';
			threat.innerHTML = `<strong>Threat Assessment:</strong> ${session.threat_assessment}`;
			this.#placeholderProcessor.processEntityReferences(threat);
			card.appendChild(threat);
		}

		return card;
	}

	#createList(items, className) {
		const list = document.createElement('ul');
		list.className = className;
		items.forEach((item) => {
			const li = document.createElement('li');
			li.textContent = item;
			list.appendChild(li);
		});
		return list;
	}

	#createListSection(title, items) {
		const section = document.createElement('div');
		section.className = 'quest-list-section';

		const header = document.createElement('h5');
		header.textContent = title;
		section.appendChild(header);

		const list = this.#createList(items, '');
		section.appendChild(list);

		return section;
	}

	#createVisionsSection(visions) {
		const section = document.createElement('div');
		section.className = 'quest-visions-section';

		const header = document.createElement('h5');
		header.textContent = 'Visions';
		section.appendChild(header);

		visions.forEach((vision) => {
			const visionCard = document.createElement('div');
			visionCard.className = 'quest-vision-card';

			const characters = document.createElement('div');
			characters.className = 'quest-vision-characters';
			characters.innerHTML = `<strong>Characters:</strong> ${vision.characters.join(', ')}`;

			const visionText = document.createElement('p');
			visionText.className = 'quest-vision-text';
			visionText.textContent = vision.vision;

			this.#placeholderProcessor.processEntityReferences(characters);
			visionCard.append(characters, visionText);
			section.appendChild(visionCard);
		});

		return section;
	}

	#createRecurringElementsSection(elements) {
		const section = document.createElement('div');
		section.className = 'quest-recurring-elements';

		const header = document.createElement('h5');
		header.textContent = 'Recurring Elements';
		section.appendChild(header);

		const elementMap = {
			unifying_banner: 'Unifying Banner',
			alliance: 'Alliance',
			pivotal_event: 'Pivotal Event',
			strategy: 'Strategy',
		};

		Object.entries(elementMap).forEach(([key, label]) => {
			const value = elements[key];
			if (value) {
				const div = document.createElement('div');
				if (Array.isArray(value)) {
					div.innerHTML = `<strong>${label}:</strong> ${value.join(', ')}`;
				} else {
					div.innerHTML = `<strong>${label}:</strong> ${value}`;
				}
				this.#placeholderProcessor.processEntityReferences(div);
				section.appendChild(div);
			}
		});

		return section;
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
			const listItem = this.#createLootItem(item);
			list.appendChild(listItem);
		});

		container.appendChild(list);
		return container;
	}

	#createLootItem(item) {
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

		return listItem;
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
				content += this.#generateSpellTooltip(entityData);
				break;
			case 'monster':
				content += this.#generateMonsterTooltip(entityData);
				break;
			case 'class':
				content += this.#generateClassTooltip(entityData);
				break;
			case 'location':
			case 'guild':
			case 'race':
				content += this.#generateMetadataTooltip(entityData);
				break;
			case 'character':
				content += this.#generateCharacterTooltip(entityData);
				break;
			case 'npc':
				content += this.#generateNPCTooltip(entityData);
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

	#generateSpellTooltip(data) {
		return `
			<div><strong>Level:</strong> ${data.level || 'Cantrip'}</div>
			<div><strong>School:</strong> ${
				data.spellClass ? data.spellClass.charAt(0).toUpperCase() + data.spellClass.slice(1) : 'Unknown'
			}</div>
			<div><strong>Casting Time:</strong> ${data.castingTime || 'N/A'}</div>
			<div><strong>Range:</strong> ${data.range || 'N/A'}</div>
			<div><strong>Components:</strong> ${data.components || 'None'}</div>
			<div><strong>Duration:</strong> ${data.duration || 'Instantaneous'}</div>
			<div><strong>Classes:</strong> ${data.classes?.join(', ') || 'N/A'}</div>
			<div><strong>Source:</strong> ${data.source || 'Unknown'}</div>
			<div class="tooltip-description tooltip-background">${data.description || 'No description available.'}</div>
		`;
	}

	#generateMonsterTooltip(data) {
		return `
			<div><strong>Type:</strong> ${data.type || 'Unknown'}</div>
			<div><strong>CR:</strong> ${data.challenge_rating || 'Unknown'}</div>
			<div><strong>AC:</strong> ${data.armor_class || 'Unknown'}</div>
			<div><strong>HP:</strong> ${data.hit_points || 'Unknown'}</div>
			<div class="tooltip-description tooltip-background">${
				data.desc || data.description || 'No description available.'
			}</div>
		`;
	}

	#generateClassTooltip(data) {
		return `
			<div><strong>Hit Die:</strong> d${data.hit_die || '?'}</div>
			<div><strong>Proficiencies:</strong> ${data.proficiencies?.map((p) => p.name).join(', ') || 'None'}</div>
			<div><strong>Saves:</strong> ${data.saving_throws?.map((s) => s.name).join(', ') || 'None'}</div>
			<div><strong>Spellcasting:</strong> ${data.spellcasting ? 'Yes' : 'No'}</div>
			<div><strong>Subclasses:</strong> ${data.subclasses?.map((p) => p.name).join(', ') || 'None'}</div>
		`;
	}

	#generateMetadataTooltip(data) {
		let content = '';
		if (data?.metadata) {
			content += Object.entries(data.metadata)
				.map(([key, entry]) => `<div class="tooltip-metadata"><span>${key}</span><span>${entry}</span></div>`)
				.join('');
		}
		content += `<div class="tooltip-description tooltip-background">${
			data.description || 'No description available.'
		}</div>`;
		return content;
	}

	#generateCharacterTooltip(data) {
		let content = `
			<div><strong>Race:</strong> ${data.race || 'Unknown'}</div>
			<div><strong>Class:</strong> ${data.class || 'Unknown'}</div>
			<div><strong>Level:</strong> ${data.level || 'Unknown'}</div>
		`;

		if (data?.stats?.abilityScores) {
			content += '<div class="tooltip-scores-container tooltip-background">';
			content += Object.entries(data.stats.abilityScores)
				.map(
					([key, entry]) =>
						`<div class="tooltip-ability"><span class="tooltip-ability-name">${key}</span><span class="tooltip-ability-value">${entry}</span></div>`
				)
				.join('');
			content += '</div>';
		}

		content += `<div class="tooltip-description tooltip-background">${
			data.shortDescription || 'No description available.'
		}</div>`;
		return content;
	}

	#generateNPCTooltip(data) {
		return `
			<div><strong>Class:</strong> ${data.class || 'Unknown'}</div>
			<div><strong>Affinity:</strong> ${data.affinity || 'Unknown'}</div>
			<div><strong>Role:</strong> ${data.role || 'Unknown'}</div>
		`;
	}
}
