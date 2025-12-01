// --- START OF FILE StoryQuest.js ---

class StoryHelperQuest extends StoryHelperBase {
	// ==========================================
	// CONFIGURATION
	// ==========================================

	static ATTRIBUTE_CONFIG = {
		// --- Header Tags ---
		status: { type: 'tag', style: 'status' },
		priority: { type: 'tag', style: 'priority' },
		type: { type: 'tag', style: 'quest-type' },

		// --- Quick Info Sidebar ---
		reward: { type: 'info', label: 'Reward' },
		location: { type: 'info', label: 'Location' },
		level_range: { type: 'info', label: 'Level Range' },
		client: { type: 'info', label: 'Client / Giver' },
		xp: { type: 'info', label: 'XP Value' },

		// --- Narrative Sections ---
		description: { type: 'section', label: 'Overview', priority: 1 },
		outcome: { type: 'section', label: 'Outcome', priority: 2 },
		notes: { type: 'section', label: 'GM Notes', priority: 99 },
	};

	static RELATIONSHIP_LABELS = {
		QUEST_GIVER: 'Given By',
		TARGET: 'Targets',
		LOCATED_IN: 'Takes Place In',
		REWARDED_BY: 'Rewards',
		RELATED_TO: 'Related Quests',
		OPPOSED_BY: 'Antagonists',
		INVOLVES: 'Involves',
	};

	static EVENT_LABELS = {
		quest: 'Quest Updates',
		session: 'Session Progress',
		encounter: 'Key Battles',
		npc: 'Interactions',
		location: 'Locations Visited',
	};

	#sessionMap = new Map();

	getUrlParam() {
		return 'quest';
	}
	getViewTitle() {
		return 'Quest Log';
	}
	getItemId(item) {
		return item.id;
	}

	async getItems() {
		if (!this.supabaseClient.isReady()) return [];
		try {
			// 1. Fetch Entity Graph Data
			const entityPromise = this.supabaseClient
				.getClient()
				.from('entity_complete_view')
				.select('*')
				.eq('campaign_id', this.campaign.id)
				.eq('type', 'quest');

			// 2. Fetch Core Quest Data
			const questPromise = this.supabaseClient
				.getClient()
				.from('quests')
				.select('id, status, priority, title, description')
				.eq('campaign_id', this.campaign.id);

			// 3. Fetch Objectives
			const objPromise = this.supabaseClient.getClient().from('quest_objectives').select('*').order('order_index');

			// 4. Fetch Session Map
			const sessionPromise = this.supabaseClient
				.getClient()
				.from('sessions')
				.select('id, session_number')
				.eq('campaign_id', this.campaign.id);

			const [entRes, questRes, objRes, sessionRes] = await Promise.all([
				entityPromise,
				questPromise,
				objPromise,
				sessionPromise,
			]);

			if (entRes.error) throw entRes.error;
			if (questRes.error) throw questRes.error;

			// Build Maps
			if (sessionRes.data) {
				sessionRes.data.forEach((s) => this.#sessionMap.set(s.id, s.session_number));
			}

			const objectiveMap = new Map();
			if (objRes.data) {
				objRes.data.forEach((obj) => {
					if (!objectiveMap.has(obj.quest_id)) objectiveMap.set(obj.quest_id, []);
					objectiveMap.get(obj.quest_id).push(obj);
				});
			}

			const coreDataMap = new Map();
			if (questRes.data) {
				questRes.data.forEach((q) => coreDataMap.set(q.id, q));
			}

			// Merge Data
			const mergedData = (entRes.data || []).map((entity) => {
				const core = coreDataMap.get(entity.id) || {};
				return {
					...entity,
					status: core.status || this.#getAttributeValue(entity, 'status'),
					priority: core.priority || this.#getAttributeValue(entity, 'priority'),
					description: core.description || entity.description,
					objectives: objectiveMap.get(entity.id) || [],
				};
			});

			return mergedData;
		} catch (error) {
			console.error('Error fetching Quests:', error);
			return [];
		}
	}

	// ==========================================
	// GROUPING LOGIC
	// ==========================================

	groupItems(quests) {
		const groups = {
			'Active Quests': [],
			'Completed Quests': [],
			'Failed Quests': [],
			'On Hold': [],
			Other: [],
		};

		quests.forEach((quest) => {
			const status = (quest.status || 'Active').toLowerCase();
			let groupName = 'Other';

			if (status === 'active' || status === 'in progress') groupName = 'Active Quests';
			else if (status === 'completed' || status === 'success') groupName = 'Completed Quests';
			else if (status === 'failed' || status === 'abandoned') groupName = 'Failed Quests';
			else if (status === 'on-hold' || status === 'paused') groupName = 'On Hold';

			groups[groupName].push(quest);
		});

		const priorityOrder = { critical: 0, high: 1, medium: 2, normal: 2, low: 3 };

		Object.keys(groups).forEach((key) => {
			if (groups[key].length === 0) {
				delete groups[key];
				return;
			}

			groups[key].sort((a, b) => {
				const pA = priorityOrder[(a.priority || 'normal').toLowerCase()] ?? 99;
				const pB = priorityOrder[(b.priority || 'normal').toLowerCase()] ?? 99;

				if (pA !== pB) return pA - pB;
				return a.name.localeCompare(b.name);
			});
		});

		return groups;
	}

	// ==========================================
	// DETAIL RENDERING
	// ==========================================

	createDetailContent(quest) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content';

		const consumedAttributes = new Set();

		// 1. Header
		detail.appendChild(this.#createHeader(quest, consumedAttributes));

		// 2. Info Card
		const infoCard = this.#createInfoCard(quest, consumedAttributes);
		if (infoCard) {
			detail.appendChild(infoCard);
		}

		// 3. Objectives (Rich Detail)
		this.#appendObjectives(detail, quest);

		// 4. Narrative
		this.#appendNarrativeSections(detail, quest, consumedAttributes);

		// 5. Relationships
		this.#appendRelationships(detail, quest);

		// 6. Events
		this.#appendEvents(detail, quest);

		return detail;
	}

	#createHeader(quest, consumedAttributes) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const iconSrc = quest.icon || this.#getAttributeValue(quest, 'Icon');
		if (iconSrc) {
			const img = document.createElement('img');
			img.className = 'view-portrait';
			img.src = iconSrc;
			img.alt = quest.name;
			header.appendChild(img);
			this.#markConsumed(quest, 'Icon', consumedAttributes);
		}

		const textWrapper = document.createElement('div');
		textWrapper.className = 'view-header-text';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = quest.name || quest.title;
		textWrapper.appendChild(name);

		const tags = [];
		if (quest.status) {
			const status = quest.status.toLowerCase();
			let style = 'status';
			if (status === 'active') style = 'status-active';
			if (status === 'completed') style = 'npc-faction';
			if (status === 'failed') style = 'status-hostile';

			tags.push({ text: quest.status, className: style });
			this.#markConsumed(quest, 'status', consumedAttributes);
		}

		if (quest.priority) {
			let style = 'priority-normal';
			if (quest.priority === 'high' || quest.priority === 'critical') style = 'priority-high';
			if (quest.priority === 'low') style = 'priority-low';

			tags.push({ text: `${quest.priority} Priority`, className: style });
			this.#markConsumed(quest, 'priority', consumedAttributes);
		}

		Object.entries(StoryHelperQuest.ATTRIBUTE_CONFIG).forEach(([key, config]) => {
			if (config.type === 'tag' && key !== 'status' && key !== 'priority') {
				const val = this.#getAttributeValue(quest, key);
				if (val) {
					tags.push({ text: val, className: config.style });
					this.#markConsumed(quest, key, consumedAttributes);
				}
			}
		});

		if (tags.length) {
			textWrapper.appendChild(this.createMetaTags(tags));
		}

		header.appendChild(textWrapper);
		return header;
	}

	#createInfoCard(quest, consumedAttributes) {
		const items = [];
		Object.entries(StoryHelperQuest.ATTRIBUTE_CONFIG).forEach(([key, config]) => {
			if (config.type === 'info') {
				const val = this.#getAttributeValue(quest, key);
				if (val) {
					items.push({ label: config.label, value: val });
					this.#markConsumed(quest, key, consumedAttributes);
				}
			}
		});

		if (items.length === 0) return null;

		const card = document.createElement('div');
		card.className = 'view-card';

		items.forEach((item) => {
			const row = document.createElement('div');
			row.className = 'view-card-detail';
			row.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
			this.placeholderProcessor.processEntityReferences(row);
			card.appendChild(row);
		});

		return card;
	}

	/**
	 * Render Detailed Objectives
	 */
	#appendObjectives(container, quest) {
		if (!quest.objectives || quest.objectives.length === 0) return;

		// Use the existing 'view-timeline' style or 'view-encounters' for a card-like list
		const listContainer = document.createElement('div');
		listContainer.className = 'view-encounters'; // Reusing this class gives a nice vertical stack of cards

		quest.objectives.forEach((obj) => {
			// Extract details from JSONB
			const details = obj.details || {};

			// Build Card
			const card = document.createElement('div');
			card.className = 'view-card';

			// Header Row: Icon + Description + (Optional: Session)
			const headerRow = document.createElement('div');
			headerRow.style.display = 'flex';
			headerRow.style.justifyContent = 'space-between';
			headerRow.style.alignItems = 'flex-start';
			headerRow.style.marginBottom = '0.5rem';
			headerRow.style.borderBottom = '1px solid rgba(0,0,0,0.1)';
			headerRow.style.paddingBottom = '0.5rem';

			// Icon & Title
			let icon = '⬜';
			let titleStyle = 'font-weight: bold; color: var(--color-primary);';

			if (obj.status === 'completed') {
				icon = '✅';
				titleStyle = 'font-weight: bold; color: var(--color-text); text-decoration: line-through; opacity: 0.7;';
			} else if (obj.status === 'failed') {
				icon = '❌';
				titleStyle = 'font-weight: bold; color: #d32f2f;';
			} else if (obj.status === 'in-progress') {
				icon = '🔄';
			}

			const titleDiv = document.createElement('div');
			titleDiv.innerHTML = `<span style="margin-right: 8px;">${icon}</span> <span style="${titleStyle}">${obj.description}</span>`;

			// Session Info
			const metaDiv = document.createElement('div');
			metaDiv.style.fontSize = '0.8rem';
			metaDiv.style.color = '#666';
			metaDiv.style.whiteSpace = 'nowrap';
			metaDiv.style.marginLeft = '1rem';

			if (obj.completed_session_id) {
				const sessionNum = this.#sessionMap.get(obj.completed_session_id);
				if (sessionNum) {
					metaDiv.textContent = `Session ${sessionNum}`;
				}
			}

			headerRow.append(titleDiv, metaDiv);
			card.appendChild(headerRow);

			// --- Details Content ---
			// Only render if there are details
			const contentDiv = document.createElement('div');
			contentDiv.style.fontSize = '0.95rem';
			contentDiv.style.lineHeight = '1.5';

			// Outcome
			if (details.outcome) {
				const p = document.createElement('p');
				p.innerHTML = `<strong>Outcome:</strong> ${details.outcome}`;
				contentDiv.appendChild(p);
			}

			// Key Discoveries (List)
			if (details.key_discoveries && Array.isArray(details.key_discoveries) && details.key_discoveries.length > 0) {
				const discTitle = document.createElement('div');
				discTitle.innerHTML = '<strong>Key Discoveries:</strong>';
				discTitle.style.marginTop = '0.5rem';

				const ul = document.createElement('ul');
				ul.className = 'view-simple-list'; // Reuse bullet style
				ul.style.marginTop = '0.25rem';

				details.key_discoveries.forEach((d) => {
					const li = document.createElement('li');
					li.textContent = d;
					ul.appendChild(li);
				});

				contentDiv.append(discTitle, ul);
			}

			// Method
			if (details.method) {
				const p = document.createElement('p');
				p.style.marginTop = '0.5rem';
				p.innerHTML = `<strong>Method:</strong> ${details.method}`;
				contentDiv.appendChild(p);
			}

			// Reward
			if (details.reward) {
				const p = document.createElement('p');
				p.style.marginTop = '0.5rem';
				p.innerHTML = `<strong>Reward:</strong> ${details.reward}`;
				contentDiv.appendChild(p);
			}

			// Location (if specific to objective)
			if (details.location) {
				const p = document.createElement('p');
				p.style.marginTop = '0.5rem';
				p.style.fontSize = '0.9rem';
				p.style.color = '#555';
				p.innerHTML = `📍 ${details.location}`;
				contentDiv.appendChild(p);
			}

			// Process Links in the card content
			this.placeholderProcessor.processEntityReferences(contentDiv);

			if (contentDiv.hasChildNodes()) {
				card.appendChild(contentDiv);
			}

			listContainer.appendChild(card);
		});

		const section = this.createSection('Objectives', listContainer);
		container.appendChild(section);
	}

	#appendNarrativeSections(container, quest, consumedAttributes) {
		const sections = [];

		if (quest.description) {
			const config = StoryHelperQuest.ATTRIBUTE_CONFIG['description'];
			sections.push({
				title: config?.label || 'Overview',
				content: quest.description,
				priority: config?.priority || 1,
			});
		}

		const attributes = quest.attributes || {};
		Object.keys(attributes).forEach((rawKey) => {
			if (this.#isConsumed(rawKey, consumedAttributes)) return;

			const normKey = rawKey.toLowerCase();
			const config = StoryHelperQuest.ATTRIBUTE_CONFIG[normKey];
			if (config && config.type !== 'section') return;

			const val = this.#getAttributeValue(quest, rawKey);
			if (!val) return;

			sections.push({
				title: config?.label || this.formatName(rawKey),
				content: val,
				priority: config?.priority || 50,
			});
		});

		sections.sort((a, b) => a.priority - b.priority);

		sections.forEach((sec) => {
			const sectionEl = this.createSection(sec.title, sec.content);
			const contentDiv = sectionEl.querySelector('.view-section-content') || sectionEl;
			this.placeholderProcessor.processEntityReferences(contentDiv);
			container.appendChild(sectionEl);
		});
	}

	#appendRelationships(container, quest) {
		const rels = quest.relationships;
		if (!rels || !Array.isArray(rels) || rels.length === 0) return;

		const listContainer = document.createElement('ul');
		listContainer.className = 'view-simple-list';

		rels.forEach((rel) => {
			const li = document.createElement('li');
			const type = StoryHelperQuest.RELATIONSHIP_LABELS[rel.type] || this.formatName(rel.type || 'Related');
			const link = `[ENTITY:${rel.entity_type}:${rel.entity_name}]`;

			let html = `<strong>${type}</strong> - ${link}`;
			if (rel.description) html += `: ${rel.description}`;

			li.innerHTML = html;
			listContainer.appendChild(li);
		});

		const section = this.createSection('Connections', listContainer);
		this.placeholderProcessor.processEntityReferences(section);
		container.appendChild(section);
	}

	#appendEvents(container, quest) {
		const eventGroups = quest.events || {};
		const macroTypes = Object.keys(eventGroups);
		if (macroTypes.length === 0) return;

		macroTypes.sort();

		macroTypes.forEach((type) => {
			const events = eventGroups[type];
			if (!events || events.length === 0) return;

			events.sort((a, b) => {
				const sessionNumA = this.#sessionMap.get(a.session_id) || 9999;
				const sessionNumB = this.#sessionMap.get(b.session_id) || 9999;
				if (sessionNumA !== sessionNumB) return sessionNumA - sessionNumB;
				return (a.order || 0) - (b.order || 0);
			});

			const label = StoryHelperQuest.EVENT_LABELS[type] || `${this.formatName(type)} Events`;
			const listContainer = document.createElement('ul');
			listContainer.className = 'view-simple-list';

			events.forEach((evt) => {
				const li = document.createElement('li');
				const sessionNum = this.#sessionMap.get(evt.session_id);
				const prefix = sessionNum ? `(Session ${sessionNum}) ` : '';

				let content = `<strong>${prefix}${evt.title}</strong>`;
				if (evt.description) content += `: ${evt.description}`;

				li.innerHTML = content;
				listContainer.appendChild(li);
			});

			const section = this.createSection(label, listContainer);
			this.placeholderProcessor.processEntityReferences(section);
			container.appendChild(section);
		});
	}

	#getAttributeValue(quest, key) {
		if (!quest.attributes) return null;
		const match = Object.keys(quest.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
		if (!match) return null;
		const val = quest.attributes[match];
		return Array.isArray(val) ? val[0]?.value : val;
	}

	#markConsumed(quest, key, set) {
		if (!quest.attributes) return;
		const match = Object.keys(quest.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
		if (match) set.add(match);
	}

	#isConsumed(key, set) {
		return set.has(key);
	}
}
