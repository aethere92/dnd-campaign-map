class StoryHelperEncounter extends StoryHelperBase {
	#selectedActor = 'all';

	constructor(campaign, placeholderProcessor) {
		super(campaign, placeholderProcessor);
	}

	// ===== Abstract Method Implementations =====

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
		return encounter.id;
	}

	groupItems(encounters) {
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

	// ===== Overridden Methods =====

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

		const detailPanel = document.createElement('div');
		detailPanel.className = 'view-detail-panel';

		// Add actor filter at top of list panel
		const filterSection = this.#createActorFilter(items);
		listPanel.appendChild(filterSection);

		const groupedItems = this.groupItems(items);
		this.renderGroups(listPanel, groupedItems, detailPanel);

		// Handle URL targeting
		const targetId = this.getTargetFromUrl();
		let initialItem = null;

		if (targetId) {
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

	createListItemContent(encounter) {
		const container = document.createElement('div');

		const name = document.createElement('span');
		name.className = 'view-item-name';
		name.textContent = encounter.name;

		const meta = document.createElement('span');
		meta.className = 'view-item-subtitle';
		const roundCount = encounter.rounds?.length || 0;
		const actionCount = encounter.rounds?.reduce((sum, round) => sum + (round.actions?.length || 0), 0) || 0;
		meta.textContent = `${roundCount} round${roundCount !== 1 ? 's' : ''}, ${actionCount} action${
			actionCount !== 1 ? 's' : ''
		}`;

		container.append(name, meta);
		return container;
	}

	createDetailContent(encounter) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content encounter-detail';

		// Header
		const header = this.#createEncounterHeader(encounter);
		detail.appendChild(header);

		// Environment Section
		if (encounter.environment) {
			const envSection = this.#createEnvironmentSection(encounter.environment, encounter.location);
			detail.appendChild(envSection);
			this.placeholderProcessor.processEntityReferences(envSection);
		}

		// Initiative Order
		if (encounter.initiative?.length) {
			const initSection = this.#createInitiativeSection(encounter.initiative);
			detail.appendChild(initSection);
			this.placeholderProcessor.processEntityReferences(initSection);
		}

		// Timeline Log
		if (encounter.rounds?.length) {
			const timelineSection = this.#createTimelineLog(encounter.rounds);
			detail.appendChild(timelineSection);
			this.placeholderProcessor.processEntityReferences(timelineSection);
		}

		// Outcome Section
		if (encounter.outcome) {
			const outcomeSection = this.#createOutcomeSection(encounter.outcome);
			detail.appendChild(outcomeSection);
			this.placeholderProcessor.processEntityReferences(outcomeSection);
		}

		// Post-Combat Section
		if (encounter.postCombat) {
			const postCombatSection = this.#createPostCombatSection(encounter.postCombat);
			detail.appendChild(postCombatSection);
			this.placeholderProcessor.processEntityReferences(postCombatSection);
		}

		// Reset filter state
		this.#resetFilter();

		return detail;
	}

	// ===== Actor Filter Methods =====

	#createActorFilter(encounters) {
		const filterContainer = document.createElement('div');
		filterContainer.className = 'encounter-filter-section';

		const label = document.createElement('label');
		label.textContent = 'Filter by Actor:';

		const select = document.createElement('select');
		select.className = 'actor-filter-select';

		// Collect unique actors
		const actorSet = new Set();
		encounters.forEach((encounter) => {
			encounter.rounds?.forEach((round) => {
				round.actions?.forEach((action) => {
					if (action.actor) {
						const cleanActor = this.#cleanEntityTags(action.actor);
						actorSet.add(JSON.stringify({ raw: action.actor, clean: cleanActor }));
					}
				});
			});
		});

		// Add "All" option
		const allOption = document.createElement('option');
		allOption.value = 'all';
		allOption.textContent = 'All Actors';
		select.appendChild(allOption);

		// Add individual actor options (sorted by clean name)
		const actors = Array.from(actorSet)
			.map((str) => JSON.parse(str))
			.sort((a, b) => a.clean.localeCompare(b.clean));

		actors.forEach(({ raw, clean }) => {
			const option = document.createElement('option');
			option.value = raw;
			option.textContent = clean;
			select.appendChild(option);
		});

		select.addEventListener('change', (e) => {
			this.#selectedActor = e.target.value;
			this.#applyActorFilter();
		});

		filterContainer.append(label, select);
		return filterContainer;
	}

	#applyActorFilter() {
		const timelineLog = document.querySelector('.timeline-log');
		if (!timelineLog) return;

		const timelineEntries = timelineLog.querySelectorAll('.timeline-entry');
		const roundHeaders = timelineLog.querySelectorAll('.timeline-round-header');

		timelineEntries.forEach((entry) => {
			const actor = entry.dataset.actor;
			const cleanActor = this.#cleanEntityTags(actor);
			const selectedClean = this.#cleanEntityTags(this.#selectedActor);
			entry.style.display = this.#selectedActor === 'all' || cleanActor === selectedClean ? '' : 'none';
		});

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

		const visibleEntries = timelineLog.querySelectorAll('.timeline-entry:not([style*="display: none"])');
		let noResultsMsg = timelineLog.querySelector('.timeline-no-results');

		if (visibleEntries.length === 0) {
			if (!noResultsMsg) {
				noResultsMsg = document.createElement('div');
				noResultsMsg.className = 'timeline-no-results';
				timelineLog.appendChild(noResultsMsg);
			}
			noResultsMsg.textContent = `No actions found for ${this.#cleanEntityTags(this.#selectedActor)}`;
		} else {
			noResultsMsg?.remove();
		}
	}

	#resetFilter() {
		this.#selectedActor = 'all';
		const filterSelect = document.querySelector('.actor-filter-select');
		if (filterSelect) {
			filterSelect.value = 'all';
		}
	}

	// ===== Header Creation =====

	#createEncounterHeader(encounter) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = encounter.name;

		const meta = document.createElement('div');
		meta.className = 'view-detail-meta';

		if (encounter.session) {
			const sessionTag = document.createElement('span');
			sessionTag.className = 'view-meta-tag';
			sessionTag.textContent = `Session ${encounter.session}`;
			meta.appendChild(sessionTag);
		}

		if (encounter.location) {
			const locationTag = document.createElement('span');
			locationTag.className = 'view-meta-tag';
			locationTag.textContent = encounter.location;
			meta.appendChild(locationTag);
		}

		header.append(name, meta);
		return header;
	}

	// ===== Environment Section =====

	#createEnvironmentSection(environment, location) {
		const section = document.createElement('div');
		section.className = 'view-section encounter-environment-section';

		const header = document.createElement('div');
		header.className = 'view-section-header';
		header.textContent = 'Environment';

		const content = document.createElement('div');
		content.className = 'view-section-content';

		if (environment.name) {
			const nameEl = document.createElement('div');
			nameEl.className = 'environment-name';
			nameEl.textContent = environment.name;
			content.appendChild(nameEl);
		}

		if (environment.terrain) {
			const terrainEl = document.createElement('div');
			terrainEl.className = 'environment-terrain';
			terrainEl.innerHTML = `<strong>Terrain:</strong> ${environment.terrain}`;
			content.appendChild(terrainEl);
		}

		if (environment.effects?.length) {
			const effectsContainer = document.createElement('div');
			effectsContainer.className = 'environment-effects';

			const effectsTitle = document.createElement('div');
			effectsTitle.className = 'environment-effects-title';
			effectsTitle.textContent = 'Environmental Effects:';
			effectsContainer.appendChild(effectsTitle);

			environment.effects.forEach((effect) => {
				const effectEl = document.createElement('div');
				effectEl.className = 'environment-effect-item';

				const effectName = document.createElement('strong');
				effectName.textContent = effect.name;
				effectEl.appendChild(effectName);

				if (effect.description) {
					const effectDesc = document.createElement('span');
					effectDesc.textContent = `: ${effect.description}`;
					effectEl.appendChild(effectDesc);
				}

				if (effect.radius) {
					const radiusSpan = document.createElement('span');
					radiusSpan.className = 'effect-radius';
					radiusSpan.textContent = ` (${effect.radius}ft radius)`;
					effectEl.appendChild(radiusSpan);
				}

				effectsContainer.appendChild(effectEl);
			});

			content.appendChild(effectsContainer);
		}

		section.append(header, content);
		return section;
	}

	// ===== Initiative Section =====

	#createInitiativeSection(initiative) {
		const section = document.createElement('div');
		section.className = 'view-section encounter-initiative-section';

		const header = document.createElement('div');
		header.className = 'view-section-header';
		header.textContent = 'Initiative Order';

		const content = document.createElement('div');
		content.className = 'view-section-content';

		const initList = document.createElement('div');
		initList.className = 'initiative-list';

		// Sort by initiative value (descending)
		const sorted = [...initiative].sort((a, b) => b.value - a.value);

		sorted.forEach((entry, index) => {
			const initItem = document.createElement('div');
			initItem.className = 'initiative-item';

			const rank = document.createElement('span');
			rank.className = 'initiative-rank';
			rank.textContent = `${index + 1}.`;

			const character = document.createElement('span');
			character.className = 'initiative-character';
			character.textContent = entry.character;

			const value = document.createElement('span');
			value.className = 'initiative-value';
			value.textContent = entry.value;

			initItem.append(rank, character, value);
			initList.appendChild(initItem);
		});

		content.appendChild(initList);
		section.append(header, content);
		return section;
	}

	// ===== Timeline Creation =====

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

		rounds.forEach((round) => {
			const roundHeader = document.createElement('div');
			roundHeader.className = 'timeline-round-header';
			roundHeader.textContent = `Round ${round.number}`;
			log.appendChild(roundHeader);

			round.actions?.forEach((action) => {
				const entryEl = this.#createTimelineEntry(action, round.number);
				log.appendChild(entryEl);
			});
		});

		content.appendChild(log);
		section.append(header, content);
		return section;
	}

	#createTimelineEntry(action, roundNumber) {
		const entryEl = document.createElement('div');
		entryEl.className = 'timeline-entry';
		entryEl.dataset.actor = this.#cleanEntityTags(action.actor) || '';

		const actorClass = this.#sanitizeClassName(this.#cleanEntityTags(action.actor));
		entryEl.classList.add(`actor-${actorClass}`);

		const isParty = this.#isPartyMember(action.actor);

		const turn = document.createElement('div');
		turn.className = 'timeline-turn';
		turn.textContent = `R${roundNumber}`;

		const icon = document.createElement('div');
		icon.className = `timeline-icon ${isParty ? 'left-icon' : 'right-icon'}`;
		icon.textContent = this.#getActionIcon(action);

		const content = document.createElement('div');
		content.className = `timeline-content-line ${isParty ? 'left-lane' : 'right-lane'}`;
		content.innerHTML = this.#buildLogText(action);

		const placeholderFirst = document.createElement('div');
		placeholderFirst.className = 'timeline-placeholder';
		const placeholderSecond = document.createElement('div');
		placeholderSecond.className = 'timeline-placeholder';

		if (isParty) {
			entryEl.append(content, icon, turn, placeholderFirst, placeholderSecond);
		} else {
			entryEl.append(placeholderFirst, placeholderSecond, turn, icon, content);
		}

		return entryEl;
	}

	// ===== Outcome Section =====

	#createOutcomeSection(outcome) {
		const section = document.createElement('div');
		section.className = 'view-section encounter-outcome-section';

		const header = document.createElement('div');
		header.className = 'view-section-header';
		header.textContent = 'Outcome';

		const content = document.createElement('div');
		content.className = 'view-section-content';

		if (outcome.status) {
			const statusEl = document.createElement('div');
			statusEl.className = `outcome-status status-${outcome.status.toLowerCase()}`;
			statusEl.textContent = `Status: ${outcome.status}`;
			content.appendChild(statusEl);
		}

		if (outcome.partyCondition) {
			const conditionEl = document.createElement('div');
			conditionEl.className = 'outcome-party-condition';
			conditionEl.innerHTML = `<strong>Party Condition:</strong> ${outcome.partyCondition}`;
			content.appendChild(conditionEl);
		}

		if (outcome.enemiesDefeated?.length) {
			const defeatedEl = this.#createListSection('Enemies Defeated', outcome.enemiesDefeated);
			content.appendChild(defeatedEl);
		}

		if (outcome.enemiesFled?.length) {
			const fledEl = this.#createListSection('Enemies Fled', outcome.enemiesFled);
			content.appendChild(fledEl);
		}

		if (outcome.casualties?.length) {
			const casualtiesEl = this.#createListSection('Casualties', outcome.casualties, 'outcome-casualties');
			content.appendChild(casualtiesEl);
		}

		if (outcome.itemsObtained?.length) {
			const itemsEl = this.#createListSection('Items Obtained', outcome.itemsObtained);
			content.appendChild(itemsEl);
		}

		if (outcome.complications?.length) {
			const complicationsEl = this.#createListSection('Complications', outcome.complications);
			content.appendChild(complicationsEl);
		}

		if (outcome.tacticalNotes?.length) {
			const tacticalEl = this.#createListSection('Tactical Notes', outcome.tacticalNotes);
			content.appendChild(tacticalEl);
		}

		if (outcome.consequences?.length) {
			const consequencesEl = this.#createListSection('Consequences', outcome.consequences);
			content.appendChild(consequencesEl);
		}

		section.append(header, content);
		return section;
	}

	// ===== Post-Combat Section =====

	#createPostCombatSection(postCombat) {
		const section = document.createElement('div');
		section.className = 'view-section encounter-postcombat-section';

		const header = document.createElement('div');
		header.className = 'view-section-header';
		header.textContent = 'Post-Combat';

		const content = document.createElement('div');
		content.className = 'view-section-content';

		if (postCombat.action) {
			const actionEl = document.createElement('div');
			actionEl.className = 'postcombat-action';
			actionEl.innerHTML = `<strong>Action:</strong> ${postCombat.action}`;
			content.appendChild(actionEl);
		}

		if (postCombat.healing) {
			const healingEl = document.createElement('div');
			healingEl.className = 'postcombat-healing';
			healingEl.innerHTML = `<strong>Healing:</strong> ${postCombat.healing.type}`;

			if (postCombat.healing.totalHealing) {
				const healAmount = document.createElement('div');
				healAmount.className = 'healing-amount';
				healAmount.textContent = `Amount: ${postCombat.healing.totalHealing}`;
				healingEl.appendChild(healAmount);
			}

			if (postCombat.healing.characters?.length) {
				const healChars = document.createElement('div');
				healChars.className = 'healing-characters';
				healChars.textContent = `Recipients: ${postCombat.healing.characters.join(', ')}`;
				healingEl.appendChild(healChars);
			}

			content.appendChild(healingEl);
		}

		if (postCombat.investigation?.length) {
			const invSection = document.createElement('div');
			invSection.className = 'postcombat-investigation';

			const invTitle = document.createElement('div');
			invTitle.className = 'investigation-title';
			invTitle.textContent = 'Investigation:';
			invSection.appendChild(invTitle);

			postCombat.investigation.forEach((inv) => {
				const invItem = document.createElement('div');
				invItem.className = 'investigation-item';

				const invHeader = document.createElement('div');
				invHeader.className = 'investigation-header';
				invHeader.innerHTML = `<strong>${inv.character}</strong> - ${inv.skill} (${inv.roll})`;
				invItem.appendChild(invHeader);

				if (inv.findings) {
					const findings = document.createElement('div');
					findings.className = 'investigation-findings';
					findings.textContent = inv.findings;
					invItem.appendChild(findings);
				}

				invSection.appendChild(invItem);
			});

			content.appendChild(invSection);
		}

		if (postCombat.itemsAcquired?.length) {
			const itemsEl = this.#createListSection('Items Acquired', postCombat.itemsAcquired);
			content.appendChild(itemsEl);
		}

		if (postCombat.partyStatus) {
			const statusSection = document.createElement('div');
			statusSection.className = 'postcombat-party-status';

			const statusTitle = document.createElement('div');
			statusTitle.className = 'party-status-title';
			statusTitle.textContent = 'Party Status:';
			statusSection.appendChild(statusTitle);

			if (postCombat.partyStatus.hp) {
				const hpEl = document.createElement('div');
				hpEl.innerHTML = `<strong>HP:</strong> ${postCombat.partyStatus.hp}`;
				statusSection.appendChild(hpEl);
			}

			if (postCombat.partyStatus.conditions?.length) {
				const conditionsEl = this.#createListSection(
					'Conditions',
					postCombat.partyStatus.conditions,
					'party-conditions'
				);
				statusSection.appendChild(conditionsEl);
			}

			if (postCombat.partyStatus.resources) {
				const resourcesEl = document.createElement('div');
				resourcesEl.innerHTML = `<strong>Resources:</strong> ${postCombat.partyStatus.resources}`;
				statusSection.appendChild(resourcesEl);
			}

			content.appendChild(statusSection);
		}

		if (postCombat.observations?.length) {
			const obsEl = this.#createListSection('Observations', postCombat.observations);
			content.appendChild(obsEl);
		}

		if (postCombat.nextSteps) {
			const nextStepsEl = document.createElement('div');
			nextStepsEl.className = 'postcombat-next-steps';
			nextStepsEl.innerHTML = `<strong>Next Steps:</strong> ${postCombat.nextSteps}`;
			content.appendChild(nextStepsEl);
		}

		section.append(header, content);
		return section;
	}

	// ===== Helper Methods =====

	#createListSection(title, items, className = '') {
		const container = document.createElement('div');
		container.className = `outcome-list-section ${className}`;

		const titleEl = document.createElement('div');
		titleEl.className = 'list-section-title';
		titleEl.textContent = `${title}:`;
		container.appendChild(titleEl);

		const list = document.createElement('ul');
		list.className = 'outcome-list';

		items.forEach((item) => {
			const li = document.createElement('li');
			li.textContent = item;
			list.appendChild(li);
		});

		container.appendChild(list);
		return container;
	}

	#isPartyMember(actor) {
		const partyMembers = ['bonnie', 'soshi', 'norr', 'olek', 'kaedin', 'cats', 'mishu', 'gica', 'megatherium'];
		const actorLower = (actor || '').toLowerCase();
		return partyMembers.some((member) => actorLower.includes(member));
	}

	#getActionIcon(action) {
		const actionType = action.type?.toLowerCase() || '';
		const description = (action.name || '').toLowerCase();

		// Death/Kill
		if (action.result?.toLowerCase().includes('kill') || action.result?.toLowerCase().includes('died')) return '💀';

		// Healing
		if (actionType.includes('heal') || description.includes('heal') || action.healing) return '💚';

		// Spells
		if (actionType.includes('spell') || actionType === 'class_feature') return '🔮';

		// Attacks
		if (actionType.includes('attack')) return '⚔️';

		// Damage/Abilities
		if (action.damage || actionType.includes('ability') || actionType.includes('passive')) return '💥';

		// Buffs
		if (actionType.includes('buff') || description.includes('gain') || description.includes('invisibility'))
			return '✨';

		// Debuffs/Conditions
		if (actionType.includes('debuff') || action.condition || actionType.includes('saving throw')) return '🔻';

		// Movement
		if (actionType.includes('move') || description.includes('move') || actionType.includes('arrival')) return '🏃';

		// Skills/Checks
		if (actionType.includes('check') || actionType.includes('knowledge')) return '🎲';

		// Reactions
		if (actionType.includes('reaction')) return '⚡';

		return '⚡';
	}

	#buildLogText(action) {
		const actor = `<span class="log-actor actor-${this.#sanitizeClassName(action.actor)}">${action.actor}</span>`;
		let logParts = [actor];

		// Main action
		const verb = this.#getActionVerb(action.type);
		const actionType = action.type?.toLowerCase() || '';

		if (verb && action.name) {
			if (actionType === 'movement' && action.name) {
				logParts.push(`${verb} (${action.name})`);
			} else {
				logParts.push(`${verb} <span class="log-spell">${action.name}</span>`);
			}
		} else if (action.name) {
			logParts.push(`<span class="log-spell">${action.name}</span>`);
		} else if (verb) {
			logParts.push(verb);
		}

		// Target(s)
		const targets = this.#extractTargets(action);
		if (targets.length) {
			const targetText = targets.map((t) => `<span class="log-target">${t}</span>`).join(', ');
			logParts.push('→ ' + targetText);
		}

		// Damage
		const damageText = this.#formatDamage(action);
		if (damageText) {
			logParts.push(`<span class="log-damage">${damageText}</span>`);
		}

		// Roll
		if (action.roll && typeof action.roll !== 'object') {
			logParts.push(`<span class="log-roll">[${action.roll}]</span>`);
		} else if (action.roll && typeof action.roll === 'object') {
			const rollStr = Object.entries(action.roll)
				.filter(([key, val]) => val !== null && val !== undefined)
				.map(([key, val]) => `${key}: ${val}`)
				.join(', ');
			if (rollStr) {
				logParts.push(`<span class="log-roll">[${rollStr}]</span>`);
			}
		}

		// Save DC
		if (action.saveDC) {
			logParts.push(`<span class="log-save">DC ${action.saveDC} ${action.saveType || 'save'}</span>`);
		}

		// Result/Effect
		if (action.result) {
			const resultClass = this.#getResultClass(action.result);
			logParts.push(`<span class="log-result ${resultClass}">${action.result}</span>`);
		}

		if (action.effect) {
			logParts.push(`<span class="log-effect">${action.effect}</span>`);
		}

		if (action.additionalEffect) {
			logParts.push(`<span class="log-effect">${action.additionalEffect}</span>`);
		}

		// Condition
		if (action.condition) {
			logParts.push(`<span class="log-condition">${action.condition}</span>`);
		}

		// Duration
		if (action.duration) {
			logParts.push(`<span class="log-duration">(${action.duration})</span>`);
		}

		// Notes
		if (action.notes) {
			logParts.push(`<span class="log-notes">${action.notes}</span>`);
		}

		return logParts.join(' ');
	}

	#extractTargets(action) {
		const targets = [];

		if (action.target) targets.push(action.target);
		if (action.primaryTarget) targets.push(action.primaryTarget);
		if (action.secondaryTarget) targets.push(`${action.secondaryTarget} (secondary)`);
		if (action.targets) {
			const targetArray = Array.isArray(action.targets) ? action.targets : [action.targets];
			targets.push(...targetArray);
		}

		return targets;
	}

	#formatDamage(action) {
		const parts = [];

		if (action.damage) {
			const dmgType = action.damageType ? ` ${action.damageType}` : '';
			parts.push(`${action.damage}${dmgType} dmg`);
		}

		if (action.primaryDamage) {
			parts.push(`${action.primaryDamage} primary`);
		}

		if (action.secondaryDamage) {
			parts.push(`${action.secondaryDamage} secondary`);
		}

		if (action.healing) {
			parts.push(`${action.healing} healing`);
		}

		return parts.length ? `(${parts.join(', ')})` : '';
	}

	#getActionVerb(actionType) {
		const type = actionType?.toLowerCase() || '';
		const verbMap = {
			spell: 'casts',
			spell_attack: 'casts',
			'spell effect': 'triggers',
			attack: 'attacks with',
			movement: 'moves',
			'skill check': 'checks',
			check: 'checks',
			class_feature: 'uses',
			'class feature': 'uses',
			ability: 'uses',
			special_ability: 'uses',
			special_attack: 'uses',
			'passive ability': 'triggers',
			lair_action: 'triggers',
			environment: 'triggers',
			condition_effect: 'suffers',
			reaction: 'reacts with',
			wild_magic: 'triggers Wild Magic',
			bonus_action: 'uses',
			'held action': 'readies',
			summon: 'summons',
			arrival: 'arrives',
			'saving throw': 'rolls',
			'knowledge recall': 'recalls',
		};
		return verbMap[type] || type;
	}

	#getResultClass(result) {
		const resultLower = result.toLowerCase();
		if (resultLower.includes('kill') || resultLower.includes('died')) return 'result-kill';
		if (resultLower.includes('crit') || resultLower.includes('critical')) return 'result-crit';
		if (resultLower.includes('hit')) return 'result-hit';
		if (resultLower.includes('miss')) return 'result-miss';
		if (resultLower.includes('success')) return 'result-success';
		if (resultLower.includes('fail')) return 'result-fail';
		return '';
	}

	#sanitizeClassName(str) {
		if (!str) return '';
		return str
			.toLowerCase()
			.replace(/[^a-z0-9]/gi, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}

	#cleanEntityTags(str) {
		if (!str) return '';
		return str.replace(/\[ENTITY:[^\]]+:([^\]]+)\]/gi, '$1');
	}
}
