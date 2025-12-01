// --- START OF FILE StoryFaction.js ---

class StoryHelperFaction extends StoryHelperBase {
	// ==========================================
	// CONFIGURATION
	// ==========================================

	static ATTRIBUTE_CONFIG = {
		// --- Header Tags ---
		type: { type: 'tag', style: 'npc-faction' }, // Reusing faction style
		alignment: { type: 'tag', style: 'npc-affinity' }, // Reusing affinity style
		status: { type: 'tag', style: 'status' },

		// --- Quick Info Sidebar ---
		leader: { type: 'info', label: 'Leader' },
		headquarters: { type: 'info', label: 'Headquarters' },
		area_of_operation: { type: 'info', label: 'Area of Operation' },
		influence: { type: 'info', label: 'Influence Level' },
		motto: { type: 'info', label: 'Motto' },
		colors: { type: 'info', label: 'Colors / Symbol' },
		founded: { type: 'info', label: 'Founded' },

		// --- Narrative Sections ---
		description: { type: 'section', label: 'Description', priority: 1 },
		goals: { type: 'section', label: 'Goals & Agenda', priority: 2 },
		beliefs: { type: 'section', label: 'Beliefs & Tenets', priority: 3 },
		structure: { type: 'section', label: 'Structure & hierarchy', priority: 4 },
		history: { type: 'section', label: 'History', priority: 5 },
		resources: { type: 'section', label: 'Assets & Resources', priority: 6 },
		notes: { type: 'section', label: 'GM Notes', priority: 99 },
	};

	static RELATIONSHIP_LABELS = {
		LEAD_BY: 'Leader',
		HEADQUARTERED_IN: 'Headquarters',
		ALLY: 'Allies',
		ENEMY: 'Enemies',
		RIVAL: 'Rivals',
		HAS_MEMBER: 'Notable Members',
		OPERATES_IN: 'Operations In',
		ASSOCIATED_WITH: 'Associated With',
	};

	static EVENT_LABELS = {
		faction: 'Faction Events',
		npc: 'Member Interactions',
		encounter: 'Conflicts',
		quest: 'Related Quests',
		location: 'Territorial Events',
		session: 'Appearances',
	};

	#sessionMap = new Map();

	getUrlParam() {
		return 'faction';
	}
	getViewTitle() {
		return 'Factions';
	}
	getItemId(item) {
		return item.id;
	}

	async getItems() {
		if (!this.supabaseClient.isReady()) return [];
		try {
			// 1. Fetch Factions
			const factionPromise = this.supabaseClient
				.getClient()
				.from('entity_complete_view')
				.select('*')
				.eq('campaign_id', this.campaign.id)
				.eq('type', 'faction')
				.order('name');

			// 2. Fetch Session Map
			const sessionPromise = this.supabaseClient
				.getClient()
				.from('sessions')
				.select('id, session_number')
				.eq('campaign_id', this.campaign.id);

			const [facRes, sessionRes] = await Promise.all([factionPromise, sessionPromise]);

			if (facRes.error) throw facRes.error;

			if (sessionRes.data) {
				sessionRes.data.forEach((s) => this.#sessionMap.set(s.id, s.session_number));
			}

			return facRes.data || [];
		} catch (error) {
			console.error('Error fetching Factions:', error);
			return [];
		}
	}

	// ==========================================
	// GROUPING LOGIC (By Type)
	// ==========================================

	groupItems(factions) {
		const groups = {};

		factions.forEach((faction) => {
			// Get Type from attribute or default
			let type = this.#getAttributeValue(faction, 'type') || 'General';
			type = this.formatName(type);

			if (!groups[type]) groups[type] = [];
			groups[type].push(faction);
		});

		// Sort Groups & Items
		const sortedGroups = {};
		Object.keys(groups)
			.sort()
			.forEach((key) => {
				groups[key].sort((a, b) => a.name.localeCompare(b.name));
				sortedGroups[key] = groups[key];
			});

		return sortedGroups;
	}

	// ==========================================
	// DETAIL RENDERING
	// ==========================================

	createDetailContent(faction) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content';

		const consumedAttributes = new Set();

		// 1. Header
		detail.appendChild(this.#createHeader(faction, consumedAttributes));

		// 2. Info Card
		const infoCard = this.#createInfoCard(faction, consumedAttributes);
		if (infoCard) {
			detail.appendChild(infoCard);
		}

		// 3. Narrative Sections
		this.#appendNarrativeSections(detail, faction, consumedAttributes);

		// 4. Relationships
		this.#appendRelationships(detail, faction);

		// 5. Events
		this.#appendEvents(detail, faction);

		return detail;
	}

	#createHeader(faction, consumedAttributes) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		// Icon
		const iconSrc =
			faction.icon ||
			this.#getAttributeValue(faction, 'Image') ||
			this.#getAttributeValue(faction, 'Symbol') ||
			this.#getAttributeValue(faction, 'Emblem');
		if (iconSrc) {
			const img = document.createElement('img');
			img.className = 'view-portrait'; // Reusing portrait style
			img.src = iconSrc;
			img.alt = faction.name;
			header.appendChild(img);
			this.#markConsumed(faction, 'Image', consumedAttributes);
			this.#markConsumed(faction, 'Symbol', consumedAttributes);
			this.#markConsumed(faction, 'Emblem', consumedAttributes);
		}

		const textWrapper = document.createElement('div');
		textWrapper.className = 'view-header-text';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = faction.name;
		textWrapper.appendChild(name);

		// Tags
		const tags = [];
		Object.entries(StoryHelperFaction.ATTRIBUTE_CONFIG).forEach(([key, config]) => {
			if (config.type === 'tag') {
				const val = this.#getAttributeValue(faction, key);
				if (val) {
					tags.push({ text: val, className: config.style });
					this.#markConsumed(faction, key, consumedAttributes);
				}
			}
		});

		if (tags.length) {
			textWrapper.appendChild(this.createMetaTags(tags));
		}

		header.appendChild(textWrapper);
		return header;
	}

	#createInfoCard(faction, consumedAttributes) {
		const items = [];
		Object.entries(StoryHelperFaction.ATTRIBUTE_CONFIG).forEach(([key, config]) => {
			if (config.type === 'info') {
				const val = this.#getAttributeValue(faction, key);
				if (val) {
					items.push({ label: config.label, value: val });
					this.#markConsumed(faction, key, consumedAttributes);
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

	#appendNarrativeSections(container, faction, consumedAttributes) {
		const sections = [];

		// 1. Top Level Description
		if (faction.description) {
			const config = StoryHelperFaction.ATTRIBUTE_CONFIG['description'];
			sections.push({
				title: config?.label || 'Description',
				content: faction.description,
				priority: config?.priority || 1,
			});
		}

		// 2. Attributes
		const attributes = faction.attributes || {};
		Object.keys(attributes).forEach((rawKey) => {
			if (this.#isConsumed(rawKey, consumedAttributes)) return;

			const normKey = rawKey.toLowerCase();
			const config = StoryHelperFaction.ATTRIBUTE_CONFIG[normKey];

			if (config && config.type !== 'section') return;

			const entries = attributes[rawKey];
			if (!entries || (Array.isArray(entries) && entries.length === 0)) return;

			let contentHtml = '';

			// Handle Multi-item lists (e.g. Tenets, Goals)
			if (Array.isArray(entries) && entries.length > 1) {
				contentHtml = '<ul class="view-simple-list">';
				entries.forEach((entry) => {
					const val = entry.value || entry;
					const desc = entry.description ? `: ${entry.description}` : '';
					contentHtml += `<li><strong>${val}</strong>${desc}</li>`;
				});
				contentHtml += '</ul>';
			} else {
				const entry = Array.isArray(entries) ? entries[0] : entries;
				const val = entry.value || entry;
				contentHtml = val;
				if (entry.description) contentHtml += ` <br><em>${entry.description}</em>`;
			}

			sections.push({
				title: config?.label || this.formatName(rawKey),
				content: contentHtml,
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

	#appendRelationships(container, faction) {
		const rels = faction.relationships;
		if (!rels || !Array.isArray(rels) || rels.length === 0) return;

		const listContainer = document.createElement('ul');
		listContainer.className = 'view-simple-list';

		rels.forEach((rel) => {
			const li = document.createElement('li');

			const type = StoryHelperFaction.RELATIONSHIP_LABELS[rel.type] || this.formatName(rel.type || 'Related');
			const link = `[ENTITY:${rel.entity_type}:${rel.entity_name}]`;

			let html = `<strong>${type}</strong> - ${link}`;
			if (rel.description) html += `: ${rel.description}`;

			li.innerHTML = html;
			listContainer.appendChild(li);
		});

		const section = this.createSection('Relations', listContainer);
		this.placeholderProcessor.processEntityReferences(section);
		container.appendChild(section);
	}

	#appendEvents(container, faction) {
		const eventGroups = faction.events || {};
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

			const label = StoryHelperFaction.EVENT_LABELS[type] || `${this.formatName(type)} Events`;
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

	// ==========================================
	// UTILITIES
	// ==========================================

	#getAttributeValue(faction, key) {
		if (!faction.attributes) return null;
		const match = Object.keys(faction.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
		if (!match) return null;

		const val = faction.attributes[match];
		return Array.isArray(val) ? val[0]?.value : val;
	}

	#markConsumed(faction, key, set) {
		if (!faction.attributes) return;
		const match = Object.keys(faction.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
		if (match) set.add(match);
	}

	#isConsumed(key, set) {
		return set.has(key);
	}
}
