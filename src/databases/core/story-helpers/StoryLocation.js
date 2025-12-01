// --- START OF FILE StoryLocation.js ---

class StoryHelperLocation extends StoryHelperBase {
	// ==========================================
	// CONFIGURATION
	// ==========================================

	static ATTRIBUTE_CONFIG = {
		// --- Header Tags ---
		type: { type: 'tag', style: 'location-type' },
		region: { type: 'tag', style: 'location-region' },
		status: { type: 'tag', style: 'status' },

		// --- Quick Info Sidebar ---
		population: { type: 'info', label: 'Population' },
		ruler: { type: 'info', label: 'Ruler / Leader' },
		government: { type: 'info', label: 'Government' },
		wealth: { type: 'info', label: 'Economy' },
		danger: { type: 'info', label: 'Danger Level' },
		climate: { type: 'info', label: 'Climate' },
		demographics: { type: 'info', label: 'Demographics' },

		// --- Narrative Sections ---
		description: { type: 'section', label: 'Description', priority: 1 },
		history: { type: 'section', label: 'History & Lore', priority: 2 },
		features: { type: 'section', label: 'Notable Features', priority: 3 },
		points_of_interest: { type: 'section', label: 'Points of Interest', priority: 3 },
		threats: { type: 'section', label: 'Threats & Dangers', priority: 4 },
		notes: { type: 'section', label: 'GM Notes', priority: 99 },
	};

	static RELATIONSHIP_LABELS = {
		LOCATED_IN: 'Parent Location',
		CONTAINS: 'Sub-Locations',
		CONNECTED_TO: 'Connected To',
		NEIGHBOR: 'Neighbors',
		HAS_NPC: 'Key NPCs',
		HAS_FACTION: 'Factions',
		THREATENED_BY: 'Threats',
	};

	static EVENT_LABELS = {
		location: 'History & Events',
		encounter: 'Battles & Encounters',
		quest: 'Quest Relevance',
		npc: 'Character Interactions',
		session: 'Party Visits',
	};

	#sessionMap = new Map();

	getUrlParam() {
		return 'location';
	}
	getViewTitle() {
		return 'Locations';
	}
	getItemId(loc) {
		return loc.id;
	}

	async getItems() {
		if (!this.supabaseClient.isReady()) return [];
		try {
			// 1. Fetch Locations
			const locPromise = this.supabaseClient
				.getClient()
				.from('entity_complete_view')
				.select('*')
				.eq('campaign_id', this.campaign.id)
				.eq('type', 'location')
				.order('name');

			// 2. Fetch Session Map
			const sessionPromise = this.supabaseClient
				.getClient()
				.from('sessions')
				.select('id, session_number')
				.eq('campaign_id', this.campaign.id);

			const [locRes, sessionRes] = await Promise.all([locPromise, sessionPromise]);

			if (locRes.error) throw locRes.error;

			if (sessionRes.data) {
				sessionRes.data.forEach((s) => this.#sessionMap.set(s.id, s.session_number));
			}

			return locRes.data || [];
		} catch (error) {
			console.error('Error fetching Locations:', error);
			return [];
		}
	}

	groupItems(locations) {
		const groups = {};

		locations.forEach((loc) => {
			const region = this.#getAttributeValue(loc, 'region');
			const type = this.#getAttributeValue(loc, 'type') || loc.type;

			const groupName = region || (type ? this.formatName(type) : 'General');

			if (!groups[groupName]) groups[groupName] = [];
			groups[groupName].push(loc);
		});

		const sortedGroups = {};
		Object.keys(groups)
			.sort()
			.forEach((key) => {
				groups[key].sort((a, b) => a.name.localeCompare(b.name));
				sortedGroups[key] = groups[key];
			});

		return sortedGroups;
	}

	createDetailContent(loc) {
		const detail = document.createElement('div');
		detail.className = 'view-detail-content';

		const consumedAttributes = new Set();

		// 1. Header
		detail.appendChild(this.#createHeader(loc, consumedAttributes));

		// 2. Info Card
		const infoCard = this.#createInfoCard(loc, consumedAttributes);
		if (infoCard) {
			detail.appendChild(infoCard);
		}

		// 3. Narrative Sections (Handles Lists!)
		this.#appendNarrativeSections(detail, loc, consumedAttributes);

		// 4. Relationships (Flattened)
		this.#appendRelationships(detail, loc);

		// 5. Events
		this.#appendEvents(detail, loc);

		return detail;
	}

	// ==========================================
	// COMPONENT BUILDERS
	// ==========================================

	#createHeader(loc, consumedAttributes) {
		const header = document.createElement('div');
		header.className = 'view-detail-header';

		// Image/Icon
		const iconSrc = loc.icon || this.#getAttributeValue(loc, 'Image') || this.#getAttributeValue(loc, 'Map');
		if (iconSrc) {
			const img = document.createElement('img');
			img.className = 'view-portrait';
			img.src = iconSrc;
			img.alt = loc.name;
			header.appendChild(img);
			this.#markConsumed(loc, 'Image', consumedAttributes);
			this.#markConsumed(loc, 'Map', consumedAttributes);
		}

		const textWrapper = document.createElement('div');
		textWrapper.className = 'view-header-text';

		const name = document.createElement('h3');
		name.className = 'view-detail-name';
		name.textContent = loc.name;
		textWrapper.appendChild(name);

		// Tags
		const tags = [];
		Object.entries(StoryHelperLocation.ATTRIBUTE_CONFIG).forEach(([key, config]) => {
			if (config.type === 'tag') {
				const val = this.#getAttributeValue(loc, key);
				if (val) {
					tags.push({ text: val, className: config.style });
					this.#markConsumed(loc, key, consumedAttributes);
				}
			}
		});

		if (tags.length) {
			textWrapper.appendChild(this.createMetaTags(tags));
		}

		header.appendChild(textWrapper);
		return header;
	}

	#createInfoCard(loc, consumedAttributes) {
		const items = [];
		Object.entries(StoryHelperLocation.ATTRIBUTE_CONFIG).forEach(([key, config]) => {
			if (config.type === 'info') {
				const val = this.#getAttributeValue(loc, key);
				if (val) {
					items.push({ label: config.label, value: val });
					this.#markConsumed(loc, key, consumedAttributes);
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

	#appendNarrativeSections(container, loc, consumedAttributes) {
		const sections = [];

		// 1. Top Level Description
		if (loc.description) {
			const config = StoryHelperLocation.ATTRIBUTE_CONFIG['description'];
			sections.push({
				title: config?.label || 'Description',
				content: loc.description,
				priority: config?.priority || 1,
			});
		}

		// 2. Attributes (Handle Lists vs Single Items)
		const attributes = loc.attributes || {};

		Object.keys(attributes).forEach((rawKey) => {
			if (this.#isConsumed(rawKey, consumedAttributes)) return;

			const normKey = rawKey.toLowerCase();
			const config = StoryHelperLocation.ATTRIBUTE_CONFIG[normKey];

			if (config && config.type !== 'section') return;

			const entries = attributes[rawKey]; // This is the array of {value, description...}

			if (!entries || (Array.isArray(entries) && entries.length === 0)) return;

			let contentHtml = '';

			// CHECK FOR MULTI-ITEM ATTRIBUTES
			if (Array.isArray(entries) && entries.length > 1) {
				// Render as a List
				contentHtml = '<ul class="view-simple-list">';
				entries.forEach((entry) => {
					// Handle cases where entry might be string (legacy) or object (new schema)
					const val = entry.value || entry;
					const desc = entry.description ? `: ${entry.description}` : '';
					contentHtml += `<li><strong>${val}</strong>${desc}</li>`;
				});
				contentHtml += '</ul>';
			} else {
				// Render as Single Text
				const entry = Array.isArray(entries) ? entries[0] : entries;
				const val = entry.value || entry;

				// If it's a long text (like History), usually just the value.
				// If it has a description, maybe append it.
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
			// Process links inside the content we just created
			const contentDiv = sectionEl.querySelector('.view-section-content') || sectionEl;
			this.placeholderProcessor.processEntityReferences(contentDiv);
			container.appendChild(sectionEl);
		});
	}

	#appendRelationships(container, loc) {
		const rels = loc.relationships;
		if (!rels || !Array.isArray(rels) || rels.length === 0) return;

		const listContainer = document.createElement('ul');
		listContainer.className = 'view-simple-list';

		rels.forEach((rel) => {
			const li = document.createElement('li');

			const type = StoryHelperLocation.RELATIONSHIP_LABELS[rel.type] || this.formatName(rel.type || 'Related');
			const link = `[ENTITY:${rel.entity_type}:${rel.entity_name}]`;

			let html = `<strong>${type}</strong> - ${link}`;

			if (rel.description) {
				html += `: ${rel.description}`;
			}

			li.innerHTML = html;
			listContainer.appendChild(li);
		});

		const section = this.createSection('Connections', listContainer);
		this.placeholderProcessor.processEntityReferences(section);
		container.appendChild(section);
	}

	#appendEvents(container, loc) {
		const eventGroups = loc.events || {};
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

			const label = StoryHelperLocation.EVENT_LABELS[type] || `${this.formatName(type)} Events`;

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

	// This helper strictly returns a single STRING value for Headers/InfoCards.
	// It picks the first item if the attribute is a list.
	#getAttributeValue(loc, key) {
		if (!loc.attributes) return null;
		const match = Object.keys(loc.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
		if (!match) return null;

		const val = loc.attributes[match];
		return Array.isArray(val) ? val[0]?.value : val;
	}

	#markConsumed(loc, key, set) {
		if (!loc.attributes) return;
		const match = Object.keys(loc.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
		if (match) set.add(match);
	}

	#isConsumed(key, set) {
		return set.has(key);
	}
}
