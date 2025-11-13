class StoryHelperRelationships {
	#campaign;
	#supabaseClient;
	#cy = null;
	#container = null;

	constructor(campaign) {
		this.#campaign = campaign;
		this.#supabaseClient = SupabaseClient.getInstance();
	}

	async render(contentArea) {
		contentArea.innerHTML = `
			<div class="story-view-container">
				<div class="view-header">
					<h2>NPC Relationships</h2>
				</div>
				<div class="loading-container">
					<div class="loading-spinner"></div>
					<p>Loading relationships...</p>
				</div>
			</div>
		`;

		try {
			// Fetch both relationships and NPC data
			const [relationships, npcs] = await Promise.all([this.#fetchRelationships(), this.#fetchNPCs()]);

			if (!relationships || relationships.length === 0) {
				contentArea.innerHTML = `
					<div class="story-view-container">
						<div class="view-header"><h2>NPC Relationships</h2></div>
						<div class="no-content">No relationships found for this campaign.</div>
					</div>
				`;
				return;
			}

			this.#renderGraph(contentArea, relationships, npcs);
		} catch (error) {
			console.error('Error rendering relationships:', error);
			contentArea.innerHTML = `
				<div class="story-view-container">
					<div class="view-header"><h2>NPC Relationships</h2></div>
					<div class="error-message">
						<p><strong>Error loading relationships</strong></p>
						<p class="error-details">${error.message}</p>
					</div>
				</div>
			`;
		}
	}

	async #fetchRelationships() {
		if (!this.#supabaseClient?.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#supabaseClient
				.getClient()
				.from('entities')
				.select('id, relationships')
				.eq('campaign_id', this.#campaign.id)
				.eq('entity_type', 'npc')
				.not('relationships', 'is', null);

			if (error) throw error;

			// Flatten the relationships array
			const flatRelationships = [];
			(data || []).forEach((entity) => {
				const relationships =
					typeof entity.relationships === 'string' ? JSON.parse(entity.relationships) : entity.relationships;

				if (Array.isArray(relationships)) {
					relationships.forEach((rel) => {
						flatRelationships.push({
							source_entity_id: entity.id,
							target_entity_id: rel.target_id,
							relationship_type: rel.type,
							description: rel.description,
							icon_type: rel.icon_type,
						});
					});
				}
			});

			return flatRelationships;
		} catch (error) {
			console.error('Error fetching relationships:', error);
			throw error;
		}
	}

	async #fetchNPCs() {
		if (!this.#supabaseClient?.isReady()) {
			throw new Error('Supabase client is not initialized');
		}

		try {
			const { data, error } = await this.#supabaseClient
				.getClient()
				.from('entities')
				.select('id, name, entity_icon_type')
				.eq('campaign_id', this.#campaign.id)
				.eq('entity_type', 'npc');

			if (error) throw error;

			// Create a map for quick lookup
			const npcMap = new Map();
			(data || []).forEach((npc) => {
				npcMap.set(npc.id, npc);
			});

			return npcMap;
		} catch (error) {
			console.error('Error fetching NPCs:', error);
			// Return empty map if NPCs can't be fetched
			return new Map();
		}
	}

	#getNodeIcon(npcId, npcs) {
		const npc = npcs.get(npcId);

		if (!npc || !npc.entity_icon_type) {
			return '../../images/assets/npc_icon_unknown_gender.png';
		}

		const type = npc.entity_icon_type.toLowerCase();

		if (type === 'female' || type === 'f') {
			return '../../images/assets/npc_icon_female.png';
		} else if (type === 'male' || type === 'm') {
			return '../../images/assets/npc_icon.png';
		} else if (type === 'monster') {
			return '../../images/assets/npc_icon_monster.png';
		} else {
			return '../../images/assets/npc_icon_unknown_gender.png';
		}
	}

	#formatNPCName(npcId, npcs) {
		const npc = npcs.get(npcId);
		if (npc?.name) {
			return npc.name;
		}

		// Fallback to formatting the ID
		return npcId
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	#getRelationshipColor(type) {
		const typeColors = {
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

		const lowerType = type?.toLowerCase() || '';

		for (const [key, color] of Object.entries(typeColors)) {
			if (lowerType.includes(key)) {
				return color;
			}
		}

		return '#8d6e63'; // Default D&D brown
	}

	#buildCytoscapeElements(relationships, npcs) {
		const nodes = new Map();
		const edges = [];

		// Create nodes from unique NPCs
		relationships.forEach((rel) => {
			if (!nodes.has(rel.source_entity_id)) {
				const icon = this.#getNodeIcon(rel.source_entity_id, npcs);
				nodes.set(rel.source_entity_id, {
					data: {
						id: rel.source_entity_id,
						label: this.#formatNPCName(rel.source_entity_id, npcs),
						icon: icon,
					},
				});
			}
			if (!nodes.has(rel.target_entity_id)) {
				const icon = this.#getNodeIcon(rel.target_entity_id, npcs);
				nodes.set(rel.target_entity_id, {
					data: {
						id: rel.target_entity_id,
						label: this.#formatNPCName(rel.target_entity_id, npcs),
						icon: icon,
					},
				});
			}

			// Create edge
			edges.push({
				data: {
					id: `${rel.source_entity_id}-${rel.target_entity_id}`,
					source: rel.source_entity_id,
					target: rel.target_entity_id,
					type: rel.relationship_type || 'unknown',
					description: rel.description || '',
					color: this.#getRelationshipColor(rel.relationship_type),
				},
			});
		});

		return {
			nodes: Array.from(nodes.values()),
			edges: edges,
		};
	}

	#renderGraph(contentArea, relationships, npcs) {
		const container = document.createElement('div');
		container.className = 'story-view-container relationships-container';
		container.style.cssText = 'height: 100%; width: 100%; display: flex; flex-direction: column;';

		const header = document.createElement('div');
		header.className = 'view-header';
		header.innerHTML = '<h2>NPC Relationships</h2>';

		const graphWrapper = document.createElement('div');
		graphWrapper.style.cssText = `
			flex: 1; 
			position: relative; 
			overflow: hidden; 
			background: #fffae9;
			background-image: url(../../images/assets/background_texture.png);
			min-height: 500px;
			width: calc(100% - 2rem);
			margin-bottom: 1rem;
		`;

		this.#container = document.createElement('div');
		this.#container.id = 'cy-container';
		this.#container.style.cssText = 'width: 100%; height: 100%;';

		// Controls overlay
		const controls = document.createElement('div');
		controls.style.cssText = `
			position: absolute;
			top: 10px;
			left: 10px;
			display: flex;
			gap: 8px;
			z-index: 10;
			flex-wrap: wrap;
		`;

		const controlButtons = [
			{ text: 'Reset', title: 'Reset View', action: () => this.#resetView() },
			{ text: '+', title: 'Zoom In', action: () => this.#cy?.zoom(this.#cy.zoom() * 1.2) },
			{ text: '−', title: 'Zoom Out', action: () => this.#cy?.zoom(this.#cy.zoom() * 0.8) },
		];

		controlButtons.forEach((btn) => {
			const button = document.createElement('button');
			button.textContent = btn.text;
			button.title = btn.title;
			button.className = 'button-secondary';
			button.style.cssText = `
				padding: 8px 12px;
				background: #fffcf1;
				border: 1px solid #c0aa76;
				border-radius: 4px;
				cursor: pointer;
				font-family: 'Noto Sans', sans-serif;
				font-size: 0.9rem;
				color: #5d4a3a;
				transition: all 0.2s;
			`;
			button.addEventListener('click', btn.action);
			button.addEventListener('mouseenter', () => {
				button.style.background = '#f8f4e3';
				button.style.borderColor = '#8d6e63';
			});
			button.addEventListener('mouseleave', () => {
				button.style.background = '#fffcf1';
				button.style.borderColor = '#c0aa76';
			});
			controls.appendChild(button);
		});

		// Layout dropdown
		const layoutSelect = document.createElement('select');
		layoutSelect.title = 'Change Layout';
		layoutSelect.style.cssText = `
			padding: 8px 12px;
			background: #fffcf1;
			border: 1px solid #c0aa76;
			border-radius: 4px;
			cursor: pointer;
			font-family: 'Noto Sans', sans-serif;
			font-size: 0.9rem;
			color: #5d4a3a;
		`;

		const layouts = [
			{ value: 'cose', label: 'Force Directed' },
			{ value: 'circle', label: 'Circle' },
			{ value: 'concentric', label: 'Concentric' },
			{ value: 'grid', label: 'Grid' },
			{ value: 'breadthfirst', label: 'Hierarchy' },
		];

		layouts.forEach((layout) => {
			const option = document.createElement('option');
			option.value = layout.value;
			option.textContent = layout.label;
			layoutSelect.appendChild(option);
		});

		layoutSelect.addEventListener('change', (e) => {
			this.#applyLayout(e.target.value);
		});

		controls.appendChild(layoutSelect);

		const infoPanel = document.createElement('div');
		infoPanel.id = 'info-panel';
		infoPanel.style.cssText = `
			position: absolute;
			bottom: 10px;
			right: 10px;
			background: #fffcf1;
			background-image: url('https://transparenttextures.com/patterns/little-pluses.png');
			border: 2px solid #c0aa76;
			border-radius: 8px;
			padding: 15px;
			max-width: min(320px, calc(100vw - 40px));
			max-height: 40vh;
			overflow-y: auto;
			display: none;
			z-index: 10;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			font-family: 'Noto Sans', sans-serif;
		`;

		graphWrapper.append(this.#container, controls, infoPanel);
		container.append(header, graphWrapper);
		contentArea.innerHTML = '';
		contentArea.appendChild(container);

		// Wait for container to have dimensions
		setTimeout(() => {
			this.#initializeCytoscape(relationships, npcs, infoPanel);
		}, 100);
	}

	#initializeCytoscape(relationships, npcs, infoPanel) {
		const elements = this.#buildCytoscapeElements(relationships, npcs);

		this.#cy = cytoscape({
			container: this.#container,
			elements: [...elements.nodes, ...elements.edges],

			style: [
				{
					selector: 'node',
					style: {
						width: 60,
						height: 60,
						'background-image': 'data(icon)',
						'background-fit': 'cover',
						'background-clip': 'none',
						'border-width': 3,
						'border-color': '#8d6e63',
						'border-opacity': 0.8,
						label: 'data(label)',
						'text-valign': 'bottom',
						'text-halign': 'center',
						'text-margin-y': 8,
						'font-size': '12px',
						'font-weight': 'bold',
						'font-family': 'Noto Sans, sans-serif',
						color: '#3e2723',
						'text-background-color': '#fffcf1',
						'text-background-opacity': 0.9,
						'text-background-padding': '4px',
						'text-background-shape': 'roundrectangle',
						'text-border-color': '#c0aa76',
						'text-border-width': 1,
						'text-border-opacity': 0.8,
						'overlay-padding': 6,
						'overlay-color': '#c0aa76',
						'overlay-opacity': 0,
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
					selector: 'node:active',
					style: {
						'overlay-opacity': 0.3,
					},
				},
				{
					selector: 'edge',
					style: {
						width: 2,
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
					},
				},
				{
					selector: 'edge.highlighted',
					style: {
						width: 3,
						opacity: 1,
					},
				},
				{
					selector: 'node.dimmed',
					style: {
						opacity: 0.3,
					},
				},
				{
					selector: 'edge.dimmed',
					style: {
						opacity: 0.2,
					},
				},
			],

			layout: {
				name: 'cose',
				idealEdgeLength: 100,
				nodeOverlap: 20,
				refresh: 20,
				fit: true,
				padding: 30,
				randomize: false,
				componentSpacing: 100,
				nodeRepulsion: 400000,
				edgeElasticity: 100,
				nestingFactor: 5,
				gravity: 80,
				numIter: 1000,
				initialTemp: 200,
				coolingFactor: 0.95,
				minTemp: 1.0,
			},

			minZoom: 0.3,
			maxZoom: 3,
			wheelSensitivity: 0.2,
		});

		// Event handlers
		this.#cy.on('tap', 'node', (evt) => {
			const node = evt.target;
			this.#showNodeInfo(node, infoPanel);
			this.#highlightConnections(node);
		});

		this.#cy.on('tap', 'edge', (evt) => {
			const edge = evt.target;
			this.#showEdgeInfo(edge, infoPanel);
		});

		this.#cy.on('tap', (evt) => {
			if (evt.target === this.#cy) {
				infoPanel.style.display = 'none';
				this.#clearHighlights();
			}
		});

		// Hover effects
		this.#cy.on('mouseover', 'node', (evt) => {
			this.#container.style.cursor = 'pointer';
		});

		this.#cy.on('mouseout', 'node', (evt) => {
			this.#container.style.cursor = 'default';
		});

		// Initial fit
		setTimeout(() => {
			this.#cy.fit(null, 50);
			this.#cy.center();
		}, 100);
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

	#showNodeInfo(node, infoPanel) {
		const nodeData = node.data();
		const connectedEdges = node.connectedEdges();

		let html = `
			<h3 style="
				margin: 0 0 12px 0;
				font-size: 1.2rem;
				color: #5d4a3a;
				border-bottom: 2px solid #c0aa76;
				padding-bottom: 8px;
			">${nodeData.label}</h3>
			<p style="margin: 0 0 12px 0; color: #6d4c41;">
				<strong>Connections:</strong> ${connectedEdges.length}
			</p>
		`;

		if (connectedEdges.length > 0) {
			html += '<div style="margin-top: 12px;"><strong style="color: #5d4a3a;">Relationships:</strong></div>';
			html += '<ul style="margin: 8px 0; padding-left: 20px; list-style: none;">';

			connectedEdges.forEach((edge) => {
				const edgeData = edge.data();
				const isSource = edgeData.source === nodeData.id;
				const otherNodeId = isSource ? edgeData.target : edgeData.source;
				const otherNode = this.#cy.getElementById(otherNodeId);
				const otherNodeLabel = otherNode.data('label');

				html += `
					<li style="
						margin: 8px 0; 
						padding: 8px;
						background: rgba(248, 244, 227, 0.5);
						border-left: 3px solid ${edgeData.color};
						border-radius: 4px;
					">
						<strong style="color: #5d4a3a;">
							${isSource ? '→' : '←'} ${otherNodeLabel}
						</strong><br>
						<span style="color: ${edgeData.color}; font-weight: 600; font-size: 0.9em;">
							${edgeData.type}
						</span>
						${edgeData.description ? `<br><span style="font-size: 0.85em; color: #6d4c41;">${edgeData.description}</span>` : ''}
					</li>
				`;
			});

			html += '</ul>';
		}

		infoPanel.innerHTML = html;
		infoPanel.style.display = 'block';
	}

	#showEdgeInfo(edge, infoPanel) {
		const edgeData = edge.data();
		const sourceNode = this.#cy.getElementById(edgeData.source);
		const targetNode = this.#cy.getElementById(edgeData.target);

		const html = `
			<h3 style="
				margin: 0 0 12px 0;
				font-size: 1.1rem;
				color: #5d4a3a;
				border-bottom: 2px solid #c0aa76;
				padding-bottom: 8px;
			">Relationship</h3>
			<div style="margin-bottom: 10px;">
				<strong style="color: #5d4a3a;">${sourceNode.data('label')}</strong>
				<span style="margin: 0 8px;">→</span>
				<strong style="color: #5d4a3a;">${targetNode.data('label')}</strong>
			</div>
			<div style="
				padding: 10px;
				background: rgba(248, 244, 227, 0.5);
				border-left: 3px solid ${edgeData.color};
				border-radius: 4px;
				margin-top: 8px;
			">
				<div style="margin-bottom: 6px;">
					<strong style="color: #5d4a3a;">Type:</strong>
					<span style="color: ${edgeData.color}; font-weight: 600; margin-left: 8px;">
						${edgeData.type}
					</span>
				</div>
				${
					edgeData.description
						? `
					<div>
						<strong style="color: #5d4a3a;">Description:</strong>
						<p style="margin: 4px 0 0 0; color: #6d4c41; line-height: 1.4;">
							${edgeData.description}
						</p>
					</div>
				`
						: ''
				}
			</div>
		`;

		infoPanel.innerHTML = html;
		infoPanel.style.display = 'block';
	}

	#resetView() {
		if (this.#cy) {
			this.#cy.fit(null, 50);
			this.#cy.zoom(1);
			this.#clearHighlights();
			const infoPanel = document.getElementById('info-panel');
			if (infoPanel) {
				infoPanel.style.display = 'none';
			}
		}
	}

	#applyLayout(layoutName = 'cose') {
		if (!this.#cy) return;

		const layoutConfigs = {
			cose: {
				name: 'cose',
				idealEdgeLength: 100,
				nodeOverlap: 20,
				refresh: 20,
				fit: true,
				padding: 30,
				randomize: false,
				componentSpacing: 100,
				nodeRepulsion: 400000,
				edgeElasticity: 100,
				nestingFactor: 5,
				gravity: 80,
				numIter: 1000,
				initialTemp: 200,
				coolingFactor: 0.95,
				minTemp: 1.0,
			},
			circle: {
				name: 'circle',
				fit: true,
				padding: 30,
				avoidOverlap: true,
				radius: undefined,
			},
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
			'cose-bilkent': {
				name: 'cose-bilkent',
				fit: true,
				padding: 30,
				randomize: false,
				nodeRepulsion: 4500,
				idealEdgeLength: 100,
				edgeElasticity: 0.45,
				nestingFactor: 0.1,
				gravity: 0.25,
				numIter: 2500,
				tile: true,
			},
		};

		const config = layoutConfigs[layoutName] || layoutConfigs.cose;
		const layout = this.#cy.layout(config);
		layout.run();
	}
}
