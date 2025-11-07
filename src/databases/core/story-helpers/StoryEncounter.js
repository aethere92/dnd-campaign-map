class StoryHelperEncounter extends StoryHelperBase {
	#encounterData;
	#selectedActor = 'all'; // Track selected actor filter

	constructor(campaign, placeholderProcessor) {
		super(campaign, placeholderProcessor);
		this.#encounterData = null;
	}

	getUrlParam() {
		return 'encounter';
	}

	getItems() {
		return this.campaign?.encounters;
	}

	getViewTitle() {
		return 'Combat Encounters';
	}

	getItemId(encounter) {
		return encounter.encounter_id;
	}

	groupItems(encounters) {
		// Group by session if available
		const grouped = {};

		encounters.forEach((encounter) => {
			const session = encounter.session || 'Unknown Session';
			const key = `Session ${session}`;
			if (!grouped[key]) {
				grouped[key] = [];
			}
			grouped[key].push(encounter);
		});

		return grouped;
	}

	/**
	 * Override render to add actor filter functionality
	 */
	render(contentArea) {
		const items = this.getItems();

		if (!items?.length) {
			contentArea.innerHTML = `
				<div class="story-view-container">
					<div class="view-header"><h2>${this.getViewTitle()}</h2></div>
					<div class="no-content">No ${this.getViewTitle().toLowerCase()} available for this campaign.</div>
				</div>
			`;
			return;
		}

		const container = document.createElement('div');
		container.className = 'story-view-container';

		const header = document.createElement('div');
		header.className = 'view-header';
		header.innerHTML = `<h2>${this.getViewTitle()}</h2>`;

		const body = document.createElement('div');
		body.className = 'view-body';

		const listPanel = document.createElement('div');
		listPanel.className = 'view-list-panel';
		this.listPanel = listPanel;

		const detailPanel = document.createElement('div');
		detailPanel.className = 'view-detail-panel';

		// Add actor filter section at top of list panel
		const filterSection = this.#createActorFilter(items);
		listPanel.appendChild(filterSection);

		const groupedItems = this.groupItems(items);
		this.renderGroups(listPanel, groupedItems, detailPanel);

		// Handle URL targeting
		const targetId = this.getTargetFromUrl();
		let initialItem = null;

		if (targetId) {
			initialItem = this.findItemById(items, decodeURIComponent(targetId));

			if (initialItem) {
				setTimeout(() => {
					const targetElement = listPanel.querySelector(`[data-item-id="${this.getItemId(initialItem)}"]`);
					targetElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}, 100);
			}
		}

		this.selectItem(initialItem || items[0], detailPanel);

		body.append(listPanel, detailPanel);
		container.append(header, body);
		contentArea.appendChild(container);
	}

	/**
	 * Create actor filter dropdown
	 */
	#createActorFilter(encounters) {
		const filterContainer = document.createElement('div');
		filterContainer.className = 'encounter-filter-section';
		filterContainer.style.cssText = `
			padding: 0.75rem;
			background: rgba(255, 255, 255, 0.05);
			border-bottom: 1px solid rgba(192, 170, 118, 0.3);
			margin-bottom: 0.75rem;
		`;

		const label = document.createElement('label');
		label.textContent = 'Filter by Actor:';
		label.style.cssText = `
			display: block;
			font-size: 0.75rem;
			color: var(--color-border);
			text-transform: uppercase;
			letter-spacing: 0.0625rem;
			margin-bottom: 0.5rem;
			font-family: 'Noto Sans', var(--font-system);
		`;

		const select = document.createElement('select');
		select.className = 'actor-filter-select';
		select.style.cssText = `
			width: 100%;
			padding: 0.5rem;
			background: rgba(255, 255, 255, 0.1);
			border: 1px solid rgba(192, 170, 118, 0.3);
			border-radius: 0.25rem;
			color: var(--color-parchment);
			font-family: 'Noto Sans', var(--font-system);
			font-size: 0.85rem;
			cursor: pointer;
		`;

		// Collect unique actors from all encounters
		const actorSet = new Set();
		encounters.forEach((encounter) => {
			encounter.timeline?.forEach((entry) => {
				if (entry.actor) {
					actorSet.add(entry.actor);
				}
			});
		});

		const actors = Array.from(actorSet).sort();

		// Add "All" option
		const allOption = document.createElement('option');
		allOption.value = 'all';
		allOption.textContent = 'All Actors';
		select.appendChild(allOption);

		// Add individual actor options
		actors.forEach((actor) => {
			const option = document.createElement('option');
			option.value = actor;
			option.textContent = actor;
			select.appendChild(option);
		});

		// Handle filter change
		select.addEventListener('change', (e) => {
			this.#selectedActor = e.target.value;
			this.#applyActorFilter();
		});

		filterContainer.append(label, select);
		return filterContainer;
	}

	/**
	 * Apply actor filter to timeline entries
	 */
	#applyActorFilter() {
		const timelineEntries = document.querySelectorAll('.timeline-entry');
		
		timelineEntries.forEach((entry) => {
			const actor = entry.dataset.actor;
			
			if (this.#selectedActor === 'all' || actor === this.#selectedActor) {
				entry.style.display = '';
			} else {
				entry.style.display = 'none';
			}
		});

		// Show/hide "no results" message
		const timelineLog = document.querySelector('.timeline-log');
		if (timelineLog) {
			const visibleEntries = timelineLog.querySelectorAll('.timeline-entry:not([style*="display: none"])');
			
			let noResultsMsg = timelineLog.querySelector('.timeline-no-results');
			
			if (visibleEntries.length === 0) {
				if (!noResultsMsg) {
					noResultsMsg = document.createElement('div');
					noResultsMsg.className = 'timeline-no-results';
					noResultsMsg.style.cssText = `
						padding: 2rem;
						text-align: center;
						color: rgba(44, 35, 25, 0.5);
						font-style: italic;
					`;
					noResultsMsg.textContent = `No actions found for ${this.#selectedActor}`;
					timelineLog.appendChild(noResultsMsg);
				}
			} else {
				noResultsMsg?.remove();
			}
		}
	}

	/**
	 * Creates list item content with encounter summary
	 */
	createListItemContent(encounter) {
		const container = document.createElement('div');
		container.style.cssText = 'display: flex; flex-direction: column; gap: 0.25rem;';

		const name = document.createElement('span');
		name.className = 'view-item-name';
		name.textContent = encounter.encounter_name;

		const meta = document.createElement('span');
		meta.className = 'view-item-subtitle';
		const turnCount = encounter.timeline?.length || 0;
		meta.textContent = `${turnCount} action${turnCount !== 1 ? 's' : ''}`;

		container.append(name, meta);
		return container;
	}

	/**
	 * Creates the main detail view for a single encounter.
	 */
	createDetailContent(encounter) {
		this.#encounterData = encounter;

		const detail = document.createElement('div');
		detail.className = 'view-detail-content encounter-detail';

		// Header
		const header = this.#createEncounterHeader(encounter);
		detail.appendChild(header);

		// Timeline Log
		if (encounter.timeline?.length) {
			detail.appendChild(this.#createTimelineLog(encounter.timeline));
		}

		return detail;
	}

	#createEncounterHeader(encounter) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = encounter.encounter_name;

		const meta = document.createElement('div');
		meta.className = 'view-detail-meta';
		
		if (encounter.session) {
			const sessionTag = document.createElement('span');
			sessionTag.className = 'view-meta-tag';
			sessionTag.textContent = `Session ${encounter.session}`;
			meta.appendChild(sessionTag);
		}

		header.append(name, meta);
		return header;
	}

	/**
	 * Creates a vertical timeline log based on the 'timeline' array.
	 */
	#createTimelineLog(timeline) {
		const section = document.createElement('div');
		section.className = 'view-section encounter-timeline-section';

		const header = document.createElement('div');
		header.className = 'view-section-header';
		header.textContent = 'Combat Timeline';

		const content = document.createElement('div');
		content.className = 'view-section-content';

		const log = document.createElement('div');
		log.className = 'timeline-log';

		timeline.forEach((entry) => {
			const entryEl = this.#createTimelineEntry(entry);
			log.appendChild(entryEl);
		});

		content.appendChild(log);
		section.append(header, content);
		return section;
	}

/**
	 * Create individual timeline entry (Dota-style two-lane combat log)
	 */
	#createTimelineEntry(entry) {
		const firstEmptyDiv = document.createElement('div');
		const secondEmptyDiv = document.createElement('div');

		const entryEl = document.createElement('div');
		entryEl.className = 'timeline-entry';
		entryEl.dataset.actor = entry.actor; // Store actor for filtering

		// Add a helper class for styling based on actor
		const actorClass = entry.actor
			.toLowerCase()
			.split(' ')[0]
			.replace(/[^a-z0-9]/gi, '');
		entryEl.classList.add(`actor-${actorClass}`);

		// Determine if this is a party member or enemy
		const isParty = this.#isPartyMember(entry.actor);

		// Turn number (timestamp style) - always in center
		const turn = document.createElement('div');
		turn.className = 'timeline-turn';
		turn.textContent = entry.turn;

		// Action icon
		const icon = document.createElement('div');
		icon.className = `timeline-icon ${isParty ? 'left-icon' : 'right-icon'}`;
		icon.textContent = this.#getActionIcon(entry);

		// Main content
		const content = document.createElement('div');
		content.className = `timeline-content-line ${isParty ? 'left-lane' : 'right-lane'}`;
		content.innerHTML = this.#buildLogText(entry);

		// Append elements
		if (isParty) {
			entryEl.appendChild(content);
			entryEl.appendChild(icon);
			entryEl.appendChild(turn);
			entryEl.appendChild(firstEmptyDiv);
			entryEl.appendChild(secondEmptyDiv);
		} else {
			entryEl.appendChild(firstEmptyDiv);
			entryEl.appendChild(secondEmptyDiv);
			entryEl.appendChild(turn);
			entryEl.appendChild(icon);
			entryEl.appendChild(content);
		}

		return entryEl;
	}

	/**
	 * Determine if an actor is a party member
	 */
	#isPartyMember(actor) {
		const partyMembers = ['bonnie', 'soshi', 'norr', 'olek', 'kaedin'];
		const actorLower = actor.toLowerCase();
		return partyMembers.some(member => actorLower.includes(member));
	}

	/**
	 * Get icon emoji based on action type
	 */
	#getActionIcon(entry) {
		const actionType = entry.action_type?.toLowerCase() || '';
		const description = entry.action_description?.toLowerCase() || '';
		const spell = entry.spell?.toLowerCase() || '';
		
		// Check for specific action patterns
		if (actionType.includes('cast') || spell) return '🔮';
		if (actionType.includes('attack') || description.includes('attack')) return '⚔️';
		if (actionType.includes('damage')) return '💥';
		if (actionType.includes('heal') || description.includes('heal')) return '💚';
		if (actionType.includes('buff') || description.includes('gain')) return '✨';
		if (actionType.includes('debuff') || description.includes('lose')) return '🔻';
		if (actionType.includes('move')) return '🏃';
		if (actionType.includes('death') || actionType.includes('died')) return '💀';
		if (actionType.includes('summon') || description.includes('summon')) return '🌟';
		
		// Default
		return '⚡';
	}

	/**
	 * Build combat log text with color coding
	 */
	#buildLogText(entry) {
		const actor = `<span class="log-actor actor-${this.#sanitizeClassName(entry.actor)}">${entry.actor}</span>`;
		
		let logParts = [actor];

		// Build the main action description
		if (entry.action_description) {
			logParts.push(entry.action_description);
		}

		// Add spell if present
		if (entry.spell) {
			logParts.push(`<span class="log-spell">${entry.spell}</span>`);
		}

		// Add targets if present
		if (entry.targets) {
			const targets = Array.isArray(entry.targets) ? entry.targets : [entry.targets];
			const targetText = targets.map(t => 
				`<span class="log-target">${t}</span>`
			).join(', ');
			logParts.push('on ' + targetText);
		}

		// Add damage if present
		if (entry.damage) {
			logParts.push(`<span class="log-damage">(${entry.damage})</span>`);
		}

		// Add roll if present
		if (entry.roll) {
			logParts.push(`<span class="log-roll">[${entry.roll}]</span>`);
		}

		// Add effect if present
		if (entry.effect) {
			logParts.push(`<span class="log-effect">→ ${entry.effect}</span>`);
		}

		return logParts.join(' ');
	}

	/**
	 * Sanitize class name for CSS
	 */
	#sanitizeClassName(str) {
		return str
			.toLowerCase()
			.replace(/[^a-z0-9]/gi, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}
}