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
		// CHANGED: Use 'id' instead of 'encounter_id'
		return encounter.id;
}

	groupItems(encounters) {
		// This logic remains compatible, as encounters without a 'session'
		// will be grouped under 'Unknown Session'.
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
			// CHANGED: Must parse targetId as a number if encounter.id is a number
			const targetIdValue = /^\d+$/.test(targetId) ? parseInt(targetId, 10) : decodeURIComponent(targetId);
			initialItem = this.findItemById(items, targetIdValue);
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
		// CHANGED: Iterate new data structure (rounds -> actions)
encounters.forEach((encounter) => {
			encounter.rounds?.forEach((round) => {
				round.actions?.forEach((action) => {
					if (action.actor) {
						actorSet.add(action.actor);
					}
				});
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
		const timelineLog = document.querySelector('.timeline-log');
		if (!timelineLog) return;

		const timelineEntries = timelineLog.querySelectorAll('.timeline-entry');
		const roundHeaders = timelineLog.querySelectorAll('.timeline-round-header');

		// Filter individual action entries
timelineEntries.forEach((entry) => {
			const actor = entry.dataset.actor;
			
			if (this.#selectedActor === 'all' || actor === this.#selectedActor) {
				entry.style.display = '';
			} else {
				entry.style.display = 'none';
			}
		});

		// CHANGED: Show/hide round headers based on visible children
		roundHeaders.forEach((header) => {
			let nextElement = header.nextElementSibling;
			let hasVisibleActions = false;
			while (nextElement && !nextElement.classList.contains('timeline-round-header')) {
				if (nextElement.classList.contains('timeline-entry') && nextElement.style.display !== 'none') {
					hasVisibleActions = true;
					break;
				}
				nextElement = nextElement.nextElementSibling;
			}
			header.style.display = hasVisibleActions ? '' : 'none';
		});

// Show/hide "no results" message
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
				timelineLog.appendChild(noResultsMsg);
			}
			noResultsMsg.textContent = `No actions found for ${this.#selectedActor}`;
		} else {
			noResultsMsg?.remove();
}
	}

	/**
	 * Creates list item content with encounter summary
	 */
	createListItemContent(encounter) {
		const container = document.createElement('div');
		container.style.cssText = 'display: flex; flex-direction: column;
gap: 0.25rem;';

		const name = document.createElement('span');
		name.className = 'view-item-name';
		// CHANGED: Use 'name' instead of 'encounter_name'
		name.textContent = encounter.name;

		const meta = document.createElement('span');
		meta.className = 'view-item-subtitle';
		// CHANGED: Calculate action count from new structure
const actionCount = encounter.rounds?.reduce((sum, round) => sum + (round.actions?.length || 0), 0) || 0;
		meta.textContent = `${actionCount} action${actionCount !== 1 ? 's' : ''}`;

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
		// CHANGED: Check 'rounds' and pass 'rounds' to timeline log
		if (encounter.rounds?.length) {
			detail.appendChild(this.#createTimelineLog(encounter.rounds));
		}
		
		// Reset filter when new detail is created
		this.#selectedActor = 'all';
		// We also need to reset the dropdown UI itself
		const filterSelect = document.querySelector('.actor-filter-select');
		if (filterSelect) {
			filterSelect.value = 'all';
		}

		return detail;
}

	#createEncounterHeader(encounter) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		// CHANGED: Use 'name' instead of 'encounter_name'
		name.textContent = encounter.name;
const meta = document.createElement('div');
		meta.className = 'view-detail-meta';
		
		// This logic is still valid, will just not render if session is missing
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
	 * Creates a vertical timeline log based on the 'rounds' array.
*/
	// CHANGED: Function now accepts 'rounds' array instead of 'timeline'
	#createTimelineLog(rounds) {
		const section = document.createElement('div');
		section.className = 'view-section encounter-timeline-section';

		const header = document.createElement('div');
		header.className = 'view-section-header';
		header.textContent = 'Combat Timeline';
const content = document.createElement('div');
		content.className = 'view-section-content';

		const log = document.createElement('div');
		log.className = 'timeline-log';

		// CHANGED: Loop through rounds, then actions
		rounds.forEach((round) => {
			// Add a round header
			const roundHeader = document.createElement('div');
			roundHeader.className = 'timeline-round-header';
			roundHeader.textContent = `Round ${round.number}`;
			log.appendChild(roundHeader);
			
			// Add actions for this round
			round.actions?.forEach((action) => {
				const entryEl = this.#createTimelineEntry(action, round.number);
				log.appendChild(entryEl);
			});
		});
content.appendChild(log);
		section.append(header, content);
		return section;
	}

/**
	 * Create individual timeline entry (Dota-style two-lane combat log)
	 */
	// CHANGED: Function now accepts 'action' and 'roundNumber'
#createTimelineEntry(action, roundNumber) {
		const firstEmptyDiv = document.createElement('div');
const secondEmptyDiv = document.createElement('div');

		const entryEl = document.createElement('div');
		entryEl.className = 'timeline-entry';
		// CHANGED: Use 'action.actor'
		entryEl.dataset.actor = action.actor;
// Store actor for filtering

		// Add a helper class for styling based on actor
		const actorClass = action.actor
			.toLowerCase()
			.split(' ')[0]
			.replace(/[^a-z0-9]/gi, '');
		entryEl.classList.add(`actor-${actorClass}`);
// Determine if this is a party member or enemy
		// CHANGED: Use 'action.actor'
		const isParty = this.#isPartyMember(action.actor);
// Turn number (timestamp style) - always in center
		const turn = document.createElement('div');
		turn.className = 'timeline-turn';
		// CHANGED: Use 'roundNumber' instead of 'entry.turn'
		turn.textContent = `R${roundNumber}`;
// Action icon
		const icon = document.createElement('div');
		icon.className = `timeline-icon ${isParty ? 'left-icon' : 'right-icon'}`;
		// CHANGED: Pass 'action' to icon generator
		icon.textContent = this.#getActionIcon(action);
// Main content
		const content = document.createElement('div');
		content.className = `timeline-content-line ${isParty ? 'left-lane' : 'right-lane'}`;
		// CHANGED: Pass 'action' to text builder
		content.innerHTML = this.#buildLogText(action);
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
		// CHANGED: Added '...cats' to party list
		const partyMembers = ['bonnie', 'soshi', 'norr', 'olek', 'kaedin', 'cats'];
const actorLower = actor.toLowerCase();
		return partyMembers.some(member => actorLower.includes(member));
	}

	/**
	 * Get icon emoji based on action type
	 */
	// CHANGED: Function accepts 'action' and uses new properties
#getActionIcon(action) {
		const actionType = action.type?.toLowerCase() || '';
const description = action.name?.toLowerCase() || '';
const spell = (actionType === 'spell' || actionType === 'spell_attack') ? description : '';
		
// Check for specific action patterns
		if (actionType.includes('spell') || spell) return '🔮';
		if (actionType.includes('attack')) return '⚔️';
if (action.damage || actionType === 'lair_action') return '💥';
		if (actionType.includes('heal') || description.includes('heal')) return '💚';
		if (actionType.includes('buff') || description.includes('gain') || description.includes('mage armor') || description.includes('invisibility')) return '✨';
if (actionType.includes('debuff') || description.includes('lose') || description.includes('corruption') || action.condition === 'confusion') return '🔻';
		if (actionType.includes('move') || description.includes('move') || description.includes('teleport')) return '🏃';
		if (actionType.includes('death') || description.includes('died')) return '💀';
if (actionType.includes('summon') || description.includes('summon')) return '🌟';
		
		// Default
		return '⚡';
	}

	/**
	 * Build combat log text with color coding
	 */
	// CHANGED: Completely rewritten to parse the new 'action' object structure
#buildLogText(action) {
		const actor = `<span class="log-actor actor-${this.#sanitizeClassName(action.actor)}">${action.actor}</span>`;
let logParts = [actor];

		// 1. Build main action text (verb + name)
		let verb = '';
		const actionType = action.type?.toLowerCase() || '';

		switch (actionType) {
			case 'spell':
			case 'spell_attack':
				verb = 'casts';
				break;
			case 'attack':
				verb = 'attacks with';
				break;
			case 'movement':
				verb = 'moves';
				break;
			case 'check':
				verb = 'checks';
				break;
			case 'class_feature':
			case 'special_ability':
			case 'special_attack':
				verb = 'uses';
				break;
			case 'lair_action':
			case 'environment':
				verb = 'triggers'; // Actor is 'Environment'
				break;
			case 'condition_effect':
				verb = 'is affected by';
				break;
			case 'reaction':
				verb = 'reacts with';
				break;
			case 'wild_magic':
				verb = 'triggers Wild Magic';
				break;
			case 'bonus_action':
				verb = 'uses Bonus Action';
				break;
			case 'summon':
				verb = 'summons';
				break;
			default:
				verb = action.type; // Use the type itself if unknown
		}
		
		if (verb && action.name) {
			if (actionType === 'wild_magic') {
				logParts.push(verb); // "triggers Wild Magic"
			} else if (actionType === 'condition_effect' && action.condition) {
				logParts.push(`${verb} ${action.condition}`); // "is affected by Confusion"
			} else if (actionType === 'movement' && action.name) {
				logParts.push(`${verb} (${action.name})`); // "moves (Teleport)"
			} else {
				logParts.push(`${verb} <span class="log-spell">${action.name}</span>`);
			}
		} else if (action.name) {
			logParts.push(`<span class="log-spell">${action.name}</span>`);
		} else if (verb) {
			logParts.push(verb);
		}


		// 2. Add targets
if (action.targets) {
			const targets = Array.isArray(action.targets) ? action.targets : [action.targets];
const targetText = targets.map(t => 
				`<span class="log-target">${t}</span>`
			).join(', ');
			logParts.push('on ' + targetText);
		}

		// 3. Add damage
if (action.damage) {
			let damageText = '';
			if (typeof action.damage === 'object' && action.damage !== null) {
				if (action.damage.total) {
					damageText = `${action.damage.total} total`;
				} else if (action.damage.primary) {
					damageText = `${action.damage.primary}p, ${action.damage.secondary}s`;
				} else if (action.damage.fail) {
					damageText = `fail: ${action.damage.fail}, success: ${action.damage.success}`;
				} else {
					// Handle other damage objects, e.g., { olek: 7, others: 14 }
					damageText = Object.entries(action.damage).map(([key, val]) => `${key}: ${val}`).join(', ');
				}
			} else if (action.damage) {
				damageText = `${action.damage}`;
			}
			if (damageText) {
				logParts.push(`<span class="log-damage">(${damageText} damage)</span>`);
			}
		}

		// 4. Add roll
if (action.roll) {
			let rollText = '';
			if (typeof action.roll === 'object' && action.roll !== null) {
				const rollParts = Object.entries(action.roll).map(([key, val]) => {
					// Handle boolean flags like advantage/disadvantage
					if (typeof val === 'boolean') {
						return val ? key : '';
					}
					return `${key}: ${val}`;
				}).filter(Boolean); // Remove empty strings
				rollText = rollParts.join(', ');
			} else {
				rollText = `Roll: ${action.roll}`;
			}
			if(rollText) {
				logParts.push(`<span class="log-roll">[${rollText}]</span>`);
			}
		}
		
		// 5. Add effect/result
if (action.effect) {
			logParts.push(`<span class="log-effect">→ ${action.effect}</span>`);
		} else if (action.result) {
			logParts.push(`<span class="log-effect">→ ${action.result}</span>`);
		}

		// 6. Add notes
		if (action.notes) {
			logParts.push(`<span class="log-notes">(${action.notes})</span>`);
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