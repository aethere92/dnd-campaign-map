// --- START OF FILE StoryTimeline.js ---

class StoryHelperTimeline {
	#campaign;
	#placeholderProcessor;
	#supabaseClient;

	// Type icon mapping
	static TYPE_ICONS = {
		narrative: '💬',
		encounter: '⚔️',
		investigation: '🔎',
		traversal: '👣',
		combat: '⚔️',
		social: '🗣️',
		exploration: '🗺️',
		rest: '⛺',
		loot: '💰',
		quest: '📜',
	};

	constructor(campaign, placeholderProcessor) {
		this.#campaign = campaign;
		this.#placeholderProcessor = placeholderProcessor;
		this.#supabaseClient = SupabaseClient.getInstance();
	}

	async render(contentArea) {
		// 1. Initial Loading State
		contentArea.innerHTML = `
			<div class="story-view-container">
				<div class="view-header"><h2>Campaign Timeline</h2></div>
				<div class="loading-container">
					<div class="loading-spinner"></div>
					<p>Constructing history...</p>
				</div>
			</div>
		`;

		try {
			// 2. Fetch Data
			const sessions = await this.#supabaseClient.getTimelineWithEvents(this.#campaign.id);

			if (!sessions?.length) {
				contentArea.innerHTML = `
					<div class="story-view-container">
						<div class="view-header"><h2>Campaign Timeline</h2></div>
						<div class="no-content">No timeline events found.</div>
					</div>
				`;
				return;
			}

			// 3. Build Layout (Sidebar + Main Content)
			this.#buildLayout(contentArea, sessions);
		} catch (error) {
			console.error('Error loading timeline:', error);
			contentArea.innerHTML = `
				<div class="story-view-container">
					<div class="view-header"><h2>Campaign Timeline</h2></div>
					<div class="error-message">Error loading timeline: ${error.message}</div>
				</div>
			`;
		}
	}

	#buildLayout(contentArea, sessions) {
		contentArea.innerHTML = '';

		const container = document.createElement('div');
		container.className = 'story-view-container';

		const header = document.createElement('div');
		header.className = 'view-header';
		header.innerHTML = '<h2>Campaign Timeline</h2>';

		const body = document.createElement('div');
		body.className = 'view-body';

		// -- Left Panel: Session List (Navigation) --
		const listPanel = document.createElement('div');
		listPanel.className = 'view-list-panel';

		// Create a single group for sessions
		const group = document.createElement('div');
		group.className = 'view-group';

		const groupContent = document.createElement('div');
		groupContent.className = 'view-group-content';

		const groupHeader = StoryDOMBuilder.createToggleHeader('Sessions', groupContent, 'view-group-header-level-1');
		group.appendChild(groupHeader);

		// -- Right Panel: Timeline Visualization --
		const detailPanel = document.createElement('div');
		detailPanel.className = 'view-detail-panel';

		const detailContent = document.createElement('div');
		detailContent.className = 'view-detail-content';
		detailContent.style.alignItems = 'stretch'; // Fill width

		// Render Items
		const timelineContainer = document.createElement('div');
		timelineContainer.className = 'timeline';

		let side = 'left';

		sessions.forEach((session) => {
			if (!session.events || session.events.length === 0) return;

			// 1. Sidebar Item
			const listItem = document.createElement('div');
			listItem.className = 'view-list-item';
			listItem.textContent = `Session ${session.session_number}: ${session.title}`;
			listItem.addEventListener('click', () => {
				const target = document.getElementById(`session-${session.id}`);
				if (target) {
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					// update active state
					listPanel.querySelectorAll('.view-list-item').forEach((el) => el.classList.remove('selected'));
					listItem.classList.add('selected');
				}
			});
			groupContent.appendChild(listItem);

			// 2. Timeline Main Node (The Session)
			const sessionNode = this.#createSessionNode(session, side);
			timelineContainer.appendChild(sessionNode);

			// 3. Timeline Sub Nodes (The Events)
			session.events.forEach((event) => {
				const eventNode = this.#createEventNode(event, session.id, side);
				timelineContainer.appendChild(eventNode);
			});

			side = side === 'left' ? 'right' : 'left';
		});

		group.appendChild(groupContent);
		listPanel.appendChild(group);

		detailContent.appendChild(timelineContainer);
		detailPanel.appendChild(detailContent);

		body.append(listPanel, detailPanel);
		container.append(header, body);
		contentArea.appendChild(container);

		// Process links
		this.#placeholderProcessor.processTimelinePlaceholders(timelineContainer);
	}

	#createSessionNode(session, side) {
		const node = document.createElement('div');
		node.className = `timeline-item timeline-main-item ${side}`;
		node.id = `session-${session.id}`;
		node.setAttribute('data-id', session.id);

		const content = document.createElement('div');
		content.className = 'timeline-content';

		// Header
		content.innerHTML = `
			<h3>Session ${session.session_number}: ${session.title}</h3>
			<div class="timeline-date">${session.session_date || ''}</div>
		`;

		return node;
	}

	#createEventNode(event, sessionId, side) {
		const node = document.createElement('div');
		node.className = `timeline-item timeline-subitem ${side}`;
		node.setAttribute('data-parent-id', sessionId);

		const content = document.createElement('div');
		content.className = 'timeline-content';

		const icon = StoryHelperTimeline.TYPE_ICONS[event.event_type] || '•';
		const title = event.title || 'Untitled Event';

		// Title Row
		const header = document.createElement('h4');
		header.innerHTML = `<span class="timeline-icon">${icon}</span> ${title}`;
		content.appendChild(header);

		// Meta Tags Row (Entities)
		const tagsContainer = this.#createEntityTags(event);
		if (tagsContainer) {
			content.appendChild(tagsContainer);
		}

		// Description
		if (event.description) {
			const desc = document.createElement('div');
			desc.className = 'timeline-description';
			desc.innerHTML = event.description;
			// Simple toggle for long descriptions could be added here
			content.appendChild(desc);
		}

		node.appendChild(content);
		return node;
	}

	#createEntityTags(event) {
		const tags = [];

		if (event.npc) {
			tags.push({ text: event.npc.name, className: 'tag-npc', type: 'npc', id: event.npc.id });
		}
		if (event.location) {
			tags.push({ text: event.location.name, className: 'tag-location', type: 'location', id: event.location.id });
		}
		if (event.quest) {
			tags.push({ text: event.quest.title, className: 'tag-quest', type: 'quest', id: event.quest.id });
		}
		if (event.encounter) {
			tags.push({ text: event.encounter.name, className: 'tag-encounter', type: 'encounter', id: event.encounter.id });
		}
		if (event.faction) {
			tags.push({ text: event.faction.name, className: 'tag-faction', type: 'faction', id: event.faction.id });
		}
		if (event.character) {
			tags.push({ text: event.character.name, className: 'tag-character', type: 'character', id: event.character.id });
		}

		if (tags.length === 0) return null;

		const container = document.createElement('div');
		container.className = 'timeline-tags';
		container.style.marginTop = '0.5rem';
		container.style.display = 'flex';
		container.style.flexWrap = 'wrap';
		container.style.gap = '0.25rem';

		tags.forEach((tag) => {
			const span = document.createElement('span');
			// Use existing style classes if they map, or fallback generic
			let styleClass = 'view-meta-tag';
			if (tag.className === 'tag-npc') styleClass += ' npc-role'; // Blue-ish
			else if (tag.className === 'tag-location') styleClass += ' location-type'; // Green-ish
			else if (tag.className === 'tag-quest') styleClass += ' priority-normal'; // Gold/Yellow
			else if (tag.className === 'tag-encounter') styleClass += ' status-hostile'; // Red

			span.className = styleClass;
			span.style.fontSize = '0.75rem';
			span.style.padding = '2px 6px';
			span.textContent = tag.text;

			// If we want these to be clickable links
			// We can construct the ENTITY link format manually to let placeholder processor handle it later
			// OR just make it a link here. Let's use the ENTITY format for consistency.
			// Actually, visual tags are better rendered directly, but we can add data attr for tooltips
			span.dataset.entityType = tag.type;
			span.dataset.entityName = tag.text; // Name based lookup

			container.appendChild(span);
		});

		return container;
	}
}
