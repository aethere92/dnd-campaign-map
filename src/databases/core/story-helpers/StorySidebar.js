// --- START OF FILE StorySidebar.js ---

class StoryHelperSidebar {
	#getCampaign; // Metadata only
	#getCurrentView;
	#getCurrentSessionId;
	#getSelectedCharacterId;
	#callbacks;
	#searchManager;
	#supabaseClient;

	constructor(
		getCampaign,
		getCurrentView,
		getCurrentSessionId,
		getSelectedCharacterId,
		onToggle,
		onCharClick,
		onSessClick,
		onTimeline,
		onQuests,
		onLocs,
		onNPCs,
		onFactions,
		onEncounters,
		onMap,
		onRels,
		searchManager,
		supabaseClient
	) {
		this.#getCampaign = getCampaign;
		this.#getCurrentView = getCurrentView;
		this.#getCurrentSessionId = getCurrentSessionId;
		this.#getSelectedCharacterId = getSelectedCharacterId;
		this.#callbacks = {
			toggle: onToggle,
			character: onCharClick,
			session: onSessClick,
			timeline: onTimeline,
			quests: onQuests,
			locations: onLocs,
			npcs: onNPCs,
			factions: onFactions,
			encounters: onEncounters,
			map: onMap,
			relationships: onRels,
		};
		this.#searchManager = searchManager;
		this.#supabaseClient = supabaseClient || SupabaseClient.getInstance();
	}

	async createSidebar(isCollapsed, campaignId) {
		const sidebar = document.createElement('div');
		sidebar.className = 'story-sidebar';

		const campaign = this.#getCampaign();
		sidebar.innerHTML = `<div class="story-campaign-name"><h3>${campaign.name}</h3></div>`;

		// Search
		const searchBtn = document.createElement('button');
		searchBtn.className = 'search-trigger-button';
		searchBtn.textContent = '🔍 Search';
		searchBtn.onclick = () => this.#searchManager.openSearch();
		sidebar.appendChild(searchBtn);

		// Sections
		sidebar.appendChild(await this.#createCharacterSection(campaignId));
		sidebar.appendChild(this.#createToolsSection());
		sidebar.appendChild(await this.#createSessionSection(campaignId));

		return sidebar;
	}

	async #createCharacterSection(campaignId) {
		const section = this.#createSectionBase('Characters');
		const list = document.createElement('div');
		list.className = 'story-character-list';

		const chars = await this.#supabaseClient.getCharacters(campaignId);

		chars.forEach((c) => {
			const card = document.createElement('div');
			card.className = 'story-character-card';
			if (this.#getCurrentView() === 'character' && this.#getSelectedCharacterId() === c.id) {
				card.classList.add('active');
			}
			card.innerHTML = `
                <div class="character-avatar"><img src="${c.icon || 'default.png'}"></div>
                <div class="character-info"><span>${c.name}</span></div>
            `;
			card.onclick = () => this.#callbacks.character(c.id);
			list.appendChild(card);
		});

		section.querySelector('.content').appendChild(list);
		return section;
	}

	#createToolsSection() {
		const section = this.#createSectionBase('Campaign Tools');
		const list = document.createElement('div');
		list.className = 'story-campaign-tools-list';

		const tools = [
			{ label: 'Timeline', cb: this.#callbacks.timeline, icon: '⏳' },
			{ label: 'Quests', cb: this.#callbacks.quests, icon: '📜' },
			{ label: 'Locations', cb: this.#callbacks.locations, icon: '📍' },
			{ label: 'NPCs', cb: this.#callbacks.npcs, icon: '👤' },
			{ label: 'Factions', cb: this.#callbacks.factions, icon: '🛡️' },
			{ label: 'Encounters', cb: this.#callbacks.encounters, icon: '⚔️' },
			{ label: 'Map', cb: this.#callbacks.map, icon: '🗺️' },
			{ label: 'Relationships', cb: this.#callbacks.relationships, icon: '🕸️' },
		];

		tools.forEach((t) => {
			const btn = document.createElement('button');
			btn.className = 'campaign-tool-button';
			btn.innerHTML = `${t.icon} ${t.label}`;
			btn.onclick = t.cb;
			list.appendChild(btn);
		});

		section.querySelector('.content').appendChild(list);
		return section;
	}

	async #createSessionSection(campaignId) {
		const section = this.#createSectionBase('Sessions');
		const list = document.createElement('div');
		list.className = 'story-session-list';

		const sessions = await this.#supabaseClient.getSessionList(campaignId);

		if (sessions.length === 0) {
			list.innerHTML = '<div class="no-content">No sessions.</div>';
		}

		sessions.forEach((s) => {
			const item = document.createElement('div');
			item.className = 'story-session-item';
			if (this.#getCurrentView() === 'session' && this.#getCurrentSessionId() === s.id) {
				item.classList.add('active');
			}
			item.innerHTML = `<h3>${s.title}</h3><span class="date">${s.session_date || ''}</span>`;
			item.onclick = () => this.#callbacks.session(s.id);
			list.appendChild(item);
		});

		section.querySelector('.content').appendChild(list);
		return section;
	}

	#createSectionBase(title) {
		const div = document.createElement('div');
		div.className = 'story-sidebar-section';
		div.innerHTML = `
            <div class="story-sidebar-section-header"><h2>${title}</h2></div>
            <div class="story-sidebar-section-content content"></div>
        `;
		return div;
	}
}
