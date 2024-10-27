// Constants
const CONFIG = {
	TILE_SIZE: 256,
	IS_DEBUG: false,
};

// Main Map Class
class CustomMap {
	constructor(mapElementId, initialMapKey = 'world_maps.submaps.islands.main_map_01', isDebugMode = false) {
		this.mapElementId = mapElementId;
		this.exportButton = null;
		this.currentMapKey = null;
		this.annotationService = null;
		this.pathManager = null;
		this.loadingIndicator = this._createLoadingIndicator();
		this.isDebugMode = isDebugMode;
		this.initialMapKey = initialMapKey;

		window.customMap = this;
		this.init(initialMapKey);
	}

	async init(mapKey) {
		try {
			this.map = this._initializeMap();
			this.annotationService = new AnnotationService(this.map);
			this.pathManager = new PathManager(this.map, this.isDebugMode);
			this.noteLayer = L.layerGroup().addTo(this.map);
			this.coordinatesDiv = document.getElementById('coordinates');

			await this.loadMap(mapKey);
			this._initializeEventListeners();

			this.map.whenReady(() => {
				this._createExportButton();
			});
		} catch (error) {
			console.error('Error initializing map:', error);
			this._hideLoadingIndicator();
		}
	}

	_initializeMap() {
		const mapElement = document.getElementById(this.mapElementId);
		if (!mapElement) {
			throw new Error(`Map element with ID '${this.mapElementId}' not found`);
		}

		return L.map(this.mapElementId, {
			crs: L.CRS.Simple,
			minZoom: 0,
			zoomSnap: 1,
		});
	}

	addMapButton(mapKey, position = 'topleft', customLabel = null) {
		if (!this._getMapConfig(mapKey)) {
			console.error(`Map key '${mapKey}' not found in MAP_DATABASE`);
			return;
		}

		const mapButton = L.control({ position });
		mapButton.onAdd = () => {
			const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
			const button = L.DomUtil.create('button', 'leaflet-control-custom', container);
			button.innerHTML = customLabel || mapKey.split('.').pop().replace(/_/g, ' ');
			button.style.cssText =
				'background-color: white; padding: 5px 10px; cursor: pointer; border: none; border-radius: 0.25rem; font-family: system-ui;';

			L.DomEvent.on(button, 'click', () => this.loadMap(mapKey));
			L.DomEvent.disableClickPropagation(container);

			return container;
		};
		mapButton.addTo(this.map);
	}

	async loadMap(mapKey) {
		const mapConfig = this._getMapConfig(mapKey);
		if (!mapConfig) {
			throw new Error(`Map key '${mapKey}' not found in MAP_DATABASE`);
		}

		this.currentMapKey = mapKey;

		try {
			this._showLoadingIndicator();

			// Clear existing layers and controls
			this.map.eachLayer((layer) => this.map.removeLayer(layer));
			this._removeAllControls();

			// Update map zoom settings
			this.map.setMaxZoom(mapConfig.metadata.sizes.maxZoom);

			// Initialize dimensions and update bounds
			mapConfig.imageWidth = mapConfig.metadata.sizes.imageWidth;
			mapConfig.imageHeight = mapConfig.metadata.sizes.imageHeight;
			this.bounds = this._calculateBounds(mapConfig);
			this._setBoundsAndFit();

			// Add new tile layer
			this.addTileLayer(mapConfig);

			// Add back-to-main button if not on main map
			if (mapKey !== this.initialMapKey) {
				this.addMapButton(this.initialMapKey, 'topleft', 'Back to Main Map');
			}

			// Add annotations if they exist for this map
			if (mapConfig.annotations) {
				this.annotationService.addAnnotations(mapConfig.annotations);
			}

			this._setMapColor(mapConfig);

			if (mapConfig.paths) {
				this.pathManager.init();
				this.pathManager.loadPaths(mapConfig.paths);
			}

			// Recreate export button
			this._createExportButton();

			// Set default zoom to half the maximum
			this.map.setZoom(Math.floor(mapConfig.metadata.sizes.maxZoom / 2) ?? 1);
		} catch (error) {
			console.error('Error loading map:', error);
		} finally {
			this._hideLoadingIndicator();
		}
	}

	_setMapColor(config) {
		const map = document.getElementById('map');
		if (!config.metadata.backgroundColor) map.style.background = '#e7dabb';
		else map.style.background = config.metadata.backgroundColor;
	}

	_getMapConfig(mapKey) {
		const keys = mapKey.split('.');
		let config = MAP_DATABASE;
		for (const key of keys) {
			if (config[key]) {
				config = config[key];
			} else {
				return null;
			}
		}
		return config;
	}

	_removeAllControls() {
		// Remove export button
		if (this.exportButton) {
			this.exportButton.remove();
			this.exportButton = null;
		}

		// Remove layer control
		if (this.layerControl) {
			this.map.removeControl(this.layerControl);
			this.layerControl = null;
		}

		// Remove other controls
		const controlContainers = document.querySelectorAll('.leaflet-control-container .leaflet-control');
		controlContainers.forEach((container) => {
			if (container.parentNode && !container.classList.contains('leaflet-control-zoom')) {
				container.parentNode.removeChild(container);
			}
		});
	}

	_createLoadingIndicator() {
		const loadingDiv = document.createElement('div');
		loadingDiv.className = 'map-loading-indicator';
		loadingDiv.innerHTML = 'Loading map...';
		loadingDiv.style.cssText = `
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
		return loadingDiv;
	}

	_showLoadingIndicator() {
		const mapElement = document.getElementById(this.mapElementId);
		if (mapElement && this.loadingIndicator) {
			mapElement.appendChild(this.loadingIndicator);
			this.loadingIndicator.style.display = 'block';
		}
	}

	_hideLoadingIndicator() {
		if (this.loadingIndicator) {
			this.loadingIndicator.style.display = 'none';
			if (this.loadingIndicator.parentNode) {
				this.loadingIndicator.parentNode.removeChild(this.loadingIndicator);
			}
		}
	}

	async _initializeMapDimensions(mapConfig) {
		try {
			// Start with default dimensions
			let maxX = 0;
			let maxY = 0;

			// Check for tiles at max zoom level
			const z = mapConfig.metadata.sizes.maxZoom;

			// First, scan horizontally to find the maximum X
			let x = 0;
			while (true) {
				try {
					await this._loadTile(x, 0, z, mapConfig.path);
					x++;
				} catch (error) {
					maxX = x;
					break;
				}
			}

			// Then, scan vertically to find the maximum Y
			let y = 0;
			while (true) {
				try {
					await this._loadTile(0, y, z, mapConfig.path);
					y++;
				} catch (error) {
					maxY = y;
					break;
				}
			}

			// Calculate actual image dimensions
			mapConfig.imageWidth = maxX * CONFIG.TILE_SIZE;
			mapConfig.imageHeight = maxY * CONFIG.TILE_SIZE;

			console.log(`Map dimensions calculated: ${mapConfig.imageWidth}x${mapConfig.imageHeight}`);
		} catch (error) {
			console.error('Error initializing map dimensions:', error);
			// Set default dimensions if calculation fails
			mapConfig.imageWidth = CONFIG.TILE_SIZE;
			mapConfig.imageHeight = CONFIG.TILE_SIZE;
		}
	}

	_calculateBounds(mapConfig) {
		return new L.LatLngBounds(
			this.map.unproject([0, mapConfig.imageHeight], mapConfig.metadata.sizes.maxZoom),
			this.map.unproject([mapConfig.imageWidth, 0], mapConfig.metadata.sizes.maxZoom)
		);
	}

	_setBoundsAndFit() {
		// Extend bounds by 10%
		const padding = 0.05; // 10% padding
		const originalNorth = this.bounds.getNorth();
		const originalSouth = this.bounds.getSouth();
		const originalEast = this.bounds.getEast();
		const originalWest = this.bounds.getWest();

		const latDiff = originalNorth - originalSouth;
		const lngDiff = originalEast - originalWest;

		const extendedBounds = L.latLngBounds(
			[originalSouth - latDiff * padding, originalWest - lngDiff * padding],
			[originalNorth + latDiff * padding, originalEast + lngDiff * padding]
		);

		// Set max bounds to extended bounds, but fit to original bounds
		this.map.setMaxBounds(extendedBounds).fitBounds(this.bounds);
	}

	_initializeEventListeners() {
		this.map.on('mousemove', this._updateCoordinates.bind(this));
		this.map.on('click', this._updateCoordinates.bind(this));
		if (CONFIG.IS_DEBUG) {
			this.map.on('click', this._handleDebugClick.bind(this));
		}
	}

	_updateCoordinates(e) {
		if (this.coordinatesDiv) {
			const { lat, lng } = e.latlng;
			this.coordinatesDiv.innerHTML = `<span>Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}</span>`;
		}
	}

	addTileLayer(mapConfig) {
		const customTileLayer = new CustomTileLayer(`${mapConfig.metadata.path}/{z}/{x}_{y}.png`, {
			minZoom: 0,
			maxZoom: mapConfig.metadata.sizes.maxZoom,
			noWrap: true,
			bounds: this.bounds,
			attribution: "A quest, a questin' we shall go",
		});

		customTileLayer.addTo(this.map);
	}

	async _handleDebugClick(e) {
		// const label = prompt('Please enter a label for this location:');
		// if (label === null) return;

		// const { shiftKey } = e.originalEvent;
		// const output = JSON.stringify({
		// 	lat: e.latlng.lat,
		// 	lng: e.latlng.lng,
		// 	label,
		// 	type: shiftKey ? 'people' : 'place',
		// 	icon: shiftKey ? 'user' : 'mapPin',
		// });

		// console.log(output);
		console.log(`"lat":${e.latlng.lat}, "lng":${e.latlng.lng},`);
		try {
			// await navigator.clipboard.writeText(output);
			await navigator.clipboard.writeText(`"lat":${e.latlng.lat}, "lng":${e.latlng.lng},`);
			console.log('Output copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy output: ', err);
		}
	}

	_createExportButton() {
		if (this.exportButton) return;

		const exportButton = L.control({ position: 'topleft' });
		exportButton.onAdd = () => {
			const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
			container.style.cssText = 'border: none;';

			const button = L.DomUtil.create('button', 'leaflet-control-custom', container);
			button.innerHTML = 'Export Map';
			button.classList.add('button');
			button.style.cssText =
				'background-color: white; color: ; padding: 5px 10px; cursor: pointer; display: block; margin-bottom: 5px; border: 2px solid rgba(0, 0, 0, 0.2); background-clip: padding-box; border-radius: 0.25rem; font-family: system-ui;';

			const zoomSelect = L.DomUtil.create('select', 'leaflet-control-custom', container);
			zoomSelect.style.cssText =
				'display: block; width: 100%; padding: 5px; border: 2px solid rgba(0, 0, 0, 0.2); background-clip: padding-box; border-radius: 0.25rem; color: black; font-family: system-ui';

			// Add zoom level options based on current map config
			const currentMapConfig = this._getMapConfig(this.currentMapKey);
			for (let i = 0; i <= currentMapConfig.metadata.sizes.maxZoom; i++) {
				const option = L.DomUtil.create('option', '', zoomSelect);
				option.value = i;
				option.text = `Zoom ${i + 1}`;
			}

			// Set default value to max zoom
			zoomSelect.value = currentMapConfig.metadata.sizes.maxZoom;

			L.DomEvent.on(button, 'click', () => this._handleExportClick(parseInt(zoomSelect.value)));
			L.DomEvent.disableClickPropagation(container);

			return container;
		};

		this.exportButton = exportButton.addTo(this.map);
	}

	async _handleExportClick(exportZoom) {
		const exportModal = new ExportModal();
		try {
			exportModal.show('Preparing map for export...');

			const currentState = {
				zoom: this.map.getZoom(),
				center: this.map.getCenter(),
			};

			await this._setMapForExport(exportZoom);
			const canvas = await this._captureMap(exportModal, exportZoom);
			this._downloadImage(canvas);

			this.map.setView(currentState.center, currentState.zoom);
		} catch (error) {
			console.error('Error exporting map:', error);
			alert('Failed to export map. Please try again.');
		} finally {
			exportModal.hide();
		}
	}

	async _setMapForExport(exportZoom) {
		return new Promise((resolve) => {
			this.map.setZoom(exportZoom);
			this.map.panTo(this.bounds.getCenter());

			// Force a re-render of all tiles
			this.map.eachLayer((layer) => {
				if (layer instanceof L.TileLayer) {
					layer.redraw();
				}
			});

			// Wait for all tiles to load
			const checkTilesLoaded = setInterval(() => {
				if (this._allTilesLoaded()) {
					clearInterval(checkTilesLoaded);
					resolve();
				}
			}, 100);
		});
	}

	async _captureMap(exportModal, exportZoom) {
		const currentMapConfig = this._getMapConfig(this.currentMapKey);
		const scale = Math.pow(2, currentMapConfig.metadata.sizes.maxZoom - exportZoom);
		let canvasWidth = currentMapConfig.metadata.sizes.imageWidth / scale;
		let canvasHeight = currentMapConfig.metadata.sizes.imageHeight / scale;

		// Determine if the image is landscape or portrait
		const isLandscape = canvasWidth > canvasHeight;

		// Calculate the aspect ratio for A4 (1:√2 for portrait, √2:1 for landscape)
		const targetAspectRatio = isLandscape ? Math.sqrt(2) : 1 / Math.sqrt(2);
		const currentAspectRatio = canvasWidth / canvasHeight;

		// Adjust canvas size to match the target aspect ratio while maintaining the larger dimension
		if (isLandscape) {
			if (currentAspectRatio > targetAspectRatio) {
				// Current image is wider, adjust height
				canvasHeight = canvasWidth / targetAspectRatio;
			} else {
				// Current image is taller, adjust width
				canvasWidth = canvasHeight * targetAspectRatio;
			}
		} else {
			if (currentAspectRatio < targetAspectRatio) {
				// Current image is taller, adjust width
				canvasWidth = canvasHeight * targetAspectRatio;
			} else {
				// Current image is wider, adjust height
				canvasHeight = canvasWidth / targetAspectRatio;
			}
		}

		// Round dimensions to whole numbers
		canvasWidth = Math.round(canvasWidth);
		canvasHeight = Math.round(canvasHeight);

		const canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		const ctx = canvas.getContext('2d');

		// Fill the canvas with a background color (e.g., white)
		ctx.fillStyle = document.getElementById('map').style.background;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		const tileSize = CONFIG.TILE_SIZE;
		const tilesX = Math.ceil(currentMapConfig.metadata.sizes.imageWidth / scale / tileSize);
		const tilesY = Math.ceil(currentMapConfig.metadata.sizes.imageHeight / scale / tileSize);

		// Calculate offset to center the original content
		const offsetX = (canvasWidth - currentMapConfig.metadata.sizes.imageWidth / scale) / 2;
		const offsetY = (canvasHeight - currentMapConfig.metadata.sizes.imageHeight / scale) / 2;

		let loadedTiles = 0;
		const totalTiles = tilesX * tilesY;

		for (let y = 0; y < tilesY; y++) {
			for (let x = 0; x < tilesX; x++) {
				try {
					const tile = await this._loadTile(x, y, exportZoom, currentMapConfig.metadata.path);
					ctx.drawImage(tile, x * tileSize + offsetX, y * tileSize + offsetY);
					loadedTiles++;
					exportModal.show(`Exporting map... ${((loadedTiles / totalTiles) * 100).toFixed(1)}% complete`);
				} catch (error) {
					console.error(`Failed to load tile at x: ${x}, y: ${y}`, error);
				}
			}
		}

		// Handle markers if needed
		if (this.annotationService) {
			const markers = this.annotationService.getMarkers(this.map);
			await Promise.all(
				markers.map(async (marker, index) => {
					try {
						await this._renderCustomMarker(ctx, marker, 1 / scale, exportZoom, offsetX, offsetY);
					} catch (error) {
						console.error(`Failed to render marker ${index + 1}:`, error);
					}
				})
			);
		}

		return canvas;
	}

	async _renderCustomMarker(ctx, marker, scale = 1, exportZoom, offsetX = 0, offsetY = 0) {
		const markerLatLng = marker.getLatLng();
		const point = this.map.project(markerLatLng, exportZoom);

		const x = Math.round(point.x) + offsetX;
		const y = Math.round(point.y) + offsetY;

		const icon = marker.options.icon;

		if (icon instanceof L.DivIcon) {
			const iconElement = document.createElement('div');
			iconElement.innerHTML = icon.options.html.trim();
			const imgElement = iconElement.querySelector('img');
			const iconText = iconElement.querySelector('.custom-marker-icon');

			if (imgElement) {
				const iconImg = await this._renderDivIconToImage(icon);

				if (iconImg) {
					const iconWidth = iconImg.width * scale;
					const iconHeight = iconImg.height * scale;
					const iconX = x - (icon.options.iconAnchor ? icon.options.iconAnchor[0] * scale : iconWidth / 2);
					const iconY = y - (icon.options.iconAnchor ? icon.options.iconAnchor[1] * scale : iconHeight / 2);

					ctx.drawImage(iconImg, iconX, iconY, iconWidth, iconHeight);

					// Render text label if marker has the required class and data attribute
					const label = iconText.getAttribute('data-label');

					if (label) {
						const fontSize = Math.max(16 * scale, 8); // Minimum font size of 8px
						ctx.font = `${fontSize}pt Arial`;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'top';

						// Calculate text metrics for proper background sizing
						const textMetrics = ctx.measureText(label);
						const textHeight = fontSize * 1.2; // Approximate height based on font size
						const padding = 4 * scale;

						// Calculate background dimensions
						const bgWidth = textMetrics.width + padding * 2;
						const bgHeight = textHeight + padding * 2;

						// Calculate background position
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
				}
			}
		}
	}

	async _renderDivIconToImage(icon) {
		return new Promise((resolve, reject) => {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = icon.options.html.trim();
			const iconElement = tempDiv.querySelector('img, svg');

			if (iconElement) {
				let img = new Image();

				// Handle both absolute and relative paths
				if (iconElement.tagName.toLowerCase() === 'img') {
					const src = iconElement.src;

					// If it's a relative path, convert to absolute
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

					// Create a fallback colored rectangle as the icon
					const canvas = document.createElement('canvas');
					canvas.width = 24; // Default icon size
					canvas.height = 24;
					const ctx = canvas.getContext('2d');
					ctx.fillStyle = '#FF0000'; // Red color for visibility
					ctx.fillRect(0, 0, 24, 24);

					const fallbackImg = new Image();
					fallbackImg.src = canvas.toDataURL();
					fallbackImg.onload = () => resolve(fallbackImg);
				};
			} else {
				console.error('No icon element found');
				reject('No icon element found');
			}
		});
	}

	async _loadTile(x, y, z, path) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error(`Tile not found at ${x},${y},${z}`));
			img.src = `${path}/${z}/${x}_${y}.png`;

			// Add a timeout to prevent hanging
			setTimeout(() => reject(new Error('Tile load timeout')), 2000);
		});
	}

	_hideMapControls() {
		const controlContainers = document.querySelectorAll('.leaflet-control-container, .leaflet-control');
		controlContainers.forEach((container) => {
			container.style.display = 'none';
		});
	}

	_showMapControls() {
		const controlContainers = document.querySelectorAll('.leaflet-control-container, .leaflet-control');
		controlContainers.forEach((container) => {
			container.style.display = '';
		});
	}

	async _waitForTilesToLoad() {
		return new Promise((resolve) => {
			const checkTiles = setInterval(() => {
				if (this._allTilesLoaded()) {
					clearInterval(checkTiles);
					// Add an extra delay to ensure everything is rendered
					setTimeout(resolve, 500);
				}
			}, 100);
		});
	}

	_allTilesLoaded() {
		let allLoaded = true;
		this.map.eachLayer((layer) => {
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

	_downloadImage(canvas) {
		canvas.toBlob(
			(blob) => {
				const link = document.createElement('a');
				const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
				const mapName = this.currentMapKey || 'map';
				link.download = `${mapName}_${timestamp}.jpg`;
				link.href = URL.createObjectURL(blob);
				link.click();
				URL.revokeObjectURL(link.href);
			},
			'image/jpeg',
			0.9
		);
	}
}

// Custom Tile Layer Class
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

// Export Modal Class
class ExportModal {
	constructor() {
		this.modal = this._createModal();
	}

	_createModal() {
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
		this.modal.textContent = message;
		this.modal.style.display = 'block';
	}

	hide() {
		this.modal.style.display = 'none';
	}
}
