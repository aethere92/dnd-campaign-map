// --- START OF FILE StoryNPC.js ---

class StoryHelperNPC extends StoryHelperBase {
	// ==========================================
	// CONFIGURATION
	// ==========================================

	static ATTRIBUTE_CONFIG = {
		// --- Header Tags ---
		race: { type: 'tag', style: 'npc-race-class' },
		class: { type: 'tag', style: 'npc-race-class' },
		status: { type: 'tag', style: 'status' },
		faction: { type: 'tag', style: 'npc-faction' },
		affinity: { type: 'tag', style: 'npc-affinity' },

		// --- Quick Info Sidebar ---
		location: { type: 'info', label: 'Current Location' },
		occupation: { type: 'info', label: 'Occupation' },
		role: { type: 'info', label: 'Role' },
		voice: { type: 'info', label: 'Voice / Tone' },
		quirks: { type: 'info', label: 'Quirks' },
		alignment: { type: 'info', label: 'Alignment' },

		// --- Narrative Sections ---
		description: { type: 'section', label: 'Description', priority: 1 },
		personality: { type: 'section', label: 'Personality', priority: 2 },
		history: { type: 'section', label: 'Backstory', priority: 3 },
		goals: { type: 'section', label: 'Goals & Motivations', priority: 4 },
		notes: { type: 'section', label: 'GM Notes', priority: 99 },
	};

	static RELATIONSHIP_LABELS = {
		NPC_ENCOUNTERED: 'Encountered In',
		LOCATED_IN: 'Resides In',
		MEMBER_OF: 'Affiliations',
		ENEMY: 'Enemies & Rivals',
		ALLY: 'Allies',
		FRIEND: 'Friends',
		FAMILY: 'Family',
		HAS_ITEM: 'Key Inventory',
		QUEST_GIVER: 'Associated Quests',
	};

	static EVENT_LABELS = {
		npc: 'Character Interactions',
		encounter: 'Combat Encounters',
		quest: 'Quest Involvement',
		location: 'Location History',
		faction: 'Faction Events',
		session: 'Session Appearances',
	};

	#sessionMap = new Map();

	getUrlParam() {
		return 'npc';
	}
	getViewTitle() {
		return 'NPCs';
	}
	getItemId(npc) {
		return npc.id;
	}

	async getItems() {
		if (!this.supabaseClient.isReady()) return [];
		try {
			// 1. Fetch NPCs
			const npcPromise = this.supabaseClient
				.getClient()
				.from('entity_complete_view')
				.select('*')
				.eq('campaign_id', this.campaign.id)
				.eq('type', 'npc')
				.order('name');

			// 2. Fetch Session Map
			const sessionPromise = this.supabaseClient
				.getClient()
				.from('sessions')
				.select('id, session_number')
				.eq('campaign_id', this.campaign.id);

			const [npcRes, sessionRes] = await Promise.all([npcPromise, sessionPromise]);

			if (npcRes.error) throw npcRes.error;

			if (sessionRes.data) {
				sessionRes.data.forEach((s) => this.#sessionMap.set(s.id, s.session_number));
			}

			return npcRes.data || [];
		} catch (error) {
			console.error('Error fetching NPCs:', error);
			return [];
		}
	}

	// ==========================================
	// GROUPING LOGIC (Nested: Affinity -> Location)
	// ==========================================

	groupItems(npcs) {
		const groups = {};

		npcs.forEach((npc) => {
			// 1. Determine Affinity (Level 1)
			const affinity = this.#getAttributeValue(npc, 'affinity') || 'Unassociated';

			// 2. Determine Location (Level 2)
			let location = 'Unknown Location';

			// Check Relationships first (more accurate dynamic data)
			if (npc.relationships && Array.isArray(npc.relationships)) {
				const locRel = npc.relationships.find(
					(r) => r.entity_type === 'location' || r.type === 'LOCATED_IN' || r.type === 'RESIDES_IN'
				);
				if (locRel) {
					location = locRel.entity_name;
				}
			}

			// Fallback to Attribute if relationship not found
			if (location === 'Unknown Location') {
				location = this.#getAttributeValue(npc, 'location') || 'Unknown Location';
			}

			// Initialize nesting
			if (!groups[affinity]) groups[affinity] = {};
			if (!groups[affinity][location]) groups[affinity][location] = [];

			groups[affinity][location].push(npc);
		});

		// Sort groups
		const sortedGroups = {};
		Object.keys(groups)
			.sort()
			.forEach((affKey) => {
				const locations = groups[affKey];
				sortedGroups[affKey] = {};

				Object.keys(locations)
					.sort()
					.forEach((locKey) => {
						// Sort NPCs inside
						locations[locKey].sort((a, b) => a.name.localeCompare(b.name));
						sortedGroups[affKey][locKey] = locations[locKey];
					});
			});

		return sortedGroups;
	}

	// Override renderGroups to handle the nested structure
	renderGroups(container, groupedItems, detailPanel) {
		Object.entries(groupedItems).forEach(([affinity, locations]) => {
			this.renderNestedGroup(container, affinity, locations, detailPanel);
		});
	}

	renderNestedGroup(container, affinity, locations, detailPanel) {
		const affinityGroup = document.createElement('div');
		affinityGroup.className = 'view-group';

		const affinityContent = document.createElement('div');
		affinityContent.className = 'view-group-content';

		// Level 1 Header (Affinity) - Using existing class
		const affinityHeader = StoryDOMBuilder.createToggleHeader(affinity, affinityContent, 'view-group-header-level-1');
		affinityGroup.appendChild(affinityHeader);

		Object.entries(locations).forEach(([location, npcList]) => {
			const locationGroup = document.createElement('div');
			locationGroup.className = 'view-group'; // Nested group

			const locationContent = document.createElement('div');
			locationContent.className = 'view-group-content';

			// Level 2 Header (Location) - Using existing class
			const locationHeader = StoryDOMBuilder.createToggleHeader(location, locationContent, 'view-group-header-level-2');
			locationGroup.appendChild(locationHeader);

			npcList.forEach((npc) => {
				const npcItem = this.createListItem(npc, detailPanel);
				// Add indent class if available, or rely on hierarchy
				npcItem.classList.add('level-2');
				locationContent.appendChild(npcItem);
			});

			locationGroup.appendChild(locationContent);
			affinityContent.appendChild(locationGroup);
		});

		affinityGroup.appendChild(affinityContent);
		container.appendChild(affinityGroup);
	}

	// ==========================================
	// DETAIL RENDERING
	// ==========================================

	createDetailContent(npc) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content';

		const consumedAttributes = new Set();

		// 1. Header
		detail.appendChild(this.#createHeader(npc, consumedAttributes));

		// 2. Info Card
		const infoCard = this.#createInfoCard(npc, consumedAttributes);
		if (infoCard) {
			detail.appendChild(infoCard);
		}

		// 3. Narrative Sections
		this.#appendNarrativeSections(detail, npc, consumedAttributes);

		// 4. Relationships (Flattened)
		this.#appendRelationships(detail, npc);

		// 5. Events (Sorted)
		this.#appendEvents(detail, npc);

		return detail;
	}

	#createHeader(npc, consumedAttributes) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		const iconSrc = npc.icon || this.#getAttributeValue(npc, 'Portrait') || this.#getAttributeValue(npc, 'Image');
		if (iconSrc) {
			const img = document.createElement('img');
			img.className = 'view-portrait';
			img.src = iconSrc;
			img.alt = npc.name;
			header.appendChild(img);
			this.#markConsumed(npc, 'Portrait', consumedAttributes);
			this.#markConsumed(npc, 'Image', consumedAttributes);
		}

		const textWrapper = document.createElement('div');
		textWrapper.className = 'view-header-text';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = npc.name;
		textWrapper.appendChild(name);

		const tags = [];
		const race = this.#getAttributeValue(npc, 'race');
		const cls = this.#getAttributeValue(npc, 'class');
		const lvl = this.#getAttributeValue(npc, 'level');

		if (race || cls) {
			const text = `${race || '?'} ${cls || ''} ${lvl ? `(Lvl ${lvl})` : ''}`.trim();
			tags.push({ text: text, className: 'npc-race-class' });
			this.#markConsumed(npc, 'race', consumedAttributes);
			this.#markConsumed(npc, 'class', consumedAttributes);
			this.#markConsumed(npc, 'level', consumedAttributes);
		}

		Object.entries(StoryHelperNPC.ATTRIBUTE_CONFIG).forEach(([key, config]) => {
			if (config.type === 'tag' && key !== 'race' && key !== 'class') {
				const val = this.#getAttributeValue(npc, key);
				if (val) {
					let className = config.style;
					if (key === 'status') className += ` status-${val.toLowerCase()}`;
					tags.push({ text: val, className: className });
					this.#markConsumed(npc, key, consumedAttributes);
				}
			}
		});

		if (tags.length) {
			textWrapper.appendChild(this.createMetaTags(tags));
		}

		header.appendChild(textWrapper);
		return header;
	}

	#createInfoCard(npc, consumedAttributes) {
		const items = [];
		Object.entries(StoryHelperNPC.ATTRIBUTE_CONFIG).forEach(([key, config]) => {
			if (config.type === 'info') {
				const val = this.#getAttributeValue(npc, key);
				if (val) {
					items.push({ label: config.label, value: val });
					this.#markConsumed(npc, key, consumedAttributes);
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

	#appendNarrativeSections(container, npc, consumedAttributes) {
		const sections = [];

		if (npc.description) {
			const config = StoryHelperNPC.ATTRIBUTE_CONFIG['description'];
			sections.push({
				title: config?.label || 'Description',
				content: npc.description,
				priority: config?.priority || 1,
			});
		}

		const attributes = npc.attributes || {};
		Object.keys(attributes).forEach((rawKey) => {
			if (this.#isConsumed(rawKey, consumedAttributes)) return;

			const normKey = rawKey.toLowerCase();
			const config = StoryHelperNPC.ATTRIBUTE_CONFIG[normKey];
			if (config && config.type !== 'section') return;

			const val = this.#getAttributeValue(npc, rawKey);
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
			const contentDiv = sectionEl.querySelector('.view-section-content');
			if (contentDiv) {
				this.placeholderProcessor.processEntityReferences(contentDiv);
			}
			container.appendChild(sectionEl);
		});
	}

	#appendRelationships(container, npc) {
		const rels = npc.relationships;
		if (!rels || !Array.isArray(rels) || rels.length === 0) return;

		const listContainer = document.createElement('ul');
		listContainer.className = 'view-simple-list';

		rels.forEach((rel) => {
			const li = document.createElement('li');

			const type = this.formatName(rel.type || 'Associated');
			const link = `[ENTITY:${rel.entity_type}:${rel.entity_name}]`;

			let html = `<strong>${type}</strong> - ${link}`;

			if (rel.description) {
				html += `: ${rel.description}`;
			}

			li.innerHTML = html;
			listContainer.appendChild(li);
		});

		const section = this.createSection('Relationships', listContainer);
		this.placeholderProcessor.processEntityReferences(section);
		container.appendChild(section);
	}

	#appendEvents(container, npc) {
		const eventGroups = npc.events || {};
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

			const label = StoryHelperNPC.EVENT_LABELS[type] || `${this.formatName(type)} Events`;

			const listContainer = document.createElement('ul');
			listContainer.className = 'view-simple-list';

			events.forEach((evt) => {
				const li = document.createElement('li');
				const sessionNum = this.#sessionMap.get(evt.session_id);
				const prefix = sessionNum ? `(Session ${sessionNum}) ` : '';

				let content = `<strong>${prefix}${evt.title}</strong>`;
				if (evt.description) {
					content += `: ${evt.description}`;
				}
				li.innerHTML = content;
				listContainer.appendChild(li);
			});

			const section = this.createSection(label, listContainer);
			this.placeholderProcessor.processEntityReferences(section);
			container.appendChild(section);
		});
	}

	// ==========================================
	// UTILITIES
	// ==========================================

	#getAttributeValue(npc, key) {
		if (!npc.attributes) return null;
		const match = Object.keys(npc.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
		if (!match) return null;

		const val = npc.attributes[match];
		return Array.isArray(val) ? val[0]?.value : val;
	}

	#markConsumed(npc, key, set) {
		if (!npc.attributes) return;
		const match = Object.keys(npc.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
		if (match) set.add(match);
	}

	#isConsumed(key, set) {
		return set.has(key);
	}
}
