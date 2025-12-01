// --- START OF FILE StoryContent.js ---

class StoryHelperContent {
	#placeholderProcessor;
	#supabaseClient;
	#campaignId;

	constructor(placeholderProcessor, supabaseClient, campaignId) {
		this.#placeholderProcessor = placeholderProcessor;
		this.#supabaseClient = supabaseClient;
		this.#campaignId = campaignId;
	}

	// ==========================================
	// RENDERING
	// ==========================================

	async renderSession(contentArea, sessionId) {
		// Fetch full session details including joined events
		let session;
		try {
			session = await this.#supabaseClient.getSessionDetails(sessionId);
		} catch (e) {
			contentArea.innerHTML = `<div class="error-message">Failed to load session: ${e.message}</div>`;
			return;
		}

		if (!session) {
			contentArea.innerHTML = '<div class="no-content">Session not found.</div>';
			return;
		}

		const container = document.createElement('div');
		container.className = 'story-view-container';

		const body = document.createElement('div');
		body.className = 'view-body';

		// TOC Panel
		const listPanel = document.createElement('div');
		listPanel.className = 'view-list-panel';

		// Content Panel
		const detailPanel = document.createElement('div');
		detailPanel.className = 'view-detail-panel';

		const detailContent = document.createElement('div');
		detailContent.className = 'view-detail-content session-content-wrapper';

		// Header
		detailContent.appendChild(this.#createSessionHeader(session));

		// Summary
		if (session.summary) {
			detailContent.appendChild(this.#createRecapSection(session, session.summary));
		}

		// Narrative (if stored in DB)
		if (session.narrative) {
			detailContent.appendChild(this.#createMainContent(session, session.narrative));
		}

		// Events List (if using structural data instead of narrative text)
		if (session.events && session.events.length > 0) {
			detailContent.appendChild(this.#createEventsSection(session.events));
		}

		detailPanel.appendChild(detailContent);
		body.append(listPanel, detailPanel);
		container.appendChild(body);
		contentArea.appendChild(container);

		// Process placeholders
		this.#placeholderProcessor.processAll(detailContent, session);
	}

	// ... (Keep renderTimeline, renderQuests, etc. as proxies to other classes)
	renderTimeline(contentArea) {
		new StoryHelperTimeline(this.#getCampaignContext(), this.#placeholderProcessor).render(contentArea);
	}
	renderQuests(contentArea) {
		new StoryHelperQuest(this.#getCampaignContext(), this.#placeholderProcessor).render(contentArea);
	}
	renderLocations(contentArea) {
		new StoryHelperLocation(this.#getCampaignContext(), this.#placeholderProcessor).render(contentArea);
	}
	renderNPCs(contentArea) {
		new StoryHelperNPC(this.#getCampaignContext(), this.#placeholderProcessor).render(contentArea);
	}
	renderFactions(contentArea) {
		new StoryHelperFaction(this.#getCampaignContext(), this.#placeholderProcessor).render(contentArea);
	}
	renderEncounters(contentArea) {
		new StoryHelperEncounter(this.#getCampaignContext(), this.#placeholderProcessor).render(contentArea);
	}

	renderCharacter(contentArea, characterId) {
		new StoryHelperCharacter(this.#getCampaignContext(), this.#placeholderProcessor).render(contentArea, characterId);
	}

	#getCampaignContext() {
		return { id: this.#campaignId }; // Minimal context needed for fetches
	}

	// ==========================================
	// DOM BUILDERS
	// ==========================================

	#createSessionHeader(session) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const titleDiv = document.createElement('div');
		titleDiv.className = 'view-header-text';

		const h3 = document.createElement('h3');
		h3.className = 'view-detail-name';
		h3.textContent = session.title;

		const meta = document.createElement('div');
		meta.className = 'view-detail-meta';
		if (session.session_date) {
			const date = document.createElement('span');
			date.className = 'view-meta-tag';
			date.textContent = session.session_date;
			meta.appendChild(date);
		}

		titleDiv.append(h3, meta);
		header.appendChild(titleDiv);
		return header;
	}

	#createRecapSection(session, summary) {
		const section = document.createElement('div');
		section.className = 'view-section session-summary';
		section.innerHTML = `
            <div class="view-section-header">Summary</div>
            <div class="view-section-content">${summary}</div>
        `;
		return section;
	}

	#createMainContent(session, narrative) {
		const main = document.createElement('div');
		main.className = 'session-main-content';
		main.innerHTML = narrative;
		return main;
	}

	#createEventsSection(events) {
		const section = document.createElement('div');
		section.className = 'view-section session-events';
		section.innerHTML = '<div class="view-section-header">Events</div>';

		const list = document.createElement('div');
		list.className = 'event-timeline';

		events.forEach((event) => {
			const item = document.createElement('div');
			item.className = 'event-item';

			let icon = '•';
			if (event.event_type === 'combat') icon = '⚔️';
			if (event.event_type === 'social') icon = '💬';
			if (event.event_type === 'travel') icon = '👣';

			item.innerHTML = `
                <div class="event-icon">${icon}</div>
                <div class="event-details">
                    <h4>${event.title}</h4>
                    ${event.description ? `<p>${event.description}</p>` : ''}
                </div>
            `;
			list.appendChild(item);
		});

		section.appendChild(list);
		return section;
	}
}
