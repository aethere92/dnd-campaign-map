// --- START OF FILE StoryRelationships.js ---

class StoryHelperRelationships {
	#campaignId;
	#supabaseClient;
	#cy = null;
	#container = null;
	#infoPanel = null;
	#searchInput = null;
	#currentLayout = 'tension';

	// Constants
	static ICON_BASE_PATH = 'images/assets/relationship_icons';

	static TYPE_ICON_MAP = {
		npc: 'npc.png',
		character: 'npc.png',
		monster: 'monster.png',
		location: 'location.png',
		faction: 'faction.png',
		quest: 'quest.png',
		default: 'unknown.png',
	};

	static RELATIONSHIP_COLORS = {
		enemy: '#f44336',
		hostile: '#f44336',
		rival: '#e57373',
		ally: '#4caf50',
		friend: '#4caf50',
		companion: '#2196f3',
		partner: '#2196f3',
		lover: '#e91e63',
		spouse: '#e91e63',
		family: '#9c27b0',
		sibling: '#ce93d8',
		parent: '#8e24aa',
		child: '#8e24aa',
		commander: '#ff9800',
		superior: '#ff9800',
		master: '#ff9800',
		subordinate: '#ffb74d',
		minion: '#ffb74d',
		colleague: '#607d8b',
		neutral: '#9e9e9e',
		acquaintance: '#bdbdbd',
	};
	static DEFAULT_COLOR = '#8d6e63';

	constructor() {
		this.#supabaseClient = SupabaseClient.getInstance();
	}

	async render(contentArea, campaignId) {
		this.#showLoading(contentArea);

		if (campaignId) this.#campaignId = campaignId;

		if (!this.#campaignId) {
			this.#showError(contentArea, 'Campaign ID is missing.');
			return;
		}

		try {
			const entities = await this.#fetchDataFromView();
			console.log(entities);

			// 1. Build Graph Elements
			const elements = this.#buildCytoscapeElements(entities);

			// 2. Check if we actually have connected nodes
			if (!elements.nodes.length) {
				this.#showEmptyState(contentArea);
				return;
			}

			this.#renderGraph(contentArea, elements);
		} catch (error) {
			console.error('Error rendering relationships:', error);
			this.#showError(contentArea, error.message);
		}
	}

	async #fetchDataFromView() {
		const { data, error } = await this.#supabaseClient
			.getClient()
			.from('entity_complete_view')
			.select('id, name, type, relationships, attributes') // 'icon' column might not exist in view, we check attributes
			.eq('campaign_id', this.#campaignId);

		if (error) throw error;
		return data || [];
	}

	// --- ICON RESOLUTION LOGIC ---

	/**
	 * Extract the raw icon string from the entity object (checking attributes/properties)
	 */
	#getRawEntityIcon(entity) {
		// 1. Check if 'icon' property exists directly (if added to view)
		if (entity.icon) return entity.icon;

		// 2. Check Attributes (Portrait/Image/Icon)
		if (entity.attributes) {
			const findAttr = (key) => {
				const match = Object.keys(entity.attributes).find((k) => k.toLowerCase() === key.toLowerCase());
				if (!match) return null;
				const val = entity.attributes[match];
				return Array.isArray(val) ? val[0]?.value : val;
			};
			return findAttr('Portrait') || findAttr('Image') || findAttr('Icon');
		}
		return null;
	}

	/**
	 * Flexible icon resolver.
	 * Can take a direct URL (from relationship column) or fallback to type-based icon.
	 */
	#resolveIcon(specificIcon, entityType) {
		// 1. If specific icon provided, construct proper path
		if (specificIcon) {
			// If it's already a full path (contains / or http), use as-is
			if (specificIcon.includes('/') || specificIcon.startsWith('http')) {
				return specificIcon;
			}
			// Otherwise, construct path assuming it's in the relationship_icons folder
			// Handle both with and without .png extension
			const fileName = specificIcon.endsWith('.png') ? specificIcon : `${specificIcon}.png`;
			return `${StoryHelperRelationships.ICON_BASE_PATH}/${fileName}`;
		}

		// 2. Fallback to generic type icon
		const typeKey = entityType?.toLowerCase();
		const genericFile =
			StoryHelperRelationships.TYPE_ICON_MAP[typeKey] || StoryHelperRelationships.TYPE_ICON_MAP.default;
		return `${StoryHelperRelationships.ICON_BASE_PATH}/${genericFile}`;
	}

	#getRelationshipColor(type) {
		const lowerType = type?.toLowerCase() || '';
		for (const [key, color] of Object.entries(StoryHelperRelationships.RELATIONSHIP_COLORS)) {
			if (lowerType.includes(key)) return color;
		}
		return StoryHelperRelationships.DEFAULT_COLOR;
	}

	#buildCytoscapeElements(entities) {
		const edges = [];
		const activeNodeIds = new Set();
		const entityMap = new Map();
		const entityIconMap = new Map(); // Track best icon for each entity

		entities.forEach((e) => entityMap.set(e.id, e));

		// 1. Build Edges and collect icons from relationships
		entities.forEach((entity) => {
			const rels = entity.relationships;
			if (!rels || !Array.isArray(rels)) return;

			rels.forEach((rel) => {
				if (!entityMap.has(rel.entity_id)) return;

				// Store icon from relationship for the target entity
				if (rel.icon && !entityIconMap.has(rel.entity_id)) {
					entityIconMap.set(rel.entity_id, rel.icon);
				}

				const color = this.#getRelationshipColor(rel.type);
				const isHostile = rel.type?.toLowerCase().match(/enemy|hostile|rival/);

				edges.push({
					data: {
						id: `e_${entity.id}_${rel.entity_id}`,
						source: entity.id,
						target: rel.entity_id,
						type: rel.type || 'Related',
						description: rel.description || '',
						color: color,
						bidirectional: rel.is_bidirectional || false,
						isHostile: !!isHostile,
					},
				});

				activeNodeIds.add(entity.id);
				activeNodeIds.add(rel.entity_id);
			});
		});

		// 2. Build Nodes (Only active ones)
		const nodes = [];
		activeNodeIds.forEach((id) => {
			const entity = entityMap.get(id);
			if (entity) {
				// Try: relationship icon > entity attributes > type fallback
				const relIcon = entityIconMap.get(id);
				const attrIcon = this.#getRawEntityIcon(entity);
				const rawIcon = relIcon || attrIcon;
				const resolvedIcon = this.#resolveIcon(rawIcon, entity.type);

				nodes.push({
					data: {
						id: entity.id,
						label: entity.name,
						type: entity.type,
						icon: resolvedIcon,
						degree: 0,
					},
				});
			}
		});

		return { nodes, edges };
	}

	// UI State methods
	#showLoading(contentArea) {
		contentArea.innerHTML = `
			<div class="story-view-container">
				<div class="view-header"><h2>Relationships</h2></div>
				<div class="loading-container">
					<div class="loading-spinner"></div>
					<p>Tracing connections...</p>
				</div>
			</div>
		`;
	}

	#showEmptyState(contentArea) {
		contentArea.innerHTML = `
			<div class="story-view-container">
				<div class="view-header"><h2>Relationships</h2></div>
				<div class="no-content">No relationships found.</div>
			</div>
		`;
	}

	#showError(contentArea, message) {
		contentArea.innerHTML = `
			<div class="story-view-container">
				<div class="view-header"><h2>Relationships</h2></div>
				<div class="error-message">
					<p><strong>Error loading graph</strong></p>
					<p class="error-details">${message}</p>
				</div>
			</div>
		`;
	}

	// Render methods
	#renderGraph(contentArea, elements) {
		const container = this.#createContainer();
		const graphWrapper = this.#createGraphWrapper();

		this.#container = document.createElement('div');
		this.#container.id = 'cy-container';
		this.#container.style.cssText = 'width: 100%; height: 100%; position: absolute; inset: 0;';

		this.#infoPanel = this.#createInfoPanel();
		const controls = this.#createControls();
		const searchBar = this.#createSearchBar();

		graphWrapper.append(this.#container, controls, searchBar, this.#infoPanel);
		container.append(this.#createHeader(), graphWrapper);
		contentArea.innerHTML = '';
		contentArea.appendChild(container);

		setTimeout(() => this.#initializeCytoscape(elements), 100);
	}

	#createContainer() {
		const container = document.createElement('div');
		container.className = 'story-view-container relationships-container';
		container.style.cssText =
			'height: 100%; width: 100%; display: flex; flex-direction: column; background: url(images/assets/background_texture.png);';
		return container;
	}

	#createHeader() {
		const header = document.createElement('div');
		header.className = 'view-header';
		header.innerHTML = '<h2>Relationship Graph</h2>';
		return header;
	}

	#createGraphWrapper() {
		const wrapper = document.createElement('div');
		wrapper.style.cssText = `
			flex: 1; 
			position: relative; 
			overflow: hidden; 
			background: #fffae9;
			background-image: url(images/assets/background_texture.png);
			width: 100%;
		`;
		return wrapper;
	}

	#createSearchBar() {
		const searchContainer = document.createElement('div');
		searchContainer.style.cssText = `
			position: absolute; top: 10px; right: 10px;
			display: flex; gap: 8px; z-index: 10; align-items: center;
		`;

		this.#searchInput = document.createElement('input');
		this.#searchInput.type = 'text';
		this.#searchInput.placeholder = 'Search NPCs...';
		this.#searchInput.style.cssText = `
			padding: 8px 12px; background: #fffcf1; border: 1px solid #c0aa76;
			border-radius: 4px; font-family: 'Noto Sans', sans-serif;
			font-size: 0.9rem; color: #5d4a3a; width: 200px;
			transition: all 0.2s;
		`;

		this.#searchInput.addEventListener('input', (e) => this.#handleSearch(e.target.value));

		const clearBtn = document.createElement('button');
		clearBtn.textContent = '✕';
		clearBtn.className = 'button-secondary';
		clearBtn.style.cssText = `
			padding: 8px 12px; background: #fffcf1; border: 1px solid #c0aa76;
			border-radius: 4px; cursor: pointer; font-family: 'Noto Sans', sans-serif;
			font-size: 0.9rem; color: #5d4a3a; transition: all 0.2s;
		`;

		clearBtn.addEventListener('click', () => {
			this.#searchInput.value = '';
			this.#handleSearch('');
		});

		searchContainer.append(this.#searchInput, clearBtn);
		return searchContainer;
	}

	#createControls() {
		const controls = document.createElement('div');
		controls.style.cssText = `
			position: absolute; top: 10px; left: 10px;
			display: flex; gap: 8px; z-index: 10; flex-wrap: wrap;
			max-width: 60%;
		`;

		const buttons = [
			{ text: 'Reset', action: () => this.#resetView() },
			{ text: '+', action: () => this.#cy?.zoom(this.#cy.zoom() * 1.2) },
			{ text: '−', action: () => this.#cy?.zoom(this.#cy.zoom() * 0.8) },
			{ text: '⛶', action: () => this.#toggleFullscreen() },
		];

		buttons.forEach(({ text, action }) => {
			const btn = document.createElement('button');
			btn.textContent = text;
			btn.className = 'button-secondary';
			btn.style.cssText = `
				padding: 8px 12px; background: #fffcf1; border: 1px solid #c0aa76;
				border-radius: 4px; cursor: pointer; font-family: 'Noto Sans', sans-serif;
				font-size: 0.9rem; color: #5d4a3a; transition: all 0.2s;
			`;
			btn.onclick = action;
			controls.appendChild(btn);
		});

		controls.appendChild(this.#createLayoutSelect());
		return controls;
	}

	#createLayoutSelect() {
		const select = document.createElement('select');
		select.style.cssText = `
			padding: 8px 12px; background: #fffcf1; border: 1px solid #c0aa76;
			border-radius: 4px; cursor: pointer; font-family: 'Noto Sans', sans-serif;
			font-size: 0.9rem; color: #5d4a3a;
		`;

		const layouts = [
			{ value: 'cose', label: 'Force Directed' },
			{ value: 'tension', label: 'Tension (Physics)' },
			{ value: 'circle', label: 'Circle' },
			{ value: 'concentric', label: 'Concentric' },
			{ value: 'breadthfirst', label: 'Hierarchy' },
		];

		layouts.forEach(({ value, label }) => {
			const option = document.createElement('option');
			option.value = value;
			option.textContent = label;
			if (value === this.#currentLayout) option.selected = true;
			select.appendChild(option);
		});

		select.addEventListener('change', (e) => {
			this.#currentLayout = e.target.value;
			this.#applyLayout(e.target.value);
		});
		return select;
	}

	#createInfoPanel() {
		const panel = document.createElement('div');
		panel.id = 'info-panel';
		panel.style.cssText = `
			position: absolute; bottom: 10px; right: 10px; background: #fffcf1;
			background-image: url('https://transparenttextures.com/patterns/little-pluses.png');
			border: 2px solid #c0aa76; border-radius: 8px; padding: 15px;
			max-width: min(320px, calc(100vw - 40px)); max-height: 40vh;
			overflow-y: auto; display: none; z-index: 20;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			font-family: 'Noto Sans', sans-serif;
		`;
		return panel;
	}

	// Search
	#handleSearch(query) {
		if (!this.#cy) return;
		this.#cy.elements().removeClass('search-match search-hidden');

		if (!query.trim()) return;

		const lowerQuery = query.toLowerCase();
		const matchedNodes = this.#cy.nodes().filter((node) => {
			return node.data('label').toLowerCase().includes(lowerQuery);
		});

		if (matchedNodes.length === 0) {
			this.#cy.elements().addClass('search-hidden');
			return;
		}

		matchedNodes.addClass('search-match');
		matchedNodes.connectedEdges().addClass('search-match');
		matchedNodes.connectedEdges().connectedNodes().addClass('search-match');
		this.#cy.elements().not('.search-match').addClass('search-hidden');

		this.#cy.animate({
			fit: { eles: matchedNodes.neighborhood().add(matchedNodes), padding: 50 },
			duration: 500,
		});
	}

	// Cytoscape Logic
	#initializeCytoscape(elements) {
		if (this.#cy) this.#cy.destroy();

		// eslint-disable-next-line no-undef
		this.#cy = cytoscape({
			container: this.#container,
			elements: [...(elements.nodes || []), ...(elements.edges || [])],
			style: this.#getCytoscapeStyles(),
			layout: this.#getLayoutConfig(this.#currentLayout),
			minZoom: 0.3,
			maxZoom: 3,
			wheelSensitivity: 0.2,
			autoungrabify: true, // Disable dragging
			autounselectify: false,
		});

		this.#attachEventHandlers();
	}

	#getCytoscapeStyles() {
		// RESTORED STYLES
		return [
			{
				selector: 'node',
				style: {
					width: 70,
					height: 70,
					'background-image': 'data(icon)',
					'background-fit': 'cover',
					'background-clip': 'node',
					'border-width': 4,
					'border-color': '#8b0000',
					'border-style': 'double',
					'border-opacity': 0.9,
					shape: 'ellipse',
					'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.3)',
					label: 'data(label)',
					'text-valign': 'bottom',
					'text-halign': 'center',
					'text-margin-y': 10,
					'font-size': '13px',
					'font-weight': 'bold',
					'font-family': 'Noto Sans',
					color: '#2c1810',
					'text-background-color': '#f4e4c1',
					'text-background-opacity': 0.95,
					'text-background-padding': '5px',
					'text-border-color': '#8b0000',
					'text-border-width': 1.5,
				},
			},
			{
				selector: 'node:selected',
				style: {
					'border-width': 4,
					'border-color': '#d4af37',
					'overlay-opacity': 0.2,
				},
			},
			{
				selector: 'edge',
				style: {
					width: 1,
					'line-color': 'data(color)',
					'target-arrow-color': 'data(color)',
					'target-arrow-shape': 'triangle',
					'curve-style': 'bezier',
					opacity: 0.7,
					'arrow-scale': 1.2,
				},
			},
			{
				selector: 'edge:selected',
				style: {
					width: 3,
					opacity: 1,
					'line-color': '#d4af37',
					'target-arrow-color': '#d4af37',
					'source-arrow-color': '#d4af37',
				},
			},
			{
				selector: '.highlighted',
				style: { width: 3, opacity: 1 },
			},
			{
				selector: '.dimmed',
				style: { opacity: 0.2 }, // Slightly less transparent than 0.1 for visibility
			},
			{
				selector: '.search-match',
				style: {
					'border-color': '#d4af37',
					'border-width': 5,
					opacity: 1,
				},
			},
			{
				selector: '.search-hidden',
				style: {
					opacity: 0.1,
					'text-opacity': 0.1,
				},
			},
		];
	}

	#getLayoutConfig(name) {
		const configs = {
			cose: {
				name: 'cose',
				idealEdgeLength: 350,
				nodeOverlap: 60,
				refresh: 20,
				fit: true,
				padding: 80,
				randomize: false,
				componentSpacing: 300,
				nodeRepulsion: 1200000,
				edgeElasticity: 80,
				nestingFactor: 5,
				gravity: 20,
				numIter: 1200,
				initialTemp: 250,
				coolingFactor: 0.95,
				minTemp: 1.0,
			},
			tension: {
				name: 'cose',
				idealEdgeLength: (edge) => (edge.data('isHostile') ? 500 : 200),
				nodeOverlap: 80,
				refresh: 20,
				fit: true,
				padding: 80,
				randomize: false,
				nodeRepulsion: (node) => 800000 + node.degree() * 200000,
				edgeElasticity: (edge) => (edge.data('isHostile') ? 32 : 100),
				gravity: 40,
				numIter: 1500,
			},
			circle: { name: 'circle', fit: true, padding: 30, avoidOverlap: true },
			concentric: { name: 'concentric', fit: true, padding: 30, concentric: (n) => n.degree(), levelWidth: () => 2 },
			breadthfirst: { name: 'breadthfirst', fit: true, padding: 30, directed: true, spacingFactor: 1.5 },
		};
		return configs[name] || configs.cose;
	}

	#attachEventHandlers() {
		// Node click: Show info + Highlight connections
		this.#cy.on('tap', 'node', (evt) => {
			const node = evt.target;
			this.#showNodeInfo(node);
			this.#highlightConnections(node);
		});

		// Edge click: Show edge info
		this.#cy.on('tap', 'edge', (evt) => this.#showEdgeInfo(evt.target));

		// Bg click: Reset
		this.#cy.on('tap', (evt) => {
			if (evt.target === this.#cy) {
				this.#resetView();
			}
		});

		this.#cy.on('mouseover', 'node', () => (this.#container.style.cursor = 'pointer'));
		this.#cy.on('mouseout', 'node', () => (this.#container.style.cursor = 'default'));
	}

	#highlightConnections(node) {
		this.#cy.elements().removeClass('highlighted dimmed');
		const connectedEdges = node.connectedEdges();
		const connectedNodes = connectedEdges.connectedNodes();
		// Dim everything that ISN'T connected or the node itself
		this.#cy.elements().not(connectedNodes).not(connectedEdges).not(node).addClass('dimmed');
		connectedEdges.addClass('highlighted');
	}

	#showNodeInfo(node) {
		const { id, label } = node.data();
		const edges = node.connectedEdges();

		let html = `
			<h3 style="margin: 0 0 12px 0; font-size: 1.2rem; color: #5d4a3a;
				border-bottom: 2px solid #c0aa76; padding-bottom: 8px;">
				${label}
			</h3>
			<p style="margin: 0 0 12px 0; color: #6d4c41;">
				<strong>Connections:</strong> ${edges.length}
			</p>
		`;

		if (edges.length > 0) {
			html += '<div style="margin-top: 12px;"><strong style="color: #5d4a3a;">Relationships:</strong></div>';
			html += '<ul style="margin: 8px 0; padding-left: 20px; list-style: none;">';

			edges.forEach((edge) => {
				const data = edge.data();
				const isSource = data.source === id;
				const isBidirectional = data.bidirectional;
				const otherId = isSource ? data.target : data.source;
				const otherNode = this.#cy.getElementById(otherId);
				const otherLabel = otherNode.data('label');

				const arrow = isBidirectional ? '↔' : isSource ? '→' : '←';

				html += `
					<li style="margin: 8px 0; padding: 8px;
						background: rgba(248, 244, 227, 0.5);
						border-left: 3px solid ${data.color}; border-radius: 4px;">
						<strong style="color: #5d4a3a;">
							${arrow} ${otherLabel}
						</strong><br>
						<span style="color: ${data.color}; font-weight: 600; font-size: 0.9em;">
							${data.type}
						</span>
						${data.description ? `<br><span style="font-size: 0.85em; color: #6d4c41;">${data.description}</span>` : ''}
					</li>
				`;
			});

			html += '</ul>';
		}

		this.#infoPanel.innerHTML = html;
		this.#infoPanel.style.display = 'block';
	}

	#showEdgeInfo(edge) {
		const data = edge.data();
		const sourceLabel = this.#cy.getElementById(data.source).data('label');
		const targetLabel = this.#cy.getElementById(data.target).data('label');
		const arrow = data.bidirectional ? '↔' : '→';

		this.#infoPanel.innerHTML = `
			<h3 style="margin: 0 0 12px 0; font-size: 1.1rem; color: #5d4a3a;
				border-bottom: 2px solid #c0aa76; padding-bottom: 8px;">
				Relationship
			</h3>
			<div style="margin-bottom: 10px;">
				<strong style="color: #5d4a3a;">${sourceLabel}</strong>
				<span style="margin: 0 8px;">${arrow}</span>
				<strong style="color: #5d4a3a;">${targetLabel}</strong>
			</div>
			<div style="padding: 10px; background: rgba(248, 244, 227, 0.5);
				border-left: 3px solid ${data.color}; border-radius: 4px; margin-top: 8px;">
				<div style="margin-bottom: 6px;">
					<strong style="color: #5d4a3a;">Type:</strong>
					<span style="color: ${data.color}; font-weight: 600; margin-left: 8px;">
						${data.type}
					</span>
				</div>
				${
					data.description
						? `<div><p style="margin: 4px 0 0 0; color: #6d4c41; line-height: 1.4;">${data.description}</p></div>`
						: ''
				}
			</div>
		`;
		this.#infoPanel.style.display = 'block';
	}

	#resetView() {
		if (!this.#cy) return;
		this.#cy.elements().removeClass('highlighted dimmed search-match search-hidden');
		this.#infoPanel.style.display = 'none';
		this.#searchInput.value = '';
		// this.#cy.fit();
	}

	#toggleFullscreen() {
		const container = document.querySelector('.relationships-container');
		if (!container) return;

		if (container.classList.contains('custom-fullscreen')) {
			container.classList.remove('custom-fullscreen');
			document.body.style.overflow = '';
			return;
		}

		if (!document.fullscreenElement && !document.webkitFullscreenElement) {
			const requestFS = container.requestFullscreen || container.webkitRequestFullscreen;
			if (requestFS) {
				requestFS.call(container).catch(() => this.#enterCustomFullscreen(container));
			} else {
				this.#enterCustomFullscreen(container);
			}
		} else {
			const exitFS = document.exitFullscreen || document.webkitExitFullscreen;
			if (exitFS) exitFS.call(document);
		}
	}

	#enterCustomFullscreen(container) {
		container.classList.add('custom-fullscreen');
		document.body.style.overflow = 'hidden';
	}

	#applyLayout(name) {
		if (!this.#cy) return;
		this.#cy.layout(this.#getLayoutConfig(name)).run();
	}
}
