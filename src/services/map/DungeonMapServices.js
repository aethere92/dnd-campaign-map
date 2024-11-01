// Constants
const CONFIG = Object.freeze({
	TILE_SIZE: 256,
	IS_DEBUG: false,
	EXPORT: {
		TIMEOUT_MS: 2000,
		MIN_FONT_SIZE: 8,
		QUALITY: 0.9,
		PADDING: 0.05,
	},
	MAP: {
		BOUNDS_PADDING: 0.05,
		DEFAULT_ATTRIBUTION: "A quest, a questin' we shall go",
		DEFAULT_BACKGROUND: '#e7dabb',
	},
});

// Helper Classes
class UrlManager {
	static getMapFromUrl() {
		return new URLSearchParams(window.location.search).get('map');
	}

	static updateUrl(mapKey, pushState = true) {
		const newUrl = new URL(window.location.href);
		newUrl.searchParams.set('map', mapKey);
		if (pushState) {
			window.history.pushState({ mapKey }, '', newUrl.toString());
		}
	}

	static updateUrl(mapKey, pushState = true, target = null) {
		let url = `?map=${mapKey}`;

		if (target) {
			// Simplified target format: type:id:lat,lng
			// Example: marker:cities.baldurs_gate:-167.34,210.40
			const targetStr = `${target.type}:${target.id}:${target.coordinates.join(',')}`;
			url += `&t=${encodeURIComponent(targetStr)}`;
		}

		if (pushState) {
			window.history.pushState({ mapKey, target }, '', url);
		} else {
			window.history.replaceState({ mapKey, target }, '', url);
		}
	}

	static getUrlParams() {
		const params = new URLSearchParams(window.location.search);
		const mapKey = params.get('map');
		const targetStr = params.get('t');

		let target = null;
		if (targetStr) {
			try {
				const [type, id, coords] = decodeURIComponent(targetStr).split(':');
				const [lat, lng] = coords.split(',').map(Number);

				target = {
					type,
					id,
					coordinates: [lat, lng],
				};
			} catch (e) {
				console.error('Failed to parse target from URL:', e);
			}
		}

		return { mapKey, target };
	}

	static clearTarget(mapKey) {
		this.updateUrl(mapKey, true);
	}
}

class MapStateManager {
	#state;

	constructor() {
		this.#state = {
			zoom: null,
			center: null,
			bounds: null,
		};
	}

	saveState(map) {
		this.#state = {
			zoom: map.getZoom(),
			center: map.getCenter(),
			bounds: map.getBounds(),
		};
	}

	restoreState(map) {
		if (this.#state.center && this.#state.zoom) {
			map.setView(this.#state.center, this.#state.zoom);
		}
	}
}

class LoadingManager {
	#indicator;
	#parent;

	constructor(parent) {
		this.#parent = parent;
		this.#indicator = this.#createIndicator();
	}

	#createIndicator() {
		const div = document.createElement('div');
		div.className = 'map-loading-indicator';
		div.innerHTML = 'Loading map...';
		div.style.cssText = `
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 10px 20px;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.2);
		z-index: 1000;
		font-family: system-ui;
	  `;
		return div;
	}

	show() {
		const element = document.getElementById(this.#parent);
		if (element && this.#indicator) {
			element.appendChild(this.#indicator);
			this.#indicator.style.display = 'block';
		}
	}

	hide() {
		if (this.#indicator) {
			this.#indicator.style.display = 'none';
			this.#indicator.remove();
		}
	}

	updateProgress(message) {
		if (this.#indicator) {
			this.#indicator.innerHTML = message;
		}
	}
}

class CustomMap {
	#config;
	#stateManager;
	#loadingManager;
	#map;
	#services;
	#currentMapKey;
	#bounds;
	#exportButton;
	#coordinatesDiv;
	#noteLayer;

	constructor(mapElementId, initialMapKey = 'world_maps.submaps.islands.korinis_island', isDebugMode = false) {
		this.#config = {
			mapElementId,
			initialMapKey,
			isDebugMode,
		};

		this.#stateManager = new MapStateManager();
		this.#loadingManager = new LoadingManager(mapElementId);
		this.#services = {
			annotations: null,
			paths: null,
		};

		window.customMap = this; // Keep for legacy compatibility
		this.#initialize();

		this.#map.on('click', (e) => {
			// Only clear if clicking on the map itself, not on markers/paths/areas
			if (
				e.originalEvent.target === this.#map._container ||
				e.originalEvent.target.classList.contains('leaflet-container')
			) {
				UrlManager.clearTarget(this.#currentMapKey);
			}
		});
	}

	#initialize() {
		// Create the base map
		this.#map = L.map(this.#config.mapElementId, {
			crs: L.CRS.Simple,
			minZoom: 0,
			zoomControl: true,
			attributionControl: true,
		});

		// Store reference to CustomMap instance
		this.#map.customMap = this;

		this.#initializeLayerControl();

		// Initialize service layers
		this.#noteLayer = L.layerGroup().addTo(this.#map);
		this.#services.annotations = new AnnotationService(this.#map);
		this.#services.paths = new PathManager(this.#map, this.#config.isDebugMode);

		// Initialize debug elements if needed
		// if (this.#config.isDebugMode) {
		this.#coordinatesDiv = L.DomUtil.create('div', 'coordinates-display');
		this.#coordinatesDiv.style.cssText = `
			position: absolute;
			bottom: 10px;
			left: 10px;
			background: white;
			padding: 5px;
			border-radius: 3px;
			z-index: 1000;
			font-family: system-ui;
		  `;
		document.getElementById(this.#config.mapElementId).appendChild(this.#coordinatesDiv);
		// }

		// Set up event listeners
		this.#initializeEventListeners();

		// Load initial map
		const urlMapKey = UrlManager.getMapFromUrl();
		if (urlMapKey) {
			this.loadMap(urlMapKey, false);
		} else {
			this.loadMap(this.#config.initialMapKey, false);
		}
	}

	async loadMap(mapKey, pushState = true) {
		const mapConfig = this.#getMapConfig(mapKey);
		if (!mapConfig) {
			throw new Error(`Map key '${mapKey}' not found in MAP_DATABASE`);
		}

		this.#currentMapKey = mapKey;

		try {
			this.#loadingManager.show();

			await this.#clearCurrentMap();
			await this.#setupNewMap(mapConfig);
			await this.#loadMapFeatures(mapConfig);

			// Get URL parameters after features are loaded
			const { target } = UrlManager.getUrlParams();

			if (target) {
				// Add a small delay to ensure all layers are properly initialized
				setTimeout(() => {
					this.#focusTarget(target);
				}, 100);
			} else {
				this.#map.setZoom(Math.floor(mapConfig.metadata.sizes.maxZoom / 2) ?? 1);
			}

			if (pushState) {
				UrlManager.updateUrl(mapKey, true, target);
			}
		} catch (error) {
			console.error('Error loading map:', error);
			throw error;
		} finally {
			this.#loadingManager.hide();
		}
	}

	#focusTarget(target) {
		if (!target) return;

		const coordinates = target.coordinates || target.center;
		if (!coordinates) return;

		// Set a higher zoom level for better focus
		const zoomLevel = this.#map.getMaxZoom() - 1;

		// First set the view
		this.#map.setView(coordinates, zoomLevel);

		// Then handle specific target types
		switch (target.type) {
			case 'marker':
				if (this.#services.annotations) {
					this.#services.annotations.focusMarker(target);
				}
				break;
			case 'path':
				if (this.#services.paths) {
					this.#services.paths.focusPath(target);
				}
				break;
			case 'area':
				if (this.#services.paths) {
					this.#services.paths.focusArea(target);
				}
				break;
		}
	}

	getCurrentMapKey() {
		return this.#currentMapKey;
	}

	async #clearCurrentMap() {
		// Remove all layers from the map
		this.#map.eachLayer((layer) => this.#map.removeLayer(layer));

		// Clear layer groups and controls
		if (this.#map.layerGroups) {
			Object.values(this.#map.layerGroups).forEach((category) => {
				category.layers = {};
				category.group.clearLayers();
			});
		}

		// Remove all controls except zoom
		this.#removeAllControls();

		// Re-initialize layer control
		this.#initializeLayerControl();
	}

	async #setupNewMap(mapConfig) {
		this.#map.setMaxZoom(mapConfig.metadata.sizes.maxZoom);

		mapConfig.imageWidth = mapConfig.metadata.sizes.imageWidth;
		mapConfig.imageHeight = mapConfig.metadata.sizes.imageHeight;

		this.#bounds = this.#calculateBounds(mapConfig);
		this.#setBoundsAndFit();

		this.addTileLayer(mapConfig);
	}

	async #loadMapFeatures(mapConfig) {
		if (this.#currentMapKey !== this.#config.initialMapKey) {
			this.addMapButton(this.#config.initialMapKey, 'topleft', 'Back to previous map');
		}

		if (mapConfig.annotations) {
			this.#services.annotations.addAnnotations(mapConfig.annotations);
		}

		this.#setMapColor(mapConfig);

		if (mapConfig.paths || mapConfig.areas) {
			this.#services.paths.init();
			if (mapConfig.paths) {
				this.#services.paths.loadPaths(mapConfig.paths);
			}
			if (mapConfig.areas) {
				this.#services.paths.createGeomanAreas(mapConfig.areas);
			}
		}

		this.#createExportButton();
	}

	addTileLayer(mapConfig) {
		const customTileLayer = new CustomTileLayer(`${mapConfig.metadata.path}/{z}/{x}_{y}.png`, {
			minZoom: 0,
			maxZoom: mapConfig.metadata.sizes.maxZoom,
			noWrap: true,
			bounds: this.#bounds,
			attribution: CONFIG.MAP.DEFAULT_ATTRIBUTION,
		});

		customTileLayer.addTo(this.#map);
	}

	addMapButton(mapKey, position = 'topleft', customLabel = null) {
		if (!this.#getMapConfig(mapKey)) {
			console.error(`Map key '${mapKey}' not found in MAP_DATABASE`);
			return;
		}

		const mapButton = L.control({ position });
		mapButton.onAdd = () => {
			const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
			const button = this.#createButtonElement(container, customLabel || this.#formatMapKeyLabel(mapKey));

			L.DomEvent.on(button, 'click', () => this.#handleMapButtonClick());
			L.DomEvent.disableClickPropagation(container);

			return container;
		};

		mapButton.addTo(this.#map);
	}

	#formatMapKeyLabel(mapKey) {
		return mapKey.split('.').pop().replace(/_/g, ' ');
	}

	#createButtonElement(container, label) {
		const button = L.DomUtil.create('button', 'leaflet-control-custom', container);
		button.innerHTML = label;
		button.style.cssText = `
		background-color: white;
		padding: 5px 10px;
		cursor: pointer;
		border: none;
		border-radius: 0.25rem;
		font-family: system-ui;
	  `;
		return button;
	}

	async #handleMapButtonClick() {
		if (this.#currentMapKey !== this.#config.initialMapKey) {
			const previousMapKey = this.#findPreviousMapKey();
			await this.loadMap(previousMapKey || this.#config.initialMapKey);
		} else {
			await this.loadMap(this.#config.initialMapKey);
		}
	}

	#findPreviousMapKey() {
		const mapKeyParts = this.#currentMapKey.split('.');
		const lastSubmapsIndex = mapKeyParts.lastIndexOf('submaps');

		if (lastSubmapsIndex > -1 && lastSubmapsIndex < mapKeyParts.length - 1) {
			return mapKeyParts.slice(0, lastSubmapsIndex).join('.');
		}

		return null;
	}

	#calculateBounds(mapConfig) {
		return new L.LatLngBounds(
			this.#map.unproject([0, mapConfig.imageHeight], mapConfig.metadata.sizes.maxZoom),
			this.#map.unproject([mapConfig.imageWidth, 0], mapConfig.metadata.sizes.maxZoom)
		);
	}

	#setBoundsAndFit() {
		const padding = CONFIG.MAP.BOUNDS_PADDING;
		const originalBounds = {
			north: this.#bounds.getNorth(),
			south: this.#bounds.getSouth(),
			east: this.#bounds.getEast(),
			west: this.#bounds.getWest(),
		};

		const extendedBounds = this.#calculateExtendedBounds(originalBounds, padding);
		this.#map.setMaxBounds(extendedBounds).fitBounds(this.#bounds);
	}

	#calculateExtendedBounds(bounds, padding) {
		const latDiff = bounds.north - bounds.south;
		const lngDiff = bounds.east - bounds.west;

		return L.latLngBounds(
			[bounds.south - latDiff * padding, bounds.west - lngDiff * padding],
			[bounds.north + latDiff * padding, bounds.east + lngDiff * padding]
		);
	}

	#initializeEventListeners() {
		this.#map.on('mousemove', this.#handleMouseMove.bind(this));
		this.#map.on('click', this.#handleMapClick.bind(this));

		window.addEventListener('popstate', (event) => {
			if (event.state?.mapKey) {
				this.loadMap(event.state.mapKey, false);
			}
		});
	}

	#handleMouseMove(e) {
		if (this.#coordinatesDiv) {
			const { lat, lng } = e.latlng;
			this.#coordinatesDiv.innerHTML = `<span>Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}</span>`;
		}
	}

	#handleMapClick(e) {
		this.#handleMouseMove(e);

		if (this.#config.isDebugMode) {
			this.#handleDebugClick(e);
		}
	}

	async #handleDebugClick(e) {
		const coordinates = `"lat":${e.latlng.lat}, "lng":${e.latlng.lng},`;

		try {
			await navigator.clipboard.writeText(coordinates);
			console.log('Coordinates copied to clipboard:', coordinates);
		} catch (err) {
			console.error('Failed to copy coordinates:', err);
		}
	}

	#createExportButton() {
		if (this.#exportButton) return;

		const exportButton = L.control({ position: 'topleft' });
		exportButton.onAdd = () => {
			const container = this.#createExportContainer();
			const button = this.#createExportButtonElement(container);
			const zoomSelect = this.#createZoomSelect(container);

			L.DomEvent.on(button, 'click', () => this.#handleExportClick(parseInt(zoomSelect.value)));
			L.DomEvent.disableClickPropagation(container);

			return container;
		};

		this.#exportButton = exportButton.addTo(this.#map);
	}

	#createExportContainer() {
		const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
		container.style.cssText = 'border: none;';
		return container;
	}

	#createExportButtonElement(container) {
		const button = L.DomUtil.create('button', 'leaflet-control-custom', container);
		button.innerHTML = 'Export Map';
		button.classList.add('button');
		button.style.cssText = `
		  background-color: white;
		  padding: 5px 10px;
		  cursor: pointer;
		  display: block;
		  margin-bottom: 5px;
		  border: 2px solid rgba(0, 0, 0, 0.2);
		  background-clip: padding-box;
		  border-radius: 0.25rem;
		  font-family: system-ui;
		`;
		return button;
	}

	#createZoomSelect(container) {
		const select = L.DomUtil.create('select', 'leaflet-control-custom', container);
		select.style.cssText = `
		  display: block;
		  width: 100%;
		  padding: 5px;
		  border: 2px solid rgba(0, 0, 0, 0.2);
		  background-clip: padding-box;
		  border-radius: 0.25rem;
		  color: black;
		  font-family: system-ui;
		`;

		const currentMapConfig = this.#getMapConfig(this.#currentMapKey);
		const maxZoom = currentMapConfig.metadata.sizes.maxZoom;

		for (let i = 0; i <= maxZoom; i++) {
			const option = L.DomUtil.create('option', '', select);
			option.value = i;
			option.text = `Zoom ${i + 1}`;
		}

		select.value = maxZoom;
		return select;
	}

	async #handleExportClick(exportZoom) {
		const currentMapConfig = this.#getMapConfig(this.#currentMapKey);
		this.#stateManager.saveState(this.#map);

		try {
			await MapExporter.exportMap(this.#map, {
				currentMapKey: this.#currentMapKey,
				exportZoom,
				...currentMapConfig,
			});
		} finally {
			this.#stateManager.restoreState(this.#map);
		}
	}

	#removeAllControls() {
		if (this.#exportButton) {
			this.#exportButton.remove();
			this.#exportButton = null;
		}

		// Remove all controls except zoom
		const controlContainers = document.querySelectorAll('.leaflet-control-container .leaflet-control');
		controlContainers.forEach((container) => {
			if (container.parentNode && !container.classList.contains('leaflet-control-zoom')) {
				container.parentNode.removeChild(container);
			}
		});
	}

	#getMapConfig(mapKey) {
		return mapKey.split('.').reduce((config, key) => config?.[key], MAP_DATABASE);
	}

	#setMapColor(config) {
		const mapElement = document.getElementById(this.#config.mapElementId);
		if (mapElement) {
			mapElement.style.background = config.metadata.backgroundColor || CONFIG.MAP.DEFAULT_BACKGROUND;
		}
	}

	updateLayerGroup(category, name, layer) {
		if (!this.#map.layerGroups[category]) return;

		this.#map.layerGroups[category].layers[name] = layer;
		this.#updateLayerControl();
	}

	// Add a method to get the layer groups
	getLayerGroups() {
		return this.#map.layerGroups;
	}

	#initializeLayerControl() {
		if (!this.#map.layerControl) {
			// Create layer groups for categories
			this.#map.layerGroups = {
				markers: {
					group: L.layerGroup().addTo(this.#map),
					label: '🎯 Markers',
					layers: {},
				},
				paths: {
					group: L.layerGroup(),
					label: '📝 Session recaps',
					layers: {},
				},
				areas: {
					group: L.layerGroup(),
					label: '🗺️ Map areas',
					layers: {},
				},
			};

			// Initialize empty layer control
			this.#map.layerControl = L.control.layers(null, null, { collapsed: true }).addTo(this.#map);

			// Add category headers
			this.#updateLayerControl();
		}
	}

	#updateLayerControl() {
		const control = this.#map.layerControl;
		if (!control) return;

		// Remove all existing layers
		control.remove();

		// Create a new control with updated layers
		const overlays = {};

		// Add layers for each category
		Object.entries(this.#map.layerGroups).forEach(([categoryKey, category]) => {
			// Only add category if it has layers
			if (Object.keys(category.layers).length > 0) {
				// Add category header with toggle button
				overlays[
					`<strong data-category="${categoryKey}" style="cursor: pointer;">
					<span class="category-toggle">▼</span> ${category.label}</strong>`
				] = L.layerGroup();

				// Add all layers in this category
				Object.entries(category.layers).forEach(([name, layer]) => {
					overlays[`<span class="layer-item-${categoryKey}" style="margin-left: 15px;">${name}</span>`] = layer;
				});
			}
		});

		// Only create control if there are any overlays
		if (Object.keys(overlays).length > 0) {
			this.#map.layerControl = L.control.layers(null, overlays, { collapsed: true }).addTo(this.#map);

			// Add click handlers for category toggles
			setTimeout(() => {
				const container = this.#map.layerControl.getContainer();

				// Style and handle category headers
				const labels = container.getElementsByTagName('label');
				Array.from(labels).forEach((label) => {
					if (label.innerHTML.includes('<strong')) {
						// Remove checkbox from category headers
						const input = label.querySelector('input');
						if (input) {
							input.style.display = 'none';
						}

						// Add click handler for category toggle
						const header = label.querySelector('strong');
						if (header) {
							// Remove any existing event listeners first
							const oldHeader = header.cloneNode(true);
							header.parentNode.replaceChild(oldHeader, header);

							const categoryKey = oldHeader.dataset.category;
							oldHeader.addEventListener('click', (e) => {
								e.stopPropagation();
								const toggle = oldHeader.querySelector('.category-toggle');
								const isExpanded = toggle.textContent === '▼';
								toggle.textContent = isExpanded ? '▶' : '▼';

								// Find all layer items for this category
								const layerItems = container.querySelectorAll(`[class*="layer-item-${categoryKey}"]`);
								layerItems.forEach((item) => {
									const layerLabel = item.closest('label');
									if (layerLabel) {
										layerLabel.style.display = isExpanded ? 'none' : 'block';
									}
								});
							});
						}
					}
				});
			}, 100);
		}
	}

	// Add this helper method to update layers
	updateLayerGroup(category, name, layer) {
		if (!this.#map.layerGroups[category]) return;

		this.#map.layerGroups[category].layers[name] = layer;
		this.#updateLayerControl();
	}

	getLayerControl() {
		if (!this.#map.layerControl) {
			this.#initializeLayerControl();
		}
		return this.#map.layerControl;
	}
}

// Custom Tile Layer implementation
class CustomTileLayer extends L.TileLayer {
	getTileUrl(coords) {
		const zoom = this._getZoomForUrl();
		const nwPoint = coords.scaleBy(L.point(CONFIG.TILE_SIZE, CONFIG.TILE_SIZE));

		// Ensure x and y are non-negative integers
		const x = Math.max(0, Math.floor(nwPoint.x / CONFIG.TILE_SIZE));
		const y = Math.max(0, Math.floor(nwPoint.y / CONFIG.TILE_SIZE));

		return L.Util.template(this._url, {
			s: this._getSubdomain(coords),
			x: x,
			y: y,
			z: zoom,
		});
	}
}

// Export Modal implementation
class ExportModal {
	#modal;

	constructor() {
		this.#modal = this.#createModal();
	}

	#createModal() {
		const modal = document.createElement('div');
		modal.style.cssText = `
		  position: fixed;
		  top: 50%;
		  left: 50%;
		  transform: translate(-50%, -50%);
		  background: white;
		  padding: 20px;
		  border-radius: 5px;
		  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
		  z-index: 1000;
		  display: none;
		  font-family: system-ui;
		  font-size: 10pt;
		`;
		document.body.appendChild(modal);
		return modal;
	}

	show(message) {
		this.#modal.textContent = message;
		this.#modal.style.display = 'block';
	}

	hide() {
		this.#modal.style.display = 'none';
	}

	destroy() {
		this.#modal.remove();
	}
}

class MapExporter {
	static async exportMap(map, config) {
		const exportModal = new ExportModal();
		const currentState = {
			zoom: map.getZoom(),
			center: map.getCenter(),
		};

		try {
			exportModal.show('Preparing map for export...');
			await this.#setMapForExport(map, config.exportZoom);
			const canvas = await this.#captureMap(map, config, exportModal);
			this.#downloadImage(canvas);
		} catch (error) {
			console.error('Error exporting map:', error);
			alert('Failed to export map. Please try again.');
		} finally {
			map.setView(currentState.center, currentState.zoom);
			exportModal.hide();
			exportModal.destroy();
		}
	}

	static async #setMapForExport(map, exportZoom) {
		return new Promise((resolve) => {
			map.setZoom(exportZoom);
			map.panTo(map.getBounds().getCenter());

			// Force a re-render of all tiles
			map.eachLayer((layer) => {
				if (layer instanceof L.TileLayer) {
					layer.redraw();
				}
			});

			// Wait for all tiles to load
			const checkTilesLoaded = setInterval(() => {
				if (this.#allTilesLoaded(map)) {
					clearInterval(checkTilesLoaded);
					resolve();
				}
			}, 100);
		});
	}

	static async #captureMap(map, config, exportModal) {
		const scale = Math.pow(2, config.metadata.sizes.maxZoom - config.exportZoom);
		let canvasWidth = config.metadata.sizes.imageWidth / scale;
		let canvasHeight = config.metadata.sizes.imageHeight / scale;

		const { width, height } = this.#calculateA4Dimensions(canvasWidth, canvasHeight);
		canvasWidth = width;
		canvasHeight = height;

		const canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		const ctx = canvas.getContext('2d');

		// Fill background
		ctx.fillStyle = document.getElementById('map').style.background || CONFIG.MAP.DEFAULT_BACKGROUND;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		const tileSize = CONFIG.TILE_SIZE;
		const tilesX = Math.ceil(config.metadata.sizes.imageWidth / scale / tileSize);
		const tilesY = Math.ceil(config.metadata.sizes.imageHeight / scale / tileSize);

		// Calculate offset to center the original content
		const offsetX = (canvasWidth - config.metadata.sizes.imageWidth / scale) / 2;
		const offsetY = (canvasHeight - config.metadata.sizes.imageHeight / scale) / 2;

		await this.#renderTiles(ctx, tilesX, tilesY, config, scale, offsetX, offsetY, exportModal);
		await this.#renderMarkers(ctx, map, scale, config.exportZoom, offsetX, offsetY);

		return canvas;
	}

	static #calculateA4Dimensions(width, height) {
		const isLandscape = width > height;
		const targetAspectRatio = isLandscape ? Math.sqrt(2) : 1 / Math.sqrt(2);
		const currentAspectRatio = width / height;

		if (isLandscape) {
			if (currentAspectRatio > targetAspectRatio) {
				height = width / targetAspectRatio;
			} else {
				width = height * targetAspectRatio;
			}
		} else {
			if (currentAspectRatio < targetAspectRatio) {
				width = height * targetAspectRatio;
			} else {
				height = width / targetAspectRatio;
			}
		}

		return {
			width: Math.round(width),
			height: Math.round(height),
		};
	}

	static async #renderTiles(ctx, tilesX, tilesY, config, scale, offsetX, offsetY, exportModal) {
		let loadedTiles = 0;
		const totalTiles = tilesX * tilesY;

		for (let y = 0; y < tilesY; y++) {
			for (let x = 0; x < tilesX; x++) {
				try {
					const tile = await this.#loadTile(x, y, config.exportZoom, config.metadata.path);
					ctx.drawImage(tile, x * CONFIG.TILE_SIZE + offsetX, y * CONFIG.TILE_SIZE + offsetY);
					loadedTiles++;
					exportModal.show(`Exporting map... ${((loadedTiles / totalTiles) * 100).toFixed(1)}% complete`);
				} catch (error) {
					console.error(`Failed to load tile at x: ${x}, y: ${y}`, error);
				}
			}
		}
	}

	static async #renderMarkers(ctx, map, scale, exportZoom, offsetX, offsetY) {
		const markers = [];
		map.eachLayer((layer) => {
			if (layer instanceof L.Marker) {
				markers.push(layer);
			}
		});

		await Promise.all(
			markers.map(async (marker) => {
				try {
					await this.#renderCustomMarker(ctx, marker, 1 / scale, exportZoom, offsetX, offsetY);
				} catch (error) {
					console.error('Failed to render marker:', error);
				}
			})
		);
	}

	static async #renderCustomMarker(ctx, marker, scale, exportZoom, offsetX, offsetY) {
		const markerLatLng = marker.getLatLng();
		const point = marker._map.project(markerLatLng, exportZoom);

		const x = Math.round(point.x) + offsetX;
		const y = Math.round(point.y) + offsetY;

		const icon = marker.options.icon;
		if (icon instanceof L.DivIcon) {
			const iconElement = document.createElement('div');
			iconElement.innerHTML = icon.options.html.trim();
			const imgElement = iconElement.querySelector('img');
			const iconText = iconElement.querySelector('.custom-icon-image');

			if (imgElement) {
				const iconImg = await this.#renderDivIconToImage(icon);

				if (iconImg) {
					const iconWidth = iconImg.width * scale;
					const iconHeight = iconImg.height * scale;
					const iconX = x - (icon.options.iconAnchor ? icon.options.iconAnchor[0] * scale : iconWidth / 2);
					const iconY = y - (icon.options.iconAnchor ? icon.options.iconAnchor[1] * scale : iconHeight / 2);

					ctx.drawImage(iconImg, iconX, iconY, iconWidth, iconHeight);

					if (iconText) {
						const label = iconText.getAttribute('data-label');
						if (label) {
							await this.#renderMarkerLabel(ctx, label, x, y, iconHeight, scale);
						}
					}
				}
			}
		}
	}

	static async #renderMarkerLabel(ctx, label, x, y, iconHeight, scale) {
		const fontSize = Math.max(16 * scale, CONFIG.EXPORT.MIN_FONT_SIZE);
		ctx.font = `${fontSize}pt Arial`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';

		const textMetrics = ctx.measureText(label);
		const textHeight = fontSize * 1.2;
		const padding = 4 * scale;

		const bgWidth = textMetrics.width + padding * 2;
		const bgHeight = textHeight + padding * 2;
		const textX = x;
		const textY = y + iconHeight / 2 + 6 * scale;
		const bgX = textX - bgWidth / 2;
		const bgY = textY;

		// Draw rounded rectangle background
		ctx.fillStyle = 'rgba(231, 218, 187, 0.9)';
		const radius = 4 * scale;
		ctx.beginPath();
		ctx.moveTo(bgX + radius, bgY);
		ctx.lineTo(bgX + bgWidth - radius, bgY);
		ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius);
		ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
		ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - radius, bgY + bgHeight);
		ctx.lineTo(bgX + radius, bgY + bgHeight);
		ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius);
		ctx.lineTo(bgX, bgY + radius);
		ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
		ctx.closePath();
		ctx.fill();

		// Draw text
		ctx.fillStyle = 'black';
		ctx.fillText(label, textX, textY + padding);
	}

	static async #renderDivIconToImage(icon) {
		return new Promise((resolve, reject) => {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = icon.options.html.trim();
			const iconElement = tempDiv.querySelector('img, svg');

			if (iconElement) {
				let img = new Image();

				if (iconElement.tagName.toLowerCase() === 'img') {
					const src = iconElement.src;
					if (src.startsWith('http://127.0.0.1:5500/') || src.startsWith('/')) {
						const basePath = window.location.origin;
						img.src = new URL(src.replace('http://127.0.0.1:5500/', '/'), basePath).href;
					} else {
						img.src = src;
					}
				} else if (iconElement.tagName.toLowerCase() === 'svg') {
					const svgData = new XMLSerializer().serializeToString(iconElement);
					const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
					img.src = URL.createObjectURL(svgBlob);
				}

				img.crossOrigin = 'anonymous';
				img.onload = () => {
					if (iconElement.tagName.toLowerCase() === 'svg') {
						URL.revokeObjectURL(img.src);
					}
					resolve(img);
				};

				img.onerror = (err) => {
					console.error('Failed to load icon:', err, img.src);
					if (iconElement.tagName.toLowerCase() === 'svg') {
						URL.revokeObjectURL(img.src);
					}
					resolve(this.#createFallbackIcon());
				};
			} else {
				resolve(this.#createFallbackIcon());
			}
		});
	}

	static #createFallbackIcon() {
		const canvas = document.createElement('canvas');
		canvas.width = 24;
		canvas.height = 24;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#FF0000';
		ctx.fillRect(0, 0, 24, 24);

		const fallbackImg = new Image();
		fallbackImg.src = canvas.toDataURL();
		return new Promise((resolve) => {
			fallbackImg.onload = () => resolve(fallbackImg);
		});
	}

	static async #loadTile(x, y, z, path) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.src = `${path}/${z}/${x}_${y}.png`;
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error(`Tile not found at ${x},${y},${z}`));
			setTimeout(() => reject(new Error('Tile load timeout')), CONFIG.EXPORT.TIMEOUT_MS);
		});
	}

	static #allTilesLoaded(map) {
		let allLoaded = true;
		map.eachLayer((layer) => {
			if (layer instanceof L.TileLayer) {
				const container = layer.getContainer();
				if (container) {
					const tiles = container.getElementsByTagName('img');
					for (let tile of tiles) {
						if (!tile.complete) {
							allLoaded = false;
							break;
						}
					}
				}
			}
		});
		return allLoaded;
	}

	static #downloadImage(canvas) {
		canvas.toBlob(
			(blob) => {
				const link = document.createElement('a');
				const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
				link.download = `map_${timestamp}.jpg`;
				link.href = URL.createObjectURL(blob);
				link.click();
				URL.revokeObjectURL(link.href);
			},
			'image/jpeg',
			CONFIG.EXPORT.QUALITY
		);
	}
}
