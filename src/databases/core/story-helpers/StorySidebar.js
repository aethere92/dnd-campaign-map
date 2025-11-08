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
	#onFactionsClick;
	#onEncountersClick;
	#searchManager;

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
		onNPCsClick,
		onFactionsClick,
		onEncountersClick,
		searchManager
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
		this.#onFactionsClick = onFactionsClick;
		this.#onEncountersClick = onEncountersClick;
		this.#searchManager = searchManager;

		// Load saved section states
		this.#loadSectionStates();
	}

	createSidebar(isCollapsed) {
		const sidebar = document.createElement('div');
		sidebar.className = 'story-sidebar';

		const campaignName = this.#createCampaignHeader();

		sidebar.append(
			campaignName,
			this.#createSearchButton(),
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

	#createSearchButton() {
		const button = document.createElement('button');
		button.className = 'search-trigger-button';
		button.innerHTML = '🔍 Search';
		button.title = 'Search (Ctrl+K)';

		button.addEventListener('click', () => {
			this.#searchManager.openSearch();
		});

		return button;
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
		const timelineBtn = this.#createToolButton('⏳ Timeline', 'timeline');
		toolsList.appendChild(timelineBtn);

		// Quests button
		const campaign = this.#getCampaign();
		if (campaign?.quests?.length) {
			const questsBtn = this.#createToolButton('📜 Quests', 'quests');
			toolsList.appendChild(questsBtn);
		}

		// Locations button
		if (campaign?.locations?.length) {
			const locationsBtn = this.#createToolButton('📍 Locations', 'locations');
			toolsList.appendChild(locationsBtn);
		}

		// NPCs button
		if (campaign?.npcs?.length) {
			const npcsBtn = this.#createToolButton('🧌 NPCs', 'npcs');
			toolsList.appendChild(npcsBtn);
		}

		// NPCs button
		if (campaign?.factions?.length) {
			const factionsBtn = this.#createToolButton('🛡️ Factions', 'factions');
			toolsList.appendChild(factionsBtn);
		}

		// NPCs button
		if (campaign?.encounters?.length) {
			const encountersBtn = this.#createToolButton('⚔️ Encounters', 'encounters');
			toolsList.appendChild(encountersBtn);
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
				case 'factions':
					this.#onFactionsClick();
					break;
				case 'encounters':
					this.#onEncountersClick();
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
