class StoryHelperEncounter extends StoryHelperBase {
	#encounterData;

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
		// Group by session if available, otherwise group all together
		// This can be adapted if your encounter object gets a "session_id"
		const grouped = {};

		encounters.forEach((encounter) => {
			const session = encounter.session || 'Encounter Log';
			if (!grouped[session]) {
				grouped[session] = [];
			}
			grouped[session].push(encounter);
		});

		return grouped;
	}

	/**
	 * Creates the main detail view for a single encounter.
	 * This has been modified to read from the 'timeline' array.
	 * @param {object} encounter - The encounter object from the JSON
	 * @returns {HTMLElement}
	 */
	createDetailContent(encounter) {
		this.#encounterData = encounter;

		const detail = document.createElement('div');
		detail.className = 'view-detail-content encounter-detail';

		// Header (This part works with the new JSON)
		const header = this.#createEncounterHeader(encounter);
		detail.appendChild(header);

		// Timeline Log (Replaces the old 'round_by_round' visualization)
		if (encounter.timeline?.length) {
			detail.appendChild(this.#createTimelineLog(encounter.timeline));
		}

		// Removed initiative_order, combat_summary, and post_combat sections
		// as they are not present in the new JSON structure.

		return detail;
	}

	#createEncounterHeader(encounter) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = encounter.encounter_name;

		header.appendChild(name);
		return header;
	}

	/**
	 * Creates a new vertical timeline log based on the 'timeline' array.
	 * @param {Array<object>} timeline - The encounter.timeline array
	 * @returns {HTMLElement}
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
			const entryEl = document.createElement('div');
			entryEl.className = 'timeline-entry';

			// Add a helper class for styling based on actor
			const actorClass = entry.actor
				.toLowerCase()
				.split(' ')[0]
				.replace(/[^a-z0-9]/gi, '');
			entryEl.classList.add(`actor-${actorClass}`);

			const entryHeader = document.createElement('div');
			entryHeader.className = 'timeline-entry-header';

			const turn = document.createElement('div');
			turn.className = 'timeline-turn';
			turn.textContent = `Turn ${entry.turn}`;

			const actor = document.createElement('div');
			actor.className = 'timeline-actor';
			actor.textContent = entry.actor;

			const actionType = document.createElement('div');
			actionType.className = 'timeline-action-type';
			actionType.textContent = entry.action_type;
			actionType.classList.add(`action-type-${entry.action_type.toLowerCase().replace(/\s+/g, '-')}`);

			entryHeader.append(turn, actor, actionType);

			const body = document.createElement('div');
			body.className = 'timeline-entry-body';

			const desc = document.createElement('p');
			desc.className = 'timeline-description';
			desc.textContent = entry.action_description;
			body.appendChild(desc);

			const details = document.createElement('ul');
			details.className = 'timeline-details';

			// Add details dynamically from the JSON
			if (entry.targets) {
				const targets = Array.isArray(entry.targets) ? entry.targets.join(', ') : entry.targets;
				details.innerHTML += `<li><strong>Targets:</strong> ${targets}</li>`;
			}
			if (entry.damage) {
				details.innerHTML += `<li><strong>Damage:</strong> ${entry.damage}</li>`;
			}
			if (entry.spell) {
				details.innerHTML += `<li><strong>Spell:</strong> ${entry.spell}</li>`;
			}
			if (entry.roll) {
				details.innerHTML += `<li><strong>Roll:</strong> ${entry.roll}</li>`;
			}
			if (entry.effect) {
				details.innerHTML += `<li><strong>Effect:</strong> ${entry.effect}</li>`;
			}

			// Only append details list if it has content
			if (details.children.length > 0) {
				body.appendChild(details);
			}

			entryEl.append(entryHeader, body);
			log.appendChild(entryEl);
		});

		content.appendChild(log);
		section.append(header, content);
		return section;
	}
}
