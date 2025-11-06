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
		if (session.summary) sessionContent.append(recap);
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
		temp.innerHTML = `${await this.#fetchAndParseMd(session.summary)}`;
		this.#placeholderProcessor.processAll(temp, session);

		recap.appendChild(temp);
		return recap;
	}

	async #createMainContent(session) {
		const main = document.createElement('div');
		main.className = 'session-main-content';

		const temp = document.createElement('div');
		temp.innerHTML = await this.#fetchAndParseMd(session.narrative);
		this.#placeholderProcessor.processAll(temp, session);

		main.appendChild(temp);
		return main;
	}

	async #fetchAndParseMd(filePath) {
		if (!filePath || typeof filePath !== 'string' || !filePath.endsWith('.md')) {
			return filePath || '';
		}

		const campaign = this.#getCampaign();
		const basePath = `src/databases/data/campaigns/${campaign.id}/`;
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

	renderFactions(contentArea) {
		const campaign = this.#getCampaign();
		const factionRenderer = new StoryHelperFaction(campaign, this.#placeholderProcessor);
		factionRenderer.render(contentArea);
	}

	renderEncounters(contentArea) {
		const campaign = this.#getCampaign();
		const encounterRenderer = new StoryHelperEncounter(campaign, this.#placeholderProcessor);
		encounterRenderer.render(contentArea);
	}

	renderCharacter(contentArea, characterName) {
		const campaign = this.#getCampaign();
		const characterRenderer = new StoryHelperCharacter(campaign, this.#placeholderProcessor);
		characterRenderer.render(contentArea, characterName);
	}
}
