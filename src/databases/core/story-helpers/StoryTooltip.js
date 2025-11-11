class StoryHelperTooltip {
	#tooltipContainer;
	#dataRegistry;
	#campaignId;
	#supabaseClient;
	#apiBaseUrl = 'https://www.dnd5eapi.co/api/2014/';

	constructor(campaignData = {}, supabaseClient = null) {
		this.#campaignId = campaignData.campaignId;
		this.#supabaseClient = supabaseClient;
		this.#dataRegistry = this.#buildDataRegistry(campaignData);
		this.#createTooltipContainer();
	}

	// Build unified data registry from all campaign data
	#buildDataRegistry(campaignData) {
		const registry = {
			character: {},
			npc: {},
			location: {},
			faction: {},
			guild: {},
			quest: {},
			item: {},
			encounter: {},
			// Standard D&D entities
			spell: {},
			monster: {},
			class: {},
			race: {},
			equipment: {},
			condition: {},
			feat: {},
		};

		// Register characters
		if (campaignData.characters) {
			campaignData.characters.forEach((char) => {
				const key = char.name.toLowerCase();
				registry.character[key] = char;
			});
		}

		// Register NPCs
		if (campaignData.npcs) {
			campaignData.npcs.forEach((npc) => {
				const key = npc.name.toLowerCase();
				registry.npc[key] = npc;
				// Also register by id for relationship lookups
				registry.npc[npc.id] = npc;
			});
		}

		// Register locations
		if (campaignData.locations) {
			campaignData.locations.forEach((loc) => {
				const key = loc.name.toLowerCase();
				registry.location[key] = loc;
				// Also register by id
				if (loc.id) {
					registry.location[loc.id] = loc;
				}
			});
		}

		// Register quests
		if (campaignData.quests) {
			campaignData.quests.forEach((quest) => {
				const key = quest.title.toLowerCase();
				registry.quest[key] = quest;
				// Also register by id
				if (quest.id) {
					registry.quest[quest.id] = quest;
				}
			});
		}

		// Register factions
		if (campaignData.factions) {
			campaignData.factions.forEach((faction) => {
				const key = faction.name.toLowerCase();
				registry.faction[key] = faction;
				// Also register by id
				if (faction.id) {
					registry.faction[faction.id] = faction;
				}
			});
		}

		// Register encounters
		if (campaignData.encounters) {
			campaignData.encounters.forEach((enc) => {
				const key = enc.name.toLowerCase();
				registry.encounter[key] = enc;
				// Also register by id
				if (enc.id) {
					registry.encounter[enc.id] = enc;
				}
			});
		}

		// Register spells (local DB)
		if (typeof DND_SPELL_DB !== 'undefined' && DND_SPELL_DB) {
			DND_SPELL_DB.forEach((spell) => {
				const key = spell.spellName.toLowerCase();
				registry.spell[key] = spell;

				if (spell.id) {
					registry.spell[spell.id] = spell;
				}
			});
		}

		return registry;
	}

	// Generate navigation URL for an entity
	#generateNavigationUrl(entityType, data) {
		if (!this.#campaignId) return null;

		const urlMap = {
			character: (data) => `?campaign=${this.#campaignId}&character=${encodeURIComponent(data.name)}`,
			npc: (data) => `?campaign=${this.#campaignId}&view=npcs&npc=${encodeURIComponent(data.id)}`,
			location: (data) =>
				`?campaign=${this.#campaignId}&view=locations&location=${encodeURIComponent(data.id || data.name)}`,
			quest: (data) => `?campaign=${this.#campaignId}&view=quests&quest=${encodeURIComponent(data.title)}`,
			faction: (data) =>
				`?campaign=${this.#campaignId}&view=factions&faction=${encodeURIComponent(data.id || data.name)}`,
			encounter: (data) =>
				`?campaign=${this.#campaignId}&view=encounters&encounter=${encodeURIComponent(data.id || data.name)}`,
		};

		const urlGenerator = urlMap[entityType];
		return urlGenerator ? urlGenerator(data) : null;
	}

	// Create a navigation link element if applicable
	#createNavigationLink(entityType, data) {
		const url = this.#generateNavigationUrl(entityType, data);
		if (!url) return '';

		return `
            <div class="tooltip-navigation">
                <a href="${url}" class="tooltip-nav-link" onclick="event.stopPropagation();">
                    <span class="tooltip-nav-icon">→</span>
                    View Full Details
                </a>
            </div>
        `;
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

	addTooltip(element, entityType, entityName) {
		element.classList.add(`entity-${entityType}`);
		element.style.cursor = 'help';

		let hideTimeout;

		const showTooltip = async (e) => {
			e.stopPropagation();
			clearTimeout(hideTimeout);
			await this.#showTooltip(element, entityType, entityName);
		};

		const hideTooltip = () => {
			hideTimeout = setTimeout(() => {
				this.#tooltipContainer.style.display = 'none';
			}, 300);
		};

		const keepTooltip = () => {
			clearTimeout(hideTimeout);
		};

		element.addEventListener('mouseover', showTooltip);
		element.addEventListener('mouseout', hideTooltip);

		// Allow interaction with tooltip itself
		this.#tooltipContainer.addEventListener('mouseover', keepTooltip);
		this.#tooltipContainer.addEventListener('mouseout', hideTooltip);
	}

	async #showTooltip(element, entityType, entityName) {
		// Show loading state
		this.#tooltipContainer.innerHTML = `
            <div class="entity-tooltip loading">
                <div class="tooltip-header">
                    <h3>${entityName}</h3>
                </div>
                <div class="tooltip-content">
                    <div>Loading...</div>
                </div>
            </div>
        `;
		this.#tooltipContainer.style.display = 'block';
		this.#positionTooltip(element);

		try {
			const entityData = await this.#fetchEntityData(entityType, entityName);

			if (entityData) {
				this.#tooltipContainer.innerHTML = this.#generateTooltipContent(entityType, entityData);
				this.#positionTooltip(element);
			} else {
				this.#tooltipContainer.innerHTML = `
                    <div class="entity-tooltip error">
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
                <div class="entity-tooltip error">
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
	}

	async #fetchEntityData(entityType, entityName) {
		const normalizedName = entityName.toLowerCase().trim();

		// Special handling for spells - try Supabase first
		if (entityType === 'spell') {
			return await this.#fetchSpellData(normalizedName);
		}

		// Check local registry first for other entity types
		if (this.#dataRegistry[entityType]) {
			const data = this.#dataRegistry[entityType][normalizedName];
			if (data) {
				return data;
			}
		}

		// Fall back to D&D 5e API for standard entities
		if (['monster', 'class', 'race', 'equipment', 'condition', 'feat'].includes(entityType)) {
			return await this.#fetchFromDndApi(entityType, entityName);
		}

		return null;
	}

	/**
	 * Fetch spell data with Supabase priority and multiple fallbacks
	 */
	async #fetchSpellData(spellName) {
		// Try Supabase first with timeout
		if (this.#supabaseClient?.isReady()) {
			try {
				const supabaseData = await Promise.race([
					this.#fetchSpellFromSupabase(spellName),
					new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase timeout')), 1000)),
				]);

				if (supabaseData) {
					return this.#transformSpellFromSupabase(supabaseData);
				}
			} catch (error) {
				console.warn('Failed to fetch spell from Supabase, trying fallbacks:', error);
			}
		}

		// Fallback 1: Local registry (DND_SPELL_DB)
		if (this.#dataRegistry.spell[spellName]) {
			return this.#dataRegistry.spell[spellName];
		}

		// Fallback 2: D&D 5e API
		try {
			return await this.#fetchFromDndApi('spell', spellName);
		} catch (error) {
			console.warn('Failed to fetch spell from D&D API:', error);
			return null;
		}
	}

	/**
	 * Fetch spell from Supabase
	 */
	async #fetchSpellFromSupabase(spellName) {
		try {
			const data = await this.#supabaseClient.fetchSpellByName(spellName);

			// Return first result if array, or null if empty
			if (Array.isArray(data) && data.length > 0) {
				return data[0];
			}

			return data || null;
		} catch (error) {
			console.error('Supabase spell fetch error:', error);
			throw error;
		}
	}

	/**
	 * Transform Supabase spell data to match expected format
	 */
	#transformSpellFromSupabase(supabaseSpell) {
		if (!supabaseSpell) return null;

		// Map Supabase column names to expected format
		return {
			spellName: supabaseSpell.spell_name || supabaseSpell.spellName,
			level: supabaseSpell.level,
			spellClass: supabaseSpell.school || supabaseSpell.spellClass,
			castingTime: supabaseSpell.casting_time || supabaseSpell.castingTime,
			range: supabaseSpell.range,
			components: supabaseSpell.components,
			duration: supabaseSpell.duration,
			description: supabaseSpell.description || supabaseSpell.desc,
			classes: supabaseSpell.classes || [],
			source: supabaseSpell.source,
			// Include any other fields from Supabase
			...supabaseSpell,
		};
	}

	async #fetchFromDndApi(entityType, entityName) {
		const endpoints = {
			spell: 'spells',
			monster: 'monsters',
			class: 'classes',
			race: 'races',
			equipment: 'equipment',
			condition: 'conditions',
			feat: 'feats',
		};

		const endpoint = endpoints[entityType];
		if (!endpoint) return null;

		const formattedName = entityName.toLowerCase().replace(/\s+/g, '-');

		try {
			const response = await fetch(`${this.#apiBaseUrl}${endpoint}/${formattedName}`);
			if (response.ok) {
				return await response.json();
			}

			// Try search as fallback
			const searchResponse = await fetch(`${this.#apiBaseUrl}${endpoint}?name=${encodeURIComponent(entityName)}`);

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
			console.error(`Error fetching ${entityType} data:`, error);
			throw error;
		}
	}

	#generateTooltipContent(entityType, data) {
		const generators = {
			character: this.#generateCharacterTooltip.bind(this),
			npc: this.#generateNPCTooltip.bind(this),
			location: this.#generateLocationTooltip.bind(this),
			quest: this.#generateQuestTooltip.bind(this),
			faction: this.#generateFactionTooltip.bind(this),
			encounter: this.#generateEncounterTooltip.bind(this),
			spell: this.#generateSpellTooltip.bind(this),
			monster: this.#generateMonsterTooltip.bind(this),
			class: this.#generateClassTooltip.bind(this),
			race: this.#generateRaceTooltip.bind(this),
		};

		const generator = generators[entityType];
		if (!generator) {
			return this.#generateGenericTooltip(data);
		}

		return generator(data);
	}

	// Character tooltip
	#generateCharacterTooltip(data) {
		const navLink = this.#createNavigationLink('character', data);

		return `
            <div class="entity-tooltip entity-character-tooltip">
                <div class="tooltip-header">
                    ${data.icon ? `<img src="${data.icon}" alt="${data.name}" />` : ''}
                    <h3>${data.name}</h3>
                </div>
                <div class="tooltip-content">
                    <div class="tooltip-meta">
                        <span><strong>Race:</strong> ${data.race}</span>
                        <span><strong>Class:</strong> ${data.class}</span>
                        <span><strong>Level:</strong> ${data.level}</span>
                    </div>
                    ${this.#generateAbilityScores(data.stats?.abilityScores)}
                    <div class="tooltip-description">${data.shortDescription || ''}</div>
                </div>
                <div class="tooltip-footer">${navLink}</div>
            </div>
        `;
	}

	// NPC tooltip
	#generateNPCTooltip(data) {
		const navLink = this.#createNavigationLink('npc', data);

		const relationships =
			data.relationships
				?.map((rel) => {
					const relatedNpc = this.#dataRegistry.npc[rel.npcId];
					return `<li><strong>${rel.type}:</strong> ${relatedNpc?.name || rel.npcId} - ${rel.description}</li>`;
				})
				.join('') || '';

		return `
            <div class="entity-tooltip entity-npc-tooltip">
                <div class="tooltip-header">
                    <h3>${data.name}</h3>
                    <span class="affinity-badge ${data.affinity?.toLowerCase()}">${data.affinity}</span>
                </div>
                <div class="tooltip-content">
                    <div class="tooltip-meta">
                        <span><strong>Race:</strong> ${data.race}</span>
                        <span><strong>Class:</strong> ${data.class}</span>
                        <span><strong>Status:</strong> ${data.status}</span>
                    </div>
                    <div class="tooltip-container"><strong>Role:</strong> ${data.role}</div>
                    ${
											data.faction
												? `<div class="tooltip-container"><strong>Faction:</strong> ${data.faction}</div>`
												: ''
										}
                    <div class="tooltip-container">${data.description}</div>
                    ${
											data.personality
												? `<div class="tooltip-container"><strong>Personality:</strong> ${data.personality}</div>`
												: ''
										}
                    ${
											relationships
												? `<div class="tooltip-container"><strong>Relationships:</strong><ul>${relationships}</ul></div>`
												: ''
										}
                    ${
											data.location
												? `<div class="tooltip-container"><strong>Location:</strong> ${data.location.primary}${
														data.location.specific ? ` (${data.location.specific})` : ''
												  }</div>`
												: ''
										}
                </div>
                <div class="tooltip-footer">${navLink}</div>
            </div>
        `;
	}

	// Location tooltip
	#generateLocationTooltip(data) {
		const navLink = this.#createNavigationLink('location', data);

		return `
            <div class="entity-tooltip entity-location-tooltip">
                <div class="tooltip-header">
                    <h3>${data.name}</h3>
                    <span class="location-type">${data.type}</span>
                </div>
                <div class="tooltip-content">
                    ${data.region ? `<div><strong>Region:</strong> ${data.region}</div>` : ''}
                    ${data.population ? `<div><strong>Population:</strong> ${data.population}</div>` : ''}
                    ${data.ruler ? `<div><strong>Ruler:</strong> ${data.ruler}</div>` : ''}
                    <div class="tooltip-description">${data.description}</div>
                    ${
											data.features?.length
												? `<div class="tooltip-features"><strong>Features:</strong><ul>${data.features
														.map((f) => `<li>${f}</li>`)
														.join('')}</ul></div>`
												: ''
										}
                    ${
											data.threats?.length
												? `<div class="tooltip-threats"><strong>Threats:</strong><ul>${data.threats
														.map((t) => `<li>${t}</li>`)
														.join('')}</ul></div>`
												: ''
										}
                </div>
                <div class="tooltip-footer">${navLink}</div>
            </div>
        `;
	}

	// Faction tooltip
	#generateFactionTooltip(data) {
		const navLink = this.#createNavigationLink('faction', data);

		return `
            <div class="entity-tooltip entity-faction-tooltip">
                <div class="tooltip-header">
                    <h3>${data.name}</h3>
                    <span class="faction-type">${data.type}</span>
                </div>
                <div class="tooltip-content">
                    ${
											data.location
												? `<div><strong>Location:</strong> ${data.location}${
														data.sublocation ? `: ${data.sublocation}` : ''
												  }</div>`
												: ''
										}
                    ${data.leader ? `<div><strong>Leader:</strong> ${data.leader}</div>` : ''}
                    <div class="tooltip-description">${data.description}</div>
                    ${
											data.npcs?.length
												? `<div class="tooltip-features"><strong>NPCs:</strong><ul>${data.npcs
														.map((f) => `<li>${f}</li>`)
														.join('')}</ul></div>`
												: ''
										}
                </div>
                <div class="tooltip-footer">${navLink}</div>
            </div>
        `;
	}

	// Quest tooltip
	#generateQuestTooltip(data) {
		const navLink = this.#createNavigationLink('quest', data);
		const latestSession = data.sessions?.[data.sessions.length - 1];

		return `
            <div class="entity-tooltip entity-quest-tooltip">
                <div class="tooltip-header">
                    <h3>${data.title}</h3>
                    <span class="quest-status ${data.status?.toLowerCase()}">${data.status}</span>
                </div>
                <div class="tooltip-content">
                    <div><strong>Priority:</strong> ${data.priority}</div>
                    <div class="tooltip-objective"><strong>Current Objective:</strong> ${data.current_objective}</div>
                    ${
											latestSession
												? `
                    <div class="tooltip-latest-update">
                        <strong>Latest Update (Session ${latestSession.session}):</strong>
                        <p>${latestSession.description}</p>
                    </div>
                    `
												: ''
										}
                </div>
                <div class="tooltip-footer">${navLink}</div>
            </div>
        `;
	}

	/**
	 * Helper to generate an HTML list for the encounter's initiative order.
	 */
	#generateInitiativeList(initiative) {
		if (!initiative || initiative.length === 0) {
			return '';
		}

		const cleanName = (name) => name.replace(/\[ENTITY:.*?:(.*?)]/, '$1');

		const listItems = initiative
			.map((item) => {
				const name = cleanName(item.character);
				const value = item.value ? `(Initiative: ${item.value})` : '';
				const notes = item.notes ? `- ${item.notes}` : '';
				return `<li><strong>${name}</strong> ${value} ${notes}</li>`;
			})
			.join('');

		return `
            <div class="tooltip-list">
                <strong>Participants:</strong>
                <ul>${listItems}</ul>
            </div>
        `;
	}

	// Encounter tooltip
	#generateEncounterTooltip(data) {
		const navLink = this.#createNavigationLink('encounter', data);

		let locationName = data.location;
		if (locationName && this.#dataRegistry.location[locationName]) {
			locationName = this.#dataRegistry.location[locationName].name;
		} else if (locationName && this.#dataRegistry.location[locationName.toLowerCase()]) {
			locationName = this.#dataRegistry.location[locationName.toLowerCase()].name;
		}

		const outcome = data.outcome || {};
		const status = outcome.status || data.status;

		const renderList = (title, items) => {
			if (!items || items.length === 0) return '';
			const cleanItem = (item) => item.replace(/\[ENTITY:.*?:(.*?)]/, '$1');
			const listItems = items.map((item) => `<li>${cleanItem(item)}</li>`).join('');
			return `<div class="tooltip-list"><strong>${title}:</strong><ul>${listItems}</ul></div>`;
		};

		const initiativeList = this.#generateInitiativeList(data.initiative);
		const enemiesList = renderList('Enemies Defeated', outcome.enemiesDefeated);
		const casualtiesList = renderList('Casualties', outcome.casualties);
		const itemsList = renderList('Items Obtained', outcome.itemsObtained);
		const complicationsList = renderList('Complications', outcome.complications);

		return `
            <div class="entity-tooltip entity-encounter-tooltip">
                <div class="tooltip-header">
                    <h3>${data.name}</h3>
                    ${status ? `<span class="encounter-status ${status.toLowerCase()}">${status}</span>` : ''}
                </div>
                <div class="tooltip-content">
                    ${locationName ? `<div><strong>Location:</strong> ${locationName}</div>` : ''}
                    ${data.rounds ? `<div><strong>Duration:</strong> ${data.rounds.length} rounds</div>` : ''}
                    ${
											outcome.partyCondition
												? `<div><strong>Party Condition:</strong> ${outcome.partyCondition}</div>`
												: ''
										}
                    
                    ${data.description ? `<div class="tooltip-description">${data.description}</div>` : ''}

                    ${initiativeList}
                    ${enemiesList}
                    ${casualtiesList}
                    ${itemsList}
                    ${complicationsList}
                </div>
                <div class="tooltip-footer">${navLink}</div>
            </div>
        `;
	}

	// Spell tooltip
	#generateSpellTooltip(data) {
		return `
            <div class="entity-tooltip entity-spell-tooltip">
                <div class="tooltip-header">
                    <h3>${data.spellName}</h3>
                    <span class="spell-level">Level ${data.level == 0 ? 'Cantrip' : data?.level ?? 'Cantrip'}</span>
                </div>
                <div class="tooltip-content">
                    <div class="tooltip-meta">
                        <span><strong>School:</strong> ${data.spellClass || 'Unknown'}</span>
                        <span><strong>Casting Time:</strong> ${data.castingTime}</span>
                        <span><strong>Range:</strong> ${data.range}</span>
                    </div>
                    <div><strong>Components:</strong> ${data?.components}</div>
                    <div><strong>Duration:</strong> ${data.duration}</div>
                    ${data.classes?.length ? `<div><strong>Classes:</strong> ${data.classes.join(', ')}</div>` : ''}
                    <div class="tooltip-description">${data?.description || 'No description available.'}</div>
                    <div><strong>Source:</strong> ${data?.source || 'No source available.'}</div>
                </div>
            </div>
        `;
	}

	// Monster tooltip
	#generateMonsterTooltip(data) {
		return `
            <div class="entity-tooltip entity-monster-tooltip">
                <div class="tooltip-header">
                    <h3>${data.name}</h3>
                    <span class="monster-cr">CR ${data.challenge_rating}</span>
                </div>
                <div class="tooltip-content">
                    <div class="tooltip-meta">
                        <span><strong>Type:</strong> ${data.type}</span>
                        <span><strong>Size:</strong> ${data.size}</span>
                        <span><strong>Alignment:</strong> ${data.alignment}</span>
                    </div>
                    <div class="tooltip-stats">
                        <span><strong>AC:</strong> ${data.armor_class?.[0]?.value || data.armor_class}</span>
                        <span><strong>HP:</strong> ${data.hit_points} (${data.hit_points_roll})</span>
                        <span><strong>Speed:</strong> ${Object.entries(data.speed || {})
													.map(([k, v]) => `${k} ${v}`)
													.join(', ')}</span>
                    </div>
                    ${this.#generateAbilityScores(data)}
                </div>
            </div>
        `;
	}

	// Class tooltip
	#generateClassTooltip(data) {
		return `
            <div class="entity-tooltip entity-class-tooltip">
                <div class="tooltip-header">
                    <h3>${data.name}</h3>
                </div>
                <div class="tooltip-content">
                    <div><strong>Hit Die:</strong> d${data.hit_die}</div>
                    <div><strong>Primary Ability:</strong> ${data.saving_throws?.map((s) => s.name).join(', ')}</div>
                    ${
											data.proficiencies?.length
												? `<div><strong>Proficiencies:</strong> ${data.proficiencies
														.slice(0, 5)
														.map((p) => p.name)
														.join(', ')}${data.proficiencies.length > 5 ? '...' : ''}</div>`
												: ''
										}
                    ${
											data.spellcasting
												? `<div><strong>Spellcasting Ability:</strong> ${data.spellcasting.spellcasting_ability?.name}</div>`
												: ''
										}
                </div>
            </div>
        `;
	}

	// Race tooltip
	#generateRaceTooltip(data) {
		return `
            <div class="entity-tooltip entity-race-tooltip">
                <div class="tooltip-header">
                    <h3>${data.name}</h3>
                </div>
                <div class="tooltip-content">
                    <div><strong>Size:</strong> ${data.size}</div>
                    <div><strong>Speed:</strong> ${data.speed} ft.</div>
                    ${
											data.ability_bonuses?.length
												? `<div><strong>Ability Bonuses:</strong> ${data.ability_bonuses
														.map((ab) => `${ab.ability_score.name} +${ab.bonus}`)
														.join(', ')}</div>`
												: ''
										}
                    ${
											data.traits?.length
												? `<div><strong>Traits:</strong> ${data.traits.map((t) => t.name).join(', ')}</div>`
												: ''
										}
                </div>
            </div>
        `;
	}

	// Generic fallback
	#generateGenericTooltip(data) {
		return `
            <div class="entity-tooltip">
                <div class="tooltip-header">
                    <h3>${data.name || data.title || 'Unknown'}</h3>
                </div>
                <div class="tooltip-content">
                    <div class="tooltip-description">${
											data.description || data.desc || JSON.stringify(data, null, 2)
										}</div>
                </div>
            </div>
        `;
	}

	// Helper to generate ability scores display
	#generateAbilityScores(scores) {
		if (!scores) return '';

		const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
		const scoreElements = abilities
			.map((ability) => {
				const score = scores[ability] || scores[ability.toLowerCase()];
				if (!score) return '';
				return `<div class="ability-score"><span class="ability-name">${ability}</span><span class="ability-value">${score}</span></div>`;
			})
			.filter(Boolean)
			.join('');

		return scoreElements ? `<div class="tooltip-ability-scores">${scoreElements}</div>` : '';
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

		let position =
			space.below >= tooltipRect.height
				? 'below'
				: space.above >= tooltipRect.height
				? 'above'
				: space.right >= tooltipRect.width
				? 'right'
				: 'left';

		// Failsafe if all directions are bad
		if (position === 'left' && space.left < tooltipRect.width) {
			position = 'below';
		}

		const buffer = 8;
		let coords = { top: 0, left: 0 };

		switch (position) {
			case 'below':
				coords.top = elementRect.bottom + viewport.scrollY + buffer;
				coords.left = elementRect.left + viewport.scrollX;
				break;
			case 'above':
				coords.top = elementRect.top + viewport.scrollY - tooltipRect.height - buffer;
				coords.left = elementRect.left + viewport.scrollX;
				break;
			case 'right':
				coords.top = elementRect.top + viewport.scrollY;
				coords.left = elementRect.right + viewport.scrollX + buffer;
				break;
			case 'left':
				coords.top = elementRect.top + viewport.scrollY;
				coords.left = elementRect.left + viewport.scrollX - tooltipRect.width - buffer;
				break;
		}

		// Clamp to viewport
		coords.left = Math.max(10, Math.min(coords.left, viewport.scrollX + viewport.width - tooltipRect.width - 10));
		coords.top = Math.max(10, Math.min(coords.top, viewport.scrollY + viewport.height - tooltipRect.height - 10));

		Object.assign(this.#tooltipContainer.style, {
			top: `${coords.top}px`,
			left: `${coords.left}px`,
			visibility: 'visible',
		});
	}
}
