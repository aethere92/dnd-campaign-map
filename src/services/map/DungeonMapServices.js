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
	#campaignData;
	#debugs;

	constructor(mapElementId, options = {}) {
		const { initialMapKey = 'korinis_island', isDebugMode = false, campaignData = null } = options;

		this.#config = {
			mapElementId,
			initialMapKey,
			isDebugMode,
		};

		this.#campaignData = campaignData;
		this.#stateManager = new MapStateManager();
		this.#loadingManager = new LoadingManager(mapElementId);
		this.#services = {
			annotations: null,
			paths: null,
			sidebar: null,
			nestedLayerControl: null,
		};
		this.#debugs = {
			lightsCoords: [],
		};

		window.customMap = this;
		this.#initialize();
	}

	updateCampaignData(newData) {
		this.#campaignData = newData;
	}

	// Initialization Methods
	#initialize() {
		this.#initializeMap();
		this.#initializeLayerControl();
		this.#initializeServices();
		this.#initializeDebugElements();
		this.#initializeEventListeners();
		this.#loadInitialMap();
	}

	#initializeMap() {
		this.#map = L.map(this.#config.mapElementId, {
			crs: L.CRS.Simple,
			minZoom: 0,
			zoomControl: true,
			attributionControl: true,
			rotate: true,
			touchRotate: false,
		});

		this.#map.customMap = this;

		this.#map.on('click', (e) => {
			if (
				e.originalEvent.target === this.#map._container ||
				e.originalEvent.target.classList.contains('leaflet-container')
			) {
				// Use the current map key when clearing target
				UrlManager.clearTarget(this.#currentMapKey);
			}
		});
	}

	#initializeServices() {
		this.#services.annotations = new AnnotationService(this.#map);
		this.#services.paths = new PathManager(this.#map, false);
		this.#services.sidebar = new SidebarService(this.#map).init();
		this.#services.markers = new MarkerManager(this.#map, this.#config.isDebugMode);
	}

	#initializeDebugElements() {
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

	#loadInitialMap() {
		const urlMapKey = UrlManager.getMapFromUrl();
		if (urlMapKey) {
			this.loadMap(urlMapKey, false);
		} else {
			this.loadMap(this.#config.initialMapKey, false);
		}
	}

	// Map Loading Methods
	async loadMap(mapKey, pushState = true, extra = null) {
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
			await this.#handleTargetFocus(pushState);

			if (extra?.exitCoordinates) {
				setTimeout(() => this.#map.setView(extra.exitCoordinates, extra.exitZoom), 300);
			}
		} catch (error) {
			console.error('Error loading map:', error);
			throw error;
		} finally {
			this.#loadingManager.hide();
		}
	}

	async #handleTargetFocus(pushState) {
		const { target } = UrlManager.getUrlParams();

		if (target) {
			setTimeout(() => {
				this.#focusTarget(target);
			}, 100);
		} else {
			const mapConfig = this.#getMapConfig(this.#currentMapKey);
			this.#map.setZoom(Math.floor(mapConfig.metadata.sizes.maxZoom / 2) ?? 1);
		}

		if (pushState) {
			UrlManager.updateUrl(this.#currentMapKey, true, target);
		}
	}

	async #clearCurrentMap() {
		this.#map.eachLayer((layer) => this.#map.removeLayer(layer));

		if (this.#map.layerGroups) {
			Object.values(this.#map.layerGroups).forEach((category) => {
				category.layers = {};
				category.group.clearLayers();
			});
		}

		this.#removeAllControls();
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

		// Add overlays if they exist in the map config
		if (mapConfig.overlays) {
			this.#loadOverlays(mapConfig.overlays);
		}

		this.#setupExportButton();
	}

	// Add this method to the CustomMap class
	#createDraggableImageOverlay(overlay) {
		// Create the image overlay
		const imageOverlay = L.imageOverlay(overlay.image, overlay.bounds, {
			opacity: 1,
			interactive: true,
		});

		if (this.#config.isDebugMode) {
			// Create markers for the corners
			const southWest = L.marker(overlay.bounds[0], {
				draggable: true,
				icon: L.divIcon({
					className: 'corner-marker',
					html: '◢',
					iconSize: [20, 20],
				}),
			});

			const northEast = L.marker(overlay.bounds[1], {
				draggable: true,
				icon: L.divIcon({
					className: 'corner-marker',
					html: '◣',
					iconSize: [20, 20],
				}),
			});

			// Add CSS for corner markers
			const style = document.createElement('style');
			style.textContent = `
            .corner-marker {
                color: blue;
                font-size: 20px;
                text-shadow: 2px 2px white;
                background: none;
                border: none;
            }
        `;
			document.head.appendChild(style);

			// Update overlay bounds when markers are dragged
			southWest.on('drag', () => {
				const newBounds = [southWest.getLatLng(), northEast.getLatLng()];
				imageOverlay.setBounds(newBounds);
				this.#logOverlayConfig(overlay.name, newBounds);
			});

			northEast.on('drag', () => {
				const newBounds = [southWest.getLatLng(), northEast.getLatLng()];
				imageOverlay.setBounds(newBounds);
				this.#logOverlayConfig(overlay.name, newBounds);
			});

			// Add markers to the map when overlay is added
			imageOverlay.on('add', () => {
				southWest.addTo(this.#map);
				northEast.addTo(this.#map);
			});

			// Remove markers when overlay is removed
			imageOverlay.on('remove', () => {
				southWest.remove();
				northEast.remove();
			});
		}

		return imageOverlay;
	}

	// Helper method to log the current overlay configuration
	#logOverlayConfig(name, bounds) {
		const config = {
			name: name,
			bounds: [
				[parseFloat(bounds[0].lat.toFixed(1)), parseFloat(bounds[0].lng.toFixed(1))],
				[parseFloat(bounds[1].lat.toFixed(1)), parseFloat(bounds[1].lng.toFixed(1))],
			],
		};
		console.log('Current overlay configuration:');
		console.log(JSON.stringify(config, null, 2));
	}

	// Modified overlay loading method
	#loadOverlays(overlays) {
		overlays.forEach((overlay) => {
			// Create draggable image overlay
			const imageOverlay = this.#createDraggableImageOverlay(overlay);

			// Add to layer group
			this.#map.layerGroups.overlays.layers[overlay.name] = imageOverlay;

			// Add to layer control
			this.#services.nestedLayerControl.addLayerToGroup(imageOverlay, overlay.name, 'overlays');
		});
	}

	// Layer Control Methods
	#initializeLayerControl() {
		if (!this.#services.nestedLayerControl) {
			this.#services.nestedLayerControl = new NestedLayerControl(null, null, {
				collapsed: true,
				sortLayers: true,
			});
			this.#services.nestedLayerControl.addTo(this.#map);

			// Initialize all groups first
			this.#services.nestedLayerControl.addGroup('markers', {
				label: '🎯 Markers',
				collapsed: false,
			});

			this.#services.nestedLayerControl.addGroup('paths', {
				label: '📝 Session recaps',
				collapsed: false,
				defaultVisible: false,
			});

			this.#services.nestedLayerControl.addGroup('areas', {
				label: '🗺️ Map areas',
				collapsed: false,
				defaultVisible: false,
			});

			// Add overlays group during initialization
			this.#services.nestedLayerControl.addGroup('overlays', {
				label: '🖼️ Overlays',
				collapsed: false,
				defaultVisible: false,
			});

			this.#map.layerGroups = {
				markers: {
					group: L.layerGroup().addTo(this.#map),
					layers: {},
				},
				paths: {
					group: L.layerGroup(),
					layers: {},
				},
				areas: {
					group: L.layerGroup(),
					layers: {},
				},
				overlays: {
					group: L.layerGroup(),
					layers: {},
				},
			};
		}
	}

	updateLayerGroup(category, name, layer) {
		if (!this.#map.layerGroups[category]) return;
		this.#services.nestedLayerControl.addLayerToGroup(layer, name, category);
	}

	addLayerSubgroup(parentCategory, subgroupId, options = {}) {
		if (!this.#services.nestedLayerControl) return;
		this.#services.nestedLayerControl.addGroup(subgroupId, {
			...options,
			parentId: parentCategory,
		});
	}

	addLayerToSubgroup(layer, name, subgroupId) {
		if (!this.#services.nestedLayerControl) return;
		this.#services.nestedLayerControl.addLayerToGroup(layer, name, subgroupId);
	}

	getLayerControl() {
		if (!this.#services.nestedLayerControl) {
			this.#initializeLayerControl();
		}
		return this.#services.nestedLayerControl;
	}

	getLayerGroups() {
		return this.#map.layerGroups;
	}

	// Event Handlers
	#handleMouseMove(e) {
		if (this.#coordinatesDiv) {
			const { lat, lng } = e.latlng;
			this.#coordinatesDiv.innerHTML = `<span>Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}</span>`;
		}
	}

	#handleMapClick(e) {
		this.#handleMouseMove(e);

		if (this.#config.isDebugMode) {
			const IS_LIGHTS_DEBUG = true;

			if (!IS_LIGHTS_DEBUG) {
				const { lat, lng } = e.latlng;
				navigator.clipboard
					.writeText(`lat: ${lat}, lng: ${lng},`)
					.catch((err) => console.error('Failed to copy:', err));
			} else {
				const { lat, lng } = e.latlng;
				this.#debugs.lightsCoords.push([lat, lng]);
				console.log(JSON.stringify(this.#debugs.lightsCoords));
			}
		}
	}

	// Map Feature Methods
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

	// Helper Methods
	#focusTarget(target) {
		if (!target) return;

		const coordinates = target.coordinates || target.center;
		if (!coordinates) return;

		const zoomLevel = this.#map.getMaxZoom();
		this.#map.setView(coordinates, zoomLevel);

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

	#getMapConfig(mapKey) {
		if (!mapKey || !this.#campaignData) return null;

		const fullPath = CAMPAIGN_01_ALIASES[mapKey] || mapKey; // Use alias if it exists
		const pathParts = fullPath.split('.');

		return pathParts.reduce((config, key) => {
			return config?.[key];
		}, this.#campaignData);
	}

	#setMapColor(config) {
		const mapElement = document.getElementById(this.#config.mapElementId);
		if (mapElement) {
			mapElement.style.background = config.metadata.backgroundColor || CONFIG.MAP.DEFAULT_BACKGROUND;
		}
	}

	// Export functionality
	#setupExportButton() {
		const exportMapBtn = document.getElementById('export-map');
		const zoomSelect = this.#setupZoomSelect();

		zoomSelect.addEventListener('click', (e) => {
			e.stopPropagation();
		});

		exportMapBtn.addEventListener('click', () => {
			const exportZoom = parseInt(zoomSelect.value);
			this.#handleExportClick(parseInt(zoomSelect.value));
		});
	}

	#setupZoomSelect() {
		const currentMapConfig = this.#getMapConfig(this.#currentMapKey);
		const maxZoom = currentMapConfig.metadata.sizes.maxZoom;

		const zoomSelect = document.getElementById('zoom-select');
		// You can set maxZoom based on your map configuration
		for (let i = 0; i < maxZoom; i++) {
			const option = document.createElement('option');
			option.value = i;
			option.text = `Zoom ${i + 1}`;
			zoomSelect.appendChild(option);
		}
		zoomSelect.value = maxZoom - 1;
		return zoomSelect;
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

		if (this.#services.nestedLayerControl) {
			this.#services.nestedLayerControl.remove();
			this.#services.nestedLayerControl = null;
		}

		const controlContainers = document.querySelectorAll(
			'.leaflet-control-container .leaflet-control:not(.leaflet-control-rotate)'
		);
		controlContainers.forEach((container) => {
			if (container.parentNode && !container.classList.contains('leaflet-control-zoom')) {
				container.parentNode.removeChild(container);
			}
		});
	}

	getCurrentMapKey() {
		return this.#currentMapKey;
	}
}

// Custom Tile Layer implementation
class CustomTileLayer extends L.TileLayer {
	getTileUrl(coords) {
		const zoom = this._getZoomForUrl();
		const nwPoint = coords.scaleBy(L.point(CONFIG.TILE_SIZE, CONFIG.TILE_SIZE));

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
