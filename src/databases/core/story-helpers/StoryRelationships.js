class StoryHelperRelationships {
	#campaign;
	#supabaseClient;
	#cy = null;
	#container = null;
	#infoPanel = null;

	// Constants
	static ICON_BASE_PATH = 'images/assets/relationship_icons';
	static ICON_MAP = {
		female: 'npc_icon_female.png',
		male: 'npc_icon.png',
		monster: 'npc_icon_monster.png',
		gnome: 'npc_icon_gnome.png',
		feline: 'npc_icon_feline.png',
		avian: 'npc_icon_avian.png',
	};
	static RELATIONSHIP_COLORS = {
		enemy: '#f44336',
		hostile: '#f44336',
		ally: '#4caf50',
		friend: '#4caf50',
		companion: '#2196f3',
		partner: '#2196f3',
		lover: '#e91e63',
		family: '#9c27b0',
		commander: '#ff9800',
		superior: '#ff9800',
		subordinate: '#ff9800',
		colleague: '#607d8b',
		neutral: '#9e9e9e',
	};
	static DEFAULT_COLOR = '#8d6e63';

	constructor(campaign) {
		this.#campaign = campaign;
		this.#supabaseClient = SupabaseClient.getInstance();
	}

	async render(contentArea) {
		this.#showLoading(contentArea);

		try {
			const [relationships, npcs] = await Promise.all([this.#fetchRelationships(), this.#fetchNPCs()]);

			if (!relationships?.length) {
				this.#showEmptyState(contentArea);
				return;
			}

			this.#renderGraph(contentArea, relationships, npcs);
		} catch (error) {
			console.error('Error rendering relationships:', error);
			this.#showError(contentArea, error.message);
		}
	}

	// Simplified fetch methods
	async #fetchRelationships() {
		const { data, error } = await this.#supabaseClient
			.getClient()
			.from('entities')
			.select('id, relationships')
			.eq('campaign_id', this.#campaign.id)
			.not('relationships', 'is', null);

		if (error) throw error;

		return (
			data?.flatMap((entity) => {
				const rels = typeof entity.relationships === 'string' ? JSON.parse(entity.relationships) : entity.relationships;

				return Array.isArray(rels)
					? rels.map((rel) => ({
							source_entity_id: entity.id,
							target_entity_id: rel.target_id,
							target_entity_name: rel.target_name,
							relationship_type: rel.type,
							description: rel.description,
							icon_type: rel.icon_type,
					  }))
					: [];
			}) || []
		);
	}

	async #fetchNPCs() {
		const { data, error } = await this.#supabaseClient
			.getClient()
			.from('entities')
			.select('id, name, entity_icon_type')
			.eq('campaign_id', this.#campaign.id);

		if (error) throw error;
		return new Map(data?.map((npc) => [npc.id, npc]) || []);
	}

	// Utility methods
	#getNodeIcon(npcId, npcs) {
		const type = npcs.get(npcId)?.entity_icon_type?.toLowerCase();
		if (!type) return `${StoryHelperRelationships.ICON_BASE_PATH}/npc_icon_unknown_gender.png`;

		const mapped = StoryHelperRelationships.ICON_MAP[type];
		return mapped
			? `${StoryHelperRelationships.ICON_BASE_PATH}/${mapped}`
			: `${StoryHelperRelationships.ICON_BASE_PATH}/npc_icon_${type}.png`;
	}

	#formatNPCName(npcId, npcs) {
		return (
			npcs.get(npcId)?.name ||
			npcId
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')
		);
	}

	#getRelationshipColor(type) {
		const lowerType = type?.toLowerCase() || '';
		for (const [key, color] of Object.entries(StoryHelperRelationships.RELATIONSHIP_COLORS)) {
			if (lowerType.includes(key)) return color;
		}
		return StoryHelperRelationships.DEFAULT_COLOR;
	}

	#buildCytoscapeElements(relationships, npcs) {
		const nodes = new Map();
		const edgeMap = new Map();

		relationships.forEach((rel) => {
			// Add source node
			if (!nodes.has(rel.source_entity_id)) {
				nodes.set(rel.source_entity_id, {
					data: {
						id: rel.source_entity_id,
						label: this.#formatNPCName(rel.source_entity_id, npcs),
						icon: this.#getNodeIcon(rel.source_entity_id, npcs),
					},
				});
			}

			// Add target node
			if (!nodes.has(rel.target_entity_id)) {
				nodes.set(rel.target_entity_id, {
					data: {
						id: rel.target_entity_id,
						label: this.#formatNPCName(rel.target_entity_name ?? rel.target_entity_id, npcs),
						icon: this.#getNodeIcon(rel.target_entity_id, npcs),
					},
				});
			}

			// Create bidirectional edge key (sorted to match both directions)
			const edgeKey = [rel.source_entity_id, rel.target_entity_id].sort().join('|');
			const reverseKey = [rel.target_entity_id, rel.source_entity_id].sort().join('|');

			// Check if edge already exists in either direction
			if (!edgeMap.has(edgeKey)) {
				edgeMap.set(edgeKey, {
					source: rel.source_entity_id,
					target: rel.target_entity_id,
					types: [rel.relationship_type || 'unknown'],
					descriptions: [rel.description || ''],
					colors: [this.#getRelationshipColor(rel.relationship_type)],
					bidirectional: false,
				});
			} else {
				// Edge exists - mark as bidirectional and add additional info
				const existing = edgeMap.get(edgeKey);
				existing.bidirectional = true;
				existing.types.push(rel.relationship_type || 'unknown');
				existing.descriptions.push(rel.description || '');
				existing.colors.push(this.#getRelationshipColor(rel.relationship_type));
			}
		});

		// Convert edge map to array with proper arrow configuration
		const edges = Array.from(edgeMap.values()).map((edge, index) => ({
			data: {
				id: `edge-${index}`,
				source: edge.source,
				target: edge.target,
				type: edge.types.join(' / '),
				description: edge.descriptions.filter(d => d).join(' | '),
				color: edge.colors[0], // Use first color
				bidirectional: edge.bidirectional,
			},
		}));

		return { nodes: Array.from(nodes.values()), edges };
	}

	// UI State methods
	#showLoading(contentArea) {
		contentArea.innerHTML = `
			<div class="story-view-container">
				<div class="view-header"><h2>NPC Relationships</h2></div>
				<div class="loading-container">
					<div class="loading-spinner"></div>
					<p>Loading relationships...</p>
				</div>
			</div>
		`;
	}

	#showEmptyState(contentArea) {
		contentArea.innerHTML = `
			<div class="story-view-container">
				<div class="view-header"><h2>NPC Relationships</h2></div>
				<div class="no-content">No relationships found for this campaign.</div>
			</div>
		`;
	}

	#showError(contentArea, message) {
		contentArea.innerHTML = `
			<div class="story-view-container">
				<div class="view-header"><h2>NPC Relationships</h2></div>
				<div class="error-message">
					<p><strong>Error loading relationships</strong></p>
					<p class="error-details">${message}</p>
				</div>
			</div>
		`;
	}

	// Render methods
	#renderGraph(contentArea, relationships, npcs) {
		const container = this.#createContainer();
		const graphWrapper = this.#createGraphWrapper();

		this.#container = document.createElement('div');
		this.#container.id = 'cy-container';
		this.#container.style.cssText = 'width: 100%; height: 100%;';

		this.#infoPanel = this.#createInfoPanel();
		const controls = this.#createControls();

		graphWrapper.append(this.#container, controls, this.#infoPanel);
		container.append(this.#createHeader(), graphWrapper);
		contentArea.innerHTML = '';
		contentArea.appendChild(container);

		setTimeout(() => this.#initializeCytoscape(relationships, npcs), 100);
	}

	#createContainer() {
		const container = document.createElement('div');
		container.className = 'story-view-container relationships-container';
		container.style.cssText =
			'height: 100%; width: 100%; display: flex; flex-direction: column; background: url(images/assets/background_texture.png)';
		return container;
	}

	#createHeader() {
		const header = document.createElement('div');
		header.className = 'view-header';
		header.innerHTML = '<h2>NPC Relationships</h2>';
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
			min-height: 500px;
			width: calc(100% - 2rem);
			margin-bottom: 1rem;
		`;
		return wrapper;
	}

	#createControls() {
		const controls = document.createElement('div');
		controls.style.cssText = `
			position: absolute; top: 10px; left: 10px;
			display: flex; gap: 8px; z-index: 10; flex-wrap: wrap;
		`;

		const buttons = [
			{ text: 'Reset', title: 'Reset View', action: () => this.#resetView() },
			{ text: '+', title: 'Zoom In', action: () => this.#cy?.zoom(this.#cy.zoom() * 1.2) },
			{ text: '−', title: 'Zoom Out', action: () => this.#cy?.zoom(this.#cy.zoom() * 0.8) },
			{ text: '⛶', title: 'Toggle Fullscreen', action: () => this.#toggleFullscreen() },
		];

		buttons.forEach((btn) => controls.appendChild(this.#createButton(btn)));
		controls.appendChild(this.#createLayoutSelect());

		return controls;
	}

	#createButton({ text, title, action }) {
		const button = document.createElement('button');
		button.textContent = text;
		button.title = title;
		button.className = 'button-secondary';
		button.style.cssText = `
			padding: 8px 12px; background: #fffcf1; border: 1px solid #c0aa76;
			border-radius: 4px; cursor: pointer; font-family: 'Noto Sans', sans-serif;
			font-size: 0.9rem; color: #5d4a3a; transition: all 0.2s;
		`;
		button.addEventListener('click', action);
		button.addEventListener('mouseenter', () => {
			button.style.background = '#f8f4e3';
			button.style.borderColor = '#8d6e63';
		});
		button.addEventListener('mouseleave', () => {
			button.style.background = '#fffcf1';
			button.style.borderColor = '#c0aa76';
		});
		return button;
	}

	#createLayoutSelect() {
		const select = document.createElement('select');
		select.title = 'Change Layout';
		select.style.cssText = `
			padding: 8px 12px; background: #fffcf1; border: 1px solid #c0aa76;
			border-radius: 4px; cursor: pointer; font-family: 'Noto Sans', sans-serif;
			font-size: 0.9rem; color: #5d4a3a;
		`;

		const layouts = [
			{ value: 'cose', label: 'Force Directed' },
			{ value: 'circle', label: 'Circle' },
			{ value: 'concentric', label: 'Concentric' },
			{ value: 'grid', label: 'Grid' },
			{ value: 'breadthfirst', label: 'Hierarchy' },
		];

		layouts.forEach(({ value, label }) => {
			const option = document.createElement('option');
			option.value = value;
			option.textContent = label;
			select.appendChild(option);
		});

		select.addEventListener('change', (e) => this.#applyLayout(e.target.value));
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
			overflow-y: auto; display: none; z-index: 10;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			font-family: 'Noto Sans', sans-serif;
		`;
		return panel;
	}

	// Cytoscape initialization
	#initializeCytoscape(relationships, npcs) {
		const elements = this.#buildCytoscapeElements(relationships, npcs);

		this.#cy = cytoscape({
			container: this.#container,
			elements: [...elements.nodes, ...elements.edges],
			style: this.#getCytoscapeStyles(),
			layout: this.#getLayoutConfig('cose'),
			minZoom: 0.3,
			maxZoom: 3,
			wheelSensitivity: 0.2,
			autoungrabify: true, // Disable node dragging
			autounselectify: false, // Keep selection enabled
		});

		this.#attachEventHandlers();
		setTimeout(() => {
			this.#cy.fit(null, 50);
			this.#cy.center();
		}, 100);
	}

	#getCytoscapeStyles() {
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
				selector: 'edge[bidirectional = true]',
				style: {
					'source-arrow-color': 'data(color)',
					'source-arrow-shape': 'triangle',
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
				style: { opacity: (node) => (node.isNode() ? 0.3 : 0.2) },
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
			circle: { name: 'circle', fit: true, padding: 30, avoidOverlap: true },
			concentric: {
				name: 'concentric',
				fit: true,
				padding: 30,
				concentric: (node) => node.degree(),
				levelWidth: () => 2,
			},
			grid: {
				name: 'grid',
				fit: true,
				padding: 30,
				avoidOverlap: true,
				avoidOverlapPadding: 10,
			},
			breadthfirst: {
				name: 'breadthfirst',
				fit: true,
				padding: 30,
				directed: true,
				spacingFactor: 1.5,
			},
		};
		return configs[name] || configs.cose;
	}

	// Event handlers
	#attachEventHandlers() {
		this.#cy.on('tap', 'node', (evt) => {
			this.#showNodeInfo(evt.target);
			this.#highlightConnections(evt.target);
		});

		this.#cy.on('tap', 'edge', (evt) => this.#showEdgeInfo(evt.target));

		this.#cy.on('tap', (evt) => {
			if (evt.target === this.#cy) {
				this.#infoPanel.style.display = 'none';
				this.#clearHighlights();
			}
		});

		this.#cy.on('mouseover', 'node', () => (this.#container.style.cursor = 'pointer'));
		this.#cy.on('mouseout', 'node', () => (this.#container.style.cursor = 'default'));
	}

	#highlightConnections(node) {
		this.#cy.elements().removeClass('highlighted dimmed');
		const connectedEdges = node.connectedEdges();
		const connectedNodes = connectedEdges.connectedNodes();
		this.#cy.elements().not(connectedNodes).not(connectedEdges).not(node).addClass('dimmed');
		connectedEdges.addClass('highlighted');
	}

	#clearHighlights() {
		this.#cy.elements().removeClass('highlighted dimmed');
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
				const otherLabel = this.#cy.getElementById(otherId).data('label');
				
				const arrow = isBidirectional ? '↔' : (isSource ? '→' : '←');

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
						? `
					<div>
						<strong style="color: #5d4a3a;">Description:</strong>
						<p style="margin: 4px 0 0 0; color: #6d4c41; line-height: 1.4;">
							${data.description}
						</p>
					</div>
				`
						: ''
				}
			</div>
		`;
		this.#infoPanel.style.display = 'block';
	}

	// Control actions
	#resetView() {
		if (!this.#cy) return;
		this.#cy.fit(null, 50);
		this.#cy.zoom(1);
		this.#clearHighlights();
		this.#infoPanel.style.display = 'none';
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

	#applyLayout(layoutName = 'cose') {
		if (!this.#cy) return;
		const config = this.#getLayoutConfig(layoutName);
		this.#cy.layout(config).run();
	}
}